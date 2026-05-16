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
    const sz = options.getSproutSizeForStage(st, plant);
    const pos = options.getSproutWorldPositionForPlant(px, py, sz, st, plant);
    rects.push({
      left: pos.x,
      top: pos.y,
      right: pos.x + sz.width,
      bottom: pos.y + sz.height
    });
  }

  return rects;
}

/** @param {object} plant */
export function getPlantWorldAnchorXY(plant) {
  if (!plant) return null;
  const x = plant.spotX != null ? plant.spotX : plant.x;
  const y = plant.spotY != null ? plant.spotY : plant.y;
  if (!Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return null;
  return { x: Number(x), y: Number(y) };
}

export function worldRectsOverlap(rectsA, rectsB) {
  if (!rectsA || !rectsB || !rectsA.length || !rectsB.length) return false;
  for (let i = 0; i < rectsA.length; i += 1) {
    const a = rectsA[i];
    for (let j = 0; j < rectsB.length; j += 1) {
      const b = rectsB[j];
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
        return true;
      }
    }
  }
  return false;
}

/** 화면 아래(큰 world Y)일수록 앞(플레이어 쪽) — 겹침·z-index·호버 우선순위에 사용 */
export function getPlantDepthSortY(plant, options) {
  if (!plant) return 0;
  const rects = getPlantVisibleHoverRectsWorld(plant, options);
  if (rects.length) {
    let bottom = -Infinity;
    for (let i = 0; i < rects.length; i += 1) {
      bottom = Math.max(bottom, rects[i].bottom);
    }
    return bottom;
  }
  const py = plant.spotY != null ? plant.spotY : plant.y;
  const spotH = Number(options.plantSpotHeight) || 14;
  return (Number(py) || 0) + spotH;
}

export function mapPlantDepthSortYToZIndex(sortY, groundWorldHeight, zMin, zMax) {
  const h = Number(groundWorldHeight) || 1;
  const lo = Number(zMin) || 0;
  const hi = Number(zMax) || lo;
  const t = Math.max(0, Math.min(1, (Number(sortY) || 0) / h));
  return Math.round(lo + t * (hi - lo));
}
