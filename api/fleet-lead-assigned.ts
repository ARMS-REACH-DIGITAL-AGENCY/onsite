import fleetLeadHandler from "./fleet-lead";

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
  pageUrl?: string;
  intent?: string;
  calculator?: CalculatorPayload;
};

const GHL_BASE = "https://services.leadconnectorhq.com";
const CONTACT_API_VERSION = "2021-07-28";
const USER_API_VERSION = "2023-02-21";
const ONSITE_PRICE_PER_VISIT = 134.99;
const ONSITE_DOWNTIME_HOURS = 0.5;

let cachedPeteOwnerId = "";

function normalize(value: unknown) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function finiteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
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

function buildFallbackCalculatorNote(payload: LeadPayload) {
  const calculator = normalizeCalculator(payload.calculator);
  if (!calculator) return "";

  const totalVisits = calculator.numVehicles * calculator.serviceVisitsPerYear;
  const annualHoursLost = totalVisits * calculator.hoursLostPerVisit;
  const annualPayrollWasted = annualHoursLost * calculator.hourlyEmployeeCost;
  const estimatedLostRevenue = annualHoursLost * calculator.revenuePerVehicleHour;
  const totalDowntimeCost = annualPayrollWasted + estimatedLostRevenue;
  const currentAnnualServiceCost = totalVisits * calculator.currentShopPricePerVisit;
  const currentTotalCost = totalDowntimeCost + currentAnnualServiceCost;

  const onsiteHoursLost = totalVisits * ONSITE_DOWNTIME_HOURS;
  const onsitePayrollCost = onsiteHoursLost * calculator.hourlyEmployeeCost;
  const onsiteLostRevenue = onsiteHoursLost * calculator.revenuePerVehicleHour;
  const onsiteServiceCost = totalVisits * ONSITE_PRICE_PER_VISIT;
  const onsiteTotalCost = onsitePayrollCost + onsiteLostRevenue + onsiteServiceCost;
  const netAnnualSavings = currentTotalCost - onsiteTotalCost;
  const hoursRecovered = annualHoursLost - onsiteHoursLost;

  return [
    "ONSITE Fleet Downtime Calculator Submission",
    `Company: ${String(payload.company || "").trim()}`,
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
    `Annual Employee Hours Lost: ${annualHoursLost}`,
    `Annual Payroll Impact: ${annualPayrollWasted}`,
    `Estimated Revenue Capacity Affected: ${estimatedLostRevenue}`,
    `Estimated Total Annual Operating Impact: ${currentTotalCost}`,
    `Estimated Net Annual Savings With ONSITE: ${netAnnualSavings}`,
    `Estimated Fleet Hours Recovered: ${hoursRecovered}`,
  ].join("\n");
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryCalculatorNote(contactId: string, payload: LeadPayload) {
  const token = String(process.env.GHL_PRIVATE_INTEGRATION_TOKEN || "").trim();
  const body = buildFallbackCalculatorNote(payload);
  if (!token || !contactId || !body) return false;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${GHL_BASE}/contacts/${encodeURIComponent(contactId)}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: CONTACT_API_VERSION,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ body }),
      });

      if (response.ok) {
        console.info("ONSITE calculator note fallback saved", { contactId, attempt });
        return true;
      }

      const errorBody = await response.text().catch(() => "");
      console.error("ONSITE calculator note fallback failed", {
        contactId,
        attempt,
        status: response.status,
        body: errorBody.slice(0, 1000),
      });
    } catch (error) {
      console.error("ONSITE calculator note fallback exception", {
        contactId,
        attempt,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    if (attempt < 3) await wait(attempt * 300);
  }

  return false;
}

async function resolvePeteOwnerId(token: string, locationId: string) {
  const configuredOwnerId = String(process.env.GHL_PETE_OWNER_ID || "").trim();
  if (configuredOwnerId) return configuredOwnerId;
  if (cachedPeteOwnerId) return cachedPeteOwnerId;

  const usersResponse = await fetch(
    `${GHL_BASE}/users/?locationId=${encodeURIComponent(locationId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: USER_API_VERSION,
        Accept: "application/json",
      },
    }
  );

  if (!usersResponse.ok) {
    const errorBody = await usersResponse.text().catch(() => "");
    console.error("ONSITE Pete owner lookup failed", {
      status: usersResponse.status,
      body: errorBody.slice(0, 1000),
    });
    return "";
  }

  const data = (await usersResponse.json().catch(() => ({}))) as any;
  const users = Array.isArray(data?.users) ? data.users : [];
  const pete = users.find((user: any) => {
    const name = normalize(user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`);
    const email = normalize(user?.email);
    return (
      (name.includes("pete") && name.includes("defleet")) ||
      email === "pete@armsreachdigital.agency" ||
      email === "pcdaction@gmail.com"
    );
  });

  const ownerId = String(pete?.id || "").trim();
  if (ownerId) cachedPeteOwnerId = ownerId;
  return ownerId;
}

async function assignPeteOwner(contactId: string) {
  const token = String(process.env.GHL_PRIVATE_INTEGRATION_TOKEN || "").trim();
  const locationId = String(process.env.GHL_LOCATION_ID || "").trim();
  if (!token || !locationId || !contactId) return false;

  const ownerId = await resolvePeteOwnerId(token, locationId);
  if (!ownerId) return false;

  const response = await fetch(`${GHL_BASE}/contacts/${encodeURIComponent(contactId)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: CONTACT_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ assignedTo: ownerId }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error("ONSITE Pete owner assignment failed", {
      contactId,
      status: response.status,
      body: errorBody.slice(0, 1000),
    });
  }

  return response.ok;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  let statusCode = 200;
  let responseBody: any = null;
  let didRespond = false;

  const wrappedResponse: ResponseLike = {
    status(code: number) {
      statusCode = code;
      return wrappedResponse;
    },
    json(body: unknown) {
      responseBody = body;
      didRespond = true;
    },
  };

  await fleetLeadHandler(req, wrappedResponse);

  if (!didRespond) {
    return res.status(502).json({ ok: false, message: "Fleet lead handler did not return a response" });
  }

  const contactId = String(responseBody?.contactId || "").trim();
  let noteSaved = Boolean(responseBody?.noteSaved);
  if (statusCode >= 200 && statusCode < 300 && contactId && !noteSaved) {
    noteSaved = await retryCalculatorNote(contactId, (req.body || {}) as LeadPayload);
  }

  let ownerAssigned = false;
  if (statusCode >= 200 && statusCode < 300 && contactId) {
    try {
      ownerAssigned = await assignPeteOwner(contactId);
    } catch (error) {
      console.error("ONSITE Pete owner assignment exception", {
        contactId,
        message: error instanceof Error ? error.message : String(error),
      });
      ownerAssigned = false;
    }
  }

  return res.status(statusCode).json({
    ...(responseBody || {}),
    noteSaved,
    ownerAssigned,
  });
}
