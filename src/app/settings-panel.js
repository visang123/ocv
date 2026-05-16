export function setOverlayOpen(overlay, open) {
  if (!overlay) return;
  overlay.classList.toggle("is-open", Boolean(open));
  overlay.setAttribute("aria-hidden", open ? "false" : "true");
}

export function updateSettingsTutorialButtons(options) {
  const tutorialExitButton = options.tutorialExitButton;
  const tutorialReplayButton = options.tutorialReplayButton;
  if (!tutorialExitButton || !tutorialReplayButton) return;

  const inTutorial = Boolean(
    options.currentUserId &&
      options.hasSpawnedCharacter &&
      !options.onboardingDone &&
      options.onboardingFlowStep > 0
  );
  tutorialExitButton.style.display = inTutorial ? "block" : "none";
  // 튜토리얼은 계정당 최초 1회만 — 설정에서 다시 시작 불가
  tutorialReplayButton.style.display = "none";
}
