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

export const STORY_INTRO_VIDEOS = [
  "이미지/story-intro-wormhole.mp4",
  "이미지/story-intro-2.mp4"
];

function isEnterKey(event) {
  return event.key === "Enter" || event.code === "NumpadEnter";
}

const STORY_LINE_MIN_FONT_PX = 32;

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
    wormholeEl,
    wormholeStageEl
  } = options;

  let active = false;
  let lineIndex = 0;
  let canAdvance = false;
  let isTransitioning = false;
  let fadeTimerId = null;
  let hintBlinkTimerId = null;
  let wormholeTimerId = null;
  let skipWormholeFrameFn = null;
  let onCompleteCallback = null;
  let videosPrimed = false;

  function primeStoryVideos() {
    if (videosPrimed || !wormholeEl || wormholeEl.tagName !== "VIDEO") return;
    videosPrimed = true;
    wormholeEl.muted = true;
    wormholeEl.setAttribute("playsinline", "");
    STORY_INTRO_VIDEOS.forEach(function (src) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = src;
      document.head.appendChild(link);
    });
  }

  function prepareVideoElement(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
  }

  function tryPlayVideo(video, onFail) {
    prepareVideoElement(video);
    const playPromise = video.play();
    if (!playPromise || typeof playPromise.then !== "function") {
      return;
    }
    playPromise.catch(function () {
      window.setTimeout(function () {
        video.play().catch(function () {
          if (typeof onFail === "function") onFail();
        });
      }, 80);
    });
  }

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

  function resetWormholeMedia() {
    if (!wormholeEl) return;
    wormholeEl.classList.remove("is-visible");
    if (wormholeEl.tagName === "VIDEO") {
      wormholeEl.pause();
      wormholeEl.removeAttribute("src");
      wormholeEl.removeAttribute("data-preload-src");
      wormholeEl.load();
    } else {
      wormholeEl.removeAttribute("src");
    }
  }

  function hideWormholeView() {
    resetWormholeMedia();
    if (wormholeStageEl) wormholeStageEl.hidden = true;
    if (overlay) overlay.classList.remove("is-wormhole");
    if (lineEl) lineEl.removeAttribute("aria-hidden");
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
    skipWormholeFrameFn = null;
  }

  function preloadVideoAt(index) {
    if (!wormholeEl || wormholeEl.tagName !== "VIDEO") return;
    if (index < 0 || index >= STORY_INTRO_VIDEOS.length) return;
    const video = wormholeEl;
    prepareVideoElement(video);
    if (video.getAttribute("data-preload-src") === STORY_INTRO_VIDEOS[index]) return;
    video.setAttribute("data-preload-src", STORY_INTRO_VIDEOS[index]);
    video.src = STORY_INTRO_VIDEOS[index];
    video.load();
  }

  function playWormholeSequence(onDone) {
    if (!wormholeEl || STORY_INTRO_VIDEOS.length === 0) {
      onDone();
      return;
    }
    lineEl.hidden = true;
    lineEl.textContent = "";
    lineEl.setAttribute("aria-hidden", "true");
    hideHint();
    canAdvance = false;
    isTransitioning = true;
    overlay.classList.add("is-wormhole");
    if (wormholeStageEl) wormholeStageEl.hidden = false;

    let videoIndex = 0;
    let pendingCanPlayHandler = null;

    function clearPendingCanPlay() {
      clearWormholeTimer();
      if (!pendingCanPlayHandler || wormholeEl.tagName !== "VIDEO") return;
      wormholeEl.removeEventListener("canplay", pendingCanPlayHandler);
      pendingCanPlayHandler = null;
    }

    function finishWormholeSequence() {
      clearPendingCanPlay();
      clearWormholeTimer();
      skipWormholeFrameFn = null;
      isTransitioning = false;
      resetWormholeMedia();
      onDone();
    }

    skipWormholeFrameFn = function () {
      if (!active || !overlay.classList.contains("is-wormhole")) return;
      const video = wormholeEl;
      if (video && video.tagName === "VIDEO") {
        video.onended = null;
        video.onerror = null;
        clearPendingCanPlay();
        video.pause();
      }
      playVideoAt(videoIndex + 1);
    };

    if (wormholeEl.tagName !== "VIDEO") {
      finishWormholeSequence();
      return;
    }

    const video = wormholeEl;
    prepareVideoElement(video);

    function playVideoAt(index) {
      if (index >= STORY_INTRO_VIDEOS.length) {
        finishWormholeSequence();
        return;
      }
      clearPendingCanPlay();
      videoIndex = index;
      let clipStarted = false;
      video.classList.remove("is-visible");
      video.pause();
      video.onended = null;
      video.onerror = null;
      video.currentTime = 0;
      video.removeAttribute("data-preload-src");
      video.src = STORY_INTRO_VIDEOS[index];
      video.load();

      pendingCanPlayHandler = function onReady() {
        if (clipStarted) return;
        clipStarted = true;
        clearPendingCanPlay();
        video.onended = function () {
          playVideoAt(index + 1);
        };
        video.onerror = function () {
          playVideoAt(index + 1);
        };
        requestAnimationFrame(function () {
          video.classList.add("is-visible");
          tryPlayVideo(video, function () {
            playVideoAt(index + 1);
          });
        });
      };

      video.addEventListener("canplay", pendingCanPlayHandler, { once: true });
      wormholeTimerId = window.setTimeout(function () {
        wormholeTimerId = null;
        if (!clipStarted && pendingCanPlayHandler) {
          pendingCanPlayHandler();
        }
      }, 12000);
    }

    playVideoAt(0);
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
    primeStoryVideos();
    preloadVideoAt(0);
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

  function advanceStoryLine() {
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

  function advanceIntro() {
    if (!active) return;
    if (typeof skipWormholeFrameFn === "function") {
      skipWormholeFrameFn();
      return;
    }
    advanceStoryLine();
  }

  function bindInput() {
    if (overlay.dataset.storyIntroBound === "1") return;
    overlay.dataset.storyIntroBound = "1";
    overlay.addEventListener("click", function () {
      primeStoryVideos();
      advanceIntro();
    });
    window.addEventListener(
      "keydown",
      function (e) {
        if (!active || !isEnterKey(e)) return;
        primeStoryVideos();
        e.preventDefault();
        e.stopPropagation();
        advanceIntro();
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
    primeStoryVideos();
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
