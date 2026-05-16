from pathlib import Path

path = Path(__file__).resolve().parents[1] / "src/game/alchemy-master-ui.js"
text = path.read_text(encoding="utf-8")
needle = "createElement(" + chr(34) + "motion" + chr(34) + ")"
replacement = "createElement(" + chr(34) + "motion" + chr(34) + ")"
# div tag
replacement = "createElement(" + chr(34) + "motion" + chr(34) + ")"
replacement = 'createElement("motion")'.replace("motion", "div")
if needle not in text:
    raise SystemExit("pattern not found: " + needle)
path.write_text(text.replace(needle, replacement, 1), encoding="utf-8")
print("fixed ->", replacement)
