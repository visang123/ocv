/** @typedef {{ id: string, inputs: Record<string, number>, outputs: Record<string, number>, label: string }} TradeRecipe */

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
    label: "\uB178\uB780 \uB098\uBE44 8\uB9C8\uB9AC"
  },
  {
    id: "powderWhite_to_butterflies",
    inputs: { magicPowderWhite: 1 },
    outputs: { "butterfly:white": 8 },
    label: "\uD558\uC580 \uB098\uBE44 8\uB9C8\uB9AC"
  },
  {
    id: "powderBrown_to_butterflies",
    inputs: { magicPowderBrown: 1 },
    outputs: { "butterfly:brown": 8 },
    label: "\uAC08\uC0C9 \uB098\uBE44 8\uB9C8\uB9AC"
  }
];

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
  return TRADE_RECIPES.filter(function (recipe) {
    return Object.keys(recipe.inputs).every(function (key) {
      return tradeInputSatisfied(c, key, recipe.inputs[key]);
    });
  });
}

export function recipeMatchesCounter(counter, recipe) {
  if (!recipe) return false;
  return Object.keys(recipe.inputs).every(function (key) {
    return tradeInputSatisfied(counter, key, recipe.inputs[key]);
  });
}

export function subtractRecipeInputsFromCounter(counter, recipe) {
  const next = cloneTradeCounter(counter);
  if (!recipe) return next;
  Object.keys(recipe.inputs).forEach(function (key) {
    subtractTradeInputFromCounter(next, key, recipe.inputs[key]);
  });
  return next;
}

export function formatTradeRecipeInputLabel(itemKey, amount) {
  if (itemKey === TRADE_INPUT_ANY_BUTTERFLY) {
    return "\uB098\uBE44 " + Math.max(0, Math.floor(Number(amount) || 0)) + "\uB9C8\uB9AC";
  }
  return null;
}

export function mergeOutputsIntoCounter(counter, recipe) {
  const next = cloneTradeCounter(counter);
  if (!recipe) return next;
  Object.keys(recipe.outputs).forEach(function (key) {
    next[key] = Number(next[key] || 0) + Number(recipe.outputs[key] || 0);
  });
  return next;
}

export function getTradeRecipeById(recipeId) {
  return TRADE_RECIPES.find(function (r) {
    return r.id === recipeId;
  });
}
