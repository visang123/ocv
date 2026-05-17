/** Player health drain, recharge, and placement helpers. */

import { PLAYER_SIT_VISUAL_LIFT_Y } from "./constants.js";
import {
  getCraftChairSeatWorldPoint,
  getCraftChairSitAnchorOffsets,
  getCraftHouseTouchRect
} from "./craft-furniture-world.js";

export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_APPLE_HEAL_AMOUNT = 15;
export const PLAYER_HEALTH_DRAIN_INTERVAL_MS = 10000;
export const PLAYER_HEALTH_DRAIN_AMOUNT = 5;
export const PLAYER_HEALTH_RECHARGE_IDLE_WARMUP_MS = 5000;
export const PLAYER_HEALTH_RECHARGE_MS = 1000;
export const PLAYER_HEALTH_RECHARGE_DEFAULT_PER_SEC = 1;
export const PLAYER_HEALTH_RECHARGE_CHAIR_PER_SEC = 2;
export const PLAYER_HEALTH_RECHARGE_HOME_PER_SEC = 4;
export const PLAYER_CHAIR_INTERACT_DISTANCE = 42;
export const PLAYER_CRAFT_HOUSE_INTERACT_DISTANCE = 52;
const POSITION_IDLE_EPSILON = 0.05;

const MOVEMENT_KEY_NAMES = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "d", "w", "s"];

export function clampPlayerHealth(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return PLAYER_MAX_HEALTH;
  return Math.max(0, Math.min(PLAYER_MAX_HEALTH, n));
}

export function healPlayerHealth(currentHealth, amount) {
  const heal = Math.max(0, Math.floor(Number(amount)) || 0);
  return clampPlayerHealth(clampPlayerHealth(currentHealth) + heal);
}

/** 체력 0 — 충전 모드, 이동·행동 불가 */
export function isPlayerHealthDepleted(health) {
  return clampPlayerHealth(health) <= 0;
}

/** 체력 1 이상이면 이동·행동 가능 */
export function canPlayerMoveByHealth(health) {
  return clampPlayerHealth(health) >= 1;
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

export function isPlayerEnteredCraftHouse(opts) {
  return Boolean(opts && opts.isInsideEnteredCraftHouse);
}

export function isPlayerIdleForHealth(opts) {
  if (!opts || !opts.hasSpawnedCharacter || opts.isCharacterSelecting) return false;
  if (isPlayerEnteredCraftHouse(opts)) return true;
  if (opts.isSittingOnChair) return false;
  if (opts.isPlanting || opts.isEating) return false;
  if (opts.isGameplayBlockedByNpcDialogue) return false;
  if (isPlayerMovementKeyActive(opts.keys)) return false;
  if (!isPlayerPoseUnchanged(opts.previousPose, opts.currentPose)) return false;
  const jumpY = Number(opts.currentPose && opts.currentPose.jumpY) || 0;
  if (Math.abs(jumpY) > POSITION_IDLE_EPSILON) {
    if (Math.abs(Number(opts.velocityY) || 0) > POSITION_IDLE_EPSILON) return false;
  }
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

function worldRectsOverlapSimple(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function rectOverlapArea(a, b) {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (w <= 0 || h <= 0) return 0;
  return w * h;
}

function getCraftHousePlayerFeetTouchRect(playerX, footY, playerWidth) {
  const px = Number(playerX);
  const fy = Number(footY);
  const pw = Number(playerWidth) || 25;
  const feetInsetX = 6;
  const feetH = 6;
  return {
    left: px + feetInsetX,
    right: px + pw - feetInsetX,
    top: fy - feetH,
    bottom: fy
  };
}

/** 집 문 앞 발판과 플레이어 발이 겹칠 때만 입장 가능 */
export function findCraftHousePlayerIsTouching(
  playerX,
  footY,
  playerWidth,
  _playerHeight,
  placedFurniture
) {
  if (!Array.isArray(placedFurniture) || placedFurniture.length === 0) return null;
  const px = Number(playerX);
  const fy = Number(footY);
  if (!Number.isFinite(px) || !Number.isFinite(fy)) return null;
  const playerRect = getCraftHousePlayerFeetTouchRect(playerX, footY, playerWidth);
  let best = null;
  let bestOverlap = 0;
  for (let i = 0; i < placedFurniture.length; i++) {
    const entry = placedFurniture[i];
    if (!entry || entry.kind !== "craftHouse") continue;
    const houseRect = getCraftHouseTouchRect(entry);
    if (!houseRect) continue;
    if (!worldRectsOverlapSimple(playerRect, houseRect)) continue;
    const overlap = rectOverlapArea(playerRect, houseRect);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = entry;
    }
  }
  return best;
}

export function findNearestCraftChair(footCenterX, footY, placedFurniture, maxDistance, opts) {
  if (!Array.isArray(placedFurniture) || placedFurniture.length === 0) return null;
  const limit = Number.isFinite(Number(maxDistance)) ? Number(maxDistance) : PLAYER_CHAIR_INTERACT_DISTANCE;
  const isChairSelectable =
    opts && typeof opts.isChairSelectable === "function" ? opts.isChairSelectable : null;
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < placedFurniture.length; i++) {
    const entry = placedFurniture[i];
    if (!entry || entry.kind !== "craftChair") continue;
    if (isChairSelectable && !isChairSelectable(entry)) continue;
    const seat = getCraftChairSeatWorldPoint(entry);
    if (!seat) continue;
    const dx = Number(footCenterX) - seat.x;
    const dy = Number(footY) - seat.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < bestDist && dist <= limit) {
      bestDist = dist;
      best = entry;
    }
  }
  return best;
}

export function getCraftChairSitPose(chair, playerWidth, playerSitHeight) {
  if (!chair) return null;
  const width = Number(playerWidth) || 25;
  const sitHeight = Number(playerSitHeight) || 33;
  const offsets = getCraftChairSitAnchorOffsets(chair);
  const seat = getCraftChairSeatWorldPoint(chair);
  if (!seat) return null;
  const footY = Number(chair.y) + offsets.footOffsetY - PLAYER_SIT_VISUAL_LIFT_Y;
  return {
    playerX: seat.x - width / 2,
    playerDepth: null,
    footY: footY,
    seatY: seat.y,
    renderHeight: sitHeight,
    chairId: String(chair.id || "")
  };
}

export function getPlayerHealthRechargePerSecond(opts) {
  if (!opts) return PLAYER_HEALTH_RECHARGE_DEFAULT_PER_SEC;
  if (isPlayerEnteredCraftHouse(opts)) {
    return PLAYER_HEALTH_RECHARGE_HOME_PER_SEC;
  }
  if (isPlayerInsideCraftHouse(opts.footCenterX, opts.footY, opts.placedCraftFurniture)) {
    return PLAYER_HEALTH_RECHARGE_HOME_PER_SEC;
  }
  if (opts.isSittingOnChair) return PLAYER_HEALTH_RECHARGE_CHAIR_PER_SEC;
  return PLAYER_HEALTH_RECHARGE_DEFAULT_PER_SEC;
}

/** 가만히 서서 초당 +1 회복일 때만 5초 준비 시간 */
export function needsIdleRechargeWarmup(health, rechargeCtx) {
  if (isPlayerHealthDepleted(health)) return false;
  return getPlayerHealthRechargePerSecond(rechargeCtx) === PLAYER_HEALTH_RECHARGE_DEFAULT_PER_SEC;
}

export function shouldDrainPlayerHealth(opts) {
  if (!opts || !opts.hasSpawnedCharacter || opts.isCharacterSelecting) return false;
  if (opts.isTabSessionSuperseded) return false;
  if (isPlayerHealthDepleted(opts.health)) return false;
  if (isPlayerIdleForHealth(opts)) return false;
  if (opts.isSittingOnChair) return false;
  if (isPlayerEnteredCraftHouse(opts)) return false;
  if (isPlayerInsideCraftHouse(opts.footCenterX, opts.footY, opts.placedCraftFurniture)) {
    return false;
  }
  return true;
}

/** 체력이 최대가 아니고, 정지·의자·집 안일 때 초당 회복 */
export function shouldRechargePlayerHealth(health, shouldDrain) {
  if (clampPlayerHealth(health) >= PLAYER_MAX_HEALTH) return false;
  if (isPlayerHealthDepleted(health)) return true;
  return !shouldDrain;
}

/**
 * @returns {{
 *   health: number,
 *   lastTickAt: number,
 *   idleRechargeSince?: number,
 *   idleRechargeHealTicks?: number,
 *   changed: boolean,
 *   depleted: boolean,
 *   resetTickOnDeplete?: boolean
 * }}
 */
export function tickPlayerHealthState(state, nowMs) {
  const health = clampPlayerHealth(state.health);
  const now = Number(nowMs) || Date.now();
  let lastTickAt = Number(state.lastTickAt) || 0;
  let idleRechargeSince = Number(state.idleRechargeSince) || 0;
  let idleRechargeHealTicks = Number(state.idleRechargeHealTicks) || 0;
  const rechargeCtx = state.rechargeContext || {};
  const shouldDrain = Boolean(state.shouldDrain);
  const wasDraining = Boolean(state.wasDraining);
  const clearIdleRecharge = { idleRechargeSince: 0, idleRechargeHealTicks: 0 };

  // 정지(소모 없음) ↔ 이동(소모) 전환 시 경과 시간을 이월하지 않음 — 멈춘 뒤 움직일 때 체력이 한꺼번에 빠지는 버그 방지
  if (shouldDrain !== wasDraining) {
    lastTickAt = now;
    idleRechargeSince = 0;
    idleRechargeHealTicks = 0;
  }

  if (shouldRechargePlayerHealth(health, shouldDrain)) {
    const rate = getPlayerHealthRechargePerSecond(rechargeCtx);
    const useWarmup = needsIdleRechargeWarmup(health, rechargeCtx);
    if (useWarmup) {
      if (Boolean(state.wasDraining)) {
        idleRechargeSince = 0;
        idleRechargeHealTicks = 0;
      }
      if (!idleRechargeSince) {
        return {
          health: health,
          lastTickAt: now,
          idleRechargeSince: now,
          idleRechargeHealTicks: 0,
          changed: false,
          depleted: isPlayerHealthDepleted(health)
        };
      }
      const elapsed = now - idleRechargeSince;
      if (elapsed < PLAYER_HEALTH_RECHARGE_IDLE_WARMUP_MS) {
        return {
          health: health,
          lastTickAt: lastTickAt,
          idleRechargeSince: idleRechargeSince,
          idleRechargeHealTicks: idleRechargeHealTicks,
          changed: false,
          depleted: isPlayerHealthDepleted(health)
        };
      }
      const healElapsed = elapsed - PLAYER_HEALTH_RECHARGE_IDLE_WARMUP_MS;
      const totalHealTicks = Math.floor(healElapsed / PLAYER_HEALTH_RECHARGE_MS);
      const deltaTicks = totalHealTicks - idleRechargeHealTicks;
      if (deltaTicks < 1) {
        return {
          health: health,
          lastTickAt: lastTickAt,
          idleRechargeSince: idleRechargeSince,
          idleRechargeHealTicks: idleRechargeHealTicks,
          changed: false,
          depleted: isPlayerHealthDepleted(health)
        };
      }
      const nextHealth = clampPlayerHealth(health + deltaTicks * rate);
      return {
        health: nextHealth,
        lastTickAt: lastTickAt,
        idleRechargeSince: idleRechargeSince,
        idleRechargeHealTicks: totalHealTicks,
        changed: nextHealth !== health,
        depleted: isPlayerHealthDepleted(nextHealth)
      };
    }
    idleRechargeSince = 0;
    idleRechargeHealTicks = 0;
    if (!lastTickAt) {
      return {
        health: health,
        lastTickAt: now,
        ...clearIdleRecharge,
        changed: false,
        depleted: isPlayerHealthDepleted(health)
      };
    }
    const elapsed = now - lastTickAt;
    if (elapsed < PLAYER_HEALTH_RECHARGE_MS) {
      return {
        health: health,
        lastTickAt: lastTickAt,
        ...clearIdleRecharge,
        changed: false,
        depleted: isPlayerHealthDepleted(health)
      };
    }
    const ticks = Math.floor(elapsed / PLAYER_HEALTH_RECHARGE_MS);
    const nextHealth = clampPlayerHealth(health + ticks * rate);
    return {
      health: nextHealth,
      lastTickAt: lastTickAt + ticks * PLAYER_HEALTH_RECHARGE_MS,
      ...clearIdleRecharge,
      changed: nextHealth !== health,
      depleted: isPlayerHealthDepleted(nextHealth)
    };
  }

  if (!shouldDrain) {
    return {
      health: health,
      lastTickAt: lastTickAt,
      ...clearIdleRecharge,
      changed: false,
      depleted: false
    };
  }
  idleRechargeSince = 0;
  idleRechargeHealTicks = 0;
  if (!lastTickAt) {
    return {
      health: health,
      lastTickAt: now,
      ...clearIdleRecharge,
      changed: false,
      depleted: false
    };
  }
  const elapsed = now - lastTickAt;
  if (elapsed < PLAYER_HEALTH_DRAIN_INTERVAL_MS) {
    return {
      health: health,
      lastTickAt: lastTickAt,
      ...clearIdleRecharge,
      changed: false,
      depleted: false
    };
  }
  const ticks = Math.floor(elapsed / PLAYER_HEALTH_DRAIN_INTERVAL_MS);
  const nextHealth = clampPlayerHealth(health - ticks * PLAYER_HEALTH_DRAIN_AMOUNT);
  const becameDepleted = isPlayerHealthDepleted(nextHealth) && !isPlayerHealthDepleted(health);
  return {
    health: nextHealth,
    lastTickAt: becameDepleted ? now : lastTickAt + ticks * PLAYER_HEALTH_DRAIN_INTERVAL_MS,
    ...clearIdleRecharge,
    changed: nextHealth !== health,
    depleted: isPlayerHealthDepleted(nextHealth),
    resetTickOnDeplete: becameDepleted
  };
}

/** @deprecated use tickPlayerHealthState */
export function tickPlayerHealthDrain(state, nowMs) {
  const r = tickPlayerHealthState(
    {
      health: state.health,
      lastTickAt: state.lastDrainAt,
      shouldDrain: state.shouldDrain,
      rechargeContext: {}
    },
    nowMs
  );
  return {
    health: r.health,
    lastDrainAt: r.lastTickAt,
    drained: r.changed && r.health < clampPlayerHealth(state.health)
  };
}
