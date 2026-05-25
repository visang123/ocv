"""Insert _viewApi wrappers after initOvcScriptViewLayer."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
VIEW = ROOT / "src" / "script" / "view"


def exported_functions() -> list[str]:
    names: list[str] = []
    for path in sorted(VIEW.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
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


def signatures() -> dict[str, str]:
    sigs: dict[str, str] = {}
    for path in VIEW.glob("*.js"):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"^\s+function\s+(\w+)\s*\(([^)]*)\)", text, re.M):
            sigs[m.group(1)] = m.group(2).strip()
    return sigs


def wrapper_line(name: str, params: str) -> str:
    if params:
        args = ", ".join(p.split("=")[0].strip() for p in params.split(","))
        return f"function {name}({params}) {{ return _viewApi.{name}({args}); }}"
    return f"function {name}() {{ return _viewApi.{name}(); }}"


def main() -> None:
    exports = exported_functions()
    sigs = signatures()
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()

    insert_at = None
    for i, line in enumerate(lines):
        if line.strip() == "function initOvcScriptViewLayer() {":
            for j in range(i, len(lines)):
                if lines[j].strip() == "}":
                    insert_at = j + 1
                    break
            break
    if insert_at is None:
        raise SystemExit("initOvcScriptViewLayer not found")
    if any("_viewApi.renderPlayerPosition" in ln for ln in lines):
        print("view wrappers already present")
        return

    block = ["", "/** View layer wrappers (src/script/view/) */"]
    for name in exports:
        block.append(wrapper_line(name, sigs.get(name, "")))
    block.append("")

    for j, ln in enumerate(block):
        lines.insert(insert_at + j, ln)
    SCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("added", len(exports), "wrappers at", insert_at)


if __name__ == "__main__":
    main()
