/** @type {Record<string, any>} */
let host = null;

let running = false;
let complete = false;
let promptHideTimeout = null;

export function bindAlchemyMaster(h) {
  host = h;
}

export function hydrateAlchemyMasterDialogueComplete(flag) {
  complete = Boolean(flag);
}

export function isAlchemyMasterDialogueComplete() {
  return complete;
}

export function isAlchemyMasterDialogueRunning() {
  return running;
}

export function isNearAlchemyMaster() {
  if (!host || !host.isAlchemyMasterVisible()) return false;
  return (
    host.getCenterDistance(
      host.ALCHEMY_MASTER_START_X,
      host.ALCHEMY_MASTER_START_Y,
      host.NPC_WIDTH,
      host.NPC_HEIGHT
    ) < host.npcInteractDistance
  );
}

export function tryTalkToAlchemyMaster() {
  if (!host || !isNearAlchemyMaster() || running) return false;
  if (!complete) {
    startAlchemyMasterDialogue();
    return true;
  }
  return true;
}

export function updateAlchemyNpcPrompt() {
  if (!host || !host.alchemyMasterBubble) return;
  if (
    running ||
    (host.isNpcDialogueRunning && host.isNpcDialogueRunning()) ||
    (host.isTradeMasterDialogueRunning && host.isTradeMasterDialogueRunning())
  ) {
    return;
  }

  if (isNearAlchemyMaster()) {
    const promptText = complete
      ? "\uC9C0\uAE08 \uB9C8\uBC95\uC744 \uBD10\uB3C4 \uAD1C\uCC2E\uACA0\uB098?\n(q\uB97C \uB20C\uB7EC \uBCF4\uAE30)"
      : "\uC624\uD638\uB77C..\uC774\uAC74\uB610 \uC2E0\uAE30\uD558\uAD6C..";
    if (!complete) {
      if (host.alchemyMasterBubble.dataset.promptShown === "true") return;
      host.alchemyMasterBubble.dataset.promptShown = "true";
    }
    host.alchemyMasterBubble.textContent = promptText;
    host.alchemyMasterBubble.style.display = "block";
    layoutAlchemySpeechBubble();
    window.clearTimeout(promptHideTimeout);
    if (!complete) {
      promptHideTimeout = window.setTimeout(function () {
        if (!running && host.alchemyMasterBubble && !complete) {
          host.alchemyMasterBubble.style.display = "none";
        }
      }, 5000);
    }
    return;
  }

  if (host.alchemyMasterBubble.style.display === "block" && !running) {
    host.alchemyMasterBubble.style.display = "none";
    host.alchemyMasterBubble.dataset.promptShown = "false";
    window.clearTimeout(promptHideTimeout);
  }
}

function layoutAlchemySpeechBubble() {
  if (!host || !host.alchemyMasterBubble) return;
  const bubbleWidth = host.alchemyMasterBubble.offsetWidth || 48;
  const headTop = host.getNpcHeadTopWorldY
    ? host.getNpcHeadTopWorldY(host.ALCHEMY_MASTER_START_Y)
    : host.ALCHEMY_MASTER_START_Y + host.NPC_HEAD_TOP_TRIM_WORLD;
  const bubbleWorldY =
    host.speechBubbleTopWorldYFromHead(
      headTop,
      host.alchemyMasterBubble,
      host.NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    ) - host.NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  host.setSpeechBubbleTransform(
    host.alchemyMasterBubble,
    host.ALCHEMY_MASTER_START_X + host.NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
}

function showAlchemyDialogueLine(lineInfo) {
  if (!host) return;
  const isNpc = lineInfo.speaker === "npc";
  host.alchemyMasterBubble.style.display = isNpc ? "block" : "none";
  host.playerBubble.style.display = isNpc ? "none" : "block";
  if (isNpc) {
    host.alchemyMasterBubble.textContent = lineInfo.text;
    layoutAlchemySpeechBubble();
    return;
  }
  host.playerBubble.textContent = lineInfo.text;
  host.updatePlayerBubblePosition();
}

function startAlchemyMasterDialogue() {
  if (!host) return;
  const lines = [
    { speaker: "npc", text: "\uBC18\uAC11\uB124 \uC5EC\uD589\uC790\uC5EC...", delayAfterMs: 2000 },
    { speaker: "npc", text: "\uC790\uB124 \uB9C8\uBC95\uC744 \uBBFF\uB294\uAC00?!", delayAfterMs: 2000 },
    { speaker: "player", text: "??..\uB9C8\uBC95\uC774\uC694?", delayAfterMs: 2000 },
    { speaker: "npc", text: "\uB098\uB294 \uBBFF\uB294\uB2E4\uB124...", delayAfterMs: 2000 }
  ];
  running = true;
  host.alchemyMasterBubble.style.display = "none";
  host.playerBubble.style.display = "none";
  window.clearTimeout(promptHideTimeout);
  let timelineMs = 0;
  lines.forEach(function (lineInfo) {
    window.setTimeout(function () {
      showAlchemyDialogueLine(lineInfo);
    }, timelineMs);
    timelineMs += Math.max(0, Number(lineInfo.delayAfterMs) || 650);
  });
  window.setTimeout(function () {
    running = false;
    complete = true;
    host.alchemyMasterBubble.style.display = "none";
    host.playerBubble.style.display = "none";
    host.alchemyMasterBubble.dataset.promptShown = "false";
    host.setStoredFlag(host.alchemyMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
  }, timelineMs + 200);
}
