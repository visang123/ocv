import subprocess
import tempfile
import os

path = "script-stripped.js"
lines = open(path, encoding="utf-8").read().splitlines()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check(n: int) -> str:
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
    return (r.stderr or "") + (r.stdout or "")


for n in [1879, 1880, 1881, 2427, 2428, 2429, 14925]:
    err = check(n)
    kind = "ok" if "document is not defined" in err else err.strip().split("\n")[0][:60]
    print(n, kind)
