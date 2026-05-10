export function createWellState(maxWellWaterValue) {
  return {
    water: maxWellWaterValue,
    lastRefillAt: Date.now()
  };
}

export function createAppleState(initialApples) {
  return {
    count: 0,
    pickedIds: [],
    isEating: false,
    nextSeedOffset: 0,
    extraSeeds: [],
    extraPlants: [],
    lastSpawnAt: Date.now(),
    apples: initialApples
  };
}

export function createPlantState() {
  return {
    isSeedPlanted: false,
    isPlanting: false,
    seedCreatedAt: Date.now(),
    isSeedDry: false,
    spotX: 0,
    spotY: 0,
    lastWateredAt: null,
    wateredAtList: [],
    status: "normal",
    waterLevel: 1,
    waterLevelUpdatedAt: Date.now(),
    becameEmptyAt: null,
    isOverwatered: false,
    rottenAt: null,
    needsFirstWater: false,
    growthStartedAt: null,
    isSproutGrown: false,
    sproutGrownAt: null,
    sproutEvolutionMs: 0,
    sproutEvolutionLastTickAt: null,
    isSproutSelfSustaining: false,
    growthTier: 0,
    waterCapacity: 2,
    powderUpgradeTargetTier: 0,
    powderUpgradeStartedAt: null,
    powderUpgradeDurationMs: 0,
    grassAuto5EligibleAt: null,
    /** 심은 시각(ms). 살아 있는 새싹/풀 번호 정렬에 사용( rotten/dry 등은 제외). */
    plantedAt: null,
    ownerUserId: "",
    ownerDisplayName: "",
    sproutOrdinal: 0,
    grassOrdinal: null
  };
}

