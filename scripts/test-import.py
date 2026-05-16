import subprocess
import os

revs = ["47c0074", "f497595", "HEAD"]
for rev in revs:
    data = subprocess.check_output(["git", "show", f"{rev}:script.js"])
    path = f"scripts/s-{rev[:7]}.js"
    with open(path, "wb") as f:
        f.write(data)
    r = subprocess.run(
        ["node", "--input-type=module", "-e", f"import('./{path}')"],
        capture_output=True,
        text=True,
    )
    msg = (r.stderr or r.stdout or "").strip().split("\n")[0]
    print(rev, "code", r.returncode, msg[:80])
