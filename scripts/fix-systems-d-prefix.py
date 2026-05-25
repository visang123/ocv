"""Strip erroneous d. prefixes from systems modules (locals, keywords, DOM tags)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"


def script_scope_symbols(lines: list[str]) -> set[str]:
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


def systems_export_names() -> set[str]:
    names: set[str] = set()
    for path in SYS.glob("*.js"):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r"^\s+function (\w+)\s*\(", text, re.M):
            names.add(m.group(1))
        for m in re.finditer(r"^\s+(\w+),\s*$", text):
            if m.group(1) != "return":
                names.add(m.group(1))
    return names


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    valid = script_scope_symbols(lines) | systems_export_names()
    valid |= {
        "tickPlayerHealthState",
        "shouldDrainPlayerHealth",
        "canPlayerMoveByHealth",
        "clampPlayerHealth",
        "healPlayerHealth",
        "isPlayerHealthDepleted",
        "parseMainPlantFromSnapshot",
        "resolveSnapshotSavedAt",
        "getSynchronizedNowCore",
    }

    for path in sorted(SYS.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")

        def repl(m: re.Match[str]) -> str:
            sym = m.group(1)
            if sym in valid:
                return m.group(0)
            return sym

        text = re.sub(r"\bd\.([a-zA-Z_][a-zA-Z0-9_]*)\b", repl, text)
        path.write_text(text, encoding="utf-8", newline="\n")
        print("fixed", path.name)

    print("valid deps count", len(valid))


if __name__ == "__main__":
    main()
