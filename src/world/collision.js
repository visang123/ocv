export function getCenterDistance(playerBox, x, y, width, height) {
  const playerCenterX = playerBox.left + playerBox.width / 2;
  const playerCenterY = playerBox.top + playerBox.height / 2;
  const itemCenterX = x + width / 2;
  const itemCenterY = y + height / 2;
  return Math.hypot(playerCenterX - itemCenterX, playerCenterY - itemCenterY);
}

export function isOverlappingRect(a, b) {
  return (
    a.right >= b.left &&
    a.left <= b.right &&
    a.bottom >= b.top &&
    a.top <= b.bottom
  );
}

