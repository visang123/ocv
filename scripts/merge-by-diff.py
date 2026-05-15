"""Merge f497595 (stripped) onto 1f5ab11 using difflib opcodes; keep clean lines when broken line is invalid."""
import difflib
import re
import subprocess
import sys

clean = (
    subprocess.check_output(["git", "show", "1f5ab11:script.js"])
    .decode("utf-8")
    .splitlines()
)
broken = (
    subprocess.check_output(["git", "show", "f497595:script.js"])
    .replace(b"\xef\xbf\xbd", b"")
    .decode("utf-8", errors="replace")
    .splitlines()
)


def unbalanced_quotes(line: str) -> bool:
    for q in ('"', "'"):
        n = 0
        esc = False
        for ch in line:
            if esc:
                esc = False
                continue
            if ch == "\\":
                esc = True
                continue
            if ch == q:
                n ^= 1
        if n:
            return True
    return False


def pick_line(c_line: str, b_line: str) -> str:
    if c_line == b_line:
        return b_line
    if unbalanced_quotes(b_line):
        return c_line
    if re.search(r'=\s*"[^"]*\?;', b_line) or re.search(r"'[^']*\?/", b_line):
        return c_line
    # two // comments jammed on one physical line
    if b_line.count("//") >= 2 and c_line.count("//") < 2:
        return c_line
    return b_line


out = []
sm = difflib.SequenceMatcher(None, clean, broken)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        out.extend(clean[i1:i2])
    elif tag == "replace":
        cl = clean[i1:i2]
        bl = broken[j1:j2]
        if len(cl) == len(bl):
            out.extend(pick_line(c, b) for c, b in zip(cl, bl))
        else:
            out.extend(bl)
    elif tag == "delete":
        pass
    elif tag == "insert":
        out.extend(broken[j1:j2])

path = sys.argv[1] if len(sys.argv) > 1 else "script-merged.js"
open(path, "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
print("wrote", path, "lines", len(out))
