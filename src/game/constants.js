export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 540;
export const GROUND_WORLD_HEIGHT = WORLD_HEIGHT * 0.6;

/** 식물 지수 합산 상한 */
export const PLANT_INDEX_SCORE_CAP = 1000;
/** 식물 1개당 단계별 기여 점수(말라썩음 등 비정상은 0으로 처리) */
export const PLANT_INDEX_SEEDED_SOIL = 5;
export const PLANT_INDEX_SPROUT_STAGE_1 = 10;
export const PLANT_INDEX_SPROUT_STAGE_2 = 25;
export const PLANT_INDEX_SPROUT_STAGE_3 = 50;
export const PLANT_INDEX_GRASS_STAGE_4 = 100;
export const PLANT_INDEX_GRASS_STAGE_5 = 150;

/** 식물지수 500 이상(월드 3)부터 나비 스폰·시뮬 허용 */
export const PLANT_FOG_BUTTERFLY_MIN_SCORE = 500;

/**
 * 식물지수 구간 → 월드 1~5 (안개 해제 단계).
 * 1: 250 미만, 2: 250~499, 3: 500~749, 4: 750~999, 5: 1000
 */
export function getPlantFogWorldStageFromScore(score) {
  const s = Math.max(0, Math.min(PLANT_INDEX_SCORE_CAP, Number(score) || 0));
  if (s >= 1000) return 5;
  if (s >= 750) return 4;
  if (s >= 500) return 3;
  if (s >= 250) return 2;
  return 1;
}

/**
 * 해당 단계에서 플레이어가 이동 가능한 맑은 구역(월드 좌표, 땅 기준).
 * 단계가 올라갈수록 사각형이 커짐.
 */
export function getPlantFogClearRectWorldPx(stage) {
  const W = WORLD_WIDTH;
  const H = GROUND_WORLD_HEIGHT;
  const st = Math.max(1, Math.min(5, Math.floor(Number(stage)) || 1));
  if (st >= 5) return { left: 0, top: 0, right: W, bottom: H };
  if (st === 4) return { left: 0, top: 16, right: W, bottom: H };
  if (st === 3) return { left: 0, top: 56, right: W, bottom: H };
  if (st === 2) return { left: 0, top: Math.floor(H * 0.5), right: W, bottom: H };
  return {
    left: 0,
    top: Math.floor(H * 0.5),
    right: Math.floor(W * 0.5),
    bottom: H
  };
}

/** 맑은 구역 위에 덮는 전역 딤(0 = 없음, 높을수록 어두움) */
export function getPlantFogGlobalDimAlphaForStage(stage) {
  const st = Math.max(1, Math.min(5, Math.floor(Number(stage)) || 1));
  if (st >= 5) return 0;
  if (st === 4) return 0.08;
  if (st === 3) return 0.18;
  if (st === 2) return 0.32;
  return 0.48;
}

/** 월드 세로 중 땅(324px) 위쪽 하늘 밴드 높이(216px) */
export const WORLD_SKY_BAND_HEIGHT = WORLD_HEIGHT - GROUND_WORLD_HEIGHT;
/** 이 단계(4 = 식물지수 750~)부터 하늘 밴드 안개 제거 */
export const PLANT_FOG_SKY_OPEN_MIN_STAGE = 4;

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

export const WELL_START_X = 405;
export const WELL_START_Y = 190;
/** 안내판 — 책·씨앗·NPC와 간격을 두기 위해 약간 왼쪽·위로 */
export const SIGN_START_X = 138;
export const SIGN_START_Y = 268;
export const SIGN_WIDTH = 38;
export const SIGN_HEIGHT = 36;
/** 스폰 포탈 — script.js setWorldPosition 과 동일 수식 */
export const SPAWN_PORTAL_WIDTH = 30;
export const SPAWN_PORTAL_HEIGHT = 44;
export const SPAWN_PORTAL_X = SIGN_START_X - SPAWN_PORTAL_WIDTH - 24;
export const SPAWN_PORTAL_Y = SIGN_START_Y + SIGN_HEIGHT - SPAWN_PORTAL_HEIGHT;

export const GUIDE_BOOK_WIDTH = 23;
export const GUIDE_BOOK_HEIGHT = 15;
/** 땅의 책·씨앗·NPC를 한 덩어리로 왼쪽 이동(World px) */
const WORLD_GROUND_BOOK_SEED_NPC_SHIFT_LEFT = 40;
/** 가방은 위 이동에 더해 책 대비 조금 더 왼쪽으로(World px) */
const WORLD_BAG_EXTRA_SHIFT_LEFT = 14;
/** 책 가로 위치용 기준 너비(스프라이트만 2/3로 줄여도 허브 가로 배치 유지) */
const GUIDE_BOOK_LAYOUT_REF_WIDTH = 34;
/** 책·씨앗 간격 계산용 기준 X(책 스프라이트 위치와 무관하게 씨앗·NPC 허브 유지) */
const GUIDE_BOOK_BASE_START_X =
  40 + 10 * GUIDE_BOOK_LAYOUT_REF_WIDTH - WORLD_GROUND_BOOK_SEED_NPC_SHIFT_LEFT;
const WELL_CENTER_X = WELL_START_X + WELL_SIZE / 2;
const SPAWN_PORTAL_CENTER_X = SPAWN_PORTAL_X + SPAWN_PORTAL_WIDTH / 2;
/** 바닥 책 — 우물·포탈 각 중심 x의 가운데쯤(스프라이트 가로 중앙 정렬) */
export const GUIDE_BOOK_START_X = Math.round(
  (WELL_CENTER_X + SPAWN_PORTAL_CENTER_X) / 2 - GUIDE_BOOK_WIDTH / 2
);
export const GUIDE_BOOK_START_Y = 284;
/** 책 아래 월드 가방(인벤토리 진입 오브젝트 예정) */
export const WORLD_BAG_WIDTH = 21;
export const WORLD_BAG_HEIGHT = 17;
// 책 아래 중앙에서 출발하되, 가방만 추가로 왼쪽
export const WORLD_BAG_START_X =
  GUIDE_BOOK_START_X +
  Math.round((GUIDE_BOOK_WIDTH - WORLD_BAG_WIDTH) / 2) -
  WORLD_BAG_EXTRA_SHIFT_LEFT;
export const WORLD_BAG_START_Y = GUIDE_BOOK_START_Y + GUIDE_BOOK_HEIGHT + 4;
/** 책 오른쪽–씨앗 왼쪽 최소 간격(가까이 배치) */
export const GUIDE_BOOK_SEED_MIN_GAP = GUIDE_BOOK_WIDTH + 8;
/** 씨앗 — 안내판 오른쪽과, 책·간격 중 더 오른쪽(겹침 방지). 책 X 이동과 무관하게 기준 X 사용 */
export const SEED_START_X = Math.max(
  SIGN_START_X + SIGN_WIDTH + 48,
  GUIDE_BOOK_BASE_START_X + GUIDE_BOOK_WIDTH + GUIDE_BOOK_SEED_MIN_GAP
);
export const SEED_START_Y = SIGN_START_Y + SIGN_HEIGHT - SEED_SIZE;
/** 식물의 달인 — 씨앗 바로 오른쪽(가로로 붙임) */
export const NPC_START_X = SEED_START_X + SEED_SIZE + 12;
export const NPC_START_Y = SEED_START_Y + SEED_SIZE - NPC_HEIGHT;

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;

/** 스모크용 단축 성장(필요 시만). 본편은 plantGrowthMs·sproutStage*·level*GrowMs. */
export const plantGrowthTestEveryMs = 3 * SECOND_MS;

/** 심은 뒤 첫 새싹이 나올 때까지(티어0·첫 새싹 전용이 아닌 구간·레거시 폴백) */
export const plantGrowthMs = 3 * SECOND_MS;
/** 빈 땅(씨만)·티어0 → 첫 새싹 표시까지: 수분 1칸 / 물0 후 마름 / 초록 성장 */
export const firstSproutWaterLevelTickMs = 20 * SECOND_MS;
export const firstSproutDryAfterEmptyMs = 40 * SECOND_MS;
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
/** 월드 땅에 흩어지는 회색 돌(나무 사과 size 10의 1/2) */
export const WORLD_LOOSE_ROCK_COUNT = 25;
export const WORLD_ROCK_SIZE = 14;
/** 바닥 배치(월드 좌표, GROUND_WORLD_HEIGHT 기준) — 가장자리만 남기고 땅 전체에 분포 */
export const WORLD_ROCK_SPAWN_X_MARGIN = 3;
export const WORLD_ROCK_SPAWN_Y_MIN = 3;
/** 돌 스프라이트 맨 위 y의 허용 최댓값(맨 아래까지 내려가게) */
export const WORLD_ROCK_SPAWN_Y_MAX = GROUND_WORLD_HEIGHT - WORLD_ROCK_SIZE - WORLD_ROCK_SPAWN_Y_MIN;
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
/** 한 구간 최대 체류(ms). 최소는 script `ensureButterflyWaypoint`에서 거리 비례로 둠(짧은 구간 2초 고정 방지). */
export const butterflyLegMinMs = 900;
export const butterflyLegMaxMs = 5600;
/** Visible bob on top of waypoint path (multi-frequency in butterflyMotion.js). */
export const butterflyFlutterPeriodHorizontalMs = 2400;
export const butterflyFlutterPeriodVerticalMs = 3000;
export const butterflyFlutterAmplitudeX = 2.35;
export const butterflyFlutterAmplitudeY = 2.55;
/** Time between auto-spawns when below the map cap, in ms. */
export const butterflyRespawnMs = 2 * MINUTE_MS;
/** How close (px, center distance) the player must be to catch a butterfly. */
export const butterflyCatchDistance = 25;
/** Authority (lowest sessionId) broadcasts butterfly positions on this cadence. */
export const butterflyBroadcastMs = 56;
/** Bounding box (world coords) the butterflies stay within while flying. */
export const butterflyBoundsLeft = 24;
export const butterflyBoundsRight = 936;
export const butterflyBoundsTop = 24;
export const butterflyBoundsBottom = 300;
export const pickupDistance = 28;
export const guideInteractDistance = 60;
export const npcInteractDistance = 42;
/** 우물에서 물 퍼오기·되붓기 판정 거리(짧을수록 우물에 더 붙어야 함) */
export const wellUseDistance = 17;
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
/** 가루 3→4(또는 동등 성장 구간) */
export const level4GrowMs = 90 * SECOND_MS;
/** 4단 풀 생존 후 자동 5단 */
export const level5GrowMs = 120 * SECOND_MS;

export const wellWaterKey = "wellWaterV3";
export const lastWellRefillKey = "lastWellRefillAtV3";
export const seedCreatedAtKey = "seedCreatedAtV1";
export const seedPlantedStateKey = "seedPlantedStateV1";
export const hasGuideBookKey = "hasGuideBookV1";
/** 멀티 방 키와 무관하게, 월드에서 바닥 가방을 줍었는지(새 탭·슬러그 변동에도 유지) */
export const worldBagFloorPickedAccountKey = "ovcWorldBagFloorPickedV1";
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
  worldBagFloorPickedAccountKey,
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
