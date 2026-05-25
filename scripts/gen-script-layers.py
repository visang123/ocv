"""Generate src/script/layers.js — function name → responsibility layer."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
OUT = ROOT / "src" / "script" / "layers.js"


def layer(name: str) -> str:
    n = name.lower()
    core = (
        "setup",
        "gameloop",
        "bootstrap",
        "initializezoom",
        "opencharacter",
        "loadplayerposition",
        "saveplayerposition",
        "ovcrun",
        "finishdev",
        "preparetutorial",
        "resetgame",
        "resettutorial",
        "runmultiplayerworldsynctick",
    )
    if any(k in n for k in core):
        return "core"
    net = (
        "multiplayer",
        "presence",
        "pollworld",
        "syncworld",
        "remote",
        "snapshot",
        "broadcast",
        "network",
        "supabase",
        "realtime",
        "butterflystate",
        "ingestremote",
        "prunestale",
        "worldstate",
        "ovconline",
        "channel",
        "hydrat",
        "validatecurrentaccount",
        "sendmultiplayer",
        "setupmultiplayer",
        "renderremote",
        "applyshared",
        "getsharedworld",
        "savesharedworld",
        "applyserverworld",
        "addnetworkdebug",
        "worldsync",
        "playerstate",
        "leavebroadcast",
        "syncdebug",
        "accountsession",
        "supersededtab",
    )
    if any(k in n for k in net):
        return "network"
    view = (
        "render",
        "updatecamera",
        "updateplayer",
        "syncworldplantfogvisual",
        "visual",
        "rebuild",
        "setworld",
        "setworldsize",
        "overlay",
        "inventory",
        "card",
        "gauge",
        "prompt",
        "updatewell",
        "updateseed",
        "updatebucket",
        "updateapple",
        "updateplant",
        "updatenpc",
        "updateguide",
        "updatebag",
        "updatemagic",
        "relayout",
        "speech",
        "bubble",
        "screen",
        "transform",
        "chatbubble",
        "hide",
        "show",
        "syncworldbag",
        "syncguide",
        "synclocalplayer",
        "updateworld",
        "refreshnetworkdebug",
        "initializezoom",
        "dom",
        "image",
        "visibility",
        "layout",
        "flashonboarding",
        "updateonboarding",
    )
    if any(k in n for k in view):
        return "view"
    return "systems"


def main() -> None:
    lines = SCRIPT.read_text(encoding="utf-8").splitlines()
    funcs = []
    for i, line in enumerate(lines, 1):
        m = re.match(r"^(async )?function (\w+)", line)
        if m:
            funcs.append((m.group(2), layer(m.group(2)), i))

    parts = [
        "/**",
        " * script.js 함수 → 4계층 역할 맵 (scripts/gen-script-layers.py 로 재생성).",
        " * @see src/script/core-main.js · src/script/network/",
        " */",
        "",
        "/** @typedef {'core'|'systems'|'view'|'network'} ScriptLayer */",
        "",
        "export const SCRIPT_LAYER_DESCRIPTIONS = {",
        '  core: "게임 시작·gameLoop·setup·부트스트랩·전역 타이머",',
        '  systems: "이동·충돌·성장·인벤·온보딩 규칙 — DOM 없이 상태만",',
        '  view: "transform·이미지·UI·말풍선·카메라 — 상태를 화면에 반영",',
        '  network: "Supabase·presence·월드 스냅샷 송수신·원격 플레이어"',
        "};",
        "",
        "/** @type {Record<string, ScriptLayer>} */",
        "export const SCRIPT_FUNCTION_LAYER = {",
    ]
    for name, lay, _ln in funcs:
        parts.append(f'  {name}: "{lay}",')
    parts.extend(
        [
            "};",
            "",
            "/** @param {string} name */",
            "export function scriptLayerForFunction(name) {",
            '  return SCRIPT_FUNCTION_LAYER[name] || "systems";',
            "}",
            "",
        ]
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts), encoding="utf-8", newline="\n")
    print(f"wrote {OUT} ({len(funcs)} functions)")


if __name__ == "__main__":
    main()
