"""
Remove extracted network functions from script.js and insert init + thin wrappers.
Run from repo root: python scripts/wire-script-network.py
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
BINDINGS = ROOT / "src" / "script" / "network" / "_bindings-snippet.js"

REMOVE_FUNCS = [
    "flushPassiveSimulationBeforeSharedSnapshot",
    "getSharedWorldSnapshot",
    "refreshUiAfterSharedWorldApply",
    "holdLocalPlantStateAgainstStaleSnapshot",
    "holdLocalAppleStateAgainstStaleSnapshot",
    "getSynchronizedNow",
    "ingestSharedPlantIndexBonus",
    "syncServerClockOffsetFromRowUpdatedAt",
    "applySharedWorldSnapshot",
    "setupMultiplayer",
    "sendMultiplayerPresence",
    "broadcastBucketState",
    "handleRemoteBucketBroadcast",
    "sendMultiplayerLeave",
    "renderRemotePlayersFromPresence",
    "addNetworkDebugLog",
    "refreshNetworkDebugPanelDom",
    "isNetworkDebugPanelActiveTextSelection",
]

KEEP_REFRESH_UI = True  # refreshUi stays in script


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


def main() -> None:
    text = SCRIPT.read_text(encoding="utf-8")
    lines = text.splitlines()

    if "initScriptNetwork" in text:
        print("already wired")
        return

    remove = [f for f in REMOVE_FUNCS if f != "refreshUiAfterSharedWorldApply" or not KEEP_REFRESH_UI]
    remove_set = set(remove)
    to_delete: list[tuple[int, int]] = []
    for name in remove:
        rng = find_function_range(lines, name)
        if rng:
            to_delete.append(rng)
        else:
            print("warn: not found", name)

    for start, end in sorted(to_delete, reverse=True):
        del lines[start : end + 1]

    bindings = BINDINGS.read_text(encoding="utf-8")

    wrappers = """
/** @type {ReturnType<typeof initScriptNetwork> | null} */
let _networkApi = null;

""" + bindings + """

function initOvcScriptNetworkLayer() {
  _networkApi = initScriptNetwork(buildNetworkDeps());
}

""" + "\n".join(
        f"function {name}{'(...args)' if name != 'getSharedWorldSnapshot' else '()'} {{ return _networkApi.{name}({'...args' if '...' in '' else ''}); }}"
        for name in [
            "addNetworkDebugLog",
            "applyServerWorldRowTimestamps",
            "pollWorldState",
            "syncWorldState",
            "saveSharedWorldAndReload",
            "getSharedWorldSnapshot",
            "applySharedWorldSnapshot",
            "ingestSharedPlantIndexBonus",
            "syncServerClockOffsetFromRowUpdatedAt",
            "holdLocalPlantStateAgainstStaleSnapshot",
            "holdLocalAppleStateAgainstStaleSnapshot",
            "flushPassiveSimulationBeforeSharedSnapshot",
            "setupMultiplayer",
            "sendMultiplayerPresence",
            "renderRemotePlayersFromPresence",
            "broadcastBucketState",
            "handleRemoteBucketBroadcast",
            "sendMultiplayerLeave",
        ]
    )

    # fix wrappers properly
    wrapper_lines = [
        "/** @type {ReturnType<typeof initScriptNetwork> | null} */",
        "let _networkApi = null;",
        "",
        bindings.strip(),
        "",
        "function initOvcScriptNetworkLayer() {",
        "  _networkApi = initScriptNetwork(buildNetworkDeps());",
        "}",
        "",
    ]
    api_names = [
        ("addNetworkDebugLog", "message"),
        ("applyServerWorldRowTimestamps", "row"),
        ("pollWorldState", "forcePoll"),
        ("syncWorldState", "forceSave, options"),
        ("saveSharedWorldAndReload", "options"),
        ("getSharedWorldSnapshot", ""),
        ("applySharedWorldSnapshot", "snapshot, serverRowUpdatedAt"),
        ("ingestSharedPlantIndexBonus", "snapshot"),
        ("syncServerClockOffsetFromRowUpdatedAt", "serverRowUpdatedAt"),
        ("holdLocalPlantStateAgainstStaleSnapshot", "ms"),
        ("holdLocalAppleStateAgainstStaleSnapshot", "ms"),
        ("flushPassiveSimulationBeforeSharedSnapshot", ""),
        ("setupMultiplayer", ""),
        ("sendMultiplayerPresence", "forceSend"),
        ("renderRemotePlayersFromPresence", "presenceState"),
        ("broadcastBucketState", "forceSend"),
        ("handleRemoteBucketBroadcast", "payload"),
        ("sendMultiplayerLeave", ""),
    ]
    for name, params in api_names:
        call = f"_networkApi.{name}({params})" if params else f"_networkApi.{name}()"
        wrapper_lines.append(f"function {name}({params}) {{ return {call}; }}")
        wrapper_lines.append("")

    # import
    for i, line in enumerate(lines):
        if line.startswith("import { createGameLoop"):
            lines.insert(i + 1, 'import { initScriptNetwork } from "./src/script/network/index.js";')
            break

    # replace old poll sync block
    block_start = None
    for i, line in enumerate(lines):
        if "let _worldPollSync = null" in line or "Network/Sync — world row" in line:
            block_start = i
            break
    block_end = None
    if block_start is not None:
        for j in range(block_start, min(block_start + 30, len(lines))):
            if lines[j].startswith("function dropHeldItem"):
                block_end = j
                break
    if block_start is not None and block_end is not None:
        lines[block_start:block_end] = wrapper_lines + ["\n"]

    # remove old _worldPollSync init (createWorldPollSync block)
    new_text = "\n".join(lines)
    new_text = re.sub(
        r"\n_worldPollSync = createWorldPollSync\(\{[\s\S]*?\}\);\n",
        "\ninitOvcScriptNetworkLayer();\n",
        new_text,
        count=1,
    )

    # remove duplicate imports
    new_text = new_text.replace(
        'import { createWorldPollSync } from "./src/script/world-poll-sync.js";\n', ""
    )

    SCRIPT.write_text(new_text + "\n", encoding="utf-8", newline="\n")
    print("wired", SCRIPT)


if __name__ == "__main__":
    main()
