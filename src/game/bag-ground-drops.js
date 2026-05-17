/** 월드에 버린 가방 아이템(캐릭터 발밑) — 좌표·스택·비주얼 */

export const BAG_DROP_WORLD_SIZE = 9;
export const BAG_DROP_SNAP_GRID = 10;
export const BAG_DROP_FOOT_OFFSET_Y = 8;

const DROP_VISUALS = {
  seed: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/seed.png",
    alt: "seed"
  },
  overgrowthSeed: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/overgrowth-seed-ground.png?v=20260517a",
    alt: "overgrowth seed"
  },
  apple: { kind: "class", className: "bag-drop-icon bag-drop-icon--apple" },
  rock: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/rock-ground.svg?v=20260512a",
    alt: "rock"
  },
  magicPowder: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/magic-powder-gray.png",
    alt: "magic powder"
  },
  magicPowderYellow: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/magic-powder-yellow-inv.png?v=20260516g",
    alt: "yellow magic powder"
  },
  magicPowderWhite: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/magic-powder-white-inv.png?v=20260516g",
    alt: "white magic powder"
  },
  magicPowderBrown: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/magic-powder-brown-inv.png?v=20260516g",
    alt: "brown magic powder"
  },
  craftDesk: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/craft-desk-world.png?v=20260516g",
    alt: "desk"
  },
  craftFence: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/craft-fence-world.png?v=20260516g",
    alt: "fence"
  },
  craftChair: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/craft-chair-world.png?v=20260516g",
    alt: "chair"
  },
  craftHouse: {
    kind: "img",
    src: "\uC774\uBBF8\uC9C0/craft-house-world.png?v=20260516g",
    alt: "house"
  },
  "butterfly:brown": { kind: "class", className: "bag-drop-icon bag-drop-icon--bf-brown" },
  "butterfly:yellow": { kind: "class", className: "bag-drop-icon bag-drop-icon--bf-yellow" },
  "butterfly:white": { kind: "class", className: "bag-drop-icon bag-drop-icon--bf-white" }
};

const NON_DISCARDABLE_KEYS = new Set(["book"]);

export function canDiscardBagItemKey(itemKey) {
  if (!itemKey || NON_DISCARDABLE_KEYS.has(itemKey)) return false;
  return Object.prototype.hasOwnProperty.call(DROP_VISUALS, itemKey);
}

export function snapBagDropCoord(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const g = BAG_DROP_SNAP_GRID;
  return Math.round(n / g) * g;
}

export function getBagDropStackKey(x, y) {
  return snapBagDropCoord(x) + "," + snapBagDropCoord(y);
}

export function getBagDropGroundVisual(itemKey) {
  return DROP_VISUALS[itemKey] || null;
}

export function createWorldBagDropId() {
  return (
    "bag-drop-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(16).slice(2, 10)
  );
}

export function parseWorldBagDropFromSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  const itemKey = String(raw.itemKey || "");
  if (!canDiscardBagItemKey(itemKey)) return null;
  const count = Math.max(1, Math.floor(Number(raw.count) || 0));
  const x = snapBagDropCoord(Number(raw.x));
  const y = snapBagDropCoord(Number(raw.y));
  const droppedAt = Math.max(0, Number(raw.droppedAt) || 0);
  const id = String(raw.id || createWorldBagDropId());
  return {
    id: id,
    itemKey: itemKey,
    count: count,
    x: x,
    y: y,
    stackKey: getBagDropStackKey(x, y),
    droppedAt: droppedAt || Date.now(),
    droppedBySessionId: raw.droppedBySessionId != null ? String(raw.droppedBySessionId) : "",
    _el: null
  };
}

export function serializeWorldBagDropForSnapshot(drop) {
  if (!drop) return null;
  return {
    id: String(drop.id),
    itemKey: String(drop.itemKey),
    count: Math.max(1, Math.floor(Number(drop.count) || 0)),
    x: snapBagDropCoord(drop.x),
    y: snapBagDropCoord(drop.y),
    droppedAt: Math.max(0, Number(drop.droppedAt) || 0),
    droppedBySessionId:
      drop.droppedBySessionId != null ? String(drop.droppedBySessionId) : ""
  };
}

/**
 * 같은 칸에 쌓인 더미 중 맨 위(마지막에 버린 것) = droppedAt 최대.
 * @param {Array} drops
 * @param {number} playerCenterX
 * @param {number} playerFootY
 * @param {number} maxDistance
 */
export function findNearestWorldBagDropPickup(drops, playerCenterX, playerFootY, maxDistance) {
  if (!Array.isArray(drops) || !drops.length) return null;
  const half = BAG_DROP_WORLD_SIZE / 2;
  const probeX = Number(playerCenterX);
  const probeY = Number(playerFootY) + BAG_DROP_FOOT_OFFSET_Y;
  if (!Number.isFinite(probeX) || !Number.isFinite(probeY)) return null;

  let best = null;
  let bestDist = Infinity;
  let bestDroppedAt = -1;

  drops.forEach(function (drop) {
    if (!drop || !canDiscardBagItemKey(drop.itemKey)) return;
    const cx = Number(drop.x) + half;
    const cy = Number(drop.y) + half;
    const dx = probeX - cx;
    const dy = probeY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDistance) return;
    const droppedAt = Number(drop.droppedAt) || 0;
    if (dist < bestDist - 0.5 || (Math.abs(dist - bestDist) <= 0.5 && droppedAt > bestDroppedAt)) {
      best = drop;
      bestDist = dist;
      bestDroppedAt = droppedAt;
    }
  });

  return best ? { drop: best, distance: bestDist } : null;
}

/** @param {Array} drops */
export function sortWorldBagDropsForRender(drops) {
  return drops.slice().sort(function (a, b) {
    const ta = Number(a.droppedAt) || 0;
    const tb = Number(b.droppedAt) || 0;
    if (ta !== tb) return ta - tb;
    return String(a.id).localeCompare(String(b.id));
  });
}

export function getWorldBagDropZIndex(drop, stackIndex) {
  const base = 418;
  const stack = Math.max(0, Math.floor(Number(stackIndex) || 0));
  return base + stack;
}
