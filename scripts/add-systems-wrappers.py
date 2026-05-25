"""Add systems API wrappers to script.js after initOvcScriptSystemsLayer."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"


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


def main() -> None:
    exports = exported_functions()
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()

    # fix broken plant comment block
    for i, line in enumerate(lines):
        if line.strip().startswith("* Plant timestamps in snapshots"):
            lines[i] = "/**" + line.lstrip()
            break

    insert_at = None
    for i, line in enumerate(lines):
        if line.strip() == "function initOvcScriptSystemsLayer() {":
            for j in range(i, len(lines)):
                if lines[j].strip() == "}":
                    insert_at = j + 1
                    break
            break

    if insert_at is None:
        raise SystemExit("initOvcScriptSystemsLayer not found")

    block = [""]
    for name in exports:
        block.append(f"function {name}() {{ return _systemsApi.{name}(); }}")
    block.append("")

    # skip if already has tickPlayerPosition wrapper
    if any("_systemsApi.tickPlayerPosition" in ln for ln in lines):
        print("wrappers seem present")
        SCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
        return

    for j, ln in enumerate(block):
        lines.insert(insert_at + j, ln)

    SCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("added", len(exports), "wrappers at", insert_at)


if __name__ == "__main__":
    main()
