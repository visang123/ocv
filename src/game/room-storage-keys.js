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
