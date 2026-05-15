from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
d = "motion"
d = "div"
block = (
    f"        <{d} id=\"npc-bubble\"></{d}>\n"
    f"        <{d} id=\"trade-master-bubble\"></{d}>\n"
    f"        <{d} id=\"player-bubble\"></{d}>\n"
    f"        <{d} id=\"player-alert\">!</{d}>\n"
    f"        <img id=\"water-needed\" src=\"이미지/water-needed.png\" alt=\"water needed\">\n"
)

path = ROOT / "index.html"
text = path.read_text(encoding="utf-8")
needle = 'id="alchemy-master"'
start = text.find(needle)
if start < 0:
    raise SystemExit("alchemy-master missing")
start = text.find("\n", start) + 1
end = text.find('id="growth-card"', start)
if end < 0:
    raise SystemExit("growth-card missing")
end = text.rfind("\n", start, end) + 1
path.write_text(text[:start] + block + text[end:], encoding="utf-8")
print("fixed index.html")
