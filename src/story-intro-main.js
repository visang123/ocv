import {
  onboardingFlowDoneKey,
  onboardingFlowStepKey,
  everBeenToWorldKey
} from "./game/constants.js";
import { createStoryIntro } from "./game/storyIntro.js";

const STORY_INTRO_COMPLETE_KEY = "storyIntroCompleteV1";
const CURRENT_USER_ID_KEY = "ovcCurrentUserIdV1";
const CACHE_BUST = "20260523d";

function getCurrentUserId() {
  try {
    return (localStorage.getItem(CURRENT_USER_ID_KEY) || "").trim();
  } catch (e) {
    return "";
  }
}

function getScopedStorageKey(logicalKey) {
  const uid = getCurrentUserId();
  return uid ? "ovc-user-" + uid + ":" + logicalKey : logicalKey;
}

function getStoredFlag(logicalKey) {
  try {
    return localStorage.getItem(getScopedStorageKey(logicalKey)) === "true";
  } catch (e) {
    return false;
  }
}

function setStoredFlag(logicalKey) {
  try {
    localStorage.setItem(getScopedStorageKey(logicalKey), "true");
  } catch (e) {}
}

function getScopedValue(logicalKey) {
  try {
    return localStorage.getItem(getScopedStorageKey(logicalKey)) || "";
  } catch (e) {
    return "";
  }
}

/** ovc-login.js goToGame() 과 동일 — 첫 로그인만 tutorial, 완료 계정은 index */
function isTutorialOnboardingDoneForUser() {
  if (getStoredFlag(onboardingFlowDoneKey)) return true;
  if (getScopedValue(onboardingFlowStepKey) === "0") return true;
  if (getStoredFlag(everBeenToWorldKey)) return true;
  return false;
}

function resolveNextPage() {
  if (isTutorialOnboardingDoneForUser()) {
    return "index.html";
  }
  try {
    const next = new URLSearchParams(location.search).get("next");
    if (next === "tutorial.html") return "tutorial.html";
  } catch (e) {}
  return "tutorial.html";
}

function redirectToGame() {
  const target = new URL("./" + resolveNextPage(), location.href);
  target.searchParams.set("v", CACHE_BUST);
  target.searchParams.set("t", String(Date.now()));
  location.replace(target.toString());
}

const userId = getCurrentUserId();
if (!userId) {
  location.replace("./ovc-login.html?v=" + CACHE_BUST);
} else if (getStoredFlag(STORY_INTRO_COMPLETE_KEY)) {
  redirectToGame();
} else {
  const overlay = document.getElementById("story-intro-overlay");
  const lineEl = document.getElementById("story-intro-line");
  const hintEl = document.getElementById("story-intro-hint");
  const wormholeEl = document.getElementById("story-intro-wormhole");
  const wormholeStageEl = document.getElementById("story-intro-wormhole-stage");
  const intro = createStoryIntro({
    storyIntroCompleteKey: STORY_INTRO_COMPLETE_KEY,
    getStoredFlag: getStoredFlag,
    setStoredFlag: function (key, enabled) {
      if (enabled !== false) setStoredFlag(key);
    },
    overlay: overlay,
    lineEl: lineEl,
    hintEl: hintEl,
    wormholeEl: wormholeEl,
    wormholeStageEl: wormholeStageEl
  });
  if (!intro.tryShow(redirectToGame)) {
    redirectToGame();
  }
}
