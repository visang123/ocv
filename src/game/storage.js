import {
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y,
  WORLD_LOOSE_ROCK_COUNT,
  WORLD_ROCK_SIZE
} from "./constants.js";

let storagePrefix = "";

export function setStoragePrefix(prefix) {
  storagePrefix = prefix || "";
}

function getScopedKey(key) {
  return storagePrefix + key;
}

export function getStoredValue(key) {
  return localStorage.getItem(getScopedKey(key));
}

export function setStoredValue(key, value) {
  localStorage.setItem(getScopedKey(key), value);
}

export function removeStoredValue(key) {
  localStorage.removeItem(getScopedKey(key));
}

export function clearStoredKeys(keys) {
  keys.forEach(function (key) {
    localStorage.removeItem(getScopedKey(key));
  });
}

export function getStoredFlag(key) {
  return localStorage.getItem(getScopedKey(key)) === "true";
}

export function setStoredFlag(key, enabled) {
  localStorage.setItem(getScopedKey(key), enabled ? "true" : "false");
}

export function loadWellStateFromStorage(config) {
  const savedWaterRaw = getStoredValue(config.wellWaterKey);
  const savedRefillAtRaw = getStoredValue(config.lastWellRefillKey);
  const savedWater = Number(savedWaterRaw);
  const savedRefillAt = Number(savedRefillAtRaw);

  let wellWater = config.defaultWellWater;
  let lastWellRefillAt = config.defaultLastWellRefillAt;

  if (savedWaterRaw !== null && Number.isFinite(savedWater)) {
    wellWater = Math.max(0, Math.min(config.maxWellWater, savedWater));
  }

  if (
    savedRefillAtRaw !== null &&
    Number.isFinite(savedRefillAt) &&
    savedRefillAt > 0
  ) {
    lastWellRefillAt = savedRefillAt;
  }

  return {
    wellWater,
    lastWellRefillAt
  };
}

export function saveWellStateToStorage(config) {
  setStoredValue(config.wellWaterKey, String(config.wellWater));
  setStoredValue(config.lastWellRefillKey, String(config.lastWellRefillAt));
}

export function loadSeedStateFromStorage(config) {
  const savedCreatedAtRaw = getStoredValue(config.seedCreatedAtKey);
  const savedPlantedRaw = getStoredValue(config.seedPlantedStateKey);
  const savedCreatedAt = Number(savedCreatedAtRaw);
  let parseFailed = false;

  let seedCreatedAt;
  if (savedCreatedAtRaw !== null && Number.isFinite(savedCreatedAt)) {
    seedCreatedAt = savedCreatedAt;
  } else {
    seedCreatedAt = config.defaultSeedCreatedAt;
    setStoredValue(config.seedCreatedAtKey, String(seedCreatedAt));
  }

  const planted = {
    isSeedPlanted: false,
    plantSpotX: 0,
    plantSpotY: 0,
    plantLastWateredAt: null,
    plantWateredAtList: [],
    plantState: "normal",
    plantWaterLevel: 1,
    plantWaterLevelUpdatedAt: config.defaultSeedCreatedAt,
    plantBecameEmptyAt: null,
    isPlantOverwatered: false,
    plantRottenAt: null,
    plantNeedsFirstWater: false,
    plantGrowthStartedAt: null,
    isSproutGrown: false,
    plantSproutGrownAt: null,
    sproutEvolutionMs: 0,
    sproutEvolutionLastTickAt: null,
    isSproutSelfSustaining: false,
    growthTier: 0,
    waterCapacity: 2,
    powderUpgradeTargetTier: 0,
    powderUpgradeStartedAt: null,
    powderUpgradeDurationMs: 0,
    grassAuto5EligibleAt: null,
    plantPlantedAt: null,
    ownerUserId: "",
    ownerDisplayName: "",
    sproutOrdinal: 0,
    grassOrdinal: null,
    blockSproutRegrowthAfterDry: false,
    drySoilAt: null,
    npcX: config.defaultNpcX,
    npcY: config.defaultNpcY
  };

  if (savedPlantedRaw !== null) {
    try {
      const savedPlantedState = JSON.parse(savedPlantedRaw);
      planted.isSeedPlanted = Boolean(savedPlantedState.isSeedPlanted);
      planted.plantSpotX = Number(savedPlantedState.plantSpotX) || 0;
      planted.plantSpotY = Number(savedPlantedState.plantSpotY) || 0;
      planted.plantLastWateredAt =
        Number(savedPlantedState.plantLastWateredAt) || null;
      planted.plantWateredAtList = Array.isArray(savedPlantedState.plantWateredAtList)
        ? savedPlantedState.plantWateredAtList.map(Number).filter(Number.isFinite)
        : [];
      planted.plantState = savedPlantedState.plantState || "normal";
      planted.plantWaterLevel = Number.isFinite(Number(savedPlantedState.plantWaterLevel))
        ? Math.max(0, Math.min(3, Number(savedPlantedState.plantWaterLevel)))
        : 1;
      planted.plantWaterLevelUpdatedAt =
        Number(savedPlantedState.plantWaterLevelUpdatedAt) || config.defaultSeedCreatedAt;
      planted.plantBecameEmptyAt = Number(savedPlantedState.plantBecameEmptyAt) || null;
      planted.isPlantOverwatered = Boolean(savedPlantedState.isPlantOverwatered);
      planted.plantRottenAt = Number(savedPlantedState.plantRottenAt) || null;
      planted.plantNeedsFirstWater = Boolean(savedPlantedState.plantNeedsFirstWater);
      planted.plantGrowthStartedAt =
        Number(savedPlantedState.plantGrowthStartedAt) || null;
      planted.isSproutGrown = Boolean(savedPlantedState.isSproutGrown);
      planted.plantSproutGrownAt =
        Number(savedPlantedState.plantSproutGrownAt) || null;
      planted.sproutEvolutionMs = Math.max(
        0,
        Number(savedPlantedState.sproutEvolutionMs) || 0
      );
      planted.sproutEvolutionLastTickAt =
        Number(savedPlantedState.sproutEvolutionLastTickAt) || null;
      planted.isSproutSelfSustaining = Boolean(savedPlantedState.isSproutSelfSustaining);
      planted.growthTier = Math.max(0, Number(savedPlantedState.growthTier) || 0);
      planted.waterCapacity = Math.max(2, Number(savedPlantedState.waterCapacity) || 2);
      planted.powderUpgradeTargetTier = Math.max(
        0,
        Number(savedPlantedState.powderUpgradeTargetTier) || 0
      );
      planted.powderUpgradeStartedAt = Number(savedPlantedState.powderUpgradeStartedAt) || null;
      planted.powderUpgradeDurationMs = Math.max(
        0,
        Number(savedPlantedState.powderUpgradeDurationMs) || 0
      );
      if (
        Object.prototype.hasOwnProperty.call(savedPlantedState, "grassAuto5EligibleAt") &&
        savedPlantedState.grassAuto5EligibleAt != null &&
        Number.isFinite(Number(savedPlantedState.grassAuto5EligibleAt))
      ) {
        planted.grassAuto5EligibleAt = Number(savedPlantedState.grassAuto5EligibleAt);
      } else {
        planted.grassAuto5EligibleAt = null;
      }
      planted.plantPlantedAt =
        Number(savedPlantedState.plantPlantedAt) ||
        Number(savedPlantedState.plantedAt) ||
        null;
      planted.ownerUserId =
        savedPlantedState.ownerUserId != null
          ? String(savedPlantedState.ownerUserId)
          : "";
      planted.ownerDisplayName =
        savedPlantedState.ownerDisplayName != null
          ? String(savedPlantedState.ownerDisplayName)
          : "";
      planted.sproutOrdinal = Math.max(
        0,
        Number(savedPlantedState.sproutOrdinal) || 0
      );
      if (
        savedPlantedState.grassOrdinal != null &&
        Number.isFinite(Number(savedPlantedState.grassOrdinal))
      ) {
        planted.grassOrdinal = Math.max(1, Number(savedPlantedState.grassOrdinal));
      } else {
        planted.grassOrdinal = null;
      }
      if (Object.prototype.hasOwnProperty.call(savedPlantedState, "drySoilAt")) {
        const da = Number(savedPlantedState.drySoilAt);
        planted.drySoilAt = Number.isFinite(da) && da > 0 ? da : null;
      } else {
        planted.drySoilAt = null;
      }
      planted.npcX = Number(savedPlantedState.npcX) || config.defaultNpcX;
      planted.npcY = Number(savedPlantedState.npcY) || config.defaultNpcY;
    } catch (error) {
      removeStoredValue(config.seedPlantedStateKey);
      parseFailed = true;
    }
  }

  return {
    parseFailed,
    seedCreatedAt,
    planted
  };
}

export function saveSeedStateToStorage(config) {
  setStoredValue(config.seedCreatedAtKey, String(config.seedCreatedAt));
  setStoredValue(config.seedPlantedStateKey, JSON.stringify(config.plantedState));
}

function normalizeSavedWorldRocks(saved, createRandomWorldRocks) {
  if (typeof createRandomWorldRocks !== "function") {
    return { worldRocks: [], worldRockPickedIds: [] };
  }
  const fresh = createRandomWorldRocks();
  if (!saved || !Array.isArray(saved.worldRocks) || saved.worldRocks.length !== WORLD_LOOSE_ROCK_COUNT) {
    return { worldRocks: fresh, worldRockPickedIds: [] };
  }
  const worldRocks = saved.worldRocks.map(function (rockData, index) {
    const fallback = fresh[index] || {
      id: "ground-rock-" + (index + 1),
      x: 40,
      y: 260,
      size: WORLD_ROCK_SIZE
    };
    return {
      id: String(rockData.id || fallback.id),
      x: Number.isFinite(Number(rockData.x)) ? Number(rockData.x) : fallback.x,
      y: Number.isFinite(Number(rockData.y)) ? Number(rockData.y) : fallback.y,
      size: Number.isFinite(Number(rockData.size)) ? Number(rockData.size) : WORLD_ROCK_SIZE
    };
  });
  const validIds = new Set(worldRocks.map(function (r) {
    return r.id;
  }));
  const worldRockPickedIds = Array.isArray(saved.worldRockPickedIds)
    ? saved.worldRockPickedIds.filter(function (id) {
        return validIds.has(String(id));
      })
    : [];
  return { worldRocks, worldRockPickedIds };
}

export function loadAppleStateFromStorage(config) {
  const savedRaw = getStoredValue(config.appleStateKey);

  if (!savedRaw) {
    const rocksEmpty = normalizeSavedWorldRocks(null, config.createRandomWorldRocks);
    return {
      hasSavedState: false,
      parseFailed: false,
      appleCount: 0,
      apples: config.createRandomApples(5),
      pickedAppleIds: [],
      nextAppleSeedOffset: 0,
      lastAppleSpawnAt: config.now,
      extraSeeds: [],
      extraPlants: [],
      seedCount: 0,
      worldLooseSeed: {
        x: WORLD_LOOSE_SEED_X,
        y: WORLD_LOOSE_SEED_Y,
        nextSpawnAt: 0
      },
      worldRocks: rocksEmpty.worldRocks,
      worldRockPickedIds: rocksEmpty.worldRockPickedIds
    };
  }

  try {
    const saved = JSON.parse(savedRaw);
    const apples = Array.isArray(saved.apples)
      ? saved.apples.map(function (appleData) {
          const localX = Number(appleData.localX) || 20;
          const localY = Number(appleData.localY) || 20;
          return {
            id: String(appleData.id),
            localX,
            localY,
            x: config.bigTreeX + localX,
            y: config.bigTreeY + localY,
            size: 10
          };
        })
      : config.createRandomApples(5);

    const pickedAppleIds = Array.isArray(saved.pickedAppleIds)
      ? saved.pickedAppleIds.filter(function (id) {
          return apples.some(function (apple) {
            return apple.id === id;
          });
        })
      : [];

    const worldLooseSeedRaw = saved.worldLooseSeed;
    const worldLooseSeed =
      worldLooseSeedRaw && typeof worldLooseSeedRaw === "object"
        ? {
            x: Number(worldLooseSeedRaw.x) || WORLD_LOOSE_SEED_X,
            y: Number(worldLooseSeedRaw.y) || WORLD_LOOSE_SEED_Y,
            nextSpawnAt: Math.max(0, Number(worldLooseSeedRaw.nextSpawnAt) || 0)
          }
        : {
            x: WORLD_LOOSE_SEED_X,
            y: WORLD_LOOSE_SEED_Y,
            nextSpawnAt: 0
          };

    const worldRockParts = normalizeSavedWorldRocks(saved, config.createRandomWorldRocks);

    return {
      hasSavedState: true,
      parseFailed: false,
      appleCount: Math.max(0, Number(saved.appleCount) || 0),
      seedCount: Math.max(0, Number(saved.seedCount) || 0),
      apples,
      pickedAppleIds,
      nextAppleSeedOffset: Math.max(0, Number(saved.nextAppleSeedOffset) || 0),
      lastAppleSpawnAt: Number(saved.lastAppleSpawnAt) || config.now,
      extraSeeds: Array.isArray(saved.extraSeeds)
        ? saved.extraSeeds.map(function (seedData) {
            return {
              id: String(seedData.id),
              x: Number(seedData.x) || 0,
              y: Number(seedData.y) || 0,
              createdAt: Number(seedData.createdAt) || config.now,
              planted: Boolean(seedData.planted),
              inInventory: Boolean(seedData.inInventory),
              label: seedData.label || config.defaultSeedLabel,
              isStarter: Boolean(seedData.isStarter)
            };
          })
        : [],
      extraPlants: Array.isArray(saved.extraPlants)
        ? saved.extraPlants.map(function (plantData) {
            const plantedAt = Number(plantData.plantedAt) || config.now;
            return {
              id: String(plantData.id),
              x: Number(plantData.x) || 0,
              y: Number(plantData.y) || 0,
              plantedAt,
              lastWateredAt: Number(plantData.lastWateredAt) || null,
              wateredAtList: Array.isArray(plantData.wateredAtList)
                ? plantData.wateredAtList.map(Number).filter(Number.isFinite)
                : [],
              status: plantData.status || "normal",
              waterLevel: Number.isFinite(Number(plantData.waterLevel))
                ? Math.max(0, Math.min(3, Number(plantData.waterLevel)))
                : 1,
              waterLevelUpdatedAt: Number(plantData.waterLevelUpdatedAt) || plantedAt,
              becameEmptyAt: Number(plantData.becameEmptyAt) || null,
              isOverwatered: Boolean(plantData.isOverwatered),
              needsFirstWater:
                typeof plantData.needsFirstWater === "boolean"
                  ? plantData.needsFirstWater
                  : !plantData.growthStartedAt,
              growthStartedAt: Number(plantData.growthStartedAt) || null,
              isSproutGrown: Boolean(plantData.isSproutGrown),
              sproutGrownAt: Number(plantData.sproutGrownAt) || null,
              sproutEvolutionMs: Math.max(0, Number(plantData.sproutEvolutionMs) || 0),
              sproutEvolutionLastTickAt:
                Number(plantData.sproutEvolutionLastTickAt) || null,
              isSproutSelfSustaining: Boolean(plantData.isSproutSelfSustaining),
              growthTier: Math.max(0, Number(plantData.growthTier) || 0),
              waterCapacity: Math.max(2, Number(plantData.waterCapacity) || 2),
              powderUpgradeTargetTier: Math.max(
                0,
                Number(plantData.powderUpgradeTargetTier) || 0
              ),
              powderUpgradeStartedAt: Number(plantData.powderUpgradeStartedAt) || null,
              powderUpgradeDurationMs: Math.max(
                0,
                Number(plantData.powderUpgradeDurationMs) || 0
              ),
              grassAuto5EligibleAt:
                plantData.grassAuto5EligibleAt != null &&
                Number.isFinite(Number(plantData.grassAuto5EligibleAt))
                  ? Number(plantData.grassAuto5EligibleAt)
                  : null,
              ownerUserId:
                plantData.ownerUserId != null ? String(plantData.ownerUserId) : "",
              ownerDisplayName:
                plantData.ownerDisplayName != null
                  ? String(plantData.ownerDisplayName)
                  : "",
              sproutOrdinal: Math.max(0, Number(plantData.sproutOrdinal) || 0),
              grassOrdinal:
                plantData.grassOrdinal != null &&
                Number.isFinite(Number(plantData.grassOrdinal))
                  ? Math.max(1, Number(plantData.grassOrdinal))
                  : null,
              rottenAt: Number(plantData.rottenAt) || null,
              blockSproutRegrowthAfterDry: (function () {
                if (Object.prototype.hasOwnProperty.call(plantData, "blockSproutRegrowthAfterDry")) {
                  return Boolean(plantData.blockSproutRegrowthAfterDry);
                }
                return (plantData.status || "normal") === "dry";
              })(),
              drySoilAt: (function () {
                if (Object.prototype.hasOwnProperty.call(plantData, "drySoilAt")) {
                  const da = Number(plantData.drySoilAt);
                  return Number.isFinite(da) && da > 0 ? da : null;
                }
                return null;
              })()
            };
          })
        : [],
      worldLooseSeed,
      worldRocks: worldRockParts.worldRocks,
      worldRockPickedIds: worldRockParts.worldRockPickedIds
    };
  } catch (error) {
    removeStoredValue(config.appleStateKey);
    const rocksCatch = normalizeSavedWorldRocks(null, config.createRandomWorldRocks);
    return {
      hasSavedState: false,
      parseFailed: true,
      appleCount: 0,
      seedCount: 0,
      apples: config.createRandomApples(5),
      pickedAppleIds: [],
      nextAppleSeedOffset: 0,
      lastAppleSpawnAt: config.now,
      extraSeeds: [],
      extraPlants: [],
      worldLooseSeed: {
        x: WORLD_LOOSE_SEED_X,
        y: WORLD_LOOSE_SEED_Y,
        nextSpawnAt: 0
      },
      worldRocks: rocksCatch.worldRocks,
      worldRockPickedIds: rocksCatch.worldRockPickedIds
    };
  }
}

export function saveAppleStateToStorage(config) {
  const worldLooseSeedOut =
    config.worldLooseSeed && typeof config.worldLooseSeed === "object"
      ? {
          x: Number(config.worldLooseSeed.x) || WORLD_LOOSE_SEED_X,
          y: Number(config.worldLooseSeed.y) || WORLD_LOOSE_SEED_Y,
          nextSpawnAt: Math.max(0, Number(config.worldLooseSeed.nextSpawnAt) || 0)
        }
      : {
          x: WORLD_LOOSE_SEED_X,
          y: WORLD_LOOSE_SEED_Y,
          nextSpawnAt: 0
        };
  setStoredValue(
    config.appleStateKey,
    JSON.stringify({
      appleCount: config.appleCount,
      seedCount: Math.max(0, Number(config.seedCount) || 0),
      apples: config.apples.map(function (apple) {
        return {
          id: apple.id,
          localX: apple.localX,
          localY: apple.localY
        };
      }),
      pickedAppleIds: config.pickedAppleIds,
      nextAppleSeedOffset: config.nextAppleSeedOffset,
      lastAppleSpawnAt: config.lastAppleSpawnAt,
      extraSeeds: config.extraSeeds.map(function (extraSeed) {
        return {
          id: extraSeed.id,
          x: extraSeed.x,
          y: extraSeed.y,
          createdAt: extraSeed.createdAt,
          planted: extraSeed.planted,
          inInventory: extraSeed.inInventory,
          label: extraSeed.label,
          isStarter: Boolean(extraSeed.isStarter)
        };
      }),
      extraPlants: config.extraPlants.map(function (plant) {
        return {
          id: plant.id,
          x: plant.x,
          y: plant.y,
          plantedAt: plant.plantedAt,
          lastWateredAt: plant.lastWateredAt,
          wateredAtList: plant.wateredAtList,
          status: plant.status,
          waterLevel: plant.waterLevel,
          waterLevelUpdatedAt: plant.waterLevelUpdatedAt,
          becameEmptyAt: plant.becameEmptyAt,
          isOverwatered: plant.isOverwatered,
          needsFirstWater: plant.needsFirstWater,
          growthStartedAt: plant.growthStartedAt,
          isSproutGrown: plant.isSproutGrown,
          sproutGrownAt: plant.sproutGrownAt,
          sproutEvolutionMs: plant.sproutEvolutionMs,
          sproutEvolutionLastTickAt: plant.sproutEvolutionLastTickAt,
          isSproutSelfSustaining: plant.isSproutSelfSustaining,
          growthTier: plant.growthTier,
          waterCapacity: plant.waterCapacity,
          powderUpgradeTargetTier: plant.powderUpgradeTargetTier,
          powderUpgradeStartedAt: plant.powderUpgradeStartedAt,
          powderUpgradeDurationMs: plant.powderUpgradeDurationMs,
          grassAuto5EligibleAt: plant.grassAuto5EligibleAt != null ? plant.grassAuto5EligibleAt : null,
          ownerUserId: plant.ownerUserId || "",
          ownerDisplayName: plant.ownerDisplayName || "",
          sproutOrdinal: plant.sproutOrdinal || 0,
          grassOrdinal:
            plant.grassOrdinal != null && Number.isFinite(Number(plant.grassOrdinal))
              ? plant.grassOrdinal
              : null,
          rottenAt: plant.rottenAt || null,
          blockSproutRegrowthAfterDry: Boolean(plant.blockSproutRegrowthAfterDry),
          drySoilAt:
            plant.drySoilAt != null && Number.isFinite(Number(plant.drySoilAt))
              ? Number(plant.drySoilAt)
              : null
        };
      }),
      worldRocks: (config.worldRocks || []).map(function (rock) {
        return {
          id: rock.id,
          x: Number(rock.x) || 0,
          y: Number(rock.y) || 0,
          size: Number.isFinite(Number(rock.size)) ? Number(rock.size) : WORLD_ROCK_SIZE
        };
      }),
      worldRockPickedIds: Array.isArray(config.worldRockPickedIds) ? config.worldRockPickedIds : [],
      worldLooseSeed: worldLooseSeedOut
    })
  );
}

