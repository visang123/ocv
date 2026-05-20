/** 첫 로그인 세계관 인트로 — Enter로 한 줄씩 넘김 */
export const STORY_INTRO_LINES = [
  "지구온난화는 너무나 심해져서 지구는 생존하기 부적합해졌다.",
  "사람들은 다른행성으로 눈을 돌렸다.",
  "트래피스트-1e는 지구와 환경이 비슷한 가장 가까운 행성이였다.",
  "그럼에도 40광년은 너무나 멀었다.",
  "놀랍게도 서기 2350년 세상에 순간이동 장치가 개발된다.",
  "게임속 포탈은 현실이 되었고 지구 사람들은 어떤 행성이든 이동하게 될 예정이다.",
  "지금은 최종 포탈 이동 테스트를 앞두고 있다!!"
];

const FADE_MS = 1400;
const HINT_BLINK_DELAY_MS = 2000;

export function createStoryIntro(options) {
  const {
    storyIntroCompleteKey,
    getStoredFlag,
    setStoredFlag,
    overlay,
    lineEl,
    hintEl,
    onDismissLoading
  } = options;

  let active = false;
  let lineIndex = 0;
  let canAdvance = false;
  let isTransitioning = false;
  let fadeTimerId = null;
  let hintBlinkTimerId = null;
  let onCompleteCallback = null;

  function clearFadeTimer() {
    if (fadeTimerId != null) {
      clearTimeout(fadeTimerId);
      fadeTimerId = null;
    }
  }

  function clearHintBlinkTimer() {
    if (hintBlinkTimerId != null) {
      clearTimeout(hintBlinkTimerId);
      hintBlinkTimerId = null;
    }
  }

  function clearTimers() {
    clearFadeTimer();
    clearHintBlinkTimer();
  }

  function shouldShow() {
    return Boolean(overlay && lineEl) && !getStoredFlag(storyIntroCompleteKey);
  }

  function isActive() {
    return active;
  }

  function setLineBright() {
    lineEl.classList.remove("is-dim");
    lineEl.classList.add("is-bright");
  }

  function setLineDim() {
    lineEl.classList.remove("is-bright");
    lineEl.classList.add("is-dim");
  }

  function hideHint() {
    clearHintBlinkTimer();
    if (!hintEl) return;
    hintEl.hidden = true;
    hintEl.classList.remove("is-blink");
  }

  /** 줄이 밝아진 뒤 — 안내 문구 표시, 2초 후 노란 깜빡임 */
  function showHintForCurrentLine() {
    if (!hintEl) {
      canAdvance = true;
      isTransitioning = false;
      return;
    }
    clearHintBlinkTimer();
    hintEl.hidden = false;
    hintEl.classList.remove("is-blink");
    hintBlinkTimerId = setTimeout(function () {
      hintBlinkTimerId = null;
      if (!active || !canAdvance) return;
      hintEl.classList.add("is-blink");
    }, HINT_BLINK_DELAY_MS);
    canAdvance = true;
    isTransitioning = false;
  }

  function hideOverlay() {
    active = false;
    canAdvance = false;
    isTransitioning = false;
    clearTimers();
    overlay.hidden = true;
    overlay.classList.remove("is-visible");
    document.body.classList.remove("story-intro-active");
    lineEl.classList.remove("is-bright", "is-dim");
    lineEl.textContent = "";
    hideHint();
  }

  function finishIntro() {
    setStoredFlag(storyIntroCompleteKey, true);
    hideOverlay();
    const done = onCompleteCallback;
    onCompleteCallback = null;
    if (typeof done === "function") done();
  }

  function fadeOutThen(nextFn) {
    canAdvance = false;
    isTransitioning = true;
    hideHint();
    setLineDim();
    clearFadeTimer();
    fadeTimerId = setTimeout(function () {
      fadeTimerId = null;
      nextFn();
    }, FADE_MS);
  }

  function revealLine(idx) {
    lineIndex = idx;
    lineEl.textContent = STORY_INTRO_LINES[idx];
    setLineDim();
    requestAnimationFrame(function () {
      setLineBright();
      showHintForCurrentLine();
    });
  }

  function showLine(idx) {
    if (idx >= STORY_INTRO_LINES.length) {
      fadeOutThen(finishIntro);
      return;
    }
    revealLine(idx);
  }

  function advanceOnEnter() {
    if (!active || !canAdvance || isTransitioning) return;
    canAdvance = false;
    const next = lineIndex + 1;
    if (next >= STORY_INTRO_LINES.length) {
      fadeOutThen(finishIntro);
      return;
    }
    fadeOutThen(function () {
      showLine(next);
    });
  }

  function bindInput() {
    if (!overlay || overlay.dataset.storyIntroBound === "1") return;
    overlay.dataset.storyIntroBound = "1";
    window.addEventListener("keydown", function (e) {
      if (!active) return;
      if (e.key !== "Enter") return;
      e.preventDefault();
      advanceOnEnter();
    });
  }

  /**
   * @param {() => void} [onComplete]
   * @returns {boolean} 인트로를 표시 중이면 true
   */
  function tryShow(onComplete) {
    if (!shouldShow()) {
      return false;
    }
    bindInput();
    onCompleteCallback = onComplete;
    active = true;
    lineIndex = 0;
    canAdvance = false;
    isTransitioning = false;
    overlay.hidden = false;
    overlay.classList.add("is-visible");
    document.body.classList.add("story-intro-active");
    if (typeof onDismissLoading === "function") {
      onDismissLoading();
    }
    lineEl.textContent = "";
    lineEl.classList.remove("is-bright", "is-dim");
    hideHint();
    requestAnimationFrame(function () {
      showLine(0);
    });
    return true;
  }

  return {
    tryShow,
    isActive,
    skipToEnd: finishIntro
  };
}
