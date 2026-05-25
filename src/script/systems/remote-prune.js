/** Systems — 오래된 원격 플레이어 정리·멀티 인원 HUD. */
export function createModule(d) {
  function pruneStaleRemotePlayers() {
    const now = Date.now();
    Object.keys(d.remotePlayers).forEach(function (remoteId) {
      const remotePlayer = d.remotePlayers[remoteId];
      if (!remotePlayer || !remotePlayer.lastSeenAt) return;
      if (now - remotePlayer.lastSeenAt < 90000) return;
      if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
        window.OVC_SHARED_BUCKET_HELD_BY = "";
        d.markWorldDirty();
      }
      d.removeRemotePlayer(remoteId);
    });
  }

  function updateRemotePlayerCount() {
    d.pruneDuplicateRemotePlayerSessions(d.remotePlayers, d.removeRemotePlayer);
    const seenUsers = Object.create(null);
    d.remotePlayerCount = Object.keys(d.remotePlayers).reduce(function (count, remoteId) {
      const remotePlayer = d.remotePlayers[remoteId];
      if (!remotePlayer) return count;
      const userKey = d.getRemotePlayerIdentityKey({
        userId: remotePlayer.userId,
        name: remotePlayer.name,
        id: remoteId
      });
      if (seenUsers[userKey]) return count;
      seenUsers[userKey] = true;
      return count + 1;
    }, 0);
    d.updateMultiplayerStatus(d.multiplayerStatusText);
  }

  return {
    pruneStaleRemotePlayers,
    updateRemotePlayerCount
  };
}
