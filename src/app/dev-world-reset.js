export const OVC_PENDING_DEV_WORLD_RESET_KEY = "ovcPendingDevWorldResetV1";

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

/** 월드(index): Ctrl+Shift+R, Ctrl+Alt+R, F9 */
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

function onDevResetKeydown(resetFn, isWorldEntry, event) {
  if (!isWorldMapDevResetShortcut(event)) return;
  if (typeof isWorldEntry === "function" && !isWorldEntry()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (typeof resetFn === "function") {
    resetFn();
  } else {
    markPendingDevWorldReset();
  }
}

/** resetGameForTesting 정의 직후 + 부트스트랩 완료 시 호출 */
export function bootDevWorldReset(resetFn, isWorldEntry) {
  if (typeof window !== "undefined") {
    window.__ovcResetGameForTesting = resetFn;
  }
  if (typeof window !== "undefined" && !window.__ovcDevResetModuleListenerInstalled) {
    window.__ovcDevResetModuleListenerInstalled = true;
    const handler = function (event) {
      onDevResetKeydown(resetFn, isWorldEntry, event);
    };
    window.addEventListener("keydown", handler, true);
    document.addEventListener("keydown", handler, true);
  }
}

export function finishDevWorldResetBoot(resetFn, isWorldEntry) {
  bootDevWorldReset(resetFn, isWorldEntry);
  consumePendingDevWorldReset(resetFn, isWorldEntry);
}
