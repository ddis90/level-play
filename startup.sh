#!/bin/bash
# Startup script that applies migrations and seeds database before starting server

echo "🚀 Starting Levelplay application..."

# Apply migrations to database
echo "📊 Running Prisma migrations..."
npx prisma migrate deploy 2>&1 || echo "⚠️  Migration failed"

# Seed the database with demo data using the JS version
echo "🌱 Seeding database with demo data..."
node prisma/seed.js 2>&1 || echo "⚠️  Seed failed (may already be seeded)"

echo "🌐 Starting Next.js server..."
exec node server.js
