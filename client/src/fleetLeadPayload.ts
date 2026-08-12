type FleetCalculatorPayload = {
  numVehicles: number;
  hourlyEmployeeCost: number;
  serviceVisitsPerYear: number;
  hoursLostPerVisit: number;
  revenuePerVehicleHour: number;
  currentShopPricePerVisit: number;
};

const FIELD_LABELS: Array<[keyof FleetCalculatorPayload, string]> = [
  ["numVehicles", "Number of Vehicles in Your Fleet"],
  ["hourlyEmployeeCost", "Average Employee Hourly Cost"],
  ["serviceVisitsPerYear", "Average Service Visits Per Vehicle Annually"],
  ["hoursLostPerVisit", "Average Hours Lost Per Service Visit"],
  ["revenuePerVehicleHour", "Estimated Hourly Revenue Per Vehicle"],
  ["currentShopPricePerVisit", "What You Currently Pay Per Service Visit"],
];

function normalize(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function readCalculatorValue(labelText: string) {
  const label = Array.from(document.querySelectorAll<HTMLLabelElement>("label")).find(
    (candidate) => normalize(candidate.textContent) === labelText
  );
  if (!label) return null;

  const field = label.closest<HTMLElement>(".animate-fade-in-up") || label.parentElement?.parentElement;
  const input = field?.querySelector<HTMLInputElement>('input.calc-input[type="text"]');
  if (!input) return null;

  const value = Number.parseFloat(input.value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function collectCalculatorPayload(): FleetCalculatorPayload | null {
  const values: Partial<FleetCalculatorPayload> = {};

  for (const [key, label] of FIELD_LABELS) {
    const value = readCalculatorValue(label);
    if (value === null) return null;
    values[key] = value;
  }

  return values as FleetCalculatorPayload;
}

export function installFleetLeadPayloadEnhancer() {
  if (document.documentElement.dataset.onsiteFleetLeadPayloadEnhanced === "true") return;
  document.documentElement.dataset.onsiteFleetLeadPayloadEnhanced = "true";

  const nativeFetch = window.fetch.bind(window);

  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    if (!url.includes("/api/fleet-lead") || typeof init?.body !== "string") {
      return nativeFetch(input, init);
    }

    try {
      const payload = JSON.parse(init.body) as Record<string, unknown>;
      const calculator = payload.calculator || collectCalculatorPayload();
      const nextBody = calculator ? JSON.stringify({ ...payload, calculator }) : init.body;

      return nativeFetch("/api/fleet-lead-assigned", {
        ...init,
        body: nextBody,
      });
    } catch {
      return nativeFetch("/api/fleet-lead-assigned", init);
    }
  }) as typeof window.fetch;
}
