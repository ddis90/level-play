#!/bin/bash
# Comprehensive Login Testing for All 8 Roles
# Tests login functionality, RBAC, and dashboard access

BASE_URL="https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io"
PASSWORD="Passw0rd!"

echo "==================================="
echo "Levelplay Login Testing - All Roles"
echo "==================================="
echo ""

# Role test configurations
declare -A ROLES
ROLES[CLIENT]="client@demo.test"
ROLES[ADMIN]="admin@demo.test"
ROLES[PROJECT_ADMIN]="projectadmin@demo.test"
ROLES[PROJECT_OWNER]="owner@demo.test"
ROLES[PROJECT_INCHARGE]="incharge@demo.test"
ROLES[ENGINEER]="engineer@demo.test"
ROLES[ARCHITECT]="architect@demo.test"
ROLES[WORKER]="worker@demo.test"

# Test results
PASSED=0
FAILED=0

# Test function for each role
test_role_login() {
    local role=$1
    local email=$2

    echo "Testing Role: $role"
    echo "Email: $email"
    echo "-----------------------------------"

    # Open browser and navigate to login
    agent-browser open "$BASE_URL/login" --wait-until networkidle

    # Take initial snapshot
    agent-browser snapshot -i > /tmp/login_snapshot.txt

    # Find email and password fields
    EMAIL_REF=$(grep -o '@e[0-9]*' /tmp/login_snapshot.txt | head -1)
    PASS_REF=$(grep -o '@e[0-9]*' /tmp/login_snapshot.txt | sed -n '2p')
    SUBMIT_REF=$(grep -o '@e[0-9]*' /tmp/login_snapshot.txt | tail -1)

    if [ -z "$EMAIL_REF" ] || [ -z "$PASS_REF" ]; then
        echo "❌ FAILED: Could not find login form elements"
        ((FAILED++))
        echo ""
        return 1
    fi

    # Fill in credentials
    agent-browser fill "$EMAIL_REF" "$email"
    agent-browser fill "$PASS_REF" "$PASSWORD"

    # Submit form
    agent-browser click "$SUBMIT_REF"

    # Wait for navigation
    sleep 3
    agent-browser wait --load networkidle

    # Check if login successful
    CURRENT_URL=$(agent-browser get url)

    if [[ "$CURRENT_URL" == *"/dashboard"* ]] || [[ "$CURRENT_URL" == *"/portal"* ]]; then
        echo "✅ PASSED: Login successful"
        echo "   Redirected to: $CURRENT_URL"

        # Take dashboard snapshot
        agent-browser snapshot -i > "/tmp/dashboard_${role}.txt"

        # Verify role-specific content
        if agent-browser get text "body" | grep -q "$role"; then
            echo "✅ Role verified in dashboard"
        fi

        ((PASSED++))
    else
        echo "❌ FAILED: Login failed or incorrect redirect"
        echo "   Current URL: $CURRENT_URL"

        # Check for error messages
        ERROR_MSG=$(agent-browser get text "body" | grep -i "error\|invalid\|failed" || echo "No error message found")
        echo "   Error: $ERROR_MSG"

        ((FAILED++))
    fi

    # Logout
    agent-browser open "$BASE_URL/api/auth/signout"
    sleep 2

    echo ""
}

# Run tests for all roles
for role in "${!ROLES[@]}"; do
    test_role_login "$role" "${ROLES[$role]}"
done

# Summary
echo "==================================="
echo "Test Summary"
echo "==================================="
echo "Total Tests: $((PASSED + FAILED))"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All login tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check logs above."
    exit 1
fi
