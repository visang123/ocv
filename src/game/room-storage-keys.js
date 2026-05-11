export function getMultiplayerRoomSlug() {
  const room = window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom;
  return room ? String(room).replace(/[^\w\-]+/g, "_") : "offline";
}

export function storageKeyMainSeedPickedForRoom() {
  return "mainSeedPickedRoomV1:" + getMultiplayerRoomSlug();
}

export function storageKeyGuideBookPickedForRoom() {
  return "guideBookPickedRoomV1:" + getMultiplayerRoomSlug();
}

/** 월드 바닥 가방을 E로 줍기 완료했는지(가이드 소지 여부와 별도). */
export function storageKeyWorldBagGroundPickedForRoom() {
  return "worldBagGroundPickedRoomV1:" + getMultiplayerRoomSlug();
}
