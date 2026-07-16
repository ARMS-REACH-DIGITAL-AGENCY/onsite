# Fleet Downtime Cost Calculator — Design Brainstorm

## Three Stylistic Approaches

### Approach A — "Industrial Precision"
A dark, high-contrast industrial aesthetic with steel-grey tones and amber warning accents. Feels like a fleet management dashboard — authoritative and data-driven.
**Probability:** 0.07

### Approach B — "Command & Clarity" ✅ CHOSEN
A bold, confident B2B tool aesthetic. Deep navy foundation with a vivid orange-red accent — the color of urgency and cost. Clean sans-serif typography with strong numerical hierarchy. Asymmetric two-column layout on desktop: calculator inputs on the left, live results building on the right. The numbers feel alive as you type.
**Probability:** 0.08

### Approach C — "Clean Consultancy"
Minimal white space, soft slate grays, and a single teal accent. Feels like a McKinsey tool — trustworthy but perhaps too generic.
**Probability:** 0.04

---

## Chosen Approach: "Command & Clarity"

### Design Movement
Bold B2B SaaS meets financial analytics dashboard. Inspired by enterprise tools like Stripe's dashboard and Figma's landing pages — confident, purposeful, zero fluff.

### Core Principles
1. **Numbers are the hero** — every design decision amplifies the impact of the cost figures
2. **Urgency without alarm** — the orange-red accent signals "this costs you money" without being aggressive
3. **Progressive disclosure** — partial results tease the full picture, driving form completion
4. **Trust through precision** — clean lines, exact formatting, professional typography signal credibility

### Color Philosophy
- **Background:** Deep navy `oklch(0.18 0.04 255)` — commands authority, feels premium
- **Surface:** Slightly lighter navy `oklch(0.22 0.035 255)` — card surfaces
- **Accent / CTA:** Vivid orange-red `oklch(0.65 0.22 28)` — urgency, cost, action
- **Success / Positive:** Amber `oklch(0.78 0.16 75)` — highlights key numbers
- **Text:** Near-white `oklch(0.95 0.005 255)` with muted `oklch(0.65 0.02 255)` for secondary
- **Border:** Subtle `oklch(1 0 0 / 12%)` — structure without noise

### Layout Paradigm
Asymmetric two-panel layout on desktop:
- **Left panel (55%):** Step-by-step calculator inputs with sliders and number fields
- **Right panel (45%):** Sticky live results panel — numbers animate as inputs change
- On mobile: stacked, calculator first, results second
- Hero section above: full-width with bold headline and subhead
- Below calculator: trust signals, then CTA footer

### Signature Elements
1. **Animated cost counter** — numbers count up/animate when values change
2. **Blurred/locked result cards** — 2 of 4 result metrics are blurred with a lock icon until form is submitted
3. **Progress indicator** — subtle step dots showing calculator completion progress

### Interaction Philosophy
Every keystroke produces immediate visual feedback. The results panel responds in real-time. The "unlock" moment (after form submission) is a satisfying reveal animation — blur lifts, numbers count up, full report appears.

### Animation
- Input changes: 200ms ease-out number transitions
- Results panel: staggered card entrance (60ms delay between cards)
- Lock/unlock: 400ms blur fade with scale from 0.97 to 1.0
- CTA button: scale(0.97) on active, 160ms ease-out
- Page entrance: hero fades in from below (300ms, staggered)

### Typography System
- **Display / Headlines:** `Barlow Condensed` — bold, industrial, space-efficient for large numbers
- **Body / Labels:** `Inter` — clean, readable, professional
- **Numbers / Metrics:** `Barlow Condensed` Bold — large, commanding
- Hierarchy: 72px display → 36px section → 24px card title → 16px body → 13px label

### Brand Essence
**"Know your true fleet cost — in 60 seconds."** For fleet managers and business owners who suspect downtime is costing them more than they realize. The only calculator built specifically for mobile auto care ROI.

Personality: **Authoritative. Precise. Urgent.**

### Brand Voice
Headlines are direct and challenge assumptions. CTAs are specific, not vague.
- "Your fleet lost $47,200 last year. Here's the breakdown."
- "Unlock your full cost report — it takes 30 seconds."
- Ban: "Welcome to our calculator" / "Get started today"

### Wordmark & Logo
A bold shield/wrench hybrid mark — geometric, angular. The letter "O" formed from a gear or tire tread. Navy background, orange accent stroke.

### Signature Brand Color
**Vivid orange-red** `oklch(0.65 0.22 28)` — unmistakably "cost" and "urgency."

---

## Style Decisions
- Use `Barlow Condensed` for all metric numbers and section headers
- Use `Inter` for all body copy, labels, and form fields
- Keep the results panel sticky on desktop (position: sticky, top: 2rem)
- Blur intensity for locked cards: `blur(8px)` with a semi-transparent overlay
- All monetary values formatted with `$` prefix and comma separators
