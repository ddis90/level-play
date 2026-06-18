# Azure Container App Database Fix Script
# This script updates the DATABASE_URL secret in the container app

$RESOURCE_GROUP = "rg-levelplay-dev"
$APP_NAME = "lp-dev-web-kopp3c4slv3eg"
$PG_HOST = "lp-dev-pg-kopp3c4slv3eg.postgres.database.azure.com"
$PG_USER = "lpadmin"
$PG_PASSWORD = "teSOKbTquefaAhLxhpONdYrg"
$DATABASE_URL = "postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5432/levelplay?sslmode=require"

Write-Host "🔧 Updating Container App Database Configuration" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Yellow
Write-Host "App Name: $APP_NAME" -ForegroundColor Yellow
Write-Host "PostgreSQL Host: $PG_HOST" -ForegroundColor Yellow
Write-Host ""

# Update the secret
Write-Host "📝 Updating DATABASE_URL secret..." -ForegroundColor Yellow

try {
    az containerapp secret set `
        --name $APP_NAME `
        --resource-group $RESOURCE_GROUP `
        --secrets "database-url=$DATABASE_URL" 2>&1 | Out-Null

    Write-Host "✅ Secret updated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update secret: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Azure Portal: https://portal.azure.com" -ForegroundColor White
    Write-Host "2. Navigate to: Resource Groups > rg-levelplay-dev > lp-dev-web-kopp3c4slv3eg" -ForegroundColor White
    Write-Host "3. Go to: Settings > Secrets" -ForegroundColor White
    Write-Host "4. Update 'database-url' secret with:" -ForegroundColor White
    Write-Host "   $DATABASE_URL" -ForegroundColor Cyan
    Write-Host "5. Save and restart the container" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "🔄 Restarting container app..." -ForegroundColor Yellow

try {
    az containerapp revision restart `
        --name $APP_NAME `
        --resource-group $RESOURCE_GROUP 2>&1 | Out-Null

    Write-Host "✅ Container restarted successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Restart failed, but secret is updated. Container will pick it up on next deploy." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⏳ Waiting 30 seconds for container to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "🔍 Testing health endpoint..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest `
        -Uri "https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io/api/health" `
        -Method GET `
        -UseBasicParsing

    $healthBody = $healthResponse.Content | ConvertFrom-Json

    if ($healthBody.status -eq "healthy") {
        Write-Host "✅ Health check PASSED! Database is connected." -ForegroundColor Green
        Write-Host ""
        Write-Host ($healthBody | ConvertTo-Json -Depth 3)
    } else {
        Write-Host "⚠️  Health check returned: $($healthBody.status)" -ForegroundColor Yellow
        Write-Host ($healthBody | ConvertTo-Json -Depth 3)
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Container may still be starting. Try again in a minute." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Next step: Run verification script" -ForegroundColor Cyan
Write-Host "  .\scripts\verify-all-logins.ps1" -ForegroundColor White
