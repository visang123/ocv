/** 첫 로그인 세계관 인트로 — Enter로 한 줄씩 넘김 (로딩 화면과 분리) */
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
const WORMHOLE_FRAME_MS = 3000;

export const STORY_WORMHOLE_FRAMES = [
  "이미지/story-wormhole-1.png",
  "이미지/story-wormhole-2.png",
  "이미지/story-wormhole-3.png",
  "이미지/story-wormhole-4.png"
];

function isEnterKey(event) {
  return event.key === "Enter" || event.code === "NumpadEnter";
}

const STORY_LINE_MIN_FONT_PX = 40;

/** 줄바꿈 없이 한 줄에 맞추되, 너무 작아지지 않도록 글자 크기만 조절 */
function fitStoryLineToSingleRow(lineEl) {
  if (!lineEl || !lineEl.textContent) return;
  lineEl.style.fontSize = "";
  const maxWidth = Math.max(240, Math.floor(window.innerWidth * 0.92));
  let sizePx = Math.round(parseFloat(getComputedStyle(lineEl).fontSize) || 70);
  if (!Number.isFinite(sizePx) || sizePx < STORY_LINE_MIN_FONT_PX) {
    sizePx = STORY_LINE_MIN_FONT_PX;
  }
  lineEl.style.fontSize = sizePx + "px";
  while (lineEl.scrollWidth > maxWidth && sizePx > STORY_LINE_MIN_FONT_PX) {
    sizePx -= 1;
    lineEl.style.fontSize = sizePx + "px";
  }
}

export function createStoryIntro(options) {
  const {
    storyIntroCompleteKey,
    getStoredFlag,
    setStoredFlag,
    overlay,
    lineEl,
    hintEl,
    wormholeEl
  } = options;

  let active = false;
  let lineIndex = 0;
  let canAdvance = false;
  let isTransitioning = false;
  let fadeTimerId = null;
  let hintBlinkTimerId = null;
  let wormholeTimerId = null;
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

  function clearWormholeTimer() {
    if (wormholeTimerId != null) {
      clearTimeout(wormholeTimerId);
      wormholeTimerId = null;
    }
  }

  function clearTimers() {
    clearFadeTimer();
    clearHintBlinkTimer();
    clearWormholeTimer();
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

  function showOverlay() {
    if (!overlay) return;
    overlay.removeAttribute("hidden");
    overlay.classList.add("is-visible");
  }

  function hideWormholeView() {
    if (!wormholeEl) return;
    wormholeEl.classList.remove("is-visible");
    wormholeEl.hidden = true;
    wormholeEl.removeAttribute("src");
    if (overlay) overlay.classList.remove("is-wormhole");
  }

  function hideOverlay() {
    active = false;
    canAdvance = false;
    isTransitioning = false;
    clearTimers();
    overlay.classList.remove("is-visible");
    overlay.setAttribute("hidden", "");
    lineEl.hidden = false;
    lineEl.classList.remove("is-bright", "is-dim");
    lineEl.textContent = "";
    hideHint();
    hideWormholeView();
  }

  function playWormholeSequence(onDone) {
    if (!wormholeEl || STORY_WORMHOLE_FRAMES.length === 0) {
      onDone();
      return;
    }
    lineEl.hidden = true;
    hideHint();
    canAdvance = false;
    isTransitioning = true;
    overlay.classList.add("is-wormhole");
    wormholeEl.hidden = false;

    let frameIndex = 0;

    function showFrame() {
      wormholeEl.classList.remove("is-visible");
      wormholeEl.src = STORY_WORMHOLE_FRAMES[frameIndex];
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wormholeEl.classList.add("is-visible");
        });
      });
      frameIndex += 1;
      if (frameIndex >= STORY_WORMHOLE_FRAMES.length) {
        wormholeTimerId = setTimeout(function () {
          wormholeTimerId = null;
          isTransitioning = false;
          onDone();
        }, WORMHOLE_FRAME_MS);
      } else {
        wormholeTimerId = setTimeout(showFrame, WORMHOLE_FRAME_MS);
      }
    }

    showFrame();
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
    fitStoryLineToSingleRow(lineEl);
    setLineDim();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setLineBright();
        showHintForCurrentLine();
      });
    });
  }

  function endStoryTextThenWormhole() {
    fadeOutThen(function () {
      playWormholeSequence(finishIntro);
    });
  }

  function showLine(idx) {
    if (idx >= STORY_INTRO_LINES.length) {
      endStoryTextThenWormhole();
      return;
    }
    revealLine(idx);
  }

  function advanceOnEnter() {
    if (!active || !canAdvance || isTransitioning) return;
    canAdvance = false;
    const next = lineIndex + 1;
    if (next >= STORY_INTRO_LINES.length) {
      endStoryTextThenWormhole();
      return;
    }
    fadeOutThen(function () {
      showLine(next);
    });
  }

  function bindInput() {
    if (overlay.dataset.storyIntroBound === "1") return;
    overlay.dataset.storyIntroBound = "1";
    window.addEventListener(
      "keydown",
      function (e) {
        if (!active || !isEnterKey(e)) return;
        e.preventDefault();
        e.stopPropagation();
        advanceOnEnter();
      },
      true
    );
    window.addEventListener("resize", function () {
      if (!active || !lineEl.textContent) return;
      fitStoryLineToSingleRow(lineEl);
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
    lineEl.textContent = "";
    lineEl.classList.remove("is-bright", "is-dim");
    hideHint();
    showOverlay();
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
