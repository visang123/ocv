export const OVC_PAGE_ENTRY =
  typeof window !== "undefined" && window.OVC_ENTRY === "tutorial"
    ? "tutorial"
    : "world";

export function isTutorialDocumentEntry() {
  return OVC_PAGE_ENTRY === "tutorial";
}

export function isWorldDocumentEntry() {
  return OVC_PAGE_ENTRY !== "tutorial";
}
