const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = 5173;
const root = __dirname;
const dataDir = path.join(root, "data");
const accountsPath = path.join(dataDir, "accounts.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

/** 정적 파일 mtime 캐시 — 다수 접속 시 디스크 read 완화 */
const staticFileCache = new Map();
const STATIC_CACHE_MAX = 400;

function rememberStaticCache(filePath, mtimeMs, content) {
  if (staticFileCache.size >= STATIC_CACHE_MAX) {
    const firstKey = staticFileCache.keys().next().value;
    staticFileCache.delete(firstKey);
  }
  staticFileCache.set(filePath, { mtimeMs, content });
}

function readStaticFileCached(filePath, callback) {
  fs.stat(filePath, (statErr, st) => {
    if (statErr) {
      callback(statErr, null);
      return;
    }
    const mtimeMs = Number(st.mtimeMs) || 0;
    const hit = staticFileCache.get(filePath);
    if (hit && hit.mtimeMs === mtimeMs) {
      callback(null, hit.content);
      return;
    }
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        callback(readErr, null);
        return;
      }
      rememberStaticCache(filePath, mtimeMs, content);
      callback(null, content);
    });
  });
}

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(accountsPath)) {
    fs.writeFileSync(accountsPath, "[]", "utf8");
  }
}

function readAccounts() {
  ensureDataStore();

  try {
    const parsed = JSON.parse(fs.readFileSync(accountsPath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeAccounts(accounts) {
  ensureDataStore();
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2), "utf8");
}

function readJsonBody(request, response, callback) {
  let rawBody = "";

  request.on("data", (chunk) => {
    rawBody += chunk;
    if (rawBody.length > 4096) {
      sendJson(response, 413, { ok: false, message: "요청이 너무 큽니다." });
      request.destroy();
    }
  });

  request.on("end", () => {
    try {
      callback(JSON.parse(rawBody || "{}"));
    } catch (error) {
      sendJson(response, 400, { ok: false, message: "잘못된 요청입니다." });
    }
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function isValidName(name) {
  return /^[가-힣ㄱ-ㅎㅏ-ㅣ]{1,3}$/.test(name);
}

function generateSessionToken() {
  const chars = "0123456789abcdef";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * 16)];
  }
  return token;
}

function normalizeName(value) {
  return String(value || "").trim().normalize("NFC");
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function handleApi(request, response, requestedPath) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, message: "POST만 사용할 수 있습니다." });
    return true;
  }

  if (requestedPath === "/api/signup") {
    readJsonBody(request, response, (body) => {
      const name = normalizeName(body.name);
      const password = String(body.password || "");

      if (!isValidName(name)) {
        sendJson(response, 400, { ok: false, message: "이름은 한글 자음/모음 포함 1~3글자로 입력하세요." });
        return;
      }

      if (password.length < 4) {
        sendJson(response, 400, { ok: false, message: "비밀번호는 4자리 이상 입력하세요." });
        return;
      }

      const accounts = readAccounts();
      if (
        accounts.some((account) => normalizeName(account.name) === name)
      ) {
        sendJson(response, 409, { ok: false, message: "이미 가입된 이름입니다." });
        return;
      }

      const account = {
        id: "local-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        name,
        password_hash: sha256Hex(password),
        color: null,
        createdAt: Date.now(),
        tutorial_done: false
      };
      accounts.push(account);
      writeAccounts(accounts);
      sendJson(response, 200, {
        ok: true,
        id: account.id,
        name: account.name,
        color: account.color,
        tutorial_done: false
      });
    });
    return true;
  }

  if (requestedPath === "/api/login") {
    readJsonBody(request, response, (body) => {
      const name = normalizeName(body.name);
      const password = String(body.password || "");
      const passwordHash = sha256Hex(password);
      const account = readAccounts().find((savedAccount) => {
        const savedHash =
          typeof savedAccount.password_hash === "string" && savedAccount.password_hash
            ? savedAccount.password_hash
            : sha256Hex(savedAccount.password || "");
        return normalizeName(savedAccount.name) === name && savedHash === passwordHash;
      });

      if (!account) {
        sendJson(response, 401, { ok: false, message: "이름 또는 비밀번호가 맞지 않습니다." });
        return;
      }

      if (!account.id) {
        account.id = "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        writeAccounts(accounts);
      }

      const sessionToken = generateSessionToken();
      account.sessionToken = sessionToken;
      if (!account.password_hash && account.password) {
        account.password_hash = sha256Hex(account.password);
      }
      if ("password" in account) {
        delete account.password;
      }
      writeAccounts(readAccounts().map(function (a) {
        const nextAccount = a.id === account.id ? account : a;
        if (!nextAccount.password_hash && nextAccount.password) {
          nextAccount.password_hash = sha256Hex(nextAccount.password);
        }
        if ("password" in nextAccount) {
          delete nextAccount.password;
        }
        return nextAccount;
      }));
      sendJson(response, 200, {
        ok: true,
        id: account.id,
        name: account.name,
        color: account.color || null,
        session_token: sessionToken,
        tutorial_done: Boolean(account.tutorial_done)
      });
    });
    return true;
  }

  if (requestedPath === "/api/account/tutorial-done") {
    readJsonBody(request, response, (body) => {
      const id = String(body.id || "");
      const token = String(body.session_token || "");
      if (!id || !token) {
        sendJson(response, 400, { ok: false, message: "id와 session_token이 필요합니다." });
        return;
      }
      const wantDone = body.tutorial_done !== false && body.tutorial_done !== "false";
      const accounts = readAccounts();
      const account = accounts.find((a) => a.id === id);
      if (!account || account.sessionToken !== token) {
        sendJson(response, 403, { ok: false, message: "세션이 유효하지 않습니다." });
        return;
      }
      account.tutorial_done = wantDone;
      writeAccounts(accounts);
      sendJson(response, 200, { ok: true, tutorial_done: Boolean(account.tutorial_done) });
    });
    return true;
  }

  if (requestedPath === "/api/validate-session") {
    readJsonBody(request, response, (body) => {
      const id = String(body.id || "");
      const token = String(body.session_token || "");
      const account = readAccounts().find((a) => a.id === id);
      if (!account) {
        sendJson(response, 200, { ok: true, valid: false });
        return;
      }
      sendJson(response, 200, { ok: true, valid: account.sessionToken === token });
    });
    return true;
  }

  if (requestedPath === "/api/player/color") {
    readJsonBody(request, response, (body) => {
      const name = normalizeName(body.name);
      const color = String(body.color || "").trim();

      if (!name || !/^#[0-9a-fA-F]{6}$/.test(color)) {
        sendJson(response, 400, { ok: false, message: "색깔을 다시 선택하세요." });
        return;
      }

      const accounts = readAccounts();
      const account = accounts.find((savedAccount) => savedAccount.name === name);

      if (!account) {
        sendJson(response, 404, { ok: false, message: "로그인 정보를 찾을 수 없습니다." });
        return;
      }

      account.color = color;
      writeAccounts(accounts);
      sendJson(response, 200, { ok: true, name, color });
    });
    return true;
  }

  if (requestedPath === "/api/admin/accounts") {
    const accounts = readAccounts()
      .map((account) => ({
        id: account.id,
        name: account.name,
        color: account.color || null,
        created_at: account.createdAt || null
      }))
      .sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));

    sendJson(response, 200, { ok: true, accounts });
    return true;
  }

  if (requestedPath === "/api/admin/account") {
    readJsonBody(request, response, (body) => {
      const id = String(body.id || "");
      const account = readAccounts().find((savedAccount) => savedAccount.id === id);

      if (!account) {
        sendJson(response, 404, { ok: false, message: "계정을 찾지 못했습니다." });
        return;
      }

      sendJson(response, 200, {
        ok: true,
        account: {
          id: account.id,
          name: account.name,
          color: account.color || null,
          created_at: account.createdAt || null
        }
      });
    });
    return true;
  }

  if (requestedPath === "/api/admin/delete-account") {
    readJsonBody(request, response, (body) => {
      const id = String(body.id || "");
      const accounts = readAccounts();
      const nextAccounts = accounts.filter((account) => account.id !== id);

      if (nextAccounts.length === accounts.length) {
        sendJson(response, 404, { ok: false, message: "계정을 찾지 못했습니다." });
        return;
      }

      writeAccounts(nextAccounts);
      sendJson(response, 200, { ok: true });
    });
    return true;
  }

  return false;
}

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent(request.url.split("?")[0]);

  if (requestedPath.startsWith("/api/") && handleApi(request, response, requestedPath)) {
    return;
  }

  const safePath = path
    .normalize(requestedPath === "/" ? "/ovc-login.html" : requestedPath)
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  readStaticFileCached(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "public, max-age=120"
    });
    response.end(content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`plant-app server running on http://0.0.0.0:${port}`);
});
