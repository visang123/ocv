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
  canPickWorldLooseSeedAt,
  createDefaultWorldLooseSeedRecord,
  isWorldLooseSpawnReady,
  isWorldLooseSyntheticPickupCandidate,
  normalizeWorldLooseSeedRecord,
  reconcileWorldLoosePickupLock,
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
  PLAYER_SIT_WIDTH,
  PLAYER_SIT_HEIGHT,
  PLAYER_BASE_IMAGE_SRC,
  PLAYER_SIT_IMAGE_SRC,
  IMG_BUCKET_EMPTY,
  IMG_BUCKET_FULL,
  IMG_SEED,
  IMG_SEED_DRY,
  IMG_SOIL_ROTTEN,
  IMG_SOIL_WET,
  IMG_SOIL_DRY,
  IMG_TILLED_SOIL,
  IMG_SPROUT,
  IMG_WATER_NEEDED,
  IMG_WELL,
  IMG_WELL_EMPTY,
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
  flowerStage4Image,
  flowerStage5Image,
  treeStage4Image,
  treeStage5Image,
  cactusStage4Image,
  cactusStage5Image,
  SPROUT_STAGE_WIDTHS,
  SPROUT_STAGE_HEIGHTS,
  grassStage4WorldScale,
  grassStage5WorldScale,
  getMatureSpriteAnchor,
  pickupDistance,
  bucketPickupDistance,
  guideInteractDistance,
  npcInteractDistance,
  wellUseDistance,
  wellPourDistance,
  wellCardDistance,
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
  cactusLevel5GrowMs,
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
  playerHealthKey,
  wellWaterKey,
  lastWellRefillKey,
  seedCreatedAtKey,
  seedPlantedStateKey,
  hasGuideBookKey,
  worldBagFloorPickedAccountKey,
  npcDialogueCompleteKey,
  tradeMasterDialogueCompleteKey,
  alchemyMasterDialogueCompleteKey,
  craftFurnitureCountsKey,
  coloredMagicPowderCountsKey,
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
  alchemyMasterBubble,
  tradeExchangeOverlay,
  tradeCounterSlot,
  tradeTradeableList,
  tradeOfferList,
  tradeExchangeConfirm,
  tradeExchangeClose,
  alchemyCraftOverlay,
  alchemyCraftProductList,
  alchemyCraftRequirementsBlock,
  alchemyCraftRequirementSlots,
  alchemyCraftRequirementSummary,
  alchemyCraftConfirm,
  alchemyCraftClose,
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
  bagBookStorageSlot,
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
  plantHoverRing,
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
import { tryConsumeWheelForOpenUi } from "./src/systems/wheel-ui-scroll.js";
import {
  clearStoredKeys,
  purgeLocalStorageKeysForLogicalKey,
  purgeRoomKeyedPickupFlags,
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
  isMagicPowderBagType,
  isFlowerMaturePlant,
  isTreeMaturePlant,
  isCactusMaturePlant,
  isColoredMaturePlant,
  normalizePlantMatureKind,
  getMatureKindForPowderBagType,
  getColoredPowderCountField,
  normalizeMagicPowderBagType
} from "./src/game/magic-powder.js";
import {
  getPlantIndexPointsForSinglePlant as getPlantIndexPointsForSinglePlantCore,
  sumPlantIndexScoreForPlants,
  reconcileMaturePlantGrowthTierFromOrdinal
} from "./src/game/plant-index.js";
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
  getRemoteStatusText,
  getRemotePlayerIdentityKey,
  pruneDuplicateRemotePlayerSessions
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
  getPlantWorldAnchorXY,
  getPlantDepthSortY as getPlantDepthSortYCore,
  mapPlantDepthSortYToZIndex,
  worldRectsOverlap,
  collectPlantsUnderWorldPoint as collectPlantsUnderWorldPointCore,
  pickPlantHoverFromUnderPointer as pickPlantHoverFromUnderPointerCore,
  getPlantsToFadeForHoverTarget as getPlantsToFadeForHoverTargetCore
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
  hideAppLoadingScreen,
  dismissAppLoadingScreenAfterDevReset
} from "./src/app/loading-screen.js";
import {
  setOverlayOpen as setSettingsOverlayOpen,
  updateSettingsTutorialButtons as updateSettingsTutorialButtonsUi
} from "./src/app/settings-panel.js";
import {
  ovcTutorialReplaySessionKey,
  ovcTutorialWorldResetPendingKey,
  ovcTutorialIntentionalEntryActive,
  ovcClearPendingWorldHubMarkers,
  ovcTutorialPageUrl,
  ovcWorldIndexUrl,
  ovcHardNavigateToWorldIndex,
  ovcForceWorldHubIsRequested
} from "./src/app/ovc-world-hub.js";
import {
  isWorldMapDevResetShortcut,
  bootDevWorldReset,
  finishDevWorldResetBoot,
  markPendingDevWorldReset
} from "./src/app/dev-world-reset.js";
import { normalizeHexColor, nameForIngameUiDisplay } from "./src/util/user-display.js";
import {
  storageKeyMainSeedPickedForRoom,
  getWorldFloorPickupStorageSlugs
} from "./src/game/room-storage-keys.js";
import {
  loadBagInventoryOrder as loadBagInventoryOrderCore,
  saveBagInventoryOrder as saveBagInventoryOrderCore,
  normalizeBagInventoryOrderByCounts as normalizeBagInventoryOrderByCountsCore,
  getBagItemDescriptor as getBagItemDescriptorCore,
  canBagInventoryFitItems,
  BAG_INVENTORY_SLOT_COUNT,
  bagInventoryOrderKey
} from "./src/game/bag-inventory.js?v=20260517c";
import {
  BAG_DROP_WORLD_SIZE,
  BAG_DROP_FOOT_OFFSET_Y,
  canDiscardBagItemKey,
  createWorldBagDropId,
  findNearestWorldBagDropPickup,
  formatWorldBagDropCountLabel,
  getBagDropGroundVisual,
  getBagDropStackKey,
  getWorldBagDropZIndex,
  isWorldBagDropExpired,
  parseWorldBagDropFromSnapshot,
  serializeWorldBagDropForSnapshot,
  snapBagDropCoord,
  sortWorldBagDropsForRender
} from "./src/game/bag-ground-drops.js";
import {
  cancelBagDiscardQuantityModal,
  isBagDiscardModalOpen,
  openBagDiscardQuantityModal
} from "./src/game/bag-discard-ui.js";
import {
  bindTradeMaster,
  cancelTradeOnPlayerHealthDepleted,
  closeTradeExchangePanel,
  handleBagSlotClickWhileTradeOpen,
  hydrateTradeMasterDialogueComplete,
  isNearTradeMaster,
  isTradeExchangeOpen,
  isTradeMasterDialogueRunning,
  pickWorldNpcHover,
  clearWorldNpcHoverSticky,
  tryTalkToTradeMaster,
  updateTradeNpcPrompt,
  relayoutTradeMasterSpeechBubble,
  canDragBagItemToTradeCounter,
  tryDropBagItemOnTradeCounter,
  returnTradeCounterStackToInventory
} from "./src/game/trade-master-ui.js?v=20260517y";
import {
  bindAlchemyMaster,
  closeAlchemyCraftPanel,
  handleBagSlotClickWhileAlchemyCraftOpen,
  hydrateAlchemyMasterDialogueComplete,
  isAlchemyCraftOpen,
  isAlchemyMasterDialogueRunning,
  isNearAlchemyMaster,
  tryTalkToAlchemyMaster,
  updateAlchemyCraftEffects,
  updateAlchemyNpcPrompt,
  relayoutAlchemyMasterSpeechBubble,
  canDragBagItemToAlchemyCraft,
  tryDropBagItemOnAlchemyRequirement,
  returnAlchemySlotStackToInventory
} from "./src/game/alchemy-master-ui.js";
import {
  isCraftFurnitureKind,
  getCraftFurnitureWorldSpec,
  computeCraftFurniturePlacement,
  serializePlacedCraftFurnitureForSnapshot,
  parsePlacedCraftFurnitureFromSnapshot,
  assignCraftFurnitureIdentity,
  refreshCraftFurnitureIdentityOrdinals,
  getCraftFurnitureWorldLabel,
  getCraftFurnitureInstallDurationMs,
  getCraftFurnitureInstallPresenceAction,
  getCraftFurnitureInstallStatusText
} from "./src/game/craft-furniture-world.js";
import {
  PLAYER_MAX_HEALTH,
  PLAYER_APPLE_HEAL_AMOUNT,
  PLAYER_HEALTH_DRAIN_INTERVAL_MS,
  PLAYER_CHAIR_INTERACT_DISTANCE,
  clampPlayerHealth,
  healPlayerHealth,
  canPlayerMoveByHealth,
  isPlayerHealthDepleted,
  findNearestCraftChair,
  findCraftHousePlayerIsTouching,
  getCraftChairSitPose,
  shouldDrainPlayerHealth,
  isPlayerMovementKeyActive,
  isPlayerPoseUnchanged,
  tickPlayerHealthState
} from "./src/game/player-health.js";

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
/** 25????: 0 = ??? ?????(2??, 1 = ????? ????? ????? */
let onboardingPostAppleSeedIntroPhase = 0;
let onboardingFruitIntroTimerId = null;
/** 16????: 0 = ????? ??, 1 = ????????????(??????????? ????? 16) */
let onboardingPostWaterCongratsPhase = 0;
/** 17????: 0 = ??????????? 1, 1 = ???? ???? 2 */
let onboardingPlantIndexIntroPhase = 0;
let onboardingPlantIndexIntroTimerId = null;
let onboardingTutorialRockMounted = false;
const ONBOARDING_MAX_STEP = 34;
const ONBOARDING_STEP_PLANT_INDEX = 17;
const ONBOARDING_STEP_DROP_BUCKET = 18;
const ONBOARDING_STEP_CHAT = 19;
const ONBOARDING_STEP_HEART = 20;
const ONBOARDING_STEP_SAD = 21;
const ONBOARDING_STEP_ROCK = 22;
const ONBOARDING_STEP_BUTTERFLY = 23;
const ONBOARDING_STEP_TRADE_MASTER = 24;
const ONBOARDING_STEP_ALCHEMY_MASTER = 25;
const ONBOARDING_STEP_ZOOM_INTRO = 26;
const ONBOARDING_STEP_ZOOM_MIN = 27;
const ONBOARDING_STEP_TREE_APPROACH = 28;
const ONBOARDING_STEP_TREE_CLIMB = 29;
const ONBOARDING_STEP_PICK_APPLE = 30;
const ONBOARDING_STEP_EAT_APPLE = 31;
const ONBOARDING_STEP_EXTRA_SEED = 32;
const ONBOARDING_STEP_SETTINGS_ESC = 33;
const ONBOARDING_STEP_COMPLETE = 34;
const TUTORIAL_ONBOARDING_ROCK_ID = "tutorial-onboarding-rock-v1";
/** tutorial.html: ???? ????????? ??????????????????? ???????(ms) */
const TUTORIAL_MAIN_SEED_RESPAWN_MS = 5000;
let tutorialMainSeedRespawnTimerId = null;
/** setTimeout ??: ?? ????? due ??? ?? ?? ? ?? ??? */
let tutorialMainSeedRespawnDueAt = 0;
/** ???????????????????? ????????? ??????????????? ?????(?????????). */
let tutorialMainSeedRegenCompleted = false;
let onboardingStep26OpenedSettingsWithEsc = false;
let tutorialWorldNeedsFullReset = false;
let heldItem = null;
let isBucketFull = false;
const MAIN_BUCKET_ID = "main";
let heldBucketId = "";
let heldExtraBucketMainX = 0;
let heldExtraBucketMainY = 0;
let heldExtraBucketMainIsFull = false;
/** ?? ???? ?? ?? ? ?? ?? ?? ?? ??? ??(? ??? ??) */
let mainBucketParkedX = 0;
let mainBucketParkedY = 0;
let mainBucketParkedIsFull = false;
const plantRuntime = createPlantState();
let lastPlantProximityBlockMessage = "";
let plantProximityWarnUntil = 0;
const PLANT_WATER_TOO_FAR_MESSAGE = "\uC2DD\uBB3C\uACFC \uAC70\uB9AC\uAC00 \uBA40\uC2B5\uB2C8\uB2E4.";
let npcX = NPC_START_X;
let npcY = NPC_START_Y;
let isNpcDialogueRunning = false;
let isNpcDialogueComplete = false;
let isGuidePlantPageUnlocked = false;
let guidePageIndex = 0;
let npcPromptHideTimeout = null;
let plantMasterDialogueTimeoutIds = [];
let plantMasterDialogueGeneration = 0;
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
/** ??????? ??????????(ovc-login.js?? ??? ??. ???????localStorage???? ????? */
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

function accountTutorialDoneTruthy(account) {
  if (!account) return false;
  const v = account.tutorial_done;
  return v === true || v === 1 || v === "1" || v === "true";
}

/** ???? ???? tutorial_done ????? ?????????(??? ??????????????) */
function hydrateTutorialProgressFromServerAccount(account) {
  if (ovcTutorialIntentionalEntryActive()) return false;
  if (!accountTutorialDoneTruthy(account)) return false;
  setOnboardingFlowDoneStored(true);
  setStoredFlag(everBeenToWorldKey, true);
  setStoredValue(onboardingFlowStepKey, "0");
  onboardingFlowStep = 0;
  try {
    sessionStorage.removeItem(ovcTutorialReplaySessionKey);
    sessionStorage.removeItem("ovcTutorialWorldResetPending");
  } catch (eClr) {}
  return true;
}

async function syncTutorialDoneFromServerIfNeeded() {
  if (ovcTutorialIntentionalEntryActive()) {
    return false;
  }
  if (!currentUserId || getStoredFlag(onboardingFlowDoneKey)) {
    return Boolean(getStoredFlag(onboardingFlowDoneKey));
  }
  if (!window.OVCOnline || typeof window.OVCOnline.getAccount !== "function") {
    return false;
  }
  try {
    const account = await window.OVCOnline.getAccount(currentUserId);
    return hydrateTutorialProgressFromServerAccount(account);
  } catch (eSync) {
    return false;
  }
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
/** Previous tab session id; broadcast leave after multiplayer reconnects. */
let pendingPreviousSessionLeaveId = "";
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

/** ?????????????? ??????????????????? ??? ????? ???(?????????? ???) */
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
  const slugs = getWorldFloorPickupStorageSlugs();
  slugs.forEach(function (slug) {
    removeStoredValue(keyPrefix + slug);
  });
  purgeRoomKeyedPickupFlags(keyPrefix, slugs);
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

/** ?????(index): ??? ???? ?????????: ???? ????? ??(session)??????????? ????. */
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

/** ????UI ???????? ????? ???? ?? ????? 0(????? ??? ???? ?????????? ????). */
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
  const seenMagicPowder = new Set();
  return loadBagInventoryOrderCore(getStoredValue)
    .map(normalizeBagItemKey)
    .filter(function (key) {
      if (key === "book") return false;
      if (key !== "magicPowder") return true;
      if (seenMagicPowder.has("magicPowder")) return false;
      seenMagicPowder.add("magicPowder");
      return true;
    });
}

function saveBagInventoryOrder() {
  saveBagInventoryOrderCore(setStoredValue, bagInventoryItemOrder);
}

function normalizeBagItemKey(itemKey) {
  return itemKey === "magicPowderMixed" ? "magicPowder" : itemKey;
}

/** ????????? ????? ???????? ??????????*/
function migrateLegacyMixedMagicPowderIntoBase() {
  const mixed = Math.max(0, Math.floor(Number(coloredMagicPowderCounts.mixed) || 0));
  let changed = mixed > 0;
  if (mixed > 0) {
    magicPowderCount = Math.max(0, Math.floor(magicPowderCount) || 0) + mixed;
    coloredMagicPowderCounts.mixed = 0;
    saveMagicPowderCount();
    saveColoredMagicPowderCounts();
  }
  if (bagInventoryItemOrder.indexOf("magicPowderMixed") >= 0) {
    bagInventoryItemOrder = bagInventoryItemOrder.map(normalizeBagItemKey);
    const seenMagicPowder = new Set();
    bagInventoryItemOrder = bagInventoryItemOrder.filter(function (key) {
      if (key !== "magicPowder") return true;
      if (seenMagicPowder.has("magicPowder")) return false;
      seenMagicPowder.add("magicPowder");
      return true;
    });
    saveBagInventoryOrder();
    changed = true;
  }
  return changed;
}

bagInventoryItemOrder = loadBagInventoryOrder();
if (bagInventoryItemOrder.some(function (key) { return key === "book"; })) {
  bagInventoryItemOrder = bagInventoryItemOrder.filter(function (key) {
    return key !== "book";
  });
  saveBagInventoryOrder();
}
if (bagInventoryItemOrder.length > BAG_INVENTORY_SLOT_COUNT) {
  bagInventoryItemOrder = bagInventoryItemOrder.slice(0, BAG_INVENTORY_SLOT_COUNT);
  saveBagInventoryOrder();
}

let plantProgressScoreTickRowBound = false;
/** ????? ??????????????500 ???? ??? ??????? ???(?? ???) */
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

function canUseBagInventoryGameplay() {
  return shouldShowWorldBagInventoryUi();
}

function showBagRequiredForGameplayMessage() {
  showPlayerAlert({
    message: "\uBA3C\uC800 \uAC00\uBC29\uC744 \uC8FC\uC6CC\uC57C \uD574\uC694.",
    durationMs: 2200
  });
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

function getPlantIndexScoringOptions(now) {
  return {
    now: now != null ? now : getSharedPlantSimulationNow(),
    getSproutStageFromPlant: getSproutStageFromPlant,
    isPowderUpgradeInProgress: isPowderUpgradeInProgress,
    getPowderUpgradeRatio: getPowderUpgradeRatio,
    getGrassAutoTier5GrowthRatio: getGrassAutoTier5GrowthRatio
  };
}

function getPlantIndexPointsForSinglePlant(plant) {
  return getPlantIndexPointsForSinglePlantCore(plant, getPlantIndexScoringOptions());
}

function getTotalPlantIndexScore() {
  const plants = [];
  if (plantRuntime && plantRuntime.isSeedPlanted) {
    plants.push(plantRuntime);
  }
  if (appleState && Array.isArray(appleState.extraPlants)) {
    appleState.extraPlants.forEach(function (p) {
      if (p && !p.removed) plants.push(p);
    });
  }
  const bonus = Math.max(0, Math.floor(Number(adminDebugPlantIndexBonus) || 0));
  return sumPlantIndexScoreForPlants(plants, getPlantIndexScoringOptions(), bonus);
}

function getPlantFogClearRectForCurrentScore() {
  const stage = getPlantFogWorldStageFromScore(getTotalPlantIndexScore());
  return getPlantFogClearRectWorldPx(stage);
}

/** ????????? ???????? ???? ??????????? ???? ??? ????? ??????????????????? */
function getPlantFogClearRectForMovementClamp() {
  return getPlantFogClearRectForCurrentScore();
}

function isPlantFogMovementClampActive() {
  if (!isWorldDocumentEntry()) return false;
  if (getTotalPlantIndexScore() >= PLANT_INDEX_SCORE_CAP) return false;
  return true;
}

/** ???????125+(???? ????? 2)????????E ?? ????? */
function isWorldRockPickupUnlocked() {
  if (!isWorldDocumentEntry()) return false;
  return getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= 2;
}

function isTradeMasterVisible() {
  if (
    isMainGameTutorialInProgress() &&
    onboardingFlowStep === ONBOARDING_STEP_TRADE_MASTER
  ) {
    return true;
  }
  if (!isWorldDocumentEntry()) return false;
  return (
    getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= PLANT_FOG_TRADE_MASTER_MIN_STAGE
  );
}

function isAlchemyMasterVisible() {
  if (
    isMainGameTutorialInProgress() &&
    onboardingFlowStep === ONBOARDING_STEP_ALCHEMY_MASTER
  ) {
    return true;
  }
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
  const tutorialPlantIndexFog =
    isMainGameTutorialInProgress() &&
    onboardingFlowStep === ONBOARDING_STEP_PLANT_INDEX;
  if (!isWorldDocumentEntry() && !tutorialPlantIndexFog) {
    if (worldPlantFog) worldPlantFog.style.display = "none";
    if (worldSkyFog) worldSkyFog.style.display = "none";
    if (world) world.style.filter = "";
    return;
  }
  const stage = tutorialPlantIndexFog
    ? 2
    : getPlantFogWorldStageFromScore(getTotalPlantIndexScore());
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

function areButterfliesUnlockedForTutorialOnboarding() {
  return (
    isMainGameTutorialInProgress() &&
    onboardingFlowStep === ONBOARDING_STEP_BUTTERFLY
  );
}

function areButterfliesUnlockedForPlantFogWorld() {
  if (areButterfliesUnlockedForTutorialOnboarding()) return true;
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
    const hidden = isWorldFloorBagHiddenForCurrentView();
    worldBag.style.display = hidden ? "none" : "block";
    worldBag.classList.toggle("is-awaiting-pickup", !hidden);
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
/** ????? ???(???+Q ?????? ??????? ????? ?? ???? ????? */
const PLANT_WATER_POUR_COOLDOWN_MS = 220;
let lastPlantWaterPourAt = 0;
/** ???? ???? updatePlantWaterLevel?????? ????????? ??????????? ??????*/
let suppressPlantWaterDecayUntilSim = 0;
const WORLD_CHAT_LOG_CAP = 80;
const WORLD_CHAT_HEAD_BUBBLE_MS = 10000;
const REMOTE_ACTION_STATUS_HOLD_MS = 1800;
const REMOTE_BUTTERFLY_CATCH_ACTION_MS = 1000;
/** ????????presence???????? ????? ????? ??(????? rock_pickup ???? ??hold ????) */
const WORLD_ROCK_PICKUP_ACTION_MS = 1000;
/** ??? ?????????: rock_pickup ?????????? ??????? ????????? ??????ms(??? ??????? REMOTE_ACTION_STATUS_HOLD_MS) */
const WORLD_ROCK_REMOTE_STATUS_TAIL_MS = 0;
const REMOTE_WATER_SPLASH_ACCEPT_MS = 60000;
const REMOTE_PLAYER_SMOOTHING_MS = 130;
const REMOTE_PLAYER_JUMP_SMOOTHING_MS = 85;
const REMOTE_PLAYER_SNAP_DISTANCE = 42;
const REMOTE_PLAYER_JUMP_SNAP_DISTANCE = 3;
const REMOTE_PLAYER_SNAP_EPSILON = 0.04;
/** ????? ??player_state??????? ???? ??? ????????????? ???? ??*/
const REMOTE_PLAYER_JUMP_BROADCAST_MIN_MS = 50;
const REMOTE_PLAYER_AIRBORNE_JUMP_Y = 0.06;
const MAX_SNAPSHOT_CLOCK_SKEW_MS = 60000;
const SYNC_EVENT_DEDUPE_TTL_MS = 120000;
const SYNC_EVENT_DEDUPE_MAX = 4000;
const SYNC_DEBUG_TRACE = false;
const WORLD_HEART_FX_MS = 2200;
/** \uC2AC\uD37C\uC694 \uBC84\uD2BC\uC6A9 \uC774\uBAA8\uC9C0(\uD83D\uDE22) */
const WORLD_SAD_BUTTON_EMOJI = "\uD83D\uDE22";
const WORLD_CHAT_MAX_CHARS = 120;

/** \uC2AC\uD37C\uC694 \uC774\uD399\uD2B8 \uCCAB \uC54C\uACB9\uC774 \u2014 CSS \uC2AC\uD508 \uC5BC\uAD74(\uB208\uBB3C \uD3EC\uD568) */
function createOvcSadFaceElement() {
  const face = document.createElement("span");
  face.className = "ovc-sad-face";
  face.setAttribute("aria-hidden", "true");
  face.innerHTML =
    '<span class="ovc-sad-face__head"></span>' +
    '<span class="ovc-sad-face__brow ovc-sad-face__brow--l"></span>' +
    '<span class="ovc-sad-face__brow ovc-sad-face__brow--r"></span>' +
    '<span class="ovc-sad-face__eye ovc-sad-face__eye--l"></span>' +
    '<span class="ovc-sad-face__eye ovc-sad-face__eye--r"></span>' +
    '<span class="ovc-sad-face__mouth"></span>' +
    '<span class="ovc-sad-face__tear ovc-sad-face__tear--l"></span>' +
    '<span class="ovc-sad-face__tear ovc-sad-face__tear--r"></span>';
  return face;
}
/** ??? ????? ?????(???????????? ?????). */
const WORLD_CHAT_GLOBAL_PREFIX = "\uC804\uCCB4:";
/** ??? ???(U+FF1A) ?????(U+003A)???? ??? ??IME??????????????/??? ????????? ???? */
function normalizeWorldChatColonsForParsing(str) {
  return String(str || "").replace(/\uFF1A/g, ":");
}

/** UTF-16 ??????????? ????????? ????? ???? ???? */
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
/** ???????????????????? ??????????????????????????? ???? ????? ????????????? ???? ????????? ???? */
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
const rockInventoryCountKey = "rockInventoryCountV1";
const MAGIC_POWDER_USE_DISTANCE = Math.max(plantWaterDistance, 72);
let magicPowderCount = 0;
let rockInventoryCount = 0;
/** @type {Record<string, number>} */
let craftFurnitureCounts = {
  craftDesk: 0,
  craftFence: 0,
  craftChair: 0,
  craftHouse: 0
};
/** @type {Array<{ id: string, kind: string, x: number, y: number, width: number, height: number, _el?: HTMLElement }>} */
let placedCraftFurniture = [];
let craftFurnitureInstallingKind = null;
let craftFurnitureInstallTimeoutId = 0;
/** @type {{ x: number, y: number, width: number, height: number } | null} */
let craftFurniturePendingPlacement = null;

function isCraftFurnitureInstalling() {
  return craftFurnitureInstallingKind != null;
}

function clearCraftFurnitureInstalling() {
  craftFurnitureInstallingKind = null;
  craftFurniturePendingPlacement = null;
  if (craftFurnitureInstallTimeoutId) {
    window.clearTimeout(craftFurnitureInstallTimeoutId);
    craftFurnitureInstallTimeoutId = 0;
  }
}

function isPlayerTimedActionBusy() {
  return plantRuntime.isPlanting || appleState.isEating || isCraftFurnitureInstalling();
}
/** @type {{ yellow: number, white: number, brown: number, mixed: number }} */
let coloredMagicPowderCounts = { yellow: 0, white: 0, brown: 0, mixed: 0 };
/** ?????? ????: ????????????????? ??????????? ??? ????(????) */
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
/** Force-save requested while a world poll is in flight (e.g. admin plant-index +). */
let pendingForceWorldSaveAfterPoll = false;
let isWorldDirty = false;
let lastWorldSaveAt = 0;
let lastWorldPollAt = 0;
let lastWorldUpdatedAt = "";
let lastWorldSyncUserToastAt = 0;
/** world_state_conflict ???? ??? ????????? ??????? ??????? ???? ????? */
let worldSaveConflictBackoffUntil = 0;
let localPlantActionLockUntil = 0;
let localAppleActionLockUntil = 0;
/** Extra-bucket id -> ms until local drop must win over stale shared snapshots */
let pendingLocalExtraBucketDropUntilById = Object.create(null);
/** Extra-bucket id -> ms until local craft/spawn must win over stale shared snapshots */
let pendingLocalExtraBucketSpawnUntilById = Object.create(null);
let lastWorldBagDropChangeAt = 0;
let lastWorldBagDropDespawnAt = 0;
const WORLD_BAG_DROP_DESPAWN_TICK_MS = 1000;
let bagInventoryDragState = null;
let bagInventoryDragGhostEl = null;
let craftTradeDragClickSuppress = false;

function consumeCraftTradeDragClickSuppress() {
  if (!craftTradeDragClickSuppress) return false;
  craftTradeDragClickSuppress = false;
  return true;
}
let serverClockOffsetMs = 0;
let lastServerClockSyncAt = 0;
/** Until true, do not push local world to Supabase (avoids wiping shared plants before first pull). */
let hasHydratedSharedWorldFromServer = false;
let ovcBootstrapFinished = false;
let pendingWorldResetToken = "";
/** ????? ?????????? ???? ???????? ????? ??appStorageKeysSharedWorldReset???? ?????????????? ?????. local?? ?? */
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
/** ??? ??????????? ?????????? ???? ???????? ??? ???? ??(sessionId -> { isFull, bucketId }) */
let remotePlayerHeldBucketById = Object.create(null);
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
/** ????? ????? ??? ????????????? true */
const BUCKET_DEBUG_TRACE = false;
const playerTintCache = new Map();
const playerSitTintCache = new Map();
const playerBaseImage = new Image();
const playerSitBaseImage = new Image();
let playerBaseImageReady = false;
let playerSitBaseImageReady = false;
playerBaseImage.addEventListener("load", function () {
  playerBaseImageReady = true;
  playerTintCache.clear();
  if (hasChosenPlayerColor && selectedPlayerColor && !playerSittingChairId) {
    applyPlayerColor(selectedPlayerColor);
  }
});
playerSitBaseImage.addEventListener("load", function () {
  playerSitBaseImageReady = true;
  playerSitTintCache.clear();
  if (playerSittingChairId) {
    syncLocalPlayerPoseVisual();
  }
});
playerBaseImage.src = PLAYER_BASE_IMAGE_SRC;
playerSitBaseImage.src = PLAYER_SIT_IMAGE_SRC;
if (playerBaseImage.complete && playerBaseImage.naturalWidth) {
  playerBaseImageReady = true;
}
if (playerSitBaseImage.complete && playerSitBaseImage.naturalWidth) {
  playerSitBaseImageReady = true;
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
let playerHealth = PLAYER_MAX_HEALTH;
let playerLastHealthTickAt = 0;
let playerWasDrainingHealth = false;
let playerIdleRechargeSince = 0;
let playerIdleRechargeHealTicks = 0;
let playerHealthDrainDebt = 0;
let playerHealthGaugeVisible = true;
let playerSittingChairId = "";
let playerInsideCraftHouseId = "";
let playerOutsideCraftHousePose = null;
let playerHealthPosePrev = { x: 0, depth: 0, jumpY: 0 };
let playerHealthPoseInitialized = false;
const appleState = createAppleState([
  { id: "apple-1", x: BIG_TREE_X + 31, y: BIG_TREE_Y + 45, size: 10 },
  { id: "apple-2", x: BIG_TREE_X + 76, y: BIG_TREE_Y + 21, size: 10 },
  { id: "apple-3", x: BIG_TREE_X + 112, y: BIG_TREE_Y + 52, size: 10 },
  { id: "apple-4", x: BIG_TREE_X + 54, y: BIG_TREE_Y + 82, size: 10 },
  { id: "apple-5", x: BIG_TREE_X + 96, y: BIG_TREE_Y + 83, size: 10 }
]);
let worldLooseSeedElement = null;

/** index ????? + ?????????: ????????? worldLooseSeed?seedCount ???? (src/game/groundSeed.js ??). */
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

/** ? ?? ?????????? ?? ??(?? ???) ?? */
function getWorldLooseSeedClockNow() {
  return getSynchronizedNow();
}

function isWorldLooseSeedVisibleAt() {
  if (!usesWorldLooseSeedMode()) return false;
  ensureWorldLooseSeedShape();
  return isWorldLooseSpawnReady(
    getWorldLooseSeedClockNow(),
    appleState.worldLooseSeed.nextSpawnAt
  );
}

function syncWorldLoosePickupLock() {
  if (!usesWorldLooseSeedMode()) return;
  ensureWorldLooseSeedShape();
  const now = getWorldLooseSeedClockNow();
  worldLoosePickupLockUntil = reconcileWorldLoosePickupLock(
    appleState.worldLooseSeed,
    worldLoosePickupLockUntil,
    now
  );
}

/** ????? ????? ????? ????: ??? id??????seedCount ??? */
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
/** ??? ???? ???? ???????????? ??????????? ???? ???????????? ????? ?????) */
const TREE_DEPTH_CLAMP_MAX_STEP = 4;
/**
 * ?????????= style.css .big-tree-roots (left 39, w 68, h 16, bottom -2).
 * ??? ???? ???????????????????? ??????????????? ????????????? ????????????? ???? ?????????? ????
 */
const TREE_CSS_ROOTS_LEFT = 39;
const TREE_CSS_ROOTS_WIDTH = 68;
const TREE_CSS_ROOTS_HEIGHT = 16;
const TREE_CSS_ROOTS_BOTTOM_EXTEND = 2;
/** ??????????NPC ????: ?? ????????????????(????? ?????) */
const SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD = 4;
/** NPC ?????? ?????????(????????????? ???) */
const NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD = 0;
/**
 * npcY????????????????? ?????(????? y?? ??????? ??? ??.
 * PNG ????? ?????? ?????????? ???? ?? ?????y.
 */
const NPC_HEAD_TOP_TRIM_WORLD = 8;
/** NPC ?????? ????????????y??????? ?? ???????)???? ???? */
const NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD = 4;
/** ???? ???? ????????????? ????????? ???(??? px) */
const WORLD_NPC_HOVER_NAME_GAP_ABOVE_BUBBLE_PX = 5;
/** ????????? ????????: ????????? ???) ????? ????????????????? ?????, ????????????????? */
const PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD = 16;
const SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX = 0;

function getActiveRemotePlayerCountForTick() {
  return countActiveRemotePlayers(remotePlayers, Date.now());
}

/** ??? ?????????????? ????????????????? ??? DB????????????????? ????? */
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

showAppLoadingScreen("\uBD88\uB7EC\uC624\uB294 \uC911...");

function ovcTryDismissLoadingScreen(force) {
  if (isTabSessionSuperseded && !force) return;
  if (force || isCharacterSelecting) {
    hideAppLoadingScreen();
    return;
  }
  if (!ovcBootstrapFinished) return;
  if (isSharedWorldSyncPausedForTutorial() || !isWorldServerSyncAvailable()) {
    hideAppLoadingScreen();
    return;
  }
  if (!hasHydratedSharedWorldFromServer) return;
  hideAppLoadingScreen();
}

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

  if (previousSessionId && previousSessionId !== currentSessionId) {
    pendingPreviousSessionLeaveId = previousSessionId;
    if (
      window.OVCOnline &&
      typeof window.OVCOnline.removePresence === "function"
    ) {
      Promise.resolve(window.OVCOnline.removePresence(previousSessionId)).catch(function () {
        // Best effort cleanup for hard refreshes.
      });
    }
  }
}

function sendPendingPreviousSessionLeaveBroadcast() {
  const previousSessionId = pendingPreviousSessionLeaveId;
  if (!previousSessionId || !multiplayerChannel) return;
  pendingPreviousSessionLeaveId = "";
  Promise.resolve(multiplayerChannel.send({
    type: "broadcast",
    event: "player_state",
    payload: {
      id: previousSessionId,
      userId: currentUserId,
      name: nameForIngameUiDisplay(accountDisplayNameForUi()),
      action: "leave",
      updatedAt: Date.now()
    }
  })).catch(function () {
    // Best effort; DB row was already removed on tab claim.
  });
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
  const myUserId = String(currentUserId || "").trim();
  try {
    const sid = readOvcTabSessionUserId();
    const sname = readOvcTabSessionUserName();
    if (sid && sname && sid === myUserId) {
      return sname;
    }
  } catch (eSess) {}
  try {
    const localUserId = (localStorage.getItem(currentUserIdKey) || "").trim();
    const fromStore = (localStorage.getItem(currentUserKey) || "").trim();
    if (fromStore && (!myUserId || localUserId === myUserId)) {
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

/** headTopWorldY: ??????(?????) ????? y. ??????transform ??? y(???? ????? */
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
    if (
      !playerSittingChairId &&
      !isPlayerInsideEnteredCraftHouse() &&
      !isPlayerGameplayBlockedByNpcDialogue() &&
      !isPlayerHealthGameplayBlocked() &&
      !isPlayerTimedActionBusy()
    ) {
      keys[key] = true;
    }
  }

  if (key === " " && isOnGround) {
    event.preventDefault();
    if (isPlayerInsideEnteredCraftHouse()) return;
    if (isPlayerHealthGameplayBlocked()) return;
    if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) return;
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
    if (isPlayerInsideEnteredCraftHouse()) return;
    if (isPlayerHealthGameplayBlocked()) return;
    if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) return;
    performInteractAction();
  }

  if (key === "q" && !event.repeat) {
    event.preventDefault();
    if (isPlayerTimedActionBusy()) return;
    if (tryToggleChairSit()) return;
    if (playerSittingChairId) return;
    if (tryToggleCraftHouseEnter()) return;
    if (isPlayerHealthGameplayBlocked()) return;
    if (heldItem === HELD_ITEM_BUCKET) {
      if (isPlayerGameplayBlockedByNpcDialogue()) return;
      useHeldItem();
      return;
    }
    // ?????????? NPC?????????????? ??? ??????, ???????? Q?????? ????(??? Q ????????? ????????? ????).
    if (isTradeMasterVisible() && isNearTradeMaster()) {
      if (isOnboardingLinearGateActive() && onboardingFlowStep !== ONBOARDING_STEP_TRADE_MASTER) {
        flashOnboardingOrderHint("");
        return;
      }
      tryTalkToTradeMaster();
      return;
    }
    if (isAlchemyMasterVisible() && isNearAlchemyMaster()) {
      if (isOnboardingLinearGateActive() && onboardingFlowStep !== ONBOARDING_STEP_ALCHEMY_MASTER) {
        flashOnboardingOrderHint("");
        return;
      }
      tryTalkToAlchemyMaster();
      return;
    }
    if (isNearPlantMaster()) {
      tryTalkToPlantMaster();
      return;
    }
    if (hasGuideBook && tryCatchButterfly()) return;
    if (isPlayerGameplayBlockedByNpcDialogue()) return;
    useHeldItem();
  }

  if (key === "Escape") {
    if (playerInsideCraftHouseId) {
      event.preventDefault();
      exitCraftHouse();
      savePlayerHealthState();
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (playerSittingChairId && canPlayerMoveByHealth(playerHealth)) {
      event.preventDefault();
      standUpFromChair();
      savePlayerHealthState();
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (isBagDiscardModalOpen()) {
      event.preventDefault();
      cancelBagDiscardQuantityModal();
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (isAlchemyCraftOpen()) {
      event.preventDefault();
      closeAlchemyCraftPanel({ keepInventory: true });
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (isTradeExchangeOpen()) {
      event.preventDefault();
      closeTradeExchangePanel({ keepInventory: true });
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (bagInventoryPanelOpen) {
      event.preventDefault();
      clearBagInventoryDragVisual();
      setBagInventoryPanelOpen(false);
      updateOnboardingFlowUI();
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
      if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === ONBOARDING_STEP_SETTINGS_ESC) {
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
  if (isTradeExchangeOpen()) closeTradeExchangePanel();
  if (isAlchemyCraftOpen()) closeAlchemyCraftPanel();
  sendMultiplayerLeave();
  saveGameSnapshot();
  resetInputKeys(keys);
});
window.addEventListener("beforeunload", function () {
  if (isTradeExchangeOpen()) closeTradeExchangePanel();
  if (isAlchemyCraftOpen()) closeAlchemyCraftPanel();
  sendMultiplayerLeave();
  saveGameSnapshot();
  resetInputKeys(keys);
});
window.addEventListener("pageshow", function () {
  resetInputKeys(keys);
});
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    if (isTradeExchangeOpen()) closeTradeExchangePanel();
    if (isAlchemyCraftOpen()) closeAlchemyCraftPanel();
    settlePlayerBeforeBackground();
    sendMultiplayerPresence(true);
    saveGameSnapshot();
    resetInputKeys(keys);
  } else {
    // ???????????? ???? ??????????????????wallDelta?? ??????????? ?????
    lastButterflyWallClockMs = 0;
    sendMultiplayerPresence(true);
  }
});

window.addEventListener(
  "wheel",
  function (event) {
    if (tryConsumeWheelForOpenUi(event)) {
      return;
    }

    event.preventDefault();

    if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_ZOOM_INTRO) {
      return;
    }

    if (isWorldChatBlockingGameInput()) {
      return;
    }

    const direction = event.deltaY > 0 ? -1 : 1;
    zoomLevel = clampZoom(zoomLevel + direction * zoomStep);
    updateCamera();
    if (!getStoredFlag(onboardingFlowDoneKey)) {
      if (onboardingFlowStep === ONBOARDING_STEP_ZOOM_INTRO) {
        onboardingFlowStep = ONBOARDING_STEP_ZOOM_MIN;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      } else if (
        onboardingFlowStep === ONBOARDING_STEP_ZOOM_MIN &&
        zoomLevel <= getFitZoom() + 0.06
      ) {
        onboardingFlowStep = ONBOARDING_STEP_TREE_APPROACH;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      }
    }
  },
  { passive: false }
);

function onGuideInventoryToggleClick() {
  if (isTradeExchangeOpen() || isAlchemyCraftOpen()) {
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

function setBagInventoryPanelOpen(open) {
  bagInventoryPanelOpen = Boolean(open);
  if (!bagInventoryPanel) return;
  bagInventoryPanel.style.display = bagInventoryPanelOpen ? "flex" : "none";
  bagInventoryPanel.setAttribute("aria-hidden", bagInventoryPanelOpen ? "false" : "true");
}

function closeBagInventoryPanel() {
  if (isBagDiscardModalOpen()) {
    cancelBagDiscardQuantityModal();
    return;
  }
  if (isAlchemyCraftOpen()) {
    closeAlchemyCraftPanel();
    return;
  }
  if (isTradeExchangeOpen()) {
    closeTradeExchangePanel();
    return;
  }
  setBagInventoryPanelOpen(false);
  updateOnboardingFlowUI();
}

function toggleBagInventoryPanelFromBagClick() {
  if (isTradeExchangeOpen() || isAlchemyCraftOpen()) {
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

function onWorldBagInventoryClick(event) {
  event.preventDefault();
  event.stopPropagation();
  toggleBagInventoryPanelFromBagClick();
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

if (tradeCounterSlot) {
  tradeCounterSlot.addEventListener("pointerdown", onTradeCounterChipPointerDown);
  tradeCounterSlot.addEventListener("pointermove", onBagInventorySlotPointerMove);
  tradeCounterSlot.addEventListener("pointerup", onBagInventorySlotPointerUp);
  tradeCounterSlot.addEventListener("pointercancel", onBagInventorySlotPointerCancel);
}
if (alchemyCraftRequirementSlots) {
  alchemyCraftRequirementSlots.addEventListener("pointerdown", onAlchemyRequirementSlotPointerDown);
  alchemyCraftRequirementSlots.addEventListener("pointermove", onBagInventorySlotPointerMove);
  alchemyCraftRequirementSlots.addEventListener("pointerup", onBagInventorySlotPointerUp);
  alchemyCraftRequirementSlots.addEventListener("pointercancel", onBagInventorySlotPointerCancel);
}
if (bagInventoryPanel) {
  bagInventoryPanel.addEventListener("pointerdown", onBagInventorySlotPointerDown);
  bagInventoryPanel.addEventListener("pointermove", onBagInventorySlotPointerMove);
  bagInventoryPanel.addEventListener("pointerup", onBagInventorySlotPointerUp);
  bagInventoryPanel.addEventListener("pointercancel", onBagInventorySlotPointerCancel);
  bagInventoryPanel.addEventListener("click", function (event) {
    if (consumeCraftTradeDragClickSuppress()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (bagInventoryDragState && bagInventoryDragState.dragging) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (worldSocialUiReady && worldChatPanelOpen) {
      setWorldChatPanelOpen(false);
    }
    const slot = event.target.closest(".bag-inventory-slot");
    if (!slot || !bagInventoryPanel.contains(slot)) return;
    if (slot === bagBookStorageSlot) {
      if (!hasGuideBookItemInBagCounts()) return;
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
    if (isAlchemyCraftOpen()) {
      event.preventDefault();
      event.stopPropagation();
      handleBagSlotClickWhileAlchemyCraftOpen(slot);
      return;
    }
    if (isTradeExchangeOpen()) {
      event.preventDefault();
      event.stopPropagation();
      handleBagSlotClickWhileTradeOpen(slot);
      return;
    }
    if (isPlayerGameplayBlockedByNpcDialogue()) {
      event.preventDefault();
      event.stopPropagation();
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
    if (
      kind === "craftDesk" ||
      kind === "craftFence" ||
      kind === "craftChair" ||
      kind === "craftHouse"
    ) {
      event.preventDefault();
      event.stopPropagation();
      useCraftFurnitureFromBag(kind);
      return;
    }
    if (isMagicPowderBagType(kind)) {
      if (!getMagicPowderBagCount(kind)) return;
      event.preventDefault();
      event.stopPropagation();
      tryUseMagicPowderBagType(kind);
    }
  });
}

bindTradeMaster({
  plantMaster: plantMaster,
  tradeMaster: tradeMaster,
  alchemyMaster: alchemyMaster,
  tradeMasterBubble: tradeMasterBubble,
  tradeExchangeOverlay: tradeExchangeOverlay,
  tradeCounterSlot: tradeCounterSlot,
  tradeTradeableList: tradeTradeableList,
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
  removeBagItems: removeBagItemsFromInventory,
  getBagItemCount: getBagInventoryItemCount,
  addBagItems: addBagItemsForTrade,
  canAddBagItems: canAddBagItemsForTrade,
  showInventoryFullFail: showBagInventoryFullFailMessage,
  saveAppleState: saveAppleState,
  markWorldDirty: markWorldDirty,
  syncWorldState: syncWorldState,
  showPlayerAlert: showPlayerAlert,
  canUseBagInventoryGameplay: canUseBagInventoryGameplay,
  consumeCraftTradeDragClickSuppress: consumeCraftTradeDragClickSuppress,
  isNpcDialogueRunning: function () {
    return isNpcDialogueRunning;
  },
  isAlchemyMasterDialogueRunning: isAlchemyMasterDialogueRunning,
  isAlchemyCraftOpen: isAlchemyCraftOpen,
  closeAlchemyCraftPanel: closeAlchemyCraftPanel,
  onFirstDialogueComplete: advanceOnboardingAfterTradeMasterDialogue
});

bindAlchemyMaster({
  alchemyMasterBubble: alchemyMasterBubble,
  playerBubble: playerBubble,
  alchemyMaster: alchemyMaster,
  alchemyCraftOverlay: alchemyCraftOverlay,
  alchemyCraftProductList: alchemyCraftProductList,
  alchemyCraftRequirementsBlock: alchemyCraftRequirementsBlock,
  alchemyCraftRequirementSlots: alchemyCraftRequirementSlots,
  alchemyCraftRequirementSummary: alchemyCraftRequirementSummary,
  alchemyCraftConfirm: alchemyCraftConfirm,
  alchemyCraftClose: alchemyCraftClose,
  bagInventoryPanel: bagInventoryPanel,
  worldBagInventory: worldBagInventory,
  ground: ground,
  ALCHEMY_MASTER_START_X: ALCHEMY_MASTER_START_X,
  ALCHEMY_MASTER_START_Y: ALCHEMY_MASTER_START_Y,
  NPC_WIDTH: NPC_WIDTH,
  NPC_HEIGHT: NPC_HEIGHT,
  NPC_HEAD_TOP_TRIM_WORLD: NPC_HEAD_TOP_TRIM_WORLD,
  NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD: NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD,
  NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD: NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD,
  getNpcHeadTopWorldY: getNpcHeadTopWorldY,
  npcInteractDistance: npcInteractDistance,
  alchemyMasterDialogueCompleteKey: alchemyMasterDialogueCompleteKey,
  isAlchemyMasterVisible: isAlchemyMasterVisible,
  getCenterDistance: getCenterDistance,
  speechBubbleTopWorldYFromHead: speechBubbleTopWorldYFromHead,
  setSpeechBubbleTransform: setSpeechBubbleTransform,
  setWorldPosition: setWorldPosition,
  setStoredFlag: setStoredFlag,
  setBagInventoryPanelOpen: setBagInventoryPanelOpen,
  updateBagInventorySlots: updateBagInventorySlots,
  updateNpcPosition: updateNpcPosition,
  updatePlayerBubblePosition: updatePlayerBubblePosition,
  removeOneBagItem: removeOneBagItemForTrade,
  removeBagItems: removeBagItemsFromInventory,
  getBagItemCount: getBagInventoryItemCount,
  addBagItems: addBagItemsForTrade,
  canAddBagItems: canAddBagItemsForTrade,
  showInventoryFullFail: showBagInventoryFullFailMessage,
  saveCraftFurnitureCounts: saveCraftFurnitureCounts,
  saveColoredMagicPowderCounts: saveColoredMagicPowderCounts,
  saveButterflyCaughtCounts: saveButterflyCaughtCounts,
  markWorldDirty: markWorldDirty,
  showPlayerAlert: showPlayerAlert,
  canUseBagInventoryGameplay: canUseBagInventoryGameplay,
  consumeCraftTradeDragClickSuppress: consumeCraftTradeDragClickSuppress,
  isNpcDialogueRunning: function () {
    return isNpcDialogueRunning;
  },
  isTradeMasterDialogueRunning: isTradeMasterDialogueRunning,
  isTradeExchangeOpen: isTradeExchangeOpen,
  closeTradeExchangePanel: closeTradeExchangePanel,
  onFirstDialogueComplete: advanceOnboardingAfterTradeMasterDialogue
});

signBoard.addEventListener("click", function () {
  if (isWorldFloorBagAwaitingPickup()) return;
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
  if (worldBagInventory && (event.target === worldBagInventory || worldBagInventory.contains(event.target)))
    return;
  if (bagInventoryPanel && (event.target === bagInventoryPanel || bagInventoryPanel.contains(event.target)))
    return;

  closeGuideCardFromClick();
}, true);

seed.addEventListener("mouseenter", function () {
  isHoveringMainSeed = true;
});

seed.addEventListener("mouseleave", function () {
  isHoveringMainSeed = false;
});

/* ?????????(#world-bag-inventory) ??????document ????????? ??? ????????? ???? */
if (plantHoverLabel) {
  document.addEventListener("pointermove", function (e) {
    syncPlantHoverFromPointerClient(e.clientX, e.clientY);
  });
}
document.addEventListener("pointerup", function (e) {
  if (e.button !== 0) return;
  if (tryWaterPlantByPointerClick(e.clientX, e.clientY)) return;
  if (isPointerBlockedForWorldInteract(e)) return;
  tryWorldInteractByPointerClick(e.clientX, e.clientY);
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
const playerHealthRoot = document.createElement("div");
playerHealthRoot.id = "player-health";
playerHealthRoot.className = "remote-player-health-root";
const playerHealthGaugeEl = document.createElement("div");
playerHealthGaugeEl.className = "player-health-gauge";
playerHealthGaugeEl.hidden = false;
playerHealthGaugeEl.setAttribute("aria-hidden", "false");
const playerHealthGaugeTrack = document.createElement("div");
playerHealthGaugeTrack.className = "player-health-gauge-track";
const playerHealthGaugeFill = document.createElement("div");
playerHealthGaugeFill.className = "player-health-gauge-fill";
const playerHealthGaugeLabel = document.createElement("span");
playerHealthGaugeLabel.className = "player-health-gauge-label";
playerHealthGaugeLabel.setAttribute("aria-hidden", "true");
playerHealthGaugeTrack.appendChild(playerHealthGaugeFill);
playerHealthGaugeTrack.appendChild(playerHealthGaugeLabel);
playerHealthGaugeEl.appendChild(playerHealthGaugeTrack);
const playerHealthCluster = document.createElement("div");
playerHealthCluster.className = "player-health-cluster";
const playerHealthHeartBtn = document.createElement("button");
playerHealthHeartBtn.type = "button";
playerHealthHeartBtn.className = "player-health-heart-toggle";
playerHealthHeartBtn.setAttribute("aria-label", "\uCCB4\uB825 \uAC8C\uC774\uC9C0 \uD45C\uC2DC");
playerHealthHeartBtn.textContent = "\u2665";
playerHealthCluster.appendChild(playerHealthGaugeEl);
playerHealthCluster.appendChild(playerHealthHeartBtn);
playerHealthRoot.appendChild(playerHealthCluster);
playerHealthHeartBtn.addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  togglePlayerHealthGaugeVisible();
  playerHealthHeartBtn.blur();
});
if (localPlayerRoot) {
  if (playerName && playerName.parentNode === localPlayerRoot) {
    localPlayerRoot.insertBefore(playerHealthRoot, playerName);
  } else {
    localPlayerRoot.appendChild(playerHealthRoot);
  }
  localPlayerRoot.appendChild(playerBucketOverlay);
} else if (ground) {
  ground.appendChild(playerBucketOverlay);
}
const networkDebugButton = document.createElement("button");
networkDebugButton.id = "network-debug-button";
networkDebugButton.type = "button";
networkDebugButton.setAttribute("aria-label", "???");
document.body.appendChild(networkDebugButton);
function appendAdminDevGrantButton(id) {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.textContent = "";
  button.setAttribute("aria-hidden", "true");
  document.body.appendChild(button);
  return button;
}
/** Admin dev grants need the floor bag picked up or inventory UI stays hidden. */
function ensureAdminDevBagUnlocked() {
  if (!shouldShowWorldBagInventoryUi()) {
    hasGuideBook = true;
    setStoredFlag(hasGuideBookKey, true);
    setGuideBookPickedForCurrentRoom();
    setWorldBagGroundPickedForCurrentRoom();
    if (isTutorialDocumentEntry()) {
      writeTutorialSessionFloorBagPicked();
      setTutorialSessionWorldGuideBookOffGroundPicked();
    }
    if (isWorldDocumentEntry()) {
      setWorldGuideBookOffGroundPickedForCurrentRoom();
    }
    syncWorldBagGroundVisibility();
    syncGuideInventoryBar();
  } else if (!hasGuideBook) {
    hasGuideBook = true;
    syncGuideInventoryBar();
  }
}
const adminDevButterfliesButton = appendAdminDevGrantButton("admin-dev-butterflies-button");
const adminDevRocksButton = appendAdminDevGrantButton("admin-dev-rocks-button");
const adminDevSeedsButton = appendAdminDevGrantButton("admin-dev-seeds-button");
const adminDevApplesButton = appendAdminDevGrantButton("admin-dev-apples-button");
const adminDevPlantIndexPlusButton = document.createElement("button");
adminDevPlantIndexPlusButton.id = "admin-dev-plant-index-plus-button";
adminDevPlantIndexPlusButton.type = "button";
adminDevPlantIndexPlusButton.textContent = "+";
adminDevPlantIndexPlusButton.setAttribute("aria-hidden", "true");
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
adminDevButterfliesButton.addEventListener("click", function () {
  ensureAdminDevBagUnlocked();
  butterflyColors.forEach(function (color) {
    addBagItemsForTrade("butterfly:" + color, 10);
  });
});
adminDevRocksButton.addEventListener("click", function () {
  ensureAdminDevBagUnlocked();
  addBagItemsForTrade("rock", 10);
});
adminDevSeedsButton.addEventListener("click", function () {
  ensureAdminDevBagUnlocked();
  addBagItemsForTrade("seed", 10);
  markWorldDirty();
  syncWorldState(true);
});
adminDevApplesButton.addEventListener("click", function () {
  ensureAdminDevBagUnlocked();
  addBagItemsForTrade("apple", 10);
  markWorldDirty();
  syncWorldState(true);
});
adminDevPlantIndexPlusButton.addEventListener("click", function () {
  ensureAdminDevBagUnlocked();
  adminDebugPlantIndexBonus = Math.max(0, Math.floor(adminDebugPlantIndexBonus)) + 100;
  updatePlantProgressGauge();
  markWorldDirty();
  syncWorldState(true);
});
const controlsButton = document.createElement("button");
controlsButton.id = "controls-button";
controlsButton.type = "button";
controlsButton.textContent = "\uC870\uC791\uBC95";
settingsModal.insertBefore(controlsButton, logoutButton);
const controlsOverlay = document.createElement("div");
controlsOverlay.id = "controls-overlay";
controlsOverlay.setAttribute("aria-hidden", "true");
controlsOverlay.innerHTML =
  '<div id="controls-modal">' +
  '<div class="controls-header"><strong>??????</strong></div>' +
  '<div class="controls-list">' +
  '<div><span>W / \u2191</span><p>????? ???</p></div>' +
  '<div><span>A / \u2190</span><p>????????? ???</p></div>' +
  '<div><span>S / \u2193</span><p>???????? ???</p></div>' +
  '<div><span>D / \u2192</span><p>?????????? ???</p></div>' +
  '<div><span>Space</span><p>????</p></div>' +
  '<div><span>E</span><p>?? / ????????</p></div>' +
  '<div><span>Q</span><p>?????? / ??????</p></div>' +
  '<div><span>???????? ???</span><p>?????? / ?????</p></div>' +
  '<div><span>Esc</span><p>????? ???? / ????</p></div>' +
  '</div></div>';
document.body.appendChild(controlsOverlay);
ensureWorldSocialUi();

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

function openSettingsOverlay() {
  setSettingsOverlayOpen(settingsOverlay, true);
  updateSettingsTutorialButtons();
}

function closeSettingsOverlayFromBackdrop() {
  onboardingStep26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
  updateSettingsTutorialButtons();
}

function closeSettingsOverlayFromEscape() {
  const hadEscOpenCycle = onboardingStep26OpenedSettingsWithEsc;
  setSettingsOverlayOpen(settingsOverlay, false);
  updateSettingsTutorialButtons();
  if (
    !getStoredFlag(onboardingFlowDoneKey) &&
    onboardingFlowStep === ONBOARDING_STEP_SETTINGS_ESC &&
    hadEscOpenCycle
  ) {
    onboardingFlowStep = ONBOARDING_STEP_COMPLETE;
    onboardingStep26OpenedSettingsWithEsc = false;
    persistOnboardingStep();
    updateOnboardingFlowUI();
    onboardingScheduleTutorialCompleteHide();
  } else {
    onboardingStep26OpenedSettingsWithEsc = false;
  }
}

function skipTutorialFromSettings() {
  if (!window.confirm("???????????? ???????? ????????? ???????????????")) {
    return;
  }
  clearTutorialMainSeedRespawnTimer();
  abortPlantMasterDialogue();
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

function replayTutorialFromSettings() {
  if (
    !window.confirm(
      "???????????? ????????? ?????? ?????????????? ?????????? ????????? ????????????."
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
  setOnboardingFlowDoneStored(false);
  resetTutorialProgressInStorage();
  setStoredValue(onboardingTutorialBindSessionKey, sid);
  try {
    sessionStorage.setItem(ovcTutorialWorldResetPendingKey, "1");
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
  setSettingsOverlayOpen(settingsOverlay, false);
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

function applyGuideTexts() {
  // Guide copy lives in index.html / tutorial.html so the sign and book keep the same wording.
}

function getLocalPlayerBodyWidth() {
  return playerSittingChairId ? PLAYER_SIT_WIDTH : PLAYER_WIDTH;
}

function getLocalPlayerBodyHeight() {
  return playerSittingChairId ? PLAYER_SIT_HEIGHT : PLAYER_HEIGHT;
}

function getPlayerBox() {
  const bodyW = getLocalPlayerBodyWidth();
  const bodyH = getLocalPlayerBodyHeight();
  const top = GROUND_WORLD_HEIGHT - bodyH - playerDepth + jumpY;
  const bottom = GROUND_WORLD_HEIGHT - playerDepth + jumpY;

  return {
    left: playerX,
    top,
    right: playerX + bodyW,
    bottom,
    width: bodyW,
    height: bodyH
  };
}

/** ???? ????? ????: ???????(???)?? ?????????? ?????? ???? ????? */
function getPlayerHeadFogProbeBox() {
  return getPlayerHeadFogProbeBoxForPose(playerX, playerDepth, jumpY);
}

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

/** rock-ground.svg(64??48) ??CSS `center bottom / contain` ????????? ?????????? ???? */
const ROCK_GROUND_SVG_W = 64;
const ROCK_GROUND_SVG_H = 48;
/** viewBox ????? ????? ????? ???????????????????(????y 18~44) */
const ROCK_GROUND_HIT_LEFT = 10;
const ROCK_GROUND_HIT_RIGHT = 54;
const ROCK_GROUND_HIT_TOP = 19;
const ROCK_GROUND_HIT_BOTTOM = 44;

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

/** ry = ??????? ?????(?????). rockEl ??????????? ???? ????? ???(???CSS ????) */
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

function isPlayerHeadFogClearForPose(px, pd, jy, rect, eps) {
  return isPlayerBoxFullyInsidePlantFogClearRect(
    getPlayerHeadFogProbeBoxForPose(px, pd, jy),
    rect,
    eps
  );
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

function getHandPositionFromPlayerPose(playerWorldX, playerWorldY, itemWidth, itemHeight) {
  const top = GROUND_WORLD_HEIGHT - PLAYER_HEIGHT + playerWorldY;
  return {
    x: playerWorldX + PLAYER_WIDTH * 0.82 - itemWidth / 2,
    y: top + PLAYER_HEIGHT * 0.68 - itemHeight / 2
  };
}

function getHandPosition(itemWidth, itemHeight) {
  return getHandPositionFromPlayerPose(playerX, getPlayerWorldY(), itemWidth, itemHeight);
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
  tutorialMainSeedRespawnDueAt = 0;
}

function scheduleTutorialMainSeedRespawnFromGround() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  clearTutorialMainSeedRespawnTimer();
  tutorialMainSeedRespawnDueAt = Date.now() + TUTORIAL_MAIN_SEED_RESPAWN_MS;
  tutorialMainSeedRespawnTimerId = window.setTimeout(function () {
    tutorialMainSeedRespawnTimerId = null;
    tutorialMainSeedRespawnDueAt = 0;
    if (getStoredFlag(onboardingFlowDoneKey)) return;
    if (plantRuntime.isSeedPlanted) return;
    tutorialRespawnMainSeedOnGround();
  }, TUTORIAL_MAIN_SEED_RESPAWN_MS);
}

function tickTutorialMainSeedRespawnDue() {
  if (!tutorialMainSeedRespawnDueAt || getStoredFlag(onboardingFlowDoneKey)) {
    tutorialMainSeedRespawnDueAt = 0;
    return;
  }
  if (Date.now() < tutorialMainSeedRespawnDueAt) return;
  tutorialMainSeedRespawnDueAt = 0;
  clearTutorialMainSeedRespawnTimer();
  if (plantRuntime.isSeedPlanted) return;
  tutorialRespawnMainSeedOnGround();
}

function hasTutorialStarterSeedInPlay() {
  if (heldItem === HELD_ITEM_SEED) return true;
  return appleState.extraSeeds.some(function (s) {
    if (s.planted) return false;
    return s.id === "starter-seed" || s.isStarter;
  });
}

/**
 * ??? ??? ??????? '????'????? ????? ???????????????????????????? ????????????????? ???
 */
function recoverWorldMainSeedIfOnboardingStuck() {
  if (plantRuntime.isSeedPlanted || plantRuntime.isPlanting) return;
  if (!hasPickedMainSeedInCurrentRoom()) return;
  if (hasTutorialStarterSeedInPlay()) return;
  // ??? ??? ????? ???? ???(updateSeedPosition)?? picked????? ???????? ??????.
  // ????????????? ????? ????????????????? ??????? ?????????????? ????.
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

/** Tutorial ?????: ??#seed ??extraSeeds ?????? ????? ?????????????????? ????(groundSeed.js). */
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

function isHoldingMainBucket() {
  return heldItem === HELD_ITEM_BUCKET && (!heldBucketId || heldBucketId === MAIN_BUCKET_ID);
}

function isHoldingExtraBucket() {
  return heldItem === HELD_ITEM_BUCKET && heldBucketId && heldBucketId !== MAIN_BUCKET_ID;
}

function isMainBucketHeldByRemotePlayer() {
  const heldBy = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  return Boolean(heldBy) && heldBy !== currentSessionId && !isHoldingMainBucket();
}

function syncMainBucketToRemoteHolderHand() {
  const holderId = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  const remotePlayer = remotePlayers[holderId];
  if (!remotePlayer) return false;
  const bucketSize = getBucketSize();
  const hand = getHandPositionFromPlayerPose(
    Number(remotePlayer.renderX ?? remotePlayer.targetX ?? remotePlayer.worldX ?? 0),
    getRemotePlayerWorldY(remotePlayer),
    bucketSize.width,
    bucketSize.height
  );
  bucketX = hand.x;
  bucketY = hand.y;
  return true;
}

/** ??? ?????????????????????????????????? ???????? ??? ???? ????? ???? ?????????? */
function getMainBucketGroundState() {
  if (isMainBucketHeldByRemotePlayer()) {
    return {
      x: bucketX,
      y: bucketY,
      isFull: Boolean(isBucketFull)
    };
  }
  if (isHoldingExtraBucket()) {
    const bucketSize = getBucketSize();
    return {
      x: Number.isFinite(heldExtraBucketMainX)
        ? heldExtraBucketMainX
        : wellX - bucketSize.width - 8,
      y: Number.isFinite(heldExtraBucketMainY)
        ? heldExtraBucketMainY
        : wellY + WELL_SIZE - bucketSize.height,
      isFull: Boolean(heldExtraBucketMainIsFull)
    };
  }
  if (isHoldingMainBucket()) {
    const bucketSize = getBucketSize();
    return {
      x: Number.isFinite(mainBucketParkedX)
        ? mainBucketParkedX
        : wellX - bucketSize.width - 8,
      y: Number.isFinite(mainBucketParkedY)
        ? mainBucketParkedY
        : wellY + WELL_SIZE - bucketSize.height,
      isFull: Boolean(isBucketFull)
    };
  }
  return {
    x: bucketX,
    y: bucketY,
    isFull: Boolean(isBucketFull)
  };
}

/** 멀티: 공유 메인 양동이(땅·주차) 위치·찬/빈 — 손에 든 추가 양동이와 분리 */
function applyRemoteSharedMainBucketGround(x, y, isFull) {
  const nextX = Number(x);
  const nextY = Number(y);
  const nextFull = Boolean(isFull);
  if (isHoldingExtraBucket()) {
    if (Number.isFinite(nextX)) heldExtraBucketMainX = nextX;
    if (Number.isFinite(nextY)) heldExtraBucketMainY = nextY;
    heldExtraBucketMainIsFull = nextFull;
    return;
  }
  if (isHoldingMainBucket()) return;
  if (Number.isFinite(nextX)) bucketX = nextX;
  if (Number.isFinite(nextY)) bucketY = nextY;
  isBucketFull = nextFull;
}

/** 멀티: 원격이 메인 양동이를 들었을 때 손 위치만 반영(로컬이 추가 양동이를 든 경우 isBucketFull 유지) */
function applyRemoteSharedMainBucketHeldPose(x, y, isFull) {
  const nextX = Number(x);
  const nextY = Number(y);
  if (Number.isFinite(nextX)) bucketX = nextX;
  if (Number.isFinite(nextY)) bucketY = nextY;
  if (!isHoldingExtraBucket() && !isHoldingMainBucket()) {
    isBucketFull = Boolean(isFull);
  }
}

function isMainBucketOnGroundForPickup() {
  if (!bucket || isHoldingMainBucket()) return false;
  const heldBy = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
  if (heldBy && heldBy !== currentSessionId) return false;
  return true;
}

function groundBucketsOverlap(ax, ay, bx, by, bucketSz) {
  return (
    Math.abs(ax - bx) < bucketSz.width * 0.9 &&
    Math.abs(ay - by) < bucketSz.height * 0.9
  );
}

function listGroundBucketPositionsForDropResolve(options) {
  const bucketSz = getBucketSize();
  const out = [];
  const opts = options || {};
  if (!opts.skipMain) {
    if (Number.isFinite(Number(opts.mainX)) && Number.isFinite(Number(opts.mainY))) {
      out.push({ x: Number(opts.mainX), y: Number(opts.mainY) });
    } else if (isMainBucketOnGroundForPickup()) {
      const main = getMainBucketGroundState();
      out.push({ x: main.x, y: main.y });
    }
  }
  const excludeId = opts.excludeExtraId ? String(opts.excludeExtraId) : "";
  (Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : []).forEach(
    function (entry) {
      if (!entry) return;
      if (excludeId && String(entry.id) === excludeId) return;
      out.push({ x: Number(entry.x) || 0, y: Number(entry.y) || 0 });
    }
  );
  return { bucketSz: bucketSz, positions: out };
}

/** 바닥에 둘 때 다른 양동이와 겹치지 않도록 인접 칸으로 보정 */
function resolveGroundBucketDropPosition(preferredX, preferredY, options) {
  const listed = listGroundBucketPositionsForDropResolve(options);
  const bucketSz = listed.bucketSz;
  const positions = listed.positions;
  const step = Math.max(5, Math.ceil(bucketSz.width * 0.4));
  const rings = [
    [0, 0],
    [step, 0],
    [-step, 0],
    [0, step],
    [0, -step],
    [step, step],
    [step, -step],
    [-step, step],
    [-step, -step],
    [2 * step, 0],
    [-2 * step, 0],
    [0, 2 * step],
    [0, -2 * step],
    [2 * step, step],
    [-2 * step, step]
  ];
  const px = Number(preferredX) || 0;
  const py = Number(preferredY) || 0;

  function isFree(x, y) {
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      if (groundBucketsOverlap(x, y, p.x, p.y, bucketSz)) return false;
    }
    return true;
  }

  for (let r = 0; r < rings.length; r++) {
    const ox = px + rings[r][0];
    const oy = py + rings[r][1];
    if (isFree(ox, oy)) {
      return { x: ox, y: oy };
    }
  }
  return { x: px, y: py };
}

function getNearestGroundBucketPickInfo() {
  const bucketSize = getBucketSize();
  let best = null;
  let bestDist = Infinity;
  if (isMainBucketOnGroundForPickup()) {
    const mainGround = getMainBucketGroundState();
    const mainDist = getCenterDistance(
      mainGround.x,
      mainGround.y,
      bucketSize.width,
      bucketSize.height
    );
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

function isNearBucket() {
  const info = getNearestGroundBucketPickInfo();
  return Boolean(info && info.distance < bucketPickupDistance);
}

function isNearWell() {
  const wellSize = getWellSize();

  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellUseDistance;
}

function isNearWellForCard() {
  const wellSize = getWellSize();

  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellCardDistance;
}

function isNearWellForPouring() {
  const wellSize = getWellSize();

  return getCenterDistance(wellX, wellY, wellSize.width, wellSize.height) < wellPourDistance;
}

/** ????? ???????????????????????????????????????? ???????????? ????????????????? */
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

/**
 * ???????????? ??? ?????? ?????????????(????? px). ???????????? ??????????? ??????? ???????
 * ????????????? '?????????? ??? ????? ?????? ????????? Q?? ????????? ?????????????? ????.
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

/** ?? ?? ??? ?? ??? ?? ? ?? ?? ?? ???? ?? */
function isWorldFloorBagAwaitingPickup() {
  return Boolean(
    worldBag && !isWorldFloorBagHiddenForCurrentView() && worldBag.style.display !== "none"
  );
}

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

function clearOnboardingHighlights() {
  [
    guideBook,
    guideBookButton,
    worldBag,
    worldBagInventory,
    guideCard,
    seed,
    plantMaster,
    tradeMaster,
    alchemyMaster,
    player,
    well,
    bucket,
    bigTree,
    plantSpot
  ].forEach(function (el) {
    if (el) el.classList.remove("onboarding-highlight");
  });
  const plantGauge = document.getElementById("plant-progress-gauge");
  if (plantGauge) plantGauge.classList.remove("onboarding-highlight");
  if (worldChatToggleBtn) worldChatToggleBtn.classList.remove("onboarding-highlight");
  if (worldHeartBtn) worldHeartBtn.classList.remove("onboarding-highlight");
  if (worldSadBtn) worldSadBtn.classList.remove("onboarding-highlight");
  treeAppleElements.forEach(function (el) {
    el.classList.remove("onboarding-highlight");
  });
  if (guideBookButton) {
    guideBookButton.classList.remove("onboarding-highlight-book-inv");
  }
  if (worldBagInventory) {
    worldBagInventory.classList.remove("onboarding-highlight-book-inv");
  }
  if (bagBookStorageSlot) {
    bagBookStorageSlot.classList.remove("onboarding-highlight");
  }
  if (bagInventoryPanel) {
    bagInventoryPanel.querySelectorAll(".bag-inventory-slots .bag-inventory-slot").forEach(function (el) {
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

/** ?????????????????????? ?????????????tutorial_done?????????index????????????? ???????????*/
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

/**
 * ???????????????????? ????? ?????? ????????? ??????? ????????????(????????? ?????????????/?????????????????).
 * done ???????? ??????????? ????????????? ???????.
 * - "0": ????? ????/??????? ???? ??
 * - 34(ONBOARDING_MAX_STEP): ????? ???? ?????7????????? done????? ????? ??????? ????
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
 * ????????? ??????????????????: ????????? ????? ??????????????????????? ?????????????
 * ??????????????????(??????????????????????? ????? ????????????).
 */
function restoreWorldHubIfVeteranWithoutActiveReplay() {
  if (!currentUserId) return;
  var replay = "";
  try {
    replay = sessionStorage.getItem(ovcTutorialReplaySessionKey) || "";
  } catch (e) {}
  if (replay === "1") return;
  if (getStoredFlag(onboardingFlowDoneKey)) {
    try {
      sessionStorage.removeItem(ovcTutorialReplaySessionKey);
    } catch (eClrReplay) {}
    setStoredFlag(everBeenToWorldKey, true);
    return;
  }
  if (!getStoredFlag(everBeenToWorldKey)) return;
  setOnboardingFlowDoneStored(true);
  setStoredValue(onboardingFlowStepKey, "0");
  requestAccountTutorialDoneSync({ force: true });
}

function resetTutorialProgressInStorage() {
  let allowReset = !getStoredFlag(onboardingFlowDoneKey);
  if (!allowReset) {
    try {
      allowReset =
        sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1" ||
        sessionStorage.getItem("ovcTutorialWorldResetPending") === "1";
    } catch (eAllow) {}
  }
  if (!allowReset) return;
  abortPlantMasterDialogue();
  clearTutorialMainSeedRespawnTimer();
  setOnboardingFlowDoneStored(false);
  setStoredValue(onboardingFlowStepKey, "1");
  removeStoredValue(movementTutorialCompleteKey);
  setStoredFlag(hasGuideBookKey, false);
  clearWorldFloorBagClaim(removeStoredValue);
  removeRoomKeyedPickupForAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
  removeRoomKeyedPickupForAllSlugs(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
  setStoredFlag(npcDialogueCompleteKey, false);
  setStoredFlag(tradeMasterDialogueCompleteKey, false);
  setStoredFlag(alchemyMasterDialogueCompleteKey, false);
  hydrateTradeMasterDialogueComplete(false);
  hydrateAlchemyMasterDialogueComplete(false);
  setStoredFlag(guidePlantPageUnlockedKey, false);
  setStoredFlag(guideBookClickPromptDismissedKey, false);
  isNpcDialogueComplete = false;
  isGuidePlantPageUnlocked = false;
  clearMainSeedPickedForCurrentRoom();
  tutorialWorldNeedsFullReset = true;
}

function isSharedWorldSyncPausedForTutorial() {
  if (isWorldDocumentEntry()) return false;
  return !getStoredFlag(onboardingFlowDoneKey);
}

/** index ????? + ????????? + ???? ????? ??? ????????? ?????????? ?????extraPlants???? ???? */
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
  let replayActive = false;
  try {
    replayActive = sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1";
  } catch (eReplayActive) {}
  if (getStoredFlag(onboardingFlowDoneKey) && !replayActive && !pendingWorld) {
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

function onboardingClearEscHintTimer() {
  if (onboardingEscHintTimerId) {
    window.clearTimeout(onboardingEscHintTimerId);
    onboardingEscHintTimerId = null;
  }
}

function onboardingClearAllOnboardingTimers() {
  onboardingClearEscHintTimer();
  clearTutorialMainSeedRespawnTimer();
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
  if (onboardingPlantIndexIntroTimerId) {
    window.clearTimeout(onboardingPlantIndexIntroTimerId);
    onboardingPlantIndexIntroTimerId = null;
  }
}

/** v1(???? 27????) ??v2(34????) ????????? ???? */
function migrateLegacyOnboardingFlowStep(raw) {
  const n = Math.floor(Number(raw) || 0);
  if (n <= 16) return n;
  if (n >= 17 && n <= 27) {
    const map = {
      17: ONBOARDING_STEP_DROP_BUCKET,
      18: ONBOARDING_STEP_BUTTERFLY,
      19: ONBOARDING_STEP_ZOOM_INTRO,
      20: ONBOARDING_STEP_ZOOM_MIN,
      21: ONBOARDING_STEP_TREE_APPROACH,
      22: ONBOARDING_STEP_TREE_CLIMB,
      23: ONBOARDING_STEP_PICK_APPLE,
      24: ONBOARDING_STEP_EAT_APPLE,
      25: ONBOARDING_STEP_EXTRA_SEED,
      26: ONBOARDING_STEP_SETTINGS_ESC,
      27: ONBOARDING_STEP_COMPLETE
    };
    return map[n] || n;
  }
  return n;
}

function isOnboardingSocialTutorialStep() {
  return (
    isOnboardingLinearGateActive() &&
    onboardingFlowStep >= ONBOARDING_STEP_CHAT &&
    onboardingFlowStep <= ONBOARDING_STEP_SAD
  );
}

function isOnboardingSocialDemoReady() {
  return isOnboardingSocialTutorialStep() || isWorldSocialRealtimeReady();
}

function onboardingClearPlantIndexIntroTimer() {
  if (onboardingPlantIndexIntroTimerId) {
    window.clearTimeout(onboardingPlantIndexIntroTimerId);
    onboardingPlantIndexIntroTimerId = null;
  }
}

function startOnboardingPlantIndexIntro() {
  onboardingClearPlantIndexIntroTimer();
  onboardingPlantIndexIntroPhase = 0;
  const gauge = document.getElementById("plant-progress-gauge");
  if (gauge) {
    gauge.classList.remove("is-collapsed");
    const toggle = document.getElementById("plant-progress-sprout-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }
  syncWorldPlantFogVisuals();
  updatePlantProgressGauge();
  updateOnboardingFlowUI();
  onboardingPlantIndexIntroTimerId = window.setTimeout(function () {
    onboardingPlantIndexIntroTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_PLANT_INDEX) {
      return;
    }
    onboardingPlantIndexIntroPhase = 1;
    updateOnboardingFlowUI();
    onboardingPlantIndexIntroTimerId = window.setTimeout(function () {
      onboardingPlantIndexIntroTimerId = null;
      if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_PLANT_INDEX) {
        return;
      }
      onboardingPlantIndexIntroPhase = 0;
      onboardingFlowStep = ONBOARDING_STEP_DROP_BUCKET;
      persistOnboardingStep();
      if (worldPlantFog) worldPlantFog.style.display = "none";
      if (world) world.style.filter = "";
      updateOnboardingFlowUI();
    }, 4500);
  }, 4500);
}

function showOnboardingSocialDemoChatBubble(text) {
  const body = sanitizeWorldChatText(text);
  if (!body) return;
  localChatBubbleText = body;
  localChatBubbleHideAt = Date.now() + WORLD_CHAT_HEAD_BUBBLE_MS;
  if (localChatBubbleTimer) {
    window.clearTimeout(localChatBubbleTimer);
  }
  localChatBubbleTimer = window.setTimeout(function () {
    localChatBubbleTimer = null;
    localChatBubbleText = "";
    localChatBubbleHideAt = 0;
    updatePlayerChatBubbleOverlay();
  }, WORLD_CHAT_HEAD_BUBBLE_MS);
  updatePlayerChatBubbleOverlay();
}

function advanceOnboardingAfterSocialChatSent() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_CHAT) return;
  onboardingFlowStep = ONBOARDING_STEP_HEART;
  persistOnboardingStep();
  setWorldChatPanelOpen(false);
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterSocialHeart() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_HEART) return;
  onboardingFlowStep = ONBOARDING_STEP_SAD;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterSocialSad() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_SAD) return;
  onboardingFlowStep = ONBOARDING_STEP_ROCK;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterTradeMasterDialogue() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_TRADE_MASTER) {
    return;
  }
  setStoredFlag(alchemyMasterDialogueCompleteKey, false);
  hydrateAlchemyMasterDialogueComplete(false);
  onboardingFlowStep = ONBOARDING_STEP_ALCHEMY_MASTER;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterAlchemyMasterDialogue() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_ALCHEMY_MASTER) {
    return;
  }
  onboardingFlowStep = ONBOARDING_STEP_ZOOM_INTRO;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function ensureTutorialOnboardingRock() {
  if (!Array.isArray(appleState.worldRocks)) appleState.worldRocks = [];
  if (!Array.isArray(appleState.worldRockPickedIds)) appleState.worldRockPickedIds = [];
  const shouldShow =
    isOnboardingLinearGateActive() && onboardingFlowStep === ONBOARDING_STEP_ROCK;
  if (!shouldShow) {
    if (onboardingTutorialRockMounted && ground) {
      ground.querySelectorAll(".world-ground-rock[data-tutorial-rock='1']").forEach(function (node) {
        node.remove();
      });
    }
    onboardingTutorialRockMounted = false;
    return;
  }
  let rock = appleState.worldRocks.find(function (r) {
    return r && String(r.id) === TUTORIAL_ONBOARDING_ROCK_ID;
  });
  if (!rock) {
    rock = {
      id: TUTORIAL_ONBOARDING_ROCK_ID,
      x: WELL_START_X + 52,
      y: WELL_START_Y + 18,
      size: WORLD_ROCK_SIZE
    };
    appleState.worldRocks.push(rock);
  }
  if (appleState.worldRockPickedIds.includes(TUTORIAL_ONBOARDING_ROCK_ID)) {
    const idx = appleState.worldRockPickedIds.indexOf(TUTORIAL_ONBOARDING_ROCK_ID);
    if (idx >= 0) appleState.worldRockPickedIds.splice(idx, 1);
  }
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
    el.dataset.tutorialRock = "1";
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      ground.insertBefore(el, insertBeforeEl);
    } else {
      ground.appendChild(el);
    }
    rock._el = el;
    onboardingTutorialRockMounted = true;
  }
  updateWorldRocks();
}

function ensureTutorialOnboardingButterflies() {
  if (!areButterfliesUnlockedForTutorialOnboarding()) return;
  if (!hasSpawnedCharacter || !isButterflyAuthority()) return;
  if (butterflyState.list.length > 0) return;
  authorityFillToCapInstantly(Date.now());
  hasSeededInitialButterflies = true;
  lastButterflyStateChangeAt = Date.now();
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
  // 13: ???????? ??, 14~15: ??? ????????, 16+: ????????? ??????????? ???? ????????
  // ????????? 13?15?????????14????? ???/16 ????? Q?? ?????????????????? ???????
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
  onboardingNpcGuideEscHintShown = false;
  onboardingPostAppleSeedIntroPhase = 0;
  onboardingPostWaterCongratsPhase = 0;
  onboardingPlantIndexIntroPhase = 0;
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
  const normalizedRaw = migrateLegacyOnboardingFlowStep(raw);
  onboardingFlowStep =
    Number.isFinite(normalizedRaw) && normalizedRaw >= 1 && normalizedRaw <= ONBOARDING_MAX_STEP
      ? normalizedRaw
      : 1;
  syncOnboardingFlowProgressFromWorld();
  if (onboardingFlowStep === ONBOARDING_STEP_EXTRA_SEED) {
    onboardingPostAppleSeedIntroPhase = 1;
  }
  if (onboardingFlowStep === ONBOARDING_STEP_PLANT_INDEX && !onboardingPlantIndexIntroTimerId) {
    startOnboardingPlantIndexIntro();
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
    onboardingFlowStep === ONBOARDING_STEP_ZOOM_MIN &&
    zoomLevel <= getFitZoom() + 0.06
  ) {
    onboardingFlowStep = ONBOARDING_STEP_TREE_APPROACH;
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
  if (onboardingFlowStep === ONBOARDING_STEP_TREE_APPROACH && isPlayerNearTutorialTreeArea()) {
    onboardingFlowStep = ONBOARDING_STEP_TREE_CLIMB;
    persistOnboardingStep();
  }
  if (onboardingFlowStep === ONBOARDING_STEP_TREE_CLIMB && isPlayerInTreeSpace()) {
    onboardingTutorialEnteredTree = true;
  }
  if (
    onboardingFlowStep === ONBOARDING_STEP_TREE_CLIMB &&
    isPlayerInTreeSpace() &&
    isNearAnyUnpickedAppleTutorial()
  ) {
    onboardingFlowStep = ONBOARDING_STEP_PICK_APPLE;
    persistOnboardingStep();
  }
  if (
    onboardingFlowStep === ONBOARDING_STEP_EXTRA_SEED &&
    onboardingTutorialEnteredTree &&
    onboardingSeedTutorialSecondLine &&
    !isPlayerInTreeSpace()
  ) {
    onboardingFlowStep = ONBOARDING_STEP_SETTINGS_ESC;
    onboardingStep26OpenedSettingsWithEsc = false;
    persistOnboardingStep();
  }

  ensureTutorialOnboardingRock();
  ensureTutorialOnboardingButterflies();
  updateNpcPosition();
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

  onboardingAutoAdvanceSteps();

  clearOnboardingHighlights();

  const guideOpen = guideCard && guideCard.style.display === "block";

  if (onboardingFlowStep === 10 && guideOpen && !onboardingEscHintTimerId && !onboardingNpcGuideEscHintShown) {
    scheduleOnboardingNpcGuideEscHint();
  }

  switch (onboardingFlowStep) {
    case 1: {
      if (isNearWorldBagPickup() && !hasGuideBook) {
        movementTutorial.hideOverlay();
        setOnboardingCalloutVisible(true, "E키를 눌러 가방을 소지하세요.");
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
        setOnboardingCalloutVisible(true, "인벤토리(저장소)가 열립니다.");
        if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
        if (bagBookStorageSlot && hasGuideBookItemInBagCounts()) {
          bagBookStorageSlot.classList.add("onboarding-highlight");
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
    case ONBOARDING_STEP_PLANT_INDEX: {
      const plantGauge = document.getElementById("plant-progress-gauge");
      if (plantGauge) {
        plantGauge.classList.remove("is-collapsed");
        plantGauge.classList.add("onboarding-highlight");
      }
      setOnboardingCalloutVisible(
        true,
        onboardingPlantIndexIntroPhase === 0
          ? "식물지수는 식물을 심으면 올라갑니다."
          : "맵의 안개가 해제되니 잘 올려보세요!"
      );
      break;
    }
    case ONBOARDING_STEP_DROP_BUCKET: {
      setOnboardingCalloutVisible(true, "E키를 눌러 양동이를 내려놓으세요.");
      if (bucket) bucket.classList.add("onboarding-highlight");
      if (player) player.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_CHAT: {
      setOnboardingCalloutVisible(
        true,
        "💬 버튼을 눌러 채팅을 열고, 메시지를 입력한 뒤 전송해 보세요."
      );
      if (worldChatToggleBtn) worldChatToggleBtn.classList.add("onboarding-highlight");
      if (worldChatPanelOpen && worldChatSendBtn) {
        worldChatSendBtn.classList.add("onboarding-highlight");
      }
      break;
    }
    case ONBOARDING_STEP_HEART: {
      setOnboardingCalloutVisible(
        true,
        "❤️ 버튼을 눌러 하트를 보내 보세요. 다른 플레이어에게 반응을 전할 수 있어요."
      );
      if (worldHeartBtn) worldHeartBtn.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_SAD: {
      setOnboardingCalloutVisible(
        true,
        "😢 버튼을 눌러 슬퍼요를 보내 보세요."
      );
      if (worldSadBtn) worldSadBtn.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_ROCK: {
      setOnboardingCalloutVisible(true, "땅의 돌에 가까이 가서 E키로 줍아 보세요.");
      if (Array.isArray(appleState.worldRocks)) {
        appleState.worldRocks.forEach(function (rock) {
          if (rock && rock._el && String(rock.id) === TUTORIAL_ONBOARDING_ROCK_ID) {
            rock._el.classList.add("onboarding-highlight");
          }
        });
      }
      break;
    }
    case ONBOARDING_STEP_BUTTERFLY: {
      setOnboardingCalloutVisible(
        true,
        "날아다니는 나비에 근접하여 E 또는 Q로 잡아 보세요."
      );
      Object.keys(butterflyRenderById).forEach(function (id) {
        const entry = butterflyRenderById[id];
        if (entry && entry.element) {
          entry.element.classList.add("onboarding-highlight");
        }
      });
      break;
    }
    case ONBOARDING_STEP_TRADE_MASTER: {
      setOnboardingCalloutVisible(true, "거래의 달인에게 가서 Q키로 대화해 보세요.");
      if (tradeMaster) tradeMaster.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_ALCHEMY_MASTER: {
      setOnboardingCalloutVisible(true, "연금술의 달인에게 가서 Q키로 대화해 보세요.");
      if (alchemyMaster) alchemyMaster.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_ZOOM_INTRO: {
      setOnboardingCalloutVisible(true, "스크롤해 맵을 축소,확대 해보세요.");
      break;
    }
    case ONBOARDING_STEP_ZOOM_MIN: {
      setOnboardingCalloutVisible(true, "가장 작게 축소 해보세요.");
      break;
    }
    case ONBOARDING_STEP_TREE_APPROACH: {
      setOnboardingCalloutVisible(true, "정중앙 위 나무로 이동하세요.");
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      break;
    }
    case ONBOARDING_STEP_TREE_CLIMB: {
      setOnboardingCalloutVisible(
        true,
        "나무를 이동하여 올라타고 열매들 근처로 이동하세요."
      );
      if (bigTree) bigTree.classList.add("onboarding-highlight");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case ONBOARDING_STEP_PICK_APPLE: {
      setOnboardingCalloutVisible(true, "e키를 눌러 열매를 따세요.");
      highlightUnpickedApplesForTutorial();
      break;
    }
    case ONBOARDING_STEP_EAT_APPLE: {
      setOnboardingCalloutVisible(true, "가방을 연 뒤 사과 칸을 눌러 먹으세요.");
      if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
      if (bagInventoryPanel) {
        const bagAppleSlot = bagInventoryPanel.querySelector('[data-bag-type="apple"]');
        if (bagAppleSlot) bagAppleSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case ONBOARDING_STEP_EXTRA_SEED: {
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
      if (bagInventoryPanel) {
        const bagSeedSlot = bagInventoryPanel.querySelector('[data-bag-type="seed"]');
        if (bagSeedSlot) bagSeedSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case ONBOARDING_STEP_SETTINGS_ESC: {
      setOnboardingCalloutVisible(
        true,
        "Esc를 눌러 설정을 연 뒤, 다시 Esc로 닫아 보세요."
      );
      break;
    }
    case ONBOARDING_STEP_COMPLETE: {
      setOnboardingCalloutVisible(true, "축하합니다! 튜토리얼이 끝났습니다!!");
      break;
    }
    default:
      setOnboardingCalloutVisible(false, "");
  }
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
      onboardingFlowStep = ONBOARDING_STEP_PLANT_INDEX;
      persistOnboardingStep();
      startOnboardingPlantIndexIntro();
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
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_DROP_BUCKET) {
    return;
  }
  onboardingFlowStep = ONBOARDING_STEP_CHAT;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function onboardingHookTutorialRockPicked() {
  if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_ROCK) return;
  onboardingFlowStep = ONBOARDING_STEP_BUTTERFLY;
  onboardingButterflyCountBaseline = getTotalCaughtButterflies();
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

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

function pickUpWorldBag() {
  if (isOnboardingLinearGateActive()) {
    if (hasGuideBook) return false;
    if (onboardingFlowStep !== 1 && onboardingFlowStep !== 2) return false;
  }
  if (!isNearWorldBagPickup()) return false;

  if (worldSocialUiReady && worldChatPanelOpen) {
    setWorldChatPanelOpen(false);
  }

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

/** ? ????E?? ????????? ?????????????? */
function pickUpGuideBook() {
  return pickUpWorldGuideBookNoHold();
}

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
  hydrateAlchemyMasterDialogueComplete(getStoredFlag(alchemyMasterDialogueCompleteKey));
  loadCraftFurnitureCounts();
  loadPlayerHealth();
  loadColoredMagicPowderCounts();
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

let isDevWorldResetInProgress = false;
let lastDevWorldResetAt = 0;

function resetGameForTesting() {
  const now = Date.now();
  if (now - lastDevWorldResetAt < 350) return;
  if (isDevWorldResetInProgress) return;
  if (!isWorldDocumentEntry()) return;
  if (!ovcBootstrapFinished) {
    markPendingDevWorldReset();
    return;
  }
  lastDevWorldResetAt = now;

  isReloadingForWorldReset = false;
  isDevWorldResetInProgress = true;
  try {
    isWorldDirty = false;
    isApplyingWorldState = false;
    bagInventoryItemOrder = [];
    purgeLocalStorageKeysForLogicalKey(bagInventoryOrderKey);
    purgeLocalStorageKeysForLogicalKey(worldBagFloorPickedAccountKey);
    clearStoredKeys(appStorageKeys);
    clearMainSeedPickedForCurrentRoom();
    clearTutorialSessionWorldFloorPickupFlags();
    clearWorldFloorBagClaim(removeStoredValue);
    removeRoomKeyedPickupForAllSlugs("mainSeedPickedRoomV1:");
    removeRoomKeyedPickupForAllSlugs(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
    removeRoomKeyedPickupForAllSlugs(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX);
    removeRoomKeyedPickupForAllSlugs(GUIDE_BOOK_PICKED_ROOM_KEY_PREFIX);
    ignoreSnapshotInventorySeedsUntil = Date.now() + 15000;
    pendingWorldResetToken = "reset-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    lastAppliedWorldResetToken = pendingWorldResetToken;
    lastWorldResetAt = Date.now();
    persistOvcLastAppliedWorldResetToken(lastAppliedWorldResetToken);

    applyDefaultState();
    hydrateTradeMasterDialogueComplete(false);
    hydrateAlchemyMasterDialogueComplete(false);
    setStoredFlag(tradeMasterDialogueCompleteKey, false);
    setStoredFlag(alchemyMasterDialogueCompleteKey, false);
    setStoredFlag(guideBookClickPromptDismissedKey, false);
    persistDefaultStateAfterReset();
    restartPlayerPositionOnly();

    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    updateCamera();
    updatePlantState();
    loadOnboardingFlowState();
    updateOnboardingFlowUI();
    updateNpcPosition();
    updateGuidePages();
    updateGuideCard();
    syncWorldPlantFogVisuals();
    hasHydratedSharedWorldFromServer = true;

    syncWorldState(true, { skipPrefetch: true });
    showThrottledWorldSyncToast("\uC6D4\uB4DC\uAC00 \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
  } catch (devResetError) {
    console.error("[OVC] dev world reset failed:", devResetError);
    showThrottledWorldSyncToast(
      "\uCD08\uAE30\uD654\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uCF5C\uC194\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694."
    );
  } finally {
    isDevWorldResetInProgress = false;
    isReloadingForWorldReset = false;
    dismissAppLoadingScreenAfterDevReset();
    ovcTryDismissLoadingScreen(true);
  }
}

bootDevWorldReset(resetGameForTesting, isWorldDocumentEntry);

function persistDefaultStateAfterReset() {
  savePlayerPosition(true);
  savePlayerHealthState();
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
}

function saveGameSnapshot() {
  if (isReloadingForWorldReset) return;
  savePlayerPosition(true);
  savePlayerHealthState();
  saveWellState();
  saveSeedState();
  saveAppleState();
  saveBucketState();
  syncWorldState(true);
}

function restartPlayerPositionOnly() {
  resetInputKeys(keys);
  resetPlayerChairSitState();
  playerX = spawnPlayerX;
  playerDepth = spawnPlayerDepth;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  isTreeFalling = false;
  wasPlayerInTree = false;
  plantingInventorySeedId = null;
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
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
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
  }
}

function applyDefaultState(options) {
  clearTutorialMainSeedRespawnTimer();
  tutorialMainSeedRegenCompleted = false;
  const sharedWorldResetOnly =
    Boolean(options && options.sharedWorldResetOnly);
  abortPlantMasterDialogue();
  if (sharedWorldResetOnly) {
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (ePending) {}
  }
  resetInputKeys(keys);

  playerHealth = PLAYER_MAX_HEALTH;
  playerLastHealthTickAt = 0;
  playerWasDrainingHealth = false;
  playerIdleRechargeSince = 0;
  playerIdleRechargeHealTicks = 0;
  playerHealthDrainDebt = 0;
  playerHealthGaugeVisible = true;
  playerInsideCraftHouseId = "";
  playerOutsideCraftHousePose = null;
  playerHealthPoseInitialized = false;
  resetPlayerChairSitState();
  exitCraftHouse();

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
  worldBagX = WORLD_BAG_START_X;
  worldBagY = WORLD_BAG_START_Y;
  plantRuntime.seedCreatedAt = Date.now();
  setStoredValue(seedCreatedAtKey, String(plantRuntime.seedCreatedAt));
  plantRuntime.isSeedDry = false;
  isMainSeedAvailable = true;
  lastMainSeedStateChangeAt = Date.now();
  clearMainSeedPickedForCurrentRoom();
  if (sharedWorldResetOnly) {
    removeRoomKeyedPickupForAllSlugs("mainSeedPickedRoomV1:");
    removeRoomKeyedPickupForAllSlugs(WORLD_BAG_GROUND_PICKED_ROOM_KEY_PREFIX);
    removeRoomKeyedPickupForAllSlugs(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX);
    purgeLocalStorageKeysForLogicalKey(worldBagFloorPickedAccountKey);
    purgeLocalStorageKeysForLogicalKey(bagInventoryOrderKey);
    bagInventoryItemOrder = [];
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
  clearCraftFurnitureInstalling();
  heldItem = null;
  heldBucketId = "";
  heldExtraBucketMainX = 0;
  heldExtraBucketMainY = 0;
  heldExtraBucketMainIsFull = false;
  mainBucketParkedX = 0;
  mainBucketParkedY = 0;
  mainBucketParkedIsFull = false;
  plantingInventorySeedId = null;

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
  plantRuntime.matureKind = "";
  plantRuntime.flowerOrdinal = null;
  plantRuntime.treeOrdinal = null;
  plantRuntime.cactusOrdinal = null;
  plantRuntime.blockSproutRegrowthAfterDry = false;
  plantRuntime.drySoilAt = null;

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
    setStoredFlag(npcDialogueCompleteKey, false);
    setStoredFlag(guidePlantPageUnlockedKey, false);
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
  appleState.worldBagDrops = [];
  ground.querySelectorAll(".world-bag-drop").forEach(function (node) {
    node.remove();
  });
  placedCraftFurniture = [];
  worldLooseSeedElement = null;
  localApplePickedAtById = {};
  adminDebugPlantIndexBonus = 0;

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
  rockInventoryCount = 0;
  craftFurnitureCounts.craftDesk = 0;
  craftFurnitureCounts.craftFence = 0;
  craftFurnitureCounts.craftChair = 0;
  craftFurnitureCounts.craftHouse = 0;
  coloredMagicPowderCounts.yellow = 0;
  coloredMagicPowderCounts.white = 0;
  coloredMagicPowderCounts.brown = 0;
  coloredMagicPowderCounts.mixed = 0;
  Object.keys(butterflyLocalCatchTombstoneById).forEach(function (id) {
    delete butterflyLocalCatchTombstoneById[id];
  });
  saveButterflyCaughtCounts();
  saveMagicPowderCount();
  saveRockInventoryCount();
  saveCraftFurnitureCounts();
  saveColoredMagicPowderCounts();
  updateBagInventorySlots();
  updateMagicPowderInventoryUi();

  wellState.water = maxWellWater;
  wellState.lastRefillAt = Date.now();
  isBucketFull = false;
  heldBucketId = "";
  heldExtraBucketMainX = 0;
  heldExtraBucketMainY = 0;
  heldExtraBucketMainIsFull = false;
  mainBucketParkedX = 0;
  mainBucketParkedY = 0;
  mainBucketParkedIsFull = false;
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
  rebuildPlacedCraftFurnitureDom();
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
  /** ???????????????????????? ???*/
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    return true;
  }
  /** ????: ???????????????? ??? ??? ?????????? ?????? */
  if (!plantRuntime.isSeedPlanted) {
    return true;
  }
  /** ??? ??????????????????????? ???????UI ??? */
  return plantRuntime.status !== "rotten";
}

function isNearPlantMaster() {
  if (!isPlantMasterVisible()) return false;

  return getCenterDistance(npcX, npcY, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
}

function tryTalkToPlantMaster() {
  if (!isNearPlantMaster()) {
    return false;
  }
  if (isNpcDialogueRunning) {
    return true;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep < 9) {
    flashOnboardingOrderHint("");
    return true;
  }

  startPlantMasterDialogue();
  return true;
}

function clearPlantMasterDialogueTimeouts() {
  plantMasterDialogueTimeoutIds.forEach(function (timeoutId) {
    window.clearTimeout(timeoutId);
  });
  plantMasterDialogueTimeoutIds = [];
}

function schedulePlantMasterDialogueTask(fn, delayMs) {
  const generation = plantMasterDialogueGeneration;
  const timeoutId = window.setTimeout(function () {
    if (generation !== plantMasterDialogueGeneration) return;
    fn();
  }, Math.max(0, Number(delayMs) || 0));
  plantMasterDialogueTimeoutIds.push(timeoutId);
  return timeoutId;
}

function abortPlantMasterDialogue() {
  clearPlantMasterDialogueTimeouts();
  plantMasterDialogueGeneration += 1;
  isNpcDialogueRunning = false;
  if (npcBubble) {
    npcBubble.style.display = "none";
    npcBubble.dataset.promptShown = "false";
  }
  if (playerBubble) {
    playerBubble.style.display = "none";
  }
  window.clearTimeout(npcPromptHideTimeout);
}

function startPlantMasterDialogue() {
  abortPlantMasterDialogue();
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
    const lineDelayMs = timelineMs;
    schedulePlantMasterDialogueTask(function () {
      showDialogueLine(lineInfo);
    }, lineDelayMs);
    timelineMs += Math.max(0, Number(lineInfo.delayAfterMs) || 650);
  });

  schedulePlantMasterDialogueTask(function () {
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

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    abortPlantMasterDialogue();
  }
});

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

function toggleSeed() {
  if (plantRuntime.isPlanting || heldItem) return;
  pickUpNearestItem();
}

function tryPickSharedBucket(bucketDistance, forcedPickInfo) {
  const bucketSize = getBucketSize();
  const pickInfo = forcedPickInfo || getNearestGroundBucketPickInfo();
  const dist = pickInfo ? pickInfo.distance : bucketDistance;
  if (
    dist > bucketPickupDistance ||
    (pickInfo && pickInfo.type === "main" && !canPickUpSharedBucket())
  ) {
    return false;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== 12) {
    flashOnboardingOrderHint("");
    return true;
  }
  heldBucketId = MAIN_BUCKET_ID;
  if (pickInfo && pickInfo.type === "extra" && Array.isArray(appleState.worldExtraBuckets)) {
    const extraIndex = appleState.worldExtraBuckets.findIndex(function (entry) {
      return entry && String(entry.id) === String(pickInfo.id);
    });
    if (extraIndex >= 0) {
      const extra = appleState.worldExtraBuckets[extraIndex];
      heldBucketId = String(extra.id || pickInfo.id || "");
      heldExtraBucketMainX = bucketX;
      heldExtraBucketMainY = bucketY;
      heldExtraBucketMainIsFull = Boolean(isBucketFull);
      isBucketFull = Boolean(extra.isFull);
      appleState.worldExtraBuckets.splice(extraIndex, 1);
      if (extra._el) {
        extra._el.remove();
        extra._el = null;
      }
      mainBucketParkedX = 0;
      mainBucketParkedY = 0;
      mainBucketParkedIsFull = false;
    }
  } else {
    mainBucketParkedX = bucketX;
    mainBucketParkedY = bucketY;
    mainBucketParkedIsFull = Boolean(isBucketFull);
    heldExtraBucketMainX = 0;
    heldExtraBucketMainY = 0;
    heldExtraBucketMainIsFull = false;
  }
  const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
  bucketX = handPosition.x;
  bucketY = handPosition.y;
  heldItem = HELD_ITEM_BUCKET;
  lastBucketPickupAt = Date.now();
  window.OVC_SHARED_BUCKET_HELD_BY = heldBucketId === MAIN_BUCKET_ID ? currentSessionId : "";
  markWorldDirty();
  if (heldBucketId === MAIN_BUCKET_ID) {
    broadcastBucketState(true);
    syncWorldState(true);
  } else {
    broadcastBucketState(true);
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
    saveBucketState();
    syncWorldState(true);
  }
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
 * World hub: worldLooseSeed(????? ???) + extraSeeds + ????+ ??????
 */
function pickUpNearestItemWorldHub(bucketDistance) {
  if (tryPickWorldBagDrop(bucketDistance)) return;

  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;
  const nearestRock = getNearestPickableWorldRock();
  const rockDist = nearestRock ? nearestRock.distance : Infinity;

  if (
    nearestRock &&
    rockDist < extraDist &&
    rockDist <= pickupDistance &&
    rockDist <= bucketDistance &&
    tryPickupWorldRock(nearestRock.rock)
  ) {
    return;
  }

  if (
    nearest &&
    extraDist <= pickupDistance &&
    extraDist <= bucketDistance
  ) {
    if (isWorldLooseSyntheticPickupCandidate(nearest.seed)) {
      ensureWorldLooseSeedShape();
      const now = getSynchronizedNow();
      syncWorldLoosePickupLock(now);
      if (!canPickWorldLooseSeedAt(appleState.worldLooseSeed, worldLoosePickupLockUntil, now)) {
        return;
      }
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
      holdLocalAppleStateAgainstStaleSnapshot(3000);
      syncWorldState(true);
      updateExtraSeedsAndPlants();
      updateSeedInventory();
      triggerFirstSeedFocus();
      return;
    }
    if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
 * Tutorial / ???????index: ??#seed(????? ???) ???????? ????extraSeeds, ??????
 */
function pickUpNearestItemTutorialFlow(seedSize, bucketDistance) {
  if (tryPickWorldBagDrop(bucketDistance)) return;

  const tutorialMainDist = canPickUpSeed()
    ? getCenterDistance(seedX, seedY, seedSize.width, seedSize.height)
    : Infinity;
  const nearest = getNearestPickableExtraSeed();
  const extraDist = nearest ? nearest.distance : Infinity;
  const nearestRock = getNearestPickableWorldRock();
  const rockDist = nearestRock ? nearestRock.distance : Infinity;

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

  if (
    nearestRock &&
    rockDist < extraDist &&
    rockDist <= pickupDistance &&
    rockDist <= bucketDistance &&
    tryPickupWorldRock(nearestRock.rock)
  ) {
    return;
  }

  if (nearest && extraDist <= pickupDistance && extraDist <= bucketDistance) {
    if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
  const bucketPick = getNearestGroundBucketPickInfo();
  const bucketDistance = bucketPick ? bucketPick.distance : Infinity;

  if (usesWorldLooseSeedMode()) {
    pickUpNearestItemWorldHub(bucketDistance);
  } else {
    pickUpNearestItemTutorialFlow(seedSize, bucketDistance);
  }
}

function triggerFirstSeedFocus() {
  if (hasShownFirstSeedFocus) return;

  hasShownFirstSeedFocus = true;
  if (worldBagInventory) worldBagInventory.classList.add("is-first-seed-focus");
  window.clearTimeout(firstSeedFocusTimeout);
  firstSeedFocusTimeout = window.setTimeout(function () {
    if (worldBagInventory) worldBagInventory.classList.remove("is-first-seed-focus");
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

/** Tutorial: extraSeeds?? World hub: ????????? ????? worldLoose ????? ?????(???? ????? ?????? groundSeed.js). */
function getNearestPickableExtraSeed() {
  let nearest = null;
  const now = getSynchronizedNow();
  syncWorldLoosePickupLock(now);

  if (
    usesWorldLooseSeedMode() &&
    canPickWorldLooseSeedAt(appleState.worldLooseSeed, worldLoosePickupLockUntil, now)
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

function canPickupWorldRockPerOnboarding() {
  if (!isOnboardingLinearGateActive()) return true;
  if (usesWorldLooseSeedMode()) {
    return onboardingFlowStep >= ONBOARDING_STEP_EXTRA_SEED;
  }
  return onboardingFlowStep === ONBOARDING_STEP_ROCK;
}

/** @returns {boolean} ?? ?? */
function tryPickupWorldRock(rock) {
  if (!rock || rock.id == null || rock.id === "") return false;
  if (appleState.worldRockPickedIds.includes(rock.id)) return false;
  if (!canPickupWorldRockPerOnboarding()) {
    flashOnboardingOrderHint("");
    return false;
  }
  const counts = getBagInventoryCountsByKey();
  if (
    !canBagInventoryFitItems(
      bagInventoryItemOrder,
      counts,
      { rock: 1 },
      BAG_INVENTORY_SLOT_COUNT
    )
  ) {
    showBagInventoryFullFailMessage();
    return false;
  }
  appleState.worldRockPickedIds.push(rock.id);
  rockInventoryCount += 1;
  lastLocalWorldRockPickupAt = Date.now();
  flashPlantProximityWarning("\uB3CC \uC218\uC9D1");
  plantProximityWarnUntil = lastLocalWorldRockPickupAt + WORLD_ROCK_PICKUP_ACTION_MS;
  saveRockInventoryCount();
  saveAppleState();
  holdLocalAppleStateAgainstStaleSnapshot(1200);
  updateWorldRocks();
  updateBagInventorySlots();
  markWorldDirty();
  if (isWorldDocumentEntry()) {
    broadcastWorldRockPickup(rock.id);
    syncWorldState(true);
    sendMultiplayerPresence(true);
  }
  onboardingHookTutorialRockPicked();
  return true;
}

function tryPickupNearestWorldRock(bucketDistance) {
  const nearestRock = getNearestPickableWorldRock();
  if (!nearestRock) return false;
  const rockDist = nearestRock.distance;
  const bucketDist = Number.isFinite(Number(bucketDistance)) ? Number(bucketDistance) : Infinity;
  if (rockDist > pickupDistance || rockDist > bucketDist) return false;
  return tryPickupWorldRock(nearestRock.rock);
}

function getNearestPickableWorldRock() {
  const tutorialRockStep =
    isOnboardingLinearGateActive() && onboardingFlowStep === ONBOARDING_STEP_ROCK;
  if (!isWorldDocumentEntry() && !tutorialRockStep) return null;
  if (isWorldDocumentEntry() && !isWorldRockPickupUnlocked()) return null;
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

function updateWorldRocks() {
  const tutorialRockDom =
    isMainGameTutorialInProgress() &&
    Array.isArray(appleState.worldRocks) &&
    appleState.worldRocks.some(function (rock) {
      return rock && String(rock.id) === TUTORIAL_ONBOARDING_ROCK_ID && rock._el;
    });
  if ((!isWorldDocumentEntry() && !tutorialRockDom) || !Array.isArray(appleState.worldRocks)) return;
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

function getCraftFurnitureInsertBeforeEl() {
  if (localPlayerRoot && localPlayerRoot.parentNode === ground) {
    return localPlayerRoot;
  }
  if (player && player.parentNode === ground) {
    return player;
  }
  return null;
}

function rebuildPlacedCraftFurnitureDom() {
  if (!ground) return;
  ground.querySelectorAll(".world-craft-furniture").forEach(function (node) {
    node.remove();
  });
  if (!isWorldDocumentEntry()) return;
  const insertBeforeEl = getCraftFurnitureInsertBeforeEl();
  placedCraftFurniture.forEach(function (entry) {
    const spec = getCraftFurnitureWorldSpec(entry.kind);
    if (!spec) return;
    const el = document.createElement("img");
    el.className =
      "world-craft-furniture world-craft-furniture--" +
      entry.kind.replace(/^craft/, "").toLowerCase();
    el.src = spec.src;
    el.alt = "";
    el.draggable = false;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      ground.insertBefore(el, insertBeforeEl);
    } else {
      ground.appendChild(el);
    }
    entry._el = el;
  });
  updatePlacedCraftFurnitureDom();
}

function updatePlacedCraftFurnitureDom() {
  if (!isWorldDocumentEntry()) return;
  placedCraftFurniture.forEach(function (entry) {
    if (!entry._el) return;
    setWorldSize(entry._el, entry.width, entry.height);
    setWorldPosition(entry._el, entry.x, entry.y);
  });
}

function commitPlacedCraftFurnitureEntry(kind, placement) {
  if (!isCraftFurnitureKind(kind) || !placement) return;

  const entry = {
    id: "cf-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
    kind: kind,
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height
  };
  assignCraftFurnitureIdentity(entry, getPlanterOwnerId(), getPlanterDisplayName());
  placedCraftFurniture.push(entry);
  refreshCraftFurnitureIdentityOrdinals(placedCraftFurniture);

  if (isWorldDocumentEntry() && ground) {
    const spec = getCraftFurnitureWorldSpec(kind);
    if (spec) {
      const insertBeforeEl = getCraftFurnitureInsertBeforeEl();
      const el = document.createElement("img");
      el.className =
        "world-craft-furniture world-craft-furniture--" +
        kind.replace(/^craft/, "").toLowerCase();
      el.src = spec.src;
      el.alt = "";
      el.draggable = false;
      el.setAttribute("aria-hidden", "true");
      if (insertBeforeEl) {
        ground.insertBefore(el, insertBeforeEl);
      } else {
        ground.appendChild(el);
      }
      entry._el = el;
      setWorldSize(el, entry.width, entry.height);
      setWorldPosition(el, entry.x, entry.y);
    }
  }

  holdLocalAppleStateAgainstStaleSnapshot(3000);
  saveAppleState();
  markWorldDirty();
  syncWorldState(true);
}

function finishCraftFurnitureInstall() {
  const kind = craftFurnitureInstallingKind;
  const placement = craftFurniturePendingPlacement;
  clearCraftFurnitureInstalling();
  playerStatus.textContent = "";
  updatePlayerStatus();
  sendMultiplayerPresence(true);
  if (!kind || !placement) return;
  commitPlacedCraftFurnitureEntry(kind, placement);
}

function useCraftFurnitureFromBag(kind) {
  if (!isCraftFurnitureKind(kind)) return;
  if (!canUseBagInventoryGameplay()) {
    showBagRequiredForGameplayMessage();
    return;
  }
  if ((Number(craftFurnitureCounts[kind]) || 0) <= 0) return;
  if (isPlayerHealthGameplayBlocked()) return;

  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    return;
  }

  if (
    isPlayerTimedActionBusy() ||
    isPlayerGameplayBlockedByNpcDialogue() ||
    !isOnGround
  ) {
    return;
  }

  const placement = computeCraftFurniturePlacement(
    kind,
    getPlayerCenterX(),
    getPlayerFootY()
  );
  if (!placement) return;
  const craftBlockMsg = getCraftFurniturePlacementBlockMessage(placement);
  if (craftBlockMsg) {
    flashPlantProximityWarning(craftBlockMsg);
    return;
  }
  if (!removeOneBagItemForTrade(kind)) return;

  const installMs = getCraftFurnitureInstallDurationMs(kind);
  if (installMs <= 0) {
    commitPlacedCraftFurnitureEntry(kind, placement);
    return;
  }

  craftFurnitureInstallingKind = kind;
  craftFurniturePendingPlacement = {
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height
  };
  resetInputKeys(keys);
  playerStatus.textContent = getCraftFurnitureInstallStatusText(kind);
  updatePlayerStatus();
  sendMultiplayerPresence(true);
  craftFurnitureInstallTimeoutId = window.setTimeout(function () {
    craftFurnitureInstallTimeoutId = 0;
    finishCraftFurnitureInstall();
  }, installMs);
}

function pickApple() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_PICK_APPLE) {
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
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === ONBOARDING_STEP_PICK_APPLE) {
    onboardingFlowStep = ONBOARDING_STEP_EAT_APPLE;
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

  syncGuideInventoryBar();
  updateBagInventorySlots();
  updateWorldRocks();
}

function eatApple() {
  if (
    appleState.count <= 0 ||
    isPlayerTimedActionBusy() ||
    isPlayerGameplayBlockedByNpcDialogue()
  ) {
    return;
  }
  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EAT_APPLE) {
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
    playerHealth = healPlayerHealth(playerHealth, PLAYER_APPLE_HEAL_AMOUNT);
    savePlayerHealthState();
    createSeedFromApple();
    if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === ONBOARDING_STEP_EAT_APPLE) {
      onboardingFlowStep = ONBOARDING_STEP_EXTRA_SEED;
      onboardingSeedTutorialSecondLine = false;
      onboardingPostAppleSeedIntroPhase = 0;
      persistOnboardingStep();
      if (onboardingFruitIntroTimerId) {
        window.clearTimeout(onboardingFruitIntroTimerId);
      }
      onboardingFruitIntroTimerId = window.setTimeout(function () {
        onboardingFruitIntroTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_EXTRA_SEED) {
          return;
        }
        onboardingPostAppleSeedIntroPhase = 1;
        updateOnboardingFlowUI();
      }, 2000);
      if (onboardingTreeLeaveHintTimerId) {
        window.clearTimeout(onboardingTreeLeaveHintTimerId);
      }
      onboardingTreeLeaveHintTimerId = window.setTimeout(function () {
        onboardingTreeLeaveHintTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || onboardingFlowStep !== ONBOARDING_STEP_EXTRA_SEED) {
          return;
        }
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

/** ??????UI(???NPC?????? ???????? ???*/
const WORLD_ROCK_UI_CLEAR_PAD = 10;

function expandWorldRockAvoidRect(left, top, w, h, pad) {
  return {
    left: left - pad,
    top: top - pad,
    right: left + w + pad,
    bottom: top + h + pad
  };
}

function worldRockRect(x, y, size) {
  return { left: x, top: y, right: x + size, bottom: y + size };
}

function worldRockOverlapsAnyAvoidRect(rockRect, zones) {
  for (let i = 0; i < zones.length; i += 1) {
    if (isOverlappingRect(rockRect, zones[i])) {
      return true;
    }
  }
  return false;
}

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

  const apples = (ctx && ctx.apples) || [];
  apples.forEach(function (a) {
    if (!a) return;
    const sz = Number.isFinite(Number(a.size)) ? Number(a.size) : 10;
    const ax = Number(a.x);
    const ay = Number(a.y);
    if (!Number.isFinite(ax) || !Number.isFinite(ay)) return;
    zones.push(expandWorldRockAvoidRect(ax, ay, sz, sz, p));
  });

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

  const extraPlants = (ctx && ctx.extraPlants) || [];
  extraPlants.forEach(function (plant) {
    if (!plant || plant.removed) return;
    addPlantWorldRockAvoidZone(zones, plant, p);
  });

  if (ctx && ctx.plantSpot) {
    addPlantWorldRockAvoidZone(zones, ctx.plantSpot, p);
  }

  return zones;
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

function getUnpickedWorldRockCount() {
  if (!Array.isArray(appleState.worldRocks)) return 0;
  const picked = new Set((appleState.worldRockPickedIds || []).map(String));
  return appleState.worldRocks.filter(function (rock) {
    return rock && !picked.has(String(rock.id));
  }).length;
}

function tryRespawnOneWorldRockIfBelowCap() {
  if (!isWorldDocumentEntry() || !isWorldRockPickupUnlocked()) return false;
  if (!Array.isArray(appleState.worldRocks)) appleState.worldRocks = [];
  if (!Array.isArray(appleState.worldRockPickedIds)) appleState.worldRockPickedIds = [];
  if (getUnpickedWorldRockCount() >= WORLD_LOOSE_ROCK_COUNT) return false;

  const size = WORLD_ROCK_SIZE;
  const pos = pickRandomWorldRockSpawnPosition(size, buildWorldRockSpawnContext(), appleState.worldRocks);
  if (!pos) return false;

  const pickedSet = new Set(appleState.worldRockPickedIds.map(String));
  let rock = appleState.worldRocks.find(function (r) {
    return r && pickedSet.has(String(r.id));
  });

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

  rock.x = pos.x;
  rock.y = pos.y;
  rock.size = size;
  appleState.worldRockPickedIds = appleState.worldRockPickedIds.filter(function (id) {
    return String(id) !== String(rock.id);
  });

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

  updateWorldRocks();
  saveAppleState();
  markWorldDirty();
  return true;
}

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

function getWorldExtraBucketInsertBeforeEl() {
  if (localPlayerRoot && localPlayerRoot.parentNode === ground) {
    return localPlayerRoot;
  }
  if (player && player.parentNode === ground) {
    return player;
  }
  return null;
}

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
    el.src = entry.isFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
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

function getGroundBucketZIndex(worldY) {
  const y = Number(worldY);
  if (!Number.isFinite(y)) return 17;
  return Math.min(18, Math.max(4, 4 + Math.floor(y / 28)));
}

/** ?? ??? ???? ?? ???? ?? ??? ?? ???? ?? ??? ?? ?? */
function isWorldExtraBucketOverlappingSharedMain(entry) {
  if (!entry || isMainBucketHeldByRemotePlayer() || isHoldingMainBucket()) return false;
  if (isHoldingExtraBucket() && String(entry.id) === String(heldBucketId || "")) return false;
  const main = getMainBucketGroundState();
  const ex = Number(entry.x) || 0;
  const ey = Number(entry.y) || 0;
  const mx = Number(main.x) || 0;
  const my = Number(main.y) || 0;
  return Math.abs(ex - mx) < 4 && Math.abs(ey - my) < 4;
}

function updateWorldExtraBuckets() {
  if (!isWorldDocumentEntry() || !Array.isArray(appleState.worldExtraBuckets)) return;
  const bucketSz = getBucketSize();
  appleState.worldExtraBuckets.forEach(function (entry) {
    if (!entry || !entry._el) return;
    const overlapsMain = isWorldExtraBucketOverlappingSharedMain(entry);
    entry._el.style.display = overlapsMain ? "none" : "block";
    if (overlapsMain) return;
    setWorldSize(entry._el, bucketSz.width, bucketSz.height);
    setWorldPosition(entry._el, entry.x, entry.y);
    entry._el.style.zIndex = String(getGroundBucketZIndex(entry.y));
    entry._el.src = entry.isFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
  });
}

function ensureWorldBagDropsArray() {
  if (!Array.isArray(appleState.worldBagDrops)) {
    appleState.worldBagDrops = [];
  }
}

function teardownWorldBagDropDom(drop) {
  if (drop && drop._el) {
    drop._el.remove();
    drop._el = null;
  }
}

function rebuildWorldBagDropDom() {
  if (!ground) return;
  ensureWorldBagDropsArray();
  ground.querySelectorAll(".world-bag-drop").forEach(function (node) {
    node.remove();
  });
  appleState.worldBagDrops.forEach(function (drop) {
    drop._el = null;
  });
  updateWorldBagDropDom(true);
}

function buildWorldBagDropElement(drop, stackIndex) {
  const visual = getBagDropGroundVisual(drop.itemKey);
  if (!visual) return null;

  const root = document.createElement("div");
  root.className = "world-bag-drop";
  root.dataset.dropId = String(drop.id);
  root.setAttribute("aria-hidden", "true");
  root.style.zIndex = String(getWorldBagDropZIndex(drop, stackIndex));

  const inner = document.createElement("div");
  inner.className = "world-bag-drop__inner";
  const dropAgeMs = Date.now() - (Number(drop.droppedAt) || 0);
  if (dropAgeMs >= 0 && dropAgeMs < 600) {
    inner.classList.add("is-settling");
    inner.addEventListener(
      "animationend",
      function () {
        inner.classList.remove("is-settling");
      },
      { once: true }
    );
  }

  const stack = document.createElement("div");
  stack.className = "world-bag-drop__stack";

  if (visual.kind === "img") {
    const img = document.createElement("img");
    img.className = "world-bag-drop__icon";
    img.src = visual.src;
    img.alt = visual.alt || "";
    img.draggable = false;
    stack.appendChild(img);
  } else {
    const icon = document.createElement("span");
    icon.className = "world-bag-drop__icon " + (visual.className || "bag-drop-icon");
    icon.setAttribute("aria-hidden", "true");
    stack.appendChild(icon);
  }

  const count = Math.max(1, Math.floor(Number(drop.count) || 0));
  if (count > 1) {
    const countEl = document.createElement("span");
    countEl.className = "world-bag-drop__count";
    countEl.textContent = formatWorldBagDropCountLabel(count);
    stack.appendChild(countEl);
  }

  inner.appendChild(stack);
  root.appendChild(inner);
  return root;
}

function updateWorldBagDropDom(forceRebuild) {
  if (!ground) return;
  ensureWorldBagDropsArray();
  const stackIndexById = Object.create(null);
  const stacks = Object.create(null);
  sortWorldBagDropsForRender(appleState.worldBagDrops).forEach(function (drop) {
    const key = drop.stackKey || getBagDropStackKey(drop.x, drop.y);
    const idx = stacks[key] || 0;
    stacks[key] = idx + 1;
    stackIndexById[String(drop.id)] = idx;
  });

  appleState.worldBagDrops = appleState.worldBagDrops.filter(function (drop) {
    return drop && canDiscardBagItemKey(drop.itemKey);
  });

  appleState.worldBagDrops.forEach(function (drop) {
    const stackIndex = stackIndexById[String(drop.id)] || 0;
    if (!drop._el || forceRebuild || !document.contains(drop._el)) {
      teardownWorldBagDropDom(drop);
      const el = buildWorldBagDropElement(drop, stackIndex);
      if (!el) return;
      ground.appendChild(el);
      drop._el = el;
    } else {
      drop._el.style.zIndex = String(getWorldBagDropZIndex(drop, stackIndex));
      const countEl = drop._el.querySelector(".world-bag-drop__count");
      const count = Math.max(1, Math.floor(Number(drop.count) || 0));
      if (count > 1) {
        if (countEl) {
          countEl.textContent = formatWorldBagDropCountLabel(count);
        } else {
          const inner = drop._el.querySelector(".world-bag-drop__inner");
          const mount =
            (inner && inner.querySelector(".world-bag-drop__stack")) || inner;
          if (mount) {
            const next = document.createElement("span");
            next.className = "world-bag-drop__count";
            next.textContent = formatWorldBagDropCountLabel(count);
            mount.appendChild(next);
          }
        }
      } else if (countEl) {
        countEl.remove();
      }
    }
    setWorldSize(drop._el, BAG_DROP_WORLD_SIZE, BAG_DROP_WORLD_SIZE);
    setWorldPosition(drop._el, Number(drop.x) || 0, Number(drop.y) || 0);
  });
}

function getLocalBagDropSpawnPosition() {
  const x = snapBagDropCoord(getPlayerCenterX() - BAG_DROP_WORLD_SIZE / 2);
  const y = snapBagDropCoord(getPlayerFootY() + BAG_DROP_FOOT_OFFSET_Y);
  return { x: x, y: y };
}

function bagDiscardInventoryEligible(itemKey) {
  const counts = getBagInventoryCountsByKey();
  if (Number(counts[itemKey] || 0) <= 0) return false;
  if (itemKey === "seed" && !usesWorldLooseSeedMode()) {
    const seedIndex = appleState.extraSeeds.findIndex(function (extraSeed) {
      return (
        extraSeed.inInventory &&
        !extraSeed.planted &&
        extraSeed.id !== plantingInventorySeedId
      );
    });
    if (seedIndex < 0) return false;
    const seed = appleState.extraSeeds[seedIndex];
    if (
      isOnboardingLinearGateActive() &&
      (seed.isStarter || seed.id === "starter-seed")
    ) {
      return false;
    }
  }
  return true;
}

function canDiscardBagItemFromBagPanel(itemKey) {
  if (!canDiscardBagItemKey(itemKey)) return false;
  if (isBagDiscardModalOpen()) return false;
  if (!bagInventoryPanelOpen) return false;
  if (!isTradeExchangeOpen() && !isAlchemyCraftOpen()) return false;
  return bagDiscardInventoryEligible(itemKey);
}

function canDiscardBagItemNow(itemKey) {
  if (!canDiscardBagItemKey(itemKey)) return false;
  if (isTradeExchangeOpen() || isAlchemyCraftOpen() || isBagDiscardModalOpen()) return false;
  if (!bagInventoryPanelOpen) return false;
  return bagDiscardInventoryEligible(itemKey);
}

function removeBagItemsFromInventory(itemKey, amount) {
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  for (let i = 0; i < n; i++) {
    if (!removeOneBagItemForTrade(itemKey)) return false;
  }
  return true;
}

function spawnWorldBagDropAt(itemKey, amount, x, y) {
  if (!canDiscardBagItemKey(itemKey)) return null;
  ensureWorldBagDropsArray();
  const count = Math.max(1, Math.floor(Number(amount) || 0));
  const sx = snapBagDropCoord(x);
  const sy = snapBagDropCoord(y);
  const now = Date.now();
  const drop = {
    id: createWorldBagDropId(),
    itemKey: itemKey,
    count: count,
    x: sx,
    y: sy,
    stackKey: getBagDropStackKey(sx, sy),
    droppedAt: now,
    droppedBySessionId: currentSessionId || "",
    _el: null
  };
  appleState.worldBagDrops.push(drop);
  lastWorldBagDropChangeAt = now;
  lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, now);
  updateWorldBagDropDom();
  markWorldDirty();
  broadcastWorldBagDrop(drop);
  syncWorldState(true);
  return drop;
}

function discardBagItemsToGround(itemKey, amount, options) {
  itemKey = normalizeBagItemKey(itemKey);
  const max = Math.max(0, Math.floor(Number(amount) || 0));
  const allowCraftTrade = Boolean(options && options.allowCraftTrade);
  const canDiscard = allowCraftTrade
    ? canDiscardBagItemFromBagPanel(itemKey)
    : canDiscardBagItemNow(itemKey);
  if (max <= 0 || !canDiscard) return false;
  const pos = getLocalBagDropSpawnPosition();
  if (!removeBagItemsFromInventory(itemKey, max)) return false;
  spawnWorldBagDropAt(itemKey, max, pos.x, pos.y);
  return true;
}

function tryPickWorldBagDrop(bucketDistance) {
  if (!canUseBagInventoryGameplay()) return false;
  ensureWorldBagDropsArray();
  if (!appleState.worldBagDrops.length) return false;
  const info = findNearestWorldBagDropPickup(
    appleState.worldBagDrops,
    getPlayerCenterX(),
    getPlayerFootY(),
    Math.min(pickupDistance, bucketDistance)
  );
  if (!info) return false;
  const drop = info.drop;
  const itemKey = normalizeBagItemKey(drop.itemKey);
  const count = Math.max(1, Math.floor(Number(drop.count) || 0));
  if (!canAddBagItemsForTrade({ [itemKey]: count })) {
    showBagInventoryFullFailMessage();
    return true;
  }
  const dropId = String(drop.id);
  const idx = appleState.worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return false;
  teardownWorldBagDropDom(appleState.worldBagDrops[idx]);
  appleState.worldBagDrops.splice(idx, 1);
  addBagItemsForTrade(itemKey, count);
  const now = Date.now();
  lastWorldBagDropChangeAt = now;
  lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, now);
  holdLocalAppleStateAgainstStaleSnapshot(1200);
  updateWorldBagDropDom();
  markWorldDirty();
  broadcastWorldBagDropPickup(dropId);
  syncWorldState(true);
  sendMultiplayerPresence(true);
  return true;
}

function removeExpiredWorldBagDrops(now) {
  ensureWorldBagDropsArray();
  if (!appleState.worldBagDrops.length) return false;
  const t = now != null ? now : getSynchronizedNow();
  let removed = false;
  const kept = [];
  appleState.worldBagDrops.forEach(function (drop) {
    if (!drop || isWorldBagDropExpired(drop, t)) {
      if (drop) {
        teardownWorldBagDropDom(drop);
        removed = true;
      }
    } else {
      kept.push(drop);
    }
  });
  if (!removed) return false;
  appleState.worldBagDrops = kept;
  lastWorldBagDropChangeAt = t;
  lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, t);
  updateWorldBagDropDom();
  markWorldDirty();
  syncWorldState(true);
  return true;
}

function tickWorldBagDropDespawn(now) {
  if (!isWorldDocumentEntry()) return;
  ensureWorldBagDropsArray();
  if (!appleState.worldBagDrops.length) return;
  const t = now != null ? now : Date.now();
  if (
    lastWorldBagDropDespawnAt > 0 &&
    t - lastWorldBagDropDespawnAt < WORLD_BAG_DROP_DESPAWN_TICK_MS
  ) {
    return;
  }
  lastWorldBagDropDespawnAt = t;
  removeExpiredWorldBagDrops(getSynchronizedNow());
}

function mergeWorldBagDropsFromSnapshot(incoming) {
  ensureWorldBagDropsArray();
  const syncNow = getSynchronizedNow();
  const parsed = (Array.isArray(incoming) ? incoming : [])
    .map(parseWorldBagDropFromSnapshot)
    .filter(Boolean)
    .filter(function (drop) {
      return !isWorldBagDropExpired(drop, syncNow);
    });
  const localPending = appleState.worldBagDrops.filter(function (drop) {
    const t = Number(drop.droppedAt) || 0;
    return t > 0 && Date.now() - t < 2500;
  });
  const byId = Object.create(null);
  parsed.forEach(function (drop) {
    byId[String(drop.id)] = drop;
  });
  localPending.forEach(function (drop) {
    const id = String(drop.id);
    const existing = byId[id];
    if (!existing || Number(drop.droppedAt) > Number(existing.droppedAt)) {
      byId[id] = drop;
    }
  });
  const next = Object.keys(byId).map(function (id) {
    return byId[id];
  });
  appleState.worldBagDrops.forEach(function (drop) {
    if (!byId[String(drop.id)]) {
      teardownWorldBagDropDom(drop);
    }
  });
  appleState.worldBagDrops = next;
}

function serializeWorldBagDropsForSnapshot() {
  ensureWorldBagDropsArray();
  const syncNow = getSynchronizedNow();
  return appleState.worldBagDrops
    .filter(function (drop) {
      return drop && !isWorldBagDropExpired(drop, syncNow);
    })
    .map(serializeWorldBagDropForSnapshot)
    .filter(Boolean);
}

function broadcastWorldBagDrop(drop) {
  if (!multiplayerChannel || !currentSessionId || !drop) return;
  const at = Date.now();
  const eventId = makeSyncEventId("world_bag_drop", String(drop.id), at);
  consumeSyncEventId(eventId, at);
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_bag_drop",
      payload: {
        from: currentSessionId,
        eventId: eventId,
        at: at,
        drop: serializeWorldBagDropForSnapshot(drop)
      }
    })
  ).catch(function () {});
}

function broadcastWorldBagDropPickup(dropId) {
  if (!multiplayerChannel || !currentSessionId) return;
  const rid = String(dropId || "");
  if (!rid) return;
  const at = Date.now();
  const eventId = makeSyncEventId("world_bag_drop_pickup", rid, at);
  consumeSyncEventId(eventId, at);
  Promise.resolve(
    multiplayerChannel.send({
      type: "broadcast",
      event: "world_bag_drop_pickup",
      payload: {
        from: currentSessionId,
        eventId: eventId,
        at: at,
        dropId: rid
      }
    })
  ).catch(function () {});
}

function handleRemoteWorldBagDropBroadcast(payload) {
  if (!payload || payload.from === currentSessionId) return;
  const now = getSynchronizedNow();
  if (!consumeSyncEventId(payload.eventId, now)) return;
  const raw = payload.drop;
  const drop = parseWorldBagDropFromSnapshot(raw);
  if (!drop || isWorldBagDropExpired(drop, now)) return;
  ensureWorldBagDropsArray();
  const id = String(drop.id);
  const existing = appleState.worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === id;
  });
  if (existing >= 0) {
    teardownWorldBagDropDom(appleState.worldBagDrops[existing]);
    appleState.worldBagDrops[existing] = drop;
  } else {
    appleState.worldBagDrops.push(drop);
  }
  updateWorldBagDropDom();
}

function handleRemoteWorldBagDropPickupBroadcast(payload) {
  if (!payload || payload.from === currentSessionId) return;
  const now = getSynchronizedNow();
  if (!consumeSyncEventId(payload.eventId, now)) return;
  const dropId = String(payload.dropId || "");
  if (!dropId) return;
  ensureWorldBagDropsArray();
  const idx = appleState.worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return;
  teardownWorldBagDropDom(appleState.worldBagDrops[idx]);
  appleState.worldBagDrops.splice(idx, 1);
  updateWorldBagDropDom();
}

function getBagItemKeyFromInventorySlot(slot) {
  if (!slot) return "";
  const index = Number(slot.dataset.slot);
  if (!Number.isFinite(index)) return "";
  return bagInventoryItemOrder[index] || "";
}

function getBagInventoryItemCount(itemKey) {
  const counts = getBagInventoryCountsByKey();
  return Math.max(0, Math.floor(Number(counts[normalizeBagItemKey(itemKey)] || 0)));
}

function canStartBagPanelCraftTradeDrag(itemKey) {
  if (!itemKey) return false;
  if (isAlchemyCraftOpen()) return canDragBagItemToAlchemyCraft(itemKey);
  if (isTradeExchangeOpen()) return canDragBagItemToTradeCounter(itemKey);
  return false;
}

function clearBagInventoryDragVisual() {
  if (bagInventoryDragGhostEl) {
    bagInventoryDragGhostEl.remove();
    bagInventoryDragGhostEl = null;
  }
  if (bagInventoryDragState && bagInventoryDragState.sourceSlot) {
    bagInventoryDragState.sourceSlot.classList.remove("is-bag-drag-source");
  }
  bagInventoryDragState = null;
}

function ensureBagInventoryDragGhost(html) {
  if (!bagInventoryDragGhostEl) {
    bagInventoryDragGhostEl = document.createElement("div");
    bagInventoryDragGhostEl.id = "bag-discard-drag-ghost";
    document.body.appendChild(bagInventoryDragGhostEl);
  }
  bagInventoryDragGhostEl.innerHTML = html || "";
}

function onBagInventorySlotPointerDown(event) {
  if (!bagInventoryPanelOpen || !bagInventoryPanel) return;
  if (event.button !== 0) return;
  const slot = event.target.closest(".bag-inventory-slot");
  if (!slot || !bagInventoryPanel.contains(slot)) return;
  if (slot === bagBookStorageSlot) return;
  const itemKey = getBagItemKeyFromInventorySlot(slot);
  const craftTradeOpen = isTradeExchangeOpen() || isAlchemyCraftOpen();
  if (craftTradeOpen) {
    if (!itemKey || slot.classList.contains("is-empty")) return;
    const canPlaceOnTarget = canStartBagPanelCraftTradeDrag(itemKey);
    const canDiscardWhileOpen = canDiscardBagItemFromBagPanel(itemKey);
    if (!canPlaceOnTarget && !canDiscardWhileOpen) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    bagInventoryDragState = {
      itemKey: itemKey,
      sourceSlot: slot,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      mode: isAlchemyCraftOpen() ? "alchemy" : "trade"
    };
    slot.classList.add("is-bag-drag-source");
    slot.setPointerCapture(event.pointerId);
    return;
  }
  if (!canDiscardBagItemNow(itemKey)) return;
  event.preventDefault();
  event.stopPropagation();
  bagInventoryDragState = {
    itemKey: itemKey,
    sourceSlot: slot,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    mode: "discard"
  };
  slot.classList.add("is-bag-drag-source");
  slot.setPointerCapture(event.pointerId);
}

function onBagInventorySlotPointerMove(event) {
  if (!bagInventoryDragState) return;
  const dx = event.clientX - bagInventoryDragState.startX;
  const dy = event.clientY - bagInventoryDragState.startY;
  if (!bagInventoryDragState.dragging && dx * dx + dy * dy < 36) return;
  bagInventoryDragState.dragging = true;
  const descriptor = getBagItemDescriptorCore(bagInventoryDragState.itemKey);
  ensureBagInventoryDragGhost(descriptor.iconHtml);
  if (bagInventoryDragGhostEl) {
    bagInventoryDragGhostEl.style.left = event.clientX - 24 + "px";
    bagInventoryDragGhostEl.style.top = event.clientY - 24 + "px";
  }
}

function isPointerOutsideBagInventoryPanel(clientX, clientY) {
  if (!bagInventoryPanel || bagInventoryPanel.style.display === "none") return true;
  const rect = bagInventoryPanel.getBoundingClientRect();
  return (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  );
}

function isPointerInsideBagInventoryPanel(clientX, clientY) {
  return !isPointerOutsideBagInventoryPanel(clientX, clientY);
}

/** ?? ?? ?? + ?? ?? ??(??/?? ? ?? ?? UI) */
function isPointerOverBagInventoryUi(clientX, clientY) {
  if (isPointerInsideBagInventoryPanel(clientX, clientY)) return true;
  if (
    worldBagInventory &&
    worldBagInventory.style.display !== "none" &&
    !worldBagInventory.hidden
  ) {
    return isPointerInElementRect(clientX, clientY, worldBagInventory);
  }
  return false;
}

function getBagDragDropTargetAt(clientX, clientY) {
  const ghost = bagInventoryDragGhostEl;
  const prevDisplay = ghost ? ghost.style.display : "";
  if (ghost) ghost.style.display = "none";
  let target = null;
  try {
    target = document.elementFromPoint(clientX, clientY);
  } finally {
    if (ghost) ghost.style.display = prevDisplay;
  }
  return target instanceof Element ? target : null;
}

function isPointerInElementRect(clientX, clientY, el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 && rect.height <= 0) return false;
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}

function getTradeExchangePanelElement() {
  if (!tradeExchangeOverlay || tradeExchangeOverlay.style.display === "none") return null;
  return tradeExchangeOverlay.querySelector(".trade-exchange-panel");
}

function isPointerOverTradeExchangeDropZone(clientX, clientY) {
  const panel = getTradeExchangePanelElement();
  if (!panel) return false;
  return isPointerInElementRect(clientX, clientY, panel);
}

function getAlchemyCraftPanelElement() {
  if (!alchemyCraftOverlay || alchemyCraftOverlay.style.display === "none") return null;
  return alchemyCraftOverlay.querySelector(".alchemy-craft-panel");
}

function isPointerOverAlchemyCraftDropZone(clientX, clientY) {
  if (!isAlchemyCraftOpen()) return false;
  const panel = getAlchemyCraftPanelElement();
  if (!panel) return false;
  return isPointerInElementRect(clientX, clientY, panel);
}

/**
 * ??/?? ??? ??: placed | cancelled(?????????? ?) | discard(? ?)
 * @returns {"placed"|"cancelled"|"discard"}
 */
function resolveBagCraftTradeDropAt(clientX, clientY, itemKey, dragMode) {
  if (isPointerOverBagInventoryUi(clientX, clientY)) return "cancelled";
  const target = getBagDragDropTargetAt(clientX, clientY);
  if (dragMode === "alchemy" && isAlchemyCraftOpen()) {
    if (isPointerOverAlchemyCraftDropZone(clientX, clientY)) {
      if (
        canDragBagItemToAlchemyCraft(itemKey) &&
        tryDropBagItemOnAlchemyRequirement(itemKey, target)
      ) {
        return "placed";
      }
      return "cancelled";
    }
    return "discard";
  }
  if (dragMode === "trade" && isTradeExchangeOpen()) {
    if (isPointerOverTradeExchangeDropZone(clientX, clientY)) {
      if (canDragBagItemToTradeCounter(itemKey) && tryDropBagItemOnTradeCounter(itemKey, target)) {
        return "placed";
      }
      return "cancelled";
    }
    return "discard";
  }
  return "cancelled";
}

async function tryDiscardBagItemFromDrag(itemKey) {
  if (!canDiscardBagItemFromBagPanel(itemKey)) return;
  const counts = getBagInventoryCountsByKey();
  const maxCount = Math.max(0, Math.floor(Number(counts[itemKey] || 0)));
  if (maxCount <= 0) return;
  const amount = await openBagDiscardQuantityModal(itemKey, maxCount);
  if (amount > 0) {
    discardBagItemsToGround(itemKey, amount, { allowCraftTrade: true });
  }
}

async function finishBagInventoryDrag(event) {
  if (!bagInventoryDragState) return;
  const state = bagInventoryDragState;
  const itemKey = state.itemKey;
  const wasDragging = state.dragging;
  const dragMode = state.mode || "discard";
  const slot = state.sourceSlot;
  if (slot && slot.hasPointerCapture(event.pointerId)) {
    try {
      slot.releasePointerCapture(event.pointerId);
    } catch (eCap) {}
  }
  clearBagInventoryDragVisual();
  if (!wasDragging) return;
  craftTradeDragClickSuppress = true;
  if (dragMode === "tradeReturn" && isTradeExchangeOpen()) {
    if (isPointerOverBagInventoryUi(event.clientX, event.clientY)) {
      returnTradeCounterStackToInventory(itemKey);
    }
    return;
  }
  if (dragMode === "alchemyReturn" && isAlchemyCraftOpen()) {
    if (isPointerOverBagInventoryUi(event.clientX, event.clientY)) {
      const slotIndex = Number(state.alchemySlotIndex);
      if (Number.isFinite(slotIndex) && slotIndex >= 0) {
        returnAlchemySlotStackToInventory(slotIndex);
      }
    }
    return;
  }
  if (dragMode === "alchemy" && isAlchemyCraftOpen()) {
    const dropResult = resolveBagCraftTradeDropAt(
      event.clientX,
      event.clientY,
      itemKey,
      "alchemy"
    );
    if (dropResult === "placed") return;
    if (dropResult === "discard") await tryDiscardBagItemFromDrag(itemKey);
    return;
  }
  if (dragMode === "trade" && isTradeExchangeOpen()) {
    const dropResult = resolveBagCraftTradeDropAt(
      event.clientX,
      event.clientY,
      itemKey,
      "trade"
    );
    if (dropResult === "placed") return;
    if (dropResult === "discard") await tryDiscardBagItemFromDrag(itemKey);
    return;
  }
  if (!isPointerOutsideBagInventoryPanel(event.clientX, event.clientY)) return;
  if (!canDiscardBagItemNow(itemKey)) return;
  const counts = getBagInventoryCountsByKey();
  const maxCount = Math.max(0, Math.floor(Number(counts[itemKey] || 0)));
  if (maxCount <= 0) return;
  const amount = await openBagDiscardQuantityModal(itemKey, maxCount);
  if (amount > 0) {
    discardBagItemsToGround(itemKey, amount);
  }
}

function onBagInventorySlotPointerUp(event) {
  if (!bagInventoryDragState) return;
  const wasDragging = bagInventoryDragState.dragging;
  finishBagInventoryDrag(event);
  if (wasDragging) {
    event.preventDefault();
  }
}

function onBagInventorySlotPointerCancel(event) {
  if (!bagInventoryDragState) return;
  clearBagInventoryDragVisual();
}

function onTradeCounterChipPointerDown(event) {
  if (!isTradeExchangeOpen() || !tradeCounterSlot) return;
  if (event.button !== 0) return;
  const chip = event.target.closest(".trade-counter-chip");
  if (!chip || !tradeCounterSlot.contains(chip)) return;
  const itemKey = chip.dataset.itemKey || "";
  if (!itemKey) return;
  event.preventDefault();
  event.stopPropagation();
  bagInventoryDragState = {
    itemKey: itemKey,
    sourceSlot: chip,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    mode: "tradeReturn"
  };
  chip.classList.add("is-bag-drag-source");
  chip.setPointerCapture(event.pointerId);
}

function onAlchemyRequirementSlotPointerDown(event) {
  if (!isAlchemyCraftOpen() || !alchemyCraftRequirementSlots) return;
  if (event.button !== 0) return;
  const slotEl = event.target.closest(".alchemy-craft-req-slot");
  if (!slotEl || !alchemyCraftRequirementSlots.contains(slotEl)) return;
  if (!slotEl.classList.contains("is-partial") && !slotEl.classList.contains("is-filled")) return;
  const slotIndex = Number(slotEl.dataset.slotIndex);
  if (!Number.isFinite(slotIndex) || slotIndex < 0) return;
  const itemKey = slotEl.dataset.itemKey || "";
  event.preventDefault();
  event.stopPropagation();
  bagInventoryDragState = {
    itemKey: itemKey,
    alchemySlotIndex: slotIndex,
    sourceSlot: slotEl,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
    mode: "alchemyReturn"
  };
  slotEl.classList.add("is-bag-drag-source");
  slotEl.setPointerCapture(event.pointerId);
}

function serializeWorldExtraBucketsForSnapshot(buckets) {
  return (Array.isArray(buckets) ? buckets : [])
    .filter(Boolean)
    .map(function (bucket) {
      return {
        id: String(bucket.id || ""),
        x: Number(bucket.x) || 0,
        y: Number(bucket.y) || 0,
        isFull: Boolean(bucket.isFull)
      };
    })
    .filter(function (bucket) {
      return bucket.id !== "";
    });
}

function parseWorldExtraBucketsFromSnapshot(raw) {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter(Boolean)
    .map(function (bucket, index) {
      return {
        id: String(bucket.id || "world-bucket-" + (index + 1)),
        x: Number(bucket.x) || 0,
        y: Number(bucket.y) || 0,
        isFull: Boolean(bucket.isFull)
      };
    });
}

function notePendingLocalExtraBucketDrop(bucketId) {
  const id = String(bucketId || "");
  if (!id) return;
  pendingLocalExtraBucketDropUntilById[id] = Date.now() + 4500;
}

function notePendingLocalExtraBucketSpawn(bucketId) {
  const id = String(bucketId || "");
  if (!id) return;
  pendingLocalExtraBucketSpawnUntilById[id] = Date.now() + 4500;
}

function prunePendingLocalExtraBucketDrops() {
  const now = Date.now();
  Object.keys(pendingLocalExtraBucketDropUntilById).forEach(function (id) {
    if (pendingLocalExtraBucketDropUntilById[id] <= now) {
      delete pendingLocalExtraBucketDropUntilById[id];
    }
  });
  Object.keys(pendingLocalExtraBucketSpawnUntilById).forEach(function (id) {
    if (pendingLocalExtraBucketSpawnUntilById[id] <= now) {
      delete pendingLocalExtraBucketSpawnUntilById[id];
    }
  });
}

function applyWorldExtraBucketsFromSharedSnapshot(raw) {
  const parsed = parseWorldExtraBucketsFromSnapshot(raw);
  if (!parsed) return;
  prunePendingLocalExtraBucketDrops();
  const mergedById = Object.create(null);
  parsed.forEach(function (entry) {
    if (!entry || !entry.id) return;
    mergedById[String(entry.id)] = entry;
  });
  if (isHoldingExtraBucket()) {
    delete mergedById[String(heldBucketId || "")];
  }
  (Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : []).forEach(
    function (entry) {
      if (!entry || !entry.id) return;
      const id = String(entry.id);
      if (isHoldingExtraBucket() && id === String(heldBucketId || "")) return;
      if (mergedById[id]) return;
      if (Number(pendingLocalExtraBucketDropUntilById[id] || 0) > Date.now()) {
        mergedById[id] = {
          id: id,
          x: Number(entry.x) || 0,
          y: Number(entry.y) || 0,
          isFull: Boolean(entry.isFull)
        };
        return;
      }
      if (Number(pendingLocalExtraBucketSpawnUntilById[id] || 0) > Date.now()) {
        mergedById[id] = {
          id: id,
          x: Number(entry.x) || 0,
          y: Number(entry.y) || 0,
          isFull: Boolean(entry.isFull)
        };
      }
    }
  );
  appleState.worldExtraBuckets = Object.keys(mergedById).map(function (id) {
    return mergedById[id];
  });
}

/** ???? ????: ?? ????????? ????????? ???????? ????? ????? */
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
  el.src = IMG_BUCKET_EMPTY;
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
  notePendingLocalExtraBucketSpawn(entry.id);
  updateWorldExtraBuckets();
  markWorldDirty();
  holdLocalAppleStateAgainstStaleSnapshot(3000);
  saveAppleState();
  syncWorldState(true);
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
  placedCraftFurniture = parsePlacedCraftFurnitureFromSnapshot(loaded.placedCraftFurniture);
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
        worldExtraBuckets: appleState.worldExtraBuckets,
        placedCraftFurniture: serializePlacedCraftFurnitureForSnapshot(placedCraftFurniture)
      });
    }
  }

  syncMainSeedPickedStateFromLoadedExtraSeeds();

  if (loaded.parseFailed) {
    clearExtraSeedAndPlantElements();
  }

  rebuildWorldRockDom();
  rebuildPlacedCraftFurnitureDom();
  rebuildWorldExtraBucketDom();
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
    }),
    placedCraftFurniture: serializePlacedCraftFurnitureForSnapshot(placedCraftFurniture)
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
    heldBucketId = "";
    heldExtraBucketMainX = 0;
    heldExtraBucketMainY = 0;
    heldExtraBucketMainIsFull = false;
    mainBucketParkedX = 0;
    mainBucketParkedY = 0;
    mainBucketParkedIsFull = false;
    window.OVC_SHARED_BUCKET_HELD_BY = "";
  } catch (error) {
    removeStoredValue(bucketStateKey);
  }
}

function saveBucketState() {
  const mainBucket = getMainBucketGroundState();
  setStoredValue(
    bucketStateKey,
    JSON.stringify({
      isBucketFull: mainBucket.isFull,
      bucketX: mainBucket.x,
      bucketY: mainBucket.y,
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

/** ??? ??????????? ??? ??? ??? ????? lastRefillAt ?????????????????????? ???????? ???? ????? */
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

  plant.status = "normal";
  plant.needsFirstWater = false;
  plant.blockSproutRegrowthAfterDry = false;
  plant.drySoilAt = null;
  plant.waterLevel = ageAtSnapshot < tickMs ? 1 : 0;
  plant.waterLevelUpdatedAt = plant.waterLevel > 0 ? Math.max(1, now - ageAtSnapshot) : now;
  plant.becameEmptyAt =
    plant.waterLevel > 0 ? null : Math.max(1, now - Math.max(0, ageAtSnapshot - tickMs));
}

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

function snapWellRefillToGrid(nowMs) {
  const t = Number(nowMs);
  if (!Number.isFinite(t) || t <= 0) {
    return Math.floor(Date.now() / wellRefillMs) * wellRefillMs;
  }
  return Math.floor(t / wellRefillMs) * wellRefillMs;
}

/**
 * ???? ????? ???????: ????????????????? ??????????? ??????? ???????
 * ???????????/??? ??? ?????????? ????? ???? ??(???????????????? ?????????????).
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

function getSharedWorldSnapshot() {
  flushPassiveSimulationBeforeSharedSnapshot();
  const bucketHeldBy = isHoldingMainBucket() ? currentSessionId : window.OVC_SHARED_BUCKET_HELD_BY || "";
  const mainBucketSnapshot = getMainBucketGroundState();
  const snapshotBucketX = mainBucketSnapshot.x;
  const snapshotBucketY = mainBucketSnapshot.y;
  const snapshotBucketIsFull = mainBucketSnapshot.isFull;
  const plantIndexBonus = Math.max(0, Math.floor(Number(adminDebugPlantIndexBonus) || 0));
  return {
    /** ???? ??? ?????????????? ???? ??????????????? `rebasePlantModelTimestampsToLocalNow`??refTime???? ???? */
    savedAt: getSharedPlantSimulationNow(),
    savedBy: currentSessionId,
    resetToken: pendingWorldResetToken || lastAppliedWorldResetToken || "",
    plantIndexBonus,
    bucket: {
      x: snapshotBucketX,
      y: snapshotBucketY,
      isFull: snapshotBucketIsFull,
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
      // ?????(?????????): ????????? worldLooseSeed 1?????????. ???? ?????(stub)??extraSeeds.
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
          matureKind: plant.matureKind != null ? String(plant.matureKind) : "",
          flowerOrdinal:
            plant.flowerOrdinal != null && Number.isFinite(Number(plant.flowerOrdinal))
              ? plant.flowerOrdinal
              : null,
          treeOrdinal:
            plant.treeOrdinal != null && Number.isFinite(Number(plant.treeOrdinal))
              ? plant.treeOrdinal
              : null,
          cactusOrdinal:
            plant.cactusOrdinal != null && Number.isFinite(Number(plant.cactusOrdinal))
              ? plant.cactusOrdinal
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
        : undefined,
      placedCraftFurniture: isWorldDocumentEntry()
        ? serializePlacedCraftFurnitureForSnapshot(placedCraftFurniture)
        : undefined,
      worldExtraBuckets: isWorldDocumentEntry()
        ? serializeWorldExtraBucketsForSnapshot(appleState.worldExtraBuckets)
        : undefined,
      worldBagDrops: serializeWorldBagDropsForSnapshot()
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
  updateBagInventorySlots();
  updateMagicPowderInventoryUi();
  rebuildWorldRockDom();
  rebuildPlacedCraftFurnitureDom();
  rebuildWorldExtraBucketDom();
  rebuildWorldBagDropDom();
  updatePlantProgressGauge();
  updateNpcPosition();
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

/** Monotonic merge of shared admin plant-index bonus (never decreases). */
function ingestSharedPlantIndexBonus(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  if (!Object.prototype.hasOwnProperty.call(snapshot, "plantIndexBonus")) return false;
  const incoming = Math.max(0, Math.floor(Number(snapshot.plantIndexBonus) || 0));
  const prev = Math.max(0, Math.floor(Number(adminDebugPlantIndexBonus) || 0));
  if (incoming <= prev) return false;
  adminDebugPlantIndexBonus = incoming;
  return true;
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
  const plantBonusChanged = ingestSharedPlantIndexBonus(snapshot);
  if (snapshot.savedBy === currentSessionId) {
    if (plantBonusChanged) updatePlantProgressGauge();
    return;
  }
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
  // Local dev reset just pushed a new token; server may still return the pre-reset snapshot.
  if (
    isResetGuardWindow &&
    lastAppliedWorldResetToken &&
    snapshotResetToken !== lastAppliedWorldResetToken
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
    // ???? ??? ??? ??????? ?? + ????????????????????????????)
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
      if (isHoldingMainBucket()) {
        // While local player is carrying the bucket, keep local ownership/state authoritative.
        window.OVC_SHARED_BUCKET_HELD_BY = currentSessionId;
      } else if (isHoldingExtraBucket()) {
        window.OVC_SHARED_BUCKET_HELD_BY = heldBy === currentSessionId ? "" : heldBy;
        if (!heldBy) {
          applyRemoteSharedMainBucketGround(
            nextBucketX,
            nextBucketY,
            snapshot.bucket.isFull
          );
        }
      } else {
        window.OVC_SHARED_BUCKET_HELD_BY = heldBy;
        if (heldBy !== currentSessionId) {
          applyRemoteSharedMainBucketGround(
            nextBucketX,
            nextBucketY,
            snapshot.bucket.isFull
          );
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
/** ?????????? ????????????? ???? ???????? ??? ??appStorageKeysSharedWorldReset???? ?????????????? ?????. local??????? */
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
            powderUpgradeDurationMs: plantRuntime.powderUpgradeDurationMs,
            matureKind: plantRuntime.matureKind || ""
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
          syncWorldLoosePickupLock(syncedNow);
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
        if (!shouldDeferRemoteAppleApply) {
          const snapFurniture = snapApples.placedCraftFurniture;
          if (Array.isArray(snapFurniture)) {
            placedCraftFurniture = parsePlacedCraftFurnitureFromSnapshot(snapFurniture);
            rebuildPlacedCraftFurnitureDom();
          }
        }
        if (!shouldDeferRemoteAppleApply && Array.isArray(snapApples.worldExtraBuckets)) {
          applyWorldExtraBucketsFromSharedSnapshot(snapApples.worldExtraBuckets);
        }
        if (!shouldDeferRemoteAppleApply && Array.isArray(snapApples.worldBagDrops)) {
          mergeWorldBagDropsFromSnapshot(snapApples.worldBagDrops);
        }
      }
      if (snapshotSavedAt) {
        lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, snapshotSavedAt);
      }
    }

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

/**
 * ???????? ?????: ????????? `rebasePlantModelTimestampsToLocalNow`?sanitize??
 * `getSynchronizedNow()`(???? ????? ??? ??????????? ????????????
 * ????????`Date.now()`????? ??????????????? ?????????????? ?? ???????
 */
function getSharedPlantSimulationNow() {
  return isSharedWorldMergeActive() ? getSynchronizedNow() : Date.now();
}

function syncWorldState(forceSave, options) {
  options = options || {};
  const skipPrefetch = Boolean(options.skipPrefetch);
  const now = Date.now();
  if (isTabSessionSuperseded || isReloadingForWorldReset) return;
  if (isSharedWorldSyncPausedForTutorial()) return;
  if (!forceSave && now < worldSaveConflictBackoffUntil) return;
  if (
    isWorldSyncing ||
    !window.OVCOnline ||
    typeof window.OVCOnline.saveWorldState !== "function"
  ) {
    return;
  }
  if (isWorldPolling) {
    isWorldDirty = true;
    if (forceSave) pendingForceWorldSaveAfterPoll = true;
    return;
  }
  if (!forceSave && !isWorldDirty) return;
  if (!hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
    isWorldDirty = true;
    pollWorldState(true);
    return;
  }
  if (
    forceSave &&
    !skipPrefetch &&
    isWorldServerSyncAvailable() &&
    hasHydratedSharedWorldFromServer
  ) {
    isWorldDirty = true;
    pollWorldState(true);
    pendingForceWorldSaveAfterPoll = true;
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
      worldSaveConflictBackoffUntil = Date.now() + 1200;
      isWorldDirty = true;
      pollWorldState(true);
      return;
    }
    addNetworkDebugLog(
      "world save error: " + (error && error.message ? error.message : "??? ?? ?? ??")
    );
    showThrottledWorldSyncToast(
      "\uC6D4\uB4DC \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
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
      "world reset save error: " + (error && error.message ? error.message : "??? ?? ?? ??")
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
    if (isWorldServerSyncAvailable()) {
      hasHydratedSharedWorldFromServer = true;
    }
    if (!row || !row.state) return;
    try {
      const plantBonusChanged = ingestSharedPlantIndexBonus(row.state);
      if (!row.updated_at || row.updated_at === lastWorldUpdatedAt) {
        if (plantBonusChanged) updatePlantProgressGauge();
        return;
      }
      lastWorldUpdatedAt = row.updated_at;
      applySharedWorldSnapshot(row.state, row.updated_at);
    } catch (applyError) {
      addNetworkDebugLog(
        "world apply error: " +
          (applyError && applyError.message ? applyError.message : String(applyError))
      );
    }
  }).catch(function (error) {
    addNetworkDebugLog(
      "world poll error: " + (error && error.message ? error.message : "unknown")
    );
    // Poll failure still allows local play (finally marks hydrated). Background
    // polls and non-network errors must not show a misleading network toast.
  }).finally(function () {
    isWorldPolling = false;
    if (isWorldServerSyncAvailable()) {
      hasHydratedSharedWorldFromServer = true;
    }
    if (pendingForceWorldSaveAfterPoll) {
      pendingForceWorldSaveAfterPoll = false;
      syncWorldState(true, { skipPrefetch: true });
    }
    ovcTryDismissLoadingScreen(false);
  });
}

function dropHeldItem() {
  if (isOnboardingLinearGateActive()) {
    if (heldItem === HELD_ITEM_BUCKET && onboardingFlowStep !== ONBOARDING_STEP_DROP_BUCKET) {
      flashOnboardingOrderHint("");
      return;
    }
    if (heldItem === HELD_ITEM_SEED && onboardingFlowStep !== 7) {
      flashOnboardingOrderHint("");
      return;
    }
    if (isHeldExtraSeed(heldItem) && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
  const dropX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
  const dropY = playerBox.bottom - bucketSize.height;

  if (isHoldingExtraBucket()) {
    if (!Array.isArray(appleState.worldExtraBuckets)) appleState.worldExtraBuckets = [];
    const extraId = String(heldBucketId || "");
    const droppedExtraId =
      extraId || "world-bucket-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6);
    const resolvedDrop = resolveGroundBucketDropPosition(dropX, dropY, {
      mainX: heldExtraBucketMainX,
      mainY: heldExtraBucketMainY
    });
    appleState.worldExtraBuckets.push({
      id: droppedExtraId,
      x: resolvedDrop.x,
      y: resolvedDrop.y,
      isFull: Boolean(isBucketFull)
    });
    notePendingLocalExtraBucketDrop(droppedExtraId);
    bucketX = Number.isFinite(heldExtraBucketMainX) ? heldExtraBucketMainX : bucketX;
    bucketY = Number.isFinite(heldExtraBucketMainY) ? heldExtraBucketMainY : bucketY;
    heldItem = null;
    heldBucketId = "";
    heldExtraBucketMainX = 0;
    heldExtraBucketMainY = 0;
    isBucketFull = Boolean(heldExtraBucketMainIsFull);
    heldExtraBucketMainIsFull = false;
    mainBucketParkedX = 0;
    mainBucketParkedY = 0;
    mainBucketParkedIsFull = false;
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    broadcastBucketState(true);
    rebuildWorldExtraBucketDom();
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
    saveBucketState();
    markWorldDirty();
    syncWorldState(true);
    onboardingHookDroppedBucketForTutorial();
    return;
  }

  const resolvedMainDrop = resolveGroundBucketDropPosition(dropX, dropY, { skipMain: true });
  bucketX = resolvedMainDrop.x;
  bucketY = resolvedMainDrop.y;
  heldItem = null;
  heldBucketId = "";
  heldExtraBucketMainX = 0;
  heldExtraBucketMainY = 0;
  heldExtraBucketMainIsFull = false;
  mainBucketParkedX = 0;
  mainBucketParkedY = 0;
  mainBucketParkedIsFull = false;
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
  tickTutorialMainSeedRespawnDue();
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
  // ????? ????? ??????: ????????? worldLooseSeed ?????? ?????????#seed??????(????? ?????????????).
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
  seed.src = plantRuntime.isSeedDry ? IMG_SEED_DRY : IMG_SEED;

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
 * ???????????(WORLD_LOOSE_SEED_* = SEED_START)????? extraSeeds ??????????????? ????.
 * ????? #seed?????? ????? img?? legacy ???????????????????? ???.
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
  const now = getSharedPlantSimulationNow();
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
    syncWorldLoosePickupLock();
    if (!worldLooseSeedElement) {
      worldLooseSeedElement = document.createElement("img");
      worldLooseSeedElement.className = "extra-seed world-loose-seed";
      worldLooseSeedElement.alt = "world loose seed";
      worldLooseSeedElement.src = IMG_SEED;
      setWorldSize(worldLooseSeedElement, SEED_SIZE, SEED_SIZE);
      ground.appendChild(worldLooseSeedElement);
    }
    const vis = isWorldLooseSeedVisibleAt();
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
    extraSeed.element.src = isDry ? IMG_SEED_DRY : IMG_SEED;
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
    const sproutSize = getSproutSizeForStage(stage, plant);
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
    plant.sproutElement.src = getSproutImageForPlant(plant, stage);
    setWorldSize(plant.sproutElement, sproutSize.width, sproutSize.height);
    const sproutPos = getSproutWorldPositionForPlant(plant.x, plant.y, sproutSize, stage, plant);
    setWorldPosition(plant.sproutElement, sproutPos.x, sproutPos.y);
  });
  syncAllPlantDepthStacking();
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

/** ???????????????????? ms?? ????? constants?? ????????(?? ????2?????3???? ??? ?????????duration??????? ????) */
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
  reconcileMaturePlantGrowthTierFromOrdinal(plant);
  syncPlantWaterCapacityField(plant);
  migrateLegacyPowderTier5ToAutoGrass(plant, now);
  ensureGrassOrdinalIfNeeded(plant);
  clampPlantGrowthTimingToCurrentConstants(plant);
  if (shouldFinalizeOvergrowthGroundToStage3(plant, now)) {
    makePlantStableStage3FromOvergrowthSeed(plant, now);
  }
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
    if (!makePlantStableStage3FromOvergrowthSeed(plant, now)) {
      plant.isSproutGrown = true;
      plant.sproutGrownAt = now;
      plant.sproutEvolutionMs = 0;
      plant.sproutEvolutionLastTickAt = now;
      plant.isSproutSelfSustaining = false;
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

function getPlantWaterCapacity(plant) {
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  if (tier >= 4 && isCactusMaturePlant(plant)) return 1;
  if (tier >= 3) return 3;
  return Math.max(2, Number(plant.waterCapacity) || 2);
}

function syncPlantWaterCapacityField(plant) {
  if (!plant) return;
  plant.waterCapacity = getPlantWaterCapacity(plant);
}

function getAutoTier5GrowMsForPlant(plant) {
  return isCactusMaturePlant(plant) ? cactusLevel5GrowMs : level5GrowMs;
}

function isPowderUpgradeInProgress(plant) {
  return (
    Number(plant.powderUpgradeTargetTier) > 0 &&
    Number(plant.powderUpgradeDurationMs) > 0 &&
    Number(plant.powderUpgradeStartedAt) > 0
  );
}

/**
 * ???? ???? ????????? needsFirstWater?? false??? ??Q ??? ??? ???? ?????????????.
 * wateredAtList?? [growthStartedAt] ???????? "?????????"??????.
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
  if (plant.lastWateredAt != null && Number(plant.lastWateredAt) > 0) return false;
  const wl = plant.wateredAtList;
  if (!Array.isArray(wl)) return false;
  /** ???? ???? ??? ???????wateredAtList?? ????? ????. stabilizeFirstWaterHintFlags????? ????????????? */
  if (wl.length === 0) return true;
  if (wl.length !== 1) return false;
  return Math.abs(Number(wl[0]) - gs) < 20000;
}

/** 4?5?????????????UI ??(????????????? ???????) */
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

/** ??? ????????????????? ?????????????? ??????????????? ?????*/
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
    syncPlantWaterCapacityField(plant);
    const cap = getPlantWaterCapacity(plant);
    plant.waterLevel = Math.min(cap, Math.max(1, Number(plant.waterLevel) || 1));
  }
  if (Math.max(0, Number(plant.growthTier) || 0) === 4) {
    plant.grassAuto5EligibleAt = now;
  } else {
    plant.grassAuto5EligibleAt = null;
  }
  return true;
}

/** 4???? ??? ????????? level5GrowMs ?????? 5??(?????? 3???? */
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
  if (now - Number(t0) < getAutoTier5GrowMsForPlant(plant)) return false;
  if ((Number(plant.waterLevel) || 0) <= 0) return false;
  plant.growthTier = 5;
  plant.grassAuto5EligibleAt = null;
  plant.becameEmptyAt = null;
  return true;
}

/** ??????? ???4?? ?????????? ???????5???????? */
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

/** ???4???????????? ????????5??????????????) */
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

/** ??????????????????????)?????????? ?? */
function getPlantVisibleHoverRectsWorld(plant) {
  return getPlantVisibleHoverRectsWorldCore(plant, getPlantHoverGeometryOptions());
}

const PLANT_DEPTH_Z_MIN = 3;
const PLANT_DEPTH_Z_MAX = 14;
let currentPlantHoverTarget = null;
let lastPlantHoverPointerClientX = 0;
let lastPlantHoverPointerClientY = 0;
let hasLastPlantHoverPointer = false;
/** @type {HTMLElement[]} */
let plantOccluderFadeElements = [];

function getPlantHoverGeometryOptions() {
  return {
    shouldHideSoil: shouldHideSeparateSoilUnderBigGrass,
    plantSpotWidth: PLANT_SPOT_WIDTH,
    plantSpotHeight: PLANT_SPOT_HEIGHT,
    getSproutStageFromPlant: getSproutStageFromPlant,
    getSproutSizeForStage: getSproutSizeForStage,
    getSproutWorldPositionForPlant: getSproutWorldPositionForPlant,
    /** 실루엣 겹침 최소 비율 — 인접만 한 식물은 투명 처리 안 함 */
    visualOverlapMinRatio: 0.06,
    /** 뒤 식물 실루엣의 이 비율 이상이 앞에 가려지면 “완전 가림” */
    fullOccludeCoverage: 0.82
  };
}

function getPlantDepthSortY(plant) {
  return getPlantDepthSortYCore(plant, getPlantHoverGeometryOptions());
}

function getPlantDepthZIndex(sortY) {
  return mapPlantDepthSortYToZIndex(
    sortY,
    GROUND_WORLD_HEIGHT,
    PLANT_DEPTH_Z_MIN,
    PLANT_DEPTH_Z_MAX
  );
}

function applyPlantDepthZIndexToElements(plant, spotEl, sproutEl, growthMeterEl) {
  const z = getPlantDepthZIndex(getPlantDepthSortY(plant));
  if (spotEl) spotEl.style.zIndex = String(z);
  if (sproutEl) sproutEl.style.zIndex = String(z + 1);
  if (growthMeterEl) {
    growthMeterEl.style.zIndex = String(z + 2);
  }
}

function syncAllPlantDepthStacking() {
  if (plantRuntime.isSeedPlanted) {
    applyPlantDepthZIndexToElements(
      plantRuntime,
      plantSpot,
      sprout,
      mainPlantGrowthMeter && mainPlantGrowthMeter.element
    );
  }
  appleState.extraPlants.forEach(function (plant) {
    if (!plant || plant.removed) return;
    applyPlantDepthZIndexToElements(
      plant,
      plant.spotElement,
      plant.sproutElement,
      plant.growthMeterElement
    );
  });
}

function clearPlantOccluderFade() {
  for (let i = 0; i < plantOccluderFadeElements.length; i += 1) {
    const el = plantOccluderFadeElements[i];
    if (el && el.isConnected) el.classList.remove("is-plant-occluding-hover");
  }
  plantOccluderFadeElements = [];
}

function setPlantOccluderFadeElements(nextEls) {
  const nextSet = new Set(nextEls);
  for (let i = 0; i < plantOccluderFadeElements.length; i += 1) {
    const el = plantOccluderFadeElements[i];
    if (!nextSet.has(el) && el && el.isConnected) {
      el.classList.remove("is-plant-occluding-hover");
    }
  }
  for (let i = 0; i < nextEls.length; i += 1) {
    const el = nextEls[i];
    if (el && el.isConnected && !el.classList.contains("is-plant-occluding-hover")) {
      el.classList.add("is-plant-occluding-hover");
    }
  }
  plantOccluderFadeElements = nextEls.slice();
}

function listEligiblePlantsForHover() {
  const plants = [];
  if (plantRuntime.isSeedPlanted) plants.push(plantRuntime);
  for (let i = 0; i < appleState.extraPlants.length; i += 1) {
    const plant = appleState.extraPlants[i];
    if (plant && !plant.removed) plants.push(plant);
  }
  return plants;
}

/** 겹침 시 투명 처리: 뒤 식물 호버 → 앞 식물만 / 앞이 완전 가림 → 앞 식물 자신 (호버 UI가 켜진 경우만) */
function refreshPlantOccluderFade() {
  const hoverPlant = currentPlantHoverTarget;
  if (!hoverPlant) {
    clearPlantOccluderFade();
    return;
  }
  const fadePlants = getPlantsToFadeForHoverTargetCore(
    hoverPlant,
    listEligiblePlantsForHover(),
    getPlantHoverGeometryOptions(),
    isPlantEligibleForWorldHover
  );
  if (!fadePlants.length) {
    clearPlantOccluderFade();
    return;
  }
  const fadeEls = [];
  for (let i = 0; i < fadePlants.length; i += 1) {
    const els = getPlantHoverDomElements(fadePlants[i]);
    for (let j = 0; j < els.length; j += 1) {
      if (els[j]) fadeEls.push(els[j]);
    }
  }
  setPlantOccluderFadeElements(fadeEls);
}

function isPlantEligibleForWorldHover(plant) {
  if (!plant || plant.removed) return false;
  if (plant === plantRuntime && !plantRuntime.isSeedPlanted) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return false;
  }
  return true;
}

/** ????????? ???(??????) ??? ????????????? ???? ?????? ???? ??? */
function pickPlantForProximityHover() {
  let best = null;
  let bestDist = Infinity;
  function consider(plant) {
    if (!isPlantEligibleForWorldHover(plant)) return;
    const distance = getPlayerDistanceToPlant(plant);
    if (distance >= plantWaterDistance || distance >= bestDist) return;
    bestDist = distance;
    best = plant;
  }
  if (plantRuntime.isSeedPlanted) consider(plantRuntime);
  for (let i = 0; i < appleState.extraPlants.length; i += 1) {
    consider(appleState.extraPlants[i]);
  }
  return best;
}

const CRAFT_FURNITURE_HOVER_KINDS = ["craftChair", "craftDesk", "craftHouse", "craftFence"];

function getCraftFurnitureHoverRectWorld(entry) {
  const pad = 2;
  return worldRectFromXYWH(
    entry.x - pad,
    entry.y - pad,
    entry.width + pad * 2,
    entry.height + pad * 2
  );
}

function getCraftFurnitureDepthSortY(entry) {
  return Number(entry.y) + Number(entry.height);
}

/** ?????? ?????(??/??/??/????) ????? ?????? ???? */
function pickCraftFurnitureHoverTarget(clientX, clientY) {
  if (!isWorldDocumentEntry()) return null;
  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return null;
  const matches = [];
  placedCraftFurniture.forEach(function (entry) {
    if (!entry || CRAFT_FURNITURE_HOVER_KINDS.indexOf(entry.kind) < 0) return;
    const rect = getCraftFurnitureHoverRectWorld(entry);
    if (!isWorldPointInsideRect(pxy.x, pxy.y, rect)) return;
    const cx = entry.x + entry.width / 2;
    const cy = entry.y + entry.height / 2;
    matches.push({
      entry: entry,
      depthY: getCraftFurnitureDepthSortY(entry),
      d: Math.hypot(pxy.x - cx, pxy.y - cy)
    });
  });
  if (!matches.length) return null;
  matches.sort(function (a, b) {
    if (a.depthY !== b.depthY) return a.depthY - b.depthY;
    return a.d - b.d;
  });
  return matches[0];
}

/** 포인터 아래 식물 우선, 없으면 근접 식물 */
function pickPlantHoverTarget(clientX, clientY) {
  const pointerPlant = pickPlantForHoverFromPointerClient(clientX, clientY);
  if (pointerPlant) return pointerPlant;
  return pickPlantForProximityHover();
}

/** 포인터 아래 식물 — 겹침 시 뒤(가려진) 식물 우선, 완전 가림이면 앞 식물 */
function pickPlantForHoverFromPointerClient(clientX, clientY) {
  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return null;
  const under = collectPlantsUnderWorldPointCore(
    pxy.x,
    pxy.y,
    listEligiblePlantsForHover(),
    getPlantHoverGeometryOptions(),
    isPlantEligibleForWorldHover
  );
  return pickPlantHoverFromUnderPointerCore(under, getPlantHoverGeometryOptions());
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

/** \uACE0\uC815 UI(\uC124\uC815\u00B7\uCC44\uD305\u00B7\uD558\uD2B8\u00B7\uC2AC\uD37C\uC694) \u2014 \uBE0C\uB77C\uC6B0\uC800 title \uB300\uC2E0 #plant-hover-label \uC2A4\uD0C0\uC77C\uB85C \uB2E8\uCD95\uD0A4 \uD45C\uC2DC */
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
    return { anchorEl: settingsButton, text: "\uC124\uC815: Esc" };
  }
  if (!worldSocialUiReady) return null;
  if (worldChatToggleBtn && over(worldChatToggleBtn)) {
    return { anchorEl: worldChatToggleBtn, text: "\uCC44\uD305: C" };
  }
  if (worldHeartBtn && over(worldHeartBtn)) {
    return { anchorEl: worldHeartBtn, text: "\uD558\uD2B8: H" };
  }
  if (worldSadBtn && over(worldSadBtn)) {
    return { anchorEl: worldSadBtn, text: "\uC2AC\uD37C\uC694: Ctrl+S" };
  }
  return null;
}

/** `.world`??transform??????????????? fixed???????? ???????????? ?????????? ??????? ????????UI ???????body??*/
function ensurePlantHoverLabelOnBodyForFixedUi() {
  if (!plantHoverLabel || !ground) return;
  if (plantHoverLabel.parentNode === document.body) return;
  document.body.appendChild(plantHoverLabel);
}

function restorePlantHoverLabelToWorldDom() {
  if (!plantHoverLabel || !ground) return;
  if (plantHoverLabel.parentNode === ground) return;
  ground.appendChild(plantHoverLabel);
}

let worldNpcHoverAnchorEl = null;

function getWorldNpcPromptBubbleEl(npcEl) {
  if (!npcEl) return null;
  if (npcEl === plantMaster) return npcBubble;
  if (npcEl === tradeMaster) return tradeMasterBubble;
  if (npcEl === alchemyMaster) return alchemyMasterBubble;
  return null;
}

function isWorldNpcHoverLabelVisible() {
  return Boolean(
    plantHoverLabel &&
    plantHoverLabel.classList.contains("is-world-npc-name") &&
    plantHoverLabel.style.display !== "none"
  );
}

function isWorldNpcHoverActiveFor(npcEl) {
  return Boolean(npcEl && worldNpcHoverAnchorEl === npcEl && isWorldNpcHoverLabelVisible());
}

function syncWorldNpcHoverLabelPosition(anchorEl) {
  const anchor = anchorEl || worldNpcHoverAnchorEl;
  if (!plantHoverLabel || !anchor || !anchor.isConnected) return;
  if (!plantHoverLabel.classList.contains("is-world-npc-name")) return;
  ensurePlantHoverLabelOnBodyForFixedUi();
  const promptBubble = getWorldNpcPromptBubbleEl(anchor);
  const stackOnPromptBubble =
    promptBubble &&
    promptBubble.style.display !== "none" &&
    isWorldNpcHoverActiveFor(anchor);
  const rect = anchor.getBoundingClientRect();
  void plantHoverLabel.offsetWidth;
  const w = plantHoverLabel.offsetWidth || 1;
  const h = plantHoverLabel.offsetHeight || 1;
  const gap = stackOnPromptBubble ? WORLD_NPC_HOVER_NAME_GAP_ABOVE_BUBBLE_PX : 6;
  let anchorTop = rect.top;
  if (stackOnPromptBubble) {
    const bubbleRect = promptBubble.getBoundingClientRect();
    if (bubbleRect.height > 0) anchorTop = bubbleRect.top;
  }
  let left = Math.round(rect.left + rect.width / 2 - w / 2);
  let top = Math.round(anchorTop - h - gap);
  left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
  top = Math.max(8, top);
  plantHoverLabel.style.left = left + "px";
  plantHoverLabel.style.top = top + "px";
  plantHoverLabel.style.right = "";
  plantHoverLabel.style.bottom = "";
}

function showWorldNpcHoverLabel(text, anchorEl) {
  if (!plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  worldNpcHoverAnchorEl = anchorEl;
  ensurePlantHoverLabelOnBodyForFixedUi();
  plantHoverLabel.classList.remove(
    "is-seed-inventory-hint",
    "is-stage3-complete",
    "is-well-dock",
    "is-ui-shortcut-hint",
    "is-plant-world-sign",
    "is-dry",
    "is-overwatered"
  );
  plantHoverLabel.classList.add("is-world-npc-name");
  if (plantHoverLabel.textContent !== text) {
    plantHoverLabel.textContent = text;
  }
  plantHoverLabel.style.display = "block";
  plantHoverLabel.style.position = "fixed";
  plantHoverLabel.style.zIndex = "225";
  plantHoverLabel.style.transform = "none";
  plantHoverLabel.style.height = "";
  plantHoverLabel.style.width = "";
  plantHoverLabel.style.minWidth = "";
  plantHoverLabel.style.right = "";
  syncWorldNpcHoverLabelPosition(anchorEl);
}

function showUiShortcutHoverLabel(text, anchorEl) {
  if (!plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  ensurePlantHoverLabelOnBodyForFixedUi();
  plantHoverLabel.classList.remove(
    "is-seed-inventory-hint",
    "is-stage3-complete",
    "is-well-dock",
    "is-world-npc-name",
    "is-plant-world-sign",
    "is-dry",
    "is-overwatered"
  );
  plantHoverLabel.classList.add("is-ui-shortcut-hint");
  plantHoverLabel.textContent = text;
  plantHoverLabel.style.display = "block";
  plantHoverLabel.style.position = "fixed";
  plantHoverLabel.style.zIndex = "220";
  plantHoverLabel.style.transform = "none";
  plantHoverLabel.style.height = "";
  plantHoverLabel.style.width = "";
  plantHoverLabel.style.minWidth = "";
  plantHoverLabel.style.right = "";
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

function refreshPlantHoverAfterPlayerMove() {
  if (!plantHoverLabel) return;
  if (hasLastPlantHoverPointer) {
    syncPlantHoverFromPointerClient(
      lastPlantHoverPointerClientX,
      lastPlantHoverPointerClientY
    );
    return;
  }
  const plant = pickPlantForProximityHover();
  if (plant) {
    if (plant !== currentPlantHoverTarget) showPlantHoverSignForPlant(plant);
  } else if (currentPlantHoverTarget) {
    hidePlantHoverLabel();
  }
}

function syncPlantHoverFromPointerClient(clientX, clientY) {
  if (!plantHoverLabel) return;
  lastPlantHoverPointerClientX = clientX;
  lastPlantHoverPointerClientY = clientY;
  hasLastPlantHoverPointer = true;

  const uiShortcut = pickUiShortcutHoverTarget(clientX, clientY);
  if (uiShortcut) {
    if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
    showUiShortcutHoverLabel(uiShortcut.text, uiShortcut.anchorEl);
    return;
  }

  const npcHover = pickWorldNpcHover(clientX, clientY);
  if (npcHover) {
    if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
    showWorldNpcHoverLabel(npcHover.name, npcHover.anchorEl);
    return;
  }

  const craftFurnitureHover = pickCraftFurnitureHoverTarget(clientX, clientY);
  if (craftFurnitureHover && craftFurnitureHover.entry) {
    const craftEntry = craftFurnitureHover.entry;
    const craftAnchor = craftEntry._el;
    const craftLabel = getCraftFurnitureWorldLabel(craftEntry);
    if (craftAnchor && craftAnchor.isConnected && craftLabel) {
      if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
      currentPlantHoverTarget = null;
      clearPlantHoverVisuals();
      showWorldNpcHoverLabel(craftLabel, craftAnchor);
      return;
    }
  }

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
        worldNpcHoverAnchorEl = null;
        clearWorldNpcHoverSticky();
        plantHoverLabel.classList.remove("is-seed-inventory-hint");
        plantHoverLabel.style.display = "none";
        restorePlantHoverLabelToWorldDom();
      }
      return;
    }
  }

  if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");

  const plant = pickPlantHoverTarget(clientX, clientY);
  if (plant) {
    if (plant !== currentPlantHoverTarget) {
      showPlantHoverSignForPlant(plant);
    } else {
      refreshPlantOccluderFade();
    }
  } else hidePlantHoverLabel();
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
    syncPlantWaterCapacityField(plant);
    plant.waterLevel = Math.min(
      getPlantWaterCapacity(plant),
      Math.max(Number(plant.waterLevel) || 0, 2)
    );
    plant.becameEmptyAt = null;
    plant.status = "normal";
  }
}

function getSproutImageForPlant(plant, stage) {
  if (stage >= 5) {
    if (isFlowerMaturePlant(plant)) return flowerStage5Image;
    if (isTreeMaturePlant(plant)) return treeStage5Image;
    if (isCactusMaturePlant(plant)) return cactusStage5Image;
    return sproutStage5Image;
  }
  if (stage >= 4) {
    if (isFlowerMaturePlant(plant)) return flowerStage4Image;
    if (isTreeMaturePlant(plant)) return treeStage4Image;
    if (isCactusMaturePlant(plant)) return cactusStage4Image;
    return sproutStage4Image;
  }
  if (stage >= 3) return sproutStage3Image;
  if (stage === 2) return sproutStage2Image;
  return sproutStage1Image;
}

function getSproutSizeForStage(stage, plant) {
  const matureAnchor =
    plant && stage >= 4 ? getMatureSpriteAnchor(normalizePlantMatureKind(plant.matureKind), stage) : null;
  const idx = Math.min(2, Math.max(0, Math.min(stage, 3) - 1));
  const growthScale = matureAnchor
    ? matureAnchor.scale
    : stage >= 5
      ? grassStage5WorldScale
      : stage >= 4
        ? grassStage4WorldScale
        : 1;
  const baseWidth = SPROUT_STAGE_WIDTHS[idx] || SPROUT_WIDTH;
  const baseHeight = SPROUT_STAGE_HEIGHTS[idx] || SPROUT_HEIGHT;
  if (matureAnchor) {
    const height = Math.max(1, Math.round(baseHeight * growthScale));
    const width = Math.max(1, Math.round(height * (matureAnchor.srcW / matureAnchor.srcH)));
    return { width: width, height: height };
  }
  return {
    width: Math.max(1, Math.round(baseWidth * growthScale)),
    height: Math.max(1, Math.round(baseHeight * growthScale))
  };
}

/** 4?5???? ?? PNG?????? ?????? spot)???? ????spot ??????? ?????. */
function shouldHideSeparateSoilUnderBigGrass(plant) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) return false;
  return getSproutStageFromPlant(plant) >= 4;
}

/**
 * ?????????????????? ???????plant spot ??????????? ???.
 * 4?5???? PNG bbox ???(MATURE_SPRITE_ANCHORS)?????.
 */
function getSproutWorldPositionForPlant(plantBaseX, plantBaseY, sproutSize, stage, plant) {
  const matureAnchor =
    plant && stage >= 4 ? getMatureSpriteAnchor(normalizePlantMatureKind(plant.matureKind), stage) : null;
  if (matureAnchor) {
    const spotCenterX = plantBaseX + PLANT_SPOT_WIDTH / 2;
    const spotFootY = plantBaseY + PLANT_SPOT_HEIGHT;
    return {
      x: spotCenterX - (matureAnchor.centerX / matureAnchor.srcW) * sproutSize.width,
      y: spotFootY - (matureAnchor.footY / matureAnchor.srcH) * sproutSize.height
    };
  }
  let footInset = 7;
  if (stage >= 5) {
    footInset = 24;
  } else if (stage >= 4) {
    footInset = 16;
  }
  return {
    x: plantBaseX + PLANT_SPOT_WIDTH / 2 - sproutSize.width / 2,
    y: plantBaseY - sproutSize.height + footInset
  };
}

/** ?????? ????????????????????? ????????(???????????????) */
function getPlantHoverAnchorWorld(plant) {
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  return {
    cxWorld: px + PLANT_SPOT_WIDTH / 2,
    cyWorld: py + PLANT_SPOT_HEIGHT / 2
  };
}

function getPlantGrowthRatio(plant, now) {
  if (!plant.growthStartedAt || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return null;
  if (plant.isSproutGrown) return 1;
  return Math.min(1, Math.max(0, (now - plant.growthStartedAt) / getPlantFirstGrowthDurationMs(plant)));
}

/** ????? 4?? ???? ?????(????????) ???????? ????? ?????; ????? ???????null */
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
  return Math.min(1, elapsed / getAutoTier5GrowMsForPlant(plant));
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

/** ?????????????????????????????????? ??????? ??????????*/
function hasActiveGreenGrowthProgress(plant, now) {
  const g1 = getPlantGrowthRatio(plant, now);
  if (g1 !== null && g1 < 1) return true;
  const g2 = getPlantSecondGrowthRatio(plant, now);
  if (g2 !== null && g2 < 1) return true;
  return false;
}

function isSproutStage3Or5IdleNoGrowth(plant, now) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const st = getSproutStageFromPlant(plant);
  if (st !== 3 && st !== 5) return false;
  if (hasActiveGreenGrowthProgress(plant, now)) return false;
  if (isPowderUpgradeInProgress(plant)) return false;
  return true;
}

/** ???????????????? 5??????) ??????? 3?????????????????? ???? */
function isFinalMaturePlantNoWaterCare(plant, now) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return false;
  }
  if (getSproutStageFromPlant(plant) !== 5) return false;
  if (!isFlowerMaturePlant(plant) && !isTreeMaturePlant(plant) && !isCactusMaturePlant(plant)) {
    return false;
  }
  const tNow = now != null ? now : getSharedPlantSimulationNow();
  if (hasActiveGreenGrowthProgress(plant, tNow)) return false;
  if (isPowderUpgradeInProgress(plant)) return false;
  return true;
}

/** 3???? ??????4?5????? ????????????? ??? ?????? ????? ?????(UI ??????? ????) */
function shouldSkipPlantHoverVisualEmphasis(plant, now) {
  if (!plant || !plant.isSproutGrown) return false;
  if (plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) return false;
  const tNow = now != null ? now : getSharedPlantSimulationNow();
  if (getSproutStageFromPlant(plant) < 3) return false;
  if (hasActiveGreenGrowthProgress(plant, tNow)) return false;
  if (isPowderUpgradeInProgress(plant)) return false;
  return true;
}

function shouldPauseWaterDecayForPlant(plant, now) {
  return isSproutStage3Or5IdleNoGrowth(plant, now);
}

const stage3CompleteMagicHint = "\uC131\uC7A5 \uC644\uB8CC, \uB354 \uD0A4\uC6B0\uB824\uBA74 \uB9C8\uBC95\uC758 \uAC00\uB8E8 \uD544\uC694.";

function isStage3CompleteAwaitingMagicPowder(plant) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return false;
  }
  if (isPowderUpgradeInProgress(plant)) return false;
  return getSproutStageFromPlant(plant) === 3 && getNextPowderTargetTier(plant) > 0;
}

function syncPlantCardWaterReadoutVisibility(showWater) {
  if (!plantWaterText || !plantWaterBar) return;
  const shouldShowWater = showWater !== false;
  plantWaterText.style.display = "";
  plantWaterText.classList.toggle("is-plant-card-hint", !shouldShowWater);
  plantWaterBar.style.display = shouldShowWater ? "grid" : "none";
}

function appendPlantHoverWaterDetail(parentEl, plant) {
  if (!parentEl || !plant) return;
  const detailEl = document.createElement("div");
  detailEl.className = "plant-world-sign-water";
  const badTitle = getPlantSoilBadStateTitle(plant);
  if (badTitle) {
    detailEl.textContent = badTitle;
    parentEl.appendChild(detailEl);
    return;
  }
  if (isFinalMaturePlantNoWaterCare(plant)) {
    return;
  }
  if (isStage3CompleteAwaitingMagicPowder(plant)) {
    detailEl.classList.add("is-magic-hint");
    detailEl.textContent = stage3CompleteMagicHint;
    parentEl.appendChild(detailEl);
    return;
  }
  const waterCapacity = getPlantWaterCapacity(plant);
  const waterLevel = Number(plant.waterLevel) || 0;
  const textEl = document.createElement("div");
  textEl.className = "plant-world-sign-water-text";
  textEl.textContent = "\uC218\uBD84\uD83D\uDCA7: " + waterLevel + "/" + waterCapacity;
  detailEl.appendChild(textEl);
  const barEl = document.createElement("div");
  barEl.className = "plant-world-sign-water-bar";
  for (let i = 0; i < waterCapacity; i += 1) {
    const segment = document.createElement("div");
    segment.className = "plant-water-segment";
    if (i < waterLevel) segment.classList.add("is-filled");
    barEl.appendChild(segment);
  }
  detailEl.appendChild(barEl);
  parentEl.appendChild(detailEl);
}

function syncPlantHoverWellDockLayout() {
  if (!plantHoverLabel || !wellCard) return;
  if (!plantHoverLabel.classList.contains("is-well-dock")) return;
  if (window.getComputedStyle(wellCard).display === "none") {
    plantHoverLabel.style.top = "";
    plantHoverLabel.style.height = "";
    return;
  }
  const rect = wellCard.getBoundingClientRect();
  plantHoverLabel.style.top = Math.round(rect.top) + "px";
  plantHoverLabel.style.height = Math.round(rect.height) + "px";
}

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
  if (shouldSkipPlantWaterDecayNow(now)) return;
  plant.waterLevel = Math.max(0, Number(plant.waterLevel) || 0);
  if (plant.waterLevel <= 0) {
    return;
  }
  let updatedAt = Number(plant.waterLevelUpdatedAt);
/** ????? 4?? ???? ?????(????????) ???????? ????? ?????; ????? ???????null */
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
  if (plant.status === "rotten" || plant.isOverwatered) return IMG_SOIL_ROTTEN;
  if (plant.status === "wet") return IMG_SOIL_WET;
  if (plant.status === "dry") return IMG_SOIL_DRY;
  return IMG_TILLED_SOIL;
}

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

function getBagInventoryCountsByKey() {
  return {
    book: hasGuideBookItemInBagCounts() ? 1 : 0,
    seed: getBagInventorySeedCount(),
    overgrowthSeed: Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0)),
    apple: Math.max(0, Number(appleState.count) || 0),
    rock: Math.max(0, Math.floor(Number(rockInventoryCount) || 0)),
    magicPowder: Math.max(0, Math.floor(magicPowderCount) || 0),
    magicPowderYellow: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.yellow) || 0)),
    magicPowderWhite: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.white) || 0)),
    magicPowderBrown: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.brown) || 0)),
    craftDesk: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftDesk) || 0)),
    craftFence: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftFence) || 0)),
    craftChair: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftChair) || 0)),
    craftHouse: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftHouse) || 0)),
    "butterfly:brown": Math.max(0, Number(butterflyState.caughtCounts.brown) || 0),
    "butterfly:yellow": Math.max(0, Number(butterflyState.caughtCounts.yellow) || 0),
    "butterfly:white": Math.max(0, Number(butterflyState.caughtCounts.white) || 0)
  };
}

function removeOneBagItemForTrade(itemKey) {
  itemKey = normalizeBagItemKey(itemKey);
  const counts = getBagInventoryCountsByKey();
  if (Number(counts[itemKey] || 0) <= 0) return false;
  if (itemKey === "rock") {
    if (rockInventoryCount <= 0) return false;
    rockInventoryCount = Math.max(0, Math.floor(Number(rockInventoryCount) || 0) - 1);
    updateBagInventorySlots();
    saveRockInventoryCount();
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
  if (itemKey === "magicPowderYellow") {
    if ((Number(coloredMagicPowderCounts.yellow) || 0) <= 0) return false;
    coloredMagicPowderCounts.yellow = Math.max(0, coloredMagicPowderCounts.yellow - 1);
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return true;
  }
  if (itemKey === "magicPowderWhite") {
    if ((Number(coloredMagicPowderCounts.white) || 0) <= 0) return false;
    coloredMagicPowderCounts.white = Math.max(0, coloredMagicPowderCounts.white - 1);
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return true;
  }
  if (itemKey === "magicPowderBrown") {
    if ((Number(coloredMagicPowderCounts.brown) || 0) <= 0) return false;
    coloredMagicPowderCounts.brown = Math.max(0, coloredMagicPowderCounts.brown - 1);
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return true;
  }
  if (itemKey === "craftDesk" || itemKey === "craftFence" || itemKey === "craftChair" || itemKey === "craftHouse") {
    if ((Number(craftFurnitureCounts[itemKey]) || 0) <= 0) return false;
    craftFurnitureCounts[itemKey] = Math.max(0, craftFurnitureCounts[itemKey] - 1);
    updateBagInventorySlots();
    saveCraftFurnitureCounts();
    return true;
  }
  if (itemKey === "butterfly:brown" || itemKey === "butterfly:yellow" || itemKey === "butterfly:white") {
    const color = itemKey.split(":")[1];
    if ((Number(butterflyState.caughtCounts[color]) || 0) <= 0) return false;
    butterflyState.caughtCounts[color] = Math.max(0, butterflyState.caughtCounts[color] - 1);
    updateBagInventorySlots();
    saveButterflyCaughtCounts();
    return true;
  }
  return false;
}

function canAddBagItemsForTrade(itemsToAdd) {
  const normalized = {};
  Object.keys(itemsToAdd || {}).forEach(function (key) {
    const nk = normalizeBagItemKey(key);
    normalized[nk] =
      (Number(normalized[nk]) || 0) + Math.max(0, Math.floor(Number(itemsToAdd[key]) || 0));
  });
  const counts = getBagInventoryCountsByKey();
  const orderWithoutBook = bagInventoryItemOrder.filter(function (key) {
    return key !== "book";
  });
  return canBagInventoryFitItems(
    orderWithoutBook,
    counts,
    normalized,
    BAG_INVENTORY_SLOT_COUNT
  );
}

function showBagInventoryFullFailMessage() {
  showPlayerAlert({
    message: "\uC778\uBCA4\uD1A0\uB9AC(\uC800\uC7A5\uC18C) \uCE78\uBD80\uC871, \uC81C\uC791 \uC2E4\uD328!",
    durationMs: 2200
  });
}

function addBagItemsForTrade(itemKey, amount) {
  itemKey = normalizeBagItemKey(itemKey);
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  if (n <= 0) return;
  if (itemKey === "rock") {
    rockInventoryCount = Math.max(0, Math.floor(Number(rockInventoryCount) || 0)) + n;
    updateBagInventorySlots();
    saveRockInventoryCount();
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
  if (itemKey === "magicPowderYellow") {
    coloredMagicPowderCounts.yellow =
      Math.max(0, Math.floor(Number(coloredMagicPowderCounts.yellow) || 0)) + n;
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return;
  }
  if (itemKey === "magicPowderWhite") {
    coloredMagicPowderCounts.white =
      Math.max(0, Math.floor(Number(coloredMagicPowderCounts.white) || 0)) + n;
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return;
  }
  if (itemKey === "magicPowderBrown") {
    coloredMagicPowderCounts.brown =
      Math.max(0, Math.floor(Number(coloredMagicPowderCounts.brown) || 0)) + n;
    updateBagInventorySlots();
    saveColoredMagicPowderCounts();
    return;
  }
  if (itemKey === "craftDesk" || itemKey === "craftFence" || itemKey === "craftChair" || itemKey === "craftHouse") {
    craftFurnitureCounts[itemKey] = Math.max(0, Math.floor(Number(craftFurnitureCounts[itemKey]) || 0)) + n;
    updateBagInventorySlots();
    saveCraftFurnitureCounts();
    return;
  }
  if (itemKey === "butterfly:brown" || itemKey === "butterfly:yellow" || itemKey === "butterfly:white") {
    const color = itemKey.split(":")[1];
    butterflyState.caughtCounts[color] =
      Math.max(0, Math.floor(Number(butterflyState.caughtCounts[color]) || 0)) + n;
    updateBagInventorySlots();
    saveButterflyCaughtCounts();
    return;
  }
  if (itemKey === "worldBucket") {
    for (let i = 0; i < n; i++) {
      spawnWorldBucketBelowTradeMaster();
    }
  }
}

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

function updateBookStorageSlot() {
  if (!bagBookStorageSlot) return;
  const hasBook = hasGuideBookItemInBagCounts();
  if (!hasBook) {
    bagBookStorageSlot.dataset.bagType = "empty";
    bagBookStorageSlot.removeAttribute("data-ovc-tip");
    bagBookStorageSlot.removeAttribute("aria-label");
    bagBookStorageSlot.classList.add("bag-inventory-slot--empty");
    bagBookStorageSlot.classList.add("is-empty");
    bagBookStorageSlot.innerHTML = "";
    return;
  }
  const descriptor = getBagItemDescriptorCore("book");
  bagBookStorageSlot.dataset.bagType = descriptor.bagType;
  if (descriptor.label) {
    bagBookStorageSlot.setAttribute("data-ovc-tip", descriptor.label);
    bagBookStorageSlot.setAttribute("aria-label", descriptor.label);
  }
  bagBookStorageSlot.classList.remove("bag-inventory-slot--empty");
  bagBookStorageSlot.classList.remove("is-empty");
  bagBookStorageSlot.innerHTML =
    descriptor.iconHtml + '<span class="bag-slot-count">1</span>';
}

function updateBagInventorySlots() {
  if (!bagInventoryPanel) return;
  updateBookStorageSlot();
  const counts = getBagInventoryCountsByKey();
  const seedCount = Number(counts.seed || 0);
  const looseVisible = usesWorldLooseSeedMode() && isWorldLooseSeedVisibleAt();
  if (usesWorldLooseSeedMode() && seedCount <= 0 && !looseVisible) {
    hasShownFirstSeedFocus = false;
  }
  normalizeBagInventoryOrderByCounts(counts);

  const slots = Array.from(
    bagInventoryPanel.querySelectorAll(".bag-inventory-slots .bag-inventory-slot")
  ).sort(function (a, b) {
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

  if (bagInventoryPanel) {
    bagInventoryPanel.querySelectorAll(".bag-inventory-slots .bag-inventory-slot").forEach(function (slot) {
      const bagType = slot.dataset.bagType;
      if (!isMagicPowderBagType(bagType)) return;
      const count = getMagicPowderBagCount(bagType);
      const powderUsable = count > 0 && isMagicPowderBagTypeUsableNow(bagType);
      slot.classList.toggle("is-magic-powder-usable", powderUsable);
      const baseTip = getBagItemDescriptorCore(bagType).label || "";
      if (powderUsable) {
        slot.setAttribute("data-ovc-tip", baseTip + " \u00B7 \uC0AC\uC6A9 click");
        slot.setAttribute("aria-label", baseTip + " \u00B7 \uC0AC\uC6A9 click");
      } else if (baseTip) {
        slot.setAttribute("data-ovc-tip", baseTip);
        slot.setAttribute("aria-label", baseTip);
      }
    });
  }
}

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
  element.src = IMG_SEED;
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
  spotElement.src = IMG_TILLED_SOIL;
  setWorldSize(spotElement, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
  ground.appendChild(spotElement);

  const sproutElement = document.createElement("img");
  sproutElement.className = "extra-sprout";
  sproutElement.alt = "extra sprout";
  sproutElement.src = IMG_SPROUT;
  setWorldSize(sproutElement, SPROUT_WIDTH, SPROUT_HEIGHT);
  ground.appendChild(sproutElement);

  const waterNeededElement = document.createElement("img");
  waterNeededElement.className = "extra-water-needed";
  waterNeededElement.alt = "water needed";
  waterNeededElement.src = IMG_WATER_NEEDED;
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
  document.querySelectorAll(".extra-seed, .extra-plant-spot, .extra-sprout, .extra-water-needed, .plant-growth-meter").forEach(
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

/** ???? ??????? ??????? ??????????(???/???????????????????? ????????) */
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
  bucket.src = isBucketFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
  playerBucketOverlay.style.backgroundImage =
    'url("' + (isBucketFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY) + '")';
  const isBucketHeldByRemotePlayer = isMainBucketHeldByRemotePlayer();
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
    remotePlayer.element.classList.remove("is-carrying-bucket", "is-carrying-bucket-full");
    const holdsMain = String(window.OVC_SHARED_BUCKET_HELD_BY || "") === remoteId;
    const extraHold = remotePlayerHeldBucketById[remoteId];
    // ?? ???? ?? #bucket ??? ? ??? ??? ? ::after ?? ?? ??
    if (extraHold && !holdsMain) {
      remotePlayer.element.classList.add("is-carrying-bucket");
      if (Boolean(extraHold.isFull)) {
        remotePlayer.element.classList.add("is-carrying-bucket-full");
      }
    }
  });

  if (heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);

    bucketX = handPosition.x;
    bucketY = handPosition.y;
    if (isHoldingMainBucket()) {
      markWorldDirty();
      broadcastBucketState(false);
      bucket.style.display = "none";
    } else if (isHoldingExtraBucket()) {
      const mainGround = getMainBucketGroundState();
      bucket.src = mainGround.isFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
      bucket.style.display = "block";
      setWorldPosition(bucket, mainGround.x, mainGround.y);
      bucket.style.zIndex = String(getGroundBucketZIndex(mainGround.y));
      markWorldDirty();
      broadcastBucketState(false);
    } else if (isBucketHeldByRemotePlayer) {
      syncMainBucketToRemoteHolderHand();
      bucket.src = isBucketFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
      bucket.style.display = "block";
      setWorldPosition(bucket, bucketX, bucketY);
    }
    playerBucketOverlay.style.display = "block";
  } else if (isBucketHeldByRemotePlayer) {
    const bucketSize = getBucketSize();
    if (!syncMainBucketToRemoteHolderHand()) {
      if (!Number.isFinite(bucketX) || !Number.isFinite(bucketY)) {
        bucketX = wellX - bucketSize.width - 8;
        bucketY = wellY + WELL_SIZE - bucketSize.height;
      }
    }
    bucket.src = isBucketFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
    bucket.style.display = "block";
    playerBucketOverlay.style.display = "none";
  } else {
    bucket.style.display = "block";
    playerBucketOverlay.style.display = "none";
    // While idle on ground, periodically publish authoritative world bucket state.
    // This helps recover peers that missed a pickup/drop edge event.
    broadcastBucketState(false);
  }

  if (
    bucket.style.display === "block" &&
    !isHoldingExtraBucket() &&
    (!Number.isFinite(bucketX) || !Number.isFinite(bucketY))
  ) {
    const bucketSize = getBucketSize();
    bucketX = wellX - bucketSize.width - 8;
    bucketY = wellY + WELL_SIZE - bucketSize.height;
  }

  if (bucket.style.display === "block" && !isHoldingExtraBucket()) {
    const mainGround = getMainBucketGroundState();
    bucket.src = mainGround.isFull ? IMG_BUCKET_FULL : IMG_BUCKET_EMPTY;
    setWorldPosition(bucket, mainGround.x, mainGround.y);
    bucket.style.zIndex = String(getGroundBucketZIndex(mainGround.y));
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

/** ?????????????????????? ????????????????????? ?????????????????. ?????????? UI???????. */
function isPlayerGameplayBlockedByNpcDialogue() {
  if (isNpcDialogueRunning) return true;
  if (isTradeExchangeOpen() || isAlchemyCraftOpen()) return false;
  return isTradeMasterDialogueRunning() || isAlchemyMasterDialogueRunning();
}

function updatePlayerPosition() {
  const healthPosePrev = playerHealthPoseInitialized
    ? playerHealthPosePrev
    : { x: playerX, depth: playerDepth, jumpY: jumpY };

  if (isCharacterSelecting || !hasSpawnedCharacter) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
    return;
  }

  if (playerInsideCraftHouseId) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
    return;
  }

  if (playerSittingChairId) {
    const seatedChair = getCraftChairById(playerSittingChairId);
    if (seatedChair) {
      snapPlayerToCraftChair(seatedChair);
    } else {
      standUpFromChair();
    }
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
    return;
  }

  if (!canPlayerMoveByHealth(playerHealth)) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
    return;
  }

  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
    return;
  }

  if (isWorldChatBlockingGameInput()) {
    lastMovementTickMs = performance.now();
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
    updatePlayerColorBodyPosition();
    playerHealthPosePrev = { x: playerX, depth: playerDepth, jumpY: jumpY };
    playerHealthPoseInitialized = true;
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
  let shouldClampToTree = isInTree;

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

  if (shouldClampToTree) {
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

  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  wasPlayerInTree = shouldClampToTree || (isTreeFalling && playerDepth > groundMaxDepth);
  if (
    playerX !== previousPlayerX ||
    playerDepth !== previousPlayerDepth ||
    jumpY !== previousJumpY
  ) {
    refreshPlantHoverAfterPlayerMove();
  }

  const poseNow = { x: playerX, depth: playerDepth, jumpY: jumpY };
  if (
    !isPlayerMovementKeyActive(keys) ||
    isPlayerPoseUnchanged(healthPosePrev, poseNow)
  ) {
    playerHealthPosePrev = poseNow;
  } else {
    playerHealthPosePrev = healthPosePrev;
  }
  playerHealthPoseInitialized = true;
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
  if (playerSittingChairId) {
    return player.offsetHeight || PLAYER_SIT_HEIGHT;
  }
  return player.offsetHeight || PLAYER_HEIGHT;
}

function getPlayerCenterX() {
  return playerX + getLocalPlayerBodyWidth() / 2;
}

function getPlayerFootY() {
  return GROUND_WORLD_HEIGHT - playerDepth + jumpY;
}

function isPlayerHealthGameplayBlocked() {
  return !canPlayerMoveByHealth(playerHealth);
}

function togglePlayerHealthGaugeVisible() {
  playerHealthGaugeVisible = !playerHealthGaugeVisible;
  savePlayerHealthState();
  updatePlayerHealthUi();
}

function getCraftChairById(chairId) {
  const id = String(chairId || "");
  if (!id) return null;
  for (let i = 0; i < placedCraftFurniture.length; i++) {
    const entry = placedCraftFurniture[i];
    if (entry && entry.kind === "craftChair" && String(entry.id) === id) {
      return entry;
    }
  }
  return null;
}

function getCraftHouseById(houseId) {
  const id = String(houseId || "");
  if (!id) return null;
  for (let i = 0; i < placedCraftFurniture.length; i++) {
    const entry = placedCraftFurniture[i];
    if (entry && entry.kind === "craftHouse" && String(entry.id) === id) {
      return entry;
    }
  }
  return null;
}

function getRemotePlayerOccupyingChair(chairId) {
  const id = String(chairId || "");
  if (!id) return null;
  let found = null;
  Object.keys(remotePlayers).forEach(function (remoteId) {
    if (found) return;
    const remotePlayer = remotePlayers[remoteId];
    if (remotePlayer && String(remotePlayer.sittingChairId || "") === id) {
      found = remotePlayer;
    }
  });
  return found;
}

function isCraftChairOccupiedByRemotePlayer(chairId) {
  return Boolean(getRemotePlayerOccupyingChair(chairId));
}

function showCraftChairOccupiedAlert(chair) {
  const occupant = getRemotePlayerOccupyingChair(chair && chair.id);
  const occupantName =
    occupant && occupant.name ? nameForIngameUiDisplay(occupant.name) : "";
  showPlayerAlert({
    message: occupantName
      ? occupantName + "\uB2D8\uC774 \uC549\uC544 \uC788\uC5B4\uC694."
      : "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uAC00 \uC549\uC544 \uC788\uC5B4\uC694.",
    durationMs: 2200
  });
}

function syncRemotePlayerInsideCraftHouseVisual(remotePlayer) {
  if (!remotePlayer || !remotePlayer.element) return;
  const houseId = String(remotePlayer.insideCraftHouseId || "");
  const inside = Boolean(houseId && getCraftHouseById(houseId));
  if (!inside) {
    remotePlayer.insideCraftHouseId = "";
  }
  remotePlayer.element.classList.toggle("is-inside-craft-house", inside);
}

function syncRemotePlayerPoseVisual(remotePlayer, color) {
  if (!remotePlayer || !remotePlayer.bodyElement || !remotePlayer.element) return;
  const seatedChair = getCraftChairById(remotePlayer.sittingChairId);
  const sitting = Boolean(seatedChair);
  if (!seatedChair) {
    remotePlayer.sittingChairId = "";
  }
  remotePlayer.bodyElement.classList.toggle("is-sitting", sitting);
  syncRemotePlayerInsideCraftHouseVisual(remotePlayer);
  setWorldSize(
    remotePlayer.element,
    sitting ? PLAYER_SIT_WIDTH : PLAYER_WIDTH,
    sitting ? PLAYER_SIT_HEIGHT : undefined
  );
  const tintColor = color || remotePlayer.appliedTintColor || "#7dd3fc";
  const sitTintKey = sitting ? "1" : "0";
  if (
    remotePlayer.appliedTintColor !== tintColor ||
    remotePlayer.appliedSitTintKey !== sitTintKey
  ) {
    remotePlayer.bodyElement.src = getTintedPlayerSrc(tintColor, sitting);
    remotePlayer.appliedTintColor = tintColor;
    remotePlayer.appliedSitTintKey = sitTintKey;
  }
}

function resetPlayerChairSitState() {
  playerSittingChairId = "";
  syncLocalPlayerPoseVisual();
}

function standUpFromChair() {
  if (
    !playerSittingChairId &&
    !(player && player.classList.contains("is-sitting"))
  ) {
    return;
  }
  resetPlayerChairSitState();
  sendMultiplayerPresence(true);
}

function snapPlayerToCraftChair(chair) {
  if (!chair) return;
  const pose = getCraftChairSitPose(chair, PLAYER_SIT_WIDTH, PLAYER_SIT_HEIGHT);
  if (!pose) return;
  playerX = pose.playerX;
  playerDepth = GROUND_WORLD_HEIGHT - pose.footY;
  jumpY = 0;
  velocityY = 0;
  isOnGround = true;
  isTreeFalling = false;
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
}

function syncLocalPlayerPoseVisual() {
  if (!player || !localPlayerRoot) return;
  const sitting = Boolean(playerSittingChairId);
  const bodyW = sitting ? PLAYER_SIT_WIDTH : PLAYER_WIDTH;
  const bodyH = sitting ? PLAYER_SIT_HEIGHT : PLAYER_HEIGHT;
  player.classList.toggle("is-sitting", sitting);
  setWorldSize(localPlayerRoot, bodyW, sitting ? bodyH : undefined);
  setWorldSize(playerColorBody, bodyW, bodyH);
  if (hasChosenPlayerColor && selectedPlayerColor) {
    player.src = getTintedPlayerSrc(selectedPlayerColor, sitting);
    player.classList.toggle("needs-outline", needsDarkOutline(selectedPlayerColor));
    player.classList.add("is-colorized");
  } else {
    player.src = sitting ? getTintedPlayerSrc("#ffffff", true) : playerBaseImage.src;
    player.classList.remove("is-colorized");
  }
}

function sitOnCraftChair(chair) {
  if (!chair) return false;
  playerSittingChairId = String(chair.id || "");
  syncLocalPlayerPoseVisual();
  snapPlayerToCraftChair(chair);
  sendMultiplayerPresence(true);
  return true;
}

function tryToggleChairSit() {
  if (!hasSpawnedCharacter || isCharacterSelecting) return false;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return false;
  }
  if (heldItem) return false;

  if (playerSittingChairId) {
    if (isPlayerHealthGameplayBlocked()) return false;
    standUpFromChair();
    savePlayerHealthState();
    return true;
  }

  const chairSearchDistance = PLAYER_CHAIR_INTERACT_DISTANCE + 6;
  const chair = findNearestCraftChair(
    getPlayerCenterX(),
    getPlayerFootY(),
    placedCraftFurniture,
    chairSearchDistance,
    {
      isChairSelectable: function (entry) {
        return !isCraftChairOccupiedByRemotePlayer(entry && entry.id);
      }
    }
  );
  if (!chair) {
    const blockedChair = findNearestCraftChair(
      getPlayerCenterX(),
      getPlayerFootY(),
      placedCraftFurniture,
      chairSearchDistance
    );
    if (blockedChair && isCraftChairOccupiedByRemotePlayer(blockedChair.id)) {
      showCraftChairOccupiedAlert(blockedChair);
      return true;
    }
    return false;
  }
  sitOnCraftChair(chair);
  savePlayerHealthState();
  return true;
}

function isPlayerInsideEnteredCraftHouse() {
  return Boolean(playerInsideCraftHouseId);
}

function syncLocalPlayerInsideCraftHouseVisual() {
  if (!localPlayerRoot) return;
  const inside = isPlayerInsideEnteredCraftHouse();
  localPlayerRoot.classList.toggle("is-inside-craft-house", inside);
  if (player) {
    player.classList.toggle("is-inside-craft-house", inside);
  }
}

function enterCraftHouse(house) {
  if (!house) return;
  playerOutsideCraftHousePose = {
    x: playerX,
    depth: playerDepth,
    jumpY: jumpY
  };
  playerInsideCraftHouseId = String(house.id || "");
  syncLocalPlayerInsideCraftHouseVisual();
  updatePlayerHealthUi();
  sendMultiplayerPresence(true);
}

function exitCraftHouse() {
  if (!playerInsideCraftHouseId) return;
  const pose = playerOutsideCraftHousePose;
  if (pose) {
    playerX = Number(pose.x) || playerX;
    playerDepth = Number(pose.depth) || playerDepth;
    jumpY = Number(pose.jumpY) || 0;
    velocityY = 0;
    isOnGround = true;
  }
  playerInsideCraftHouseId = "";
  playerOutsideCraftHousePose = null;
  syncLocalPlayerInsideCraftHouseVisual();
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updatePlayerHealthUi();
  sendMultiplayerPresence(true);
}

function tryToggleCraftHouseEnter() {
  if (!hasSpawnedCharacter || isCharacterSelecting) return false;

  if (playerInsideCraftHouseId) {
    exitCraftHouse();
    savePlayerHealthState();
    resetInputKeys(keys);
    return true;
  }

  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return false;
  }
  if (heldItem || playerSittingChairId) return false;

  const house = findCraftHousePlayerIsTouching(
    playerX,
    getPlayerFootY(),
    getLocalPlayerBodyWidth(),
    0,
    placedCraftFurniture
  );
  if (!house) return false;

  enterCraftHouse(house);
  savePlayerHealthState();
  resetInputKeys(keys);
  return true;
}

function loadPlayerHealth() {
  const raw = getStoredValue(playerHealthKey);
  if (raw == null || raw === "") {
    playerHealth = PLAYER_MAX_HEALTH;
    playerLastHealthTickAt = 0;
    playerWasDrainingHealth = false;
    playerIdleRechargeSince = 0;
    playerIdleRechargeHealTicks = 0;
    playerHealthDrainDebt = 0;
    playerHealthGaugeVisible = true;
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      playerHealth = clampPlayerHealth(parsed.health);
      const savedAt = Number(parsed.savedAt);
      const lastTickAt = Number(parsed.lastTickAt ?? parsed.lastDrainAt);
      playerLastHealthTickAt = Number.isFinite(lastTickAt) && lastTickAt > 0 ? lastTickAt : 0;
      if (Number.isFinite(savedAt) && savedAt > 0 && playerLastHealthTickAt > savedAt + 600000) {
        playerLastHealthTickAt = 0;
      }
      playerHealthDrainDebt = 0;
      playerHealthGaugeVisible = parsed.gaugeVisible !== false;
      playerInsideCraftHouseId = "";
      playerOutsideCraftHousePose = null;
      resetPlayerChairSitState();
      syncLocalPlayerInsideCraftHouseVisual();
      return;
    }
  } catch (e) {}
  const legacy = clampPlayerHealth(raw);
  playerHealth = legacy;
  playerLastHealthTickAt = 0;
  playerWasDrainingHealth = false;
  playerIdleRechargeSince = 0;
  playerIdleRechargeHealTicks = 0;
  playerHealthDrainDebt = 0;
  playerHealthGaugeVisible = true;
  playerInsideCraftHouseId = "";
  playerOutsideCraftHousePose = null;
  resetPlayerChairSitState();
  syncLocalPlayerInsideCraftHouseVisual();
}

function savePlayerHealthState() {
  setStoredValue(
    playerHealthKey,
    JSON.stringify({
      health: clampPlayerHealth(playerHealth),
      lastTickAt: playerLastHealthTickAt || 0,
      gaugeVisible: Boolean(playerHealthGaugeVisible),
      savedAt: Date.now()
    })
  );
}

function getPlayerHealthTickContext(healthPosePrev) {
  return {
    hasSpawnedCharacter: hasSpawnedCharacter,
    isCharacterSelecting: isCharacterSelecting,
    isTabSessionSuperseded: isTabSessionSuperseded,
    health: playerHealth,
    keys: keys,
    isSittingOnChair: Boolean(playerSittingChairId),
    isInsideEnteredCraftHouse: isPlayerInsideEnteredCraftHouse(),
    isPlanting: Boolean(plantRuntime.isPlanting),
    isEating: Boolean(appleState.isEating),
    isGameplayBlockedByNpcDialogue: isPlayerGameplayBlockedByNpcDialogue(),
    velocityY: velocityY,
    previousPose: healthPosePrev,
    currentPose: { x: playerX, depth: playerDepth, jumpY: jumpY },
    footCenterX: getPlayerCenterX(),
    footY: getPlayerFootY(),
    placedCraftFurniture: placedCraftFurniture
  };
}

function tickPlayerHealth(nowMs) {
  if (!hasSpawnedCharacter || isCharacterSelecting || isTabSessionSuperseded) return;

  const healthBefore = playerHealth;
  const healthPosePrev = playerHealthPoseInitialized
    ? playerHealthPosePrev
    : { x: playerX, depth: playerDepth, jumpY: jumpY };
  const ctx = getPlayerHealthTickContext(healthPosePrev);
  const shouldDrain = shouldDrainPlayerHealth(ctx);
  const result = tickPlayerHealthState(
    {
      health: playerHealth,
      lastTickAt: playerLastHealthTickAt,
      idleRechargeSince: playerIdleRechargeSince,
      idleRechargeHealTicks: playerIdleRechargeHealTicks,
      healthDrainDebt: playerHealthDrainDebt,
      shouldDrain: shouldDrain,
      wasDraining: playerWasDrainingHealth,
      rechargeContext: {
        footCenterX: ctx.footCenterX,
        footY: ctx.footY,
        placedCraftFurniture: ctx.placedCraftFurniture,
        isSittingOnChair: ctx.isSittingOnChair,
        isInsideEnteredCraftHouse: ctx.isInsideEnteredCraftHouse
      }
    },
    nowMs
  );
  playerWasDrainingHealth = shouldDrain;
  playerHealth = result.health;
  playerLastHealthTickAt = result.lastTickAt;
  if (result.idleRechargeSince != null) {
    playerIdleRechargeSince = Number(result.idleRechargeSince) || 0;
  }
  if (result.idleRechargeHealTicks != null) {
    playerIdleRechargeHealTicks = Number(result.idleRechargeHealTicks) || 0;
  }
  if (result.healthDrainDebt != null) {
    playerHealthDrainDebt = Number(result.healthDrainDebt) || 0;
  }
  if (result.changed) {
    savePlayerHealthState();
  }
  if (
    isPlayerHealthDepleted(playerHealth) &&
    !isPlayerHealthDepleted(healthBefore)
  ) {
    cancelTradeOnPlayerHealthDepleted();
  }
}

function updatePlayerHealthUi() {
  if (!playerHealthRoot) return;
  if (
    !hasSpawnedCharacter ||
    !player ||
    player.classList.contains("is-hidden-before-spawn") ||
    isPlayerInsideEnteredCraftHouse()
  ) {
    playerHealthRoot.style.display = "none";
    return;
  }
  playerHealthRoot.style.display = "flex";
  const hp = clampPlayerHealth(playerHealth);
  const pct = Math.max(0, Math.min(100, (hp / PLAYER_MAX_HEALTH) * 100));
  if (playerHealthGaugeFill) {
    playerHealthGaugeFill.style.width = pct + "%";
  }
  if (playerHealthGaugeLabel) {
    playerHealthGaugeLabel.textContent = String(hp);
  }
  if (playerHealthGaugeEl) {
    playerHealthGaugeEl.hidden = !playerHealthGaugeVisible;
    playerHealthGaugeEl.setAttribute("aria-hidden", playerHealthGaugeVisible ? "false" : "true");
  }
  if (playerHealthHeartBtn) {
    playerHealthHeartBtn.classList.toggle("is-active", playerHealthGaugeVisible);
    playerHealthHeartBtn.setAttribute("aria-pressed", playerHealthGaugeVisible ? "true" : "false");
  }
  if (player) {
    player.classList.toggle("is-health-recharging", isPlayerHealthDepleted(hp));
  }
  if (localPlayerRoot) {
    localPlayerRoot.classList.toggle("is-health-recharging", isPlayerHealthDepleted(hp));
  }
  if (
    isPlayerHealthDepleted(hp) &&
    (isTradeExchangeOpen() || isTradeMasterDialogueRunning())
  ) {
    cancelTradeOnPlayerHealthDepleted();
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

  if (isPlayerGameplayBlockedByNpcDialogue()) return;

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
    const plantedAt = getSharedPlantSimulationNow();
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

function startPlantingExtraSeed() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    return;
  }
  if (isPlayerGameplayBlockedByNpcDialogue()) return;
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

  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }

  if (
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isPlayerGameplayBlockedByNpcDialogue() ||
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

    playerStatus.textContent = "";
    updateSeedInventory();
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
    markWorldDirty();
    syncWorldState(true);
  }, plantActionMs);
}

function plantWorldOvergrowthSeedCount() {
  if ((Number(appleState.overgrowthSeedCount) || 0) <= 0) {
    updateSeedInventory();
    return;
  }

  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }

  if (
    plantRuntime.isPlanting ||
    appleState.isEating ||
    isPlayerGameplayBlockedByNpcDialogue() ||
    !isOnGround
  ) {
    updateSeedInventory();
    return;
  }

  const syntheticId = "og-" + Date.now() + "-" + Math.random().toString(16).slice(2);
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
  playerStatus.textContent = "\uACFC\uC131\uC7A5 \uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    plantRuntime.isPlanting = false;
    sendMultiplayerPresence(true);
    plantingInventorySeedId = null;
    appleState.overgrowthSeedCount =
      Math.max(0, Math.floor(Number(appleState.overgrowthSeedCount) || 0) - 1);

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
    if (!isStarter && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
    isPlayerGameplayBlockedByNpcDialogue() ||
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

    playerStatus.textContent = "";
    updateSeedInventory();
    saveAppleState();
  }, plantActionMs);
}

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
    matureKind: "",
    flowerOrdinal: null,
    treeOrdinal: null,
    cactusOrdinal: null,
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

function isOvergrowthSeedPlant(plant) {
  return String(plant && plant.seedKind || "") === "overgrowth";
}

/** ?????? ?????????0?????? ????) ????? ???? ?????????????? ????, ????????? 3?????????? */
function shouldFinalizeOvergrowthGroundToStage3(plant, now) {
  if (!isOvergrowthSeedPlant(plant) || plant.isSproutSelfSustaining) return false;
  if (plant.isSproutGrown) return true;
  const started = plant.growthStartedAt;
  if (started == null || !Number.isFinite(Number(started))) return false;
  return now - Number(started) >= getPlantFirstGrowthDurationMs(plant);
}

function makePlantStableStage3FromOvergrowthSeed(plant, now) {
  if (!isOvergrowthSeedPlant(plant)) return false;
  plant.isSproutGrown = true;
  plant.sproutGrownAt = now;
  plant.sproutEvolutionMs = sproutStage1Ms + sproutStage2GrowMs;
  plant.sproutEvolutionLastTickAt = now;
  plant.isSproutSelfSustaining = true;
  plant.growthTier = Math.max(Number(plant.growthTier) || 0, 3);
  syncPlantWaterCapacityField(plant);
  plant.waterLevel = Math.min(
    getPlantWaterCapacity(plant),
    Math.max(Number(plant.waterLevel) || 0, 2)
  );
  plant.becameEmptyAt = null;
  plant.status = "normal";
  plant.needsFirstWater = false;
  return true;
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

/** ??????? ?? title(???? ????CSS data-ovc-tip???? ???? ????? ???? */
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

/** ????? ????? ???????/???? ?? ?????????????????????????? ???? ????? ????*/
function refreshPlantIdentityOrdinals() {
  function clearOrdinals(plant) {
    if (!plant) return;
    plant.soilOrdinal = 0;
    plant.sproutOrdinal = 0;
    plant.grassOrdinal = null;
    plant.flowerOrdinal = null;
    plant.treeOrdinal = null;
    plant.cactusOrdinal = null;
  }
  clearOrdinals(plantRuntime);
  appleState.extraPlants.forEach(clearOrdinals);

  const groups = Object.create(null);
  function consider(plant) {
    if (!plant) return;
    if (plant === plantRuntime && !plantRuntime.isSeedPlanted) return;
    const k = plantOrdinalGroupKey(plant);
    if (!groups[k]) {
      groups[k] = { soils: [], sprouts: [], grasses: [], flowers: [], trees: [], cactuses: [] };
    }
    const t = plantWorldOrdinalSortTime(plant);
    const entry = { plant: plant, t: t };
    const isBadSoil =
      plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered;
    if (isBadSoil) {
      groups[k].soils.push(entry);
      return;
    }
    if (!isPlantAliveForWorldOrdinal(plant)) return;
    const tier = Math.max(0, Number(plant.growthTier) || 0);
    if (tier >= 4) {
      if (isFlowerMaturePlant(plant)) {
        groups[k].flowers.push(entry);
      } else if (isCactusMaturePlant(plant)) {
        groups[k].cactuses.push(entry);
      } else if (isTreeMaturePlant(plant)) {
        groups[k].trees.push(entry);
      } else {
        groups[k].grasses.push(entry);
      }
    } else if (plant.isSproutGrown) {
      groups[k].sprouts.push(entry);
    } else {
      groups[k].soils.push(entry);
    }
  }
  consider(plantRuntime);
  appleState.extraPlants.forEach(consider);

  Object.keys(groups).forEach(function (k) {
    const g = groups[k];
    g.soils.sort(function (a, b) {
      return a.t - b.t;
    });
    g.sprouts.sort(function (a, b) {
      return a.t - b.t;
    });
    g.grasses.sort(function (a, b) {
      return a.t - b.t;
    });
    g.flowers.sort(function (a, b) {
      return a.t - b.t;
    });
    g.trees.sort(function (a, b) {
      return a.t - b.t;
    });
    g.cactuses.sort(function (a, b) {
      return a.t - b.t;
    });
    g.soils.forEach(function (e, i) {
      e.plant.soilOrdinal = i + 1;
    });
    g.sprouts.forEach(function (e, i) {
      e.plant.sproutOrdinal = i + 1;
    });
    g.grasses.forEach(function (e, i) {
      e.plant.grassOrdinal = i + 1;
    });
    g.flowers.forEach(function (e, i) {
      e.plant.flowerOrdinal = i + 1;
    });
    g.trees.forEach(function (e, i) {
      e.plant.treeOrdinal = i + 1;
    });
    g.cactuses.forEach(function (e, i) {
      e.plant.cactusOrdinal = i + 1;
    });
  });
}

function assignSproutIdentityToNewPlant(plant) {
  const oid = getPlanterOwnerId();
  const oname = getPlanterDisplayName();
  plant.ownerUserId = oid;
  plant.ownerDisplayName = oname;
  plant.soilOrdinal = 0;
  plant.sproutOrdinal = 0;
  plant.grassOrdinal = null;
  plant.matureKind = "";
  plant.flowerOrdinal = null;
  plant.treeOrdinal = null;
  plant.cactusOrdinal = null;
}

function ensureGrassOrdinalIfNeeded(plant) {
  void plant;
}

function getPlantSoilBadStateTitle(plant) {
  if (!plant) return "";
  const soilOrd = Math.max(0, Number(plant.soilOrdinal) || 0);
  const suffix = soilOrd > 0 ? String(soilOrd) : "";
  if (plant.status === "dry") {
    return "\uB9C8\uB978\uB545" + suffix;
  }
  if (plant.status === "rotten" || plant.isOverwatered) {
    return "\uC339\uC740\uB545" + suffix;
  }
  return "";
}

function getPlantWorldLabel(plant) {
  if (!plant) return "";
  if (getPlantSoilBadStateTitle(plant)) return "";
  const name = String(plant.ownerDisplayName || "").trim() || "\uD50C\uB808\uC774\uC5B4";
  const tier = Math.max(0, Number(plant.growthTier) || 0);
  const soilOrd = Math.max(0, Number(plant.soilOrdinal) || 0);
  const sproutOrd = Math.max(0, Number(plant.sproutOrdinal) || 0);
  const grassOrd =
    plant.grassOrdinal != null && Number.isFinite(Number(plant.grassOrdinal))
      ? Math.max(0, Number(plant.grassOrdinal))
      : 0;
  const flowerOrd =
    plant.flowerOrdinal != null && Number.isFinite(Number(plant.flowerOrdinal))
      ? Math.max(0, Number(plant.flowerOrdinal))
      : 0;
  const treeOrd =
    plant.treeOrdinal != null && Number.isFinite(Number(plant.treeOrdinal))
      ? Math.max(0, Number(plant.treeOrdinal))
      : 0;
  const cactusOrd =
    plant.cactusOrdinal != null && Number.isFinite(Number(plant.cactusOrdinal))
      ? Math.max(0, Number(plant.cactusOrdinal))
      : 0;
  if (tier >= 4) {
    if (isFlowerMaturePlant(plant)) {
      return name + "\uC758 \uAF43" + (flowerOrd > 0 ? flowerOrd : "");
    }
    if (isCactusMaturePlant(plant)) {
      return name + "\uC758 \uC120\uC778\uC7A5" + (cactusOrd > 0 ? cactusOrd : "");
    }
    if (isTreeMaturePlant(plant)) {
      return name + "\uC758 \uB098\uBB34" + (treeOrd > 0 ? treeOrd : "");
    }
    return name + "\uC758 \uD480" + (grassOrd > 0 ? grassOrd : "");
  }
  if (plant.isSproutGrown) {
    return name + "\uC758 \uC0C8\uC2F9" + (sproutOrd > 0 ? sproutOrd : "");
  }
  return name + "\uC758 \uB545" + (soilOrd > 0 ? soilOrd : "");
}

function extraPlantFromDomElement(el) {
  for (let i = 0; i < appleState.extraPlants.length; i++) {
    const p = appleState.extraPlants[i];
    if (!p) continue;
    if (p.spotElement === el || p.sproutElement === el) return p;
  }
  return null;
}

function clearPlantHoverRing() {
  if (!plantHoverRing) return;
  plantHoverRing.classList.remove("is-visible", "is-needs-water");
  plantHoverRing.style.display = "none";
}

/** 호버 링 중심·크기용 — 보이는 식물 본체(새싹 우선, 없으면 흙) */
function getPlantPrimaryVisualRectWorld(plant) {
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const sproutVisible =
    plant.isSproutGrown &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered;
  if (sproutVisible) {
    const st = getSproutStageFromPlant(plant);
    const sz = getSproutSizeForStage(st, plant);
    const pos = getSproutWorldPositionForPlant(px, py, sz, st, plant);
    return {
      left: pos.x,
      top: pos.y,
      right: pos.x + sz.width,
      bottom: pos.y + sz.height
    };
  }
  if (shouldHideSeparateSoilUnderBigGrass(plant)) return null;
  return {
    left: px,
    top: py,
    right: px + PLANT_SPOT_WIDTH,
    bottom: py + PLANT_SPOT_HEIGHT
  };
}

function getPlantHoverRingWorldBounds(plant) {
  const rect = getPlantPrimaryVisualRectWorld(plant);
  if (!rect) return null;
  const st = getSproutStageFromPlant(plant);
  const matureAnchor =
    plant && st >= 4 ? getMatureSpriteAnchor(normalizePlantMatureKind(plant.matureKind), st) : null;
  let cx;
  let cy = (rect.top + rect.bottom) / 2;
  if (matureAnchor) {
    cx = getPlantHoverAnchorWorld(plant).cxWorld;
  } else {
    cx = (rect.left + rect.right) / 2;
  }
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  const size = Math.max(w, h) * 1.05;
  return { x: cx - size / 2, y: cy - size / 2, size: size };
}

function layoutPlantHoverRing(plant, urgentWater) {
  if (!plantHoverRing || !plant) return;
  const bounds = getPlantHoverRingWorldBounds(plant);
  if (!bounds || bounds.size <= 0) {
    clearPlantHoverRing();
    return;
  }
  plantHoverRing.classList.add("is-visible");
  plantHoverRing.classList.toggle("is-needs-water", !!urgentWater);
  plantHoverRing.style.display = "block";
  plantHoverRing.style.zIndex = String(getPlantDepthZIndex(getPlantDepthSortY(plant)) + 2);
  setWorldPosition(plantHoverRing, bounds.x, bounds.y);
  setWorldSize(plantHoverRing, bounds.size, bounds.size);
}

function clearPlantHoverVisuals() {
  clearPlantHoverRing();
  clearPlantOccluderFade();
  if (ground) {
    ground
      .querySelectorAll(".is-plant-water-clickable")
      .forEach(function (el) {
        el.classList.remove("is-plant-water-clickable");
        el.style.cursor = "";
      });
  }
}

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
  return getCenterDistance(anchor.x, anchor.y, PLANT_SPOT_WIDTH, PLANT_SPOT_HEIGHT);
}

function isPlayerNearPlantWorld(plant) {
  return getPlayerDistanceToPlant(plant) < plantWaterDistance;
}

/** ????? ????????????????? ??? ??????????? ??????? ??(???????Infinity) */
function getClosestWaterablePlantDistance() {
  let best = Infinity;
  function tryPlant(plant) {
    if (!canWaterPlantByClick(plant)) return;
    const distance = getPlayerDistanceToPlant(plant);
    if (distance < best) best = distance;
  }
  if (plantRuntime.isSeedPlanted) tryPlant(plantRuntime);
  appleState.extraPlants.forEach(tryPlant);
  return best;
}

function tryConsumePlantWaterPourCooldown() {
  const nowMs = Date.now();
  if (nowMs - lastPlantWaterPourAt < PLANT_WATER_POUR_COOLDOWN_MS) return false;
  lastPlantWaterPourAt = nowMs;
  return true;
}

function markSuppressPlantWaterDecayBriefly(simNow) {
  const t = Number(simNow);
  if (!Number.isFinite(t) || t <= 0) return;
  suppressPlantWaterDecayUntilSim = Math.max(suppressPlantWaterDecayUntilSim, t + 120);
}

function shouldSkipPlantWaterDecayNow(simNow) {
  const t = Number(simNow);
  return Number.isFinite(t) && t > 0 && t < suppressPlantWaterDecayUntilSim;
}

function refreshPlantWaterHoverIfShown(plant) {
  if (!plant || !plantHoverLabel) return;
  if (plantHoverLabel.style.display === "none") return;
  showPlantHoverSignForPlant(plant);
}

function canWaterPlantByClick(plant) {
  if (!plant) return false;
  if (plant === plantRuntime && !plantRuntime.isSeedPlanted) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) {
    return false;
  }
  if (shouldSuppressPlantWaterCardForSelfSustaining(plant)) return false;
  return true;
}

function plantToWateringTarget(plant) {
  if (plant === plantRuntime) {
    return { type: "main", plant: plantRuntime };
  }
  return { type: "extra", plant: plant };
}

/** ???? 0?????? ??????????? ?????? ?????? ????? ??? */
function plantShowsUrgentWaterHoverEmphasis(plant, now) {
  if (!canWaterPlantByClick(plant)) return false;
  const tNow = now != null ? now : getSharedPlantSimulationNow();
  if (shouldPauseWaterDecayForPlant(plant, tNow)) return false;
  if ((Number(plant.waterLevel) || 0) !== 0) return false;
  if (!canPlantWiltFromEmptyWater(plant, tNow)) return false;
  const becameEmptyAt = Number(plant.becameEmptyAt);
  if (!Number.isFinite(becameEmptyAt) || becameEmptyAt <= 0) return true;
  const dryMs =
    plant === plantRuntime
      ? getMainDryAfterEmptyMsForPlant(plant, tNow)
      : getExtraDryDelayMs(plant, tNow);
  if (!Number.isFinite(dryMs) || dryMs <= 0) return true;
  const remainingDryMs = dryMs - (tNow - becameEmptyAt);
  return Math.floor(Math.max(0, remainingDryMs) / 60000) === 0;
}

function applyPlantHoverVisuals(plant) {
  clearPlantHoverRing();
  if (ground) {
    ground
      .querySelectorAll(".is-plant-water-clickable")
      .forEach(function (el) {
        el.classList.remove("is-plant-water-clickable");
        el.style.cursor = "";
      });
  }
  if (!plant) return;
  const now = getSharedPlantSimulationNow();
  const skipRing = shouldSkipPlantHoverVisualEmphasis(plant, now);
  const urgentWater =
    !skipRing && plantShowsUrgentWaterHoverEmphasis(plant, now);
  const clickable =
    heldItem === HELD_ITEM_BUCKET &&
    isBucketFull &&
    canWaterPlantByClick(plant) &&
    isPlayerNearPlantWorld(plant);
  if (!skipRing) {
    layoutPlantHoverRing(plant, urgentWater);
  }
  getPlantHoverDomElements(plant).forEach(function (el) {
    if (clickable) {
      el.classList.add("is-plant-water-clickable");
      el.style.cursor = "pointer";
    }
  });
}

function hidePlantHoverLabel() {
  const hadWorldNpcHover = Boolean(
    plantHoverLabel && plantHoverLabel.classList.contains("is-world-npc-name")
  );
  worldNpcHoverAnchorEl = null;
  clearWorldNpcHoverSticky();
  currentPlantHoverTarget = null;
  hasLastPlantHoverPointer = false;
  if (worldBagInventory) worldBagInventory.classList.remove("is-seed-inventory-hover-hint");
  clearPlantHoverVisuals();
  if (plantHoverLabel) {
    plantHoverLabel.classList.remove(
      "is-seed-inventory-hint",
      "is-stage3-complete",
      "is-ui-shortcut-hint",
      "is-world-npc-name",
      "is-well-dock",
      "is-plant-world-sign",
      "is-dry",
      "is-overwatered"
    );
    plantHoverLabel.textContent = "";
    plantHoverLabel.style.position = "";
    plantHoverLabel.style.left = "";
    plantHoverLabel.style.top = "";
    plantHoverLabel.style.height = "";
    plantHoverLabel.style.right = "";
    plantHoverLabel.style.zIndex = "";
    plantHoverLabel.style.transform = "";
    plantHoverLabel.style.display = "none";
    restorePlantHoverLabelToWorldDom();
  }
  if (hadWorldNpcHover) updateNpcPosition();
}

function showPlantHoverSignForPlant(plant) {
  if (!plantHoverLabel || !plant) return;
  if (!isPlantEligibleForWorldHover(plant)) {
    hidePlantHoverLabel();
    return;
  }
  worldNpcHoverAnchorEl = null;
  clearWorldNpcHoverSticky();
  currentPlantHoverTarget = plant;
  if (plantCard && window.getComputedStyle(plantCard).display !== "none") {
    hidePlantHoverLabel();
    return;
  }
  const label = getPlantWorldLabel(plant);
  const badTitle = getPlantSoilBadStateTitle(plant);
  if (!String(label || "").trim() && !badTitle) {
    hidePlantHoverLabel();
    return;
  }

  ensurePlantHoverLabelOnBodyForFixedUi();
  plantHoverLabel.classList.remove(
    "is-ui-shortcut-hint",
    "is-seed-inventory-hint",
    "is-world-npc-name",
    "is-stage3-complete"
  );
  plantHoverLabel.classList.add("is-well-dock", "is-plant-world-sign");
  plantHoverLabel.classList.toggle("is-dry", plant.status === "dry");
  plantHoverLabel.classList.toggle("is-overwatered", Boolean(plant.isOverwatered));
  plantHoverLabel.style.position = "fixed";
  plantHoverLabel.style.left = "auto";
  plantHoverLabel.style.top = "";
  plantHoverLabel.style.right = "";
  plantHoverLabel.style.transform = "none";
  plantHoverLabel.style.zIndex = "11";

  plantHoverLabel.textContent = "";
  if (String(label || "").trim()) {
    const titleEl = document.createElement("div");
    titleEl.className = "plant-world-sign-title";
    titleEl.textContent = label;
    plantHoverLabel.appendChild(titleEl);
  }

  appendPlantHoverWaterDetail(plantHoverLabel, plant);

  plantHoverLabel.style.display = "flex";
  syncPlantHoverWellDockLayout();
  applyPlantHoverVisuals(plant);
  refreshPlantOccluderFade();
}

function performInteractActionCore() {
  const now = Date.now();
  if (heldItem) {
    if (heldItem === HELD_ITEM_BUCKET && now - lastBucketPickupAt < 260) {
      return;
    }
    dropHeldItem();
    return;
  }
  if (pickUpWorldBag()) return;
  if (!hasGuideBook) {
    const bucketPick = getNearestGroundBucketPickInfo();
    const bucketDistance = bucketPick ? bucketPick.distance : Infinity;
    if (tryPickupNearestWorldRock(bucketDistance)) return;
    return;
  }
  if (tryCatchButterfly()) return;
  if (pickApple()) return;
  if (pickUpWorldGuideBookNoHold()) return;
  pickUpNearestItem();
}

function performInteractAction() {
  if (isPlayerInsideEnteredCraftHouse()) return;
  if (isPlayerHealthGameplayBlocked()) return;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) return;
  const now = Date.now();
  if (now - lastPickupToggleAt < 180) return;
  lastPickupToggleAt = now;
  performInteractActionCore();
}

function worldRectFromXYWH(x, y, width, height) {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

function isPointerBlockedForWorldInteract(event) {
  const target = event && event.target;
  if (!target || !(target instanceof Element)) return true;
  if (isTabSessionSuperseded || isCharacterSelecting || !hasSpawnedCharacter) return true;
  if (isPlayerTimedActionBusy() || isWorldChatBlockingGameInput()) return true;
  if (isPlayerGameplayBlockedByNpcDialogue()) return true;
  if (isTradeExchangeOpen() || isAlchemyCraftOpen() || isBagDiscardModalOpen()) return true;
  if (
    target.closest(
      "#bag-inventory-panel, #settings-overlay, #controls-overlay, #admin-overlay, #guide-card, #logout-confirm-overlay, #world-chat-panel, .trade-exchange-panel, .alchemy-craft-panel, #character-select, #guide-book-button"
    )
  ) {
    return true;
  }
  if (bagInventoryPanelOpen && bagInventoryPanel && bagInventoryPanel.contains(target)) {
    return true;
  }
  if (
    (settingsOverlay && settingsOverlay.classList.contains("is-open")) ||
    (controlsOverlay && controlsOverlay.classList.contains("is-open"))
  ) {
    return true;
  }
  return false;
}

function isPointerOnHeldBucket(clientX, clientY) {
  if (heldItem !== HELD_ITEM_BUCKET) return false;
  const pad = 6;
  if (playerBucketOverlay && playerBucketOverlay.style.display !== "none") {
    const r = playerBucketOverlay.getBoundingClientRect();
    if (
      clientX >= r.left - pad &&
      clientX <= r.right + pad &&
      clientY >= r.top - pad &&
      clientY <= r.bottom + pad
    ) {
      return true;
    }
  }
  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return false;
  const bucketSize = getBucketSize();
  return isWorldPointInsideRect(
    pxy.x,
    pxy.y,
    worldRectFromXYWH(bucketX, bucketY, bucketSize.width, bucketSize.height)
  );
}

function getGroundBucketPickInfoAtWorldPoint(wx, wy) {
  const bucketSize = getBucketSize();
  let best = null;
  let bestClickDist = Infinity;

  function consider(x, y, info) {
    if (
      !isWorldPointInsideRect(
        wx,
        wy,
        worldRectFromXYWH(x, y, bucketSize.width, bucketSize.height)
      )
    ) {
      return;
    }
    const cx = x + bucketSize.width / 2;
    const cy = y + bucketSize.height / 2;
    const clickDist = Math.hypot(wx - cx, wy - cy);
    if (clickDist >= bestClickDist) return;
    bestClickDist = clickDist;
    best = info;
  }

  if (isMainBucketOnGroundForPickup()) {
    const main = getMainBucketGroundState();
    consider(main.x, main.y, {
      type: "main",
      distance: getCenterDistance(main.x, main.y, bucketSize.width, bucketSize.height)
    });
  }
  const extras = Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : [];
  extras.forEach(function (entry) {
    if (!entry) return;
    consider(entry.x, entry.y, {
      type: "extra",
      id: String(entry.id),
      distance: getCenterDistance(entry.x, entry.y, bucketSize.width, bucketSize.height)
    });
  });
  return best;
}

function tryCatchButterflyAtWorldPoint(wx, wy) {
  let best = null;
  butterflyState.list.forEach(function (butterfly) {
    const cx =
      typeof butterfly._catchProbeCx === "number" && Number.isFinite(butterfly._catchProbeCx)
        ? butterfly._catchProbeCx
        : butterfly.x;
    const cy =
      typeof butterfly._catchProbeCy === "number" && Number.isFinite(butterfly._catchProbeCy)
        ? butterfly._catchProbeCy
        : butterfly.y;
    const rect = worldRectFromXYWH(
      cx - BUTTERFLY_SIZE / 2,
      cy - BUTTERFLY_SIZE / 2,
      BUTTERFLY_SIZE,
      BUTTERFLY_SIZE
    );
    if (!isWorldPointInsideRect(wx, wy, rect)) return;
    const distance = getButterflyCatchDistanceAtWorldCenter(cx, cy);
    if (distance > butterflyCatchDistance) return;
    if (!best || distance < best.distance) {
      best = { butterfly: butterfly, distance: distance };
    }
  });
  if (!best) return false;
  return tryCatchButterfly();
}

function tryPickWorldBagDropAtWorldPoint(wx, wy) {
  if (!canUseBagInventoryGameplay()) return false;
  ensureWorldBagDropsArray();
  if (!appleState.worldBagDrops.length) return false;
  let hit = null;
  appleState.worldBagDrops.forEach(function (drop) {
    if (!drop) return;
    const rect = worldRectFromXYWH(drop.x, drop.y, BAG_DROP_WORLD_SIZE, BAG_DROP_WORLD_SIZE);
    if (!isWorldPointInsideRect(wx, wy, rect)) return;
    if (!hit || drop.y > hit.y) hit = drop;
  });
  if (!hit) return false;
  const bucketPick = getNearestGroundBucketPickInfo();
  const bucketDistance = bucketPick ? bucketPick.distance : Infinity;
  const info = findNearestWorldBagDropPickup(
    [hit],
    getPlayerCenterX(),
    getPlayerFootY(),
    Math.min(pickupDistance, bucketDistance)
  );
  if (!info) return false;
  const drop = info.drop;
  const itemKey = normalizeBagItemKey(drop.itemKey);
  const count = Math.max(1, Math.floor(Number(drop.count) || 0));
  if (!canAddBagItemsForTrade({ [itemKey]: count })) {
    showBagInventoryFullFailMessage();
    return true;
  }
  const dropId = String(drop.id);
  const idx = appleState.worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return false;
  teardownWorldBagDropDom(appleState.worldBagDrops[idx]);
  appleState.worldBagDrops.splice(idx, 1);
  addBagItemsForTrade(itemKey, count);
  const now = Date.now();
  lastWorldBagDropChangeAt = now;
  lastAppleStateChangeAt = Math.max(lastAppleStateChangeAt, now);
  holdLocalAppleStateAgainstStaleSnapshot(1200);
  updateWorldBagDropDom();
  markWorldDirty();
  broadcastWorldBagDropPickup(dropId);
  syncWorldState(true);
  sendMultiplayerPresence(true);
  return true;
}

function pickWorldInteractTargetAtWorldPoint(wx, wy) {
  const candidates = [];

  function push(kind, depthY, data) {
    candidates.push({ kind: kind, depthY: depthY, data: data || null });
  }

  butterflyState.list.forEach(function (butterfly) {
    const cx =
      typeof butterfly._catchProbeCx === "number" && Number.isFinite(butterfly._catchProbeCx)
        ? butterfly._catchProbeCx
        : butterfly.x;
    const cy =
      typeof butterfly._catchProbeCy === "number" && Number.isFinite(butterfly._catchProbeCy)
        ? butterfly._catchProbeCy
        : butterfly.y;
    const rect = worldRectFromXYWH(
      cx - BUTTERFLY_SIZE / 2,
      cy - BUTTERFLY_SIZE / 2,
      BUTTERFLY_SIZE,
      BUTTERFLY_SIZE
    );
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("butterfly", cy, { id: butterfly.id });
    }
  });

  respawnApplesIfNeeded();
  appleState.apples.forEach(function (apple) {
    if (appleState.pickedIds.includes(apple.id)) return;
    const rect = worldRectFromXYWH(apple.x, apple.y, apple.size, apple.size);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("apple", apple.y, { id: apple.id });
    }
  });

  ensureWorldBagDropsArray();
  appleState.worldBagDrops.forEach(function (drop) {
    if (!drop) return;
    const rect = worldRectFromXYWH(drop.x, drop.y, BAG_DROP_WORLD_SIZE, BAG_DROP_WORLD_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("world-bag-drop", drop.y, { id: drop.id });
    }
  });

  if (worldBag && worldBag.style.display !== "none") {
    const rect = worldRectFromXYWH(worldBagX, worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("world-bag-floor", worldBagY);
    }
  }

  if (guideBook && guideBook.style.display !== "none") {
    const rect = worldRectFromXYWH(guideBookX, guideBookY, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("guide-book", guideBookY);
    }
  }

  const seedSize = getSeedSize();
  if (canPickUpSeed()) {
    const rect = worldRectFromXYWH(seedX, seedY, seedSize.width, seedSize.height);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-main", seedY);
    }
  }

  const now = getSynchronizedNow();
  syncWorldLoosePickupLock(now);
  if (
    usesWorldLooseSeedMode() &&
    canPickWorldLooseSeedAt(appleState.worldLooseSeed, worldLoosePickupLockUntil, now)
  ) {
    ensureWorldLooseSeedShape();
    const ws = appleState.worldLooseSeed;
    const rect = worldRectFromXYWH(ws.x, ws.y, SEED_SIZE, SEED_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-loose", ws.y, { id: WORLD_LOOSE_SEED_ID });
    }
  }

  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || isExtraSeedDry(extraSeed)) return;
    if (usesWorldLooseSeedMode() && !extraSeed.inInventory) return;
    const rect = worldRectFromXYWH(extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-extra", extraSeed.y, { id: extraSeed.id });
    }
  });

  if (isWorldDocumentEntry() && isWorldRockPickupUnlocked()) {
    appleState.worldRocks.forEach(function (rock) {
      if (!rock || appleState.worldRockPickedIds.includes(rock.id)) return;
      const sz = Number(rock.size) || WORLD_ROCK_SIZE;
      const rect = worldRectFromXYWH(rock.x, rock.y, sz, sz);
      if (isWorldPointInsideRect(wx, wy, rect)) {
        push("rock", rock.y, { id: rock.id });
      }
    });
  }

  const bucketPick = getGroundBucketPickInfoAtWorldPoint(wx, wy);
  if (bucketPick) {
    const bucketSize = getBucketSize();
    const by =
      bucketPick.type === "main"
        ? bucketY
        : (function () {
            const extras = appleState.worldExtraBuckets || [];
            const entry = extras.find(function (b) {
              return b && String(b.id) === String(bucketPick.id);
            });
            return entry ? entry.y : bucketY;
          })();
    push("bucket", by, bucketPick);
  }

  if (!candidates.length) return null;
  candidates.sort(function (a, b) {
    return b.depthY - a.depthY;
  });
  return candidates[0];
}

function isPlayerNearWorldInteractTarget(target) {
  if (!target) return false;
  const bucketPick = getNearestGroundBucketPickInfo();
  const bucketDistance = bucketPick ? bucketPick.distance : Infinity;

  switch (target.kind) {
    case "butterfly":
      return Boolean(findCatchableButterfly());
    case "apple":
      return Boolean(
        appleState.apples.find(function (candidate) {
          return (
            !appleState.pickedIds.includes(candidate.id) &&
            isPlayerOverlappingRect(candidate.x, candidate.y, candidate.size, candidate.size)
          );
        })
      );
    case "world-bag-drop":
      return Boolean(
        findNearestWorldBagDropPickup(
          appleState.worldBagDrops,
          getPlayerCenterX(),
          getPlayerFootY(),
          Math.min(pickupDistance, bucketDistance)
        )
      );
    case "world-bag-floor":
      return isNearWorldBagPickup();
    case "guide-book":
      return isNearGuideBook();
    case "seed-main":
      return isNearSeed();
    case "seed-loose": {
      if (!usesWorldLooseSeedMode()) return false;
      ensureWorldLooseSeedShape();
      const ws = appleState.worldLooseSeed;
      return getCenterDistance(ws.x, ws.y, SEED_SIZE, SEED_SIZE) < pickupDistance;
    }
    case "seed-extra": {
      const seedId = target.data && target.data.id;
      const extra = appleState.extraSeeds.find(function (s) {
        return s && String(s.id) === String(seedId);
      });
      if (!extra || extra.planted || isExtraSeedDry(extra)) return false;
      return getCenterDistance(extra.x, extra.y, SEED_SIZE, SEED_SIZE) < pickupDistance;
    }
    case "rock": {
      const rockId = target.data && target.data.id;
      const rock = appleState.worldRocks.find(function (r) {
        return r && String(r.id) === String(rockId);
      });
      if (!rock || appleState.worldRockPickedIds.includes(rock.id)) return false;
      const sz = Number(rock.size) || WORLD_ROCK_SIZE;
      return getCenterDistance(rock.x, rock.y, sz, sz) <= pickupDistance;
    }
    case "bucket":
      return Boolean(
        target.data &&
          target.data.distance < bucketPickupDistance &&
          (target.data.type !== "main" || canPickUpSharedBucket())
      );
    default:
      return false;
  }
}

function tryPerformTargetedWorldInteract(target, wx, wy) {
  if (!target) return false;
  const bucketPick = getNearestGroundBucketPickInfo();
  const bucketDistance = bucketPick ? bucketPick.distance : Infinity;

  switch (target.kind) {
    case "world-bag-floor":
      return pickUpWorldBag();
    case "guide-book":
      return pickUpWorldGuideBookNoHold();
    case "butterfly":
      return tryCatchButterflyAtWorldPoint(wx, wy);
    case "apple":
      return pickApple();
    case "world-bag-drop":
      return tryPickWorldBagDropAtWorldPoint(wx, wy);
    case "bucket":
      return tryPickSharedBucket(bucketDistance, target.data);
    case "seed-main": {
      if (!isNearSeed() || !canPickUpSeed()) return false;
      if (isOnboardingLinearGateActive() && onboardingFlowStep !== 6) {
        flashOnboardingOrderHint("");
        return true;
      }
      createStarterSeedInventoryItem();
      updateSeedPosition();
      updateSeedInventory();
      triggerFirstSeedFocus();
      return true;
    }
    case "seed-loose": {
      if (!usesWorldLooseSeedMode()) return false;
      const now = getSynchronizedNow();
      syncWorldLoosePickupLock(now);
      if (!canPickWorldLooseSeedAt(appleState.worldLooseSeed, worldLoosePickupLockUntil, now)) {
        return false;
      }
      ensureWorldLooseSeedShape();
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
      holdLocalAppleStateAgainstStaleSnapshot(3000);
      syncWorldState(true);
      updateExtraSeedsAndPlants();
      updateSeedInventory();
      triggerFirstSeedFocus();
      return true;
    }
    case "seed-extra": {
      const seedId = target.data && target.data.id;
      const extra = appleState.extraSeeds.find(function (s) {
        return s && String(s.id) === String(seedId);
      });
      if (!extra || extra.planted || isExtraSeedDry(extra)) return false;
      if (getCenterDistance(extra.x, extra.y, SEED_SIZE, SEED_SIZE) > pickupDistance) {
        return false;
      }
      if (isWorldLooseSyntheticPickupCandidate(extra)) {
        return tryPerformTargetedWorldInteract({ kind: "seed-loose" }, wx, wy);
      }
      if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_EXTRA_SEED) {
        flashOnboardingOrderHint("");
        return true;
      }
      extra.inInventory = true;
      assignExtraSeedInventoryOwner(extra);
      saveAppleState();
      holdLocalAppleStateAgainstStaleSnapshot(1200);
      updateExtraSeedsAndPlants();
      updateSeedInventory();
      triggerFirstSeedFocus();
      return true;
    }
    case "rock": {
      const rockId = target.data && target.data.id;
      const rock = appleState.worldRocks.find(function (r) {
        return r && String(r.id) === String(rockId);
      });
      if (!rock) return false;
      const sz = Number(rock.size) || WORLD_ROCK_SIZE;
      if (getCenterDistance(rock.x, rock.y, sz, sz) > pickupDistance) return false;
      if (!canPickupWorldRockPerOnboarding()) {
        flashOnboardingOrderHint("");
        return true;
      }
      return tryPickupWorldRock(rock);
    }
    default:
      return false;
  }
}

function tryWorldInteractByPointerClick(clientX, clientY) {
  if (isPlayerHealthGameplayBlocked()) return false;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return false;
  }

  if (isWorldFloorBagAwaitingPickup()) {
    const bagPxy = groundClientToWorldXY(clientX, clientY);
    if (!bagPxy) return false;
    const bagTarget = pickWorldInteractTargetAtWorldPoint(bagPxy.x, bagPxy.y);
    if (
      !bagTarget ||
      bagTarget.kind !== "world-bag-floor" ||
      !isPlayerNearWorldInteractTarget(bagTarget)
    ) {
      return false;
    }
    const bagNow = Date.now();
    if (bagNow - lastPickupToggleAt < 180) return false;
    lastPickupToggleAt = bagNow;
    return pickUpWorldBag();
  }

  if (heldItem === HELD_ITEM_BUCKET && isPointerOnHeldBucket(clientX, clientY)) {
    const now = Date.now();
    if (now - lastPickupToggleAt < 180) return false;
    if (now - lastBucketPickupAt < 260) return false;
    lastPickupToggleAt = now;
    dropHeldItem();
    return true;
  }

  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return false;

  const target = pickWorldInteractTargetAtWorldPoint(pxy.x, pxy.y);
  if (!target) return false;
  if (!isPlayerNearWorldInteractTarget(target)) return false;

  const now = Date.now();
  if (now - lastPickupToggleAt < 180) return false;
  lastPickupToggleAt = now;

  if (heldItem) {
    performInteractActionCore();
    return true;
  }

  if (tryPerformTargetedWorldInteract(target, pxy.x, pxy.y)) return true;
  performInteractActionCore();
  return true;
}

function tryWaterPlantByPointerClick(clientX, clientY) {
  if (isWorldFloorBagAwaitingPickup()) return false;
  if (heldItem !== HELD_ITEM_BUCKET || !isBucketFull) return false;
  if (isPlayerHealthGameplayBlocked()) return false;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return false;
  }
  if (isTradeExchangeOpen()) return false;
  if (isOnboardingLinearGateActive() && !onboardingAllowsBucketQUse()) {
    flashOnboardingOrderHint("");
    return false;
  }

  const plant = pickPlantForHoverFromPointerClient(clientX, clientY);
  if (!plant || !canWaterPlantByClick(plant)) return false;
  if (!isPlayerNearPlantWorld(plant)) {
    flashPlantProximityWarning(PLANT_WATER_TOO_FAR_MESSAGE);
    updatePlayerStatus();
    return false;
  }
  if (!tryConsumePlantWaterPourCooldown()) return false;

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
  updateBucketPosition();
  refreshPlantWaterHoverIfShown(plant);
  updatePlantState();
  updateExtraSeedsAndPlants();
  refreshSharedWaterIndicators();
  syncWorldState(true);
  return true;
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

  if (isPlantSpotOverlappingVisibleWorldRock(plantX, plantY, 2)) {
    return "\uB3CC\uC704\uC5D0\uB294 \uC2EC\uC9C0 \uBABB\uD569\uB2C8\uB2E4.";
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

  if (!plantRuntime.isSeedPlanted && seed && seed.style.display !== "none") {
    const seedPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, seedX, seedY, SEED_SIZE, SEED_SIZE, seedPad)) {
      return plantProximityPhraseForNoun("\uC528\uC557");
    }
  }

  let blockedByLooseSeed = false;
  if (
    usesWorldLooseSeedMode() &&
    isWorldLooseSeedVisibleAt() &&
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

  let blockedByCraftFurniture = "";
  placedCraftFurniture.forEach(function (entry) {
    if (blockedByCraftFurniture || !entry) return;
    if (
      entry.kind !== "craftDesk" &&
      entry.kind !== "craftChair" &&
      entry.kind !== "craftHouse"
    ) {
      return;
    }
    if (
      plantSpotOverlapsExpandedRect(
        plantX,
        plantY,
        entry.x,
        entry.y,
        entry.width,
        entry.height,
        0
      )
    ) {
      blockedByCraftFurniture = getCraftFurnitureKindLabel(entry.kind);
    }
  });
  if (blockedByCraftFurniture) {
    return plantProximityPhraseForNoun(blockedByCraftFurniture);
  }

  return "";
}

function craftInstallBlockPhraseForNoun(noun) {
  const ch = noun.length ? noun[noun.length - 1] : "";
  const code = ch.charCodeAt(0);
  let hasBatchim = true;
  if (code >= 0xac00 && code <= 0xd7a3) {
    hasBatchim = (code - 0xac00) % 28 !== 0;
  }
  const particle = hasBatchim ? "\uC774" : "\uAC00";
  return noun + particle + " \uC788\uC5B4\uC11C \uC124\uCE58 \uBD88\uAC00!";
}

function craftPlacementOverlapsExpandedRect(placement, ox, oy, ow, oh, pad) {
  const fr = plantProximityRectFromXYWH(
    placement.x,
    placement.y,
    placement.width,
    placement.height
  );
  const br = plantProximityExpandRect(plantProximityRectFromXYWH(ox, oy, ow, oh), pad);
  return isOverlappingRect(fr, br);
}

function craftPlacementOverlapsVisibleWorldRock(placement, rockPad) {
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
    return craftPlacementOverlapsExpandedRect(
      placement,
      rockBox.left,
      rockBox.top,
      rockBox.right - rockBox.left,
      rockBox.bottom - rockBox.top,
      pad
    );
  });
}

function getCraftFurnitureKindLabel(kind) {
  if (kind === "craftDesk") return "\uCC45\uC0C1";
  if (kind === "craftChair") return "\uC758\uC790";
  if (kind === "craftHouse") return "\uC9D1";
  if (kind === "craftFence") return "\uC6B8\uD0C0\uB9AC";
  return "\uAC00\uAD6C";
}

function getCraftFurniturePlacementBlockMessage(placement) {
  if (!placement) return "";

  if (craftPlacementOverlapsVisibleWorldRock(placement, 0)) {
    return craftInstallBlockPhraseForNoun("\uB3CC");
  }

  const wx = Number.isFinite(wellX) && wellX > 0 ? wellX : WELL_START_X;
  const wy = Number.isFinite(wellY) && wellY > 0 ? wellY : WELL_START_Y;
  if (craftPlacementOverlapsExpandedRect(placement, wx, wy, WELL_SIZE, WELL_SIZE, 0)) {
    return craftInstallBlockPhraseForNoun("\uC6B0\uBB3C");
  }

  if (
    craftPlacementOverlapsExpandedRect(
      placement,
      spawnPortalX,
      spawnPortalY,
      spawnPortalWidth,
      spawnPortalHeight,
      0
    )
  ) {
    return craftInstallBlockPhraseForNoun("\uD3EC\uD0C8");
  }

  if (isPlantMasterVisible()) {
    if (craftPlacementOverlapsExpandedRect(placement, npcX, npcY, NPC_WIDTH, NPC_HEIGHT, 0)) {
      return craftInstallBlockPhraseForNoun("\uC2DD\uBB3C\uC758 \uB2EC\uC778");
    }
  }

  if (isTradeMasterVisible()) {
    if (
      craftPlacementOverlapsExpandedRect(
        placement,
        TRADE_MASTER_START_X,
        TRADE_MASTER_START_Y,
        NPC_WIDTH,
        NPC_HEIGHT,
        0
      )
    ) {
      return craftInstallBlockPhraseForNoun("\uC0C1\uC778");
    }
  }

  if (isAlchemyMasterVisible()) {
    if (
      craftPlacementOverlapsExpandedRect(
        placement,
        ALCHEMY_MASTER_START_X,
        ALCHEMY_MASTER_START_Y,
        NPC_WIDTH,
        NPC_HEIGHT,
        0
      )
    ) {
      return craftInstallBlockPhraseForNoun("\uC5F0\uAE08\uC220\uC758 \uB2EC\uC778");
    }
  }

  if (usesWorldLooseSeedMode()) {
    const lx = Number(appleState.worldLooseSeed && appleState.worldLooseSeed.x) || WORLD_LOOSE_SEED_X;
    const ly = Number(appleState.worldLooseSeed && appleState.worldLooseSeed.y) || WORLD_LOOSE_SEED_Y;
    if (craftPlacementOverlapsExpandedRect(placement, lx, ly, SEED_SIZE, SEED_SIZE, 0)) {
      return craftInstallBlockPhraseForNoun("\uC528\uC557");
    }
  }

  if (!plantRuntime.isSeedPlanted && seed && seed.style.display !== "none") {
    if (craftPlacementOverlapsExpandedRect(placement, seedX, seedY, SEED_SIZE, SEED_SIZE, 0)) {
      return craftInstallBlockPhraseForNoun("\uC528\uC557");
    }
  }

  let blockedByGroundSeed = false;
  if (
    usesWorldLooseSeedMode() &&
    isWorldLooseSeedVisibleAt() &&
    craftPlacementOverlapsExpandedRect(
      placement,
      appleState.worldLooseSeed.x,
      appleState.worldLooseSeed.y,
      SEED_SIZE,
      SEED_SIZE,
      0
    )
  ) {
    blockedByGroundSeed = true;
  }
  appleState.extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || extraSeed.inInventory) return;
    if (usesWorldLooseSeedMode()) return;
    if (!extraSeed.element || extraSeed.element.style.display === "none") return;
    if (
      craftPlacementOverlapsExpandedRect(placement, extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE, 0)
    ) {
      blockedByGroundSeed = true;
    }
  });
  if (blockedByGroundSeed) {
    return craftInstallBlockPhraseForNoun("\uC528\uC557");
  }

  const bsz = getBucketSize();
  let blockedByBucket = false;
  if (bucket && bucket.style.display === "block") {
    const bx = Number.isFinite(bucketX) && bucketX > 0 ? bucketX : WELL_START_X - bsz.width - 8;
    const by =
      Number.isFinite(bucketY) && bucketY > 0 ? bucketY : WELL_START_Y + WELL_SIZE - bsz.height;
    if (craftPlacementOverlapsExpandedRect(placement, bx, by, bsz.width, bsz.height, 0)) {
      blockedByBucket = true;
    }
  }
  (Array.isArray(appleState.worldExtraBuckets) ? appleState.worldExtraBuckets : []).forEach(
    function (extraBucket) {
      if (!extraBucket || blockedByBucket) return;
      if (
        craftPlacementOverlapsExpandedRect(
          placement,
          extraBucket.x,
          extraBucket.y,
          bsz.width,
          bsz.height,
          0
        )
      ) {
        blockedByBucket = true;
      }
    }
  );
  if (blockedByBucket) {
    return craftInstallBlockPhraseForNoun("\uC591\uB3D9\uC774");
  }

  if (
    plantRuntime.isSeedPlanted &&
    Number.isFinite(plantRuntime.spotX) &&
    Number.isFinite(plantRuntime.spotY)
  ) {
    if (
      craftPlacementOverlapsExpandedRect(
        placement,
        plantRuntime.spotX,
        plantRuntime.spotY,
        PLANT_SPOT_WIDTH,
        PLANT_SPOT_HEIGHT,
        0
      )
    ) {
      return craftInstallBlockPhraseForNoun("\uC2DD\uBB3C");
    }
  }

  let blockedByPlant = false;
  appleState.extraPlants.forEach(function (plant) {
    if (!plant || plant.removed) return;
    if (
      craftPlacementOverlapsExpandedRect(
        placement,
        plant.x,
        plant.y,
        PLANT_SPOT_WIDTH,
        PLANT_SPOT_HEIGHT,
        0
      )
    ) {
      blockedByPlant = true;
    }
  });
  if (blockedByPlant) {
    return craftInstallBlockPhraseForNoun("\uC2DD\uBB3C");
  }

  let blockedByFurniture = "";
  placedCraftFurniture.forEach(function (entry) {
    if (blockedByFurniture) return;
    if (
      craftPlacementOverlapsExpandedRect(placement, entry.x, entry.y, entry.width, entry.height, 0)
    ) {
      blockedByFurniture = getCraftFurnitureKindLabel(entry.kind);
    }
  });
  if (blockedByFurniture) {
    return craftInstallBlockPhraseForNoun(blockedByFurniture);
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
  /** ????????? ?????????????(??????trunkBottom???????????? ???????? x????? y????? ??? ???????? */
  const trunkVisualTop = TREE_TRUNK_TOP - 22;
  const trunkFeetBottom = BIG_TREE_Y + BIG_TREE_HEIGHT + TREE_CSS_ROOTS_BOTTOM_EXTEND;
  if (overlap(trunkLeft, trunkVisualTop, trunkRight, trunkFeetBottom)) {
    return true;
  }
  return false;
}

/**
 * growthTier????? ?????????? ?????????? 0??? ??????????????????? ????(getSproutStage)?? ??? ??.
 * ?????????? ???????? ??, maturity??0??????
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
  if (isPlayerInsideEnteredCraftHouse()) return;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return;
  }

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
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return;
  }

  refillWellIfNeeded();
  // ??????? ???? ???? updateBucketPosition???? ??? ????????????? ????????? ??????????????
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
      broadcastBucketState(false);
      updateWellImage();
      updateWellCard();
      onboardingHookFilledBucketAtWell();
    } else if (wellReachForScoop && wellState.water <= 0) {
      flashPlantProximityWarning("\uC6B0\uBB3C\uC5D0 \uBB3C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
      updatePlayerStatus();
    }
    return;
  }

  const wateringTarget = getNearestWateringTarget();
  const nearWellPour = wellReachForPour;
  // ????? ??????? ????????????Q?????? ????????(??????? ?? ??????????????? ???).
  if (
    nearWellPour &&
    wellState.water < maxWellWater &&
    !wateringTarget
  ) {
    wellState.water += 1;
    wellState.lastRefillAt = snapWellRefillToGrid(Date.now());
    saveWellState();
    syncWorldState(true);
    updateWellImage();
    updateWellCard();
    triggerWaterSplash();
    isBucketFull = false;
    broadcastBucketState(false);
    return;
  }


  if (wateringTarget) {
    if (!isPlayerNearPlantWorld(wateringTarget.plant)) {
      flashPlantProximityWarning(PLANT_WATER_TOO_FAR_MESSAGE);
      updatePlayerStatus();
      return;
    }
    if (!tryConsumePlantWaterPourCooldown()) return;
    if (
      !getStoredFlag(onboardingFlowDoneKey) &&
      onboardingFlowStep === 14 &&
      wateringTarget.type === "main"
    ) {
      onboardingFlowStep = 15;
      persistOnboardingStep();
    }
    waterPlant(wateringTarget);
    triggerWaterSplash();
    isBucketFull = false;
    markWorldDirty();
    broadcastBucketState(false);
    updateBucketPosition();
    refreshPlantWaterHoverIfShown(wateringTarget.plant);
    updatePlantState();
    updateExtraSeedsAndPlants();
    refreshSharedWaterIndicators();
    syncWorldState(true);
    return;
  }

  // ?????????????????????????? ????????? ?????????? ????? + ???????????????????
  if (nearWellPour && wellState.water >= maxWellWater) {
    triggerWaterSplash();
    flashPlantProximityWarning(
      "\uC6B0\uBB3C\uC774 \uAC00\uB4DD\uCC28\uC2B5\uB2C8\uB2E4."
    );
    updatePlayerStatus();
    return;
  }

  const closestWaterableDist = getClosestWaterablePlantDistance();
  if (Number.isFinite(closestWaterableDist) && closestWaterableDist >= plantWaterDistance) {
    flashPlantProximityWarning(PLANT_WATER_TOO_FAR_MESSAGE);
    updatePlayerStatus();
  }
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

function applyMagicPowderToPlant(plant, bagType) {
  const nextTier = getNextPowderTargetTier(plant);
  if (!nextTier || isPowderUpgradeInProgress(plant)) return false;
  const now = getSharedPlantSimulationNow();
  plant.matureKind = getMatureKindForPowderBagType(bagType);
  plant.powderUpgradeTargetTier = nextTier;
  plant.powderUpgradeStartedAt = now;
  plant.powderUpgradeDurationMs = level4GrowMs;
  plant.needsFirstWater = true;
  plant.becameEmptyAt = null;
  plant.grassAuto5EligibleAt = null;
  return true;
}

function getMagicPowderBagCount(bagType) {
  bagType = normalizeMagicPowderBagType(bagType);
  if (bagType === "magicPowder") {
    return Math.max(0, Math.floor(magicPowderCount) || 0);
  }
  const field = getColoredPowderCountField(bagType);
  if (!field) return 0;
  return Math.max(0, Math.floor(Number(coloredMagicPowderCounts[field]) || 0));
}

function consumeMagicPowderBagItem(bagType) {
  bagType = normalizeMagicPowderBagType(bagType);
  if (bagType === "magicPowder") {
    if (magicPowderCount <= 0) return false;
    magicPowderCount = Math.max(0, magicPowderCount - 1);
    saveMagicPowderCount();
    return true;
  }
  const field = getColoredPowderCountField(bagType);
  if (!field || (Number(coloredMagicPowderCounts[field]) || 0) <= 0) return false;
  coloredMagicPowderCounts[field] = Math.max(0, coloredMagicPowderCounts[field] - 1);
  saveColoredMagicPowderCounts();
  return true;
}

function isMagicPowderBagTypeUsableNow(bagType) {
  bagType = normalizeMagicPowderBagType(bagType);
  if (isOnboardingLinearGateActive()) return false;
  if (!isMagicPowderBagType(bagType)) return false;
  if (getMagicPowderBagCount(bagType) <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  const nextTier = getNextPowderTargetTier(target.plant);
  if (!nextTier || isPowderUpgradeInProgress(target.plant)) return false;
  return true;
}

/** ????? ???? ????????? ?????????????????? ??????) */
function isMagicPowderUsableNow() {
  return isMagicPowderBagTypeUsableNow("magicPowder");
}

function tryUseMagicPowderBagType(bagType) {
  bagType = normalizeMagicPowderBagType(bagType);
  if (isPlayerGameplayBlockedByNpcDialogue()) return false;
  if (isOnboardingLinearGateActive()) {
    flashOnboardingOrderHint("");
    return false;
  }
  if (!isMagicPowderBagType(bagType) || getMagicPowderBagCount(bagType) <= 0) return false;
  const target = getNearestPlantForMagicPowder();
  if (!target) return false;
  if (!applyMagicPowderToPlant(target.plant, bagType)) return false;
  if (!consumeMagicPowderBagItem(bagType)) return false;

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
  updateBagInventorySlots();
  updatePlantState();
  updateExtraSeedsAndPlants();
  return true;
}

function tryUseMagicPowder() {
  return tryUseMagicPowderBagType("magicPowder");
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

  function tryPlant(plant) {
    if (!canWaterPlantByClick(plant)) return;
    if (!isPlayerNearPlantWorld(plant)) return;
    const distance = getPlayerDistanceToPlant(plant);
    if (!nearest || distance < nearest.distance) {
      nearest =
        plant === plantRuntime
          ? { type: "main", plant: plantRuntime, distance: distance }
          : { type: "extra", plant: plant, distance: distance };
    }
  }

  if (plantRuntime.isSeedPlanted) tryPlant(plantRuntime);
  appleState.extraPlants.forEach(tryPlant);

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

  const now = getSharedPlantSimulationNow();
  markSuppressPlantWaterDecayBriefly(now);

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
  holdLocalPlantStateAgainstStaleSnapshot(2200);

  saveSeedState();
  updatePlantState();
  refreshSharedWaterIndicators();
  syncWorldState(true);
  onboardingHookWateredMainPlantFromTutorial();
}

function waterExtraPlant(plant) {
  const now = getSharedPlantSimulationNow();
  markSuppressPlantWaterDecayBriefly(now);
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
  holdLocalPlantStateAgainstStaleSnapshot(2200);
  holdLocalAppleStateAgainstStaleSnapshot(2200);

  saveAppleState();
  updateExtraSeedsAndPlants();
  refreshSharedWaterIndicators();
  syncWorldState(true);
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

  const now = getSharedPlantSimulationNow();

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

  const now = getSharedPlantSimulationNow();

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

  if (
    plantRuntime.status !== "dry" &&
    canPlantWiltFromEmptyWater(plantRuntime, now) &&
    plantRuntime.status !== "rotten" &&
    plantRuntime.becameEmptyAt !== null &&
    now - plantRuntime.becameEmptyAt >= getMainDryAfterEmptyMsForPlant(plantRuntime, now)
  ) {
    // ??? ???? ??? ???): ?????? ? ???? ???? ? plantDrySoilClearMs ???????
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
    plantSpot.src = IMG_SOIL_ROTTEN;
  } else if (plantRuntime.status === "wet") {
    plantSpot.src = IMG_SOIL_WET;
  } else if (plantRuntime.status === "dry") {
    plantSpot.src = IMG_SOIL_DRY;
  } else {
    plantSpot.src = IMG_TILLED_SOIL;
  }

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
  if (!plant) return false;
  if (isStage3CompleteAwaitingMagicPowder(plant)) return true;
  return isFinalMaturePlantNoWaterCare(plant);
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

function updatePlantCard() {
  if (!plantCard) return;
  plantCard.style.display = "none";
  if (plantCardTitle) plantCardTitle.textContent = "";
}

function updatePlantGrowth() {
  const now = getSharedPlantSimulationNow();
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
  const sproutSize = getSproutSizeForStage(stage, plantRuntime);
  sprout.style.display = "block";
  sprout.classList.toggle("is-big", stage >= 2);
  sprout.src = getSproutImageForPlant(plantRuntime, stage);
  setWorldSize(sprout, sproutSize.width, sproutSize.height);
  const sproutPos = getSproutWorldPositionForPlant(
    plantRuntime.spotX,
    plantRuntime.spotY,
    sproutSize,
    stage,
    plantRuntime
  );
  setWorldPosition(sprout, sproutPos.x, sproutPos.y);
  applyPlantDepthZIndexToElements(
    plantRuntime,
    plantSpot,
    sprout,
    mainPlantGrowthMeter && mainPlantGrowthMeter.element
  );
  updateNpcPosition();
}

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

  if (tradeMaster) {
    if (isTradeMasterVisible()) {
      tradeMaster.style.display = "block";
      setWorldPosition(tradeMaster, TRADE_MASTER_START_X, TRADE_MASTER_START_Y);
      updateTradeNpcPrompt();
    } else {
      tradeMaster.style.display = "none";
      if (tradeMasterBubble) tradeMasterBubble.style.display = "none";
      if (isTradeExchangeOpen()) closeTradeExchangePanel();
    }
  }

  if (alchemyMaster) {
    if (isAlchemyMasterVisible()) {
      alchemyMaster.style.display = "block";
      setWorldPosition(alchemyMaster, ALCHEMY_MASTER_START_X, ALCHEMY_MASTER_START_Y);
      updateAlchemyNpcPrompt();
    } else {
      alchemyMaster.style.display = "none";
      if (alchemyMasterBubble) alchemyMasterBubble.style.display = "none";
    }
  }

  if (playerBubble.style.display === "block") {
    updatePlayerBubblePosition();
  } else {
    playerBubble.classList.remove("is-in-front-of-name");
  }
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
    Boolean(
      (isNpcDialogueRunning || isAlchemyMasterDialogueRunning()) &&
        playerBubble.style.display === "block"
    )
  );
  setPlayerBubbleWorldPosition(
    playerWorldLeft + PLAYER_WIDTH / 2 - bw / 2,
    bubbleWorldY
  );
}

function updateNpcPrompt() {
  if (isNpcDialogueRunning || isAlchemyMasterDialogueRunning()) return;

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

  if (playerAlert.classList.contains("is-butterfly-catch")) {
    const playerRenderedHeight = player.offsetHeight || PLAYER_HEIGHT;
    const playerWorldTop =
      GROUND_WORLD_HEIGHT - playerRenderedHeight - playerDepth + jumpY;
    const alertWidth = playerAlert.offsetWidth || 36;
    const alertWorldY = speechBubbleTopWorldYFromHead(
      playerWorldTop,
      playerAlert,
      SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD
    );
    setSpeechBubbleTransform(
      playerAlert,
      playerX + PLAYER_WIDTH / 2 - alertWidth / 2,
      alertWorldY
    );
    return;
  }

  const playerBox = getPlayerBox();
  const alertWidth = playerAlert.offsetWidth || 10;
  const alertHeight = playerAlert.offsetHeight || 10;
  const x = toScreenX(playerBox.left + playerBox.width / 2) - alertWidth / 2;
  const y = toScreenY(playerBox.top) - alertHeight - 4;
  playerAlert.style.transform = "translate(" + x + "px, " + y + "px)";
}

function updateGuideCard() {
  const nearSign = isNearSignBoard();
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  const shouldShow =
    hasGuideBook && (isGuideBookOpen || (nearSign && !isGuideDismissedAtSign));

  if (shouldShow) {
    guideCard.style.display = "block";
    updateGuidePages();
  } else {
    guideCard.style.display = "none";
  }

  if (guideBook) guideBook.classList.remove("is-near");
  if (worldBag) worldBag.classList.remove("is-near");
  if (worldBagInventory) {
    worldBagInventory.classList.toggle(
      "is-click-prompt",
      hasGuideBook && isGuideBookClickPromptActive
    );
  }

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
  well.src = wellState.water > 0 ? IMG_WELL : IMG_WELL_EMPTY;
}

function updateWellCard() {
  const isVisible = isNearWellForCard();
  const waterRatio = wellState.water / maxWellWater;
  const wellImage = wellState.water > 0 ? IMG_WELL : IMG_WELL_EMPTY;

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
  plantRuntime.matureKind = Object.prototype.hasOwnProperty.call(loadedPlant, "matureKind")
    ? String(loadedPlant.matureKind || "")
    : "";
  plantRuntime.flowerOrdinal =
    loadedPlant.flowerOrdinal != null && Number.isFinite(Number(loadedPlant.flowerOrdinal))
      ? Math.max(1, Number(loadedPlant.flowerOrdinal))
      : null;
  plantRuntime.treeOrdinal =
    loadedPlant.treeOrdinal != null && Number.isFinite(Number(loadedPlant.treeOrdinal))
      ? Math.max(1, Number(loadedPlant.treeOrdinal))
      : null;
  plantRuntime.cactusOrdinal =
    loadedPlant.cactusOrdinal != null && Number.isFinite(Number(loadedPlant.cactusOrdinal))
      ? Math.max(1, Number(loadedPlant.cactusOrdinal))
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
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "plantSeedKind")) {
    plantRuntime.seedKind = String(loadedPlant.plantSeedKind || "");
  } else if (Object.prototype.hasOwnProperty.call(loadedPlant, "seedKind")) {
    plantRuntime.seedKind = String(loadedPlant.seedKind || "");
  }
  const plantLoadNow = Date.now();
  if (shouldFinalizeOvergrowthGroundToStage3(plantRuntime, plantLoadNow)) {
    makePlantStableStage3FromOvergrowthSeed(plantRuntime, plantLoadNow);
  }
  if (plantRuntime.isSproutSelfSustaining && plantRuntime.growthTier < 3) {
    plantRuntime.growthTier = 3;
  }
  reconcileMaturePlantGrowthTierFromOrdinal(plantRuntime);
  syncPlantWaterCapacityField(plantRuntime);
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
    plantSeedKind: plantRuntime.seedKind != null ? String(plantRuntime.seedKind) : "",
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
    matureKind: plantRuntime.matureKind != null ? String(plantRuntime.matureKind) : "",
    flowerOrdinal:
      plantRuntime.flowerOrdinal != null && Number.isFinite(Number(plantRuntime.flowerOrdinal))
        ? plantRuntime.flowerOrdinal
        : null,
    treeOrdinal:
      plantRuntime.treeOrdinal != null && Number.isFinite(Number(plantRuntime.treeOrdinal))
        ? plantRuntime.treeOrdinal
        : null,
    cactusOrdinal:
      plantRuntime.cactusOrdinal != null && Number.isFinite(Number(plantRuntime.cactusOrdinal))
        ? plantRuntime.cactusOrdinal
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

  if (isPlayerTimedActionBusy()) {
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
  if (worldNpcHoverAnchorEl) {
    syncWorldNpcHoverLabelPosition(worldNpcHoverAnchorEl);
  }
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
        throw new Error(data.message || "??? ??????.");
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
  syncLocalPlayerPoseVisual();
  addNetworkDebugLog("apply color: " + normalizedColor);
  syncPlayerColorToServer();
}

function getTintedPlayerSrc(color, sitting) {
  const tintColor = /^#[0-9a-fA-F]{6}$/.test(color || "") ? color.toLowerCase() : "#ffffff";
  const useSit = Boolean(sitting);
  const cache = useSit ? playerSitTintCache : playerTintCache;

  if (cache.has(tintColor)) {
    return cache.get(tintColor);
  }

  const baseImage = useSit ? playerSitBaseImage : playerBaseImage;
  const baseReady = useSit ? playerSitBaseImageReady : playerBaseImageReady;
  const fallback = useSit ? PLAYER_SIT_IMAGE_SRC : playerBaseImage.src;

  if (
    !baseReady ||
    !baseImage.naturalWidth ||
    !baseImage.naturalHeight ||
    /\.svg(?:\?|$)/i.test(String(baseImage.src || ""))
  ) {
    return fallback;
  }

  const canvas = document.createElement("canvas");
  canvas.width = baseImage.naturalWidth;
  canvas.height = baseImage.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return fallback;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(baseImage, 0, 0);
  context.globalCompositeOperation = "source-atop";
  context.fillStyle = tintColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "source-over";

  const tintedSrc = canvas.toDataURL("image/png");
  cache.set(tintColor, tintedSrc);
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
    button.setAttribute("aria-label", color + " ??");

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

  isCharacterSelecting = true;
  updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
  ovcTryDismissLoadingScreen(true);
  player.classList.add("is-hidden-before-spawn");
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}

function openCharacterColorChange() {
  onboardingStep26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
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
  syncLocalPlayerVisibility();
  applyPlayerColor(selectedPlayerColor);

  syncPlayerColorToServer(true);

  restoreWorldHubIfVeteranWithoutActiveReplay();
  ovcApplyForceWorldHubBypassLoggedIn();
  syncTutorialDoneFromServerIfNeeded().then(function () {
    finishCharacterSelectAfterTutorialGate();
  });
}

function finishCharacterSelectAfterTutorialGate() {
  if (
    isTutorialDocumentEntry() &&
    currentUserId &&
    getStoredFlag(onboardingFlowDoneKey) &&
    !ovcTutorialIntentionalEntryActive()
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
    setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
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
  if (!playerName) return;
  if (
    !player ||
    player.classList.contains("is-hidden-before-spawn")
  ) {
    playerName.style.display = "none";
    playerName.classList.remove("is-dialogue-layer");
    return;
  }

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

  const npcLineShowing =
    isNpcDialogueRunning && npcBubble.style.display === "block";
  playerName.classList.toggle("is-dialogue-layer", npcLineShowing);
}

function syncLocalPlayerVisibility() {
  if (!player || !localPlayerRoot) return;
  localPlayerRoot.style.display = "block";
  if (hasSpawnedCharacter) {
    player.classList.remove("is-hidden-before-spawn");
    player.style.display = "block";
    if (!player.getAttribute("src")) {
      player.src = PLAYER_BASE_IMAGE_SRC;
    }
    return;
  }
  player.style.display = "";
  player.classList.add("is-hidden-before-spawn");
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

function toggleWorldChatPanel() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== ONBOARDING_STEP_CHAT) {
    flashOnboardingOrderHint("");
    return;
  }
  setWorldChatPanelOpen(!worldChatPanelOpen);
}

function sanitizeWorldChatText(raw) {
  let s = String(raw || "")
    .trim()
    .replace(/[\u0000-\u001F]/g, "");
  if (s.length > WORLD_CHAT_MAX_CHARS) s = truncateWorldChatString(s, WORLD_CHAT_MAX_CHARS);
  return s;
}

function isKnownWorldChatRecipientName(rawName) {
  const want = nameForIngameUiDisplay(rawName);
  if (!want) return false;
  if (want === nameForIngameUiDisplay(accountDisplayNameForUi())) return true;
  return Object.keys(remotePlayers).some(function (rid) {
    const rp = remotePlayers[rid];
    return want === nameForIngameUiDisplay(rp && rp.name ? rp.name : "");
  });
}

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
  if (
    parts.some(function (part) {
      return !isKnownWorldChatRecipientName(part);
    })
  ) {
    return { kind: "world", body: s };
  }
  return { kind: "whisper", recipientNames: parts, body: right };
}

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

function closeWorldChatUserPicker() {
  setWorldChatUserPickerOpen(false);
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

function toggleWorldChatUserPicker() {
  if (!worldChatUserPickerEl) return;
  if (worldChatUsersPickerOpen) {
    closeWorldChatUserPicker();
    return;
  }
  setWorldChatUserPickerOpen(true);
  fillWorldChatUserPickerFromServer();
}

/**
 * "?????" ??"????? ???????" ????????????????????????. `???:` ?? ?????????? ????? ????????????.
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
    setRemotePlayerVisualPosition(rp, px, -depth, jy);
    rp.worldX = px;
    rp.worldY = -depth + jy;
    rp.depth = depth;
    rp.jumpY = jy;
  }
  window.requestAnimationFrame(function () {
    const rpp = remotePlayers[sid];
    if (!rpp || !rpp.bodyElement) return;
    spawnWorldHeartFxNearBodyRect(rpp.bodyElement.getBoundingClientRect());
  });
}

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
    setRemotePlayerVisualPosition(rp, px, -depth, jy);
    rp.worldX = px;
    rp.worldY = -depth + jy;
    rp.depth = depth;
    rp.jumpY = jy;
  }
  window.requestAnimationFrame(function () {
    const rpp = remotePlayers[sid];
    if (!rpp || !rpp.bodyElement) return;
    spawnWorldSadFxNearBodyRect(rpp.bodyElement.getBoundingClientRect());
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
  let sadLeadBit = null;
  for (let i = 0; i < n; i++) {
    const bit = document.createElement("span");
    bit.className = "ovc-heart-fx-bit";
    if (i === 0) {
      bit.classList.add("ovc-heart-fx-bit--sad-lead");
      bit.appendChild(createOvcSadFaceElement());
      sadLeadBit = bit;
    } else {
      bit.textContent = facesVariety[(i - 1) % facesVariety.length];
      root.appendChild(bit);
    }
    bit.style.fontSize = fontPx + "px";
    const dx = (Math.random() - 0.35) * spreadX;
    const dy = -rise - Math.random() * spreadY;
    bit.style.setProperty("--ovc-hx", dx + "px");
    bit.style.setProperty("--ovc-hy", dy + "px");
    bit.style.animationDelay = i * 0.05 + "s";
  }
  if (sadLeadBit) root.appendChild(sadLeadBit);
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

function pulseWorldSadButton() {
  if (!worldSadBtn) return;
  worldSadBtn.classList.remove("ovc-sad-btn-pulse");
  void worldSadBtn.offsetWidth;
  worldSadBtn.classList.add("ovc-sad-btn-pulse");
  window.setTimeout(function () {
    if (worldSadBtn) worldSadBtn.classList.remove("ovc-sad-btn-pulse");
  }, 600);
}

function updateWorldSocialChatUiEnabled() {
  const ok = isOnboardingSocialDemoReady();
  if (worldChatInputEl) {
    worldChatInputEl.disabled = !ok;
    worldChatInputEl.placeholder = ok
      ? isOnboardingSocialTutorialStep()
        ? "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD55C \uB4A4 \uC804\uC1A1"
        : "\uC804\uCCB4: \uBA54\uC2DC\uC9C0 \uB610\uB294 \uC774\uB9841, \uC774\uB9842: \uADD3\uB9D0..."
      : "\uBA40\uD2F0 \uC5F0\uACB0 \uD6C4 \uCC57";
  }
  if (worldChatSendBtn) worldChatSendBtn.disabled = !ok;
  if (worldChatUsersBtn) worldChatUsersBtn.disabled = !isWorldSocialRealtimeReady();
  if (worldHeartBtn) worldHeartBtn.disabled = !ok;
  if (worldSadBtn) worldSadBtn.disabled = !ok;
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
  const raw = worldChatInputEl.value;
  const parsed = parseWorldChatComposition(raw);
  worldChatInputEl.value = "";
  if (!parsed) return;
  const body = sanitizeWorldChatText(parsed.body);
  if (!body) return;
  if (isOnboardingSocialTutorialStep() && onboardingFlowStep === ONBOARDING_STEP_CHAT) {
    showOnboardingSocialDemoChatBubble(body);
    advanceOnboardingAfterSocialChatSent();
    return;
  }
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

function onWorldHeartClick() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== ONBOARDING_STEP_HEART) {
    flashOnboardingOrderHint("");
    return;
  }
  if (!isOnboardingSocialDemoReady()) return;
  if (isWorldSocialRealtimeReady()) {
    broadcastWorldHeart();
  }
  pulseWorldHeartButton();
  if (!player) return;
  const rect = player.getBoundingClientRect();
  spawnWorldHeartFxNearBodyRect(rect);
  advanceOnboardingAfterSocialHeart();
}

function onWorldSadClick() {
  if (isOnboardingLinearGateActive() && onboardingFlowStep !== ONBOARDING_STEP_SAD) {
    flashOnboardingOrderHint("");
    return;
  }
  if (!isOnboardingSocialDemoReady()) return;
  if (isWorldSocialRealtimeReady()) {
    broadcastWorldSad();
  }
  pulseWorldSadButton();
  if (!player) return;
  const rect = player.getBoundingClientRect();
  spawnWorldSadFxNearBodyRect(rect);
  advanceOnboardingAfterSocialSad();
}

function ensureWorldSocialUi() {
  if (worldSocialUiReady) return;
  worldSadBtn = document.createElement("button");
  worldSadBtn.type = "button";
  worldSadBtn.id = "world-sad-button";
  worldSadBtn.className = "world-sad-button";
  worldSadBtn.setAttribute("aria-label", "\uC2AC\uD37C\uC694");
  worldSadBtn.innerHTML = WORLD_SAD_BUTTON_EMOJI;
  document.body.appendChild(worldSadBtn);

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

  playerChatBubbleEl = document.createElement("div");
  playerChatBubbleEl.id = "player-chat-bubble";
  playerChatBubbleEl.className = "world-player-chat-bubble world-local-chat-bubble";
  playerChatBubbleEl.style.display = "none";
  document.body.appendChild(playerChatBubbleEl);

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
      "\uD29C\uD1A0\uB9AC\uC5BC: \uB2E4\uB978 \uD50C\uB808\uC774\uC5B4/\uC138\uC0C1 \uBE44\uACF5\uC720 \u00B7 \uBA40\uD2F0 \uBBF8\uC5F0\uACB0"
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
    .on("broadcast", { event: "world_bag_drop" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteWorldBagDropBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_bag_drop_pickup" }, function (payload) {
      if (channel !== multiplayerChannel) return;
      handleRemoteWorldBagDropPickupBroadcast(payload.payload || {});
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
        sendPendingPreviousSessionLeaveBroadcast();
        setTimeout(function () {
          if (channel !== multiplayerChannel) return;
          sendMultiplayerPresence(true);
          pruneDuplicateRemotePlayerSessions(remotePlayers, removeRemotePlayer);
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
      : craftFurnitureInstallingKind
        ? getCraftFurnitureInstallPresenceAction(craftFurnitureInstallingKind) || "state"
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
    sittingChairId: playerSittingChairId ? String(playerSittingChairId) : "",
    insideCraftHouseId: playerInsideCraftHouseId ? String(playerInsideCraftHouseId) : "",
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
    state.sittingChairId || "",
    state.insideCraftHouseId || "",
    Math.round(state.waterSplashAt || 0)
  ].join("|");
  const hasChanged = stateKey !== lastPresenceStateKey;
  const broadcastMinMs =
    jumpY < -REMOTE_PLAYER_AIRBORNE_JUMP_Y || !isOnGround
      ? REMOTE_PLAYER_JUMP_BROADCAST_MIN_MS
      : getMultiplayerBroadcastMinMs();

  // Broadcast is the primary multiplayer sync path. Keep a heartbeat so idle
  // players stay visible even when they are not moving.
  if (
    multiplayerChannel &&
    (
      forceSend ||
      (hasChanged && now - lastBroadcastAt >= broadcastMinMs) ||
      now - lastHeartbeatBroadcastAt >= getMultiplayerHeartbeatMs()
    )
  ) {
    Promise.resolve(multiplayerChannel.send({
      type: "broadcast",
      event: "player_state",
      payload: state
    })).catch(function (error) {
      addNetworkDebugLog(
        "broadcast error: " + (error && error.message ? error.message : "??? ?? ?? ??")
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

  const mainBucket = getMainBucketGroundState();
  const holdingBucket = heldItem === HELD_ITEM_BUCKET;
  const payload = {
    id: currentSessionId,
    held: holdingBucket,
    heldMain: isHoldingMainBucket(),
    heldBucketId: holdingBucket ? String(heldBucketId || MAIN_BUCKET_ID) : "",
    x: mainBucket.x,
    y: mainBucket.y,
    isFull: holdingBucket ? Boolean(isBucketFull) : mainBucket.isFull,
    mainIsFull: mainBucket.isFull,
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
  // ??? ???????? ??? ???? ???? ??? ??????????? ?????? ???????? ?????? ??? ??? ??????????.
  if (isHoldingMainBucket()) {
    return;
  }
  const remoteId = String(payload.id);
  const nextUpdatedAt = Number(payload.updatedAt || 0);
  const prevUpdatedAt = Number(remoteBucketUpdateAtById[remoteId] || 0);
  if (nextUpdatedAt < prevUpdatedAt) return;
  remoteBucketUpdateAtById[remoteId] = nextUpdatedAt;

  const held = payload.held === true;
  const heldMain =
    held &&
    (payload.heldMain === undefined || payload.heldMain === null || Boolean(payload.heldMain));

  if (held && heldMain) {
    window.OVC_SHARED_BUCKET_HELD_BY = remoteId;
    delete remotePlayerHeldBucketById[remoteId];
    applyRemoteSharedMainBucketHeldPose(payload.x, payload.y, payload.isFull);
    markWorldDirty();
    addBucketTrace(
      "recv",
      "from=" + remoteId + " held=main x=" + Math.round(bucketX || 0) + " y=" + Math.round(bucketY || 0) + " t=" + nextUpdatedAt,
      350
    );
    return;
  }

  if (held && !heldMain) {
    if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
      window.OVC_SHARED_BUCKET_HELD_BY = "";
    }
    remotePlayerHeldBucketById[remoteId] = {
      isFull: Boolean(payload.isFull),
      bucketId: String(payload.heldBucketId || "")
    };
    const mainFull =
      payload.mainIsFull !== undefined && payload.mainIsFull !== null
        ? Boolean(payload.mainIsFull)
        : null;
    if (isHoldingExtraBucket()) {
      applyRemoteSharedMainBucketGround(
        payload.x,
        payload.y,
        mainFull !== null ? mainFull : heldExtraBucketMainIsFull
      );
    } else if (!isHoldingMainBucket() && !String(window.OVC_SHARED_BUCKET_HELD_BY || "")) {
      applyRemoteSharedMainBucketGround(
        payload.x,
        payload.y,
        mainFull !== null ? mainFull : false
      );
    }
    markWorldDirty();
    addBucketTrace(
      "recv",
      "from=" + remoteId + " held=extra id=" + remotePlayerHeldBucketById[remoteId].bucketId + " t=" + nextUpdatedAt,
      350
    );
    return;
  }

  delete remotePlayerHeldBucketById[remoteId];
  if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
    window.OVC_SHARED_BUCKET_HELD_BY = "";
  }
  const resolvedMainFull =
    payload.mainIsFull !== undefined && payload.mainIsFull !== null
      ? Boolean(payload.mainIsFull)
      : Boolean(payload.isFull);
  applyRemoteSharedMainBucketGround(payload.x, payload.y, resolvedMainFull);
  markWorldDirty();
  addBucketTrace(
    "recv",
    "from=" + remoteId + " held=false x=" + Math.round(bucketX || 0) + " y=" + Math.round(bucketY || 0) + " t=" + nextUpdatedAt,
    350
  );
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
      "presence db save error: " + (error && error.message ? error.message : "??? ?? ?? ??")
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
    const freshestPresenceByIdentity = Object.create(null);
    (players || []).forEach(function (state) {
      if (!state || !state.id || state.id === currentSessionId) return;
      // DB ??? ???(now)?????????presence.updatedAt??????? ???? ???????
      // ???? ????? ?????????? ????????? ????(????????now????????? ???????"????? ????").
      const presenceSeenAt = Number(state.updatedAt) || 0;
      if (!presenceSeenAt || now - presenceSeenAt > 70000) return;
      multiplayerRoomSessionIdsLastSeen[String(state.id)] = presenceSeenAt;
      multiplayerRoomSessionButterflyActive[String(state.id)] =
        state.butterflyActive !== false;
      if (isRemotePresenceSameLoggedInAccount(state)) {
        maybeApplyRemoteWaterSplashFromBroadcast(String(state.id), state);
        return;
      }
      const identityKey = getRemotePlayerIdentityKey(state);
      const prev = freshestPresenceByIdentity[identityKey];
      if (!prev || presenceSeenAt >= prev.presenceSeenAt) {
        freshestPresenceByIdentity[identityKey] = {
          state: state,
          presenceSeenAt: presenceSeenAt
        };
      }
    });
    Object.keys(freshestPresenceByIdentity).forEach(function (identityKey) {
      const entry = freshestPresenceByIdentity[identityKey];
      const state = entry && entry.state;
      if (!state || !state.id) return;
      idsInDb[String(state.id)] = true;
      renderRemotePlayerState(state, "poll");
    });
    Object.keys(remotePlayers).forEach(function (remoteId) {
      if (idsInDb[remoteId]) return;
      const remotePlayer = remotePlayers[remoteId];
      // Realtime broadcast can be ahead of ovc_presence upsert; don't despawn on a stale DB row.
      if (
        remotePlayer &&
        remotePlayer.lastSeenAt &&
        now - remotePlayer.lastSeenAt < 45000
      ) {
        return;
      }
      removeRemotePlayer(remoteId);
    });
    updateRemotePlayerCount();
  }).catch(function (error) {
    addNetworkDebugLog(
      "presence db poll error: " + (error && error.message ? error.message : "??? ?? ?? ??")
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
    multiplayerRoomSessionIdsLastSeen[String(latestPresence.id)] = Date.now();
    multiplayerRoomSessionButterflyActive[String(latestPresence.id)] =
      latestPresence.butterflyActive !== false;
    if (isRemotePresenceSameLoggedInAccount(latestPresence)) {
      return;
    }

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
  const nextSittingChairId = String(state.sittingChairId || "");
  const seatedChair = nextSittingChairId ? getCraftChairById(nextSittingChairId) : null;
  const isRemoteSittingOnChair = Boolean(seatedChair);
  let nextX = Number(state.x) || 0;
  let nextBaseY = -(Number(state.depth) || 0);
  let nextJumpY = Number(state.jumpY) || 0;
  if (isRemoteSittingOnChair) {
    const sitPose = getCraftChairSitPose(seatedChair, PLAYER_SIT_WIDTH, PLAYER_SIT_HEIGHT);
    if (sitPose) {
      nextX = sitPose.playerX;
      nextBaseY = -(GROUND_WORLD_HEIGHT - sitPose.footY);
      nextJumpY = 0;
    }
  }
  const nextPositionKey =
    Math.round(nextX * 10) +
    "|" +
    Math.round(nextBaseY * 10) +
    "|" +
    Math.round(nextJumpY * 10);
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
  remotePlayer.sittingChairId = isRemoteSittingOnChair ? nextSittingChairId : "";
  const nextInsideCraftHouseId = String(state.insideCraftHouseId || "");
  const insideHouse = Boolean(nextInsideCraftHouseId && getCraftHouseById(nextInsideCraftHouseId));
  remotePlayer.insideCraftHouseId = insideHouse ? nextInsideCraftHouseId : "";
  syncRemotePlayerPoseVisual(remotePlayer, remoteColor);
  remotePlayer.element.classList.toggle("needs-outline", needsDarkOutline(remoteColor));
  setRemotePlayerMoveTarget(remotePlayer, nextX, nextBaseY, nextPositionKey, nextJumpY);
  remotePlayer.worldX = nextX;
  remotePlayer.worldY = nextBaseY + nextJumpY;
  remotePlayer.depth = Number(state.depth) || 0;
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
  pruneDuplicateRemotePlayerSessions(remotePlayers, removeRemotePlayer);
}

function getRemotePlayerBaseWorldY(remotePlayer) {
  if (!remotePlayer) return 0;
  const renderBaseY = Number(remotePlayer.renderBaseY);
  if (Number.isFinite(renderBaseY)) return renderBaseY;
  const targetBaseY = Number(remotePlayer.targetBaseY);
  if (Number.isFinite(targetBaseY)) return targetBaseY;
  return -(Number(remotePlayer.depth) || 0);
}

function getRemotePlayerRenderJumpY(remotePlayer) {
  if (!remotePlayer) return 0;
  const renderJumpY = Number(remotePlayer.renderJumpY);
  if (Number.isFinite(renderJumpY)) return renderJumpY;
  return Number(remotePlayer.targetJumpY ?? remotePlayer.jumpY) || 0;
}

function getRemotePlayerWorldY(remotePlayer) {
  return getRemotePlayerBaseWorldY(remotePlayer) + getRemotePlayerRenderJumpY(remotePlayer);
}

function applyRemotePlayerWorldPosition(remotePlayer) {
  if (!remotePlayer || !remotePlayer.element) return;
  const x = Number(remotePlayer.renderX ?? remotePlayer.targetX) || 0;
  const y = getRemotePlayerWorldY(remotePlayer);
  remotePlayer.element.classList.toggle(
    "is-airborne",
    getRemotePlayerRenderJumpY(remotePlayer) < -REMOTE_PLAYER_AIRBORNE_JUMP_Y
  );
  setWorldPosition(remotePlayer.element, x, y);
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
    renderX: 0,
    renderBaseY: 0,
    targetX: 0,
    targetBaseY: 0,
    targetJumpY: 0,
    renderJumpY: 0,
    hasRenderPosition: false,
    lastSmoothAt: 0,
    appliedTintColor: "",
    worldX: 0,
    worldY: 0,
    depth: 0,
    jumpY: 0,
    lastStateVersion: 0,
    lastStateSourceRank: 0,
    lastWaterSplashAt: 0,
    lastActionAt: 0,
    lastShownAction: "",
    lastSeenAt: Date.now(),
    sittingChairId: "",
    insideCraftHouseId: "",
    appliedSitTintKey: ""
  };
  return remotePlayers[remoteId];
}

function setRemotePlayerMoveTarget(remotePlayer, x, baseY, positionKey, jumpOffsetY) {
  const nextX = Number(x) || 0;
  const nextBaseY = Number(baseY) || 0;
  const nextJumpY =
    jumpOffsetY != null && Number.isFinite(Number(jumpOffsetY))
      ? Number(jumpOffsetY)
      : Number(remotePlayer.targetJumpY ?? remotePlayer.jumpY) || 0;
  remotePlayer.targetX = nextX;
  remotePlayer.targetBaseY = nextBaseY;
  remotePlayer.targetJumpY = nextJumpY;
  remotePlayer.jumpY = nextJumpY;
  remotePlayer.positionKey =
    positionKey ||
    Math.round(nextX * 10) +
      "|" +
      Math.round(nextBaseY * 10) +
      "|" +
      Math.round(nextJumpY * 10);

  if (!remotePlayer.hasRenderPosition) {
    remotePlayer.renderX = nextX;
    remotePlayer.renderBaseY = nextBaseY;
    remotePlayer.renderJumpY = nextJumpY;
    remotePlayer.hasRenderPosition = true;
    remotePlayer.lastSmoothAt = performance.now();
    applyRemotePlayerWorldPosition(remotePlayer);
  }
}

function setRemotePlayerVisualPosition(remotePlayer, x, baseY, jumpOffsetY) {
  const nextX = Number(x) || 0;
  const nextBaseY = Number(baseY) || 0;
  const nextJumpY = Number(jumpOffsetY) || 0;
  remotePlayer.renderX = nextX;
  remotePlayer.renderBaseY = nextBaseY;
  remotePlayer.renderJumpY = nextJumpY;
  remotePlayer.targetX = nextX;
  remotePlayer.targetBaseY = nextBaseY;
  remotePlayer.targetJumpY = nextJumpY;
  remotePlayer.jumpY = nextJumpY;
  remotePlayer.hasRenderPosition = true;
  remotePlayer.lastSmoothAt = performance.now();
  remotePlayer.positionKey =
    Math.round(nextX * 10) +
    "|" +
    Math.round(nextBaseY * 10) +
    "|" +
    Math.round(nextJumpY * 10);
  applyRemotePlayerWorldPosition(remotePlayer);
}

function updateRemotePlayerSmoothing() {
  const now = performance.now();
  Object.keys(remotePlayers).forEach(function (remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.element || !remotePlayer.hasRenderPosition) return;

    const targetX = Number(remotePlayer.targetX) || 0;
    const targetBaseY = Number(remotePlayer.targetBaseY) || 0;
    const targetJumpY = Number(remotePlayer.targetJumpY ?? remotePlayer.jumpY) || 0;
    const currentX = Number(remotePlayer.renderX) || 0;
    const currentBaseY = Number(remotePlayer.renderBaseY) || 0;
    const currentJumpY = Number(remotePlayer.renderJumpY);
    const safeCurrentJumpY = Number.isFinite(currentJumpY)
      ? currentJumpY
      : targetJumpY;
    const dx = targetX - currentX;
    const dy = targetBaseY - currentBaseY;
    const jumpDy = targetJumpY - safeCurrentJumpY;
    const distance = Math.hypot(dx, dy);
    const lastSmoothAt = Number(remotePlayer.lastSmoothAt || now);
    const dt = Math.min(50, Math.max(0, now - lastSmoothAt));
    let positionChanged = false;

    if (distance <= REMOTE_PLAYER_SNAP_EPSILON) {
      if (currentX !== targetX || currentBaseY !== targetBaseY) {
        remotePlayer.renderX = targetX;
        remotePlayer.renderBaseY = targetBaseY;
        positionChanged = true;
      }
    } else if (distance >= REMOTE_PLAYER_SNAP_DISTANCE) {
      remotePlayer.renderX = targetX;
      remotePlayer.renderBaseY = targetBaseY;
      positionChanged = true;
    } else if (distance > 0) {
      const alpha = 1 - Math.exp(-dt / REMOTE_PLAYER_SMOOTHING_MS);
      remotePlayer.renderX = currentX + dx * alpha;
      remotePlayer.renderBaseY = currentBaseY + dy * alpha;
      positionChanged = true;
    }

    let jumpChanged = false;
    if (Math.abs(jumpDy) <= REMOTE_PLAYER_SNAP_EPSILON) {
      if (safeCurrentJumpY !== targetJumpY) {
        remotePlayer.renderJumpY = targetJumpY;
        jumpChanged = true;
      }
    } else if (Math.abs(jumpDy) >= REMOTE_PLAYER_JUMP_SNAP_DISTANCE) {
      remotePlayer.renderJumpY = targetJumpY;
      jumpChanged = true;
    } else {
      const jumpAlpha = 1 - Math.exp(-dt / REMOTE_PLAYER_JUMP_SMOOTHING_MS);
      remotePlayer.renderJumpY = safeCurrentJumpY + jumpDy * jumpAlpha;
      jumpChanged = true;
    }

    if (positionChanged || jumpChanged) {
      remotePlayer.lastSmoothAt = now;
      applyRemotePlayerWorldPosition(remotePlayer);
    }
  });
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
  pruneDuplicateRemotePlayerSessions(remotePlayers, removeRemotePlayer);
  const seenUsers = Object.create(null);
  remotePlayerCount = Object.keys(remotePlayers).reduce(function (count, remoteId) {
    const remotePlayer = remotePlayers[remoteId];
    if (!remotePlayer) return count;
    const userKey = getRemotePlayerIdentityKey({
      userId: remotePlayer.userId,
      name: remotePlayer.name,
      id: remoteId
    });
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
    multiplayerStatusText === "\uC5F0\uACB0\uB428" ||
    multiplayerStatusText === "\uC5F0\uACB0\uC911" ||
    multiplayerStatusText === "\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804" ||
    multiplayerStatusText === "\uCD08\uAE30\uD654 \uC911" ||
    (typeof multiplayerStatusText === "string" &&
      multiplayerStatusText.indexOf("\uD29C\uD1A0\uB9AC\uC5BC") !== -1)
      ? multiplayerStatusText
      : "\uC5F0\uACB0 \uC548\uB428";
  multiplayerStatus.textContent =
    "\uBA40\uD2F0 " + statusLabel + " / \uB85C\uADF8\uC778 " + getOnlinePlayerCount();
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
      "?? ?? ??: " +
        (error && error.message ? error.message : "??? ?? ?? ??")
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
      "?? ?? ??: " +
      (error && error.message ? error.message : "??? ?? ?? ??")
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
  setSettingsOverlayOpen(settingsOverlay, false);
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
      const storedToken = getEffectiveOvcSessionToken();
      if (!storedToken) {
        // Token may be temporarily missing (e.g. migration/fallback path).
        // Only force logout when the account itself no longer exists.
        if (typeof window.OVCOnline.getAccount === "function") {
          const account = await window.OVCOnline.getAccount(currentUserId);
          if (!account) {
            showOnlineDebugMessage("??? ?????. ???????.");
            setTimeout(logout, 800);
            return;
          }
        }
        return;
      }
      const isValid = await window.OVCOnline.validateSession(currentUserId, storedToken);
      if (!isValid) {
        showOnlineDebugMessage("?? ???? ????? ???????.");
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
    try {
      sessionStorage.removeItem(ovcSessionUserIdKey);
      sessionStorage.removeItem(ovcSessionUserNameKey);
      sessionStorage.removeItem(ovcSessionTokenKey);
    } catch (eSessOut) {}
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
  migrateLegacyMixedMagicPowderIntoBase();
}

function loadRockInventoryCount() {
  const raw = Number(getStoredValue(rockInventoryCountKey) || 0);
  rockInventoryCount = Math.max(0, Math.floor(raw));
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

function saveRockInventoryCount() {
  setStoredValue(rockInventoryCountKey, String(Math.max(0, Math.floor(rockInventoryCount))));
}

function loadCraftFurnitureCounts() {
  try {
    const raw = getStoredValue(craftFurnitureCountsKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    craftFurnitureCounts.craftDesk = Math.max(0, Math.floor(Number(parsed.craftDesk) || 0));
    craftFurnitureCounts.craftFence = Math.max(0, Math.floor(Number(parsed.craftFence) || 0));
    craftFurnitureCounts.craftChair = Math.max(0, Math.floor(Number(parsed.craftChair) || 0));
    craftFurnitureCounts.craftHouse = Math.max(0, Math.floor(Number(parsed.craftHouse) || 0));
  } catch (e) {}
}

function saveCraftFurnitureCounts() {
  setStoredValue(
    craftFurnitureCountsKey,
    JSON.stringify({
      craftDesk: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftDesk) || 0)),
      craftFence: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftFence) || 0)),
      craftChair: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftChair) || 0)),
      craftHouse: Math.max(0, Math.floor(Number(craftFurnitureCounts.craftHouse) || 0))
    })
  );
}

function loadColoredMagicPowderCounts() {
  try {
    const raw = getStoredValue(coloredMagicPowderCountsKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    coloredMagicPowderCounts.yellow = Math.max(0, Math.floor(Number(parsed.yellow) || 0));
    coloredMagicPowderCounts.white = Math.max(0, Math.floor(Number(parsed.white) || 0));
    coloredMagicPowderCounts.brown = Math.max(0, Math.floor(Number(parsed.brown) || 0));
    coloredMagicPowderCounts.mixed = Math.max(0, Math.floor(Number(parsed.mixed) || 0));
  } catch (e) {}
  migrateLegacyMixedMagicPowderIntoBase();
}

function saveColoredMagicPowderCounts() {
  setStoredValue(
    coloredMagicPowderCountsKey,
    JSON.stringify({
      yellow: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.yellow) || 0)),
      white: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.white) || 0)),
      brown: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.brown) || 0)),
      mixed: Math.max(0, Math.floor(Number(coloredMagicPowderCounts.mixed) || 0))
    })
  );
}

function getTotalCaughtButterflies() {
  return butterflyColors.reduce(function (total, color) {
    return total + Math.max(0, Number(butterflyState.caughtCounts[color]) || 0);
  }, 0);
}

function pickRandomButterflyColor() {
  return butterflyMotion.pickColor();
}

function pickRandomButterflySpawnPoint() {
  return butterflyMotion.pickSpawnPoint();
}

function createButterfly(now, options) {
  return butterflyMotion.create(now, options);
}

/** ????????????? id?? ???????????? ?? */
function dedupeButterfliesByIdStable(list) {
  return butterflyMotion.dedupe(list);
}

/** ???? ?????(butterflyMaxAlive) ??? ??????????????????? */
function trimButterflyListToMaxCap(list) {
  return butterflyMotion.trim(list);
}

function pruneButterflyAuthorityWaypointsToList() {
  butterflyMotion.pruneWaypoints(butterflyState.list, butterflyAuthorityWaypointById);
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

function clearMultiplayerRoomSessionTracking() {
  multiplayerRoomSessionIdsLastSeen = Object.create(null);
  multiplayerRoomSessionButterflyActive = Object.create(null);
  multiplayerRoomSessionButterflyStateLastSeen = Object.create(null);
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

function hasFreshButterflyAuthorityBroadcast(now) {
  const freshMs = Math.max(400, butterflyBroadcastMs * 6);
  let found = false;
  Object.keys(multiplayerRoomSessionButterflyStateLastSeen).forEach(function (sid) {
    const at = Number(multiplayerRoomSessionButterflyStateLastSeen[sid]) || 0;
    if (at && now - at <= freshMs) found = true;
  });
  return found;
}

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

/** ????? ????? ???? ????. ????? ???????? ???????? ???(???? presence?????? ????? ????. */
function shouldRunButterflyMotionSimulation(now, onlineAvailable) {
  if (!onlineAvailable) return true;
  if (isButterflyAuthority()) return true;
  return !hasFreshButterflyAuthorityBroadcast(now);
}

function getNumericButterflyValue(value, fallback) {
  return getNumericButterflyValueCore(value, fallback);
}

function ensureButterflyWaypoint(butterfly, now) {
  return butterflyMotion.ensureWaypoint(butterfly, now, butterflyAuthorityWaypointById);
/*
  let waypoint = butterflyAuthorityWaypointById[butterfly.id];
  if (!waypoint || now >= waypoint.endAt) {
    const target = pickButterflyWaypoint(butterfly.x, butterfly.y);
    const dx = target.x - butterfly.x;
    const dy = target.y - butterfly.y;
    const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    // Pixels-per-frame to ms @ ~60fps. ??? ??????? 2.4s????????? ??? ????????? ???? ?????????? ???? ???? + ??? ?????.
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

function simulateButterflyAuthorityStep(butterfly, now) {
  butterflyMotion.simulate(butterfly, now, butterflyAuthorityWaypointById);
}

function authoritySpawnButterfliesIfNeeded(now) {
  if (butterflyState.list.length >= butterflyMaxAlive) return false;
  if (!butterflyState.lastSpawnAt) {
    // ???? ?????????????? ??????????? cap?? ??. ?? ????? ?????
    // lastSpawnAt??0???(????????????????) ?????5????????????? ????? ?????????? ??????
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
    lastMotionX: null,
    facingMomentumX: 0
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

/** ????????(cx, cy) ?? ????????? */
function getButterflyCatchDistanceAtWorldCenter(cx, cy) {
  return getCenterDistance(
    cx - BUTTERFLY_SIZE / 2,
    cy - BUTTERFLY_SIZE / 2,
    BUTTERFLY_SIZE,
    BUTTERFLY_SIZE
  );
}

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
  const now = getSynchronizedNow();
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
  if (nextAt <= now - 250) {
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
  syncWorldLoosePickupLock(now);
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
  const remote = remotePlayers[payload.from];
  if (remote && remote.statusElement) {
    remote.statusElement.textContent = "\uB098\uBE44 catch";
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

function tryCatchButterfly() {
  if (isPlayerGameplayBlockedByNpcDialogue()) return false;
  if (isOnboardingLinearGateActive() && onboardingFlowStep < ONBOARDING_STEP_BUTTERFLY) {
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
  showPlayerAlert({
    message: "\uB098\uBE44 catch",
    durationMs: 2400,
    butterflyCatch: true
  });
  sendMultiplayerPresence(true);
  updateBagInventorySlots();
  if (!getStoredFlag(onboardingFlowDoneKey) && onboardingFlowStep === ONBOARDING_STEP_BUTTERFLY) {
    setStoredFlag(tradeMasterDialogueCompleteKey, false);
    hydrateTradeMasterDialogueComplete(false);
    onboardingFlowStep = ONBOARDING_STEP_TRADE_MASTER;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
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
  // ???? ???? ?????? ????? ????????????????? sessionId)???????. ??????????
  // ??? ????????????? ????2?????????????????
  if (sharedHydrated && butterflyState.list.length > 0) {
    const runAuthorityButterflyMotion = shouldRunButterflyMotionSimulation(now, onlineAvailable);
    if (runAuthorityButterflyMotion) {
      const motionStepCount =
        wallDelta > 48 ? Math.min(24, Math.max(1, Math.round(wallDelta / 16))) : 1;
      const motionStartNow = motionStepCount > 1 ? now - wallDelta : now;
      for (let motionStep = 0; motionStep < motionStepCount; motionStep += 1) {
        const stepNow =
          motionStepCount > 1
            ? Math.round(motionStartNow + (wallDelta * (motionStep + 1)) / motionStepCount)
            : now;
        butterflyState.list.forEach(function (butterfly) {
          simulateButterflyAuthorityStep(butterfly, stepNow);
        });
      }
      if (onlineAvailable && now - lastButterflyBroadcastAt >= butterflyBroadcastMs) {
        broadcastButterflyState(now);
      }
    }
  }
  // ?????? ????????? butterfly.x/y(??????????? ????+???????????????????????
  const smoothRemoteButterflies =
    sharedHydrated && onlineAvailable && !isButterflyAuthority();
  /** ????????????? ???????(?? dt?????????????? ???. */
  const butterflyRemoteLerpAlpha = (function () {
    const dt = Math.max(1, wallDelta);
    const a = 1 - Math.exp(-dt / 118);
    return Math.min(0.34, Math.max(0.08, a));
  })();
  /** ???????????????(?????? ?? ?????????? ?????). */
  const butterflyRemoteRenderMaxStepWorld = wallDelta > 120 ? 160 : 120;

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

  // Render (??? ?????? ?????????? `_catchProbe*`?? ??? ???????????????????????)
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
      const t = butterflyRemoteLerpAlpha;
      let nx = butterfly._renderX + rdx * t;
      let ny = butterfly._renderY + rdy * t;
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
      // ????? ??????????? ?? ??????? ??????? ???????????????
      // ???????????????????????????????? ????????????????(???????? ?????.
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
  if (!isTabSessionSuperseded) {
    syncLocalPlayerVisibility();
    gameLoopCyclesForTutorialSync += 1;
    if (gameLoopCyclesForTutorialSync >= 420) {
      gameLoopCyclesForTutorialSync = 0;
      requestAccountTutorialDoneSync();
    }
    respawnApplesIfNeeded();
    tickWorldRockRespawn(Date.now());
    tickWorldBagDropDespawn(Date.now());
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
    tickPlayerHealth(Date.now());
    updatePlayerHealthUi();
    updateSeedCard();
    refreshPlantIdentityOrdinals();
    updatePlantState();
    updateNpcPosition();
    updateAlchemyCraftEffects(Date.now());
    updateGuideCard();
    updatePlantProgressGauge();
    updateOnboardingFlowUI();
    pruneStaleRemotePlayers();
    updatePlayerAlert();
    updateButterflies();
    updateMagicPowderInventoryUi();
    updateCamera();
    updatePlayerName();
    updateRemotePlayerSmoothing();
    updateWorldSocialOverlaysInGameLoop();
    sendMultiplayerPresence(false);
    savePlayerPosition(false);
  }
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
  setWorldPosition(localPlayerRoot, playerX, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updateCamera();
  savePlayerPosition(true);
}

function setup() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const wellSize = getWellSize();

  setWorldSize(localPlayerRoot, getLocalPlayerBodyWidth(), playerSittingChairId ? getLocalPlayerBodyHeight() : undefined);
  setWorldSize(playerColorBody, getLocalPlayerBodyWidth(), getLocalPlayerBodyHeight());
  if (playerSittingChairId || (player && player.classList.contains("is-sitting"))) {
    syncLocalPlayerPoseVisual();
  }
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
  setWorldSize(playerBucketOverlay, BUCKET_SIZE);
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

(async function ovcRunBootstrap() {
try {
  if (currentUserId) {
    ovcApplyForceWorldHubBypassLoggedIn();
    repairOnboardingCompletionFromStoredStep();
    restoreWorldHubIfVeteranWithoutActiveReplay();
    await syncTutorialDoneFromServerIfNeeded();
    if (getStoredFlag(onboardingFlowDoneKey)) {
      setStoredFlag(everBeenToWorldKey, true);
    }
  }
  setup();
  if (currentUserId) {
    ovcApplyForceWorldHubBypassLoggedIn();
    if (getStoredFlag(onboardingFlowDoneKey)) {
      setStoredFlag(everBeenToWorldKey, true);
    }
  }
  let ovcAbortedPageInit = false;
  if (
    isTutorialDocumentEntry() &&
    currentUserId &&
    getStoredFlag(onboardingFlowDoneKey) &&
    !ovcTutorialIntentionalEntryActive()
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
    loadPlayerHealth();
    loadButterflyCaughtCounts();
    loadMagicPowderCount();
    loadRockInventoryCount();
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
    if (isWorldServerSyncAvailable() && !isSharedWorldSyncPausedForTutorial()) {
      showAppLoadingScreen("\uC6D4\uB4DC \uBD88\uB7EC\uC624\uB294 \uC911...", { force: true });
      pollWorldState(true);
    } else {
      hasHydratedSharedWorldFromServer = true;
    }
    openCharacterSelectIfNeeded();
    }
  }
  ovcBootstrapFinished = true;
  finishDevWorldResetBoot(resetGameForTesting, isWorldDocumentEntry);
  window.__OVC_BOOT_FINISHED__ = true;
  ovcTryDismissLoadingScreen(false);
} catch (initError) {
  console.error("[OVC] \uAC8C\uC784 \uCD08\uAE30\uD654 \uC624\uB958:", initError);
  ovcBootstrapFinished = true;
  finishDevWorldResetBoot(resetGameForTesting, isWorldDocumentEntry);
  window.__OVC_BOOT_FINISHED__ = true;
  ovcTryDismissLoadingScreen(true);
}
})();
setTimeout(function () {
  if (!isTabSessionSuperseded) {
    if (!hasHydratedSharedWorldFromServer && isWorldServerSyncAvailable()) {
      pollWorldState(true);
    }
  }
  ovcTryDismissLoadingScreen(false);
}, 40);
setTimeout(function () {
  ovcTryDismissLoadingScreen(true);
}, 12000);
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
  ovcTryDismissLoadingScreen(false);
});
gameLoop();
