/** Shared world row serialize / apply (Supabase world_state) */
import { parseMainPlantFromSnapshot, resolveSnapshotSavedAt, dedupeExtraSeedsPreferInventory } from "../../game/worldSnapshot.js";
import { syncServerClockOffset as syncServerClockOffsetCore } from "../../game/timeSync.js";

export function createModule(d) {
  function flushPassiveSimulationBeforeSharedSnapshot() {
  if (!d.isSharedWorldMergeActive()) return;
  const now = d.getSharedPlantSimulationNow();
  d.refillWellIfNeeded();
  if (
    d.getPlant().isSeedPlanted &&
    !d.getPlant().isOverwatered &&
    d.getPlant().status !== "dry" &&
    d.getPlant().status !== "rotten"
  ) {
    if (!d.shouldPauseWaterDecayForPlant(d.getPlant(), now)) {
      d.applyPlantWaterDecay(d.getPlant(), now);
    }
    if (d.getPlant().waterLevel === 0 && d.getPlant().becameEmptyAt === null) {
      d.getPlant().becameEmptyAt = d.getPlant().waterLevelUpdatedAt;
    }
  }
  d.getApple().extraPlants.forEach(function (ep) {
    if (!ep || ep.isOverwatered || ep.status === "dry" || ep.status === "rotten") {
      return;
    }
    if (d.shouldPauseWaterDecayForPlant(ep, now)) return;
    d.applyPlantWaterDecay(ep, now);
    if (ep.waterLevel === 0 && ep.becameEmptyAt === null) {
      ep.becameEmptyAt = ep.waterLevelUpdatedAt;
    }
  });
  if (d.getPlant().isSeedPlanted) {
    d.tickPlantGold(d.getPlant(), now);
  }
  d.getApple().extraPlants.forEach(function (ep) {
    if (!ep) return;
    d.tickPlantGold(ep, now);
  });
  }

  function getSharedWorldSnapshot() {
  d.flushPassiveSimulationBeforeSharedSnapshot();
  const bucketHeldBy = d.isHoldingMainBucket() ? d.currentSessionId : window.OVC_SHARED_BUCKET_HELD_BY || "";
  const mainBucketSnapshot = d.getMainBucketGroundState();
  const snapshotBucketX = mainBucketSnapshot.x;
  const snapshotBucketY = mainBucketSnapshot.y;
  const snapshotBucketIsFull = mainBucketSnapshot.isFull;
  const plantIndexBonus = Math.max(0, Math.floor(Number(d.adminDebugPlantIndexBonus) || 0));
  return {
    /** ???? ??? ?????????????? ???? ??????????????? `d.rebasePlantModelTimestampsToLocalNow`??refTime???? ???? */
    savedAt: d.getSharedPlantSimulationNow(),
    savedBy: d.currentSessionId,
    resetToken: d.pendingWorldResetToken || d.lastAppliedWorldResetToken || "",
    plantIndexBonus,
    bucket: {
      x: snapshotBucketX,
      y: snapshotBucketY,
      isFull: snapshotBucketIsFull,
      heldBy: bucketHeldBy
    },
    well: {
      water: d.getWell().water,
      lastRefillAt: d.getWell().lastRefillAt
    },
    seed: {
      x: d.getWorldItems().seedX,
      y: d.getWorldItems().seedY,
      createdAt: d.getPlant().seedCreatedAt,
      isDry: d.getPlant().isSeedDry,
      isDryHandled: d.getSeedWorld().hasHandledDryMainSeed,
      isMainSeedAvailable: !d.hasPickedMainSeedInCurrentRoom()
    },
    mainPlant: d.getPlantStateForStorage(),
    apples: {
      pickedIds: d.getApple().pickedIds.slice(),
      nextSeedOffset: d.getApple().nextSeedOffset,
      lastSpawnAt: d.getApple().lastSpawnAt,
      apples: d.getApple().apples.map(function (apple) {
        return {
          id: apple.id,
          localX: apple.localX,
          localY: apple.localY,
          x: apple.x,
          y: apple.y,
          size: apple.size
        };
      }),
      // ?????(?????????): ????????? worldLooseSeed 1?????????. ???? ?????(stub)??extraSeeds.
      extraSeeds: d.usesWorldLooseSeedMode()
        ? d.getApple().extraSeeds
            .filter(function (extraSeed) {
              return !extraSeed.inInventory && extraSeed.planted;
            })
            .map(function (extraSeed) {
              return {
                id: extraSeed.id,
                x: extraSeed.x,
                y: extraSeed.y,
                createdAt: extraSeed.createdAt,
                planted: Boolean(extraSeed.planted),
                inInventory: Boolean(extraSeed.inInventory),
                label: extraSeed.label,
                isStarter: Boolean(extraSeed.isStarter),
                ownerUserId: extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
                ownerSessionId: extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
              };
            })
        : d.getApple().extraSeeds
            .filter(function (extraSeed) {
              return !extraSeed.inInventory;
            })
            .map(function (extraSeed) {
              return {
                id: extraSeed.id,
                x: extraSeed.x,
                y: extraSeed.y,
                createdAt: extraSeed.createdAt,
                planted: Boolean(extraSeed.planted),
                inInventory: Boolean(extraSeed.inInventory),
                label: extraSeed.label,
                isStarter: Boolean(extraSeed.isStarter),
                ownerUserId: extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
                ownerSessionId: extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
              };
            }),
      worldLooseSeed: d.usesWorldLooseSeedMode()
        ? (function () {
            d.ensureWorldLooseSeedShape();
            return {
              x: d.getApple().worldLooseSeed.x,
              y: d.getApple().worldLooseSeed.y,
              nextSpawnAt: d.getApple().worldLooseSeed.nextSpawnAt
            };
          })()
        : undefined,
      extraPlants: d.getApple().extraPlants.map(function (plant) {
        return {
          id: plant.id,
          x: plant.x,
          y: plant.y,
          plantedAt: plant.plantedAt,
          lastWateredAt: plant.lastWateredAt,
          wateredAtList: Array.isArray(plant.wateredAtList) ? plant.wateredAtList.slice() : [],
          status: plant.status,
          waterLevel: plant.waterLevel,
          waterLevelUpdatedAt: plant.waterLevelUpdatedAt,
          becameEmptyAt: plant.becameEmptyAt,
          isOverwatered: Boolean(plant.isOverwatered),
          rottenAt: plant.rottenAt || null,
          needsFirstWater: Boolean(plant.needsFirstWater),
          growthStartedAt: plant.growthStartedAt,
          isSproutGrown: Boolean(plant.isSproutGrown),
          sproutGrownAt: plant.sproutGrownAt,
          sproutEvolutionMs: plant.sproutEvolutionMs,
          sproutEvolutionLastTickAt: plant.sproutEvolutionLastTickAt,
          isSproutSelfSustaining: plant.isSproutSelfSustaining,
          growthTier: plant.growthTier || 0,
          waterCapacity: plant.waterCapacity || 2,
          powderUpgradeTargetTier: plant.powderUpgradeTargetTier || 0,
          powderUpgradeStartedAt: plant.powderUpgradeStartedAt || null,
          powderUpgradeDurationMs: plant.powderUpgradeDurationMs || 0,
          grassAuto5EligibleAt: plant.grassAuto5EligibleAt != null ? plant.grassAuto5EligibleAt : null,
          ownerUserId: plant.ownerUserId || "",
          ownerDisplayName: plant.ownerDisplayName || "",
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
          blockSproutRegrowthAfterDry: Boolean(plant.blockSproutRegrowthAfterDry),
          drySoilAt:
            plant.drySoilAt != null && Number.isFinite(Number(plant.drySoilAt))
              ? Number(plant.drySoilAt)
              : null,
          plantGoldKrw: Math.max(0, Math.floor(Number(plant.plantGoldKrw) || 0)),
          plantGoldUpdatedAt:
            plant.plantGoldUpdatedAt != null &&
            Number.isFinite(Number(plant.plantGoldUpdatedAt))
              ? Number(plant.plantGoldUpdatedAt)
              : null
        };
      }),
      worldRocks: d.isWorldDocumentEntry()
        ? (Array.isArray(d.getApple().worldRocks) ? d.getApple().worldRocks : []).map(function (rock) {
            if (!rock) {
              return { id: "", x: 0, y: 0, size: d.WORLD_ROCK_SIZE };
            }
            return {
              id: String(rock.id),
              x: Number(rock.x),
              y: Number(rock.y),
              size: Number.isFinite(Number(rock.size)) ? Number(rock.size) : d.WORLD_ROCK_SIZE
            };
          })
        : undefined,
      worldRockPickedIds: d.isWorldDocumentEntry()
        ? (Array.isArray(d.getApple().worldRockPickedIds)
            ? d.getApple().worldRockPickedIds.map(String)
            : [])
        : undefined,
      placedCraftFurniture: d.isWorldDocumentEntry()
        ? d.serializePlacedCraftFurnitureForSnapshot(d.placedCraftFurniture)
        : undefined,
      worldExtraBuckets: d.isWorldDocumentEntry()
        ? d.serializeWorldExtraBucketsForSnapshot(d.getApple().worldExtraBuckets)
        : undefined,
      worldBagDrops: d.serializeWorldBagDropsForSnapshot()
    },
    butterflies: d.getButterflyStateForSnapshot()
  };
  }

  function ingestSharedPlantIndexBonus(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  if (!Object.prototype.hasOwnProperty.call(snapshot, "plantIndexBonus")) return false;
  const incoming = Math.max(0, Math.floor(Number(snapshot.plantIndexBonus) || 0));
  const prev = Math.max(0, Math.floor(Number(d.adminDebugPlantIndexBonus) || 0));
  if (incoming <= prev) return false;
  d.adminDebugPlantIndexBonus = incoming;
  return true;
  }

  function syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt) {
  const next = syncServerClockOffsetCore(
    d.serverClockOffsetMs,
    d.lastServerClockSyncAt,
    serverRowUpdatedAt,
    Date.now()
  );
  if (!next.changed) return;
  d.serverClockOffsetMs = next.offsetMs;
  d.lastServerClockSyncAt = next.syncedAtMs;
  }

  function holdLocalPlantStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  d.localPlantActionLockUntil = Math.max(d.localPlantActionLockUntil, Date.now() + lockMs);
  }

  function holdLocalAppleStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  d.localAppleActionLockUntil = Math.max(d.localAppleActionLockUntil, Date.now() + lockMs);
  }

  function applySharedWorldSnapshot(snapshot, serverRowUpdatedAt) {
  if (d.isSharedWorldSyncPausedForTutorial()) return;
  if (!snapshot || typeof snapshot !== "object") return;
  const plantBonusChanged = d.ingestSharedPlantIndexBonus(snapshot);
  if (snapshot.savedBy === d.currentSessionId) {
    if (plantBonusChanged) d.updatePlantProgressGauge();
    return;
  }
  d.syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt);
  const snapshotSavedAt = resolveSnapshotSavedAt(snapshot, serverRowUpdatedAt);
  const syncedNow = d.getSynchronizedNow();
  let hasServerRowTime = false;
  if (serverRowUpdatedAt != null && serverRowUpdatedAt !== "") {
    const parsedRowAt =
      typeof serverRowUpdatedAt === "string"
        ? Date.parse(serverRowUpdatedAt)
        : Number(serverRowUpdatedAt);
    hasServerRowTime = Number.isFinite(parsedRowAt) && parsedRowAt > 0;
  }
  const snapshotResetToken = String(snapshot.resetToken || "");
  const isResetGuardWindow = syncedNow - d.lastWorldResetAt < 20000;
  // Local dev reset just pushed a new token; server may still return the pre-reset snapshot.
  if (
    isResetGuardWindow &&
    d.lastAppliedWorldResetToken &&
    snapshotResetToken !== d.lastAppliedWorldResetToken
  ) {
    return;
  }
  if (
    snapshotResetToken &&
    snapshotResetToken !== d.lastAppliedWorldResetToken
  ) {
    d.lastAppliedWorldResetToken = snapshotResetToken;
    d.lastWorldResetAt = syncedNow;
    d.ignoreSnapshotInventorySeedsUntil = Date.now() + 15000;
    d.persistOvcLastAppliedWorldResetToken(d.lastAppliedWorldResetToken);
    // ???? ??? ??? ??????? ?? + ????????????????????????????)
    d.clearStoredKeys(d.appStorageKeysSharedWorldReset);
    d.isWorldDirty = false;
    d.applyDefaultState({ sharedWorldResetOnly: true });
    d.savePlayerPosition(true);
    d.restartPlayerPositionOnly();
    d.isReloadingForWorldReset = true;
    setTimeout(function () {
      window.location.replace(d.ovcWorldIndexUrl());
    }, 120);
    return;
  }
  d.isApplyingWorldState = true;
  const shouldDeferRemotePlantApply = Date.now() < d.localPlantActionLockUntil;
  const shouldDeferRemoteAppleApply = Date.now() < d.localAppleActionLockUntil;

  try {
    // Bucket uses realtime bucket_state as primary source while multiplayer is connected.
    // Apply snapshot bucket fallback only when realtime channel is not subscribed.
    if (snapshot.bucket && !d.isMultiplayerSubscribed) {
      const heldBy = String(snapshot.bucket.heldBy || "");
      const nextBucketX = Number(snapshot.bucket.x);
      const nextBucketY = Number(snapshot.bucket.y);
      if (d.isHoldingMainBucket()) {
        // While local player is carrying the bucket, keep local ownership/state authoritative.
        window.OVC_SHARED_BUCKET_HELD_BY = d.currentSessionId;
      } else if (d.isHoldingExtraBucket()) {
        window.OVC_SHARED_BUCKET_HELD_BY = heldBy === d.currentSessionId ? "" : heldBy;
        if (!heldBy) {
          d.applyRemoteSharedMainBucketGround(
            nextBucketX,
            nextBucketY,
            snapshot.bucket.isFull
          );
        }
      } else {
        let resolvedHeldBy = heldBy;
        if (resolvedHeldBy && resolvedHeldBy !== d.currentSessionId) {
          const holder = d.remotePlayers[resolvedHeldBy];
          const holderActive =
            holder &&
            Number.isFinite(holder.lastSeenAt) &&
            Date.now() - holder.lastSeenAt < 5000;
          if (!holderActive) {
            resolvedHeldBy = "";
          }
        }
        if (resolvedHeldBy === d.currentSessionId && !d.isHoldingMainBucket()) {
          resolvedHeldBy = "";
        }
        window.OVC_SHARED_BUCKET_HELD_BY = resolvedHeldBy;
        if (resolvedHeldBy !== d.currentSessionId) {
          d.applyRemoteSharedMainBucketGround(
            nextBucketX,
            nextBucketY,
            snapshot.bucket.isFull
          );
        }
      }
    }

    if (snapshot.seed) {
      const nextSeedCreatedAt = Number(snapshot.seed.createdAt);
      const nextSeedX = Number(snapshot.seed.x);
      const nextSeedY = Number(snapshot.seed.y);
      const canApplyMainSeedState =
        hasServerRowTime ||
        !snapshotSavedAt ||
        snapshotSavedAt >= d.getSeedWorld().lastMainSeedStateChangeAt;
      // Per-account tutorial seed uses room-scoped storage; do not mirror shared snapshot here.
      if (canApplyMainSeedState && typeof snapshot.seed.isDryHandled === "boolean") {
        d.getSeedWorld().hasHandledDryMainSeed = Boolean(snapshot.seed.isDryHandled);
        d.setStoredFlag(d.mainDrySeedHandledKey, d.getSeedWorld().hasHandledDryMainSeed);
      }
      if (canApplyMainSeedState && typeof snapshot.seed.isMainSeedAvailable === "boolean") {
        if (snapshot.seed.isMainSeedAvailable) {
          d.clearMainSeedPickedForCurrentRoom();
          d.getSeedWorld().isMainSeedAvailable = true;
        } else {
          d.setMainSeedPickedForCurrentRoom();
          d.getSeedWorld().isMainSeedAvailable = false;
        }
      }
      if (canApplyMainSeedState && snapshotSavedAt) {
        d.getSeedWorld().lastMainSeedStateChangeAt = Math.max(d.getSeedWorld().lastMainSeedStateChangeAt, snapshotSavedAt);
      }
      if (canApplyMainSeedState) {
        if (d.getInventory().heldItem !== d.HELD_ITEM_SEED) {
          if (Number.isFinite(nextSeedX)) d.getWorldItems().seedX = nextSeedX;
          if (Number.isFinite(nextSeedY)) d.getWorldItems().seedY = nextSeedY;
        }
        if (Number.isFinite(nextSeedCreatedAt) && nextSeedCreatedAt > 0) {
          d.getPlant().seedCreatedAt = nextSeedCreatedAt;
          d.setStoredValue(d.seedCreatedAtKey, String(nextSeedCreatedAt));
        }
        if (!Number.isFinite(nextSeedCreatedAt) && typeof snapshot.seed.isDry === "boolean") {
          d.getPlant().isSeedDry = Boolean(snapshot.seed.isDry);
        }
      }
    }

    // Shared world rows are authoritative once the server reports a new updated_at.
/** ?????????? ????????????? ???? ???????? ??? ??d.appStorageKeysSharedWorldReset???? ?????????????? ?????. local??????? */
    // is ahead of the snapshot savedAt (clock skew or any local saveAppleState).
    if (snapshot.well) {
      d.getWell().water = Math.max(0, Math.min(d.maxWellWater, Number(snapshot.well.water) || 0));
      d.getWell().lastRefillAt = Number(snapshot.well.lastRefillAt) || Date.now();
      d.refillWellIfNeeded();
      if (snapshotSavedAt) {
        d.getWell().lastStateChangeAt = Math.max(d.getWell().lastStateChangeAt, snapshotSavedAt);
      }
    }

    // Snapshot apply rule (mainPlant):
    // - apply by default (server row is authoritative),
    // - but defer during short local action locks to avoid flicker/rollback.
    const shouldApplyMainPlantSnapshot = Boolean(snapshot.mainPlant) && !shouldDeferRemotePlantApply;
    if (shouldApplyMainPlantSnapshot) {
      let incomingPlant = parseMainPlantFromSnapshot(snapshot.mainPlant);
      const snapAt = snapshotSavedAt || 0;
      if (
        !hasServerRowTime &&
        incomingPlant &&
        snapAt > 0 &&
        d.getPlant().lastMainPlantStateChangeAt > 0 &&
        snapAt < d.getPlant().lastMainPlantStateChangeAt - 1200
      ) {
        incomingPlant = null;
      }
      if (
        !hasServerRowTime &&
        incomingPlant &&
        snapAt > 0 &&
        snapAt < d.getPlant().lastMainPlantStateChangeAt - 2000 &&
        d.getPlant().isSeedPlanted &&
        !incomingPlant.isSeedPlanted
      ) {
        incomingPlant = null;
      }
      if (d.shouldIgnoreEmptyRemoteMainPlant(incomingPlant)) {
        incomingPlant = null;
        d.markWorldDirty();
      }
      if (incomingPlant) {
        if (
          d.isPowderUpgradeInProgress(d.getPlant()) &&
          !d.isPowderUpgradeInProgress(incomingPlant) &&
          (incomingPlant.growthTier || 0) === (d.getPlant().growthTier || 0)
        ) {
          incomingPlant = Object.assign({}, incomingPlant, {
            powderUpgradeTargetTier: d.getPlant().powderUpgradeTargetTier,
            powderUpgradeStartedAt: d.getPlant().powderUpgradeStartedAt,
            powderUpgradeDurationMs: d.getPlant().powderUpgradeDurationMs,
            matureKind: d.getPlant().matureKind || ""
          });
        }
        d.applyLoadedPlantState(incomingPlant);
        const localApplyNow = d.getSynchronizedNow();
        const snapshotRefTime =
          (Number(snapshot.savedAt) > 0 ? Number(snapshot.savedAt) : 0) ||
          (snapshotSavedAt > 0 ? snapshotSavedAt : 0);
        if (d.getPlant().isSeedPlanted && snapshotRefTime > 0) {
          d.rebasePlantModelTimestampsToLocalNow(d.getPlant(), localApplyNow, snapshotRefTime);
        }
        d.sanitizePrematureRemotePlantDryState(d.getPlant(), localApplyNow, snapshotRefTime);
        d.sanitizeSharedPlantHydrationAfterRemoteSnapshot(
          d.getPlant(),
          localApplyNow,
          d.getMainDryAfterEmptyMsForPlant
        );
        d.normalizePlantSproutFieldsWhenSoilDry(d.getPlant());
        d.getNpc().x = Number(snapshot.mainPlant.npcX) || d.getNpc().x;
        d.getNpc().y = Number(snapshot.mainPlant.npcY) || d.getNpc().y;
        if (d.getPlant().isSeedPlanted) {
          d.plantSpot.src = d.getPlantSoilSrc(d.getPlant());
          d.setWorldPosition(d.plantSpot, d.getPlant().spotX, d.getPlant().spotY);
          const mainRot = d.getPlant().status === "rotten" || d.getPlant().isOverwatered;
          d.plantSpot.style.display =
            mainRot || !d.shouldHideSeparateSoilUnderBigGrass(d.getPlant()) ? "block" : "none";
        } else {
          d.plantSpot.style.display = "none";
        }
        if (snapshotSavedAt) {
          d.getPlant().lastMainPlantStateChangeAt = Math.max(
            d.getPlant().lastMainPlantStateChangeAt,
            snapshotSavedAt
          );
        }
      }
    }

    // Snapshot apply rule (apples/extra seeds/plants):
    // - defer during local apples lock window,
    // - then resume full merge on subsequent polls.
    if (snapshot.apples && !shouldDeferRemoteAppleApply) {
      const priorExtraSeeds = d.getApple().extraSeeds.slice();
      const priorExtraPlants = d.getApple().extraPlants.slice();
      const priorWorldLooseNextSpawnAt =
        d.usesWorldLooseSeedMode() &&
        d.getApple().worldLooseSeed &&
        typeof d.getApple().worldLooseSeed === "object"
          ? Math.max(0, Number(d.getApple().worldLooseSeed.nextSpawnAt) || 0)
          : 0;
      const snapshotAppleTime = snapshotSavedAt || 0;
      const snapshotPlantIdsEarly = Object.create(null);
      if (Array.isArray(snapshot.apples.extraPlants)) {
        snapshot.apples.extraPlants.forEach(function (p) {
          if (p && p.id != null) snapshotPlantIdsEarly[String(p.id)] = true;
        });
      }
      const seedPendingFromRecentLocalEdit =
        !hasServerRowTime &&
        (!snapshotAppleTime ||
          d.getApple().lastStateChangeAt + 2000 > snapshotAppleTime);
      let shouldMergePendingPlants = seedPendingFromRecentLocalEdit;
      if (!shouldMergePendingPlants) {
        const snapMissingLocalPlant = priorExtraPlants.some(function (p) {
          if (!p || p.id == null || p.removed) return false;
          return !snapshotPlantIdsEarly[String(p.id)];
        });
        if (snapMissingLocalPlant) {
          shouldMergePendingPlants = true;
        }
      }
      const localInventorySeeds = d.getApple().extraSeeds.filter(function (extraSeed) {
        return (
          Boolean(extraSeed.inInventory) &&
          !extraSeed.planted &&
          d.isExtraSeedOwnedByLocalPlayer(extraSeed)
        );
      }).map(function (extraSeed) {
        return {
          id: extraSeed.id,
          x: extraSeed.x,
          y: extraSeed.y,
          createdAt: extraSeed.createdAt,
          planted: false,
          inInventory: true,
          label: extraSeed.label || "\uC528\uC557",
          isStarter: Boolean(extraSeed.isStarter),
          ownerUserId:
            extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
          ownerSessionId:
            extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
        };
      });
      const localInventorySeedIds = {};
      localInventorySeeds.forEach(function (invSeed) {
        localInventorySeedIds[String(invSeed.id)] = true;
      });
      d.invalidateGroundSeedElementRefsOnly(priorExtraSeeds);
      d.clearGroundExtraSeedElementsOnly();
      d.getApple().pickedIds = Array.isArray(snapshot.apples.pickedIds) ? snapshot.apples.pickedIds.slice() : [];
      d.getApple().nextSeedOffset = Math.max(0, Number(snapshot.apples.nextSeedOffset) || 0);
      d.getApple().lastSpawnAt = Number(snapshot.apples.lastSpawnAt) || Date.now();
      d.getApple().apples = Array.isArray(snapshot.apples.apples)
        ? snapshot.apples.apples.map(d.parseTreeAppleFromSnapshot)
        : d.getApple().apples;
      if (d.usesWorldLooseSeedMode()) {
        const wls = snapshot.apples.worldLooseSeed;
        if (wls && typeof wls === "object") {
          const incomingNext = Math.max(0, Number(wls.nextSpawnAt) || 0);
          const nowLoose = syncedNow;
          let mergedNextSpawnAt;
          if (hasServerRowTime) {
            if (priorWorldLooseNextSpawnAt > nowLoose) {
              // Keep local active pickup cooldown from being rolled back by stale rows.
              mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
            } else if (incomingNext > nowLoose) {
              mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
            } else {
              mergedNextSpawnAt = incomingNext;
            }
          } else {
            mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
          }
          d.getApple().worldLooseSeed = {
            x: Number(wls.x) || d.WORLD_LOOSE_SEED_X,
            y: Number(wls.y) || d.WORLD_LOOSE_SEED_Y,
            nextSpawnAt: mergedNextSpawnAt
          };
          d.worldLoosePickupLockUntil = Math.max(
            Number(d.worldLoosePickupLockUntil || 0),
            Number(mergedNextSpawnAt || 0)
          );
          d.syncWorldLoosePickupLock(syncedNow);
        } else {
          d.ensureWorldLooseSeedShape();
        }
        const plantedById = Object.create(null);
        priorExtraSeeds.forEach(function (s) {
          if (s && s.planted && s.id != null) {
            plantedById[String(s.id)] = s;
          }
        });
        if (Array.isArray(snapshot.apples.extraSeeds)) {
          snapshot.apples.extraSeeds.forEach(function (raw) {
            if (!raw || !raw.planted || raw.id == null) return;
            plantedById[String(raw.id)] = d.parseSharedGroundSeedFromSnapshot(raw);
          });
        }
        const mergedPlanted = Object.keys(plantedById).map(function (k) {
          return plantedById[k];
        });
        if (Date.now() < d.ignoreSnapshotInventorySeedsUntil) {
          d.getApple().extraSeeds = localInventorySeeds.slice();
        } else {
          d.getApple().extraSeeds = dedupeExtraSeedsPreferInventory(
            localInventorySeeds.concat(mergedPlanted)
          );
        }
      } else {
        const snapshotExtraSeedIds = Object.create(null);
        if (Array.isArray(snapshot.apples.extraSeeds)) {
          snapshot.apples.extraSeeds.forEach(function (extraSeed) {
            if (extraSeed && extraSeed.id != null) {
              snapshotExtraSeedIds[String(extraSeed.id)] = true;
            }
          });
        }
        let shouldMergePendingSeeds = seedPendingFromRecentLocalEdit;
        if (!shouldMergePendingSeeds) {
          const snapMissingLocalOwnedGroundSeed = priorExtraSeeds.some(function (s) {
            if (!s || s.id == null) return false;
            if (Boolean(s.inInventory) || Boolean(s.planted)) return false;
            if (!d.isExtraSeedSessionOwnedByLocal(s)) return false;
            return !snapshotExtraSeedIds[String(s.id)];
          });
          if (snapMissingLocalOwnedGroundSeed) {
            shouldMergePendingSeeds = true;
          }
        }
        d.getApple().extraSeeds = Array.isArray(snapshot.apples.extraSeeds)
          ? snapshot.apples.extraSeeds
              .filter(function (extraSeed) {
                return !localInventorySeedIds[String(extraSeed.id)];
              })
              .map(d.parseSharedGroundSeedFromSnapshot)
          : [];
        if (Date.now() < d.ignoreSnapshotInventorySeedsUntil) {
          d.getApple().extraSeeds = localInventorySeeds.slice();
        } else if (localInventorySeeds.length > 0) {
          d.getApple().extraSeeds = d.getApple().extraSeeds.concat(localInventorySeeds);
        }
        d.getApple().extraSeeds = dedupeExtraSeedsPreferInventory(d.getApple().extraSeeds);
        if (shouldMergePendingSeeds) {
          const pendingExtraSeeds = priorExtraSeeds.filter(function (s) {
            if (!s || s.id == null) return false;
            if (Boolean(s.inInventory)) return false;
            if (Boolean(s.planted)) return false;
            const sid = String(s.id);
            if (d.getInventory().plantingInventorySeedId && sid === String(d.getInventory().plantingInventorySeedId)) return false;
            if (d.extraSeedHasCorrespondingExtraPlant(sid, priorExtraPlants)) return false;
            if (snapshotExtraSeedIds[sid]) return false;
            if (localInventorySeedIds[sid]) return false;
            if (!seedPendingFromRecentLocalEdit && !d.isExtraSeedSessionOwnedByLocal(s)) {
              return false;
            }
            return true;
          });
          if (pendingExtraSeeds.length > 0) {
            d.getApple().extraSeeds = d.getApple().extraSeeds.concat(pendingExtraSeeds);
            d.getApple().extraSeeds = dedupeExtraSeedsPreferInventory(d.getApple().extraSeeds);
          }
        }
      }
      const incomingExtraPlants = shouldDeferRemotePlantApply
        ? priorExtraPlants.slice()
        : Array.isArray(snapshot.apples.extraPlants)
          ? snapshot.apples.extraPlants.map(parseExtraPlantFromSnapshot)
          : [];
      let nextExtraPlants = incomingExtraPlants;
      if (shouldMergePendingPlants) {
        const pendingLocalPlants = priorExtraPlants.filter(function (p) {
          if (!p || p.id == null) return false;
          return !snapshotPlantIdsEarly[String(p.id)];
        });
        if (pendingLocalPlants.length > 0) {
          nextExtraPlants = incomingExtraPlants.concat(pendingLocalPlants);
        }
      }
      const nextPlantIdSet = Object.create(null);
      nextExtraPlants.forEach(function (p) {
        if (p && p.id != null) nextPlantIdSet[String(p.id)] = true;
      });
      priorExtraPlants.forEach(function (p) {
        if (!p || p.id == null) return;
        if (!nextPlantIdSet[String(p.id)]) {
          d.teardownExtraPlantDom(p);
        }
      });
      const priorPlantById = Object.create(null);
      priorExtraPlants.forEach(function (p) {
        if (p && p.id != null) priorPlantById[String(p.id)] = p;
      });
      nextExtraPlants.forEach(function (p) {
        if (!p || p.id == null) return;
        const prev = priorPlantById[String(p.id)];
        if (!prev || prev === p) return;
        if (prev.spotElement && document.contains(prev.spotElement)) {
          p.spotElement = prev.spotElement;
          p.sproutElement = prev.sproutElement;
          p.waterNeededElement = prev.waterNeededElement;
          p.growthMeterElement = prev.growthMeterElement;
          p.growthMeterFill = prev.growthMeterFill;
          prev.spotElement = undefined;
          prev.sproutElement = undefined;
          prev.waterNeededElement = undefined;
          prev.growthMeterElement = undefined;
          prev.growthMeterFill = undefined;
        }
      });
      d.getApple().extraPlants = nextExtraPlants;
      d.getApple().extraSeeds = dedupeExtraSeedsPreferInventory(
        d.pruneGroundExtraSeedsShadowedByPlants(d.getApple().extraSeeds, d.getApple().extraPlants)
      );
      if (d.usesWorldLooseSeedMode()) {
        d.sanitizeWorldLooseModeExtraSeeds();
      }
      const snapRefPlants =
        (Number(snapshot.savedAt) > 0 ? Number(snapshot.savedAt) : 0) ||
        (snapshotSavedAt > 0 ? snapshotSavedAt : 0);
      const extraPlantClockNow = d.getSynchronizedNow();
      d.getApple().extraPlants.forEach(function (ep) {
        if (!ep) return;
        if (snapRefPlants > 0) {
          d.rebasePlantModelTimestampsToLocalNow(ep, extraPlantClockNow, snapRefPlants);
        }
        d.sanitizePrematureRemotePlantDryState(ep, extraPlantClockNow, snapRefPlants);
        d.stabilizeFirstWaterHintFlags(ep);
        d.sanitizeSharedPlantHydrationAfterRemoteSnapshot(ep, extraPlantClockNow, d.getExtraDryDelayMs);
        d.normalizePlantSproutFieldsWhenSoilDry(ep);
      });
      const now = syncedNow;
      Object.keys(d.localApplePickedAtById).forEach(function (appleId) {
        const pickedAt = Number(d.localApplePickedAtById[appleId] || 0);
        if (!pickedAt || now - pickedAt >= d.appleRespawnMs) return;
        if (!d.getApple().pickedIds.includes(appleId)) {
          d.getApple().pickedIds.push(appleId);
        }
        if (!d.getApple().lastSpawnAt || d.getApple().lastSpawnAt < pickedAt) {
          d.getApple().lastSpawnAt = pickedAt;
        }
      });
      if (d.isWorldDocumentEntry()) {
        const snapApples = snapshot.apples;
        const sr = snapApples.worldRocks;
        const sp = snapApples.worldRockPickedIds;
        if (!shouldDeferRemoteAppleApply && Array.isArray(sr) && sr.length === d.WORLD_LOOSE_ROCK_COUNT) {
          const m = d.WORLD_ROCK_SPAWN_X_MARGIN;
          const xMax = d.WORLD_WIDTH - m - d.WORLD_ROCK_SIZE;
          const rocksOk = sr.every(function (r) {
            if (!r || typeof r.id !== "string") return false;
            const x = Number(r.x);
            const y = Number(r.y);
            const sz = Number(r.size);
            return (
              Number.isFinite(x) &&
              Number.isFinite(y) &&
              Number(sz) === d.WORLD_ROCK_SIZE &&
              x >= m &&
              x <= xMax &&
              y >= d.WORLD_ROCK_SPAWN_Y_MIN &&
              y <= d.WORLD_ROCK_SPAWN_Y_MAX
            );
          });
          if (rocksOk) {
            const priorRockById = {};
            d.getApple().worldRocks.forEach(function (rock) {
              if (rock && rock.id != null) {
                priorRockById[String(rock.id)] = rock;
              }
            });
            d.getApple().worldRocks = sr.map(function (r) {
              const id = String(r.id);
              const prev = priorRockById[id];
              const next = {
                id: id,
                x: Number(r.x),
                y: Number(r.y),
                size: d.WORLD_ROCK_SIZE
              };
              if (prev && prev._el) {
                next._el = prev._el;
              }
              return next;
            });
          }
        }
        if (Array.isArray(sp)) {
          const merged = new Set(d.getApple().worldRockPickedIds.map(String));
          sp.forEach(function (id) {
            if (id != null && String(id).trim() !== "") {
              merged.add(String(id));
            }
          });
          d.getApple().worldRockPickedIds = Array.from(merged);
        }
        if (!shouldDeferRemoteAppleApply) {
          const snapFurniture = snapApples.placedCraftFurniture;
          if (Array.isArray(snapFurniture)) {
            d.placedCraftFurniture = d.parsePlacedCraftFurnitureFromSnapshot(snapFurniture);
            d.rebuildPlacedCraftFurnitureDom();
          }
        }
        if (!shouldDeferRemoteAppleApply && Array.isArray(snapApples.worldExtraBuckets)) {
          d.applyWorldExtraBucketsFromSharedSnapshot(snapApples.worldExtraBuckets);
        }
        if (!shouldDeferRemoteAppleApply && Array.isArray(snapApples.worldBagDrops)) {
          d.mergeWorldBagDropsFromSnapshot(snapApples.worldBagDrops);
        }
      }
      if (snapshotSavedAt) {
        d.getApple().lastStateChangeAt = Math.max(d.getApple().lastStateChangeAt, snapshotSavedAt);
      }
    }

    // Always merge butterfly membership from other clients' saves. A timestamp
    // guard would drop removals because the authority bumps d.lastButterflyStateChangeAt
    // every movement broadcast while non-authority catches use an older savedAt.
    if (snapshot.butterflies) {
      const butterflySnapshotAt = snapshotSavedAt || Date.now();
      if (!d.lastButterflyRealtimeStateAt || butterflySnapshotAt >= d.lastButterflyRealtimeStateAt - 500) {
        d.applyButterflySnapshot(snapshot.butterflies, butterflySnapshotAt);
      }
      if (snapshotSavedAt) {
        d.lastButterflyStateChangeAt = Math.max(
          d.lastButterflyStateChangeAt,
          snapshotSavedAt
        );
      }
    }

    d.refreshUiAfterSharedWorldApply();
  } finally {
    d.isApplyingWorldState = false;
  }
  }

  return {
    flushPassiveSimulationBeforeSharedSnapshot,
    getSharedWorldSnapshot,
    ingestSharedPlantIndexBonus,
    syncServerClockOffsetFromRowUpdatedAt,
    holdLocalPlantStateAgainstStaleSnapshot,
    holdLocalAppleStateAgainstStaleSnapshot,
    applySharedWorldSnapshot,
  };
}
