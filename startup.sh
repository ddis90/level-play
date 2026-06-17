#!/bin/bash
# Startup script that runs migrations before starting the server
set -e

echo "Starting Levelplay application..."

# Run database migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database (only if not already seeded)
echo "Seeding database..."
npx prisma db seed || echo "Database already seeded or seed failed (continuing...)"

echo "Starting Next.js server..."
exec node server.js
