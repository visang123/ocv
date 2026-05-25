"""Binary-search line causing Unexpected token '.' in script.js."""
from pathlib import Path

lines = Path("script.js").read_text(encoding="utf-8").splitlines()

lo, hi = 0, len(lines)
while lo < hi - 1:
    mid = (lo + hi) // 2
    chunk = "\n".join(lines[:mid]) + "\nexport {};\n"
    path = Path("_syntax_test.js")
    path.write_text(chunk, encoding="utf-8")
    import subprocess
    r = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
    if r.returncode == 0:
        lo = mid
    else:
        hi = mid
        err = r.stderr.strip()
print("error around line", hi, ":", err if 'err' in dir() else "")
print("line:", lines[hi - 1][:120] if hi <= len(lines) else "")
