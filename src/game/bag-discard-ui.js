import { getBagItemDescriptor } from "./bag-inventory.js";

let overlayEl = null;
let titleEl = null;
let inputEl = null;
let allBtnEl = null;
let cancelBtnEl = null;
let confirmBtnEl = null;
let pendingResolve = null;
let pendingItemKey = "";
let pendingMax = 1;

function ensureElements() {
  if (overlayEl) return;
  overlayEl = document.getElementById("bag-discard-overlay");
  titleEl = document.getElementById("bag-discard-title");
  inputEl = document.getElementById("bag-discard-amount");
  allBtnEl = document.getElementById("bag-discard-all");
  cancelBtnEl = document.getElementById("bag-discard-cancel");
  confirmBtnEl = document.getElementById("bag-discard-confirm");
  if (!overlayEl || !inputEl || !cancelBtnEl || !confirmBtnEl) return;

  cancelBtnEl.addEventListener("click", function () {
    closeBagDiscardQuantityModal(0);
  });
  confirmBtnEl.addEventListener("click", function () {
    closeBagDiscardQuantityModal(readAmountFromInput());
  });
  if (allBtnEl) {
    allBtnEl.addEventListener("click", function () {
      inputEl.value = String(pendingMax);
      inputEl.focus();
      inputEl.select();
    });
  }
  overlayEl.addEventListener("click", function (event) {
    if (event.target === overlayEl) {
      closeBagDiscardQuantityModal(0);
    }
  });
  inputEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      closeBagDiscardQuantityModal(readAmountFromInput());
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeBagDiscardQuantityModal(0);
    }
  });
}

function readAmountFromInput() {
  const raw = Math.floor(Number(inputEl.value) || 0);
  return Math.min(pendingMax, Math.max(0, raw));
}

function closeBagDiscardQuantityModal(amount) {
  if (!overlayEl) return;
  overlayEl.classList.remove("is-open");
  overlayEl.setAttribute("aria-hidden", "true");
  const resolve = pendingResolve;
  pendingResolve = null;
  pendingItemKey = "";
  pendingMax = 1;
  if (typeof resolve === "function") {
    resolve(Math.max(0, Math.floor(Number(amount) || 0)));
  }
}

/**
 * @param {string} itemKey
 * @param {number} maxCount
 * @returns {Promise<number>}
 */
export function openBagDiscardQuantityModal(itemKey, maxCount) {
  ensureElements();
  if (!overlayEl || !inputEl) {
    return Promise.resolve(maxCount > 1 ? 1 : Math.max(0, maxCount));
  }
  const max = Math.max(1, Math.floor(Number(maxCount) || 0));
  if (max <= 1) {
    return Promise.resolve(1);
  }

  if (pendingResolve) {
    closeBagDiscardQuantityModal(0);
  }

  pendingItemKey = itemKey;
  pendingMax = max;
  const descriptor = getBagItemDescriptor(itemKey);
  const label = descriptor && descriptor.label ? descriptor.label : itemKey;
  if (titleEl) {
    titleEl.textContent = label + " \uBA87 \uAC1C\uB97C \uBC84\uB9B4\uAE4C\uC694?";
  }
  inputEl.min = "1";
  inputEl.max = String(max);
  inputEl.value = "1";

  return new Promise(function (resolve) {
    pendingResolve = resolve;
    overlayEl.classList.add("is-open");
    overlayEl.setAttribute("aria-hidden", "false");
    window.setTimeout(function () {
      inputEl.focus();
      inputEl.select();
    }, 0);
  });
}

export function isBagDiscardModalOpen() {
  ensureElements();
  return Boolean(overlayEl && overlayEl.classList.contains("is-open"));
}

/** 거래·제작 패널 바깥 클릭 닫기에서 제외할 대상(버리기 모달) */
export function isBagDiscardOverlayInteractionTarget(target) {
  ensureElements();
  if (!(target instanceof Element) || !overlayEl) return false;
  if (!overlayEl.classList.contains("is-open")) return false;
  return overlayEl.contains(target);
}

export function cancelBagDiscardQuantityModal() {
  if (isBagDiscardModalOpen()) {
    closeBagDiscardQuantityModal(0);
  }
}
