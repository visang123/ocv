import subprocess
import os
import tempfile

lines = open("script.js", encoding="utf-8").read().splitlines()

def esm_parse_ok(n):
    content = "\n".join(lines[:n]) + "\n"
    fd, path = tempfile.mkstemp(suffix=".js", dir="scripts")
    os.close(fd)
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        r = subprocess.run(
            [
                "node",
                "--input-type=module",
                "-e",
                f"import('file:///{os.path.abspath(path).replace(chr(92), '/')}')",
            ],
            capture_output=True,
        )
        err = r.stderr.decode("utf-8", errors="replace")
        if r.returncode == 0:
            return True, ""
        if "Unexpected token '*'" in err:
            return False, "star"
        if "Unexpected token" in err:
            return False, err.split("\n")[0][:80]
        # runtime errors after parse are ok for bisect
        if "SyntaxError" in err:
            return False, err.split("\n")[0][:80]
        return True, ""
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass

lo, hi = 400, len(lines)  # skip imports-only prefix
while lo < hi:
    mid = (lo + hi) // 2
    ok, reason = esm_parse_ok(mid)
    if ok:
        lo = mid + 1
    else:
        hi = mid

print("first fail at line", lo, "reason:", esm_parse_ok(lo)[1])
if lo <= len(lines):
    print("line:", lines[lo - 1][:100])
