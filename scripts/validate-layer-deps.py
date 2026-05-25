"""Validate buildLayerDeps / buildNetworkDeps identifiers exist in script.js."""
from __future__ import annotations

import re
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent.parent / "script.js"
text = SCRIPT.read_text(encoding="utf-8")
lines = text.splitlines()


def scope_names() -> set[str]:
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


def deps_in_fn(fn_name: str) -> list[str]:
    start = next(i for i, l in enumerate(lines) if l.strip() == f"function {fn_name}() {{")
    end = next(
        i
        for i in range(start + 1, len(lines))
        if lines[i].strip() == "};" and lines[i + 1].strip() == "}"
    )
    body = lines[start + 1 : end]
    names: list[str] = []
    for line in body:
        line = line.strip()
        if not line or line.startswith("//"):
            continue
        m = re.match(r"^(?:get|set)\s+(\w+)\s*\(", line)
        if m:
            names.append(m.group(1))
            continue
        m = re.match(r"^(\w+),?$", line)
        if m:
            names.append(m.group(1))
    return names


scope = scope_names()
for fn in ("buildNetworkDeps", "buildLayerDeps"):
    missing = sorted({n for n in deps_in_fn(fn) if n not in scope})
    print(fn, "entries", len(deps_in_fn(fn)), "missing", len(missing))
    for n in missing[:40]:
        print(" ", n)
    if len(missing) > 40:
        print(" ...")
