import subprocess
import tempfile
import os

lines = open("script.js", encoding="utf-8").read().splitlines()

def esm_ok(n):
    content = "\n".join(lines[:n]) + "\n"
    path = tempfile.mktemp(suffix=".js")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    r = subprocess.run(
        ["node", "--input-type=module", "-e", f"import('{path.replace(chr(92), '/')}')"],
        capture_output=True,
        text=True,
        cwd=os.path.dirname(path),
    )
    os.unlink(path)
    return r.returncode == 0, r.stderr

lo, hi = 1, len(lines)
while lo < hi:
    mid = (lo + hi) // 2
    if esm_ok(mid):
        lo = mid + 1
    else:
        hi = mid
print("first esm fail at line", lo)
if lo <= len(lines):
    print("line:", repr(lines[lo - 1][:120]))
