"""
Extract Systems/Logic functions from script.js into src/script/systems/*.js
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"

SKIP_PREFIX = {
    "function", "return", "if", "else", "try", "catch", "finally",
    "const", "let", "var", "new", "typeof", "undefined", "null",
    "true", "false", "window", "document", "Object", "Array",
    "String", "Number", "Boolean", "Math", "Date", "Promise", "JSON",
    "setTimeout", "performance", "keys",
    "for", "while", "switch", "case", "break", "continue", "do", "in", "of",
    "await", "async", "throw", "delete", "this", "super", "default", "export",
    "import", "from", "div", "img", "span",
}

NO_PREFIX = {
    "parseMainPlantFromSnapshot",
    "resolveSnapshotSavedAt",
    "tickPlayerHealthState",
    "getSynchronizedNowCore",
    "shouldDrainPlayerHealth",
    "canPlayerMoveByHealth",
    "clampPlayerHealth",
    "healPlayerHealth",
    "isPlayerHealthDepleted",
}


def layer(name: str) -> str:
    n = name.lower()
    if "render" in n or "updatecamera" in n or "rebuild" in n:
        return "view"
    if "multiplayer" in n or "snapshot" in n or "pollworld" in n:
        return "network"
    return "systems"


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


def callees_in_script(lines: list[str], func_ranges: dict, name: str) -> set[str]:
    if name not in func_ranges:
        return set()
    s, e = func_ranges[name]
    body = "\n".join(lines[s + 1 : e])
    return {
        c
        for c in re.findall(r"(?<![.\w])([a-z][a-zA-Z0-9_]*)\s*\(", body)
        if c not in SKIP_PREFIX and len(c) > 2 and c in func_ranges
    }


def closure(lines: list[str], func_ranges: dict, seeds: list[str]) -> list[str]:
    seen: set[str] = set()
    queue = list(seeds)
    while queue:
        n = queue.pop()
        if n in seen:
            continue
        seen.add(n)
        for c in callees_in_script(lines, func_ranges, n):
            if c not in seen:
                queue.append(c)
    return sorted(seen)


def build_func_ranges(lines: list[str]) -> dict[str, tuple[int, int]]:
    func_ranges: dict[str, tuple[int, int]] = {}
    for i, line in enumerate(lines):
        m = re.match(r"^function (\w+)", line)
        if not m:
            continue
        name = m.group(1)
        rng = find_function_range(lines, name)
        if rng:
            func_ranges[name] = rng
    return func_ranges


def script_scope_symbols(lines: list[str]) -> set[str]:
    """Top-level bindings in script.js (deps passed via buildSystemsDeps)."""
    names: set[str] = set()
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^function (\w+)\s*\(", line)
        if m:
            names.add(m.group(1))
        m = re.match(r"^(?:const|let|var)\s+(\w+)", line)
        if m:
            names.add(m.group(1))
        if line.startswith("import "):
            block = [line]
            while "from" not in block[-1] and i + 1 < len(lines):
                i += 1
                block.append(lines[i])
            blob = "\n".join(block)
            m = re.search(r"\{([^}]+)\}", blob, re.S)
            if m:
                for part in m.group(1).split(","):
                    part = part.strip()
                    if part:
                        names.add(part.split(" as ")[-1].strip())
            else:
                m = re.match(r"^import\s+(\w+)", line)
                if m:
                    names.add(m.group(1))
        i += 1
    return names


def prefix_line(line: str, symbols: list[str]) -> str:
    decl_local: str | None = None
    dm = re.match(r"^(\s*(?:const|let|var)\s+)([a-zA-Z_]\w*)", line)
    if dm:
        decl_local = dm.group(2)
    out = line
    for sym in symbols:
        if sym in SKIP_PREFIX or sym in NO_PREFIX or sym == decl_local:
            continue
        out = re.sub(r"(?<![.\w])" + re.escape(sym) + r"(?![.\w])", "d." + sym, out)
    return out.replace("d.d.", "d.")


def prefix_body(body: str, extra_symbols: set[str]) -> str:
    symbols = sorted(extra_symbols, key=len, reverse=True)
    out_lines: list[str] = []
    for line in body.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("/*"):
            out_lines.append(line)
        else:
            out_lines.append(prefix_line(line, symbols))
    return "\n".join(out_lines)


def extract_function(lines: list[str], name: str, symbols: set[str], module_funcs: set[str]) -> str:
    rng = find_function_range(lines, name)
    if not rng:
        raise SystemExit(f"function not found: {name}")
    start, end = rng
    header = lines[start].rstrip()
    if not header.startswith("  "):
        header = "  " + header
    body = prefix_body("\n".join(lines[start + 1 : end]), symbols)
    return header + "\n" + body + "\n  }\n"


def prefix_symbols_for_module(
    script_scope: set[str],
    all_systems_funcs: set[str],
    module_funcs: list[str],
) -> set[str]:
    own = set(module_funcs)
    return (script_scope | all_systems_funcs) - own - SKIP_PREFIX - NO_PREFIX


def write_module(
    path: Path,
    header: str,
    func_names: list[str],
    lines: list[str],
    script_scope: set[str],
    all_systems_funcs: set[str],
    imports: str = "",
) -> None:
    symbols = prefix_symbols_for_module(script_scope, all_systems_funcs, func_names)
    parts = [header]
    if imports:
        parts.extend([imports, ""])
    parts.append("export function createModule(d) {")
    for fn in func_names:
        parts.append(extract_function(lines, fn, symbols, set(func_names)))
    parts.append("  return {")
    for fn in func_names:
        parts.append(f"    {fn},")
    parts.append("  };")
    parts.append("}")
    parts.append("")
    path.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print("wrote", path, len(func_names), "funcs")


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    func_ranges = build_func_ranges(lines)
    SYS.mkdir(parents=True, exist_ok=True)
    script_scope = script_scope_symbols(lines)

    movement_seeds = ["tickPlayerPosition"]
    movement_exclude = {
        "setWorldPosition", "setWorldSize", "updatePlayerColorBodyPosition",
        "syncLocalPlayerPoseVisual", "sendMultiplayerPresence", "getTintedPlayerSrc",
        "needsDarkOutline", "shouldApplyLocalPlayerTint", "resetPlayerChairSitState",
        "syncCharacterPreviewVisual", "sitOnCraftChair", "renderPlayerPosition",
    }
    movement = [f for f in closure(lines, func_ranges, movement_seeds) if f not in movement_exclude]

    health = closure(lines, func_ranges, ["tickPlayerHealth", "getPlayerHealthTickContext"])

    world_ticks = closure(
        lines,
        func_ranges,
        ["respawnApplesIfNeeded", "tickWorldRockRespawn", "tickWorldBagDropDespawn", "refillWellIfNeeded"],
    )

    plant_water = closure(
        lines,
        func_ranges,
        ["applyPlantWaterDecay", "updatePlantWaterLevel", "shouldPauseWaterDecayForPlant"],
    )

    butterflies = closure(lines, func_ranges, ["updateButterflies"])

    remote = ["pruneStaleRemotePlayers", "updateRemotePlayerCount"]

    all_systems_funcs = set(
        movement + health + world_ticks + plant_water + butterflies + remote
    )

    write_module(
        SYS / "player-movement.js",
        "/** Systems — 플레이어 이동·충돌 (DOM 없음, 좌표만). */",
        movement,
        lines,
        script_scope,
        all_systems_funcs,
    )
    write_module(
        SYS / "player-health.js",
        "/** Systems — 플레이어 체력 틱. */",
        health,
        lines,
        script_scope,
        all_systems_funcs,
        'import { tickPlayerHealthState } from "../../game/player-health.js";',
    )
    write_module(
        SYS / "world-ticks.js",
        "/** Systems — 사과/우물/바위/가방 드롭 등 월드 리스폰·리필. */",
        world_ticks,
        lines,
        script_scope,
        all_systems_funcs,
    )
    write_module(
        SYS / "plant-water.js",
        "/** Systems — 식물 수분·감쇠 규칙. */",
        plant_water,
        lines,
        script_scope,
        all_systems_funcs,
    )
    write_module(
        SYS / "butterflies.js",
        "/** Systems — 나비 시뮬레이션. */",
        butterflies,
        lines,
        script_scope,
        all_systems_funcs,
    )
    write_module(
        SYS / "remote-prune.js",
        "/** Systems — 오래된 원격 플레이어 정리. */",
        remote,
        lines,
        script_scope,
        all_systems_funcs,
    )
    print("done")


if __name__ == "__main__":
    main()
