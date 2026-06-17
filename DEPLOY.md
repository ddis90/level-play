# Deploying Levelplay Portal to Azure with `azd`

One codebase, two environments (**dev** = POC demo, **prd** = production). The
only thing that differs is SKU/scale, driven by the azd environment name.

## Prerequisites (already verified on this machine)
- Azure CLI (`az`), Azure Developer CLI (`azd`), Bicep, Docker.
- An Azure subscription you can create resources in.

## First-time deploy (DEV / POC)

```bash
cd web

az login
azd auth login

# Create the dev environment
azd env new dev

# Required secrets (stored in the azd env, not in git)
azd env set POSTGRES_ADMIN_PASSWORD "<a-strong-password>"
azd env set SESSION_SECRET "<a-long-random-string>"

# Provision Azure resources AND deploy the app in one step.
# The postprovision hook runs `prisma migrate deploy` against the new DB.
azd up
```

`azd up` prints the public URL (the `WEB_URI` output). To seed demo data into the
Azure DB once, point `DATABASE_URL` at the provisioned server and run
`npm run db:seed` (or add a one-off seed hook).

## Production (PRD)

```bash
azd env new prd
azd env set POSTGRES_ADMIN_PASSWORD "<different-strong-password>"
azd env set SESSION_SECRET "<different-long-random-string>"
azd up
```

PRD automatically gets larger SKUs, zone-redundant HA, and geo-redundant backups
(see `infra/main.bicep` — the `isProd` switch).

## What gets provisioned (infra/main.bicep)
- **Container App + environment** — runs the Next.js standalone container.
- **Azure Database for PostgreSQL Flexible Server** + `levelplay` database.
- **Storage account + `media` container** — production media uploads (Blob).
- **Key Vault** — secret storage.
- **Log Analytics** — container logs.

## Redeploying code only
```bash
azd deploy        # rebuilds the image and updates the Container App
```

## Tear down (careful — deletes everything in the env)
```bash
azd down
```

## Migrating auth to Entra ID (production)
1. Register an app in Entra ID; create one security group per role
   (CLIENT, ADMIN, PROJECT_ADMIN, …).
2. Put each group's object id into `Role.azureAdGroupId` (DB or seed).
3. Replace `verifyCredentials` / `getSessionUser` in `src/lib/auth.ts` to read
   group claims from the Entra ID token. Everything in `src/lib/rbac.ts` stays
   the same — visibility and permissions are already keyed on `RoleName`.

That is the whole swap: the role model was built group-shaped from day one.
