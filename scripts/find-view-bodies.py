import re
from pathlib import Path

SCRIPT = Path("script.js")
layers = Path("src/script/layers.js").read_text(encoding="utf-8")
view = {m.group(1) for m in re.finditer(r'  (\w+): "view"', layers)}
lines = SCRIPT.read_text(encoding="utf-8").splitlines()

def is_wrapper(line):
    return "_systemsApi." in line or "_networkApi." in line or "_viewApi." in line

bodies = []
wrappers = []
missing = []
for name in sorted(view):
    pat = re.compile(r"^function " + re.escape(name) + r"\s*\(")
    found = False
    for i, line in enumerate(lines):
        if pat.match(line):
            found = True
            if is_wrapper(line):
                wrappers.append(name)
            else:
                bodies.append(name)
            break
    if not found:
        missing.append(name)

print("bodies", len(bodies))
print("wrappers/moved", len(wrappers))
print("missing", len(missing))
for n in bodies:
    print(" ", n)
