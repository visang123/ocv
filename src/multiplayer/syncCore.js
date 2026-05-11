export function makeSyncEventId(sessionId, kind, entityId, atMs) {
  return [
    String(kind || "evt"),
    String(sessionId || "local"),
    String(entityId || "na"),
    String(Math.max(0, Number(atMs) || Date.now())).slice(-8),
    Math.random().toString(36).slice(2, 8)
  ].join(":");
}

export function getRemoteStateVersion(state) {
  if (!state || typeof state !== "object") return 0;
  const updatedAt = Number(state.updatedAt || 0);
  const splashAt = Number(state.waterSplashAt || 0);
  return Math.max(0, updatedAt, splashAt);
}

export function getRemoteStateSourceRank(source) {
  if (source === "broadcast") return 3;
  if (source === "presence") return 2;
  return 1;
}

export function isValidRemotePlayerStatePayload(state) {
  if (!state || !state.id) return false;
  const x = Number(state.x);
  const depth = Number(state.depth);
  const jumpY = Number(state.jumpY);
  if ((state.x != null && !Number.isFinite(x)) || (state.depth != null && !Number.isFinite(depth))) {
    return false;
  }
  if (state.jumpY != null && !Number.isFinite(jumpY)) return false;
  return true;
}

export function createSyncEventDedupeStore(options) {
  const ttlMs = Math.max(1, Number(options && options.ttlMs) || 120000);
  const maxEntries = Math.max(16, Number(options && options.maxEntries) || 4000);
  const onAccept = options && typeof options.onAccept === "function" ? options.onAccept : null;
  const onReject = options && typeof options.onReject === "function" ? options.onReject : null;
  let seenAtById = Object.create(null);

  function consume(eventId, nowMs) {
    if (!eventId) return true;
    const now = Math.max(0, Number(nowMs) || Date.now());
    const id = String(eventId);
    const seenAt = Number(seenAtById[id] || 0);
    if (seenAt > 0 && now - seenAt <= ttlMs) {
      if (onReject) onReject({ eventId: id, now: now, seenAt: seenAt, ageMs: now - seenAt });
      return false;
    }
    seenAtById[id] = now;
    const ids = Object.keys(seenAtById);
    if (ids.length > maxEntries) {
      ids.forEach(function (k) {
        const t = Number(seenAtById[k] || 0);
        if (!t || now - t > ttlMs) delete seenAtById[k];
      });
    }
    if (onAccept) onAccept({ eventId: id, now: now });
    return true;
  }

  function clear() {
    seenAtById = Object.create(null);
  }

  return {
    consume: consume,
    clear: clear
  };
}
