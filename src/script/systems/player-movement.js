/** Systems — 플레이어 이동·충돌 (DOM 없음, 좌표만). */
export function createModule(d) {
  function clampPlayerToTreeOutline() {
  const minD = d.getMinTreePlayerDepth();
  const maxD = d.getMaxTreePlayerDepth();
  const target = Math.max(minD, Math.min(maxD, d.getPlayer().depth));
  if (d.getPlayer().depth < target) {
    d.getPlayer().depth = Math.min(target, d.getPlayer().depth + d.TREE_DEPTH_CLAMP_MAX_STEP);
  } else if (d.getPlayer().depth > target) {
    d.getPlayer().depth = Math.max(target, d.getPlayer().depth - d.TREE_DEPTH_CLAMP_MAX_STEP);
  } else {
    d.getPlayer().depth = target;
  }
  }

  function getCraftChairById(chairId) {
  const id = String(chairId || "");
  if (!id) return null;
  for (let i = 0; i < d.placedCraftFurniture.length; i++) {
    const entry = d.placedCraftFurniture[i];
    if (entry && entry.kind === "craftChair" && String(entry.id) === id) {
      return entry;
    }
  }
  return null;
  }

  function getLocalPlayerBodyWidth() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_WIDTH : d.PLAYER_WIDTH;
  }

  function getMaxGroundedPlayerDepth() {
  return d.GROUND_WORLD_HEIGHT - d.groundFootInset;
  }

  function getMaxTreePlayerDepth() {
  return d.GROUND_WORLD_HEIGHT - d.TREE_CANOPY_TOP - 2;
  }

  function getMinGroundedPlayerDepth() {
  return 0;
  }

  function getMinTreePlayerDepth() {
  return d.getMaxGroundedPlayerDepth();
  }

  function getPlantFogClearRectForCurrentScore() {
  const stage = d.getPlantFogWorldStageFromScore(d.getTotalPlantIndexScore());
  return d.getPlantFogClearRectWorldPx(stage);
  }

  function getPlantFogClearRectForMovementClamp() {
  return d.getPlantFogClearRectForCurrentScore();
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

  function getPlayerCenterX() {
  return d.getPlayer().x + d.getLocalPlayerBodyWidth() / 2;
  }

  function getPlayerFootY() {
  return d.GROUND_WORLD_HEIGHT - d.getPlayer().depth + d.getPlayer().jumpY;
  }

  function getPlayerHeadFogProbeBoxForPose(px, pd, jy) {
  const footY = d.GROUND_WORLD_HEIGHT - pd + jy;
  const feetInsetX = 3;
  const feetH = 8;
  return {
    left: px + feetInsetX,
    top: footY - feetH,
    right: px + d.PLAYER_WIDTH - feetInsetX,
    bottom: footY,
    width: d.PLAYER_WIDTH - feetInsetX * 2,
    height: feetH
  };
  }

  function getPlayerWorldRockCollisionBoxForPose(px, pd, jy) {
  const footY = d.GROUND_WORLD_HEIGHT - pd + jy;
  const feetInsetX = 5;
  const feetH = 7;
  return {
    left: px + feetInsetX,
    top: footY - feetH,
    right: px + d.PLAYER_WIDTH - feetInsetX,
    bottom: footY + 1,
    width: d.PLAYER_WIDTH - feetInsetX * 2,
    height: feetH + 1
  };
  }

  function getPlayerWorldY() {
  return -d.getPlayer().depth + d.getPlayer().jumpY;
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

  function getVisibleWorldRockCollisionRect(rx, ry, sz, rockEl) {
  const size = Number(sz) || d.WORLD_ROCK_SIZE;
  if (rockEl && d.ground && typeof rockEl.getBoundingClientRect === "function") {
    const gRect = d.ground.getBoundingClientRect();
    const rRect = rockEl.getBoundingClientRect();
    if (gRect.width > 0 && gRect.height > 0 && rRect.width > 0.5 && rRect.height > 0.5) {
      const wx = d.WORLD_WIDTH / gRect.width;
      const wy = d.GROUND_WORLD_HEIGHT / gRect.height;
      const boxLeft = (rRect.left - gRect.left) * wx;
      const boxTop = (rRect.top - gRect.top) * wy;
      const boxW = rRect.width * wx;
      const boxH = rRect.height * wy;
      return d.getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH);
    }
  }
  return d.getVisibleWorldRockCollisionRectFromBox(rx, ry, size, size);
  }

  function getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH) {
  const boxBottom = boxTop + boxH;
  const renderW = Math.min(boxW, boxH * (d.ROCK_GROUND_SVG_W / d.ROCK_GROUND_SVG_H));
  const renderH = Math.min(boxH, boxW * (d.ROCK_GROUND_SVG_H / d.ROCK_GROUND_SVG_W));
  const imageLeft = boxLeft + (boxW - renderW) * 0.5;
  const imageTop = boxBottom - renderH;
  return {
    left: imageLeft + (d.ROCK_GROUND_HIT_LEFT / d.ROCK_GROUND_SVG_W) * renderW,
    top: imageTop + (d.ROCK_GROUND_HIT_TOP / d.ROCK_GROUND_SVG_H) * renderH,
    right: imageLeft + (d.ROCK_GROUND_HIT_RIGHT / d.ROCK_GROUND_SVG_W) * renderW,
    bottom: imageTop + (d.ROCK_GROUND_HIT_BOTTOM / d.ROCK_GROUND_SVG_H) * renderH
  };
  }

  function isCraftFurnitureInstalling() {
  return d.craftFurnitureInstallingKind != null;
  }

  function isPlantFogMovementClampActive() {
  if (!d.isWorldDocumentEntry()) return false;
  if (d.getTotalPlantIndexScore() >= d.PLANT_INDEX_SCORE_CAP) return false;
  return true;
  }

  function isPlayerBoxFullyInsidePlantFogClearRect(playerBox, rect, eps) {
  const e = eps == null ? 0.35 : eps;
  return (
    playerBox.left >= rect.left - e &&
    playerBox.right <= rect.right + e &&
    playerBox.top >= rect.top - e &&
    playerBox.bottom <= rect.bottom + e
  );
  }

  function isPlayerCollidingVisibleWorldRockForPose(px, pd, jy) {
  if (!d.isWorldDocumentEntry()) return false;
  if (!Array.isArray(d.getApple().worldRocks)) return false;
  const pickedIds = Array.isArray(d.getApple().worldRockPickedIds)
    ? d.getApple().worldRockPickedIds
    : [];
  const playerFeet = d.getPlayerWorldRockCollisionBoxForPose(px, pd, jy);
  return d.getApple().worldRocks.some(function (rock) {
    if (!rock || pickedIds.includes(String(rock.id))) return false;
    const rx = Number(rock.x);
    const ry = Number(rock.y);
    const sz = Number(rock.size) || d.WORLD_ROCK_SIZE;
    if (!Number.isFinite(rx) || !Number.isFinite(ry)) return false;
    return d.isOverlappingRect(playerFeet, d.getVisibleWorldRockCollisionRect(rx, ry, sz, rock._el));
  });
  }

  function isPlayerGameplayBlockedByNpcDialogue() {
  if (d.getNpc().isDialogueRunning) return true;
  if (d.isTradeExchangeOpen() || d.isAlchemyCraftOpen()) return false;
  if (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen()) return false;
  return d.isTradeMasterDialogueRunning() || d.isAlchemyMasterDialogueRunning();
  }

  function isPlayerHeadFogClearForPose(px, pd, jy, rect, eps) {
  return d.isPlayerBoxFullyInsidePlantFogClearRect(
    d.getPlayerHeadFogProbeBoxForPose(px, pd, jy),
    rect,
    eps
  );
  }

  function isPlayerInTreeCanopy() {
  const centerX = d.getPlayerCenterX();
  const footY = d.getPlayerFootY();

  return (
    centerX >= d.TREE_CANOPY_LEFT &&
    centerX <= d.TREE_CANOPY_RIGHT &&
    footY >= d.TREE_CANOPY_TOP &&
    footY <= d.TREE_CANOPY_BOTTOM
  );
  }

  function isPlayerInWellWaterArea() {
  const footX = d.getPlayerCenterX();
  const footY = d.getPlayerFootY();
  return (
    footX >= d.getWorldItems().wellX + 12 &&
    footX <= d.getWorldItems().wellX + d.WELL_SIZE - 12 &&
    footY >= d.getWorldItems().wellY + d.WELL_SIZE * 0.55 &&
    footY <= d.getWorldItems().wellY + d.WELL_SIZE - 6
  );
  }

  function isPlayerNearTreeTrunk() {
  if (d.getPlayer().isTreeFalling) return false;
  const centerX = d.getPlayerCenterX();
  const footY = d.getPlayerFootY();
  const rootsTop =
    d.BIG_TREE_Y +
    d.BIG_TREE_RENDER_HEIGHT +
    d.TREE_CSS_ROOTS_BOTTOM_EXTEND -
    d.TREE_CSS_ROOTS_HEIGHT;
  const rootsBottom = d.BIG_TREE_Y + d.BIG_TREE_RENDER_HEIGHT + d.TREE_CSS_ROOTS_BOTTOM_EXTEND;
  const feetInset = 5;
  const feetRect = {
    left: d.getPlayer().x + feetInset,
    right: d.getPlayer().x + d.PLAYER_WIDTH - feetInset,
    top: footY - 8,
    bottom: footY + 2
  };
  const hPad = 1;
  const rootsRect = {
    left: d.BIG_TREE_X + d.TREE_CSS_ROOTS_LEFT / d.MAP_VISUAL_SCALE - hPad,
    right:
      d.BIG_TREE_X +
      (d.TREE_CSS_ROOTS_LEFT + d.TREE_CSS_ROOTS_WIDTH) / d.MAP_VISUAL_SCALE +
      hPad,
    top: rootsTop,
    bottom: rootsBottom
  };
  if (
    centerX >= rootsRect.left &&
    centerX <= rootsRect.right &&
    d.isOverlappingRect(feetRect, rootsRect)
  ) {
    return true;
  }
  const trunkRect = {
    left: d.TREE_TRUNK_X - hPad,
    right: d.TREE_TRUNK_X + d.TREE_TRUNK_WIDTH + hPad,
    top: d.TREE_TRUNK_TOP - 22,
    bottom: rootsBottom
  };
  return (
    centerX >= trunkRect.left &&
    centerX <= trunkRect.right &&
    d.isOverlappingRect(feetRect, trunkRect)
  );
  }

  function isPlayerSupportedByTree() {
  return !d.getPlayer().isTreeFalling && (d.isPlayerNearTreeTrunk() || d.isPlayerInTreeCanopy());
  }

  function isPlayerTimedActionBusy() {
  if (String(d.getPlayer().rockMiningRockId || "")) return true;
  return d.getPlant().isPlanting || d.getApple().isEating || d.isCraftFurnitureInstalling();
  }

  function isSharedWorldMergeActive() {
  return d.isWorldServerSyncAvailable() && d.hasHydratedSharedWorldFromServer;
  }

  function isWorldChatBlockingGameInput() {
  if (!d.worldSocialUiReady) return false;
  if (d.worldChatPanelOpen) return true;
  if (d.worldChatInputEl && document.activeElement === d.worldChatInputEl) return true;
  return false;
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

  function movePlayerVerticallyInTree(deltaDepth) {
  d.getPlayer().depth += deltaDepth;
  d.getPlayer().jumpY = 0;
  d.getPlayer().velocityY = 0;
  d.getPlayer().isOnGround = true;
  d.getPlayer().isTreeFalling = false;
  d.clampPlayerToTreeOutline();
  }

  function snapPlayerToCraftChair(chair) {
  if (!chair) return;
  const pose = d.getCraftChairSitPose(chair, d.PLAYER_SIT_WIDTH, d.PLAYER_SIT_HEIGHT);
  if (!pose) return;
  d.getPlayer().x = pose.playerX;
  d.getPlayer().depth = d.GROUND_WORLD_HEIGHT - pose.footY;
  d.getPlayer().jumpY = 0;
  d.getPlayer().velocityY = 0;
  d.getPlayer().isOnGround = true;
  d.getPlayer().isTreeFalling = false;
  d.setWorldPosition(d.localPlayerRoot, d.getPlayer().x, d.getPlayerWorldY());
  d.updatePlayerColorBodyPosition();
  }

  function standUpFromChair() {
  if (
    !d.getPlayer().sittingChairId &&
    !(d.player && d.player.classList.contains("is-sitting"))
  ) {
    return;
  }
  d.resetPlayerChairSitState();
  d.sendMultiplayerPresence(true);
  }

  function tickPlayerPosition() {
  d.playerPositionChangedThisTick = false;
  const healthPosePrev = d.getPlayer().healthPoseInitialized
    ? d.getPlayer().healthPosePrev
    : { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };

  if (d.isCharacterSelecting || !d.hasSpawnedCharacter) {
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (d.getPlayer().insideCraftHouseId) {
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (d.getPlayer().sittingChairId) {
    const seatedChair = d.getCraftChairById(d.getPlayer().sittingChairId);
    if (seatedChair) {
      d.snapPlayerToCraftChair(seatedChair);
    } else {
      d.standUpFromChair();
    }
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (String(d.getPlayer().rockMiningRockId || "")) {
    if (typeof d.resetInputKeys === "function" && d.keys) {
      d.resetInputKeys(d.keys);
    }
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (!d.canPlayerMoveByHealth(d.getPlayer().health)) {
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (d.isPlayerTimedActionBusy() || d.isPlayerGameplayBlockedByNpcDialogue()) {
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  if (d.isWorldChatBlockingGameInput()) {
    d.getPlayer().lastMovementTickMs = performance.now();
    d.getPlayer().healthPosePrev = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
    d.getPlayer().healthPoseInitialized = true;
    return;
  }

  const nowMs = performance.now();
  if (d.getPlayer().lastMovementTickMs <= 0) {
    d.getPlayer().lastMovementTickMs = nowMs - 1000 / d.MOVEMENT_REFERENCE_HZ;
  }
  let dtSec = (nowMs - d.getPlayer().lastMovementTickMs) / 1000;
  d.getPlayer().lastMovementTickMs = nowMs;
  dtSec = Math.min(d.MOVEMENT_DT_CAP_SEC, Math.max(0, dtSec));
  const frameScale = dtSec * d.MOVEMENT_REFERENCE_HZ;

  const previousPlayerX = d.getPlayer().x;
  const previousPlayerDepth = d.getPlayer().depth;
  const previousJumpY = d.getPlayer().jumpY;
  const groundMaxDepth = d.getMaxGroundedPlayerDepth();
  const maxX = Math.max(0, d.WORLD_WIDTH - d.PLAYER_WIDTH);
  const preNearTrunk = d.isPlayerNearTreeTrunk();
  const preInCanopy = d.isPlayerInTreeCanopy();
  const speedSide =
    !d.getPlayer().isTreeFalling && (preNearTrunk || preInCanopy || d.getPlayer().wasInTree)
      ? d.treeMoveSpeed
      : d.speed;

  if (d.keys.ArrowLeft || d.keys.a) {
    d.getPlayer().x -= speedSide * frameScale;
  }

  if (d.keys.ArrowRight || d.keys.d) {
    d.getPlayer().x += speedSide * frameScale;
  }

  if (d.getPlayer().x < 0) d.getPlayer().x = 0;
  if (d.getPlayer().x > maxX) d.getPlayer().x = maxX;

  const isInCanopy = d.isPlayerInTreeCanopy();
  const isNearTrunk = d.isPlayerNearTreeTrunk();
  const isInTree = !d.getPlayer().isTreeFalling && (isInCanopy || isNearTrunk);
  let shouldClampToTree = isInTree;

  const shouldTreeFall =
    d.getPlayer().depth > groundMaxDepth &&
    (d.getPlayer().isTreeFalling || !d.isPlayerSupportedByTree());
  const isFallingFromTree = shouldTreeFall;

  if (shouldTreeFall) {
    d.getPlayer().isTreeFalling = true;
    d.getPlayer().jumpY = 0;
    d.getPlayer().velocityY = 0;
    d.getPlayer().depth -= d.treeFallSpeed * frameScale;
    if (d.getPlayer().depth <= groundMaxDepth) {
      d.getPlayer().depth = groundMaxDepth;
      d.getPlayer().isOnGround = true;
      d.getPlayer().isTreeFalling = false;
      d.getPlayer().wasInTree = false;
    } else {
      d.getPlayer().isOnGround = false;
    }
  } else if (isInTree) {
    d.getPlayer().jumpY = 0;
    d.getPlayer().velocityY = 0;
    d.getPlayer().isOnGround = true;

    const wantsTreeDown = d.keys.ArrowDown || d.keys.s;
    const isAtTreeBase = !isInCanopy && d.getPlayer().depth <= groundMaxDepth + d.treeClimbSpeed * frameScale + 2;
    if (wantsTreeDown && isAtTreeBase) {
      d.getPlayer().depth -= d.speed * frameScale;
      shouldClampToTree = false;
      d.getPlayer().wasInTree = false;
    } else if (d.keys.ArrowUp || d.keys.w) {
      d.movePlayerVerticallyInTree(d.treeClimbSpeed * frameScale);
    } else if (wantsTreeDown) {
      d.movePlayerVerticallyInTree(-d.treeClimbSpeed * frameScale);
    }
  } else {
    if (d.keys.ArrowUp || d.keys.w) {
      d.getPlayer().depth += d.speed * frameScale;
    }

    if (d.keys.ArrowDown || d.keys.s) {
      d.getPlayer().depth -= d.speed * frameScale;
    }
    d.getPlayer().velocityY += d.gravity * frameScale;
    d.getPlayer().jumpY += d.getPlayer().velocityY * frameScale;
  }

  if (d.getPlayer().depth < d.getMinGroundedPlayerDepth()) {
    d.getPlayer().depth = d.getMinGroundedPlayerDepth();
  }
  // Do not hard-snap to ground depth here; if the player is above ground and
  // outside tree support we want a smooth fall, not an instant teleport.

  if (shouldClampToTree) {
    d.clampPlayerToTreeOutline();
  }

  if (d.getPlayer().jumpY > 0) {
    d.getPlayer().jumpY = 0;
    d.getPlayer().velocityY = 0;
    d.getPlayer().isOnGround = true;
    d.getPlayer().isTreeFalling = false;
  }

  if (d.isPlayerInWellWaterArea()) {
    d.getPlayer().x = previousPlayerX;
    d.getPlayer().depth = previousPlayerDepth;
    d.getPlayer().jumpY = previousJumpY;
  } else if (d.isPlantFogMovementClampActive()) {
    const clearRect = d.getPlantFogClearRectForMovementClamp();
    const eps = 0.35;
    if (!d.isPlayerHeadFogClearForPose(d.getPlayer().x, d.getPlayer().depth, d.getPlayer().jumpY, clearRect, eps)) {
      if (d.isPlayerHeadFogClearForPose(previousPlayerX, d.getPlayer().depth, d.getPlayer().jumpY, clearRect, eps)) {
        d.getPlayer().x = previousPlayerX;
      } else if (d.isPlayerHeadFogClearForPose(d.getPlayer().x, previousPlayerDepth, previousJumpY, clearRect, eps)) {
        d.getPlayer().depth = previousPlayerDepth;
        d.getPlayer().jumpY = previousJumpY;
      } else {
        d.getPlayer().x = previousPlayerX;
        d.getPlayer().depth = previousPlayerDepth;
        d.getPlayer().jumpY = previousJumpY;
      }
    }
  }

  if (d.isPlayerCollidingVisibleWorldRockForPose(d.getPlayer().x, d.getPlayer().depth, d.getPlayer().jumpY)) {
    if (!d.isPlayerCollidingVisibleWorldRockForPose(previousPlayerX, d.getPlayer().depth, d.getPlayer().jumpY)) {
      d.getPlayer().x = previousPlayerX;
    } else if (!d.isPlayerCollidingVisibleWorldRockForPose(d.getPlayer().x, previousPlayerDepth, previousJumpY)) {
      d.getPlayer().depth = previousPlayerDepth;
      d.getPlayer().jumpY = previousJumpY;
    } else {
      d.getPlayer().x = previousPlayerX;
      d.getPlayer().depth = previousPlayerDepth;
      d.getPlayer().jumpY = previousJumpY;
    }
  }

  d.getPlayer().wasInTree = shouldClampToTree || (d.getPlayer().isTreeFalling && d.getPlayer().depth > groundMaxDepth);
  if (
    d.getPlayer().x !== previousPlayerX ||
    d.getPlayer().depth !== previousPlayerDepth ||
    d.getPlayer().jumpY !== previousJumpY
  ) {
    d.playerPositionChangedThisTick = true;
  }

  const poseNow = { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
  if (
    !d.isPlayerMovementKeyActive(d.keys) ||
    d.isPlayerPoseUnchanged(healthPosePrev, poseNow)
  ) {
    d.getPlayer().healthPosePrev = poseNow;
  } else {
    d.getPlayer().healthPosePrev = healthPosePrev;
  }
  d.getPlayer().healthPoseInitialized = true;
  }

  return {
    clampPlayerToTreeOutline,
    getCraftChairById,
    getLocalPlayerBodyWidth,
    getMaxGroundedPlayerDepth,
    getMaxTreePlayerDepth,
    getMinGroundedPlayerDepth,
    getMinTreePlayerDepth,
    getPlantFogClearRectForCurrentScore,
    getPlantFogClearRectForMovementClamp,
    getPlantIndexScoringOptions,
    getPlayerCenterX,
    getPlayerFootY,
    getPlayerHeadFogProbeBoxForPose,
    getPlayerWorldRockCollisionBoxForPose,
    getPlayerWorldY,
    getSharedPlantSimulationNow,
    getSynchronizedNow,
    getTotalPlantIndexScore,
    getVisibleWorldRockCollisionRect,
    getVisibleWorldRockCollisionRectFromBox,
    isCraftFurnitureInstalling,
    isPlantFogMovementClampActive,
    isPlayerBoxFullyInsidePlantFogClearRect,
    isPlayerCollidingVisibleWorldRockForPose,
    isPlayerGameplayBlockedByNpcDialogue,
    isPlayerHeadFogClearForPose,
    isPlayerInTreeCanopy,
    isPlayerInWellWaterArea,
    isPlayerNearTreeTrunk,
    isPlayerSupportedByTree,
    isPlayerTimedActionBusy,
    isSharedWorldMergeActive,
    isWorldChatBlockingGameInput,
    isWorldServerSyncAvailable,
    movePlayerVerticallyInTree,
    snapPlayerToCraftChair,
    standUpFromChair,
    tickPlayerPosition,
  };
}
