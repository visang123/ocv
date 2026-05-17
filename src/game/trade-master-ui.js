import { getBagItemDescriptor } from "./bag-inventory.js";
import { isBagDiscardOverlayInteractionTarget } from "./bag-discard-ui.js";
import {
  cloneTradeCounter,
  expandTradeItemCounts,
  formatTradeRecipePseudoLabel,
  getMatchingRecipesForCatalogEntry,
  getTradeCatalogEntries,
  getTradeRecipeById,
  getRecipeTradeBatchCount,
  recipeMatchesCounter,
  scaleTradeItemCounts,
  subtractRecipeInputsFromCounter,
  TRADE_BUTTERFLY_ITEM_KEYS,
  TRADE_INPUT_ANY_BUTTERFLY
} from "./trade-exchange.js";

const TRADEABLE_ITEM_KEYS = [
  "rock",
  "seed",
  "overgrowthSeed",
  "apple",
  "magicPowder",
  "magicPowderYellow",
  "magicPowderWhite",
  "magicPowderBrown",
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
];

const TRADEABLE_KEYS = new Set(TRADEABLE_ITEM_KEYS);

/** Catalog preview order for butterfly:any alternatives (white → yellow → brown). */
const TRADE_BUTTERFLY_OR_DISPLAY_KEYS = [
  "butterfly:white",
  "butterfly:yellow",
  "butterfly:brown"
];

/** @type {Record<string, any>} */
let host = null;

let running = false;
let complete = false;
let promptHideTimeout = null;
let exchangeOpen = false;
/** @type {number[]} */
let dialogueTimeoutIds = [];
let dialogueStartedAt = 0;
/** @type {Record<string, number>} */
let counterByKey = {};
let selectedRecipeId = null;
let pendingTradeRecipeReveal = false;

let outsideDismissBound = false;

function isTradeExchangeKeepOpenTarget(target) {
  if (!(target instanceof Element) || !host) return false;
  if (isBagDiscardOverlayInteractionTarget(target)) return true;
  const panel = host.tradeExchangeOverlay
    ? host.tradeExchangeOverlay.querySelector(".trade-exchange-panel")
    : null;
  if (panel && panel.contains(target)) return true;
  if (host.bagInventoryPanel && host.bagInventoryPanel.contains(target)) return true;
  if (host.worldBagInventory && host.worldBagInventory.contains(target)) return true;
  return false;
}

function onTradeExchangeOutsidePointer(event) {
  if (!exchangeOpen) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (isTradeExchangeKeepOpenTarget(target)) return;
  closeTradeExchangePanel();
}

function bindTradeExchangeOutsideDismiss() {
  if (outsideDismissBound) return;
  outsideDismissBound = true;
  document.addEventListener("pointerdown", onTradeExchangeOutsidePointer, true);
}

function clearTradeDialogueTimeouts() {
  dialogueTimeoutIds.forEach(function (id) {
    window.clearTimeout(id);
  });
  dialogueTimeoutIds = [];
}

function scheduleTradeDialogueTimeout(fn, delayMs) {
  const id = window.setTimeout(fn, delayMs);
  dialogueTimeoutIds.push(id);
  return id;
}

function isTradeExchangeOverlayVisible() {
  return Boolean(
    host &&
      host.tradeExchangeOverlay &&
      host.tradeExchangeOverlay.style.display === "block"
  );
}

function reconcileTradeExchangeOpenState() {
  if (!exchangeOpen) return;
  if (!isTradeExchangeOverlayVisible()) {
    returnCounterItemsToInventory();
    exchangeOpen = false;
    selectedRecipeId = null;
    counterByKey = {};
    if (host) {
      if (host.worldBagInventory) {
        host.worldBagInventory.classList.remove("is-trade-exchange-focus");
      }
      if (host.bagInventoryPanel) {
        host.bagInventoryPanel.classList.remove("is-trade-exchange-focus");
      }
    }
  }
}

function abortTradeMasterDialogue() {
  if (!running) return;
  clearTradeDialogueTimeouts();
  running = false;
  if (host && host.tradeMasterBubble) {
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
  }
  window.clearTimeout(promptHideTimeout);
}

/** 체력 0 — 진행 중인 거래 대화·교환 패널 중도 취소(교환대 아이템은 가방으로 반환) */
export function cancelTradeOnPlayerHealthDepleted() {
  abortTradeMasterDialogue();
  if (exchangeOpen) {
    closeTradeExchangePanel({ keepInventory: true });
  }
}

export function resetTradeMasterDialogueIfStuck() {
  if (!running) return;
  if (Date.now() - dialogueStartedAt < 12000) return;
  abortTradeMasterDialogue();
}

export function bindTradeMaster(h) {
  host = h;
  bindTradeExchangeOutsideDismiss();
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        abortTradeMasterDialogue();
        return;
      }
      resetTradeMasterDialogueIfStuck();
      reconcileTradeExchangeOpenState();
    });
  }
  if (host.tradeExchangeClose) {
    host.tradeExchangeClose.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeTradeExchangePanel();
    });
  }
  if (host.tradeExchangeConfirm) {
    host.tradeExchangeConfirm.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      confirmSelectedTrade();
    });
  }
  if (host.tradeTradeableList) {
    host.tradeTradeableList.addEventListener("click", function (event) {
      const btn = event.target.closest(".trade-tradeable-recipe.is-available");
      if (!btn || btn.disabled) return;
      const recipeId = btn.dataset.recipeId || "";
      if (!recipeId) return;
      event.preventDefault();
      event.stopPropagation();
      selectedRecipeId = recipeId;
      refreshTradeExchangeUi();
    });
  }
  if (host.tradeCounterSlot) {
    host.tradeCounterSlot.addEventListener("click", function (event) {
      const chip = event.target.closest(".trade-counter-chip");
      if (!chip || !exchangeOpen) return;
      if (host.consumeCraftTradeDragClickSuppress && host.consumeCraftTradeDragClickSuppress()) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      returnOneTradeCounterItemToInventory(chip.dataset.itemKey || "");
    });
  }
}

export function hydrateTradeMasterDialogueComplete(flag) {
  complete = Boolean(flag);
  if (complete || !host || !host.tradeMasterBubble) return;
  host.tradeMasterBubble.dataset.promptShown = "false";
  host.tradeMasterBubble.style.display = "none";
  window.clearTimeout(promptHideTimeout);
}

export function isTradeMasterDialogueComplete() {
  return complete;
}

export function isTradeMasterDialogueRunning() {
  return running;
}

export function isTradeExchangeOpen() {
  return exchangeOpen;
}

export function isNearTradeMaster() {
  if (!host || !host.isTradeMasterVisible()) return false;
  return (
    host.getCenterDistance(
      host.TRADE_MASTER_START_X,
      host.TRADE_MASTER_START_Y,
      host.NPC_WIDTH,
      host.NPC_HEIGHT
    ) < host.npcInteractDistance
  );
}

function isBagInventoryGameplayBlocked() {
  return Boolean(
    host && host.canUseBagInventoryGameplay && !host.canUseBagInventoryGameplay()
  );
}

function showBagInventoryGameplayRequiredAlert() {
  if (!host || !host.showPlayerAlert) return;
  host.showPlayerAlert({
    message: "\uBA3C\uC800 \uAC00\uBC29\uC744 \uC8FC\uC6CC\uC57C \uD574\uC694.",
    durationMs: 2200
  });
}

export function tryTalkToTradeMaster() {
  if (!host || !isNearTradeMaster()) return false;
  if (isBagInventoryGameplayBlocked()) {
    showBagInventoryGameplayRequiredAlert();
    return true;
  }
  reconcileTradeExchangeOpenState();
  if (running) return true;
  if (!complete) {
    startTradeMasterDialogue();
    return true;
  }
  if (exchangeOpen) {
    closeTradeExchangePanel();
    return true;
  }
  openTradeExchangePanel();
  return true;
}

export function updateTradeNpcPrompt() {
  if (!host || !host.tradeMasterBubble) return;
  if (exchangeOpen) {
    if (!isNearTradeMaster()) {
      closeTradeExchangePanel();
    }
    return;
  }
  if (
    running ||
    (host.isNpcDialogueRunning && host.isNpcDialogueRunning()) ||
    (host.isAlchemyMasterDialogueRunning && host.isAlchemyMasterDialogueRunning()) ||
    (host.isAlchemyCraftOpen && host.isAlchemyCraftOpen())
  ) {
    return;
  }

  if (isNearTradeMaster()) {
    const promptText = complete
      ? "\uBB3C\uAC74\uC740 \uAC00\uC838\uC654\uB098?!\n(q\uB97C \uB20C\uB7EC \uAC70\uB798)"
      : "\uBC18\uAC11\uB124 \uC774\uBC29\uC778\uC774\uC5EC";
    if (!complete) {
      if (host.tradeMasterBubble.dataset.promptShown === "true") return;
      host.tradeMasterBubble.dataset.promptShown = "true";
    }
    host.tradeMasterBubble.textContent = promptText;
    host.tradeMasterBubble.style.display = "block";
    layoutTradeSpeechBubble();
    window.clearTimeout(promptHideTimeout);
    if (!complete) {
      promptHideTimeout = window.setTimeout(function () {
        if (!running && host.tradeMasterBubble && !complete) {
          host.tradeMasterBubble.style.display = "none";
        }
      }, 5000);
    }
    return;
  }

  if (host.tradeMasterBubble.style.display === "block" && !running) {
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
    window.clearTimeout(promptHideTimeout);
  }
}

/** @type {{ el: Element, name: string } | null} */
let stickyWorldNpcHover = null;

const NPC_HOVER_PICK_PAD_X = 14;
const NPC_HOVER_PICK_PAD_BOTTOM = 10;
/** 이름 라벨이 NPC 위에 뜨므로, 위쪽으로 넓혀 마우스를 올려도 호버가 끊기지 않게 */
const NPC_HOVER_PICK_PAD_TOP = 52;

function getNpcHoverPickRect(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left - NPC_HOVER_PICK_PAD_X,
    right: rect.right + NPC_HOVER_PICK_PAD_X,
    top: rect.top - NPC_HOVER_PICK_PAD_TOP,
    bottom: rect.bottom + NPC_HOVER_PICK_PAD_BOTTOM
  };
}

function pointInNpcHoverPickRect(clientX, clientY, el) {
  const r = getNpcHoverPickRect(el);
  return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
}

export function clearWorldNpcHoverSticky() {
  stickyWorldNpcHover = null;
}

export function pickWorldNpcHover(clientX, clientY) {
  if (!host) return null;
  const list = [
    { el: host.plantMaster, name: "\uC2DD\uBB3C\uC758 \uB2EC\uC778", visible: host.isPlantMasterVisible },
    { el: host.tradeMaster, name: "\uAC70\uB798\uC758 \uB2EC\uC778", visible: host.isTradeMasterVisible },
    { el: host.alchemyMaster, name: "\uC5F0\uAE08\uC220\uC758 \uB2EC\uC778", visible: host.isAlchemyMasterVisible }
  ];

  if (
    stickyWorldNpcHover &&
    stickyWorldNpcHover.el &&
    stickyWorldNpcHover.el.isConnected &&
    stickyWorldNpcHover.el.style.display !== "none" &&
    pointInNpcHoverPickRect(clientX, clientY, stickyWorldNpcHover.el)
  ) {
    return { name: stickyWorldNpcHover.name, anchorEl: stickyWorldNpcHover.el };
  }

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    if (!entry.el || !entry.visible()) continue;
    if (entry.el.style.display === "none") continue;
    if (pointInNpcHoverPickRect(clientX, clientY, entry.el)) {
      stickyWorldNpcHover = { el: entry.el, name: entry.name };
      return { name: entry.name, anchorEl: entry.el };
    }
  }
  stickyWorldNpcHover = null;
  return null;
}

export function handleBagSlotClickWhileTradeOpen(slotEl) {
  if (!exchangeOpen || !slotEl) return true;
  if (slotEl.classList.contains("is-empty")) return true;
  const key = bagSlotToItemKey(slotEl);
  if (!key) return true;
  if (!TRADEABLE_KEYS.has(key)) return true;
  addOneInventoryItemToTradeCounter(key);
  return true;
}

function addOneInventoryItemToTradeCounter(itemKey) {
  const before = cloneTradeCounter(counterByKey);
  if (!host.removeOneBagItem(itemKey)) return false;
  counterByKey[itemKey] = Number(counterByKey[itemKey] || 0) + 1;
  pendingTradeRecipeReveal = didCounterGainCatalogMatch(before, counterByKey);
  renderTradeCounter();
  refreshTradeExchangeUi();
  return true;
}

/** @param {string} itemKey */
export function addFullInventoryStackToTradeCounter(itemKey) {
  if (!host || !exchangeOpen || !itemKey) return false;
  if (!TRADEABLE_KEYS.has(itemKey)) return false;
  const available = host.getBagItemCount
    ? Math.max(0, Math.floor(Number(host.getBagItemCount(itemKey)) || 0))
    : 0;
  if (available <= 0) return false;
  const before = cloneTradeCounter(counterByKey);
  if (host.removeBagItems) {
    if (!host.removeBagItems(itemKey, available)) return false;
  } else {
    for (let i = 0; i < available; i++) {
      if (!host.removeOneBagItem(itemKey)) return false;
    }
  }
  counterByKey[itemKey] = Number(counterByKey[itemKey] || 0) + available;
  pendingTradeRecipeReveal = didCounterGainCatalogMatch(before, counterByKey);
  renderTradeCounter();
  refreshTradeExchangeUi();
  host.updateBagInventorySlots();
  return true;
}

/** @param {Record<string, number>} counter */
function countMatchedCatalogEntries(counter) {
  let count = 0;
  getTradeCatalogEntries().forEach(function (entry) {
    if (getMatchingRecipesForCatalogEntry(entry, counter).length > 0) count += 1;
  });
  return count;
}

/** @param {Record<string, number>} before @param {Record<string, number>} after */
function didCounterGainCatalogMatch(before, after) {
  return countMatchedCatalogEntries(after) > countMatchedCatalogEntries(before);
}

function revealTradeExchangeAfterRecipeMatched() {
  if (!host) return;
  window.requestAnimationFrame(function () {
    const list = host.tradeTradeableList;
    if (!list) return;
    list.scrollTop = 0;
    const firstAvailable = list.querySelector(".trade-tradeable-recipe.is-available");
    if (firstAvailable && typeof firstAvailable.scrollIntoView === "function") {
      firstAvailable.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

function getTradeExchangePanelEl() {
  if (!host || !host.tradeExchangeOverlay) return null;
  return host.tradeExchangeOverlay.querySelector(".trade-exchange-panel");
}

/** @param {Element | null | undefined} targetEl */
export function tryDropBagItemOnTradeCounter(itemKey, targetEl) {
  if (!itemKey || !exchangeOpen || !host) return false;
  if (!(targetEl instanceof Element)) return false;
  const counter = host.tradeCounterSlot;
  if (!counter) return false;
  const chip = targetEl.closest(".trade-counter-chip");
  if (chip && counter.contains(chip)) {
    const slotKey = chip.dataset.itemKey || "";
    if (slotKey !== itemKey) return false;
    return addFullInventoryStackToTradeCounter(itemKey);
  }
  if (!counter.contains(targetEl) && targetEl !== counter) return false;
  return addFullInventoryStackToTradeCounter(itemKey);
}

export function canDragBagItemToTradeCounter(itemKey) {
  if (!exchangeOpen || !itemKey) return false;
  return TRADEABLE_KEYS.has(itemKey);
}

function bagSlotToItemKey(slotEl) {
  const kind = slotEl.dataset.bagType;
  if (!kind || kind === "empty" || kind === "book") return null;
  if (kind === "butterfly") {
    const color = slotEl.dataset.butterflyColor;
    return color ? "butterfly:" + color : null;
  }
  return kind;
}

export function relayoutTradeMasterSpeechBubble() {
  layoutTradeSpeechBubble();
}

function layoutTradeSpeechBubble() {
  if (!host || !host.tradeMasterBubble) return;
  const bubble = host.tradeMasterBubble;
  bubble.style.width = "";
  void bubble.offsetWidth;
  const bubbleWidth = bubble.offsetWidth || bubble.scrollWidth || 48;
  const headTop = host.getNpcHeadTopWorldY
    ? host.getNpcHeadTopWorldY(host.TRADE_MASTER_START_Y)
    : host.TRADE_MASTER_START_Y + host.NPC_HEAD_TOP_TRIM_WORLD;
  const bubbleWorldY =
    host.speechBubbleTopWorldYFromHead(
      headTop,
      host.tradeMasterBubble,
      host.NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    ) -
    host.NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  host.setSpeechBubbleTransform(
    host.tradeMasterBubble,
    host.TRADE_MASTER_START_X + host.NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
}

function startTradeMasterDialogue() {
  if (!host) return;
  clearTradeDialogueTimeouts();
  const lines = [
    { text: "\uB098\uB294 \uAC70\uB798\uB97C \uC88B\uC544\uD55C\uB2E4\uB124.", delayAfterMs: 2000 },
    {
      text: "\uBB3C\uAC74\uC744 \uC900\uB2E4\uBA74 \uD569\uB2F9\uD55C \uAD50\uD658\uC744 \uD558\uACA0\uB124",
      delayAfterMs: 2000
    }
  ];
  running = true;
  dialogueStartedAt = Date.now();
  host.tradeMasterBubble.style.display = "none";
  window.clearTimeout(promptHideTimeout);
  let timelineMs = 0;
  lines.forEach(function (line) {
    scheduleTradeDialogueTimeout(function () {
      if (!running) return;
      host.tradeMasterBubble.textContent = line.text;
      host.tradeMasterBubble.style.display = "block";
      layoutTradeSpeechBubble();
    }, timelineMs);
    timelineMs += Math.max(0, Number(line.delayAfterMs) || 650);
  });
  scheduleTradeDialogueTimeout(function () {
    clearTradeDialogueTimeouts();
    running = false;
    complete = true;
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
    host.setStoredFlag(host.tradeMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
    if (typeof host.onFirstDialogueComplete === "function") {
      host.onFirstDialogueComplete();
    }
  }, timelineMs + 200);
  scheduleTradeDialogueTimeout(function () {
    if (!running) return;
    clearTradeDialogueTimeouts();
    running = false;
    complete = true;
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
    host.setStoredFlag(host.tradeMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
    if (typeof host.onFirstDialogueComplete === "function") {
      host.onFirstDialogueComplete();
    }
  }, timelineMs + 8000);
}

export function openTradeExchangePanel() {
  if (!host || !complete) return;
  if (isBagInventoryGameplayBlocked()) {
    showBagInventoryGameplayRequiredAlert();
    return;
  }
  reconcileTradeExchangeOpenState();
  if (exchangeOpen) return;
  if (host.isAlchemyCraftOpen && host.isAlchemyCraftOpen()) {
    if (host.closeAlchemyCraftPanel) host.closeAlchemyCraftPanel();
  }
  exchangeOpen = true;
  selectedRecipeId = null;
  counterByKey = {};
  if (host.tradeExchangeOverlay) {
    host.tradeExchangeOverlay.style.display = "block";
    host.tradeExchangeOverlay.setAttribute("aria-hidden", "false");
  }
  host.setBagInventoryPanelOpen(true);
  host.updateBagInventorySlots();
  if (host.worldBagInventory) host.worldBagInventory.classList.add("is-trade-exchange-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.add("is-trade-exchange-focus");
  renderTradeCounter();
  refreshTradeExchangeUi();
}

export function closeTradeExchangePanel(options) {
  if (!host) return;
  const keepInventory = Boolean(options && options.keepInventory);
  returnCounterItemsToInventory();
  exchangeOpen = false;
  selectedRecipeId = null;
  counterByKey = {};
  if (host.tradeExchangeOverlay) {
    host.tradeExchangeOverlay.style.display = "none";
    host.tradeExchangeOverlay.setAttribute("aria-hidden", "true");
  }
  if (host.worldBagInventory) host.worldBagInventory.classList.remove("is-trade-exchange-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.remove("is-trade-exchange-focus");
  if (!keepInventory) host.setBagInventoryPanelOpen(false);
  renderTradeTradeableList();
  renderTradeCounter();
  renderTradeOffers();
}

function returnCounterItemsToInventory() {
  if (!host) return;
  Object.keys(counterByKey).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(counterByKey[key]) || 0));
    if (n > 0) host.addBagItems(key, n);
  });
  if (host.updateBagInventorySlots) host.updateBagInventorySlots();
  if (host.saveAppleState) host.saveAppleState();
}


function returnOneTradeCounterItemToInventory(itemKey) {
  if (!itemKey) return;
  const n = Math.max(0, Math.floor(Number(counterByKey[itemKey]) || 0));
  if (n <= 0) return;
  counterByKey[itemKey] = n - 1;
  if (counterByKey[itemKey] <= 0) delete counterByKey[itemKey];
  host.addBagItems(itemKey, 1);
  afterTradeCounterInventoryChanged();
}

function afterTradeCounterInventoryChanged() {
  renderTradeCounter();
  refreshTradeExchangeUi();
  host.updateBagInventorySlots();
}

/** @param {string} itemKey */
export function returnTradeCounterStackToInventory(itemKey) {
  if (!host || !exchangeOpen || !itemKey) return false;
  const n = Math.max(0, Math.floor(Number(counterByKey[itemKey]) || 0));
  if (n <= 0) return false;
  if (host.canAddBagItems && !host.canAddBagItems({ [itemKey]: n })) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return false;
  }
  delete counterByKey[itemKey];
  host.addBagItems(itemKey, n);
  afterTradeCounterInventoryChanged();
  if (host.saveAppleState) host.saveAppleState();
  return true;
}

/** Replace butterfly:any with colors actually on the trade counter for display. */
function resolveTradeRecipeDisplaySide(side, counter) {
  const resolved = Object.assign({}, side || {});
  const need = Math.max(0, Math.floor(Number(resolved[TRADE_INPUT_ANY_BUTTERFLY]) || 0));
  if (need <= 0) {
    delete resolved[TRADE_INPUT_ANY_BUTTERFLY];
    return resolved;
  }
  const hasOnCounter = TRADE_BUTTERFLY_ITEM_KEYS.some(function (bfKey) {
    return Math.max(0, Math.floor(Number(counter[bfKey]) || 0)) > 0;
  });
  if (!hasOnCounter) return resolved;
  delete resolved[TRADE_INPUT_ANY_BUTTERFLY];
  let remaining = need;
  TRADE_BUTTERFLY_ITEM_KEYS.forEach(function (bfKey) {
    if (remaining <= 0) return;
    const have = Math.max(0, Math.floor(Number(counter[bfKey]) || 0));
    if (have <= 0) return;
    const show = Math.min(have, remaining);
    resolved[bfKey] = (Number(resolved[bfKey]) || 0) + show;
    remaining -= show;
  });
  if (remaining > 0) resolved[TRADE_INPUT_ANY_BUTTERFLY] = remaining;
  return resolved;
}

function escapeTradeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {string} itemKey @param {number} count */
function getTradeRecipeItemLabel(itemKey, count) {
  const pseudo = formatTradeRecipePseudoLabel(itemKey, count);
  if (pseudo) return pseudo;
  return getBagItemDescriptor(itemKey).label;
}

/** @param {string} itemKey @param {number} count */
function formatTradeRecipeItemPhrase(itemKey, count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return "";
  const pseudo = formatTradeRecipePseudoLabel(itemKey, n);
  if (pseudo) return pseudo;
  const label = getBagItemDescriptor(itemKey).label;
  return n > 1 ? label + " \u00D7" + n : label;
}

/** @param {number} countPerColor */
function formatTradeButterflyAnyOrPhrase(countPerColor) {
  const n = Math.max(0, Math.floor(Number(countPerColor) || 0));
  if (n <= 0) return "";
  return formatTradeRecipePseudoLabel(TRADE_INPUT_ANY_BUTTERFLY, n) || "";
}

/** @param {Record<string, number>} side @param {Record<string, number>} counter @param {boolean} expandButterflyAny */
function formatTradeRecipeSideText(side, counter, expandButterflyAny) {
  const displaySide = expandButterflyAny
    ? expandTradeItemCounts(side || {})
    : resolveTradeRecipeDisplaySide(side || {}, counter || {});
  const keys = sortTradeRecipeDisplayKeys(Object.keys(displaySide));
  const parts = [];
  keys.forEach(function (itemKey) {
    const count = Math.max(0, Math.floor(Number(displaySide[itemKey]) || 0));
    if (count <= 0) return;
    if (itemKey === TRADE_INPUT_ANY_BUTTERFLY) {
      parts.push(formatTradeButterflyAnyOrPhrase(count));
      return;
    }
    parts.push(formatTradeRecipeItemPhrase(itemKey, count));
  });
  return parts.join(" + ");
}

/** @param {string} itemKey @param {number} count */
function buildTradeRecipeIoChipHtml(itemKey, count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n <= 0) return "";
  const desc = getBagItemDescriptor(itemKey);
  const label = getTradeRecipeItemLabel(itemKey, n);
  return (
    '<span class="trade-recipe-io" title="' +
    escapeTradeHtml(label) +
    '">' +
    desc.iconHtml +
    (n > 1 ? '<span class="trade-recipe-io-count">×' + n + "</span>" : "") +
    "</span>"
  );
}

/** @param {number} countPerColor */
function buildTradeButterflyAnyOrOptionsHtml(countPerColor) {
  const n = Math.max(0, Math.floor(Number(countPerColor) || 0));
  if (n <= 0) return "";
  const title = TRADE_BUTTERFLY_OR_DISPLAY_KEYS.map(function (bfKey) {
    const desc = getBagItemDescriptor(bfKey);
    return desc.label + " \u00D7" + n;
  }).join(" or ");
  const parts = [];
  TRADE_BUTTERFLY_OR_DISPLAY_KEYS.forEach(function (bfKey, index) {
    if (index > 0) {
      parts.push('<span class="trade-recipe-or-sep" aria-hidden="true">or</span>');
    }
    parts.push(buildTradeRecipeIoChipHtml(bfKey, n));
  });
  return (
    '<span class="trade-recipe-or-options" title="' +
    title +
    '">' +
    parts.join("") +
    "</span>"
  );
}

/** @param {Record<string, number>} side @param {{ expandButterflyAny?: boolean }} [options] */
function buildTradeRecipeSideIconsHtml(side, options) {
  const expandButterflyAny = Boolean(options && options.expandButterflyAny);
  const displaySide = expandButterflyAny ? expandTradeItemCounts(side || {}) : side || {};
  const keys = sortTradeRecipeDisplayKeys(Object.keys(displaySide));
  if (!keys.length) return "";
  return keys
    .map(function (itemKey) {
      const count = Math.max(0, Math.floor(Number(displaySide[itemKey]) || 0));
      if (count <= 0) return "";
      if (itemKey === TRADE_INPUT_ANY_BUTTERFLY) {
        return buildTradeButterflyAnyOrOptionsHtml(count);
      }
      return buildTradeRecipeIoChipHtml(itemKey, count);
    })
    .join("");
}

/** @param {string[]} keys */
function sortTradeRecipeDisplayKeys(keys) {
  return keys.slice().sort(function (a, b) {
    const aBf = TRADE_BUTTERFLY_ITEM_KEYS.indexOf(a);
    const bBf = TRADE_BUTTERFLY_ITEM_KEYS.indexOf(b);
    if (aBf >= 0 && bBf >= 0) return aBf - bBf;
    if (aBf >= 0) return 1;
    if (bBf >= 0) return -1;
    return a.localeCompare(b);
  });
}

function buildTradeRecipeFlowHtml(inputs, outputs, arrowSymbol, counter) {
  const c = counter || {};
  const inputText = formatTradeRecipeSideText(inputs, c, false);
  const outputText = formatTradeRecipeSideText(outputs, c, true);
  const formulaText = [inputText, outputText].filter(Boolean).join(" " + arrowSymbol + " ");
  return (
    '<p class="trade-recipe-formula-text">' + escapeTradeHtml(formulaText) + "</p>"
  );
}

/** @param {{ oneWay?: boolean }} entry @param {{ oneWay?: boolean } | null | undefined} activeRecipe @param {number} batchCount */
function getTradePreviewArrow(entry, activeRecipe, batchCount) {
  if (activeRecipe && batchCount > 0) return "→";
  if (entry.oneWay || (activeRecipe && activeRecipe.oneWay)) return "→";
  return "↔";
}

function pruneInvalidTradeSelection() {
  if (!selectedRecipeId) return;
  const recipe = getTradeRecipeById(selectedRecipeId);
  if (!recipe || !recipeMatchesCounter(counterByKey, recipe)) {
    selectedRecipeId = null;
  }
}

function refreshTradeExchangeUi() {
  pruneInvalidTradeSelection();
  renderTradeTradeableList();
  renderTradeOffers();
  updateTradeConfirmButton();
  if (pendingTradeRecipeReveal) {
    pendingTradeRecipeReveal = false;
    revealTradeExchangeAfterRecipeMatched();
  }
}

function renderTradeTradeableList() {
  if (!host.tradeTradeableList) return;
  const catalog = getTradeCatalogEntries().slice().sort(function (a, b) {
    const aAvailable =
      getMatchingRecipesForCatalogEntry(a, counterByKey).length > 0;
    const bAvailable =
      getMatchingRecipesForCatalogEntry(b, counterByKey).length > 0;
    if (aAvailable === bAvailable) return 0;
    return aAvailable ? -1 : 1;
  });
  host.tradeTradeableList.innerHTML = catalog
    .map(function (entry) {
      const entryMatches = getMatchingRecipesForCatalogEntry(entry, counterByKey);
      const isAvailable = entryMatches.length > 0;
      const activeRecipe = isAvailable
        ? entryMatches.find(function (r) {
            return r.id === selectedRecipeId;
          }) || entryMatches[0]
        : null;
      const recipeId = activeRecipe ? activeRecipe.id : "";
      const isSelected = Boolean(recipeId && selectedRecipeId === recipeId);
      const classNames = ["trade-tradeable-recipe"];
      if (isAvailable) classNames.push("is-available");
      if (isSelected) classNames.push("is-selected");
      const batchCount = activeRecipe
        ? getRecipeTradeBatchCount(counterByKey, activeRecipe)
        : 0;
      const previewArrow = getTradePreviewArrow(entry, activeRecipe, batchCount);
      const flow =
        activeRecipe && batchCount > 0
          ? buildTradeRecipeFlowHtml(
              scaleTradeItemCounts(activeRecipe.inputs, batchCount),
              scaleTradeItemCounts(activeRecipe.outputs, batchCount),
              "→",
              counterByKey
            )
          : buildTradeRecipeFlowHtml(entry.inputs, entry.outputs, previewArrow, counterByKey);
      if (isAvailable) {
        return (
          '<button type="button" class="' +
          classNames.join(" ") +
          '" data-recipe-id="' +
          recipeId +
          '" aria-pressed="' +
          (isSelected ? "true" : "false") +
          '" aria-label="' +
          escapeTradeHtml(entry.label) +
          '">' +
          flow +
          "</button>"
        );
      }
      return '<div class="' + classNames.join(" ") + '">' + flow + "</div>";
    })
    .join("");
}

function renderTradeCounter() {
  if (!host.tradeCounterSlot) return;
  const keys = Object.keys(counterByKey).filter(function (k) {
    return Number(counterByKey[k] || 0) > 0;
  });
  host.tradeCounterSlot.classList.toggle("is-empty", keys.length === 0);
  if (!keys.length) {
    host.tradeCounterSlot.innerHTML = "";
    return;
  }
  host.tradeCounterSlot.innerHTML = keys
    .map(function (key) {
      const desc = getBagItemDescriptor(key);
      const count = Number(counterByKey[key] || 0);
      return (
        '<div class="trade-counter-chip" data-item-key="' +
        key +
        '">' +
        desc.iconHtml +
        '<span class="trade-counter-chip-count">' +
        count +
        "</span></div>"
      );
    })
    .join("");
}

function renderTradeOffers() {
  if (!host.tradeOfferList) return;
  host.tradeOfferList.innerHTML = "";
}

function updateTradeConfirmButton() {
  if (!host.tradeExchangeConfirm) return;
  const recipe = getTradeRecipeById(selectedRecipeId);
  const batchCount = recipe ? getRecipeTradeBatchCount(counterByKey, recipe) : 0;
  const ok = batchCount >= 1;
  host.tradeExchangeConfirm.disabled = !ok;
  host.tradeExchangeConfirm.textContent =
    batchCount > 1 ? "\uAD50\uD658 \u00D7" + batchCount : "\uAD50\uD658";
}

function confirmSelectedTrade() {
  const recipe = getTradeRecipeById(selectedRecipeId);
  const batchCount = recipe ? getRecipeTradeBatchCount(counterByKey, recipe) : 0;
  if (!recipe || batchCount < 1) return;
  const expandedOutputs = expandTradeItemCounts(
    scaleTradeItemCounts(recipe.outputs, batchCount)
  );
  if (host.canAddBagItems && !host.canAddBagItems(expandedOutputs)) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return;
  }
  counterByKey = subtractRecipeInputsFromCounter(counterByKey, recipe, batchCount);
  Object.keys(expandedOutputs).forEach(function (key) {
    host.addBagItems(key, Number(expandedOutputs[key] || 0));
  });
  selectedRecipeId = null;
  renderTradeCounter();
  refreshTradeExchangeUi();
  host.updateBagInventorySlots();
  host.saveAppleState();
  host.markWorldDirty();
  if (typeof host.syncWorldState === "function") {
    host.syncWorldState(true);
  }
}
