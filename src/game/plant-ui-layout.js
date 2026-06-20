import {
  MAP_VISUAL_SCALE,
  PLANT_GROWTH_METER_HEIGHT,
  PLANT_GROWTH_METER_WIDTH,
  PLANT_SPOT_HEIGHT,
  PLANT_SPOT_WIDTH,
  PLANT_UI_GAP_ABOVE_SOIL,
  WATER_NEEDED_SIZE
} from "./constants.js";

/** setWorldSize entity span → setWorldPosition ground coordinate span */
export function entitySpanOnGround(entitySize) {
  return entitySize / MAP_VISUAL_SCALE;
}

export function getPlantSpotCenterX(spotX) {
  return spotX + entitySpanOnGround(PLANT_SPOT_WIDTH) / 2;
}

/** spot(흙) 하단 — 새싹 발밑 앵커 */
export function getPlantSpotFootY(spotY) {
  return spotY + entitySpanOnGround(PLANT_SPOT_HEIGHT);
}

/** 심은 흙(spot) 바로 위 — 첫 물주기 물방울 */
export function getPlantWaterNeededWorldPosition(spotX, spotY) {
  const waterW = entitySpanOnGround(WATER_NEEDED_SIZE);
  return {
    x: getPlantSpotCenterX(spotX) - waterW / 2,
    y: spotY - waterW - entitySpanOnGround(PLANT_UI_GAP_ABOVE_SOIL)
  };
}

/** 성장 게이지 — spot 중앙 정렬, 물방울과 겹치지 않게 위로 쌓음 */
export function getPlantGrowthMeterWorldPosition(spotX, spotY, options) {
  const stackAboveWater = Boolean(options && options.stackAboveWater);
  const meterH = entitySpanOnGround(PLANT_GROWTH_METER_HEIGHT);
  const gap = entitySpanOnGround(PLANT_UI_GAP_ABOVE_SOIL);
  const waterH = entitySpanOnGround(WATER_NEEDED_SIZE);
  let y = spotY - meterH - gap;
  if (stackAboveWater) {
    y -= waterH + gap;
  }
  const meterW = entitySpanOnGround(PLANT_GROWTH_METER_WIDTH);
  return {
    x: getPlantSpotCenterX(spotX) - meterW / 2,
    y: y
  };
}
