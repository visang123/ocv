import { maxWellWater, wellRefillMs, SECOND_MS } from "./constants.js";

export const WELL_REFILL_MS_MIN = 5 * SECOND_MS;
export const WELL_UPGRADE_REFILL_REDUCTION_MS = 5 * SECOND_MS;
export const WELL_UPGRADE_GOAL_BASE_KRW = 100;

export function getWellUpgradeLevel(well) {
  return Math.max(0, Math.floor(Number(well && well.upgradeLevel) || 0));
}

export function getWellDonationKrw(well) {
  return Math.max(0, Math.floor(Number(well && well.donationKrw) || 0));
}

export function getWellUpgradeGoalKrwForLevel(level) {
  const safeLevel = Math.max(0, Math.floor(Number(level) || 0));
  return (safeLevel + 1) * WELL_UPGRADE_GOAL_BASE_KRW;
}

export function getWellUpgradeGoalKrw(well) {
  return getWellUpgradeGoalKrwForLevel(getWellUpgradeLevel(well));
}

export function getWellMaxWater(well) {
  return maxWellWater + getWellUpgradeLevel(well);
}

export function getWellRefillMs(well) {
  const level = getWellUpgradeLevel(well);
  return Math.max(
    WELL_REFILL_MS_MIN,
    wellRefillMs - level * WELL_UPGRADE_REFILL_REDUCTION_MS
  );
}

export function getWellDonationProgressRatio(well) {
  const goal = getWellUpgradeGoalKrw(well);
  if (goal <= 0) return 1;
  return Math.min(1, getWellDonationKrw(well) / goal);
}

export function clampWellWaterToCapacity(well) {
  if (!well) return;
  const cap = getWellMaxWater(well);
  well.water = Math.max(0, Math.min(cap, Math.floor(Number(well.water) || 0)));
}

/**
 * @param {ReturnType<typeof import("./state.js").createWellState>} well
 * @param {number} amountKrw
 */
export function tryApplyWellDonation(well, amountKrw) {
  const donate = Math.max(0, Math.floor(Number(amountKrw) || 0));
  if (!well || donate <= 0) {
    return { ok: false, reason: "invalid", donated: 0, upgraded: false, upgradeLevels: 0 };
  }

  let level = getWellUpgradeLevel(well);
  let donation = getWellDonationKrw(well) + donate;
  let upgraded = false;
  let upgradeLevels = 0;

  while (donation >= getWellUpgradeGoalKrwForLevel(level)) {
    donation -= getWellUpgradeGoalKrwForLevel(level);
    level += 1;
    upgraded = true;
    upgradeLevels += 1;
  }

  well.upgradeLevel = level;
  well.donationKrw = donation;
  clampWellWaterToCapacity(well);

  return {
    ok: true,
    donated: donate,
    upgraded,
    upgradeLevels,
    newLevel: level
  };
}

export function resetWellUpgradeState(well) {
  if (!well) return;
  well.upgradeLevel = 0;
  well.donationKrw = 0;
  clampWellWaterToCapacity(well);
}
