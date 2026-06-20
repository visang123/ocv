(function () {
  const config = window.OVC_ONLINE_CONFIG || {};
  let client = null;

  /** 네트워크 지연·일시 오류 시 클라이언트가 멈춘 것처럼 보이지 않게 */
  var DEFAULT_FETCH_TIMEOUT_MS = 15000;

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function isRetryableNetworkError(err) {
    if (!err) return false;
    if (err.name === "AbortError") return true;
    var msg = String((err && err.message) || "");
    if (msg.indexOf("Failed to fetch") !== -1) return true;
    if (msg.indexOf("NetworkError") !== -1) return true;
    if (msg.indexOf("시간이 초과") !== -1) return true;
    if (msg.indexOf("timeout") !== -1) return true;
    if (msg.indexOf("502") !== -1 || msg.indexOf("503") !== -1 || msg.indexOf("504") !== -1) {
      return true;
    }
    return false;
  }

  async function withNetworkRetry(operation, opts) {
    var attempts = (opts && opts.attempts) || 3;
    var baseDelay = (opts && opts.baseDelayMs) || 280;
    var last;
    for (var i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (err) {
        last = err;
        if (i < attempts - 1 && isRetryableNetworkError(err)) {
          await sleep(baseDelay * Math.pow(2, i));
          continue;
        }
        throw err;
      }
    }
    throw last;
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    var ms = timeoutMs == null ? DEFAULT_FETCH_TIMEOUT_MS : timeoutMs;
    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, ms);
    var base = options || {};
    return fetch(url, Object.assign({}, base, { signal: controller.signal })).finally(function () {
      window.clearTimeout(timer);
    });
  }

  function resolveCreateClientFn() {
    var sb = window.supabase;
    if (sb && typeof sb.createClient === "function") {
      return function (url, key) {
        return sb.createClient(url, key);
      };
    }
    if (sb && sb.default && typeof sb.default.createClient === "function") {
      return function (url, key) {
        return sb.default.createClient(url, key);
      };
    }
    if (typeof window.createClient === "function") {
      return function (url, key) {
        return window.createClient(url, key);
      };
    }
    return null;
  }

  function hasValidSupabaseProjectUrl() {
    if (!config.supabaseUrl || typeof config.supabaseUrl !== "string") return false;
    var u = config.supabaseUrl.trim();
    if (u.includes("netlify.app")) return false;
    return /^https:\/\/.+\.supabase\.co\/?$/i.test(u);
  }

  function isConfigured() {
    return Boolean(
      hasValidSupabaseProjectUrl() &&
        config.supabaseKey &&
        resolveCreateClientFn()
    );
  }

  function canLoginViaSupabaseRest() {
    return Boolean(
      hasValidSupabaseProjectUrl() &&
        config.supabaseKey &&
        config.accountsTable
    );
  }

  function getClient() {
    if (!isConfigured()) return null;

    if (!client) {
      var factory = resolveCreateClientFn();
      if (!factory) return null;
      client = factory(config.supabaseUrl.trim().replace(/\/$/, ""), config.supabaseKey);
    }

    return client;
  }

  function resetClient() {
    if (!client) return;
    if (typeof client.removeAllChannels === "function") {
      Promise.resolve(client.removeAllChannels()).catch(function () {
        // Ignore cleanup failures; we still reset the client reference.
      });
    }
    client = null;
  }

  async function sha256Hex(value) {
    const encoded = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  const ACCOUNT_AUTH_SESSION_ACTIVE_MS = 70000;
  const ACCOUNT_AUTH_PRESENCE_ID_PREFIX = "auth-account-";

  function accountAuthPresenceId(accountId) {
    return ACCOUNT_AUTH_PRESENCE_ID_PREFIX + String(accountId || "").trim();
  }

  async function readAccountAuthSessionUpdatedAt(accountId) {
    const id = accountAuthPresenceId(accountId);
    if (!id || id === ACCOUNT_AUTH_PRESENCE_ID_PREFIX) return 0;
    const supabaseClient = getClient();
    if (!supabaseClient) return 0;
    try {
      const { data, error } = await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .select("updated_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !data || !data.updated_at) return 0;
      const parsed = Date.parse(String(data.updated_at));
      return Number.isFinite(parsed) ? parsed : 0;
    } catch (err) {
      return 0;
    }
  }

  async function hasActiveAccountAuthSession(accountId) {
    const uid = String(accountId || "").trim();
    if (!uid) return false;
    const updatedAt = await readAccountAuthSessionUpdatedAt(uid);
    if (!updatedAt) return false;
    return Date.now() - updatedAt < ACCOUNT_AUTH_SESSION_ACTIVE_MS;
  }

  async function claimAccountAuthSession(accountId, name) {
    const uid = String(accountId || "").trim();
    if (!uid) return;
    const supabaseClient = getClient();
    if (!supabaseClient) return;
    const payload = {
      id: accountAuthPresenceId(uid),
      room: String(config.multiplayerRoom || "ovc-main-room"),
      account_id: uid,
      name: String(name || "OVC"),
      color: "#ffffff",
      x: 0,
      depth: 0,
      jump_y: 0,
      updated_at: new Date().toISOString()
    };
    await withNetworkRetry(async function () {
      const { error } = await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .upsert(payload, { onConflict: "id" });
      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
    }, { attempts: 2, baseDelayMs: 120 });
  }

  async function touchAccountAuthSession(accountId, name) {
    return claimAccountAuthSession(accountId, name);
  }

  async function clearAccountAuthSession(accountId) {
    const uid = String(accountId || "").trim();
    if (!uid) return;
    const supabaseClient = getClient();
    if (!supabaseClient) return;
    try {
      await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .delete()
        .eq("id", accountAuthPresenceId(uid));
    } catch (err) {
      // Best effort on logout/tab close.
    }
  }

  async function loginViaSupabaseRest(normalizedName, password) {
    const passwordHash = await sha256Hex(password);
    const base = config.supabaseUrl.trim().replace(/\/$/, "");
    const tableSeg = encodeURIComponent(config.accountsTable);
    const url =
      base +
      "/rest/v1/" +
      tableSeg +
      "?select=id,name,color,tutorial_done&name=eq." +
      encodeURIComponent(normalizedName) +
      "&password_hash=eq." +
      encodeURIComponent(passwordHash) +
      "&limit=1";

    let response;
    try {
      response = await fetchWithTimeout(url, {
        method: "GET",
        headers: {
          apikey: config.supabaseKey,
          Authorization: "Bearer " + config.supabaseKey
        }
      });
    } catch (error) {
      throw normalizeOnlineError(error);
    }

    if (!response.ok) {
      throw new Error("로그인 요청 실패: " + response.status);
    }

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("이름 또는 비밀번호가 맞지 않습니다.");
    }

    const data = rows[0];
    if (await hasActiveAccountAuthSession(data.id)) {
      throw new Error(
        "이미 다른 창에서 이 계정으로 접속 중입니다. 해당 창을 닫거나 로그아웃한 뒤 다시 시도하세요."
      );
    }
    const sessionToken = generateSessionToken();
    try {
      const patchUrl = base + "/rest/v1/" + tableSeg + "?id=eq." + encodeURIComponent(String(data.id));
      const patchRes = await fetchWithTimeout(patchUrl, {
        method: "PATCH",
        headers: {
          apikey: config.supabaseKey,
          Authorization: "Bearer " + config.supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ session_token: sessionToken })
      });
      if (patchRes.ok) {
        return { ...data, session_token: sessionToken };
      }
    } catch (patchErr) {
      if (window.console && typeof window.console.warn === "function") {
        window.console.warn("[OVC login] session token REST patch skipped:", patchErr);
      }
    }
    return { ...data };
  }

  async function signUp(name, password) {
    const normalizedName = normalizeName(name);
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return signUpWithLocalServer(normalizedName, password);
    }

    try {
      const passwordHash = await sha256Hex(password);
      const { data: existing, error: findError } = await supabaseClient
        .from(config.accountsTable)
        .select("id")
        .eq("name", normalizedName)
        .maybeSingle();

      if (findError) throw new Error(findError.message);
      if (existing) throw new Error("이미 가입된 이름입니다.");

      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .insert({
          name: normalizedName,
          password_hash: passwordHash,
          color: null
        })
        .select("id, name, color, tutorial_done")
        .single();

      if (error && (error.code === "23505" || /duplicate key/i.test(error.message || ""))) {
        throw new Error("이미 가입된 이름입니다.");
      }
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  async function login(name, password) {
    const normalizedName = normalizeName(name);
    const supabaseClient = getClient();
    if (!supabaseClient) {
      if (canLoginViaSupabaseRest()) {
        try {
          return await withNetworkRetry(function () {
            return loginViaSupabaseRest(normalizedName, password);
          }, { attempts: 2, baseDelayMs: 400 });
        } catch (error) {
          throw normalizeOnlineError(error);
        }
      }
      return loginWithLocalServer(normalizedName, password);
    }

    try {
      const passwordHash = await sha256Hex(password);
      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .select("id, name, color, tutorial_done")
        .eq("name", normalizedName)
        .eq("password_hash", passwordHash)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("이름 또는 비밀번호가 맞지 않습니다.");

      if (await hasActiveAccountAuthSession(data.id)) {
        throw new Error(
          "이미 다른 창에서 이 계정으로 접속 중입니다. 해당 창을 닫거나 로그아웃한 뒤 다시 시도하세요."
        );
      }

      const sessionToken = generateSessionToken();
      const { error: updateError } = await supabaseClient
        .from(config.accountsTable)
        .update({ session_token: sessionToken })
        .eq("id", data.id);

      if (updateError) {
        const message = String(updateError.message || "");
        const missingSessionTokenColumn =
          message.includes("session_token") &&
          (message.includes("schema cache") || message.includes("column"));
        if (!missingSessionTokenColumn && window.console && typeof window.console.warn === "function") {
          window.console.warn("[OVC login] session token update skipped:", updateError.message);
        }
        return { ...data };
      }

      return { ...data, session_token: sessionToken };
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  async function validateSession(accountId, sessionToken) {
    if (!accountId || !sessionToken) return false;

    const supabaseClient = getClient();
    if (!supabaseClient) {
      try {
        const data = await postLocalApi("/api/validate-session", { id: accountId, session_token: sessionToken });
        return data.valid !== false;
      } catch (error) {
        return true;
      }
    }

    try {
      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .select("session_token")
        .eq("id", accountId)
        .maybeSingle();

      if (error) {
        if (isMissingSessionTokenColumnError(error)) return true;
        return true;
      }
      if (!data) return false;
      if (!data.session_token) return true;
      return data.session_token === sessionToken;
    } catch (error) {
      return true;
    }
  }

  async function saveTutorialDone(accountId, sessionToken, done) {
    const id = String(accountId || "").trim();
    const token = String(sessionToken || "").trim();
    const wantDone = done !== false && done !== "false";
    if (!id || !token) {
      return { ok: false };
    }
    if (!wantDone) {
      return { ok: false, message: "tutorial_done cannot be cleared" };
    }

    const supabaseClient = getClient();
    if (!supabaseClient) {
      if (canLoginViaSupabaseRest()) {
        const valid = await validateSession(id, token);
        if (!valid) {
          return { ok: false };
        }
        const base = config.supabaseUrl.trim().replace(/\/$/, "");
        const tableSeg = encodeURIComponent(config.accountsTable);
        const patchUrl = base + "/rest/v1/" + tableSeg + "?id=eq." + encodeURIComponent(id);
        const patchRes = await fetchWithTimeout(patchUrl, {
          method: "PATCH",
          headers: {
            apikey: config.supabaseKey,
            Authorization: "Bearer " + config.supabaseKey,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({ tutorial_done: wantDone })
        });
        if (!patchRes.ok) {
          throw new Error("튜토리얼 진행 저장 실패: " + patchRes.status);
        }
        return { ok: true };
      }
      return postLocalApi("/api/account/tutorial-done", {
        id,
        session_token: token,
        tutorial_done: wantDone
      });
    }

    const valid = await validateSession(id, token);
    if (!valid) {
      return { ok: false };
    }
    await withNetworkRetry(async function () {
      const { error } = await supabaseClient
        .from(config.accountsTable)
        .update({ tutorial_done: wantDone })
        .eq("id", id);
      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
    }, { attempts: 2, baseDelayMs: 250 });
    return { ok: true };
  }

  async function savePlayerColor(userId, color) {
    const supabaseClient = getClient();
    if (!supabaseClient || !userId) {
      return;
    }

    try {
      await withNetworkRetry(async function () {
        const { error } = await supabaseClient
          .from(config.accountsTable)
          .update({ color })
          .eq("id", userId);

        if (error) throw new Error(error.message || String(error));
      }, { attempts: 2, baseDelayMs: 200 });
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  async function listAccounts() {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      const data = await postLocalApi("/api/admin/accounts", {});
      return data.accounts || [];
    }

    try {
      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .select("id, name, color, created_at")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  async function deleteAccount(accountId) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      return postLocalApi("/api/admin/delete-account", { id: accountId });
    }

    try {
      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .delete()
        .eq("id", accountId)
        .select("id");

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) {
        throw new Error("계정 삭제 권한이 아직 없습니다. Supabase SQL Editor에서 supabase-schema.sql을 다시 실행하세요.");
      }

      return { ok: true, deleted: data[0] };
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  function isMissingSessionTokenColumnError(error) {
    if (!error) return false;
    var message = String((error && error.message) || error || "");
    return (
      message.indexOf("session_token") !== -1 &&
      (message.indexOf("schema cache") !== -1 ||
        message.indexOf("does not exist") !== -1 ||
        message.indexOf("Could not find") !== -1 ||
        message.indexOf("column") !== -1)
    );
  }

  async function getAccount(accountId) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      const data = await postLocalApi("/api/admin/account", { id: accountId });
      return data.account || null;
    }

    const baseSelect = "id, name, color, created_at, tutorial_done";

    try {
      let result = await supabaseClient
        .from(config.accountsTable)
        .select(baseSelect + ", session_token")
        .eq("id", accountId)
        .maybeSingle();

      if (result.error && isMissingSessionTokenColumnError(result.error)) {
        result = await supabaseClient
          .from(config.accountsTable)
          .select(baseSelect)
          .eq("id", accountId)
          .maybeSingle();
      }

      if (result.error) throw new Error(result.error.message);
      return result.data || null;
    } catch (error) {
      throw normalizeOnlineError(error);
    }
  }

  function createPresenceChannel(roomName, presenceKey) {
    const supabaseClient = getClient();
    if (!supabaseClient || !presenceKey) return null;

    return supabaseClient.channel(roomName || config.multiplayerRoom, {
      config: {
        presence: {
          key: presenceKey
        }
      }
    });
  }

  async function savePresence(state) {
    const supabaseClient = getClient();
    if (!supabaseClient || !state || !state.id) return;

    const payload = {
      id: String(state.id),
      room: String(state.room || config.multiplayerRoom || "ovc-main-room"),
      account_id: state.userId || null,
      name: String(state.name || "OVC"),
      color: state.color || "#ffffff",
      x: Number(state.x) || 0,
      depth: Number(state.depth) || 0,
      jump_y: Number(state.jumpY) || 0,
      updated_at: new Date().toISOString()
    };

    await withNetworkRetry(async function () {
      const { error } = await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .upsert(payload, { onConflict: "id" });

      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
    }, { attempts: 2, baseDelayMs: 120 });
  }

  async function listPresence(roomName) {
    const supabaseClient = getClient();
    if (!supabaseClient) return [];

    const staleCutoff = new Date(Date.now() - 70000).toISOString();
    const room = roomName || config.multiplayerRoom || "ovc-main-room";
    const data = await withNetworkRetry(async function () {
      const { data: rows, error } = await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .select("id, account_id, name, color, x, depth, jump_y, updated_at")
        .eq("room", room)
        .gte("updated_at", staleCutoff);

      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
      return rows || [];
    }, { attempts: 3, baseDelayMs: 250 });

    return data.map(function (row) {
      return {
        id: row.id,
        userId: row.account_id,
        name: row.name,
        color: row.color,
        x: row.x,
        depth: row.depth,
        jumpY: row.jump_y,
        updatedAt: row.updated_at
      };
    });
  }

  async function removePresence(sessionId) {
    const supabaseClient = getClient();
    if (!supabaseClient || !sessionId) return;

    await withNetworkRetry(async function () {
      const { error } = await supabaseClient
        .from(config.presenceTable || "ovc_presence")
        .delete()
        .eq("id", String(sessionId));

      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
    }, { attempts: 2, baseDelayMs: 120 });
  }

  async function saveWorldState(roomName, state, options) {
    const supabaseClient = getClient();
    if (!supabaseClient || !state) return null;

    const room = roomName || config.multiplayerRoom || "ovc-main-room";
    const expectedUpdatedAt =
      options && options.expectedUpdatedAt != null
        ? String(options.expectedUpdatedAt || "")
        : "";
    return await withNetworkRetry(async function () {
      const nextUpdatedAt = new Date().toISOString();
      if (expectedUpdatedAt) {
        const { data, error } = await supabaseClient
          .from(config.worldTable || "ovc_world")
          .update({
            state,
            updated_at: nextUpdatedAt
          })
          .eq("room", room)
          .eq("updated_at", expectedUpdatedAt)
          .select("state, updated_at")
          .maybeSingle();

        if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
        if (!data) {
          const conflict = new Error("world_state_conflict");
          conflict.code = "world_state_conflict";
          throw conflict;
        }
        return data;
      }

      const { data, error } = await supabaseClient
        .from(config.worldTable || "ovc_world")
        .upsert({
          room,
          state,
          updated_at: nextUpdatedAt
        }, { onConflict: "room" })
        .select("state, updated_at")
        .single();

      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
      return data || null;
    }, { attempts: 3, baseDelayMs: 350 });
  }

  async function loadWorldState(roomName) {
    const supabaseClient = getClient();
    if (!supabaseClient) return null;

    const room = roomName || config.multiplayerRoom || "ovc-main-room";
    return await withNetworkRetry(async function () {
      const { data, error } = await supabaseClient
        .from(config.worldTable || "ovc_world")
        .select("state, updated_at")
        .eq("room", room)
        .maybeSingle();

      if (error) throw normalizeOnlineError(new Error(error.message || String(error)));
      return data || null;
    }, { attempts: 3, baseDelayMs: 350 });
  }

  async function postLocalApi(url, payload) {
    return await withNetworkRetry(async function () {
      let response;
      try {
        response = await fetchWithTimeout(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        throw normalizeOnlineError(error);
      }

      const text = await response.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch (error) {
        throw new Error(getMissingConfigMessage());
      }

      if (!response.ok || !data.ok) {
        var hint = !response.ok ? " (HTTP " + response.status + ")" : "";
        throw new Error((data && data.message) || "요청에 실패했습니다." + hint);
      }

      return data;
    }, { attempts: 2, baseDelayMs: 220 });
  }

  async function signUpWithLocalServer(name, password) {
    return postLocalApi("/api/signup", { name, password });
  }

  async function loginWithLocalServer(name, password) {
    return postLocalApi("/api/login", { name, password });
  }

  function normalizeOnlineError(error) {
    if (error && error.name === "AbortError") {
      return new Error("서버 응답이 너무 느립니다. 잠시 후 다시 시도해주세요.");
    }
    if (error && error.message === "Failed to fetch") {
      return new Error("온라인 서버에 연결하지 못했습니다. Supabase URL/키가 맞는지 확인해주세요.");
    }
    if (
      error &&
      typeof error.message === "string" &&
      error.message.includes("session_token") &&
      (error.message.includes("schema cache") ||
        error.message.includes("does not exist") ||
        error.message.includes("Could not find"))
    ) {
      return new Error("Supabase에 session_token 컬럼이 아직 없습니다. SQL Editor에서 supabase-schema.sql을 다시 실행해주세요.");
    }

    return error;
  }

  function normalizeName(value) {
    return String(value || "").trim().normalize("NFC");
  }

  function generateSessionToken() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function getMissingConfigMessage() {
    if (config.supabaseUrl && config.supabaseUrl.includes("netlify.app")) {
      return "online-config.js의 supabaseUrl이 Netlify 주소로 되어 있습니다. Supabase Project URL은 https://랜덤문자.supabase.co 형태여야 합니다.";
    }

    if (config.supabaseUrl && !/\.supabase\.co\/?$/.test(config.supabaseUrl)) {
      return "online-config.js의 supabaseUrl에는 Netlify 주소가 아니라 https://xxxx.supabase.co 형태의 Supabase Project URL을 넣어야 합니다.";
    }

    return "온라인 설정이 아직 없습니다. Netlify에서는 online-config.js에 Supabase 정보를 넣어야 합니다.";
  }

  window.OVCOnline = {
    isConfigured,
    getClient,
    resetClient,
    signUp,
    login,
    saveTutorialDone,
    savePlayerColor,
    listAccounts,
    deleteAccount,
    getAccount,
    createPresenceChannel,
    validateSession,
    hasActiveAccountAuthSession,
    claimAccountAuthSession,
    touchAccountAuthSession,
    clearAccountAuthSession,
    savePresence,
    listPresence,
    removePresence,
    saveWorldState,
    loadWorldState
  };
})();
