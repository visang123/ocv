/** Systems — 사과/우물/바위/가방 드롭 등 월드 리스폰·리필. */
export function createModule(d) {
  function addPlantWorldRockAvoidZone(zones, plant, pad) {
  const px = Number(plant && (plant.x != null ? plant.x : plant.spotX));
  const py = Number(plant && (plant.y != null ? plant.y : plant.spotY));
  const maturity = d.getPlantMaturityLevelForPlantingSpacing(plant);
  if (!Number.isFinite(px) || !Number.isFinite(py) || maturity == null) return;
  const centerX = px + d.PLANT_SPOT_WIDTH / 2;
  const centerY = py + d.PLANT_SPOT_HEIGHT / 2;
  const radius = d.getMinPlantCenterClearanceWorld(maturity) + d.WORLD_ROCK_SIZE / 2 + pad;
  zones.push({
    left: centerX - radius,
    top: centerY - radius,
    right: centerX + radius,
    bottom: centerY + radius
  });
  }

  function buildWorldBagDropElement(drop, stackIndex) {
  const visual = d.getBagDropGroundVisual(drop.itemKey);
  if (!visual) return null;

  const root = document.createElement("div");
  root.className = "world-bag-drop";
  root.dataset.dropId = String(drop.id);
  root.setAttribute("aria-hidden", "true");
  root.style.zIndex = String(d.getWorldBagDropZIndex(drop, stackIndex));

  const inner = document.createElement("div");
  inner.className = "world-bag-drop__inner";
  const dropAgeMs = Date.now() - (Number(drop.droppedAt) || 0);
  if (dropAgeMs >= 0 && dropAgeMs < 600) {
    inner.classList.add("is-settling");
    inner.addEventListener(
      "animationend",
      function () {
        inner.classList.remove("is-settling");
      },
      { once: true }
    );
  }

  const stack = document.createElement("div");
  stack.className = "world-bag-drop__stack";

  if (visual.kind === "img" && visual.src) {
    const img = document.createElement("img");
    img.className = "world-bag-drop__icon";
    img.src = visual.src;
    img.alt = visual.alt || "";
    img.draggable = false;
    stack.appendChild(img);
  } else {
    const icon = document.createElement("span");
    icon.className = "world-bag-drop__icon " + (visual.className || "bag-drop-icon");
    icon.setAttribute("aria-hidden", "true");
    stack.appendChild(icon);
  }

  inner.appendChild(stack);

  const count = Math.max(1, Math.floor(Number(drop.count) || 0));
  if (count > 1) {
    const countEl = document.createElement("span");
    countEl.className = "world-bag-drop__count";
    countEl.textContent = d.formatWorldBagDropCountLabel(count);
    inner.appendChild(countEl);
  }

  root.appendChild(inner);
  return root;
  }

  function buildWorldRockSpawnContext() {
  return {
    apples: d.getApple().apples,
    worldLooseSeed: d.getApple().worldLooseSeed,
    extraSeeds: d.getApple().extraSeeds,
    extraPlants: d.getApple().extraPlants,
    plantSpot:
      d.getPlant().isSeedPlanted &&
      Number.isFinite(d.getPlant().spotX) &&
      Number.isFinite(d.getPlant().spotY) &&
      (d.getPlant().spotX !== 0 || d.getPlant().spotY !== 0)
        ? {
            x: d.getPlant().spotX,
            y: d.getPlant().spotY,
            growthTier: d.getPlant().growthTier,
            isSproutGrown: d.getPlant().isSproutGrown,
            sproutStage: d.getPlant().sproutStage,
            removed: false
          }
        : null
  };
  }

  function collectWorldRockAvoidZones(ctx) {
  const p = d.WORLD_ROCK_UI_CLEAR_PAD;
  const zones = [];
  const wx = Number.isFinite(d.getWorldItems().wellX) && d.getWorldItems().wellX > 0 ? d.getWorldItems().wellX : d.WELL_START_X;
  const wy = Number.isFinite(d.getWorldItems().wellY) && d.getWorldItems().wellY > 0 ? d.getWorldItems().wellY : d.WELL_START_Y;
  zones.push(d.expandWorldRockAvoidRect(wx, wy, d.WELL_SIZE, d.WELL_SIZE, p));
  zones.push(
    d.expandWorldRockAvoidRect(d.spawnPortalX, d.spawnPortalY, d.spawnPortalWidth, d.spawnPortalHeight, p)
  );
  zones.push(d.expandWorldRockAvoidRect(d.getWorldItems().signX, d.getWorldItems().signY, d.SIGN_WIDTH, d.SIGN_HEIGHT, p));
  zones.push(d.expandWorldRockAvoidRect(d.getWorldItems().guideBookX, d.getWorldItems().guideBookY, d.GUIDE_BOOK_WIDTH, d.GUIDE_BOOK_HEIGHT, p));
  zones.push(d.expandWorldRockAvoidRect(d.getWorldItems().worldBagX, d.getWorldItems().worldBagY, d.WORLD_BAG_WIDTH, d.WORLD_BAG_HEIGHT, p));
  zones.push(d.expandWorldRockAvoidRect(d.getNpc().x, d.getNpc().y, d.NPC_WIDTH, d.NPC_HEIGHT, p));
  zones.push(d.expandWorldRockAvoidRect(d.NPC_START_X, d.NPC_START_Y, d.NPC_WIDTH, d.NPC_HEIGHT, p));
  zones.push(
    d.expandWorldRockAvoidRect(
      d.TRADE_MASTER_START_X,
      d.TRADE_MASTER_START_Y,
      d.NPC_WIDTH,
      d.NPC_HEIGHT,
      p
    )
  );
  zones.push(
    d.expandWorldRockAvoidRect(
      d.ALCHEMY_MASTER_START_X,
      d.ALCHEMY_MASTER_START_Y,
      d.NPC_WIDTH,
      d.NPC_HEIGHT,
      p
    )
  );
  zones.push(d.expandWorldRockAvoidRect(d.getWorldItems().seedX, d.getWorldItems().seedY, d.SEED_SIZE, d.SEED_SIZE, p));
  const bucketSz = d.getBucketSize();
  const bx =
    Number.isFinite(d.getWorldItems().bucketX) && d.getWorldItems().bucketX > 0 ? d.getWorldItems().bucketX : d.WELL_START_X - bucketSz.width - 8;
  const by =
    Number.isFinite(d.getWorldItems().bucketY) && d.getWorldItems().bucketY > 0 ? d.getWorldItems().bucketY : d.WELL_START_Y + d.WELL_SIZE - bucketSz.height;
  zones.push(d.expandWorldRockAvoidRect(bx, by, bucketSz.width, bucketSz.height, p));
  (Array.isArray(d.getApple().worldExtraBuckets) ? d.getApple().worldExtraBuckets : []).forEach(
    function (extraBucket) {
      if (!extraBucket) return;
      zones.push(
        d.expandWorldRockAvoidRect(extraBucket.x, extraBucket.y, bucketSz.width, bucketSz.height, p)
      );
    }
  );

  const canopyInset = 6;
  zones.push(
    d.expandWorldRockAvoidRect(
      d.TREE_CANOPY_LEFT + canopyInset,
      d.TREE_CANOPY_TOP + canopyInset,
      d.TREE_CANOPY_RIGHT - d.TREE_CANOPY_LEFT - 2 * canopyInset,
      d.TREE_CANOPY_BOTTOM - d.TREE_CANOPY_TOP - 2 * canopyInset,
      p
    )
  );
  const trunkInset = 3;
  const trunkLeft = d.TREE_TRUNK_X - d.TREE_CLIMB_DISTANCE + trunkInset;
  const trunkW = d.TREE_TRUNK_WIDTH + 2 * d.TREE_CLIMB_DISTANCE - 2 * trunkInset;
  const trunkTop = d.TREE_TRUNK_TOP - 22;
  const trunkBottom = d.BIG_TREE_Y + d.BIG_TREE_HEIGHT + d.TREE_CSS_ROOTS_BOTTOM_EXTEND;
  zones.push(d.expandWorldRockAvoidRect(trunkLeft, trunkTop, trunkW, trunkBottom - trunkTop, p));
  const rootsTop =
    d.BIG_TREE_Y +
    d.BIG_TREE_HEIGHT +
    d.TREE_CSS_ROOTS_BOTTOM_EXTEND -
    d.TREE_CSS_ROOTS_HEIGHT;
  const rootsBottom = d.BIG_TREE_Y + d.BIG_TREE_HEIGHT + d.TREE_CSS_ROOTS_BOTTOM_EXTEND;
  zones.push(
    d.expandWorldRockAvoidRect(
      d.BIG_TREE_X + d.TREE_CSS_ROOTS_LEFT,
      rootsTop,
      d.TREE_CSS_ROOTS_WIDTH,
      rootsBottom - rootsTop,
      p
    )
  );

  const apples = (ctx && ctx.apples) || [];
  apples.forEach(function (a) {
    if (!a) return;
    const sz = Number.isFinite(Number(a.size)) ? Number(a.size) : 10;
    const ax = Number(a.x);
    const ay = Number(a.y);
    if (!Number.isFinite(ax) || !Number.isFinite(ay)) return;
    zones.push(d.expandWorldRockAvoidRect(ax, ay, sz, sz, p));
  });

  if (ctx && ctx.worldLooseSeed) {
    const lx = Number(ctx.worldLooseSeed.x);
    const ly = Number(ctx.worldLooseSeed.y);
    if (Number.isFinite(lx) && Number.isFinite(ly)) {
      zones.push(d.expandWorldRockAvoidRect(lx, ly, d.SEED_SIZE, d.SEED_SIZE, p));
    }
  }

  const extraSeeds = (ctx && ctx.extraSeeds) || [];
  extraSeeds.forEach(function (s) {
    if (!s || s.planted || s.inInventory) return;
    const ex = Number(s.x);
    const ey = Number(s.y);
    if (!Number.isFinite(ex) || !Number.isFinite(ey)) return;
    zones.push(d.expandWorldRockAvoidRect(ex, ey, d.SEED_SIZE, d.SEED_SIZE, p));
  });

  const extraPlants = (ctx && ctx.extraPlants) || [];
  extraPlants.forEach(function (plant) {
    if (!plant || plant.removed) return;
    d.addPlantWorldRockAvoidZone(zones, plant, p);
  });

  if (ctx && ctx.plantSpot) {
    d.addPlantWorldRockAvoidZone(zones, ctx.plantSpot, p);
  }

  return zones;
  }

  function createRandomApple(id) {
  const size = 10;
  let localX = 18 + Math.floor(Math.random() * 104);
  let localY = 16 + Math.floor(Math.random() * 76);
  let attempts = 0;

  while (d.isAppleInTrunkArea(localX, localY, size) && attempts < 16) {
    localX = 18 + Math.floor(Math.random() * 104);
    localY = 16 + Math.floor(Math.random() * 76);
    attempts += 1;
  }

  return {
    id,
    localX,
    localY,
    x: d.BIG_TREE_X + localX,
    y: d.BIG_TREE_Y + localY,
    size
  };
  }

  function ensureWorldBagDropsArray() {
  if (!Array.isArray(d.getApple().worldBagDrops)) {
    d.getApple().worldBagDrops = [];
  }
  }

  function ensureWorldLooseSeedShape() {
  if (!d.getApple().worldLooseSeed || typeof d.getApple().worldLooseSeed !== "object") {
    d.getApple().worldLooseSeed = d.createDefaultWorldLooseSeedRecord();
    return;
  }
  d.normalizeWorldLooseSeedRecord(d.getApple().worldLooseSeed);
  }

  function expandWorldRockAvoidRect(left, top, w, h, pad) {
  return {
    left: left - pad,
    top: top - pad,
    right: left + w + pad,
    bottom: top + h + pad
  };
  }

  function getBucketSize() {
  return {
    width: d.BUCKET_SIZE,
    height: d.BUCKET_SIZE
  };
  }

  function getCenterDistance(x, y, width, height) {
  return d.getCenterDistanceUtil(d.getPlayerBox(), x, y, width, height);
  }

  function getLocalPlayerBodyHeight() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_HEIGHT : d.PLAYER_HEIGHT;
  }

  function getLocalPlayerBodyWidth() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_WIDTH : d.PLAYER_WIDTH;
  }

  function getPlantIndexScoringOptions(now) {
  return {
    now: now != null ? now : d.getSharedPlantSimulationNow(),
    getSproutStageFromPlant: d.getSproutStageFromPlant,
    isPowderUpgradeInProgress: d.isPowderUpgradeInProgress,
    getPowderUpgradeRatio: d.getPowderUpgradeRatio,
    getGrassAutoTier5GrowthRatio: d.getGrassAutoTier5GrowthRatio
  };
  }

  function getPlantMaturityLevelForPlantingSpacing(plant) {
  if (!plant || plant.removed) return null;
  const gt = Math.max(0, Number(plant.growthTier) || 0);
  const stage = plant.isSproutGrown ? d.getSproutStageFromPlant(plant) : 0;
  return Math.min(5, Math.max(gt, stage));
  }

  function getPlayerBox() {
  const bodyW = d.getLocalPlayerBodyWidth();
  const bodyH = d.getLocalPlayerBodyHeight();
  const top = d.GROUND_WORLD_HEIGHT - bodyH - d.getPlayer().depth + d.getPlayer().jumpY;
  const bottom = d.GROUND_WORLD_HEIGHT - d.getPlayer().depth + d.getPlayer().jumpY;

  return {
    left: d.getPlayer().x,
    top,
    right: d.getPlayer().x + bodyW,
    bottom,
    width: bodyW,
    height: bodyH
  };
  }

  function getSharedPlantSimulationNow() {
  return d.isSharedWorldMergeActive() ? d.getSynchronizedNow() : Date.now();
  }

  function getSproutStageFromPlant(plant) {
  if (!plant || !plant.isSproutGrown) return 0;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 5) return 5;
  if (tier >= 4) return 4;
  if (plant.isSproutSelfSustaining) return 3;
  const ev = plant.sproutEvolutionMs || 0;
  if (ev < d.sproutStage1Ms) return 1;
  return 2;
  }

  function getSynchronizedNow() {
  return d.getSynchronizedNowCore(d.serverClockOffsetMs);
  }

  function getTotalPlantIndexScore() {
  const plants = [];
  if (d.getPlant() && d.getPlant().isSeedPlanted) {
    plants.push(d.getPlant());
  }
  if (d.getApple() && Array.isArray(d.getApple().extraPlants)) {
    d.getApple().extraPlants.forEach(function (p) {
      if (p && !p.removed) plants.push(p);
    });
  }
  const bonus = Math.max(0, Math.floor(Number(d.adminDebugPlantIndexBonus) || 0));
  return d.sumPlantIndexScoreForPlants(plants, d.getPlantIndexScoringOptions(), bonus);
  }

  function getUnpickedWorldRockCount() {
  if (!Array.isArray(d.getApple().worldRocks)) return 0;
  const picked = new Set((d.getApple().worldRockPickedIds || []).map(String));
  return d.getApple().worldRocks.filter(function (rock) {
    return rock && !picked.has(String(rock.id));
  }).length;
  }

  function getWellSize() {
  return {
    width: d.WELL_SIZE,
    height: d.WELL_SIZE
  };
  }

  function isAppleInTrunkArea(localX, localY, size) {
  const trunkLocalLeft = d.TREE_TRUNK_X - d.BIG_TREE_X;
  const trunkLocalRight = trunkLocalLeft + d.TREE_TRUNK_WIDTH;
  const trunkTopLocalY = d.TREE_TRUNK_TOP - d.BIG_TREE_Y;
  const xPadding = 8;
  const yPadding = 10;
  const appleLeft = localX;
  const appleRight = localX + size;
  const appleTop = localY;
  const appleBottom = localY + size;

  return (
    appleRight >= trunkLocalLeft - xPadding &&
    appleLeft <= trunkLocalRight + xPadding &&
    appleBottom >= trunkTopLocalY - yPadding
  );
  }

  function isMainGameTutorialInProgress() {
  if (d.isWorldDocumentEntry()) return false;
  return !d.getStoredFlag(d.onboardingFlowDoneKey);
  }

  function isNearWellForCard() {
  const wellSize = d.getWellSize();

  return d.getCenterDistance(d.getWorldItems().wellX, d.getWorldItems().wellY, wellSize.width, wellSize.height) < d.wellCardDistance;
  }

  function isSharedWorldMergeActive() {
  return d.isWorldServerSyncAvailable() && d.hasHydratedSharedWorldFromServer;
  }

  function isWorldRockPickupUnlocked() {
  if (!d.isWorldDocumentEntry()) return false;
  return d.getPlantFogWorldStageFromScore(d.getTotalPlantIndexScore()) >= 2;
  }

  function isWorldServerSyncAvailable() {
  return Boolean(
    window.OVCOnline &&
    typeof window.OVCOnline.saveWorldState === "function" &&
    typeof window.OVCOnline.loadWorldState === "function" &&
    window.OVCOnline.isConfigured &&
    window.OVCOnline.isConfigured()
  );
  }

  function markWorldDirty() {
  if (d.isApplyingWorldState) return;
  d.isWorldDirty = true;
  }

  function pickRandomWorldRockSpawnPosition(size, ctx, existingRocks) {
  const rockSize = Number(size) || d.WORLD_ROCK_SIZE;
  const margin = d.WORLD_ROCK_SPAWN_X_MARGIN;
  const yMin = d.WORLD_ROCK_SPAWN_Y_MIN;
  const yTopMax = d.WORLD_ROCK_SPAWN_Y_MAX;
  const xSpan = Math.max(1, d.WORLD_WIDTH - 2 * margin - rockSize + 1);
  const ySpan = Math.max(1, yTopMax - yMin + 1);
  const avoidZones = d.collectWorldRockAvoidZones(ctx || d.buildWorldRockSpawnContext());
  const list = Array.isArray(existingRocks) ? existingRocks : [];
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const x = margin + Math.floor(Math.random() * xSpan);
    const y = yMin + Math.floor(Math.random() * ySpan);
    const rockR = d.worldRockRect(x, y, rockSize);
    const clashRock = list.some(function (other) {
      if (!other) return false;
      return Math.abs(Number(other.x) - x) < 10 && Math.abs(Number(other.y) - y) < 10;
    });
    if (clashRock || d.worldRockOverlapsAnyAvoidRect(rockR, avoidZones)) continue;
    return { x: x, y: y };
  }
  return null;
  }

  function refillWellIfNeeded() {
  const now = Date.now();
  const elapsedRefills = Math.floor((now - d.getWell().lastRefillAt) / d.wellRefillMs);

  if (elapsedRefills > 0) {
    const previousWater = d.getWell().water;
    d.getWell().water = Math.min(d.maxWellWater, d.getWell().water + elapsedRefills);
    // Advance the refill anchor deterministically so every client computes the
    // same getWell().water from the same lastRefillAt. Using "now" here would
    // diverge across clients (clock skew) and the resulting saves would
    // flip-flop the visible water amount as snapshots overwrote each other.
    d.getWell().lastRefillAt += elapsedRefills * d.wellRefillMs;

    if (previousWater !== d.getWell().water) {
      // Auto-refill is deterministic from lastRefillAt, so we keep it local-only
      // to avoid spamming snapshots that race with player actions on other
      // clients. Persist only to localStorage so a tab reload sees the latest
      // computed value without forcing a multiplayer broadcast.
      d.saveWellStateToStorage({
        wellWaterKey: d.wellWaterKey,
        lastWellRefillKey: d.lastWellRefillKey,
        wellWater: d.getWell().water,
        lastWellRefillAt: d.getWell().lastRefillAt
      });
    }
  }

  d.updateWellImage();
  d.updateWellCard();
  }

  function removeExpiredWorldBagDrops(now) {
  d.ensureWorldBagDropsArray();
  if (!d.getApple().worldBagDrops.length) return false;
  const t = now != null ? now : d.getSynchronizedNow();
  let removed = false;
  const kept = [];
  d.getApple().worldBagDrops.forEach(function (drop) {
    if (!drop || d.isWorldBagDropExpired(drop, t)) {
      if (drop) {
        d.teardownWorldBagDropDom(drop);
        removed = true;
      }
    } else {
      kept.push(drop);
    }
  });
  if (!removed) return false;
  d.getApple().worldBagDrops = kept;
  d.lastWorldBagDropChangeAt = t;
  d.getApple().lastStateChangeAt = Math.max(d.getApple().lastStateChangeAt, t);
  d.updateWorldBagDropDom();
  d.markWorldDirty();
  d.syncWorldState(true);
  return true;
  }

  function respawnApplesIfNeeded() {
  const now = Date.now();
  Object.keys(d.localApplePickedAtById).forEach(function (appleId) {
    const pickedAt = Number(d.localApplePickedAtById[appleId] || 0);
    if (!pickedAt || now - pickedAt > d.appleRespawnMs * 2) {
      delete d.localApplePickedAtById[appleId];
    }
  });
  const availableIds = d.getApple().apples
    .filter(function (apple) {
      return d.getApple().pickedIds.includes(apple.id);
    })
    .map(function (apple) {
      return apple.id;
    });

  if (availableIds.length === 0) {
    d.getApple().lastSpawnAt = now;
    return;
  }

  const elapsedSpawns = Math.floor((now - d.getApple().lastSpawnAt) / d.appleRespawnMs);
  if (elapsedSpawns <= 0) return;

  const spawnCount = Math.min(elapsedSpawns, availableIds.length);
  for (let index = 0; index < spawnCount; index += 1) {
    const id = availableIds[index];
    const appleIndex = d.getApple().apples.findIndex(function (apple) {
      return apple.id === id;
    });
    d.getApple().apples[appleIndex] = d.createRandomApple(id);
    d.getApple().pickedIds = d.getApple().pickedIds.filter(function (pickedId) {
      return pickedId !== id;
    });
  }

  d.getApple().lastSpawnAt += spawnCount * d.appleRespawnMs;
  d.saveAppleState();
  }

  function saveAppleState() {
  d.getApple().lastStateChangeAt = Date.now();
  d.ensureWorldLooseSeedShape();
  d.saveAppleStateToStorage({
    appleStateKey: d.appleStateKey,
    appleCount: d.getApple().count,
    seedCount: d.getApple().seedCount,
    overgrowthSeedCount: d.getApple().overgrowthSeedCount,
    apples: d.getApple().apples,
    pickedAppleIds: d.getApple().pickedIds,
    nextAppleSeedOffset: d.getApple().nextSeedOffset,
    lastAppleSpawnAt: d.getApple().lastSpawnAt,
    extraSeeds: d.getApple().extraSeeds,
    extraPlants: d.getApple().extraPlants,
    worldLooseSeed: d.getApple().worldLooseSeed,
    worldRocks: d.getApple().worldRocks,
    worldRockPickedIds: d.getApple().worldRockPickedIds,
    worldExtraBuckets: (d.getApple().worldExtraBuckets || []).map(function (bucket) {
      return {
        id: String(bucket.id || ""),
        x: Number(bucket.x) || 0,
        y: Number(bucket.y) || 0,
        isFull: Boolean(bucket.isFull)
      };
    }),
    placedCraftFurniture: d.serializePlacedCraftFurnitureForSnapshot(d.placedCraftFurniture)
  });
  d.markWorldDirty();
  }

  function setWorldPosition(element, x, y) {
  d.setWorldPositionUtil(
    element,
    x,
    y,
    d.ground,
    d.WORLD_WIDTH,
    d.GROUND_WORLD_HEIGHT
  );
  }

  function setWorldSize(element, width, height) {
  d.setWorldSizeUtil(
    element,
    width,
    height,
    d.ground,
    d.WORLD_WIDTH,
    d.GROUND_WORLD_HEIGHT
  );
  }

  function syncWorldState(forceSave, options) {
  return d._networkApi.syncWorldState(forceSave, options);
  }

  function teardownWorldBagDropDom(drop) {
  if (drop && drop._el) {
    drop._el.remove();
    drop._el = null;
  }
  }

  function tickWorldBagDropDespawn(now) {
  if (!d.isWorldDocumentEntry()) return;
  d.ensureWorldBagDropsArray();
  if (!d.getApple().worldBagDrops.length) return;
  const t = now != null ? now : Date.now();
  if (
    d.lastWorldBagDropDespawnAt > 0 &&
    t - d.lastWorldBagDropDespawnAt < d.WORLD_BAG_DROP_DESPAWN_TICK_MS
  ) {
    return;
  }
  d.lastWorldBagDropDespawnAt = t;
  d.removeExpiredWorldBagDrops(d.getSynchronizedNow());
  }

  function tickWorldRockRespawn(now) {
  if (!d.isWorldDocumentEntry() || !d.isWorldRockPickupUnlocked()) return;
  const t = now != null ? now : Date.now();
  const lastPickupAt = Number(d.getSeedWorld().lastWorldRockPickupAt || 0);
  if (lastPickupAt > 0 && t - lastPickupAt < d.WORLD_ROCK_RESPAWN_INTERVAL_MS) {
    return;
  }
  if (d.getSeedWorld().lastWorldRockRespawnAt <= 0) {
    d.getSeedWorld().lastWorldRockRespawnAt = t;
    return;
  }
  if (t - d.getSeedWorld().lastWorldRockRespawnAt < d.WORLD_ROCK_RESPAWN_INTERVAL_MS) return;
  d.getSeedWorld().lastWorldRockRespawnAt = t;
  d.tryRespawnOneWorldRockIfBelowCap();
  }

  function tryRespawnOneWorldRockIfBelowCap() {
  if (!d.isWorldDocumentEntry() || !d.isWorldRockPickupUnlocked()) return false;
  if (!Array.isArray(d.getApple().worldRocks)) d.getApple().worldRocks = [];
  if (!Array.isArray(d.getApple().worldRockPickedIds)) d.getApple().worldRockPickedIds = [];
  if (d.getUnpickedWorldRockCount() >= d.WORLD_LOOSE_ROCK_COUNT) return false;

  const size = d.WORLD_ROCK_SIZE;
  const pos = d.pickRandomWorldRockSpawnPosition(size, d.buildWorldRockSpawnContext(), d.getApple().worldRocks);
  if (!pos) return false;

  const pickedSet = new Set(d.getApple().worldRockPickedIds.map(String));
  let rock = d.getApple().worldRocks.find(function (r) {
    return r && pickedSet.has(String(r.id));
  });

  if (!rock) {
    if (d.getApple().worldRocks.length >= d.WORLD_LOOSE_ROCK_COUNT) return false;
    rock = {
      id: "ground-rock-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
      x: pos.x,
      y: pos.y,
      size: size
    };
    d.getApple().worldRocks.push(rock);
  }

  rock.x = pos.x;
  rock.y = pos.y;
  rock.size = size;
  d.getApple().worldRockPickedIds = d.getApple().worldRockPickedIds.filter(function (id) {
    return String(id) !== String(rock.id);
  });

  if (!rock._el && d.ground) {
    const insertBeforeEl =
      d.localPlayerRoot && d.localPlayerRoot.parentNode === d.ground
        ? d.localPlayerRoot
        : d.player && d.player.parentNode === d.ground
          ? d.player
          : null;
    const el = document.createElement("div");
    el.className = "world-ground-rock";
    el.dataset.rockId = rock.id;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      d.ground.insertBefore(el, insertBeforeEl);
    } else {
      d.ground.appendChild(el);
    }
    rock._el = el;
  }

  d.updateWorldRocks();
  d.saveAppleState();
  d.markWorldDirty();
  return true;
  }

  function updateWellCard() {
  const isVisible = d.isNearWellForCard();
  const waterRatio = d.getWell().water / d.maxWellWater;
  const wellImage = d.getWell().water > 0 ? d.IMG_WELL : d.IMG_WELL_EMPTY;

  d.wellCard.style.display = isVisible ? "flex" : "none";
  if (wellImage && d.wellCardImage) {
    d.wellCardImage.src = wellImage;
  }
  d.wellWaterText.textContent = d.getWell().water + "/" + d.maxWellWater;
  d.wellWaterFill.style.width = waterRatio * 100 + "%";
  }

  function updateWellImage() {
  if (!d.well) return;
  const src = d.getWell().water > 0 ? d.IMG_WELL : d.IMG_WELL_EMPTY;
  if (src) {
    d.well.src = src;
  }
  }

  function updateWorldBagDropDom(forceRebuild) {
  if (!d.ground) return;
  d.ensureWorldBagDropsArray();
  const stackIndexById = Object.create(null);
  const stacks = Object.create(null);
  d.sortWorldBagDropsForRender(d.getApple().worldBagDrops).forEach(function (drop) {
    const key = drop.stackKey || d.getBagDropStackKey(drop.x, drop.y);
    const idx = stacks[key] || 0;
    stacks[key] = idx + 1;
    stackIndexById[String(drop.id)] = idx;
  });

  d.getApple().worldBagDrops = d.getApple().worldBagDrops.filter(function (drop) {
    return drop && d.canDiscardBagItemKey(drop.itemKey);
  });

  d.getApple().worldBagDrops.forEach(function (drop) {
    const stackIndex = stackIndexById[String(drop.id)] || 0;
    if (!drop._el || forceRebuild || !document.contains(drop._el)) {
      d.teardownWorldBagDropDom(drop);
      const el = d.buildWorldBagDropElement(drop, stackIndex);
      if (!el) return;
      d.ground.appendChild(el);
      drop._el = el;
    } else {
      drop._el.style.zIndex = String(d.getWorldBagDropZIndex(drop, stackIndex));
      const countEl = drop._el.querySelector(".world-bag-drop__count");
      const count = Math.max(1, Math.floor(Number(drop.count) || 0));
      if (count > 1) {
        if (countEl) {
          countEl.textContent = d.formatWorldBagDropCountLabel(count);
        } else {
          const inner = drop._el.querySelector(".world-bag-drop__inner");
          if (inner) {
            const next = document.createElement("span");
            next.className = "world-bag-drop__count";
            next.textContent = d.formatWorldBagDropCountLabel(count);
            inner.appendChild(next);
          }
        }
      } else if (countEl) {
        countEl.remove();
      }
    }
    d.setWorldSize(drop._el, d.BAG_DROP_WORLD_SIZE, d.BAG_DROP_WORLD_SIZE);
    d.setWorldPosition(drop._el, Number(drop.x) || 0, Number(drop.y) || 0);
  });
  }

  function updateWorldRocks() {
  const tutorialRockDom =
    d.isMainGameTutorialInProgress() &&
    Array.isArray(d.getApple().worldRocks) &&
    d.getApple().worldRocks.some(function (rock) {
      return rock && String(rock.id) === d.TUTORIAL_ONBOARDING_ROCK_ID && rock._el;
    });
  if ((!d.isWorldDocumentEntry() && !tutorialRockDom) || !Array.isArray(d.getApple().worldRocks)) return;
  d.getApple().worldRocks.forEach(function (rock) {
    if (!rock._el) return;
    const picked = d.getApple().worldRockPickedIds.includes(rock.id);
    rock._el.style.display = picked ? "none" : "block";
    if (!picked) {
      const sz = Number(rock.size) || d.WORLD_ROCK_SIZE;
      d.setWorldSize(rock._el, sz, sz);
      d.setWorldPosition(rock._el, rock.x, rock.y);
    }
  });
  }

  function ensureRockMineGaugeEl(rock) {
    if (!rock || !rock._el) return null;
    if (rock._mineGaugeEl && rock._mineGaugeEl.isConnected) return rock._mineGaugeEl;
    const gauge = document.createElement("div");
    gauge.className = "world-rock-mine-gauge";
    gauge.setAttribute("aria-hidden", "true");
    const track = document.createElement("div");
    track.className = "world-rock-mine-gauge__track";
    const fill = document.createElement("div");
    fill.className = "world-rock-mine-gauge__fill";
    track.appendChild(fill);
    gauge.appendChild(track);
    rock._el.appendChild(gauge);
    rock._mineGaugeEl = gauge;
    rock._mineGaugeFillEl = fill;
    return gauge;
  }

  function collectRockMiningSessionsByRock(now) {
    const byRock = Object.create(null);
    const durationMs = Math.max(1, Number(d.WORLD_ROCK_MINE_MS) || 60000);
    const local = d.getLocalRockMining && d.getLocalRockMining();
    if (local && local.rockId && local.startedAt) {
      const elapsed = now - local.startedAt;
      if (elapsed < durationMs) {
        byRock[String(local.rockId)] = { startedAt: local.startedAt, durationMs: durationMs };
      }
    }
    const remotePlayers = d.remotePlayers || {};
    Object.keys(remotePlayers).forEach(function (remoteId) {
      const rp = remotePlayers[remoteId];
      if (!rp) return;
      const rockId = String(rp.rockMiningRockId || "");
      const startedAt = Number(rp.rockMiningStartedAt) || 0;
      if (!rockId || !startedAt) return;
      if (now - startedAt >= durationMs) return;
      const prev = byRock[rockId];
      if (!prev || startedAt < prev.startedAt) {
        byRock[rockId] = { startedAt: startedAt, durationMs: durationMs };
      }
    });
    return byRock;
  }

  function updateWorldRockMineGauges() {
    const tutorialRockDom =
      d.isMainGameTutorialInProgress() &&
      Array.isArray(d.getApple().worldRocks) &&
      d.getApple().worldRocks.some(function (rock) {
        return rock && String(rock.id) === d.TUTORIAL_ONBOARDING_ROCK_ID && rock._el;
      });
    if ((!d.isWorldDocumentEntry() && !tutorialRockDom) || !Array.isArray(d.getApple().worldRocks)) return;
    const now = Date.now();
    const sessionsByRock = collectRockMiningSessionsByRock(now);
    d.getApple().worldRocks.forEach(function (rock) {
      if (!rock || !rock._el) return;
      const rockId = String(rock.id);
      const picked = d.getApple().worldRockPickedIds.includes(rock.id);
      if (picked) {
        if (rock._mineGaugeEl) rock._mineGaugeEl.style.display = "none";
        return;
      }
      const session = sessionsByRock[rockId];
      if (!session) {
        if (rock._mineGaugeEl) rock._mineGaugeEl.style.display = "none";
        return;
      }
      const gauge = ensureRockMineGaugeEl(rock);
      const fill =
        (rock._mineGaugeFillEl && rock._mineGaugeFillEl.isConnected
          ? rock._mineGaugeFillEl
          : gauge
            ? gauge.querySelector(".world-rock-mine-gauge__fill")
            : null);
      if (!gauge || !fill) return;
      rock._mineGaugeFillEl = fill;
      gauge.style.display = "block";
      const progress = Math.max(
        0,
        Math.min(1, (now - session.startedAt) / session.durationMs)
      );
      fill.style.width = "100%";
      fill.style.transform = "scaleX(" + progress + ")";
      fill.style.transformOrigin = "left center";
    });
  }

  function worldRockOverlapsAnyAvoidRect(rockRect, zones) {
  for (let i = 0; i < zones.length; i += 1) {
    if (d.isOverlappingRect(rockRect, zones[i])) {
      return true;
    }
  }
  return false;
  }

  function worldRockRect(x, y, size) {
  return { left: x, top: y, right: x + size, bottom: y + size };
  }

  return {
    addPlantWorldRockAvoidZone,
    buildWorldBagDropElement,
    buildWorldRockSpawnContext,
    collectWorldRockAvoidZones,
    createRandomApple,
    ensureWorldBagDropsArray,
    ensureWorldLooseSeedShape,
    expandWorldRockAvoidRect,
    getBucketSize,
    getCenterDistance,
    getLocalPlayerBodyHeight,
    getLocalPlayerBodyWidth,
    getPlantIndexScoringOptions,
    getPlantMaturityLevelForPlantingSpacing,
    getPlayerBox,
    getSharedPlantSimulationNow,
    getSproutStageFromPlant,
    getSynchronizedNow,
    getTotalPlantIndexScore,
    getUnpickedWorldRockCount,
    getWellSize,
    isAppleInTrunkArea,
    isMainGameTutorialInProgress,
    isNearWellForCard,
    isSharedWorldMergeActive,
    isWorldRockPickupUnlocked,
    isWorldServerSyncAvailable,
    markWorldDirty,
    pickRandomWorldRockSpawnPosition,
    refillWellIfNeeded,
    removeExpiredWorldBagDrops,
    respawnApplesIfNeeded,
    saveAppleState,
    setWorldPosition,
    setWorldSize,
    syncWorldState,
    teardownWorldBagDropDom,
    tickWorldBagDropDespawn,
    tickWorldRockRespawn,
    tryRespawnOneWorldRockIfBelowCap,
    updateWellCard,
    updateWellImage,
    updateWorldBagDropDom,
    updateWorldRockMineGauges,
    updateWorldRocks,
    worldRockOverlapsAnyAvoidRect,
    worldRockRect,
  };
}
