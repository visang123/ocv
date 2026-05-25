"""Wire initScriptView + buildLayerDeps into script.js."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
SYS_SNIP = ROOT / "src" / "script" / "systems" / "_bindings-snippet.js"
VIEW_SNIP = ROOT / "src" / "script" / "view" / "_bindings-snippet.js"

IMPORT_LINE = 'import { initScriptView } from "./src/script/view/index.js";'


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()

    if IMPORT_LINE not in lines and "initScriptView" not in "\n".join(lines):
        for i, line in enumerate(lines):
            if 'from "./src/script/systems/index.js"' in line:
                lines.insert(i + 1, IMPORT_LINE)
                break

    if "let _layerDeps = null" not in "\n".join(lines):
        for i, line in enumerate(lines):
            if line.strip() == "let _systemsApi = null;":
                lines.insert(
                    i,
                    "/** @type {object | null} */",
                )
                lines.insert(i + 1, "let _layerDeps = null;")
                break

    sys_body = SYS_SNIP.read_text(encoding="utf-8").splitlines()
    # systems snippet: function buildSystemsDeps() { return {
    sys_inner = []
    in_return = False
    for line in sys_body:
        if line.strip().startswith("return {"):
            in_return = True
            continue
        if in_return and line.strip() == "};":
            break
        if in_return:
            sys_inner.append(line)

    view_extra: list[str] = []
    if VIEW_SNIP.exists():
        vtext = VIEW_SNIP.read_text(encoding="utf-8")
        for line in vtext.splitlines():
            s = line.strip()
            if s.startswith("return {") or s == "};" or s.startswith("/*"):
                continue
            if s:
                view_extra.append(line if line.startswith("    ") else "    " + s.rstrip(","))

    layer_fn = [
        "function buildLayerDeps() {",
        "  return {",
        *sys_inner,
        *view_extra,
        "  };",
        "}",
    ]

    # replace buildSystemsDeps function with buildLayerDeps
    start = end = None
    for i, line in enumerate(lines):
        if line.strip() == "function buildSystemsDeps() {":
            start = i
        if start is not None and end is None and line.strip() == "}" and i > start:
            if i + 1 < len(lines) and (
                lines[i + 1].strip().startswith("function init")
                or lines[i + 1].strip() == "};"
            ):
                end = i
                break
    if start is None:
        for i, line in enumerate(lines):
            if line.strip() == "function buildLayerDeps() {":
                start = i
                for j in range(i, len(lines)):
                    if lines[j].strip() == "}" and j > i:
                        end = j
                        break
                break

    if start is not None and end is not None:
        lines = lines[:start] + layer_fn + lines[end + 1 :]

    # systems init uses layer deps
    text = "\n".join(lines)
    text = text.replace(
        "_systemsApi = initScriptSystems(buildSystemsDeps());",
        "_layerDeps = buildLayerDeps();\n  _systemsApi = initScriptSystems(_layerDeps);",
    )
    lines = text.splitlines()

    if "function initOvcScriptViewLayer()" not in text:
        for i, line in enumerate(lines):
            if line.strip() == "function initOvcScriptSystemsLayer() {":
                for j in range(i, len(lines)):
                    if lines[j].strip() == "}":
                        insert = [
                            "",
                            "/** View — src/script/view/ */",
                            "/** @type {ReturnType<typeof initScriptView> | null} */",
                            "let _viewApi = null;",
                            "",
                            "function initOvcScriptViewLayer() {",
                            "  _viewApi = initScriptView(_layerDeps);",
                            "}",
                        ]
                        for k, ln in enumerate(insert):
                            lines.insert(j + 1 + k, ln)
                        break
                break

    text = "\n".join(lines)
    text = text.replace(
        "initOvcScriptNetworkLayer();\ninitOvcScriptSystemsLayer();",
        "initOvcScriptNetworkLayer();\ninitOvcScriptSystemsLayer();\ninitOvcScriptViewLayer();",
    )
    if "initOvcScriptViewLayer();" not in text:
        text = text.replace(
            "initOvcScriptSystemsLayer();",
            "initOvcScriptSystemsLayer();\ninitOvcScriptViewLayer();",
            1,
        )

    SCRIPT.write_text(text + "\n", encoding="utf-8", newline="\n")
    print("wired view layer")


if __name__ == "__main__":
    main()
