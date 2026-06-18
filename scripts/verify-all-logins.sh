#!/bin/bash
# Complete login verification script for all roles
# Tests each role's login credentials and verifies portal access

BASE_URL="https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io"

echo "🔍 LEVELPLAY LOGIN VERIFICATION"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test credentials
declare -A CREDENTIALS=(
    ["CLIENT"]="client@demo.test"
    ["ADMIN"]="admin@demo.test"
    ["PROJECT_ADMIN"]="projectadmin@demo.test"
    ["PROJECT_OWNER"]="owner@demo.test"
    ["PROJECT_INCHARGE"]="incharge@demo.test"
    ["ENGINEER"]="engineer@demo.test"
    ["ARCHITECT"]="architect@demo.test"
    ["WORKER"]="worker@demo.test"
)

PASSWORD="Passw0rd!"

# Step 1: Health Check
echo "📊 Step 1: Health Check"
echo "----------------------"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/health")
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | tail -n 1)

if [ "$HEALTH_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed (200)${NC}"
    echo "$HEALTH_BODY" | jq '.' 2>/dev/null || echo "$HEALTH_BODY"

    # Check if database is seeded
    USER_COUNT=$(echo "$HEALTH_BODY" | jq -r '.seed.users' 2>/dev/null)
    if [ "$USER_COUNT" -eq 8 ]; then
        echo -e "${GREEN}✅ Database seeded correctly ($USER_COUNT users)${NC}"
    else
        echo -e "${YELLOW}⚠️  Expected 8 users, found: $USER_COUNT${NC}"
    fi
else
    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_STATUS)${NC}"
    echo "$HEALTH_BODY"
    echo ""
    echo "Deployment may still be in progress. Retrying in 30 seconds..."
    sleep 30

    # Retry once
    HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/health")
    HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | tail -n 1)
    if [ "$HEALTH_STATUS" -ne 200 ]; then
        echo -e "${RED}❌ Health check still failing. Exiting.${NC}"
        exit 1
    fi
fi

echo ""

# Step 2: Test All Logins
echo "🔐 Step 2: Testing All Role Logins"
echo "-----------------------------------"

PASS_COUNT=0
FAIL_COUNT=0

for ROLE in "${!CREDENTIALS[@]}"; do
    EMAIL="${CREDENTIALS[$ROLE]}"

    echo -n "Testing $ROLE ($EMAIL)... "

    # Attempt login
    LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
        -X POST "${BASE_URL}/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

    LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
    LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | tail -n 1)

    if [ "$LOGIN_STATUS" -eq 200 ]; then
        # Check for success field
        OK_FIELD=$(echo "$LOGIN_BODY" | jq -r '.ok' 2>/dev/null)
        if [ "$OK_FIELD" = "true" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            ((PASS_COUNT++))
        else
            echo -e "${RED}❌ FAIL (unexpected response)${NC}"
            echo "   Response: $LOGIN_BODY"
            ((FAIL_COUNT++))
        fi
    elif [ "$LOGIN_STATUS" -eq 401 ]; then
        echo -e "${RED}❌ FAIL (401 Unauthorized - Invalid credentials)${NC}"
        echo "   Response: $LOGIN_BODY"
        ((FAIL_COUNT++))
    else
        echo -e "${RED}❌ FAIL (HTTP $LOGIN_STATUS)${NC}"
        echo "   Response: $LOGIN_BODY"
        ((FAIL_COUNT++))
    fi
done

echo ""

# Step 3: Summary
echo "📋 Summary"
echo "----------"
echo -e "Total Roles Tested: ${#CREDENTIALS[@]}"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL LOGINS WORKING! Ready for presentation.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some logins failed. Check errors above.${NC}"
    exit 1
fi
