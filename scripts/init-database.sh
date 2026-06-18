#!/bin/bash
# One-time database initialization script for Azure Container App

echo "=== Levelplay Database Initialization ==="
echo "This script will:"
echo "1. Run Prisma migrations"
echo "2. Seed the database with demo data"
echo ""

CONTAINER_APP="lp-dev-web-kopp3c4slv3eg"
RESOURCE_GROUP="rg-levelplay-dev"

echo "Step 1: Running Prisma migrations..."
az containerapp exec \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --command "npx prisma migrate deploy" \
  || echo "Migration may have already run or exec not available"

echo ""
echo "Step 2: Seeding database with demo users..."
az containerapp exec \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --command "npm run db:seed" \
  || echo "Seed may have already run or exec not available"

echo ""
echo "=== Testing login endpoint ==="
curl -X POST https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@demo.test","password":"Passw0rd!"}' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "=== Done ==="
