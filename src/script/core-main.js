/**
 * Core/Main — gameLoop, 부트스트랩, 전역 타이머·리사이즈.
 * script.js 가 gameLoopHost 와 콜백을 넘기면 여기서 루프·부트를 시작한다.
 */
import { runGameLoopLogic } from "../game/game-loop-logic.js";
import { runGameLoopRender } from "../game/game-loop-render.js";

/**
 * @param {object} host — gameLoopHost (script.js 에서 조립)
 * @param {() => boolean} isTabSessionSuperseded
 */
export function createGameLoop(host, isTabSessionSuperseded) {
  function gameLoop() {
    if (!isTabSessionSuperseded()) {
      runGameLoopLogic(host);
      runGameLoopRender(host);
    }
    requestAnimationFrame(gameLoop);
  }
  return gameLoop;
}

/**
 * @param {object} opts
 * @param {ReturnType<typeof createGameLoop>} opts.gameLoop
 * @param {() => boolean} opts.isTabSessionSuperseded
 * @param {(force: boolean) => void} opts.pollWorldState
 * @param {(force: boolean) => void} opts.syncWorldState
 * @param {(force: boolean) => void} opts.sendMultiplayerPresence
 * @param {() => void} opts.validateCurrentAccount
 * @param {() => void} opts.setup
 * @param {() => void} opts.updateCamera
 * @param {(force: boolean) => void} opts.ovcTryDismissLoadingScreen
 * @param {() => number} opts.getMultiplayerWorldSyncLoopMs
 * @param {() => boolean} opts.hasHydratedSharedWorldFromServer
 * @param {() => boolean} opts.isWorldServerSyncAvailable
 * @param {() => void} opts.onWindowResize
 */
export function attachCoreRuntimeTimers(opts) {
  const {
    gameLoop,
    isTabSessionSuperseded,
    pollWorldState,
    syncWorldState,
    sendMultiplayerPresence,
    validateCurrentAccount,
    updateCamera,
    ovcTryDismissLoadingScreen,
    getMultiplayerWorldSyncLoopMs,
    hasHydratedSharedWorldFromServer,
    isWorldServerSyncAvailable,
    onWindowResize
  } = opts;

  setTimeout(function () {
    if (!isTabSessionSuperseded()) {
      if (!hasHydratedSharedWorldFromServer() && isWorldServerSyncAvailable()) {
        pollWorldState(true);
      }
    }
    ovcTryDismissLoadingScreen(false);
  }, 40);

  setTimeout(function () {
    ovcTryDismissLoadingScreen(true);
  }, 3500);

  setInterval(function () {
    if (isTabSessionSuperseded()) return;
    sendMultiplayerPresence(false);
  }, 1000);

  function runMultiplayerWorldSyncTick() {
    if (isTabSessionSuperseded()) return;
    pollWorldState(false);
    syncWorldState(false);
    window.setTimeout(runMultiplayerWorldSyncTick, getMultiplayerWorldSyncLoopMs());
  }
  window.setTimeout(runMultiplayerWorldSyncTick, getMultiplayerWorldSyncLoopMs());

  setInterval(function () {
    if (isTabSessionSuperseded()) return;
    validateCurrentAccount();
  }, 5000);

  window.addEventListener("resize", onWindowResize);

  window.addEventListener("load", function () {
    updateCamera();
    ovcTryDismissLoadingScreen(false);
  });

  gameLoop();
}
