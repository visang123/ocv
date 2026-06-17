/**
 * Entry module. Catches login redirect throw so CSS still applies if script.js aborts early.
 */
(async function ovcBootMain() {
  try {
    await import("../script.js?v=20260613f");
  } catch (err) {
    if (err && err.message === "OVC login required") {
      return;
    }
    console.error("[OVC] boot failed:", err);
    try {
      document.body.classList.add("is-game-ready");
      var el = document.getElementById("app-loading-screen");
      if (el) {
        el.hidden = true;
        el.setAttribute("aria-hidden", "true");
      }
    } catch (e2) {}
  }
})();
