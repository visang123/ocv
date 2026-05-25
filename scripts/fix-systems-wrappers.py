"""Regenerate script.js systems wrappers with correct parameter lists."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"


def collect_signatures() -> dict[str, str]:
    sigs: dict[str, str] = {}
    for path in sorted(SYS.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"^\s+function\s+(\w+)\s*\(([^)]*)\)", text, re.M):
            sigs[m.group(1)] = m.group(2).strip()
    return sigs


def main() -> None:
    sigs = collect_signatures()
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    out: list[str] = []
    i = 0
    replaced = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^function (\w+)\([^)]*\) \{ return _systemsApi\.\1\([^)]*\); \}$", line)
        if not m:
            m = re.match(r"^function (\w+)\(\) \{ return _systemsApi\.\1\(\); \}$", line)
        if m and m.group(1) in sigs:
            name = m.group(1)
            params = sigs[name]
            if params:
                args = ", ".join(p.split("=")[0].strip() for p in params.split(","))
                out.append(f"function {name}({params}) {{ return _systemsApi.{name}({args}); }}")
            else:
                out.append(f"function {name}() {{ return _systemsApi.{name}(); }}")
            replaced += 1
            i += 1
            continue
        out.append(line)
        i += 1
    SCRIPT.write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
    print("updated wrappers", replaced, "of", len(sigs))


if __name__ == "__main__":
    main()
