/** @typedef {{ id: string, label: string, outputKey: string, inputs: Record<string, number> }} AlchemyCraftRecipe */

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
    label: "\uD63C\uD569 \uB9C8\uBC95\uC758 \uAC00\uB8E8",
    outputKey: "magicPowderMixed",
    inputs: { "butterfly:brown": 3, "butterfly:yellow": 3, "butterfly:white": 3 }
  },
  {
    id: "craftChair",
    label: "\uC758\uC790",
    outputKey: "craftChair",
    inputs: { rock: 4 }
  },
  {
    id: "craftFence",
    label: "\uC6B8\uD0C0\uB9AC",
    outputKey: "craftFence",
    inputs: { rock: 3, seed: 1 }
  },
  {
    id: "craftDesk",
    label: "\uCC45\uC0C1",
    outputKey: "craftDesk",
    inputs: { rock: 2, magicPowder: 1, apple: 1 }
  },
  {
    id: "craftHouse",
    label: "\uC9D1",
    outputKey: "craftHouse",
    inputs: { rock: 6, magicPowder: 2, seed: 2, apple: 1 }
  }
];

export const CRAFT_FURNITURE_KEYS = ["craftDesk", "craftFence", "craftChair", "craftHouse"];

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

/** @returns {{ key: string }[]} */
export function buildAlchemyRequirementSlots(recipe) {
  if (!recipe) return [];
  const slots = [];
  Object.keys(recipe.inputs).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(recipe.inputs[key]) || 0));
    for (let i = 0; i < n; i++) {
      slots.push({ key: key });
    }
  });
  return slots;
}

/** @param {({ key: string } | null)[]} slotFills */
export function alchemySlotsAreComplete(slotDefs, slotFills) {
  if (!slotDefs.length) return false;
  if (slotFills.length !== slotDefs.length) return false;
  for (let i = 0; i < slotDefs.length; i++) {
    if (!slotFills[i]) return false;
  }
  return true;
}
