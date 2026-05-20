/**
 * index.html <head> — Ctrl+Alt+R / F9 (월드 전용)
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

  global.__ovcIsWorldMapDevResetShortcut = isWorldMapDevResetShortcut;

  function onKeyDown(e) {
    triggerDevWorldReset(e);
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
      if (global.sessionStorage.getItem("ovcPendingDevWorldResetV1") !== "1") return;
      if (typeof global.__ovcResetGameForTesting !== "function") return;
      if (!isWorldHubPage()) return;
      global.sessionStorage.removeItem("ovcPendingDevWorldResetV1");
      global.__ovcResetGameForTesting();
    } catch (pollErr) {}
  }, 250);
})(window);
