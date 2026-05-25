"""Emit view-only bindings for buildLayerDeps (symbols not already in systems snippet)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIEW = ROOT / "src" / "script" / "view"
SYS_SNIP = ROOT / "src" / "script" / "systems" / "_bindings-snippet.js"
OUT = ROOT / "src" / "script" / "view" / "_bindings-snippet.js"

MUTABLE = {
    "bagInventoryPanelOpen",
    "bagInventoryDragState",
    "worldChatPanelOpen",
    "worldChatUserPickerOpen",
    "settingsOverlayOpen",
    "guideCardOpen",
    "plantHoverLabelPlantId",
    "plantHoverRingPlantId",
    "onboardingInventoryCloseHintTimer",
    "localChatBubbleText",
    "playerAlertText",
    "playerAlertVisible",
    "adminAccountsRenderCache",
}


def systems_keys() -> set[str]:
    text = SYS_SNIP.read_text(encoding="utf-8")
    keys: set[str] = set()
    for m in re.finditer(r"^\s+(?:get |set )?(\w+)", text, re.M):
        keys.add(m.group(1))
    return keys


def main() -> None:
    syms: set[str] = set()
    for f in VIEW.glob("*.js"):
        if f.name.startswith("_") or f.name == "index.js":
            continue
        text = f.read_text(encoding="utf-8")
        for m in re.findall(r"\bd\.([a-zA-Z_][a-zA-Z0-9_]{2,})\b", text):
            syms.add(m)
    already = systems_keys()
    extra = sorted(syms - already)
    lines = ["/* view-only deps (merged into buildLayerDeps) */", "  return {"]
    for sym in extra:
        if sym in MUTABLE:
            lines.append(f"    get {sym}() {{ return {sym}; }},")
            lines.append(f"    set {sym}(v) {{ {sym} = v; }},")
        else:
            lines.append(f"    {sym},")
    lines.append("  };")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wrote", OUT, "view-only count", len(extra), "total d.", len(syms))


if __name__ == "__main__":
    main()
