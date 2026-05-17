const OPEN_UI_ROOT_IDS = [
  "world-chat-panel",
  "bag-discard-overlay",
  "logout-confirm-overlay",
  "settings-overlay",
  "controls-overlay",
  "admin-overlay",
  "character-select-overlay",
  "trade-exchange-overlay",
  "alchemy-craft-overlay",
  "bag-inventory-panel",
  "guide-card"
];

function isElementDisplayed(el) {
  if (!el) return false;
  return window.getComputedStyle(el).display !== "none";
}

export function isOpenUiRootElement(el) {
  if (!el || !el.id) return false;
  if (el.id === "world-chat-panel") {
    return el.classList.contains("is-open");
  }
  if (
    el.id === "settings-overlay" ||
    el.id === "controls-overlay" ||
    el.id === "admin-overlay" ||
    el.id === "logout-confirm-overlay" ||
    el.id === "character-select-overlay" ||
    el.id === "bag-discard-overlay"
  ) {
    return el.classList.contains("is-open");
  }
  return isElementDisplayed(el);
}

function getEffectiveZIndex(el) {
  let node = el;
  while (node && node !== document.body) {
    const z = Number.parseInt(window.getComputedStyle(node).zIndex, 10);
    if (!Number.isNaN(z)) return z;
    node = node.parentElement;
  }
  return 0;
}

export function collectOpenUiRoots() {
  const roots = [];
  for (let i = 0; i < OPEN_UI_ROOT_IDS.length; i += 1) {
    const el = document.getElementById(OPEN_UI_ROOT_IDS[i]);
    if (el && isOpenUiRootElement(el)) roots.push(el);
  }
  roots.sort(function (a, b) {
    return getEffectiveZIndex(b) - getEffectiveZIndex(a);
  });
  return roots;
}

function isVerticallyScrollable(el) {
  if (!(el instanceof Element)) return false;
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  if (overflowY !== "auto" && overflowY !== "scroll" && overflowY !== "overlay") {
    return false;
  }
  return el.scrollHeight > el.clientHeight + 1;
}

function findScrollableAncestor(el, boundary) {
  let node = el;
  while (node && node !== boundary && node !== document.documentElement) {
    if (isVerticallyScrollable(node)) return node;
    node = node.parentElement;
  }
  return null;
}

function findBestScrollableInRoot(root) {
  if (isVerticallyScrollable(root)) return root;
  const nodes = root.querySelectorAll("*");
  let best = null;
  let bestArea = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    const el = nodes[i];
    if (!isVerticallyScrollable(el)) continue;
    const area = el.clientWidth * el.clientHeight;
    if (area > bestArea) {
      bestArea = area;
      best = el;
    }
  }
  return best;
}

function findOpenUiRootForElement(el, openRoots) {
  let node = el;
  while (node) {
    if (openRoots.indexOf(node) >= 0) return node;
    node = node.parentElement;
  }
  return null;
}

function applyWheelScroll(el, event) {
  const maxScroll = el.scrollHeight - el.clientHeight;
  const next = el.scrollTop + event.deltaY;
  if (next <= 0) {
    el.scrollTop = 0;
    return;
  }
  if (next >= maxScroll) {
    el.scrollTop = maxScroll;
    return;
  }
  el.scrollTop = next;
}

function resolveScrollTarget(event, openRoots) {
  const hit = document.elementsFromPoint(event.clientX, event.clientY);
  for (let i = 0; i < hit.length; i += 1) {
    const root = findOpenUiRootForElement(hit[i], openRoots);
    if (!root) continue;
    return (
      findScrollableAncestor(hit[i], root) ||
      findBestScrollableInRoot(root)
    );
  }
  const topRoot = openRoots[0];
  return topRoot ? findBestScrollableInRoot(topRoot) : null;
}

/** 열린 UI가 있으면 휠로 해당 창을 스크롤하고 true. 없으면 false(월드 줌 처리). */
export function tryConsumeWheelForOpenUi(event) {
  const openRoots = collectOpenUiRoots();
  if (!openRoots.length) return false;

  event.preventDefault();

  const scrollTarget = resolveScrollTarget(event, openRoots);
  if (scrollTarget && scrollTarget.scrollHeight > scrollTarget.clientHeight) {
    applyWheelScroll(scrollTarget, event);
  }
  return true;
}
