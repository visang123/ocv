import { getBagItemDescriptor } from "./bag-inventory.js";
import { isBagDiscardOverlayInteractionTarget } from "./bag-discard-ui.js";
import {
  TRADE_ITEM_BUY_PRICE_KRW,
  TRADE_ITEM_SELL_PRICE_KRW,
  formatPlayerMoneyKrw,
  getTradeItemUnitPriceKrw,
  sumTradeItemCountsValueKrw
} from "./player-money.js";

const SELLABLE_ITEM_KEYS = Object.keys(TRADE_ITEM_SELL_PRICE_KRW);
const SELLABLE_KEYS = new Set(SELLABLE_ITEM_KEYS);

const TRADE_BUY_CATALOG_ORDER = [
  "worldBucket",
  "apple",
  "rock",
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
].filter(function (key) {
  return TRADE_ITEM_BUY_PRICE_KRW[key] != null;
});

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
let sellCounterByKey = {};
/** @type {Record<string, number>} */
let buyCartByKey = {};

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
    returnSellCounterItemsToInventory();
    exchangeOpen = false;
    sellCounterByKey = {};
    buyCartByKey = {};
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

/** 체력 0 — 진행 중인 거래 대화·상점 패널 중도 취소(판매대 아이템은 가방으로 반환) */
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
  if (host.tradeBuyConfirm) {
    host.tradeBuyConfirm.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      confirmTradeBuy();
    });
  }
  if (host.tradeSellConfirm) {
    host.tradeSellConfirm.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      confirmTradeSell();
    });
  }
  if (host.tradeBuyCatalog) {
    host.tradeBuyCatalog.addEventListener("click", function (event) {
      const btn = event.target.closest(".trade-buy-catalog-item");
      if (!btn || btn.disabled) return;
      const itemKey = btn.dataset.itemKey || "";
      if (!itemKey) return;
      event.preventDefault();
      event.stopPropagation();
      addOneItemToBuyCart(itemKey);
    });
  }
  if (host.tradeBuyCart) {
    host.tradeBuyCart.addEventListener("click", function (event) {
      const chip = event.target.closest(".trade-counter-chip");
      if (!chip || !exchangeOpen) return;
      event.preventDefault();
      event.stopPropagation();
      removeOneItemFromBuyCart(chip.dataset.itemKey || "");
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
      returnOneSellCounterItemToInventory(chip.dataset.itemKey || "");
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
      ? "\uBB3C\uAC74\uC740 \uAC00\uC838\uC654\uB098?!\n(q\uB97C \uB20C\uB7EC \uAD6C\uB9E4\u00B7\uD310\uB9E4)"
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
  if (!SELLABLE_KEYS.has(key)) return true;
  addOneInventoryItemToSellCounter(key);
  return true;
}

function addOneInventoryItemToSellCounter(itemKey) {
  if (!host.removeOneBagItem(itemKey)) return false;
  sellCounterByKey[itemKey] = Number(sellCounterByKey[itemKey] || 0) + 1;
  refreshTradeShopUi();
  return true;
}

/** @param {string} itemKey */
export function addFullInventoryStackToTradeCounter(itemKey) {
  if (!host || !exchangeOpen || !itemKey) return false;
  if (!SELLABLE_KEYS.has(itemKey)) return false;
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
  sellCounterByKey[itemKey] = Number(sellCounterByKey[itemKey] || 0) + available;
  refreshTradeShopUi();
  host.updateBagInventorySlots();
  return true;
}

function getTradeExchangePanelEl() {
  if (!host || !host.tradeExchangeOverlay) return null;
  return host.tradeExchangeOverlay.querySelector(".trade-exchange-panel");
}

/** @param {Element | null | undefined} targetEl */
export function tryDropBagItemOnTradeCounter(itemKey, targetEl) {
  if (!itemKey || !exchangeOpen || !host) return false;
  if (!(targetEl instanceof Element)) return false;
  if (!SELLABLE_KEYS.has(itemKey)) return false;
  const panel = getTradeExchangePanelEl();
  if (!panel) return false;
  const sellSlot = host.tradeCounterSlot;
  if (sellSlot && (sellSlot.contains(targetEl) || targetEl === sellSlot)) {
    return addFullInventoryStackToTradeCounter(itemKey);
  }
  if (panel.contains(targetEl)) {
    const sellSection = panel.querySelector(".trade-shop-section--sell");
    if (sellSection && sellSection.contains(targetEl)) {
      return addFullInventoryStackToTradeCounter(itemKey);
    }
  }
  return false;
}

export function canDragBagItemToTradeCounter(itemKey) {
  if (!exchangeOpen || !itemKey) return false;
  return SELLABLE_KEYS.has(itemKey);
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
      text: "\uD544\uC694\uD55C \uBB3C\uAC74\uC740 \uC0AC\uACE0, \uC548 \uC4F0\uB294 \uAC74 \uD310\uBA74 \uB418\uB124",
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
  sellCounterByKey = {};
  buyCartByKey = {};
  if (host.tradeExchangeOverlay) {
    host.tradeExchangeOverlay.style.display = "block";
    host.tradeExchangeOverlay.setAttribute("aria-hidden", "false");
  }
  host.setBagInventoryPanelOpen(true);
  host.updateBagInventorySlots();
  if (host.worldBagInventory) host.worldBagInventory.classList.add("is-trade-exchange-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.add("is-trade-exchange-focus");
  refreshTradeShopUi();
}

export function closeTradeExchangePanel(options) {
  if (!host) return;
  const keepInventory = Boolean(options && options.keepInventory);
  returnSellCounterItemsToInventory();
  exchangeOpen = false;
  sellCounterByKey = {};
  buyCartByKey = {};
  if (host.tradeExchangeOverlay) {
    host.tradeExchangeOverlay.style.display = "none";
    host.tradeExchangeOverlay.setAttribute("aria-hidden", "true");
  }
  if (host.worldBagInventory) host.worldBagInventory.classList.remove("is-trade-exchange-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.remove("is-trade-exchange-focus");
  if (!keepInventory) host.setBagInventoryPanelOpen(false);
  renderSellCounter();
  renderBuyCatalog();
  renderBuyCart();
}

function returnSellCounterItemsToInventory() {
  if (!host) return;
  Object.keys(sellCounterByKey).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(sellCounterByKey[key]) || 0));
    if (n > 0) host.addBagItems(key, n);
  });
  if (host.updateBagInventorySlots) host.updateBagInventorySlots();
  if (host.saveAppleState) host.saveAppleState();
}

function returnOneSellCounterItemToInventory(itemKey) {
  if (!itemKey) return;
  const n = Math.max(0, Math.floor(Number(sellCounterByKey[itemKey]) || 0));
  if (n <= 0) return;
  sellCounterByKey[itemKey] = n - 1;
  if (sellCounterByKey[itemKey] <= 0) delete sellCounterByKey[itemKey];
  host.addBagItems(itemKey, 1);
  afterSellCounterChanged();
}

function afterSellCounterChanged() {
  refreshTradeShopUi();
  host.updateBagInventorySlots();
}

/** @param {string} itemKey */
export function returnTradeCounterStackToInventory(itemKey) {
  if (!host || !exchangeOpen || !itemKey) return false;
  const n = Math.max(0, Math.floor(Number(sellCounterByKey[itemKey]) || 0));
  if (n <= 0) return false;
  if (host.canAddBagItems && !host.canAddBagItems({ [itemKey]: n })) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return false;
  }
  delete sellCounterByKey[itemKey];
  host.addBagItems(itemKey, n);
  afterSellCounterChanged();
  if (host.saveAppleState) host.saveAppleState();
  return true;
}

function addOneItemToBuyCart(itemKey) {
  if (!itemKey || TRADE_ITEM_BUY_PRICE_KRW[itemKey] == null) return;
  buyCartByKey[itemKey] = Number(buyCartByKey[itemKey] || 0) + 1;
  refreshTradeShopUi();
}

function removeOneItemFromBuyCart(itemKey) {
  if (!itemKey) return;
  const n = Math.max(0, Math.floor(Number(buyCartByKey[itemKey]) || 0));
  if (n <= 0) return;
  buyCartByKey[itemKey] = n - 1;
  if (buyCartByKey[itemKey] <= 0) delete buyCartByKey[itemKey];
  refreshTradeShopUi();
}

function escapeTradeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPlayerMoneyKrw() {
  return typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
}

function refreshTradeShopUi() {
  renderBuyCatalog();
  renderBuyCart();
  renderSellCounter();
  updateTradeBuySummary();
  updateTradeSellSummary();
}

function renderBuyCatalog() {
  if (!host.tradeBuyCatalog) return;
  const money = getPlayerMoneyKrw();
  host.tradeBuyCatalog.innerHTML = TRADE_BUY_CATALOG_ORDER.map(function (itemKey) {
    const price = getTradeItemUnitPriceKrw(itemKey, "buy");
    const desc = getBagItemDescriptor(itemKey);
    const canAffordOne = money >= price;
    return (
      '<button type="button" class="trade-buy-catalog-item' +
      (canAffordOne ? "" : " is-unaffordable") +
      '" data-item-key="' +
      escapeTradeHtml(itemKey) +
      '" title="' +
      escapeTradeHtml(desc.label + " " + formatPlayerMoneyKrw(price)) +
      '">' +
      '<span class="trade-buy-catalog-item-icon">' +
      desc.iconHtml +
      "</span>" +
      '<span class="trade-buy-catalog-item-meta">' +
      '<span class="trade-buy-catalog-item-label">' +
      escapeTradeHtml(desc.label) +
      "</span>" +
      '<span class="trade-buy-catalog-item-price">' +
      escapeTradeHtml(formatPlayerMoneyKrw(price)) +
      "</span>" +
      "</span>" +
      "</button>"
    );
  }).join("");
}

function renderItemChipList(counter, emptyClass) {
  const keys = Object.keys(counter).filter(function (k) {
    return Number(counter[k] || 0) > 0;
  });
  if (!keys.length) return { html: "", isEmpty: true };
  const html = keys
    .map(function (key) {
      const desc = getBagItemDescriptor(key);
      const count = Number(counter[key] || 0);
      return (
        '<div class="trade-counter-chip" data-item-key="' +
        escapeTradeHtml(key) +
        '">' +
        desc.iconHtml +
        '<span class="trade-counter-chip-count">' +
        count +
        "</span></div>"
      );
    })
    .join("");
  return { html: html, isEmpty: false };
}

function renderBuyCart() {
  if (!host.tradeBuyCart) return;
  const rendered = renderItemChipList(buyCartByKey, "trade-buy-cart");
  host.tradeBuyCart.classList.toggle("is-empty", rendered.isEmpty);
  host.tradeBuyCart.innerHTML = rendered.html;
}

function renderSellCounter() {
  if (!host.tradeCounterSlot) return;
  const rendered = renderItemChipList(sellCounterByKey, "trade-counter-slot");
  host.tradeCounterSlot.classList.toggle("is-empty", rendered.isEmpty);
  host.tradeCounterSlot.innerHTML = rendered.html;
}

function updateTradeBuySummary() {
  const total = sumTradeItemCountsValueKrw(buyCartByKey, "buy");
  const hasItems = Object.keys(buyCartByKey).some(function (key) {
    return Number(buyCartByKey[key] || 0) > 0;
  });
  if (host.tradeBuyTotal) {
    host.tradeBuyTotal.textContent = hasItems
      ? "\uAD6C\uB9E4 \uD569\uACC4: " + formatPlayerMoneyKrw(total)
      : "\uAD6C\uB9E4 \uD488\uBAA9\uC744 \uACE0\uB974\uC138\uC694.";
  }
  if (host.tradeBuyConfirm) {
    host.tradeBuyConfirm.disabled = !hasItems || getPlayerMoneyKrw() < total;
    host.tradeBuyConfirm.textContent = hasItems ? "\uAD6C\uB9E4" : "\uAD6C\uB9E4";
  }
}

function updateTradeSellSummary() {
  const total = sumTradeItemCountsValueKrw(sellCounterByKey, "sell");
  const hasItems = Object.keys(sellCounterByKey).some(function (key) {
    return Number(sellCounterByKey[key] || 0) > 0;
  });
  if (host.tradeSellTotal) {
    host.tradeSellTotal.textContent = hasItems
      ? "\uD310\uB9E4 \uD569\uACC4: " + formatPlayerMoneyKrw(total)
      : "\uD310\uB9E4\uD560 \uBB3C\uAC74\uC744 \uC62C\uB824 \uC8FC\uC138\uC694.";
  }
  if (host.tradeSellConfirm) {
    host.tradeSellConfirm.disabled = !hasItems;
    host.tradeSellConfirm.textContent = hasItems ? "\uD310\uB9E4" : "\uD310\uB9E4";
  }
}

function confirmTradeBuy() {
  const total = sumTradeItemCountsValueKrw(buyCartByKey, "buy");
  const hasItems = Object.keys(buyCartByKey).some(function (key) {
    return Number(buyCartByKey[key] || 0) > 0;
  });
  if (!hasItems || total <= 0) return;
  if (getPlayerMoneyKrw() < total) {
    if (host.showPlayerAlert) {
      host.showPlayerAlert({ message: "\uB3C8\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4.", durationMs: 2200 });
    }
    refreshTradeShopUi();
    return;
  }
  const purchaseCounts = {};
  Object.keys(buyCartByKey).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(buyCartByKey[key]) || 0));
    if (n > 0) purchaseCounts[key] = n;
  });
  if (host.canAddBagItems && !host.canAddBagItems(purchaseCounts)) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return;
  }
  if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
    host.applyPlayerMoneyDeltaKrw(-total);
  }
  Object.keys(purchaseCounts).forEach(function (key) {
    host.addBagItems(key, Number(purchaseCounts[key] || 0));
  });
  buyCartByKey = {};
  refreshTradeShopUi();
  host.updateBagInventorySlots();
  if (typeof host.updateBagPlayerMoneyDisplay === "function") {
    host.updateBagPlayerMoneyDisplay();
  }
  host.saveAppleState();
  host.markWorldDirty();
  if (typeof host.syncWorldState === "function") {
    host.syncWorldState(true);
  }
}

function confirmTradeSell() {
  const total = sumTradeItemCountsValueKrw(sellCounterByKey, "sell");
  const hasItems = Object.keys(sellCounterByKey).some(function (key) {
    return Number(sellCounterByKey[key] || 0) > 0;
  });
  if (!hasItems || total <= 0) return;
  if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
    host.applyPlayerMoneyDeltaKrw(total);
  }
  sellCounterByKey = {};
  refreshTradeShopUi();
  host.updateBagInventorySlots();
  if (typeof host.updateBagPlayerMoneyDisplay === "function") {
    host.updateBagPlayerMoneyDisplay();
  }
  host.saveAppleState();
  host.markWorldDirty();
  if (typeof host.syncWorldState === "function") {
    host.syncWorldState(true);
  }
}
