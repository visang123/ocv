/** Minimal DOM mock then import script.js */
const el = () => ({
  style: {},
  classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  appendChild() {},
  remove() {},
  setAttribute() {},
  getAttribute() { return null; },
  addEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; },
  getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; },
  dataset: {},
  hidden: false,
  textContent: "",
  innerHTML: "",
  src: "",
});
globalThis.document = {
  getElementById: () => el(),
  querySelector: () => el(),
  querySelectorAll: () => [],
  createElement: () => el(),
  body: el(),
  documentElement: el(),
  addEventListener() {},
};
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.sessionStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.performance = { now: () => Date.now() };
globalThis.setTimeout = globalThis.setTimeout || (() => 0);
globalThis.clearTimeout = () => {};
globalThis.requestAnimationFrame = (fn) => { fn(); return 0; };
globalThis.Image = class Image { constructor() { this.onload = null; this.onerror = null; } };
globalThis.confirm = () => true;
globalThis.alert = () => {};
globalThis.location = { replace() {}, href: "http://localhost/index.html", pathname: "/index.html" };
globalThis.localStorage.setItem("ovcCurrentUserIdV1", "test-user");
globalThis.OVC_ONLINE_CONFIG = { multiplayerRoom: "ovc-main-room" };
globalThis.OVC_ENTRY = "world";

try {
  await import("../script.js");
  console.log("script.js loaded OK");
} catch (e) {
  console.error("LOAD FAILED:", e.message);
  console.error((e.stack || "").split("\n").slice(0, 15).join("\n"));
  process.exit(1);
}
