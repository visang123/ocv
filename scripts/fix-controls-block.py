# -*- coding: utf-8 -*-
from pathlib import Path

path = Path(__file__).resolve().parent.parent / "script.js"
text = path.read_text(encoding="utf-8")

start = text.index("controlsOverlay.innerHTML =")
end = text.index("document.body.appendChild(controlsOverlay);", start)

new_block = "\n".join([
    "controlsOverlay.innerHTML =",
    "  '<div id=\"controls-modal\">' +",
    "  '<motion class=\"controls-header\"><strong>조작법</strong></div>' +",
    "  '<div class=\"controls-list\">' +",
    "  '<div><span>W / \\u2191</span><p>위로 이동</p></div>' +",
    "  '<div><span>A / \\u2190</span><p>왼쪽으로 이동</p></div>' +",
    "  '<div><span>S / \\u2193</span><p>아래로 이동</p></div>' +",
    "  '<div><span>D / \\u2192</span><p>오른쪽으로 이동</p></div>' +",
    "  '<div><span>Space</span><p>점프</p></div>' +",
    "  '<motion><span>E</span><p>줍기 / 내려놓기</p></motion>' +",
    "  '<div><span>Q</span><p>사용 / 대화</p></div>' +",
    "  '<div><span>마우스 휠</span><p>확대 / 축소</p></div>' +",
    "  '<div><span>Esc</span><p>설정 열기 / 닫기</p></div>' +",
    "  '</div></motion>';",
]) + "\n"

# Correct block - verified every tag
new_block = "\n".join([
    "controlsOverlay.innerHTML =",
    "  '<div id=\"controls-modal\">' +",
    "  '<div class=\"controls-header\"><strong>조작법</strong></div>' +",
    "  '<div class=\"controls-list\">' +",
    "  '<div><span>W / \\u2191</span><p>위로 이동</p></div>' +",
    "  '<div><span>A / \\u2190</span><p>왼쪽으로 이동</p></div>' +",
    "  '<div><span>S / \\u2193</span><p>아래로 이동</p></div>' +",
    "  '<div><span>D / \\u2192</span><p>오른쪽으로 이동</p></div>' +",
    "  '<div><span>Space</span><p>점프</p></div>' +",
    "  '<div><span>E</span><p>줍기 / 내려놓기</p></div>' +",
    "  '<div><span>Q</span><p>사용 / 대화</p></div>' +",
    "  '<div><span>마우스 휠</span><p>확대 / 축소</p></div>' +",
    "  '<div><span>Esc</span><p>설정 열기 / 닫기</p></div>' +",
    "  '</div></div>';",
]) + "\n"

text = text[:start] + new_block + text[end:]
path.write_text(text, encoding="utf-8", newline="\n")
print("ok")
