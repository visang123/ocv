/**
 * 튜토리얼 전용: WASD 오버레이 + 첫 이동 후 가방 쪽 안내.
 * phase / baseline 상태는 인스턴스가 보유한다.
 */
export function createMovementTutorial(options) {
  const {
    movementTutorialCompleteKey,
    getStoredFlag,
    setStoredFlag,
    isTutorialDocumentEntry,
    hasCurrentUser,
    getHasSpawnedCharacter,
    getIsCharacterSelecting,
    getIsTabSessionSuperseded,
    getHasGuideBook,
    getOnboardingFlowStep,
    isNearWorldBagPickup,
    dom,
    getPlayerPose
  } = options;

  let phase = 0;
  let baseline = null;

  function shouldRun() {
    return (
      isTutorialDocumentEntry() &&
      Boolean(hasCurrentUser()) &&
      getHasSpawnedCharacter() &&
      !getIsCharacterSelecting() &&
      !getIsTabSessionSuperseded() &&
      !getStoredFlag(movementTutorialCompleteKey) &&
      !getHasGuideBook() &&
      !(getOnboardingFlowStep() === 1 && isNearWorldBagPickup())
    );
  }

  function hideOverlay() {
    const { overlay, lineBook, keys, guideBook, worldBag } = dom;
    if (!overlay) return;
    overlay.style.display = "none";
    if (lineBook) {
      lineBook.hidden = true;
      lineBook.textContent = "";
    }
    if (keys) keys.style.display = "";
    if (guideBook) guideBook.classList.remove("is-movement-tutorial-target");
    if (worldBag) worldBag.classList.remove("is-movement-tutorial-target");
  }

  function complete() {
    setStoredFlag(movementTutorialCompleteKey, true);
    phase = 0;
    baseline = null;
    hideOverlay();
  }

  function resetMotionState() {
    phase = 0;
    baseline = null;
    hideOverlay();
  }

  function prepareBeforeMove() {
    if (!shouldRun()) {
      if (phase !== 0) {
        phase = 0;
        baseline = null;
      }
      hideOverlay();
      return;
    }
    if (phase === 0) {
      phase = 1;
      const pose = getPlayerPose();
      baseline = {
        x: pose.x,
        depth: pose.depth,
        j: pose.jumpY
      };
    }
  }

  function advanceAfterMove() {
    if (!shouldRun()) return;
    if (phase === 1 && baseline) {
      const b = baseline;
      const pose = getPlayerPose();
      if (
        Math.abs(pose.x - b.x) > 2.5 ||
        Math.abs(pose.depth - b.depth) > 2.5 ||
        Math.abs(pose.jumpY - b.j) > 4
      ) {
        phase = 2;
      }
    }
    syncOverlay();
  }

  function syncOverlay() {
    const { overlay, lineMove, lineBook, keys, worldBag } = dom;
    if (!overlay || !lineMove || !lineBook || !keys) {
      return;
    }
    if (!shouldRun() || phase < 1) return;

    overlay.style.display = "block";
    lineMove.textContent = "\uC774\uB3D9\uC740 \uBC29\uD5A5\uD0A4 \uB610\uB294 WSAD";
    if (phase === 2) {
      lineBook.textContent =
        "\uAC00\uBC29 \uCABD\uC73C\uB85C \uC774\uB3D9\uD558\uC138\uC694!";
      lineBook.hidden = false;
    } else {
      lineBook.textContent = "";
      lineBook.hidden = true;
    }
    keys.style.display = "flex";
    if (worldBag) {
      worldBag.classList.toggle("is-movement-tutorial-target", phase === 2);
    }
  }

  return {
    prepareBeforeMove,
    advanceAfterMove,
    hideOverlay,
    complete,
    resetMotionState
  };
}
