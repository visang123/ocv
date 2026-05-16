# -*- coding: utf-8 -*-
"""Restore Korean in script.js where UTF-8 was replaced with '?'."""
from pathlib import Path

REPLACEMENTS = [
    ("/** 25?계: 0 = ?매 ?내(2?, 1 = ?앗 ?용 ?내 */", "/** 25단계: 0 = 열매 안내(2초), 1 = 씨앗 사용 안내 */"),
    ("/** 16?계: 0 = 축하 문구, 1 = ?어???내(????텝? 계속 16) */", "/** 16단계: 0 = 축하 문구, 1 = 이어서 안내(저장 스텝은 계속 16) */"),
    ("/** tutorial.html: ?의 ?토리얼 ?앗???라????시 ?기까?(ms) */", "/** tutorial.html: 땅의 튜토리얼 씨앗이 사라진 뒤 다시 놓기까지(ms) */"),
    ("/** ????리스???후?는 ?벤·?앗 ?보???두?강조 ?략(??이?만). */", "/** 땅 씨 리스폰 이후에는 인벤·씨앗 온보딩 테두리 강조 생략(첫 사이클만). */"),
    ('const guidePlaceholderHtml = "<p>?직 ?용???습?다!</p>";', 'const guidePlaceholderHtml = "<p>아직 내용이 없습니다!</p>";'),
    ("/** ???위 로그???원(ovc-login.js? ?일 ??. ?으?localStorage보다 ?선 */", "/** 탭 단위 로그인 신원(ovc-login.js와 동일 키). 있으면 localStorage보다 우선 */"),
    ("/** ??된 ?벤???????앗???으??드 메인 ?앗??기(리로????중복 방?) */", "/** 월드된 인벤에만 씨앗이 있으면 월드 메인 씨앗 숨기(리로드 시 중복 방지) */"),
    ("/** ?드(index): 로컬 ??? ?토리얼: ?번 ?이지 방문(session)????드? 별도. */", "/** 월드(index): 로컬 저장. 튜토리얼: 이번 페이지 방문(session)만 — 월드와 별도. */"),
    ("/** 가?UI ?롯?????바닥 책을 줍기 ?에??0(가방만 줍? 직후 ?벤? 비어 ?음). */", "/** 가방 UI 슬롯이 비면 바닥 책을 줍기 전에 0(가방만 줍은 직후 인벤이 비어 있음). */"),
    ("/** ?재 ?물지???자?1000 ?금 ?과 ??줄에 배치(겹침 방?) */", "/** 현재 식물지수 숫자·1000 단금 효과 한 줄에 배치(겹침 방지) */"),
    ("/** ?각??맑? 구역보다 ?동 ?용???간 ?? ?기 ?에 막히???낌??줄임 */", "/** 시각적 맑은 구역보다 이동 적용을 약간 늦게 막기 전에 막히는 느낌을 줄임 */"),
    ("/** 로컬·멀??presence?????집 ?태 ?시 길이(?격? rock_pickup 종료 ??hold 별도) */", "/** 로컬·멀티 presence의 돌 수집 상태 표시 길이(원격은 rock_pickup 종료 후 hold 별도) */"),
    ("/** ?격 ?레?어: rock_pickup ?션???긴 ???태 ?스?? ????ms(?른 ?션? REMOTE_ACTION_STATUS_HOLD_MS) */", "/** 원격 플레이어: rock_pickup 액션이 긴 동안 상태 유지 — 최대 ????ms(다른 액션은 REMOTE_ACTION_STATUS_HOLD_MS) */"),
    ("/** ?체 채팅 ?두(???는 모두?게 ?시). */", "/** 전체 채팅 접두(보이는 모두에게 표시). */"),
    ("/** ?각 콜론(U+FF1A) ?을 반각(U+003A)?로 ?일 ??IME·모바?에??귓말/?체 구문??깨?지 ?게 */", "/** 전각 콜론(U+FF1A) 을 반각(U+003A)으로 통일 — IME·모바일에서 귓말/전체 구문이 깨지지 않게 */"),
    ("/** UTF-16 ?로게이????중간?서 ?리지 ?게 ?름 */", "/** UTF-16 서로게이트를 중간에서 자르지 않게 자름 */"),
    ("/** ???환·백그?운????복? ?????레?에 ??간??건너?면 ?비 경로가 ?간?동처럼 보임 ???이?인??리셋 */", "/** 탭 전환·백그라운드 복귀 시 플레이어에 큰 간격이 건너뛰면 나비 경로가 순간이동처럼 보임 — 시뮬레인 리셋 */"),
    ("/** 관리자 ?버? ?물지???시·?개 ?에?가???제 ?물 ?산?별개) */", "/** 관리자 서버: 식물지수 표시·해제 시에만 실제 식물 산출(별개) */"),
    ("/** ?션??면 ??????비어 공유 리셋?로 ?인 ??appStorageKeysSharedWorldReset?로 가??래그까지 지?짐. local??기?? */", "/** 세션 끊기면 비어 공유 리셋으로 인식 — appStorageKeysSharedWorldReset으로 가방 플래그까지 지워짐. local은 기존 */"),
    ("/** 버킷 ?트?크 로그 ???요???만 true */", "/** 버킷 스택 로그 — 필요할 때만 true */"),
    ("/** index ?드 + ?보???료: ???앗? worldLooseSeed·seedCount ?책 (src/game/groundSeed.js 참고). */", "/** index 월드 + 튜토리얼: 땅 씨앗은 worldLooseSeed·seedCount 정책 (src/game/groundSeed.js 참고). */"),
    ("/** ?드 ?슨 ?앗 모드: 중복 id·과도??seedCount ?리 */", "/** 월드 느슨 씨앗 모드: 중복 id·과도한 seedCount 정리 */"),
    ("/** ?무 ?로 ?용 범위??어?릴 ???레?당 최? 변??(?간?동 ?낌 ?화) */", "/** 나무 위로 이동 범위를 넓힐 때 플레이당 최대 변위(순간이동 느낌 완화) */"),
    ("/** ?레?어·NPC 공통: 머리 ?선?말풍???이(?드 ?위) */", "/** 플레이어·NPC 공통: 머리 위선·말풍선 높이(월드 y위) */"),
    ("/** NPC 말풍?? 머리???간격(?레?어보다 좁게) */", "/** NPC 말풍선: 머리와의 간격(플레이어보다 좁게) */"),
    ("/** NPC 말풍?? ?수?수?y?줄여 머리 ??래)?로 ?동 */", "/** NPC 말풍선: 음수·수·y를 줄여 머리 아래쪽으로 이동 */"),
    ("/** ?레?어 말풍?만: ?네??머리 근처) ?에 ?실???리??드 ?위, ?수?말풍?????? */", "/** 플레이어 말풍선만: 아네(머리 근처) 위에 투명·그림자 월드 y위, 음수·말풍선 높이 */"),
    ("/** ?격 ?원??많을?록 ?링·???간격???간 ?려 DB·?라?언??부?? 줄임 */", "/** 원격 인원이 많을수록 폴링·저장 간격을 약간 늘려 DB·클라이언트 부하를 줄임 */"),
    ("/** Other browser tabs use a different session id but the same account ??do not draw them as remotes. */", "/** Other browser tabs use a different session id but the same account — do not draw them as remotes. */"),
    ("'<div><span>S / \\u2193</span><p>?래??동</p></div>'", "'<div><span>S / \\u2193</span><p>아래로 이동</p></div>'"),
    ("'<div><span>D / \\u2192</span><p>?른쪽으??동</p></div>'", "'<div><span>D / \\u2192</span><p>오른쪽으로 이동</p></div>'"),
    ('if (!window.confirm("?토리얼??건너?고 ?유? ?레?할까요?")) {', 'if (!window.confirm("튜토리얼을 건너뛰고 자유롭게 플레이할까요?")) {'),
    ('setOnboardingCalloutVisible(true, "E?? ?러 가방을 ???세??");', 'setOnboardingCalloutVisible(true, "E키를 눌러 가방을 소지하세요.");'),
    ('"space바? ?르??프??니?? ?보?요!"', '"space바를 누르면 점프를 합니다. 해보세요!"'),
    ('setOnboardingCalloutVisible(true, "?앗?로 ?동?세??");', 'setOnboardingCalloutVisible(true, "씨앗으로 이동하세요.");'),
    ('setOnboardingCalloutVisible(true, "e?? ?러 ?앗?????세??");', 'setOnboardingCalloutVisible(true, "e키를 눌러 씨앗을 소지하세요.");'),
    ('setOnboardingCalloutVisible(true, "?물???인??찾아가?요.");', 'setOnboardingCalloutVisible(true, "식물의 달인을 찾아가세요.");'),
    ('setOnboardingCalloutVisible(true, "q??러 ?물???인???하?요.");', 'setOnboardingCalloutVisible(true, "q를 눌러 식물의 달인과 대화하세요.");'),
    ('const line1 = "?명??참고?세??";', 'const line1 = "설명을 참고하세요.";'),
    ('const line2 = "esc ?는 ?무곳이???릭???명창을 ?으?요.";', 'const line2 = "esc 또는 아무곳이나 클릭해 설명창을 닫으세요.";'),
    ('setOnboardingCalloutVisible(true, "?물근처???동?로 ?동?세??");', 'setOnboardingCalloutVisible(true, "우물근처에 양동이로 이동하세요.");'),
    ('"?동??근처?가??E?? ?러 ?동?? ?어 주세??"', '"양동이 근처로 가서 E키를 눌러 양동이를 들어 주세요."'),
    ('"?물??동????Q?? ?러 물을 길어 주세??"', '"우물로 이동한 뒤 Q키를 눌러 물을 길어 주세요."'),
    ('? "축하?니?? ?물 ?우??법을 배우?습?다."', '? "축하합니다! 식물 키우는 법을 배우셨습니다."'),
    (': "?직 ?았?니???까지 진행?주?요."', ': "아직 남았습니다 끝까지 진행해주세요."'),
    ('"?아?니???비??근접?여 e,q??으?요"', '"날아다니는 나비에 근접하여 e,q로 잡으세요"'),
    ('"?무??동?여 ?라???매??근처??동?세??"', '"나무를 이동하여 올라타고 열매들 근처로 이동하세요."'),
    ('setOnboardingCalloutVisible(true, "e?? ?러 ?매??세??");', 'setOnboardingCalloutVisible(true, "e키를 눌러 열매를 따세요.");'),
    ('const lineSeed = "?앗???겼?니 ?하??곳에 ?릭???용?세??";', 'const lineSeed = "씨앗이 생겼으니 원하는 곳에 클릭해 사용하세요.";'),
    ('const lineB = "?무밖으??동?세??";', 'const lineB = "나무밖으로 이동하세요.";'),
    ('setOnboardingCalloutVisible(true, "?앗???었?니??");', 'setOnboardingCalloutVisible(true, "씨앗을 얻었습니다.");'),
    ('"Esc??러 ?정?????? ?시 Esc??아 보세??"', '"Esc를 눌러 설정을 연 뒤, 다시 Esc로 닫아 보세요."'),
    ('setOnboardingCalloutVisible(true, "축하?니?? ?토리얼???났?니??!");', 'setOnboardingCalloutVisible(true, "축하합니다! 튜토리얼이 끝났습니다!!");'),
    (': "?라???버 ?인 ?요"', ': "온라인 서버 확인 필요"'),
    ('return { anchorEl: worldSadBtn, text: "?퍼?? Ctrl+S" };', 'return { anchorEl: worldSadBtn, text: "슬퍼요: Ctrl+S" };'),
    ('/** 고정 UI(?정·채팅·?트·?퍼?? ??브라?? title ???#plant-hover-label ???로 ?축???시 */', '/** 고정 UI(설정·채팅·하트·슬퍼요) — 브라우저 title 대신 #plant-hover-label 스타일로 단축키 표시 */'),
    ('throw new Error(data.message || "?청???패?습?다.");', 'throw new Error(data.message || "요청이 실패했습니다.");'),
    ('showOnlineDebugMessage("????계정?니?? 로그?웃?니??");', 'showOnlineDebugMessage("삭제된 계정입니다. 로그아웃합니다.");'),
    ('showOnlineDebugMessage("?른 기기?서 로그?되??로그?웃?니??");', 'showOnlineDebugMessage("다른 기기에서 로그인되어 로그아웃합니다.");'),
    ('button.setAttribute("aria-label", color + " ?깔");', 'button.setAttribute("aria-label", color + " 색깔");'),
    ('"로컬 ????패: "', '"로컬 저장 실패: "'),
]

REPLACEMENTS = [(a, b) for a, b in REPLACEMENTS if a != b]

COMMENT_REPLACEMENTS = [
    (
        "/**\n * 보이??뿌리?= style.css .big-tree-roots (left 39, w 68, h 16, bottom -2).\n * ?체 기둥 박스?겹치???지?갈 ??몸통?겹쳐???무 모드??어가 ?간?동처럼 보임 ??발·뿌리만 검??\n */",
        "/**\n * 보이는 뿌리만 = style.css .big-tree-roots (left 39, w 68, h 16, bottom -2).\n * 전체 기둥 박스로 겹치면 옆 지나갈 때 몸통만 겹쳐도 나무 모드로 들어가 순간이동처럼 보임 → 발·뿌리만 검사.\n */",
    ),
    (
        "/**\n * npcY???프?이??박스 ?선(?드 y가 ?을?록 ?면 ??.\n * PNG ?단 ?백만큼 ?래??려 ?제 머리 ???y.\n */",
        "/**\n * npcY는 스프라이트 박스 윗선(월드 y가 작을수록 화면 위).\n * PNG 상단 여백만큼 아래로 내려 실제 머리 꼭대기 y.\n */",
    ),
    ("/** headTopWorldY: 캐릭??머리(?선) ?드 y. 말풍??transform 기? y(버블 ??? */", "/** headTopWorldY: 캐릭터 머리(윗선) 월드 y. 말풍선 transform 기준 y(버블 꼭대기) */"),
    ("/** ?드(index) ?용: 공유 맵만 초기?? ?토리얼 ??값·tutorial.html ?동 ?음. */", "/** 월드(index) 전용: 공유 맵만 초기화, 튜토리얼 모드·tutorial.html 동기 없음. */"),
    ("/** ?크????로컬?토리?가 비어???버??tutorial_done???으?index?보내??해 계정???기??*/", "/** 시크릿 창 등 로컬스토리지가 비어도 서버에 tutorial_done이 있으면 index로 보내기 위해 계정에 동기화 */"),
    (
        " * ?토리얼????번이?도 ?낸 계정? 로컬???료 ?태가 ?아???다(리로?·탭 종료·로그?웃/로그???에???드).",
        " * 튜토리얼을 한 번이라도 끝낸 계정은 로컬에 완료 상태가 남아야 한다(리로드·탭 종료·로그아웃/로그인 후에도 월드).",
    ),
    (
        " * ??번이?도 ?드????계정: ?튜?리???기???션???니??토리얼 미완??태? * 본게?으??돌린다(리로?·로그아??로그?·탭 ?환 ?에???드).",
        " * 한 번이라도 월드에 들어온 계정: 튜토리얼 재생 세션이 아니면 튜토리얼 미완료 상태를 * 본게임으로 되돌린다(리로드·로그아웃/로그인·탭 전환 후에도 월드).",
    ),
    ("/** NPC 말풍선: 음수·수·y를 줄여 머리 아래쪽으로 이동 */", "/** NPC 말풍선: 양수일수록 y를 줄여 머리 쪽(아래)으로 이동 */"),
    ("/** 플레이어 말풍선만: 아네(머리 근처) 위에 투명·그림자 월드 y위, 음수·말풍선 높이 */", "/** 플레이어 말풍선만: 닉네임(머리 근처) 위에 확실히 올리기(월드 단위, 클수록 말풍선 더 위) */"),
    ("/** 플레이어·NPC 공통: 머리 위선·말풍선 높이(월드 y위) */", "/** 플레이어·NPC 공통: 머리 윗선과 말풍선 사이(월드 단위) */"),
    ("/* 가?버튼(#world-bag-inventory) ?버??document ?인?로 ?기 ?트? ?기??*/", "/* 가방 버튼(#world-bag-inventory) 호버는 document 위임으로 처리 — 스크립트 주석 */"),
    ('button.setAttribute("aria-label", color + " ?깔");', 'button.setAttribute("aria-label", color + " 색깔");'),
]

# Onboarding cases that need unique context (fix mis-merged lines)
CONTEXT_REPLACEMENTS = [
    (
        "    case 14: {\n      setOnboardingCalloutVisible(true, \"정중앙 위 나무로 이동하세요.\");",
        "    case 14: {\n      setOnboardingCalloutVisible(true, \"그대로 아까 심은 씨앗으로 가세요.\");",
    ),
    (
        "    case 20: {\n      setOnboardingCalloutVisible(true, \"우물근처에 양동이로 이동하세요.\");",
        "    case 20: {\n      setOnboardingCalloutVisible(true, \"가장 작게 축소 해보세요.\");",
    ),
    (
        "    case 21: {\n      setOnboardingCalloutVisible(true, \"?중?????무??동?세??\");",
        "    case 21: {\n      setOnboardingCalloutVisible(true, \"정중앙 위 나무로 이동하세요.\");",
    ),
    (
        "    case 24: {\n      setOnboardingCalloutVisible(true, \"그대로 아까 심은 씨앗으로 가세요.\");",
        "    case 24: {\n      setOnboardingCalloutVisible(true, \"가방을 연 뒤 사과 칸을 눌러 먹으세요.\");",
    ),
]

path = Path(__file__).resolve().parent.parent / "script.js"
text = path.read_text(encoding="utf-8")
applied = 0
missing = []
for old, new in REPLACEMENTS + COMMENT_REPLACEMENTS + CONTEXT_REPLACEMENTS:
    if old in text:
        text = text.replace(old, new)
        applied += 1
    else:
        missing.append(old[:80])

path.write_text(text, encoding="utf-8", newline="\n")
print("applied", applied)
if missing:
    print("missing", len(missing))
    for m in missing[:15]:
        print(" -", m)
