const player = document.getElementById("player");
const seed = document.getElementById("seed");
const bucket = document.getElementById("bucket");
const well = document.getElementById("well");
const bigTree = document.getElementById("big-tree");
const plantSpot = document.getElementById("plant-spot");
const sprout = document.getElementById("sprout");
const plantMaster = document.getElementById("plant-master");
const tradeMaster = document.getElementById("trade-master");
const alchemyMaster = document.getElementById("alchemy-master");
const npcBubble = document.getElementById("npc-bubble");
const tradeMasterBubble = document.getElementById("trade-master-bubble");
const alchemyMasterBubble = document.getElementById("alchemy-master-bubble");
const tradeExchangeOverlay = document.getElementById("trade-exchange-overlay");
const tradeCounterSlot = document.getElementById("trade-counter-slot");
const tradeBuyCatalog = document.getElementById("trade-buy-catalog");
const tradeBuyCart = document.getElementById("trade-buy-cart");
const tradeBuyTotal = document.getElementById("trade-buy-total");
const tradeBuyConfirm = document.getElementById("trade-buy-confirm");
const tradeSellTotal = document.getElementById("trade-sell-total");
const tradeSellConfirm = document.getElementById("trade-sell-confirm");
const tradeShopMoney = document.getElementById("trade-shop-money");
const tradeExchangeClose = document.getElementById("trade-exchange-close");
const plantMasterSeedShopOverlay = document.getElementById("plant-master-seed-shop-overlay");
const plantMasterSeedShopClose = document.getElementById("plant-master-seed-shop-close");
const alchemyCraftOverlay = document.getElementById("alchemy-craft-overlay");
const alchemyCraftProductList = document.getElementById("alchemy-craft-product-list");
const alchemyCraftRequirementsBlock = document.getElementById("alchemy-craft-requirements-block");
const alchemyCraftRequirementSlots = document.getElementById("alchemy-craft-requirement-slots");
const alchemyCraftRequirementSummary = document.getElementById("alchemy-craft-requirement-summary");
const alchemyCraftConfirm = document.getElementById("alchemy-craft-confirm");
const alchemyCraftClose = document.getElementById("alchemy-craft-close");
const playerBubble = document.getElementById("player-bubble");
const playerAlert = document.getElementById("player-alert");
const waterNeeded = document.getElementById("water-needed");
const plantCard = document.getElementById("plant-card");
const plantCardTitle = document.getElementById("plant-card-title");
const plantWaterText = document.getElementById("plant-water-text");
const plantWaterBar = document.getElementById("plant-water-bar");
const plantWaterSegments = Array.from(
  document.querySelectorAll(".plant-water-segment")
);
const signBoard = document.getElementById("sign-board");
const growthCard = document.getElementById("growth-card");
const growthFill = document.getElementById("growth-fill");
const guideBook = document.getElementById("guide-book");
const worldBag = document.getElementById("world-bag");
const guideBookButton = document.getElementById("guide-book-button");
const worldBagInventory = document.getElementById("world-bag-inventory");
const bagInventoryPanel = document.getElementById("bag-inventory-panel");
const bagInventoryClose = document.getElementById("bag-inventory-close");
const bagBookStorageSlot = document.getElementById("bag-book-storage-slot");
const bagPlayerMoney = document.getElementById("bag-player-money");
const bagInventorySlots = Array.from(
  document.querySelectorAll(".bag-inventory-slots .bag-inventory-slot")
);
const guideCard = document.getElementById("guide-card");
const guideCloseButton = document.getElementById("guide-close-button");
const guidePages = Array.from(document.querySelectorAll(".guide-page"));
const guidePrev = document.getElementById("guide-prev");
const guideNext = document.getElementById("guide-next");
const guidePageText = document.getElementById("guide-page-text");
const playerStatus = document.getElementById("player-status");
const playerName = document.getElementById("player-name");
const characterSelectOverlay = document.getElementById("character-select-overlay");
const characterPreview = document.getElementById("character-preview");
const characterColorGrid = document.getElementById("character-color-grid");
const characterSelectButton = document.getElementById("character-select-button");
const wellCard = document.getElementById("well-card");
const wellCardImage = document.getElementById("well-card-image");
const wellWaterText = document.getElementById("well-water-text");
const wellWaterFill = document.getElementById("well-water-fill");
const wellDonationText = document.getElementById("well-donation-text");
const wellDonationFill = document.getElementById("well-donation-fill");
const wellDonationOpenBtn = document.getElementById("well-donation-open-btn");
const wellDonationOverlay = document.getElementById("well-donation-overlay");
const wellDonationGoalText = document.getElementById("well-donation-goal-text");
const wellDonationBalanceText = document.getElementById("well-donation-balance-text");
const wellDonationSelectedText = document.getElementById("well-donation-selected-text");
const wellDonationConfirmBtn = document.getElementById("well-donation-confirm");
const wellDonationCancelBtn = document.getElementById("well-donation-cancel");
const seedCard = document.getElementById("seed-card");
const seedDryGauge = document.getElementById("seed-dry-gauge");
const seedDryText = document.getElementById("seed-dry-text");
const seedWorldText = document.getElementById("seed-world-text");
const plantHoverLabel = document.getElementById("plant-hover-label");
const plantHoverRing = document.getElementById("plant-hover-ring");
const treeAppleElements = Array.from(document.querySelectorAll(".tree-apple"));
const world = document.querySelector(".world");
const ground = document.querySelector(".ground");
const worldPlantFog = document.getElementById("world-plant-fog");
const worldSkyFog = document.getElementById("world-sky-fog");
const onboardingCallout = document.getElementById("onboarding-callout");
const onboardingCalloutText = document.getElementById("onboarding-callout-text");
const movementTutorialOverlay = document.getElementById("movement-tutorial-overlay");
const movementTutorialLineMove = document.getElementById("movement-tutorial-line-move");
const movementTutorialLineBook = document.getElementById("movement-tutorial-line-book");
const movementTutorialKeys = document.getElementById("movement-tutorial-keys");
export {
  player,
  seed,
  bucket,
  well,
  bigTree,
  plantSpot,
  sprout,
  plantMaster,
  tradeMaster,
  alchemyMaster,
  npcBubble,
  tradeMasterBubble,
  alchemyMasterBubble,
  tradeExchangeOverlay,
  tradeCounterSlot,
  tradeBuyCatalog,
  tradeBuyCart,
  tradeBuyTotal,
  tradeBuyConfirm,
  tradeSellTotal,
  tradeSellConfirm,
  tradeShopMoney,
  tradeExchangeClose,
  plantMasterSeedShopOverlay,
  plantMasterSeedShopClose,
  alchemyCraftOverlay,
  alchemyCraftProductList,
  alchemyCraftRequirementsBlock,
  alchemyCraftRequirementSlots,
  alchemyCraftRequirementSummary,
  alchemyCraftConfirm,
  alchemyCraftClose,
  playerBubble,
  playerAlert,
  waterNeeded,
  plantCard,
  plantCardTitle,
  plantWaterText,
  plantWaterBar,
  plantWaterSegments,
  signBoard,
  growthCard,
  growthFill,
  guideBook,
  worldBag,
  guideBookButton,
  worldBagInventory,
  bagInventoryPanel,
  bagInventoryClose,
  bagBookStorageSlot,
  bagPlayerMoney,
  bagInventorySlots,
  guideCard,
  guideCloseButton,
  guidePages,
  guidePrev,
  guideNext,
  guidePageText,
  playerStatus,
  playerName,
  characterSelectOverlay,
  characterPreview,
  characterColorGrid,
  characterSelectButton,
  wellCard,
  wellCardImage,
  wellWaterText,
  wellWaterFill,
  wellDonationText,
  wellDonationFill,
  wellDonationOpenBtn,
  wellDonationOverlay,
  wellDonationGoalText,
  wellDonationBalanceText,
  wellDonationSelectedText,
  wellDonationConfirmBtn,
  wellDonationCancelBtn,
  seedCard,
  seedDryGauge,
  seedDryText,
  seedWorldText,
  plantHoverLabel,
  plantHoverRing,
  treeAppleElements,
  world,
  ground,
  worldPlantFog,
  worldSkyFog,
  onboardingCallout,
  onboardingCalloutText,
  movementTutorialOverlay,
  movementTutorialLineMove,
  movementTutorialLineBook,
  movementTutorialKeys
};
