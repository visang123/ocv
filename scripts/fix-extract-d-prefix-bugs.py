"""Fix erroneous `d.` prefixes from extract-network/systems scripts in src/script."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT_DIR = ROOT / "src" / "script"

DOM_REFS = (
    "ground",
    "bucket",
    "seed",
    "seedCard",
    "seedWorldText",
    "playerBucketOverlay",
    "treeAppleElements",
    "wellCard",
    "wellCardImage",
    "wellWaterText",
    "wellWaterFill",
    "well",
    "guideBookButton",
    "plantHoverLabel",
    "localPlayerRoot",
    "characterPreview",
    "playerBaseImage",
    "worldBagInventory",
    "playerAlert",
    "playerBubble",
    "playerChatBubbleEl",
    "playerColorBody",
    "playerHealthRoot",
    "playerHealthGaugeFill",
    "playerHealthGaugeLabel",
    "playerHealthGaugeEl",
    "playerHealthHeartBtn",
    "playerName",
)

STRING_FIXES = [
    ('"d.world-', '"world-'),
    (".world-d.ground-rock", ".world-ground-rock"),
    ("world-d.ground-rock", "world-ground-rock"),
    (".world-extra-d.bucket", ".world-extra-bucket"),
    ('"d.ground-rock-', '"ground-rock-'),
    ("is-carrying-d.bucket-full", "is-carrying-bucket-full"),
    ("is-carrying-d.bucket", "is-carrying-bucket"),
    (': "d.world"', ': "world"'),
    ("[d.bucket:render]", "[bucket:render]"),
    ("is-d.seed-inventory-hint", "is-seed-inventory-hint"),
    ("is-d.well-dock", "is-well-dock"),
    ("is-d.world-npc-name", "is-world-npc-name"),
    ("is-plant-d.world-sign", "is-plant-world-sign"),
]


def fix_text(text: str) -> str:
    for old, new in STRING_FIXES:
        text = text.replace(old, new)
    for ref in DOM_REFS:
        text = re.sub(rf"(?<!d\.)\b{ref}\.", rf"d.{ref}.", text)
    text = re.sub(r"(?<!d\.)placedCraftFurniture\.", "d.placedCraftFurniture.", text)
    text = re.sub(
        r"(?<!d\.)\blocalPlayerRoot && localPlayerRoot\.",
        "d.localPlayerRoot && d.localPlayerRoot.",
        text,
    )
    text = re.sub(
        r"(?<!d\.)(?<!remote)player && player\.parentNode",
        "d.player && d.player.parentNode",
        text,
    )
    text = re.sub(
        r"(?<!d\.)(?<!remotePlayer\.)player && player\b",
        "d.player && d.player",
        text,
    )
    text = re.sub(
        r"(?<!d\.)(?<!remotePlayer\.)player\b(?=\.(?:offsetHeight|offsetWidth|classList|style|src|getAttribute|getBoundingClientRect|replaceChildren|querySelector|addEventListener))",
        "d.player",
        text,
    )
    return text


def main() -> None:
    changed = []
    for path in sorted(SCRIPT_DIR.rglob("*.js")):
        raw = path.read_text(encoding="utf-8")
        fixed = fix_text(raw)
        if fixed != raw:
            path.write_text(fixed, encoding="utf-8", newline="\n")
            changed.append(path.relative_to(ROOT))
    print("fixed", len(changed), "files")
    for p in changed:
        print(" ", p)


if __name__ == "__main__":
    main()
