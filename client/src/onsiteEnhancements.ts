const NEW_LOGO = "/assets/onsite_logo.png";
const OLD_ACCENT = "oklch(0.65 0.22 28)";
const BRAND_ORANGE = "oklch(0.714 0.148 58)";

function money(n: number) {
  return Math.round(n);
}

function readSlider(labelText: string): number {
  const labels = Array.from(document.querySelectorAll("label"));
  const label = labels.find((node) => node.textContent?.trim() === labelText);
  const container = label?.closest(".animate-fade-in-up") ?? label?.parentElement?.parentElement;
  const input = container?.querySelector('input[type="text"]') as HTMLInputElement | null;
  const value = Number((input?.value || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

function installStyles() {
  if (document.getElementById("onsite-enhancement-styles")) return;
  const style = document.createElement("style");
  style.id = "onsite-enhancement-styles";
  style.textContent = `
    :root { --onsite-brand-orange: ${BRAND_ORANGE}; }
    .onsite-brand-logo { width: 184px !important; height: 52px !important; object-fit: contain !important; }
    .onsite-pete-strip { margin: 0 auto 22px; max-width: 1100px; border: 1px solid color-mix(in oklab, var(--onsite-brand-orange) 45%, transparent); border-radius: 18px; padding: 18px 20px; background: linear-gradient(135deg,color-mix(in oklab, var(--onsite-brand-orange) 16%, transparent),rgba(15,23,42,.72)); display:flex; align-items:center; gap:16px; box-shadow:0 18px 50px rgba(0,0,0,.22); }
    .onsite-pete-copy strong { display:block; color:white; font-size:1.15rem; letter-spacing:.02em; }
    .onsite-pete-copy span { color:rgba(255,255,255,.62); font-size:.9rem; }
    .onsite-truck { font-size:2.25rem; display:inline-block; animation:onsite-putter 1.1s ease-in-out infinite alternate; filter:drop-shadow(0 8px 14px rgba(0,0,0,.3)); }
    @keyframes onsite-putter { from { transform:translateX(0) translateY(0) rotate(-1deg); } to { transform:translateX(12px) translateY(-2px) rotate(1deg); } }
    .onsite-loader-overlay { position:fixed; inset:0; z-index:9999; background:rgba(4,10,24,.94); display:flex; align-items:center; justify-content:center; padding:24px; backdrop-filter:blur(10px); }
    .onsite-loader-card { width:min(520px,100%); border:1px solid color-mix(in oklab, var(--onsite-brand-orange) 55%, transparent); border-radius:24px; padding:30px; background:linear-gradient(160deg,rgba(20,32,55,.98),rgba(9,16,31,.98)); text-align:center; box-shadow:0 30px 90px rgba(0,0,0,.55); }
    .onsite-road { margin:22px 0 16px; height:58px; position:relative; overflow:hidden; border-bottom:3px solid rgba(255,255,255,.2); }
    .onsite-road .onsite-truck { position:absolute; left:-48px; bottom:5px; animation:onsite-drive 1.45s linear infinite; }
    @keyframes onsite-drive { from { left:-48px; } to { left:calc(100% + 12px); } }
    .onsite-loader-card h2 { color:white; font-size:1.7rem; font-weight:800; margin:0 0 8px; }
    .onsite-loader-card p { color:rgba(255,255,255,.58); margin:0; }
    .onsite-loader-tagline { margin-top:12px !important; color:var(--onsite-brand-orange) !important; font-weight:700; }
    @media (max-width:640px) { .onsite-brand-logo { width:142px !important; height:44px !important; } .onsite-pete-strip { align-items:flex-start; } }
  `;
  document.head.appendChild(style);
}

function applyBrandOrange() {
  document.documentElement.style.setProperty("--primary", BRAND_ORANGE);
  document.documentElement.style.setProperty("--destructive", BRAND_ORANGE);
  document.documentElement.style.setProperty("--ring", BRAND_ORANGE);
  document.documentElement.style.setProperty("--chart-1", BRAND_ORANGE);

  document.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const style = node.getAttribute("style");
    if (style?.includes(OLD_ACCENT)) node.setAttribute("style", style.split(OLD_ACCENT).join(BRAND_ORANGE));
  });

  document.querySelectorAll<HTMLElement>('[class*="orange-"]').forEach((node) => {
    if (node.className.includes("text-orange-")) node.style.color = BRAND_ORANGE;
    if (node.className.includes("bg-orange-")) node.style.backgroundColor = BRAND_ORANGE;
    if (node.className.includes("border-orange-")) node.style.borderColor = BRAND_ORANGE;
  });
}

function replaceBranding() {
  document.querySelectorAll('img[src*="logo-icon_0911ce9e"], img[src*="onsite_logo"]').forEach((node) => {
    const img = node as HTMLImageElement;
    img.src = NEW_LOGO;
    img.alt = "OnSite Fleet & Auto Care";
    img.classList.add("onsite-brand-logo");
    const iconWrap = img.parentElement;
    if (iconWrap) {
      iconWrap.className = "flex items-center";
      iconWrap.setAttribute("style", "width:auto;height:auto;background:transparent;border:0;");
    }
    const textBlock = iconWrap?.nextElementSibling as HTMLElement | null;
    if (textBlock?.textContent?.includes("Onsite Fleet")) textBlock.style.display = "none";
  });

  const headerInner = document.querySelector("header > div");
  if (headerInner) headerInner.classList.replace("h-16", "h-20");

  const heroCopy = Array.from(document.querySelectorAll("p")).find((p) => p.textContent?.includes("Five inputs. Sixty seconds."));
  if (heroCopy) heroCopy.textContent = "Fleet foresight starts OnSite. See what downtime is costing you—and how mobile preventive care helps keep your complete fleet on the road.";
}

function addPeteStrip() {
  if (document.getElementById("onsite-pete-strip")) return;
  const calculatorSection = Array.from(document.querySelectorAll("section")).find((section) => section.textContent?.includes("Your Fleet Inputs"));
  if (!calculatorSection) return;
  const strip = document.createElement("div");
  strip.id = "onsite-pete-strip";
  strip.className = "onsite-pete-strip";
  strip.innerHTML = `<div class="onsite-truck">🚚</div><div class="onsite-pete-copy"><strong>Meet Pete — your Fleet Savings Advisor.</strong><span>Always have a complete fleet with Pete. OnSite service today. Fewer surprises tomorrow.</span></div>`;
  calculatorSection.insertBefore(strip, calculatorSection.firstChild);
}

function showLoader() {
  const overlay = document.createElement("div");
  overlay.className = "onsite-loader-overlay";
  overlay.innerHTML = `<div class="onsite-loader-card"><img src="${NEW_LOGO}" alt="OnSite Fleet & Auto Care" style="width:220px;max-width:80%;margin:auto"/><div class="onsite-road"><div class="onsite-truck">🚚</div></div><h2>Pete is building your Fleet Savings Report...</h2><p>Checking downtime, service costs, and hidden savings.</p><p class="onsite-loader-tagline">Always have a complete fleet with Pete.</p></div>`;
  document.body.appendChild(overlay);
  window.setTimeout(() => overlay.remove(), 1500);
}

async function submitLead(form: HTMLFormElement) {
  const textInputs = Array.from(form.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
  const email = form.querySelector('input[type="email"]') as HTMLInputElement | null;
  const phone = form.querySelector('input[type="tel"]') as HTMLInputElement | null;
  if (!email?.value || !phone?.value || textInputs.length < 2) return;

  const numVehicles = readSlider("Number of Vehicles");
  const hourlyEmployeeCost = readSlider("Loaded Hourly Employee Cost");
  const serviceVisitsPerYear = readSlider("Service Visits Per Vehicle / Year");
  const hoursLostPerVisit = readSlider("Hours Lost Per Service Visit");
  const revenuePerVehicleHour = readSlider("Revenue Generated Per Vehicle Hour");
  const currentShopPricePerVisit = readSlider("Current Shop Price Per Visit");
  const annualHoursLost = numVehicles * serviceVisitsPerYear * hoursLostPerVisit;
  const annualPayrollWasted = annualHoursLost * hourlyEmployeeCost;
  const estimatedLostRevenue = annualHoursLost * revenuePerVehicleHour;
  const totalDowntimeCost = annualPayrollWasted + estimatedLostRevenue;
  const totalVisits = numVehicles * serviceVisitsPerYear;
  const onsiteHoursLost = totalVisits * 0.5;
  const onsiteServiceCost = totalVisits * 134.99;
  const onsiteTotalCost = onsiteHoursLost * hourlyEmployeeCost + onsiteHoursLost * revenuePerVehicleHour + onsiteServiceCost;
  const currentAnnualServiceCost = totalVisits * currentShopPricePerVisit;
  const netAnnualSavings = totalDowntimeCost + currentAnnualServiceCost - onsiteTotalCost;

  showLoader();
  await fetch("/api/fleet-lead", {
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
      calculator: {
        numVehicles,
        hourlyEmployeeCost,
        serviceVisitsPerYear,
        hoursLostPerVisit,
        revenuePerVehicleHour,
        currentShopPricePerVisit,
        annualHoursLost: money(annualHoursLost),
        annualPayrollWasted: money(annualPayrollWasted),
        estimatedLostRevenue: money(estimatedLostRevenue),
        totalDowntimeCost: money(totalDowntimeCost),
        onsiteHoursLost: money(onsiteHoursLost),
        onsiteTotalCost: money(onsiteTotalCost),
        netAnnualSavings: money(netAnnualSavings),
        hoursRecovered: money(annualHoursLost - onsiteHoursLost),
      },
    }),
  }).catch(() => undefined);
}

export function installOnsiteEnhancements() {
  installStyles();
  const refresh = () => { applyBrandOrange(); replaceBranding(); addPeteStrip(); };
  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form?.textContent?.includes("Unlock My Full ROI Report")) void submitLead(form);
  }, true);
}
