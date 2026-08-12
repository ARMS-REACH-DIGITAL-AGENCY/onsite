const OFFICIAL_LOGO_SRC = "/assets/onsite_logo_official.png?v=20260811-final4";
const BRAND_NAVY = "#002549";
const BRAND_YELLOW = "#EFC02E";
const BRAND_YELLOW_RGB = "239, 192, 46";
const PHONE_HREF = "tel:+16029053777";

function useOfficialLogo() {
  document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    const brandedClass = /onsite-(brand|footer|loader|mobile-drawer)-logo/.test(String(img.className));
    if (
      brandedClass ||
      src.includes("/assets/onsite_logo.png") ||
      src.includes("/assets/onsite_logo.svg") ||
      src.includes("/assets/onsite_logo_official.png")
    ) {
      if (src !== OFFICIAL_LOGO_SRC) img.src = OFFICIAL_LOGO_SRC;
      img.alt = "OnSite Fleet & Auto Care";
      img.decoding = "async";
    }
  });
}

function fixPhoneLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    if (link.getAttribute("href") !== PHONE_HREF) link.setAttribute("href", PHONE_HREF);
  });
}

function forceMobilePrimary() {
  document.querySelectorAll<HTMLElement>(".onsite-mobile-nav-primary").forEach((node) => {
    node.style.setProperty("background", BRAND_YELLOW, "important");
    node.style.setProperty("background-color", BRAND_YELLOW, "important");
    node.style.setProperty("border-color", BRAND_YELLOW, "important");
    node.style.setProperty("color", BRAND_NAVY, "important");
  });
}

function forceHeaderSurface() {
  const header = document.querySelector<HTMLElement>("header");
  if (!header) return;
  header.style.setProperty("background", BRAND_NAVY, "important");
  header.style.setProperty("background-color", BRAND_NAVY, "important");
  header.style.setProperty("opacity", "1", "important");
  header.style.setProperty("backdrop-filter", "none", "important");
  header.style.setProperty("-webkit-backdrop-filter", "none", "important");
  header.style.setProperty("border-bottom-color", "rgba(255,255,255,.10)", "important");
  header.style.setProperty("pointer-events", "auto", "important");
}

function recolorOrange(node: HTMLElement) {
  const classes = String(node.className || "");
  if (classes.includes("text-orange-")) node.style.setProperty("color", BRAND_YELLOW, "important");

  // Translucent orange utility surfaces are icon/badge backgrounds in this UI.
  // Keep solid orange/yellow CTA buttons intact; only these muted surfaces become navy.
  if (/\bbg-orange-\d+\/\d+\b/.test(classes)) {
    node.style.setProperty("background", BRAND_NAVY, "important");
    node.style.setProperty("background-color", BRAND_NAVY, "important");
  }

  if (classes.includes("border-orange-")) node.style.setProperty("border-color", BRAND_YELLOW, "important");

  const style = node.getAttribute("style");
  if (style) {
    const corrected = style
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

  if (node instanceof SVGElement) {
    const fill = node.getAttribute("fill");
    const stroke = node.getAttribute("stroke");
    if (fill && /#f3893b|rgb\(243\s*,\s*137\s*,\s*59\)/i.test(fill)) node.setAttribute("fill", BRAND_YELLOW);
    if (stroke && /#f3893b|rgb\(243\s*,\s*137\s*,\s*59\)/i.test(stroke)) node.setAttribute("stroke", BRAND_YELLOW);
  }
}

function applyBrandColor() {
  document.documentElement.style.setProperty("--primary", BRAND_YELLOW);
  document.documentElement.style.setProperty("--ring", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange", BRAND_YELLOW);
  document.documentElement.style.setProperty("--onsite-orange-rgb", BRAND_YELLOW_RGB);
  document.querySelectorAll<HTMLElement>("body *").forEach(recolorOrange);

  document.querySelectorAll<HTMLElement>("#onsite-top-unlock").forEach((node) => {
    node.style.setProperty("background", BRAND_NAVY, "important");
    node.style.setProperty("background-color", BRAND_NAVY, "important");
    node.style.setProperty("border-color", BRAND_YELLOW, "important");
    node.style.setProperty("color", BRAND_YELLOW, "important");
  });
}

function updateRangeVisual(range: HTMLInputElement) {
  const min = Number(range.min || 0);
  const max = Number(range.max || 100);
  const value = Number(range.value || min);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  range.style.setProperty(
    "background",
    `linear-gradient(to right, ${BRAND_YELLOW} 0%, ${BRAND_YELLOW} ${pct}%, rgba(255,255,255,.14) ${pct}%, rgba(255,255,255,.14) 100%)`,
    "important"
  );
}

function restoreInteractiveControls() {
  document.querySelectorAll<HTMLElement>("button, a, input, select, textarea").forEach((control) => {
    control.style.setProperty("pointer-events", "auto", "important");
  });

  document.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach((range) => {
    range.style.setProperty("pointer-events", "auto", "important");
    range.style.setProperty("touch-action", "pan-y", "important");
    range.style.setProperty("position", "relative", "important");
    range.style.setProperty("z-index", "2", "important");
    updateRangeVisual(range);
    if (range.dataset.onsiteRangeWired === "true") return;
    range.dataset.onsiteRangeWired = "true";
    range.addEventListener("input", () => updateRangeVisual(range));
    range.addEventListener("change", () => updateRangeVisual(range));
  });

  const overlay = document.getElementById("onsite-mobile-menu-overlay");
  if (overlay) {
    overlay.style.removeProperty("pointer-events");
    overlay.style.removeProperty("visibility");
    overlay.style.removeProperty("display");
    overlay.style.removeProperty("opacity");
  }

  const menuButton = document.getElementById("onsite-mobile-menu-button");
  if (menuButton) {
    menuButton.style.setProperty("pointer-events", "auto", "important");
    menuButton.style.setProperty("touch-action", "manipulation", "important");
    menuButton.style.setProperty("position", "relative", "important");
    menuButton.style.setProperty("z-index", "2147483001", "important");
  }
}

function findReactUnlockButton() {
  return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) => {
    if (button.id === "onsite-inline-unlock" || button.id === "onsite-top-unlock") return false;
    return /unlock\s+(my\s+)?full\s+roi\s+report|unlock\s+full\s+report/i.test(button.textContent || "");
  });
}

function openLeadGate() {
  const existingForm = Array.from(document.querySelectorAll<HTMLFormElement>("form")).find((form) =>
    /unlock my full roi report/i.test(form.textContent || "")
  );
  if (existingForm) {
    existingForm.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => existingForm.querySelector<HTMLInputElement>("input")?.focus(), 350);
    return;
  }

  const target = findReactUnlockButton();
  target?.click();
  window.setTimeout(() => {
    const form = Array.from(document.querySelectorAll<HTMLFormElement>("form")).find((candidate) =>
      /unlock my full roi report/i.test(candidate.textContent || "")
    );
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => form?.querySelector<HTMLInputElement>("input")?.focus(), 300);
  }, 120);
}

function installInlineUnlock() {
  const oldTop = document.getElementById("onsite-top-unlock");
  if (oldTop) oldTop.style.setProperty("display", "none", "important");

  const payrollLabel = Array.from(document.querySelectorAll<HTMLElement>("p,span,div")).find((node) =>
    node.textContent?.trim().toUpperCase() === "ANNUAL PAYROLL WASTED"
  );
  if (!payrollLabel) return;

  const payrollCard = payrollLabel.closest<HTMLElement>("div.rounded-xl");
  if (!payrollCard || !payrollCard.parentElement) return;

  let button = document.getElementById("onsite-inline-unlock") as HTMLButtonElement | null;
  if (!button) {
    button = document.createElement("button");
    button.id = "onsite-inline-unlock";
    button.type = "button";
    button.className = "onsite-inline-unlock";
    button.innerHTML = '<span aria-hidden="true">🔓</span><span>UNLOCK FULL ROI REPORT</span>';
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLeadGate();
    });
  }

  if (payrollCard.nextElementSibling !== button) {
    payrollCard.insertAdjacentElement("afterend", button);
  }
}

function runExecutionFixes() {
  forceHeaderSurface();
  useOfficialLogo();
  fixPhoneLinks();
  forceMobilePrimary();
  applyBrandColor();
  restoreInteractiveControls();
  installInlineUnlock();
}

export function applyExecutionFixes() {
  runExecutionFixes();

  let queued = false;
  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => mutation.addedNodes.length > 0) || queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      runExecutionFixes();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
