# Quick Deploy to Azure Cloud Shell
# This script prepares your code for Cloud Shell deployment

Write-Host "=== Levelplay Cloud Shell Deploy Preparation ===" -ForegroundColor Cyan
Write-Host ""

# Create a clean package
$zipPath = "$env:TEMP\levelplay-deploy.zip"
Write-Host "Creating deployment package..." -ForegroundColor Yellow

# Get the web directory (same directory as this script)
$webDir = $PSScriptRoot

# Compress
Compress-Archive -Path "$webDir\*" -DestinationPath $zipPath -Force

Write-Host "Package created: $zipPath" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Azure Cloud Shell: https://shell.azure.com" -ForegroundColor White
Write-Host ""
Write-Host "2. Upload the package from: $zipPath" -ForegroundColor White
Write-Host ""
Write-Host "3. In Cloud Shell, paste these commands:" -ForegroundColor White
Write-Host ""
$commands = @"
unzip -o levelplay-deploy.zip -d levelplay-web
cd levelplay-web
az acr build --registry lpdevregistry848e7b --image levelplay-web:latest -f Dockerfile .
az containerapp update --name lp-dev-web-kopp3c4slv3eg --resource-group rg-levelplay-dev --image lpdevregistry848e7b.azurecr.io/levelplay-web:latest
echo "Deployed! Visit: https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io"
"@
Write-Host $commands -ForegroundColor Green

Write-Host ""
Write-Host "Opening Cloud Shell..." -ForegroundColor Yellow
Start-Process "https://shell.azure.com"

Write-Host "Opening file location..." -ForegroundColor Yellow
explorer.exe "/select,$zipPath"
