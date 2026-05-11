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
  createDefaultWorldLooseSeedRecord,
  isWorldLooseSpawnReady,
  isWorldLooseSyntheticPickupCandidate,
  normalizeWorldLooseSeedRecord,
  scheduleWorldLooseRespawnAfterPickup
} from "./src/game/groundSeed.js";
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
  plantActionMs,
  appleRespawnMs,
  WORLD_LOOSE_SEED_ID,
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y,
  getMinPlantCenterClearanceWorld,
  biggerSproutMs,
  sproutStage1Ms,
  sproutStage2GrowMs,
  sproutStage1Image,
  sproutStage2Image,
  sproutStage3Image,
  sproutStage4Image,
  sproutStage5Image,
  SPROUT_STAGE_WIDTHS,
  SPROUT_STAGE_HEIGHTS,
  grassStage4WorldScale,
  grassStage5WorldScale,
  grassStage5AnchorDxWorld,
  pickupDistance,
  guideInteractDistance,
  npcInteractDistance,
  wellUseDistance,
  wellPourDistance,
  plantWaterDistance,
  plantHoverPickRadiusWorld,
  maxWellWater,
  wellRefillMs,
  seedDryMs,
  plantDryMs,
  mainPlantDryAfterEmptyMs,
  mainPlantDryAfterPowderMs,
  plantDryMsDuringPowderMs,
  getPlantWaterLevelTickMsForPlant,
  getPlantDryAfterEmptyMsForPlantPhase,
  getPlantFirstGrowthDurationMs,
  plantDrySoilClearMs,
  plantRotClearMs,
  overwaterWindowMs,
  BUTTERFLY_SIZE,
  magicPowderCraftCost,
  magicPowderCraftMs,
  level4GrowMs,
  level5GrowMs,
  butterflyMaxAlive,
  butterflyColors,
  butterflyFrameCount,
  butterflyFrameMs,
  butterflySpeed,
  butterflyLegMinMs,
  butterflyLegMaxMs,
  butterflyFlutterPeriodHorizontalMs,
  butterflyFlutterPeriodVerticalMs,
  butterflyFlutterAmplitudeX,
  butterflyFlutterAmplitudeY,
  butterflyRespawnMs,
  butterflyCatchDistance,
  butterflyBroadcastMs,
  butterflyBoundsLeft,
  butterflyBoundsRight,
  butterflyBoundsTop,
  butterflyBoundsBottom,
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
  mainDrySeedHandledKey,
  mainSeedCollectedKey,
  movementTutorialCompleteKey,
  onboardingFlowStepKey,
  onboardingFlowDoneKey,
  onboardingTutorialBindSessionKey,
  everBeenToWorldKey,
  appStorageKeys,
  appStorageKeysSharedWorldReset
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
  plantCardTitle,
  plantWaterText,
  plantWaterBar,
  plantWaterSegments,
  signBoard,
  growthCard,
  growthFill,
  guideBook,
  guideBookButton,
  guideCard,
  guideCloseButton,
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
  seedWorldText,
  plantHoverLabel,
  seedInventory,
  seedCountText,
  appleInventory,
  appleCountText,
  treeAppleElements,
  inventoryApple,
  butterflyInventory,
  butterflyInventorySlots,
  butterflyInventoryTotal,
  world,
  ground,
  onboardingCallout,
  onboardingCalloutText,
  movementTutorialOverlay,
  movementTutorialLineMove,
  movementTutorialLineBook,
  movementTutorialKeys
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
  getSynchronizedNow as getSynchronizedNowCore,
  syncServerClockOffset as syncServerClockOffsetCore
} from "./src/game/timeSync.js";
import {
  readWaterLevel,
  resolveSnapshotSavedAt,
  dedupeExtraSeedsPreferInventory,
  parseMainPlantFromSnapshot,
  parseTreeAppleFromSnapshot,
  parseSharedGroundSeedFromSnapshot,
  parseExtraPlantFromSnapshot
} from "./src/game/worldSnapshot.js";
import {
  makeSyncEventId as makeSyncEventIdCore,
  getRemoteStateVersion as getRemoteStateVersionCore,
  getRemoteStateSourceRank as getRemoteStateSourceRankCore,
  isValidRemotePlayerStatePayload as isValidRemotePlayerStatePayloadCore,
  createSyncEventDedupeStore
} from "./src/multiplayer/syncCore.js";
import { createSyncDebugHelpers } from "./src/multiplayer/syncDebug.js";
import {
  shouldApplyIncomingRemoteState,
  getRemoteStatusText
} from "./src/multiplayer/presence.js";
import {
  getNumericButterflyValue as getNumericButterflyValueCore,
  simulateButterflyAuthorityStep as simulateButterflyAuthorityStepCore
} from "./src/multiplayer/butterflyMotion.js";
import {
  isWorldPointInsideRect as isWorldPointInsideRectCore,
  getPlantVisibleHoverRectsWorld as getPlantVisibleHoverRectsWorldCore
} from "./src/game/plantHover.js";
import {
  HELD_ITEM_SEED,
  HELD_ITEM_BUCKET,
  isHeldExtraSeed,
  createHeldExtraSeed,
  getHeldExtraSeedId
} from "./src/game/held-item.js";
import {
  isTutorialDocumentEntry,
  isWorldDocumentEntry
} from "./src/app/ovc-page-entry.js";
import {
  ovcTutorialReplaySessionKey,
  ovcClearPendingWorldHubMarkers,
  ovcTutorialPageUrl,
  ovcWorldIndexUrl,
  ovcHardNavigateToWorldIndex,
  ovcForceWorldHubIsRequested
} from "./src/app/ovc-world-hub.js";
import { normalizeHexColor, nameForIngameUiDisplay } from "./src/util/user-display.js";
import {
  storageKeyMainSeedPickedForRoom,
  storageKeyGuideBookPickedForRoom
} from "./src/game/room-storage-keys.js";

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
let isGuideBookClickPromptActive = false;
let movementTutorialPhase = 0;
let movementTutorialBaseline = null;
let onboardingFlowStep = 1;
let onboardingJumpLatch = false;
let onboardingFirstGuideEscHintShown = false;
let onboardingNpcGuideEscHintShown = false;
let onboardingEscHintTimerId = null;
let onboardingCongratsTimerId = null;
let onboardingTreeLeaveHintTimerId = null;
let onboardingFinalHideTimerId = null;
let onboardingButterflyCountBaseline = null;
let onboardingTutorialEnteredTree = false;
let onboardingSeedTutorialSecondLine = false;
/** 25단계: 0 = 열매 안내(2초), 1 = 씨앗 사용 안내 */
let onboardingPostAppleSeedIntroPhase = 0;
let onboardingFruitIntroTimerId = null;
/** 16단계: 0 = 축하 문구, 1 = 이어서 안내(저장 스텝은 계속 16) */
let onboardingPostWaterCongratsPhase = 0;
const ONBOARDING_MAX_STEP = 27;
/** tutorial.html: 땅의 튜토리얼 씨앗이 사라진 뒤 다시 놓기까지(ms) */
const TUTORIAL_MAIN_SEED_RESPAWN_MS = 5000;
let tutorialMainSeedRespawnTimerId = null;
/** 땅 씨 리스폰 이후에는 인벤·씨앗 온보딩 테두리 강조 생략(첫 사이클만). */
let tutorialMainSeedRegenCompleted = false;
let onboardingStep26OpenedSettingsWithEsc = false;
let tutorialWorldNeedsFullReset = false;
let heldItem = null;
let isBucketFull = false;
const plantRuntime = createPlantState();
let lastPlantProximityBlockMessage = "";
let plantProximityWarnUntil = 0;
let npcX = NPC_START_X;
let npcY = NPC_START_Y;
let isNpcDialogueRunning = false;
let isNpcDialogueComplete = false;
let isGuidePlantPageUnlocked = false;
let guidePageIndex = 0;
let npcPromptHideTimeout = null;
let hasShownFirstSeedFocus = false;
let hasHandledDryMainSeed = false;
let isMainSeedAvailable = true;
let hasPickedMainSeedThisWindow =
  sessionStorage.getItem(storageKeyMainSeedPickedForRoom()) === "true";
let lastMainSeedStateChangeAt = 0;
let dryMainSeedVisibleSince = 0;
let firstSeedFocusTimeout = null;
let isHoveringMainSeed = false;
let lastPickupToggleAt = 0;
let lastBucketPickupAt = 0;
let isInteractKeyLatched = false;
const guidePlaceholderHtml = "<p>아직 내용이 없습니다!</p>";
const guidePlantPageHtml = guidePages[1] ? guidePages[1].innerHTML : "";
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
const guideBookClickPromptDismissedKeyBase = "ovcGuideBookClickPromptDismissedV1:";
const currentSessionTokenKey = "ovcCurrentSessionTokenV1";
const currentSessionKey = "ovcCurrentSessionV1";
const loginHandoffKey = "ovcLoginHandoffV1";
const currentUserName = (getStoredValue(currentUserKey) || "").trim();
const currentUserId = (getStoredValue(currentUserIdKey) || "").trim();
const ovcTutorialDoneUserSessionKey = "ovcTutorialDoneUserSessionV1";

function setOnboardingFlowDoneStored(done) {
  setStoredFlag(onboardingFlowDoneKey, Boolean(done));
  try {
    if (done && currentUserId) {
      sessionStorage.setItem(ovcTutorialDoneUserSessionKey, String(currentUserId).trim());
    }
    if (!done) {
      sessionStorage.removeItem(ovcTutorialDoneUserSessionKey);
    }
  } catch (eHint) {}
}

function ovcApplyForceWorldHubBypassLoggedIn() {
  if (!currentUserId) return false;
  if (!ovcForceWorldHubIsRequested()) return false;
  try {
    ovcClearPendingWorldHubMarkers(currentUserId);
    sessionStorage.removeItem(ovcTutorialReplaySessionKey);
    sessionStorage.removeItem("ovcTutorialWorldResetPending");
  } catch (eClr) {}
  setOnboardingFlowDoneStored(true);
  setStoredFlag(everBeenToWorldKey, true);
  setStoredValue(onboardingFlowStepKey, "0");
  setStoredFlag(movementTutorialCompleteKey, true);
  requestAccountTutorialDoneSync({ force: true });
  return true;
}
const guideBookClickPromptDismissedKey =
  guideBookClickPromptDismissedKeyBase + (currentUserId || "guest");
let currentSessionId = "";
const currentUserScopedColorKey = currentUserId
  ? "ovcUserColorV1:" + currentUserId
  : "";
const currentUserScopedHasChosenColorKey = currentUserId
  ? "ovcUserHasChosenColorV1:" + currentUserId
  : "";
const savedUserScopedColor = normalizeHexColor(
  currentUserScopedColorKey ? localStorage.getItem(currentUserScopedColorKey) : ""
);
const hasChosenPlayerColor = currentUserId
  ? (
      localStorage.getItem(currentUserScopedHasChosenColorKey) === "true" ||
      localStorage.getItem(currentUserHasChosenColorKey) === currentUserId
    )
  : false;
const savedGlobalLoginColor = normalizeHexColor(localStorage.getItem(currentUserColorKey));
let selectedPlayerColor =
  savedUserScopedColor || savedGlobalLoginColor || "#ffffff";
if (currentUserId) {
  setStoragePrefix("ovc-user-" + currentUserId + ":");
  hasHandledDryMainSeed = getStoredFlag(mainDrySeedHandledKey);
  isMainSeedAvailable = !hasPickedMainSeedInCurrentRoom();
  lastMainSeedStateChangeAt = Date.now();
  if (ovcApplyForceWorldHubBypassLoggedIn() && isTutorialDocumentEntry()) {
    ovcHardNavigateToWorldIndex();
  }
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

function hasPickedMainSeedInCurrentRoom() {
  if (hasPickedMainSeedThisWindow) return true;
  try {
    if (sessionStorage.getItem(storageKeyMainSeedPickedForRoom()) === "true") {
      hasPickedMainSeedThisWindow = true;
      return true;
    }
  } catch (eSs) {}
  if (getStoredFlag(storageKeyMainSeedPickedForRoom())) {
    hasPickedMainSeedThisWindow = true;
    return true;
  }
  return false;
}

function setMainSeedPickedForCurrentRoom() {
  hasPickedMainSeedThisWindow = true;
  try {
    sessionStorage.setItem(storageKeyMainSeedPickedForRoom(), "true");
  } catch (eSs) {}
  setStoredFlag(storageKeyMainSeedPickedForRoom(), true);
}

function clearMainSeedPickedForCurrentRoom() {
  hasPickedMainSeedThisWindow = false;
  try {
    sessionStorage.removeItem(storageKeyMainSeedPickedForRoom());
  } catch (eRm) {}
  setStoredFlag(storageKeyMainSeedPickedForRoom(), false);
}

/** 저장된 인벤에 스타터 씨앗이 있으면 월드 메인 씨앗과 동기(리로드 후 중복 방지) */
function syncMainSeedPickedStateFromLoadedExtraSeeds() {
  var found = false;
  appleState.extraSeeds.forEach(function (s) {
    if (s.id !== "starter-seed" && !s.isStarter) return;
    if (s.inInventory || s.planted) found = true;
  });
  if (found) {
    setMainSeedPickedForCurrentRoom();
    isMainSeedAvailable = false;
    lastMainSeedStateChangeAt = Date.now();
  }
}

function hasPickedGuideBookInCurrentRoom() {
  if (getStoredFlag(storageKeyGuideBookPickedForRoom())) return true;
  if (getStoredFlag(hasGuideBookKey)) {
    setStoredFlag(storageKeyGuideBookPickedForRoom(), true);
    return true;
  }
  return false;
}

function setGuideBookPickedForCurrentRoom() {
  setStoredFlag(storageKeyGuideBookPickedForRoom(), true);
  setStoredFlag(hasGuideBookKey, true);
}

let multiplayerChannel = null;
let lastPresenceSentAt = 0;
let remotePlayers = {};
let remotePlayerCount = 0;
let multiplayerStatusText = "\uCD08\uAE30\uD654 \uC911";
let isMultiplayerSubscribed = false;
let multiplayerReconnectTimeout = null;
let multiplayerConnectAttempt = 0;
let lastSyncedPlayerColor = "";
let lastPresenceStateKey = "";
let presenceRateLimitedUntil = 0;
let lastPresenceTrackAt = 0;
let lastBroadcastAt = 0;
let lastBucketBroadcastAt = 0;
let lastHeartbeatBroadcastAt = 0;
let lastWaterSplashAt = 0;
let lastWaterSplashX = 0;
let lastWaterSplashY = 0;
const WORLD_CHAT_LOG_CAP = 80;
const WORLD_CHAT_HEAD_BUBBLE_MS = 10000;
const REMOTE_ACTION_STATUS_HOLD_MS = 1800;
const REMOTE_BUTTERFLY_CATCH_ACTION_MS = 1000;
const REMOTE_WATER_SPLASH_ACCEPT_MS = 60000;
const MAX_SNAPSHOT_CLOCK_SKEW_MS = 60000;
const SYNC_EVENT_DEDUPE_TTL_MS = 120000;
const SYNC_EVENT_DEDUPE_MAX = 4000;
const SYNC_DEBUG_TRACE = false;
const WORLD_HEART_FX_MS = 2200;
const WORLD_CHAT_MAX_CHARS = 120;
const WORLD_CHAT_NAMEPLATE_FONT_PX = 5.3;
const WORLD_CHAT_NAMEPLATE_PAD_V = 1;
const WORLD_CHAT_NAMEPLATE_PAD_H = 3;
const WORLD_CHAT_NAMEPLATE_RADIUS_PX = 3;
const WORLD_CHAT_BUBBLE_MAX_WORLD_PX = 200;
let worldChatLog = [];
let worldChatPanelOpen = false;
let localChatBubbleText = "";
let localChatBubbleHideAt = 0;
let localChatBubbleTimer = null;
const remoteChatBubbles = Object.create(null);
const remoteChatBubbleEls = Object.create(null);
let worldHeartBtn = null;
let worldChatToggleBtn = null;
let worldChatPanelEl = null;
let worldChatLogEl = null;
let worldChatInputEl = null;
let worldChatSendBtn = null;
let playerChatBubbleEl = null;
let worldSocialUiReady = false;
let worldLoosePickupLockUntil = 0;
let lastWorldLooseSeedPickupAt = 0;
let lastMainPlantStateChangeAt = 0;
let lastAppleStateChangeAt = 0;
let lastWellStateChangeAt = 0;
let lastButterflyStateChangeAt = 0;
let localApplePickedAtById = {};
/**
 * Map of butterfly id -> local DOM render entry. Holds the wrapper element,
 * the sprite child element, and the most recently applied frame index so we
 * only touch the DOM when a frame actually changes.
 */
const butterflyRenderById = {};
/**
 * Authority-only simulation state per butterfly: where it currently is, where
 * it is heading, and when the leg started/ends. Non-authority clients ignore
 * this and follow the broadcast positions instead.
 */
const butterflyAuthorityWaypointById = {};
let lastButterflyBroadcastAt = 0;
let lastLocalButterflyCatchAt = 0;
let lastLocalButterflyCatchActionAt = 0;
/**
 * Map of butterflyId -> ms timestamp of when this client caught it locally.
 * Used to suppress the butterfly from re-appearing if the authority's stale
 * pre-catch broadcast arrives after the catch was saved. Entries are pruned
 * after a few seconds, by which time the authority has reconciled.
 */
const butterflyLocalCatchTombstoneById = {};
const BUTTERFLY_LOCAL_CATCH_TOMBSTONE_MS = 8000;
let syncEventDedupeStore = null;
/** 탭 전환·백그라운드 후 복귀 시 한 프레임에 긴 시간이 건너뛰면 나비 경로가 순간이동처럼 보임 → 웨이포인트 리셋 */
let lastButterflyWallClockMs = 0;
let gameLoopCyclesForTutorialSync = 0;
const butterflyState = {
  list: [],
  // 0 means "never seeded yet"; the authority replaces it with a real time the
  // first time it spawns or refills the population.
  lastSpawnAt: 0,
  caughtCounts: { brown: 0, yellow: 0, white: 0 }
};
let hasSeededInitialButterflies = false;
const butterflyCaughtCountsKey = "butterflyCaughtCountsV1";
const magicPowderCountKey = "magicPowderCountV1";
const MAGIC_POWDER_USE_DISTANCE = Math.max(plantWaterDistance, 72);
let magicPowderCount = 0;
let isCraftingMagicPowder = false;
let magicPowderCraftTimer = null;
let ignoreSnapshotInventorySeedsUntil = 0;
let lastPresenceDbSyncAt = 0;
let lastPresenceDbPollAt = 0;
let isPresenceDbSyncing = false;
let isPresenceDbPolling = false;
let isLoggingOut = false;
let isTabSessionSuperseded = false;
let isApplyingWorldState = false;
let isWorldSyncing = false;
let isWorldPolling = false;
let isWorldDirty = false;
let lastWorldSaveAt = 0;
let lastWorldPollAt = 0;
let lastWorldUpdatedAt = "";
let localPlantActionLockUntil = 0;
let localAppleActionLockUntil = 0;
let serverClockOffsetMs = 0;
let lastServerClockSyncAt = 0;
/** Until true, do not push local world to Supabase (avoids wiping shared plants before first pull). */
let hasHydratedSharedWorldFromServer = false;
let pendingWorldResetToken = "";
let lastAppliedWorldResetToken = sessionStorage.getItem("ovcLastWorldResetTokenV1") || "";
let lastWorldResetAt = 0;
let isReloadingForWorldReset = false;
let remoteBucketUpdateAtById = {};
/**
 * Session ids recently seen in this room (DB presence + realtime broadcasts).
 * Includes same-login tabs so butterfly authority is a single elected client.
 */
let multiplayerRoomSessionIdsLastSeen = Object.create(null);
/** Dedupe water FX when we skip rendering same-account remote avatars */
let lastRemoteWaterSplashAppliedAtBySession = Object.create(null);
let lastBucketTraceAtByKey = {};
let lastBucketRenderLoggedKey = "";
let onlineDebugToastTimeout = null;
const networkDebugLines = [];
let networkDebugDomStale = false;
const playerBucketOverlay = document.createElement("div");
playerBucketOverlay.id = "player-bucket-overlay";
ground.appendChild(playerBucketOverlay);
const appLoadingScreen = document.getElementById("app-loading-screen");
const appLoadingText = document.getElementById("app-loading-text");
let appLoadingHideTimer = null;
/** 버킷 네트워크 로그 — 필요할 때만 true */
const BUCKET_DEBUG_TRACE = false;
const playerTintCache = new Map();
const playerBaseImage = new Image();
let playerBaseImageReady = false;
playerBaseImage.addEventListener("load", function () {
  playerBaseImageReady = true;
  playerTintCache.clear();
  if (hasChosenPlayerColor && selectedPlayerColor) {
    applyPlayerColor(selectedPlayerColor);
  }
});
playerBaseImage.src = "이미지/player-white.png";
if (playerBaseImage.complete && playerBaseImage.naturalWidth) {
  playerBaseImageReady = true;
}

/** World-units per frame at ~60 Hz; multiplied by frameScale so real speed is monitor-independent. */
const speed = 1;
const treeMoveSpeed = speed * 0.5;
const treeClimbSpeed = treeMoveSpeed;
const treeFallSpeed = treeMoveSpeed * 3.5;
const groundFootInset = 8;
const jumpPower = 4.5;
const gravity = 0.8;
/** Legacy tuning assumed ~60fps; scale per-frame deltas by dt * this. */
const MOVEMENT_REFERENCE_HZ = 60;
const MOVEMENT_DT_CAP_SEC = 0.05;
let lastMovementTickMs = 0;
const appleState = createAppleState([
  { id: "apple-1", x: BIG_TREE_X + 31, y: BIG_TREE_Y + 45, size: 10 },
  { id: "apple-2", x: BIG_TREE_X + 76, y: BIG_TREE_Y + 21, size: 10 },
  { id: "apple-3", x: BIG_TREE_X + 112, y: BIG_TREE_Y + 52, size: 10 },
  { id: "apple-4", x: BIG_TREE_X + 54, y: BIG_TREE_Y + 82, size: 10 },
  { id: "apple-5", x: BIG_TREE_X + 96, y: BIG_TREE_Y + 83, size: 10 }
]);
let worldLooseSeedElement = null;

/** index 월드 + 온보딩 완료: 땅 씨앗은 worldLooseSeed·seedCount 정책 (src/game/groundSeed.js 참고). */
function usesWorldLooseSeedMode() {
  return isWorldDocumentEntry() && getStoredFlag(onboardingFlowDoneKey);
}

function ensureWorldLooseSeedShape() {
  if (!appleState.worldLooseSeed || typeof appleState.worldLooseSeed !== "object") {
    appleState.worldLooseSeed = createDefaultWorldLooseSeedRecord();
    return;
  }
  normalizeWorldLooseSeedRecord(appleState.worldLooseSeed);
}

function isWorldLooseSeedVisibleAt(now) {
  if (!usesWorldLooseSeedMode()) return false;
  ensureWorldLooseSeedShape();
  return isWorldLooseSpawnReady(now, appleState.worldLooseSeed.nextSpawnAt);
}

/** 월드 느슨 씨앗 모드: 중복 id·과도한 seedCount 정리 */
function sanitizeWorldLooseModeExtraSeeds() {
  if (!usesWorldLooseSeedMode()) return false;
  let changed = false;
  const lenBeforeDedupe = appleState.extraSeeds.length;
  appleState.extraSeeds = dedupeExtraSeedsPreferInventory(appleState.extraSeeds);
  if (appleState.extraSeeds.length !== lenBeforeDedupe) {
    changed = true;
  }
  if (appleState.seedCount > 500) {
    appleState.seedCount = 500;
    changed = true;
  }
  return changed;
}

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
/** 나무 세로 허용 범위로 끌어올릴 때 프레임당 최대 변화 (순간이동 느낌 완화) */
const TREE_DEPTH_CLAMP_MAX_STEP = 4;
/**
 * 보이는 뿌리만 = style.css .big-tree-roots (left 39, w 68, h 16, bottom -2).
 * 전체 기둥 박스로 겹치면 옆 지나갈 때 몸통만 겹쳐도 나무 모드로 들어가 순간이동처럼 보임 → 발·뿌리만 검사.
 */
const TREE_CSS_ROOTS_LEFT = 39;
const TREE_CSS_ROOTS_WIDTH = 68;
const TREE_CSS_ROOTS_HEIGHT = 16;
const TREE_CSS_ROOTS_BOTTOM_EXTEND = 2;
/** 플레이어·NPC 공통: 머리 윗선과 말풍선 사이(월드 단위) */
const SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD = 4;
/**
 * NPC 발밑 y는 npcY, 논리 박스 높이는 NPC_HEIGHT.
 * 스프라이트 scale로 실제 머리가 더 위면 양수로 키움(머리 윗선을 위로 보정).
 */
const NPC_HEAD_TOP_TRIM_WORLD = 0;
/** NPC 말풍선만: 너무 떠 보이면 양수로 키워서 아래로 내림(월드 단위) */
const NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD = 12;
/** 플레이어 말풍선만: 닉네임(머리 근처) 위에 확실히 올리기(월드 단위, 클수록 말풍선 더 위) */
const PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD = 16;
const SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX = 0;

function showAppLoadingScreen(message) {
  if (!appLoadingScreen) return;
  clearTimeout(appLoadingHideTimer);
  if (appLoadingText && message) {
    appLoadingText.textContent = message;
  }
  appLoadingScreen.hidden = false;
  document.body.classList.remove("is-game-ready");
}

function hideAppLoadingScreen() {
  clearTimeout(appLoadingHideTimer);
  document.body.classList.add("is-game-ready");
  if (!appLoadingScreen) return;
  appLoadingScreen.hidden = true;
}
const MULTIPLAYER_BROADCAST_MIN_MS = 80;
const MULTIPLAYER_HEARTBEAT_MS = 500;
const MULTIPLAYER_PRESENCE_DB_SYNC_MS = 1200;
const MULTIPLAYER_PRESENCE_DB_POLL_MS = 1200;
const MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE = 150;
const MULTIPLAYER_WORLD_POLL_MIN_MS_BASE = 150;

function getActiveRemotePlayerCountForTick() {
  const now = Date.now();
  let n = 0;
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remote = remotePlayers[remoteId];
    if (!remote) return;
    if (remote.lastSeenAt && now - remote.lastSeenAt > 30000) return;
    n += 1;
  });
  return n;
}

/** 원격 인원이 많을수록 폴링·저장 간격을 약간 늘려 DB·클라이언트 부하를 줄임 */
function getMultiplayerWorldPollMinMs() {
  const c = getActiveRemotePlayerCountForTick();
  if (c >= 10) return 280;
  if (c >= 6) return 220;
  if (c >= 3) return 180;
  return MULTIPLAYER_WORLD_POLL_MIN_MS_BASE;
}

function getMultiplayerWorldSyncLoopMs() {
  const c = getActiveRemotePlayerCountForTick();
  if (c >= 10) return 280;
  if (c >= 6) return 220;
  if (c >= 3) return 180;
  return MULTIPLAYER_WORLD_SYNC_LOOP_MS_BASE;
}

function getMultiplayerPresenceDbSyncMs() {
  const c = getActiveRemotePlayerCountForTick();
  if (c >= 12) return 2400;
  if (c >= 8) return 2000;
  if (c >= 5) return 1600;
  return MULTIPLAYER_PRESENCE_DB_SYNC_MS;
}

function getMultiplayerPresenceDbPollMs() {
  const c = getActiveRemotePlayerCountForTick();
  if (c >= 12) return 2800;
  if (c >= 8) return 2400;
  if (c >= 5) return 1900;
  return MULTIPLAYER_PRESENCE_DB_POLL_MS;
}

const keys = createInputState();

/** Other browser tabs use a different session id but the same account — do not draw them as remotes. */
function isRemotePresenceSameLoggedInAccount(state) {
  if (!state || !currentUserId) return false;
  const remoteUserId = state.userId != null ? String(state.userId).trim() : "";
  const remoteSession = state.id != null ? String(state.id) : "";
  if (!remoteSession || remoteSession === String(currentSessionId)) return false;
  if (remoteUserId && remoteUserId === String(currentUserId).trim()) return true;
  if (!remoteUserId && currentUserName) {
    const remoteName = nameForIngameUiDisplay(state.name || "");
    const mine = nameForIngameUiDisplay(accountDisplayNameForUi());
    if (remoteName && mine && remoteName === mine) return true;
  }
  return false;
}

if (!currentUserName || !currentUserId) {
  window.location.replace("ovc-login.html?v=20260509a");
  throw new Error("OVC login required");
}

hideAppLoadingScreen();

const accountLeaderTokenSessionKey = "ovcMyLeaderTokenV1";

function getAccountSessionLeaderStorageKey() {
  return "ovcAccountSessionLeaderV1:" + currentUserId;
}

function claimAccountSessionTabOwnership() {
  const previousSessionId = sessionStorage.getItem(currentSessionKey) || "";
  const leaderToken = Date.now() + "-" + Math.random().toString(16).slice(2);
  const newSessionId = "session-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  sessionStorage.setItem(accountLeaderTokenSessionKey, leaderToken);
  localStorage.setItem(
    getAccountSessionLeaderStorageKey(),
    JSON.stringify({
      token: leaderToken,
      sessionId: newSessionId,
      at: Date.now()
    })
  );
  currentSessionId = newSessionId;
  sessionStorage.setItem(currentSessionKey, currentSessionId);

  if (
    previousSessionId &&
    previousSessionId !== currentSessionId &&
    window.OVCOnline &&
    typeof window.OVCOnline.removePresence === "function"
  ) {
    Promise.resolve(window.OVCOnline.removePresence(previousSessionId)).catch(function () {
      // Best effort cleanup for hard refreshes.
    });
  }
}

function onAccountSessionLeaderStorageEvent(event) {
  if (!event.key || event.storageArea !== localStorage) return;
  if (event.key !== getAccountSessionLeaderStorageKey() || !event.newValue) return;
  if (isTabSessionSuperseded) return;
  let parsed;
  try {
    parsed = JSON.parse(event.newValue);
  } catch (err) {
    return;
  }
  const myToken = sessionStorage.getItem(accountLeaderTokenSessionKey);
  if (!myToken || !parsed || !parsed.token) return;
  if (parsed.token === myToken) return;
  const incomingSession = parsed.sessionId != null ? String(parsed.sessionId) : "";
  if (
    incomingSession &&
    currentSessionId &&
    incomingSession === String(currentSessionId)
  ) {
    return;
  }
  applySupersededTabShutdown();
}

function applySupersededTabShutdown() {
  if (isTabSessionSuperseded) return;
  isTabSessionSuperseded = true;
  resetInputKeys(keys);
  clearMultiplayerReconnectTimeout();
  sendMultiplayerLeave();
  const channel = multiplayerChannel;
  multiplayerChannel = null;
  isMultiplayerSubscribed = false;
  clearMultiplayerRoomSessionTracking();
  if (channel) {
    Promise.resolve(typeof channel.untrack === "function" ? channel.untrack() : undefined)
      .catch(function () {})
      .finally(function () {
        try {
          channel.unsubscribe();
        } catch (errUnsub) {
          // ignore
        }
        const client =
          window.OVCOnline && typeof window.OVCOnline.getClient === "function"
            ? window.OVCOnline.getClient()
            : null;
        if (client && typeof client.removeChannel === "function") {
          Promise.resolve(client.removeChannel(channel)).catch(function () {});
        }
      });
  }
  document.body.style.pointerEvents = "none";
  let veil = document.getElementById("ovc-tab-superseded-veil");
  if (!veil) {
    veil = document.createElement("div");
    veil.id = "ovc-tab-superseded-veil";
    veil.setAttribute("role", "dialog");
    veil.setAttribute("aria-live", "polite");
    veil.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.92);color:#f8fafc;" +
      "display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.5 system-ui,sans-serif;text-align:center;";
    veil.innerHTML =
      "<div><p style=\"font-size:18px;margin:0 0 12px;font-weight:600\">\uB2E4\uB978 \uCC3D\uC5D0\uC11C \uAC8C\uC784\uC774 \uC5F4\uB838\uC2B5\uB2C8\uB2E4.</p>" +
      "<p style=\"margin:0;opacity:.9\">\uC774 \uD0ED\uC740 \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4. \uC774 \uD0ED\uC740 \uB2EB\uC544 \uC8FC\uC138\uC694.</p></div>";
    document.body.appendChild(veil);
  }
  hideAppLoadingScreen();
}

claimAccountSessionTabOwnership();
window.addEventListener("storage", onAccountSessionLeaderStorageEvent);

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

function accountDisplayNameForUi() {
  try {
    const fromStore = (localStorage.getItem(currentUserKey) || "").trim();
    if (fromStore) {
      return fromStore;
    }
  } catch (eStore) {}
  return (currentUserName || "").trim();
}

function groundScreenPxToWorldY(px) {
  const ch = ground.clientHeight || 1;
  return (px * GROUND_WORLD_HEIGHT) / ch;
}

/** headTopWorldY: 캐릭터 머리(윗선) 월드 y. 말풍선 transform 기준 y(버블 꼭대기) */
function speechBubbleTopWorldYFromHead(headTopWorldY, bubbleElement) {
  const bhWorld = groundScreenPxToWorldY(bubbleElement.offsetHeight || 12);
  return headTopWorldY - SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD - bhWorld;
}

function setNpcBubbleWorldPosition(worldX, worldY) {
  const px = Math.round(toScreenX(worldX));
  const py = Math.round(toScreenY(worldY));
  const n = Math.round(SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  npcBubble.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
}

function setPlayerBubbleWorldPosition(worldX, worldY) {
  const px = Math.round(toScreenX(worldX));
  const py = Math.round(toScreenY(worldY));
  const n = Math.round(SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  playerBubble.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
}

function layoutNpcSpeechBubble() {
  const bubbleWidth = npcBubble.offsetWidth || 48;
  const npcHeadTop = npcY - NPC_HEIGHT - NPC_HEAD_TOP_TRIM_WORLD;
  const bubbleWorldY =
    speechBubbleTopWorldYFromHead(npcHeadTop, npcBubble) +
    NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  setNpcBubbleWorldPosition(
    npcX + NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
}

/** 월드(index) 전용: 공유 맵만 초기화. 튜토리얼 저장값·tutorial.html 이동 없음. */
function isWorldMapDevResetShortcut(event) {
  if (event.code !== "KeyR" || event.repeat) return false;
  if (!(event.ctrlKey || event.metaKey)) return false;
  if (event.shiftKey && !event.altKey) return true;
  if (event.altKey && !event.shiftKey) return true;
  return false;
}

window.addEventListener(
  "keydown",
  function (event) {
    if (!isWorldMapDevResetShortcut(event)) return;
    if (!isWorldDocumentEntry() || !hasSpawnedCharacter || isCharacterSelecting) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    resetGameForTesting();
  },
  true
);

document.addEventListener("keydown", function (event) {
  if (isWorldMapDevResetShortcut(event)) return;

  if (
    (event.ctrlKey || event.metaKey) &&
    (event.code === "KeyC" ||
      event.code === "KeyV" ||
      event.code === "KeyX" ||
      event.code === "KeyA")
  ) {
    return;
  }

  if (isTabSessionSuperseded) {
    event.preventDefault();
    return;
  }
  const key = getControlKey(event);

  if (isCharacterSelecting) {
    event.preventDefault();
    return;
  }

  if (isWorldChatBlockingGameInput() && event.code !== "Escape") {
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
    if (isInteractKeyLatched) return;
    isInteractKeyLatched = true;
    if (plantRuntime.isPlanting) return;
    const now = Date.now();
    if (now - lastPickupToggleAt < 180) return;
    lastPickupToggleAt = now;
    // Catching is allowed even with hands full: nothing else uses E for the
    // butterfly's slot, and forcing a drop first would feel clumsy.
    if (tryCatchButterfly()) return;
    if (heldItem) {
      if (heldItem === HELD_ITEM_BUCKET && now - lastBucketPickupAt < 260) {
        return;
      }
      dropHeldItem();
      return;
    }
    if (pickApple()) return;
    if (pickUpGuideBook()) return;
    pickUpNearestItem();
  }

  if (key === "q" && !event.repeat) {
    event.preventDefault();
    if (isNearPlantMaster()) {
      if (tryTalkToPlantMaster()) return;
    }
    if (tryCatchButterfly()) return;
    useHeldItem();
  }

  if (key === "Escape") {
    if (worldChatPanelOpen && worldChatPanelEl) {
      event.preventDefault();
      worldChatPanelOpen = false;
      worldChatPanelEl.classList.remove("is-open");
      worldChatPanelEl.setAttribute("aria-hidden", "true");
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (isGuideBookOpen || guideCard.style.display === "block") {
      event.preventDefault();
      closeGuideCardFromClick();
      return;
    }
    if (controlsOverlay.classList.contains("is-open")) {
      event.preventDefault();
      controlsOverlay.classList.remove("is-open");
      controlsOverlay.setAttribute("aria-hidden", "true");
      return;
    }
    if (settingsOverlay.classList.contains("is-open")) {
      event.preventDefault();
      closeSettingsOverlayFromEscape();
      return;
    }
    if (hasSpawnedCharacter && !isCharacterSelecting) {
      event.preventDefault();
      if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 26) {
        onboardingStep26OpenedSettingsWithEsc = true;
      }
      openSettingsOverlay();
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
  if (key === "e") {
    isInteractKeyLatched = false;
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
    settlePlayerBeforeBackground();
    sendMultiplayerPresence(true);
    saveGameSnapshot();
    resetInputKeys(keys);
  }
});

window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault();

    if (isOnboardingLinearGateActive() && onboardingFlowStep < 19) {
      return;
    }

    if (isWorldChatBlockingGameInput()) {
      return;
    }

    const direction = event.deltaY > 0 ? -1 : 1;
    zoomLevel = clampZoom(zoomLevel + direction * zoomStep);
    updateCamera();
    if (!getStoredFlag(onboardingFlowDoneKey)) {
      if (onboardingFlowStep === 19) {
        onboardingFlowStep = 20;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      } else if (
        onboardingFlowStep === 20 &&
        zoomLevel <= getFitZoom() + 0.06
      ) {
        onboardingFlowStep = 21;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      }
    }
  },
  { passive: false }
);

guideBookButton.addEventListener("click", function () {
  if (isOnboardingLinearGateActive() && !onboardingAllowsGuideBookButtonToggle()) {
    flashOnboardingOrderHint("");
    return;
  }
  const wasOpen = isGuideBookOpen;
  isGuideBookOpen = !isGuideBookOpen;
  if (wasOpen) {
    dismissGuideBookClickPrompt();
  }
  updateGuideCard();
  if (wasOpen) {
    maybeAdvanceOnboardingAfterGuideBookClosed();
    updateOnboardingFlowUI();
  }
});

signBoard.addEventListener("click", function () {
  if (isOnboardingLinearGateActive()) {
    flashOnboardingOrderHint("");
    return;
  }
  isGuideDismissedAtSign = false;
  isGuideBookOpen = true;
  updateGuideCard();
});

function dismissGuideBookClickPrompt() {
  if (!isGuideBookClickPromptActive) return;
  isGuideBookClickPromptActive = false;
  setStoredFlag(guideBookClickPromptDismissedKey, true);
}

function maybeAdvanceOnboardingAfterGuideBookClosed() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (onboardingFlowStep === 3) {
    onboardingClearEscHintTimer();
    onboardingFirstGuideEscHintShown = false;
    onboardingFlowStep = 4;
    persistOnboardingStep();
  } else if (onboardingFlowStep === 10) {
    onboardingClearEscHintTimer();
    onboardingNpcGuideEscHintShown = false;
    onboardingFlowStep = 11;
    persistOnboardingStep();
  }
}

function closeGuideCardFromClick() {
  isGuideBookOpen = false;
  if (isNearSignBoard()) {
    isGuideDismissedAtSign = true;
  }
  dismissGuideBookClickPrompt();
  updateGuideCard();
  maybeAdvanceOnboardingAfterGuideBookClosed();
  updateOnboardingFlowUI();
}

guideCard.addEventListener("pointerdown", function (event) {
  if (event.target.closest("#guide-nav")) return;
  closeGuideCardFromClick();
});

guideCloseButton.addEventListener("click", function (event) {
  event.stopPropagation();
  closeGuideCardFromClick();
});

document.addEventListener("click", function (event) {
  if (guideCard.style.display !== "block") return;
  if (guideCard.contains(event.target)) return;
  if (event.target === guideBookButton) return;

  closeGuideCardFromClick();
}, true);

seed.addEventListener("mouseenter", function () {
  isHoveringMainSeed = true;
});

seed.addEventListener("mouseleave", function () {
  isHoveringMainSeed = false;
});

/* 인벤(#seed-inventory)은 ground 밖에 있어 document에서 호버 동기화 */
if (plantHoverLabel) {
  document.addEventListener("pointermove", function (e) {
    syncPlantHoverFromPointerClient(e.clientX, e.clientY);
  });
}

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
butterflyInventory.addEventListener("click", function () {
  tryCraftMagicPowder();
});
butterflyInventory.addEventListener("mousemove", function (ev) {
  if (butterflyInventory.style.display === "none") return;
  butterflyInventoryLastPointerClientX = ev.clientX;
  butterflyInventoryLastPointerClientY = ev.clientY;
  syncButterflyInventoryBarHoverTip();
});
butterflyInventory.addEventListener("mouseleave", function () {
  if (!butterflyInventory.classList.contains("is-craftable")) {
    setInstantHoverTip(butterflyInventory, null);
  }
});

characterSelectButton.addEventListener("click", function () {
  finishCharacterSelect();
});

const settingsButton = document.getElementById("settings-button");
const settingsOverlay = document.getElementById("settings-overlay");
const settingsModal = document.getElementById("settings-modal");
const changeColorButton = document.getElementById("change-color-button");
const logoutButton = document.getElementById("logout-button");
const tutorialExitButton = document.getElementById("tutorial-exit-button");
const tutorialReplayButton = document.getElementById("tutorial-replay-button");
const logoutConfirmOverlay = document.getElementById("logout-confirm-overlay");
const logoutConfirmCancel = document.getElementById("logout-confirm-cancel");
const logoutConfirmOk = document.getElementById("logout-confirm-ok");
const onlineDebugToast = document.getElementById("online-debug-toast");
const networkDebugPanel = document.getElementById("network-debug-panel");
const multiplayerStatus = document.getElementById("multiplayer-status");
updateMultiplayerStatus("\uCD08\uAE30\uD654 \uC911");
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
const networkDebugButton = document.createElement("button");
networkDebugButton.id = "network-debug-button";
networkDebugButton.type = "button";
networkDebugButton.setAttribute("aria-label", "로그");
document.body.appendChild(networkDebugButton);
const testWhiteButterflyButton = document.createElement("button");
testWhiteButterflyButton.id = "test-white-butterfly-button";
testWhiteButterflyButton.type = "button";
testWhiteButterflyButton.textContent = "";
testWhiteButterflyButton.setAttribute("aria-label", "흰나비 10마리 테스트");
testWhiteButterflyButton.setAttribute("title", "흰나비 +10 (테스트)");
document.body.appendChild(testWhiteButterflyButton);
const mainPlantGrowthMeter = createPlantGrowthMeter();
const magicPowderInventory = document.createElement("button");
magicPowderInventory.id = "magic-powder-inventory";
magicPowderInventory.type = "button";
magicPowderInventory.innerHTML =
  '<div class="magic-powder-icon"></div><div id="magic-powder-count">0</div>';
document.body.appendChild(magicPowderInventory);
const magicPowderCountText = magicPowderInventory.querySelector("#magic-powder-count");
magicPowderInventory.addEventListener("click", function () {
  tryUseMagicPowder();
});
testWhiteButterflyButton.addEventListener("click", function () {
  addWhiteButterfliesForTest();
});
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
  '<div class="controls-header"><strong>조작법</strong></div>' +
  '<div class="controls-list">' +
  '<div><span>W / \u2191</span><p>위로 이동</p></div>' +
  '<div><span>A / \u2190</span><p>왼쪽으로 이동</p></div>' +
  '<div><span>S / \u2193</span><p>아래로 이동</p></div>' +
  '<div><span>D / \u2192</span><p>오른쪽으로 이동</p></div>' +
  '<div><span>Space</span><p>점프</p></div>' +
  '<div><span>E</span><p>줍기 / 내려놓기</p></div>' +
  '<div><span>Q</span><p>사용 / 대화</p></div>' +
  '<div><span>마우스 휠</span><p>확대 / 축소</p></div>' +
  '<div><span>Esc</span><p>설정 열기 / 닫기</p></div>' +
  '</div></div>';
document.body.appendChild(controlsOverlay);
ensureWorldSocialUi();

function updateSettingsTutorialButtons() {
  if (!tutorialExitButton || !tutorialReplayButton) return;
  const done = getStoredFlag(onboardingFlowDoneKey);
  const inTutorial = Boolean(currentUserId && hasSpawnedCharacter && !done && onboardingFlowStep > 0);
  tutorialExitButton.style.display = inTutorial ? "block" : "none";
  tutorialReplayButton.style.display =
    currentUserId && hasSpawnedCharacter && done ? "block" : "none";
}

function openSettingsOverlay() {
  if (!settingsOverlay) return;
  settingsOverlay.classList.add("is-open");
  settingsOverlay.setAttribute("aria-hidden", "false");
  updateSettingsTutorialButtons();
}

function closeSettingsOverlayFromBackdrop() {
  onboardingStep26OpenedSettingsWithEsc = false;
  if (!settingsOverlay) return;
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  updateSettingsTutorialButtons();
}

function closeSettingsOverlayFromEscape() {
  const hadEscOpenCycle = onboardingStep26OpenedSettingsWithEsc;
  if (!settingsOverlay) return;
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  updateSettingsTutorialButtons();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 26 && hadEscOpenCycle) {
    onboardingFlowStep = 27;
    onboardingStep26OpenedSettingsWithEsc = false;
    persistOnboardingStep();
    updateOnboardingFlowUI();
    onboardingScheduleTutorialCompleteHide();
  } else {
    onboardingStep26OpenedSettingsWithEsc = false;
  }
}

function skipTutorialFromSettings() {
  if (!window.confirm("튜토리얼을 건너뛰고 자유롭게 플레이할까요?")) {
    return;
  }
  clearTutorialMainSeedRespawnTimer();
  try {
    sessionStorage.removeItem(ovcTutorialReplaySessionKey);
  } catch (eReplay) {}
  onboardingClearAllOnboardingTimers();
  onboardingStep26OpenedSettingsWithEsc = false;
  setOnboardingFlowDoneStored(true);
  setStoredFlag(everBeenToWorldKey, true);
  onboardingFlowStep = 0;
  setStoredValue(onboardingFlowStepKey, "0");
  persistOnboardingStep();
  completeMovementTutorial();
  setStoredFlag(hasGuideBookKey, true);
  setGuideBookPickedForCurrentRoom();
  setStoredFlag(npcDialogueCompleteKey, true);
  setStoredFlag(guidePlantPageUnlockedKey, true);
  setStoredFlag(guideBookClickPromptDismissedKey, true);
  hasGuideBook = true;
  isNpcDialogueComplete = true;
  isGuidePlantPageUnlocked = true;
  isGuideBookOpen = false;
  isGuideBookClickPromptActive = false;
  if (guideBook) guideBook.style.display = "none";
  if (guideBookButton) guideBookButton.style.display = "block";
  if (guideCard) guideCard.style.display = "none";
  updateGuidePages();
  updateGuideCard();
  updateNpcPosition();
  closeSettingsOverlayFromBackdrop();
  setOnboardingCalloutVisible(false, "");
  clearOnboardingHighlights();
  updateOnboardingFlowUI();
  try {
    sessionStorage.removeItem("ovcTutorialWorldResetPending");
  } catch (e) {}
  ovcClearPendingWorldHubMarkers(currentUserId || "");
  try {
    sessionStorage.setItem("ovcPostTutorialMultiplayerReconnectV1", "1");
  } catch (e2) {}
  const proceedSkipToWorld = function () {
    isReloadingForWorldReset = true;
    ovcHardNavigateToWorldIndex();
  };
  let skipTok = "";
  try {
    skipTok = (localStorage.getItem(currentSessionTokenKey) || "").trim();
  } catch (eSkipTok) {}
  if (currentUserId && skipTok && window.OVCOnline && typeof window.OVCOnline.saveTutorialDone === "function") {
    Promise.resolve(window.OVCOnline.saveTutorialDone(currentUserId, skipTok, true))
      .catch(function () {})
      .finally(proceedSkipToWorld);
    return;
  }
  proceedSkipToWorld();
}

function replayTutorialFromSettings() {
  if (
    !window.confirm(
      "튜토리얼을 처음부터 다시 진행할까요? 튜토리얼 화면으로 이동합니다."
    )
  ) {
    return;
  }
  let sid = "";
  try {
    sid = sessionStorage.getItem("ovcGameSessionId") || "";
  } catch (e) {}
  if (!sid) {
    sid =
      "tab-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(16).slice(2);
    try {
      sessionStorage.setItem("ovcGameSessionId", sid);
    } catch (e2) {}
  }
  try {
    sessionStorage.setItem(ovcTutorialReplaySessionKey, "1");
  } catch (eReplay) {}
  resetTutorialProgressInStorage();
  setStoredValue(onboardingTutorialBindSessionKey, sid);
  try {
    sessionStorage.setItem("ovcTutorialWorldResetPending", "1");
  } catch (e3) {}
  isReloadingForWorldReset = true;
  window.location.replace(ovcTutorialPageUrl());
}

settingsButton.addEventListener("click", function () {
  openSettingsOverlay();
});

settingsOverlay.addEventListener("click", function (event) {
  if (event.target === settingsOverlay) {
    closeSettingsOverlayFromBackdrop();
  }
});

controlsButton.addEventListener("click", function () {
  onboardingStep26OpenedSettingsWithEsc = false;
  settingsOverlay.classList.remove("is-open");
  settingsOverlay.setAttribute("aria-hidden", "true");
  controlsOverlay.classList.add("is-open");
  controlsOverlay.setAttribute("aria-hidden", "false");
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

if (tutorialExitButton) {
  tutorialExitButton.addEventListener("click", function () {
    skipTutorialFromSettings();
  });
}
if (tutorialReplayButton) {
  tutorialReplayButton.addEventListener("click", function () {
    replayTutorialFromSettings();
  });
}

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

networkDebugButton.addEventListener("dblclick", function () {
  networkDebugPanel.classList.toggle("is-visible");
  networkDebugDomStale = true;
  refreshNetworkDebugPanelDom();
});

document.addEventListener("selectionchange", function () {
  if (networkDebugDomStale) {
    refreshNetworkDebugPanelDom();
  }
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
  if (usesWorldLooseSeedMode()) {
    if (!event.target.closest("#seed-count-panel")) return;
    event.preventDefault();
    plantWorldSeedCount();
    return;
  }
  if (!event.target.closest("#seed-count-panel")) return;
  event.preventDefault();
  const firstInv = appleState.extraSeeds.find(function (extraSeed) {
    return (
      extraSeed.inInventory &&
      !extraSeed.planted &&
      extraSeed.id !== plantingInventorySeedId
    );
  });
  if (!firstInv) return;
  plantInventorySeed(firstInv.id);
});

function applyGuideTexts() {
  // Guide copy lives in index.html / tutorial.html so the sign and book keep the same wording.
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
  return (
    !hasPickedMainSeedInCurrentRoom() &&
    !plantRuntime.isSeedDry
  );
}

function clearTutorialMainSeedRespawnTimer() {
  if (tutorialMainSeedRespawnTimerId !== null) {
    window.clearTimeout(tutorialMainSeedRespawnTimerId);
    tutorialMainSeedRespawnTimerId = null;
  }
}

function scheduleTutorialMainSeedRespawnFromGround() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  clearTutorialMainSeedRespawnTimer();
  tutorialMainSeedRespawnTimerId = window.setTimeout(function () {
    tutorialMainSeedRespawnTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey)) return;
    if (plantRuntime.isSeedPlanted) return;
    tutorialRespawnMainSeedOnGround();
  }, TUTORIAL_MAIN_SEED_RESPAWN_MS);
}

function hasTutorialStarterSeedInPlay() {
  if (heldItem === HELD_ITEM_SEED) return true;
  return appleState.extraSeeds.some(function (s) {
    if (s.planted) return false;
    return s.id === "starter-seed" || s.isStarter;
  });
}

/**
 * 메인 작물 미심인데 '줍힘'만 남고 씨앗 추적이 없으면 땅 씨앗이 안 나옴 → 플래그·건조 상태 정리
 */
function recoverWorldMainSeedIfOnboardingStuck() {
  if (plantRuntime.isSeedPlanted || plantRuntime.isPlanting) return;
  if (!hasPickedMainSeedInCurrentRoom()) return;
  if (hasTutorialStarterSeedInPlay()) return;
  // 마른 메인 씨앗 자동 제거(updateSeedPosition)가 picked만 켜고 스타터를 안 남김.
  // 여기서 플래그를 지우면 씨앗이 되살아나 타이머가 영원히 끝나지 않음.
  if (hasHandledDryMainSeed) return;
  clearMainSeedPickedForCurrentRoom();
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  plantRuntime.isSeedDry = false;
  hasHandledDryMainSeed = false;
  dryMainSeedVisibleSince = 0;
  setStoredFlag(mainDrySeedHandledKey, false);
}

function tutorialRespawnMainSeedOnGround() {
  tutorialMainSeedRegenCompleted = true;
  clearMainSeedPickedForCurrentRoom();
  appleState.extraSeeds = appleState.extraSeeds.filter(function (s) {
    var isStarter = s.id === "starter-seed" || s.isStarter;
    if (!isStarter) return true;
    if (s.planted) return true;
    if (s.inInventory) return true;
    if (s.element) s.element.remove();
    if (s.inventoryElement) s.inventoryElement.remove();
    return false;
  });
  if (heldItem === HELD_ITEM_SEED) {
    heldItem = null;
  }
  plantRuntime.isSeedDry = false;
  hasHandledDryMainSeed = false;
  dryMainSeedVisibleSince = 0;
  setStoredFlag(mainDrySeedHandledKey, false);
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  updateSeedInventory();
  updateExtraSeedsAndPlants();
  updateSeedPosition();
  saveAppleState();
  markWorldDirty();
  syncWorldState(true);
}

/** Tutorial 전용: 땅 #seed → extraSeeds 스타터. 월드 허브에서는 호출되면 안 됨 (groundSeed.js). */
function createStarterSeedInventoryItem() {
  if (hasPickedMainSeedInCurrentRoom()) return null;

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
  assignExtraSeedInventoryOwner(starterSeed);
  appleState.extraSeeds.unshift(starterSeed);
  isMainSeedAvailable = false;
  lastMainSeedStateChangeAt = Date.now();
  setMainSeedPickedForCurrentRoom();
  if (plantRuntime.isSeedDry) {
    hasHandledDryMainSeed = true;
    setStoredFlag(mainDrySeedHandledKey, true);
    markWorldDirty();
    syncWorldState(true);
  }
  markWorldDirty();
  syncWorldState(true);
  saveAppleState();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 6) {
    onboardingFlowStep = 7;
    persistOnboardingStep();
  }
  scheduleTutorialMainSeedRespawnFromGround();
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

/** 손에 든 양동이 중심이 우물에 더 가까운데 플레이어 발만으로는 거리 밖으로 나가는 경우 */
function isNearWellIncludingBucketReach() {
  if (isNearWell()) return true;
  if (heldItem !== HELD_ITEM_BUCKET) return false;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const bucketBox = {
    left: bucketX,
    top: bucketY,
    width: bucketSize.width,
    height: bucketSize.height
  };
  return (
    getCenterDistanceUtil(bucketBox, wellX, wellY, wellSize.width, wellSize.height) <
    wellUseDistance + 6
  );
}

function isNearWellForPouringIncludingBucketReach() {
  if (isNearWellForPouring()) return true;
  if (heldItem !== HELD_ITEM_BUCKET) return false;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const bucketBox = {
    left: bucketX,
    top: bucketY,
    width: bucketSize.width,
    height: bucketSize.height
  };
  return (
    getCenterDistanceUtil(bucketBox, wellX, wellY, wellSize.width, wellSize.height) <
    wellPourDistance + 6
  );
}

/**
 * 양동이 사각형과 우물 사각형이 실제로 겹치는지(여유 px). 중심거리만 쓰면 손·통이 우물 안쪽으로 들어간
 * 프레임에서도 '멀다'고 나와 퍼기 실패 → 같은 프레임에 Q가 뿌리기(찬 통) 분기로 가는 문제가 생김.
 */
function isBucketOverlappingWellForInteraction(padPx) {
  if (heldItem !== HELD_ITEM_BUCKET) return false;
  const pad = Number.isFinite(Number(padPx)) ? Math.max(0, Number(padPx)) : 12;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const wellRect = {
    left: wellX - pad,
    top: wellY - pad,
    right: wellX + wellSize.width + pad,
    bottom: wellY + wellSize.height + pad
  };
  const bucketRect = {
    left: bucketX,
    top: bucketY,
    right: bucketX + bucketSize.width,
    bottom: bucketY + bucketSize.height
  };
  return isOverlappingRect(bucketRect, wellRect);
}

function isNearSignBoard() {
  if (!signBoard) {
    return false;
  }
  const signBoardStyle = window.getComputedStyle(signBoard);
  if (signBoardStyle.display === "none" || signBoardStyle.visibility === "hidden") {
    return false;
  }
  return getCenterDistance(signX, signY, SIGN_WIDTH, SIGN_HEIGHT) < guideInteractDistance;
}

function isNearGuideBook() {
  if (hasPickedGuideBookInCurrentRoom()) return false;

  return (
    getCenterDistance(
      guideBookX,
      guideBookY,
      GUIDE_BOOK_WIDTH,
      GUIDE_BOOK_HEIGHT
    ) < pickupDistance
  );
}

function shouldRunMovementTutorial() {
  return (
    isTutorialDocumentEntry() &&
    Boolean(currentUserId) &&
    hasSpawnedCharacter &&
    !isCharacterSelecting &&
    !isTabSessionSuperseded &&
    !getStoredFlag(movementTutorialCompleteKey) &&
    !hasGuideBook &&
    !(onboardingFlowStep === 1 && isNearGuideBook())
  );
}

function hideMovementTutorialOverlay() {
  if (!movementTutorialOverlay) return;
  movementTutorialOverlay.style.display = "none";
  if (movementTutorialLineBook) {
    movementTutorialLineBook.hidden = true;
    movementTutorialLineBook.textContent = "";
  }
  if (movementTutorialKeys) movementTutorialKeys.style.display = "";
  if (guideBook) guideBook.classList.remove("is-movement-tutorial-target");
}

function completeMovementTutorial() {
  setStoredFlag(movementTutorialCompleteKey, true);
  movementTutorialPhase = 0;
  movementTutorialBaseline = null;
  hideMovementTutorialOverlay();
}

function prepareMovementTutorialBeforeMove() {
  if (!shouldRunMovementTutorial()) {
    if (movementTutorialPhase !== 0) {
      movementTutorialPhase = 0;
      movementTutorialBaseline = null;
    }
    hideMovementTutorialOverlay();
    return;
  }
  if (movementTutorialPhase === 0) {
    movementTutorialPhase = 1;
    movementTutorialBaseline = {
      x: playerX,
      depth: playerDepth,
      j: jumpY
    };
  }
}

function advanceMovementTutorialAfterMove() {
  if (!shouldRunMovementTutorial()) return;
  if (movementTutorialPhase === 1 && movementTutorialBaseline) {
    const b = movementTutorialBaseline;
    if (
      Math.abs(playerX - b.x) > 2.5 ||
      Math.abs(playerDepth - b.depth) > 2.5 ||
      Math.abs(jumpY - b.j) > 4
    ) {
      movementTutorialPhase = 2;
    }
  }
  syncMovementTutorialOverlay();
}

function syncMovementTutorialOverlay() {
  if (
    !movementTutorialOverlay ||
    !movementTutorialLineMove ||
    !movementTutorialLineBook ||
    !movementTutorialKeys
  ) {
    return;
  }
  if (!shouldRunMovementTutorial() || movementTutorialPhase < 1) return;

  movementTutorialOverlay.style.display = "block";
  movementTutorialLineMove.textContent =
    "\uC774\uB3D9\uC740 \uBC29\uD5A5\uD0A4 \uB610\uB294 WSAD";
  if (movementTutorialPhase === 2) {
    movementTutorialLineBook.textContent =
      "\uD30C\uB780\uCC45\uC73C\uB85C \uC774\uB3D9\uD558\uC138\uC694!";
    movementTutorialLineBook.hidden = false;
  } else {
    movementTutorialLineBook.textContent = "";
    movementTutorialLineBook.hidden = true;
  }
  movementTutorialKeys.style.display = "flex";
  if (guideBook) {
    guideBook.classList.toggle(
      "is-movement-tutorial-target",
      movementTutorialPhase === 2
    );
  }
}

function clearOnboardingHighlights() {
  [
    guideBook,
    guideBookButton,
    guideCard,
    seed,
    plantMaster,
    player,
    well,
    bucket,
    bigTree,
    plantSpot,
    appleInventory,
    seedInventory,
    inventoryApple
  ].forEach(function (el) {
    if (el) el.classList.remove("onboarding-highlight");
  });
  treeAppleElements.forEach(function (el) {
    el.classList.remove("onboarding-highlight");
  });
  if (guideBookButton) {
    guideBookButton.classList.remove("onboarding-highlight-book-inv");
  }
  Object.keys(butterflyRenderById).forEach(function (id) {
    const entry = butterflyRenderById[id];
    if (entry && entry.element) {
      entry.element.classList.remove("onboarding-highlight");
    }
  });
}

function setOnboardingCalloutVisible(show, text) {
  if (!onboardingCallout || !onboardingCalloutText) return;
  if (show && isWorldDocumentEntry()) {
    show = false;
    text = "";
  }
  if (!show) {
    onboardingCallout.style.display = "none";
    onboardingCalloutText.textContent = "";
    return;
  }
  onboardingCallout.style.display = "block";
  onboardingCalloutText.textContent = text || "";
}

function persistOnboardingStep() {
  setStoredValue(onboardingFlowStepKey, String(onboardingFlowStep));
}

let lastAccountTutorialDoneRequestAt = 0;

/** 시크릿 창 등 로컬스토리지가 비어도 서버에 tutorial_done이 있으면 index로 보내기 위해 계정에 동기화 */
function requestAccountTutorialDoneSync(options) {
  const force = Boolean(options && options.force);
  if (!getStoredFlag(onboardingFlowDoneKey) || !currentUserId) {
    return;
  }
  try {
    if (!force && sessionStorage.getItem("ovcAccountTutorialDoneSyncedV1") === "1") {
      return;
    }
  } catch (eSkip) {}
  let token = "";
  try {
    token = (localStorage.getItem(currentSessionTokenKey) || "").trim();
  } catch (eTok) {}
  if (!token || !window.OVCOnline || typeof window.OVCOnline.saveTutorialDone !== "function") {
    return;
  }
  const now = Date.now();
  if (!force && now - lastAccountTutorialDoneRequestAt < 5000) {
    return;
  }
  lastAccountTutorialDoneRequestAt = now;
  Promise.resolve(window.OVCOnline.saveTutorialDone(currentUserId, token, true))
    .then(function (result) {
      if (result && result.ok !== false) {
        try {
          sessionStorage.setItem("ovcAccountTutorialDoneSyncedV1", "1");
        } catch (eOk) {}
      }
    })
    .catch(function () {});
}

/**
 * 튜토리얼을 한 번이라도 끝낸 계정은 로컬에 완료 상태가 남아야 한다(리로드·탭 종료·로그아웃/로그인 후에도 월드).
 * done 플래그만 유실된 경우 저장 스텝으로 복구한다.
 * - "0": 정상 완료/건너뛰기 후 저장값
 * - 27(ONBOARDING_MAX_STEP): 축하 단계 직후·7초 타이머가 done을 쓰기 전에 리로드된 경우
 */
function repairOnboardingCompletionFromStoredStep() {
  if (!currentUserId) return;
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  var stepStr = String(getStoredValue(onboardingFlowStepKey) || "");
  if (stepStr === "0") {
    setOnboardingFlowDoneStored(true);
    requestAccountTutorialDoneSync({ force: true });
    return;
  }
  var stepNum = parseInt(stepStr, 10);
  if (
    Number.isFinite(stepNum) &&
    stepNum >= ONBOARDING_MAX_STEP - 1
  ) {
    setOnboardingFlowDoneStored(true);
    setStoredValue(onboardingFlowStepKey, "0");
    requestAccountTutorialDoneSync({ force: true });
  }
}

/**
 * 한 번이라도 월드에 온 계정: 「튜토리얼 하기」 세션이 아니면 튜토리얼 미완료 상태를
 * 본게임으로 되돌린다(리로드·로그아웃/로그인·탭 전환 후에도 월드).
 */
function restoreWorldHubIfVeteranWithoutActiveReplay() {
  if (!currentUserId) return;
  if (getStoredFlag(onboardingFlowDoneKey)) {
    try {
      sessionStorage.removeItem(ovcTutorialReplaySessionKey);
    } catch (eClrReplay) {}
    setStoredFlag(everBeenToWorldKey, true);
    return;
  }
  var replay = "";
  try {
    replay = sessionStorage.getItem(ovcTutorialReplaySessionKey) || "";
  } catch (e) {}
  if (replay === "1") return;
  if (!getStoredFlag(everBeenToWorldKey)) return;
  setOnboardingFlowDoneStored(true);
  setStoredValue(onboardingFlowStepKey, "0");
  requestAccountTutorialDoneSync({ force: true });
}

function resetTutorialProgressInStorage() {
  clearTutorialMainSeedRespawnTimer();
  setOnboardingFlowDoneStored(false);
  setStoredValue(onboardingFlowStepKey, "1");
  removeStoredValue(movementTutorialCompleteKey);
  setStoredFlag(hasGuideBookKey, false);
  removeStoredValue(storageKeyGuideBookPickedForRoom());
  setStoredFlag(npcDialogueCompleteKey, false);
  setStoredFlag(guidePlantPageUnlockedKey, false);
  setStoredFlag(guideBookClickPromptDismissedKey, false);
  clearMainSeedPickedForCurrentRoom();
  tutorialWorldNeedsFullReset = true;
}

function isSharedWorldSyncPausedForTutorial() {
  if (isWorldDocumentEntry()) return false;
  return !getStoredFlag(onboardingFlowDoneKey);
}

/** index 월드 + 온보딩 완료 + 서버 동기화: 메인 슬롯이 이미 있으면 들고 심기는 extraPlants로만 추가 */
function isSharedWorldMultiPlantMode() {
  if (!isWorldDocumentEntry()) return false;
  if (!getStoredFlag(onboardingFlowDoneKey)) return false;
  return isWorldServerSyncAvailable();
}

function teardownMultiplayerForTutorial() {
  clearMultiplayerReconnectTimeout();
  Object.keys(remotePlayers).forEach(function (remoteId) {
    removeRemotePlayer(remoteId);
  });
  updateRemotePlayerCount();
  if (!multiplayerChannel) {
    return;
  }
  isMultiplayerSubscribed = false;
  const channel = multiplayerChannel;
  multiplayerChannel = null;
  clearMultiplayerRoomSessionTracking();
  channel.untrack().finally(function () {
    channel.unsubscribe();
    const client =
      window.OVCOnline && typeof window.OVCOnline.getClient === "function"
        ? window.OVCOnline.getClient()
        : null;
    if (client && typeof client.removeChannel === "function") {
      Promise.resolve(client.removeChannel(channel)).catch(function () {});
    }
  });
}

function applyTutorialWorldResetIfPending() {
  let pendingWorld = tutorialWorldNeedsFullReset;
  try {
    if (sessionStorage.getItem("ovcTutorialWorldResetPending") === "1") {
      pendingWorld = true;
    }
  } catch (e) {}
  if (getStoredFlag(onboardingFlowDoneKey)) {
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (eClear) {}
    return false;
  }
  if (!pendingWorld) {
    return false;
  }
  tutorialWorldNeedsFullReset = false;
  try {
    sessionStorage.removeItem("ovcTutorialWorldResetPending");
  } catch (e2) {}
  applyDefaultState();
  loadGuideBookState(true);
  setWorldPosition(player, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updateCamera();
  savePlayerPosition(true);
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
  updatePlantState();
  updateOnboardingFlowUI();
  hasHydratedSharedWorldFromServer = true;
  return true;
}

function maybeResetTutorialForNewLoginSession() {
  if (!currentUserId) return;
  let sid = "";
  try {
    sid = sessionStorage.getItem("ovcGameSessionId") || "";
  } catch (e) {}
  if (!sid) {
    sid =
      "tab-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(16).slice(2);
    try {
      sessionStorage.setItem("ovcGameSessionId", sid);
    } catch (e2) {}
  }
  if (getStoredFlag(onboardingFlowDoneKey)) {
    setStoredValue(onboardingTutorialBindSessionKey, sid);
    return;
  }
  setStoredValue(onboardingTutorialBindSessionKey, sid);
}

function onboardingClearEscHintTimer() {
  if (onboardingEscHintTimerId) {
    window.clearTimeout(onboardingEscHintTimerId);
    onboardingEscHintTimerId = null;
  }
}

function onboardingClearAllOnboardingTimers() {
  onboardingClearEscHintTimer();
  if (onboardingCongratsTimerId) {
    window.clearTimeout(onboardingCongratsTimerId);
    onboardingCongratsTimerId = null;
  }
  if (onboardingTreeLeaveHintTimerId) {
    window.clearTimeout(onboardingTreeLeaveHintTimerId);
    onboardingTreeLeaveHintTimerId = null;
  }
  if (onboardingFinalHideTimerId) {
    window.clearTimeout(onboardingFinalHideTimerId);
    onboardingFinalHideTimerId = null;
  }
  if (onboardingFruitIntroTimerId) {
    window.clearTimeout(onboardingFruitIntroTimerId);
    onboardingFruitIntroTimerId = null;
  }
}

function scheduleOnboardingGuideEscHintLine(expectedStep, applyFlag) {
  onboardingClearEscHintTimer();
  onboardingEscHintTimerId = window.setTimeout(function () {
    onboardingEscHintTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== expectedStep) return;
    applyFlag();
    updateOnboardingFlowUI();
  }, 2000);
}

function scheduleOnboardingFirstGuideEscHint() {
  scheduleOnboardingGuideEscHintLine(3, function () {
    onboardingFirstGuideEscHintShown = true;
  });
}

function scheduleOnboardingNpcGuideEscHint() {
  scheduleOnboardingGuideEscHintLine(10, function () {
    onboardingNpcGuideEscHintShown = true;
  });
}

function onboardingScheduleTutorialCompleteHide() {
  if (onboardingFinalHideTimerId) {
    window.clearTimeout(onboardingFinalHideTimerId);
  }
  onboardingFinalHideTimerId = window.setTimeout(function () {
    onboardingFinalHideTimerId = null;
    setOnboardingCalloutVisible(false, "");
    clearOnboardingHighlights();
    setOnboardingFlowDoneStored(true);
    setStoredFlag(everBeenToWorldKey, true);
    onboardingFlowStep = 0;
    setStoredValue(onboardingFlowStepKey, "0");
    tutorialWorldNeedsFullReset = false;
    try {
      sessionStorage.removeItem(ovcTutorialReplaySessionKey);
    } catch (eRep) {}
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (e) {}
    try {
      sessionStorage.setItem("ovcPostTutorialMultiplayerReconnectV1", "1");
    } catch (e2) {}
    const proceedFinalToWorld = function () {
      isReloadingForWorldReset = true;
      window.location.replace(ovcWorldIndexUrl());
    };
    let finalTok = "";
    try {
      finalTok = (localStorage.getItem(currentSessionTokenKey) || "").trim();
    } catch (eFinalTok) {}
    if (currentUserId && finalTok && window.OVCOnline && typeof window.OVCOnline.saveTutorialDone === "function") {
      Promise.resolve(window.OVCOnline.saveTutorialDone(currentUserId, finalTok, true))
        .catch(function () {})
        .finally(proceedFinalToWorld);
      return;
    }
    proceedFinalToWorld();
  }, 7000);
}

function isPlayerNearTutorialTreeArea() {
  const cx = BIG_TREE_X + BIG_TREE_WIDTH / 2;
  const cy = BIG_TREE_Y + BIG_TREE_HEIGHT / 2;
  const px = playerX + PLAYER_WIDTH / 2;
  const py = getPlayerFootY() - (player.offsetHeight || PLAYER_HEIGHT) / 2;
  return Math.hypot(px - cx, py - cy) < 100;
}

function isNearAnyUnpickedAppleTutorial() {
  return appleState.apples.some(function (apple) {
    if (appleState.pickedIds.includes(apple.id)) return false;
    return (
      getCenterDistance(apple.x, apple.y, apple.size, apple.size) < 36
    );
  });
}

function highlightUnpickedApplesForTutorial() {
  const visibleById = {};
  appleState.apples.forEach(function (apple) {
    if (!appleState.pickedIds.includes(apple.id)) {
      visibleById[apple.id] = true;
    }
  });
  treeAppleElements.forEach(function (el) {
    const id = el.dataset.appleId;
    if (id && visibleById[id]) {
      el.classList.add("onboarding-highlight");
    }
  });
}

function isMainGameTutorialInProgress() {
  if (isWorldDocumentEntry()) return false;
  return !getStoredFlag(onboardingFlowDoneKey);
}

function isOnboardingLinearGateActive() {
  return (
    isMainGameTutorialInProgress() &&
    hasSpawnedCharacter &&
    !isCharacterSelecting &&
    !isTabSessionSuperseded
  );
}

function flashOnboardingOrderHint(message) {
  flashPlantProximityWarning(message || "\uC21C\uC11C\uB300\uB85C \uC9C4\uD589\uD574 \uC8FC\uC138\uC694.");
  updatePlayerStatus();
}

function onboardingAllowsBucketQUse() {
  // 13: 우물에서 긷기, 14~15: 메인 작물에 붓기, 16+: 나비·설정 등 이후에도 일반 물주기 가능.
  // 예전에는 13·15만 허용해 14에서 붓기/16 이후 Q가 무반응처럼 보이는 문제가 있었음.
  return onboardingFlowStep >= 13;
}

function onboardingAllowsGuideBookButtonToggle() {
  const s = onboardingFlowStep;
  return s === 2 || s === 3 || s === 10 || s >= 16;
}

function syncOnboardingFlowProgressFromWorld() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  let changed = false;
  if (hasGuideBook && onboardingFlowStep < 2) {
    onboardingFlowStep = 2;
    changed = true;
  }
  // Only catch up seed/plant/NPC steps if the player is already in that branch of the
  // tutorial. Otherwise a shared-world snapshot (another player's planted main spot)
  // would jump fresh onboarding straight to "find the plant master" or later.
  if (
    hasPickedMainSeedInCurrentRoom() &&
    onboardingFlowStep < 7 &&
    onboardingFlowStep >= 5
  ) {
    onboardingFlowStep = 7;
    changed = true;
  }
  if (
    plantRuntime.isSeedPlanted &&
    onboardingFlowStep < 8 &&
    onboardingFlowStep >= 7
  ) {
    onboardingFlowStep = 8;
    changed = true;
  }
  if (
    isNpcDialogueComplete &&
    plantRuntime.isSeedPlanted &&
    onboardingFlowStep < 10 &&
    onboardingFlowStep >= 8
  ) {
    onboardingFlowStep = 10;
    changed = true;
  }
  if (changed) {
    persistOnboardingStep();
  }
}

function loadOnboardingFlowState() {
  onboardingJumpLatch = false;
  onboardingFirstGuideEscHintShown = false;
  onboardingNpcGuideEscHintShown = false;
  onboardingPostAppleSeedIntroPhase = 0;
  onboardingPostWaterCongratsPhase = 0;
  onboardingButterflyCountBaseline = null;
  onboardingTutorialEnteredTree = false;
  onboardingClearAllOnboardingTimers();
  if (getStoredFlag(onboardingFlowDoneKey)) {
    onboardingFlowStep = 0;
    return;
  }
  const raw = parseInt(String(getStoredValue(onboardingFlowStepKey) || "1"), 10);
  if (raw === 0) {
    setOnboardingFlowDoneStored(true);
    onboardingFlowStep = 0;
    requestAccountTutorialDoneSync({ force: true });
    return;
  }
  if (raw === ONBOARDING_MAX_STEP) {
    setOnboardingFlowDoneStored(true);
    setStoredValue(onboardingFlowStepKey, "0");
    onboardingFlowStep = 0;
    requestAccountTutorialDoneSync({ force: true });
    return;
  }
  onboardingFlowStep =
    Number.isFinite(raw) && raw >= 1 && raw <= ONBOARDING_MAX_STEP ? raw : 1;
  syncOnboardingFlowProgressFromWorld();
  if (onboardingFlowStep === 25) {
    onboardingPostAppleSeedIntroPhase = 1;
  }
  if (
    onboardingFlowStep === 3 &&
    guideCard &&
    guideCard.style.display === "block" &&
    !onboardingFirstGuideEscHintShown
  ) {
    scheduleOnboardingFirstGuideEscHint();
  }
  if (
    onboardingFlowStep === 10 &&
    guideCard &&
    guideCard.style.display === "block" &&
    !onboardingNpcGuideEscHintShown
  ) {
    scheduleOnboardingNpcGuideEscHint();
  }
}

function onboardingNotifyMainPlantPlanted() {
  clearTutorialMainSeedRespawnTimer();
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (onboardingFlowStep === 7) {
    onboardingFlowStep = 8;
    persistOnboardingStep();
  }
}

function onboardingAutoAdvanceSteps() {
  if (getStoredFlag(onboardingFlowDoneKey) || !hasSpawnedCharacter) return;

  if (onboardingFlowStep === 5 && isNearSeed()) {
    onboardingFlowStep = 6;
    persistOnboardingStep();
  }
  if (
    onboardingFlowStep === 20 &&
    zoomLevel <= getFitZoom() + 0.06
  ) {
    onboardingFlowStep = 21;
    persistOnboardingStep();
  }
  if (onboardingFlowStep === 8 && isNearPlantMaster()) {
    onboardingFlowStep = 9;
    persistOnboardingStep();
  }
  if (onboardingFlowStep === 11 && (isNearWell() || isNearBucket())) {
    onboardingFlowStep = 12;
    persistOnboardingStep();
  }
  if (
    onboardingFlowStep === 14 &&
    heldItem === HELD_ITEM_BUCKET &&
    isBucketFull &&
    getNearestWateringTarget() &&
    getNearestWateringTarget().type === "main"
  ) {
    onboardingFlowStep = 15;
    persistOnboardingStep();
  }
  if (onboardingFlowStep === 21 && isPlayerNearTutorialTreeArea()) {
    onboardingFlowStep = 22;
    persistOnboardingStep();
  }
  if (onboardingFlowStep === 22 && isPlayerInTreeSpace()) {
    onboardingTutorialEnteredTree = true;
  }
  if (
    onboardingFlowStep === 22 &&
    isPlayerInTreeSpace() &&
    isNearAnyUnpickedAppleTutorial()
  ) {
    onboardingFlowStep = 23;
    persistOnboardingStep();
  }
  if (
    onboardingFlowStep === 25 &&
    onboardingTutorialEnteredTree &&
    onboardingSeedTutorialSecondLine &&
    !isPlayerInTreeSpace()
  ) {
    onboardingFlowStep = 26;
    onboardingStep26OpenedSettingsWithEsc = false;
    persistOnboardingStep();
  }
}

function updateOnboardingFlowUI() {
  if (!onboardingCallout || !onboardingCalloutText) {
    updateSettingsTutorialButtons();
    return;
  }
  if (!hasSpawnedCharacter || isCharacterSelecting || isTabSessionSuperseded) {
    setOnboardingCalloutVisible(false, "");
    clearOnboardingHighlights();
    updateSettingsTutorialButtons();
    return;
  }
  if (isWorldDocumentEntry()) {
    setOnboardingCalloutVisible(false, "");
    clearOnboardingHighlights();
    hideMovementTutorialOverlay();
    updateSettingsTutorialButtons();
    return;
  }
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep <= 0) {
    setOnboardingCalloutVisible(false, "");
    clearOnboardingHighlights();
    updateSettingsTutorialButtons();
    return;
  }

  onboardingAutoAdvanceSteps();

  clearOnboardingHighlights();

  const guideOpen = guideCard && guideCard.style.display === "block";

  if (onboardingFlowStep === 3 && guideOpen && !onboardingEscHintTimerId && !onboardingFirstGuideEscHintShown) {
    scheduleOnboardingFirstGuideEscHint();
  }
  if (onboardingFlowStep === 10 && guideOpen && !onboardingEscHintTimerId && !onboardingNpcGuideEscHintShown) {
    scheduleOnboardingNpcGuideEscHint();
  }

  switch (onboardingFlowStep) {
    case 1: {
      if (isNearGuideBook() && !hasGuideBook) {
        hideMovementTutorialOverlay();
        setOnboardingCalloutVisible(true, "E키를 눌러 책을 소지하세요.");
        if (guideBook) guideBook.classList.add("onboarding-highlight");
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 2: {
      setOnboardingCalloutVisible(true, "왼쪽 아래 책을 눌러보세요.");
      if (guideBookButton) {
        guideBookButton.classList.add("onboarding-highlight");
        guideBookButton.classList.add("onboarding-highlight-book-inv");
      }
      break;
    }
    case 3: {
      if (guideOpen) {
        const line1 = "게임과 관련된 설명을 볼 수 있습니다.";
        const line2 = "esc 또는 아무곳이나 클릭해 설명창을 닫으세요.";
        setOnboardingCalloutVisible(
          true,
          onboardingFirstGuideEscHintShown ? line2 + "\n\n" + line1 : line1
        );
        if (guideBookButton) guideBookButton.classList.add("onboarding-highlight");
        if (onboardingFirstGuideEscHintShown && guideCard) {
          guideCard.classList.add("onboarding-highlight");
        }
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 4: {
      setOnboardingCalloutVisible(
        true,
        "space바를 누르면 점프를 합니다. 해보세요!"
      );
      if (player) player.classList.add("onboarding-highlight");
      break;
    }
    case 5: {
      setOnboardingCalloutVisible(true, "씨앗으로 이동하세요.");
      if (seed) seed.classList.add("onboarding-highlight");
      break;
    }
    case 6: {
      setOnboardingCalloutVisible(true, "e키를 눌러 씨앗을 소지하세요.");
      if (seed) seed.classList.add("onboarding-highlight");
      break;
    }
    case 7: {
      setOnboardingCalloutVisible(
        true,
        "\uC2EC\uC744 \uC704\uCE58\uB85C \uC774\uB3D9\uD6C4, \uCC45 \uC704\uC5D0 \uC528\uC557\uC744 \uD074\uB9AD\uD574 \uC2EC\uC73C\uC138\uC694."
      );
      if (player) player.classList.add("onboarding-highlight");
      if (seedInventory && !tutorialMainSeedRegenCompleted) {
        seedInventory.classList.add("onboarding-highlight");
      }
      break;
    }
    case 8: {
      setOnboardingCalloutVisible(true, "식물의 달인을 찾아가세요.");
      if (plantMaster) plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case 9: {
      if (isNpcDialogueRunning) {
        setOnboardingCalloutVisible(false, "");
        if (plantMaster) plantMaster.classList.add("onboarding-highlight");
        break;
      }
      setOnboardingCalloutVisible(true, "q를 눌러 식물의 달인과 대화하세요.");
      if (plantMaster) plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case 10: {
      if (guideOpen) {
        const line1 = "설명을 참고하세요.";
        const line2 = "esc 또는 아무곳이나 클릭해 설명창을 닫으세요.";
        setOnboardingCalloutVisible(
          true,
          onboardingNpcGuideEscHintShown ? line2 + "\n\n" + line1 : line1
        );
        if (guideBookButton) guideBookButton.classList.add("onboarding-highlight");
        if (onboardingNpcGuideEscHintShown && guideCard) {
          guideCard.classList.add("onboarding-highlight");
        }
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 11: {
      setOnboardingCalloutVisible(true, "우물근처에 양동이로 이동하세요.");
      if (well) well.classList.add("onboarding-highlight");
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 12: {
      setOnboardingCalloutVisible(
        true,
        "양동이 근처로 가서 E키를 눌러 양동이를 들어 주세요."
      );
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 13: {
      setOnboardingCalloutVisible(
        true,
        "우물로 이동한 뒤 Q키를 눌러 물을 길어 주세요."
      );
      if (well) well.classList.add("onboarding-highlight");
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 14: {
      setOnboardingCalloutVisible(true, "그대로 아까 심은 씨앗으로 가세요.");
      if (plantSpot) plantSpot.classList.add("onboarding-highlight");
      break;
    }
    case 15: {
      setOnboardingCalloutVisible(true, "Q키를 눌러 물을 뿌리세요.");
      if (plantSpot) plantSpot.classList.add("onboarding-highlight");
      break;
    }
    case 16: {
      setOnboardingCalloutVisible(
        true,
        onboardingPostWaterCongratsPhase === 0
          ? "축하합니다! 식물 키우는 법을 배우셨습니다."
          : "아직 남았습니다 끝까지 진행해주세요."
      );
      break;
    }
    case 17: {
      setOnboardingCalloutVisible(true, "E키를 눌러 양동이를 내려놓으세요.");
      if (bucket) bucket.classList.add("onboarding-highlight");
      if (player) player.classList.add("onboarding-highlight");
      break;
    }
    case 18: {
      setOnboardingCalloutVisible(
        true,
        "날아다니는 나비에 근접하여 e,q로 잡으세요"
      );
      Object.keys(butterflyRenderById).forEach(function (id) {
        const entry = butterflyRenderById[id];
        if (entry && entry.element) {
          entry.element.classList.add("onboarding-highlight");
        }
      });
      break;
    }
    case 19: {
      setOnboardingCalloutVisible(true, "스크롤해 맵을 축소,확대 해보세요.");
      break;
    }
    case 20: {
      setOnboardingCalloutVisible(true, "가장 작게 축소 해보세요.");
      break;
    }
    case 21: {
      setOnboardingCalloutVisible(true, "정중앙 위 나무로 이동하세요.");
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      break;
    }
    case 22: {
      setOnboardingCalloutVisible(
        true,
        "나무를 이동하여 올라타고 열매들 근처로 이동하세요."
      );
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case 23: {
      setOnboardingCalloutVisible(true, "e키를 눌러 열매를 따세요.");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case 24: {
      setOnboardingCalloutVisible(true, "왼쪽 아래 열매를 클릭해 먹으세요.");
      if (appleInventory) appleInventory.classList.add("onboarding-highlight");
      if (inventoryApple) inventoryApple.classList.add("onboarding-highlight");
      break;
    }
    case 25: {
      const lineSeed = "씨앗이 생겼으니 원하는 곳에 클릭해 사용하세요.";
      const lineB = "나무밖으로 이동하세요.";
      if (onboardingPostAppleSeedIntroPhase === 0) {
        setOnboardingCalloutVisible(true, "씨앗을 얻었습니다.");
      } else {
        setOnboardingCalloutVisible(
          true,
          onboardingSeedTutorialSecondLine ? lineSeed + "\n\n" + lineB : lineSeed
        );
      }
      if (seedInventory) seedInventory.classList.add("onboarding-highlight");
      break;
    }
    case 26: {
      setOnboardingCalloutVisible(
        true,
        "Esc를 눌러 설정을 연 뒤, 다시 Esc로 닫아 보세요."
      );
      break;
    }
    case 27: {
      setOnboardingCalloutVisible(true, "축하합니다! 튜토리얼이 끝났습니다!!");
      break;
    }
    default:
      setOnboardingCalloutVisible(false, "");
  }
  updateSettingsTutorialButtons();
}

function onboardingCheckJumpFinish() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 4) return;
  if (jumpY < -0.12) {
    onboardingJumpLatch = true;
  }
  if (onboardingJumpLatch && isOnGround && jumpY >= 0) {
    onboardingJumpLatch = false;
    onboardingFlowStep = 5;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
}

function onboardingHookWateredMainPlantFromTutorial() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 15) return;
  onboardingFlowStep = 16;
  onboardingPostWaterCongratsPhase = 0;
  persistOnboardingStep();
  if (onboardingCongratsTimerId) {
    window.clearTimeout(onboardingCongratsTimerId);
  }
  onboardingCongratsTimerId = window.setTimeout(function () {
    onboardingCongratsTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 16) return;
    onboardingPostWaterCongratsPhase = 1;
    updateOnboardingFlowUI();
    onboardingCongratsTimerId = window.setTimeout(function () {
      onboardingCongratsTimerId = null;
      if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 16) return;
      onboardingPostWaterCongratsPhase = 0;
      onboardingFlowStep = 17;
      persistOnboardingStep();
      updateOnboardingFlowUI();
    }, 2000);
  }, 1500);
  updateOnboardingFlowUI();
}

function onboardingHookFilledBucketAtWell() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 13) return;
  onboardingFlowStep = 14;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function onboardingHookDroppedBucketForTutorial() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 17) return;
  onboardingFlowStep = 18;
  onboardingButterflyCountBaseline = getTotalCaughtButterflies();
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function pickUpGuideBook() {
  if (isOnboardingLinearGateActive()) {
    if (hasGuideBook) return false;
    if (onboardingFlowStep !== 1 && onboardingFlowStep !== 2) return false;
  }
  if (!isNearGuideBook()) return false;

  hasGuideBook = true;
  isGuideBookOpen = false;
  setGuideBookPickedForCurrentRoom();
  guideBook.style.display = "none";
  guideBookButton.style.display = "block";
  updateGuideCard();
  completeMovementTutorial();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 1) {
    onboardingFlowStep = 2;
    persistOnboardingStep();
  }
  return true;
}

function loadGuideBookState(skipMaybeResetTutorial) {
  if (currentUserId && !skipMaybeResetTutorial) {
    maybeResetTutorialForNewLoginSession();
  }
  hasGuideBook = hasPickedGuideBookInCurrentRoom();
  if (hasGuideBook) {
    setStoredFlag(movementTutorialCompleteKey, true);
    movementTutorialPhase = 0;
    movementTutorialBaseline = null;
    hideMovementTutorialOverlay();
  }
  isNpcDialogueComplete = getStoredFlag(npcDialogueCompleteKey);
  isGuidePlantPageUnlocked = getStoredFlag(guidePlantPageUnlockedKey);
  const promptDismissed = getStoredFlag(guideBookClickPromptDismissedKey);
  isGuideBookClickPromptActive =
    hasGuideBook && isGuidePlantPageUnlocked && !promptDismissed;
  guideBook.style.display = hasGuideBook ? "none" : "block";
  guideBookButton.style.display = hasGuideBook ? "block" : "none";
  updateGuidePages();
  updateGuideCard();
  updateNpcPosition();
  loadOnboardingFlowState();
}

function resetGameForTesting() {
  showAppLoadingScreen("Resetting...");
  isReloadingForWorldReset = true;
  isWorldDirty = false;
  isWorldPolling = false;
  clearStoredKeys(appStorageKeysSharedWorldReset);
  clearMainSeedPickedForCurrentRoom();
  ignoreSnapshotInventorySeedsUntil = Date.now() + 15000;
  pendingWorldResetToken = "reset-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  lastAppliedWorldResetToken = pendingWorldResetToken;
  lastWorldResetAt = Date.now();
  sessionStorage.setItem("ovcLastWorldResetTokenV1", lastAppliedWorldResetToken);
  applyDefaultState({ sharedWorldResetOnly: true });
  persistDefaultStateAfterReset();
  restartPlayerPositionOnly();
  saveSharedWorldAndReload({ reloadUrl: ovcWorldIndexUrl() });
}

function persistDefaultStateAfterReset() {
  savePlayerPosition(true);
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
}

function saveGameSnapshot() {
  if (isReloadingForWorldReset) return;
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

function settlePlayerBeforeBackground() {
  const groundMaxDepth = getMaxGroundedPlayerDepth();
  if (playerDepth > groundMaxDepth && !isPlayerSupportedByTree()) {
    playerDepth = groundMaxDepth;
    jumpY = 0;
    velocityY = 0;
    isOnGround = true;
    isTreeFalling = false;
    wasPlayerInTree = false;
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
  }
}

function applyDefaultState(options) {
  clearTutorialMainSeedRespawnTimer();
  tutorialMainSeedRegenCompleted = false;
  const sharedWorldResetOnly =
    Boolean(options && options.sharedWorldResetOnly);
  if (sharedWorldResetOnly) {
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (ePending) {}
  }
  resetInputKeys(keys);

  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  wasPlayerInTree = false;
  npcX = NPC_START_X;
  npcY = NPC_START_Y;

  seedX = SEED_START_X;
  seedY = SEED_START_Y;
  signX = SIGN_START_X;
  signY = SIGN_START_Y;
  guideBookX = GUIDE_BOOK_START_X;
  guideBookY = GUIDE_BOOK_START_Y;
  plantRuntime.seedCreatedAt = Date.now();
  setStoredValue(seedCreatedAtKey, String(plantRuntime.seedCreatedAt));
  plantRuntime.isSeedDry = false;
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  clearMainSeedPickedForCurrentRoom();
  if (!sharedWorldResetOnly) {
    removeStoredValue(storageKeyGuideBookPickedForRoom());
  }
  setStoredFlag(mainSeedCollectedKey, false);
  if (!sharedWorldResetOnly) {
    setStoredFlag(hasGuideBookKey, false);
  }
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
  plantRuntime.rottenAt = null;
  plantRuntime.needsFirstWater = false;
  plantRuntime.growthStartedAt = null;
  plantRuntime.isSproutGrown = false;
  plantRuntime.sproutGrownAt = null;
  plantRuntime.sproutEvolutionMs = 0;
  plantRuntime.sproutEvolutionLastTickAt = null;
  plantRuntime.isSproutSelfSustaining = false;
  plantRuntime.growthTier = 0;
  plantRuntime.waterCapacity = 2;
  plantRuntime.powderUpgradeTargetTier = 0;
  plantRuntime.powderUpgradeStartedAt = null;
  plantRuntime.powderUpgradeDurationMs = 0;
  plantRuntime.grassAuto5EligibleAt = null;
  plantRuntime.plantedAt = null;
  plantRuntime.blockSproutRegrowthAfterDry = false;
  plantRuntime.drySoilAt = null;

  if (!sharedWorldResetOnly) {
    hasGuideBook = false;
    isGuideBookOpen = false;
    isGuideBookClickPromptActive = false;
    movementTutorialPhase = 0;
    movementTutorialBaseline = null;
    onboardingFlowStep = 1;
    onboardingJumpLatch = false;
    onboardingFirstGuideEscHintShown = false;
    onboardingNpcGuideEscHintShown = false;
    onboardingSeedTutorialSecondLine = false;
    onboardingPostAppleSeedIntroPhase = 0;
    onboardingPostWaterCongratsPhase = 0;
    onboardingButterflyCountBaseline = null;
    onboardingTutorialEnteredTree = false;
    onboardingClearAllOnboardingTimers();
    setOnboardingFlowDoneStored(false);
    setStoredValue(onboardingFlowStepKey, "1");
    isGuideDismissedAtSign = false;
    hasHandledDryMainSeed = false;
    dryMainSeedVisibleSince = 0;
    setStoredFlag(mainDrySeedHandledKey, false);
    isNpcDialogueRunning = false;
    isNpcDialogueComplete = false;
    isGuidePlantPageUnlocked = false;
    guidePageIndex = 0;
  } else {
    onboardingClearAllOnboardingTimers();
    isGuideDismissedAtSign = false;
    hasHandledDryMainSeed = false;
    dryMainSeedVisibleSince = 0;
    setStoredFlag(mainDrySeedHandledKey, false);
    isNpcDialogueRunning = false;
    isGuideBookOpen = false;
    isGuideBookClickPromptActive = false;
    movementTutorialPhase = 0;
    movementTutorialBaseline = null;
    guidePageIndex = 0;
  }
  isTreeFalling = false;
  wasPlayerInTree = false;
  appleState.count = 0;
  appleState.seedCount = 0;
  appleState.pickedIds = [];
  appleState.isEating = false;
  appleState.nextSeedOffset = 0;
  appleState.apples = createRandomApples(5);
  appleState.lastSpawnAt = Date.now();
  clearExtraSeedAndPlantElements();
  appleState.extraSeeds = [];
  appleState.extraPlants = [];
  appleState.worldLooseSeed = {
    x: WORLD_LOOSE_SEED_X,
    y: WORLD_LOOSE_SEED_Y,
    nextSpawnAt: 0
  };
  worldLooseSeedElement = null;
  localApplePickedAtById = {};

  // Reset butterflies: drop any visible butterflies and zero out the player's
  // collected counts so the world starts fresh.
  Object.keys(butterflyRenderById).forEach(removeButterflyRenderEntry);
  butterflyState.list = [];
  butterflyState.lastSpawnAt = 0;
  butterflyColors.forEach(function (color) {
    butterflyState.caughtCounts[color] = 0;
  });
  hasSeededInitialButterflies = false;
  magicPowderCount = 0;
  isCraftingMagicPowder = false;
  clearTimeout(magicPowderCraftTimer);
  Object.keys(butterflyLocalCatchTombstoneById).forEach(function (id) {
    delete butterflyLocalCatchTombstoneById[id];
  });
  saveButterflyCaughtCounts();
  saveMagicPowderCount();
  updateButterflyInventoryUi();
  updateMagicPowderInventoryUi();

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
  if (mainPlantGrowthMeter && mainPlantGrowthMeter.element) {
    mainPlantGrowthMeter.element.style.display = "none";
  }
  seedCard.style.display = "none";
  seedWorldText.style.display = "none";
  seedInventory.style.display = "none";
  guideCard.style.display = "none";
  if (!sharedWorldResetOnly) {
    guideBook.style.display = "block";
    guideBook.classList.remove("is-near");
    guideBookButton.style.display = "none";
  }
  hasShownFirstSeedFocus = false;
  window.clearTimeout(firstSeedFocusTimeout);
  seedInventory.classList.remove("is-first-seed-focus");
  npcBubble.style.display = "none";
  playerAlert.style.display = "none";

  updateWellImage();
  updateWellCard();
  updateSeedPosition();
  updateBucketPosition();
  setWorldPosition(signBoard, signX, signY);
  setWorldPosition(guideBook, guideBookX, guideBookY);
  if (sharedWorldResetOnly) {
    loadGuideBookState(true);
  } else {
    updateNpcPosition();
    updateGuidePages();
  }
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
  if (isNpcDialogueRunning) return true;
  if (!isNpcDialogueComplete) {
    return true;
  }
  /** 온보딩 중에는 대화 반복을 위해 항상 표시 */
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    return true;
  }
  /** 본편: 첫 대화 후에도 메인 작물 심기 전에는 찾을 수 있게 */
  if (!plantRuntime.isSeedPlanted) {
    return true;
  }
  /** 마른 땅에서도 달인이 사라졌다 나타났다 하지 않게(스냅샷·UI 일치) */
  return plantRuntime.status !== "rotten";
}

function isNearPlantMaster() {
  if (!isPlantMasterVisible()) return false;

  return getCenterDistance(npcX, npcY, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
}

function tryTalkToPlantMaster() {
  if (!isNearPlantMaster() || isNpcDialogueRunning) {
    return false;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 9) {
    flashOnboardingOrderHint("");
    return false;
  }

  startPlantMasterDialogue();
  return true;
}

function startPlantMasterDialogue() {
  const isFirstTalk = !isNpcDialogueComplete;
  const lines = isFirstTalk
    ? [
        { speaker: "npc", text: "\uC790\uB124....", delayAfterMs: 1000 },
        { speaker: "npc", text: "\uC2DD\uBB3C\uC774\uB780", delayAfterMs: 500 },
        { speaker: "npc", text: "\uBB34\uC5C7\uC774\uB77C \uC0DD\uAC01\uD558\uB098?!", delayAfterMs: 1500 },
        { speaker: "player", text: "\uC798 \uBAA8\uB974\uACA0\uC2B5\uB2C8\uB2E4...", delayAfterMs: 2500 },
        { speaker: "npc", text: "\uC2DD\uBB3C\uC774\uB780...", delayAfterMs: 3500 },
        { speaker: "npc", text: "$%#@!", delayAfterMs: 2000 },
        { speaker: "npc", text: "\uC77C\uC138.", delayAfterMs: 3000 },
        { speaker: "player", text: "!!!", delayAfterMs: 1200 }
      ]
    : [
        {
          speaker: "npc",
          text: "\uAD81\uAE08\uD55C\uAC8C \uC788\uB098? \uC544\uC9C1 \uB54C\uAC00 \uC544\uB2D0\uC138..",
          delayAfterMs: 1400
        }
      ];

  isNpcDialogueRunning = true;
  npcBubble.style.display = "none";
  playerBubble.style.display = "none";
  window.clearTimeout(npcPromptHideTimeout);

  let timelineMs = 0;
  lines.forEach(function (lineInfo) {
    window.setTimeout(function () {
      showDialogueLine(lineInfo);
    }, timelineMs);
    timelineMs += Math.max(0, Number(lineInfo.delayAfterMs) || 650);
  });

  window.setTimeout(function () {
    npcBubble.style.display = "none";
    playerBubble.style.display = "none";
    isNpcDialogueRunning = false;
    npcBubble.dataset.promptShown = "false";
    if (isFirstTalk) {
      isNpcDialogueComplete = true;
      isGuidePlantPageUnlocked = true;
      hasGuideBook = true;
      setGuideBookPickedForCurrentRoom();
      guideBook.style.display = "none";
      guideBookButton.style.display = "block";
      setStoredFlag(npcDialogueCompleteKey, true);
      setStoredFlag(guidePlantPageUnlockedKey, true);
      isGuideBookClickPromptActive = true;
      setStoredFlag(guideBookClickPromptDismissedKey, false);
      showPlayerAlert();
      guidePageIndex = 0;
      isGuideBookOpen = true;
      if (!getStoredFlag(onboardingFlowDoneKey)) {
        if (onboardingFlowStep === 9) {
          onboardingClearEscHintTimer();
          onboardingNpcGuideEscHintShown = false;
          onboardingFlowStep = 10;
        } else if (onboardingFlowStep < 2) {
          onboardingFlowStep = 2;
        }
        persistOnboardingStep();
      }
      completeMovementTutorial();
    }
    updateNpcPosition();
    updateGuideCard();
    updateOnboardingFlowUI();
  }, timelineMs + 250);
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

function toggleSeed() {
  if (plantRuntime.isPlanting || heldItem) return;
  pickUpNearestItem();
}

function tryPickSharedBucket(bucketDistance) {
  const bucketSize = getBucketSize();
  if (bucketDistance > pickupDistance || !canPickUpSharedBucket()) {
    return false;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== 12) {
    flashOnboardingOrderHint("");
    return true;
  }
  const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
  bucketX = handPosition.x;
  bucketY = handPosition.y;
  heldItem = HELD_ITEM_BUCKET;
  lastBucketPickupAt = Date.now();
  window.OVC_SHARED_BUCKET_HELD_BY = currentSessionId;
  markWorldDirty();
  broadcastBucketState(true);
  syncWorldState(true);
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    if (onboardingFlowStep === 12 || onboardingFlowStep === 11) {
      onboardingFlowStep = 13;
      persistOnboardingStep();
      updateOnboardingFlowUI();
    }
  }
  return true;
}

/**
 * World hub: tutorial 땅 #seed 줍기는 없음. worldLooseSeed(합성 후보) + extraSeeds + 양동이만.
 */
function pickUpNearestItemWorldHub(bucketDistance) {
  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;
  if (
    nearest &&
    extraDist <= pickupDistance &&
    extraDist <= bucketDistance
  ) {
    if (isWorldLooseSyntheticPickupCandidate(nearest.seed)) {
      ensureWorldLooseSeedShape();
      const now = Date.now();
      if (now < Number(worldLoosePickupLockUntil || 0)) return;
      appleState.seedCount += 1;
      scheduleWorldLooseRespawnAfterPickup(appleState.worldLooseSeed, now);
      lastWorldLooseSeedPickupAt = Math.max(lastWorldLooseSeedPickupAt, now);
      worldLoosePickupLockUntil = Math.max(
        Number(worldLoosePickupLockUntil || 0),
        Number(appleState.worldLooseSeed.nextSpawnAt || 0)
      );
      saveAppleState();
      broadcastWorldLooseSeedPickup();
      markWorldDirty();
      holdLocalAppleStateAgainstStaleSnapshot(1200);
      syncWorldState(true);
      updateExtraSeedsAndPlants();
      updateSeedInventory();
      triggerFirstSeedFocus();
      return;
    }
    if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      return;
    }
    nearest.seed.inInventory = true;
    assignExtraSeedInventoryOwner(nearest.seed);
    saveAppleState();
    holdLocalAppleStateAgainstStaleSnapshot(1200);
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    triggerFirstSeedFocus();
    return;
  }
  tryPickSharedBucket(bucketDistance);
}

/**
 * Tutorial / 온보딩 중 index: 땅 #seed(튜토 메인) → 스타터, 그 외 extraSeeds, 양동이.
 */
function pickUpNearestItemTutorialFlow(seedSize, bucketDistance) {
  const tutorialMainDist = canPickUpSeed()
    ? getCenterDistance(seedX, seedY, seedSize.width, seedSize.height)
    : Infinity;
  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;

  if (
    tutorialMainDist <= pickupDistance &&
    tutorialMainDist <= bucketDistance &&
    tutorialMainDist <= extraDist
  ) {
    if (isOnboardingLinearGateActive() && onboardingFlowStep !== 6) {
      flashOnboardingOrderHint("");
      return;
    }
    createStarterSeedInventoryItem();
    updateSeedPosition();
    updateSeedInventory();
    triggerFirstSeedFocus();
    return;
  }

  if (nearest && extraDist <= pickupDistance && extraDist <= bucketDistance) {
    if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      return;
    }
    nearest.seed.inInventory = true;
    assignExtraSeedInventoryOwner(nearest.seed);
    saveAppleState();
    holdLocalAppleStateAgainstStaleSnapshot(1200);
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    triggerFirstSeedFocus();
    return;
  }

  tryPickSharedBucket(bucketDistance);
}

function pickUpNearestItem() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const bucketDistance = getCenterDistance(bucketX, bucketY, bucketSize.width, bucketSize.height);

  if (usesWorldLooseSeedMode()) {
    pickUpNearestItemWorldHub(bucketDistance);
  } else {
    pickUpNearestItemTutorialFlow(seedSize, bucketDistance);
  }
}

function triggerFirstSeedFocus() {
  if (hasShownFirstSeedFocus) return;

  hasShownFirstSeedFocus = true;
  seedInventory.classList.add("is-first-seed-focus");
  window.clearTimeout(firstSeedFocusTimeout);
  firstSeedFocusTimeout = window.setTimeout(function () {
    seedInventory.classList.remove("is-first-seed-focus");
  }, 6500);
}

function canPickUpSharedBucket() {
  const heldBy = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  if (!heldBy || heldBy === currentSessionId) return true;

  const holder = remotePlayers[heldBy];
  const holderIsActive =
    holder &&
    Number.isFinite(holder.lastSeenAt) &&
    Date.now() - holder.lastSeenAt < 5000;

  if (!holderIsActive) {
    // Recover from stale holder ownership that blocks pickup forever.
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    markWorldDirty();
    addBucketTrace("pickup", "recovered stale holder=" + heldBy, 0);
    return true;
  }

  addBucketTrace("pickup", "blocked by active holder=" + heldBy, 500);
  return false;
}

/** Tutorial: extraSeeds만. World hub: 보이는 동안 합성 worldLoose 후보가 우선(같은 좌표 정책은 groundSeed.js). */
function getNearestPickableExtraSeed() {
  let nearest = null;
  const now = Date.now();

  if (
    usesWorldLooseSeedMode() &&
    now >= Number(worldLoosePickupLockUntil || 0) &&
    isWorldLooseSeedVisibleAt(now)
  ) {
    ensureWorldLooseSeedShape();
    const ws = appleState.worldLooseSeed;
    const distance = getCenterDistance(ws.x, ws.y, SEED_SIZE, SEED_SIZE);
    nearest = {
      seed: {
        id: WORLD_LOOSE_SEED_ID,
        x: ws.x,
        y: ws.y,
        worldLoosePick: true
      },
      distance
    };
  }

  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || isExtraSeedDry(extraSeed)) return;
    if (usesWorldLooseSeedMode() && !extraSeed.inInventory) {
      return;
    }

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
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 23) {
    return false;
  }
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
  appleState.lastSpawnAt = Date.now();
  localApplePickedAtById[apple.id] = appleState.lastSpawnAt;
  appleState.count += 1;
  saveAppleState();
  updateApples();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 23) {
    onboardingFlowStep = 24;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
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
  const appleTip =
    "\uC0AC\uACFC \uBCF4\uC720 " +
    appleState.count +
    "\uAC1C \u2014 \uD074\uB9AD\uD558\uBA74 \uBA39\uC2B5\uB2C8\uB2E4.";
  if (inventoryApple) {
    if (appleState.count > 0) {
      inventoryApple.title = appleTip;
    } else {
      inventoryApple.removeAttribute("title");
    }
  }
  if (appleInventory) {
    if (appleState.count > 0) appleInventory.title = appleTip;
    else appleInventory.removeAttribute("title");
  }
  if (appleCountText) {
    if (appleState.count > 0) appleCountText.title = appleTip;
    else appleCountText.removeAttribute("title");
  }
}

function eatApple() {
  if (appleState.count <= 0 || appleState.isEating || plantRuntime.isPlanting || isNpcDialogueRunning) return;
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 24) {
    flashOnboardingOrderHint("");
    return;
  }

  appleState.count -= 1;
  appleState.isEating = true;
  playerStatus.textContent = "\uC0AC\uACFC\uBA39\uB294\uC911...";
  saveAppleState();
  updateApples();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    appleState.isEating = false;
    sendMultiplayerPresence(true);
    playerStatus.textContent = "";
    createSeedFromApple();
    if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 24) {
      onboardingFlowStep = 25;
      onboardingSeedTutorialSecondLine = false;
      onboardingPostAppleSeedIntroPhase = 0;
      persistOnboardingStep();
      if (onboardingFruitIntroTimerId) {
        window.clearTimeout(onboardingFruitIntroTimerId);
      }
      onboardingFruitIntroTimerId = window.setTimeout(function () {
        onboardingFruitIntroTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 25) return;
        onboardingPostAppleSeedIntroPhase = 1;
        updateOnboardingFlowUI();
      }, 2000);
      if (onboardingTreeLeaveHintTimerId) {
        window.clearTimeout(onboardingTreeLeaveHintTimerId);
      }
      onboardingTreeLeaveHintTimerId = window.setTimeout(function () {
        onboardingTreeLeaveHintTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 25) return;
        onboardingSeedTutorialSecondLine = true;
        updateOnboardingFlowUI();
      }, 5000);
      updateOnboardingFlowUI();
    }
  }, appleEatMs);
}

function createSeedFromApple() {
  if (usesWorldLooseSeedMode()) {
    appleState.seedCount += 1;
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    saveAppleState();
    return;
  }
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
  assignExtraSeedInventoryOwner(newSeed);

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
  Object.keys(localApplePickedAtById).forEach(function (appleId) {
    const pickedAt = Number(localApplePickedAtById[appleId] || 0);
    if (!pickedAt || now - pickedAt > appleRespawnMs * 2) {
      delete localApplePickedAtById[appleId];
    }
  });
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
  appleState.seedCount = Math.max(0, Number(loaded.seedCount) || 0);
  appleState.apples = loaded.apples;
  appleState.pickedIds = loaded.pickedAppleIds;
  appleState.nextSeedOffset = loaded.nextAppleSeedOffset;
  appleState.lastSpawnAt = loaded.lastAppleSpawnAt;
  appleState.extraSeeds = loaded.extraSeeds;
  appleState.extraPlants = loaded.extraPlants;
  appleState.worldLooseSeed = loaded.worldLooseSeed
    ? {
        x: Number(loaded.worldLooseSeed.x) || WORLD_LOOSE_SEED_X,
        y: Number(loaded.worldLooseSeed.y) || WORLD_LOOSE_SEED_Y,
        nextSpawnAt: Math.max(0, Number(loaded.worldLooseSeed.nextSpawnAt) || 0)
      }
    : {
        x: WORLD_LOOSE_SEED_X,
        y: WORLD_LOOSE_SEED_Y,
        nextSpawnAt: 0
      };
  ensureWorldLooseSeedShape();
  if (usesWorldLooseSeedMode()) {
    let migrateInvToCount = 0;
    appleState.extraSeeds.forEach(function (s) {
      if (s && s.inInventory && !s.planted) {
        migrateInvToCount += 1;
      }
    });
    appleState.seedCount += migrateInvToCount;
    appleState.extraSeeds = appleState.extraSeeds.filter(function (s) {
      return s && s.planted;
    });
    appleState.extraSeeds.forEach(function (s) {
      if (s.inventoryElement) {
        s.inventoryElement.remove();
        s.inventoryElement = undefined;
        s.inventoryImage = undefined;
      }
    });
    if (sanitizeWorldLooseModeExtraSeeds()) {
      saveAppleStateToStorage({
        appleStateKey,
        appleCount: appleState.count,
        seedCount: appleState.seedCount,
        apples: appleState.apples,
        pickedAppleIds: appleState.pickedIds,
        nextAppleSeedOffset: appleState.nextSeedOffset,
        lastAppleSpawnAt: appleState.lastSpawnAt,
        extraSeeds: appleState.extraSeeds,
        extraPlants: appleState.extraPlants,
        worldLooseSeed: appleState.worldLooseSeed
      });
    }
  }

  syncMainSeedPickedStateFromLoadedExtraSeeds();

  if (loaded.parseFailed) {
    clearExtraSeedAndPlantElements();
  }

  updateApples();
  updateExtraSeedsAndPlants();
  updateSeedPosition();
}

function saveAppleState() {
  lastAppleStateChangeAt = Date.now();
  ensureWorldLooseSeedShape();
  saveAppleStateToStorage({
    appleStateKey,
    appleCount: appleState.count,
    seedCount: appleState.seedCount,
    apples: appleState.apples,
    pickedAppleIds: appleState.pickedIds,
    nextAppleSeedOffset: appleState.nextSeedOffset,
    lastAppleSpawnAt: appleState.lastSpawnAt,
    extraSeeds: appleState.extraSeeds,
    extraPlants: appleState.extraPlants,
    worldLooseSeed: appleState.worldLooseSeed
  });
  markWorldDirty();
}

function loadBucketState() {
  const savedRaw = getStoredValue(bucketStateKey);
  if (!savedRaw) return;

  try {
    const saved = JSON.parse(savedRaw);
    isBucketFull = Boolean(saved.isBucketFull);
    if (saved.heldItem === HELD_ITEM_BUCKET) {
      // Carrying is transient input state, not persisted world state.
      // Old saves may contain hand-position coordinates; reset those to the well.
      const bucketSize = getBucketSize();
      bucketX = wellX - bucketSize.width - 8;
      bucketY = wellY + WELL_SIZE - bucketSize.height;
    } else {
      bucketX = Number.isFinite(Number(saved.bucketX)) ? Number(saved.bucketX) : bucketX;
      bucketY = Number.isFinite(Number(saved.bucketY)) ? Number(saved.bucketY) : bucketY;
    }
    heldItem = null;
    window.OVC_SHARED_BUCKET_HELD_BY = "";
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
      heldItem: null,
      savedAt: Date.now()
    })
  );
  markWorldDirty();
}

function markWorldDirty() {
  if (isApplyingWorldState) return;
  isWorldDirty = true;
}

function applyServerWorldRowTimestamps(row) {
  if (!row || !row.updated_at) return;
  lastWorldUpdatedAt = row.updated_at;
  const parsed = Date.parse(row.updated_at);
  if (!Number.isFinite(parsed) || parsed <= 0) return;
  lastMainPlantStateChangeAt = Math.max(lastMainPlantStateChangeAt, parsed);
  lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, parsed);
  lastWellStateChangeAt = Math.max(lastWellStateChangeAt, parsed);
  lastMainSeedStateChangeAt = Math.max(lastMainSeedStateChangeAt, parsed);
}

/**
 * Plant timestamps in snapshots use the saver's Date.now(). Another client's clock
 * skew makes `now - waterLevelUpdatedAt` huge so decay drains all water and soil
 * flips to dry in one frame. Shift model times so elapsed-at-save matches local now.
 * refTime = snapshot.savedAt (preferred) or server row time.
 */
function rebasePlantModelTimestampsToLocalNow(plant, localNow, refTime) {
  if (!plant || !refTime || !Number.isFinite(refTime) || refTime <= 0) return;
  if (!Number.isFinite(localNow)) return;
  const rawShift = localNow - refTime;
  const shift = Math.max(-MAX_SNAPSHOT_CLOCK_SKEW_MS, Math.min(MAX_SNAPSHOT_CLOCK_SKEW_MS, rawShift));
  if (shift === 0) return;
  const bump = function (t) {
    const n = Number(t);
    if (!Number.isFinite(n) || n <= 0) return null;
    const v = n + shift;
    if (!Number.isFinite(v) || v <= 0) return null;
    if (v > localNow) return localNow;
    return v;
  };
  const maybe = function (key) {
    const v = bump(plant[key]);
    if (v != null) plant[key] = v;
  };
  maybe("waterLevelUpdatedAt");
  maybe("becameEmptyAt");
  maybe("lastWateredAt");
  maybe("growthStartedAt");
  maybe("plantedAt");
  maybe("sproutGrownAt");
  maybe("sproutEvolutionLastTickAt");
  maybe("rottenAt");
  maybe("powderUpgradeStartedAt");
  maybe("grassAuto5EligibleAt");
  maybe("drySoilAt");
  if (Array.isArray(plant.wateredAtList)) {
    plant.wateredAtList = plant.wateredAtList.map(function (entry) {
      const v = bump(entry);
      return v != null ? v : entry;
    });
  }
}

/**
 * After a remote world snapshot, local `applyPlantWaterDecay` uses this client's
 * Date.now(). Clamp hydration timestamps so skew cannot drain all water or
 * trigger dry soil in the same frame as apply.
 * @param {function} getDryAfterEmptyMs (plant, now) => ms until soil dries after water hits 0
 */
function sanitizeSharedPlantHydrationAfterRemoteSnapshot(plant, now, getDryAfterEmptyMs) {
  if (!plant) return;
  if (Object.prototype.hasOwnProperty.call(plant, "isSeedPlanted") && !plant.isSeedPlanted) {
    return;
  }
  if (plant.status === "rotten" || plant.status === "dry") return;

  const w = Math.max(0, Number(plant.waterLevel) || 0);
  const tickMs = getPlantWaterLevelTickMsForPlant(plant);
  if (!Number.isFinite(tickMs) || tickMs <= 0) return;

  if (w > 0) {
    let wu = Number(plant.waterLevelUpdatedAt);
    if (!Number.isFinite(wu) || wu <= 0 || wu > now) {
      plant.waterLevelUpdatedAt = now;
    } else {
      const maxElapsed = tickMs * w + tickMs;
      if (now - wu > maxElapsed) {
        plant.waterLevelUpdatedAt = now;
      }
    }
    plant.becameEmptyAt = null;
    return;
  }

  const be = Number(plant.becameEmptyAt);
  if (plant.becameEmptyAt != null && Number.isFinite(be)) {
    const dryAfter = getDryAfterEmptyMs(plant, now);
    if (dryAfter > 0 && now - be >= dryAfter) {
      plant.becameEmptyAt = Math.max(1, now - dryAfter + 1);
    }
  }
}

/** 우물 패시브 리필 틱과 맞춰 다른 클라와 lastRefillAt 해석이 어긋나 덮어쓰기가 반복되는 것을 줄임 */
function snapWellRefillToGrid(nowMs) {
  const t = Number(nowMs);
  if (!Number.isFinite(t) || t <= 0) {
    return Math.floor(Date.now() / wellRefillMs) * wellRefillMs;
  }
  return Math.floor(t / wellRefillMs) * wellRefillMs;
}

/**
 * 공유 월드 저장 직전: 패시브 물 감소·우물 리필을 현재 시각까지 반영해
 * 오래된 수분/우물 값이 스냅샷에 실리지 않게 함 (멀티에서 게이지가 들쭉날쭉한 원인).
 */
function flushPassiveSimulationBeforeSharedSnapshot() {
  if (!isSharedWorldMergeActive()) return;
  const now = Date.now();
  refillWellIfNeeded();
  if (
    plantRuntime.isSeedPlanted &&
    !plantRuntime.isOverwatered &&
    plantRuntime.status !== "dry" &&
    plantRuntime.status !== "rotten"
  ) {
    if (!shouldPauseWaterDecayForPlant(plantRuntime, now)) {
      applyPlantWaterDecay(plantRuntime, now);
    }
    if (plantRuntime.waterLevel === 0 && plantRuntime.becameEmptyAt === null) {
      plantRuntime.becameEmptyAt = plantRuntime.waterLevelUpdatedAt;
    }
  }
  appleState.extraPlants.forEach(function (ep) {
    if (!ep || ep.isOverwatered || ep.status === "dry" || ep.status === "rotten") {
      return;
    }
    if (shouldPauseWaterDecayForPlant(ep, now)) return;
    applyPlantWaterDecay(ep, now);
    if (ep.waterLevel === 0 && ep.becameEmptyAt === null) {
      ep.becameEmptyAt = ep.waterLevelUpdatedAt;
    }
  });
}

function getSharedWorldSnapshot() {
  flushPassiveSimulationBeforeSharedSnapshot();
  const bucketHeldBy = heldItem === HELD_ITEM_BUCKET ? currentSessionId : window.OVC_SHARED_BUCKET_HELD_BY || "";
  return {
    savedAt: Date.now(),
    savedBy: currentSessionId,
    resetToken: pendingWorldResetToken || lastAppliedWorldResetToken || "",
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
      isDry: plantRuntime.isSeedDry,
      isDryHandled: hasHandledDryMainSeed,
      isMainSeedAvailable: !hasPickedMainSeedInCurrentRoom()
    },
    mainPlant: getPlantStateForStorage(),
    apples: {
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
      // 월드(온보딩 완료): 땅 씨앗은 worldLooseSeed 1슬롯만 공유. 심은 씨앗(stub)만 extraSeeds.
      extraSeeds: usesWorldLooseSeedMode()
        ? appleState.extraSeeds
            .filter(function (extraSeed) {
              return !extraSeed.inInventory && extraSeed.planted;
            })
            .map(function (extraSeed) {
              return {
                id: extraSeed.id,
                x: extraSeed.x,
                y: extraSeed.y,
                createdAt: extraSeed.createdAt,
                planted: Boolean(extraSeed.planted),
                inInventory: Boolean(extraSeed.inInventory),
                label: extraSeed.label,
                isStarter: Boolean(extraSeed.isStarter),
                ownerUserId: extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
                ownerSessionId: extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
              };
            })
        : appleState.extraSeeds
            .filter(function (extraSeed) {
              return !extraSeed.inInventory;
            })
            .map(function (extraSeed) {
              return {
                id: extraSeed.id,
                x: extraSeed.x,
                y: extraSeed.y,
                createdAt: extraSeed.createdAt,
                planted: Boolean(extraSeed.planted),
                inInventory: Boolean(extraSeed.inInventory),
                label: extraSeed.label,
                isStarter: Boolean(extraSeed.isStarter),
                ownerUserId: extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
                ownerSessionId: extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
              };
            }),
      worldLooseSeed: usesWorldLooseSeedMode()
        ? (function () {
            ensureWorldLooseSeedShape();
            return {
              x: appleState.worldLooseSeed.x,
              y: appleState.worldLooseSeed.y,
              nextSpawnAt: appleState.worldLooseSeed.nextSpawnAt
            };
          })()
        : undefined,
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
          rottenAt: plant.rottenAt || null,
          needsFirstWater: Boolean(plant.needsFirstWater),
          growthStartedAt: plant.growthStartedAt,
          isSproutGrown: Boolean(plant.isSproutGrown),
          sproutGrownAt: plant.sproutGrownAt,
          sproutEvolutionMs: plant.sproutEvolutionMs,
          sproutEvolutionLastTickAt: plant.sproutEvolutionLastTickAt,
          isSproutSelfSustaining: plant.isSproutSelfSustaining,
          growthTier: plant.growthTier || 0,
          waterCapacity: plant.waterCapacity || 2,
          powderUpgradeTargetTier: plant.powderUpgradeTargetTier || 0,
          powderUpgradeStartedAt: plant.powderUpgradeStartedAt || null,
          powderUpgradeDurationMs: plant.powderUpgradeDurationMs || 0,
          grassAuto5EligibleAt: plant.grassAuto5EligibleAt != null ? plant.grassAuto5EligibleAt : null,
          ownerUserId: plant.ownerUserId || "",
          ownerDisplayName: plant.ownerDisplayName || "",
          sproutOrdinal: plant.sproutOrdinal || 0,
          grassOrdinal:
            plant.grassOrdinal != null && Number.isFinite(Number(plant.grassOrdinal))
              ? plant.grassOrdinal
              : null,
          blockSproutRegrowthAfterDry: Boolean(plant.blockSproutRegrowthAfterDry),
          drySoilAt:
            plant.drySoilAt != null && Number.isFinite(Number(plant.drySoilAt))
              ? Number(plant.drySoilAt)
              : null
        };
      })
    },
    butterflies: getButterflyStateForSnapshot()
  };
}

/** Re-run DOM / UI that depends on world state after `applySharedWorldSnapshot` mutates models. */
function refreshUiAfterSharedWorldApply() {
  syncMainSeedPickedStateFromLoadedExtraSeeds();
  updateWellImage();
  updateWellCard();
  updateSeedPosition();
  updateBucketPosition();
  updateApples();
  updateExtraSeedsAndPlants();
  updatePlantState();
  ensureSharedPlantVisuals();
  refreshSharedWaterIndicators();
  updateSeedInventory();
  updateButterflyInventoryUi();
  updateMagicPowderInventoryUi();
}

function holdLocalPlantStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  localPlantActionLockUntil = Math.max(localPlantActionLockUntil, Date.now() + lockMs);
}

function holdLocalAppleStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  localAppleActionLockUntil = Math.max(localAppleActionLockUntil, Date.now() + lockMs);
}

function getSynchronizedNow() {
  return getSynchronizedNowCore(serverClockOffsetMs);
}

function syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt) {
  const next = syncServerClockOffsetCore(
    serverClockOffsetMs,
    lastServerClockSyncAt,
    serverRowUpdatedAt,
    Date.now()
  );
  if (!next.changed) return;
  serverClockOffsetMs = next.offsetMs;
  lastServerClockSyncAt = next.syncedAtMs;
}

function applySharedWorldSnapshot(snapshot, serverRowUpdatedAt) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!snapshot || typeof snapshot !== "object") return;
  if (snapshot.savedBy === currentSessionId) return;
  syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt);
  const snapshotSavedAt = resolveSnapshotSavedAt(snapshot, serverRowUpdatedAt);
  const syncedNow = getSynchronizedNow();
  let hasServerRowTime = false;
  if (serverRowUpdatedAt != null && serverRowUpdatedAt !== "") {
    const parsedRowAt =
      typeof serverRowUpdatedAt === "string"
        ? Date.parse(serverRowUpdatedAt)
        : Number(serverRowUpdatedAt);
    hasServerRowTime = Number.isFinite(parsedRowAt) && parsedRowAt > 0;
  }
  const snapshotResetToken = String(snapshot.resetToken || "");
  const isResetGuardWindow = syncedNow - lastWorldResetAt < 20000;
  // Guard only during the short reset window. After that, allow sync to recover
  // even if some clients still publish snapshots without a reset token.
  if (
    isResetGuardWindow &&
    lastAppliedWorldResetToken &&
    !snapshotResetToken
  ) {
    return;
  }
  if (
    snapshotResetToken &&
    snapshotResetToken !== lastAppliedWorldResetToken
  ) {
    lastAppliedWorldResetToken = snapshotResetToken;
    lastWorldResetAt = syncedNow;
    ignoreSnapshotInventorySeedsUntil = Date.now() + 15000;
    sessionStorage.setItem("ovcLastWorldResetTokenV1", lastAppliedWorldResetToken);
    // 공유 세계만: 로컬 월드 캐시 삭제 + 맵·자원 기본값(튜토리얼 세션/온보딩 키는 유지)
    clearStoredKeys(appStorageKeysSharedWorldReset);
    isWorldDirty = false;
    applyDefaultState({ sharedWorldResetOnly: true });
    savePlayerPosition(true);
    restartPlayerPositionOnly();
    isReloadingForWorldReset = true;
    setTimeout(function () {
      window.location.replace(ovcWorldIndexUrl());
    }, 120);
    return;
  }
  isApplyingWorldState = true;
  const shouldDeferRemotePlantApply = Date.now() < localPlantActionLockUntil;
  const shouldDeferRemoteAppleApply = Date.now() < localAppleActionLockUntil;

  try {
    // Bucket uses realtime bucket_state as primary source while multiplayer is connected.
    // Apply snapshot bucket fallback only when realtime channel is not subscribed.
    if (snapshot.bucket && !isMultiplayerSubscribed) {
      const heldBy = String(snapshot.bucket.heldBy || "");
      const nextBucketX = Number(snapshot.bucket.x);
      const nextBucketY = Number(snapshot.bucket.y);
      if (heldItem === HELD_ITEM_BUCKET) {
        // While local player is carrying the bucket, keep local ownership/state authoritative.
        window.OVC_SHARED_BUCKET_HELD_BY = currentSessionId;
      } else {
        window.OVC_SHARED_BUCKET_HELD_BY = heldBy;
        if (heldBy !== currentSessionId) {
          isBucketFull = Boolean(snapshot.bucket.isFull);
          if (Number.isFinite(nextBucketX)) bucketX = nextBucketX;
          if (Number.isFinite(nextBucketY)) bucketY = nextBucketY;
        }
      }
    }

    if (snapshot.seed) {
      const nextSeedCreatedAt = Number(snapshot.seed.createdAt);
      const nextSeedX = Number(snapshot.seed.x);
      const nextSeedY = Number(snapshot.seed.y);
      const canApplyMainSeedState =
        hasServerRowTime ||
        !snapshotSavedAt ||
        snapshotSavedAt >= lastMainSeedStateChangeAt;
      // Per-account tutorial seed uses room-scoped storage; do not mirror shared snapshot here.
      if (canApplyMainSeedState && typeof snapshot.seed.isDryHandled === "boolean") {
        hasHandledDryMainSeed = Boolean(snapshot.seed.isDryHandled);
        setStoredFlag(mainDrySeedHandledKey, hasHandledDryMainSeed);
      }
      if (canApplyMainSeedState && typeof snapshot.seed.isMainSeedAvailable === "boolean") {
        if (snapshot.seed.isMainSeedAvailable) {
          clearMainSeedPickedForCurrentRoom();
          isMainSeedAvailable = true;
        } else {
          setMainSeedPickedForCurrentRoom();
          isMainSeedAvailable = false;
        }
      }
      if (canApplyMainSeedState && snapshotSavedAt) {
        lastMainSeedStateChangeAt = Math.max(lastMainSeedStateChangeAt, snapshotSavedAt);
      }
      if (canApplyMainSeedState) {
        if (heldItem !== HELD_ITEM_SEED) {
          if (Number.isFinite(nextSeedX)) seedX = nextSeedX;
          if (Number.isFinite(nextSeedY)) seedY = nextSeedY;
        }
        if (Number.isFinite(nextSeedCreatedAt) && nextSeedCreatedAt > 0) {
          plantRuntime.seedCreatedAt = nextSeedCreatedAt;
          setStoredValue(seedCreatedAtKey, String(nextSeedCreatedAt));
        }
        if (!Number.isFinite(nextSeedCreatedAt) && typeof snapshot.seed.isDry === "boolean") {
          plantRuntime.isSeedDry = Boolean(snapshot.seed.isDry);
        }
      }
    }

    // Shared world rows are authoritative once the server reports a new updated_at.
    // Do not gate well / main plant / apples on local timestamps or client clocks —
    // that drops remote plants when lastAppleStateChangeAt / lastMainPlantStateChangeAt
    // is ahead of the snapshot savedAt (clock skew or any local saveAppleState).
    if (snapshot.well) {
      wellState.water = Math.max(0, Math.min(maxWellWater, Number(snapshot.well.water) || 0));
      wellState.lastRefillAt = Number(snapshot.well.lastRefillAt) || Date.now();
      refillWellIfNeeded();
      if (snapshotSavedAt) {
        lastWellStateChangeAt = Math.max(lastWellStateChangeAt, snapshotSavedAt);
      }
    }

    // Snapshot apply rule (mainPlant):
    // - apply by default (server row is authoritative),
    // - but defer during short local action locks to avoid flicker/rollback.
    const shouldApplyMainPlantSnapshot = Boolean(snapshot.mainPlant) && !shouldDeferRemotePlantApply;
    if (shouldApplyMainPlantSnapshot) {
      let incomingPlant = parseMainPlantFromSnapshot(snapshot.mainPlant);
      const snapAt = snapshotSavedAt || 0;
      if (
        !hasServerRowTime &&
        incomingPlant &&
        snapAt > 0 &&
        lastMainPlantStateChangeAt > 0 &&
        snapAt < lastMainPlantStateChangeAt - 1200
      ) {
        incomingPlant = null;
      }
      if (
        !hasServerRowTime &&
        incomingPlant &&
        snapAt > 0 &&
        snapAt < lastMainPlantStateChangeAt - 2000 &&
        plantRuntime.isSeedPlanted &&
        !incomingPlant.isSeedPlanted
      ) {
        incomingPlant = null;
      }
      if (incomingPlant) {
        if (
          isPowderUpgradeInProgress(plantRuntime) &&
          !isPowderUpgradeInProgress(incomingPlant) &&
          (incomingPlant.growthTier || 0) === (plantRuntime.growthTier || 0)
        ) {
          incomingPlant = Object.assign({}, incomingPlant, {
            powderUpgradeTargetTier: plantRuntime.powderUpgradeTargetTier,
            powderUpgradeStartedAt: plantRuntime.powderUpgradeStartedAt,
            powderUpgradeDurationMs: plantRuntime.powderUpgradeDurationMs
          });
        }
        applyLoadedPlantState(incomingPlant);
        const localApplyNow = getSynchronizedNow();
        const snapshotRefTime =
          (Number(snapshot.savedAt) > 0 ? Number(snapshot.savedAt) : 0) ||
          (snapshotSavedAt > 0 ? snapshotSavedAt : 0);
        if (plantRuntime.isSeedPlanted && snapshotRefTime > 0) {
          rebasePlantModelTimestampsToLocalNow(plantRuntime, localApplyNow, snapshotRefTime);
        }
        sanitizeSharedPlantHydrationAfterRemoteSnapshot(
          plantRuntime,
          localApplyNow,
          getMainDryAfterEmptyMsForPlant
        );
        normalizePlantSproutFieldsWhenSoilDry(plantRuntime);
        npcX = Number(snapshot.mainPlant.npcX) || npcX;
        npcY = Number(snapshot.mainPlant.npcY) || npcY;
        if (plantRuntime.isSeedPlanted) {
          plantSpot.src = getPlantSoilSrc(plantRuntime);
          setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
          const mainRot = plantRuntime.status === "rotten" || plantRuntime.isOverwatered;
          plantSpot.style.display =
            mainRot || !shouldHideSeparateSoilUnderBigGrass(plantRuntime) ? "block" : "none";
        } else {
          plantSpot.style.display = "none";
        }
        if (snapshotSavedAt) {
          lastMainPlantStateChangeAt = Math.max(lastMainPlantStateChangeAt, snapshotSavedAt);
        }
      }
    }

    // Snapshot apply rule (apples/extra seeds/plants):
    // - defer during local apples lock window,
    // - then resume full merge on subsequent polls.
    if (snapshot.apples && !shouldDeferRemoteAppleApply) {
      const priorExtraSeeds = appleState.extraSeeds.slice();
      const priorExtraPlants = appleState.extraPlants.slice();
      const priorWorldLooseNextSpawnAt =
        usesWorldLooseSeedMode() &&
        appleState.worldLooseSeed &&
        typeof appleState.worldLooseSeed === "object"
          ? Math.max(0, Number(appleState.worldLooseSeed.nextSpawnAt) || 0)
          : 0;
      const snapshotAppleTime = snapshotSavedAt || 0;
      const snapshotPlantIdsEarly = Object.create(null);
      if (Array.isArray(snapshot.apples.extraPlants)) {
        snapshot.apples.extraPlants.forEach(function (p) {
          if (p && p.id != null) snapshotPlantIdsEarly[String(p.id)] = true;
        });
      }
      const seedPendingFromRecentLocalEdit =
        !hasServerRowTime &&
        (!snapshotAppleTime ||
          lastAppleStateChangeAt + 2000 > snapshotAppleTime);
      let shouldMergePendingPlants = seedPendingFromRecentLocalEdit;
      if (!shouldMergePendingPlants) {
        const snapMissingLocalPlant = priorExtraPlants.some(function (p) {
          if (!p || p.id == null || p.removed) return false;
          return !snapshotPlantIdsEarly[String(p.id)];
        });
        if (snapMissingLocalPlant) {
          shouldMergePendingPlants = true;
        }
      }
      const localInventorySeeds = appleState.extraSeeds.filter(function (extraSeed) {
        return (
          Boolean(extraSeed.inInventory) &&
          !extraSeed.planted &&
          isExtraSeedOwnedByLocalPlayer(extraSeed)
        );
      }).map(function (extraSeed) {
        return {
          id: extraSeed.id,
          x: extraSeed.x,
          y: extraSeed.y,
          createdAt: extraSeed.createdAt,
          planted: false,
          inInventory: true,
          label: extraSeed.label || "\uC528\uC557",
          isStarter: Boolean(extraSeed.isStarter),
          ownerUserId:
            extraSeed.ownerUserId != null ? String(extraSeed.ownerUserId) : "",
          ownerSessionId:
            extraSeed.ownerSessionId != null ? String(extraSeed.ownerSessionId) : ""
        };
      });
      const localInventorySeedIds = {};
      localInventorySeeds.forEach(function (invSeed) {
        localInventorySeedIds[String(invSeed.id)] = true;
      });
      invalidateGroundSeedElementRefsOnly(priorExtraSeeds);
      clearGroundExtraSeedElementsOnly();
      appleState.pickedIds = Array.isArray(snapshot.apples.pickedIds) ? snapshot.apples.pickedIds.slice() : [];
      appleState.nextSeedOffset = Math.max(0, Number(snapshot.apples.nextSeedOffset) || 0);
      appleState.lastSpawnAt = Number(snapshot.apples.lastSpawnAt) || Date.now();
      appleState.apples = Array.isArray(snapshot.apples.apples)
        ? snapshot.apples.apples.map(parseTreeAppleFromSnapshot)
        : appleState.apples;
      if (usesWorldLooseSeedMode()) {
        const wls = snapshot.apples.worldLooseSeed;
        if (wls && typeof wls === "object") {
          const incomingNext = Math.max(0, Number(wls.nextSpawnAt) || 0);
          const nowLoose = syncedNow;
          let mergedNextSpawnAt;
          if (hasServerRowTime) {
            if (priorWorldLooseNextSpawnAt > nowLoose) {
              // Keep local active pickup cooldown from being rolled back by stale rows.
              mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
            } else if (incomingNext > nowLoose) {
              mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
            } else {
              mergedNextSpawnAt = incomingNext;
            }
          } else {
            mergedNextSpawnAt = Math.max(incomingNext, priorWorldLooseNextSpawnAt);
          }
          appleState.worldLooseSeed = {
            x: Number(wls.x) || WORLD_LOOSE_SEED_X,
            y: Number(wls.y) || WORLD_LOOSE_SEED_Y,
            nextSpawnAt: mergedNextSpawnAt
          };
          worldLoosePickupLockUntil = Math.max(
            Number(worldLoosePickupLockUntil || 0),
            Number(mergedNextSpawnAt || 0)
          );
        } else {
          ensureWorldLooseSeedShape();
        }
        const plantedById = Object.create(null);
        priorExtraSeeds.forEach(function (s) {
          if (s && s.planted && s.id != null) {
            plantedById[String(s.id)] = s;
          }
        });
        if (Array.isArray(snapshot.apples.extraSeeds)) {
          snapshot.apples.extraSeeds.forEach(function (raw) {
            if (!raw || !raw.planted || raw.id == null) return;
            plantedById[String(raw.id)] = parseSharedGroundSeedFromSnapshot(raw);
          });
        }
        const mergedPlanted = Object.keys(plantedById).map(function (k) {
          return plantedById[k];
        });
        if (Date.now() < ignoreSnapshotInventorySeedsUntil) {
          appleState.extraSeeds = localInventorySeeds.slice();
        } else {
          appleState.extraSeeds = dedupeExtraSeedsPreferInventory(
            localInventorySeeds.concat(mergedPlanted)
          );
        }
      } else {
        const snapshotExtraSeedIds = Object.create(null);
        if (Array.isArray(snapshot.apples.extraSeeds)) {
          snapshot.apples.extraSeeds.forEach(function (extraSeed) {
            if (extraSeed && extraSeed.id != null) {
              snapshotExtraSeedIds[String(extraSeed.id)] = true;
            }
          });
        }
        let shouldMergePendingSeeds = seedPendingFromRecentLocalEdit;
        if (!shouldMergePendingSeeds) {
          const snapMissingLocalOwnedGroundSeed = priorExtraSeeds.some(function (s) {
            if (!s || s.id == null) return false;
            if (Boolean(s.inInventory) || Boolean(s.planted)) return false;
            if (!isExtraSeedSessionOwnedByLocal(s)) return false;
            return !snapshotExtraSeedIds[String(s.id)];
          });
          if (snapMissingLocalOwnedGroundSeed) {
            shouldMergePendingSeeds = true;
          }
        }
        appleState.extraSeeds = Array.isArray(snapshot.apples.extraSeeds)
          ? snapshot.apples.extraSeeds
              .filter(function (extraSeed) {
                return !localInventorySeedIds[String(extraSeed.id)];
              })
              .map(parseSharedGroundSeedFromSnapshot)
          : [];
        if (Date.now() < ignoreSnapshotInventorySeedsUntil) {
          appleState.extraSeeds = localInventorySeeds.slice();
        } else if (localInventorySeeds.length > 0) {
          appleState.extraSeeds = appleState.extraSeeds.concat(localInventorySeeds);
        }
        appleState.extraSeeds = dedupeExtraSeedsPreferInventory(appleState.extraSeeds);
        if (shouldMergePendingSeeds) {
          const pendingExtraSeeds = priorExtraSeeds.filter(function (s) {
            if (!s || s.id == null) return false;
            if (Boolean(s.inInventory)) return false;
            if (Boolean(s.planted)) return false;
            const sid = String(s.id);
            if (plantingInventorySeedId && sid === String(plantingInventorySeedId)) return false;
            if (extraSeedHasCorrespondingExtraPlant(sid, priorExtraPlants)) return false;
            if (snapshotExtraSeedIds[sid]) return false;
            if (localInventorySeedIds[sid]) return false;
            if (!seedPendingFromRecentLocalEdit && !isExtraSeedSessionOwnedByLocal(s)) {
              return false;
            }
            return true;
          });
          if (pendingExtraSeeds.length > 0) {
            appleState.extraSeeds = appleState.extraSeeds.concat(pendingExtraSeeds);
            appleState.extraSeeds = dedupeExtraSeedsPreferInventory(appleState.extraSeeds);
          }
        }
      }
      const incomingExtraPlants = shouldDeferRemotePlantApply
        ? priorExtraPlants.slice()
        : Array.isArray(snapshot.apples.extraPlants)
          ? snapshot.apples.extraPlants.map(parseExtraPlantFromSnapshot)
          : [];
      let nextExtraPlants = incomingExtraPlants;
      if (shouldMergePendingPlants) {
        const pendingLocalPlants = priorExtraPlants.filter(function (p) {
          if (!p || p.id == null) return false;
          return !snapshotPlantIdsEarly[String(p.id)];
        });
        if (pendingLocalPlants.length > 0) {
          nextExtraPlants = incomingExtraPlants.concat(pendingLocalPlants);
        }
      }
      const nextPlantIdSet = Object.create(null);
      nextExtraPlants.forEach(function (p) {
        if (p && p.id != null) nextPlantIdSet[String(p.id)] = true;
      });
      priorExtraPlants.forEach(function (p) {
        if (!p || p.id == null) return;
        if (!nextPlantIdSet[String(p.id)]) {
          teardownExtraPlantDom(p);
        }
      });
      const priorPlantById = Object.create(null);
      priorExtraPlants.forEach(function (p) {
        if (p && p.id != null) priorPlantById[String(p.id)] = p;
      });
      nextExtraPlants.forEach(function (p) {
        if (!p || p.id == null) return;
        const prev = priorPlantById[String(p.id)];
        if (!prev || prev === p) return;
        if (prev.spotElement && document.contains(prev.spotElement)) {
          p.spotElement = prev.spotElement;
          p.sproutElement = prev.sproutElement;
          p.waterNeededElement = prev.waterNeededElement;
          p.growthMeterElement = prev.growthMeterElement;
          p.growthMeterFill = prev.growthMeterFill;
          prev.spotElement = undefined;
          prev.sproutElement = undefined;
          prev.waterNeededElement = undefined;
          prev.growthMeterElement = undefined;
          prev.growthMeterFill = undefined;
        }
      });
      appleState.extraPlants = nextExtraPlants;
      appleState.extraSeeds = dedupeExtraSeedsPreferInventory(
        pruneGroundExtraSeedsShadowedByPlants(appleState.extraSeeds, appleState.extraPlants)
      );
      if (usesWorldLooseSeedMode()) {
        sanitizeWorldLooseModeExtraSeeds();
      }
      const snapRefPlants =
        (Number(snapshot.savedAt) > 0 ? Number(snapshot.savedAt) : 0) ||
        (snapshotSavedAt > 0 ? snapshotSavedAt : 0);
      const extraPlantClockNow = getSynchronizedNow();
      appleState.extraPlants.forEach(function (ep) {
        if (!ep) return;
        if (snapRefPlants > 0) {
          rebasePlantModelTimestampsToLocalNow(ep, extraPlantClockNow, snapRefPlants);
        }
        stabilizeFirstWaterHintFlags(ep);
        sanitizeSharedPlantHydrationAfterRemoteSnapshot(ep, extraPlantClockNow, getExtraDryDelayMs);
        normalizePlantSproutFieldsWhenSoilDry(ep);
      });
      const now = syncedNow;
      Object.keys(localApplePickedAtById).forEach(function (appleId) {
        const pickedAt = Number(localApplePickedAtById[appleId] || 0);
        if (!pickedAt || now - pickedAt >= appleRespawnMs) return;
        if (!appleState.pickedIds.includes(appleId)) {
          appleState.pickedIds.push(appleId);
        }
        if (!appleState.lastSpawnAt || appleState.lastSpawnAt < pickedAt) {
          appleState.lastSpawnAt = pickedAt;
        }
      });
      if (snapshotSavedAt) {
        lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, snapshotSavedAt);
      }
    }

    // Always merge butterfly membership from other clients' saves. A timestamp
    // guard would drop removals because the authority bumps lastButterflyStateChangeAt
    // every movement broadcast while non-authority catches use an older savedAt.
    if (snapshot.butterflies) {
      applyButterflySnapshot(snapshot.butterflies);
      if (snapshotSavedAt) {
        lastButterflyStateChangeAt = Math.max(
          lastButterflyStateChangeAt,
          snapshotSavedAt
        );
      }
    }

    refreshUiAfterSharedWorldApply();
  } finally {
    isApplyingWorldState = false;
  }
}

function ensureSharedPlantVisuals() {
  if (plantRuntime.isSeedPlanted) {
    plantSpot.src = getPlantSoilSrc(plantRuntime);
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    const mainRot = plantRuntime.status === "rotten" || plantRuntime.isOverwatered;
    plantSpot.style.display =
      mainRot || !shouldHideSeparateSoilUnderBigGrass(plantRuntime) ? "block" : "none";
  }

  appleState.extraPlants.forEach(function (plant) {
    ensureExtraPlantElements(plant);
    plant.spotElement.src = getPlantSoilSrc(plant);
    setWorldPosition(plant.spotElement, plant.x, plant.y);
    plant.spotElement.style.display = shouldHideSeparateSoilUnderBigGrass(plant) ? "none" : "block";
  });
}

function refreshSharedWaterIndicators() {
  if (plantRuntime.isSeedPlanted && shouldShowFirstWaterNeededDroplet(plantRuntime)) {
    waterNeeded.style.display = "block";
    setWorldPosition(
      waterNeeded,
      plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
      plantRuntime.spotY - WATER_NEEDED_SIZE - 2
    );
  } else {
    waterNeeded.style.display = "none";
  }

  appleState.extraPlants.forEach(function (plant) {
    if (!plant.waterNeededElement) return;
    if (shouldShowFirstWaterNeededDroplet(plant)) {
      plant.waterNeededElement.style.display = "block";
      setWorldPosition(
        plant.waterNeededElement,
        plant.x + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
        plant.y - WATER_NEEDED_SIZE - 2
      );
    } else {
      plant.waterNeededElement.style.display = "none";
    }
  });
}

function isWorldServerSyncAvailable() {
  return Boolean(
    window.OVCOnline &&
    typeof window.OVCOnline.saveWorldState === "function" &&
    typeof window.OVCOnline.loadWorldState === "function" &&
    window.OVCOnline.isConfigured &&
    window.OVCOnline.isConfigured()
  );
}

/** Shared row is authoritative; passive local ticks must not push over others' saves. */
function isSharedWorldMergeActive() {
  return isWorldServerSyncAvailable() && hasHydratedSharedWorldFromServer;
}

function syncWorldState(forceSave) {
  const now = Date.now();
  if (isTabSessionSuperseded || isReloadingForWorldReset) return;
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (
    isWorldSyncing ||
    !window.OVCOnline ||
    typeof window.OVCOnline.saveWorldState !== "function"
  ) {
    return;
  }
  if (!forceSave && !isWorldDirty) return;
  if (!forceSave && !hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
    return;
  }

  isWorldSyncing = true;
  isWorldDirty = false;
  lastWorldSaveAt = now;
  window.OVCOnline.saveWorldState(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    getSharedWorldSnapshot()
  ).then(function (row) {
    applyServerWorldRowTimestamps(row);
  }).catch(function (error) {
    addNetworkDebugLog(
      "world save error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
    );
    isWorldDirty = true;
  }).finally(function () {
    isWorldSyncing = false;
  });
}

function saveSharedWorldAndReload(options) {
  options = options || {};
  const reloadUrl = options.reloadUrl || "";
  if (!window.OVCOnline || typeof window.OVCOnline.saveWorldState !== "function") {
    setTimeout(function () {
      if (reloadUrl) window.location.replace(reloadUrl);
      else window.location.reload();
    }, 400);
    return;
  }

  isWorldSyncing = true;
  isWorldDirty = false;
  lastWorldSaveAt = Date.now();
  const saveResetSnapshot = function () {
    return window.OVCOnline.saveWorldState(
      window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
      getSharedWorldSnapshot()
    );
  };
  saveResetSnapshot().then(function (row) {
    applyServerWorldRowTimestamps(row);
    return new Promise(function (resolve) {
      setTimeout(resolve, 350);
    });
  }).then(function () {
    return saveResetSnapshot();
  }).then(function (row) {
    applyServerWorldRowTimestamps(row);
  }).catch(function (error) {
    addNetworkDebugLog(
      "world reset save error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
    );
  }).finally(function () {
    isWorldSyncing = false;
    isReloadingForWorldReset = true;
    if (reloadUrl) window.location.replace(reloadUrl);
    else window.location.reload();
  });
}

function pollWorldState(forcePoll) {
  const now = Date.now();
  if (
    isWorldPolling ||
    isReloadingForWorldReset ||
    isTabSessionSuperseded ||
    isSharedWorldSyncPausedForTutorial() ||
    !window.OVCOnline ||
    typeof window.OVCOnline.loadWorldState !== "function" ||
    (!forcePoll && now - lastWorldPollAt < getMultiplayerWorldPollMinMs())
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
    applySharedWorldSnapshot(row.state, row.updated_at);
  }).catch(function (error) {
    addNetworkDebugLog(
      "world poll error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
    );
  }).finally(function () {
    isWorldPolling = false;
    if (isWorldServerSyncAvailable()) {
      hasHydratedSharedWorldFromServer = true;
    }
  });
}

function dropHeldItem() {
  if (isOnboardingLinearGateActive()) {
    if (heldItem === HELD_ITEM_BUCKET && onboardingFlowStep !== 17) {
      flashOnboardingOrderHint("");
      return;
    }
    if (heldItem === HELD_ITEM_SEED && onboardingFlowStep !== 7) {
      flashOnboardingOrderHint("");
      return;
    }
    if (isHeldExtraSeed(heldItem) && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      return;
    }
  }

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

  if (usesWorldLooseSeedMode()) {
    const seedIndex = appleState.extraSeeds.indexOf(extraSeed);
    if (seedIndex >= 0) {
      appleState.extraSeeds.splice(seedIndex, 1);
    }
    appleState.seedCount = Math.min(500, appleState.seedCount + 1);
    heldItem = null;
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    return;
  }

  const playerBox = getPlayerBox();
  extraSeed.x = playerBox.left + playerBox.width / 2 - SEED_SIZE / 2;
  extraSeed.y = playerBox.bottom - SEED_SIZE;
  extraSeed.inInventory = false;
  assignExtraSeedInventoryOwner(extraSeed);
  heldItem = null;
  saveAppleState();
}

function dropBucket() {
  const playerBox = getPlayerBox();
  const bucketSize = getBucketSize();

  bucketX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
  bucketY = playerBox.bottom - bucketSize.height;
  heldItem = null;
  window.OVC_SHARED_BUCKET_HELD_BY = "";
  broadcastBucketState(true);
  saveBucketState();
  syncWorldState(true);
  onboardingHookDroppedBucketForTutorial();
}

function onboardingShouldKeepWorldMainSeedVisible() {
  if (getStoredFlag(onboardingFlowDoneKey)) return false;
  if (onboardingFlowStep < 1 || onboardingFlowStep > 6) return false;
  if (hasPickedMainSeedInCurrentRoom()) return false;
  if (plantRuntime.isPlanting) return false;
  return true;
}

function updateSeedPosition() {
  updateSeedDryState();
  recoverWorldMainSeedIfOnboardingStuck();
  if (!plantRuntime.isSeedPlanted && !plantRuntime.isPlanting) {
    if (
      hasHandledDryMainSeed &&
      !plantRuntime.isSeedDry &&
      !hasPickedMainSeedInCurrentRoom() &&
      !hasTutorialStarterSeedInPlay() &&
      heldItem !== HELD_ITEM_SEED
    ) {
      hasHandledDryMainSeed = false;
      setStoredFlag(mainDrySeedHandledKey, false);
      dryMainSeedVisibleSince = 0;
    }
  }
  const now = Date.now();
  const baseShouldShowMainSeedOnGround =
    onboardingShouldKeepWorldMainSeedVisible() ||
    (!hasPickedMainSeedInCurrentRoom() &&
      !plantRuntime.isPlanting &&
      !(plantRuntime.isSeedDry && hasHandledDryMainSeed));
  const tutorialDecorMainSeedOnGround =
    !usesWorldLooseSeedMode() &&
    !getStoredFlag(onboardingFlowDoneKey) &&
    onboardingFlowStep >= 7 &&
    !plantRuntime.isSeedPlanted &&
    heldItem !== HELD_ITEM_SEED;
  const shouldShowMainSeedOnGround =
    !usesWorldLooseSeedMode() &&
    (baseShouldShowMainSeedOnGround || tutorialDecorMainSeedOnGround);
  // Auto-clear dry main seed after grace period even when the world sprite is hidden
  // (e.g. room already marked main-seed picked) so shared state and UI stay consistent.
  if (plantRuntime.isSeedDry && !hasHandledDryMainSeed && heldItem !== HELD_ITEM_SEED) {
    if (!dryMainSeedVisibleSince) {
      dryMainSeedVisibleSince = now;
    } else if (now - dryMainSeedVisibleSince >= 20000) {
      hasHandledDryMainSeed = true;
      isMainSeedAvailable = false;
      lastMainSeedStateChangeAt = now;
      setStoredFlag(mainDrySeedHandledKey, true);
      setMainSeedPickedForCurrentRoom();
      dryMainSeedVisibleSince = 0;
      markWorldDirty();
      syncWorldState(true);
      scheduleTutorialMainSeedRespawnFromGround();
    }
  } else if (!plantRuntime.isSeedDry || hasHandledDryMainSeed) {
    dryMainSeedVisibleSince = 0;
  }
  // Main seed is a fixed world object (next to the book), not a roaming synced item.
  // 월드 느슨 씨 모드: 땅 씨앗은 worldLooseSeed 한 개만 — 튜토용 #seed는 숨김(손에 든 경우만 표시).
  if (shouldShowMainSeedOnGround && heldItem !== HELD_ITEM_SEED) {
    seedX = SEED_START_X;
    seedY = SEED_START_Y;
  }
  const showMainSeedSprite =
    shouldShowMainSeedOnGround || heldItem === HELD_ITEM_SEED;
  seed.style.display = showMainSeedSprite ? "block" : "none";
  if (!showMainSeedSprite) {
    isHoveringMainSeed = false;
  }
  seed.src = plantRuntime.isSeedDry ? "이미지/seed-dry.png" : "이미지/seed.png";

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

/**
 * 지정 땅 씨 슬롯(WORLD_LOOSE_SEED_* = SEED_START)에 겹친 extraSeeds 땅 스프라이트는 숨김.
 * 튜토 #seed·월드 느슨 img와 legacy 슬롯이 동시에 보이는 경우 방지.
 */
function shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed) {
  if (
    !extraSeed ||
    extraSeed.planted ||
    extraSeed.inInventory ||
    heldItem === createHeldExtraSeed(extraSeed.id)
  ) {
    return false;
  }
  const tol = 14;
  return (
    Math.abs(extraSeed.x - WORLD_LOOSE_SEED_X) <= tol &&
    Math.abs(extraSeed.y - WORLD_LOOSE_SEED_Y) <= tol
  );
}

function updateExtraSeedsAndPlants() {
  const now = Date.now();
  let didAutoRemoveDryExtraSeed = false;

  if (isTutorialDocumentEntry() && worldLooseSeedElement) {
    worldLooseSeedElement.remove();
    worldLooseSeedElement = null;
  }

  if (usesWorldLooseSeedMode() && isHeldExtraSeed(heldItem) && !getHeldExtraSeed()) {
    heldItem = null;
  }

  if (usesWorldLooseSeedMode()) {
    ensureWorldLooseSeedShape();
    if (!worldLooseSeedElement) {
      worldLooseSeedElement = document.createElement("img");
      worldLooseSeedElement.className = "extra-seed world-loose-seed";
      worldLooseSeedElement.alt = "world loose seed";
      worldLooseSeedElement.src = "이미지/seed.png";
      setWorldSize(worldLooseSeedElement, SEED_SIZE, SEED_SIZE);
      ground.appendChild(worldLooseSeedElement);
    }
    const vis = isWorldLooseSeedVisibleAt(now);
    if (vis) {
      if (worldLooseSeedElement.style.display !== "block") {
        worldLooseSeedElement.style.display = "block";
      }
      setWorldPosition(
        worldLooseSeedElement,
        appleState.worldLooseSeed.x,
        appleState.worldLooseSeed.y
      );
    } else if (worldLooseSeedElement.style.display !== "none") {
      worldLooseSeedElement.style.display = "none";
    }
  } else if (worldLooseSeedElement) {
    worldLooseSeedElement.remove();
    worldLooseSeedElement = null;
  }

  if (usesWorldLooseSeedMode()) {
    const heldExtraId = getHeldExtraSeedId(heldItem);
    const beforeStrip = appleState.extraSeeds.length;
    appleState.extraSeeds = appleState.extraSeeds.filter(function (s) {
      if (!s) return false;
      if (s.planted) return true;
      if (s.inInventory) return true;
      if (plantingInventorySeedId && String(s.id) === String(plantingInventorySeedId)) {
        return true;
      }
      if (heldExtraId && String(s.id) === String(heldExtraId)) {
        return true;
      }
      return false;
    });
    if (sanitizeWorldLooseModeExtraSeeds()) {
      saveAppleState();
    } else if (appleState.extraSeeds.length !== beforeStrip) {
      saveAppleState();
    }
  }

  appleState.extraSeeds = appleState.extraSeeds.filter(function (extraSeed) {
    const createdAt = Number(extraSeed.createdAt);
    const shouldAutoRemoveDrySeed =
      !isMainGameTutorialInProgress() &&
      Number.isFinite(createdAt) &&
      !extraSeed.inInventory &&
      !extraSeed.planted &&
      isExtraSeedDry(extraSeed, now) &&
      now - createdAt >= seedDryMs + 20000;
    if (!shouldAutoRemoveDrySeed) return true;
    if (extraSeed.element) extraSeed.element.remove();
    if (extraSeed.inventoryElement) extraSeed.inventoryElement.remove();
    if (heldItem === createHeldExtraSeed(extraSeed.id)) {
      heldItem = null;
    }
    didAutoRemoveDryExtraSeed = true;
    return false;
  });

  appleState.extraSeeds.forEach(function (extraSeed) {
    ensureExtraSeedElement(extraSeed);
    const isDry = isExtraSeedDry(extraSeed, now);
    extraSeed.element.src = isDry ? "이미지/seed-dry.png" : "이미지/seed.png";
    const hideGroundOverlap = shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed);
    extraSeed.element.style.display =
      extraSeed.planted || extraSeed.inInventory || hideGroundOverlap ? "none" : "block";

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

  if (didAutoRemoveDryExtraSeed) {
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }

  updateSeedInventory();

  let didRemoveDrySoilExtraPlant = false;
  appleState.extraPlants.forEach(function (plant) {
    ensureExtraPlantElements(plant);
    normalizeExtraPlantState(plant);
    updateExtraPlantState(plant, now);
    if (
      plant.status === "dry" &&
      plant.drySoilAt != null &&
      Number.isFinite(Number(plant.drySoilAt)) &&
      now - Number(plant.drySoilAt) >= plantDrySoilClearMs
    ) {
      plant.removed = true;
      didRemoveDrySoilExtraPlant = true;
    } else if (
      (plant.status === "rotten" || plant.isOverwatered) &&
      plant.rottenAt != null &&
      Number.isFinite(Number(plant.rottenAt)) &&
      now - Number(plant.rottenAt) >= plantRotClearMs
    ) {
      plant.removed = true;
      didRemoveDrySoilExtraPlant = true;
    }
    if (plant.isSproutGrown && !plant.isSproutSelfSustaining) {
      tickSproutEvolution(plant, now);
    }
    plant.spotElement.src = getPlantSoilSrc(plant);
    setWorldPosition(plant.spotElement, plant.x, plant.y);
    plant.spotElement.style.display = shouldHideSeparateSoilUnderBigGrass(plant) ? "none" : "block";
    updatePlantGrowthMeter(
      plant.growthMeterElement,
      plant.growthMeterFill,
      plant.x,
      plant.y,
      getPlantGrowthRatio(plant, now),
      getPlantSecondGrowthRatio(plant, now)
    );

    const isSproutGrown =
      plant.isSproutGrown && plant.status !== "rotten" && plant.status !== "dry";
    const stage = getSproutStageFromPlant(plant);
    const sproutSize = getSproutSizeForStage(stage);
    plant.sproutElement.style.display = isSproutGrown ? "block" : "none";
    plant.sproutElement.classList.toggle("is-big", stage >= 2);
    plant.waterNeededElement.style.display = shouldShowFirstWaterNeededDroplet(plant) ? "block" : "none";
    if (plant.waterNeededElement.style.display === "block") {
      setWorldPosition(
        plant.waterNeededElement,
        plant.x + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
        plant.y - WATER_NEEDED_SIZE - 2
      );
    }
    if (!isSproutGrown) return;
    plant.sproutElement.src = getSproutImageForStage(stage);
    setWorldSize(plant.sproutElement, sproutSize.width, sproutSize.height);
    const sproutPos = getSproutWorldPositionForPlant(plant.x, plant.y, sproutSize, stage);
    setWorldPosition(plant.sproutElement, sproutPos.x, sproutPos.y);
  });
  if (didRemoveDrySoilExtraPlant) {
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }
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

/** 저장·스냅샷의 성장 ms가 현재 constants와 다르면 맞춤(예: 가루 2분→3초로 바꾼 뒤에도 옛 duration이 남는 경우) */
function clampPlantGrowthTimingToCurrentConstants(plant) {
  if (!plant) return;
  const evCap = sproutStage1Ms + sproutStage2GrowMs;
  if (plant.isSproutGrown && !plant.isSproutSelfSustaining) {
    const ev = Number(plant.sproutEvolutionMs) || 0;
    if (ev > evCap) {
      plant.sproutEvolutionMs = evCap;
    }
  }
  const tgt = Number(plant.powderUpgradeTargetTier) || 0;
  const dur = Number(plant.powderUpgradeDurationMs) || 0;
  const started = Number(plant.powderUpgradeStartedAt) || 0;
  if (tgt > 0 && dur > 0 && started > 0) {
    const expected = tgt === 4 ? level4GrowMs : tgt === 5 ? level5GrowMs : 0;
    if (expected > 0 && dur !== expected) {
      plant.powderUpgradeDurationMs = expected;
    }
  }
}

function normalizeExtraPlantState(plant) {
  const now = Date.now();
  if (!plant.status) plant.status = "normal";
  if (!Array.isArray(plant.wateredAtList)) plant.wateredAtList = [];
  plant.waterLevel = readWaterLevel(plant.waterLevel, 1);
  if (!plant.waterLevelUpdatedAt) plant.waterLevelUpdatedAt = plant.plantedAt || now;
  if (typeof plant.needsFirstWater !== "boolean") {
    plant.needsFirstWater = !plant.growthStartedAt;
  }
  if (typeof plant.isOverwatered !== "boolean") plant.isOverwatered = false;
  if (!Number.isFinite(plant.rottenAt)) plant.rottenAt = null;
  if (typeof plant.isSproutGrown !== "boolean") plant.isSproutGrown = false;
  if (typeof plant.isSproutSelfSustaining !== "boolean") plant.isSproutSelfSustaining = false;
  if (!Number.isFinite(plant.growthTier)) plant.growthTier = 0;
  if (!Number.isFinite(plant.waterCapacity)) plant.waterCapacity = 2;
  if (!Number.isFinite(plant.powderUpgradeTargetTier)) plant.powderUpgradeTargetTier = 0;
  if (!Number.isFinite(plant.powderUpgradeDurationMs)) plant.powderUpgradeDurationMs = 0;
  if (!Number.isFinite(plant.powderUpgradeStartedAt)) plant.powderUpgradeStartedAt = null;
  if (plant.sproutEvolutionLastTickAt != null && !Number.isFinite(plant.sproutEvolutionLastTickAt)) {
    plant.sproutEvolutionLastTickAt = null;
  }

  const hadEvolutionKey = Object.prototype.hasOwnProperty.call(plant, "sproutEvolutionMs");
  if (
    !hadEvolutionKey &&
    plant.isSproutGrown &&
    plant.sproutGrownAt &&
    !plant.isSproutSelfSustaining
  ) {
    const elapsed = now - plant.sproutGrownAt;
    if (elapsed >= biggerSproutMs) {
      plant.isSproutSelfSustaining = true;
      plant.sproutEvolutionMs = sproutStage1Ms + sproutStage2GrowMs;
    } else if (elapsed > 0) {
      plant.sproutEvolutionMs = Math.floor(
        (elapsed / biggerSproutMs) * (sproutStage1Ms + sproutStage2GrowMs - 1)
      );
    } else {
      plant.sproutEvolutionMs = 0;
    }
  } else if (typeof plant.sproutEvolutionMs !== "number") {
    plant.sproutEvolutionMs = 0;
  } else {
    plant.sproutEvolutionMs = Math.max(0, plant.sproutEvolutionMs);
  }

  if (plant.status === "rotten" || plant.isOverwatered) {
    plant.status = "rotten";
    if (!plant.rottenAt) plant.rottenAt = now;
    plant.growthStartedAt = null;
    plant.isSproutGrown = false;
    plant.sproutGrownAt = null;
    plant.sproutEvolutionMs = 0;
    plant.sproutEvolutionLastTickAt = null;
    plant.isSproutSelfSustaining = false;
    plant.needsFirstWater = false;
    plant.grassAuto5EligibleAt = null;
    plant.blockSproutRegrowthAfterDry = false;
    plant.drySoilAt = null;
  }
  if (plant.isSproutSelfSustaining && plant.growthTier < 3) {
    plant.growthTier = 3;
  }
  plant.waterCapacity = plant.growthTier >= 3 ? 3 : 2;
  migrateLegacyPowderTier5ToAutoGrass(plant, now);
  ensureGrassOrdinalIfNeeded(plant);
  clampPlantGrowthTimingToCurrentConstants(plant);
}

function updateExtraPlantState(plant, now) {
  updateExtraPlantWaterLevel(plant, now);
  ensureGrassAuto5EligibleForTier4Plant(plant, now);
  if (tickPowderUpgrade(plant, now)) {
    saveAppleState();
    syncWorldState(true);
  }
  if (tickGrassAutoAdvanceToTier5(plant, now)) {
    saveAppleState();
    syncWorldState(true);
  }

  if (plant.status === "rotten") {
    return;
  }

  if (plant.status === "dry") {
    normalizePlantSproutFieldsWhenSoilDry(plant);
    plant.blockSproutRegrowthAfterDry = true;
    if (plant.drySoilAt == null || !Number.isFinite(Number(plant.drySoilAt))) {
      plant.drySoilAt = now;
    }
    return;
  }

  if (
    canPlantWiltFromEmptyWater(plant, now) &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    plant.becameEmptyAt !== null &&
    now - plant.becameEmptyAt >= getExtraDryDelayMs(plant, now)
  ) {
    plant.status = "dry";
    plant.needsFirstWater = true;
    plant.blockSproutRegrowthAfterDry = true;
    plant.drySoilAt = now;
    cancelPlantPowderUpgrade(plant);
    plant.isSproutGrown = false;
    plant.sproutGrownAt = null;
    plant.growthStartedAt = null;
    plant.sproutEvolutionMs = 0;
    plant.sproutEvolutionLastTickAt = null;
    plant.isSproutSelfSustaining = false;
    return;
  }

  if (
    plant.growthStartedAt !== null &&
    plant.status !== "dry" &&
    plant.status !== "rotten" &&
    !plant.isOverwatered &&
    !plant.isSproutGrown &&
    now - plant.growthStartedAt >= getPlantFirstGrowthDurationMs(plant)
  ) {
    plant.isSproutGrown = true;
    plant.sproutGrownAt = now;
    plant.sproutEvolutionMs = 0;
    plant.sproutEvolutionLastTickAt = now;
    plant.isSproutSelfSustaining = false;
  }
}

function getSproutStageFromPlant(plant) {
  if (!plant || !plant.isSproutGrown) return 0;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 5) return 5;
  if (tier >= 4) return 4;
  if (plant.isSproutSelfSustaining) return 3;
  const ev = plant.sproutEvolutionMs || 0;
  if (ev < sproutStage1Ms) return 1;
  return 2;
}

function getPlantWaterCapacity(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 3) return 3;
  return Math.max(2, Number(plant.waterCapacity) || 2);
}

function isPowderUpgradeInProgress(plant) {
  return (
    Number(plant.powderUpgradeTargetTier) > 0 &&
    Number(plant.powderUpgradeDurationMs) > 0 &&
    Number(plant.powderUpgradeStartedAt) > 0
  );
}

/**
 * 심은 직후 스냅샷은 needsFirstWater가 false인데 첫 Q 물을 아직 안 준 상태일 수 있음.
 * wateredAtList가 [growthStartedAt] 한 번뿐이면 "첫 물 필요"로 본다.
 */
function stabilizeFirstWaterHintFlags(plant) {
  if (!plant || plant.status === "rotten" || plant.status === "dry") return;
  if (!Array.isArray(plant.wateredAtList)) plant.wateredAtList = [];
  const gs = Number(plant.growthStartedAt) || 0;
  if (
    gs > 0 &&
    plant.status === "normal" &&
    (Number(plant.waterLevel) || 0) > 0 &&
    plant.wateredAtList.length === 0
  ) {
    const fill = Number(plant.lastWateredAt) || gs;
    plant.wateredAtList = [fill];
  }
  const wl = plant.wateredAtList;
  if (
    gs > 0 &&
    plant.status === "normal" &&
    (Number(plant.waterLevel) || 0) > 0 &&
    wl.length === 1 &&
    Math.abs(Number(wl[0]) - gs) < 20000
  ) {
    plant.needsFirstWater = false;
  }
}

function isPlantAwaitingPlayerFirstPour(plant) {
  if (!plant) return false;
  if (plant.status !== "normal" || plant.isOverwatered) return false;
  if (plant.isSproutGrown) return false;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 0) return false;
  const gs = Number(plant.growthStartedAt) || 0;
  if (gs <= 0) return false;
  const wl = plant.wateredAtList;
  if (!Array.isArray(wl) || wl.length !== 1) return false;
  return Math.abs(Number(wl[0]) - gs) < 20000;
}

/** 4·5단 풀에서는 첫 물 물방울 UI 숨김(스프라이트 정중앙에 겹쳐 보이던 문제) */
function shouldShowFirstWaterNeededDroplet(plant) {
  if (!plant) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  if (isPowderUpgradeInProgress(plant)) return false;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 4) return false;
  if (plant.isSproutGrown && getSproutStageFromPlant(plant) >= 4) return false;
  if (plant.needsFirstWater) return true;
  return isPlantAwaitingPlayerFirstPour(plant);
}

function getPowderUpgradeRatio(plant, now) {
  if (!isPowderUpgradeInProgress(plant)) return null;
  const startedAt = Number(plant.powderUpgradeStartedAt) || 0;
  const duration = Number(plant.powderUpgradeDurationMs) || 0;
  if (!startedAt || !duration) return null;
  return Math.min(1, Math.max(0, (now - startedAt) / duration));
}

function isHighTierPlantCare(plant) {
  return (
    isPowderUpgradeInProgress(plant) ||
    Math.max(0, Number(plant.growthTier) || 0) >= 4
  );
}

function canPlantWiltFromEmptyWater(plant, now) {
  const tNow = now != null ? now : Date.now();
  if (isTutorialDocumentEntry() && Math.max(0, Number(plant && plant.growthTier) || 0) === 0) {
    return false;
  }
  if (isSproutStage3Or5IdleNoGrowth(plant, tNow)) return false;
  return !plant.isSproutSelfSustaining || isHighTierPlantCare(plant);
}

function getMainDryAfterEmptyMsForPlant(plant, now) {
  const tNow = now != null ? now : Date.now();
  if (!canPlantWiltFromEmptyWater(plant, tNow)) return mainPlantDryAfterEmptyMs;
  if (isPowderUpgradeInProgress(plant)) return mainPlantDryAfterPowderMs;
  return getPlantDryAfterEmptyMsForPlantPhase(plant);
}

function getExtraDryDelayMs(plant, now) {
  const tNow = now != null ? now : Date.now();
  if (!canPlantWiltFromEmptyWater(plant, tNow)) return plantDryMs;
  if (isPowderUpgradeInProgress(plant)) return plantDryMsDuringPowderMs;
  return getPlantDryAfterEmptyMsForPlantPhase(plant);
}

function cancelPlantPowderUpgrade(plant) {
  if (!plant) return;
  plant.powderUpgradeTargetTier = 0;
  plant.powderUpgradeStartedAt = null;
  plant.powderUpgradeDurationMs = 0;
}

/** 마른 땅인데 싹/성장 타임스탬프가 남으면 물 주기·폴링 직후 잠깐 자라는 것처럼 보일 수 있음 */
function normalizePlantSproutFieldsWhenSoilDry(plant) {
  if (!plant || plant.status !== "dry") return;
  cancelPlantPowderUpgrade(plant);
  plant.isSproutGrown = false;
  plant.sproutGrownAt = null;
  plant.growthStartedAt = null;
  plant.sproutEvolutionMs = 0;
  plant.sproutEvolutionLastTickAt = null;
  plant.isSproutSelfSustaining = false;
}

function tickPowderUpgrade(plant, now) {
  if (!isPowderUpgradeInProgress(plant)) return false;
  if (plant.status === "dry" || plant.status === "rotten") {
    cancelPlantPowderUpgrade(plant);
    return false;
  }
  const ratio = getPowderUpgradeRatio(plant, now);
  if (ratio === null || ratio < 1) return false;
  plant.growthTier = Math.max(plant.growthTier || 0, Number(plant.powderUpgradeTargetTier) || 0);
  plant.powderUpgradeTargetTier = 0;
  plant.powderUpgradeStartedAt = null;
  plant.powderUpgradeDurationMs = 0;
  if (plant.growthTier >= 3) {
    plant.waterCapacity = 3;
    plant.waterLevel = Math.min(3, Math.max(1, Number(plant.waterLevel) || 1));
  }
  if (Math.max(0, Number(plant.growthTier) || 0) === 4) {
    plant.grassAuto5EligibleAt = now;
  } else {
    plant.grassAuto5EligibleAt = null;
  }
  return true;
}

/** 4단 풀 생존 시 가루 없이 level5GrowMs 후 자동 5단 (가루는 3→4만) */
function tickGrassAutoAdvanceToTier5(plant, now) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 4) {
    plant.grassAuto5EligibleAt = null;
    return false;
  }
  if (isPowderUpgradeInProgress(plant)) return false;
  if (!plant.isSproutGrown || plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) {
    plant.grassAuto5EligibleAt = null;
    return false;
  }
  let t0 = plant.grassAuto5EligibleAt;
  if (t0 == null || !Number.isFinite(Number(t0))) {
    plant.grassAuto5EligibleAt = now;
    return false;
  }
  if (now - Number(t0) < level5GrowMs) return false;
  if ((Number(plant.waterLevel) || 0) <= 0) return false;
  plant.growthTier = 5;
  plant.grassAuto5EligibleAt = null;
  plant.becameEmptyAt = null;
  return true;
}

/** 구세이브: 가루 4→5 제거 — 진행 중이면 자동 5단 타이머로 이관 */
function migrateLegacyPowderTier5ToAutoGrass(plant, now) {
  const tgt = Number(plant.powderUpgradeTargetTier) || 0;
  if (tgt !== 5) return;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  const started = Number(plant.powderUpgradeStartedAt) || null;
  plant.powderUpgradeTargetTier = 0;
  plant.powderUpgradeStartedAt = null;
  plant.powderUpgradeDurationMs = 0;
  if (
    tier === 4 &&
    plant.grassAuto5EligibleAt == null &&
    plant.isSproutGrown &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered
  ) {
    plant.grassAuto5EligibleAt = started != null && Number.isFinite(started) ? started : now;
  }
}

/** 티어 4·생존·가루 진행 없음이면 자동 5단 타이머 시작(또는 유지) */
function ensureGrassAuto5EligibleForTier4Plant(plant, now) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 4) {
    plant.grassAuto5EligibleAt = null;
    return;
  }
  if (isPowderUpgradeInProgress(plant)) return;
  if (!plant.isSproutGrown || plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) {
    plant.grassAuto5EligibleAt = null;
    return;
  }
  if (plant.grassAuto5EligibleAt == null || !Number.isFinite(Number(plant.grassAuto5EligibleAt))) {
    plant.grassAuto5EligibleAt = now;
  }
}

function groundClientToWorldXY(clientX, clientY) {
  if (!ground) return null;
  const r = ground.getBoundingClientRect();
  const w = r.width || 1;
  const h = r.height || 1;
  if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
  return {
    x: ((clientX - r.left) / w) * WORLD_WIDTH,
    y: ((clientY - r.top) / h) * GROUND_WORLD_HEIGHT
  };
}

function isWorldPointInsideRect(x, y, rect) {
  return isWorldPointInsideRectCore(x, y, rect);
}

/** 현재 보이는 식물 스프라이트(흙/새싹/풀)의 월드 박스 목록 */
function getPlantVisibleHoverRectsWorld(plant) {
  return getPlantVisibleHoverRectsWorldCore(plant, {
    shouldHideSoil: shouldHideSeparateSoilUnderBigGrass,
    plantSpotWidth: PLANT_SPOT_WIDTH,
    plantSpotHeight: PLANT_SPOT_HEIGHT,
    getSproutStageFromPlant: getSproutStageFromPlant,
    getSproutSizeForStage: getSproutSizeForStage,
    getSproutWorldPositionForPlant: getSproutWorldPositionForPlant
  });
}

/** 포인터가 현재 식물 이미지 영역 안에 있을 때만 선택(겹침 시 중심거리 가까운 쪽) */
function pickPlantForHoverFromPointerClient(clientX, clientY) {
  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return null;
  let best = null;
  let bestD = Infinity;
  function consider(plant) {
    if (!plant) return;
    const rects = getPlantVisibleHoverRectsWorld(plant);
    for (let i = 0; i < rects.length; i += 1) {
      const rect = rects[i];
      if (!isWorldPointInsideRect(pxy.x, pxy.y, rect)) continue;
      const cx = (rect.left + rect.right) / 2;
      const cy = (rect.top + rect.bottom) / 2;
      const d = Math.hypot(pxy.x - cx, pxy.y - cy);
      if (d < bestD) {
        bestD = d;
        best = plant;
      }
    }
  }
  if (plantRuntime.isSeedPlanted) consider(plantRuntime);
  for (let i = 0; i < appleState.extraPlants.length; i++) {
    consider(appleState.extraPlants[i]);
  }
  return best;
}

function seedInventoryHasPlantableSeedsForHoverHint() {
  if (usesWorldLooseSeedMode()) {
    return appleState.seedCount > 0;
  }
  return appleState.extraSeeds.some(function (extraSeed) {
    return (
      extraSeed.inInventory &&
      !extraSeed.planted &&
      extraSeed.id !== plantingInventorySeedId
    );
  });
}

function syncPlantHoverFromPointerClient(clientX, clientY) {
  if (!plantHoverLabel) return;

  if (seedInventory && seedInventory.style.display !== "none") {
    const sr = seedInventory.getBoundingClientRect();
    const pad = 16;
    const overInv =
      clientX >= sr.left - pad &&
      clientX <= sr.right + pad &&
      clientY >= sr.top - pad &&
      clientY <= sr.bottom + pad;
    if (overInv) {
      const panel = document.getElementById("seed-count-panel");
      const panelOk = !panel || !panel.hidden;
      if (panelOk && seedInventoryHasPlantableSeedsForHoverHint()) {
        seedInventory.classList.add("is-seed-inventory-hover-hint");
        if (plantHoverLabel) {
          plantHoverLabel.classList.remove("is-seed-inventory-hint");
          plantHoverLabel.style.display = "none";
        }
      } else {
        seedInventory.classList.remove("is-seed-inventory-hover-hint");
        hidePlantHoverLabel();
      }
      return;
    }
  }

  if (seedInventory) seedInventory.classList.remove("is-seed-inventory-hover-hint");

  const plant = pickPlantForHoverFromPointerClient(clientX, clientY);
  if (plant) showPlantHoverForPlant(plant);
  else hidePlantHoverLabel();
}

function tickSproutEvolution(plant, now) {
  if (!plant.isSproutGrown || plant.isSproutSelfSustaining) return;
  if (plant.status !== "normal" || plant.isOverwatered) {
    plant.sproutEvolutionLastTickAt = now;
    return;
  }
  if (plant.sproutEvolutionLastTickAt == null) {
    plant.sproutEvolutionLastTickAt = plant.sproutGrownAt || now;
  }
  const last = plant.sproutEvolutionLastTickAt;
  const delta = Math.min(4000, Math.max(0, now - last));
  plant.sproutEvolutionMs = (plant.sproutEvolutionMs || 0) + delta;
  plant.sproutEvolutionLastTickAt = now;
  const cap = sproutStage1Ms + sproutStage2GrowMs;
  if (plant.sproutEvolutionMs >= cap) {
    plant.sproutEvolutionMs = cap;
    plant.isSproutSelfSustaining = true;
    plant.growthTier = Math.max(Number(plant.growthTier) || 0, 3);
    plant.waterCapacity = 3;
    plant.waterLevel = Math.min(3, Math.max(Number(plant.waterLevel) || 0, 2));
    plant.becameEmptyAt = null;
    plant.status = "normal";
  }
}

function getSproutImageForStage(stage) {
  if (stage >= 5) return sproutStage5Image;
  if (stage >= 4) return sproutStage4Image;
  if (stage >= 3) return sproutStage3Image;
  if (stage === 2) return sproutStage2Image;
  return sproutStage1Image;
}

function getSproutSizeForStage(stage) {
  const idx = Math.min(2, Math.max(0, Math.min(stage, 3) - 1));
  const growthScale =
    stage >= 5 ? grassStage5WorldScale : stage >= 4 ? grassStage4WorldScale : 1;
  const baseWidth = SPROUT_STAGE_WIDTHS[idx] || SPROUT_WIDTH;
  const baseHeight = SPROUT_STAGE_HEIGHTS[idx] || SPROUT_HEIGHT;
  return {
    width: Math.max(1, Math.round(baseWidth * growthScale)),
    height: Math.max(1, Math.round(baseHeight * growthScale))
  };
}

/** 4·5단계 풀 PNG에 심은 흙(별도 spot)이 겹쳐 보이면 spot 레이어를 끈다. */
function shouldHideSeparateSoilUnderBigGrass(plant) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) return false;
  return getSproutStageFromPlant(plant) >= 4;
}

/**
 * 풀 스프라이트 발밑을 심은 칸(plantBaseY ~ +PLANT_SPOT_HEIGHT)에 맞춘다.
 * 4·5단계는 PNG 하단 여백 때문에 world top-left 보정.
 */
function getSproutWorldPositionForPlant(plantBaseX, plantBaseY, sproutSize, stage) {
  let footInset = 7;
  let anchorDx = 0;
  if (stage >= 5) {
    footInset = 24;
    anchorDx = grassStage5AnchorDxWorld;
  } else if (stage >= 4) {
    footInset = 16;
  }
  return {
    x: plantBaseX + PLANT_SPOT_WIDTH / 2 - sproutSize.width / 2 + anchorDx,
    y: plantBaseY - sproutSize.height + footInset
  };
}

/** 호버 라벨: 흙 칸 중심이 아니라 실제 새싹/풀 스프라이트 기준(큰 풀에서 위치 어긋남 방지) */
function getPlantHoverAnchorWorld(plant) {
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const sproutVisible =
    plant.isSproutGrown && plant.status !== "rotten" && plant.status !== "dry" && !plant.isOverwatered;
  if (!sproutVisible) {
    return { cxWorld: px + PLANT_SPOT_WIDTH / 2, cyWorld: py + PLANT_SPOT_HEIGHT / 2 };
  }
  const st = getSproutStageFromPlant(plant);
  const sz = getSproutSizeForStage(st);
  const pos = getSproutWorldPositionForPlant(px, py, sz, st);
  return {
    cxWorld: pos.x + sz.width / 2,
    cyWorld: pos.y + Math.min(sz.height * 0.22, 10)
  };
}

function getPlantGrowthRatio(plant, now) {
  if (!plant.growthStartedAt || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return null;
  if (plant.isSproutGrown) return 1;
  return Math.min(1, Math.max(0, (now - plant.growthStartedAt) / getPlantFirstGrowthDurationMs(plant)));
}

/** 티어 4→5 자동 성장(가루 없음) 구간의 초록 게이지 비율; 해당 없으면 null */
function getGrassAutoTier5GrowthRatio(plant, now) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 4) return null;
  if (isPowderUpgradeInProgress(plant)) return null;
  if (!plant.isSproutGrown || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return null;
  }
  const t0 = plant.grassAuto5EligibleAt;
  if (t0 == null || !Number.isFinite(Number(t0))) return null;
  const elapsed = now - Number(t0);
  if (elapsed <= 0) return 0;
  return Math.min(1, elapsed / level5GrowMs);
}

function getPlantSecondGrowthRatio(plant, now) {
  const powderRatio = getPowderUpgradeRatio(plant, now);
  if (powderRatio !== null) return powderRatio;
  const grass5Ratio = getGrassAutoTier5GrowthRatio(plant, now);
  if (grass5Ratio !== null) return grass5Ratio;
  if (!plant.isSproutGrown || plant.status === "dry" || plant.status === "rotten") return null;
  if (plant.isSproutSelfSustaining) return null;
  const ev = plant.sproutEvolutionMs || 0;
  if (ev < sproutStage1Ms) {
    return Math.min(1, Math.max(0, ev / sproutStage1Ms));
  }
  return Math.min(1, Math.max(0, (ev - sproutStage1Ms) / sproutStage2GrowMs));
}

/** 씨→새싹 또는 새싹 단계 진행·가루 성장 등 월드 초록 게이지가 채워지는 중 */
function hasActiveGreenGrowthProgress(plant, now) {
  const g1 = getPlantGrowthRatio(plant, now);
  if (g1 !== null && g1 < 1) return true;
  const g2 = getPlantSecondGrowthRatio(plant, now);
  if (g2 !== null && g2 < 1) return true;
  return false;
}

/**
 * 3단계(완성 새싹)·5단계(완성 풀)이면서 성장 게이지가 없을 때: 물 감소·마름 멈춤, 카드에서 수분만 숨김.
 */
function isSproutStage3Or5IdleNoGrowth(plant, now) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const st = getSproutStageFromPlant(plant);
  if (st !== 3 && st !== 5) return false;
  if (hasActiveGreenGrowthProgress(plant, now)) return false;
  return true;
}

function shouldPauseWaterDecayForPlant(plant, now) {
  return isSproutStage3Or5IdleNoGrowth(plant, now);
}

function syncPlantCardWaterReadoutVisibility(plant, now) {
  if (!plantWaterText || !plantWaterBar) return;
  const hide = plant && shouldPauseWaterDecayForPlant(plant, now);
  if (hide) {
    plantWaterText.style.display = "none";
    plantWaterBar.style.display = "none";
  } else {
    plantWaterText.style.display = "";
    plantWaterBar.style.display = "grid";
  }
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

function applyPlantWaterDecay(plant, now) {
  plant.waterLevel = Math.max(0, Number(plant.waterLevel) || 0);
  if (plant.waterLevel <= 0) {
    return;
  }
  let updatedAt = Number(plant.waterLevelUpdatedAt);
  // Number(null) === 0 — would drain all water in one frame after snapshot parse.
  if (!Number.isFinite(updatedAt) || updatedAt <= 0) {
    updatedAt = now;
    plant.waterLevelUpdatedAt = updatedAt;
  }
  let guard = 0;
  while (plant.waterLevel > 0 && guard < 2000) {
    guard += 1;
    const tickMs = getPlantWaterLevelTickMsForPlant(plant);
    if (!Number.isFinite(tickMs) || tickMs <= 0) break;
    if (now - updatedAt < tickMs) break;
    const previousWaterLevel = plant.waterLevel;
    plant.waterLevel -= 1;
    updatedAt += tickMs;
    if (previousWaterLevel > 0 && plant.waterLevel === 0 && plant.becameEmptyAt === null) {
      plant.becameEmptyAt = updatedAt;
    }
  }
  plant.waterLevelUpdatedAt = updatedAt;
}

function updateExtraPlantWaterLevel(plant, now) {
  if (plant.isOverwatered || plant.status === "dry" || plant.status === "rotten") {
    return;
  }

  if (shouldPauseWaterDecayForPlant(plant, now)) {
    if (plant.waterLevel > 0 && plant.becameEmptyAt != null) {
      plant.becameEmptyAt = null;
    }
    if (plant.waterLevel <= 0 && plant.becameEmptyAt === null) {
      plant.becameEmptyAt = plant.waterLevelUpdatedAt || now;
    }
    plant.waterLevelUpdatedAt = now;
    return;
  }

  applyPlantWaterDecay(plant, now);
}

function getPlantSoilSrc(plant) {
  if (plant.status === "rotten" || plant.isOverwatered) return "이미지/soil-rotten.png";
  if (plant.status === "wet") return "이미지/soil-wet.png";
  if (plant.status === "dry") return "이미지/soil-dry.png";
  return "이미지/tilled-soil.png";
}

function updateSeedInventory() {
  if (usesWorldLooseSeedMode()) {
    const n = appleState.seedCount;
    const looseVisible = isWorldLooseSeedVisibleAt(Date.now());
    if (n <= 0) {
      hasShownFirstSeedFocus = false;
    }
    const panel = document.getElementById("seed-count-panel");
    if (seedCountText) {
      seedCountText.textContent = String(n);
    }
    if (panel) {
      panel.hidden = n <= 0 && !looseVisible;
    }
    seedInventory.style.display = n > 0 || looseVisible ? "flex" : "none";
    const seedTip =
      "\uC528\uC557 \uBCF4\uC720 " +
      n +
      "\uAC1C \u2014 \uD074\uB9AD\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC2EC\uC2B5\uB2C8\uB2E4.";
    seedInventory.title = n > 0 ? seedTip : "";
    appleState.extraSeeds.forEach(function (extraSeed) {
      if (extraSeed.inventoryElement) {
        extraSeed.inventoryElement.remove();
        extraSeed.inventoryElement = undefined;
        extraSeed.inventoryImage = undefined;
      }
    });
    return;
  }

  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.inventoryElement) {
      extraSeed.inventoryElement.remove();
      extraSeed.inventoryElement = undefined;
      extraSeed.inventoryImage = undefined;
    }
  });

  const inventorySeeds = appleState.extraSeeds.filter(function (extraSeed) {
    return extraSeed.inInventory && !extraSeed.planted && extraSeed.id !== plantingInventorySeedId;
  });
  const n = inventorySeeds.length;
  const panel = document.getElementById("seed-count-panel");
  if (seedCountText) {
    seedCountText.textContent = String(n);
  }
  if (panel) {
    panel.hidden = n <= 0;
  }
  seedInventory.style.display = n > 0 ? "flex" : "none";
  const seedTipHub =
    "\uC528\uC557 \uBCF4\uC720 " +
    n +
    "\uAC1C \u2014 \uD074\uB9AD\uD558\uBA74 \uC774 \uC790\uB9AC\uC5D0 \uC2EC\uC2B5\uB2C8\uB2E4.";
  seedInventory.title = n > 0 ? seedTipHub : "";
}

function discardInventorySeed(seedId) {
  const seedIndex = appleState.extraSeeds.findIndex(function (extraSeed) {
    return extraSeed.id === seedId;
  });
  if (seedIndex < 0) return;

  const seedToRemove = appleState.extraSeeds[seedIndex];
  if (!seedToRemove.inInventory || seedToRemove.planted) return;
  if (
    isOnboardingLinearGateActive() &&
    (seedToRemove.isStarter || seedToRemove.id === "starter-seed")
  ) {
    flashOnboardingOrderHint("");
    return;
  }

  if (seedToRemove.inventoryElement) {
    seedToRemove.inventoryElement.remove();
  }
  if (seedToRemove.element) {
    seedToRemove.element.remove();
  }
  if (seedToRemove.isStarter && isExtraSeedDry(seedToRemove)) {
    hasHandledDryMainSeed = true;
    setStoredFlag(mainDrySeedHandledKey, true);
    markWorldDirty();
    syncWorldState(true);
  }

  appleState.extraSeeds.splice(seedIndex, 1);
  saveAppleState();
  updateSeedInventory();
}

function ensureExtraSeedElement(extraSeed) {
  if (extraSeed.element && document.contains(extraSeed.element)) return;
  if (extraSeed.element) extraSeed.element = undefined;

  const element = document.createElement("img");
  element.className = "extra-seed";
  element.alt = "extra seed";
  element.src = "이미지/seed.png";
  setWorldSize(element, SEED_SIZE);
  ground.appendChild(element);
  extraSeed.element = element;
}

function ensureExtraPlantElements(plant) {
  const plantDomOk =
    plant.spotElement &&
    plant.sproutElement &&
    plant.waterNeededElement &&
    plant.growthMeterElement &&
    document.contains(plant.spotElement) &&
    document.contains(plant.sproutElement) &&
    document.contains(plant.waterNeededElement) &&
    document.contains(plant.growthMeterElement);
  if (plantDomOk) return;

  [plant.sproutElement, plant.waterNeededElement, plant.growthMeterElement, plant.spotElement].forEach(
    function (el) {
      if (el && el !== mainPlantGrowthMeter.element && typeof el.remove === "function") {
        el.remove();
      }
    }
  );
  plant.spotElement = undefined;
  plant.sproutElement = undefined;
  plant.waterNeededElement = undefined;
  plant.growthMeterElement = undefined;
  plant.growthMeterFill = undefined;

  const spotElement = document.createElement("img");
  spotElement.className = "extra-plant-spot";
  spotElement.alt = "extra plant spot";
  spotElement.src = "이미지/tilled-soil.png";
  setWorldSize(spotElement, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
  ground.appendChild(spotElement);

  const sproutElement = document.createElement("img");
  sproutElement.className = "extra-sprout";
  sproutElement.alt = "extra sprout";
  sproutElement.src = "이미지/sprout.png";
  setWorldSize(sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  ground.appendChild(sproutElement);

  const waterNeededElement = document.createElement("img");
  waterNeededElement.className = "extra-water-needed";
  waterNeededElement.alt = "water needed";
  waterNeededElement.src = "이미지/water-needed.png";
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
  worldLooseSeedElement = null;
}

function invalidateGroundSeedElementRefsOnly(seeds) {
  if (!Array.isArray(seeds)) return;
  seeds.forEach(function (s) {
    if (!s) return;
    s.element = undefined;
  });
}

/** 공유 스냅샷: 땅 씨앗 노드만 제거(식물/게이지는 유지·재연결로 깜빡임 방지) */
function clearGroundExtraSeedElementsOnly() {
  document.querySelectorAll(".extra-seed:not(.world-loose-seed)").forEach(function (element) {
    element.remove();
  });
}

function teardownExtraPlantDom(p) {
  if (!p) return;
  if (p.spotElement && p.spotElement.isConnected) p.spotElement.remove();
  if (p.sproutElement && p.sproutElement.isConnected) p.sproutElement.remove();
  if (p.waterNeededElement && p.waterNeededElement.isConnected) p.waterNeededElement.remove();
  if (p.growthMeterElement && p.growthMeterElement.isConnected) p.growthMeterElement.remove();
  p.spotElement = undefined;
  p.sproutElement = undefined;
  p.waterNeededElement = undefined;
  p.growthMeterElement = undefined;
  p.growthMeterFill = undefined;
}

function extraSeedHasCorrespondingExtraPlant(seedId, plants) {
  const pid = "plant-" + String(seedId);
  return plants.some(function (p) {
    return p && !p.removed && String(p.id) === pid;
  });
}

function pruneGroundExtraSeedsShadowedByPlants(extraSeeds, extraPlants) {
  const plantLinkedSeedIds = Object.create(null);
  extraPlants.forEach(function (p) {
    if (!p || p.id == null || p.removed) return;
    const m = String(p.id).match(/^plant-(.+)$/);
    if (m) plantLinkedSeedIds[m[1]] = true;
  });
  return extraSeeds.filter(function (s) {
    if (!s || s.id == null) return true;
    if (Boolean(s.inInventory) || Boolean(s.planted)) return true;
    if (plantLinkedSeedIds[String(s.id)]) return false;
    return true;
  });
}

function updateBucketPosition() {
  bucket.src = isBucketFull ? "이미지/bucket-full.png" : "이미지/bucket-empty.png";
  playerBucketOverlay.style.backgroundImage =
    'url("' + (isBucketFull ? "이미지/bucket-full.png" : "이미지/bucket-empty.png") + '")';
  const isBucketHeldByRemotePlayer =
    Boolean(window.OVC_SHARED_BUCKET_HELD_BY) &&
    window.OVC_SHARED_BUCKET_HELD_BY !== currentSessionId &&
    heldItem !== HELD_ITEM_BUCKET;
  if (isBucketHeldByRemotePlayer) {
    const holderId = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
    const lastUpdateAt = Number(remoteBucketUpdateAtById[holderId] || 0);
    if (lastUpdateAt && Date.now() - lastUpdateAt > 5000) {
      window.OVC_SHARED_BUCKET_HELD_BY = "";
      addBucketTrace("stale", "clear holder=" + holderId + " age=" + (Date.now() - lastUpdateAt), 0);
    }
  }

  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.element) return;
    remotePlayer.element.classList.remove("is-carrying-bucket");
  });

  if (heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);

    bucketX = handPosition.x;
    bucketY = handPosition.y;
    markWorldDirty();
    broadcastBucketState(false);
    bucket.style.display = "none";
    playerBucketOverlay.style.display = "block";
    setWorldPosition(playerBucketOverlay, bucketX, bucketY);
  } else if (isBucketHeldByRemotePlayer) {
    const bucketSize = getBucketSize();
    if (!Number.isFinite(bucketX) || !Number.isFinite(bucketY)) {
      bucketX = wellX - bucketSize.width - 8;
      bucketY = wellY + WELL_SIZE - bucketSize.height;
    }
    bucket.style.display = "block";
    playerBucketOverlay.style.display = "none";
  } else {
    bucket.style.display = "block";
    playerBucketOverlay.style.display = "none";
    // While idle on ground, periodically publish authoritative world bucket state.
    // This helps recover peers that missed a pickup/drop edge event.
    broadcastBucketState(false);
  }

  if (bucket.style.display === "block" && (!Number.isFinite(bucketX) || !Number.isFinite(bucketY))) {
    const bucketSize = getBucketSize();
    bucketX = wellX - bucketSize.width - 8;
    bucketY = wellY + WELL_SIZE - bucketSize.height;
  }

  if (bucket.style.display === "block") {
    setWorldPosition(bucket, bucketX, bucketY);
    if (BUCKET_DEBUG_TRACE) {
      const mode =
        heldItem === HELD_ITEM_BUCKET
          ? "local-held"
          : isBucketHeldByRemotePlayer
            ? "remote-held"
            : "world";
      const renderKey =
        mode + "|" + Math.round(bucketX || 0) + "|" + Math.round(bucketY || 0);
      if (renderKey !== lastBucketRenderLoggedKey) {
        lastBucketRenderLoggedKey = renderKey;
        addNetworkDebugLog(
          "[bucket:render] mode=" +
            mode +
            " x=" +
            Math.round(bucketX || 0) +
            " y=" +
            Math.round(bucketY || 0)
        );
      }
    }
  }
}

function updatePlayerPosition() {
  if (isCharacterSelecting || !hasSpawnedCharacter) {
    lastMovementTickMs = performance.now();
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) {
    lastMovementTickMs = performance.now();
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  if (isWorldChatBlockingGameInput()) {
    lastMovementTickMs = performance.now();
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  const nowMs = performance.now();
  if (lastMovementTickMs <= 0) {
    lastMovementTickMs = nowMs - 1000 / MOVEMENT_REFERENCE_HZ;
  }
  let dtSec = (nowMs - lastMovementTickMs) / 1000;
  lastMovementTickMs = nowMs;
  dtSec = Math.min(MOVEMENT_DT_CAP_SEC, Math.max(0, dtSec));
  const frameScale = dtSec * MOVEMENT_REFERENCE_HZ;

  const previousPlayerX = playerX;
  const previousPlayerDepth = playerDepth;
  const previousJumpY = jumpY;
  const groundMaxDepth = getMaxGroundedPlayerDepth();
  const maxX = Math.max(0, WORLD_WIDTH - PLAYER_WIDTH);
  const preNearTrunk = isPlayerNearTreeTrunk();
  const preInCanopy = isPlayerInTreeCanopy();
  const speedSide =
    !isTreeFalling && (preNearTrunk || preInCanopy || wasPlayerInTree)
      ? treeMoveSpeed
      : speed;

  if (keys.ArrowLeft || keys.a) {
    playerX -= speedSide * frameScale;
  }

  if (keys.ArrowRight || keys.d) {
    playerX += speedSide * frameScale;
  }

  if (playerX < 0) playerX = 0;
  if (playerX > maxX) playerX = maxX;

  const isInCanopy = isPlayerInTreeCanopy();
  const isNearTrunk = isPlayerNearTreeTrunk();
  const isInTree = !isTreeFalling && (isInCanopy || isNearTrunk);

  const shouldTreeFall =
    playerDepth > groundMaxDepth &&
    (isTreeFalling || !isPlayerSupportedByTree());
  const isFallingFromTree = shouldTreeFall;

  if (shouldTreeFall) {
    isTreeFalling = true;
    jumpY = 0;
    velocityY = 0;
    playerDepth -= treeFallSpeed * frameScale;
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
      movePlayerVerticallyInTree(treeClimbSpeed * frameScale);
    }

    if (keys.ArrowDown || keys.s) {
      movePlayerVerticallyInTree(-treeClimbSpeed * frameScale);
    }
  } else {
    if (keys.ArrowUp || keys.w) {
      playerDepth += speed * frameScale;
    }

    if (keys.ArrowDown || keys.s) {
      playerDepth -= speed * frameScale;
    }
    velocityY += gravity * frameScale;
    jumpY += velocityY * frameScale;
  }

  if (playerDepth < getMinGroundedPlayerDepth()) {
    playerDepth = getMinGroundedPlayerDepth();
  }
  // Do not hard-snap to ground depth here; if the player is above ground and
  // outside tree support we want a smooth fall, not an instant teleport.

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
    footX >= wellX + 12 &&
    footX <= wellX + WELL_SIZE - 12 &&
    footY >= wellY + WELL_SIZE * 0.55 &&
    footY <= wellY + WELL_SIZE - 6
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
  if (isTreeFalling) return false;
  const footY = getPlayerFootY();
  const rootsTop =
    BIG_TREE_Y +
    BIG_TREE_HEIGHT +
    TREE_CSS_ROOTS_BOTTOM_EXTEND -
    TREE_CSS_ROOTS_HEIGHT;
  const rootsBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  const feetInset = 5;
  const feetRect = {
    left: playerX + feetInset,
    right: playerX + PLAYER_WIDTH - feetInset,
    top: footY - 8,
    bottom: footY + 2
  };
  const hPad = TREE_CLIMB_DISTANCE + 4;
  const rootsRect = {
    left: BIG_TREE_X + TREE_CSS_ROOTS_LEFT - hPad,
    right: BIG_TREE_X + TREE_CSS_ROOTS_LEFT + TREE_CSS_ROOTS_WIDTH + hPad,
    top: rootsTop,
    bottom: rootsBottom
  };
  if (isOverlappingRect(feetRect, rootsRect)) return true;
  const trunkRect = {
    left: TREE_TRUNK_X - hPad,
    right: TREE_TRUNK_X + TREE_TRUNK_WIDTH + hPad,
    top: TREE_TRUNK_TOP - 22,
    bottom: rootsBottom
  };
  return isOverlappingRect(feetRect, trunkRect);
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
  const minD = getMinTreePlayerDepth();
  const maxD = getMaxTreePlayerDepth();
  const target = Math.max(minD, Math.min(maxD, playerDepth));
  if (playerDepth < target) {
    playerDepth = Math.min(target, playerDepth + TREE_DEPTH_CLAMP_MAX_STEP);
  } else if (playerDepth > target) {
    playerDepth = Math.max(target, playerDepth - TREE_DEPTH_CLAMP_MAX_STEP);
  } else {
    playerDepth = target;
  }
}

function getPlayerWorldY() {
  return -playerDepth + jumpY;
}

function startPlanting() {
  updateSeedDryState();

  if (isOnboardingLinearGateActive() && onboardingFlowStep !== 7) {
    flashOnboardingOrderHint("");
    return;
  }

  if (heldItem !== HELD_ITEM_SEED || plantRuntime.isPlanting || !isOnGround || plantRuntime.isSeedDry) return;

  const playerBox = getPlayerBox();
  const spotWidth = PLANT_SPOT_WIDTH;
  const spotHeight = PLANT_SPOT_HEIGHT;

  const targetPlantSpotX = playerBox.left + playerBox.width / 2 - spotWidth / 2;
  const targetPlantSpotY = playerBox.bottom - spotHeight / 2;
  if (!canPlantAt(targetPlantSpotX, targetPlantSpotY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    return;
  }

  plantRuntime.spotX = targetPlantSpotX;
  plantRuntime.spotY = targetPlantSpotY;
  heldItem = null;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    const plantedAt = Date.now();
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    const spotX = plantRuntime.spotX;
    const spotY = plantRuntime.spotY;

    if (isSharedWorldMultiPlantMode() && plantRuntime.isSeedPlanted) {
      const ownerKey = String(currentUserId || currentSessionId || "guest");
      const newPlant = createExtraPlant(
        "plant-ground-" + ownerKey + "-" + plantedAt,
        spotX,
        spotY
      );
      newPlant.plantedAt = plantedAt;
      newPlant.lastWateredAt = null;
      newPlant.wateredAtList = [];
      newPlant.waterLevel = 0;
      newPlant.waterLevelUpdatedAt = plantedAt;
      newPlant.needsFirstWater = true;
      newPlant.growthStartedAt = null;
      newPlant.ownerUserId = getPlanterOwnerId();
      newPlant.ownerDisplayName = getPlanterDisplayName();
      assignSproutIdentityToNewPlant(newPlant);
      ensureGrassOrdinalIfNeeded(newPlant);
      appleState.extraPlants.push(newPlant);
      playerStatus.textContent = "";
      seedCard.style.display = "none";
      updateExtraSeedsAndPlants();
      updatePlantState();
      updateNpcPosition();
      holdLocalPlantStateAgainstStaleSnapshot(3000);
      saveSeedState();
      saveAppleState();
      markWorldDirty();
      syncWorldState(true);
      onboardingNotifyMainPlantPlanted();
      return;
    }

    plantRuntime.isSeedPlanted = true;
    plantRuntime.lastWateredAt = null;
    plantRuntime.wateredAtList = [];
    plantRuntime.status = "normal";
    plantRuntime.waterLevel = 0;
    plantRuntime.waterLevelUpdatedAt = plantedAt;
    plantRuntime.becameEmptyAt = null;
    plantRuntime.isOverwatered = false;
    plantRuntime.rottenAt = null;
    plantRuntime.needsFirstWater = true;
    plantRuntime.growthStartedAt = null;
    plantRuntime.plantedAt = plantedAt;
    plantRuntime.isSproutGrown = false;
    plantRuntime.sproutGrownAt = null;
    plantRuntime.sproutEvolutionMs = 0;
    plantRuntime.sproutEvolutionLastTickAt = null;
    plantRuntime.isSproutSelfSustaining = false;
    plantRuntime.growthTier = 0;
    plantRuntime.waterCapacity = 2;
    plantRuntime.powderUpgradeTargetTier = 0;
    plantRuntime.powderUpgradeStartedAt = null;
    plantRuntime.powderUpgradeDurationMs = 0;
    plantRuntime.grassAuto5EligibleAt = null;
    assignSproutIdentityToNewPlant(plantRuntime);
    ensureGrassOrdinalIfNeeded(plantRuntime);
    plantRuntime.blockSproutRegrowthAfterDry = false;
    plantRuntime.drySoilAt = null;
    playerStatus.textContent = "";
    seedCard.style.display = "none";
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    updatePlantState();
    updateNpcPosition();
    holdLocalPlantStateAgainstStaleSnapshot(3000);
    saveSeedState();
    onboardingNotifyMainPlantPlanted();
  }, plantActionMs);
}

function startPlantingExtraSeed() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
    flashOnboardingOrderHint("");
    return;
  }
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed || plantRuntime.isPlanting || !isOnGround) {
    return;
  }

  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;

  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    return;
  }

  heldItem = null;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    extraSeed.planted = true;
    const newPlant = createExtraPlant("plant-" + extraSeed.id, plantX, plantY);
    assignSproutIdentityToNewPlant(newPlant);
    ensureGrassOrdinalIfNeeded(newPlant);
    appleState.extraPlants.push(newPlant);
    playerStatus.textContent = "";
    updateExtraSeedsAndPlants();
    holdLocalPlantStateAgainstStaleSnapshot(3000);
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
  }, plantActionMs);
}

function plantWorldSeedCount() {
  if (!usesWorldLooseSeedMode() || appleState.seedCount <= 0) {
    updateSeedInventory();
    return;
  }

  if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }

  if (
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isNpcDialogueRunning ||
    !isOnGround
  ) {
    updateSeedInventory();
    return;
  }

  const syntheticId = "w-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;

  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    updateSeedInventory();
    return;
  }

  plantingInventorySeedId = syntheticId;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    appleState.seedCount = Math.max(0, appleState.seedCount - 1);

    if (!plantRuntime.isSeedPlanted) {
      const plantedAt = Date.now();
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = null;
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 0;
      plantRuntime.waterLevelUpdatedAt = plantedAt;
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.rottenAt = null;
      plantRuntime.needsFirstWater = true;
      plantRuntime.growthStartedAt = null;
      plantRuntime.plantedAt = plantedAt;
      plantRuntime.isSproutGrown = false;
      plantRuntime.sproutGrownAt = null;
      plantRuntime.sproutEvolutionMs = 0;
      plantRuntime.sproutEvolutionLastTickAt = null;
      plantRuntime.isSproutSelfSustaining = false;
      plantRuntime.growthTier = 0;
      plantRuntime.waterCapacity = 2;
      plantRuntime.powderUpgradeTargetTier = 0;
      plantRuntime.powderUpgradeStartedAt = null;
      plantRuntime.powderUpgradeDurationMs = 0;
      plantRuntime.grassAuto5EligibleAt = null;
      assignSproutIdentityToNewPlant(plantRuntime);
      ensureGrassOrdinalIfNeeded(plantRuntime);
      plantRuntime.blockSproutRegrowthAfterDry = false;
      plantRuntime.drySoilAt = null;
      plantSpot.style.display = "block";
      setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
      updatePlantState();
      updateNpcPosition();
      holdLocalPlantStateAgainstStaleSnapshot(3000);
      holdLocalAppleStateAgainstStaleSnapshot(3000);
      saveSeedState();
      onboardingNotifyMainPlantPlanted();
    } else {
      const invPlant = createExtraPlant("plant-" + syntheticId, plantX, plantY);
      assignSproutIdentityToNewPlant(invPlant);
      ensureGrassOrdinalIfNeeded(invPlant);
      appleState.extraPlants.push(invPlant);
      updateExtraSeedsAndPlants();
      holdLocalPlantStateAgainstStaleSnapshot(3000);
      holdLocalAppleStateAgainstStaleSnapshot(3000);
    }

    playerStatus.textContent = "";
    updateSeedInventory();
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }, plantActionMs);
}

function plantInventorySeed(seedId) {
  const inventorySeed = appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === seedId;
  });

  if (isOnboardingLinearGateActive() && inventorySeed) {
    const isStarter = inventorySeed.id === "starter-seed" || inventorySeed.isStarter;
    if (isStarter && onboardingFlowStep !== 7) {
      flashOnboardingOrderHint("");
      updateSeedInventory();
      return;
    }
    if (!isStarter && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      updateSeedInventory();
      return;
    }
  }

  if (
    !inventorySeed ||
    !inventorySeed.inInventory ||
    inventorySeed.planted ||
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isNpcDialogueRunning ||
    !isOnGround
  ) {
    updateSeedInventory();
    return;
  }

  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;

  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    updateSeedInventory();
    return;
  }

  plantingInventorySeedId = inventorySeed.id;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    inventorySeed.planted = true;
    inventorySeed.inInventory = false;

    if (!plantRuntime.isSeedPlanted) {
      const plantedAt = Date.now();
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = null;
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 0;
      plantRuntime.waterLevelUpdatedAt = plantedAt;
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.rottenAt = null;
      plantRuntime.needsFirstWater = true;
      plantRuntime.growthStartedAt = null;
      plantRuntime.plantedAt = plantedAt;
      plantRuntime.isSproutGrown = false;
      plantRuntime.sproutGrownAt = null;
      plantRuntime.sproutEvolutionMs = 0;
      plantRuntime.sproutEvolutionLastTickAt = null;
      plantRuntime.isSproutSelfSustaining = false;
      plantRuntime.growthTier = 0;
      plantRuntime.waterCapacity = 2;
      plantRuntime.powderUpgradeTargetTier = 0;
      plantRuntime.powderUpgradeStartedAt = null;
      plantRuntime.powderUpgradeDurationMs = 0;
      plantRuntime.grassAuto5EligibleAt = null;
      assignSproutIdentityToNewPlant(plantRuntime);
      ensureGrassOrdinalIfNeeded(plantRuntime);
      plantRuntime.blockSproutRegrowthAfterDry = false;
      plantRuntime.drySoilAt = null;
      plantSpot.style.display = "block";
      setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
      updatePlantState();
      updateNpcPosition();
      saveSeedState();
      onboardingNotifyMainPlantPlanted();
    } else {
      const invPlant = createExtraPlant("plant-" + inventorySeed.id, plantX, plantY);
      assignSproutIdentityToNewPlant(invPlant);
      ensureGrassOrdinalIfNeeded(invPlant);
      appleState.extraPlants.push(invPlant);
      updateExtraSeedsAndPlants();
    }

    playerStatus.textContent = "";
    updateSeedInventory();
    saveAppleState();
  }, plantActionMs);
}

function createExtraPlant(id, x, y) {
  const now = Date.now();
  return {
    id,
    x,
    y,
    plantedAt: now,
    lastWateredAt: null,
    wateredAtList: [],
    status: "normal",
    waterLevel: 0,
    waterLevelUpdatedAt: now,
    becameEmptyAt: null,
    isOverwatered: false,
    rottenAt: null,
    needsFirstWater: true,
    growthStartedAt: null,
    isSproutGrown: false,
    sproutGrownAt: null,
    sproutEvolutionMs: 0,
    sproutEvolutionLastTickAt: null,
    isSproutSelfSustaining: false,
    growthTier: 0,
    waterCapacity: 2,
    powderUpgradeTargetTier: 0,
    powderUpgradeStartedAt: null,
    powderUpgradeDurationMs: 0,
    grassAuto5EligibleAt: null,
    ownerUserId: "",
    ownerDisplayName: "",
    sproutOrdinal: 0,
    grassOrdinal: null,
    blockSproutRegrowthAfterDry: false,
    drySoilAt: null
  };
}

function getPlanterOwnerId() {
  return String(currentUserId || "").trim();
}

function getPlanterDisplayName() {
  const n = String(currentUserName || "").trim();
  return n || "\uD50C\uB808\uC774\uC5B4";
}

function getLocalExtraSeedOwnerUserId() {
  return String(currentUserId || "").trim();
}

function getLocalExtraSeedOwnerSessionId() {
  return String(currentSessionId || "").trim();
}

function assignExtraSeedInventoryOwner(seed) {
  if (!seed) return;
  seed.ownerUserId = getLocalExtraSeedOwnerUserId();
  seed.ownerSessionId = getLocalExtraSeedOwnerSessionId();
}

function isExtraSeedOwnedByLocalPlayer(seed) {
  const uid = getLocalExtraSeedOwnerUserId();
  const sid = getLocalExtraSeedOwnerSessionId();
  const oUid = String(seed && seed.ownerUserId != null ? seed.ownerUserId : "").trim();
  const oSid = String(seed && seed.ownerSessionId != null ? seed.ownerSessionId : "").trim();
  if (!oUid && !oSid) return true;
  if (oUid && uid) return oUid === uid;
  if (oSid && sid) return oSid === sid;
  if (oUid && !uid && oSid && sid) return oSid === sid;
  return false;
}

/** 스냅샷 병합: 소유자 비어 있으면 false(전원 로컬로 취급하지 않음) → 원격 제거와 충돌 시 유령 씨앗 억제 */
function isExtraSeedSessionOwnedByLocal(seed) {
  if (!seed) return false;
  const uid = getLocalExtraSeedOwnerUserId();
  const sid = getLocalExtraSeedOwnerSessionId();
  const oUid = String(seed.ownerUserId != null ? seed.ownerUserId : "").trim();
  const oSid = String(seed.ownerSessionId != null ? seed.ownerSessionId : "").trim();
  if (oSid && sid && oSid === sid) return true;
  if (oUid && uid && oUid === uid) return true;
  return false;
}

function plantOwnerMatches(plant, ownerId, ownerName) {
  const oid = String(ownerId || "").trim();
  const oname = String(ownerName || "").trim();
  const pid = String(plant.ownerUserId || "").trim();
  const pname = String(plant.ownerDisplayName || "").trim();
  if (oid && pid === oid) return true;
  if (!oid && oname && pname === oname) return true;
  if (!oid && !oname && !pid && !pname) return true;
  return false;
}

function isPlantAliveForWorldOrdinal(plant) {
  return (
    plant &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered
  );
}

function plantOrdinalGroupKey(plant) {
  return (
    String(plant.ownerUserId || "").trim() +
    "\u0001" +
    String(plant.ownerDisplayName || "").trim()
  );
}

function plantWorldOrdinalSortTime(plant) {
  const a = Number(plant.plantedAt) || 0;
  if (a > 0) return a;
  return Number(plant.growthStartedAt) || 0;
}

function butterflyInventorySlotHoverTip(color) {
  if (color === "yellow") {
    return "\uB178\uB791 \uB098\uBE44";
  }
  if (color === "brown") {
    return "\uAC08\uC0C9 \uB098\uBE44";
  }
  if (color === "white") {
    return "\uD558\uC580 \uB098\uBE44";
  }
  return "\uB098\uBE44";
}

const butterflyInventoryCraftHoverTip =
  "\uB9C8\uBC95\uC758 \uAC00\uB8E8\n\uC0DD\uC131 \uAC00\uB2A5";

let butterflyInventoryLastPointerClientX = 0;
let butterflyInventoryLastPointerClientY = 0;

function butterflyInventoryHoverTipAtClient(clientX, clientY) {
  if (!butterflyInventory || butterflyInventory.style.display === "none") {
    return null;
  }
  const inv = butterflyInventory.getBoundingClientRect();
  if (
    clientX < inv.left ||
    clientX > inv.right ||
    clientY < inv.top ||
    clientY > inv.bottom
  ) {
    return null;
  }
  if (butterflyInventory.classList.contains("is-craftable")) {
    return butterflyInventoryCraftHoverTip;
  }
  const hit = document.elementFromPoint(clientX, clientY);
  const slot = hit && hit.closest && hit.closest(".butterfly-inventory-slot");
  if (slot && butterflyInventory.contains(slot)) {
    return butterflyInventorySlotHoverTip(slot.dataset.color);
  }
  let bestColor = null;
  let bestDist = Infinity;
  butterflyInventorySlots.forEach(function (s) {
    const r = s.getBoundingClientRect();
    const mid = (r.left + r.right) / 2;
    const d = Math.abs(clientX - mid);
    if (d < bestDist) {
      bestDist = d;
      bestColor = s.dataset.color;
    }
  });
  return bestColor ? butterflyInventorySlotHoverTip(bestColor) : null;
}

function syncButterflyInventoryBarHoverTip() {
  if (!butterflyInventory) return;
  const tip = butterflyInventoryHoverTipAtClient(
    butterflyInventoryLastPointerClientX,
    butterflyInventoryLastPointerClientY
  );
  setInstantHoverTip(butterflyInventory, tip);
}

/** 브라우저 기본 title(지연) 대신 CSS data-ovc-tip으로 바로 뜨는 설명 */
function setInstantHoverTip(el, text) {
  if (!el) return;
  if (text) {
    el.setAttribute("data-ovc-tip", text);
    el.setAttribute("aria-label", text);
  } else {
    el.removeAttribute("data-ovc-tip");
    el.removeAttribute("aria-label");
  }
}

/** 살아 있는 식물만, 심은 시각 기준: 새싹(티어 4 미만)과 풀(티어 4 이상)을 소유자별로 따로 번호 부여. */
function refreshPlantIdentityOrdinals() {
  function clearOrdinals(plant) {
    if (!plant) return;
    plant.sproutOrdinal = 0;
    plant.grassOrdinal = null;
  }
  clearOrdinals(plantRuntime);
  appleState.extraPlants.forEach(clearOrdinals);

  const groups = Object.create(null);
  function consider(plant) {
    if (!plant || !isPlantAliveForWorldOrdinal(plant)) return;
    const tier = Math.max(0, Number(plant.growthTier) || 0);
    const k = plantOrdinalGroupKey(plant);
    if (!groups[k]) {
      groups[k] = { sprouts: [], grasses: [] };
    }
    const t = plantWorldOrdinalSortTime(plant);
    const entry = { plant: plant, t: t };
    if (tier < 4) {
      groups[k].sprouts.push(entry);
    } else {
      groups[k].grasses.push(entry);
    }
  }
  if (plantRuntime.isSeedPlanted) {
    consider(plantRuntime);
  }
  appleState.extraPlants.forEach(consider);

  Object.keys(groups).forEach(function (k) {
    const g = groups[k];
    g.sprouts.sort(function (a, b) {
      return a.t - b.t;
    });
    g.grasses.sort(function (a, b) {
      return a.t - b.t;
    });
    g.sprouts.forEach(function (e, i) {
      e.plant.sproutOrdinal = i + 1;
    });
    g.grasses.forEach(function (e, i) {
      e.plant.grassOrdinal = i + 1;
    });
  });
}

function assignSproutIdentityToNewPlant(plant) {
  const oid = getPlanterOwnerId();
  const oname = getPlanterDisplayName();
  plant.ownerUserId = oid;
  plant.ownerDisplayName = oname;
  plant.sproutOrdinal = 0;
  plant.grassOrdinal = null;
}

function ensureGrassOrdinalIfNeeded(plant) {
  void plant;
}

function getPlantWorldLabel(plant) {
  if (
    !plant ||
    plant.status === "dry" ||
    plant.status === "rotten" ||
    plant.isOverwatered
  ) {
    return "";
  }
  const name = String(plant.ownerDisplayName || "").trim() || "\uD50C\uB808\uC774\uC5B4";
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  const sproutOrd = Math.max(0, Number(plant.sproutOrdinal) || 0);
  const grassOrd =
    plant.grassOrdinal != null && Number.isFinite(Number(plant.grassOrdinal))
      ? Math.max(0, Number(plant.grassOrdinal))
      : 0;
  if (tier === 0) {
    if (!plant.isSproutGrown) {
      if (sproutOrd > 0) {
        return name + "\uC758 \uB545" + sproutOrd;
      }
      return name + "\uC758 \uB545";
    }
    if (sproutOrd > 0) {
      return name + "\uC758 \uC0C8\uC2F9" + sproutOrd;
    }
    return name + "\uC758 \uC0C8\uC2F9";
  }
  if (tier >= 4 && grassOrd > 0) {
    return name + "\uC758 \uD480" + grassOrd;
  }
  if (tier >= 4) {
    return name + "\uC758 \uD480";
  }
  if (sproutOrd > 0) {
    return name + "\uC758 \uC0C8\uC2F9" + sproutOrd;
  }
  return name + "\uC758 \uC0C8\uC2F9";
}

function extraPlantFromDomElement(el) {
  for (let i = 0; i < appleState.extraPlants.length; i++) {
    const p = appleState.extraPlants[i];
    if (!p) continue;
    if (p.spotElement === el || p.sproutElement === el) return p;
  }
  return null;
}

function hidePlantHoverLabel() {
  if (seedInventory) seedInventory.classList.remove("is-seed-inventory-hover-hint");
  if (plantHoverLabel) {
    plantHoverLabel.classList.remove("is-seed-inventory-hint");
    plantHoverLabel.style.display = "none";
  }
}

function showPlantHoverForPlant(plant) {
  if (!plantHoverLabel || !plant) return;
  plantHoverLabel.classList.remove("is-seed-inventory-hint");
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  if (px == null || py == null) return;
  const label = getPlantWorldLabel(plant);
  if (!String(label || "").trim()) {
    hidePlantHoverLabel();
    return;
  }
  plantHoverLabel.textContent = label;
  plantHoverLabel.style.display = "block";
  function placeHoverLabelCentered() {
    const anchor = getPlantHoverAnchorWorld(plant);
    const w = plantHoverLabel.offsetWidth || 1;
    const h = plantHoverLabel.offsetHeight || 1;
    const sx = toScreenX(anchor.cxWorld) - w / 2;
    const sy = toScreenY(anchor.cyWorld) - h / 2;
    plantHoverLabel.style.transform = "translate(" + sx + "px, " + sy + "px)";
  }
  void plantHoverLabel.offsetWidth;
  placeHoverLabelCentered();
}

function plantProximityRectFromXYWH(x, y, w, h) {
  return {
    left: x,
    top: y,
    right: x + w,
    bottom: y + h
  };
}

function plantProximityExpandRect(r, pad) {
  return {
    left: r.left - pad,
    top: r.top - pad,
    right: r.right + pad,
    bottom: r.bottom + pad
  };
}

function plantSpotOverlapsExpandedRect(plantX, plantY, ox, oy, ow, oh, pad) {
  const pr = plantProximityRectFromXYWH(plantX, plantY, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
  const br = plantProximityExpandRect(plantProximityRectFromXYWH(ox, oy, ow, oh), pad);
  return isOverlappingRect(pr, br);
}

function plantProximityPhraseForNoun(noun) {
  const ch = noun.length ? noun[noun.length - 1] : "";
  const code = ch.charCodeAt(0);
  let hasBatchim = true;
  if (code >= 0xac00 && code <= 0xd7a3) {
    hasBatchim = (code - 0xac00) % 28 !== 0;
  }
  const particle = hasBatchim ? "\uACFC" : "\uC640";
  return noun + particle + " \uB108\uBB34 \uAC00\uAE4C\uC2B5\uB2C8\uB2E4!";
}

function getPlantProximityBlockMessage(plantX, plantY) {
  if (isPlantSpotOverlappingTreeNoPlantZone(plantX, plantY)) {
    return plantProximityPhraseForNoun("\uB098\uBB34");
  }

  const wellPad = 1;
  if (plantSpotOverlapsExpandedRect(plantX, plantY, wellX, wellY, WELL_SIZE, WELL_SIZE, wellPad)) {
    return plantProximityPhraseForNoun("\uC6B0\uBB3C");
  }

  const portalPad = 0;
  if (
    plantSpotOverlapsExpandedRect(
      plantX,
      plantY,
      spawnPortalX,
      spawnPortalY,
      spawnPortalWidth,
      spawnPortalHeight,
      portalPad
    )
  ) {
    return plantProximityPhraseForNoun("\uD3EC\uD0C8");
  }

  const bookPad = 0;
  if (
    guideBook &&
    guideBook.style.display !== "none" &&
    plantSpotOverlapsExpandedRect(
      plantX,
      plantY,
      guideBookX,
      guideBookY,
      GUIDE_BOOK_WIDTH,
      GUIDE_BOOK_HEIGHT,
      bookPad
    )
  ) {
    return plantProximityPhraseForNoun("\uCC45");
  }

  if (isPlantMasterVisible()) {
    const npcPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, npcX, npcY, NPC_WIDTH, NPC_HEIGHT, npcPad)) {
      return plantProximityPhraseForNoun("\uC2DD\uBB3C\uC758 \uB2EC\uC778");
    }
  }

  if (!plantRuntime.isSeedPlanted && seed && seed.style.display !== "none") {
    const seedPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, seedX, seedY, SEED_SIZE, SEED_SIZE, seedPad)) {
      return plantProximityPhraseForNoun("\uC528\uC557");
    }
  }

  let blockedByLooseSeed = false;
  const nowLoose = Date.now();
  if (
    usesWorldLooseSeedMode() &&
    isWorldLooseSeedVisibleAt(nowLoose) &&
    plantSpotOverlapsExpandedRect(
      plantX,
      plantY,
      appleState.worldLooseSeed.x,
      appleState.worldLooseSeed.y,
      SEED_SIZE,
      SEED_SIZE,
      0
    )
  ) {
    blockedByLooseSeed = true;
  }
  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || extraSeed.inInventory) return;
    if (usesWorldLooseSeedMode()) return;
    if (!extraSeed.element || extraSeed.element.style.display === "none") return;
    const seedPad = 0;
    if (
      plantSpotOverlapsExpandedRect(plantX, plantY, extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE, seedPad)
    ) {
      blockedByLooseSeed = true;
    }
  });
  if (blockedByLooseSeed) {
    return plantProximityPhraseForNoun("\uC528\uC557");
  }

  if (heldItem !== HELD_ITEM_BUCKET && bucket && bucket.style.display === "block") {
    const bsz = getBucketSize();
    const bucketPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, bucketX, bucketY, bsz.width, bsz.height, bucketPad)) {
      return plantProximityPhraseForNoun("\uC591\uB3D9\uC774");
    }
  }

  return "";
}

function flashPlantProximityWarning(message) {
  plantProximityWarnUntil = Date.now() + 2800;
  playerStatus.textContent = message || "";
}

function isPlantSpotOverlappingTreeNoPlantZone(plantX, plantY) {
  const pw = PLANT_SPOT_WIDTH;
  const ph = PLANT_SPOT_HEIGHT;
  const left = plantX;
  const right = plantX + pw;
  const top = plantY;
  const bottom = plantY + ph;

  function overlap(ax1, ay1, ax2, ay2) {
    return left < ax2 && right > ax1 && top < ay2 && bottom > ay1;
  }

  const canopyInset = 6;
  if (
    overlap(
      TREE_CANOPY_LEFT + canopyInset,
      TREE_CANOPY_TOP + canopyInset,
      TREE_CANOPY_RIGHT - canopyInset,
      TREE_CANOPY_BOTTOM - canopyInset
    )
  ) {
    return true;
  }

  const trunkInset = 3;
  const trunkLeft = TREE_TRUNK_X - TREE_CLIMB_DISTANCE + trunkInset;
  const trunkRight = TREE_TRUNK_X + TREE_TRUNK_WIDTH + TREE_CLIMB_DISTANCE - trunkInset;
  /** 줄기·뿌리가 그려진 높이만 막음(이전엔 trunkBottom이 지면 끝까지 가서 같은 x열 전체 y에서 심기 불가였음) */
  const trunkVisualTop = TREE_TRUNK_TOP - 22;
  const trunkFeetBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  if (overlap(trunkLeft, trunkVisualTop, trunkRight, trunkFeetBottom)) {
    return true;
  }
  return false;
}

/**
 * growthTier만 쓰면 새싹이 커도 오랫동안 0이라 반경이 안 넓어짐 → 시각 단계(getSproutStage)와 같이 씀.
 * 제거된 식물은 후보에서 빼고, maturity는 0–5로 캡.
 */
function getPlantMaturityLevelForPlantingSpacing(plant) {
  if (!plant || plant.removed) return null;
  const gt = Math.max(0, Number(plant.growthTier) || 0);
  const stage = plant.isSproutGrown ? getSproutStageFromPlant(plant) : 0;
  return Math.min(5, Math.max(gt, stage));
}

function canPlantAt(x, y) {
  pollWorldState(true);
  lastPlantProximityBlockMessage = "";
  const proximityMsg = getPlantProximityBlockMessage(x, y);
  if (proximityMsg) {
    lastPlantProximityBlockMessage = proximityMsg;
    return false;
  }
  const plantCenters = [];

  if (plantRuntime.isSeedPlanted) {
    const maturity = getPlantMaturityLevelForPlantingSpacing(plantRuntime);
    if (maturity != null) {
      plantCenters.push({
        x: plantRuntime.spotX + PLANT_SPOT_WIDTH / 2,
        y: plantRuntime.spotY + PLANT_SPOT_HEIGHT / 2,
        maturity: maturity
      });
    }
  }

  appleState.extraPlants.forEach(function (plant) {
    const maturity = getPlantMaturityLevelForPlantingSpacing(plant);
    if (maturity == null) return;
    plantCenters.push({
      x: plant.x + PLANT_SPOT_WIDTH / 2,
      y: plant.y + PLANT_SPOT_HEIGHT / 2,
      maturity: maturity
    });
  });

  const targetX = x + PLANT_SPOT_WIDTH / 2;
  const targetY = y + PLANT_SPOT_HEIGHT / 2;

  const tooClose = plantCenters.some(function (center) {
    const need = getMinPlantCenterClearanceWorld(center.maturity);
    return Math.hypot(center.x - targetX, center.y - targetY) < need;
  });
  if (tooClose) {
    lastPlantProximityBlockMessage = plantProximityPhraseForNoun("\uC2DD\uBB3C");
    return false;
  }
  return true;
}

function getHeldExtraSeed() {
  const id = getHeldExtraSeedId(heldItem);
  if (!id) return null;
  return appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === id;
  }) || null;
}

function isExtraSeedDry(extraSeed, now) {
  void extraSeed;
  void now;
  return false;
}

function useHeldItem() {
  if (plantRuntime.isPlanting || appleState.isEating) return;

  if (isOnboardingLinearGateActive()) {
    if (heldItem === HELD_ITEM_BUCKET && !onboardingAllowsBucketQUse()) {
      flashOnboardingOrderHint("");
      return;
    }
  }

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
  // 키 입력은 보통 다음 updateBucketPosition보다 먼저 옴 → 통 좌표가 플레이어 한 프레임 늦으면
  // 우물 '닿음' 판정이 어긋나 빈 통인데 찬 통 분기(뿌리기)로 들어가기 쉬움.
  if (heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
    bucketX = handPosition.x;
    bucketY = handPosition.y;
  }

  const wellReachForScoop =
    isNearWellIncludingBucketReach() || isBucketOverlappingWellForInteraction(10);
  const wellReachForPour =
    isNearWellForPouringIncludingBucketReach() || isBucketOverlappingWellForInteraction(10);

  if (!isBucketFull) {
    if (wellReachForScoop && wellState.water > 0) {
      isBucketFull = true;
      wellState.water -= 1;
      wellState.lastRefillAt = snapWellRefillToGrid(Date.now());
      saveWellState();
      syncWorldState(true);
      updateWellImage();
      updateWellCard();
      onboardingHookFilledBucketAtWell();
    } else if (wellReachForScoop && wellState.water <= 0) {
      flashPlantProximityWarning("우물에 물이 없습니다.");
      updatePlayerStatus();
    }
    return;
  }

  const wellSize = getWellSize();
  const wellDist = getCenterDistance(wellX, wellY, wellSize.width, wellSize.height);
  const wateringTarget = getNearestWateringTarget();
  const nearWellPour = wellReachForPour;
  // 우물·작물 거리가 겹칠 때: 우물에 되붓기는 우물에 여유가 있고, 급수 대상이 없거나 우물이 더 가까울 때만.
  if (
    nearWellPour &&
    wellState.water < maxWellWater &&
    (!wateringTarget || wellDist < wateringTarget.distance)
  ) {
    wellState.water += 1;
    wellState.lastRefillAt = snapWellRefillToGrid(Date.now());
    saveWellState();
    syncWorldState(true);
    updateWellImage();
    updateWellCard();
    triggerWaterSplash();
    isBucketFull = false;
    return;
  }

  if (wateringTarget) {
    waterPlant(wateringTarget);
    triggerWaterSplash();
    isBucketFull = false;
    return;
  }

  // 찬 양동이인데 급수할 식물이 없고 우물이 가득: 되붓기 불가 안내 + 스플래시로 피드백.
  if (nearWellPour && wellState.water >= maxWellWater) {
    triggerWaterSplash();
    flashPlantProximityWarning(
      "\uC6B0\uBB3C\uC774 \uAC00\uB4DD\uCC28\uC2B5\uB2C8\uB2E4."
    );
    updatePlayerStatus();
    return;
  }

  triggerWaterSplash();
  isBucketFull = false;
}

function getNearestPlantForMagicPowder() {
  let nearest = null;
  const powderDistance = MAGIC_POWDER_USE_DISTANCE;
  if (
    plantRuntime.isSeedPlanted &&
    plantRuntime.status !== "dry" &&
    plantRuntime.status !== "rotten"
  ) {
    if (getNextPowderTargetTier(plantRuntime) && !isPowderUpgradeInProgress(plantRuntime)) {
      const distance = getCenterDistance(
        plantRuntime.spotX,
        plantRuntime.spotY,
        PLANT_SPOT_WIDTH,
        PLANT_SPOT_HEIGHT
      );
      if (distance <= powderDistance) {
        nearest = { type: "main", plant: plantRuntime, distance };
      }
    }
  }
  appleState.extraPlants.forEach(function (plant) {
    if (!plant || plant.status === "dry" || plant.status === "rotten") return;
    if (!getNextPowderTargetTier(plant) || isPowderUpgradeInProgress(plant)) return;
    const distance = getCenterDistance(plant.x, plant.y, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
    if (distance > powderDistance) return;
    if (!nearest || distance < nearest.distance) {
      nearest = { type: "extra", plant, distance };
    }
  });
  return nearest;
}

function getNextPowderTargetTier(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 3) return 0;
  return 4;
}

function applyMagicPowderToPlant(plant) {
  const nextTier = getNextPowderTargetTier(plant);
  if (!nextTier || isPowderUpgradeInProgress(plant)) return false;
  const now = Date.now();
  plant.powderUpgradeTargetTier = nextTier;
  plant.powderUpgradeStartedAt = now;
  plant.powderUpgradeDurationMs = level4GrowMs;
  plant.needsFirstWater = true;
  plant.becameEmptyAt = null;
  plant.grassAuto5EligibleAt = null;
  return true;
}

/** 클릭 시 실제로 가루가 소비되는지(거리·티어·진행 중 등)와 동일 조건 */
function isMagicPowderUsableNow() {
  if (isOnboardingLinearGateActive()) return false;
  if (magicPowderCount <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  const nextTier = getNextPowderTargetTier(target.plant);
  if (!nextTier || isPowderUpgradeInProgress(target.plant)) return false;
  return true;
}

function tryUseMagicPowder() {
  if (isOnboardingLinearGateActive()) {
    flashOnboardingOrderHint("");
    return false;
  }
  if (magicPowderCount <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  if (!applyMagicPowderToPlant(target.plant)) return false;

  magicPowderCount = Math.max(0, magicPowderCount - 1);
  saveMagicPowderCount();
  if (target.type === "main") {
    saveSeedState();
    holdLocalPlantStateAgainstStaleSnapshot(1600);
  } else {
    saveAppleState();
    holdLocalAppleStateAgainstStaleSnapshot(1600);
    holdLocalPlantStateAgainstStaleSnapshot(1600);
  }
  syncWorldState(true);
  updateMagicPowderInventoryUi();
  updatePlantState();
  updateExtraSeedsAndPlants();
  return true;
}

function triggerWaterSplash() {
  const bucketSize = getBucketSize();
  const splashX = bucketX + bucketSize.width / 2;
  const splashY = bucketY + bucketSize.height * 0.75;
  lastWaterSplashAt = Date.now();
  lastWaterSplashX = splashX;
  lastWaterSplashY = splashY;
  let refEl = null;
  if (
    heldItem === HELD_ITEM_BUCKET &&
    playerBucketOverlay &&
    playerBucketOverlay.style.display !== "none"
  ) {
    refEl = playerBucketOverlay;
  } else if (bucket && bucket.style.display !== "none") {
    refEl = bucket;
  }
  createWaterSplashAt(splashX, splashY, refEl);
  sendMultiplayerPresence(true);
}

function getNearestWateringTarget() {
  let nearest = null;

  if (
    plantRuntime.isSeedPlanted &&
    plantRuntime.status !== "rotten" &&
    plantRuntime.status !== "dry" &&
    !plantRuntime.isOverwatered
  ) {
    const distance = getCenterDistance(
      plantRuntime.spotX,
      plantRuntime.spotY,
      PLANT_SPOT_WIDTH,
      PLANT_SPOT_HEIGHT
    );
    if (distance <= plantWaterDistance) {
      nearest = {
        type: "main",
        plant: plantRuntime,
        distance
      };
    }
  }

  appleState.extraPlants.forEach(function (plant) {
    if (plant.status === "rotten" || plant.isOverwatered || plant.status === "dry") return;
    const distance = getCenterDistance(plant.x, plant.y, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
    if (distance <= plantWaterDistance && (!nearest || distance < nearest.distance)) {
      nearest = {
        type: "extra",
        plant,
        distance
      };
    }
  });

  return nearest;
}

function createWaterSplashAt(startX, startY, refElement) {
  const viewport = document.querySelector(".viewport");
  if (!viewport) {
    return;
  }

  let baseLeft;
  let baseTop;
  if (refElement && typeof refElement.getBoundingClientRect === "function") {
    const br = refElement.getBoundingClientRect();
    if (br.width > 1 && br.height > 1) {
      baseLeft = br.left + br.width * 0.52;
      baseTop = br.top + br.height * 0.66;
    }
  }
  if (baseLeft == null || baseTop == null) {
    const anchor = document.createElement("div");
    anchor.style.cssText =
      "position:absolute;left:0;top:0;width:8px;height:8px;margin:0;padding:0;border:0;pointer-events:none;opacity:0";
    ground.appendChild(anchor);
    setWorldPosition(anchor, startX, startY);
    const r = anchor.getBoundingClientRect();
    anchor.remove();
    baseLeft = r.left + r.width / 2;
    baseTop = r.top + r.height / 2;
  }

  for (let index = 0; index < 8; index += 1) {
    const spread = (index - 3.5) * 8;
    const fallX = (index - 3.5) * 11;
    const fallY = 32 + (index % 3) * 12;

    const holder = document.createElement("div");
    holder.className = "water-splash-holder";
    holder.style.cssText =
      "position:fixed;left:" +
      (baseLeft + spread) +
      "px;top:" +
      baseTop +
      "px;pointer-events:none;z-index:450;";

    const drop = document.createElement("div");
    drop.className = "water-drop";
    drop.style.setProperty("--drop-x", fallX + "px");
    drop.style.setProperty("--drop-y", fallY + "px");
    holder.appendChild(drop);
    viewport.appendChild(holder);

    window.setTimeout(function () {
      if (holder.parentNode) {
        holder.parentNode.removeChild(holder);
      }
    }, 720);
  }
}

function waterPlant(target) {
  if (target && target.type === "extra") {
    waterExtraPlant(target.plant);
    return;
  }

  const now = Date.now();

  updatePlantWaterLevel();

  const waterCapacity = getPlantWaterCapacity(plantRuntime);

  const isFirstWater = plantRuntime.needsFirstWater || plantRuntime.growthStartedAt === null;

  plantRuntime.lastWateredAt = now;
  plantRuntime.needsFirstWater = false;

  if (
    plantRuntime.growthStartedAt === null &&
    !plantRuntime.isSproutGrown &&
    !plantRuntime.blockSproutRegrowthAfterDry
  ) {
    plantRuntime.growthStartedAt = now;
  }

  plantRuntime.wateredAtList = plantRuntime.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);

  if (plantRuntime.isOverwatered || plantRuntime.status === "rotten") {
    saveSeedState();
    syncWorldState(true);
    updatePlantState();
    return;
  }

  if (isFirstWater || plantRuntime.waterLevel <= 0) {
    plantRuntime.waterLevel = 1;
    plantRuntime.isOverwatered = false;
    plantRuntime.status = "normal";
  } else if (plantRuntime.waterLevel >= waterCapacity) {
    if (shouldPauseWaterDecayForPlant(plantRuntime, now)) {
      // Final idle stage(3/5): keep healthy even when players keep watering.
      plantRuntime.waterLevel = waterCapacity;
      plantRuntime.isOverwatered = false;
      plantRuntime.status = "normal";
    } else {
      // Already at the cap. Pouring more water rots the plant: the soil flips to
      // the rotten image and the sprout disappears, then the slot is cleared
      // a few seconds later so the player can plant something new.
      plantRuntime.isOverwatered = true;
      plantRuntime.status = "rotten";
      plantRuntime.rottenAt = now;
      plantRuntime.growthStartedAt = null;
      plantRuntime.isSproutGrown = false;
      plantRuntime.sproutGrownAt = null;
      plantRuntime.sproutEvolutionMs = 0;
      plantRuntime.sproutEvolutionLastTickAt = null;
      plantRuntime.isSproutSelfSustaining = false;
      plantRuntime.needsFirstWater = false;
    }
  } else {
    plantRuntime.waterLevel = Math.min(waterCapacity, plantRuntime.waterLevel + 1);
    plantRuntime.isOverwatered = false;
    plantRuntime.status = "normal";
  }

  plantRuntime.waterLevelUpdatedAt = now;
  plantRuntime.becameEmptyAt = null;
  holdLocalPlantStateAgainstStaleSnapshot(1200);

  saveSeedState();
  syncWorldState(true);
  updatePlantState();
  onboardingHookWateredMainPlantFromTutorial();
}

function waterExtraPlant(plant) {
  const now = Date.now();
  normalizeExtraPlantState(plant);
  updateExtraPlantWaterLevel(plant, now);
  const waterCapacity = getPlantWaterCapacity(plant);

  const isFirstWater = plant.needsFirstWater || plant.growthStartedAt === null;

  plant.lastWateredAt = now;
  plant.needsFirstWater = false;

  if (
    plant.growthStartedAt === null &&
    !plant.isSproutGrown &&
    !plant.blockSproutRegrowthAfterDry
  ) {
    plant.growthStartedAt = now;
  }

  plant.wateredAtList = plant.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);

  if (plant.isOverwatered || plant.status === "rotten") {
    saveAppleState();
    syncWorldState(true);
    updateExtraSeedsAndPlants();
    return;
  }

  if (isFirstWater || plant.waterLevel <= 0) {
    plant.waterLevel = 1;
    plant.isOverwatered = false;
    plant.status = "normal";
  } else if (plant.waterLevel >= waterCapacity) {
    if (shouldPauseWaterDecayForPlant(plant, now)) {
      plant.waterLevel = waterCapacity;
      plant.isOverwatered = false;
      plant.status = "normal";
    } else {
      plant.isOverwatered = true;
      plant.status = "rotten";
      plant.rottenAt = now;
      plant.growthStartedAt = null;
      plant.isSproutGrown = false;
      plant.sproutGrownAt = null;
      plant.sproutEvolutionMs = 0;
      plant.sproutEvolutionLastTickAt = null;
      plant.isSproutSelfSustaining = false;
      plant.needsFirstWater = false;
    }
  } else {
    plant.waterLevel = Math.min(waterCapacity, plant.waterLevel + 1);
    plant.isOverwatered = false;
    plant.status = "normal";
  }

  plant.waterLevelUpdatedAt = now;
  plant.becameEmptyAt = null;
  holdLocalPlantStateAgainstStaleSnapshot(1200);
  holdLocalAppleStateAgainstStaleSnapshot(1200);

  saveAppleState();
  syncWorldState(true);
  updateExtraSeedsAndPlants();
}

function updatePlantWaterLevel() {
  if (
    !plantRuntime.isSeedPlanted ||
    plantRuntime.isOverwatered ||
    plantRuntime.status === "dry" ||
    plantRuntime.status === "rotten"
  ) {
    return;
  }

  const now = Date.now();

  if (shouldPauseWaterDecayForPlant(plantRuntime, now)) {
    if (plantRuntime.waterLevel > 0 && plantRuntime.becameEmptyAt != null) {
      plantRuntime.becameEmptyAt = null;
    }
    if (plantRuntime.waterLevel <= 0 && plantRuntime.becameEmptyAt === null) {
      plantRuntime.becameEmptyAt = plantRuntime.waterLevelUpdatedAt || now;
    }
    plantRuntime.waterLevelUpdatedAt = now;
    return;
  }

  applyPlantWaterDecay(plantRuntime, now);

  if (plantRuntime.waterLevel === 0 && plantRuntime.becameEmptyAt === null) {
    plantRuntime.becameEmptyAt = plantRuntime.waterLevelUpdatedAt;
  }

  if (plantRuntime.waterLevel < getPlantWaterCapacity(plantRuntime) && !plantRuntime.isOverwatered) {
    plantRuntime.isOverwatered = false;
  }

  saveSeedState({
    bumpMergeGuard: false,
    skipWorldDirty: isSharedWorldMergeActive()
  });
}

function updatePlantState() {
  if (!plantRuntime.isSeedPlanted) {
    waterNeeded.style.display = "none";
    plantCard.style.display = "none";
    growthCard.style.display = "none";
    sprout.style.display = "none";
    plantSpot.removeAttribute("title");
    sprout.removeAttribute("title");
    if (plantCardTitle) plantCardTitle.textContent = "";
    if (mainPlantGrowthMeter && mainPlantGrowthMeter.element) {
      mainPlantGrowthMeter.element.style.display = "none";
    }
    return;
  }

  const now = Date.now();

  if (
    (plantRuntime.status === "rotten" || plantRuntime.isOverwatered) &&
    plantRuntime.rottenAt != null
  ) {
    const rotAt = Number(plantRuntime.rottenAt);
    if (Number.isFinite(rotAt) && now - rotAt >= plantRotClearMs) {
      removeMainPlant();
      saveSeedState();
      syncWorldState(true);
      return;
    }
  }

  if (plantRuntime.status === "dry" && plantRuntime.drySoilAt != null) {
    const dryAt = Number(plantRuntime.drySoilAt);
    if (Number.isFinite(dryAt) && now - dryAt >= plantDrySoilClearMs) {
      removeMainPlant();
      saveSeedState();
      syncWorldState(true);
      return;
    }
  } else if (plantRuntime.status !== "dry") {
    plantRuntime.drySoilAt = null;
  }

  if (
    plantRuntime.status === "dry" &&
    (plantRuntime.drySoilAt == null || !Number.isFinite(Number(plantRuntime.drySoilAt)))
  ) {
    plantRuntime.drySoilAt = now;
  }

  normalizePlantSproutFieldsWhenSoilDry(plantRuntime);
  updatePlantWaterLevel();
  ensureGrassAuto5EligibleForTier4Plant(plantRuntime, now);
  if (tickPowderUpgrade(plantRuntime, now)) {
    saveSeedState();
    syncWorldState(true);
  }
  if (tickGrassAutoAdvanceToTier5(plantRuntime, now)) {
    saveSeedState();
    syncWorldState(true);
  }

  if (plantRuntime.isSproutGrown && !plantRuntime.isSproutSelfSustaining) {
    tickSproutEvolution(plantRuntime, now);
  }

  if (
    plantRuntime.growthStartedAt != null &&
    plantRuntime.status !== "dry" &&
    plantRuntime.status !== "rotten" &&
    !plantRuntime.isOverwatered &&
    !plantRuntime.isSproutGrown &&
    now - plantRuntime.growthStartedAt >= getPlantFirstGrowthDurationMs(plantRuntime)
  ) {
    plantRuntime.isSproutGrown = true;
    plantRuntime.sproutGrownAt = now;
    plantRuntime.sproutEvolutionMs = 0;
    plantRuntime.sproutEvolutionLastTickAt = now;
    plantRuntime.isSproutSelfSustaining = false;
    saveSeedState({
      bumpMergeGuard: false,
      skipWorldDirty: isSharedWorldMergeActive()
    });
  }

  if (
    plantRuntime.status !== "dry" &&
    canPlantWiltFromEmptyWater(plantRuntime, now) &&
    plantRuntime.status !== "rotten" &&
    plantRuntime.becameEmptyAt !== null &&
    now - plantRuntime.becameEmptyAt >= getMainDryAfterEmptyMsForPlant(plantRuntime, now)
  ) {
    // 마른 땅(말라 죽은 작물): 싹 비움 · 물 주기 불가 · plantDrySoilClearMs 후 칸 제거
    plantRuntime.status = "dry";
    plantRuntime.isOverwatered = false;
    plantRuntime.needsFirstWater = true;
    plantRuntime.blockSproutRegrowthAfterDry = true;
    plantRuntime.drySoilAt = now;
    cancelPlantPowderUpgrade(plantRuntime);
    plantRuntime.isSproutGrown = false;
    plantRuntime.sproutGrownAt = null;
    plantRuntime.growthStartedAt = null;
    plantRuntime.sproutEvolutionMs = 0;
    plantRuntime.sproutEvolutionLastTickAt = null;
    plantRuntime.isSproutSelfSustaining = false;
    saveSeedState();
  }

  const mainSoilRotten = plantRuntime.status === "rotten" || plantRuntime.isOverwatered;

  if (mainSoilRotten) {
    plantSpot.src = "이미지/soil-rotten.png";
  } else if (plantRuntime.status === "wet") {
    plantSpot.src = "이미지/soil-wet.png";
  } else if (plantRuntime.status === "dry") {
    plantSpot.src = "이미지/soil-dry.png";
  } else {
    plantSpot.src = "이미지/tilled-soil.png";
  }

  if (mainSoilRotten) {
    waterNeeded.style.display = "none";
    plantCard.style.display = "none";
    growthCard.style.display = "none";
    sprout.style.display = "none";
  } else if (shouldShowFirstWaterNeededDroplet(plantRuntime)) {
    waterNeeded.style.display = "block";
    setWorldPosition(
      waterNeeded,
      plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
      plantRuntime.spotY - WATER_NEEDED_SIZE - 2
    );
  } else {
    waterNeeded.style.display = "none";
  }

  ensureGrassOrdinalIfNeeded(plantRuntime);
  updatePlantCard();
  updatePlantGrowth();
  if (!mainSoilRotten) {
    plantSpot.style.display = shouldHideSeparateSoilUnderBigGrass(plantRuntime) ? "none" : "block";
  } else {
    plantSpot.style.display = "block";
  }
}

function shouldSuppressPlantWaterCardForSelfSustaining(plant) {
  return false;
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
  plantRuntime.rottenAt = null;
  plantRuntime.needsFirstWater = false;
  plantRuntime.growthStartedAt = null;
  plantRuntime.isSproutGrown = false;
  plantRuntime.sproutGrownAt = null;
  plantRuntime.sproutEvolutionMs = 0;
  plantRuntime.sproutEvolutionLastTickAt = null;
  plantRuntime.isSproutSelfSustaining = false;
  plantRuntime.growthTier = 0;
  plantRuntime.waterCapacity = 2;
  plantRuntime.powderUpgradeTargetTier = 0;
  plantRuntime.powderUpgradeStartedAt = null;
  plantRuntime.powderUpgradeDurationMs = 0;
  plantRuntime.grassAuto5EligibleAt = null;
  plantRuntime.ownerUserId = "";
  plantRuntime.ownerDisplayName = "";
  plantRuntime.sproutOrdinal = 0;
  plantRuntime.grassOrdinal = null;
  plantRuntime.plantedAt = null;
  plantRuntime.blockSproutRegrowthAfterDry = false;
  plantRuntime.drySoilAt = null;
  plantSpot.removeAttribute("title");
  sprout.removeAttribute("title");
  hidePlantHoverLabel();
  if (plantCardTitle) plantCardTitle.textContent = "";
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
    if (
      plant.status === "dry" ||
      plant.status === "rotten" ||
      plant.isOverwatered ||
      shouldSuppressPlantWaterCardForSelfSustaining(plant)
    ) {
      plantCard.style.display = "none";
      if (plantCardTitle) plantCardTitle.textContent = "";
      return;
    }

    plantCard.style.display = "block";
    if (plantCardTitle) plantCardTitle.textContent = getPlantWorldLabel(plant);
    plantCard.classList.toggle("is-dry", plant.status === "dry");
    plantCard.classList.toggle("is-overwatered", plant.isOverwatered);
    const waterCapacity = getPlantWaterCapacity(plant);
    plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plant.waterLevel + "/" + waterCapacity;
    plantWaterSegments.forEach(function (segment, index) {
      segment.style.display = index < waterCapacity ? "block" : "none";
      segment.classList.toggle("is-filled", index < plant.waterLevel);
    });
    syncPlantCardWaterReadoutVisibility(plant, Date.now());
    return;
  }

  if (
    !plantRuntime.isSeedPlanted ||
    plantRuntime.status === "dry" ||
    plantRuntime.status === "rotten" ||
    plantRuntime.isOverwatered ||
    shouldSuppressPlantWaterCardForSelfSustaining(plantRuntime) ||
    !wateringTarget
  ) {
    plantCard.style.display = "none";
    if (plantCardTitle) plantCardTitle.textContent = "";
    return;
  }

  plantCard.style.display = "block";
  if (plantCardTitle) plantCardTitle.textContent = getPlantWorldLabel(plantRuntime);
  plantCard.classList.toggle("is-dry", plantRuntime.status === "dry");
  plantCard.classList.toggle("is-overwatered", plantRuntime.isOverwatered);
  const waterCapacity = getPlantWaterCapacity(plantRuntime);
  plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plantRuntime.waterLevel + "/" + waterCapacity;

  plantWaterSegments.forEach(function (segment, index) {
    segment.style.display = index < waterCapacity ? "block" : "none";
    segment.classList.toggle("is-filled", index < plantRuntime.waterLevel);
  });
  syncPlantCardWaterReadoutVisibility(plantRuntime, Date.now());

}

function updatePlantGrowth() {
  const now = Date.now();
  const powderRatio = getPowderUpgradeRatio(plantRuntime, now);
  if (
    !plantRuntime.isSeedPlanted ||
    (plantRuntime.growthStartedAt === null &&
      powderRatio === null &&
      !plantRuntime.isSproutGrown) ||
    plantRuntime.status === "dry" ||
    plantRuntime.status === "rotten" ||
    plantRuntime.isOverwatered
  ) {
    growthCard.style.display = "none";
    mainPlantGrowthMeter.element.style.display = "none";
    sprout.style.display =
      plantRuntime.isSproutGrown && plantRuntime.status !== "rotten" && plantRuntime.status !== "dry"
        ? "block"
        : "none";
    updateSproutPosition();
    return;
  }

  const elapsed = plantRuntime.growthStartedAt === null ? 0 : now - plantRuntime.growthStartedAt;
  const growthRatio = plantRuntime.growthStartedAt === null
    ? 1
    : Math.min(1, elapsed / getPlantFirstGrowthDurationMs(plantRuntime));
  const secondGrowthRatio = getPlantSecondGrowthRatio(plantRuntime, now);
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
      plantRuntime.sproutGrownAt = now;
      plantRuntime.sproutEvolutionMs = 0;
      plantRuntime.sproutEvolutionLastTickAt = now;
      plantRuntime.isSproutSelfSustaining = false;
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
  updateSproutPosition();
}

function updateSproutPosition() {
  if (!plantRuntime.isSproutGrown || plantRuntime.status === "rotten" || plantRuntime.status === "dry") {
    sprout.style.display = "none";
    sprout.removeAttribute("title");
    return;
  }

  const stage = getSproutStageFromPlant(plantRuntime);
  const sproutSize = getSproutSizeForStage(stage);
  sprout.style.display = "block";
  sprout.classList.toggle("is-big", stage >= 2);
  sprout.src = getSproutImageForStage(stage);
  setWorldSize(sprout, sproutSize.width, sproutSize.height);
  const sproutPos = getSproutWorldPositionForPlant(
    plantRuntime.spotX,
    plantRuntime.spotY,
    sproutSize,
    stage
  );
  setWorldPosition(sprout, sproutPos.x, sproutPos.y);
  updateNpcPosition();
}

function updateNpcPosition() {
  if (!isPlantMasterVisible()) {
    plantMaster.style.display = "none";
    npcBubble.style.display = "none";
    return;
  }

  plantMaster.style.display = "block";
  setWorldPosition(plantMaster, npcX, npcY);

  if (npcBubble.style.display === "block") {
    layoutNpcSpeechBubble();
  }

  if (playerBubble.style.display === "block") {
    updatePlayerBubblePosition();
  } else {
    playerBubble.classList.remove("is-in-front-of-name");
  }

  updateNpcPrompt();
}

function updatePlayerBubblePosition() {
  const playerWorldLeft = playerX;
  const playerRenderedHeight = player.offsetHeight || PLAYER_HEIGHT;
  const playerWorldTop =
    GROUND_WORLD_HEIGHT - playerRenderedHeight - playerDepth + jumpY;
  const bw = playerBubble.offsetWidth || 36;
  const bubbleWorldY =
    speechBubbleTopWorldYFromHead(playerWorldTop, playerBubble) -
    PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD;
  playerBubble.classList.toggle(
    "is-in-front-of-name",
    Boolean(isNpcDialogueRunning && playerBubble.style.display === "block")
  );
  setPlayerBubbleWorldPosition(
    playerWorldLeft + PLAYER_WIDTH / 2 - bw / 2,
    bubbleWorldY
  );
}

function updateNpcPrompt() {
  if (isNpcDialogueRunning) return;

  if (isNearPlantMaster()) {
    if (npcBubble.dataset.promptShown === "true") return;

    npcBubble.dataset.speaker = "npc";
    npcBubble.dataset.promptShown = "true";
    npcBubble.textContent = isNpcDialogueComplete
      ? "\uB2E4\uC74C\uC5D0 \uB610 \uC624\uC2DC\uAC8C"
      : "\uC790\uB124 \uC2DD\uBB3C\uC758 \uB2EC\uC778\uC774 \uB418\uC5B4 \uBCF4\uC9C0 \uC54A\uACA0\uB098?";
    npcBubble.style.display = "block";
    layoutNpcSpeechBubble();

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

  const playerBox = getPlayerBox();
  const alertWidth = playerAlert.offsetWidth || 10;
  const alertHeight = playerAlert.offsetHeight || 10;
  const x = toScreenX(playerBox.left + playerBox.width / 2) - alertWidth / 2;
  const y = toScreenY(playerBox.top) - alertHeight - 4;
  playerAlert.style.transform = "translate(" + x + "px, " + y + "px)";
}

function updateGuideCard() {
  const nearSign = isNearSignBoard();
  if (hasGuideBook) {
    guideBook.style.display = "none";
    guideBookButton.style.display = "block";
  }
  const shouldShow =
    hasGuideBook && (isGuideBookOpen || (nearSign && !isGuideDismissedAtSign));

  if (shouldShow) {
    guideCard.style.display = "block";
    updateGuidePages();
  } else {
    guideCard.style.display = "none";
  }

  guideBook.classList.toggle("is-near", !hasGuideBook && isNearGuideBook());
  guideBookButton.classList.toggle(
    "is-click-prompt",
    hasGuideBook && isGuideBookClickPromptActive
  );

  if (
    !getStoredFlag(onboardingFlowDoneKey) &&
    onboardingFlowStep === 2 &&
    shouldShow &&
    guideCard.style.display === "block"
  ) {
    onboardingFlowStep = 3;
    onboardingFirstGuideEscHintShown = false;
    persistOnboardingStep();
    scheduleOnboardingFirstGuideEscHint();
  }
}

function getGuideMaxPage() {
  return 0;
}

function updateGuidePages() {
  if (isGuidePlantPageUnlocked && guidePlantPageHtml) {
    guidePages[0].innerHTML = guidePlantPageHtml;
  } else {
    guidePages[0].innerHTML = guidePlaceholderHtml;
  }
  if (guidePages[1]) {
    guidePages[1].classList.remove("is-active");
  }

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
  lastWellStateChangeAt = Date.now();
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
    const previousWater = wellState.water;
    wellState.water = Math.min(maxWellWater, wellState.water + elapsedRefills);
    // Advance the refill anchor deterministically so every client computes the
    // same wellState.water from the same lastRefillAt. Using "now" here would
    // diverge across clients (clock skew) and the resulting saves would
    // flip-flop the visible water amount as snapshots overwrote each other.
    wellState.lastRefillAt += elapsedRefills * wellRefillMs;

    if (previousWater !== wellState.water) {
      // Auto-refill is deterministic from lastRefillAt, so we keep it local-only
      // to avoid spamming snapshots that race with player actions on other
      // clients. Persist only to localStorage so a tab reload sees the latest
      // computed value without forcing a multiplayer broadcast.
      saveWellStateToStorage({
        wellWaterKey,
        lastWellRefillKey,
        wellWater: wellState.water,
        lastWellRefillAt: wellState.lastRefillAt
      });
    }
  }

  updateWellImage();
  updateWellCard();
}

function updateWellImage() {
  well.src = wellState.water > 0 ? "이미지/well.png" : "이미지/well-empty.png";
}

function updateWellCard() {
  const isVisible = isNearWell();
  const waterRatio = wellState.water / maxWellWater;
  const wellImage = wellState.water > 0 ? "이미지/well.png" : "이미지/well-empty.png";

  wellCard.style.display = isVisible ? "flex" : "none";
  wellCardImage.src = wellImage;
  wellWaterText.textContent = wellState.water + "/" + maxWellWater;
  wellWaterFill.style.width = waterRatio * 100 + "%";
}

function updateSeedCard() {
  updateSeedDryState();
  seedCard.style.display = "none";
  seedWorldText.style.display = "none";
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
  const wlu = loadedPlant.plantWaterLevelUpdatedAt;
  plantRuntime.waterLevelUpdatedAt =
    wlu != null && Number.isFinite(Number(wlu)) && Number(wlu) > 0 ? Number(wlu) : Date.now();
  plantRuntime.becameEmptyAt = loadedPlant.plantBecameEmptyAt;
  plantRuntime.isOverwatered = loadedPlant.isPlantOverwatered;
  plantRuntime.rottenAt = Object.prototype.hasOwnProperty.call(loadedPlant, "plantRottenAt")
    ? loadedPlant.plantRottenAt
    : null;
  plantRuntime.needsFirstWater = loadedPlant.plantNeedsFirstWater;
  plantRuntime.growthStartedAt = loadedPlant.plantGrowthStartedAt;
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "plantPlantedAt")) {
    plantRuntime.plantedAt =
      loadedPlant.plantPlantedAt != null ? Number(loadedPlant.plantPlantedAt) || null : null;
  } else {
    plantRuntime.plantedAt = null;
  }
  plantRuntime.isSproutGrown = loadedPlant.isSproutGrown;
  plantRuntime.sproutGrownAt =
    loadedPlant.plantSproutGrownAt ||
    (plantRuntime.isSproutGrown && plantRuntime.growthStartedAt
      ? plantRuntime.growthStartedAt
      : null);

  const hadEvolutionKey = Object.prototype.hasOwnProperty.call(loadedPlant, "sproutEvolutionMs");
  const hadSelfKey = Object.prototype.hasOwnProperty.call(loadedPlant, "isSproutSelfSustaining");
  plantRuntime.isSproutSelfSustaining = hadSelfKey ? Boolean(loadedPlant.isSproutSelfSustaining) : false;

  if (!hadEvolutionKey) {
    plantRuntime.sproutEvolutionMs = 0;
    if (
      plantRuntime.isSproutGrown &&
      plantRuntime.sproutGrownAt &&
      !plantRuntime.isSproutSelfSustaining
    ) {
      const elapsed = Date.now() - plantRuntime.sproutGrownAt;
      if (elapsed >= biggerSproutMs) {
        plantRuntime.isSproutSelfSustaining = true;
        plantRuntime.sproutEvolutionMs = sproutStage1Ms + sproutStage2GrowMs;
      } else if (elapsed > 0) {
        plantRuntime.sproutEvolutionMs = Math.floor(
          (elapsed / biggerSproutMs) * (sproutStage1Ms + sproutStage2GrowMs - 1)
        );
      }
    }
  } else {
    plantRuntime.sproutEvolutionMs = Math.max(0, Number(loadedPlant.sproutEvolutionMs) || 0);
  }

  plantRuntime.sproutEvolutionLastTickAt = Date.now();
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "growthTier")) {
    plantRuntime.growthTier = Math.max(0, Number(loadedPlant.growthTier) || 0);
  }
  plantRuntime.waterCapacity = Math.max(2, Number(loadedPlant.waterCapacity) || 2);
  plantRuntime.powderUpgradeTargetTier = Math.max(
    0,
    Number(loadedPlant.powderUpgradeTargetTier) || 0
  );
  plantRuntime.powderUpgradeStartedAt = Number(loadedPlant.powderUpgradeStartedAt) || null;
  plantRuntime.powderUpgradeDurationMs = Math.max(
    0,
    Number(loadedPlant.powderUpgradeDurationMs) || 0
  );
  if (
    Object.prototype.hasOwnProperty.call(loadedPlant, "grassAuto5EligibleAt") &&
    loadedPlant.grassAuto5EligibleAt != null &&
    Number.isFinite(Number(loadedPlant.grassAuto5EligibleAt))
  ) {
    plantRuntime.grassAuto5EligibleAt = Number(loadedPlant.grassAuto5EligibleAt);
  } else {
    plantRuntime.grassAuto5EligibleAt = null;
  }
  migrateLegacyPowderTier5ToAutoGrass(plantRuntime, Date.now());

  plantRuntime.ownerUserId =
    loadedPlant.ownerUserId != null ? String(loadedPlant.ownerUserId) : "";
  plantRuntime.ownerDisplayName =
    loadedPlant.ownerDisplayName != null ? String(loadedPlant.ownerDisplayName) : "";
  plantRuntime.sproutOrdinal = Math.max(0, Number(loadedPlant.sproutOrdinal) || 0);
  plantRuntime.grassOrdinal =
    loadedPlant.grassOrdinal != null && Number.isFinite(Number(loadedPlant.grassOrdinal))
      ? Math.max(1, Number(loadedPlant.grassOrdinal))
      : null;

  if (Object.prototype.hasOwnProperty.call(loadedPlant, "blockSproutRegrowthAfterDry")) {
    plantRuntime.blockSproutRegrowthAfterDry = Boolean(loadedPlant.blockSproutRegrowthAfterDry);
  } else {
    plantRuntime.blockSproutRegrowthAfterDry = plantRuntime.status === "dry";
  }
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "drySoilAt")) {
    const da = Number(loadedPlant.drySoilAt);
    plantRuntime.drySoilAt =
      Number.isFinite(da) && da > 0 ? da : null;
  } else {
    plantRuntime.drySoilAt = null;
  }

  if (plantRuntime.status === "rotten" || plantRuntime.isOverwatered) {
    plantRuntime.status = "rotten";
    if (!plantRuntime.rottenAt) plantRuntime.rottenAt = Date.now();
    plantRuntime.growthStartedAt = null;
    plantRuntime.isSproutGrown = false;
    plantRuntime.sproutGrownAt = null;
    plantRuntime.sproutEvolutionMs = 0;
    plantRuntime.sproutEvolutionLastTickAt = null;
    plantRuntime.isSproutSelfSustaining = false;
    plantRuntime.needsFirstWater = false;
    plantRuntime.grassAuto5EligibleAt = null;
    plantRuntime.blockSproutRegrowthAfterDry = false;
    plantRuntime.drySoilAt = null;
  }
  if (plantRuntime.status === "dry") {
    normalizePlantSproutFieldsWhenSoilDry(plantRuntime);
    plantRuntime.blockSproutRegrowthAfterDry = true;
    if (plantRuntime.drySoilAt == null) {
      plantRuntime.drySoilAt = Date.now();
    }
  }
  if (plantRuntime.plantedAt == null && plantRuntime.isSeedPlanted) {
    plantRuntime.plantedAt = Number(loadedPlant.plantGrowthStartedAt) || null;
  }
  if (!plantRuntime.isSeedPlanted) {
    plantRuntime.plantedAt = null;
  }
  if (plantRuntime.isSproutSelfSustaining && plantRuntime.growthTier < 3) {
    plantRuntime.growthTier = 3;
  }
  plantRuntime.waterCapacity = plantRuntime.growthTier >= 3 ? 3 : 2;
  clampPlantGrowthTimingToCurrentConstants(plantRuntime);
  ensureGrassOrdinalIfNeeded(plantRuntime);
  ensureGrassAuto5EligibleForTier4Plant(plantRuntime, Date.now());
  if (isApplyingWorldState && plantRuntime.isSeedPlanted) {
    stabilizeFirstWaterHintFlags(plantRuntime);
  }
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
    plantRottenAt: plantRuntime.rottenAt,
    plantNeedsFirstWater: plantRuntime.needsFirstWater,
    plantGrowthStartedAt: plantRuntime.growthStartedAt,
    plantPlantedAt: plantRuntime.plantedAt != null ? plantRuntime.plantedAt : null,
    plantedAt: plantRuntime.plantedAt != null ? plantRuntime.plantedAt : null,
    isSproutGrown: plantRuntime.isSproutGrown,
    plantSproutGrownAt: plantRuntime.sproutGrownAt,
    sproutEvolutionMs: plantRuntime.sproutEvolutionMs,
    sproutEvolutionLastTickAt: plantRuntime.sproutEvolutionLastTickAt,
    isSproutSelfSustaining: plantRuntime.isSproutSelfSustaining,
    growthTier: plantRuntime.growthTier,
    waterCapacity: plantRuntime.waterCapacity,
    powderUpgradeTargetTier: plantRuntime.powderUpgradeTargetTier,
    powderUpgradeStartedAt: plantRuntime.powderUpgradeStartedAt,
    powderUpgradeDurationMs: plantRuntime.powderUpgradeDurationMs,
    grassAuto5EligibleAt: plantRuntime.grassAuto5EligibleAt,
    ownerUserId: plantRuntime.ownerUserId || "",
    ownerDisplayName: plantRuntime.ownerDisplayName || "",
    sproutOrdinal: plantRuntime.sproutOrdinal || 0,
    grassOrdinal:
      plantRuntime.grassOrdinal != null && Number.isFinite(Number(plantRuntime.grassOrdinal))
        ? plantRuntime.grassOrdinal
        : null,
    blockSproutRegrowthAfterDry: Boolean(plantRuntime.blockSproutRegrowthAfterDry),
    drySoilAt:
      plantRuntime.drySoilAt != null && Number.isFinite(Number(plantRuntime.drySoilAt))
        ? Number(plantRuntime.drySoilAt)
        : null,
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
  const legacyDefaultNpcX = SEED_START_X + 18;
  let npcLayoutNeedsPersist = false;
  if (npcX === legacyDefaultNpcX) {
    npcX = NPC_START_X;
    npcLayoutNeedsPersist = true;
  }
  // Tutorial never applies the shared snapshot; NPC stays on old saved coords unless we realign.
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    signX = SIGN_START_X;
    signY = SIGN_START_Y;
    guideBookX = GUIDE_BOOK_START_X;
    guideBookY = GUIDE_BOOK_START_Y;
    setWorldPosition(signBoard, signX, signY);
    setWorldPosition(guideBook, guideBookX, guideBookY);
    if (npcX !== NPC_START_X || npcY !== NPC_START_Y) {
      npcX = NPC_START_X;
      npcY = NPC_START_Y;
      npcLayoutNeedsPersist = true;
    }
  }
  if (npcLayoutNeedsPersist) {
    markWorldDirty();
    saveSeedState();
  }

  if (plantRuntime.isSeedPlanted) {
    heldItem = null;
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    seedCard.style.display = "none";
    updatePlantState();
  }

  updateSeedDryState();
}

/**
 * @param {{ bumpMergeGuard?: boolean, skipWorldDirty?: boolean }} [opts] - bumpMergeGuard:false
 *   for sim-only deltas. skipWorldDirty:true stops enqueueing a shared save (e.g. water decay online).
 */
function saveSeedState(opts) {
  opts = opts || {};
  const bump = opts.bumpMergeGuard !== false;
  if (bump) lastMainPlantStateChangeAt = Date.now();
  saveSeedStateToStorage({
    seedCreatedAtKey,
    seedPlantedStateKey,
    seedCreatedAt: plantRuntime.seedCreatedAt,
    plantedState: getPlantStateForStorage()
  });
  if (!opts.skipWorldDirty) markWorldDirty();
}

function updateSeedDryState() {
  plantRuntime.isSeedDry = false;
}

function updatePlayerStatus() {
  const playerBox = getPlayerBox();
  const textWidth = playerStatus.offsetWidth || 40;
  const halfTextWidth = textWidth / 2;
  const targetX = toScreenX(playerBox.left + playerBox.width / 2 + 13);
  const clampedX = Math.max(
    halfTextWidth,
    Math.min(targetX, window.innerWidth - halfTextWidth)
  );
  const yWorld = toScreenY(playerBox.top + 26);

  if (plantRuntime.isPlanting || appleState.isEating) {
    playerStatus.style.display = "block";
    playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, -100%)";
    return;
  }

  if (Date.now() < plantProximityWarnUntil) {
    playerStatus.style.display = "block";
    playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, -100%)";
    return;
  }

  playerStatus.style.display = "none";
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
    return "이미지/player-white.png";
  }

  const canvas = document.createElement("canvas");
  canvas.width = playerBaseImage.naturalWidth;
  canvas.height = playerBaseImage.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return "이미지/player-white.png";
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
    window.location.replace("ovc-login.html?v=20260509a");
    return;
  }

  playerName.textContent = nameForIngameUiDisplay(accountDisplayNameForUi());

  if (hasSpawnedCharacter) {
    player.classList.remove("is-hidden-before-spawn");
    if (playerBaseImageReady) {
      applyTutorialWorldResetIfPending();
      applyPlayerColor(selectedPlayerColor);
      syncPlayerColorToServer(true);
      setupMultiplayer();
    } else {
      playerBaseImage.addEventListener("load", function onceLoaded() {
        playerBaseImage.removeEventListener("load", onceLoaded);
        applyTutorialWorldResetIfPending();
        applyPlayerColor(selectedPlayerColor);
        syncPlayerColorToServer(true);
        setupMultiplayer();
      }, { once: true });
    }
    return;
  }

  isCharacterSelecting = true;
  updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
  player.classList.add("is-hidden-before-spawn");
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}

function openCharacterColorChange() {
  onboardingStep26OpenedSettingsWithEsc = false;
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
  if (currentUserScopedHasChosenColorKey) {
    localStorage.setItem(currentUserScopedHasChosenColorKey, "true");
  }
  characterSelectOverlay.classList.remove("is-open");
  player.classList.remove("is-hidden-before-spawn");
  applyPlayerColor(selectedPlayerColor);

  syncPlayerColorToServer(true);

  restoreWorldHubIfVeteranWithoutActiveReplay();
  ovcApplyForceWorldHubBypassLoggedIn();
  if (
    isTutorialDocumentEntry() &&
    currentUserId &&
    getStoredFlag(onboardingFlowDoneKey)
  ) {
    isReloadingForWorldReset = true;
    ovcHardNavigateToWorldIndex();
    return;
  }
  if (
    isWorldDocumentEntry() &&
    currentUserId &&
    !getStoredFlag(onboardingFlowDoneKey)
  ) {
    isReloadingForWorldReset = true;
    try {
      sessionStorage.setItem("ovcTutorialWorldResetPending", "1");
    } catch (eTutSpawn) {}
    window.location.replace(ovcTutorialPageUrl());
    return;
  }

  if (!applyTutorialWorldResetIfPending()) {
    loadOnboardingFlowState();
    setWorldPosition(player, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    updateCamera();
    savePlayerPosition(true);
    saveWellState();
    saveSeedState();
    saveAppleState();
    saveBucketState();
  }

  if (!getStoredFlag(onboardingFlowDoneKey)) {
    hasHydratedSharedWorldFromServer = true;
  }

  updateOnboardingFlowUI();
  setupMultiplayer();
}

function updatePlayerName() {
  if (!currentUserName || !hasSpawnedCharacter) {
    playerName.style.display = "none";
    playerName.classList.remove("is-dialogue-layer");
    return;
  }

  const playerBox = getPlayerBox();
  playerName.textContent = nameForIngameUiDisplay(accountDisplayNameForUi());
  const nameWidth = playerName.offsetWidth || 36;
  const x = toScreenX(playerBox.left + playerBox.width / 2) - nameWidth / 2;
  const y = toScreenY(playerBox.top) + 13;

  const npcLineShowing =
    isNpcDialogueRunning && npcBubble.style.display === "block";
  playerName.classList.toggle("is-dialogue-layer", npcLineShowing);
  playerName.style.display = "block";
  playerName.style.transform = "translate(" + x + "px, " + y + "px)";
}

function isWorldSocialRealtimeReady() {
  return Boolean(multiplayerChannel && currentSessionId && isMultiplayerSubscribed);
}

function isWorldChatBlockingGameInput() {
  if (!worldSocialUiReady) return false;
  if (worldChatPanelOpen) return true;
  if (worldChatInputEl && document.activeElement === worldChatInputEl) return true;
  return false;
}

function sanitizeWorldChatText(raw) {
  let s = String(raw || "")
    .trim()
    .replace(/[\u0000-\u001F<>]/g, "");
  if (s.length > WORLD_CHAT_MAX_CHARS) s = s.slice(0, WORLD_CHAT_MAX_CHARS);
  return s;
}

function appendWorldChatLine(name, text, sessionId, sentAt) {
  const entry = {
    name: name || "OVC",
    text: text || "",
    sid: sessionId || "",
    t: Number(sentAt) || Date.now()
  };
  worldChatLog.push(entry);
  if (worldChatLog.length > WORLD_CHAT_LOG_CAP) worldChatLog.shift();
  if (!worldChatLogEl) return;
  const row = document.createElement("div");
  row.className = "world-chat-line";
  const d = new Date(entry.t);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  row.textContent = "[" + hh + ":" + mm + "] " + entry.name + ": " + entry.text;
  worldChatLogEl.appendChild(row);
  worldChatLogEl.scrollTop = worldChatLogEl.scrollHeight;
}

function setLocalChatBubble(text, hideAt) {
  localChatBubbleText = text;
  localChatBubbleHideAt = hideAt;
  if (localChatBubbleTimer) {
    clearTimeout(localChatBubbleTimer);
    localChatBubbleTimer = null;
  }
  if (!text || !playerChatBubbleEl) return;
  playerChatBubbleEl.textContent = text;
  playerChatBubbleEl.style.display = "block";
  const delay = Math.max(0, hideAt - Date.now());
  localChatBubbleTimer = setTimeout(function () {
    localChatBubbleTimer = null;
    localChatBubbleText = "";
    localChatBubbleHideAt = 0;
    if (playerChatBubbleEl) playerChatBubbleEl.style.display = "none";
  }, delay);
}

function setRemoteChatBubble(sessionId, text, hideAt) {
  if (!sessionId) return;
  remoteChatBubbles[sessionId] = { text: text, hideAt: hideAt };
  let el = remoteChatBubbleEls[sessionId];
  if (!el) {
    el = document.createElement("div");
    el.className = "world-player-chat-bubble world-remote-chat-bubble";
    document.body.appendChild(el);
    remoteChatBubbleEls[sessionId] = el;
  }
  el.textContent = text;
  el.style.display = "block";
}

function removeRemoteChatBubbleEl(sessionId) {
  const el = remoteChatBubbleEls[sessionId];
  if (el && el.parentNode) el.parentNode.removeChild(el);
  delete remoteChatBubbleEls[sessionId];
  delete remoteChatBubbles[sessionId];
}

function broadcastWorldChat(text) {
  if (!isWorldSocialRealtimeReady()) return false;
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_chat",
      payload: {
        id: currentSessionId,
        userId: currentUserId || "",
        name: nameForIngameUiDisplay(accountDisplayNameForUi()),
        text: text,
        t: Date.now()
      }
    })
  ).catch(function () {});
  return true;
}

function broadcastWorldHeart() {
  if (!isWorldSocialRealtimeReady()) return false;
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_heart",
      payload: {
        id: currentSessionId,
        userId: currentUserId || "",
        name: nameForIngameUiDisplay(accountDisplayNameForUi()),
        x: playerX,
        depth: playerDepth,
        jumpY: jumpY,
        t: Date.now()
      }
    })
  ).catch(function () {});
  return true;
}

function handleWorldChatBroadcast(payload) {
  if (!payload || !payload.id) return;
  const sid = String(payload.id);
  if (sid === String(currentSessionId)) return;
  const text = sanitizeWorldChatText(payload.text);
  if (!text) return;
  const name = nameForIngameUiDisplay(payload.name || "OVC");
  const t = Number(payload.t) || Date.now();
  appendWorldChatLine(name, text, sid, t);
  setRemoteChatBubble(sid, text, Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS);
}

function handleWorldHeartBroadcast(payload) {
  if (!payload || !payload.id) return;
  const sid = String(payload.id);
  if (sid === String(currentSessionId)) return;
  const rp = remotePlayers[sid];
  if (!rp || !rp.bodyElement) return;
  const px = Number(payload.x);
  const depth = Number(payload.depth);
  const jy = Number(payload.jumpY);
  if (Number.isFinite(px) && Number.isFinite(depth) && Number.isFinite(jy)) {
    const wy = -depth + jy;
    setWorldPosition(rp.element, px, wy);
    rp.worldX = px;
    rp.worldY = wy;
    rp.depth = depth;
    rp.jumpY = jy;
    rp.positionKey = Math.round(px * 10) + "|" + Math.round(wy * 10);
  }
  window.requestAnimationFrame(function () {
    const rpp = remotePlayers[sid];
    if (!rpp || !rpp.bodyElement) return;
    spawnWorldHeartFxNearBodyRect(rpp.bodyElement.getBoundingClientRect());
  });
}

function spawnWorldHeartFxNearBodyRect(rect) {
  if (!rect || rect.width < 2 || rect.height < 2) return;
  const root = document.createElement("div");
  root.className = "ovc-heart-fx-root";
  const inset = Math.max(1, 0.14 * rect.width);
  const sx = rect.right - inset;
  const sy = rect.top + Math.max(1, 0.12 * rect.height);
  root.style.left = Math.round(sx) + "px";
  root.style.top = Math.round(sy) + "px";
  const spreadX = Math.max(18, rect.width * 0.95);
  const rise = Math.max(14, rect.height * 0.28);
  const spreadY = Math.max(20, rect.height * 0.72);
  const fontPx = Math.max(11, Math.min(44, rect.width * 0.62));
  const n = 9;
  const hearts = ["\u2764", "\u2665", "\u2764\uFE0F"];
  for (let i = 0; i < n; i++) {
    const bit = document.createElement("span");
    bit.className = "ovc-heart-fx-bit";
    bit.textContent = hearts[i % hearts.length];
    bit.style.fontSize = fontPx + "px";
    const dx = (Math.random() - 0.35) * spreadX;
    const dy = -rise - Math.random() * spreadY;
    bit.style.setProperty("--ovc-hx", dx + "px");
    bit.style.setProperty("--ovc-hy", dy + "px");
    bit.style.animationDelay = i * 0.05 + "s";
    root.appendChild(bit);
  }
  document.body.appendChild(root);
  window.setTimeout(function () {
    if (root.parentNode) root.parentNode.removeChild(root);
  }, WORLD_HEART_FX_MS + 200);
}

function pulseWorldHeartButton() {
  if (!worldHeartBtn) return;
  worldHeartBtn.classList.remove("ovc-heart-btn-pulse");
  void worldHeartBtn.offsetWidth;
  worldHeartBtn.classList.add("ovc-heart-btn-pulse");
  window.setTimeout(function () {
    if (worldHeartBtn) worldHeartBtn.classList.remove("ovc-heart-btn-pulse");
  }, 600);
}

function updateWorldSocialChatUiEnabled() {
  const ok = isWorldSocialRealtimeReady();
  if (worldChatInputEl) {
    worldChatInputEl.disabled = !ok;
    worldChatInputEl.placeholder = ok ? "\uBA54\uC2DC\uC9C0..." : "\uBA40\uD2F0 \uC5F0\uACB0 \uD6C4 \uCC57";
  }
  if (worldChatSendBtn) worldChatSendBtn.disabled = !ok;
  if (worldHeartBtn) worldHeartBtn.disabled = !ok;
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

function layoutWorldChatBubbleOnScreen(el, rect, nowMs, sessionIdForWobble) {
  if (!el || !rect || rect.width < 2 || rect.height < 2) return false;
  const pxPerWu = rect.width / PLAYER_WIDTH;
  const fontPx = Math.max(
    5,
    Math.min(52, (WORLD_CHAT_NAMEPLATE_FONT_PX / PLAYER_WIDTH) * rect.width)
  );
  const padV = Math.max(
    1,
    Math.round((WORLD_CHAT_NAMEPLATE_PAD_V / PLAYER_WIDTH) * rect.width)
  );
  const padH = Math.max(
    2,
    Math.round((WORLD_CHAT_NAMEPLATE_PAD_H / PLAYER_WIDTH) * rect.width)
  );
  const radius = Math.max(
    2,
    Math.round((WORLD_CHAT_NAMEPLATE_RADIUS_PX / PLAYER_WIDTH) * rect.width)
  );
  const maxW = Math.min(
    window.innerWidth * 0.42,
    Math.max(48, (WORLD_CHAT_BUBBLE_MAX_WORLD_PX / PLAYER_WIDTH) * rect.width)
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

function updatePlayerChatBubbleOverlay() {
  if (!playerChatBubbleEl) return;
  const now = Date.now();
  if (!localChatBubbleText || now >= localChatBubbleHideAt) {
    playerChatBubbleEl.style.display = "none";
    if (now >= localChatBubbleHideAt) localChatBubbleText = "";
    return;
  }
  if (!hasSpawnedCharacter || isCharacterSelecting) {
    playerChatBubbleEl.style.display = "none";
    return;
  }
  const rect = player.getBoundingClientRect();
  if (!layoutWorldChatBubbleOnScreen(playerChatBubbleEl, rect, now, null)) {
    playerChatBubbleEl.style.display = "none";
  }
}

function updateRemoteChatBubbleOverlays() {
  const now = Date.now();
  Object.keys(remoteChatBubbleEls).forEach(function (sid) {
    const el = remoteChatBubbleEls[sid];
    const st = remoteChatBubbles[sid];
    const rp = remotePlayers[sid];
    if (!el) return;
    if (!st || now >= st.hideAt) {
      el.style.display = "none";
      return;
    }
    if (!st.text) {
      el.style.display = "none";
      return;
    }
    if (!rp) {
      el.style.display = "none";
      return;
    }
    el.textContent = st.text;
    const rect = rp.bodyElement.getBoundingClientRect();
    if (!layoutWorldChatBubbleOnScreen(el, rect, now, sid)) {
      el.style.display = "none";
    }
  });
}

function sendWorldChatFromUi() {
  if (!worldChatInputEl) return;
  const text = sanitizeWorldChatText(worldChatInputEl.value);
  worldChatInputEl.value = "";
  if (!text) return;
  if (!isWorldSocialRealtimeReady()) return;
  appendWorldChatLine(
    nameForIngameUiDisplay(accountDisplayNameForUi()),
    text,
    currentSessionId,
    Date.now()
  );
  setLocalChatBubble(text, Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS);
  broadcastWorldChat(text);
}

function onWorldHeartClick() {
  if (!isWorldSocialRealtimeReady()) return;
  broadcastWorldHeart();
  pulseWorldHeartButton();
  if (!player) return;
  const rect = player.getBoundingClientRect();
  spawnWorldHeartFxNearBodyRect(rect);
}

function ensureWorldSocialUi() {
  if (worldSocialUiReady) return;
  worldHeartBtn = document.createElement("button");
  worldHeartBtn.type = "button";
  worldHeartBtn.id = "world-heart-button";
  worldHeartBtn.className = "world-heart-button";
  worldHeartBtn.setAttribute("aria-label", "\uD558\uD2B8");
  worldHeartBtn.innerHTML = "\u2764\uFE0F";
  document.body.appendChild(worldHeartBtn);

  worldChatToggleBtn = document.createElement("button");
  worldChatToggleBtn.type = "button";
  worldChatToggleBtn.id = "world-chat-toggle";
  worldChatToggleBtn.className = "world-chat-toggle";
  worldChatToggleBtn.setAttribute("aria-label", "\uCC57");
  worldChatToggleBtn.textContent = "\uD83D\uDCAC";
  document.body.appendChild(worldChatToggleBtn);

  worldChatPanelEl = document.createElement("div");
  worldChatPanelEl.id = "world-chat-panel";
  worldChatPanelEl.className = "world-chat-panel";
  worldChatPanelEl.setAttribute("aria-hidden", "true");
  worldChatLogEl = document.createElement("div");
  worldChatLogEl.className = "world-chat-log";
  const hint = document.createElement("div");
  hint.className = "world-chat-hint";
  hint.textContent =
    "\uBA40\uD2F0 \uC5F0\uACB0 \uD6C4 \uC804\uC124 \uCC57\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.";
  worldChatLogEl.appendChild(hint);
  const inpRow = document.createElement("div");
  inpRow.className = "world-chat-input-row";
  worldChatInputEl = document.createElement("input");
  worldChatInputEl.type = "text";
  worldChatInputEl.className = "world-chat-input";
  worldChatInputEl.maxLength = WORLD_CHAT_MAX_CHARS;
  worldChatInputEl.autocomplete = "off";
  worldChatSendBtn = document.createElement("button");
  worldChatSendBtn.type = "button";
  worldChatSendBtn.className = "world-chat-send";
  worldChatSendBtn.textContent = "\uC804\uC1A1";
  inpRow.appendChild(worldChatInputEl);
  inpRow.appendChild(worldChatSendBtn);
  worldChatPanelEl.appendChild(worldChatLogEl);
  worldChatPanelEl.appendChild(inpRow);
  document.body.appendChild(worldChatPanelEl);

  playerChatBubbleEl = document.createElement("div");
  playerChatBubbleEl.id = "player-chat-bubble";
  playerChatBubbleEl.className = "world-player-chat-bubble world-local-chat-bubble";
  playerChatBubbleEl.style.display = "none";
  document.body.appendChild(playerChatBubbleEl);

  worldHeartBtn.addEventListener("click", function () {
    onWorldHeartClick();
  });
  worldChatToggleBtn.addEventListener("click", function () {
    worldChatPanelOpen = !worldChatPanelOpen;
    worldChatPanelEl.classList.toggle("is-open", worldChatPanelOpen);
    worldChatPanelEl.setAttribute("aria-hidden", worldChatPanelOpen ? "false" : "true");
    if (worldChatPanelOpen) {
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      worldChatInputEl.focus();
    }
  });
  worldChatSendBtn.addEventListener("click", function () {
    sendWorldChatFromUi();
  });
  worldChatInputEl.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      sendWorldChatFromUi();
    }
  });

  worldSocialUiReady = true;
  updateWorldSocialChatUiEnabled();
}

function updateWorldSocialOverlaysInGameLoop() {
  if (!worldSocialUiReady) return;
  updateWorldSocialChatUiEnabled();
  updatePlayerChatBubbleOverlay();
  updateRemoteChatBubbleOverlays();
}

function setupMultiplayer() {
  if (isTabSessionSuperseded) return;
  if (!hasSpawnedCharacter) {
    updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
    addNetworkDebugLog("multiplayer skipped: character not spawned");
    return;
  }

  if (isSharedWorldSyncPausedForTutorial()) {
    teardownMultiplayerForTutorial();
    updateMultiplayerStatus(
      "튜토리얼: 다른 플레이어/세상 비공유 · 멀티 미연결"
    );
    addNetworkDebugLog("multiplayer skipped: tutorial single-player world");
    return;
  }

  if (multiplayerChannel) {
    if (isMultiplayerSubscribed) {
      updateMultiplayerStatus("\uC5F0\uACB0\uB428");
      sendMultiplayerPresence(true);
      addNetworkDebugLog("multiplayer reuse: subscribed channel");
    } else {
      updateMultiplayerStatus("\uC5F0\uACB0\uC911");
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
    updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
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

  updateMultiplayerStatus("\uC5F0\uACB0\uC911");
  const channel = window.OVCOnline.createPresenceChannel(
    window.OVC_ONLINE_CONFIG.multiplayerRoom,
    currentSessionId
  );
  multiplayerChannel = channel;
  const attempt = ++multiplayerConnectAttempt;

  if (!channel) {
    updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
    addNetworkDebugLog("multiplayer failed: createPresenceChannel returned null");
    return;
  }
  let terminalHandled = false;

  channel
    .on("broadcast", { event: "player_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemotePlayerBroadcast(payload.payload);
    })
    .on("broadcast", { event: "bucket_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteBucketBroadcast(payload.payload);
    })
    .on("broadcast", { event: "butterfly_catch" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteButterflyCatchBroadcast(payload.payload);
    })
    .on("broadcast", { event: "world_loose_seed_pickup" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteWorldLooseSeedPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_chat" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleWorldChatBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_heart" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleWorldHeartBroadcast(payload.payload || {});
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
        updateMultiplayerStatus("\uC5F0\uACB0\uB428");
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
        clearMultiplayerRoomSessionTracking();
        updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
        scheduleMultiplayerReconnect(1500);
      }
    });
}

function sendMultiplayerPresence(forceSend) {
  if (!hasSpawnedCharacter || isTabSessionSuperseded) return;
  if (isSharedWorldSyncPausedForTutorial()) return;

  const now = Date.now();
  const shouldShowButterflyCatchAction =
    now - Number(lastLocalButterflyCatchActionAt || 0) <= REMOTE_BUTTERFLY_CATCH_ACTION_MS;
  const state = {
    id: currentSessionId,
    userId: currentUserId,
    name: nameForIngameUiDisplay(accountDisplayNameForUi()),
    action: isCraftingMagicPowder
      ? "magic_powder"
      : plantRuntime.isPlanting
        ? "planting"
        : appleState.isEating
          ? "eating"
          : shouldShowButterflyCatchAction
            ? "butterfly_catch"
          : "state",
    room: window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    color: selectedPlayerColor,
    x: playerX,
    depth: playerDepth,
    jumpY,
    waterSplashAt: lastWaterSplashAt,
    waterSplashX: lastWaterSplashX,
    waterSplashY: lastWaterSplashY,
    updatedAt: now
  };
  const stateKey = [
    state.color,
    Math.round(state.x * 10),
    Math.round(state.depth * 10),
    Math.round(state.jumpY * 10),
    state.action,
    Math.round(state.waterSplashAt || 0)
  ].join("|");
  const hasChanged = stateKey !== lastPresenceStateKey;

  // Broadcast is the primary multiplayer sync path. Keep a heartbeat so idle
  // players stay visible even when they are not moving.
  if (
    multiplayerChannel &&
    (
      forceSend ||
      (hasChanged && now - lastBroadcastAt >= MULTIPLAYER_BROADCAST_MIN_MS) ||
      now - lastHeartbeatBroadcastAt >= MULTIPLAYER_HEARTBEAT_MS
    )
  ) {
    Promise.resolve(multiplayerChannel.send({
      type: "broadcast",
      event: "player_state",
      payload: state
    })).catch(function (error) {
      addNetworkDebugLog(
        "broadcast error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
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
  if (hasChanged || now - lastPresenceDbSyncAt >= getMultiplayerPresenceDbSyncMs()) {
    syncPresenceToDatabase(state);
  }
  if (now - lastPresenceDbPollAt >= getMultiplayerPresenceDbPollMs()) {
    pollPresenceDatabase();
  }
  lastPresenceSentAt = now;
}

function broadcastBucketState(forceSend) {
  if (isSharedWorldSyncPausedForTutorial()) {
    return;
  }
  if (!multiplayerChannel || !currentSessionId) {
    addBucketTrace(
      "send-skip",
      "no-channel=" + !multiplayerChannel + " no-session=" + !currentSessionId,
      1000
    );
    return;
  }
  const now = Date.now();
  if (!forceSend && now - lastBucketBroadcastAt < 60) {
    addBucketTrace("send-skip", "throttled " + (now - lastBucketBroadcastAt) + "ms", 1000);
    return;
  }

  const payload = {
    id: currentSessionId,
    held: heldItem === HELD_ITEM_BUCKET,
    x: bucketX,
    y: bucketY,
    isFull: isBucketFull,
    updatedAt: now
  };
  Promise.resolve(multiplayerChannel.send({
    type: "broadcast",
    event: "bucket_state",
    payload
  })).catch(function () {
    // Best effort; world sync remains the fallback.
  });
  lastBucketBroadcastAt = now;
  addBucketTrace(
    "send",
    "held=" + payload.held + " x=" + Math.round(payload.x || 0) + " y=" + Math.round(payload.y || 0) + " t=" + payload.updatedAt,
    350
  );
}

function handleRemoteBucketBroadcast(payload) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!payload || !payload.id || payload.id === currentSessionId) return;
  // 내가 양동이를 들고 있을 때는 로컬이 찬/빈 상태의 유일한 기준 — 타 클라이언트 브로드캐스트가
  // isBucketFull·좌표를 덮으면 Q가 퍼기/붓기 없이 스플래시만 반복되는 것처럼 보임.
  if (heldItem === HELD_ITEM_BUCKET) {
    return;
  }
  const remoteId = String(payload.id);
  const nextUpdatedAt = Number(payload.updatedAt || 0);
  const prevUpdatedAt = Number(remoteBucketUpdateAtById[remoteId] || 0);
  if (nextUpdatedAt < prevUpdatedAt) return;
  remoteBucketUpdateAtById[remoteId] = nextUpdatedAt;

  if (payload.held === true) {
    window.OVC_SHARED_BUCKET_HELD_BY = remoteId;
    const nextX = Number(payload.x);
    const nextY = Number(payload.y);
    if (Number.isFinite(nextX)) bucketX = nextX;
    if (Number.isFinite(nextY)) bucketY = nextY;
    isBucketFull = Boolean(payload.isFull);
    addBucketTrace(
      "recv",
      "from=" + remoteId + " held=true x=" + Math.round(bucketX || 0) + " y=" + Math.round(bucketY || 0) + " t=" + nextUpdatedAt,
      350
    );
    return;
  }

  if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    const nextX = Number(payload.x);
    const nextY = Number(payload.y);
    if (Number.isFinite(nextX)) bucketX = nextX;
    if (Number.isFinite(nextY)) bucketY = nextY;
    isBucketFull = Boolean(payload.isFull);
    addBucketTrace(
      "recv",
      "from=" + remoteId + " held=false x=" + Math.round(bucketX || 0) + " y=" + Math.round(bucketY || 0) + " t=" + nextUpdatedAt,
      350
    );
  }
}

function syncPresenceToDatabase(state) {
  if (
    isPresenceDbSyncing ||
    isTabSessionSuperseded ||
    isSharedWorldSyncPausedForTutorial() ||
    !window.OVCOnline ||
    typeof window.OVCOnline.savePresence !== "function"
  ) {
    return;
  }

  isPresenceDbSyncing = true;
  lastPresenceDbSyncAt = Date.now();
  window.OVCOnline.savePresence(state).catch(function (error) {
    addNetworkDebugLog(
      "presence db save error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
    );
  }).finally(function () {
    isPresenceDbSyncing = false;
  });
}

function pollPresenceDatabase() {
  if (
    isPresenceDbPolling ||
    isTabSessionSuperseded ||
    isSharedWorldSyncPausedForTutorial() ||
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
    const idsInDb = Object.create(null);
    const now = Date.now();
    (players || []).forEach(function (state) {
      if (!state || !state.id || state.id === currentSessionId) return;
      multiplayerRoomSessionIdsLastSeen[String(state.id)] = now;
      if (isRemotePresenceSameLoggedInAccount(state)) {
        maybeApplyRemoteWaterSplashFromBroadcast(String(state.id), state);
        return;
      }
      idsInDb[String(state.id)] = true;
      renderRemotePlayerState(state, "poll");
    });
    Object.keys(remotePlayers).forEach(function (remoteId) {
      if (idsInDb[remoteId]) return;
      removeRemotePlayer(remoteId);
    });
    updateRemotePlayerCount();
  }).catch(function (error) {
    addNetworkDebugLog(
      "presence db poll error: " + (error && error.message ? error.message : "온라인 서버 확인 필요")
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
        name: nameForIngameUiDisplay(accountDisplayNameForUi()),
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
    if (isRemotePresenceSameLoggedInAccount(latestPresence)) return;

    nextRemotePlayers[latestPresence.id] = latestPresence;
  });

  Object.keys(nextRemotePlayers).forEach(function (remoteId) {
    renderRemotePlayerState(nextRemotePlayers[remoteId], "presence");
  });

  updateRemotePlayerCount();
}

function handleRemotePlayerBroadcast(state) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!isValidRemotePlayerStatePayload(state) || state.id === currentSessionId) return;
  if (state.action === "leave") {
    delete remoteBucketUpdateAtById[state.id];
    delete multiplayerRoomSessionIdsLastSeen[state.id];
    delete lastRemoteWaterSplashAppliedAtBySession[state.id];
    removeRemotePlayer(state.id);
    return;
  }
  multiplayerRoomSessionIdsLastSeen[String(state.id)] = Date.now();
  if (isRemotePresenceSameLoggedInAccount(state)) {
    maybeApplyRemoteWaterSplashFromBroadcast(String(state.id), state);
    return;
  }
  renderRemotePlayerState(state, "broadcast");
  updateRemotePlayerCount();
}

function removeRemotePlayer(remoteId) {
  const remotePlayer = remotePlayers[remoteId];
  if (!remotePlayer) return;
  remotePlayer.element.remove();
  delete remotePlayers[remoteId];
  removeRemoteChatBubbleEl(remoteId);
  updateRemotePlayerCount();
}

function renderRemotePlayerState(state, source) {
  const remoteId = state.id;
  const remotePlayer = remotePlayers[remoteId] || createRemotePlayer(remoteId);
  const incomingVersion = getRemoteStateVersion(state);
  const incomingRank = getRemoteStateSourceRank(source);
  const currentVersion = Number(remotePlayer.lastStateVersion || 0);
  const currentRank = Number(remotePlayer.lastStateSourceRank || 0);
  if (!shouldApplyIncomingRemoteState(
    { version: currentVersion, rank: currentRank },
    { version: incomingVersion, rank: incomingRank }
  )) {
    addSyncDebugLog("remote_state_reject", {
      remoteId: remoteId,
      source: source || "",
      incomingVersion: incomingVersion,
      currentVersion: currentVersion,
      incomingRank: incomingRank,
      currentRank: currentRank,
      reason: "stale_or_lower_rank"
    }, true);
    return;
  }
  const remoteColor = state.color || "#7dd3fc";
  const nextX = Number(state.x) || 0;
  const nextY = -(Number(state.depth) || 0) + (Number(state.jumpY) || 0);
  const nextPositionKey = Math.round(nextX * 10) + "|" + Math.round(nextY * 10);
  const statusAction =
    typeof state.action === "string" &&
    state.action !== "" &&
    state.action !== "watering" &&
    state.action !== "state"
      ? state.action
      : "";

  remotePlayer.nameElement.textContent = nameForIngameUiDisplay(
    state.name || "OVC"
  );
  if (statusAction) {
    const nextStatusText = getRemoteStatusText(state.action);
    if (nextStatusText) {
      remotePlayer.statusElement.textContent = nextStatusText;
      remotePlayer.statusElement.style.display = "block";
      remotePlayer.lastActionAt = Date.now();
    }
  } else {
    const keepUntil = Number(remotePlayer.lastActionAt || 0) + REMOTE_ACTION_STATUS_HOLD_MS;
    if (Date.now() >= keepUntil) {
      remotePlayer.statusElement.textContent = "";
      remotePlayer.statusElement.style.display = "none";
      remotePlayer.lastActionAt = 0;
    }
  }
  remotePlayer.bodyElement.src = getTintedPlayerSrc(remoteColor);
  remotePlayer.element.classList.toggle("needs-outline", needsDarkOutline(remoteColor));
  if (remotePlayer.positionKey !== nextPositionKey) {
    setWorldPosition(remotePlayer.element, nextX, nextY);
    remotePlayer.positionKey = nextPositionKey;
  }
  remotePlayer.worldX = nextX;
  remotePlayer.worldY = nextY;
  remotePlayer.depth = Number(state.depth) || 0;
  remotePlayer.jumpY = Number(state.jumpY) || 0;
  remotePlayer.userId = state.userId != null ? String(state.userId) : "";
  remotePlayer.name = state.name || "OVC";
  if (incomingVersion > 0) {
    remotePlayer.lastStateVersion = incomingVersion;
    remotePlayer.lastStateSourceRank = incomingRank;
  }
  addSyncDebugLog("remote_state_apply", {
    remoteId: remoteId,
    source: source || "",
    version: incomingVersion || currentVersion
  });
  const nextWaterSplashAt = Number(state.waterSplashAt || 0);
  const splashClockNow = Date.now();
  if (
    nextWaterSplashAt > 0 &&
    nextWaterSplashAt > Number(remotePlayer.lastWaterSplashAt || 0) &&
    Math.abs(splashClockNow - nextWaterSplashAt) <= REMOTE_WATER_SPLASH_ACCEPT_MS
  ) {
    const nextSplashX = Number(state.waterSplashX);
    const nextSplashY = Number(state.waterSplashY);
    if (Number.isFinite(nextSplashX) && Number.isFinite(nextSplashY)) {
      createWaterSplashAt(nextSplashX, nextSplashY);
      remotePlayer.lastWaterSplashAt = nextWaterSplashAt;
    }
  }
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

  remotePlayers[remoteId] = {
    element,
    bodyElement,
    nameElement,
    statusElement,
    positionKey: "",
    worldX: 0,
    worldY: 0,
    depth: 0,
    jumpY: 0,
    lastStateVersion: 0,
    lastStateSourceRank: 0,
    lastWaterSplashAt: 0,
    lastActionAt: 0,
    lastSeenAt: Date.now()
  };
  return remotePlayers[remoteId];
}

function pruneStaleRemotePlayers() {
  const now = Date.now();
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.lastSeenAt) return;
    if (now - remotePlayer.lastSeenAt < 90000) return;
    if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
      window.OVC_SHARED_BUCKET_HELD_BY = "";
      markWorldDirty();
    }
    removeRemotePlayer(remoteId);
  });
}

function updateRemotePlayerCount() {
  const seenUsers = Object.create(null);
  remotePlayerCount = Object.keys(remotePlayers).reduce(function (count, remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer) return count;
    const userKey = remotePlayer.userId || ("name:" + (remotePlayer.name || remoteId));
    if (seenUsers[userKey]) return count;
    seenUsers[userKey] = true;
    return count + 1;
  }, 0);
  updateMultiplayerStatus(multiplayerStatusText);
}

function updateMultiplayerStatus(statusText) {
  multiplayerStatusText = statusText;
  if (!multiplayerStatus) return;

  const statusLabel =
    multiplayerStatusText === "연결됨" ||
    multiplayerStatusText === "연결중" ||
    multiplayerStatusText === "캐릭터 선택 전" ||
    multiplayerStatusText === "초기화 중" ||
    (typeof multiplayerStatusText === "string" &&
      multiplayerStatusText.indexOf("튜토리얼") !== -1)
      ? multiplayerStatusText
      : "연결 안됨";
  multiplayerStatus.textContent =
    "멀티 " + statusLabel + " / 로그인 " + getOnlinePlayerCount();
}

function clearMultiplayerReconnectTimeout() {
  if (multiplayerReconnectTimeout) {
    clearTimeout(multiplayerReconnectTimeout);
    multiplayerReconnectTimeout = null;
  }
}

function scheduleMultiplayerReconnect(delayMs) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (multiplayerReconnectTimeout || !hasSpawnedCharacter || isLoggingOut || isTabSessionSuperseded) return;
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
      "로컬 저장 실패: " +
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
      "로컬 저장 실패: " +
      (error && error.message ? error.message : "온라인 서버 확인 필요")
    );
  });
}

function getOnlinePlayerCount() {
  if (!currentUserId) return remotePlayerCount;
  return remotePlayerCount + 1;
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
  adminMessage.textContent = "\uACC4\uC815 \uBD88\uB7EC\uC624\uB294 \uC911...";
  adminAccountList.innerHTML = "";

  try {
    const accounts = await window.OVCOnline.listAccounts();
    adminAccountList.dataset.accounts = JSON.stringify(accounts);
    renderAdminAccounts(accounts);
    adminMessage.textContent = accounts.length + "\uAC1C \uACC4\uC815";
  } catch (error) {
    adminMessage.textContent = error.message;
  }
}

function renderAdminAccounts(accounts) {
  adminAccountList.innerHTML = "";

  if (!accounts.length) {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = "\uAC00\uC785\uB41C \uACC4\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.";
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

    name.textContent = account.name || "\uC774\uB984 \uC5C6\uC74C";
    meta.textContent =
      (account.color || "\uC0C9 \uC5C6\uC74C") +
      " / " +
      formatAdminDate(account.created_at);
    deleteButton.textContent = "\uC0AD\uC81C";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", async function () {
      if (!confirm((account.name || "\uC774 \uACC4\uC815") + "\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) return;

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
  adminMessage.textContent = "\uACC4\uC815 \uBD88\uB7EC\uC624\uB294 \uC911...";
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
  if (!value) return "\uB0A0\uC9DC \uC5C6\uC74C";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\uB0A0\uC9DC \uC5C6\uC74C";

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

function isNetworkDebugPanelActiveTextSelection() {
  if (!networkDebugPanel || !networkDebugPanel.classList.contains("is-visible")) {
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
  return networkDebugPanel.contains(anchor) && networkDebugPanel.contains(focus);
}

function refreshNetworkDebugPanelDom() {
  if (!networkDebugPanel || !networkDebugDomStale) {
    return;
  }
  if (isNetworkDebugPanelActiveTextSelection()) {
    return;
  }
  networkDebugPanel.textContent = networkDebugLines.join("\n");
  networkDebugDomStale = false;
}

function addNetworkDebugLog(message) {
  if (!networkDebugPanel || !message) return;
  const timestamp = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  networkDebugLines.push("[" + timestamp + "] " + message);
  while (networkDebugLines.length > 14) {
    networkDebugLines.shift();
  }
  networkDebugDomStale = true;
  refreshNetworkDebugPanelDom();
}

function addBucketTrace(key, message, minIntervalMs) {
  if (!BUCKET_DEBUG_TRACE) return;
  const now = Date.now();
  const last = Number(lastBucketTraceAtByKey[key] || 0);
  if (now - last < (minIntervalMs || 500)) return;
  lastBucketTraceAtByKey[key] = now;
  addNetworkDebugLog("[bucket:" + key + "] " + message);
}

const syncDebugHelpers = createSyncDebugHelpers({
  enabled: SYNC_DEBUG_TRACE,
  addNetworkDebugLog: addNetworkDebugLog
});
const addSyncDebugLog = syncDebugHelpers.addSyncDebugLog;
syncDebugHelpers.publishSyncDebugChecklistTemplate(window);

async function validateCurrentAccount() {
  if (isLoggingOut || isTabSessionSuperseded || !currentUserId || !window.OVCOnline) return;

  try {
    if (typeof window.OVCOnline.validateSession === "function") {
      const storedToken = localStorage.getItem(currentSessionTokenKey);
      if (!storedToken) {
        // Token may be temporarily missing (e.g. migration/fallback path).
        // Only force logout when the account itself no longer exists.
        if (typeof window.OVCOnline.getAccount === "function") {
          const account = await window.OVCOnline.getAccount(currentUserId);
          if (!account) {
            showOnlineDebugMessage("삭제된 계정입니다. 로그아웃합니다.");
            setTimeout(logout, 800);
            return;
          }
        }
        return;
      }
      const isValid = await window.OVCOnline.validateSession(currentUserId, storedToken);
      if (!isValid) {
        showOnlineDebugMessage("다른 기기에서 로그인되어 로그아웃합니다.");
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
  const loggingOutUserId = currentUserId ? String(currentUserId).trim() : "";
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
    try {
      sessionStorage.removeItem("ovcGameSessionId");
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
      sessionStorage.removeItem("ovcPostTutorialMultiplayerReconnectV1");
      sessionStorage.removeItem(ovcTutorialReplaySessionKey);
      sessionStorage.removeItem("ovcAccountTutorialDoneSyncedV1");
    } catch (e) {}
    localStorage.removeItem(currentUserKey);
    localStorage.removeItem(currentUserIdKey);
    localStorage.removeItem(currentSessionTokenKey);
    localStorage.removeItem(currentUserColorKey);
    localStorage.removeItem(currentUserHasChosenColorKey);
    localStorage.removeItem(lastSelectedColorKey);
    if (loggingOutUserId) {
      localStorage.removeItem("ovcAccountSessionLeaderV1:" + loggingOutUserId);
      localStorage.removeItem("ovcUserColorV1:" + loggingOutUserId);
      localStorage.removeItem("ovcUserHasChosenColorV1:" + loggingOutUserId);
    }
    sessionStorage.removeItem(currentSessionKey);
    sessionStorage.removeItem(accountLeaderTokenSessionKey);
    window.location.href = "ovc-login.html?v=20260509a";
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
      clearMultiplayerRoomSessionTracking();
      finishLogout();
    });
    return;
  }

  finishLogout();
}

function getFitZoom() {
  return Math.max(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
}

// ----------------------------------------------------------------------------
// Butterflies
//
// Butterflies are a shared, multiplayer entity. To avoid two clients fighting
// over their positions we elect a single "authority" (the lowest active
// sessionId) that simulates random-walk movement and broadcasts positions on a
// short cadence. Every other client just renders the broadcast positions and
// animates wing frames locally.
//
// Catching: the catcher removes the butterfly locally, saves world state, and
// broadcasts `butterfly_catch` so every tab (including the authority) drops the
// same id immediately. World snapshots from others always merge butterfly lists
// so DB saves are not ignored when the authority's movement clock is ahead.
// Inventory counts stay per-player (localStorage).
//
// Respawning is owned by the authority: while alive count is below the cap and
// at least `butterflyRespawnMs` has passed since the last spawn, a new
// butterfly appears at a random in-bounds position with a random color.
// ----------------------------------------------------------------------------

function loadButterflyCaughtCounts() {
  try {
    const raw = getStoredValue(butterflyCaughtCountsKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    butterflyColors.forEach(function (color) {
      const count = Math.max(0, Math.floor(Number(parsed[color]) || 0));
      butterflyState.caughtCounts[color] = count;
    });
  } catch (error) {
    // Corrupt save - reset to zeros silently.
    butterflyColors.forEach(function (color) {
      butterflyState.caughtCounts[color] = 0;
    });
  }
}

function loadMagicPowderCount() {
  const raw = Number(getStoredValue(magicPowderCountKey) || 0);
  magicPowderCount = Math.max(0, Math.floor(raw));
}

function saveButterflyCaughtCounts() {
  setStoredValue(
    butterflyCaughtCountsKey,
    JSON.stringify(butterflyState.caughtCounts)
  );
}

function saveMagicPowderCount() {
  setStoredValue(magicPowderCountKey, String(Math.max(0, Math.floor(magicPowderCount))));
}

function getTotalCaughtButterflies() {
  return butterflyColors.reduce(function (total, color) {
    return total + Math.max(0, Number(butterflyState.caughtCounts[color]) || 0);
  }, 0);
}

function removeRandomButterfliesFromInventory(count) {
  const pickedColors = [];
  butterflyColors.forEach(function (color) {
    const amount = Math.max(0, Number(butterflyState.caughtCounts[color]) || 0);
    for (let i = 0; i < amount; i += 1) pickedColors.push(color);
  });
  for (let i = pickedColors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pickedColors[i];
    pickedColors[i] = pickedColors[j];
    pickedColors[j] = tmp;
  }
  const removing = Math.min(Math.max(0, count), pickedColors.length);
  for (let i = 0; i < removing; i += 1) {
    const color = pickedColors[i];
    butterflyState.caughtCounts[color] = Math.max(
      0,
      (butterflyState.caughtCounts[color] || 0) - 1
    );
  }
}

function tryCraftMagicPowder() {
  if (isOnboardingLinearGateActive()) {
    flashOnboardingOrderHint("");
    return false;
  }
  if (isCraftingMagicPowder) return false;
  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) return false;
  if (getTotalCaughtButterflies() < magicPowderCraftCost) return false;

  isCraftingMagicPowder = true;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uB9C8\uBC95\uC758 \uAC00\uB8E8 \uC0DD\uC131 \uC911...";
  clearTimeout(magicPowderCraftTimer);
  magicPowderCraftTimer = window.setTimeout(function () {
    removeRandomButterfliesFromInventory(magicPowderCraftCost);
    magicPowderCount += 1;
    saveButterflyCaughtCounts();
    saveMagicPowderCount();
    isCraftingMagicPowder = false;
    plantRuntime.isPlanting = false;
    playerStatus.textContent = "";
    updateButterflyInventoryUi();
    updateMagicPowderInventoryUi();
    sendMultiplayerPresence(true);
  }, magicPowderCraftMs);
  updateButterflyInventoryUi();
  sendMultiplayerPresence(true);
  return true;
}

function addWhiteButterfliesForTest() {
  butterflyState.caughtCounts.white = (butterflyState.caughtCounts.white || 0) + 10;
  saveButterflyCaughtCounts();
  updateButterflyInventoryUi();
}

function generateButterflyId() {
  return "butterfly-" + Date.now().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}

function pickRandomButterflyColor() {
  return butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
}

function pickRandomButterflySpawnPoint() {
  const x = butterflyBoundsLeft + Math.random() * (butterflyBoundsRight - butterflyBoundsLeft);
  const y = butterflyBoundsTop + Math.random() * (butterflyBoundsBottom - butterflyBoundsTop);
  return { x, y };
}

function pickButterflyWaypoint(fromX, fromY) {
  // Prefer local legs around current position to avoid "teleport-thinking"
  // path changes on remote clients when snapshots arrive out of phase.
  const minLeg = 42;
  const maxLeg = 150;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const leg = minLeg + Math.random() * (maxLeg - minLeg);
    const target = {
      x: Math.max(
        butterflyBoundsLeft,
        Math.min(butterflyBoundsRight, fromX + Math.cos(angle) * leg)
      ),
      y: Math.max(
        butterflyBoundsTop,
        Math.min(butterflyBoundsBottom, fromY + Math.sin(angle) * leg)
      )
    };
    const dx = target.x - fromX;
    const dy = target.y - fromY;
    if (dx * dx + dy * dy >= minLeg * minLeg) {
      return target;
    }
  }
  return pickRandomButterflySpawnPoint();
}

function createButterfly(now, options) {
  const spawn = (options && options.spawn) || pickRandomButterflySpawnPoint();
  const color = (options && options.color) || pickRandomButterflyColor();
  const id = (options && options.id) || generateButterflyId();
  return {
    id,
    color,
    x: spawn.x,
    y: spawn.y,
    dirX: Math.random() < 0.5 ? -1 : 1,
    spawnedAt: now
  };
}

/** 스냅샷·병합 버그로 같은 id가 두 번 들어오는 경우 방지 */
function dedupeButterfliesByIdStable(list) {
  if (!list || list.length <= 1) return list || [];
  const seen = Object.create(null);
  for (let i = 0; i < list.length; i += 1) {
    const b = list[i];
    if (!b || b.id == null) {
      const sNull = Object.create(null);
      return list.filter(function (bb) {
        if (!bb || bb.id == null) return false;
        const id = String(bb.id);
        if (sNull[id]) return false;
        sNull[id] = true;
        return true;
      });
    }
    const sid = String(b.id);
    if (seen[sid]) {
      const out = [];
      const s2 = Object.create(null);
      for (let j = 0; j < list.length; j += 1) {
        const bb = list[j];
        if (!bb || bb.id == null) continue;
        const id = String(bb.id);
        if (s2[id]) continue;
        s2[id] = true;
        out.push(bb);
      }
      return out;
    }
    seen[sid] = true;
  }
  return list;
}

/** 공유 상한(butterflyMaxAlive) 초과 시 오래된 개체부터 제거 */
function trimButterflyListToMaxCap(list) {
  if (!list || list.length <= butterflyMaxAlive) return list || [];
  const scored = list.map(function (b, idx) {
    return {
      b: b,
      idx: idx,
      t: Number(b.spawnedAt) || 0
    };
  });
  scored.sort(function (a, b) {
    if (b.t !== a.t) return b.t - a.t;
    return a.idx - b.idx;
  });
  const keep = Object.create(null);
  for (let i = 0; i < butterflyMaxAlive; i += 1) {
    if (scored[i] && scored[i].b && scored[i].b.id != null) {
      keep[String(scored[i].b.id)] = true;
    }
  }
  return list.filter(function (b) {
    return b && b.id != null && keep[String(b.id)];
  });
}

function pruneButterflyAuthorityWaypointsToList() {
  const alive = Object.create(null);
  butterflyState.list.forEach(function (b) {
    if (b && b.id != null) alive[String(b.id)] = true;
  });
  Object.keys(butterflyAuthorityWaypointById).forEach(function (wid) {
    if (!alive[wid]) delete butterflyAuthorityWaypointById[wid];
  });
}

function pruneStaleMultiplayerRoomSessions(now) {
  const staleMs = 45000;
  Object.keys(multiplayerRoomSessionIdsLastSeen).forEach(function (sid) {
    const seen = multiplayerRoomSessionIdsLastSeen[sid];
    if (!seen || now - seen > staleMs) {
      delete multiplayerRoomSessionIdsLastSeen[sid];
      delete lastRemoteWaterSplashAppliedAtBySession[sid];
    }
  });
}

function clearMultiplayerRoomSessionTracking() {
  multiplayerRoomSessionIdsLastSeen = Object.create(null);
  lastRemoteWaterSplashAppliedAtBySession = Object.create(null);
}

function ensureSyncEventDedupeStore() {
  if (syncEventDedupeStore) return syncEventDedupeStore;
  syncEventDedupeStore = createSyncEventDedupeStore({
    ttlMs: SYNC_EVENT_DEDUPE_TTL_MS,
    maxEntries: SYNC_EVENT_DEDUPE_MAX,
    onReject: function (info) {
      addSyncDebugLog("event_dedupe_reject", {
        eventId: info.eventId,
        ageMs: info.ageMs
      }, true);
    },
    onAccept: function (info) {
      addSyncDebugLog("event_dedupe_accept", {
        eventId: info.eventId,
        at: info.now
      });
    }
  });
  return syncEventDedupeStore;
}

function makeSyncEventId(kind, entityId, atMs) {
  return makeSyncEventIdCore(currentSessionId, kind, entityId, atMs);
}

function consumeSyncEventId(eventId, nowMs) {
  return ensureSyncEventDedupeStore().consume(eventId, nowMs);
}

function getRemoteStateSourceRank(source) {
  return getRemoteStateSourceRankCore(source);
}

function getRemoteStateVersion(state) {
  return getRemoteStateVersionCore(state);
}

function isValidRemotePlayerStatePayload(state) {
  return isValidRemotePlayerStatePayloadCore(state);
}

function maybeApplyRemoteWaterSplashFromBroadcast(remoteId, state) {
  if (!remoteId || !state) return;
  const now = Date.now();
  const nextWaterSplashAt = Number(state.waterSplashAt || 0);
  if (!nextWaterSplashAt) return;
  if (Math.abs(now - nextWaterSplashAt) > REMOTE_WATER_SPLASH_ACCEPT_MS) return;
  if (nextWaterSplashAt <= Number(lastRemoteWaterSplashAppliedAtBySession[remoteId] || 0)) {
    return;
  }
  const x = Number(state.waterSplashX);
  const y = Number(state.waterSplashY);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  createWaterSplashAt(x, y);
  lastRemoteWaterSplashAppliedAtBySession[remoteId] = nextWaterSplashAt;
}

function isButterflyAuthority() {
  if (!currentSessionId) return false;
  const now = Date.now();
  pruneStaleMultiplayerRoomSessions(now);
  const ids = [currentSessionId];
  Object.keys(multiplayerRoomSessionIdsLastSeen).forEach(function (sid) {
    if (sid !== currentSessionId) ids.push(sid);
  });
  ids.sort();
  return ids[0] === currentSessionId;
}

function getNumericButterflyValue(value, fallback) {
  return getNumericButterflyValueCore(value, fallback);
}

function ensureButterflyWaypoint(butterfly, now) {
  let waypoint = butterflyAuthorityWaypointById[butterfly.id];
  if (!waypoint || now >= waypoint.endAt) {
    const target = pickButterflyWaypoint(butterfly.x, butterfly.y);
    const dx = target.x - butterfly.x;
    const dy = target.y - butterfly.y;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    // Pixels-per-frame to ms-per-pixel @ ~60fps.
    const msPerFrame = 1000 / 60;
    const baseDuration = (distance / butterflySpeed) * msPerFrame;
    const jitter =
      butterflyLegMinMs +
      Math.random() * (butterflyLegMaxMs - butterflyLegMinMs);
    const duration = Math.max(butterflyLegMinMs, Math.min(butterflyLegMaxMs, baseDuration + jitter * 0.25));
    waypoint = {
      startX: butterfly.x,
      startY: butterfly.y,
      targetX: target.x,
      targetY: target.y,
      startAt: now,
      endAt: now + duration
    };
    butterflyAuthorityWaypointById[butterfly.id] = waypoint;
  }
  return waypoint;
}

function getButterflyFlutterOffsetWorld(now, butterfly) {
  const salt =
    butterfly.id.split("").reduce(function (acc, ch) {
      return acc + ch.charCodeAt(0);
    }, 0) % 6283;
  const omegaX = (2 * Math.PI) / butterflyFlutterPeriodHorizontalMs;
  const omegaY = (2 * Math.PI) / butterflyFlutterPeriodVerticalMs;
  return {
    dx: Math.sin(now * omegaX + salt * 0.001) * butterflyFlutterAmplitudeX,
    dy: Math.sin(now * omegaY + salt * 0.002 + Math.PI / 2) * butterflyFlutterAmplitudeY
  };
}

function simulateButterflyAuthorityStep(butterfly, now) {
  simulateButterflyAuthorityStepCore(butterfly, now, {
    waypointMap: butterflyAuthorityWaypointById,
    ensureWaypoint: ensureButterflyWaypoint,
    bounds: {
      left: butterflyBoundsLeft,
      right: butterflyBoundsRight,
      top: butterflyBoundsTop,
      bottom: butterflyBoundsBottom
    },
    flutter: {
      periodHorizontalMs: butterflyFlutterPeriodHorizontalMs,
      periodVerticalMs: butterflyFlutterPeriodVerticalMs,
      amplitudeX: butterflyFlutterAmplitudeX,
      amplitudeY: butterflyFlutterAmplitudeY
    }
  });
}

function authoritySpawnButterfliesIfNeeded(now) {
  if (butterflyState.list.length >= butterflyMaxAlive) return false;
  if (!butterflyState.lastSpawnAt) {
    // 최초 입장(아직 나비를 채운 적 없음)만 즉시 cap까지 채움. 이미 월드가 돌았는데
    // lastSpawnAt만 0이면(스냅샷 누락·병합) 여기서 5마리를 한꺼번에 넣어 리스폰 주기가 무시됨.
    if (hasSeededInitialButterflies) {
      butterflyState.lastSpawnAt = now;
      return false;
    }
    return authorityFillToCapInstantly(now);
  }
  const elapsedCycles = Math.floor(
    (now - butterflyState.lastSpawnAt) / butterflyRespawnMs
  );
  if (elapsedCycles <= 0) return false;

  const slotsAvailable = butterflyMaxAlive - butterflyState.list.length;
  const toSpawn = Math.min(elapsedCycles, slotsAvailable);
  for (let i = 0; i < toSpawn; i += 1) {
    butterflyState.list.push(createButterfly(now));
  }
  // Advance lastSpawnAt by the consumed cycles so leftover time carries over
  // toward the next spawn instead of being lost.
  butterflyState.lastSpawnAt += toSpawn * butterflyRespawnMs;
  return toSpawn > 0;
}

function authorityFillToCapInstantly(now) {
  let added = false;
  while (butterflyState.list.length < butterflyMaxAlive) {
    butterflyState.list.push(createButterfly(now));
    added = true;
  }
  if (added) butterflyState.lastSpawnAt = now;
  return added;
}

function ensureButterflyRenderEntry(butterfly) {
  let entry = butterflyRenderById[butterfly.id];
  if (entry && entry.element && entry.element.isConnected) return entry;
  if (entry && entry.element && entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
  const element = document.createElement("div");
  element.className = "butterfly";
  element.dataset.butterflyId = butterfly.id;
  const sprite = document.createElement("div");
  sprite.className = "butterfly-sprite";
  element.appendChild(sprite);
  ground.appendChild(element);
  setWorldSize(element, BUTTERFLY_SIZE, BUTTERFLY_SIZE);
  setInstantHoverTip(element, null);
  entry = {
    element,
    sprite,
    color: null,
    frame: -1,
    facingRight: null,
    catchable: null,
    lastMotionX: null
  };
  butterflyRenderById[butterfly.id] = entry;
  return entry;
}

function removeButterflyRenderEntry(id) {
  const entry = butterflyRenderById[id];
  if (entry && entry.element && entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
  delete butterflyRenderById[id];
  delete butterflyAuthorityWaypointById[id];
}

function applyButterflySpriteFrame(entry, color, frame) {
  if (entry.color === color && entry.frame === frame) return;
  const colorIndex = Math.max(0, butterflyColors.indexOf(color));
  // Sprite sheet uses 5 cols (frame) and 3 rows (color).
  // background-position needs each cell offset; with background-size 500% 300%
  // each unit is 100% / (cols-1) horizontally and 100% / (rows-1) vertically.
  const xPercent = (frame / (butterflyFrameCount - 1)) * 100;
  const yPercent = (colorIndex / (butterflyColors.length - 1)) * 100;
  entry.sprite.style.backgroundPosition = xPercent + "% " + yPercent + "%";
  entry.color = color;
  entry.frame = frame;
}

function applyButterflyFacing(entry, facingRight) {
  if (entry.facingRight === facingRight) return;
  entry.element.classList.toggle("is-facing-right", facingRight);
  entry.facingRight = facingRight;
}

function applyButterflyCatchable(entry, catchable) {
  if (entry.catchable === catchable) return;
  entry.element.classList.toggle("is-catchable", catchable);
  entry.catchable = catchable;
}

function getButterflyAnimationFrame(now, butterfly) {
  // Phase the animation by id length so the swarm doesn't beat in sync.
  const offset = butterfly.id.length * 53;
  return Math.floor((now + offset) / butterflyFrameMs) % butterflyFrameCount;
}

function getButterflyCenterDistance(butterfly) {
  return getCenterDistance(
    butterfly.x - BUTTERFLY_SIZE / 2,
    butterfly.y - BUTTERFLY_SIZE / 2,
    BUTTERFLY_SIZE,
    BUTTERFLY_SIZE
  );
}

function findCatchableButterfly() {
  let nearest = null;
  butterflyState.list.forEach(function (butterfly) {
    const distance = getButterflyCenterDistance(butterfly);
    if (distance > butterflyCatchDistance) return;
    if (!nearest || distance < nearest.distance) {
      nearest = { butterfly, distance };
    }
  });
  return nearest;
}

function stripButterflyFromSharedList(butterflyId, tombstoneAt) {
  const id = String(butterflyId || "");
  if (!id) return false;
  const ts = Math.max(
    Number(butterflyLocalCatchTombstoneById[id] || 0),
    Math.max(0, Number(tombstoneAt) || Date.now())
  );
  butterflyLocalCatchTombstoneById[id] = ts;
  const had = butterflyState.list.some(function (b) {
    return b.id === id;
  });
  butterflyState.list = butterflyState.list.filter(function (other) {
    return other.id !== id;
  });
  removeButterflyRenderEntry(id);
  return had;
}

function finalizeButterflyRemovalEffects(now) {
  const t = now || Date.now();
  if (!butterflyState.lastSpawnAt || t < butterflyState.lastSpawnAt) {
    butterflyState.lastSpawnAt = t;
  }
  lastButterflyStateChangeAt = t;
  markWorldDirty();
}

function broadcastWorldLooseSeedPickup() {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!usesWorldLooseSeedMode()) return;
  if (!multiplayerChannel || !currentSessionId) return;
  ensureWorldLooseSeedShape();
  const ws = appleState.worldLooseSeed;
  const at = Date.now();
  const eventId = makeSyncEventId("world_loose_seed_pickup", "world-loose-seed", at);
  consumeSyncEventId(eventId, at);
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_loose_seed_pickup",
      payload: {
        from: currentSessionId,
        eventId: eventId,
        at: at,
        x: Number(ws.x) || WORLD_LOOSE_SEED_X,
        y: Number(ws.y) || WORLD_LOOSE_SEED_Y,
        nextSpawnAt: Math.max(0, Number(ws.nextSpawnAt) || 0)
      }
    })
  ).catch(function () {
    // syncWorldState still persists pickup for polling clients.
  });
}

function handleRemoteWorldLooseSeedPickupBroadcast(payload) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!usesWorldLooseSeedMode()) return;
  if (!payload || payload.from === currentSessionId) return;
  if ((payload.x != null && !Number.isFinite(Number(payload.x))) || (payload.y != null && !Number.isFinite(Number(payload.y)))) {
    addSyncDebugLog("world_loose_seed_reject", { reason: "invalid_position" }, true);
    return;
  }
  const now = Date.now();
  if (!consumeSyncEventId(payload.eventId, now)) return;
  const evtAt = Math.max(0, Number(payload.at) || 0);
  if (evtAt > 0 && evtAt <= Number(lastWorldLooseSeedPickupAt || 0)) {
    addSyncDebugLog("world_loose_seed_reject", {
      reason: "older_event",
      eventAt: evtAt,
      lastAppliedAt: lastWorldLooseSeedPickupAt
    }, true);
    return;
  }
  const nextAt = Math.max(0, Number(payload.nextSpawnAt) || 0);
  if (nextAt <= now) {
    addSyncDebugLog("world_loose_seed_reject", {
      reason: "expired_next_spawn",
      nextAt: nextAt,
      now: now
    }, true);
    return;
  }
  ensureWorldLooseSeedShape();
  const cur = Math.max(0, Number(appleState.worldLooseSeed.nextSpawnAt) || 0);
  if (nextAt <= cur) {
    addSyncDebugLog("world_loose_seed_reject", {
      reason: "older_next_spawn",
      nextAt: nextAt,
      currentNextAt: cur
    }, true);
    return;
  }
  if (evtAt > 0) lastWorldLooseSeedPickupAt = Math.max(lastWorldLooseSeedPickupAt, evtAt);
  appleState.worldLooseSeed.nextSpawnAt = nextAt;
  worldLoosePickupLockUntil = Math.max(Number(worldLoosePickupLockUntil || 0), nextAt);
  const px = Number(payload.x);
  const py = Number(payload.y);
  if (Number.isFinite(px)) appleState.worldLooseSeed.x = px;
  if (Number.isFinite(py)) appleState.worldLooseSeed.y = py;
  saveAppleState();
  markWorldDirty();
  updateExtraSeedsAndPlants();
  updateSeedInventory();
  addSyncDebugLog("world_loose_seed_apply", {
    eventId: payload.eventId || "",
    eventAt: evtAt || 0,
    nextSpawnAt: nextAt
  });
}

function broadcastButterflyCatch(butterflyId) {
  if (!multiplayerChannel || !currentSessionId) return;
  const at = Date.now();
  const bid = String(butterflyId || "");
  const eventId = makeSyncEventId("butterfly_catch", bid, at);
  consumeSyncEventId(eventId, at);
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "butterfly_catch",
      payload: {
        butterflyId: bid,
        from: currentSessionId,
        eventId: eventId,
        at: at
      }
    })
  ).catch(function () {
    // World save still carries the removal if broadcast fails.
  });
}

function handleRemoteButterflyCatchBroadcast(payload) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!payload || !payload.butterflyId) return;
  if (payload.from === currentSessionId) return;
  const now = Date.now();
  if (!consumeSyncEventId(payload.eventId, now)) return;
  const butterflyId = String(payload.butterflyId || "");
  if (!butterflyId) return;
  const evtAt = Math.max(0, Number(payload.at) || now);
  if (Math.abs(now - evtAt) > SYNC_EVENT_DEDUPE_TTL_MS) {
    addSyncDebugLog("butterfly_catch_reject", {
      reason: "clock_out_of_window",
      butterflyId: butterflyId,
      now: now,
      eventAt: evtAt
    }, true);
    return;
  }
  const tombstoneAt = Number(butterflyLocalCatchTombstoneById[butterflyId] || 0);
  if (evtAt <= tombstoneAt) {
    addSyncDebugLog("butterfly_catch_reject", {
      reason: "older_than_tombstone",
      butterflyId: butterflyId,
      eventAt: evtAt,
      tombstoneAt: tombstoneAt
    }, true);
    return;
  }
  // Even if this client already dropped it, keep world-state clocks aligned.
  stripButterflyFromSharedList(butterflyId, evtAt);
  finalizeButterflyRemovalEffects(evtAt);
  addSyncDebugLog("butterfly_catch_apply", {
    eventId: payload.eventId || "",
    butterflyId: butterflyId,
    eventAt: evtAt
  });
}

function tryCatchButterfly() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 18) {
    return false;
  }
  const now = Date.now();
  if (now - lastLocalButterflyCatchAt < 200) return false;
  const target = findCatchableButterfly();
  if (!target) return false;

  lastLocalButterflyCatchAt = now;
  lastLocalButterflyCatchActionAt = now;
  const caught = target.butterfly;
  stripButterflyFromSharedList(caught.id);
  if (!butterflyState.caughtCounts[caught.color]) {
    butterflyState.caughtCounts[caught.color] = 0;
  }
  butterflyState.caughtCounts[caught.color] += 1;
  saveButterflyCaughtCounts();

  broadcastButterflyCatch(caught.id);
  finalizeButterflyRemovalEffects(now);
  updateButterflyInventoryUi();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 18) {
    onboardingFlowStep = 19;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
}

function updateButterflyInventoryUi() {
  if (!butterflyInventory) return;
  let total = 0;
  butterflyInventorySlots.forEach(function (slot) {
    const color = slot.dataset.color;
    const count = butterflyState.caughtCounts[color] || 0;
    total += count;
    const countNode = slot.querySelector(".butterfly-inventory-count");
    if (countNode) countNode.textContent = String(count);
    slot.classList.toggle("is-empty", count === 0);
  });
  butterflyInventory.style.display = total > 0 ? "flex" : "none";
  const canCraft = total >= magicPowderCraftCost && !isCraftingMagicPowder;
  butterflyInventory.classList.toggle("is-craftable", canCraft);
  butterflyInventorySlots.forEach(function (slot) {
    setInstantHoverTip(slot, null);
  });
  if (canCraft) {
    setInstantHoverTip(butterflyInventory, butterflyInventoryCraftHoverTip);
  } else if (butterflyInventory.matches(":hover")) {
    syncButterflyInventoryBarHoverTip();
  } else {
    setInstantHoverTip(butterflyInventory, null);
  }
  if (butterflyInventoryTotal) {
    butterflyInventoryTotal.textContent = String(total);
    setInstantHoverTip(butterflyInventoryTotal, null);
  }
  const legacyButterflyLabel = butterflyInventory.querySelector(".butterfly-inventory-label");
  if (legacyButterflyLabel) legacyButterflyLabel.remove();
}

function updateMagicPowderInventoryUi() {
  if (!magicPowderInventory || !magicPowderCountText) return;
  if (magicPowderCount <= 0) {
    magicPowderInventory.style.display = "none";
    magicPowderInventory.classList.remove("is-near");
    setInstantHoverTip(magicPowderInventory, null);
    setInstantHoverTip(magicPowderCountText, null);
    return;
  }
  magicPowderInventory.style.display = "block";
  magicPowderCountText.textContent = String(magicPowderCount);
  const powderUsable = isMagicPowderUsableNow();
  magicPowderInventory.classList.toggle("is-near", powderUsable);
  setInstantHoverTip(
    magicPowderInventory,
    powderUsable ? "\uC0AC\uC6A9 click" : null
  );
  setInstantHoverTip(magicPowderCountText, null);
}

function updateButterflies() {
  const now = Date.now();
  const wallDelta =
    lastButterflyWallClockMs > 0 ? Math.min(60000, now - lastButterflyWallClockMs) : 0;
  lastButterflyWallClockMs = now;

  // Wait until either (a) we know there's no online sync available so this
  // client is definitely authoritative on its own world, or (b) we have
  // hydrated shared state from the server. This avoids one client racing to
  // seed butterflies while another is still loading the existing population.
  const onlineAvailable = isWorldServerSyncAvailable();
  const sharedHydrated = hasHydratedSharedWorldFromServer || !onlineAvailable;

  if (sharedHydrated && isButterflyAuthority()) {
    // Authority: spawn / persistence tick only. Movement runs for every client below
    // so non-authority tabs are not frozen between DB snapshots.
    if (
      !hasSeededInitialButterflies &&
      butterflyState.list.length === 0 &&
      !butterflyState.lastSpawnAt
    ) {
      // First time this world has had a butterfly authority - fill the cap so
      // the player always sees the requested 5 butterflies on arrival.
      authorityFillToCapInstantly(now);
      hasSeededInitialButterflies = true;
      lastButterflyStateChangeAt = now;
      markWorldDirty();
    }
    if (authoritySpawnButterfliesIfNeeded(now)) {
      lastButterflyStateChangeAt = now;
      markWorldDirty();
    }
    if (now - lastButterflyBroadcastAt >= butterflyBroadcastMs) {
      lastButterflyBroadcastAt = now;
      lastButterflyStateChangeAt = now;
      markWorldDirty();
    }
  }
  if (sharedHydrated && butterflyState.list.length > 0) {
    butterflyState.list.forEach(function (butterfly) {
      simulateButterflyAuthorityStep(butterfly, now);
    });
  }
  // Non-authority clients just render whatever the snapshot gave us. Wing
  // frames are still animated locally for smoothness.
  const smoothRemoteButterflies =
    sharedHydrated && onlineAvailable && !isButterflyAuthority();
  /** 원격 스냅샷 추적: 지연 환경(다른 IP)에서 따라붙도록 스텝을 더 크게 */
  const butterflyRemoteRenderMaxStepWorld = wallDelta > 120 ? 48 : 30;

  if (wallDelta > 380 && sharedHydrated && isButterflyAuthority()) {
    Object.keys(butterflyAuthorityWaypointById).forEach(function (wid) {
      delete butterflyAuthorityWaypointById[wid];
    });
  }
  if (smoothRemoteButterflies && wallDelta > 380) {
    butterflyState.list.forEach(function (b) {
      b._renderX = b.x;
      b._renderY = b.y;
    });
  }

  // Render
  const aliveIds = {};
  const catchTarget = findCatchableButterfly();
  butterflyState.list.forEach(function (butterfly) {
    aliveIds[butterfly.id] = true;
    const entry = ensureButterflyRenderEntry(butterfly);
    const targetX = butterfly.x;
    const targetY = butterfly.y;
    let drawX = targetX;
    let drawY = targetY;
    if (smoothRemoteButterflies) {
      if (typeof butterfly._renderX !== "number" || typeof butterfly._renderY !== "number") {
        butterfly._renderX = targetX;
        butterfly._renderY = targetY;
      }
      let rdx = targetX - butterfly._renderX;
      let rdy = targetY - butterfly._renderY;
      const rdist = Math.hypot(rdx, rdy);
      if (rdist < 0.45) {
        butterfly._renderX = targetX;
        butterfly._renderY = targetY;
      } else if (rdist > butterflyRemoteRenderMaxStepWorld && rdist > 0.0001) {
        const s = butterflyRemoteRenderMaxStepWorld / rdist;
        rdx *= s;
        rdy *= s;
        butterfly._renderX += rdx;
        butterfly._renderY += rdy;
      } else {
        butterfly._renderX += rdx;
        butterfly._renderY += rdy;
      }
      drawX = butterfly._renderX;
      drawY = butterfly._renderY;
      const flR = getButterflyFlutterOffsetWorld(now, butterfly);
      drawX += flR.dx;
      drawY += flR.dy;
    } else {
      butterfly._renderX = butterfly.x;
      butterfly._renderY = butterfly.y;
    }
    const motionX = drawX;
    setWorldPosition(
      entry.element,
      drawX - BUTTERFLY_SIZE / 2,
      drawY - BUTTERFLY_SIZE / 2
    );
    applyButterflySpriteFrame(
      entry,
      butterfly.color,
      getButterflyAnimationFrame(now, butterfly)
    );
    const prevMotionX = Number(entry.lastMotionX);
    const hasPrevMotionX = Number.isFinite(prevMotionX);
    const drawDx = hasPrevMotionX ? motionX - prevMotionX : 0;
    let facingRight = entry.facingRight;
    if (facingRight == null) {
      facingRight = butterfly.dirX > 0;
    } else if (Math.abs(drawDx) > 0.06) {
      // Two visible tabs can alternate incoming dirX; use rendered movement
      // delta so facing only flips when motion actually changes direction.
      facingRight = drawDx > 0;
    }
    applyButterflyFacing(entry, Boolean(facingRight));
    entry.lastMotionX = motionX;
    applyButterflyCatchable(
      entry,
      Boolean(catchTarget && catchTarget.butterfly.id === butterfly.id)
    );
  });
  Object.keys(butterflyRenderById).forEach(function (id) {
    if (!aliveIds[id]) removeButterflyRenderEntry(id);
  });
}

function getButterflyStateForSnapshot() {
  const list = trimButterflyListToMaxCap(dedupeButterfliesByIdStable(butterflyState.list));
  if (list !== butterflyState.list) {
    butterflyState.list = list;
    pruneButterflyAuthorityWaypointsToList();
  }
  return {
    lastSpawnAt: butterflyState.lastSpawnAt,
    list: list.map(function (butterfly) {
      return {
        id: butterfly.id,
        color: butterfly.color,
        x: Math.round(butterfly.x * 100) / 100,
        y: Math.round(butterfly.y * 100) / 100,
        dirX: butterfly.dirX > 0 ? 1 : -1,
        spawnedAt: butterfly.spawnedAt || null
      };
    })
  };
}

function applyButterflySnapshot(snapshotButterflies) {
  if (!snapshotButterflies || typeof snapshotButterflies !== "object") return;
  const now = Date.now();
  // Purge old tombstones so the map stays bounded.
  Object.keys(butterflyLocalCatchTombstoneById).forEach(function (id) {
    if (now - butterflyLocalCatchTombstoneById[id] > BUTTERFLY_LOCAL_CATCH_TOMBSTONE_MS) {
      delete butterflyLocalCatchTombstoneById[id];
    }
  });
  const incomingRaw = Array.isArray(snapshotButterflies.list) ? snapshotButterflies.list : [];
  const incomingSeen = Object.create(null);
  const incomingList = [];
  incomingRaw.forEach(function (raw) {
    if (!raw || !raw.id) return;
    const sid = String(raw.id);
    if (incomingSeen[sid]) return;
    incomingSeen[sid] = true;
    incomingList.push(raw);
  });
  if (incomingList.length > 0) {
    hasSeededInitialButterflies = true;
  }
  const incomingById = {};
  incomingList.forEach(function (raw) {
    if (!raw || !raw.id) return;
    if (butterflyLocalCatchTombstoneById[String(raw.id)]) return;
    incomingById[String(raw.id)] = raw;
  });

  // If we are currently the authority we keep our locally-simulated positions
  // (otherwise we would constantly snap our own broadcasts back onto
  // ourselves) but still honor catches/spawns by reconciling membership.
  const iAmAuthority = isButterflyAuthority();
  const prevLastSpawnAt = butterflyState.lastSpawnAt;

  const nextList = [];
  if (iAmAuthority) {
    butterflyState.list.forEach(function (butterfly) {
      if (incomingById[butterfly.id]) {
        nextList.push(butterfly);
        delete incomingById[butterfly.id];
      } else {
        // Removed remotely (e.g. someone else caught it before our save
        // landed). Drop it locally too.
        removeButterflyRenderEntry(butterfly.id);
      }
    });
    Object.keys(incomingById).forEach(function (id) {
      const raw = incomingById[id];
      const butterfly = createButterfly(Date.now(), {
        id: raw.id,
        color: raw.color,
        spawn: {
          x: getNumericButterflyValue(raw.x, butterflyBoundsLeft),
          y: getNumericButterflyValue(raw.y, butterflyBoundsTop)
        }
      });
      butterfly.dirX = Number(raw.dirX) > 0 ? 1 : -1;
      butterfly.spawnedAt = getNumericButterflyValue(raw.spawnedAt, Date.now());
      nextList.push(butterfly);
    });
  } else {
    incomingList.forEach(function (raw) {
      if (!raw || !raw.id) return;
      if (butterflyLocalCatchTombstoneById[String(raw.id)]) return;
      const existing = butterflyState.list.find(function (b) {
        return b.id === raw.id;
      });
      const butterfly = existing || {
        id: String(raw.id),
        color: raw.color || pickRandomButterflyColor(),
        spawnedAt: getNumericButterflyValue(raw.spawnedAt, Date.now())
      };
      butterfly.color = raw.color || butterfly.color;
      butterfly.x = getNumericButterflyValue(raw.x, butterfly.x || butterflyBoundsLeft);
      butterfly.y = getNumericButterflyValue(raw.y, butterfly.y || butterflyBoundsTop);
      butterfly.dirX = Number(raw.dirX) > 0 ? 1 : -1;
      nextList.push(butterfly);
    });
    // Drop any local butterflies the authority no longer reports.
    butterflyState.list.forEach(function (butterfly) {
      const stillExists = nextList.some(function (b) {
        return b.id === butterfly.id;
      });
      if (!stillExists) removeButterflyRenderEntry(butterfly.id);
    });
  }

  let merged = trimButterflyListToMaxCap(dedupeButterfliesByIdStable(nextList));
  butterflyState.list = merged;
  pruneButterflyAuthorityWaypointsToList();
  if (!iAmAuthority) {
    butterflyState.list.forEach(function (b) {
      if (b && b.id != null) {
        delete butterflyAuthorityWaypointById[String(b.id)];
      }
      if (typeof b._renderX !== "number" || typeof b._renderY !== "number") {
        b._renderX = b.x;
        b._renderY = b.y;
      }
    });
  }

  const rawLast = snapshotButterflies.lastSpawnAt;
  const parsedLast = Number(rawLast);
  const hasValidSnapshotSpawnAt =
    Number.isFinite(parsedLast) && parsedLast > 0;

  if (hasValidSnapshotSpawnAt) {
    butterflyState.lastSpawnAt = parsedLast;
  } else if (butterflyState.list.length === 0) {
    butterflyState.lastSpawnAt = hasSeededInitialButterflies ? now : 0;
  } else {
    const prevN = Number(prevLastSpawnAt);
    butterflyState.lastSpawnAt =
      Number.isFinite(prevN) && prevN > 0 ? prevN : Date.now();
  }
}

function gameLoop() {
  if (isTabSessionSuperseded) return;
  gameLoopCyclesForTutorialSync += 1;
  if (gameLoopCyclesForTutorialSync >= 420) {
    gameLoopCyclesForTutorialSync = 0;
    requestAccountTutorialDoneSync();
  }
  respawnApplesIfNeeded();
  refillWellIfNeeded();
  prepareMovementTutorialBeforeMove();
  updatePlayerPosition();
  onboardingCheckJumpFinish();
  advanceMovementTutorialAfterMove();
  updateSeedPosition();
  updateExtraSeedsAndPlants();
  updateSeedInventory();
  updateBucketPosition();
  updatePlayerStatus();
  updateSeedCard();
  refreshPlantIdentityOrdinals();
  updatePlantState();
  updateNpcPosition();
  updateGuideCard();
  updateOnboardingFlowUI();
  pruneStaleRemotePlayers();
  updatePlayerAlert();
  updateButterflies();
  updateMagicPowderInventoryUi();
  updateCamera();
  updatePlayerName();
  updateWorldSocialOverlaysInGameLoop();
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
    if (plant.spotElement) setWorldSize(plant.spotElement, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
    if (plant.waterNeededElement) setWorldSize(plant.waterNeededElement, WATER_NEEDED_SIZE);
    if (plant.sproutElement) setWorldSize(plant.sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  });
  setWorldSize(bucket, BUCKET_SIZE);
  setWorldSize(well, WELL_SIZE);
  setWorldSize(plantSpot, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
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
  guideBookButton.style.display = hasGuideBook ? "block" : "none";
  setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
  updateWellImage();
  updateSeedPosition();
  updateBucketPosition();
  updatePlantState();
}

try {
  if (currentUserId) {
    ovcApplyForceWorldHubBypassLoggedIn();
  }
  setup();
  if (currentUserId) {
    ovcApplyForceWorldHubBypassLoggedIn();
    repairOnboardingCompletionFromStoredStep();
    restoreWorldHubIfVeteranWithoutActiveReplay();
    if (getStoredFlag(onboardingFlowDoneKey)) {
      setStoredFlag(everBeenToWorldKey, true);
    }
  }
  let ovcAbortedPageInit = false;
  if (
    isTutorialDocumentEntry() &&
    currentUserId &&
    getStoredFlag(onboardingFlowDoneKey)
  ) {
    ovcAbortedPageInit = true;
    ovcHardNavigateToWorldIndex();
  } else if (
    isWorldDocumentEntry() &&
    currentUserId &&
    !getStoredFlag(onboardingFlowDoneKey)
  ) {
    ovcAbortedPageInit = true;
    try {
      sessionStorage.setItem("ovcTutorialWorldResetPending", "1");
    } catch (eTutRedirect) {}
    window.location.replace(ovcTutorialPageUrl());
  }
  if (!ovcAbortedPageInit) {
    if (
      isTutorialDocumentEntry() &&
      ovcForceWorldHubIsRequested() &&
      !currentUserId
    ) {
      ovcHardNavigateToWorldIndex();
    } else if (
      isTutorialDocumentEntry() &&
      currentUserId &&
      ovcForceWorldHubIsRequested()
    ) {
      ovcApplyForceWorldHubBypassLoggedIn();
      ovcHardNavigateToWorldIndex();
    } else {
    if (
      currentUserId &&
      !getStoredFlag(onboardingFlowDoneKey) &&
      isTutorialDocumentEntry()
    ) {
      var tutorialWorldResetPending = false;
      try {
        tutorialWorldResetPending =
          sessionStorage.getItem("ovcTutorialWorldResetPending") === "1";
      } catch (ePendingTutorial) {}
      if (tutorialWorldResetPending) {
        resetTutorialProgressInStorage();
        clearStoredKeys(appStorageKeysSharedWorldReset);
        try {
          sessionStorage.removeItem("ovcTutorialWorldResetPending");
        } catch (eRmPending) {}
      }
    }
    applyTutorialWorldResetIfPending();
    loadWellState();
    loadSeedState();
    loadAppleState();
    loadBucketState();
    loadGuideBookState();
    if (currentUserId && getStoredFlag(onboardingFlowDoneKey)) {
      setStoredFlag(everBeenToWorldKey, true);
    }
    loadPlayerPosition();
    loadButterflyCaughtCounts();
    loadMagicPowderCount();
    updateButterflyInventoryUi();
    updateMagicPowderInventoryUi();
    addNetworkDebugLog(
      "init: configured=" +
      Boolean(window.OVCOnline && window.OVCOnline.isConfigured()) +
      ", user=" +
      (currentUserId || "-") +
      ", color=" +
      selectedPlayerColor
    );
    openCharacterSelectIfNeeded();
    try {
      if (sessionStorage.getItem("ovcPostTutorialMultiplayerReconnectV1") === "1") {
        sessionStorage.removeItem("ovcPostTutorialMultiplayerReconnectV1");
        if (
          hasSpawnedCharacter &&
          currentUserId &&
          !isSharedWorldSyncPausedForTutorial() &&
          isWorldServerSyncAvailable()
        ) {
          hasHydratedSharedWorldFromServer = false;
          pollWorldState(true);
        }
      }
    } catch (postTutorialReconnect) {}
    if (!isWorldServerSyncAvailable() || isSharedWorldSyncPausedForTutorial()) {
      hasHydratedSharedWorldFromServer = true;
      setTimeout(hideAppLoadingScreen, 300);
    }
    }
  }
} catch (initError) {
  console.error("[OVC] \uAC8C\uC784 \uCD08\uAE30\uD654 \uC624\uB958:", initError);
  hideAppLoadingScreen();
}
setTimeout(function () {
  if (!isTabSessionSuperseded) {
    if (!hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
      pollWorldState(true);
    }
  }
  setTimeout(hideAppLoadingScreen, 700);
}, 40);
setTimeout(function () {
  if (!isTabSessionSuperseded) {
    if (!hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
      hasHydratedSharedWorldFromServer = true;
    }
  }
  hideAppLoadingScreen();
}, 8000);
setInterval(function () {
  if (isTabSessionSuperseded) return;
  sendMultiplayerPresence(true);
}, 1000);
function runMultiplayerWorldSyncTick() {
  if (isTabSessionSuperseded) return;
  pollWorldState(false);
  syncWorldState(false);
  window.setTimeout(runMultiplayerWorldSyncTick, getMultiplayerWorldSyncLoopMs());
}
window.setTimeout(runMultiplayerWorldSyncTick, getMultiplayerWorldSyncLoopMs());
setInterval(function () {
  if (isTabSessionSuperseded) return;
  validateCurrentAccount();
}, 5000);
window.addEventListener("resize", function () {
  setup();
  zoomLevel = clampZoom(zoomLevel);
  updateCamera();
});
window.addEventListener("load", function () {
  updateCamera();
  setTimeout(hideAppLoadingScreen, 450);
});
gameLoop();
