# Levelplay Constructions — DevOps / Azure LLD

> Deployment design for the single Next.js 14 app (`levelplay-portal`) + PostgreSQL Flexible Server + Blob Storage, delivered with **Azure Developer CLI (`azd`)**. Goal: a non-Azure-expert can run `azd up` and get a working DEV (POC) environment; PRD is the same templates with bigger SKUs. Single `DATABASE_URL` is the only app-level value that changes between local / DEV / PRD.

---

## 1. azd Project Layout

`azd` discovers a service by mapping a directory to an Azure host via `azure.yaml`, then provisions everything described under `infra/` (Bicep). The Next.js app already lives at the repo root (`package.json`, `prisma/`, `src/`), so the app service points at `.`.

```
web/                              # repo root = the azd project
├─ azure.yaml                     # azd service map (app -> App Service)
├─ next.config.js                 # set output:'standalone' for App Service
├─ package.json                   # build = next build, start = next start
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/                           # public site + portal + API routes
└─ infra/
   ├─ main.bicep                  # subscription/RG-scope entry; wires modules
   ├─ main.parameters.json        # binds azd env vars -> bicep params
   ├─ abbreviations.json          # Azure resource name prefixes (CAF)
   └─ modules/
      ├─ loganalytics.bicep
      ├─ keyvault.bicep
      ├─ postgres.bicep
      ├─ storage.bicep
      └─ appservice.bicep
```

**`azure.yaml`** — one service named `web`, hosted on App Service, Node runtime, built from the repo root:

```yaml
# azure.yaml
name: levelplay
metadata:
  template: levelplay-construction@0.1
services:
  web:
    project: .
    language: js          # Node/TypeScript
    host: appservice
hooks:
  # run Prisma migrations against the just-provisioned DB before the app serves traffic
  postprovision:
    shell: sh
    run: npx prisma migrate deploy && npx prisma db seed
    interactive: false
    continueOnError: false
```

`azd up` = `azd package` (next build) + `azd provision` (deploy `infra/`) + `azd deploy` (zip/oryx push the app) and runs the hooks. `infra/` is **environment-agnostic**; everything that differs between DEV and PRD is a parameter resolved from the azd environment (Section 3).

> Note: set `output: 'standalone'` in `next.config.js` and run the app on App Service with `node server.js` (or `npm start`) so SSR public pages + API routes both run on the Node runtime.

---

## 2. Bicep Resources

All resources go into one resource group per environment (`rg-levelplay-<env>`), tagged `azd-env-name`. `main.bicep` orchestrates the modules and passes outputs (Key Vault URI, storage account name, DB FQDN) into the web app's settings.

| Resource | Bicep type | Role in this platform | Notes |
|---|---|---|---|
| **Log Analytics workspace** | `Microsoft.OperationalInsights/workspaces` | Central logs/metrics sink for App Service + Postgres diagnostics. | Created first; other modules send diagnostic settings here. |
| **App Service plan** | `Microsoft.Web/serverfarms` | Linux compute hosting the Next.js Node app. | Linux, `reserved: true`. SKU is a parameter (Section 3). |
| **Web App** | `Microsoft.Web/sites` | Runs the single Next.js app (public SSR site + portal + API routes). | `linuxFxVersion: 'NODE\|20-lts'`, `httpsOnly: true`, `alwaysOn` (PRD). Has a **system-assigned managed identity** for Key Vault + Blob access. Tagged `azd-service-name: web` so `azd deploy` targets it. App settings reference Key Vault (Section 5). |
| **PostgreSQL Flexible Server** | `Microsoft.DBforPostgreSQL/flexibleServers` + `/databases` | The single Postgres backing Prisma (`User`, `Project`, `Document`, `Payment`, `DeliveryItem`, …). | `levelplay` database created. `sslmode=require` enforced. Admin password generated and stored in Key Vault, never in source. Firewall: "Allow Azure services" for DEV; private/VNet for PRD (Section 3). |
| **Storage account + Blob container** | `Microsoft.Storage/storageAccounts` + `/blobServices/containers` | Holds media/drawings referenced by `Document.fileUrl` (floor plans, electrical/plumbing/structural drawings, site photos, progress videos). | One container `media`. App generates short-lived **SAS URLs** for client-visible downloads; visibility (CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY) is still enforced in the API before any SAS is minted. `allowBlobPublicAccess: false`, TLS 1.2 min. |
| **Key Vault** | `Microsoft.KeyVault/vaults` | Single source of truth for secrets: DB connection string, `SESSION_SECRET`, storage key, later Entra ID client secret. | RBAC-mode vault; web app's managed identity granted **Key Vault Secrets User**. App settings use `@Microsoft.KeyVault(SecretUri=...)` references — secrets never appear in plaintext app config. |

**Wiring (`main.bicep` outputs → web app app settings):**

| App setting | Source |
|---|---|
| `DATABASE_URL` | Key Vault ref → secret built from Postgres FQDN + admin creds + `?sslmode=require` |
| `SESSION_SECRET` | Key Vault ref → generated secret |
| `AZURE_STORAGE_ACCOUNT` / `AZURE_STORAGE_CONTAINER` | storage module outputs |
| `AZURE_STORAGE_KEY` | Key Vault ref (or managed-identity Blob access — preferred for PRD) |
| `APP_ENV` | `dev` / `prd` from azd env |
| `AZURE_AD_*` | empty for POC; populated at Entra cutover (Section 6) |

---

## 3. DEV vs PRD Environments

`azd` keeps each environment in `.azure/<env-name>/` with its own `.env`. The same `infra/` is deployed twice; only **parameter values** differ, resolved in `main.parameters.json` via `${AZURE_ENV_NAME}` and a per-env SKU map.

| Concern | DEV (POC, demo to the company) | PRD (after procurement) |
|---|---|---|
| App Service plan SKU | `B1` (Basic, 1 instance, cost-minimal) | `P1v3` (Premium v3) |
| `alwaysOn` | off (can cold-start) | on |
| Autoscale | none (single instance) | scale-out rule 1→3 on CPU > 70% |
| Postgres SKU / tier | `Standard_B1ms`, Burstable, 32 GB | `Standard_D2ds_v5`, General Purpose, 128 GB |
| Postgres HA / backups | no HA, 7-day backup | zone-redundant HA, 35-day geo-redundant backup |
| Postgres network | public + "Allow Azure services" firewall | VNet-integrated, private access, no public endpoint |
| Storage redundancy | `LRS` | `ZRS` (or GRS) |
| Seeding | `prisma db seed` runs (dummy bcrypt users for demo) | **no seed**; real users come from Entra ID |
| Custom domain / TLS | default `*.azurewebsites.net` | mapped domain (e.g. `levelplay.in`) + managed cert |
| Log retention | 30 days | 90+ days |

Parameter selection pattern in `main.bicep`:

```bicep
@allowed(['dev','prd'])
param appEnv string
var planSku     = appEnv == 'prd' ? 'P1v3'          : 'B1'
var pgSku       = appEnv == 'prd' ? 'Standard_D2ds_v5' : 'Standard_B1ms'
var pgHa        = appEnv == 'prd'
var runSeed     = appEnv == 'dev'
```

---

## 4. Deploy Runbook (step-by-step)

**Prerequisites (once per machine):** Node 20, Azure Developer CLI (`azd`), and Azure CLI installed; Owner/Contributor on the target subscription.

### DEV (POC)
```bash
# 1. Authenticate
azd auth login

# 2. Create the DEV environment (prompts for subscription + location, e.g. centralindia)
azd env new dev
azd env set APP_ENV dev

# 3. Provision infra + build + deploy app + run postprovision hook
#    (hook runs: prisma migrate deploy && prisma db seed)
azd up

# 4. Grab the public URL azd prints; verify:
#    - public marketing site loads (services, city pages, project showcase)
#    - onboarding lead form creates a Project status=LEAD
#    - login with a seeded user reaches the portal
```

### PRD (after the company procures)
```bash
azd env new prd
azd env set APP_ENV prd
# point at the prod subscription/location if different:
azd env set AZURE_LOCATION centralindia

azd up        # same templates, prod SKUs, HA on, NO seed
```

**Subsequent app-only releases** (no infra change): `azd deploy` (or `git push` → GitHub Action, Section 7). **Infra change only:** `azd provision`. **Schema change:** commit a new Prisma migration; the `postprovision`/CI step runs `prisma migrate deploy`.

---

## 5. Secrets & Database Migration on Deploy

**Secrets handling**
- **No secret in source.** `infra/` generates the Postgres admin password (Bicep `newGuid()`/uniqueString seed or a `securestring` param) and writes it to Key Vault. `SESSION_SECRET` is generated per environment and stored in Key Vault.
- **Web app reads via reference, not value.** App settings use `@Microsoft.KeyVault(SecretUri=https://<vault>.vault.azure.net/secrets/database-url)`. The web app's **system-assigned managed identity** has the *Key Vault Secrets User* role, so no client secret is needed to read the vault.
- **`DATABASE_URL` is assembled in Bicep** from the Postgres FQDN + admin user + KV-stored password + `?sslmode=require`, stored as the `database-url` secret. This is the single value the HLD says swaps local→Azure.
- **Blob access:** DEV may use a storage key stored in Key Vault; PRD should prefer the managed identity with the *Storage Blob Data Contributor* role and mint user-delegation SAS URLs (so even the storage key isn't a long-lived secret). Visibility filtering (CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY) happens in the API **before** a SAS URL is issued.
- **Local dev** continues to use `.env` (gitignored); only `.env.example` is committed.

**DB migration on deploy**
- Migrations are committed under `prisma/migrations/` and applied with **`prisma migrate deploy`** (apply-only, non-interactive — never `migrate dev` in cloud).
- Triggered by the azd `postprovision` hook (Section 1) for `azd up`, and by the CI pipeline for app-only releases.
- Ordering matters: provision DB → `prisma migrate deploy` → (`prisma db seed` **DEV only**) → app starts serving. Migration runs against the just-created server using the same `DATABASE_URL` from Key Vault.
- Seeding only runs in DEV (dummy bcrypt users for the demo); PRD relies on Entra ID identities (Section 6).

---

## 6. Entra ID Migration Plan

POC uses seeded `User` rows with bcrypt hashes and the `RoleName` enum (CLIENT, ADMIN, PROJECT_ADMIN, PROJECT_OWNER, PROJECT_INCHARGE, ENGINEER, ARCHITECT, WORKER). The schema is already shaped for a config-only swap: roles stay as `RoleName`, only the **source of identity + role assignment** changes.

**Step 1 — App registration**
- Register a single-tenant app in Entra ID (`Levelplay Portal`). Redirect URI `https://<webapp>/api/auth/callback/azure-ad`.
- Create a client secret (or, better, a federated credential), store it in Key Vault, surface it as the `AZURE_AD_CLIENT_SECRET` app setting; set `AZURE_AD_TENANT_ID` / `AZURE_AD_CLIENT_ID`.

**Step 2 — Entra groups 1:1 with `RoleName`**
Create eight security groups whose names mirror the enum:

| Entra group | → `RoleName` |
|---|---|
| `Levelplay-Client` | CLIENT |
| `Levelplay-Admin` | ADMIN |
| `Levelplay-ProjectAdmin` | PROJECT_ADMIN |
| `Levelplay-ProjectOwner` | PROJECT_OWNER |
| `Levelplay-ProjectIncharge` | PROJECT_INCHARGE |
| `Levelplay-Engineer` | ENGINEER |
| `Levelplay-Architect` | ARCHITECT |
| `Levelplay-Worker` | WORKER |

**Step 3 — Emit groups in the token**
In the app registration → Token configuration, add the **groups claim** (security groups) so each sign-in returns the user's group object IDs (or use Graph if you exceed the token group-overage limit).

**Step 4 — Group → role mapping in the auth layer**
- Keep a config map `ENTRA_GROUP_TO_ROLE` (group objectId → `RoleName`) — a deployment config value, no code change to the RBAC service.
- On first login, the auth service: validates the Entra token → resolves group IDs → maps to `RoleName`s → upserts the `User` + `UserRole` rows (just-in-time provisioning). Per-project `ProjectMembership` is still managed in-app by admins.
- The existing RBAC/visibility logic (resolve `UserRole`s + `ProjectMembership`, filter by `Visibility`) is unchanged — it only consumes `RoleName`.

**Step 5 — Cutover**
- Flip the auth provider via config (presence of `AZURE_AD_*` settings selects Entra over the bcrypt seeded-user path).
- Disable/stop seeding in PRD; retire dummy users. DEV can keep seeded users for ongoing demos or also switch to Entra for realistic testing.

---

## 7. CI/CD Outline (GitHub Actions, optional)

`azd pipeline config` scaffolds OIDC federation (no stored cloud secret) and the workflow. Two paths: app-only on push to `main`, full infra on demand.

```yaml
# .github/workflows/deploy.yml (sketch)
name: deploy
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  id-token: write      # OIDC -> Azure, no client secret stored
  contents: read
jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    env: { AZURE_ENV_NAME: dev, AZURE_LOCATION: centralindia }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: Azure/setup-azd@v2
      - run: azd auth login --federated-credential-provider github --client-id ${{ secrets.AZURE_CLIENT_ID }} --tenant-id ${{ secrets.AZURE_TENANT_ID }}
      - run: azd deploy --no-prompt            # app-only; infra via azd provision when changed
      # migrations applied by azd postprovision hook, or explicitly:
      - run: npx prisma migrate deploy
```

- **DEV** auto-deploys on merge to `main`; **PRD** is a manual `workflow_dispatch` (or environment protection rule) so releases to the live client-facing platform are deliberate.
- Use **GitHub Environments** (`dev`, `prd`) with required reviewers on `prd` and per-env secrets (`AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`) bound to the federated OIDC identity.
- The pipeline never holds Azure passwords — OIDC federation + Key Vault keep all secrets in Azure.

---

### Files this LLD assumes you will add
- `web/azure.yaml`
- `web/infra/main.bicep`, `web/infra/main.parameters.json`, `web/infra/modules/*.bicep`
- `next.config.js` → add `output: 'standalone'`
- (optional) `web/.github/workflows/deploy.yml`

All other app code (`src/`, `prisma/schema.prisma`, `prisma/seed.ts`) is unchanged; deployment is purely additive.