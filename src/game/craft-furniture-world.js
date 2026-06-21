/** In-world craft furniture placement (desk, fence, chair, house). */

export const CRAFT_FURNITURE_KINDS = ["craftDesk", "craftFence", "craftChair", "craftHouse"];

/** Bag-use install duration before furniture appears (ms). */
export const CRAFT_FURNITURE_INSTALL_MS = {
  craftChair: 3000,
  craftDesk: 5000,
  craftHouse: 15000
};

export function getCraftFurnitureInstallDurationMs(kind) {
  const ms = CRAFT_FURNITURE_INSTALL_MS[kind];
  return Number.isFinite(ms) && ms > 0 ? ms : 0;
}

const CRAFT_FURNITURE_WORLD = {
  craftDesk: {
    src: "\uC774\uBBF8\uC9C0/craft-desk-world.png?v=20260516g",
    width: 44,
    height: 38
  },
  craftFence: {
    src: "\uC774\uBBF8\uC9C0/craft-fence-world.png?v=20260516g",
    width: 40,
    height: 32
  },
  craftChair: {
    src: "\uC774\uBBF8\uC9C0/craft-chair-world.png?v=20260516g",
    width: 34,
    height: 36,
    /** Seat surface and foot anchor from chair top (world units). */
    sitSeatOffsetY: 21,
    sitFootOffsetY: 33
  },
  craftHouse: {
    src: "\uC774\uBBF8\uC9C0/craft-house-world.png?v=20260516g",
    width: 88,
    height: 72
  }
};

/** 집 입장 판정: 문·현관 발판 (하단 돌 기단·투명 여백 제외) */
export const CRAFT_HOUSE_TOUCH_INSETS = {
  left: 22,
  right: 46,
  top: 34,
  bottom: 6
};

export function getCraftHouseTouchRect(entry) {
  if (!entry || entry.kind !== "craftHouse") return null;
  const x = Number(entry.x) || 0;
  const y = Number(entry.y) || 0;
  const spec = getCraftFurnitureWorldSpec("craftHouse");
  const w = Number(entry.width) || (spec && spec.width) || 88;
  const h = Number(entry.height) || (spec && spec.height) || 72;
  const ins = CRAFT_HOUSE_TOUCH_INSETS;
  const left = x + ins.left;
  const right = x + w - ins.right;
  const top = y + ins.top;
  const bottom = y + h - ins.bottom;
  if (right <= left || bottom <= top) return null;
  return { left, right, top, bottom };
}

export function isCraftFurnitureKind(kind) {
  return CRAFT_FURNITURE_KINDS.includes(kind);
}

export function getCraftFurnitureWorldSpec(kind) {
  return CRAFT_FURNITURE_WORLD[kind] || null;
}

export function getCraftChairSitAnchorOffsets(chair) {
  const spec = getCraftFurnitureWorldSpec("craftChair");
  const entry = chair || {};
  const seatY = Number(entry.sitSeatOffsetY);
  const footY = Number(entry.sitFootOffsetY);
  return {
    seatOffsetY: Number.isFinite(seatY) ? seatY : spec.sitSeatOffsetY,
    footOffsetY: Number.isFinite(footY) ? footY : spec.sitFootOffsetY
  };
}

export function getCraftChairSeatWorldPoint(chair) {
  if (!chair) return null;
  const offsets = getCraftChairSitAnchorOffsets(chair);
  return {
    x: Number(chair.x) + Number(chair.width) / 2,
    y: Number(chair.y) + offsets.seatOffsetY
  };
}

export function getCraftFurnitureKindShortLabel(kind) {
  if (kind === "craftDesk") return "\uCC45\uC0C1";
  if (kind === "craftChair") return "\uC758\uC790";
  if (kind === "craftHouse") return "\uC9D1";
  if (kind === "craftFence") return "\uC6B8\uD0C0\uB9AC";
  return "\uAC00\uAD6C";
}

export function getCraftFurnitureInstallPresenceAction(kind) {
  if (kind === "craftChair") return "craft_install_chair";
  if (kind === "craftDesk") return "craft_install_desk";
  if (kind === "craftHouse") return "craft_install_house";
  return "";
}

export function parseCraftFurnitureInstallPresenceAction(action) {
  if (action === "craft_install_chair") return "craftChair";
  if (action === "craft_install_desk") return "craftDesk";
  if (action === "craft_install_house") return "craftHouse";
  return "";
}

export function getCraftFurnitureInstallStatusText(kind) {
  const label = getCraftFurnitureKindShortLabel(kind);
  if (!label || label === "\uAC00\uAD6C") return "";
  return label + " \uC124\uCE58\uC911...";
}

function craftFurnitureIdentityGroupKey(entry) {
  const oid = String(entry.ownerUserId || "").trim();
  const oname = String(entry.ownerDisplayName || "").trim();
  return oid + "\0" + oname + "\0" + String(entry.kind || "");
}

function craftFurnitureOrdinalSortTime(entry) {
  const placedAt = Number(entry.placedAt);
  if (Number.isFinite(placedAt) && placedAt > 0) return placedAt;
  const idMatch = String(entry.id || "").match(/(\d+)/);
  return idMatch ? Number(idMatch[1]) : 0;
}

export function assignCraftFurnitureIdentity(entry, ownerUserId, ownerDisplayName) {
  if (!entry) return;
  entry.ownerUserId = String(ownerUserId || "").trim();
  entry.ownerDisplayName = String(ownerDisplayName || "").trim() || "\uD50C\uB808\uC774\uC5B4";
  entry.placedAt = Date.now();
  entry.furnitureOrdinal = 0;
}

export function refreshCraftFurnitureIdentityOrdinals(list) {
  if (!Array.isArray(list)) return;
  list.forEach(function (entry) {
    if (entry) entry.furnitureOrdinal = 0;
  });
  const groups = Object.create(null);
  list.forEach(function (entry) {
    if (!entry || !isCraftFurnitureKind(entry.kind)) return;
    const k = craftFurnitureIdentityGroupKey(entry);
    if (!groups[k]) groups[k] = [];
    groups[k].push({ entry: entry, t: craftFurnitureOrdinalSortTime(entry) });
  });
  Object.keys(groups).forEach(function (k) {
    groups[k].sort(function (a, b) {
      return a.t - b.t;
    });
    groups[k].forEach(function (item, index) {
      item.entry.furnitureOrdinal = index + 1;
    });
  });
}

export function getCraftFurnitureWorldLabel(entry) {
  if (!entry || !isCraftFurnitureKind(entry.kind)) return "";
  const name = String(entry.ownerDisplayName || "").trim() || "\uD50C\uB808\uC774\uC5B4";
  const kindLabel = getCraftFurnitureKindShortLabel(entry.kind);
  const ord = Math.max(0, Number(entry.furnitureOrdinal) || 0);
  return name + "\uC758 " + kindLabel + (ord > 0 ? ord : "");
}

export function sanitizePlacedCraftFurniture(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(function (entry) {
      return entry && isCraftFurnitureKind(entry.kind);
    })
    .map(function (entry) {
      const spec = getCraftFurnitureWorldSpec(entry.kind);
      return {
        id: String(entry.id || ""),
        kind: entry.kind,
        x: Number(entry.x) || 0,
        y: Number(entry.y) || 0,
        width: spec.width,
        height: spec.height,
        ownerUserId: entry.ownerUserId != null ? String(entry.ownerUserId) : "",
        ownerDisplayName: entry.ownerDisplayName != null ? String(entry.ownerDisplayName) : "",
        furnitureOrdinal: Math.max(0, Math.floor(Number(entry.furnitureOrdinal) || 0)),
        placedAt: Number(entry.placedAt) || 0
      };
    })
    .filter(function (entry) {
      return entry.id;
    });
}

export function serializePlacedCraftFurnitureForSnapshot(list) {
  return sanitizePlacedCraftFurniture(list).map(function (entry) {
    return {
      id: entry.id,
      kind: entry.kind,
      x: entry.x,
      y: entry.y,
      ownerUserId: entry.ownerUserId || "",
      ownerDisplayName: entry.ownerDisplayName || "",
      furnitureOrdinal: entry.furnitureOrdinal || 0,
      placedAt: entry.placedAt || 0
    };
  });
}

export function parsePlacedCraftFurnitureFromSnapshot(raw) {
  if (!Array.isArray(raw)) return [];
  const parsed = sanitizePlacedCraftFurniture(
    raw.map(function (entry) {
      return {
        id: entry && entry.id,
        kind: entry && entry.kind,
        x: entry && entry.x,
        y: entry && entry.y,
        ownerUserId: entry && entry.ownerUserId,
        ownerDisplayName: entry && entry.ownerDisplayName,
        furnitureOrdinal: entry && entry.furnitureOrdinal,
        placedAt: entry && entry.placedAt
      };
    })
  );
  refreshCraftFurnitureIdentityOrdinals(parsed);
  return parsed;
}

/** 서버 저장 전 로컬 설치분이 스냅샷 폴링으로 지워지지 않도록 유지(ms) */
export const CRAFT_FURNITURE_LOCAL_PENDING_MS = 15000;

/**
 * id 기준 병합 — 최근 placedAt 우선, 아직 서버에 없는 로컬 설치분은 pending 동안 유지.
 * @param {Array} localList
 * @param {Array|undefined|null} incoming
 */
export function mergePlacedCraftFurnitureFromSnapshot(localList, incoming) {
  const local = sanitizePlacedCraftFurniture(Array.isArray(localList) ? localList : []);
  if (!Array.isArray(incoming)) {
    return local.slice();
  }
  const remote = sanitizePlacedCraftFurniture(incoming);
  const byId = Object.create(null);
  remote.forEach(function (entry) {
    byId[String(entry.id)] = entry;
  });
  const now = Date.now();
  local.forEach(function (entry) {
    const id = String(entry.id);
    const prev = byId[id];
    const placedAt = Number(entry.placedAt) || 0;
    if (!prev) {
      if (placedAt > 0 && now - placedAt < CRAFT_FURNITURE_LOCAL_PENDING_MS) {
        byId[id] = entry;
      }
      return;
    }
    const prevAt = Number(prev.placedAt) || 0;
    if (placedAt >= prevAt) {
      byId[id] = entry;
    }
  });
  const merged = Object.keys(byId).map(function (id) {
    return byId[id];
  });
  refreshCraftFurnitureIdentityOrdinals(merged);
  return merged;
}

export function upsertPlacedCraftFurnitureEntry(list, rawEntry) {
  const parsed = sanitizePlacedCraftFurniture([rawEntry]);
  const entry = parsed[0];
  if (!entry) return Array.isArray(list) ? list.slice() : [];
  const next = Array.isArray(list) ? list.slice() : [];
  const id = String(entry.id);
  const idx = next.findIndex(function (item) {
    return item && String(item.id) === id;
  });
  if (idx >= 0) {
    const prevEl = next[idx]._el;
    next[idx] = entry;
    if (prevEl) next[idx]._el = prevEl;
  } else {
    next.push(entry);
  }
  refreshCraftFurnitureIdentityOrdinals(next);
  return next;
}

export function computeCraftFurniturePlacement(kind, centerX, footY) {
  const spec = getCraftFurnitureWorldSpec(kind);
  if (!spec) return null;
  return {
    x: centerX - spec.width / 2,
    y: footY - spec.height,
    width: spec.width,
    height: spec.height
  };
}
