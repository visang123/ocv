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

export function hideAppLoadingScreen() {
  if (appLoadingDismissed) return;
  appLoadingDismissed = true;
  clearTimeout(appLoadingHideTimer);
  document.body.classList.add("is-game-ready");
  if (!appLoadingScreen) return;
  appLoadingScreen.hidden = true;
}
