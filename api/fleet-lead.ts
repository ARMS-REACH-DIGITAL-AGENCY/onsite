type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

type CalculatorPayload = {
  numVehicles?: number;
  hourlyEmployeeCost?: number;
  serviceVisitsPerYear?: number;
  hoursLostPerVisit?: number;
  revenuePerVehicleHour?: number;
  currentShopPricePerVisit?: number;
};

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  pageUrl?: string;
  intent?: string;
  calculator?: CalculatorPayload;
};

const GHL_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";
const MESSAGE_API_VERSION = "v3";
const ONSITE_PRICE_PER_VISIT = 134.99;
const ONSITE_DOWNTIME_HOURS = 0.5;
const REVIEW_CALENDAR_URL =
  "https://api.armsreachdigital.com/widget/bookings/pete-defleet-guy-personal-calendar-fceb7-oda";
const MAINTENANCE_CALENDAR_URL =
  "https://api.armsreachdigital.com/widget/booking/vHMGXlJJ2Qom7wye7Pvz";
const PETE_EMAIL = "pcdaction@gmail.com";
const PETE_PHONE_DISPLAY = "480.628.2588";
const PETE_PHONE_HREF = "+14806282588";

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeCalculator(calculator?: CalculatorPayload) {
  if (!calculator) return null;
  const numVehicles = finiteNumber(calculator.numVehicles);
  const hourlyEmployeeCost = finiteNumber(calculator.hourlyEmployeeCost);
  const serviceVisitsPerYear = finiteNumber(calculator.serviceVisitsPerYear);
  const hoursLostPerVisit = finiteNumber(calculator.hoursLostPerVisit);
  const revenuePerVehicleHour = finiteNumber(calculator.revenuePerVehicleHour);
  const currentShopPricePerVisit = finiteNumber(calculator.currentShopPricePerVisit);

  if (
    numVehicles === null ||
    hourlyEmployeeCost === null ||
    serviceVisitsPerYear === null ||
    hoursLostPerVisit === null ||
    revenuePerVehicleHour === null ||
    currentShopPricePerVisit === null
  ) {
    return null;
  }

  return {
    numVehicles,
    hourlyEmployeeCost,
    serviceVisitsPerYear,
    hoursLostPerVisit,
    revenuePerVehicleHour,
    currentShopPricePerVisit,
  };
}

function calculateFleetResults(inputs: NonNullable<ReturnType<typeof normalizeCalculator>>) {
  const totalVisits = inputs.numVehicles * inputs.serviceVisitsPerYear;
  const annualHoursLost = totalVisits * inputs.hoursLostPerVisit;
  const annualPayrollWasted = annualHoursLost * inputs.hourlyEmployeeCost;
  const estimatedLostRevenue = annualHoursLost * inputs.revenuePerVehicleHour;
  const totalDowntimeCost = annualPayrollWasted + estimatedLostRevenue;
  const currentAnnualServiceCost = totalVisits * inputs.currentShopPricePerVisit;

  const onsiteHoursLost = totalVisits * ONSITE_DOWNTIME_HOURS;
  const onsitePayrollCost = onsiteHoursLost * inputs.hourlyEmployeeCost;
  const onsiteLostRevenue = onsiteHoursLost * inputs.revenuePerVehicleHour;
  const onsiteServiceCost = totalVisits * ONSITE_PRICE_PER_VISIT;
  const onsiteTotalCost = onsitePayrollCost + onsiteLostRevenue + onsiteServiceCost;
  const currentTotalCost = totalDowntimeCost + currentAnnualServiceCost;
  const netAnnualSavings = currentTotalCost - onsiteTotalCost;
  const hoursRecovered = annualHoursLost - onsiteHoursLost;
  const savingsPercent = currentTotalCost > 0 ? (netAnnualSavings / currentTotalCost) * 100 : 0;

  return {
    totalVisits,
    annualHoursLost,
    annualPayrollWasted,
    estimatedLostRevenue,
    totalDowntimeCost,
    currentAnnualServiceCost,
    currentTotalCost,
    onsiteHoursLost,
    onsitePayrollCost,
    onsiteLostRevenue,
    onsiteServiceCost,
    onsiteTotalCost,
    netAnnualSavings,
    hoursRecovered,
    savingsPercent,
  };
}

function currency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function number(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildResultsEmail(
  name: string,
  company: string,
  inputs: NonNullable<ReturnType<typeof normalizeCalculator>>,
  results: ReturnType<typeof calculateFleetResults>
) {
  const firstName = escapeHtml(name.split(/\s+/)[0] || name);
  const safeCompany = escapeHtml(company);
  const positiveSavings = Math.max(0, results.netAnnualSavings);

  const text = [
    `Hi ${name.split(/\s+/)[0] || name},`,
    "",
    `Thanks for running the ONSITE Fleet Downtime Calculator for ${company}.`,
    "",
    "Your fleet evaluation:",
    `Vehicles: ${number(inputs.numVehicles)}`,
    `Annual employee hours currently lost: ${number(results.annualHoursLost)}`,
    `Estimated annual payroll impact: ${currency(results.annualPayrollWasted)}`,
    `Estimated revenue capacity affected: ${currency(results.estimatedLostRevenue)}`,
    `Estimated total annual operating impact: ${currency(results.currentTotalCost)}`,
    `Estimated annual savings with ONSITE: ${currency(positiveSavings)}`,
    `Estimated hours recovered: ${number(results.hoursRecovered)}`,
    "",
    "ONSITE is a mobile fleet maintenance solution. We come to your fleet so your vehicles spend less time being dropped off, waiting at a shop, and sitting out of service.",
    "",
    "NEW CUSTOMER OFFER: FREE wiper blades installed on the first three vehicles serviced.",
    "",
    `Book your free 20-minute Fleet Review: ${REVIEW_CALENDAR_URL}`,
    `Schedule fleet maintenance: ${MAINTENANCE_CALENDAR_URL}`,
    "",
    'Pete "DeFleet Guy" DeLuca',
    PETE_EMAIL,
    PETE_PHONE_DISPLAY,
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#eef1f5;font-family:Arial,Helvetica,sans-serif;color:#152238;">
      <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
        <div style="background:#10243e;border-radius:16px 16px 0 0;padding:24px;text-align:center;">
          <img src="https://onsitefleetcalculator.com/assets/onsite_logo_official.png" alt="ONSITE Fleet & Auto Care" style="max-width:260px;width:70%;height:auto;" />
        </div>
        <div style="background:#ffffff;padding:30px 28px;border-radius:0 0 16px 16px;box-shadow:0 8px 24px rgba(15,35,60,.08);">
          <h1 style="font-size:24px;line-height:1.25;margin:0 0 14px;color:#10243e;">Your Fleet Downtime Evaluation</h1>
          <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">Hi ${firstName}, thanks for running the ONSITE Fleet Downtime Calculator for <strong>${safeCompany}</strong>.</p>

          <div style="background:#f6f8fa;border:1px solid #e2e7ec;border-radius:12px;padding:18px;margin:0 0 22px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.45;">
              <tr><td style="padding:6px 0;color:#667085;">Vehicles</td><td style="padding:6px 0;text-align:right;font-weight:700;">${number(inputs.numVehicles)}</td></tr>
              <tr><td style="padding:6px 0;color:#667085;">Annual employee hours lost</td><td style="padding:6px 0;text-align:right;font-weight:700;">${number(results.annualHoursLost)} hrs</td></tr>
              <tr><td style="padding:6px 0;color:#667085;">Estimated payroll impact</td><td style="padding:6px 0;text-align:right;font-weight:700;">${currency(results.annualPayrollWasted)}</td></tr>
              <tr><td style="padding:6px 0;color:#667085;">Estimated revenue capacity affected</td><td style="padding:6px 0;text-align:right;font-weight:700;">${currency(results.estimatedLostRevenue)}</td></tr>
              <tr><td style="padding:9px 0 6px;color:#10243e;border-top:1px solid #dfe5eb;font-weight:700;">Estimated total annual operating impact</td><td style="padding:9px 0 6px;text-align:right;border-top:1px solid #dfe5eb;font-weight:800;color:#f3893b;">${currency(results.currentTotalCost)}</td></tr>
            </table>
          </div>

          <div style="background:#edf8f1;border:1px solid #cce9d5;border-radius:12px;padding:18px;margin:0 0 22px;text-align:center;">
            <div style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#47745a;font-weight:700;">Estimated annual savings with ONSITE</div>
            <div style="font-size:34px;line-height:1.15;margin:6px 0;color:#1d7a46;font-weight:800;">${currency(positiveSavings)}</div>
            <div style="font-size:14px;color:#5e7466;">Approximately ${number(results.hoursRecovered)} fleet hours recovered</div>
          </div>

          <p style="font-size:16px;line-height:1.65;margin:0 0 18px;"><strong>ONSITE is a mobile fleet maintenance solution.</strong> We come to your fleet, helping reduce drop-off time, shop waiting, and preventable time out of service.</p>

          <div style="border:2px solid #f3893b;border-radius:12px;padding:18px;margin:0 0 24px;background:#fff8f3;">
            <div style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#a74f17;font-weight:800;margin-bottom:5px;">New customer offer</div>
            <div style="font-size:18px;line-height:1.45;font-weight:800;color:#10243e;">FREE wiper blades installed on the first three vehicles serviced.</div>
          </div>

          <div style="text-align:center;margin:0 0 24px;">
            <a href="${REVIEW_CALENDAR_URL}" style="display:inline-block;background:#f3893b;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 20px;border-radius:9px;margin:0 5px 10px;">Book My Free 20-Min Fleet Review</a>
            <a href="${MAINTENANCE_CALENDAR_URL}" style="display:inline-block;background:#10243e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:14px 20px;border-radius:9px;margin:0 5px 10px;">Schedule Fleet Maintenance</a>
          </div>

          <p style="font-size:15px;line-height:1.55;margin:0;color:#3f4b5d;">
            Pete &quot;DeFleet Guy&quot; DeLuca<br />
            <a href="mailto:${PETE_EMAIL}" style="color:#f3893b;text-decoration:none;">${PETE_EMAIL}</a><br />
            <a href="tel:${PETE_PHONE_HREF}" style="color:#f3893b;text-decoration:none;">${PETE_PHONE_DISPLAY}</a>
          </p>
          <p style="font-size:11px;line-height:1.5;color:#8b95a5;margin:22px 0 0;">Calculator figures are estimates based on the information entered and are intended for fleet planning purposes.</p>
        </div>
      </div>
    </div>`;

  return { html, text };
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    return res.status(500).json({ ok: false, message: "HighLevel integration is not configured" });
  }

  const payload = (req.body || {}) as LeadPayload;
  const name = String(payload.name || "").trim();
  const company = String(payload.company || "").trim();
  const email = String(payload.email || "").trim();
  const phone = String(payload.phone || "").trim();
  const calculator = normalizeCalculator(payload.calculator);

  if (!name || !company || !email || !phone) {
    return res.status(400).json({ ok: false, message: "Missing required lead information" });
  }

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");

  try {
    const contactResponse = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        name,
        email,
        phone,
        companyName: company,
        source: payload.source || "OnSite Fleet Calculator",
        tags: ["fleet-calculator-lead", "onsite-fleet-calculator"],
      }),
    });

    const contactData = await contactResponse.json().catch(() => ({}));
    if (!contactResponse.ok) {
      return res.status(contactResponse.status).json({
        ok: false,
        message: "HighLevel rejected the lead",
      });
    }

    const contactId = (contactData as any)?.contact?.id || (contactData as any)?.id;
    let noteSaved = false;
    let emailQueued = false;

    if (contactId && calculator) {
      const results = calculateFleetResults(calculator);
      const lines = [
        "ONSITE Fleet Downtime Calculator Submission",
        `Company: ${company}`,
        `Page: ${payload.pageUrl || "unknown"}`,
        `Intent: ${payload.intent || "fleet-calculator"}`,
        "",
        "Calculator Inputs",
        `Number of Vehicles: ${calculator.numVehicles}`,
        `Average Employee Hourly Cost: ${calculator.hourlyEmployeeCost}`,
        `Service Visits Per Vehicle Annually: ${calculator.serviceVisitsPerYear}`,
        `Average Hours Lost Per Service Visit: ${calculator.hoursLostPerVisit}`,
        `Estimated Hourly Revenue Per Vehicle: ${calculator.revenuePerVehicleHour}`,
        `Current Shop Price Per Visit: ${calculator.currentShopPricePerVisit}`,
        "",
        "Evaluation Results",
        `Annual Employee Hours Lost: ${results.annualHoursLost}`,
        `Annual Payroll Impact: ${results.annualPayrollWasted}`,
        `Estimated Revenue Capacity Affected: ${results.estimatedLostRevenue}`,
        `Estimated Total Annual Operating Impact: ${results.currentTotalCost}`,
        `Estimated Net Annual Savings With ONSITE: ${results.netAnnualSavings}`,
        `Estimated Fleet Hours Recovered: ${results.hoursRecovered}`,
      ];

      const noteResponse = await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: lines.join("\n") }),
      });
      noteSaved = noteResponse.ok;

      const message = buildResultsEmail(name, company, calculator, results);
      const emailResponse = await fetch(`${GHL_BASE}/conversations/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: MESSAGE_API_VERSION,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: "Email",
          contactId,
          emailTo: email,
          subject: "Your ONSITE Fleet Downtime Evaluation",
          html: message.html,
          message: message.text,
          status: "pending",
        }),
      });
      emailQueued = emailResponse.ok;
    }

    return res.status(200).json({
      ok: true,
      contactId,
      calculatorReceived: Boolean(calculator),
      noteSaved,
      emailQueued,
    });
  } catch {
    return res.status(502).json({ ok: false, message: "Unable to reach HighLevel" });
  }
}
