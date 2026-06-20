/** Shared-world rock layout — deterministic per room so every client matches before/without snapshot. */

function hashStringToUint32(str) {
  let hash = 2166136261;
  const text = String(str || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashStringToUint32(seed) || 1;
  return function next() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function getSharedWorldRockRoomSeed(fallbackSeed) {
  try {
    const room =
      (window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom) ||
      fallbackSeed ||
      "ovc-default-room";
    return String(room);
  } catch (e) {
    return String(fallbackSeed || "ovc-default-room");
  }
}

/**
 * @param {number} size
 * @param {object} ctx
 * @param {Array<{x:number,y:number}>} existingRocks
 * @param {string|number} attemptSeed
 * @param {{
 *   WORLD_WIDTH: number,
 *   WORLD_ROCK_SIZE: number,
 *   WORLD_ROCK_SPAWN_X_MARGIN: number,
 *   WORLD_ROCK_SPAWN_Y_MIN: number,
 *   WORLD_ROCK_SPAWN_Y_MAX: number,
 *   collectWorldRockAvoidZones: (ctx: object) => Array<object>,
 *   worldRockOverlapsAnyAvoidRect: (rect: object, zones: Array<object>) => boolean,
 *   worldRockRect: (x: number, y: number, size: number) => object
 * }} deps
 */
export function pickDeterministicWorldRockSpawnPosition(
  size,
  ctx,
  existingRocks,
  attemptSeed,
  deps
) {
  const rockSize = Number(size) || deps.WORLD_ROCK_SIZE;
  const margin = deps.WORLD_ROCK_SPAWN_X_MARGIN;
  const yMin = deps.WORLD_ROCK_SPAWN_Y_MIN;
  const yTopMax = deps.WORLD_ROCK_SPAWN_Y_MAX;
  const xSpan = Math.max(1, deps.WORLD_WIDTH - 2 * margin - rockSize + 1);
  const ySpan = Math.max(1, yTopMax - yMin + 1);
  const avoidZones = deps.collectWorldRockAvoidZones(ctx || {});
  const list = Array.isArray(existingRocks) ? existingRocks : [];
  const rand = createSeededRandom(String(attemptSeed));
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const x = margin + Math.floor(rand() * xSpan);
    const y = yMin + Math.floor(rand() * ySpan);
    const rockR = deps.worldRockRect(x, y, rockSize);
    const clashRock = list.some(function (other) {
      if (!other) return false;
      return Math.abs(Number(other.x) - x) < 10 && Math.abs(Number(other.y) - y) < 10;
    });
    if (clashRock || deps.worldRockOverlapsAnyAvoidRect(rockR, avoidZones)) continue;
    return { x: x, y: y };
  }
  return null;
}

export function createDeterministicWorldRocks(ctx, roomSeed, deps) {
  const size = deps.WORLD_ROCK_SIZE;
  const rocks = [];
  const baseSeed = getSharedWorldRockRoomSeed(roomSeed);
  for (let i = 0; i < deps.WORLD_LOOSE_ROCK_COUNT; i += 1) {
    const pos = pickDeterministicWorldRockSpawnPosition(
      size,
      ctx,
      rocks,
      baseSeed + ":init:" + i,
      deps
    );
    if (!pos) continue;
    rocks.push({
      id: "ground-rock-" + (i + 1),
      x: pos.x,
      y: pos.y,
      size: size
    });
  }
  return rocks;
}

export function pickDeterministicRockRespawnPosition(rockId, respawnAt, ctx, existingRocks, deps) {
  const seed =
    getSharedWorldRockRoomSeed() +
    ":respawn:" +
    String(rockId || "") +
    ":" +
    Math.max(0, Math.floor(Number(respawnAt) || 0));
  return pickDeterministicWorldRockSpawnPosition(
    deps.WORLD_ROCK_SIZE,
    ctx,
    existingRocks,
    seed,
    deps
  );
}
