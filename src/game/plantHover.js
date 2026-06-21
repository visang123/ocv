/**
 * 식물 호버·투명(가림) 규칙
 *
 * 1) 뒤 식물이 앞 식물에 일부 가려짐 → 뒤 식물 호버 시, 시각적으로 겹치는 앞 식물만 투명
 * 2) 앞 식물이 뒤 식물을 거의 완전히 가림 → 앞 식물 호버 시, 앞 식물 자신만 투명
 *
 * 겹침·가림 판정은 보이는 본체 실루엣(새싹 우선, 없으면 흙)만 사용.
 * 포인터 히트는 흙+새싹(getPlantVisibleHoverRectsWorld)을 사용.
 */

export function isWorldPointInsideRect(x, y, rect) {
  if (!rect) return false;
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function getPlantSpotXY(plant) {
  return {
    x: plant.spotX != null ? plant.spotX : plant.x,
    y: plant.spotY != null ? plant.spotY : plant.y
  };
}

function isSproutBodyVisible(plant) {
  return (
    plant.isSproutGrown &&
    plant.status !== "rotten" &&
    plant.status !== "dry" &&
    !plant.isOverwatered
  );
}

function getPlantSoilRectWorld(plant, options) {
  if (!plant || options.shouldHideSoil(plant)) return null;
  const spot = getPlantSpotXY(plant);
  const spanW =
    typeof options.entitySpanOnGround === "function"
      ? options.entitySpanOnGround(options.plantSpotWidth)
      : options.plantSpotWidth;
  const spanH =
    typeof options.entitySpanOnGround === "function"
      ? options.entitySpanOnGround(options.plantSpotHeight)
      : options.plantSpotHeight;
  return {
    left: spot.x,
    top: spot.y,
    right: spot.x + spanW,
    bottom: spot.y + spanH
  };
}

function getPlantSproutRectWorld(plant, options) {
  if (!plant || !isSproutBodyVisible(plant)) return null;
  const spot = getPlantSpotXY(plant);
  const st = options.getSproutStageFromPlant(plant);
  const sz = options.getSproutSizeForStage(st, plant);
  const pos = options.getSproutWorldPositionForPlant(spot.x, spot.y, sz, st, plant);
  const spanW =
    typeof options.entitySpanOnGround === "function"
      ? options.entitySpanOnGround(sz.width)
      : sz.width;
  const spanH =
    typeof options.entitySpanOnGround === "function"
      ? options.entitySpanOnGround(sz.height)
      : sz.height;
  return {
    left: pos.x,
    top: pos.y,
    right: pos.x + spanW,
    bottom: pos.y + spanH
  };
}

/** 포인터 히트용 — 흙(보일 때) + 새싹 */
export function getPlantVisibleHoverRectsWorld(plant, options) {
  if (!plant) return [];
  const rects = [];
  const soil = getPlantSoilRectWorld(plant, options);
  if (soil) rects.push(soil);
  const sprout = getPlantSproutRectWorld(plant, options);
  if (sprout) rects.push(sprout);
  return rects;
}

/** 겹침·가림·depth 판정용 — 보이는 본체 하나(새싹 우선, 없으면 흙) */
export function getPlantSilhouetteRectsWorld(plant, options) {
  if (!plant) return [];
  const sprout = getPlantSproutRectWorld(plant, options);
  if (sprout) return [sprout];
  const soil = getPlantSoilRectWorld(plant, options);
  return soil ? [soil] : [];
}

/** @param {object} plant */
export function getPlantWorldAnchorXY(plant) {
  if (!plant) return null;
  const spot = getPlantSpotXY(plant);
  if (!Number.isFinite(Number(spot.x)) || !Number.isFinite(Number(spot.y))) return null;
  return { x: Number(spot.x), y: Number(spot.y) };
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

/** 화면 아래(큰 world Y)일수록 앞(플레이어 쪽) */
export function getPlantDepthSortY(plant, options) {
  if (!plant) return 0;
  const rects = getPlantSilhouetteRectsWorld(plant, options);
  if (rects.length) {
    let bottom = -Infinity;
    for (let i = 0; i < rects.length; i += 1) {
      bottom = Math.max(bottom, rects[i].bottom);
    }
    return bottom;
  }
  const spot = getPlantSpotXY(plant);
  const spotH = Number(options.plantSpotHeight) || 14;
  return (Number(spot.y) || 0) + spotH;
}

export function mapPlantDepthSortYToZIndex(sortY, groundWorldHeight, zMin, zMax) {
  const h = Number(groundWorldHeight) || 1;
  const lo = Number(zMin) || 0;
  const hi = Number(zMax) || lo;
  const t = Math.max(0, Math.min(1, (Number(sortY) || 0) / h));
  return Math.round(lo + t * (hi - lo));
}

/** 실루엣이 실제로 겹친다고 볼 최소 비율(작은 쪽 면적 대비 교집합) */
export const PLANT_VISUAL_OVERLAP_MIN_RATIO = 0.06;

/** 앞 식물이 뒤 식물 실루엣을 거의 다 덮었을 때(완전 가림) */
export const PLANT_OCCLUDE_COVERAGE_FULL = 0.82;

export function rectArea(rect) {
  if (!rect) return 0;
  return Math.max(0, rect.right - rect.left) * Math.max(0, rect.bottom - rect.top);
}

export function totalRectsArea(rects) {
  if (!rects || !rects.length) return 0;
  let sum = 0;
  for (let i = 0; i < rects.length; i += 1) sum += rectArea(rects[i]);
  return sum;
}

export function rectIntersectionArea(a, b) {
  if (!a || !b) return 0;
  const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return w * h;
}

/** targetRects 면적 중 coverRects와 겹치는 비율(0~1) */
export function computeRectsOverlapCoverageRatio(targetRects, coverRects) {
  if (!targetRects || !targetRects.length || !coverRects || !coverRects.length) return 0;
  let totalTarget = 0;
  let totalCovered = 0;
  for (let i = 0; i < targetRects.length; i += 1) {
    const t = targetRects[i];
    const tArea = rectArea(t);
    if (tArea <= 0) continue;
    totalTarget += tArea;
    let maxInter = 0;
    for (let j = 0; j < coverRects.length; j += 1) {
      maxInter = Math.max(maxInter, rectIntersectionArea(t, coverRects[j]));
    }
    totalCovered += maxInter;
  }
  return totalTarget > 0 ? totalCovered / totalTarget : 0;
}

/** 두 rect 목록 교집합 면적 / min(면적A, 면적B) */
export function computeRectsMutualOverlapRatio(rectsA, rectsB) {
  if (!rectsA || !rectsB || !rectsA.length || !rectsB.length) return 0;
  if (!worldRectsOverlap(rectsA, rectsB)) return 0;
  let inter = 0;
  for (let i = 0; i < rectsA.length; i += 1) {
    for (let j = 0; j < rectsB.length; j += 1) {
      inter += rectIntersectionArea(rectsA[i], rectsB[j]);
    }
  }
  const minArea = Math.min(totalRectsArea(rectsA), totalRectsArea(rectsB));
  return minArea > 0 ? inter / minArea : 0;
}

function getVisualOverlapMinRatio(options) {
  return options && Number.isFinite(Number(options.visualOverlapMinRatio))
    ? Number(options.visualOverlapMinRatio)
    : PLANT_VISUAL_OVERLAP_MIN_RATIO;
}

function getFullOccludeCoverage(options) {
  return options && Number.isFinite(Number(options.fullOccludeCoverage))
    ? Number(options.fullOccludeCoverage)
    : PLANT_OCCLUDE_COVERAGE_FULL;
}

/** 두 식물 본체 실루엣이 의미 있게 겹치는지 */
export function plantsVisuallyOverlap(plantA, plantB, options) {
  if (!plantA || !plantB || plantA === plantB) return false;
  const rectsA = getPlantSilhouetteRectsWorld(plantA, options);
  const rectsB = getPlantSilhouetteRectsWorld(plantB, options);
  if (!rectsA.length || !rectsB.length) return false;
  return computeRectsMutualOverlapRatio(rectsA, rectsB) >= getVisualOverlapMinRatio(options);
}

/** 앞(occluder) 식물이 뒤(occluded) 식물을 화면에서 거의 완전히 가리는지 */
export function plantFullyOccludesOther(occluder, occluded, options) {
  if (!occluder || !occluded || occluder === occluded) return false;
  if (getPlantDepthSortY(occluder, options) <= getPlantDepthSortY(occluded, options)) return false;
  if (!plantsVisuallyOverlap(occluder, occluded, options)) return false;
  const occludedRects = getPlantSilhouetteRectsWorld(occluded, options);
  const occluderRects = getPlantSilhouetteRectsWorld(occluder, options);
  return (
    computeRectsOverlapCoverageRatio(occludedRects, occluderRects) >= getFullOccludeCoverage(options)
  );
}

/** 포인터 아래 식물 목록(뒤→앞 depth 순) */
export function collectPlantsUnderWorldPoint(px, py, plants, options, isEligible) {
  const matches = [];
  const list = Array.isArray(plants) ? plants : [];
  for (let i = 0; i < list.length; i += 1) {
    const plant = list[i];
    if (!isEligible(plant)) continue;
    const rects = getPlantVisibleHoverRectsWorld(plant, options);
    let hit = false;
    for (let r = 0; r < rects.length; r += 1) {
      if (isWorldPointInsideRect(px, py, rects[r])) {
        hit = true;
        break;
      }
    }
    if (!hit) continue;
    matches.push({ plant: plant, depthY: getPlantDepthSortY(plant, options) });
  }
  matches.sort(function (a, b) {
    return a.depthY - b.depthY;
  });
  return matches.map(function (m) {
    return m.plant;
  });
}

/**
 * 겹친 식물 중 호버 대상:
 * - 뒤 식물이 앞에 일부만 가려지면 → 뒤 식물
 * - 앞이 뒤를 거의 다 가리면 → 앞 식물
 */
export function pickPlantHoverFromUnderPointer(underPlants, options) {
  if (!underPlants || !underPlants.length) return null;
  if (underPlants.length === 1) return underPlants[0];
  for (let i = 0; i < underPlants.length; i += 1) {
    const candidate = underPlants[i];
    const inFront = underPlants.slice(i + 1);
    let fullyHidden = false;
    for (let j = 0; j < inFront.length; j += 1) {
      if (plantFullyOccludesOther(inFront[j], candidate, options)) {
        fullyHidden = true;
        break;
      }
    }
    if (!fullyHidden) return candidate;
  }
  return underPlants[underPlants.length - 1];
}

/**
 * 호버 중 투명 처리할 식물:
 * - 뒤 식물 호버 + 앞과 실루엣 겹침 → 겹치는 앞 식물만
 * - 앞이 뒤를 완전 가림 + 앞 호버 → 앞 식물 자신만
 */
export function getPlantsToFadeForHoverTarget(hoverPlant, allPlants, options, isEligible) {
  const fade = [];
  if (!hoverPlant || !isEligible(hoverPlant)) return fade;
  const hoverDepth = getPlantDepthSortY(hoverPlant, options);
  const list = Array.isArray(allPlants) ? allPlants : [];

  for (let i = 0; i < list.length; i += 1) {
    const other = list[i];
    if (!other || !isEligible(other) || other === hoverPlant) continue;
    if (getPlantDepthSortY(other, options) <= hoverDepth) continue;
    if (!plantsVisuallyOverlap(hoverPlant, other, options)) continue;
    fade.push(other);
  }

  for (let i = 0; i < list.length; i += 1) {
    const back = list[i];
    if (!back || !isEligible(back) || back === hoverPlant) continue;
    if (getPlantDepthSortY(back, options) >= hoverDepth) continue;
    if (!plantsVisuallyOverlap(hoverPlant, back, options)) continue;
    if (plantFullyOccludesOther(hoverPlant, back, options)) {
      return [hoverPlant].concat(
        fade.filter(function (p) {
          return p !== hoverPlant;
        })
      );
    }
  }

  return fade;
}
