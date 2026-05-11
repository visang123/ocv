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
/** 책 아래 월드 가방(인벤토리 진입 오브젝트 예정) */
export const WORLD_BAG_WIDTH = 14;
export const WORLD_BAG_HEIGHT = 11;
// 책 최초 스폰 좌표를 기준으로, Y만 조금 아래에 가방을 둔다.
export const WORLD_BAG_START_X = GUIDE_BOOK_START_X;
export const WORLD_BAG_START_Y = GUIDE_BOOK_START_Y + GUIDE_BOOK_HEIGHT + 4;
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

/** 스모크용 단축 성장(필요 시만). 본편은 plantGrowthMs·sproutStage*·level*GrowMs. */
export const plantGrowthTestEveryMs = 3 * SECOND_MS;

/** 심은 뒤 첫 새싹이 나올 때까지(티어0·첫 새싹 전용이 아닌 구간·레거시 폴백) */
export const plantGrowthMs = 3 * SECOND_MS;
/** 빈 땅(씨만)·티어0 → 첫 새싹 표시까지: 수분 1칸 / 물0 후 마름 / 초록 성장 */
export const firstSproutWaterLevelTickMs = 7 * SECOND_MS;
export const firstSproutDryAfterEmptyMs = 10 * SECOND_MS;
export const firstSproutGrowthMs = 20 * SECOND_MS;
/** 새싹 표시 1→2 단계 */
export const sproutStage1Ms = 30 * SECOND_MS;
/** 새싹 표시 2→3 단계 */
export const sproutStage2GrowMs = 60 * SECOND_MS;
/** 구세이브 새싹 진화 진행률 마이그레이션(예전 총 6s 기준). */
export const biggerSproutMs = 6 * SECOND_MS;
export const sproutStage1Image = "이미지/sprout-stage1.png?v=20260510f";
export const sproutStage2Image = "이미지/sprout-stage2.png?v=20260510f";
export const sproutStage3Image = "이미지/sprout-stage3.png?v=20260510f";
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
/** index + 온보딩 완료: 월드 공용 땅 씨앗 1슬롯 — 줍은 뒤 같은 좌표에서 10초 뒤 리스폰 */
export const WORLD_LOOSE_SEED_ID = "world-loose-seed";
export const WORLD_LOOSE_SEED_RESPAWN_MS = 10 * SECOND_MS;
/**
 * 월드 허브 느슨 씨 슬롯 좌표 = 튜토 땅 씨(SEED_START)와 동일.
 * 동작 차이는 src/game/groundSeed.js · script pickUp 분기 참고.
 */
export const WORLD_LOOSE_SEED_X = SEED_START_X;
export const WORLD_LOOSE_SEED_Y = SEED_START_Y;
/** 심는 칸(씨앗) 반폭에 더하는 최소 여백(월드 px) — maturity 0–2만 사용 */
const minPlantCenterGapWorld = 4;

/**
 * 기존 식물 중심까지 필요한 최소 거리(월드 px).
 * maturity 3·4·5는 고정값(1.5 / 6 / 7).
 */
export function getMinPlantCenterClearanceWorld(maturityLevel) {
  const m = Math.max(0, Number(maturityLevel) || 0);
  const spot = PLANT_SPOT_WIDTH;
  const w1 = SPROUT_STAGE_WIDTHS[0];
  const w2 = SPROUT_STAGE_WIDTHS[1];

  if (m >= 5) return 12;
  if (m >= 4) return 6;
  if (m >= 3) return 1.5;
  if (m === 2) return (w2 + spot) / 2 + minPlantCenterGapWorld;
  if (m === 1) return (w1 + spot) / 2 + minPlantCenterGapWorld;
  return spot + minPlantCenterGapWorld;
}

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
export const butterflyBroadcastMs = 220;
/** Bounding box (world coords) the butterflies stay within while flying. */
export const butterflyBoundsLeft = 24;
export const butterflyBoundsRight = 936;
export const butterflyBoundsTop = 24;
export const butterflyBoundsBottom = 300;
export const pickupDistance = 28;
export const guideInteractDistance = 60;
export const npcInteractDistance = 60;
/** 우물에서 물 퍼오기·되붓기 판정 거리(짧을수록 우물에 더 붙어야 함) */
export const wellUseDistance = 28;
export const wellPourDistance = wellUseDistance;
export const plantWaterDistance = 40;
/** 포인터 기준 식물 호버: 월드 식물 중심과 이 거리 안이면 후보 */
export const plantHoverPickRadiusWorld = 24;
export const maxWellWater = 3;
export const wellRefillMs = 15 * SECOND_MS;
export const seedDryMs = 3 * MINUTE_MS;
/** 월드 첫 식물(메인): 물 감소가 멈춘 유휴(3·5단) 등에서 마름 판정에 쓰는 긴 기본값 */
export const mainPlantDryAfterEmptyMs = 5 * MINUTE_MS;
/** 마법 가루 적용 중 메인 작물이 물 0 후 흙이 마르기까지 */
export const mainPlantDryAfterPowderMs = 5 * MINUTE_MS;
export const plantDryMs = 40 * SECOND_MS;
/** 가루 진행 중 추가 식물 마름(티어 함수보다 우선) */
export const plantDryMsDuringPowderMs = 45 * SECOND_MS;
export const overwaterWindowMs = 60 * MINUTE_MS;

/**
 * 수분·마름 표 (1→2)…(4→5)에 맞춘 «케어 단계» 1…5.
 * growthTier 0·1 → 1, 2→2, 3→3, 4→4, 5→5
 */
export function plantCareLevelFromGrowthTier(growthTier) {
  const t = Math.max(0, Number(growthTier) || 0);
  if (t >= 5) return 5;
  if (t >= 4) return 4;
  if (t >= 3) return 3;
  if (t >= 2) return 2;
  return 1;
}

/** 수분 한 칸 감소: 10s / 10s / 15s / 20s */
export function getPlantWaterLevelTickMsForTier(growthTier) {
  const L = plantCareLevelFromGrowthTier(growthTier);
  if (L >= 4) return 20 * SECOND_MS;
  if (L >= 3) return 15 * SECOND_MS;
  return 10 * SECOND_MS;
}

/** 물 0 후 흙 마름: 15s / 30s / 45s / 45s / 45s */
export function getPlantDryAfterEmptyMsForTier(growthTier) {
  const L = plantCareLevelFromGrowthTier(growthTier);
  if (L >= 3) return 45 * SECOND_MS;
  if (L === 2) return 30 * SECOND_MS;
  return 15 * SECOND_MS;
}

/** 티어0이고 아직 첫 새싹이 안 난 구간(빈 땅→1레벨 새싹) */
export function isFirstSproutGrowthPhase(plant) {
  if (!plant || plant.isSproutGrown) return false;
  if (Math.max(0, Number(plant.growthTier) || 0) !== 0) return false;
  return true;
}

export function getPlantWaterLevelTickMsForPlant(plant) {
  const tier = Math.max(0, Number(plant && plant.growthTier) || 0);
  if (tier === 0) return firstSproutWaterLevelTickMs;
  return getPlantWaterLevelTickMsForTier(tier);
}

export function getPlantDryAfterEmptyMsForPlantPhase(plant) {
  const tier = Math.max(0, Number(plant && plant.growthTier) || 0);
  if (tier === 0) return firstSproutDryAfterEmptyMs;
  return getPlantDryAfterEmptyMsForTier(tier);
}

/** 첫 새싹 나오기 전 초록 게이지(또는 완료 판정)에 쓰는 지속 시간 */
export function getPlantFirstGrowthDurationMs(plant) {
  if (isFirstSproutGrowthPhase(plant)) return firstSproutGrowthMs;
  return plantGrowthMs;
}
/** 작물이 말라 죽은 흙(soil-dry) 표시 후 심는 칸이 비워지기까지 */
export const plantDrySoilClearMs = 15 * SECOND_MS;
/** 썩은 흙(soil-rotten) 표시 후 심는 칸이 비워지기까지 — 마른 땅과 동일 */
export const plantRotClearMs = plantDrySoilClearMs;
export const magicPowderCraftCost = 10;
export const magicPowderCraftMs = 3 * SECOND_MS;
/** 가루 3→4(또는 동등 성장 구간) */
export const level4GrowMs = 90 * SECOND_MS;
/** 4단 풀 생존 후 자동 5단 */
export const level5GrowMs = 120 * SECOND_MS;

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
