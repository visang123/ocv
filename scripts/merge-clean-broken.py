"""Merge f497595 (bytes stripped) with 1f5ab11 comments to fix parse errors."""
import re
import subprocess
import sys

clean_lines = subprocess.check_output(["git", "show", "1f5ab11:script.js"]).decode("utf-8").splitlines()
broken_raw = subprocess.check_output(["git", "show", "f497595:script.js"])
broken_lines = broken_raw.replace(b"\xef\xbf\xbd", b"").decode("utf-8", errors="replace").splitlines()

# Map: next function name -> clean comment block immediately above it
clean_comment_by_fn = {}
for i, line in enumerate(clean_lines):
    m = re.match(r"^function\s+(\w+)", line)
    if not m:
        continue
    fn = m.group(1)
    j = i - 1
    while j >= 0 and clean_lines[j].strip() == "":
        j -= 1
    if j >= 0 and (clean_lines[j].strip().endswith("*/") or clean_lines[j].strip() == "*/"):
        start = j
        while start > 0 and not clean_lines[start].strip().startswith("/**") and not (
            clean_lines[start].strip().startswith("/*") and "*/" not in clean_lines[start]
        ):
            if clean_lines[start].strip().startswith("/*"):
                break
            start -= 1
        while start > 0 and not clean_lines[start].strip().startswith("/*"):
            start -= 1
        if clean_lines[start].strip().startswith("/*"):
            clean_comment_by_fn[fn] = clean_lines[start : i]

out = []
i = 0
while i < len(broken_lines):
    line = broken_lines[i]
    m = re.match(r"^function\s+(\w+)", line)
    if m and m.group(1) in clean_comment_by_fn:
        fn = m.group(1)
        # skip broken comments above function
        j = len(out) - 1
        while j >= 0 and out[j].strip() == "":
            j -= 1
        if j >= 0 and out[j].strip().endswith("*/"):
            start = j
            while start > 0 and not out[start].strip().startswith("/*"):
                start -= 1
            if out[start].strip().startswith("/*"):
                out = out[:start]
        out.extend(clean_comment_by_fn[fn])
        out.append(line)
        i += 1
        continue
    # single-line corrupted block comment -> try clean by next function
    if re.match(r"^\s*/\*", line) and "?" in line and i + 1 < len(broken_lines):
        m2 = re.match(r"^function\s+(\w+)", broken_lines[i + 1])
        if not m2:
            for k in range(i + 1, min(i + 5, len(broken_lines))):
                m2 = re.match(r"^function\s+(\w+)", broken_lines[k])
                if m2:
                    break
        if m2 and m2.group(1) in clean_comment_by_fn:
            out.extend(clean_comment_by_fn[m2.group(1)])
            i += 1
            continue
    out.append(line)
    i += 1

path = sys.argv[1] if len(sys.argv) > 1 else "script-merged.js"
open(path, "w", encoding="utf-8", newline="\n").write("\n".join(out) + "\n")
print("wrote", path, "lines", len(out))
