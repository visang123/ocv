/**
 * Network/Sync — Supabase 월드 row poll·save.
 */

/**
 * @param {object} d — script.js 런타임 바인딩
 */
export function createWorldPollSync(d) {
  let pendingForceSaveAfterSync = false;

  function applyServerWorldRowTimestamps(row) {
    if (!row || !row.updated_at) return;
    d.lastWorldUpdatedAt = row.updated_at;
    const parsed = Date.parse(row.updated_at);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    d.getPlant().lastMainPlantStateChangeAt = Math.max(
      d.getPlant().lastMainPlantStateChangeAt,
      parsed
    );
    d.getApple().lastStateChangeAt = Math.max(d.getApple().lastStateChangeAt, parsed);
    d.getWell().lastStateChangeAt = Math.max(d.getWell().lastStateChangeAt, parsed);
    d.getSeedWorld().lastMainSeedStateChangeAt = Math.max(
      d.getSeedWorld().lastMainSeedStateChangeAt,
      parsed
    );
  }

  function syncWorldState(forceSave, options) {
    options = options || {};
    const skipPrefetch = Boolean(options.skipPrefetch);
    const now = Date.now();
    if (d.isTabSessionSuperseded() || d.isReloadingForWorldReset) return;
    if (d.isSharedWorldSyncPausedForTutorial()) return;
    if (!forceSave && now < d.worldSaveConflictBackoffUntil) return;
    if (
      d.isWorldSyncing ||
      !window.OVCOnline ||
      typeof window.OVCOnline.saveWorldState !== "function"
    ) {
      if (forceSave) {
        d.isWorldDirty = true;
        pendingForceSaveAfterSync = true;
      }
      return;
    }
    if (d.isWorldPolling) {
      d.isWorldDirty = true;
      if (forceSave) d.pendingForceWorldSaveAfterPoll = true;
      return;
    }
    if (!forceSave && !d.isWorldDirty) return;
    if (!d.hasHydratedSharedWorldFromServer && d.isWorldServerSyncAvailable()) {
      d.isWorldDirty = true;
      if (forceSave) {
        d.pendingForceWorldSaveAfterPoll = true;
      }
      pollWorldState(true);
      return;
    }
    if (
      forceSave &&
      !skipPrefetch &&
      d.isWorldServerSyncAvailable() &&
      d.hasHydratedSharedWorldFromServer
    ) {
      d.isWorldDirty = true;
      pollWorldState(true);
      d.pendingForceWorldSaveAfterPoll = true;
      return;
    }
    d.isWorldSyncing = true;
    d.isWorldDirty = false;
    d.lastWorldSaveAt = now;
    const expectedUpdatedAt =
      d.isWorldServerSyncAvailable() &&
      d.hasHydratedSharedWorldFromServer &&
      d.lastWorldUpdatedAt
        ? d.lastWorldUpdatedAt
        : "";
    window.OVCOnline.saveWorldState(
      window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
      d.getSharedWorldSnapshot(),
      { expectedUpdatedAt }
    )
      .then(function (row) {
        applyServerWorldRowTimestamps(row);
        if (typeof d.saveAppleState === "function") {
          d.saveAppleState({ skipWorldDirty: true });
        }
      })
      .catch(function (error) {
        if (
          error &&
          (error.code === "world_state_conflict" ||
            String(error.message || "").indexOf("world_state_conflict") !== -1)
        ) {
          d.addNetworkDebugLog(
            "world save conflict: polling latest snapshot before retry"
          );
          d.worldSaveConflictBackoffUntil = Date.now() + 1200;
          d.isWorldDirty = true;
          d.pendingForceWorldSaveAfterPoll = true;
          pollWorldState(true);
          return;
        }
        d.addNetworkDebugLog(
          "world save error: " +
            (error && error.message ? error.message : "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958")
        );
        d.showThrottledWorldSyncToast(
          "\uC6D4\uB4DC \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
        );
        d.isWorldDirty = true;
      })
      .finally(function () {
        d.isWorldSyncing = false;
        if (pendingForceSaveAfterSync) {
          pendingForceSaveAfterSync = false;
          syncWorldState(true, { skipPrefetch: true });
        }
      });
  }

  function saveSharedWorldAndReload(options) {
    options = options || {};
    const reloadUrl = options.reloadUrl || "";
    if (!window.OVCOnline || typeof window.OVCOnline.saveWorldState !== "function") {
      setTimeout(function () {
        if (reloadUrl) window.location.replace(reloadUrl);
        else window.location.reload();
      }, 400);
      return;
    }

    d.isWorldSyncing = true;
    d.isWorldDirty = false;
    d.lastWorldSaveAt = Date.now();
    const saveResetSnapshot = function () {
      return window.OVCOnline.saveWorldState(
        window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom,
        d.getSharedWorldSnapshot()
      );
    };
    saveResetSnapshot()
      .then(function (row) {
        applyServerWorldRowTimestamps(row);
        return new Promise(function (resolve) {
          setTimeout(resolve, 350);
        });
      })
      .then(function () {
        return saveResetSnapshot();
      })
      .then(function (row) {
        applyServerWorldRowTimestamps(row);
      })
      .catch(function (error) {
        d.addNetworkDebugLog(
          "world reset save error: " +
            (error && error.message ? error.message : "\uC54C \uC218 \uC5C6\uB294 \uC624\uB958")
        );
        d.showThrottledWorldSyncToast(
          "\uC6D4\uB4DC \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD569\uB2C8\uB2E4."
        );
      })
      .finally(function () {
        d.isWorldSyncing = false;
        d.isReloadingForWorldReset = true;
        if (reloadUrl) window.location.replace(reloadUrl);
        else window.location.reload();
      });
  }

  function pollWorldState(forcePoll) {
    const now = Date.now();
    if (
      d.isWorldPolling ||
      d.isReloadingForWorldReset ||
      d.isTabSessionSuperseded() ||
      d.isSharedWorldSyncPausedForTutorial() ||
      !window.OVCOnline ||
      typeof window.OVCOnline.loadWorldState !== "function" ||
      (!forcePoll && now - d.lastWorldPollAt < d.getMultiplayerWorldPollMinMs())
    ) {
      if (forcePoll) {
        if (!d.isWorldServerSyncAvailable()) {
          d.hasHydratedSharedWorldFromServer = true;
        }
        d.ovcTryDismissLoadingScreen(false);
      }
      return;
    }

    d.isWorldPolling = true;
    d.lastWorldPollAt = now;
    window.OVCOnline.loadWorldState(
      window.OVC_ONLINE_CONFIG && window.OVC_ONLINE_CONFIG.multiplayerRoom
    )
      .then(function (row) {
        if (d.isWorldServerSyncAvailable()) {
          d.hasHydratedSharedWorldFromServer = true;
        }
        if (!row || !row.state) return;
        try {
          const plantBonusChanged = d.ingestSharedPlantIndexBonus(row.state);
          if (!row.updated_at || row.updated_at === d.lastWorldUpdatedAt) {
            if (plantBonusChanged) d.updatePlantProgressGauge();
            return;
          }
          d.lastWorldUpdatedAt = row.updated_at;
          d.applySharedWorldSnapshot(row.state, row.updated_at);
        } catch (applyError) {
          d.addNetworkDebugLog(
            "world apply error: " +
              (applyError && applyError.message
                ? applyError.message
                : String(applyError))
          );
        }
      })
      .catch(function (error) {
        d.addNetworkDebugLog(
          "world poll error: " +
            (error && error.message ? error.message : "unknown")
        );
      })
      .finally(function () {
        d.isWorldPolling = false;
        if (d.isWorldServerSyncAvailable()) {
          d.hasHydratedSharedWorldFromServer = true;
        }
        if (d.pendingForceWorldSaveAfterPoll) {
          d.pendingForceWorldSaveAfterPoll = false;
          syncWorldState(true, { skipPrefetch: true });
        }
        d.ovcTryDismissLoadingScreen(false);
      });
  }

  return {
    pollWorldState,
    syncWorldState,
    saveSharedWorldAndReload,
    applyServerWorldRowTimestamps
  };
}
