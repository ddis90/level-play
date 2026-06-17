# Multi-stage build producing a lean Next.js standalone image for Azure.
# Using Debian-based node instead of Alpine to avoid Prisma permission issues
FROM node:20-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma client and build the standalone server.
# DATABASE_URL is needed for Prisma schema, but doesn't need to connect at build time
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true
RUN chmod +x build.sh && ./build.sh

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
# Non-root user for safety.
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -s /bin/bash -m nextjs

# Standalone output bundles only what is needed to run.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public directory if it exists (Next.js may create it during build)
COPY --from=builder /app/public ./public
# Prisma engine + schema so `migrate deploy` can run if needed.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
# Copy node_modules for npx commands
COPY --from=builder /app/node_modules ./node_modules
# Copy startup script
COPY --from=builder --chown=nextjs:nodejs /app/startup.sh ./startup.sh

USER nextjs
EXPOSE 3000
CMD ["sh", "startup.sh"]
