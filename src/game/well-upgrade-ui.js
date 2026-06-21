import {
  formatPlayerMoneyKrw
} from "./player-money.js";
import {
  getWellDonationKrw,
  getWellDonationProgressRatio,
  getWellUpgradeGoalKrw,
  tryApplyWellDonation
} from "./well-upgrade.js";

/** @type {Record<string, unknown> | null} */
let host = null;
let modalOpen = false;

export const WELL_DONATION_AMOUNT_MIN_KRW = 0;
export const WELL_DONATION_AMOUNT_MAX_KRW = 1000;

function getPlayerMoneyKrw() {
  return typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
}

function getWell() {
  return typeof host.getWell === "function" ? host.getWell() : null;
}

function clampDonationAmountKrw(raw) {
  const n = Math.floor(Number(raw) || 0);
  return Math.max(
    WELL_DONATION_AMOUNT_MIN_KRW,
    Math.min(WELL_DONATION_AMOUNT_MAX_KRW, n)
  );
}

function readDonationAmountFromInput() {
  if (!host || !host.donationAmountInput) return 0;
  return clampDonationAmountKrw(host.donationAmountInput.value);
}

function syncDonationAmountInputValue(amountKrw) {
  if (!host || !host.donationAmountInput) return;
  const clamped = clampDonationAmountKrw(amountKrw);
  host.donationAmountInput.value = String(clamped);
}

function showPlayerAlertMessage(message) {
  if (typeof host.showPlayerAlert === "function") {
    host.showPlayerAlert({ message: message });
  }
}

function refreshDonationAmountField() {
  if (!host) return;
  const amount = readDonationAmountFromInput();
  const money = getPlayerMoneyKrw();
  if (host.donationSelectedText) {
    host.donationSelectedText.textContent =
      "\uAE30\uBD80 \uAE08\uC561: " + formatPlayerMoneyKrw(amount);
  }
  if (host.donationHintText) {
    if (amount > 0 && money < amount) {
      host.donationHintText.textContent =
        "\uBCF4\uC720 \uAE08\uC561\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4.";
      host.donationHintText.hidden = false;
    } else {
      host.donationHintText.textContent = "";
      host.donationHintText.hidden = true;
    }
  }
  if (host.donationConfirmBtn) {
    host.donationConfirmBtn.disabled = amount <= 0;
  }
}

function refreshDonationModalUi() {
  if (!host || !host.donationOverlay) return;
  const well = getWell();
  if (!well) return;
  const goal = getWellUpgradeGoalKrw(well);
  const donated = getWellDonationKrw(well);
  const money = getPlayerMoneyKrw();
  if (host.donationGoalText) {
    host.donationGoalText.textContent =
      "\uAC15\uD654 \uBAA9\uD45C: " +
      formatPlayerMoneyKrw(goal) +
      " (\uD604\uC7AC " +
      formatPlayerMoneyKrw(donated) +
      " / " +
      formatPlayerMoneyKrw(goal) +
      ")";
  }
  if (host.donationBalanceText) {
    host.donationBalanceText.textContent =
      "\uBCF4\uC720 \uAE08\uC561: " + formatPlayerMoneyKrw(money);
  }
  refreshDonationAmountField();
}

export function refreshWellUpgradeCardUi() {
  if (!host || !host.wellCard) return;
  const well = getWell();
  if (!well) return;
  const goal = getWellUpgradeGoalKrw(well);
  const donated = getWellDonationKrw(well);
  const ratio = getWellDonationProgressRatio(well);
  if (host.donationText) {
    host.donationText.textContent =
      formatPlayerMoneyKrw(donated) + " / " + formatPlayerMoneyKrw(goal);
  }
  if (host.donationFill) {
    host.donationFill.style.width = ratio * 100 + "%";
  }
  if (modalOpen) {
    refreshDonationModalUi();
  }
}

function closeWellDonationModal() {
  if (!host || !host.donationOverlay) return;
  modalOpen = false;
  host.donationOverlay.style.display = "none";
  host.donationOverlay.setAttribute("aria-hidden", "true");
}

function openWellDonationModal() {
  if (!host || !host.donationOverlay) return;
  modalOpen = true;
  const money = getPlayerMoneyKrw();
  const defaultAmount =
    money > 0 ? Math.min(money, 100, WELL_DONATION_AMOUNT_MAX_KRW) : 0;
  syncDonationAmountInputValue(defaultAmount);
  refreshDonationModalUi();
  host.donationOverlay.style.display = "flex";
  host.donationOverlay.setAttribute("aria-hidden", "false");
  if (host.donationAmountInput && typeof host.donationAmountInput.focus === "function") {
    host.donationAmountInput.focus();
    host.donationAmountInput.select();
  }
}

function onDonationAmountInput() {
  if (!modalOpen) return;
  syncDonationAmountInputValue(readDonationAmountFromInput());
  refreshDonationAmountField();
}

function onDonationConfirmClick() {
  if (!modalOpen || !host) return;
  const well = getWell();
  if (!well) return;
  const amount = readDonationAmountFromInput();
  const money = getPlayerMoneyKrw();
  syncDonationAmountInputValue(amount);

  if (amount <= 0) {
    showPlayerAlertMessage("1\uC6D0 \uC774\uC0C1 \uAE30\uBD80\uD560 \uAE08\uC561\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
    refreshDonationModalUi();
    return;
  }
  if (money < amount) {
    showPlayerAlertMessage("\uB3C8\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4.");
    refreshDonationModalUi();
    return;
  }

  if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
    host.applyPlayerMoneyDeltaKrw(-amount);
  }
  const result = tryApplyWellDonation(well, amount);
  if (!result.ok) {
    if (typeof host.applyPlayerMoneyDeltaKrw === "function") {
      host.applyPlayerMoneyDeltaKrw(amount);
    }
    return;
  }

  if (typeof host.saveWellState === "function") {
    host.saveWellState();
  }
  if (typeof host.syncWorldState === "function") {
    host.syncWorldState(true);
  }
  if (typeof host.updateWellImage === "function") {
    host.updateWellImage();
  }
  if (typeof host.updateWellCard === "function") {
    host.updateWellCard();
  }
  refreshWellUpgradeCardUi();

  if (result.upgraded && typeof host.showPlayerAlert === "function") {
    host.showPlayerAlert({
      message: "\uC6B0\uBB3C\uC774 \uAC15\uD654\uB418\uC5C8\uC2B5\uB2C8\uB2E4!",
      durationMs: 2600
    });
  }

  closeWellDonationModal();
}

function onDonationCancelClick() {
  closeWellDonationModal();
}

function onDonationOpenClick(event) {
  event.preventDefault();
  event.stopPropagation();
  openWellDonationModal();
}

/** @param {Record<string, unknown>} h */
export function bindWellUpgradeUi(h) {
  host = h;
  if (host.donationOpenBtn) {
    host.donationOpenBtn.addEventListener("click", onDonationOpenClick);
  }
  if (host.donationAmountInput) {
    host.donationAmountInput.addEventListener("input", onDonationAmountInput);
    host.donationAmountInput.addEventListener("change", onDonationAmountInput);
  }
  if (host.donationConfirmBtn) {
    host.donationConfirmBtn.addEventListener("click", onDonationConfirmClick);
  }
  if (host.donationCancelBtn) {
    host.donationCancelBtn.addEventListener("click", onDonationCancelClick);
  }
}

export function isWellDonationModalOpen() {
  return modalOpen;
}
