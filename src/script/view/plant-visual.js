/** View — 식물·수분 카드·호버 UI. */

export function createModule(d) {
  function applyPlantHoverVisuals(plant) {
  d.clearPlantHoverRing();
  if (d.ground) {
    d.ground
      .querySelectorAll(".is-plant-water-clickable")
      .forEach(function (el) {
        el.classList.remove("is-plant-water-clickable");
        el.style.cursor = "";
      });
  }
  if (!plant) return;
  const now = d.getSharedPlantSimulationNow();
  const skipRing = shouldSkipPlantHoverVisualEmphasis(plant, now);
  const urgentWater =
    !skipRing && plantShowsUrgentWaterHoverEmphasis(plant, now);
  const clickable =
    d.getInventory().heldItem === d.HELD_ITEM_BUCKET &&
    d.getInventory().isBucketFull &&
    d.canWaterPlantByClick(plant) &&
    d.isPlayerNearPlantWorld(plant);
  if (!skipRing) {
    layoutPlantHoverRing(plant, urgentWater);
  }
  getPlantHoverDomElements(plant).forEach(function (el) {
    if (clickable) {
      el.classList.add("is-plant-water-clickable");
      el.style.cursor = "pointer";
    }
  });
  }

  function clearPlantHoverVisuals() {
  d.clearPlantHoverRing();
  d.clearPlantOccluderFade();
  if (d.ground) {
    d.ground
      .querySelectorAll(".is-plant-water-clickable")
      .forEach(function (el) {
        el.classList.remove("is-plant-water-clickable");
        el.style.cursor = "";
      });
  }
  }

  function ensureSharedPlantVisuals() {
  if (d.getPlant().isSeedPlanted) {
    d.plantSpot.src = d.getPlantSoilSrc(d.getPlant());
    d.setWorldPosition(d.plantSpot, d.getPlant().spotX, d.getPlant().spotY);
    const mainRot = d.getPlant().status === "rotten" || d.getPlant().isOverwatered;
    d.plantSpot.style.display =
      mainRot || !shouldHideSeparateSoilUnderBigGrass(d.getPlant()) ? "block" : "none";
  }

  d.getApple().extraPlants.forEach(function (plant) {
    d.ensureExtraPlantElements(plant);
    plant.spotElement.src = d.getPlantSoilSrc(plant);
    d.setWorldPosition(plant.spotElement, plant.x, plant.y);
    plant.spotElement.style.display = shouldHideSeparateSoilUnderBigGrass(plant) ? "none" : "block";
  });
  }

  function extraPlantFromDomElement(el) {
  for (let i = 0; i < d.getApple().extraPlants.length; i++) {
    const p = d.getApple().extraPlants[i];
    if (!p) continue;
    if (p.spotElement === el || p.sproutElement === el) return p;
  }
  return null;
  }

  function getNearestBadSoilPlantForProximityCard() {
  let best = null;
  let bestDist = Infinity;
  function tryPlant(plant, x, y) {
    if (!plant) return;
    if (plant.status !== "dry" && plant.status !== "rotten" && !plant.isOverwatered) return;
    const dist = d.getCenterDistance(x, y, d.PLANT_SPOT_WIDTH, d.PLANT_SPOT_HEIGHT);
    if (dist <= d.plantWaterDistance && dist < bestDist) {
      bestDist = dist;
      best = { plant, distance: dist };
    }
  }
  if (d.getPlant().isSeedPlanted) {
    tryPlant(d.getPlant(), d.getPlant().spotX, d.getPlant().spotY);
  }
  d.getApple().extraPlants.forEach(function (p) {
    tryPlant(p, p.x, p.y);
  });
  return best;
  }

  function getPlantHoverDomElements(plant) {
  const els = [];
  if (!plant) return els;
  if (plant === d.getPlant()) {
    if (d.plantSpot && d.plantSpot.style.display !== "none") els.push(d.plantSpot);
    if (d.sprout && d.sprout.style.display !== "none") els.push(d.sprout);
    return els;
  }
  if (plant.spotElement && plant.spotElement.style.display !== "none") {
    els.push(plant.spotElement);
  }
  if (plant.sproutElement && plant.sproutElement.style.display !== "none") {
    els.push(plant.sproutElement);
  }
  return els;
  }

  function getPlantPrimaryVisualRectWorld(plant) {
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const sproutVisible =
    plant.isSproutGrown &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered;
  if (sproutVisible) {
    const st = d.getSproutStageFromPlant(plant);
    const sz = d.getSproutSizeForStage(st, plant);
    const pos = d.getSproutWorldPositionForPlant(px, py, sz, st, plant);
    return {
      left: pos.x,
      top: pos.y,
      right: pos.x + sz.width,
      bottom: pos.y + sz.height
    };
  }
  if (shouldHideSeparateSoilUnderBigGrass(plant)) return null;
  return {
    left: px,
    top: py,
    right: px + d.PLANT_SPOT_WIDTH,
    bottom: py + d.PLANT_SPOT_HEIGHT
  };
  }

  function getSproutImageForPlant(plant, stage) {
  if (stage >= 5) {
    if (d.isFlowerMaturePlant(plant)) return d.flowerStage5Image;
    if (d.isTreeMaturePlant(plant)) return d.treeStage5Image;
    if (d.isCactusMaturePlant(plant)) return d.cactusStage5Image;
    return d.sproutStage5Image;
  }
  if (stage >= 4) {
    if (d.isFlowerMaturePlant(plant)) return d.flowerStage4Image;
    if (d.isTreeMaturePlant(plant)) return d.treeStage4Image;
    if (d.isCactusMaturePlant(plant)) return d.cactusStage4Image;
    return d.sproutStage4Image;
  }
  if (stage >= 3) return d.sproutStage3Image;
  if (stage === 2) return d.sproutStage2Image;
  return d.sproutStage1Image;
  }

  function hidePlantHoverLabel() {
  const hadWorldNpcHover = Boolean(
    d.plantHoverLabel && d.plantHoverLabel.classList.contains("is-world-npc-name")
  );
  d.worldNpcHoverAnchorEl = null;
  d.clearWorldNpcHoverSticky();
  d.currentPlantHoverTarget = null;
  d.hasLastPlantHoverPointer = false;
  if (d.worldBagInventory) d.worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
  clearPlantHoverVisuals();
  if (d.plantHoverLabel) {
    d.plantHoverLabel.classList.remove(
      "is-seed-inventory-hint",
      "is-stage3-complete",
      "is-ui-shortcut-hint",
      "is-world-npc-name",
      "is-well-dock",
      "is-plant-world-sign",
      "is-dry",
      "is-overwatered"
    );
    d.plantHoverLabel.textContent = "";
    d.plantHoverLabel.style.position = "";
    d.plantHoverLabel.style.left = "";
    d.plantHoverLabel.style.top = "";
    d.plantHoverLabel.style.height = "";
    d.plantHoverLabel.style.right = "";
    d.plantHoverLabel.style.zIndex = "";
    d.plantHoverLabel.style.transform = "";
    d.plantHoverLabel.style.display = "none";
    restorePlantHoverLabelToWorldDom();
  }
  if (hadWorldNpcHover) d.updateNpcPosition();
  }

  function layoutPlantHoverRing(plant, urgentWater) {
  if (!d.plantHoverRing || !plant) return;
  const bounds = d.getPlantHoverRingWorldBounds(plant);
  if (!bounds || bounds.size <= 0) {
    d.clearPlantHoverRing();
    return;
  }
  d.plantHoverRing.classList.add("is-visible");
  d.plantHoverRing.classList.toggle("is-needs-water", !!urgentWater);
  d.plantHoverRing.style.display = "block";
  d.plantHoverRing.style.zIndex = String(d.getPlantDepthZIndex(d.getPlantDepthSortY(plant)) + 2);
  d.setWorldPosition(d.plantHoverRing, bounds.x, bounds.y);
  d.setWorldSize(d.plantHoverRing, bounds.size, bounds.size);
  }

  function plantShowsUrgentWaterHoverEmphasis(plant, now) {
  if (!d.canWaterPlantByClick(plant)) return false;
  const tNow = now != null ? now : d.getSharedPlantSimulationNow();
  if (d.shouldPauseWaterDecayForPlant(plant, tNow)) return false;
  if ((Number(plant.waterLevel) || 0) !== 0) return false;
  if (!d.canPlantWiltFromEmptyWater(plant, tNow)) return false;
  const becameEmptyAt = Number(plant.becameEmptyAt);
  if (!Number.isFinite(becameEmptyAt) || becameEmptyAt <= 0) return true;
  const dryMs =
    plant === d.getPlant()
      ? d.getMainDryAfterEmptyMsForPlant(plant, tNow)
      : d.getExtraDryDelayMs(plant, tNow);
  if (!Number.isFinite(dryMs) || dryMs <= 0) return true;
  const remainingDryMs = dryMs - (tNow - becameEmptyAt);
  return Math.floor(Math.max(0, remainingDryMs) / 60000) === 0;
  }

  function refreshPlantWaterHoverIfShown(plant) {
  if (!plant || !d.plantHoverLabel) return;
  if (d.plantHoverLabel.style.display === "none") return;
  showPlantHoverSignForPlant(plant);
  }

  function renderPlantCardForPlant(plant) {
  if (d.getPlantSoilBadStateTitle(plant)) {
    d.plantCard.style.display = "none";
    if (d.plantCardTitle) d.plantCardTitle.textContent = "";
    if (d.plantWaterText) {
      d.plantWaterText.textContent = "";
      d.plantWaterText.style.display = "none";
      d.plantWaterText.classList.remove("is-plant-card-hint");
    }
    if (d.plantWaterBar) d.plantWaterBar.style.display = "none";
    return;
  }
  const showMagicHint = d.isStage3CompleteAwaitingMagicPowder(plant);
  if (d.plantCardTitle) d.plantCardTitle.textContent = d.getPlantWorldLabel(plant);
  d.plantCard.classList.toggle("is-dry", plant.status === "dry");
  d.plantCard.classList.toggle("is-overwatered", plant.isOverwatered);
  if (showMagicHint) {
    d.plantWaterText.textContent = d.stage3CompleteMagicHint;
    syncPlantCardWaterReadoutVisibility(false);
    return;
  }
  if (shouldSuppressPlantWaterCardForSelfSustaining(plant)) {
    syncPlantCardWaterReadoutVisibility(false);
    return;
  }
  const waterCapacity = d.getPlantWaterCapacity(plant);
  d.plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plant.waterLevel + "/" + waterCapacity;
  d.plantWaterSegments.forEach(function (segment, index) {
    segment.style.display = index < waterCapacity ? "block" : "none";
    segment.classList.toggle("is-filled", index < plant.waterLevel);
  });
  syncPlantCardWaterReadoutVisibility(true);
  }

  function restorePlantHoverLabelToWorldDom() {
  if (!d.plantHoverLabel || !d.ground) return;
  if (d.plantHoverLabel.parentNode === d.ground) return;
  d.ground.appendChild(d.plantHoverLabel);
  }

  function shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed) {
  if (
    !extraSeed ||
    extraSeed.planted ||
    extraSeed.inInventory ||
    d.getInventory().heldItem === d.createHeldExtraSeed(extraSeed.id)
  ) {
    return false;
  }
  const tol = 14;
  return (
    Math.abs(extraSeed.x - d.WORLD_LOOSE_SEED_X) <= tol &&
    Math.abs(extraSeed.y - d.WORLD_LOOSE_SEED_Y) <= tol
  );
  }

  function shouldHideSeparateSoilUnderBigGrass(plant) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) return false;
  return d.getSproutStageFromPlant(plant) >= 4;
  }

  function shouldShowFirstWaterNeededDroplet(plant) {
  if (!plant) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  if (d.isPowderUpgradeInProgress(plant)) return false;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 4) return false;
  if (plant.isSproutGrown && d.getSproutStageFromPlant(plant) >= 4) return false;
  if (plant.needsFirstWater) return true;
  return d.isPlantAwaitingPlayerFirstPour(plant);
  }

  function shouldSkipPlantHoverVisualEmphasis(plant, now) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const tNow = now != null ? now : d.getSharedPlantSimulationNow();
  if (d.getSproutStageFromPlant(plant) < 3) return false;
  if (d.hasActiveGreenGrowthProgress(plant, tNow)) return false;
  if (d.isPowderUpgradeInProgress(plant)) return false;
  return true;
  }

  function shouldSuppressPlantWaterCardForSelfSustaining(plant) {
  if (!plant) return false;
  if (d.isStage3CompleteAwaitingMagicPowder(plant)) return true;
  return d.isFinalMaturePlantNoWaterCare(plant);
  }

  function showPlantHoverSignForPlant(plant) {
  if (!d.plantHoverLabel || !plant) return;
  if (!d.isPlantEligibleForWorldHover(plant)) {
    hidePlantHoverLabel();
    return;
  }
  d.worldNpcHoverAnchorEl = null;
  d.clearWorldNpcHoverSticky();
  d.currentPlantHoverTarget = plant;
  if (d.plantCard && window.getComputedStyle(d.plantCard).display !== "none") {
    hidePlantHoverLabel();
    return;
  }
  const label = d.getPlantWorldLabel(plant);
  const badTitle = d.getPlantSoilBadStateTitle(plant);
  if (!String(label || "").trim() && !badTitle) {
    hidePlantHoverLabel();
    return;
  }

  d.ensurePlantHoverLabelOnBodyForFixedUi();
  d.plantHoverLabel.classList.remove(
    "is-ui-shortcut-hint",
    "is-seed-inventory-hint",
    "is-world-npc-name",
    "is-stage3-complete"
  );
  d.plantHoverLabel.classList.add("is-well-dock", "is-plant-world-sign");
  d.plantHoverLabel.classList.toggle("is-dry", plant.status === "dry");
  d.plantHoverLabel.classList.toggle("is-overwatered", Boolean(plant.isOverwatered));
  d.plantHoverLabel.style.position = "fixed";
  d.plantHoverLabel.style.left = "auto";
  d.plantHoverLabel.style.top = "";
  d.plantHoverLabel.style.right = "";
  d.plantHoverLabel.style.transform = "none";
  d.plantHoverLabel.style.zIndex = "11";

  d.plantHoverLabel.textContent = "";
  if (String(label || "").trim()) {
    const titleEl = document.createElement("div");
    titleEl.className = "plant-world-sign-title";
    titleEl.textContent = label;
    d.plantHoverLabel.appendChild(titleEl);
  }

  d.appendPlantHoverWaterDetail(d.plantHoverLabel, plant);
  d.appendPlantHoverGoldDetail(d.plantHoverLabel, plant);

  d.plantHoverLabel.style.display = "flex";
  syncPlantHoverWellDockLayout();
  applyPlantHoverVisuals(plant);
  d.refreshPlantOccluderFade();
  }

  function syncPlantCardWaterReadoutVisibility(showWater) {
  if (!d.plantWaterText || !d.plantWaterBar) return;
  const shouldShowWater = showWater !== false;
  d.plantWaterText.style.display = "";
  d.plantWaterText.classList.toggle("is-plant-card-hint", !shouldShowWater);
  d.plantWaterBar.style.display = shouldShowWater ? "grid" : "none";
  }

  function syncPlantHoverWellDockLayout() {
  if (!d.plantHoverLabel || !d.wellCard) return;
  if (!d.plantHoverLabel.classList.contains("is-well-dock")) return;
  if (window.getComputedStyle(d.wellCard).display === "none") {
    d.plantHoverLabel.style.top = "";
    d.plantHoverLabel.style.height = "";
    return;
  }
  const rect = d.wellCard.getBoundingClientRect();
  d.plantHoverLabel.style.top = Math.round(rect.top) + "px";
  d.plantHoverLabel.style.height = Math.round(rect.height) + "px";
  }

  function teardownExtraPlantDom(p) {
  if (!p) return;
  if (p.spotElement && p.spotElement.isConnected) p.spotElement.remove();
  if (p.sproutElement && p.sproutElement.isConnected) p.sproutElement.remove();
  if (p.waterNeededElement && p.waterNeededElement.isConnected) p.waterNeededElement.remove();
  if (p.growthMeterElement && p.growthMeterElement.isConnected) p.growthMeterElement.remove();
  p.spotElement = undefined;
  p.sproutElement = undefined;
  p.waterNeededElement = undefined;
  p.growthMeterElement = undefined;
  p.growthMeterFill = undefined;
  }

  function updatePlantCard() {
  if (!d.plantCard) return;
  d.plantCard.style.display = "none";
  if (d.plantCardTitle) d.plantCardTitle.textContent = "";
  }

  function updatePlantGrowth() {
  const now = d.getSharedPlantSimulationNow();
  const powderRatio = d.getPowderUpgradeRatio(d.getPlant(), now);
  if (
    !d.getPlant().isSeedPlanted ||
    (d.getPlant().growthStartedAt === null &&
      powderRatio === null &&
      !d.getPlant().isSproutGrown) ||
    d.getPlant().status === "dry" ||
    d.getPlant().status === "rotten" ||
    d.getPlant().isOverwatered
  ) {
    d.growthCard.style.display = "none";
    d.mainPlantGrowthMeter.element.style.display = "none";
    d.sprout.style.display =
      d.getPlant().isSproutGrown && d.getPlant().status !== "rotten" && d.getPlant().status !== "dry"
        ? "block"
        : "none";
    d.updateSproutPosition();
    return;
  }

  const elapsed = d.getPlant().growthStartedAt === null ? 0 : now - d.getPlant().growthStartedAt;
  const growthRatio = d.getPlant().growthStartedAt === null
    ? 1
    : Math.min(1, elapsed / d.getPlantFirstGrowthDurationMs(d.getPlant()));
  const secondGrowthRatio = d.getPlantSecondGrowthRatio(d.getPlant(), now);
  updatePlantGrowthMeter(
    d.mainPlantGrowthMeter.element,
    d.mainPlantGrowthMeter.fill,
    d.getPlant().spotX,
    d.getPlant().spotY,
    growthRatio,
    secondGrowthRatio
  );
  const cardWidth = 42;
  const cardX = Math.max(
    0,
    Math.min(d.getPlant().spotX + d.PLANT_SPOT_WIDTH / 2 - cardWidth / 2, d.WORLD_WIDTH - cardWidth)
  );

  if (growthRatio >= 1) {
    if (!d.getPlant().isSproutGrown) {
      d.getPlant().isSproutGrown = true;
      d.getPlant().sproutGrownAt = now;
      d.getPlant().sproutEvolutionMs = 0;
      d.getPlant().sproutEvolutionLastTickAt = now;
      d.getPlant().isSproutSelfSustaining = false;
    }
    d.growthCard.style.display = "none";
    d.updateSproutPosition();
    d.saveSeedState();
    return;
  }

  d.growthCard.style.display = "none";
  d.growthFill.style.width = growthRatio * 100 + "%";
  d.setWorldPosition(d.growthCard, cardX, d.getPlant().spotY - 26);
  d.sprout.style.display = "none";
  d.updateSproutPosition();
  }

  function updatePlantGrowthMeter(element, fill, x, y, firstRatio, secondRatio) {
  if (!element || !fill) return;
  const ratio = secondRatio !== null ? secondRatio : firstRatio;
  if (ratio === null || ratio >= 1) {
    element.style.display = "none";
    return;
  }

  element.style.display = "block";
  fill.style.width = Math.round(ratio * 100) + "%";
  d.setWorldPosition(element, x + d.PLANT_SPOT_WIDTH / 2 - 21, y - 24);
  }

  function updatePlantProgressGauge() {
  d.syncWorldPlantFogVisuals();
  const score = d.getTotalPlantIndexScore();
  const legacyHud = document.getElementById("world-plant-index-hud");
  if (legacyHud) {
    legacyHud.style.display = "none";
    legacyHud.setAttribute("aria-hidden", "true");
  }
  const gauge = document.getElementById("plant-progress-gauge");
  if (!gauge) return;
  const progress =
    d.PLANT_INDEX_SCORE_CAP > 0
      ? Math.max(0, Math.min(1, score / d.PLANT_INDEX_SCORE_CAP))
      : 0;
  gauge.style.setProperty("--plant-fill", String(progress));

  const visible = Boolean(d.hasSpawnedCharacter && !d.isCharacterSelecting);
  gauge.classList.toggle("is-visible", visible);
  gauge.setAttribute("aria-hidden", visible ? "false" : "true");
  d.ensurePlantProgressScoreInTickRow();
  const scoreEl = document.getElementById("plant-progress-score");
  if (scoreEl) {
    scoreEl.textContent = String(score);
  }
  d.ensurePlantProgressSproutToggleBound();

  const meterEl = gauge.querySelector(".plant-progress-meter");
  const fillEl = gauge.querySelector(".plant-progress-fill");
  if (fillEl) {
    const ch =
      visible && meterEl && meterEl.getBoundingClientRect().height > 48
        ? meterEl.getBoundingClientRect().height
        : 388;
    const fillMax = Math.max(0, ch - 34);
    fillEl.style.height = Math.round(fillMax * progress) + "px";
  }

  if (!visible) return;

  gauge.querySelectorAll(".plant-progress-reward").forEach(function (reward) {
    const t = Number(reward.getAttribute("data-threshold"));
    if (!Number.isFinite(t)) return;
    reward.classList.toggle("is-unlocked", score >= t);
  });
  }

  function updatePlantState() {
  if (!d.getPlant().isSeedPlanted) {
    d.waterNeeded.style.display = "none";
    d.plantCard.style.display = "none";
    d.growthCard.style.display = "none";
    d.sprout.style.display = "none";
    d.plantSpot.removeAttribute("title");
    d.sprout.removeAttribute("title");
    if (d.plantCardTitle) d.plantCardTitle.textContent = "";
    if (d.mainPlantGrowthMeter && d.mainPlantGrowthMeter.element) {
      d.mainPlantGrowthMeter.element.style.display = "none";
    }
    return;
  }

  const now = d.getSharedPlantSimulationNow();

  if (
    (d.getPlant().status === "rotten" || d.getPlant().isOverwatered) &&
    d.getPlant().rottenAt != null
  ) {
    const rotAt = Number(d.getPlant().rottenAt);
    if (Number.isFinite(rotAt) && now - rotAt >= d.plantRotClearMs) {
      d.removeMainPlant();
      d.saveSeedState();
      d.syncWorldState(true);
      return;
    }
  }

  if (d.getPlant().status === "dry" && d.getPlant().drySoilAt != null) {
    const dryAt = Number(d.getPlant().drySoilAt);
    if (Number.isFinite(dryAt) && now - dryAt >= d.plantDrySoilClearMs) {
      d.removeMainPlant();
      d.saveSeedState();
      d.syncWorldState(true);
      return;
    }
  } else if (d.getPlant().status !== "dry") {
    d.getPlant().drySoilAt = null;
  }

  if (
    d.getPlant().status === "dry" &&
    (d.getPlant().drySoilAt == null || !Number.isFinite(Number(d.getPlant().drySoilAt)))
  ) {
    d.getPlant().drySoilAt = now;
  }

  d.normalizePlantSproutFieldsWhenSoilDry(d.getPlant());
  d.updatePlantWaterLevel();
  if (d.tickPlantGold(d.getPlant(), now)) {
    d.refreshPlantWaterHoverIfShown(d.getPlant());
  }
  if (d.tickPowderUpgrade(d.getPlant(), now)) {
    d.saveSeedState();
    d.syncWorldState(true);
  }
  d.ensureGrassAuto5EligibleForTier4Plant(d.getPlant(), now);
  if (d.tickGrassAutoAdvanceToTier5(d.getPlant(), now)) {
    d.saveSeedState();
    d.syncWorldState(true);
  }

  if (d.advanceOnboardingTutorialSproutForPlantIndex(d.getPlant(), now)) {
    d.onboardingTryStartPlantIndexAfterSproutStage3();
  }

  if (d.getPlant().isSproutGrown && !d.getPlant().isSproutSelfSustaining) {
    d.tickSproutEvolution(d.getPlant(), now);
  }

  if (
    d.getPlant().growthStartedAt != null &&
    d.getPlant().status !== "dry" &&
    d.getPlant().status !== "rotten" &&
    !d.getPlant().isOverwatered &&
    !d.getPlant().isSproutGrown &&
    now - d.getPlant().growthStartedAt >= d.getPlantFirstGrowthDurationMs(d.getPlant())
  ) {
    if (!d.makePlantStableStage3FromOvergrowthSeed(d.getPlant(), now)) {
      d.getPlant().isSproutGrown = true;
      d.getPlant().sproutGrownAt = now;
      d.getPlant().sproutEvolutionMs = 0;
      d.getPlant().sproutEvolutionLastTickAt = now;
      d.getPlant().isSproutSelfSustaining = false;
    }
    d.saveSeedState({
      bumpMergeGuard: false,
      skipWorldDirty: d.isSharedWorldMergeActive()
    });
  }

  if (
    d.getPlant().status !== "dry" &&
    d.canPlantWiltFromEmptyWater(d.getPlant(), now) &&
    d.getPlant().status !== "rotten" &&
    d.getPlant().becameEmptyAt !== null &&
    now - d.getPlant().becameEmptyAt >= d.getMainDryAfterEmptyMsForPlant(d.getPlant(), now)
  ) {
    // ??? ???? ??? ???): ?????? ? ???? ???? ? plantDrySoilClearMs ???????
    d.getPlant().status = "dry";
    d.getPlant().isOverwatered = false;
    d.getPlant().needsFirstWater = true;
    d.getPlant().blockSproutRegrowthAfterDry = true;
    d.getPlant().drySoilAt = now;
    d.cancelPlantPowderUpgrade(d.getPlant());
    d.getPlant().isSproutGrown = false;
    d.getPlant().sproutGrownAt = null;
    d.getPlant().growthStartedAt = null;
    d.getPlant().sproutEvolutionMs = 0;
    d.getPlant().sproutEvolutionLastTickAt = null;
    d.getPlant().isSproutSelfSustaining = false;
    d.saveSeedState();
  }

  const mainSoilRotten = d.getPlant().status === "rotten" || d.getPlant().isOverwatered;

  if (mainSoilRotten) {
    d.plantSpot.src = d.IMG_SOIL_ROTTEN;
  } else if (d.getPlant().status === "wet") {
    d.plantSpot.src = d.IMG_SOIL_WET;
  } else if (d.getPlant().status === "dry") {
    d.plantSpot.src = d.IMG_SOIL_DRY;
  } else {
    d.plantSpot.src = d.IMG_TILLED_SOIL;
  }

  if (mainSoilRotten) {
    d.waterNeeded.style.display = "none";
    d.growthCard.style.display = "none";
    d.sprout.style.display = "none";
  } else if (shouldShowFirstWaterNeededDroplet(d.getPlant())) {
    d.waterNeeded.style.display = "block";
    d.setWorldPosition(
      d.waterNeeded,
      d.getPlant().spotX + d.PLANT_SPOT_WIDTH / 2 - d.WATER_NEEDED_SIZE / 2,
      d.getPlant().spotY - d.WATER_NEEDED_SIZE - 2
    );
  } else {
    d.waterNeeded.style.display = "none";
  }

  d.ensureGrassOrdinalIfNeeded(d.getPlant());
  updatePlantCard();
  updatePlantGrowth();
  if (!mainSoilRotten) {
    d.plantSpot.style.display = shouldHideSeparateSoilUnderBigGrass(d.getPlant()) ? "none" : "block";
  } else {
    d.plantSpot.style.display = "block";
  }
  }

  return {
    applyPlantHoverVisuals,
    clearPlantHoverVisuals,
    ensureSharedPlantVisuals,
    extraPlantFromDomElement,
    getNearestBadSoilPlantForProximityCard,
    getPlantHoverDomElements,
    getPlantPrimaryVisualRectWorld,
    getSproutImageForPlant,
    hidePlantHoverLabel,
    layoutPlantHoverRing,
    plantShowsUrgentWaterHoverEmphasis,
    refreshPlantWaterHoverIfShown,
    renderPlantCardForPlant,
    restorePlantHoverLabelToWorldDom,
    shouldHideExtraSeedOverlappingDesignatedGroundPickSlot,
    shouldHideSeparateSoilUnderBigGrass,
    shouldShowFirstWaterNeededDroplet,
    shouldSkipPlantHoverVisualEmphasis,
    shouldSuppressPlantWaterCardForSelfSustaining,
    showPlantHoverSignForPlant,
    syncPlantCardWaterReadoutVisibility,
    syncPlantHoverWellDockLayout,
    teardownExtraPlantDom,
    updatePlantCard,
    updatePlantGrowth,
    updatePlantGrowthMeter,
    updatePlantProgressGauge,
    updatePlantState,
  };
}
