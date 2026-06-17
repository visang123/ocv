import {
  PLANT_MASTER_SEED_BUY_PRICE_KRW,
  PLANT_MASTER_OVERGROWTH_SEED_BUY_PRICE_KRW,
  formatPlayerMoneyKrw
} from "./player-money.js";
import { isBagDiscardOverlayInteractionTarget } from "./bag-discard-ui.js";

/** @type {Record<string, unknown> | null} */
let host = null;
let shopOpen = false;
let outsideDismissBound = false;

/** @type {Record<string, number>} */
const SHOP_ITEM_PRICES_KRW = {
  seed: PLANT_MASTER_SEED_BUY_PRICE_KRW,
  overgrowthSeed: PLANT_MASTER_OVERGROWTH_SEED_BUY_PRICE_KRW
};

function isPlantMasterSeedShopKeepOpenTarget(target) {
  if (!(target instanceof Element) || !host) return false;
  if (isBagDiscardOverlayInteractionTarget(target)) return true;
  const panel = host.seedShopOverlay
    ? host.seedShopOverlay.querySelector(".plant-master-seed-shop-panel")
    : null;
  if (panel && panel.contains(target)) return true;
  if (host.bagInventoryPanel && host.bagInventoryPanel.contains(target)) return true;
  if (host.worldBagInventory && host.worldBagInventory.contains(target)) return true;
  return false;
}

function onPlantMasterSeedShopOutsidePointer(event) {
  if (!shopOpen) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (isPlantMasterSeedShopKeepOpenTarget(target)) return;
  closePlantMasterSeedShop();
}

function bindPlantMasterSeedShopOutsideDismiss() {
  if (outsideDismissBound) return;
  outsideDismissBound = true;
  document.addEventListener("pointerdown", onPlantMasterSeedShopOutsidePointer, true);
}

function isPlantMasterSeedShopOverlayVisible() {
  return Boolean(
    host && host.seedShopOverlay && host.seedShopOverlay.style.display === "block"
  );
}

function reconcilePlantMasterSeedShopOpenState() {
  if (!shopOpen) return;
  if (!isPlantMasterSeedShopOverlayVisible()) {
    shopOpen = false;
  }
}

function isBagInventoryGameplayBlocked() {
  if (!host || typeof host.canUseBagInventoryGameplay !== "function") return false;
  return !host.canUseBagInventoryGameplay();
}

function showBagInventoryGameplayRequiredAlert() {
  if (!host || typeof host.showPlayerAlert !== "function") return;
  host.showPlayerAlert({
    message: "\uAC00\uBC29\uC774 \uC788\uC5B4\uC57C \uAD6C\uB9E4\uD560 \uC218 \uC788\uC5B4\uC694."
  });
}

function getPlayerMoneyKrw() {
  return typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
}

function refreshSeedShopUi() {
  if (!host || !host.seedShopOverlay) return;
  const money = getPlayerMoneyKrw();
  host.seedShopOverlay.querySelectorAll(".plant-master-seed-shop-price").forEach(function (el) {
    const itemKey = el.dataset.priceFor;
    const price = SHOP_ITEM_PRICES_KRW[itemKey];
    if (price != null) {
      el.textContent = formatPlayerMoneyKrw(price);
    }
  });
  host.seedShopOverlay.querySelectorAll(".plant-master-seed-shop-buy").forEach(function (btn) {
    const itemKey = btn.dataset.itemKey;
    const price = SHOP_ITEM_PRICES_KRW[itemKey];
    btn.disabled = price == null || money < price;
  });
}

function onSeedShopBuyClick(event) {
  if (!host || !shopOpen) return;
  const btn =
    event.target instanceof Element ? event.target.closest(".plant-master-seed-shop-buy") : null;
  if (!btn || btn.disabled) return;
  const itemKey = btn.dataset.itemKey;
  const price = SHOP_ITEM_PRICES_KRW[itemKey];
  if (!itemKey || price == null) return;
  if (getPlayerMoneyKrw() < price) {
    if (typeof host.showPlayerAlert === "function") {
      host.showPlayerAlert({ message: "\uB3C8\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4." });
    }
    refreshSeedShopUi();
    return;
  }
  if (typeof host.canAddBagItems === "function" && !host.canAddBagItems({ [itemKey]: 1 })) {
    if (typeof host.showInventoryFullFail === "function") {
      host.showInventoryFullFail();
    }
    return;
  }
  if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
    host.applyPlayerMoneyDeltaKrw(-price);
  }
  if (typeof host.addBagItems === "function") {
    host.addBagItems(itemKey, 1);
  }
  refreshSeedShopUi();
}

/** @param {Record<string, unknown>} h */
export function bindPlantMasterSeedShop(h) {
  host = h;
  bindPlantMasterSeedShopOutsideDismiss();
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) return;
      reconcilePlantMasterSeedShopOpenState();
    });
  }
  if (host.seedShopOverlay) {
    host.seedShopOverlay.addEventListener("click", onSeedShopBuyClick);
  }
  if (host.seedShopCloseBtn) {
    host.seedShopCloseBtn.addEventListener("click", function () {
      closePlantMasterSeedShop({ keepInventory: true });
    });
  }
  refreshSeedShopUi();
}

export function isPlantMasterSeedShopOpen() {
  return shopOpen;
}

/** 상점이 열린 채 NPC에서 멀어지면 닫기 (거래·연금술 상점과 동일) */
export function updatePlantMasterSeedShopProximity() {
  if (!shopOpen) return;
  if (typeof host.isNearPlantMaster === "function" && !host.isNearPlantMaster()) {
    closePlantMasterSeedShop();
  }
}

export function openPlantMasterSeedShop() {
  if (!host || shopOpen) return;
  if (typeof host.isPlantMasterDialogueComplete === "function") {
    if (!host.isPlantMasterDialogueComplete()) return;
  }
  if (isBagInventoryGameplayBlocked()) {
    showBagInventoryGameplayRequiredAlert();
    return;
  }
  if (host.isTradeExchangeOpen && host.isTradeExchangeOpen()) {
    if (host.closeTradeExchangePanel) host.closeTradeExchangePanel();
  }
  if (host.isAlchemyCraftOpen && host.isAlchemyCraftOpen()) {
    if (host.closeAlchemyCraftPanel) host.closeAlchemyCraftPanel();
  }
  shopOpen = true;
  if (host.seedShopOverlay) {
    host.seedShopOverlay.style.display = "block";
    host.seedShopOverlay.setAttribute("aria-hidden", "false");
  }
  if (typeof host.setBagInventoryPanelOpen === "function") {
    host.setBagInventoryPanelOpen(true);
  }
  if (typeof host.updateBagInventorySlots === "function") {
    host.updateBagInventorySlots();
  }
  if (typeof host.updateBagPlayerMoneyDisplay === "function") {
    host.updateBagPlayerMoneyDisplay();
  }
  refreshSeedShopUi();
}

/** @param {{ keepInventory?: boolean } | undefined} options */
export function closePlantMasterSeedShop(options) {
  if (!host || !shopOpen) return;
  const keepInventory = Boolean(options && options.keepInventory);
  shopOpen = false;
  if (host.seedShopOverlay) {
    host.seedShopOverlay.style.display = "none";
    host.seedShopOverlay.setAttribute("aria-hidden", "true");
  }
  if (!keepInventory && typeof host.setBagInventoryPanelOpen === "function") {
    host.setBagInventoryPanelOpen(false);
  }
}

export function cancelPlantMasterSeedShopOnPlayerHealthDepleted() {
  if (shopOpen) {
    closePlantMasterSeedShop({ keepInventory: true });
  }
}
