import re
from pathlib import Path

text = Path("src/script/layers.js").read_text(encoding="utf-8")
view = sorted(m.group(1) for m in re.finditer(r'  (\w+): "view"', text))
print("count", len(view))
for n in view:
    print(n)
