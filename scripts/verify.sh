#!/usr/bin/env bash
# Levelplay Portal — Environment Verification Script
# Checks that all prerequisites and configurations are correct

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS_COUNT++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL_COUNT++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN_COUNT++))
}

echo "======================================"
echo "Levelplay Portal - Environment Check"
echo "======================================"
echo ""

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        check_pass "Node.js $NODE_VERSION (>= 18 required)"
    else
        check_fail "Node.js $NODE_VERSION is too old (>= 18 required)"
    fi
else
    check_fail "Node.js not found"
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_pass "npm $NPM_VERSION"
else
    check_fail "npm not found"
fi

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    check_pass "Docker $DOCKER_VERSION"

    # Check if Docker daemon is running
    if docker ps &> /dev/null; then
        check_pass "Docker daemon is running"
    else
        check_warn "Docker daemon is not running"
    fi
else
    check_warn "Docker not found (optional)"
fi

echo ""
echo "Checking web directory setup..."
echo ""

cd "$WEB_DIR"

# package.json
if [ -f "package.json" ]; then
    check_pass "package.json exists"
else
    check_fail "package.json not found"
fi

# node_modules
if [ -d "node_modules" ]; then
    check_pass "node_modules directory exists"
else
    check_warn "node_modules not found (run: npm install)"
fi

# .env file
if [ -f ".env" ]; then
    check_pass ".env file exists"

    # Check for required variables
    if grep -q "DATABASE_URL=" .env; then
        check_pass "DATABASE_URL is set"
    else
        check_fail "DATABASE_URL not set in .env"
    fi

    if grep -q "SESSION_SECRET=" .env; then
        check_pass "SESSION_SECRET is set"
    else
        check_warn "SESSION_SECRET not set in .env"
    fi
else
    check_fail ".env file not found (copy from .env.example)"
fi

# Prisma client
if [ -d "node_modules/.prisma/client" ]; then
    check_pass "Prisma client generated"
else
    check_warn "Prisma client not generated (run: npm run db:generate)"
fi

# docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    check_pass "docker-compose.yml exists"
else
    check_warn "docker-compose.yml not found"
fi

echo ""
echo "Checking database connection..."
echo ""

# Test database connection
if [ -f ".env" ]; then
    export $(cat .env | grep DATABASE_URL | xargs)

    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            check_pass "Database connection successful"
        else
            check_warn "Cannot connect to database (is PostgreSQL running?)"
        fi
    else
        check_warn "psql not found (cannot test database connection)"
    fi
fi

echo ""
echo "======================================"
echo "Summary"
echo "======================================"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${YELLOW}Warnings: $WARN_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ Environment looks good!${NC}"
    echo ""
    echo "To start development:"
    echo "  npm run dev"
    echo ""
    echo "To open Prisma Studio:"
    echo "  npm run db:studio"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
