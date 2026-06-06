/** View — 사과·바위·우물·씨앗·가방 DOM. */

export function createModule(d) {
  function createRandomApples(count) {
  return Array.from({ length: count }, function (_, index) {
    return d.createRandomApple("apple-" + (index + 1));
  });
  }

  function createRandomWorldRocks(ctx) {
  const size = d.WORLD_ROCK_SIZE;
  const rocks = [];
  for (let i = 0; i < d.WORLD_LOOSE_ROCK_COUNT; i += 1) {
    const pos = d.pickRandomWorldRockSpawnPosition(size, ctx, rocks);
    if (!pos) continue;
    rocks.push({
      id: "ground-rock-" + (i + 1),
      x: pos.x,
      y: pos.y,
      size: size
    });
  }
  return rocks;
  }

  function loadRockInventoryCount() {
  const raw = Number(d.getStoredValue(d.rockInventoryCountKey) || 0);
  d.rockInventoryCount = Math.max(0, Math.floor(raw));
  }

  function loadPlayerMoneyKrw() {
  d.playerMoneyKrw = d.loadPlayerMoneyKrwFromStorage(d.getStoredValue);
  }

  function savePlayerMoneyKrw() {
  d.savePlayerMoneyKrwToStorage(d.setStoredValue, d.playerMoneyKrw);
  }

  function rebuildPlacedCraftFurnitureDom() {
  if (!d.ground) return;
  d.ground.querySelectorAll(".world-craft-furniture").forEach(function (node) {
    node.remove();
  });
  if (!d.isWorldDocumentEntry()) return;
  const insertBeforeEl = d.getCraftFurnitureInsertBeforeEl();
  d.placedCraftFurniture.forEach(function (entry) {
    const spec = d.getCraftFurnitureWorldSpec(entry.kind);
    if (!spec) return;
    const el = document.createElement("img");
    el.className =
      "world-craft-furniture world-craft-furniture--" +
      entry.kind.replace(/^craft/, "").toLowerCase();
    if (!spec.src) return;
    el.src = spec.src;
    el.alt = "";
    el.draggable = false;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      d.ground.insertBefore(el, insertBeforeEl);
    } else {
      d.ground.appendChild(el);
    }
    entry._el = el;
  });
  updatePlacedCraftFurnitureDom();
  }

  function rebuildWorldBagDropDom() {
  if (!d.ground) return;
  d.ensureWorldBagDropsArray();
  d.ground.querySelectorAll(".world-bag-drop").forEach(function (node) {
    node.remove();
  });
  d.getApple().worldBagDrops.forEach(function (drop) {
    drop._el = null;
  });
  d.updateWorldBagDropDom(true);
  }

  function rebuildWorldRockDom() {
  if (!d.ground) return;
  d.ground.querySelectorAll(".world-ground-rock").forEach(function (node) {
    node.remove();
  });
  if (!d.isWorldDocumentEntry() || !Array.isArray(d.getApple().worldRocks)) return;
  const insertBeforeEl =
    d.localPlayerRoot && d.localPlayerRoot.parentNode === d.ground
      ? d.localPlayerRoot
      : d.player && d.player.parentNode === d.ground
        ? d.player
        : null;
  d.getApple().worldRocks.forEach(function (rock) {
    const el = document.createElement("div");
    el.className = "world-ground-rock";
    el.dataset.rockId = rock.id;
    el.setAttribute("aria-hidden", "true");
    if (insertBeforeEl) {
      d.ground.insertBefore(el, insertBeforeEl);
    } else {
      d.ground.appendChild(el);
    }
    rock._el = el;
  });
  d.updateWorldRocks();
  }

  function saveRockInventoryCount() {
  d.setStoredValue(d.rockInventoryCountKey, String(Math.max(0, Math.floor(d.rockInventoryCount))));
  }

  function showCraftChairOccupiedAlert(chair) {
  const occupant = d.getRemotePlayerOccupyingChair(chair && chair.id);
  const occupantName =
    occupant && occupant.name ? d.nameForIngameUiDisplay(occupant.name) : "";
  d.showPlayerAlert({
    message: occupantName
      ? occupantName + "\uB2D8\uC774 \uC549\uC544 \uC788\uC5B4\uC694."
      : "\uB2E4\uB978 \uD50C\uB808\uC774\uC5B4\uAC00 \uC549\uC544 \uC788\uC5B4\uC694.",
    durationMs: 2200
  });
  }

  function updateApples() {
  d.respawnApplesIfNeeded();
  d.treeAppleElements.forEach(function (appleElement) {
    const apple = d.getApple().apples.find(function (candidate) {
      return candidate.id === appleElement.dataset.appleId;
    });

    if (apple) {
      appleElement.style.left = apple.localX + "px";
      appleElement.style.top = apple.localY + "px";
    }

    appleElement.style.display = !apple || d.getApple().pickedIds.includes(appleElement.dataset.appleId)
      ? "none"
      : "block";
  });

  d.syncGuideInventoryBar();
  d.updateBagInventorySlots();
  d.updateWorldRocks();
  }

  function getBucketSizeSafe() {
  const sz = d.getBucketSize && d.getBucketSize();
  if (sz && Number.isFinite(sz.width) && Number.isFinite(sz.height)) {
    return sz;
  }
  return { width: d.BUCKET_SIZE, height: d.BUCKET_SIZE };
  }

  function updateBucketPosition() {
  if (typeof d.reconcileStaleSelfBucketOwnership === "function") {
    d.reconcileStaleSelfBucketOwnership();
  }
  if (typeof d.ensureMainBucketWorldCoords === "function") {
    d.ensureMainBucketWorldCoords();
  }
  if (!d.bucket) return;
  d.bucket.src = d.getInventory().isBucketFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
  d.playerBucketOverlay.style.backgroundImage =
    'url("' + (d.getInventory().isBucketFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY) + '")';
  const isBucketHeldByRemotePlayer = d.isMainBucketHeldByRemotePlayer();
  if (isBucketHeldByRemotePlayer) {
    const holderId = String(window.OVC_SHARED_BUCKET_HELD_BY || "");
    const lastUpdateAt = Number(d.remoteBucketUpdateAtById[holderId] || 0);
    if (lastUpdateAt && Date.now() - lastUpdateAt > 5000) {
      window.OVC_SHARED_BUCKET_HELD_BY = "";
      d.addBucketTrace("stale", "clear holder=" + holderId + " age=" + (Date.now() - lastUpdateAt), 0);
    }
  }

  Object.keys(d.remotePlayers).forEach(function (remoteId) {
    const remotePlayer = d.remotePlayers[remoteId];
    if (!remotePlayer || !remotePlayer.element) return;
    remotePlayer.element.classList.remove("is-carrying-bucket", "is-carrying-bucket-full");
    const holdsMain = String(window.OVC_SHARED_BUCKET_HELD_BY || "") === remoteId;
    const extraHold = d.remotePlayerHeldBucketById[remoteId];
    // ?? ???? ?? #bucket ??? ? ??? ??? ? ::after ?? ?? ??
    if (extraHold && !holdsMain) {
      remotePlayer.element.classList.add("is-carrying-bucket");
      if (Boolean(extraHold.isFull)) {
        remotePlayer.element.classList.add("is-carrying-bucket-full");
      }
    }
  });

  if (d.getInventory().heldItem === d.HELD_ITEM_BUCKET) {
    const bucketSize = getBucketSizeSafe();
    const handPosition = d.getHandPosition(bucketSize.width, bucketSize.height);

    d.getWorldItems().bucketX = handPosition.x;
    d.getWorldItems().bucketY = handPosition.y;
    if (d.isHoldingMainBucket()) {
      d.markWorldDirty();
      d.broadcastBucketState(false);
      d.bucket.style.display = "none";
    } else if (d.isHoldingExtraBucket()) {
      const mainGround = d.getMainBucketGroundState();
      d.bucket.src = mainGround.isFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
      d.bucket.style.display = "block";
      d.setWorldPosition(d.bucket, mainGround.x, mainGround.y);
      d.bucket.style.zIndex = String(d.getGroundBucketZIndex(mainGround.y));
      d.markWorldDirty();
      d.broadcastBucketState(false);
    } else if (isBucketHeldByRemotePlayer) {
      d.syncMainBucketToRemoteHolderHand();
      d.bucket.src = d.getInventory().isBucketFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
      d.bucket.style.display = "block";
      d.setWorldPosition(d.bucket, d.getWorldItems().bucketX, d.getWorldItems().bucketY);
    }
    d.playerBucketOverlay.style.display = "block";
  } else if (isBucketHeldByRemotePlayer) {
    const bucketSize = getBucketSizeSafe();
    if (!d.syncMainBucketToRemoteHolderHand()) {
      if (typeof d.ensureMainBucketWorldCoords === "function") {
        d.ensureMainBucketWorldCoords();
      } else if (
        !Number.isFinite(d.getWorldItems().bucketX) ||
        !Number.isFinite(d.getWorldItems().bucketY)
      ) {
        d.getWorldItems().bucketX = d.getWorldItems().wellX - d.BUCKET_SIZE - 8;
        d.getWorldItems().bucketY = d.getWorldItems().wellY + d.WELL_SIZE - d.BUCKET_SIZE;
      }
    }
    d.bucket.src = d.getInventory().isBucketFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
    d.bucket.style.display = "block";
    d.playerBucketOverlay.style.display = "none";
  } else {
    d.bucket.style.display = "block";
    d.playerBucketOverlay.style.display = "none";
    // While idle on ground, periodically publish authoritative world bucket state.
    // This helps recover peers that missed a pickup/drop edge event.
    d.broadcastBucketState(false);
  }

  if (
    d.bucket.style.display === "block" &&
    !d.isHoldingExtraBucket() &&
    (!Number.isFinite(d.getWorldItems().bucketX) || !Number.isFinite(d.getWorldItems().bucketY))
  ) {
    d.getWorldItems().bucketX = d.getWorldItems().wellX - d.BUCKET_SIZE - 8;
    d.getWorldItems().bucketY = d.getWorldItems().wellY + d.WELL_SIZE - d.BUCKET_SIZE;
  }

  const localHoldingMain =
    d.getInventory().heldItem === d.HELD_ITEM_BUCKET && d.isHoldingMainBucket();
  const localHoldingExtra = d.isHoldingExtraBucket();
  if (!localHoldingMain && !localHoldingExtra && !isBucketHeldByRemotePlayer) {
    d.bucket.style.display = "block";
    d.playerBucketOverlay.style.display = "none";
    const mainGround = d.getMainBucketGroundState();
    d.bucket.src = mainGround.isFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
    d.setWorldPosition(d.bucket, mainGround.x, mainGround.y);
    d.bucket.style.zIndex = String(d.getGroundBucketZIndex(mainGround.y));
  } else if (d.bucket.style.display === "block" && !d.isHoldingExtraBucket()) {
    const mainGround = d.getMainBucketGroundState();
    d.bucket.src = mainGround.isFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
    d.setWorldPosition(d.bucket, mainGround.x, mainGround.y);
    d.bucket.style.zIndex = String(d.getGroundBucketZIndex(mainGround.y));
    if (d.BUCKET_DEBUG_TRACE) {
      const mode =
        d.getInventory().heldItem === d.HELD_ITEM_BUCKET
          ? "local-held"
          : isBucketHeldByRemotePlayer
            ? "remote-held"
            : "world";
      const renderKey =
        mode + "|" + Math.round(d.getWorldItems().bucketX || 0) + "|" + Math.round(d.getWorldItems().bucketY || 0);
      if (renderKey !== d.lastBucketRenderLoggedKey) {
        d.lastBucketRenderLoggedKey = renderKey;
        d.addNetworkDebugLog(
          "[bucket:render] mode=" +
            mode +
            " x=" +
            Math.round(d.getWorldItems().bucketX || 0) +
            " y=" +
            Math.round(d.getWorldItems().bucketY || 0)
        );
      }
    }
  }
  updateWorldExtraBuckets();
  }

  function updatePlacedCraftFurnitureDom() {
  if (!d.isWorldDocumentEntry()) return;
  d.placedCraftFurniture.forEach(function (entry) {
    if (!entry._el) return;
    d.setWorldSize(entry._el, entry.width, entry.height);
    d.setWorldPosition(entry._el, entry.x, entry.y);
  });
  }

  function updateSeedCard() {
  updateSeedDryState();
  d.seedCard.style.display = "none";
  d.seedWorldText.style.display = "none";
  }

  function updateSeedDryState() {
  d.getPlant().isSeedDry = false;
  }

  function updateSeedInventory() {
  d.getApple().extraSeeds.forEach(function (extraSeed) {
    if (extraSeed.inventoryElement) {
      extraSeed.inventoryElement.remove();
      extraSeed.inventoryElement = undefined;
      extraSeed.inventoryImage = undefined;
    }
  });
  d.updateBagInventorySlots();
  }

  function playerHasSeedInInventory() {
  const bagSeeds =
    typeof d.getBagInventorySeedCount === "function" ? Number(d.getBagInventorySeedCount()) || 0 : 0;
  const legacyCount = Number(d.getApple().seedCount) || 0;
  return bagSeeds > 0 || legacyCount > 0;
  }

  function updateSeedPosition() {
  d.tickTutorialMainSeedRespawnDue();
  updateSeedDryState();
  d.recoverWorldMainSeedIfOnboardingStuck();
  const hasSeedInInventory = playerHasSeedInInventory();
  if (!d.getPlant().isSeedPlanted && !d.getPlant().isPlanting) {
    if (
      d.getSeedWorld().hasHandledDryMainSeed &&
      !d.getPlant().isSeedDry &&
      !d.hasPickedMainSeedInCurrentRoom() &&
      !d.hasTutorialStarterSeedInPlay() &&
      d.getInventory().heldItem !== d.HELD_ITEM_SEED
    ) {
      d.getSeedWorld().hasHandledDryMainSeed = false;
      d.setStoredFlag(d.mainDrySeedHandledKey, false);
      d.getSeedWorld().dryMainSeedVisibleSince = 0;
    }
  }
  const now = Date.now();
  const baseShouldShowMainSeedOnGround =
    d.onboardingShouldKeepWorldMainSeedVisible() ||
    (!d.hasPickedMainSeedInCurrentRoom() &&
      !d.getPlant().isPlanting &&
      !(d.getPlant().isSeedDry && d.getSeedWorld().hasHandledDryMainSeed));
  const tutorialDecorMainSeedOnGround =
    !d.usesWorldLooseSeedMode() &&
    !d.getStoredFlag(d.onboardingFlowDoneKey) &&
    d.getOnboarding().flowStep >= d.ONBOARDING_STEP_PLANT &&
    !d.getPlant().isSeedPlanted &&
    d.getInventory().heldItem !== d.HELD_ITEM_SEED &&
    !d.hasPickedMainSeedInCurrentRoom() &&
    !hasSeedInInventory;
  const shouldShowMainSeedOnGround =
    !d.usesWorldLooseSeedMode() &&
    !hasSeedInInventory &&
    (baseShouldShowMainSeedOnGround || tutorialDecorMainSeedOnGround);
  // Auto-clear dry main seed after grace period even when the world sprite is hidden
  // (e.g. room already marked main-seed picked) so shared state and UI stay consistent.
  if (d.getPlant().isSeedDry && !d.getSeedWorld().hasHandledDryMainSeed && d.getInventory().heldItem !== d.HELD_ITEM_SEED) {
    if (!d.getSeedWorld().dryMainSeedVisibleSince) {
      d.getSeedWorld().dryMainSeedVisibleSince = now;
    } else if (now - d.getSeedWorld().dryMainSeedVisibleSince >= 20000) {
      d.getSeedWorld().hasHandledDryMainSeed = true;
      d.getSeedWorld().isMainSeedAvailable = false;
      d.getSeedWorld().lastMainSeedStateChangeAt = now;
      d.setStoredFlag(d.mainDrySeedHandledKey, true);
      d.setMainSeedPickedForCurrentRoom();
      d.getSeedWorld().dryMainSeedVisibleSince = 0;
      d.markWorldDirty();
      d.syncWorldState(true);
      d.scheduleTutorialMainSeedRespawnFromGround();
    }
  } else if (!d.getPlant().isSeedDry || d.getSeedWorld().hasHandledDryMainSeed) {
    d.getSeedWorld().dryMainSeedVisibleSince = 0;
  }
  // Main seed is a fixed world object (next to the book), not a roaming synced item.
  // ????? ????? ??????: ????????? worldLooseSeed ?????? ?????????#seed??????(????? ?????????????).
  if (shouldShowMainSeedOnGround && d.getInventory().heldItem !== d.HELD_ITEM_SEED) {
    d.getWorldItems().seedX = d.SEED_START_X;
    d.getWorldItems().seedY = d.SEED_START_Y;
  }
  const holdingMainSeed = d.getInventory().heldItem === d.HELD_ITEM_SEED;
  const showMainSeedSprite = shouldShowMainSeedOnGround || holdingMainSeed;
  d.seed.style.display = showMainSeedSprite ? "block" : "none";
  if (!showMainSeedSprite) {
    d.getSeedWorld().isHoveringMainSeed = false;
    return;
  }
  d.seed.src = d.getPlant().isSeedDry ? d.IMG_SEED_DRY : d.IMG_SEED;

  if (holdingMainSeed && d.getPlant().isSeedDry) {
    d.getInventory().heldItem = null;
    d.seed.style.display = "none";
    d.getSeedWorld().isHoveringMainSeed = false;
    return;
  }

  if (holdingMainSeed) {
    const seedSize = d.getSeedSize();
    const handPosition = d.getHandPosition(seedSize.width, seedSize.height);

    d.getWorldItems().seedX = handPosition.x;
    d.getWorldItems().seedY = handPosition.y + 5;
  } else if (shouldShowMainSeedOnGround) {
    d.getWorldItems().seedX = d.SEED_START_X;
    d.getWorldItems().seedY = d.SEED_START_Y;
  }

  d.setWorldPosition(d.seed, d.getWorldItems().seedX, d.getWorldItems().seedY);
  }

  function updateWorldExtraBuckets() {
  if (!d.isWorldDocumentEntry() || !Array.isArray(d.getApple().worldExtraBuckets)) return;
  const bucketSz = d.getBucketSize();
  d.getApple().worldExtraBuckets.forEach(function (entry) {
    if (!entry || !entry._el) return;
    const overlapsMain = d.isWorldExtraBucketOverlappingSharedMain(entry);
    entry._el.style.display = overlapsMain ? "none" : "block";
    if (overlapsMain) return;
    d.setWorldSize(entry._el, bucketSz.width, bucketSz.height);
    d.setWorldPosition(entry._el, entry.x, entry.y);
    entry._el.style.zIndex = String(d.getGroundBucketZIndex(entry.y));
    entry._el.src = entry.isFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
  });
  }

  return {
    createRandomApples,
    createRandomWorldRocks,
    loadRockInventoryCount,
    loadPlayerMoneyKrw,
    savePlayerMoneyKrw,
    rebuildPlacedCraftFurnitureDom,
    rebuildWorldBagDropDom,
    rebuildWorldRockDom,
    saveRockInventoryCount,
    showCraftChairOccupiedAlert,
    updateApples,
    updateBucketPosition,
    updatePlacedCraftFurnitureDom,
    updateSeedCard,
    updateSeedDryState,
    updateSeedInventory,
    updateSeedPosition,
    updateWorldExtraBuckets,
  };
}
