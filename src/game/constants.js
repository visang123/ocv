export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 540;
export const GROUND_WORLD_HEIGHT = WORLD_HEIGHT * 0.6;

/** 하늘·땅 배경만 확대; 게임 로직 좌표(WORLD_*)는 그대로 */
export const MAP_VISUAL_SCALE = 1.5;
export const VISUAL_WORLD_WIDTH = WORLD_WIDTH * MAP_VISUAL_SCALE;
export const VISUAL_WORLD_HEIGHT = WORLD_HEIGHT * MAP_VISUAL_SCALE;
export const VISUAL_GROUND_WORLD_HEIGHT = GROUND_WORLD_HEIGHT * MAP_VISUAL_SCALE;

/** 식물 지수 합산 상한 */
export const PLANT_INDEX_SCORE_CAP = 500;
/** 안개 월드 단계 — NPC 등장(식물지수 구간과 동일) */
export const PLANT_FOG_TRADE_MASTER_MIN_STAGE = 2;
export const PLANT_FOG_ALCHEMY_MASTER_MIN_STAGE = 3;

/** 식물 1개당 단계별 기여 점수(말라썩음 등 비정상은 0으로 처리) */
export const PLANT_INDEX_SEEDED_SOIL = 5;
export const PLANT_INDEX_SPROUT_STAGE_1 = 10;
export const PLANT_INDEX_SPROUT_STAGE_2 = 25;
export const PLANT_INDEX_SPROUT_STAGE_3 = 50;
export const PLANT_INDEX_GRASS_STAGE_4 = 100;
export const PLANT_INDEX_GRASS_STAGE_5 = 150;

/** 식물지수 250 이상(월드 3)부터 나비 스폰·시뮬 허용 */
export const PLANT_FOG_BUTTERFLY_MIN_SCORE = 250;

/**
 * 식물지수 구간 → 월드 1~5 (안개 해제 단계).
 * 1: 125 미만, 2: 125~249, 3: 250~374, 4: 375~499, 5: 500
 */
export function getPlantFogWorldStageFromScore(score) {
  const s = Math.max(0, Math.min(PLANT_INDEX_SCORE_CAP, Number(score) || 0));
  if (s >= 500) return 5;
  if (s >= 375) return 4;
  if (s >= 250) return 3;
  if (s >= 125) return 2;
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
  if (st === 4) return { left: 0, top: 0, right: W, bottom: H };
  if (st === 3) return { left: 0, top: 56, right: Math.floor(W * 0.84), bottom: H };
  if (st === 2) return { left: 0, top: Math.floor(H * 0.4), right: Math.floor(W * 0.68), bottom: H };
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
  if (st === 4) return 0;
  if (st === 3) return 0.18;
  if (st === 2) return 0.32;
  return 0.48;
}

/** 월드 세로 중 땅(324px) 위쪽 하늘 밴드 높이(216px) */
export const WORLD_SKY_BAND_HEIGHT = WORLD_HEIGHT - GROUND_WORLD_HEIGHT;
/** Stage 5 (plant index 500) opens the sky band. */
export const PLANT_FOG_SKY_OPEN_MIN_STAGE = 5;

export const PLAYER_WIDTH = 25;
export const PLAYER_HEIGHT = 50;
/** Seated pose — shorter silhouette aligned to craft chair seat. */
export const PLAYER_SIT_WIDTH = 21;
export const PLAYER_SIT_HEIGHT = 26;
/** Shift seated foot anchor up (world Y−) so the body sits on the chair seat. */
export const PLAYER_SIT_VISUAL_LIFT_Y = 11;
const IMAGE_DIR = "\uC774\uBBF8\uC9C0";

export const PLAYER_BASE_IMAGE_SRC = IMAGE_DIR + "/player-white.png";
export const PLAYER_SIT_IMAGE_SRC = IMAGE_DIR + "/player-sit-white.png?v=20260517e";
export const IMG_BUCKET_EMPTY = IMAGE_DIR + "/bucket-empty.png";
export const IMG_BUCKET_FULL = IMAGE_DIR + "/bucket-full.png";
export const IMG_SEED = IMAGE_DIR + "/seed.png";
export const IMG_SEED_DRY = IMAGE_DIR + "/seed-dry.png";
export const IMG_SOIL_ROTTEN = IMAGE_DIR + "/soil-rotten.png";
export const IMG_SOIL_WET = IMAGE_DIR + "/soil-wet.png";
export const IMG_SOIL_DRY = IMAGE_DIR + "/soil-dry.png";
export const IMG_TILLED_SOIL = IMAGE_DIR + "/tilled-soil.png";
export const IMG_SPROUT = IMAGE_DIR + "/sprout.png";
export const IMG_WATER_NEEDED = IMAGE_DIR + "/water-needed.png";
export const IMG_WELL = IMAGE_DIR + "/well.png";
export const IMG_WELL_EMPTY = IMAGE_DIR + "/well-empty.png";
export const SEED_SIZE = 10;
export const BUCKET_SIZE = 16;
export const WELL_SIZE = 38;
export const PLANT_SPOT_WIDTH = 14;
export const PLANT_SPOT_HEIGHT = 7;
export const WATER_NEEDED_SIZE = 8;
/** spot 중앙 정렬 성장 게이지 (월드 단위 — setWorldSize와 동일) */
export const PLANT_GROWTH_METER_WIDTH = 42;
export const PLANT_GROWTH_METER_HEIGHT = 8;
/** 흙(spot) 상단과 UI(게이지·물방울) 사이 간격 */
export const PLANT_UI_GAP_ABOVE_SOIL = 2;
export const SPROUT_WIDTH = 5;
export const SPROUT_HEIGHT = 6;
export const BIG_TREE_WIDTH = 142;
export const BIG_TREE_HEIGHT = 190;
/** 잎·가지·사과 영역 높이(디자인 px) — 줄기 상단까지 */
export const BIG_TREE_CANOPY_DESIGN_HEIGHT = 118;
export const NPC_WIDTH = Math.round(13 * 1.7);
export const NPC_HEIGHT = Math.round(26 * 1.7);

/** Right-anchored tree, shifted left (several × tree width) from the original corner. */
export const BIG_TREE_X =
  WORLD_WIDTH - BIG_TREE_WIDTH - 8 - Math.round(BIG_TREE_WIDTH * 3.35);
/** Trunk/roots sit on ground line (world y=0); #big-tree box bottom aligns with surface. */
export const BIG_TREE_Y = -BIG_TREE_HEIGHT;
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
/** 우물 오른쪽 땅 — 거래의 달인(상인), 월드 2(식물지수 125+)부터 */
export const TRADE_MASTER_START_X = WELL_START_X + WELL_SIZE + 22;
export const TRADE_MASTER_START_Y = WELL_START_Y + 44;
/** 거래의 달인보다 오른쪽·위 — 연금술의 달인, 월드 3(250+)부터 */
export const ALCHEMY_MASTER_START_X = TRADE_MASTER_START_X + NPC_WIDTH + 34;
export const ALCHEMY_MASTER_START_Y = TRADE_MASTER_START_Y - 38;
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
/** 씨앗만 추가로 왼쪽(World px) */
const SEED_EXTRA_SHIFT_LEFT = 12;
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
export const SEED_START_X =
  Math.max(
    SIGN_START_X + SIGN_WIDTH + 48,
    GUIDE_BOOK_BASE_START_X + GUIDE_BOOK_WIDTH + GUIDE_BOOK_SEED_MIN_GAP
  ) - SEED_EXTRA_SHIFT_LEFT;
export const SEED_START_Y = SIGN_START_Y + SIGN_HEIGHT - SEED_SIZE;
/** 식물의 달인 — 씨앗 바로 오른쪽(가로로 붙임) */
export const NPC_START_X = SEED_START_X + SEED_SIZE + 12;
export const NPC_START_Y = SEED_START_Y + SEED_SIZE - NPC_HEIGHT;

export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;

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
/** 노란 마법 가루 4·5단계 꽃 */
export const flowerStage4Image = "이미지/flower-stage4-front.png?v=20260516f";
export const flowerStage5Image = "이미지/flower-stage5-front.png?v=20260516f";
/** 갈색 마법 가루 4·5단계 나무 */
export const treeStage4Image = "이미지/tree-stage4-front.png?v=20260520a";
export const treeStage5Image = "이미지/tree-stage5-front.png?v=20260520a";
/** 하얀 마법 가루 4·5단계 선인장 */
export const cactusStage4Image = "이미지/cactus-stage4-front.png?v=20260531c";
export const cactusStage5Image = "이미지/cactus-stage5-front.png?v=20260531c";
/** 4·5단계 선인장 — 풀·나무보다 작게 */
export const cactusStage4WorldScale = 2.15;
export const cactusStage5WorldScale = 2.55;
/** 선인장 4·5단 수분 1칸 감소 간격 */
export const cactusMatureWaterLevelTickMs = 20 * MINUTE_MS;
/** 선인장 4·5단 수분 0 후 마름까지 */
export const cactusMatureDryAfterEmptyMs = 35 * MINUTE_MS;
/** Draw sizes per stage (world pixels). */
/** 1·2·3단계 새싹 PNG(고해상도)에 맞춘 월드 기본 크기 */
export const SPROUT_STAGE_WIDTHS = [7, 10, 15];
export const SPROUT_STAGE_HEIGHTS = [8, 15, 26];

/**
 * 1·2·3단계 새싹 PNG 앵커(불투명 bbox 기준 소스 픽셀).
 * centerX·footY로 spot 중앙·땅 발밑에 맞춤.
 */
export const SPROUT_STAGE_ANCHORS = [
  { srcW: 508, srcH: 420, centerX: 255.5, footY: 416 },
  { srcW: 420, srcH: 504, centerX: 210, footY: 500 },
  { srcW: 420, srcH: 855, centerX: 207, footY: 852 }
];

/** @param {number} stage 1~3 */
export function getSproutStageAnchor(stage) {
  const st = Math.floor(Number(stage)) || 0;
  if (st < 1 || st > 3) return null;
  return SPROUT_STAGE_ANCHORS[st - 1] || null;
}

/**
 * spot 중앙·발밑 기준 스프라이트 좌상단(월드 좌표).
 * MAP_VISUAL_SCALE>1일 때 위치 스케일과 객체 화면 크기 불일치를 보정.
 */
export function getAnchoredSpriteWorldPosition(
  spotCenterX,
  spotFootY,
  sproutSize,
  anchor,
  mapVisualScale
) {
  const mapScale = Math.max(1, Number(mapVisualScale) || 1);
  return {
    x: spotCenterX - (anchor.centerX / anchor.srcW) * sproutSize.width / mapScale,
    y:
      spotFootY -
      (anchor.footY / anchor.srcH) * sproutSize.height / mapScale
  };
}
/** 4·5단계 풀 — 3단계 베이스(인덱스 2)에 곱해 월드에서 더 크게 그림 */
export const grassStage4WorldScale = 2.95;
export const grassStage5WorldScale = 3.55;
/** 5단계 풀 PNG가 좌측으로 치우쳐 보일 때 월드 x 보정(양수=오른쪽) — 레거시, 앵커 배치로 대체 */
export const grassStage5AnchorDxWorld = 7;

/**
 * 4·5단 성숙 스프라이트 PNG 앵커(불투명 bbox 기준 소스 픽셀).
 * centerX·footY로 식물 spot 중앙·땅 발밑에 맞춤.
 * @type {Record<string, Record<number, { srcW: number, srcH: number, centerX: number, footY: number, scale: number }>>}
 */
export const MATURE_SPRITE_ANCHORS = {
  grass: {
    4: { srcW: 504, srcH: 587, centerX: 255.5, footY: 554, scale: grassStage4WorldScale },
    5: { srcW: 504, srcH: 587, centerX: 196.5, footY: 562, scale: grassStage5WorldScale }
  },
  flower: {
    4: { srcW: 500, srcH: 601, centerX: 273, footY: 538, scale: grassStage4WorldScale },
    5: { srcW: 500, srcH: 601, centerX: 217, footY: 553, scale: grassStage5WorldScale }
  },
  tree: {
    4: { srcW: 270, srcH: 249, centerX: 135, footY: 241, scale: grassStage4WorldScale },
    5: { srcW: 245, srcH: 253, centerX: 122.5, footY: 245, scale: grassStage5WorldScale }
  },
  cactus: {
    4: { srcW: 265, srcH: 251, centerX: 132.5, footY: 243, scale: cactusStage4WorldScale },
    5: { srcW: 269, srcH: 251, centerX: 134.5, footY: 243, scale: cactusStage5WorldScale }
  }
};

/** 4·5단 성숙 식물 호버 링 지름(월드 px) — 큰 스프라이트 전체가 아닌 spot 기준 */
export const PLANT_HOVER_RING_WORLD_SIZE = 24;

/** @param {"grass"|"flower"|"tree"|"cactus"|string} matureKind */
export function getMatureSpriteAnchor(matureKind, stage) {
  if (stage < 4) return null;
  const tier = stage >= 5 ? 5 : 4;
  const kind =
    matureKind === "flower" || matureKind === "tree" || matureKind === "cactus"
      ? matureKind
      : "grass";
  const entry = MATURE_SPRITE_ANCHORS[kind];
  return entry ? entry[tier] || null : null;
}

export const appleEatMs = 3 * SECOND_MS;
/** Planting (any seed) locks movement and shows status for this long (ms). */
export const plantActionMs = 3 * SECOND_MS;
export const appleRespawnMs = 90 * SECOND_MS;
/** index + 온보딩 완료: 월드 공용 땅 씨앗 1슬롯 — 줍은 뒤 같은 좌표에서 5초 뒤 리스폰 */
export const WORLD_LOOSE_SEED_ID = "world-loose-seed";
export const WORLD_LOOSE_SEED_RESPAWN_MS = 5 * SECOND_MS;
/** false — 월드 허브 바닥 씨앗(worldLooseSeed) 미표시·미줍기 */
export const WORLD_HUB_GROUND_SEED_ENABLED = false;
/**
 * 월드 허브 느슨 씨 슬롯 좌표 = 튜토 땅 씨(SEED_START)와 동일.
 * 동작 차이는 src/game/groundSeed.js · script pickUp 분기 참고.
 */
export const WORLD_LOOSE_SEED_X = SEED_START_X;
export const WORLD_LOOSE_SEED_Y = SEED_START_Y;
/** 월드 땅에 흩어지는 회색 돌(나무 사과 size 10의 1/2) */
export const WORLD_LOOSE_ROCK_COUNT = 40;
/** 맵에 보이는 돌이 이 수보다 적으면 1분마다 1개 리스폰 */
export const WORLD_ROCK_RESPAWN_INTERVAL_MS = 60 * 1000;
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
export const butterflyMaxAlive = 10;
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
export const butterflyRespawnMs = 3 * MINUTE_MS;
/** How close (px, center distance) the player must be to catch a butterfly. */
export const butterflyCatchDistance = 25;
/** Authority (lowest sessionId) broadcasts butterfly positions on this cadence. */
export const butterflyBroadcastMs = 56;
/** Bounding box (world coords) the butterflies stay within while flying. */
export const butterflyBoundsLeft = 24;
export const butterflyBoundsRight = 936;
export const butterflyBoundsTop = 24;
export const butterflyBoundsBottom = GROUND_WORLD_HEIGHT - 16;
export const pickupDistance = 28;
/** 양동이 줍기 — 플레이어 발↔양동이 중심 거리(px) */
export const bucketPickupDistance = 12;
export const guideInteractDistance = 60;
export const npcInteractDistance = 42;
/** 우물에서 물 퍼오기·되붓기 판정 거리 */
export const wellUseDistance = 28;
export const wellPourDistance = wellUseDistance;
/** 우물 물량 카드(#well-card) 표시 거리 — 상호작용보다 넓게 */
export const wellCardDistance = 45;
/** Q·클릭 물주기 — 줍기보다 넓게(씨앗·아이템은 pickupDistance 유지) */
export const plantWaterDistance = 48;
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

function isCactusMaturePlantPhase(plant) {
  return (
    plant &&
    String(plant.matureKind || "").trim() === "cactus" &&
    Math.max(0, Number(plant.growthTier) || 0) >= 4
  );
}

export function getPlantWaterLevelTickMsForPlant(plant) {
  const tier = Math.max(0, Number(plant && plant.growthTier) || 0);
  if (tier === 0) return firstSproutWaterLevelTickMs;
  if (isCactusMaturePlantPhase(plant)) return cactusMatureWaterLevelTickMs;
  return getPlantWaterLevelTickMsForTier(tier);
}

export function getPlantDryAfterEmptyMsForPlantPhase(plant) {
  const tier = Math.max(0, Number(plant && plant.growthTier) || 0);
  if (tier === 0) return firstSproutDryAfterEmptyMs;
  if (isCactusMaturePlantPhase(plant)) return cactusMatureDryAfterEmptyMs;
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
/** 4단 풀·나무 생존 후 자동 5단 */
export const level5GrowMs = 120 * SECOND_MS;
/** 4단 선인장 → 5단 */
export const cactusLevel5GrowMs = 1 * HOUR_MS;

export const wellWaterKey = "wellWaterV3";
export const lastWellRefillKey = "lastWellRefillAtV3";
export const seedCreatedAtKey = "seedCreatedAtV1";
export const seedPlantedStateKey = "seedPlantedStateV1";
export const hasGuideBookKey = "hasGuideBookV1";
/** 멀티 방 키와 무관하게, 월드에서 바닥 가방을 줍었는지(새 탭·슬러그 변동에도 유지) */
export const worldBagFloorPickedAccountKey = "ovcWorldBagFloorPickedV1";
export const npcDialogueCompleteKey = "npcDialogueCompleteV1";
export const tradeMasterDialogueCompleteKey = "tradeMasterDialogueCompleteV1";
export const alchemyMasterDialogueCompleteKey = "alchemyMasterDialogueCompleteV1";
export const craftFurnitureCountsKey = "craftFurnitureCountsV1";
export const coloredMagicPowderCountsKey = "coloredMagicPowderCountsV1";
export const guidePlantPageUnlockedKey = "guidePlantPageUnlockedV1";
export const appleStateKey = "appleStateV1";
export const playerPositionKey = "playerPositionV1";
export const playerHealthKey = "playerHealthV1";
export const bucketStateKey = "bucketStateV1";
export const mainDrySeedHandledKey = "mainDrySeedHandledV1";
export const mainSeedCollectedKey = "mainSeedCollectedV1";
export const movementTutorialCompleteKey = "movementTutorialCompleteV1";
/** 계정당 1회 — 첫 로그인 세계관 스토리 인트로 */
export const storyIntroCompleteKey = "storyIntroCompleteV1";
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
  tradeMasterDialogueCompleteKey,
  alchemyMasterDialogueCompleteKey,
  guidePlantPageUnlockedKey,
  appleStateKey,
  playerPositionKey,
  playerHealthKey,
  bucketStateKey,
  mainDrySeedHandledKey,
  mainSeedCollectedKey,
  movementTutorialCompleteKey,
  storyIntroCompleteKey,
  onboardingFlowStepKey,
  onboardingFlowDoneKey,
  onboardingTutorialBindSessionKey,
  everBeenToWorldKey,
  "butterflyCaughtCountsV1",
  "magicPowderCountV1",
  "craftFurnitureCountsV1",
  "coloredMagicPowderCountsV1",
  "ovcBagInventoryOrderV1",
  "playerMoneyKrwV1"
];

/**
 * 공유 세계(resetToken) 리셋 시 로컬에서 지우는 키 = appStorageKeys − 이 집합.
 * 온보딩/가이드/튜토리얼 완료 플래그는 건드리지 않음(공유 맵 데이터만 초기화).
 * 튜토리얼용 월드 초기화는 설정의 「튜토리얼 하기」·세션 플래그 경로만 사용.
 */
const tutorialProgressStorageKeySet = new Set([
  movementTutorialCompleteKey,
  storyIntroCompleteKey,
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
