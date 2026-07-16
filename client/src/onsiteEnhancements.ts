const LOGO_SRC = "/assets/onsite_logo.png?v=20260716d";
const PETE_SRC = "/assets/pete.png?v=20260716d";
const BRAND_ORANGE = "#f3893b";
const BRAND_ORANGE_RGB = "243, 137, 59";
const PHONE_HREF = "tel:+14806282588";
const PHONE_DISPLAY = "480-628-2588";
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
  link.href = "/onsiteEnhancements.css?v=20260716d";
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
  img.addEventListener("error", () => img.remove(), { once: true });
  return