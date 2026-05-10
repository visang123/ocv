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

/** Right-anchored tree, shifted left (several × tree width) from the original corner. */
export const BIG_TREE_X =
  WORLD_WIDTH - BIG_TREE_WIDTH - 8 - Math.round(BIG_TREE_WIDTH * 3.35);
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
/** 안내판 — 책·씨앗·NPC와 간격을 두기 위해 약간 왼쪽·위로 */
export const SIGN_START_X = 138;
export const SIGN_START_Y = 268;
export const SIGN_WIDTH = 38;
export const SIGN_HEIGHT = 36;
export const GUIDE_BOOK_WIDTH = 10;
export const GUIDE_BOOK_HEIGHT = 9;
/** 책 — 지면·오브젝트에 안 묻도록 위·오른쪽(책 너비 11칸 + 기준 40) */
export const GUIDE_BOOK_START_X = 40 + 11 * GUIDE_BOOK_WIDTH;
export const GUIDE_BOOK_START_Y = 284;
/** 책 오른쪽–씨앗 왼쪽 최소 간격(책 너비 약 5칸) */
export const GUIDE_BOOK_SEED_MIN_GAP = GUIDE_BOOK_WIDTH * 5;
/** 씨앗 — 안내판 오른쪽과, 책+5칸 간격 중 더 오른쪽(겹침 방지) */
export const SEED_START_X = Math.max(
  SIGN_START_X + SIGN_WIDTH + 48,
  GUIDE_BOOK_START_X + GUIDE_BOOK_WIDTH + GUIDE_BOOK_SEED_MIN_GAP
);
export const SEED_START_Y = SIGN_START_Y + SIGN_HEIGHT - SEED_SIZE;
/** 식물의 달인 — 씨앗·플레이어 폭 기준; 나무·줄기와 동선 분리를 위해 추가로 왼쪽 */
export const NPC_START_X =
  SEED_START_X +
  36 +
  8 * PLAYER_WIDTH -
  Math.round(NPC_WIDTH * 2.5) -
  Math.round(NPC_WIDTH * 4.5);
export const NPC_START_Y = SEED_START_Y + SEED_SIZE - NPC_HEIGHT;

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;

/** 테스트: 식물 성장·새싹 1·2단계·가루 4/5단계 등 성장 구간 전부 이 시간으로 통일 */
export const plantGrowthTestEveryMs = 3 * SECOND_MS;

/** Stage 1 sprout art duration after first sprout appears (ms). */
export const sproutStage1Ms = plantGrowthTestEveryMs;
/** Active survival time in stage 2 before auto-advancing to stage 3 (ms). */
export const sproutStage2GrowMs = plantGrowthTestEveryMs;
export const sproutStage1Image = "이미지/sprout-stage1.png?v=20260518h";
export const sproutStage2Image = "이미지/sprout-stage2.png?v=20260518h";
export const sproutStage3Image = "이미지/sprout-stage3.png?v=20260518h";
/** 4·5단계 풀 — 시트 좌/우 분할 PNG (?v 캐시 무력화) */
export const sproutStage4Image = "이미지/grass-stage4-front.png?v=20260510e";
export const sproutStage5Image = "이미지/grass-stage5-front.png?v=20260510e";
/** Draw sizes per stage (world pixels). */
/** 1·2·3단계 새싹 PNG(고해상도)에 맞춘 월드 기본 크기 */
export const SPROUT_STAGE_WIDTHS = [7, 10, 15];
export const SPROUT_STAGE_HEIGHTS = [8, 15, 26];
/** 4·5단계 풀 — 3단계 베이스(인덱스 2)에 곱해 월드에서 더 크게 그림 */
export const grassStage4WorldScale = 2.95;
export const grassStage5WorldScale = 3.55;
/** 5단계 풀 PNG가 좌측으로 치우쳐 보일 때 월드 x 보정(양수=오른쪽) */
export const grassStage5AnchorDxWorld = 7;

export const appleEatMs = 3 * SECOND_MS;
/** Planting (any seed) locks movement and shows status for this long (ms). */
export const plantActionMs = 3 * SECOND_MS;
export const appleRespawnMs = 90 * SECOND_MS;
/** 다른 식물 중심과 이 거리(px) 미만이면 심기 불가. 작을수록 붙여 심기 가능 */
export const minPlantSpacing = 0.5;

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
export const biggerSproutMs = plantGrowthTestEveryMs;
export const pickupDistance = 28;
export const guideInteractDistance = 60;
export const npcInteractDistance = 60;
export const wellUseDistance = 35;
export const wellPourDistance = wellUseDistance;
export const plantWaterDistance = 40;
export const maxWellWater = 3;
export const wellRefillMs = 15 * SECOND_MS;
export const seedDryMs = 3 * MINUTE_MS;
/** 월드 첫 식물(메인)만 물 0칸 후 이 시간이 지나면 흙이 마름. 나머지 식물은 plantDryMs 사용. */
export const mainPlantDryAfterEmptyMs = 5 * MINUTE_MS;
/** 마법 가루 적용 중(또는 4단계 이상) 메인 작물이 물이 바짝 마른 뒤 흙이 마르기까지 */
export const mainPlantDryAfterPowderMs = 5 * MINUTE_MS;
export const mainPlantDryAfterEmptyTier4Ms = 6 * MINUTE_MS;
export const mainPlantDryAfterEmptyTier5Ms = 8 * MINUTE_MS;
export const plantDryMs = 40 * SECOND_MS;
/** 가루 진행 중·고단계 추가 식물의 마름 타이밍(1·2단계와 동일 로직, 수치만 조정) */
export const plantDryMsDuringPowderMs = 45 * SECOND_MS;
export const plantDryMsTier4Ms = 50 * SECOND_MS;
export const plantDryMsTier5Ms = 70 * SECOND_MS;
export const plantWaterLevelTickMs = 20 * SECOND_MS;
export const plantGrowthMs = plantGrowthTestEveryMs;
export const overwaterWindowMs = 60 * MINUTE_MS;
/**
 * How long the rotten soil image stays visible before the planted slot is
 * fully cleared so the player can plant a new seed there.
 */
export const plantRotClearMs = 3 * SECOND_MS;
export const magicPowderCraftCost = 10;
export const magicPowderCraftMs = 3 * SECOND_MS;
export const level4GrowMs = plantGrowthTestEveryMs;
export const level5GrowMs = plantGrowthTestEveryMs;

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
export const onboardingTutorialBindSessionKey = "onboardingTutorialBindSessionV1";
/** 한 번이라도 월드(index)에서 플레이한 계정(튜토리얼 일회 재생·건너뛰기 후 복귀용). */
export const everBeenToWorldKey = "ovcEverBeenToWorldV1";

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
  onboardingTutorialBindSessionKey,
  everBeenToWorldKey,
  "butterflyCaughtCountsV1",
  "magicPowderCountV1"
];

/**
 * 공유 세계(resetToken) 리셋 시 로컬에서 지우는 키 = appStorageKeys − 이 집합.
 * 온보딩/가이드/튜토리얼 완료 플래그는 건드리지 않음(공유 맵 데이터만 초기화).
 * 튜토리얼용 월드 초기화는 설정의 「튜토리얼 하기」·세션 플래그 경로만 사용.
 */
const tutorialProgressStorageKeySet = new Set([
  movementTutorialCompleteKey,
  hasGuideBookKey,
  npcDialogueCompleteKey,
  guidePlantPageUnlockedKey,
  onboardingFlowStepKey,
  onboardingFlowDoneKey,
  onboardingTutorialBindSessionKey,
  everBeenToWorldKey
]);

export const appStorageKeysSharedWorldReset = appStorageKeys.filter(function (k) {
  return !tutorialProgressStorageKeySet.has(k);
});
