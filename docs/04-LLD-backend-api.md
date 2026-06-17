# Levelplay Constructions — Backend / API Low-Level Design (LLD)

> Scope: the Node-runtime backend of the single Next.js 14 app — authentication, RBAC enforcement, the API route catalog (App Router route handlers), validation/error handling, and the file/media upload seam. Grounded in the existing code: `prisma/schema.prisma`, `src/lib/auth.ts`, `src/lib/rbac.ts`, `src/lib/prisma.ts`, `prisma/seed.ts`.

---

## 1. Auth Design

### 1.1 Current POC mechanism (implemented)

Authentication is self-contained and stateless: a **signed (HMAC-SHA256) cookie** carries the identity + roles. There is no server-side session store, which keeps the POC trivial to deploy on Azure App Service (no Redis/sticky sessions).

| Concern | Implementation | Source |
|---|---|---|
| Password storage | `bcryptjs` hash, cost 10, seeded per user | `prisma/seed.ts` (`bcrypt.hash(DEMO_PASSWORD, 10)`), verified in `verifyCredentials` |
| Credential check | `prisma.user.findUnique` by lowercased email → `bcrypt.compare`; rejects inactive users | `src/lib/auth.ts:53` |
| Session token | base64url JSON `{id,email,fullName,roles}` + `.` + HMAC sig | `encodeSession` / `decodeSession` |
| Tamper protection | `crypto.timingSafeEqual` constant-time signature compare | `decodeSession` |
| Cookie | `lp_session`, `httpOnly`, `sameSite=lax`, `secure` in non-dev, `path=/`, `maxAge` 8h | `createSessionCookie` |
| Secret | `process.env.SESSION_SECRET` (dev fallback string) | `src/lib/auth.ts:19` |

**Session payload contract (`SessionUser`):** `{ id, email, fullName, roles: RoleName[] }`. This is the *only* state needed to render role-aware UI and authorize API calls — deliberately minimal so the same shape can be produced from an Entra ID token later.

> Hardening before PRD (not POC-blocking): require `SESSION_SECRET` (fail fast if missing), consider rotating/`__Host-` cookie prefix, and a server-side revocation list only if logout-everywhere is needed. The signed-cookie model itself carries forward.

### 1.2 Auth routes

| Method | Path | Body | Effect |
|---|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` | `verifyCredentials` → on success `createSessionCookie(user)`; returns `{ user }` (no hash). 401 on failure. |
| POST | `/api/auth/logout` | — | `clearSessionCookie()`; 204. |
| GET | `/api/auth/me` | — | `getSessionUser()` → `{ user }` or 401. |

### 1.3 Entra ID / MSAL swap seam

The seam is the function **`getSessionUser(): SessionUser | null`** and the credential step. Nothing downstream (RBAC, routes) knows *how* the `SessionUser` was produced.

```
POC:   cookie → decodeSession() ─┐
                                 ├─► SessionUser ─► RBAC guard ─► handler
PRD:   MSAL ID token → claims ───┘
```

Swap plan (config-only for the data model; localized code change in one module):
1. Replace `verifyCredentials` + `createSessionCookie` with an MSAL auth-code flow (`@azure/msal-node`); the OIDC callback validates the ID token.
2. Map the token's **group object IDs → `RoleName`** using `Role.azureAdGroupId` (already in schema, currently null). Build the same `roles: RoleName[]`.
3. `getSessionUser()` reads the MSAL-issued session instead of the HMAC cookie. **`requireUser()`, `rbac`, and every route handler stay unchanged** because they consume `SessionUser`, not the auth mechanism.
4. Seeded `passwordHash` becomes dead (kept for local dev only); `User.email` remains the join key to the Entra account (UPN/email claim).

No schema migration is required for the swap — `azureAdGroupId` and the role catalog already exist.

---

## 2. RBAC Enforcement

### 2.1 Single guard layer

All authorization passes through **one place per request**: a `withAuth` wrapper around each route handler that (a) resolves `SessionUser` via `getSessionUser()`, (b) checks coarse role gates, (c) for project-scoped resources confirms `ProjectMembership`, and (d) hands the handler a *pre-filtered* query scope. Handlers never re-implement checks.

Primitives already exist in `src/lib/rbac.ts`:
- `INTERNAL_ROLES`, `ADMIN_ROLES`, `ROLE_LABELS`
- `hasAnyRole`, `isStaff`, `isAdmin`, `canManagePayments`
- `visibleLevelsFor(roles)` → which `Visibility` levels are readable
- `assignableLevelsFor(roles)` → which `Visibility` a user may set on upload

Proposed wrapper (new `src/lib/guard.ts`, thin — composes existing helpers):

```ts
export function withAuth(handler, opts: {
  roles?: RoleName[];           // coarse gate; omit = any authenticated user
  requireProjectMember?: boolean; // verify ProjectMembership for :projectId
}) { /* getSessionUser → 401; hasAnyRole → 403; membership → 403; call handler(ctx) */ }
```

`ctx = { user, params }`. Document reads additionally narrow by `visibility: { in: visibleLevelsFor(user.roles) }` so a client physically cannot fetch `INTERNAL`/`ADMIN_ONLY` rows.

### 2.2 Visibility filtering (the core abstraction)

Enforced at the **data layer**, not the UI. Every `Document` query injects:

```ts
where: { projectId, visibility: { in: visibleLevelsFor(user.roles) } }
```

| Role group | Readable visibility | Assignable on upload |
|---|---|---|
| `ADMIN`, `PROJECT_ADMIN` | CLIENT_VISIBLE, INTERNAL, ADMIN_ONLY | all three |
| Internal staff (OWNER, INCHARGE, ENGINEER, ARCHITECT, WORKER) | CLIENT_VISIBLE, INTERNAL | CLIENT_VISIBLE, INTERNAL |
| `CLIENT` | CLIENT_VISIBLE only | CLIENT_VISIBLE only |

### 2.3 Permission matrix (role × action × resource)

Legend: ✅ allowed · 👁 read-only · ⚪ filtered by visibility/membership · — denied. "Staff" = any `INTERNAL_ROLES`. "Admin" = `ADMIN` / `PROJECT_ADMIN`.

| Resource / Action | CLIENT | ADMIN | PROJECT_ADMIN | PROJECT_OWNER | PROJECT_INCHARGE | ENGINEER | ARCHITECT | WORKER |
|---|---|---|---|---|---|---|---|---|
| **Project** read (member) | 👁 | ✅ | ✅ | 👁 | 👁 | 👁 | 👁 | 👁 |
| Project create | — | ✅ | ✅ | — | — | — | — | — |
| Project status transition | — | ✅ | ✅ | ✅ | — | — | — | — |
| Membership manage | — | ✅ | ✅ | — | — | — | — | — |
| **Document** read | ⚪ CV | ⚪ all | ⚪ all | ⚪ CV+INT | ⚪ CV+INT | ⚪ CV+INT | ⚪ CV+INT | ⚪ CV+INT |
| Document upload | ✅ (CV) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Document set ADMIN_ONLY | — | ✅ | ✅ | — | — | — | — | — |
| Document delete | own | ✅ | ✅ | — | — | — | own | — |
| **Payment** read | 👁 | ✅ | ✅ | 👁 | 👁 | — | — | — |
| Payment create/update | — | ✅ | ✅ | ✅ | — | — | — | — |
| **DeliveryItem** read | 👁 | ✅ | ✅ | 👁 | 👁 | 👁 | — | 👁 |
| DeliveryItem create/update status | — | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| **ItemRequest** raise | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ItemRequest fulfil | — | ✅ | ✅ | ✅ | ✅ | — | — | — |
| **Handover** read | 👁 | ✅ | ✅ | 👁 | 👁 | — | — | — |
| Handover create/sign-off | — | ✅ | ✅ | ✅ | — | — | — | — |
| **Onboarding lead** create (public) | n/a — unauthenticated | | | | | | | |
| Lead list / convert | — | ✅ | ✅ | — | — | — | — | — |

`canManagePayments` (`ADMIN`, `PROJECT_ADMIN`, `PROJECT_OWNER`) is the existing helper backing the Payment/Handover write rows.

---

## 3. API Route Catalog (Next.js App Router route handlers)

Convention: handlers live at `app/api/**/route.ts`, Node runtime (`export const runtime = 'nodejs'`), each wrapped in `withAuth`. "Role" = coarse gate; visibility/membership applied inside. Project-scoped routes verify `ProjectMembership` unless Admin.

### Auth
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | public | Verify credentials, set session cookie |
| POST | `/api/auth/logout` | any | Clear session |
| GET | `/api/auth/me` | any | Current `SessionUser` |

### Onboarding leads (public → client)
| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/api/leads` | **public** | Public site form → create `Project { status: LEAD }` + capture contact; no auth |
| GET | `/api/leads` | Admin | List `LEAD`/`ONBOARDING` projects |
| POST | `/api/leads/:projectId/convert` | Admin | Create CLIENT `User` (+ `UserRole`), add `ProjectMembership(CLIENT)`, move status `LEAD → ONBOARDING` |

### Projects
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/projects` | any (filtered) | List projects the user is a member of (Admin sees all) |
| POST | `/api/projects` | Admin | Create project (generates `code` e.g. `LP-2026-001`) |
| GET | `/api/projects/:id` | member | Project detail + requirements |
| PATCH | `/api/projects/:id` | Admin / Owner | Update fields / requirements |
| PATCH | `/api/projects/:id/status` | Admin / Owner | Status transition (`ProjectStatus` state machine) |
| GET | `/api/projects/:id/members` | member | List `ProjectMembership` |
| POST | `/api/projects/:id/members` | Admin | Attach user with per-project `RoleName` capacity |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove membership |

### Documents (visibility-filtered)
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/projects/:id/documents` | member | List docs `where visibility in visibleLevelsFor(roles)` (+ optional `?kind=`) |
| POST | `/api/projects/:id/documents` | member | Upload metadata after file write; `visibility` validated against `assignableLevelsFor(roles)`; `uploadedById = user.id` |
| GET | `/api/documents/:docId/download` | member + visibility | Resolve a download URL (local path POC / SAS PRD); 404 if not in visible set |
| DELETE | `/api/documents/:docId` | Admin or owner-of-upload | Delete metadata (+ blob) |

### Payments
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/projects/:id/payments` | member | Milestone list (client transparency view) |
| POST | `/api/projects/:id/payments` | `canManagePayments` | Add milestone |
| PATCH | `/api/payments/:paymentId` | `canManagePayments` | Update status/`paidDate`/`reference` (audit trail) |

### Deliveries & item requests
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/projects/:id/deliveries` | member | List `DeliveryItem` |
| POST | `/api/projects/:id/deliveries` | staff (Admin/Owner/Incharge/Engineer) | Create delivery item |
| PATCH | `/api/deliveries/:itemId` | staff | Update `status`/`deliveredAt` |
| GET | `/api/projects/:id/requests` | member | List `ItemRequest` |
| POST | `/api/projects/:id/requests` | member | Raise request (`requestedBy = user.id`) |
| PATCH | `/api/requests/:requestId` | Admin/Owner/Incharge | Mark `fulfilled` |

### Handover
| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/api/projects/:id/handover` | member | Handover summary + sign-off state |
| PUT | `/api/projects/:id/handover` | Admin / Owner | Upsert summary, set `handedOverAt` |
| POST | `/api/projects/:id/handover/signoff` | Admin / Owner | `signedOff = true`; optionally move project `→ COMPLETED` |

---

## 4. Validation & Error Handling

### 4.1 zod strategy

One schema module per resource (`src/lib/validation/*.ts`); every handler parses input before touching Prisma. Enums are derived from Prisma to stay in lockstep:

```ts
import { z } from 'zod';
import { Visibility, DocumentKind, ProjectStatus } from '@prisma/client';

export const leadCreate = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  city: z.string().min(2),               // Bangalore / Mysore / Tumkur / ...
  serviceType: z.enum(['HOME','APARTMENT','COMMERCIAL','INTERIOR','TURNKEY']),
  message: z.string().max(2000).optional(),
});

export const documentCreate = z.object({
  title: z.string().min(1),
  kind: z.nativeEnum(DocumentKind),
  visibility: z.nativeEnum(Visibility),  // re-checked against assignableLevelsFor()
  fileUrl: z.string().min(1),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().positive().optional(),
});

export const projectStatusUpdate = z.object({ status: z.nativeEnum(ProjectStatus) });
```

Rules:
- **Validate at the boundary**, authorize after parse (cheap reject of malformed input first).
- `z.nativeEnum` over Prisma enums — no drift between API and DB.
- Business invariants beyond shape (e.g. `visibility` must be in `assignableLevelsFor(user.roles)`, legal status transitions) live in the handler/service, not zod.
- Coerce query params (`z.coerce.number()`, pagination) for GET list routes.

### 4.2 Error contract

A shared `respond`/`fail` helper returns a uniform JSON envelope so the portal UI handles all errors identically:

```jsonc
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [/* zod issues */] } }
```

| Condition | HTTP | `code` |
|---|---|---|
| zod parse failure | 400 | `VALIDATION_ERROR` (+ flattened `details`) |
| No/invalid session (`getSessionUser` null) | 401 | `UNAUTHENTICATED` |
| Authenticated but role/visibility/membership denies | 403 | `FORBIDDEN` |
| Resource missing **or hidden by visibility** | 404 | `NOT_FOUND` |
| Unique/constraint (e.g. duplicate `Project.code`, membership) | 409 | `CONFLICT` |
| Unhandled | 500 | `INTERNAL` (message hidden; logged) |

Implementation notes:
- A single `try/catch` in `withAuth` maps thrown errors → envelope; handlers just `throw` typed errors or return data.
- **Visibility denials return 404, not 403** — never reveal that an `ADMIN_ONLY` doc exists to a client/staff member who can't see it.
- Map Prisma `P2002` → 409, `P2025` → 404.
- 500s log server-side (stack) but never leak internals to the client.

---

## 5. File / Media Upload Flow

### 5.1 Single storage interface (the seam)

Documents already store an opaque `fileUrl` (`schema.prisma:144`). A `StorageAdapter` interface hides whether that points at local disk (POC) or Azure Blob (PRD). Selected by `APP_ENV` / `STORAGE_DRIVER` env — **no handler or schema change to switch**.

```ts
// src/lib/storage/index.ts
export interface StorageAdapter {
  save(input: { projectId: string; filename: string; mime: string; body: ReadableStream | Buffer })
    : Promise<{ fileUrl: string; sizeBytes: number }>;
  getDownloadUrl(fileUrl: string): Promise<string>;  // POC: same path; PRD: short-lived SAS
  delete(fileUrl: string): Promise<void>;
}

export const storage: StorageAdapter =
  process.env.STORAGE_DRIVER === 'azure' ? azureBlobAdapter() : localDiskAdapter();
```

| | POC — `localDiskAdapter` | PRD — `azureBlobAdapter` |
|---|---|---|
| Backing store | `./public/uploads/<projectId>/<cuid>-<filename>` | Azure Blob container `media`, blob `<projectId>/<cuid>-<filename>` |
| `fileUrl` stored | `/uploads/<projectId>/...` | `https://<acct>.blob.core.windows.net/media/<projectId>/...` |
| Download | static path served by Next | `getDownloadUrl` mints a **short-lived read SAS** (e.g. 5 min) |
| Config | none | `AZURE_STORAGE_CONNECTION_STRING` / managed identity, single container |

### 5.2 Upload sequence

```
client/staff ──multipart──► POST /api/projects/:id/documents
  withAuth: 401 if no session; 403 if not project member
  parse multipart (file + {title, kind, visibility})
  assert visibility ∈ assignableLevelsFor(user.roles)   // else 403
  storage.save(...) ─► { fileUrl, sizeBytes }
  validate documentCreate (fileUrl now known)
  prisma.document.create({ projectId, uploadedById: user.id, fileUrl, ... })
  201 ► { document }
```

### 5.3 Download sequence (visibility-gated)

```
GET /api/documents/:docId/download
  withAuth → SessionUser
  doc = prisma.document.findFirst({
          where: { id, visibility: { in: visibleLevelsFor(user.roles) },
                   project: { members: { some: { userId: user.id } } } } })
  if !doc → 404 (hides existence)        // Admin path skips membership clause
  url = storage.getDownloadUrl(doc.fileUrl)   // local path or fresh SAS
  302 redirect to url (or return { url })
```

The browser never gets a raw blob URL directly from the DB — it always passes through the visibility check and (in PRD) receives only a time-boxed SAS, so leaked URLs expire.

### 5.4 Constraints (enforced in the upload handler)

- Allow-list MIME/size by `DocumentKind` (e.g. PDF/PNG/JPG for drawings & `SITE_PHOTO`, MP4 for `PROGRESS_VIDEO`); reject otherwise → 400 `VALIDATION_ERROR`.
- Generate stored filename (cuid prefix) — never trust client filename for the path.
- `sizeBytes`/`mimeType` persisted for the portal UI; cap large `PROGRESS_VIDEO` uploads.
- On `prisma.document.create` failure after `storage.save`, best-effort `storage.delete` to avoid orphans.

---

### Source references
- `src/lib/auth.ts` — sessions, `verifyCredentials`, `getSessionUser`, `requireUser` (Entra seam)
- `src/lib/rbac.ts` — `visibleLevelsFor`, `assignableLevelsFor`, `canManagePayments`, role sets
- `src/lib/prisma.ts` — shared client
- `prisma/schema.prisma` — `Visibility`, `DocumentKind`, `ProjectStatus`, `Role.azureAdGroupId`
- `prisma/seed.ts` — bcrypt cost, demo accounts, visibility-spanning documents

> Not yet implemented (build targets): `app/api/**/route.ts` handlers, `src/lib/guard.ts` (`withAuth`), `src/lib/validation/*`, `src/lib/storage/*`. The auth and RBAC libraries they depend on already exist.