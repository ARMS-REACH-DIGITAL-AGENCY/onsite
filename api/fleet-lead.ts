type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  calculator?: {
    numVehicles?: number;
    hourlyEmployeeCost?: number;
    serviceVisitsPerYear?: number;
    hoursLostPerVisit?: number;
    revenuePerVehicleHour?: number;
    currentShopPricePerVisit?: number;
    annualHoursLost?: number;
    annualPayrollWasted?: number;
    estimatedLost