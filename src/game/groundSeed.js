/**
 * Ground / hub 씨앗 정책 (튜토 vs 월드 허브)
 *
 * Tutorial (tutorial.html, 또는 index에서 온보딩 미완료)
 * - 화면의 땅 씨앗은 `#seed` 한 개(SEED_START).
 * - 줍기 → createStarterSeedInventoryItem() → extraSeeds 스타터 슬롯(인벤 리스트).
 *
 * World hub (index + 온보딩 완료)
 * - 땅의 `#seed`는 숨김. 공유 슬롯은 appleState.worldLooseSeed 한 개뿐.
 * - 좌표는 constants의 WORLD_LOOSE_SEED_* (= SEED_START와 동일하게 유지할 것).
 * - 줍기 → seedCount만 증가, nextSpawnAt으로 리스폰. extraSeeds 인벤 슬롯 없음.
 *
 * 같은 월드 좌표에서 위 두 줍기 경로가 동시에 살아 있으면 안 됨 → script의
 * pickUpNearestItem에서 모드별로 분기할 것.
 */

import {
  WORLD_LOOSE_SEED_ID,
  WORLD_LOOSE_SEED_RESPAWN_MS,
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y
} from "./constants.js";

/** 저장·멀티 스냅샷이 허브 좌표에서 벗어났을 때 되돌림 (월드 px) */
export const WORLD_LOOSE_SEED_ANCHOR_TOLERANCE_PX = 55;

export function createDefaultWorldLooseSeedRecord() {
  return {
    x: WORLD_LOOSE_SEED_X,
    y: WORLD_LOOSE_SEED_Y,
    nextSpawnAt: 0
  };
}

/**
 * worldLooseSeed 객체의 x/y/nextSpawnAt을 정규화하고 허브에 스냅.
 * @returns {boolean} 필드가 바뀌었으면 true
 */
export function normalizeWorldLooseSeedRecord(worldLooseSeed) {
  if (!worldLooseSeed || typeof worldLooseSeed !== "object") {
    return false;
  }
  let changed = false;
  const w = worldLooseSeed;
  const def = createDefaultWorldLooseSeedRecord();

  if (!Number.isFinite(Number(w.x))) {
    w.x = def.x;
    changed = true;
  }
  if (!Number.isFinite(Number(w.y))) {
    w.y = def.y;
    changed = true;
  }
  const prevNext = Number(w.nextSpawnAt);
  const nextSpawnAt = Math.max(0, Number.isFinite(prevNext) ? prevNext : 0);
  if (Number(w.nextSpawnAt) !== nextSpawnAt) {
    w.nextSpawnAt = nextSpawnAt;
    changed = true;
  }

  const tol = WORLD_LOOSE_SEED_ANCHOR_TOLERANCE_PX;
  const dx = Number(w.x) - WORLD_LOOSE_SEED_X;
  const dy = Number(w.y) - WORLD_LOOSE_SEED_Y;
  if (dx * dx + dy * dy > tol * tol) {
    w.x = WORLD_LOOSE_SEED_X;
    w.y = WORLD_LOOSE_SEED_Y;
    changed = true;
  }
  return changed;
}

export function isWorldLooseSpawnReady(nowMs, nextSpawnAt) {
  return nowMs >= (Number(nextSpawnAt) || 0);
}

export function scheduleWorldLooseRespawnAfterPickup(worldLooseSeed, nowMs) {
  worldLooseSeed.nextSpawnAt = nowMs + WORLD_LOOSE_SEED_RESPAWN_MS;
}

/**
 * 멀티 스냅샷/브로드캐스트로 nextSpawnAt은 리스폰됐는데 pickup lock만 남아
 * 씨앗이 보이지만 E로 못 줍는 경우를 정리한다.
 */
export function reconcileWorldLoosePickupLock(worldLooseSeed, lockUntilMs, nowMs) {
  const nextSpawnAt = Math.max(0, Number(worldLooseSeed && worldLooseSeed.nextSpawnAt) || 0);
  const lockUntil = Math.max(0, Number(lockUntilMs) || 0);
  if (nowMs >= nextSpawnAt && lockUntil > nowMs) {
    return nextSpawnAt;
  }
  return lockUntil;
}

export function canPickWorldLooseSeedAt(worldLooseSeed, lockUntilMs, nowMs) {
  if (!isWorldLooseSpawnReady(nowMs, worldLooseSeed && worldLooseSeed.nextSpawnAt)) {
    return false;
  }
  const lockUntil = reconcileWorldLoosePickupLock(worldLooseSeed, lockUntilMs, nowMs);
  return nowMs >= lockUntil;
}

/** getNearestPickableExtraSeed 등에서 쓰는 합성 후보(worldLoosePick) 판별 */
export function isWorldLooseSyntheticPickupCandidate(seedLike) {
  if (!seedLike || typeof seedLike !== "object") return false;
  return Boolean(
    seedLike.worldLoosePick || String(seedLike.id) === String(WORLD_LOOSE_SEED_ID)
  );
}
