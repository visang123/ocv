"""Find object-literal lines like `getFoo().bar` without a property name (common corruption)."""
import re
from pathlib import Path

text = Path("script.js").read_text(encoding="utf-8")
lines = text.splitlines()
bugs = []
for i, line in enumerate(lines, 1):
    if re.match(r"^\s+get\w+\(\)\.\w+,?\s*$", line):
        bugs.append((i, line.strip()))
for i, line in bugs[:30]:
    print(i, line)
print("total", len(bugs))
