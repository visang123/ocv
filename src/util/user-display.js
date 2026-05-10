export function nameForIngameUiDisplay(realName) {
  return (realName || "").trim() || "OVC";
}

export function normalizeHexColor(value) {
  if (!/^#[0-9a-fA-F]{6}$/.test(value || "")) return "";
  return value.toLowerCase();
}
