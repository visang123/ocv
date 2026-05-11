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

export function getRemoteStatusText(action) {
  if (action === "magic_powder") return "마법의 가루 생성 중...";
  if (action === "planting") return "씨앗 심는중...";
  if (action === "eating") return "사과먹는중...";
  if (action === "butterfly_catch") return "나비 잡음";
  return "";
}
