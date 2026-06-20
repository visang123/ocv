/** View — 카메라·화면 좌표 변환. */

export function createModule(d) {
  function groundScreenPxToWorldX(px) {
  const cw = d.ground.clientWidth || 1;
  return (px * d.WORLD_WIDTH) / cw;
  }

  function groundScreenPxToWorldY(px) {
  const ch = d.ground.clientHeight || 1;
  return (px * d.GROUND_WORLD_HEIGHT) / ch;
  }

  function toScreenX(worldX) {
  return d.toScreenXUtil(worldX, d.ground, d.WORLD_WIDTH);
  }

  function toScreenY(worldY) {
  return d.toScreenYUtil(worldY, d.ground, d.GROUND_WORLD_HEIGHT);
  }

  function updateCamera() {
  d.getCamera().zoom = d.clampZoom(d.getCamera().zoom);
  const playerBox = d.getPlayerBox();
  const mapScale = d.MAP_VISUAL_SCALE;
  const groundTop = (d.WORLD_HEIGHT - d.GROUND_WORLD_HEIGHT) * mapScale;
  const playerCenterX = (playerBox.left + playerBox.width / 2) * mapScale;
  const playerCenterY =
    groundTop + (playerBox.top + playerBox.height / 2) * mapScale;
  const visibleWidth = window.innerWidth / d.getCamera().zoom;
  const visibleHeight = window.innerHeight / d.getCamera().zoom;
  const targetX = playerCenterX - visibleWidth / 2;
  const targetY = playerCenterY - visibleHeight / 2;
  const maxCameraX = Math.max(0, d.VISUAL_WORLD_WIDTH - visibleWidth);
  const maxCameraY = Math.max(0, d.VISUAL_WORLD_HEIGHT - visibleHeight);

  d.getCamera().x = Math.max(0, Math.min(targetX, maxCameraX));
  d.getCamera().y = Math.max(0, Math.min(targetY, maxCameraY));
  d.world.style.transform =
    "translate(" +
    -d.getCamera().x * d.getCamera().zoom +
    "px, " +
    -d.getCamera().y * d.getCamera().zoom +
    "px) scale(" +
    d.getCamera().zoom +
    ")";
  if (d.worldNpcHoverAnchorEl) {
    d.syncWorldNpcHoverLabelPosition(d.worldNpcHoverAnchorEl);
  }
  }

  return {
    groundScreenPxToWorldX,
    groundScreenPxToWorldY,
    toScreenX,
    toScreenY,
    updateCamera,
  };
}
