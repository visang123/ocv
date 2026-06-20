/**
 * 게임 루프 — 로직 단계: 입력·시뮬레이션·상태 갱신.
 * DOM을 직접 그리는 함수는 render 단계(game-loop-render.js)로 옮긴다.
 */
export function runGameLoopLogic(host) {
  host.syncLocalPlayerVisibility();

  host.gameLoopCyclesForTutorialSync += 1;
  if (host.gameLoopCyclesForTutorialSync >= 420) {
    host.gameLoopCyclesForTutorialSync = 0;
    host.requestAccountTutorialDoneSync();
  }

  host.respawnApplesIfNeeded();
  host.tickWorldRockRespawn(Date.now());
  host.tickWorldBagDropDespawn(Date.now());
  host.tickLocalRockMining(Date.now());
  host.refillWellIfNeeded();
  host.movementTutorial.prepareBeforeMove();
  host.tickPlayerPosition();
  host.onboardingCheckJumpFinish();
  host.movementTutorial.advanceAfterMove();
  host.updateSeedPosition();
  host.updateExtraSeedsAndPlants();
  host.updateBucketPosition();
  host.tickPlayerHealth(Date.now());
  host.refreshPlantIdentityOrdinals();
  host.updatePlantState();
  host.updateNpcPosition();
  host.updateAlchemyCraftEffects(Date.now());
  host.tickOnboardingWaterDoneCongrats(Date.now());
  host.pruneStaleRemotePlayers();
  host.updateButterflies();
  host.updateRemotePlayerSmoothing();
  host.sendMultiplayerPresence(false);
  host.savePlayerPosition(false);
}
