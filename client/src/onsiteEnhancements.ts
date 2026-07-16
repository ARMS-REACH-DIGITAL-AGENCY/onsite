const LOGO_SRC = "/assets/onsite_logo.svg";
const BRAND_ORANGE = "#f7941d";
const PHONE_HREF = "tel:+14806282588";
const PHONE_DISPLAY = "480-628-2588";
const LOADER_MS = 5600;

function ensureStyles() {
  if (document.getElementById("onsite-enhancement-styles")) return;
  const style = document.createElement("style");
  style.id = "onsite-enhancement-styles";
  style.textContent = `
    :root { --onsite-brand-orange: ${BRAND_ORANGE}; }
    #onsite-brand-lockup img { width:184px; height:auto; display:block; }
    .onsite-pete-strip { margin:0 auto 22px; padding:16px 18px; border:1px solid rgba(247,148,29,.4); border-radius:18px; background:linear-gradient(135deg,rgba(247,148,29,.12),rgba(15,23,42,.8)); display:flex; align-items:center; gap:14px; }
    .onsite-pete-avatar { width:74px; height:74px; border-radius:50%; display:grid; place-items:center; font-size:38px; background:#102b56; border:2px solid rgba(247,148,29,.6); box-shadow:0 12px 28px rgba(0,0,0,.35); }
    .onsite-pete-copy strong { display:block; color:#fff; font-size:1.05rem; }
    .onsite-pete-copy span { color:rgba(255,255,255,.62); font-size:.88rem; }
    .onsite-loader-overlay { position:fixed; inset:0; z-index:2147483647; background:radial-gradient(circle at 50% 20%,rgba(26,55,96,.98),rgba(4,10,24,.99) 72%); display:flex; align-items:center; justify-content:center; padding:18px; }
    .onsite-loader-card { width:min(720px,100%); min-height:500px; border:1px solid rgba(247,148,29,.55); border-radius:28px; padding:28px; background:linear-gradient(160deg,rgba(18,33,58,.99),rgba(7,14,28,.99)); text-align:center; box-shadow:0 36px 110px rgba(0,0,0,.62); }
    .onsite-loader-logo { width:min(240px,72%); height:auto; margin:0 auto 8px; display:block; }
    .onsite-loader-stage { display:grid; grid-template-columns:140px 1fr; gap:18px; align-items:end; margin:12px 0; }
    .onsite-pete-large { width:120px; height:180px; border-radius:60px 60px 28px 28px; display:flex; align-items:flex-start; justify-content:center; padding-top:18px; font-size:64px; background:linear-gradient(#173d76,#081a35); border:3px solid rgba(247,148,29,.55); animation:peteBob 1s ease-in-out infinite alternate; box-shadow:0 18px 36px rgba(0,0,0,.4); }
    @keyframes peteBob { from { transform:translateY(0) rotate(-1deg); } to { transform:translateY(-8px) rotate(1deg); } }
    .onsite-road { position:relative; height:90px; border-radius:18px; overflow:hidden; background:#1b2a40; border:1px solid rgba(255,255,255,.12); }
    .onsite-road:before { content:""; position:absolute; left:0; right:0; top:43px; height:4px; background:repeating-linear-gradient(90deg,rgba(255,255,255,.8) 0 34px,transparent 34px 62px); }
    .onsite-truck { position:absolute; left:-170px; bottom:12px; width:150px; height:58px; animation:truckDrive 3.6s linear infinite; }
    .onsite-truck .body { position:absolute; left:0; bottom:12px; width:104px; height:42px; border-radius:9px 5px 4px 4px; background:#123b7a; border:3px solid #fff; }
    .onsite-truck .cab { position:absolute; left:98px; bottom:12px; width:46px; height:34px; border-radius:8px 10px 4px 4px; background:${BRAND_ORANGE}; border:3px solid #fff; }
    .onsite-truck .wheel { position:absolute; bottom:0; width:24px; height:24px; border-radius:50%; background:#07101e; border:4px solid #fff; }
    .onsite-truck .wheel.one { left:24px; } .onsite-truck .wheel.two { left:108px; }
    .onsite-truck .label { position:absolute; left:15px; bottom:24px; color:#fff; font:700 12px Arial,sans-serif; }
    @keyframes truckDrive { from { left:-170px; } to { left:calc(100% + 20px); } }
    .onsite-loader-card h2 { color:#fff; font-size:clamp(1.5rem,4vw,2rem); margin:14px 0 6px; }
    .onsite-loader-status { color:rgba(255,255,255,.68); min-height:24px; transition:opacity .2s ease; }
    .onsite-loader-tagline { color:${BRAND_ORANGE}; font-weight:800; margin-top:8px; }
    .onsite-progress { width:min(500px,92%); height:7px; margin:16px auto 0; border-radius:999px; overflow:hidden; background:rgba(255,255,255,.1); }
    .onsite-progress span { display:block; height:100%; width:0; background:linear-gradient(90deg,${BRAND_ORANGE},#ffc15a); animation:progressFill ${LOADER_MS}ms linear forwards; }
    @keyframes progressFill { from { width:4%; } to { width:100%; } }
    @media (max-width:640px) { #onsite-brand-lockup img { width:145px; } .onsite-loader-stage { grid-template-columns:100px 1fr; } .onsite-pete-large { width:92px; height:145px; font-size:50px; } }
  `;
  document.head.appendChild(style);
}

function replaceBranding() {
  const headerInner = document.querySelector("header > div") as HTMLElement | null;
  if (!headerInner) return;
  headerInner.classList.remove("h-16");
  headerInner.classList.add("h-20");
  let lockup = document.getElementById("onsite-brand-lockup");
  if (!lockup) {
    lockup = document.createElement("div");
    lockup.id = "onsite-brand-lockup";
    lockup.innerHTML = `<img src="${LOGO_SRC}" alt="OnSite Fleet & Auto Care">`;
    const oldBrand = headerInner.firstElementChild;
    if (oldBrand) oldBrand.replaceWith(lockup); else headerInner.prepend(lockup);
  }

  const heroCopy = Array.from(document.querySelectorAll("p")).find((p) => p.textContent?.includes("Five inputs. Sixty seconds."));
  if (heroCopy) heroCopy.textContent = "Fleet foresight starts OnSite. See what downtime is costing you—and how mobile preventive care helps keep your complete fleet on the road.";
}

function applyBrandOrange() {
  document.documentElement.style.setProperty("--primary", BRAND_ORANGE);
  document.documentElement.style.setProperty("--ring", BRAND_ORANGE);
  document.querySelectorAll<HTMLElement>('[class*="orange-"]').forEach((node) => {
    if (node.className.includes("text-orange-")) node.style.color = BRAND_ORANGE;
    if (node.className.includes("bg-orange-")) node.style.backgroundColor = BRAND_ORANGE;
    if (node.className.includes("border-orange-")) node.style.borderColor = BRAND_ORANGE;
  });
  document.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const s = node.getAttribute("style");
    if (s?.includes("oklch(0.65 0.22 28)")) node.setAttribute("style", s.replaceAll("oklch(0.65 0.22 28)", BRAND_ORANGE));
  });
}

function fixPhoneLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]').forEach((link) => {
    link.href = PHONE_HREF;
    const text = link.textContent || "";
    if (/call us free/i.test(text)) link.textContent = `Call ${PHONE_DISPLAY}`;
    if (/or call us now/i.test(text)) link.textContent = `Call ${PHONE_DISPLAY}`;
  });
}

function addPeteStrip() {
  if (document.getElementById("onsite-pete-strip")) return;
  const card = Array.from(document.querySelectorAll<HTMLElement>("div")).find((node) => node.textContent?.includes("Your Fleet Numbers") && node.className.includes("rounded-2xl"));
  if (!card) return;
  const strip = document.createElement("div");
  strip.id = "onsite-pete-strip";
  strip.className = "onsite-pete-strip";
  strip.innerHTML = `<div class="onsite-pete-avatar">👨‍🔧</div><div class="onsite-pete-copy"><strong>Meet Pete DeFleet Guy — your Fleet Savings Advisor.</strong><span>Always have a complete fleet with Pete. OnSite service today. Fewer surprises tomorrow.</span></div>`;
  card.insertBefore(strip, card.firstChild);
}

function showLoader() {
  if (document.querySelector(".onsite-loader-overlay")) return;
  (document.activeElement as HTMLElement | null)?.blur?.();
  document.body.style.overflow = "hidden";
  const overlay = document.createElement("div");
  overlay.className = "onsite-loader-overlay";
  overlay.innerHTML = `<div class="onsite-loader-card"><img class="onsite-loader-logo" src="${LOGO_SRC}" alt="OnSite Fleet & Auto Care"><div class="onsite-loader-stage"><div class="onsite-pete-large">👨‍🔧</div><div class="onsite-road"><div class="onsite-truck"><div class="body"></div><div class="cab"></div><div class="wheel one"></div><div class="wheel two"></div><div class="label">ONSITE</div></div></div></div><h2>Pete is crunching your fleet numbers...</h2><p class="onsite-loader-status">Reviewing your downtime exposure.</p><p class="onsite-loader-tagline">Always have a complete fleet with Pete.</p><div class="onsite-progress"><span></span></div></div>`;
  document.body.appendChild(overlay);
  const messages = ["Reviewing your downtime exposure.","Comparing your current service costs.","Calculating hours Pete can help recover.","Looking ahead for preventable downtime.","Building your personalized Fleet Savings Report."];
  const status = overlay.querySelector<HTMLElement>(".onsite-loader-status");
  let index = 0;
  const timer = window.setInterval(() => {
    index = Math.min(index + 1, messages.length - 1);
    if (status) {
      status.style.opacity = "0";
      window.setTimeout(() => { status.textContent = messages[index]; status.style.opacity = "1"; }, 150);
    }
  }, 1050);
  window.setTimeout(() => {
    window.clearInterval(timer);
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity .35s ease";
    window.setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
      document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 360);
  }, LOADER_MS);
}

function submitLead(form: HTMLFormElement) {
  showLoader();
  const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
  const textInputs = inputs.filter((i) => i.type === "text");
  const email = inputs.find((i) => i.type === "email");
  const phone = inputs.find((i) => i.type === "tel");
  if (!email?.value || !phone?.value || textInputs.length < 2) return;
  void fetch("/api/fleet-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ name:textInputs[0].value.trim(), company:textInputs[1].value.trim(), email:email.value.trim(), phone:phone.value.trim(), source:"OnSite Fleet Calculator", pageUrl:window.location.href })
  }).catch(() => undefined);
}

export function installOnsiteEnhancements() {
  ensureStyles();
  let scheduled = false;
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      replaceBranding();
      applyBrandOrange();
      fixPhoneLinks();
      addPeteStrip();
    });
  };
  refresh();
  const observer = new MutationObserver(refresh);
  observer.observe(document.body, { childList:true, subtree:true });
  document.addEventListener("submit", (event) => {
    const form = event.target as HTMLFormElement;
    if (form?.textContent?.includes("Unlock My Full ROI Report")) submitLead(form);
  }, true);
}
