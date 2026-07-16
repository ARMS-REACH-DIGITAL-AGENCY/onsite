const NEW_LOGO = "/assets/onsite_logo.png";
const OLD_ACCENT = "oklch(0.65 0.22 28)";
const BRAND_ORANGE = "oklch(0.714 0.148 58)";

function money(n: number) {
  return Math.round(n);
}

function readSlider(labelText: string): number {
  const labels = Array.from(document.querySelectorAll("label"));
  const label = labels.find((node) => node.textContent?.trim() === labelText);
  const container = label?.closest(".animate-fade