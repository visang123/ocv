/**
 * Systems/Logic — 이동·체력·식물 수분·월드 틱·나비 등 (DOM 최소).
 * script.js buildSystemsDeps() 후 initScriptSystems(deps) 호출.
 */
import { createModule as createPlayerMovement } from "./player-movement.js";
import { createModule as createPlayerHealth } from "./player-health.js";
import { createModule as createWorldTicks } from "./world-ticks.js";
import { createModule as createPlantWater } from "./plant-water.js";
import { createModule as createButterflies } from "./butterflies.js";
import { createModule as createRemotePrune } from "./remote-prune.js";

/**
 * @param {object} deps
 */
export function initScriptSystems(deps) {
  const movement = createPlayerMovement(deps);
  Object.assign(deps, movement);

  const health = createPlayerHealth(deps);
  Object.assign(deps, health);

  const worldTicks = createWorldTicks(deps);
  Object.assign(deps, worldTicks);

  const plantWater = createPlantWater(deps);
  Object.assign(deps, plantWater);

  const butterflies = createButterflies(deps);
  Object.assign(deps, butterflies);

  const remotePrune = createRemotePrune(deps);
  Object.assign(deps, remotePrune);

  return Object.assign({}, movement, health, worldTicks, plantWater, butterflies, remotePrune);
}
