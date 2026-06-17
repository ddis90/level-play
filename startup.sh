#!/bin/bash
# Startup script that applies schema and seeds database before starting server
# Continues even if individual steps fail to ensure server starts

echo "🚀 Starting Levelplay application..."

# Push schema to database (creates tables if they don't exist)
echo "📊 Pushing Prisma schema to database..."
npx prisma db push --accept-data-loss --skip-generate 2>&1 || echo "⚠️  Schema push failed"

# Seed the database with demo data
echo "🌱 Seeding database with demo data..."
node prisma/seed.js 2>&1 || echo "⚠️  Seed failed (may already be seeded)"

echo "🌐 Starting Next.js server..."
exec node server.js
