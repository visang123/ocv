export const BAG_SLOT_ITEM_KEYS = [
  "book",
  "seed",
  "apple",
  "rock",
  "magicPowder",
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
];

export const bagInventoryOrderKey = "ovcBagInventoryOrderV1";

export function loadBagInventoryOrder(readValue) {
  try {
    const raw = readValue(bagInventoryOrderKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(function (key) {
      return BAG_SLOT_ITEM_KEYS.includes(key);
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
      nextOrder.push(key);
      changed = true;
    });
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
      label: "\uC2DD\uBB3C\uC758 \uCC45",
      iconHtml:
        '<img class="bag-slot-icon" src="이미지/plant-book-icon.png?v=20260512x" alt="plant book" width="42" height="42" draggable="false">'
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
  if (itemKey === "magicPowder") {
    return {
      bagType: "magicPowder",
      butterflyColor: "",
      label: "\uB9C8\uBC95\uC758 \uAC00\uB8E8",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--magic-powder" aria-hidden="true"></span>'
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
