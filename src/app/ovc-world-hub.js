/** 설정 「튜토리얼 하기」로 연 일회성 재생 세션(탭 단위). 없으면 월드 경험 계정은 튜토리얼에 갇히지 않게 복구한다. */
export const ovcTutorialReplaySessionKey = "ovcTutorialReplaySessionV1";
export const ovcTutorialWorldResetPendingKey = "ovcTutorialWorldResetPending";

export function ovcTutorialReplaySessionActive() {
  try {
    return sessionStorage.getItem(ovcTutorialReplaySessionKey) === "1";
  } catch (e) {
    return false;
  }
}

/** 설정 「튜토리얼 하기」 직후 tutorial.html 로드·월드 초기화 대기 */
export function ovcTutorialWorldResetPending() {
  try {
    return sessionStorage.getItem(ovcTutorialWorldResetPendingKey) === "1";
  } catch (e) {
    return false;
  }
}

export function ovcTutorialIntentionalEntryActive() {
  return ovcTutorialReplaySessionActive() || ovcTutorialWorldResetPending();
}

/** 튜토리얼 갇힘 탈출: `?ovc_world=1` 또는 sessionStorage 플래그 → index(월드)로 두고 온보딩 완료 저장 */
export const ovcForceWorldHubSessionKey = "ovcForceWorldHubV1";
export const ovcForceWorldHubUrlParam = "ovc_world";
/** sessionStorage 말고도 탈출 의도를 남김(저장 실패·다른 탭 대비). 로그인 확정 시 제거. */
export const ovcPendingWorldHubGuestKey = "ovcPendingWorldHubGuestV1";

export function ovcPendingWorldHubUserStorageKey(userId) {
  return "ovcPendingWorldHubUserV1:" + String(userId || "");
}

export function ovcClearPendingWorldHubMarkers(userId) {
  try {
    sessionStorage.removeItem(ovcForceWorldHubSessionKey);
    localStorage.removeItem(ovcPendingWorldHubGuestKey);
    if (userId) localStorage.removeItem(ovcPendingWorldHubUserStorageKey(userId));
  } catch (eClrMarkers) {}
}

export function ovcHtmlPageUrl(htmlFile) {
  const u = new URL(htmlFile, window.location.href);
  u.searchParams.set("v", "20260517e");
  u.searchParams.set("t", String(Date.now()));
  return u.toString();
}

export function ovcWorldIndexUrl() {
  return ovcHtmlPageUrl("index.html");
}

export function ovcTutorialPageUrl() {
  return ovcHtmlPageUrl("tutorial.html");
}

export function ovcHardNavigateToWorldIndex() {
  try {
    var u = new URL("index.html", window.location.href);
    u.searchParams.set(ovcForceWorldHubUrlParam, "1");
    u.searchParams.set("v", "20260517e");
    u.searchParams.set("t", String(Date.now()));
    var url = u.toString();
    try {
      window.top.location.replace(url);
    } catch (eTop) {
      window.location.replace(url);
    }
  } catch (eNav) {
    try {
      window.top.location.replace(
        "index.html?ovc_world=1&v=20260517e&t=" + String(Date.now())
      );
    } catch (eTop2) {
      window.location.replace(
        "index.html?ovc_world=1&v=20260517e&t=" + String(Date.now())
      );
    }
  }
}

export function ovcUrlIndicatesForceWorldHub() {
  try {
    if (typeof window === "undefined" || !window.location) return false;
    var raw = new URLSearchParams(window.location.search || "").get(
      ovcForceWorldHubUrlParam
    );
    if (raw === "1" || raw === "true" || raw === "yes") return true;
    var h = window.location.hash || "";
    if (/ovc_world=(?:1|true|yes)/i.test(h)) return true;
    if (/^#world(?:=|:)?(?:1|true|yes)?$/i.test(h)) return true;
    return false;
  } catch (e) {
    return false;
  }
}

export function ovcForceWorldHubIsRequested() {
  try {
    if (ovcUrlIndicatesForceWorldHub()) return true;
    if (sessionStorage.getItem(ovcForceWorldHubSessionKey) === "1") {
      return true;
    }
    if (localStorage.getItem(ovcPendingWorldHubGuestKey) === "1") {
      return true;
    }
    var uidFromLs = "";
    try {
      uidFromLs = (sessionStorage.getItem("ovcSessionUserIdV1") || "").trim();
    } catch (eSess) {}
    if (!uidFromLs) {
      try {
        uidFromLs = (localStorage.getItem("ovcCurrentUserIdV1") || "").trim();
      } catch (eUid) {}
    }
    if (
      uidFromLs &&
      localStorage.getItem(ovcPendingWorldHubUserStorageKey(uidFromLs)) ===
        "1"
    ) {
      return true;
    }
  } catch (e) {}
  return false;
}

try {
  if (ovcUrlIndicatesForceWorldHub()) {
    sessionStorage.setItem(ovcForceWorldHubSessionKey, "1");
  }
} catch (eForceUrlHook) {}
