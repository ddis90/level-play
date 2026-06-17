# Levelplay Constructions — Digital Platform

A one-stop web application for a construction company: an advanced **public
marketing site** to attract customers, plus an authenticated **portal** to run
the full project lifecycle (onboarding → requirements → drawings → payments →
delivery → progress → handover) with role-based access and document visibility
controls.

Built as a **POC (dev)** that's ready to promote to **production (prd)** on Azure
via `azd up`.

## Stack
- **Next.js 14** (App Router, Node runtime) — SSR public site + API route handlers
- **PostgreSQL + Prisma ORM** — single `DATABASE_URL` swaps local → Azure
- **bcrypt** seeded users for the POC; role model is **Entra ID group-shaped**
- **zod** validation; signed-cookie sessions
- **azd + Bicep + Docker** — one-command Azure deploy (dev & prd)

## Run locally

You need a PostgreSQL database. Pick one:

**Option A — local Postgres**
```bash
# install Postgres, create a db named "levelplay", then in web/.env set:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/levelplay?schema=public"
```

**Option B — free cloud Postgres (mirrors Azure)**
Create a free database at Neon or Supabase, copy its connection string into
`web/.env` as `DATABASE_URL` (keep `?sslmode=require`).

Then:
```bash
cd web
npm install
npm run db:push      # create tables from the Prisma schema
npm run db:seed      # seed demo users + sample project
npm run dev          # http://localhost:3000
```

## Demo accounts
Password for all: **`Passw0rd!`**

| Email | Role | Sees on a shared project |
|-------|------|--------------------------|
| client@demo.test | Client | client-visible docs only |
| engineer@demo.test | Engineer (staff) | client-visible + internal |
| architect@demo.test | Architect (staff) | client-visible + internal |
| admin@demo.test | Admin | all incl. admin-only |
| projectadmin@demo.test | Project Admin | all incl. admin-only |
| owner@demo.test, incharge@demo.test, worker@demo.test | various | per role |

Log in as different accounts on the same project to see the **document visibility
abstraction** in action.

## Project structure
```
web/
  src/app/            public site + portal pages + API routes
  src/components/      React components
  src/lib/            prisma, auth (sessions), rbac (roles + visibility) ← key seam
  prisma/             schema.prisma, seed.ts
  infra/              Bicep for Azure (Container App, Postgres, Blob, Key Vault)
  docs/               SDLC artifacts from the planning swarm (BRD, HLD, LLDs, review)
  azure.yaml          azd project (azd up)
  DEPLOY.md           Azure deploy runbook (dev + prd)
  Dockerfile          standalone container build
```

## Where decisions live
- **Roles & visibility:** `src/lib/rbac.ts` — the single source of truth.
- **Auth swap to Entra ID:** `src/lib/auth.ts` — replace two functions, see `DEPLOY.md`.
- **Data model:** `prisma/schema.prisma`.
- **Azure topology:** `infra/main.bicep`.

## Planning docs (from the SDLC swarm)
`docs/01..07` — Business Requirements, High-Level Design, Data/Backend/Frontend/
DevOps Low-Level Designs, and the lead architect's review & build backlog. Edit
these as requirements evolve.

## Roadmap
- **POC (now):** public site + portal vertical slice on dev.
- **Production:** Entra ID auth, Blob media, hardened auditing → prd via `azd up`.
- **Later:** native Android app reusing these APIs.
