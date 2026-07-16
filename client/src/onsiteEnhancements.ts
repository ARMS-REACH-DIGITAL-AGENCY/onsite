const LOGO_SRC = "/assets/onsite_logo.png?v=20260716f";
const PETE_SRC = "/assets/pete.png?v=20260716f";
const BRAND_ORANGE = "#f3893b";
const BRAND_ORANGE_RGB = "243, 137, 59";
const PHONE_HREF = "tel:+14806282588";
const LOADER_MS = 5600;

const REVIEW_CALENDAR_URL = (import.meta.env.VITE_PETE_REVIEW_CALENDAR_URL || "").trim();
const MAINTENANCE_CALENDAR_URL = (import.meta.env.VITE_FLEET_MAINTENANCE_CALENDAR_URL || "").trim();

const submittedForms = new WeakSet<HTMLFormElement>();
let pendingIntent = "fleet-calculator";

function installStylesheet() {
  if (document.getElementById("onsite-enhancement-css")) return;
  const link = document.createElement("link");
  link.id = "onsite-enhancement-css";
  link.rel = "stylesheet";
  link.href = "/onsiteEnhancements.css?v=20260716f";
  document.head.appendChild(link);
}

function logoImage(className: string) {
  const img = document.createElement("img");
  img.src = LOGO_SRC;
  img.alt = "OnSite Fleet & Auto Care";
  img.className = className;
  return img;
}

function peteImage(className: string) {
  const img = document.createElement("img");
  img.src = PETE_SRC;
  img.alt = "Pete DeFleet Guy";
  img.className = className;
  return img;
}

function replaceHeaderBranding() {
  const headerInner = document.querySelector("header > div") as HTMLElement | null;
  if (!headerInner) return;
  headerInner.classList.remove("h-16");
  headerInner.classList.add("h-20");

  let lockup = document.getElementById("onsite-brand-lockup");
  if (!lockup) {
    lockup = document.createElement("div");
    lockup.id = "onsite-brand-lockup";
    lockup.appendChild(logoImage("onsite-brand-logo"));
    const oldBrand = headerInner.firstElementChild;
    if (oldBrand) oldBrand.replaceWith(lockup);
    else headerInner.prepend(lockup);
  }

  const heroCopy = Array.from(document.querySelectorAll("p")).find((p) =>
    p.textContent?.includes("Five inputs. Sixty seconds.")
  );
  if (heroCopy) {
    heroCopy.textContent =
      "Fleet foresight starts OnSite. See what downtime is costing you—and how mobile preventive care helps keep your complete fleet on the road.";
  }
}

function replaceFooterBranding() {
  const footer = document.querySelector("footer");
  if (!footer) return;
  const footerInner = footer.querySelector("div");
  if (!footerInner) return;

  if (!footer.querySelector(".onsite-footer-logo")) {
    const firstBlock = footerInner.firstElementChild as HTMLElement | null;
    const replacement = document.createElement("div");
    replacement.className = "flex items-center";
    replacement.appendChild(logoImage("onsite-footer-logo"));
    if (firstBlock) firstBlock.replaceWith(replacement);
    else footerInner.prepend(replacement);
  }

  const copyright = Array.from(footer.querySelectorAll("p")).find((p) =>
    p.textContent?.includes("All rights reserved")
  );
  if (copyright) {
    copyright.textContent = `© ${new Date().getFullYear()} ARMS REACH Digital Agency. All rights reserved.`;
  }
}

function alphaFromClass(classes: string, prefix: "bg" | "border") {
  const match = classes.match(new RegExp(`${prefix}-orange-\\d+\\/(\\d+)`));
  if (!match) return null;
  const percent = Number(match[1]);
  return Number.isFinite(percent) ? Math.max(0, Math.min(1, percent / 100)) : null;
}

function applyBrandOrange() {
  document.documentElement.style.setProperty("--primary", BRAND_ORANGE);
  document.documentElement.style.setProperty("--ring", BRAND_ORANGE);

  document.querySelectorAll<HTMLElement>('[class*="orange-"]').forEach((node) => {
    const classes = String(node.className);
    if (classes.includes("text-orange-")) node.style.color = BRAND_ORANGE;
    if (classes.includes("bg-orange-")) {
      const alpha = alphaFromClass(classes, "bg");
      node.style.backgroundColor = alpha === null ? BRAND_ORANGE : `rgba(${BRAND_ORANGE_RGB}, ${alpha})`;
    }
    if (classes.includes("border-orange-")) {
      const alpha = alphaFromClass(classes, "border");
      node.style.borderColor = alpha === null ? BRAND_ORANGE : `rgba(${BRAND_ORANGE_RGB}, ${alpha})`;
    }
  });

  document.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
    const value = node.getAttribute("style");
    if (!value?.includes("oklch(0.65 0.22 28")) return;
    const corrected = value
      .replace(/oklch\(0\.65 0\.22 28 \/ (\d+)%\)/g, (_match, percent) => {
        const alpha = Math.max(0, Math.min(1, Number(percent) / 100));
        return `rgba(${BRAND_ORANGE_RGB}, ${alpha})`;
      })
      .replaceAll("oklch(0.65 0.22 28)", BRAND_ORANGE);
    node.setAttribute("style", corrected);
  });
}

function replaceVisibleLabel(control: HTMLElement, label: string) {
  const icon = control.querySelector("svg")?.cloneNode(true);
  control.replaceChildren();
  if (icon) control.appendChild(icon);
  control.append(document.createTextNode(label));
}

function fixPhoneLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    link.href = PHONE_HREF;
    if (link.dataset.onsitePhoneLabel !== "true") {
      replaceVisibleLabel(link, "CALL NOW");
      link.dataset.onsitePhoneLabel = "true";
    }
  });
}

function standardizeReviewCopy() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parent = node.parentElement;
    if (parent && !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
      const value = node.nodeValue || "";
      const next = value
        .replace(/15[-\s]?min(?:ute)?s?/gi, (match) =>
          /minute/i.test(match) ? "20-minute" : "20-min"
        )
        .replace(/free\s+20-min\s+fleet\s+downtime\s+review/gi, "Free 20-Min Fleet Review");
      if (next !== value) node.nodeValue = next;
    }
    node = walker.nextNode();
  }
}

function ensureSectionAnchors() {
  const calculatorCard = Array.from(document.querySelectorAll<HTMLElement>("div")).find(
    (node) => node.textContent?.includes("Your Fleet Numbers") && node.className.includes("rounded-2xl")
  );
  const calculatorSection = calculatorCard?.closest("section") as HTMLElement | null;
  if (calculatorSection) calculatorSection.id = "calculator";

  const howHeading = Array.from(document.querySelectorAll<HTMLElement>("h1,h2,h3")).find((node) =>
    /how onsite fleet eliminates downtime/i.test(node.textContent || "")
  );
  const howSection = howHeading?.closest("section") as HTMLElement | null;
  if (howSection) howSection.id = "how-onsite-works";
}

function addPeteStrip() {
  if (document.getElementById("onsite-pete-strip")) return;
  const card = Array.from(document.querySelectorAll<HTMLElement>("div")).find(
    (node) => node.textContent?.includes("Your Fleet Numbers") && node.className.includes("rounded-2xl")
  );
  if (!card) return;

  const strip = document.createElement("div");
  strip.id = "onsite-pete-strip";
  strip.className = "onsite-pete-strip";

  const copy = document.createElement("div");
  copy.className = "onsite-pete-copy";
  const title = document.createElement("strong");
  title.textContent = "Meet Pete DeFleet Guy — your Fleet Savings Advisor.";
  const subtitle = document.createElement("span");
  subtitle.textContent = "Always have a complete fleet with Pete. OnSite service today. Fewer surprises tomorrow.";
  copy.append(title, subtitle);

  strip.append(peteImage("onsite-pete-avatar"), copy);
  card.insertBefore(strip, card.firstChild);
}

function findUnlockButton() {
  return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((button) =>
    /unlock full roi report/i.test(button.textContent || "")
  );
}

function openLeadForm(intent: string) {
  pendingIntent = intent;
  const button = findUnlockButton();
  if (!button) return;

  button.click();
  window.setTimeout(() => {
    const form = Array.from(document.querySelectorAll<HTMLFormElement>("form")).find((candidate) =>
      candidate.textContent?.includes("Unlock My Full ROI Report")
    );
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 100);
}

function installTopUnlockButton() {
  const costTitle = Array.from(document.querySelectorAll<HTMLElement>("h2,h3,p,div")).find((node) =>
    node.textContent?.trim() === "Cost Breakdown"
  );
  if (!costTitle) return;

  const headerRow = costTitle.closest("div.flex") as HTMLElement | null;
  if (!headerRow) return;
  if (headerRow.querySelector("#onsite-top-unlock")) return;

  const partial = Array.from(headerRow.querySelectorAll<HTMLElement>("button,span,div")).find((node) =>
    node.textContent?.trim().toLowerCase() === "partial"
  );

  const button = document.createElement("button");
  button.id = "onsite-top-unlock";
  button.type = "button";
  button.className = "onsite-top-unlock";
  button.textContent = "Unlock Full Report";
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openLeadForm("unlock-full-report");
  });

  if (partial) partial.replaceWith(button);
  else headerRow.appendChild(button);
}

function wireAllUnlockButtons() {
  document.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
    if (!/unlock full report|unlock full roi report/i.test(button.textContent || "")) return;
    if (button.id === "onsite-top-unlock") return;
    if (button.dataset.onsiteWired === "true") return;
    button.dataset.onsiteWired = "true";
    button.addEventListener("click", () => {
      pendingIntent = "unlock-full-report";
    });
  });
}

function launchBooking(mode: "review" | "maintenance") {
  const url = mode === "review" ? REVIEW_CALENDAR_URL : MAINTENANCE_CALENDAR_URL;
  pendingIntent = mode === "review" ? "book-20-minute-review" : "schedule-maintenance";
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  openLeadForm(pendingIntent);
}

function createBookingButton(label: string, mode: "review" | "maintenance") {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    mode === "review"
      ? "onsite-booking-button onsite-booking-primary"
      : "onsite-booking-button onsite-booking-secondary";
  button.textContent = label;
  button.addEventListener("click", () => launchBooking(mode));
  return button;
}

function installBookingActions() {
  if (document.getElementById("onsite-booking-actions")) return;
  const finalCta = Array.from(document.querySelectorAll<HTMLElement>("section")).find((section) =>
    section.textContent?.includes("Can't Make Money")
  );
  if (!finalCta) return;

  const existingButtons = finalCta.querySelector(".flex.flex-col.sm\\:flex-row") as HTMLElement | null;
  if (!existingButtons) return;

  existingButtons.innerHTML = "";
  existingButtons.id = "onsite-booking-actions";
  existingButtons.append(
    createBookingButton("Book My Free 20-Min Fleet Review", "review"),
    createBookingButton("Schedule Fleet Maintenance Today", "maintenance")
  );
}

function scrollToAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function installMobileMenu() {
  const headerInner = document.querySelector("header > div") as HTMLElement | null;
  if (!headerInner || document.getElementById("onsite-mobile-menu-button")) return;

  const menuButton = document.createElement("button");
  menuButton.id = "onsite-mobile-menu-button";
  menuButton.type = "button";
  menuButton.className = "onsite-mobile-menu-button";
  menuButton.setAttribute("aria-label", "Open navigation menu");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = '<span></span><span></span><span></span>';

  const overlay = document.createElement("div");
  overlay.id = "onsite-mobile-menu-overlay";
  overlay.className = "onsite-mobile-menu-overlay";
  overlay.setAttribute("aria-hidden", "true");

  const drawer = document.createElement("aside");
  drawer.className = "onsite-mobile-drawer";
  drawer.setAttribute("aria-label", "Mobile navigation");

  const drawerHeader = document.createElement("div");
  drawerHeader.className = "onsite-mobile-drawer-header";
  drawerHeader.appendChild(logoImage("onsite-mobile-drawer-logo"));

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "onsite-mobile-close";
  closeButton.setAttribute("aria-label", "Close navigation menu");
  closeButton.textContent = "×";
  drawerHeader.appendChild(closeButton);

  const nav = document.createElement("nav");
  nav.className = "onsite-mobile-nav";

  const callLink = document.createElement("a");
  callLink.href = PHONE_HREF;
  callLink.className = "onsite-mobile-nav-item onsite-mobile-nav-primary";
  callLink.textContent = "CALL NOW";

  const createNavButton = (label: string, action: () => void, className = "") => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `onsite-mobile-nav-item ${className}`.trim();
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  };

  const liveCalculator = createNavButton("Live Calculator", () => scrollToAnchor("calculator"));
  const review = createNavButton("Book Free 20-Min Review", () => launchBooking("review"));
  const service = createNavButton("Schedule Fleet Maintenance", () => launchBooking("maintenance"));
  const howItWorks = createNavButton("How OnSite Eliminates Downtime", () => scrollToAnchor("how-onsite-works"));

  nav.append(callLink, liveCalculator, review, service, howItWorks);
  drawer.append(drawerHeader, nav);
  overlay.appendChild(drawer);
  document.body.appendChild(overlay);
  headerInner.appendChild(menuButton);

  const closeMenu = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("onsite-menu-open");
  };

  const openMenu = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("onsite-menu-open");
  };

  menuButton.addEventListener("click", () => {
    if (overlay.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  closeButton.addEventListener("click", closeMenu);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeMenu();
  });
  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a,button")) window.setTimeout(closeMenu, 50);
  });
}

function createTruck() {
  const truck = document.createElement("div");
  truck.className = "onsite-truck";
  truck.innerHTML =
    '<div class="body"></div><div class="cab"></div><div class="window"></div><div class="line"></div><div class="wheel one"></div><div class="wheel two"></div><div class="label">ONSITE</div>';
  return truck;
}

function showLoader() {
  if (document.querySelector(".onsite-loader-overlay")) return;
  (document.activeElement as HTMLElement | null)?.blur?.();
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className = "onsite-loader-overlay";
  const card = document.createElement("div");
  card.className = "onsite-loader-card";
  card.appendChild(logoImage("onsite-loader-logo"));

  const stage = document.createElement("div");
  stage.className = "onsite-loader-stage";
  const road = document.createElement("div");
  road.className = "onsite-road";
  road.appendChild(createTruck());
  stage.append(peteImage("onsite-pete-large"), road);

  const heading = document.createElement("h2");
  heading.textContent = "Pete is crunching your fleet numbers...";
  const status = document.createElement("p");
  status.className = "onsite-loader-status";
  status.textContent = "Reviewing your downtime exposure.";
  const tagline = document.createElement("p");
  tagline.className = "onsite-loader-tagline";
  tagline.textContent = "Always have a complete fleet with Pete.";
  const progress = document.createElement("div");
  progress.className = "onsite-progress";
  progress.appendChild(document.createElement("span"));

  card.append(stage, heading, status, tagline, progress);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const messages = [
    "Reviewing your downtime exposure.",
    "Comparing your current service costs.",
    "Calculating hours Pete can help recover.",
    "Looking ahead for preventable downtime.",
    "Building your personalized Fleet Savings Report."
  ];
  let index = 0;
  const timer = window.setInterval(() => {
    index = Math.min(index + 1, messages.length - 1);
    status.style.opacity = "0";
    window.setTimeout(() => {
      status.textContent = messages[index];
      status.style.opacity = "1";
    }, 150);
  }, 1050);

  window.setTimeout(() => {
    window.clearInterval(timer);
    overlay.style.opacity = "0";
    window.setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 360);
  }, LOADER_MS);
}

function submitLead(form: HTMLFormElement) {
  if (submittedForms.has(form)) return;
  submittedForms.add(form);
  showLoader();

  const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
  const textInputs = inputs.filter((input) => input.type === "text");
  const email = inputs.find((input) => input.type === "email");
  const phone = inputs.find((input) => input.type === "tel");
  if (!email?.value || !phone?.value || textInputs.length < 2) return;

  void fetch("/api/fleet-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      name: textInputs[0].value.trim(),
      company: textInputs[1].value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      source: "OnSite Fleet Calculator",
      pageUrl: window.location.href,
      intent: pendingIntent
    })
  }).catch(() => undefined);
}

export function installOnsiteEnhancements() {
  installStylesheet();
  let scheduled = false;
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      replaceHeaderBranding();
      replaceFooterBranding();
      applyBrandOrange();
      fixPhoneLinks();
      standardizeReviewCopy();
      ensureSectionAnchors();
      addPeteStrip();
      installTopUnlockButton();
      wireAllUnlockButtons();
      installBookingActions();
      installMobileMenu();
    });
  };

  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target as HTMLFormElement;
      if (form?.textContent?.includes("Unlock My Full ROI Report")) submitLead(form);
    },
    true
  );
}
