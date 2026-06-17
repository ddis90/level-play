I have enough context. The app UI isn't built yet (greenfield), so the LLD is forward-looking but grounded in the existing Prisma schema (roles, visibility, statuses) and the HLD.

# Levelplay Constructions — Frontend / UX Low-Level Design (LLD)

> Scope: the Next.js 14 (App Router) UI for both surfaces — the **public marketing site** and the **authenticated portal**. This document defines information architecture, the page inventory, the design system, role-based dashboards, the document/media visibility UI, and accessibility/navigation rules. It is grounded in the existing `prisma/schema.prisma` (RoleName, ProjectStatus, Visibility, DocumentKind, PaymentStatus, DeliveryStatus) and the HLD's lead→client flow.

---

## 1. Information Architecture & Sitemap

The app is one codebase with two route groups. App Router segments:

- `app/(public)/…` — SSR, unauthenticated, SEO-indexed, fast and mobile-first.
- `app/(portal)/app/…` — authenticated, RBAC-gated, `noindex`.
- `app/api/…` — route handlers (per HLD).

### 1.1 Public site sitemap

```
/ (Home)
├─ /services
│   ├─ /services/home-construction
│   ├─ /services/apartment-construction
│   ├─ /services/commercial-construction
│   ├─ /services/interior
│   └─ /services/turnkey
├─ /projects                 (showcase grid: ongoing + completed)
│   └─ /projects/[slug]       (single project case study)
├─ /locations
│   ├─ /locations/bangalore
│   ├─ /locations/mysore
│   ├─ /locations/tumkur
│   ├─ /locations/davanagere
│   └─ /locations/shivamogga
├─ /about
├─ /contact
├─ /get-started              (onboarding lead-capture form)
└─ /login                    (entry to the portal)
```

Service and location pages are templated (one component, data-driven) to keep the five service types and the Karnataka cities consistent and SEO-strong. `/get-started` is the single conversion target reachable from every page's primary CTA; on submit it creates a `Project { status: LEAD }`.

### 1.2 Portal sitemap (shared shell, role-filtered)

```
/app                          (role-aware dashboard — entry after login)
├─ /app/projects              (project list — scoped to membership)
│   └─ /app/projects/[id]
│       ├─ overview           (status, members, timeline)
│       ├─ requirements
│       ├─ design             (floor plans + drawing discussion)
│       ├─ documents          (media library, visibility-filtered)
│       ├─ payments           (milestones + audit trail)
│       ├─ deliveries         (DeliveryItem + ItemRequest)
│       ├─ progress           (site updates: photos/videos/notes)
│       └─ handover
├─ /app/leads                 (admin/project_admin: LEAD pipeline → convert)
├─ /app/clients               (admin/project_admin: client directory)
├─ /app/admin                 (admin: users, roles, role↔Entra mapping)
└─ /app/account               (profile, password — POC only)
```

**Navigation visibility is computed, not duplicated.** A single nav config lists every destination with a `requires` predicate over the user's global `UserRole[]` and the current `ProjectMembership.role`. Server components render only the links the user is authorized for; the same predicate is re-checked in API handlers so the UI never becomes the security boundary.

### 1.3 Route access by role (entry routing)

| Role | Lands on `/app` showing | Can reach |
|---|---|---|
| `CLIENT` | Their own project(s) only | overview, design, documents (CLIENT_VISIBLE), payments, deliveries (status), progress, handover |
| `ADMIN` | All projects + leads + admin | everything incl. `/app/admin`, all visibility tiers |
| `PROJECT_ADMIN` | Assigned projects + leads + clients | all tabs, ADMIN_ONLY docs on owned projects |
| `PROJECT_OWNER` | Owned projects | all project tabs, INTERNAL + ADMIN_ONLY |
| `PROJECT_INCHARGE` | Projects they run | all tabs, INTERNAL |
| `ENGINEER` | Projects they're on | design, documents (INTERNAL), progress, deliveries |
| `ARCHITECT` | Projects they're on | design (primary), documents (INTERNAL), requirements |
| `WORKER` | Projects they're on | progress (primary), deliveries, documents (INTERNAL, view) |

---

## 2. Page Inventory (purpose + key components)

### 2.1 Public

| Page | Purpose | Key components |
|---|---|---|
| Home `/` | First impression; convince + route to lead form | Hero (headline + primary CTA `Get a free estimate`), service cards (5), featured projects carousel, trust strip (years, projects delivered, cities served), how-it-works steps, testimonial block, footer CTA |
| Service `/services/[type]` | Explain one service, drive lead | Service hero, scope/inclusions list, relevant project gallery (filtered by service), FAQ accordion, inline lead CTA |
| Projects `/projects` | Showcase ongoing + completed work | Filter bar (service, city, status: Ongoing/Completed), responsive project card grid, lazy-loaded imagery |
| Project case study `/projects/[slug]` | Build credibility with one project | Image/video gallery, fact sheet (city, type, scope), narrative, "Start a similar project" CTA |
| Location `/locations/[city]` | Local SEO + relevance for Karnataka cities | City hero, city-specific projects, local service list, lead CTA |
| Get started `/get-started` | Capture the lead (LEAD project) | Multi-step form: contact → service type → city → budget/timeline → notes; zod-validated client+server; success state with next-steps |
| Contact `/contact` | Secondary capture / phone | Map, phone/WhatsApp, short form |
| Login `/login` | Portal entry | Email + password (POC), error states; swappable for Entra ID redirect later |

### 2.2 Portal

| Page | Purpose | Key components |
|---|---|---|
| Dashboard `/app` | Role-aware landing (see §4) | Stat tiles, action queue, recent activity, project shortcuts |
| Project list `/app/projects` | Find a project | Searchable table/cards, status chips (ProjectStatus), membership scope |
| Project overview | Single source of truth for a project | Status stepper (LEAD→…→COMPLETED), member avatars, key dates, quick links to tabs |
| Requirements | Capture/track client requirements | Editable requirement list, notes, attachments |
| Design | Floor-plan & drawing discussion | Drawing viewer (FLOOR_PLAN/STRUCTURAL/ELECTRICAL/PLUMBING), version list, comment thread, upload (architect/engineer) |
| Documents | Visibility-aware media library | Upload dropzone, filter by `DocumentKind` + `Visibility`, grid/list, visibility badges (see §5) |
| Payments | Transparency + audit | Milestone table (milestone, amount, status, due/paid, reference), status chips (PaymentStatus), totals, client-readable history |
| Deliveries | Track items + requests | DeliveryItem table (status: REQUESTED→DELIVERED), `Raise item request` form (ItemRequest), fulfilment toggle |
| Progress | Ongoing site updates | Timeline of site photos/videos + notes, date-grouped, infinite scroll |
| Handover | Closeout | Handover summary, sign-off control, completion checklist |
| Leads `/app/leads` | Convert website leads | LEAD pipeline board, lead detail, `Convert to client` (creates CLIENT User + advances status) |
| Clients `/app/clients` | Client directory | Searchable list, client → projects |
| Admin `/app/admin` | Users/roles | User table, role assignment, **RoleName ↔ Entra group id** mapping form (config-only swap) |

---

## 3. Design System

### 3.1 Brand direction
Trustworthy, modern, grounded — a construction company that is organized and transparent. Avoid clichéd "yellow hard-hat" loudness; favor a confident slate/blue base with a single warm accent for action.

### 3.2 Color palette (design tokens — CSS variables / Tailwind theme)

| Token | Hex | Use |
|---|---|---|
| `--brand-900` Deep Slate | `#0F2A43` | Headers, footer, primary text on light |
| `--brand-700` Steel Blue | `#1E4E79` | Primary buttons, links, active nav |
| `--brand-500` Sky | `#3B82C4` | Hovers, highlights, focus accents |
| `--accent-500` Amber (action) | `#F2A516` | Primary CTAs, "Get started", key callouts |
| `--accent-600` Amber-dark | `#C9820B` | CTA hover/pressed |
| `--neutral-900` | `#1A1D21` | Body text |
| `--neutral-500` | `#6B7280` | Secondary text |
| `--neutral-100` | `#F4F6F8` | Page/section backgrounds |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--border` | `#E2E8F0` | Dividers, inputs |

**Semantic / status colors** (reused by chips for ProjectStatus, PaymentStatus, DeliveryStatus and visibility):

| Token | Hex | Maps to |
|---|---|---|
| `--success` | `#1E9E6A` | PAID, DELIVERED, COMPLETED, signed-off |
| `--info` | `#3B82C4` | IN_PROGRESS, IN_TRANSIT, INVOICED |
| `--warn` | `#E0A106` | ON_HOLD, OVERDUE, REQUESTED/ORDERED, PLANNED |
| `--neutral-chip` | `#94A3B8` | LEAD, ONBOARDING, DESIGN, CANCELLED |
| `--danger` | `#D14343` | Destructive actions, errors |

Visibility accents (see §5): CLIENT_VISIBLE = `--success`, INTERNAL = `--info`, ADMIN_ONLY = `--danger`.

Contrast: all text/background pairings target WCAG AA (≥4.5:1 body, ≥3:1 large/UI). Amber is used only with `--brand-900` text on it (passes AA), never as a text color on white.

### 3.3 Typography

- **Headings:** `Plus Jakarta Sans` (or `Sora`) — geometric, modern, structural feel.
- **Body/UI:** `Inter` — high legibility at small sizes, good for tables/forms.
- **Numeric (payments/amounts):** `Inter` with `font-variant-numeric: tabular-nums` for aligned currency columns.
- Loaded via `next/font` (self-hosted, no layout shift).
- Type scale (rem): 2.5 / 2.0 / 1.5 / 1.25 / 1.0 / 0.875 / 0.75. Line-height 1.5 body, 1.2 headings. Public hero may scale up with `clamp()`.

### 3.4 Component library

Built as a small in-house set (Tailwind + headless primitives such as Radix for menus/dialogs/tabs to get accessibility for free). Core components:

- **Layout:** `AppShell` (sidebar + topbar), `PublicHeader`, `PublicFooter`, `Container`, `PageHeader`.
- **Navigation:** `SideNav` (role-filtered), `Tabs` (project sub-pages), `Breadcrumbs`, `MobileNavDrawer`.
- **Data:** `StatTile`, `DataTable` (sortable, paginated), `StatusChip` (variant-driven by token), `Timeline`, `Avatar`/`AvatarGroup`.
- **Forms:** `TextField`, `Select`, `DatePicker`, `Textarea`, `FileDropzone`, `FormStepper` (lead form), `VisibilitySelect` (see §5). All wired to zod schemas shared with the API.
- **Media:** `DrawingViewer` (pan/zoom for floor plans), `MediaGallery`, `VideoPlayer`.
- **Feedback:** `Toast`, `Banner`, `EmptyState`, `Skeleton`, `ConfirmDialog`, `VisibilityBadge`.
- **CTA:** `Button` (primary=amber, secondary=steel outline, ghost, danger).

Spacing on an 8px grid; radius 8px (cards/inputs), 12px (modals); two elevation levels (card shadow, overlay shadow).

### 3.5 Responsive / mobile-first

- Mobile-first Tailwind breakpoints: base (≤640 phone), `md` (≥768 tablet), `lg` (≥1024 desktop), `xl` (≥1280).
- **Public:** single-column stacks on mobile; sticky bottom CTA bar (`Get a free estimate`) on phones; carousels become swipeable.
- **Portal:** sidebar collapses to a bottom tab bar / hamburger drawer on mobile; `DataTable` reflows to stacked cards under `md`; the project tab strip becomes a horizontally scrollable segmented control. This matters because project_incharge, engineers, and workers will use the portal on-site from phones (progress photos, deliveries).
- Touch targets ≥44×44px; forms use appropriate `inputmode`/`type` (tel, email, numeric).

### 3.6 PWA note

Ship the portal as an installable PWA (manifest + service worker) so on-site staff get an app-like icon ahead of the native Android app. Cache the app shell and static assets; queue progress-photo/note uploads when offline and sync on reconnect (offline write queue keyed to project). The public site stays SSR-first for SEO and is not the PWA target. Service worker scoped to `/app` so marketing pages are never intercepted.

---

## 4. Role-Based Dashboard Layouts (`/app` first view)

All dashboards share the `AppShell` (role-filtered `SideNav` + topbar with project switcher + profile). The body differs by role — driven by the user's `UserRole[]` and active `ProjectMembership.role`.

**CLIENT** — transparency-first, single project focus.
- Hero card: my project name + `ProjectStatus` stepper.
- Tiles: payment summary (paid vs due, from PaymentStatus), next milestone, latest progress photo.
- Recent activity: new CLIENT_VISIBLE documents, payment updates, delivery status.
- Primary actions: `View drawings`, `Upload a document`, `View payments`.

**ADMIN** — full oversight.
- Tiles: total projects by status, open leads, overdue payments (PaymentStatus.OVERDUE), pending item requests.
- Leads pipeline snapshot + `Convert` shortcuts.
- Cross-project activity feed; entry to `/app/admin` (users, RoleName↔Entra mapping).

**PROJECT_ADMIN** — portfolio of assigned projects.
- Tiles: my projects by status, leads to action, payments needing invoicing, deliveries in transit.
- Per-project quick cards with status + blockers.

**PROJECT_OWNER** — accountability for owned projects.
- Tiles: budget vs payments, milestone health, handover readiness.
- Risk list: ON_HOLD projects, OVERDUE payments.

**PROJECT_INCHARGE** — day-to-day execution.
- Tiles: today's site tasks, deliveries expected today (DeliveryItem.expectedAt), open ItemRequests.
- Quick actions: `Add progress update`, `Mark delivery received`, `Upload site photo`.

**ENGINEER** — technical drawings + execution.
- Tiles: drawings awaiting my input, INTERNAL documents recently added, assigned projects.
- Quick actions: `Upload drawing` (ELECTRICAL/PLUMBING/STRUCTURAL), `Add progress note`.

**ARCHITECT** — design-led.
- Tiles: projects in DESIGN status, floor plans awaiting review, requirement notes.
- Quick actions: `Upload floor plan`, `Open design discussion`.

**WORKER** — minimal, task-focused, mobile-first.
- Big-button cards: `Add site photo/video`, `View today's deliveries`, `My projects`.
- Reads INTERNAL docs; cannot set ADMIN_ONLY; defaults uploads to INTERNAL.

---

## 5. Document / Media UI — Visibility Display & Control

Visibility is the platform's core trust feature. It is enforced in the API (per HLD), and the UI must make it **obvious and hard to get wrong**.

### 5.1 How visibility is shown
Every document/media card carries a `VisibilityBadge`:

| Visibility | Badge label | Color / icon | Meaning shown in tooltip |
|---|---|---|---|
| `CLIENT_VISIBLE` | "Visible to client" | green / eye icon | Client + all internal roles can see |
| `INTERNAL` | "Internal" | blue / team icon | Staff only — hidden from client |
| `ADMIN_ONLY` | "Admin only" | red / lock icon | Admins / project admins only |

- The Documents library has a **filter rail** by `DocumentKind` and `Visibility`, plus a grouped view ("Shared with client" / "Internal" / "Admin only") so staff can audit at a glance what the client can see.
- For a **client**, no badges or filters for tiers they can't access are rendered at all — they simply never receive INTERNAL/ADMIN_ONLY items from the API, so there's no "locked row" hinting at hidden content.

### 5.2 How visibility is controlled by uploader role
On upload (`FileDropzone` → `VisibilitySelect`), the available visibility options and the default are constrained by the uploader's role, mirroring the API rules:

| Uploader role | Can set | Default | Notes |
|---|---|---|---|
| `CLIENT` | CLIENT_VISIBLE only | CLIENT_VISIBLE | Clients only share into the shared space; option is locked, shown as info text. |
| `WORKER` | INTERNAL | INTERNAL | No client-facing or admin-only; select is disabled/single-value. |
| `ENGINEER`, `ARCHITECT` | CLIENT_VISIBLE, INTERNAL | INTERNAL | Can promote a polished drawing to the client; cannot mark ADMIN_ONLY. |
| `PROJECT_INCHARGE` | CLIENT_VISIBLE, INTERNAL | INTERNAL | Same as above. |
| `PROJECT_OWNER` | CLIENT_VISIBLE, INTERNAL, ADMIN_ONLY | INTERNAL | Full control on owned projects. |
| `ADMIN`, `PROJECT_ADMIN` | All three | INTERNAL | Full control; can re-classify existing docs. |

- `VisibilitySelect` renders each option with the same badge color/icon used on cards, plus a one-line consequence ("Client will be able to see and download this").
- **Changing** an existing document's visibility (allowed for owner/admin tiers) opens a `ConfirmDialog` that spells out the effect, e.g. "This will make 'Foundation invoice' visible to the client." Re-classifying *up* to CLIENT_VISIBLE always confirms; this prevents accidental exposure.
- `DocumentKind` defaults are suggested per uploader context (architect upload defaults kind=FLOOR_PLAN, engineer=STRUCTURAL_DRAWING, worker on Progress tab=SITE_PHOTO) but remain editable.
- The client-visible state is also surfaced on the Design and Progress tabs (same badge), so visibility is consistent wherever media appears — not only in the Documents library.

---

## 6. Accessibility & Navigation Principles

**Accessibility (WCAG 2.1 AA target).**
- Semantic HTML and landmarks (`header`, `nav`, `main`, `aside`, `footer`); one `h1` per page; logical heading order.
- Keyboard: every interactive element reachable and operable by keyboard; visible focus ring using `--brand-500` (never `outline: none` without a replacement); logical tab order; `Esc` closes dialogs/drawers; focus trapped in modals and returned to the trigger on close (Radix primitives provide this).
- Screen readers: `aria-label`/`aria-current` on nav, `aria-live="polite"` for toasts and async save states, descriptive labels on icon-only buttons (upload, visibility lock). Visibility is never conveyed by color alone — every badge pairs an icon + text label.
- Forms: every field has a visible `<label>`; errors are programmatically associated (`aria-describedby`), announced, and shown inline with text (not color-only); the lead `FormStepper` announces step changes and validates per step.
- Media: images require `alt`; project galleries use meaningful alt or empty alt for decorative; videos get captions/transcripts where applicable.
- Motion: respect `prefers-reduced-motion` (disable carousel autoplay, parallax, large transitions); `prefers-color-scheme` honored if a dark theme is added.
- Contrast: enforced via the token palette (§3.2); CI check (axe / Lighthouse) in the build.

**Navigation principles.**
- **One predictable shell per surface.** Public uses a top nav (Services dropdown, Projects, Locations, About, Contact, prominent amber `Get started`). Portal uses a left `SideNav` (desktop) / bottom-bar + drawer (mobile) that lists only authorized destinations.
- **Always-available primary action.** Public: persistent `Get a free estimate` CTA (sticky bottom bar on mobile). Portal: a context-aware primary button per page (e.g. `Add progress update`, `Raise item request`).
- **Project context is global.** A project switcher in the topbar keeps users oriented; breadcrumbs (`Projects / LP-2026-001 / Payments`) show location within the lifecycle.
- **Status stepper as wayfinding.** The ProjectStatus stepper (LEAD→ONBOARDING→DESIGN→IN_PROGRESS→HANDOVER→COMPLETED) appears on overview and as a compact indicator on every project tab so users always know the phase.
- **Authorization-aware, not error-prone.** Users never see links they can't use; if a deep link is hit without rights, a clear `403` empty state offers a route back rather than a dead end.
- **Consistent empty/loading/error states.** Every list uses `Skeleton` while loading, a helpful `EmptyState` (with the primary action) when empty, and an inline retry on error — important on flaky on-site mobile connections.
- **Progressive disclosure.** Lead form and document upload reveal fields step-by-step to keep first interactions light; advanced controls (visibility re-classification, role mapping) live behind explicit actions.