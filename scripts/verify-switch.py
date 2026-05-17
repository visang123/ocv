# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(__file__).resolve().parent.parent
inc = (root / "_ovc_inc.mjs").read_text(encoding="utf-8")
script = (root / "script.js").read_text(encoding="utf-8")

start = inc.index("  switch (onboardingFlowStep) {")
end = inc.index("  updateSettingsTutorialButtons();", start)
block = inc[start:end]
Path(root / "scripts" / "_switch_extract.txt").write_text(block, encoding="utf-8")
print("len", len(block))
print("has e key korean", "E\uD0A4\uB97C" in block or "E키" in block)
print("line case1:", [line for line in block.splitlines() if "case 1" in line or "E" in line and "setOnboarding" in line][:3])
