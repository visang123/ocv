/** Realtime presence channel — OVCOnline + playerPositionNetwork */
export function createModule(d) {
  function setupMultiplayer() {
  if (d.isTabSessionSuperseded()) return;
  if (!d.hasSpawnedCharacter) {
    d.updateMultiplayerStatus("\uCE90\uB9AD\uD130 \uC120\uD0DD \uC804");
    d.addNetworkDebugLog("multiplayer skipped: character not spawned");
    return;
  }

  if (d.isSharedWorldSyncPausedForTutorial()) {
    d.teardownMultiplayerForTutorial();
    d.updateMultiplayerStatus(
      "\uD29C\uD1A0\uB9AC\uC5BC: \uB2E4\uB978 \uD50C\uB808\uC774\uC5B4/\uC138\uC0C1 \uBE44\uACF5\uC720 \u00B7 \uBA40\uD2F0 \uBBF8\uC5F0\uACB0"
    );
    d.addNetworkDebugLog("multiplayer skipped: tutorial single-player world");
    return;
  }

  if (d.multiplayerChannel) {
    if (d.isMultiplayerSubscribed) {
      d.updateMultiplayerStatus("\uC5F0\uACB0\uB428");
      d.sendMultiplayerPresence(true);
      d.addNetworkDebugLog("multiplayer reuse: subscribed channel");
    } else {
      d.updateMultiplayerStatus("\uC5F0\uACB0\uC911");
      d.addNetworkDebugLog("multiplayer reuse: waiting subscribe");
    }
    return;
  }

  if (
    !d.currentUserId ||
    !d.currentSessionId ||
    !window.OVCOnline ||
    !window.OVCOnline.isConfigured()
  ) {
    d.updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
    d.addNetworkDebugLog(
      "multiplayer unavailable: userId=" +
      Boolean(d.currentUserId) +
      ", sessionId=" +
      Boolean(d.currentSessionId) +
      ", online=" +
      Boolean(window.OVCOnline) +
      ", configured=" +
      Boolean(window.OVCOnline && window.OVCOnline.isConfigured())
    );
    return;
  }

  if (
    window.OVC_ONLINE_CONFIG &&
    typeof window.OVC_ONLINE_CONFIG.supabaseKey === "string" &&
    window.OVC_ONLINE_CONFIG.supabaseKey.startsWith("sb_publishable_")
  ) {
    d.addNetworkDebugLog("warning: sb_publishable key can close Realtime immediately; use anon public key");
  }

  d.updateMultiplayerStatus("\uC5F0\uACB0\uC911");
  const channel = window.OVCOnline.createPresenceChannel(
    window.OVC_ONLINE_CONFIG.multiplayerRoom,
    d.currentSessionId
  );
  d.multiplayerChannel = channel;
  const attempt = ++d.multiplayerConnectAttempt;

  if (!channel) {
    d.updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
    d.addNetworkDebugLog("multiplayer failed: createPresenceChannel returned null");
    return;
  }
  let terminalHandled = false;

  channel
    .on("broadcast", { event: "player_state" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.playerPositionNetwork.handlePlayerStateBroadcast(payload.payload);
    })
    .on("broadcast", { event: "bucket_state" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteBucketBroadcast(payload.payload);
    })
    .on("broadcast", { event: "butterfly_state" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteButterflyStateBroadcast(payload.payload);
    })
    .on("broadcast", { event: "butterfly_catch" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteButterflyCatchBroadcast(payload.payload);
    })
    .on("broadcast", { event: "world_loose_seed_pickup" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteWorldLooseSeedPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_rock_pickup" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteWorldRockPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_bag_drop" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteWorldBagDropBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_bag_drop_pickup" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteWorldBagDropPickupBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_craft_furniture_placed" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleRemoteWorldCraftFurniturePlacedBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_chat" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleWorldChatBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_heart" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleWorldHeartBroadcast(payload.payload || {});
    })
    .on("broadcast", { event: "world_sad" }, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.handleWorldSadBroadcast(payload.payload || {});
    })
    .on("system", {}, function (payload) {
      if (channel !== d.multiplayerChannel) return;
      d.addNetworkDebugLog("system: " + JSON.stringify(payload || {}));
      const message = String((payload && payload.message) || "");
      if (message.toLowerCase().includes("presence rate limit exceeded")) {
        d.addNetworkDebugLog("presence limit warning ignored (broadcast mode)");
      }
    })
    .subscribe(function (status, error) {
      d.addNetworkDebugLog(
        "channel #" +
        attempt +
        " status: " +
        status +
        (error && error.message ? " (" + error.message + ")" : "")
      );
      if (channel !== d.multiplayerChannel) return;
      if (status === "SUBSCRIBED") {
        d.isMultiplayerSubscribed = true;
        d.clearMultiplayerReconnectTimeout();
        d.updateMultiplayerStatus("\uC5F0\uACB0\uB428");
        d.sendPendingPreviousSessionLeaveBroadcast();
        setTimeout(function () {
          if (channel !== d.multiplayerChannel) return;
          d.sendMultiplayerPresence(true);
          d.pruneDuplicateRemotePlayerSessions(d.remotePlayers, d.removeRemotePlayer);
        }, 600);
        return;
      }

      if (status === "TIMED_OUT" || status === "CHANNEL_ERROR" || status === "CLOSED") {
        if (terminalHandled) return;
        terminalHandled = true;
        d.isMultiplayerSubscribed = false;
        const client =
          window.OVCOnline && typeof window.OVCOnline.getClient === "function"
            ? window.OVCOnline.getClient()
            : null;
        if (client && typeof client.removeChannel === "function") {
          Promise.resolve(client.removeChannel(channel)).catch(function () {
            // Keep reconnecting even if channel cleanup fails.
          });
        }
        if (window.OVCOnline && typeof window.OVCOnline.resetClient === "function") {
          window.OVCOnline.resetClient();
          d.addNetworkDebugLog("reset supabase realtime client");
        }
        d.multiplayerChannel = null;
        d.clearMultiplayerRoomSessionTracking();
        d.updateMultiplayerStatus("\uC5F0\uACB0 \uC548\uB428");
        d.scheduleMultiplayerReconnect(1500);
      }
    });
  }

  function sendMultiplayerPresence(forceSend) {
  if (!d.hasSpawnedCharacter || d.isTabSessionSuperseded()) return;
  if (d.isSharedWorldSyncPausedForTutorial()) return;

  const now = Date.now();
  const butterflyActive = !document.hidden;
  const shouldShowWorldRockPickupAction =
    d.isWorldDocumentEntry() &&
    now - Number(d.lastLocalWorldRockPickupAt || 0) <= d.WORLD_ROCK_PICKUP_ACTION_MS;
  const shouldShowButterflyCatchAction =
    now - Number(d.lastLocalButterflyCatchActionAt || 0) <= d.REMOTE_BUTTERFLY_CATCH_ACTION_MS;
  const localRockMining = d.getLocalRockMining && d.getLocalRockMining();
  const playerRockMiningId = String(d.getPlayer().rockMiningRockId || "");
  const miningRockId = localRockMining
    ? String(localRockMining.rockId || "")
    : playerRockMiningId;
  const miningStartedAt = localRockMining
    ? Number(localRockMining.startedAt) || 0
    : Number(d.getPlayer().rockMiningStartedAt) || 0;
  const state = {
    id: d.currentSessionId,
    userId: d.currentUserId,
    name: d.nameForIngameUiDisplay(d.accountDisplayNameForUi()),
    action: d.getPlant().isPlanting
      ? "planting"
      : d.craftFurnitureInstallingKind
        ? d.getCraftFurnitureInstallPresenceAction(d.craftFurnitureInstallingKind) || "state"
        : d.getApple().isEating
          ? "eating"
          : miningRockId
            ? "rock_mining"
            : shouldShowWorldRockPickupAction
              ? "rock_pickup"
              : shouldShowButterflyCatchAction
                ? "butterfly_catch"
                : "state",
    rockMiningRockId: miningRockId,
    rockMiningStartedAt: miningStartedAt,
    room: window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
    color: d.selectedPlayerColor,
    x: d.getPlayer().x,
    depth: d.getPlayer().depth,
    jumpY: d.getPlayer().jumpY,
    sittingChairId: d.getPlayer().sittingChairId ? String(d.getPlayer().sittingChairId) : "",
    insideCraftHouseId: d.getPlayer().insideCraftHouseId ? String(d.getPlayer().insideCraftHouseId) : "",
    waterSplashAt: d.lastWaterSplashAt,
    waterSplashX: d.lastWaterSplashX,
    waterSplashY: d.lastWaterSplashY,
    butterflyActive,
    updatedAt: now
  };
  d.playerPositionNetwork.sendPosition(state, forceSend);
  d.lastPresenceSentAt = now;
  }

  function renderRemotePlayersFromPresence(presenceState) {
  const nextRemotePlayers = {};

  Object.keys(presenceState || {}).forEach(function (presenceKey) {
    const presences = presenceState[presenceKey];
    if (!Array.isArray(presences) || presenceKey === d.currentSessionId) return;

    const latestPresence = presences[presences.length - 1];
    if (!latestPresence || !latestPresence.id || latestPresence.id === d.currentSessionId) return;
    remotePlayerStateStore.sessionIdsLastSeen[String(latestPresence.id)] = Date.now();
    remotePlayerStateStore.sessionButterflyActive[String(latestPresence.id)] =
      latestPresence.butterflyActive !== false;
    if (d.isRemotePresenceSameLoggedInAccount(latestPresence)) {
      return;
    }

    nextRemotePlayers[latestPresence.id] = latestPresence;
  });

  Object.keys(nextRemotePlayers).forEach(function (remoteId) {
    d.playerPositionNetwork.ingestRemoteState(nextRemotePlayers[remoteId], "presence");
  });

  d.updateRemotePlayerCount();
  }

  function broadcastBucketState(forceSend) {
  if (d.isSharedWorldSyncPausedForTutorial()) {
    return;
  }
  if (!d.multiplayerChannel || !d.currentSessionId) {
    d.addBucketTrace(
      "send-skip",
      "no-channel=" + !d.multiplayerChannel + " no-session=" + !d.currentSessionId,
      1000
    );
    return;
  }
  const now = Date.now();
  if (!forceSend && now - d.lastBucketBroadcastAt < 60) {
    d.addBucketTrace("send-skip", "throttled " + (now - d.lastBucketBroadcastAt) + "ms", 1000);
    return;
  }

  const mainBucket = d.getMainBucketGroundState();
  const holdingBucket = d.getInventory().heldItem === d.HELD_ITEM_BUCKET;
  const payload = {
    id: d.currentSessionId,
    held: holdingBucket,
    heldMain: d.isHoldingMainBucket(),
    heldBucketId: holdingBucket ? String(d.getInventory().heldBucketId || d.MAIN_BUCKET_ID) : "",
    x: mainBucket.x,
    y: mainBucket.y,
    isFull: holdingBucket ? Boolean(d.getInventory().isBucketFull) : mainBucket.isFull,
    mainIsFull: mainBucket.isFull,
    updatedAt: now
  };
  Promise.resolve(d.multiplayerChannel.send({
    type: "broadcast",
    event: "bucket_state",
    payload
  })).catch(function () {
    // Best effort; world sync remains the fallback.
  });
  d.lastBucketBroadcastAt = now;
  d.addBucketTrace(
    "send",
    "held=" + payload.held + " x=" + Math.round(payload.x || 0) + " y=" + Math.round(payload.y || 0) + " t=" + payload.updatedAt,
    350
  );
  }

  function handleRemoteBucketBroadcast(payload) {
  if (d.isSharedWorldSyncPausedForTutorial()) return;
  if (!payload || !payload.id || payload.id === d.currentSessionId) return;
  // ??? ???????? ??? ???? ???? ??? ??????????? ?????? ???????? ?????? ??? ??? ??????????.
  if (d.isHoldingMainBucket()) {
    return;
  }
  const remoteId = String(payload.id);
  const nextUpdatedAt = Number(payload.updatedAt || 0);
  const prevUpdatedAt = Number(d.remoteBucketUpdateAtById[remoteId] || 0);
  if (nextUpdatedAt < prevUpdatedAt) return;
  d.remoteBucketUpdateAtById[remoteId] = nextUpdatedAt;

  const held = payload.held === true;
  const heldMain =
    held &&
    (payload.heldMain === undefined || payload.heldMain === null || Boolean(payload.heldMain));

  if (held && heldMain) {
    window.OVC_SHARED_BUCKET_HELD_BY = remoteId;
    delete d.remotePlayerHeldBucketById[remoteId];
    d.applyRemoteSharedMainBucketHeldPose(payload.x, payload.y, payload.isFull);
    d.markWorldDirty();
    d.addBucketTrace(
      "recv",
      "from=" + remoteId + " held=main x=" + Math.round(d.getWorldItems().bucketX || 0) + " y=" + Math.round(d.getWorldItems().bucketY || 0) + " t=" + nextUpdatedAt,
      350
    );
    return;
  }

  if (held && !heldMain) {
    if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
      window.OVC_SHARED_BUCKET_HELD_BY = "";
    }
    d.remotePlayerHeldBucketById[remoteId] = {
      isFull: Boolean(payload.isFull),
      bucketId: String(payload.heldBucketId || "")
    };
    const mainFull =
      payload.mainIsFull !== undefined && payload.mainIsFull !== null
        ? Boolean(payload.mainIsFull)
        : null;
    if (d.isHoldingExtraBucket()) {
      d.applyRemoteSharedMainBucketGround(
        payload.x,
        payload.y,
        mainFull !== null ? mainFull : d.getInventory().heldExtraBucketMainIsFull
      );
    } else if (!d.isHoldingMainBucket() && !String(window.OVC_SHARED_BUCKET_HELD_BY || "")) {
      d.applyRemoteSharedMainBucketGround(
        payload.x,
        payload.y,
        mainFull !== null ? mainFull : false
      );
    }
    d.markWorldDirty();
    d.addBucketTrace(
      "recv",
      "from=" + remoteId + " held=extra id=" + d.remotePlayerHeldBucketById[remoteId].bucketId + " t=" + nextUpdatedAt,
      350
    );
    return;
  }

  delete d.remotePlayerHeldBucketById[remoteId];
  if (window.OVC_SHARED_BUCKET_HELD_BY === remoteId) {
    window.OVC_SHARED_BUCKET_HELD_BY = "";
  }
  const resolvedMainFull =
    payload.mainIsFull !== undefined && payload.mainIsFull !== null
      ? Boolean(payload.mainIsFull)
      : Boolean(payload.isFull);
  d.applyRemoteSharedMainBucketGround(payload.x, payload.y, resolvedMainFull);
  d.markWorldDirty();
  d.addBucketTrace(
    "recv",
    "from=" + remoteId + " held=false x=" + Math.round(d.getWorldItems().bucketX || 0) + " y=" + Math.round(d.getWorldItems().bucketY || 0) + " t=" + nextUpdatedAt,
    350
  );
  }

  function sendMultiplayerLeave() {
  if (!d.currentSessionId) return;

  if (d.getInventory().heldItem === d.HELD_ITEM_BUCKET || window.OVC_SHARED_BUCKET_HELD_BY === d.currentSessionId) {
    if (d.getInventory().heldItem === d.HELD_ITEM_BUCKET) {
      d.dropBucket();
    }
    window.OVC_SHARED_BUCKET_HELD_BY = "";
    d.markWorldDirty();
    d.syncWorldState(true);
  }

  d.playerPositionNetwork.sendLeaveBroadcast({
    id: d.currentSessionId,
    userId: d.currentUserId,
    name: d.nameForIngameUiDisplay(d.accountDisplayNameForUi()),
    action: "leave",
    updatedAt: Date.now()
  });

  if (window.OVCOnline && typeof window.OVCOnline.removePresence === "function") {
    Promise.resolve(window.OVCOnline.removePresence(d.currentSessionId)).catch(function () {
      // The page may be closing; best effort is enough here.
    });
  }
  }

  return {
    setupMultiplayer,
    sendMultiplayerPresence,
    renderRemotePlayersFromPresence,
    broadcastBucketState,
    handleRemoteBucketBroadcast,
    sendMultiplayerLeave,
  };
}
