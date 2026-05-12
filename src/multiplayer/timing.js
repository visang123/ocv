export const MULTIPLAYER_BROADCAST_MIN_MS = 80;
export const MULTIPLAYER_HEARTBEAT_MS = 500;
export const MULTIPLAYER_PRESENCE_DB_SYNC_MS = 1200;
export const MULTIPLAYER_PRESENCE_DB_POLL_MS = 1200;
export const MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE = 150;
export const MULTIPLAYER_WORLD_POLL_MIN_MS_BASE = 150;

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
  if (activeRemotePlayerCount >= 10) return 280;
  if (activeRemotePlayerCount >= 6) return 220;
  if (activeRemotePlayerCount >= 3) return 180;
  return MULTIPLAYER_WORLD_POLL_MIN_MS_BASE;
}

export function getAdaptiveWorldSyncLoopMs(activeRemotePlayerCount) {
  if (activeRemotePlayerCount >= 10) return 280;
  if (activeRemotePlayerCount >= 6) return 220;
  if (activeRemotePlayerCount >= 3) return 180;
  return MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE;
}

export function getAdaptivePresenceDbSyncMs(activeRemotePlayerCount) {
  if (activeRemotePlayerCount >= 12) return 2400;
  if (activeRemotePlayerCount >= 8) return 2000;
  if (activeRemotePlayerCount >= 5) return 1600;
  return MULTIPLAYER_PRESENCE_DB_SYNC_MS;
}

export function getAdaptivePresenceDbPollMs(activeRemotePlayerCount) {
  if (activeRemotePlayerCount >= 12) return 2800;
  if (activeRemotePlayerCount >= 8) return 2400;
  if (activeRemotePlayerCount >= 5) return 1900;
  return MULTIPLAYER_PRESENCE_DB_POLL_MS;
}
