export function getNumericButterflyValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampPoint(point, bounds) {
  return {
    x: clamp(point.x, bounds.left, bounds.right),
    y: clamp(point.y, bounds.top, bounds.bottom)
  };
}

function hashId(id) {
  const text = String(id || "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function clampButterflyToBounds(butterfly, bounds) {
  butterfly.x = clamp(getNumericButterflyValue(butterfly.x, bounds.left), bounds.left, bounds.right);
  butterfly.y = clamp(getNumericButterflyValue(butterfly.y, bounds.top), bounds.top, bounds.bottom);
}

export function getButterflyFlutterOffsetWorld(now, butterfly, config) {
  const seed = hashId(butterfly.id);
  const px = Math.max(1, Number(config.periodHorizontalMs) || 1000);
  const py = Math.max(1, Number(config.periodVerticalMs) || 1000);
  const ax = Math.max(0, Number(config.amplitudeX) || 0);
  const ay = Math.max(0, Number(config.amplitudeY) || 0);
  const phase = (seed % 6283) / 1000;
  return {
    dx:
      Math.sin((now / px) * Math.PI * 2 + phase) * ax +
      Math.sin((now / (px * 0.47)) * Math.PI * 2 + phase * 1.7) * ax * 0.22,
    dy:
      Math.sin((now / py) * Math.PI * 2 + phase + Math.PI / 2) * ay +
      Math.sin((now / (py * 0.53)) * Math.PI * 2 + phase * 1.3) * ay * 0.22
  };
}

export function createButterflyMotionController(config) {
  function getBounds() {
    if (typeof config.getBounds === "function") {
      const dynamic = config.getBounds();
      if (
        dynamic &&
        Number.isFinite(Number(dynamic.left)) &&
        Number.isFinite(Number(dynamic.right)) &&
        Number.isFinite(Number(dynamic.top)) &&
        Number.isFinite(Number(dynamic.bottom)) &&
        dynamic.right > dynamic.left &&
        dynamic.bottom > dynamic.top
      ) {
        return dynamic;
      }
    }
    return config.bounds;
  }
  const colors = Array.isArray(config.colors) && config.colors.length
    ? config.colors.slice()
    : ["brown"];
  const maxAlive = Math.max(1, Number(config.maxAlive) || 1);
  const minLeg = Math.max(12, Number(config.minLeg) || 56);
  const maxLeg = Math.max(minLeg, Number(config.maxLeg) || 158);
  const speed = Math.max(0.1, Number(config.speed) || 1);
  const legMaxMs = Math.max(500, Number(config.legMaxMs) || 2600);
  const flutter = config.flutter || {};

  function generateId(now) {
    return "butterfly-" + Number(now || Date.now()).toString(36) + "-" +
      Math.random().toString(16).slice(2, 8);
  }

  function pickColor() {
    return colors[Math.floor(Math.random() * colors.length)] || colors[0];
  }

  function pickSpawnPoint() {
    const bounds = getBounds();
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    if (width <= 1 || height <= 1) {
      return {
        x: (bounds.left + bounds.right) * 0.5,
        y: (bounds.top + bounds.bottom) * 0.5
      };
    }
    return {
      x: bounds.left + Math.random() * width,
      y: bounds.top + Math.random() * height
    };
  }

  function pickWaypoint(fromX, fromY) {
    const bounds = getBounds();
    const from = clampPoint({
      x: getNumericButterflyValue(fromX, bounds.left),
      y: getNumericButterflyValue(fromY, bounds.top)
    }, bounds);
    const minDistSq = minLeg * minLeg * 0.64;
    let best = null;
    let bestDistSq = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const leg = minLeg + Math.random() * (maxLeg - minLeg);
      const target = clampPoint({
        x: from.x + Math.cos(angle) * leg,
        y: from.y + Math.sin(angle) * leg
      }, bounds);
      const dx = target.x - from.x;
      const dy = target.y - from.y;
      const distSq = dx * dx + dy * dy;
      if (distSq >= minDistSq) return target;
      if (!best || distSq > bestDistSq) {
        best = target;
        bestDistSq = distSq;
      }
    }
    if (best && bestDistSq > 1) return best;
    const cx = (bounds.left + bounds.right) * 0.5;
    const cy = (bounds.top + bounds.bottom) * 0.5;
    const toCenter = Math.hypot(cx - from.x, cy - from.y) || 1;
    return clampPoint({
      x: from.x + ((cx - from.x) / toCenter) * minLeg,
      y: from.y + ((cy - from.y) / toCenter) * minLeg
    }, bounds);
  }

  function getButterflyPathPoint(butterfly, now) {
    const bounds = getBounds();
    const offset = getButterflyFlutterOffsetWorld(now, butterfly, flutter);
    const fallbackX = getNumericButterflyValue(butterfly.x, bounds.left) - offset.dx;
    const fallbackY = getNumericButterflyValue(butterfly.y, bounds.top) - offset.dy;
    return clampPoint({
      x: getNumericButterflyValue(butterfly.lastPathX, fallbackX),
      y: getNumericButterflyValue(butterfly.lastPathY, fallbackY)
    }, bounds);
  }

  function create(now, options) {
    const opts = options || {};
    const bounds = getBounds();
    const spawn = clampPoint(opts.spawn || pickSpawnPoint(), bounds);
    return {
      id: String(opts.id || generateId(now)),
      color: colors.indexOf(opts.color) >= 0 ? opts.color : pickColor(),
      x: spawn.x,
      y: spawn.y,
      lastPathX: spawn.x,
      lastPathY: spawn.y,
      dirX: Math.random() < 0.5 ? -1 : 1,
      spawnedAt: getNumericButterflyValue(opts.spawnedAt, now)
    };
  }

  function dedupe(list) {
    if (!Array.isArray(list) || list.length <= 1) return Array.isArray(list) ? list : [];
    const seen = Object.create(null);
    const out = [];
    list.forEach(function (butterfly) {
      if (!butterfly || butterfly.id == null) return;
      const id = String(butterfly.id);
      if (seen[id]) return;
      seen[id] = true;
      butterfly.id = id;
      out.push(butterfly);
    });
    return out.length === list.length ? list : out;
  }

  function trim(list) {
    const safe = dedupe(list);
    if (safe.length <= maxAlive) return safe;
    return safe
      .slice()
      .sort(function (a, b) {
        const at = Number(a.spawnedAt) || 0;
        const bt = Number(b.spawnedAt) || 0;
        return bt - at;
      })
      .slice(0, maxAlive);
  }

  function pruneWaypoints(list, waypointMap) {
    const alive = Object.create(null);
    dedupe(list).forEach(function (butterfly) {
      alive[String(butterfly.id)] = true;
    });
    Object.keys(waypointMap).forEach(function (id) {
      if (!alive[id]) delete waypointMap[id];
    });
  }

  function ensureWaypoint(butterfly, now, waypointMap) {
    const bounds = getBounds();
    const id = String(butterfly.id);
    let waypoint = waypointMap[id];
    if (waypoint && now > waypoint.endAt + 1500) {
      delete waypointMap[id];
      waypoint = null;
    }
    if (waypoint && now < waypoint.endAt) return waypoint;

    const pathFrom = getButterflyPathPoint(butterfly, now);
    const target = pickWaypoint(pathFrom.x, pathFrom.y);
    const dx = target.x - pathFrom.x;
    const dy = target.y - pathFrom.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const baseDuration = (distance / speed) * (1000 / 60);
    const duration = Math.round(clamp(baseDuration * (0.9 + Math.random() * 0.3), 520, legMaxMs));
    waypoint = {
      startX: pathFrom.x,
      startY: pathFrom.y,
      targetX: target.x,
      targetY: target.y,
      startAt: now,
      endAt: now + duration
    };
    waypointMap[id] = waypoint;
    return waypoint;
  }

  function simulate(butterfly, now, waypointMap) {
    const bounds = getBounds();
    const waypoint = ensureWaypoint(butterfly, now, waypointMap);
    const total = Math.max(1, waypoint.endAt - waypoint.startAt);
    const rawT = clamp((now - waypoint.startAt) / total, 0, 1);
    const eased = rawT * rawT * (3 - 2 * rawT);
    const pathX = waypoint.startX + (waypoint.targetX - waypoint.startX) * eased;
    const pathY = waypoint.startY + (waypoint.targetY - waypoint.startY) * eased;
    const previousPathX = getNumericButterflyValue(butterfly.lastPathX, pathX);
    const offset = getButterflyFlutterOffsetWorld(now, butterfly, flutter);

    butterfly.lastPathX = pathX;
    butterfly.lastPathY = pathY;
    butterfly.x = pathX + offset.dx;
    butterfly.y = pathY + offset.dy;
    clampButterflyToBounds(butterfly, bounds);
    if (Math.abs(pathX - previousPathX) > 0.01) {
      butterfly.dirX = pathX > previousPathX ? 1 : -1;
    }
  }

  function normalizeSnapshotList(rawList) {
    const bounds = getBounds();
    const seen = Object.create(null);
    const out = [];
    (Array.isArray(rawList) ? rawList : []).forEach(function (raw) {
      if (!raw || raw.id == null) return;
      const id = String(raw.id);
      if (seen[id]) return;
      seen[id] = true;
      let point;
      if (Number.isFinite(Number(raw.x)) && Number.isFinite(Number(raw.y))) {
        const px = Number(raw.x);
        const py = Number(raw.y);
        if (px === 0 && py === 0) {
          point = pickSpawnPoint();
        } else {
          point = clampPoint({ x: px, y: py }, bounds);
          if (px <= bounds.left + 2 && py <= bounds.top + 2) {
            point = pickSpawnPoint();
          }
        }
      } else {
        point = pickSpawnPoint();
      }
      out.push({
        id,
        color: colors.indexOf(raw.color) >= 0 ? raw.color : pickColor(),
        x: point.x,
        y: point.y,
        dirX: Number(raw.dirX) > 0 ? 1 : -1,
        spawnedAt: getNumericButterflyValue(raw.spawnedAt, Date.now())
      });
    });
    return trim(out);
  }

  function snapshotFromState(state) {
    const bounds = getBounds();
    const list = trim(state.list);
    state.list = list;
    return {
      lastSpawnAt: state.lastSpawnAt,
      list: list.map(function (butterfly) {
        const point = clampPoint({
          x: getNumericButterflyValue(butterfly.x, bounds.left),
          y: getNumericButterflyValue(butterfly.y, bounds.top)
        }, bounds);
        return {
          id: butterfly.id,
          color: butterfly.color,
          x: Math.round(point.x * 10000) / 10000,
          y: Math.round(point.y * 10000) / 10000,
          dirX: butterfly.dirX > 0 ? 1 : -1,
          spawnedAt: butterfly.spawnedAt || null
        };
      })
    };
  }

  return {
    pickColor,
    pickSpawnPoint,
    pickWaypoint,
    create,
    dedupe,
    trim,
    pruneWaypoints,
    ensureWaypoint,
    simulate,
    normalizeSnapshotList,
    snapshotFromState
  };
}

export function simulateButterflyAuthorityStep(butterfly, now, options) {
  const controller = createButterflyMotionController({
    bounds: options.bounds,
    colors: options.colors || [butterfly.color || "brown"],
    maxAlive: options.maxAlive || 1,
    speed: options.speed || 1,
    legMaxMs: options.legMaxMs,
    flutter: options.flutter
  });
  controller.simulate(butterfly, now, options.waypointMap || {});
}
