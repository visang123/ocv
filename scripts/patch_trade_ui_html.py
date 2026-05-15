from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
d = "motion"
d = "div"
overlay = f"""
  <{d} id="trade-exchange-overlay" class="trade-exchange-overlay" style="display: none" aria-hidden="true">
    <{d} class="trade-exchange-panel" role="dialog" aria-labelledby="trade-exchange-title">
      <{d} class="trade-exchange-header">
        <h2 id="trade-exchange-title">\uad50\ud658</h2>
        <button type="button" id="trade-exchange-close" class="trade-exchange-close" aria-label="\ub2eb\uae30">
          &#215;
        </button>
      </{d}>
      <p class="trade-exchange-hint">\uac00\ubc29\uc5d0\uc11c \uc544\uc774\ud15c\uc744 \ud074\ub9ad\ud574 \uad50\ud658\ub300\uc5d0 \uc62c\ub9ac\uc138\uc694.</p>
      <{d} id="trade-counter-slot" class="trade-counter-slot" aria-label="\uad50\ud658\ub300"></{d}>
      <ul id="trade-offer-list" class="trade-offer-list" aria-label="\uad50\ud658 \uac00\ub2a5 \ubaa9\ub85d"></ul>
      <button type="button" id="trade-exchange-confirm" class="trade-exchange-confirm" disabled>
        \uad50\ud658
      </button>
    </{d}>
  </{d}>
"""

for name in ("index.html", "tutorial.html"):
    path = ROOT / name
    text = path.read_text(encoding="utf-8")
    if "trade-exchange-overlay" in text:
        print(name, "already patched")
        continue
    anchor = '  <div id="multiplayer-status">'
    if anchor not in text:
        raise SystemExit(f"{name}: anchor missing")
    text = text.replace(anchor, overlay + anchor, 1)
    path.write_text(text, encoding="utf-8")
    print("patched", name)
