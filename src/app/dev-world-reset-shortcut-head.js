/**
 * index.html <head>에서 먼저 로드 — Ctrl+Shift+R / Ctrl+Alt+R (월드 전용)
 * 모듈 로드 전에도 단축키를 잡고, 로드 후 resetGameForTesting에 연결한다.
 */
(function (global) {
  function hasAltModifier(e) {
    if (e.altKey) return true;
    if (typeof e.getModifierState !== "function") return false;
    return e.getModifierState("Alt") || e.getModifierState("AltGraph");
  }

  function isWorldMapDevResetShortcut(e) {
    if (e.repeat) return false;
    if (!(e.ctrlKey || e.metaKey)) return false;
    var isR =
      e.code === "KeyR" ||
      e.key === "r" ||
      e.key === "R" ||
      e.keyCode === 82;
    if (!isR) return false;
    if (e.shiftKey) return true;
    if (hasAltModifier(e)) return true;
    return false;
  }

  global.__ovcIsWorldMapDevResetShortcut = isWorldMapDevResetShortcut;

  global.addEventListener(
    "keydown",
    function (e) {
      if (!isWorldMapDevResetShortcut(e)) return;
      if (global.OVC_ENTRY === "tutorial") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (typeof global.__ovcResetGameForTesting === "function") {
        global.__ovcResetGameForTesting();
        return;
      }
      try {
        global.sessionStorage.setItem("ovcPendingDevWorldResetV1", "1");
      } catch (err) {}
    },
    true
  );
})(window);
