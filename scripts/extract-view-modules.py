"""
Extract View-layer functions from script.js into src/script/view/*.js
"""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
LAYERS = ROOT / "src" / "script" / "layers.js"
VIEW = ROOT / "src" / "script" / "view"
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

NO_PREFIX = set()


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


def script_scope_symbols(lines: list[str]) -> set[str]:
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


def systems_export_names() -> set[str]:
    names: set[str] = set()
    for path in SYS.glob("*.js"):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        names.update(m.group(1) for m in re.finditer(r"^\s+function\s+(\w+)\s*\(", text, re.M))
    return names


def is_wrapper(line: str) -> bool:
    return "_systemsApi." in line or "_networkApi." in line or "_viewApi." in line


def view_body_functions(lines: list[str]) -> list[str]:
    layers = LAYERS.read_text(encoding="utf-8")
    view = {m.group(1) for m in re.finditer(r'  (\w+): "view"', layers)}
    bodies: list[str] = []
    for name in sorted(view):
        pat = re.compile(r"^function " + re.escape(name) + r"\s*\(")
        for line in lines:
            if pat.match(line):
                if not is_wrapper(line):
                    bodies.append(name)
                break
    return bodies


def module_for(name: str) -> str:
    n = name.lower()
    if any(
        k in n
        for k in (
            "baginventory", "bagitem", "bagpanel", "bagdiscard", "bagrequired",
            "bagclick", "bagground", "loadbag", "savebag", "removebag", "discardbag",
            "normalizebag", "finishbag", "clearbag", "ensurebag", "plantinventoryseed",
            "createstarterseed",
        )
    ) or name in (
        "canUseBagInventoryGameplay",
        "shouldShowWorldBagInventoryUi",
        "isOnboardingInventoryTutorialActive",
        "maybeAdvanceOnboardingAfterInventoryOpened",
        "maybeAdvanceOnboardingAfterInventoryClosed",
        "maybeAdvanceOnboardingAfterBookInventoryOpened",
        "onboardingClearInventoryCloseHintTimer",
        "scheduleOnboardingInventoryCloseHint",
        "assignExtraSeedInventoryOwner",
    ):
        return "inventory-bag"
    if any(
        k in n
        for k in (
            "planthover", "plantcard", "plantgrowth", "plantstate", "plantwater",
            "plantprogress", "sharedplant", "extraplant", "sproutimage", "soil",
            "waterneeded", "waterhover", "badsoil", "urgentwater",
        )
    ) or name.startswith(
        (
            "updatePlant",
            "renderPlant",
            "ensureSharedPlant",
            "teardownExtraPlant",
            "getPlant",
            "applyPlant",
            "clearPlant",
            "hidePlant",
            "restorePlant",
            "showPlant",
            "plantShows",
            "shouldHide",
            "shouldShowFirst",
            "shouldSkipPlant",
            "shouldSuppressPlant",
        )
    ):
        return "plant-visual"
    if any(k in n for k in ("updatecamera", "toscreen", "groundscreen", "initializezoom")):
        return "camera-screen"
    if any(
        k in n
        for k in (
            "renderplayer", "updateplayer", "synclocalplayer", "setworldposition",
            "setworldsize", "getplayerrendered", "synccharacterpreview", "toggleplayerhealth",
        )
    ):
        return "player-render"
    if any(
        k in n
        for k in (
            "updateapple", "updateworldrock", "rebuildworldrock", "rebuildworldbag",
            "updateworldbag", "updateworldextra", "updatebucket", "updateseedposition",
            "updateseedcard", "updateseeddry", "updateseedinventory", "createrandomapple",
            "createrandomworld", "loadrockinventory", "saverockinventory", "placedcraft",
            "craftchair", "updatewell",
        )
    ) or name in (
        "createRandomApples",
        "createRandomWorldRocks",
        "rebuildPlacedCraftFurnitureDom",
        "updatePlacedCraftFurnitureDom",
    ):
        return "world-dom"
    if any(
        k in n
        for k in (
            "updatenpc", "layoutnpc", "setnpcbubble", "worldnpc", "shownpc", "worldchat",
            "setlocalchat", "setplayerbubble", "speechbubble", "setworldchat",
            "updateplayerchat", "updateplayerbubble", "layoutworldchat", "worldchatbubble",
            "shouldshowincomingworldchat",
        )
    ):
        return "npc-chat"
    return "ui-chrome"


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


def prefix_body(body: str, symbols: set[str]) -> str:
    syms = sorted(symbols, key=len, reverse=True)
    out_lines: list[str] = []
    for line in body.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("/*"):
            out_lines.append(line)
        else:
            out_lines.append(prefix_line(line, syms))
    return "\n".join(out_lines)


def extract_function(lines: list[str], name: str) -> str:
    rng = find_function_range(lines, name)
    if not rng:
        raise SystemExit(f"function not found: {name}")
    start, end = rng
    header = lines[start].rstrip()
    if not header.startswith("  "):
        header = "  " + header
    body = "\n".join(lines[start + 1 : end])
    return header + "\n" + body + "\n  }\n"


def write_module(
    path: Path,
    header: str,
    func_names: list[str],
    lines: list[str],
) -> None:
    parts = [header, "", "export function createModule(d) {"]
    for fn in func_names:
        parts.append(extract_function(lines, fn))
    parts.append("  return {")
    for fn in func_names:
        parts.append(f"    {fn},")
    parts.append("  };")
    parts.append("}")
    parts.append("")
    path.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print("wrote", path.name, len(func_names), "funcs")


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    VIEW.mkdir(parents=True, exist_ok=True)
    bodies = view_body_functions(lines)

    grouped: dict[str, list[str]] = defaultdict(list)
    for name in bodies:
        grouped[module_for(name)].append(name)

    headers = {
        "player-render": "/** View — 로컬 플레이어 DOM·transform. */",
        "plant-visual": "/** View — 식물·수분 카드·호버 UI. */",
        "camera-screen": "/** View — 카메라·화면 좌표 변환. */",
        "world-dom": "/** View — 사과·바위·우물·씨앗·가방 DOM. */",
        "inventory-bag": "/** View — 가방 인벤토리 패널. */",
        "npc-chat": "/** View — NPC·채팅 말풍선. */",
        "ui-chrome": "/** View — 온보딩·설정·알림·가이드 UI. */",
    }

    for mod, funcs in sorted(grouped.items()):
        write_module(
            VIEW / f"{mod}.js",
            headers.get(mod, "/** View. */"),
            sorted(funcs),
            lines,
        )
    print("done", sum(len(v) for v in grouped.values()), "functions")


if __name__ == "__main__":
    main()
