/** Systems — 플레이어 체력 틱. */
import { tickPlayerHealthState } from "../../game/player-health.js";

export function createModule(d) {
  function getLocalPlayerBodyWidth() {
  return d.getPlayer().sittingChairId ? d.PLAYER_SIT_WIDTH : d.PLAYER_WIDTH;
  }

  function getPlayerCenterX() {
  return d.getPlayer().x + d.getLocalPlayerBodyWidth() / 2;
  }

  function getPlayerFootY() {
  return d.GROUND_WORLD_HEIGHT - d.getPlayer().depth + d.getPlayer().jumpY;
  }

  function getPlayerHealthTickContext(healthPosePrev) {
  return {
    hasSpawnedCharacter: d.hasSpawnedCharacter,
    isCharacterSelecting: d.isCharacterSelecting,
    isTabSessionSuperseded: d.isTabSessionSuperseded,
    health: d.getPlayer().health,
    keys: d.keys,
    isSittingOnChair: Boolean(d.getPlayer().sittingChairId),
    isInsideEnteredCraftHouse: d.isPlayerInsideEnteredCraftHouse(),
    isPlanting: Boolean(d.getPlant().isPlanting),
    isEating: Boolean(d.getApple().isEating),
    isRockMining: Boolean(String(d.getPlayer().rockMiningRockId || "")),
    isTradeExchangeOpen: d.isTradeExchangeOpen(),
    isAlchemyCraftOpen: d.isAlchemyCraftOpen(),
    isPlantMasterSeedShopOpen:
      d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen(),
    isGameplayBlockedByNpcDialogue: d.isPlayerGameplayBlockedByNpcDialogue(),
    velocityY: d.getPlayer().velocityY,
    previousPose: healthPosePrev,
    currentPose: { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY },
    footCenterX: d.getPlayerCenterX(),
    footY: d.getPlayerFootY(),
    placedCraftFurniture: d.placedCraftFurniture
  };
  }

  function isPlayerGameplayBlockedByNpcDialogue() {
  if (d.getNpc().isDialogueRunning) return true;
  if (d.isTradeExchangeOpen() || d.isAlchemyCraftOpen()) return false;
  if (d.isPlantMasterSeedShopOpen && d.isPlantMasterSeedShopOpen()) return false;
  return d.isTradeMasterDialogueRunning() || d.isAlchemyMasterDialogueRunning();
  }

  function isPlayerInsideEnteredCraftHouse() {
  return Boolean(d.getPlayer().insideCraftHouseId);
  }

  function savePlayerHealthState() {
  d.setStoredValue(
    d.playerHealthKey,
    JSON.stringify({
      health: d.clampPlayerHealth(d.getPlayer().health),
      lastTickAt: d.getPlayer().lastHealthTickAt || 0,
      gaugeVisible: Boolean(d.getPlayer().healthGaugeVisible),
      savedAt: Date.now()
    })
  );
  }

  function tickPlayerHealth(nowMs) {
  if (!d.hasSpawnedCharacter || d.isCharacterSelecting || d.isTabSessionSuperseded) return;

  const healthBefore = d.getPlayer().health;
  const healthPosePrev = d.getPlayer().healthPoseInitialized
    ? d.getPlayer().healthPosePrev
    : { x: d.getPlayer().x, depth: d.getPlayer().depth, jumpY: d.getPlayer().jumpY };
  const ctx = d.getPlayerHealthTickContext(healthPosePrev);
  const shouldDrain = d.shouldDrainPlayerHealth(ctx);
  const result = tickPlayerHealthState(
    {
      health: d.getPlayer().health,
      lastTickAt: d.getPlayer().lastHealthTickAt,
      idleRechargeSince: d.getPlayer().idleRechargeSince,
      idleRechargeHealTicks: d.getPlayer().idleRechargeHealTicks,
      healthDrainDebt: d.getPlayer().healthDrainDebt,
      shouldDrain: shouldDrain,
      wasDraining: d.getPlayer().wasDrainingHealth,
      rechargeContext: {
        footCenterX: ctx.footCenterX,
        footY: ctx.footY,
        placedCraftFurniture: ctx.placedCraftFurniture,
        isSittingOnChair: ctx.isSittingOnChair,
        isInsideEnteredCraftHouse: ctx.isInsideEnteredCraftHouse
      }
    },
    nowMs
  );
  d.getPlayer().wasDrainingHealth = shouldDrain;
  d.getPlayer().health = result.health;
  d.getPlayer().lastHealthTickAt = result.lastTickAt;
  if (result.idleRechargeSince != null) {
    d.getPlayer().idleRechargeSince = Number(result.idleRechargeSince) || 0;
  }
  if (result.idleRechargeHealTicks != null) {
    d.getPlayer().idleRechargeHealTicks = Number(result.idleRechargeHealTicks) || 0;
  }
  if (result.healthDrainDebt != null) {
    d.getPlayer().healthDrainDebt = Number(result.healthDrainDebt) || 0;
  }
  if (result.changed) {
    d.savePlayerHealthState();
  }
  if (
    d.isPlayerHealthDepleted(d.getPlayer().health) &&
    !d.isPlayerHealthDepleted(healthBefore)
  ) {
    d.cancelTradeOnPlayerHealthDepleted();
    if (typeof d.cancelPlantMasterSeedShopOnPlayerHealthDepleted === "function") {
      d.cancelPlantMasterSeedShopOnPlayerHealthDepleted();
    }
  }
  }

  return {
    getLocalPlayerBodyWidth,
    getPlayerCenterX,
    getPlayerFootY,
    getPlayerHealthTickContext,
    isPlayerGameplayBlockedByNpcDialogue,
    isPlayerInsideEnteredCraftHouse,
    savePlayerHealthState,
    tickPlayerHealth,
  };
}
