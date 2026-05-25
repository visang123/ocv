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
  SECOND_MS,
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
import {
  initGameState,
  getPlayer,
  getPlant,
  getApple,
  getWell,
  getWorldItems,
  getInventory,
  getSeedWorld,
  getNpc,
  getCamera,
  getOnboarding,
  resetPlantRuntimeFields,
  resetInventoryRuntimeFields,
  createRemotePlayerStateStore
} from "./src/game/state.js";
import { createPlayerPositionNetwork } from "./src/multiplayer/playerNetwork.js";
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
import { createGameLoop, attachCoreRuntimeTimers } from "./src/script/core-main.js";
import { initScriptNetwork } from "./src/script/network/index.js?v=20260525i";
import { initScriptSystems } from "./src/script/systems/index.js?v=20260525i";
import { initScriptView } from "./src/script/view/index.js?v=20260525i";
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
  bootDevReset,
  finishDevResetBoot,
  markPendingDevWorldReset,
  markPendingDevTutorialReset
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

/** Network/Systems/View layer handles — top-level so early module code does not hit TDZ */
let _networkApi = null;
let _layerDeps = null;
let _systemsApi = null;
let _viewApi = null;

initGameState({ playerX: 100 });

let onboardingEscHintTimerId = null;
let playerAlertHideTimerId = null;
/** 물주기 축하(16단계) 시작 시각 — setTimeout 대신 게임 루프에서 진행 */
const ONBOARDING_WATER_DONE_CONGRATS_PHASE1_MS = 1500;
const ONBOARDING_WATER_DONE_CONGRATS_END_MS = 3500;
const ONBOARDING_BOOK_INSERT_MIGRATE_KEY = "ovcOnboardingBookStepsInsertV1";
const ONBOARDING_STEP_GO_BOOK = 7;
const ONBOARDING_STEP_PICK_BOOK = 8;
const ONBOARDING_STEP_BOOK_INV = 9;
const ONBOARDING_STEP_PLANT = 10;
const ONBOARDING_STEP_PLANT_MASTER = 11;
const ONBOARDING_STEP_PLANT_MASTER_TALK = 12;
const ONBOARDING_STEP_NPC_GUIDE = 13;
/** NPC 안내창: 「설명을 참고하세요」 표시 후 닫기 안내까지(ms) */
const ONBOARDING_NPC_GUIDE_CLOSE_HINT_MS = 3000;
/** 식물지수 안내 대기: 첫 새싹 표시·3단계까지(튜토리얼 전용 단축) */
const ONBOARDING_PLANT_INDEX_FIRST_SPROUT_MS = 2 * SECOND_MS;
const ONBOARDING_PLANT_INDEX_SPROUT_STAGE3_MS = 3 * SECOND_MS;
const ONBOARDING_STEP_WELL = 14;
const ONBOARDING_STEP_BUCKET_PICK = 15;
const ONBOARDING_STEP_BUCKET_FILL = 16;
const ONBOARDING_STEP_WATER_APPROACH = 17;
const ONBOARDING_STEP_WATER_POUR = 18;
const ONBOARDING_STEP_WATER_DONE = 19;
const ONBOARDING_MAX_STEP = 37;
const ONBOARDING_STEP_PLANT_INDEX = 20;
const ONBOARDING_STEP_DROP_BUCKET = 21;
const ONBOARDING_STEP_CHAT = 22;
const ONBOARDING_STEP_HEART = 23;
const ONBOARDING_STEP_SAD = 24;
const ONBOARDING_STEP_ROCK = 25;
const ONBOARDING_STEP_BUTTERFLY = 26;
const ONBOARDING_STEP_TRADE_MASTER = 27;
const ONBOARDING_STEP_ALCHEMY_MASTER = 28;
const ONBOARDING_STEP_ZOOM_INTRO = 29;
const ONBOARDING_STEP_ZOOM_MIN = 30;
const ONBOARDING_STEP_TREE_APPROACH = 31;
const ONBOARDING_STEP_TREE_CLIMB = 32;
const ONBOARDING_STEP_PICK_APPLE = 33;
const ONBOARDING_STEP_EAT_APPLE = 34;
const ONBOARDING_STEP_EXTRA_SEED = 35;
const ONBOARDING_STEP_SETTINGS_ESC = 36;
const ONBOARDING_STEP_COMPLETE = 37;
const TUTORIAL_ONBOARDING_ROCK_ID = "tutorial-onboarding-rock-v1";
/** tutorial.html: ???? ????????? ??????????????????? ???????(ms) */
const TUTORIAL_MAIN_SEED_RESPAWN_MS = 5000;
const MAIN_BUCKET_ID = "main";
let lastPlantProximityBlockMessage = "";
let plantProximityWarnUntil = 0;
const PLANT_WATER_TOO_FAR_MESSAGE = "\uC2DD\uBB3C\uACFC \uAC70\uB9AC\uAC00 \uBA40\uC2B5\uB2C8\uB2E4.";
let plantMasterDialogueTimeoutIds = [];
let plantMasterDialogueGeneration = 0;
getSeedWorld().hasPickedMainSeedThisWindow =
  sessionStorage.getItem(storageKeyMainSeedPickedForRoom()) === "true";
let isInteractKeyLatched = false;
const guidePlaceholderHtml = "<p>아직 내용이 없습니다!</p>";
const guidePlantPageHtml = guidePages[1] ? guidePages[1].innerHTML : "";
let isSetupComplete = false;
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
  getOnboarding().flowStep = 0;
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
function readHasChosenPlayerColorFromStorage() {
  if (!currentUserId) return false;
  return (
    localStorage.getItem(currentUserScopedHasChosenColorKey) === "true" ||
    localStorage.getItem(currentUserHasChosenColorKey) === currentUserId
  );
}

let hasChosenPlayerColor = readHasChosenPlayerColorFromStorage();
const savedGlobalLoginColor = normalizeHexColor(localStorage.getItem(currentUserColorKey));
let selectedPlayerColor =
  savedUserScopedColor || savedGlobalLoginColor || "#ffffff";
if (currentUserId) {
  setStoragePrefix("ovc-user-" + currentUserId + ":");
  migrateUnscopedUserPickupFlagsToUserScope(currentUserId);
  getSeedWorld().hasHandledDryMainSeed = getStoredFlag(mainDrySeedHandledKey);
  getSeedWorld().isMainSeedAvailable = !hasPickedMainSeedInCurrentRoom();
  getSeedWorld().lastMainSeedStateChangeAt = Date.now();
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
  if (getSeedWorld().hasPickedMainSeedThisWindow) return true;
  try {
    if (sessionStorage.getItem(storageKeyMainSeedPickedForRoom()) === "true") {
      getSeedWorld().hasPickedMainSeedThisWindow = true;
      return true;
    }
  } catch (eSs) {}
  if (getStoredFlag(storageKeyMainSeedPickedForRoom())) {
    getSeedWorld().hasPickedMainSeedThisWindow = true;
    return true;
  }
  return false;
}

function setMainSeedPickedForCurrentRoom() {
  getSeedWorld().hasPickedMainSeedThisWindow = true;
  try {
    sessionStorage.setItem(storageKeyMainSeedPickedForRoom(), "true");
  } catch (eSs) {}
  setStoredFlag(storageKeyMainSeedPickedForRoom(), true);
}

function clearMainSeedPickedForCurrentRoom() {
  getSeedWorld().hasPickedMainSeedThisWindow = false;
  try {
    sessionStorage.removeItem(storageKeyMainSeedPickedForRoom());
  } catch (eRm) {}
  setStoredFlag(storageKeyMainSeedPickedForRoom(), false);
}

/** ?????????????? ??????????????????? ??? ????? ???(?????????? ???) */
function syncMainSeedPickedStateFromLoadedExtraSeeds() {
  var found = false;
  getApple().extraSeeds.forEach(function (s) {
    if (s.id !== "starter-seed" && !s.isStarter) return;
    if (s.inInventory || s.planted) found = true;
  });
  if (found) {
    setMainSeedPickedForCurrentRoom();
    getSeedWorld().isMainSeedAvailable = false;
    getSeedWorld().lastMainSeedStateChangeAt = Date.now();
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


function hasPickedWorldGuideBookOffGroundInCurrentRoom() {
  return roomKeyedPickupFlagTrueAnySlug(WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX);
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
    saveBagInventoryOrderCore(setStoredValue, bagInventoryItemOrder);
    changed = true;
  }
  return changed;
}

/** View layer init 전에 실행되므로 _viewApi 대신 bag-inventory 코어를 직접 호출 */
bagInventoryItemOrder = loadBagInventoryOrderCore(getStoredValue);
if (bagInventoryItemOrder.some(function (key) { return key === "book"; })) {
  bagInventoryItemOrder = bagInventoryItemOrder.filter(function (key) {
    return key !== "book";
  });
  saveBagInventoryOrderCore(setStoredValue, bagInventoryItemOrder);
}
if (bagInventoryItemOrder.length > BAG_INVENTORY_SLOT_COUNT) {
  bagInventoryItemOrder = bagInventoryItemOrder.slice(0, BAG_INVENTORY_SLOT_COUNT);
  saveBagInventoryOrderCore(setStoredValue, bagInventoryItemOrder);
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
    onboardingHookPlantIndexSproutToggle(nowCollapsed);
  });
}




function syncWorldGuideBookGroundVisibility() {
  if (!guideBook) return;
  guideBook.style.display = isWorldFloorGuideBookHiddenForCurrentView() ? "none" : "block";
}



function getPlantIndexPointsForSinglePlant(plant) {
  return getPlantIndexPointsForSinglePlantCore(plant, getPlantIndexScoringOptions());
}



/** ????????? ???????? ???? ??????????? ???? ??? ????? ??????????????????? */


/** ???????125+(???? ????? 2)????????E ?? ????? */

function isTradeMasterVisible() {
  if (
    isMainGameTutorialInProgress() &&
    getOnboarding().flowStep === ONBOARDING_STEP_TRADE_MASTER
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
    getOnboarding().flowStep === ONBOARDING_STEP_ALCHEMY_MASTER
  ) {
    return true;
  }
  if (!isWorldDocumentEntry()) return false;
  return (
    getPlantFogWorldStageFromScore(getTotalPlantIndexScore()) >= PLANT_FOG_ALCHEMY_MASTER_MIN_STAGE
  );
}


function syncWorldPlantFogVisuals() {
  const tutorialPlantIndexFog =
    isMainGameTutorialInProgress() &&
    getOnboarding().flowStep === ONBOARDING_STEP_PLANT_INDEX;
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









/** 튜토리얼 재시작 직후: sessionStorage만 남은 가방 숨김으로 가방·책을 자동 줍지 않음 */
function shouldSkipWorldBagAutoClaimHeal() {
  if (!isTutorialDocumentEntry()) return false;
  if (getStoredFlag(onboardingFlowDoneKey)) return false;
  return (
    !isWorldFloorBagClaimed(getStoredFlag) && !getStoredFlag(hasGuideBookKey)
  );
}

function syncWorldBagGroundVisibility() {
  syncWorldGuideBookGroundVisibility();
  if (worldBag) {
    if (
      isWorldFloorBagHiddenForCurrentView() &&
      !getWorldItems().hasGuideBook &&
      !shouldSkipWorldBagAutoClaimHeal()
    ) {
      getWorldItems().hasGuideBook = true;
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


function clearCraftFurnitureInstalling() {
  craftFurnitureInstallingKind = null;
  craftFurniturePendingPlacement = null;
  if (craftFurnitureInstallTimeoutId) {
    window.clearTimeout(craftFurnitureInstallTimeoutId);
    craftFurnitureInstallTimeoutId = 0;
  }
}

/** @type {{ yellow: number, white: number, brown: number, mixed: number }} */
let coloredMagicPowderCounts = { yellow: 0, white: 0, brown: 0, mixed: 0 };
/** ?????? ????: ????????????????? ??????????? ??? ????(????) */
let adminDebugPlantIndexBonus = 0;
let ignoreSnapshotInventorySeedsUntil = 0;
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
    return getWorldItems().hasGuideBook;
  },
  getOnboardingFlowStep: function () {
    return getOnboarding().flowStep;
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
      x: getPlayer().x,
      depth: getPlayer().depth,
      jumpY: getPlayer().jumpY
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
const remotePlayerStateStore = createRemotePlayerStateStore();
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
playerBaseImage.src = PLAYER_BASE_IMAGE_SRC;
playerSitBaseImage.src = PLAYER_SIT_IMAGE_SRC;

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
/** tickPlayerPosition에서 갱신; renderPlayerPosition이 호버 링 등 DOM 동기화에 사용 */
let playerPositionChangedThisTick = false;
let worldLooseSeedElement = null;

/** index ????? + ?????????: ????????? worldLooseSeed?seedCount ???? (src/game/groundSeed.js ??). */
function usesWorldLooseSeedMode() {
  return isWorldDocumentEntry() && getStoredFlag(onboardingFlowDoneKey);
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
    getApple().worldLooseSeed.nextSpawnAt
  );
}

function syncWorldLoosePickupLock() {
  if (!usesWorldLooseSeedMode()) return;
  ensureWorldLooseSeedShape();
  const now = getWorldLooseSeedClockNow();
  worldLoosePickupLockUntil = reconcileWorldLoosePickupLock(
    getApple().worldLooseSeed,
    worldLoosePickupLockUntil,
    now
  );
}

/** ????? ????? ????? ????: ??? id??????seedCount ??? */
function sanitizeWorldLooseModeExtraSeeds() {
  if (!usesWorldLooseSeedMode()) return false;
  let changed = false;
  const lenBeforeDedupe = getApple().extraSeeds.length;
  getApple().extraSeeds = dedupeExtraSeedsPreferInventory(getApple().extraSeeds);
  if (getApple().extraSeeds.length !== lenBeforeDedupe) {
    changed = true;
  }
  if (getApple().seedCount > 500) {
    getApple().seedCount = 500;
    changed = true;
  }
  return changed;
}

const defaultZoom = 3.5;
const maxZoom = 5;
const zoomStep = 0.25;
const spawnPortalWidth = SPAWN_PORTAL_WIDTH;
const spawnPortalHeight = SPAWN_PORTAL_HEIGHT;
const spawnPortalX = SPAWN_PORTAL_X;
const spawnPortalY = SPAWN_PORTAL_Y;
const spawnPlayerX = spawnPortalX + spawnPortalWidth / 2 - PLAYER_WIDTH / 2;
const spawnPlayerDepth = 0;
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
 * getNpc().y????????????????? ?????(????? y?? ??????? ??? ??.
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
  return countActiveRemotePlayers(remotePlayerStateStore.getPlayers(), Date.now());
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

const playerPositionNetwork = createPlayerPositionNetwork({
  stateStore: remotePlayerStateStore,
  getSessionId: function () {
    return currentSessionId;
  },
  getChannel: function () {
    return multiplayerChannel;
  },
  isSyncPaused: isSharedWorldSyncPausedForTutorial,
  isSameLoggedInAccount: isRemotePresenceSameLoggedInAccount,
  onSameAccountPresence: function (remoteId, state) {
    maybeApplyRemoteWaterSplashFromBroadcast(remoteId, state);
  },
  onRemoteLeave: function (remoteId) {
    delete remoteBucketUpdateAtById[remoteId];
    delete lastRemoteWaterSplashAppliedAtBySession[remoteId];
    removeRemotePlayer(remoteId);
  },
  onRemoteApplied: function (result) {
    syncRemotePlayerViewFromState(result.remoteId);
    pruneDuplicateRemotePlayerSessions(remotePlayers, removeRemotePlayer);
    updateRemotePlayerCount();
  },
  onRemoteRejected: function (result) {
    addSyncDebugLog(
      "remote_state_reject",
      {
        remoteId: result.remoteId,
        reason: "stale_or_lower_rank"
      },
      true
    );
  },
  getMultiplayerRoom: function () {
    return (
      (window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom) ||
      "ovc-main-room"
    );
  },
  getBroadcastMinMs: getMultiplayerBroadcastMinMs,
  getHeartbeatMs: getMultiplayerHeartbeatMs,
  getPresenceDbSyncMs: getMultiplayerPresenceDbSyncMs,
  getPresenceDbPollMs: getMultiplayerPresenceDbPollMs,
  getJumpBroadcastMinMs: function () {
    return REMOTE_PLAYER_JUMP_BROADCAST_MIN_MS;
  },
  airborneJumpThreshold: REMOTE_PLAYER_AIRBORNE_JUMP_Y,
  isAirborne: function () {
    const p = getPlayer();
    return p.jumpY < -REMOTE_PLAYER_AIRBORNE_JUMP_Y || !p.isOnGround;
  },
  log: addNetworkDebugLog
});

if (!currentUserName || !currentUserId) {
  window.location.replace("ovc-login.html?v=20260509a");
  throw new Error("OVC login required");
}

showAppLoadingScreen("\uBD88\uB7EC\uC624\uB294 \uC911...");


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



/** headTopWorldY: ??????(?????) ????? y. ??????transform ??? y(???? ????? */




function getNpcHeadTopWorldY(npcWorldTopY) {
  return Number(npcWorldTopY) + NPC_HEAD_TOP_TRIM_WORLD;
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
      getWorldItems().isGuideBookOpen ||
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
      !getPlayer().sittingChairId &&
      !isPlayerInsideEnteredCraftHouse() &&
      !isPlayerGameplayBlockedByNpcDialogue() &&
      !isPlayerHealthGameplayBlocked() &&
      !isPlayerTimedActionBusy()
    ) {
      keys[key] = true;
    }
  }

  if (key === " " && getPlayer().isOnGround) {
    event.preventDefault();
    if (isPlayerInsideEnteredCraftHouse()) return;
    if (isPlayerHealthGameplayBlocked()) return;
    if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) return;
    if (isPlayerInTreeSpace()) {
      return;
    }
    getPlayer().velocityY = -jumpPower;
    getPlayer().isOnGround = false;
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
    if (getPlayer().sittingChairId) return;
    if (tryToggleCraftHouseEnter()) return;
    if (isPlayerHealthGameplayBlocked()) return;
    if (getInventory().heldItem === HELD_ITEM_BUCKET) {
      if (isPlayerGameplayBlockedByNpcDialogue()) return;
      useHeldItem();
      return;
    }
    // ?????????? NPC?????????????? ??? ??????, ???????? Q?????? ????(??? Q ????????? ????????? ????).
    if (isTradeMasterVisible() && isNearTradeMaster()) {
      if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_TRADE_MASTER) {
        flashOnboardingOrderHint("");
        return;
      }
      tryTalkToTradeMaster();
      return;
    }
    if (isAlchemyMasterVisible() && isNearAlchemyMaster()) {
      if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_ALCHEMY_MASTER) {
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
    if (getWorldItems().hasGuideBook && tryCatchButterfly()) return;
    if (isPlayerGameplayBlockedByNpcDialogue()) return;
    useHeldItem();
  }

  if (key === "Escape") {
    if (getPlayer().insideCraftHouseId) {
      event.preventDefault();
      exitCraftHouse();
      savePlayerHealthState();
      resetInputKeys(keys);
      isInteractKeyLatched = false;
      return;
    }
    if (getPlayer().sittingChairId && canPlayerMoveByHealth(getPlayer().health)) {
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
    if (getWorldItems().isGuideBookOpen || guideCard.style.display === "block") {
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
      if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === ONBOARDING_STEP_SETTINGS_ESC) {
        getOnboarding().step26OpenedSettingsWithEsc = true;
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

    if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_ZOOM_INTRO) {
      return;
    }

    if (isWorldChatBlockingGameInput()) {
      return;
    }

    const direction = event.deltaY > 0 ? -1 : 1;
    getCamera().zoom = clampZoom(getCamera().zoom + direction * zoomStep);
    updateCamera();
    if (!getStoredFlag(onboardingFlowDoneKey)) {
      if (getOnboarding().flowStep === ONBOARDING_STEP_ZOOM_INTRO) {
        getOnboarding().flowStep = ONBOARDING_STEP_ZOOM_MIN;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      } else if (
        getOnboarding().flowStep === ONBOARDING_STEP_ZOOM_MIN &&
        getCamera().zoom <= getFitZoom() + 0.06
      ) {
        getOnboarding().flowStep = ONBOARDING_STEP_TREE_APPROACH;
        persistOnboardingStep();
        updateOnboardingFlowUI();
      }
    }
  },
  { passive: false }
);






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
      if (isOnboardingInventoryTutorialActive()) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const wasOpen = getWorldItems().isGuideBookOpen || guideCard.style.display === "block";
      if (
        wasOpen &&
        isOnboardingBookGuideIntroActive() &&
        getOnboarding().bookInvPhase === 2
      ) {
        return;
      }
      getWorldItems().isGuideDismissedAtSign = false;
      getWorldItems().isGuideBookOpen = !wasOpen;
      if (wasOpen) {
        dismissGuideBookClickPrompt();
      } else if (
        !getStoredFlag(onboardingFlowDoneKey) &&
        getOnboarding().flowStep === ONBOARDING_STEP_BOOK_INV
      ) {
        maybeAdvanceOnboardingAfterBookSlotClicked();
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
      if (!getWorldItems().hasGuideBook) return;
      event.preventDefault();
      event.stopPropagation();
      const wasOpen = getWorldItems().isGuideBookOpen || guideCard.style.display === "block";
      getWorldItems().isGuideDismissedAtSign = false;
      getWorldItems().isGuideBookOpen = !wasOpen;
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
      const firstInv = getApple().extraSeeds.find(function (extraSeed) {
        return (
          extraSeed.inInventory &&
          !extraSeed.planted &&
          extraSeed.id !== getInventory().plantingInventorySeedId
        );
      });
      if (!firstInv) return;
      plantInventorySeed(firstInv.id);
      return;
    }
    if (kind === "overgrowthSeed") {
      if ((Number(getApple().overgrowthSeedCount) || 0) <= 0) return;
      event.preventDefault();
      event.stopPropagation();
      plantWorldOvergrowthSeedCount();
      return;
    }
    if (kind === "apple") {
      if (getApple().count <= 0) return;
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
    return getNpc().isDialogueRunning;
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
    return getNpc().isDialogueRunning;
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
  getWorldItems().isGuideDismissedAtSign = false;
  getWorldItems().isGuideBookOpen = true;
  updateGuideCard();
});


function maybeAdvanceOnboardingAfterGuideBookClosed() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (getOnboarding().flowStep === ONBOARDING_STEP_BOOK_INV && getOnboarding().bookInvPhase >= 3) {
    onboardingClearBookGuideIntroTimer();
    getOnboarding().bookInvPhase = 0;
    getOnboarding().flowStep = ONBOARDING_STEP_PLANT;
    persistOnboardingStep();
    updateOnboardingFlowUI();
    return;
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_NPC_GUIDE) {
    if (!getOnboarding().npcGuideEscHintShown) return;
    onboardingClearEscHintTimer();
    getOnboarding().npcGuideEscHintShown = false;
    getOnboarding().flowStep = ONBOARDING_STEP_WELL;
    persistOnboardingStep();
  }
}

function isOnboardingNpcGuideCloseBlocked() {
  return (
    !getStoredFlag(onboardingFlowDoneKey) &&
    getOnboarding().flowStep === ONBOARDING_STEP_NPC_GUIDE &&
    guideCard &&
    guideCard.style.display === "block" &&
    !getOnboarding().npcGuideEscHintShown
  );
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
  getSeedWorld().isHoveringMainSeed = true;
});

seed.addEventListener("mouseleave", function () {
  getSeedWorld().isHoveringMainSeed = false;
});

let currentPlantHoverTarget = null;
let lastPlantHoverPointerClientX = 0;
let lastPlantHoverPointerClientY = 0;
let hasLastPlantHoverPointer = false;

document.addEventListener("pointerup", function (e) {
  if (e.button !== 0) return;
  if (tryWaterPlantByPointerClick(e.clientX, e.clientY)) return;
  if (isPointerBlockedForWorldInteract(e)) return;
  tryWorldInteractByPointerClick(e.clientX, e.clientY);
});

guidePrev.addEventListener("click", function (event) {
  event.stopPropagation();
  if (getNpc().guidePageIndex > 0) {
    getNpc().guidePageIndex -= 1;
  }
  updateGuidePages();
});

guideNext.addEventListener("click", function (event) {
  event.stopPropagation();
  const maxPage = getGuideMaxPage();
  if (getNpc().guidePageIndex < maxPage) {
    getNpc().guidePageIndex += 1;
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

function bindPlayerBaseImageLoadHandlers() {
  playerBaseImage.addEventListener("load", function () {
    playerBaseImageReady = true;
    playerTintCache.clear();
    if (characterSelectOverlay && characterSelectOverlay.classList.contains("is-open")) {
      syncCharacterPreviewVisual(selectedPlayerColor);
    }
    if (hasChosenPlayerColor && selectedPlayerColor && !getPlayer().sittingChairId) {
      applyPlayerColor(selectedPlayerColor);
    }
  });
  playerSitBaseImage.addEventListener("load", function () {
    playerSitBaseImageReady = true;
    playerSitTintCache.clear();
    if (getPlayer().sittingChairId) {
      syncLocalPlayerPoseVisual();
    }
  });
  if (playerBaseImage.complete && playerBaseImage.naturalWidth) {
    playerBaseImageReady = true;
  }
  if (playerSitBaseImage.complete && playerSitBaseImage.naturalWidth) {
    playerSitBaseImageReady = true;
  }
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
    getWorldItems().hasGuideBook = true;
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
  } else if (!getWorldItems().hasGuideBook) {
    getWorldItems().hasGuideBook = true;
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

function updateSettingsTutorialButtons() {
  updateSettingsTutorialButtonsUi({
    tutorialExitButton,
    tutorialReplayButton,
    currentUserId,
    hasSpawnedCharacter,
    onboardingDone: getStoredFlag(onboardingFlowDoneKey),
    onboardingFlowStep: getOnboarding().flowStep
  });
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
  getOnboarding().step26OpenedSettingsWithEsc = false;
  setOnboardingFlowDoneStored(true);
  setStoredFlag(everBeenToWorldKey, true);
  getOnboarding().flowStep = 0;
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
  getWorldItems().hasGuideBook = true;
  getNpc().isDialogueComplete = true;
  getNpc().isGuidePlantPageUnlocked = true;
  getWorldItems().isGuideBookOpen = false;
  getWorldItems().isGuideBookClickPromptActive = false;
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
  clearTutorialSessionWorldFloorPickupFlags();
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
  getOnboarding().step26OpenedSettingsWithEsc = false;
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




/** ???? ????? ????: ???????(???)?? ?????????? ?????? ???? ????? */
function getPlayerHeadFogProbeBox() {
  return getPlayerHeadFogProbeBoxForPose(getPlayer().x, getPlayer().depth, getPlayer().jumpY);
}



/** rock-ground.svg(64??48) ??CSS `center bottom / contain` ????????? ?????????? ???? */
const ROCK_GROUND_SVG_W = 64;
const ROCK_GROUND_SVG_H = 48;
/** viewBox ????? ????? ????? ???????????????????(????y 18~44) */
const ROCK_GROUND_HIT_LEFT = 10;
const ROCK_GROUND_HIT_RIGHT = 54;
const ROCK_GROUND_HIT_TOP = 19;
const ROCK_GROUND_HIT_BOTTOM = 44;


/** ry = ??????? ?????(?????). rockEl ??????????? ???? ????? ???(???CSS ????) */



function getSeedSize() {
  return {
    width: SEED_SIZE,
    height: SEED_SIZE
  };
}




function getHandPositionFromPlayerPose(playerWorldX, playerWorldY, itemWidth, itemHeight) {
  const top = GROUND_WORLD_HEIGHT - PLAYER_HEIGHT + playerWorldY;
  return {
    x: playerWorldX + PLAYER_WIDTH * 0.82 - itemWidth / 2,
    y: top + PLAYER_HEIGHT * 0.68 - itemHeight / 2
  };
}

function getHandPosition(itemWidth, itemHeight) {
  return getHandPositionFromPlayerPose(getPlayer().x, getPlayerWorldY(), itemWidth, itemHeight);
}

function isNearSeed() {
  const seedSize = getSeedSize();

  return getCenterDistance(getWorldItems().seedX, getWorldItems().seedY, seedSize.width, seedSize.height) < pickupDistance;
}

function canPickUpSeed() {
  updateSeedDryState();
  return (
    !hasPickedMainSeedInCurrentRoom() &&
    !getPlant().isSeedDry
  );
}

function clearTutorialMainSeedRespawnTimer() {
  if (getOnboarding().tutorialMainSeedRespawnTimerId !== null) {
    window.clearTimeout(getOnboarding().tutorialMainSeedRespawnTimerId);
    getOnboarding().tutorialMainSeedRespawnTimerId = null;
  }
  getOnboarding().tutorialMainSeedRespawnDueAt = 0;
}

function scheduleTutorialMainSeedRespawnFromGround() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  clearTutorialMainSeedRespawnTimer();
  getOnboarding().tutorialMainSeedRespawnDueAt = Date.now() + TUTORIAL_MAIN_SEED_RESPAWN_MS;
  getOnboarding().tutorialMainSeedRespawnTimerId = window.setTimeout(function () {
    getOnboarding().tutorialMainSeedRespawnTimerId = null;
    getOnboarding().tutorialMainSeedRespawnDueAt = 0;
    if (getStoredFlag(onboardingFlowDoneKey)) return;
    if (getPlant().isSeedPlanted) return;
    tutorialRespawnMainSeedOnGround();
  }, TUTORIAL_MAIN_SEED_RESPAWN_MS);
}

function tickTutorialMainSeedRespawnDue() {
  if (!getOnboarding().tutorialMainSeedRespawnDueAt || getStoredFlag(onboardingFlowDoneKey)) {
    getOnboarding().tutorialMainSeedRespawnDueAt = 0;
    return;
  }
  if (Date.now() < getOnboarding().tutorialMainSeedRespawnDueAt) return;
  getOnboarding().tutorialMainSeedRespawnDueAt = 0;
  clearTutorialMainSeedRespawnTimer();
  if (getPlant().isSeedPlanted) return;
  tutorialRespawnMainSeedOnGround();
}

function hasTutorialStarterSeedInPlay() {
  if (getInventory().heldItem === HELD_ITEM_SEED) return true;
  return getApple().extraSeeds.some(function (s) {
    if (s.planted) return false;
    return s.id === "starter-seed" || s.isStarter;
  });
}

/**
 * ??? ??? ??????? '????'????? ????? ???????????????????????????? ????????????????? ???
 */
function recoverWorldMainSeedIfOnboardingStuck() {
  if (getPlant().isSeedPlanted || getPlant().isPlanting) return;
  if (!hasPickedMainSeedInCurrentRoom()) return;
  if (hasTutorialStarterSeedInPlay()) return;
  // ??? ??? ????? ???? ???(updateSeedPosition)?? picked????? ???????? ??????.
  // ????????????? ????? ????????????????? ??????? ?????????????? ????.
  if (getSeedWorld().hasHandledDryMainSeed) return;
  clearMainSeedPickedForCurrentRoom();
  getSeedWorld().isMainSeedAvailable = true;
  getSeedWorld().lastMainSeedStateChangeAt = Date.now();
  getPlant().isSeedDry = false;
  getSeedWorld().hasHandledDryMainSeed = false;
  getSeedWorld().dryMainSeedVisibleSince = 0;
  setStoredFlag(mainDrySeedHandledKey, false);
}

function tutorialRespawnMainSeedOnGround() {
  getOnboarding().tutorialMainSeedRegenCompleted = true;
  clearMainSeedPickedForCurrentRoom();
  getApple().extraSeeds = getApple().extraSeeds.filter(function (s) {
    var isStarter = s.id === "starter-seed" || s.isStarter;
    if (!isStarter) return true;
    if (s.planted) return true;
    if (s.inInventory) return true;
    if (s.element) s.element.remove();
    if (s.inventoryElement) s.inventoryElement.remove();
    return false;
  });
  if (getInventory().heldItem === HELD_ITEM_SEED) {
    getInventory().heldItem = null;
  }
  getPlant().isSeedDry = false;
  getSeedWorld().hasHandledDryMainSeed = false;
  getSeedWorld().dryMainSeedVisibleSince = 0;
  setStoredFlag(mainDrySeedHandledKey, false);
  getSeedWorld().isMainSeedAvailable = true;
  getSeedWorld().lastMainSeedStateChangeAt = Date.now();
  updateSeedInventory();
  updateExtraSeedsAndPlants();
  updateSeedPosition();
  saveAppleState();
  markWorldDirty();
  syncWorldState(true);
}

/** Tutorial ?????: ??#seed ??extraSeeds ?????? ????? ?????????????????? ????(groundSeed.js). */

function isHoldingMainBucket() {
  return getInventory().heldItem === HELD_ITEM_BUCKET && (!getInventory().heldBucketId || getInventory().heldBucketId === MAIN_BUCKET_ID);
}

function isHoldingExtraBucket() {
  return getInventory().heldItem === HELD_ITEM_BUCKET && getInventory().heldBucketId && getInventory().heldBucketId !== MAIN_BUCKET_ID;
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
  getWorldItems().bucketX = hand.x;
  getWorldItems().bucketY = hand.y;
  return true;
}

/** ??? ?????????????????????????????????? ???????? ??? ???? ????? ???? ?????????? */
function getMainBucketGroundState() {
  if (isMainBucketHeldByRemotePlayer()) {
    return {
      x: getWorldItems().bucketX,
      y: getWorldItems().bucketY,
      isFull: Boolean(getInventory().isBucketFull)
    };
  }
  if (isHoldingExtraBucket()) {
    const bucketSize = getBucketSize();
    return {
      x: Number.isFinite(getInventory().heldExtraBucketMainX)
        ? getInventory().heldExtraBucketMainX
        : getWorldItems().wellX - bucketSize.width - 8,
      y: Number.isFinite(getInventory().heldExtraBucketMainY)
        ? getInventory().heldExtraBucketMainY
        : getWorldItems().wellY + WELL_SIZE - bucketSize.height,
      isFull: Boolean(getInventory().heldExtraBucketMainIsFull)
    };
  }
  if (isHoldingMainBucket()) {
    const bucketSize = getBucketSize();
    return {
      x: Number.isFinite(getInventory().mainBucketParkedX)
        ? getInventory().mainBucketParkedX
        : getWorldItems().wellX - bucketSize.width - 8,
      y: Number.isFinite(getInventory().mainBucketParkedY)
        ? getInventory().mainBucketParkedY
        : getWorldItems().wellY + WELL_SIZE - bucketSize.height,
      isFull: Boolean(getInventory().isBucketFull)
    };
  }
  return {
    x: getWorldItems().bucketX,
    y: getWorldItems().bucketY,
    isFull: Boolean(getInventory().isBucketFull)
  };
}

/** 멀티: 공유 메인 양동이(땅·주차) 위치·찬/빈 — 손에 든 추가 양동이와 분리 */
function applyRemoteSharedMainBucketGround(x, y, isFull) {
  const nextX = Number(x);
  const nextY = Number(y);
  const nextFull = Boolean(isFull);
  if (isHoldingExtraBucket()) {
    if (Number.isFinite(nextX)) getInventory().heldExtraBucketMainX = nextX;
    if (Number.isFinite(nextY)) getInventory().heldExtraBucketMainY = nextY;
    getInventory().heldExtraBucketMainIsFull = nextFull;
    return;
  }
  if (isHoldingMainBucket()) return;
  if (Number.isFinite(nextX)) getWorldItems().bucketX = nextX;
  if (Number.isFinite(nextY)) getWorldItems().bucketY = nextY;
  getInventory().isBucketFull = nextFull;
}

/** 멀티: 원격이 메인 양동이를 들었을 때 손 위치만 반영(로컬이 추가 양동이를 든 경우 getInventory().isBucketFull 유지) */
function applyRemoteSharedMainBucketHeldPose(x, y, isFull) {
  const nextX = Number(x);
  const nextY = Number(y);
  if (Number.isFinite(nextX)) getWorldItems().bucketX = nextX;
  if (Number.isFinite(nextY)) getWorldItems().bucketY = nextY;
  if (!isHoldingExtraBucket() && !isHoldingMainBucket()) {
    getInventory().isBucketFull = Boolean(isFull);
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
  (Array.isArray(getApple().worldExtraBuckets) ? getApple().worldExtraBuckets : []).forEach(
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
  const extras = Array.isArray(getApple().worldExtraBuckets) ? getApple().worldExtraBuckets : [];
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

  return getCenterDistance(getWorldItems().wellX, getWorldItems().wellY, wellSize.width, wellSize.height) < wellUseDistance;
}


function isNearWellForPouring() {
  const wellSize = getWellSize();

  return getCenterDistance(getWorldItems().wellX, getWorldItems().wellY, wellSize.width, wellSize.height) < wellPourDistance;
}

/** ????? ???????????????????????????????????????? ???????????? ????????????????? */
function isNearWellIncludingBucketReach() {
  if (isNearWell()) return true;
  if (getInventory().heldItem !== HELD_ITEM_BUCKET) return false;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const bucketBox = {
    left: getWorldItems().bucketX,
    top: getWorldItems().bucketY,
    width: bucketSize.width,
    height: bucketSize.height
  };
  return (
    getCenterDistanceUtil(bucketBox, getWorldItems().wellX, getWorldItems().wellY, wellSize.width, wellSize.height) <
    wellUseDistance + 2
  );
}

function isNearWellForPouringIncludingBucketReach() {
  if (isNearWellForPouring()) return true;
  if (getInventory().heldItem !== HELD_ITEM_BUCKET) return false;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const bucketBox = {
    left: getWorldItems().bucketX,
    top: getWorldItems().bucketY,
    width: bucketSize.width,
    height: bucketSize.height
  };
  return (
    getCenterDistanceUtil(bucketBox, getWorldItems().wellX, getWorldItems().wellY, wellSize.width, wellSize.height) <
    wellPourDistance + 2
  );
}

/**
 * ???????????? ??? ?????? ?????????????(????? px). ???????????? ??????????? ??????? ???????
 * ????????????? '?????????? ??? ????? ?????? ????????? Q?? ????????? ?????????????? ????.
 */
function isBucketOverlappingWellForInteraction(padPx) {
  if (getInventory().heldItem !== HELD_ITEM_BUCKET) return false;
  const pad = Number.isFinite(Number(padPx)) ? Math.max(0, Number(padPx)) : 12;
  const wellSize = getWellSize();
  const bucketSize = getBucketSize();
  const wellRect = {
    left: getWorldItems().wellX - pad,
    top: getWorldItems().wellY - pad,
    right: getWorldItems().wellX + wellSize.width + pad,
    bottom: getWorldItems().wellY + wellSize.height + pad
  };
  const bucketRect = {
    left: getWorldItems().bucketX,
    top: getWorldItems().bucketY,
    right: getWorldItems().bucketX + bucketSize.width,
    bottom: getWorldItems().bucketY + bucketSize.height
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
  return getCenterDistance(getWorldItems().signX, getWorldItems().signY, SIGN_WIDTH, SIGN_HEIGHT) < guideInteractDistance;
}

/** ?? ?? ??? ?? ??? ?? ? ?? ?? ?? ???? ?? */
function isWorldFloorBagAwaitingPickup() {
  return Boolean(
    worldBag && !isWorldFloorBagHiddenForCurrentView() && worldBag.style.display !== "none"
  );
}

function isNearWorldBagPickup() {
  if (isWorldFloorBagHiddenForCurrentView()) {
    return false;
  }
  if (!worldBag) return false;
  const worldBagStyle = window.getComputedStyle(worldBag);
  if (worldBagStyle.display === "none" || worldBagStyle.visibility === "hidden") {
    return false;
  }
  return (
    getCenterDistance(getWorldItems().worldBagX, getWorldItems().worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT) < pickupDistance
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
    getCenterDistance(getWorldItems().guideBookX, getWorldItems().guideBookY, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT) < pickupDistance
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
  const plantIndexSproutToggle = document.getElementById("plant-progress-sprout-toggle");
  if (plantIndexSproutToggle) plantIndexSproutToggle.classList.remove("onboarding-highlight");
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
    bagInventoryPanel.classList.remove("onboarding-highlight");
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
  setStoredValue(onboardingFlowStepKey, String(getOnboarding().flowStep));
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

function resetTutorialProgressInStorage(options) {
  const force = Boolean(options && options.force);
  let allowReset = force || !getStoredFlag(onboardingFlowDoneKey);
  if (!allowReset) {
    try {
      allowReset =
        sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1" ||
        sessionStorage.getItem(ovcTutorialWorldResetPendingKey) === "1";
    } catch (eAllow) {}
  }
  if (!allowReset) return;
  abortPlantMasterDialogue();
  clearTutorialMainSeedRespawnTimer();
  setOnboardingFlowDoneStored(false);
  setStoredValue(onboardingFlowStepKey, "1");
  removeStoredValue(movementTutorialCompleteKey);
  removeStoredValue(ONBOARDING_BOOK_INSERT_MIGRATE_KEY);
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
  getNpc().isDialogueComplete = false;
  getNpc().isGuidePlantPageUnlocked = false;
  clearMainSeedPickedForCurrentRoom();
  getOnboarding().tutorialWorldNeedsFullReset = true;
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

function prepareTutorialWorldLoadBeforeSetup() {
  if (!isTutorialDocumentEntry() || !currentUserId) return;
  let replayActive = false;
  let resetPending = false;
  try {
    replayActive = sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1";
    resetPending = sessionStorage.getItem(ovcTutorialWorldResetPendingKey) === "1";
  } catch (ePrep) {}
  if (!replayActive && !resetPending && getStoredFlag(onboardingFlowDoneKey)) {
    return;
  }
  clearTutorialSessionWorldFloorPickupFlags();
  if (resetPending && !getStoredFlag(onboardingFlowDoneKey)) {
    resetTutorialProgressInStorage();
    clearStoredKeys(appStorageKeysSharedWorldReset);
  }
}

function applyTutorialWorldResetIfPending() {
  let pendingWorld = getOnboarding().tutorialWorldNeedsFullReset;
  try {
    if (sessionStorage.getItem("ovcTutorialWorldResetPending") === "1") {
      pendingWorld = true;
    }
    if (
      !getStoredFlag(onboardingFlowDoneKey) &&
      sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1"
    ) {
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
  getOnboarding().tutorialWorldNeedsFullReset = false;
  try {
    sessionStorage.removeItem("ovcTutorialWorldResetPending");
  } catch (e2) {}
  applyDefaultState();
  clearTutorialSessionWorldFloorPickupFlags();
  loadGuideBookState(true);
  setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
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
  if (getOnboarding().congratsTimerId) {
    window.clearTimeout(getOnboarding().congratsTimerId);
    getOnboarding().congratsTimerId = null;
  }
  if (getOnboarding().treeLeaveHintTimerId) {
    window.clearTimeout(getOnboarding().treeLeaveHintTimerId);
    getOnboarding().treeLeaveHintTimerId = null;
  }
  if (getOnboarding().finalHideTimerId) {
    window.clearTimeout(getOnboarding().finalHideTimerId);
    getOnboarding().finalHideTimerId = null;
  }
  if (getOnboarding().fruitIntroTimerId) {
    window.clearTimeout(getOnboarding().fruitIntroTimerId);
    getOnboarding().fruitIntroTimerId = null;
  }
  if (getOnboarding().plantIndexIntroTimerId) {
    window.clearTimeout(getOnboarding().plantIndexIntroTimerId);
    getOnboarding().plantIndexIntroTimerId = null;
  }
  onboardingClearBookGuideIntroTimer();
  onboardingClearInventoryCloseHintTimer();
}

function onboardingClearBookGuideIntroTimer() {
  if (getOnboarding().bookGuideIntroTimerId) {
    window.clearTimeout(getOnboarding().bookGuideIntroTimerId);
    getOnboarding().bookGuideIntroTimerId = null;
  }
}






function isOnboardingBookGuideIntroActive() {
  return (
    isOnboardingLinearGateActive() &&
    getOnboarding().flowStep === ONBOARDING_STEP_BOOK_INV &&
    getOnboarding().bookInvPhase >= 2
  );
}

function maybeAdvanceOnboardingAfterBookSlotClicked() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (getOnboarding().flowStep !== ONBOARDING_STEP_BOOK_INV || getOnboarding().bookInvPhase >= 2) return;
  onboardingClearBookGuideIntroTimer();
  getOnboarding().bookInvPhase = 2;
  updateOnboardingFlowUI();
  getOnboarding().bookGuideIntroTimerId = window.setTimeout(function () {
    getOnboarding().bookGuideIntroTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_BOOK_INV) {
      return;
    }
    if (getOnboarding().bookInvPhase !== 2) return;
    getOnboarding().bookInvPhase = 3;
    updateOnboardingFlowUI();
  }, 2000);
}


/** v1(구 27단계) → v2(34단계) 온보딩 단계 번호 마이그레이션 */
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

/** v3: 씨앗 줍기 후 책 튜토리얼(7~9) 삽입 — 기존 7~34 단계 +3 */
function migrateOnboardingStepForBookInsert(step) {
  const n = Math.floor(Number(step) || 0);
  if (n < 7 || n > 34) return n;
  if (getStoredFlag(ONBOARDING_BOOK_INSERT_MIGRATE_KEY)) return n;
  setStoredFlag(ONBOARDING_BOOK_INSERT_MIGRATE_KEY, true);
  return n + 3;
}

function isOnboardingSocialTutorialStep() {
  return (
    isOnboardingLinearGateActive() &&
    getOnboarding().flowStep >= ONBOARDING_STEP_CHAT &&
    getOnboarding().flowStep <= ONBOARDING_STEP_SAD
  );
}

function isOnboardingSocialDemoReady() {
  return isOnboardingSocialTutorialStep() || isWorldSocialRealtimeReady();
}

function onboardingClearPlantIndexIntroTimer() {
  if (getOnboarding().plantIndexIntroTimerId) {
    window.clearTimeout(getOnboarding().plantIndexIntroTimerId);
    getOnboarding().plantIndexIntroTimerId = null;
  }
}

function finishOnboardingPlantIndexIntro() {
  onboardingClearPlantIndexIntroTimer();
  getOnboarding().plantIndexIntroPhase = 0;
  getOnboarding().plantIndexAwaitingSprout = false;
  getOnboarding().flowStep = ONBOARDING_STEP_DROP_BUCKET;
  persistOnboardingStep();
  if (worldPlantFog) worldPlantFog.style.display = "none";
  if (world) world.style.filter = "";
  updateOnboardingFlowUI();
}

function onboardingHookPlantIndexSproutToggle(nowCollapsed) {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_PLANT_INDEX) {
    return;
  }
  if (getOnboarding().plantIndexIntroPhase === 1 && nowCollapsed) {
    getOnboarding().plantIndexIntroPhase = 2;
    updateOnboardingFlowUI();
    return;
  }
  if (getOnboarding().plantIndexIntroPhase === 2 && !nowCollapsed) {
    finishOnboardingPlantIndexIntro();
  }
}

/**
 * 물주기 축하 후 식물지수 안내 대기 중 — 본편 90초 진화 대신 튜토리얼용으로 새싹·3단계를 빠르게 진행.
 * @returns {boolean} 새싹 3단계에 도달했으면 true
 */
function advanceOnboardingTutorialSproutForPlantIndex(plant, now) {
  if (
    getStoredFlag(onboardingFlowDoneKey) ||
    !isOnboardingLinearGateActive() ||
    !getOnboarding().plantIndexAwaitingSprout ||
    !plant ||
    plant.status === "rotten" ||
    plant.status === "dry" ||
    plant.isOverwatered
  ) {
    return false;
  }
  if (getSproutStageFromPlant(plant) >= 3) return true;

  const started = Number(plant.growthStartedAt) || 0;
  if (!plant.isSproutGrown && started > 0) {
    if (now - started < ONBOARDING_PLANT_INDEX_FIRST_SPROUT_MS) return false;
    if (!makePlantStableStage3FromOvergrowthSeed(plant, now)) {
      plant.isSproutGrown = true;
      plant.sproutGrownAt = now;
      plant.sproutEvolutionMs = 0;
      plant.sproutEvolutionLastTickAt = now;
      plant.isSproutSelfSustaining = false;
    }
    return getSproutStageFromPlant(plant) >= 3;
  }

  if (!plant.isSproutGrown) return false;

  const grownAt = Number(plant.sproutGrownAt) || 0;
  if (grownAt <= 0 || now - grownAt < ONBOARDING_PLANT_INDEX_SPROUT_STAGE3_MS) {
    return false;
  }

  const evCap = sproutStage1Ms + sproutStage2GrowMs;
  plant.sproutEvolutionMs = evCap;
  plant.isSproutSelfSustaining = true;
  plant.growthTier = Math.max(Number(plant.growthTier) || 0, 3);
  syncPlantWaterCapacityField(plant);
  plant.waterLevel = Math.min(
    getPlantWaterCapacity(plant),
    Math.max(Number(plant.waterLevel) || 0, 2)
  );
  plant.becameEmptyAt = null;
  plant.status = "normal";
  return true;
}

function onboardingTryStartPlantIndexAfterSproutStage3() {
  if (getStoredFlag(onboardingFlowDoneKey) || !isOnboardingLinearGateActive()) return;
  if (
    !getOnboarding().plantIndexAwaitingSprout &&
    getOnboarding().flowStep !== ONBOARDING_STEP_PLANT_INDEX &&
    getOnboarding().flowStep !== ONBOARDING_STEP_WATER_DONE
  ) {
    return;
  }
  if (!getPlant() || getSproutStageFromPlant(getPlant()) < 3) return;
  getOnboarding().plantIndexAwaitingSprout = false;
  getOnboarding().waterDoneCongratsStartedAt = 0;
  getOnboarding().postWaterCongratsPhase = 0;
  if (getOnboarding().congratsTimerId) {
    window.clearTimeout(getOnboarding().congratsTimerId);
    getOnboarding().congratsTimerId = null;
  }
  if (getOnboarding().flowStep !== ONBOARDING_STEP_PLANT_INDEX) {
    getOnboarding().flowStep = ONBOARDING_STEP_PLANT_INDEX;
    persistOnboardingStep();
  }
  if (!getOnboarding().plantIndexIntroTimerId) {
    startOnboardingPlantIndexIntro();
  }
}

function startOnboardingPlantIndexIntro() {
  onboardingClearPlantIndexIntroTimer();
  getOnboarding().plantIndexIntroPhase = 0;
  getOnboarding().plantIndexAwaitingSprout = false;
  const gauge = document.getElementById("plant-progress-gauge");
  if (gauge) {
    gauge.classList.remove("is-collapsed");
    const toggle = document.getElementById("plant-progress-sprout-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }
  syncWorldPlantFogVisuals();
  updatePlantProgressGauge();
  updateOnboardingFlowUI();
  getOnboarding().plantIndexIntroTimerId = window.setTimeout(function () {
    getOnboarding().plantIndexIntroTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_PLANT_INDEX) {
      return;
    }
    if (getOnboarding().plantIndexIntroPhase !== 0) return;
    getOnboarding().plantIndexIntroPhase = 1;
    updateOnboardingFlowUI();
    getOnboarding().plantIndexIntroTimerId = window.setTimeout(function () {
      getOnboarding().plantIndexIntroTimerId = null;
      if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_PLANT_INDEX) {
        return;
      }
      if (getOnboarding().plantIndexIntroPhase < 2) {
        finishOnboardingPlantIndexIntro();
      }
    }, 9000);
  }, 4500);
}


function advanceOnboardingAfterSocialChatSent() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_CHAT) return;
  getOnboarding().flowStep = ONBOARDING_STEP_HEART;
  persistOnboardingStep();
  setWorldChatPanelOpen(false);
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterSocialHeart() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_HEART) return;
  getOnboarding().flowStep = ONBOARDING_STEP_SAD;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterSocialSad() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_SAD) return;
  getOnboarding().flowStep = ONBOARDING_STEP_ROCK;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterTradeMasterDialogue() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_TRADE_MASTER) {
    return;
  }
  setStoredFlag(alchemyMasterDialogueCompleteKey, false);
  hydrateAlchemyMasterDialogueComplete(false);
  getOnboarding().flowStep = ONBOARDING_STEP_ALCHEMY_MASTER;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function advanceOnboardingAfterAlchemyMasterDialogue() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_ALCHEMY_MASTER) {
    return;
  }
  getOnboarding().flowStep = ONBOARDING_STEP_ZOOM_INTRO;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function ensureTutorialOnboardingRock() {
  if (!Array.isArray(getApple().worldRocks)) getApple().worldRocks = [];
  if (!Array.isArray(getApple().worldRockPickedIds)) getApple().worldRockPickedIds = [];
  const shouldShow =
    isOnboardingLinearGateActive() && getOnboarding().flowStep === ONBOARDING_STEP_ROCK;
  if (!shouldShow) {
    if (getOnboarding().tutorialRockMounted && ground) {
      ground.querySelectorAll(".world-ground-rock[data-tutorial-rock='1']").forEach(function (node) {
        node.remove();
      });
    }
    getOnboarding().tutorialRockMounted = false;
    return;
  }
  let rock = getApple().worldRocks.find(function (r) {
    return r && String(r.id) === TUTORIAL_ONBOARDING_ROCK_ID;
  });
  if (!rock) {
    rock = {
      id: TUTORIAL_ONBOARDING_ROCK_ID,
      x: WELL_START_X + 52,
      y: WELL_START_Y + 18,
      size: WORLD_ROCK_SIZE
    };
    getApple().worldRocks.push(rock);
  }
  if (getApple().worldRockPickedIds.includes(TUTORIAL_ONBOARDING_ROCK_ID)) {
    const idx = getApple().worldRockPickedIds.indexOf(TUTORIAL_ONBOARDING_ROCK_ID);
    if (idx >= 0) getApple().worldRockPickedIds.splice(idx, 1);
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
    getOnboarding().tutorialRockMounted = true;
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
    if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== expectedStep) return;
    applyFlag();
    updateOnboardingFlowUI();
  }, 2000);
}

function scheduleOnboardingNpcGuideEscHint() {
  onboardingClearEscHintTimer();
  onboardingEscHintTimerId = window.setTimeout(function () {
    onboardingEscHintTimerId = null;
    if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_NPC_GUIDE) {
      return;
    }
    getOnboarding().npcGuideEscHintShown = true;
    updateOnboardingFlowUI();
  }, ONBOARDING_NPC_GUIDE_CLOSE_HINT_MS);
}


function isPlayerNearTutorialTreeArea() {
  const cx = BIG_TREE_X + BIG_TREE_WIDTH / 2;
  const cy = BIG_TREE_Y + BIG_TREE_HEIGHT / 2;
  const px = getPlayer().x + PLAYER_WIDTH / 2;
  const py = getPlayerFootY() - (player.offsetHeight || PLAYER_HEIGHT) / 2;
  return Math.hypot(px - cx, py - cy) < 100;
}

function isNearAnyUnpickedAppleTutorial() {
  return getApple().apples.some(function (apple) {
    if (getApple().pickedIds.includes(apple.id)) return false;
    return (
      getCenterDistance(apple.x, apple.y, apple.size, apple.size) < 36
    );
  });
}

function highlightUnpickedApplesForTutorial() {
  const visibleById = {};
  getApple().apples.forEach(function (apple) {
    if (!getApple().pickedIds.includes(apple.id)) {
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


function isOnboardingLinearGateActive() {
  return (
    isMainGameTutorialInProgress() &&
    hasSpawnedCharacter &&
    !isCharacterSelecting &&
    !isTabSessionSuperseded
  );
}


function onboardingAllowsBucketQUse() {
  return getOnboarding().flowStep >= ONBOARDING_STEP_BUCKET_FILL;
}

/** 튜토리얼 중 땅에 놓인 양동이를 E/클릭으로 들 수 있는 단계 */
function onboardingAllowsBucketGroundPickup() {
  const s = getOnboarding().flowStep;
  return (
    s === ONBOARDING_STEP_BUCKET_PICK ||
    s === ONBOARDING_STEP_WATER_APPROACH ||
    s === ONBOARDING_STEP_WATER_POUR
  );
}

/** 17~18: 메인 식물에 물주기(3단계 새싹이어도 첫 물주기 허용) */
function isOnboardingMainPlantWateringTutorialStep() {
  if (getStoredFlag(onboardingFlowDoneKey)) return false;
  return (
    getOnboarding().flowStep === ONBOARDING_STEP_WATER_APPROACH ||
    getOnboarding().flowStep === ONBOARDING_STEP_WATER_POUR
  );
}

function onboardingAllowsGuideBookButtonToggle() {
  const s = getOnboarding().flowStep;
  if (isOnboardingInventoryTutorialActive()) return false;
  if (s === ONBOARDING_STEP_BOOK_INV) return false;
  return s === ONBOARDING_STEP_NPC_GUIDE || s >= ONBOARDING_STEP_WATER_DONE;
}

function syncOnboardingFlowProgressFromWorld() {
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  let changed = false;
  if (getWorldItems().hasGuideBook && getOnboarding().flowStep < 3) {
    getOnboarding().flowStep = 3;
    changed = true;
  }
  if (getOnboarding().flowStep === 2) {
    getOnboarding().flowStep = 3;
    changed = true;
  }
  // Only catch up seed/plant/NPC steps if the player is already in that branch of the
  // tutorial. Otherwise a shared-world snapshot (another player's planted main spot)
  // would jump fresh onboarding straight to "find the plant master" or later.
  if (
    hasPickedMainSeedInCurrentRoom() &&
    getOnboarding().flowStep < ONBOARDING_STEP_GO_BOOK &&
    getOnboarding().flowStep >= 5
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_GO_BOOK;
    changed = true;
  }
  if (
    hasGuideBookItemInBagCounts() &&
    getOnboarding().flowStep >= ONBOARDING_STEP_GO_BOOK &&
    getOnboarding().flowStep < ONBOARDING_STEP_PLANT
  ) {
    if (getOnboarding().flowStep <= ONBOARDING_STEP_PICK_BOOK) {
      getOnboarding().flowStep = ONBOARDING_STEP_BOOK_INV;
      getOnboarding().bookInvPhase = 0;
      changed = true;
    }
  }
  if (
    getPlant().isSeedPlanted &&
    getOnboarding().flowStep < ONBOARDING_STEP_PLANT_MASTER &&
    getOnboarding().flowStep >= ONBOARDING_STEP_PLANT
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_PLANT_MASTER;
    changed = true;
  }
  if (
    getNpc().isDialogueComplete &&
    getPlant().isSeedPlanted &&
    getOnboarding().flowStep < ONBOARDING_STEP_NPC_GUIDE &&
    getOnboarding().flowStep >= ONBOARDING_STEP_PLANT_MASTER
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_NPC_GUIDE;
    changed = true;
  }
  if (changed) {
    persistOnboardingStep();
  }
}

function loadOnboardingFlowState() {
  getOnboarding().jumpLatch = false;
  getOnboarding().npcGuideEscHintShown = false;
  getOnboarding().postAppleSeedIntroPhase = 0;
  getOnboarding().postWaterCongratsPhase = 0;
  getOnboarding().waterDoneCongratsStartedAt = 0;
  getOnboarding().plantIndexIntroPhase = 0;
  getOnboarding().plantIndexAwaitingSprout = false;
  getOnboarding().butterflyCountBaseline = null;
  getOnboarding().tutorialEnteredTree = false;
  getOnboarding().inventoryIntroPhase = 0;
  getOnboarding().bookInvPhase = 0;
  onboardingClearAllOnboardingTimers();
  if (getStoredFlag(onboardingFlowDoneKey)) {
    getOnboarding().flowStep = 0;
    return;
  }
  const raw = parseInt(String(getStoredValue(onboardingFlowStepKey) || "1"), 10);
  if (raw === 0) {
    setOnboardingFlowDoneStored(true);
    getOnboarding().flowStep = 0;
    requestAccountTutorialDoneSync({ force: true });
    return;
  }
  if (raw === ONBOARDING_MAX_STEP) {
    setOnboardingFlowDoneStored(true);
    setStoredValue(onboardingFlowStepKey, "0");
    getOnboarding().flowStep = 0;
    requestAccountTutorialDoneSync({ force: true });
    return;
  }
  const normalizedRaw = migrateOnboardingStepForBookInsert(migrateLegacyOnboardingFlowStep(raw));
  getOnboarding().flowStep =
    Number.isFinite(normalizedRaw) && normalizedRaw >= 1 && normalizedRaw <= ONBOARDING_MAX_STEP
      ? normalizedRaw
      : 1;
  if (getOnboarding().flowStep === ONBOARDING_STEP_BOOK_INV && hasGuideBookItemInBagCounts()) {
    if (getOnboarding().bookInvPhase < 2) {
      getOnboarding().bookInvPhase = bagInventoryPanelOpen ? 1 : 0;
    }
  }
  syncOnboardingFlowProgressFromWorld();
  if (getOnboarding().flowStep === 2) {
    getOnboarding().flowStep = 3;
    persistOnboardingStep();
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_EXTRA_SEED) {
    getOnboarding().postAppleSeedIntroPhase = 1;
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_WATER_DONE ||
    getOnboarding().flowStep === ONBOARDING_STEP_PLANT_INDEX
  ) {
    if (getPlant() && getSproutStageFromPlant(getPlant()) >= 3) {
      if (getOnboarding().flowStep === ONBOARDING_STEP_PLANT_INDEX && !getOnboarding().plantIndexIntroTimerId) {
        startOnboardingPlantIndexIntro();
      } else if (getOnboarding().flowStep === ONBOARDING_STEP_WATER_DONE) {
        onboardingTryStartPlantIndexAfterSproutStage3();
      }
    } else {
      getOnboarding().plantIndexAwaitingSprout = true;
      getOnboarding().postWaterCongratsPhase = 0;
      getOnboarding().waterDoneCongratsStartedAt =
        Date.now() - ONBOARDING_WATER_DONE_CONGRATS_END_MS;
    }
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_NPC_GUIDE &&
    guideCard &&
    guideCard.style.display === "block" &&
    !getOnboarding().npcGuideEscHintShown
  ) {
    scheduleOnboardingNpcGuideEscHint();
  }
}

function onboardingNotifyMainPlantPlanted() {
  clearTutorialMainSeedRespawnTimer();
  if (getStoredFlag(onboardingFlowDoneKey)) return;
  if (getOnboarding().flowStep === ONBOARDING_STEP_PLANT) {
    getOnboarding().flowStep = ONBOARDING_STEP_PLANT_MASTER;
    persistOnboardingStep();
  }
}

function onboardingAutoAdvanceSteps() {
  if (getStoredFlag(onboardingFlowDoneKey) || !hasSpawnedCharacter) return;

  if (getOnboarding().flowStep === 5 && isNearSeed()) {
    getOnboarding().flowStep = 6;
    persistOnboardingStep();
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_GO_BOOK && isNearGuideBook()) {
    getOnboarding().flowStep = ONBOARDING_STEP_PICK_BOOK;
    persistOnboardingStep();
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_ZOOM_MIN &&
    getCamera().zoom <= getFitZoom() + 0.06
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_TREE_APPROACH;
    persistOnboardingStep();
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_PLANT_MASTER && isNearPlantMaster()) {
    getOnboarding().flowStep = ONBOARDING_STEP_PLANT_MASTER_TALK;
    persistOnboardingStep();
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_WELL &&
    (isNearWell() || isNearBucket())
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_BUCKET_PICK;
    persistOnboardingStep();
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_TREE_APPROACH && isPlayerNearTutorialTreeArea()) {
    getOnboarding().flowStep = ONBOARDING_STEP_TREE_CLIMB;
    persistOnboardingStep();
  }
  if (getOnboarding().flowStep === ONBOARDING_STEP_TREE_CLIMB && isPlayerInTreeSpace()) {
    getOnboarding().tutorialEnteredTree = true;
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_TREE_CLIMB &&
    isPlayerInTreeSpace() &&
    isNearAnyUnpickedAppleTutorial()
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_PICK_APPLE;
    persistOnboardingStep();
  }
  if (
    getOnboarding().flowStep === ONBOARDING_STEP_EXTRA_SEED &&
    getOnboarding().tutorialEnteredTree &&
    getOnboarding().seedTutorialSecondLine &&
    !isPlayerInTreeSpace()
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_SETTINGS_ESC;
    getOnboarding().step26OpenedSettingsWithEsc = false;
    persistOnboardingStep();
  }

  ensureTutorialOnboardingRock();
  ensureTutorialOnboardingButterflies();
  updateNpcPosition();
  onboardingTryStartPlantIndexAfterSproutStage3();
}


function onboardingCheckJumpFinish() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== 4) return;
  if (getPlayer().jumpY < -0.12) {
    getOnboarding().jumpLatch = true;
  }
  if (getOnboarding().jumpLatch && getPlayer().isOnGround && getPlayer().jumpY >= 0) {
    getOnboarding().jumpLatch = false;
    getOnboarding().flowStep = 5;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
}

function tickOnboardingWaterDoneCongrats(now) {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_WATER_DONE) {
    getOnboarding().waterDoneCongratsStartedAt = 0;
    return;
  }
  if (!getOnboarding().waterDoneCongratsStartedAt) return;

  const elapsed = Math.max(0, now - getOnboarding().waterDoneCongratsStartedAt);
  const simNow = getSharedPlantSimulationNow();
  if (advanceOnboardingTutorialSproutForPlantIndex(getPlant(), simNow)) {
    saveSeedState({ bumpMergeGuard: false });
    updatePlantState();
  }
  onboardingTryStartPlantIndexAfterSproutStage3();
  if (getOnboarding().flowStep !== ONBOARDING_STEP_WATER_DONE) return;

  let nextPhase = getOnboarding().postWaterCongratsPhase;
  if (elapsed < ONBOARDING_WATER_DONE_CONGRATS_PHASE1_MS) {
    nextPhase = 0;
  } else if (elapsed < ONBOARDING_WATER_DONE_CONGRATS_END_MS) {
    nextPhase = 1;
  } else {
    nextPhase = 0;
    if (!getOnboarding().plantIndexAwaitingSprout) {
      getOnboarding().plantIndexAwaitingSprout = true;
      persistOnboardingStep();
    }
  }
  if (nextPhase !== getOnboarding().postWaterCongratsPhase) {
    getOnboarding().postWaterCongratsPhase = nextPhase;
    updateOnboardingFlowUI();
  }
}

function onboardingHookWateredMainPlantFromTutorial() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_WATER_POUR) return;
  getOnboarding().flowStep = ONBOARDING_STEP_WATER_DONE;
  getOnboarding().postWaterCongratsPhase = 0;
  getOnboarding().plantIndexAwaitingSprout = true;
  getOnboarding().waterDoneCongratsStartedAt = Date.now();
  persistOnboardingStep();
  if (getOnboarding().congratsTimerId) {
    window.clearTimeout(getOnboarding().congratsTimerId);
    getOnboarding().congratsTimerId = null;
  }
  const simNow = getSharedPlantSimulationNow();
  if (advanceOnboardingTutorialSproutForPlantIndex(getPlant(), simNow)) {
    saveSeedState({ bumpMergeGuard: false });
    updatePlantState();
  }
  onboardingTryStartPlantIndexAfterSproutStage3();
  updateOnboardingFlowUI();
}

function onboardingHookFilledBucketAtWell() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_BUCKET_FILL) return;
  getOnboarding().flowStep = ONBOARDING_STEP_WATER_APPROACH;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function onboardingHookDroppedBucketForTutorial() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_DROP_BUCKET) {
    return;
  }
  getOnboarding().flowStep = ONBOARDING_STEP_CHAT;
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function onboardingHookTutorialRockPicked() {
  if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_ROCK) return;
  getOnboarding().flowStep = ONBOARDING_STEP_BUTTERFLY;
  getOnboarding().butterflyCountBaseline = getTotalCaughtButterflies();
  persistOnboardingStep();
  updateOnboardingFlowUI();
}

function pickUpWorldGuideBookNoHold() {
  if (isOnboardingLinearGateActive()) {
    if (getOnboarding().flowStep !== ONBOARDING_STEP_PICK_BOOK) return false;
  }
  if (!isNearGuideBook()) return false;
  getWorldItems().hasGuideBook = true;
  getWorldItems().isGuideBookOpen = false;
  setGuideBookPickedForCurrentRoom();
  setWorldGuideBookOffGroundPickedForCurrentRoom();
  if (isTutorialDocumentEntry()) {
    setTutorialSessionWorldGuideBookOffGroundPicked();
  }
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  updateGuideCard();
  updateBagInventorySlots();
  if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === ONBOARDING_STEP_PICK_BOOK) {
    getOnboarding().flowStep = ONBOARDING_STEP_BOOK_INV;
    getOnboarding().bookInvPhase = 0;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
}

function pickUpWorldBag() {
  if (isOnboardingLinearGateActive()) {
    if (getWorldItems().hasGuideBook) return false;
    if (getOnboarding().flowStep !== 1) return false;
  }
  if (!isNearWorldBagPickup()) return false;

  if (worldSocialUiReady && worldChatPanelOpen) {
    setWorldChatPanelOpen(false);
  }

  getWorldItems().hasGuideBook = true;
  getWorldItems().isGuideBookOpen = false;
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
  if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === 1) {
    getOnboarding().flowStep = 3;
    getOnboarding().inventoryIntroPhase = 0;
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
  getWorldItems().hasGuideBook = hasPickedGuideBookInCurrentRoom();
  if (getWorldItems().hasGuideBook) {
    setStoredFlag(movementTutorialCompleteKey, true);
    movementTutorial.resetMotionState();
    if (isWorldDocumentEntry() && !hasPickedWorldBagGroundInCurrentRoom()) {
      setWorldBagGroundPickedForCurrentRoom();
    }
    if (isTutorialDocumentEntry() && !readTutorialSessionFloorBagPicked()) {
      writeTutorialSessionFloorBagPicked();
    }
  }
  getNpc().isDialogueComplete = getStoredFlag(npcDialogueCompleteKey);
  hydrateTradeMasterDialogueComplete(getStoredFlag(tradeMasterDialogueCompleteKey));
  hydrateAlchemyMasterDialogueComplete(getStoredFlag(alchemyMasterDialogueCompleteKey));
  loadCraftFurnitureCounts();
  loadPlayerHealth();
  loadColoredMagicPowderCounts();
  getNpc().isGuidePlantPageUnlocked = getStoredFlag(guidePlantPageUnlockedKey);
  const promptDismissed = getStoredFlag(guideBookClickPromptDismissedKey);
  getWorldItems().isGuideBookClickPromptActive =
    getWorldItems().hasGuideBook && getNpc().isGuidePlantPageUnlocked && !promptDismissed;
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

    setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
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

function resetTutorialForTesting() {
  const now = Date.now();
  if (now - lastDevWorldResetAt < 350) return;
  if (isDevWorldResetInProgress) return;
  if (!isTutorialDocumentEntry()) return;
  if (!ovcBootstrapFinished) {
    markPendingDevTutorialReset();
    return;
  }
  lastDevWorldResetAt = now;
  isDevWorldResetInProgress = true;
  try {
    try {
      sessionStorage.setItem(ovcTutorialReplaySessionKey, "1");
      sessionStorage.setItem(ovcTutorialWorldResetPendingKey, "1");
    } catch (eReplay) {}
    setOnboardingFlowDoneStored(false);
    getOnboarding().seedTutorialSecondLine = false;
    getOnboarding().tutorialEnteredTree = false;
    getOnboarding().tutorialMainSeedRegenCompleted = false;
    clearTutorialMainSeedRespawnTimer();
    resetTutorialProgressInStorage({ force: true });
    movementTutorial.resetMotionState();
    if (!applyTutorialWorldResetIfPending()) {
      applyDefaultState();
      clearTutorialSessionWorldFloorPickupFlags();
      loadGuideBookState(true);
      setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
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
    }
    updateNpcPosition();
    updateGuidePages();
    updateGuideCard();
    syncWorldPlantFogVisuals();
    showThrottledWorldSyncToast("\uD29C\uD1A0\uB9AC\uC5BC\uC774 \uCD08\uAE30\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
  } catch (devTutorialResetError) {
    console.error("[OVC] dev tutorial reset failed:", devTutorialResetError);
    showThrottledWorldSyncToast(
      "\uCD08\uAE30\uD654\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uCF5C\uC194\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694."
    );
  } finally {
    isDevWorldResetInProgress = false;
    dismissAppLoadingScreenAfterDevReset();
    ovcTryDismissLoadingScreen(true);
  }
}

bootDevReset(
  resetGameForTesting,
  resetTutorialForTesting,
  isWorldDocumentEntry,
  isTutorialDocumentEntry
);

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
  getPlayer().x = spawnPlayerX;
  getPlayer().depth = spawnPlayerDepth;
  getPlayer().jumpY = 0;
  getPlayer().velocityY = 0;
  getPlayer().isOnGround = true;
  getPlayer().isTreeFalling = false;
  getPlayer().wasInTree = false;
  getInventory().plantingInventorySeedId = null;
  setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  savePlayerPosition(true);
}

function settlePlayerBeforeBackground() {
  const groundMaxDepth = getMaxGroundedPlayerDepth();
  if (getPlayer().depth > groundMaxDepth && !isPlayerSupportedByTree()) {
    getPlayer().depth = groundMaxDepth;
    getPlayer().jumpY = 0;
    getPlayer().velocityY = 0;
    getPlayer().isOnGround = true;
    getPlayer().isTreeFalling = false;
    getPlayer().wasInTree = false;
    setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
    updatePlayerColorBodyPosition();
  }
}

function applyDefaultState(options) {
  clearTutorialMainSeedRespawnTimer();
  getOnboarding().tutorialMainSeedRegenCompleted = false;
  const sharedWorldResetOnly =
    Boolean(options && options.sharedWorldResetOnly);
  abortPlantMasterDialogue();
  if (sharedWorldResetOnly) {
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (ePending) {}
  }
  resetInputKeys(keys);

  getPlayer().health = PLAYER_MAX_HEALTH;
  getPlayer().lastHealthTickAt = 0;
  getPlayer().wasDrainingHealth = false;
  getPlayer().idleRechargeSince = 0;
  getPlayer().idleRechargeHealTicks = 0;
  getPlayer().healthDrainDebt = 0;
  getPlayer().healthGaugeVisible = true;
  getPlayer().insideCraftHouseId = "";
  getPlayer().outsideCraftHousePose = null;
  getPlayer().healthPoseInitialized = false;
  resetPlayerChairSitState();
  exitCraftHouse();

  getPlayer().x = spawnPlayerX;
  getPlayer().depth = spawnPlayerDepth;
  getPlayer().jumpY = 0;
  getPlayer().velocityY = 0;
  getPlayer().isOnGround = true;
  getPlayer().wasInTree = false;
  getNpc().x = NPC_START_X;
  getNpc().y = NPC_START_Y;

  getWorldItems().seedX = SEED_START_X;
  getWorldItems().seedY = SEED_START_Y;
  getWorldItems().signX = SIGN_START_X;
  getWorldItems().signY = SIGN_START_Y;
  getWorldItems().guideBookX = GUIDE_BOOK_START_X;
  getWorldItems().guideBookY = GUIDE_BOOK_START_Y;
  getWorldItems().worldBagX = WORLD_BAG_START_X;
  getWorldItems().worldBagY = WORLD_BAG_START_Y;
  getPlant().seedCreatedAt = Date.now();
  setStoredValue(seedCreatedAtKey, String(getPlant().seedCreatedAt));
  getPlant().isSeedDry = false;
  getSeedWorld().isMainSeedAvailable = true;
  getSeedWorld().lastMainSeedStateChangeAt = Date.now();
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
  clearCraftFurnitureInstalling();
  resetInventoryRuntimeFields(getInventory());
  resetPlantRuntimeFields(getPlant(), getSharedPlantSimulationNow());

  if (!sharedWorldResetOnly) {
    getWorldItems().hasGuideBook = false;
    getWorldItems().isGuideBookOpen = false;
    getWorldItems().isGuideBookClickPromptActive = false;
    movementTutorial.resetMotionState();
    getOnboarding().flowStep = 1;
    getOnboarding().jumpLatch = false;
    getOnboarding().npcGuideEscHintShown = false;
    getOnboarding().seedTutorialSecondLine = false;
    getOnboarding().postAppleSeedIntroPhase = 0;
    getOnboarding().postWaterCongratsPhase = 0;
    getOnboarding().waterDoneCongratsStartedAt = 0;
    getOnboarding().butterflyCountBaseline = null;
    getOnboarding().tutorialEnteredTree = false;
    onboardingClearAllOnboardingTimers();
    setOnboardingFlowDoneStored(false);
    setStoredValue(onboardingFlowStepKey, "1");
    getWorldItems().isGuideDismissedAtSign = false;
    getSeedWorld().hasHandledDryMainSeed = false;
    getSeedWorld().dryMainSeedVisibleSince = 0;
    setStoredFlag(mainDrySeedHandledKey, false);
    getNpc().isDialogueRunning = false;
    getNpc().isDialogueComplete = false;
    getNpc().isGuidePlantPageUnlocked = false;
    setStoredFlag(npcDialogueCompleteKey, false);
    setStoredFlag(guidePlantPageUnlockedKey, false);
    getNpc().guidePageIndex = 0;
  } else {
    getWorldItems().hasGuideBook = false;
    onboardingClearAllOnboardingTimers();
    getWorldItems().isGuideDismissedAtSign = false;
    getSeedWorld().hasHandledDryMainSeed = false;
    getSeedWorld().dryMainSeedVisibleSince = 0;
    setStoredFlag(mainDrySeedHandledKey, false);
    getNpc().isDialogueRunning = false;
    getWorldItems().isGuideBookOpen = false;
    getWorldItems().isGuideBookClickPromptActive = false;
    movementTutorial.resetMotionState();
    getNpc().guidePageIndex = 0;
  }
  getPlayer().isTreeFalling = false;
  getPlayer().wasInTree = false;
  getApple().count = 0;
  getApple().seedCount = 0;
  getApple().overgrowthSeedCount = 0;
  getApple().pickedIds = [];
  getApple().isEating = false;
  getApple().nextSeedOffset = 0;
  getApple().apples = createRandomApples(5);
  getApple().lastSpawnAt = Date.now();
  clearExtraSeedAndPlantElements();
  getApple().extraSeeds = [];
  getApple().extraPlants = [];
  getApple().worldLooseSeed = {
    x: WORLD_LOOSE_SEED_X,
    y: WORLD_LOOSE_SEED_Y,
    nextSpawnAt: 0
  };
  getApple().worldRocks = createRandomWorldRocks(buildWorldRockSpawnContext());
  getApple().worldRockPickedIds = [];
  getApple().worldExtraBuckets = [];
  getApple().worldBagDrops = [];
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

  getWell().water = maxWellWater;
  getWell().lastRefillAt = Date.now();
  getInventory().isBucketFull = false;
  getInventory().heldBucketId = "";
  getInventory().heldExtraBucketMainX = 0;
  getInventory().heldExtraBucketMainY = 0;
  getInventory().heldExtraBucketMainIsFull = false;
  getInventory().mainBucketParkedX = 0;
  getInventory().mainBucketParkedY = 0;
  getInventory().mainBucketParkedIsFull = false;
  getWorldItems().bucketX = getWorldItems().wellX - BUCKET_SIZE - 8;
  getWorldItems().bucketY = getWorldItems().wellY + WELL_SIZE - BUCKET_SIZE;

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
  getSeedWorld().hasShownFirstSeedFocus = false;
  window.clearTimeout(getSeedWorld().firstSeedFocusTimeout);
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
  setWorldPosition(signBoard, getWorldItems().signX, getWorldItems().signY);
  setWorldPosition(guideBook, getWorldItems().guideBookX, getWorldItems().guideBookY);
  if (worldBag) setWorldPosition(worldBag, getWorldItems().worldBagX, getWorldItems().worldBagY);
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
  if (!getPlant().isSeedPlanted) return false;

  return isNearPlantSpotWithin(pickupDistance);
}

function isNearPlantSpotForWatering() {
  return getNearestWateringTarget() !== null;
}

function isNearPlantSpotWithin(distance) {
  return (
    getCenterDistance(
      getPlant().spotX,
      getPlant().spotY,
      PLANT_SPOT_WIDTH,
      PLANT_SPOT_HEIGHT
    ) < distance
  );
}

function isPlantMasterVisible() {
  if (getNpc().isDialogueRunning) return true;
  if (!getNpc().isDialogueComplete) {
    return true;
  }
  /** ???????????????????????? ???*/
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    return true;
  }
  /** ????: ???????????????? ??? ??? ?????????? ?????? */
  if (!getPlant().isSeedPlanted) {
    return true;
  }
  /** ??? ??????????????????????? ???????UI ??? */
  return getPlant().status !== "rotten";
}

function isNearPlantMaster() {
  if (!isPlantMasterVisible()) return false;

  return getCenterDistance(getNpc().x, getNpc().y, NPC_WIDTH, NPC_HEIGHT) < npcInteractDistance;
}

function tryTalkToPlantMaster() {
  if (!isNearPlantMaster()) {
    return false;
  }
  if (getNpc().isDialogueRunning) {
    return true;
  }
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_PLANT_MASTER_TALK) {
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
  getNpc().isDialogueRunning = false;
  if (npcBubble) {
    npcBubble.style.display = "none";
    npcBubble.dataset.promptShown = "false";
  }
  if (playerBubble) {
    playerBubble.style.display = "none";
  }
  window.clearTimeout(getNpc().promptHideTimeout);
}

function startPlantMasterDialogue() {
  abortPlantMasterDialogue();
  const isFirstTalk = !getNpc().isDialogueComplete;
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

  getNpc().isDialogueRunning = true;
  npcBubble.style.display = "none";
  playerBubble.style.display = "none";
  window.clearTimeout(getNpc().promptHideTimeout);

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
    getNpc().isDialogueRunning = false;
    npcBubble.dataset.promptShown = "false";
    if (isFirstTalk) {
      getNpc().isDialogueComplete = true;
      getNpc().isGuidePlantPageUnlocked = true;
      getWorldItems().hasGuideBook = true;
      setGuideBookPickedForCurrentRoom();
      setWorldBagGroundPickedForCurrentRoom();
      setWorldGuideBookOffGroundPickedForCurrentRoom();
      syncWorldBagGroundVisibility();
      syncGuideInventoryBar();
      setStoredFlag(npcDialogueCompleteKey, true);
      setStoredFlag(guidePlantPageUnlockedKey, true);
      getWorldItems().isGuideBookClickPromptActive = true;
      setStoredFlag(guideBookClickPromptDismissedKey, false);
      showPlayerAlert();
      getNpc().guidePageIndex = 0;
      getWorldItems().isGuideBookOpen = true;
      if (!getStoredFlag(onboardingFlowDoneKey)) {
        if (getOnboarding().flowStep === ONBOARDING_STEP_PLANT_MASTER_TALK) {
          onboardingClearEscHintTimer();
          getOnboarding().npcGuideEscHintShown = false;
          getOnboarding().flowStep = ONBOARDING_STEP_NPC_GUIDE;
        } else if (getOnboarding().flowStep < 3) {
          getOnboarding().flowStep = 3;
          getOnboarding().inventoryIntroPhase = 0;
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



function toggleSeed() {
  if (getPlant().isPlanting || getInventory().heldItem) return;
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
  if (isOnboardingLinearGateActive() && !onboardingAllowsBucketGroundPickup()) {
    flashOnboardingOrderHint("");
    return true;
  }
  getInventory().heldBucketId = MAIN_BUCKET_ID;
  if (pickInfo && pickInfo.type === "extra" && Array.isArray(getApple().worldExtraBuckets)) {
    const extraIndex = getApple().worldExtraBuckets.findIndex(function (entry) {
      return entry && String(entry.id) === String(pickInfo.id);
    });
    if (extraIndex >= 0) {
      const extra = getApple().worldExtraBuckets[extraIndex];
      getInventory().heldBucketId = String(extra.id || pickInfo.id || "");
      getInventory().heldExtraBucketMainX = getWorldItems().bucketX;
      getInventory().heldExtraBucketMainY = getWorldItems().bucketY;
      getInventory().heldExtraBucketMainIsFull = Boolean(getInventory().isBucketFull);
      getInventory().isBucketFull = Boolean(extra.isFull);
      getApple().worldExtraBuckets.splice(extraIndex, 1);
      if (extra._el) {
        extra._el.remove();
        extra._el = null;
      }
      getInventory().mainBucketParkedX = 0;
      getInventory().mainBucketParkedY = 0;
      getInventory().mainBucketParkedIsFull = false;
    }
  } else {
    getInventory().mainBucketParkedX = getWorldItems().bucketX;
    getInventory().mainBucketParkedY = getWorldItems().bucketY;
    getInventory().mainBucketParkedIsFull = Boolean(getInventory().isBucketFull);
    getInventory().heldExtraBucketMainX = 0;
    getInventory().heldExtraBucketMainY = 0;
    getInventory().heldExtraBucketMainIsFull = false;
  }
  const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
  getWorldItems().bucketX = handPosition.x;
  getWorldItems().bucketY = handPosition.y;
  getInventory().heldItem = HELD_ITEM_BUCKET;
  getSeedWorld().lastBucketPickupAt = Date.now();
  window.OVC_SHARED_BUCKET_HELD_BY = getInventory().heldBucketId === MAIN_BUCKET_ID ? currentSessionId : "";
  markWorldDirty();
  if (getInventory().heldBucketId === MAIN_BUCKET_ID) {
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
    if (
      getOnboarding().flowStep === ONBOARDING_STEP_BUCKET_PICK ||
      getOnboarding().flowStep === ONBOARDING_STEP_WELL
    ) {
      getOnboarding().flowStep = ONBOARDING_STEP_BUCKET_FILL;
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
      if (!canPickWorldLooseSeedAt(getApple().worldLooseSeed, worldLoosePickupLockUntil, now)) {
        return;
      }
      getApple().seedCount += 1;
      scheduleWorldLooseRespawnAfterPickup(getApple().worldLooseSeed, now);
      lastWorldLooseSeedPickupAt = Math.max(lastWorldLooseSeedPickupAt, now);
      worldLoosePickupLockUntil = Math.max(
        Number(worldLoosePickupLockUntil || 0),
        Number(getApple().worldLooseSeed.nextSpawnAt || 0)
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
    if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
    ? getCenterDistance(getWorldItems().seedX, getWorldItems().seedY, seedSize.width, seedSize.height)
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
    if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== 6) {
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
    if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
  if (getSeedWorld().hasShownFirstSeedFocus) return;

  getSeedWorld().hasShownFirstSeedFocus = true;
  if (worldBagInventory) worldBagInventory.classList.add("is-first-seed-focus");
  window.clearTimeout(getSeedWorld().firstSeedFocusTimeout);
  getSeedWorld().firstSeedFocusTimeout = window.setTimeout(function () {
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
    canPickWorldLooseSeedAt(getApple().worldLooseSeed, worldLoosePickupLockUntil, now)
  ) {
    ensureWorldLooseSeedShape();
    const ws = getApple().worldLooseSeed;
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

  getApple().extraSeeds.forEach(function (extraSeed) {
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
    return getOnboarding().flowStep >= ONBOARDING_STEP_EXTRA_SEED;
  }
  return getOnboarding().flowStep === ONBOARDING_STEP_ROCK;
}

/** @returns {boolean} ?? ?? */
function tryPickupWorldRock(rock) {
  if (!rock || rock.id == null || rock.id === "") return false;
  if (getApple().worldRockPickedIds.includes(rock.id)) return false;
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
  getApple().worldRockPickedIds.push(rock.id);
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
    isOnboardingLinearGateActive() && getOnboarding().flowStep === ONBOARDING_STEP_ROCK;
  if (!isWorldDocumentEntry() && !tutorialRockStep) return null;
  if (isWorldDocumentEntry() && !isWorldRockPickupUnlocked()) return null;
  if (!Array.isArray(getApple().worldRocks) || !Array.isArray(getApple().worldRockPickedIds)) {
    return null;
  }
  let nearest = null;
  let bestDist = Infinity;
  getApple().worldRocks.forEach(function (rock) {
    if (getApple().worldRockPickedIds.includes(rock.id)) return;
    const sz = Number(rock.size) || WORLD_ROCK_SIZE;
    const distance = getCenterDistance(rock.x, rock.y, sz, sz);
    if (distance < bestDist) {
      bestDist = distance;
      nearest = { rock, distance };
    }
  });
  return nearest;
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

  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    return;
  }

  if (
    isPlayerTimedActionBusy() ||
    isPlayerGameplayBlockedByNpcDialogue() ||
    !getPlayer().isOnGround
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
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_PICK_APPLE) {
    return false;
  }
  respawnApplesIfNeeded();
  const apple = getApple().apples.find(function (candidate) {
    return !getApple().pickedIds.includes(candidate.id) && isPlayerOverlappingRect(
      candidate.x,
      candidate.y,
      candidate.size,
      candidate.size
    );
  });

  if (!apple) return false;

  getApple().pickedIds.push(apple.id);
  getApple().lastSpawnAt = Date.now();
  localApplePickedAtById[apple.id] = getApple().lastSpawnAt;
  getApple().count += 1;
  saveAppleState();
  updateApples();
  if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === ONBOARDING_STEP_PICK_APPLE) {
    getOnboarding().flowStep = ONBOARDING_STEP_EAT_APPLE;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
}

function isPlayerOverlappingRect(x, y, width, height) {
  const playerRect = {
    left: getPlayer().x,
    right: getPlayer().x + PLAYER_WIDTH,
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


function eatApple() {
  if (
    getApple().count <= 0 ||
    isPlayerTimedActionBusy() ||
    isPlayerGameplayBlockedByNpcDialogue()
  ) {
    return;
  }
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EAT_APPLE) {
    flashOnboardingOrderHint("");
    return;
  }

  getApple().count -= 1;
  getApple().isEating = true;
  playerStatus.textContent = "\uC0AC\uACFC\uBA39\uB294\uC911...";
  saveAppleState();
  updateApples();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    getApple().isEating = false;
    sendMultiplayerPresence(true);
    playerStatus.textContent = "";
    getPlayer().health = healPlayerHealth(getPlayer().health, PLAYER_APPLE_HEAL_AMOUNT);
    savePlayerHealthState();
    createSeedFromApple();
    if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === ONBOARDING_STEP_EAT_APPLE) {
      getOnboarding().flowStep = ONBOARDING_STEP_EXTRA_SEED;
      getOnboarding().seedTutorialSecondLine = false;
      getOnboarding().postAppleSeedIntroPhase = 0;
      persistOnboardingStep();
      if (getOnboarding().fruitIntroTimerId) {
        window.clearTimeout(getOnboarding().fruitIntroTimerId);
      }
      getOnboarding().fruitIntroTimerId = window.setTimeout(function () {
        getOnboarding().fruitIntroTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_EXTRA_SEED) {
          return;
        }
        getOnboarding().postAppleSeedIntroPhase = 1;
        updateOnboardingFlowUI();
      }, 2000);
      if (getOnboarding().treeLeaveHintTimerId) {
        window.clearTimeout(getOnboarding().treeLeaveHintTimerId);
      }
      getOnboarding().treeLeaveHintTimerId = window.setTimeout(function () {
        getOnboarding().treeLeaveHintTimerId = null;
        if (getStoredFlag(onboardingFlowDoneKey) || getOnboarding().flowStep !== ONBOARDING_STEP_EXTRA_SEED) {
          return;
        }
        getOnboarding().seedTutorialSecondLine = true;
        updateOnboardingFlowUI();
      }, 5000);
      updateOnboardingFlowUI();
    }
  }, appleEatMs);
}

function createSeedFromApple() {
  if (usesWorldLooseSeedMode()) {
    getApple().seedCount += 1;
    updateExtraSeedsAndPlants();
    updateSeedInventory();
    saveAppleState();
    return;
  }
  const playerBox = getPlayerBox();
  const seedXFromApple = playerBox.left + playerBox.width / 2 - SEED_SIZE / 2;
  const seedYFromApple = playerBox.bottom - SEED_SIZE + getApple().nextSeedOffset;
  const seedNumber = getNextSeedNumber();

  getApple().nextSeedOffset += 2;
  const newSeed = {
    id: "apple-seed-" + Date.now() + "-" + getApple().extraSeeds.length,
    x: seedXFromApple,
    y: seedYFromApple,
    createdAt: Date.now(),
    planted: false,
    inInventory: true,
    label: "\uC528\uC557" + seedNumber,
    isStarter: false
  };
  assignExtraSeedInventoryOwner(newSeed);

  getApple().extraSeeds.push(newSeed);

  updateExtraSeedsAndPlants();
  updateSeedInventory();
  saveAppleState();
}

function getNextSeedNumber() {
  return getApple().extraSeeds.length + 1;
}



/** ??????UI(???NPC?????? ???????? ???*/
const WORLD_ROCK_UI_CLEAR_PAD = 10;












function getWorldExtraBucketInsertBeforeEl() {
  if (localPlayerRoot && localPlayerRoot.parentNode === ground) {
    return localPlayerRoot;
  }
  if (player && player.parentNode === ground) {
    return player;
  }
  return null;
}


function getGroundBucketZIndex(worldY) {
  const y = Number(worldY);
  if (!Number.isFinite(y)) return 17;
  return Math.min(18, Math.max(4, 4 + Math.floor(y / 28)));
}

/** ?? ??? ???? ?? ???? ?? ??? ?? ???? ?? ??? ?? ?? */
function isWorldExtraBucketOverlappingSharedMain(entry) {
  if (!entry || isMainBucketHeldByRemotePlayer() || isHoldingMainBucket()) return false;
  if (isHoldingExtraBucket() && String(entry.id) === String(getInventory().heldBucketId || "")) return false;
  const main = getMainBucketGroundState();
  const ex = Number(entry.x) || 0;
  const ey = Number(entry.y) || 0;
  const mx = Number(main.x) || 0;
  const my = Number(main.y) || 0;
  return Math.abs(ex - mx) < 4 && Math.abs(ey - my) < 4;
}







function getLocalBagDropSpawnPosition() {
  const x = snapBagDropCoord(getPlayerCenterX() - BAG_DROP_WORLD_SIZE / 2);
  const y = snapBagDropCoord(getPlayerFootY() + BAG_DROP_FOOT_OFFSET_Y);
  return { x: x, y: y };
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
  getApple().worldBagDrops.push(drop);
  lastWorldBagDropChangeAt = now;
  getApple().lastStateChangeAt = Math.max(getApple().lastStateChangeAt, now);
  updateWorldBagDropDom();
  markWorldDirty();
  broadcastWorldBagDrop(drop);
  syncWorldState(true);
  return drop;
}


function tryPickWorldBagDrop(bucketDistance) {
  if (!canUseBagInventoryGameplay()) return false;
  ensureWorldBagDropsArray();
  if (!getApple().worldBagDrops.length) return false;
  const info = findNearestWorldBagDropPickup(
    getApple().worldBagDrops,
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
  const idx = getApple().worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return false;
  teardownWorldBagDropDom(getApple().worldBagDrops[idx]);
  getApple().worldBagDrops.splice(idx, 1);
  addBagItemsForTrade(itemKey, count);
  const now = Date.now();
  lastWorldBagDropChangeAt = now;
  getApple().lastStateChangeAt = Math.max(getApple().lastStateChangeAt, now);
  holdLocalAppleStateAgainstStaleSnapshot(1200);
  updateWorldBagDropDom();
  markWorldDirty();
  broadcastWorldBagDropPickup(dropId);
  syncWorldState(true);
  sendMultiplayerPresence(true);
  return true;
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
  const localPending = getApple().worldBagDrops.filter(function (drop) {
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
  getApple().worldBagDrops.forEach(function (drop) {
    if (!byId[String(drop.id)]) {
      teardownWorldBagDropDom(drop);
    }
  });
  getApple().worldBagDrops = next;
}

function serializeWorldBagDropsForSnapshot() {
  ensureWorldBagDropsArray();
  const syncNow = getSynchronizedNow();
  return getApple().worldBagDrops
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
  const existing = getApple().worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === id;
  });
  if (existing >= 0) {
    teardownWorldBagDropDom(getApple().worldBagDrops[existing]);
    getApple().worldBagDrops[existing] = drop;
  } else {
    getApple().worldBagDrops.push(drop);
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
  const idx = getApple().worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return;
  teardownWorldBagDropDom(getApple().worldBagDrops[idx]);
  getApple().worldBagDrops.splice(idx, 1);
  updateWorldBagDropDom();
}



function canStartBagPanelCraftTradeDrag(itemKey) {
  if (!itemKey) return false;
  if (isAlchemyCraftOpen()) return canDragBagItemToAlchemyCraft(itemKey);
  if (isTradeExchangeOpen()) return canDragBagItemToTradeCounter(itemKey);
  return false;
}







/** ?? ?? ?? + ?? ?? ??(??/?? ? ?? ?? UI) */

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
    delete mergedById[String(getInventory().heldBucketId || "")];
  }
  (Array.isArray(getApple().worldExtraBuckets) ? getApple().worldExtraBuckets : []).forEach(
    function (entry) {
      if (!entry || !entry.id) return;
      const id = String(entry.id);
      if (isHoldingExtraBucket() && id === String(getInventory().heldBucketId || "")) return;
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
  getApple().worldExtraBuckets = Object.keys(mergedById).map(function (id) {
    return mergedById[id];
  });
}

/** ???? ????: ?? ????????? ????????? ???????? ????? ????? */
function spawnWorldBucketBelowTradeMaster() {
  if (!ground || !isWorldDocumentEntry()) return;
  if (!Array.isArray(getApple().worldExtraBuckets)) getApple().worldExtraBuckets = [];
  const bucketSz = getBucketSize();
  const baseX = TRADE_MASTER_START_X + Math.max(0, Math.floor((NPC_WIDTH - bucketSz.width) / 2));
  const baseY = TRADE_MASTER_START_Y + NPC_HEIGHT + 3;
  const stack = getApple().worldExtraBuckets.length;
  const entry = {
    id: "world-bucket-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
    x: baseX + stack * 5,
    y: baseY,
    isFull: false
  };
  getApple().worldExtraBuckets.push(entry);
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
      getPlant().isSeedPlanted &&
      Number.isFinite(getPlant().spotX) &&
      Number.isFinite(getPlant().spotY) &&
      (getPlant().spotX !== 0 || getPlant().spotY !== 0)
        ? { x: getPlant().spotX, y: getPlant().spotY }
        : null
  });

  getApple().count = loaded.appleCount;
  getApple().seedCount = Math.max(0, Number(loaded.seedCount) || 0);
  getApple().overgrowthSeedCount = Math.max(0, Number(loaded.overgrowthSeedCount) || 0);
  getApple().apples = loaded.apples;
  getApple().pickedIds = loaded.pickedAppleIds;
  getApple().nextSeedOffset = loaded.nextAppleSeedOffset;
  getApple().lastSpawnAt = loaded.lastAppleSpawnAt;
  getApple().extraSeeds = loaded.extraSeeds;
  getApple().extraPlants = loaded.extraPlants;
  getApple().worldLooseSeed = loaded.worldLooseSeed
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
  getApple().worldRocks = Array.isArray(loaded.worldRocks) ? loaded.worldRocks : [];
  placedCraftFurniture = parsePlacedCraftFurnitureFromSnapshot(loaded.placedCraftFurniture);
  getApple().worldExtraBuckets = Array.isArray(loaded.worldExtraBuckets)
    ? loaded.worldExtraBuckets
    : [];
  getApple().worldRockPickedIds = Array.isArray(loaded.worldRockPickedIds)
    ? loaded.worldRockPickedIds.map(String).filter(function (id, idx, arr) {
        return arr.indexOf(id) === idx;
      })
    : [];
  ensureWorldLooseSeedShape();
  if (usesWorldLooseSeedMode()) {
    let migrateInvToCount = 0;
    getApple().extraSeeds.forEach(function (s) {
      if (s && s.inInventory && !s.planted) {
        migrateInvToCount += 1;
      }
    });
    getApple().seedCount += migrateInvToCount;
    getApple().extraSeeds = getApple().extraSeeds.filter(function (s) {
      return s && s.planted;
    });
    getApple().extraSeeds.forEach(function (s) {
      if (s.inventoryElement) {
        s.inventoryElement.remove();
        s.inventoryElement = undefined;
        s.inventoryImage = undefined;
      }
    });
    if (sanitizeWorldLooseModeExtraSeeds()) {
      saveAppleStateToStorage({
        appleStateKey,
        appleCount: getApple().count,
        seedCount: getApple().seedCount,
        overgrowthSeedCount: getApple().overgrowthSeedCount,
        apples: getApple().apples,
        pickedAppleIds: getApple().pickedIds,
        nextAppleSeedOffset: getApple().nextSeedOffset,
        lastAppleSpawnAt: getApple().lastSpawnAt,
        extraSeeds: getApple().extraSeeds,
        extraPlants: getApple().extraPlants,
        worldLooseSeed: getApple().worldLooseSeed,
        worldRocks: getApple().worldRocks,
        worldRockPickedIds: getApple().worldRockPickedIds,
        worldExtraBuckets: getApple().worldExtraBuckets,
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


function loadBucketState() {
  const savedRaw = getStoredValue(bucketStateKey);
  if (!savedRaw) return;

  try {
    const saved = JSON.parse(savedRaw);
    getInventory().isBucketFull = Boolean(saved.isBucketFull);
    if (saved.heldItem === HELD_ITEM_BUCKET) {
      // Carrying is transient input state, not persisted world state.
      // Old saves may contain hand-position coordinates; reset those to the well.
      const bucketSize = getBucketSize();
      getWorldItems().bucketX = getWorldItems().wellX - bucketSize.width - 8;
      getWorldItems().bucketY = getWorldItems().wellY + WELL_SIZE - bucketSize.height;
    } else {
      getWorldItems().bucketX = Number.isFinite(Number(saved.bucketX)) ? Number(saved.bucketX) : getWorldItems().bucketX;
      getWorldItems().bucketY = Number.isFinite(Number(saved.bucketY)) ? Number(saved.bucketY) : getWorldItems().bucketY;
    }
    getInventory().heldItem = null;
    getInventory().heldBucketId = "";
    getInventory().heldExtraBucketMainX = 0;
    getInventory().heldExtraBucketMainY = 0;
    getInventory().heldExtraBucketMainIsFull = false;
    getInventory().mainBucketParkedX = 0;
    getInventory().mainBucketParkedY = 0;
    getInventory().mainBucketParkedIsFull = false;
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


/** Network/Sync — src/script/network/ (poll·snapshot·presence·debug) */
function buildNetworkDeps() {
  return {
    HELD_ITEM_BUCKET,
    MAIN_BUCKET_ID,
    REMOTE_BUTTERFLY_CATCH_ACTION_MS,
    WORLD_ROCK_PICKUP_ACTION_MS,
    WORLD_ROCK_SIZE,
    PLANT_SPOT_WIDTH,
    WATER_NEEDED_SIZE,
    accountDisplayNameForUi,
    addBucketTrace,
    get adminDebugPlantIndexBonus() { return adminDebugPlantIndexBonus; },
    set adminDebugPlantIndexBonus(v) { adminDebugPlantIndexBonus = v; },
    appStorageKeysSharedWorldReset,
    applyButterflySnapshot,
    applyDefaultState,
    applyLoadedPlantState,
    applyPlantWaterDecay,
    applyRemoteSharedMainBucketGround,
    applyRemoteSharedMainBucketHeldPose,
    applyWorldExtraBucketsFromSharedSnapshot,
    clearGroundExtraSeedElementsOnly,
    clearMainSeedPickedForCurrentRoom,
    clearMultiplayerReconnectTimeout,
    clearMultiplayerRoomSessionTracking,
    clearStoredKeys,
    craftFurnitureInstallingKind,
    get currentSessionId() { return currentSessionId; },
    set currentSessionId(v) { currentSessionId = v; },
    currentUserId,
    dropBucket,
    ensureExtraPlantElements,
    ensureSharedPlantVisuals,
    ensureWorldLooseSeedShape,
    extraSeedHasCorrespondingExtraPlant,
    getApple,
    getButterflyStateForSnapshot,
    getCraftFurnitureInstallPresenceAction,
    getInventory,
    getMainBucketGroundState,
    getMainDryAfterEmptyMsForPlant,
    getExtraDryDelayMs,
    appleRespawnMs,
    parseTreeAppleFromSnapshot,
    get localApplePickedAtById() { return localApplePickedAtById; },
    set localApplePickedAtById(v) { localApplePickedAtById = v; },
    get worldLoosePickupLockUntil() { return worldLoosePickupLockUntil; },
    set worldLoosePickupLockUntil(v) { worldLoosePickupLockUntil = v; },
    getMultiplayerWorldPollMinMs,
    getNpc,
    getPlant,
    getPlantSoilSrc,
    getPlantStateForStorage,
    getPlayer,
    getSeedWorld,
    getSharedPlantSimulationNow,
    getSynchronizedNow,
    getWell,
    getWorldItems,
    handleRemoteBucketBroadcast,
    handleRemoteButterflyCatchBroadcast,
    handleRemoteButterflyStateBroadcast,
    handleRemoteWorldBagDropBroadcast,
    handleRemoteWorldBagDropPickupBroadcast,
    handleWorldChatBroadcast,
    handleWorldHeartBroadcast,
    handleRemoteWorldLooseSeedPickupBroadcast,
    handleRemoteWorldRockPickupBroadcast,
    handleWorldSadBroadcast,
    get hasHydratedSharedWorldFromServer() { return hasHydratedSharedWorldFromServer; },
    set hasHydratedSharedWorldFromServer(v) { hasHydratedSharedWorldFromServer = v; },
    hasPickedMainSeedInCurrentRoom,
    hasSpawnedCharacter,
    get ignoreSnapshotInventorySeedsUntil() { return ignoreSnapshotInventorySeedsUntil; },
    set ignoreSnapshotInventorySeedsUntil(v) { ignoreSnapshotInventorySeedsUntil = v; },
    invalidateGroundSeedElementRefsOnly,
    get isApplyingWorldState() { return isApplyingWorldState; },
    set isApplyingWorldState(v) { isApplyingWorldState = v; },
    isExtraSeedOwnedByLocalPlayer,
    isExtraSeedSessionOwnedByLocal,
    isHoldingExtraBucket,
    isHoldingMainBucket,
    get isMultiplayerSubscribed() { return isMultiplayerSubscribed; },
    set isMultiplayerSubscribed(v) { isMultiplayerSubscribed = v; },
    isPowderUpgradeInProgress,
    get isReloadingForWorldReset() { return isReloadingForWorldReset; },
    set isReloadingForWorldReset(v) { isReloadingForWorldReset = v; },
    isRemotePresenceSameLoggedInAccount,
    isSharedWorldMergeActive,
    isSharedWorldSyncPausedForTutorial,
    isTabSessionSuperseded: function () {
      return isTabSessionSuperseded;
    },
    get isWorldDirty() { return isWorldDirty; },
    set isWorldDirty(v) { isWorldDirty = v; },
    isWorldDocumentEntry,
    get isWorldPolling() { return isWorldPolling; },
    set isWorldPolling(v) { isWorldPolling = v; },
    isWorldServerSyncAvailable,
    get isWorldSyncing() { return isWorldSyncing; },
    set isWorldSyncing(v) { isWorldSyncing = v; },
    get lastAppliedWorldResetToken() { return lastAppliedWorldResetToken; },
    set lastAppliedWorldResetToken(v) { lastAppliedWorldResetToken = v; },
    get lastBucketBroadcastAt() { return lastBucketBroadcastAt; },
    set lastBucketBroadcastAt(v) { lastBucketBroadcastAt = v; },
    get lastButterflyRealtimeStateAt() { return lastButterflyRealtimeStateAt; },
    set lastButterflyRealtimeStateAt(v) { lastButterflyRealtimeStateAt = v; },
    get lastButterflyStateChangeAt() { return lastButterflyStateChangeAt; },
    set lastButterflyStateChangeAt(v) { lastButterflyStateChangeAt = v; },
    lastLocalButterflyCatchActionAt,
    lastLocalWorldRockPickupAt,
    get lastPresenceSentAt() { return lastPresenceSentAt; },
    set lastPresenceSentAt(v) { lastPresenceSentAt = v; },
    get lastServerClockSyncAt() { return lastServerClockSyncAt; },
    set lastServerClockSyncAt(v) { lastServerClockSyncAt = v; },
    lastWaterSplashAt,
    lastWaterSplashX,
    lastWaterSplashY,
    get lastWorldPollAt() { return lastWorldPollAt; },
    set lastWorldPollAt(v) { lastWorldPollAt = v; },
    get lastWorldResetAt() { return lastWorldResetAt; },
    set lastWorldResetAt(v) { lastWorldResetAt = v; },
    get lastWorldSaveAt() { return lastWorldSaveAt; },
    set lastWorldSaveAt(v) { lastWorldSaveAt = v; },
    get lastWorldUpdatedAt() { return lastWorldUpdatedAt; },
    set lastWorldUpdatedAt(v) { lastWorldUpdatedAt = v; },
    get localAppleActionLockUntil() { return localAppleActionLockUntil; },
    set localAppleActionLockUntil(v) { localAppleActionLockUntil = v; },
    get localPlantActionLockUntil() { return localPlantActionLockUntil; },
    set localPlantActionLockUntil(v) { localPlantActionLockUntil = v; },
    mainDrySeedHandledKey,
    markWorldDirty,
    maxWellWater,
    mergeWorldBagDropsFromSnapshot,
    get multiplayerChannel() { return multiplayerChannel; },
    set multiplayerChannel(v) { multiplayerChannel = v; },
    get multiplayerConnectAttempt() { return multiplayerConnectAttempt; },
    set multiplayerConnectAttempt(v) { multiplayerConnectAttempt = v; },
    nameForIngameUiDisplay,
    get networkDebugDomStale() { return networkDebugDomStale; },
    set networkDebugDomStale(v) { networkDebugDomStale = v; },
    get networkDebugLines() { return networkDebugLines; },
    set networkDebugLines(v) { networkDebugLines = v; },
    networkDebugPanel,
    normalizePlantSproutFieldsWhenSoilDry,
    ovcTryDismissLoadingScreen,
    ovcWorldIndexUrl,
    parsePlacedCraftFurnitureFromSnapshot,
    parseSharedGroundSeedFromSnapshot,
    get pendingForceWorldSaveAfterPoll() { return pendingForceWorldSaveAfterPoll; },
    set pendingForceWorldSaveAfterPoll(v) { pendingForceWorldSaveAfterPoll = v; },
    get pendingWorldResetToken() { return pendingWorldResetToken; },
    set pendingWorldResetToken(v) { pendingWorldResetToken = v; },
    persistOvcLastAppliedWorldResetToken,
    playerPositionNetwork,
    get placedCraftFurniture() { return placedCraftFurniture; },
    set placedCraftFurniture(v) { placedCraftFurniture = v; },
    plantSpot,
    pruneDuplicateRemotePlayerSessions,
    pruneGroundExtraSeedsShadowedByPlants,
    rebasePlantModelTimestampsToLocalNow,
    rebuildPlacedCraftFurnitureDom,
    refillWellIfNeeded,
    refreshUiAfterSharedWorldApply,
    get remoteBucketUpdateAtById() { return remoteBucketUpdateAtById; },
    set remoteBucketUpdateAtById(v) { remoteBucketUpdateAtById = v; },
    get remotePlayerHeldBucketById() { return remotePlayerHeldBucketById; },
    set remotePlayerHeldBucketById(v) { remotePlayerHeldBucketById = v; },
    get remotePlayers() { return remotePlayers; },
    set remotePlayers(v) { remotePlayers = v; },
    remotePlayerStateStore,
    removeRemotePlayer,
    restartPlayerPositionOnly,
    sanitizePrematureRemotePlantDryState,
    sanitizeSharedPlantHydrationAfterRemoteSnapshot,
    sanitizeWorldLooseModeExtraSeeds,
    savePlayerPosition,
    scheduleMultiplayerReconnect,
    seedCreatedAtKey,
    selectedPlayerColor,
    sendPendingPreviousSessionLeaveBroadcast,
    serializePlacedCraftFurnitureForSnapshot,
    serializeWorldBagDropsForSnapshot,
    serializeWorldExtraBucketsForSnapshot,
    get serverClockOffsetMs() { return serverClockOffsetMs; },
    set serverClockOffsetMs(v) { serverClockOffsetMs = v; },
    setMainSeedPickedForCurrentRoom,
    setStoredFlag,
    setStoredValue,
    setWorldPosition,
    shouldHideSeparateSoilUnderBigGrass,
    shouldIgnoreEmptyRemoteMainPlant,
    shouldPauseWaterDecayForPlant,
    showThrottledWorldSyncToast,
    stabilizeFirstWaterHintFlags,
    syncWorldLoosePickupLock,
    teardownExtraPlantDom,
    teardownMultiplayerForTutorial,
    updateMultiplayerStatus,
    updatePlantProgressGauge,
    updateRemotePlayerCount,
    usesWorldLooseSeedMode,
    get worldSaveConflictBackoffUntil() { return worldSaveConflictBackoffUntil; },
    set worldSaveConflictBackoffUntil(v) { worldSaveConflictBackoffUntil = v; }
  };
}

function initOvcScriptNetworkLayer() {
  _networkApi = initScriptNetwork(buildNetworkDeps());
}

/** Systems/Logic — src/script/systems/ */
const stage3CompleteMagicHint =
  "\uC131\uC7A5 \uC644\uB8CC, \uB354 \uD0A4\uC6B0\uB824\uBA74 \uB9C8\uBC95\uC758 \uAC00\uB8E8 \uD544\uC694.";

function buildLayerDeps() {
  return {
    PLAYER_WIDTH,
    WORLD_WIDTH,
    addPlantWorldRockAvoidZone,
    get adminDebugPlantIndexBonus() { return adminDebugPlantIndexBonus; },
    set adminDebugPlantIndexBonus(v) { adminDebugPlantIndexBonus = v; },
    appleRespawnMs,
    appleStateKey,
    applyButterflyCatchable,
    applyButterflyFacing,
    applyButterflySpriteFrame,
    applyPlantWaterDecay,
    areButterfliesUnlockedForPlantFogWorld,
    areButterfliesUnlockedForTutorialOnboarding,
    authorityFillToCapInstantly,
    authoritySpawnButterfliesIfNeeded,
    broadcastButterflyState,
    bucket,
    buildWorldBagDropElement,
    buildWorldRockSpawnContext,
    get butterflyAuthorityWaypointById() { return butterflyAuthorityWaypointById; },
    set butterflyAuthorityWaypointById(v) { butterflyAuthorityWaypointById = v; },
    butterflyBoundsBottom,
    butterflyBoundsLeft,
    butterflyBoundsRight,
    butterflyBoundsTop,
    butterflyBroadcastMs,
    butterflyCatchDistance,
    butterflyColors,
    butterflyFrameCount,
    butterflyFrameMs,
    butterflyMaxAlive,
    butterflyMotion,
    get butterflyRenderById() { return butterflyRenderById; },
    set butterflyRenderById(v) { butterflyRenderById = v; },
    butterflyRespawnMs,
    get butterflyState() { return butterflyState; },
    set butterflyState(v) { butterflyState = v; },
    cactusLevel5GrowMs,
    canDiscardBagItemKey,
    cancelTradeOnPlayerHealthDepleted,
    clampButterflyPointToActiveBounds,
    clampPlayerToTreeOutline,
    clearLiveButterfliesForPlantFogLock,
    collectWorldRockAvoidZones,
    get craftFurnitureInstallingKind() { return craftFurnitureInstallingKind; },
    set craftFurnitureInstallingKind(v) { craftFurnitureInstallingKind = v; },
    createButterfly,
    createDefaultWorldLooseSeedRecord,
    createRandomApple,
    get currentSessionId() { return currentSessionId; },
    set currentSessionId(v) { currentSessionId = v; },
    ensureButterflyRenderEntry,
    ensureWorldBagDropsArray,
    ensureWorldLooseSeedShape,
    expandWorldRockAvoidRect,
    formatWorldBagDropCountLabel,
    getActiveButterflyBounds,
    getApple,
    getAutoTier5GrowMsForPlant,
    getBagDropGroundVisual,
    getBagDropStackKey,
    getBucketSize,
    getButterflyAnimationFrame,
    getButterflyCatchDistanceAtWorldCenter,
    getButterflyStateForSnapshot,
    getCenterDistance,
    getCenterDistanceUtil,
    getCraftChairById,
    getCraftChairSitPose,
    getDefaultButterflyBounds,
    getGrassAutoTier5GrowthRatio,
    getLocalPlayerBodyHeight,
    getLocalPlayerBodyWidth,
    getMaxGroundedPlayerDepth,
    getMaxTreePlayerDepth,
    getMinGroundedPlayerDepth,
    getMinPlantCenterClearanceWorld,
    getMinTreePlayerDepth,
    getNpc,
    getNumericButterflyValue,
    getNumericButterflyValueCore,
    getOnboarding,
    getPlant,
    getPlantFirstGrowthDurationMs,
    getPlantFogClearRectForCurrentScore,
    getPlantFogClearRectForMovementClamp,
    getPlantFogClearRectWorldPx,
    getPlantFogWorldStageFromScore,
    getPlantGrowthRatio,
    getPlantIndexScoringOptions,
    getPlantMaturityLevelForPlantingSpacing,
    getPlantSecondGrowthRatio,
    getPlantStateForStorage,
    getPlantWaterCapacity,
    getPlantWaterLevelTickMsForPlant,
    getPlayer,
    getPlayerBox,
    getPlayerCenterX,
    getPlayerFootY,
    getPlayerHeadFogProbeBoxForPose,
    getPlayerHealthTickContext,
    getPlayerWorldRockCollisionBoxForPose,
    getPlayerWorldY,
    getPowderUpgradeRatio,
    getSeedWorld,
    getSharedPlantSimulationNow,
    getSproutStageFromPlant,
    getStoredFlag,
    getSynchronizedNow,
    getSynchronizedNowCore,
    getTotalPlantIndexScore,
    getUnpickedWorldRockCount,
    getVisibleWorldRockCollisionRect,
    getVisibleWorldRockCollisionRectFromBox,
    getWell,
    getWellSize,
    getWorldBagDropZIndex,
    getWorldItems,
    gravity,
    ground,
    groundFootInset,
    hasActiveGreenGrowthProgress,
    hasFreshButterflyAuthorityBroadcast,
    get hasHydratedSharedWorldFromServer() { return hasHydratedSharedWorldFromServer; },
    set hasHydratedSharedWorldFromServer(v) { hasHydratedSharedWorldFromServer = v; },
    get hasSeededInitialButterflies() { return hasSeededInitialButterflies; },
    set hasSeededInitialButterflies(v) { hasSeededInitialButterflies = v; },
    get hasSpawnedCharacter() { return hasSpawnedCharacter; },
    set hasSpawnedCharacter(v) { hasSpawnedCharacter = v; },
    isAlchemyCraftOpen,
    isAlchemyMasterDialogueRunning,
    isAppleInTrunkArea,
    isApplyingWorldState,
    isButterflyAuthority,
    isCactusMaturePlant,
    get isCharacterSelecting() { return isCharacterSelecting; },
    set isCharacterSelecting(v) { isCharacterSelecting = v; },
    isCraftFurnitureInstalling,
    isMainGameTutorialInProgress,
    isNearWellForCard,
    isOverlappingRect,
    isPlantFogMovementClampActive,
    isPlayerBoxFullyInsidePlantFogClearRect,
    isPlayerCollidingVisibleWorldRockForPose,
    isPlayerGameplayBlockedByNpcDialogue,
    isPlayerHeadFogClearForPose,
    isPlayerInTreeCanopy,
    isPlayerInWellWaterArea,
    isPlayerInsideEnteredCraftHouse,
    isPlayerMovementKeyActive,
    isPlayerNearTreeTrunk,
    isPlayerPoseUnchanged,
    isPlayerSupportedByTree,
    isPlayerTimedActionBusy,
    isPowderUpgradeInProgress,
    isSharedWorldMergeActive,
    isSproutStage3Or5IdleNoGrowth,
    get isTabSessionSuperseded() { return isTabSessionSuperseded; },
    set isTabSessionSuperseded(v) { isTabSessionSuperseded = v; },
    isTradeExchangeOpen,
    isTradeMasterDialogueRunning,
    isWorldBagDropExpired,
    isWorldChatBlockingGameInput,
    get isWorldDirty() { return isWorldDirty; },
    set isWorldDirty(v) { isWorldDirty = v; },
    isWorldDocumentEntry,
    isWorldRockPickupUnlocked,
    isWorldServerSyncAvailable,
    keepButterfliesInsideActiveBounds,
    lastButterflyBroadcastAt,
    get lastButterflyStateChangeAt() { return lastButterflyStateChangeAt; },
    set lastButterflyStateChangeAt(v) { lastButterflyStateChangeAt = v; },
    get lastButterflyWallClockMs() { return lastButterflyWallClockMs; },
    set lastButterflyWallClockMs(v) { lastButterflyWallClockMs = v; },
    lastRemoteWaterSplashAppliedAtBySession,
    lastWellRefillKey,
    lastWorldBagDropChangeAt,
    lastWorldBagDropDespawnAt,
    level5GrowMs,
    get localApplePickedAtById() { return localApplePickedAtById; },
    set localApplePickedAtById(v) { localApplePickedAtById = v; },
    localPlayerRoot,
    markWorldDirty,
    maxWellWater,
    movePlayerVerticallyInTree,
    multiplayerChannel,
    multiplayerRoomSessionButterflyStateLastSeen,
    normalizeWorldLooseSeedRecord,
    onboardingFlowDoneKey,
    pickRandomWorldRockSpawnPosition,
    get placedCraftFurniture() { return placedCraftFurniture; },
    set placedCraftFurniture(v) { placedCraftFurniture = v; },
    plantSpot,
    player,
    playerHealthKey,
    get playerPositionChangedThisTick() { return playerPositionChangedThisTick; },
    set playerPositionChangedThisTick(v) { playerPositionChangedThisTick = v; },
    pruneButterflyAuthorityWaypointsToList,
    pruneStaleMultiplayerRoomSessions,
    remotePlayerStateStore,
    removeButterflyRenderEntry,
    removeExpiredWorldBagDrops,
    resetPlayerChairSitState,
    saveAppleState,
    saveAppleStateToStorage,
    savePlayerHealthState,
    saveSeedState,
    saveSeedStateToStorage,
    saveWellStateToStorage,
    seedCreatedAtKey,
    seedPlantedStateKey,
    sendMultiplayerPresence,
    serializePlacedCraftFurnitureForSnapshot,
    serverClockOffsetMs,
    setInstantHoverTip,
    setStoredValue,
    setWorldPosition,
    setWorldPositionUtil,
    setWorldSize,
    setWorldSizeUtil,
    shouldPauseWaterDecayForPlant,
    shouldRunButterflyMotionSimulation,
    shouldSkipPlantWaterDecayNow,
    simulateButterflyAuthorityStep,
    snapPlayerToCraftChair,
    sortWorldBagDropsForRender,
    spawnPortalHeight,
    spawnPortalWidth,
    spawnPortalX,
    spawnPortalY,
    speed,
    sproutStage1Ms,
    sproutStage2GrowMs,
    standUpFromChair,
    sumPlantIndexScoreForPlants,
    suppressPlantWaterDecayUntilSim,
    syncWorldState,
    teardownWorldBagDropDom,
    treeClimbSpeed,
    treeFallSpeed,
    treeMoveSpeed,
    tryRespawnOneWorldRockIfBelowCap,
    updatePlayerColorBodyPosition,
    updateWellCard,
    updateWellImage,
    updateWorldBagDropDom,
    updateWorldRocks,
    well,
    wellCard,
    wellCardDistance,
    wellCardImage,
    wellRefillMs,
    wellWaterFill,
    wellWaterKey,
    wellWaterText,
    world,
    worldChatInputEl,
    worldChatPanelOpen,
    worldRockOverlapsAnyAvoidRect,
    worldRockRect,
    worldSocialUiReady,
    ALCHEMY_MASTER_START_X,
    ALCHEMY_MASTER_START_Y,
    BUCKET_DEBUG_TRACE,
    GROUND_WORLD_HEIGHT,
    HELD_ITEM_BUCKET,
    HELD_ITEM_SEED,
    IMG_BUCKET_EMPTY,
    IMG_BUCKET_FULL,
    IMG_SEED,
    IMG_SEED_DRY,
    IMG_SOIL_DRY,
    IMG_SOIL_ROTTEN,
    IMG_SOIL_WET,
    IMG_TILLED_SOIL,
    NPC_SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD,
    NPC_SPEECH_BUBBLE_SHIFT_DOWN_WORLD,
    NPC_WIDTH,
    ONBOARDING_STEP_ALCHEMY_MASTER,
    ONBOARDING_STEP_BOOK_INV,
    ONBOARDING_STEP_BUCKET_FILL,
    ONBOARDING_STEP_BUCKET_PICK,
    ONBOARDING_STEP_BUTTERFLY,
    ONBOARDING_STEP_CHAT,
    ONBOARDING_STEP_COMPLETE,
    ONBOARDING_STEP_DROP_BUCKET,
    ONBOARDING_STEP_EAT_APPLE,
    ONBOARDING_STEP_EXTRA_SEED,
    ONBOARDING_STEP_GO_BOOK,
    ONBOARDING_STEP_HEART,
    ONBOARDING_STEP_NPC_GUIDE,
    ONBOARDING_STEP_PICK_APPLE,
    ONBOARDING_STEP_PICK_BOOK,
    ONBOARDING_STEP_PLANT,
    ONBOARDING_STEP_PLANT_INDEX,
    ONBOARDING_STEP_PLANT_MASTER,
    ONBOARDING_STEP_PLANT_MASTER_TALK,
    ONBOARDING_STEP_ROCK,
    ONBOARDING_STEP_SAD,
    ONBOARDING_STEP_SETTINGS_ESC,
    ONBOARDING_STEP_TRADE_MASTER,
    ONBOARDING_STEP_TREE_APPROACH,
    ONBOARDING_STEP_TREE_CLIMB,
    ONBOARDING_STEP_WATER_APPROACH,
    ONBOARDING_STEP_WATER_DONE,
    ONBOARDING_STEP_WATER_POUR,
    ONBOARDING_STEP_WELL,
    ONBOARDING_STEP_ZOOM_INTRO,
    ONBOARDING_STEP_ZOOM_MIN,
    PLANT_INDEX_SCORE_CAP,
    PLANT_SPOT_HEIGHT,
    PLANT_SPOT_WIDTH,
    PLAYER_BASE_IMAGE_SRC,
    PLAYER_HEIGHT,
    PLAYER_MAX_HEALTH,
    PLAYER_SIT_HEIGHT,
    PLAYER_SIT_WIDTH,
    PLAYER_SPEECH_BUBBLE_CLEAR_NAME_WORLD,
    SEED_START_X,
    SEED_START_Y,
    SPEECH_BUBBLE_GAP_ABOVE_HEAD_WORLD,
    SPEECH_BUBBLE_SCREEN_NUDGE_Y_PX,
    TRADE_MASTER_START_X,
    TRADE_MASTER_START_Y,
    TUTORIAL_ONBOARDING_ROCK_ID,
    WATER_NEEDED_SIZE,
    WELL_SIZE,
    WORLD_CHAT_BUBBLE_MAX_WORLD_PX,
    WORLD_CHAT_HEAD_BUBBLE_MS,
    WORLD_CHAT_NAMEPLATE_FONT_PX,
    WORLD_CHAT_NAMEPLATE_PAD_H,
    WORLD_CHAT_NAMEPLATE_PAD_V,
    WORLD_CHAT_NAMEPLATE_RADIUS_PX,
    WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX,
    WORLD_HEIGHT,
    WORLD_LOOSE_ROCK_COUNT,
    WORLD_LOOSE_SEED_X,
    WORLD_LOOSE_SEED_Y,
    WORLD_ROCK_SIZE,
    accountDisplayNameForUi,
    addBucketTrace,
    addNetworkDebugLog,
    adminAccountList,
    adminMessage,
    advanceOnboardingTutorialSproutForPlantIndex,
    alchemyMaster,
    alchemyMasterBubble,
    appendPlantHoverWaterDetail,
    assignSproutIdentityToNewPlant,
    bagBookStorageSlot,
    bagInventoryCountsPrev,
    bagInventoryDragGhostEl,
    get bagInventoryDragState() { return bagInventoryDragState; },
    set bagInventoryDragState(v) { bagInventoryDragState = v; },
    bagInventoryItemOrder,
    bagInventoryPanel,
    get bagInventoryPanelOpen() { return bagInventoryPanelOpen; },
    set bagInventoryPanelOpen(v) { bagInventoryPanelOpen = v; },
    bigTree,
    broadcastBucketState,
    cactusStage4Image,
    cactusStage5Image,
    canPlantAt,
    canPlantWiltFromEmptyWater,
    canStartBagPanelCraftTradeDrag,
    canWaterPlantByClick,
    cancelBagDiscardQuantityModal,
    cancelPlantPowderUpgrade,
    characterPreview,
    clampPlayerHealth,
    clampZoom,
    clearOnboardingHighlights,
    clearPlantHoverRing,
    clearPlantOccluderFade,
    clearWorldNpcHoverSticky,
    closeAlchemyCraftPanel,
    closeTradeExchangePanel,
    closeWorldChatUserPicker,
    coloredMagicPowderCounts,
    craftFurnitureCounts,
    createExtraPlant,
    createHeldExtraSeed,
    currentPlantHoverTarget,
    currentUserId,
    ensureExtraPlantElements,
    ensureGrassAuto5EligibleForTier4Plant,
    ensureGrassOrdinalIfNeeded,
    ensurePlantHoverLabelOnBodyForFixedUi,
    ensurePlantProgressScoreInTickRow,
    ensurePlantProgressSproutToggleBound,
    everBeenToWorldKey,
    flashOnboardingOrderHint,
    flashPlantProximityWarning,
    flowerStage4Image,
    flowerStage5Image,
    formatAdminDate,
    getBagInventorySeedCount,
    getBagItemDescriptorCore,
    getCamera,
    getCraftFurnitureInsertBeforeEl,
    getCraftFurnitureWorldSpec,
    getEffectiveOvcSessionToken,
    getExtraDryDelayMs,
    getGroundBucketZIndex,
    getGuideMaxPage,
    getHandPosition,
    getInventory,
    getLocalBagDropSpawnPosition,
    getLocalExtraSeedOwnerSessionId,
    getLocalExtraSeedOwnerUserId,
    getMagicPowderBagCount,
    getMainBucketGroundState,
    getMainDryAfterEmptyMsForPlant,
    getNpcHeadTopWorldY,
    getPlantDepthSortY,
    getPlantDepthZIndex,
    getPlantHoverRingWorldBounds,
    getPlantSoilBadStateTitle,
    getPlantSoilSrc,
    getPlantWorldLabel,
    getRemotePlayerOccupyingChair,
    getSeedSize,
    getSproutSizeForStage,
    getSproutWorldPositionForPlant,
    getStoredValue,
    getTintedPlayerSrc,
    getWorldExtraBucketInsertBeforeEl,
    groundScreenPxToWorldY,
    growthCard,
    growthFill,
    guideBook,
    guideBookButton,
    guideBookClickPromptDismissedKey,
    guideCard,
    guideNext,
    guidePageText,
    guidePages,
    guidePlaceholderHtml,
    guidePlantPageHtml,
    guidePrev,
    hasGuideBookItemInBagCounts,
    hasGuideBookKey,
    hasLastPlantHoverPointer,
    hasPickedMainSeedInCurrentRoom,
    hasTutorialStarterSeedInPlay,
    hideAppLoadingScreen,
    highlightUnpickedApplesForTutorial,
    isAlchemyMasterVisible,
    isBagDiscardModalOpen,
    isExtraSeedDry,
    isFinalMaturePlantNoWaterCare,
    isFlowerMaturePlant,
    isHoldingExtraBucket,
    isHoldingMainBucket,
    isInteractKeyLatched,
    isMagicPowderBagType,
    isMagicPowderBagTypeUsableNow,
    isMainBucketHeldByRemotePlayer,
    isNearPlantMaster,
    isNearSignBoard,
    isNearWorldBagPickup,
    isOnboardingBookGuideIntroActive,
    isOnboardingInventoryTutorialActive,
    isOnboardingLinearGateActive,
    isOnboardingNpcGuideCloseBlocked,
    isOnboardingSocialDemoReady,
    isOnboardingSocialTutorialStep,
    isPlantAwaitingPlayerFirstPour,
    isPlantEligibleForWorldHover,
    isPlantMasterVisible,
    isPlayerHealthDepleted,
    isPlayerNearPlantWorld,
    isPointerInElementRect,
    isReloadingForWorldReset,
    isSharedWorldSyncPausedForTutorial,
    isStage3CompleteAwaitingMagicPowder,
    isTradeMasterVisible,
    isTreeMaturePlant,
    isWorldExtraBucketOverlappingSharedMain,
    isWorldFloorBagClaimed,
    isWorldLooseSeedVisibleAt,
    isWorldSocialRealtimeReady,
    lastBucketRenderLoggedKey,
    lastPlantProximityBlockMessage,
    layoutWorldChatBubbleOnScreen,
    loadBagInventoryOrderCore,
    localChatBubbleHideAt,
    get localChatBubbleText() { return localChatBubbleText; },
    set localChatBubbleText(v) { localChatBubbleText = v; },
    localChatBubbleTimer,
    logout,
    magicPowderCount,
    magicPowderCountText,
    magicPowderInventory,
    mainDrySeedHandledKey,
    mainPlantGrowthMeter,
    makePlantStableStage3FromOvergrowthSeed,
    maybeAdvanceOnboardingAfterGuideBookClosed,
    movementTutorial,
    nameForIngameUiDisplay,
    needsDarkOutline,
    normalizeBagInventoryOrderByCountsCore,
    normalizeBagItemKey,
    normalizeHexColor,
    normalizePlantSproutFieldsWhenSoilDry,
    npcBubble,
    onboardingAllowsGuideBookButtonToggle,
    onboardingAutoAdvanceSteps,
    onboardingCallout,
    onboardingCalloutText,
    onboardingEscHintTimerId,
    onboardingFlowStepKey,
    onboardingNotifyMainPlantPlanted,
    onboardingShouldKeepWorldMainSeedVisible,
    onboardingTryStartPlantIndexAfterSproutStage3,
    onlineDebugToast,
    onlineDebugToastTimeout,
    ovcBootstrapFinished,
    ovcTutorialReplaySessionKey,
    ovcWorldIndexUrl,
    persistOnboardingStep,
    persistWorldFloorBagClaim,
    plantActionMs,
    plantCard,
    plantCardTitle,
    plantDrySoilClearMs,
    plantHoverLabel,
    plantHoverRing,
    plantMaster,
    plantProximityWarnUntil,
    plantRotClearMs,
    plantWaterBar,
    plantWaterDistance,
    plantWaterSegments,
    plantWaterText,
    playerAlert,
    playerAlertHideTimerId,
    playerBaseImage,
    playerBaseImageReady,
    playerBubble,
    playerBucketOverlay,
    playerChatBubbleEl,
    playerColorBody,
    playerHealthGaugeEl,
    playerHealthGaugeFill,
    playerHealthGaugeLabel,
    playerHealthHeartBtn,
    playerHealthRoot,
    playerName,
    playerStatus,
    recoverWorldMainSeedIfOnboardingStuck,
    refreshPlantHoverAfterPlayerMove,
    refreshPlantOccluderFade,
    remoteBucketUpdateAtById,
    remotePlayerHeldBucketById,
    remotePlayers,
    get remotePlayerCount() { return remotePlayerCount; },
    set remotePlayerCount(v) { remotePlayerCount = v; },
    get multiplayerStatusText() { return multiplayerStatusText; },
    getRemotePlayerIdentityKey,
    pruneDuplicateRemotePlayerSessions,
    removeRemotePlayer,
    updateMultiplayerStatus,
    removeMainPlant,
    removeOneBagItemForTrade,
    resetInputKeys,
    respawnApplesIfNeeded,
    rockInventoryCount,
    rockInventoryCountKey,
    sanitizeWorldChatText,
    saveBagInventoryOrderCore,
    scheduleOnboardingNpcGuideEscHint,
    scheduleTutorialMainSeedRespawnFromGround,
    seed,
    seedCard,
    seedWorldText,
    selectedPlayerColor,
    setMainSeedPickedForCurrentRoom,
    setOnboardingCalloutVisible,
    setOnboardingFlowDoneStored,
    setPlayerBubbleWorldPosition,
    setRoomKeyedPickupFlagAllSlugs,
    setSettingsOverlayOpen,
    setSpeechBubbleTransform,
    setStoredFlag,
    setWorldChatPanelOpen,
    settingsOverlay,
    shouldApplyLocalPlayerTint,
    shouldShowWorldBagInventoryUi,
    showPlayerAlert,
    spawnWorldBagDropAt,
    speechBubbleTopWorldYFromHead,
    sprout,
    sproutStage1Image,
    sproutStage2Image,
    sproutStage3Image,
    sproutStage4Image,
    sproutStage5Image,
    stage3CompleteMagicHint,
    syncGuideInventoryBar,
    syncMainBucketToRemoteHolderHand,
    syncWorldBagGroundVisibility,
    syncWorldNpcHoverLabelPosition,
    syncWorldPlantFogVisuals,
    tickGrassAutoAdvanceToTier5,
    tickPowderUpgrade,
    tickSproutEvolution,
    tickTutorialMainSeedRespawnDue,
    toScreenX,
    toScreenXUtil,
    toScreenY,
    toScreenYUtil,
    tradeMaster,
    tradeMasterBubble,
    treeAppleElements,
    treeStage4Image,
    treeStage5Image,
    updateAlchemyNpcPrompt,
    updateBagInventorySlots,
    updateBookStorageSlot,
    updateExtraSeedsAndPlants,
    updateGuideCard,
    updateNpcPosition,
    updateOnboardingFlowUI,
    updatePlantProgressGauge,
    updatePlantState,
    updatePlantWaterLevel,
    updatePlayerAlert,
    updatePlayerBubblePosition,
    updatePlayerChatBubbleOverlay,
    updatePlayerStatus,
    updateSeedInventory,
    updateSettingsTutorialButtons,
    updateSproutPosition,
    updateTradeNpcPrompt,
    updateWorldExtraBuckets,
    usesWorldLooseSeedMode,
    waterNeeded,
    worldBag,
    worldBagInventory,
    worldChatPanelEl,
    worldChatSendBtn,
    worldChatToggleBtn,
    worldChatUserPickerEl,
    worldChatUsersBtn,
    worldChatUsersPickerOpen,
    worldHeartBtn,
    worldNpcHoverAnchorEl,
    worldSadBtn,
  };
}

function initOvcScriptSystemsLayer() {
  _layerDeps = buildLayerDeps();
  _systemsApi = initScriptSystems(_layerDeps);
}

/** View — src/script/view/ */
function initOvcScriptViewLayer() {
  _viewApi = initScriptView(_layerDeps);
}

/** DOM/UI that calls view-layer wrappers — must run after init (see ovcInitScriptLayers below) */
function runOvcLayersPostInitBootstrap() {
  bindPlayerBaseImageLoadHandlers();
  if (plantHoverLabel) {
    document.addEventListener("pointermove", function (e) {
      syncPlantHoverFromPointerClient(e.clientX, e.clientY);
    });
  }
  ensureWorldSocialUi();
}

function ovcInitScriptLayers() {
  initOvcScriptNetworkLayer();
  initOvcScriptSystemsLayer();
  initOvcScriptViewLayer();
  runOvcLayersPostInitBootstrap();
}

/** View layer wrappers (src/script/view/) */
function applyPlantHoverVisuals(plant) { return _viewApi ? _viewApi.applyPlantHoverVisuals(plant) : undefined; }
function assignExtraSeedInventoryOwner(seed) { return _viewApi ? _viewApi.assignExtraSeedInventoryOwner(seed) : undefined; }
function bagDiscardInventoryEligible(itemKey) { return _viewApi ? _viewApi.bagDiscardInventoryEligible(itemKey) : undefined; }
function canDiscardBagItemFromBagPanel(itemKey) { return _viewApi ? _viewApi.canDiscardBagItemFromBagPanel(itemKey) : undefined; }
function canDiscardBagItemNow(itemKey) { return _viewApi ? _viewApi.canDiscardBagItemNow(itemKey) : undefined; }
function canUseBagInventoryGameplay() { return _viewApi ? _viewApi.canUseBagInventoryGameplay() : undefined; }
function clearBagInventoryDragVisual() { return _viewApi ? _viewApi.clearBagInventoryDragVisual() : undefined; }
function clearPlantHoverVisuals() { return _viewApi ? _viewApi.clearPlantHoverVisuals() : undefined; }
function closeBagInventoryPanel() { return _viewApi ? _viewApi.closeBagInventoryPanel() : undefined; }
function closeGuideCardFromClick() { return _viewApi ? _viewApi.closeGuideCardFromClick() : undefined; }
function closeSettingsOverlayFromBackdrop() { return _viewApi ? _viewApi.closeSettingsOverlayFromBackdrop() : undefined; }
function closeSettingsOverlayFromEscape() { return _viewApi ? _viewApi.closeSettingsOverlayFromEscape() : undefined; }
function createRandomApples(count) { return _viewApi ? _viewApi.createRandomApples(count) : undefined; }
function createRandomWorldRocks(ctx) { return _viewApi ? _viewApi.createRandomWorldRocks(ctx) : undefined; }
function createStarterSeedInventoryItem() { return _viewApi ? _viewApi.createStarterSeedInventoryItem() : undefined; }
function discardBagItemsToGround(itemKey, amount, options) { return _viewApi ? _viewApi.discardBagItemsToGround(itemKey, amount, options) : undefined; }
function discardInventorySeed(seedId) { return _viewApi ? _viewApi.discardInventorySeed(seedId) : undefined; }
function dismissGuideBookClickPrompt() { return _viewApi ? _viewApi.dismissGuideBookClickPrompt() : undefined; }
function ensureBagInventoryDragGhost(html) { return _viewApi ? _viewApi.ensureBagInventoryDragGhost(html) : undefined; }
function ensureSharedPlantVisuals() { return _viewApi ? _viewApi.ensureSharedPlantVisuals() : undefined; }
function extraPlantFromDomElement(el) { return _viewApi ? _viewApi.extraPlantFromDomElement(el) : undefined; }
function flashOnboardingOrderHint(message) { return _viewApi ? _viewApi.flashOnboardingOrderHint(message) : undefined; }
function getBagInventoryCountsByKey() { return _viewApi ? _viewApi.getBagInventoryCountsByKey() : undefined; }
function getBagInventoryItemCount(itemKey) { return _viewApi ? _viewApi.getBagInventoryItemCount(itemKey) : undefined; }
function getBagInventorySeedCount() { return _viewApi ? _viewApi.getBagInventorySeedCount() : undefined; }
function getBagItemKeyFromInventorySlot(slot) { return _viewApi ? _viewApi.getBagItemKeyFromInventorySlot(slot) : undefined; }
function getNearestBadSoilPlantForProximityCard() { return _viewApi ? _viewApi.getNearestBadSoilPlantForProximityCard() : undefined; }
function getPlantHoverDomElements(plant) { return _viewApi ? _viewApi.getPlantHoverDomElements(plant) : undefined; }
function getPlantPrimaryVisualRectWorld(plant) { return _viewApi ? _viewApi.getPlantPrimaryVisualRectWorld(plant) : undefined; }
function getPlayerRenderedHeight() { return _viewApi ? _viewApi.getPlayerRenderedHeight() : undefined; }
function getRenderedAdminAccounts() { return _viewApi ? _viewApi.getRenderedAdminAccounts() : undefined; }
function getSproutImageForPlant(plant, stage) { return _viewApi ? _viewApi.getSproutImageForPlant(plant, stage) : undefined; }
function getWorldNpcPromptBubbleEl(npcEl) { return _viewApi ? _viewApi.getWorldNpcPromptBubbleEl(npcEl) : undefined; }
function groundScreenPxToWorldX(px) { return _viewApi ? _viewApi.groundScreenPxToWorldX(px) : undefined; }
function groundScreenPxToWorldY(px) { return _viewApi ? _viewApi.groundScreenPxToWorldY(px) : undefined; }
function hidePlantHoverLabel() { return _viewApi ? _viewApi.hidePlantHoverLabel() : undefined; }
function isOnboardingInventoryTutorialActive() { return _viewApi ? _viewApi.isOnboardingInventoryTutorialActive() : undefined; }
function isPointerInsideBagInventoryPanel(clientX, clientY) { return _viewApi ? _viewApi.isPointerInsideBagInventoryPanel(clientX, clientY) : undefined; }
function isPointerOutsideBagInventoryPanel(clientX, clientY) { return _viewApi ? _viewApi.isPointerOutsideBagInventoryPanel(clientX, clientY) : undefined; }
function isPointerOverBagInventoryUi(clientX, clientY) { return _viewApi ? _viewApi.isPointerOverBagInventoryUi(clientX, clientY) : undefined; }
function layoutNpcSpeechBubble() { return _viewApi ? _viewApi.layoutNpcSpeechBubble() : undefined; }
function layoutPlantHoverRing(plant, urgentWater) { return _viewApi ? _viewApi.layoutPlantHoverRing(plant, urgentWater) : undefined; }
function layoutWorldChatBubbleOnScreen(el, rect, nowMs, sessionIdForWobble) { return _viewApi ? _viewApi.layoutWorldChatBubbleOnScreen(el, rect, nowMs, sessionIdForWobble) : undefined; }
function loadBagInventoryOrder() { return _viewApi ? _viewApi.loadBagInventoryOrder() : undefined; }
function loadRockInventoryCount() { return _viewApi ? _viewApi.loadRockInventoryCount() : undefined; }
function maybeAdvanceOnboardingAfterBookInventoryOpened() { return _viewApi ? _viewApi.maybeAdvanceOnboardingAfterBookInventoryOpened() : undefined; }
function maybeAdvanceOnboardingAfterInventoryClosed() { return _viewApi ? _viewApi.maybeAdvanceOnboardingAfterInventoryClosed() : undefined; }
function maybeAdvanceOnboardingAfterInventoryOpened() { return _viewApi ? _viewApi.maybeAdvanceOnboardingAfterInventoryOpened() : undefined; }
function normalizeBagInventoryOrderByCounts(counts) { return _viewApi ? _viewApi.normalizeBagInventoryOrderByCounts(counts) : undefined; }
function onBagInventorySlotPointerCancel(event) { return _viewApi ? _viewApi.onBagInventorySlotPointerCancel(event) : undefined; }
function onBagInventorySlotPointerDown(event) { return _viewApi ? _viewApi.onBagInventorySlotPointerDown(event) : undefined; }
function onBagInventorySlotPointerMove(event) { return _viewApi ? _viewApi.onBagInventorySlotPointerMove(event) : undefined; }
function onBagInventorySlotPointerUp(event) { return _viewApi ? _viewApi.onBagInventorySlotPointerUp(event) : undefined; }
function onGuideInventoryToggleClick() { return _viewApi ? _viewApi.onGuideInventoryToggleClick() : undefined; }
function onWorldBagInventoryClick(event) { return _viewApi ? _viewApi.onWorldBagInventoryClick(event) : undefined; }
function onboardingClearInventoryCloseHintTimer() { return _viewApi ? _viewApi.onboardingClearInventoryCloseHintTimer() : undefined; }
function onboardingScheduleTutorialCompleteHide() { return _viewApi ? _viewApi.onboardingScheduleTutorialCompleteHide() : undefined; }
function openSettingsOverlay() { return _viewApi ? _viewApi.openSettingsOverlay() : undefined; }
function ovcTryDismissLoadingScreen(force) { return _viewApi ? _viewApi.ovcTryDismissLoadingScreen(force) : undefined; }
function pickRandomButterflyColor() { return _viewApi ? _viewApi.pickRandomButterflyColor() : undefined; }
function pickRandomButterflySpawnPoint() { return _viewApi ? _viewApi.pickRandomButterflySpawnPoint() : undefined; }
function plantInventorySeed(seedId) { return _viewApi ? _viewApi.plantInventorySeed(seedId) : undefined; }
function plantShowsUrgentWaterHoverEmphasis(plant, now) { return _viewApi ? _viewApi.plantShowsUrgentWaterHoverEmphasis(plant, now) : undefined; }
function rebuildPlacedCraftFurnitureDom() { return _viewApi ? _viewApi.rebuildPlacedCraftFurnitureDom() : undefined; }
function rebuildWorldBagDropDom() { return _viewApi ? _viewApi.rebuildWorldBagDropDom() : undefined; }
function rebuildWorldExtraBucketDom() { return _viewApi ? _viewApi.rebuildWorldExtraBucketDom() : undefined; }
function rebuildWorldRockDom() { return _viewApi ? _viewApi.rebuildWorldRockDom() : undefined; }
function refreshPlantWaterHoverIfShown(plant) { return _viewApi ? _viewApi.refreshPlantWaterHoverIfShown(plant) : undefined; }
function removeBagItemsFromInventory(itemKey, amount) { return _viewApi ? _viewApi.removeBagItemsFromInventory(itemKey, amount) : undefined; }
function renderAdminAccounts(accounts) { return _viewApi ? _viewApi.renderAdminAccounts(accounts) : undefined; }
function renderPlantCardForPlant(plant) { return _viewApi ? _viewApi.renderPlantCardForPlant(plant) : undefined; }
function renderPlayerPosition() { return _viewApi ? _viewApi.renderPlayerPosition() : undefined; }
function restorePlantHoverLabelToWorldDom() { return _viewApi ? _viewApi.restorePlantHoverLabelToWorldDom() : undefined; }
function saveBagInventoryOrder() { return _viewApi ? _viewApi.saveBagInventoryOrder() : undefined; }
function saveRockInventoryCount() { return _viewApi ? _viewApi.saveRockInventoryCount() : undefined; }
function scheduleOnboardingInventoryCloseHint() { return _viewApi ? _viewApi.scheduleOnboardingInventoryCloseHint() : undefined; }
function setBagInventoryPanelOpen(open) { return _viewApi ? _viewApi.setBagInventoryPanelOpen(open) : undefined; }
function setLocalChatBubble(text, hideAt) { return _viewApi ? _viewApi.setLocalChatBubble(text, hideAt) : undefined; }
function setNpcBubbleWorldPosition(worldX, worldY) { return _viewApi ? _viewApi.setNpcBubbleWorldPosition(worldX, worldY) : undefined; }
function setPlayerBubbleWorldPosition(worldX, worldY) { return _viewApi ? _viewApi.setPlayerBubbleWorldPosition(worldX, worldY) : undefined; }
function setSpeechBubbleTransform(bubbleEl, worldX, worldY) { return _viewApi ? _viewApi.setSpeechBubbleTransform(bubbleEl, worldX, worldY) : undefined; }
function setWorldBagGroundPickedForCurrentRoom() { return _viewApi ? _viewApi.setWorldBagGroundPickedForCurrentRoom() : undefined; }
function setWorldChatPanelOpen(nextOpen) { return _viewApi ? _viewApi.setWorldChatPanelOpen(nextOpen) : undefined; }
function setWorldChatUserPickerOpen(open) { return _viewApi ? _viewApi.setWorldChatUserPickerOpen(open) : undefined; }
function setWorldGuideBookOffGroundPickedForCurrentRoom() { return _viewApi ? _viewApi.setWorldGuideBookOffGroundPickedForCurrentRoom() : undefined; }
function shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed) { return _viewApi ? _viewApi.shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed) : undefined; }
function shouldHideSeparateSoilUnderBigGrass(plant) { return _viewApi ? _viewApi.shouldHideSeparateSoilUnderBigGrass(plant) : undefined; }
function shouldShowFirstWaterNeededDroplet(plant) { return _viewApi ? _viewApi.shouldShowFirstWaterNeededDroplet(plant) : undefined; }
function shouldShowIncomingWorldChatPayload(payload) { return _viewApi ? _viewApi.shouldShowIncomingWorldChatPayload(payload) : undefined; }
function shouldShowWorldBagInventoryUi() { return _viewApi ? _viewApi.shouldShowWorldBagInventoryUi() : undefined; }
function shouldSkipPlantHoverVisualEmphasis(plant, now) { return _viewApi ? _viewApi.shouldSkipPlantHoverVisualEmphasis(plant, now) : undefined; }
function shouldSuppressPlantWaterCardForSelfSustaining(plant) { return _viewApi ? _viewApi.shouldSuppressPlantWaterCardForSelfSustaining(plant) : undefined; }
function showBagInventoryFullFailMessage() { return _viewApi ? _viewApi.showBagInventoryFullFailMessage() : undefined; }
function showBagRequiredForGameplayMessage() { return _viewApi ? _viewApi.showBagRequiredForGameplayMessage() : undefined; }
function showCraftChairOccupiedAlert(chair) { return _viewApi ? _viewApi.showCraftChairOccupiedAlert(chair) : undefined; }
function showDialogueLine(lineInfo) { return _viewApi ? _viewApi.showDialogueLine(lineInfo) : undefined; }
function showOnboardingSocialDemoChatBubble(text) { return _viewApi ? _viewApi.showOnboardingSocialDemoChatBubble(text) : undefined; }
function showOnlineDebugMessage(message) { return _viewApi ? _viewApi.showOnlineDebugMessage(message) : undefined; }
function showPlantHoverSignForPlant(plant) { return _viewApi ? _viewApi.showPlantHoverSignForPlant(plant) : undefined; }
function showPlayerAlert(options) { return _viewApi ? _viewApi.showPlayerAlert(options) : undefined; }
function showUiShortcutHoverLabel(text, anchorEl) { return _viewApi ? _viewApi.showUiShortcutHoverLabel(text, anchorEl) : undefined; }
function showWorldNpcHoverLabel(text, anchorEl) { return _viewApi ? _viewApi.showWorldNpcHoverLabel(text, anchorEl) : undefined; }
function speechBubbleTopWorldYFromHead(headTopWorldY, bubbleElement, gapAboveHeadWorld) { return _viewApi ? _viewApi.speechBubbleTopWorldYFromHead(headTopWorldY, bubbleElement, gapAboveHeadWorld) : undefined; }
function syncCharacterPreviewVisual(color) { return _viewApi ? _viewApi.syncCharacterPreviewVisual(color) : undefined; }
function syncGuideInventoryBar() { return _viewApi ? _viewApi.syncGuideInventoryBar() : undefined; }
function syncLocalPlayerInsideCraftHouseVisual() { return _viewApi ? _viewApi.syncLocalPlayerInsideCraftHouseVisual() : undefined; }
function syncLocalPlayerPoseVisual() { return _viewApi ? _viewApi.syncLocalPlayerPoseVisual() : undefined; }
function syncLocalPlayerVisibility() { return _viewApi ? _viewApi.syncLocalPlayerVisibility() : undefined; }
function syncPlantCardWaterReadoutVisibility(showWater) { return _viewApi ? _viewApi.syncPlantCardWaterReadoutVisibility(showWater) : undefined; }
function syncPlantHoverWellDockLayout() { return _viewApi ? _viewApi.syncPlantHoverWellDockLayout() : undefined; }
function teardownExtraPlantDom(p) { return _viewApi ? _viewApi.teardownExtraPlantDom(p) : undefined; }
function toScreenX(worldX) { return _viewApi ? _viewApi.toScreenX(worldX) : undefined; }
function toScreenY(worldY) { return _viewApi ? _viewApi.toScreenY(worldY) : undefined; }
function toggleBagInventoryPanelFromBagClick() { return _viewApi ? _viewApi.toggleBagInventoryPanelFromBagClick() : undefined; }
function togglePlayerHealthGaugeVisible() { return _viewApi ? _viewApi.togglePlayerHealthGaugeVisible() : undefined; }
function updateApples() { return _viewApi ? _viewApi.updateApples() : undefined; }
function updateBagInventorySlots() { return _viewApi ? _viewApi.updateBagInventorySlots() : undefined; }
function updateBucketPosition() { return _viewApi ? _viewApi.updateBucketPosition() : undefined; }
function updateCamera() { return _viewApi ? _viewApi.updateCamera() : undefined; }
function updateGuideCard() { return _viewApi ? _viewApi.updateGuideCard() : undefined; }
function updateGuidePages() { return _viewApi ? _viewApi.updateGuidePages() : undefined; }
function updateMagicPowderInventoryUi() { return _viewApi ? _viewApi.updateMagicPowderInventoryUi() : undefined; }
function updateNpcPosition() { return _viewApi ? _viewApi.updateNpcPosition() : undefined; }
function updateNpcPrompt() { return _viewApi ? _viewApi.updateNpcPrompt() : undefined; }
function updateOnboardingFlowUI() { return _viewApi ? _viewApi.updateOnboardingFlowUI() : undefined; }
function updatePlacedCraftFurnitureDom() { return _viewApi ? _viewApi.updatePlacedCraftFurnitureDom() : undefined; }
function updatePlantCard() { return _viewApi ? _viewApi.updatePlantCard() : undefined; }
function updatePlantGrowth() { return _viewApi ? _viewApi.updatePlantGrowth() : undefined; }
function updatePlantGrowthMeter(element, fill, x, y, firstRatio, secondRatio) { return _viewApi ? _viewApi.updatePlantGrowthMeter(element, fill, x, y, firstRatio, secondRatio) : undefined; }
function updatePlantProgressGauge() { return _viewApi ? _viewApi.updatePlantProgressGauge() : undefined; }
function updatePlantState() { return _viewApi ? _viewApi.updatePlantState() : undefined; }
function updatePlayerAlert() { return _viewApi ? _viewApi.updatePlayerAlert() : undefined; }
function updatePlayerBubblePosition() { return _viewApi ? _viewApi.updatePlayerBubblePosition() : undefined; }
function updatePlayerChatBubbleOverlay() { return _viewApi ? _viewApi.updatePlayerChatBubbleOverlay() : undefined; }
function updatePlayerColorBodyPosition() { return _viewApi ? _viewApi.updatePlayerColorBodyPosition() : undefined; }
function updatePlayerHealthUi() { return _viewApi ? _viewApi.updatePlayerHealthUi() : undefined; }
function updatePlayerName() { return _viewApi ? _viewApi.updatePlayerName() : undefined; }
function updatePlayerStatus() { return _viewApi ? _viewApi.updatePlayerStatus() : undefined; }
function updateSeedCard() { return _viewApi ? _viewApi.updateSeedCard() : undefined; }
function updateSeedDryState() { return _viewApi ? _viewApi.updateSeedDryState() : undefined; }
function updateSeedInventory() { return _viewApi ? _viewApi.updateSeedInventory() : undefined; }
function updateSeedPosition() { return _viewApi ? _viewApi.updateSeedPosition() : undefined; }
function updateWorldExtraBuckets() { return _viewApi ? _viewApi.updateWorldExtraBuckets() : undefined; }
function updateWorldSocialChatUiEnabled() { return _viewApi ? _viewApi.updateWorldSocialChatUiEnabled() : undefined; }
function worldChatBubbleWobble(sessionIdForPhase, nowMs) { return _viewApi ? _viewApi.worldChatBubbleWobble(sessionIdForPhase, nowMs) : undefined; }


function addPlantWorldRockAvoidZone(zones, plant, pad) { return _systemsApi ? _systemsApi.addPlantWorldRockAvoidZone(zones, plant, pad) : undefined; }
function applyButterflyCatchable(entry, catchable) { return _systemsApi ? _systemsApi.applyButterflyCatchable(entry, catchable) : undefined; }
function applyButterflyFacing(entry, facingRight) { return _systemsApi ? _systemsApi.applyButterflyFacing(entry, facingRight) : undefined; }
function applyButterflySpriteFrame(entry, color, frame) { return _systemsApi ? _systemsApi.applyButterflySpriteFrame(entry, color, frame) : undefined; }
function applyPlantWaterDecay(plant, now) { return _systemsApi ? _systemsApi.applyPlantWaterDecay(plant, now) : undefined; }
function areButterfliesUnlockedForPlantFogWorld() { return _systemsApi ? _systemsApi.areButterfliesUnlockedForPlantFogWorld() : undefined; }
function areButterfliesUnlockedForTutorialOnboarding() { return _systemsApi ? _systemsApi.areButterfliesUnlockedForTutorialOnboarding() : undefined; }
function authorityFillToCapInstantly(now) { return _systemsApi ? _systemsApi.authorityFillToCapInstantly(now) : undefined; }
function authoritySpawnButterfliesIfNeeded(now) { return _systemsApi ? _systemsApi.authoritySpawnButterfliesIfNeeded(now) : undefined; }
function broadcastButterflyState(now) { return _systemsApi ? _systemsApi.broadcastButterflyState(now) : undefined; }
function buildWorldBagDropElement(drop, stackIndex) { return _systemsApi ? _systemsApi.buildWorldBagDropElement(drop, stackIndex) : undefined; }
function buildWorldRockSpawnContext() { return _systemsApi ? _systemsApi.buildWorldRockSpawnContext() : undefined; }
function clampButterflyPointToActiveBounds(x, y) { return _systemsApi ? _systemsApi.clampButterflyPointToActiveBounds(x, y) : undefined; }
function clampPlayerToTreeOutline() { return _systemsApi ? _systemsApi.clampPlayerToTreeOutline() : undefined; }
function clearLiveButterfliesForPlantFogLock(now) { return _systemsApi ? _systemsApi.clearLiveButterfliesForPlantFogLock(now) : undefined; }
function collectWorldRockAvoidZones(ctx) { return _systemsApi ? _systemsApi.collectWorldRockAvoidZones(ctx) : undefined; }
function createButterfly(now, options) { return _systemsApi ? _systemsApi.createButterfly(now, options) : undefined; }
function createRandomApple(id) { return _systemsApi ? _systemsApi.createRandomApple(id) : undefined; }
function ensureButterflyRenderEntry(butterfly) { return _systemsApi ? _systemsApi.ensureButterflyRenderEntry(butterfly) : undefined; }
function ensureWorldBagDropsArray() { return _systemsApi ? _systemsApi.ensureWorldBagDropsArray() : undefined; }
function ensureWorldLooseSeedShape() { return _systemsApi ? _systemsApi.ensureWorldLooseSeedShape() : undefined; }
function expandWorldRockAvoidRect(left, top, w, h, pad) { return _systemsApi ? _systemsApi.expandWorldRockAvoidRect(left, top, w, h, pad) : undefined; }
function getActiveButterflyBounds() { return _systemsApi ? _systemsApi.getActiveButterflyBounds() : undefined; }
function getAutoTier5GrowMsForPlant(plant) { return _systemsApi ? _systemsApi.getAutoTier5GrowMsForPlant(plant) : undefined; }
function getBucketSize() { return _systemsApi ? _systemsApi.getBucketSize() : undefined; }
function getButterflyAnimationFrame(now, butterfly) { return _systemsApi ? _systemsApi.getButterflyAnimationFrame(now, butterfly) : undefined; }
function getButterflyCatchDistanceAtWorldCenter(cx, cy) { return _systemsApi ? _systemsApi.getButterflyCatchDistanceAtWorldCenter(cx, cy) : undefined; }
function getButterflyStateForSnapshot() { return _systemsApi ? _systemsApi.getButterflyStateForSnapshot() : undefined; }
function getCenterDistance(x, y, width, height) { return _systemsApi ? _systemsApi.getCenterDistance(x, y, width, height) : undefined; }
function getCraftChairById(chairId) { return _systemsApi ? _systemsApi.getCraftChairById(chairId) : undefined; }
function getDefaultButterflyBounds() { return _systemsApi ? _systemsApi.getDefaultButterflyBounds() : undefined; }
function getGrassAutoTier5GrowthRatio(plant, now) { return _systemsApi ? _systemsApi.getGrassAutoTier5GrowthRatio(plant, now) : undefined; }
function getLocalPlayerBodyHeight() { return _systemsApi ? _systemsApi.getLocalPlayerBodyHeight() : undefined; }
function getLocalPlayerBodyWidth() { return _systemsApi ? _systemsApi.getLocalPlayerBodyWidth() : undefined; }
function getMaxGroundedPlayerDepth() { return _systemsApi ? _systemsApi.getMaxGroundedPlayerDepth() : 0; }
function getMaxTreePlayerDepth() { return _systemsApi ? _systemsApi.getMaxTreePlayerDepth() : undefined; }
function getMinGroundedPlayerDepth() { return _systemsApi ? _systemsApi.getMinGroundedPlayerDepth() : 0; }
function getMinTreePlayerDepth() { return _systemsApi ? _systemsApi.getMinTreePlayerDepth() : undefined; }
function getNumericButterflyValue(value, fallback) { return _systemsApi ? _systemsApi.getNumericButterflyValue(value, fallback) : undefined; }
function getPlantFogClearRectForCurrentScore() { return _systemsApi ? _systemsApi.getPlantFogClearRectForCurrentScore() : undefined; }
function getPlantFogClearRectForMovementClamp() { return _systemsApi ? _systemsApi.getPlantFogClearRectForMovementClamp() : undefined; }
function getPlantGrowthRatio(plant, now) { return _systemsApi ? _systemsApi.getPlantGrowthRatio(plant, now) : undefined; }
function getPlantIndexScoringOptions(now) { return _systemsApi ? _systemsApi.getPlantIndexScoringOptions(now) : undefined; }
function getPlantMaturityLevelForPlantingSpacing(plant) { return _systemsApi ? _systemsApi.getPlantMaturityLevelForPlantingSpacing(plant) : undefined; }
function getPlantSecondGrowthRatio(plant, now) { return _systemsApi ? _systemsApi.getPlantSecondGrowthRatio(plant, now) : undefined; }
function getPlantStateForStorage() { return _systemsApi ? _systemsApi.getPlantStateForStorage() : undefined; }
function getPlantWaterCapacity(plant) { return _systemsApi ? _systemsApi.getPlantWaterCapacity(plant) : undefined; }
function getPlayerBox() { return _systemsApi ? _systemsApi.getPlayerBox() : undefined; }
function getPlayerCenterX() { return _systemsApi ? _systemsApi.getPlayerCenterX() : undefined; }
function getPlayerFootY() { return _systemsApi ? _systemsApi.getPlayerFootY() : undefined; }
function getPlayerHeadFogProbeBoxForPose(px, pd, jy) { return _systemsApi ? _systemsApi.getPlayerHeadFogProbeBoxForPose(px, pd, jy) : undefined; }
function getPlayerHealthTickContext(healthPosePrev) { return _systemsApi ? _systemsApi.getPlayerHealthTickContext(healthPosePrev) : undefined; }
function getPlayerWorldRockCollisionBoxForPose(px, pd, jy) { return _systemsApi ? _systemsApi.getPlayerWorldRockCollisionBoxForPose(px, pd, jy) : undefined; }
function getPlayerWorldY() { return _systemsApi ? _systemsApi.getPlayerWorldY() : undefined; }
function getPowderUpgradeRatio(plant, now) { return _systemsApi ? _systemsApi.getPowderUpgradeRatio(plant, now) : undefined; }
function getSharedPlantSimulationNow() { return _systemsApi ? _systemsApi.getSharedPlantSimulationNow() : undefined; }
function getSproutStageFromPlant(plant) { return _systemsApi ? _systemsApi.getSproutStageFromPlant(plant) : undefined; }
function getSynchronizedNow() { return _systemsApi ? _systemsApi.getSynchronizedNow() : undefined; }
function getTotalPlantIndexScore() { return _systemsApi ? _systemsApi.getTotalPlantIndexScore() : undefined; }
function getUnpickedWorldRockCount() { return _systemsApi ? _systemsApi.getUnpickedWorldRockCount() : undefined; }
function getVisibleWorldRockCollisionRect(rx, ry, sz, rockEl) { return _systemsApi ? _systemsApi.getVisibleWorldRockCollisionRect(rx, ry, sz, rockEl) : undefined; }
function getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH) { return _systemsApi ? _systemsApi.getVisibleWorldRockCollisionRectFromBox(boxLeft, boxTop, boxW, boxH) : undefined; }
function getWellSize() { return _systemsApi ? _systemsApi.getWellSize() : undefined; }
function hasActiveGreenGrowthProgress(plant, now) { return _systemsApi ? _systemsApi.hasActiveGreenGrowthProgress(plant, now) : undefined; }
function hasFreshButterflyAuthorityBroadcast(now) { return _systemsApi ? _systemsApi.hasFreshButterflyAuthorityBroadcast(now) : undefined; }
function isAppleInTrunkArea(localX, localY, size) { return _systemsApi ? _systemsApi.isAppleInTrunkArea(localX, localY, size) : undefined; }
function isButterflyAuthority() { return _systemsApi ? _systemsApi.isButterflyAuthority() : undefined; }
function isCraftFurnitureInstalling() { return _systemsApi ? _systemsApi.isCraftFurnitureInstalling() : undefined; }
function isMainGameTutorialInProgress() { return _systemsApi ? _systemsApi.isMainGameTutorialInProgress() : undefined; }
function isNearWellForCard() { return _systemsApi ? _systemsApi.isNearWellForCard() : undefined; }
function isPlantFogMovementClampActive() { return _systemsApi ? _systemsApi.isPlantFogMovementClampActive() : undefined; }
function isPlayerBoxFullyInsidePlantFogClearRect(playerBox, rect, eps) { return _systemsApi ? _systemsApi.isPlayerBoxFullyInsidePlantFogClearRect(playerBox, rect, eps) : undefined; }
function isPlayerCollidingVisibleWorldRockForPose(px, pd, jy) { return _systemsApi ? _systemsApi.isPlayerCollidingVisibleWorldRockForPose(px, pd, jy) : undefined; }
function isPlayerGameplayBlockedByNpcDialogue() { return _systemsApi ? _systemsApi.isPlayerGameplayBlockedByNpcDialogue() : undefined; }
function isPlayerHeadFogClearForPose(px, pd, jy, rect, eps) { return _systemsApi ? _systemsApi.isPlayerHeadFogClearForPose(px, pd, jy, rect, eps) : undefined; }
function isPlayerInTreeCanopy() { return _systemsApi ? _systemsApi.isPlayerInTreeCanopy() : undefined; }
function isPlayerInWellWaterArea() { return _systemsApi ? _systemsApi.isPlayerInWellWaterArea() : undefined; }
function isPlayerInsideEnteredCraftHouse() { return _systemsApi ? _systemsApi.isPlayerInsideEnteredCraftHouse() : undefined; }
function isPlayerNearTreeTrunk() { return _systemsApi ? _systemsApi.isPlayerNearTreeTrunk() : undefined; }
function isPlayerSupportedByTree() { return _systemsApi ? _systemsApi.isPlayerSupportedByTree() : undefined; }
function isPlayerTimedActionBusy() { return _systemsApi ? _systemsApi.isPlayerTimedActionBusy() : undefined; }
function isPowderUpgradeInProgress(plant) { return _systemsApi ? _systemsApi.isPowderUpgradeInProgress(plant) : undefined; }
function isSharedWorldMergeActive() { return _systemsApi ? _systemsApi.isSharedWorldMergeActive() : undefined; }
function isSproutStage3Or5IdleNoGrowth(plant, now) { return _systemsApi ? _systemsApi.isSproutStage3Or5IdleNoGrowth(plant, now) : undefined; }
function isWorldChatBlockingGameInput() { return _systemsApi ? _systemsApi.isWorldChatBlockingGameInput() : false; }
function isWorldRockPickupUnlocked() { return _systemsApi ? _systemsApi.isWorldRockPickupUnlocked() : undefined; }
function isWorldServerSyncAvailable() { return _systemsApi ? _systemsApi.isWorldServerSyncAvailable() : undefined; }
function keepButterfliesInsideActiveBounds() { return _systemsApi ? _systemsApi.keepButterfliesInsideActiveBounds() : undefined; }
function markWorldDirty() { return _systemsApi ? _systemsApi.markWorldDirty() : undefined; }
function movePlayerVerticallyInTree(deltaDepth) { return _systemsApi ? _systemsApi.movePlayerVerticallyInTree(deltaDepth) : undefined; }
function pickRandomWorldRockSpawnPosition(size, ctx, existingRocks) { return _systemsApi ? _systemsApi.pickRandomWorldRockSpawnPosition(size, ctx, existingRocks) : undefined; }
function pruneButterflyAuthorityWaypointsToList() { return _systemsApi ? _systemsApi.pruneButterflyAuthorityWaypointsToList() : undefined; }
function pruneStaleMultiplayerRoomSessions(now) { return _systemsApi ? _systemsApi.pruneStaleMultiplayerRoomSessions(now) : undefined; }
function pruneStaleRemotePlayers() { return _systemsApi ? _systemsApi.pruneStaleRemotePlayers() : undefined; }
function refillWellIfNeeded() { return _systemsApi ? _systemsApi.refillWellIfNeeded() : undefined; }
function removeButterflyRenderEntry(id) { return _systemsApi ? _systemsApi.removeButterflyRenderEntry(id) : undefined; }
function removeExpiredWorldBagDrops(now) { return _systemsApi ? _systemsApi.removeExpiredWorldBagDrops(now) : undefined; }
function respawnApplesIfNeeded() { return _systemsApi ? _systemsApi.respawnApplesIfNeeded() : undefined; }
function saveAppleState() { return _systemsApi ? _systemsApi.saveAppleState() : undefined; }
function savePlayerHealthState() { return _systemsApi ? _systemsApi.savePlayerHealthState() : undefined; }
function saveSeedState(opts) { return _systemsApi ? _systemsApi.saveSeedState(opts) : undefined; }
function setInstantHoverTip(el, text) { return _systemsApi ? _systemsApi.setInstantHoverTip(el, text) : undefined; }
function setWorldPosition(element, x, y) { return _systemsApi ? _systemsApi.setWorldPosition(element, x, y) : undefined; }
function setWorldSize(element, width, height) { return _systemsApi ? _systemsApi.setWorldSize(element, width, height) : undefined; }
function shouldPauseWaterDecayForPlant(plant, now) { return _systemsApi ? _systemsApi.shouldPauseWaterDecayForPlant(plant, now) : undefined; }
function shouldRunButterflyMotionSimulation(now, onlineAvailable) { return _systemsApi ? _systemsApi.shouldRunButterflyMotionSimulation(now, onlineAvailable) : undefined; }
function shouldSkipPlantWaterDecayNow(simNow) { return _systemsApi ? _systemsApi.shouldSkipPlantWaterDecayNow(simNow) : undefined; }
function simulateButterflyAuthorityStep(butterfly, now) { return _systemsApi ? _systemsApi.simulateButterflyAuthorityStep(butterfly, now) : undefined; }
function snapPlayerToCraftChair(chair) { return _systemsApi ? _systemsApi.snapPlayerToCraftChair(chair) : undefined; }
function standUpFromChair() { return _systemsApi ? _systemsApi.standUpFromChair() : undefined; }
function syncWorldState(forceSave, options) { return _systemsApi ? _systemsApi.syncWorldState(forceSave, options) : undefined; }
function teardownWorldBagDropDom(drop) { return _systemsApi ? _systemsApi.teardownWorldBagDropDom(drop) : undefined; }
function tickPlayerHealth(nowMs) { return _systemsApi ? _systemsApi.tickPlayerHealth(nowMs) : undefined; }
function tickPlayerPosition() { return _systemsApi ? _systemsApi.tickPlayerPosition() : undefined; }
function tickWorldBagDropDespawn(now) { return _systemsApi ? _systemsApi.tickWorldBagDropDespawn(now) : undefined; }
function tickWorldRockRespawn(now) { return _systemsApi ? _systemsApi.tickWorldRockRespawn(now) : undefined; }
function tryRespawnOneWorldRockIfBelowCap() { return _systemsApi ? _systemsApi.tryRespawnOneWorldRockIfBelowCap() : undefined; }
function updateButterflies() { return _systemsApi ? _systemsApi.updateButterflies() : undefined; }
function updatePlantWaterLevel() { return _systemsApi ? _systemsApi.updatePlantWaterLevel() : undefined; }
function updateRemotePlayerCount() { return _systemsApi ? _systemsApi.updateRemotePlayerCount() : undefined; }
function updateWellCard() { return _systemsApi ? _systemsApi.updateWellCard() : undefined; }
function updateWellImage() { return _systemsApi ? _systemsApi.updateWellImage() : undefined; }
function updateWorldBagDropDom(forceRebuild) { return _systemsApi ? _systemsApi.updateWorldBagDropDom(forceRebuild) : undefined; }
function updateWorldRocks() { return _systemsApi ? _systemsApi.updateWorldRocks() : undefined; }
function worldRockOverlapsAnyAvoidRect(rockRect, zones) { return _systemsApi ? _systemsApi.worldRockOverlapsAnyAvoidRect(rockRect, zones) : undefined; }
function worldRockRect(x, y, size) { return _systemsApi ? _systemsApi.worldRockRect(x, y, size) : undefined; }



function addNetworkDebugLog(message) { return _networkApi ? _networkApi.addNetworkDebugLog(message) : undefined; }
function applyServerWorldRowTimestamps(row) { return _networkApi ? _networkApi.applyServerWorldRowTimestamps(row) : undefined; }
function saveSharedWorldAndReload(options) { return _networkApi ? _networkApi.saveSharedWorldAndReload(options) : undefined; }
function pollWorldState(forcePoll) { return _networkApi ? _networkApi.pollWorldState(forcePoll) : undefined; }
function getSharedWorldSnapshot() { return _networkApi ? _networkApi.getSharedWorldSnapshot() : undefined; }
function applySharedWorldSnapshot(snapshot, serverRowUpdatedAt) { return _networkApi ? _networkApi.applySharedWorldSnapshot(snapshot, serverRowUpdatedAt) : undefined; }
function ingestSharedPlantIndexBonus(snapshot) { return _networkApi ? _networkApi.ingestSharedPlantIndexBonus(snapshot) : undefined; }
function syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt) { return _networkApi ? _networkApi.syncServerClockOffsetFromRowUpdatedAt(serverRowUpdatedAt) : undefined; }
function holdLocalPlantStateAgainstStaleSnapshot(ms) { return _networkApi ? _networkApi.holdLocalPlantStateAgainstStaleSnapshot(ms) : undefined; }
function holdLocalAppleStateAgainstStaleSnapshot(ms) { return _networkApi ? _networkApi.holdLocalAppleStateAgainstStaleSnapshot(ms) : undefined; }
function flushPassiveSimulationBeforeSharedSnapshot() { return _networkApi ? _networkApi.flushPassiveSimulationBeforeSharedSnapshot() : undefined; }
function setupMultiplayer() { return _networkApi ? _networkApi.setupMultiplayer() : undefined; }
function sendMultiplayerPresence(forceSend) { return _networkApi ? _networkApi.sendMultiplayerPresence(forceSend) : undefined; }
function renderRemotePlayersFromPresence(presenceState) { return _networkApi ? _networkApi.renderRemotePlayersFromPresence(presenceState) : undefined; }
function broadcastBucketState(forceSend) { return _networkApi ? _networkApi.broadcastBucketState(forceSend) : undefined; }
function handleRemoteBucketBroadcast(payload) { return _networkApi ? _networkApi.handleRemoteBucketBroadcast(payload) : undefined; }
function sendMultiplayerLeave() { return _networkApi ? _networkApi.sendMultiplayerLeave() : undefined; }


/*** Plant timestamps in snapshots use the saver's Date.now(). Another client's clock
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
  if (!getPlant().isSeedPlanted || !incomingPlant || incomingPlant.isSeedPlanted) {
    return false;
  }
  if (isReloadingForWorldReset || Date.now() - Number(lastWorldResetAt || 0) < 20000) {
    return false;
  }
  const status = getPlant().status || "normal";
  if (status === "normal" || status === "wet") {
    return true;
  }
  if (status === "dry") {
    const dryAt = Number(getPlant().drySoilAt);
    return !Number.isFinite(dryAt) || Date.now() - dryAt < plantDrySoilClearMs;
  }
  if (status === "rotten" || getPlant().isOverwatered) {
    const rottenAt = Number(getPlant().rottenAt);
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




/** Monotonic merge of shared admin plant-index bonus (never decreases). */




function refreshSharedWaterIndicators() {
  if (getPlant().isSeedPlanted && shouldShowFirstWaterNeededDroplet(getPlant())) {
    waterNeeded.style.display = "block";
    setWorldPosition(
      waterNeeded,
      getPlant().spotX + PLANT_SPOT_WIDTH / 2 - WATER_NEEDED_SIZE / 2,
      getPlant().spotY - WATER_NEEDED_SIZE - 2
    );
  } else {
    waterNeeded.style.display = "none";
  }

  getApple().extraPlants.forEach(function (plant) {
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


/** Shared row is authoritative; passive local ticks must not push over others' saves. */

/**
 * ???????? ?????: ????????? `rebasePlantModelTimestampsToLocalNow`?sanitize??
 * `getSynchronizedNow()`(???? ????? ??? ??????????? ????????????
 * ????????`Date.now()`????? ??????????????? ?????????????? ?? ???????
 */

function dropHeldItem() {
  if (isOnboardingLinearGateActive()) {
    if (getInventory().heldItem === HELD_ITEM_BUCKET && getOnboarding().flowStep !== ONBOARDING_STEP_DROP_BUCKET) {
      flashOnboardingOrderHint("");
      return;
    }
    if (getInventory().heldItem === HELD_ITEM_SEED && getOnboarding().flowStep !== ONBOARDING_STEP_PLANT) {
      flashOnboardingOrderHint("");
      return;
    }
    if (isHeldExtraSeed(getInventory().heldItem) && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
      flashOnboardingOrderHint("");
      return;
    }
  }

  if (getInventory().heldItem === HELD_ITEM_SEED) {
    dropSeed();
    return;
  }

  if (isHeldExtraSeed(getInventory().heldItem)) {
    dropExtraSeed();
    return;
  }

  if (getInventory().heldItem === HELD_ITEM_BUCKET) {
    dropBucket();
  }
}

function dropSeed() {
  const playerBox = getPlayerBox();
  const seedSize = getSeedSize();

  getWorldItems().seedX = playerBox.left + playerBox.width / 2 - seedSize.width / 2;
  getWorldItems().seedY = playerBox.bottom - seedSize.height;
  getInventory().heldItem = null;
}

function dropExtraSeed() {
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed) {
    getInventory().heldItem = null;
    return;
  }

  if (usesWorldLooseSeedMode()) {
    const seedIndex = getApple().extraSeeds.indexOf(extraSeed);
    if (seedIndex >= 0) {
      getApple().extraSeeds.splice(seedIndex, 1);
    }
    getApple().seedCount = Math.min(500, getApple().seedCount + 1);
    getInventory().heldItem = null;
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
  getInventory().heldItem = null;
  saveAppleState();
}

function dropBucket() {
  const playerBox = getPlayerBox();
  const bucketSize = getBucketSize();
  const dropX = playerBox.left + playerBox.width / 2 - bucketSize.width / 2;
  const dropY = playerBox.bottom - bucketSize.height;

  if (isHoldingExtraBucket()) {
    if (!Array.isArray(getApple().worldExtraBuckets)) getApple().worldExtraBuckets = [];
    const extraId = String(getInventory().heldBucketId || "");
    const droppedExtraId =
      extraId || "world-bucket-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6);
    const resolvedDrop = resolveGroundBucketDropPosition(dropX, dropY, {
      mainX: getInventory().heldExtraBucketMainX,
      mainY: getInventory().heldExtraBucketMainY
    });
    getApple().worldExtraBuckets.push({
      id: droppedExtraId,
      x: resolvedDrop.x,
      y: resolvedDrop.y,
      isFull: Boolean(getInventory().isBucketFull)
    });
    notePendingLocalExtraBucketDrop(droppedExtraId);
    getWorldItems().bucketX = Number.isFinite(getInventory().heldExtraBucketMainX) ? getInventory().heldExtraBucketMainX : getWorldItems().bucketX;
    getWorldItems().bucketY = Number.isFinite(getInventory().heldExtraBucketMainY) ? getInventory().heldExtraBucketMainY : getWorldItems().bucketY;
    getInventory().heldItem = null;
    getInventory().heldBucketId = "";
    getInventory().heldExtraBucketMainX = 0;
    getInventory().heldExtraBucketMainY = 0;
    getInventory().isBucketFull = Boolean(getInventory().heldExtraBucketMainIsFull);
    getInventory().heldExtraBucketMainIsFull = false;
    getInventory().mainBucketParkedX = 0;
    getInventory().mainBucketParkedY = 0;
    getInventory().mainBucketParkedIsFull = false;
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
  getWorldItems().bucketX = resolvedMainDrop.x;
  getWorldItems().bucketY = resolvedMainDrop.y;
  getInventory().heldItem = null;
  getInventory().heldBucketId = "";
  getInventory().heldExtraBucketMainX = 0;
  getInventory().heldExtraBucketMainY = 0;
  getInventory().heldExtraBucketMainIsFull = false;
  getInventory().mainBucketParkedX = 0;
  getInventory().mainBucketParkedY = 0;
  getInventory().mainBucketParkedIsFull = false;
  window.OVC_SHARED_BUCKET_HELD_BY = "";
  broadcastBucketState(true);
  saveBucketState();
  syncWorldState(true);
  onboardingHookDroppedBucketForTutorial();
}

function onboardingShouldKeepWorldMainSeedVisible() {
  if (getStoredFlag(onboardingFlowDoneKey)) return false;
  if (getOnboarding().flowStep < 1 || getOnboarding().flowStep > 6) return false;
  if (hasPickedMainSeedInCurrentRoom()) return false;
  if (getPlant().isPlanting) return false;
  return true;
}


/**
 * ???????????(WORLD_LOOSE_SEED_* = SEED_START)????? extraSeeds ??????????????? ????.
 * ????? #seed?????? ????? img?? legacy ???????????????????? ???.
 */

function updateExtraSeedsAndPlants() {
  const now = getSharedPlantSimulationNow();
  let didAutoRemoveDryExtraSeed = false;

  if (isTutorialDocumentEntry() && worldLooseSeedElement) {
    worldLooseSeedElement.remove();
    worldLooseSeedElement = null;
  }

  if (usesWorldLooseSeedMode() && isHeldExtraSeed(getInventory().heldItem) && !getHeldExtraSeed()) {
    getInventory().heldItem = null;
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
        getApple().worldLooseSeed.x,
        getApple().worldLooseSeed.y
      );
    } else if (worldLooseSeedElement.style.display !== "none") {
      worldLooseSeedElement.style.display = "none";
    }
  } else if (worldLooseSeedElement) {
    worldLooseSeedElement.remove();
    worldLooseSeedElement = null;
  }

  if (usesWorldLooseSeedMode()) {
    const heldExtraId = getHeldExtraSeedId(getInventory().heldItem);
    const beforeStrip = getApple().extraSeeds.length;
    getApple().extraSeeds = getApple().extraSeeds.filter(function (s) {
      if (!s) return false;
      if (s.planted) return true;
      if (s.inInventory) return true;
      if (getInventory().plantingInventorySeedId && String(s.id) === String(getInventory().plantingInventorySeedId)) {
        return true;
      }
      if (heldExtraId && String(s.id) === String(heldExtraId)) {
        return true;
      }
      return false;
    });
    if (sanitizeWorldLooseModeExtraSeeds()) {
      saveAppleState();
    } else if (getApple().extraSeeds.length !== beforeStrip) {
      saveAppleState();
    }
  }

  getApple().extraSeeds = getApple().extraSeeds.filter(function (extraSeed) {
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
    if (getInventory().heldItem === createHeldExtraSeed(extraSeed.id)) {
      getInventory().heldItem = null;
    }
    didAutoRemoveDryExtraSeed = true;
    return false;
  });

  getApple().extraSeeds.forEach(function (extraSeed) {
    ensureExtraSeedElement(extraSeed);
    const isDry = isExtraSeedDry(extraSeed, now);
    extraSeed.element.src = isDry ? IMG_SEED_DRY : IMG_SEED;
    const hideGroundOverlap = shouldHideExtraSeedOverlappingDesignatedGroundPickSlot(extraSeed);
    extraSeed.element.style.display =
      extraSeed.planted || extraSeed.inInventory || hideGroundOverlap ? "none" : "block";

    if (getInventory().heldItem === createHeldExtraSeed(extraSeed.id)) {
      if (isDry) {
        getInventory().heldItem = null;
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
  getApple().extraPlants.forEach(function (plant) {
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
  getApple().extraPlants = getApple().extraPlants.filter(function (plant) {
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



function syncPlantWaterCapacityField(plant) {
  if (!plant) return;
  plant.waterCapacity = getPlantWaterCapacity(plant);
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
  if (getPlant().isSeedPlanted) {
    applyPlantDepthZIndexToElements(
      getPlant(),
      plantSpot,
      sprout,
      mainPlantGrowthMeter && mainPlantGrowthMeter.element
    );
  }
  getApple().extraPlants.forEach(function (plant) {
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
  if (getPlant().isSeedPlanted) plants.push(getPlant());
  for (let i = 0; i < getApple().extraPlants.length; i += 1) {
    const plant = getApple().extraPlants[i];
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
  if (plant === getPlant() && !getPlant().isSeedPlanted) return false;
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
  if (getPlant().isSeedPlanted) consider(getPlant());
  for (let i = 0; i < getApple().extraPlants.length; i += 1) {
    consider(getApple().extraPlants[i]);
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
    return getApple().seedCount > 0;
  }
  return getApple().extraSeeds.some(function (extraSeed) {
    return (
      extraSeed.inInventory &&
      !extraSeed.planted &&
      extraSeed.id !== getInventory().plantingInventorySeedId
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


let worldNpcHoverAnchorEl = null;


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
    getWorldItems().hasGuideBook &&
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
    onboardingTryStartPlantIndexAfterSproutStage3();
  }
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


/** ????? 4?? ???? ?????(????????) ???????? ????? ?????; ????? ???????null */


/** ?????????????????????????????????? ??????? ??????????*/


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

function isStage3CompleteAwaitingMagicPowder(plant) {
  if (!plant || plant.status === "dry" || plant.status === "rotten" || plant.isOverwatered) {
    return false;
  }
  if (isPowderUpgradeInProgress(plant)) return false;
  return getSproutStageFromPlant(plant) === 3 && getNextPowderTargetTier(plant) > 0;
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
      if (getApple().seedCount <= 0) return false;
      getApple().seedCount = Math.max(0, getApple().seedCount - 1);
      updateBagInventorySlots();
      saveAppleState();
      return true;
    }
    const seedIndex = getApple().extraSeeds.findIndex(function (extraSeed) {
      return extraSeed.inInventory && !extraSeed.planted && extraSeed.id !== getInventory().plantingInventorySeedId;
    });
    if (seedIndex < 0) return false;
    discardInventorySeed(getApple().extraSeeds[seedIndex].id);
    return true;
  }
  if (itemKey === "overgrowthSeed") {
    if ((Number(getApple().overgrowthSeedCount) || 0) <= 0) return false;
    getApple().overgrowthSeedCount = Math.max(0, Math.floor(Number(getApple().overgrowthSeedCount) || 0) - 1);
    updateSeedInventory();
    saveAppleState();
    return true;
  }
  if (itemKey === "apple") {
    if (getApple().count <= 0) return false;
    getApple().count = Math.max(0, getApple().count - 1);
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
      getApple().seedCount = Math.min(500, getApple().seedCount + n);
    } else {
      for (let i = 0; i < n; i++) {
        getApple().extraSeeds.push({
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
    getApple().overgrowthSeedCount =
      Math.max(0, Math.floor(Number(getApple().overgrowthSeedCount) || 0)) + n;
    updateSeedInventory();
    saveAppleState();
    return;
  }
  if (itemKey === "apple") {
    getApple().count = Math.max(0, Number(getApple().count) || 0) + n;
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


/** ?????????????????????? ????????????????????? ?????????????????. ?????????? UI???????. */

/** 로직: 키 입력·충돌·좌표(getPlayer().x, getPlayer().depth, getPlayer().jumpY)만 갱신 (DOM 없음). */

/** 렌더: tickPlayerPosition이 갱신한 좌표를 DOM에 반영 */










function isPlayerHealthGameplayBlocked() {
  return !canPlayerMoveByHealth(getPlayer().health);
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
  getPlayer().sittingChairId = "";
  syncLocalPlayerPoseVisual();
}



function shouldApplyLocalPlayerTint() {
  return Boolean(
    selectedPlayerColor &&
      (hasChosenPlayerColor || isCharacterSelecting)
  );
}



function sitOnCraftChair(chair) {
  if (!chair) return false;
  getPlayer().sittingChairId = String(chair.id || "");
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
  if (getInventory().heldItem) return false;

  if (getPlayer().sittingChairId) {
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



function enterCraftHouse(house) {
  if (!house) return;
  getPlayer().outsideCraftHousePose = {
    x: getPlayer().x,
    depth: getPlayer().depth,
    jumpY: getPlayer().jumpY
  };
  getPlayer().insideCraftHouseId = String(house.id || "");
  syncLocalPlayerInsideCraftHouseVisual();
  updatePlayerHealthUi();
  sendMultiplayerPresence(true);
}

function exitCraftHouse() {
  if (!getPlayer().insideCraftHouseId) return;
  const pose = getPlayer().outsideCraftHousePose;
  if (pose) {
    getPlayer().x = Number(pose.x) || getPlayer().x;
    getPlayer().depth = Number(pose.depth) || getPlayer().depth;
    getPlayer().jumpY = Number(pose.jumpY) || 0;
    getPlayer().velocityY = 0;
    getPlayer().isOnGround = true;
  }
  getPlayer().insideCraftHouseId = "";
  getPlayer().outsideCraftHousePose = null;
  syncLocalPlayerInsideCraftHouseVisual();
  setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updatePlayerHealthUi();
  sendMultiplayerPresence(true);
}

function tryToggleCraftHouseEnter() {
  if (!hasSpawnedCharacter || isCharacterSelecting) return false;

  if (getPlayer().insideCraftHouseId) {
    exitCraftHouse();
    savePlayerHealthState();
    resetInputKeys(keys);
    return true;
  }

  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return false;
  }
  if (getInventory().heldItem || getPlayer().sittingChairId) return false;

  const house = findCraftHousePlayerIsTouching(
    getPlayer().x,
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
    getPlayer().health = PLAYER_MAX_HEALTH;
    getPlayer().lastHealthTickAt = 0;
    getPlayer().wasDrainingHealth = false;
    getPlayer().idleRechargeSince = 0;
    getPlayer().idleRechargeHealTicks = 0;
    getPlayer().healthDrainDebt = 0;
    getPlayer().healthGaugeVisible = true;
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      getPlayer().health = clampPlayerHealth(parsed.health);
      const savedAt = Number(parsed.savedAt);
      const lastTickAt = Number(parsed.lastTickAt ?? parsed.lastDrainAt);
      getPlayer().lastHealthTickAt = Number.isFinite(lastTickAt) && lastTickAt > 0 ? lastTickAt : 0;
      if (Number.isFinite(savedAt) && savedAt > 0 && getPlayer().lastHealthTickAt > savedAt + 600000) {
        getPlayer().lastHealthTickAt = 0;
      }
      getPlayer().healthDrainDebt = 0;
      getPlayer().healthGaugeVisible = parsed.gaugeVisible !== false;
      getPlayer().insideCraftHouseId = "";
      getPlayer().outsideCraftHousePose = null;
      resetPlayerChairSitState();
      syncLocalPlayerInsideCraftHouseVisual();
      return;
    }
  } catch (e) {}
  const legacy = clampPlayerHealth(raw);
  getPlayer().health = legacy;
  getPlayer().lastHealthTickAt = 0;
  getPlayer().wasDrainingHealth = false;
  getPlayer().idleRechargeSince = 0;
  getPlayer().idleRechargeHealTicks = 0;
  getPlayer().healthDrainDebt = 0;
  getPlayer().healthGaugeVisible = true;
  getPlayer().insideCraftHouseId = "";
  getPlayer().outsideCraftHousePose = null;
  resetPlayerChairSitState();
  syncLocalPlayerInsideCraftHouseVisual();
}






function isPlayerInTreeSpace() {
  return (
    !getPlayer().isTreeFalling &&
    (isPlayerNearTreeTrunk() || isPlayerInTreeCanopy())
  );
}






function startPlanting() {
  updateSeedDryState();

  if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_PLANT) {
    flashOnboardingOrderHint("");
    return;
  }

  if (isPlayerGameplayBlockedByNpcDialogue()) return;

  if (getInventory().heldItem !== HELD_ITEM_SEED || getPlant().isPlanting || !getPlayer().isOnGround || getPlant().isSeedDry) return;

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

  getPlant().spotX = targetPlantSpotX;
  getPlant().spotY = targetPlantSpotY;
  getInventory().heldItem = null;
  getPlant().isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    const plantedAt = getSharedPlantSimulationNow();
    getPlant().isPlanting = false;
    sendMultiplayerPresence(true);
    const spotX = getPlant().spotX;
    const spotY = getPlant().spotY;

    if (isSharedWorldMultiPlantMode() && getPlant().isSeedPlanted) {
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
      getApple().extraPlants.push(newPlant);
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

    getPlant().isSeedPlanted = true;
    getPlant().lastWateredAt = null;
    getPlant().wateredAtList = [];
    getPlant().status = "normal";
    getPlant().waterLevel = 1;
    getPlant().waterLevelUpdatedAt = plantedAt;
    getPlant().becameEmptyAt = null;
    getPlant().isOverwatered = false;
    getPlant().rottenAt = null;
    getPlant().needsFirstWater = false;
    getPlant().growthStartedAt = plantedAt;
    getPlant().plantedAt = plantedAt;
    getPlant().isSproutGrown = false;
    getPlant().sproutGrownAt = null;
    getPlant().sproutEvolutionMs = 0;
    getPlant().sproutEvolutionLastTickAt = null;
    getPlant().isSproutSelfSustaining = false;
    getPlant().growthTier = 0;
    getPlant().waterCapacity = 2;
    getPlant().powderUpgradeTargetTier = 0;
    getPlant().powderUpgradeStartedAt = null;
    getPlant().powderUpgradeDurationMs = 0;
    getPlant().grassAuto5EligibleAt = null;
    getPlant().seedKind = "";
    assignSproutIdentityToNewPlant(getPlant());
    ensureGrassOrdinalIfNeeded(getPlant());
    getPlant().blockSproutRegrowthAfterDry = false;
    getPlant().drySoilAt = null;
    playerStatus.textContent = "";
    seedCard.style.display = "none";
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, getPlant().spotX, getPlant().spotY);
    updatePlantState();
    updateNpcPosition();
    holdLocalPlantStateAgainstStaleSnapshot(3000);
    saveSeedState();
    onboardingNotifyMainPlantPlanted();
  }, plantActionMs);
}

function startPlantingExtraSeed() {
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    return;
  }
  if (isPlayerGameplayBlockedByNpcDialogue()) return;
  const extraSeed = getHeldExtraSeed();
  if (!extraSeed || getPlant().isPlanting || !getPlayer().isOnGround) {
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

  getInventory().heldItem = null;
  getPlant().isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    getPlant().isPlanting = false;
    sendMultiplayerPresence(true);
    extraSeed.planted = true;
    const newPlant = createExtraPlant("plant-" + extraSeed.id, plantX, plantY);
    assignSproutIdentityToNewPlant(newPlant);
    ensureGrassOrdinalIfNeeded(newPlant);
    getApple().extraPlants.push(newPlant);
    playerStatus.textContent = "";
    updateExtraSeedsAndPlants();
    holdLocalPlantStateAgainstStaleSnapshot(3000);
    holdLocalAppleStateAgainstStaleSnapshot(3000);
    saveAppleState();
  }, plantActionMs);
}

function plantWorldSeedCount() {
  if (!usesWorldLooseSeedMode() || getApple().seedCount <= 0) {
    updateSeedInventory();
    return;
  }

  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }

  if (
    getPlant().isPlanting ||
    getApple().isEating ||
    isPlayerGameplayBlockedByNpcDialogue() ||
    !getPlayer().isOnGround
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

  getInventory().plantingInventorySeedId = syntheticId;
  getPlant().isPlanting = true;
  playerStatus.textContent = "\uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    getPlant().isPlanting = false;
    sendMultiplayerPresence(true);
    getInventory().plantingInventorySeedId = null;
    getApple().seedCount = Math.max(0, getApple().seedCount - 1);

    if (!getPlant().isSeedPlanted) {
      const plantedAt = getSharedPlantSimulationNow();
      getPlant().spotX = plantX;
      getPlant().spotY = plantY;
      getPlant().isSeedPlanted = true;
      getPlant().lastWateredAt = null;
      getPlant().wateredAtList = [];
      getPlant().status = "normal";
      getPlant().waterLevel = 1;
      getPlant().waterLevelUpdatedAt = plantedAt;
      getPlant().becameEmptyAt = null;
      getPlant().isOverwatered = false;
      getPlant().rottenAt = null;
      getPlant().needsFirstWater = false;
      getPlant().growthStartedAt = plantedAt;
      getPlant().plantedAt = plantedAt;
      getPlant().isSproutGrown = false;
      getPlant().sproutGrownAt = null;
      getPlant().sproutEvolutionMs = 0;
      getPlant().sproutEvolutionLastTickAt = null;
      getPlant().isSproutSelfSustaining = false;
      getPlant().growthTier = 0;
      getPlant().waterCapacity = 2;
      getPlant().powderUpgradeTargetTier = 0;
      getPlant().powderUpgradeStartedAt = null;
      getPlant().powderUpgradeDurationMs = 0;
      getPlant().grassAuto5EligibleAt = null;
      getPlant().seedKind = "";
      assignSproutIdentityToNewPlant(getPlant());
      ensureGrassOrdinalIfNeeded(getPlant());
      getPlant().blockSproutRegrowthAfterDry = false;
      getPlant().drySoilAt = null;
      plantSpot.style.display = "block";
      setWorldPosition(plantSpot, getPlant().spotX, getPlant().spotY);
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
      getApple().extraPlants.push(invPlant);
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
  if ((Number(getApple().overgrowthSeedCount) || 0) <= 0) {
    updateSeedInventory();
    return;
  }

  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
    flashOnboardingOrderHint("");
    updateSeedInventory();
    return;
  }

  if (
    getPlant().isPlanting ||
    getApple().isEating ||
    isPlayerGameplayBlockedByNpcDialogue() ||
    !getPlayer().isOnGround
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

  getInventory().plantingInventorySeedId = syntheticId;
  getPlant().isPlanting = true;
  playerStatus.textContent = "\uACFC\uC131\uC7A5 \uC528\uC557 \uC2EC\uB294\uC911...";
  updateSeedInventory();
  saveAppleState();
  sendMultiplayerPresence(true);

  window.setTimeout(function () {
    getPlant().isPlanting = false;
    sendMultiplayerPresence(true);
    getInventory().plantingInventorySeedId = null;
    getApple().overgrowthSeedCount =
      Math.max(0, Math.floor(Number(getApple().overgrowthSeedCount) || 0) - 1);

    if (!getPlant().isSeedPlanted) {
      const plantedAt = getSharedPlantSimulationNow();
      getPlant().spotX = plantX;
      getPlant().spotY = plantY;
      getPlant().isSeedPlanted = true;
      getPlant().lastWateredAt = null;
      getPlant().wateredAtList = [];
      getPlant().status = "normal";
      getPlant().waterLevel = 1;
      getPlant().waterLevelUpdatedAt = plantedAt;
      getPlant().becameEmptyAt = null;
      getPlant().isOverwatered = false;
      getPlant().rottenAt = null;
      getPlant().needsFirstWater = false;
      getPlant().growthStartedAt = plantedAt;
      getPlant().plantedAt = plantedAt;
      getPlant().isSproutGrown = false;
      getPlant().sproutGrownAt = null;
      getPlant().sproutEvolutionMs = 0;
      getPlant().sproutEvolutionLastTickAt = null;
      getPlant().isSproutSelfSustaining = false;
      getPlant().growthTier = 0;
      getPlant().waterCapacity = 2;
      getPlant().powderUpgradeTargetTier = 0;
      getPlant().powderUpgradeStartedAt = null;
      getPlant().powderUpgradeDurationMs = 0;
      getPlant().grassAuto5EligibleAt = null;
      getPlant().seedKind = "overgrowth";
      assignSproutIdentityToNewPlant(getPlant());
      ensureGrassOrdinalIfNeeded(getPlant());
      getPlant().blockSproutRegrowthAfterDry = false;
      getPlant().drySoilAt = null;
      plantSpot.style.display = "block";
      setWorldPosition(plantSpot, getPlant().spotX, getPlant().spotY);
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
      getApple().extraPlants.push(invPlant);
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
  clearOrdinals(getPlant());
  getApple().extraPlants.forEach(clearOrdinals);

  const groups = Object.create(null);
  function consider(plant) {
    if (!plant) return;
    if (plant === getPlant() && !getPlant().isSeedPlanted) return;
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
  consider(getPlant());
  getApple().extraPlants.forEach(consider);

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


function clearPlantHoverRing() {
  if (!plantHoverRing) return;
  plantHoverRing.classList.remove("is-visible", "is-needs-water");
  plantHoverRing.style.display = "none";
}

/** 호버 링 중심·크기용 — 보이는 식물 본체(새싹 우선, 없으면 흙) */

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
  if (getPlant().isSeedPlanted) tryPlant(getPlant());
  getApple().extraPlants.forEach(tryPlant);
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



function canWaterPlantByClick(plant) {
  if (!plant) return false;
  if (plant === getPlant() && !getPlant().isSeedPlanted) return false;
  if (plant.status === "rotten" || plant.status === "dry" || plant.isOverwatered) {
    return false;
  }
  if (shouldSuppressPlantWaterCardForSelfSustaining(plant)) {
    if (
      isOnboardingMainPlantWateringTutorialStep() &&
      plant === getPlant()
    ) {
      return true;
    }
    return false;
  }
  return true;
}

function plantToWateringTarget(plant) {
  if (plant === getPlant()) {
    return { type: "main", plant: getPlant() };
  }
  return { type: "extra", plant: plant };
}

/** ???? 0?????? ??????????? ?????? ?????? ????? ??? */




function performInteractActionCore() {
  const now = Date.now();
  if (getInventory().heldItem) {
    if (getInventory().heldItem === HELD_ITEM_BUCKET && now - getSeedWorld().lastBucketPickupAt < 260) {
      return;
    }
    dropHeldItem();
    return;
  }
  if (pickUpWorldBag()) return;
  if (!hasGuideBookItemInBagCounts() && pickUpWorldGuideBookNoHold()) return;
  if (!getWorldItems().hasGuideBook) {
    const bucketPick = getNearestGroundBucketPickInfo();
    const bucketDistance = bucketPick ? bucketPick.distance : Infinity;
    if (tryPickupNearestWorldRock(bucketDistance)) return;
    return;
  }
  if (tryCatchButterfly()) return;
  if (pickApple()) return;
  pickUpNearestItem();
}

function performInteractAction() {
  if (isPlayerInsideEnteredCraftHouse()) return;
  if (isPlayerHealthGameplayBlocked()) return;
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) return;
  const now = Date.now();
  if (now - getSeedWorld().lastPickupToggleAt < 180) return;
  getSeedWorld().lastPickupToggleAt = now;
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
  if (getInventory().heldItem !== HELD_ITEM_BUCKET) return false;
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
    worldRectFromXYWH(getWorldItems().bucketX, getWorldItems().bucketY, bucketSize.width, bucketSize.height)
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
  const extras = Array.isArray(getApple().worldExtraBuckets) ? getApple().worldExtraBuckets : [];
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
  if (!getApple().worldBagDrops.length) return false;
  let hit = null;
  getApple().worldBagDrops.forEach(function (drop) {
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
  const idx = getApple().worldBagDrops.findIndex(function (d) {
    return d && String(d.id) === dropId;
  });
  if (idx < 0) return false;
  teardownWorldBagDropDom(getApple().worldBagDrops[idx]);
  getApple().worldBagDrops.splice(idx, 1);
  addBagItemsForTrade(itemKey, count);
  const now = Date.now();
  lastWorldBagDropChangeAt = now;
  getApple().lastStateChangeAt = Math.max(getApple().lastStateChangeAt, now);
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
  getApple().apples.forEach(function (apple) {
    if (getApple().pickedIds.includes(apple.id)) return;
    const rect = worldRectFromXYWH(apple.x, apple.y, apple.size, apple.size);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("apple", apple.y, { id: apple.id });
    }
  });

  ensureWorldBagDropsArray();
  getApple().worldBagDrops.forEach(function (drop) {
    if (!drop) return;
    const rect = worldRectFromXYWH(drop.x, drop.y, BAG_DROP_WORLD_SIZE, BAG_DROP_WORLD_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("world-bag-drop", drop.y, { id: drop.id });
    }
  });

  if (worldBag && worldBag.style.display !== "none") {
    const rect = worldRectFromXYWH(getWorldItems().worldBagX, getWorldItems().worldBagY, WORLD_BAG_WIDTH, WORLD_BAG_HEIGHT);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("world-bag-floor", getWorldItems().worldBagY);
    }
  }

  if (guideBook && guideBook.style.display !== "none") {
    const rect = worldRectFromXYWH(getWorldItems().guideBookX, getWorldItems().guideBookY, GUIDE_BOOK_WIDTH, GUIDE_BOOK_HEIGHT);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("guide-book", getWorldItems().guideBookY);
    }
  }

  const seedSize = getSeedSize();
  if (canPickUpSeed()) {
    const rect = worldRectFromXYWH(getWorldItems().seedX, getWorldItems().seedY, seedSize.width, seedSize.height);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-main", getWorldItems().seedY);
    }
  }

  const now = getSynchronizedNow();
  syncWorldLoosePickupLock(now);
  if (
    usesWorldLooseSeedMode() &&
    canPickWorldLooseSeedAt(getApple().worldLooseSeed, worldLoosePickupLockUntil, now)
  ) {
    ensureWorldLooseSeedShape();
    const ws = getApple().worldLooseSeed;
    const rect = worldRectFromXYWH(ws.x, ws.y, SEED_SIZE, SEED_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-loose", ws.y, { id: WORLD_LOOSE_SEED_ID });
    }
  }

  getApple().extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.planted || isExtraSeedDry(extraSeed)) return;
    if (usesWorldLooseSeedMode() && !extraSeed.inInventory) return;
    const rect = worldRectFromXYWH(extraSeed.x, extraSeed.y, SEED_SIZE, SEED_SIZE);
    if (isWorldPointInsideRect(wx, wy, rect)) {
      push("seed-extra", extraSeed.y, { id: extraSeed.id });
    }
  });

  if (isWorldDocumentEntry() && isWorldRockPickupUnlocked()) {
    getApple().worldRocks.forEach(function (rock) {
      if (!rock || getApple().worldRockPickedIds.includes(rock.id)) return;
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
        ? getWorldItems().bucketY
        : (function () {
            const extras = getApple().worldExtraBuckets || [];
            const entry = extras.find(function (b) {
              return b && String(b.id) === String(bucketPick.id);
            });
            return entry ? entry.y : getWorldItems().bucketY;
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
        getApple().apples.find(function (candidate) {
          return (
            !getApple().pickedIds.includes(candidate.id) &&
            isPlayerOverlappingRect(candidate.x, candidate.y, candidate.size, candidate.size)
          );
        })
      );
    case "world-bag-drop":
      return Boolean(
        findNearestWorldBagDropPickup(
          getApple().worldBagDrops,
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
      const ws = getApple().worldLooseSeed;
      return getCenterDistance(ws.x, ws.y, SEED_SIZE, SEED_SIZE) < pickupDistance;
    }
    case "seed-extra": {
      const seedId = target.data && target.data.id;
      const extra = getApple().extraSeeds.find(function (s) {
        return s && String(s.id) === String(seedId);
      });
      if (!extra || extra.planted || isExtraSeedDry(extra)) return false;
      return getCenterDistance(extra.x, extra.y, SEED_SIZE, SEED_SIZE) < pickupDistance;
    }
    case "rock": {
      const rockId = target.data && target.data.id;
      const rock = getApple().worldRocks.find(function (r) {
        return r && String(r.id) === String(rockId);
      });
      if (!rock || getApple().worldRockPickedIds.includes(rock.id)) return false;
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
      if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== 6) {
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
      if (!canPickWorldLooseSeedAt(getApple().worldLooseSeed, worldLoosePickupLockUntil, now)) {
        return false;
      }
      ensureWorldLooseSeedShape();
      getApple().seedCount += 1;
      scheduleWorldLooseRespawnAfterPickup(getApple().worldLooseSeed, now);
      lastWorldLooseSeedPickupAt = Math.max(lastWorldLooseSeedPickupAt, now);
      worldLoosePickupLockUntil = Math.max(
        Number(worldLoosePickupLockUntil || 0),
        Number(getApple().worldLooseSeed.nextSpawnAt || 0)
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
      const extra = getApple().extraSeeds.find(function (s) {
        return s && String(s.id) === String(seedId);
      });
      if (!extra || extra.planted || isExtraSeedDry(extra)) return false;
      if (getCenterDistance(extra.x, extra.y, SEED_SIZE, SEED_SIZE) > pickupDistance) {
        return false;
      }
      if (isWorldLooseSyntheticPickupCandidate(extra)) {
        return tryPerformTargetedWorldInteract({ kind: "seed-loose" }, wx, wy);
      }
      if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_EXTRA_SEED) {
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
      const rock = getApple().worldRocks.find(function (r) {
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
    if (bagNow - getSeedWorld().lastPickupToggleAt < 180) return false;
    getSeedWorld().lastPickupToggleAt = bagNow;
    return pickUpWorldBag();
  }

  if (getInventory().heldItem === HELD_ITEM_BUCKET && isPointerOnHeldBucket(clientX, clientY)) {
    const now = Date.now();
    if (now - getSeedWorld().lastPickupToggleAt < 180) return false;
    if (now - getSeedWorld().lastBucketPickupAt < 260) return false;
    getSeedWorld().lastPickupToggleAt = now;
    dropHeldItem();
    return true;
  }

  const pxy = groundClientToWorldXY(clientX, clientY);
  if (!pxy) return false;

  const target = pickWorldInteractTargetAtWorldPoint(pxy.x, pxy.y);
  if (!target) return false;
  if (!isPlayerNearWorldInteractTarget(target)) return false;

  const now = Date.now();
  if (now - getSeedWorld().lastPickupToggleAt < 180) return false;
  getSeedWorld().lastPickupToggleAt = now;

  if (getInventory().heldItem) {
    performInteractActionCore();
    return true;
  }

  if (tryPerformTargetedWorldInteract(target, pxy.x, pxy.y)) return true;
  performInteractActionCore();
  return true;
}

function tryWaterPlantByPointerClick(clientX, clientY) {
  if (isWorldFloorBagAwaitingPickup()) return false;
  if (getInventory().heldItem !== HELD_ITEM_BUCKET || !getInventory().isBucketFull) return false;
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
    getOnboarding().flowStep === ONBOARDING_STEP_WATER_APPROACH &&
    target.type === "main"
  ) {
    getOnboarding().flowStep = ONBOARDING_STEP_WATER_POUR;
    persistOnboardingStep();
  }
  waterPlant(target);
  if (anchor) {
    createWaterSplashAt(anchor.x + PLANT_SPOT_WIDTH / 2, anchor.y + PLANT_SPOT_HEIGHT * 0.55, null);
  } else {
    triggerWaterSplash();
  }
  getInventory().isBucketFull = false;
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
  if (!Array.isArray(getApple().worldRocks)) return false;
  const pickedIds = Array.isArray(getApple().worldRockPickedIds)
    ? getApple().worldRockPickedIds
    : [];
  return getApple().worldRocks.some(function (rock) {
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
  if (plantSpotOverlapsExpandedRect(plantX, plantY, getWorldItems().wellX, getWorldItems().wellY, WELL_SIZE, WELL_SIZE, wellPad)) {
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
      getWorldItems().worldBagX,
      getWorldItems().worldBagY,
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
      getWorldItems().guideBookX,
      getWorldItems().guideBookY,
      GUIDE_BOOK_WIDTH,
      GUIDE_BOOK_HEIGHT,
      bookPad
    )
  ) {
    return plantProximityPhraseForNoun("\uCC45");
  }

  if (isPlantMasterVisible()) {
    const npcPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, getNpc().x, getNpc().y, NPC_WIDTH, NPC_HEIGHT, npcPad)) {
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

  if (!getPlant().isSeedPlanted && seed && seed.style.display !== "none") {
    const seedPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, getWorldItems().seedX, getWorldItems().seedY, SEED_SIZE, SEED_SIZE, seedPad)) {
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
      getApple().worldLooseSeed.x,
      getApple().worldLooseSeed.y,
      SEED_SIZE,
      SEED_SIZE,
      0
    )
  ) {
    blockedByLooseSeed = true;
  }
  getApple().extraSeeds.forEach(function (extraSeed) {
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

  if (getInventory().heldItem !== HELD_ITEM_BUCKET && bucket && bucket.style.display === "block") {
    const bsz = getBucketSize();
    const bucketPad = 0;
    if (plantSpotOverlapsExpandedRect(plantX, plantY, getWorldItems().bucketX, getWorldItems().bucketY, bsz.width, bsz.height, bucketPad)) {
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
  if (!Array.isArray(getApple().worldRocks)) return false;
  const pickedIds = Array.isArray(getApple().worldRockPickedIds)
    ? getApple().worldRockPickedIds
    : [];
  return getApple().worldRocks.some(function (rock) {
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

  const wx = Number.isFinite(getWorldItems().wellX) && getWorldItems().wellX > 0 ? getWorldItems().wellX : WELL_START_X;
  const wy = Number.isFinite(getWorldItems().wellY) && getWorldItems().wellY > 0 ? getWorldItems().wellY : WELL_START_Y;
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
    if (craftPlacementOverlapsExpandedRect(placement, getNpc().x, getNpc().y, NPC_WIDTH, NPC_HEIGHT, 0)) {
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
    const lx = Number(getApple().worldLooseSeed && getApple().worldLooseSeed.x) || WORLD_LOOSE_SEED_X;
    const ly = Number(getApple().worldLooseSeed && getApple().worldLooseSeed.y) || WORLD_LOOSE_SEED_Y;
    if (craftPlacementOverlapsExpandedRect(placement, lx, ly, SEED_SIZE, SEED_SIZE, 0)) {
      return craftInstallBlockPhraseForNoun("\uC528\uC557");
    }
  }

  if (!getPlant().isSeedPlanted && seed && seed.style.display !== "none") {
    if (craftPlacementOverlapsExpandedRect(placement, getWorldItems().seedX, getWorldItems().seedY, SEED_SIZE, SEED_SIZE, 0)) {
      return craftInstallBlockPhraseForNoun("\uC528\uC557");
    }
  }

  let blockedByGroundSeed = false;
  if (
    usesWorldLooseSeedMode() &&
    isWorldLooseSeedVisibleAt() &&
    craftPlacementOverlapsExpandedRect(
      placement,
      getApple().worldLooseSeed.x,
      getApple().worldLooseSeed.y,
      SEED_SIZE,
      SEED_SIZE,
      0
    )
  ) {
    blockedByGroundSeed = true;
  }
  getApple().extraSeeds.forEach(function (extraSeed) {
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
    const bx = Number.isFinite(getWorldItems().bucketX) && getWorldItems().bucketX > 0 ? getWorldItems().bucketX : WELL_START_X - bsz.width - 8;
    const by =
      Number.isFinite(getWorldItems().bucketY) && getWorldItems().bucketY > 0 ? getWorldItems().bucketY : WELL_START_Y + WELL_SIZE - bsz.height;
    if (craftPlacementOverlapsExpandedRect(placement, bx, by, bsz.width, bsz.height, 0)) {
      blockedByBucket = true;
    }
  }
  (Array.isArray(getApple().worldExtraBuckets) ? getApple().worldExtraBuckets : []).forEach(
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
    getPlant().isSeedPlanted &&
    Number.isFinite(getPlant().spotX) &&
    Number.isFinite(getPlant().spotY)
  ) {
    if (
      craftPlacementOverlapsExpandedRect(
        placement,
        getPlant().spotX,
        getPlant().spotY,
        PLANT_SPOT_WIDTH,
        PLANT_SPOT_HEIGHT,
        0
      )
    ) {
      return craftInstallBlockPhraseForNoun("\uC2DD\uBB3C");
    }
  }

  let blockedByPlant = false;
  getApple().extraPlants.forEach(function (plant) {
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

function canPlantAt(x, y) {
  pollWorldState(true);
  lastPlantProximityBlockMessage = "";
  const proximityMsg = getPlantProximityBlockMessage(x, y);
  if (proximityMsg) {
    lastPlantProximityBlockMessage = proximityMsg;
    return false;
  }
  const plantCenters = [];

  if (getPlant().isSeedPlanted) {
    const maturity = getPlantMaturityLevelForPlantingSpacing(getPlant());
    if (maturity != null) {
      plantCenters.push({
        x: getPlant().spotX + PLANT_SPOT_WIDTH / 2,
        y: getPlant().spotY + PLANT_SPOT_HEIGHT / 2,
        maturity: maturity
      });
    }
  }

  getApple().extraPlants.forEach(function (plant) {
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
  const id = getHeldExtraSeedId(getInventory().heldItem);
  if (!id) return null;
  return getApple().extraSeeds.find(function (extraSeed) {
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
    if (getInventory().heldItem === HELD_ITEM_BUCKET && !onboardingAllowsBucketQUse()) {
      flashOnboardingOrderHint("");
      return;
    }
  }

  if (getInventory().heldItem === HELD_ITEM_SEED) {
    startPlanting();
    return;
  }

  if (isHeldExtraSeed(getInventory().heldItem)) {
    startPlantingExtraSeed();
    return;
  }

  if (getInventory().heldItem === HELD_ITEM_BUCKET) {
    useBucket();
  }
}

function useBucket() {
  if (isPlayerTimedActionBusy() || isPlayerGameplayBlockedByNpcDialogue()) {
    return;
  }

  refillWellIfNeeded();
  // ??????? ???? ???? updateBucketPosition???? ??? ????????????? ????????? ??????????????
  if (getInventory().heldItem === HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSize();
    const handPosition = getHandPosition(bucketSize.width, bucketSize.height);
    getWorldItems().bucketX = handPosition.x;
    getWorldItems().bucketY = handPosition.y;
  }

  const wellReachForScoop =
    isNearWellIncludingBucketReach() || isBucketOverlappingWellForInteraction(10);
  const wellReachForPour =
    isNearWellForPouringIncludingBucketReach() || isBucketOverlappingWellForInteraction(10);

  if (!getInventory().isBucketFull) {
    if (wellReachForScoop && getWell().water > 0) {
      getInventory().isBucketFull = true;
      getWell().water -= 1;
      getWell().lastRefillAt = snapWellRefillToGrid(Date.now());
      saveWellState();
      syncWorldState(true);
      broadcastBucketState(false);
      updateWellImage();
      updateWellCard();
      onboardingHookFilledBucketAtWell();
    } else if (wellReachForScoop && getWell().water <= 0) {
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
    getWell().water < maxWellWater &&
    !wateringTarget
  ) {
    getWell().water += 1;
    getWell().lastRefillAt = snapWellRefillToGrid(Date.now());
    saveWellState();
    syncWorldState(true);
    updateWellImage();
    updateWellCard();
    triggerWaterSplash();
    getInventory().isBucketFull = false;
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
      getOnboarding().flowStep === ONBOARDING_STEP_WATER_APPROACH &&
      wateringTarget.type === "main"
    ) {
      getOnboarding().flowStep = ONBOARDING_STEP_WATER_POUR;
      persistOnboardingStep();
    }
    waterPlant(wateringTarget);
    triggerWaterSplash();
    getInventory().isBucketFull = false;
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
  if (nearWellPour && getWell().water >= maxWellWater) {
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
    getPlant().isSeedPlanted &&
    getPlant().status !== "dry" &&
    getPlant().status !== "rotten"
  ) {
    if (getNextPowderTargetTier(getPlant()) && !isPowderUpgradeInProgress(getPlant())) {
      const distance = getCenterDistance(
        getPlant().spotX,
        getPlant().spotY,
        PLANT_SPOT_WIDTH,
        PLANT_SPOT_HEIGHT
      );
      if (distance <= powderDistance) {
        nearest = { type: "main", plant: getPlant(), distance };
      }
    }
  }
  getApple().extraPlants.forEach(function (plant) {
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
  const splashX = getWorldItems().bucketX + bucketSize.width / 2;
  const splashY = getWorldItems().bucketY + bucketSize.height * 0.75;
  lastWaterSplashAt = Date.now();
  lastWaterSplashX = splashX;
  lastWaterSplashY = splashY;
  let refEl = null;
  if (
    getInventory().heldItem === HELD_ITEM_BUCKET &&
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
        plant === getPlant()
          ? { type: "main", plant: getPlant(), distance: distance }
          : { type: "extra", plant: plant, distance: distance };
    }
  }

  if (getPlant().isSeedPlanted) tryPlant(getPlant());
  getApple().extraPlants.forEach(tryPlant);

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

  const waterCapacity = getPlantWaterCapacity(getPlant());

  const isFirstWater = getPlant().needsFirstWater || getPlant().growthStartedAt === null;

  getPlant().lastWateredAt = now;
  getPlant().needsFirstWater = false;

  if (
    getPlant().growthStartedAt === null &&
    !getPlant().isSproutGrown &&
    !getPlant().blockSproutRegrowthAfterDry
  ) {
    getPlant().growthStartedAt = now;
  }

  getPlant().wateredAtList = getPlant().wateredAtList
    .filter(function (wateredAt) {
      return now - wateredAt <= overwaterWindowMs;
    })
    .concat(now);

  if (getPlant().isOverwatered || getPlant().status === "rotten") {
    saveSeedState();
    syncWorldState(true);
    updatePlantState();
    return;
  }

  if (isFirstWater || getPlant().waterLevel <= 0) {
    getPlant().waterLevel = 1;
    getPlant().isOverwatered = false;
    getPlant().status = "normal";
  } else if (getPlant().waterLevel >= waterCapacity) {
    if (shouldPauseWaterDecayForPlant(getPlant(), now)) {
      // Final idle stage(3/5): keep healthy even when players keep watering.
      getPlant().waterLevel = waterCapacity;
      getPlant().isOverwatered = false;
      getPlant().status = "normal";
    } else {
      // Already at the cap. Pouring more water rots the plant: the soil flips to
      // the rotten image and the sprout disappears, then the slot is cleared
      // a few seconds later so the player can plant something new.
      getPlant().isOverwatered = true;
      getPlant().status = "rotten";
      getPlant().rottenAt = now;
      getPlant().growthStartedAt = null;
      getPlant().isSproutGrown = false;
      getPlant().sproutGrownAt = null;
      getPlant().sproutEvolutionMs = 0;
      getPlant().sproutEvolutionLastTickAt = null;
      getPlant().isSproutSelfSustaining = false;
      getPlant().needsFirstWater = false;
    }
  } else {
    getPlant().waterLevel = Math.min(waterCapacity, getPlant().waterLevel + 1);
    getPlant().isOverwatered = false;
    getPlant().status = "normal";
  }

  getPlant().waterLevelUpdatedAt = now;
  getPlant().becameEmptyAt = null;
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




function removeMainPlant() {
  resetPlantRuntimeFields(getPlant(), getSharedPlantSimulationNow());
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




function updateSproutPosition() {
  if (!getPlant().isSproutGrown || getPlant().status === "rotten" || getPlant().status === "dry") {
    sprout.style.display = "none";
    sprout.removeAttribute("title");
    return;
  }

  const stage = getSproutStageFromPlant(getPlant());
  const sproutSize = getSproutSizeForStage(stage, getPlant());
  sprout.style.display = "block";
  sprout.classList.toggle("is-big", stage >= 2);
  sprout.src = getSproutImageForPlant(getPlant(), stage);
  setWorldSize(sprout, sproutSize.width, sproutSize.height);
  const sproutPos = getSproutWorldPositionForPlant(
    getPlant().spotX,
    getPlant().spotY,
    sproutSize,
    stage,
    getPlant()
  );
  setWorldPosition(sprout, sproutPos.x, sproutPos.y);
  applyPlantDepthZIndexToElements(
    getPlant(),
    plantSpot,
    sprout,
    mainPlantGrowthMeter && mainPlantGrowthMeter.element
  );
  updateNpcPosition();
}






function getGuideMaxPage() {
  return 0;
}


function loadWellState() {
  const loaded = loadWellStateFromStorage({
    wellWaterKey,
    lastWellRefillKey,
    maxWellWater,
    defaultWellWater: maxWellWater,
    defaultLastWellRefillAt: Date.now()
  });
  getWell().water = loaded.wellWater;
  getWell().lastRefillAt = loaded.lastWellRefillAt;

  refillWellIfNeeded();
}

function saveWellState() {
  getWell().lastStateChangeAt = Date.now();
  saveWellStateToStorage({
    wellWaterKey,
    lastWellRefillKey,
    wellWater: getWell().water,
    lastWellRefillAt: getWell().lastRefillAt
  });
  markWorldDirty();
}





function getSeedDryRemainingMs() {
  return Math.max(0, seedDryMs - (Date.now() - getPlant().seedCreatedAt));
}

function applyLoadedPlantState(loadedPlant) {
  getPlant().isSeedPlanted = loadedPlant.isSeedPlanted;
  getPlant().spotX = loadedPlant.plantSpotX;
  getPlant().spotY = loadedPlant.plantSpotY;
  getPlant().lastWateredAt = loadedPlant.plantLastWateredAt;
  getPlant().wateredAtList = loadedPlant.plantWateredAtList;
  getPlant().status = loadedPlant.plantState;
  getPlant().waterLevel = loadedPlant.plantWaterLevel;
  const wlu = loadedPlant.plantWaterLevelUpdatedAt;
  getPlant().waterLevelUpdatedAt =
    wlu != null && Number.isFinite(Number(wlu)) && Number(wlu) > 0 ? Number(wlu) : Date.now();
  getPlant().becameEmptyAt = loadedPlant.plantBecameEmptyAt;
  getPlant().isOverwatered = loadedPlant.isPlantOverwatered;
  getPlant().rottenAt = Object.prototype.hasOwnProperty.call(loadedPlant, "plantRottenAt")
    ? loadedPlant.plantRottenAt
    : null;
  getPlant().needsFirstWater = loadedPlant.plantNeedsFirstWater;
  getPlant().growthStartedAt = loadedPlant.plantGrowthStartedAt;
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "plantPlantedAt")) {
    getPlant().plantedAt =
      loadedPlant.plantPlantedAt != null ? Number(loadedPlant.plantPlantedAt) || null : null;
  } else {
    getPlant().plantedAt = null;
  }
  getPlant().isSproutGrown = loadedPlant.isSproutGrown;
  getPlant().sproutGrownAt =
    loadedPlant.plantSproutGrownAt ||
    (getPlant().isSproutGrown && getPlant().growthStartedAt
      ? getPlant().growthStartedAt
      : null);

  const hadEvolutionKey = Object.prototype.hasOwnProperty.call(loadedPlant, "sproutEvolutionMs");
  const hadSelfKey = Object.prototype.hasOwnProperty.call(loadedPlant, "isSproutSelfSustaining");
  getPlant().isSproutSelfSustaining = hadSelfKey ? Boolean(loadedPlant.isSproutSelfSustaining) : false;

  if (!hadEvolutionKey) {
    getPlant().sproutEvolutionMs = 0;
    if (
      getPlant().isSproutGrown &&
      getPlant().sproutGrownAt &&
      !getPlant().isSproutSelfSustaining
    ) {
      const elapsed = Date.now() - getPlant().sproutGrownAt;
      if (elapsed >= biggerSproutMs) {
        getPlant().isSproutSelfSustaining = true;
        getPlant().sproutEvolutionMs = sproutStage1Ms + sproutStage2GrowMs;
      } else if (elapsed > 0) {
        getPlant().sproutEvolutionMs = Math.floor(
          (elapsed / biggerSproutMs) * (sproutStage1Ms + sproutStage2GrowMs - 1)
        );
      }
    }
  } else {
    getPlant().sproutEvolutionMs = Math.max(0, Number(loadedPlant.sproutEvolutionMs) || 0);
  }

  getPlant().sproutEvolutionLastTickAt = Date.now();
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "growthTier")) {
    getPlant().growthTier = Math.max(0, Number(loadedPlant.growthTier) || 0);
  }
  getPlant().waterCapacity = Math.max(2, Number(loadedPlant.waterCapacity) || 2);
  getPlant().powderUpgradeTargetTier = Math.max(
    0,
    Number(loadedPlant.powderUpgradeTargetTier) || 0
  );
  getPlant().powderUpgradeStartedAt = Number(loadedPlant.powderUpgradeStartedAt) || null;
  getPlant().powderUpgradeDurationMs = Math.max(
    0,
    Number(loadedPlant.powderUpgradeDurationMs) || 0
  );
  if (
    Object.prototype.hasOwnProperty.call(loadedPlant, "grassAuto5EligibleAt") &&
    loadedPlant.grassAuto5EligibleAt != null &&
    Number.isFinite(Number(loadedPlant.grassAuto5EligibleAt))
  ) {
    getPlant().grassAuto5EligibleAt = Number(loadedPlant.grassAuto5EligibleAt);
  } else {
    getPlant().grassAuto5EligibleAt = null;
  }
  migrateLegacyPowderTier5ToAutoGrass(getPlant(), Date.now());

  getPlant().ownerUserId =
    loadedPlant.ownerUserId != null ? String(loadedPlant.ownerUserId) : "";
  getPlant().ownerDisplayName =
    loadedPlant.ownerDisplayName != null ? String(loadedPlant.ownerDisplayName) : "";
  getPlant().sproutOrdinal = Math.max(0, Number(loadedPlant.sproutOrdinal) || 0);
  getPlant().grassOrdinal =
    loadedPlant.grassOrdinal != null && Number.isFinite(Number(loadedPlant.grassOrdinal))
      ? Math.max(1, Number(loadedPlant.grassOrdinal))
      : null;
  getPlant().matureKind = Object.prototype.hasOwnProperty.call(loadedPlant, "matureKind")
    ? String(loadedPlant.matureKind || "")
    : "";
  getPlant().flowerOrdinal =
    loadedPlant.flowerOrdinal != null && Number.isFinite(Number(loadedPlant.flowerOrdinal))
      ? Math.max(1, Number(loadedPlant.flowerOrdinal))
      : null;
  getPlant().treeOrdinal =
    loadedPlant.treeOrdinal != null && Number.isFinite(Number(loadedPlant.treeOrdinal))
      ? Math.max(1, Number(loadedPlant.treeOrdinal))
      : null;
  getPlant().cactusOrdinal =
    loadedPlant.cactusOrdinal != null && Number.isFinite(Number(loadedPlant.cactusOrdinal))
      ? Math.max(1, Number(loadedPlant.cactusOrdinal))
      : null;

  if (Object.prototype.hasOwnProperty.call(loadedPlant, "blockSproutRegrowthAfterDry")) {
    getPlant().blockSproutRegrowthAfterDry = Boolean(loadedPlant.blockSproutRegrowthAfterDry);
  } else {
    getPlant().blockSproutRegrowthAfterDry = getPlant().status === "dry";
  }
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "drySoilAt")) {
    const da = Number(loadedPlant.drySoilAt);
    getPlant().drySoilAt =
      Number.isFinite(da) && da > 0 ? da : null;
  } else {
    getPlant().drySoilAt = null;
  }

  if (getPlant().status === "rotten" || getPlant().isOverwatered) {
    getPlant().status = "rotten";
    if (!getPlant().rottenAt) getPlant().rottenAt = Date.now();
    getPlant().growthStartedAt = null;
    getPlant().isSproutGrown = false;
    getPlant().sproutGrownAt = null;
    getPlant().sproutEvolutionMs = 0;
    getPlant().sproutEvolutionLastTickAt = null;
    getPlant().isSproutSelfSustaining = false;
    getPlant().needsFirstWater = false;
    getPlant().grassAuto5EligibleAt = null;
    getPlant().blockSproutRegrowthAfterDry = false;
    getPlant().drySoilAt = null;
  }
  if (getPlant().status === "dry") {
    normalizePlantSproutFieldsWhenSoilDry(getPlant());
    getPlant().blockSproutRegrowthAfterDry = true;
    if (getPlant().drySoilAt == null) {
      getPlant().drySoilAt = Date.now();
    }
  }
  if (getPlant().plantedAt == null && getPlant().isSeedPlanted) {
    getPlant().plantedAt = Number(loadedPlant.plantGrowthStartedAt) || null;
  }
  if (!getPlant().isSeedPlanted) {
    getPlant().plantedAt = null;
  }
  if (Object.prototype.hasOwnProperty.call(loadedPlant, "plantSeedKind")) {
    getPlant().seedKind = String(loadedPlant.plantSeedKind || "");
  } else if (Object.prototype.hasOwnProperty.call(loadedPlant, "seedKind")) {
    getPlant().seedKind = String(loadedPlant.seedKind || "");
  }
  const plantLoadNow = Date.now();
  if (shouldFinalizeOvergrowthGroundToStage3(getPlant(), plantLoadNow)) {
    makePlantStableStage3FromOvergrowthSeed(getPlant(), plantLoadNow);
  }
  if (getPlant().isSproutSelfSustaining && getPlant().growthTier < 3) {
    getPlant().growthTier = 3;
  }
  reconcileMaturePlantGrowthTierFromOrdinal(getPlant());
  syncPlantWaterCapacityField(getPlant());
  clampPlantGrowthTimingToCurrentConstants(getPlant());
  ensureGrassOrdinalIfNeeded(getPlant());
  ensureGrassAuto5EligibleForTier4Plant(getPlant(), Date.now());
  if (isApplyingWorldState && getPlant().isSeedPlanted) {
    stabilizeFirstWaterHintFlags(getPlant());
  }
}


function loadSeedState() {
  const loaded = loadSeedStateFromStorage({
    seedCreatedAtKey,
    seedPlantedStateKey,
    defaultSeedCreatedAt: Date.now(),
    defaultNpcX: NPC_START_X,
    defaultNpcY: NPC_START_Y
  });
  getPlant().seedCreatedAt = loaded.seedCreatedAt;
  applyLoadedPlantState(loaded.planted);
  getNpc().x = loaded.planted.npcX;
  getNpc().y = loaded.planted.npcY;
  const legacyDefaultNpcX = SEED_START_X + 18;
  let npcLayoutNeedsPersist = false;
  if (getNpc().x === legacyDefaultNpcX) {
    getNpc().x = NPC_START_X;
    npcLayoutNeedsPersist = true;
  }
  // Tutorial never applies the shared snapshot; NPC stays on old saved coords unless we realign.
  if (!getStoredFlag(onboardingFlowDoneKey)) {
    getWorldItems().signX = SIGN_START_X;
    getWorldItems().signY = SIGN_START_Y;
    getWorldItems().guideBookX = GUIDE_BOOK_START_X;
    getWorldItems().guideBookY = GUIDE_BOOK_START_Y;
    getWorldItems().worldBagX = WORLD_BAG_START_X;
    getWorldItems().worldBagY = WORLD_BAG_START_Y;
    setWorldPosition(signBoard, getWorldItems().signX, getWorldItems().signY);
    setWorldPosition(guideBook, getWorldItems().guideBookX, getWorldItems().guideBookY);
    if (worldBag) setWorldPosition(worldBag, getWorldItems().worldBagX, getWorldItems().worldBagY);
    if (getNpc().x !== NPC_START_X || getNpc().y !== NPC_START_Y) {
      getNpc().x = NPC_START_X;
      getNpc().y = NPC_START_Y;
      npcLayoutNeedsPersist = true;
    }
  }
  if (npcLayoutNeedsPersist) {
    markWorldDirty();
    saveSeedState();
  }

  if (getPlant().isSeedPlanted) {
    getInventory().heldItem = null;
    plantSpot.style.display = "block";
    setWorldPosition(plantSpot, getPlant().spotX, getPlant().spotY);
    seedCard.style.display = "none";
    updatePlantState();
  }

  updateSeedDryState();
}

/**
 * @param {{ bumpMergeGuard?: boolean, skipWorldDirty?: boolean }} [opts] - bumpMergeGuard:false
 *   for sim-only deltas. skipWorldDirty:true stops enqueueing a shared save (e.g. water decay online).
 */




function getMaxZoom() {
  return Math.max(maxZoom, getFitZoom() + 1);
}

function clampZoom(value) {
  return Math.max(getFitZoom(), Math.min(getMaxZoom(), value));
}

function initializeZoom() {
  if (getCamera().hasInitializedZoom) return;
  getCamera().zoom = clampZoom(defaultZoom);
  getCamera().hasInitializedZoom = true;
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
  if (player) {
    player.style.setProperty("--player-color", normalizedColor);
  }
  if (playerColorBody) {
    playerColorBody.style.display = "none";
  }
  if (_viewApi) {
    syncCharacterPreviewVisual(normalizedColor);
    syncLocalPlayerPoseVisual();
  }
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
  syncCharacterPreviewVisual(selectedPlayerColor);
  characterSelectOverlay.classList.add("is-open");
}

function openCharacterColorChange() {
  getOnboarding().step26OpenedSettingsWithEsc = false;
  setSettingsOverlayOpen(settingsOverlay, false);
  isCharacterSelecting = true;
  buildCharacterColorGrid();
  document.documentElement.style.setProperty("--preview-player-color", selectedPlayerColor);
  syncCharacterPreviewVisual(selectedPlayerColor);
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
  hasChosenPlayerColor = readHasChosenPlayerColorFromStorage();
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
    setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
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



function isWorldSocialRealtimeReady() {
  return Boolean(multiplayerChannel && currentSessionId && isMultiplayerSubscribed);
}



function toggleWorldChatPanel() {
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_CHAT) {
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
        x: getPlayer().x,
        depth: getPlayer().depth,
        jumpY: getPlayer().jumpY,
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
        x: getPlayer().x,
        depth: getPlayer().depth,
        jumpY: getPlayer().jumpY,
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
  if (isOnboardingSocialTutorialStep() && getOnboarding().flowStep === ONBOARDING_STEP_CHAT) {
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
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_HEART) {
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
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep !== ONBOARDING_STEP_SAD) {
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







function removeRemotePlayer(remoteId) {
  const remotePlayer = remotePlayers[remoteId];
  if (!remotePlayer) return;
  remotePlayer.element.remove();
  delete remotePlayers[remoteId];
  remotePlayerStateStore.remove(remoteId);
  removeRemoteChatBubbleEl(remoteId);
  updateRemotePlayerCount();
}

/** DOM/view sync from remotePlayerStateStore (network + state already applied). */
function syncRemotePlayerViewFromState(remoteId) {
  const state = remotePlayerStateStore.getPlayer(remoteId);
  if (!state) return;

  const remotePlayer = remotePlayers[remoteId] || createRemotePlayer(remoteId);
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
  const statusAction = state.action || "";

  remotePlayer.nameElement.textContent = nameForIngameUiDisplay(state.name || "OVC");
  remotePlayer.lastActionAt = Number(state.lastActionAt) || 0;
  remotePlayer.lastShownAction = String(state.lastShownAction) || "";
  if (statusAction) {
    const nextStatusText = getRemoteStatusText(statusAction);
    if (nextStatusText) {
      remotePlayer.statusElement.textContent = nextStatusText;
      remotePlayer.statusElement.style.display = "block";
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
  remotePlayer.lastStateVersion = Number(state.lastStateVersion) || 0;
  remotePlayer.lastStateSourceRank = Number(state.lastStateSourceRank) || 0;
  addSyncDebugLog("remote_state_apply", {
    remoteId: remoteId,
    version: remotePlayer.lastStateVersion
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
  remotePlayer.lastSeenAt = Number(state.lastSeenAt) || Date.now();
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

  const showHud =
    !isSharedWorldSyncPausedForTutorial() &&
    multiplayerStatusText === "\uC5F0\uACB0\uB428";
  multiplayerStatus.classList.toggle("is-online-hud-visible", showHud);
  multiplayerStatus.hidden = !showHud;
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
// sessionId among this client + `remotePlayerStateStore.sessionIdsLastSeen`; same-login
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


function saveButterflyCaughtCounts() {
  setStoredValue(
    butterflyCaughtCountsKey,
    JSON.stringify(butterflyState.caughtCounts)
  );
}

function saveMagicPowderCount() {
  setStoredValue(magicPowderCountKey, String(Math.max(0, Math.floor(magicPowderCount))));
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




/** ????????????? id?? ???????????? ?? */
function dedupeButterfliesByIdStable(list) {
  return butterflyMotion.dedupe(list);
}

/** ???? ?????(butterflyMaxAlive) ??? ??????????????????? */
function trimButterflyListToMaxCap(list) {
  return butterflyMotion.trim(list);
}



function clearMultiplayerRoomSessionTracking() {
  remotePlayerStateStore.clearSessionTracking();
  multiplayerRoomSessionButterflyStateLastSeen = Object.create(null);
  lastRemoteWaterSplashAppliedAtBySession = Object.create(null);
  playerPositionNetwork.resetSendThrottle();
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



/** ????? ????? ???? ????. ????? ???????? ???????? ???(???? presence?????? ????? ????. */


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










/** ????????(cx, cy) ?? ????????? */

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
  const ws = getApple().worldLooseSeed;
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
  const cur = Math.max(0, Number(getApple().worldLooseSeed.nextSpawnAt) || 0);
  if (nextAt <= cur) {
    addSyncDebugLog("world_loose_seed_reject", {
      reason: "older_next_spawn",
      nextAt: nextAt,
      currentNextAt: cur
    }, true);
    return;
  }
  if (evtAt > 0) lastWorldLooseSeedPickupAt = Math.max(lastWorldLooseSeedPickupAt, evtAt);
  getApple().worldLooseSeed.nextSpawnAt = nextAt;
  worldLoosePickupLockUntil = Math.max(Number(worldLoosePickupLockUntil || 0), nextAt);
  syncWorldLoosePickupLock(now);
  const px = Number(payload.x);
  const py = Number(payload.y);
  if (Number.isFinite(px)) getApple().worldLooseSeed.x = px;
  if (Number.isFinite(py)) getApple().worldLooseSeed.y = py;
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
  if (getApple().worldRockPickedIds.includes(rockId)) {
    return;
  }
  const exists = getApple().worldRocks.some(function (r) {
    return r && String(r.id) === rockId;
  });
  if (!exists) {
    return;
  }
  getApple().worldRockPickedIds.push(rockId);
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
  if (isOnboardingLinearGateActive() && getOnboarding().flowStep < ONBOARDING_STEP_BUTTERFLY) {
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
  if (!getStoredFlag(onboardingFlowDoneKey) && getOnboarding().flowStep === ONBOARDING_STEP_BUTTERFLY) {
    setStoredFlag(tradeMasterDialogueCompleteKey, false);
    hydrateTradeMasterDialogueComplete(false);
    getOnboarding().flowStep = ONBOARDING_STEP_TRADE_MASTER;
    persistOnboardingStep();
    updateOnboardingFlowUI();
  }
  return true;
}





function handleRemoteButterflyStateBroadcast(payload) {
  if (!payload || payload.id === currentSessionId) return;
  if (isSharedWorldSyncPausedForTutorial()) return;
  const sender = String(payload.id || "").trim();
  if (sender) {
    remotePlayerStateStore.sessionIdsLastSeen[sender] = Date.now();
    remotePlayerStateStore.sessionButterflyActive[sender] = true;
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

const gameLoopHost = {
  get gameLoopCyclesForTutorialSync() {
    return gameLoopCyclesForTutorialSync;
  },
  set gameLoopCyclesForTutorialSync(value) {
    gameLoopCyclesForTutorialSync = value;
  },
  syncLocalPlayerVisibility,
  requestAccountTutorialDoneSync,
  respawnApplesIfNeeded,
  tickWorldRockRespawn,
  tickWorldBagDropDespawn,
  refillWellIfNeeded,
  movementTutorial,
  tickPlayerPosition,
  onboardingCheckJumpFinish,
  updateSeedPosition,
  updateExtraSeedsAndPlants,
  updateBucketPosition,
  tickPlayerHealth,
  refreshPlantIdentityOrdinals,
  updatePlantState,
  updateNpcPosition,
  updateAlchemyCraftEffects,
  tickOnboardingWaterDoneCongrats,
  pruneStaleRemotePlayers,
  updateButterflies,
  updateRemotePlayerSmoothing,
  sendMultiplayerPresence,
  savePlayerPosition,
  renderPlayerPosition,
  updateSeedInventory,
  updatePlayerStatus,
  updatePlayerHealthUi,
  updateSeedCard,
  updateGuideCard,
  updatePlantProgressGauge,
  updateOnboardingFlowUI,
  updatePlayerAlert,
  updateMagicPowderInventoryUi,
  updateCamera,
  updatePlayerName,
  updateWorldSocialOverlaysInGameLoop
};

const gameLoop = createGameLoop(gameLoopHost, function () {
  return isTabSessionSuperseded;
});

function savePlayerPosition(forceSave) {
  const now = Date.now();
  if (!forceSave && now - getPlayer().lastPositionSavedAt < 400) return;

  setStoredValue(
    playerPositionKey,
    JSON.stringify({
      x: getPlayer().x,
      depth: getPlayer().depth,
      savedAt: now
    })
  );
  getPlayer().lastPositionSavedAt = now;
}

function loadPlayerPosition() {
  getPlayer().x = spawnPlayerX;
  getPlayer().depth = spawnPlayerDepth;
  getPlayer().jumpY = 0;
  getPlayer().velocityY = 0;
  getPlayer().isOnGround = true;
  setWorldPosition(localPlayerRoot, getPlayer().x, getPlayerWorldY());
  updatePlayerColorBodyPosition();
  updateCamera();
  savePlayerPosition(true);
}

function setup() {
  const seedSize = getSeedSize();
  const bucketSize = getBucketSize();
  const wellSize = getWellSize();

  setWorldSize(localPlayerRoot, getLocalPlayerBodyWidth(), getPlayer().sittingChairId ? getLocalPlayerBodyHeight() : undefined);
  setWorldSize(playerColorBody, getLocalPlayerBodyWidth(), getLocalPlayerBodyHeight());
  if (getPlayer().sittingChairId || (player && player.classList.contains("is-sitting"))) {
    syncLocalPlayerPoseVisual();
  }
  Object.keys(remotePlayers).forEach(function (remoteId) {
    setWorldSize(remotePlayers[remoteId].element, PLAYER_WIDTH);
  });
  setWorldSize(spawnPortal, spawnPortalWidth, spawnPortalHeight);
  setWorldSize(seed, SEED_SIZE);
  getApple().extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.element) setWorldSize(extraSeed.element, SEED_SIZE);
  });
  getApple().extraPlants.forEach(function (plant) {
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
    getWorldItems().seedX = SEED_START_X;
    getWorldItems().seedY = SEED_START_Y;
    getWorldItems().wellX = WELL_START_X;
    getWorldItems().wellY = WELL_START_Y;
    getWorldItems().bucketX = getWorldItems().wellX - bucketSize.width - 8;
    getWorldItems().bucketY = getWorldItems().wellY + wellSize.height - bucketSize.height;
    isSetupComplete = true;
  }

  initializeZoom();
  setWorldPosition(bigTree, BIG_TREE_X, BIG_TREE_Y);
  setWorldPosition(spawnPortal, spawnPortalX, spawnPortalY);
  setWorldPosition(well, getWorldItems().wellX, getWorldItems().wellY);
  setWorldPosition(signBoard, getWorldItems().signX, getWorldItems().signY);
  setWorldPosition(guideBook, getWorldItems().guideBookX, getWorldItems().guideBookY);
  if (worldBag) setWorldPosition(worldBag, getWorldItems().worldBagX, getWorldItems().worldBagY);
  syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  setWorldPosition(plantSpot, getPlant().spotX, getPlant().spotY);
  if (worldPlantFog) {
    syncWorldPlantFogVisuals();
  }
  updateWellImage();
  updateSeedPosition();
  updateBucketPosition();
  updatePlantState();
  updateWorldRocks();
  updateCamera();
}

ovcInitScriptLayers();

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
  prepareTutorialWorldLoadBeforeSetup();
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
  finishDevResetBoot(
    resetGameForTesting,
    resetTutorialForTesting,
    isWorldDocumentEntry,
    isTutorialDocumentEntry
  );
  window.__OVC_BOOT_FINISHED__ = true;
  if (isSharedWorldSyncPausedForTutorial() || !isWorldServerSyncAvailable()) {
    ovcTryDismissLoadingScreen(true);
  } else {
    ovcTryDismissLoadingScreen(false);
  }
} catch (initError) {
  console.error("[OVC] \uAC8C\uC784 \uCD08\uAE30\uD654 \uC624\uB958:", initError);
  ovcBootstrapFinished = true;
  finishDevResetBoot(
    resetGameForTesting,
    resetTutorialForTesting,
    isWorldDocumentEntry,
    isTutorialDocumentEntry
  );
  window.__OVC_BOOT_FINISHED__ = true;
  ovcTryDismissLoadingScreen(true);
}
})();
attachCoreRuntimeTimers({
  gameLoop: gameLoop,
  isTabSessionSuperseded: function () {
    return isTabSessionSuperseded;
  },
  pollWorldState: pollWorldState,
  syncWorldState: syncWorldState,
  sendMultiplayerPresence: sendMultiplayerPresence,
  validateCurrentAccount: validateCurrentAccount,
  updateCamera: updateCamera,
  ovcTryDismissLoadingScreen: ovcTryDismissLoadingScreen,
  getMultiplayerWorldSyncLoopMs: getMultiplayerWorldSyncLoopMs,
  hasHydratedSharedWorldFromServer: function () {
    return hasHydratedSharedWorldFromServer;
  },
  isWorldServerSyncAvailable: isWorldServerSyncAvailable,
  onWindowResize: function () {
    setup();
    getCamera().zoom = clampZoom(getCamera().zoom);
    updateCamera();
  }
});
