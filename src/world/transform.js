export function getScaleX(groundElement, worldWidth) {
  return groundElement.clientWidth / worldWidth;
}

export function getScaleY(groundElement, groundWorldHeight) {
  return groundElement.clientHeight / groundWorldHeight;
}

export function toScreenX(worldX, groundElement, worldWidth) {
  return worldX * getScaleX(groundElement, worldWidth);
}

export function toScreenY(worldY, groundElement, groundWorldHeight) {
  return worldY * getScaleY(groundElement, groundWorldHeight);
}

export function setWorldSize(
  element,
  width,
  height,
  groundElement,
  worldWidth,
  groundWorldHeight
) {
  element.style.width = toScreenX(width, groundElement, worldWidth) + "px";

  if (height) {
    element.style.height =
      toScreenY(height, groundElement, groundWorldHeight) + "px";
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

