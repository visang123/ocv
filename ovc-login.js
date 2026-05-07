const currentUserKey = "ovcCurrentUserV1";
const currentUserIdKey = "ovcCurrentUserIdV1";
const currentUserColorKey = "ovcCurrentUserColorV1";
const lastSelectedColorKey = "ovcLastSelectedColorV1";
const currentUserHasChosenColorKey = "ovcCurrentUserHasChosenColorV1";
const currentSessionTokenKey = "ovcCurrentSessionTokenV1";
const koreanNamePattern = /^[가-힣ㄱ-ㅎㅏ-ㅣ]{1,3}$/;

const loginForm = document.getElementById("login-form");
const loginName = document.getElementById("login-name");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-button");
const loginMessage = document.getElementById("login-message");

const signupOpen = document.getElementById("signup-open");
const signupBackdrop = document.getElementById("signup-backdrop");
const signupForm = document.getElementById("signup-form");
const signupCancel = document.getElementById("signup-cancel");
const signupName = document.getElementById("signup-name");
const signupPassword = document.getElementById("signup-password");
const signupButton = document.getElementById("signup-button");
const signupMessage = document.getElementById("signup-message");
const passwordToggleButtons = Array.from(document.querySelectorAll(".password-toggle"));
const REQUEST_TIMEOUT_MS = 12000;

redirectLoggedInUser();

function normalizeName(value) {
  return value.trim().normalize("NFC");
}

function normalizeHexColor(value) {
  if (!/^#[0-9a-fA-F]{6}$/.test(value || "")) return "";
  return value.toLowerCase();
}

function withTimeout(promise, timeoutMs, timeoutMessage) {
  let timerId = null;
  const timeoutPromise = new Promise(function (_, reject) {
    timerId = setTimeout(function () {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(function () {
    if (timerId) {
      clearTimeout(timerId);
    }
  });
}

function startUiWatchdog(button, messageElement, timeoutMessage) {
  return setTimeout(function () {
    button.disabled = false;
    messageElement.textContent = timeoutMessage;
  }, REQUEST_TIMEOUT_MS + 1000);
}

function redirectLoggedInUser() {
  const savedName = localStorage.getItem(currentUserKey);
  const savedId = localStorage.getItem(currentUserIdKey);

  if (savedName && savedId) {
    window.location.replace("index.html");
  }
}

function validateSignup(name, password) {
  if (!koreanNamePattern.test(name)) {
    return "이름은 한글 자음/모음을 포함해서 1~3글자로 입력하세요.";
  }

  if (password.length < 4) {
    return "비밀번호는 4자리 이상 입력하세요.";
  }

  return "";
}

function openSignup() {
  signupBackdrop.classList.add("is-open");
  signupBackdrop.setAttribute("aria-hidden", "false");
  signupMessage.textContent = "";
  signupName.value = "";
  signupPassword.value = "";
  setTimeout(function () {
    signupName.focus();
  }, 0);
}

function closeSignup() {
  signupBackdrop.classList.remove("is-open");
  signupBackdrop.setAttribute("aria-hidden", "true");
  signupMessage.textContent = "";
}

signupOpen.addEventListener("click", openSignup);
signupCancel.addEventListener("click", closeSignup);

passwordToggleButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const input = document.getElementById(button.dataset.target);
    if (!input) return;

    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    button.textContent = isVisible ? "보기" : "숨김";
    button.setAttribute("aria-label", isVisible ? "비밀번호 보기" : "비밀번호 숨기기");
    button.classList.toggle("is-visible", !isVisible);
    input.focus();
  });
});

signupBackdrop.addEventListener("click", function (event) {
  if (event.target === signupBackdrop) {
    closeSignup();
  }
});

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = normalizeName(signupName.value);
  const password = signupPassword.value;
  const errorMessage = validateSignup(name, password);

  if (errorMessage) {
    signupMessage.textContent = errorMessage;
    return;
  }

  signupButton.disabled = true;
  signupMessage.textContent = "가입 중...";
  const signupWatchdog = startUiWatchdog(
    signupButton,
    signupMessage,
    "가입이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
  );

  try {
    if (!window.OVCOnline || typeof window.OVCOnline.signUp !== "function") {
      throw new Error("온라인 로그인 모듈을 불러오지 못했습니다. 페이지를 새로고침 해주세요.");
    }
    await withTimeout(
      window.OVCOnline.signUp(name, password),
      REQUEST_TIMEOUT_MS,
      "가입 요청이 지연되고 있습니다. 네트워크나 Supabase 설정을 확인해주세요."
    );
    loginName.value = name;
    loginPassword.value = "";
    loginMessage.textContent = "회원가입 완료. 비밀번호를 입력하고 로그인하세요.";
    closeSignup();
  } catch (error) {
    signupMessage.textContent = error.message;
  } finally {
    clearTimeout(signupWatchdog);
    signupButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = normalizeName(loginName.value);
  const password = loginPassword.value;

  if (!name || !password) {
    loginMessage.textContent = "이름과 비밀번호를 입력하세요.";
    return;
  }

  loginButton.disabled = true;
  loginMessage.textContent = "로그인 중...";
  const loginWatchdog = startUiWatchdog(
    loginButton,
    loginMessage,
    "로그인이 오래 걸립니다. 새로고침 후 다시 시도해주세요."
  );

  try {
    if (!window.OVCOnline || typeof window.OVCOnline.login !== "function") {
      throw new Error("온라인 로그인 모듈을 불러오지 못했습니다. 페이지를 새로고침 해주세요.");
    }
    const account = await withTimeout(
      window.OVCOnline.login(name, password),
      REQUEST_TIMEOUT_MS,
      "로그인이 지연되고 있습니다. 네트워크나 Supabase 설정을 확인해주세요."
    );
    localStorage.setItem(currentUserKey, account.name);
    localStorage.setItem(currentUserIdKey, account.id);
    localStorage.setItem(currentUserHasChosenColorKey, account.id);
    const accountColor = normalizeHexColor(account.color);
    const scopedKey = "ovcUserColorV1:" + account.id;
    const scopedColor = normalizeHexColor(localStorage.getItem(scopedKey));
    const storedColor = normalizeHexColor(localStorage.getItem(currentUserColorKey));
    const fallbackColor = normalizeHexColor(localStorage.getItem(lastSelectedColorKey));
    const finalColor = accountColor || scopedColor || storedColor || fallbackColor || "#ffffff";
    localStorage.setItem(currentUserColorKey, finalColor);
    localStorage.setItem(lastSelectedColorKey, finalColor);
    localStorage.setItem(scopedKey, finalColor);
    if (account.session_token) {
      localStorage.setItem(currentSessionTokenKey, account.session_token);
    }

    window.location.href = "index.html";
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    clearTimeout(loginWatchdog);
    loginButton.disabled = false;
  }
});

window.addEventListener("unhandledrejection", function (event) {
  loginButton.disabled = false;
  loginMessage.textContent = "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.";
});
