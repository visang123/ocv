# -*- coding: utf-8 -*-
"""Restore all corrupted Korean UI strings in script.js."""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
inc = (root / "_ovc_inc.mjs").read_text(encoding="utf-8")
text = (root / "script.js").read_text(encoding="utf-8", errors="surrogateescape")

# onboarding switch
sw_start = inc.index("  switch (onboardingFlowStep) {")
sw_end = inc.index(
    "    default:\n      setOnboardingCalloutVisible(false, \"\");\n  }",
    sw_start,
)
sw_end = inc.index("\n", sw_end) + 1
switch_block = inc[sw_start:sw_end]

case3_plain = (
    '        setOnboardingCalloutVisible(true, "\uc778\ubca4\ud1a0\ub9ac(\uc800\uc7a5\uc18c)\uac00 \uc5f4\ub9bd\ub2c8\ub2e4.");\n'
    "        if (worldBagInventory) worldBagInventory.classList.add(\"onboarding-highlight\");\n"
    "      } else {"
)
case3_extra = (
    '        setOnboardingCalloutVisible(true, "\uc778\ubca4\ud1a0\ub9ac(\uc800\uc7a5\uc18c)\uac00 \uc5f4\ub9bd\ub2c8\ub2e4.");\n'
    "        if (worldBagInventory) worldBagInventory.classList.add(\"onboarding-highlight\");\n"
    "        if (bagBookStorageSlot && hasGuideBookItemInBagCounts()) {\n"
    "          bagBookStorageSlot.classList.add(\"onboarding-highlight\");\n"
    "        }\n"
    "      } else {"
)
switch_block = switch_block.replace(case3_plain, case3_extra, 1)

s0 = text.index("  switch (onboardingFlowStep) {")
s1 = text.index(
    "    default:\n      setOnboardingCalloutVisible(false, \"\");\n  }",
    s0,
)
s1 = text.index("\n", s1) + 1
text = text[:s0] + switch_block + text[s1:]

# controls overlay from inc
c_start = inc.index("controlsOverlay.innerHTML =")
c_end = inc.index("document.body.appendChild(controlsOverlay);", c_start)
controls_block = inc[c_start:c_end].rstrip() + "\n"

c0 = text.index("controlsOverlay.innerHTML =")
c1 = text.index("document.body.appendChild(controlsOverlay);", c0)
text = text[:c0] + controls_block + text[c1:]

# admin dev buttons from inc
a_start = inc.index("const adminDevButterfliesButton = appendAdminDevGrantButton(")
a_end = inc.index("document.body.appendChild(adminDevPlantIndexPlusButton);", a_start)
a_end = inc.index("\n", a_end) + 1
admin_block = inc[a_start:a_end]

b0 = text.index("const adminDevButterfliesButton = appendAdminDevGrantButton(")
b1 = text.index("document.body.appendChild(adminDevPlantIndexPlusButton);", b0)
b1 = text.index("\n", b1) + 1
text = text[:b0] + admin_block + text[b1:]

# network debug label
text = text.replace(
    'networkDebugButton.setAttribute("aria-label", "??");',
    'networkDebugButton.setAttribute("aria-label", "\ub85c\uadf8");',
)
text = text.replace(
    'networkDebugButton.setAttribute("aria-label", "???");',
    'networkDebugButton.setAttribute("aria-label", "\ub85c\uadf8");',
)

# misc strings
text = text.replace(
    'const guidePlaceholderHtml = "<p>?? ??? ????!</p>";',
    'const guidePlaceholderHtml = "<p>\uc544\uc9c1 \ub0b4\uc6a9\uc774 \uc5c6\uc2b5\ub2c8\ub2e4!</p>";',
)
text = text.replace(
    'if (!window.confirm("????? ???? ???? ???????")) {',
    'if (!window.confirm("\ud29c\ud1a0\ub9ac\uc5bc\uc744 \uac74\ub108\ub6f0\uace0 \uc790\uc720\ub86d\uac8c \ud50c\ub808\uc774\ud560\uae4c\uc694?")) {',
)
text = text.replace(
    '"????? ???? ?? ?????? ???? ???? ?????."',
    '"\ud29c\ud1a0\ub9ac\uc5bc\uc744 \ucc98\uc74c\ubd80\ud130 \ub2e4\uc2dc \uc9c4\ud589\ud560\uae4c\uc694? \ud29c\ud1a0\ub9ac\uc5bc \ud654\uba74\uc73c\ub85c \uc774\ub3d9\ud569\ub2c8\ub2e4."',
)
text = text.replace('return { anchorEl: settingsButton, text: "??: Esc" };', 'return { anchorEl: settingsButton, text: "\uc124\uc815: Esc" };')
text = text.replace('return { anchorEl: worldChatToggleBtn, text: "??: C" };', 'return { anchorEl: worldChatToggleBtn, text: "\ucc44\ud305: C" };')
text = text.replace('return { anchorEl: worldHeartBtn, text: "??: H" };', 'return { anchorEl: worldHeartBtn, text: "\ud558\ud2b8: H" };')
text = text.replace('return { anchorEl: worldSadBtn, text: "???: Ctrl+S" };', 'return { anchorEl: worldSadBtn, text: "\uc2ac\ud37c\uc694: Ctrl+S" };')
text = text.replace('throw new Error(data.message || "????????????????????.");', 'throw new Error(data.message || "\uc694\uccad\uc774 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.");')
text = text.replace('button.setAttribute("aria-label", color + " ????");', 'button.setAttribute("aria-label", color + " \uc0c9\uae54");')
text = text.replace(
    'showOnlineDebugMessage("????????????????? ???????????????");',
    'showOnlineDebugMessage("\uc0ad\uc81c\ub41c \uacc4\uc815\uc785\ub2c8\ub2e4. \ub85c\uadf8\uc544\uc6c3\ud569\ub2c8\ub2e4.");',
)
text = text.replace(
    'showOnlineDebugMessage("??? ??????? ????????????????????????");',
    'showOnlineDebugMessage("\ub2e4\ub978 \uae30\uae30\uc5d0\uc11c \ub85c\uadf8\uc778\ub418\uc5b4 \ub85c\uadf8\uc544\uc6c3\ud569\ub2c8\ub2e4.");',
)
text = text.replace('"??? ?????????: "', '"\ub85c\uceec \uc800\uc7a5 \uc2e4\ud328: "')
text = text.replace('"????????? ??? ?????"', '"\uc628\ub77c\uc778 \uc11c\ubc84 \ud655\uc778 \ud544\uc694"')

(root / "script.js").write_text(text, encoding="utf-8", newline="\n")
print("done")
