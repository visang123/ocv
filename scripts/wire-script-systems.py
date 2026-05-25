"""
Remove systems modules' functions from script.js; add initScriptSystems + wrappers.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS = ROOT / "src" / "script" / "systems"
BINDINGS = SYS / "_bindings-snippet.js"


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
    for path in sorted(SYS.glob("*.js")):
        if path.name in ("index.js", "_bindings-snippet.js"):
            continue
        text = path.read_text(encoding="utf-8")
        m = re.search(r"\n  return \{\n(.*?)\n  \};", text, re.S)
        if not m:
            continue
        for line in m.group(1).splitlines():
            line = line.strip().rstrip(",")
            if line and re.match(r"^\w+$", line):
                names.append(line)
    return names


def wrapper_line(name: str) -> str:
    rng = find_function_range(SCRIPT.read_text(encoding="utf-8").splitlines(), name)
    if rng is None:
        # guess arity from systems file
        return f"function {name}() {{ return _systemsApi.{name}(); }}\n"
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    header = lines[rng[0]]
    m = re.match(r"^function \w+\s*\((.*?)\)\s*\{", header)
    params = m.group(1).strip() if m else ""
    if params:
        return f"function {name}({params}) {{ return _systemsApi.{name}({params}); }}\n"
    return f"function {name}() {{ return _systemsApi.{name}(); }}\n"


def main() -> None:
    text = SCRIPT.read_text(encoding="utf-8")
    if "initScriptSystems" in text and "_systemsApi" in text:
        print("already wired")
        return

    lines = text.splitlines()
    exports = exported_functions()
    print("removing", len(exports), "functions")

    for name in sorted(exports, key=len, reverse=True):
        rng = find_function_range(lines, name)
        if rng:
            del lines[rng[0] : rng[1] + 1]

    bindings = BINDINGS.read_text(encoding="utf-8")

    block = [
        "",
        "/** Systems/Logic — src/script/systems/ */",
        "/** @type {ReturnType<typeof initScriptSystems> | null} */",
        "let _systemsApi = null;",
        "",
        bindings.strip(),
        "",
        "function initOvcScriptSystemsLayer() {",
        "  _systemsApi = initScriptSystems(buildSystemsDeps());",
        "}",
        "",
    ]
    for name in sorted(exports):
        rng_old = find_function_range(SCRIPT.read_text(encoding="utf-8").splitlines(), name)
        lines_src = SCRIPT.read_text(encoding="utf-8").splitlines()
        if rng_old:
            hdr = lines_src[rng_old[0]]
            m = re.match(r"^function \w+\s*\((.*?)\)\s*\{", hdr)
            params = m.group(1).strip() if m else ""
        else:
            params = ""
        if params:
            block.append(f"function {name}({params}) {{ return _systemsApi.{name}({params}); }}")
        else:
            block.append(f"function {name}() {{ return _systemsApi.{name}(); }}")

    # import
    for i, line in enumerate(lines):
        if 'from "./src/script/network/index.js"' in line:
            lines.insert(i + 1, 'import { initScriptSystems } from "./src/script/systems/index.js";')
            break

    # insert block after initOvcScriptNetworkLayer function
    insert_at = None
    for i, line in enumerate(lines):
        if line.strip() == "function initOvcScriptNetworkLayer() {":
            # find closing brace of function
            brace = 0
            started = False
            for j in range(i, len(lines)):
                for ch in lines[j]:
                    if ch == "{": brace += 1; started = True
                    elif ch == "}": brace -= 1
                if started and brace == 0:
                    insert_at = j + 1
                    break
            break

    if insert_at is None:
        raise SystemExit("initOvcScriptNetworkLayer not found")

    for j, ln in enumerate(block):
        lines.insert(insert_at + j, ln)

    # call init after network init call
    for i, line in enumerate(lines):
        if line.strip() == "initOvcScriptNetworkLayer();":
            lines.insert(i + 1, "initOvcScriptSystemsLayer();")
            break

    SCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print("wired", SCRIPT)


if __name__ == "__main__":
    main()
