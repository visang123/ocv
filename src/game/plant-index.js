import {
  PLANT_INDEX_SCORE_CAP,
  PLANT_INDEX_SEEDED_SOIL,
  PLANT_INDEX_SPROUT_STAGE_1,
  PLANT_INDEX_SPROUT_STAGE_2,
  PLANT_INDEX_SPROUT_STAGE_3,
  PLANT_INDEX_GRASS_STAGE_4,
  PLANT_INDEX_GRASS_STAGE_5
} from "./constants.js";
import { normalizePlantMatureKind } from "./magic-powder.js";

/** 꽃·나무·선인장 번호가 있는데 growthTier만 낮은 저장 데이터 보정 */
export function reconcileMaturePlantGrowthTierFromOrdinal(plant) {
  if (!plant) return;
  const kind = normalizePlantMatureKind(plant.matureKind);
  if (kind === "grass") return;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 4) return;
  const ord =
    kind === "flower"
      ? Math.max(0, Number(plant.flowerOrdinal) || 0)
      : kind === "tree"
        ? Math.max(0, Number(plant.treeOrdinal) || 0)
        : Math.max(0, Number(plant.cactusOrdinal) || 0);
  if (ord > 0) {
    plant.growthTier = 4;
  }
}

function isPlantPlantedForIndex(plant) {
  return (
    plant.isSeedPlanted ||
    (
      plant.plantedAt != null &&
      Number.isFinite(Number(plant.x)) &&
      Number.isFinite(Number(plant.y))
    )
  );
}

/**
 * 식물지수용 성장 단계(0~5). 풀·꽃·나무·선인장 동일 점수표.
 * growthTier(4·5)와 새싹 단계를 함께 반영하고, 가루/자동 5단 완료 직전 틱도 맞춤.
 */
export function resolvePlantIndexGrowthLevel(plant, options) {
  if (!plant || plant.removed) return 0;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return 0;
  if (!isPlantPlantedForIndex(plant)) return 0;
  if (!plant.isSproutGrown) return 0;

  const now = options && options.now != null ? options.now : Date.now();
  let tier = Math.max(0, Number(plant.growthTier) || 0);

  if (options && typeof options.isPowderUpgradeInProgress === "function") {
    if (options.isPowderUpgradeInProgress(plant)) {
      const target = Math.max(0, Number(plant.powderUpgradeTargetTier) || 0);
      if (typeof options.getPowderUpgradeRatio === "function") {
        const ratio = options.getPowderUpgradeRatio(plant, now);
        if (ratio !== null && ratio >= 1) {
          tier = Math.max(tier, target);
        }
      }
    }
  }

  if (
    tier === 4 &&
    options &&
    typeof options.getGrassAutoTier5GrowthRatio === "function"
  ) {
    const autoRatio = options.getGrassAutoTier5GrowthRatio(plant, now);
    if (autoRatio !== null && autoRatio >= 1) {
      tier = 5;
    }
  }

  let stage = tier;
  if (options && typeof options.getSproutStageFromPlant === "function") {
    stage = Math.max(tier, options.getSproutStageFromPlant(plant));
  }

  return Math.min(5, Math.max(0, stage));
}

/** 식물 1개가 식물지수에 기여하는 점수(말라썩음 등 비정상 0) */
export function getPlantIndexPointsForSinglePlant(plant, options) {
  if (!plant || plant.removed) return 0;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return 0;
  if (!isPlantPlantedForIndex(plant)) return 0;
  if (!plant.isSproutGrown) return PLANT_INDEX_SEEDED_SOIL;

  const level = resolvePlantIndexGrowthLevel(plant, options);
  if (level <= 0) return PLANT_INDEX_SEEDED_SOIL;
  if (level === 1) return PLANT_INDEX_SPROUT_STAGE_1;
  if (level === 2) return PLANT_INDEX_SPROUT_STAGE_2;
  if (level === 3) return PLANT_INDEX_SPROUT_STAGE_3;
  if (level === 4) return PLANT_INDEX_GRASS_STAGE_4;
  return PLANT_INDEX_GRASS_STAGE_5;
}

export function sumPlantIndexScoreForPlants(plants, options, bonus) {
  let sum = 0;
  if (Array.isArray(plants)) {
    plants.forEach(function (p) {
      if (!p || p.removed) return;
      sum += getPlantIndexPointsForSinglePlant(p, options);
    });
  }
  const extra = Math.max(0, Math.floor(Number(bonus) || 0));
  return Math.min(PLANT_INDEX_SCORE_CAP, Math.max(0, sum + extra));
}
