#!/bin/bash
# Azure Cloud Shell Deployment Script
# Run this in Azure Portal Cloud Shell (https://shell.azure.com)

set -e

echo "=== Levelplay Deployment Script ==="
echo "This will build and deploy the Next.js app to Azure Container Apps"
echo ""

# Configuration
RESOURCE_GROUP="rg-levelplay-dev"
ACR_NAME="lpdevregistry848e7b"
CONTAINER_APP="lp-dev-web-kopp3c4slv3eg"
SUBSCRIPTION_ID="738826d4-0935-48a2-b402-670d99728697"

# Set subscription
echo "Setting Azure subscription..."
az account set --subscription $SUBSCRIPTION_ID

# Clone or use existing code
if [ ! -d "web" ]; then
    echo "ERROR: Please upload the 'web' directory to Cloud Shell first"
    echo ""
    echo "Steps:"
    echo "1. Go to https://shell.azure.com"
    echo "2. Click 'Upload/Download files' button"
    echo "3. Upload the entire 'web' folder"
    echo "4. Run this script again"
    exit 1
fi

cd web

echo ""
echo "Building Docker image in ACR..."
az acr build \
  --registry $ACR_NAME \
  --image levelplay-web:latest \
  --image levelplay-web:$(date +%Y%m%d-%H%M%S) \
  --file ./Dockerfile \
  .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Updating Container App..."

    az containerapp update \
      --name $CONTAINER_APP \
      --resource-group $RESOURCE_GROUP \
      --image ${ACR_NAME}.azurecr.io/levelplay-web:latest

    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "URL: https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io"
    echo ""
    echo "Running database migrations..."
    # Note: Container App exec might not work, migrations should be in startup
    echo "Migrations will run automatically on container startup"
else
    echo ""
    echo "❌ Build failed. Check the output above for errors."
    exit 1
fi
