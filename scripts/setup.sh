#!/usr/bin/env bash
# Levelplay Portal — Local Development Setup Script
# Works on Windows (Git Bash), macOS, and Linux

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(dirname "$SCRIPT_DIR")"

echo "======================================"
echo "Levelplay Portal - Local Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "1. Checking prerequisites..."
echo ""

# Node.js version check
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed. Please install Node.js 18.x or higher."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version 18 or higher is required. Current: $(node --version)"
    exit 1
fi
log_success "Node.js $(node --version) detected"

# npm check
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed."
    exit 1
fi
log_success "npm $(npm --version) detected"

# Docker check (optional but recommended)
if command -v docker &> /dev/null; then
    log_success "Docker $(docker --version | cut -d' ' -f3 | tr -d ',') detected"
    DOCKER_AVAILABLE=true
else
    log_info "Docker not found. You can still use embedded PostgreSQL or a cloud database."
    DOCKER_AVAILABLE=false
fi

echo ""
echo "2. Setting up database..."
echo ""

# Check if .env exists
if [ ! -f "$WEB_DIR/.env" ]; then
    log_info "Creating .env file from .env.example"
    cp "$WEB_DIR/.env.example" "$WEB_DIR/.env"

    # Generate a random SESSION_SECRET
    if command -v openssl &> /dev/null; then
        SESSION_SECRET=$(openssl rand -base64 32)
        # Update SESSION_SECRET in .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|SESSION_SECRET=.*|SESSION_SECRET=\"$SESSION_SECRET\"|" "$WEB_DIR/.env"
        else
            sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=\"$SESSION_SECRET\"|" "$WEB_DIR/.env"
        fi
        log_success "Generated SESSION_SECRET"
    fi
fi

# Ask user which database option to use
echo "Choose your database option:"
echo "  1) Docker Compose (PostgreSQL in container) - Recommended"
echo "  2) Embedded PostgreSQL (built-in, for testing)"
echo "  3) Skip (I'll configure DATABASE_URL manually)"
echo ""
read -p "Enter choice [1-3]: " DB_CHOICE

case $DB_CHOICE in
    1)
        if [ "$DOCKER_AVAILABLE" = false ]; then
            log_error "Docker is not available. Please install Docker or choose another option."
            exit 1
        fi

        log_info "Starting PostgreSQL with Docker Compose..."
        cd "$WEB_DIR"
        docker compose up -d postgres

        # Wait for PostgreSQL to be ready
        log_info "Waiting for PostgreSQL to be ready..."
        sleep 5

        # Update .env with Docker database URL
        DB_URL="postgresql://postgres:postgres@localhost:5432/levelplay?schema=public"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$WEB_DIR/.env"
        else
            sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$WEB_DIR/.env"
        fi
        log_success "PostgreSQL started via Docker Compose"
        log_success "DATABASE_URL configured"
        ;;

    2)
        log_info "Using embedded PostgreSQL (will start with daemon script)"
        DB_URL="postgresql://postgres:postgres@localhost:55432/levelplay?schema=public"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$WEB_DIR/.env"
        else
            sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$DB_URL\"|" "$WEB_DIR/.env"
        fi
        log_success "DATABASE_URL configured for embedded PostgreSQL"
        log_info "You'll need to run: npm run db:local (in separate terminal)"
        ;;

    3)
        log_info "Skipping database setup. Make sure DATABASE_URL is set in .env"
        ;;

    *)
        log_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "3. Installing dependencies..."
echo ""

cd "$WEB_DIR"
npm install
log_success "Dependencies installed"

echo ""
echo "4. Setting up database schema..."
echo ""

# Generate Prisma client
npm run db:generate
log_success "Prisma client generated"

# Run migrations/push schema
if [ "$DB_CHOICE" = "1" ]; then
    npm run db:push
    log_success "Database schema created"

    # Seed database
    echo ""
    read -p "Seed database with demo data? [Y/n]: " SEED_CHOICE
    SEED_CHOICE=${SEED_CHOICE:-Y}

    if [[ "$SEED_CHOICE" =~ ^[Yy]$ ]]; then
        npm run db:seed
        log_success "Database seeded with demo data"
    fi
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""

if [ "$DB_CHOICE" = "2" ]; then
    echo "1. Start embedded PostgreSQL (in a separate terminal):"
    echo "   cd $(basename "$WEB_DIR")"
    echo "   npm run db:local"
    echo ""
    echo "2. In another terminal, run the setup for schema:"
    echo "   npm run db:push && npm run db:seed"
    echo ""
    echo "3. Start the development server:"
    echo "   npm run dev"
else
    echo "1. Start the development server:"
    echo "   cd $(basename "$WEB_DIR")"
    echo "   npm run dev"
fi

echo ""
echo "2. Open your browser to: http://localhost:3000"
echo ""
echo "Demo accounts (password: Passw0rd!):"
echo "  - admin@demo.test (Admin)"
echo "  - client@demo.test (Client)"
echo "  - engineer@demo.test (Engineer)"
echo "  - architect@demo.test (Architect)"
echo ""
log_success "Happy coding!"
