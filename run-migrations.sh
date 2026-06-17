#!/bin/bash
# Script to run database migrations on Azure Container App

set -e

CONTAINER_APP="lp-dev-web-kopp3c4slv3eg"
RESOURCE_GROUP="rg-levelplay-dev"

echo "Running database migrations on Azure Container App..."
echo "Container App: $CONTAINER_APP"
echo "Resource Group: $RESOURCE_GROUP"
echo ""

# Try to run migrations using az containerapp job
echo "Attempting to run migrations..."
az containerapp job create \
  --name "${CONTAINER_APP}-migrate" \
  --resource-group "$RESOURCE_GROUP" \
  --environment-id "/subscriptions/738826d4-0935-48a2-b402-670d99728697/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/managedEnvironments/lp-dev-env" \
  --trigger-type Manual \
  --replica-timeout 300 \
  --image "lpdevregistry848e7b.azurecr.io/levelplay-web:latest" \
  --cpu 0.5 \
  --memory 1Gi \
  --command "/bin/sh" \
  --args "-c,npx prisma migrate deploy && npx prisma db seed" \
  --env-vars DATABASE_URL=secretref:database-url \
  --secrets database-url="$(az containerapp show -n $CONTAINER_APP -g $RESOURCE_GROUP --query 'properties.configuration.secrets[?name==`database-url`].value' -o tsv)" \
  2>/dev/null || echo "Job may already exist"

# Execute the job
az containerapp job start \
  --name "${CONTAINER_APP}-migrate" \
  --resource-group "$RESOURCE_GROUP"

echo ""
echo "Migration job started. Check Azure Portal for status."
