import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./productionPolish.css";
import "./footerAndDrawerFix.css";
import { installOnsiteEnhancements } from "./onsiteEnhancements";
import { applyExecutionFixes } from "./executionFixes";

const OFFICIAL_LOGO_SRC = "/assets/onsite_logo_official.png?v=20260811-final4";
const FLEET_REVIEW_CALENDAR_URL =
  "https://api.armsreachdigital.com/widget/bookings/pete-defleet-guy-personal-calendar-fceb7-oda";

createRoot(document.getElementById("root")!).render(<App />);

function installFleetReviewCalendarLink() {
  if (document.documentElement.dataset.onsiteFleetReviewLinkWired === "true") return;
  document.documentElement.dataset.onsiteFleetReviewLinkWired = "true";

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const control = target?.closest("button,a,[role='button']") as HTMLElement | null;
      if (!control) return;

      const label = (control.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      const isFleetReviewAction =
        /schedule\s+(?:a\s+)?20[-\s]?minute\s+meeting/.test(label) ||
        /20[-\s]?min(?:ute)?\b.*(?:fleet\s+)?review/.test(label);

      if (!isFleetReviewAction) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(FLEET_REVIEW_CALENDAR_URL, "_blank", "noopener,noreferrer");
    },
    true
  );
}

function installEnhancementsWithoutLegacyObserver() {
  const NativeMutationObserver = window.MutationObserver;

  class NoopMutationObserver {
    constructor(_callback: MutationCallback) {}
    observe() {}
    disconnect() {}
    takeRecords(): MutationRecord[] {
      return [];
    }
  }

  const windowWithObserver = window as unknown as { MutationObserver: typeof MutationObserver };
  windowWithObserver.MutationObserver = NoopMutationObserver as unknown as typeof MutationObserver;
  try {
    installOnsiteEnhancements();
  } finally {
    windowWithObserver.MutationObserver = NativeMutationObserver;
  }
}

function primeOfficialHeaderLogo() {
  const headerInner = document.querySelector("header > div") as HTMLElement | null;
  if (!headerInner) return;

  let lockup = document.getElementById("onsite-brand-lockup");
  if (!lockup) {
    lockup = document.createElement("div");
    lockup.id = "onsite-brand-lockup";
    const oldBrand = headerInner.firstElementChild;
    if (oldBrand) oldBrand.replaceWith(lockup);
    else headerInner.prepend(lockup);
  }

  let logo = lockup.querySelector<HTMLImageElement>("img");
  if (!logo) {
    logo = document.createElement("img");
    logo.className = "onsite-brand-logo";
    logo.alt = "OnSite Fleet & Auto Care";
    lockup.appendChild(logo);
  }

  logo.src = OFFICIAL_LOGO_SRC;
}

installFleetReviewCalendarLink();

window.requestAnimationFrame(() => {
  installEnhancementsWithoutLegacyObserver();
  primeOfficialHeaderLogo();

  document.getElementById("onsite-mobile-compatibility-css")?.remove();
  const mobileCss = document.createElement("link");
  mobileCss.id = "onsite-mobile-compatibility-css";
  mobileCss.rel = "stylesheet";
  mobileCss.href = "/mobileCompatibility.css?v=20260726-final4";
  document.head.appendChild(mobileCss);

  document.getElementById("onsite-corporate-theme-css")?.remove();
  const corporateTheme = document.createElement("link");
  corporateTheme.id = "onsite-corporate-theme-css";
  corporateTheme.rel = "stylesheet";
  corporateTheme.href = "/corporateTheme.css?v=20260811-final4";
  document.head.appendChild(corporateTheme);

  document.getElementById("onsite-execution-fixes-css")?.remove();
  const executionFixes = document.createElement("link");
  executionFixes.id = "onsite-execution-fixes-css";
  executionFixes.rel = "stylesheet";
  executionFixes.href = "/executionFixes.css?v=20260811-final4";
  document.head.appendChild(executionFixes);

  applyExecutionFixes();
});
