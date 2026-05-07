export const HELD_ITEM_SEED = "seed";
export const HELD_ITEM_BUCKET = "bucket";
export const HELD_ITEM_EXTRA_SEED_PREFIX = "extra-seed:";

export function isHeldExtraSeed(value) {
  return Boolean(value) && value.startsWith(HELD_ITEM_EXTRA_SEED_PREFIX);
}

export function createHeldExtraSeed(id) {
  return HELD_ITEM_EXTRA_SEED_PREFIX + id;
}

export function getHeldExtraSeedId(value) {
  if (!isHeldExtraSeed(value)) return null;
  return value.slice(HELD_ITEM_EXTRA_SEED_PREFIX.length);
}
