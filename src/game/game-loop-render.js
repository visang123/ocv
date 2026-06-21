/**
 * 게임 루프 — 렌더 단계: 갱신된 상태를 읽어 DOM·UI·카메라를 그린다.
 */
export function runGameLoopRender(host) {
  host.renderPlayerPosition();
  host.updateSeedInventory();
  host.updatePlayerStatus();
  host.updatePlayerHealthUi();
  host.updateSeedCard();
  host.updateGuideCard();
  host.updatePlantProgressGauge();
  host.updateWorldRockMineGauges();
  host.updateOnboardingFlowUI();
  host.updatePlayerAlert();
  host.updateMagicPowderInventoryUi();
  host.syncMagicPowderProximityPlantHighlight();
  host.updateCamera();
  host.updatePlayerName();
  host.updateWorldSocialOverlaysInGameLoop();
}
