type RequestLike = {
  method?: string;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  pageUrl?: string;
  calculator?: Record<string, number>;
};

const GHL_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";

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

    if (contactId && payload.calculator) {
      const lines = [
        "OnSite Fleet Calculator Submission",
        `Company: ${company}`,
        `Page: ${payload.pageUrl || "unknown"}`,
        "",
        ...Object.entries(payload.calculator).map(([key, value]) => `${key}: ${value}`),
      ];

      await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: lines.join("\n") }),
      }).catch(() => undefined);
    }

    return res.status(200).json({ ok: true, contactId });
  } catch {
    return res.status(502).json({ ok: false, message: "Unable to reach HighLevel" });
  }
}
