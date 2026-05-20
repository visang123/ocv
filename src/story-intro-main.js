import { createStoryIntro } from "./game/storyIntro.js";

const STORY_INTRO_COMPLETE_KEY = "storyIntroCompleteV1";
const CURRENT_USER_ID_KEY = "ovcCurrentUserIdV1";
const CACHE_BUST = "20260521a";

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

function resolveNextPage() {
  try {
    const next = new URLSearchParams(location.search).get("next");
    if (next === "index.html" || next === "tutorial.html") return next;
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
  const intro = createStoryIntro({
    storyIntroCompleteKey: STORY_INTRO_COMPLETE_KEY,
    getStoredFlag: getStoredFlag,
    setStoredFlag: function (key, enabled) {
      if (enabled !== false) setStoredFlag(key);
    },
    overlay: overlay,
    lineEl: lineEl,
    hintEl: hintEl
  });
  if (!intro.tryShow(redirectToGame)) {
    redirectToGame();
  }
}
