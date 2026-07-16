const OLD_ACCENT = "oklch(0.65 0.22 28)";
const BRAND_ORANGE = "oklch(0.714 0.148 58)";
const PHONE_HREF = "tel:+14806282588";
const PHONE_DISPLAY = "480-628-2588";
const LOADER_MIN_MS = 5600;

function money(n: number) {
  return Math.round(n);
}

function brandLogoSvg(className = "") {
  return `<svg class="${className}" viewBox="0 0 420 170" role="img" aria-label="OnSite Fleet and Auto Care logo">
    <defs>
      <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#000814" flood-opacity=".55"/>
      </filter>
      <linearGradient id="logoOrange" x1="0" x2="1">
        <stop offset="0" stop-color="#f27a12"/>
        <stop offset=".55" stop-color="#ff9b24"/>
        <stop offset="1" stop-color="#e76a00"/>
      </linearGradient>
    </defs>
    <g filter="url(#logoShadow)">
      <text x="210" y="82" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="86" font-style="italic" fill="#ffffff" stroke="#12366f" stroke-width="10" paint-order="stroke">ONSITE</text>
      <path d="M40 104 C130 78 285 79 380 105 C290 100 135 100 40 122 Z" fill="url(#logoOrange)" stroke="#12366f" stroke-width="6"/>
      <text x="210" y="145" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="31" fill="#ff9420" stroke="#12366f" stroke-width="7" paint-order="stroke">FLEET &amp; AUTO CARE</text>
    </g>
  </svg>`;
}

function peteSvg(className = "") {
  return `<svg class="${className}" viewBox="0 0 220 410" role="img" aria-label="Pete DeFleet Guy">
    <defs>
      <linearGradient id="peteShirt" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#173d76"/><stop offset="1" stop-color="#081a35"/></linearGradient>
      <linearGradient id="petePants" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#17345f"/><stop offset="1" stop-color="#0a1830"/></linearGradient>
      <filter id="peteShadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity=".45"/></filter>
    </defs>
    <g filter="url(#peteShadow)">
      <ellipse cx="110" cy="392" rx="72" ry="12" fill="#000" opacity=".28"/>
      <path d="M76 235 L101 235 L98 356 L62 356 Z" fill="url(#petePants)"/>
      <path d="M119 235 L145 235 L160 356 L125 356 Z" fill="url(#petePants)"/>
      <path d="M59 351 Q83 345 103 359 L101 380 Q73 389 49 376 Z" fill="#07101e" stroke="#ffffff" stroke-opacity=".28" stroke-width="3"/>
      <path d="M122 356 Q146 345 168 360 L171 378 Q148 389 120 380 Z" fill="#07101e" stroke="#ffffff" stroke-opacity=".28" stroke-width="3"/>
      <path d="M55 126 Q110 98 165 128 L154 260 Q110 282 64 258 Z" fill="url(#peteShirt)" stroke="#284d83" stroke-width="4"/>
      <path d="M91 116 L110 139 L129 116" fill="none" stroke="#d8e6f8" stroke-width="5" stroke-linecap="round"/>
      <rect x="114" y="153" width="43" height="25" rx="5" fill="#ffffff" opacity=".96"/>
      <text x="135.5" y="166" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="8" fill="#12366f">ONSITE</text>
      <path d="M120 170 H151" stroke="#f7941d" stroke-width="4" stroke-linecap="round"/>
      <path d="M61 143 Q35 170 43 218 Q49 237 65 221 L78 166 Z" fill="#e6a06f" stroke="#8a4c2e" stroke-width="3"/>
      <path d="M159 143 Q188 170 176 222 Q167 239 153 219 L145 166 Z" fill="#e6a06f" stroke="#8a4c2e" stroke-width="3"/>
      <path d="M59 202 L155 202 L171 268 Q112 286 46 267 Z" fill="#5f6875" stroke="#d5dde7" stroke-width="4"/>
      <path d="M49 210 H157 L151 260 H58 Z" fill="#7b8490"/>
      <rect x="84" y="220" width="47" height="28" rx="5" fill="#0d2d60"/>
      <text x="107.5" y="235" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="10" fill="#ffffff">ONSITE</text>
      <path d="M91 241 H125" stroke="#f7941d" stroke-width="5" stroke-linecap="round"/>
      <path d="M57 220 Q40 234 52 249 Q64 256 75 240" fill="#e6a06f" stroke="#8a4c2e" stroke-width="3"/>
      <path d="M158 220 Q177 233 166 249 Q153 257 143 240" fill="#e6a06f" stroke="#8a4c2e" stroke-width="3"/>
      <ellipse cx="110" cy="82" rx="52" ry="58" fill="#e8a171" stroke="#8a4c2e" stroke-width="4"/>
      <path d="M60 76 Q59 24 112 20 Q161 21 164 73 Q149 48 127 44 Q98 47 74 69 Z" fill="#111820"/>
      <path d="M73 45 Q96 18 131 26 Q145 30 158 50 Q136 36 118 36 Q94 37 73 57 Z" fill="#2b313a"/>
      <path d="M73 57 Q91 42 112 42" stroke="#bfc3c9" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      <ellipse cx="90" cy="82" rx="9" ry="12" fill="#ffffff"/>
      <ellipse cx="132" cy="82" rx="9" ry="12" fill="#ffffff"/>
      <circle cx="91" cy="84" r="5" fill="#3b2416"/><circle cx="133" cy="84" r="5" fill="#3b2416"/>
      <path d="M82 69 Q91 63 101 69" fill="none" stroke="#2c1a12" stroke-width="5" stroke-linecap="round"/>
      <path d="M121 69 Q132 62 142 69" fill="none" stroke="#2c1a12" stroke-width="5" stroke-linecap="round"/>
      <path d="M110 85 Q103 103 112 104" fill="none" stroke="#a75d3b" stroke-width="4" stroke-linecap="round"/>
      <path d="M84 111 Q110 135 139 109 Q127 137 110 139 Q95 137 84 111 Z" fill="#ffffff" stroke="#7a3d27" stroke-width="3"/>
      <path d="M80 111 Q110 126 142 108" fill="none" stroke="#d26645" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 91 Q55 92 58 107 Q61 120 72 114" fill="#e8a171" stroke="#8a4c2e" stroke-width="3"/>
      <path d="M156 91 Q168 92 165 108 Q162 120 152 114" fill="#e8a171" stroke="#8a4c2e" stroke-width="3"/>
    </g>
  </svg>`;
}

function truckSvg() {
  return `<svg class="onsite-truck-svg" viewBox="0 0 260 120" role="img" aria-label="Animated OnSite service truck">
    <g>
      <path d="M24 36h132c11 0 20 9 20 20v36H24z" fill="#10336e" stroke="#ffffff" stroke-width="5"/>
      <path d="M176 57h39l25 25v10h-64z" fill="#f7941d" stroke="#ffffff" stroke-width="5"/>
      <path d="M187 62h23l14 15h-37z" fill="#bfe4ff"/>
      <rect x="47" y="50" width="92" height="24" rx="8" fill="#ffffff"/>
      <text x="93" y="68" text-anchor="middle" font-family="Arial Black,Arial" font-size="18" fill="#10336e">ONSITE</text>
      <path d="M50 79h88" stroke="#f7941d" stroke-width="7" stroke-linecap="round"/>
      <circle cx="70" cy="94" r="19" fill="#0a1427" stroke="#ffffff" stroke-width="5"/>
      <circle cx="70" cy="94" r="8" fill="#f7941d"/>
      <circle cx="205" cy="94" r="19" fill="#0a1427" stroke="#ffffff" stroke-width="5"/>
      <circle cx="205" cy="94" r="8" fill="#f7941d"/>
      <circle cx="246" cy="85" r="4" fill="#ffe87a"/>
    </g>
  </svg>`;
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
    #onsite-brand-lockup { display:flex; align-items:center; min-width:0; }
    #onsite-brand-lockup svg { width:184px; height:auto; max-height:64px; display:block; overflow:visible; }
    .onsite-pete-strip { margin:0 auto 22px; max-width:1100px; border:1px solid color-mix(in oklab,var(--onsite-brand-orange) 45%,transparent); border-radius:18px; padding:14px 20px 0; background:linear-gradient(135deg,color-mix(in oklab,var(--onsite-brand-orange) 14%,transparent),rgba(15,23,42,.78)); display:flex; align-items:center; gap:18px; box-shadow:0 18px 50px rgba(0,0,0,.22); overflow:hidden; }
    .onsite-pete-strip .onsite-pete-character { width:82px; height:126px; flex:0 0 auto; align-self:flex-end; }
    .onsite-pete-copy { padding-bottom:14px; }
    .onsite-pete-copy strong { display:block; color:white; font-size:1.15rem; letter-spacing:.02em; }
    .onsite-pete-copy span { color:rgba(255,255,255,.62); font-size:.9rem; }
    .onsite-loader-overlay { position:fixed; inset:0; z-index:2147483647; background:radial-gradient(circle at 50% 24%,rgba(24,53,93,.98),rgba(3,8,20,.985) 70%); display:flex; align-items:center; justify-content:center; padding:18px; backdrop-filter:blur(12px); }
    .onsite-loader-card { width:min(760px,100%); min-height:520px; border:1px solid color-mix(in oklab,var(--onsite-brand-orange) 58%,transparent); border-radius:28px; padding:26px 28px 24px; background:linear-gradient(160deg,rgba(18,33,58,.99),rgba(7,14,28,.99)); text-align:center; box-shadow:0 36px 110px rgba(0,0,0,.62); display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; position:relative; }
    .onsite-loader-logo { width:min(235px,70%); height:auto; margin:0 auto 4px; overflow:visible; }
    .onsite-loader-stage { width:100%; display:grid; grid-template-columns:170px minmax(0,1fr); gap:18px; align-items:end; margin:0 0 6px; }
    .onsite-loader-pete { width:158px; max-height:300px; justify-self:center; filter:drop-shadow(0 18px 22px rgba(0,0,0,.48)); animation:onsite-pete-bob 1.15s ease-in-out infinite alternate; }
    @keyframes onsite-pete-bob { from { transform:translateY(0) rotate(-.4deg); } to { transform:translateY(-7px) rotate(.5deg); } }
    .onsite-road-wrap { position:relative; min-height:155px; overflow:hidden; display:flex; align-items:flex-end; }
    .onsite-road { width:100%; height:74px; position:relative; border-radius:18px; background:linear-gradient(#26364d,#172234); border:1px solid rgba(255,255,255,.12); box-shadow:inset 0 10px 20px rgba(0,0,0,.28); overflow:hidden; }
    .onsite-road:before { content:""; position:absolute; left:0; right:0; top:35px; height:4px; background:repeating-linear-gradient(90deg,rgba(255,255,255,.78) 0 32px,transparent 32px 58px); opacity:.8; }
    .onsite-road:after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:8px; background:linear-gradient(90deg,var(--onsite-brand-orange),#f6a126,var(--onsite-brand-orange)); opacity:.8; }
    .onsite-truck-svg { position:absolute; width:178px; height:auto; left:-190px; bottom:23px; filter:drop-shadow(0 12px 12px rgba(0,0,0,.5)); animation:onsite-drive 3.8s linear infinite; }
    @keyframes onsite-drive { 0% { left:-190px; transform:translateY(0) rotate(-.4deg); } 45% { transform:translateY(-3px) rotate(.4deg); } 100% { left:calc(100% + 28px); transform:translateY(0) rotate(-.4deg); } }
    .onsite-loader-card h2 { color:white; font-size:clamp(1.45rem,4vw,2rem); font-weight:850; margin:4px 0 7px; line-height:1.08; }
    .onsite-loader-status { color:rgba(255,255,255,.68); margin:0; min-height:24px; transition:opacity .22s ease; }
    .onsite-loader-tagline { margin-top:10px !important; color:var(--onsite-brand-orange) !important; font-weight:800; }
    .onsite-progress { width:min(500px,92%); height:7px; margin:16px auto 0; border-radius:999px; overflow:hidden; background:rgba(255,255,255,.1); }
    .onsite-progress > span { display:block; height:100%; width:0; border-radius:inherit; background:linear-gradient(90deg,var(--onsite-brand-orange),#ffc15a); animation:onsite-progress ${LOADER_MIN_MS}ms cubic-bezier(.2,.7,.3,1) forwards; }
    @keyframes onsite-progress { from { width:4%; } to { width:100%; } }
    @media (max-width:640px) {
      #onsite-brand-lockup svg { width:145px; max-height:55px; }
      .onsite-pete-strip { padding:10px 12px 0; gap:10px; }
      .onsite-pete-strip .onsite-pete-character { width:60px; height:96px; }
      .onsite-pete-copy { padding-bottom:10px; }
      .onsite-pete-copy strong { font-size:.98rem; }
      .onsite-pete-copy span { font-size:.78rem; }
      .onsite-loader-card { min-height:500px; padding:20px 14px; }
      .onsite-loader-stage { grid-template-columns:108px minmax(0,1fr); gap:8px; }
      .onsite-loader-pete { width:104px; max-height:230px; }
      .onsite-road-wrap { min-height:130px; }
      .onsite-truck-svg { width:146px; }
    }
  `;
  document.head.appendChild(style);
}

function applyBrandOrange() {
  document.documentElement.style.setProperty("--primary", BRAND_ORANGE);
  document.documentElement.style.setProperty("--destructive", BRAND_ORANGE);
  document.documentElement.style.setProperty("--ring", BRAND_ORANGE);
  document.documentElement.style.setProperty("--chart-1", BRAND_ORANGE);

  document.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const inlineStyle = node.getAttribute("style");
    if (inlineStyle?.includes(OLD_ACCENT)) node.setAttribute("style", inlineStyle.split(OLD_ACCENT).join(BRAND_ORANGE));
  });

  document.querySelectorAll<HTMLElement>('[class*="orange-"]').forEach((node) => {
    if (node.className.includes("text-orange-")) node.style.color = BRAND_ORANGE;
    if (node.className.includes("bg-orange-")) node.style.backgroundColor = BRAND_ORANGE;
    if (node.className.includes("border-orange-")) node.style.borderColor = BRAND_ORANGE;
  });
}

function replaceBranding() {
  const headerInner = document.querySelector("header > div") as HTMLElement | null;
  if (headerInner) {
    headerInner.classList.remove("h-16");
    headerInner.classList.add("h-20");
    let lockup = document.getElementById("onsite-brand-lockup");
    if (!lockup) {
      const oldBrand = headerInner.firstElementChild as HTMLElement | null;
      lockup = document.createElement("div");
      lockup.id = "onsite-brand-lockup";
      lockup.innerHTML = brandLogoSvg();
      if (oldBrand) oldBrand.replaceWith(lockup); else headerInner.prepend(lockup);
    }
  }

  const heroCopy = Array.from(document.querySelectorAll("p")).find((p) => p.textContent?.includes("Five inputs. Sixty seconds."));
  if (heroCopy) heroCopy.textContent = "Fleet foresight starts OnSite. See what downtime is costing you—and how mobile preventive care helps keep your complete fleet on the road.";
}

function fixPhoneLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    link.href = PHONE_HREF;
    const text = link.textContent?.trim() || "";
    if (/call us free/i.test(text)) link.innerHTML = link.innerHTML.replace(/Call Us Free/i, `Call ${PHONE_DISPLAY}`);
    if (/or call us now/i.test(text)) link.innerHTML = link.innerHTML.replace(/Or Call Us Now/i, `Call ${PHONE_DISPLAY}`);
  });
}

function addPeteStrip() {
  if (document.getElementById("onsite-pete-strip")) return;
  const calculatorCard = Array.from(document.querySelectorAll("div")).find((node) => node.textContent?.includes("Your Fleet Numbers") && node.className.includes("rounded-2xl"));
  if (!calculatorCard) return;
  const strip = document.createElement("div");
  strip.id = "onsite-pete-strip";
  strip.className = "onsite-pete-strip";
  strip.innerHTML = `${peteSvg("onsite-pete-character")}<div class="onsite-pete-copy"><strong>Meet Pete DeFleet Guy — your Fleet Savings Advisor.</strong><span>Always have a complete fleet with Pete. OnSite service today. Fewer surprises tomorrow.</span></div>`;
  calculatorCard.insertBefore(strip, calculatorCard.firstChild);
}

function showLoader() {
  if (document.querySelector(".onsite-loader-overlay")) return;
  (document.activeElement as HTMLElement | null)?.blur?.();
  document.body.style.overflow = "hidden";

  const overlay = document.createElement("div");
  overlay.className = "onsite-loader-overlay";
  overlay.innerHTML = `<div class="onsite-loader-card">
    ${brandLogoSvg("onsite-loader-logo")}
    <div class="onsite-loader-stage">
      ${peteSvg("onsite-loader-pete")}
      <div class="onsite-road-wrap"><div class="onsite-road">${truckSvg()}</div></div>
    </div>
    <h2>Pete is crunching your fleet numbers...</h2>
    <p class="onsite-loader-status">Reviewing your downtime exposure.</p>
    <p class="onsite-loader-tagline">Always have a complete fleet with Pete.</p>
    <div class="onsite-progress"><span></span></div>
  </div>`;
  document.body.appendChild(overlay);

  const statuses = [
    "Reviewing your downtime exposure.",
    "Comparing your current service costs.",
    "Calculating hours Pete can help recover.",
    "Looking ahead for preventable downtime.",
    "Building your personalized Fleet Savings Report."
  ];
  const status = overlay.querySelector(".onsite-loader-status") as HTMLElement | null;
  let index = 0;
  const interval = window.setInterval(() => {
    index = Math.min(index + 1, statuses.length - 1);
    if (status) {
      status.style.opacity = "0";
      window.setTimeout(() => {
        status.textContent = statuses[index];
        status.style.opacity = "1";
      }, 180);
    }
  }, 1050);

  window.setTimeout(() => {
    window.clearInterval(interval);
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity .35s ease";
    window.setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 360);
  }, LOADER_MIN_MS);
}

async function submitLead(form: HTMLFormElement) {
  const textInputs = Array.from(form.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
  const email = form.querySelector('input[type="email"]') as HTMLInputElement | null;
  const phone = form.querySelector('input[type="tel"]') as HTMLInputElement | null;
  if (!email?.value || !phone?.value || textInputs.length < 2) return;

  const numVehicles = readSlider("Number of Vehicles in Your Fleet");
  const hourlyEmployeeCost = readSlider("Average Employee Hourly Cost");
  const serviceVisitsPerYear = readSlider("Average Service Visits Per Vehicle Annually");
  const hoursLostPerVisit = readSlider("Average Hours Lost Per Service Visit");
  const revenuePerVehicleHour = readSlider("Estimated Hourly Revenue Per Vehicle");
  const currentShopPricePerVisit = readSlider("What You Currently Pay Per Service Visit");
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
  let scheduled = false;
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      applyBrandOrange();
      replaceBranding();
      addPeteStrip();
      fixPhoneLinks();
    });
  };

  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form?.textContent?.includes("Unlock My Full ROI Report")) void submitLead(form);
  }, true);
}
