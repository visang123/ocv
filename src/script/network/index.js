/**
 * Network/Sync — Supabase·Realtime·월드 스냅샷·presence.
 * script.js 에서 buildNetworkDeps() 로 게임 바인딩을 넘긴 뒤 initScriptNetwork(deps) 호출.
 */
import { createModule as createNetworkDebug } from "./debug.js";
import { createModule as createWorldSnapshot } from "./world-snapshot.js";
import { createModule as createPresence } from "./presence.js";
import { createWorldPollSync } from "./poll-sync.js";

/**
 * @param {object} deps — buildNetworkDeps() 결과 + 이후 갱신되는 함수 참조
 * @returns {object} poll/sync/snapshot/presence/debug API
 */
export function initScriptNetwork(deps) {
  const debug = createNetworkDebug(deps);
  Object.assign(deps, debug);

  const snapshot = createWorldSnapshot(deps);
  Object.assign(deps, snapshot);

  const presence = createPresence(deps);
  Object.assign(deps, presence);

  const poll = createWorldPollSync(deps);

  return Object.assign({}, debug, snapshot, presence, poll);
}
