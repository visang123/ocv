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
  let serverAt = 0;
  if (serverRowUpdatedAt != null && serverRowUpdatedAt !== "") {
    const parsed =
      typeof serverRowUpdatedAt === "string"
        ? Date.parse(serverRowUpdatedAt)
        : Number(serverRowUpdatedAt);
    if (Number.isFinite(parsed) && parsed > 0) {
      serverAt = parsed;
    }
  }
  if (serverAt > 0) {
    return serverAt;
  }
  const clientSavedAt = Number(snapshot && snapshot.savedAt) || 0;
  return clientSavedAt;
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
    plantWaterLevelUpdatedAt:
      Object.prototype.hasOwnProperty.call(mp, "plantWaterLevelUpdatedAt") &&
      Number.isFinite(Number(mp.plantWaterLevelUpdatedAt)) &&
      Number(mp.plantWaterLevelUpdatedAt) > 0
        ? Number(mp.plantWaterLevelUpdatedAt)
        : null,
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
  if (
    Object.prototype.hasOwnProperty.call(mp, "grassAuto5EligibleAt") &&
    mp.grassAuto5EligibleAt != null &&
    Number.isFinite(Number(mp.grassAuto5EligibleAt))
  ) {
    plantedFromSnapshot.grassAuto5EligibleAt = Number(mp.grassAuto5EligibleAt);
  } else if (Object.prototype.hasOwnProperty.call(mp, "grassAuto5EligibleAt")) {
    plantedFromSnapshot.grassAuto5EligibleAt = null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "ownerUserId")) {
    plantedFromSnapshot.ownerUserId = mp.ownerUserId != null ? String(mp.ownerUserId) : "";
  }
  if (Object.prototype.hasOwnProperty.call(mp, "ownerDisplayName")) {
    plantedFromSnapshot.ownerDisplayName =
      mp.ownerDisplayName != null ? String(mp.ownerDisplayName) : "";
  }
  if (Object.prototype.hasOwnProperty.call(mp, "plantSeedKind")) {
    plantedFromSnapshot.plantSeedKind = String(mp.plantSeedKind || "");
  } else if (Object.prototype.hasOwnProperty.call(mp, "seedKind")) {
    plantedFromSnapshot.plantSeedKind = String(mp.seedKind || "");
  }
  if (Object.prototype.hasOwnProperty.call(mp, "sproutOrdinal")) {
    plantedFromSnapshot.sproutOrdinal = Math.max(0, Number(mp.sproutOrdinal) || 0);
  }
  if (
    Object.prototype.hasOwnProperty.call(mp, "grassOrdinal") &&
    mp.grassOrdinal != null &&
    Number.isFinite(Number(mp.grassOrdinal))
  ) {
    plantedFromSnapshot.grassOrdinal = Math.max(1, Number(mp.grassOrdinal));
  } else if (Object.prototype.hasOwnProperty.call(mp, "grassOrdinal")) {
    plantedFromSnapshot.grassOrdinal = null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "matureKind")) {
    plantedFromSnapshot.matureKind = mp.matureKind != null ? String(mp.matureKind) : "";
  }
  if (
    Object.prototype.hasOwnProperty.call(mp, "flowerOrdinal") &&
    mp.flowerOrdinal != null &&
    Number.isFinite(Number(mp.flowerOrdinal))
  ) {
    plantedFromSnapshot.flowerOrdinal = Math.max(1, Number(mp.flowerOrdinal));
  } else if (Object.prototype.hasOwnProperty.call(mp, "flowerOrdinal")) {
    plantedFromSnapshot.flowerOrdinal = null;
  }
  if (
    Object.prototype.hasOwnProperty.call(mp, "treeOrdinal") &&
    mp.treeOrdinal != null &&
    Number.isFinite(Number(mp.treeOrdinal))
  ) {
    plantedFromSnapshot.treeOrdinal = Math.max(1, Number(mp.treeOrdinal));
  } else if (Object.prototype.hasOwnProperty.call(mp, "treeOrdinal")) {
    plantedFromSnapshot.treeOrdinal = null;
  }
  if (
    Object.prototype.hasOwnProperty.call(mp, "cactusOrdinal") &&
    mp.cactusOrdinal != null &&
    Number.isFinite(Number(mp.cactusOrdinal))
  ) {
    plantedFromSnapshot.cactusOrdinal = Math.max(1, Number(mp.cactusOrdinal));
  } else if (Object.prototype.hasOwnProperty.call(mp, "cactusOrdinal")) {
    plantedFromSnapshot.cactusOrdinal = null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "plantedAt")) {
    plantedFromSnapshot.plantPlantedAt = Number(mp.plantedAt) || null;
  } else if (Object.prototype.hasOwnProperty.call(mp, "plantPlantedAt")) {
    plantedFromSnapshot.plantPlantedAt = Number(mp.plantPlantedAt) || null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "drySoilAt")) {
    const da = Number(mp.drySoilAt);
    plantedFromSnapshot.drySoilAt = Number.isFinite(da) && da > 0 ? da : null;
  } else {
    plantedFromSnapshot.drySoilAt = null;
  }
  if (Object.prototype.hasOwnProperty.call(mp, "plantGoldKrw")) {
    plantedFromSnapshot.plantGoldKrw = Math.max(0, Math.floor(Number(mp.plantGoldKrw) || 0));
  }
  if (
    Object.prototype.hasOwnProperty.call(mp, "plantGoldUpdatedAt") &&
    mp.plantGoldUpdatedAt != null &&
    Number.isFinite(Number(mp.plantGoldUpdatedAt))
  ) {
    plantedFromSnapshot.plantGoldUpdatedAt = Number(mp.plantGoldUpdatedAt);
  }
  // 마른 땅은 UI·스냅샷 불일치로 싹이 잠깐 살아나는 것을 막음
  if (Object.prototype.hasOwnProperty.call(mp, "blockSproutRegrowthAfterDry")) {
    plantedFromSnapshot.blockSproutRegrowthAfterDry = Boolean(mp.blockSproutRegrowthAfterDry);
  } else {
    plantedFromSnapshot.blockSproutRegrowthAfterDry = false;
  }
  if (plantedFromSnapshot.plantState === "dry") {
    plantedFromSnapshot.isSproutGrown = false;
    plantedFromSnapshot.plantSproutGrownAt = null;
    plantedFromSnapshot.plantGrowthStartedAt = null;
    plantedFromSnapshot.isSproutSelfSustaining = false;
    plantedFromSnapshot.blockSproutRegrowthAfterDry = true;
    if (Object.prototype.hasOwnProperty.call(plantedFromSnapshot, "sproutEvolutionMs")) {
      plantedFromSnapshot.sproutEvolutionMs = 0;
    }
    if (Object.prototype.hasOwnProperty.call(plantedFromSnapshot, "sproutEvolutionLastTickAt")) {
      plantedFromSnapshot.sproutEvolutionLastTickAt = null;
    }
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
    isStarter: Boolean(extraSeed.isStarter),
    ownerUserId: Object.prototype.hasOwnProperty.call(extraSeed, "ownerUserId")
      ? String(extraSeed.ownerUserId || "")
      : "",
    ownerSessionId: Object.prototype.hasOwnProperty.call(extraSeed, "ownerSessionId")
      ? String(extraSeed.ownerSessionId || "")
      : ""
  };
}

export function parseExtraPlantFromSnapshot(plant) {
  const out = {
    id: String(plant.id),
    x: Number(plant.x) || 0,
    y: Number(plant.y) || 0,
    plantedAt: Number(plant.plantedAt) || Date.now(),
    lastWateredAt: Number(plant.lastWateredAt) || null,
    wateredAtList: Array.isArray(plant.wateredAtList) ? plant.wateredAtList.slice() : [],
    status: plant.status || "normal",
    waterLevel: readWaterLevel(plant.waterLevel, 1),
    waterLevelUpdatedAt:
      Object.prototype.hasOwnProperty.call(plant, "waterLevelUpdatedAt") &&
      Number.isFinite(Number(plant.waterLevelUpdatedAt)) &&
      Number(plant.waterLevelUpdatedAt) > 0
        ? Number(plant.waterLevelUpdatedAt)
        : null,
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
      : 0,
    grassAuto5EligibleAt:
      Object.prototype.hasOwnProperty.call(plant, "grassAuto5EligibleAt") &&
      plant.grassAuto5EligibleAt != null &&
      Number.isFinite(Number(plant.grassAuto5EligibleAt))
        ? Number(plant.grassAuto5EligibleAt)
        : null,
    ownerUserId: Object.prototype.hasOwnProperty.call(plant, "ownerUserId")
      ? String(plant.ownerUserId || "")
      : "",
    ownerDisplayName: Object.prototype.hasOwnProperty.call(plant, "ownerDisplayName")
      ? String(plant.ownerDisplayName || "")
      : "",
    seedKind: Object.prototype.hasOwnProperty.call(plant, "seedKind")
      ? String(plant.seedKind || "")
      : "",
    sproutOrdinal: Object.prototype.hasOwnProperty.call(plant, "sproutOrdinal")
      ? Math.max(0, Number(plant.sproutOrdinal) || 0)
      : 0,
    grassOrdinal:
      Object.prototype.hasOwnProperty.call(plant, "grassOrdinal") &&
      plant.grassOrdinal != null &&
      Number.isFinite(Number(plant.grassOrdinal))
        ? Math.max(1, Number(plant.grassOrdinal))
        : null,
    matureKind: Object.prototype.hasOwnProperty.call(plant, "matureKind")
      ? String(plant.matureKind || "")
      : "",
    flowerOrdinal:
      Object.prototype.hasOwnProperty.call(plant, "flowerOrdinal") &&
      plant.flowerOrdinal != null &&
      Number.isFinite(Number(plant.flowerOrdinal))
        ? Math.max(1, Number(plant.flowerOrdinal))
        : null,
    treeOrdinal:
      Object.prototype.hasOwnProperty.call(plant, "treeOrdinal") &&
      plant.treeOrdinal != null &&
      Number.isFinite(Number(plant.treeOrdinal))
        ? Math.max(1, Number(plant.treeOrdinal))
        : null,
    cactusOrdinal:
      Object.prototype.hasOwnProperty.call(plant, "cactusOrdinal") &&
      plant.cactusOrdinal != null &&
      Number.isFinite(Number(plant.cactusOrdinal))
        ? Math.max(1, Number(plant.cactusOrdinal))
        : null
  };
  if (Object.prototype.hasOwnProperty.call(plant, "drySoilAt")) {
    const da = Number(plant.drySoilAt);
    out.drySoilAt = Number.isFinite(da) && da > 0 ? da : null;
  } else {
    out.drySoilAt = null;
  }
  if (Object.prototype.hasOwnProperty.call(plant, "plantGoldKrw")) {
    out.plantGoldKrw = Math.max(0, Math.floor(Number(plant.plantGoldKrw) || 0));
  } else {
    out.plantGoldKrw = 0;
  }
  if (
    Object.prototype.hasOwnProperty.call(plant, "plantGoldUpdatedAt") &&
    plant.plantGoldUpdatedAt != null &&
    Number.isFinite(Number(plant.plantGoldUpdatedAt))
  ) {
    out.plantGoldUpdatedAt = Number(plant.plantGoldUpdatedAt);
  } else {
    out.plantGoldUpdatedAt = null;
  }
  if (Object.prototype.hasOwnProperty.call(plant, "blockSproutRegrowthAfterDry")) {
    out.blockSproutRegrowthAfterDry = Boolean(plant.blockSproutRegrowthAfterDry);
  } else {
    out.blockSproutRegrowthAfterDry = false;
  }
  if (out.status === "dry") {
    out.isSproutGrown = false;
    out.sproutGrownAt = null;
    out.growthStartedAt = null;
    out.isSproutSelfSustaining = false;
    out.sproutEvolutionMs = 0;
    out.sproutEvolutionLastTickAt = null;
    out.blockSproutRegrowthAfterDry = true;
  }
  return out;
}
