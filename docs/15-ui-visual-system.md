# Levelplay Constructions — Visual Design System

> A premium, trustworthy visual language for the Levelplay platform. Refines the existing **navy + amber** palette into a disciplined token set for Tailwind CSS + shadcn/ui + Framer Motion + lucide-react. All tokens map to the existing CSS-variable architecture in `src/app/globals.css` and `tailwind.config.ts`.

---

## 1. Brand Direction

**Personality:** *Solid. Engineered. Reassuring.* We are selling trust on the single largest purchase most Indian families ever make — a home. The visual system must feel like a structural engineer's drawing married to a premium developer's brochure: precise, warm, and confident, never flashy.

**Three brand pillars → visual translation**

| Pillar | Feeling | Visual lever |
|---|---|---|
| **Structural integrity** | "These people build things that last." | Deep navy base, strong grid, generous whitespace, sharp 1px hairlines, blueprint motifs. |
| **Human warmth** | "They'll look after my family's money & dream." | Warm amber/terracotta accent, soft paper neutrals, rounded radii, gentle shadows. |
| **Modern competence** | "A real digital portal, not a WhatsApp group." | Clean Inter/Sora type, data-dense but breathable tables, subtle Framer motion. |

**Palette verdict — refine, don't replace.** The current navy `#0d1b2a` + amber `#e76f51` is a strong, ownable pairing (terracotta reads as *warm/Indian/earth/brick*, navy as *trust/engineering*). Issues to fix:

1. The codebase currently has **two competing ambers** — `#e76f51` (terracotta) used as `--primary`, and `#f4a261` + `#ffb703` (gold) floating around. This dilutes the brand. **Resolution:** Promote terracotta `#E76F51` to the single hero accent; demote `#ffb703` gold to a *sparing* highlight (eyebrows, ratings, "premium" flourishes only). Drop `#f4a261` as a named token (keep only as a hover/tint step).
2. Navy `#0d1b2a` is excellent for surfaces but too heavy for *body text* — introduce a true neutral ink ramp so portal tables stay legible.
3. Add a proper **semantic** ramp (success/warning/danger/info) that harmonizes with the warm palette rather than the current ad-hoc `#2a9d8f / #e9c46a / #e63946`.

Net: same recognizable brand, tightened into a system.

---

## 2. Tailwind Theme Tokens

### 2.1 Color — brand ramps (hex)

```
NAVY (primary surface / "ink-navy")
  navy-950  #07101B   ← deepest, footer/hero overlays
  navy-900  #0D1B2A   ← BRAND NAVY (current)
  navy-800  #14243A
  navy-700  #1B263B   ← navy-2 (current)
  navy-600  #243450
  navy-500  #2F4368

SLATE / STEEL (secondary text & strokes on light)
  slate-600 #415A77   ← brand slate (muted-foreground)
  slate-400 #778DA9   ← steel (disabled, captions)
  slate-200 #C4CCD8
  slate-100 #E3E7ED   ← borders/inputs

TERRACOTTA (primary accent / CTA)
  terra-700 #B5462C   ← active/pressed
  terra-600 #D65A3C   ← hover (matches current btn hover)
  terra-500 #E76F51   ← BRAND ACCENT (current --primary)
  terra-400 #F19078   ← tints
  terra-100 #FBE4DC   ← badge bg / focus ring tint

GOLD (sparing highlight only)
  gold-500  #FFB703
  gold-100  #FFF1CC

NEUTRALS (warm paper)
  paper     #F7F7F5   ← app background
  surface   #FFFFFF   ← cards
  ink-900   #1A1A1A   ← headings
  ink-700   #33373D   ← body
  ink-500   #5B6470   ← secondary body
```

### 2.2 Semantic ramp (light)

| Token | Hex | Use |
|---|---|---|
| `success` | `#15803D` (text) / `#DCFCE7` (bg) | PAID, COMPLETED, online |
| `warning` | `#B45309` (text) / `#FEF3C7` (bg) | INVOICED, ON_HOLD, due-soon |
| `danger` | `#DC2626` (text) / `#FEE2E2` (bg) | OVERDUE, destructive |
| `info` | `#1D4ED8` (text) / `#DBEAFE` (bg) | LEAD, DESIGN, neutral status |

> Status colors are intentionally desaturated-on-tint (text-on-100) so badges read as *labels*, not alarms — critical for a payment table that shows many states at once.

### 2.3 CSS variables (replace `:root` block in `globals.css`)

These keep shadcn/ui driven by one source of truth. HSL for shadcn compatibility.

```css
@layer base {
  :root {
    --background: 60 11% 96%;        /* paper #F7F7F5 */
    --foreground: 213 6% 13%;        /* ink-900 */
    --card: 0 0% 100%;
    --card-foreground: 213 6% 13%;
    --popover: 0 0% 100%;
    --popover-foreground: 213 6% 13%;

    --primary: 11 76% 61%;           /* terracotta #E76F51 */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 51% 11%;        /* navy-900 #0D1B2A */
    --secondary-foreground: 0 0% 100%;

    --muted: 60 9% 94%;
    --muted-foreground: 213 28% 36%; /* slate-600 */
    --accent: 11 76% 61%;            /* keep accent == primary terracotta */
    --accent-foreground: 0 0% 100%;

    --success: 142 72% 29%;
    --warning: 35 92% 36%;
    --info: 224 76% 48%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 214 18% 90%;           /* slate-100 */
    --input: 214 18% 90%;
    --ring: 11 76% 61%;              /* terracotta focus ring */

    --radius: 0.75rem;               /* 12px base (down from 14 — tighter, more "engineered") */
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-display: 'Sora', var(--font-sans);
  }

  .dark {
    --background: 210 45% 8%;         /* navy-950 */
    --foreground: 60 9% 92%;         /* mist */
    --card: 210 40% 11%;             /* navy-800 */
    --card-foreground: 60 9% 92%;
    --popover: 210 40% 11%;
    --popover-foreground: 60 9% 92%;
    --primary: 11 80% 64%;           /* lift terracotta for contrast */
    --primary-foreground: 210 51% 8%;
    --secondary: 213 28% 26%;        /* slate-600 darkened */
    --secondary-foreground: 60 9% 92%;
    --muted: 210 35% 15%;
    --muted-foreground: 214 17% 64%; /* steel */
    --accent: 11 80% 64%;
    --accent-foreground: 210 51% 8%;
    --border: 210 30% 20%;
    --input: 210 30% 20%;
    --ring: 11 80% 64%;
  }
}
```

> **Migration note:** the legacy hand-rolled `.btn / .card / .hero` block in `globals.css` should be deleted as shadcn components land — it duplicates the token system and is the source of the double-amber drift. Keep `.env-banner` (recolor gold→`accent`/muted) until the portal nav owns it.

### 2.4 Typography

**Fonts (Google Fonts, loaded via `next/font`):**
- **Display / headings → Sora** (geometric, architectural, confident). Weights 600/700/800.
- **Body / UI → Inter** (neutral, superb at small sizes for data tables). Weights 400/500/600.
- **Numeric / data → Inter with `font-variant-numeric: tabular-nums`** on all payment & metric figures so columns align.

```ts
// app/layout.tsx
import { Inter, Sora } from 'next/font/google';
const inter = Inter({ subsets:['latin'], variable:'--font-sans', display:'swap' });
const sora  = Sora({ subsets:['latin'], weight:['600','700','800'], variable:'--font-display', display:'swap' });
// <html className={`${inter.variable} ${sora.variable}`}>
```

**Type scale** (extend `theme.fontSize`):

| Token | Size / line-height | Tracking | Font | Use |
|---|---|---|---|---|
| `display` | clamp(2.5rem, 5vw, 4rem) / 1.05 | -0.025em | Sora 800 | Hero H1 |
| `h1` | 2.25rem / 1.1 | -0.02em | Sora 700 | Page titles |
| `h2` | 1.75rem / 1.15 | -0.015em | Sora 700 | Section heads |
| `h3` | 1.25rem / 1.25 | -0.01em | Sora 600 | Card titles |
| `lead` | 1.2rem / 1.6 | 0 | Inter 400 | Hero/section lede |
| `base` | 1rem / 1.6 | 0 | Inter 400 | Body |
| `sm` | 0.875rem / 1.5 | 0 | Inter 500 | Table cells, meta |
| `xs` | 0.75rem / 1.4 | 0.04em | Inter 600 | Captions |
| `eyebrow` | 0.78rem / 1 | 0.12em **uppercase** | Inter 700 | Section eyebrows |

### 2.5 Spacing, radius, shadows

**Spacing** — stay on Tailwind's 4px base; standardize section rhythm via custom tokens:
```
section-y: 5rem (mobile 3.5rem)   card-pad: 1.5rem   gutter: 1.25rem (container padding, unchanged)
```
Container max-width stays **1180px** (current).

**Radius** — base `0.75rem` (12px). Scale: `sm 6px / md 10px / lg 12px / xl 16px / 2xl 20px / full`. Pills (`full`) reserved for badges & marketing CTAs; portal buttons/inputs use `md`–`lg` (more "software", less "brochure").

**Shadows** — navy-tinted, layered, restrained:
```ts
boxShadow: {
  xs:  '0 1px 2px rgba(13,27,42,0.06)',
  sm:  '0 2px 8px rgba(13,27,42,0.08)',     // resting cards
  md:  '0 8px 24px rgba(13,27,42,0.10)',    // hover cards, dropdowns
  lg:  '0 18px 40px rgba(13,27,42,0.12)',   // modals, hero floats (current --shadow)
  ring:'0 0 0 3px rgba(231,111,81,0.18)',   // terracotta focus
}
```

**Dark mode:** ship tokens now (`.dark` block above), default the **portal** to a navy dark mode option (engineers/site staff on-site in bright sun prefer high-contrast; clients keep light). Marketing site stays light-only. Gate via a `next-themes` toggle in portal chrome.

---

## 3. shadcn/ui Component Styling (premium pass)

**Buttons** (`variant`):
- `default` (primary): `bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-terra-600 active:translate-y-px active:bg-terra-700 focus-visible:ring`. Height `h-11` for marketing CTAs, `h-9` portal.
- `secondary`: solid `bg-secondary` (navy) `text-white hover:bg-navy-700`.
- `outline`: `border border-input bg-transparent hover:bg-muted` — navy text.
- `ghost`: transparent, `hover:bg-muted`.
- `link`: terracotta underline-on-hover.
- All buttons: `gap-2` for leading lucide icon (16px), `transition` on transform+bg only. Marketing hero buttons may use `rounded-full`.

**Cards:** `bg-card border border-border/70 rounded-xl shadow-sm`. Hover (interactive cards only): `hover:-translate-y-1 hover:shadow-md transition`. Header uses `h3` Sora; a **2px terracotta or navy top-accent bar** (`before:` pseudo or a `border-t-2`) for "feature" / KPI cards to add structure. Never more than one accent color per card.

**Tables** (the portal's workhorse — payments, deliveries, documents):
- Header: `bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground font-semibold`, sticky on scroll.
- Rows: `border-b border-border`, `hover:bg-muted/40`, comfortable `h-12` / `py-3` cells.
- Zebra optional; prefer hairlines over stripes for the "engineered" feel.
- Numeric columns right-aligned, `tabular-nums`, currency in `text-ink-900 font-medium`.
- Row-level status via Badge (below). Add a left 3px colored rail on rows in critical state (OVERDUE → danger) for fast scanning.

**Badges** (status, see §5 mapping): `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold`. Use **tint background + dark text** (`bg-success/12 text-success`), optional 6px leading dot. Define a `<StatusBadge status=... />` wrapper so Project/Payment/Delivery enums map centrally.

**Nav / Sidebar:**
- **Public header:** sticky, `bg-navy-900/92 backdrop-blur-md` (current), mist links → white on hover, single terracotta "Get a Quote" CTA pill. Logo mark = gradient navy→terracotta square (replace current gold gradient to unify accent).
- **Portal sidebar:** `bg-navy-900` (or `bg-card` in light), 248px wide, lucide icon + label rows. Active item: `bg-white/8` (dark) / `bg-terra-100 text-terra-700` (light) with a 3px terracotta left rail. Section groups labeled in `eyebrow` style. Collapsible to icon-rail (64px) with Framer width animation. Role badge + avatar pinned at bottom.

**Inputs / forms:** `h-10 rounded-lg border-input bg-surface focus-visible:ring focus-visible:border-primary`. Labels `text-sm font-semibold text-navy-900`. Error state `border-danger ring-danger/15` + helper text in `danger`. Reuse existing `.field` focus styling — already on-brand.

**Motion (Framer):** keep it *structural and quick* — `duration: 0.2–0.35s`, `ease: [0.22,1,0.36,1]`. Patterns: page sections fade-up 12px on scroll (`whileInView`, `once`), stat counters count-up, card hover lift, sidebar collapse, dialog scale-in 0.97→1. No bounce, no parallax overload — restraint signals professionalism.

---

## 4. Public Marketing Site Visual Upgrades

**Hero** — replace the inline SVG-skyline data-URI with a real treatment:
- Full-bleed navy section, background = construction/finished-home photo at 40% opacity under a `linear-gradient(navy-950/88 → navy-900/70)` overlay; add a faint **blueprint grid** SVG (steel lines, 6% opacity) for the engineering motif.
- Left-aligned content, max 720px: gold/terracotta `eyebrow` ("KARNATAKA'S TURNKEY BUILDERS"), Sora 800 `display` headline ("Build with confidence. Track every brick."), `lead` subcopy, two CTAs (primary terracotta "Get a free quote" + ghost "View projects").
- Right/overlap: a floating **glass KPI card** (`bg-white/10 backdrop-blur border-white/15`) showing live trust metrics — reuses §5 dashboard card style, ties marketing to product.
- Trust strip below hero: muted logos row + "Serving Bangalore · Mysore · Tumkur · Davanagere · Shivamogga".

**Services** (home/apartment/commercial/interior/turnkey): 5-up responsive grid of feature cards, each with a gradient lucide icon tile (navy→terracotta), `h3` title, one-line value prop, "Learn more →" link. Top-accent bar on hover.

**Project showcase:** replace gradient placeholder thumbs with **16:9 image cards**; on hover, image `scale-105` + dark gradient foot reveals project name, city, and a status badge (DESIGN/IN_PROGRESS/COMPLETED). Filter pills by city/type. A "before → after" slider for one flagship project adds credibility cheaply.

**Stats band:** full-width navy section, 4 KPIs (projects delivered, sq.ft built, on-time %, client rating) in Sora 800 with terracotta numerals and count-up animation. Tabular-nums.

**CTA section:** navy→navy-800 gradient panel, centered, blueprint texture, single terracotta pill CTA + phone number. Reuse for footer pre-band.

**Testimonials / process:** add a 3-step "How we build" timeline (lucide: `FileSignature → HardHat → KeyRound`) and quote cards with star ratings (gold stars — a sanctioned gold use).

---

## 5. Portal Visual Upgrades

**Dashboard (role-aware):**
- Top row of **KPI stat cards**: `bg-card rounded-xl shadow-sm p-5`, label (`eyebrow muted`), big Sora number (`tabular-nums`), delta chip (success/danger up/down arrow), tiny sparkline. 2px top accent in role color. Examples: Active Projects, Pending Payments (₹), Overdue (₹, danger), Upcoming Deliveries.
- Below: 2-col layout — left "My Projects" cards with progress, right "Activity / Approvals" feed.
- Per-role accent tinting (subtle): CLIENT terracotta, ADMIN navy, ENGINEER/ARCHITECT info-blue, PROJECT_OWNER gold — applied only to the KPI top-rail + sidebar active state, not whole UI.

**Project detail:** sticky header with project name, city, status badge, and a **horizontal stage stepper** for `LEAD → ONBOARDING → DESIGN → IN_PROGRESS → ON_HOLD → HANDOVER → COMPLETED` (completed = filled terracotta, current = ring, future = muted). Tabs: Overview · Documents · Payments · Deliveries · Team.

**Data tables:** per §3. Documents table shows a **Visibility chip** (CLIENT_VISIBLE = success-tint, INTERNAL = info, ADMIN_ONLY = navy-solid) and a DocumentKind lucide icon. Payments table groups by milestone with subtotal rows.

**Status badge mapping** (central `<StatusBadge>`):

| Enum | Value | Style |
|---|---|---|
| ProjectStatus | LEAD | info-tint |
| | ONBOARDING / DESIGN | navy-tint |
| | IN_PROGRESS | terracotta-tint |
| | ON_HOLD | warning-tint |
| | HANDOVER | gold-tint |
| | COMPLETED | success-tint |
| PaymentStatus | PLANNED | slate-tint |
| | INVOICED | warning-tint |
| | PAID | success-tint |
| | OVERDUE | danger-tint **+ row rail** |
| Visibility | CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY | success / info / navy-solid |

**Charts** (suggested lib: **Recharts**, themed to tokens; or shadcn `chart` wrapper):
- **Payments:** stacked horizontal bar or donut of Paid / Invoiced / Planned / Overdue (₹), + a cumulative area chart "billed vs paid over time". Always ₹ + tabular-nums, lakh/crore formatting.
- **Progress:** per-project **milestone progress bar** (terracotta fill on muted track) and an S-curve line (planned vs actual %) on project detail.
- **Deliveries:** simple status pill timeline.
- Chart palette: terracotta (primary series), navy (secondary), slate/steel (tertiary), semantic colors for status splits. Grid lines `border` color, no heavy 3D/gradients.

**Empty / loading states:** skeletons in `muted` with shimmer; empty states = centered lucide icon in a muted circle + one-line prompt + primary action. Never a blank table.

---

## 6. Imagery & Iconography

**Icon system — lucide-react**, 1.75px stroke, 16px (inline/table), 20px (nav/buttons), 24px (feature tiles). Suggested mapping:

| Domain | Icon |
|---|---|
| Dashboard | `LayoutDashboard` |
| Projects | `Building2` / `HardHat` |
| Documents | `FileText`; floor plan `Map`/`Ruler`; electrical `Zap`; plumbing `Droplets`; structural `Frame`; site photo `Image`; progress video `Video`; contract `FileSignature`; invoice `ReceiptIndianRupee`; suggestion `Lightbulb` |
| Payments | `IndianRupee` / `Wallet` / `ReceiptIndianRupee` |
| Deliveries / materials | `Truck` / `PackageCheck` |
| Item requests | `ClipboardList` |
| Handover | `KeyRound` |
| Roles | client `User`, admin `ShieldCheck`, engineer `HardHat`, architect `PencilRuler`, owner `Crown`, worker `Wrench` |
| Status | success `CheckCircle2`, warning `Clock`, overdue `AlertTriangle`, in-progress `Loader`/`Hammer` |
| Locations | `MapPin` |

> Always pair an icon with a text label in UI controls (accessibility + clarity). Brand logo mark: rounded-square with stylized "L"/level-line in a **navy→terracotta** gradient (unify away from current gold gradient).

**Photography direction:** real Indian residential/commercial sites, warm natural light, people (families, site engineers in branded hard-hats) over empty buildings — humanize. Color-grade slightly warm to match terracotta. Avoid generic Western stock skyscrapers.

**Placeholder strategy (POC → prod):**
1. **Build now:** a `<Thumb>` component = navy→slate gradient + centered lucide `Building2` + project initials, deterministic hue from project id (replaces current gradient placeholder, keeps it on-brand).
2. **Blur-up:** ship a tiny blurhash/`placeholder="blur"` via `next/image` for all real photos.
3. **Marketing fill:** curated free sets (Unsplash "construction india", Pexels) until real project photography is shot; store in `/public/img` with a documented swap list.
4. Document photos in portal: square-crop thumbnails, lazy-loaded, click → lightbox.

**Iconography don'ts:** no emoji (the current `.card .icon` emoji approach → replace with lucide tiles), no mixed icon sets, no filled+outline mixing.

---

### Implementation checklist
1. Add ramps + semantic colors + `boxShadow` + `fontSize` to `tailwind.config.ts`; collapse the double-amber to single terracotta accent.
2. Swap `:root`/`.dark` CSS-var blocks in `globals.css` (§2.3); delete legacy `.btn/.card/.hero` once shadcn components land.
3. Wire `next/font` Inter + Sora to `--font-sans` / `--font-display`.
4. Install shadcn primitives (button, card, table, badge, dialog, dropdown, tabs, skeleton) + Recharts; build `<StatusBadge>`, `<StatKpi>`, `<Thumb>`, `<StageStepper>`.
5. Add `next-themes` toggle scoped to the portal.

**Files referenced:** `C:\Users\A962251\hm\wip\personal\ruflo\web\tailwind.config.ts`, `C:\Users\A962251\hm\wip\personal\ruflo\web\src\app\globals.css`, `C:\Users\A962251\hm\wip\personal\ruflo\web\src\app\layout.tsx`.