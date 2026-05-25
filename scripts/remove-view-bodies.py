"""Remove view function bodies from script.js (keep one-line wrappers)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
VIEW = ROOT / "src" / "script" / "view"


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


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    exports = exported_functions()
    removed = 0
    for name in sorted(exports, key=len, reverse=True):
        while True:
            rng = find_function_range(lines, name)
            if not rng:
                break
            start, end = rng
            if "_viewApi." in lines[start] or "_systemsApi." in lines[start]:
                break
            del lines[start : end + 1]
            removed += 1
    SCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("removed", removed, "bodies for", len(exports), "exports")


if __name__ == "__main__":
    main()
