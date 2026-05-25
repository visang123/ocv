/**
 * GitHub Pages(project site)는 /ocv/ 아래에 배포됩니다.
 * 루트(visang123.github.io/)로 열면 style.css·src/main.js가 404 → CSS/JS 미적용처럼 보입니다.
 */
(function () {
  var repoBase = "/ocv/";
  var path = location.pathname || "/";
  var onGhPages =
    location.hostname === "visang123.github.io" ||
    location.hostname.endsWith(".github.io");

  if (!onGhPages) return;

  if (path.indexOf(repoBase) !== 0) {
    var file = path === "/" || path === "/index.html" ? "index.html" : path.replace(/^\//, "");
    location.replace(repoBase + file + location.search + location.hash);
    return;
  }

  if (!document.querySelector("base[data-ovc-github-pages]")) {
    var baseEl = document.createElement("base");
    baseEl.setAttribute("data-ovc-github-pages", "1");
    baseEl.href = repoBase;
    var head = document.head || document.getElementsByTagName("head")[0];
    if (head) head.insertBefore(baseEl, head.firstChild);
  }
})();
