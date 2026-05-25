"""Fix script.js after partial systems wire: remove bad block, insert clean systems + wrappers."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
BINDINGS = ROOT / "src" / "script" / "systems" / "_bindings-snippet.js"
SYS = ROOT / "src" / "script" / "systems"

NETWORK_WRAPPERS = [
    "addNetworkDebugLog",
    "applyServerWorldRowTimestamps",
    "syncWorldState",
    "saveSharedWorldAndReload",
    "pollWorldState",
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
            if ch == "{": brace += 1; started = True
            elif ch == "}": brace -= 1
        if started and brace == 0:
            return start, j
    return None


def exported_functions() -> list[str]:
    names: list[str] = []
    for path in sorted(SYS.glob("*.js")):
        if path.name in ("index.js", "_bindings-snippet.js"):
            continue
        text = path.read_text(encoding="utf-8")
        idx = text.rfind("return {")
        if idx < 0:
            continue
        m = re.search(r"return\s*\{([^}]+)\}", text[idx:], re.S)
        if not m:
            continue
        for part in m.group(1).split(","):
            n = part.strip()
            if re.match(r"^\w+$", n):
                names.append(n)
    return sorted(set(names))


def wrapper_for(name: str, lines: list[str]) -> str:
    rng = find_function_range(lines, name)
    params = ""
    if rng:
        hdr = lines[rng[0]]
        m = re.match(r"^function \w+\s*\((.*?)\)\s*\{", hdr)
        if m:
            params = m.group(1).strip()
    if params:
        return f"function {name}({params}) {{ return _systemsApi.{name}({params}); }}"
    return f"function {name}() {{ return _systemsApi.{name}(); }}"


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    bindings = BINDINGS.read_text(encoding="utf-8").strip()

    # Remove bad systems block through duplicate network wrappers
    start = None
    for i, line in enumerate(lines):
        if "/** Systems/Logic — src/script/systems/ */" in line:
            start = i
            break
    end = None
    if start is not None:
        for i in range(start, len(lines)):
            if lines[i].startswith("/**") and "Plant timestamps in snapshots" in lines[i]:
                end = i
                break
            if lines[i].strip().startswith("/**") and i > start + 10 and "Plant timestamps" in lines[i]:
                end = i
                break
        if end is None:
            for i in range(start, len(lines)):
                if "Plant timestamps in snapshots" in lines[i]:
                    end = i
                    break
    if start is not None and end is not None:
        del lines[start:end]

    # Also find by rebasePlant comment
    if start is None:
        for i, line in enumerate(lines):
            if line.strip() == "function initOvcScriptSystemsLayer() {":
                start = i
                break
        if start:
            for j in range(start, len(lines)):
                if lines[j].strip().startswith("/**") and "Plant timestamps" in lines[j]:
                    end = j
                    break
            if end:
                del lines[start:end]

    exports = exported_functions()
    original = SCRIPT.read_text(encoding="utf-8").splitlines()

    block = [
        "",
        "/** Systems/Logic — src/script/systems/ */",
        "/** @type {ReturnType<typeof initScriptSystems> | null} */",
        "let _systemsApi = null;",
        "",
        bindings,
        "",
        "function initOvcScriptSystemsLayer() {",
        "  _systemsApi = initScriptSystems(buildSystemsDeps());",
        "}",
        "",
    ]
    for name in exports:
        block.append(wrapper_for(name, original))
    block.append("")

    net_block = [wrapper_for(n, original).replace("_systemsApi", "_networkApi") for n in NETWORK_WRAPPERS]
    net_block.append("")

    # Insert after initOvcScriptNetworkLayer
    insert_at = None
    for i, line in enumerate(lines):
        if line.strip() == "}" and i > 0 and "initScriptNetwork" in lines[i - 1]:
            insert_at = i + 1
            break
    if insert_at is None:
        for i, line in enumerate(lines):
            if line.strip() == "function initOvcScriptNetworkLayer() {":
                for j in range(i, len(lines)):
                    if lines[j].strip() == "}":
                        insert_at = j + 1
                        break
                break

    if insert_at is None:
        raise SystemExit("insert point not found")

    for j, ln in enumerate(block + net_block):
        lines.insert(insert_at + j, ln)

    # init calls
    text = "\n".join(lines)
    if "initOvcScriptSystemsLayer();" not in text:
        text = text.replace(
            "initOvcScriptNetworkLayer();",
            "initOvcScriptNetworkLayer();\ninitOvcScriptSystemsLayer();",
            1,
        )

    SCRIPT.write_text(text + "\n", encoding="utf-8", newline="\n")
    print("fixed", SCRIPT, "wrappers", len(exports), "+ network", len(NETWORK_WRAPPERS))


if __name__ == "__main__":
    main()
