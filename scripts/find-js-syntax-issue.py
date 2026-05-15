import re
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "script.js"
code = open(path, encoding="utf-8").read()

# Find block comments that contain */ before the real end (premature close)
for m in re.finditer(r"/\*", code):
    start = m.start()
    end = code.find("*/", start + 2)
    if end == -1:
        line = code[:start].count("\n") + 1
        print("unclosed block comment at line", line)
        continue
    inner = code[start + 2 : end]
    if "*/" in inner:
        line = code[:start].count("\n") + 1
        print("nested/premature */ in block starting line", line)
        print(repr(inner[:200]))

# Lines with stray */ in middle (common corruption pattern)
for i, line in enumerate(code.splitlines(), 1):
    if "*/" in line and "/*" not in line and not line.strip().startswith("*"):
        if line.count("*/") >= 1:
            print("stray */ line", i, line[:100])
