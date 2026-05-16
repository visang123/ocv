import {
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y
} from "./constants.js";

export function createWellState(maxWellWaterValue) {
  return {
    water: maxWellWaterValue,
    lastRefillAt: Date.now()
  };
}

export function createAppleState(initialApples) {
  return {
    count: 0,
    /** 월드 허브 땅 씨 줍기 누적 — 튜토 extraSeeds와 별개(groundSeed.js). */
    seedCount: 0,
    overgrowthSeedCount: 0,
    pickedIds: [],
    isEating: false,
    nextSeedOffset: 0,
    extraSeeds: [],
    extraPlants: [],
    lastSpawnAt: Date.now(),
    apples: initialApples,
    worldLooseSeed: {
      x: WORLD_LOOSE_SEED_X,
      y: WORLD_LOOSE_SEED_Y,
      nextSpawnAt: 0
    },
    worldRocks: [],
    worldRockPickedIds: [],
    worldExtraBuckets: []
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
    soilOrdinal: 0,
    sproutOrdinal: 0,
    grassOrdinal: null,
    /** 4·5단 성숙 형태: grass | flower | tree | cactus */
    matureKind: "",
    flowerOrdinal: null,
    treeOrdinal: null,
    cactusOrdinal: null,
    /** 마른 땅(작물 고사) 이후에는 물만으로 새싹 타이머가 다시 시작되지 않음 — 새로 심을 때만 false */
    blockSproutRegrowthAfterDry: false,
    /** status가 dry로 바뀐 시각(ms). plantDrySoilClearMs 후 칸 제거 */
    drySoilAt: null
  };
}

