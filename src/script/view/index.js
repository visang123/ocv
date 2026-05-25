/**
 * View — DOM·transform·UI 반영.
 * script.js buildLayerDeps() → initScriptSystems → initScriptView(deps) 순서.
 */
import { createModule as createPlayerRender } from "./player-render.js";
import { createModule as createPlantVisual } from "./plant-visual.js";
import { createModule as createCameraScreen } from "./camera-screen.js";
import { createModule as createWorldDom } from "./world-dom.js";
import { createModule as createInventoryBag } from "./inventory-bag.js";
import { createModule as createNpcChat } from "./npc-chat.js";
import { createModule as createUiChrome } from "./ui-chrome.js";

/**
 * @param {object} deps — systems 초기화 후 동일 객체 (Object.assign된 API 포함)
 */
export function initScriptView(deps) {
  const playerRender = createPlayerRender(deps);
  Object.assign(deps, playerRender);

  const plantVisual = createPlantVisual(deps);
  Object.assign(deps, plantVisual);

  const cameraScreen = createCameraScreen(deps);
  Object.assign(deps, cameraScreen);

  const worldDom = createWorldDom(deps);
  Object.assign(deps, worldDom);

  const inventoryBag = createInventoryBag(deps);
  Object.assign(deps, inventoryBag);

  const npcChat = createNpcChat(deps);
  Object.assign(deps, npcChat);

  const uiChrome = createUiChrome(deps);
  Object.assign(deps, uiChrome);

  return Object.assign(
    {},
    playerRender,
    plantVisual,
    cameraScreen,
    worldDom,
    inventoryBag,
    npcChat,
    uiChrome
  );
}
