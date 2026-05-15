import subprocess
import tempfile
import os
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "script-fixed.js"
lines = open(path, encoding="utf-8").read().splitlines()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test(n: int) -> bool:
    fd, p = tempfile.mkstemp(suffix=".js", dir=root)
    os.close(fd)
    with open(p, "w", encoding="utf-8") as f:
        f.write("\n".join(lines[:n]) + "\n")
    rel = os.path.relpath(p, root).replace("\\", "/")
    r = subprocess.run(
        ["node", "--input-type=module", "-e", f"import('./{rel}')"],
        capture_output=True,
        text=True,
        cwd=root,
    )
    os.unlink(p)
    err = (r.stderr or "") + (r.stdout or "")
    return "Invalid or unexpected token" in err or "SyntaxError" in err


lo, hi = 0, len(lines)
while lo + 1 < hi:
    mid = (lo + hi) // 2
    if test(mid):
        hi = mid
    else:
        lo = mid

print("first bad line approx", hi, "of", len(lines))
for i in range(max(0, hi - 3), min(len(lines), hi + 2)):
    print(f"{i + 1}: {lines[i][:120]}")
