from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
BINDINGS = ROOT / "src" / "script" / "systems" / "_bindings-snippet.js"

lines = SCRIPT.read_text(encoding="utf-8").splitlines()
start = end = None
for i, line in enumerate(lines):
    if line.strip() == "function buildSystemsDeps() {":
        start = i
    if start is not None and end is None and i > start and line.strip() == "};" and lines[i + 1].strip() == "}":
        end = i + 1
        break

if start is None:
    raise SystemExit("buildSystemsDeps not found")

bindings = BINDINGS.read_text(encoding="utf-8").strip().splitlines()
new = lines[:start] + bindings + lines[end + 1 :]
SCRIPT.write_text("\n".join(new) + "\n", encoding="utf-8", newline="\n")
print("replaced buildSystemsDeps", start, end)
