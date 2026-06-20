import {
  getCraftFurnitureInstallStatusText,
  parseCraftFurnitureInstallPresenceAction
} from "../game/craft-furniture-world.js";

export function shouldApplyIncomingRemoteState(current, incoming) {
  const currentVersion = Math.max(0, Number(current && current.version) || 0);
  const currentRank = Math.max(0, Number(current && current.rank) || 0);
  const incomingVersion = Math.max(0, Number(incoming && incoming.version) || 0);
  const incomingRank = Math.max(0, Number(incoming && incoming.rank) || 0);

  if (incomingVersion <= 0) return true;
  if (incomingVersion < currentVersion) return false;
  if (incomingVersion === currentVersion && incomingRank < currentRank) return false;
  return true;
}

export function getRemotePlayerIdentityKey(playerOrState) {
  if (!playerOrState) return "";
  const userId =
    playerOrState.userId != null ? String(playerOrState.userId).trim() : "";
  if (userId) return "user:" + userId;
  const name = playerOrState.name != null ? String(playerOrState.name).trim() : "";
  if (name) return "name:" + name;
  const id = playerOrState.id != null ? String(playerOrState.id) : "";
  return id ? "session:" + id : "";
}

export function getRemotePlayerActivityAt(playerOrState) {
  if (!playerOrState) return 0;
  const updatedAt =
    Number(playerOrState.updatedAt || playerOrState.lastStateVersion) || 0;
  const lastSeenAt = Number(playerOrState.lastSeenAt) || 0;
  return Math.max(updatedAt, lastSeenAt);
}

/** One visible avatar per account/name; drop older sessions after reconnect. */
export function pruneDuplicateRemotePlayerSessions(remotePlayers, removeFn) {
  if (!remotePlayers || typeof removeFn !== "function") return;
  const winnerByIdentity = Object.create(null);

  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer) return;
    const identityKey = getRemotePlayerIdentityKey({
      userId: remotePlayer.userId,
      name: remotePlayer.name,
      id: remoteId
    });
    if (
      identityKey.indexOf("user:") !== 0 &&
      identityKey.indexOf("name:") !== 0
    ) {
      return;
    }
    const activityAt = getRemotePlayerActivityAt(remotePlayer);
    const prev = winnerByIdentity[identityKey];
    if (
      !prev ||
      activityAt > prev.activityAt ||
      (activityAt === prev.activityAt && remoteId > prev.remoteId)
    ) {
      winnerByIdentity[identityKey] = { remoteId: remoteId, activityAt: activityAt };
    }
  });

  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer) return;
    const identityKey = getRemotePlayerIdentityKey({
      userId: remotePlayer.userId,
      name: remotePlayer.name,
      id: remoteId
    });
    const winner = winnerByIdentity[identityKey];
    if (winner && winner.remoteId !== remoteId) {
      removeFn(remoteId);
    }
  });
}

export function getRemoteStatusText(action) {
  if (action === "magic_powder") return "마법의 가루 생성 중...";
  if (action === "planting") return "씨앗 심는중...";
  if (action === "eating") return "사과먹는중...";
  if (action === "butterfly_catch") return "나비 catch";
  if (action === "rock_pickup") return "돌 수집";
  if (action === "rock_mining") return "돌 캐는중...";
  const installKind = parseCraftFurnitureInstallPresenceAction(action);
  if (installKind) {
    const installText = getCraftFurnitureInstallStatusText(installKind);
    if (installText) return installText;
  }
  if (action === "craft_install") return "\uAC00\uAD6C \uC124\uCE58\uC911...";
  return "";
}
