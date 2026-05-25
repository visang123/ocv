"""Find JS files that fail Node ESM parse (syntax only)."""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
files = [ROOT / "script.js", ROOT / "src" / "main.js"]
files.extend(sorted((ROOT / "src" / "script").rglob("*.js")))
files.extend(sorted((ROOT / "src" / "script" / "view").glob("*.js")))

bad: list[tuple[str, str]] = []
for path in files:
    if not path.exists() or "_bindings" in path.name:
        continue
    r = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True,
        cwd=str(ROOT),
    )
    if r.returncode != 0:
        bad.append((str(path.relative_to(ROOT)), (r.stderr or r.stdout).strip().split("\n")[-1]))

print("checked", len(files), "files")
for p, err in bad:
    print(p, "->", err)
if not bad:
    print("all ok")
