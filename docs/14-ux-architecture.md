I have a full picture of the current implementation. The app currently uses hand-rolled CSS classes and heavy inline styles, emoji icons, no shadcn primitives, a fixed-width sidebar with no mobile handling, and minimal feedback states. Here is the spec.

---

# Levelplay Constructions — UX Improvement Spec

_Target stack: Next.js 14 (App Router) · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · lucide-react. Audience: construction clients (often non-technical, phone-first) + internal staff across 8 roles in Bangalore & Karnataka._

---

## 0. Snapshot of the current build (what the spec is reacting to)

Observed in `src/`:

- **Two disjoint styling systems.** The marketing site + portal run on hand-written CSS classes (`.hero`, `.card`, `.badge-progress`) in `globals.css`, while heavy **inline `style={{…}}` objects** are scattered through every page (`portal/layout.tsx`, `projects/[id]/page.tsx`). shadcn/ui and the Tailwind theme tokens exist in `tailwind.config.ts` but are essentially unused. Result: inconsistent spacing, colors, radii; no reusable components.
- **Emoji as iconography** (`🏠 🏢 🛋️ 📐 💳`) — inconsistent rendering across Android/iOS/Windows, not theme-able, poor a11y. lucide-react is installed but unused.
- **Fixed 240px sidebar** with `position: absolute` footer — no mobile collapse, no responsive breakpoint, will break on phones (the stated #1 requirement).
- **Tables and cards with raw inline styles**, no empty/loading/error states beyond a couple of `alert` divs.
- **Demo credentials pre-filled** into the login form (`defaultValue="client@demo.test"`) — fine for POC, must be gated before prod.

The good bones to preserve: clean RBAC model (`lib/rbac.ts`), server-side visibility filtering, sensible IA seeds (Dashboard / Projects / Leads), and a coherent navy + amber brand already tokenized in `tailwind.config.ts`.

---

## 1. Heuristic critique (Nielsen 10 + mobile)

### Public marketing site
| # | Heuristic | Issue | Fix direction |
|---|-----------|-------|---------------|
| H1 | Visibility of system status | CTA buttons are static links; `OnboardingForm` only shows a text alert on submit — no inline field validation, no progress. | Toast + inline `Form` errors; loading state on buttons. |
| H2 | Match real world | Emoji icons + generic copy; status badges ("Design Phase") don't map to the real `ProjectStatus` enum the client will later see in-portal. | Consistent lucide icon set; align public badges to portal vocabulary. |
| H4 | Consistency & standards | Public "Client Login" button styled differently from portal; two badge systems. | One Button + Badge component, one token set. |
| H6 | Recognition not recall | No sticky header on scroll, no active-section highlight, nav links hidden on small screens (`hide-sm`) with **no hamburger replacement** — mobile users lose navigation entirely. | Sticky header + `Sheet` mobile menu. |
| H8 | Aesthetic & minimal | Hero is text-only ("LEVELPLAY" placeholder thumbnails); low trust signal for a construction buyer who wants to see work. | Real project imagery, gradient/grid texture, trust stats with motion count-up. |
| — | Trust/credibility | No testimonials, no certifications, no team/process timeline, no WhatsApp/phone tap-to-call (critical in India). | Add process timeline, testimonials, floating tap-to-call. |

### Authenticated portal
| # | Heuristic | Issue | Fix direction |
|---|-----------|-------|---------------|
| H1 | System status | Uploads/payments refresh with `router.refresh()` and no toast confirmation; no optimistic feedback. | Toast on every mutation; skeletons during load. |
| H2 | Match real world | Raw enum strings shown (`IN_PROGRESS`, `CLIENT_VISIBLE`) only partially humanized; reference column shows "—". | Central label/format helpers; humanized everywhere. |
| H3 | User control | Upload form has Cancel but Dialog isn't modal/focus-trapped; no undo on actions. | Radix `Dialog`/`Sheet` with focus trap; toast with action. |
| H4 | Consistency | Project detail mixes card grid + a raw `<table>` with inline `th/td` styles; dashboard cards differ from project cards. | shadcn `Card`, `Table`, `Badge` everywhere. |
| H5 | Error prevention | Visibility dropdown is the only guard; no confirmation when a staff member is about to publish an `ADMIN_ONLY`→`CLIENT_VISIBLE` doc. | Confirm step + visibility preview ("Who can see this?"). |
| H6 | Recognition | No breadcrumbs beyond a "← Back" link; no project switcher; sidebar doesn't show active route. | Breadcrumbs, active nav state, command palette (staff). |
| H7 | Flexibility | All roles get the same flat Projects grid; an Admin and a Worker see identical chrome despite very different jobs. | Role-aware dashboards & nav (see §3.5). |
| H8 | Minimalist | Dashboard "Quick start" is a wall of text; long enum labels. | Replace with action cards + role-tailored widgets. |
| — | Mobile | Fixed-width sidebar + horizontal-scroll `<main overflowX:auto>` + wide payment table = unusable on a phone for a site engineer uploading photos from the field. | Mobile-first layout (see §6). |

**Top 7 priorities:** (1) responsive shell + mobile nav, (2) migrate to shadcn primitives + tokens, (3) role-aware dashboards, (4) feedback (toasts/skeletons/inline validation), (5) lucide iconography, (6) document-visibility clarity, (7) trust content on the public site.

---

## 2. Improved information architecture & navigation

### 2.1 Public site
```
/                     Home (hero, trust stats, services, featured work, process, testimonials, CTA)
/services             Services overview
  /services/[slug]    Home · Apartment · Commercial · Interior · Turnkey (detail + CTA)
/projects             Portfolio (filter by city / type / status)
  /projects/[slug]    Case study (gallery, timeline, outcome)
/about                Company, team, certifications, coverage map (Bangalore + Karnataka cities)
/contact              Enquiry form + map + tap-to-call/WhatsApp
/login                Client/staff login
```
- **Sticky header**, scroll-aware, active-section underline. Desktop: inline nav. Mobile: hamburger → **`Sheet`** drawer.
- Persistent **tap-to-call / WhatsApp FAB** on mobile (high-intent India market).
- Footer: coverage cities, services, quick links, legal.

### 2.2 Portal — role-based navigation
Single app shell; nav items filtered by capability (`isStaff`, `isAdmin`, `canManagePayments`). Mobile uses a **bottom tab bar** (4 items) + overflow in a `Sheet`.

| Nav item | CLIENT | ENGINEER / ARCHITECT / WORKER | PROJECT_INCHARGE / OWNER | ADMIN / PROJECT_ADMIN |
|---|:--:|:--:|:--:|:--:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Projects | ✓ (theirs) | ✓ (assigned) | ✓ (assigned) | ✓ (all) |
| Documents (cross-project) | ✓ | ✓ | ✓ | ✓ |
| Payments | view | — | view | manage |
| Deliveries / Item Requests | view | update | manage | manage |
| Leads / Onboarding | — | — | — | ✓ |
| Team & Roles | — | — | — | ✓ |
| Handover | view | — | manage | manage |

- **Project switcher** (combobox) in the top bar for fast context change.
- **Command palette** (`⌘K` / staff) — jump to project, upload, search docs.
- **Breadcrumbs**: `Projects / Sharma Residence / Documents`.

---

## 3. Key flows to upgrade

### 3.1 Onboarding (public enquiry)
- Convert `OnboardingForm` to shadcn **`Form`** (react-hook-form + zod, sharing the server zod schema) with **inline field validation** and Indian phone (`^[6-9]\d{9}$`) + email checks.
- **2-step** layout on mobile (1: contact, 2: project details) with a progress indicator; single column on desktop.
- City field → **combobox** seeded with served cities (Bengaluru, Mysuru, Tumakuru, Davanagere, Shivamogga) + free text.
- Success: **Toast** + an inline confirmation card showing the lead `code` and "what happens next" (call within 24h). Submit button shows spinner; disable on submit.
- Honeypot + light rate-limit signal (server already issues `code`).

### 3.2 Login
- shadcn `Form` + `Card`, show/hide password toggle, `autoComplete` (already present), Enter-to-submit, inline error from API mapped to a field-level message rather than only a banner.
- **Gate demo credentials** behind `NODE_ENV !== 'production'` (or an `Accordion` only rendered in POC). Never prefill in prod.
- Post-login: route by role landing (clients → their single/most-recent project if only one; staff → dashboard).
- Add forgot-password placeholder + future SSO note ("Sign in with Microsoft" — maps to the planned Entra ID groups).

### 3.3 Project detail (docs / payments / deliveries)
Replace the long scroll of inline-styled sections with a **`Tabs`** layout (deep-linkable via `?tab=`):

```
[ Overview ] [ Documents ] [ Payments ] [ Deliveries ] [ Team ] [ Handover ]
```
- **Header**: project name, `code`, city, **status `Badge`**, and a horizontal **status stepper** (LEAD → ONBOARDING → DESIGN → IN_PROGRESS → ON_HOLD → HANDOVER → COMPLETED) showing current stage.
- **Overview**: KPI `Card`s (% paid, docs shared, next milestone, next delivery) + recent activity feed.
- **Documents**: filter chips by `DocumentKind` + visibility; grid of doc cards each with kind icon (lucide), visibility `Badge`, uploader, date; lightbox for `SITE_PHOTO`/`PROGRESS_VIDEO`.
- **Payments**: shadcn **`Table`** (responsive → stacks to cards on mobile), milestone, amount `₹` (en-IN), `PaymentStatus` badge, reference; summary bar (paid / invoiced / overdue / planned). `OVERDUE` styled distinctly (currently shares `badge-progress` — **bug to fix**: give OVERDUE a destructive badge).
- **Deliveries**: card list with `DeliveryStatus` badge + timeline; staff can update status inline.

### 3.4 Document upload with visibility
- Move `UploadForm` into a **`Dialog`** (desktop) / **`Sheet`** (mobile), Radix focus-trapped.
- Drag-and-drop dropzone (POC: still stores a file reference/path; wire to Azure Blob later).
- **Visibility selector as a segmented `RadioGroup`** with plain-language helper + a live **"Who can see this?"** preview chip row (Client / Staff / Admins) driven by `assignableLevelsFor(roles)` — only levels the user may assign appear.
- Confirm + **Toast** on success with the doc title; optimistic insert into the list, rollback on error.
- Keep server as source of truth (re-validate visibility against role) — UI mirrors `lib/rbac.ts`.

### 3.5 Dashboards per role
Replace the single text-heavy dashboard with role-tailored widgets:

| Role | Primary widgets |
|---|---|
| **CLIENT** | My project status stepper, next payment due, latest shared photos/drawings, pending approvals, message/contact PM. |
| **ENGINEER / ARCHITECT** | Assigned projects, drawings to upload, open item requests, today's site tasks. |
| **WORKER** | Today's deliveries to confirm, upload site photos (camera-first), simple task list. |
| **PROJECT_INCHARGE / OWNER** | Portfolio health, milestones at risk, deliveries pending, overdue payments. |
| **ADMIN / PROJECT_ADMIN** | New leads count + queue, all-projects status distribution, overdue payments, team/role management, recent uploads across projects. |

All KPIs reuse one `StatCard` component; charts via lightweight bars (status distribution) — no heavy chart lib for POC.

---

## 4. Component inventory (shadcn/ui) → usage map

| Component | Where used |
|---|---|
| **Button** | Everywhere (replaces `.btn .btn-primary/.btn-ghost/.btn-dark/.btn-light`). Variants: primary (amber), secondary, ghost, destructive, link. |
| **Card** (+ Header/Content/Footer) | Service cards, project cards, dashboard StatCards, doc cards, delivery cards. |
| **Badge** | Project status, payment status (add **destructive** for OVERDUE), document visibility, role chips. |
| **Table** | Payments schedule (responsive stacking), admin leads list, team list. |
| **Tabs** | Project detail sections; services detail. |
| **Dialog** | Document upload (desktop), confirm publish, lead detail. |
| **Sheet** | Mobile nav drawer (public + portal), mobile upload, filters. |
| **Sidebar** (shadcn block) | Portal desktop nav (replaces fixed 240px aside), collapsible. |
| **Form** + Input/Textarea/Select/Label | Onboarding, login, upload (RHF + zod). |
| **RadioGroup** | Visibility selector in upload. |
| **Combobox / Command** | City field, project switcher, ⌘K palette (staff). |
| **Toast (Sonner)** | All mutations: lead submit, login error, upload, payment/delivery updates. |
| **Skeleton** | Dashboard, project lists, doc grids, tables during load (Suspense fallbacks). |
| **Avatar** | User in sidebar, uploader on docs, team list. |
| **DropdownMenu** | User menu (logout, settings), row actions on tables. |
| **Breadcrumb** | Portal page headers. |
| **Tooltip** | Icon-only buttons, visibility helper, truncated names. |
| **Separator / ScrollArea** | Layout polish, long lists. |
| **Alert** | Inline non-toast notices (e.g., "No documents visible to you"). |
| **Accordion** | FAQ (public), demo-credentials block (POC only), service details. |
| **Progress / Stepper (custom)** | Project status stepper, onboarding step indicator. |
| **Calendar / DatePicker** | Payment milestone dates, delivery scheduling (staff). |
| **Pagination** | Admin leads / all-projects when large. |

**Foundational refactor:** delete bespoke CSS classes + inline styles; drive everything from the existing HSL tokens in `tailwind.config.ts` (`primary`, `muted`, `card`, `brand.*`). Add a `lib/labels.ts` for enum → human strings + `₹` formatting (en-IN) used app-wide.

---

## 5. Interaction & motion design (Framer Motion) — tasteful

Principles: motion conveys **state, hierarchy, and continuity** — never decoration. Durations 150–350ms, ease `[0.22, 1, 0.36, 1]`. **All gated by `prefers-reduced-motion`** (use `useReducedMotion`, fall back to instant/opacity-only).

| Pattern | Where | Spec |
|---|---|---|
| **Page transition** | App Router route changes | `AnimatePresence` wrapper: fade + 8px rise, 200ms. Keep portal shell static, animate only `<main>`. |
| **Stagger lists** | Service cards, project grid, doc grid, dashboard widgets | Container stagger 40–60ms, child fade+rise 12px. Cap stagger total ~300ms. |
| **Skeleton → content** | Data loads (Suspense) | Crossfade skeleton to content; subtle shimmer (CSS) not bouncing. |
| **Hero** | Public home | One-time entrance: headline rise, CTA fade-in; stats **count-up** on scroll-into-view (`whileInView`, once). |
| **Card hover** | Project/service cards | `whileHover` lift `y:-4` + shadow, 150ms (desktop pointer only). |
| **Dialog/Sheet** | Upload, mobile nav | Radix + Framer: scale 0.97→1 + fade (dialog); slide-in (sheet). |
| **Toast** | Mutations | Slide-up + fade (Sonner default), auto-dismiss 4s. |
| **Status stepper** | Project detail | Animate active-step fill on mount; layout animation when status advances. |
| **Tab indicator** | Project tabs | Shared-layout (`layoutId`) sliding underline. |
| **Number/KPI changes** | Dashboard counts | Brief tween on value change. |

Anti-patterns to avoid: parallax everywhere, looping/auto-playing motion, animating on every keystroke, motion that delays interactivity (animate visuals, never block the click).

---

## 6. Accessibility & responsive / mobile-first requirements

**Mobile-first is the baseline** — many site staff and clients are on Android phones in the field.

### Responsive
- Design at **360px first**, scale up. Breakpoints: base / `sm` 640 / `md` 768 / `lg` 1024 / container max 1180 (already set).
- **Portal shell**: replace fixed sidebar with — mobile: top bar + **bottom tab bar (4 items)** + `Sheet` overflow; `md+`: collapsible Sidebar. Remove `overflowX:auto` horizontal scrolling on `<main>`.
- **Tables → cards**: payments/leads tables stack into labeled card rows below `md`.
- Touch targets **≥ 44×44px**; spacing scale comfortable for thumbs; primary actions reachable in bottom third.
- **Camera-first upload** for WORKER/ENGINEER: `<input capture="environment">` for site photos.
- Images: `next/image`, responsive `sizes`, lazy, blur placeholders; avoid layout shift (CLS).

### Accessibility (WCAG 2.1 AA)
- **Color contrast ≥ 4.5:1** body, 3:1 large/UI. Audit amber `#e76f51` / gold `#ffb703` on white and navy — gold on white likely fails for text; restrict to large/non-text or darken.
- **Don't encode meaning in color alone** — payment/visibility/status badges carry **icon + text** (lucide), not just hue. Fixes the OVERDUE-vs-IN_PROGRESS ambiguity.
- Lean on **Radix/shadcn** for focus management, roles, and keyboard nav (Dialog/Sheet/Tabs/Combobox handle ARIA). Verify visible **focus rings** (`ring` token) are never removed.
- **Keyboard**: full operability, logical tab order, Esc closes overlays, ⌘K palette, Enter submits forms.
- **Forms**: every input a `<label htmlFor>` (already mostly done), `aria-invalid` + `aria-describedby` for errors, `aria-live="polite"` for async submit results/toasts.
- **Semantics**: one `<h1>` per page, ordered headings, landmark regions (`header/nav/main/footer`), skip-to-content link.
- **Reduced motion**: honor `prefers-reduced-motion` across all §5 animations.
- **Images/icons**: meaningful `alt`; decorative icons `aria-hidden`.
- **Language/locale**: `lang="en-IN"`, `₹` currency + en-IN number grouping everywhere; date formatting consistent.
- **Targets for QA**: Lighthouse a11y ≥ 95, axe clean, keyboard-only pass on login → project → upload, screen-reader pass (NVDA/VoiceOver) on the visibility upload flow.

### Two concrete bugs to fix during the refactor
1. `PAY_BADGE` maps **OVERDUE to `badge-progress`** (same as INVOICED) — give OVERDUE a distinct **destructive** badge with icon (a11y + clarity).
2. Mobile navigation disappears — public header hides links with `.hide-sm` and provides **no hamburger**; portal sidebar is fixed-width with an absolutely-positioned footer that will overlap/clip on short screens. Both replaced by the `Sheet`/bottom-bar patterns above.