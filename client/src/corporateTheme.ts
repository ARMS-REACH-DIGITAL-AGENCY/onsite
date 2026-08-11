const BRAND_NAVY = "#002549";
const BRAND_YELLOW = "#EFC02E";
const BRAND_YELLOW_RGB = "239, 192, 46";
const BRAND_CHARCOAL = "#1A1A1A";
const BRAND_WHITE = "#FFFFFF";
const OFFICIAL_LOGO_SRC = "/assets/onsite_logo.svg?v=20260811-brand2";

function alphaFromClass(classes: string, prefix: "bg" | "border") {
  const match = classes.match(new RegExp(`${prefix}-orange-\\d+\\/(\\d+)`));
  if (!match) return null;
  const percent = Number(match[1]);
  return Number.isFinite(percent) ? Math.max(0, Math.min(1, percent / 100)) : null;
}

function recolorElement(node: HTMLElement) {
  const classes = String(node.className || "");

  if (classes.includes("text-orange-")) {
    node.style.setProperty("color", BRAND_YELLOW, "important");
  }

  if (classes.includes("bg-orange-")) {
    const alpha = alphaFromClass(classes, "bg");
    const color = alpha === null ? BRAND_YELLOW : `rgba(${BRAND_YELLOW_RGB}, ${alpha})`;
    node.style.setProperty("background-color", color, "important");
  }

  if (classes.includes("border-orange-")) {
    const alpha = alphaFromClass(classes, "border");
    const color = alpha === null ? BRAND_YELLOW : `rgba(${BRAND_YELLOW_RGB}, ${alpha})`;
    node.style.setProperty("border-color", color, "important");
  }

  if (classes.includes("from-orange-") || classes.includes("via-orange-") || classes.includes("to-orange-")) {
    node.style.setProperty("--tw-gradient-from", BRAND_YELLOW, "important");
    node.style.setProperty("--tw-gradient-via", BRAND_YELLOW, "important");
    node.style.setProperty("--tw-gradient-to", BRAND_YELLOW, "important");
  }

  const style = node.getAttribute("style");
  if (style) {
    let corrected = style
      .replace(/oklch\(0\.65 0\.22 28 \/ (\d+)%\)/g, (_match, percent) => {
        const alpha = Math.max(0, Math.min(1, Number(percent) / 100));
        return `rgba(${BRAND_YELLOW_RGB}, ${alpha})`;
      })
      .replaceAll("oklch(0.65 0.22 28)", BRAND_YELLOW)
      .replaceAll("#f3893b", BRAND_YELLOW)
      .replaceAll("#F3893B", BRAND_YELLOW)
      .replaceAll("243, 137, 59", BRAND_YELLOW_RGB);

    if (corrected !== style) node.setAttribute("style", corrected);
  }

  if (node instanceof HTMLImageElement) {
    const src = node.getAttribute("src") || "";
    if (src.includes("/assets/onsite_logo.png") || src.includes("/assets/onsite_logo.svg")) {
      node.src = OFFICIAL_LOGO_SRC;
    }
  }
}

function applyToTree(root: ParentNode) {
  if (root instanceof HTMLElement) recolorElement(root);
  root.querySelectorAll<HTMLElement>("*").forEach(recolorElement);
}

export function applyOfficialOnsiteTheme() {
  document.documentElement.style.setProperty("--primary", BRAND_YELLOW);
  document.documentElement.style.setProperty("--ring", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange-rgb", BRAND_YELLOW_RGB);
  document.documentElement.style.setProperty("--onsite-navy", BRAND_NAVY);
  document.documentElement.style.setProperty("--onsite-charcoal", BRAND_CHARCOAL);
  document.documentElement.style.setProperty("--onsite-white", BRAND_WHITE);

  applyToTree(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((added) => {
        if (added instanceof HTMLElement) applyToTree(added);
      });
      if (mutation.type === "attributes" && mutation.target instanceof HTMLElement) {
        recolorElement(mutation.target);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "src"],
  });
}
