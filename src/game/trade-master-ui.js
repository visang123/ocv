import { getBagItemDescriptor } from "./bag-inventory.js";
import {
  cloneTradeCounter,
  getMatchingTradeRecipes,
  getTradeRecipeById,
  recipeMatchesCounter,
  subtractRecipeInputsFromCounter
} from "./trade-exchange.js";

const TRADEABLE_KEYS = new Set(["rock", "seed", "overgrowthSeed", "apple", "magicPowder"]);

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

let outsideDismissBound = false;

function isTradeExchangeKeepOpenTarget(target) {
  if (!(target instanceof Element) || !host) return false;
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
  if (host.tradeOfferList) {
    host.tradeOfferList.addEventListener("click", function (event) {
      const btn = event.target.closest(".trade-offer-item");
      if (!btn || btn.disabled) return;
      selectedRecipeId = btn.dataset.recipeId || null;
      renderTradeOffers();
      updateTradeConfirmButton();
    });
  }
  if (host.tradeCounterSlot) {
    host.tradeCounterSlot.addEventListener("click", function (event) {
      const chip = event.target.closest(".trade-counter-chip");
      if (!chip || !exchangeOpen) return;
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

export function tryTalkToTradeMaster() {
  if (!host || !isNearTradeMaster()) return false;
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
  if (key.indexOf("butterfly:") === 0) {
    if (host && host.showPlayerAlert) {
      host.showPlayerAlert({
        message:
          "\uB098\uBE44\uB294 \uAC70\uB798\uC758 \uB2EC\uC778\uC5D0\uC11C \uB9C8\uBC95\uC758 \uAC00\uB8E8\uC73C\uB85C \uAD50\uD658\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        durationMs: 2600
      });
    }
    return true;
  }
  if (!TRADEABLE_KEYS.has(key)) return true;
  addOneInventoryItemToTradeCounter(key);
  return true;
}

function addOneInventoryItemToTradeCounter(itemKey) {
  if (!host.removeOneBagItem(itemKey)) return false;
  counterByKey[itemKey] = Number(counterByKey[itemKey] || 0) + 1;
  renderTradeCounter();
  renderTradeOffers();
  if (
    selectedRecipeId &&
    !recipeMatchesCounter(counterByKey, getTradeRecipeById(selectedRecipeId))
  ) {
    selectedRecipeId = null;
  }
  updateTradeConfirmButton();
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
  if (host.removeBagItems) {
    if (!host.removeBagItems(itemKey, available)) return false;
  } else {
    for (let i = 0; i < available; i++) {
      if (!host.removeOneBagItem(itemKey)) return false;
    }
  }
  counterByKey[itemKey] = Number(counterByKey[itemKey] || 0) + available;
  renderTradeCounter();
  renderTradeOffers();
  if (
    selectedRecipeId &&
    !recipeMatchesCounter(counterByKey, getTradeRecipeById(selectedRecipeId))
  ) {
    selectedRecipeId = null;
  }
  updateTradeConfirmButton();
  host.updateBagInventorySlots();
  return true;
}

/** @param {Element | null | undefined} targetEl */
export function tryDropBagItemOnTradeCounter(itemKey, targetEl) {
  if (!itemKey || !exchangeOpen || !host || !host.tradeCounterSlot) return false;
  if (!(targetEl instanceof Element)) return false;
  if (!host.tradeCounterSlot.contains(targetEl) && targetEl !== host.tradeCounterSlot) {
    return false;
  }
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
  const hoverShift = host.getWorldNpcPromptBubbleExtraShiftWorld
    ? host.getWorldNpcPromptBubbleExtraShiftWorld(host.tradeMaster)
    : 0;
  const bubbleWorldY =
    host.speechBubbleTopWorldYFromHead(
      headTop,
      host.tradeMasterBubble,
      host.NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    ) -
    host.NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD -
    hoverShift;
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
  renderTradeOffers();
  updateTradeConfirmButton();
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
  renderTradeCounter();
  renderTradeOffers();
  if (
    selectedRecipeId &&
    !recipeMatchesCounter(counterByKey, getTradeRecipeById(selectedRecipeId))
  ) {
    selectedRecipeId = null;
  }
  updateTradeConfirmButton();
  host.updateBagInventorySlots();
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
  const matches = getMatchingTradeRecipes(counterByKey);
  if (!matches.length) {
    host.tradeOfferList.innerHTML =
      '<li class="trade-offer-empty">\uad50\ud658 \uac00\ub2a5\ud55c \ubb3c\uac74\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.</li>';
    return;
  }
  host.tradeOfferList.innerHTML = matches
    .map(function (recipe) {
      const inputs = Object.keys(recipe.inputs)
        .map(function (k) {
          return getBagItemDescriptor(k).label + " " + recipe.inputs[k];
        })
        .join(" + ");
      const selected = recipe.id === selectedRecipeId ? " is-selected" : "";
      return (
        '<li><button type="button" class="trade-offer-item' +
        selected +
        '" data-recipe-id="' +
        recipe.id +
        '">' +
        inputs +
        " \u2192 " +
        recipe.label +
        "</button></li>"
      );
    })
    .join("");
}

function updateTradeConfirmButton() {
  if (!host.tradeExchangeConfirm) return;
  const recipe = getTradeRecipeById(selectedRecipeId);
  const ok = Boolean(recipe && recipeMatchesCounter(counterByKey, recipe));
  host.tradeExchangeConfirm.disabled = !ok;
}

function confirmSelectedTrade() {
  const recipe = getTradeRecipeById(selectedRecipeId);
  if (!recipe || !recipeMatchesCounter(counterByKey, recipe)) return;
  if (host.canAddBagItems && !host.canAddBagItems(recipe.outputs)) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return;
  }
  counterByKey = subtractRecipeInputsFromCounter(counterByKey, recipe);
  Object.keys(recipe.outputs).forEach(function (key) {
    host.addBagItems(key, Number(recipe.outputs[key] || 0));
  });
  selectedRecipeId = null;
  renderTradeCounter();
  renderTradeOffers();
  updateTradeConfirmButton();
  host.updateBagInventorySlots();
  host.saveAppleState();
  host.markWorldDirty();
}
Key, recipe);
  Object.keys(recipe.outputs).forEach(function (key) {
    host.addBagItems(key, Number(recipe.outputs[key] || 0));
  });
  selectedRecipeId = null;
  renderTradeCounter();
  renderTradeOffers();
  updateTradeConfirmButton();
  host.updateBagInventorySlots();
  host.saveAppleState();
  host.markWorldDirty();
}
