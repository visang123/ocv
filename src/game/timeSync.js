export function getSynchronizedNow(offsetMs) {
  return Date.now() + Number(offsetMs || 0);
}

export function syncServerClockOffset(prevOffsetMs, prevSyncAtMs, serverRowUpdatedAt, localNowMs) {
  if (serverRowUpdatedAt == null || serverRowUpdatedAt === "") {
    return {
      offsetMs: Number(prevOffsetMs || 0),
      syncedAtMs: Number(prevSyncAtMs || 0),
      changed: false
    };
  }
  const parsed =
    typeof serverRowUpdatedAt === "string"
      ? Date.parse(serverRowUpdatedAt)
      : Number(serverRowUpdatedAt);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return {
      offsetMs: Number(prevOffsetMs || 0),
      syncedAtMs: Number(prevSyncAtMs || 0),
      changed: false
    };
  }
  const localNow = Number.isFinite(Number(localNowMs)) ? Number(localNowMs) : Date.now();
  const sample = parsed - localNow;
  const maxSkew = 2 * 60 * 1000;
  const clamped = Math.max(-maxSkew, Math.min(maxSkew, sample));
  const prevSyncedAt = Number(prevSyncAtMs || 0);
  const nextOffset =
    !Number.isFinite(prevSyncedAt) || prevSyncedAt <= 0
      ? clamped
      : Number(prevOffsetMs || 0) * 0.8 + clamped * 0.2;
  return {
    offsetMs: nextOffset,
    syncedAtMs: localNow,
    changed: true
  };
}
