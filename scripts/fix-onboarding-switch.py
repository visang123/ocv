# -*- coding: utf-8 -*-
"""Replace mangled onboarding switch with clean copy from _ovc_inc.mjs."""
from pathlib import Path


def extract_switch(text: str) -> str:
    start = text.index("  switch (onboardingFlowStep) {")
    end = text.index("  updateSettingsTutorialButtons();", start)
    return text[start:end].rstrip() + "\n  }"


root = Path(__file__).resolve().parent.parent
inc = (root / "_ovc_inc.mjs").read_text(encoding="utf-8")
script = (root / "script.js").read_text(encoding="utf-8")

switch_inc = extract_switch(inc)

case3_plain = """    case 3: {
      if (guideOpen) {
        setOnboardingCalloutVisible(true, "인벤토리(저장소)가 열립니다.");
        if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }"""

case3_extra = """    case 3: {
      if (guideOpen) {
        setOnboardingCalloutVisible(true, "인벤토리(저장소)가 열립니다.");
        if (worldBagInventory) worldBagInventory.classList.add("onboarding-highlight");
        if (bagBookStorageSlot && hasGuideBookItemInBagCounts()) {
          bagBookStorageSlot.classList.add("onboarding-highlight");
        }
      } else {
        setOnboardingCalloutVisible(false, "");
      }
      break;
    }"""

switch_inc = switch_inc.replace(case3_plain, case3_extra, 1)

s0 = script.index("  switch (onboardingFlowStep) {")
s1 = script.index("  updateSettingsTutorialButtons();", s0)
script = script[:s0] + switch_inc + "\n" + script[s1:]

extras = [
    ('const guidePlaceholderHtml = "<p>?? ??? ????!</p>";', 'const guidePlaceholderHtml = "<p>아직 내용이 없습니다!</p>";'),
    ('if (!window.confirm("?????????????????? ????????? ???????????????")) {', 'if (!window.confirm("튜토리얼을 건너뛰고 자유롭게 플레이할까요?")) {'),
    ('"???????????????????????? ??????????? ????????? ??????? ???????????"', '"튜토리얼을 처음부터 다시 진행할까요? 튜토리얼 화면으로 이동합니다."'),
    ('return { anchorEl: settingsButton, text: "????: Esc" };', 'return { anchorEl: settingsButton, text: "설정: Esc" };'),
    ('return { anchorEl: worldChatToggleBtn, text: "?????: C" };', 'return { anchorEl: worldChatToggleBtn, text: "채팅: C" };'),
    ('return { anchorEl: worldHeartBtn, text: "?????: H" };', 'return { anchorEl: worldHeartBtn, text: "하트: H" };'),
    ('return { anchorEl: worldSadBtn, text: "????? Ctrl+S" };', 'return { anchorEl: worldSadBtn, text: "슬퍼요: Ctrl+S" };'),
    ('throw new Error(data.message || "????????????????????.");', 'throw new Error(data.message || "요청이 실패했습니다.");'),
    ('button.setAttribute("aria-label", color + " ????");', 'button.setAttribute("aria-label", color + " 색깔");'),
    ('showOnlineDebugMessage("????????????????? ???????????????");', 'showOnlineDebugMessage("삭제된 계정입니다. 로그아웃합니다.");'),
    ('showOnlineDebugMessage("??? ??????? ????????????????????????");', 'showOnlineDebugMessage("다른 기기에서 로그인되어 로그아웃합니다.");'),
    ('"??? ?????????: "', '"로컬 저장 실패: "'),
    ('"????????? ??? ?????"', '"온라인 서버 확인 필요"'),
]
for old, new in extras:
    script = script.replace(old, new)

(root / "script.js").write_text(script, encoding="utf-8", newline="\n")
print("ok")
