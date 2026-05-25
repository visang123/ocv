"""List script.js string literals with 3+ '?' (likely corrupted Korean)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
text = (ROOT / "script.js").read_text(encoding="utf-8")
hits = []
for m in re.finditer(r'"([^"\\]*(?:\\.[^"\\]*)*)"', text):
    s = m.group(1)
    if re.search(r"\?{3,}", s):
        line = text[: m.start()].count("\n") + 1
        hits.append((line, s[:100]))
for line, preview in hits:
    print(f"{line}: {preview}")
