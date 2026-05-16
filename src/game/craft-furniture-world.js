/** In-world craft furniture placement (desk, fence, chair, house). */

export const CRAFT_FURNITURE_KINDS = ["craftDesk", "craftFence", "craftChair", "craftHouse"];

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
    height: 36
  },
  craftHouse: {
    src: "\uC774\uBBF8\uC9C0/craft-house-world.png?v=20260516g",
    width: 88,
    height: 72
  }
};

export function isCraftFurnitureKind(kind) {
  return CRAFT_FURNITURE_KINDS.includes(kind);
}

export function getCraftFurnitureWorldSpec(kind) {
  return CRAFT_FURNITURE_WORLD[kind] || null;
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
        height: spec.height
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
      y: entry.y
    };
  });
}

export function parsePlacedCraftFurnitureFromSnapshot(raw) {
  if (!Array.isArray(raw)) return [];
  return sanitizePlacedCraftFurniture(
    raw.map(function (entry) {
      return {
        id: entry && entry.id,
        kind: entry && entry.kind,
        x: entry && entry.x,
        y: entry && entry.y
      };
    })
  );
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
