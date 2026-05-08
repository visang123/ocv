import {
  toScreenX as toScreenXUtil,
  toScreenY as toScreenYUtil,
  setWorldSize as setWorldSizeUtil,
  setWorldPosition as setWorldPositionUtil
} from "./src/world/transform.js";
import {
  getCenterDistance as getCenterDistanceUtil,
  isOverlappingRect
} from "./src/world/collision.js";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  GROUND_WORLD_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  SEED_SIZE,
  BUCKET_SIZE,
  WELL_SIZE,
  PLANT_SPOT_WIDTH,
  PLANT_SPOT_HEIGHT,
  WATER_NEEDED_SIZE,
  SPROUT_WIDTH,
  SPROUT_HEIGHT,
  BIG_TREE_WIDTH,
  BIG_TREE_HEIGHT,
  NPC_WIDTH,
  NPC_HEIGHT,
  BIG_TREE_X,
  BIG_TREE_Y,
  TREE_TRUNK_X,
  TREE_TRUNK_WIDTH,
  TREE_TRUNK_TOP,
  TREE_CLIMB_DISTANCE,
  TREE_CANOPY_LEFT,
  TREE_CANOPY_RIGHT,
  TREE_CANOPY_TOP,
  TREE_CANOPY_BOTTOM,
  WELL_START_X,
  WELL_START_Y,
  SIGN_START_X,
  SIGN_START_Y,
  SIGN_WIDTH,
  SIGN_HEIGHT,
  SEED_START_X,
  SEED_START_Y,
  GUIDE_BOOK_START_X,
  GUIDE_BOOK_START_Y,
  GUIDE_BOOK_WIDTH,
  GUIDE_BOOK_HEIGHT,
  NPC_START_X,
  NPC_START_Y,
  appleEatMs,
  appleRespawnMs,
  minPlantSpacing,
  biggerSproutMs,
  pickupDistance,
  guideInteractDistance,
  npcInteractDistance,
  wellUseDistance,
  wellPourDistance,
  plantWaterDistance,
  maxWellWater,
  wellRefillMs,
  seedDryMs,
  plantDryMs,
  plantWaterLevelTickMs,
  plantGrowthMs,
  overwaterWindowMs,
  playerPositionKey,
  wellWaterKey,
  lastWellRefillKey,
  seedCreatedAtKey,
  seedPlantedStateKey,
  hasGuideBookKey,
  npcDialogueCompleteKey,
  guidePlantPageUnlockedKey,
  appleStateKey,
  bucketStateKey,
  appStorageKeys
} from "./src/game/constants.js";
import {
  player,
  seed,
  bucket,
  well,
  bigTree,
  plantSpot,
  sprout,
  plantMaster,
  npcBubble,
  playerBubble,
  playerAlert,
  waterNeeded,
  plantCard,
  plantWaterText,
  plantWaterSegments,
  signBoard,
  growthCard,
  growthFill,
  guideBook,
  guideBookButton,
  guideCard,
  guidePages,
  guidePrev,
  guideNext,
  guidePageText,
  playerStatus,
  playerName,
  characterSelectOverlay,
  characterPreview,
  characterColorGrid,
  characterSelectButton,
  wellCard,
  wellCardImage,
  wellWaterText,
  wellWaterFill,
  seedCard,
  seedDryGauge,
  seedDryText,
  seedInventory,
  appleInventory,
  appleCountText,
  treeAppleElements,
  inventoryApple,
  world,
  ground
} from "./src/world/dom.js";
import {
  createInputState,
  resetKeys as resetInputKeys,
  getControlKey
} from "./src/systems/input.js";
import {
  clearStoredKeys,
  setStoragePrefix,
  getStoredValue,
  getStoredFlag,
  removeStoredValue,
  setStoredValue,
  setStoredFlag,
  loadWellStateFromStorage,
  saveWellStateToStorage,
  loadSeedStateFromStorage,
  saveSeedStateToStorage,
  loadAppleStateFromStorage,
  saveAppleStateToStorage
} from "./src/game/storage.js";
import { createWellState, createAppleState, createPlantState } from "./src/game/state.js";
import {
  HELD_ITEM_SEED,
  HELD_ITEM_BUCKET,
  isHeldExtraSeed,
  createHeldExtraSeed,
  getHeldExtraSeedId
} from "./src/game/held-item.js";

let playerX = 100;
let playerDepth = 0;
let jumpY = 0;
let velocityY = 0;
let isOnGround = true;

let seedX = 0;
let seedY = 20;
let bucketX = 0;
let bucketY = 0;
let wellX = 0;
let wellY = 0;
let signX = SIGN_START_X;
let signY = SIGN_START_Y;
let guideBookX = GUIDE_BOOK_START_X;
let guideBookY = GUIDE_BOOK_START_Y;
let hasGuideBook = false;
let isGuideBookOpen = false;
let isGuideDismissedAtSign = false;
let heldItem = null;
let isBucketFull = false;
const plantRuntime = createPlantState();
let npcX = NPC_START_X;
let npcY = NPC_START_Y;
let isNpcDialogueRunning = false;
let isNpcDialogueComplete = false;
let isGuidePlantPageUnlocked = false;
let guidePageIndex = 0;
let npcPromptHideTimeout = null;
let isSetupComplete = false;
let cameraX = 0;
let cameraY = 0;
let zoomLevel = 3.5;
let hasInitializedZoom = false;
let isTreeFalling = false;
let wasPlayerInTree = false;
let plantingInventorySeedId = null;
let lastPlayerPositionSavedAt = 0;
const currentUserKey = "ovcCurrentUserV1";
const currentUserIdKey = "ovcCurrentUserIdV1";
const currentUserColorKey = "ovcCurrentUserColorV1";
const lastSelectedColorKey = "ovcLastSelectedColorV1";
const currentUserHasChosenColorKey = "ovcCurrentUserHasChosenColorV1";
const currentSessionTokenKey = "ovcCurrentSessionTokenV1";
const currentSessionKey = "ovcCurrentSessionV1";
const loginHandoffKey = "ovcLoginHandoffV1";
const currentUserName = (getStoredValue(currentUserKey) || "").trim();
const currentUserId = (getStoredValue(currentUserIdKey) || "").trim();
let currentSessionId = sessionStorage.getItem(currentSessionKey);
const currentUserScopedColorKey = currentUserId
  ? "ovcUserColorV1:" + currentUserId
  : "";
const savedUserScopedColor = normalizeHexColor(
  currentUserScopedColorKey ? localStorage.getItem(currentUserScopedColorKey) : ""
);
const savedGlobalPlayerColor = normalizeHexColor(localStorage.getItem(currentUserColorKey));
const savedLastPlayerColor = normalizeHexColor(localStorage.getItem(lastSelectedColorKey));
const hasChosenPlayerColor =
  localStorage.getItem(currentUserHasChosenColorKey) === currentUserId ||
  Boolean(savedUserScopedColor) ||
  Boolean(savedGlobalPlayerColor) ||
  Boolean(savedLastPlayerColor);
let selectedPlayerColor =
  savedUserScopedColor || savedGlobalPlayerColor || savedLastPlayerColor || "#ffffff";
if (currentUserId) {
  setStoragePrefix("ovc-user-" + currentUserId + ":");
}
let isCharacterSelecting = false;
let hasSpawnedCharacter = Boolean(currentUserId && hasChosenPlayerColor);
const characterColors = [
  "#ffffff", "#f87171", "#fb923c", "#facc15", "#a3e635",
  "#4ade80", "#2dd4bf", "#38bdf8", "#60a5fa", "#818cf8",
  "#a78bfa", "#c084fc", "#f472b6", "#fda4af", "#d9f99d",
  "#bbf7d0", "#99f6e4", "#bae6fd", "#bfdbfe", "#ddd6fe",
  "#fecdd3", "#fde68a", "#cbd5e1", "#94a3b8", "#111827",
  "#7c2d12", "#365314", "#064e3b", "#0c4a6e", "#581c87"
];

function normalizeHexColor(value) {
  if (!/^#[0-9a-fA-F]{6}$/.test(value || "")) return "";
  return value.toLowerCase();
}

let multiplayerChannel = null;
let lastPresenceSentAt = 0;
let remotePlayers = {};
let remotePlayerCount = 0;
let multiplayerStatusText = "대기";
let isMultiplayerSubscribed = false;
let multiplayerReconnectTimeout = null;
let multiplayerConnectAttempt = 0;
let lastSyncedPlayerColor = "";
let lastPresenceStateKey = "";
let presenceRateLimitedUntil = 0;
let lastPresenceTrackAt = 0;
let lastBroadcastAt = 0;
let lastHeartbeatBroadcastAt = 0;
let lastPresenceDbSyncAt = 0;
let lastPresenceDbPollAt = 0;
let isPresenceDbSyncing = false;
let isPresenceDbPolling = false;
let isLoggingOut = false;
let isApplyingWorldState = false;
let isWorldSyncing = false;
let isWorldPolling = false;
let isWorldDirty = false;
let lastWorldSaveAt = 0;
let lastWorldPollAt = 0;
let lastWorldUpdatedAt = "";
let onlineDebugToastTimeout = null;
const networkDebugLines = [];
const playerTintCache = new Map();
const playerBaseImage = new Image();
let playerBaseImageReady = false;
playerBaseImage.addEventListener("load", function () {
  playerBaseImageReady = true;
  playerTintCache.clear();
  if (selectedPlayerColor) {
    applyPlayerColor(selectedPlayerColor);
  }
});
playerBaseImage.src = "player-white.png";
if (playerBaseImage.complete && playerBaseImage.naturalWidth) {
  playerBaseImageReady = true;
}

const speed = 1;
const treeMoveSpeed = speed * 0.5;
const treeClimbSpeed = treeMoveSpeed;
const treeFallSpeed = treeMoveSpeed * 3.5;
const groundFootInset = 8;
const jumpPower = 4.5;
const gravity = 0.8;
const appleState = createAppleState([
  { id: "apple-1", x: BIG_TREE_X + 31, y: BIG_TREE_Y + 45, size: 10 },
  { id: "apple-2", x: BIG_TREE_X + 76, y: BIG_TREE_Y + 21, size: 10 },
  { id: "apple-3", x: BIG_TREE_X + 112, y: BIG_TREE_Y + 52, size: 10 },
  { id: "apple-4", x: BIG_TREE_X + 54, y: BIG_TREE_Y + 82, size: 10 },
  { id: "apple-5", x: BIG_TREE_X + 96, y: BIG_TREE_Y + 83, size: 10 }
]);
const defaultZoom = 3.5;
const maxZoom = 5;
const zoomStep = 0.25;
const wellState = createWellState(maxWellWater);
const spawnPortalWidth = 30;
const spawnPortalHeight = 44;
const spawnPortalX = SIGN_START_X - spawnPortalWidth - 24;
const spawnPortalY = SIGN_START_Y + SIGN_HEIGHT - spawnPortalHeight;
const spawnPlayerX = spawnPortalX + spawnPortalWidth / 2 - PLAYER_WIDTH / 2;
const spawnPlayerDepth = getMinGroundedPlayerDepth();

const keys = createInputState();

if (!currentSessionId) {
  currentSessionId =
    "session-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  sessionStorage.setItem(currentSessionKey, currentSessionId);
}

if (!currentUserName || !currentUserId) {
  window.location.replace("/ovc-login.html?v=20260508s");
  throw new Error("OVC login required");
}

window.addEventListener(
  "keydown",
  function (event) {
    if (
      event.code === "KeyR" &&
      event.shiftKey &&
      (event.ctrlKey || event.metaKey) &&
      !event.repeat
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      resetGameForTesting();
    }
  },
  true
);

function toScreenX(worldX) {
  return toScreenXUtil(worldX, ground, WORLD_WIDTH);
}

function toScreenY(worldY) {
  return toScreenYUtil(worldY, ground, GROUND_WORLD_HEIGHT);
}

function setWorldSize(element, width, height) {
  setWorldSizeUtil(
    element,
    width,
    height,
    ground,
    WORLD_WIDTH,
    GROUND_WORLD_HEIGHT
  );
}

function setWorldPosition(element, x, y) {
  setWorldPositionUtil(
    element,
    x,
    y,
    ground,
    WORLD_WIDTH,
    GROUND_WORLD_HEIGHT
  );
}

document.addEventListener("keydown", function (event) {
  const key = getControlKey(event);

  if (isCharacterSelecting) {
    event.preventDefault();
    return;
  }

  if (key in keys) {
    event.preventDefault();
    keys[key] = true;
  }

  if (key === " " && isOnGround) {
    event.preventDefault();
    if (plantRuntime.isPlanting) return;
    if (isPlayerInTreeSpace()) {
      return;
    }
    velocityY = -jumpPower;
    isOnGround = false;
  }

  if (key === "e" && !event.repeat) {
    event.preventDefault();
    if (plantRuntime.isPlanting) return;
    if (pickApple()) return;
    if (pickUpGuideBook()) return;
    toggleSeed();
  }

  if (key === "q" && !event.repeat) {
    event.preventDefault();
    if (tryTalkToPlantMaster()) return;
    useHeldItem();
  }

  if (key === "Escape") {
    if (isGuideBookOpen || guideCard.style.display === "block") {
      event.preventDefault();
      isGuideBookOpen = false;
      if (isNearSignBoard()) {
        isGuideDismissedAtSign = true;
      }
      updateGuideCard();
    }
    return;
  }

});

document.addEventListener("keyup", function (event) {
  const key = getControlKey(event);

  if (key in keys) {
    event.preventDefault();
    keys[key] = false;
  }
});

window.addEventListener("blur", function () {
  resetInputKeys(keys);
});
window.addEventListener("pagehide", function () {
  sendMultiplayerLeave();
  saveGameSnapshot();
  resetInputKeys(keys);
});
window.addEventListener("beforeunload", function () {
  sendMultiplayerLeave();
  saveGameSnapshot();
  resetInputKeys(keys);
});
window.addEventListener("pageshow", function () {
  resetInputKeys(keys);
});
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    saveGameSnapshot();
    resetInputKeys(keys);
  }
});

window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault();

    const direction = event.deltaY > 0 ? -1 : 1;
    zoomLevel = clampZoom(zoomLevel + direction * zoomStep);
    updateCamera();
  },
  { passive: false }
);

guideBookButton.addEventListener("click", function () {
  isGuideBookOpen = !isGuideBookOpen;
  updateGuideCard();
});

signBoard.addEventListener("click", function () {
  isGuideDismissedAtSign = false;
  isGuideBookOpen = true;
  updateGuideCard();
});

guideCard.addEventListener("click", function () {
  isGuideBookOpen = false;
  if (isNearSignBoard()) {
    isGuideDismissedAtSign = true;
  }
  updateGuideCard();
});

guidePrev.addEventListener("click", function (event) {
  event.stopPropagation();
  if (guidePageIndex > 0) {
    guidePageIndex -= 1;
  }
  updateGuidePages();
});

guideNext.addEventListener("click", function (event) {
  event.stopPropagation();
  const maxPage = getGuideMaxPage();
  if (guidePageIndex < maxPage) {
    guidePageIndex += 1;
  }
  updateGuidePages();
});

inventoryApple.addEventListener("click", function () {
  eatApple();
});

characterSelectButton.addEventListener("click", function () {
  finishCharacterSelect();
});

const settingsButton = document.getElementById("settings-button");
const settingsOverlay = document.getElementById("settings-overlay");
const settingsModal = document.getElementById("settings-modal");
const changeColorButton = document.getElementById("change-color-button");
const logoutButton = document.getElementById("logout-button");
const logoutConfirmOverlay = document.getElementById("logout-confirm-overlay");
const logoutConfirmCancel = document.getElementById("logout-confirm-cancel");
const logoutConfirmOk = document.getElementById("logout-confirm-ok");
const onlineDebugToast = document.getElementById("online-debug-toast");
const networkDebugPanel = document.getElementById("network-debug-panel");
const multiplayerStatus = document.getElementById("multiplayer-status");
const adminOpenButton = document.getElementById("admin-open-button");
const adminOverlay = document.getElementById("admin-overlay");
const adminCloseButton = document.getElementById("admin-close-button");
const adminRefreshButton = document.getElementById("admin-refresh-button");
const adminMessage = document.getElementById("admin-message");
const adminAccountList = document.getElementById("admin-account-list");
const spawnPortal = document.getElementById("spawn-portal");
const playerColorBody = document.createElement("div");
playerColorBody.id = "player-color-body";
player.insertAdjacentElement("afterend", playerColorBody);
const mainPlantGrowthMeter = createPlantGrowthMeter();
const controlsButton = document.createElement("button");
controlsButton.id = "controls-button";
controlsButton.type = "button";
controlsButton.textContent = "조작법";
settingsModal.insertBefore(controlsButton, logoutButton);
const controlsOverlay = document.createElement("div");
controlsOverlay.id = "controls-overlay";
controlsOverlay.setAttribute("aria-hidden", "true");
controlsOverlay.innerHTML =
  '<div id="controls-modal">' +
  '<div class="controls-header"><strong>조작법</strong><button id="controls-close-button" type="button" aria-label="닫기">×</button></div>' +
  '<div class="controls-list">' +
  '<div><span>W / ↑</span><p>위로 이동</p></div>' +
  '<div><span>A / ←</span><p>왼쪽으로 이동</p></div>' +
  '<div><span>S / ↓</span><p>아래로 이동</p></div>' +
  '<div><span>D / →</span><p>오른쪽으로 이동</p></div>' +
  '<div><span>Space</span><p>점프</p></div>' +
  '<div><span>E</span><p>줍기 / 내려놓기</p></div>' +
  '<div><span>Q</span><p>사용 / 대화</p></div>' +
  '<div><span>🖱 휠</span><p>확대 / 축소</p></div>' +
  '<div><span>⚙</span><p>설정 열기</p></div>' +
  '</div></div>';
document.body.appendChild(controlsOverlay);
const controlsCloseButton = document.getElementById("controls-close-button");

settingsButton.addEventListener("click", function () {
  settingsOverlay.classList.add("is-open");
  settingsOverlay.setAttribute("aria-hidden", "false");
});

settingsOverlay.addEventListener("click", function (event) {
  if (event.target === settingsOverlay) {
    settingsOverlay.classList.remove("is-open");
    settingsOverlay.setAttribute("aria-hidden", "true");
  }
});

controlsButton.addEventListener("click", function () {
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  controlsOverlay.classList.add("is-open");
  controlsOverlay.setAttribute("aria-hidden", "false");
});

controlsCloseButton.addEventListener("click", function () {
  controlsOverlay.classList.remove("is-open");
  controlsOverlay.setAttribute("aria-hidden", "true");
});

controlsOverlay.addEventListener("click", function (event) {
  if (event.target === controlsOverlay) {
    controlsOverlay.classList.remove("is-open");
    controlsOverlay.setAttribute("aria-hidden", "true");
  }
});

logoutButton.addEventListener("click", function () {
  openLogoutConfirm();
});

logoutConfirmCancel.addEventListener("click", function () {
  closeLogoutConfirm();
});

logoutConfirmOk.addEventListener("click", function () {
  closeLogoutConfirm();
  logout();
});

logoutConfirmOverlay.addEventListener("click", function (event) {
  if (event.target === logoutConfirmOverlay) {
    closeLogoutConfirm();
  }
});

changeColorButton.addEventListener("click", function () {
  openCharacterColorChange();
});

adminOpenButton.addEventListener("dblclick", function () {
  openAdminPanel();
});

adminCloseButton.addEventListener("click", function () {
  closeAdminPanel();
});

adminOverlay.addEventListener("click", function (event) {
  if (event.target === adminOverlay) {
    closeAdminPanel();
  }
});

adminRefreshButton.addEventListener("click", function () {
  loadAdminAccounts();
});

seedInventory.addEventListener("click", function (event) {
  const seedItem = event.target.closest(".inventory-seed");
  if (!seedItem) return;
  event.preventDefault();
  if (seedItem.dataset.action === "discard") {
    discardInventorySeed(seedItem.dataset.seedId);
    return;
  }
  plantInventorySeed(seedItem.dataset.seedId);
});

function applyGuideTexts() {
  // Guide copy lives in index.html so the sign and book keep the same wording.
}

function getPlayerBox() {
  const top = GROUND_WORLD_HEIGHT - PLAYER_HEIGHT - playerDepth + jumpY;
  const bottom = GROUND_WORLD_HEIGHT - playerDepth + jumpY;

  return {
    left: playerX,
    top,
    right: playerX + PLAYER_WIDTH,
    bottom,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
  };
}

function getSeedSize() {
  return {
    width: SEED_SIZE,
    height: SEED_SIZE
  };
}

function getBucketSize() {
  return {
    width: BUCKET_SIZE,
    height: BUCKET_SIZE
  };
}

function getWellSize() {
  return {
    width: WELL_SIZE,
    height: WELL_SIZE
  };
}

function getCenterDistance(x, y, width, height) {
  return getCenterDistanceUtil(getPlayerBox(), x, y, width, height);
}

function getHandPosition(itemWidth, itemHeight) {
  const playerBox = getPlayerBox();

  return {
    x: playerBox.left + playerBox.width * 0.82 - itemWidth / 2,
    y: playerBox.top + playerBox.height * 0.68 - itemHeight / 2
  };
}

function isNearSeed() {
  const seedSize = getSeedSize();

  return getCenterDistance(seedX, seedY, seedSize.width, seedSize.height) < pickupDistance;
}

function canPickUpSeed() {
  updateSeedDryState();
  return !hasStarterSeedInSeedList() && !plantRuntime.isSeedPlanted && !plantRuntime.isSeedDry;
}

function hasStarterSeedInSeedList() {
  return appleState.extraSeeds.some(function (extraSeed) {
    return extraSeed.isStarter;
  });
}

function createStarterSeedInventoryItem() {
  if (hasStarterSeedInSeedList()) return null;

  const starterSeed = {
    id: "starter-seed",
    x: seedX,
    y: seedY,
    createdAt: plantRuntime.seedCreatedAt,
    planted: false,
    inInventory: true,
    label: "\uC528\uC5571",
    isStarter: true
  };
  appleState.extraSeeds.unshift(starterSeed);
  saveAppleState();
  return starterSeed;
}

function isNearBucket() {
  const bucketSize = getBucketSize();

  return getCenterDistance(bucketX, bucketY, bucketSize.width, bucketSize.height) < pickupDistance;
}

function isNearWell() {
  const wellSize = getWellSize();

  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellUseDistance;
}

function isNearWellForPouring() {
  const wellSize = getWellSize();

  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellPourDistance;
}

function isNearSignBoard() {
  return getCenterDistance(signX, signY, SIGN_WIDTH, SIGN_HEIGHT) < guideInteractDistance;
}

function isNearGuideBook() {
  if (hasGuideBook) return false;

  return (
    getCenterDistance(
      guideBookX,
      guideBookY,
      GUIDE_BOOK_WIDTH,
      GUIDE_BOOK_HEIGHT
    ) < pickupDistance
  );
}

function pickUpGuideBook() {
  if (!isNearGuideBook()) return false;

  hasGuideBook = true;
  isGuideBookOpen = false;
  setStoredFlag(hasGuideBookKey, true);
  guideBook.style.display = "none";
  guideBookButton.style.display = "block";
  updateGuideCard();
  return true;
}

function loadGuideBookState() {
  hasGuideBook = getStoredFlag(hasGuideBookKey);
  isNpcDialogueComplete = getStoredFlag(npcDialogueCompleteKey);
  isGuidePlantPageUnlocked = getStoredFlag(guidePlantPageUnlockedKey);
  guideBook.style.display = hasGuideBook ? "none" : "block";
  guideBookButton.style.display = hasGuideBook ? "block" : "none";
  updateGuidePages();
  updateNpcPosition();
}

function resetGameForTesting() {
  clearStoredKeys(appStorageKeys);

  applyDefaultState();
}

function saveGameSnapshot() {
  savePlayerPosition(true);
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
  syncWorldState(true);
}

function restartPlayerPositionOnly() {
  resetInputKeys(keys);
  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  isTreeFalling = false;
  wasPlayerInTree = false;
  plantingInventorySeedId = null;
  savePlayerPosition(true);
}

function applyDefaultState() {
  resetInputKeys(keys);

  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  wasPlayerInTree = false;

  seedX = SEED_START_X;
  seedY = SEED_START_Y;
  plantRuntime.seedCreatedAt = Date.now();
  setStoredValue(seedCreatedAtKey, String(plantRuntime.seedCreatedAt));
  plantRuntime.isSeedDry = false;
  plantRuntime.isSeedPlanted = false;
  plantRuntime.isPlanting = false;
  heldItem = null;
  plantingInventorySeedId = null;

  plantRuntime.spotX = 0;
  plantRuntime.spotY = 0;
  plantRuntime.lastWateredAt = null;
  plantRuntime.wateredAtList = [];
  plantRuntime.status = "normal";
  plantRuntime.waterLevel = 1;
  plantRuntime.waterLevelUpdatedAt = Date.now();
  plantRuntime.becameEmptyAt = null;
  plantRuntime.isOverwatered = false;
  plantRuntime.needsFirstWater = false;
  plantRuntime.growthStartedAt = null;
  plantRuntime.isSproutGrown = false;
  plantRuntime.sproutGrownAt = null;

  hasGuideBook = false;
  isGuideBookOpen = false;
  isGuideDismissedAtSign = false;
  isNpcDialogueRunning = false;
  isNpcDialogueComplete = false;
  isGuidePlantPageUnlocked = false;
  guidePageIndex = 0;
  isTreeFalling = false;
  wasPlayerInTree = false;
  appleState.count = 0;
  appleState.pickedIds = [];
  appleState.isEating = false;
  appleState.nextSeedOffset = 0;
  appleState.apples = createRandomApples(5);
  appleState.lastSpawnAt = Date.now();
  clearExtraSeedAndPlantElements();
  appleState.extraSeeds = [];
  appleState.extraPlants = [];

  wellState.water = maxWellWater;
  wellState.lastRefillAt = Date.now();
  isBucketFull = false;
  bucketX = wellX - BUCKET_SIZE - 8;
  bucketY = wellY + WELL_SIZE - BUCKET_SIZE;

  plantSpot.style.display = "none";
  waterNeeded.style.display = "none";
  growthCard.style.display = "none";
  sprout.style.display = "none";
  plantCard.style.display = "none";
  seedCard.style.display = "none";
  seedInventory.style.display = "none";
  guideCard.style.display = "none";
  guideBook.style.display = "block";
  guideBook.classList.remove("is-near");
  guideBookButton.style.display = "none";
  npcBubble.style.display = "none";
  playerAlert.style.display = "none";

  updateWellImage();
  updateWellCard();
  updateSeedPosition();
  updateBucketPosition();
  updateNpcPosition();
  updateGuidePages();
  updateApples();
  updateExtraSeedsAndPlants();
}

function isNearPlantSpot() {
  if (!plantRuntime.isSeedPlanted) return false;

  return isNearPlantSpotWithin(pickupDistance);
}

function isNearPlantSpotForWatering() {
  return getNearestWateringTarget() !== null;
}

function isNearPlantSpotWithin(distance) {
  return (
    getCenterDistance(
      plantRuntime.spotX,
      plantRuntime.spotY,
      PLANT_SPOT_WIDTH,
      PLANT_SPOT_HEIGHT
    ) < distance
  );
}

function isPlantMasterVisible() {
  return !isNpcDialogueComplete || isNpcDialogueRunning;
}

function isNearPlantMaster() {
  if (!isPlantMasterVisible()) return false;

  return getCenterDistance(npcX, npcY, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
}

function tryTalkToPlantMaster() {
  if (
    !isNearPlantMaster() ||
    isNpcDialogueRunning ||
    isNpcDialogueComplete
  ) {
    return false;
  }

  startPlantMasterDialogue();
  return true;
}

function startPlantMasterDialogue() {
  const lines = [
    { speaker: "npc", text: "\uC3FC\uB77C~\uC3FC\uB77C~" },
    { speaker: "player", text: "\uAF50\uB77C\uAF50\uB77C~" },
    { speaker: "npc", text: "...?" },
    { speaker: "player", text: "?" },
    { speaker: "npc", text: "!!" }
  ];

  isNpcDialogueRunning = true;
  npcBubble.style.display = "none";
  playerBubble.style.display = "none";
  window.clearTimeout(npcPromptHideTimeout);

  lines.forEach(function (lineInfo, index) {
    window.setTimeout(function () {
      showDialogueLine(lineInfo);
    }, index * 650);
  });

  window.setTimeout(function () {
    npcBubble.style.display = "none";
    playerBubble.style.display = "none";
    isNpcDialogueRunning = false;
    isNpcDialogueComplete = true;
    isGuidePlantPageUnlocked = true;
    setStoredFlag(npcDialogueCompleteKey, true);
    setStoredFlag(guidePlantPageUnlockedKey, true);
    updateNpcPosition();
    showPlayerAlert();
    guidePageIndex = 1;
    isGuideBookOpen = true;
    updateGuideCard();
  }, lines.length * 650 + 250);
}

function showDialogueLine(lineInfo) {
  npcBubble.style.display = lineInfo.speaker === "npc" ? "block" : "none";
  playerBubble.style.display = lineInfo.speaker === "player" ? "block" : "none";

  if (lineInfo.speaker === "npc") {
    npcBubble.textContent = lineInfo.text;
    updateNpcPosition();
    return;
  }

  playerBubble.textContent = lineInfo.text;
  updatePlayerBubblePosition();
}

function showPlayerAlert() {
  playerAlert.style.display = "block";
  window.setTimeout(function () {
    playerAlert.style.display = "none";
  }, 1800);
}

function setNpcStartPosition() {
  npcX = NPC_START_X;
  npcY = NPC_START_Y;
}

function toggleSeed() {
  if (plantRuntime.isPlanting) return;

  if (heldItem) {
    dropHeldItem();
    return;
  }

  pickUpNearestItem();
}

function pickUpNearestItem() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const seedDistance = canPickUpSeed()
    ? getCenterDistance(seedX, seedY, seedSize.width, seedSize.height)
    : Infinity;
  const extraSeed = getNearestPickableExtraSeed();
  const extraSeedDistance = extraSeed ? extraSeed.distance : Infinity;
  const bucketDistance = getCenterDistance(bucketX, bucketY, bucketSize.width, bucketSize.height);

  if (
    seedDistance <= pickupDistance &&
    seedDistance <= bucketDistance &&
    seedDistance <= extraSeedDistance
  ) {
    createStarterSeedInventoryItem();
    updateSeedPosition();
    updateSeedInventory();
    return;
  }

  if (
    extraSeed &&
    extraSeedDistance <= pickupDistance &&
    extraSeedDistance <= bucketDistance
  ) {
    extraSeed.seed.inInventory = true;
    saveAppleState();
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    return;
  }

  if (bucketDistance <= pickupDistance && canPickUpSharedBucket()) {
    heldItem = HELD_ITEM_BUCKET;
    markWorldDirty();
  }
}

function canPickUpSharedBucket() {
  return !window.OVC_SHARED_BUCKET_HELD_BY || window.OVC_SHARED_BUCKET_HELD_BY === currentSessionId;
}

function getNearestPickableExtraSeed() {
  let nearest = null;

  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || isExtraSeedDry(extraSeed)) return;

    const distance = getCenterDistance(extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE);
    if (!nearest || distance < nearest.distance) {
      nearest = {
        seed: extraSeed,
        distance
      };
    }
  });

  return nearest;
}

function pickApple() {
  respawnApplesIfNeeded();
  const apple = appleState.apples.find(function (candidate) {
    return !appleState.pickedIds.includes(candidate.id) && isPlayerOverlappingRect(
      candidate.x,
      candidate.y,
      candidate.size,
      candidate.size
    );
  });

  if (!apple) return false;

  appleState.pickedIds.push(apple.id);
  appleState.count += 1;
  saveAppleState();
  updateApples();
  return true;
}

function isPlayerOverlappingRect(x, y, width, height) {
  const playerRect = {
    left: playerX,
    right: playerX + PLAYER_WIDTH,
    top: getPlayerFootY() - getPlayerRenderedHeight(),
    bottom: getPlayerFootY()
  };
  const targetRect = {
    left: x,
    right: x + width,
    top: y,
    bottom: y + height
  };
  return isOverlappingRect(playerRect, targetRect);
}

function updateApples() {
  respawnApplesIfNeeded();
  treeAppleElements.forEach(function (appleElement) {
    const apple = appleState.apples.find(function (candidate) {
      return candidate.id === appleElement.dataset.appleId;
    });

    if (apple) {
      appleElement.style.left = apple.localX + "px";
      appleElement.style.top = apple.localY + "px";
    }

    appleElement.style.display = !apple || appleState.pickedIds.includes(appleElement.dataset.appleId)
      ? "none"
      : "block";
  });

  appleInventory.style.display = appleState.count > 0 ? "block" : "none";
  guideBookButton.style.display = hasGuideBook ? "block" : "none";
  appleCountText.textContent = String(appleState.count);
}

function eatApple() {
  if (appleState.count <= 0 || appleState.isEating || plantRuntime.isPlanting || isNpcDialogueRunning) return;

  appleState.count -= 1;
  appleState.isEating = true;
  playerStatus.textContent = "\uBA39\uB294\uC911...";
  saveAppleState();
  updateApples();

  window.setTimeout(function () {
    appleState.isEating = false;
    playerStatus.textContent = "";
    createSeedFromApple();
  }, appleEatMs);
}

function createSeedFromApple() {
  const playerBox = getPlayerBox();
  const seedXFromApple = playerBox.left + playerBox.width / 2 - SEED_SIZE / 2;
  const seedYFromApple = playerBox.bottom - SEED_SIZE + appleState.nextSeedOffset;
  const seedNumber = getNextSeedNumber();

  appleState.nextSeedOffset += 2;
  const newSeed = {
    id: "apple-seed-" + Date.now() + "-" + appleState.extraSeeds.length,
    x: seedXFromApple,
    y: seedYFromApple,
    createdAt: Date.now(),
    planted: false,
    inInventory: true,
    label: "\uC528\uC557" + seedNumber,
    isStarter: false
  };

  appleState.extraSeeds.push(newSeed);

  updateExtraSeedsAndPlants();
  updateSeedInventory();
  saveAppleState();
}

function getNextSeedNumber() {
  return appleState.extraSeeds.length + 1;
}

function createRandomApples(count) {
  return Array.from({ length: count }, function (_, index) {
    return createRandomApple("apple-" + (index + 1));
  });
}

function createRandomApple(id) {
  const size = 10;
  let localX = 18 + Math.floor(Math.random() * 104);
  let localY = 16 + Math.floor(Math.random() * 76);
  let attempts = 0;

  while (isAppleInTrunkArea(localX, localY, size) && attempts < 16) {
    localX = 18 + Math.floor(Math.random() * 104);
    localY = 16 + Math.floor(Math.random() * 76);
    attempts += 1;
  }

  return {
    id,
    localX,
    localY,
    x: BIG_TREE_X + localX,
    y: BIG_TREE_Y + localY,
    size
  };
}

function isAppleInTrunkArea(localX, localY, size) {
  const trunkLocalLeft = TREE_TRUNK_X - BIG_TREE_X;
  const trunkLocalRight = trunkLocalLeft + TREE_TRUNK_WIDTH;
  const trunkTopLocalY = TREE_TRUNK_TOP - BIG_TREE_Y;
  const xPadding = 8;
  const yPadding = 10;
  const appleLeft = localX;
  const appleRight = localX + size;
  const appleTop = localY;
  const appleBottom = localY + size;

  return (
    appleRight >= trunkLocalLeft - xPadding &&
    appleLeft <= trunkLocalRight + xPadding &&
    appleBottom >= trunkTopLocalY - yPadding
  );
}

function respawnApplesIfNeeded() {
  const now = Date.now();
  const availableIds = appleState.apples
    .filter(function (apple) {
      return appleState.pickedIds.includes(apple.id);
    })
    .map(function (apple) {
      return apple.id;
    });

  if (availableIds.length === 0) {
    appleState.lastSpawnAt = now;
    return;
  }

  const elapsedSpawns = Math.floor((now - appleState.lastSpawnAt) / appleRespawnMs);
  if (elapsedSpawns <= 0) return;

  const spawnCount = Math.min(elapsedSpawns, availableIds.length);
  for (let index = 0; index < spawnCount; index += 1) {
    const id = availableIds[index];
    const appleIndex = appleState.apples.findIndex(function (apple) {
      return apple.id === id;
    });
    appleState.apples[appleIndex] = createRandomApple(id);
    appleState.pickedIds = appleState.pickedIds.filter(function (pickedId) {
      return pickedId !== id;
    });
  }

  appleState.lastSpawnAt += spawnCount * appleRespawnMs;
  saveAppleState();
}

function loadAppleState() {
  const loaded = loadAppleStateFromStorage({
    appleStateKey,
    bigTreeX: BIG_TREE_X,
    bigTreeY: BIG_TREE_Y,
    now: Date.now(),
    defaultSeedLabel: "\uC528\uC557",
    createRandomApples
  });

  appleState.count = loaded.appleCount;
  appleState.apples = loaded.apples;
  appleState.pickedIds = loaded.pickedAppleIds;
  appleState.nextSeedOffset = loaded.nextAppleSeedOffset;
  appleState.lastSpawnAt = loaded.lastAppleSpawnAt;
  appleState.extraSeeds = loaded.extraSeeds;
  appleState.extraPlants = loaded.extraPlants;

  if (loaded.parseFailed) {
    clearExtraSeedAndPlantElements();
  }

  updateApples();
  updateExtraSeedsAndPlants();
}

function saveAppleState() {
  saveAppleStateToStorage({
    appleStateKey,
    appleCount: appleState.count,
    apples: appleState.apples,
    pickedAppleIds: appleState.pickedIds,
    nextAppleSeedOffset: appleState.nextSeedOffset,
    lastAppleSpawnAt: appleState.lastSpawnAt,
    extraSeeds: appleState.extraSeeds,
    extraPlants: appleState.extraPlants
  });
  markWorldDirty();
}

function loadBucketState() {
  const savedRaw = getStoredValue(bucketStateKey);
  if (!savedRaw) return;

  try {
    const saved = JSON.parse(savedRaw);
    isBucketFull = Boolean(saved.isBucketFull);
    bucketX = Number.isFinite(Number(saved.bucketX)) ? Number(saved.bucketX) : bucketX;
    bucketY = Number.isFinite(Number(saved.bucketY)) ? Number(saved.bucketY) : bucketY;

    if (saved.heldItem === HELD_ITEM_BUCKET) {
      heldItem = HELD_ITEM_BUCKET;
    }
  } catch (error) {
    removeStoredValue(bucketStateKey);
  }
}

function saveBucketState() {
  setStoredValue(
    bucketStateKey,
    JSON.stringify({
      isBucketFull,
      bucketX,
      bucketY,
      heldItem: heldItem === HELD_ITEM_BUCKET ? HELD_ITEM_BUCKET : null,
      savedAt: Date.now()
    })
  );
  markWorldDirty();
}

function markWorldDirty() {
  if (isApplyingWorldState) return;
  isWorldDirty = true;
}

function getSharedWorldSnapshot() {
  const bucketHeldBy = heldItem === HELD_ITEM_BUCKET ? currentSessionId : window.OVC_SHARED_BUCKET_HELD_BY || "";
  return {
    savedAt: Date.now(),
    savedBy: currentSessionId,
    bucket: {
      x: bucketX,
      y: bucketY,
      isFull: isBucketFull,
      heldBy: bucketHeldBy
    },
    well: {
      water: wellState.water,
      lastRefillAt: wellState.lastRefillAt
    },
    seed: {
      x: seedX,
      y: seedY,
      createdAt: plantRuntime.seedCreatedAt,
      isDry: plantRuntime.isSeedDry
    },
    mainPlant: getPlantStateForStorage(),
    apples: {
      count: appleState.count,
      pickedIds: appleState.pickedIds.slice(),
      nextSeedOffset: appleState.nextSeedOffset,
      lastSpawnAt: appleState.lastSpawnAt,
      apples: appleState.apples.map(function (apple) {
        return {
          id: apple.id,
          localX: apple.localX,
          localY: apple.localY,
          x: apple.x,
          y: apple.y,
          size: apple.size
        };
      }),
      extraSeeds: appleState.extraSeeds.map(function (extraSeed) {
        return {
          id: extraSeed.id,
          x: extraSeed.x,
          y: extraSeed.y,
          createdAt: extraSeed.createdAt,
          planted: Boolean(extraSeed.planted),
          inInventory: Boolean(extraSeed.inInventory),
          label: extraSeed.label,
          isStarter: Boolean(extraSeed.isStarter)
        };
      }),
      extraPlants: appleState.extraPlants.map(function (plant) {
        return {
          id: plant.id,
          x: plant.x,
          y: plant.y,
          plantedAt: plant.plantedAt,
          lastWateredAt: plant.lastWateredAt,
          wateredAtList: Array.isArray(plant.wateredAtList) ? plant.wateredAtList.slice() : [],
          status: plant.status,
          waterLevel: plant.waterLevel,
          waterLevelUpdatedAt: plant.waterLevelUpdatedAt,
          becameEmptyAt: plant.becameEmptyAt,
          isOverwatered: Boolean(plant.isOverwatered),
          needsFirstWater: Boolean(plant.needsFirstWater),
          growthStartedAt: plant.growthStartedAt,
          isSproutGrown: Boolean(plant.isSproutGrown),
          sproutGrownAt: plant.sproutGrownAt
        };
      })
    }
  };
}

function applySharedWorldSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return;
  isApplyingWorldState = true;

  try {
    if (snapshot.bucket) {
      const heldBy = String(snapshot.bucket.heldBy || "");
      window.OVC_SHARED_BUCKET_HELD_BY = heldBy;
      if (heldBy && heldBy !== currentSessionId) {
        if (heldItem === HELD_ITEM_BUCKET) heldItem = null;
        isBucketFull = Boolean(snapshot.bucket.isFull);
        bucketX = Number(snapshot.bucket.x) || bucketX;
        bucketY = Number(snapshot.bucket.y) || bucketY;
      } else if (heldBy !== currentSessionId) {
        isBucketFull = Boolean(snapshot.bucket.isFull);
        bucketX = Number(snapshot.bucket.x) || bucketX;
        bucketY = Number(snapshot.bucket.y) || bucketY;
      }
    }

    if (snapshot.well) {
      wellState.water = Math.max(0, Math.min(maxWellWater, Number(snapshot.well.water) || 0));
      wellState.lastRefillAt = Number(snapshot.well.lastRefillAt) || Date.now();
    }

    if (snapshot.mainPlant) {
      applyLoadedPlantState({
        isSeedPlanted: Boolean(snapshot.mainPlant.isSeedPlanted),
        plantSpotX: Number(snapshot.mainPlant.plantSpotX) || 0,
        plantSpotY: Number(snapshot.mainPlant.plantSpotY) || 0,
        plantLastWateredAt: Number(snapshot.mainPlant.plantLastWateredAt) || null,
        plantWateredAtList: Array.isArray(snapshot.mainPlant.plantWateredAtList) ? snapshot.mainPlant.plantWateredAtList : [],
        plantState: snapshot.mainPlant.plantState || "normal",
        plantWaterLevel: Number(snapshot.mainPlant.plantWaterLevel) || 1,
        plantWaterLevelUpdatedAt: Number(snapshot.mainPlant.plantWaterLevelUpdatedAt) || Date.now(),
        plantBecameEmptyAt: Number(snapshot.mainPlant.plantBecameEmptyAt) || null,
        isPlantOverwatered: Boolean(snapshot.mainPlant.isPlantOverwatered),
        plantNeedsFirstWater: Boolean(snapshot.mainPlant.plantNeedsFirstWater),
        plantGrowthStartedAt: Number(snapshot.mainPlant.plantGrowthStartedAt) || null,
        isSproutGrown: Boolean(snapshot.mainPlant.isSproutGrown),
        plantSproutGrownAt: Number(snapshot.mainPlant.plantSproutGrownAt) || null
      });
      npcX = Number(snapshot.mainPlant.npcX) || npcX;
      npcY = Number(snapshot.mainPlant.npcY) || npcY;
    }

    if (snapshot.apples) {
      clearExtraSeedAndPlantElements();
      appleState.count = Math.max(0, Number(snapshot.apples.count) || 0);
      appleState.pickedIds = Array.isArray(snapshot.apples.pickedIds) ? snapshot.apples.pickedIds.slice() : [];
      appleState.nextSeedOffset = Math.max(0, Number(snapshot.apples.nextSeedOffset) || 0);
      appleState.lastSpawnAt = Number(snapshot.apples.lastSpawnAt) || Date.now();
      appleState.apples = Array.isArray(snapshot.apples.apples)
        ? snapshot.apples.apples.map(function (apple) {
            const localX = Number(apple.localX) || 20;
            const localY = Number(apple.localY) || 20;
            return {
              id: String(apple.id),
              localX,
              localY,
              x: BIG_TREE_X + localX,
              y: BIG_TREE_Y + localY,
              size: Number(apple.size) || 10
            };
          })
        : appleState.apples;
      appleState.extraSeeds = Array.isArray(snapshot.apples.extraSeeds)
        ? snapshot.apples.extraSeeds.map(function (extraSeed) {
            return {
              id: String(extraSeed.id),
              x: Number(extraSeed.x) || 0,
              y: Number(extraSeed.y) || 0,
              createdAt: Number(extraSeed.createdAt) || Date.now(),
              planted: Boolean(extraSeed.planted),
              inInventory: Boolean(extraSeed.inInventory),
              label: extraSeed.label || "씨앗",
              isStarter: Boolean(extraSeed.isStarter)
            };
          })
        : [];
      appleState.extraPlants = Array.isArray(snapshot.apples.extraPlants)
        ? snapshot.apples.extraPlants.map(function (plant) {
            return {
              id: String(plant.id),
              x: Number(plant.x) || 0,
              y: Number(plant.y) || 0,
              plantedAt: Number(plant.plantedAt) || Date.now(),
              lastWateredAt: Number(plant.lastWateredAt) || null,
              wateredAtList: Array.isArray(plant.wateredAtList) ? plant.wateredAtList.slice() : [],
              status: plant.status || "normal",
              waterLevel: Number(plant.waterLevel) || 1,
              waterLevelUpdatedAt: Number(plant.waterLevelUpdatedAt) || Date.now(),
              becameEmptyAt: Number(plant.becameEmptyAt) || null,
              isOverwatered: Boolean(plant.isOverwatered),
              needsFirstWater: Boolean(plant.needsFirstWater),
              growthStartedAt: Number(plant.growthStartedAt) || null,
              isSproutGrown: Boolean(plant.isSproutGrown),
              sproutGrownAt: Number(plant.sproutGrownAt) || null
            };
          })
        : [];
    }

    updateWellImage();
    updateWellCard();
    updateSeedPosition();
    updateBucketPosition();
    updateApples();
    updateExtraSeedsAndPlants();
    updatePlantState();
    updateSeedInventory();
  } finally {
    isApplyingWorldState = false;
  }
}

function syncWorldState(forceSave) {
  const now = Date.now();
  if (
    isWorldSyncing ||
    !window.OVCOnline ||
    typeof window.OVCOnline.saveWorldState !== "function"
  ) {
    return;
  }
  if (!forceSave && !isWorldDirty && now - lastWorldSaveAt < 2500) return;

  isWorldSyncing = true;
  isWorldDirty = false;
  lastWorldSaveAt = now;
  window.OVCOnline.saveWorldState(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    getSharedWorldSnapshot()
  ).then(function (row) {
    if (row && row.updated_at) lastWorldUpdatedAt = row.updated_at;
  }).catch(function (error) {
    addNetworkDebugLog(
      "world save error: " + (error && error.message ? error.message : "unknown")
    );
    isWorldDirty = true;
  }).finally(function () {
    isWorldSyncing = false;
  });
}

function pollWorldState() {
  const now = Date.now();
  if (
    isWorldPolling ||
    !window.OVCOnline ||
    typeof window.OVCOnline.loadWorldState !== "function" ||
    now - lastWorldPollAt < 1000
  ) {
    return;
  }

  isWorldPolling = true;
  lastWorldPollAt = now;
  window.OVCOnline.loadWorldState(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom
  ).then(function (row) {
    if (!row || !row.state || !row.updated_at || row.updated_at === lastWorldUpdatedAt) return;
    lastWorldUpdatedAt = row.updated_at;
    applySharedWorldSnapshot(row.state);
  }).catch(function (error) {
    addNetworkDebugLog(
      "world poll error: " + (error && error.message ? error.message : "unknown")
    );
  }).finally(function () {
    isWorldPolling = false;
  });
}

function dropHeldItem() {
  if (heldItem === HELD_ITEM_SEED) {
    dropSeed();
    return;
  }

  if (isHeldExtraSeed(heldItem)) {
    dropExtraSeed();
    return;
  }

  if (heldItem === HELD_ITEM_BUCKET) {
    dropBucket();
  }
}

function dropSeed() {
  const playerBox = getPlayerBox();
  const seedSize = getSeedSize();

  seedX = playerBox.left + playerBox.width / 2 - seedSize.width / 2;
  seedY = playerBox.bottom - seedSize.height;
  heldItem = null;
}

function dropExtraSeed() {
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed) {
    heldItem = null;
    return;
  }

  const playerBox = getPlayerBox();
  extraSeed.x = playerBox.left + playerBox.width / 2 - SEED_SIZE / 2;
  extraSeed.y = playerBox.bottom - SEED_SIZE;
  extraSeed.inInventory = false;
  heldItem = null;
  saveAppleState();
}

function dropBucket() {
  const playerBox = getPlayerBox();
  const bucketSize = getBucketSize();

  bucketX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
  bucketY = playerBox.bottom - bucketSize.height;
  heldItem = null;
  saveBucketState();
}

function updateSeedPosition() {
  updateSeedDryState();
  seed.style.display =
    plantRuntime.isPlanting || plantRuntime.isSeedPlanted || hasStarterSeedInSeedList()
      ? "none"
      : "block";
  seed.src = plantRuntime.isSeedDry ? "seed-dry.png" : "seed.png";

  if (heldItem === HELD_ITEM_SEED && plantRuntime.isSeedDry) {
    heldItem = null;
  }

  if (heldItem === HELD_ITEM_SEED) {
    const seedSize = getSeedSize();
    const handPosition = getHandPosition(seedSize.width, seedSize.height);

    seedX = handPosition.x;
    seedY = handPosition.y + 5;
  }

  setWorldPosition(seed, seedX, seedY);
}

function updateExtraSeedsAndPlants() {
  const now = Date.now();

  appleState.extraSeeds.forEach(function (extraSeed) {
    ensureExtraSeedElement(extraSeed);
    const isDry = isExtraSeedDry(extraSeed, now);
    extraSeed.element.src = isDry ? "seed-dry.png" : "seed.png";
    extraSeed.element.style.display =
      extraSeed.planted || extraSeed.inInventory ? "none" : "block";

    if (heldItem === createHeldExtraSeed(extraSeed.id)) {
      if (isDry) {
        heldItem = null;
      } else {
        extraSeed.inInventory = false;
        const handPosition = getHandPosition(SEED_SIZE, SEED_SIZE);
        extraSeed.x = handPosition.x;
        extraSeed.y = handPosition.y + 5;
      }
    }

    setWorldPosition(extraSeed.element, extraSeed.x, extraSeed.y);
  });

  updateSeedInventory();

  appleState.extraPlants.forEach(function (plant) {
    ensureExtraPlantElements(plant);
    normalizeExtraPlantState(plant);
    updateExtraPlantState(plant, now);
    plant.spotElement.style.display = "block";
    plant.spotElement.src = getPlantSoilSrc(plant);
    setWorldPosition(plant.spotElement, plant.x, plant.y);
    updatePlantGrowthMeter(
      plant.growthMeterElement,
      plant.growthMeterFill,
      plant.x,
      plant.y,
      getPlantGrowthRatio(plant, now),
      getPlantSecondGrowthRatio(plant, now)
    );

    const isSproutGrown = plant.isSproutGrown && plant.status !== "rotten";
    const grownAt =
      plant.sproutGrownAt ||
      (plant.growthStartedAt ? plant.growthStartedAt + plantGrowthMs : now);
    const isBigSprout = isSproutGrown && now - grownAt >= biggerSproutMs;
    const sproutWidth = isBigSprout ? 30 : SPROUT_WIDTH;
    const sproutHeight = isBigSprout ? 38 : SPROUT_HEIGHT;
    plant.sproutElement.style.display = isSproutGrown ? "block" : "none";
    plant.sproutElement.src = isBigSprout ? "sprout-grown.svg" : "sprout.png";
    plant.sproutElement.classList.toggle("is-big", isBigSprout);
    plant.waterNeededElement.style.display =
      plant.needsFirstWater && plant.status !== "dry" && plant.status !== "rotten"
        ? "block"
        : "none";
    if (plant.waterNeededElement.style.display === "block") {
      setWorldPosition(
        plant.waterNeededElement,
        plant.x + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
        plant.y - WATER_NEEDED_SIZE - 2
      );
    }
    if (!isSproutGrown) return;
    setWorldSize(plant.sproutElement, sproutWidth, sproutHeight);
    setWorldPosition(
      plant.sproutElement,
      plant.x + PLANT_SPOT_WIDTH / 2 - sproutWidth / 2,
      plant.y - sproutHeight + 7
    );
  });
  appleState.extraPlants = appleState.extraPlants.filter(function (plant) {
    if (!plant.removed) return true;
    if (plant.spotElement) plant.spotElement.remove();
    if (plant.sproutElement) plant.sproutElement.remove();
    if (plant.waterNeededElement) plant.waterNeededElement.remove();
    if (plant.growthMeterElement) plant.growthMeterElement.remove();
    markWorldDirty();
    return false;
  });
}

function normalizeExtraPlantState(plant) {
  const now = Date.now();
  if (!plant.status) plant.status = "normal";
  if (!Array.isArray(plant.wateredAtList)) plant.wateredAtList = [];
  if (!Number.isFinite(Number(plant.waterLevel))) plant.waterLevel = 1;
  if (!plant.waterLevelUpdatedAt) plant.waterLevelUpdatedAt = plant.plantedAt || now;
  if (typeof plant.needsFirstWater !== "boolean") {
    plant.needsFirstWater = !plant.growthStartedAt;
  }
  if (typeof plant.isOverwatered !== "boolean") plant.isOverwatered = false;
  if (typeof plant.isSproutGrown !== "boolean") plant.isSproutGrown = false;
}

function updateExtraPlantState(plant, now) {
  updateExtraPlantWaterLevel(plant, now);

  if (plant.status === "dry" || plant.status === "rotten") {
    plant.removed = true;
    return;
  }

  if (
    plant.status !== "rotten" &&
    plant.status !== "wet" &&
    plant.becameEmptyAt !== null &&
    now - plant.becameEmptyAt >= plantDryMs
  ) {
    plant.removed = true;
    return;
  }

  if (
    plant.growthStartedAt !== null &&
    plant.status !== "dry" &&
    plant.status !== "rotten" &&
    !plant.isOverwatered &&
    !plant.isSproutGrown &&
    now - plant.growthStartedAt >= plantGrowthMs
  ) {
    plant.isSproutGrown = true;
    plant.sproutGrownAt = now;
  }
}

function getPlantGrowthRatio(plant, now) {
  if (!plant.growthStartedAt || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return null;
  if (plant.isSproutGrown) return 1;
  return Math.min(1, Math.max(0, (now - plant.growthStartedAt) / plantGrowthMs));
}

function getPlantSecondGrowthRatio(plant, now) {
  if (!plant.isSproutGrown || plant.status === "dry" || plant.status === "rotten") return null;
  const grownAt = plant.sproutGrownAt || (plant.growthStartedAt ? plant.growthStartedAt + plantGrowthMs : now);
  return Math.min(1, Math.max(0, (now - grownAt) / biggerSproutMs));
}

function updatePlantGrowthMeter(element, fill, x, y, firstRatio, secondRatio) {
  if (!element || !fill) return;
  const ratio = secondRatio !== null ? secondRatio : firstRatio;
  if (ratio === null || ratio >= 1) {
    element.style.display = "none";
    return;
  }

  element.style.display = "block";
  fill.style.width = Math.round(ratio * 100) + "%";
  setWorldPosition(element, x + PLANT_SPOT_WIDTH / 2 - 21, y - 24);
}

function updateExtraPlantWaterLevel(plant, now) {
  if (plant.isOverwatered || plant.status === "dry" || plant.status === "rotten") return;

  const elapsedTicks = Math.floor((now - plant.waterLevelUpdatedAt) / plantWaterLevelTickMs);
  if (elapsedTicks <= 0) return;

  const previousWaterLevel = plant.waterLevel;
  plant.waterLevel = Math.max(0, plant.waterLevel - elapsedTicks);
  plant.waterLevelUpdatedAt += elapsedTicks * plantWaterLevelTickMs;

  if (previousWaterLevel > 0 && plant.waterLevel === 0 && plant.becameEmptyAt === null) {
    plant.becameEmptyAt = plant.waterLevelUpdatedAt;
  }
}

function getPlantSoilSrc(plant) {
  if (plant.status === "rotten") return "soil-rotten.png";
  if (plant.status === "wet") return "soil-wet.png";
  if (plant.status === "dry") return "soil-dry.png";
  return "tilled-soil.png";
}

function updateSeedInventory() {
  const now = Date.now();
  const inventorySeeds = appleState.extraSeeds.filter(function (extraSeed) {
    return extraSeed.inInventory && !extraSeed.planted && extraSeed.id !== plantingInventorySeedId;
  });

  seedInventory.style.display = inventorySeeds.length > 0 ? "flex" : "none";

  inventorySeeds.forEach(function (extraSeed, index) {
    ensureSeedInventoryElement(extraSeed);
    const isDry = isExtraSeedDry(extraSeed, now);
    const remaining = Math.max(0, seedDryMs - (now - extraSeed.createdAt));
    extraSeed.inventoryElement.dataset.label = "\uC528\uC557" + (index + 1);
    extraSeed.inventoryElement.dataset.time = isDry
      ? "\uB9C8\uB978 \uC528\uC557"
      : Math.ceil(remaining / 1000) + "\uCD08";
    extraSeed.inventoryElement.dataset.action = isDry ? "discard" : "plant";
    extraSeed.inventoryElement.dataset.actionText = isDry
      ? "\uBC84\uB9AC\uAE30 click"
      : "\uC2EC\uAE30 click";
    extraSeed.inventoryElement.classList.toggle("is-dry", isDry);
    extraSeed.inventoryImage.src = isDry ? "seed-dry.png" : "seed.png";
    extraSeed.inventoryElement.style.display = "block";
  });

  appleState.extraSeeds.forEach(function (extraSeed) {
    if (
      extraSeed.inventoryElement &&
      (extraSeed.planted || !extraSeed.inInventory)
    ) {
      extraSeed.inventoryElement.style.display = "none";
    }
  });
}

function discardInventorySeed(seedId) {
  const seedIndex = appleState.extraSeeds.findIndex(function (extraSeed) {
    return extraSeed.id === seedId;
  });
  if (seedIndex < 0) return;

  const seedToRemove = appleState.extraSeeds[seedIndex];
  if (!seedToRemove.inInventory || seedToRemove.planted) return;

  if (seedToRemove.inventoryElement) {
    seedToRemove.inventoryElement.remove();
  }
  if (seedToRemove.element) {
    seedToRemove.element.remove();
  }

  appleState.extraSeeds.splice(seedIndex, 1);
  saveAppleState();
  updateSeedInventory();
}

function ensureSeedInventoryElement(extraSeed) {
  if (extraSeed.inventoryElement) return;

  const element = document.createElement("button");
  element.type = "button";
  element.className = "inventory-seed";
  element.dataset.seedId = extraSeed.id;

  const image = document.createElement("img");
  image.alt = extraSeed.label || "seed";
  image.src = "seed.png";
  element.appendChild(image);
  seedInventory.appendChild(element);

  extraSeed.inventoryElement = element;
  extraSeed.inventoryImage = image;
}

function ensureExtraSeedElement(extraSeed) {
  if (extraSeed.element) return;

  const element = document.createElement("img");
  element.className = "extra-seed";
  element.alt = "extra seed";
  element.src = "seed.png";
  setWorldSize(element, SEED_SIZE);
  ground.appendChild(element);
  extraSeed.element = element;
}

function ensureExtraPlantElements(plant) {
  if (plant.spotElement && plant.sproutElement && plant.growthMeterElement) return;

  const spotElement = document.createElement("img");
  spotElement.className = "extra-plant-spot";
  spotElement.alt = "extra plant spot";
  spotElement.src = "tilled-soil.png";
  setWorldSize(spotElement, PLANT_SPOT_WIDTH);
  ground.appendChild(spotElement);

  const sproutElement = document.createElement("img");
  sproutElement.className = "extra-sprout";
  sproutElement.alt = "extra sprout";
  sproutElement.src = "sprout.png";
  setWorldSize(sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  ground.appendChild(sproutElement);

  const waterNeededElement = document.createElement("img");
  waterNeededElement.className = "extra-water-needed";
  waterNeededElement.alt = "water needed";
  waterNeededElement.src = "water-needed.png";
  setWorldSize(waterNeededElement, WATER_NEEDED_SIZE);
  ground.appendChild(waterNeededElement);

  plant.spotElement = spotElement;
  plant.sproutElement = sproutElement;
  plant.waterNeededElement = waterNeededElement;
  const growthMeter = createPlantGrowthMeter();
  plant.growthMeterElement = growthMeter.element;
  plant.growthMeterFill = growthMeter.fill;
}

function createPlantGrowthMeter() {
  const element = document.createElement("div");
  const fill = document.createElement("div");
  element.className = "plant-growth-meter";
  fill.className = "plant-growth-meter-fill";
  element.appendChild(fill);
  ground.appendChild(element);
  return { element, fill };
}

function clearExtraSeedAndPlantElements() {
  document.querySelectorAll(".extra-seed, .extra-plant-spot, .extra-sprout, .extra-water-needed, .inventory-seed, .plant-growth-meter").forEach(
    function (element) {
      if (element === mainPlantGrowthMeter.element) return;
      element.remove();
    }
  );
}

function updateBucketPosition() {
  bucket.src = isBucketFull ? "bucket-full.png" : "bucket-empty.png";

  if (heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);

    bucketX = handPosition.x;
    bucketY = handPosition.y;
    markWorldDirty();
  }

  setWorldPosition(bucket, bucketX, bucketY);
}

function updatePlayerPosition() {
  if (isCharacterSelecting || !hasSpawnedCharacter) {
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) {
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  const previousPlayerX = playerX;
  const previousPlayerDepth = playerDepth;
  const previousJumpY = jumpY;
  const groundMaxDepth = getMaxGroundedPlayerDepth();
  const isInCanopy = isPlayerInTreeCanopy();
  const isNearTrunk = isPlayerNearTreeTrunk();
  const isInTree = !isTreeFalling && (isInCanopy || isNearTrunk);
  const currentSpeed = isInTree ? treeMoveSpeed : speed;

  if (keys.ArrowLeft || keys.a) {
    playerX -= currentSpeed;
  }

  if (keys.ArrowRight || keys.d) {
    playerX += currentSpeed;
  }

  const shouldTreeFall =
    playerDepth > groundMaxDepth &&
    wasPlayerInTree &&
    (isTreeFalling || !isPlayerSupportedByTree());
  const isFallingFromTree = shouldTreeFall;

  if (shouldTreeFall) {
    isTreeFalling = true;
    jumpY = 0;
    velocityY = 0;
    playerDepth -= treeFallSpeed;
    if (playerDepth <= groundMaxDepth) {
      playerDepth = groundMaxDepth;
      isOnGround = true;
      isTreeFalling = false;
      wasPlayerInTree = false;
    } else {
      isOnGround = false;
    }
  } else if (isInTree) {
    jumpY = 0;
    velocityY = 0;
    isOnGround = true;

    if (keys.ArrowUp || keys.w) {
      movePlayerVerticallyInTree(treeClimbSpeed);
    }

    if (keys.ArrowDown || keys.s) {
      movePlayerVerticallyInTree(-treeClimbSpeed);
    }
  } else {
    if (keys.ArrowUp || keys.w) {
      playerDepth += speed;
    }

    if (keys.ArrowDown || keys.s) {
      playerDepth -= speed;
    }
    velocityY += gravity;
    jumpY += velocityY;
  }

  const maxX = Math.max(0, WORLD_WIDTH - PLAYER_WIDTH);

  if (playerX < 0) playerX = 0;
  if (playerX > maxX) playerX = maxX;

  if (playerDepth < getMinGroundedPlayerDepth()) {
    playerDepth = getMinGroundedPlayerDepth();
  }
  if (!isInTree && !isFallingFromTree && playerDepth > groundMaxDepth) {
    playerDepth = groundMaxDepth;
  }

  if (isInTree) {
    clampPlayerToTreeOutline();
  }

  if (jumpY > 0) {
    jumpY = 0;
    velocityY = 0;
    isOnGround = true;
    isTreeFalling = false;
  }

  if (isPlayerInWellWaterArea()) {
    playerX = previousPlayerX;
    playerDepth = previousPlayerDepth;
    jumpY = previousJumpY;
  }

  setWorldPosition(player, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  wasPlayerInTree = isInTree || (isTreeFalling && playerDepth > groundMaxDepth);
}

function isPlayerInWellWaterArea() {
  const footX = getPlayerCenterX();
  const footY = getPlayerFootY();
  return (
    footX >= wellX + 9 &&
    footX <= wellX + WELL_SIZE - 9 &&
    footY >= wellY + 10 &&
    footY <= wellY + WELL_SIZE - 8
  );
}

function updatePlayerColorBodyPosition() {
  // Keep legacy overlay disabled; color is rendered directly on #player image.
  playerColorBody.style.display = "none";
  if (!hasSpawnedCharacter || player.classList.contains("is-hidden-before-spawn")) return;
}

function getMaxGroundedPlayerDepth() {
  return GROUND_WORLD_HEIGHT - groundFootInset;
}

function getMinGroundedPlayerDepth() {
  return 0;
}

function getMaxTreePlayerDepth() {
  return GROUND_WORLD_HEIGHT - TREE_CANOPY_TOP - 2;
}

function getMinTreePlayerDepth() {
  return getMaxGroundedPlayerDepth();
}

function getPlayerRenderedHeight() {
  return player.offsetHeight || PLAYER_HEIGHT;
}

function getPlayerCenterX() {
  return playerX + PLAYER_WIDTH / 2;
}

function getPlayerFootY() {
  return GROUND_WORLD_HEIGHT - playerDepth + jumpY;
}

function isPlayerNearTreeTrunk() {
  const centerX = getPlayerCenterX();
  const footY = getPlayerFootY();

  return (
    centerX >= TREE_TRUNK_X - TREE_CLIMB_DISTANCE &&
    centerX <= TREE_TRUNK_X + TREE_TRUNK_WIDTH + TREE_CLIMB_DISTANCE &&
    footY <= getMaxGroundedPlayerDepth() + 4 &&
    footY >= TREE_TRUNK_TOP - 18
  );
}

function isPlayerInTreeSpace() {
  return (
    !isTreeFalling &&
    (isPlayerNearTreeTrunk() || isPlayerInTreeCanopy())
  );
}

function isPlayerInTreeCanopy() {
  const centerX = getPlayerCenterX();
  const footY = getPlayerFootY();

  return (
    centerX >= TREE_CANOPY_LEFT &&
    centerX <= TREE_CANOPY_RIGHT &&
    footY >= TREE_CANOPY_TOP &&
    footY <= TREE_CANOPY_BOTTOM
  );
}

function isPlayerSupportedByTree() {
  return !isTreeFalling && (isPlayerNearTreeTrunk() || isPlayerInTreeCanopy());
}

function movePlayerVerticallyInTree(deltaDepth) {
  playerDepth += deltaDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  isTreeFalling = false;
  clampPlayerToTreeOutline();
}

function clampPlayerToTreeOutline() {
  playerDepth = Math.max(
    getMinTreePlayerDepth(),
    Math.min(getMaxTreePlayerDepth(), playerDepth)
  );
}

function getPlayerWorldY() {
  return -playerDepth + jumpY;
}

function startPlanting() {
  updateSeedDryState();

  if (heldItem !== HELD_ITEM_SEED || plantRuntime.isPlanting || !isOnGround || plantRuntime.isSeedDry) return;

  const playerBox = getPlayerBox();
  const spotWidth = PLANT_SPOT_WIDTH;
  const spotHeight = PLANT_SPOT_HEIGHT;

  const targetPlantSpotX = playerBox.left + playerBox.width / 2 - spotWidth / 2;
  const targetPlantSpotY = playerBox.bottom - spotHeight / 2;
  if (!canPlantAt(targetPlantSpotX, targetPlantSpotY)) return;

  plantRuntime.spotX = targetPlantSpotX;
  plantRuntime.spotY = targetPlantSpotY;
  heldItem = null;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    plantRuntime.isSeedPlanted = true;
    plantRuntime.lastWateredAt = Date.now();
    plantRuntime.wateredAtList = [];
    plantRuntime.status = "normal";
    plantRuntime.waterLevel = 1;
    plantRuntime.waterLevelUpdatedAt = Date.now();
    plantRuntime.becameEmptyAt = null;
    plantRuntime.isOverwatered = false;
    plantRuntime.needsFirstWater = true;
    plantRuntime.growthStartedAt = null;
    plantRuntime.isSproutGrown = false;
    plantRuntime.sproutGrownAt = null;
    setNpcStartPosition();
    playerStatus.textContent = "";
    seedCard.style.display = "none";
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    updatePlantState();
    saveSeedState();
  }, 5000);
}

function startPlantingExtraSeed() {
  const extraSeed = getHeldExtraSeed();
  if (
    !extraSeed ||
    plantRuntime.isPlanting ||
    !isOnGround ||
    isExtraSeedDry(extraSeed)
  ) {
    return;
  }

  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;

  if (!canPlantAt(plantX, plantY)) return;

  heldItem = null;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    extraSeed.planted = true;
    appleState.extraPlants.push(createExtraPlant("plant-" + extraSeed.id, plantX, plantY));
    playerStatus.textContent = "";
    updateExtraSeedsAndPlants();
    saveAppleState();
  }, 5000);
}

function plantInventorySeed(seedId) {
  const inventorySeed = appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === seedId;
  });

  if (
    !inventorySeed ||
    !inventorySeed.inInventory ||
    inventorySeed.planted ||
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isNpcDialogueRunning ||
    !isOnGround ||
    isExtraSeedDry(inventorySeed)
  ) {
    updateSeedInventory();
    return;
  }

  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;

  if (!canPlantAt(plantX, plantY)) return;

  plantingInventorySeedId = inventorySeed.id;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    plantingInventorySeedId = null;
    inventorySeed.planted = true;
    inventorySeed.inInventory = false;

    if (!plantRuntime.isSeedPlanted) {
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = Date.now();
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 1;
      plantRuntime.waterLevelUpdatedAt = Date.now();
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.needsFirstWater = true;
      plantRuntime.growthStartedAt = null;
      plantRuntime.isSproutGrown = false;
      plantRuntime.sproutGrownAt = null;
      plantSpot.style.display = "block";
      setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
      updatePlantState();
      saveSeedState();
    } else {
      appleState.extraPlants.push(createExtraPlant("plant-" + inventorySeed.id, plantX, plantY));
      updateExtraSeedsAndPlants();
    }

    playerStatus.textContent = "";
    updateSeedInventory();
    saveAppleState();
  }, 5000);
}

function createExtraPlant(id, x, y) {
  const now = Date.now();
  return {
    id,
    x,
    y,
    plantedAt: now,
    lastWateredAt: now,
    wateredAtList: [],
    status: "normal",
    waterLevel: 1,
    waterLevelUpdatedAt: now,
    becameEmptyAt: null,
    isOverwatered: false,
    needsFirstWater: true,
    growthStartedAt: null,
    isSproutGrown: false,
    sproutGrownAt: null
  };
}

function canPlantAt(x, y) {
  const plantCenters = [];

  if (plantRuntime.isSeedPlanted) {
    plantCenters.push({
      x: plantRuntime.spotX + PLANT_SPOT_WIDTH / 2,
      y: plantRuntime.spotY + PLANT_SPOT_HEIGHT / 2
    });
  }

  appleState.extraPlants.forEach(function (plant) {
    plantCenters.push({
      x: plant.x + PLANT_SPOT_WIDTH / 2,
      y: plant.y + PLANT_SPOT_HEIGHT / 2
    });
  });

  const targetX = x + PLANT_SPOT_WIDTH / 2;
  const targetY = y + PLANT_SPOT_HEIGHT / 2;

  return !plantCenters.some(function (center) {
    return Math.hypot(center.x - targetX, center.y - targetY) < minPlantSpacing;
  });
}

function getHeldExtraSeed() {
  const id = getHeldExtraSeedId(heldItem);
  if (!id) return null;
  return appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === id;
  }) || null;
}

function isExtraSeedDry(extraSeed, now) {
  return (now || Date.now()) - extraSeed.createdAt >= seedDryMs;
}

function useHeldItem() {
  if (plantRuntime.isPlanting || appleState.isEating) return;

  if (heldItem === HELD_ITEM_SEED) {
    startPlanting();
    return;
  }

  if (isHeldExtraSeed(heldItem)) {
    startPlantingExtraSeed();
    return;
  }

  if (heldItem === HELD_ITEM_BUCKET) {
    useBucket();
  }
}

function useBucket() {
  refillWellIfNeeded();

  if (isBucketFull) {
    if (isNearWellForPouring()) {
      if (wellState.water < maxWellWater) {
        wellState.water += 1;
        wellState.lastRefillAt = Date.now();
        saveWellState();
        updateWellImage();
        updateWellCard();
        createWaterSplash();
        isBucketFull = false;
      }
      return;
    }

    const wateringTarget = getNearestWateringTarget();
    if (wateringTarget) {
      waterPlant(wateringTarget);
      createWaterSplash();
    } else {
      createWaterSplash();
    }

    isBucketFull = false;
    return;
  }

  if (!isBucketFull && isNearWell() && wellState.water > 0) {
    isBucketFull = true;
    wellState.water -= 1;
    wellState.lastRefillAt = Date.now();
    saveWellState();
    updateWellImage();
    updateWellCard();
    return;
  }

}

function getNearestWateringTarget() {
  let nearest = null;

  if (plantRuntime.isSeedPlanted) {
    const distance = getCenterDistance(
      plantRuntime.spotX,
      plantRuntime.spotY,
      PLANT_SPOT_WIDTH,
      PLANT_SPOT_HEIGHT
    );
    if (distance < plantWaterDistance) {
      nearest = {
        type: "main",
        plant: plantRuntime,
        distance
      };
    }
  }

  appleState.extraPlants.forEach(function (plant) {
    const distance = getCenterDistance(plant.x, plant.y, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
    if (distance < plantWaterDistance && (!nearest || distance < nearest.distance)) {
      nearest = {
        type: "extra",
        plant,
        distance
      };
    }
  });

  return nearest;
}

function createWaterSplash() {
  const bucketSize = getBucketSize();
  const startX = bucketX + bucketSize.width / 2;
  const startY = bucketY + bucketSize.height * 0.75;

  for (let index = 0; index < 8; index += 1) {
    const drop = document.createElement("div");
    const offsetX = (index - 3.5) * 3;
    const fallX = (index - 3.5) * 5;
    const fallY = 18 + (index % 3) * 5;

    drop.className = "water-drop";
    drop.style.left = toScreenX(startX + offsetX) + "px";
    drop.style.top = toScreenY(startY) + "px";
    drop.style.setProperty("--drop-x", toScreenX(fallX) + "px");
    drop.style.setProperty("--drop-y", toScreenY(fallY) + "px");
    ground.appendChild(drop);

    window.setTimeout(function () {
      drop.remove();
    }, 600);
  }
}

function waterPlant(target) {
  if (target && target.type === "extra") {
    waterExtraPlant(target.plant);
    return;
  }

  const now = Date.now();

  updatePlantWaterLevel();

  plantRuntime.lastWateredAt = now;
  plantRuntime.needsFirstWater = false;

  if (plantRuntime.growthStartedAt === null && !plantRuntime.isSproutGrown) {
    plantRuntime.growthStartedAt = now;
  }

  plantRuntime.wateredAtList = plantRuntime.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);

  if (plantRuntime.status === "dry" || plantRuntime.isOverwatered || plantRuntime.status === "rotten") {
    saveSeedState();
    updatePlantState();
    return;
  }

  if (plantRuntime.waterLevel >= 2) {
    plantRuntime.isOverwatered = true;
    plantRuntime.status = "rotten";
    plantRuntime.growthStartedAt = null;
    plantRuntime.isSproutGrown = false;
    plantRuntime.sproutGrownAt = null;
  } else {
    plantRuntime.waterLevel += 1;
    plantRuntime.isOverwatered = false;
    plantRuntime.status = "normal";
  }

  plantRuntime.waterLevelUpdatedAt = now;
  plantRuntime.becameEmptyAt = null;

  saveSeedState();
  updatePlantState();
}

function waterExtraPlant(plant) {
  const now = Date.now();
  normalizeExtraPlantState(plant);
  updateExtraPlantWaterLevel(plant, now);

  plant.lastWateredAt = now;
  plant.needsFirstWater = false;

  if (plant.growthStartedAt === null && !plant.isSproutGrown) {
    plant.growthStartedAt = now;
  }

  plant.wateredAtList = plant.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);

  if (plant.status === "dry" || plant.isOverwatered || plant.status === "rotten") {
    saveAppleState();
    updateExtraSeedsAndPlants();
    return;
  }

  if (plant.waterLevel >= 2) {
    plant.isOverwatered = true;
    plant.status = "rotten";
    plant.growthStartedAt = null;
    plant.isSproutGrown = false;
    plant.sproutGrownAt = null;
  } else {
    plant.waterLevel += 1;
    plant.isOverwatered = false;
    plant.status = "normal";
  }

  plant.waterLevelUpdatedAt = now;
  plant.becameEmptyAt = null;

  saveAppleState();
  updateExtraSeedsAndPlants();
}

function updatePlantWaterLevel() {
  if (!plantRuntime.isSeedPlanted || plantRuntime.isOverwatered || plantRuntime.status === "dry" || plantRuntime.status === "rotten") {
    return;
  }

  const now = Date.now();
  const elapsedTicks = Math.floor(
    (now - plantRuntime.waterLevelUpdatedAt) / plantWaterLevelTickMs
  );

  if (elapsedTicks <= 0) return;

  const previousWaterLevel = plantRuntime.waterLevel;
  plantRuntime.waterLevel = Math.max(0, plantRuntime.waterLevel - elapsedTicks);
  plantRuntime.waterLevelUpdatedAt += elapsedTicks * plantWaterLevelTickMs;

  if (previousWaterLevel > 0 && plantRuntime.waterLevel === 0 && plantRuntime.becameEmptyAt === null) {
    plantRuntime.becameEmptyAt = plantRuntime.waterLevelUpdatedAt;
  }

  if (plantRuntime.waterLevel < 2 && !plantRuntime.isOverwatered) {
    plantRuntime.isOverwatered = false;
  }

  saveSeedState();
}

function updatePlantState() {
  if (!plantRuntime.isSeedPlanted) {
    waterNeeded.style.display = "none";
    plantCard.style.display = "none";
    growthCard.style.display = "none";
    sprout.style.display = "none";
    return;
  }

  const now = Date.now();
  updatePlantWaterLevel();

  if (
    plantRuntime.status !== "rotten" &&
    plantRuntime.status !== "wet" &&
    plantRuntime.becameEmptyAt !== null &&
    now - plantRuntime.becameEmptyAt >= plantDryMs
  ) {
    removeMainPlant();
    saveSeedState();
    updatePlantState();
    return;
  }

  if (plantRuntime.status === "dry" || plantRuntime.status === "rotten") {
    removeMainPlant();
    saveSeedState();
    updatePlantState();
    return;
  }

  if (plantRuntime.isOverwatered) {
    removeMainPlant();
    saveSeedState();
    updatePlantState();
    return;
  }

  if (plantRuntime.status === "rotten") {
    plantSpot.src = "soil-rotten.png";
  } else if (plantRuntime.status === "wet") {
    plantSpot.src = "soil-wet.png";
  } else if (plantRuntime.status === "dry") {
    plantSpot.src = "soil-dry.png";
  } else {
    plantSpot.src = "tilled-soil.png";
  }

  if (plantRuntime.status === "rotten") {
    waterNeeded.style.display = "none";
    plantCard.style.display = "none";
    growthCard.style.display = "none";
    sprout.style.display = "none";
  } else if (plantRuntime.needsFirstWater && plantRuntime.status !== "dry") {
    waterNeeded.style.display = "block";
    setWorldPosition(
      waterNeeded,
      plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
      plantRuntime.spotY - WATER_NEEDED_SIZE - 2
    );
  } else {
    waterNeeded.style.display = "none";
  }

  updatePlantCard();
  updatePlantGrowth();
}

function removeMainPlant() {
  plantRuntime.isSeedPlanted = false;
  plantRuntime.isPlanting = false;
  plantRuntime.spotX = 0;
  plantRuntime.spotY = 0;
  plantRuntime.lastWateredAt = null;
  plantRuntime.wateredAtList = [];
  plantRuntime.status = "normal";
  plantRuntime.waterLevel = 1;
  plantRuntime.waterLevelUpdatedAt = Date.now();
  plantRuntime.becameEmptyAt = null;
  plantRuntime.isOverwatered = false;
  plantRuntime.needsFirstWater = false;
  plantRuntime.growthStartedAt = null;
  plantRuntime.isSproutGrown = false;
  plantRuntime.sproutGrownAt = null;
  plantSpot.style.display = "none";
  waterNeeded.style.display = "none";
  sprout.style.display = "none";
  plantMaster.style.display = "none";
  npcBubble.style.display = "none";
  playerBubble.style.display = "none";
  growthCard.style.display = "none";
  mainPlantGrowthMeter.element.style.display = "none";
  markWorldDirty();
}

function updatePlantCard() {
  const wateringTarget = getNearestWateringTarget();
  if (wateringTarget && wateringTarget.type === "extra") {
    const plant = wateringTarget.plant;
    if (plant.status === "rotten") {
      plantCard.style.display = "none";
      return;
    }

    plantCard.style.display = "block";
    plantCard.classList.toggle("is-dry", plant.status === "dry");
    plantCard.classList.toggle("is-overwatered", plant.isOverwatered);
    plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plant.waterLevel + "/2";
    plantWaterSegments.forEach(function (segment, index) {
      segment.classList.toggle("is-filled", index < plant.waterLevel);
    });
    return;
  }

  if (
    !plantRuntime.isSeedPlanted ||
    plantRuntime.status === "rotten" ||
    !wateringTarget
  ) {
    plantCard.style.display = "none";
    return;
  }

  plantCard.style.display = "block";
  plantCard.classList.toggle("is-dry", plantRuntime.status === "dry");
  plantCard.classList.toggle("is-overwatered", plantRuntime.isOverwatered);
  plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plantRuntime.waterLevel + "/2";

  plantWaterSegments.forEach(function (segment, index) {
    segment.classList.toggle("is-filled", index < plantRuntime.waterLevel);
  });

}

function updatePlantGrowth() {
  if (!plantRuntime.isSeedPlanted || plantRuntime.growthStartedAt === null || plantRuntime.status === "dry" || plantRuntime.status === "rotten" || plantRuntime.isOverwatered) {
    growthCard.style.display = "none";
    mainPlantGrowthMeter.element.style.display = "none";
    sprout.style.display = plantRuntime.isSproutGrown && plantRuntime.status !== "rotten" ? "block" : "none";
    updateSproutPosition();
    return;
  }

  const elapsed = Date.now() - plantRuntime.growthStartedAt;
  const growthRatio = Math.min(1, elapsed / plantGrowthMs);
  const secondGrowthRatio = getPlantSecondGrowthRatio(plantRuntime, Date.now());
  updatePlantGrowthMeter(
    mainPlantGrowthMeter.element,
    mainPlantGrowthMeter.fill,
    plantRuntime.spotX,
    plantRuntime.spotY,
    growthRatio,
    secondGrowthRatio
  );
  const cardWidth = 42;
  const cardX = Math.max(
    0,
    Math.min(plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - cardWidth / 2, WORLD_WIDTH - cardWidth)
  );

  if (growthRatio >= 1) {
    if (!plantRuntime.isSproutGrown) {
      plantRuntime.isSproutGrown = true;
      plantRuntime.sproutGrownAt = Date.now();
    }
    growthCard.style.display = "none";
    updateSproutPosition();
    saveSeedState();
    return;
  }

  growthCard.style.display = "none";
  growthFill.style.width = growthRatio * 100 + "%";
  setWorldPosition(growthCard, cardX, plantRuntime.spotY - 26);
  sprout.style.display = "none";
}

function updateSproutPosition() {
  if (!plantRuntime.isSproutGrown || plantRuntime.status === "rotten") {
    sprout.style.display = "none";
    plantMaster.style.display = "none";
    npcBubble.style.display = "none";
    playerBubble.style.display = "none";
    return;
  }

  const grownAt =
    plantRuntime.sproutGrownAt ||
    (plantRuntime.growthStartedAt ? plantRuntime.growthStartedAt + plantGrowthMs : Date.now());
  const sproutElapsed = Date.now() - grownAt;
  const isBigSprout = sproutElapsed >= biggerSproutMs;
  const sproutWidth = isBigSprout ? 30 : SPROUT_WIDTH;
  const sproutHeight = isBigSprout ? 38 : SPROUT_HEIGHT;

  sprout.style.display = "block";
  sprout.classList.toggle("is-big", isBigSprout);
  sprout.src = isBigSprout ? "sprout-grown.svg" : "sprout.png";
  setWorldSize(sprout, sproutWidth, sproutHeight);
  setWorldPosition(
    sprout,
    plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - sproutWidth / 2,
    plantRuntime.spotY - sproutHeight + 7
  );
  updateNpcPosition();
}

function updateNpcPosition() {
  if (!isPlantMasterVisible()) {
    plantMaster.style.display = "none";
    npcBubble.style.display = "none";
    return;
  }

  setNpcStartPosition();
  plantMaster.style.display = "block";
  setWorldPosition(plantMaster, npcX, npcY);

  if (npcBubble.style.display === "block") {
    setWorldPosition(npcBubble, npcX + NPC_WIDTH / 2 - 13, npcY - 22);
  }

  if (playerBubble.style.display === "block") {
    updatePlayerBubblePosition();
  }

  updateNpcPrompt();
}

function updatePlayerBubblePosition() {
  const playerWorldLeft = playerX;
  const playerRenderedHeight = player.offsetHeight || PLAYER_HEIGHT;
  const playerWorldTop =
    GROUND_WORLD_HEIGHT - playerRenderedHeight - playerDepth + jumpY;

  setWorldPosition(
    playerBubble,
    playerWorldLeft + PLAYER_WIDTH / 2 - 13,
    playerWorldTop - 22
  );
}

function updateNpcPrompt() {
  if (isNpcDialogueRunning || isNpcDialogueComplete) return;

  if (isNearPlantMaster()) {
    if (npcBubble.dataset.promptShown === "true") return;

    npcBubble.dataset.speaker = "npc";
    npcBubble.dataset.promptShown = "true";
    npcBubble.textContent =
      "\uC790\uB124 \uC2DD\uBB3C\uC758 \uB2EC\uC778\uC774 \uB418\uC5B4 \uBCF4\uC9C0 \uC54A\uACA0\uB098?";
    npcBubble.style.display = "block";
    setWorldPosition(npcBubble, npcX + NPC_WIDTH / 2 - 24, npcY - 14);

    window.clearTimeout(npcPromptHideTimeout);
    npcPromptHideTimeout = window.setTimeout(function () {
      if (!isNpcDialogueRunning) {
        npcBubble.style.display = "none";
      }
    }, 5000);
  } else if (npcBubble.dataset.speaker !== "player") {
    npcBubble.style.display = "none";
    npcBubble.dataset.promptShown = "false";
    window.clearTimeout(npcPromptHideTimeout);
  }
}

function updatePlayerAlert() {
  if (playerAlert.style.display !== "block") return;

  const playerRenderedHeight = player.offsetHeight || PLAYER_HEIGHT;
  const playerWorldTop =
    GROUND_WORLD_HEIGHT - playerRenderedHeight - playerDepth + jumpY;
  const alertWidth = playerAlert.offsetWidth || 10;
  const alertHeight = playerAlert.offsetHeight || 10;
  setWorldPosition(
    playerAlert,
    playerX + PLAYER_WIDTH / 2 - alertWidth / 2,
    playerWorldTop - alertHeight - 2
  );
}

function updateGuideCard() {
  isGuideBookOpen = false;
  isGuideDismissedAtSign = true;
  guideCard.style.display = "none";
  guideBook.classList.remove("is-near");
}

function getGuideMaxPage() {
  return isGuidePlantPageUnlocked ? 1 : 0;
}

function updateGuidePages() {
  const maxPage = getGuideMaxPage();

  if (guidePageIndex > maxPage) {
    guidePageIndex = maxPage;
  }

  guidePages.forEach(function (page, index) {
    page.classList.toggle("is-active", index === guidePageIndex);
  });

  guidePrev.style.display = maxPage > 0 && guidePageIndex > 0 ? "block" : "none";
  guideNext.style.display =
    maxPage > 0 && guidePageIndex < maxPage ? "block" : "none";
  guidePageText.textContent = guidePageIndex + 1 + "/" + (maxPage + 1);
}

function loadWellState() {
  const loaded = loadWellStateFromStorage({
    wellWaterKey,
    lastWellRefillKey,
    maxWellWater,
    defaultWellWater: maxWellWater,
    defaultLastWellRefillAt: Date.now()
  });
  wellState.water = loaded.wellWater;
  wellState.lastRefillAt = loaded.lastWellRefillAt;

  refillWellIfNeeded();
}

function saveWellState() {
  saveWellStateToStorage({
    wellWaterKey,
    lastWellRefillKey,
    wellWater: wellState.water,
    lastWellRefillAt: wellState.lastRefillAt
  });
  markWorldDirty();
}

function refillWellIfNeeded() {
  const now = Date.now();
  const elapsedRefills = Math.floor((now - wellState.lastRefillAt) / wellRefillMs);

  if (elapsedRefills > 0) {
    wellState.water = Math.min(maxWellWater, wellState.water + elapsedRefills);
    wellState.lastRefillAt =
      wellState.water >= maxWellWater
        ? now
        : wellState.lastRefillAt + elapsedRefills * wellRefillMs;
    saveWellState();
  }

  updateWellImage();
  updateWellCard();
}

function updateWellImage() {
  well.src = wellState.water > 0 ? "well.png" : "well-empty.png";
}

function updateWellCard() {
  const isVisible = isNearWell();
  const waterRatio = wellState.water / maxWellWater;
  const wellImage = wellState.water > 0 ? "well.png" : "well-empty.png";

  wellCard.style.display = isVisible ? "flex" : "none";
  wellCardImage.src = wellImage;
  wellWaterText.textContent = wellState.water + "/" + maxWellWater;
  wellWaterFill.style.width = waterRatio * 100 + "%";
}

function updateSeedCard() {
  updateSeedDryState();

  if (plantRuntime.isSeedPlanted || (!isNearSeed() && heldItem !== HELD_ITEM_SEED)) {
    seedCard.style.display = "none";
    return;
  }

  const remaining = getSeedDryRemainingMs();
  const remainingRatio = remaining / seedDryMs;
  const gaugeDegrees = remainingRatio * 360;
  const remainingMinutes = Math.ceil(remaining / 60000);

  seedCard.style.display = "flex";
  seedDryGauge.style.background =
    "conic-gradient(#e3362d " +
    gaugeDegrees +
    "deg, #ead2d0 0deg)";

  if (plantRuntime.isSeedDry) {
    seedDryText.textContent = "\uB9C8\uB978 \uC528\uC557";
    return;
  }

  seedDryText.textContent =
    remainingMinutes + "\uBD84 \uB4A4 \uB9D0\uB77C\uC694!";
}

function getSeedDryRemainingMs() {
  return Math.max(0, seedDryMs - (Date.now() - plantRuntime.seedCreatedAt));
}

function applyLoadedPlantState(loadedPlant) {
  plantRuntime.isSeedPlanted = loadedPlant.isSeedPlanted;
  plantRuntime.spotX = loadedPlant.plantSpotX;
  plantRuntime.spotY = loadedPlant.plantSpotY;
  plantRuntime.lastWateredAt = loadedPlant.plantLastWateredAt;
  plantRuntime.wateredAtList = loadedPlant.plantWateredAtList;
  plantRuntime.status = loadedPlant.plantState;
  plantRuntime.waterLevel = loadedPlant.plantWaterLevel;
  plantRuntime.waterLevelUpdatedAt = loadedPlant.plantWaterLevelUpdatedAt;
  plantRuntime.becameEmptyAt = loadedPlant.plantBecameEmptyAt;
  plantRuntime.isOverwatered = loadedPlant.isPlantOverwatered;
  plantRuntime.needsFirstWater = loadedPlant.plantNeedsFirstWater;
  plantRuntime.growthStartedAt = loadedPlant.plantGrowthStartedAt;
  plantRuntime.isSproutGrown = loadedPlant.isSproutGrown;
  plantRuntime.sproutGrownAt =
    loadedPlant.plantSproutGrownAt ||
    (plantRuntime.isSproutGrown && plantRuntime.growthStartedAt
      ? plantRuntime.growthStartedAt
      : null);
}

function getPlantStateForStorage() {
  return {
    isSeedPlanted: plantRuntime.isSeedPlanted,
    plantSpotX: plantRuntime.spotX,
    plantSpotY: plantRuntime.spotY,
    plantLastWateredAt: plantRuntime.lastWateredAt,
    plantWateredAtList: plantRuntime.wateredAtList,
    plantState: plantRuntime.status,
    plantWaterLevel: plantRuntime.waterLevel,
    plantWaterLevelUpdatedAt: plantRuntime.waterLevelUpdatedAt,
    plantBecameEmptyAt: plantRuntime.becameEmptyAt,
    isPlantOverwatered: plantRuntime.isOverwatered,
    plantNeedsFirstWater: plantRuntime.needsFirstWater,
    plantGrowthStartedAt: plantRuntime.growthStartedAt,
    isSproutGrown: plantRuntime.isSproutGrown,
    plantSproutGrownAt: plantRuntime.sproutGrownAt,
    npcX,
    npcY
  };
}

function loadSeedState() {
  const loaded = loadSeedStateFromStorage({
    seedCreatedAtKey,
    seedPlantedStateKey,
    defaultSeedCreatedAt: Date.now(),
    defaultNpcX: NPC_START_X,
    defaultNpcY: NPC_START_Y
  });
  plantRuntime.seedCreatedAt = loaded.seedCreatedAt;
  applyLoadedPlantState(loaded.planted);
  npcX = loaded.planted.npcX;
  npcY = loaded.planted.npcY;

  if (plantRuntime.isSeedPlanted) {
    heldItem = null;
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    seedCard.style.display = "none";
    updatePlantState();
  }

  updateSeedDryState();
}

function saveSeedState() {
  saveSeedStateToStorage({
    seedCreatedAtKey,
    seedPlantedStateKey,
    seedCreatedAt: plantRuntime.seedCreatedAt,
    plantedState: getPlantStateForStorage()
  });
  markWorldDirty();
}

function updateSeedDryState() {
  plantRuntime.isSeedDry = Date.now() - plantRuntime.seedCreatedAt >= seedDryMs;
}

function updatePlayerStatus() {
  if (!plantRuntime.isPlanting && !appleState.isEating) {
    playerStatus.style.display = "none";
    return;
  }

  const playerBox = getPlayerBox();
  const textWidth = playerStatus.offsetWidth || 40;
  const halfTextWidth = textWidth / 2;
  const targetX = toScreenX(playerBox.left + playerBox.width / 2 + 13);
  const clampedX = Math.max(
    halfTextWidth,
    Math.min(targetX, window.innerWidth - halfTextWidth)
  );

  playerStatus.style.display = "block";
  playerStatus.style.transform =
    "translate(" +
    clampedX +
    "px, " +
    toScreenY(playerBox.top + 26) +
    "px) translate(-50%, -100%)";
}

function updateCamera() {
  zoomLevel = clampZoom(zoomLevel);
  const playerBox = getPlayerBox();
  const groundTop = WORLD_HEIGHT - GROUND_WORLD_HEIGHT;
  const playerCenterX = playerBox.left + playerBox.width / 2;
  const playerCenterY = groundTop + playerBox.top + playerBox.height / 2;
  const visibleWidth = window.innerWidth / zoomLevel;
  const visibleHeight = window.innerHeight / zoomLevel;
  const targetX = playerCenterX - visibleWidth / 2;
  const targetY = playerCenterY - visibleHeight / 2;
  const maxCameraX = Math.max(0, WORLD_WIDTH - visibleWidth);
  const maxCameraY = Math.max(0, WORLD_HEIGHT - visibleHeight);

  cameraX = Math.max(0, Math.min(targetX, maxCameraX));
  cameraY = Math.max(0, Math.min(targetY, maxCameraY));
  world.style.transform =
    "translate(" +
    -cameraX * zoomLevel +
    "px, " +
    -cameraY * zoomLevel +
    "px) scale(" +
    zoomLevel +
    ")";
}

function getMaxZoom() {
  return Math.max(maxZoom, getFitZoom() + 1);
}

function clampZoom(value) {
  return Math.max(getFitZoom(), Math.min(getMaxZoom(), value));
}

function initializeZoom() {
  if (hasInitializedZoom) return;
  zoomLevel = clampZoom(defaultZoom);
  hasInitializedZoom = true;
}

function postJson(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(function (response) {
    return response.json().then(function (data) {
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "요청에 실패했습니다.");
      }

      return data;
    });
  });
}

function applyPlayerColor(color) {
  const normalizedColor = normalizeHexColor(color) || "#ffffff";
  selectedPlayerColor = normalizedColor;
  document.documentElement.style.setProperty("--player-color", normalizedColor);
  document.documentElement.style.setProperty("--preview-player-color", normalizedColor);
  localStorage.setItem(lastSelectedColorKey, normalizedColor);
  if (currentUserId) {
    localStorage.setItem(currentUserColorKey, normalizedColor);
    localStorage.setItem(currentUserHasChosenColorKey, currentUserId);
    localStorage.setItem("ovcUserColorV1:" + currentUserId, normalizedColor);
  }
  player.style.setProperty("--player-color", normalizedColor);
  playerColorBody.style.display = "none";
  player.src = getTintedPlayerSrc(normalizedColor);
  player.classList.toggle("needs-outline", needsDarkOutline(normalizedColor));
  player.classList.add("is-colorized");
  addNetworkDebugLog("apply color: " + normalizedColor);
  syncPlayerColorToServer();
}

function getTintedPlayerSrc(color) {
  const tintColor = /^#[0-9a-fA-F]{6}$/.test(color || "") ? color.toLowerCase() : "#ffffff";

  if (playerTintCache.has(tintColor)) {
    return playerTintCache.get(tintColor);
  }

  if (!playerBaseImageReady || !playerBaseImage.naturalWidth || !playerBaseImage.naturalHeight) {
    return "player-white.png";
  }

  const canvas = document.createElement("canvas");
  canvas.width = playerBaseImage.naturalWidth;
  canvas.height = playerBaseImage.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return "player-white.png";
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(playerBaseImage, 0, 0);
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = tintColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";

  const tintedSrc = canvas.toDataURL("image/png");
  playerTintCache.set(tintColor, tintedSrc);
  return tintedSrc;
}

function needsDarkOutline(color) {
  if (!/^#[0-9a-fA-F]{6}$/.test(color || "")) return false;
  const normalized = color.toLowerCase();
  if (normalized === "#ffffff" || normalized === "#000000") return false;
  const r = parseInt(color.slice(1, 3), 16) / 255;
  const g = parseInt(color.slice(3, 5), 16) / 255;
  const b = parseInt(color.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.62;
}

function getPlayerColorFilter(color) {
  if (color === "#ffffff") return "none";

  if (color === "#111827") {
    return "brightness(0) saturate(100%) invert(7%) sepia(13%) saturate(2308%) hue-rotate(182deg) brightness(96%) contrast(93%)";
  }

  return "saturate(160%) brightness(0.98)";
}

function buildCharacterColorGrid() {
  characterColorGrid.innerHTML = "";

  characterColors.forEach(function (color) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-color-option";
    button.style.background = color;
    button.setAttribute("aria-label", color + " 색깔");

    if (color === selectedPlayerColor) {
      button.classList.add("is-selected");
    }

    button.addEventListener("click", function () {
      selectedPlayerColor = color;
      document.documentElement.style.setProperty("--preview-player-color", color);
      applyPlayerColor(color);
      if (multiplayerChannel) {
        sendMultiplayerPresence(true);
      }

      characterColorGrid.querySelectorAll(".character-color-option").forEach(function (option) {
        option.classList.remove("is-selected");
      });
      button.classList.add("is-selected");
    });

    characterColorGrid.appendChild(button);
  });
}

function openCharacterSelectIfNeeded() {
  if (!currentUserId || !currentUserName) {
    window.location.replace("/ovc-login.html?v=20260508s");
    return;
  }

  playerName.textContent = currentUserName;

  if (hasSpawnedCharacter) {
    player.classList.remove("is-hidden-before-spawn");
    if (playerBaseImageReady) {
      applyPlayerColor(selectedPlayerColor);
      syncPlayerColorToServer(true);
      setupMultiplayer();
    } else {
      playerBaseImage.addEventListener("load", function onceLoaded() {
        playerBaseImage.removeEventListener("load", onceLoaded);
        applyPlayerColor(selectedPlayerColor);
        syncPlayerColorToServer(true);
        setupMultiplayer();
      }, { once: true });
    }
    return;
  }

  isCharacterSelecting = true;
  player.classList.add("is-hidden-before-spawn");
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}

function openCharacterColorChange() {
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  isCharacterSelecting = true;
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}

function finishCharacterSelect() {
  hasSpawnedCharacter = true;
  isCharacterSelecting = false;
  localStorage.setItem(currentUserColorKey, selectedPlayerColor);
  localStorage.setItem(currentUserHasChosenColorKey, currentUserId);
  characterSelectOverlay.classList.remove("is-open");
  player.classList.remove("is-hidden-before-spawn");
  applyPlayerColor(selectedPlayerColor);

  syncPlayerColorToServer(true);

  setupMultiplayer();
}

function updatePlayerName() {
  if (!currentUserName || !hasSpawnedCharacter) {
    playerName.style.display = "none";
    return;
  }

  const playerBox = getPlayerBox();
  const nameWidth = playerName.offsetWidth || 36;
  const x = toScreenX(playerBox.left + playerBox.width / 2) - nameWidth / 2;
  const y = toScreenY(playerBox.top) + 13;

  playerName.textContent = currentUserName;
  playerName.style.display = "block";
  playerName.style.transform = "translate(" + x + "px, " + y + "px)";
}

function setupMultiplayer() {
  if (!hasSpawnedCharacter) {
    updateMultiplayerStatus("색 선택 전");
    addNetworkDebugLog("multiplayer skipped: character not spawned");
    return;
  }

  if (multiplayerChannel) {
    if (isMultiplayerSubscribed) {
      updateMultiplayerStatus("연결됨");
      sendMultiplayerPresence(true);
      addNetworkDebugLog("multiplayer reuse: subscribed channel");
    } else {
      updateMultiplayerStatus("연결중");
      addNetworkDebugLog("multiplayer reuse: waiting subscribe");
    }
    return;
  }

  if (
    !currentUserId ||
    !currentSessionId ||
    !window.OVCOnline ||
    !window.OVCOnline.isConfigured()
  ) {
    updateMultiplayerStatus("연결 안됨");
    addNetworkDebugLog(
      "multiplayer unavailable: userId=" +
      Boolean(currentUserId) +
      ", sessionId=" +
      Boolean(currentSessionId) +
      ", online=" +
      Boolean(window.OVCOnline) +
      ", configured=" +
      Boolean(window.OVCOnline && window.OVCOnline.isConfigured())
    );
    return;
  }

  if (
    window.OVC_ONLINE_CONFIG &&
    typeof window.OVC_ONLINE_CONFIG.supabaseKey === "string" &&
    window.OVC_ONLINE_CONFIG.supabaseKey.startsWith("sb_publishable_")
  ) {
    addNetworkDebugLog("warning: sb_publishable key can close Realtime immediately; use anon public key");
  }

  updateMultiplayerStatus("연결중");
  const channel = window.OVCOnline.createPresenceChannel(
    window.OVC_ONLINE_CONFIG.multiplayerRoom,
    currentSessionId
  );
  multiplayerChannel = channel;
  const attempt = ++multiplayerConnectAttempt;

  if (!channel) {
    updateMultiplayerStatus("연결 안됨");
    addNetworkDebugLog("multiplayer failed: createPresenceChannel returned null");
    return;
  }
  let terminalHandled = false;

  channel
    .on("broadcast", { event: "player_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemotePlayerBroadcast(payload.payload);
    })
    .on("system", {}, function (payload) {
      if (channel !== multiplayerChannel) return;
      addNetworkDebugLog("system: " + JSON.stringify(payload || {}));
      const message = String((payload && payload.message) || "");
      if (message.toLowerCase().includes("presence rate limit exceeded")) {
        addNetworkDebugLog("presence limit warning ignored (broadcast mode)");
      }
    })
    .subscribe(function (status, error) {
      addNetworkDebugLog(
        "channel #" +
        attempt +
        " status: " +
        status +
        (error && error.message ? " (" + error.message + ")" : "")
      );
      if (channel !== multiplayerChannel) return;
      if (status === "SUBSCRIBED") {
        isMultiplayerSubscribed = true;
        clearMultiplayerReconnectTimeout();
        updateMultiplayerStatus("연결됨");
        setTimeout(function () {
          if (channel !== multiplayerChannel) return;
          sendMultiplayerPresence(true);
        }, 600);
        return;
      }

      if (status === "TIMED_OUT" || status === "CHANNEL_ERROR" || status === "CLOSED") {
        if (terminalHandled) return;
        terminalHandled = true;
        isMultiplayerSubscribed = false;
        const client =
          window.OVCOnline && typeof window.OVCOnline.getClient === "function"
            ? window.OVCOnline.getClient()
            : null;
        if (client && typeof client.removeChannel === "function") {
          Promise.resolve(client.removeChannel(channel)).catch(function () {
            // Keep reconnecting even if channel cleanup fails.
          });
        }
        if (window.OVCOnline && typeof window.OVCOnline.resetClient === "function") {
          window.OVCOnline.resetClient();
          addNetworkDebugLog("reset supabase realtime client");
        }
        multiplayerChannel = null;
        updateMultiplayerStatus("연결 안됨");
        scheduleMultiplayerReconnect(1500);
      }
    });
}

function sendMultiplayerPresence(forceSend) {
  if (!hasSpawnedCharacter) return;

  const now = Date.now();
  const state = {
    id: currentSessionId,
    userId: currentUserId,
    name: currentUserName,
    action: plantRuntime.isPlanting ? "planting" : (appleState.isEating ? "eating" : "state"),
    room: window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    color: selectedPlayerColor,
    x: playerX,
    depth: playerDepth,
    jumpY,
    updatedAt: now
  };
  const stateKey = [
    state.color,
    Math.round(state.x),
    Math.round(state.depth),
    Math.round(state.jumpY)
  ].join("|");
  const hasChanged = stateKey !== lastPresenceStateKey;

  // Broadcast is the primary multiplayer sync path. Keep a heartbeat so idle
  // players stay visible even when they are not moving.
  if (multiplayerChannel && (forceSend || (hasChanged && now - lastBroadcastAt >= 120) || now - lastHeartbeatBroadcastAt >= 1000)) {
    Promise.resolve(multiplayerChannel.send({
      type: "broadcast",
      event: "player_state",
      payload: state
    })).catch(function (error) {
      addNetworkDebugLog(
        "broadcast error: " + (error && error.message ? error.message : "unknown")
      );
    });
    lastBroadcastAt = now;
    if (forceSend || !hasChanged) {
      lastHeartbeatBroadcastAt = now;
    }
  }
  if (hasChanged || forceSend) {
    lastPresenceStateKey = stateKey;
  }
  if (hasChanged || now - lastPresenceDbSyncAt >= 2000) {
    syncPresenceToDatabase(state);
  }
  if (now - lastPresenceDbPollAt >= 2000) {
    pollPresenceDatabase();
  }
  lastPresenceSentAt = now;
}

function syncPresenceToDatabase(state) {
  if (
    isPresenceDbSyncing ||
    !window.OVCOnline ||
    typeof window.OVCOnline.savePresence !== "function"
  ) {
    return;
  }

  isPresenceDbSyncing = true;
  lastPresenceDbSyncAt = Date.now();
  window.OVCOnline.savePresence(state).catch(function (error) {
    addNetworkDebugLog(
      "presence db save error: " + (error && error.message ? error.message : "unknown")
    );
  }).finally(function () {
    isPresenceDbSyncing = false;
  });
}

function pollPresenceDatabase() {
  if (
    isPresenceDbPolling ||
    !window.OVCOnline ||
    typeof window.OVCOnline.listPresence !== "function"
  ) {
    return;
  }

  isPresenceDbPolling = true;
  lastPresenceDbPollAt = Date.now();
  window.OVCOnline.listPresence(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom
  ).then(function (players) {
    players.forEach(function (state) {
      if (!state || state.id === currentSessionId) return;
      renderRemotePlayerState(state);
    });
    updateRemotePlayerCount();
  }).catch(function (error) {
    addNetworkDebugLog(
      "presence db poll error: " + (error && error.message ? error.message : "unknown")
    );
  }).finally(function () {
    isPresenceDbPolling = false;
  });
}

function sendMultiplayerLeave() {
  if (!currentSessionId) return;

  if (heldItem === HELD_ITEM_BUCKET || window.OVC_SHARED_BUCKET_HELD_BY === currentSessionId) {
    if (heldItem === HELD_ITEM_BUCKET) {
      dropBucket();
    }
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    markWorldDirty();
    syncWorldState(true);
  }

  if (multiplayerChannel) {
    Promise.resolve(multiplayerChannel.send({
      type: "broadcast",
      event: "player_state",
      payload: {
        id: currentSessionId,
        userId: currentUserId,
        name: currentUserName,
        action: "leave",
        updatedAt: Date.now()
      }
    })).catch(function () {
      // The page may be closing; best effort is enough here.
    });
  }

  if (window.OVCOnline && typeof window.OVCOnline.removePresence === "function") {
    Promise.resolve(window.OVCOnline.removePresence(currentSessionId)).catch(function () {
      // The page may be closing; best effort is enough here.
    });
  }
}

function renderRemotePlayersFromPresence(presenceState) {
  const nextRemotePlayers = {};

  Object.keys(presenceState || {}).forEach(function (presenceKey) {
    const presences = presenceState[presenceKey];
    if (!Array.isArray(presences) || presenceKey === currentSessionId) return;

    const latestPresence = presences[presences.length - 1];
    if (!latestPresence || !latestPresence.id || latestPresence.id === currentSessionId) return;

    nextRemotePlayers[latestPresence.id] = latestPresence;
  });

  Object.keys(nextRemotePlayers).forEach(function (remoteId) {
    renderRemotePlayerState(nextRemotePlayers[remoteId]);
  });

  updateRemotePlayerCount();
}

function handleRemotePlayerBroadcast(state) {
  if (!state || !state.id || state.id === currentSessionId) return;
  if (state.action === "leave") {
    removeRemotePlayer(state.id);
    return;
  }

  renderRemotePlayerState(state);
  updateRemotePlayerCount();
}

function removeRemotePlayer(remoteId) {
  const remotePlayer = remotePlayers[remoteId];
  if (!remotePlayer) return;
  remotePlayer.element.remove();
  delete remotePlayers[remoteId];
  updateRemotePlayerCount();
}

function renderRemotePlayerState(state) {
  const remoteId = state.id;
  const remotePlayer = remotePlayers[remoteId] || createRemotePlayer(remoteId);
  const remoteColor = state.color || "#7dd3fc";

  remotePlayer.nameElement.textContent = state.name || "OVC";
  remotePlayer.statusElement.textContent =
    state.action === "planting"
      ? "씨앗 심는중..."
      : state.action === "eating"
        ? "먹는중..."
        : "";
  remotePlayer.statusElement.style.display = remotePlayer.statusElement.textContent ? "block" : "none";
  remotePlayer.bodyElement.src = getTintedPlayerSrc(remoteColor);
  remotePlayer.element.classList.toggle("needs-outline", needsDarkOutline(remoteColor));
  setWorldPosition(
    remotePlayer.element,
    Number(state.x) || 0,
    -(Number(state.depth) || 0) + (Number(state.jumpY) || 0)
  );
  remotePlayer.lastSeenAt = Date.now();
}

function createRemotePlayer(remoteId) {
  const element = document.createElement("div");
  const bodyElement = document.createElement("img");
  const nameElement = document.createElement("div");
  const statusElement = document.createElement("div");

  element.className = "remote-player";
  bodyElement.className = "remote-player-body";
  bodyElement.alt = "";
  bodyElement.decoding = "async";
  bodyElement.draggable = false;
  element.dataset.remoteId = remoteId;
  nameElement.className = "remote-player-name";
  statusElement.className = "remote-player-status";
  element.appendChild(bodyElement);
  element.appendChild(nameElement);
  element.appendChild(statusElement);
  ground.appendChild(element);
  setWorldSize(element, PLAYER_WIDTH);

  remotePlayers[remoteId] = { element, bodyElement, nameElement, statusElement, lastSeenAt: Date.now() };
  return remotePlayers[remoteId];
}

function pruneStaleRemotePlayers() {
  const now = Date.now();
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.lastSeenAt) return;
    if (now - remotePlayer.lastSeenAt < 90000) return;
    removeRemotePlayer(remoteId);
  });
}

function updateRemotePlayerCount() {
  remotePlayerCount = Object.keys(remotePlayers).length;
  updateMultiplayerStatus(multiplayerStatusText);
}

function updateMultiplayerStatus(statusText) {
  multiplayerStatusText = statusText;
  if (!multiplayerStatus) return;

  const statusLabel =
    multiplayerStatusText === "연결됨" ||
    multiplayerStatusText === "연결중" ||
    multiplayerStatusText === "색 선택 전"
      ? multiplayerStatusText
      : "연결 안됨";
  multiplayerStatus.textContent =
    "멀티: " + statusLabel + " / 로그인 " + getOnlinePlayerCount();
}

function clearMultiplayerReconnectTimeout() {
  if (multiplayerReconnectTimeout) {
    clearTimeout(multiplayerReconnectTimeout);
    multiplayerReconnectTimeout = null;
  }
}

function scheduleMultiplayerReconnect(delayMs) {
  if (multiplayerReconnectTimeout || !hasSpawnedCharacter || isLoggingOut) return;
  const waitMs = Math.max(500, Number(delayMs) || 1500);
  addNetworkDebugLog("schedule reconnect in " + waitMs + "ms");
  multiplayerReconnectTimeout = setTimeout(function () {
    multiplayerReconnectTimeout = null;
    addNetworkDebugLog("reconnect attempt");
    setupMultiplayer();
  }, waitMs);
}

function syncPlayerColorToServer(forceSync) {
  if (!hasSpawnedCharacter || !currentUserId) return;
  if (!/^#[0-9a-fA-F]{6}$/.test(selectedPlayerColor || "")) return;
  const colorToSync = selectedPlayerColor.toLowerCase();
  if (!forceSync && colorToSync === lastSyncedPlayerColor) return;

  if (window.OVCOnline && window.OVCOnline.isConfigured()) {
    window.OVCOnline.savePlayerColor(currentUserId, colorToSync).then(function () {
      lastSyncedPlayerColor = colorToSync;
      addNetworkDebugLog("color synced online: " + colorToSync);
    }).catch(function (error) {
      showOnlineDebugMessage(
        "색 저장 실패: " +
        (error && error.message ? error.message : "온라인 서버 확인 필요")
      );
    });
    return;
  }

  if (!currentUserName) return;
  postJson("/api/player/color", {
    name: currentUserName,
    color: colorToSync
  }).then(function () {
    lastSyncedPlayerColor = colorToSync;
    addNetworkDebugLog("color synced local: " + colorToSync);
  }).catch(function (error) {
    showOnlineDebugMessage(
      "색 저장 실패: " +
      (error && error.message ? error.message : "로컬 서버 확인 필요")
    );
  });
}

function getOnlinePlayerCount() {
  return hasSpawnedCharacter ? remotePlayerCount + 1 : remotePlayerCount;
}

function openAdminPanel() {
  adminOverlay.classList.add("is-open");
  adminOverlay.setAttribute("aria-hidden", "false");
  loadAdminAccounts();
}

function closeAdminPanel() {
  adminOverlay.classList.remove("is-open");
  adminOverlay.setAttribute("aria-hidden", "true");
}

async function loadAdminAccounts() {
  adminMessage.textContent = "계정 불러오는 중...";
  adminAccountList.innerHTML = "";

  try {
    const accounts = await window.OVCOnline.listAccounts();
    adminAccountList.dataset.accounts = JSON.stringify(accounts);
    renderAdminAccounts(accounts);
    adminMessage.textContent = accounts.length + "개 계정";
  } catch (error) {
    adminMessage.textContent = error.message;
  }
}

function renderAdminAccounts(accounts) {
  adminAccountList.innerHTML = "";

  if (!accounts.length) {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = "가입된 계정이 없습니다.";
    adminAccountList.appendChild(empty);
    return;
  }

  accounts.forEach(function (account) {
    const row = document.createElement("div");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const meta = document.createElement("div");
    const deleteButton = document.createElement("button");

    row.className = "admin-account-row";
    name.className = "admin-account-name";
    meta.className = "admin-account-meta";
    deleteButton.className = "admin-delete-button";

    name.textContent = account.name || "이름 없음";
    meta.textContent =
      (account.color || "색 없음") +
      " / " +
      formatAdminDate(account.created_at);
    deleteButton.textContent = "삭제";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", async function () {
      if (!confirm((account.name || "이 계정") + "을 삭제할까요?")) return;

      try {
        deleteButton.disabled = true;
        await window.OVCOnline.deleteAccount(account.id);
        const remainingAccounts = getRenderedAdminAccounts().filter(function (savedAccount) {
          return savedAccount.id !== account.id;
        });
        adminAccountList.dataset.accounts = JSON.stringify(remainingAccounts);
        renderAdminAccounts(remainingAccounts);

        if (account.id === currentUserId) {
          logout();
          return;
        }
        adminMessage.textContent = "삭제 완료";
        loadAdminAccounts();
      } catch (error) {
        deleteButton.disabled = false;
        adminMessage.textContent = error.message;
      }
    });

    info.appendChild(name);
    info.appendChild(meta);
    row.appendChild(info);
    row.appendChild(deleteButton);
    adminAccountList.appendChild(row);
  });
}

function getRenderedAdminAccounts() {
  try {
    const parsed = JSON.parse(adminAccountList.dataset.accounts || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function formatAdminDate(value) {
  if (!value) return "날짜 없음";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "날짜 없음";

  return date.toLocaleString("ko-KR");
}

function openLogoutConfirm() {
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  logoutConfirmOverlay.classList.add("is-open");
  logoutConfirmOverlay.setAttribute("aria-hidden", "false");
}

function closeLogoutConfirm() {
  logoutConfirmOverlay.classList.remove("is-open");
  logoutConfirmOverlay.setAttribute("aria-hidden", "true");
}

function showOnlineDebugMessage(message) {
  if (!onlineDebugToast || !message) return;
  onlineDebugToast.textContent = message;
  onlineDebugToast.classList.add("is-visible");
  addNetworkDebugLog("toast: " + message);
  if (onlineDebugToastTimeout) {
    clearTimeout(onlineDebugToastTimeout);
  }
  onlineDebugToastTimeout = setTimeout(function () {
    onlineDebugToast.classList.remove("is-visible");
  }, 3000);
}

function addNetworkDebugLog(message) {
  if (!networkDebugPanel || !message) return;
  const timestamp = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  networkDebugLines.push("[" + timestamp + "] " + message);
  while (networkDebugLines.length > 14) {
    networkDebugLines.shift();
  }
  networkDebugPanel.textContent = networkDebugLines.join("\n");
  networkDebugPanel.classList.add("is-visible");
}

async function validateCurrentAccount() {
  if (isLoggingOut || !currentUserId || !window.OVCOnline) return;

  try {
    if (window.OVCOnline.isConfigured() && typeof window.OVCOnline.validateSession === "function") {
      const storedToken = localStorage.getItem(currentSessionTokenKey);
      // If session token is not ready (or DB column not migrated yet),
      // skip forced logout so multiplayer can still run.
      if (!storedToken) return;
      const isValid = await window.OVCOnline.validateSession(currentUserId, storedToken);
      if (!isValid) {
        showOnlineDebugMessage("다른 기기에서 로그인되어 자동 로그아웃됩니다.");
        setTimeout(logout, 1200);
        return;
      }
    } else {
      const account = await window.OVCOnline.getAccount(currentUserId);
      if (!account) {
        logout();
      }
    }
  } catch (error) {
    // Temporary network errors should not kick the player out.
  }
}

function logout() {
  if (isLoggingOut) return;
  isLoggingOut = true;
  sendMultiplayerLeave();
  isCharacterSelecting = true;
  resetInputKeys(keys);
  document.body.style.pointerEvents = "none";
  saveGameSnapshot();
  player.classList.add("is-hidden-before-spawn");
  playerName.style.display = "none";

  Object.keys(remotePlayers).forEach(function (remoteId) {
    remotePlayers[remoteId].element.remove();
    delete remotePlayers[remoteId];
  });

  const finishLogout = function () {
    localStorage.removeItem(currentUserKey);
    localStorage.removeItem(currentUserIdKey);
    localStorage.removeItem(currentSessionTokenKey);
    sessionStorage.removeItem(currentSessionKey);
    window.location.href = "/ovc-login.html?v=20260508s";
  };

  if (multiplayerChannel) {
    clearMultiplayerReconnectTimeout();
    isMultiplayerSubscribed = false;
    const channel = multiplayerChannel;
    const client =
      window.OVCOnline && typeof window.OVCOnline.getClient === "function"
        ? window.OVCOnline.getClient()
        : null;
    channel.untrack().finally(function () {
      channel.unsubscribe();
      if (client && typeof client.removeChannel === "function") {
        Promise.resolve(client.removeChannel(channel)).catch(function () {
          // Continue logout even if cleanup fails.
        });
      }
      multiplayerChannel = null;
      finishLogout();
    });
    return;
  }

  finishLogout();
}

function getFitZoom() {
  return Math.max(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
}

function gameLoop() {
  respawnApplesIfNeeded();
  refillWellIfNeeded();
  updatePlayerPosition();
  updateSeedPosition();
  updateExtraSeedsAndPlants();
  updateSeedInventory();
  updateBucketPosition();
  updatePlayerStatus();
  updateSeedCard();
  updatePlantState();
  updateNpcPosition();
  updateGuideCard();
  pruneStaleRemotePlayers();
  updatePlayerAlert();
  updateCamera();
  updatePlayerName();
  sendMultiplayerPresence(false);
  savePlayerPosition(false);
  requestAnimationFrame(gameLoop);
}

function savePlayerPosition(forceSave) {
  const now = Date.now();
  if (!forceSave && now - lastPlayerPositionSavedAt < 400) return;

  setStoredValue(
    playerPositionKey,
    JSON.stringify({
      playerX,
      playerDepth,
      savedAt: now
    })
  );
  lastPlayerPositionSavedAt = now;
}

function loadPlayerPosition() {
  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  setWorldPosition(player, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updateCamera();
  savePlayerPosition(true);
}

function setup() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const wellSize = getWellSize();

  setWorldSize(player, PLAYER_WIDTH);
  setWorldSize(playerColorBody, PLAYER_WIDTH, PLAYER_HEIGHT);
  Object.keys(remotePlayers).forEach(function (remoteId) {
    setWorldSize(remotePlayers[remoteId].element, PLAYER_WIDTH);
  });
  setWorldSize(spawnPortal, spawnPortalWidth, spawnPortalHeight);
  setWorldSize(seed, SEED_SIZE);
  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.element) setWorldSize(extraSeed.element, SEED_SIZE);
  });
  appleState.extraPlants.forEach(function (plant) {
    if (plant.spotElement) setWorldSize(plant.spotElement, PLANT_SPOT_WIDTH);
    if (plant.waterNeededElement) setWorldSize(plant.waterNeededElement, WATER_NEEDED_SIZE);
    if (plant.sproutElement) setWorldSize(plant.sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  });
  setWorldSize(bucket, BUCKET_SIZE);
  setWorldSize(well, WELL_SIZE);
  setWorldSize(plantSpot, PLANT_SPOT_WIDTH);
  setWorldSize(waterNeeded, WATER_NEEDED_SIZE);
  setWorldSize(sprout, SPROUT_WIDTH, SPROUT_HEIGHT);
  setWorldSize(bigTree, BIG_TREE_WIDTH, BIG_TREE_HEIGHT);
  setWorldSize(plantMaster, NPC_WIDTH, NPC_HEIGHT);
  setWorldSize(signBoard, SIGN_WIDTH, SIGN_HEIGHT);
  setWorldSize(guideBook, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT);
  applyGuideTexts();

  if (!isSetupComplete) {
    seedX = SEED_START_X;
    seedY = SEED_START_Y;
    wellX = WELL_START_X;
    wellY = WELL_START_Y;
    bucketX = wellX - bucketSize.width - 8;
    bucketY = wellY + wellSize.height - bucketSize.height;
    isSetupComplete = true;
  }

  initializeZoom();
  setWorldPosition(bigTree, BIG_TREE_X, BIG_TREE_Y);
  setWorldPosition(spawnPortal, spawnPortalX, spawnPortalY);
  setWorldPosition(well, wellX, wellY);
  setWorldPosition(signBoard, signX, signY);
  setWorldPosition(guideBook, guideBookX, guideBookY);
  guideBook.style.display = hasGuideBook ? "none" : "block";
  guideBookButton.style.display = "none";
  setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
  updateWellImage();
  updateSeedPosition();
  updateBucketPosition();
  updatePlantState();
}

setup();
loadWellState();
loadSeedState();
loadAppleState();
loadBucketState();
loadGuideBookState();
loadPlayerPosition();
addNetworkDebugLog(
  "init: configured=" +
  Boolean(window.OVCOnline && window.OVCOnline.isConfigured()) +
  ", user=" +
  (currentUserId || "-") +
  ", color=" +
  selectedPlayerColor
);
openCharacterSelectIfNeeded();
setInterval(function () {
  sendMultiplayerPresence(true);
}, 1000);
setInterval(function () {
  syncWorldState(false);
  pollWorldState();
}, 1000);
setInterval(validateCurrentAccount, 5000);
window.addEventListener("resize", function () {
  setup();
  zoomLevel = clampZoom(zoomLevel);
  updateCamera();
});
window.addEventListener("load", function () {
  updateCamera();
});
gameLoop();
