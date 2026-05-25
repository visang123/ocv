"""Assign view function names to module files."""
from __future__ import annotations

import re
from pathlib import Path

SCRIPT = Path("script.js")
layers = Path("src/script/layers.js").read_text(encoding="utf-8")
view = {m.group(1) for m in re.finditer(r'  (\w+): "view"', layers)}
lines = SCRIPT.read_text(encoding="utf-8").splitlines()


def is_wrapper(line: str) -> bool:
    return "_systemsApi." in line or "_networkApi." in line or "_viewApi." in line


def has_body(name: str) -> bool:
    pat = re.compile(r"^function " + re.escape(name) + r"\s*\(")
    for line in lines:
        if pat.match(line):
            return not is_wrapper(line)
    return False


bodies = sorted(n for n in view if has_body(n))


def module_for(name: str) -> str:
    n = name.lower()
    if any(
        k in n
        for k in (
            "baginventory",
            "bagitem",
            "bagpanel",
            "bagdiscard",
            "bagrequired",
            "bagclick",
            "bagground",
            "loadbag",
            "savebag",
            "removebag",
            "discardbag",
            "normalizebag",
            "finishbag",
            "clearbag",
            "ensurebag",
            "plantinventoryseed",
            "createstarterseed",
        )
    ) or name in (
        "canUseBagInventoryGameplay",
        "shouldShowWorldBagInventoryUi",
        "isOnboardingInventoryTutorialActive",
        "maybeAdvanceOnboardingAfterInventoryOpened",
        "maybeAdvanceOnboardingAfterInventoryClosed",
        "maybeAdvanceOnboardingAfterBookInventoryOpened",
        "onboardingClearInventoryCloseHintTimer",
        "scheduleOnboardingInventoryCloseHint",
        "assignExtraSeedInventoryOwner",
    ):
        return "inventory-bag"
    if any(
        k in n
        for k in (
            "planthover",
            "plantcard",
            "plantgrowth",
            "plantstate",
            "plantwater",
            "plantprogress",
            "sharedplant",
            "extraplant",
            "sproutimage",
            "soil",
            "waterneeded",
            "waterhover",
            "badsoil",
            "urgentwater",
        )
    ) or name.startswith(
        ("updatePlant", "renderPlant", "ensureSharedPlant", "teardownExtraPlant", "getPlant", "applyPlant", "clearPlant", "hidePlant", "restorePlant", "showPlant", "plantShows", "shouldHide", "shouldShowFirst", "shouldSkipPlant", "shouldSuppressPlant")
    ):
        return "plant-visual"
    if any(k in n for k in ("updatecamera", "toscreen", "groundscreen", "initializezoom")):
        return "camera-screen"
    if any(
        k in n
        for k in (
            "renderplayer",
            "updateplayer",
            "synclocalplayer",
            "setworldposition",
            "setworldsize",
            "getplayerrendered",
            "synccharacterpreview",
            "toggleplayerhealth",
        )
    ):
        return "player-render"
    if any(
        k in n
        for k in (
            "updateapple",
            "updateworldrock",
            "rebuildworldrock",
            "rebuildworldbag",
            "updateworldbag",
            "updateworldextra",
            "updatebucket",
            "updateseedposition",
            "updateseedcard",
            "updateseeddry",
            "updateseedinventory",
            "createrandomapple",
            "createrandomworld",
            "loadrockinventory",
            "saverockinventory",
            "placedcraft",
            "craftchair",
            "updatewell",
        )
    ) or name in ("createRandomApples", "createRandomWorldRocks", "rebuildPlacedCraftFurnitureDom", "updatePlacedCraftFurnitureDom"):
        return "world-dom"
    if any(
        k in n
        for k in (
            "updatenpc",
            "layoutnpc",
            "setnpcbubble",
            "worldnpc",
            "shownpc",
            "worldchat",
            "setlocalchat",
            "setplayerbubble",
            "speechbubble",
            "setworldchat",
            "updateplayerchat",
            "updateplayerbubble",
            "layoutworldchat",
            "worldchatbubble",
            "shouldshowincomingworldchat",
        )
    ):
        return "npc-chat"
    if any(
        k in n
        for k in (
            "settingsoverlay",
            "guidecard",
            "guidepages",
            "guideinventory",
            "onboarding",
            "showdialogue",
            "showplayeralert",
            "flashonboarding",
            "updateonboarding",
            "ovctrydismiss",
            "adminaccount",
            "onlinedebug",
            "uishortcut",
            "magicpowderinventory",
            "opensettings",
            "closesettings",
        )
    ):
        return "ui-chrome"
    return "ui-chrome"


from collections import defaultdict

mods: dict[str, list[str]] = defaultdict(list)
for name in bodies:
    mods[module_for(name)].append(name)

for mod, names in sorted(mods.items()):
    print(mod, len(names))
