"""
Extract network functions from script.js into src/script/network/*.js
Wraps bodies with deps `d.` prefix for listed bindings.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
NET = ROOT / "src" / "script" / "network"

# Identifiers rewritten to d.<name> (longest first). Functions + mutable state used by network chunk.
DEPS_SYMBOLS = sorted(
    {
        "adminDebugPlantIndexBonus",
        "appStorageKeysSharedWorldReset",
        "applyButterflySnapshot",
        "applyDefaultState",
        "applyLoadedPlantState",
        "applyPlantWaterDecay",
        "applyRemoteSharedMainBucketGround",
        "applyRemoteSharedMainBucketHeldPose",
        "butterflyState",
        "clearMainSeedPickedForCurrentRoom",
        "clearMultiplayerReconnectTimeout",
        "clearMultiplayerRoomSessionTracking",
        "clearStoredKeys",
        "craftFurnitureInstallingKind",
        "currentSessionId",
        "currentUserId",
        "dedupeExtraSeedsPreferInventory",
        "ensureExtraPlantElements",
        "ensureWorldLooseSeedShape",
        "getApple",
        "getButterflyStateForSnapshot",
        "getInventory",
        "getMainBucketGroundState",
        "getMainDryAfterEmptyMsForPlant",
        "getMultiplayerWorldPollMinMs",
        "getNpc",
        "getPlant",
        "getPlantDryAfterEmptyMsForPlantPhase",
        "getPlantSoilSrc",
        "getPlantStateForStorage",
        "getPlantWaterLevelTickMsForPlant",
        "getPlayer",
        "getSeedWorld",
        "getSharedPlantSimulationNow",
        "getSynchronizedNow",
        "getSynchronizedNowCore",
        "getWell",
        "getWorldItems",
        "handleRemoteBucketBroadcast",
        "handleRemoteButterflyCatchBroadcast",
        "handleRemoteButterflyStateBroadcast",
        "handleRemoteWorldBagDropBroadcast",
        "handleRemoteWorldBagDropPickupBroadcast",
        "handleRemoteWorldChatBroadcast",
        "handleRemoteWorldHeartBroadcast",
        "handleRemoteWorldLooseSeedPickupBroadcast",
        "handleRemoteWorldRockPickupBroadcast",
        "handleRemoteWorldSadBroadcast",
        "hasHydratedSharedWorldFromServer",
        "hasPickedMainSeedInCurrentRoom",
        "hasSpawnedCharacter",
        "holdLocalAppleStateAgainstStaleSnapshot",
        "holdLocalPlantStateAgainstStaleSnapshot",
        "ignoreSnapshotInventorySeedsUntil",
        "ingestSharedPlantIndexBonus",
        "isApplyingWorldState",
        "isCharacterSelecting",
        "isHoldingExtraBucket",
        "isHoldingMainBucket",
        "isMultiplayerSubscribed",
        "isPowderUpgradeInProgress",
        "isReloadingForWorldReset",
        "isRemotePresenceSameLoggedInAccount",
        "isSharedWorldMergeActive",
        "isSharedWorldSyncPausedForTutorial",
        "isTabSessionSuperseded",
        "isWorldDocumentEntry",
        "isWorldPolling",
        "isWorldServerSyncAvailable",
        "isWorldSyncing",
        "lastAppliedWorldResetToken",
        "lastButterflyRealtimeStateAt",
        "lastButterflyStateChangeAt",
        "lastBucketBroadcastAt",
        "lastBucketTraceAtByKey",
        "lastLocalButterflyCatchActionAt",
        "lastLocalWorldRockPickupAt",
        "lastPresenceSentAt",
        "lastPresenceStateKey",
        "lastServerClockSyncAt",
        "lastWaterSplashAt",
        "lastWaterSplashX",
        "lastWaterSplashY",
        "lastWorldPollAt",
        "lastWorldResetAt",
        "lastWorldSaveAt",
        "lastWorldUpdatedAt",
        "localAppleActionLockUntil",
        "localPlantActionLockUntil",
        "mainDrySeedHandledKey",
        "markWorldDirty",
        "maxWellWater",
        "multiplayerChannel",
        "multiplayerConnectAttempt",
        "multiplayerStatusText",
        "networkDebugDomStale",
        "networkDebugLines",
        "networkDebugPanel",
        "normalizePlantSproutFieldsWhenSoilDry",
        "ovcWorldIndexUrl",
        "parseMainPlantFromSnapshot",
        "pendingForceWorldSaveAfterPoll",
        "pendingWorldResetToken",
        "persistOvcLastAppliedWorldResetToken",
        "placedCraftFurniture",
        "plantDrySoilClearMs",
        "plantRotClearMs",
        "plantSpot",
        "playerPositionNetwork",
        "pruneDuplicateRemotePlayerSessions",
        "rebasePlantModelTimestampsToLocalNow",
        "refillWellIfNeeded",
        "remoteBucketUpdateAtById",
        "remotePlayerHeldBucketById",
        "remotePlayers",
        "remotePlayerStateStore",
        "removeRemotePlayer",
        "restartPlayerPositionOnly",
        "resolveSnapshotSavedAt",
        "sanitizePrematureRemotePlantDryState",
        "sanitizeSharedPlantHydrationAfterRemoteSnapshot",
        "savePlayerPosition",
        "seedCreatedAtKey",
        "sendMultiplayerPresence",
        "sendPendingPreviousSessionLeaveBroadcast",
        "serializePlacedCraftFurnitureForSnapshot",
        "serializeWorldBagDropsForSnapshot",
        "serializeWorldExtraBucketsForSnapshot",
        "serverClockOffsetMs",
        "setMainSeedPickedForCurrentRoom",
        "setStoredFlag",
        "setStoredValue",
        "setupMultiplayer",
        "shouldDeferRemoteAppleApply",
        "shouldHideSeparateSoilUnderBigGrass",
        "shouldIgnoreEmptyRemoteMainPlant",
        "shouldPauseWaterDecayForPlant",
        "shouldShowFirstWaterNeededDroplet",
        "showThrottledWorldSyncToast",
        "snapWellRefillToGrid",
        "syncServerClockOffsetFromRowUpdatedAt",
        "teardownMultiplayerForTutorial",
        "updateMultiplayerStatus",
        "updatePlantProgressGauge",
        "updateRemotePlayerCount",
        "usesWorldLooseSeedMode",
        "waterNeeded",
        "wellRefillMs",
        "worldSaveConflictBackoffUntil",
        "WORLD_ROCK_PICKUP_ACTION_MS",
        "WORLD_ROCK_SIZE",
        "REMOTE_BUTTERFLY_CATCH_ACTION_MS",
        "HELD_ITEM_BUCKET",
        "MAIN_BUCKET_ID",
        "PLANT_SPOT_WIDTH",
        "WATER_NEEDED_SIZE",
        "accountDisplayNameForUi",
        "addBucketTrace",
        "addNetworkDebugLog",
        "applySharedWorldSnapshot",
        "dropBucket",
        "flushPassiveSimulationBeforeSharedSnapshot",
        "getSharedWorldSnapshot",
        "isWorldDirty",
        "refreshUiAfterSharedWorldApply",
        "scheduleMultiplayerReconnect",
        "selectedPlayerColor",
        "setWorldPosition",
        "syncWorldState",
        "validateCurrentAccount",
        "applyWorldExtraBucketsFromSharedSnapshot",
        "clearGroundExtraSeedElementsOnly",
        "extraSeedHasCorrespondingExtraPlant",
        "invalidateGroundSeedElementRefsOnly",
        "isExtraSeedOwnedByLocalPlayer",
        "isExtraSeedSessionOwnedByLocal",
        "mergeWorldBagDropsFromSnapshot",
        "parsePlacedCraftFurnitureFromSnapshot",
        "parseSharedGroundSeedFromSnapshot",
        "pruneGroundExtraSeedsShadowedByPlants",
        "rebuildPlacedCraftFurnitureDom",
        "sanitizeWorldLooseModeExtraSeeds",
        "stabilizeFirstWaterHintFlags",
        "syncWorldLoosePickupLock",
        "teardownExtraPlantDom",
        "ensureExtraPlantElements",
        "applyLoadedPlantState",
        "ensureSharedPlantVisuals",
        "nameForIngameUiDisplay",
        "pruneDuplicateRemotePlayerSessions",
        "removeRemotePlayer",
        "updateRemotePlayerCount",
        "dropBucket",
        "markWorldDirty",
        "BUCKET_DEBUG_TRACE",
        "createSyncDebugHelpers",
        "SYNC_DEBUG_TRACE",
        "getCraftFurnitureInstallPresenceAction",
        "handleWorldChatBroadcast",
        "handleWorldHeartBroadcast",
        "handleWorldSadBroadcast",
    },
    key=len,
    reverse=True,
)

NO_PREFIX = {
    "syncServerClockOffsetCore",
    "parseMainPlantFromSnapshot",
    "resolveSnapshotSavedAt",
    "dedupeExtraSeedsPreferInventory",
}

# Don't prefix these if they appear as object keys (handled by regex negative lookbehind for .)
SKIP_PREFIX = {
    "function",
    "return",
    "if",
    "else",
    "try",
    "catch",
    "finally",
    "const",
    "let",
    "var",
    "new",
    "typeof",
    "undefined",
    "null",
    "true",
    "false",
    "window",
    "document",
    "Object",
    "Array",
    "String",
    "Number",
    "Boolean",
    "Math",
    "Date",
    "Promise",
    "JSON",
    "setTimeout",
}


def find_function_range(lines: list[str], name: str) -> tuple[int, int] | None:
    pat = re.compile(r"^function " + re.escape(name) + r"\s*\(")
    start = None
    for i, line in enumerate(lines):
        if pat.match(line):
            start = i
            break
    if start is None:
        return None
    brace = 0
    started = False
    for j in range(start, len(lines)):
        for ch in lines[j]:
            if ch == "{":
                brace += 1
                started = True
            elif ch == "}":
                brace -= 1
        if started and brace == 0:
            return start, j
    return None


def prefix_body(body: str) -> str:
    out = body
    for sym in DEPS_SYMBOLS:
        if sym in SKIP_PREFIX or sym in NO_PREFIX:
            continue
        # skip property access: .sym  and  ['sym']
        out = re.sub(r"(?<![.\w])" + re.escape(sym) + r"(?![.\w])", "d." + sym, out)
    # fix double d.d.
    out = out.replace("d.d.", "d.")
    return out


def extract_function(lines: list[str], name: str, use_d_prefix: bool = True) -> str:
    rng = find_function_range(lines, name)
    if not rng:
        raise SystemExit(f"function not found: {name}")
    start, end = rng
    header = lines[start].rstrip()
    body_lines = lines[start + 1 : end]
    body = "\n".join(body_lines)
    if use_d_prefix:
        body = prefix_body(body)
    if not header.startswith("  "):
        header = "  " + header
    return header + "\n" + body + "\n  }\n"


def write_file(path: Path, header: str, functions: list[str], lines: list[str], extra_imports: str = "") -> None:
    parts = [header]
    if extra_imports:
        parts.append(extra_imports)
        parts.append("")
    parts.append("export function createModule(d) {")
    for fn in functions:
        parts.append(extract_function(lines, fn))
    parts.append("  return {")
    for fn in functions:
        parts.append(f"    {fn},")
    parts.append("  };")
    parts.append("}")
    parts.append("")
    path.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print("wrote", path, "funcs", functions)


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    NET.mkdir(parents=True, exist_ok=True)

    write_file(
        NET / "debug.js",
        "/** Network debug panel — script.js 에서 d 로 DOM·상태 주입 */",
        ["addNetworkDebugLog", "refreshNetworkDebugPanelDom", "isNetworkDebugPanelActiveTextSelection"],
        lines,
    )

    write_file(
        NET / "world-snapshot.js",
        "/** Shared world row serialize / apply (Supabase world_state) */",
        [
            "flushPassiveSimulationBeforeSharedSnapshot",
            "getSharedWorldSnapshot",
            "ingestSharedPlantIndexBonus",
            "syncServerClockOffsetFromRowUpdatedAt",
            "holdLocalPlantStateAgainstStaleSnapshot",
            "holdLocalAppleStateAgainstStaleSnapshot",
            "applySharedWorldSnapshot",
        ],
        lines,
        'import { parseMainPlantFromSnapshot, resolveSnapshotSavedAt, dedupeExtraSeedsPreferInventory } from "../../game/worldSnapshot.js";\n'
        'import { syncServerClockOffsetCore } from "../../game/timeSync.js";',
    )

    write_file(
        NET / "presence.js",
        "/** Realtime presence channel — OVCOnline + playerPositionNetwork */",
        [
            "setupMultiplayer",
            "sendMultiplayerPresence",
            "renderRemotePlayersFromPresence",
            "broadcastBucketState",
            "handleRemoteBucketBroadcast",
            "sendMultiplayerLeave",
        ],
        lines,
    )

    print("done - wire index.js + script.js manually")


if __name__ == "__main__":
    main()
