import { PETE_SRC } from "./peteAsset";

const LOGO_SRC = "/assets/onsite_logo.png?v=20260716c";
const BRAND_ORANGE = "#f3893b";
const BRAND_ORANGE_RGB = "243, 137, 59";
const PHONE_HREF = "tel:+14806282588";
const PHONE_DISPLAY = "480-628-2588";
const LOADER_MS = 5600;

const submittedForms = new WeakSet<HTMLFormElement>();

function installStylesheet() {
  if (document.getElementById("onsite-enhancement-css")) return;
  const link = document.createElement("link");
  link.id = "onsite-enhancement-css";
  link.rel = "stylesheet";
  link.href = "/onsiteEnhancements.css?v=20260716c";
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

  const existingLogo = footer.querySelector(".onsite-footer-logo");
  if (existingLogo) return;

  const firstBlock = footerInner.firstElementChild as HTMLElement | null;
  const replacement = document.createElement("div");
  replacement.className = "flex items-center";
  replacement.appendChild(logoImage("onsite-footer-logo"));
  if (firstBlock) firstBlock.replaceWith(replacement);
  else footerInner.prepend(replacement);
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

    if (classes.includes("text-orange-")) {
      node.style.color = BRAND_ORANGE;
    }

    if (classes.includes("bg-orange-")) {
      const alpha = alphaFromClass(classes, "bg");
      node.style.backgroundColor =
        alpha === null ? BRAND_ORANGE : `rgba(${BRAND_ORANGE_RGB}, ${alpha})`;
    }

    if (classes.includes("border-orange-")) {
      const alpha = alphaFromClass(classes, "border");
      node.style.borderColor =
        alpha === null ? BRAND_ORANGE : `rgba(${BRAND_ORANGE_RGB}, ${alpha})`;
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

function fixPhoneLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    link.href = PHONE_HREF;
    const text = link.textContent || "";
    if (/call us free/i.test(text) || /or call us now/i.test(text)) {
      link.textContent = `Call ${PHONE_DISPLAY}`;
    }
  });
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
  subtitle.textContent =
    "Always have a complete fleet with Pete. OnSite service today. Fewer surprises tomorrow.";
  copy.append(title, subtitle);

  strip.append(peteImage("onsite-pete-avatar"), copy);
  card.insertBefore(strip, card.firstChild);
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
      document.getElementById("results-panel")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
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
      pageUrl: window.location.href
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
      addPeteStrip();
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
