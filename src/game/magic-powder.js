/** 가방 bagType → 성숙 형태(4·5단 스프라이트·이름) */
export const MAGIC_POWDER_BAG_TYPES = [
  "magicPowder",
  "magicPowderYellow",
  "magicPowderWhite",
  "magicPowderBrown"
];

/** @typedef {"grass"|"flower"|"tree"|"cactus"} PlantMatureKind */

/** @type {Record<string, PlantMatureKind>} */
export const MAGIC_POWDER_MATURE_KIND = {
  magicPowder: "grass",
  magicPowderYellow: "flower",
  magicPowderWhite: "cactus",
  magicPowderBrown: "tree"
};

/** @type {Record<string, "yellow"|"white"|"brown"|null>} */
export const COLORED_POWDER_COUNT_FIELD = {
  magicPowderYellow: "yellow",
  magicPowderWhite: "white",
  magicPowderBrown: "brown"
};

/** 혼합 가루는 기본 마법의 가루와 동일 아이템 */
export function normalizeMagicPowderBagType(bagType) {
  return bagType === "magicPowderMixed" ? "magicPowder" : bagType;
}

export function isMagicPowderBagType(bagType) {
  return MAGIC_POWDER_BAG_TYPES.includes(bagType);
}

export function normalizePlantMatureKind(kind) {
  const k = String(kind || "").trim();
  if (k === "flower" || k === "tree" || k === "cactus") return k;
  return "grass";
}

export function isFlowerMaturePlant(plant) {
  return normalizePlantMatureKind(plant && plant.matureKind) === "flower";
}

export function isTreeMaturePlant(plant) {
  return normalizePlantMatureKind(plant && plant.matureKind) === "tree";
}

export function isCactusMaturePlant(plant) {
  return normalizePlantMatureKind(plant && plant.matureKind) === "cactus";
}

/** 노랑·갈색·하양 가루 4·5단(꽃·나무·선인장) — 풀과 달리 spot 작은 링 대신 스프라이트 기준 호버 */
export function isColoredMaturePlant(plant) {
  const k = normalizePlantMatureKind(plant && plant.matureKind);
  return k === "flower" || k === "tree" || k === "cactus";
}

/** 풀·나무 — 4·5단 수분·자동 성장 규칙 동일 */
export function isGrassLikeMaturePlant(plant) {
  const k = normalizePlantMatureKind(plant && plant.matureKind);
  return k === "grass" || k === "tree";
}

export function getMatureKindForPowderBagType(bagType) {
  return MAGIC_POWDER_MATURE_KIND[bagType] || "grass";
}

export function getColoredPowderCountField(bagType) {
  return COLORED_POWDER_COUNT_FIELD[bagType] || null;
}
