/** Player health drain rules and helpers. */

export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_HEALTH_DRAIN_INTERVAL_MS = 5000;
export const PLAYER_CHAIR_INTERACT_DISTANCE = 42;
const POSITION_IDLE_EPSILON = 0.05;

const MOVEMENT_KEY_NAMES = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s"];

export function clampPlayerHealth(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return PLAYER_MAX_HEALTH;
  return Math.max(0, Math.min(PLAYER_MAX_HEALTH, n));
}

export function isPlayerMovementKeyActive(keys) {
  if (!keys) return false;
  for (let i = 0; i < MOVEMENT_KEY_NAMES.length; i++) {
    if (keys[MOVEMENT_KEY_NAMES[i]]) return true;
  }
  return false;
}

export function isPlayerPoseUnchanged(prev, next, epsilon) {
  const eps = epsilon != null ? epsilon : POSITION_IDLE_EPSILON;
  return (
    Math.abs((next.x || 0) - (prev.x || 0)) <= eps &&
    Math.abs((next.depth || 0) - (prev.depth || 0)) <= eps &&
    Math.abs((next.jumpY || 0) - (prev.jumpY || 0)) <= eps
  );
}

/**
 * Standing still with no movement input and no active pose change.
 */
export function isPlayerIdleForHealth(opts) {
  if (!opts || !opts.hasSpawnedCharacter || opts.isCharacterSelecting) return false;
  if (opts.isSittingOnChair) return false;
  if (opts.isPlanting || opts.isEating) return false;
  if (opts.isGameplayBlockedByNpcDialogue) return false;
  if (isPlayerMovementKeyActive(opts.keys)) return false;
  if (!isPlayerPoseUnchanged(opts.previousPose, opts.currentPose)) return false;
  if (Math.abs(Number(opts.velocityY) || 0) > POSITION_IDLE_EPSILON) return false;
  return true;
}

export function isPlayerInsideCraftHouse(footCenterX, footY, placedFurniture) {
  if (!Array.isArray(placedFurniture) || placedFurniture.length === 0) return false;
  const cx = Number(footCenterX);
  const fy = Number(footY);
  if (!Number.isFinite(cx) || !Number.isFinite(fy)) return false;
  const inset = 6;
  for (let i = 0; i < placedFurniture.length; i++) {
    const entry = placedFurniture[i];
    if (!entry || entry.kind !== "craftHouse") continue;
    const left = Number(entry.x) + inset;
    const right = Number(entry.x) + Number(entry.width) - inset;
    const top = Number(entry.y) + inset;
    const bottom = Number(entry.y) + Number(entry.height);
    if (cx >= left && cx <= right && fy >= top && fy <= bottom) {
      return true;
    }
  }
  return false;
}

export function findNearestCraftChair(footCenterX, footY, placedFurniture, maxDistance) {
  if (!Array.isArray(placedFurniture) || placedFurniture.length === 0) return null;
  const limit = Number.isFinite(Number(maxDistance)) ? Number(maxDistance) : PLAYER_CHAIR_INTERACT_DISTANCE;
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < placedFurniture.length; i++) {
    const entry = placedFurniture[i];
    if (!entry || entry.kind !== "craftChair") continue;
    const centerX = Number(entry.x) + Number(entry.width) / 2;
    const centerY = Number(entry.y) + Number(entry.height) / 2;
    const dx = Number(footCenterX) - centerX;
    const dy = Number(footY) - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist && dist <= limit) {
      bestDist = dist;
      best = entry;
    }
  }
  return best;
}

export function getCraftChairSitPose(chair, playerWidth) {
  if (!chair) return null;
  const width = Number(playerWidth) || 25;
  const footY = Number(chair.y) + Number(chair.height);
  return {
    playerX: Number(chair.x) + Number(chair.width) / 2 - width / 2,
    playerDepth: null,
    footY: footY,
    chairId: String(chair.id || "")
  };
}

export function shouldDrainPlayerHealth(opts) {
  if (!opts || !opts.hasSpawnedCharacter || opts.isCharacterSelecting) return false;
  if (opts.isTabSessionSuperseded) return false;
  if (isPlayerIdleForHealth(opts)) return false;
  if (opts.isSittingOnChair) return false;
  if (
    isPlayerInsideCraftHouse(opts.footCenterX, opts.footY, opts.placedCraftFurniture)
  ) {
    return false;
  }
  return true;
}

/**
 * @returns {{ health: number, lastDrainAt: number, drained: boolean }}
 */
export function tickPlayerHealthDrain(state, nowMs) {
  const health = clampPlayerHealth(state.health);
  const lastDrainAt = Number(state.lastDrainAt) || 0;
  const now = Number(nowMs) || Date.now();
  if (!state.shouldDrain) {
    return { health: health, lastDrainAt: lastDrainAt, drained: false };
  }
  if (health <= 0) {
    return { health: 0, lastDrainAt: lastDrainAt, drained: false };
  }
  if (!lastDrainAt) {
    return { health: health, lastDrainAt: now, drained: false };
  }
  const elapsed = now - lastDrainAt;
  if (elapsed < PLAYER_HEALTH_DRAIN_INTERVAL_MS) {
    return { health: health, lastDrainAt: lastDrainAt, drained: false };
  }
  const ticks = Math.floor(elapsed / PLAYER_HEALTH_DRAIN_INTERVAL_MS);
  const nextHealth = clampPlayerHealth(health - ticks);
  return {
    health: nextHealth,
    lastDrainAt: lastDrainAt + ticks * PLAYER_HEALTH_DRAIN_INTERVAL_MS,
    drained: nextHealth < health
  };
}
