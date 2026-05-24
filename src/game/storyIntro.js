/** 첫 로그인 세계관 인트로 — Enter로 한 줄씩 넘김 (로딩 화면과 분리) */
export const STORY_INTRO_OPENING_BG = "이미지/story-intro-bg-2300.png";
export const STORY_INTRO_WARMING_BG = "이미지/story-intro-bg-2325.png";
export const STORY_INTRO_TRAPPIST_BG = "이미지/story-intro-trappist-1e.png";
export const STORY_INTRO_DISTANCE_BG = "이미지/story-intro-distance-40ly.png";
export const STORY_INTRO_PORTAL_BG = "이미지/story-intro-portal-2350.png";
export const STORY_INTRO_PORTAL_TEST_BG = "이미지/story-intro-portal-2350.png";

/** 줄 인덱스별 배경(없으면 null) — object-fit: contain 으로 잘리지 않게 표시 */
export const STORY_INTRO_LINE_BACKGROUNDS = [
  STORY_INTRO_OPENING_BG,
  STORY_INTRO_WARMING_BG,
  STORY_INTRO_TRAPPIST_BG,
  STORY_INTRO_DISTANCE_BG,
  STORY_INTRO_PORTAL_BG,
  STORY_INTRO_PORTAL_TEST_BG,
  STORY_INTRO_PORTAL_BG,
  null
];

export const STORY_INTRO_LINES = [
  "서기 2300년...",
  "지구온난화를 겉잡을 수 없었다.",
  "트래피스트-1e로 이주만이 살길이였다.",
  "그러나 그곳은 40광년, 너무 멀었다.",
  "서기 2350년, 순간이동 포탈이 개발된다.",
  "지금 포탈 첫 이동 테스트를 한다!!",
  "게임속 포탈은 현실이 되었고 지구 사람들은 어떤 행성이든 이동하게 될 예정이다.",
  "지금은 최종 포탈 이동 테스트를 앞두고 있다!!"
];

const FADE_MS = 1400;
const HINT_BLINK_DELAY_MS = 2000;

export const STORY_INTRO_VIDEO_PATHS = [
  "이미지/story-intro-wormhole.mp4",
  "이미지/story-intro-2.mp4"
];

export function resolveStoryVideoUrl(relativePath) {
  try {
    return new URL(relativePath, window.location.href).href;
  } catch (e) {
    return relativePath;
  }
}

function isEnterKey(event) {
  return event.key === "Enter" || event.code === "NumpadEnter";
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
    wormholeStageEl,
    bgStageEl,
    bgImgEl
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
  const videoPreloaders = [];

  function primeStoryVideos() {
    if (videosPrimed) return;
    videosPrimed = true;
    STORY_INTRO_VIDEO_PATHS.forEach(function (relativePath) {
      const preloader = document.createElement("video");
      preloader.muted = true;
      preloader.preload = "auto";
      preloader.src = resolveStoryVideoUrl(relativePath);
      preloader.load();
      videoPreloaders.push(preloader);
    });
  }

  function prepareVideoElement(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }

  function tryPlayVideo(video) {
    prepareVideoElement(video);
    const playPromise = video.play();
    if (!playPromise || typeof playPromise.then !== "function") {
      return playPromise;
    }
    return playPromise.catch(function () {
      return new Promise(function (resolve) {
        window.setTimeout(function () {
          resolve(video.play());
        }, 120);
      });
    });
  }

  function whenVideoReady(video, callback) {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      callback();
      return;
    }
    function onReady() {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
      callback();
    }
    video.addEventListener("canplay", onReady);
    video.addEventListener("loadeddata", onReady);
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

  function getCurrentLineElement() {
    if (!lineEl) return null;
    return lineEl.querySelector(".story-intro-line") || lineEl;
  }

  function getLineBackground(lineIndex) {
    const bg = STORY_INTRO_LINE_BACKGROUNDS[lineIndex];
    return bg == null ? null : bg;
  }

  function setBgImageSrc(relativePath) {
    if (!bgImgEl || !relativePath) return;
    const resolved = resolveStoryVideoUrl(relativePath);
    try {
      const current = new URL(bgImgEl.currentSrc || bgImgEl.src, window.location.href);
      const next = new URL(resolved, window.location.href);
      if (current.pathname !== next.pathname) {
        bgImgEl.src = resolved;
      }
    } catch (e) {
      bgImgEl.src = resolved;
    }
  }

  function setOpeningBackground(visible) {
    if (overlay) {
      overlay.classList.toggle("has-opening-bg", Boolean(visible));
      if (!visible) {
        overlay.classList.remove(
          "has-opening-slide",
          "has-warming-bg",
          "has-trappist-bg",
          "has-distance-bg",
          "has-portal-bg",
          "has-portal-test-bg"
        );
      }
    }
    if (!bgStageEl) return;
    if (visible) {
      bgStageEl.hidden = false;
      bgStageEl.removeAttribute("hidden");
    } else {
      bgStageEl.hidden = true;
    }
  }

  function setLineBackground(lineIndex) {
    const src = getLineBackground(lineIndex);
    if (overlay) {
      overlay.classList.toggle("has-opening-slide", src === STORY_INTRO_OPENING_BG);
      overlay.classList.toggle("has-warming-bg", src === STORY_INTRO_WARMING_BG);
      overlay.classList.toggle("has-trappist-bg", src === STORY_INTRO_TRAPPIST_BG);
      overlay.classList.toggle("has-distance-bg", src === STORY_INTRO_DISTANCE_BG);
      overlay.classList.toggle("has-portal-bg", src === STORY_INTRO_PORTAL_BG);
      overlay.classList.toggle("has-portal-test-bg", src === STORY_INTRO_PORTAL_TEST_BG);
    }
    if (!src) {
      setOpeningBackground(false);
      return;
    }
    setBgImageSrc(src);
    setOpeningBackground(true);
  }

  function setLineBright() {
    const el = getCurrentLineElement();
    if (!el) return;
    el.classList.remove("is-dim");
    el.classList.add("is-bright");
  }

  function setLineDim() {
    const el = getCurrentLineElement();
    if (!el) return;
    el.classList.remove("is-bright");
    el.classList.add("is-dim");
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
    if (wormholeEl.tagName === "VIDEO") {
      wormholeEl.pause();
      wormholeEl.removeAttribute("src");
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
    setOpeningBackground(false);
  }

  function hideOverlay() {
    active = false;
    canAdvance = false;
    isTransitioning = false;
    clearTimers();
    overlay.classList.remove("is-visible");
    overlay.setAttribute("hidden", "");
    lineEl.hidden = false;
    lineEl.innerHTML = "";
    setOpeningBackground(false);
    hideHint();
    hideWormholeView();
    skipWormholeFrameFn = null;
  }

  function playWormholeSequence(onDone) {
    if (!wormholeEl || STORY_INTRO_VIDEO_PATHS.length === 0) {
      onDone();
      return;
    }
    lineEl.hidden = true;
    lineEl.innerHTML = "";
    lineEl.setAttribute("aria-hidden", "true");
    setOpeningBackground(false);
    hideHint();
    canAdvance = false;
    isTransitioning = true;
    overlay.classList.add("is-wormhole");
    if (wormholeStageEl) {
      wormholeStageEl.hidden = false;
      wormholeStageEl.removeAttribute("hidden");
    }

    let currentClipIndex = 0;

    function finishWormholeSequence() {
      clearWormholeTimer();
      skipWormholeFrameFn = null;
      isTransitioning = false;
      resetWormholeMedia();
      onDone();
    }

    skipWormholeFrameFn = function () {
      if (!active || !overlay.classList.contains("is-wormhole")) return;
      if (wormholeEl && wormholeEl.tagName === "VIDEO") {
        wormholeEl.onended = null;
        wormholeEl.onerror = null;
        wormholeEl.pause();
      }
      playVideoAt(currentClipIndex + 1);
    };

    if (wormholeEl.tagName !== "VIDEO") {
      finishWormholeSequence();
      return;
    }

    const video = wormholeEl;
    prepareVideoElement(video);

    function playVideoAt(index) {
      if (index >= STORY_INTRO_VIDEO_PATHS.length) {
        finishWormholeSequence();
        return;
      }
      currentClipIndex = index;
      let clipStarted = false;
      video.pause();
      video.onended = null;
      video.onerror = null;
      video.currentTime = 0;

      const src = resolveStoryVideoUrl(STORY_INTRO_VIDEO_PATHS[index]);
      if (!video.currentSrc || video.currentSrc !== src) {
        video.src = src;
      }
      video.load();

      function startClip() {
        if (clipStarted) return;
        clipStarted = true;
        clearWormholeTimer();
        video.onended = function () {
          playVideoAt(index + 1);
        };
        video.onerror = function () {
          playVideoAt(index + 1);
        };
        tryPlayVideo(video).catch(function () {
          playVideoAt(index + 1);
        });
      }

      whenVideoReady(video, startClip);
      clearWormholeTimer();
      wormholeTimerId = window.setTimeout(function () {
        wormholeTimerId = null;
        if (!clipStarted) {
          playVideoAt(index + 1);
        }
      }, 15000);
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
    if (!getLineBackground(lineIndex + 1)) {
      setOpeningBackground(false);
    }
    setLineDim();
    clearFadeTimer();
    fadeTimerId = setTimeout(function () {
      fadeTimerId = null;
      nextFn();
    }, FADE_MS);
  }

  function revealLine(idx) {
    lineIndex = idx;
    setLineBackground(idx);
    lineEl.innerHTML = "";
    const lineParagraph = document.createElement("p");
    lineParagraph.className = "story-intro-line";
    lineParagraph.textContent = STORY_INTRO_LINES[idx];
    lineEl.appendChild(lineParagraph);
    setLineDim();
    let lineRevealed = false;
    function revealLineText() {
      if (lineRevealed || !active) return;
      lineRevealed = true;
      setLineBright();
      showHintForCurrentLine();
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(revealLineText);
    });
    window.setTimeout(revealLineText, 32);
  }

  function endStoryTextThenWormhole() {
    primeStoryVideos();
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
    lineEl.innerHTML = "";
    lineEl.hidden = false;
    lineEl.removeAttribute("aria-hidden");
    hideHint();
    showOverlay();
    primeStoryVideos();
    STORY_INTRO_LINE_BACKGROUNDS.forEach(function (bg) {
      if (!bg) return;
      const img = new Image();
      img.decoding = "async";
      img.src = resolveStoryVideoUrl(bg);
    });
    showLine(0);
    return true;
  }

  return {
    tryShow,
    isActive,
    skipToEnd: finishIntro
  };
}
