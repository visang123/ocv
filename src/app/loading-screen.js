const appLoadingScreen = document.getElementById("app-loading-screen");
const appLoadingText = document.getElementById("app-loading-text");
let appLoadingHideTimer = null;
let appLoadingDismissed = false;

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
  document.body.classList.remove("is-game-ready");
}

export function hideAppLoadingScreen(options) {
  const force = Boolean(options && options.force);
  if (appLoadingDismissed && !force) return;
  appLoadingDismissed = true;
  clearTimeout(appLoadingHideTimer);
  document.body.classList.add("is-game-ready");
  if (!appLoadingScreen) return;
  appLoadingScreen.hidden = true;
}

/** 개발용 월드 리셋 등 — 로딩 오버레이를 반드시 닫음 */
export function dismissAppLoadingScreenAfterDevReset() {
  hideAppLoadingScreen({ force: true });
}
