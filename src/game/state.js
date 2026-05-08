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
    needsFirstWater: false,
    growthStartedAt: null,
    isSproutGrown: false,
    sproutGrownAt: null,
    sproutEvolutionMs: 0,
    sproutEvolutionLastTickAt: null,
    isSproutSelfSustaining: false
  };
}

