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
  readTutorialSessionFloorBagPicked,
  writeTutorialSessionFloorBagPicked,
  clearTutorialSessionFloorBagPicked,
  isWorldFloorBagClaimed,
  persistWorldFloorBagClaim,
  clearWorldFloorBagClaim,
  hydrateWorldFloorBagClaimFromLegacy,
  shouldHideWorldFloorBagMesh
} from "./src/game/worldBagState.js";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  GROUND_WORLD_HEIGHT,
  WORLD_SKY_BAND_HEIGHT,
  PLANT_FOG_SKY_OPEN_MIN_STAGE,
  PLANT_INDEX_SCORE_CAP,
  PLANT_INDEX_SEEDED_SOIL,
  PLANT_INDEX_SPROUT_STAGE_1,
  PLANT_INDEX_SPROUT_STAGE_2,
  PLANT_INDEX_SPROUT_STAGE_3,
  PLANT_INDEX_GRASS_STAGE_4,
  PLANT_INDEX_GRASS_STAGE_5,
  PLANT_FOG_BUTTERFLY_MIN_SCORE,
  PLANT_FOG_TRADE_MASTER_MIN_STAGE,
  PLANT_FOG_ALCHEMY_MASTER_MIN_STAGE,
  getPlantFogWorldStageFromScore,
  getPlantFogClearRectWorldPx,
  getPlantFogGlobalDimAlphaForStage,
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
  TRADE_MASTER_START_X,
  TRADE_MASTER_START_Y,
  ALCHEMY_MASTER_START_X,
  ALCHEMY_MASTER_START_Y,
  SIGN_START_X,
  SIGN_START_Y,
  SIGN_WIDTH,
  SIGN_HEIGHT,
  SPAWN_PORTAL_WIDTH,
  SPAWN_PORTAL_HEIGHT,
  SPAWN_PORTAL_X,
  SPAWN_PORTAL_Y,
  SEED_START_X,
  SEED_START_Y,
  GUIDE_BOOK_START_X,
  GUIDE_BOOK_START_Y,
  GUIDE_BOOK_WIDTH,
  GUIDE_BOOK_HEIGHT,
  WORLD_BAG_WIDTH,
  WORLD_BAG_HEIGHT,
  WORLD_BAG_START_X,
  WORLD_BAG_START_Y,
  NPC_START_X,
  NPC_START_Y,
  appleEatMs,
  plantActionMs,
  appleRespawnMs,
  WORLD_LOOSE_SEED_ID,
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y,
  WORLD_LOOSE_ROCK_COUNT,
  WORLD_ROCK_RESPAWN_INTERVAL_MS,
  WORLD_ROCK_SIZE,
  WORLD_ROCK_SPAWN_X_MARGIN,
  WORLD_ROCK_SPAWN_Y_MIN,
  WORLD_ROCK_SPAWN_Y_MAX,
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
  level4GrowMs,
  level5GrowMs,
  butterflyMaxAlive,
  butterflyColors,
  butterflyFrameCount,
  butterflyFrameMs,
  butterflySpeed,
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
  tradeMasterDialogueCompleteKey,
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
  tradeMaster,
  alchemyMaster,
  npcBubble,
  tradeMasterBubble,
  tradeExchangeOverlay,
  tradeCounterSlot,
  tradeOfferList,
  tradeExchangeConfirm,
  tradeExchangeClose,
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
  worldBag,
  guideBookButton,
  worldBagInventory,
  bagInventoryPanel,
  bagInventoryClose,
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
  treeAppleElements,
  world,
  ground,
  worldPlantFog,
  worldSkyFog,
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
  migrateUnscopedUserPickupFlagsToUserScope,
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
  countActiveRemotePlayers,
  getAdaptiveWorldPollMinMs,
  getAdaptiveWorldSyncLoopMs,
  getAdaptivePresenceDbSyncMs,
  getAdaptivePresenceDbPollMs,
  getAdaptiveBroadcastMinMs,
  getAdaptiveHeartbeatMs
} from "./src/multiplayer/timing.js";
import {
  getNumericButterflyValue as getNumericButterflyValueCore,
  createButterflyMotionController
} from "./src/multiplayer/butterflyMotion.js";
import {
  isWorldPointInsideRect as isWorldPointInsideRectCore,
  getPlantVisibleHoverRectsWorld as getPlantVisibleHoverRectsWorldCore,
  getPlantWorldAnchorXY
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
import { createMovementTutorial } from "./src/game/movementTutorial.js";
import {
  showAppLoadingScreen,
  hideAppLoadingScreen
} from "./src/app/loading-screen.js";
import {
  setOverlayOpen as setSettingsOverlayOpen,
  updateSettingsTutorialButtons as updateSettingsTutorialButtonsUi
} from "./src/app/settings-panel.js";
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
  getWorldFloorPickupStorageSlugs
} from "./src/game/room-storage-keys.js";
import {
  loadBagInventoryOrder as loadBagInventoryOrderCore,
  saveBagInventoryOrder as saveBagInventoryOrderCore,
  normalizeBagInventoryOrderByCounts as normalizeBagInventoryOrderByCountsCore,
  getBagItemDescriptor as getBagItemDescriptorCore
} from "./src/game/bag-inventory.js";
import {
  bindTradeMaster,
  closeTradeExchangePanel,
  handleBagSlotClickWhileTradeOpen,
  hydrateTradeMasterDialogueComplete,
  isNearTradeMaster,
  isTradeExchangeOpen,
  pickWorldNpcHover,
  tryTalkToTradeMaster,
  updateTradeNpcPrompt
} from "./src/game/trade-master-ui.js";

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
let worldBagX = WORLD_BAG_START_X;
let worldBagY = WORLD_BAG_START_Y;
let hasGuideBook = false;
let isGuideBookOpen = false;
let isGuideDismissedAtSign = false;
let isGuideBookClickPromptActive = false;
let onboardingFlowStep = 1;
let onboardingJumpLatch = false;
let onboardingNpcGuideEscHintShown = false;
let onboardingEscHintTimerId = null;
let playerAlertHideTimerId = null;
let onboardingCongratsTimerId = null;
let onboardingTreeLeaveHintTimerId = null;
let onboardingFinalHideTimerId = null;
let onboardingButterflyCountBaseline = null;
let onboardingTutorialEnteredTree = false;
let onboardingSeedTutorialSecondLine = false;
/** 25?계: 0 = ?매 ?내(2?, 1 = ?앗 ?용 ?내 */
let onboardingPostAppleSeedIntroPhase = 0;
let onboardingFruitIntroTimerId = null;
/** 16?계: 0 = 축하 문구, 1 = ?어???내(????텝? 계속 16) */
let onboardingPostWaterCongratsPhase = 0;
const ONBOARDING_MAX_STEP = 27;
/** tutorial.html: ?의 ?토리얼 ?앗???라????시 ?기까?(ms) */
const TUTORIAL_MAIN_SEED_RESPAWN_MS = 5000;
let tutorialMainSeedRespawnTimerId = null;
/** ????리스???후?는 ?벤·?앗 ?보???두?강조 ?략(??이?만). */
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
let lastWorldRockRespawnAt = 0;
let lastBucketPickupAt = 0;
let isInteractKeyLatched = false;
const guidePlaceholderHtml = "<p>?직 ?용???습?다!</p>";
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
/** ???위 로그???원(ovc-login.js? ?일 ??. ?으?localStorage보다 ?선 */
const ovcSessionUserIdKey = "ovcSessionUserIdV1";
const ovcSessionUserNameKey = "ovcSessionUserNameV1";
const ovcSessionTokenKey = "ovcSessionTokenV1";
const OVC_ACCOUNT_LEADER_STALE_MS = 55000;

function readOvcTabSessionUserId() {
  try {
    return (sessionStorage.getItem(ovcSessionUserIdKey) || "").trim();
  } catch (e) {
    return "";
  }
}

function readOvcTabSessionUserName() {
  try {
    return (sessionStorage.getItem(ovcSessionUserNameKey) || "").trim();
  } catch (e) {
    return "";
  }
}

(function syncOvcSessionUserIdFromLocalForNewTab() {
  try {
    if (sessionStorage.getItem(ovcSessionUserIdKey)) return;
    const fromLocal = (localStorage.getItem(currentUserIdKey) || "").trim();
    if (!fromLocal) return;
    sessionStorage.setItem(ovcSessionUserIdKey, fromLocal);
  } catch (eSync) {}
})();

function getEffectiveOvcSessionToken() {
  try {
    const t = (sessionStorage.getItem(ovcSessionTokenKey) || "").trim();
    if (t) return t;
  } catch (e) {}
  try {
    return (localStorage.getItem(currentSessionTokenKey) || "").trim();
  } catch (e2) {}
  return "";
}

const localLoginUserId = (getStoredValue(currentUserIdKey) || "").trim();
const localLoginUserName = (getStoredValue(currentUserKey) || "").trim();
const tabSessionUserId = readOvcTabSessionUserId();
const tabSessionUserName = readOvcTabSessionUserName();
const currentUserId = tabSessionUserId ? tabSessionUserId : localLoginUserId;
const currentUserName = (function () {
  if (tabSessionUserId) {
    if (tabSessionUserName) return tabSessionUserName;
    if (localLoginUserId === tabSessionUserId && localLoginUserName) {
      return localLoginUserName;
    }
    return "";
  }
  return localLoginUserName;
})().trim();
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
  migrateUnscopedUserPickupFlagsToUserScope(currentUserId);
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

/** ??된 ?벤???????앗???으??드 메인 ?앗??기(리로????중복 방?) */
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

function roomKeyedPickupFlagTrueAnySlug(keyPrefix) {
  const slugs = getWorldFloorPickupStorageSlugs();
  for (let i = 0; i < slugs.length; i += 1) {
    if (getStoredFlag(keyPrefix + slugs[i])) return true;
  }
  return false;
}

function setRoomKeyedPickupFlagAllSlugs(keyPrefix, enabled) {
  getWorldFloorPickupStorageSlugs().forEach(function (slug) {
    setStoredFlag(keyPrefix + slug, Boolean(enabled));
  });
}

function removeRoomKeyedPickupForAllSlugs(keyPrefix) {
  getWorldFloorPickupStorageSlugs().forEach(function (slug) {
    removeStoredValue(keyPrefix + slug);
  });
}

const GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX = "guideBookPickedRoomV1:";
const WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX = "worldBagGroundPickedRoomV1:";
const WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX = "worldGuideBookOffGroundPickedRoomV1:";

function hasPickedGuideBookInCurrentRoom() {
  if (roomKeyedPickupFlagTrueAnySlug(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX)) return true;
  if (isWorldFloorBagClaimed(getStoredFlag)) {
    setGuideBookPickedForCurrentRoom();
    return true;
  }
  if (getStoredFlag(hasGuideBookKey)) {
    setGuideBookPickedForCurrentRoom();
    return true;
  }
  return false;
}

function setGuideBookPickedForCurrentRoom() {
  setRoomKeyedPickupFlagAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX, true);
  setStoredFlag(hasGuideBookKey, true);
}

function hasPickedWorldBagGroundInCurrentRoom() {
  return isWorldFloorBagClaimed(getStoredFlag);
}

function setWorldBagGroundPickedForCurrentRoom() {
  persistWorldFloorBagClaim(setStoredFlag);
}

function hasPickedWorldGuideBookOffGroundInCurrentRoom() {
  return roomKeyedPickupFlagTrueAnySlug(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX);
}

function setWorldGuideBookOffGroundPickedForCurrentRoom() {
  setRoomKeyedPickupFlagAllSlugs(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX, true);
}

const tutorialSessionWorldGuideBookOffGroundKey = "ovcTutorialSessionWorldGuideBookOffGroundPickedV1";

function clearTutorialSessionWorldFloorPickupFlags() {
  clearTutorialSessionFloorBagPicked();
  try {
    sessionStorage.removeItem(tutorialSessionWorldGuideBookOffGroundKey);
  } catch (e) {}
}

function tutorialSessionWorldGuideBookOffGroundPicked() {
  try {
    return sessionStorage.getItem(tutorialSessionWorldGuideBookOffGroundKey) === "1";
  } catch (e) {
    return false;
  }
}

function setTutorialSessionWorldGuideBookOffGroundPicked() {
  try {
    sessionStorage.setItem(tutorialSessionWorldGuideBookOffGroundKey, "1");
  } catch (e) {}
}

/** ?드(index): 로컬 ??? ?토리얼: ?번 ?이지 방문(session)????드? 별도. */
function isWorldFloorBagHiddenForCurrentView() {
  return shouldHideWorldFloorBagMesh(
    isWorldDocumentEntry,
    getStoredFlag,
    readTutorialSessionFloorBagPicked,
    function worldFloorBagExtraLegacyGuideRoom() {
      return roomKeyedPickupFlagTrueAnySlug(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
    }
  );
}

function isWorldFloorGuideBookHiddenForCurrentView() {
  if (isWorldDocumentEntry()) {
    return hasPickedWorldGuideBookOffGroundInCurrentRoom();
  }
  return tutorialSessionWorldGuideBookOffGroundPicked();
}

/** 가?UI ?롯?????바닥 책을 줍기 ?에??0(가방만 줍? 직후 ?벤? 비어 ?음). */
function hasGuideBookItemInBagCounts() {
  if (isWorldDocumentEntry()) {
    return hasPickedWorldGuideBookOffGroundInCurrentRoom();
  }
  return tutorialSessionWorldGuideBookOffGroundPicked();
}

let bagInventoryPanelOpen = false;
let bagInventoryItemOrder = [];
let bagInventoryCountsPrev = null;

function loadBagInventoryOrder() {
  return loadBagInventoryOrderCore(getStoredValue);
}

function saveBagInventoryOrder() {
  saveBagInventoryOrderCore(setStoredValue, bagInventoryItemOrder);
}
bagInventoryItemOrder = loadBagInventoryOrder();

let plantProgressScoreTickRowBound = false;
/** ?재 ?물지???자?1000 ?금 ?과 ??줄에 배치(겹침 방?) */
function ensurePlantProgressScoreInTickRow() {
  const scoreEl = document.getElementById("plant-progress-score");
  const ticks = document.querySelector(".plant-progress-ticks");
  if (!scoreEl || !ticks) return;
  if (ticks.querySelector(".plant-progress-tick-row--head")) {
    plantProgressScoreTickRowBound = true;
    return;
  }
  if (plantProgressScoreTickRowBound) return;

  let headRow = ticks.querySelector(".plant-progress-tick-row--head");
  const firstRow = ticks.querySelector(".plant-progress-tick-row");
  if (!firstRow) return;

  if (!headRow) {
    headRow = document.createElement("div");
    headRow.className = "plant-progress-tick-row plant-progress-tick-row--head";
    const mark = firstRow.querySelector(".plant-progress-tick-mark");
    const pct = firstRow.querySelector(".plant-progress-tick-pct");
    if (scoreEl.parentNode !== headRow) {
      headRow.appendChild(scoreEl);
    }
    if (mark) headRow.appendChild(mark);
    if (pct) headRow.appendChild(pct);
    ticks.replaceChild(headRow, firstRow);
  } else if (!headRow.contains(scoreEl)) {
    headRow.insertBefore(scoreEl, headRow.firstChild);
  }
}

let plantProgressSproutToggleBound = false;
function ensurePlantProgressSproutToggleBound() {
  if (plantProgressSproutToggleBound) return;
  const btn = document.getElementById("plant-progress-sprout-toggle");
  if (!btn) return;
  plantProgressSproutToggleBound = true;
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const g = document.getElementById("plant-progress-gauge");
    if (!g) return;
    const nowCollapsed = g.classList.toggle("is-collapsed");
    btn.setAttribute("aria-expanded", nowCollapsed ? "false" : "true");
  });
}

function shouldShowWorldBagInventoryUi() {
  return Boolean(
    hasGuideBook ||
    getStoredFlag(hasGuideBookKey) ||
    isWorldFloorBagClaimed(getStoredFlag)
  );
}

function syncWorldGuideBookGroundVisibility() {
  if (!guideBook) return;
  guideBook.style.display = isWorldFloorGuideBookHiddenForCurrentView() ? "none" : "block";
}

function syncGuideInventoryBar() {
  if (guideBookButton) {
    guideBookButton.style.display = "none";
    guideBookButton.hidden = true;
  }
  if (worldBagInventory) {
    const show = shouldShowWorldBagInventoryUi();
    worldBagInventory.style.display = show ? "block" : "none";
    worldBagInventory.hidden = !show;
  }
  updatePlantProgressGauge();
}

function getPlantIndexPointsForSinglePlant(plant) {
  if (!plant || plant.removed) return 0;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return 0;
  const isPlanted =
    plant.isSeedPlanted ||
    (
      plant.plantedAt != null &&
      Number.isFinite(Number(plant.x)) &&
      Number.isFinite(Number(plant.y))
    );
  if (!isPlanted) return 0;
  if (!plant.isSproutGrown) return PLANT_INDEX_SEEDED_SOIL;
  const st = getSproutStageFromPlant(plant);
  if (st <= 0) return PLANT_INDEX_SEEDED_SOIL;
  if (st === 1) return PLANT_INDEX_SPROUT_STAGE_1;
  if (st === 2) return PLANT_INDEX_SPROUT_STAGE_2;
  if (st === 3) return PLANT_INDEX_SPROUT_STAGE_3;
  if (st === 4) return PLANT_INDEX_GRASS_STAGE_4;
  return PLANT_INDEX_GRASS_STAGE_5;
}

function getTotalPlantIndexScore() {
  let sum = 0;
  if (plantRuntime && plantRuntime.isSeedPlanted) {
    sum += getPlantIndexPointsForSinglePlant(plantRuntime);
  }
  if (appleState && Array.isArray(appleState.extraPlants)) {
    appleState.extraPlants.forEach(function (p) {
      if (!p || p.removed) return;
      sum += getPlantIndexPointsForSinglePlant(p);
    });
  }
  const bonus = Math.max(0, Math.floor(Number(adminDebugPlantIndexBonus) || 0));
  return Math.min(PLANT_INDEX_SCORE_CAP, Math.max(0, sum + bonus));
}

function getPlantFogClearRectForCurrentScore() {
  const stage = getPlantFogWorldStageFromScore(getTotalPlantIndexScore());
  return getPlantFogClearRectWorldPx(stage);
}

/** ?각??맑? 구역보다 ?동 ?용???간 ?? ?기 ?에 막히???낌??줄임 */
function getPlantFogClearRectForMovementClamp() {
  return getPlantFogClearRectForCurrentScore();
}

function isPlantFogMovementClampActive() {
  if (!isWorldDocumentEntry()) return false;
  if (getTotalPlantIndexScore() >= PLANT_INDEX_SCORE_CAP) return false;
  return true;
}

/** ?물지??250+(?개 ?드 2)부??????E 줍기 ?용 */
function isWorldRockPickupUnlocked() {
  if (!isWorldDocumentEntry()) return false;
  return getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= 2;
}

function isTradeMasterVisible() {
  if (!isWorldDocumentEntry()) return false;
  return (
    getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= PLANT_FOG_TRADE_MASTER_MIN_STAGE
  );
}

function isAlchemyMasterVisible() {
  if (!isWorldDocumentEntry()) return false;
  return (
    getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= PLANT_FOG_ALCHEMY_MASTER_MIN_STAGE
  );
}

function isPlayerBoxFullyInsidePlantFogClearRect(playerBox, rect, eps) {
  const e = eps == null ? 0.35 : eps;
  return (
    playerBox.left >= rect.left - e &&
    playerBox.right <= rect.right + e &&
    playerBox.top >= rect.top - e &&
    playerBox.bottom <= rect.bottom + e
  );
}

function syncWorldPlantFogVisuals() {
  if (!isWorldDocumentEntry()) {
    if (worldPlantFog) worldPlantFog.style.display = "none";
    if (worldSkyFog) worldSkyFog.style.display = "none";
    if (world) world.style.filter = "";
    return;
  }
  const stage = getPlantFogWorldStageFromScore(getTotalPlantIndexScore());
  if (world) {
    if (stage >= 5) world.style.filter = "";
    else if (stage === 4) world.style.filter = "brightness(0.94)";
    else if (stage === 3) world.style.filter = "brightness(0.86)";
    else if (stage === 2) world.style.filter = "brightness(0.78)";
    else world.style.filter = "brightness(0.68)";
  }
  if (worldSkyFog) {
    if (stage >= PLANT_FOG_SKY_OPEN_MIN_STAGE) {
      worldSkyFog.style.display = "none";
    } else {
      worldSkyFog.style.display = "block";
      setWorldSize(worldSkyFog, WORLD_WIDTH, WORLD_SKY_BAND_HEIGHT);
      setWorldPosition(worldSkyFog, 0, -WORLD_SKY_BAND_HEIGHT);
    }
  }
  if (!worldPlantFog) return;
  worldPlantFog.style.display = "block";
  worldPlantFog.dataset.stage = String(stage);
  const rect = getPlantFogClearRectWorldPx(stage);
  const W = WORLD_WIDTH;
  const H = GROUND_WORLD_HEIGHT;
  setWorldSize(worldPlantFog, W, H);
  setWorldPosition(worldPlantFog, 0, 0);

  const dim = worldPlantFog.querySelector(".world-plant-fog-dim");
  const topEl = worldPlantFog.querySelector('[data-fog-strip="top"]');
  const bottomEl = worldPlantFog.querySelector('[data-fog-strip="bottom"]');
  const leftEl = worldPlantFog.querySelector('[data-fog-strip="left"]');
  const rightEl = worldPlantFog.querySelector('[data-fog-strip="right"]');
  const lineEl = worldPlantFog.querySelector('[data-fog-clear-line="true"]');

  const dimAlpha = getPlantFogGlobalDimAlphaForStage(stage);
  if (dim) {
    setWorldSize(dim, W, H);
    setWorldPosition(dim, 0, 0);
    dim.style.opacity = String(dimAlpha);
  }

  const showFog = stage < 5;
  [topEl, bottomEl, leftEl, rightEl].forEach(function (el) {
    if (el) el.style.display = showFog ? "block" : "none";
  });
  if (lineEl) {
    const showLine = false;
    lineEl.style.display = "none";
    lineEl.style.borderTopWidth = "0";
    lineEl.style.borderRightWidth = "0";
    lineEl.style.borderBottomWidth = "0";
    lineEl.style.borderLeftWidth = "0";
    if (showLine) {
      if (stage === 4) {
        setWorldSize(lineEl, W, 0);
        setWorldPosition(lineEl, 0, 0);
        lineEl.style.borderTopWidth = "6px";
      } else {
        setWorldSize(lineEl, Math.max(0, rect.right - rect.left), Math.max(0, rect.bottom - rect.top));
        setWorldPosition(lineEl, rect.left, rect.top);
        lineEl.style.borderTopWidth = "6px";
        lineEl.style.borderRightWidth = "6px";
      }
    }
  }
  if (!showFog) return;

  const L = rect.left;
  const T = rect.top;
  const R = rect.right;
  const B = rect.bottom;
  const midH = Math.max(0, B - T);
  const o = 0;

  if (topEl) {
    if (T > 0) {
      setWorldSize(topEl, W + o * 2, T + o);
      setWorldPosition(topEl, -o, -o);
    } else {
      setWorldSize(topEl, 0, 0);
      setWorldPosition(topEl, 0, 0);
    }
  }
  if (bottomEl) {
    if (B < H) {
      setWorldSize(bottomEl, W + o * 2, H - B + o);
      setWorldPosition(bottomEl, -o, B - o);
    } else {
      setWorldSize(bottomEl, 0, 0);
      setWorldPosition(bottomEl, 0, 0);
    }
  }
  if (leftEl) {
    if (L > 0 && midH > 0) {
      setWorldSize(leftEl, L + o, midH + o * 2);
      setWorldPosition(leftEl, -o, T - o);
    } else {
      setWorldSize(leftEl, 0, 0);
      setWorldPosition(leftEl, 0, 0);
    }
  }
  if (rightEl) {
    if (R < W && midH > 0) {
      setWorldSize(rightEl, W - R + o * 2, midH + o * 2);
      setWorldPosition(rightEl, R - o, T - o);
    } else {
      setWorldSize(rightEl, 0, 0);
      setWorldPosition(rightEl, 0, 0);
    }
  }
}

function areButterfliesUnlockedForPlantFogWorld() {
  return isWorldDocumentEntry() && getTotalPlantIndexScore() >= PLANT_FOG_BUTTERFLY_MIN_SCORE;
}

function getDefaultButterflyBounds() {
  return {
    left: butterflyBoundsLeft,
    right: butterflyBoundsRight,
    top: butterflyBoundsTop,
    bottom: butterflyBoundsBottom
  };
}

function getActiveButterflyBounds() {
  const base = getDefaultButterflyBounds();
  if (!isWorldDocumentEntry()) return base;
  const stage = getPlantFogWorldStageFromScore(getTotalPlantIndexScore());
  if (stage < 3 || stage >= 5) return base;
  const clearRect = getPlantFogClearRectWorldPx(stage);
  const bounds = {
    left: Math.max(base.left, clearRect.left),
    right: Math.min(base.right, clearRect.right),
    top: Math.max(base.top, clearRect.top),
    bottom: Math.min(base.bottom, clearRect.bottom)
  };
  if (bounds.right < bounds.left || bounds.bottom < bounds.top) return base;
  return bounds;
}

function clampButterflyPointToActiveBounds(x, y) {
  const bounds = getActiveButterflyBounds();
  return {
    x: Math.max(bounds.left, Math.min(bounds.right, getNumericButterflyValue(x, bounds.left))),
    y: Math.max(bounds.top, Math.min(bounds.bottom, getNumericButterflyValue(y, bounds.top)))
  };
}

function keepButterfliesInsideActiveBounds() {
  let changed = false;
  butterflyState.list.forEach(function (butterfly) {
    if (!butterfly) return;
    const beforeX = Number(butterfly.x);
    const beforeY = Number(butterfly.y);
    const next = clampButterflyPointToActiveBounds(butterfly.x, butterfly.y);
    butterfly.x = next.x;
    butterfly.y = next.y;
    if (
      !Number.isFinite(beforeX) ||
      !Number.isFinite(beforeY) ||
      Math.abs(beforeX - next.x) > 0.001 ||
      Math.abs(beforeY - next.y) > 0.001
    ) {
      delete butterflyAuthorityWaypointById[String(butterfly.id || "")];
      butterfly._renderX = next.x;
      butterfly._renderY = next.y;
      changed = true;
    }
  });
  return changed;
}

function clearLiveButterfliesForPlantFogLock(now) {
  if (!butterflyState.list.length) return false;
  butterflyState.list.forEach(function (b) {
    if (b && b.id != null) removeButterflyRenderEntry(b.id);
  });
  butterflyState.list = [];
  butterflyState.lastSpawnAt = 0;
  hasSeededInitialButterflies = false;
  Object.keys(butterflyAuthorityWaypointById).forEach(function (wid) {
    delete butterflyAuthorityWaypointById[wid];
  });
  lastButterflyStateChangeAt = Date.now();
  markWorldDirty();
  const ts = now != null ? now : Date.now();
  if (isButterflyAuthority() && multiplayerChannel && currentSessionId) {
    broadcastButterflyState(ts);
  }
  return true;
}

function updatePlantProgressGauge() {
  syncWorldPlantFogVisuals();
  const score = getTotalPlantIndexScore();
  const legacyHud = document.getElementById("world-plant-index-hud");
  if (legacyHud) {
    legacyHud.style.display = "none";
    legacyHud.setAttribute("aria-hidden", "true");
  }
  const gauge = document.getElementById("plant-progress-gauge");
  if (!gauge) return;
  const progress =
    PLANT_INDEX_SCORE_CAP > 0
      ? Math.max(0, Math.min(1, score / PLANT_INDEX_SCORE_CAP))
      : 0;
  gauge.style.setProperty("--plant-fill", String(progress));

  const visible = Boolean(hasSpawnedCharacter && !isCharacterSelecting);
  gauge.classList.toggle("is-visible", visible);
  gauge.setAttribute("aria-hidden", visible ? "false" : "true");
  ensurePlantProgressScoreInTickRow();
  const scoreEl = document.getElementById("plant-progress-score");
  if (scoreEl) {
    scoreEl.textContent = String(score);
  }
  ensurePlantProgressSproutToggleBound();

  const meterEl = gauge.querySelector(".plant-progress-meter");
  const fillEl = gauge.querySelector(".plant-progress-fill");
  if (fillEl) {
    const ch =
      visible && meterEl && meterEl.getBoundingClientRect().height > 48
        ? meterEl.getBoundingClientRect().height
        : 388;
    const fillMax = Math.max(0, ch - 34);
    fillEl.style.height = Math.round(fillMax * progress) + "px";
  }

  if (!visible) return;

  gauge.querySelectorAll(".plant-progress-reward").forEach(function (reward) {
    const t = Number(reward.getAttribute("data-threshold"));
    if (!Number.isFinite(t)) return;
    reward.classList.toggle("is-unlocked", score >= t);
  });
}

function syncWorldBagGroundVisibility() {
  syncWorldGuideBookGroundVisibility();
  if (worldBag) {
    if (isWorldFloorBagHiddenForCurrentView() && !hasGuideBook) {
      hasGuideBook = true;
      setWorldBagGroundPickedForCurrentRoom();
      setGuideBookPickedForCurrentRoom();
    }
    worldBag.style.display = isWorldFloorBagHiddenForCurrentView() ? "none" : "block";
  }
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
/** 로컬·멀??presence?????집 ?태 ?시 길이(?격? rock_pickup 종료 ??hold 별도) */
const WORLD_ROCK_PICKUP_ACTION_MS = 1000;
/** ?격 ?레?어: rock_pickup ?션???긴 ???태 ?스?? ????ms(?른 ?션? REMOTE_ACTION_STATUS_HOLD_MS) */
const WORLD_ROCK_REMOTE_STATUS_TAIL_MS = 0;
const REMOTE_WATER_SPLASH_ACCEPT_MS = 60000;
const MAX_SNAPSHOT_CLOCK_SKEW_MS = 60000;
const SYNC_EVENT_DEDUPE_TTL_MS = 120000;
const SYNC_EVENT_DEDUPE_MAX = 4000;
const SYNC_DEBUG_TRACE = false;
const WORLD_HEART_FX_MS = 2200;
/** ?퍼??버튼??펙????갱?에 ?일?게 ?는 ?모지(?) */
const WORLD_SAD_BUTTON_EMOJI = "\uD83D\uDE22";
const WORLD_CHAT_MAX_CHARS = 120;
/** ?체 채팅 ?두(???는 모두?게 ?시). */
const WORLD_CHAT_GLOBAL_PREFIX = "\uC804\uCCB4:";
/** ?각 콜론(U+FF1A) ?을 반각(U+003A)?로 ?일 ??IME·모바?에??귓말/?체 구문??깨?지 ?게 */
function normalizeWorldChatColonsForParsing(str) {
  return String(str || "").replace(/\uFF1A/g, ":");
}

/** UTF-16 ?로게이????중간?서 ?리지 ?게 ?름 */
function truncateWorldChatString(s, maxLen) {
  const n = Math.max(0, Number(maxLen) || 0);
  if (!s || s.length <= n) return s;
  let cut = s.slice(0, n);
  const hi = cut.charCodeAt(cut.length - 1);
  if (hi >= 0xd800 && hi <= 0xdbff) {
    cut = cut.slice(0, -1);
  }
  return cut;
}
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
let worldSadBtn = null;
let worldChatToggleBtn = null;
let worldChatPanelEl = null;
let worldChatLogEl = null;
let worldChatInputEl = null;
let worldChatUsersBtn = null;
let worldChatUserPickerEl = null;
let worldChatInputWrapEl = null;
let worldChatUsersPickerOpen = false;
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
let lastButterflyRealtimeStateAt = 0;
let lastLocalButterflyCatchAt = 0;
let lastLocalButterflyCatchActionAt = 0;
let lastLocalWorldRockPickupAt = 0;
/**
 * Map of butterflyId -> ms timestamp of when this client caught it locally.
 * Used to suppress the butterfly from re-appearing if the authority's stale
 * pre-catch broadcast arrives after the catch was saved. Entries are pruned
 * after a few seconds, by which time the authority has reconciled.
 */
const butterflyLocalCatchTombstoneById = {};
const BUTTERFLY_LOCAL_CATCH_TOMBSTONE_MS = 8000;
let syncEventDedupeStore = null;
/** ???환·백그?운????복? ?????레?에 ??간??건너?면 ?비 경로가 ?간?동처럼 보임 ???이?인??리셋 */
let lastButterflyWallClockMs = 0;
let gameLoopCyclesForTutorialSync = 0;
const butterflyState = {
  list: [],
  // 0 means "never seeded yet"; the authority replaces it with a real time the
  // first time it spawns or refills the population.
  lastSpawnAt: 0,
  caughtCounts: { brown: 0, yellow: 0, white: 0 }
};
const butterflyMotion = createButterflyMotionController({
  bounds: {
    left: butterflyBoundsLeft,
    right: butterflyBoundsRight,
    top: butterflyBoundsTop,
    bottom: butterflyBoundsBottom
  },
  getBounds: getActiveButterflyBounds,
  colors: butterflyColors,
  maxAlive: butterflyMaxAlive,
  minLeg: 56,
  maxLeg: 158,
  speed: butterflySpeed,
  legMaxMs: butterflyLegMaxMs,
  flutter: {
    periodHorizontalMs: butterflyFlutterPeriodHorizontalMs,
    periodVerticalMs: butterflyFlutterPeriodVerticalMs,
    amplitudeX: butterflyFlutterAmplitudeX,
    amplitudeY: butterflyFlutterAmplitudeY
  }
});
let hasSeededInitialButterflies = false;
const butterflyCaughtCountsKey = "butterflyCaughtCountsV1";
const magicPowderCountKey = "magicPowderCountV1";
const MAGIC_POWDER_USE_DISTANCE = Math.max(plantWaterDistance, 72);
let magicPowderCount = 0;
/** 관리자 ?버? ?물지???시·?개 ?에?가???제 ?물 ?산?별개) */
let adminDebugPlantIndexBonus = 0;
let ignoreSnapshotInventorySeedsUntil = 0;
let lastPresenceDbSyncAt = 0;
let lastPresenceDbPollAt = 0;
let isPresenceDbSyncing = false;
let isPresenceDbPolling = false;
let isLoggingOut = false;
let isTabSessionSuperseded = false;
const movementTutorial = createMovementTutorial({
  movementTutorialCompleteKey,
  getStoredFlag,
  setStoredFlag,
  isTutorialDocumentEntry,
  hasCurrentUser: function () {
    return Boolean(currentUserId);
  },
  getHasSpawnedCharacter: function () {
    return hasSpawnedCharacter;
  },
  getIsCharacterSelecting: function () {
    return isCharacterSelecting;
  },
  getIsTabSessionSuperseded: function () {
    return isTabSessionSuperseded;
  },
  getHasGuideBook: function () {
    return hasGuideBook;
  },
  getOnboardingFlowStep: function () {
    return onboardingFlowStep;
  },
  isNearWorldBagPickup,
  dom: {
    overlay: movementTutorialOverlay,
    lineMove: movementTutorialLineMove,
    lineBook: movementTutorialLineBook,
    keys: movementTutorialKeys,
    guideBook,
    worldBag
  },
  getPlayerPose: function () {
    return {
      x: playerX,
      depth: playerDepth,
      jumpY: jumpY
    };
  }
});
let isApplyingWorldState = false;
let isWorldSyncing = false;
let isWorldPolling = false;
let isWorldDirty = false;
let lastWorldSaveAt = 0;
let lastWorldPollAt = 0;
let lastWorldUpdatedAt = "";
let lastWorldSyncUserToastAt = 0;
let localPlantActionLockUntil = 0;
let localAppleActionLockUntil = 0;
let serverClockOffsetMs = 0;
let lastServerClockSyncAt = 0;
/** Until true, do not push local world to Supabase (avoids wiping shared plants before first pull). */
let hasHydratedSharedWorldFromServer = false;
let pendingWorldResetToken = "";
/** ?션??면 ??????비어 공유 리셋?로 ?인 ??appStorageKeysSharedWorldReset?로 가??래그까지 지?짐. local??기?? */
const ovcLastWorldResetTokenStorageKey = "ovcLastWorldResetTokenV1";

function readOvcLastAppliedWorldResetTokenFromStores() {
  try {
    const fromSession = (sessionStorage.getItem(ovcLastWorldResetTokenStorageKey) || "").trim();
    const fromLocal = (localStorage.getItem(ovcLastWorldResetTokenStorageKey) || "").trim();
    if (fromSession && !fromLocal) {
      localStorage.setItem(ovcLastWorldResetTokenStorageKey, fromSession);
    } else if (fromLocal && !fromSession) {
      sessionStorage.setItem(ovcLastWorldResetTokenStorageKey, fromLocal);
    }
    return fromSession || fromLocal;
  } catch (e) {
    return "";
  }
}

function persistOvcLastAppliedWorldResetToken(token) {
  const t = String(token || "").trim();
  if (!t) return;
  try {
    sessionStorage.setItem(ovcLastWorldResetTokenStorageKey, t);
    localStorage.setItem(ovcLastWorldResetTokenStorageKey, t);
  } catch (e2) {}
}

let lastAppliedWorldResetToken = readOvcLastAppliedWorldResetTokenFromStores();
let lastWorldResetAt = 0;
let isReloadingForWorldReset = false;
let remoteBucketUpdateAtById = {};
/**
 * Session ids recently seen in this room (DB presence + realtime broadcasts).
 * Includes same-login tabs so butterfly authority is a single elected client.
 */
let multiplayerRoomSessionIdsLastSeen = Object.create(null);
let multiplayerRoomSessionButterflyActive = Object.create(null);
let multiplayerRoomSessionButterflyStateLastSeen = Object.create(null);
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
/** 버킷 ?트?크 로그 ???요???만 true */
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
playerBaseImage.src = "??지/player-white.png";
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

/** index ?드 + ?보???료: ???앗? worldLooseSeed·seedCount ?책 (src/game/groundSeed.js 참고). */
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

/** ?드 ?슨 ?앗 모드: 중복 id·과도??seedCount ?리 */
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
const spawnPortalWidth = SPAWN_PORTAL_WIDTH;
const spawnPortalHeight = SPAWN_PORTAL_HEIGHT;
const spawnPortalX = SPAWN_PORTAL_X;
const spawnPortalY = SPAWN_PORTAL_Y;
const spawnPlayerX = spawnPortalX + spawnPortalWidth / 2 - PLAYER_WIDTH / 2;
const spawnPlayerDepth = getMinGroundedPlayerDepth();
/** ?무 ?로 ?용 범위??어?릴 ???레?당 최? 변??(?간?동 ?낌 ?화) */
const TREE_DEPTH_CLAMP_MAX_STEP = 4;
/**
 * 보이??뿌리?= style.css .big-tree-roots (left 39, w 68, h 16, bottom -2).
 * ?체 기둥 박스?겹치???지?갈 ??몸통?겹쳐???무 모드??어가 ?간?동처럼 보임 ??발·뿌리만 검??
 */
const TREE_CSS_ROOTS_LEFT = 39;
const TREE_CSS_ROOTS_WIDTH = 68;
const TREE_CSS_ROOTS_HEIGHT = 16;
const TREE_CSS_ROOTS_BOTTOM_EXTEND = 2;
/** ?레?어·NPC 공통: 머리 ?선?말풍???이(?드 ?위) */
const SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD = 4;
/** NPC 말풍?? 머리???간격(?레?어보다 좁게) */
const NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD = 0;
/**
 * npcY???프?이??박스 ?선(?드 y가 ?을?록 ?면 ??.
 * PNG ?단 ?백만큼 ?래??려 ?제 머리 ???y.
 */
const NPC_HEAD_TOP_TRIM_WORLD = 8;
/** NPC 말풍?? ?수?수?y?줄여 머리 ??래)?로 ?동 */
const NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD = 4;
/** ?레?어 말풍?만: ?네??머리 근처) ?에 ?실???리??드 ?위, ?수?말풍?????? */
const PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD = 16;
const SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX = 0;

function getActiveRemotePlayerCountForTick() {
  return countActiveRemotePlayers(remotePlayers, Date.now());
}

/** ?격 ?원??많을?록 ?링·???간격???간 ?려 DB·?라?언??부?? 줄임 */
function getMultiplayerWorldPollMinMs() {
  return getAdaptiveWorldPollMinMs(getActiveRemotePlayerCountForTick());
}

function getMultiplayerWorldSyncLoopMs() {
  return getAdaptiveWorldSyncLoopMs(getActiveRemotePlayerCountForTick());
}

function getMultiplayerPresenceDbSyncMs() {
  return getAdaptivePresenceDbSyncMs(getActiveRemotePlayerCountForTick());
}

function getMultiplayerPresenceDbPollMs() {
  return getAdaptivePresenceDbPollMs(getActiveRemotePlayerCountForTick());
}

function getMultiplayerBroadcastMinMs() {
  return getAdaptiveBroadcastMinMs(getActiveRemotePlayerCountForTick());
}

function getMultiplayerHeartbeatMs() {
  return getAdaptiveHeartbeatMs(getActiveRemotePlayerCountForTick());
}

function showThrottledWorldSyncToast(message) {
  const now = Date.now();
  if (now - lastWorldSyncUserToastAt < 14000) return;
  lastWorldSyncUserToastAt = now;
  showOnlineDebugMessage(message);
}

const keys = createInputState();

/** Other browser tabs use a different session id but the same account ??do not draw them as remotes. */
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

function ovcIsForeignLiveAccountSession() {
  if (!currentUserId) return false;
  try {
    const raw = localStorage.getItem(getAccountSessionLeaderStorageKey());
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const at = Number(parsed && parsed.at) || 0;
    if (!at || Date.now() - at > OVC_ACCOUNT_LEADER_STALE_MS) return false;
    const myTok = sessionStorage.getItem(accountLeaderTokenSessionKey) || "";
    if (myTok && parsed.token === myTok) return false;
    return true;
  } catch (e) {
    return false;
  }
}

if (ovcIsForeignLiveAccountSession()) {
  window.location.replace("ovc-login.html?v=20260509a&ovc_err=duplicate_session");
  throw new Error("OVC login required");
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

const ACCOUNT_SESSION_LEADER_HEARTBEAT_MS = 25000;
setInterval(function () {
  if (isTabSessionSuperseded || !currentUserId) return;
  try {
    const key = getAccountSessionLeaderStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const myToken = sessionStorage.getItem(accountLeaderTokenSessionKey);
    if (!myToken || !parsed || parsed.token !== myToken) return;
    localStorage.setItem(
      key,
      JSON.stringify({
        token: parsed.token,
        sessionId: parsed.sessionId,
        at: Date.now()
      })
    );
  } catch (eHb) {}
}, ACCOUNT_SESSION_LEADER_HEARTBEAT_MS);

window.addEventListener("pagehide", function () {
  if (!currentUserId) return;
  try {
    const key = getAccountSessionLeaderStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const myToken = sessionStorage.getItem(accountLeaderTokenSessionKey);
    if (!myToken || !parsed || !parsed.token || parsed.token !== myToken) return;
    localStorage.removeItem(key);
  } catch (ePh) {}
});

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
    const sid = readOvcTabSessionUserId();
    const sname = readOvcTabSessionUserName();
    if (sid && sname && sid === String(currentUserId).trim()) {
      return sname;
    }
  } catch (eSess) {}
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

function groundScreenPxToWorldX(px) {
  const cw = ground.clientWidth || 1;
  return (px * WORLD_WIDTH) / cw;
}

/** headTopWorldY: 캐릭??머리(?선) ?드 y. 말풍??transform 기? y(버블 ??? */
function speechBubbleTopWorldYFromHead(headTopWorldY, bubbleElement, gapAboveHeadWorld) {
  const gap =
    gapAboveHeadWorld != null ? gapAboveHeadWorld : SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD;
  const bhWorld = groundScreenPxToWorldY(bubbleElement.offsetHeight || 12);
  return headTopWorldY - gap - bhWorld;
}

function setSpeechBubbleTransform(bubbleEl, worldX, worldY) {
  if (!bubbleEl) return;
  const px = Math.round(toScreenX(worldX));
  const py = Math.round(toScreenY(worldY));
  const n = Math.round(SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  bubbleEl.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
}

function setNpcBubbleWorldPosition(worldX, worldY) {
  setSpeechBubbleTransform(npcBubble, worldX, worldY);
}

function setPlayerBubbleWorldPosition(worldX, worldY) {
  const px = Math.round(toScreenX(worldX));
  const py = Math.round(toScreenY(worldY));
  const n = Math.round(SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX);
  playerBubble.style.transform = n
    ? "translate(" + px + "px, " + py + "px) translateY(" + n + "px)"
    : "translate(" + px + "px, " + py + "px)";
}

function getNpcHeadTopWorldY(npcWorldTopY) {
  return Number(npcWorldTopY) + NPC_HEAD_TOP_TRIM_WORLD;
}

function layoutNpcSpeechBubble() {
  const bubbleWidth = npcBubble.offsetWidth || 48;
  const npcHeadTop = getNpcHeadTopWorldY(npcY);
  const bubbleWorldY =
    speechBubbleTopWorldYFromHead(npcHeadTop, npcBubble, NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD) -
    NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD;
  setNpcBubbleWorldPosition(
    npcX + NPC_WIDTH / 2 - bubbleWidth / 2,
    bubbleWorldY
  );
}

/** ?드(index) ?용: 공유 맵만 초기?? ?토리얼 ??값·tutorial.html ?동 ?음. */
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

  if (event.code === "Tab" && !event.repeat && !event.shiftKey) {
    const focusEl = document.activeElement;
    const inOtherTextField =
      focusEl &&
      (focusEl.tagName === "INPUT" || focusEl.tagName === "TEXTAREA" || focusEl.isContentEditable) &&
      focusEl !== worldChatInputEl;
    if (inOtherTextField) {
      return;
    }
    if (isWorldChatBlockingGameInput()) {
      return;
    }
    if (!hasSpawnedCharacter) {
      return;
    }
    if (!worldBagInventory || !shouldShowWorldBagInventoryUi()) {
      return;
    }
    if (
      (settingsOverlay && settingsOverlay.classList.contains("is-open")) ||
      (controlsOverlay && controlsOverlay.classList.contains("is-open"))
    ) {
      return;
    }
    event.preventDefault();
    toggleBagInventoryPanelFromBagClick();
    return;
  }

  if (
    isWorldDocumentEntry() &&
    hasSpawnedCharacter &&
    !isCharacterSelecting &&
    worldSocialUiReady
  ) {
    const ae = document.activeElement;
    const typingInWorldChat = ae === worldChatInputEl;
    const typingInOtherField =
      ae &&
      (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable) &&
      !typingInWorldChat;
    const overlaysBlockWorldSocialShortcuts =
      (settingsOverlay && settingsOverlay.classList.contains("is-open")) ||
      (controlsOverlay && controlsOverlay.classList.contains("is-open")) ||
      isGuideBookOpen ||
      (guideCard && guideCard.style.display === "block");

    if (!typingInOtherField && !overlaysBlockWorldSocialShortcuts) {
      if (event.code === "KeyC" && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (!typingInWorldChat) {
          event.preventDefault();
          toggleWorldChatPanel();
          return;
        }
      }
      if (event.code === "KeyH" && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (!typingInWorldChat) {
          event.preventDefault();
          onWorldHeartClick();
          return;
        }
      }
      if (event.code === "KeyS" && (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey) {
        if (!event.repeat && !typingInWorldChat) {
          event.preventDefault();
          onWorldSadClick();
          return;
        }
      }
    }
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
    if (heldItem) {
      if (heldItem === HELD_ITEM_BUCKET && now - lastBucketPickupAt < 260) {
        return;
      }
      dropHeldItem();
      return;
    }
    if (pickUpWorldBag()) return;
    if (!hasGuideBook) {
      return;
    }
    // Catching is allowed even with hands full: nothing else uses E for the
    // butterfly's slot, and forcing a drop first would feel clumsy.
    if (tryCatchButterfly()) return;
    if (pickApple()) return;
    if (pickUpWorldGuideBookNoHold()) return;
    pickUpNearestItem();
  }

  if (key === "q" && !event.repeat) {
    event.preventDefault();
    if (heldItem === HELD_ITEM_BUCKET) {
      useHeldItem();
      return;
    }
    if (isNearPlantMaster()) {
      if (tryTalkToPlantMaster()) return;
    }
    if (isTradeMasterVisible() && isNearTradeMaster()) {
      if (tryTalkToTradeMaster()) return;
    }
    if (hasGuideBook && tryCatchButterfly()) return;
    useHeldItem();
  }

  if (key === "Escape") {
    if (isTradeExchangeOpen()) {
      event.preventDefault();
      closeTradeExchangePanel();
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (worldChatPanelOpen && worldChatPanelEl) {
      event.preventDefault();
      setWorldChatPanelOpen(false);
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
  } else {
    // 백그?운??복? 직후 ???레?에??이??wallDelta가 비정?적?로 커??    // 비권???비 보간·최? ?텝 캡이 ??????것을 막음.
    lastButterflyWallClockMs = 0;
    sendMultiplayerPresence(true);
  }
});
});
window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault();
    event.preventDefault();
    if (isOnboardingLinearGateActive() && onboardingFlowStep < 19) {
      return;
    }
    }
    if (isWorldChatBlockingGameInput()) {
      return;
    }
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
);
function onGuideInventoryToggleClick() {
  if (isTradeExchangeOpen()) {
    return;
  }
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
}
}
function setBagInventoryPanelOpen(open) {
  bagInventoryPanelOpen = Boolean(open);
  if (!bagInventoryPanel) return;
  bagInventoryPanel.style.display = bagInventoryPanelOpen ? "flex" : "none";
  bagInventoryPanel.setAttribute("aria-hidden", bagInventoryPanelOpen ? "false" : "true");
}
}
function closeBagInventoryPanel() {
  if (isTradeExchangeOpen()) {
    closeTradeExchangePanel();
    return;
  }
  setBagInventoryPanelOpen(false);
  updateOnboardingFlowUI();
}
}
function toggleBagInventoryPanelFromBagClick() {
  if (isTradeExchangeOpen()) {
    return;
  }
  if (isOnboardingLinearGateActive() && !onboardingAllowsGuideBookButtonToggle()) {
    flashOnboardingOrderHint("");
    return;
  }
  if (worldSocialUiReady && worldChatPanelOpen) {
    setWorldChatPanelOpen(false);
  }
  const nextOpen = !bagInventoryPanelOpen;
  setBagInventoryPanelOpen(nextOpen);
  if (nextOpen) {
    updateBagInventorySlots();
  }
  if (nextOpen && isOnboardingLinearGateActive() && onboardingFlowStep === 2) {
    isGuideBookOpen = true;
    updateGuideCard();
  }
  updateOnboardingFlowUI();
}
}
function onWorldBagInventoryClick(event) {
  event.preventDefault();
  event.stopPropagation();
  toggleBagInventoryPanelFromBagClick();
}
}
guideBookButton.addEventListener("click", onGuideInventoryToggleClick);
if (worldBagInventory) worldBagInventory.addEventListener("click", onWorldBagInventoryClick);
if (bagInventoryClose) {
  bagInventoryClose.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    closeBagInventoryPanel();
  });
}
}
if (bagInventoryPanel) {
  bagInventoryPanel.addEventListener("click", function (event) {
    if (worldSocialUiReady && worldChatPanelOpen) {
      setWorldChatPanelOpen(false);
    }
    const slot = event.target.closest(".bag-inventory-slot");
    if (!slot || !bagInventoryPanel.contains(slot)) return;
    if (isTradeExchangeOpen()) {
      event.preventDefault();
      event.stopPropagation();
      handleBagSlotClickWhileTradeOpen(slot);
      return;
    }
    const kind = slot.dataset.bagType;
    if (!kind || kind === "empty") return;
    if (kind === "butterfly") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (kind === "book") {
      if (!hasGuideBook) return;
      event.preventDefault();
      event.stopPropagation();
      const wasOpen = isGuideBookOpen || guideCard.style.display === "block";
      isGuideDismissedAtSign = false;
      isGuideBookOpen = !wasOpen;
      if (wasOpen) {
        dismissGuideBookClickPrompt();
      }
      updateGuideCard();
      if (wasOpen) {
        maybeAdvanceOnboardingAfterGuideBookClosed();
      }
      updateOnboardingFlowUI();
      return;
    }
    if (kind === "seed") {
      if (getBagInventorySeedCount() <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      if (usesWorldLooseSeedMode()) {
        plantWorldSeedCount();
        return;
      }
      const firstInv = appleState.extraSeeds.find(function (extraSeed) {
        return (
          extraSeed.inInventory &&
          !extraSeed.planted &&
          extraSeed.id !== plantingInventorySeedId
        );
      });
      if (!firstInv) return;
      plantInventorySeed(firstInv.id);
      return;
    }
    if (kind === "overgrowthSeed") {
      if ((Number(appleState.overgrowthSeedCount) || 0) <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      plantWorldOvergrowthSeedCount();
      return;
    }
    if (kind === "apple") {
      if (appleState.count <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      eatApple();
      return;
    }
    if (kind === "rock") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (kind === "magicPowder") {
      if (magicPowderCount <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      tryUseMagicPowder();
    }
  });
}
}
bindTradeMaster({
  plantMaster: plantMaster,
  tradeMaster: tradeMaster,
  alchemyMaster: alchemyMaster,
  tradeMasterBubble: tradeMasterBubble,
  tradeExchangeOverlay: tradeExchangeOverlay,
  tradeCounterSlot: tradeCounterSlot,
  tradeOfferList: tradeOfferList,
  tradeExchangeConfirm: tradeExchangeConfirm,
  tradeExchangeClose: tradeExchangeClose,
  bagInventoryPanel: bagInventoryPanel,
  worldBagInventory: worldBagInventory,
  TRADE_MASTER_START_X: TRADE_MASTER_START_X,
  TRADE_MASTER_START_Y: TRADE_MASTER_START_Y,
  NPC_WIDTH: NPC_WIDTH,
  NPC_HEIGHT: NPC_HEIGHT,
  NPC_HEAD_TOP_TRIM_WORLD: NPC_HEAD_TOP_TRIM_WORLD,
  NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD: NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD,
  NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD: NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD,
  getNpcHeadTopWorldY: getNpcHeadTopWorldY,
  npcInteractDistance: npcInteractDistance,
  tradeMasterDialogueCompleteKey: tradeMasterDialogueCompleteKey,
  isTradeMasterVisible: isTradeMasterVisible,
  isPlantMasterVisible: isPlantMasterVisible,
  isAlchemyMasterVisible: isAlchemyMasterVisible,
  getCenterDistance: getCenterDistance,
  speechBubbleTopWorldYFromHead: speechBubbleTopWorldYFromHead,
  setSpeechBubbleTransform: setSpeechBubbleTransform,
  setStoredFlag: setStoredFlag,
  setBagInventoryPanelOpen: setBagInventoryPanelOpen,
  updateBagInventorySlots: updateBagInventorySlots,
  updateNpcPosition: updateNpcPosition,
  removeOneBagItem: removeOneBagItemForTrade,
  addBagItems: addBagItemsForTrade,
  saveAppleState: saveAppleState,
  markWorldDirty: markWorldDirty,
  isNpcDialogueRunning: function () {
    return isNpcDialogueRunning;
  }
});
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
});
function dismissGuideBookClickPrompt() {
  if (!isGuideBookClickPromptActive) return;
  isGuideBookClickPromptActive = false;
  setStoredFlag(guideBookClickPromptDismissedKey, true);
}
}
function maybeAdvanceOnboardingAfterGuideBookClosed() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (onboardingFlowStep === 3) {
    onboardingClearEscHintTimer();
    onboardingFlowStep = 4;
    persistOnboardingStep();
  } else if (onboardingFlowStep === 10) {
    onboardingClearEscHintTimer();
    onboardingNpcGuideEscHintShown = false;
    onboardingFlowStep = 11;
    persistOnboardingStep();
  }
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
}
guideCard.addEventListener("pointerdown", function (event) {
  if (event.target.closest("#guide-nav")) return;
  closeGuideCardFromClick();
});
});
guideCloseButton.addEventListener("click", function (event) {
  event.stopPropagation();
  closeGuideCardFromClick();
});
});
document.addEventListener("click", function (event) {
  if (guideCard.style.display !== "block") return;
  if (guideCard.contains(event.target)) return;
  if (event.target === guideBookButton) return;
  if (worldBagInventory && (event.target === worldBagInventory || worldBagInventory.contains(event.target)))
    return;
  if (bagInventoryPanel && (event.target === bagInventoryPanel || bagInventoryPanel.contains(event.target)))
    return;
    return;
  closeGuideCardFromClick();
}, true);
}, true);
seed.addEventListener("mouseenter", function () {
  isHoveringMainSeed = true;
});
});
seed.addEventListener("mouseleave", function () {
  isHoveringMainSeed = false;
});
});
/* 가?버튼(#world-bag-inventory) ?버??document ?인?로 ?기 ?트? ?기??*/
if (plantHoverLabel) {
  document.addEventListener("pointermove", function (e) {
    syncPlantHoverFromPointerClient(e.clientX, e.clientY);
  });
}
document.addEventListener("pointerup", function (e) {
  if (e.button !== 0) return;
  tryWaterPlantByPointerClick(e.clientX, e.clientY);
});
  if (guidePageIndex > 0) {
guidePrev.addEventListener("click", function (event) {
  event.stopPropagation();
  if (guidePageIndex > 0) {
    guidePageIndex -= 1;
  }
  updateGuidePages();
});
  const maxPage = getGuideMaxPage();
guideNext.addEventListener("click", function (event) {
  event.stopPropagation();
  const maxPage = getGuideMaxPage();
  if (guidePageIndex < maxPage) {
    guidePageIndex += 1;
  }
  updateGuidePages();
});
});
characterSelectButton.addEventListener("click", function () {
  finishCharacterSelect();
});
const settingsModal = document.getElementById("settings-modal");
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
const localPlayerRoot = document.createElement("div");
localPlayerRoot.className = "remote-player local-player-avatar";
if (player && player.parentNode) {
  player.parentNode.insertBefore(localPlayerRoot, player);
  localPlayerRoot.appendChild(player);
  player.classList.add("remote-player-body");
  if (playerName) {
    localPlayerRoot.appendChild(playerName);
    playerName.classList.add("remote-player-name");
  }
  localPlayerRoot.appendChild(playerColorBody);
} else if (player) {
  player.insertAdjacentElement("afterend", playerColorBody);
}
const networkDebugButton = document.createElement("button");
networkDebugButton.id = "network-debug-button";
networkDebugButton.type = "button";
networkDebugButton.setAttribute("aria-label", "로그");
document.body.appendChild(networkDebugButton);
const adminDevMagicPowderButton = document.createElement("button");
adminDevMagicPowderButton.id = "admin-dev-magic-powder-button";
adminDevMagicPowderButton.type = "button";
adminDevMagicPowderButton.textContent = "";
adminDevMagicPowderButton.setAttribute("aria-label", "마법??가?+1 (관리자 ?스??");
adminDevMagicPowderButton.setAttribute("title", "마법??가?+1");
document.body.appendChild(adminDevMagicPowderButton);
const adminDevPlantIndexPlusButton = document.createElement("button");
adminDevPlantIndexPlusButton.id = "admin-dev-plant-index-plus-button";
adminDevPlantIndexPlusButton.type = "button";
adminDevPlantIndexPlusButton.textContent = "+";
adminDevPlantIndexPlusButton.setAttribute("aria-label", "?물지??+100 (?스??");
adminDevPlantIndexPlusButton.setAttribute("title", "?물지??+100 (관리자 ?스??");
document.body.appendChild(adminDevPlantIndexPlusButton);
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
adminDevMagicPowderButton.addEventListener("click", function () {
  magicPowderCount = Math.max(0, Math.floor(magicPowderCount)) + 1;
  saveMagicPowderCount();
  updateMagicPowderInventoryUi();
});
adminDevPlantIndexPlusButton.addEventListener("click", function () {
  adminDebugPlantIndexBonus = Math.max(0, Math.floor(adminDebugPlantIndexBonus)) + 100;
  updatePlantProgressGauge();
});
const controlsButton = document.createElement("button");
controlsButton.id = "controls-button";
controlsButton.type = "button";
controlsOverlay.id = "controls-overlay";
settingsModal.insertBefore(controlsButton, logoutButton);
const controlsOverlay = document.createElement("div");
controlsOverlay.id = "controls-overlay";
controlsOverlay.setAttribute("aria-hidden", "true");
controlsOverlay.innerHTML =
  '<div id="controls-modal">' +
  '<div><span>A / \u2190</span><p>왼쪽으로 이동</p></div>' +
  '<div class="controls-list">' +
  '<div><span>W / \u2191</span><p>?로 ?동</p></div>' +
  '<div><span>A / \u2190</span><p>?쪽?로 ?동</p></div>' +
  '<div><span>S / \u2193</span><p>?래??동</p></div>' +
  '<div><span>D / \u2192</span><p>?른쪽으??동</p></div>' +
  '<div><span>Space</span><p>?프</p></div>' +
  '<div><span>E</span><p>줍기 / ?려?기</p></div>' +
  '</div></div>';
document.body.appendChild(controlsOverlay);
  '<div><span>Esc</span><p>?정 ?기 / ?기</p></div>' +
  '</div></div>';
document.body.appendChild(controlsOverlay);
ensureWorldSocialUi();
    tutorialExitButton,
function updateSettingsTutorialButtons() {
  updateSettingsTutorialButtonsUi({
    tutorialExitButton,
    tutorialReplayButton,
    currentUserId,
    hasSpawnedCharacter,
    onboardingDone: getStoredFlag(onboardingFlowDoneKey),
    onboardingFlowStep
  });
}
  updateSettingsTutorialButtons();
function openSettingsOverlay() {
  setSettingsOverlayOpen(settingsOverlay, true);
  updateSettingsTutorialButtons();
}
  setSettingsOverlayOpen(settingsOverlay, false);
function closeSettingsOverlayFromBackdrop() {
  onboardingStep26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
  updateSettingsTutorialButtons();
}
  setSettingsOverlayOpen(settingsOverlay, false);
function closeSettingsOverlayFromEscape() {
  const hadEscOpenCycle = onboardingStep26OpenedSettingsWithEsc;
  setSettingsOverlayOpen(settingsOverlay, false);
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
    return;
function skipTutorialFromSettings() {
  if (!window.confirm("?토리얼??건너?고 ?유? ?레?할까요?")) {
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
  movementTutorial.complete();
  setStoredFlag(hasGuideBookKey, true);
  setGuideBookPickedForCurrentRoom();
  setWorldBagGroundPickedForCurrentRoom();
  setWorldGuideBookOffGroundPickedForCurrentRoom();
  setStoredFlag(npcDialogueCompleteKey, true);
  setStoredFlag(guidePlantPageUnlockedKey, true);
  setStoredFlag(guideBookClickPromptDismissedKey, true);
  hasGuideBook = true;
  isNpcDialogueComplete = true;
  isGuidePlantPageUnlocked = true;
  isGuideBookOpen = false;
  isGuideBookClickPromptActive = false;
  setWorldGuideBookOffGroundPickedForCurrentRoom();
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
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
    skipTok = getEffectiveOvcSessionToken();
  } catch (eSkipTok) {}
  if (currentUserId && skipTok && window.OVCOnline && typeof window.OVCOnline.saveTutorialDone === "function") {
    Promise.resolve(window.OVCOnline.saveTutorialDone(currentUserId, skipTok, true))
      .catch(function () {})
      .finally(proceedSkipToWorld);
    return;
  }
  proceedSkipToWorld();
}
    !window.confirm(
function replayTutorialFromSettings() {
  if (
    !window.confirm(
      "?토리얼??처음부???시 진행?까?? ?토리얼 ?면?로 ?동?니??"
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
});
settingsButton.addEventListener("click", function () {
  openSettingsOverlay();
});
    closeSettingsOverlayFromBackdrop();
settingsOverlay.addEventListener("click", function (event) {
  if (event.target === settingsOverlay) {
    closeSettingsOverlayFromBackdrop();
  }
});
  setSettingsOverlayOpen(settingsOverlay, false);
controlsButton.addEventListener("click", function () {
  onboardingStep26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
  controlsOverlay.classList.add("is-open");
  controlsOverlay.setAttribute("aria-hidden", "false");
});
    controlsOverlay.classList.remove("is-open");
controlsOverlay.addEventListener("click", function (event) {
  if (event.target === controlsOverlay) {
    controlsOverlay.classList.remove("is-open");
    controlsOverlay.setAttribute("aria-hidden", "true");
  }
});
});
logoutButton.addEventListener("click", function () {
  openLogoutConfirm();
});
});
logoutConfirmCancel.addEventListener("click", function () {
  closeLogoutConfirm();
});
  logout();
logoutConfirmOk.addEventListener("click", function () {
  closeLogoutConfirm();
  logout();
});
    skipTutorialFromSettings();
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
    closeLogoutConfirm();
logoutConfirmOverlay.addEventListener("click", function (event) {
  if (event.target === logoutConfirmOverlay) {
    closeLogoutConfirm();
  }
});
});
changeColorButton.addEventListener("click", function () {
  openCharacterColorChange();
});
});
adminOpenButton.addEventListener("dblclick", function () {
  openAdminPanel();
});
  networkDebugDomStale = true;
networkDebugButton.addEventListener("dblclick", function () {
  networkDebugPanel.classList.toggle("is-visible");
  networkDebugDomStale = true;
  refreshNetworkDebugPanelDom();
});
    refreshNetworkDebugPanelDom();
document.addEventListener("selectionchange", function () {
  if (networkDebugDomStale) {
    refreshNetworkDebugPanelDom();
  }
});
});
adminCloseButton.addEventListener("click", function () {
  closeAdminPanel();
});
    closeAdminPanel();
adminOverlay.addEventListener("click", function (event) {
  if (event.target === adminOverlay) {
    closeAdminPanel();
  }
});
});
adminRefreshButton.addEventListener("click", function () {
  loadAdminAccounts();
});
}
function applyGuideTexts() {
  // Guide copy lives in index.html / tutorial.html so the sign and book keep the same wording.
}
  const bottom = GROUND_WORLD_HEIGHT - playerDepth + jumpY;
function getPlayerBox() {
  const top = GROUND_WORLD_HEIGHT - PLAYER_HEIGHT - playerDepth + jumpY;
  const bottom = GROUND_WORLD_HEIGHT - playerDepth + jumpY;
    top,
  return {
    left: playerX,
    top,
    right: playerX + PLAYER_WIDTH,
    bottom,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT
  };
}
  return getPlayerHeadFogProbeBoxForPose(playerX, playerDepth, jumpY);
/** ?개 막힘 ?정: 발보??머리(?쪽)가 ?개???을 ?까지 ?동 ?용 */
function getPlayerHeadFogProbeBox() {
  return getPlayerHeadFogProbeBoxForPose(playerX, playerDepth, jumpY);
}
  const feetInsetX = 3;
function getPlayerHeadFogProbeBoxForPose(px, pd, jy) {
  const footY = GROUND_WORLD_HEIGHT - pd + jy;
  const feetInsetX = 3;
  const feetH = 8;
  return {
    left: px + feetInsetX,
    top: footY - feetH,
    right: px + PLAYER_WIDTH - feetInsetX,
    bottom: footY,
    width: PLAYER_WIDTH - feetInsetX * 2,
    height: feetH
  };
}
  const feetInsetX = 5;
function getPlayerWorldRockCollisionBoxForPose(px, pd, jy) {
  const footY = GROUND_WORLD_HEIGHT - pd + jy;
  const feetInsetX = 5;
  const feetH = 7;
  return {
    left: px + feetInsetX,
    top: footY - feetH,
    right: px + PLAYER_WIDTH - feetInsetX,
    bottom: footY + 1,
    width: PLAYER_WIDTH - feetInsetX * 2,
    height: feetH + 1
  };
}
const ROCK_GROUND_SVG_H = 48;
/** rock-ground.svg(64×48) ??CSS `center bottom / contain` ??일?게 ?트박스 ?출 */
const ROCK_GROUND_SVG_W = 64;
const ROCK_GROUND_SVG_H = 48;
/** viewBox ?단 ??백 ?외 ?????어?잔?만(???y 18~44) */
const ROCK_GROUND_HIT_LEFT = 10;
const ROCK_GROUND_HIT_RIGHT = 54;
const ROCK_GROUND_HIT_TOP = 19;
const ROCK_GROUND_HIT_BOTTOM = 44;
  const renderW = Math.min(boxW, boxH * (ROCK_GROUND_SVG_W / ROCK_GROUND_SVG_H));
function getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH) {
  const boxBottom = boxTop + boxH;
  const renderW = Math.min(boxW, boxH * (ROCK_GROUND_SVG_W / ROCK_GROUND_SVG_H));
  const renderH = Math.min(boxH, boxW * (ROCK_GROUND_SVG_H / ROCK_GROUND_SVG_W));
  const imageLeft = boxLeft + (boxW - renderW) * 0.5;
  const imageTop = boxBottom - renderH;
  return {
    left: imageLeft + (ROCK_GROUND_HIT_LEFT / ROCK_GROUND_SVG_W) * renderW,
    top: imageTop + (ROCK_GROUND_HIT_TOP / ROCK_GROUND_SVG_H) * renderH,
    right: imageLeft + (ROCK_GROUND_HIT_RIGHT / ROCK_GROUND_SVG_W) * renderW,
    bottom: imageTop + (ROCK_GROUND_HIT_BOTTOM / ROCK_GROUND_SVG_H) * renderH
  };
}
  const size = Number(sz) || WORLD_ROCK_SIZE;
/** ry = ???소 ?선(?드). rockEl ?으??제 ?더 박스 기?(줌·CSS ?치) */
function getVisibleWorldRockCollisionRect(rx, ry, sz, rockEl) {
  const size = Number(sz) || WORLD_ROCK_SIZE;
  if (rockEl && ground && typeof rockEl.getBoundingClientRect === "function") {
    const gRect = ground.getBoundingClientRect();
    const rRect = rockEl.getBoundingClientRect();
    if (gRect.width > 0 && gRect.height > 0 && rRect.width > 0.5 && rRect.height > 0.5) {
      const wx = WORLD_WIDTH / gRect.width;
      const wy = GROUND_WORLD_HEIGHT / gRect.height;
      const boxLeft = (rRect.left - gRect.left) * wx;
      const boxTop = (rRect.top - gRect.top) * wy;
      const boxW = rRect.width * wx;
      const boxH = rRect.height * wy;
      return getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH);
    }
  }
  return getVisibleWorldRockCollisionRectFromBox(rx, ry, size, size);
}
  if (!Array.isArray(appleState.worldRocks)) return false;
function isPlayerCollidingVisibleWorldRockForPose(px, pd, jy) {
  if (!isWorldDocumentEntry()) return false;
  if (!Array.isArray(appleState.worldRocks)) return false;
  const pickedIds = Array.isArray(appleState.worldRockPickedIds)
    ? appleState.worldRockPickedIds
    : [];
  const playerFeet = getPlayerWorldRockCollisionBoxForPose(px, pd, jy);
  return appleState.worldRocks.some(function (rock) {
    if (!rock || pickedIds.includes(String(rock.id))) return false;
    const rx = Number(rock.x);
    const ry = Number(rock.y);
    const sz = Number(rock.size) || WORLD_ROCK_SIZE;
    if (!Number.isFinite(rx) || !Number.isFinite(ry)) return false;
    return isOverlappingRect(playerFeet, getVisibleWorldRockCollisionRect(rx, ry, sz, rock._el));
  });
}
    getPlayerHeadFogProbeBoxForPose(px, pd, jy),
function isPlayerHeadFogClearForPose(px, pd, jy, rect, eps) {
  return isPlayerBoxFullyInsidePlantFogClearRect(
    getPlayerHeadFogProbeBoxForPose(px, pd, jy),
    rect,
    eps
  );
}
    width: SEED_SIZE,
function getSeedSize() {
  return {
    width: SEED_SIZE,
    height: SEED_SIZE
  };
}
    width: BUCKET_SIZE,
function getBucketSize() {
  return {
    width: BUCKET_SIZE,
    height: BUCKET_SIZE
  };
}
    width: WELL_SIZE,
function getWellSize() {
  return {
    width: WELL_SIZE,
    height: WELL_SIZE
  };
}
}
function getCenterDistance(x, y, width, height) {
  return getCenterDistanceUtil(getPlayerBox(), x, y, width, height);
}

function getHandPosition(itemWidth, itemHeight) {
  const playerBox = getPlayerBox();
    y: playerBox.top + playerBox.height * 0.68 - itemHeight / 2
  return {
    x: playerBox.left + playerBox.width * 0.82 - itemWidth / 2,
    y: playerBox.top + playerBox.height * 0.68 - itemHeight / 2
  };
}

function isNearSeed() {
  const seedSize = getSeedSize();

  return getCenterDistance(seedX, seedY, seedSize.width, seedSize.height) < pickupDistance;
}
  return (
function canPickUpSeed() {
  updateSeedDryState();
  return (
    !hasPickedMainSeedInCurrentRoom() &&
    !plantRuntime.isSeedDry
  );
}
    window.clearTimeout(tutorialMainSeedRespawnTimerId);
function clearTutorialMainSeedRespawnTimer() {
  if (tutorialMainSeedRespawnTimerId !== null) {
    window.clearTimeout(tutorialMainSeedRespawnTimerId);
    tutorialMainSeedRespawnTimerId = null;
  }
}
  clearTutorialMainSeedRespawnTimer();
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
  return appleState.extraSeeds.some(function (s) {
function hasTutorialStarterSeedInPlay() {
  if (heldItem === HELD_ITEM_SEED) return true;
  return appleState.extraSeeds.some(function (s) {
    if (s.planted) return false;
    return s.id === "starter-seed" || s.isStarter;
  });
}
 */
/**
 * 메인 ?물 미심?데 '줍힘'??고 ?앗 추적???으????앗?????옴 ???래그·건??태 ?리
 */
function recoverWorldMainSeedIfOnboardingStuck() {
  if (plantRuntime.isSeedPlanted || plantRuntime.isPlanting) return;
  if (!hasPickedMainSeedInCurrentRoom()) return;
  if (hasTutorialStarterSeedInPlay()) return;
  // 마른 메인 ?앗 ?동 ?거(updateSeedPosition)가 picked?켜고 ???? ????.
  // ?기???래그? 지?면 ?앗???살?나 ??머가 ?원???나지 ?음.
  if (hasHandledDryMainSeed) return;
  clearMainSeedPickedForCurrentRoom();
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  plantRuntime.isSeedDry = false;
  hasHandledDryMainSeed = false;
  dryMainSeedVisibleSince = 0;
  setStoredFlag(mainDrySeedHandledKey, false);
}
  clearMainSeedPickedForCurrentRoom();
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
  if (hasPickedMainSeedInCurrentRoom()) return null;
/** Tutorial ?용: ??#seed ??extraSeeds ???? ?드 ?브?서???출?면 ????(groundSeed.js). */
function createStarterSeedInventoryItem() {
  if (hasPickedMainSeedInCurrentRoom()) return null;
    x: seedX,
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

function isMainBucketOnGroundForPickup() {
  if (!bucket || heldItem === HELD_ITEM_BUCKET) return false;
  const heldBy = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  if (heldBy && heldBy !== currentSessionId) return false;
  return true;
}
  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellUseDistance;
function getNearestGroundBucketPickInfo() {
  const bucketSize = getBucketSize();
  let best = null;
  let bestDist = Infinity;
  if (isMainBucketOnGroundForPickup()) {
    const mainDist = getCenterDistance(bucketX, bucketY, bucketSize.width, bucketSize.height);
    if (mainDist < bestDist) {
      bestDist = mainDist;
      best = { type: "main", distance: mainDist };
    }
  }
  const extras = Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : [];
  extras.forEach(function (entry) {
    if (!entry) return;
    const dist = getCenterDistance(entry.x, entry.y, bucketSize.width, bucketSize.height);
    if (dist < bestDist) {
      bestDist = dist;
      best = { type: "extra", id: String(entry.id), distance: dist };
    }
  });
  return best;
}
    wellUseDistance + 2
function isNearBucket() {
  const info = getNearestGroundBucketPickInfo();
  return Boolean(info && info.distance < pickupDistance);
}
  if (isNearWellForPouring()) return true;
function isNearWell() {
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellUseDistance;
}
    top: bucketY,
function isNearWellForPouring() {
  const wellSize = getWellSize();
  };
  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellPourDistance;
}
    wellPourDistance + 2
/** ?에 ???동??중심???물????가까운???레?어 발만?로??거리 밖으?????경우 */
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
    wellUseDistance + 2
  );
}
  };
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
    wellPourDistance + 2
  );
}
  }
/**
}
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
  } else if (tutorialSessionWorldGuideBookOffGroundPicked()) {
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
function clearOnboardingHighlights() {
function isNearWorldBagPickup() {
  if (isWorldDocumentEntry()) {
    if (hasPickedWorldBagGroundInCurrentRoom()) return false;
  } else if (readTutorialSessionFloorBagPicked()) {
    return false;
  }
  if (!worldBag) return false;
  const worldBagStyle = window.getComputedStyle(worldBag);
  if (worldBagStyle.display === "none" || worldBagStyle.visibility === "hidden") {
    return false;
  }
  return (
    getCenterDistance(worldBagX, worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT) < pickupDistance
  );
}
  });
function isNearGuideBook() {
  if (isWorldDocumentEntry()) {
    if (hasPickedWorldGuideBookOffGroundInCurrentRoom()) return false;
  } else if (tutorialSessionWorldGuideBookOffGroundPicked()) {
    return false;
  }
  if (!guideBook) return false;
  const st = window.getComputedStyle(guideBook);
  if (st.display === "none" || st.visibility === "hidden") return false;
  return (
    getCenterDistance(guideBookX, guideBookY, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT) < pickupDistance
  );
}
  }
function clearOnboardingHighlights() {
  [
    guideBook,
    guideBookButton,
    worldBag,
    worldBagInventory,
    guideCard,
    seed,
    plantMaster,
    player,
    well,
    bucket,
    bigTree,
    plantSpot
  ].forEach(function (el) {
    if (el) el.classList.remove("onboarding-highlight");
  });
  treeAppleElements.forEach(function (el) {
    el.classList.remove("onboarding-highlight");
  });
  if (guideBookButton) {
    guideBookButton.classList.remove("onboarding-highlight-book-inv");
  }
  if (worldBagInventory) {
    worldBagInventory.classList.remove("onboarding-highlight-book-inv");
  }
  if (bagInventoryPanel) {
    bagInventoryPanel.querySelectorAll(".bag-inventory-slot").forEach(function (el) {
      el.classList.remove("onboarding-highlight");
    });
  }
  Object.keys(butterflyRenderById).forEach(function (id) {
    const entry = butterflyRenderById[id];
    if (entry && entry.element) {
      entry.element.classList.remove("onboarding-highlight");
    }
  });
}
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
    .then(function (result) {
function persistOnboardingStep() {
  setStoredValue(onboardingFlowStepKey, String(onboardingFlowStep));
}
        } catch (eOk) {}
let lastAccountTutorialDoneRequestAt = 0;
    })
/** ?크????로컬?토리?가 비어???버??tutorial_done???으?index?보내??해 계정???기??*/
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
    token = getEffectiveOvcSessionToken();
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
function restoreWorldHubIfVeteranWithoutActiveReplay() {
/**
 * ?토리얼????번이?도 ?낸 계정? 로컬???료 ?태가 ?아???다(리로?·탭 종료·로그?웃/로그???에???드).
 * done ?래그만 ?실??경우 ????텝?로 복구?다.
 * - "0": ?상 ?료/건너?기 ????값
 * - 27(ONBOARDING_MAX_STEP): 축하 ?계 직후·7???머가 done???기 ?에 리로?된 경우
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
  clearWorldFloorBagClaim(removeStoredValue);
/**
 * ??번이?도 ?드????계정: ?튜?리???기???션???니??토리얼 미완??태? * 본게?으??돌린다(리로?·로그아??로그?·탭 ?환 ?에???드).
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
  clearMultiplayerReconnectTimeout();
function resetTutorialProgressInStorage() {
  clearTutorialMainSeedRespawnTimer();
  setOnboardingFlowDoneStored(false);
  setStoredValue(onboardingFlowStepKey, "1");
  removeStoredValue(movementTutorialCompleteKey);
  setStoredFlag(hasGuideBookKey, false);
  clearWorldFloorBagClaim(removeStoredValue);
  removeRoomKeyedPickupForAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
  removeRoomKeyedPickupForAllSlugs(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
  setStoredFlag(npcDialogueCompleteKey, false);
  setStoredFlag(guidePlantPageUnlockedKey, false);
  setStoredFlag(guideBookClickPromptDismissedKey, false);
  clearMainSeedPickedForCurrentRoom();
  tutorialWorldNeedsFullReset = true;
}
        ? window.OVCOnline.getClient()
function isSharedWorldSyncPausedForTutorial() {
  if (isWorldDocumentEntry()) return false;
  return !getStoredFlag(onboardingFlowDoneKey);
}
  });
/** index ?드 + ?보???료 + ?버 ?기?? 메인 ?롯???? ?으??고 ?기??extraPlants로만 추? */
function isSharedWorldMultiPlantMode() {
  if (!isWorldDocumentEntry()) return false;
  if (!getStoredFlag(onboardingFlowDoneKey)) return false;
  return isWorldServerSyncAvailable();
}
      pendingWorld = true;
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
  saveAppleState();
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
  clearTutorialSessionWorldFloorPickupFlags();
  loadGuideBookState(true);
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
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
  onboardingEscHintTimerId = window.setTimeout(function () {
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
    try {
function scheduleOnboardingGuideEscHintLine(expectedStep, applyFlag) {
  onboardingClearEscHintTimer();
  onboardingEscHintTimerId = window.setTimeout(function () {
    onboardingEscHintTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== expectedStep) return;
    applyFlag();
    updateOnboardingFlowUI();
  }, 2000);
}
      isReloadingForWorldReset = true;
function scheduleOnboardingNpcGuideEscHint() {
  scheduleOnboardingGuideEscHintLine(10, function () {
    onboardingNpcGuideEscHintShown = true;
  });
}
    } catch (eFinalTok) {}
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
      finalTok = getEffectiveOvcSessionToken();
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
  });
function isPlayerNearTutorialTreeArea() {
  const cx = BIG_TREE_X + BIG_TREE_WIDTH / 2;
  const cy = BIG_TREE_Y + BIG_TREE_HEIGHT / 2;
  const px = playerX + PLAYER_WIDTH / 2;
  const py = getPlayerFootY() - (player.offsetHeight || PLAYER_HEIGHT) / 2;
  return Math.hypot(px - cx, py - cy) < 100;
}
function isOnboardingLinearGateActive() {
function isNearAnyUnpickedAppleTutorial() {
  return appleState.apples.some(function (apple) {
    if (appleState.pickedIds.includes(apple.id)) return false;
    return (
      getCenterDistance(apple.x, apple.y, apple.size, apple.size) < 36
    );
  });
}
function flashOnboardingOrderHint(message) {
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
    onboardingFlowStep = 2;
function isOnboardingLinearGateActive() {
  return (
    isMainGameTutorialInProgress() &&
    hasSpawnedCharacter &&
    !isCharacterSelecting &&
    !isTabSessionSuperseded
  );
}
    onboardingFlowStep >= 5
function flashOnboardingOrderHint(message) {
  flashPlantProximityWarning(message || "\uC21C\uC11C\uB300\uB85C \uC9C4\uD589\uD574 \uC8FC\uC138\uC694.");
  updatePlayerStatus();
}
  if (
function onboardingAllowsBucketQUse() {
  // 13: ?물?서 긷기, 14~15: 메인 ?물??붓기, 16+: ?비·?정 ???후?도 ?반 물주?가??
  // ?전?는 13·15??용??14?서 붓기/16 ?후 Q가 무반?처??보이??문제가 ?었??
  return onboardingFlowStep >= 13;
}
    changed = true;
function onboardingAllowsGuideBookButtonToggle() {
  const s = onboardingFlowStep;
  return s === 2 || s === 3 || s === 10 || s >= 16;
}
    onboardingFlowStep < 10 &&
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
  if (onboardingFlowStep === 25) {
function loadOnboardingFlowState() {
  onboardingJumpLatch = false;
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
    onboardingFlowStep === 10 &&
    guideCard &&
    guideCard.style.display === "block" &&
    !onboardingNpcGuideEscHintShown
  ) {
    scheduleOnboardingNpcGuideEscHint();
  }
}
    persistOnboardingStep();
function onboardingNotifyMainPlantPlanted() {
  clearTutorialMainSeedRespawnTimer();
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (onboardingFlowStep === 7) {
    onboardingFlowStep = 8;
    persistOnboardingStep();
  }
}
    onboardingFlowStep = 15;
function onboardingAutoAdvanceSteps() {
  if (getStoredFlag(onboardingFlowDoneKey) || !hasSpawnedCharacter) return;
  if (onboardingFlowStep === 21 && isPlayerNearTutorialTreeArea()) {
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
    setOnboardingCalloutVisible(false, "");
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
    movementTutorial.hideOverlay();
    updateSettingsTutorialButtons();
    return;
  }
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep <= 0) {
    setOnboardingCalloutVisible(false, "");
    clearOnboardingHighlights();
    updateSettingsTutorialButtons();
    return;
  }
      break;
  onboardingAutoAdvanceSteps();
    case 2: {
  clearOnboardingHighlights();
      if (worldBagInventory) {
  const guideOpen = guideCard && guideCard.style.display === "block";
        worldBagInventory.classList.add("onboarding-highlight-book-inv");
  if (onboardingFlowStep === 10 && guideOpen && !onboardingEscHintTimerId && !onboardingNpcGuideEscHintShown) {
    scheduleOnboardingNpcGuideEscHint();
  }
    case 3: {
  switch (onboardingFlowStep) {
    case 1: {
      if (isNearWorldBagPickup() && !hasGuideBook) {
        movementTutorial.hideOverlay();
        setOnboardingCalloutVisible(true, "E?? ?러 가방을 ???세??");
        if (worldBag) worldBag.classList.add("onboarding-highlight");
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 2: {
      setOnboardingCalloutVisible(true, "\uC67C\uCABD \uC544\uB798 \uAC00\uBC29\uC744 \uB20C\uB7EC\uBCF4\uC138\uC694.");
      if (worldBagInventory) {
        worldBagInventory.classList.add("onboarding-highlight");
        worldBagInventory.classList.add("onboarding-highlight-book-inv");
      }
      break;
    }
    case 3: {
      if (guideOpen) {
        setOnboardingCalloutVisible(true, "?벤?리(??소)가 ?립?다.");
        if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 4: {
      setOnboardingCalloutVisible(
        true,
        "space바? ?르??프??니?? ?보?요!"
      );
      if (player) player.classList.add("onboarding-highlight");
      break;
    }
    case 5: {
      setOnboardingCalloutVisible(true, "?앗?로 ?동?세??");
      if (seed) seed.classList.add("onboarding-highlight");
      break;
    }
    case 6: {
      setOnboardingCalloutVisible(true, "e?? ?러 ?앗?????세??");
      if (seed) seed.classList.add("onboarding-highlight");
      break;
    }
    case 7: {
      setOnboardingCalloutVisible(
        true,
        "\uC2EC\uC744 \uC704\uCE58\uB85C \uC774\uB3D9\uD55C \uB4A4, \uAC00\uBC29\uC744 \uC5F4\uACE0 \uC528\uC557 \uCE78\uC744 \uB20C\uB7EC \uC2EC\uC73C\uC138\uC694."
      );
      if (player) player.classList.add("onboarding-highlight");
      if (!tutorialMainSeedRegenCompleted && bagInventoryPanel) {
        const bagSeedSlot = bagInventoryPanel.querySelector('[data-bag-type="seed"]');
        if (bagSeedSlot) bagSeedSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case 8: {
      setOnboardingCalloutVisible(true, "?물???인??찾아가?요.");
      if (plantMaster) plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case 9: {
      if (isNpcDialogueRunning) {
        setOnboardingCalloutVisible(false, "");
        if (plantMaster) plantMaster.classList.add("onboarding-highlight");
        break;
      }
      setOnboardingCalloutVisible(true, "q??러 ?물???인???하?요.");
      if (plantMaster) plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case 10: {
      if (guideOpen) {
        const line1 = "?명??참고?세??";
        const line2 = "esc ?는 ?무곳이???릭???명창을 ?으?요.";
        setOnboardingCalloutVisible(
          true,
          onboardingNpcGuideEscHintShown ? line2 + "\n\n" + line1 : line1
        );
        if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
        if (onboardingNpcGuideEscHintShown && guideCard) {
          guideCard.classList.add("onboarding-highlight");
        }
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 11: {
      setOnboardingCalloutVisible(true, "?물근처???동?로 ?동?세??");
      if (well) well.classList.add("onboarding-highlight");
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 12: {
      setOnboardingCalloutVisible(
        true,
        "?동??근처?가??E?? ?러 ?동?? ?어 주세??"
      );
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 13: {
      setOnboardingCalloutVisible(
        true,
        "?물??동????Q?? ?러 물을 길어 주세??"
      );
      if (well) well.classList.add("onboarding-highlight");
      if (bucket) bucket.classList.add("onboarding-highlight");
      break;
    }
    case 14: {
      setOnboardingCalloutVisible(true, "그???까 ?? ?앗?로 가?요.");
      if (plantSpot) plantSpot.classList.add("onboarding-highlight");
      break;
    }
    case 15: {
      setOnboardingCalloutVisible(true, "Q?? ?러 물을 뿌리?요.");
      if (plantSpot) plantSpot.classList.add("onboarding-highlight");
      break;
    }
    case 16: {
      setOnboardingCalloutVisible(
        true,
        onboardingPostWaterCongratsPhase === 0
          ? "축하?니?? ?물 ?우??법을 배우?습?다."
          : "?직 ?았?니???까지 진행?주?요."
      );
      break;
    }
    case 17: {
      setOnboardingCalloutVisible(true, "E?? ?러 ?동?? ?려?으?요.");
      if (bucket) bucket.classList.add("onboarding-highlight");
      if (player) player.classList.add("onboarding-highlight");
      break;
    }
    case 18: {
      setOnboardingCalloutVisible(
        true,
        "?아?니???비??근접?여 e,q??으?요"
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
      setOnboardingCalloutVisible(true, "?크롤해 맵을 축소,?? ?보?요.");
      break;
    }
    case 20: {
      setOnboardingCalloutVisible(true, "가???게 축소 ?보?요.");
      break;
    }
    case 21: {
      setOnboardingCalloutVisible(true, "?중?????무??동?세??");
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      break;
    }
    case 22: {
      setOnboardingCalloutVisible(
        true,
        "?무??동?여 ?라???매??근처??동?세??"
      );
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case 23: {
      setOnboardingCalloutVisible(true, "e?? ?러 ?매??세??");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case 24: {
      setOnboardingCalloutVisible(true, "가방을 ?????과 칸을 ?러 먹으?요.");
      if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
      if (bagInventoryPanel) {
        const bagAppleSlot = bagInventoryPanel.querySelector('[data-bag-type="apple"]');
        if (bagAppleSlot) bagAppleSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case 25: {
      const lineSeed = "?앗???겼?니 ?하??곳에 ?릭???용?세??";
      const lineB = "?무밖으??동?세??";
      if (onboardingPostAppleSeedIntroPhase === 0) {
        setOnboardingCalloutVisible(true, "?앗???었?니??");
      } else {
        setOnboardingCalloutVisible(
          true,
          onboardingSeedTutorialSecondLine ? lineSeed + "\n\n" + lineB : lineSeed
        );
      }
      if (bagInventoryPanel) {
        const bagSeedSlot = bagInventoryPanel.querySelector('[data-bag-type="seed"]');
        if (bagSeedSlot) bagSeedSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case 26: {
      setOnboardingCalloutVisible(
        true,
        "Esc??러 ?정?????? ?시 Esc??아 보세??"
      );
      break;
    }
    case 27: {
      setOnboardingCalloutVisible(true, "축하?니?? ?토리얼???났?니??!");
      break;
    }
    default:
      setOnboardingCalloutVisible(false, "");
  }
  updateSettingsTutorialButtons();
}
    window.clearTimeout(onboardingCongratsTimerId);
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
      updateOnboardingFlowUI();
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
  if (!isNearGuideBook()) return false;
function onboardingHookFilledBucketAtWell() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 13) return;
  onboardingFlowStep = 14;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}
  }
function onboardingHookDroppedBucketForTutorial() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== 17) return;
  onboardingFlowStep = 18;
  onboardingButterflyCountBaseline = getTotalCaughtButterflies();
  persistOnboardingStep();
  updateOnboardingFlowUI();
}
function pickUpWorldBag() {
function pickUpWorldGuideBookNoHold() {
  if (isOnboardingLinearGateActive()) {
    return false;
  }
  if (!isNearGuideBook()) return false;
  hasGuideBook = true;
  isGuideBookOpen = false;
  setGuideBookPickedForCurrentRoom();
  setWorldGuideBookOffGroundPickedForCurrentRoom();
  if (isTutorialDocumentEntry()) {
    setTutorialSessionWorldGuideBookOffGroundPicked();
  }
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  updateGuideCard();
  updateBagInventorySlots();
  return true;
}
  syncGuideInventoryBar();
function pickUpWorldBag() {
  if (isOnboardingLinearGateActive()) {
    if (hasGuideBook) return false;
    if (onboardingFlowStep !== 1 && onboardingFlowStep !== 2) return false;
  }
  if (!isNearWorldBagPickup()) return false;
  }
  if (worldSocialUiReady && worldChatPanelOpen) {
    setWorldChatPanelOpen(false);
  }
/** 구: 월드 책 E줍기 — 가이드 소지 없이 바닥에서만 제거. */
  hasGuideBook = true;
  isGuideBookOpen = false;
  setGuideBookPickedForCurrentRoom();
  setWorldBagGroundPickedForCurrentRoom();
  if (isTutorialDocumentEntry()) {
    writeTutorialSessionFloorBagPicked();
  }
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  updateGuideCard();
  updateBagInventorySlots();
  movementTutorial.complete();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 1) {
    onboardingFlowStep = 2;
    persistOnboardingStep();
  }
  return true;
}
        return roomKeyedPickupFlagTrueAnySlug(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
/** ? ?드 ?E줍기 ??가?드 ?? ?이 바닥?서??거. */
function pickUpGuideBook() {
  return pickUpWorldGuideBookNoHold();
}
  hasGuideBook = hasPickedGuideBookInCurrentRoom();
function loadGuideBookState(skipMaybeResetTutorial) {
  if (currentUserId && !skipMaybeResetTutorial) {
    maybeResetTutorialForNewLoginSession();
  }
  if (isWorldDocumentEntry()) {
    const uid = currentUserId ? String(currentUserId).trim() : "";
    hydrateWorldFloorBagClaimFromLegacy(getStoredFlag, setStoredFlag, {
      guideBookClaimed: function () {
        return (
          getStoredFlag(hasGuideBookKey) ||
          roomKeyedPickupFlagTrueAnySlug(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX)
        );
      },
      anyRoomKeyedWorldBag: function () {
        return roomKeyedPickupFlagTrueAnySlug(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
      },
      storageUserPrefix: uid ? "ovc-user-" + uid + ":" : ""
    });
  }
  hasGuideBook = hasPickedGuideBookInCurrentRoom();
  if (hasGuideBook) {
    setStoredFlag(movementTutorialCompleteKey, true);
    movementTutorial.resetMotionState();
    if (isWorldDocumentEntry() && !hasPickedWorldBagGroundInCurrentRoom()) {
      setWorldBagGroundPickedForCurrentRoom();
    }
  }
  isNpcDialogueComplete = getStoredFlag(npcDialogueCompleteKey);
  hydrateTradeMasterDialogueComplete(getStoredFlag(tradeMasterDialogueCompleteKey));
  isGuidePlantPageUnlocked = getStoredFlag(guidePlantPageUnlockedKey);
  const promptDismissed = getStoredFlag(guideBookClickPromptDismissedKey);
  isGuideBookClickPromptActive =
    hasGuideBook && isGuidePlantPageUnlocked && !promptDismissed;
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  updateGuidePages();
  updateGuideCard();
  updateBagInventorySlots();
  updateNpcPosition();
  loadOnboardingFlowState();
}
  savePlayerPosition(true);
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
  persistOvcLastAppliedWorldResetToken(lastAppliedWorldResetToken);
  applyDefaultState({ sharedWorldResetOnly: true });
  persistDefaultStateAfterReset();
  restartPlayerPositionOnly();
  saveSharedWorldAndReload({ reloadUrl: ovcWorldIndexUrl() });
}
  resetInputKeys(keys);
function persistDefaultStateAfterReset() {
  savePlayerPosition(true);
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
}
  plantingInventorySeedId = null;
function saveGameSnapshot() {
  if (isReloadingForWorldReset) return;
  savePlayerPosition(true);
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
  syncWorldState(true);
}
    isOnGround = true;
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
  if (sharedWorldResetOnly) {
function settlePlayerBeforeBackground() {
  const groundMaxDepth = getMaxGroundedPlayerDepth();
  if (playerDepth > groundMaxDepth && !isPlayerSupportedByTree()) {
    playerDepth = groundMaxDepth;
    jumpY = 0;
    velocityY = 0;
    isOnGround = true;
    isTreeFalling = false;
    wasPlayerInTree = false;
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
  }
}
  npcY = NPC_START_Y;
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
  plantRuntime.isSeedDry = false;
  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  wasPlayerInTree = false;
  npcX = NPC_START_X;
  npcY = NPC_START_Y;
    removeRoomKeyedPickupForAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
  seedX = SEED_START_X;
  seedY = SEED_START_Y;
  signX = SIGN_START_X;
  signY = SIGN_START_Y;
  guideBookX = GUIDE_BOOK_START_X;
  guideBookY = GUIDE_BOOK_START_Y;
  worldBagX = WORLD_BAG_START_X;
  worldBagY = WORLD_BAG_START_Y;
  plantRuntime.seedCreatedAt = Date.now();
  setStoredValue(seedCreatedAtKey, String(plantRuntime.seedCreatedAt));
  plantRuntime.isSeedDry = false;
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  clearMainSeedPickedForCurrentRoom();
  if (sharedWorldResetOnly) {
    removeRoomKeyedPickupForAllSlugs(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
    removeRoomKeyedPickupForAllSlugs(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX);
  }
  if (!sharedWorldResetOnly || isWorldDocumentEntry()) {
    removeRoomKeyedPickupForAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
  }
  setStoredFlag(mainSeedCollectedKey, false);
  if (!sharedWorldResetOnly || isWorldDocumentEntry()) {
    setStoredFlag(hasGuideBookKey, false);
  }
  plantRuntime.isSeedPlanted = false;
  plantRuntime.isPlanting = false;
  heldItem = null;
  plantingInventorySeedId = null;
  plantRuntime.powderUpgradeTargetTier = 0;
  plantRuntime.spotX = 0;
  plantRuntime.spotY = 0;
  plantRuntime.lastWateredAt = null;
  plantRuntime.wateredAtList = [];
  plantRuntime.status = "normal";
  plantRuntime.waterLevel = 1;
  plantRuntime.waterLevelUpdatedAt = getSharedPlantSimulationNow();
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
    setStoredFlag(mainDrySeedHandledKey, false);
  if (!sharedWorldResetOnly) {
    hasGuideBook = false;
    isGuideBookOpen = false;
    isGuideBookClickPromptActive = false;
    movementTutorial.resetMotionState();
    onboardingFlowStep = 1;
    onboardingJumpLatch = false;
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
    hasGuideBook = false;
    onboardingClearAllOnboardingTimers();
    isGuideDismissedAtSign = false;
    hasHandledDryMainSeed = false;
    dryMainSeedVisibleSince = 0;
    setStoredFlag(mainDrySeedHandledKey, false);
    isNpcDialogueRunning = false;
    isGuideBookOpen = false;
    isGuideBookClickPromptActive = false;
    movementTutorial.resetMotionState();
    guidePageIndex = 0;
  }
  isTreeFalling = false;
  wasPlayerInTree = false;
  appleState.count = 0;
  appleState.seedCount = 0;
  appleState.overgrowthSeedCount = 0;
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
  appleState.worldRocks = createRandomWorldRocks(buildWorldRockSpawnContext());
  appleState.worldRockPickedIds = [];
  appleState.worldExtraBuckets = [];
  worldLooseSeedElement = null;
  localApplePickedAtById = {};
  isBucketFull = false;
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
  Object.keys(butterflyLocalCatchTombstoneById).forEach(function (id) {
    delete butterflyLocalCatchTombstoneById[id];
  });
  saveButterflyCaughtCounts();
  saveMagicPowderCount();
  updateBagInventorySlots();
  updateMagicPowderInventoryUi();
  syncGuideInventoryBar();
  wellState.water = maxWellWater;
  wellState.lastRefillAt = Date.now();
  isBucketFull = false;
  bucketX = wellX - BUCKET_SIZE - 8;
  bucketY = wellY + WELL_SIZE - BUCKET_SIZE;
  if (playerAlertHideTimerId) {
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
  guideCard.style.display = "none";
  if (guideBook) guideBook.classList.remove("is-near");
  if (worldBag) worldBag.classList.remove("is-near");
  setBagInventoryPanelOpen(false);
  syncGuideInventoryBar();
  syncWorldBagGroundVisibility();
  hasShownFirstSeedFocus = false;
  window.clearTimeout(firstSeedFocusTimeout);
  if (worldBagInventory) worldBagInventory.classList.remove("is-first-seed-focus");
  npcBubble.style.display = "none";
  if (playerAlertHideTimerId) {
    window.clearTimeout(playerAlertHideTimerId);
    playerAlertHideTimerId = null;
  }
  playerAlert.style.display = "none";
  playerAlert.classList.remove("is-butterfly-catch");

  updateWellImage();
  updateWellCard();
  updateSeedPosition();
  updateBucketPosition();
  setWorldPosition(signBoard, signX, signY);
  setWorldPosition(guideBook, guideBookX, guideBookY);
  if (worldBag) setWorldPosition(worldBag, worldBagX, worldBagY);
  if (sharedWorldResetOnly) {
    loadGuideBookState(true);
  } else {
    updateNpcPosition();
    updateGuidePages();
  }
  updateApples();
  updateExtraSeedsAndPlants();
  rebuildWorldRockDom();
}

function isNearPlantSpot() {
  if (!plantRuntime.isSeedPlanted) return false;
  if (!isNpcDialogueComplete) {
  return isNearPlantSpotWithin(pickupDistance);
}
  /** 온보딩 중에는 대화 반복을 위해 항상 표시 */
function isNearPlantSpotForWatering() {
  return getNearestWateringTarget() !== null;
}
  /** 본편: 첫 대화 후에도 메인 작물 심기 전에는 찾을 수 있게 */
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
  return getCenterDistance(npcX, npcY, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
function isPlantMasterVisible() {
  if (isNpcDialogueRunning) return true;
  if (!isNpcDialogueComplete) {
    return true;
  }
  /** ?보??중에?????반복???해 ?? ?시 */
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    return true;
  }
  /** 본편: ?????에??메인 ?물 ?기 ?에??찾을 ???게 */
  if (!plantRuntime.isSeedPlanted) {
    return true;
  }
  /** 마른 ?에?도 ?인???라졌다 ???다 ?? ?게(?냅?·UI ?치) */
  return plantRuntime.status !== "rotten";
}
  const isFirstTalk = !isNpcDialogueComplete;
function isNearPlantMaster() {
  if (!isPlantMasterVisible()) return false;
        { speaker: "npc", text: "\uC790\uB124....", delayAfterMs: 1000 },
  return getCenterDistance(npcX, npcY, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
}
        { speaker: "player", text: "\uC798 \uBAA8\uB974\uACA0\uC2B5\uB2C8\uB2E4...", delayAfterMs: 2500 },
function tryTalkToPlantMaster() {
  if (!isNearPlantMaster() || isNpcDialogueRunning) {
    return false;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 9) {
    flashOnboardingOrderHint("");
    return false;
  }
          text: "\uAD81\uAE08\uD55C\uAC8C \uC788\uB098? \uC544\uC9C1 \uB54C\uAC00 \uC544\uB2D0\uC138..",
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
      isGuidePlantPageUnlocked = true;
  isNpcDialogueRunning = true;
  npcBubble.style.display = "none";
  playerBubble.style.display = "none";
  window.clearTimeout(npcPromptHideTimeout);
      syncWorldBagGroundVisibility();
  let timelineMs = 0;
  lines.forEach(function (lineInfo) {
    window.setTimeout(function () {
      showDialogueLine(lineInfo);
    }, timelineMs);
    timelineMs += Math.max(0, Number(lineInfo.delayAfterMs) || 650);
  });
      isGuideBookOpen = true;
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
      setWorldBagGroundPickedForCurrentRoom();
      setWorldGuideBookOffGroundPickedForCurrentRoom();
      syncWorldBagGroundVisibility();
      syncGuideInventoryBar();
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
      movementTutorial.complete();
    }
    updateNpcPosition();
    updateGuideCard();
    updateOnboardingFlowUI();
  }, timelineMs + 250);
}
  if (playerAlertHideTimerId) {
function showDialogueLine(lineInfo) {
  npcBubble.style.display = lineInfo.speaker === "npc" ? "block" : "none";
  playerBubble.style.display = lineInfo.speaker === "player" ? "block" : "none";
  playerAlert.textContent = message;
  if (lineInfo.speaker === "npc") {
    npcBubble.textContent = lineInfo.text;
    updateNpcPosition();
    return;
  }
    playerAlert.style.display = "none";
  playerBubble.textContent = lineInfo.text;
  updatePlayerBubblePosition();
}

function showPlayerAlert(options) {
  if (!playerAlert) return;
  const opts = options || {};
  const message = opts.message != null ? String(opts.message) : "!";
  const durationMs = Number.isFinite(Number(opts.durationMs)) ? Number(opts.durationMs) : 1800;
  const butterflyCatch = Boolean(opts.butterflyCatch);
  if (playerAlertHideTimerId) {
    window.clearTimeout(playerAlertHideTimerId);
    playerAlertHideTimerId = null;
  }
  playerAlert.textContent = message;
  playerAlert.classList.toggle("is-butterfly-catch", butterflyCatch);
  playerAlert.style.display = "block";
  updatePlayerAlert();
  playerAlertHideTimerId = window.setTimeout(function () {
    playerAlertHideTimerId = null;
    playerAlert.style.display = "none";
    playerAlert.classList.remove("is-butterfly-catch");
  }, durationMs);
}
  markWorldDirty();
function toggleSeed() {
  if (plantRuntime.isPlanting || heldItem) return;
  pickUpNearestItem();
}
      onboardingFlowStep = 13;
function tryPickSharedBucket(bucketDistance) {
  const bucketSize = getBucketSize();
  const pickInfo = getNearestGroundBucketPickInfo();
  const dist = pickInfo ? pickInfo.distance : bucketDistance;
  if (dist > pickupDistance || !canPickUpSharedBucket()) {
    return false;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== 12) {
    flashOnboardingOrderHint("");
    return true;
  }
  if (pickInfo && pickInfo.type === "extra" && Array.isArray(appleState.worldExtraBuckets)) {
    const extraIndex = appleState.worldExtraBuckets.findIndex(function (entry) {
      return entry && String(entry.id) === String(pickInfo.id);
    });
    if (extraIndex >= 0) {
      const extra = appleState.worldExtraBuckets[extraIndex];
      isBucketFull = Boolean(extra.isFull);
      appleState.worldExtraBuckets.splice(extraIndex, 1);
      if (extra._el) {
        extra._el.remove();
        extra._el = null;
      }
    }
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
  if (
/**
 * World hub: worldLooseSeed(?성 ?보) + extraSeeds + ????+ ?동??
 */
function pickUpNearestItemWorldHub(bucketDistance) {
  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;
  const nearestRock = getNearestPickableWorldRock();
  const rockDist = nearestRock ? nearestRock.distance : Infinity;
      appleState.seedCount += 1;
  if (
    nearestRock &&
    rockDist < extraDist &&
    rockDist <= pickupDistance &&
    rockDist <= bucketDistance
  ) {
    if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      return;
    }
    if (!appleState.worldRockPickedIds.includes(nearestRock.rock.id)) {
      appleState.worldRockPickedIds.push(nearestRock.rock.id);
    }
    lastLocalWorldRockPickupAt = Date.now();
    flashPlantProximityWarning("\uB3CC \uC218\uC9D1");
    plantProximityWarnUntil = lastLocalWorldRockPickupAt + WORLD_ROCK_PICKUP_ACTION_MS;
    saveAppleState();
    holdLocalAppleStateAgainstStaleSnapshot(1200);
    updateWorldRocks();
    updateBagInventorySlots();
    markWorldDirty();
    broadcastWorldRockPickup(nearestRock.rock.id);
    syncWorldState(true);
    sendMultiplayerPresence(true);
    return;
  }
    triggerFirstSeedFocus();
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
      flashOnboardingOrderHint("");
/**
 * Tutorial / ?보???index: ??#seed(?토 메인) ?????? ???extraSeeds, ?동??
 */
function pickUpNearestItemTutorialFlow(seedSize, bucketDistance) {
  const tutorialMainDist = canPickUpSeed()
    ? getCenterDistance(seedX, seedY, seedSize.width, seedSize.height)
    : Infinity;
  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;
  const nearestRock = getNearestPickableWorldRock();
  const rockDist = nearestRock ? nearestRock.distance : Infinity;
    updateBagInventorySlots();
  if (
    tutorialMainDist <= pickupDistance &&
    tutorialMainDist <= bucketDistance &&
    tutorialMainDist <= extraDist &&
    tutorialMainDist <= rockDist
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
    updateExtraSeedsAndPlants();
  if (
    nearestRock &&
    rockDist < extraDist &&
    rockDist <= pickupDistance &&
    rockDist <= bucketDistance
  ) {
    if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
      flashOnboardingOrderHint("");
      return;
    }
    if (!appleState.worldRockPickedIds.includes(nearestRock.rock.id)) {
      appleState.worldRockPickedIds.push(nearestRock.rock.id);
    }
    lastLocalWorldRockPickupAt = Date.now();
    flashPlantProximityWarning("\uB3CC \uC218\uC9D1");
    plantProximityWarnUntil = lastLocalWorldRockPickupAt + WORLD_ROCK_PICKUP_ACTION_MS;
    saveAppleState();
    holdLocalAppleStateAgainstStaleSnapshot(1200);
    updateWorldRocks();
    updateBagInventorySlots();
    broadcastWorldRockPickup(nearestRock.rock.id);
    markWorldDirty();
    syncWorldState(true);
    sendMultiplayerPresence(true);
    return;
  }
  firstSeedFocusTimeout = window.setTimeout(function () {
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
  if (!holderIsActive) {
  tryPickSharedBucket(bucketDistance);
}
    markWorldDirty();
function pickUpNearestItem() {
  const seedSize = getSeedSize();
  const bucketPick = getNearestGroundBucketPickInfo();
  const bucketDistance = bucketPick ? bucketPick.distance : Infinity;
  addBucketTrace("pickup", "blocked by active holder=" + heldBy, 500);
  if (usesWorldLooseSeedMode()) {
    pickUpNearestItemWorldHub(bucketDistance);
  } else {
    pickUpNearestItemTutorialFlow(seedSize, bucketDistance);
  }
}
  const now = Date.now();
function triggerFirstSeedFocus() {
  if (hasShownFirstSeedFocus) return;
    usesWorldLooseSeedMode() &&
  hasShownFirstSeedFocus = true;
  if (worldBagInventory) worldBagInventory.classList.add("is-first-seed-focus");
  window.clearTimeout(firstSeedFocusTimeout);
  firstSeedFocusTimeout = window.setTimeout(function () {
    if (worldBagInventory) worldBagInventory.classList.remove("is-first-seed-focus");
  }, 6500);
}
      seed: {
function canPickUpSharedBucket() {
  const heldBy = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  if (!heldBy || heldBy === currentSessionId) return true;
        worldLoosePick: true
  const holder = remotePlayers[heldBy];
  const holderIsActive =
    holder &&
    Number.isFinite(holder.lastSeenAt) &&
    Date.now() - holder.lastSeenAt < 5000;
  appleState.extraSeeds.forEach(function (extraSeed) {
  if (!holderIsActive) {
    // Recover from stale holder ownership that blocks pickup forever.
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    markWorldDirty();
    addBucketTrace("pickup", "recovered stale holder=" + heldBy, 0);
    return true;
  }
      nearest = {
  addBucketTrace("pickup", "blocked by active holder=" + heldBy, 500);
  return false;
}
    }
/** Tutorial: extraSeeds? World hub: 보이???안 ?성 worldLoose ?보가 ?선(같? 좌표 ?책? groundSeed.js). */
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
}
  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || isExtraSeedDry(extraSeed)) return;
    if (usesWorldLooseSeedMode() && !extraSeed.inInventory) {
      return;
    }
  });
    const distance = getCenterDistance(extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE);
    if (!nearest || distance < nearest.distance) {
      nearest = {
        seed: extraSeed,
        distance
      };
    }
  });
    const el = document.createElement("div");
  return nearest;
}
    el.setAttribute("aria-hidden", "true");
function getNearestPickableWorldRock() {
  if (!isWorldDocumentEntry()) return null;
  if (!isWorldRockPickupUnlocked()) return null;
  if (!Array.isArray(appleState.worldRocks) || !Array.isArray(appleState.worldRockPickedIds)) {
    return null;
  }
  let nearest = null;
  let bestDist = Infinity;
  appleState.worldRocks.forEach(function (rock) {
    if (appleState.worldRockPickedIds.includes(rock.id)) return;
    const sz = Number(rock.size) || WORLD_ROCK_SIZE;
    const distance = getCenterDistance(rock.x, rock.y, sz, sz);
    if (distance < bestDist) {
      bestDist = distance;
      nearest = { rock, distance };
    }
  });
  return nearest;
}
      setWorldPosition(rock._el, rock.x, rock.y);
function rebuildWorldRockDom() {
  if (!ground) return;
  ground.querySelectorAll(".world-ground-rock").forEach(function (node) {
    node.remove();
  });
  if (!isWorldDocumentEntry() || !Array.isArray(appleState.worldRocks)) return;
  const insertBeforeEl =
    localPlayerRoot && localPlayerRoot.parentNode === ground
      ? localPlayerRoot
      : player && player.parentNode === ground
        ? player
        : null;
  appleState.worldRocks.forEach(function (rock) {
    const el = document.createElement("div");
    el.className = "world-ground-rock";
    el.dataset.rockId = rock.id;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      ground.insertBefore(el, insertBeforeEl);
    } else {
      ground.appendChild(el);
    }
    rock._el = el;
  });
  updateWorldRocks();
}
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 23) {
function updateWorldRocks() {
  if (!isWorldDocumentEntry() || !Array.isArray(appleState.worldRocks)) return;
  appleState.worldRocks.forEach(function (rock) {
    if (!rock._el) return;
    const picked = appleState.worldRockPickedIds.includes(rock.id);
    rock._el.style.display = picked ? "none" : "block";
    if (!picked) {
      const sz = Number(rock.size) || WORLD_ROCK_SIZE;
      setWorldSize(rock._el, sz, sz);
      setWorldPosition(rock._el, rock.x, rock.y);
    }
  });
}
  };
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
      return candidate.id === appleElement.dataset.appleId;
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
  window.setTimeout(function () {
function updateApples() {
  respawnApplesIfNeeded();
  treeAppleElements.forEach(function (appleElement) {
    const apple = appleState.apples.find(function (candidate) {
      return candidate.id === appleElement.dataset.appleId;
    });
      onboardingSeedTutorialSecondLine = false;
    if (apple) {
      appleElement.style.left = apple.localX + "px";
      appleElement.style.top = apple.localY + "px";
    }
      }
    appleElement.style.display = !apple || appleState.pickedIds.includes(appleElement.dataset.appleId)
      ? "none"
      : "block";
  });
        updateOnboardingFlowUI();
  syncGuideInventoryBar();
  updateBagInventorySlots();
  updateWorldRocks();
}
      onboardingTreeLeaveHintTimerId = window.setTimeout(function () {
function eatApple() {
  if (appleState.count <= 0 || appleState.isEating || plantRuntime.isPlanting || isNpcDialogueRunning) return;
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 24) {
    flashOnboardingOrderHint("");
    return;
  }
    }
  appleState.count -= 1;
  appleState.isEating = true;
  playerStatus.textContent = "\uC0AC\uACFC\uBA39\uB294\uC911...";
  saveAppleState();
  updateApples();
  sendMultiplayerPresence(true);
    updateExtraSeedsAndPlants();
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
  while (isAppleInTrunkArea(localX, localY, size) && attempts < 16) {
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
  };
  appleState.extraSeeds.push(newSeed);

  updateExtraSeedsAndPlants();
  updateSeedInventory();
  saveAppleState();
}
  return {
function getNextSeedNumber() {
  return appleState.extraSeeds.length + 1;
}
    bottom: top + h + pad
function createRandomApples(count) {
  return Array.from({ length: count }, function (_, index) {
    return createRandomApple("apple-" + (index + 1));
  });
}
}
function createRandomApple(id) {
  const size = 10;
  let localX = 18 + Math.floor(Math.random() * 104);
  let localY = 16 + Math.floor(Math.random() * 76);
  let attempts = 0;
    }
  while (isAppleInTrunkArea(localX, localY, size) && attempts < 16) {
    localX = 18 + Math.floor(Math.random() * 104);
    localY = 16 + Math.floor(Math.random() * 76);
    attempts += 1;
  }
  const px = Number(plant && (plant.x != null ? plant.x : plant.spotX));
  return {
    id,
    localX,
    localY,
    x: BIG_TREE_X + localX,
    y: BIG_TREE_Y + localY,
    size
  };
}
    right: centerX + radius,
/** ?과 ?드 UI(?물·NPC·?탈 ?? ?이 최소 ?백 */
const WORLD_ROCK_UI_CLEAR_PAD = 10;
}
function expandWorldRockAvoidRect(left, top, w, h, pad) {
  return {
    left: left - pad,
    top: top - pad,
    right: left + w + pad,
    bottom: top + h + pad
  };
}
    expandWorldRockAvoidRect(spawnPortalX, spawnPortalY, spawnPortalWidth, spawnPortalHeight, p)
function worldRockRect(x, y, size) {
  return { left: x, top: y, right: x + size, bottom: y + size };
}
  zones.push(expandWorldRockAvoidRect(worldBagX, worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT, p));
function worldRockOverlapsAnyAvoidRect(rockRect, zones) {
  for (let i = 0; i < zones.length; i += 1) {
    if (isOverlappingRect(rockRect, zones[i])) {
      return true;
    }
  }
  return false;
}
      p
function addPlantWorldRockAvoidZone(zones, plant, pad) {
  const px = Number(plant && (plant.x != null ? plant.x : plant.spotX));
  const py = Number(plant && (plant.y != null ? plant.y : plant.spotY));
  const maturity = getPlantMaturityLevelForPlantingSpacing(plant);
  if (!Number.isFinite(px) || !Number.isFinite(py) || maturity == null) return;
  const centerX = px + PLANT_SPOT_WIDTH / 2;
  const centerY = py + PLANT_SPOT_HEIGHT / 2;
  const radius = getMinPlantCenterClearanceWorld(maturity) + WORLD_ROCK_SIZE / 2 + pad;
  zones.push({
    left: centerX - radius,
    top: centerY - radius,
    right: centerX + radius,
    bottom: centerY + radius
  });
}
  const by =
function collectWorldRockAvoidZones(ctx) {
  const p = WORLD_ROCK_UI_CLEAR_PAD;
  const zones = [];
  const wx = Number.isFinite(wellX) && wellX > 0 ? wellX : WELL_START_X;
  const wy = Number.isFinite(wellY) && wellY > 0 ? wellY : WELL_START_Y;
  zones.push(expandWorldRockAvoidRect(wx, wy, WELL_SIZE, WELL_SIZE, p));
  zones.push(
    expandWorldRockAvoidRect(spawnPortalX, spawnPortalY, spawnPortalWidth, spawnPortalHeight, p)
  );
  zones.push(expandWorldRockAvoidRect(signX, signY, SIGN_WIDTH, SIGN_HEIGHT, p));
  zones.push(expandWorldRockAvoidRect(guideBookX, guideBookY, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT, p));
  zones.push(expandWorldRockAvoidRect(worldBagX, worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT, p));
  zones.push(expandWorldRockAvoidRect(npcX, npcY, NPC_WIDTH, NPC_HEIGHT, p));
  zones.push(expandWorldRockAvoidRect(NPC_START_X, NPC_START_Y, NPC_WIDTH, NPC_HEIGHT, p));
  zones.push(
    expandWorldRockAvoidRect(
      TRADE_MASTER_START_X,
      TRADE_MASTER_START_Y,
      NPC_WIDTH,
      NPC_HEIGHT,
      p
    )
  );
  zones.push(
    expandWorldRockAvoidRect(
      ALCHEMY_MASTER_START_X,
      ALCHEMY_MASTER_START_Y,
      NPC_WIDTH,
      NPC_HEIGHT,
      p
    )
  );
  zones.push(expandWorldRockAvoidRect(seedX, seedY, SEED_SIZE, SEED_SIZE, p));
  const bucketSz = getBucketSize();
  const bx =
    Number.isFinite(bucketX) && bucketX > 0 ? bucketX : WELL_START_X - bucketSz.width - 8;
  const by =
    Number.isFinite(bucketY) && bucketY > 0 ? bucketY : WELL_START_Y + WELL_SIZE - bucketSz.height;
  zones.push(expandWorldRockAvoidRect(bx, by, bucketSz.width, bucketSz.height, p));
  (Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : []).forEach(
    function (extraBucket) {
      if (!extraBucket) return;
      zones.push(
        expandWorldRockAvoidRect(extraBucket.x, extraBucket.y, bucketSz.width, bucketSz.height, p)
      );
    }
  );
    const ly = Number(ctx.worldLooseSeed.y);
  const canopyInset = 6;
  zones.push(
    expandWorldRockAvoidRect(
      TREE_CANOPY_LEFT + canopyInset,
      TREE_CANOPY_TOP + canopyInset,
      TREE_CANOPY_RIGHT - TREE_CANOPY_LEFT - 2 * canopyInset,
      TREE_CANOPY_BOTTOM - TREE_CANOPY_TOP - 2 * canopyInset,
      p
    )
  );
  const trunkInset = 3;
  const trunkLeft = TREE_TRUNK_X - TREE_CLIMB_DISTANCE + trunkInset;
  const trunkW = TREE_TRUNK_WIDTH + 2 * TREE_CLIMB_DISTANCE - 2 * trunkInset;
  const trunkTop = TREE_TRUNK_TOP - 22;
  const trunkBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  zones.push(expandWorldRockAvoidRect(trunkLeft, trunkTop, trunkW, trunkBottom - trunkTop, p));
  const rootsTop =
    BIG_TREE_Y +
    BIG_TREE_HEIGHT +
    TREE_CSS_ROOTS_BOTTOM_EXTEND -
    TREE_CSS_ROOTS_HEIGHT;
  const rootsBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  zones.push(
    expandWorldRockAvoidRect(
      BIG_TREE_X + TREE_CSS_ROOTS_LEFT,
      rootsTop,
      TREE_CSS_ROOTS_WIDTH,
      rootsBottom - rootsTop,
      p
    )
  );
    extraSeeds: appleState.extraSeeds,
  const apples = (ctx && ctx.apples) || [];
  apples.forEach(function (a) {
    if (!a) return;
    const sz = Number.isFinite(Number(a.size)) ? Number(a.size) : 10;
    const ax = Number(a.x);
    const ay = Number(a.y);
    if (!Number.isFinite(ax) || !Number.isFinite(ay)) return;
    zones.push(expandWorldRockAvoidRect(ax, ay, sz, sz, p));
  });
            growthTier: plantRuntime.growthTier,
  if (ctx && ctx.worldLooseSeed) {
    const lx = Number(ctx.worldLooseSeed.x);
    const ly = Number(ctx.worldLooseSeed.y);
    if (Number.isFinite(lx) && Number.isFinite(ly)) {
      zones.push(expandWorldRockAvoidRect(lx, ly, SEED_SIZE, SEED_SIZE, p));
    }
  }

  const extraSeeds = (ctx && ctx.extraSeeds) || [];
  extraSeeds.forEach(function (s) {
    if (!s || s.planted || s.inInventory) return;
    const ex = Number(s.x);
    const ey = Number(s.y);
    if (!Number.isFinite(ex) || !Number.isFinite(ey)) return;
    zones.push(expandWorldRockAvoidRect(ex, ey, SEED_SIZE, SEED_SIZE, p));
  });
  const list = Array.isArray(existingRocks) ? existingRocks : [];
  const extraPlants = (ctx && ctx.extraPlants) || [];
  extraPlants.forEach(function (plant) {
    if (!plant || plant.removed) return;
    addPlantWorldRockAvoidZone(zones, plant, p);
  });
      if (!other) return false;
  if (ctx && ctx.plantSpot) {
    addPlantWorldRockAvoidZone(zones, ctx.plantSpot, p);
  }
    return { x: x, y: y };
  return zones;
}
}
function buildWorldRockSpawnContext() {
  return {
    apples: appleState.apples,
    worldLooseSeed: appleState.worldLooseSeed,
    extraSeeds: appleState.extraSeeds,
    extraPlants: appleState.extraPlants,
    plantSpot:
      plantRuntime.isSeedPlanted &&
      Number.isFinite(plantRuntime.spotX) &&
      Number.isFinite(plantRuntime.spotY) &&
      (plantRuntime.spotX !== 0 || plantRuntime.spotY !== 0)
        ? {
            x: plantRuntime.spotX,
            y: plantRuntime.spotY,
            growthTier: plantRuntime.growthTier,
            isSproutGrown: plantRuntime.isSproutGrown,
            sproutStage: plantRuntime.sproutStage,
            removed: false
          }
        : null
  };
}
  });
function pickRandomWorldRockSpawnPosition(size, ctx, existingRocks) {
  const rockSize = Number(size) || WORLD_ROCK_SIZE;
  const margin = WORLD_ROCK_SPAWN_X_MARGIN;
  const yMin = WORLD_ROCK_SPAWN_Y_MIN;
  const yTopMax = WORLD_ROCK_SPAWN_Y_MAX;
  const xSpan = Math.max(1, WORLD_WIDTH - 2 * margin - rockSize + 1);
  const ySpan = Math.max(1, yTopMax - yMin + 1);
  const avoidZones = collectWorldRockAvoidZones(ctx || buildWorldRockSpawnContext());
  const list = Array.isArray(existingRocks) ? existingRocks : [];
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const x = margin + Math.floor(Math.random() * xSpan);
    const y = yMin + Math.floor(Math.random() * ySpan);
    const rockR = worldRockRect(x, y, rockSize);
    const clashRock = list.some(function (other) {
      if (!other) return false;
      return Math.abs(Number(other.x) - x) < 10 && Math.abs(Number(other.y) - y) < 10;
    });
    if (clashRock || worldRockOverlapsAnyAvoidRect(rockR, avoidZones)) continue;
    return { x: x, y: y };
  }
  return null;
}
        ? localPlayerRoot
function getUnpickedWorldRockCount() {
  if (!Array.isArray(appleState.worldRocks)) return 0;
  const picked = new Set((appleState.worldRockPickedIds || []).map(String));
  return appleState.worldRocks.filter(function (rock) {
    return rock && !picked.has(String(rock.id));
  }).length;
}
    if (insertBeforeEl) {
function tryRespawnOneWorldRockIfBelowCap() {
  if (!isWorldDocumentEntry() || !isWorldRockPickupUnlocked()) return false;
  if (!Array.isArray(appleState.worldRocks)) appleState.worldRocks = [];
  if (!Array.isArray(appleState.worldRockPickedIds)) appleState.worldRockPickedIds = [];
  if (getUnpickedWorldRockCount() >= WORLD_LOOSE_ROCK_COUNT) return false;
  }
  const size = WORLD_ROCK_SIZE;
  const pos = pickRandomWorldRockSpawnPosition(size, buildWorldRockSpawnContext(), appleState.worldRocks);
  if (!pos) return false;
  markWorldDirty();
  const pickedSet = new Set(appleState.worldRockPickedIds.map(String));
  let rock = appleState.worldRocks.find(function (r) {
    return r && pickedSet.has(String(r.id));
  });
  if (!isWorldDocumentEntry() || !isWorldRockPickupUnlocked()) return;
  if (!rock) {
    if (appleState.worldRocks.length >= WORLD_LOOSE_ROCK_COUNT) return false;
    rock = {
      id: "ground-rock-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
      x: pos.x,
      y: pos.y,
      size: size
    };
    appleState.worldRocks.push(rock);
  }
function createRandomWorldRocks(ctx) {
  rock.x = pos.x;
  rock.y = pos.y;
  rock.size = size;
  appleState.worldRockPickedIds = appleState.worldRockPickedIds.filter(function (id) {
    return String(id) !== String(rock.id);
  });
      id: "ground-rock-" + (i + 1),
  if (!rock._el && ground) {
    const insertBeforeEl =
      localPlayerRoot && localPlayerRoot.parentNode === ground
        ? localPlayerRoot
        : player && player.parentNode === ground
          ? player
          : null;
    const el = document.createElement("div");
    el.className = "world-ground-rock";
    el.dataset.rockId = rock.id;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      ground.insertBefore(el, insertBeforeEl);
    } else {
      ground.appendChild(el);
    }
    rock._el = el;
  }
  updateBucketPosition();
  updateWorldRocks();
  saveAppleState();
  markWorldDirty();
  return true;
}
    saved.bucketX = bucketX;
function tickWorldRockRespawn(now) {
  if (!isWorldDocumentEntry() || !isWorldRockPickupUnlocked()) return;
  const t = now != null ? now : Date.now();
  if (lastWorldRockRespawnAt <= 0) {
    lastWorldRockRespawnAt = t;
    return;
  }
  if (t - lastWorldRockRespawnAt < WORLD_ROCK_RESPAWN_INTERVAL_MS) return;
  lastWorldRockRespawnAt = t;
  tryRespawnOneWorldRockIfBelowCap();
}
  const yPadding = 10;
function createRandomWorldRocks(ctx) {
  const size = WORLD_ROCK_SIZE;
  const rocks = [];
  for (let i = 0; i < WORLD_LOOSE_ROCK_COUNT; i += 1) {
    const pos = pickRandomWorldRockSpawnPosition(size, ctx, rocks);
    if (!pos) continue;
    rocks.push({
      id: "ground-rock-" + (i + 1),
      x: pos.x,
      y: pos.y,
      size: size
    });
  }
  return rocks;
}
    const pickedAt = Number(localApplePickedAtById[appleId] || 0);
function getWorldExtraBucketInsertBeforeEl() {
  if (localPlayerRoot && localPlayerRoot.parentNode === ground) {
    return localPlayerRoot;
  }
  if (player && player.parentNode === ground) {
    return player;
  }
  return null;
}
      return apple.id;
function rebuildWorldExtraBucketDom() {
  if (!ground) return;
  ground.querySelectorAll(".world-extra-bucket").forEach(function (node) {
    node.remove();
  });
  if (!isWorldDocumentEntry() || !Array.isArray(appleState.worldExtraBuckets)) return;
  const insertBeforeEl = getWorldExtraBucketInsertBeforeEl();
  appleState.worldExtraBuckets.forEach(function (entry) {
    if (!entry) return;
    const el = document.createElement("img");
    el.className = "world-extra-bucket";
    el.dataset.bucketId = entry.id;
    el.src = entry.isFull ? "??지/bucket-full.png" : "??지/bucket-empty.png";
    el.alt = "";
    el.setAttribute("aria-hidden", "true");
    el.draggable = false;
    if (insertBeforeEl) {
      ground.insertBefore(el, insertBeforeEl);
    } else {
      ground.appendChild(el);
    }
    entry._el = el;
  });
  updateWorldExtraBuckets();
}

function updateWorldExtraBuckets() {
  if (!isWorldDocumentEntry() || !Array.isArray(appleState.worldExtraBuckets)) return;
  const bucketSz = getBucketSize();
  appleState.worldExtraBuckets.forEach(function (entry) {
    if (!entry || !entry._el) return;
    setWorldSize(entry._el, bucketSz.width, bucketSz.height);
    setWorldPosition(entry._el, entry.x, entry.y);
    entry._el.src = entry.isFull ? "??지/bucket-full.png" : "??지/bucket-empty.png";
  });
}
      plantRuntime.isSeedPlanted &&
/** 거래 교환: 기존 ?동?는 ?고 맵에 ?동?? ?나 ??배치 */
function spawnWorldBucketBelowTradeMaster() {
  if (!ground || !isWorldDocumentEntry()) return;
  if (!Array.isArray(appleState.worldExtraBuckets)) appleState.worldExtraBuckets = [];
  const bucketSz = getBucketSize();
  const baseX = TRADE_MASTER_START_X + Math.max(0, Math.floor((NPC_WIDTH - bucketSz.width) / 2));
  const baseY = TRADE_MASTER_START_Y + NPC_HEIGHT + 3;
  const stack = appleState.worldExtraBuckets.length;
  const entry = {
    id: "world-bucket-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
    x: baseX + stack * 5,
    y: baseY,
    isFull: false
  };
  appleState.worldExtraBuckets.push(entry);
  const el = document.createElement("img");
  el.className = "world-extra-bucket";
  el.dataset.bucketId = entry.id;
  el.src = "??지/bucket-empty.png";
  el.alt = "";
  el.setAttribute("aria-hidden", "true");
  el.draggable = false;
  const insertBeforeEl = getWorldExtraBucketInsertBeforeEl();
  if (insertBeforeEl) {
    ground.insertBefore(el, insertBeforeEl);
  } else {
    ground.appendChild(el);
  }
  entry._el = el;
  updateWorldExtraBuckets();
  markWorldDirty();
  saveAppleState();
}
  ensureWorldLooseSeedShape();
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
    });
  return (
    appleRight >= trunkLocalLeft - xPadding &&
    appleLeft <= trunkLocalRight + xPadding &&
    appleBottom >= trunkTopLocalY - yPadding
  );
}
    });
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
      });
  if (availableIds.length === 0) {
    appleState.lastSpawnAt = now;
    return;
  }

  const elapsedSpawns = Math.floor((now - appleState.lastSpawnAt) / appleRespawnMs);
  if (elapsedSpawns <= 0) return;
  }
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
    appleStateKey,
  appleState.lastSpawnAt += spawnCount * appleRespawnMs;
  saveAppleState();
}
    apples: appleState.apples,
function loadAppleState() {
  const loaded = loadAppleStateFromStorage({
    appleStateKey,
    bigTreeX: BIG_TREE_X,
    bigTreeY: BIG_TREE_Y,
    now: Date.now(),
    defaultSeedLabel: "\uC528\uC557",
    createRandomApples,
    createRandomWorldRocks,
    plantSpotForRocks:
      plantRuntime.isSeedPlanted &&
      Number.isFinite(plantRuntime.spotX) &&
      Number.isFinite(plantRuntime.spotY) &&
      (plantRuntime.spotX !== 0 || plantRuntime.spotY !== 0)
        ? { x: plantRuntime.spotX, y: plantRuntime.spotY }
        : null
  });
    const saved = JSON.parse(savedRaw);
  appleState.count = loaded.appleCount;
  appleState.seedCount = Math.max(0, Number(loaded.seedCount) || 0);
  appleState.overgrowthSeedCount = Math.max(0, Number(loaded.overgrowthSeedCount) || 0);
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
  appleState.worldRocks = Array.isArray(loaded.worldRocks) ? loaded.worldRocks : [];
  appleState.worldExtraBuckets = Array.isArray(loaded.worldExtraBuckets)
    ? loaded.worldExtraBuckets
    : [];
  appleState.worldRockPickedIds = Array.isArray(loaded.worldRockPickedIds)
    ? loaded.worldRockPickedIds.map(String).filter(function (id, idx, arr) {
        return arr.indexOf(id) === idx;
      })
    : [];
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
        overgrowthSeedCount: appleState.overgrowthSeedCount,
        apples: appleState.apples,
        pickedAppleIds: appleState.pickedIds,
        nextAppleSeedOffset: appleState.nextSeedOffset,
        lastAppleSpawnAt: appleState.lastSpawnAt,
        extraSeeds: appleState.extraSeeds,
        extraPlants: appleState.extraPlants,
        worldLooseSeed: appleState.worldLooseSeed,
        worldRocks: appleState.worldRocks,
        worldRockPickedIds: appleState.worldRockPickedIds,
        worldExtraBuckets: appleState.worldExtraBuckets
      });
    }
  }
  };
  syncMainSeedPickedStateFromLoadedExtraSeeds();
    const v = bump(plant[key]);
  if (loaded.parseFailed) {
    clearExtraSeedAndPlantElements();
  }
  maybe("becameEmptyAt");
  rebuildWorldRockDom();
  rebuildWorldExtraBucketDom();
  updateApples();
  updateExtraSeedsAndPlants();
  updateSeedPosition();
}
  maybe("powderUpgradeStartedAt");
function saveAppleState() {
  lastAppleStateChangeAt = Date.now();
  ensureWorldLooseSeedShape();
  saveAppleStateToStorage({
    appleStateKey,
    appleCount: appleState.count,
    seedCount: appleState.seedCount,
    overgrowthSeedCount: appleState.overgrowthSeedCount,
    apples: appleState.apples,
    pickedAppleIds: appleState.pickedIds,
    nextAppleSeedOffset: appleState.nextSeedOffset,
    lastAppleSpawnAt: appleState.lastSpawnAt,
    extraSeeds: appleState.extraSeeds,
    extraPlants: appleState.extraPlants,
    worldLooseSeed: appleState.worldLooseSeed,
    worldRocks: appleState.worldRocks,
    worldRockPickedIds: appleState.worldRockPickedIds,
    worldExtraBuckets: (appleState.worldExtraBuckets || []).map(function (bucket) {
      return {
        id: bucket.id,
        x: Number(bucket.x) || 0,
        y: Number(bucket.y) || 0,
        isFull: Boolean(bucket.isFull)
      };
    })
  });
  markWorldDirty();
}
  if (w > 0) {
function loadBucketState() {
  const savedRaw = getStoredValue(bucketStateKey);
  if (!savedRaw) return;
    } else {
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
function sanitizePrematureRemotePlantDryState(plant, now) {
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
  ) {
function markWorldDirty() {
  if (isApplyingWorldState) return;
  isWorldDirty = true;
}
  plant.needsFirstWater = false;
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
    return false;
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
      applyPlantWaterDecay(plantRuntime, now);
/**
 * After a remote world snapshot, passive decay should use the same clock as
 * `rebasePlantModelTimestampsToLocalNow` (`getSynchronizedNow()` when shared merge
 * is active). Clamp hydration timestamps so skew cannot drain all water or
 * trigger dry soil in the same frame as apply.
 * @param {function} getDryAfterEmptyMs (plant, now) => ms until soil dries after water hits 0
 */
function sanitizeSharedPlantHydrationAfterRemoteSnapshot(plant, now, getDryAfterEmptyMs) {
  if (!plant) return;
  if (Object.prototype.hasOwnProperty.call(plant, "isSeedPlanted") && !plant.isSeedPlanted) {
    return;
  }
  if (plant.status === "rotten" || plant.status === "dry") return;
    }
  const w = Math.max(0, Number(plant.waterLevel) || 0);
  const tickMs = getPlantWaterLevelTickMsForPlant(plant);
  if (!Number.isFinite(tickMs) || tickMs <= 0) return;
function getSharedWorldSnapshot() {
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
    well: {
  const be = Number(plant.becameEmptyAt);
  if (plant.becameEmptyAt != null && Number.isFinite(be)) {
    const dryAfter = getDryAfterEmptyMs(plant, now);
    if (dryAfter > 0 && now - be >= dryAfter) {
      plant.becameEmptyAt = Math.max(1, now - dryAfter + 1);
    }
  }
}
      isDryHandled: hasHandledDryMainSeed,
/** ?물 ?시?리필 ?과 맞춰 ?른 ?라? lastRefillAt ?석???긋?????기가 반복?는 것을 줄임 */
function sanitizePrematureRemotePlantDryState(plant, now) {
  if (!plant || plant.status !== "dry") return;
  const plantedAt = Number(plant.plantedAt);
  if (!Number.isFinite(plantedAt) || plantedAt <= 0) return;
  const ageAtSnapshot = Math.max(0, now - plantedAt);
  const tickMs = getPlantWaterLevelTickMsForPlant(plant);
  const dryAfterMs = getPlantDryAfterEmptyMsForPlantPhase(plant);
  const minDryAge = tickMs + dryAfterMs;
  if (
    !Number.isFinite(tickMs) ||
    !Number.isFinite(dryAfterMs) ||
    tickMs <= 0 ||
    dryAfterMs <= 0 ||
    ageAtSnapshot >= minDryAge
  ) {
    return;
  }
      extraSeeds: usesWorldLooseSeedMode()
  plant.status = "normal";
  plant.needsFirstWater = false;
  plant.blockSproutRegrowthAfterDry = false;
  plant.drySoilAt = null;
  plant.waterLevel = ageAtSnapshot < tickMs ? 1 : 0;
  plant.waterLevelUpdatedAt = plant.waterLevel > 0 ? Math.max(1, now - ageAtSnapshot) : now;
  plant.becameEmptyAt =
    plant.waterLevel > 0 ? null : Math.max(1, now - Math.max(0, ageAtSnapshot - tickMs));
}
                createdAt: extraSeed.createdAt,
function shouldIgnoreEmptyRemoteMainPlant(incomingPlant) {
  if (!plantRuntime.isSeedPlanted || !incomingPlant || incomingPlant.isSeedPlanted) {
    return false;
  }
  if (isReloadingForWorldReset || Date.now() - Number(lastWorldResetAt || 0) < 20000) {
    return false;
  }
  const status = plantRuntime.status || "normal";
  if (status === "normal" || status === "wet") {
    return true;
  }
  if (status === "dry") {
    const dryAt = Number(plantRuntime.drySoilAt);
    return !Number.isFinite(dryAt) || Date.now() - dryAt < plantDrySoilClearMs;
  }
  if (status === "rotten" || plantRuntime.isOverwatered) {
    const rottenAt = Number(plantRuntime.rottenAt);
    return !Number.isFinite(rottenAt) || Date.now() - rottenAt < plantRotClearMs;
  }
  return true;
}
                isStarter: Boolean(extraSeed.isStarter),
function snapWellRefillToGrid(nowMs) {
  const t = Number(nowMs);
  if (!Number.isFinite(t) || t <= 0) {
    return Math.floor(Date.now() / wellRefillMs) * wellRefillMs;
  }
  return Math.floor(t / wellRefillMs) * wellRefillMs;
}
            return {
/**
 * 공유 ?드 ???직전: ?시??감소·?물 리필???재 ?각까? 반영?? * ?래???분/?물 값이 ?냅?에 ?리지 ?게 ??(멀?에??게이지가 ?쭉?쭉???인).
 */
function flushPassiveSimulationBeforeSharedSnapshot() {
  if (!isSharedWorldMergeActive()) return;
  const now = getSharedPlantSimulationNow();
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
          powderUpgradeDurationMs: plant.powderUpgradeDurationMs || 0,
function getSharedWorldSnapshot() {
  flushPassiveSimulationBeforeSharedSnapshot();
  const bucketHeldBy = heldItem === HELD_ITEM_BUCKET ? currentSessionId : window.OVC_SHARED_BUCKET_HELD_BY || "";
  return {
    /** 멀?? ?물 ??스?프? 같? ?각축으??어 `rebasePlantModelTimestampsToLocalNow`??refTime?괴리 감소 */
    savedAt: getSharedPlantSimulationNow(),
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
      // ?드(?보???료): ???앗? worldLooseSeed 1?롯?공유. ?? ?앗(stub)?extraSeeds.
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
      }),
      worldRocks: isWorldDocumentEntry()
        ? (Array.isArray(appleState.worldRocks) ? appleState.worldRocks : []).map(function (rock) {
            if (!rock) {
              return { id: "", x: 0, y: 0, size: WORLD_ROCK_SIZE };
            }
            return {
              id: String(rock.id),
              x: Number(rock.x),
              y: Number(rock.y),
              size: Number.isFinite(Number(rock.size)) ? Number(rock.size) : WORLD_ROCK_SIZE
            };
          })
        : undefined,
      worldRockPickedIds: isWorldDocumentEntry()
        ? (Array.isArray(appleState.worldRockPickedIds)
            ? appleState.worldRockPickedIds.map(String)
            : [])
        : undefined
    },
    butterflies: getButterflyStateForSnapshot()
  };
}
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
  updateBagInventorySlots();
  updateMagicPowderInventoryUi();
  rebuildWorldRockDom();
}
          isMainSeedAvailable = true;
function holdLocalPlantStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  localPlantActionLockUntil = Math.max(localPlantActionLockUntil, Date.now() + lockMs);
}
      if (canApplyMainSeedState && snapshotSavedAt) {
function holdLocalAppleStateAgainstStaleSnapshot(ms) {
  const lockMs = Math.max(0, Number(ms) || 0);
  if (!lockMs) return;
  localAppleActionLockUntil = Math.max(localAppleActionLockUntil, Date.now() + lockMs);
}
          if (Number.isFinite(nextSeedY)) seedY = nextSeedY;
function getSynchronizedNow() {
  return getSynchronizedNowCore(serverClockOffsetMs);
}
          setStoredValue(seedCreatedAtKey, String(nextSeedCreatedAt));
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
    if (snapshot.well) {
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
    persistOvcLastAppliedWorldResetToken(lastAppliedWorldResetToken);
    // 공유 ?계? 로컬 ?드 캐시 ?? + 맵·자??기본??토리얼 ?션/?보???는 ??)
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
        }
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
          setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
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
          return !snapshotPlantIdsEarly[String(p.id)];
    // Shared world rows are authoritative once the server reports a new updated_at.
    // Do not gate well / main plant / apples on local timestamps or client clocks ??    // that drops remote plants when lastAppleStateChangeAt / lastMainPlantStateChangeAt
    // is ahead of the snapshot savedAt (clock skew or any local saveAppleState).
    if (snapshot.well) {
      wellState.water = Math.max(0, Math.min(maxWellWater, Number(snapshot.well.water) || 0));
      wellState.lastRefillAt = Number(snapshot.well.lastRefillAt) || Date.now();
      refillWellIfNeeded();
      if (snapshotSavedAt) {
        lastWellStateChangeAt = Math.max(lastWellStateChangeAt, snapshotSavedAt);
      }
    }
      }).map(function (extraSeed) {
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
      if (shouldIgnoreEmptyRemoteMainPlant(incomingPlant)) {
        incomingPlant = null;
        markWorldDirty();
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
        sanitizePrematureRemotePlantDryState(plantRuntime, localApplyNow, snapshotRefTime);
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
          appleState.extraSeeds = localInventorySeeds.slice();
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
        sanitizePrematureRemotePlantDryState(ep, extraPlantClockNow, snapRefPlants);
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
      if (isWorldDocumentEntry()) {
        const snapApples = snapshot.apples;
        const sr = snapApples.worldRocks;
        const sp = snapApples.worldRockPickedIds;
        if (Array.isArray(sr) && sr.length === WORLD_LOOSE_ROCK_COUNT) {
          const m = WORLD_ROCK_SPAWN_X_MARGIN;
          const xMax = WORLD_WIDTH - m - WORLD_ROCK_SIZE;
          const rocksOk = sr.every(function (r) {
            if (!r || typeof r.id !== "string") return false;
            const x = Number(r.x);
            const y = Number(r.y);
            const sz = Number(r.size);
            return (
              Number.isFinite(x) &&
              Number.isFinite(y) &&
              Number(sz) === WORLD_ROCK_SIZE &&
              x >= m &&
              x <= xMax &&
              y >= WORLD_ROCK_SPAWN_Y_MIN &&
              y <= WORLD_ROCK_SPAWN_Y_MAX
            );
          });
          if (rocksOk) {
            appleState.worldRocks = sr.map(function (r) {
              return {
                id: String(r.id),
                x: Number(r.x),
                y: Number(r.y),
                size: WORLD_ROCK_SIZE
              };
            });
          }
        }
        if (Array.isArray(sp)) {
          const merged = new Set(appleState.worldRockPickedIds.map(String));
          sp.forEach(function (id) {
            if (id != null && String(id).trim() !== "") {
              merged.add(String(id));
            }
          });
          appleState.worldRockPickedIds = Array.from(merged);
        }
      }
      if (snapshotSavedAt) {
        lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, snapshotSavedAt);
      }
    }
      ? lastWorldUpdatedAt
    // Always merge butterfly membership from other clients' saves. A timestamp
    // guard would drop removals because the authority bumps lastButterflyStateChangeAt
    // every movement broadcast while non-authority catches use an older savedAt.
    if (snapshot.butterflies) {
      const butterflySnapshotAt = snapshotSavedAt || Date.now();
      if (!lastButterflyRealtimeStateAt || butterflySnapshotAt >= lastButterflyRealtimeStateAt - 500) {
        applyButterflySnapshot(snapshot.butterflies, butterflySnapshotAt);
      }
      if (snapshotSavedAt) {
        lastButterflyStateChangeAt = Math.max(
          lastButterflyStateChangeAt,
          snapshotSavedAt
        );
      }
    }
      pollWorldState(true);
    refreshUiAfterSharedWorldApply();
  } finally {
    isApplyingWorldState = false;
  }
}
    showThrottledWorldSyncToast(
function ensureSharedPlantVisuals() {
  if (plantRuntime.isSeedPlanted) {
    plantSpot.src = getPlantSoilSrc(plantRuntime);
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    const mainRot = plantRuntime.status === "rotten" || plantRuntime.isOverwatered;
    plantSpot.style.display =
      mainRot || !shouldHideSeparateSoilUnderBigGrass(plantRuntime) ? "block" : "none";
  }
function saveSharedWorldAndReload(options) {
  appleState.extraPlants.forEach(function (plant) {
    ensureExtraPlantElements(plant);
    plant.spotElement.src = getPlantSoilSrc(plant);
    setWorldPosition(plant.spotElement, plant.x, plant.y);
    plant.spotElement.style.display = shouldHideSeparateSoilUnderBigGrass(plant) ? "none" : "block";
  });
}
    return;
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
  saveResetSnapshot().then(function (row) {
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
    );
function isWorldServerSyncAvailable() {
  return Boolean(
    window.OVCOnline &&
    typeof window.OVCOnline.saveWorldState === "function" &&
    typeof window.OVCOnline.loadWorldState === "function" &&
    window.OVCOnline.isConfigured &&
    window.OVCOnline.isConfigured()
  );
}
  const now = Date.now();
/** Shared row is authoritative; passive local ticks must not push over others' saves. */
function isSharedWorldMergeActive() {
  return isWorldServerSyncAvailable() && hasHydratedSharedWorldFromServer;
}
    isSharedWorldSyncPausedForTutorial() ||
/**
 * 멀??공유 ?드: ?냅?의 `rebasePlantModelTimestampsToLocalNow`·sanitize가
 * `getSynchronizedNow()`(?버 ???각 기? ?프???로 맞춰???는??
 * ?감소?`Date.now()`??면 ?프?만??경과가 벌어?????에 물이 ??빠?? * ?이 바로 마른 것처??보인?? ?시??물 ?? ???각?맞출 ?
 */
function getSharedPlantSimulationNow() {
  return isSharedWorldMergeActive() ? getSynchronizedNow() : Date.now();
}
  lastWorldPollAt = now;
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
  if (!hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
    isWorldDirty = true;
    pollWorldState(true);
    return;
  }
  isWorldSyncing = true;
  isWorldDirty = false;
  lastWorldSaveAt = now;
  const expectedUpdatedAt =
    isWorldServerSyncAvailable() && hasHydratedSharedWorldFromServer && lastWorldUpdatedAt
      ? lastWorldUpdatedAt
      : "";
  window.OVCOnline.saveWorldState(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    getSharedWorldSnapshot(),
    { expectedUpdatedAt }
  ).then(function (row) {
    applyServerWorldRowTimestamps(row);
  }).catch(function (error) {
    if (
      error &&
      (error.code === "world_state_conflict" ||
        String(error.message || "").indexOf("world_state_conflict") !== -1)
    ) {
      addNetworkDebugLog("world save conflict: polling latest snapshot before retry");
      isWorldDirty = true;
      pollWorldState(true);
      return;
    }
    addNetworkDebugLog(
      "world save error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
    showThrottledWorldSyncToast(
      "\uC6D4\uB4DC \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
    );
    isWorldDirty = true;
  }).finally(function () {
    isWorldSyncing = false;
  });
}
function dropSeed() {
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
  if (!extraSeed) {
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
      "world reset save error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
    showThrottledWorldSyncToast(
      "\uC6D4\uB4DC \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
    );
  }).finally(function () {
    isWorldSyncing = false;
    isReloadingForWorldReset = true;
    if (reloadUrl) window.location.replace(reloadUrl);
    else window.location.reload();
  });
}
  bucketX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
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
  if (plantRuntime.isPlanting) return false;
  isWorldPolling = true;
  lastWorldPollAt = now;
  window.OVCOnline.loadWorldState(
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom
  ).then(function (row) {
    if (isWorldServerSyncAvailable()) {
      hasHydratedSharedWorldFromServer = true;
    }
    if (!row || !row.state || !row.updated_at || row.updated_at === lastWorldUpdatedAt) return;
    lastWorldUpdatedAt = row.updated_at;
    applySharedWorldSnapshot(row.state, row.updated_at);
  }).catch(function (error) {
    addNetworkDebugLog(
      "world poll error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
    showThrottledWorldSyncToast(
      "\uC6D4\uB4DC \uBD88\uB7EC\uC624\uAE30\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB124\uD2B8\uC6CC\uD06C\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694."
    );
  }).finally(function () {
    isWorldPolling = false;
  });
}
    (!hasPickedMainSeedInCurrentRoom() &&
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
      dryMainSeedVisibleSince = now;
  if (heldItem === HELD_ITEM_SEED) {
    dropSeed();
    return;
  }
      setStoredFlag(mainDrySeedHandledKey, true);
  if (isHeldExtraSeed(heldItem)) {
    dropExtraSeed();
    return;
  }
      scheduleTutorialMainSeedRespawnFromGround();
  if (heldItem === HELD_ITEM_BUCKET) {
    dropBucket();
  }
}
  // Main seed is a fixed world object (next to the book), not a roaming synced item.
function dropSeed() {
  const playerBox = getPlayerBox();
  const seedSize = getSeedSize();
    seedY = SEED_START_Y;
  seedX = playerBox.left + playerBox.width / 2 - seedSize.width / 2;
  seedY = playerBox.bottom - seedSize.height;
  heldItem = null;
}
  if (!showMainSeedSprite) {
function dropExtraSeed() {
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed) {
    heldItem = null;
    return;
  }
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
 * 튜토 #seed·월드 느슨 img와 legacy 슬롯이 동시에 보이는 경우 방지.
  const playerBox = getPlayerBox();
  extraSeed.x = playerBox.left + playerBox.width / 2 - SEED_SIZE / 2;
  extraSeed.y = playerBox.bottom - SEED_SIZE;
  extraSeed.inInventory = false;
  assignExtraSeedInventoryOwner(extraSeed);
  heldItem = null;
  saveAppleState();
}
    return false;
function dropBucket() {
  const playerBox = getPlayerBox();
  const bucketSize = getBucketSize();
    Math.abs(extraSeed.x - WORLD_LOOSE_SEED_X) <= tol &&
  bucketX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
  bucketY = playerBox.bottom - bucketSize.height;
  heldItem = null;
  window.OVC_SHARED_BUCKET_HELD_BY = "";
  broadcastBucketState(true);
  saveBucketState();
  syncWorldState(true);
  onboardingHookDroppedBucketForTutorial();
}
    worldLooseSeedElement.remove();
function onboardingShouldKeepWorldMainSeedVisible() {
  if (getStoredFlag(onboardingFlowDoneKey)) return false;
  if (onboardingFlowStep < 1 || onboardingFlowStep > 6) return false;
  if (hasPickedMainSeedInCurrentRoom()) return false;
  if (plantRuntime.isPlanting) return false;
  return true;
}
  if (usesWorldLooseSeedMode()) {
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
  // ?드 ?슨 ??모드: ???앗? worldLooseSeed ??개만 ???토??#seed????(?에 ??경우??시).
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
  seed.src = plantRuntime.isSeedDry ? "??지/seed-dry.png" : "??지/seed.png";
    }
  if (heldItem === HELD_ITEM_SEED && plantRuntime.isSeedDry) {
    heldItem = null;
  }

  if (heldItem === HELD_ITEM_SEED) {
    const seedSize = getSeedSize();
    const handPosition = getHandPosition(seedSize.width, seedSize.height);
    extraSeed.element.src = isDry ? "이미지/seed-dry.png" : "이미지/seed.png";
    seedX = handPosition.x;
    seedY = handPosition.y + 5;
  }

  setWorldPosition(seed, seedX, seedY);
}
        heldItem = null;
/**
 * 지???????롯(WORLD_LOOSE_SEED_* = SEED_START)??겹친 extraSeeds ???프?이?는 ??.
 * ?토 #seed·?드 ?슨 img? legacy ?롯???시??보이??경우 방?.
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
  let didRemoveDrySoilExtraPlant = false;
function updateExtraSeedsAndPlants() {
  const now = getSharedPlantSimulationNow();
  let didAutoRemoveDryExtraSeed = false;
    updateExtraPlantState(plant, now);
  if (isTutorialDocumentEntry() && worldLooseSeedElement) {
    worldLooseSeedElement.remove();
    worldLooseSeedElement = null;
  }
      now - Number(plant.drySoilAt) >= plantDrySoilClearMs
  if (usesWorldLooseSeedMode() && isHeldExtraSeed(heldItem) && !getHeldExtraSeed()) {
    heldItem = null;
  }
    } else if (
  if (usesWorldLooseSeedMode()) {
    ensureWorldLooseSeedShape();
    if (!worldLooseSeedElement) {
      worldLooseSeedElement = document.createElement("img");
      worldLooseSeedElement.className = "extra-seed world-loose-seed";
      worldLooseSeedElement.alt = "world loose seed";
      worldLooseSeedElement.src = "??지/seed.png";
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
    plant.sproutElement.style.display = isSproutGrown ? "block" : "none";
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
    if (!plant.removed) return true;
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
  }
  appleState.extraSeeds.forEach(function (extraSeed) {
    ensureExtraSeedElement(extraSeed);
    const isDry = isExtraSeedDry(extraSeed, now);
    extraSeed.element.src = isDry ? "??지/seed-dry.png" : "??지/seed.png";
    const hideGroundOverlap = shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed);
    extraSeed.element.style.display =
      extraSeed.planted || extraSeed.inInventory || hideGroundOverlap ? "none" : "block";
    }
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
    plant.needsFirstWater = !plant.growthStartedAt;
    setWorldPosition(extraSeed.element, extraSeed.x, extraSeed.y);
  });
  if (!Number.isFinite(plant.rottenAt)) plant.rottenAt = null;
  if (didAutoRemoveDryExtraSeed) {
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }
  if (!Number.isFinite(plant.powderUpgradeDurationMs)) plant.powderUpgradeDurationMs = 0;
  updateSeedInventory();
  if (plant.sproutEvolutionLastTickAt != null && !Number.isFinite(plant.sproutEvolutionLastTickAt)) {
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
    plant.needsFirstWater = false;
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
    return;
/** ??·스?샷???장 ms가 ?재 constants? ?르?맞춤(?? 가?2분→3초로 바꾼 ?에????duration???는 경우) */
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
    return;
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
  if (!plant || !plant.isSproutGrown) return 0;
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
/**
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
    Math.abs(Number(wl[0]) - gs) < 20000
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
  const gs = Number(plant.growthStartedAt) || 0;
  if (plant.status === "rotten") {
    return;
  }
  if (!Array.isArray(wl)) return false;
  if (plant.status === "dry") {
    normalizePlantSproutFieldsWhenSoilDry(plant);
    plant.blockSproutRegrowthAfterDry = true;
    if (plant.drySoilAt == null || !Number.isFinite(Number(plant.drySoilAt))) {
      plant.drySoilAt = now;
    }
    return;
  }
  if (!plant) return false;
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
    Math.max(0, Number(plant.growthTier) || 0) >= 4
  if (
    plant.growthStartedAt !== null &&
    plant.status !== "dry" &&
    plant.status !== "rotten" &&
    !plant.isOverwatered &&
    !plant.isSproutGrown &&
    now - plant.growthStartedAt >= getPlantFirstGrowthDurationMs(plant)
  ) {
    if (!makePlantStableStage3FromOvergrowthSeed(plant, now)) {
      plant.isSproutGrown = true;
      plant.sproutGrownAt = now;
      plant.sproutEvolutionMs = 0;
      plant.sproutEvolutionLastTickAt = now;
      plant.isSproutSelfSustaining = false;
    }
  }
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
  plant.powderUpgradeTargetTier = 0;
function getPlantWaterCapacity(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 3) return 3;
  return Math.max(2, Number(plant.waterCapacity) || 2);
}
function normalizePlantSproutFieldsWhenSoilDry(plant) {
function isPowderUpgradeInProgress(plant) {
  return (
    Number(plant.powderUpgradeTargetTier) > 0 &&
    Number(plant.powderUpgradeDurationMs) > 0 &&
    Number(plant.powderUpgradeStartedAt) > 0
  );
}
  plant.isSproutSelfSustaining = false;
/**
 * ?? 직후 ?냅?? needsFirstWater가 false?데 ?Q 물을 ?직 ??준 ?태?????음.
 * wateredAtList가 [growthStartedAt] ??번뿐?면 "???요"?본다.
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
  const tier = Math.max(0, Number(plant.growthTier) || 0);
function isPlantAwaitingPlayerFirstPour(plant) {
  if (!plant) return false;
  if (plant.status !== "normal" || plant.isOverwatered) return false;
  if (plant.isSproutGrown) return false;
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 0) return false;
  const gs = Number(plant.growthStartedAt) || 0;
  if (gs <= 0) return false;
  if (plant.lastWateredAt != null && Number(plant.lastWateredAt) > 0) return false;
  const wl = plant.wateredAtList;
  if (!Array.isArray(wl)) return false;
  /** ?? 직후 로컬 ?태??wateredAtList가 비어 ?음. stabilizeFirstWaterHintFlags??머? ?에??출?? */
  if (wl.length === 0) return true;
  if (wl.length !== 1) return false;
  return Math.abs(Number(wl[0]) - gs) < 20000;
}
  plant.growthTier = 5;
/** 4·5????서????물방??UI ??(?프?이???중?에 겹쳐 보이??문제) */
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
  plant.powderUpgradeTargetTier = 0;
function getPowderUpgradeRatio(plant, now) {
  if (!isPowderUpgradeInProgress(plant)) return null;
  const startedAt = Number(plant.powderUpgradeStartedAt) || 0;
  const duration = Number(plant.powderUpgradeDurationMs) || 0;
  if (!startedAt || !duration) return null;
  return Math.min(1, Math.max(0, (now - startedAt) / duration));
}
    plant.status !== "dry" &&
function isHighTierPlantCare(plant) {
  return (
    isPowderUpgradeInProgress(plant) ||
    Math.max(0, Number(plant.growthTier) || 0) >= 4
  );
}
/** 티어 4·생존·가루 진행 없음이면 자동 5단 타이머 시작(또는 유지) */
function canPlantWiltFromEmptyWater(plant, now) {
  const tNow = now != null ? now : Date.now();
  if (isTutorialDocumentEntry() && Math.max(0, Number(plant && plant.growthTier) || 0) === 0) {
    return false;
  }
  if (isSproutStage3Or5IdleNoGrowth(plant, tNow)) return false;
  return !plant.isSproutSelfSustaining || isHighTierPlantCare(plant);
}
    plant.grassAuto5EligibleAt = null;
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
  return {
function cancelPlantPowderUpgrade(plant) {
  if (!plant) return;
  plant.powderUpgradeTargetTier = 0;
  plant.powderUpgradeStartedAt = null;
  plant.powderUpgradeDurationMs = 0;
}
  return isWorldPointInsideRectCore(x, y, rect);
/** 마른 ?인?????장 ??스?프가 ?으??주기·?링 직후 ?깐 ?라??것처??보일 ???음 */
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
  });
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
  if (plantRuntime.isSeedPlanted) consider(plantRuntime);
/** 4??? ?존 ??가??이 level5GrowMs ???동 5??(가루는 3??? */
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
    const r = el.getBoundingClientRect();
/** 구세?브: 가?4?? ?거 ??진행 중이??동 5????머??? */
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
  }
/** ?어 4·?존·가?진행 ?음?면 ?동 5????머 ?작(?는 ??) */
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
function showWorldNpcHoverLabel(text, anchorEl) {
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
  plantHoverLabel.style.position = "fixed";
function isWorldPointInsideRect(x, y, rect) {
  return isWorldPointInsideRectCore(x, y, rect);
}
  void plantHoverLabel.offsetWidth;
/** ?재 보이???물 ?프?이?????싹/?)???드 박스 목록 */
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
  plantHoverLabel.classList.remove("is-seed-inventory-hint", "is-stage3-complete", "is-well-dock", "is-world-npc-name");
/** ?인?? ?재 ?물 ??지 ?역 ?에 ?을 ?만 ?택(겹침 ??중심거리 가까운 ? */
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
  }
function bagHasPlantableSeedsForHoverHint() {
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
    worldBagInventory.style.display !== "none"
/** 고정 UI(?정·채팅·?트·?퍼?? ??브라?? title ???#plant-hover-label ???로 ?축???시 */
function pickUiShortcutHoverTarget(clientX, clientY) {
  const pad = 4;
  function over(el) {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    return (
      clientX >= r.left - pad &&
      clientX <= r.right + pad &&
      clientY >= r.top - pad &&
      clientY <= r.bottom + pad
    );
  }
  if (settingsButton && over(settingsButton)) {
    return { anchorEl: settingsButton, text: "?정: Esc" };
  }
  if (!worldSocialUiReady) return null;
  if (worldChatToggleBtn && over(worldChatToggleBtn)) {
    return { anchorEl: worldChatToggleBtn, text: "채팅: C" };
  }
  if (worldHeartBtn && over(worldHeartBtn)) {
    return { anchorEl: worldHeartBtn, text: "?트: H" };
  }
  if (worldSadBtn && over(worldSadBtn)) {
    return { anchorEl: worldSadBtn, text: "?퍼?? Ctrl+S" };
  }
  return null;
}
    plant.sproutEvolutionLastTickAt = now;
/** `.world`??transform???으???의 fixed??뷰포?? ?니???드 기????어 좌표가 ?긋????UI ?트?body?*/
function ensurePlantHoverLabelOnBodyForFixedUi() {
  if (!plantHoverLabel || !ground) return;
  if (plantHoverLabel.parentNode === document.body) return;
  document.body.appendChild(plantHoverLabel);
}
  const delta = Math.min(4000, Math.max(0, now - last));
function restorePlantHoverLabelToWorldDom() {
  if (!plantHoverLabel || !ground) return;
  if (plantHoverLabel.parentNode === ground) return;
  ground.appendChild(plantHoverLabel);
}
    plant.isSproutSelfSustaining = true;
function showWorldNpcHoverLabel(text, anchorEl) {
  if (!plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  ensurePlantHoverLabelOnBodyForFixedUi();
  plantHoverLabel.classList.remove(
    "is-seed-inventory-hint",
    "is-stage3-complete",
    "is-well-dock",
    "is-ui-shortcut-hint"
  );
  plantHoverLabel.classList.add("is-world-npc-name");
  plantHoverLabel.textContent = text;
  plantHoverLabel.style.display = "block";
  plantHoverLabel.style.position = "fixed";
  plantHoverLabel.style.zIndex = "225";
  plantHoverLabel.style.transform = "none";
  const rect = anchorEl.getBoundingClientRect();
  void plantHoverLabel.offsetWidth;
  const w = plantHoverLabel.offsetWidth || 1;
  const h = plantHoverLabel.offsetHeight || 1;
  const left = Math.round(rect.left + rect.width / 2 - w / 2);
  const top = Math.round(rect.top - h - 6);
  plantHoverLabel.style.left = left + "px";
  plantHoverLabel.style.top = top + "px";
}
    height: Math.max(1, Math.round(baseHeight * growthScale))
function showUiShortcutHoverLabel(text, anchorEl) {
  if (!plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  ensurePlantHoverLabelOnBodyForFixedUi();
  plantHoverLabel.classList.remove("is-seed-inventory-hint", "is-stage3-complete", "is-well-dock", "is-world-npc-name");
  plantHoverLabel.classList.add("is-ui-shortcut-hint");
  plantHoverLabel.textContent = text;
  plantHoverLabel.style.display = "block";
  plantHoverLabel.style.position = "fixed";
  plantHoverLabel.style.zIndex = "220";
  plantHoverLabel.style.transform = "none";
  const r = anchorEl.getBoundingClientRect();
  void plantHoverLabel.offsetWidth;
  const w = plantHoverLabel.offsetWidth || 1;
  const h = plantHoverLabel.offsetHeight || 1;
  const gap = 8;
  let left = r.left + r.width / 2 - w / 2;
  let top = r.top - h - gap;
  left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
  top = Math.max(8, top);
  plantHoverLabel.style.left = left + "px";
  plantHoverLabel.style.top = top + "px";
}
  }
function syncPlantHoverFromPointerClient(clientX, clientY) {
  if (!plantHoverLabel) return;
    y: plantBaseY - sproutSize.height + footInset
  const uiShortcut = pickUiShortcutHoverTarget(clientX, clientY);
  if (uiShortcut) {
    if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
    showUiShortcutHoverLabel(uiShortcut.text, uiShortcut.anchorEl);
    return;
  }
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const npcHover = pickWorldNpcHover(clientX, clientY);
  if (npcHover) {
    if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
    showWorldNpcHoverLabel(npcHover.name, npcHover.anchorEl);
    return;
  }
  const sz = getSproutSizeForStage(st);
  if (
    hasGuideBook &&
    bagHasPlantableSeedsForHoverHint() &&
    worldBagInventory &&
    worldBagInventory.style.display !== "none"
  ) {
    const sr = worldBagInventory.getBoundingClientRect();
    const pad = 16;
    const overInv =
      clientX >= sr.left - pad &&
      clientX <= sr.right + pad &&
      clientY >= sr.top - pad &&
      clientY <= sr.bottom + pad;
    if (overInv) {
      worldBagInventory.classList.add("is-seed-inventory-hover-hint");
      if (plantHoverLabel) {
        plantHoverLabel.classList.remove("is-seed-inventory-hint");
        plantHoverLabel.style.display = "none";
        restorePlantHoverLabelToWorldDom();
      }
      return;
    }
  }
  const elapsed = now - Number(t0);
  if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
  return Math.min(1, elapsed / level5GrowMs);
  const plant = pickPlantForHoverFromPointerClient(clientX, clientY);
  if (plant) showPlantHoverSignForPlant(plant);
  else hidePlantHoverLabel();
}
  if (powderRatio !== null) return powderRatio;
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
  if (hasActiveGreenGrowthProgress(plant, now)) return false;
function getSproutImageForStage(stage) {
  if (stage >= 5) return sproutStage5Image;
  if (stage >= 4) return sproutStage4Image;
  if (stage >= 3) return sproutStage3Image;
  if (stage === 2) return sproutStage2Image;
  return sproutStage1Image;
}
const stage3CompleteMagicHint = "\uC131\uC7A5 \uC644\uB8CC, \uB354 \uD0A4\uC6B0\uB824\uBA74 \uB9C8\uBC95\uC758 \uAC00\uB8E8 \uD544\uC694.";
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
  const shouldShowWater = showWater !== false;
/** 4·5?계 ? PNG???? ??별도 spot)??겹쳐 보이?spot ?이?? ?다. */
function shouldHideSeparateSoilUnderBigGrass(plant) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) return false;
  return getSproutStageFromPlant(plant) >= 4;
}
  if (getPlantSoilBadStateTitle(plant)) {
/**
 * ? ?프?이??발밑???? ?plantBaseY ~ +PLANT_SPOT_HEIGHT)??맞춘??
 * 4·5?계??PNG ?단 ?백 ?문??world top-left 보정.
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
  }
/** ?버 ?벨: ???중심???니???제 ?싹/? ?프?이??기?(????서 ?치 ?긋??방?) */
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
  element.style.display = "block";
function getPlantGrowthRatio(plant, now) {
  if (!plant.growthStartedAt || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return null;
  if (plant.isSproutGrown) return 1;
  return Math.min(1, Math.max(0, (now - plant.growthStartedAt) / getPlantFirstGrowthDurationMs(plant)));
}
  plant.waterLevel = Math.max(0, Number(plant.waterLevel) || 0);
/** ?어 4?? ?동 ?장(가??음) 구간??초록 게이지 비율; ?당 ?으?null */
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
    if (now - updatedAt < tickMs) break;
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
  }
/** ?→?싹 ?는 ?싹 ?계 진행·가??장 ???드 초록 게이지가 채워지???*/
function hasActiveGreenGrowthProgress(plant, now) {
  const g1 = getPlantGrowthRatio(plant, now);
  if (g1 !== null && g1 < 1) return true;
  const g2 = getPlantSecondGrowthRatio(plant, now);
  if (g2 !== null && g2 < 1) return true;
  return false;
}
    plant.waterLevelUpdatedAt = now;
function isSproutStage3Or5IdleNoGrowth(plant, now) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const st = getSproutStageFromPlant(plant);
  if (st !== 3 && st !== 5) return false;
  if (hasActiveGreenGrowthProgress(plant, now)) return false;
  return true;
}
  if (plant.status === "rotten" || plant.isOverwatered) return "이미지/soil-rotten.png";
function shouldPauseWaterDecayForPlant(plant, now) {
  return isSproutStage3Or5IdleNoGrowth(plant, now);
}
}
const stage3CompleteMagicHint = "\uC131\uC7A5 \uC644\uB8CC, \uB354 \uD0A4\uC6B0\uB824\uBA74 \uB9C8\uBC95\uC758 \uAC00\uB8E8 \uD544\uC694.";
function getBagInventorySeedCount() {
function isStage3CompleteAwaitingMagicPowder(plant) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return false;
  }
  if (isPowderUpgradeInProgress(plant)) return false;
  return getSproutStageFromPlant(plant) === 3 && getNextPowderTargetTier(plant) > 0;
}
      extraSeed.id !== plantingInventorySeedId
function syncPlantCardWaterReadoutVisibility(showWater) {
  if (!plantWaterText || !plantWaterBar) return;
  const shouldShowWater = showWater !== false;
  plantWaterText.style.display = "";
  plantWaterText.classList.toggle("is-plant-card-hint", !shouldShowWater);
  plantWaterBar.style.display = shouldShowWater ? "grid" : "none";
}
    seed: getBagInventorySeedCount(),
function renderPlantCardForPlant(plant) {
  if (getPlantSoilBadStateTitle(plant)) {
    plantCard.style.display = "none";
    if (plantCardTitle) plantCardTitle.textContent = "";
    if (plantWaterText) {
      plantWaterText.textContent = "";
      plantWaterText.style.display = "none";
      plantWaterText.classList.remove("is-plant-card-hint");
    }
    if (plantWaterBar) plantWaterBar.style.display = "none";
    return;
  }
  const showMagicHint = isStage3CompleteAwaitingMagicPowder(plant);
  if (plantCardTitle) plantCardTitle.textContent = getPlantWorldLabel(plant);
  plantCard.classList.toggle("is-dry", plant.status === "dry");
  plantCard.classList.toggle("is-overwatered", plant.isOverwatered);
  if (showMagicHint) {
    plantWaterText.textContent = stage3CompleteMagicHint;
    syncPlantCardWaterReadoutVisibility(false);
    return;
  }
  const waterCapacity = getPlantWaterCapacity(plant);
  plantWaterText.textContent = "\uC218\uBD84\uD83D\uDCA7: " + plant.waterLevel + "/" + waterCapacity;
  plantWaterSegments.forEach(function (segment, index) {
    segment.style.display = index < waterCapacity ? "block" : "none";
    segment.classList.toggle("is-filled", index < plant.waterLevel);
  });
  syncPlantCardWaterReadoutVisibility(true);
}
    }
function updatePlantGrowthMeter(element, fill, x, y, firstRatio, secondRatio) {
  if (!element || !fill) return;
  const ratio = secondRatio !== null ? secondRatio : firstRatio;
  if (ratio === null || ratio >= 1) {
    element.style.display = "none";
    return;
  }
  if (itemKey === "overgrowthSeed") {
  element.style.display = "block";
  fill.style.width = Math.round(ratio * 100) + "%";
  setWorldPosition(element, x + PLANT_SPOT_WIDTH / 2 - 21, y - 24);
}
    return true;
function applyPlantWaterDecay(plant, now) {
  plant.waterLevel = Math.max(0, Number(plant.waterLevel) || 0);
  if (plant.waterLevel <= 0) {
    return;
  }
  let updatedAt = Number(plant.waterLevelUpdatedAt);
  // Number(null) === 0 ??would drain all water in one frame after snapshot parse.
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
      appleState.worldRockPickedIds.push(
function updateExtraPlantWaterLevel(plant, now) {
  if (plant.isOverwatered || plant.status === "dry" || plant.status === "rotten") {
    return;
  }
    saveAppleState();
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
          planted: false
  applyPlantWaterDecay(plant, now);
}
    }
function getPlantSoilSrc(plant) {
  if (plant.status === "rotten" || plant.isOverwatered) return "??지/soil-rotten.png";
  if (plant.status === "wet") return "??지/soil-wet.png";
  if (plant.status === "dry") return "??지/soil-dry.png";
  return "??지/tilled-soil.png";
}
      Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0)) + n;
function getBagInventorySeedCount() {
  if (usesWorldLooseSeedMode()) {
    return Math.max(0, Number(appleState.seedCount) || 0);
  }
  return appleState.extraSeeds.filter(function (extraSeed) {
    return (
      extraSeed.inInventory &&
      !extraSeed.planted &&
      extraSeed.id !== plantingInventorySeedId
    );
  }).length;
}
    updateMagicPowderInventoryUi();
function getBagInventoryCountsByKey() {
  return {
    book: hasGuideBookItemInBagCounts() ? 1 : 0,
    seed: getBagInventorySeedCount(),
    overgrowthSeed: Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0)),
    apple: Math.max(0, Number(appleState.count) || 0),
    rock: Math.max(0, appleState.worldRockPickedIds ? appleState.worldRockPickedIds.length : 0),
    magicPowder: Math.max(0, Math.floor(magicPowderCount) || 0),
    "butterfly:brown": Math.max(0, Number(butterflyState.caughtCounts.brown) || 0),
    "butterfly:yellow": Math.max(0, Number(butterflyState.caughtCounts.yellow) || 0),
    "butterfly:white": Math.max(0, Number(butterflyState.caughtCounts.white) || 0)
  };
}
  const normalized = normalizeBagInventoryOrderByCountsCore(
function removeOneBagItemForTrade(itemKey) {
  const counts = getBagInventoryCountsByKey();
  if (Number(counts[itemKey] || 0) <= 0) return false;
  if (itemKey === "rock") {
    if (!Array.isArray(appleState.worldRockPickedIds) || !appleState.worldRockPickedIds.length) {
      return false;
    }
    appleState.worldRockPickedIds.pop();
    updateBagInventorySlots();
    saveAppleState();
    return true;
  }
  if (itemKey === "seed") {
    if (usesWorldLooseSeedMode()) {
      if (appleState.seedCount <= 0) return false;
      appleState.seedCount = Math.max(0, appleState.seedCount - 1);
      updateBagInventorySlots();
      saveAppleState();
      return true;
    }
    const seedIndex = appleState.extraSeeds.findIndex(function (extraSeed) {
      return extraSeed.inInventory && !extraSeed.planted && extraSeed.id !== plantingInventorySeedId;
    });
    if (seedIndex < 0) return false;
    discardInventorySeed(appleState.extraSeeds[seedIndex].id);
    return true;
  }
  if (itemKey === "overgrowthSeed") {
    if ((Number(appleState.overgrowthSeedCount) || 0) <= 0) return false;
    appleState.overgrowthSeedCount = Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0) - 1);
    updateSeedInventory();
    saveAppleState();
    return true;
  }
  if (itemKey === "apple") {
    if (appleState.count <= 0) return false;
    appleState.count = Math.max(0, appleState.count - 1);
    updateSeedInventory();
    saveAppleState();
    return true;
  }
  if (itemKey === "magicPowder") {
    if (magicPowderCount <= 0) return false;
    magicPowderCount = Math.max(0, magicPowderCount - 1);
    updateMagicPowderInventoryUi();
    updateBagInventorySlots();
    saveMagicPowderCount();
    saveAppleState();
    return true;
  }
  return false;
}
  });
function addBagItemsForTrade(itemKey, amount) {
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  if (n <= 0) return;
  if (itemKey === "rock") {
    if (!Array.isArray(appleState.worldRockPickedIds)) appleState.worldRockPickedIds = [];
    for (let i = 0; i < n; i++) {
      appleState.worldRockPickedIds.push(
        "trade-ret-" + Date.now() + "-" + i + "-" + Math.random().toString(16).slice(2)
      );
    }
    updateBagInventorySlots();
    saveAppleState();
    return;
  }
  if (itemKey === "seed") {
    if (usesWorldLooseSeedMode()) {
      appleState.seedCount = Math.min(500, appleState.seedCount + n);
    } else {
      for (let i = 0; i < n; i++) {
        appleState.extraSeeds.push({
          id: "trade-seed-" + Date.now() + "-" + i,
          inInventory: true,
          planted: false
        });
      }
    }
    updateSeedInventory();
    saveAppleState();
    return;
  }
  if (itemKey === "overgrowthSeed") {
    appleState.overgrowthSeedCount =
      Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0)) + n;
    updateSeedInventory();
    saveAppleState();
    return;
  }
  if (itemKey === "apple") {
    appleState.count = Math.max(0, Number(appleState.count) || 0) + n;
    updateSeedInventory();
    saveAppleState();
    return;
  }
  if (itemKey === "magicPowder") {
    magicPowderCount = Math.max(0, Math.floor(magicPowderCount) || 0) + n;
    updateMagicPowderInventoryUi();
    updateBagInventorySlots();
    saveMagicPowderCount();
    saveAppleState();
    return;
  }
  if (itemKey === "worldBucket") {
    for (let i = 0; i < n; i++) {
      spawnWorldBucketBelowTradeMaster();
    }
  }
}
  saveAppleState();
function normalizeBagInventoryOrderByCounts(counts) {
  const normalized = normalizeBagInventoryOrderByCountsCore(
    bagInventoryItemOrder,
    bagInventoryCountsPrev,
    counts
  );
  bagInventoryItemOrder = normalized.order;
  bagInventoryCountsPrev = normalized.previousCounts;
  if (normalized.changed) saveBagInventoryOrder();
}
  element.src = "이미지/seed.png";
function updateBagInventorySlots() {
  if (!bagInventoryPanel) return;
  const counts = getBagInventoryCountsByKey();
  const seedCount = Number(counts.seed || 0);
  const looseVisible = usesWorldLooseSeedMode() && isWorldLooseSeedVisibleAt(Date.now());
  if (usesWorldLooseSeedMode() && seedCount <= 0 && !looseVisible) {
    hasShownFirstSeedFocus = false;
  }
  normalizeBagInventoryOrderByCounts(counts);
    plant.waterNeededElement &&
  const slots = Array.from(bagInventoryPanel.querySelectorAll(".bag-inventory-slot")).sort(function (a, b) {
    return Number(a.dataset.slot || 0) - Number(b.dataset.slot || 0);
  });
  slots.forEach(function (slot, index) {
    const itemKey = bagInventoryItemOrder[index] || "";
    if (!itemKey) {
      slot.dataset.bagType = "empty";
      delete slot.dataset.butterflyColor;
      slot.removeAttribute("data-ovc-tip");
      slot.removeAttribute("aria-label");
      slot.classList.add("bag-inventory-slot--empty");
      slot.classList.add("is-empty");
      slot.innerHTML = "";
      return;
    }
    const descriptor = getBagItemDescriptorCore(itemKey);
    const itemCount = Math.max(0, Number(counts[itemKey] || 0));
    slot.dataset.bagType = descriptor.bagType;
    if (descriptor.label) {
      slot.setAttribute("data-ovc-tip", descriptor.label);
      slot.setAttribute("aria-label", descriptor.label);
    } else {
      slot.removeAttribute("data-ovc-tip");
      slot.removeAttribute("aria-label");
    }
    if (descriptor.butterflyColor) {
      slot.dataset.butterflyColor = descriptor.butterflyColor;
    } else {
      delete slot.dataset.butterflyColor;
    }
    slot.classList.remove("bag-inventory-slot--empty");
    slot.classList.toggle("is-empty", itemCount <= 0);
    slot.innerHTML = descriptor.iconHtml + '<span class="bag-slot-count">' + itemCount + "</span>";
  });
  const waterNeededElement = document.createElement("img");
  if (bagInventoryPanel) {
    const powderUsable = magicPowderCount > 0 && isMagicPowderUsableNow();
    bagInventoryPanel.querySelectorAll('.bag-inventory-slot[data-bag-type="magicPowder"]').forEach(
      function (slot) {
        slot.classList.toggle("is-magic-powder-usable", powderUsable);
        if (powderUsable) {
          slot.setAttribute("data-ovc-tip", "\uB9C8\uBC95\uC758 \uAC00\uB8E8 \u00B7 \uC0AC\uC6A9 click");
        } else if (magicPowderCount > 0) {
          slot.setAttribute("data-ovc-tip", "\uB9C8\uBC95\uC758 \uAC00\uB8E8");
        }
      }
    );
  }
}
function createPlantGrowthMeter() {
function updateSeedInventory() {
  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.inventoryElement) {
      extraSeed.inventoryElement.remove();
      extraSeed.inventoryElement = undefined;
      extraSeed.inventoryImage = undefined;
    }
  });
  updateBagInventorySlots();
}
  document.querySelectorAll(".extra-seed, .extra-plant-spot, .extra-sprout, .extra-water-needed, .plant-growth-meter").forEach(
function discardInventorySeed(seedId) {
  const seedIndex = appleState.extraSeeds.findIndex(function (extraSeed) {
    return extraSeed.id === seedId;
  });
  if (seedIndex < 0) return;
  worldLooseSeedElement = null;
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
  if (p.growthMeterElement && p.growthMeterElement.isConnected) p.growthMeterElement.remove();
  appleState.extraSeeds.splice(seedIndex, 1);
  saveAppleState();
  updateSeedInventory();
}
  p.growthMeterFill = undefined;
function ensureExtraSeedElement(extraSeed) {
  if (extraSeed.element && document.contains(extraSeed.element)) return;
  if (extraSeed.element) extraSeed.element = undefined;
  const pid = "plant-" + String(seedId);
  const element = document.createElement("img");
  element.className = "extra-seed";
  element.alt = "extra seed";
  element.src = "??지/seed.png";
  setWorldSize(element, SEED_SIZE);
  ground.appendChild(element);
  extraSeed.element = element;
}
    if (!p || p.id == null || p.removed) return;
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
function updateBucketPosition() {
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
      addBucketTrace("stale", "clear holder=" + holderId + " age=" + (Date.now() - lastUpdateAt), 0);
  const spotElement = document.createElement("img");
  spotElement.className = "extra-plant-spot";
  spotElement.alt = "extra plant spot";
  spotElement.src = "??지/tilled-soil.png";
  setWorldSize(spotElement, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
  ground.appendChild(spotElement);
    remotePlayer.element.classList.remove("is-carrying-bucket");
  const sproutElement = document.createElement("img");
  sproutElement.className = "extra-sprout";
  sproutElement.alt = "extra sprout";
  sproutElement.src = "??지/sprout.png";
  setWorldSize(sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  ground.appendChild(sproutElement);
    bucketX = handPosition.x;
  const waterNeededElement = document.createElement("img");
  waterNeededElement.className = "extra-water-needed";
  waterNeededElement.alt = "water needed";
  waterNeededElement.src = "??지/water-needed.png";
  setWorldSize(waterNeededElement, WATER_NEEDED_SIZE);
  ground.appendChild(waterNeededElement);
  } else if (isBucketHeldByRemotePlayer) {
  plant.spotElement = spotElement;
  plant.sproutElement = sproutElement;
  plant.waterNeededElement = waterNeededElement;
  const growthMeter = createPlantGrowthMeter();
  plant.growthMeterElement = growthMeter.element;
  plant.growthMeterFill = growthMeter.fill;
}
  } else {
function createPlantGrowthMeter() {
  const element = document.createElement("div");
  const fill = document.createElement("div");
  element.className = "plant-growth-meter";
  fill.className = "plant-growth-meter-fill";
  element.appendChild(fill);
  ground.appendChild(element);
  return { element, fill };
}
    bucketX = wellX - bucketSize.width - 8;
function clearExtraSeedAndPlantElements() {
  document.querySelectorAll(".extra-seed, .extra-plant-spot, .extra-sprout, .extra-water-needed, .plant-growth-meter").forEach(
    function (element) {
      if (element === mainPlantGrowthMeter.element) return;
      element.remove();
    }
  );
  worldLooseSeedElement = null;
}
          : isBucketHeldByRemotePlayer
function invalidateGroundSeedElementRefsOnly(seeds) {
  if (!Array.isArray(seeds)) return;
  seeds.forEach(function (s) {
    if (!s) return;
    s.element = undefined;
  });
}
          "[bucket:render] mode=" +
/** 공유 ?냅?? ???앗 ?드??거(?물/게이지????·?연결로 깜빡??방?) */
function clearGroundExtraSeedElementsOnly() {
  document.querySelectorAll(".extra-seed:not(.world-loose-seed)").forEach(function (element) {
    element.remove();
  });
}
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
  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) {
function extraSeedHasCorrespondingExtraPlant(seedId, plants) {
  const pid = "plant-" + String(seedId);
  return plants.some(function (p) {
    return p && !p.removed && String(p.id) === pid;
  });
}
  if (isWorldChatBlockingGameInput()) {
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
  bucket.src = isBucketFull ? "??지/bucket-full.png" : "??지/bucket-empty.png";
  playerBucketOverlay.style.backgroundImage =
    'url("' + (isBucketFull ? "??지/bucket-full.png" : "??지/bucket-empty.png") + '")';
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
  if (keys.ArrowRight || keys.d) {
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.element) return;
    remotePlayer.element.classList.remove("is-carrying-bucket");
  });

  if (heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
  let shouldClampToTree = isInTree;
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
    isOnGround = true;
  if (bucket.style.display === "block" && (!Number.isFinite(bucketX) || !Number.isFinite(bucketY))) {
    const bucketSize = getBucketSize();
    bucketX = wellX - bucketSize.width - 8;
    bucketY = wellY + WELL_SIZE - bucketSize.height;
  }
      shouldClampToTree = false;
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
  updateWorldExtraBuckets();
}
  }
function updatePlayerPosition() {
  if (isCharacterSelecting || !hasSpawnedCharacter) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }

  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }
    const eps = 0.35;
  if (isWorldChatBlockingGameInput()) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    return;
  }
      } else {
  const nowMs = performance.now();
  if (lastMovementTickMs <= 0) {
    lastMovementTickMs = nowMs - 1000 / MOVEMENT_REFERENCE_HZ;
  }
  let dtSec = (nowMs - lastMovementTickMs) / 1000;
  lastMovementTickMs = nowMs;
  dtSec = Math.min(MOVEMENT_DT_CAP_SEC, Math.max(0, dtSec));
  const frameScale = dtSec * MOVEMENT_REFERENCE_HZ;
    if (!isPlayerCollidingVisibleWorldRockForPose(previousPlayerX, playerDepth, jumpY)) {
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
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  if (keys.ArrowLeft || keys.a) {
    playerX -= speedSide * frameScale;
  }

  if (keys.ArrowRight || keys.d) {
    playerX += speedSide * frameScale;
  }
  return (
  if (playerX < 0) playerX = 0;
  if (playerX > maxX) playerX = maxX;
    footY >= wellY + WELL_SIZE * 0.55 &&
  const isInCanopy = isPlayerInTreeCanopy();
  const isNearTrunk = isPlayerNearTreeTrunk();
  const isInTree = !isTreeFalling && (isInCanopy || isNearTrunk);
  let shouldClampToTree = isInTree;
function updatePlayerColorBodyPosition() {
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
  return player.offsetHeight || PLAYER_HEIGHT;
    const wantsTreeDown = keys.ArrowDown || keys.s;
    const isAtTreeBase = !isInCanopy && playerDepth <= groundMaxDepth + treeClimbSpeed * frameScale + 2;
    if (wantsTreeDown && isAtTreeBase) {
      playerDepth -= speed * frameScale;
      shouldClampToTree = false;
      wasPlayerInTree = false;
    } else if (keys.ArrowUp || keys.w) {
      movePlayerVerticallyInTree(treeClimbSpeed * frameScale);
    } else if (wantsTreeDown) {
      movePlayerVerticallyInTree(-treeClimbSpeed * frameScale);
    }
  } else {
    if (keys.ArrowUp || keys.w) {
      playerDepth += speed * frameScale;
    }
    BIG_TREE_Y +
    if (keys.ArrowDown || keys.s) {
      playerDepth -= speed * frameScale;
    }
    velocityY += gravity * frameScale;
    jumpY += velocityY * frameScale;
  }
    left: playerX + feetInset,
  if (playerDepth < getMinGroundedPlayerDepth()) {
    playerDepth = getMinGroundedPlayerDepth();
  }
  // Do not hard-snap to ground depth here; if the player is above ground and
  // outside tree support we want a smooth fall, not an instant teleport.
  const rootsRect = {
  if (shouldClampToTree) {
    clampPlayerToTreeOutline();
  }
    bottom: rootsBottom
  if (jumpY > 0) {
    jumpY = 0;
    velocityY = 0;
    isOnGround = true;
    isTreeFalling = false;
  }
    return true;
  if (isPlayerInWellWaterArea()) {
    playerX = previousPlayerX;
    playerDepth = previousPlayerDepth;
    jumpY = previousJumpY;
  } else if (isPlantFogMovementClampActive()) {
    const clearRect = getPlantFogClearRectForMovementClamp();
    const eps = 0.35;
    if (!isPlayerHeadFogClearForPose(playerX, playerDepth, jumpY, clearRect, eps)) {
      if (isPlayerHeadFogClearForPose(previousPlayerX, playerDepth, jumpY, clearRect, eps)) {
        playerX = previousPlayerX;
      } else if (isPlayerHeadFogClearForPose(playerX, previousPlayerDepth, previousJumpY, clearRect, eps)) {
        playerDepth = previousPlayerDepth;
        jumpY = previousJumpY;
      } else {
        playerX = previousPlayerX;
        playerDepth = previousPlayerDepth;
        jumpY = previousJumpY;
      }
    }
  }

  if (isPlayerCollidingVisibleWorldRockForPose(playerX, playerDepth, jumpY)) {
    if (!isPlayerCollidingVisibleWorldRockForPose(previousPlayerX, playerDepth, jumpY)) {
      playerX = previousPlayerX;
    } else if (!isPlayerCollidingVisibleWorldRockForPose(playerX, previousPlayerDepth, previousJumpY)) {
      playerDepth = previousPlayerDepth;
      jumpY = previousJumpY;
    } else {
      playerX = previousPlayerX;
      playerDepth = previousPlayerDepth;
      jumpY = previousJumpY;
    }
  }
function isPlayerSupportedByTree() {
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  wasPlayerInTree = shouldClampToTree || (isTreeFalling && playerDepth > groundMaxDepth);
}
  playerDepth += deltaDepth;
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
  const target = Math.max(minD, Math.min(maxD, playerDepth));
function updatePlayerColorBodyPosition() {
  // Keep legacy overlay disabled; color is rendered directly on #player image.
  playerColorBody.style.display = "none";
  if (!hasSpawnedCharacter || player.classList.contains("is-hidden-before-spawn")) return;
}
    playerDepth = target;
function getMaxGroundedPlayerDepth() {
  return GROUND_WORLD_HEIGHT - groundFootInset;
}
function getPlayerWorldY() {
function getMinGroundedPlayerDepth() {
  return 0;
}
function startPlanting() {
function getMaxTreePlayerDepth() {
  return GROUND_WORLD_HEIGHT - TREE_CANOPY_TOP - 2;
}
    flashOnboardingOrderHint("");
function getMinTreePlayerDepth() {
  return getMaxGroundedPlayerDepth();
}
  if (heldItem !== HELD_ITEM_SEED || plantRuntime.isPlanting || !isOnGround || plantRuntime.isSeedDry) return;
function getPlayerRenderedHeight() {
  return player.offsetHeight || PLAYER_HEIGHT;
}
  const spotHeight = PLANT_SPOT_HEIGHT;
function getPlayerCenterX() {
  return playerX + PLAYER_WIDTH / 2;
}
  if (!canPlantAt(targetPlantSpotX, targetPlantSpotY)) {
function getPlayerFootY() {
  return GROUND_WORLD_HEIGHT - playerDepth + jumpY;
}
    }
function isPlayerNearTreeTrunk() {
  if (isTreeFalling) return false;
  const centerX = getPlayerCenterX();
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
  const hPad = 1;
  const rootsRect = {
    left: BIG_TREE_X + TREE_CSS_ROOTS_LEFT - hPad,
    right: BIG_TREE_X + TREE_CSS_ROOTS_LEFT + TREE_CSS_ROOTS_WIDTH + hPad,
    top: rootsTop,
    bottom: rootsBottom
  };
  if (
    centerX >= rootsRect.left &&
    centerX <= rootsRect.right &&
    isOverlappingRect(feetRect, rootsRect)
  ) {
    return true;
  }
  const trunkRect = {
    left: TREE_TRUNK_X - hPad,
    right: TREE_TRUNK_X + TREE_TRUNK_WIDTH + hPad,
    top: TREE_TRUNK_TOP - 22,
    bottom: rootsBottom
  };
  return (
    centerX >= trunkRect.left &&
    centerX <= trunkRect.right &&
    isOverlappingRect(feetRect, trunkRect)
  );
}
      saveAppleState();
function isPlayerInTreeSpace() {
  return (
    !isTreeFalling &&
    (isPlayerNearTreeTrunk() || isPlayerInTreeCanopy())
  );
}
    plantRuntime.isSeedPlanted = true;
function isPlayerInTreeCanopy() {
  const centerX = getPlayerCenterX();
  const footY = getPlayerFootY();
    plantRuntime.waterLevel = 1;
  return (
    centerX >= TREE_CANOPY_LEFT &&
    centerX <= TREE_CANOPY_RIGHT &&
    footY >= TREE_CANOPY_TOP &&
    footY <= TREE_CANOPY_BOTTOM
  );
}
    plantRuntime.isSproutGrown = false;
function isPlayerSupportedByTree() {
  return !isTreeFalling && (isPlayerNearTreeTrunk() || isPlayerInTreeCanopy());
}
    plantRuntime.isSproutSelfSustaining = false;
function movePlayerVerticallyInTree(deltaDepth) {
  playerDepth += deltaDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  isTreeFalling = false;
  clampPlayerToTreeOutline();
}
    ensureGrassOrdinalIfNeeded(plantRuntime);
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
}
function getPlayerWorldY() {
  return -playerDepth + jumpY;
}
    flashOnboardingOrderHint("");
function startPlanting() {
  updateSeedDryState();
  const extraSeed = getHeldExtraSeed();
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== 7) {
    flashOnboardingOrderHint("");
    return;
  }
  const playerBox = getPlayerBox();
  if (heldItem !== HELD_ITEM_SEED || plantRuntime.isPlanting || !isOnGround || plantRuntime.isSeedDry) return;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;
  const playerBox = getPlayerBox();
  const spotWidth = PLANT_SPOT_WIDTH;
  const spotHeight = PLANT_SPOT_HEIGHT;
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
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
    ensureGrassOrdinalIfNeeded(newPlant);
  window.setTimeout(function () {
    const plantedAt = getSharedPlantSimulationNow();
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    const spotX = plantRuntime.spotX;
    const spotY = plantRuntime.spotY;
  }, plantActionMs);
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
      newPlant.waterLevel = 1;
      newPlant.waterLevelUpdatedAt = plantedAt;
      newPlant.needsFirstWater = false;
      newPlant.growthStartedAt = plantedAt;
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
      updatePlayerStatus();
    plantRuntime.isSeedPlanted = true;
    plantRuntime.lastWateredAt = null;
    plantRuntime.wateredAtList = [];
    plantRuntime.status = "normal";
    plantRuntime.waterLevel = 1;
    plantRuntime.waterLevelUpdatedAt = plantedAt;
    plantRuntime.becameEmptyAt = null;
    plantRuntime.isOverwatered = false;
    plantRuntime.rottenAt = null;
    plantRuntime.needsFirstWater = false;
    plantRuntime.growthStartedAt = plantedAt;
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
    plantRuntime.seedKind = "";
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
      plantRuntime.growthTier = 0;
function startPlantingExtraSeed() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
    flashOnboardingOrderHint("");
    return;
  }
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed || plantRuntime.isPlanting || !isOnGround) {
    return;
  }
      plantRuntime.drySoilAt = null;
  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;
      updateNpcPosition();
  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    return;
  }
      ensureGrassOrdinalIfNeeded(invPlant);
  heldItem = null;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  sendMultiplayerPresence(true);
    }
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
  ) {
  if (
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isNpcDialogueRunning ||
    !isOnGround
  ) {
    updateSeedInventory();
    return;
  }
  if (!canPlantAt(plantX, plantY)) {
  const syntheticId = "w-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;
    updateSeedInventory();
  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    updateSeedInventory();
    return;
  }
  sendMultiplayerPresence(true);
  plantingInventorySeedId = syntheticId;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);
      Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0) - 1);
  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    appleState.seedCount = Math.max(0, appleState.seedCount - 1);
      plantRuntime.isSeedPlanted = true;
    if (!plantRuntime.isSeedPlanted) {
      const plantedAt = getSharedPlantSimulationNow();
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = null;
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 1;
      plantRuntime.waterLevelUpdatedAt = plantedAt;
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.rottenAt = null;
      plantRuntime.needsFirstWater = false;
      plantRuntime.growthStartedAt = plantedAt;
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
      plantRuntime.seedKind = "";
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
    saveAppleState();
    playerStatus.textContent = "";
    updateSeedInventory();
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }, plantActionMs);
}
  });
function plantWorldOvergrowthSeedCount() {
  if ((Number(appleState.overgrowthSeedCount) || 0) <= 0) {
    updateSeedInventory();
    return;
  }
      updateSeedInventory();
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 25) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }
      return;
  if (
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isNpcDialogueRunning ||
    !isOnGround
  ) {
    updateSeedInventory();
    return;
  }
    isNpcDialogueRunning ||
  const syntheticId = "og-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const playerBox = getPlayerBox();
  const plantX = playerBox.left + playerBox.width / 2 - PLANT_SPOT_WIDTH / 2;
  const plantY = playerBox.bottom - PLANT_SPOT_HEIGHT / 2;
  }
  if (!canPlantAt(plantX, plantY)) {
    if (lastPlantProximityBlockMessage) {
      flashPlantProximityWarning(lastPlantProximityBlockMessage);
      updatePlayerStatus();
    }
    updateSeedInventory();
    return;
  }
      updatePlayerStatus();
  plantingInventorySeedId = syntheticId;
  plantRuntime.isPlanting = true;
  playerStatus.textContent = "\uACFC\uC131\uC7A5 \uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);
  plantRuntime.isPlanting = true;
  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    appleState.overgrowthSeedCount =
      Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0) - 1);
    plantRuntime.isPlanting = false;
    if (!plantRuntime.isSeedPlanted) {
      const plantedAt = getSharedPlantSimulationNow();
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = null;
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 1;
      plantRuntime.waterLevelUpdatedAt = plantedAt;
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.rottenAt = null;
      plantRuntime.needsFirstWater = false;
      plantRuntime.growthStartedAt = plantedAt;
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
      plantRuntime.seedKind = "overgrowth";
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
      invPlant.seedKind = "overgrowth";
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
  return {
function plantInventorySeed(seedId) {
  const inventorySeed = appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === seedId;
  });
    lastWateredAt: null,
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
    isSproutSelfSustaining: false,
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
    blockSproutRegrowthAfterDry: false,
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
}
  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    inventorySeed.planted = true;
    inventorySeed.inInventory = false;

    if (!plantRuntime.isSeedPlanted) {
      const plantedAt = getSharedPlantSimulationNow();
      plantRuntime.spotX = plantX;
      plantRuntime.spotY = plantY;
      plantRuntime.isSeedPlanted = true;
      plantRuntime.lastWateredAt = null;
      plantRuntime.wateredAtList = [];
      plantRuntime.status = "normal";
      plantRuntime.waterLevel = 1;
      plantRuntime.waterLevelUpdatedAt = plantedAt;
      plantRuntime.becameEmptyAt = null;
      plantRuntime.isOverwatered = false;
      plantRuntime.rottenAt = null;
      plantRuntime.needsFirstWater = false;
      plantRuntime.growthStartedAt = plantedAt;
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
      plantRuntime.seedKind = "";
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
  const oid = String(ownerId || "").trim();
    playerStatus.textContent = "";
    updateSeedInventory();
    saveAppleState();
  }, plantActionMs);
}
  if (!oid && !oname && !pid && !pname) return true;
function createExtraPlant(id, x, y) {
  const now = getSharedPlantSimulationNow();
  return {
    id,
    x,
    y,
    plantedAt: now,
    lastWateredAt: null,
    wateredAtList: [],
    status: "normal",
    waterLevel: 1,
    waterLevelUpdatedAt: now,
    becameEmptyAt: null,
    isOverwatered: false,
    rottenAt: null,
    needsFirstWater: false,
    growthStartedAt: now,
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
    seedKind: "",
    ownerUserId: "",
    ownerDisplayName: "",
    soilOrdinal: 0,
    sproutOrdinal: 0,
    grassOrdinal: null,
    blockSproutRegrowthAfterDry: false,
    drySoilAt: null
  };
}
/** 살아 있는 식물만, 심은 시각 기준: 새싹(티어 4 미만)과 풀(티어 4 이상)을 소유자별로 따로 번호 부여. */
function getPlanterOwnerId() {
  return String(currentUserId || "").trim();
}
    plant.sproutOrdinal = 0;
function getPlanterDisplayName() {
  const n = String(currentUserName || "").trim();
  return n || "\uD50C\uB808\uC774\uC5B4";
}

function getLocalExtraSeedOwnerUserId() {
  return String(currentUserId || "").trim();
}
    const tier = Math.max(0, Number(plant.growthTier) || 0);
function getLocalExtraSeedOwnerSessionId() {
  return String(currentSessionId || "").trim();
}
    }
function assignExtraSeedInventoryOwner(seed) {
  if (!seed) return;
  seed.ownerUserId = getLocalExtraSeedOwnerUserId();
  seed.ownerSessionId = getLocalExtraSeedOwnerSessionId();
}
      groups[k].grasses.push(entry);
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
    });
/** ?냅??병합: ?유??비어 ?으?false(?원 로컬?취급?? ?음) ???격 ?거? 충돌 ???령 ?앗 ?제 */
function isOvergrowthSeedPlant(plant) {
  return String(plant && plant.seedKind || "") === "overgrowth";
}
      e.plant.sproutOrdinal = i + 1;
function makePlantStableStage3FromOvergrowthSeed(plant, now) {
  if (!isOvergrowthSeedPlant(plant)) return false;
  plant.isSproutGrown = true;
  plant.sproutGrownAt = now;
  plant.sproutEvolutionMs = sproutStage1Ms + sproutStage2GrowMs;
  plant.sproutEvolutionLastTickAt = now;
  plant.isSproutSelfSustaining = true;
  plant.growthTier = Math.max(Number(plant.growthTier) || 0, 3);
  plant.waterCapacity = 3;
  plant.waterLevel = Math.min(3, Math.max(Number(plant.waterLevel) || 0, 2));
  plant.becameEmptyAt = null;
  plant.status = "normal";
  plant.needsFirstWater = false;
  return true;
}
}
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
  if (plant.status === "rotten" || plant.isOverwatered) {
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
  const sproutOrd = Math.max(0, Number(plant.sproutOrdinal) || 0);
function isPlantAliveForWorldOrdinal(plant) {
  return (
    plant &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered
  );
}
      }
function plantOrdinalGroupKey(plant) {
  return (
    String(plant.ownerUserId || "").trim() +
    "\u0001" +
    String(plant.ownerDisplayName || "").trim()
  );
}
  if (tier >= 4 && grassOrd > 0) {
function plantWorldOrdinalSortTime(plant) {
  const a = Number(plant.plantedAt) || 0;
  if (a > 0) return a;
  return Number(plant.growthStartedAt) || 0;
}
  if (sproutOrd > 0) {
/** 브라?? 기본 title(지?? ???CSS data-ovc-tip?로 바로 ?는 ?명 */
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
  return null;
/** ?아 ?는 ?물? ?? ?각 기?: ?싹(?어 4 미만)??(?어 4 ?상)???유?별??로 번호 부?? */
function refreshPlantIdentityOrdinals() {
  function clearOrdinals(plant) {
    if (!plant) return;
    plant.sproutOrdinal = 0;
    plant.grassOrdinal = null;
  }
  clearOrdinals(plantRuntime);
  appleState.extraPlants.forEach(clearOrdinals);
    plantHoverLabel.classList.remove("is-well-dock");
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
  plantHoverLabel.style.left = "";
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
  const lw = groundScreenPxToWorldX(plantHoverLabel.offsetWidth || 28);
function assignSproutIdentityToNewPlant(plant) {
  const oid = getPlanterOwnerId();
  const oname = getPlanterDisplayName();
  plant.ownerUserId = oid;
  plant.ownerDisplayName = oname;
  plant.soilOrdinal = 0;
  plant.sproutOrdinal = 0;
  plant.grassOrdinal = null;
}
    top: y,
function ensureGrassOrdinalIfNeeded(plant) {
  void plant;
}
}
function getPlantSoilBadStateTitle(plant) {
  if (!plant) return "";
  if (plant.status === "dry") {
    return "\uB9C8\uB978\uB545";
  }
  if (plant.status === "rotten" || plant.isOverwatered) {
    return "\uC339\uC740\uB545";
  }
  return "";
}
function plantSpotOverlapsExpandedRect(plantX, plantY, ox, oy, ow, oh, pad) {
function getPlantWorldLabel(plant) {
  if (!plant) return "";
  if (getPlantSoilBadStateTitle(plant)) return "";
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
  const code = ch.charCodeAt(0);
function extraPlantFromDomElement(el) {
  for (let i = 0; i < appleState.extraPlants.length; i++) {
    const p = appleState.extraPlants[i];
    if (!p) continue;
    if (p.spotElement === el || p.sproutElement === el) return p;
  }
  return null;
}
function getPlantProximityBlockMessage(plantX, plantY) {
function clearPlantHoverVisuals() {
  if (ground) {
    ground
      .querySelectorAll(".is-plant-hover, .is-plant-hover-needs-water, .is-plant-water-clickable")
      .forEach(function (el) {
        el.classList.remove("is-plant-hover", "is-plant-hover-needs-water", "is-plant-water-clickable");
        el.style.cursor = "";
      });
  }
}
    return plantProximityPhraseForNoun("\uC6B0\uBB3C");
function getPlantHoverDomElements(plant) {
  const els = [];
  if (!plant) return els;
  if (plant === plantRuntime) {
    if (plantSpot && plantSpot.style.display !== "none") els.push(plantSpot);
    if (sprout && sprout.style.display !== "none") els.push(sprout);
    return els;
  }
  if (plant.spotElement && plant.spotElement.style.display !== "none") {
    els.push(plant.spotElement);
  }
  if (plant.sproutElement && plant.sproutElement.style.display !== "none") {
    els.push(plant.sproutElement);
  }
  return els;
}

function getPlayerDistanceToPlant(plant) {
  const anchor = getPlantWorldAnchorXY(plant);
  if (!anchor) return Infinity;
  const footY = GROUND_WORLD_HEIGHT - playerDepth + jumpY;
  return getCenterDistance(
    playerX,
    footY,
    PLAYER_WIDTH,
    8,
    anchor.x,
    anchor.y,
    PLANT_SPOT_WIDTH,
    PLANT_SPOT_HEIGHT
  );
}
  }
function isPlayerNearPlantWorld(plant) {
  return getPlayerDistanceToPlant(plant) <= plantWaterDistance;
}
    guideBook &&
function canWaterPlantByClick(plant) {
  if (!plant) return false;
  if (plant === plantRuntime && !plantRuntime.isSeedPlanted) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) {
    return false;
  }
  if (shouldSuppressPlantWaterCardForSelfSustaining(plant)) return false;
  return true;
}
    )
function plantShowsThirstyHoverEmphasis(plant) {
  if (!canWaterPlantByClick(plant)) return false;
  if (!isPlayerNearPlantWorld(plant)) return false;
  const cap = getPlantWaterCapacity(plant);
  return (Number(plant.waterLevel) || 0) < cap;
}
    if (plantSpotOverlapsExpandedRect(plantX, plantY, npcX, npcY, NPC_WIDTH, NPC_HEIGHT, npcPad)) {
function plantToWateringTarget(plant) {
  if (plant === plantRuntime) {
    return { type: "main", plant: plantRuntime };
  }
  return { type: "extra", plant: plant };
}
      plantSpotOverlapsExpandedRect(
function applyPlantHoverVisuals(plant) {
  clearPlantHoverVisuals();
  if (!plant) return;
  const thirsty = plantShowsThirstyHoverEmphasis(plant);
  const clickable =
    heldItem === HELD_ITEM_BUCKET &&
    isBucketFull &&
    canWaterPlantByClick(plant) &&
    isPlayerNearPlantWorld(plant);
  getPlantHoverDomElements(plant).forEach(function (el) {
    el.classList.add("is-plant-hover");
    if (thirsty) el.classList.add("is-plant-hover-needs-water");
    if (clickable) {
      el.classList.add("is-plant-water-clickable");
      el.style.cursor = "pointer";
    }
  });
}
        ALCHEMY_MASTER_START_X,
function hidePlantHoverLabel() {
  if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
  clearPlantHoverVisuals();
  if (plantHoverLabel) {
    plantHoverLabel.classList.remove(
      "is-seed-inventory-hint",
      "is-stage3-complete",
      "is-ui-shortcut-hint",
      "is-world-npc-name",
      "is-well-dock",
      "is-plant-world-sign"
    );
    plantHoverLabel.textContent = "";
    plantHoverLabel.style.position = "";
    plantHoverLabel.style.left = "";
    plantHoverLabel.style.top = "";
    plantHoverLabel.style.right = "";
    plantHoverLabel.style.zIndex = "";
    plantHoverLabel.style.transform = "";
    plantHoverLabel.style.display = "none";
    restorePlantHoverLabelToWorldDom();
  }
}
      plantX,
function showPlantHoverSignForPlant(plant) {
  if (!plantHoverLabel || !plant) return;
  restorePlantHoverLabelToWorldDom();
  const anchor = getPlantWorldAnchorXY(plant);
  if (!anchor) return;
  const label = getPlantWorldLabel(plant);
  if (!String(label || "").trim()) {
    hidePlantHoverLabel();
    return;
  }
  appleState.extraSeeds.forEach(function (extraSeed) {
  plantHoverLabel.classList.remove(
    "is-ui-shortcut-hint",
    "is-seed-inventory-hint",
    "is-well-dock",
    "is-world-npc-name",
    "is-stage3-complete"
  );
  plantHoverLabel.classList.add("is-plant-world-sign");
  plantHoverLabel.style.position = "absolute";
  plantHoverLabel.style.left = "";
  plantHoverLabel.style.top = "";
  plantHoverLabel.style.right = "";
  plantHoverLabel.style.transform = "";
  plantHoverLabel.style.zIndex = "85";
  if (heldItem !== HELD_ITEM_BUCKET && bucket && bucket.style.display === "block") {
  plantHoverLabel.textContent = "";
  const titleEl = document.createElement("div");
  titleEl.className = "plant-world-sign-title";
  titleEl.textContent = label;
  plantHoverLabel.appendChild(titleEl);
  }
  const badTitle = getPlantSoilBadStateTitle(plant);
  const detailEl = document.createElement("div");
  detailEl.className = "plant-world-sign-water";
  if (badTitle) {
    detailEl.textContent = badTitle;
  } else if (isStage3CompleteAwaitingMagicPowder(plant)) {
    detailEl.classList.add("is-magic-hint");
    detailEl.textContent = stage3CompleteMagicHint;
  } else {
    const waterCapacity = getPlantWaterCapacity(plant);
    detailEl.textContent =
      "\uC218\uBD84\uD83D\uDCA7: " +
      (Number(plant.waterLevel) || 0) +
      "/" +
      waterCapacity;
  }
  plantHoverLabel.appendChild(detailEl);
  function overlap(ax1, ay1, ax2, ay2) {
  plantHoverLabel.style.display = "flex";
  void plantHoverLabel.offsetWidth;
  const lw = groundScreenPxToWorldX(plantHoverLabel.offsetWidth || 36);
  const lh = groundScreenPxToWorldY(plantHoverLabel.offsetHeight || 18);
  const lx = anchor.x + PLANT_SPOT_WIDTH / 2 - lw / 2;
  const ly = anchor.y - lh - 3;
  setWorldPosition(plantHoverLabel, lx, ly);
  applyPlantHoverVisuals(plant);
}
      TREE_CANOPY_BOTTOM - canopyInset
function tryWaterPlantByPointerClick(clientX, clientY) {
  if (heldItem !== HELD_ITEM_BUCKET || !isBucketFull) return false;
  if (plantRuntime.isPlanting || appleState.isEating || isNpcDialogueRunning) return false;
  if (isTradeExchangeOpen()) return false;
  if (isOnboardingLinearGateActive() && !onboardingAllowsBucketQUse()) {
    flashOnboardingOrderHint("");
    return false;
  }
  /** 줄기·뿌리가 그려진 높이만 막음(이전엔 trunkBottom이 지면 끝까지 가서 같은 x열 전체 y에서 심기 불가였음) */
  const plant = pickPlantForHoverFromPointerClient(clientX, clientY);
  if (!plant || !canWaterPlantByClick(plant)) return false;
  if (!isPlayerNearPlantWorld(plant)) return false;
    return true;
  const target = plantToWateringTarget(plant);
  const anchor = getPlantWorldAnchorXY(plant);
  if (
    !getStoredFlag(onboardingFlowDoneKey) &&
    onboardingFlowStep === 14 &&
    target.type === "main"
  ) {
    onboardingFlowStep = 15;
    persistOnboardingStep();
  }
  waterPlant(target);
  if (anchor) {
    createWaterSplashAt(anchor.x + PLANT_SPOT_WIDTH / 2, anchor.y + PLANT_SPOT_HEIGHT * 0.55, null);
  } else {
    triggerWaterSplash();
  }
  isBucketFull = false;
  markWorldDirty();
  broadcastBucketState(false);
  syncWorldState(true);
  updateBucketPosition();
  updatePlantState();
  updateExtraSeedsAndPlants();
  return true;
}
  if (plantRuntime.isSeedPlanted) {
function plantProximityRectFromXYWH(x, y, w, h) {
  return {
    left: x,
    top: y,
    right: x + w,
    bottom: y + h
  };
}
  }
function plantProximityExpandRect(r, pad) {
  return {
    left: r.left - pad,
    top: r.top - pad,
    right: r.right + pad,
    bottom: r.bottom + pad
  };
}
    });
function plantSpotOverlapsExpandedRect(plantX, plantY, ox, oy, ow, oh, pad) {
  const pr = plantProximityRectFromXYWH(plantX, plantY, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
  const br = plantProximityExpandRect(plantProximityRectFromXYWH(ox, oy, ow, oh), pad);
  return isOverlappingRect(pr, br);
}
  const tooClose = plantCenters.some(function (center) {
function isPlantSpotOverlappingVisibleWorldRock(plantX, plantY, rockPad) {
  const pad = Number.isFinite(Number(rockPad)) ? Number(rockPad) : 0;
  if (!isWorldDocumentEntry()) return false;
  if (!Array.isArray(appleState.worldRocks)) return false;
  const pickedIds = Array.isArray(appleState.worldRockPickedIds)
    ? appleState.worldRockPickedIds
    : [];
  return appleState.worldRocks.some(function (rock) {
    if (!rock || pickedIds.includes(rock.id)) return false;
    const rx = Number(rock.x);
    const ry = Number(rock.y);
    const sz = Number(rock.size) || WORLD_ROCK_SIZE;
    if (!Number.isFinite(rx) || !Number.isFinite(ry)) return false;
    const rockBox = getVisibleWorldRockCollisionRect(rx, ry, sz, rock._el);
    return plantSpotOverlapsExpandedRect(
      plantX,
      plantY,
      rockBox.left,
      rockBox.top,
      rockBox.right - rockBox.left,
      rockBox.bottom - rockBox.top,
      pad
    );
  });
}
  if (plantRuntime.isPlanting || appleState.isEating) return;
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
    return;
function getPlantProximityBlockMessage(plantX, plantY) {
  if (isPlantSpotOverlappingTreeNoPlantZone(plantX, plantY)) {
    return plantProximityPhraseForNoun("\uB098\uBB34");
  }
    return;
  if (isPlantSpotOverlappingVisibleWorldRock(plantX, plantY, 2)) {
    return "\uB3CC\uC704\uC5D0\uB294 \uC2EC\uC9C0 \uBABB\uD569\uB2C8\uB2E4.";
  }
    useBucket();
  const wellPad = 1;
  if (plantSpotOverlapsExpandedRect(plantX, plantY, wellX, wellY, WELL_SIZE, WELL_SIZE, wellPad)) {
    return plantProximityPhraseForNoun("\uC6B0\uBB3C");
  }
  refillWellIfNeeded();
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
  if (!isBucketFull) {
  const bagPad = 0;
  if (
    worldBag &&
    worldBag.style.display !== "none" &&
    plantSpotOverlapsExpandedRect(
      plantX,
      plantY,
      worldBagX,
      worldBagY,
      WORLD_BAG_WIDTH,
      WORLD_BAG_HEIGHT,
      bagPad
    )
  ) {
    return plantProximityPhraseForNoun("\uAC00\uBC29");
  }
  const wellSize = getWellSize();
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
    isBucketFull = false;
  if (isPlantMasterVisible()) {
    const npcPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, npcX, npcY, NPC_WIDTH, NPC_HEIGHT, npcPad)) {
      return plantProximityPhraseForNoun("\uC2DD\uBB3C\uC758 \uB2EC\uC778");
    }
  }
    isBucketFull = false;
  if (isTradeMasterVisible()) {
    if (
      plantSpotOverlapsExpandedRect(
        plantX,
        plantY,
        TRADE_MASTER_START_X,
        TRADE_MASTER_START_Y,
        NPC_WIDTH,
        NPC_HEIGHT,
        0
      )
    ) {
      return plantProximityPhraseForNoun("\uC0C1\uC778");
    }
  }
}
  if (isAlchemyMasterVisible()) {
    if (
      plantSpotOverlapsExpandedRect(
        plantX,
        plantY,
        ALCHEMY_MASTER_START_X,
        ALCHEMY_MASTER_START_Y,
        NPC_WIDTH,
        NPC_HEIGHT,
        0
      )
    ) {
      return plantProximityPhraseForNoun("\uC5F0\uAE08\uC220\uC758 \uB2EC\uC778");
    }
  }
      );
  if (!plantRuntime.isSeedPlanted && seed && seed.style.display !== "none") {
    const seedPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, seedX, seedY, SEED_SIZE, SEED_SIZE, seedPad)) {
      return plantProximityPhraseForNoun("\uC528\uC557");
    }
  }
    if (!plant || plant.status === "dry" || plant.status === "rotten") return;
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
  if (isOnboardingLinearGateActive()) return false;
  if (heldItem !== HELD_ITEM_BUCKET && bucket && bucket.style.display === "block") {
    const bsz = getBucketSize();
    const bucketPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, bucketX, bucketY, bsz.width, bsz.height, bucketPad)) {
      return plantProximityPhraseForNoun("\uC591\uB3D9\uC774");
    }
  }

  return "";
}
    flashOnboardingOrderHint("");
function flashPlantProximityWarning(message) {
  plantProximityWarnUntil = Date.now() + 2800;
  playerStatus.textContent = message || "";
}
  if (!target) return false;
function isPlantSpotOverlappingTreeNoPlantZone(plantX, plantY) {
  const pw = PLANT_SPOT_WIDTH;
  const ph = PLANT_SPOT_HEIGHT;
  const left = plantX;
  const right = plantX + pw;
  const top = plantY;
  const bottom = plantY + ph;
  } else {
  function overlap(ax1, ay1, ax2, ay2) {
    return left < ax2 && right > ax1 && top < ay2 && bottom > ay1;
  }
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
  lastWaterSplashAt = Date.now();
  const trunkInset = 3;
  const trunkLeft = TREE_TRUNK_X - TREE_CLIMB_DISTANCE + trunkInset;
  const trunkRight = TREE_TRUNK_X + TREE_TRUNK_WIDTH + TREE_CLIMB_DISTANCE - trunkInset;
  /** 줄기·뿌리가 그려??이?막음(?전??trunkBottom??지??까지 가??같? x???체 y?서 ?기 불???? */
  const trunkVisualTop = TREE_TRUNK_TOP - 22;
  const trunkFeetBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  if (overlap(trunkLeft, trunkVisualTop, trunkRight, trunkFeetBottom)) {
    return true;
  }
  return false;
}
  }
/**
 * growthTier??면 ?싹??커도 ?랫?안 0?라 반경?????어????각 ?계(getSproutStage)? 같이 ?.
 * ?거???물? ?보?서 빼고, maturity??0????
 */
function getPlantMaturityLevelForPlantingSpacing(plant) {
  if (!plant || plant.removed) return null;
  const gt = Math.max(0, Number(plant.growthTier) || 0);
  const stage = plant.isSproutGrown ? getSproutStageFromPlant(plant) : 0;
  return Math.min(5, Math.max(gt, stage));
}
    plantRuntime.status !== "dry" &&
function canPlantAt(x, y) {
  pollWorldState(true);
  lastPlantProximityBlockMessage = "";
  const proximityMsg = getPlantProximityBlockMessage(x, y);
  if (proximityMsg) {
    lastPlantProximityBlockMessage = proximityMsg;
    return false;
  }
  const plantCenters = [];
      nearest = {
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
    if (distance <= plantWaterDistance && (!nearest || distance < nearest.distance)) {
  appleState.extraPlants.forEach(function (plant) {
    const maturity = getPlantMaturityLevelForPlantingSpacing(plant);
    if (maturity == null) return;
    plantCenters.push({
      x: plant.x + PLANT_SPOT_WIDTH / 2,
      y: plant.y + PLANT_SPOT_HEIGHT / 2,
      maturity: maturity
    });
  });
}
  const targetX = x + PLANT_SPOT_WIDTH / 2;
  const targetY = y + PLANT_SPOT_HEIGHT / 2;
  const viewport = document.querySelector(".viewport");
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
      baseTop = br.top + br.height * 0.66;
function getHeldExtraSeed() {
  const id = getHeldExtraSeedId(heldItem);
  if (!id) return null;
  return appleState.extraSeeds.find(function (extraSeed) {
    return extraSeed.id === id;
  }) || null;
}
    setWorldPosition(anchor, startX, startY);
function isExtraSeedDry(extraSeed, now) {
  void extraSeed;
  void now;
  return false;
}

function useHeldItem() {
  if (plantRuntime.isPlanting || appleState.isEating) return;
    const fallX = (index - 3.5) * 11;
  if (isOnboardingLinearGateActive()) {
    if (heldItem === HELD_ITEM_BUCKET && !onboardingAllowsBucketQUse()) {
      flashOnboardingOrderHint("");
      return;
    }
  }
      (baseLeft + spread) +
  if (heldItem === HELD_ITEM_SEED) {
    startPlanting();
    return;
  }
    const drop = document.createElement("div");
  if (isHeldExtraSeed(heldItem)) {
    startPlantingExtraSeed();
    return;
  }
    viewport.appendChild(holder);
  if (heldItem === HELD_ITEM_BUCKET) {
    useBucket();
  }
}
      }
function useBucket() {
  refillWellIfNeeded();
  // ???력? 보통 ?음 updateBucketPosition보다 먼? ??????좌표가 ?레?어 ???레?????  // ?물 '?음' ?정???긋????인?????분기(뿌리???어가???.
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
  const waterCapacity = getPlantWaterCapacity(plantRuntime);
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
      flashPlantProximityWarning("?물??물이 ?습?다.");
      updatePlayerStatus();
    }
    return;
  }
      return now - wateredAt <= overwaterWindowMs;
  const wellSize = getWellSize();
  const wellDist = getCenterDistance(wellX, wellY, wellSize.width, wellSize.height);
  const wateringTarget = getNearestWateringTarget();
  const nearWellPour = wellReachForPour;
  // ?물·?물 거리가 겹칠 ?? ?물???붓기는 ?물???유가 ?고, 급수 ??이 ?거???물????가까울 ?만.
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
    } else {
      // Already at the cap. Pouring more water rots the plant: the soil flips to
  // ??동?인??급수???물???고 ?물??가?? ?붓?불? ?내 + ?플?시??드?
  if (nearWellPour && wellState.water >= maxWellWater) {
    triggerWaterSplash();
    flashPlantProximityWarning(
      "\uC6B0\uBB3C\uC774 \uAC00\uB4DD\uCC28\uC2B5\uB2C8\uB2E4."
    );
    updatePlayerStatus();
    return;
  }
      plantRuntime.sproutEvolutionLastTickAt = null;
  triggerWaterSplash();
  isBucketFull = false;
}
  } else {
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
    plant.growthStartedAt = now;
function getNextPowderTargetTier(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier !== 3) return 0;
  return 4;
}
    })
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
    plant.status = "normal";
/** ?릭 ???제?가루? ?비?는지(거리·?어·진행 ???? ?일 조건 */
function isMagicPowderUsableNow() {
  if (isOnboardingLinearGateActive()) return false;
  if (magicPowderCount <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  const nextTier = getNextPowderTargetTier(target.plant);
  if (!nextTier || isPowderUpgradeInProgress(target.plant)) return false;
  return true;
}
      plant.isSproutGrown = false;
function tryUseMagicPowder() {
  if (isOnboardingLinearGateActive()) {
    flashOnboardingOrderHint("");
    return false;
  }
  if (magicPowderCount <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  if (!applyMagicPowderToPlant(target.plant)) return false;
    plant.status = "normal";
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
    plantRuntime.status === "dry" ||
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
  if (plantRuntime.waterLevel === 0 && plantRuntime.becameEmptyAt === null) {
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
      mainPlantGrowthMeter.element.style.display = "none";
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
    if (Number.isFinite(rotAt) && now - rotAt >= plantRotClearMs) {
  return nearest;
}
      syncWorldState(true);
function createWaterSplashAt(startX, startY, refElement) {
  const viewport = document.querySelector(".viewport");
  if (!viewport) {
    return;
  }
    const dryAt = Number(plantRuntime.drySoilAt);
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
  if (tickPowderUpgrade(plantRuntime, now)) {
  for (let index = 0; index < 8; index += 1) {
    const spread = (index - 3.5) * 8;
    const fallX = (index - 3.5) * 11;
    const fallY = 32 + (index % 3) * 12;
    saveSeedState();
    const holder = document.createElement("div");
    holder.className = "water-splash-holder";
    holder.style.cssText =
      "position:fixed;left:" +
      (baseLeft + spread) +
      "px;top:" +
      baseTop +
      "px;pointer-events:none;z-index:450;";
    plantRuntime.growthStartedAt != null &&
    const drop = document.createElement("div");
    drop.className = "water-drop";
    drop.style.setProperty("--drop-x", fallX + "px");
    drop.style.setProperty("--drop-y", fallY + "px");
    holder.appendChild(drop);
    viewport.appendChild(holder);
    if (!makePlantStableStage3FromOvergrowthSeed(plantRuntime, now)) {
    window.setTimeout(function () {
      if (holder.parentNode) {
        holder.parentNode.removeChild(holder);
      }
    }, 720);
  }
}
      bumpMergeGuard: false,
function waterPlant(target) {
  if (target && target.type === "extra") {
    waterExtraPlant(target.plant);
    return;
  }
    plantRuntime.status !== "dry" &&
  const now = getSharedPlantSimulationNow();
    plantRuntime.status !== "rotten" &&
  updatePlantWaterLevel();
    now - plantRuntime.becameEmptyAt >= getMainDryAfterEmptyMsForPlant(plantRuntime, now)
  const waterCapacity = getPlantWaterCapacity(plantRuntime);
    // 마른 땅(말라 죽은 작물): 싹 비움 · 물 주기 불가 · plantDrySoilClearMs 후 칸 제거
  const isFirstWater = plantRuntime.needsFirstWater || plantRuntime.growthStartedAt === null;
    plantRuntime.isOverwatered = false;
  plantRuntime.lastWateredAt = now;
  plantRuntime.needsFirstWater = false;
    plantRuntime.drySoilAt = now;
  if (
    plantRuntime.growthStartedAt === null &&
    !plantRuntime.isSproutGrown &&
    !plantRuntime.blockSproutRegrowthAfterDry
  ) {
    plantRuntime.growthStartedAt = now;
  }
    saveSeedState();
  plantRuntime.wateredAtList = plantRuntime.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);
    plantSpot.src = "이미지/soil-rotten.png";
  if (plantRuntime.isOverwatered || plantRuntime.status === "rotten") {
    saveSeedState();
    syncWorldState(true);
    updatePlantState();
    return;
  }
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
function removeMainPlant() {
  plantRuntime.waterLevelUpdatedAt = now;
  plantRuntime.becameEmptyAt = null;
  holdLocalPlantStateAgainstStaleSnapshot(1200);
  plantRuntime.spotY = 0;
  saveSeedState();
  syncWorldState(true);
  updatePlantState();
  onboardingHookWateredMainPlantFromTutorial();
}
  plantRuntime.becameEmptyAt = null;
function waterExtraPlant(plant) {
  const now = getSharedPlantSimulationNow();
  normalizeExtraPlantState(plant);
  updateExtraPlantWaterLevel(plant, now);
  const waterCapacity = getPlantWaterCapacity(plant);
  plantRuntime.sproutGrownAt = null;
  const isFirstWater = plant.needsFirstWater || plant.growthStartedAt === null;
  plantRuntime.sproutEvolutionLastTickAt = null;
  plant.lastWateredAt = now;
  plant.needsFirstWater = false;
  plantRuntime.waterCapacity = 2;
  if (
    plant.growthStartedAt === null &&
    !plant.isSproutGrown &&
    !plant.blockSproutRegrowthAfterDry
  ) {
    plant.growthStartedAt = now;
  }
  plantRuntime.soilOrdinal = 0;
  plant.wateredAtList = plant.wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);
  plantSpot.removeAttribute("title");
  if (plant.isOverwatered || plant.status === "rotten") {
    saveAppleState();
    syncWorldState(true);
    updateExtraSeedsAndPlants();
    return;
  }
  plantMaster.style.display = "none";
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
}
  plant.waterLevelUpdatedAt = now;
  plant.becameEmptyAt = null;
  holdLocalPlantStateAgainstStaleSnapshot(1200);
  holdLocalAppleStateAgainstStaleSnapshot(1200);
  const goodDist = goodTarget ? goodTarget.distance : Infinity;
  saveAppleState();
  syncWorldState(true);
  updateExtraSeedsAndPlants();
}
      const plant = goodTarget.plant;
function updatePlantWaterLevel() {
  if (
    !plantRuntime.isSeedPlanted ||
    plantRuntime.isOverwatered ||
    plantRuntime.status === "dry" ||
    plantRuntime.status === "rotten"
  ) {
    return;
  }
    }
  const now = getSharedPlantSimulationNow();
    if (
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
    hidePlantHoverLabel();
  applyPlantWaterDecay(plantRuntime, now);
  }
  if (plantRuntime.waterLevel === 0 && plantRuntime.becameEmptyAt === null) {
    plantRuntime.becameEmptyAt = plantRuntime.waterLevelUpdatedAt;
  }
}
  if (plantRuntime.waterLevel < getPlantWaterCapacity(plantRuntime) && !plantRuntime.isOverwatered) {
    plantRuntime.isOverwatered = false;
  }
  const powderRatio = getPowderUpgradeRatio(plantRuntime, now);
  saveSeedState({
    bumpMergeGuard: false,
    skipWorldDirty: isSharedWorldMergeActive()
  });
}
    plantRuntime.status === "dry" ||
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
  const growthRatio = plantRuntime.growthStartedAt === null
  const now = getSharedPlantSimulationNow();
    : Math.min(1, elapsed / getPlantFirstGrowthDurationMs(plantRuntime));
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
    Math.min(plantRuntime.spotX + PLANT_SPOT_WIDTH / 2 - cardWidth / 2, WORLD_WIDTH - cardWidth)
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
    updateSproutPosition();
  if (
    plantRuntime.status === "dry" &&
    (plantRuntime.drySoilAt == null || !Number.isFinite(Number(plantRuntime.drySoilAt)))
  ) {
    plantRuntime.drySoilAt = now;
  }
  setWorldPosition(growthCard, cardX, plantRuntime.spotY - 26);
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
  const stage = getSproutStageFromPlant(plantRuntime);
  if (plantRuntime.isSproutGrown && !plantRuntime.isSproutSelfSustaining) {
    tickSproutEvolution(plantRuntime, now);
  }
  sprout.src = getSproutImageForStage(stage);
  if (
    plantRuntime.growthStartedAt != null &&
    plantRuntime.status !== "dry" &&
    plantRuntime.status !== "rotten" &&
    !plantRuntime.isOverwatered &&
    !plantRuntime.isSproutGrown &&
    now - plantRuntime.growthStartedAt >= getPlantFirstGrowthDurationMs(plantRuntime)
  ) {
    if (!makePlantStableStage3FromOvergrowthSeed(plantRuntime, now)) {
      plantRuntime.isSproutGrown = true;
      plantRuntime.sproutGrownAt = now;
      plantRuntime.sproutEvolutionMs = 0;
      plantRuntime.sproutEvolutionLastTickAt = now;
      plantRuntime.isSproutSelfSustaining = false;
    }
    saveSeedState({
      bumpMergeGuard: false,
      skipWorldDirty: isSharedWorldMergeActive()
    });
  }
    }
  if (
    plantRuntime.status !== "dry" &&
    canPlantWiltFromEmptyWater(plantRuntime, now) &&
    plantRuntime.status !== "rotten" &&
    plantRuntime.becameEmptyAt !== null &&
    now - plantRuntime.becameEmptyAt >= getMainDryAfterEmptyMsForPlant(plantRuntime, now)
  ) {
    // 마른 ??말라 죽? ?물): ??비? · ?주기 불? · plantDrySoilClearMs ????거
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
    updatePlayerBubblePosition();
  if (mainSoilRotten) {
    plantSpot.src = "??지/soil-rotten.png";
  } else if (plantRuntime.status === "wet") {
    plantSpot.src = "??지/soil-wet.png";
  } else if (plantRuntime.status === "dry") {
    plantSpot.src = "??지/soil-dry.png";
  } else {
    plantSpot.src = "??지/tilled-soil.png";
  }
    GROUND_WORLD_HEIGHT - playerRenderedHeight - playerDepth + jumpY;
  if (mainSoilRotten) {
    waterNeeded.style.display = "none";
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
function updateNpcPrompt() {
  ensureGrassOrdinalIfNeeded(plantRuntime);
  updatePlantCard();
  updatePlantGrowth();
  if (!mainSoilRotten) {
    plantSpot.style.display = shouldHideSeparateSoilUnderBigGrass(plantRuntime) ? "none" : "block";
  } else {
    plantSpot.style.display = "block";
  }
}
      : "\uC790\uB124 \uC2DD\uBB3C\uC758 \uB2EC\uC778\uC774 \uB418\uC5B4 \uBCF4\uC9C0 \uC54A\uACA0\uB098?";
function shouldSuppressPlantWaterCardForSelfSustaining(plant) {
  return false;
}
    window.clearTimeout(npcPromptHideTimeout);
function removeMainPlant() {
  plantRuntime.isSeedPlanted = false;
  plantRuntime.isPlanting = false;
  plantRuntime.spotX = 0;
  plantRuntime.spotY = 0;
  plantRuntime.lastWateredAt = null;
  plantRuntime.wateredAtList = [];
  plantRuntime.status = "normal";
  plantRuntime.waterLevel = 1;
  plantRuntime.waterLevelUpdatedAt = getSharedPlantSimulationNow();
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
  plantRuntime.seedKind = "";
  plantRuntime.ownerUserId = "";
  plantRuntime.ownerDisplayName = "";
  plantRuntime.soilOrdinal = 0;
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
    onboardingFlowStep === 2 &&
function getNearestBadSoilPlantForProximityCard() {
  let best = null;
  let bestDist = Infinity;
  function tryPlant(plant, x, y) {
    if (!plant) return;
    if (plant.status !== "dry" && plant.status !== "rotten" && !plant.isOverwatered) return;
    const d = getCenterDistance(x, y, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
    if (d <= plantWaterDistance && d < bestDist) {
      bestDist = d;
      best = { plant, distance: d };
    }
  }
  if (plantRuntime.isSeedPlanted) {
    tryPlant(plantRuntime, plantRuntime.spotX, plantRuntime.spotY);
  }
  appleState.extraPlants.forEach(function (p) {
    tryPlant(p, p.x, p.y);
  });
  return best;
}
  }
function updatePlantCard() {
  if (!plantCard) return;
  plantCard.style.display = "none";
  if (plantCardTitle) plantCardTitle.textContent = "";
}
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
  if (elapsedRefills > 0) {
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
      saveWellStateToStorage({
  growthCard.style.display = "none";
  growthFill.style.width = growthRatio * 100 + "%";
  setWorldPosition(growthCard, cardX, plantRuntime.spotY - 26);
  sprout.style.display = "none";
  updateSproutPosition();
}
  }
function updateSproutPosition() {
  if (!plantRuntime.isSproutGrown || plantRuntime.status === "rotten" || plantRuntime.status === "dry") {
    sprout.style.display = "none";
    sprout.removeAttribute("title");
    return;
  }
  well.src = wellState.water > 0 ? "이미지/well.png" : "이미지/well-empty.png";
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
  seedCard.style.display = "none";
function updateNpcPosition() {
  if (!isPlantMasterVisible()) {
    if (plantMaster) plantMaster.style.display = "none";
    npcBubble.style.display = "none";
  } else {
    plantMaster.style.display = "block";
    setWorldPosition(plantMaster, npcX, npcY);
    if (npcBubble.style.display === "block") {
      layoutNpcSpeechBubble();
    }
    updateNpcPrompt();
  }
  plantRuntime.wateredAtList = loadedPlant.plantWateredAtList;
  if (tradeMaster) {
    if (isTradeMasterVisible()) {
      tradeMaster.style.display = "block";
      setWorldPosition(tradeMaster, TRADE_MASTER_START_X, TRADE_MASTER_START_Y);
      updateTradeNpcPrompt();
    } else {
      tradeMaster.style.display = "none";
      if (tradeMasterBubble) tradeMasterBubble.style.display = "none";
    }
  }
  plantRuntime.needsFirstWater = loadedPlant.plantNeedsFirstWater;
  if (alchemyMaster) {
    if (isAlchemyMasterVisible()) {
      alchemyMaster.style.display = "block";
      setWorldPosition(alchemyMaster, ALCHEMY_MASTER_START_X, ALCHEMY_MASTER_START_Y);
    } else {
      alchemyMaster.style.display = "none";
    }
  }
  plantRuntime.sproutGrownAt =
  if (playerBubble.style.display === "block") {
    updatePlayerBubblePosition();
  } else {
    playerBubble.classList.remove("is-in-front-of-name");
  }
}
  const hadSelfKey = Object.prototype.hasOwnProperty.call(loadedPlant, "isSproutSelfSustaining");
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
    }
function updateNpcPrompt() {
  if (isNpcDialogueRunning) return;
  }
  if (isNearPlantMaster()) {
    if (npcBubble.dataset.promptShown === "true") return;
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "growthTier")) {
    npcBubble.dataset.speaker = "npc";
    npcBubble.dataset.promptShown = "true";
    npcBubble.textContent = isNpcDialogueComplete
      ? "\uB2E4\uC74C\uC5D0 \uB610 \uC624\uC2DC\uAC8C"
      : "\uC790\uB124 \uC2DD\uBB3C\uC758 \uB2EC\uC778\uC774 \uB418\uC5B4 \uBCF4\uC9C0 \uC54A\uACA0\uB098?";
    npcBubble.style.display = "block";
    layoutNpcSpeechBubble();
  plantRuntime.powderUpgradeStartedAt = Number(loadedPlant.powderUpgradeStartedAt) || null;
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
  }
function updatePlayerAlert() {
  if (playerAlert.style.display !== "block") return;
  plantRuntime.ownerUserId =
  const playerBox = getPlayerBox();
  const alertWidth = playerAlert.offsetWidth || 10;
  const alertHeight = playerAlert.offsetHeight || 10;
  const x = toScreenX(playerBox.left + playerBox.width / 2) - alertWidth / 2;
  const yOffset = playerAlert.classList.contains("is-butterfly-catch") ? 2 : 4;
  const y = toScreenY(playerBox.top) - alertHeight - yOffset;
  playerAlert.style.transform = "translate(" + x + "px, " + y + "px)";
}

function updateGuideCard() {
  const nearSign = isNearSignBoard();
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  const shouldShow =
    hasGuideBook && (isGuideBookOpen || (nearSign && !isGuideDismissedAtSign));
    const da = Number(loadedPlant.drySoilAt);
  if (shouldShow) {
    guideCard.style.display = "block";
    updateGuidePages();
  } else {
    guideCard.style.display = "none";
  }
  if (plantRuntime.status === "rotten" || plantRuntime.isOverwatered) {
  if (guideBook) guideBook.classList.remove("is-near");
  if (worldBag) worldBag.classList.remove("is-near");
  if (worldBagInventory) {
    worldBagInventory.classList.toggle(
      "is-click-prompt",
      hasGuideBook && isGuideBookClickPromptActive
    );
  }
    plantRuntime.needsFirstWater = false;
  if (
    !getStoredFlag(onboardingFlowDoneKey) &&
    onboardingFlowStep === 2 &&
    shouldShow &&
    guideCard.style.display === "block"
  ) {
    onboardingFlowStep = 3;
    persistOnboardingStep();
  }
}
  }
function getGuideMaxPage() {
  return 0;
}
  if (!plantRuntime.isSeedPlanted) {
function updateGuidePages() {
  if (isGuidePlantPageUnlocked && guidePlantPageHtml) {
    guidePages[0].innerHTML = guidePlantPageHtml;
  } else {
    guidePages[0].innerHTML = guidePlaceholderHtml;
  }
  if (guidePages[1]) {
    guidePages[1].classList.remove("is-active");
  }
  if (isApplyingWorldState && plantRuntime.isSeedPlanted) {
  const maxPage = getGuideMaxPage();
  }
  if (guidePageIndex > maxPage) {
    guidePageIndex = maxPage;
  }
  return {
  guidePages.forEach(function (page, index) {
    page.classList.toggle("is-active", index === guidePageIndex);
  });
    plantLastWateredAt: plantRuntime.lastWateredAt,
  guidePrev.style.display = maxPage > 0 && guidePageIndex > 0 ? "block" : "none";
  guideNext.style.display =
    maxPage > 0 && guidePageIndex < maxPage ? "block" : "none";
  guidePageText.textContent = guidePageIndex + 1 + "/" + (maxPage + 1);
}
    isPlantOverwatered: plantRuntime.isOverwatered,
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
    growthTier: plantRuntime.growthTier,
  refillWellIfNeeded();
}
    powderUpgradeStartedAt: plantRuntime.powderUpgradeStartedAt,
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
    drySoilAt:
function refillWellIfNeeded() {
  const now = Date.now();
  const elapsedRefills = Math.floor((now - wellState.lastRefillAt) / wellRefillMs);
    npcX,
  if (elapsedRefills > 0) {
    const previousWater = wellState.water;
    wellState.water = Math.min(maxWellWater, wellState.water + elapsedRefills);
    // Advance the refill anchor deterministically so every client computes the
    // same wellState.water from the same lastRefillAt. Using "now" here would
    // diverge across clients (clock skew) and the resulting saves would
    // flip-flop the visible water amount as snapshots overwrote each other.
    wellState.lastRefillAt += elapsedRefills * wellRefillMs;
    defaultSeedCreatedAt: Date.now(),
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
  // Tutorial never applies the shared snapshot; NPC stays on old saved coords unless we realign.
  updateWellImage();
  updateWellCard();
}
    guideBookX = GUIDE_BOOK_START_X;
function updateWellImage() {
  well.src = wellState.water > 0 ? "??지/well.png" : "??지/well-empty.png";
}
    setWorldPosition(signBoard, signX, signY);
function updateWellCard() {
  const isVisible = isNearWell();
  const waterRatio = wellState.water / maxWellWater;
  const wellImage = wellState.water > 0 ? "??지/well.png" : "??지/well-empty.png";
      npcY = NPC_START_Y;
  wellCard.style.display = isVisible ? "flex" : "none";
  wellCardImage.src = wellImage;
  wellWaterText.textContent = wellState.water + "/" + maxWellWater;
  wellWaterFill.style.width = waterRatio * 100 + "%";
}
    saveSeedState();
function updateSeedCard() {
  updateSeedDryState();
  seedCard.style.display = "none";
  seedWorldText.style.display = "none";
}
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
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
    halfTextWidth,
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
  const groundTop = WORLD_HEIGHT - GROUND_WORLD_HEIGHT;
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
    });
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
    return "이미지/player-white.png";
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
    worldBagX = WORLD_BAG_START_X;
    worldBagY = WORLD_BAG_START_Y;
    setWorldPosition(signBoard, signX, signY);
    setWorldPosition(guideBook, guideBookX, guideBookY);
    if (worldBag) setWorldPosition(worldBag, worldBagX, worldBagY);
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
    const baseImageDecoded =
  if (plantRuntime.isSeedPlanted) {
    heldItem = null;
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
    seedCard.style.display = "none";
    updatePlantState();
  }
        playerBaseImage.removeEventListener("load", onReady);
  updateSeedDryState();
}
        playerBaseImageReady =
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
      }, 4000);
function updateSeedDryState() {
  plantRuntime.isSeedDry = false;
}
    return;
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
function openCharacterColorChange() {
  if (plantRuntime.isPlanting || appleState.isEating) {
    playerStatus.style.display = "block";
    playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, -100%)";
    return;
  }
}
  if (Date.now() < plantProximityWarnUntil) {
    playerStatus.style.display = "block";
    playerStatus.style.transform =
      "translate(" + clampedX + "px, " + yWorld + "px) translate(-50%, -100%)";
    return;
  }
  if (currentUserScopedHasChosenColorKey) {
  playerStatus.style.display = "none";
}
  characterSelectOverlay.classList.remove("is-open");
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
    isReloadingForWorldReset = true;
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
    } catch (eTutSpawn) {}
function getMaxZoom() {
  return Math.max(maxZoom, getFitZoom() + 1);
}

function clampZoom(value) {
  return Math.max(getFitZoom(), Math.min(getMaxZoom(), value));
}
    updatePlayerColorBodyPosition();
function initializeZoom() {
  if (hasInitializedZoom) return;
  zoomLevel = clampZoom(defaultZoom);
  hasInitializedZoom = true;
}
    saveBucketState();
function postJson(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(function (response) {
    return response.json().then(function (data) {
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "?청???패?습?다.");
      }
function updatePlayerName() {
      return data;
    });
  });
}
  ) {
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
  playerName.classList.toggle("is-dialogue-layer", npcLineShowing);
function getTintedPlayerSrc(color) {
  const tintColor = /^#[0-9a-fA-F]{6}$/.test(color || "") ? color.toLowerCase() : "#ffffff";
function syncLocalPlayerVisibility() {
  if (playerTintCache.has(tintColor)) {
    return playerTintCache.get(tintColor);
  }
    player.classList.remove("is-hidden-before-spawn");
  if (!playerBaseImageReady || !playerBaseImage.naturalWidth || !playerBaseImage.naturalHeight) {
    return "??지/player-white.png";
  }
    }
  const canvas = document.createElement("canvas");
  canvas.width = playerBaseImage.naturalWidth;
  canvas.height = playerBaseImage.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return "??지/player-white.png";
  }
  return Boolean(multiplayerChannel && currentSessionId && isMultiplayerSubscribed);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(playerBaseImage, 0, 0);
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = tintColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";
  return false;
  const tintedSrc = canvas.toDataURL("image/png");
  playerTintCache.set(tintColor, tintedSrc);
  return tintedSrc;
}
  if (!worldChatPanelOpen) {
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
}
function getPlayerColorFilter(color) {
  if (color === "#ffffff") return "none";
  setWorldChatPanelOpen(!worldChatPanelOpen);
  if (color === "#111827") {
    return "brightness(0) saturate(100%) invert(7%) sepia(13%) saturate(2308%) hue-rotate(182deg) brightness(96%) contrast(93%)";
  }
  let s = String(raw || "")
  return "saturate(160%) brightness(0.98)";
}
  if (s.length > WORLD_CHAT_MAX_CHARS) s = truncateWorldChatString(s, WORLD_CHAT_MAX_CHARS);
function buildCharacterColorGrid() {
  characterColorGrid.innerHTML = "";

  characterColors.forEach(function (color) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-color-option";
    button.style.background = color;
    button.setAttribute("aria-label", color + " ?깔");
  if (s.startsWith(WORLD_CHAT_GLOBAL_PREFIX)) {
    if (color === selectedPlayerColor) {
      button.classList.add("is-selected");
    }
  if (colon <= 0) {
    button.addEventListener("click", function () {
      selectedPlayerColor = color;
      document.documentElement.style.setProperty("--preview-player-color", color);
      applyPlayerColor(color);
      if (multiplayerChannel) {
        sendMultiplayerPresence(true);
      }
      return p.trim();
      characterColorGrid.querySelectorAll(".character-color-option").forEach(function (option) {
        option.classList.remove("is-selected");
      });
      button.classList.add("is-selected");
    });
  if (parts.length === 1 && parts[0] === "\uC804\uCCB4") {
    characterColorGrid.appendChild(button);
  });
}
}
function openCharacterSelectIfNeeded() {
  if (!currentUserId || !currentUserName) {
    window.location.replace("ovc-login.html?v=20260509a");
    return;
  }
  const mySid = currentSessionId ? String(currentSessionId) : "";
  playerName.textContent = nameForIngameUiDisplay(accountDisplayNameForUi());
    const want = nameForIngameUiDisplay(nm);
  if (hasSpawnedCharacter) {
    syncLocalPlayerVisibility();
    player.classList.remove("is-hidden-before-spawn");
    function runAfterPlayerBaseReady() {
      applyTutorialWorldResetIfPending();
      applyPlayerColor(selectedPlayerColor);
      syncPlayerColorToServer(true);
      setupMultiplayer();
    }
    const baseImageDecoded =
      playerBaseImageReady ||
      (playerBaseImage.complete && playerBaseImage.naturalWidth > 0 && playerBaseImage.naturalHeight > 0);
    if (baseImageDecoded) {
      runAfterPlayerBaseReady();
    } else {
      let fallbackTimer = null;
      const onReady = function () {
        playerBaseImage.removeEventListener("load", onReady);
        playerBaseImage.removeEventListener("error", onError);
        if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
        playerBaseImageReady =
          Boolean(playerBaseImage.naturalWidth && playerBaseImage.naturalHeight) || playerBaseImageReady;
        runAfterPlayerBaseReady();
      };
      const onError = function () {
        playerBaseImage.removeEventListener("load", onReady);
        playerBaseImage.removeEventListener("error", onError);
        if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
        addNetworkDebugLog("player base image load error; continuing init without tint cache");
        runAfterPlayerBaseReady();
      };
      fallbackTimer = window.setTimeout(function () {
        playerBaseImage.removeEventListener("load", onReady);
        playerBaseImage.removeEventListener("error", onError);
        fallbackTimer = null;
        addNetworkDebugLog("player base image load timeout; continuing multiplayer setup");
        runAfterPlayerBaseReady();
      }, 4000);
      playerBaseImage.addEventListener("load", onReady, { once: true });
      playerBaseImage.addEventListener("error", onError, { once: true });
    }
    return;
  }
    err.className = "world-chat-user-picker-empty";
  isCharacterSelecting = true;
  updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
  player.classList.add("is-hidden-before-spawn");
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}
  worldChatUserPickerEl.appendChild(loading);
function openCharacterColorChange() {
  onboardingStep26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
  isCharacterSelecting = true;
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}
      const nb = nameForIngameUiDisplay((b && b.name) || "");
function finishCharacterSelect() {
  hasSpawnedCharacter = true;
  isCharacterSelecting = false;
  localStorage.setItem(currentUserColorKey, selectedPlayerColor);
  localStorage.setItem(currentUserHasChosenColorKey, currentUserId);
  if (currentUserScopedHasChosenColorKey) {
    localStorage.setItem(currentUserScopedHasChosenColorKey, "true");
  }
  characterSelectOverlay.classList.remove("is-open");
  syncLocalPlayerVisibility();
  applyPlayerColor(selectedPlayerColor);
      btn.type = "button";
  syncPlayerColorToServer(true);
      const label = nameForIngameUiDisplay(row.name || "OVC");
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
    return;
  if (!applyTutorialWorldResetIfPending()) {
    loadOnboardingFlowState();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    updateCamera();
    savePlayerPosition(true);
    saveWellState();
    saveSeedState();
    saveAppleState();
    saveBucketState();
  }
  if (!pick) return;
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    hasHydratedSharedWorldFromServer = true;
  }
    v = lead.slice(WORLD_CHAT_GLOBAL_PREFIX.length).replace(/^\s+/, "");
  updateOnboardingFlowUI();
  setupMultiplayer();
}
  let rest = "";
function updatePlayerName() {
  if (!playerName) return;
  if (
    !player ||
    player.classList.contains("is-hidden-before-spawn")
  ) {
    playerName.style.display = "none";
    playerName.classList.remove("is-dialogue-layer");
    return;
  }
    rest = "";
  playerName.textContent = nameForIngameUiDisplay(accountDisplayNameForUi() || "OVC");
  playerName.style.display = "block";
  playerName.style.position = "";
  playerName.style.left = "";
  playerName.style.top = "";
  playerName.style.right = "";
  playerName.style.bottom = "";
  playerName.style.margin = "";
  playerName.style.transform = "";
  playerName.style.visibility = "";
    const len = worldChatInputEl.value.length;
  const npcLineShowing =
    isNpcDialogueRunning && npcBubble.style.display === "block";
  playerName.classList.toggle("is-dialogue-layer", npcLineShowing);
}
function appendWorldChatLine(name, text, sessionId, sentAt, meta) {
function syncLocalPlayerVisibility() {
  if (!player || !localPlayerRoot) return;
  localPlayerRoot.style.display = "block";
  if (hasSpawnedCharacter) {
    player.classList.remove("is-hidden-before-spawn");
    player.style.display = "block";
    if (!player.getAttribute("src")) {
      player.src = "??지/player-white.png";
    }
    return;
  }
  player.style.display = "";
  player.classList.add("is-hidden-before-spawn");
}
    row.classList.add("is-whisper");
function isWorldSocialRealtimeReady() {
  return Boolean(multiplayerChannel && currentSessionId && isMultiplayerSubscribed);
}
  const mm = String(d.getMinutes()).padStart(2, "0");
function isWorldChatBlockingGameInput() {
  if (!worldSocialUiReady) return false;
  if (worldChatPanelOpen) return true;
  if (worldChatInputEl && document.activeElement === worldChatInputEl) return true;
  return false;
}
  } else {
function setWorldChatPanelOpen(nextOpen) {
  worldChatPanelOpen = Boolean(nextOpen);
  if (!worldChatPanelOpen) {
    closeWorldChatUserPicker();
  }
  if (!worldChatPanelEl) return;
  worldChatPanelEl.classList.toggle("is-open", worldChatPanelOpen);
  worldChatPanelEl.setAttribute("aria-hidden", worldChatPanelOpen ? "false" : "true");
  if (worldChatPanelOpen && worldChatInputEl) {
    resetInputKeys(keys);
    isInteractKeyLatched = false;
    worldChatInputEl.focus();
  }
}
  if (!text || !playerChatBubbleEl) return;
function toggleWorldChatPanel() {
  setWorldChatPanelOpen(!worldChatPanelOpen);
}
  localChatBubbleTimer = setTimeout(function () {
function sanitizeWorldChatText(raw) {
  let s = String(raw || "")
    .trim()
    .replace(/[\u0000-\u001F<>]/g, "");
  if (s.length > WORLD_CHAT_MAX_CHARS) s = truncateWorldChatString(s, WORLD_CHAT_MAX_CHARS);
  return s;
}
function setRemoteChatBubble(sessionId, text, hideAt) {
/**
 * @returns {{ kind: "world", body: string } | { kind: "whisper", recipientNames: string[], body: string } | null}
 */
function parseWorldChatComposition(raw) {
  const s = normalizeWorldChatColonsForParsing(String(raw || "").trim());
  if (!s) return null;
  if (s.startsWith(WORLD_CHAT_GLOBAL_PREFIX)) {
    return { kind: "world", body: s.slice(WORLD_CHAT_GLOBAL_PREFIX.length).trim() };
  }
  const colon = s.indexOf(":");
  if (colon <= 0) {
    return { kind: "world", body: s };
  }
  const left = s.slice(0, colon).trim();
  const right = s.slice(colon + 1).trim();
  const parts = left
    .split(",")
    .map(function (p) {
      return p.trim();
    })
    .filter(Boolean);
  if (parts.length === 0) {
    return { kind: "world", body: s };
  }
  if (parts.length === 1 && parts[0] === "\uC804\uCCB4") {
    return { kind: "world", body: right };
  }
  return { kind: "whisper", recipientNames: parts, body: right };
}
  return true;
function resolveWhisperTargetSessionIds(recipientNames) {
  const out = [];
  const seen = Object.create(null);
  const myName = nameForIngameUiDisplay(accountDisplayNameForUi());
  const mySid = currentSessionId ? String(currentSessionId) : "";
  (recipientNames || []).forEach(function (nm) {
    const want = nameForIngameUiDisplay(nm);
    if (want === myName && mySid) {
      if (!seen[mySid]) {
        seen[mySid] = true;
        out.push(mySid);
      }
      return;
    }
    Object.keys(remotePlayers).forEach(function (rid) {
      const rp = remotePlayers[rid];
      const rn = nameForIngameUiDisplay(rp && rp.name ? rp.name : "");
      if (rn === want && !seen[rid]) {
        seen[rid] = true;
        out.push(rid);
      }
    });
  });
  return out;
}
    multiplayerChannel.send({
function setWorldChatUserPickerOpen(open) {
  worldChatUsersPickerOpen = Boolean(open);
  if (worldChatUserPickerEl) {
    worldChatUserPickerEl.classList.toggle("is-open", worldChatUsersPickerOpen);
    worldChatUserPickerEl.setAttribute(
      "aria-hidden",
      worldChatUsersPickerOpen ? "false" : "true"
    );
  }
}
      }
function closeWorldChatUserPicker() {
  setWorldChatUserPickerOpen(false);
}
}
function fillWorldChatUserPickerFromServer() {
  if (!worldChatUserPickerEl) return;
  worldChatUserPickerEl.innerHTML = "";
  const room =
    window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom
      ? window.OVC_ONLINE_CONFIG.multiplayerRoom
      : "ovc-main-room";
  if (!window.OVCOnline || typeof window.OVCOnline.listPresence !== "function") {
    const err = document.createElement("div");
    err.className = "world-chat-user-picker-empty";
    err.textContent = "\uC5F0\uACB0 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC5B4\uC694.";
    worldChatUserPickerEl.appendChild(err);
    return;
  }
  const loading = document.createElement("div");
  loading.className = "world-chat-user-picker-empty";
  loading.textContent = "\uBD88\uB7EC\uC624\uB294 \uC911...";
  worldChatUserPickerEl.appendChild(loading);
  window.OVCOnline.listPresence(room).then(function (rows) {
    if (!worldChatUserPickerEl) return;
    worldChatUserPickerEl.innerHTML = "";
    const list = (rows || []).filter(function (row) {
      return row && row.id && String(row.id) !== String(currentSessionId || "");
    });
    list.sort(function (a, b) {
      const na = nameForIngameUiDisplay((a && a.name) || "");
      const nb = nameForIngameUiDisplay((b && b.name) || "");
      return na.localeCompare(nb, "ko");
    });
    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "world-chat-user-picker-empty";
      empty.textContent = "\uB2E4\uB978 \uC811\uC18D \uC720\uC800\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
      worldChatUserPickerEl.appendChild(empty);
      return;
    }
    list.forEach(function (row) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "world-chat-user-picker-item";
      const label = nameForIngameUiDisplay(row.name || "OVC");
      btn.textContent = label;
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        appendWhisperRecipientToWorldChatInput(label);
        closeWorldChatUserPicker();
        if (worldChatInputEl) worldChatInputEl.focus();
      });
      worldChatUserPickerEl.appendChild(btn);
    });
  }).catch(function () {
    if (!worldChatUserPickerEl) return;
    worldChatUserPickerEl.innerHTML = "";
    const err = document.createElement("div");
    err.className = "world-chat-user-picker-empty";
    err.textContent = "\uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.";
    worldChatUserPickerEl.appendChild(err);
  });
}
    if (!rpp || !rpp.bodyElement) return;
function toggleWorldChatUserPicker() {
  if (!worldChatUserPickerEl) return;
  if (worldChatUsersPickerOpen) {
    closeWorldChatUserPicker();
    return;
  }
  setWorldChatUserPickerOpen(true);
  fillWorldChatUserPickerFromServer();
}
  if (!rp || !rp.bodyElement) return;
/**
 * "?길??" ??"?길?? ?람??" ?태??신???두??적. `?체:` 가 ?으??거 ??귓말 ?두??환.
 */
function appendWhisperRecipientToWorldChatInput(pickedName) {
  if (!worldChatInputEl) return;
  const pick = String(pickedName || "").trim();
  if (!pick) return;
  let v = normalizeWorldChatColonsForParsing(worldChatInputEl.value || "");
  const lead = v.replace(/^\s+/, "");
  if (lead.startsWith(WORLD_CHAT_GLOBAL_PREFIX)) {
    v = lead.slice(WORLD_CHAT_GLOBAL_PREFIX.length).replace(/^\s+/, "");
  }
  const colonIdx = v.indexOf(":");
  let recipients = [];
  let rest = "";
  if (colonIdx >= 0) {
    rest = v.slice(colonIdx + 1);
    recipients = v
      .slice(0, colonIdx)
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  } else {
    rest = "";
    const t = v.trim();
    if (t) recipients = [t];
  }
  const normPick = nameForIngameUiDisplay(pick);
  const already = recipients.some(function (r) {
    return nameForIngameUiDisplay(r) === normPick;
  });
  if (!already) recipients.push(pick);
  worldChatInputEl.value = recipients.join(", ") + ": " + rest.replace(/^\s*/, "");
  try {
    const len = worldChatInputEl.value.length;
    worldChatInputEl.setSelectionRange(len, len);
  } catch (eSel) {}
}
    const dy = -rise - Math.random() * spreadY;
function appendWorldChatLine(name, text, sessionId, sentAt, meta) {
  const entry = {
    name: name || "OVC",
    text: text || "",
    sid: sessionId || "",
    t: Number(sentAt) || Date.now(),
    chatKind: meta && meta.chatKind ? meta.chatKind : "world",
    whisperToLabel: meta && meta.whisperToLabel ? meta.whisperToLabel : ""
  };
  worldChatLog.push(entry);
  if (worldChatLog.length > WORLD_CHAT_LOG_CAP) worldChatLog.shift();
  if (!worldChatLogEl) return;
  const row = document.createElement("div");
  row.className = "world-chat-line";
  if (entry.chatKind === "whisper") {
    row.classList.add("is-whisper");
  }
  const d = new Date(entry.t);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  let prefix = "[" + hh + ":" + mm + "] ";
  if (entry.chatKind === "whisper") {
    prefix +=
      "[\uADD3\uB9D0" +
      (entry.whisperToLabel ? " \u2192 " + entry.whisperToLabel : "") +
      "] ";
  } else {
    prefix += "[\uC804\uCCB4] ";
  }
  row.textContent = prefix + entry.name + ": " + entry.text;
  worldChatLogEl.appendChild(row);
  worldChatLogEl.scrollTop = worldChatLogEl.scrollHeight;
}
    const dy = -rise - Math.random() * spreadY;
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
  }, 600);
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
  const ok = isWorldSocialRealtimeReady();
function removeRemoteChatBubbleEl(sessionId) {
  const el = remoteChatBubbleEls[sessionId];
  if (el && el.parentNode) el.parentNode.removeChild(el);
  delete remoteChatBubbleEls[sessionId];
  delete remoteChatBubbles[sessionId];
}
  if (worldChatSendBtn) worldChatSendBtn.disabled = !ok;
function broadcastWorldChat(payload) {
  if (!isWorldSocialRealtimeReady()) return false;
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_chat",
      payload: payload
    })
  ).catch(function () {});
  return true;
}
    phase = 204821;
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
  const padH = Math.max(
function broadcastWorldSad() {
  if (!isWorldSocialRealtimeReady()) return false;
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_sad",
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
  const wdx = w.dx * pxPerWu;
function shouldShowIncomingWorldChatPayload(payload) {
  const kind = payload.chatKind === "whisper" ? "whisper" : "world";
  if (kind !== "whisper") return true;
  const ids = payload.whisperToIds;
  const mySid = currentSessionId ? String(currentSessionId) : "";
  if (Array.isArray(ids) && mySid && ids.some(function (id) { return String(id) === mySid; })) {
    return true;
  }
  const names = payload.whisperToNames;
  const myName = nameForIngameUiDisplay(accountDisplayNameForUi());
  if (Array.isArray(names) && names.some(function (n) { return nameForIngameUiDisplay(n) === myName; })) {
    return true;
  }
  return false;
}
  if (!playerChatBubbleEl) return;
function handleWorldChatBroadcast(payload) {
  if (!payload || !payload.id) return;
  const sid = String(payload.id);
  if (sid === String(currentSessionId)) return;
  if (!shouldShowIncomingWorldChatPayload(payload)) return;
  const text = sanitizeWorldChatText(payload.text);
  if (!text) return;
  const name = nameForIngameUiDisplay(payload.name || "OVC");
  const t = Number(payload.t) || Date.now();
  const isWhisper = payload.chatKind === "whisper";
  const whisperLabel = isWhisper
    ? (Array.isArray(payload.whisperToNames)
      ? payload.whisperToNames.map(function (n) { return nameForIngameUiDisplay(n); }).join(", ")
      : "")
    : "";
  appendWorldChatLine(name, text, sid, t, {
    chatKind: isWhisper ? "whisper" : "world",
    whisperToLabel: whisperLabel
  });
  setRemoteChatBubble(sid, text, Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS);
}
    const rp = remotePlayers[sid];
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
  const parsed = parseWorldChatComposition(raw);
function handleWorldSadBroadcast(payload) {
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
    spawnWorldSadFxNearBodyRect(rpp.bodyElement.getBoundingClientRect());
  });
}
    broadcastWorldChat(
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
  if (worldSocialUiReady) return;
function spawnWorldSadFxNearBodyRect(rect) {
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
  const facesVariety = ["\uD83D\uDE2D", "\uD83D\uDE15", "\uD83E\uDD72", "\u2639\uFE0F"];
  for (let i = 0; i < n; i++) {
    const bit = document.createElement("span");
    bit.className = "ovc-heart-fx-bit";
    bit.textContent =
      i === 0 ? WORLD_SAD_BUTTON_EMOJI : facesVariety[(i - 1) % facesVariety.length];
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
    '\uC804\uCCB4 \uCC57: "\uC804\uCCB4: "\uC785\uB825 \uD6C4 \uCC57\uC305 or \uADF8\uB0E5 \uC785\uB825\n' +
function pulseWorldHeartButton() {
  if (!worldHeartBtn) return;
  worldHeartBtn.classList.remove("ovc-heart-btn-pulse");
  void worldHeartBtn.offsetWidth;
  worldHeartBtn.classList.add("ovc-heart-btn-pulse");
  window.setTimeout(function () {
    if (worldHeartBtn) worldHeartBtn.classList.remove("ovc-heart-btn-pulse");
  }, 600);
}
  inpRow.className = "world-chat-input-row";
function pulseWorldSadButton() {
  if (!worldSadBtn) return;
  worldSadBtn.classList.remove("ovc-sad-btn-pulse");
  void worldSadBtn.offsetWidth;
  worldSadBtn.classList.add("ovc-sad-btn-pulse");
  window.setTimeout(function () {
    if (worldSadBtn) worldSadBtn.classList.remove("ovc-sad-btn-pulse");
  }, 600);
}
  worldChatUsersBtn.title = "\uC11C\uBC84 \uC811\uC18D \uC720\uC800 \uBAA9\uB85D";
function updateWorldSocialChatUiEnabled() {
  const ok = isWorldSocialRealtimeReady();
  if (worldChatInputEl) {
    worldChatInputEl.disabled = !ok;
    worldChatInputEl.placeholder = ok
      ? "\uC804\uCCB4: \uBA54\uC2DC\uC9C0 \uB610\uB294 \uC774\uB9841, \uC774\uB9842: \uADD3\uB9D0..."
      : "\uBA40\uD2F0 \uC5F0\uACB0 \uD6C4 \uCC57";
  }
  if (worldChatSendBtn) worldChatSendBtn.disabled = !ok;
  if (worldChatUsersBtn) worldChatUsersBtn.disabled = !ok;
  if (worldHeartBtn) worldHeartBtn.disabled = !ok;
  if (worldSadBtn) worldSadBtn.disabled = !ok;
}
  playerChatBubbleEl = document.createElement("div");
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
  worldChatSendBtn.addEventListener("click", function () {
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
    window.OVC_ONLINE_CONFIG.supabaseKey.startsWith("sb_publishable_")
function sendWorldChatFromUi() {
  if (!worldChatInputEl) return;
  const raw = worldChatInputEl.value;
  const parsed = parseWorldChatComposition(raw);
  worldChatInputEl.value = "";
  if (!parsed) return;
  const body = sanitizeWorldChatText(parsed.body);
  if (!body) return;
  if (!isWorldSocialRealtimeReady()) return;
  const senderName = nameForIngameUiDisplay(accountDisplayNameForUi());
  const basePayload = {
    id: currentSessionId,
    userId: currentUserId || "",
    name: senderName,
    text: body,
    t: Date.now()
  };
  if (parsed.kind === "whisper") {
    const displayNames = parsed.recipientNames.map(function (n) {
      return nameForIngameUiDisplay(n);
    });
    const whisperToIds = resolveWhisperTargetSessionIds(parsed.recipientNames);
    const whisperLabel = displayNames.join(", ");
    appendWorldChatLine(senderName, body, currentSessionId, basePayload.t, {
      chatKind: "whisper",
      whisperToLabel: whisperLabel
    });
    setLocalChatBubble(body, Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS);
    broadcastWorldChat(
      Object.assign({}, basePayload, {
        chatKind: "whisper",
        whisperToIds: whisperToIds,
        whisperToNames: displayNames
      })
    );
    return;
  }
  appendWorldChatLine(senderName, body, currentSessionId, basePayload.t, { chatKind: "world" });
  setLocalChatBubble(body, Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS);
  broadcastWorldChat(Object.assign({}, basePayload, { chatKind: "world" }));
}
      if (channel !== multiplayerChannel) return;
function onWorldHeartClick() {
  if (!isWorldSocialRealtimeReady()) return;
  broadcastWorldHeart();
  pulseWorldHeartButton();
  if (!player) return;
  const rect = player.getBoundingClientRect();
  spawnWorldHeartFxNearBodyRect(rect);
}
      handleWorldHeartBroadcast(payload.payload || {});
function onWorldSadClick() {
  if (!isWorldSocialRealtimeReady()) return;
  broadcastWorldSad();
  pulseWorldSadButton();
  if (!player) return;
  const rect = player.getBoundingClientRect();
  spawnWorldSadFxNearBodyRect(rect);
}
      const message = String((payload && payload.message) || "");
function ensureWorldSocialUi() {
  if (worldSocialUiReady) return;
  worldSadBtn = document.createElement("button");
  worldSadBtn.type = "button";
  worldSadBtn.id = "world-sad-button";
  worldSadBtn.className = "world-sad-button";
  worldSadBtn.setAttribute("aria-label", "\uC2AC\uD37C\uC694");
  worldSadBtn.innerHTML = WORLD_SAD_BUTTON_EMOJI;
  document.body.appendChild(worldSadBtn);
        status +
  worldHeartBtn = document.createElement("button");
  worldHeartBtn.type = "button";
  worldHeartBtn.id = "world-heart-button";
  worldHeartBtn.className = "world-heart-button";
  worldHeartBtn.setAttribute("aria-label", "\uD558\uD2B8");
  worldHeartBtn.innerHTML = "\u2764\uFE0F";
  document.body.appendChild(worldHeartBtn);
        setTimeout(function () {
  worldChatToggleBtn = document.createElement("button");
  worldChatToggleBtn.type = "button";
  worldChatToggleBtn.id = "world-chat-toggle";
  worldChatToggleBtn.className = "world-chat-toggle";
  worldChatToggleBtn.setAttribute("aria-label", "\uCC57");
  worldChatToggleBtn.textContent = "\uD83D\uDCAC";
  document.body.appendChild(worldChatToggleBtn);
        if (terminalHandled) return;
  worldChatPanelEl = document.createElement("div");
  worldChatPanelEl.id = "world-chat-panel";
  worldChatPanelEl.className = "world-chat-panel";
  worldChatPanelEl.setAttribute("aria-hidden", "true");
  worldChatLogEl = document.createElement("div");
  worldChatLogEl.className = "world-chat-log";
  const hint = document.createElement("div");
  hint.className = "world-chat-hint";
  hint.textContent =
    '\uC804\uCCB4 \uCC57: "\uC804\uCCB4: "\uC785\uB825 \uD6C4 \uCC57\uC305 or \uADF8\uB0E5 \uC785\uB825\n' +
    ' \uADD3\uB9D0: "(\uC774\uB984):", \uB2E4\uC218\uB294 "(\uC774\uB984),(\uC774\uB984):"\n' +
    ' \uAC04\uD3B8\uD558\uAC8C \uC811\uC18D\uD55C \uC720\uC800 \uBC84\uD2BC \uD074\uB9AD \uD6C4, \uC774\uB984 \uD074\uB9AD\uD574\uC11C\uB3C4 \uAC00\uB2A5';
  worldChatLogEl.appendChild(hint);
  worldChatInputWrapEl = document.createElement("div");
  worldChatInputWrapEl.className = "world-chat-input-wrap";
  worldChatUserPickerEl = document.createElement("div");
  worldChatUserPickerEl.className = "world-chat-user-picker";
  worldChatUserPickerEl.setAttribute("aria-hidden", "true");
  const inpRow = document.createElement("div");
  inpRow.className = "world-chat-input-row";
  worldChatInputEl = document.createElement("input");
  worldChatInputEl.type = "text";
  worldChatInputEl.className = "world-chat-input";
  worldChatInputEl.maxLength = WORLD_CHAT_MAX_CHARS;
  worldChatInputEl.autocomplete = "off";
  worldChatUsersBtn = document.createElement("button");
  worldChatUsersBtn.type = "button";
  worldChatUsersBtn.className = "world-chat-users-btn";
  worldChatUsersBtn.textContent = "\uC811\uC18D\uD55C \uC720\uC800";
  worldChatUsersBtn.title = "\uC11C\uBC84 \uC811\uC18D \uC720\uC800 \uBAA9\uB85D";
  worldChatSendBtn = document.createElement("button");
  worldChatSendBtn.type = "button";
  worldChatSendBtn.className = "world-chat-send";
  worldChatSendBtn.textContent = "\uC804\uC1A1";
  inpRow.appendChild(worldChatInputEl);
  inpRow.appendChild(worldChatUsersBtn);
  inpRow.appendChild(worldChatSendBtn);
  worldChatInputWrapEl.appendChild(worldChatUserPickerEl);
  worldChatInputWrapEl.appendChild(inpRow);
  worldChatPanelEl.appendChild(worldChatLogEl);
  worldChatPanelEl.appendChild(worldChatInputWrapEl);
  document.body.appendChild(worldChatPanelEl);
        : shouldShowWorldRockPickupAction
  playerChatBubbleEl = document.createElement("div");
  playerChatBubbleEl.id = "player-chat-bubble";
  playerChatBubbleEl.className = "world-player-chat-bubble world-local-chat-bubble";
  playerChatBubbleEl.style.display = "none";
  document.body.appendChild(playerChatBubbleEl);
    color: selectedPlayerColor,
  worldSadBtn.addEventListener("click", function () {
    onWorldSadClick();
  });
  worldHeartBtn.addEventListener("click", function () {
    onWorldHeartClick();
  });
  worldChatToggleBtn.addEventListener("click", function () {
    toggleWorldChatPanel();
  });
  worldChatSendBtn.addEventListener("click", function () {
    sendWorldChatFromUi();
  });
  worldChatUsersBtn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    toggleWorldChatUserPicker();
  });
  worldChatInputEl.addEventListener("focus", function () {
    closeWorldChatUserPicker();
  });
  worldChatInputEl.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") {
      ev.preventDefault();
      sendWorldChatFromUi();
    }
  });
      (hasChanged && now - lastBroadcastAt >= getMultiplayerBroadcastMinMs()) ||
  document.addEventListener("click", function (ev) {
    if (!worldChatPanelOpen || !worldChatPanelEl) return;
    const t = ev.target;
    if (!(t instanceof Node)) return;
    if (worldChatPanelEl.contains(t)) return;
    if (worldChatToggleBtn && worldChatToggleBtn.contains(t)) return;
    if (worldHeartBtn && worldHeartBtn.contains(t)) return;
    if (worldSadBtn && worldSadBtn.contains(t)) return;
    setWorldChatPanelOpen(false);
  });
      );
  worldSocialUiReady = true;
  updateWorldSocialChatUiEnabled();
}
      lastHeartbeatBroadcastAt = now;
function updateWorldSocialOverlaysInGameLoop() {
  if (!worldSocialUiReady) return;
  updateWorldSocialChatUiEnabled();
  updatePlayerChatBubbleOverlay();
  updateRemoteChatBubbleOverlays();
}
    syncPresenceToDatabase(state);
function setupMultiplayer() {
  if (isTabSessionSuperseded) return;
  if (!hasSpawnedCharacter) {
    updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
    addNetworkDebugLog("multiplayer skipped: character not spawned");
    return;
  }
function broadcastBucketState(forceSend) {
  if (isSharedWorldSyncPausedForTutorial()) {
    teardownMultiplayerForTutorial();
    updateMultiplayerStatus(
  if (!multiplayerChannel || !currentSessionId) {
    );
    addNetworkDebugLog("multiplayer skipped: tutorial single-player world");
    return;
  }
    );
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
    x: bucketX,
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
function handleRemoteBucketBroadcast(payload) {
  if (
    window.OVC_ONLINE_CONFIG &&
    typeof window.OVC_ONLINE_CONFIG.supabaseKey === "string" &&
    window.OVC_ONLINE_CONFIG.supabaseKey.startsWith("sb_publishable_")
  ) {
    addNetworkDebugLog("warning: sb_publishable key can close Realtime immediately; use anon public key");
  }
  const remoteId = String(payload.id);
  updateMultiplayerStatus("\uC5F0\uACB0\uC911");
  const channel = window.OVCOnline.createPresenceChannel(
    window.OVC_ONLINE_CONFIG.multiplayerRoom,
    currentSessionId
  );
  multiplayerChannel = channel;
  const attempt = ++multiplayerConnectAttempt;
    const nextX = Number(payload.x);
  if (!channel) {
    updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
    addNetworkDebugLog("multiplayer failed: createPresenceChannel returned null");
    return;
  }
  let terminalHandled = false;
      "from=" + remoteId + " held=true x=" + Math.round(bucketX || 0) + " y=" + Math.round(bucketY || 0) + " t=" + nextUpdatedAt,
  channel
    .on("broadcast", { event: "player_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemotePlayerBroadcast(payload.payload);
    })
    .on("broadcast", { event: "bucket_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteBucketBroadcast(payload.payload);
    })
    .on("broadcast", { event: "butterfly_state" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteButterflyStateBroadcast(payload.payload);
    })
    .on("broadcast", { event: "butterfly_catch" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteButterflyCatchBroadcast(payload.payload);
    })
    .on("broadcast", { event: "world_loose_seed_pickup" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteWorldLooseSeedPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_rock_pickup" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteWorldRockPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_chat" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleWorldChatBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_heart" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleWorldHeartBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_sad" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleWorldSadBroadcast(payload.payload || {});
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
        state.butterflyActive !== false;
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
  if (heldItem === HELD_ITEM_BUCKET || window.OVC_SHARED_BUCKET_HELD_BY === currentSessionId) {
function sendMultiplayerPresence(forceSend) {
  if (!hasSpawnedCharacter || isTabSessionSuperseded) return;
  if (isSharedWorldSyncPausedForTutorial()) return;
    window.OVC_SHARED_BUCKET_HELD_BY = "";
  const now = Date.now();
  const butterflyActive = !document.hidden;
  const shouldShowWorldRockPickupAction =
    isWorldDocumentEntry() &&
    now - Number(lastLocalWorldRockPickupAt || 0) <= WORLD_ROCK_PICKUP_ACTION_MS;
  const shouldShowButterflyCatchAction =
    now - Number(lastLocalButterflyCatchActionAt || 0) <= REMOTE_BUTTERFLY_CATCH_ACTION_MS;
  const state = {
    id: currentSessionId,
    userId: currentUserId,
    name: nameForIngameUiDisplay(accountDisplayNameForUi()),
    action: plantRuntime.isPlanting
      ? "planting"
      : appleState.isEating
        ? "eating"
        : shouldShowWorldRockPickupAction
          ? "rock_pickup"
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
    butterflyActive,
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
      return;
  // Broadcast is the primary multiplayer sync path. Keep a heartbeat so idle
  // players stay visible even when they are not moving.
  if (
    multiplayerChannel &&
    (
      forceSend ||
      (hasChanged && now - lastBroadcastAt >= getMultiplayerBroadcastMinMs()) ||
      now - lastHeartbeatBroadcastAt >= getMultiplayerHeartbeatMs()
    )
  ) {
    Promise.resolve(multiplayerChannel.send({
      type: "broadcast",
      event: "player_state",
      payload: state
    })).catch(function (error) {
      addNetworkDebugLog(
        "broadcast error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
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
  if (!remotePlayer) return;
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
    addSyncDebugLog("remote_state_reject", {
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
  remotePlayer.nameElement.textContent = nameForIngameUiDisplay(
function handleRemoteBucketBroadcast(payload) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!payload || !payload.id || payload.id === currentSessionId) return;
  // ?? ?동?? ?고 ?을 ?는 로컬?????태???일??기? ??? ?라?언??브로?캐?트가
  // isBucketFull·좌표????Q가 ?기/붓기 ?이 ?플?시?반복?는 것처??보임.
  if (heldItem === HELD_ITEM_BUCKET) {
    return;
  }
  const remoteId = String(payload.id);
  const nextUpdatedAt = Number(payload.updatedAt || 0);
  const prevUpdatedAt = Number(remoteBucketUpdateAtById[remoteId] || 0);
  if (nextUpdatedAt < prevUpdatedAt) return;
  remoteBucketUpdateAtById[remoteId] = nextUpdatedAt;
        ? WORLD_ROCK_REMOTE_STATUS_TAIL_MS
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
  });
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
      createWaterSplashAt(nextSplashX, nextSplashY);
  isPresenceDbSyncing = true;
  lastPresenceDbSyncAt = Date.now();
  window.OVCOnline.savePresence(state).catch(function (error) {
    addNetworkDebugLog(
      "presence db save error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
  }).finally(function () {
    isPresenceDbSyncing = false;
  });
}
  const statusElement = document.createElement("div");
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
  element.appendChild(nameElement);
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
      multiplayerRoomSessionButterflyActive[String(state.id)] =
        state.butterflyActive !== false;
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
      "presence db poll error: " + (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
  }).finally(function () {
    isPresenceDbPolling = false;
  });
}
      markWorldDirty();
function sendMultiplayerLeave() {
  if (!currentSessionId) return;
  });
  if (heldItem === HELD_ITEM_BUCKET || window.OVC_SHARED_BUCKET_HELD_BY === currentSessionId) {
    if (heldItem === HELD_ITEM_BUCKET) {
      dropBucket();
    }
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    markWorldDirty();
    syncWorldState(true);
  }
    if (seenUsers[userKey]) return count;
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
    (typeof multiplayerStatusText === "string" &&
  if (window.OVCOnline && typeof window.OVCOnline.removePresence === "function") {
    Promise.resolve(window.OVCOnline.removePresence(currentSessionId)).catch(function () {
      // The page may be closing; best effort is enough here.
    });
  }
}

function renderRemotePlayersFromPresence(presenceState) {
  const nextRemotePlayers = {};
    clearTimeout(multiplayerReconnectTimeout);
  Object.keys(presenceState || {}).forEach(function (presenceKey) {
    const presences = presenceState[presenceKey];
    if (!Array.isArray(presences) || presenceKey === currentSessionId) return;

    const latestPresence = presences[presences.length - 1];
    if (!latestPresence || !latestPresence.id || latestPresence.id === currentSessionId) return;
    multiplayerRoomSessionIdsLastSeen[String(latestPresence.id)] = Date.now();
    multiplayerRoomSessionButterflyActive[String(latestPresence.id)] =
      latestPresence.butterflyActive !== false;
    if (isRemotePresenceSameLoggedInAccount(latestPresence)) {
      return;
    }
    setupMultiplayer();
    nextRemotePlayers[latestPresence.id] = latestPresence;
  });

  Object.keys(nextRemotePlayers).forEach(function (remoteId) {
    renderRemotePlayerState(nextRemotePlayers[remoteId], "presence");
  });
  const colorToSync = selectedPlayerColor.toLowerCase();
  updateRemotePlayerCount();
}
  if (window.OVCOnline && window.OVCOnline.isConfigured()) {
function handleRemotePlayerBroadcast(state) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!isValidRemotePlayerStatePayload(state) || state.id === currentSessionId) return;
  if (state.action === "leave") {
    delete remoteBucketUpdateAtById[state.id];
    delete multiplayerRoomSessionIdsLastSeen[state.id];
    delete multiplayerRoomSessionButterflyActive[state.id];
    delete lastRemoteWaterSplashAppliedAtBySession[state.id];
    removeRemotePlayer(state.id);
    return;
  }
  multiplayerRoomSessionIdsLastSeen[String(state.id)] = Date.now();
  multiplayerRoomSessionButterflyActive[String(state.id)] = state.butterflyActive !== false;
  if (isRemotePresenceSameLoggedInAccount(state)) {
    maybeApplyRemoteWaterSplashFromBroadcast(String(state.id), state);
    return;
  }
  renderRemotePlayerState(state, "broadcast");
  updateRemotePlayerCount();
}
    showOnlineDebugMessage(
function removeRemotePlayer(remoteId) {
  const remotePlayer = remotePlayers[remoteId];
  if (!remotePlayer) return;
  remotePlayer.element.remove();
  delete remotePlayers[remoteId];
  removeRemoteChatBubbleEl(remoteId);
  updateRemotePlayerCount();
}
  return remotePlayerCount + 1;
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
    empty.textContent = "\uAC00\uC785\uB41C \uACC4\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.";
  remotePlayer.nameElement.textContent = nameForIngameUiDisplay(
    state.name || "OVC"
  );
  if (statusAction) {
    const nextStatusText = getRemoteStatusText(state.action);
    if (nextStatusText) {
      remotePlayer.statusElement.textContent = nextStatusText;
      remotePlayer.statusElement.style.display = "block";
      remotePlayer.lastActionAt = Date.now();
      remotePlayer.lastShownAction = statusAction;
    }
  } else {
    const holdAfter =
      remotePlayer.lastShownAction === "rock_pickup"
        ? WORLD_ROCK_REMOTE_STATUS_TAIL_MS
        : REMOTE_ACTION_STATUS_HOLD_MS;
    const keepUntil = Number(remotePlayer.lastActionAt || 0) + holdAfter;
    if (Date.now() >= keepUntil) {
      remotePlayer.statusElement.textContent = "";
      remotePlayer.statusElement.style.display = "none";
      remotePlayer.lastActionAt = 0;
      remotePlayer.lastShownAction = "";
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
    return [];
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
  logoutConfirmOverlay.classList.remove("is-open");
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
    lastShownAction: "",
    lastSeenAt: Date.now()
  };
  return remotePlayers[remoteId];
}
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
  if (!networkDebugPanel || !networkDebugDomStale) {
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
  networkDebugLines.push("[" + timestamp + "] " + message);
function updateMultiplayerStatus(statusText) {
  multiplayerStatusText = statusText;
  if (!multiplayerStatus) return;
  networkDebugDomStale = true;
  const statusLabel =
}
    multiplayerStatusText === "?결? ||
function addBucketTrace(key, message, minIntervalMs) {
  if (!BUCKET_DEBUG_TRACE) return;
    (typeof multiplayerStatusText === "string" &&
      multiplayerStatusText.indexOf("?토리얼") !== -1)
      ? multiplayerStatusText
      : "?결 ?됨";
  multiplayerStatus.textContent =
    "멀??" + statusLabel + " / 로그??" + getOnlinePlayerCount();
}
const syncDebugHelpers = createSyncDebugHelpers({
function clearMultiplayerReconnectTimeout() {
  if (multiplayerReconnectTimeout) {
    clearTimeout(multiplayerReconnectTimeout);
    multiplayerReconnectTimeout = null;
  }
}
async function validateCurrentAccount() {
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
            showOnlineDebugMessage("삭제된 계정입니다. 로그아웃합니다.");
function syncPlayerColorToServer(forceSync) {
  if (!hasSpawnedCharacter || !currentUserId) return;
  if (!/^#[0-9a-fA-F]{6}$/.test(selectedPlayerColor || "")) return;
  const colorToSync = selectedPlayerColor.toLowerCase();
  if (!forceSync && colorToSync === lastSyncedPlayerColor) return;
      }
  if (window.OVCOnline && window.OVCOnline.isConfigured()) {
    window.OVCOnline.savePlayerColor(currentUserId, colorToSync).then(function () {
      lastSyncedPlayerColor = colorToSync;
      addNetworkDebugLog("color synced online: " + colorToSync);
    }).catch(function (error) {
      showOnlineDebugMessage(
      "로컬 ????패: " +
        (error && error.message ? error.message : "?라???버 ?인 ?요")
      );
    });
    return;
  }
  } catch (error) {
  if (!currentUserName) return;
  postJson("/api/player/color", {
    name: currentUserName,
    color: colorToSync
  }).then(function () {
    lastSyncedPlayerColor = colorToSync;
    addNetworkDebugLog("color synced local: " + colorToSync);
  }).catch(function (error) {
    showOnlineDebugMessage(
      "로컬 ????패: " +
      (error && error.message ? error.message : "?라???버 ?인 ?요")
    );
  });
}
  playerName.style.display = "none";
function getOnlinePlayerCount() {
  if (!currentUserId) return remotePlayerCount;
  return remotePlayerCount + 1;
}
  });
function openAdminPanel() {
  adminOverlay.classList.add("is-open");
  adminOverlay.setAttribute("aria-hidden", "false");
  loadAdminAccounts();
}
      sessionStorage.removeItem("ovcPostTutorialMultiplayerReconnectV1");
function closeAdminPanel() {
  adminOverlay.classList.remove("is-open");
  adminOverlay.setAttribute("aria-hidden", "true");
}
    localStorage.removeItem(currentUserIdKey);
async function loadAdminAccounts() {
  adminMessage.textContent = "\uACC4\uC815 \uBD88\uB7EC\uC624\uB294 \uC911...";
  adminAccountList.innerHTML = "";
    localStorage.removeItem(lastSelectedColorKey);
  try {
    const accounts = await window.OVCOnline.listAccounts();
    adminAccountList.dataset.accounts = JSON.stringify(accounts);
    renderAdminAccounts(accounts);
    adminMessage.textContent = accounts.length + "\uAC1C \uACC4\uC815";
  } catch (error) {
    adminMessage.textContent = error.message;
  }
}
      sessionStorage.removeItem(ovcSessionUserNameKey);
function renderAdminAccounts(accounts) {
  adminAccountList.innerHTML = "";
    window.location.href = "ovc-login.html?v=20260509a";
  if (!accounts.length) {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = "\uAC00\uC785\uB41C \uACC4\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.";
    adminAccountList.appendChild(empty);
    return;
  }
      window.OVCOnline && typeof window.OVCOnline.getClient === "function"
  accounts.forEach(function (account) {
    const row = document.createElement("div");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const meta = document.createElement("div");
    const deleteButton = document.createElement("button");
          // Continue logout even if cleanup fails.
    row.className = "admin-account-row";
    name.className = "admin-account-name";
    meta.className = "admin-account-meta";
    deleteButton.className = "admin-delete-button";
      finishLogout();
    name.textContent = account.name || "\uC774\uB984 \uC5C6\uC74C";
    meta.textContent =
      (account.color || "\uC0C9 \uC5C6\uC74C") +
      " / " +
      formatAdminDate(account.created_at);
    deleteButton.textContent = "\uC0AD\uC81C";
    deleteButton.type = "button";
function getFitZoom() {
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
// for display. Catch distance uses that same smoothed center on non-authority
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
      const count = Math.max(0, Math.floor(Number(parsed[color]) || 0));
function getRenderedAdminAccounts() {
  try {
    const parsed = JSON.parse(adminAccountList.dataset.accounts || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}
}
function formatAdminDate(value) {
  if (!value) return "\uB0A0\uC9DC \uC5C6\uC74C";
  const raw = Number(getStoredValue(magicPowderCountKey) || 0);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "\uB0A0\uC9DC \uC5C6\uC74C";

  return date.toLocaleString("ko-KR");
}
    butterflyCaughtCountsKey,
function openLogoutConfirm() {
  setSettingsOverlayOpen(settingsOverlay, false);
  logoutConfirmOverlay.classList.add("is-open");
  logoutConfirmOverlay.setAttribute("aria-hidden", "false");
}
  setStoredValue(magicPowderCountKey, String(Math.max(0, Math.floor(magicPowderCount))));
function closeLogoutConfirm() {
  logoutConfirmOverlay.classList.remove("is-open");
  logoutConfirmOverlay.setAttribute("aria-hidden", "true");
}
    return total + Math.max(0, Number(butterflyState.caughtCounts[color]) || 0);
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
  return butterflyMotion.create(now, options);
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
  });
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
  if (syncEventDedupeStore) return syncEventDedupeStore;
function addBucketTrace(key, message, minIntervalMs) {
  if (!BUCKET_DEBUG_TRACE) return;
  const now = Date.now();
  const last = Number(lastBucketTraceAtByKey[key] || 0);
  if (now - last < (minIntervalMs || 500)) return;
  lastBucketTraceAtByKey[key] = now;
  addNetworkDebugLog("[bucket:" + key + "] " + message);
}
    },
const syncDebugHelpers = createSyncDebugHelpers({
  enabled: SYNC_DEBUG_TRACE,
  addNetworkDebugLog: addNetworkDebugLog
});
const addSyncDebugLog = syncDebugHelpers.addSyncDebugLog;
syncDebugHelpers.publishSyncDebugChecklistTemplate(window);
  });
async function validateCurrentAccount() {
  if (isLoggingOut || isTabSessionSuperseded || !currentUserId || !window.OVCOnline) return;

  try {
    if (typeof window.OVCOnline.validateSession === "function") {
      const storedToken = getEffectiveOvcSessionToken();
      if (!storedToken) {
        // Token may be temporarily missing (e.g. migration/fallback path).
        // Only force logout when the account itself no longer exists.
        if (typeof window.OVCOnline.getAccount === "function") {
          const account = await window.OVCOnline.getAccount(currentUserId);
          if (!account) {
            showOnlineDebugMessage("????계정?니?? 로그?웃?니??");
            setTimeout(logout, 800);
            return;
          }
        }
        return;
      }
      const isValid = await window.OVCOnline.validateSession(currentUserId, storedToken);
      if (!isValid) {
        showOnlineDebugMessage("?른 기기?서 로그?되??로그?웃?니??");
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
  createWaterSplashAt(x, y);
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
    if (multiplayerRoomSessionButterflyActive[sid] === false) return;
  Object.keys(remotePlayers).forEach(function (remoteId) {
    remotePlayers[remoteId].element.remove();
    delete remotePlayers[remoteId];
  });
    } else if (!presenceSeenAt || now - presenceSeenAt > stateFreshMs) {
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
    try {
      sessionStorage.removeItem(ovcSessionUserIdKey);
      sessionStorage.removeItem(ovcSessionUserNameKey);
      sessionStorage.removeItem(ovcSessionTokenKey);
    } catch (eSessOut) {}
    window.location.href = "ovc-login.html?v=20260509a";
  };
    waypoint = {
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
    // lastSpawnAt만 0이면(스냅샷 누락·병합) 여기서 5마리를 한꺼번에 넣어 리스폰 주기가 무시됨.
  finishLogout();
}
      return false;
function getFitZoom() {
  return Math.max(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
}
  const elapsedCycles = Math.floor(
// ----------------------------------------------------------------------------
// Butterflies
//
// Shared multiplayer entity. One "authority" tab simulates motion (lowest
// sessionId among this client + `multiplayerRoomSessionIdsLastSeen`; same-login
// tabs are included via player_state / presence / butterfly_state so only one
// tab runs `simulateButterflyAuthorityStep`). Authority broadcasts `butterfly_state`
// every `butterflyBroadcastMs`. Others extrapolate snapshot positions and lerp
// for display. Catch distance uses that same smoothed center on non-authority
// clients so hitboxes match sprites.
//
// Catching: local remove + `butterfly_catch` broadcast (sync dedupe). Tombstones
// in `butterflyLocalCatchTombstoneById` briefly block stale snapshot resurrections.
// World DB merges always apply butterfly lists so catches persist across saves.
// `butterflyCaughtCounts` is per-player localStorage. Tutorial gates catch until
// onboarding step 18 (`tryCatchButterfly`).
//
// Respawn: authority only ??`authoritySpawnButterfliesIfNeeded` vs cap and
// `butterflyRespawnMs` since `butterflyState.lastSpawnAt`.
// ----------------------------------------------------------------------------
  }
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
  setWorldSize(element, BUTTERFLY_SIZE, BUTTERFLY_SIZE);
function loadMagicPowderCount() {
  const raw = Number(getStoredValue(magicPowderCountKey) || 0);
  magicPowderCount = Math.max(0, Math.floor(raw));
}
    color: null,
function saveButterflyCaughtCounts() {
  setStoredValue(
    butterflyCaughtCountsKey,
    JSON.stringify(butterflyState.caughtCounts)
  );
}
  butterflyRenderById[butterfly.id] = entry;
function saveMagicPowderCount() {
  setStoredValue(magicPowderCountKey, String(Math.max(0, Math.floor(magicPowderCount))));
}
function removeButterflyRenderEntry(id) {
function getTotalCaughtButterflies() {
  return butterflyColors.reduce(function (total, color) {
    return total + Math.max(0, Number(butterflyState.caughtCounts[color]) || 0);
  }, 0);
}
  delete butterflyAuthorityWaypointById[id];
function pickRandomButterflyColor() {
  return butterflyMotion.pickColor();
}
  if (entry.color === color && entry.frame === frame) return;
function pickRandomButterflySpawnPoint() {
  return butterflyMotion.pickSpawnPoint();
}
  // each unit is 100% / (cols-1) horizontally and 100% / (rows-1) vertically.
function createButterfly(now, options) {
  return butterflyMotion.create(now, options);
}
  entry.color = color;
/** ?냅?·병??버그?같? id가 ????어?는 경우 방? */
function dedupeButterfliesByIdStable(list) {
  return butterflyMotion.dedupe(list);
}
  if (entry.facingRight === facingRight) return;
/** 공유 ?한(butterflyMaxAlive) 초과 ???래??개체부???거 */
function trimButterflyListToMaxCap(list) {
  return butterflyMotion.trim(list);
}
function applyButterflyCatchable(entry, catchable) {
function pruneButterflyAuthorityWaypointsToList() {
  butterflyMotion.pruneWaypoints(butterflyState.list, butterflyAuthorityWaypointById);
}
}
function pruneStaleMultiplayerRoomSessions(now) {
  const staleMs = 45000;
  Object.keys(multiplayerRoomSessionIdsLastSeen).forEach(function (sid) {
    const seen = multiplayerRoomSessionIdsLastSeen[sid];
    if (!seen || now - seen > staleMs) {
      delete multiplayerRoomSessionIdsLastSeen[sid];
      delete multiplayerRoomSessionButterflyActive[sid];
      delete multiplayerRoomSessionButterflyStateLastSeen[sid];
      delete lastRemoteWaterSplashAppliedAtBySession[sid];
    }
  });
}
    BUTTERFLY_SIZE,
function clearMultiplayerRoomSessionTracking() {
  multiplayerRoomSessionIdsLastSeen = Object.create(null);
  multiplayerRoomSessionButterflyActive = Object.create(null);
  multiplayerRoomSessionButterflyStateLastSeen = Object.create(null);
  lastRemoteWaterSplashAppliedAtBySession = Object.create(null);
}
  butterflyState.list.forEach(function (butterfly) {
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
  const ts = Math.max(
function makeSyncEventId(kind, entityId, atMs) {
  return makeSyncEventIdCore(currentSessionId, kind, entityId, atMs);
}
  butterflyLocalCatchTombstoneById[id] = ts;
function consumeSyncEventId(eventId, nowMs) {
  return ensureSyncEventDedupeStore().consume(eventId, nowMs);
}
  butterflyState.list = butterflyState.list.filter(function (other) {
function getRemoteStateSourceRank(source) {
  return getRemoteStateSourceRankCore(source);
}
  return had;
function getRemoteStateVersion(state) {
  return getRemoteStateVersionCore(state);
}
  const t = now || Date.now();
function isValidRemotePlayerStatePayload(state) {
  return isValidRemotePlayerStatePayloadCore(state);
}
  lastButterflyStateChangeAt = t;
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
      event: "world_loose_seed_pickup",
function isButterflyAuthority() {
  if (!currentSessionId) return false;
  if (document.hidden) return false;
  const now = Date.now();
  const stateFreshMs = Math.max(900, butterflyBroadcastMs * 16);
  pruneStaleMultiplayerRoomSessions(now);
  const ids = [currentSessionId];
  Object.keys(multiplayerRoomSessionIdsLastSeen).forEach(function (sid) {
    if (multiplayerRoomSessionButterflyActive[sid] === false) return;
    const stateSeenAt = Number(multiplayerRoomSessionButterflyStateLastSeen[sid]) || 0;
    const presenceSeenAt = Number(multiplayerRoomSessionIdsLastSeen[sid]) || 0;
    if (stateSeenAt) {
      if (now - stateSeenAt > stateFreshMs) return;
    } else if (!presenceSeenAt || now - presenceSeenAt > stateFreshMs) {
      return;
    }
    if (sid !== currentSessionId) ids.push(sid);
  });
  ids.sort();
  return ids[0] === currentSessionId;
}
  }
function getNumericButterflyValue(value, fallback) {
  return getNumericButterflyValueCore(value, fallback);
}
  if (evtAt > 0 && evtAt <= Number(lastWorldLooseSeedPickupAt || 0)) {
function ensureButterflyWaypoint(butterfly, now) {
  return butterflyMotion.ensureWaypoint(butterfly, now, butterflyAuthorityWaypointById);
/*
  let waypoint = butterflyAuthorityWaypointById[butterfly.id];
  if (!waypoint || now >= waypoint.endAt) {
    const target = pickButterflyWaypoint(butterfly.x, butterfly.y);
    const dx = target.x - butterfly.x;
    const dy = target.y - butterfly.y;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    // Pixels-per-frame to ms @ ~60fps. 짧? ?리?도 2.4s?강제?면 거의 ?자리에 멈춘 것처??보임 ??거리 비? + ??? 바닥.
    const msPerFrame = 1000 / 60;
    const baseDuration = (distance / butterflySpeed) * msPerFrame;
    const wander = 140 + Math.random() * 420;
    const duration = Math.round(
      Math.max(520, Math.min(butterflyLegMaxMs, baseDuration * (0.9 + Math.random() * 0.28) + wander))
    );
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
*/
}
  const px = Number(payload.x);
function simulateButterflyAuthorityStep(butterfly, now) {
  butterflyMotion.simulate(butterfly, now, butterflyAuthorityWaypointById);
}
  saveAppleState();
function authoritySpawnButterfliesIfNeeded(now) {
  if (butterflyState.list.length >= butterflyMaxAlive) return false;
  if (!butterflyState.lastSpawnAt) {
    // 최초 ?장(?직 ?비?채운 ???음)?즉시 cap까? 채?. ?? ?드가 ?았?데
    // lastSpawnAt?0?면(?냅???락·병합) ?기??5마리??꺼번에 ?어 리스??주기가 무시??
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
  if (!rid) return;
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
        at: at,
function authorityFillToCapInstantly(now) {
  let added = false;
  while (butterflyState.list.length < butterflyMaxAlive) {
    butterflyState.list.push(createButterfly(now));
    added = true;
  }
  if (added) butterflyState.lastSpawnAt = now;
  return added;
}
  if (isSharedWorldSyncPausedForTutorial()) return;
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
    lastMotionX: null,
    facingMomentumX: 0
  };
  butterflyRenderById[butterfly.id] = entry;
  return entry;
}
    remote.lastShownAction = "rock_pickup";
function removeButterflyRenderEntry(id) {
  const entry = butterflyRenderById[id];
  if (entry && entry.element && entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
  delete butterflyRenderById[id];
  delete butterflyAuthorityWaypointById[id];
}
  const bid = String(butterflyId || "");
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
    })
function applyButterflyFacing(entry, facingRight) {
  if (entry.facingRight === facingRight) return;
  entry.element.classList.toggle("is-facing-right", facingRight);
  entry.facingRight = facingRight;
}
function handleRemoteButterflyCatchBroadcast(payload) {
function applyButterflyCatchable(entry, catchable) {
  if (entry.catchable === catchable) return;
  entry.element.classList.toggle("is-catchable", catchable);
  entry.catchable = catchable;
}
  const butterflyId = String(payload.butterflyId || "");
function getButterflyAnimationFrame(now, butterfly) {
  // Phase the animation by id length so the swarm doesn't beat in sync.
  const offset = butterfly.id.length * 53;
  return Math.floor((now + offset) / butterflyFrameMs) % butterflyFrameCount;
}
      butterflyId: butterflyId,
/** ?드 중심(cx, cy) 기? ?레?어???거리 */
function getButterflyCatchDistanceAtWorldCenter(cx, cy) {
  return getCenterDistance(
    cx - BUTTERFLY_SIZE / 2,
    cy - BUTTERFLY_SIZE / 2,
    BUTTERFLY_SIZE,
    BUTTERFLY_SIZE
  );
}
      butterflyId: butterflyId,
function findCatchableButterfly() {
  let nearest = null;
  butterflyState.list.forEach(function (butterfly) {
    const cx =
      typeof butterfly._catchProbeCx === "number" && Number.isFinite(butterfly._catchProbeCx)
        ? butterfly._catchProbeCx
        : butterfly.x;
    const cy =
      typeof butterfly._catchProbeCy === "number" && Number.isFinite(butterfly._catchProbeCy)
        ? butterfly._catchProbeCy
        : butterfly.y;
    const distance = getButterflyCatchDistanceAtWorldCenter(cx, cy);
    if (distance > butterflyCatchDistance) return;
    if (!nearest || distance < nearest.distance) {
      nearest = { butterfly: butterfly, distance: distance };
    }
  });
  return nearest;
}
  });
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
  }
function finalizeButterflyRemovalEffects(now) {
  const t = now || Date.now();
  if (!butterflyState.lastSpawnAt || t < butterflyState.lastSpawnAt) {
    butterflyState.lastSpawnAt = t;
  }
  lastButterflyStateChangeAt = t;
  markWorldDirty();
}
    butterflyCatch: true
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
    lastButterflyWallClockMs > 0 ? Math.min(60000, now - lastButterflyWallClockMs) : 0;
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
  const butterflyRemoteLerpAlpha = (function () {
function broadcastWorldRockPickup(rockId) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!isWorldDocumentEntry()) return;
  if (!multiplayerChannel || !currentSessionId) return;
  const rid = String(rockId || "");
  if (!rid) return;
  const at = Date.now();
  const eventId = makeSyncEventId("world_rock_pickup", rid, at);
  consumeSyncEventId(eventId, at);
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_rock_pickup",
      payload: {
        from: currentSessionId,
        eventId: eventId,
        at: at,
        rockId: rid
      }
    })
  ).catch(function () {
    // syncWorldState still persists pickup for polling clients.
  });
}
  const renderButterflyBounds = getActiveButterflyBounds();
function handleRemoteWorldRockPickupBroadcast(payload) {
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!isWorldDocumentEntry()) return;
  if (!payload || payload.from === currentSessionId) return;
  const rockId = String(payload.rockId || "");
  if (!rockId) return;
  const now = Date.now();
  if (!consumeSyncEventId(payload.eventId, now)) return;
  const evtAt = Math.max(0, Number(payload.at) || 0);
  if (evtAt > 0 && Math.abs(now - evtAt) > SYNC_EVENT_DEDUPE_TTL_MS) {
    return;
  }
  if (appleState.worldRockPickedIds.includes(rockId)) {
    return;
  }
  const exists = appleState.worldRocks.some(function (r) {
    return r && String(r.id) === rockId;
  });
  if (!exists) {
    return;
  }
  appleState.worldRockPickedIds.push(rockId);
  saveAppleState();
  markWorldDirty();
  updateWorldRocks();
  const remote = remotePlayers[payload.from];
  if (remote && remote.statusElement) {
    remote.statusElement.textContent = "\uB3CC \uC218\uC9D1";
    remote.statusElement.style.display = "block";
    remote.lastActionAt = Date.now();
    remote.lastShownAction = "rock_pickup";
  } else {
    showPlayerAlert({ message: "\uB3CC \uC218\uC9D1", durationMs: WORLD_ROCK_PICKUP_ACTION_MS });
  }
}
        ny = butterfly._renderY + my * s;
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
    const motionX = drawX;
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
  const remote = remotePlayers[payload.from];
  if (remote && remote.statusElement) {
    remote.statusElement.textContent = "?비 catch";
    remote.statusElement.style.display = "block";
    remote.lastActionAt = now;
    remote.lastShownAction = "butterfly_catch";
  }
  addSyncDebugLog("butterfly_catch_apply", {
    eventId: payload.eventId || "",
    butterflyId: butterflyId,
    eventAt: evtAt
  });
}
  keepButterfliesInsideActiveBounds();
function tryCatchButterfly() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 18) {
    return false;
  }
  const now = Date.now();
  if (now - lastLocalButterflyCatchAt < 200) return false;
  const target = findCatchableButterfly();
  if (!target) return false;
function broadcastButterflyState(now) {
  lastLocalButterflyCatchAt = now;
  lastLocalButterflyCatchActionAt = now;
  const caught = target.butterfly;
  stripButterflyFromSharedList(caught.id);
  if (!butterflyState.caughtCounts[caught.color]) {
    butterflyState.caughtCounts[caught.color] = 0;
  }
  butterflyState.caughtCounts[caught.color] += 1;
  saveButterflyCaughtCounts();
      id: currentSessionId,
  broadcastButterflyCatch(caught.id);
  finalizeButterflyRemovalEffects(now);
  showPlayerAlert({
    message: "\uB098\uBE44 catch",
    durationMs: 2400,
    butterflyCatch: true
  });
  sendMultiplayerPresence(true);
  updateBagInventorySlots();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === 18) {
    onboardingFlowStep = 19;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
}
  }
function updateMagicPowderInventoryUi() {
  if (magicPowderInventory) {
    magicPowderInventory.style.display = "none";
    magicPowderInventory.classList.remove("is-near");
    setInstantHoverTip(magicPowderInventory, null);
  }
  if (magicPowderCountText) {
    setInstantHoverTip(magicPowderCountText, null);
  }
  updateBagInventorySlots();
}
      butterflyState.list.forEach(function (b) {
function updateButterflies() {
  const now = Date.now();
  const wallDelta =
    lastButterflyWallClockMs > 0 ? Math.min(60000, now - lastButterflyWallClockMs) : 0;
  lastButterflyWallClockMs = now;
    return;
  // Wait until either (a) we know there's no online sync available so this
  // client is definitely authoritative on its own world, or (b) we have
  // hydrated shared state from the server. This avoids one client racing to
  // seed butterflies while another is still loading the existing population.
  const onlineAvailable = isWorldServerSyncAvailable();
  const sharedHydrated = hasHydratedSharedWorldFromServer || !onlineAvailable;
  const recvAt = now;
  if (sharedHydrated && isButterflyAuthority()) {
    if (!areButterfliesUnlockedForPlantFogWorld()) {
      if (clearLiveButterfliesForPlantFogLock(now)) {
        lastButterflyStateChangeAt = now;
        markWorldDirty();
      }
    } else {
      if (keepButterfliesInsideActiveBounds()) {
        lastButterflyStateChangeAt = now;
        markWorldDirty();
      }
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
    }
  }
  // ?비 ?치 ??? 권한 ?라?언??가????? sessionId)??행. 비권????
  // 같이 ?리??냅??좌표? ?워??2창·??에??????상???다.
  if (sharedHydrated && butterflyState.list.length > 0) {
    const runAuthorityButterflyMotion = !onlineAvailable || isButterflyAuthority();
    if (runAuthorityButterflyMotion) {
      butterflyState.list.forEach(function (butterfly) {
        simulateButterflyAuthorityStep(butterfly, now);
      });
      if (onlineAvailable && now - lastButterflyBroadcastAt >= butterflyBroadcastMs) {
        broadcastButterflyState(now);
      }
    }
  }
  // 비권?? ?냅?의 butterfly.x/y(권한???? ?치+?러???부?럽??라?
  const smoothRemoteButterflies =
    sharedHydrated && onlineAvailable && !isButterflyAuthority();
  /** ?레??간격??맞춘 지??보간(짧? dt?서??곡선???기지 ?게). */
  const butterflyRemoteLerpAlpha = (function () {
    const dt = Math.max(1, wallDelta);
    const a = 1 - Math.exp(-dt / 118);
    return Math.min(0.34, Math.max(0.08, a));
  })();
  /** 과도???발 ?프?막음(?전 ??? 캡? 계단처럼 보이???). */
  const butterflyRemoteRenderMaxStepWorld = wallDelta > 120 ? 160 : 120;
      });
  if (wallDelta > 380 && sharedHydrated && isButterflyAuthority()) {
    Object.keys(butterflyAuthorityWaypointById).forEach(function (wid) {
      delete butterflyAuthorityWaypointById[wid];
    });
  }
  if (smoothRemoteButterflies && wallDelta > 380) {
    butterflyState.list.forEach(function (b) {
      if (typeof b._renderX !== "number" || typeof b._renderY !== "number") {
        b._renderX = b.x;
        b._renderY = b.y;
      }
    });
  }
      const newX = nextPoint.x;
  // Render (?기 ?정? 보간??중심 `_catchProbe*`? ?일 ??비권???????면??치)
  const aliveIds = {};
  let catchTarget = null;
  const renderButterflyBounds = getActiveButterflyBounds();
  butterflyState.list.forEach(function (butterfly) {
    aliveIds[butterfly.id] = true;
    const entry = ensureButterflyRenderEntry(butterfly);
    let targetX = butterfly.x;
    let targetY = butterfly.y;
    if (smoothRemoteButterflies) {
      const sampleAge = Math.min(140, Math.max(0, now - (Number(butterfly._netRecvAt) || now)));
      const maxVelocity = 0.09;
      const vx = Math.max(-maxVelocity, Math.min(maxVelocity, Number(butterfly._netVx) || 0));
      const vy = Math.max(-maxVelocity, Math.min(maxVelocity, Number(butterfly._netVy) || 0));
      targetX += vx * sampleAge;
      targetY += vy * sampleAge;
      targetX = Math.max(renderButterflyBounds.left, Math.min(renderButterflyBounds.right, targetX));
      targetY = Math.max(renderButterflyBounds.top, Math.min(renderButterflyBounds.bottom, targetY));
    }
    let drawX = targetX;
    let drawY = targetY;
    if (smoothRemoteButterflies) {
      if (typeof butterfly._renderX !== "number" || typeof butterfly._renderY !== "number") {
        butterfly._renderX = targetX;
        butterfly._renderY = targetY;
      }
      const rdx = targetX - butterfly._renderX;
      const rdy = targetY - butterfly._renderY;
      const remaining = Math.hypot(rdx, rdy);
      const t = butterflyRemoteLerpAlpha;
      const smoothT = remaining < 0.55 ? t * 0.35 : t * t * (3 - 2 * t);
      let nx = butterfly._renderX + rdx * smoothT;
      let ny = butterfly._renderY + rdy * smoothT;
      let mx = nx - butterfly._renderX;
      let my = ny - butterfly._renderY;
      const mlen = Math.hypot(mx, my);
      if (mlen > butterflyRemoteRenderMaxStepWorld && mlen > 0.0001) {
        const s = butterflyRemoteRenderMaxStepWorld / mlen;
        nx = butterfly._renderX + mx * s;
        ny = butterfly._renderY + my * s;
      }
      butterfly._renderX = nx;
      butterfly._renderY = ny;
      drawX = nx;
      drawY = ny;
    } else {
      // 권한 ?라?언?·오?라?? ?? 좌표가 ?진실? ?기???????보간?면
      // ??레??갱신?는 ?러?·경로보???면???박자 ????버벅?처??보임(?창 권한 ???함).
      butterfly._renderX = butterfly.x;
      butterfly._renderY = butterfly.y;
      drawX = butterfly.x;
      drawY = butterfly.y;
    }
    butterfly._catchProbeCx = drawX;
    butterfly._catchProbeCy = drawY;
    const catchDist = getButterflyCatchDistanceAtWorldCenter(drawX, drawY);
    if (catchDist <= butterflyCatchDistance) {
      if (!catchTarget || catchDist < catchTarget.distance) {
        catchTarget = { butterfly: butterfly, distance: catchDist };
      }
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
      entry.facingMomentumX = 0;
    } else {
      // Two visible tabs can produce tiny back/forth network jitter.
      // Accumulate horizontal motion and flip only after clear directional intent.
      const clampedDx = Math.max(-0.35, Math.min(0.35, drawDx));
      const momentum = Number(entry.facingMomentumX) || 0;
      entry.facingMomentumX = Math.max(-1.4, Math.min(1.4, momentum * 0.84 + clampedDx));
      if (!facingRight && entry.facingMomentumX > 0.95) {
        facingRight = true;
        entry.facingMomentumX = 0;
      } else if (facingRight && entry.facingMomentumX < -0.95) {
        facingRight = false;
        entry.facingMomentumX = 0;
      }
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
  setStoredValue(
function getButterflyStateForSnapshot() {
  keepButterfliesInsideActiveBounds();
  const before = butterflyState.list;
  const snapshot = butterflyMotion.snapshotFromState(butterflyState);
  if (before !== butterflyState.list) {
    pruneButterflyAuthorityWaypointsToList();
  }
  return snapshot;
}

function broadcastButterflyState(now) {
  if (!multiplayerChannel || !currentSessionId) return;
  lastButterflyBroadcastAt = now;
  multiplayerRoomSessionButterflyStateLastSeen[currentSessionId] = now;
  lastButterflyStateChangeAt = now;
  markWorldDirty();
  Promise.resolve(multiplayerChannel.send({
    type: "broadcast",
    event: "butterfly_state",
    payload: {
      id: currentSessionId,
      sentAt: now,
      butterflies: getButterflyStateForSnapshot()
    }
  })).catch(function () {
    // World sync remains the fallback when realtime misses an update.
  });
}
  setWorldSize(playerColorBody, PLAYER_WIDTH, PLAYER_HEIGHT);
function handleRemoteButterflyStateBroadcast(payload) {
  if (!payload || payload.id === currentSessionId) return;
  if (isSharedWorldSyncPausedForTutorial()) return;
  const sender = String(payload.id || "").trim();
  if (sender) {
    multiplayerRoomSessionIdsLastSeen[sender] = Date.now();
    multiplayerRoomSessionButterflyActive[sender] = true;
    multiplayerRoomSessionButterflyStateLastSeen[sender] = Date.now();
  }
  if (isButterflyAuthority()) return;
  const snapshot = payload.butterflies || payload;
  const sentAt = Number(payload.sentAt) || Date.now();
  lastButterflyRealtimeStateAt = Math.max(lastButterflyRealtimeStateAt, sentAt);
  applyButterflySnapshot(snapshot, sentAt);
}
  setWorldSize(plantSpot, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
function applyButterflySnapshot(snapshotButterflies, networkSampleAtMs) {
  if (!snapshotButterflies || typeof snapshotButterflies !== "object") return;
  if (!areButterfliesUnlockedForPlantFogWorld()) {
    if (butterflyState.list.length > 0) {
      butterflyState.list.forEach(function (b) {
        if (b && b.id != null) removeButterflyRenderEntry(b.id);
      });
      butterflyState.list = [];
      pruneButterflyAuthorityWaypointsToList();
    }
    return;
  }
  const now = Date.now();
  const sampleAt =
    Number.isFinite(Number(networkSampleAtMs)) && Number(networkSampleAtMs) > 0
      ? Number(networkSampleAtMs)
      : now;
  const recvAt = now;
  // Purge old tombstones so the map stays bounded.
  Object.keys(butterflyLocalCatchTombstoneById).forEach(function (id) {
    if (now - butterflyLocalCatchTombstoneById[id] > BUTTERFLY_LOCAL_CATCH_TOMBSTONE_MS) {
      delete butterflyLocalCatchTombstoneById[id];
    }
  });
  const incomingList = butterflyMotion.normalizeSnapshotList(snapshotButterflies.list);
  if (incomingList.length > 0) {
    hasSeededInitialButterflies = true;
  }
  const incomingById = {};
  incomingList.forEach(function (raw) {
    if (!raw || !raw.id) return;
    if (butterflyLocalCatchTombstoneById[String(raw.id)]) return;
    incomingById[String(raw.id)] = raw;
  });
  updateWellImage();
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
      const spawn = clampButterflyPointToActiveBounds(raw.x, raw.y);
      const butterfly = createButterfly(Date.now(), {
        id: raw.id,
        color: raw.color,
        spawn
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
      const prevX = Number.isFinite(Number(butterfly.x)) ? butterfly.x : null;
      const prevY = Number.isFinite(Number(butterfly.y)) ? butterfly.y : null;
      const prevSampleAt = butterfly._netSampleAt;
      const nextPoint = clampButterflyPointToActiveBounds(
        getNumericButterflyValue(raw.x, prevX != null ? prevX : butterflyBoundsLeft),
        getNumericButterflyValue(raw.y, prevY != null ? prevY : butterflyBoundsTop)
      );
      const newX = nextPoint.x;
      const newY = nextPoint.y;
      if (prevX != null && prevY != null && Number.isFinite(prevSampleAt) && prevSampleAt > 0) {
        const dtMs = Math.max(16, sampleAt - prevSampleAt);
        const rawVx = (newX - prevX) / dtMs;
        const rawVy = (newY - prevY) / dtMs;
        const prevVx = Number(butterfly._netVx) || 0;
        const prevVy = Number(butterfly._netVy) || 0;
        const blend = 0.26;
        butterfly._netVx = prevVx * (1 - blend) + rawVx * blend;
        butterfly._netVy = prevVy * (1 - blend) + rawVy * blend;
      } else {
        butterfly._netVx = 0;
        butterfly._netVy = 0;
      }
      butterfly._netSampleAt = sampleAt;
      butterfly._netRecvAt = recvAt;
      butterfly.x = newX;
      butterfly.y = newY;
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
    if (currentUserId && getStoredFlag(onboardingFlowDoneKey)) {
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
    );
  const rawLast = snapshotButterflies.lastSpawnAt;
  const parsedLast = Number(rawLast);
  const hasValidSnapshotSpawnAt =
    Number.isFinite(parsedLast) && parsedLast > 0;
        if (
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
    if (!isWorldServerSyncAvailable() || isSharedWorldSyncPausedForTutorial()) {
function gameLoop() {
  if (isTabSessionSuperseded) return;
  syncLocalPlayerVisibility();
  gameLoopCyclesForTutorialSync += 1;
  if (gameLoopCyclesForTutorialSync >= 420) {
    gameLoopCyclesForTutorialSync = 0;
    requestAccountTutorialDoneSync();
  }
  respawnApplesIfNeeded();
  tickWorldRockRespawn(Date.now());
  refillWellIfNeeded();
  movementTutorial.prepareBeforeMove();
  updatePlayerPosition();
  onboardingCheckJumpFinish();
  movementTutorial.advanceAfterMove();
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
  updatePlantProgressGauge();
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
  validateCurrentAccount();
function savePlayerPosition(forceSave) {
  const now = Date.now();
  if (!forceSave && now - lastPlayerPositionSavedAt < 400) return;
  zoomLevel = clampZoom(zoomLevel);
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
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updateCamera();
  savePlayerPosition(true);
}

function setup() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const wellSize = getWellSize();

  setWorldSize(localPlayerRoot, PLAYER_WIDTH);
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
  if (tradeMaster) setWorldSize(tradeMaster, NPC_WIDTH, NPC_HEIGHT);
  if (alchemyMaster) setWorldSize(alchemyMaster, NPC_WIDTH, NPC_HEIGHT);
  setWorldSize(signBoard, SIGN_WIDTH, SIGN_HEIGHT);
  setWorldSize(guideBook, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT);
  if (worldBag) setWorldSize(worldBag, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT);
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
  if (worldBag) setWorldPosition(worldBag, worldBagX, worldBagY);
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  setWorldPosition(plantSpot, plantRuntime.spotX, plantRuntime.spotY);
  if (worldPlantFog) {
    syncWorldPlantFogVisuals();
  }
  updateWellImage();
  updateSeedPosition();
  updateBucketPosition();
  updatePlantState();
  updateWorldRocks();
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
    if (isTutorialDocumentEntry()) {
      clearTutorialSessionWorldFloorPickupFlags();
    }
    loadGuideBookState();
    if (currentUserId && getStoredFlag(onboardingFlowDoneKey)) {
      setStoredFlag(everBeenToWorldKey, true);
    }
    loadPlayerPosition();
    loadButterflyCaughtCounts();
    loadMagicPowderCount();
    updateBagInventorySlots();
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
  sendMultiplayerPresence(false);
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
