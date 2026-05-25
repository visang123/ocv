import { isValidRemotePlayerStatePayload } from "./syncCore.js";
import { getRemotePlayerIdentityKey } from "./presence.js";

/**
 * Player position sync only: send local pose to the server/channel,
 * receive remote poses and hand them to remotePlayerStateStore.
 * Does not touch DOM or the game loop.
 */
export function createPlayerPositionNetwork(options) {
  const stateStore = options && options.stateStore;
  const getSessionId = options && options.getSessionId;
  const isSyncPaused =
    options && typeof options.isSyncPaused === "function"
      ? options.isSyncPaused
      : function () {
          return false;
        };
  const isTabSuperseded =
    options && typeof options.isTabSuperseded === "function"
      ? options.isTabSuperseded
      : function () {
          return false;
        };
  const isSameLoggedInAccount =
    options && typeof options.isSameLoggedInAccount === "function"
      ? options.isSameLoggedInAccount
      : function () {
          return false;
        };
  const onSameAccountPresence =
    options && typeof options.onSameAccountPresence === "function"
      ? options.onSameAccountPresence
      : null;
  const onRemoteLeave =
    options && typeof options.onRemoteLeave === "function"
      ? options.onRemoteLeave
      : null;
  const onRemoteApplied =
    options && typeof options.onRemoteApplied === "function"
      ? options.onRemoteApplied
      : null;
  const onRemoteRejected =
    options && typeof options.onRemoteRejected === "function"
      ? options.onRemoteRejected
      : null;
  const getMultiplayerRoom =
    options && typeof options.getMultiplayerRoom === "function"
      ? options.getMultiplayerRoom
      : function () {
          return (
            (typeof window !== "undefined" &&
              window.OVC_ONLINE_CONFIG &&
              window.OVC_ONLINE_CONFIG.multiplayerRoom) ||
            "ovc-main-room"
          );
        };
  const getBroadcastMinMs =
    options && typeof options.getBroadcastMinMs === "function"
      ? options.getBroadcastMinMs
      : function () {
          return 120;
        };
  const getHeartbeatMs =
    options && typeof options.getHeartbeatMs === "function"
      ? options.getHeartbeatMs
      : function () {
          return 900;
        };
  const getPresenceDbSyncMs =
    options && typeof options.getPresenceDbSyncMs === "function"
      ? options.getPresenceDbSyncMs
      : function () {
          return 1800;
        };
  const getPresenceDbPollMs =
    options && typeof options.getPresenceDbPollMs === "function"
      ? options.getPresenceDbPollMs
      : function () {
          return 1800;
        };
  const getJumpBroadcastMinMs =
    options && typeof options.getJumpBroadcastMinMs === "function"
      ? options.getJumpBroadcastMinMs
      : function () {
          return 50;
        };
  const isAirborne =
    options && typeof options.isAirborne === "function"
      ? options.isAirborne
      : function () {
          return false;
        };
  const log =
    options && typeof options.log === "function" ? options.log : function () {};

  let lastBroadcastAt = 0;
  let lastHeartbeatBroadcastAt = 0;
  let lastPresenceStateKey = "";
  let lastPresenceDbSyncAt = 0;
  let lastPresenceDbPollAt = 0;
  let isPresenceDbSyncing = false;
  let isPresenceDbPolling = false;

  function getChannel() {
    return options && typeof options.getChannel === "function"
      ? options.getChannel()
      : null;
  }

  function shouldSendBroadcast(localState, forceSend, now) {
    const stateKey = [
      localState.color,
      Math.round(localState.x * 10),
      Math.round(localState.depth * 10),
      Math.round(localState.jumpY * 10),
      localState.action,
      localState.sittingChairId || "",
      localState.insideCraftHouseId || "",
      Math.round(localState.waterSplashAt || 0)
    ].join("|");
    const hasChanged = stateKey !== lastPresenceStateKey;
    const broadcastMinMs =
      localState.jumpY < -(options.airborneJumpThreshold || 0.06) || isAirborne()
        ? getJumpBroadcastMinMs()
        : getBroadcastMinMs();

    const shouldSend =
      forceSend ||
      (hasChanged && now - lastBroadcastAt >= broadcastMinMs) ||
      now - lastHeartbeatBroadcastAt >= getHeartbeatMs();

    return { shouldSend: shouldSend, hasChanged: hasChanged, stateKey: stateKey };
  }

  function sendPosition(localState, forceSend) {
    if (isSyncPaused() || !localState || !localState.id) return { sent: false };

    const channel = getChannel();
    const now = Date.now();
    const sendPlan = shouldSendBroadcast(localState, forceSend, now);

    if (channel && sendPlan.shouldSend) {
      Promise.resolve(
        channel.send({
          type: "broadcast",
          event: "player_state",
          payload: localState
        })
      ).catch(function (error) {
        log(
          "broadcast error: " + (error && error.message ? error.message : "send failed")
        );
      });
      lastBroadcastAt = now;
      if (forceSend || !sendPlan.hasChanged) {
        lastHeartbeatBroadcastAt = now;
      }
    }

    if (sendPlan.hasChanged || forceSend) {
      lastPresenceStateKey = sendPlan.stateKey;
    }

    if (sendPlan.hasChanged || forceSend || now - lastPresenceDbSyncAt >= getPresenceDbSyncMs()) {
      syncPresenceToDatabase(localState);
    }
    if (now - lastPresenceDbPollAt >= getPresenceDbPollMs()) {
      pollPresenceDatabase();
    }

    return { sent: Boolean(channel && sendPlan.shouldSend) };
  }

  function sendLeaveBroadcast(leavePayload) {
    const channel = getChannel();
    if (!channel || !leavePayload || !leavePayload.id) return;
    Promise.resolve(
      channel.send({
        type: "broadcast",
        event: "player_state",
        payload: leavePayload
      })
    ).catch(function () {
      // Best effort on tab close.
    });
  }

  function syncPresenceToDatabase(state) {
    if (
      isSyncPaused() ||
      isTabSuperseded() ||
      isPresenceDbSyncing ||
      typeof window === "undefined" ||
      !window.OVCOnline ||
      typeof window.OVCOnline.savePresence !== "function"
    ) {
      return;
    }
    isPresenceDbSyncing = true;
    lastPresenceDbSyncAt = Date.now();
    window.OVCOnline.savePresence(state)
      .catch(function (error) {
        log(
          "presence db save error: " +
            (error && error.message ? error.message : "save failed")
        );
      })
      .finally(function () {
        isPresenceDbSyncing = false;
      });
  }

  function ingestRemoteState(state, source) {
    if (isSyncPaused()) return { kind: "skip" };
    const sessionId =
      typeof getSessionId === "function" ? String(getSessionId() || "") : "";
    if (!isValidRemotePlayerStatePayload(state) || state.id === sessionId) {
      return { kind: "skip" };
    }

    if (isSameLoggedInAccount(state)) {
      if (onSameAccountPresence) onSameAccountPresence(String(state.id), state);
      return { kind: "same_account" };
    }

    if (!stateStore) return { kind: "skip" };

    const result = stateStore.applyIncoming(state, source);
    if (result.kind === "leave") {
      if (onRemoteLeave) onRemoteLeave(result.remoteId);
      return result;
    }
    if (result.kind === "reject") {
      if (onRemoteRejected) onRemoteRejected(result);
      return result;
    }
    if (result.kind === "applied" && onRemoteApplied) {
      onRemoteApplied(result);
    }
    return result;
  }

  function handlePlayerStateBroadcast(payload) {
    return ingestRemoteState(payload, "broadcast");
  }

  function pollPresenceDatabase() {
    if (
      isSyncPaused() ||
      isTabSuperseded() ||
      isPresenceDbPolling ||
      typeof window === "undefined" ||
      !window.OVCOnline ||
      typeof window.OVCOnline.listPresence !== "function" ||
      !stateStore
    ) {
      return Promise.resolve(null);
    }

    isPresenceDbPolling = true;
    lastPresenceDbPollAt = Date.now();
    const sessionId =
      typeof getSessionId === "function" ? String(getSessionId() || "") : "";

    return window.OVCOnline.listPresence(getMultiplayerRoom())
      .then(function (players) {
        const idsInDb = Object.create(null);
        const now = Date.now();
        const freshestPresenceByIdentity = Object.create(null);

        (players || []).forEach(function (state) {
          if (!state || !state.id || state.id === sessionId) return;
          const presenceSeenAt = Number(state.updatedAt) || 0;
          if (!presenceSeenAt || now - presenceSeenAt > 70000) return;
          stateStore.markSessionSeen(state.id, state.butterflyActive, presenceSeenAt);
          if (isSameLoggedInAccount(state)) {
            if (onSameAccountPresence) onSameAccountPresence(String(state.id), state);
            return;
          }
          const identityKey = getRemotePlayerIdentityKey(state);
          const prev = freshestPresenceByIdentity[identityKey];
          if (!prev || presenceSeenAt >= prev.presenceSeenAt) {
            freshestPresenceByIdentity[identityKey] = {
              state: state,
              presenceSeenAt: presenceSeenAt
            };
          }
        });

        Object.keys(freshestPresenceByIdentity).forEach(function (identityKey) {
          const entry = freshestPresenceByIdentity[identityKey];
          const row = entry && entry.state;
          if (!row || !row.id) return;
          idsInDb[String(row.id)] = true;
          ingestRemoteState(row, "poll");
        });

        const staleRemoved = [];
        Object.keys(stateStore.getPlayers()).forEach(function (remoteId) {
          if (idsInDb[remoteId]) return;
          const player = stateStore.getPlayer(remoteId);
          if (player && player.lastSeenAt && now - player.lastSeenAt < 45000) {
            return;
          }
          stateStore.remove(remoteId);
          staleRemoved.push(remoteId);
          if (onRemoteLeave) onRemoteLeave(remoteId);
        });

        return { idsInDb: idsInDb, staleRemoved: staleRemoved };
      })
      .catch(function (error) {
        log(
          "presence db poll error: " +
            (error && error.message ? error.message : "poll failed")
        );
        return null;
      })
      .finally(function () {
        isPresenceDbPolling = false;
      });
  }

  function resetSendThrottle() {
    lastBroadcastAt = 0;
    lastHeartbeatBroadcastAt = 0;
    lastPresenceStateKey = "";
    lastPresenceDbSyncAt = 0;
    lastPresenceDbPollAt = 0;
  }

  return {
    sendPosition: sendPosition,
    sendLeaveBroadcast: sendLeaveBroadcast,
    handlePlayerStateBroadcast: handlePlayerStateBroadcast,
    ingestRemoteState: ingestRemoteState,
    pollPresenceDatabase: pollPresenceDatabase,
    syncPresenceToDatabase: syncPresenceToDatabase,
    resetSendThrottle: resetSendThrottle
  };
}
