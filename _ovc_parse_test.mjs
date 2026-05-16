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
  PLANT_HOVER_RING_WORLD_SIZE,
  pickupDistance,
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
  wellWaterKey,
  lastWellRefillKey,
  seedCreatedAtKey,
  seedPlantedStateKey,
  hasGuideBookKey,
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
  isMagicPowderBagType,
  isFlowerMaturePlant,
  isTreeMaturePlant,
  isCactusMaturePlant,
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
  getPlantWorldAnchorXY,
  getPlantDepthSortY as getPlantDepthSortYCore,
  mapPlantDepthSortYToZIndex,
  worldRectsOverlap
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
  getBagItemDescriptor as getBagItemDescriptorCore,
  canBagInventoryFitItems
} from "./src/game/bag-inventory.js?v=20260517a";
import {
  bindTradeMaster,
  closeTradeExchangePanel,
  handleBagSlotClickWhileTradeOpen,
  hydrateTradeMasterDialogueComplete,
  isNearTradeMaster,
  isTradeExchangeOpen,
  isTradeMasterDialogueRunning,
  pickWorldNpcHover,
  clearWorldNpcHoverSticky,
  tryTalkToTradeMaster,
  updateTradeNpcPrompt
} from "./src/game/trade-master-ui.js";
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
  updateAlchemyNpcPrompt
} from "./src/game/alchemy-master-ui.js";
import {
  isCraftFurnitureKind,
  getCraftFurnitureWorldSpec,
  computeCraftFurniturePlacement,
  serializePlacedCraftFurnitureForSnapshot,
  parsePlacedCraftFurnitureFromSnapshot
} from "./src/game/craft-furniture-world.js";

let playerX = 100;
let playerDepth = 0;
