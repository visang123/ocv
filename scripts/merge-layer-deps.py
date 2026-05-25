"""Rename buildSystemsDeps → buildLayerDeps and merge view-only bindings."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
VIEW_SNIP = ROOT / "src" / "script" / "view" / "_bindings-snippet.js"


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    view_extra: list[str] = []
    for line in VIEW_SNIP.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("/*") or s.startswith("return {") or s == "};":
            continue
        view_extra.append(line if line.startswith("    ") else "    " + line.rstrip(","))

    start = end = None
    for i, line in enumerate(lines):
        if line.strip() in ("function buildSystemsDeps() {", "function buildLayerDeps() {"):
            start = i
        if start is not None and end is None and i > start and line.strip() == "};" and lines[i + 1].strip() == "}":
            end = i
            break

    if start is None or end is None:
        raise SystemExit("buildSystemsDeps/buildLayerDeps block not found")

    existing_keys: set[str] = set()
    for line in lines[start:end]:
        m = re.match(r"^\s+(?:get |set )?(\w+)", line)
        if m:
            existing_keys.add(m.group(1))

    insert_lines = []
    for ve in view_extra:
        m = re.match(r"^\s+(?:get |set )?(\w+)", ve)
        if m and m.group(1) in existing_keys:
            continue
        insert_lines.append(ve if ve.rstrip().endswith(",") else ve + ",")

    new_block = (
        ["function buildLayerDeps() {"]
        + lines[start + 1 : end]
        + insert_lines
        + lines[end : start + 1 + (end - start)]  # wrong
    )
    # simpler: replace slice
    head = lines[:start]
    body = ["function buildLayerDeps() {"] + lines[start + 1 : end] + insert_lines + [lines[end], lines[end + 1]]
    tail = lines[end + 2 :]
    lines = head + body + tail

    text = "\n".join(lines)
    text = text.replace(
        "function assignExtraSeedInventoryOwner(d.seed)",
        "function assignExtraSeedInventoryOwner(seed)",
    )
    SCRIPT.write_text(text + "\n", encoding="utf-8", newline="\n")
    print("merged", len(insert_lines), "view-only bindings into buildLayerDeps")


if __name__ == "__main__":
    main()
