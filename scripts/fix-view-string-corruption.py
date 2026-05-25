"""Fix erroneous d. prefixes inside strings and DOM tokens in view modules."""
from __future__ import annotations

import re
from pathlib import Path

VIEW = Path(__file__).resolve().parent.parent / "src" / "script" / "view"

REPLACEMENTS = [
    ('"starter-d.seed"', '"starter-seed"'),
    ("'starter-d.seed'", "'starter-seed'"),
    ('=== "starter-d.seed"', '=== "starter-seed"'),
    ('itemKey === "d.seed"', 'itemKey === "seed"'),
    ('data-bag-type="d.seed"', 'data-bag-type="seed"'),
    ('"is-d.seed-inventory', '"is-seed-inventory'),
    ('"d.world-plant-index-hud"', '"world-plant-index-hud"'),
    ('"d.ground-rock-"', '"ground-rock-"'),
    ('"d.world-d.ground-rock"', '"world-ground-rock"'),
    ('"d.world-craft-furniture', '"world-craft-furniture'),
    ('"d.world-extra-d.bucket"', '"world-extra-bucket"'),
    ('chatKind === "whisper" ? "whisper" : "d.world"', 'chatKind === "whisper" ? "whisper" : "world"'),
    ('dataset.speaker !== "d.player"', 'dataset.speaker !== "player"'),
    ('speaker === "d.player"', 'speaker === "player"'),
    ('id: "starter-d.seed"', 'id: "starter-seed"'),
    ('id === "starter-d.seed"', 'id === "starter-seed"'),
    ('.remove("is-d.seed-inventory', '.remove("is-seed-inventory'),
    ('.add("is-d.seed-inventory', '.add("is-seed-inventory'),
    ('.toggle("is-d.seed-inventory', '.toggle("is-seed-inventory'),
    ('classList.remove("is-d.seed', 'classList.remove("is-seed'),
    ('worldBagInventory.classList.remove("is-d.seed', 'worldBagInventory.classList.remove("is-seed'),
    ('"is-d.well-dock"', '"is-well-dock"'),
    ('"is-d.world-npc-name"', '"is-world-npc-name"'),
    ('"is-plant-d.world-sign"', '"is-plant-world-sign"'),
    ('contains("is-d.world-npc-name")', 'contains("is-world-npc-name")'),
    ('contains("is-d.well-dock")', 'contains("is-well-dock")'),
    (': "d.world"', ': "world"'),
    ("(d.seed.isStarter || d.seed.id", "(seed.isStarter || seed.id"),
]


def fix_assign_extra_seed_owner(text: str) -> str:
    return text.replace(
        """  function assignExtraSeedInventoryOwner(seed) {
  if (!d.seed) return;
  d.seed.ownerUserId = d.getLocalExtraSeedOwnerUserId();
  d.seed.ownerSessionId = d.getLocalExtraSeedOwnerSessionId();
  }""",
        """  function assignExtraSeedInventoryOwner(seed) {
  if (!seed) return;
  seed.ownerUserId = d.getLocalExtraSeedOwnerUserId();
  seed.ownerSessionId = d.getLocalExtraSeedOwnerSessionId();
  }""",
    )


def main() -> None:
    for path in sorted(VIEW.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        if path.name == "inventory-bag.js":
            text = fix_assign_extra_seed_owner(text)
        for old, new in REPLACEMENTS:
            text = text.replace(old, new)
        # object key d.seed: -> seed:
        text = re.sub(r"(\n\s+)d\.seed:", r"\1seed:", text)
        path.write_text(text, encoding="utf-8", newline="\n")
        print("fixed", path.name)


if __name__ == "__main__":
    main()
