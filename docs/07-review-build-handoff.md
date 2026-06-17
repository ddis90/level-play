Based on the actual repo state cross-referenced against all six documents, here is the handoff.

# Levelplay Constructions — Design Review & Build Handoff

**Reviewer:** Lead Architect · **Date:** 2026-06-16 · **Scope:** BRD, HLD, Data LLD, Backend LLD, Frontend LLD, DevOps LLD vs. the code on disk (`prisma/schema.prisma`, `src/lib/*`, `src/app/api/*`, `prisma/seed.ts`).

---

## 1. Consistency Check

### 1.1 Where the docs agree (verified against code)

| Area | Status | Evidence |
|---|---|---|
| **Roles** — 8-role `RoleName` enum, 1:1 Entra mapping via `Role.azureAdGroupId` | Consistent across all docs + schema + `rbac.ts` + seed (8 users, one per role) | `schema.prisma:18`, `rbac.ts:7`, `seed.ts:25` |
| **Visibility model** — 3 levels CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY | HLD, Data LLD, Frontend LLD and `visibleLevelsFor()` all agree | `rbac.ts:37`, `schema.prisma:117` |
| **Session seam** — minimal `SessionUser {id,email,fullName,roles}`, signed-cookie now → Entra later | Backend LLD matches `auth.ts` exactly | `auth.ts:11` |
| **Azure topology** — single Next.js app, App Service + Postgres Flexible + Blob + Entra-later, `azd up`, single `DATABASE_URL` | HLD ↔ DevOps LLD ↔ `.env.example` ↔ `next.config.js` (`output:'standalone'`) all aligned | consistent |
| **Lead pipeline (runtime behaviour)** — public form → `Project{status:LEAD}` → `LP-YYYY-NNN` code | HLD, Frontend LLD, and the implemented `/api/leads` route + `OnboardingForm` all agree | `api/leads/route.ts`, `OnboardingForm.tsx:24` |

### 1.2 Conflicts that must be reconciled before build

| # | Conflict | Detail | Resolution |
|---|---|---|---|
| **C1** | **Lead storage: separate `Lead` model vs. `Project{status:LEAD}`** | **Data LLD** proposes a dedicated `Lead` entity so "the public surface never writes a `Project`." But **HLD, Frontend LLD, and the shipped `/api/leads` route** all create a `Project` row directly. These are mutually exclusive. | **Decision needed.** For POC speed, ratify the implemented `Project{status:LEAD}` approach and mark `Lead` as a PRD hardening item — OR add `Lead` now and rewrite `/api/leads`. Do not leave both "approved." |
| **C2** | **`/api/auth/me` documented but not implemented** | Backend LLD §1.2 lists `GET /api/auth/me → {user}`. Only `login` and `logout` routes exist on disk. | Build `/api/auth/me`; the portal shell needs it for client-side session hydration. |
| **C3** | **Auth response shapes differ from doc** | Backend LLD says login returns `{ user }` and logout returns `204`. Code returns `{ ok: true }` (200) for both, and login omits the user object. | Trivial but real. Align the doc to code (return `{ ok:true }`) or add `{ user }` to login. Pick one; the frontend contract depends on it. |
| **C4** | **Migration strategy contradicts dev workflow** | DevOps LLD `postprovision` hook runs `npx prisma migrate deploy`, but there is **no `prisma/migrations/` directory** — local workflow uses `prisma db push` (`package.json`). `migrate deploy` with zero migrations provisions **no tables**, so `db seed` then fails on Azure. | Generate and commit an initial migration (`prisma migrate dev --name init`) before any `azd up`. This is a deploy blocker. |
| **C5** | **Data LLD refinements not reflected in schema** | Data LLD proposes `Requirement` model, immutable payment ledger, and converting `ItemRequest.requestedBy` from a loose string to a real FK. None are in `schema.prisma`; `requestedBy String` is still loose (`schema.prisma:208`). | Triage: `Requirement` is required by the feature list (see §2). The immutable ledger and `requestedBy` FK are POC-acceptable as-is — flag as PRD items, don't silently drop. |

---

## 2. Gaps vs. Required Feature List

Mapping the mandated portal features to what exists (schema + routes + UI):

| Required feature | Data model | API | UI | Gap |
|---|---|---|---|---|
| Client onboarding (lead→client) | `Project{LEAD}` ✅ | `/api/leads` ✅ | `OnboardingForm` ✅ | **No lead→client conversion** (create `User` + `ProjectMembership`, advance status). Pipeline stops at LEAD. |
| Managing client requirements | ❌ no `Requirement` model | ❌ | ❌ | **Missing entirely.** Data LLD proposed it but it's not in schema. Required feature. |
| Design discussions w/ floor plans | `Document{FLOOR_PLAN}` ✅ | ❌ | ❌ | No drawing-discussion thread/comment model; "discussion" has no representation. |
| Payment structure + audit + records | `Payment` ✅ (seeded) | ❌ | ❌ | No payment API/UI. Audit trail is **mutable in place** (no ledger) — acceptable for POC, flag for PRD. |
| Document/media upload w/ visibility | `Document`+`Visibility` ✅, `rbac.ts` rules ✅ | ❌ **no upload route** | ❌ | **The headline feature has no upload seam and no Blob wiring.** `assignableLevelsFor()` exists but nothing calls it. This is the core demo differentiator. |
| Item delivery tracking + requests | `DeliveryItem`, `ItemRequest` ✅ (seeded) | ❌ | ❌ | No API/UI. |
| Track ongoing progress on site | `Document{SITE_PHOTO,PROGRESS_VIDEO}` ✅ | ❌ | ❌ | No progress timeline/view. |
| Handover details + tracking | `Handover` ✅ | ❌ | ❌ | No API/UI. |

**Cross-cutting gaps:**
- **No portal UI at all.** Only `app/page.tsx` (home) and `app/contact/page.tsx` exist. Frontend LLD's entire `/app/**` portal sitemap, `/login`, and the templated `/services`, `/projects`, `/locations` public pages are unbuilt (Task #8/#9 incomplete).
- **No route/middleware guard.** `requireUser()` throws `'UNAUTHENTICATED'` but nothing catches it; no `middleware.ts` protects `/app/**`. RBAC helpers exist but are not enforced on any endpoint.
- **No Blob Storage integration.** `Document.fileUrl` is a local path in seed; no upload handler, no SAS/connection wiring despite Blob being in the stack.
- **No `infra/` or `azure.yaml`.** DevOps LLD describes Bicep modules and the azd service map in detail, but none exist on disk (Task #10 pending). `azd up` cannot run today.
- **`SESSION_SECRET` fail-fast** noted as PRD-hardening in Backend LLD but `auth.ts:19` still falls back to `'insecure-dev-secret'` — fine for POC, ensure it's tracked.

---

## 3. Prioritized Build Backlog — POC Vertical Slice

Goal: a clickable demo that proves the **lead→client→visibility-controlled document** story end to end. Ordered so each task unblocks the next.

**P0 — Make it run locally (foundation)**
1. **Generate + commit initial Prisma migration** (`migrate dev --name init`); reconcile C4 so `db push` (local) and `migrate deploy` (Azure) agree. Verify `db:seed` runs clean. *(unblocks everything)*
2. **Resolve C1 (lead storage decision)** and **C3 (auth response shape)** in the docs — one sentence each, so the team builds against a fixed contract.
3. **Add `middleware.ts`** protecting `/app/**`; wire `requireUser()` → redirect to `/login`. Add `GET /api/auth/me` (C2).

**P1 — Auth + portal shell (the spine)**
4. Build **`/login` page** posting to `/api/auth/login`; **`/app` role-aware dashboard** shell reading `getSessionUser()`.
5. Build **`/app/projects`** (membership-scoped list) and **`/app/projects/[id]/overview`** from seeded `LP-2026-001`.

**P2 — The headline demo: document visibility (the differentiator)**
6. **`GET /api/projects/[id]/documents`** filtered by `visibleLevelsFor(user.roles)`; **`/app/projects/[id]/documents`** media library.
7. **`POST` document upload** to **Azure Blob (or local `/uploads` fallback)**, enforcing `assignableLevelsFor()`. Demo: log in as `client@demo.test` vs `admin@demo.test` and show the ADMIN_ONLY "Vendor Contract & Margins" doc appear/disappear. *(This is the single most persuasive moment of the sale demo.)*

**P3 — Round out the lifecycle story (read-heavy)**
8. Read-only **payments** view (`/app/projects/[id]/payments`) — milestones + audit refs from seed.
9. Read-only **deliveries** view from seeded `DeliveryItem`s.
10. **Add `Requirement` model + minimal requirements list** (closes the §2 required-feature gap).
11. **Lead→client conversion** action (admin advances `LEAD` → creates `User`+`ProjectMembership` → `ONBOARDING`).

**P4 — Public polish + deploy**
12. Build templated **`/services/*`, `/projects/*`, `/locations/*`** public pages (SEO, mobile-first) per Frontend LLD.
13. **Author `infra/` Bicep + `azure.yaml`** per DevOps LLD; dry-run `azd provision` on DEV.
14. **`azd up` to DEV**; confirm postprovision migrate+seed; smoke-test login + document visibility on Azure.

> Handover, item-requests, and design-discussion threads are **out of POC scope** — represent them with seeded read-only data only. Do not build write paths for them now.

---

## 4. Definition of Done — POC Demo

The POC is **demo-ready** when all of the following are true on the **DEV** environment:

**Functional**
- [ ] A visitor submits `/get-started`; a `Project{status:LEAD}` is created with an `LP-2026-NNN` code and the success ref is shown.
- [ ] All 8 seeded accounts log in with `Passw0rd!`; wrong password returns 401; `/app/**` redirects to `/login` when unauthenticated.
- [ ] **Document visibility is provably enforced:** `client@demo.test` sees only CLIENT_VISIBLE docs; staff see INTERNAL; `admin@demo.test` sees ADMIN_ONLY — same project, three different document sets. Enforced server-side (not just hidden in UI).
- [ ] A staff user uploads a document, picks a visibility level constrained by `assignableLevelsFor()`, and it lands in Blob (or local fallback) and appears per the rules above.
- [ ] Client can view their project's payments, deliveries, and progress photos read-only; cannot see another client's project.
- [ ] Requirements can be listed for a project (model exists, closes the gap).

**Non-functional / platform**
- [ ] `azd up` provisions DEV from clean and the app serves SSR public pages + API on the Node runtime; `output:'standalone'` confirmed.
- [ ] `prisma migrate deploy` + `db seed` succeed in the postprovision hook (committed migration exists).
- [ ] Single `DATABASE_URL` swap is the only app-config change between local and DEV; `SESSION_SECRET` set in DEV (no fallback).
- [ ] Public site is responsive on mobile + desktop; portal pages carry `noindex`.
- [ ] No secrets in the repo; `.env` is git-ignored (verified).

**Demo narrative (must run unscripted in <5 min)**
- [ ] Browse public site → submit enquiry → log in as admin → see the new lead → open `LP-2026-001` → switch between client/staff/admin logins to show the visibility abstraction live.

**Explicitly NOT required for POC sign-off:** Entra ID auth, immutable payment ledger, item-request/handover write flows, design-discussion threads, Android app. These are PRD-track and must be listed as such in the demo wrap-up so leadership scopes procurement correctly.

---

**Key files referenced:** `C:\Users\A962251\hm\wip\personal\ruflo\web\prisma\schema.prisma`, `...\prisma\seed.ts`, `...\src\lib\auth.ts`, `...\src\lib\rbac.ts`, `...\src\app\api\leads\route.ts`, `...\src\app\api\auth\login\route.ts`, `...\src\components\OnboardingForm.tsx`, `...\next.config.js`, `...\.env.example`. **Absent (documented but not on disk):** `src\app\api\auth\me\`, `src\app\(portal)\app\**`, `src\app\login\`, `prisma\migrations\`, `infra\`, `azure.yaml`.