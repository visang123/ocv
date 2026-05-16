import re

text = open("script.js", encoding="utf-8").read()
for m in re.finditer(r"\*/\s*\n(\s*\* )", text):
    line = text.count("\n", 0, m.start()) + 1
    ctx = text[m.start() : m.end() + 40].replace("\n", "\\n")
    print(line, repr(ctx[:80]))

# Also: */ inside a line that's not closing a comment (in code)
lines = text.split("\n")
in_block = False
for i, line in enumerate(lines, 1):
    if in_block:
        if "*/" in line:
            in_block = False
        continue
    if "/*" in line and "*/" not in line.split("/*")[0]:
        in_block = True
        continue
    if "/*" in line and "*/" in line:
        # single line comment
        pass
    elif "*/" in line and "/*" not in line:
        print("orphan */ on line", i, line[:100])
