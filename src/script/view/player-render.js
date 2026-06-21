/** View — 로컬 플레이어 DOM·transform. */

export function createModule(d) {
  function getPlayerRenderedHeight() {
  if (d.getPlayer().sittingChairId) {
    return d.player.offsetHeight || d.PLAYER_SIT_HEIGHT;
  }
  return d.player.offsetHeight || d.PLAYER_HEIGHT;
  }

  function renderPlayerPosition() {
  d.setWorldPosition(d.localPlayerRoot, d.getPlayer().x, d.getPlayerWorldY());
  updatePlayerColorBodyPosition();
  if (d.playerPositionChangedThisTick) {
    d.refreshPlantHoverAfterPlayerMove();
  }
  }

  function syncCharacterPreviewVisual(color) {
  if (!d.characterPreview) return;
  const normalized = d.normalizeHexColor(color) || "#ffffff";
  let img = d.characterPreview.querySelector("img");
  if (!img) {
    img = document.createElement("img");
    img.alt = "";
    img.draggable = false;
    d.characterPreview.replaceChildren(img);
    d.characterPreview.classList.add("has-tinted-preview");
  }
  const applySrc = function () {
    img.src = d.getTintedPlayerSrc(normalized, false);
    img.classList.toggle("needs-outline", d.needsDarkOutline(normalized));
  };
  if (d.playerBaseImageReady) {
    applySrc();
  } else {
    img.src = d.PLAYER_BASE_IMAGE_SRC;
    d.playerBaseImage.addEventListener("load", applySrc, { once: true });
  }
  }

  function syncLocalPlayerInsideCraftHouseVisual() {
  if (!d.localPlayerRoot) return;
  const inside = d.isPlayerInsideEnteredCraftHouse();
  d.localPlayerRoot.classList.toggle("is-inside-craft-house", inside);
  if (d.player) {
    d.player.classList.toggle("is-inside-craft-house", inside);
  }
  }

  function syncLocalPlayerPoseVisual() {
  if (!d.player || !d.localPlayerRoot) return;
  const sitting = Boolean(d.getPlayer().sittingChairId);
  const bodyW = sitting ? d.PLAYER_SIT_WIDTH : d.PLAYER_WIDTH;
  const bodyH = sitting ? d.PLAYER_SIT_HEIGHT : d.PLAYER_HEIGHT;
  d.player.classList.toggle("is-sitting", sitting);
  d.setWorldSize(d.localPlayerRoot, bodyW, sitting ? bodyH : undefined);
  d.setWorldSize(d.playerColorBody, bodyW, bodyH);
  if (d.shouldApplyLocalPlayerTint()) {
    d.player.src = d.getTintedPlayerSrc(d.selectedPlayerColor, sitting);
    d.player.classList.toggle("needs-outline", d.needsDarkOutline(d.selectedPlayerColor));
    d.player.classList.add("is-colorized");
  } else {
    d.player.src = sitting ? d.getTintedPlayerSrc("#ffffff", true) : d.playerBaseImage.src;
    d.player.classList.remove("is-colorized");
  }
  }

  function syncLocalPlayerVisibility() {
  if (!d.player || !d.localPlayerRoot) return;
  d.localPlayerRoot.style.display = "block";
  if (d.hasSpawnedCharacter) {
    d.player.classList.remove("is-hidden-before-spawn");
    d.player.style.display = "block";
    if (!d.player.getAttribute("src")) {
      d.player.src = d.PLAYER_BASE_IMAGE_SRC;
    }
    return;
  }
  d.player.style.display = "";
  d.player.classList.add("is-hidden-before-spawn");
  }

  function togglePlayerHealthGaugeVisible() {
  d.getPlayer().healthGaugeVisible = !d.getPlayer().healthGaugeVisible;
  d.savePlayerHealthState();
  updatePlayerHealthUi();
  }

  function updatePlayerAlert() {
  if (d.playerAlert.style.display !== "block") return;

  if (d.playerAlert.classList.contains("is-butterfly-catch")) {
    const playerBodyLogicH = d.groundScreenPxToWorldY(
      d.player.offsetHeight || d.PLAYER_HEIGHT
    );
    const playerWorldTop =
      d.GROUND_WORLD_HEIGHT - playerBodyLogicH - d.getPlayer().depth + d.getPlayer().jumpY;
    const alertWidth = d.playerAlert.offsetWidth || 36;
    const alertWorldY = d.speechBubbleTopWorldYFromHead(
      playerWorldTop,
      d.playerAlert,
      d.SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    );
    d.setSpeechBubbleTransform(
      d.playerAlert,
      d.getPlayer().x + d.PLAYER_WIDTH / 2 - alertWidth / 2,
      alertWorldY
    );
    return;
  }

  const playerBox = d.getPlayerBox();
  const alertWidth = d.playerAlert.offsetWidth || 10;
  const alertHeight = d.playerAlert.offsetHeight || 10;
  const x = d.toScreenX(playerBox.left + playerBox.width / 2) - alertWidth / 2;
  const y = d.toScreenY(playerBox.top) - alertHeight - 4;
  d.playerAlert.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  function updatePlayerBubblePosition() {
  const playerWorldLeft = d.getPlayer().x;
  const playerBodyLogicH = d.groundScreenPxToWorldY(
    d.player.offsetHeight || d.PLAYER_HEIGHT
  );
  const playerWorldTop =
    d.GROUND_WORLD_HEIGHT - playerBodyLogicH - d.getPlayer().depth + d.getPlayer().jumpY;
  d.playerBubble.style.width = "";
  void d.playerBubble.offsetWidth;
  const bw = d.playerBubble.offsetWidth || d.playerBubble.scrollWidth || 36;
  const bubbleWorldY =
    d.speechBubbleTopWorldYFromHead(playerWorldTop, d.playerBubble) -
    d.PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD;
  d.playerBubble.classList.toggle(
    "is-in-front-of-name",
    Boolean(
      (d.getNpc().isDialogueRunning || d.isAlchemyMasterDialogueRunning()) &&
        d.playerBubble.style.display === "block"
    )
  );
  d.setPlayerBubbleWorldPosition(
    playerWorldLeft + d.PLAYER_WIDTH / 2 - bw / 2,
    bubbleWorldY
  );
  }

  function updatePlayerChatBubbleOverlay() {
  if (!d.playerChatBubbleEl) return;
  const now = Date.now();
  if (!d.localChatBubbleText || now >= d.localChatBubbleHideAt) {
    d.playerChatBubbleEl.style.display = "none";
    if (now >= d.localChatBubbleHideAt) d.localChatBubbleText = "";
    return;
  }
  if (!d.hasSpawnedCharacter || d.isCharacterSelecting) {
    d.playerChatBubbleEl.style.display = "none";
    return;
  }
  const rect = d.player.getBoundingClientRect();
  if (!d.layoutWorldChatBubbleOnScreen(d.playerChatBubbleEl, rect, now, null)) {
    d.playerChatBubbleEl.style.display = "none";
  }
  }

  function updatePlayerColorBodyPosition() {
  // Keep legacy overlay disabled; color is rendered directly on #player image.
  d.playerColorBody.style.display = "none";
  if (!d.hasSpawnedCharacter || d.player.classList.contains("is-hidden-before-spawn")) return;
  }

  function updatePlayerHealthUi() {
  if (!d.playerHealthRoot) return;
  const rockMiningActive = Boolean(String(d.getPlayer().rockMiningRockId || ""));
  if (
    !d.hasSpawnedCharacter ||
    !d.player ||
    d.player.classList.contains("is-hidden-before-spawn") ||
    d.isPlayerInsideEnteredCraftHouse() ||
    rockMiningActive
  ) {
    d.playerHealthRoot.style.display = "none";
    return;
  }
  d.playerHealthRoot.style.display = "flex";
  const hp = d.clampPlayerHealth(d.getPlayer().health);
  const pct = Math.max(0, Math.min(100, (hp / d.PLAYER_MAX_HEALTH) * 100));
  if (d.playerHealthGaugeFill) {
    d.playerHealthGaugeFill.style.width = pct + "%";
  }
  if (d.playerHealthGaugeLabel) {
    d.playerHealthGaugeLabel.textContent = String(hp);
  }
  if (d.playerHealthGaugeEl) {
    d.playerHealthGaugeEl.hidden = !d.getPlayer().healthGaugeVisible;
    d.playerHealthGaugeEl.setAttribute("aria-hidden", d.getPlayer().healthGaugeVisible ? "false" : "true");
  }
  if (d.playerHealthHeartBtn) {
    d.playerHealthHeartBtn.classList.toggle("is-active", d.getPlayer().healthGaugeVisible);
    d.playerHealthHeartBtn.setAttribute("aria-pressed", d.getPlayer().healthGaugeVisible ? "true" : "false");
  }
  if (d.player) {
    d.player.classList.toggle("is-health-recharging", d.isPlayerHealthDepleted(hp));
  }
  if (d.localPlayerRoot) {
    d.localPlayerRoot.classList.toggle("is-health-recharging", d.isPlayerHealthDepleted(hp));
  }
  if (
    d.isPlayerHealthDepleted(hp) &&
    (d.isTradeExchangeOpen() || d.isTradeMasterDialogueRunning())
  ) {
    d.cancelTradeOnPlayerHealthDepleted();
  }
  }

  function updatePlayerName() {
  if (!d.playerName) return;
  const rockMiningActive = Boolean(String(d.getPlayer().rockMiningRockId || ""));
  if (
    !d.player ||
    d.player.classList.contains("is-hidden-before-spawn") ||
    rockMiningActive
  ) {
    d.playerName.style.display = "none";
    d.playerName.classList.remove("is-dialogue-layer");
    return;
  }

  d.playerName.textContent = d.nameForIngameUiDisplay(d.accountDisplayNameForUi() || "OVC");
  d.playerName.style.display = "block";
  d.playerName.style.position = "";
  d.playerName.style.left = "";
  d.playerName.style.top = "";
  d.playerName.style.right = "";
  d.playerName.style.bottom = "";
  d.playerName.style.margin = "";
  d.playerName.style.transform = "";
  d.playerName.style.visibility = "";

  const npcLineShowing =
    d.getNpc().isDialogueRunning && d.npcBubble.style.display === "block";
  d.playerName.classList.toggle("is-dialogue-layer", npcLineShowing);
  }

  function updatePlayerStatus() {
  const playerBox = d.getPlayerBox();
  const textWidth = d.playerStatus.offsetWidth || 40;
  const halfTextWidth = textWidth / 2;
  const targetX = d.toScreenX(playerBox.left + playerBox.width / 2 + 13);
  const clampedX = Math.max(
    halfTextWidth,
    Math.min(targetX, window.innerWidth - halfTextWidth)
  );
  const rockMiningRockId = String(d.getPlayer().rockMiningRockId || "");
  const rockMiningActive = rockMiningRockId !== "";
  const statusAnchorY = rockMiningActive ? playerBox.top + 18 : playerBox.top + 26;
  const statusTransformY = rockMiningActive ? "-40%" : "-100%";
  const yWorld = d.toScreenY(statusAnchorY);

  if (rockMiningActive && typeof d.syncRockMiningStatusUi === "function") {
    d.syncRockMiningStatusUi(true);
  } else if (
    !rockMiningActive &&
    d.playerStatus &&
    d.playerStatus.classList.contains("is-rock-mining") &&
    typeof d.syncRockMiningStatusUi === "function"
  ) {
    d.syncRockMiningStatusUi(false);
  }

  if (d.isPlayerTimedActionBusy() || rockMiningActive) {
    d.playerStatus.style.display = rockMiningActive ? "flex" : "block";
    d.playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, " + statusTransformY + ")";
    return;
  }

  if (Date.now() < d.plantProximityWarnUntil) {
    d.playerStatus.style.display = "block";
    d.playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, " + statusTransformY + ")";
    return;
  }

  d.playerStatus.style.display = "none";
  }

  return {
    getPlayerRenderedHeight,
    renderPlayerPosition,
    syncCharacterPreviewVisual,
    syncLocalPlayerInsideCraftHouseVisual,
    syncLocalPlayerPoseVisual,
    syncLocalPlayerVisibility,
    togglePlayerHealthGaugeVisible,
    updatePlayerAlert,
    updatePlayerBubblePosition,
    updatePlayerChatBubbleOverlay,
    updatePlayerColorBodyPosition,
    updatePlayerHealthUi,
    updatePlayerName,
    updatePlayerStatus,
  };
}
