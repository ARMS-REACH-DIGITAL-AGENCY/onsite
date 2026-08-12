import fleetLeadHandler from "./fleet-lead";

type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

const GHL_BASE = "https://services.leadconnectorhq.com";
const CONTACT_API_VERSION = "2021-07-28";
const USER_API_VERSION = "2023-02-21";

let cachedPeteOwnerId = "";

function normalize(value: unknown) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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

  if (!usersResponse.ok) return "";

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

  let ownerAssigned = false;
  if (statusCode >= 200 && statusCode < 300 && responseBody?.contactId) {
    try {
      ownerAssigned = await assignPeteOwner(String(responseBody.contactId));
    } catch {
      ownerAssigned = false;
    }
  }

  return res.status(statusCode).json({
    ...(responseBody || {}),
    ownerAssigned,
  });
}
