/** View — 온보딩·설정·알림·가이드 UI. */

export function createModule(d) {
  function closeGuideCardFromClick() {
  if (
    d.isOnboardingBookGuideIntroActive() &&
    d.getOnboarding().bookInvPhase === 2
  ) {
    return;
  }
  if (d.isOnboardingNpcGuideCloseBlocked()) {
    return;
  }
  d.getWorldItems().isGuideBookOpen = false;
  if (d.isNearSignBoard()) {
    d.getWorldItems().isGuideDismissedAtSign = true;
  }
  dismissGuideBookClickPrompt();
  updateGuideCard();
  d.maybeAdvanceOnboardingAfterGuideBookClosed();
  updateOnboardingFlowUI();
  }

  function closeSettingsOverlayFromBackdrop() {
  d.getOnboarding().step26OpenedSettingsWithEsc = false;
  d.setSettingsOverlayOpen(d.settingsOverlay, false);
  d.updateSettingsTutorialButtons();
  }

  function closeSettingsOverlayFromEscape() {
  const hadEscOpenCycle = d.getOnboarding().step26OpenedSettingsWithEsc;
  d.setSettingsOverlayOpen(d.settingsOverlay, false);
  d.updateSettingsTutorialButtons();
  if (
    !d.getStoredFlag(d.onboardingFlowDoneKey) &&
    d.getOnboarding().flowStep === d.ONBOARDING_STEP_SETTINGS_ESC &&
    hadEscOpenCycle
  ) {
    d.getOnboarding().flowStep = d.ONBOARDING_STEP_COMPLETE;
    d.getOnboarding().step26OpenedSettingsWithEsc = false;
    d.persistOnboardingStep();
    updateOnboardingFlowUI();
    onboardingScheduleTutorialCompleteHide();
  } else {
    d.getOnboarding().step26OpenedSettingsWithEsc = false;
  }
  }

  function discardInventorySeed(seedId) {
  const seedIndex = d.getApple().extraSeeds.findIndex(function (extraSeed) {
    return extraSeed.id === seedId;
  });
  if (seedIndex < 0) return;

  const seedToRemove = d.getApple().extraSeeds[seedIndex];
  if (!seedToRemove.inInventory || seedToRemove.planted) return;
  if (
    d.isOnboardingLinearGateActive() &&
    (seedToRemove.isStarter || seedToRemove.id === "starter-d.seed")
  ) {
    flashOnboardingOrderHint("");
    return;
  }

  if (seedToRemove.inventoryElement) {
    seedToRemove.inventoryElement.remove();
  }
  if (seedToRemove.element) {
    seedToRemove.element.remove();
  }
  if (seedToRemove.isStarter && d.isExtraSeedDry(seedToRemove)) {
    d.getSeedWorld().hasHandledDryMainSeed = true;
    d.setStoredFlag(d.mainDrySeedHandledKey, true);
    d.markWorldDirty();
    d.syncWorldState(true);
  }

  d.getApple().extraSeeds.splice(seedIndex, 1);
  d.saveAppleState();
  d.updateSeedInventory();
  }

  function dismissGuideBookClickPrompt() {
  if (!d.getWorldItems().isGuideBookClickPromptActive) return;
  d.getWorldItems().isGuideBookClickPromptActive = false;
  d.setStoredFlag(d.guideBookClickPromptDismissedKey, true);
  }

  function flashOnboardingOrderHint(message) {
  d.flashPlantProximityWarning(message || "\uC21C\uC11C\uB300\uB85C \uC9C4\uD589\uD574 \uC8FC\uC138\uC694.");
  d.updatePlayerStatus();
  }

  function getRenderedAdminAccounts() {
  try {
    const parsed = JSON.parse(d.adminAccountList.dataset.accounts || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
  }

  function onGuideInventoryToggleClick() {
  if (d.isTradeExchangeOpen() || d.isAlchemyCraftOpen()) {
    return;
  }
  if (d.isOnboardingLinearGateActive() && !d.onboardingAllowsGuideBookButtonToggle()) {
    flashOnboardingOrderHint("");
    return;
  }
  const wasOpen = d.getWorldItems().isGuideBookOpen;
  d.getWorldItems().isGuideBookOpen = !d.getWorldItems().isGuideBookOpen;
  if (wasOpen) {
    dismissGuideBookClickPrompt();
  }
  updateGuideCard();
  if (wasOpen) {
    d.maybeAdvanceOnboardingAfterGuideBookClosed();
    updateOnboardingFlowUI();
  }
  }

  function onboardingScheduleTutorialCompleteHide() {
  if (d.getOnboarding().finalHideTimerId) {
    window.clearTimeout(d.getOnboarding().finalHideTimerId);
  }
  d.getOnboarding().finalHideTimerId = window.setTimeout(function () {
    d.getOnboarding().finalHideTimerId = null;
    d.setOnboardingCalloutVisible(false, "");
    d.clearOnboardingHighlights();
    d.setOnboardingFlowDoneStored(true);
    d.setStoredFlag(d.everBeenToWorldKey, true);
    d.getOnboarding().flowStep = 0;
    d.setStoredValue(d.onboardingFlowStepKey, "0");
    d.getOnboarding().tutorialWorldNeedsFullReset = false;
    try {
      sessionStorage.removeItem(d.ovcTutorialReplaySessionKey);
    } catch (eRep) {}
    try {
      sessionStorage.removeItem("ovcTutorialWorldResetPending");
    } catch (e) {}
    try {
      sessionStorage.setItem("ovcPostTutorialMultiplayerReconnectV1", "1");
    } catch (e2) {}
    const proceedFinalToWorld = function () {
      d.isReloadingForWorldReset = true;
      window.location.replace(d.ovcWorldIndexUrl());
    };
    let finalTok = "";
    try {
      finalTok = d.getEffectiveOvcSessionToken();
    } catch (eFinalTok) {}
    if (d.currentUserId && finalTok && window.OVCOnline && typeof window.OVCOnline.saveTutorialDone === "function") {
      Promise.resolve(window.OVCOnline.saveTutorialDone(d.currentUserId, finalTok, true))
        .catch(function () {})
        .finally(proceedFinalToWorld);
      return;
    }
    proceedFinalToWorld();
  }, 7000);
  }

  function openSettingsOverlay() {
  d.setSettingsOverlayOpen(d.settingsOverlay, true);
  d.updateSettingsTutorialButtons();
  }

  function ovcTryDismissLoadingScreen(force) {
  if (d.isTabSessionSuperseded && !force) return;
  if (force || d.isCharacterSelecting) {
    d.hideAppLoadingScreen();
    return;
  }
  if (!d.ovcBootstrapFinished) return;
  if (d.isSharedWorldSyncPausedForTutorial() || !d.isWorldServerSyncAvailable()) {
    d.hideAppLoadingScreen();
    return;
  }
  if (!d.hasHydratedSharedWorldFromServer) return;
  d.hideAppLoadingScreen();
  }

  function pickRandomButterflyColor() {
  return butterflyMotion.pickColor();
  }

  function pickRandomButterflySpawnPoint() {
  return butterflyMotion.pickSpawnPoint();
  }

  function rebuildWorldExtraBucketDom() {
  if (!d.ground) return;
  d.ground.querySelectorAll(".world-extra-bucket").forEach(function (node) {
    node.remove();
  });
  if (!d.isWorldDocumentEntry() || !Array.isArray(d.getApple().worldExtraBuckets)) return;
  const insertBeforeEl = d.getWorldExtraBucketInsertBeforeEl();
  d.getApple().worldExtraBuckets.forEach(function (entry) {
    if (!entry) return;
    const el = document.createElement("img");
    el.className = "world-extra-d.bucket";
    el.dataset.bucketId = entry.id;
    el.src = entry.isFull ? d.IMG_BUCKET_FULL : d.IMG_BUCKET_EMPTY;
    el.alt = "";
    el.setAttribute("aria-hidden", "true");
    el.draggable = false;
    if (insertBeforeEl) {
      d.ground.insertBefore(el, insertBeforeEl);
    } else {
      d.ground.appendChild(el);
    }
    entry._el = el;
  });
  d.updateWorldExtraBuckets();
  }

  function renderAdminAccounts(accounts) {
  d.adminAccountList.innerHTML = "";

  if (!accounts.length) {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = "\uAC00\uC785\uB41C \uACC4\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.";
    d.adminAccountList.appendChild(empty);
    return;
  }

  accounts.forEach(function (account) {
    const row = document.createElement("div");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const meta = document.createElement("div");
    const deleteButton = document.createElement("button");

    row.className = "admin-account-row";
    name.className = "admin-account-name";
    meta.className = "admin-account-meta";
    deleteButton.className = "admin-delete-button";

    name.textContent = account.name || "\uC774\uB984 \uC5C6\uC74C";
    meta.textContent =
      (account.color || "\uC0C9 \uC5C6\uC74C") +
      " / " +
      d.formatAdminDate(account.created_at);
    deleteButton.textContent = "\uC0AD\uC81C";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", async function () {
      if (!confirm((account.name || "\uC774 \uACC4\uC815") + "\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?")) return;

      try {
        deleteButton.disabled = true;
        await window.OVCOnline.deleteAccount(account.id);
        const remainingAccounts = getRenderedAdminAccounts().filter(function (savedAccount) {
          return savedAccount.id !== account.id;
        });
        d.adminAccountList.dataset.accounts = JSON.stringify(remainingAccounts);
        renderAdminAccounts(remainingAccounts);

        if (account.id === d.currentUserId) {
          d.logout();
          return;
        }
  d.adminMessage.textContent = "\uACC4\uC815 \uBD88\uB7EC\uC624\uB294 \uC911...";
        loadAdminAccounts();
      } catch (error) {
        deleteButton.disabled = false;
        d.adminMessage.textContent = error.message;
      }
    });

    info.appendChild(name);
    info.appendChild(meta);
    row.appendChild(info);
    row.appendChild(deleteButton);
    d.adminAccountList.appendChild(row);
  });
  }

  function setWorldGuideBookOffGroundPickedForCurrentRoom() {
  d.setRoomKeyedPickupFlagAllSlugs(d.WORLD_GUIDE_BOOK_OFF_GROUND_PICKED_ROOM_KEY_PREFIX, true);
  }

  function showDialogueLine(lineInfo) {
  d.npcBubble.style.display = lineInfo.speaker === "npc" ? "block" : "none";
  d.playerBubble.style.display = lineInfo.speaker === "player" ? "block" : "none";

  if (lineInfo.speaker === "npc") {
    d.npcBubble.textContent = lineInfo.text;
    d.updateNpcPosition();
    return;
  }

  d.playerBubble.textContent = lineInfo.text;
  d.updatePlayerBubblePosition();
  }

  function showOnboardingSocialDemoChatBubble(text) {
  const body = d.sanitizeWorldChatText(text);
  if (!body) return;
  d.localChatBubbleText = body;
  d.localChatBubbleHideAt = Date.now() + d.WORLD_CHAT_HEAD_BUBBLE_MS;
  if (d.localChatBubbleTimer) {
    window.clearTimeout(d.localChatBubbleTimer);
  }
  d.localChatBubbleTimer = window.setTimeout(function () {
    d.localChatBubbleTimer = null;
    d.localChatBubbleText = "";
    d.localChatBubbleHideAt = 0;
    d.updatePlayerChatBubbleOverlay();
  }, d.WORLD_CHAT_HEAD_BUBBLE_MS);
  d.updatePlayerChatBubbleOverlay();
  }

  function showOnlineDebugMessage(message) {
  if (!d.onlineDebugToast || !message) return;
  d.onlineDebugToast.textContent = message;
  d.onlineDebugToast.classList.add("is-visible");
  d.addNetworkDebugLog("toast: " + message);
  if (d.onlineDebugToastTimeout) {
    clearTimeout(d.onlineDebugToastTimeout);
  }
  d.onlineDebugToastTimeout = setTimeout(function () {
    d.onlineDebugToast.classList.remove("is-visible");
  }, 3000);
  }

  function showPlayerAlert(options) {
  if (!d.playerAlert) return;
  const opts = options || {};
  const message = opts.message != null ? String(opts.message) : "!";
  const durationMs = Number.isFinite(Number(opts.durationMs)) ? Number(opts.durationMs) : 1800;
  const butterflyCatch = Boolean(opts.butterflyCatch);
  if (d.playerAlertHideTimerId) {
    window.clearTimeout(d.playerAlertHideTimerId);
    d.playerAlertHideTimerId = null;
  }
  d.playerAlert.textContent = message;
  d.playerAlert.classList.toggle("is-butterfly-catch", butterflyCatch);
  d.playerAlert.style.display = "block";
  d.updatePlayerAlert();
  d.playerAlertHideTimerId = window.setTimeout(function () {
    d.playerAlertHideTimerId = null;
    d.playerAlert.style.display = "none";
    d.playerAlert.classList.remove("is-butterfly-catch");
  }, durationMs);
  }

  function showUiShortcutHoverLabel(text, anchorEl) {
  if (!d.plantHoverLabel || !anchorEl || !anchorEl.isConnected) return;
  d.ensurePlantHoverLabelOnBodyForFixedUi();
  d.plantHoverLabel.classList.remove(
    "is-seed-inventory-hint",
    "is-stage3-complete",
    "is-well-dock",
    "is-world-npc-name",
    "is-plant-world-sign",
    "is-dry",
    "is-overwatered"
  );
  d.plantHoverLabel.classList.add("is-ui-shortcut-hint");
  d.plantHoverLabel.textContent = text;
  d.plantHoverLabel.style.display = "block";
  d.plantHoverLabel.style.position = "fixed";
  d.plantHoverLabel.style.zIndex = "220";
  d.plantHoverLabel.style.transform = "none";
  d.plantHoverLabel.style.height = "";
  d.plantHoverLabel.style.width = "";
  d.plantHoverLabel.style.minWidth = "";
  d.plantHoverLabel.style.right = "";
  const r = anchorEl.getBoundingClientRect();
  void d.plantHoverLabel.offsetWidth;
  const w = d.plantHoverLabel.offsetWidth || 1;
  const h = d.plantHoverLabel.offsetHeight || 1;
  const gap = 8;
  let left = r.left + r.width / 2 - w / 2;
  let top = r.top - h - gap;
  left = Math.max(8, Math.min(window.innerWidth - w - 8, left));
  top = Math.max(8, top);
  d.plantHoverLabel.style.left = left + "px";
  d.plantHoverLabel.style.top = top + "px";
  }

  function syncGuideInventoryBar() {
  if (d.guideBookButton) {
    d.guideBookButton.style.display = "none";
    d.guideBookButton.hidden = true;
  }
  if (d.worldBagInventory) {
    const show = d.shouldShowWorldBagInventoryUi();
    d.worldBagInventory.style.display = show ? "block" : "none";
    d.worldBagInventory.hidden = !show;
  }
  d.updatePlantProgressGauge();
  }

  function updateGuideCard() {
  const nearSign = d.isNearSignBoard();
  d.syncWorldBagGroundVisibility();
  syncGuideInventoryBar();
  const shouldShow =
    d.getWorldItems().hasGuideBook &&
    !d.isOnboardingInventoryTutorialActive() &&
    (d.getWorldItems().isGuideBookOpen || (nearSign && !d.getWorldItems().isGuideDismissedAtSign));

  if (shouldShow) {
    d.guideCard.style.display = "block";
    updateGuidePages();
  } else {
    d.guideCard.style.display = "none";
  }

  if (d.guideBook) d.guideBook.classList.remove("is-near");
  if (d.worldBag) d.worldBag.classList.remove("is-near");
  if (d.worldBagInventory) {
    d.worldBagInventory.classList.toggle(
      "is-click-prompt",
      d.getWorldItems().hasGuideBook && d.getWorldItems().isGuideBookClickPromptActive
    );
  }

  }

  function updateGuidePages() {
  if (d.getNpc().isGuidePlantPageUnlocked && d.guidePlantPageHtml) {
    d.guidePages[0].innerHTML = d.guidePlantPageHtml;
  } else {
    d.guidePages[0].innerHTML = d.guidePlaceholderHtml;
  }
  if (d.guidePages[1]) {
    d.guidePages[1].classList.remove("is-active");
  }

  const maxPage = d.getGuideMaxPage();

  if (d.getNpc().guidePageIndex > maxPage) {
    d.getNpc().guidePageIndex = maxPage;
  }

  d.guidePages.forEach(function (page, index) {
    page.classList.toggle("is-active", index === d.getNpc().guidePageIndex);
  });

  d.guidePrev.style.display = maxPage > 0 && d.getNpc().guidePageIndex > 0 ? "block" : "none";
  d.guideNext.style.display =
    maxPage > 0 && d.getNpc().guidePageIndex < maxPage ? "block" : "none";
  d.guidePageText.textContent = d.getNpc().guidePageIndex + 1 + "/" + (maxPage + 1);
  }

  function updateMagicPowderInventoryUi() {
  if (d.magicPowderInventory) {
    d.magicPowderInventory.style.display = "none";
    d.magicPowderInventory.classList.remove("is-near");
    d.setInstantHoverTip(d.magicPowderInventory, null);
  }
  if (d.magicPowderCountText) {
    d.setInstantHoverTip(d.magicPowderCountText, null);
  }
  d.updateBagInventorySlots();
  }

  function updateOnboardingFlowUI() {
  if (!d.onboardingCallout || !d.onboardingCalloutText) {
    d.updateSettingsTutorialButtons();
    return;
  }
  if (!d.hasSpawnedCharacter || d.isCharacterSelecting || d.isTabSessionSuperseded) {
    d.setOnboardingCalloutVisible(false, "");
    d.clearOnboardingHighlights();
    d.updateSettingsTutorialButtons();
    return;
  }
  if (d.isWorldDocumentEntry()) {
    d.setOnboardingCalloutVisible(false, "");
    d.clearOnboardingHighlights();
    d.movementTutorial.hideOverlay();
    d.updateSettingsTutorialButtons();
    return;
  }
  if (d.getStoredFlag(d.onboardingFlowDoneKey) || d.getOnboarding().flowStep <= 0) {
    d.setOnboardingCalloutVisible(false, "");
    d.clearOnboardingHighlights();
    d.updateSettingsTutorialButtons();
    return;
  }

  d.onboardingAutoAdvanceSteps();

  d.clearOnboardingHighlights();

  const guideOpen = d.guideCard && d.guideCard.style.display === "block";

  if (
    d.getOnboarding().flowStep === d.ONBOARDING_STEP_NPC_GUIDE &&
    guideOpen &&
    !d.onboardingEscHintTimerId &&
    !d.getOnboarding().npcGuideEscHintShown
  ) {
    d.scheduleOnboardingNpcGuideEscHint();
  }

  switch (d.getOnboarding().flowStep) {
    case 1: {
      if (d.isNearWorldBagPickup() && !d.getWorldItems().hasGuideBook) {
        d.movementTutorial.hideOverlay();
        d.setOnboardingCalloutVisible(true, "E키를 눌러 가방을 소지하세요.");
        if (d.worldBag) d.worldBag.classList.add("onboarding-highlight");
      } else {
        d.setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case 3: {
      if (d.getOnboarding().inventoryIntroPhase === 0) {
        d.setOnboardingCalloutVisible(
          true,
          "tab키를 누르거나 왼쪽아래 가방 이미지를 누르세요."
        );
        if (d.worldBagInventory) {
          d.worldBagInventory.classList.add("onboarding-highlight");
          d.worldBagInventory.classList.add("onboarding-highlight-book-inv");
        }
      } else if (d.getOnboarding().inventoryIntroPhase === 1) {
        d.setOnboardingCalloutVisible(true, "인벤토리(저장소)가 열립니다.");
        if (d.bagInventoryPanel && d.bagInventoryPanelOpen) {
          d.bagInventoryPanel.classList.add("onboarding-highlight");
        }
      } else {
        d.setOnboardingCalloutVisible(
          true,
          "tab키 또는 가방을 클릭해 인벤토리를 닫으세요."
        );
        if (d.worldBagInventory) {
          d.worldBagInventory.classList.add("onboarding-highlight");
          d.worldBagInventory.classList.add("onboarding-highlight-book-inv");
        }
        if (d.bagInventoryPanel && d.bagInventoryPanelOpen) {
          d.bagInventoryPanel.classList.add("onboarding-highlight");
        }
      }
      break;
    }
    case 4: {
      d.setOnboardingCalloutVisible(
        true,
        "space바를 누르면 점프를 합니다. 해보세요!"
      );
      if (d.player) d.player.classList.add("onboarding-highlight");
      break;
    }
    case 5: {
      d.setOnboardingCalloutVisible(true, "씨앗으로 이동하세요.");
      if (d.seed) d.seed.classList.add("onboarding-highlight");
      break;
    }
    case 6: {
      d.setOnboardingCalloutVisible(true, "e키를 눌러 씨앗을 소지하세요.");
      if (d.seed) d.seed.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_GO_BOOK: {
      d.setOnboardingCalloutVisible(true, "책으로 이동하세요.");
      if (d.guideBook) d.guideBook.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_PICK_BOOK: {
      d.setOnboardingCalloutVisible(true, "e키를 눌러 책을 주우세요.");
      if (d.guideBook) d.guideBook.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_BOOK_INV: {
      if (d.getOnboarding().bookInvPhase === 2) {
        d.setOnboardingCalloutVisible(true, "아직 내용이 없습니다.");
        if (guideOpen && d.guideCard) d.guideCard.classList.add("onboarding-highlight");
      } else if (d.getOnboarding().bookInvPhase >= 3) {
        d.setOnboardingCalloutVisible(true, "책에 안내창을 닫아보세요");
        if (d.guideCard) d.guideCard.classList.add("onboarding-highlight");
      } else {
        d.setOnboardingCalloutVisible(true, "인벤토리를 열어서 책을 눌러보세요.");
        if (d.worldBagInventory) {
          d.worldBagInventory.classList.add("onboarding-highlight");
          d.worldBagInventory.classList.add("onboarding-highlight-book-inv");
        }
        if (d.getOnboarding().bookInvPhase >= 1 && d.bagInventoryPanelOpen) {
          if (d.bagInventoryPanel) d.bagInventoryPanel.classList.add("onboarding-highlight");
          if (d.bagBookStorageSlot) d.bagBookStorageSlot.classList.add("onboarding-highlight");
        }
      }
      break;
    }
    case d.ONBOARDING_STEP_PLANT: {
      d.setOnboardingCalloutVisible(
        true,
        "씨앗을 심을 위치로 이동 후, 인벤토리에 씨앗을 눌러 심으세요."
      );
      if (d.worldBagInventory) {
        d.worldBagInventory.classList.add("onboarding-highlight");
        d.worldBagInventory.classList.add("onboarding-highlight-book-inv");
      }
      if (d.bagInventoryPanel) {
        if (d.bagInventoryPanelOpen) {
          d.bagInventoryPanel.classList.add("onboarding-highlight");
        }
        const bagSeedSlot = d.bagInventoryPanel.querySelector('[data-bag-type="seed"]');
        if (bagSeedSlot && d.getBagInventorySeedCount() > 0) {
          bagSeedSlot.classList.add("onboarding-highlight");
        }
      }
      break;
    }
    case d.ONBOARDING_STEP_PLANT_MASTER: {
      d.setOnboardingCalloutVisible(true, "식물의 달인을 찾아가세요.");
      if (d.plantMaster) d.plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_PLANT_MASTER_TALK: {
      if (d.getNpc().isDialogueRunning) {
        d.setOnboardingCalloutVisible(false, "");
        if (d.plantMaster) d.plantMaster.classList.add("onboarding-highlight");
        break;
      }
      d.setOnboardingCalloutVisible(true, "q를 눌러 식물의 달인과 대화하세요.");
      if (d.plantMaster) d.plantMaster.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_NPC_GUIDE: {
      if (guideOpen) {
        const line1 = "설명을 참고하세요.";
        const line2 = "안내창을 닫으세요.";
        d.setOnboardingCalloutVisible(
          true,
          d.getOnboarding().npcGuideEscHintShown ? line2 : line1
        );
        if (d.worldBagInventory) d.worldBagInventory.classList.add("onboarding-highlight");
        if (d.getOnboarding().npcGuideEscHintShown && d.guideCard) {
          d.guideCard.classList.add("onboarding-highlight");
        }
      } else {
        d.setOnboardingCalloutVisible(false, "");
      }
      break;
    }
    case d.ONBOARDING_STEP_WELL: {
      d.setOnboardingCalloutVisible(true, "우물근처에 양동이로 이동하세요.");
      if (d.well) d.well.classList.add("onboarding-highlight");
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_BUCKET_PICK: {
      d.setOnboardingCalloutVisible(
        true,
        "양동이 근처로 가서 E키를 눌러 양동이를 들어 주세요."
      );
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_BUCKET_FILL: {
      d.setOnboardingCalloutVisible(
        true,
        "우물로 이동한 뒤 Q키를 눌러 물을 길어 주세요."
      );
      if (d.well) d.well.classList.add("onboarding-highlight");
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_WATER_APPROACH: {
      d.setOnboardingCalloutVisible(
        true,
        "그대로 아까 심은 씨앗으로 다가가세요. Q 또는 식물 클릭으로 식물에 물을 주세요."
      );
      if (d.plantSpot) plantSpot.classList.add("onboarding-highlight");
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_WATER_POUR: {
      d.setOnboardingCalloutVisible(true, "Q 또는 식물 클릭으로 식물에 물을 주세요.");
      if (d.plantSpot) plantSpot.classList.add("onboarding-highlight");
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_WATER_DONE: {
      if (d.getOnboarding().plantIndexAwaitingSprout) {
        d.setOnboardingCalloutVisible(
          true,
          "새싹이 3단계가 되면 식물지수 안내가 이어집니다."
        );
        if (d.plantSpot) plantSpot.classList.add("onboarding-highlight");
      } else {
        d.setOnboardingCalloutVisible(
          true,
          d.getOnboarding().postWaterCongratsPhase === 0
            ? "축하합니다! 식물 키우는 법을 배우셨습니다."
            : "아직 남았습니다 끝까지 진행해주세요."
        );
      }
      break;
    }
    case d.ONBOARDING_STEP_PLANT_INDEX: {
      const plantGauge = document.getElementById("plant-progress-gauge");
      const sproutToggle = document.getElementById("plant-progress-d.sprout-toggle");
      let calloutText = "";
      if (d.getOnboarding().plantIndexIntroPhase === 0) {
        calloutText = "식물을 키우면 식물지수가 올라갑니다.";
        if (plantGauge) {
          plantGauge.classList.remove("is-collapsed");
          plantGauge.classList.add("onboarding-highlight");
        }
        if (sproutToggle) sproutToggle.setAttribute("aria-expanded", "true");
      } else if (d.getOnboarding().plantIndexIntroPhase === 1) {
        calloutText = "새싹 아이콘을 누르면 식물지수를 닫을 수 있습니다.";
        if (sproutToggle) sproutToggle.classList.add("onboarding-highlight");
      } else if (d.getOnboarding().plantIndexIntroPhase === 2) {
        calloutText = "다시 누르면 다시 나옵니다.";
        if (sproutToggle) sproutToggle.classList.add("onboarding-highlight");
      }
      d.setOnboardingCalloutVisible(true, calloutText);
      break;
    }
    case d.ONBOARDING_STEP_DROP_BUCKET: {
      d.setOnboardingCalloutVisible(true, "E키를 눌러 양동이를 내려놓으세요.");
      if (d.bucket) d.bucket.classList.add("onboarding-highlight");
      if (d.player) d.player.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_CHAT: {
      d.setOnboardingCalloutVisible(
        true,
        "💬 버튼을 눌러 채팅을 열고, 메시지를 입력한 뒤 전송해 보세요."
      );
      if (d.worldChatToggleBtn) d.worldChatToggleBtn.classList.add("onboarding-highlight");
      if (d.worldChatPanelOpen && d.worldChatSendBtn) {
        d.worldChatSendBtn.classList.add("onboarding-highlight");
      }
      break;
    }
    case d.ONBOARDING_STEP_HEART: {
      d.setOnboardingCalloutVisible(
        true,
        "❤️ 버튼을 눌러 하트를 보내 보세요. 다른 플레이어에게 반응을 전할 수 있어요."
      );
      if (d.worldHeartBtn) d.worldHeartBtn.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_SAD: {
      d.setOnboardingCalloutVisible(
        true,
        "😢 버튼을 눌러 슬퍼요를 보내 보세요."
      );
      if (d.worldSadBtn) d.worldSadBtn.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_ROCK: {
      d.setOnboardingCalloutVisible(true, "땅의 돌에 가까이 가서 E키로 줍아 보세요.");
      if (Array.isArray(d.getApple().worldRocks)) {
        d.getApple().worldRocks.forEach(function (rock) {
          if (rock && rock._el && String(rock.id) === d.TUTORIAL_ONBOARDING_ROCK_ID) {
            rock._el.classList.add("onboarding-highlight");
          }
        });
      }
      break;
    }
    case d.ONBOARDING_STEP_BUTTERFLY: {
      d.setOnboardingCalloutVisible(
        true,
        "날아다니는 나비에 근접하여 E 또는 Q로 잡아 보세요."
      );
      Object.keys(d.butterflyRenderById).forEach(function (id) {
        const entry = d.butterflyRenderById[id];
        if (entry && entry.element) {
          entry.element.classList.add("onboarding-highlight");
        }
      });
      break;
    }
    case d.ONBOARDING_STEP_TRADE_MASTER: {
      d.setOnboardingCalloutVisible(true, "거래의 달인에게 가서 Q키로 대화해 보세요.");
      if (d.tradeMaster) d.tradeMaster.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_ALCHEMY_MASTER: {
      d.setOnboardingCalloutVisible(true, "연금술의 달인에게 가서 Q키로 대화해 보세요.");
      if (d.alchemyMaster) d.alchemyMaster.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_ZOOM_INTRO: {
      d.setOnboardingCalloutVisible(true, "스크롤해 맵을 축소,확대 해보세요.");
      break;
    }
    case d.ONBOARDING_STEP_ZOOM_MIN: {
      d.setOnboardingCalloutVisible(true, "가장 작게 축소 해보세요.");
      break;
    }
    case d.ONBOARDING_STEP_TREE_APPROACH: {
      d.setOnboardingCalloutVisible(true, "정중앙 위 나무로 이동하세요.");
      if (d.bigTree) d.bigTree.classList.add("onboarding-highlight");
      break;
    }
    case d.ONBOARDING_STEP_TREE_CLIMB: {
      d.setOnboardingCalloutVisible(
        true,
        "나무를 이동하여 올라타고 열매들 근처로 이동하세요."
      );
      if (d.bigTree) d.bigTree.classList.add("onboarding-highlight");
      d.highlightUnpickedApplesForTutorial();
      break;
    }
    case d.ONBOARDING_STEP_PICK_APPLE: {
      d.setOnboardingCalloutVisible(true, "e키를 눌러 열매를 따세요.");
      d.highlightUnpickedApplesForTutorial();
      break;
    }
    case d.ONBOARDING_STEP_EAT_APPLE: {
      d.setOnboardingCalloutVisible(true, "가방을 연 뒤 사과 칸을 눌러 먹으세요.");
      if (d.worldBagInventory) d.worldBagInventory.classList.add("onboarding-highlight");
      if (d.bagInventoryPanel) {
        const bagAppleSlot = d.bagInventoryPanel.querySelector('[data-bag-type="apple"]');
        if (bagAppleSlot) bagAppleSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case d.ONBOARDING_STEP_EXTRA_SEED: {
      const lineSeed = "씨앗이 생겼으니 원하는 곳에 클릭해 사용하세요.";
      const lineB = "나무밖으로 이동하세요.";
      if (d.getOnboarding().postAppleSeedIntroPhase === 0) {
        d.setOnboardingCalloutVisible(true, "씨앗을 얻었습니다.");
      } else {
        d.setOnboardingCalloutVisible(
          true,
          d.getOnboarding().seedTutorialSecondLine ? lineSeed + "\n\n" + lineB : lineSeed
        );
      }
      if (d.bagInventoryPanel) {
        const bagSeedSlot = d.bagInventoryPanel.querySelector('[data-bag-type="seed"]');
        if (bagSeedSlot) bagSeedSlot.classList.add("onboarding-highlight");
      }
      break;
    }
    case d.ONBOARDING_STEP_SETTINGS_ESC: {
      d.setOnboardingCalloutVisible(
        true,
        "Esc를 눌러 설정을 연 뒤, 다시 Esc로 닫아 보세요."
      );
      break;
    }
    case d.ONBOARDING_STEP_COMPLETE: {
      d.setOnboardingCalloutVisible(true, "축하합니다! 튜토리얼이 끝났습니다!!");
      break;
    }
    default:
      d.setOnboardingCalloutVisible(false, "");
  }
  d.updateSettingsTutorialButtons();
  }

  function updateWorldSocialChatUiEnabled() {
  const ok = d.isOnboardingSocialDemoReady();
  if (d.worldChatInputEl) {
    worldChatInputEl.disabled = !ok;
    worldChatInputEl.placeholder = ok
      ? d.isOnboardingSocialTutorialStep()
        ? "\uBA54\uC2DC\uC9C0\uB97C \uC785\uB825\uD55C \uB4A4 \uC804\uC1A1"
        : "\uC804\uCCB4: \uBA54\uC2DC\uC9C0 \uB610\uB294 \uC774\uB9841, \uC774\uB9842: \uADD3\uB9D0..."
      : "\uBA40\uD2F0 \uC5F0\uACB0 \uD6C4 \uCC57";
  }
  if (d.worldChatSendBtn) d.worldChatSendBtn.disabled = !ok;
  if (d.worldChatUsersBtn) d.worldChatUsersBtn.disabled = !d.isWorldSocialRealtimeReady();
  if (d.worldHeartBtn) d.worldHeartBtn.disabled = !ok;
  if (d.worldSadBtn) d.worldSadBtn.disabled = !ok;
  }

  return {
    closeGuideCardFromClick,
    closeSettingsOverlayFromBackdrop,
    closeSettingsOverlayFromEscape,
    discardInventorySeed,
    dismissGuideBookClickPrompt,
    flashOnboardingOrderHint,
    getRenderedAdminAccounts,
    onGuideInventoryToggleClick,
    onboardingScheduleTutorialCompleteHide,
    openSettingsOverlay,
    ovcTryDismissLoadingScreen,
    pickRandomButterflyColor,
    pickRandomButterflySpawnPoint,
    rebuildWorldExtraBucketDom,
    renderAdminAccounts,
    setWorldGuideBookOffGroundPickedForCurrentRoom,
    showDialogueLine,
    showOnboardingSocialDemoChatBubble,
    showOnlineDebugMessage,
    showPlayerAlert,
    showUiShortcutHoverLabel,
    syncGuideInventoryBar,
    updateGuideCard,
    updateGuidePages,
    updateMagicPowderInventoryUi,
    updateOnboardingFlowUI,
    updateWorldSocialChatUiEnabled,
  };
}
