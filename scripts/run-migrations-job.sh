#!/bin/bash
# Alternative: Use az containerapp job to run migrations
# This creates a one-time job that runs migrations then exits

CONTAINER_APP="lp-dev-web-kopp3c4slv3eg"
RESOURCE_GROUP="rg-levelplay-dev"
ENV_NAME="lp-dev-env-kopp3c4slv3eg"
ACR_NAME="lpdevregistry848e7b"
IMAGE_TAG="latest"

echo "Creating migration job..."

# Get the current image from the container app
IMAGE=$(az containerapp show \
  --name "$CONTAINER_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.template.containers[0].image" -o tsv)

echo "Using image: $IMAGE"

# Create or update the job
az containerapp job create \
  --name "db-migrate-job" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --trigger-type Manual \
  --replica-timeout 300 \
  --replica-retry-limit 1 \
  --parallelism 1 \
  --replica-completion-count 1 \
  --image "$IMAGE" \
  --cpu 0.5 \
  --memory 1.0Gi \
  --command "/bin/sh" \
  --args "-c" "npx prisma migrate deploy && npm run db:seed" \
  --secrets "database-url=\$DATABASE_URL" \
  --env-vars "DATABASE_URL=secretref:database-url" \
  2>/dev/null || echo "Job may already exist"

echo ""
echo "Starting migration job..."
az containerapp job start \
  --name "db-migrate-job" \
  --resource-group "$RESOURCE_GROUP"

echo ""
echo "Checking job status..."
sleep 5
az containerapp job execution list \
  --name "db-migrate-job" \
  --resource-group "$RESOURCE_GROUP" \
  --query "[0].{name:name,status:properties.status,startTime:properties.startTime}" -o table
