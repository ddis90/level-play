#!/bin/bash
# Startup script that applies migrations and seeds database before starting server
# Continues even if individual steps fail to ensure server starts

echo "🚀 Starting Levelplay application..."

# Apply migrations to database
echo "📊 Running Prisma migrations..."
npx prisma migrate deploy 2>&1 || echo "⚠️  Migration failed (may already be applied)"

# Seed the database with demo data
echo "🌱 Seeding database with demo data..."
npm run db:seed 2>&1 || echo "⚠️  Seed failed (may already be seeded)"

echo "🌐 Starting Next.js server..."
exec node server.js
