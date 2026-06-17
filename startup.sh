#!/bin/bash
# Startup script that applies schema and seeds database before starting server
set -e

echo "Starting Levelplay application..."

# Push schema to database (creates tables if they don't exist)
echo "Pushing Prisma schema to database..."
if npx prisma db push --accept-data-loss --skip-generate; then
  echo "✓ Schema applied successfully"
else
  echo "✗ Schema push failed, but continuing..."
fi

# Seed the database (only if not already seeded)
echo "Seeding database..."
if npx prisma db seed 2>/dev/null; then
  echo "✓ Database seeded successfully"
else
  echo "✗ Seed failed or already seeded (continuing...)"
fi

echo "Starting Next.js server..."
exec node server.js
