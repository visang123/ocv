"""Emit buildNetworkDeps() body for script.js from d.* usage in src/script/network."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NET = ROOT / "src" / "script" / "network"

NETWORK_EXPORTS = {
    "addNetworkDebugLog",
    "refreshNetworkDebugPanelDom",
    "isNetworkDebugPanelActiveTextSelection",
    "flushPassiveSimulationBeforeSharedSnapshot",
    "getSharedWorldSnapshot",
    "ingestSharedPlantIndexBonus",
    "syncServerClockOffsetFromRowUpdatedAt",
    "holdLocalPlantStateAgainstStaleSnapshot",
    "holdLocalAppleStateAgainstStaleSnapshot",
    "applySharedWorldSnapshot",
    "setupMultiplayer",
    "sendMultiplayerPresence",
    "renderRemotePlayersFromPresence",
    "broadcastBucketState",
    "handleRemoteBucketBroadcast",
    "sendMultiplayerLeave",
    "pollWorldState",
    "syncWorldState",
    "saveSharedWorldAndReload",
    "applyServerWorldRowTimestamps",
}

MUTABLE = {
    "networkDebugLines",
    "adminDebugPlantIndexBonus",
    "currentSessionId",
    "hasHydratedSharedWorldFromServer",
    "ignoreSnapshotInventorySeedsUntil",
    "isApplyingWorldState",
    "isMultiplayerSubscribed",
    "isReloadingForWorldReset",
    "isWorldDirty",
    "isWorldPolling",
    "isWorldSyncing",
    "lastAppliedWorldResetToken",
    "lastButterflyRealtimeStateAt",
    "lastButterflyStateChangeAt",
    "lastBucketBroadcastAt",
    "lastPresenceSentAt",
    "lastServerClockSyncAt",
    "lastWorldPollAt",
    "lastWorldResetAt",
    "lastWorldSaveAt",
    "lastWorldUpdatedAt",
    "localAppleActionLockUntil",
    "localPlantActionLockUntil",
    "multiplayerChannel",
    "multiplayerConnectAttempt",
    "multiplayerStatusText",
    "networkDebugDomStale",
    "pendingForceWorldSaveAfterPoll",
    "pendingWorldResetToken",
    "serverClockOffsetMs",
    "worldSaveConflictBackoffUntil",
    "lastBucketTraceAtByKey",
    "remoteBucketUpdateAtById",
    "remotePlayerHeldBucketById",
    "remotePlayers",
    "placedCraftFurniture",
    "butterflyState",
}


def main() -> None:
    syms: set[str] = set()
    for f in NET.glob("*.js"):
        text = f.read_text(encoding="utf-8")
        syms.update(re.findall(r"\bd\.([a-zA-Z_][a-zA-Z0-9_]{2,})\b", text))

    lines = ["function buildNetworkDeps() {", "  return {"]
    for sym in sorted(syms):
        if sym in NETWORK_EXPORTS:
            continue
        if sym in MUTABLE:
            lines.append(f"    get {sym}() {{ return {sym}; }},")
            lines.append(f"    set {sym}(v) {{ {sym} = v; }},")
        else:
            lines.append(f"    {sym},")
    lines.append("  };")
    lines.append("}")
    out = ROOT / "src" / "script" / "network" / "_bindings-snippet.js"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wrote", out, "count", len(syms))


if __name__ == "__main__":
    main()
