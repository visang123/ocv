"""Emit buildSystemsDeps() for script.js from d.* usage in src/script/systems."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SYS = ROOT / "src" / "script" / "systems"
OUT = ROOT / "src" / "script" / "systems" / "_bindings-snippet.js"

SYSTEMS_EXPORTS: set[str] = set()  # filled by reading module exports

MUTABLE = {
    "playerPositionChangedThisTick",
    "lastButterflyWallClockMs",
    "lastButterflyStateChangeAt",
    "hasSeededInitialButterflies",
    "gameLoopCyclesForTutorialSync",
    "localApplePickedAtById",
    "adminDebugPlantIndexBonus",
    "butterflyState",
    "butterflyAuthorityWaypointById",
    "butterflyRenderById",
    "placedCraftFurniture",
    "remotePlayers",
    "keys",
    "isCharacterSelecting",
    "hasSpawnedCharacter",
    "hasHydratedSharedWorldFromServer",
    "isTabSessionSuperseded",
    "currentSessionId",
    "currentUserId",
    "selectedPlayerColor",
    "hasChosenPlayerColor",
    "craftFurnitureInstallingKind",
    "isWorldDirty",
    "networkDebugLines",
}


def main() -> None:
    syms: set[str] = set()
    for f in SYS.glob("*.js"):
        if f.name.startswith("_"):
            continue
        text = f.read_text(encoding="utf-8")
        for m in re.findall(r"\bd\.([a-zA-Z_][a-zA-Z0-9_]{2,})\b", text):
            if m[0].islower() or m in ("WORLD_WIDTH", "PLAYER_WIDTH", "HELD_ITEM_BUCKET"):
                syms.add(m)

    lines = ["function buildSystemsDeps() {", "  return {"]
    for sym in sorted(syms):
        if sym in SYSTEMS_EXPORTS:
            continue
        if sym in MUTABLE:
            lines.append(f"    get {sym}() {{ return {sym}; }},")
            lines.append(f"    set {sym}(v) {{ {sym} = v; }},")
        else:
            lines.append(f"    {sym},")
    lines.extend(["  };", "}"])
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wrote", OUT, "count", len(syms))


if __name__ == "__main__":
    main()
