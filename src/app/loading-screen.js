const appLoadingScreen = document.getElementById("app-loading-screen");
const appLoadingText = document.getElementById("app-loading-text");
let appLoadingHideTimer = null;
let appLoadingDismissed = false;

/** 로딩을 닫을 때 반드시 게임 레이어 표시 */
export function forceDismissLoadingOverlay() {
  appLoadingDismissed = true;
  clearTimeout(appLoadingHideTimer);
  document.body.classList.add("is-game-ready");
  if (!appLoadingScreen) return;
  appLoadingScreen.hidden = true;
  appLoadingScreen.setAttribute("aria-hidden", "true");
}

if (typeof window !== "undefined") {
  window.ovcForceDismissLoadingOverlay = forceDismissLoadingOverlay;
}

export function showAppLoadingScreen(message, options) {
  const force = Boolean(options && options.force);
  if (!appLoadingScreen) return;
  if (appLoadingDismissed && !force) return;
  if (force) {
    appLoadingDismissed = false;
  }
  clearTimeout(appLoadingHideTimer);
  if (appLoadingText && message) {
    appLoadingText.textContent = message;
  }
  appLoadingScreen.hidden = false;
  appLoadingScreen.removeAttribute("aria-hidden");
  document.body.classList.remove("is-game-ready");
}

export function hideAppLoadingScreen(options) {
  const force = Boolean(options && options.force);
  if (appLoadingDismissed && !force) {
    document.body.classList.add("is-game-ready");
    return;
  }
  forceDismissLoadingOverlay();
}

/** 개발용 월드 리셋 등 — 로딩 오버레이를 반드시 닫음 */
export function dismissAppLoadingScreenAfterDevReset() {
  hideAppLoadingScreen({ force: true });
}
