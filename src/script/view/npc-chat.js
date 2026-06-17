/** View — NPC·채팅 말풍선. */

export function createModule(d) {
  function getWorldNpcPromptBubbleEl(npcEl) {
  if (!npcEl) return null;
  if (npcEl === d.plantMaster) return d.npcBubble;
  if (npcEl === d.tradeMaster) return d.tradeMasterBubble;
  if (npcEl === d.alchemyMaster) return d.alchemyMasterBubble;
  return null;
  }

  function layoutNpcSpeechBubble() {
  const bubbleWidth = d.npcBubble.offsetWidth || 48;
  const npcHeadTop = d.getNpcHeadTopWorldY(d.getNpc().y);
  const bubbleWorldY =
    speechBubbleTopWorldYFromHead(npcHeadTop, d.npcBubble, d.NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD) -
    d.NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  setNpcBubbleWorldPosition(
    d.getNpc().x + d.NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
  }

  function layoutWorldChatBubbleOnScreen(el, rect, nowMs, sessionIdForWobble) {
  if (!el || !rect || rect.width < 2 || rect.height < 2) return false;
  const pxPerWu = rect.width / d.PLAYER_WIDTH;
  const fontPx = Math.max(
    5,
    Math.min(52, (d.WORLD_CHAT_NAMEPLATE_FONT_PX / d.PLAYER_WIDTH) * rect.width)
  );
  const padV = Math.max(
    1,
    Math.round((d.WORLD_CHAT_NAMEPLATE_PAD_V / d.PLAYER_WIDTH) * rect.width)
  );
  const padH = Math.max(
    2,
    Math.round((d.WORLD_CHAT_NAMEPLATE_PAD_H / d.PLAYER_WIDTH) * rect.width)
  );
  const radius = Math.max(
    2,
    Math.round((d.WORLD_CHAT_NAMEPLATE_RADIUS_PX / d.PLAYER_WIDTH) * rect.width)
  );
  const maxW = Math.min(
    window.innerWidth * 0.42,
    Math.max(48, (d.WORLD_CHAT_BUBBLE_MAX_WORLD_PX / d.PLAYER_WIDTH) * rect.width)
  );
  el.style.fontSize = fontPx + "px";
  el.style.padding = padV + "px " + padH + "px";
  el.style.borderRadius = radius + "px";
  el.style.maxWidth = maxW + "px";
  const borderPx = Math.max(0.55, Math.min(2.2, 0.45 * pxPerWu));
  el.style.borderWidth = borderPx + "px";
  el.style.borderStyle = "solid";
  const w = worldChatBubbleWobble(sessionIdForWobble, nowMs);
  const wdx = w.dx * pxPerWu;
  const wdy = w.dy * pxPerWu;
  const bw = el.offsetWidth || 40;
  const bh = el.offsetHeight || Math.round(fontPx * 1.45);
  const gap = Math.max(0.5, 1.1 * pxPerWu);
  const nameplateLift = Math.max(10, rect.height * 0.28);
  const cx = rect.left + rect.width / 2;
  const sx = cx - bw / 2 + wdx;
  const sy = rect.top - bh - gap - nameplateLift + wdy;
  el.style.display = "block";
  el.style.transform =
    "translate(" + Math.round(sx) + "px, " + Math.round(sy) + "px)";
  return true;
  }

  function setLocalChatBubble(text, hideAt) {
  d.localChatBubbleText = text;
  d.localChatBubbleHideAt = hideAt;
  if (d.localChatBubbleTimer) {
    clearTimeout(d.localChatBubbleTimer);
    d.localChatBubbleTimer = null;
  }
  if (!text || !d.playerChatBubbleEl) return;
  d.playerChatBubbleEl.textContent = text;
  d.playerChatBubbleEl.style.display = "block";
  const delay = Math.max(0, hideAt - Date.now());
  d.localChatBubbleTimer = setTimeout(function () {
    d.localChatBubbleTimer = null;
    d.localChatBubbleText = "";
    d.localChatBubbleHideAt = 0;
    if (d.playerChatBubbleEl) d.playerChatBubbleEl.style.display = "none";
  }, delay);
  }

  function setNpcBubbleWorldPosition(worldX, worldY) {
  setSpeechBubbleTransform(d.npcBubble, worldX, worldY);
  }

  function setPlayerBubbleWorldPosition(worldX, worldY) {
  const px = Math.round(d.toScreenX(worldX));
  const py = Math.round(d.toScreenY(worldY));
  const n = Math.round(d.SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  d.playerBubble.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
  }

  function setSpeechBubbleTransform(bubbleEl, worldX, worldY) {
  if (!bubbleEl) return;
  const px = Math.round(d.toScreenX(worldX));
  const py = Math.round(d.toScreenY(worldY));
  const n = Math.round(d.SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  bubbleEl.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
  }

  function setWorldChatPanelOpen(nextOpen) {
  d.worldChatPanelOpen = Boolean(nextOpen);
  if (!d.worldChatPanelOpen) {
    d.closeWorldChatUserPicker();
  }
  if (!d.worldChatPanelEl) return;
  d.worldChatPanelEl.classList.toggle("is-open", d.worldChatPanelOpen);
  d.worldChatPanelEl.setAttribute("aria-hidden", d.worldChatPanelOpen ? "false" : "true");
  if (d.worldChatPanelOpen && d.worldChatInputEl) {
    d.resetInputKeys(d.keys);
    d.isInteractKeyLatched = false;
    d.worldChatInputEl.focus();
  }
  }

  function setWorldChatUserPickerOpen(open) {
  d.worldChatUsersPickerOpen = Boolean(open);
  if (d.worldChatUserPickerEl) {
    d.worldChatUserPickerEl.classList.toggle("is-open", d.worldChatUsersPickerOpen);
    d.worldChatUserPickerEl.setAttribute(
      "aria-hidden",
      d.worldChatUsersPickerOpen ? "false" : "true"
    );
  }
  }

  function shouldShowIncomingWorldChatPayload(payload) {
  const kind = payload.chatKind === "whisper" ? "whisper" : "world";
  if (kind !== "whisper") return true;
  const ids = payload.whisperToIds;
  const mySid = d.currentSessionId ? String(d.currentSessionId) : "";
  if (Array.isArray(ids) && mySid && ids.some(function (id) { return String(id) === mySid; })) {
    return true;
  }
  const names = payload.whisperToNames;
  const myName = d.nameForIngameUiDisplay(d.accountDisplayNameForUi());
  if (Array.isArray(names) && names.some(function (n) { return d.nameForIngameUiDisplay(n) === myName; })) {
    return true;
  }
  return false;
  }

  function showWorldNpcHoverLabel(text, anchorEl) {
  if (!d.plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  d.worldNpcHoverAnchorEl = anchorEl;
  d.ensurePlantHoverLabelOnBodyForFixedUi();
  d.plantHoverLabel.classList.remove(
    "is-seed-inventory-hint",
    "is-stage3-complete",
    "is-well-dock",
    "is-ui-shortcut-hint",
    "is-plant-world-sign",
    "is-dry",
    "is-overwatered"
  );
  d.plantHoverLabel.classList.add("is-world-npc-name");
  if (d.plantHoverLabel.textContent !== text) {
    d.plantHoverLabel.textContent = text;
  }
  d.plantHoverLabel.style.display = "block";
  d.plantHoverLabel.style.position = "fixed";
  d.plantHoverLabel.style.transform = "none";
  d.plantHoverLabel.style.height = "";
  d.plantHoverLabel.style.width = "";
  d.plantHoverLabel.style.minWidth = "";
  d.plantHoverLabel.style.right = "";
  d.syncWorldNpcHoverLabelPosition(anchorEl);
  }

  function speechBubbleTopWorldYFromHead(headTopWorldY, bubbleElement, gapAboveHeadWorld) {
  const gap =
    gapAboveHeadWorld != null ? gapAboveHeadWorld : d.SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD;
  const bhWorld = d.groundScreenPxToWorldY(bubbleElement.offsetHeight || 12);
  return headTopWorldY - gap - bhWorld;
  }

  function updateNpcPosition() {
  if (!d.isPlantMasterVisible()) {
    if (d.plantMaster) d.plantMaster.style.display = "none";
    d.npcBubble.style.display = "none";
    if (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen()) {
      d.closePlantMasterSeedShop();
    }
  } else {
    d.plantMaster.style.display = "block";
    d.setWorldPosition(d.plantMaster, d.getNpc().x, d.getNpc().y);
    if (d.npcBubble.style.display === "block") {
      layoutNpcSpeechBubble();
    }
    updateNpcPrompt();
  }

  if (d.tradeMaster) {
    if (d.isTradeMasterVisible()) {
      d.tradeMaster.style.display = "block";
      d.setWorldPosition(d.tradeMaster, d.TRADE_MASTER_START_X, d.TRADE_MASTER_START_Y);
      d.updateTradeNpcPrompt();
    } else {
      d.tradeMaster.style.display = "none";
      if (d.tradeMasterBubble) d.tradeMasterBubble.style.display = "none";
      if (d.isTradeExchangeOpen()) d.closeTradeExchangePanel();
    }
  }

  if (d.alchemyMaster) {
    if (d.isAlchemyMasterVisible()) {
      d.alchemyMaster.style.display = "block";
      d.setWorldPosition(d.alchemyMaster, d.ALCHEMY_MASTER_START_X, d.ALCHEMY_MASTER_START_Y);
      d.updateAlchemyNpcPrompt();
    } else {
      d.alchemyMaster.style.display = "none";
      if (d.alchemyMasterBubble) d.alchemyMasterBubble.style.display = "none";
    }
  }

  if (d.playerBubble.style.display === "block") {
    d.updatePlayerBubblePosition();
  } else {
    d.playerBubble.classList.remove("is-in-front-of-name");
  }

  if (d.worldNpcHoverAnchorEl) {
    d.syncWorldNpcHoverLabelPosition(d.worldNpcHoverAnchorEl);
  }
  }

  function updateNpcPrompt() {
  if (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen()) {
    if (typeof d.updatePlantMasterSeedShopProximity === "function") {
      d.updatePlantMasterSeedShopProximity();
    }
    return;
  }
  if (d.getNpc().isDialogueRunning || d.isAlchemyMasterDialogueRunning()) return;

  if (d.isNearPlantMaster()) {
    if (d.getNpc().isDialogueComplete) {
      d.npcBubble.dataset.speaker = "npc";
      d.npcBubble.classList.add("is-seed-shop-prompt");
      d.npcBubble.textContent =
        "\uC528\uC557\uC774 \uD544\uC694\uD55C\uAC00?\n(q\uB97C \uB20C\uB7EC \uC528\uC557 \uAD6C\uB9E4)";
      d.npcBubble.style.display = "block";
      layoutNpcSpeechBubble();
      window.clearTimeout(d.getNpc().promptHideTimeout);
      return;
    }

    d.npcBubble.classList.remove("is-seed-shop-prompt");
    if (d.npcBubble.dataset.promptShown === "true") return;

    d.npcBubble.dataset.speaker = "npc";
    d.npcBubble.dataset.promptShown = "true";
    d.npcBubble.textContent = "\uC790\uB124 \uC2DD\uBB3C\uC758 \uB2EC\uC778\uC774 \uB418\uC5B4 \uBCF4\uC9C0 \uC54A\uACA0\uB098?";
    d.npcBubble.style.display = "block";
    layoutNpcSpeechBubble();

    window.clearTimeout(d.getNpc().promptHideTimeout);
    d.getNpc().promptHideTimeout = window.setTimeout(function () {
      if (!d.getNpc().isDialogueRunning) {
        d.npcBubble.style.display = "none";
      }
    }, 5000);
  } else if (d.npcBubble.dataset.speaker !== "player") {
    d.npcBubble.classList.remove("is-seed-shop-prompt");
    d.npcBubble.style.display = "none";
    d.npcBubble.dataset.promptShown = "false";
    window.clearTimeout(d.getNpc().promptHideTimeout);
  }
  }

  function worldChatBubbleWobble(sessionIdForPhase, nowMs) {
  let phase = 0;
  const sid = sessionIdForPhase != null ? String(sessionIdForPhase) : "";
  if (sid) {
    for (let i = 0; i < sid.length; i++) phase += sid.charCodeAt(i);
  } else {
    phase = 204821;
  }
  const t = nowMs * 0.0042 + phase * 0.017;
  return {
    dx: Math.cos(t * 0.79) * 2.2,
    dy: Math.sin(t) * 4.0
  };
  }

  return {
    getWorldNpcPromptBubbleEl,
    layoutNpcSpeechBubble,
    layoutWorldChatBubbleOnScreen,
    setLocalChatBubble,
    setNpcBubbleWorldPosition,
    setPlayerBubbleWorldPosition,
    setSpeechBubbleTransform,
    setWorldChatPanelOpen,
    setWorldChatUserPickerOpen,
    shouldShowIncomingWorldChatPayload,
    showWorldNpcHoverLabel,
    speechBubbleTopWorldYFromHead,
    updateNpcPosition,
    updateNpcPrompt,
    worldChatBubbleWobble,
  };
}
