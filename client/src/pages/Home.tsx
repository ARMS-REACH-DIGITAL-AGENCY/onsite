/**
 * Fleet Downtime Cost Calculator — Onsite Fleet & Auto Care
 * Design: "Command & Clarity" — deep navy + orange-red accent
 * Font: Barlow Condensed (display/numbers) + Inter (body/labels)
 * Layout: Asymmetric two-panel on desktop, stacked on mobile
 * Style decisions:
 *   - Hero includes live cost preview above fold (command center feel)
 *   - Largest monetary figure dominates its section via Barlow Condensed Bold
 *   - Angular shield/wrench brand language repeats in badges, locks, step markers
 *   - Numbers are the hero — orange/amber reserved for cost signals
 *   - Voice stays direct, quantified, assumption-challenging throughout
 */

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useState, useCallback, useEffect } from "react";
import {
  Lock,
  Unlock,
  ChevronRight,
  CheckCircle2,
  TrendingDown,
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
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalcInputs {
  numVehicles: number;
  hourlyEmployeeCost: number;
  serviceVisitsPerYear: number;
  hoursLostPerVisit: number;
  revenuePerVehicleHour: number;
}

interface CalcResults {
  annualHoursLost: number;
  annualPayrollWasted: number;
  estimatedLostRevenue: number;
  totalDowntimeCost: number;
}

interface LeadForm {
  name: string;
  company: string;
  email: string;
  phone: string;
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculate(inputs: CalcInputs): CalcResults {
  const { numVehicles, hourlyEmployeeCost, serviceVisitsPerYear, hoursLostPerVisit, revenuePerVehicleHour } = inputs;
  const annualHoursLost = numVehicles * serviceVisitsPerYear * hoursLostPerVisit;
  const annualPayrollWasted = annualHoursLost * hourlyEmployeeCost;
  const estimatedLostRevenue = annualHoursLost * revenuePerVehicleHour;
  const totalDowntimeCost = annualPayrollWasted + estimatedLostRevenue;
  return { annualHoursLost, annualPayrollWasted, estimatedLostRevenue, totalDowntimeCost };
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
}

function ResultCard({ icon, label, value, prefix = "$", suffix = "", locked = false, highlight = false, delay = 0, unlocked = false, large = false }: ResultCardProps) {
  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 animate-fade-in-up overflow-hidden ${
        highlight
          ? "border-orange-500/40 bg-gradient-to-br from-[oklch(0.65_0.22_28/18%)] to-[oklch(0.65_0.22_28/8%)]"
          : "border-white/8 bg-white/4"
      } ${large ? "p-5" : "p-4"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Angular brand accent line */}
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent" />
      )}

      <div className={locked && !unlocked ? "blur-sm select-none pointer-events-none" : unlocked ? "animate-unlock" : ""}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${highlight ? "bg-orange-500/20 text-orange-400" : "bg-white/6 text-white/50"}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">{label}</p>
            <p className={`metric-number leading-none ${highlight ? "text-orange-400" : "text-white"} ${large ? "text-4xl" : "text-2xl"}`}>
              <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
            </p>
          </div>
        </div>
      </div>

      {locked && !unlocked && (
        <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center"
          style={{ background: "oklch(0.17 0.04 255 / 75%)", backdropFilter: "blur(6px)" }}>
          {/* Angular shield lock icon */}
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
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Unlocking Report…</>
        ) : (
          <><Unlock className="w-4 h-4" />Unlock My Full Cost Report<ArrowRight className="w-4 h-4" /></>
        )}
      </button>
      <p className="text-center text-[11px] text-white/25 leading-relaxed">
        No spam. We'll use this to send your personalized report and follow up with a free consultation.
      </p>
    </form>
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
  });

  const [unlocked, setUnlocked] = useState(false);
  const [leadData, setLeadData] = useState<LeadForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const results = calculate(inputs);
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

      {/* ── Hero — Command Center above-fold ── */}
      <section className="relative pt-16 overflow-hidden" style={{ background: "oklch(0.12 0.04 255)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(/manus-storage/hero-bg_584daa7f.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.12_0.04_255/40%)] to-[oklch(0.14_0.035_255)]" />

        {/* Subtle grid overlay — command dashboard feel */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Above-fold: split layout with live cost preview */}
          <div className="pt-14 pb-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Left: headline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-semibold mb-5 animate-fade-in-up uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Fleet Cost Intelligence
              </div>
              <h1 className="font-display font-extrabold text-white leading-none mb-4 animate-fade-in-up" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", animationDelay: "60ms" }}>
                What Is Your Fleet's<br />
                <span style={{ color: "oklch(0.65 0.22 28)" }}>Downtime Really<br />Costing You?</span>
              </h1>
              <p className="text-white/55 text-base max-w-lg mb-6 animate-fade-in-up leading-relaxed" style={{ animationDelay: "120ms" }}>
                Five inputs. Sixty seconds. A precise dollar figure that most fleet managers have never calculated — until now.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white/45 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
                {["Under 60 seconds", "No credit card", "Personalized report"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: live cost preview ticker — command center feel */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: "240ms" }}>
              <div className="rounded-2xl border border-orange-500/20 p-6 min-w-[260px]"
                style={{ background: "oklch(0.65 0.22 28 / 10%)", backdropFilter: "blur(12px)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <p className="text-xs font-semibold text-orange-400/80 uppercase tracking-widest">Live Estimate</p>
                </div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Annual Payroll Wasted</p>
                <p className="metric-number text-5xl text-white leading-none mb-3">
                  <AnimatedNumber value={results.annualPayrollWasted} prefix="$" />
                </p>
                <div className="h-px bg-white/10 mb-3" />
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Hours Lost Per Year</p>
                <p className="metric-number text-3xl text-orange-400 leading-none">
                  <AnimatedNumber value={results.annualHoursLost} suffix=" hrs" prefix="" />
                </p>
                <p className="text-[10px] text-white/25 mt-3">Updates as you adjust inputs below ↓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator + Results ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">

          {/* ── Left: Calculator Inputs ── */}
          <div className="rounded-2xl border border-white/8 p-6 sm:p-8" style={{ background: "oklch(0.19 0.035 255)" }}>
            {/* Section header with angular brand accent */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
                <Calculator className="w-4.5 h-4.5 text-orange-400" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-white leading-none">Your Fleet Numbers</h2>
                <p className="text-xs text-white/40 mt-0.5">Results update instantly as you adjust</p>
              </div>
            </div>

            <div className="space-y-7">
              <SliderInput label="Number of Vehicles in Your Fleet" value={inputs.numVehicles} min={1} max={200} step={1} onChange={set("numVehicles")} hint="Include all vehicles that require regular service" delay={0} />
              <SliderInput label="Average Employee Hourly Cost" value={inputs.hourlyEmployeeCost} min={15} max={150} step={1} prefix="$" onChange={set("hourlyEmployeeCost")} hint="Include wages, benefits, and overhead per hour" delay={60} />
              <SliderInput label="Average Service Visits Per Vehicle Annually" value={inputs.serviceVisitsPerYear} min={1} max={24} step={1} onChange={set("serviceVisitsPerYear")} hint="Oil changes, inspections, repairs, and preventive maintenance" delay={120} />
              <SliderInput label="Average Hours Lost Per Service Visit" value={inputs.hoursLostPerVisit} min={0.5} max={16} step={0.5} suffix=" hrs" onChange={set("hoursLostPerVisit")} hint="Time from drop-off to vehicle back in service" delay={180} />
              <SliderInput label="Estimated Hourly Revenue Per Vehicle" value={inputs.revenuePerVehicleHour} min={10} max={500} step={5} prefix="$" onChange={set("revenuePerVehicleHour")} hint="Revenue your business generates per vehicle per hour of operation" delay={240} />
            </div>

            {/* Trust bar with angular brand marks */}
            <div className="mt-8 pt-6 border-t border-white/6 grid grid-cols-3 gap-4">
              {[
                { icon: <Shield className="w-4 h-4" />, label: "Trusted by 500+ Fleets" },
                { icon: <Star className="w-4 h-4" />, label: "4.9★ Average Rating" },
                { icon: <Wrench className="w-4 h-4" />, label: "Mobile Service Experts" },
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
                    <Unlock className="w-3 h-3" />Full
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/12 border border-orange-500/20 text-orange-400 text-[11px] font-semibold uppercase tracking-wider">
                    <Lock className="w-3 h-3" />Partial
                  </div>
                )}
              </div>

              {/* Result cards */}
              <div className="space-y-2.5">
                <ResultCard icon={<Clock className="w-4 h-4" />} label="Annual Employee Hours Lost" value={results.annualHoursLost} prefix="" suffix=" hrs" locked={false} delay={0} />
                <ResultCard icon={<DollarSign className="w-4 h-4" />} label="Annual Payroll Wasted" value={results.annualPayrollWasted} locked={false} delay={60} />
                <ResultCard icon={<TrendingDown className="w-4 h-4" />} label="Estimated Lost Revenue" value={results.estimatedLostRevenue} locked={!unlocked} unlocked={unlocked} delay={120} />
                <ResultCard icon={<AlertTriangle className="w-4 h-4" />} label="Total Annual Downtime Cost" value={results.totalDowntimeCost} locked={!unlocked} unlocked={unlocked} highlight={true} large={true} delay={180} />
              </div>

              {/* Partial total teaser */}
              {!unlocked && (
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
              )}

              <div className="border-t border-white/6 my-4" />

              {/* Unlock gate */}
              {!unlocked && (
                <div>
                  {!showForm ? (
                    <div>
                      <p className="text-sm text-white/55 mb-4 leading-relaxed">
                        <span className="text-orange-400 font-semibold">Your lost revenue and true total are locked.</span> Enter your details to unlock the full breakdown and receive a free fleet consultation.
                      </p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn-glow w-full py-3.5 rounded-xl font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        style={{ background: "oklch(0.65 0.22 28)" }}
                      >
                        <Unlock className="w-4 h-4" />
                        Unlock Full Report
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                          <Unlock className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        Unlock Your Full Report
                      </p>
                      <LeadGateForm onSubmit={handleLeadSubmit} />
                    </div>
                  )}
                </div>
              )}

              {/* Post-unlock success */}
              {unlocked && leadData && (
                <div className="rounded-xl p-4 border border-green-500/20 animate-unlock" style={{ background: "oklch(0.18 0.04 155 / 25%)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/25 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Report unlocked, {leadData.name.split(" ")[0]}!</p>
                      <p className="text-xs text-white/50 mb-3 leading-relaxed">
                        Your full cost breakdown is now visible. A specialist will contact you at <span className="text-white/75">{leadData.email}</span> within 1 business day.
                      </p>
                      <a href="tel:+1-800-000-0000" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                        <Phone className="w-3.5 h-3.5" />Prefer to talk now? Call us free
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Savings teaser below panel */}
            {!unlocked && (
              <div className="mt-3 rounded-xl p-4 border border-orange-500/15 animate-fade-in-up" style={{ background: "oklch(0.65 0.22 28 / 7%)" }}>
                <p className="text-xs text-orange-300/75 text-center leading-relaxed">
                  <span className="font-semibold text-orange-400">Onsite mobile service</span> eliminates drop-off time entirely — saving fleets{" "}
                  <span className="font-semibold text-orange-400">60–80% of downtime hours</span> and thousands annually.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Angular section header */}
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
            { step: "03", icon: <CheckCircle2 className="w-5 h-5" />, title: "Zero Drop-Off. Zero Lost Revenue.", desc: "Service happens while your drivers work. Every hour your vehicles stay in service is revenue you keep." },
          ].map(({ step, icon, title, desc }, i) => (
            <div
              key={step}
              className="rounded-2xl p-6 border border-white/6 relative overflow-hidden group hover:border-orange-500/25 transition-all duration-300 animate-fade-in-up"
              style={{ background: "oklch(0.19 0.035 255)", animationDelay: `${i * 80}ms` }}
            >
              {/* Top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Large step number */}
              <div className="absolute top-3 right-4 font-display font-extrabold text-6xl text-white/3 leading-none select-none group-hover:text-orange-500/6 transition-colors">
                {step}
              </div>
              <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">{icon}</div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative overflow-hidden" style={{ background: "oklch(0.17 0.04 255)" }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(/manus-storage/hero-bg_584daa7f.jpg)`, backgroundSize: "cover", backgroundPosition: "center bottom" }} />
        {/* Angular grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/25 bg-orange-500/8 text-orange-400 text-xs font-semibold mb-5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Stop paying for downtime
          </div>
          <h2 className="font-display font-extrabold text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>
            Your Fleet Deserves<br />
            <span style={{ color: "oklch(0.65 0.22 28)" }}>Better Than a Shop Queue.</span>
          </h2>
          <p className="text-white/55 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Get a free fleet maintenance assessment and a precise calculation of how much Onsite Fleet can save your business this year.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth" }); if (!unlocked) setShowForm(true); }}
              className="btn-glow px-8 py-4 rounded-xl font-semibold text-white text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              style={{ background: "oklch(0.65 0.22 28)" }}
            >
              {unlocked ? "View My Full Report" : "Get My Free Cost Report"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="tel:+1-800-000-0000" className="px-8 py-4 rounded-xl font-semibold text-white/70 text-sm uppercase tracking-wider border border-white/15 hover:border-white/35 hover:text-white transition-all flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call Us Free
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-8" style={{ background: "oklch(0.12 0.03 255)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
              <img src="/manus-storage/logo-icon_0911ce9e.png" alt="" className="w-4 h-4 object-contain opacity-60" />
            </div>
            <p className="text-sm text-white/35">© 2024 Onsite Fleet & Auto Care. All rights reserved.</p>
          </div>
          <p className="text-xs text-white/20 text-center sm:text-right max-w-sm">
            Calculator results are estimates based on your inputs. Actual savings may vary. Contact us for a detailed fleet assessment.
          </p>
        </div>
      </footer>
    </div>
  );
}
