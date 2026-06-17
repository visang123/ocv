import { plantCareLevelFromGrowthTier, SECOND_MS } from "./constants.js";

export const PLANT_GOLD_CAP_LOW_KRW = 250;
export const PLANT_GOLD_CAP_HIGH_KRW = 500;

const GOLD_PRODUCTION_BY_CARE_LEVEL = {
  1: { intervalMs: 10 * SECOND_MS, amountPerTick: 1 },
  2: { intervalMs: 5 * SECOND_MS, amountPerTick: 1 },
  3: { intervalMs: 2 * SECOND_MS, amountPerTick: 1 },
  4: { intervalMs: SECOND_MS, amountPerTick: 2 },
  5: { intervalMs: SECOND_MS, amountPerTick: 5 }
};

export function getPlantGoldCapKrw(plant) {
  const level = plantCareLevelFromGrowthTier(plant && plant.growthTier);
  return level >= 4 ? PLANT_GOLD_CAP_HIGH_KRW : PLANT_GOLD_CAP_LOW_KRW;
}

export function canPlantProduceGold(plant) {
  if (!plant) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  return true;
}

export function getPlantGoldKrw(plant) {
  return Math.max(0, Math.floor(Number(plant && plant.plantGoldKrw) || 0));
}

export function ensurePlantGoldFields(plant, now) {
  if (!plant) return;
  if (plant.plantGoldKrw == null) plant.plantGoldKrw = 0;
  const ts = Number(plant.plantGoldUpdatedAt);
  if (plant.plantGoldUpdatedAt == null || !Number.isFinite(ts)) {
    plant.plantGoldUpdatedAt = now;
  }
}

export function tickPlantGold(plant, now) {
  if (!plant) return false;
  ensurePlantGoldFields(plant, now);
  if (!canPlantProduceGold(plant)) {
    plant.plantGoldUpdatedAt = now;
    return false;
  }

  const cap = getPlantGoldCapKrw(plant);
  let gold = getPlantGoldKrw(plant);
  if (gold >= cap) {
    plant.plantGoldUpdatedAt = now;
    return false;
  }

  const level = plantCareLevelFromGrowthTier(plant.growthTier);
  const prod = GOLD_PRODUCTION_BY_CARE_LEVEL[level] || GOLD_PRODUCTION_BY_CARE_LEVEL[1];
  let lastAt = Number(plant.plantGoldUpdatedAt);
  if (!Number.isFinite(lastAt)) lastAt = now;
  let changed = false;

  while (gold < cap && now - lastAt >= prod.intervalMs) {
    const add = Math.min(prod.amountPerTick, cap - gold);
    gold += add;
    lastAt += prod.intervalMs;
    changed = true;
    if (add < prod.amountPerTick) break;
  }

  const prev = getPlantGoldKrw(plant);
  plant.plantGoldKrw = gold;
  plant.plantGoldUpdatedAt = gold >= cap ? now : lastAt;
  return changed || prev !== gold;
}

export function collectPlantGoldKrw(plant, now) {
  if (!plant) return 0;
  ensurePlantGoldFields(plant, now);
  const amount = getPlantGoldKrw(plant);
  plant.plantGoldKrw = 0;
  plant.plantGoldUpdatedAt = now;
  return amount;
}
