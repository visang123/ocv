export const OVC_PENDING_DEV_WORLD_RESET_KEY = "ovcPendingDevWorldResetV1";

function isDevResetAltModifierHeld(event) {
  if (event.altKey) return true;
  if (typeof event.getModifierState !== "function") return false;
  if (event.getModifierState("AltGraph")) return true;
  return event.getModifierState("Control") && event.getModifierState("Alt");
}

/** 월드(index) 전용: Ctrl+Shift+R 또는 Ctrl+Alt+R */
export function isWorldMapDevResetShortcut(event) {
  if (event.repeat) return false;
  const isRKey =
    event.code === "KeyR" || event.key === "r" || event.key === "R";
  if (!isRKey) return false;
  if (!(event.ctrlKey || event.metaKey)) return false;
  // Ctrl+Shift+R — shift만 본다 (한국어 IME가 altKey를 잘못 켜는 경우 무시)
  if (event.shiftKey) return true;
  return isDevResetAltModifierHeld(event);
}

export function markPendingDevWorldReset() {
  try {
    sessionStorage.setItem(OVC_PENDING_DEV_WORLD_RESET_KEY, "1");
  } catch (e) {}
}

export function consumePendingDevWorldReset(resetFn) {
  try {
    if (sessionStorage.getItem(OVC_PENDING_DEV_WORLD_RESET_KEY) !== "1") {
      return false;
    }
    sessionStorage.removeItem(OVC_PENDING_DEV_WORLD_RESET_KEY);
  } catch (e) {
    return false;
  }
  if (typeof resetFn === "function") resetFn();
  return true;
}

export function installWorldMapDevResetShortcut(isWorldEntry, resetFn) {
  window.addEventListener(
    "keydown",
    function (event) {
      if (!isWorldMapDevResetShortcut(event)) return;
      if (typeof isWorldEntry === "function" && !isWorldEntry()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (typeof resetFn === "function") {
        resetFn();
        return;
      }
      markPendingDevWorldReset();
    },
    true
  );
}

export function wireDevWorldResetApi(resetFn) {
  window.__ovcResetGameForTesting = resetFn;
  consumePendingDevWorldReset(resetFn);
}
