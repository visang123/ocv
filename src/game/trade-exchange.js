/** @typedef {{ id: string, inputs: Record<string, number>, outputs: Record<string, number>, label: string }} TradeRecipe */

/** @type {TradeRecipe[]} */
export const TRADE_RECIPES = [
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
      return Number(c[key] || 0) >= Number(recipe.inputs[key] || 0);
    });
  });
}

export function recipeMatchesCounter(counter, recipe) {
  if (!recipe) return false;
  return Object.keys(recipe.inputs).every(function (key) {
    return Number(counter[key] || 0) >= Number(recipe.inputs[key] || 0);
  });
}

export function subtractRecipeInputsFromCounter(counter, recipe) {
  const next = cloneTradeCounter(counter);
  if (!recipe) return next;
  Object.keys(recipe.inputs).forEach(function (key) {
    next[key] = Math.max(0, Number(next[key] || 0) - Number(recipe.inputs[key] || 0));
  });
  return next;
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
