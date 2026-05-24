/**
 * index.html / tutorial.html <head> — Ctrl+Alt+R / F9
 * Ctrl+Shift+R 은 브라우저 강력 새로고침용으로 비워 둠.
 */
(function (global) {
  function hasAltModifier(e) {
    if (e.altKey) return true;
    if (typeof e.getModifierState !== "function") return false;
    return e.getModifierState("Alt") || e.getModifierState("AltGraph");
  }

  function isRKey(e) {
    var key = e.keyCode || e.which;
    return (
      e.code === "KeyR" ||
      e.key === "r" ||
      e.key === "R" ||
      key === 82
    );
  }

  function isWorldMapDevResetShortcut(e) {
    if (e.repeat) return false;
    if (e.code === "F9") return true;
    if (!isRKey(e)) return false;
    var ctrlOrMeta = e.ctrlKey || e.metaKey;
    var altMod = hasAltModifier(e);
    if (ctrlOrMeta && altMod) return true;
    return false;
  }

  function isWorldHubPage() {
    if (global.OVC_ENTRY === "tutorial") return false;
    try {
      var path = (global.location.pathname || "").toLowerCase();
      if (path.indexOf("tutorial") !== -1) return false;
    } catch (pathErr) {}
    return true;
  }

  function isTutorialPage() {
    if (global.OVC_ENTRY === "tutorial") return true;
    try {
      var path = (global.location.pathname || "").toLowerCase();
      if (path.indexOf("tutorial") !== -1) return true;
    } catch (pathErr2) {}
    return false;
  }

  function triggerDevWorldReset(e) {
    if (!isWorldMapDevResetShortcut(e)) return false;
    if (!isWorldHubPage()) return false;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (typeof global.__ovcResetGameForTesting === "function") {
      global.__ovcResetGameForTesting();
    } else {
      try {
        global.sessionStorage.setItem("ovcPendingDevWorldResetV1", "1");
      } catch (storeErr) {}
    }
    return true;
  }

  function triggerDevTutorialReset(e) {
    if (!isWorldMapDevResetShortcut(e)) return false;
    if (!isTutorialPage()) return false;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (typeof global.__ovcResetTutorialForTesting === "function") {
      global.__ovcResetTutorialForTesting();
    } else {
      try {
        global.sessionStorage.setItem("ovcPendingDevTutorialResetV1", "1");
      } catch (storeErr2) {}
    }
    return true;
  }

  function triggerDevReset(e) {
    if (triggerDevTutorialReset(e)) return true;
    if (triggerDevWorldReset(e)) return true;
    return false;
  }

  global.__ovcIsWorldMapDevResetShortcut = isWorldMapDevResetShortcut;

  function onKeyDown(e) {
    triggerDevReset(e);
  }

  global.addEventListener("keydown", onKeyDown, true);
  if (global.document) {
    global.document.addEventListener("keydown", onKeyDown, true);
  }

  var pollCount = 0;
  var pollId = global.setInterval(function () {
    pollCount += 1;
    if (pollCount > 200) {
      global.clearInterval(pollId);
      return;
    }
    try {
      if (isTutorialPage()) {
        if (global.sessionStorage.getItem("ovcPendingDevTutorialResetV1") !== "1") {
          return;
        }
        if (typeof global.__ovcResetTutorialForTesting !== "function") return;
        global.sessionStorage.removeItem("ovcPendingDevTutorialResetV1");
        global.__ovcResetTutorialForTesting();
        return;
      }
      if (!isWorldHubPage()) return;
      if (global.sessionStorage.getItem("ovcPendingDevWorldResetV1") !== "1") return;
      if (typeof global.__ovcResetGameForTesting !== "function") return;
      global.sessionStorage.removeItem("ovcPendingDevWorldResetV1");
      global.__ovcResetGameForTesting();
    } catch (pollErr) {}
  }, 250);
})(window);
