# Database Login Fix - Azure Container Apps

## Problem
Login returns 500 error with message: "Unable to connect to server"

## Root Cause
The `DATABASE_URL` environment variable is not configured in Azure Container Apps, causing Prisma to fail when connecting to the database.

## Solution

### 1. Verify Database Configuration in Azure

Check if you have an Azure PostgreSQL Database provisioned:

```bash
# List all PostgreSQL servers in your resource group
az postgres flexible-server list --resource-group <your-resource-group>

# Get connection string
az postgres flexible-server show-connection-string \
  --server-name <your-postgres-server> \
  --database-name levelplay \
  --admin-user <admin-username>
```

### 2. Set DATABASE_URL in Container App

Update your Azure Container App with the correct DATABASE_URL:

```bash
# Set environment variable
az containerapp update \
  --name <your-app-name> \
  --resource-group <your-resource-group> \
  --set-env-vars "DATABASE_URL=postgresql://<username>:<password>@<host>:5432/levelplay?schema=public"
```

**Important**: Replace placeholders:
- `<username>`: Your PostgreSQL admin username
- `<password>`: Your PostgreSQL password (URL encode special chars)
- `<host>`: Your PostgreSQL server hostname (e.g., `yourserver.postgres.database.azure.com`)

### 3. Run Database Migrations

After setting DATABASE_URL, the container needs to run migrations on startup. Verify your container startup command includes:

```bash
# In your Dockerfile or container startup
npm run db:migrate && npm run db:seed && npm start
```

Or update the Container App start command:

```bash
az containerapp update \
  --name <your-app-name> \
  --resource-group <your-resource-group> \
  --command "sh,-c,npm run db:migrate && npm run db:seed && npm start"
```

### 4. Verify Health Check

After deployment, check if the database is working:

```bash
# Health check endpoint
curl https://<your-app-url>/api/health

# Expected response when healthy:
{
  "status": "healthy",
  "database": "connected",
  "seed": {
    "roles": 8,
    "users": 8
  }
}
```

### 5. Test Login

Try logging in with demo credentials:
- Email: `client@demo.test`
- Password: `Passw0rd!`

## Troubleshooting

### If health check shows "Database is not seeded"
```bash
# SSH into container and run seed manually
az containerapp exec \
  --name <your-app-name> \
  --resource-group <your-resource-group> \
  --command "npm run db:seed"
```

### If connection still fails
1. Check firewall rules on PostgreSQL server
2. Verify the container can reach the database (network connectivity)
3. Check application logs:
   ```bash
   az containerapp logs show \
     --name <your-app-name> \
     --resource-group <your-resource-group> \
     --follow
   ```

### If DATABASE_URL format is wrong
URL must be properly encoded:
```javascript
// Example with special characters in password
const password = "Pass@123!";
const encoded = encodeURIComponent(password); // "Pass%40123%21"
const url = `postgresql://user:${encoded}@host:5432/db`;
```

## Demo Accounts

All demo accounts use password: `Passw0rd!`

| Role | Email |
|------|-------|
| Client | client@demo.test |
| Admin | admin@demo.test |
| Project Admin | projectadmin@demo.test |
| Project Owner | owner@demo.test |
| Project Incharge | incharge@demo.test |
| Engineer | engineer@demo.test |
| Architect | architect@demo.test |
| Worker | worker@demo.test |

## Quick Deploy Fix

If you have access to Azure Portal:

1. Go to your Container App
2. Navigate to **Settings** → **Environment variables**
3. Add new environment variable:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://username:password@host:5432/levelplay?schema=public`
4. Click **Save** and wait for container to restart
5. Check logs to verify migrations ran successfully

## Local Testing

To test database connection locally:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://localhost:5432/levelplay"

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Test connection
node scripts/check-db.js

# Start dev server
npm run dev

# Try login at http://localhost:3000/login
```
