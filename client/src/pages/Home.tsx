/**
 * Fleet Downtime Cost Calculator — Onsite Fleet & Auto Care
 * Design: "Command & Clarity" — deep navy + orange-red accent
 * Font: Barlow Condensed (display/numbers) + Inter (body/labels)
 * Layout: Asymmetric two-panel on desktop, stacked on mobile
 * Style decisions:
 *   - Hero includes live cost preview above fold (command center feel)
 *   - Largest monetary figure dominates via Barlow Condensed Bold
 *   - Angular shield/wrench brand language repeats in badges, locks, step markers
 *   - Numbers are the hero — orange/amber reserved for cost signals
 *   - ROI comparison layer: current vs. Onsite Fleet side-by-side after unlock
 *   - Net savings number is the slam-dunk close — displayed prominently in green
 *   - Real pricing from Onsite Fleet: $134.99/visit, 85% downtime reduction
 */

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useState, useCallback, useEffect } from "react";
import {
  Lock,
  Unlock,
  ChevronRight,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Phone,
  Mail,
  User,
  Building2,
  Wrench,
  Shield,
  Star,
  ArrowRight,
  Calculator,
  Zap,
  Truck,
  BarChart3,
  BadgeDollarSign,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalcInputs {
  numVehicles: number;
  hourlyEmployeeCost: number;
  serviceVisitsPerYear: number;
  hoursLostPerVisit: number;
  revenuePerVehicleHour: number;
  currentShopPricePerVisit: number;
}

interface CalcResults {
  annualHoursLost: number;
  annualPayrollWasted: number;
  estimatedLostRevenue: number;
  totalDowntimeCost: number;
}

interface OnsiteResults {
  onsiteHoursLost: number;
  onsitePayrollCost: number;
  onsiteLostRevenue: number;
  onsiteServiceCost: number;
  onsiteTotalCost: number;
  netAnnualSavings: number;
  hoursRecovered: number;
  savingsPercent: number;
  // True Cost Per Visit
  currentTrueCostPerVisit: number;
  onsiteTrueCostPerVisit: number;
  savingsPerVisit: number;
  currentAnnualServiceCost: number;
}

interface LeadForm {
  name: string;
  company: string;
  email: string;
  phone: string;
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

const ONSITE_PRICE_PER_VISIT = 134.99;
const ONSITE_DOWNTIME_HOURS = 0.5; // tech comes to you — 30 min vs. 3+ hr drop-off

function calculate(inputs: CalcInputs): CalcResults {
  const { numVehicles, hourlyEmployeeCost, serviceVisitsPerYear, hoursLostPerVisit, revenuePerVehicleHour } = inputs;
  const annualHoursLost = numVehicles * serviceVisitsPerYear * hoursLostPerVisit;
  const annualPayrollWasted = annualHoursLost * hourlyEmployeeCost;
  const estimatedLostRevenue = annualHoursLost * revenuePerVehicleHour;
  const totalDowntimeCost = annualPayrollWasted + estimatedLostRevenue;
  return { annualHoursLost, annualPayrollWasted, estimatedLostRevenue, totalDowntimeCost };
}

function calculateOnsite(inputs: CalcInputs, current: CalcResults): OnsiteResults {
  const { numVehicles, hourlyEmployeeCost, serviceVisitsPerYear, revenuePerVehicleHour, currentShopPricePerVisit } = inputs;
  const totalVisits = numVehicles * serviceVisitsPerYear;

  const onsiteHoursLost = totalVisits * ONSITE_DOWNTIME_HOURS;
  const onsitePayrollCost = onsiteHoursLost * hourlyEmployeeCost;
  const onsiteLostRevenue = onsiteHoursLost * revenuePerVehicleHour;
  const onsiteServiceCost = totalVisits * ONSITE_PRICE_PER_VISIT;
  const onsiteTotalCost = onsitePayrollCost + onsiteLostRevenue + onsiteServiceCost;

  const netAnnualSavings = (current.totalDowntimeCost + totalVisits * currentShopPricePerVisit) - onsiteTotalCost;
  const hoursRecovered = current.annualHoursLost - onsiteHoursLost;

  // True Cost Per Visit (hard + soft)
  const currentTrueCostPerVisit = currentShopPricePerVisit
    + (inputs.hoursLostPerVisit * hourlyEmployeeCost)
    + (inputs.hoursLostPerVisit * revenuePerVehicleHour);
  const onsiteTrueCostPerVisit = ONSITE_PRICE_PER_VISIT
    + (ONSITE_DOWNTIME_HOURS * hourlyEmployeeCost)
    + (ONSITE_DOWNTIME_HOURS * revenuePerVehicleHour);
  const savingsPerVisit = currentTrueCostPerVisit - onsiteTrueCostPerVisit;
  const currentAnnualServiceCost = totalVisits * currentShopPricePerVisit;

  const totalCurrentCost = current.totalDowntimeCost + currentAnnualServiceCost;
  const savingsPercent = totalCurrentCost > 0
    ? Math.round((netAnnualSavings / totalCurrentCost) * 100)
    : 0;

  return { onsiteHoursLost, onsitePayrollCost, onsiteLostRevenue, onsiteServiceCost, onsiteTotalCost, netAnnualSavings, hoursRecovered, savingsPercent, currentTrueCostPerVisit, onsiteTrueCostPerVisit, savingsPerVisit, currentAnnualServiceCost };
}

// ─── Slider Input Component ───────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
  hint?: string;
  delay?: number;
}

function SliderInput({ label, value, min, max, step, prefix = "", suffix = "", onChange, hint, delay = 0 }: SliderInputProps) {
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setLocalValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= min && num <= max) onChange(num);
  };

  const handleBlur = () => {
    const num = parseFloat(localValue);
    if (isNaN(num) || num < min) { setLocalValue(String(min)); onChange(min); }
    else if (num > max) { setLocalValue(String(max)); onChange(max); }
    else { setLocalValue(String(num)); onChange(num); }
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-white/75">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-white/40 font-medium">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleTextChange}
            onBlur={handleBlur}
            className="calc-input w-20 text-right text-sm font-semibold px-2 py-1"
          />
          {suffix && <span className="text-sm text-white/40">{suffix}</span>}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={(e) => { const v = parseFloat(e.target.value); onChange(v); setLocalValue(String(v)); }}
          className="w-full"
          style={{
            background: `linear-gradient(to right, oklch(0.65 0.22 28) 0%, oklch(0.65 0.22 28) ${pct}%, oklch(1 0 0 / 12%) ${pct}%, oklch(1 0 0 / 12%) 100%)`,
          }}
        />
      </div>
      {hint && <p className="text-xs text-white/35 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Result Card Component ────────────────────────────────────────────────────

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  locked?: boolean;
  highlight?: boolean;
  delay?: number;
  unlocked?: boolean;
  large?: boolean;
  variant?: "default" | "danger" | "savings";
}

function ResultCard({ icon, label, value, prefix = "$", suffix = "", locked = false, highlight = false, delay = 0, unlocked = false, large = false, variant = "default" }: ResultCardProps) {
  const bgClass = variant === "savings"
    ? "border-green-500/40 bg-gradient-to-br from-[oklch(0.35_0.12_155/20%)] to-[oklch(0.35_0.12_155/8%)]"
    : highlight
    ? "border-orange-500/40 bg-gradient-to-br from-[oklch(0.65_0.22_28/18%)] to-[oklch(0.65_0.22_28/8%)]"
    : "border-white/8 bg-white/4";

  const numColor = variant === "savings" ? "text-green-400" : highlight ? "text-orange-400" : "text-white";
  const iconBg = variant === "savings" ? "bg-green-500/20 text-green-400" : highlight ? "bg-orange-500/20 text-orange-400" : "bg-white/6 text-white/50";
  const accentLine = variant === "savings"
    ? "bg-gradient-to-r from-green-500 via-green-400 to-transparent"
    : "bg-gradient-to-r from-orange-500 via-orange-400 to-transparent";

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 animate-fade-in-up overflow-hidden ${bgClass} ${large ? "p-5" : "p-4"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(highlight || variant === "savings") && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentLine}`} />
      )}

      <div className={locked && !unlocked ? "blur-sm select-none pointer-events-none" : unlocked ? "animate-unlock" : ""}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">{label}</p>
            <p className={`metric-number leading-none ${numColor} ${large ? "text-4xl" : "text-2xl"}`}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        </div>
      </div>

      {locked && !unlocked && (
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center"
          style={{ background: "oklch(0.17 0.04 255 / 75%)", backdropFilter: "blur(6px)" }}>
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-1.5">
            <Lock className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-xs text-white/50 font-medium">Unlock full report</p>
        </div>
      )}
    </div>
  );
}

// ─── Lead Gate Form ───────────────────────────────────────────────────────────

interface LeadFormProps {
  onSubmit: (data: LeadForm) => void;
}

function LeadGateForm({ onSubmit }: LeadFormProps) {
  const [form, setForm] = useState<LeadForm>({ name: "", company: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<LeadForm>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Partial<LeadForm> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.company.trim()) errs.company = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(form);
    setSubmitting(false);
  };

  const field = (key: keyof LeadForm, label: string, type: string, placeholder: string, icon: React.ReactNode) => (
    <div>
      <label className="block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</div>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined })); }}
          placeholder={placeholder}
          className={`calc-input w-full pl-9 pr-3 py-2.5 text-sm ${errors[key] ? "border-red-500/60" : ""}`}
        />
      </div>
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        {field("name", "Full Name", "text", "Jane Smith", <User className="w-4 h-4" />)}
        {field("company", "Company", "text", "Acme Logistics", <Building2 className="w-4 h-4" />)}
      </div>
      {field("email", "Work Email", "email", "jane@acmelogistics.com", <Mail className="w-4 h-4" />)}
      {field("phone", "Phone Number", "tel", "(555) 000-0000", <Phone className="w-4 h-4" />)}
      <button
        type="submit"
        disabled={submitting}
        className="btn-glow w-full py-3.5 rounded-xl font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "oklch(0.65 0.22 28)" }}
      >
        {submitting ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Calculating Your Savings…</>
        ) : (
          <><Unlock className="w-4 h-4" />Unlock My Full ROI Report<ArrowRight className="w-4 h-4" /></>
        )}
      </button>
      <p className="text-center text-[11px] text-white/25 leading-relaxed">
        No spam. We'll send your personalized savings report and follow up with a free fleet consultation.
      </p>
    </form>
  );
}

// ─── ROI Comparison Panel ─────────────────────────────────────────────────────

interface ROIComparisonProps {
  inputs: CalcInputs;
  current: CalcResults;
  onsite: OnsiteResults;
  leadName: string;
}

function ROIComparison({ inputs, current, onsite, leadName }: ROIComparisonProps) {
  const firstName = leadName.split(" ")[0];
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const totalVisits = inputs.numVehicles * inputs.serviceVisitsPerYear;

  return (
    <div className="animate-unlock space-y-4">

      {/* ── True Cost Per Visit — the objection killer ── */}
      <div className="relative rounded-2xl overflow-hidden border border-orange-500/30 p-5"
        style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 28 / 12%), oklch(0.65 0.22 28 / 5%))" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />

        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Calculator className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <p className="text-[11px] font-semibold text-orange-400/80 uppercase tracking-widest">True Cost Per Visit — Hard + Soft</p>
        </div>

        {/* Per-visit breakdown grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Current shop */}
          <div className="rounded-xl border border-white/8 p-3.5" style={{ background: "oklch(0.16 0.04 255 / 70%)" }}>
            <p className="text-[10px] font-semibold text-orange-400/70 uppercase tracking-widest mb-2">Their Shop</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Invoice price</span>
                <span className="text-white/70 font-medium">${fmt(inputs.currentShopPricePerVisit)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Employee time ({inputs.hoursLostPerVisit}h × ${inputs.hourlyEmployeeCost})</span>
                <span className="text-white/70 font-medium">${fmt(inputs.hoursLostPerVisit * inputs.hourlyEmployeeCost)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Lost revenue ({inputs.hoursLostPerVisit}h × ${inputs.revenuePerVehicleHour})</span>
                <span className="text-orange-400 font-medium">${fmt(inputs.hoursLostPerVisit * inputs.revenuePerVehicleHour)}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between">
                <span className="text-xs font-bold text-white">True cost</span>
                <span className="metric-number text-lg text-orange-400 leading-none">${fmt(onsite.currentTrueCostPerVisit)}</span>
              </div>
            </div>
          </div>

          {/* Onsite Fleet */}
          <div className="rounded-xl border border-green-500/25 p-3.5" style={{ background: "oklch(0.22 0.06 155 / 20%)" }}>
            <p className="text-[10px] font-semibold text-green-400/70 uppercase tracking-widest mb-2">Onsite Fleet</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Service price</span>
                <span className="text-white/70 font-medium">$134.99</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Employee time (0.5h × ${inputs.hourlyEmployeeCost})</span>
                <span className="text-white/70 font-medium">${fmt(0.5 * inputs.hourlyEmployeeCost)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Lost revenue (0.5h × ${inputs.revenuePerVehicleHour})</span>
                <span className="text-green-400/80 font-medium">${fmt(0.5 * inputs.revenuePerVehicleHour)}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between">
                <span className="text-xs font-bold text-white">True cost</span>
                <span className="metric-number text-lg text-green-400 leading-none">${fmt(onsite.onsiteTrueCostPerVisit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings per visit callout */}
        <div className="rounded-xl p-3 border border-green-500/25 bg-green-500/8 text-center">
          <p className="text-xs text-white/50 mb-0.5">You save per visit</p>
          <p className="metric-number text-3xl text-green-400 leading-none">${fmt(onsite.savingsPerVisit)}</p>
          <p className="text-[11px] text-white/35 mt-1">
            × {fmt(totalVisits)} annual visits = <span className="font-semibold text-green-300">${fmt(onsite.savingsPerVisit * totalVisits)}/yr</span> in true cost savings
          </p>
        </div>

        <p className="text-[10px] text-white/25 text-center mt-3 leading-relaxed">
          That "cheaper" ${inputs.currentShopPricePerVisit} oil change is actually costing you ${fmt(onsite.currentTrueCostPerVisit)} per visit when you count the clock.
        </p>
      </div>

      {/* Net savings hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-green-500/40 p-6"
        style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 155 / 60%), oklch(0.18 0.04 155 / 40%))" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 via-green-400 to-transparent" />
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-green-500/8 blur-2xl" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-green-400" />
              </div>
              <p className="text-[11px] font-semibold text-green-400/80 uppercase tracking-widest">Your Net Annual Savings</p>
            </div>
            <p className="metric-number text-5xl text-green-400 leading-none">
              <AnimatedNumber value={Math.max(0, onsite.netAnnualSavings)} prefix="$" />
            </p>
            <p className="text-xs text-white/40 mt-1.5">per year — hard costs + soft costs combined</p>
          </div>
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-center px-3 py-2 rounded-xl border border-green-500/25 bg-green-500/10">
              <p className="metric-number text-3xl text-green-400 leading-none">{onsite.savingsPercent}%</p>
              <p className="text-[10px] text-green-400/60 uppercase tracking-wider mt-0.5">Reduction</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/8">
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Hours Recovered</p>
            <p className="metric-number text-xl text-white">
              <AnimatedNumber value={onsite.hoursRecovered} prefix="" suffix=" hrs" />
            </p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Savings / Visit</p>
            <p className="metric-number text-xl text-green-400">${fmt(onsite.savingsPerVisit)}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Onsite Service Cost</p>
            <p className="metric-number text-xl text-white">${fmt(onsite.onsiteServiceCost)}</p>
          </div>
        </div>

        {onsite.netAnnualSavings > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-300/80 leading-relaxed text-center">
              <span className="font-semibold text-green-300">
                {firstName}, your fleet pays ${fmt(onsite.onsiteServiceCost / 12)}/mo
              </span>{" "}
              for Onsite Fleet and recovers{" "}
              <span className="font-semibold text-green-300">
                ${fmt(onsite.netAnnualSavings / 12)}/mo
              </span>{" "}
              in total savings — a net gain every single month.
            </p>
          </div>
        )}
      </div>

      {/* Side-by-side annual comparison table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "oklch(0.19 0.035 255)" }}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/6">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <h3 className="font-display font-bold text-base text-white">Annual Cost Comparison</h3>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-3 gap-0 px-5 py-3 border-b border-white/6 bg-white/2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Line Item</p>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-orange-400/70 uppercase tracking-widest">Current</p>
            <p className="text-[9px] text-white/20 uppercase tracking-wider">(Shop Drop-Off)</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-semibold text-green-400/70 uppercase tracking-widest">Onsite Fleet</p>
            <p className="text-[9px] text-white/20 uppercase tracking-wider">(Mobile Service)</p>
          </div>
        </div>

        {[
          { label: "Service Invoice Cost", current: `$${fmt(onsite.currentAnnualServiceCost)}`, onsite: `$${fmt(onsite.onsiteServiceCost)}`, sub: true },
          { label: "Payroll Wasted", current: `$${fmt(current.annualPayrollWasted)}`, onsite: `$${fmt(onsite.onsitePayrollCost)}`, sub: true },
          { label: "Lost Revenue", current: `$${fmt(current.estimatedLostRevenue)}`, onsite: `$${fmt(onsite.onsiteLostRevenue)}`, sub: true },
          { label: "Total True Annual Cost", current: `$${fmt(current.totalDowntimeCost + onsite.currentAnnualServiceCost)}`, onsite: `$${fmt(onsite.onsiteTotalCost)}`, highlight: true },
        ].map((row) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 gap-0 px-5 py-3 border-b border-white/4 last:border-0 ${'highlight' in row && row.highlight ? "bg-white/3" : ""}`}
          >
            <p className={`text-xs ${'highlight' in row && row.highlight ? "font-bold text-white" : "text-white/50"}`}>{row.label}</p>
            <p className={`text-center text-xs font-semibold ${'highlight' in row && row.highlight ? "text-orange-400" : "text-white/55"}`}>{row.current}</p>
            <p className={`text-center text-xs font-semibold ${'highlight' in row && row.highlight ? "text-green-400" : "text-green-400/65"}`}>{row.onsite}</p>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-0 px-5 py-4 bg-green-500/8 border-t border-green-500/20">
          <p className="text-xs font-bold text-green-300 uppercase tracking-wider">Net Savings</p>
          <p className="text-center text-xs text-white/20">—</p>
          <p className="text-center text-sm font-bold text-green-400">
            ${fmt(Math.max(0, onsite.netAnnualSavings))}/yr
          </p>
        </div>
      </div>

      {/* Pricing transparency note */}
      <div className="rounded-xl p-4 border border-white/6 bg-white/2">
        <p className="text-[11px] text-white/35 leading-relaxed text-center">
          Onsite Fleet pricing: <span className="text-white/55 font-semibold">$134.99/visit</span> — synthetic oil change, full inspection, Carfax update included.
          Onsite service time: <span className="text-white/55 font-semibold">~30 min</span> vs. your current {inputs.hoursLostPerVisit}-hour shop drop-off.
        </p>
      </div>

      {/* CTA */}
      <div className="rounded-xl p-5 border border-orange-500/20 text-center" style={{ background: "oklch(0.65 0.22 28 / 10%)" }}>
        <p className="text-sm font-semibold text-white mb-1">Ready to recover your ${fmt(Math.max(0, onsite.netAnnualSavings))}?</p>
        <p className="text-xs text-white/45 mb-4 leading-relaxed">A fleet specialist will contact you within 1 business day to walk through your numbers and schedule a free onsite demo.</p>
        <a
          href="tel:+1-800-000-0000"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm uppercase tracking-wider btn-glow"
          style={{ background: "oklch(0.65 0.22 28)" }}
        >
          <Phone className="w-4 h-4" />
          Call Now — Free Consultation
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [inputs, setInputs] = useState<CalcInputs>({
    numVehicles: 10,
    hourlyEmployeeCost: 35,
    serviceVisitsPerYear: 4,
    hoursLostPerVisit: 3,
    revenuePerVehicleHour: 85,
    currentShopPricePerVisit: 90,
  });

  const [unlocked, setUnlocked] = useState(false);
  const [leadData, setLeadData] = useState<LeadForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const results = calculate(inputs);
  const onsiteResults = calculateOnsite(inputs, results);
  const set = useCallback((key: keyof CalcInputs) => (v: number) => setInputs((prev) => ({ ...prev, [key]: v })), []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLeadSubmit = (data: LeadForm) => {
    setLeadData(data);
    setUnlocked(true);
    setShowForm(false);
    setTimeout(() => {
      document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.14 0.035 255)" }}>

      {/* ── Nav ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[oklch(0.14_0.035_255/96%)] backdrop-blur-xl border-b border-white/8 shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <img src="/manus-storage/logo-icon_0911ce9e.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white leading-none tracking-widest uppercase">Onsite Fleet</p>
              <p className="text-[9px] text-orange-400/70 leading-none tracking-widest uppercase font-semibold">& Auto Care</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/8 text-green-400 text-xs font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Calculator
            </div>
            <a href="tel:+1-800-000-0000" className="hidden sm:flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-orange-400" />
              Call Us Free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-16 overflow-hidden" style={{ background: "oklch(0.12 0.04 255)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(/manus-storage/hero-bg_584daa7f.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.12_0.04_255/40%)] to-[oklch(0.14_0.035_255)]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-14 pb-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold mb-5 animate-fade-in-up uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Fleet ROI Intelligence
              </div>
              <h1 className="font-display font-extrabold text-white leading-none mb-4 animate-fade-in-up" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", animationDelay: "60ms" }}>
                What Is Your Fleet's<br />
                <span style={{ color: "oklch(0.65 0.22 28)" }}>Downtime Really<br />Costing You?</span>
              </h1>
              <p className="text-white/55 text-base max-w-lg mb-6 animate-fade-in-up leading-relaxed" style={{ animationDelay: "120ms" }}>
                Five inputs. Sixty seconds. See your exact downtime cost — then see how much Onsite Fleet mobile service puts back in your pocket.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/45 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
                {["Under 60 seconds", "Real pricing included", "Side-by-side ROI report"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Live cost preview ticker */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "240ms" }}>
              <div className="rounded-2xl border border-orange-500/20 p-6 min-w-[280px]"
                style={{ background: "oklch(0.65 0.22 28 / 10%)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <p className="text-xs font-semibold text-orange-400/80 uppercase tracking-widest">Live Estimate</p>
                </div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Total Downtime Cost</p>
                <p className="metric-number text-5xl text-white leading-none mb-3">
                  <AnimatedNumber value={results.totalDowntimeCost} prefix="$" />
                </p>
                <div className="h-px bg-white/10 mb-3" />
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Potential Net Savings</p>
                <p className="metric-number text-3xl text-green-400 leading-none">
                  <AnimatedNumber value={Math.max(0, onsiteResults.netAnnualSavings)} prefix="$" />
                </p>
                <p className="text-[10px] text-white/25 mt-3">Updates as you adjust inputs below ↓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator + Results ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_460px] gap-6 lg:gap-8 items-start">

          {/* ── Left: Calculator Inputs ── */}
          <div className="rounded-2xl border border-white/8 p-6 sm:p-8" style={{ background: "oklch(0.19 0.035 255)" }}>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-white leading-none">Your Fleet Numbers</h2>
                <p className="text-xs text-white/40 mt-0.5">Results update instantly as you adjust</p>
              </div>
            </div>

            <div className="space-y-7">
              <SliderInput label="Number of Vehicles in Your Fleet" value={inputs.numVehicles} min={1} max={200} step={1} onChange={set("numVehicles")} hint="Include all vehicles that require regular service" delay={0} />
              <SliderInput label="Average Employee Hourly Cost" value={inputs.hourlyEmployeeCost} min={15} max={150} step={1} prefix="$" onChange={set("hourlyEmployeeCost")} hint="Include wages, benefits, and overhead per hour" delay={60} />
              <SliderInput label="Average Service Visits Per Vehicle Annually" value={inputs.serviceVisitsPerYear} min={1} max={24} step={1} onChange={set("serviceVisitsPerYear")} hint="Oil changes, inspections, and preventive maintenance" delay={120} />
              <SliderInput label="Average Hours Lost Per Service Visit" value={inputs.hoursLostPerVisit} min={0.5} max={16} step={0.5} suffix=" hrs" onChange={set("hoursLostPerVisit")} hint="Time from drop-off to vehicle back in service (typical: 2–4 hrs)" delay={180} />
              <SliderInput label="Estimated Hourly Revenue Per Vehicle" value={inputs.revenuePerVehicleHour} min={10} max={500} step={5} prefix="$" onChange={set("revenuePerVehicleHour")} hint="Revenue your business generates per vehicle per hour of operation" delay={240} />

              {/* Divider before hard cost input */}
              <div className="relative">
                <div className="h-px bg-white/8" />
                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest" style={{ background: "oklch(0.19 0.035 255)" }}>Hard Cost Comparison</span>
              </div>

              <SliderInput label="What You Currently Pay Per Service Visit" value={inputs.currentShopPricePerVisit} min={20} max={400} step={5} prefix="$" onChange={set("currentShopPricePerVisit")} hint="Your current shop invoice price per oil change / service visit" delay={300} />
            </div>

            {/* What you'll see after unlocking */}
            {!unlocked && (
              <div className="mt-7 rounded-xl p-4 border border-green-500/15" style={{ background: "oklch(0.35 0.08 155 / 10%)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <p className="text-xs font-semibold text-green-400/80 uppercase tracking-wider">What you'll unlock</p>
                </div>
                  <div className="space-y-2">
                  {[
                    "Your exact lost revenue figure",
                    "Total annual downtime cost",
                    "True cost per visit (hard + soft)",
                    "Side-by-side ROI comparison",
                    `Your net annual savings with Onsite Fleet`,
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                      <p className="text-xs text-white/50">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust bar */}
            <div className="mt-7 pt-6 border-t border-white/6 grid grid-cols-3 gap-4">
              {[
                { icon: <Shield className="w-4 h-4" />, label: "Trusted by 500+ Fleets" },
                { icon: <Star className="w-4 h-4" />, label: "4.9★ Average Rating" },
                { icon: <Truck className="w-4 h-4" />, label: "Mobile Service Experts" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400/70">{icon}</div>
                  <p className="text-[11px] text-white/35 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Results Panel ── */}
          <div id="results-panel" className="lg:sticky lg:top-20">
            <div className="rounded-2xl border border-white/8 p-6" style={{ background: "oklch(0.19 0.035 255)" }}>

              {/* Panel header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-white leading-none">Cost Breakdown</h2>
                    <p className="text-[11px] text-white/35 mt-0.5">{inputs.numVehicles} vehicles · live estimate</p>
                  </div>
                </div>
                {unlocked ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/12 border border-green-500/20 text-green-400 text-[11px] font-semibold uppercase tracking-wider">
                    <Unlock className="w-3 h-3" />Full ROI
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/12 border border-orange-500/20 text-orange-400 text-[11px] font-semibold uppercase tracking-wider">
                    <Lock className="w-3 h-3" />Partial
                  </div>
                )}
              </div>

              {/* ── UNLOCKED: Full ROI comparison ── */}
              {unlocked && leadData ? (
                <ROIComparison
                  inputs={inputs}
                  current={results}
                  onsite={onsiteResults}
                  leadName={leadData.name}
                />
              ) : (
                <>
                  {/* Result cards — 2 visible, 2 locked */}
                  <div className="space-y-2.5">
                    <ResultCard icon={<Clock className="w-4 h-4" />} label="Annual Employee Hours Lost" value={results.annualHoursLost} prefix="" suffix=" hrs" locked={false} delay={0} />
                    <ResultCard icon={<DollarSign className="w-4 h-4" />} label="Annual Payroll Wasted" value={results.annualPayrollWasted} locked={false} delay={60} />
                    <ResultCard icon={<TrendingDown className="w-4 h-4" />} label="Estimated Lost Revenue" value={results.estimatedLostRevenue} locked={true} unlocked={false} delay={120} />
                    <ResultCard icon={<AlertTriangle className="w-4 h-4" />} label="Total Annual Downtime Cost" value={results.totalDowntimeCost} locked={true} unlocked={false} highlight={true} large={true} delay={180} />
                  </div>

                  {/* Partial total teaser */}
                  <div className="mt-4 rounded-xl p-4 border border-white/6" style={{ background: "oklch(0.16 0.04 255)" }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1">Visible cost so far</p>
                        <p className="metric-number text-3xl text-white leading-none">
                          <AnimatedNumber value={results.annualPayrollWasted} prefix="$" />
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-orange-400 font-semibold">+ 2 locked</p>
                        <p className="text-[10px] text-white/25">figures hidden</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500" style={{ width: "50%" }} />
                    </div>
                    <p className="text-[10px] text-white/25 mt-1.5">50% of your cost report is visible</p>
                  </div>

                  {/* Savings teaser */}
                  <div className="mt-3 rounded-xl p-3.5 border border-green-500/15" style={{ background: "oklch(0.35 0.08 155 / 8%)" }}>
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign className="w-4 h-4 text-green-400 shrink-0" />
                      <p className="text-xs text-green-300/70 leading-relaxed">
                        <span className="font-semibold text-green-300">Unlock to see your ROI comparison</span> — including how much Onsite Fleet mobile service saves your fleet annually vs. shop drop-offs.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/6 my-4" />

                  {/* Unlock gate */}
                  {!showForm ? (
                    <div>
                      <p className="text-sm text-white/55 mb-4 leading-relaxed">
                        <span className="text-orange-400 font-semibold">Your full cost + savings report is one step away.</span> Enter your details to unlock the complete breakdown and your personalized ROI comparison.
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn-glow w-full py-3.5 rounded-xl font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        style={{ background: "oklch(0.65 0.22 28)" }}
                      >
                        <Unlock className="w-4 h-4" />
                        Unlock Full ROI Report
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                          <Unlock className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        Unlock Your Full ROI Report
                      </p>
                      <LeadGateForm onSubmit={handleLeadSubmit} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <div className="text-center">
            <h2 className="font-display font-bold text-3xl text-white">How Onsite Fleet Eliminates Downtime</h2>
            <p className="text-white/45 text-sm mt-1">We come to your fleet. No drop-offs. No waiting. No lost revenue.</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { step: "01", icon: <Phone className="w-5 h-5" />, title: "Schedule Around Your Fleet", desc: "Book a service window that works around your operations — not ours. Same-day and next-day availability." },
            { step: "02", icon: <Wrench className="w-5 h-5" />, title: "We Come to Your Location", desc: "Certified technicians arrive at your yard, depot, or job site fully equipped. Your vehicles never leave." },
            { step: "03", icon: <CheckCircle2 className="w-5 h-5" />, title: "Zero Drop-Off. Zero Lost Revenue.", desc: "Service completes in ~30 minutes onsite. Full inspection report and Carfax update included — every visit." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="rounded-2xl border border-white/8 p-6 relative overflow-hidden group hover:border-orange-500/25 transition-all duration-300" style={{ background: "oklch(0.19 0.035 255)" }}>
              <div className="absolute top-4 right-4 font-display font-extrabold text-5xl text-white/4 leading-none select-none">{step}</div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 mb-4">{icon}</div>
              <h3 className="font-display font-bold text-lg text-white mb-2 leading-tight">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl border border-orange-500/20 p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 28 / 15%), oklch(0.65 0.22 28 / 5%))" }}>
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold mb-5 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Free Fleet Assessment
            </div>
            <h2 className="font-display font-extrabold text-white mb-4 leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Can't Make Money<br />
              <span style={{ color: "oklch(0.65 0.22 28)" }}>If the Truck's Down.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
              Use the calculator above to see your exact numbers. Then let a fleet specialist show you how Onsite Fleet puts that money back in your pocket — starting with your first service.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth" }); if (!unlocked) setShowForm(true); }}
                className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-sm uppercase tracking-wider"
                style={{ background: "oklch(0.65 0.22 28)" }}
              >
                <Calculator className="w-4 h-4" />
                {unlocked ? "View My ROI Report" : "Calculate My Savings"}
              </button>
              <a href="tel:+1-800-000-0000"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/80 text-sm uppercase tracking-wider border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200">
                <Phone className="w-4 h-4 text-orange-400" />
                Call Us Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <img src="/manus-storage/logo-icon_0911ce9e.png" alt="" className="w-4 h-4 object-contain" />
            </div>
            <p className="text-sm font-semibold text-white/50 uppercase tracking-widest">Onsite Fleet & Auto Care</p>
          </div>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Onsite Fleet & Auto Care. All rights reserved.</p>
          <p className="text-xs text-white/20">Calculator estimates based on user-provided inputs. Onsite pricing at $134.99/visit.</p>
        </div>
      </footer>
    </div>
  );
}
