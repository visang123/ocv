export const BAG_SLOT_ITEM_KEYS = [
  "seed",
  "apple",
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
  if (itemKey === "seed") {
    return {
      bagType: "seed",
      butterflyColor: "",
      iconHtml: '<img class="bag-slot-icon" src="이미지/seed.png" alt="" width="28" height="28" draggable="false">'
    };
  }
  if (itemKey === "apple") {
    return {
      bagType: "apple",
      butterflyColor: "",
      iconHtml: '<span class="bag-slot-icon bag-slot-icon--apple" aria-hidden="true"></span>'
    };
  }
  if (itemKey === "butterfly:brown") {
    return {
      bagType: "butterfly",
      butterflyColor: "brown",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-brown" aria-hidden="true"></span>'
    };
  }
  if (itemKey === "butterfly:yellow") {
    return {
      bagType: "butterfly",
      butterflyColor: "yellow",
      iconHtml:
        '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-yellow" aria-hidden="true"></span>'
    };
  }
  return {
    bagType: "butterfly",
    butterflyColor: "white",
    iconHtml:
      '<span class="bag-slot-icon bag-slot-icon--butterfly bag-slot-icon--bf-white" aria-hidden="true"></span>'
  };
}
