import { getBagItemDescriptor } from "./bag-inventory.js";
import {
  ALCHEMY_CRAFT_INPUT_KEYS,
  ALCHEMY_CRAFT_RECIPES,
  alchemySlotsAreComplete,
  buildAlchemyRequirementSlots,
  formatAlchemyRequirementSummary,
  getAlchemyCraftRecipeById
} from "./alchemy-craft.js";

/** @type {Record<string, any>} */
let host = null;

const ALCHEMY_IDLE_PROMPT = "\uC624\uD638\uB77C..\uC774\uAC74\uB610 \uC2E0\uAE30\uD558\uAD6C..";
const ALCHEMY_POST_DIALOGUE_PROMPT =
  "\uC9C0\uAE08 \uB9C8\uBC95\uC744 \uBD10\uB3C4 \uAD1C\uCC2E\uACA0\uB098?\n(q\uB97C \uB20C\uB7EC \uBCF4\uAE30)";
const ALCHEMY_CRAFT_FINISH_LINE = "\uC5B4\uB5A4\uAC00..? \uC544\uB984\uB2F5\uC9C0 \uC54A\uB098?!";

let running = false;
let complete = false;
let promptHideTimeout = null;
let craftOpen = false;
/** @type {number[]} */
let dialogueTimeoutIds = [];
let dialogueStartedAt = 0;
let selectedRecipeId = null;
let requirementsVisible = false;
/** @type {number[]} */
let requirementSlotFills = [];
/** @type {import("./alchemy-craft.js").AlchemyRequirementSlotDef[]} */
let requirementSlotDefs = [];

/** @type {{ el: HTMLElement, startMs: number, startX: number, startY: number, vx: number, vy: number } | null} */
let craftSmokeEffect = null;

let outsideDismissBound = false;

function isAlchemyCraftKeepOpenTarget(target) {
  if (!(target instanceof Element) || !host) return false;
  const panel = host.alchemyCraftOverlay
    ? host.alchemyCraftOverlay.querySelector(".alchemy-craft-panel")
    : null;
  if (panel && panel.contains(target)) return true;
  if (host.bagInventoryPanel && host.bagInventoryPanel.contains(target)) return true;
  if (host.worldBagInventory && host.worldBagInventory.contains(target)) return true;
  return false;
}

function onAlchemyCraftOutsidePointer(event) {
  if (!craftOpen) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (isAlchemyCraftKeepOpenTarget(target)) return;
  closeAlchemyCraftPanel();
}

function bindAlchemyCraftOutsideDismiss() {
  if (outsideDismissBound) return;
  outsideDismissBound = true;
  document.addEventListener("pointerdown", onAlchemyCraftOutsidePointer, true);
}

function clearAlchemyDialogueTimeouts() {
  dialogueTimeoutIds.forEach(function (id) {
    window.clearTimeout(id);
  });
  dialogueTimeoutIds = [];
}

function scheduleAlchemyDialogueTimeout(fn, delayMs) {
  const id = window.setTimeout(fn, delayMs);
  dialogueTimeoutIds.push(id);
  return id;
}

function isAlchemyCraftOverlayVisible() {
  return Boolean(
    host && host.alchemyCraftOverlay && host.alchemyCraftOverlay.style.display === "block"
  );
}

function reconcileAlchemyCraftOpenState() {
  if (!craftOpen) return;
  if (!isAlchemyCraftOverlayVisible()) {
    craftOpen = false;
    selectedRecipeId = null;
    requirementsVisible = false;
    requirementSlotDefs = [];
    requirementSlotFills = [];
    if (host) {
      if (host.worldBagInventory) {
        host.worldBagInventory.classList.remove("is-alchemy-craft-focus");
      }
      if (host.bagInventoryPanel) {
        host.bagInventoryPanel.classList.remove("is-alchemy-craft-focus");
      }
    }
  }
}

function abortAlchemyMasterDialogue() {
  if (!running) return;
  clearAlchemyDialogueTimeouts();
  running = false;
  if (host) {
    if (host.alchemyMasterBubble) {
      host.alchemyMasterBubble.style.display = "none";
      host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
    }
    if (host.playerBubble) host.playerBubble.style.display = "none";
  }
  window.clearTimeout(promptHideTimeout);
}

export function resetAlchemyMasterDialogueIfStuck() {
  if (!running) return;
  if (Date.now() - dialogueStartedAt < 16000) return;
  abortAlchemyMasterDialogue();
}

export function bindAlchemyMaster(h) {
  host = h;
  bindAlchemyCraftOutsideDismiss();
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        abortAlchemyMasterDialogue();
        return;
      }
      resetAlchemyMasterDialogueIfStuck();
      reconcileAlchemyCraftOpenState();
    });
  }
  if (host.alchemyCraftClose) {
    host.alchemyCraftClose.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeAlchemyCraftPanel();
    });
  }
  if (host.alchemyCraftConfirm) {
    host.alchemyCraftConfirm.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      confirmAlchemyCraft();
    });
  }
  if (host.alchemyCraftProductList) {
    host.alchemyCraftProductList.addEventListener("click", function (event) {
      const btn = event.target.closest(".alchemy-craft-product");
      if (!btn || btn.disabled) return;
      selectedRecipeId = btn.dataset.recipeId || null;
      renderAlchemyCraftProducts();
      if (selectedRecipeId) {
        showAlchemyRequirements();
      } else {
        requirementsVisible = false;
        requirementSlotDefs = [];
        requirementSlotFills = [];
        renderAlchemyRequirementSlots();
        updateAlchemyCraftConfirmButton();
      }
    });
  }
  if (host.alchemyCraftRequirementSlots) {
    host.alchemyCraftRequirementSlots.addEventListener("click", function (event) {
      const slotEl = event.target.closest(".alchemy-craft-req-slot");
      if (!slotEl || !craftOpen) return;
      event.preventDefault();
      event.stopPropagation();
      const index = Number(slotEl.dataset.slotIndex);
      if (!Number.isFinite(index) || index < 0) return;
      returnOneAlchemyRequirementSlot(index);
    });
  }
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

export function isAlchemyCraftOpen() {
  return craftOpen;
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
  if (!host || !isNearAlchemyMaster()) return false;
  reconcileAlchemyCraftOpenState();
  if (running) return true;
  if (!complete) {
    startAlchemyMasterDialogue();
    return true;
  }
  if (craftOpen) {
    closeAlchemyCraftPanel({ keepInventory: true });
    return true;
  }
  openAlchemyCraftPanel();
  return true;
}

export function updateAlchemyNpcPrompt() {
  if (!host || !host.alchemyMasterBubble) return;
  if (craftOpen) {
    if (!isNearAlchemyMaster()) {
      closeAlchemyCraftPanel();
    }
    return;
  }
  if (
    running ||
    (host.isNpcDialogueRunning && host.isNpcDialogueRunning()) ||
    (host.isTradeMasterDialogueRunning && host.isTradeMasterDialogueRunning()) ||
    (host.isTradeExchangeOpen && host.isTradeExchangeOpen())
  ) {
    return;
  }

  if (isNearAlchemyMaster()) {
    const promptText = complete ? ALCHEMY_POST_DIALOGUE_PROMPT : ALCHEMY_IDLE_PROMPT;
    host.alchemyMasterBubble.textContent = promptText;
    host.alchemyMasterBubble.style.display = "block";
    host.alchemyMasterBubble.classList.toggle("is-alchemy-idle-prompt", !complete);
    layoutAlchemySpeechBubble();
    window.clearTimeout(promptHideTimeout);
    return;
  }

  if (host.alchemyMasterBubble.style.display === "block" && !running) {
    host.alchemyMasterBubble.style.display = "none";
    host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
    window.clearTimeout(promptHideTimeout);
  }
}

export function handleBagSlotClickWhileAlchemyCraftOpen(slotEl) {
  if (!craftOpen || !slotEl || !requirementsVisible) return true;
  const key = bagSlotToItemKey(slotEl);
  if (!key || !ALCHEMY_CRAFT_INPUT_KEYS.has(key)) return true;
  addOneInventoryItemToAlchemySlots(key);
  return true;
}

export function updateAlchemyCraftEffects(now) {
  if (!craftSmokeEffect || !host || !host.ground) return;
  const elapsed = now - craftSmokeEffect.startMs;
  if (elapsed >= 2400) {
    if (craftSmokeEffect.el.parentNode) {
      craftSmokeEffect.el.parentNode.removeChild(craftSmokeEffect.el);
    }
    craftSmokeEffect = null;
    return;
  }
  const dt = 0.016;
  craftSmokeEffect.startX += craftSmokeEffect.vx * dt * 60;
  craftSmokeEffect.startY += craftSmokeEffect.vy * dt * 60;
  craftSmokeEffect.vy -= 0.35;
  const fade = elapsed < 2000 ? 1 : Math.max(0, 1 - (elapsed - 2000) / 400);
  craftSmokeEffect.el.style.opacity = String(0.55 * fade);
  host.setWorldPosition(craftSmokeEffect.el, craftSmokeEffect.startX, craftSmokeEffect.startY);
}

function bagSlotToItemKey(slotEl) {
  const kind = slotEl.dataset.bagType;
  if (!kind || kind === "empty" || kind === "book") return null;
  if (kind === "butterfly") {
    const color = slotEl.dataset.butterflyColor;
    return color ? "butterfly:" + color : null;
  }
  return kind;
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
    host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
    layoutAlchemySpeechBubble();
    return;
  }
  host.playerBubble.textContent = lineInfo.text;
  host.updatePlayerBubblePosition();
}

function startAlchemyMasterDialogue() {
  if (!host) return;
  clearAlchemyDialogueTimeouts();
  const lines = [
    { speaker: "npc", text: "\uBC18\uAC11\uB124 \uC5EC\uD589\uC790\uC5EC...", delayAfterMs: 2000 },
    { speaker: "npc", text: "\uC790\uB124 \uB9C8\uBC95\uC744 \uBBFF\uB294\uAC00?!", delayAfterMs: 2000 },
    { speaker: "player", text: "??..\uB9C8\uBC95\uC774\uC694?", delayAfterMs: 2000 },
    { speaker: "npc", text: "\uB098\uB294 \uBBFF\uB294\uB2E4\uB124...", delayAfterMs: 2000 }
  ];
  running = true;
  dialogueStartedAt = Date.now();
  host.alchemyMasterBubble.style.display = "none";
  host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
  host.playerBubble.style.display = "none";
  window.clearTimeout(promptHideTimeout);
  let timelineMs = 0;
  lines.forEach(function (lineInfo) {
    scheduleAlchemyDialogueTimeout(function () {
      if (!running) return;
      showAlchemyDialogueLine(lineInfo);
    }, timelineMs);
    timelineMs += Math.max(0, Number(lineInfo.delayAfterMs) || 650);
  });
  scheduleAlchemyDialogueTimeout(function () {
    clearAlchemyDialogueTimeouts();
    running = false;
    complete = true;
    host.alchemyMasterBubble.style.display = "none";
    host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
    host.playerBubble.style.display = "none";
    host.setStoredFlag(host.alchemyMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
  }, timelineMs + 200);
  scheduleAlchemyDialogueTimeout(function () {
    if (!running) return;
    clearAlchemyDialogueTimeouts();
    running = false;
    complete = true;
    host.alchemyMasterBubble.style.display = "none";
    host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
    host.playerBubble.style.display = "none";
    host.setStoredFlag(host.alchemyMasterDialogueCompleteKey, true);
    host.updateNpcPosition();
  }, timelineMs + 12000);
}

export function openAlchemyCraftPanel() {
  if (!host || !complete) return;
  reconcileAlchemyCraftOpenState();
  if (craftOpen) return;
  if (host.isTradeExchangeOpen && host.isTradeExchangeOpen()) {
    if (host.closeTradeExchangePanel) host.closeTradeExchangePanel();
  }
  craftOpen = true;
  selectedRecipeId = null;
  requirementsVisible = false;
  requirementSlotDefs = [];
  requirementSlotFills = [];
  if (host.alchemyCraftOverlay) {
    host.alchemyCraftOverlay.style.display = "block";
    host.alchemyCraftOverlay.setAttribute("aria-hidden", "false");
  }
  host.setBagInventoryPanelOpen(true);
  host.updateBagInventorySlots();
  if (host.worldBagInventory) host.worldBagInventory.classList.add("is-alchemy-craft-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.add("is-alchemy-craft-focus");
  renderAlchemyCraftProducts();
  renderAlchemyRequirementSlots();
  updateAlchemyCraftConfirmButton();
}

export function closeAlchemyCraftPanel(options) {
  if (!host) return;
  const keepInventory = Boolean(options && options.keepInventory);
  const returnSlots = !options || options.returnSlots !== false;
  if (returnSlots) returnAlchemyRequirementSlotsToInventory();
  craftOpen = false;
  selectedRecipeId = null;
  requirementsVisible = false;
  requirementSlotDefs = [];
  requirementSlotFills = [];
  if (host.alchemyCraftOverlay) {
    host.alchemyCraftOverlay.style.display = "none";
    host.alchemyCraftOverlay.setAttribute("aria-hidden", "true");
  }
  if (host.worldBagInventory) host.worldBagInventory.classList.remove("is-alchemy-craft-focus");
  if (host.bagInventoryPanel) host.bagInventoryPanel.classList.remove("is-alchemy-craft-focus");
  if (!keepInventory) host.setBagInventoryPanelOpen(false);
  renderAlchemyRequirementSlots();
}

function returnAlchemyRequirementSlotsToInventory() {
  requirementSlotDefs.forEach(function (def, index) {
    const n = Math.max(0, Math.floor(Number(requirementSlotFills[index]) || 0));
    if (n > 0) host.addBagItems(def.key, n);
  });
}

function showAlchemyRequirements() {
  const recipe = getAlchemyCraftRecipeById(selectedRecipeId);
  if (!recipe) return;
  returnAlchemyRequirementSlotsToInventory();
  requirementsVisible = true;
  requirementSlotDefs = buildAlchemyRequirementSlots(recipe);
  requirementSlotFills = requirementSlotDefs.map(function () {
    return 0;
  });
  renderAlchemyRequirementSlots();
  updateAlchemyCraftConfirmButton();
}

function addOneInventoryItemToAlchemySlots(itemKey) {
  if (!requirementsVisible) return false;
  const index = requirementSlotDefs.findIndex(function (def, i) {
    const filled = Math.max(0, Math.floor(Number(requirementSlotFills[i]) || 0));
    return def.key === itemKey && filled < def.required;
  });
  if (index < 0) return false;
  if (!host.removeOneBagItem(itemKey)) return false;
  requirementSlotFills[index] = Math.max(0, Math.floor(Number(requirementSlotFills[index]) || 0)) + 1;
  renderAlchemyRequirementSlots();
  updateAlchemyCraftConfirmButton();
  return true;
}

function returnOneAlchemyRequirementSlot(index) {
  const def = requirementSlotDefs[index];
  const filled = Math.max(0, Math.floor(Number(requirementSlotFills[index]) || 0));
  if (!def || filled <= 0) return;
  requirementSlotFills[index] = filled - 1;
  host.addBagItems(def.key, 1);
  renderAlchemyRequirementSlots();
  updateAlchemyCraftConfirmButton();
  host.updateBagInventorySlots();
}

function renderAlchemyCraftProducts() {
  if (!host.alchemyCraftProductList) return;
  host.alchemyCraftProductList.innerHTML = ALCHEMY_CRAFT_RECIPES.map(function (recipe) {
    const desc = getBagItemDescriptor(recipe.outputKey);
    const selected = recipe.id === selectedRecipeId ? " is-selected" : "";
    return (
      '<button type="button" class="alchemy-craft-product' +
      selected +
      '" data-recipe-id="' +
      recipe.id +
      '" aria-label="' +
      recipe.label +
      '">' +
      desc.iconHtml +
      '<span class="alchemy-craft-product-label">' +
      recipe.label +
      "</span></button>"
    );
  }).join("");
}

function renderAlchemyRequirementSlots() {
  if (!host.alchemyCraftRequirementSlots) return;
  const wrap = host.alchemyCraftRequirementSlots;
  const block = host.alchemyCraftRequirementsBlock;
  if (!requirementsVisible || !requirementSlotDefs.length) {
    wrap.innerHTML = "";
    if (block) block.classList.add("is-hidden");
    renderAlchemyRequirementSummary();
    return;
  }
  if (block) block.classList.remove("is-hidden");
  wrap.innerHTML = requirementSlotDefs
    .map(function (def, index) {
      const filled = Math.max(0, Math.floor(Number(requirementSlotFills[index]) || 0));
      const required = def.required;
      const desc = getBagItemDescriptor(def.key);
      const complete = filled >= required;
      const filledClass = complete ? " is-filled" : filled > 0 ? " is-partial" : "";
      const manySegClass = required > 6 ? " is-many-segments" : "";
      const segCount = Math.max(1, required);
      let segHtml = "";
      for (let s = 0; s < segCount; s++) {
        segHtml +=
          '<span class="alchemy-craft-req-seg' +
          (s < filled ? " is-filled" : "") +
          '"></span>';
      }
      const ariaProgress =
        required > 1 ? " " + filled + "/" + required : complete ? " 완료" : "";
      return (
        '<button type="button" class="alchemy-craft-req-slot' +
        filledClass +
        manySegClass +
        '" data-slot-index="' +
        index +
        '" aria-label="' +
        desc.label +
        ariaProgress +
        '">' +
        '<span class="alchemy-craft-req-segments" style="--seg-count:' +
        segCount +
        '" aria-hidden="true">' +
        segHtml +
        "</span>" +
        '<span class="alchemy-craft-req-icon' +
        (complete
          ? ""
          : filled > 0
            ? " alchemy-craft-req-icon--partial"
            : " alchemy-craft-req-icon--ghost") +
        '">' +
        desc.iconHtml +
        "</span>" +
        (required > 1
          ? '<span class="alchemy-craft-req-badge">×' + required + "</span>"
          : "") +
        "</button>"
      );
    })
    .join("");
  renderAlchemyRequirementSummary();
}

function renderAlchemyRequirementSummary() {
  const el = host && host.alchemyCraftRequirementSummary;
  if (!el) return;
  if (!requirementsVisible || !requirementSlotDefs.length) {
    el.textContent = "";
    el.classList.add("is-hidden");
    el.classList.remove("is-complete");
    return;
  }
  const summary = formatAlchemyRequirementSummary(
    requirementSlotDefs,
    requirementSlotFills,
    function (key) {
      return getBagItemDescriptor(key).label;
    }
  );
  el.textContent = summary.text;
  el.classList.remove("is-hidden");
  el.classList.toggle("is-complete", summary.allComplete);
}

function updateAlchemyCraftConfirmButton() {
  if (!host.alchemyCraftConfirm) return;
  const recipe = getAlchemyCraftRecipeById(selectedRecipeId);
  const ok =
    Boolean(recipe) &&
    requirementsVisible &&
    alchemySlotsAreComplete(requirementSlotDefs, requirementSlotFills);
  host.alchemyCraftConfirm.disabled = !ok;
  host.alchemyCraftConfirm.classList.toggle("is-ready", ok);
}

function confirmAlchemyCraft() {
  const recipe = getAlchemyCraftRecipeById(selectedRecipeId);
  if (
    !recipe ||
    !requirementsVisible ||
    !alchemySlotsAreComplete(requirementSlotDefs, requirementSlotFills)
  ) {
    return;
  }
  const outputAmount = Math.max(1, Math.floor(Number(recipe.outputAmount) || 0) || 1);
  if (host.canAddBagItems && !host.canAddBagItems({ [recipe.outputKey]: outputAmount })) {
    if (host.showInventoryFullFail) host.showInventoryFullFail();
    return;
  }
  requirementSlotFills = [];
  requirementSlotDefs = [];
  requirementsVisible = false;
  host.addBagItems(recipe.outputKey, outputAmount);
  closeAlchemyCraftPanelKeepInventory();
  spawnAlchemyCraftSmoke();
  showAlchemyCraftFinishLine();
  host.updateBagInventorySlots();
  if (host.saveCraftFurnitureCounts) host.saveCraftFurnitureCounts();
  if (host.saveColoredMagicPowderCounts) host.saveColoredMagicPowderCounts();
  if (host.saveButterflyCaughtCounts) host.saveButterflyCaughtCounts();
  host.markWorldDirty();
}

function closeAlchemyCraftPanelKeepInventory() {
  closeAlchemyCraftPanel({ keepInventory: true, returnSlots: false });
}

function spawnAlchemyCraftSmoke() {
  if (!host || !host.ground || !host.setWorldPosition) return;
  if (craftSmokeEffect && craftSmokeEffect.el.parentNode) {
    craftSmokeEffect.el.parentNode.removeChild(craftSmokeEffect.el);
  }
  const el = document.createElement("div");
  el.className = "alchemy-craft-smoke";
  el.setAttribute("aria-hidden", "true");
  host.ground.appendChild(el);
  const x = host.ALCHEMY_MASTER_START_X + host.NPC_WIDTH * 0.35;
  const y = host.ALCHEMY_MASTER_START_Y + host.NPC_HEIGHT * 0.2;
  host.setWorldPosition(el, x, y);
  craftSmokeEffect = {
    el: el,
    startMs: Date.now(),
    startX: x,
    startY: y,
    vx: 18,
    vy: 8
  };
}

function showAlchemyCraftFinishLine() {
  if (!host || !host.alchemyMasterBubble) return;
  host.alchemyMasterBubble.textContent = ALCHEMY_CRAFT_FINISH_LINE;
  host.alchemyMasterBubble.classList.remove("is-alchemy-idle-prompt");
  host.alchemyMasterBubble.style.display = "block";
  layoutAlchemySpeechBubble();
  window.clearTimeout(promptHideTimeout);
  promptHideTimeout = window.setTimeout(function () {
    if (!craftOpen && !running && host.alchemyMasterBubble) {
      if (isNearAlchemyMaster()) {
        updateAlchemyNpcPrompt();
      } else {
        host.alchemyMasterBubble.style.display = "none";
      }
    }
  }, 4500);
}
