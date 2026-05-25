"""Apply d. prefix to script-scope symbols in systems modules."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"

SKIP_PREFIX = {
    "function", "return", "if", "else", "try", "catch", "finally",
    "const", "let", "var", "new", "typeof", "undefined", "null",
    "true", "false", "window", "document", "Object", "Array",
    "String", "Number", "Boolean", "Math", "Date", "Promise", "JSON",
    "setTimeout", "performance", "keys",
    "for", "while", "switch", "case", "break", "continue", "do", "in", "of",
    "await", "async", "throw", "delete", "this", "super", "default", "export",
    "import", "from", "div", "img", "span",
}

NO_PREFIX = {
    "parseMainPlantFromSnapshot",
    "resolveSnapshotSavedAt",
    "tickPlayerHealthState",
    "getSynchronizedNowCore",
    "shouldDrainPlayerHealth",
    "canPlayerMoveByHealth",
    "clampPlayerHealth",
    "healPlayerHealth",
    "isPlayerHealthDepleted",
}


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


def module_export_names(text: str) -> set[str]:
    return {m.group(1) for m in re.finditer(r"^\s+function\s+(\w+)\s*\(", text, re.M)}


def prefix_line(line: str, need: set[str], decl_local: str | None) -> str:
    def repl(m: re.Match[str]) -> str:
        sym = m.group(1)
        if sym == decl_local or sym not in need:
            return sym
        return "d." + sym

    return re.sub(r"(?<![.\w])([a-zA-Z_][a-zA-Z0-9_]*)\b", repl, line).replace("d.d.", "d.")


def main() -> None:
    script_lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    script_scope = script_scope_symbols(script_lines)

    all_exports: set[str] = set()
    modules: dict[Path, set[str]] = {}
    for path in sorted(SYS.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        text = path.read_text(encoding="utf-8")
        exports = module_export_names(text)
        modules[path] = exports
        all_exports |= exports

    for path, exports in modules.items():
        need = (script_scope | all_exports) - exports - SKIP_PREFIX - NO_PREFIX
        lines = path.read_text(encoding="utf-8").splitlines()
        out: list[str] = []
        for line in lines:
            stripped = line.lstrip()
            if stripped.startswith("//") or stripped.startswith("*") or stripped.startswith("/*"):
                out.append(line)
                continue
            dm = re.match(r"^(\s*(?:const|let|var)\s+)([a-zA-Z_]\w*)", line)
            decl_local = dm.group(2) if dm else None
            out.append(prefix_line(line, need, decl_local))
        path.write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
        print("prefixed", path.name)

    print("done")


if __name__ == "__main__":
    main()
