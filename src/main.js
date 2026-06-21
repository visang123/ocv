/**
 * Entry module. Catches login redirect throw so CSS still applies if script.js aborts early.
 */
(async function ovcBootMain() {
  try {
    await import("../script.js?v=20260621a");
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
      if (!document.getElementById("ovc-boot-error")) {
        var msg = document.createElement("div");
        msg.id = "ovc-boot-error";
        msg.setAttribute("role", "alert");
        msg.style.cssText =
          "position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(7,16,31,.94);color:#f8fbff;font:700 15px/1.55 Arial,sans-serif;text-align:center;";
        var detail = err && err.message ? String(err.message) : "알 수 없는 오류";
        msg.innerHTML =
          "게임 JavaScript를 불러오지 못했습니다.<br>" +
          '<span style="font-weight:400;opacity:.88">' +
          detail.replace(/</g, "&lt;") +
          "</span><br>" +
          '<span style="font-weight:400;opacity:.72;font-size:12px;margin-top:10px;display:block">' +
          "로컬 테스트: <code style=\"opacity:1\">node server.js</code> 후 " +
          "<code style=\"opacity:1\">http://localhost:5173</code> · F12 콘솔 확인" +
          "</span>";
        document.body.appendChild(msg);
      }
    } catch (e2) {}
  }
})();
