import {
  PLANT_MASTER_SEED_BUY_PRICE_KRW,
  formatPlayerMoneyKrw
} from "./player-money.js";

/** @type {Record<string, unknown> | null} */
let host = null;
let shopOpen = false;

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

function refreshSeedShopUi() {
  if (!host) return;
  const price = PLANT_MASTER_SEED_BUY_PRICE_KRW;
  if (host.seedShopPriceEl) {
    host.seedShopPriceEl.textContent = formatPlayerMoneyKrw(price);
  }
  if (host.seedShopBuyBtn) {
    const money =
      typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
    host.seedShopBuyBtn.disabled = money < price;
  }
}

function onSeedShopBuyClick() {
  if (!host || !shopOpen) return;
  const price = PLANT_MASTER_SEED_BUY_PRICE_KRW;
  const money =
    typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
  if (money < price) {
    if (typeof host.showPlayerAlert === "function") {
      host.showPlayerAlert({ message: "\uB3C8\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4." });
    }
    refreshSeedShopUi();
    return;
  }
  if (typeof host.canAddBagItems === "function" && !host.canAddBagItems({ seed: 1 })) {
    if (typeof host.showInventoryFullFail === "function") {
      host.showInventoryFullFail();
    }
    return;
  }
  if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
    host.applyPlayerMoneyDeltaKrw(-price);
  }
  if (typeof host.addBagItems === "function") {
    host.addBagItems("seed", 1);
  }
  refreshSeedShopUi();
}

/** @param {Record<string, unknown>} h */
export function bindPlantMasterSeedShop(h) {
  host = h;
  if (host.seedShopBuyBtn) {
    host.seedShopBuyBtn.addEventListener("click", onSeedShopBuyClick);
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
