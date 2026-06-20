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

/** 로컬 골드 상태가 스냅샷보다 최신일 때(회수 직후 등) per-plant 골드를 유지 */
export function shouldPreferPriorPlantGold(prior, incoming) {
  if (!prior || !incoming) return false;
  const prevGold = getPlantGoldKrw(prior);
  const snapGold = getPlantGoldKrw(incoming);
  const prevAt = Number(prior.plantGoldUpdatedAt);
  const snapAt = Number(incoming.plantGoldUpdatedAt);
  if (!Number.isFinite(prevAt) || prevAt <= 0) return false;
  if (!Number.isFinite(snapAt) || snapAt <= 0) return true;
  if (prevAt > snapAt) return true;
  if (prevAt === snapAt && prevGold !== snapGold) {
    return prevGold < snapGold;
  }
  return false;
}

export function applyPriorPlantGoldIfPreferred(incoming, prior) {
  if (!shouldPreferPriorPlantGold(prior, incoming)) return;
  incoming.plantGoldKrw = getPlantGoldKrw(prior);
  incoming.plantGoldUpdatedAt = prior.plantGoldUpdatedAt;
}
