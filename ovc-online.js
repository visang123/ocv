(function () {
  const config = window.OVC_ONLINE_CONFIG || {};
  let client = null;

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

  async function loginViaSupabaseRest(normalizedName, password) {
    const passwordHash = await sha256Hex(password);
    const base = config.supabaseUrl.trim().replace(/\/$/, "");
    const tableSeg = encodeURIComponent(config.accountsTable);
    const url =
      base +
      "/rest/v1/" +
      tableSeg +
      "?select=id,name,color&name=eq." +
      encodeURIComponent(normalizedName) +
      "&password_hash=eq." +
      encodeURIComponent(passwordHash) +
      "&limit=1";

    let response;
    try {
      response = await fetch(url, {
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
    const sessionToken = generateSessionToken();
    try {
      const patchUrl = base + "/rest/v1/" + tableSeg + "?id=eq." + encodeURIComponent(String(data.id));
      const patchRes = await fetch(patchUrl, {
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
        .select("id, name, color")
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
          return await loginViaSupabaseRest(normalizedName, password);
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
        .select("id, name, color")
        .eq("name", normalizedName)
        .eq("password_hash", passwordHash)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("이름 또는 비밀번호가 맞지 않습니다.");

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

      if (error) return true;
      if (!data) return false;
      return data.session_token === sessionToken;
    } catch (error) {
      return true;
    }
  }

  async function savePlayerColor(userId, color) {
    const supabaseClient = getClient();
    if (!supabaseClient || !userId) {
      return;
    }

    try {
      const { error } = await supabaseClient
        .from(config.accountsTable)
        .update({ color })
        .eq("id", userId);

      if (error) throw new Error(error.message);
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

  async function getAccount(accountId) {
    const supabaseClient = getClient();
    if (!supabaseClient) {
      const data = await postLocalApi("/api/admin/account", { id: accountId });
      return data.account || null;
    }

    try {
      const { data, error } = await supabaseClient
        .from(config.accountsTable)
        .select("id, name, color, created_at")
        .eq("id", accountId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data || null;
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

    const { error } = await supabaseClient
      .from(config.presenceTable || "ovc_presence")
      .upsert(payload, { onConflict: "id" });

    if (error) throw normalizeOnlineError(error);
  }

  async function listPresence(roomName) {
    const supabaseClient = getClient();
    if (!supabaseClient) return [];

    const staleCutoff = new Date(Date.now() - 70000).toISOString();
    const { data, error } = await supabaseClient
      .from(config.presenceTable || "ovc_presence")
      .select("id, account_id, name, color, x, depth, jump_y, updated_at")
      .eq("room", roomName || config.multiplayerRoom || "ovc-main-room")
      .gte("updated_at", staleCutoff);

    if (error) throw normalizeOnlineError(error);
    return (data || []).map(function (row) {
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

    const { error } = await supabaseClient
      .from(config.presenceTable || "ovc_presence")
      .delete()
      .eq("id", String(sessionId));

    if (error) throw normalizeOnlineError(error);
  }

  async function saveWorldState(roomName, state) {
    const supabaseClient = getClient();
    if (!supabaseClient || !state) return null;

    const room = roomName || config.multiplayerRoom || "ovc-main-room";
    const { data, error } = await supabaseClient
      .from(config.worldTable || "ovc_world")
      .upsert({
        room,
        state,
        updated_at: new Date().toISOString()
      }, { onConflict: "room" })
      .select("state, updated_at")
      .single();

    if (error) throw normalizeOnlineError(error);
    return data || null;
  }

  async function loadWorldState(roomName) {
    const supabaseClient = getClient();
    if (!supabaseClient) return null;

    const room = roomName || config.multiplayerRoom || "ovc-main-room";
    const { data, error } = await supabaseClient
      .from(config.worldTable || "ovc_world")
      .select("state, updated_at")
      .eq("room", room)
      .maybeSingle();

    if (error) throw normalizeOnlineError(error);
    return data || null;
  }

  async function postLocalApi(url, payload) {
    let response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      throw new Error(getMissingConfigMessage());
    }

    const text = await response.text();
    let data = null;

    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(getMissingConfigMessage());
    }

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "요청에 실패했습니다.");
    }

    return data;
  }

  async function signUpWithLocalServer(name, password) {
    return postLocalApi("/api/signup", { name, password });
  }

  async function loginWithLocalServer(name, password) {
    return postLocalApi("/api/login", { name, password });
  }

  function normalizeOnlineError(error) {
    if (error && error.message === "Failed to fetch") {
      return new Error("온라인 서버에 연결하지 못했습니다. Supabase URL/키가 맞는지 확인해주세요.");
    }
    if (
      error &&
      typeof error.message === "string" &&
      error.message.includes("session_token") &&
      error.message.includes("schema cache")
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
    savePlayerColor,
    listAccounts,
    deleteAccount,
    getAccount,
    createPresenceChannel,
    validateSession,
    savePresence,
    listPresence,
    removePresence,
    saveWorldState,
    loadWorldState
  };
})();
