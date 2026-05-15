/** @typedef {{ id: string, inputs: Record<string, number>, outputs: Record<string, number>, label: string }} TradeRecipe */

/** @type {TradeRecipe[]} */
export const TRADE_RECIPES = [
  {
    id: "rock3_seed1",
    inputs: { rock: 3 },
    outputs: { seed: 1 },
    label: "\uC528\uC557 1\uAC1C"
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
