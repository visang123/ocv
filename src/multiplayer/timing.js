export const MULTIPLAYER_BROADCAST_MIN_MS = 120;
export const MULTIPLAYER_HEARTBEAT_MS = 900;
export const MULTIPLAYER_PRESENCE_DB_SYNC_MS = 1800;
export const MULTIPLAYER_PRESENCE_DB_POLL_MS = 1800;
export const MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE = 350;
export const MULTIPLAYER_WORLD_POLL_MIN_MS_BASE = 350;

/**
 * 동시 접속 ~20명 전제: 월드 폴링·저장·Presence·브로드캐스트 간격을
 * 활성 원격 세션 수에 맞춰 늘려 DB/Realtime 부하를 줄인다.
 * (같은 계정 다중 탭은 원격으로 안 잡힐 수 있음 → 실측 권장)
 */

export function countActiveRemotePlayers(remotePlayers, now) {
  let n = 0;
  Object.keys(remotePlayers || {}).forEach(function (remoteId) {
    const remote = remotePlayers[remoteId];
    if (!remote) return;
    if (remote.lastSeenAt && now - remote.lastSeenAt > 30000) return;
    n += 1;
  });
  return n;
}

export function getAdaptiveWorldPollMinMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 1200;
  if (n >= 15) return 1000;
  if (n >= 10) return 800;
  if (n >= 6) return 600;
  if (n >= 3) return 450;
  return MULTIPLAYER_WORLD_POLL_MIN_MS_BASE;
}

export function getAdaptiveWorldSyncLoopMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 1200;
  if (n >= 15) return 1000;
  if (n >= 10) return 800;
  if (n >= 6) return 600;
  if (n >= 3) return 450;
  return MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE;
}

export function getAdaptivePresenceDbSyncMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 5000;
  if (n >= 15) return 4400;
  if (n >= 12) return 3800;
  if (n >= 8) return 3000;
  if (n >= 5) return 2400;
  return MULTIPLAYER_PRESENCE_DB_SYNC_MS;
}

export function getAdaptivePresenceDbPollMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 6000;
  if (n >= 15) return 5200;
  if (n >= 12) return 4400;
  if (n >= 8) return 3600;
  if (n >= 5) return 2600;
  return MULTIPLAYER_PRESENCE_DB_POLL_MS;
}

/** 인원 많을수록 player_state 브로드캐스트 최소 간격을 약간 늘림 */
export function getAdaptiveBroadcastMinMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 220;
  if (n >= 12) return 190;
  if (n >= 8) return 160;
  return MULTIPLAYER_BROADCAST_MIN_MS;
}

export function getAdaptiveHeartbeatMs(activeRemotePlayerCount) {
  const n = Math.max(0, Number(activeRemotePlayerCount) || 0);
  if (n >= 18) return 1800;
  if (n >= 12) return 1500;
  if (n >= 8) return 1200;
  return MULTIPLAYER_HEARTBEAT_MS;
}
