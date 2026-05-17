/** @typedef {{ id: string, inputs: Record<string, number>, outputs: Record<string, number>, label: string, oneWay?: boolean }} TradeRecipe */
/** @typedef {{ catalogKey?: string, inputs: Record<string, number>, outputs: Record<string, number>, label: string }} TradeCatalogEntry */

export const TRADE_BUTTERFLY_ITEM_KEYS = [
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
];
/** Counter pseudo-key: any mix of butterfly colors totaling N. */
export const TRADE_INPUT_ANY_BUTTERFLY = "butterfly:any";

export function getTradeCounterButterflyTotal(counter) {
  return TRADE_BUTTERFLY_ITEM_KEYS.reduce(function (sum, key) {
    return sum + Math.max(0, Math.floor(Number(counter[key]) || 0));
  }, 0);
}

function tradeInputSatisfied(counter, key, required) {
  const need = Math.max(0, Math.floor(Number(required) || 0));
  if (need <= 0) return true;
  if (key === TRADE_INPUT_ANY_BUTTERFLY) {
    return getTradeCounterButterflyTotal(counter) >= need;
  }
  return Number(counter[key] || 0) >= need;
}

function subtractTradeInputFromCounter(counter, key, required) {
  const next = counter;
  const need = Math.max(0, Math.floor(Number(required) || 0));
  if (need <= 0) return;
  if (key === TRADE_INPUT_ANY_BUTTERFLY) {
    let remaining = need;
    TRADE_BUTTERFLY_ITEM_KEYS.forEach(function (bfKey) {
      if (remaining <= 0) return;
      const have = Math.max(0, Math.floor(Number(next[bfKey]) || 0));
      if (have <= 0) return;
      const take = Math.min(have, remaining);
      next[bfKey] = have - take;
      remaining -= take;
      if (next[bfKey] <= 0) delete next[bfKey];
    });
    return;
  }
  next[key] = Math.max(0, Number(next[key] || 0) - need);
  if (next[key] <= 0) delete next[key];
}

/** @type {TradeRecipe[]} */
export const TRADE_RECIPES = [
  {
    id: "butterfly3_seed1",
    inputs: { [TRADE_INPUT_ANY_BUTTERFLY]: 3 },
    outputs: { seed: 1 },
    label: "\uC528\uC557 1\uAC1C"
  },
  {
    id: "butterfly3_rock1",
    inputs: { [TRADE_INPUT_ANY_BUTTERFLY]: 3 },
    outputs: { rock: 1 },
    label: "\uB3CC 1\uAC1C"
  },
  {
    id: "rock3_seed1",
    inputs: { rock: 3 },
    outputs: { seed: 1 },
    label: "\uC528\uC557 1\uAC1C"
  },
  {
    id: "apple1_butterfly3",
    inputs: { apple: 1 },
    outputs: { [TRADE_INPUT_ANY_BUTTERFLY]: 3 },
    label: "\uB098\uBE44 3\uB9C8\uB9AC"
  },
  {
    id: "apple1_rock3",
    inputs: { apple: 1 },
    outputs: { rock: 3 },
    label: "\uB3CC 3\uAC1C"
  },
  {
    id: "apple1_seed3",
    inputs: { apple: 1 },
    outputs: { seed: 3 },
    label: "\uC528\uC557 3\uAC1C"
  },
  {
    id: "rock7_bucket1",
    inputs: { rock: 7 },
    outputs: { worldBucket: 1 },
    label: "\uC591\uB3D9\uC774"
  },
  {
    id: "seed7_overgrowth1",
    inputs: { seed: 7 },
    outputs: { overgrowthSeed: 1 },
    label: "\uACFC\uC131\uC7A5 \uC528\uC557 1\uAC1C"
  },
  {
    id: "powderYellow_to_butterflies",
    inputs: { magicPowderYellow: 1 },
    outputs: { "butterfly:yellow": 8 },
    label: "\uB178\uB780 \uB098\uBE44 8\uB9C8\uB9AC",
    oneWay: true
  },
  {
    id: "powderWhite_to_butterflies",
    inputs: { magicPowderWhite: 1 },
    outputs: { "butterfly:white": 8 },
    label: "\uD558\uC580 \uB098\uBE44 8\uB9C8\uB9AC",
    oneWay: true
  },
  {
    id: "powderBrown_to_butterflies",
    inputs: { magicPowderBrown: 1 },
    outputs: { "butterfly:brown": 8 },
    label: "\uAC08\uC0C9 \uB098\uBE44 8\uB9C8\uB9AC",
    oneWay: true
  }
];

function recipesEquivalent(a, b) {
  return (
    JSON.stringify(a.inputs) === JSON.stringify(b.inputs) &&
    JSON.stringify(a.outputs) === JSON.stringify(b.outputs)
  );
}

/** @param {TradeRecipe} recipe */
function createReverseTradeRecipe(recipe) {
  const outputKeys = Object.keys(recipe.outputs || {});
  const inputKeys = Object.keys(recipe.inputs || {});
  if (!outputKeys.length || !inputKeys.length) return null;
  const revInputs = {};
  outputKeys.forEach(function (key) {
    revInputs[key] = recipe.outputs[key];
  });
  const revOutputs = {};
  inputKeys.forEach(function (key) {
    revOutputs[key] = recipe.inputs[key];
  });
  const revOutputKeys = Object.keys(revOutputs);
  let label = recipe.label;
  if (revOutputKeys.length === 1) {
    const outKey = revOutputKeys[0];
    label =
      formatTradeRecipePseudoLabel(outKey, revOutputs[outKey]) || recipe.label;
  }
  return {
    id: "rev_" + recipe.id,
    inputs: revInputs,
    outputs: revOutputs,
    label: label
  };
}

function buildAllTradeRecipes() {
  /** @type {TradeRecipe[]} */
  const all = TRADE_RECIPES.slice();
  TRADE_RECIPES.forEach(function (recipe) {
    if (recipe.oneWay) return;
    const reverse = createReverseTradeRecipe(recipe);
    if (!reverse) return;
    if (all.some(function (existing) { return recipesEquivalent(existing, reverse); })) {
      return;
    }
    all.push(reverse);
  });
  return all;
}

export const ALL_TRADE_RECIPES = buildAllTradeRecipes();

function normalizeTradeSideKey(side) {
  return Object.keys(side || {})
    .sort()
    .map(function (key) {
      return key + ":" + Math.max(0, Math.floor(Number(side[key]) || 0));
    })
    .join(",");
}

function catalogEntryKey(inputs, outputs) {
  const left = normalizeTradeSideKey(inputs);
  const right = normalizeTradeSideKey(outputs);
  return left < right ? left + "|" + right : right + "|" + left;
}

/** @returns {TradeCatalogEntry[]} */
export function getTradeCatalogEntries() {
  /** @type {TradeCatalogEntry[]} */
  const entries = [];
  const seen = new Set();
  ALL_TRADE_RECIPES.forEach(function (recipe) {
    const key = catalogEntryKey(recipe.inputs, recipe.outputs);
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({
      catalogKey: key,
      inputs: Object.assign({}, recipe.inputs),
      outputs: Object.assign({}, recipe.outputs),
      label: recipe.label
    });
  });
  return entries;
}

/** @param {TradeCatalogEntry} entry @param {Record<string, number>} counter */
export function getMatchingRecipesForCatalogEntry(entry, counter) {
  const key =
    entry.catalogKey || catalogEntryKey(entry.inputs, entry.outputs);
  return ALL_TRADE_RECIPES.filter(function (recipe) {
    return (
      catalogEntryKey(recipe.inputs, recipe.outputs) === key &&
      recipeMatchesCounter(counter, recipe)
    );
  });
}

export function cloneTradeCounter(counter) {
  const next = {};
  Object.keys(counter || {}).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(counter[key]) || 0));
    if (n > 0) next[key] = n;
  });
  return next;
}

export function getMatchingTradeRecipes(counter) {
  const c = counter || {};
  return ALL_TRADE_RECIPES.filter(function (recipe) {
    return Object.keys(recipe.inputs).every(function (key) {
      return tradeInputSatisfied(c, key, recipe.inputs[key]);
    });
  });
}

export function getRecipeTradeBatchCount(counter, recipe) {
  if (!recipe) return 0;
  const inputKeys = Object.keys(recipe.inputs || {});
  if (!inputKeys.length) return 0;
  let minBatch = Infinity;
  inputKeys.forEach(function (key) {
    const required = Math.max(1, Math.floor(Number(recipe.inputs[key]) || 0));
    let available = 0;
    if (key === TRADE_INPUT_ANY_BUTTERFLY) {
      available = getTradeCounterButterflyTotal(counter);
    } else {
      available = Math.max(0, Math.floor(Number(counter[key]) || 0));
    }
    minBatch = Math.min(minBatch, Math.floor(available / required));
  });
  return minBatch === Infinity ? 0 : Math.max(0, minBatch);
}

/** @param {Record<string, number>} side @param {number} multiplier */
export function scaleTradeItemCounts(side, multiplier) {
  const mult = Math.max(0, Math.floor(Number(multiplier) || 0));
  if (mult <= 0) return {};
  const scaled = {};
  Object.keys(side || {}).forEach(function (key) {
    const base = Math.max(0, Math.floor(Number(side[key]) || 0));
    if (base > 0) scaled[key] = base * mult;
  });
  return scaled;
}

export function recipeMatchesCounter(counter, recipe) {
  return getRecipeTradeBatchCount(counter, recipe) >= 1;
}

export function subtractRecipeInputsFromCounter(counter, recipe, batchCount) {
  const next = cloneTradeCounter(counter);
  if (!recipe) return next;
  const batches =
    batchCount === undefined
      ? 1
      : Math.max(0, Math.floor(Number(batchCount) || 0));
  if (batches <= 0) return next;
  Object.keys(recipe.inputs).forEach(function (key) {
    const perBatch = Math.max(0, Math.floor(Number(recipe.inputs[key]) || 0));
    subtractTradeInputFromCounter(next, key, perBatch * batches);
  });
  return next;
}

export function formatTradeRecipePseudoLabel(itemKey, amount) {
  if (itemKey === TRADE_INPUT_ANY_BUTTERFLY) {
    return "\uB098\uBE44 " + Math.max(0, Math.floor(Number(amount) || 0)) + "\uB9C8\uB9AC";
  }
  return null;
}

/** @deprecated use formatTradeRecipePseudoLabel */
export function formatTradeRecipeInputLabel(itemKey, amount) {
  return formatTradeRecipePseudoLabel(itemKey, amount);
}

/** Expand pseudo-keys (e.g. butterfly:any) for inventory checks and grants. */
export function expandTradeItemCounts(counts) {
  const expanded = {};
  Object.keys(counts || {}).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(counts[key]) || 0));
    if (n <= 0) return;
    if (key === TRADE_INPUT_ANY_BUTTERFLY) {
      let remaining = n;
      TRADE_BUTTERFLY_ITEM_KEYS.forEach(function (bfKey, index) {
        if (remaining <= 0) return;
        const isLast = index === TRADE_BUTTERFLY_ITEM_KEYS.length - 1;
        const give = isLast
          ? remaining
          : Math.floor(n / TRADE_BUTTERFLY_ITEM_KEYS.length);
        if (give <= 0) return;
        expanded[bfKey] = (Number(expanded[bfKey]) || 0) + give;
        remaining -= give;
      });
      if (remaining > 0) {
        expanded[TRADE_BUTTERFLY_ITEM_KEYS[0]] =
          (Number(expanded[TRADE_BUTTERFLY_ITEM_KEYS[0]]) || 0) + remaining;
      }
      return;
    }
    expanded[key] = (Number(expanded[key]) || 0) + n;
  });
  return expanded;
}

export function mergeOutputsIntoCounter(counter, recipe) {
  const next = cloneTradeCounter(counter);
  if (!recipe) return next;
  const expanded = expandTradeItemCounts(recipe.outputs);
  Object.keys(expanded).forEach(function (key) {
    next[key] = Number(next[key] || 0) + Number(expanded[key] || 0);
  });
  return next;
}

export function getTradeRecipeById(recipeId) {
  return ALL_TRADE_RECIPES.find(function (r) {
    return r.id === recipeId;
  });
}
