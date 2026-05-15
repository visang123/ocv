import { getBagItemDescriptor } from "./bag-inventory.js";
import {
  cloneTradeCounter,
  getMatchingTradeRecipes,
  getTradeRecipeById,
  recipeMatchesCounter,
  subtractRecipeInputsFromCounter
} from "./trade-exchange.js";

const TRADEABLE_KEYS = new Set(["rock", "seed", "apple", "magicPowder"]);

/** @type {Record<string, any>} */
let host = null;

let running = false;
let complete = false;
let promptHideTimeout = null;
let exchangeOpen = false;
/** @type {Record<string, number>} */
let counterByKey = {};
let selectedRecipeId = null;

export function bindTradeMaster(h) {
  host = h;
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
}

export function hydrateTradeMasterDialogueComplete(flag) {
  complete = Boolean(flag);
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
  if (!host || !isNearTradeMaster() || running) return false;
  if (!complete) {
    startTradeMasterDialogue();
    return true;
  }
  openTradeExchangePanel();
  return true;
}

export function updateTradeNpcPrompt() {
  if (!host || !host.tradeMasterBubble) return;
  if (running || exchangeOpen || (host.isNpcDialogueRunning && host.isNpcDialogueRunning())) {
    return;
  }

  if (isNearTradeMaster()) {
    if (host.tradeMasterBubble.dataset.promptShown === "true") return;
    host.tradeMasterBubble.dataset.promptShown = "true";
    host.tradeMasterBubble.textContent = complete
      ? "\uBB3C\uAC74\uC740 \uAC00\uC838\uC654\uB098?!"
      : "\uBC18\uAC11\uB124 \uC774\uBC29\uC778\uC774\uC5EC";
    host.tradeMasterBubble.style.display = "block";
    layoutTradeSpeechBubble();
    window.clearTimeout(promptHideTimeout);
    promptHideTimeout = window.setTimeout(function () {
      if (!running && host.tradeMasterBubble) {
        host.tradeMasterBubble.style.display = "none";
      }
    }, 5000);
    return;
  }

  if (host.tradeMasterBubble.style.display === "block" && !running) {
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
    window.clearTimeout(promptHideTimeout);
  }
}

export function pickWorldNpcHover(clientX, clientY) {
  if (!host) return null;
  const list = [
    { el: host.plantMaster, name: "\uC2DD\uBB3C\uC758 \uB2EC\uC778", visible: host.isPlantMasterVisible },
    { el: host.tradeMaster, name: "\uAC70\uB798\uC758 \uB2EC\uC778", visible: host.isTradeMasterVisible },
    { el: host.alchemyMaster, name: "\uC5F0\uAE08\uC220\uC758 \uB2EC\uC778", visible: host.isAlchemyMasterVisible }
  ];
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    if (!entry.el || !entry.visible()) continue;
    if (entry.el.style.display === "none") continue;
    const rect = entry.el.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      return { name: entry.name, anchorEl: entry.el };
    }
  }
  return null;
}

export function handleBagSlotClickWhileTradeOpen(slotEl) {
  if (!exchangeOpen || !slotEl) return false;
  const key = bagSlotToItemKey(slotEl);
  if (!key || !TRADEABLE_KEYS.has(key)) return false;
  return addOneInventoryItemToTradeCounter(key);
}

function bagSlotToItemKey(slotEl) {
  const kind = slotEl.dataset.bagType;
  if (!kind || kind === "empty" || kind === "book" || kind === "butterfly") return null;
  if (kind === "butterfly") {
    const color = slotEl.dataset.butterflyColor;
    return color ? "butterfly:" + color : null;
  }
  return kind;
}

function layoutTradeSpeechBubble() {
  if (!host || !host.tradeMasterBubble) return;
  const bubbleWidth = host.tradeMasterBubble.offsetWidth || 48;
  const headTop =
    host.TRADE_MASTER_START_Y - host.NPC_HEIGHT - host.NPC_HEAD_TOP_TRIM_WORLD;
  const bubbleWorldY =
    host.speechBubbleTopWorldYFromHead(
      headTop,
      host.tradeMasterBubble,
      host.NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    ) + host.NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  host.setSpeechBubbleTransform(
    host.tradeMasterBubble,
    host.TRADE_MASTER_START_X + host.NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
}

function startTradeMasterDialogue() {
  if (!host) return;
  const lines = [
    { text: "\uB098\uB294 \uAC70\uB798\uB97C \uC88B\uC544\uD55C\uB2E4\uB124.", delayAfterMs: 2000 },
    {
      text: "\uBB3C\uAC74\uC744 \uC900\uB2E4\uBA74 \uD569\uB2F9\uD55C \uAD50\uD658\uC744 \uD558\uACA0\uB124",
      delayAfterMs: 2000
    }
  ];
  running = true;
  host.tradeMasterBubble.style.display = "none";
  window.clearTimeout(promptHideTimeout);
  let timelineMs = 0;
  lines.forEach(function (line) {
    window.setTimeout(function () {
      host.tradeMasterBubble.textContent = line.text;
      host.tradeMasterBubble.style.display = "block";
      layoutTradeSpeechBubble();
    }, timelineMs);
    timelineMs += Math.max(0, Number(line.delayAfterMs) || 650);
  });
  window.setTimeout(function () {
    running = false;
    complete = true;
    host.tradeMasterBubble.style.display = "none";
    host.tradeMasterBubble.dataset.promptShown = "false";
    host.setStoredFlag(host.tradeMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
  }, timelineMs + 200);
}

export function openTradeExchangePanel() {
  if (!host || !complete) return;
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

export function closeTradeExchangePanel() {
  if (!host) return;
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
  host.setBagInventoryPanelOpen(false);
  renderTradeCounter();
  renderTradeOffers();
}

function returnCounterItemsToInventory() {
  Object.keys(counterByKey).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(counterByKey[key]) || 0));
    if (n > 0) host.addBagItems(key, n);
  });
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
