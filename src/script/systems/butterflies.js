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
    d.butterflyState.list.push(d.createButterfly(now));
    added = true;
  }
  if (added) d.butterflyState.lastSpawnAt = now;
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
    d.butterflyState.list.push(d.createButterfly(now));
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

  function clampButterflyPointToActiveBounds(x, y) {
  const bounds = d.getActiveButterflyBounds();
  return {
    x: Math.max(bounds.left, Math.min(bounds.right, d.getNumericButterflyValue(x, bounds.left))),
    y: Math.max(bounds.top, Math.min(bounds.bottom, d.getNumericButterflyValue(y, bounds.top)))
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
  return d.butterflyMotion.create(now, options);
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
  const bounds = {
    left: Math.max(base.left, clearRect.left),
    right: Math.min(base.right, clearRect.right),
    top: Math.max(base.top, clearRect.top),
    bottom: Math.min(base.bottom, clearRect.bottom)
  };
  if (bounds.right < bounds.left || bounds.bottom < bounds.top) return base;
  return bounds;
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
  if (!d.currentSessionId) return false;
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
  d.butterflyState.list.forEach(function (butterfly) {
    if (!butterfly) return;
    const beforeX = Number(butterfly.x);
    const beforeY = Number(butterfly.y);
    const next = d.clampButterflyPointToActiveBounds(butterfly.x, butterfly.y);
    butterfly.x = next.x;
    butterfly.y = next.y;
    if (
      !Number.isFinite(beforeX) ||
      !Number.isFinite(beforeY) ||
      Math.abs(beforeX - next.x) > 0.001 ||
      Math.abs(beforeY - next.y) > 0.001
    ) {
      delete d.butterflyAuthorityWaypointById[String(butterfly.id || "")];
      butterfly._renderX = next.x;
      butterfly._renderY = next.y;
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
    d.GROUND_WORLD_HEIGHT
  );
  }

  function shouldRunButterflyMotionSimulation(now, onlineAvailable) {
  if (!onlineAvailable) return true;
  if (d.isButterflyAuthority()) return true;
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
  if (sharedHydrated && d.butterflyState.list.length > 0) {
    const runAuthorityButterflyMotion = d.shouldRunButterflyMotionSimulation(now, onlineAvailable);
    if (runAuthorityButterflyMotion) {
      const motionStepCount =
        wallDelta > 48 ? Math.min(24, Math.max(1, Math.round(wallDelta / 16))) : 1;
      const motionStartNow = motionStepCount > 1 ? now - wallDelta : now;
      for (let motionStep = 0; motionStep < motionStepCount; motionStep += 1) {
        const stepNow =
          motionStepCount > 1
            ? Math.round(motionStartNow + (wallDelta * (motionStep + 1)) / motionStepCount)
            : now;
        d.butterflyState.list.forEach(function (butterfly) {
          d.simulateButterflyAuthorityStep(butterfly, stepNow);
        });
      }
      if (onlineAvailable && now - d.lastButterflyBroadcastAt >= d.butterflyBroadcastMs) {
        d.broadcastButterflyState(now);
      }
    }
  }
  // ?????? ????????? butterfly.x/y(??????????? ????+???????????????????????
  const smoothRemoteButterflies =
    sharedHydrated && onlineAvailable && !d.isButterflyAuthority();
  /** ????????????? ???????(?? dt?????????????? ???. */
  const butterflyRemoteLerpAlpha = (function () {
    const dt = Math.max(1, wallDelta);
    const a = 1 - Math.exp(-dt / 118);
    return Math.min(0.34, Math.max(0.08, a));
  })();
  /** ???????????????(?????? ?? ?????????? ?????). */
  const butterflyRemoteRenderMaxStepWorld = wallDelta > 120 ? 160 : 120;

  if (wallDelta > 380 && sharedHydrated && d.isButterflyAuthority()) {
    Object.keys(d.butterflyAuthorityWaypointById).forEach(function (wid) {
      delete d.butterflyAuthorityWaypointById[wid];
    });
  }
  if (smoothRemoteButterflies && wallDelta > 380) {
    d.butterflyState.list.forEach(function (b) {
      if (typeof b._renderX !== "number" || typeof b._renderY !== "number") {
        b._renderX = b.x;
        b._renderY = b.y;
      }
    });
  }

  // Render (??? ?????? ?????????? `_catchProbe*`?? ??? ???????????????????????)
  const aliveIds = {};
  let catchTarget = null;
  const renderButterflyBounds = d.getActiveButterflyBounds();
  d.butterflyState.list.forEach(function (butterfly) {
    aliveIds[butterfly.id] = true;
    const entry = d.ensureButterflyRenderEntry(butterfly);
    let targetX = butterfly.x;
    let targetY = butterfly.y;
    if (smoothRemoteButterflies) {
      const sampleAge = Math.min(140, Math.max(0, now - (Number(butterfly._netRecvAt) || now)));
      const maxVelocity = 0.09;
      const vx = Math.max(-maxVelocity, Math.min(maxVelocity, Number(butterfly._netVx) || 0));
      const vy = Math.max(-maxVelocity, Math.min(maxVelocity, Number(butterfly._netVy) || 0));
      targetX += vx * sampleAge;
      targetY += vy * sampleAge;
      targetX = Math.max(renderButterflyBounds.left, Math.min(renderButterflyBounds.right, targetX));
      targetY = Math.max(renderButterflyBounds.top, Math.min(renderButterflyBounds.bottom, targetY));
    }
    let drawX = targetX;
    let drawY = targetY;
    if (smoothRemoteButterflies) {
      if (typeof butterfly._renderX !== "number" || typeof butterfly._renderY !== "number") {
        butterfly._renderX = targetX;
        butterfly._renderY = targetY;
      }
      const rdx = targetX - butterfly._renderX;
      const rdy = targetY - butterfly._renderY;
      const t = butterflyRemoteLerpAlpha;
      let nx = butterfly._renderX + rdx * t;
      let ny = butterfly._renderY + rdy * t;
      let mx = nx - butterfly._renderX;
      let my = ny - butterfly._renderY;
      const mlen = Math.hypot(mx, my);
      if (mlen > butterflyRemoteRenderMaxStepWorld && mlen > 0.0001) {
        const s = butterflyRemoteRenderMaxStepWorld / mlen;
        nx = butterfly._renderX + mx * s;
        ny = butterfly._renderY + my * s;
      }
      butterfly._renderX = nx;
      butterfly._renderY = ny;
      drawX = nx;
      drawY = ny;
    } else {
      // ????? ??????????? ?? ??????? ??????? ???????????????
      // ???????????????????????????????? ????????????????(???????? ?????.
      butterfly._renderX = butterfly.x;
      butterfly._renderY = butterfly.y;
      drawX = butterfly.x;
      drawY = butterfly.y;
    }
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
    areButterfliesUnlockedForPlantFogWorld,
    areButterfliesUnlockedForTutorialOnboarding,
    authorityFillToCapInstantly,
    authoritySpawnButterfliesIfNeeded,
    broadcastButterflyState,
    clampButterflyPointToActiveBounds,
    clearLiveButterfliesForPlantFogLock,
    createButterfly,
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
    isMainGameTutorialInProgress,
    isSharedWorldMergeActive,
    isWorldServerSyncAvailable,
    keepButterfliesInsideActiveBounds,
    markWorldDirty,
    pruneButterflyAuthorityWaypointsToList,
    pruneStaleMultiplayerRoomSessions,
    removeButterflyRenderEntry,
    setInstantHoverTip,
    setWorldPosition,
    setWorldSize,
    shouldRunButterflyMotionSimulation,
    simulateButterflyAuthorityStep,
    updateButterflies,
  };
}
