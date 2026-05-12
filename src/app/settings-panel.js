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
  tutorialReplayButton.style.display =
    options.currentUserId && options.hasSpawnedCharacter && options.onboardingDone
      ? "block"
      : "none";
}
