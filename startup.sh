#!/bin/bash
# Startup script that applies schema and seeds database before starting server
set -e

echo "🚀 Starting Levelplay application..."

# Push schema to database (creates tables if they don't exist)
echo "📊 Pushing Prisma schema to database..."
if npx prisma db push --accept-data-loss --skip-generate 2>&1; then
  echo "✅ Schema applied successfully"
else
  echo "⚠️  Schema push had issues, but continuing..."
fi

# Seed the database with demo data
echo "🌱 Seeding database with demo data..."
if node prisma/seed.js 2>&1; then
  echo "✅ Database seeded successfully"
else
  echo "⚠️  Seed had issues (may already be seeded), continuing..."
fi

echo "🌐 Starting Next.js server..."
exec node server.js
