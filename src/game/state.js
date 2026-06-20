import {
  WORLD_LOOSE_SEED_X,
  WORLD_LOOSE_SEED_Y,
  BIG_TREE_X,
  BIG_TREE_Y,
  MAP_VISUAL_SCALE,
  TREE_APPLE_SIZE,
  SIGN_START_X,
  SIGN_START_Y,
  GUIDE_BOOK_START_X,
  GUIDE_BOOK_START_Y,
  WORLD_BAG_START_X,
  WORLD_BAG_START_Y,
  NPC_START_X,
  NPC_START_Y,
  maxWellWater
} from "./constants.js";
import { PLAYER_MAX_HEALTH } from "./player-health.js";
import {
  shouldApplyIncomingRemoteState
} from "../multiplayer/presence.js";
import {
  getRemoteStateSourceRank,
  getRemoteStateVersion,
  isValidRemotePlayerStatePayload
} from "../multiplayer/syncCore.js";

export function createWellState(maxWellWaterValue) {
  return {
    water: maxWellWaterValue,
    lastRefillAt: Date.now(),
    lastStateChangeAt: 0,
    upgradeLevel: 0,
    donationKrw: 0
  };
}

export function createAppleState(initialApples) {
  return {
    count: 0,
    /** 월드 허브 땅 씨 줍기 누적 — 튜토 extraSeeds와 별개(groundSeed.js). */
    seedCount: 0,
    overgrowthSeedCount: 0,
    pickedIds: [],
    isEating: false,
    nextSeedOffset: 0,
    extraSeeds: [],
    extraPlants: [],
    lastSpawnAt: Date.now(),
    apples: initialApples,
    worldLooseSeed: {
      x: WORLD_LOOSE_SEED_X,
      y: WORLD_LOOSE_SEED_Y,
      nextSpawnAt: 0
    },
    worldRocks: [],
    worldRockPickedIds: [],
    worldExtraBuckets: [],
    worldBagDrops: [],
    lastStateChangeAt: 0
  };
}

export function createPlantState() {
  return {
    isSeedPlanted: false,
    isPlanting: false,
    seedCreatedAt: Date.now(),
    isSeedDry: false,
    spotX: 0,
    spotY: 0,
    lastWateredAt: null,
    wateredAtList: [],
    status: "normal",
    waterLevel: 1,
    waterLevelUpdatedAt: Date.now(),
    becameEmptyAt: null,
    isOverwatered: false,
    rottenAt: null,
    needsFirstWater: false,
    growthStartedAt: null,
    isSproutGrown: false,
    sproutGrownAt: null,
    sproutEvolutionMs: 0,
    sproutEvolutionLastTickAt: null,
    isSproutSelfSustaining: false,
    growthTier: 0,
    waterCapacity: 2,
    powderUpgradeTargetTier: 0,
    powderUpgradeStartedAt: null,
    powderUpgradeDurationMs: 0,
    grassAuto5EligibleAt: null,
    /** 심은 시각(ms). 살아 있는 새싹/풀 번호 정렬에 사용( rotten/dry 등은 제외). */
    plantedAt: null,
    ownerUserId: "",
    ownerDisplayName: "",
    soilOrdinal: 0,
    sproutOrdinal: 0,
    grassOrdinal: null,
    /** 4·5단 성숙 형태: grass | flower | tree | cactus */
    matureKind: "",
    flowerOrdinal: null,
    treeOrdinal: null,
    cactusOrdinal: null,
    /** 마른 땅(작물 고사) 이후에는 물만으로 새싹 타이머가 다시 시작되지 않음 — 새로 심을 때만 false */
    blockSproutRegrowthAfterDry: false,
    /** status가 dry로 바뀐 시각(ms). plantDrySoilClearMs 후 칸 제거 */
    drySoilAt: null,
    seedKind: "",
    plantGoldKrw: 0,
    plantGoldUpdatedAt: null,
    /** 로컬 식물 저장·스냅샷 병합 가드(ms) */
    lastMainPlantStateChangeAt: 0
  };
}

export function createDefaultTreeApples() {
  const layout = [
    [31, 45],
    [76, 21],
    [112, 52],
    [54, 82],
    [96, 83],
    [42, 28],
    [98, 38],
    [68, 58]
  ];
  return layout.map(function (pos, index) {
    const localX = pos[0];
    const localY = pos[1];
    return {
      id: "apple-" + (index + 1),
      localX,
      localY,
      x: BIG_TREE_X + localX / MAP_VISUAL_SCALE,
      y: BIG_TREE_Y + localY / MAP_VISUAL_SCALE,
      size: TREE_APPLE_SIZE
    };
  });
}

export function createPlayerState(initialX = 100) {
  return {
    x: initialX,
    depth: 0,
    jumpY: 0,
    velocityY: 0,
    isOnGround: true,
    health: PLAYER_MAX_HEALTH,
    lastHealthTickAt: 0,
    wasDrainingHealth: false,
    idleRechargeSince: 0,
    idleRechargeHealTicks: 0,
    healthDrainDebt: 0,
    healthGaugeVisible: true,
    sittingChairId: "",
    insideCraftHouseId: "",
    outsideCraftHousePose: null,
    healthPosePrev: { x: 0, depth: 0, jumpY: 0 },
    healthPoseInitialized: false,
    wasInTree: false,
    isTreeFalling: false,
    lastPositionSavedAt: 0,
    lastMovementTickMs: 0,
    rockMiningRockId: "",
    rockMiningStartedAt: 0
  };
}

export function createWorldItemsState() {
  return {
    seedX: 0,
    seedY: 20,
    bucketX: 0,
    bucketY: 0,
    wellX: 0,
    wellY: 0,
    signX: SIGN_START_X,
    signY: SIGN_START_Y,
    guideBookX: GUIDE_BOOK_START_X,
    guideBookY: GUIDE_BOOK_START_Y,
    worldBagX: WORLD_BAG_START_X,
    worldBagY: WORLD_BAG_START_Y,
    hasGuideBook: false,
    isGuideBookOpen: false,
    isGuideDismissedAtSign: false,
    isGuideBookClickPromptActive: false
  };
}

export function createInventoryState() {
  return {
    heldItem: null,
    isBucketFull: false,
    heldBucketId: "",
    heldExtraBucketMainX: 0,
    heldExtraBucketMainY: 0,
    heldExtraBucketMainIsFull: false,
    mainBucketParkedX: 0,
    mainBucketParkedY: 0,
    mainBucketParkedIsFull: false,
    plantingInventorySeedId: null
  };
}

export function createSeedWorldState() {
  return {
    hasHandledDryMainSeed: false,
    isMainSeedAvailable: true,
    hasPickedMainSeedThisWindow: false,
    lastMainSeedStateChangeAt: 0,
    dryMainSeedVisibleSince: 0,
    isHoveringMainSeed: false,
    lastPickupToggleAt: 0,
    lastWorldRockRespawnAt: 0,
    lastWorldRockPickupAt: 0,
    lastBucketPickupAt: 0,
    hasShownFirstSeedFocus: false,
    firstSeedFocusTimeout: null
  };
}

export function createNpcState() {
  return {
    x: NPC_START_X,
    y: NPC_START_Y,
    isDialogueRunning: false,
    isDialogueComplete: false,
    isGuidePlantPageUnlocked: false,
    guidePageIndex: 0,
    promptHideTimeout: null
  };
}

export function createCameraState() {
  return {
    x: 0,
    y: 0,
    zoom: 3.5,
    hasInitializedZoom: false
  };
}

export function createOnboardingState() {
  return {
    flowStep: 1,
    jumpLatch: false,
    npcGuideEscHintShown: false,
    congratsTimerId: null,
    treeLeaveHintTimerId: null,
    finalHideTimerId: null,
    butterflyCountBaseline: null,
    tutorialEnteredTree: false,
    seedTutorialSecondLine: false,
    postAppleSeedIntroPhase: 0,
    fruitIntroTimerId: null,
    postWaterCongratsPhase: 0,
    waterDoneCongratsStartedAt: 0,
    plantIndexIntroPhase: 0,
    plantIndexIntroTimerId: null,
    plantIndexAwaitingSprout: false,
    inventoryIntroPhase: 0,
    inventoryCloseHintTimerId: null,
    bookInvPhase: 0,
    bookGuideIntroTimerId: null,
    tutorialRockMounted: false,
    tutorialMainSeedRespawnTimerId: null,
    tutorialMainSeedRespawnDueAt: 0,
    tutorialMainSeedRegenCompleted: false,
    step26OpenedSettingsWithEsc: false,
    tutorialWorldNeedsFullReset: false
  };
}

export function createGameState(options = {}) {
  return {
    player: createPlayerState(options.playerX),
    plant: createPlantState(),
    apple: createAppleState(options.initialApples ?? createDefaultTreeApples()),
    well: createWellState(options.maxWellWater ?? maxWellWater),
    worldItems: createWorldItemsState(),
    inventory: createInventoryState(),
    seedWorld: createSeedWorldState(),
    npc: createNpcState(),
    camera: createCameraState(),
    onboarding: createOnboardingState()
  };
}

/** 심기/월드 리셋 시 식물 런타임 필드를 초기값으로 되돌린다. */
export function resetPlantRuntimeFields(plant, waterLevelUpdatedAt) {
  plant.isSeedPlanted = false;
  plant.isPlanting = false;
  plant.spotX = 0;
  plant.spotY = 0;
  plant.lastWateredAt = null;
  plant.wateredAtList = [];
  plant.status = "normal";
  plant.waterLevel = 1;
  plant.waterLevelUpdatedAt = waterLevelUpdatedAt;
  plant.becameEmptyAt = null;
  plant.isOverwatered = false;
  plant.rottenAt = null;
  plant.needsFirstWater = false;
  plant.growthStartedAt = null;
  plant.isSproutGrown = false;
  plant.sproutGrownAt = null;
  plant.sproutEvolutionMs = 0;
  plant.sproutEvolutionLastTickAt = null;
  plant.isSproutSelfSustaining = false;
  plant.growthTier = 0;
  plant.waterCapacity = 2;
  plant.powderUpgradeTargetTier = 0;
  plant.powderUpgradeStartedAt = null;
  plant.powderUpgradeDurationMs = 0;
  plant.grassAuto5EligibleAt = null;
  plant.plantedAt = null;
  plant.ownerUserId = "";
  plant.ownerDisplayName = "";
  plant.soilOrdinal = 0;
  plant.sproutOrdinal = 0;
  plant.grassOrdinal = null;
  plant.matureKind = "";
  plant.flowerOrdinal = null;
  plant.treeOrdinal = null;
  plant.cactusOrdinal = null;
  plant.blockSproutRegrowthAfterDry = false;
  plant.drySoilAt = null;
  plant.seedKind = "";
  plant.plantGoldKrw = 0;
  plant.plantGoldUpdatedAt = null;
}

export function resetInventoryRuntimeFields(inventory) {
  inventory.heldItem = null;
  inventory.isBucketFull = false;
  inventory.heldBucketId = "";
  inventory.heldExtraBucketMainX = 0;
  inventory.heldExtraBucketMainY = 0;
  inventory.heldExtraBucketMainIsFull = false;
  inventory.mainBucketParkedX = 0;
  inventory.mainBucketParkedY = 0;
  inventory.mainBucketParkedIsFull = false;
  inventory.plantingInventorySeedId = null;
}

let gameState = null;

export function initGameState(options = {}) {
  gameState = createGameState(options);
  return gameState;
}

function requireGameState() {
  if (!gameState) {
    throw new Error("Game state not initialized. Call initGameState() first.");
  }
  return gameState;
}

export function getGameState() {
  return requireGameState();
}

export function getPlayer() {
  return requireGameState().player;
}

export function getPlant() {
  return requireGameState().plant;
}

export function getApple() {
  return requireGameState().apple;
}

export function getWell() {
  return requireGameState().well;
}

export function getWorldItems() {
  return requireGameState().worldItems;
}

export function getInventory() {
  return requireGameState().inventory;
}

export function getSeedWorld() {
  return requireGameState().seedWorld;
}

export function getNpc() {
  return requireGameState().npc;
}

export function getCamera() {
  return requireGameState().camera;
}

export function getOnboarding() {
  return requireGameState().onboarding;
}

/**
 * Pure remote-player state (no DOM). Multiplayer network feeds payloads here;
 * the game loop / view layer reads and renders separately.
 */
export function createRemotePlayerStateStore() {
  const players = Object.create(null);
  const sessionIdsLastSeen = Object.create(null);
  const sessionButterflyActive = Object.create(null);

  function markSessionSeen(sessionId, butterflyActive, seenAtMs) {
    const id = String(sessionId || "");
    if (!id) return;
    const at = Math.max(0, Number(seenAtMs) || Date.now());
    sessionIdsLastSeen[id] = at;
    sessionButterflyActive[id] = butterflyActive !== false;
  }

  function clearSessionTracking() {
    Object.keys(sessionIdsLastSeen).forEach(function (sid) {
      delete sessionIdsLastSeen[sid];
    });
    Object.keys(sessionButterflyActive).forEach(function (sid) {
      delete sessionButterflyActive[sid];
    });
  }

  function removeSession(sessionId) {
    const id = String(sessionId || "");
    if (!id) return;
    delete sessionIdsLastSeen[id];
    delete sessionButterflyActive[id];
  }

  function getPlayer(remoteId) {
    return players[String(remoteId || "")] || null;
  }

  function getPlayers() {
    return players;
  }

  function remove(remoteId) {
    const id = String(remoteId || "");
    if (!players[id]) return false;
    delete players[id];
    return true;
  }

  function pruneStale(nowMs, maxIdleMs) {
    const now = Math.max(0, Number(nowMs) || Date.now());
    const maxIdle = Math.max(1000, Number(maxIdleMs) || 90000);
    const removed = [];
    Object.keys(players).forEach(function (remoteId) {
      const player = players[remoteId];
      if (!player || !player.lastSeenAt) return;
      if (now - player.lastSeenAt < maxIdle) return;
      delete players[remoteId];
      removed.push(remoteId);
    });
    return removed;
  }

  function applyIncoming(state, source) {
    if (!isValidRemotePlayerStatePayload(state) || !state.id) {
      return { kind: "skip" };
    }
    const remoteId = String(state.id);

    if (state.action === "leave") {
      remove(remoteId);
      removeSession(remoteId);
      return { kind: "leave", remoteId: remoteId };
    }

    markSessionSeen(remoteId, state.butterflyActive, Date.now());

    const incomingVersion = getRemoteStateVersion(state);
    const incomingRank = getRemoteStateSourceRank(source);
    const existing = players[remoteId];
    const currentVersion = Number(existing && existing.lastStateVersion) || 0;
    const currentRank = Number(existing && existing.lastStateSourceRank) || 0;

    if (
      !shouldApplyIncomingRemoteState(
        { version: currentVersion, rank: currentRank },
        { version: incomingVersion, rank: incomingRank }
      )
    ) {
      return { kind: "reject", remoteId: remoteId };
    }

    const statusAction =
      typeof state.action === "string" &&
      state.action !== "" &&
      state.action !== "watering" &&
      state.action !== "state"
        ? state.action
        : "";

    const next = {
      id: remoteId,
      userId: state.userId != null ? String(state.userId) : "",
      name: state.name || "OVC",
      color: state.color || "#7dd3fc",
      x: Number(state.x) || 0,
      depth: Number(state.depth) || 0,
      jumpY: Number(state.jumpY) || 0,
      sittingChairId: String(state.sittingChairId || ""),
      insideCraftHouseId: String(state.insideCraftHouseId || ""),
      action: statusAction,
      rockMiningRockId:
        statusAction === "rock_mining" ? String(state.rockMiningRockId || "") : "",
      rockMiningStartedAt:
        statusAction === "rock_mining" ? Number(state.rockMiningStartedAt) || 0 : 0,
      waterSplashAt: Number(state.waterSplashAt || 0),
      waterSplashX: Number(state.waterSplashX),
      waterSplashY: Number(state.waterSplashY),
      lastStateVersion:
        incomingVersion > 0 ? incomingVersion : Number(existing && existing.lastStateVersion) || 0,
      lastStateSourceRank:
        incomingVersion > 0 ? incomingRank : Number(existing && existing.lastStateSourceRank) || 0,
      lastSeenAt: Date.now(),
      lastWaterSplashAt: Number(existing && existing.lastWaterSplashAt) || 0,
      lastActionAt: Number(existing && existing.lastActionAt) || 0,
      lastShownAction: String(existing && existing.lastShownAction) || ""
    };

    if (statusAction) {
      next.lastActionAt = Date.now();
      next.lastShownAction = statusAction;
    }

    players[remoteId] = next;
    return { kind: "applied", remoteId: remoteId, player: next };
  }

  return {
    getPlayers: getPlayers,
    getPlayer: getPlayer,
    remove: remove,
    applyIncoming: applyIncoming,
    pruneStale: pruneStale,
    markSessionSeen: markSessionSeen,
    removeSession: removeSession,
    clearSessionTracking: clearSessionTracking,
    sessionIdsLastSeen: sessionIdsLastSeen,
    sessionButterflyActive: sessionButterflyActive
  };
}
