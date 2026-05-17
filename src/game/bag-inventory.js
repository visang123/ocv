export const BAG_SLOT_ITEM_KEYS = [
  "seed",
  "overgrowthSeed",
  "apple",
  "rock",
  "magicPowder",
  "magicPowderYellow",
  "magicPowderWhite",
  "magicPowderBrown",
  "craftDesk",
  "craftFence",
  "craftChair",
  "craftHouse",
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
];

export const bagInventoryOrderKey = "ovcBagInventoryOrderV1";

/** 가방 UI 슬롯 수(책 보관 칸 제외) */
export const BAG_INVENTORY_SLOT_COUNT = 9;

/** 책 전용 보관 슬롯 수(가방 칸과 별도) */
export const BAG_BOOK_STORAGE_SLOT_COUNT = 1;

const BAG_INVENTORY_WORLD_ONLY_KEYS = new Set(["worldBucket"]);

/**
 * @param {string[]} order
 * @param {Record<string, number>} counts
 * @param {Record<string, number>} itemsToAdd
 * @param {number} [maxSlots]
 */
export function canBagInventoryFitItems(order, counts, itemsToAdd, maxSlots) {
  const slotLimit = Math.max(1, Math.floor(Number(maxSlots) || BAG_INVENTORY_SLOT_COUNT));
  const simulatedOrder = Array.isArray(order) ? order.slice() : [];
  const keys = Object.keys(itemsToAdd || {});
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const amount = Math.max(0, Math.floor(Number(itemsToAdd[key]) || 0));
    if (amount <= 0) continue;
    if (BAG_INVENTORY_WORLD_ONLY_KEYS.has(key)) continue;
    if (Number(counts[key] || 0) > 0) continue;
    if (simulatedOrder.indexOf(key) >= 0) continue;
    if (simulatedOrder.length >= slotLimit) return false;
    simulatedOrder.push(key);
  }
  return true;
}

export function loadBagInventoryOrder(readValue) {
  try {
    const raw = readValue(bagInventoryOrderKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(function (key) {
      return key !== "book" && BAG_SLOT_ITEM_KEYS.includes(key);
    });
  } catch (e) {
    return [];
  }
}

export function saveBagInventoryOrder(writeValue, order) {
  try {
    writeValue(bagInventoryOrderKey, JSON.stringify(order));
  } catch (e) {}
}

export function normalizeBagInventoryOrderByCounts(order, previousCounts, counts) {
  let changed = false;
  let nextOrder = order.filter(function (key) {
    return Number(counts[key] || 0) > 0;
  });

  if (nextOrder.length !== order.length) {
    changed = true;
  }

  if (!previousCounts) {
    const allCountsZero = BAG_SLOT_ITEM_KEYS.every(function (key) {
      return Number(counts[key] || 0) <= 0;
    });
    // 첫 프레임(appleState·가이드 등 미적재)에 카운트만 0이면 순서를 비워 저장해 재로그인 시 가방이 초기화됨
    if (allCountsZero && order.length > 0) {
      return {
        order: order.slice(),
        previousCounts: Object.assign({}, counts),
        changed: false
      };
    }
    BAG_SLOT_ITEM_KEYS.forEach(function (key) {
      if (Number(counts[key] || 0) <= 0) return;
      if (nextOrder.includes(key)) return;
      if (nextOrder.length >= BAG_INVENTORY_SLOT_COUNT) return;
      nextOrder.push(key);
      changed = true;
    });
    if (nextOrder.length > BAG_INVENTORY_SLOT_COUNT) {
      nextOrder = nextOrder.slice(0, BAG_INVENTORY_SLOT_COUNT);
      changed = true;
    }
    return {
      order: nextOrder,
      previousCounts: Object.assign({}, counts),
      changed
    };
  }

  BAG_SLOT_ITEM_KEYS.forEach(function (key) {
    const prev = Number(previousCounts[key] || 0);
    const next = Number(counts[key] || 0);
    if (prev <= 0 && next > 0 && !nextOrder.includes(key)) {
      nextOrder.push(key);
      changed = true;
    }
  });

  BAG_SLOT_ITEM_KEYS.forEach(function (key) {
    if (Number(counts[key] || 0) <= 0) return;
    if (nextOrder.includes(key)) return;
    if (nextOrder.length >= BAG_INVENTORY_SLOT_COUNT) return;
    nextOrder.push(key);
    changed = true;
  });

  if (nextOrder.length > BAG_INVENTORY_SLOT_COUNT) {
    nextOrder = nextOrder.slice(0, BAG_INVENTORY_SLOT_COUNT);
    changed = true;
  }

  return {
    order: nextOrder,
    previousCounts: Object.assign({}, counts),
    changed
  };
}

export function getBagItemDescriptor(itemKey) {
  if (itemKey === "book") {
    return {
      bagType: "book",
      butterflyColor: "",
      label: "OVC 백과사전",
      iconHtml:
        '<img class="bag-slot-icon" src="이미지/plant-book-icon.png?v=20260512x" alt="OVC 백과사전" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "seed") {
    return {
      bagType: "seed",
      butterflyColor: "",
      label: "\uC528\uC557",
      iconHtml:
        '<img class="bag-slot-icon" src="이미지/seed.png" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "overgrowthSeed") {
    return {
      bagType: "overgrowthSeed",
      butterflyColor: "",
      label: "\uACFC\uC131\uC7A5 \uC528\uC557",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--overgrowth-seed" src="\uC774\uBBF8\uC9C0/overgrowth-seed-inventory.png?v=20260517a" alt="" draggable="false">'
    };
  }
  if (itemKey === "apple") {
    return {
      bagType: "apple",
      butterflyColor: "",
      label: "\uC0AC\uACFC",
      iconHtml: '<span class="bag-slot-icon bag-slot-icon--apple" aria-hidden="true"></span>'
    };
  }
  if (itemKey === "rock") {
    return {
      bagType: "rock",
      butterflyColor: "",
      label: "\uB3CC",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--rock" src="이미지/rock-icon.svg?v=20260512a" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "worldBucket") {
    return {
      bagType: "worldBucket",
      butterflyColor: "",
      label: "\uC591\uB3D9\uC774",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--bucket" src="이미지/bucket-empty.png" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "magicPowder") {
    return {
      bagType: "magicPowder",
      butterflyColor: "",
      label: "\uB9C8\uBC95\uC758 \uAC00\uB8E8",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--magic-powder" aria-hidden="true"></span>'
    };
  }
  if (itemKey === "magicPowderYellow") {
    return {
      bagType: "magicPowderYellow",
      butterflyColor: "",
      label: "\uB178\uB780 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--magic-powder-img" src="\uC774\uBBF8\uC9C0/magic-powder-yellow-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "magicPowderWhite") {
    return {
      bagType: "magicPowderWhite",
      butterflyColor: "",
      label: "\uD558\uC580 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--magic-powder-img" src="\uC774\uBBF8\uC9C0/magic-powder-white-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "magicPowderBrown") {
    return {
      bagType: "magicPowderBrown",
      butterflyColor: "",
      label: "\uAC08\uC0C9 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--magic-powder-img" src="\uC774\uBBF8\uC9C0/magic-powder-brown-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "craftDesk") {
    return {
      bagType: "craftDesk",
      butterflyColor: "",
      label: "\uCC45\uC0C1",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--craft bag-slot-icon--craft-desk" src="\uC774\uBBF8\uC9C0/craft-desk-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "craftFence") {
    return {
      bagType: "craftFence",
      butterflyColor: "",
      label: "\uC6B8\uD0C0\uB9AC",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--craft bag-slot-icon--craft-fence" src="\uC774\uBBF8\uC9C0/craft-fence-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "craftChair") {
    return {
      bagType: "craftChair",
      butterflyColor: "",
      label: "\uC758\uC790",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--craft bag-slot-icon--craft-chair" src="\uC774\uBBF8\uC9C0/craft-chair-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "craftHouse") {
    return {
      bagType: "craftHouse",
      butterflyColor: "",
      label: "\uC9D1",
      iconHtml:
        '<img class="bag-slot-icon bag-slot-icon--craft bag-slot-icon--craft-house" src="\uC774\uBBF8\uC9C0/craft-house-inv.png?v=20260516g" alt="" width="42" height="42" draggable="false">'
    };
  }
  if (itemKey === "butterfly:brown") {
    return {
      bagType: "butterfly",
      butterflyColor: "brown",
      label: "\uAC08\uC0C9 \uB098\uBE44",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-brown" aria-hidden="true"></span>'
    };
  }
  if (itemKey === "butterfly:yellow") {
    return {
      bagType: "butterfly",
      butterflyColor: "yellow",
      label: "\uB178\uB780 \uB098\uBE44",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-yellow" aria-hidden="true"></span>'
    };
  }
  return {
    bagType: "butterfly",
    butterflyColor: "white",
    label: "\uD770 \uB098\uBE44",
    iconHtml:
      '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-white" aria-hidden="true"></span>'
  };
}
