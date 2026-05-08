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
export const SPROUT_WIDTH = 14;
export const SPROUT_HEIGHT = 18;
export const BIG_TREE_WIDTH = 142;
export const BIG_TREE_HEIGHT = 190;
export const NPC_WIDTH = 25;
export const NPC_HEIGHT = 50;

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

export const appleEatMs = 3 * SECOND_MS;
export const appleRespawnMs = 90 * SECOND_MS;
export const minPlantSpacing = 5;
export const biggerSproutMs = 30 * SECOND_MS;
export const pickupDistance = 28;
export const guideInteractDistance = 60;
export const npcInteractDistance = 60;
export const wellUseDistance = 35;
export const wellPourDistance = wellUseDistance;
export const plantWaterDistance = 25;
export const maxWellWater = 2;
export const wellRefillMs = 15 * SECOND_MS;
export const seedDryMs = 3 * MINUTE_MS;
export const plantDryMs = 2 * MINUTE_MS;
export const plantWaterLevelTickMs = 1 * MINUTE_MS;
export const plantGrowthMs = 3 * SECOND_MS;
export const overwaterWindowMs = 60 * MINUTE_MS;

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
  mainSeedCollectedKey
];
