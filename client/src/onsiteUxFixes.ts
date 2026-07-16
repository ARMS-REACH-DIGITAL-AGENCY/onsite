const PHONE_HREF = "tel:+14806282588";
const REVIEW_CALENDAR_URL = (import.meta.env.VITE_PETE_REVIEW_CALENDAR_URL || "").trim();
const MAINTENANCE_CALENDAR_URL = (import.meta.env.VITE_FLEET_MAINTENANCE_CALENDAR_URL || "").trim();

let drawerOpen = false;

function installFixStyles() {
  if (document.getElementById("onsite-ux-fixes-css")) return;
  const link = document.createElement("link");
  link.id = "onsite-ux-fixes-css