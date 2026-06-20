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
let selectedAmountKrw = 10;

const DONATION_AMOUNT_PRESETS = [10, 25, 50, 100];

function getPlayerMoneyKrw() {
  return typeof host.getPlayerMoneyKrw === "function" ? host.getPlayerMoneyKrw() : 0;
}

function getWell() {
  return typeof host.getWell === "function" ? host.getWell() : null;
}

function setSelectedAmountKrw(next) {
  selectedAmountKrw = Math.max(1, Math.floor(Number(next) || 0));
}

function refreshDonationAmountButtons() {
  if (!host || !host.donationOverlay) return;
  const money = getPlayerMoneyKrw();
  host.donationOverlay.querySelectorAll(".well-donation-amount").forEach(function (btn) {
    const amount = Math.max(0, Math.floor(Number(btn.dataset.amount) || 0));
    btn.classList.toggle("is-selected", amount === selectedAmountKrw);
    btn.disabled = amount <= 0 || money < amount;
  });
  if (host.donationSelectedText) {
    host.donationSelectedText.textContent =
      "\uAE30\uBD80 \uAE08\uC561: " + formatPlayerMoneyKrw(selectedAmountKrw);
  }
  if (host.donationConfirmBtn) {
    host.donationConfirmBtn.disabled =
      selectedAmountKrw <= 0 || money < selectedAmountKrw;
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
  refreshDonationAmountButtons();
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
  const firstAffordable =
    DONATION_AMOUNT_PRESETS.find(function (amount) {
      return money >= amount;
    }) || DONATION_AMOUNT_PRESETS[0];
  setSelectedAmountKrw(firstAffordable);
  refreshDonationModalUi();
  host.donationOverlay.style.display = "flex";
  host.donationOverlay.setAttribute("aria-hidden", "false");
}

function onDonationAmountClick(event) {
  if (!modalOpen) return;
  const btn =
    event.target instanceof Element ? event.target.closest(".well-donation-amount") : null;
  if (!btn || btn.disabled) return;
  setSelectedAmountKrw(btn.dataset.amount);
  refreshDonationAmountButtons();
}

function onDonationConfirmClick() {
  if (!modalOpen || !host) return;
  const well = getWell();
  if (!well) return;
  const amount = selectedAmountKrw;
  const money = getPlayerMoneyKrw();
  if (amount <= 0 || money < amount) {
    if (typeof host.showPlayerAlert === "function") {
      host.showPlayerAlert({ message: "\uB3C8\uC774 \uBD80\uC871\uD569\uB2C8\uB2E4." });
    }
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
  if (host.donationOverlay) {
    host.donationOverlay.addEventListener("click", onDonationAmountClick);
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
