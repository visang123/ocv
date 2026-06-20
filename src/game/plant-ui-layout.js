import {
  PLANT_GROWTH_METER_HEIGHT,
  PLANT_GROWTH_METER_WIDTH,
  PLANT_SPOT_WIDTH,
  PLANT_UI_GAP_ABOVE_SOIL,
  WATER_NEEDED_SIZE
} from "./constants.js";

export function getPlantSpotCenterX(spotX) {
  return spotX + PLANT_SPOT_WIDTH / 2;
}

/** 심은 흙(spot) 바로 위 — 첫 물주기 물방울 */
export function getPlantWaterNeededWorldPosition(spotX, spotY) {
  return {
    x: getPlantSpotCenterX(spotX) - WATER_NEEDED_SIZE / 2,
    y: spotY - WATER_NEEDED_SIZE - PLANT_UI_GAP_ABOVE_SOIL
  };
}

/** 성장 게이지 — spot 중앙 정렬, 물방울과 겹치지 않게 위로 쌓음 */
export function getPlantGrowthMeterWorldPosition(spotX, spotY, options) {
  const stackAboveWater = Boolean(options && options.stackAboveWater);
  let y = spotY - PLANT_GROWTH_METER_HEIGHT - PLANT_UI_GAP_ABOVE_SOIL;
  if (stackAboveWater) {
    y -= WATER_NEEDED_SIZE + PLANT_UI_GAP_ABOVE_SOIL;
  }
  return {
    x: getPlantSpotCenterX(spotX) - PLANT_GROWTH_METER_WIDTH / 2,
    y: y
  };
}
