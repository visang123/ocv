/** View — 가방 인벤토리 패널. */

export function createModule(d) {
  function assignExtraSeedInventoryOwner(seed) {
  if (!seed) return;
  seed.ownerUserId = d.getLocalExtraSeedOwnerUserId();
  seed.ownerSessionId = d.getLocalExtraSeedOwnerSessionId();
  }

  function bagDiscardInventoryEligible(itemKey) {
  const counts = getBagInventoryCountsByKey();
  if (Number(counts[itemKey] || 0) <= 0) return false;
  if (itemKey === "seed" && !d.usesWorldLooseSeedMode()) {
    const seedIndex = d.getApple().extraSeeds.findIndex(function (extraSeed) {
      return (
        extraSeed.inInventory &&
        !extraSeed.planted &&
        extraSeed.id !== d.getInventory().plantingInventorySeedId
      );
    });
    if (seedIndex < 0) return false;
    const seed = d.getApple().extraSeeds[seedIndex];
    if (
      d.isOnboardingLinearGateActive() &&
      (seed.isStarter || seed.id === "starter-seed")
    ) {
      return false;
    }
  }
  return true;
  }

  function canDiscardBagItemFromBagPanel(itemKey) {
  if (!d.canDiscardBagItemKey(itemKey)) return false;
  if (d.isBagDiscardModalOpen()) return false;
  if (!d.bagInventoryPanelOpen) return false;
  if (!d.isTradeExchangeOpen() && !d.isAlchemyCraftOpen()) return false;
  return bagDiscardInventoryEligible(itemKey);
  }

  function canDiscardBagItemNow(itemKey) {
  if (!d.canDiscardBagItemKey(itemKey)) return false;
  if (d.isTradeExchangeOpen() || d.isAlchemyCraftOpen() || d.isBagDiscardModalOpen()) return false;
  if (!d.bagInventoryPanelOpen) return false;
  return bagDiscardInventoryEligible(itemKey);
  }

  function canUseBagInventoryGameplay() {
  return shouldShowWorldBagInventoryUi();
  }

  function clearBagInventoryDragVisual() {
  if (typeof d.clearMagicPowderDragPlantHighlight === "function") {
    d.clearMagicPowderDragPlantHighlight();
  }
  if (d.bagInventoryDragGhostEl) {
    d.bagInventoryDragGhostEl.remove();
    d.bagInventoryDragGhostEl = null;
  }
  if (d.bagInventoryDragState && d.bagInventoryDragState.sourceSlot) {
    d.bagInventoryDragState.sourceSlot.classList.remove("is-bag-drag-source");
  }
  d.bagInventoryDragState = null;
  if (typeof d.syncMagicPowderProximityPlantHighlight === "function") {
    d.syncMagicPowderProximityPlantHighlight();
  }
  }

  function closeBagInventoryPanel() {
  if (d.isBagDiscardModalOpen()) {
    d.cancelBagDiscardQuantityModal();
    return;
  }
  if (d.isAlchemyCraftOpen()) {
    d.closeAlchemyCraftPanel();
    return;
  }
  if (d.isTradeExchangeOpen()) {
    d.closeTradeExchangePanel();
    return;
  }
  if (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen()) {
    d.closePlantMasterSeedShop();
    return;
  }
  clearBagInventoryDragVisual();
  setBagInventoryPanelOpen(false);
  d.updateOnboardingFlowUI();
  }

  function createStarterSeedInventoryItem() {
  if (d.hasPickedMainSeedInCurrentRoom()) return null;

  const starterSeed = {
    id: "starter-seed",
    x: d.getWorldItems().seedX,
    y: d.getWorldItems().seedY,
    createdAt: d.getPlant().seedCreatedAt,
    planted: false,
    inInventory: true,
    label: "\uC528\uC5571",
    isStarter: true
  };
  assignExtraSeedInventoryOwner(starterSeed);
  d.getApple().extraSeeds.unshift(starterSeed);
  d.getSeedWorld().isMainSeedAvailable = false;
  d.getSeedWorld().lastMainSeedStateChangeAt = Date.now();
  d.setMainSeedPickedForCurrentRoom();
  if (d.getPlant().isSeedDry) {
    d.getSeedWorld().hasHandledDryMainSeed = true;
    d.setStoredFlag(d.mainDrySeedHandledKey, true);
    d.markWorldDirty();
    d.syncWorldState(true);
  }
  d.markWorldDirty();
  d.syncWorldState(true);
  d.saveAppleState();
  if (!d.getStoredFlag(d.onboardingFlowDoneKey) && d.getOnboarding().flowStep === 6) {
    d.getOnboarding().flowStep = d.ONBOARDING_STEP_GO_BOOK;
    d.persistOnboardingStep();
  }
  d.scheduleTutorialMainSeedRespawnFromGround();
  return starterSeed;
  }

  function discardBagItemsToGround(itemKey, amount, options) {
  itemKey = d.normalizeBagItemKey(itemKey);
  const max = Math.max(0, Math.floor(Number(amount) || 0));
  const allowCraftTrade = Boolean(options && options.allowCraftTrade);
  const canDiscard = allowCraftTrade
    ? canDiscardBagItemFromBagPanel(itemKey)
    : canDiscardBagItemNow(itemKey);
  if (max <= 0 || !canDiscard) return false;
  const pos = d.getLocalBagDropSpawnPosition();
  if (!removeBagItemsFromInventory(itemKey, max)) return false;
  d.spawnWorldBagDropAt(itemKey, max, pos.x, pos.y);
  return true;
  }

  function ensureBagInventoryDragGhost(html) {
  if (!d.bagInventoryDragGhostEl) {
    d.bagInventoryDragGhostEl = document.createElement("div");
    d.bagInventoryDragGhostEl.id = "bag-discard-drag-ghost";
    document.body.appendChild(d.bagInventoryDragGhostEl);
  }
  d.bagInventoryDragGhostEl.innerHTML = html || "";
  }

  function getBagInventoryCountsByKey() {
  return {
    book: d.hasGuideBookItemInBagCounts() ? 1 : 0,
    seed: getBagInventorySeedCount(),
    overgrowthSeed: Math.max(0, Math.floor(Number(d.getApple().overgrowthSeedCount) || 0)),
    apple: Math.max(0, Number(d.getApple().count) || 0),
    rock: Math.max(0, Math.floor(Number(d.rockInventoryCount) || 0)),
    magicPowder: Math.max(0, Math.floor(d.magicPowderCount) || 0),
    magicPowderYellow: Math.max(0, Math.floor(Number(d.coloredMagicPowderCounts.yellow) || 0)),
    magicPowderWhite: Math.max(0, Math.floor(Number(d.coloredMagicPowderCounts.white) || 0)),
    magicPowderBrown: Math.max(0, Math.floor(Number(d.coloredMagicPowderCounts.brown) || 0)),
    craftDesk: Math.max(0, Math.floor(Number(d.craftFurnitureCounts.craftDesk) || 0)),
    craftFence: Math.max(0, Math.floor(Number(d.craftFurnitureCounts.craftFence) || 0)),
    craftChair: Math.max(0, Math.floor(Number(d.craftFurnitureCounts.craftChair) || 0)),
    craftHouse: Math.max(0, Math.floor(Number(d.craftFurnitureCounts.craftHouse) || 0)),
    "butterfly:brown": Math.max(0, Number(d.butterflyState.caughtCounts.brown) || 0),
    "butterfly:yellow": Math.max(0, Number(d.butterflyState.caughtCounts.yellow) || 0),
    "butterfly:white": Math.max(0, Number(d.butterflyState.caughtCounts.white) || 0)
  };
  }

  function getBagInventoryItemCount(itemKey) {
  const counts = getBagInventoryCountsByKey();
  return Math.max(0, Math.floor(Number(counts[d.normalizeBagItemKey(itemKey)] || 0)));
  }

  function getBagInventorySeedCount() {
  if (d.usesWorldLooseSeedMode()) {
    let count = Math.max(0, Number(d.getApple().seedCount) || 0);
    if (d.getInventory().plantingInventorySeedId && count > 0) {
      count -= 1;
    }
    return count;
  }
  return d.getApple().extraSeeds.filter(function (extraSeed) {
    return (
      extraSeed.inInventory &&
      !extraSeed.planted &&
      extraSeed.id !== d.getInventory().plantingInventorySeedId
    );
  }).length;
  }

  function getBagItemKeyFromInventorySlot(slot) {
  if (!slot) return "";
  const index = Number(slot.dataset.slot);
  if (!Number.isFinite(index)) return "";
  return d.bagInventoryItemOrder[index] || "";
  }

  function isOnboardingInventoryTutorialActive() {
  return (
    d.isOnboardingLinearGateActive() &&
    d.getOnboarding().flowStep === 3 &&
    d.getOnboarding().inventoryIntroPhase <= 2
  );
  }

  function isPointerInsideBagInventoryPanel(clientX, clientY) {
  return !isPointerOutsideBagInventoryPanel(clientX, clientY);
  }

  function isPointerOutsideBagInventoryPanel(clientX, clientY) {
  if (!d.bagInventoryPanel || d.bagInventoryPanel.style.display === "none") return true;
  const rect = d.bagInventoryPanel.getBoundingClientRect();
  return (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  );
  }

  function isPointerOverBagInventoryUi(clientX, clientY) {
  if (isPointerInsideBagInventoryPanel(clientX, clientY)) return true;
  if (
    d.worldBagInventory &&
    d.worldBagInventory.style.display !== "none" &&
    !d.worldBagInventory.hidden
  ) {
    return d.isPointerInElementRect(clientX, clientY, d.worldBagInventory);
  }
  return false;
  }

  function loadBagInventoryOrder() {
  const seenMagicPowder = new Set();
  return d.loadBagInventoryOrderCore(d.getStoredValue)
    .map(d.normalizeBagItemKey)
    .filter(function (key) {
      if (key === "book") return false;
      if (key !== "magicPowder") return true;
      if (seenMagicPowder.has("magicPowder")) return false;
      seenMagicPowder.add("magicPowder");
      return true;
    });
  }

  function maybeAdvanceOnboardingAfterBookInventoryOpened() {
  if (d.getStoredFlag(d.onboardingFlowDoneKey)) return;
  if (d.getOnboarding().flowStep !== d.ONBOARDING_STEP_BOOK_INV || d.getOnboarding().bookInvPhase !== 0) return;
  d.getOnboarding().bookInvPhase = 1;
  d.updateOnboardingFlowUI();
  }

  function maybeAdvanceOnboardingAfterInventoryClosed() {
  if (d.getStoredFlag(d.onboardingFlowDoneKey)) return;
  if (d.getOnboarding().flowStep !== 3 || d.getOnboarding().inventoryIntroPhase < 2) return;
  onboardingClearInventoryCloseHintTimer();
  d.getOnboarding().inventoryIntroPhase = 0;
  d.getOnboarding().flowStep = 4;
  d.persistOnboardingStep();
  d.updateOnboardingFlowUI();
  }

  function maybeAdvanceOnboardingAfterInventoryOpened() {
  if (d.getStoredFlag(d.onboardingFlowDoneKey)) return;
  if (d.getOnboarding().flowStep !== 3 || d.getOnboarding().inventoryIntroPhase !== 0) return;
  d.getWorldItems().isGuideBookOpen = false;
  d.getOnboarding().inventoryIntroPhase = 1;
  d.persistOnboardingStep();
  scheduleOnboardingInventoryCloseHint();
  d.updateOnboardingFlowUI();
  }

  function normalizeBagInventoryOrderByCounts(counts) {
  const normalized = d.normalizeBagInventoryOrderByCountsCore(
    d.bagInventoryItemOrder,
    d.bagInventoryCountsPrev,
    counts
  );
  d.bagInventoryItemOrder = normalized.order;
  d.bagInventoryCountsPrev = normalized.previousCounts;
  if (normalized.changed) saveBagInventoryOrder();
  }

  function onBagInventorySlotPointerCancel(event) {
  if (!d.bagInventoryDragState) return;
  clearBagInventoryDragVisual();
  }

  function onBagInventorySlotPointerDown(event) {
  if (!d.bagInventoryPanelOpen || !d.bagInventoryPanel) return;
  if (event.button !== 0) return;
  const slot = event.target.closest(".bag-inventory-slot");
  if (!slot || !d.bagInventoryPanel.contains(slot)) return;
  if (slot === d.bagBookStorageSlot) return;
  const itemKey = getBagItemKeyFromInventorySlot(slot);
  const craftTradeOpen = d.isTradeExchangeOpen() || d.isAlchemyCraftOpen();
  if (craftTradeOpen) {
    if (!itemKey || slot.classList.contains("is-empty")) return;
    const canPlaceOnTarget = d.canStartBagPanelCraftTradeDrag(itemKey);
    const canDiscardWhileOpen = canDiscardBagItemFromBagPanel(itemKey);
    if (!canPlaceOnTarget && !canDiscardWhileOpen) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    d.bagInventoryDragState = {
      itemKey: itemKey,
      sourceSlot: slot,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      mode: d.isAlchemyCraftOpen() ? "alchemy" : "trade"
    };
    slot.classList.add("is-bag-drag-source");
    slot.setPointerCapture(event.pointerId);
    return;
  }
  if (
    d.isMagicPowderBagType(itemKey) &&
    d.getMagicPowderBagCount(itemKey) > 0
  ) {
    event.preventDefault();
    event.stopPropagation();
    d.bagInventoryDragState = {
      itemKey: itemKey,
      sourceSlot: slot,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      mode: "magicPowder"
    };
    slot.classList.add("is-bag-drag-source");
    slot.setPointerCapture(event.pointerId);
    return;
  }
  if (!canDiscardBagItemNow(itemKey)) return;
  event.preventDefault();
  event.stopPropagation();
  d.bagInventoryDragState = {
    itemKey: itemKey,
    sourceSlot: slot,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    mode: "discard"
  };
  slot.classList.add("is-bag-drag-source");
  slot.setPointerCapture(event.pointerId);
  }

  function onBagInventorySlotPointerMove(event) {
  if (!d.bagInventoryDragState) return;
  const dx = event.clientX - d.bagInventoryDragState.startX;
  const dy = event.clientY - d.bagInventoryDragState.startY;
  if (!d.bagInventoryDragState.dragging && dx * dx + dy * dy < 144) return;
  d.bagInventoryDragState.dragging = true;
  const descriptor = d.getBagItemDescriptorCore(d.bagInventoryDragState.itemKey);
  ensureBagInventoryDragGhost(descriptor.iconHtml);
  if (d.bagInventoryDragGhostEl) {
    d.bagInventoryDragGhostEl.style.left = event.clientX - 24 + "px";
    d.bagInventoryDragGhostEl.style.top = event.clientY - 24 + "px";
  }
  if (
    d.bagInventoryDragState.mode === "magicPowder" &&
    typeof d.syncMagicPowderDragPlantHighlight === "function"
  ) {
    d.syncMagicPowderDragPlantHighlight(
      event.clientX,
      event.clientY,
      d.bagInventoryDragState.itemKey
    );
  }
  }

  function onBagInventorySlotPointerUp(event) {
  if (!d.bagInventoryDragState) return;
  const wasDragging = d.bagInventoryDragState.dragging;
  if (typeof d.finishBagInventoryDrag === "function") {
    d.finishBagInventoryDrag(event);
  } else {
    clearBagInventoryDragVisual();
  }
  if (wasDragging) {
    event.preventDefault();
  }
  }

  function onWorldBagInventoryClick(event) {
  event.preventDefault();
  event.stopPropagation();
  toggleBagInventoryPanelFromBagClick();
  }

  function onboardingClearInventoryCloseHintTimer() {
  if (d.getOnboarding().inventoryCloseHintTimerId) {
    window.clearTimeout(d.getOnboarding().inventoryCloseHintTimerId);
    d.getOnboarding().inventoryCloseHintTimerId = null;
  }
  }

  function plantInventorySeed(seedId) {
  clearBagInventoryDragVisual();
  const inventorySeed = d.getApple().extraSeeds.find(function (extraSeed) {
    return extraSeed.id === seedId;
  });

  if (d.isOnboardingLinearGateActive() && inventorySeed) {
    const isStarter = inventorySeed.id === "starter-seed" || inventorySeed.isStarter;
    if (isStarter && d.getOnboarding().flowStep !== d.ONBOARDING_STEP_PLANT) {
      d.flashOnboardingOrderHint("");
      d.updateSeedInventory();
      return;
    }
    if (!isStarter && d.getOnboarding().flowStep < d.ONBOARDING_STEP_EXTRA_SEED) {
      d.flashOnboardingOrderHint("");
      d.updateSeedInventory();
      return;
    }
  }

  if (
    !inventorySeed ||
    !inventorySeed.inInventory ||
    inventorySeed.planted ||
    d.getPlant().isPlanting ||
    d.getApple().isEating ||
    d.isPlayerGameplayBlockedByNpcDialogue() ||
    !d.getPlayer().isOnGround
  ) {
    d.updateSeedInventory();
    return;
  }

  const playerBox = d.getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - d.PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - d.PLANT_SPOT_HEIGHT / 2;

  if (!d.canPlantAt(plantX, plantY)) {
    if (d.lastPlantProximityBlockMessage) {
      d.flashPlantProximityWarning(d.lastPlantProximityBlockMessage);
      d.updatePlayerStatus();
    }
    d.updateSeedInventory();
    return;
  }

  d.getInventory().plantingInventorySeedId = inventorySeed.id;
  d.getPlant().isPlanting = true;
  d.playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  d.updateSeedInventory();
  d.saveAppleState();
  d.sendMultiplayerPresence(true);

  window.setTimeout(function () {
    d.getPlant().isPlanting = false;
    d.sendMultiplayerPresence(true);
    d.getInventory().plantingInventorySeedId = null;
    inventorySeed.planted = true;
    inventorySeed.inInventory = false;

    if (!d.getPlant().isSeedPlanted) {
      const plantedAt = d.getSharedPlantSimulationNow();
      d.getPlant().spotX = plantX;
      d.getPlant().spotY = plantY;
      d.getPlant().isSeedPlanted = true;
      d.getPlant().lastWateredAt = null;
      d.getPlant().wateredAtList = [];
      d.getPlant().status = "normal";
      d.getPlant().waterLevel = 1;
      d.getPlant().waterLevelUpdatedAt = plantedAt;
      d.getPlant().becameEmptyAt = null;
      d.getPlant().isOverwatered = false;
      d.getPlant().rottenAt = null;
      d.getPlant().needsFirstWater = false;
      d.getPlant().growthStartedAt = plantedAt;
      d.getPlant().plantedAt = plantedAt;
      d.getPlant().isSproutGrown = false;
      d.getPlant().sproutGrownAt = null;
      d.getPlant().sproutEvolutionMs = 0;
      d.getPlant().sproutEvolutionLastTickAt = null;
      d.getPlant().isSproutSelfSustaining = false;
      d.getPlant().growthTier = 0;
      d.getPlant().waterCapacity = 2;
      d.getPlant().powderUpgradeTargetTier = 0;
      d.getPlant().powderUpgradeStartedAt = null;
      d.getPlant().powderUpgradeDurationMs = 0;
      d.getPlant().grassAuto5EligibleAt = null;
      d.getPlant().seedKind = "";
      d.assignSproutIdentityToNewPlant(d.getPlant());
      d.ensureGrassOrdinalIfNeeded(d.getPlant());
      d.getPlant().blockSproutRegrowthAfterDry = false;
      d.getPlant().drySoilAt = null;
      d.plantSpot.style.display = "block";
      d.setWorldPosition(d.plantSpot, d.getPlant().spotX, d.getPlant().spotY);
      d.updatePlantState();
      d.updateNpcPosition();
      d.saveSeedState();
      d.onboardingNotifyMainPlantPlanted();
    } else {
      const invPlant = d.createExtraPlant("plant-" + inventorySeed.id, plantX, plantY);
      d.assignSproutIdentityToNewPlant(invPlant);
      d.ensureGrassOrdinalIfNeeded(invPlant);
      d.getApple().extraPlants.push(invPlant);
      d.updateExtraSeedsAndPlants();
    }

    d.playerStatus.textContent = "";
    d.updateSeedInventory();
    d.holdLocalPlantStateAgainstStaleSnapshot(3000);
    d.holdLocalAppleStateAgainstStaleSnapshot(3000);
    d.saveAppleState();
    if (typeof d.syncSharedWorldPlantStateNow === "function") {
      d.syncSharedWorldPlantStateNow();
    }
  }, d.plantActionMs);
  }

  function removeBagItemsFromInventory(itemKey, amount) {
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  for (let i = 0; i < n; i++) {
    if (!d.removeOneBagItemForTrade(itemKey)) return false;
  }
  return true;
  }

  function saveBagInventoryOrder() {
  d.saveBagInventoryOrderCore(d.setStoredValue, d.bagInventoryItemOrder);
  }

  function scheduleOnboardingInventoryCloseHint() {
  onboardingClearInventoryCloseHintTimer();
  d.getOnboarding().inventoryCloseHintTimerId = window.setTimeout(function () {
    d.getOnboarding().inventoryCloseHintTimerId = null;
    if (d.getStoredFlag(d.onboardingFlowDoneKey) || d.getOnboarding().flowStep !== 3) return;
    if (d.getOnboarding().inventoryIntroPhase !== 1) return;
    d.getOnboarding().inventoryIntroPhase = 2;
    d.updateOnboardingFlowUI();
  }, 3000);
  }

  function setBagInventoryPanelOpen(open) {
  const wasOpen = d.bagInventoryPanelOpen;
  d.bagInventoryPanelOpen = Boolean(open);
  if (!d.bagInventoryPanel) return;
  d.bagInventoryPanel.style.display = d.bagInventoryPanelOpen ? "flex" : "none";
  d.bagInventoryPanel.setAttribute("aria-hidden", d.bagInventoryPanelOpen ? "false" : "true");
  if (d.bagInventoryPanelOpen && !wasOpen) {
    maybeAdvanceOnboardingAfterInventoryOpened();
    maybeAdvanceOnboardingAfterBookInventoryOpened();
  } else if (!d.bagInventoryPanelOpen && wasOpen) {
    clearBagInventoryDragVisual();
    maybeAdvanceOnboardingAfterInventoryClosed();
  }
  }

  function setWorldBagGroundPickedForCurrentRoom() {
  d.persistWorldFloorBagClaim(d.setStoredFlag);
  }

  function shouldShowWorldBagInventoryUi() {
  return Boolean(
    d.getWorldItems().hasGuideBook ||
    d.getStoredFlag(d.hasGuideBookKey) ||
    d.isWorldFloorBagClaimed(d.getStoredFlag)
  );
  }

  function showBagInventoryFullFailMessage() {
  d.showPlayerAlert({
    message: "\uC778\uBCA4\uD1A0\uB9AC(\uC800\uC7A5\uC18C) \uCE78\uBD80\uC871, \uC81C\uC791 \uC2E4\uD328!",
    durationMs: 2200
  });
  }

  function showBagRequiredForGameplayMessage() {
  d.showPlayerAlert({
    message: "\uBA3C\uC800 \uAC00\uBC29\uC744 \uC8FC\uC6CC\uC57C \uD574\uC694.",
    durationMs: 2200
  });
  }

  function toggleBagInventoryPanelFromBagClick() {
  if (
    d.isTradeExchangeOpen() ||
    d.isAlchemyCraftOpen() ||
    (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen())
  ) {
    return;
  }
  if (d.worldSocialUiReady && d.worldChatPanelOpen) {
    d.setWorldChatPanelOpen(false);
  }
  const nextOpen = !d.bagInventoryPanelOpen;
  if (isOnboardingInventoryTutorialActive() && d.getOnboarding().inventoryIntroPhase === 0 && !nextOpen) {
    return;
  }
  if (isOnboardingInventoryTutorialActive() && d.getOnboarding().inventoryIntroPhase < 2 && !nextOpen) {
    setBagInventoryPanelOpen(false);
    d.updateOnboardingFlowUI();
    return;
  }
  setBagInventoryPanelOpen(nextOpen);
  if (nextOpen) {
    updateBagInventorySlots();
  }
  if (nextOpen && isOnboardingInventoryTutorialActive()) {
    d.getWorldItems().isGuideBookOpen = false;
    d.updateGuideCard();
  }
  d.updateOnboardingFlowUI();
  }

  function updateBagPlayerMoneyDisplay() {
  if (!d.bagPlayerMoney) return;
  const amountEl =
    d.bagPlayerMoney.querySelector(".bag-player-money__amount") || d.bagPlayerMoney;
  amountEl.textContent = d.formatPlayerMoneyKrw(d.playerMoneyKrw);
  }

  function updateBagInventorySlots() {
  if (!d.bagInventoryPanel) return;
  updateBagPlayerMoneyDisplay();
  d.updateBookStorageSlot();
  const counts = getBagInventoryCountsByKey();
  const seedCount = Number(counts.seed || 0);
  const looseVisible = d.usesWorldLooseSeedMode() && d.isWorldLooseSeedVisibleAt();
  if (d.usesWorldLooseSeedMode() && seedCount <= 0 && !looseVisible) {
    d.getSeedWorld().hasShownFirstSeedFocus = false;
  }
  normalizeBagInventoryOrderByCounts(counts);

  const slots = Array.from(
    d.bagInventoryPanel.querySelectorAll(".bag-inventory-slots .bag-inventory-slot")
  ).sort(function (a, b) {
    return Number(a.dataset.slot || 0) - Number(b.dataset.slot || 0);
  });
  slots.forEach(function (slot, index) {
    const itemKey = d.bagInventoryItemOrder[index] || "";
    if (!itemKey) {
      slot.dataset.bagType = "empty";
      delete slot.dataset.butterflyColor;
      slot.removeAttribute("data-ovc-tip");
      slot.removeAttribute("aria-label");
      slot.classList.add("bag-inventory-slot--empty");
      slot.classList.add("is-empty");
      slot.innerHTML = "";
      return;
    }
    const itemCount = Math.max(0, Number(counts[itemKey] || 0));
    if (itemCount <= 0) {
      slot.dataset.bagType = "empty";
      delete slot.dataset.butterflyColor;
      slot.removeAttribute("data-ovc-tip");
      slot.removeAttribute("aria-label");
      slot.classList.add("bag-inventory-slot--empty");
      slot.classList.add("is-empty");
      slot.innerHTML = "";
      return;
    }
    const descriptor = d.getBagItemDescriptorCore(itemKey);
    slot.dataset.bagType = descriptor.bagType;
    if (descriptor.label) {
      slot.setAttribute("data-ovc-tip", descriptor.label);
      slot.setAttribute("aria-label", descriptor.label);
    } else {
      slot.removeAttribute("data-ovc-tip");
      slot.removeAttribute("aria-label");
    }
    if (descriptor.butterflyColor) {
      slot.dataset.butterflyColor = descriptor.butterflyColor;
    } else {
      delete slot.dataset.butterflyColor;
    }
    slot.classList.remove("bag-inventory-slot--empty");
    slot.classList.remove("is-empty");
    slot.innerHTML = descriptor.iconHtml + '<span class="bag-slot-count">' + itemCount + "</span>";
  });

  if (d.bagInventoryPanel) {
    d.bagInventoryPanel.querySelectorAll(".bag-inventory-slots .bag-inventory-slot").forEach(function (slot) {
      const bagType = slot.dataset.bagType;
      if (!d.isMagicPowderBagType(bagType)) return;
      const count = d.getMagicPowderBagCount(bagType);
      const powderUsable = count > 0 && d.isMagicPowderBagTypeUsableNow(bagType);
      slot.classList.toggle("is-magic-powder-usable", powderUsable);
      const tip =
        typeof d.getMagicPowderInventoryHoverTip === "function"
          ? d.getMagicPowderInventoryHoverTip(bagType)
          : d.getBagItemDescriptorCore(bagType).label || "";
      if (tip) {
        slot.setAttribute("data-ovc-tip", tip);
        slot.setAttribute("aria-label", tip);
      } else {
        slot.removeAttribute("data-ovc-tip");
        slot.removeAttribute("aria-label");
      }
    });
  }
  }

  return {
    assignExtraSeedInventoryOwner,
    bagDiscardInventoryEligible,
    canDiscardBagItemFromBagPanel,
    canDiscardBagItemNow,
    canUseBagInventoryGameplay,
    clearBagInventoryDragVisual,
    closeBagInventoryPanel,
    createStarterSeedInventoryItem,
    discardBagItemsToGround,
    ensureBagInventoryDragGhost,
    getBagInventoryCountsByKey,
    getBagInventoryItemCount,
    getBagInventorySeedCount,
    getBagItemKeyFromInventorySlot,
    isOnboardingInventoryTutorialActive,
    isPointerInsideBagInventoryPanel,
    isPointerOutsideBagInventoryPanel,
    isPointerOverBagInventoryUi,
    loadBagInventoryOrder,
    maybeAdvanceOnboardingAfterBookInventoryOpened,
    maybeAdvanceOnboardingAfterInventoryClosed,
    maybeAdvanceOnboardingAfterInventoryOpened,
    normalizeBagInventoryOrderByCounts,
    onBagInventorySlotPointerCancel,
    onBagInventorySlotPointerDown,
    onBagInventorySlotPointerMove,
    onBagInventorySlotPointerUp,
    onWorldBagInventoryClick,
    onboardingClearInventoryCloseHintTimer,
    plantInventorySeed,
    removeBagItemsFromInventory,
    saveBagInventoryOrder,
    scheduleOnboardingInventoryCloseHint,
    setBagInventoryPanelOpen,
    setWorldBagGroundPickedForCurrentRoom,
    shouldShowWorldBagInventoryUi,
    showBagInventoryFullFailMessage,
    showBagRequiredForGameplayMessage,
    toggleBagInventoryPanelFromBagClick,
    updateBagPlayerMoneyDisplay,
    updateBagInventorySlots,
  };
}
