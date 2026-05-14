import { worldBagFloorPickedAccountKey, hasGuideBookKey } from "./constants.js";

const TUTORIAL_SESSION_BAG_KEY = "ovcTutorialSessionWorldBagGroundPickedV1";

export function readTutorialSessionFloorBagPicked() {
  try {
    return sessionStorage.getItem(TUTORIAL_SESSION_BAG_KEY) === "1";
  } catch (e) {
    return false;
  }
}

export function writeTutorialSessionFloorBagPicked() {
  try {
    sessionStorage.setItem(TUTORIAL_SESSION_BAG_KEY, "1");
  } catch (e) {}
}

export function clearTutorialSessionFloorBagPicked() {
  try {
    sessionStorage.removeItem(TUTORIAL_SESSION_BAG_KEY);
  } catch (e) {}
}

export function isWorldFloorBagClaimed(getStoredFlag) {
  return Boolean(getStoredFlag(worldBagFloorPickedAccountKey));
}

export function persistWorldFloorBagClaim(setStoredFlag) {
  setStoredFlag(worldBagFloorPickedAccountKey, true);
}

export function clearWorldFloorBagClaim(removeStoredValue) {
  removeStoredValue(worldBagFloorPickedAccountKey);
}

/**
 * localStorage에 prefix로 시작하는 키 중 값이 "true"인 것이 있는지(레거시 방별 가방 플래그 스캔).
 */
export function localStorageHasTrueKeyWithPrefix(prefix) {
  if (!prefix) return false;
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k || k.indexOf(prefix) !== 0) continue;
      if (localStorage.getItem(k) === "true") return true;
    }
  } catch (e) {}
  return false;
}

/**
 * 월드 바닥 가방 줍기: 계정 플래그가 비어 있을 때만, 가이드 소지·레거시 방 키·접두사 스캔으로 복구.
 */
export function hydrateWorldFloorBagClaimFromLegacy(getStoredFlag, setStoredFlag, opts) {
  if (getStoredFlag(worldBagFloorPickedAccountKey)) return;
  if (opts.guideBookClaimed && opts.guideBookClaimed()) {
    setStoredFlag(worldBagFloorPickedAccountKey, true);
    return;
  }
  if (opts.anyRoomKeyedWorldBag && opts.anyRoomKeyedWorldBag()) {
    setStoredFlag(worldBagFloorPickedAccountKey, true);
    return;
  }
  const userPx = opts.storageUserPrefix || "";
  const bagPrefix = userPx + "worldBagGroundPickedRoomV1:";
  if (localStorageHasTrueKeyWithPrefix(bagPrefix)) {
    setStoredFlag(worldBagFloorPickedAccountKey, true);
  }
}

/**
 * 월드: 바닥 가방 메시(mesh) 숨김. 튜토리얼: 세션만.
 * worldExtraHide: 가이드 책 방 키만 있고 계정 플래그가 아직 안 맞춰진 레거시 등.
 */
export function shouldHideWorldFloorBagMesh(
  isWorldDocumentEntryFn,
  getStoredFlag,
  readTutorialSessionFloorBagPicked,
  worldExtraHide
) {
  if (isWorldDocumentEntryFn()) {
    if (isWorldFloorBagClaimed(getStoredFlag)) return true;
    if (Boolean(getStoredFlag(hasGuideBookKey))) return true;
    if (worldExtraHide && worldExtraHide()) return true;
    return false;
  }
  return readTutorialSessionFloorBagPicked();
}
