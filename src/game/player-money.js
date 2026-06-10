import { TRADE_INPUT_ANY_BUTTERFLY } from "./trade-exchange.js";

export const playerMoneyKrwKey = "playerMoneyKrwV1";
export const DEFAULT_PLAYER_MONEY_KRW = 100;

/** 식물의 달인 씨앗 구매 단가(원) */
export const PLANT_MASTER_SEED_BUY_PRICE_KRW = 10;

/** @type {Record<string, number>} NPC가 아이템을 살 때 지급하는 단가(원) */
export const TRADE_ITEM_SELL_PRICE_KRW = {
  rock: 40,
  seed: 60,
  overgrowthSeed: 200,
  apple: 120,
  magicPowder: 80,
  magicPowderYellow: 100,
  magicPowderWhite: 100,
  magicPowderBrown: 100,
  "butterfly:brown": 35,
  "butterfly:yellow": 40,
  "butterfly:white": 45
};

/** @type {Record<string, number>} NPC에게 아이템을 살 때 지불하는 단가(원) */
export const TRADE_ITEM_BUY_PRICE_KRW = {
  rock: 60,
  seed: 90,
  overgrowthSeed: 280,
  apple: 180,
  magicPowder: 120,
  magicPowderYellow: 150,
  magicPowderWhite: 150,
  magicPowderBrown: 150,
  "butterfly:brown": 50,
  "butterfly:yellow": 58,
  "butterfly:white": 65,
  worldBucket: 350
};

export function formatPlayerMoneyKrw(amount) {
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  return n.toLocaleString("ko-KR") + "\uC6D0";
}

export function normalizePlayerMoneyKrw(amount) {
  return Math.max(0, Math.floor(Number(amount) || 0));
}

/** @param {(key: string) => string | null} getStoredValue */
export function loadPlayerMoneyKrw(getStoredValue) {
  const raw = getStoredValue(playerMoneyKrwKey);
  if (raw == null || raw === "") {
    return DEFAULT_PLAYER_MONEY_KRW;
  }
  return normalizePlayerMoneyKrw(raw);
}

/** @param {(key: string, value: string) => void} setStoredValue */
export function savePlayerMoneyKrw(setStoredValue, amount) {
  setStoredValue(playerMoneyKrwKey, String(normalizePlayerMoneyKrw(amount)));
}

/**
 * @param {string} itemKey
 * @param {"sell"|"buy"} mode
 */
export function getTradeItemUnitPriceKrw(itemKey, mode) {
  const map =
    mode === "buy" ? TRADE_ITEM_BUY_PRICE_KRW : TRADE_ITEM_SELL_PRICE_KRW;
  if (map[itemKey] != null) return Math.max(0, Math.floor(map[itemKey]));
  if (itemKey === TRADE_INPUT_ANY_BUTTERFLY) {
    return Math.max(0, Math.floor(map["butterfly:brown"] || 0));
  }
  return 0;
}

/** @param {Record<string, number>} counts @param {"sell"|"buy"} mode */
export function sumTradeItemCountsValueKrw(counts, mode) {
  let total = 0;
  Object.keys(counts || {}).forEach(function (key) {
    const n = Math.max(0, Math.floor(Number(counts[key]) || 0));
    if (n <= 0) return;
    total += getTradeItemUnitPriceKrw(key, mode) * n;
  });
  return total;
}

/**
 * 교환 확정 시 자산 변동: 판매(내가 넣는 재료) − 구매(내가 받는 결과물)
 * @param {Record<string, number>} inputCounts
 * @param {Record<string, number>} outputCounts
 */
export function computeTradeMoneyDeltaKrw(inputCounts, outputCounts) {
  const sellTotal = sumTradeItemCountsValueKrw(inputCounts, "sell");
  const buyTotal = sumTradeItemCountsValueKrw(outputCounts, "buy");
  return sellTotal - buyTotal;
}
