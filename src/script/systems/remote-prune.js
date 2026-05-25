/** Systems — 오래된 원격 플레이어 정리. */
export function createModule(d) {
  function pruneStaleRemotePlayers() { return d._systemsApi.pruneStaleRemotePlayers(); }

  }

  function updateRemotePlayerCount() { return d._systemsApi.updateRemotePlayerCount(); }

  }

  return {
    pruneStaleRemotePlayers,
    updateRemotePlayerCount,
  };
}
