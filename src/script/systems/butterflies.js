/** Systems — 나비 시뮬레이션. */
export function createModule(d) {
  function applyButterflyCatchable(entry, catchable) {
  if (entry.catchable === catchable) return;
  entry.element.classList.toggle("is-catchable", catchable);
  entry.catchable = catchable;
  }

  function applyButterflyFacing(entry, facingRight) {
  if (entry.facingRight === facingRight) return;
  entry.element.classList.toggle("is-facing-right", facingRight);
  entry.facingRight = facingRight;
  }

  function applyButterflySpriteFrame(entry, color, frame) {
  if (entry.color === color && entry.frame === frame) return;
  const colorIndex = Math.max(0, d.butterflyColors.indexOf(color));
  // Sprite sheet uses 5 cols (frame) and 3 rows (color).
  // background-position needs each cell offset; with background-size 500% 300%
  // each unit is 100% / (cols-1) horizontally and 100% / (rows-1) vertically.
  const xPercent = (frame / (d.butterflyFrameCount - 1)) * 100;
  const yPercent = (colorIndex / (d.butterflyColors.length - 1)) * 100;
  entry.sprite.style.backgroundPosition = xPercent + "% " + yPercent + "%";
  entry.color = color;
  entry.frame = frame;
  }

  function areButterfliesUnlockedForPlantFogWorld() {
  if (d.areButterfliesUnlockedForTutorialOnboarding()) return true;
  return d.isWorldDocumentEntry() && d.getTotalPlantIndexScore() >= d.PLANT_FOG_BUTTERFLY_MIN_SCORE;
  }

  function areButterfliesUnlockedForTutorialOnboarding() {
  return (
    d.isMainGameTutorialInProgress() &&
    d.getOnboarding().flowStep === d.ONBOARDING_STEP_BUTTERFLY
  );
  }

  function authorityFillToCapInstantly(now) {
  let added = false;
  while (d.butterflyState.list.length < d.butterflyMaxAlive) {
    const created = d.createButterfly(now);
    if (!created) break;
    d.butterflyState.list.push(created);
    added = true;
  }
  if (added) {
    d.butterflyState.lastSpawnAt = now;
    d.spreadButterfliesWithinActiveBounds();
  }
  return added;
  }

  function authoritySpawnButterfliesIfNeeded(now) {
  if (d.butterflyState.list.length >= d.butterflyMaxAlive) return false;
  if (d.butterflyState.list.length === 0) {
    return d.authorityFillToCapInstantly(now);
  }
  if (!d.butterflyState.lastSpawnAt) {
    if (d.hasSeededInitialButterflies) {
      d.butterflyState.lastSpawnAt = now;
      return false;
    }
    return d.authorityFillToCapInstantly(now);
  }
  const elapsedCycles = Math.floor(
    (now - d.butterflyState.lastSpawnAt) / d.butterflyRespawnMs
  );
  if (elapsedCycles <= 0) return false;

  const slotsAvailable = d.butterflyMaxAlive - d.butterflyState.list.length;
  const toSpawn = Math.min(elapsedCycles, slotsAvailable);
  for (let i = 0; i < toSpawn; i += 1) {
    const created = d.createButterfly(now);
    if (!created) break;
    d.butterflyState.list.push(created);
  }
  // Advance lastSpawnAt by the consumed cycles so leftover time carries over
  // toward the next spawn instead of being lost.
  d.butterflyState.lastSpawnAt += toSpawn * d.butterflyRespawnMs;
  return toSpawn > 0;
  }

  function broadcastButterflyState(now) {
  if (!d.multiplayerChannel || !d.currentSessionId) return;
  d.lastButterflyBroadcastAt = now;
  d.multiplayerRoomSessionButterflyStateLastSeen[d.currentSessionId] = now;
  d.lastButterflyStateChangeAt = now;
  d.markWorldDirty();
  Promise.resolve(d.multiplayerChannel.send({
    type: "broadcast",
    event: "butterfly_state",
    payload: {
      id: d.currentSessionId,
      sentAt: now,
      butterflies: d.getButterflyStateForSnapshot()
    }
  })).catch(function () {
    // World sync remains the fallback when realtime misses an update.
  });
  }

  function isLegacyCornerButterflyCoord(x, y, bounds) {
  const nx = Number(x);
  const ny = Number(y);
  if (!Number.isFinite(nx) || !Number.isFinite(ny)) return true;
  if (nx === 0 && ny === 0) return true;
  if (nx <= bounds.left + 4 && ny <= bounds.top + 4) return true;
  const legacyTop = Math.max(bounds.top, d.butterflyBoundsTop) + 36;
  if (nx <= d.butterflyBoundsLeft + 4 && ny <= legacyTop) return true;
  return false;
  }

  function isUnsetButterflyCoord(x, y, bounds) {
  return isLegacyCornerButterflyCoord(x, y, bounds);
  }

  function shouldRelocateButterfliesInBounds() {
  if (!d.butterflyState.list.length) return false;
  if (d.areButterfliesClusteredInActiveBounds()) return true;
  const bounds = d.getActiveButterflyBounds();
  return d.butterflyState.list.some(function (butterfly) {
    if (!butterfly) return false;
    return d.isLegacyCornerButterflyCoord(butterfly.x, butterfly.y, bounds);
  });
  }

  function areButterfliesClusteredInActiveBounds() {
  const list = d.butterflyState.list;
  if (!list.length) return false;
  const bounds = d.getActiveButterflyBounds();
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let validCount = 0;
  let cornerPinned = 0;
  list.forEach(function (butterfly) {
    if (!butterfly) return;
    const x = Number(butterfly.x);
    const y = Number(butterfly.y);
    if (d.isUnsetButterflyCoord(x, y, bounds)) return;
    validCount += 1;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if (x <= bounds.left + 3 && y <= bounds.top + 3) cornerPinned += 1;
  });
  if (!validCount || validCount < list.length) return true;
  if (cornerPinned === validCount) return true;
  if (validCount >= 2 && maxX - minX < 48 && maxY - minY < 48) return true;
  return false;
  }

  function clampButterflyPointToActiveBounds(x, y) {
  const bounds = d.getActiveButterflyBounds();
  if (d.isUnsetButterflyCoord(x, y, bounds)) {
    return d.butterflyMotion.pickSpawnPoint();
  }
  return {
    x: Math.max(bounds.left, Math.min(bounds.right, Number(x))),
    y: Math.max(bounds.top, Math.min(bounds.bottom, Number(y)))
  };
  }

  function clearLiveButterfliesForPlantFogLock(now) {
  if (!d.butterflyState.list.length) return false;
  d.butterflyState.list.forEach(function (b) {
    if (b && b.id != null) d.removeButterflyRenderEntry(b.id);
  });
  d.butterflyState.list = [];
  d.butterflyState.lastSpawnAt = 0;
  d.hasSeededInitialButterflies = false;
  Object.keys(d.butterflyAuthorityWaypointById).forEach(function (wid) {
    delete d.butterflyAuthorityWaypointById[wid];
  });
  d.lastButterflyStateChangeAt = Date.now();
  d.markWorldDirty();
  const ts = now != null ? now : Date.now();
  if (d.isButterflyAuthority() && d.multiplayerChannel && d.currentSessionId) {
    d.broadcastButterflyState(ts);
  }
  return true;
  }

  function createButterfly(now, options) {
  const butterfly = d.butterflyMotion.create(now, options);
  resetButterflyPathFields(butterfly, butterfly.x, butterfly.y);
  return butterfly;
  }

  function ensureButterflyRenderEntry(butterfly) {
  let entry = d.butterflyRenderById[butterfly.id];
  if (entry && entry.element && entry.element.isConnected) return entry;
  if (entry && entry.element && entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
  const element = document.createElement("div");
  element.className = "butterfly";
  element.dataset.butterflyId = butterfly.id;
  const sprite = document.createElement("div");
  sprite.className = "butterfly-sprite";
  element.appendChild(sprite);
  d.ground.appendChild(element);
  d.setWorldSize(element, d.BUTTERFLY_SIZE, d.BUTTERFLY_SIZE);
  d.setInstantHoverTip(element, null);
  entry = {
    element,
    sprite,
    color: null,
    frame: -1,
    facingRight: null,
    catchable: null,
    lastMotionX: null,
    facingMomentumX: 0
  };
  d.butterflyRenderById[butterfly.id] = entry;
  return entry;
  }

  function getActiveButterflyBounds() {
  const base = d.getDefaultButterflyBounds();
  if (!d.isWorldDocumentEntry()) return base;
  const stage = d.getPlantFogWorldStageFromScore(d.getTotalPlantIndexScore());
  if (stage < 3 || stage >= 5) return base;
  const clearRect = d.getPlantFogClearRectWorldPx(stage);
  const pad = Math.max(8, Math.ceil(d.BUTTERFLY_SIZE * 0.75));
  const bounds = {
    left: clearRect.left + pad,
    right: clearRect.right - pad,
    top: clearRect.top + pad,
    bottom: clearRect.bottom - pad
  };
  if (bounds.right <= bounds.left || bounds.bottom <= bounds.top) return base;
  return bounds;
  }

  function resetButterflyPathFields(butterfly, x, y) {
  if (!butterfly) return;
  butterfly.x = x;
  butterfly.y = y;
  butterfly.lastPathX = x;
  butterfly.lastPathY = y;
  butterfly._renderX = x;
  butterfly._renderY = y;
  }

  function ensureButterflyReadyForSimulation(butterfly, bounds) {
  if (!butterfly) return false;
  const flyBounds = bounds || d.getActiveButterflyBounds();
  let changed = false;
  const x = Number(butterfly.x);
  const y = Number(butterfly.y);
  const lastPathX = Number(butterfly.lastPathX);
  const lastPathY = Number(butterfly.lastPathY);
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    isUnsetButterflyCoord(x, y, flyBounds)
  ) {
    const spawn = d.butterflyMotion.pickSpawnPoint();
    resetButterflyPathFields(butterfly, spawn.x, spawn.y);
    delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
    return true;
  }
  if (!Number.isFinite(lastPathX) || !Number.isFinite(lastPathY)) {
    resetButterflyPathFields(butterfly, x, y);
    delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
    changed = true;
  }
  return changed;
  }

  function repairButterflyMotionFromNetwork(butterfly, raw, bounds) {
  if (!butterfly) return false;
  const flyBounds = bounds || d.getActiveButterflyBounds();
  let changed = false;
  if (
    !Number.isFinite(Number(butterfly.x)) ||
    !Number.isFinite(Number(butterfly.y)) ||
    isUnsetButterflyCoord(butterfly.x, butterfly.y, flyBounds)
  ) {
    const nextPoint = raw
      ? clampButterflyPointToActiveBounds(raw.x, raw.y)
      : d.butterflyMotion.pickSpawnPoint();
    resetButterflyPathFields(butterfly, nextPoint.x, nextPoint.y);
    delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
    return true;
  }
  if (
    !Number.isFinite(Number(butterfly.lastPathX)) ||
    !Number.isFinite(Number(butterfly.lastPathY))
  ) {
    resetButterflyPathFields(butterfly, butterfly.x, butterfly.y);
    delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
    changed = true;
  }
  return changed;
  }

  function spreadButterfliesWithinActiveBounds() {
  if (!d.shouldRelocateButterfliesInBounds()) return false;
  const list = d.butterflyState.list;
  if (!list.length) return false;
  const bounds = d.getActiveButterflyBounds();
  const width = Math.max(1, bounds.right - bounds.left);
  const height = Math.max(1, bounds.bottom - bounds.top);
  const count = list.length;
  const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
  const rows = Math.max(1, Math.ceil(count / cols));
  let changed = false;
  list.forEach(function (butterfly, index) {
    if (!butterfly) return;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    const x = bounds.left + cellW * (col + 0.15 + Math.random() * 0.7);
    const y = bounds.top + cellH * (row + 0.15 + Math.random() * 0.7);
    resetButterflyPathFields(butterfly, x, y);
    delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
    changed = true;
  });
  return changed;
  }

  function getButterflyAnimationFrame(now, butterfly) {
  // Phase the animation by id length so the swarm doesn't beat in sync.
  const offset = butterfly.id.length * 53;
  return Math.floor((now + offset) / d.butterflyFrameMs) % d.butterflyFrameCount;
  }

  function getButterflyCatchDistanceAtWorldCenter(cx, cy) {
  return d.getCenterDistance(
    cx - d.BUTTERFLY_SIZE / 2,
    cy - d.BUTTERFLY_SIZE / 2,
    d.BUTTERFLY_SIZE,
    d.BUTTERFLY_SIZE
  );
  }

  function getButterflyStateForSnapshot() {
  d.keepButterfliesInsideActiveBounds();
  const before = d.butterflyState.list;
  const snapshot = d.butterflyMotion.snapshotFromState(d.butterflyState);
  if (before !== d.butterflyState.list) {
    d.pruneButterflyAuthorityWaypointsToList();
  }
  return snapshot;
  }

  function getCenterDistance(x, y, width, height) {
  return d.getCenterDistanceUtil(d.getPlayerBox(), x, y, width, height);
  }

  function getDefaultButterflyBounds() {
  return {
    left: d.butterflyBoundsLeft,
    right: d.butterflyBoundsRight,
    top: d.butterflyBoundsTop,
    bottom: d.butterflyBoundsBottom
  };
  }

  function getLocalPlayerBodyHeight() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_HEIGHT : d.PLAYER_HEIGHT;
  }

  function getLocalPlayerBodyWidth() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_WIDTH : d.PLAYER_WIDTH;
  }

  function getNumericButterflyValue(value, fallback) {
  return d.getNumericButterflyValueCore(value, fallback);
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

  function hasFreshButterflyAuthorityBroadcast(now) {
  const freshMs = Math.max(400, d.butterflyBroadcastMs * 6);
  let found = false;
  Object.keys(d.multiplayerRoomSessionButterflyStateLastSeen).forEach(function (sid) {
    const at = Number(d.multiplayerRoomSessionButterflyStateLastSeen[sid]) || 0;
    if (at && now - at <= freshMs) found = true;
  });
  return found;
  }

  function isButterflyAuthority() {
  if (!d.currentSessionId) {
    return !d.isWorldServerSyncAvailable();
  }
  if (document.hidden) return false;
  const now = Date.now();
  const stateFreshMs = Math.max(900, d.butterflyBroadcastMs * 16);
  d.pruneStaleMultiplayerRoomSessions(now);
  const ids = [d.currentSessionId];
  Object.keys(d.remotePlayerStateStore.sessionIdsLastSeen).forEach(function (sid) {
    if (d.remotePlayerStateStore.sessionButterflyActive[sid] === false) return;
    const stateSeenAt = Number(d.multiplayerRoomSessionButterflyStateLastSeen[sid]) || 0;
    const presenceSeenAt = Number(d.remotePlayerStateStore.sessionIdsLastSeen[sid]) || 0;
    if (stateSeenAt) {
      if (now - stateSeenAt > stateFreshMs) return;
    } else if (!presenceSeenAt || now - presenceSeenAt > stateFreshMs) {
      return;
    }
    if (sid !== d.currentSessionId) ids.push(sid);
  });
  if (ids.length === 1) return true;
  ids.sort();
  return ids[0] === d.currentSessionId;
  }

  function isMainGameTutorialInProgress() {
  if (d.isWorldDocumentEntry()) return false;
  return !d.getStoredFlag(d.onboardingFlowDoneKey);
  }

  function isSharedWorldMergeActive() {
  return d.isWorldServerSyncAvailable() && d.hasHydratedSharedWorldFromServer;
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

  function keepButterfliesInsideActiveBounds() {
  let changed = false;
  const bounds = d.getActiveButterflyBounds();
  d.butterflyState.list.forEach(function (butterfly) {
    if (!butterfly) return;
    const beforeX = Number(butterfly.x);
    const beforeY = Number(butterfly.y);
    const next = d.isUnsetButterflyCoord(butterfly.x, butterfly.y, bounds)
      ? d.butterflyMotion.pickSpawnPoint()
      : d.clampButterflyPointToActiveBounds(butterfly.x, butterfly.y);
    butterfly.x = next.x;
    butterfly.y = next.y;
    if (
      !Number.isFinite(beforeX) ||
      !Number.isFinite(beforeY) ||
      Math.abs(beforeX - next.x) > 0.001 ||
      Math.abs(beforeY - next.y) > 0.001
    ) {
      delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
      resetButterflyPathFields(butterfly, next.x, next.y);
      changed = true;
    }
  });
  return changed;
  }

  function markWorldDirty() {
  if (d.isApplyingWorldState) return;
  d.isWorldDirty = true;
  }

  function pruneButterflyAuthorityWaypointsToList() {
  d.butterflyMotion.pruneWaypoints(d.butterflyState.list, d.butterflyAuthorityWaypointById);
  }

  function pruneStaleMultiplayerRoomSessions(now) {
  const staleMs = 45000;
  Object.keys(d.remotePlayerStateStore.sessionIdsLastSeen).forEach(function (sid) {
    const seen = d.remotePlayerStateStore.sessionIdsLastSeen[sid];
    if (!seen || now - seen > staleMs) {
      delete d.remotePlayerStateStore.sessionIdsLastSeen[sid];
      delete d.remotePlayerStateStore.sessionButterflyActive[sid];
      delete d.multiplayerRoomSessionButterflyStateLastSeen[sid];
      delete d.lastRemoteWaterSplashAppliedAtBySession[sid];
    }
  });
  }

  function removeButterflyRenderEntry(id) {
  const entry = d.butterflyRenderById[id];
  if (entry && entry.element && entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
  delete d.butterflyRenderById[id];
  delete d.butterflyAuthorityWaypointById[id];
  }

  function setInstantHoverTip(el, text) {
  if (!el) return;
  if (text) {
    el.setAttribute("data-ovc-tip", text);
    el.setAttribute("aria-label", text);
  } else {
    el.removeAttribute("data-ovc-tip");
    el.removeAttribute("aria-label");
  }
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
    d.GROUND_WORLD_HEIGHT,
    d.MAP_VISUAL_SCALE
  );
  }

  function shouldRunButterflyMotionSimulation(now, onlineAvailable) {
  if (!onlineAvailable) return true;
  if (d.isButterflyAuthority()) return true;
  if (d.areButterfliesClusteredInActiveBounds()) return true;
  return !d.hasFreshButterflyAuthorityBroadcast(now);
  }

  function simulateButterflyAuthorityStep(butterfly, now) {
  d.butterflyMotion.simulate(butterfly, now, d.butterflyAuthorityWaypointById);
  }

  function updateButterflies() {
  const now = Date.now();
  const wallDelta =
    d.lastButterflyWallClockMs > 0 ? Math.min(60000, now - d.lastButterflyWallClockMs) : 0;
  d.lastButterflyWallClockMs = now;

  // Wait until either (a) we know there's no online sync available so this
  // client is definitely authoritative on its own world, or (b) we have
  // hydrated shared state from the server. This avoids one client racing to
  // seed butterflies while another is still loading the existing population.
  const onlineAvailable = d.isWorldServerSyncAvailable();
  const sharedHydrated = d.hasHydratedSharedWorldFromServer || !onlineAvailable;

  if (sharedHydrated && d.isButterflyAuthority()) {
    if (!d.areButterfliesUnlockedForPlantFogWorld()) {
      if (d.clearLiveButterfliesForPlantFogLock(now)) {
        d.lastButterflyStateChangeAt = now;
        d.markWorldDirty();
      }
    } else {
      if (d.keepButterfliesInsideActiveBounds()) {
        d.lastButterflyStateChangeAt = now;
        d.markWorldDirty();
      }
      if (
        d.butterflyState.list.length === 0 &&
        (!d.hasSeededInitialButterflies || !d.butterflyState.lastSpawnAt)
      ) {
        // First unlock or repopulate after the population was cleared while locked.
        d.authorityFillToCapInstantly(now);
        d.hasSeededInitialButterflies = true;
        d.lastButterflyStateChangeAt = now;
        d.markWorldDirty();
      } else if (d.authoritySpawnButterfliesIfNeeded(now)) {
        d.lastButterflyStateChangeAt = now;
        d.markWorldDirty();
      }
    }
  }
  // ???? ???? ?????? ????? ????????????????? sessionId)???????. ??????????
  // ??? ????????????? ????2?????????????????
  // Local flight sim — always run when butterflies exist on screen.
  if (d.butterflyState.list.length > 0) {
    const activeBounds = d.getActiveButterflyBounds();
    d.butterflyState.list.forEach(function (butterfly) {
      if (ensureButterflyReadyForSimulation(butterfly, activeBounds)) {
        d.lastButterflyStateChangeAt = now;
        d.markWorldDirty();
      }
    });
    if (d.spreadButterfliesWithinActiveBounds()) {
      d.lastButterflyStateChangeAt = now;
      d.markWorldDirty();
    }
    const motionStepCount =
      wallDelta > 48 ? Math.min(24, Math.max(1, Math.round(wallDelta / 16))) : 1;
    const motionStartNow = motionStepCount > 1 ? now - wallDelta : now;
    for (let motionStep = 0; motionStep < motionStepCount; motionStep += 1) {
      const stepNow =
        motionStepCount > 1
          ? Math.round(motionStartNow + (wallDelta * (motionStep + 1)) / motionStepCount)
          : now;
      d.butterflyState.list.forEach(function (butterfly) {
        if (!butterfly || butterfly.id == null) return;
        d.simulateButterflyAuthorityStep(butterfly, stepNow);
      });
    }
    if (
      onlineAvailable &&
      d.isButterflyAuthority() &&
      now - d.lastButterflyBroadcastAt >= d.butterflyBroadcastMs
    ) {
      d.broadcastButterflyState(now);
    }
  }

  if (wallDelta > 380) {
    Object.keys(d.butterflyAuthorityWaypointById).forEach(function (wid) {
      delete d.butterflyAuthorityWaypointById[wid];
    });
  }

  // Render from locally simulated butterfly.x/y.
  const aliveIds = {};
  let catchTarget = null;
  const renderBounds = d.getActiveButterflyBounds();
  d.butterflyState.list.forEach(function (butterfly) {
    if (!butterfly || butterfly.id == null) return;
    aliveIds[butterfly.id] = true;
    const entry = d.ensureButterflyRenderEntry(butterfly);
    const drawX = d.getNumericButterflyValue(butterfly.x, renderBounds.left);
    const drawY = d.getNumericButterflyValue(butterfly.y, renderBounds.top);
    butterfly.x = drawX;
    butterfly.y = drawY;
    butterfly._catchProbeCx = drawX;
    butterfly._catchProbeCy = drawY;
    const catchDist = d.getButterflyCatchDistanceAtWorldCenter(drawX, drawY);
    if (catchDist <= d.butterflyCatchDistance) {
      if (!catchTarget || catchDist < catchTarget.distance) {
        catchTarget = { butterfly: butterfly, distance: catchDist };
      }
    }
    const motionX = drawX;
    d.setWorldPosition(
      entry.element,
      drawX - d.BUTTERFLY_SIZE / 2,
      drawY - d.BUTTERFLY_SIZE / 2
    );
    d.applyButterflySpriteFrame(
      entry,
      butterfly.color,
      d.getButterflyAnimationFrame(now, butterfly)
    );
    const prevMotionX = Number(entry.lastMotionX);
    const hasPrevMotionX = Number.isFinite(prevMotionX);
    const drawDx = hasPrevMotionX ? motionX - prevMotionX : 0;
    let facingRight = entry.facingRight;
    if (facingRight == null) {
      facingRight = butterfly.dirX > 0;
      entry.facingMomentumX = 0;
    } else {
      // Two visible tabs can produce tiny back/forth network jitter.
      // Accumulate horizontal motion and flip only after clear directional intent.
      const clampedDx = Math.max(-0.35, Math.min(0.35, drawDx));
      const momentum = Number(entry.facingMomentumX) || 0;
      entry.facingMomentumX = Math.max(-1.4, Math.min(1.4, momentum * 0.84 + clampedDx));
      if (!facingRight && entry.facingMomentumX > 0.95) {
        facingRight = true;
        entry.facingMomentumX = 0;
      } else if (facingRight && entry.facingMomentumX < -0.95) {
        facingRight = false;
        entry.facingMomentumX = 0;
      }
    }
    d.applyButterflyFacing(entry, Boolean(facingRight));
    entry.lastMotionX = motionX;
    d.applyButterflyCatchable(
      entry,
      Boolean(catchTarget && catchTarget.butterfly.id === butterfly.id)
    );
  });
  Object.keys(d.butterflyRenderById).forEach(function (id) {
    if (!aliveIds[id]) d.removeButterflyRenderEntry(id);
  });
  }

  return {
    applyButterflyCatchable,
    applyButterflyFacing,
    applyButterflySpriteFrame,
    areButterfliesClusteredInActiveBounds,
    areButterfliesUnlockedForPlantFogWorld,
    areButterfliesUnlockedForTutorialOnboarding,
    authorityFillToCapInstantly,
    authoritySpawnButterfliesIfNeeded,
    broadcastButterflyState,
    clampButterflyPointToActiveBounds,
    clearLiveButterfliesForPlantFogLock,
    createButterfly,
    ensureButterflyReadyForSimulation,
    ensureButterflyRenderEntry,
    getActiveButterflyBounds,
    getButterflyAnimationFrame,
    getButterflyCatchDistanceAtWorldCenter,
    getButterflyStateForSnapshot,
    getCenterDistance,
    getDefaultButterflyBounds,
    getLocalPlayerBodyHeight,
    getLocalPlayerBodyWidth,
    getNumericButterflyValue,
    getPlantIndexScoringOptions,
    getPlayerBox,
    getSharedPlantSimulationNow,
    getSynchronizedNow,
    getTotalPlantIndexScore,
    hasFreshButterflyAuthorityBroadcast,
    isButterflyAuthority,
    isLegacyCornerButterflyCoord,
    isUnsetButterflyCoord,
    isMainGameTutorialInProgress,
    isSharedWorldMergeActive,
    isWorldServerSyncAvailable,
    keepButterfliesInsideActiveBounds,
    markWorldDirty,
    pruneButterflyAuthorityWaypointsToList,
    pruneStaleMultiplayerRoomSessions,
    removeButterflyRenderEntry,
    repairButterflyMotionFromNetwork,
    resetButterflyPathFields,
    setInstantHoverTip,
    setWorldPosition,
    setWorldSize,
    shouldRunButterflyMotionSimulation,
    shouldRelocateButterfliesInBounds,
    simulateButterflyAuthorityStep,
    spreadButterfliesWithinActiveBounds,
    updateButterflies,
  };
}
