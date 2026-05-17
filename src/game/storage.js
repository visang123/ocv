import {
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y,
  WORLD_LOOSE_ROCK_COUNT,
  WORLD_ROCK_SIZE,
  hasGuideBookKey,
  worldBagFloorPickedAccountKey
} from "./constants.js";

let storagePrefix = "";

export function setStoragePrefix(prefix) {
  storagePrefix = prefix || "";
}

/**
 * 예전(또는 비로그인)에는 localStorage 키에 `ovc-user-{id}:` 접두사가 없었고,
 * 로그인 후에는 동일 논리 키가 접두사 뒤에만 존재한다. 그 경우 바닥 가방/책 등이
 * "다시 나타나는" 것처럼 보이므로, 접두사 없이 true로 남은 플래그를 계정 스코프로 옮긴다.
 */
export function migrateUnscopedUserPickupFlagsToUserScope(userId) {
  const uid = String(userId == null ? "" : userId).trim();
  if (!uid) return;
  const userPrefix = "ovc-user-" + uid + ":";
  const roomKeyStarts = [
    "guideBookPickedRoomV1:",
    "worldBagGroundPickedRoomV1:",
    "worldGuideBookOffGroundPickedRoomV1:",
    "mainSeedPickedRoomV1:"
  ];
  const globalKeys = [hasGuideBookKey, worldBagFloorPickedAccountKey];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf("ovc-user-") === 0) continue;
      let matched = false;
      for (let s = 0; s < roomKeyStarts.length; s++) {
        if (k.indexOf(roomKeyStarts[s]) === 0) {
          matched = true;
          break;
        }
      }
      if (!matched) continue;
      if (localStorage.getItem(k) !== "true") continue;
      const dest = userPrefix + k;
      if (localStorage.getItem(dest) === null) {
        localStorage.setItem(dest, "true");
      }
    }
    for (let g = 0; g < globalKeys.length; g++) {
      const gk = globalKeys[g];
      if (localStorage.getItem(gk) !== "true") continue;
      const destG = userPrefix + gk;
      if (localStorage.getItem(destG) === null) {
        localStorage.setItem(destG, "true");
      }
    }
    const plainKeysToScope = ["ovcBagInventoryOrderV1"];
    for (let p = 0; p < plainKeysToScope.length; p++) {
      const pk = plainKeysToScope[p];
      const destP = userPrefix + pk;
      if (localStorage.getItem(destP) != null) continue;
      const raw = localStorage.getItem(pk);
      if (raw == null || raw === "") continue;
      localStorage.setItem(destP, raw);
    }
  } catch (e) {}
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
    purgeLocalStorageKeysForLogicalKey(key);
  });
}

/**
 * logicalKey 및 `ovc-user-*:logicalKey` 등 접두사가 붙은 모든 변형을 제거한다.
 * 공유 월드 리셋 시 migrate가 예전(접두사 없는) 플래그를 다시 복사하는 것을 막는다.
 */
export function purgeLocalStorageKeysForLogicalKey(logicalKey) {
  const tail = String(logicalKey || "").trim();
  if (!tail) return;
  const toRemove = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k === tail || k.endsWith(":" + tail)) {
        toRemove.push(k);
      }
    }
    toRemove.forEach(function (k) {
      localStorage.removeItem(k);
    });
  } catch (e) {}
}

/** 방별 줍기 플래그(`prefix + slug`)의 scoped·unscoped 키를 모두 제거한다. */
export function purgeRoomKeyedPickupFlags(keyPrefix, slugs) {
  const prefix = String(keyPrefix || "");
  if (!prefix || !Array.isArray(slugs)) return;
  const toRemove = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      for (let s = 0; s < slugs.length; s++) {
        const logicalTail = prefix + slugs[s];
        if (k === logicalTail || k.endsWith(":" + logicalTail)) {
          toRemove.push(k);
          break;
        }
      }
    }
    toRemove.forEach(function (k) {
      localStorage.removeItem(k);
    });
  } catch (e) {}
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
    matureKind: "",
    flowerOrdinal: null,
    treeOrdinal: null,
    cactusOrdinal: null,
    blockSproutRegrowthAfterDry: false,
    drySoilAt: null,
    plantSeedKind: "",
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
      planted.matureKind = Object.prototype.hasOwnProperty.call(savedPlantedState, "matureKind")
        ? String(savedPlantedState.matureKind || "")
        : "";
      if (
        savedPlantedState.flowerOrdinal != null &&
        Number.isFinite(Number(savedPlantedState.flowerOrdinal))
      ) {
        planted.flowerOrdinal = Math.max(1, Number(savedPlantedState.flowerOrdinal));
      } else {
        planted.flowerOrdinal = null;
      }
      if (
        savedPlantedState.treeOrdinal != null &&
        Number.isFinite(Number(savedPlantedState.treeOrdinal))
      ) {
        planted.treeOrdinal = Math.max(1, Number(savedPlantedState.treeOrdinal));
      } else {
        planted.treeOrdinal = null;
      }
      if (
        savedPlantedState.cactusOrdinal != null &&
        Number.isFinite(Number(savedPlantedState.cactusOrdinal))
      ) {
        planted.cactusOrdinal = Math.max(1, Number(savedPlantedState.cactusOrdinal));
      } else {
        planted.cactusOrdinal = null;
      }
      if (Object.prototype.hasOwnProperty.call(savedPlantedState, "drySoilAt")) {
        const da = Number(savedPlantedState.drySoilAt);
        planted.drySoilAt = Number.isFinite(da) && da > 0 ? da : null;
      } else {
        planted.drySoilAt = null;
      }
      if (Object.prototype.hasOwnProperty.call(savedPlantedState, "plantSeedKind")) {
        planted.plantSeedKind = String(savedPlantedState.plantSeedKind || "");
      } else if (Object.prototype.hasOwnProperty.call(savedPlantedState, "seedKind")) {
        planted.plantSeedKind = String(savedPlantedState.seedKind || "");
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

function normalizeSavedWorldRocks(saved, createRandomWorldRocks, rockSpawnContext) {
  if (!saved || !Array.isArray(saved.worldRocks) || saved.worldRocks.length !== WORLD_LOOSE_ROCK_COUNT) {
    if (typeof createRandomWorldRocks !== "function") {
      return { worldRocks: [], worldRockPickedIds: [] };
    }
    const fresh = createRandomWorldRocks(rockSpawnContext);
    return { worldRocks: fresh, worldRockPickedIds: [] };
  }
  const worldRocks = saved.worldRocks.map(function (rockData, index) {
    const fallback = {
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

function normalizeSavedWorldExtraBuckets(saved) {
  if (!saved || !Array.isArray(saved.worldExtraBuckets)) return [];
  return saved.worldExtraBuckets
    .filter(Boolean)
    .map(function (bucketData, index) {
      return {
        id: String(bucketData.id || "world-bucket-" + (index + 1)),
        x: Number(bucketData.x) || 0,
        y: Number(bucketData.y) || 0,
        isFull: Boolean(bucketData.isFull)
      };
    });
}

export function loadAppleStateFromStorage(config) {
  const savedRaw = getStoredValue(config.appleStateKey);

  if (!savedRaw) {
    const rocksEmpty = normalizeSavedWorldRocks(null, config.createRandomWorldRocks, null);
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
      overgrowthSeedCount: 0,
      worldLooseSeed: {
        x: WORLD_LOOSE_SEED_X,
        y: WORLD_LOOSE_SEED_Y,
        nextSpawnAt: 0
      },
      worldRocks: rocksEmpty.worldRocks,
      worldRockPickedIds: rocksEmpty.worldRockPickedIds,
      worldExtraBuckets: []
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

    const worldRockParts = normalizeSavedWorldRocks(saved, config.createRandomWorldRocks, null);

    return {
      hasSavedState: true,
      parseFailed: false,
      appleCount: Math.max(0, Number(saved.appleCount) || 0),
      seedCount: Math.max(0, Number(saved.seedCount) || 0),
      overgrowthSeedCount: Math.max(0, Number(saved.overgrowthSeedCount) || 0),
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
              isStarter: Boolean(seedData.isStarter),
              seedKind: seedData.seedKind ? String(seedData.seedKind) : ""
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
              seedKind: plantData.seedKind ? String(plantData.seedKind) : "",
              soilOrdinal: Math.max(0, Number(plantData.soilOrdinal) || 0),
              sproutOrdinal: Math.max(0, Number(plantData.sproutOrdinal) || 0),
              grassOrdinal:
                plantData.grassOrdinal != null &&
                Number.isFinite(Number(plantData.grassOrdinal))
                  ? Math.max(1, Number(plantData.grassOrdinal))
                  : null,
              matureKind: plantData.matureKind != null ? String(plantData.matureKind) : "",
              flowerOrdinal:
                plantData.flowerOrdinal != null &&
                Number.isFinite(Number(plantData.flowerOrdinal))
                  ? Math.max(1, Number(plantData.flowerOrdinal))
                  : null,
              treeOrdinal:
                plantData.treeOrdinal != null &&
                Number.isFinite(Number(plantData.treeOrdinal))
                  ? Math.max(1, Number(plantData.treeOrdinal))
                  : null,
              cactusOrdinal:
                plantData.cactusOrdinal != null &&
                Number.isFinite(Number(plantData.cactusOrdinal))
                  ? Math.max(1, Number(plantData.cactusOrdinal))
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
      worldRockPickedIds: worldRockParts.worldRockPickedIds,
      worldExtraBuckets: normalizeSavedWorldExtraBuckets(saved),
      placedCraftFurniture: Array.isArray(saved.placedCraftFurniture) ? saved.placedCraftFurniture : []
    };
  } catch (error) {
    removeStoredValue(config.appleStateKey);
    const rocksCatch = normalizeSavedWorldRocks(null, config.createRandomWorldRocks, null);
    return {
      hasSavedState: false,
      parseFailed: true,
      appleCount: 0,
      seedCount: 0,
      overgrowthSeedCount: 0,
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
      worldRockPickedIds: rocksCatch.worldRockPickedIds,
      worldExtraBuckets: [],
      placedCraftFurniture: []
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
      overgrowthSeedCount: Math.max(0, Number(config.overgrowthSeedCount) || 0),
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
          isStarter: Boolean(extraSeed.isStarter),
          seedKind: extraSeed.seedKind || ""
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
          seedKind: plant.seedKind || "",
          soilOrdinal: plant.soilOrdinal || 0,
          sproutOrdinal: plant.sproutOrdinal || 0,
          grassOrdinal:
            plant.grassOrdinal != null && Number.isFinite(Number(plant.grassOrdinal))
              ? plant.grassOrdinal
              : null,
          matureKind: plant.matureKind != null ? String(plant.matureKind) : "",
          flowerOrdinal:
            plant.flowerOrdinal != null && Number.isFinite(Number(plant.flowerOrdinal))
              ? plant.flowerOrdinal
              : null,
          treeOrdinal:
            plant.treeOrdinal != null && Number.isFinite(Number(plant.treeOrdinal))
              ? plant.treeOrdinal
              : null,
          cactusOrdinal:
            plant.cactusOrdinal != null && Number.isFinite(Number(plant.cactusOrdinal))
              ? plant.cactusOrdinal
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
      worldExtraBuckets: (config.worldExtraBuckets || []).map(function (bucket) {
        return {
          id: String(bucket.id),
          x: Number(bucket.x) || 0,
          y: Number(bucket.y) || 0,
          isFull: Boolean(bucket.isFull)
        };
      }),
      worldLooseSeed: worldLooseSeedOut,
      placedCraftFurniture: Array.isArray(config.placedCraftFurniture)
        ? config.placedCraftFurniture.map(function (entry) {
            return {
              id: entry && entry.id != null ? String(entry.id) : "",
              kind: entry && entry.kind != null ? String(entry.kind) : "",
              x: Number(entry && entry.x) || 0,
              y: Number(entry && entry.y) || 0,
              ownerUserId: entry && entry.ownerUserId != null ? String(entry.ownerUserId) : "",
              ownerDisplayName:
                entry && entry.ownerDisplayName != null ? String(entry.ownerDisplayName) : "",
              furnitureOrdinal: Math.max(0, Math.floor(Number(entry && entry.furnitureOrdinal) || 0)),
              placedAt: Number(entry && entry.placedAt) || 0
            };
          })
        : []
    })
  );
}

