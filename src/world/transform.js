export function getPositionScaleX(groundElement, worldWidth) {
  return groundElement.clientWidth / worldWidth;
}

export function getPositionScaleY(groundElement, groundWorldHeight) {
  return groundElement.clientHeight / groundWorldHeight;
}

export function getEntitySizeScaleX(groundElement, worldWidth, mapVisualScale) {
  return groundElement.clientWidth / (worldWidth * mapVisualScale);
}

export function getEntitySizeScaleY(groundElement, groundWorldHeight, mapVisualScale) {
  return groundElement.clientHeight / (groundWorldHeight * mapVisualScale);
}

/** @deprecated position scale — use getPositionScaleX */
export function getScaleX(groundElement, worldWidth) {
  return getPositionScaleX(groundElement, worldWidth);
}

/** @deprecated position scale — use getPositionScaleY */
export function getScaleY(groundElement, groundWorldHeight) {
  return getPositionScaleY(groundElement, groundWorldHeight);
}

export function toScreenX(worldX, groundElement, worldWidth) {
  return worldX * getPositionScaleX(groundElement, worldWidth);
}

export function toScreenY(worldY, groundElement, groundWorldHeight) {
  return worldY * getPositionScaleY(groundElement, groundWorldHeight);
}

/** 게임 객체 — 화면 픽셀 크기 유지, 위치만 맵 비율에 맞게 */
export function setWorldSize(
  element,
  width,
  height,
  groundElement,
  worldWidth,
  groundWorldHeight,
  mapVisualScale = 1
) {
  element.style.width =
    width * getEntitySizeScaleX(groundElement, worldWidth, mapVisualScale) + "px";

  if (height) {
    element.style.height =
      height *
        getEntitySizeScaleY(groundElement, groundWorldHeight, mapVisualScale) +
      "px";
  } else {
    element.style.height = "";
  }
}

/** 안개·하늘 안개 — 땅/하늘과 동일한 맵 스케일 */
export function setWorldMapSize(
  element,
  width,
  height,
  groundElement,
  worldWidth,
  groundWorldHeight
) {
  element.style.width =
    width * getPositionScaleX(groundElement, worldWidth) + "px";

  if (height) {
    element.style.height =
      height * getPositionScaleY(groundElement, groundWorldHeight) + "px";
  } else {
    element.style.height = "";
  }
}

export function setWorldPosition(
  element,
  x,
  y,
  groundElement,
  worldWidth,
  groundWorldHeight
) {
  const tx = toScreenX(x, groundElement, worldWidth);
  const ty = toScreenY(y, groundElement, groundWorldHeight);
  /** translate3d: 줌된 .world 안에서도 합성 레이어로 올려 미세 떨림 완화 */
  element.style.transform = "translate3d(" + tx + "px, " + ty + "px, 0)";
}
