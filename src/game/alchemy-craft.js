/** @typedef {{ id: string, label: string, outputKey: string, outputAmount?: number, inputs: Record<string, number> }} AlchemyCraftRecipe */

/** @type {AlchemyCraftRecipe[]} */
export const ALCHEMY_CRAFT_RECIPES = [
  {
    id: "powderYellow",
    label: "\uB178\uB780 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
    outputKey: "magicPowderYellow",
    inputs: { "butterfly:yellow": 10 }
  },
  {
    id: "powderWhite",
    label: "\uD558\uC580 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
    outputKey: "magicPowderWhite",
    inputs: { "butterfly:white": 10 }
  },
  {
    id: "powderBrown",
    label: "\uAC08\uC0C9 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
    outputKey: "magicPowderBrown",
    inputs: { "butterfly:brown": 10 }
  },
  {
    id: "powderMixed",
    label: "\uB9C8\uBC95\uC758 \uAC00\uB8E8",
    outputKey: "magicPowder",
    inputs: { "butterfly:brown": 3, "butterfly:yellow": 3, "butterfly:white": 3 }
  },
  {
    id: "craftChair",
    label: "\uC758\uC790",
    outputKey: "craftChair",
    inputs: { rock: 5, seed: 5 }
  },
  {
    id: "craftDesk",
    label: "\uCC45\uC0C1",
    outputKey: "craftDesk",
    inputs: { rock: 7, seed: 7 }
  },
  {
    id: "craftHouse",
    label: "\uC9D1",
    outputKey: "craftHouse",
    inputs: { apple: 3, rock: 30, seed: 10 }
  }
];

export const CRAFT_FURNITURE_KEYS = ["craftDesk", "craftChair", "craftHouse"];

export const ALCHEMY_CRAFT_INPUT_KEYS = new Set([
  "rock",
  "seed",
  "overgrowthSeed",
  "apple",
  "magicPowder",
  "butterfly:brown",
  "butterfly:yellow",
  "butterfly:white"
]);

export function getAlchemyCraftRecipeById(recipeId) {
  return ALCHEMY_CRAFT_RECIPES.find(function (r) {
    return r.id === recipeId;
  });
}

/** @typedef {{ key: string, required: number }} AlchemyRequirementSlotDef */

/** @returns {AlchemyRequirementSlotDef[]} */
export function buildAlchemyRequirementSlots(recipe) {
  if (!recipe) return [];
  return Object.keys(recipe.inputs)
    .map(function (key) {
      return {
        key: key,
        required: Math.max(0, Math.floor(Number(recipe.inputs[key]) || 0))
      };
    })
    .filter(function (def) {
      return def.required > 0;
    });
}

/** @param {AlchemyRequirementSlotDef[]} slotDefs @param {number[]} slotFills */
/** @param {{ key: string, required: number }[]} slotDefs @param {number[]} slotFills */
export function formatAlchemyRequirementSummary(slotDefs, slotFills, getLabel) {
  if (!slotDefs.length) return { text: "", allComplete: true };
  const parts = [];
  slotDefs.forEach(function (def, index) {
    const filled = Math.max(0, Math.floor(Number(slotFills[index]) || 0));
    const remaining = def.required - filled;
    if (remaining <= 0) return;
    const label = getLabel(def.key);
    parts.push(label + " " + remaining + "\uAC1C");
  });
  if (!parts.length) {
    return { text: "\uD544\uC694\uD55C \uC7AC\uB8CC\uB97C \uBAA8\uB450 \uCC44\uC6E0\uC2B5\uB2C8\uB2E4.", allComplete: true };
  }
  return { text: parts.join(", ") + " \uD544\uC694", allComplete: false };
}

export function alchemySlotsAreComplete(slotDefs, slotFills) {
  if (!slotDefs.length) return false;
  if (slotFills.length !== slotDefs.length) return false;
  for (let i = 0; i < slotDefs.length; i++) {
    if ((Number(slotFills[i]) || 0) < slotDefs[i].required) return false;
  }
  return true;
}
