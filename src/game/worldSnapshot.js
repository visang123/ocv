/**
 * Shared world row (Supabase) ↔ in-memory game state.
 * Orchestration lives in script.js `applySharedWorldSnapshot`; parsers live here.
 */

import { BIG_TREE_X, BIG_TREE_Y } from "./constants.js";

const DEFAULT_SEED_LABEL = "\uC528\uC557";

export function readWaterLevel(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(3, number));
}

export function resolveSnapshotSavedAt(snapshot, serverRowUpdatedAt) {
  let savedAt = Number(snapshot.savedAt || 0);
  if (!savedAt && serverRowUpdatedAt) {
    const parsed =
      typeof serverRowUpdatedAt === "string"
        ? Date.parse(serverRowUpdatedAt)
        : Number(serverRowUpdatedAt);
    if (Number.isFinite(parsed) && parsed > 0) {
      savedAt = parsed;
    }
  }
  return savedAt;
}

/** Prefer inventory copy when the same seed id appears twice (world + local inv). */
export function dedupeExtraSeedsPreferInventory(extraSeeds) {
  const byId = Object.create(null);
  extraSeeds.forEach(function (seed) {
    const id = String(seed.id);
    const prev = byId[id];
    if (!prev) {
      byId[id] = seed;
      return;
    }
    const pickInv = Boolean(seed.inInventory);
    const prevInv = Boolean(prev.inInventory);
    let winner = prev;
    let loser = seed;
    if (pickInv && !prevInv) {
      winner = seed;
      loser = prev;
    } else if (prevInv && !pickInv) {
      winner = prev;
      loser = seed;
    }
    if (loser !== winner) {
      if (loser.element && typeof loser.element.remove === "function") {
        loser.element.remove();
      }
      if (loser.inventoryElement && typeof loser.inventoryElement.remove === "function") {
        loser.inventoryElement.remove();
      }
      loser.element = undefined;
      loser.inventoryElement = undefined;
      loser.inventoryImage = undefined;
    }
    byId[id] = winner;
  });
  return Object.keys(byId).map(function (key) {
    return byId[key];
  });
}

/** Shape expected by `applyLoadedPlantState` in script.js */
export function parseMainPlantFromSnapshot(mp) {
  const plantedFromSnapshot = {
    isSeedPlanted: Boolean(mp.isSeedPlanted),
    plantSpotX: Number(mp.plantSpotX) || 0,
    plantSpotY: Number(mp.plantSpotY) || 0,
    plantLastWateredAt: Number(mp.plantLastWateredAt) || null,
    plantWateredAtList: Array.isArray(mp.plantWateredAtList) ? mp.plantWateredAtList : [],
    plantState: mp.plantState || "normal",
    plantWaterLevel: readWaterLevel(mp.plantWaterLevel, 1),
    plantWaterLevelUpdatedAt: Number(mp.plantWaterLevelUpdatedAt) || Date.now(),
    plantBecameEmptyAt: Number(mp.plantBecameEmptyAt) || null,
    isPlantOverwatered: Boolean(mp.isPlantOverwatered),
    plantRottenAt: Number(mp.plantRottenAt) || null,
    plantNeedsFirstWater: Boolean(mp.plantNeedsFirstWater),
    plantGrowthStartedAt: Number(mp.plantGrowthStartedAt) || null,
    isSproutGrown: Boolean(mp.isSproutGrown),
    plantSproutGrownAt: Number(mp.plantSproutGrownAt) || null
  };
  if (Object.prototype.hasOwnProperty.call(mp, "sproutEvolutionMs")) {
    plantedFromSnapshot.sproutEvolutionMs = Number(mp.sproutEvolutionMs) || 0;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "sproutEvolutionLastTickAt")) {
    plantedFromSnapshot.sproutEvolutionLastTickAt = Number(mp.sproutEvolutionLastTickAt) || null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "isSproutSelfSustaining")) {
    plantedFromSnapshot.isSproutSelfSustaining = Boolean(mp.isSproutSelfSustaining);
  }
  if (Object.prototype.hasOwnProperty.call(mp, "growthTier")) {
    plantedFromSnapshot.growthTier = Math.max(0, Number(mp.growthTier) || 0);
  }
  if (Object.prototype.hasOwnProperty.call(mp, "waterCapacity")) {
    plantedFromSnapshot.waterCapacity = Math.max(2, Number(mp.waterCapacity) || 2);
  }
  if (Object.prototype.hasOwnProperty.call(mp, "powderUpgradeTargetTier")) {
    plantedFromSnapshot.powderUpgradeTargetTier = Math.max(
      0,
      Number(mp.powderUpgradeTargetTier) || 0
    );
  }
  if (Object.prototype.hasOwnProperty.call(mp, "powderUpgradeStartedAt")) {
    plantedFromSnapshot.powderUpgradeStartedAt = Number(mp.powderUpgradeStartedAt) || null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "powderUpgradeDurationMs")) {
    plantedFromSnapshot.powderUpgradeDurationMs = Math.max(
      0,
      Number(mp.powderUpgradeDurationMs) || 0
    );
  }
  return plantedFromSnapshot;
}

export function parseTreeAppleFromSnapshot(apple) {
  const localX = Number(apple.localX) || 20;
  const localY = Number(apple.localY) || 20;
  return {
    id: String(apple.id),
    localX,
    localY,
    x: BIG_TREE_X + localX,
    y: BIG_TREE_Y + localY,
    size: Number(apple.size) || 10
  };
}

export function parseSharedGroundSeedFromSnapshot(extraSeed) {
  return {
    id: String(extraSeed.id),
    x: Number(extraSeed.x) || 0,
    y: Number(extraSeed.y) || 0,
    createdAt: Number(extraSeed.createdAt) || Date.now(),
    planted: Boolean(extraSeed.planted),
    inInventory: false,
    label: extraSeed.label || DEFAULT_SEED_LABEL,
    isStarter: Boolean(extraSeed.isStarter)
  };
}

export function parseExtraPlantFromSnapshot(plant) {
  return {
    id: String(plant.id),
    x: Number(plant.x) || 0,
    y: Number(plant.y) || 0,
    plantedAt: Number(plant.plantedAt) || Date.now(),
    lastWateredAt: Number(plant.lastWateredAt) || null,
    wateredAtList: Array.isArray(plant.wateredAtList) ? plant.wateredAtList.slice() : [],
    status: plant.status || "normal",
    waterLevel: readWaterLevel(plant.waterLevel, 1),
    waterLevelUpdatedAt: Number(plant.waterLevelUpdatedAt) || Date.now(),
    becameEmptyAt: Number(plant.becameEmptyAt) || null,
    isOverwatered: Boolean(plant.isOverwatered),
    rottenAt: Number(plant.rottenAt) || null,
    needsFirstWater: Boolean(plant.needsFirstWater),
    growthStartedAt: Number(plant.growthStartedAt) || null,
    isSproutGrown: Boolean(plant.isSproutGrown),
    sproutGrownAt: Number(plant.sproutGrownAt) || null,
    sproutEvolutionMs: Object.prototype.hasOwnProperty.call(plant, "sproutEvolutionMs")
      ? Math.max(0, Number(plant.sproutEvolutionMs) || 0)
      : 0,
    sproutEvolutionLastTickAt: Object.prototype.hasOwnProperty.call(
      plant,
      "sproutEvolutionLastTickAt"
    )
      ? Number(plant.sproutEvolutionLastTickAt) || null
      : null,
    isSproutSelfSustaining: Object.prototype.hasOwnProperty.call(
      plant,
      "isSproutSelfSustaining"
    )
      ? Boolean(plant.isSproutSelfSustaining)
      : false,
    growthTier: Object.prototype.hasOwnProperty.call(plant, "growthTier")
      ? Math.max(0, Number(plant.growthTier) || 0)
      : 0,
    waterCapacity: Object.prototype.hasOwnProperty.call(plant, "waterCapacity")
      ? Math.max(2, Number(plant.waterCapacity) || 2)
      : 2,
    powderUpgradeTargetTier: Object.prototype.hasOwnProperty.call(plant, "powderUpgradeTargetTier")
      ? Math.max(0, Number(plant.powderUpgradeTargetTier) || 0)
      : 0,
    powderUpgradeStartedAt: Object.prototype.hasOwnProperty.call(plant, "powderUpgradeStartedAt")
      ? Number(plant.powderUpgradeStartedAt) || null
      : null,
    powderUpgradeDurationMs: Object.prototype.hasOwnProperty.call(plant, "powderUpgradeDurationMs")
      ? Math.max(0, Number(plant.powderUpgradeDurationMs) || 0)
      : 0
  };
}
