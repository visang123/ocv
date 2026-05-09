export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 540;
export const GROUND_WORLD_HEIGHT = WORLD_HEIGHT * 0.6;

export const PLAYER_WIDTH = 25;
export const PLAYER_HEIGHT = 50;
export const SEED_SIZE = 10;
export const BUCKET_SIZE = 16;
export const WELL_SIZE = 38;
export const PLANT_SPOT_WIDTH = 14;
export const PLANT_SPOT_HEIGHT = 7;
export const WATER_NEEDED_SIZE = 8;
export const SPROUT_WIDTH = 5;
export const SPROUT_HEIGHT = 6;
export const BIG_TREE_WIDTH = 142;
export const BIG_TREE_HEIGHT = 190;
export const NPC_WIDTH = 13;
export const NPC_HEIGHT = 26;

export const BIG_TREE_X = WORLD_WIDTH - BIG_TREE_WIDTH - 8;
export const BIG_TREE_Y = -BIG_TREE_HEIGHT + 10;
export const TREE_TRUNK_X = BIG_TREE_X + 58;
export const TREE_TRUNK_WIDTH = 30;
export const TREE_TRUNK_TOP = BIG_TREE_Y + 72;
export const TREE_CLIMB_DISTANCE = 7;
export const TREE_CANOPY_LEFT = BIG_TREE_X + 6;
export const TREE_CANOPY_RIGHT = BIG_TREE_X + BIG_TREE_WIDTH - 6;
export const TREE_CANOPY_TOP = BIG_TREE_Y + 8;
export const TREE_CANOPY_BOTTOM = BIG_TREE_Y + 108;

export const WELL_START_X = 320;
export const WELL_START_Y = 190;
export const SIGN_START_X = 165;
export const SIGN_START_Y = 274;
export const SIGN_WIDTH = 38;
export const SIGN_HEIGHT = 36;
export const SEED_START_X = SIGN_START_X + SIGN_WIDTH + 27;
export const SEED_START_Y = SIGN_START_Y + SIGN_HEIGHT - SEED_SIZE;
export const GUIDE_BOOK_START_X = 210;
export const GUIDE_BOOK_START_Y = 300;
export const GUIDE_BOOK_WIDTH = 10;
export const GUIDE_BOOK_HEIGHT = 9;
export const NPC_START_X = SEED_START_X + 18;
export const NPC_START_Y = SEED_START_Y + SEED_SIZE - NPC_HEIGHT;

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;

/** Stage 1 sprout art duration after first sprout appears (ms). */
export const sproutStage1Ms = 30 * SECOND_MS;
/** Active survival time in stage 2 before auto-advancing to stage 3 (ms). */
export const sproutStage2GrowMs = 1 * MINUTE_MS;
export const sproutStage1Image = "이미지/sprout-stage1.svg";
export const sproutStage2Image = "이미지/sprout-stage2.svg";
export const sproutStage3Image = "이미지/sprout-stage3.svg";
/** Draw sizes per stage (world pixels). */
export const SPROUT_STAGE_WIDTHS = [5, 7, 11];
export const SPROUT_STAGE_HEIGHTS = [6, 11, 19];

export const appleEatMs = 3 * SECOND_MS;
/** Planting (any seed) locks movement and shows status for this long (ms). */
export const plantActionMs = 3 * SECOND_MS;
export const appleRespawnMs = 90 * SECOND_MS;
export const minPlantSpacing = 5;

// --- Butterflies ---
/** World size (w = h). Half of original 20px tuning; matches setWorldSize + .butterfly CSS. */
export const BUTTERFLY_SIZE = 10;
/** Maximum butterflies that can be alive on the shared map. */
export const butterflyMaxAlive = 5;
/** Available colors. Index doubles as the sprite-sheet row. */
export const butterflyColors = ["brown", "yellow", "white"];
/** Wing-flap frames per color in the sprite sheet. */
export const butterflyFrameCount = 5;
/** Milliseconds between wing frames. */
export const butterflyFrameMs = 140;
/** Butterfly speed in world pixels per game frame (player speed is 1). */
export const butterflySpeed = 1.2;
/** How long it takes a butterfly to drift to a fresh waypoint, in ms. */
export const butterflyLegMinMs = 2400;
export const butterflyLegMaxMs = 5200;
/** Visible bob on top of waypoint path (short periods so motion never looks frozen). */
export const butterflyFlutterPeriodHorizontalMs = 2800;
export const butterflyFlutterPeriodVerticalMs = 3400;
export const butterflyFlutterAmplitudeX = 2;
export const butterflyFlutterAmplitudeY = 2.2;
/** Time between auto-spawns when below the map cap, in ms. */
export const butterflyRespawnMs = 2 * MINUTE_MS;
/** How close (px, center distance) the player must be to catch a butterfly. */
export const butterflyCatchDistance = 25;
/** Authority (lowest sessionId) broadcasts butterfly positions on this cadence. */
export const butterflyBroadcastMs = 250;
/** Bounding box (world coords) the butterflies stay within while flying. */
export const butterflyBoundsLeft = 24;
export const butterflyBoundsRight = 936;
export const butterflyBoundsTop = 24;
export const butterflyBoundsBottom = 300;
/** Legacy: used only to migrate old saves into stage-3 self-sustaining sprouts. */
export const biggerSproutMs = 30 * SECOND_MS;
export const pickupDistance = 28;
export const guideInteractDistance = 60;
export const npcInteractDistance = 60;
export const wellUseDistance = 35;
export const wellPourDistance = wellUseDistance;
export const plantWaterDistance = 40;
export const maxWellWater = 3;
export const wellRefillMs = 15 * SECOND_MS;
export const seedDryMs = 3 * MINUTE_MS;
export const plantDryMs = 40 * SECOND_MS;
export const plantWaterLevelTickMs = 20 * SECOND_MS;
export const plantGrowthMs = 3 * SECOND_MS;
export const overwaterWindowMs = 60 * MINUTE_MS;
/**
 * How long the rotten soil image stays visible before the planted slot is
 * fully cleared so the player can plant a new seed there.
 */
export const plantRotClearMs = 3 * SECOND_MS;
export const magicPowderCraftCost = 10;
export const magicPowderCraftMs = 3 * SECOND_MS;
export const level4GrowMs = 2 * MINUTE_MS;
export const level5GrowMs = 3 * MINUTE_MS;

export const wellWaterKey = "wellWaterV3";
export const lastWellRefillKey = "lastWellRefillAtV3";
export const seedCreatedAtKey = "seedCreatedAtV1";
export const seedPlantedStateKey = "seedPlantedStateV1";
export const hasGuideBookKey = "hasGuideBookV1";
export const npcDialogueCompleteKey = "npcDialogueCompleteV1";
export const guidePlantPageUnlockedKey = "guidePlantPageUnlockedV1";
export const appleStateKey = "appleStateV1";
export const playerPositionKey = "playerPositionV1";
export const bucketStateKey = "bucketStateV1";
export const mainDrySeedHandledKey = "mainDrySeedHandledV1";
export const mainSeedCollectedKey = "mainSeedCollectedV1";
export const movementTutorialCompleteKey = "movementTutorialCompleteV1";
export const onboardingFlowStepKey = "onboardingFlowStepV2";
export const onboardingFlowDoneKey = "onboardingFlowDoneV2";

export const appStorageKeys = [
  "wellWaterV1",
  "lastWellRefillAtV1",
  "wellWaterV2",
  "lastWellRefillAtV2",
  wellWaterKey,
  lastWellRefillKey,
  seedCreatedAtKey,
  seedPlantedStateKey,
  hasGuideBookKey,
  npcDialogueCompleteKey,
  guidePlantPageUnlockedKey,
  appleStateKey,
  playerPositionKey,
  bucketStateKey,
  mainDrySeedHandledKey,
  mainSeedCollectedKey,
  movementTutorialCompleteKey,
  onboardingFlowStepKey,
  onboardingFlowDoneKey,
  "butterflyCaughtCountsV1",
  "magicPowderCountV1"
];
