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
  const ax = config.amplitudeX;
  const ay = config.amplitudeY;
  /** 큰 호흡 + 약간 빠른 고조파 → 경로가 거의 평행일 때도 화면상 “완전 정지”가 덜함 */
  const dx =
    Math.sin(now * omegaX + salt * 0.001) * ax +
    Math.sin(now * omegaX * 2.21 + salt * 0.37) * (ax * 0.38) +
    Math.sin(now * omegaX * 5.1 + salt * 0.11) * (ax * 0.12);
  const dy =
    Math.sin(now * omegaY + salt * 0.002 + Math.PI / 2) * ay +
    Math.sin(now * omegaY * 2.47 + salt * 0.29) * (ay * 0.38) +
    Math.sin(now * omegaY * 4.8 + salt * 0.19) * (ay * 0.12);
  return { dx, dy };
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
  /** 선형 보간: 구간 끝에서 속도가 0으로 떨어지지 않아 “잠깐 멈춤” 체감이 smoothstep보다 적음 */
  const eased = t;
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
