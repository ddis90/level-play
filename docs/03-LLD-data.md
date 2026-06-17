# Levelplay Constructions — Data Layer LLD

> Detailed design for the persistence layer: Prisma models over PostgreSQL, the document-visibility enforcement contract, indexing/audit strategy, seed plan, and Azure Postgres migration notes. Grounded in the existing `prisma/schema.prisma`.

---

## 1. Entity Catalog — review & refinements

### 1.1 Existing models (status)

| Model | Purpose | Verdict |
|---|---|---|
| `Role` / `RoleName` enum | 8 named roles, `azureAdGroupId` reserved for Entra mapping | Keep. Good for 1:1 group mapping. |
| `User` | Seeded POC users with `passwordHash` (bcrypt) | Keep. Add lead-linkage + soft-delete audit (below). |
| `UserRole` | Many-to-many global roles | Keep. Composite PK is correct. |
| `Project` / `ProjectStatus` | Lifecycle LEAD→COMPLETED; `code`, `city`, `budget` | Keep. Add lead-capture fields (below). |
| `ProjectMembership` | Per-project capacity (role can differ from global) | Keep. |
| `Document` / `Visibility` / `DocumentKind` | Media + drawings with 3-level visibility | Keep. Add provenance fields (below). |
| `Payment` / `PaymentStatus` | Milestone payment structure | Keep, but audit trail is **mutable in place** — needs an immutable ledger (below). |
| `DeliveryItem` / `DeliveryStatus` | Item delivery tracking | Keep. |
| `ItemRequest` | Requests for items | Refine: `requestedBy` is a loose string — make it a real FK. |
| `Handover` | Sign-off + completion | Keep. |

### 1.2 Gaps vs required features (proposed additions)

The required feature list has three capabilities **not yet representable**:

**a) "Managing client requirements"** — no entity exists. Add `Requirement`:

```prisma
enum RequirementStatus {
  CAPTURED
  IN_DISCUSSION
  AGREED
  REJECTED
}

model Requirement {
  id          String            @id @default(cuid())
  project     Project           @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId   String
  title       String
  detail      String?
  status      RequirementStatus @default(CAPTURED)
  createdBy   User              @relation("RequirementAuthor", fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([projectId, status])
}
```

**b) Onboarding lead capture** — the public form currently has to overload `Project(status=LEAD)`, which forces a `Project` row before a `User`/contact exists. Capture raw leads separately so the public surface never writes into the portal graph prematurely:

```prisma
enum LeadStatus { NEW CONTACTED CONVERTED DROPPED }

model Lead {
  id          String     @id @default(cuid())
  fullName    String
  email       String
  phone       String?
  city        String?
  serviceType String?    // home / apartment / commercial / interior / turnkey
  message     String?
  status      LeadStatus @default(NEW)
  // set on conversion to a real project + client user
  convertedProjectId String? @unique
  convertedProject   Project? @relation(fields: [convertedProjectId], references: [id])
  createdAt   DateTime   @default(now())

  @@index([status, createdAt])
}
```
On conversion: `Lead → Project(status=ONBOARDING)` + CLIENT `User` + `ProjectMembership(role=CLIENT)`.

**c) Design discussions** — drawings live in `Document`, but the "discussion" thread does not. Minimal addition (a comment thread anchored to a project, optionally to a document):

```prisma
model DesignNote {
  id          String    @id @default(cuid())
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId   String
  document    Document? @relation(fields: [documentId], references: [id], onDelete: SetNull)
  documentId  String?
  visibility  Visibility @default(INTERNAL) // same enforcement as Document
  authorId    String
  author      User      @relation("DesignNoteAuthor", fields: [authorId], references: [id])
  body        String
  createdAt   DateTime  @default(now())

  @@index([projectId, visibility])
}
```

### 1.3 Field-level refinements to existing models

- **`ItemRequest.requestedBy`**: replace loose string with a real relation for auditability:
  `requestedById String` + `requestedBy User @relation("ItemRequester", ...)`, plus optional `fulfilledById`/`fulfilledAt`.
- **`Document`**: add provenance — `uploaderRole RoleName` (capacity at upload time), `checksum String?` (Blob integrity), and `deletedAt DateTime?` (soft delete so client-facing media is never hard-removed mid-audit).
- **`Document.sizeBytes Int`** → `BigInt` (videos exceed 2 GB / Int32 range).
- **`Payment`**: keep as the current milestone view, but treat status changes as append-only events via a new `PaymentEvent` ledger (section 4).
- **`Project`**: add `leadSource String?` and `requirementsSummary String?` for onboarding continuity.

---

## 2. ER Relationships

```mermaid
erDiagram
    Role ||--o{ UserRole : grants
    User ||--o{ UserRole : holds
    User ||--o{ ProjectMembership : "member of"
    Project ||--o{ ProjectMembership : "has members"
    Project ||--o{ Requirement : captures
    Project ||--o{ Document : contains
    Project ||--o{ DesignNote : discusses
    Project ||--o{ Payment : "billed via"
    Project ||--o{ DeliveryItem : tracks
    Project ||--o{ ItemRequest : raises
    Project ||--|| Handover : "closed by"
    Lead ||--o| Project : "converts to"
    User ||--o{ Document : uploads
    User ||--o{ Requirement : authors
    User ||--o{ DesignNote : writes
    User ||--o{ ItemRequest : "requested by"
    Document ||--o{ DesignNote : "annotated by"
    Payment ||--o{ PaymentEvent : "audited by"

    Lead {
      string id PK
      string email
      LeadStatus status
      string convertedProjectId FK
    }
    Project {
      string id PK
      string code UK
      ProjectStatus status
      string city
      decimal budget
    }
    Document {
      string id PK
      string projectId FK
      DocumentKind kind
      Visibility visibility
      string uploadedById FK
      RoleName uploaderRole
    }
    Payment {
      string id PK
      string projectId FK
      decimal amount
      PaymentStatus status
    }
    PaymentEvent {
      string id PK
      string paymentId FK
      PaymentStatus fromStatus
      PaymentStatus toStatus
      string actorId FK
    }
```

---

## 3. Visibility enforcement at the data layer

Visibility is **never** enforced in the UI alone — every read of `Document` (and `DesignNote`) passes through a single role→visibility resolver so the API layer cannot accidentally leak `INTERNAL`/`ADMIN_ONLY` items.

### 3.1 Role → allowed visibility set

| Caller's effective role (global `UserRole` ∪ per-project `ProjectMembership`) | Allowed `Visibility` values |
|---|---|
| `CLIENT` | `CLIENT_VISIBLE` |
| `WORKER`, `ENGINEER`, `ARCHITECT`, `PROJECT_INCHARGE` | `CLIENT_VISIBLE`, `INTERNAL` |
| `ADMIN`, `PROJECT_ADMIN`, `PROJECT_OWNER` | `CLIENT_VISIBLE`, `INTERNAL`, `ADMIN_ONLY` |

A user with multiple roles gets the **union** of allowed sets. Effective role is also **scoped to the project**: a user only sees a project's documents if they have a `ProjectMembership` on that project (or hold a global `ADMIN`/`PROJECT_ADMIN` role).

### 3.2 Single enforced query helper

All document reads go through one function — no raw `prisma.document.findMany` in route handlers:

```ts
// lib/visibility.ts
function visibilityFor(roles: RoleName[]): Visibility[] {
  const isAdmin = roles.some(r => ['ADMIN','PROJECT_ADMIN','PROJECT_OWNER'].includes(r));
  if (isAdmin) return ['CLIENT_VISIBLE','INTERNAL','ADMIN_ONLY'];
  const isStaff = roles.some(r =>
    ['WORKER','ENGINEER','ARCHITECT','PROJECT_INCHARGE'].includes(r));
  if (isStaff) return ['CLIENT_VISIBLE','INTERNAL'];
  return ['CLIENT_VISIBLE'];
}

// every document read:
prisma.document.findMany({
  where: {
    projectId,
    deletedAt: null,
    visibility: { in: visibilityFor(effectiveRoles) },
  },
});
```

### 3.3 Write-side guard

On upload, the chosen `visibility` must be `<=` the uploader's max level (e.g. a `WORKER` cannot create an `ADMIN_ONLY` doc). `uploaderRole` is stamped from the resolved capacity, not from client input. The same `visibilityFor` set gates `DesignNote` reads.

---

## 4. Indexing & audit considerations

### 4.1 Indexes (existing + added)

| Table | Index | Reason |
|---|---|---|
| `Document` | `@@index([projectId, visibility])` *(exists)* | Every portal read filters by project + visibility-IN. |
| `Document` | `@@index([projectId, kind])` *(add)* | Drawing tabs (electrical/plumbing/structural) filter by kind. |
| `Payment` | `@@index([projectId, status])` *(exists)* | Client payment timeline + overdue dashboards. |
| `Payment` | `@@index([dueDate])` *(add)* | Cron/overdue sweep across projects. |
| `Project` | `@@index([status])` + `code @unique` *(add)* | Lifecycle board grouped by status. |
| `Lead` | `@@index([status, createdAt])` | Sales triage queue. |
| `Requirement` / `DesignNote` | `@@index([projectId, status])` / `([projectId, visibility])` | Per-project listing. |
| `DeliveryItem` | `@@index([projectId, status])` *(add)* | Delivery board. |

### 4.2 Payment audit trail (immutable ledger)

`Payment` rows are mutable (status flips PLANNED→INVOICED→PAID), so the row alone cannot prove **who** changed **what, when**. Add an append-only event table — clients' "transparency" view reads from it:

```prisma
model PaymentEvent {
  id         String        @id @default(cuid())
  payment    Payment       @relation(fields: [paymentId], references: [id], onDelete: Cascade)
  paymentId  String
  fromStatus PaymentStatus?
  toStatus   PaymentStatus
  amount     Decimal       @db.Decimal(14, 2)
  reference  String?
  actor      User          @relation("PaymentActor", fields: [actorId], references: [id])
  actorId    String
  note       String?
  createdAt  DateTime      @default(now())   // never updated

  @@index([paymentId, createdAt])
}
```
Rule: `PaymentEvent` rows are **insert-only** (no update/delete in app code; enforce with a DB grant or trigger in PRD). Any `Payment` status write inserts a matching event in the same transaction.

### 4.3 Document provenance

`uploadedById` + `uploaderRole` + `createdAt` + `checksum` give chain-of-custody for drawings/site media. Soft delete (`deletedAt`) preserves the record for dispute resolution while hiding it from listings. Optionally extend to a generic `AuditLog(entity, entityId, action, actorId, diff Json, createdAt)` if cross-entity audit is needed later — not required for the POC.

---

## 5. Seed data plan

Goal: a demo where every role can log in and every visibility level + lifecycle stage is visible. All passwords bcrypt-hashed (cost 10). **POC credentials only — replaced by Entra ID in PRD.**

### 5.1 Roles
Seed all 8 `Role` rows (`RoleName` enum) with human labels; `azureAdGroupId = null`.

### 5.2 Users (one per role; password pattern `Lp@<role>2026`)

| Email | Full name | Global role | Password |
|---|---|---|---|
| `client@demo.levelplay.in` | Ravi Kumar (client) | CLIENT | `Lp@client2026` |
| `admin@demo.levelplay.in` | Asha Rao | ADMIN | `Lp@admin2026` |
| `padmin@demo.levelplay.in` | Vikram Shetty | PROJECT_ADMIN | `Lp@padmin2026` |
| `owner@demo.levelplay.in` | Latha N | PROJECT_OWNER | `Lp@owner2026` |
| `incharge@demo.levelplay.in` | Suresh B | PROJECT_INCHARGE | `Lp@incharge2026` |
| `engineer@demo.levelplay.in` | Kiran M | ENGINEER | `Lp@engineer2026` |
| `architect@demo.levelplay.in` | Deepa S | ARCHITECT | `Lp@architect2026` |
| `worker@demo.levelplay.in` | Manju P | WORKER | `Lp@worker2026` |

Plus one **multi-role** user (`engineer+incharge@demo...`, holds ENGINEER **and** PROJECT_INCHARGE) to exercise the union rule.

### 5.3 Projects (cover the lifecycle)

| code | name | city | status | purpose |
|---|---|---|---|---|
| `LP-2026-001` | Prestige Villa Interior | Bangalore | IN_PROGRESS | the rich demo project (all child data) |
| `LP-2026-002` | Mysore Apartment Block | Mysore | DESIGN | drawings + design notes stage |
| `LP-2026-003` | Tumkur Commercial Complex | Tumkur | HANDOVER | handover + completed payments |
| `LP-2026-004` | Davanagere Turnkey Home | Davanagere | LEAD | converted-from-lead example |

Memberships: attach client + architect + engineer + incharge + worker to `LP-2026-001`; owner/admin global.

### 5.4 Documents — all 3 visibility levels on `LP-2026-001`

| title | kind | visibility | uploaded by |
|---|---|---|---|
| Ground floor plan v3 | FLOOR_PLAN | CLIENT_VISIBLE | architect |
| Site progress — week 12 | SITE_PHOTO | CLIENT_VISIBLE | incharge |
| Electrical layout (rev B) | ELECTRICAL_DRAWING | INTERNAL | engineer |
| Plumbing riser diagram | PLUMBING_DRAWING | INTERNAL | engineer |
| Structural load calc notes | STRUCTURAL_DRAWING | INTERNAL | engineer |
| Signed construction contract | CONTRACT | ADMIN_ONLY | admin |
| Vendor cost breakdown | INVOICE | ADMIN_ONLY | padmin |

This lets QA verify: client sees 2, staff sees 5, admin sees 7.

### 5.5 Payments + audit (on `LP-2026-001`)

| milestone | amount | status | seeded events |
|---|---|---|---|
| Booking advance | 500000 | PAID | PLANNED→INVOICED→PAID (actor=admin) |
| Foundation complete | 750000 | INVOICED | PLANNED→INVOICED |
| Roof slab | 750000 | PLANNED | (one CREATE event) |
| Final handover | 500000 | PLANNED | — |

Each status step inserts a `PaymentEvent` so the client transparency view shows a non-empty history.

### 5.6 Deliveries, requests, requirements, handover

- `DeliveryItem`: "TMT steel 16mm" (DELIVERED), "UltraTech cement 50kg ×200" (IN_TRANSIT), "Vitrified tiles" (REQUESTED).
- `ItemRequest`: worker requests "Extra scaffolding" (unfulfilled); incharge requests "Waterproofing membrane" (fulfilled).
- `Requirement`: "3 bedrooms, north-facing pooja room" (AGREED), "Modular kitchen budget cap" (IN_DISCUSSION).
- `DesignNote`: client-visible note on the floor plan + one INTERNAL note on structural calc.
- `Handover` on `LP-2026-003` (signedOff=true, handedOverAt set).
- One `Lead` (NEW) and one converted `Lead`→`LP-2026-004`.

Seed runs idempotently via `upsert` keyed on `email` / `code` so `prisma db seed` is re-runnable.

---

## 6. Azure Postgres migration notes

### 6.1 Connection string (single `DATABASE_URL` swap)

- **Local POC:**
  `postgresql://postgres:postgres@localhost:5432/levelplay?schema=public`
- **Azure Flexible Server (DEV/PRD):**
  `postgresql://<user>:<pwd>@<server>.postgres.database.azure.com:5432/levelplay?sslmode=require&connection_limit=5&pool_timeout=20`

Azure Flexible Server (unlike the older Single Server) does **not** require the `user@server` username suffix — use the plain admin user. No schema/model change is needed; only the env var differs across `azd` environments.

### 6.2 TLS / `sslmode`

- Azure **requires TLS**: set `sslmode=require` in the URL. For stricter PRD posture use `sslmode=verify-full` and supply the DigiCert Global Root CA bundle via `sslrootcert=`.
- Keep the server's `require_secure_transport`/SSL enforcement **ON** in PRD; it can be relaxed only for throwaway local testing.

### 6.3 Connection pooling

- Next.js API routes on App Service can spawn many short-lived Prisma clients. Cap per-instance connections via `connection_limit` in the URL (e.g. `5`) so you don't exhaust Flexible Server's `max_connections` (tier-dependent, often ~50–100 on small SKUs).
- For higher concurrency in PRD, enable **PgBouncer** (built into Flexible Server). When using a transaction-pooled connection, append `?pgbouncer=true` and set `connection_limit=1`; run **migrations against the direct (non-pooled) 5432 port**, not through PgBouncer.
- Instantiate a **single global PrismaClient** (memoized on `globalThis` in dev to survive HMR) — never `new PrismaClient()` per request.

### 6.4 Migration workflow with `azd`

1. Provision Flexible Server + DB via `azd provision` (Bicep).
2. Set `DATABASE_URL` as an App Service setting per environment (DEV/PRD) — never committed.
3. Run `prisma migrate deploy` (not `migrate dev`) in the release/startup step against the **direct** connection.
4. Run `prisma db seed` **only in DEV** (POC demo data); PRD starts empty except `Role` rows.
5. Add the App Service outbound IPs (or use VNet integration / `Allow Azure services`) to the Flexible Server firewall.

### 6.5 Types & storage notes

- `Decimal @db.Decimal(14,2)` maps to Postgres `numeric` — exact money math, safe for the payments audit. Keep it; do not switch to float.
- Switch `Document.sizeBytes` to `BigInt` before PRD (videos > 2 GB overflow Int32).
- Migrate `Document.fileUrl` semantics: POC = local/relative path; PRD = Blob URL, served to clients only as short-lived **SAS URLs** generated at read time (the stored value stays the canonical blob path).

---

Files referenced: `C:\Users\A962251\hm\wip\personal\ruflo\web\prisma\schema.prisma`. Proposed new models (`Lead`, `Requirement`, `DesignNote`, `PaymentEvent`) and field changes are additive and migration-safe.