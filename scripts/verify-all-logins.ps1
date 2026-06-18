# PowerShell script to verify all role logins
# Tests each role's login credentials and verifies portal access

$BASE_URL = "https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io"
$PASSWORD = "Passw0rd!"

Write-Host ""
Write-Host "🔍 LEVELPLAY LOGIN VERIFICATION" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test credentials
$CREDENTIALS = @{
    "CLIENT" = "client@demo.test"
    "ADMIN" = "admin@demo.test"
    "PROJECT_ADMIN" = "projectadmin@demo.test"
    "PROJECT_OWNER" = "owner@demo.test"
    "PROJECT_INCHARGE" = "incharge@demo.test"
    "ENGINEER" = "engineer@demo.test"
    "ARCHITECT" = "architect@demo.test"
    "WORKER" = "worker@demo.test"
}

# Step 1: Health Check
Write-Host "📊 Step 1: Health Check" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest -Uri "$BASE_URL/api/health" -Method GET -UseBasicParsing
    $healthBody = $healthResponse.Content | ConvertFrom-Json

    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ Health check passed (200)" -ForegroundColor Green
        Write-Host ($healthBody | ConvertTo-Json -Depth 3)

        if ($healthBody.seed.users -eq 8) {
            Write-Host "✅ Database seeded correctly ($($healthBody.seed.users) users)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Expected 8 users, found: $($healthBody.seed.users)" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.Exception.Response.StatusCode -eq 503) {
        Write-Host "Database may not be ready. Retrying in 30 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30

        try {
            $healthResponse = Invoke-WebRequest -Uri "$BASE_URL/api/health" -Method GET -UseBasicParsing
            Write-Host "✅ Health check passed on retry" -ForegroundColor Green
        } catch {
            Write-Host "❌ Health check still failing. Exiting." -ForegroundColor Red
            exit 1
        }
    } else {
        exit 1
    }
}

Write-Host ""

# Step 2: Test All Logins
Write-Host "🔐 Step 2: Testing All Role Logins" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Yellow

$passCount = 0
$failCount = 0
$results = @()

foreach ($role in $CREDENTIALS.Keys | Sort-Object) {
    $email = $CREDENTIALS[$role]

    Write-Host -NoNewline "Testing $role ($email)... "

    $body = @{
        email = $email
        password = $PASSWORD
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-WebRequest `
            -Uri "$BASE_URL/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing

        $loginBody = $loginResponse.Content | ConvertFrom-Json

        if ($loginResponse.StatusCode -eq 200 -and $loginBody.ok -eq $true) {
            Write-Host "✅ PASS" -ForegroundColor Green
            $passCount++
            $results += [PSCustomObject]@{
                Role = $role
                Email = $email
                Status = "PASS"
                Color = "Green"
            }
        } else {
            Write-Host "❌ FAIL (unexpected response)" -ForegroundColor Red
            Write-Host "   Response: $($loginBody | ConvertTo-Json)" -ForegroundColor Red
            $failCount++
            $results += [PSCustomObject]@{
                Role = $role
                Email = $email
                Status = "FAIL"
                Color = "Red"
            }
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorBody = ""

        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            $reader.Close()
        } catch {}

        if ($statusCode -eq 401) {
            Write-Host "❌ FAIL (401 Unauthorized - Invalid credentials)" -ForegroundColor Red
        } else {
            Write-Host "❌ FAIL (HTTP $statusCode)" -ForegroundColor Red
        }

        if ($errorBody) {
            Write-Host "   Response: $errorBody" -ForegroundColor Red
        }

        $failCount++
        $results += [PSCustomObject]@{
            Role = $role
            Email = $email
            Status = "FAIL (HTTP $statusCode)"
            Color = "Red"
        }
    }
}

Write-Host ""

# Step 3: Summary
Write-Host "📋 Summary" -ForegroundColor Cyan
Write-Host "----------" -ForegroundColor Cyan
Write-Host "Total Roles Tested: $($CREDENTIALS.Count)"
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -eq 0) { "Green" } else { "Red" })
Write-Host ""

# Display results table
Write-Host "Results Table:" -ForegroundColor Cyan
$results | Format-Table -AutoSize

if ($failCount -eq 0) {
    Write-Host "🎉 ALL LOGINS WORKING! Ready for presentation." -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some logins failed. Check errors above." -ForegroundColor Yellow
    exit 1
}
