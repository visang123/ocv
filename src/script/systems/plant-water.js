/** Systems — 식물 수분·감쇠 규칙. */
export function createModule(d) {
  function applyPlantWaterDecay(plant, now) {
  if (d.shouldSkipPlantWaterDecayNow(now)) return;
  plant.waterLevel = Math.max(0, Number(plant.waterLevel) || 0);
  if (plant.waterLevel <= 0) {
    return;
  }
  let updatedAt = Number(plant.waterLevelUpdatedAt);
/** ????? 4?? ???? ?????(????????) ???????? ????? ?????; ????? ???????null */
  if (!Number.isFinite(updatedAt) || updatedAt <= 0) {
    updatedAt = now;
    plant.waterLevelUpdatedAt = updatedAt;
  }
  let guard = 0;
  while (plant.waterLevel > 0 && guard < 2000) {
    guard += 1;
    const tickMs = d.getPlantWaterLevelTickMsForPlant(plant);
    if (!Number.isFinite(tickMs) || tickMs <= 0) break;
    if (now - updatedAt < tickMs) break;
    const previousWaterLevel = plant.waterLevel;
    plant.waterLevel -= 1;
    updatedAt += tickMs;
    if (previousWaterLevel > 0 && plant.waterLevel === 0 && plant.becameEmptyAt === null) {
      plant.becameEmptyAt = updatedAt;
    }
  }
  plant.waterLevelUpdatedAt = updatedAt;
  }

  function getAutoTier5GrowMsForPlant(plant) {
  return d.isCactusMaturePlant(plant) ? d.cactusLevel5GrowMs : d.level5GrowMs;
  }

  function getGrassAutoTier5GrowthRatio(plant, now) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 4) return null;
  if (d.isPowderUpgradeInProgress(plant)) return null;
  if (!plant.isSproutGrown || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return null;
  }
  const t0 = plant.grassAuto5EligibleAt;
  if (t0 == null || !Number.isFinite(Number(t0))) return null;
  const elapsed = now - Number(t0);
  if (elapsed <= 0) return 0;
  return Math.min(1, elapsed / d.getAutoTier5GrowMsForPlant(plant));
  }

  function getPlantGrowthRatio(plant, now) {
  if (!plant.growthStartedAt || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return null;
  if (plant.isSproutGrown) return 1;
  return Math.min(1, Math.max(0, (now - plant.growthStartedAt) / d.getPlantFirstGrowthDurationMs(plant)));
  }

  function getPlantSecondGrowthRatio(plant, now) {
  const powderRatio = d.getPowderUpgradeRatio(plant, now);
  if (powderRatio !== null) return powderRatio;
  const grass5Ratio = d.getGrassAutoTier5GrowthRatio(plant, now);
  if (grass5Ratio !== null) return grass5Ratio;
  if (!plant.isSproutGrown || plant.status === "dry" || plant.status === "rotten") return null;
  if (plant.isSproutSelfSustaining) return null;
  const ev = plant.sproutEvolutionMs || 0;
  if (ev < d.sproutStage1Ms) {
    return Math.min(1, Math.max(0, ev / d.sproutStage1Ms));
  }
  return Math.min(1, Math.max(0, (ev - d.sproutStage1Ms) / d.sproutStage2GrowMs));
  }

  function getPlantStateForStorage() {
  return {
    isSeedPlanted: d.getPlant().isSeedPlanted,
    plantSpotX: d.getPlant().spotX,
    plantSpotY: d.getPlant().spotY,
    plantLastWateredAt: d.getPlant().lastWateredAt,
    plantWateredAtList: d.getPlant().wateredAtList,
    plantState: d.getPlant().status,
    plantWaterLevel: d.getPlant().waterLevel,
    plantWaterLevelUpdatedAt: d.getPlant().waterLevelUpdatedAt,
    plantBecameEmptyAt: d.getPlant().becameEmptyAt,
    isPlantOverwatered: d.getPlant().isOverwatered,
    plantRottenAt: d.getPlant().rottenAt,
    plantNeedsFirstWater: d.getPlant().needsFirstWater,
    plantGrowthStartedAt: d.getPlant().growthStartedAt,
    plantSeedKind: d.getPlant().seedKind != null ? String(d.getPlant().seedKind) : "",
    plantPlantedAt: d.getPlant().plantedAt != null ? d.getPlant().plantedAt : null,
    plantedAt: d.getPlant().plantedAt != null ? d.getPlant().plantedAt : null,
    isSproutGrown: d.getPlant().isSproutGrown,
    plantSproutGrownAt: d.getPlant().sproutGrownAt,
    sproutEvolutionMs: d.getPlant().sproutEvolutionMs,
    sproutEvolutionLastTickAt: d.getPlant().sproutEvolutionLastTickAt,
    isSproutSelfSustaining: d.getPlant().isSproutSelfSustaining,
    growthTier: d.getPlant().growthTier,
    waterCapacity: d.getPlant().waterCapacity,
    powderUpgradeTargetTier: d.getPlant().powderUpgradeTargetTier,
    powderUpgradeStartedAt: d.getPlant().powderUpgradeStartedAt,
    powderUpgradeDurationMs: d.getPlant().powderUpgradeDurationMs,
    grassAuto5EligibleAt: d.getPlant().grassAuto5EligibleAt,
    ownerUserId: d.getPlant().ownerUserId || "",
    ownerDisplayName: d.getPlant().ownerDisplayName || "",
    sproutOrdinal: d.getPlant().sproutOrdinal || 0,
    grassOrdinal:
      d.getPlant().grassOrdinal != null && Number.isFinite(Number(d.getPlant().grassOrdinal))
        ? d.getPlant().grassOrdinal
        : null,
    matureKind: d.getPlant().matureKind != null ? String(d.getPlant().matureKind) : "",
    flowerOrdinal:
      d.getPlant().flowerOrdinal != null && Number.isFinite(Number(d.getPlant().flowerOrdinal))
        ? d.getPlant().flowerOrdinal
        : null,
    treeOrdinal:
      d.getPlant().treeOrdinal != null && Number.isFinite(Number(d.getPlant().treeOrdinal))
        ? d.getPlant().treeOrdinal
        : null,
    cactusOrdinal:
      d.getPlant().cactusOrdinal != null && Number.isFinite(Number(d.getPlant().cactusOrdinal))
        ? d.getPlant().cactusOrdinal
        : null,
    blockSproutRegrowthAfterDry: Boolean(d.getPlant().blockSproutRegrowthAfterDry),
    drySoilAt:
      d.getPlant().drySoilAt != null && Number.isFinite(Number(d.getPlant().drySoilAt))
        ? Number(d.getPlant().drySoilAt)
        : null,
    npcX: d.getNpc().x,
    npcY: d.getNpc().y
  };
  }

  function getPlantWaterCapacity(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 4 && d.isCactusMaturePlant(plant)) return 1;
  if (tier >= 3) return 3;
  return Math.max(2, Number(plant.waterCapacity) || 2);
  }

  function getPowderUpgradeRatio(plant, now) {
  if (!d.isPowderUpgradeInProgress(plant)) return null;
  const startedAt = Number(plant.powderUpgradeStartedAt) || 0;
  const duration = Number(plant.powderUpgradeDurationMs) || 0;
  if (!startedAt || !duration) return null;
  return Math.min(1, Math.max(0, (now - startedAt) / duration));
  }

  function getSharedPlantSimulationNow() {
  return d.isSharedWorldMergeActive() ? d.getSynchronizedNow() : Date.now();
  }

  function getSproutStageFromPlant(plant) {
  if (!plant || !plant.isSproutGrown) return 0;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 5) return 5;
  if (tier >= 4) return 4;
  if (plant.isSproutSelfSustaining) return 3;
  const ev = plant.sproutEvolutionMs || 0;
  if (ev < d.sproutStage1Ms) return 1;
  return 2;
  }

  function getSynchronizedNow() {
  return getSynchronizedNowCore(d.serverClockOffsetMs);
  }

  function hasActiveGreenGrowthProgress(plant, now) {
  const g1 = d.getPlantGrowthRatio(plant, now);
  if (g1 !== null && g1 < 1) return true;
  const g2 = d.getPlantSecondGrowthRatio(plant, now);
  if (g2 !== null && g2 < 1) return true;
  return false;
  }

  function isPowderUpgradeInProgress(plant) {
  return (
    Number(plant.powderUpgradeTargetTier) > 0 &&
    Number(plant.powderUpgradeDurationMs) > 0 &&
    Number(plant.powderUpgradeStartedAt) > 0
  );
  }

  function isSharedWorldMergeActive() {
  return d.isWorldServerSyncAvailable() && d.hasHydratedSharedWorldFromServer;
  }

  function isSproutStage3Or5IdleNoGrowth(plant, now) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const st = d.getSproutStageFromPlant(plant);
  if (st !== 3 && st !== 5) return false;
  if (d.hasActiveGreenGrowthProgress(plant, now)) return false;
  if (d.isPowderUpgradeInProgress(plant)) return false;
  return true;
  }

  function isWorldServerSyncAvailable() {
  return Boolean(
    window.OVCOnline &&
    typeof window.OVCOnline.saveWorldState === "function" &&
    typeof window.OVCOnline.loadWorldState === "function" &&
    window.OVCOnline.isConfigured &&
    window.OVCOnline.isConfigured()
  );
  }

  function markWorldDirty() {
  if (d.isApplyingWorldState) return;
  d.isWorldDirty = true;
  }

  function saveSeedState(opts) {
  opts = opts || {};
  const bump = opts.bumpMergeGuard !== false;
  if (bump) d.getPlant().lastMainPlantStateChangeAt = Date.now();
  d.saveSeedStateToStorage({
    d.seedCreatedAtKey,
    d.seedPlantedStateKey,
    seedCreatedAt: d.getPlant().seedCreatedAt,
    plantedState: d.getPlantStateForStorage()
  });
  if (!opts.skipWorldDirty) d.markWorldDirty();
  }

  function shouldPauseWaterDecayForPlant(plant, now) {
  return d.isSproutStage3Or5IdleNoGrowth(plant, now);
  }

  function shouldSkipPlantWaterDecayNow(simNow) {
  const t = Number(simNow);
  return Number.isFinite(t) && t > 0 && t < d.suppressPlantWaterDecayUntilSim;
  }

  function updatePlantWaterLevel() {
  if (
    !d.getPlant().isSeedPlanted ||
    d.getPlant().isOverwatered ||
    d.getPlant().status === "dry" ||
    d.getPlant().status === "rotten"
  ) {
    return;
  }

  const now = d.getSharedPlantSimulationNow();

  if (d.shouldPauseWaterDecayForPlant(d.getPlant(), now)) {
    if (d.getPlant().waterLevel > 0 && d.getPlant().becameEmptyAt != null) {
      d.getPlant().becameEmptyAt = null;
    }
    if (d.getPlant().waterLevel <= 0 && d.getPlant().becameEmptyAt === null) {
      d.getPlant().becameEmptyAt = d.getPlant().waterLevelUpdatedAt || now;
    }
    d.getPlant().waterLevelUpdatedAt = now;
    return;
  }

  d.applyPlantWaterDecay(d.getPlant(), now);

  if (d.getPlant().waterLevel === 0 && d.getPlant().becameEmptyAt === null) {
    d.getPlant().becameEmptyAt = d.getPlant().waterLevelUpdatedAt;
  }

  if (d.getPlant().waterLevel < d.getPlantWaterCapacity(d.getPlant()) && !d.getPlant().isOverwatered) {
    d.getPlant().isOverwatered = false;
  }

  d.saveSeedState({
    bumpMergeGuard: false,
    skipWorldDirty: d.isSharedWorldMergeActive()
  });
  }

  return {
    applyPlantWaterDecay,
    getAutoTier5GrowMsForPlant,
    getGrassAutoTier5GrowthRatio,
    getPlantGrowthRatio,
    getPlantSecondGrowthRatio,
    getPlantStateForStorage,
    getPlantWaterCapacity,
    getPowderUpgradeRatio,
    getSharedPlantSimulationNow,
    getSproutStageFromPlant,
    getSynchronizedNow,
    hasActiveGreenGrowthProgress,
    isPowderUpgradeInProgress,
    isSharedWorldMergeActive,
    isSproutStage3Or5IdleNoGrowth,
    isWorldServerSyncAvailable,
    markWorldDirty,
    saveSeedState,
    shouldPauseWaterDecayForPlant,
    shouldSkipPlantWaterDecayNow,
    updatePlantWaterLevel,
  };
}
