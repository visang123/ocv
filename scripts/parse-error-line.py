import re
import subprocess
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "script-repaired.js"
r = subprocess.run(
    ["node", "--input-type=module", "-e", f"import('./{path}')"],
    capture_output=True,
    text=True,
    cwd="c:/Users/USER/Desktop/OVC",
)
err = (r.stderr or "") + (r.stdout or "")
print(err.strip())
m = re.search(r":(\d+)", err)
if m:
    n = int(m.group(1))
    lines = open(f"c:/Users/USER/Desktop/OVC/{path}", encoding="utf-8").read().splitlines()
    for i in range(max(0, n - 4), min(len(lines), n + 3)):
        print(f"{i + 1}: {lines[i][:140]}")
