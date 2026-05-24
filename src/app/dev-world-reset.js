export const OVC_PENDING_DEV_WORLD_RESET_KEY = "ovcPendingDevWorldResetV1";
export const OVC_PENDING_DEV_TUTORIAL_RESET_KEY = "ovcPendingDevTutorialResetV1";

function hasAltModifier(event) {
  if (event.altKey) return true;
  if (typeof event.getModifierState !== "function") return false;
  return event.getModifierState("Alt") || event.getModifierState("AltGraph");
}

function isRKey(event) {
  const key = event.keyCode || event.which;
  return (
    event.code === "KeyR" ||
    event.key === "r" ||
    event.key === "R" ||
    key === 82
  );
}

/** 월드(index)·튜토리얼: Ctrl+Alt+R, F9 (Ctrl+Shift+R 은 head 스크립트에서 제외) */
export function isWorldMapDevResetShortcut(event) {
  if (
    typeof window !== "undefined" &&
    typeof window.__ovcIsWorldMapDevResetShortcut === "function"
  ) {
    return window.__ovcIsWorldMapDevResetShortcut(event);
  }
  if (event.repeat) return false;
  if (event.code === "F9") return true;
  if (!isRKey(event)) return false;
  const ctrlOrMeta = event.ctrlKey || event.metaKey;
  if (ctrlOrMeta && event.shiftKey) return true;
  if (ctrlOrMeta && hasAltModifier(event)) return true;
  return false;
}

export function markPendingDevWorldReset() {
  try {
    sessionStorage.setItem(OVC_PENDING_DEV_WORLD_RESET_KEY, "1");
  } catch (e) {}
}

export function markPendingDevTutorialReset() {
  try {
    sessionStorage.setItem(OVC_PENDING_DEV_TUTORIAL_RESET_KEY, "1");
  } catch (e) {}
}

export function consumePendingDevWorldReset(resetFn, isWorldEntry) {
  try {
    if (sessionStorage.getItem(OVC_PENDING_DEV_WORLD_RESET_KEY) !== "1") {
      return false;
    }
    sessionStorage.removeItem(OVC_PENDING_DEV_WORLD_RESET_KEY);
  } catch (e) {
    return false;
  }
  if (typeof isWorldEntry === "function" && !isWorldEntry()) {
    return false;
  }
  if (typeof resetFn === "function") {
    resetFn();
    return true;
  }
  return false;
}

export function consumePendingDevTutorialReset(resetFn, isTutorialEntry) {
  try {
    if (sessionStorage.getItem(OVC_PENDING_DEV_TUTORIAL_RESET_KEY) !== "1") {
      return false;
    }
    sessionStorage.removeItem(OVC_PENDING_DEV_TUTORIAL_RESET_KEY);
  } catch (e) {
    return false;
  }
  if (typeof isTutorialEntry === "function" && !isTutorialEntry()) {
    return false;
  }
  if (typeof resetFn === "function") {
    resetFn();
    return true;
  }
  return false;
}

function onDevResetKeydown(worldResetFn, tutorialResetFn, isWorldEntry, isTutorialEntry, event) {
  if (!isWorldMapDevResetShortcut(event)) return;
  if (typeof isTutorialEntry === "function" && isTutorialEntry()) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (typeof tutorialResetFn === "function") {
      tutorialResetFn();
    } else {
      markPendingDevTutorialReset();
    }
    return;
  }
  if (typeof isWorldEntry === "function" && !isWorldEntry()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (typeof worldResetFn === "function") {
    worldResetFn();
  } else {
    markPendingDevWorldReset();
  }
}

/** resetGameForTesting / resetTutorialForTesting 정의 직후 + 부트스트랩 완료 시 호출 */
export function bootDevReset(worldResetFn, tutorialResetFn, isWorldEntry, isTutorialEntry) {
  if (typeof window !== "undefined") {
    window.__ovcResetGameForTesting = worldResetFn;
    window.__ovcResetTutorialForTesting = tutorialResetFn;
  }
  if (typeof window !== "undefined" && !window.__ovcDevResetModuleListenerInstalled) {
    window.__ovcDevResetModuleListenerInstalled = true;
    const handler = function (event) {
      onDevResetKeydown(worldResetFn, tutorialResetFn, isWorldEntry, isTutorialEntry, event);
    };
    window.addEventListener("keydown", handler, true);
    document.addEventListener("keydown", handler, true);
  }
}

/** @deprecated — bootDevReset 사용 */
export function bootDevWorldReset(resetFn, isWorldEntry) {
  bootDevReset(resetFn, null, isWorldEntry, function () {
    return false;
  });
}

export function finishDevResetBoot(
  worldResetFn,
  tutorialResetFn,
  isWorldEntry,
  isTutorialEntry
) {
  bootDevReset(worldResetFn, tutorialResetFn, isWorldEntry, isTutorialEntry);
  consumePendingDevWorldReset(worldResetFn, isWorldEntry);
  consumePendingDevTutorialReset(tutorialResetFn, isTutorialEntry);
}

/** @deprecated — finishDevResetBoot 사용 */
export function finishDevWorldResetBoot(resetFn, isWorldEntry) {
  finishDevResetBoot(resetFn, null, isWorldEntry, function () {
    return false;
  });
}
