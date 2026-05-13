export function getMultiplayerRoomSlug() {
  const room = window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom;
  return room ? String(room).replace(/[^\w\-]+/g, "_") : "offline";
}

/**
 * 방 문자열이 잠깐 비었을 때 `offline` vs 실제 방 키가 갈라져 가방/책이 다시 생기는 것을 막기 위해,
 * 읽기·쓰기·삭제 시 함께 볼 슬러그 목록(중복 없음).
 */
export function getWorldFloorPickupStorageSlugs() {
  const seen = Object.create(null);
  const out = [];
  function add(raw) {
    const s = raw != null && String(raw).trim() ? String(raw).replace(/[^\w\-]+/g, "_") : "offline";
    const key = s || "offline";
    if (seen[key]) return;
    seen[key] = true;
    out.push(key);
  }
  try {
    add("offline");
    const room = window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom;
    if (room != null && String(room).trim()) add(String(room));
    add(getMultiplayerRoomSlug());
  } catch (e) {
    add("offline");
  }
  return out;
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

/** 월드 책을 E로 줍기(가이드 소지 플래그 없이 바닥에서만 제거). */
export function storageKeyWorldGuideBookOffGroundPickedForRoom() {
  return "worldGuideBookOffGroundPickedRoomV1:" + getMultiplayerRoomSlug();
}
