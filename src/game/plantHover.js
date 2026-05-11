export function isWorldPointInsideRect(x, y, rect) {
  if (!rect) return false;
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function getPlantVisibleHoverRectsWorld(plant, options) {
  if (!plant) return [];
  const px = plant.spotX != null ? plant.spotX : plant.x;
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const rects = [];

  if (!options.shouldHideSoil(plant)) {
    rects.push({
      left: px,
      top: py,
      right: px + options.plantSpotWidth,
      bottom: py + options.plantSpotHeight
    });
  }

  const sproutVisible =
    plant.isSproutGrown &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered;
  if (sproutVisible) {
    const st = options.getSproutStageFromPlant(plant);
    const sz = options.getSproutSizeForStage(st);
    const pos = options.getSproutWorldPositionForPlant(px, py, sz, st);
    rects.push({
      left: pos.x,
      top: pos.y,
      right: pos.x + sz.width,
      bottom: pos.y + sz.height
    });
  }

  return rects;
}
