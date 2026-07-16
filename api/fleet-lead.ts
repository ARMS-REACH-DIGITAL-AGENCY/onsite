type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  pageUrl?: string;
  calculator?: {
    numVehicles?: number;
    hourlyEmployeeCost?: number;
    serviceVisitsPerYear?: number;
    hoursLostPerVisit?: number;
    revenuePerVehicleHour?: number;
    currentShopPricePerVisit?: number;
    annualHoursLost?: number;
    annualPayrollWasted?: number;
