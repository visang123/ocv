export function createSyncDebugHelpers(options) {
  const enabled = Boolean(options && options.enabled);
  const addNetworkDebugLog =
    options && typeof options.addNetworkDebugLog === "function"
      ? options.addNetworkDebugLog
      : function () {};

  function addSyncDebugLog(topic, fields, force) {
    if (!force && !enabled) return;
    const payload = fields && typeof fields === "object" ? fields : {};
    const keys = Object.keys(payload).sort();
    const body = keys.map(function (k) {
      const v = payload[k];
      return k + "=" + (v == null ? "" : String(v));
    }).join(" ");
    addNetworkDebugLog("[sync:" + String(topic || "trace") + "] " + body);
  }

  function publishSyncDebugChecklistTemplate(targetWindow) {
    const w = targetWindow || (typeof window !== "undefined" ? window : null);
    if (!w) return;
    w.OVCSyncDebugChecklist = function () {
      return [
        "[1] 동시 씨앗 줍기(2클라) -> 한쪽만 획득/리스폰 정상",
        "[2] 나비 동시 잡기 -> 1회 포획 처리/중복 인벤 증가 없음",
        "[3] 물주기 직후(양쪽) -> 깜빡임/롤백 없음",
        "[4] 마법가루 사용 직후 -> 단계/게이지 역행 없음",
        "[5] 시간 차(PC 시계 다르게) -> 급성장/즉시 마름 없음",
        "[6] 네트워크 지연 후 복귀 -> 오래된 상태가 최신 상태를 덮지 않음",
        "[7] 동일 eventId 재수신 -> 무시 로그 확인",
        "[8] poll vs broadcast 동시 도착 -> broadcast 우선 적용"
      ];
    };
  }

  return {
    addSyncDebugLog: addSyncDebugLog,
    publishSyncDebugChecklistTemplate: publishSyncDebugChecklistTemplate
  };
}
