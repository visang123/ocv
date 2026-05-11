const player = document.getElementById("player");
const seed = document.getElementById("seed");
const bucket = document.getElementById("bucket");
const well = document.getElementById("well");
const bigTree = document.getElementById("big-tree");
const plantSpot = document.getElementById("plant-spot");
const sprout = document.getElementById("sprout");
const plantMaster = document.getElementById("plant-master");
const npcBubble = document.getElementById("npc-bubble");
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
const seedCard = document.getElementById("seed-card");
const seedDryGauge = document.getElementById("seed-dry-gauge");
const seedDryText = document.getElementById("seed-dry-text");
const seedWorldText = document.getElementById("seed-world-text");
const plantHoverLabel = document.getElementById("plant-hover-label");
const seedInventory = document.getElementById("seed-inventory");
const seedCountText = document.getElementById("seed-count");
const appleInventory = document.getElementById("apple-inventory");
const appleCountText = document.getElementById("apple-count");
const treeAppleElements = Array.from(document.querySelectorAll(".tree-apple"));
const inventoryApple = document.querySelector(".inventory-apple");
const butterflyInventory = document.getElementById("butterfly-inventory");
const butterflyInventorySlots = Array.from(
  document.querySelectorAll("#butterfly-inventory .butterfly-inventory-slot")
);
const butterflyInventoryTotal = document.getElementById("butterfly-inventory-total");
const world = document.querySelector(".world");
const ground = document.querySelector(".ground");
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
  npcBubble,
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
  seedCard,
  seedDryGauge,
  seedDryText,
  seedWorldText,
  plantHoverLabel,
  seedInventory,
  seedCountText,
  appleInventory,
  appleCountText,
  treeAppleElements,
  inventoryApple,
  butterflyInventory,
  butterflyInventorySlots,
  butterflyInventoryTotal,
  world,
  ground,
  onboardingCallout,
  onboardingCalloutText,
  movementTutorialOverlay,
  movementTutorialLineMove,
  movementTutorialLineBook,
  movementTutorialKeys
};
