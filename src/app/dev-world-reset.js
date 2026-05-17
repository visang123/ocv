export const OVC_PENDING_DEV_WORLD_RESET_KEY = "ovcPendingDevWorldResetV1";

function hasAltModifier(event) {
  if (event.altKey) return true;
  if (typeof event.getModifierState !== "function") return false;
  return event.getModifierState("Alt") || event.getModifierState("AltGraph");
}

/** 월드(index) 전용: Ctrl+Shift+R 또는 Ctrl+Alt+R */
export function isWorldMapDevResetShortcut(event) {
  if (
    typeof window !== "undefined" &&
    typeof window.__ovcIsWorldMapDevResetShortcut === "function"
  ) {
    return window.__ovcIsWorldMapDevResetShortcut(event);
  }
  if (event.repeat) return false;
  if (!(event.ctrlKey || event.metaKey)) return false;
  const isRKey =
    event.code === "KeyR" ||
    event.key === "r" ||
    event.key === "R" ||
    event.keyCode === 82;
  if (!isRKey) return false;
  if (event.shiftKey) return true;
  if (hasAltModifier(event)) return true;
  return false;
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

export function wireDevWorldResetApi(resetFn) {
  window.__ovcResetGameForTesting = resetFn;
  consumePendingDevWorldReset(resetFn);
}
