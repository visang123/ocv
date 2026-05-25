/** Network debug panel — script.js 에서 d 로 DOM·상태 주입 */
export function createModule(d) {
  function addNetworkDebugLog(message) {
  if (!d.networkDebugPanel || !message) return;
  const timestamp = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  d.networkDebugLines.push("[" + timestamp + "] " + message);
  while (d.networkDebugLines.length > 14) {
    d.networkDebugLines.shift();
  }
  d.networkDebugDomStale = true;
  refreshNetworkDebugPanelDom();
  }

  function refreshNetworkDebugPanelDom() {
  if (!d.networkDebugPanel || !d.networkDebugDomStale) {
    return;
  }
  if (isNetworkDebugPanelActiveTextSelection()) {
    return;
  }
  d.networkDebugPanel.textContent = d.networkDebugLines.join("\n");
  d.networkDebugDomStale = false;
  }

  function isNetworkDebugPanelActiveTextSelection() {
  if (!d.networkDebugPanel || !d.networkDebugPanel.classList.contains("is-visible")) {
    return false;
  }
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) {
    return false;
  }
  const anchor = sel.anchorNode;
  const focus = sel.focusNode;
  if (!anchor || !focus) {
    return false;
  }
  return d.networkDebugPanel.contains(anchor) && d.networkDebugPanel.contains(focus);
  }

  return {
    addNetworkDebugLog,
    refreshNetworkDebugPanelDom,
    isNetworkDebugPanelActiveTextSelection,
  };
}
