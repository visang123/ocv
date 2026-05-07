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
  element.style.transform =
    "translate(" +
    toScreenX(x, groundElement, worldWidth) +
    "px, " +
    toScreenY(y, groundElement, groundWorldHeight) +
    "px)";
}

