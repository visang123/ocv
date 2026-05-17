# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(__file__).resolve().parent.parent.joinpath("script.js").read_text(encoding="utf-8")
checks = [
    "E키를 눌러 가방을 소지하세요.",
    "조작법",
    "아직 내용이 없습니다!",
    "튜토리얼을 건너뛰고",
    "설정: Esc",
]
for s in checks:
    print(s, s in t)
bad = [line for line in t.splitlines() if '??' in line and ('setOnboarding' in line or 'confirm' in line or 'controls-header' in line)]
print("bad lines", len(bad))
for line in bad[:5]:
    print(line.strip()[:80])
