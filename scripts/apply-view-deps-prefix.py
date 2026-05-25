"""Apply d. prefix to script/systems symbols in view modules."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
VIEW = ROOT / "src" / "script" / "view"
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


STRING_RE = re.compile(r'("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')')


def prefix_code_chunk(chunk: str, need: set[str], decl_local: str | None) -> str:
    def repl(m: re.Match[str]) -> str:
        sym = m.group(1)
        if sym == decl_local or sym not in need:
            return sym
        return "d." + sym

    return re.sub(r"(?<![.\w])([a-zA-Z_][a-zA-Z0-9_]*)\b", repl, chunk).replace("d.d.", "d.")


def prefix_line(line: str, need: set[str], decl_local: str | None) -> str:
    if re.match(r"^\s+function\s+\w+\s*\(", line):
        return re.sub(
            r"^(\s+function\s+\w+\s*\()([^)]*)(\))",
            lambda m: m.group(1)
            + re.sub(r"\bd\.([a-zA-Z_]\w*)\b", r"\1", m.group(2))
            + m.group(3),
            line,
        )
    parts = STRING_RE.split(line)
    for i in range(0, len(parts), 2):
        parts[i] = prefix_code_chunk(parts[i], need, decl_local)
    return "".join(parts)


def main() -> None:
    script_lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    script_scope = script_scope_symbols(script_lines)
    sys_exports: set[str] = set()
    for path in SYS.glob("*.js"):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        sys_exports |= module_export_names(path.read_text(encoding="utf-8"))

    all_view: set[str] = set()
    for path in VIEW.glob("*.js"):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        all_view |= module_export_names(path.read_text(encoding="utf-8"))

    for path in sorted(VIEW.glob("*.js")):
        if path.name in ("index.js",) or path.name.startswith("_"):
            continue
        exports = module_export_names(path.read_text(encoding="utf-8"))
        need = (script_scope | sys_exports | all_view) - exports - SKIP_PREFIX
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


if __name__ == "__main__":
    main()
