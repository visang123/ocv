/** 가방 bagType → 성숙 형태(4·5단 스프라이트·이름) */
export const MAGIC_POWDER_BAG_TYPES = [
  "magicPowder",
  "magicPowderMixed",
  "magicPowderYellow",
  "magicPowderWhite",
  "magicPowderBrown"
];

/** @type {Record<string, "grass"|"flower">} */
export const MAGIC_POWDER_MATURE_KIND = {
  magicPowder: "grass",
  magicPowderMixed: "grass",
  magicPowderYellow: "flower",
  magicPowderWhite: "grass",
  magicPowderBrown: "grass"
};

/** @type {Record<string, "yellow"|"white"|"brown"|"mixed"|null>} */
export const COLORED_POWDER_COUNT_FIELD = {
  magicPowderYellow: "yellow",
  magicPowderWhite: "white",
  magicPowderBrown: "brown",
  magicPowderMixed: "mixed"
};

export function isMagicPowderBagType(bagType) {
  return MAGIC_POWDER_BAG_TYPES.includes(bagType);
}

export function normalizePlantMatureKind(kind) {
  return kind === "flower" ? "flower" : "grass";
}

export function isFlowerMaturePlant(plant) {
  return normalizePlantMatureKind(plant && plant.matureKind) === "flower";
}

export function getMatureKindForPowderBagType(bagType) {
  return MAGIC_POWDER_MATURE_KIND[bagType] || "grass";
}

export function getColoredPowderCountField(bagType) {
  return COLORED_POWDER_COUNT_FIELD[bagType] || null;
}
