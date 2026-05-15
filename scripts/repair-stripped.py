"""Repair f497595 script (replacement bytes stripped) using 1f5ab11 for broken lines."""
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


def unbalanced_double_quotes(line: str) -> bool:
    s = re.sub(r"(?://.*$|/\*.*?\*/)", "", line)
    n = 0
    esc = False
    for ch in s:
        if esc:
            esc = False
            continue
        if ch == "\\":
            esc = True
            continue
        if ch == '"':
            n ^= 1
    return n == 1


def unbalanced_single_quotes(line: str) -> bool:
    s = re.sub(r"(?://.*$|/\*.*?\*/)", "", line)
    n = 0
    esc = False
    for ch in s:
        if esc:
            esc = False
            continue
        if ch == "\\":
            esc = True
            continue
        if ch == "'":
            n ^= 1
    return n == 1


def line_prefix_key(line: str) -> str:
    m = re.match(r"^(\s*)(?:const|let|var)?\s*([\w$.]+)?", line)
    if not m:
        return line.strip()[:40]
    return (m.group(1) or "") + (m.group(2) or line.strip()[:30])


out = []
fixes = 0
max_len = max(len(clean), len(broken))
for i in range(max_len):
    b = broken[i] if i < len(broken) else ""
    c = clean[i] if i < len(clean) else ""
    if not b:
        out.append(c)
        continue
    if not c:
        out.append(b)
        continue
    use_clean = False
    if unbalanced_double_quotes(b) or unbalanced_single_quotes(b):
        use_clean = True
    elif re.search(r'=\s*"[^"]*\?;', b) or re.search(r"'[^']*\?/", b):
        use_clean = True
    elif "?" in b and line_prefix_key(b) == line_prefix_key(c) and b != c and len(c) > 0:
        # corrupted Korean in otherwise same statement
        if re.search(r'[\uac00-\ud7a3]', c) and not re.search(r'[\uac00-\ud7a3]', b):
            use_clean = True
    if use_clean and c:
        out.append(c)
        fixes += 1
    else:
        out.append(b)

path = sys.argv[1] if len(sys.argv) > 1 else "script-repaired.js"
open(path, "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
print("wrote", path, "lines", len(out), "clean-line fixes", fixes)
