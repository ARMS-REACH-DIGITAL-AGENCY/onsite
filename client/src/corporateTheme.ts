const BRAND_NAVY = "#002549";
const BRAND_YELLOW = "#EFC02E";
const BRAND_YELLOW_RGB = "239, 192, 46";
const BRAND_CHARCOAL = "#1A1A1A";
const BRAND_WHITE = "#FFFFFF";
const OFFICIAL_LOGO_SRC = "/assets/onsite_logo_official.png?v=20260811-official1";

let refreshQueued = false;

function alphaFromClass(classes: string, prefix: "bg" | "border") {
  const match = classes.match(new RegExp(`${prefix}-orange-\\d+\\/(\\d+)`));
  if (!match) return null;
  const percent = Number(match[1]);
  return Number.isFinite(percent) ? Math.max(0, Math.min(1, percent / 100)) : null;
}

function correctedInlineStyle(style: string) {
  return style
    .replace(/oklch\(0\.65 0\.22 28 \/ (\d+)%\)/g, (_match, percent) => {
      const alpha = Math.max(0, Math.min(1, Number(percent) / 100));
      return `rgba(${BRAND_YELLOW_RGB}, ${alpha})`;
    })
    .replaceAll("oklch(0.65 0.22 28)", BRAND_YELLOW)
    .replaceAll("#f3893b", BRAND_YELLOW)
    .replaceAll("#F3893B", BRAND_YELLOW)
    .replaceAll("243, 137, 59", BRAND_YELLOW_RGB);
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
    const corrected = correctedInlineStyle(style);
    if (corrected !== style) node.setAttribute("style", corrected);
  }

  if (node instanceof HTMLImageElement) {
    const src = node.getAttribute("src") || "";
    if (
      src.includes("/assets/onsite_logo.png") ||
      src.includes("/assets/onsite_logo.svg") ||
      src.includes("/assets/onsite_logo_official.png")
    ) {
      if (node.getAttribute("src") !== OFFICIAL_LOGO_SRC) node.src = OFFICIAL_LOGO_SRC;
    }
  }
}

function applyToTree(root: ParentNode) {
  if (root instanceof HTMLElement) recolorElement(root);
  root.querySelectorAll<HTMLElement>("*").forEach(recolorElement);
}

function openLeadGateFromInlineCta() {
  const trigger = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
    if (button.id === "onsite-inline-unlock" || button.id === "onsite-top-unlock") return false;
    return /unlock full roi report/i.test(button.textContent || "");
  });

  if (!trigger) return;
  trigger.click();

  window.setTimeout(() => {
    const form = Array.from(document.querySelectorAll<HTMLFormElement>("form")).find((candidate) =>
      candidate.textContent?.includes("Unlock My Full ROI Report")
    );
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 120);
}

function installInlineUnlockCta() {
  const existing = document.getElementById("onsite-inline-unlock");
  if (existing?.isConnected) return;

  const payrollLabel = Array.from(document.querySelectorAll<HTMLElement>("p")).find(
    (node) => node.textContent?.trim().toLowerCase() === "annual payroll wasted"
  );
  if (!payrollLabel) return;

  const payrollCard = payrollLabel.closest("div.rounded-xl") as HTMLElement | null;
  if (!payrollCard || !payrollCard.parentElement) return;

  const button = document.createElement("button");
  button.id = "onsite-inline-unlock";
  button.type = "button";
  button.textContent = "UNLOCK FULL ROI REPORT";
  button.setAttribute("aria-label", "Unlock full ROI report and enter contact information");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLeadGateFromInlineCta();
  });

  payrollCard.insertAdjacentElement("afterend", button);
}

function enforceOfficialLogo() {
  document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (src.includes("onsite_logo")) img.src = OFFICIAL_LOGO_SRC;
  });
}

function applyThemeNow() {
  document.documentElement.style.setProperty("--primary", BRAND_YELLOW);
  document.documentElement.style.setProperty("--ring", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange-rgb", BRAND_YELLOW_RGB);
  document.documentElement.style.setProperty("--onsite-navy", BRAND_NAVY);
  document.documentElement.style.setProperty("--onsite-charcoal", BRAND_CHARCOAL);
  document.documentElement.style.setProperty("--onsite-white", BRAND_WHITE);

  applyToTree(document.body);
  enforceOfficialLogo();
  installInlineUnlockCta();
}

function queueThemeRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      refreshQueued = false;
      applyThemeNow();
    });
  });
}

export function applyOfficialOnsiteTheme() {
  applyThemeNow();

  // The legacy enhancement layer schedules its own paint on the next animation frame.
  // Re-apply once after that paint so the official brand wins without observing every
  // style/class mutation (which previously caused a mutation feedback loop and broke controls).
  queueThemeRefresh();

  const observer = new MutationObserver((mutations) => {
    const hasAddedContent = mutations.some((mutation) => mutation.addedNodes.length > 0);
    if (hasAddedContent) queueThemeRefresh();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // React rewrites the slider track's inline gradient on every input event. Recolor only
  // the active range after React finishes the state update; do not observe attributes.
  document.addEventListener(
    "input",
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== "range") return;
      window.requestAnimationFrame(() => recolorElement(target));
    },
    true
  );
}
