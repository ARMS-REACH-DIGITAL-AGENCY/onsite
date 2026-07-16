const LOGO_SRC = "/assets/onsite_logo.png?v=20260716";
const BRAND_ORANGE = "#f7941d";
const PHONE_HREF = "tel:+14806282588";
const PHONE_DISPLAY = "480-628-2588";
const LOADER_MS = 5600;

function ensureStyles() {
  if (document.getElementById("onsite-enhancement-styles")) return;
  const style = document.createElement("style");
  style.id = "ons