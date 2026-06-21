/** 월드 돌 협력 채굴 — 인원 수에 비례한 속도·누적 작업량 */

import { WORLD_ROCK_MINE_MS } from "./constants.js";

export { WORLD_ROCK_MINE_MS };

export function ensureRockMiningState(rock) {
  if (!rock) return;
  if (!Number.isFinite(Number(rock.miningWorkMs))) rock.miningWorkMs = 0;
  if (!Number.isFinite(Number(rock.miningLastAdvanceAt))) rock.miningLastAdvanceAt = 0;
}

export function resetRockMiningState(rock) {
  if (!rock) return;
  rock.miningWorkMs = 0;
  rock.miningLastAdvanceAt = 0;
}

/**
 * @param {string} rockId
 * @param {{ getLocalRockMining?: () => { rockId: string } | null, remotePlayers?: Record<string, { rockMiningRockId?: string }> }} ctx
 */
export function countActiveRockMinersForRock(rockId, ctx) {
  const id = String(rockId || "");
  if (!id) return 0;
  let count = 0;
  const local =
    ctx && typeof ctx.getLocalRockMining === "function" ? ctx.getLocalRockMining() : null;
  if (local && String(local.rockId || "") === id) count += 1;
  const remotePlayers =
    ctx && ctx.remotePlayers && typeof ctx.remotePlayers === "object" ? ctx.remotePlayers : {};
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const rp = remotePlayers[remoteId];
    if (!rp) return;
    if (String(rp.rockMiningRockId || "") === id) count += 1;
  });
  return count;
}

export function initRockMiningOnJoin(rock, nowMs) {
  ensureRockMiningState(rock);
  const now = Number(nowMs) || Date.now();
  if (!Number(rock.miningLastAdvanceAt)) {
    rock.miningLastAdvanceAt = now;
  }
}

/**
 * @returns {{ completed: boolean, progress: number, advanced: boolean }}
 */
export function advanceRockMiningWork(rock, minerCount, nowMs, totalWorkMs) {
  const totalMs = Math.max(1, Number(totalWorkMs) || WORLD_ROCK_MINE_MS);
  const miners = Math.max(0, Math.floor(Number(minerCount) || 0));
  if (!rock || miners <= 0) {
    return {
      completed: (Number(rock && rock.miningWorkMs) || 0) >= totalMs,
      progress: Math.min(1, (Number(rock && rock.miningWorkMs) || 0) / totalMs),
      advanced: false
    };
  }
  ensureRockMiningState(rock);
  const now = Number(nowMs) || Date.now();
  let lastAt = Number(rock.miningLastAdvanceAt) || 0;
  if (!lastAt) {
    lastAt = now;
    rock.miningLastAdvanceAt = now;
  }
  const delta = Math.max(0, now - lastAt);
  let advanced = false;
  if (delta > 0) {
    rock.miningWorkMs = (Number(rock.miningWorkMs) || 0) + delta * miners;
    rock.miningLastAdvanceAt = now;
    advanced = true;
  }
  const work = Number(rock.miningWorkMs) || 0;
  return {
    completed: work >= totalMs,
    progress: Math.min(1, work / totalMs),
    advanced: advanced
  };
}

export function getRockMiningGaugeProgress(rock, minerCount, nowMs, totalWorkMs) {
  const totalMs = Math.max(1, Number(totalWorkMs) || WORLD_ROCK_MINE_MS);
  const miners = Math.max(0, Math.floor(Number(minerCount) || 0));
  if (!rock) return 0;
  ensureRockMiningState(rock);
  const now = Number(nowMs) || Date.now();
  let work = Number(rock.miningWorkMs) || 0;
  if (miners > 0) {
    const lastAt = Number(rock.miningLastAdvanceAt) || now;
    work += Math.max(0, now - lastAt) * miners;
  }
  return Math.min(1, work / totalMs);
}

export function mergeRockMiningFieldsFromSnapshot(rock, incoming) {
  if (!rock || !incoming) return;
  ensureRockMiningState(rock);
  const localWork = Number(rock.miningWorkMs) || 0;
  const remoteWork = Number(incoming.miningWorkMs) || 0;
  if (remoteWork > localWork) {
    rock.miningWorkMs = remoteWork;
    const remoteLast = Number(incoming.miningLastAdvanceAt) || 0;
    if (remoteLast > 0) {
      rock.miningLastAdvanceAt = remoteLast;
    }
  }
}

export function serializeRockMiningFields(rock) {
  if (!rock) return {};
  ensureRockMiningState(rock);
  return {
    miningWorkMs: Math.max(0, Math.floor(Number(rock.miningWorkMs) || 0)),
    miningLastAdvanceAt: Math.max(0, Math.floor(Number(rock.miningLastAdvanceAt) || 0))
  };
}
