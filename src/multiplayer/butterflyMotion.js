export function getNumericButterflyValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function clampButterflyToBounds(butterfly, bounds) {
  if (butterfly.x < bounds.left) butterfly.x = bounds.left;
  if (butterfly.x > bounds.right) butterfly.x = bounds.right;
  if (butterfly.y < bounds.top) butterfly.y = bounds.top;
  if (butterfly.y > bounds.bottom) butterfly.y = bounds.bottom;
}

export function getButterflyFlutterOffsetWorld(now, butterfly, config) {
  const salt =
    butterfly.id.split("").reduce(function (acc, ch) {
      return acc + ch.charCodeAt(0);
    }, 0) % 6283;
  const omegaX = (2 * Math.PI) / config.periodHorizontalMs;
  const omegaY = (2 * Math.PI) / config.periodVerticalMs;
  return {
    dx: Math.sin(now * omegaX + salt * 0.001) * config.amplitudeX,
    dy: Math.sin(now * omegaY + salt * 0.002 + Math.PI / 2) * config.amplitudeY
  };
}

export function simulateButterflyAuthorityStep(butterfly, now, options) {
  const waypointMap = options.waypointMap;
  let waypoint = waypointMap[butterfly.id];
  if (waypoint && now > waypoint.endAt + 3000) {
    delete waypointMap[butterfly.id];
  }
  waypoint = options.ensureWaypoint(butterfly, now);
  const total = Math.max(1, waypoint.endAt - waypoint.startAt);
  const t = Math.max(0, Math.min(1, (now - waypoint.startAt) / total));
  /** smoothstep — 구간 양끝에서 속도 0에 가깝게 해 이전/다음 다리와 덜 “뚝” 끊기게 */
  const eased = t * t * (3 - 2 * t);
  const pathX = waypoint.startX + (waypoint.targetX - waypoint.startX) * eased;
  const pathY = waypoint.startY + (waypoint.targetY - waypoint.startY) * eased;
  const previousPathX = Number.isFinite(Number(butterfly.lastPathX))
    ? Number(butterfly.lastPathX)
    : waypoint.startX;
  butterfly.lastPathX = pathX;
  butterfly.x = pathX;
  butterfly.y = pathY;
  const fl = getButterflyFlutterOffsetWorld(now, butterfly, options.flutter);
  butterfly.x += fl.dx;
  butterfly.y += fl.dy;
  clampButterflyToBounds(butterfly, options.bounds);
  const pathDx = pathX - previousPathX;
  if (Math.abs(pathDx) > 0.01) {
    butterfly.dirX = pathDx > 0 ? 1 : -1;
  }
}
