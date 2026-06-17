# Levelplay Portal — Local Development Setup

Complete guide for setting up and running the Levelplay construction management portal locally for development and testing.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Database Options](#database-options)
5. [Running the Application](#running-the-application)
6. [Demo Accounts](#demo-accounts)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)
9. [Docker Commands](#docker-commands)

---

## Prerequisites

### Required

- **Node.js** 18.x or higher (20.x recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`
  
- **npm** 8.x or higher (comes with Node.js)
  - Verify: `npm --version`

- **Git** (for cloning and version control)
  - Verify: `git --version`

### Optional but Recommended

- **Docker Desktop** (for PostgreSQL container)
  - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/)
  - Verify: `docker --version`

- **Git Bash** (Windows users) — for running shell scripts
  - Comes with Git for Windows

---

## Quick Start

### Automated Setup (Recommended)

The fastest way to get started:

```bash
cd web
npm run setup
```

This interactive script will:
- Check prerequisites
- Set up your `.env` file
- Start PostgreSQL (Docker or embedded)
- Install dependencies
- Generate Prisma client
- Create database schema
- Optionally seed demo data

After setup completes, start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Setup

### Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd web
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14 (App Router)
- React 18
- Prisma ORM
- Zod validation
- bcryptjs (authentication)
- TailwindCSS + Radix UI components

### Step 3: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

**Required variables in `.env`:**

```env
# Database connection string
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/levelplay?schema=public"

# Session secret (generate a long random string)
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"
```

**Generate a secure SESSION_SECRET:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32
```

### Step 4: Set Up Database

Choose one of three options:

---

## Database Options

### Option 1: Docker Compose (Recommended)

**Pros:**
- Easy to start/stop
- Isolated from system
- Matches production environment
- Persistent data with volumes

**Setup:**

1. Start PostgreSQL:
   ```bash
   npm run docker:up
   # OR
   docker compose up -d
   ```

2. Verify it's running:
   ```bash
   docker compose ps
   ```

3. Your `.env` should have:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/levelplay?schema=public"
   ```

**Useful commands:**
```bash
npm run docker:down      # Stop PostgreSQL
npm run docker:logs      # View PostgreSQL logs
docker compose restart   # Restart PostgreSQL
```

---

### Option 2: Embedded PostgreSQL

**Pros:**
- No Docker required
- Self-contained
- Good for quick testing

**Cons:**
- Runs on non-standard port (55432)
- Must keep daemon running

**Setup:**

1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:55432/levelplay?schema=public"
   ```

2. Start embedded PostgreSQL (keep this terminal open):
   ```bash
   npm run db:local
   ```

3. You should see:
   ```
   READY postgresql://postgres:postgres@localhost:55432/levelplay?schema=public
   ```

**Note:** This terminal must stay open while you develop.

---

### Option 3: Cloud Database (Neon, Supabase, etc.)

**Pros:**
- Always available
- Mirrors production setup
- Free tier available

**Setup:**

1. Create a free PostgreSQL database at:
   - [Neon](https://neon.tech/) (recommended for dev)
   - [Supabase](https://supabase.com/)
   - [ElephantSQL](https://www.elephantsql.com/)

2. Copy the connection string to `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host.region.provider.com/database?sslmode=require"
   ```

**Important:** Keep `?sslmode=require` for cloud databases.

---

### Step 5: Initialize Database Schema

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to database:

```bash
npm run db:push
```

This creates all tables, enums, and indexes from `prisma/schema.prisma`.

### Step 6: Seed Demo Data

Populate the database with sample users and a demo project:

```bash
npm run db:seed
```

This creates:
- 8 demo user accounts (various roles)
- 1 sample project ("Indiranagar Villa")
- Project memberships
- Sample documents and payments

---

## Running the Application

### Development Mode

Start the Next.js dev server with hot reload:

```bash
npm run dev
```

The application will be available at:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **API Routes:** [http://localhost:3000/api/*](http://localhost:3000/api/)

**First-time users:** Visit [http://localhost:3000](http://localhost:3000) and click "Portal Login" to access the authenticated area.

### Production Build (Local Test)

Test the production build locally:

```bash
npm run build
npm start
```

This builds an optimized standalone bundle and serves it on port 3000.

### Prisma Studio (Database GUI)

View and edit database records with Prisma's GUI:

```bash
npm run db:studio
```

Opens [http://localhost:5555](http://localhost:5555) with a visual database browser.

---

## Demo Accounts

All demo accounts use the password: **`Passw0rd!`**

| Email                   | Role           | Access Level                          |
|-------------------------|----------------|---------------------------------------|
| admin@demo.test         | Admin          | Full system access, all projects      |
| projectadmin@demo.test  | Project Admin  | Project management, admin documents   |
| client@demo.test        | Client         | Client-visible documents only         |
| engineer@demo.test      | Engineer       | Staff access, internal documents      |
| architect@demo.test     | Architect      | Staff access, internal documents      |
| owner@demo.test         | Project Owner  | Project-level management              |
| incharge@demo.test      | Project Incharge | Site management                     |
| worker@demo.test        | Worker         | Field access, limited visibility      |

### Testing RBAC (Role-Based Access Control)

1. Log in as `client@demo.test`
2. Navigate to the demo project
3. Note which documents are visible (CLIENT_VISIBLE only)
4. Log out
5. Log in as `engineer@demo.test`
6. Navigate to the same project
7. Note that INTERNAL documents are now visible

This demonstrates the document visibility abstraction in action.

---

## Development Workflow

### Daily Workflow

1. **Start Database** (if using Docker):
   ```bash
   npm run docker:up
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Make Changes** to:
   - Pages: `src/app/**/*.tsx`
   - Components: `src/components/**/*.tsx`
   - API Routes: `src/app/api/**/*.ts`
   - Database: `prisma/schema.prisma`

4. **Test Changes** at [http://localhost:3000](http://localhost:3000)

5. **Stop** (when done):
   ```bash
   # Press Ctrl+C to stop dev server
   npm run docker:down  # Stop Docker database
   ```

### Modifying the Database Schema

When you update `prisma/schema.prisma`:

```bash
# Generate updated Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# OR create a migration (for production-bound changes)
npm run db:migrate
```

### Resetting the Database

**Option 1: Docker** (easiest)
```bash
npm run docker:down
docker volume rm web_postgres_data
npm run docker:up
npm run db:push
npm run db:seed
```

**Option 2: Embedded PostgreSQL**
```bash
# Stop the daemon (Ctrl+C)
rm -rf .localpg
npm run db:local  # Restart daemon
npm run db:push
npm run db:seed
```

---

## Troubleshooting

### Issue: "Port 3000 is already in use"

**Solution:**

```bash
# Windows (PowerShell as Admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# OR use a different port
PORT=3001 npm run dev
```

---

### Issue: "Can't connect to database"

**Symptoms:**
```
Error: P1001: Can't reach database server
```

**Solutions:**

1. **Docker:** Ensure PostgreSQL is running
   ```bash
   docker compose ps
   # If not running:
   npm run docker:up
   ```

2. **Check DATABASE_URL** in `.env` matches your setup:
   - Docker: `localhost:5432`
   - Embedded: `localhost:55432`
   - Cloud: your provider's hostname

3. **Verify PostgreSQL is accepting connections:**
   ```bash
   # Docker
   docker compose exec postgres psql -U postgres -d levelplay

   # Should connect successfully
   ```

---

### Issue: "Prisma Client has not been generated"

**Solution:**

```bash
npm run db:generate
```

This regenerates the Prisma client after schema changes or fresh installs.

---

### Issue: "Table does not exist"

**Solution:**

You need to push the schema to the database:

```bash
npm run db:push
```

---

### Issue: Docker daemon is not running

**Solution:**

1. Start Docker Desktop (Windows/Mac)
2. Wait for Docker to fully start
3. Verify: `docker ps`
4. Try again: `npm run docker:up`

---

### Issue: "MODULE_NOT_FOUND" errors

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Embedded PostgreSQL fails to start

**Symptoms:**
```
Error: Could not start postgres
```

**Solution:**

1. **Delete data directory and try again:**
   ```bash
   rm -rf .localpg
   npm run db:local
   ```

2. **Use Docker instead** (recommended):
   ```bash
   npm run docker:up
   ```
   Update `.env` to use port 5432.

---

### Issue: Login fails with correct credentials

**Symptoms:**
- "Invalid email or password" even with `Passw0rd!`

**Solution:**

1. **Verify database is seeded:**
   ```bash
   npm run db:seed
   ```

2. **Check in Prisma Studio:**
   ```bash
   npm run db:studio
   # Navigate to User table, verify accounts exist
   ```

3. **Reset database and re-seed:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

### Issue: Build fails with TypeScript errors

**Solution:**

```bash
# Check for type errors
npm run build

# Common fixes:
# 1. Ensure @types/* packages are installed
npm install --save-dev @types/node @types/react @types/react-dom

# 2. Regenerate Prisma client
npm run db:generate

# 3. Clean build cache
rm -rf .next
npm run build
```

---

## Docker Commands

### Starting Services

```bash
# Start all services (PostgreSQL)
npm run docker:up

# Start and view logs
docker compose up

# Start specific service
docker compose up postgres
```

### Stopping Services

```bash
# Stop all services
npm run docker:down

# Stop but keep data
docker compose stop

# Stop and remove volumes (data loss!)
docker compose down -v
```

### Viewing Logs

```bash
# Follow logs
npm run docker:logs

# View specific service logs
docker compose logs postgres

# Last 100 lines
docker compose logs --tail=100 postgres
```

### Accessing PostgreSQL Shell

```bash
# Connect to PostgreSQL CLI
docker compose exec postgres psql -U postgres -d levelplay

# Example queries:
\dt              # List tables
\d users         # Describe users table
SELECT * FROM "User" LIMIT 5;
\q               # Quit
```

### Cleaning Up

```bash
# Remove stopped containers
docker compose rm

# Remove all project data
docker compose down -v

# Remove everything (images too)
docker compose down --rmi all -v
```

---

## Project Structure

```
web/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API route handlers
│   │   ├── portal/           # Authenticated portal pages
│   │   └── (public)/         # Public marketing site
│   ├── components/           # React components
│   │   ├── ui/               # Radix UI + Tailwind components
│   │   └── [feature]/        # Feature-specific components
│   └── lib/                  # Core business logic
│       ├── prisma.ts         # Prisma client singleton
│       ├── auth.ts           # Session management
│       ├── rbac.ts           # Role-based access control
│       └── utils.ts          # Utilities
├── prisma/
│   ├── schema.prisma         # Database schema (single source of truth)
│   └── seed.ts               # Demo data seeding script
├── scripts/
│   ├── setup.sh              # Automated setup script
│   ├── local-db.mjs          # Embedded PostgreSQL one-shot
│   └── local-db-daemon.mjs   # Embedded PostgreSQL daemon
├── infra/                    # Azure Bicep infrastructure
├── docs/                     # Architecture & planning docs
├── .env.example              # Environment template
├── docker-compose.yml        # Docker services definition
├── Dockerfile                # Production container build
├── package.json              # Dependencies & scripts
└── LOCAL_SETUP.md            # This file
```

---

## Available npm Scripts

| Script              | Description                                      |
|---------------------|--------------------------------------------------|
| `npm run dev`       | Start Next.js dev server (port 3000)             |
| `npm run build`     | Build production bundle                          |
| `npm start`         | Serve production build                           |
| `npm run lint`      | Run ESLint                                       |
| `npm run db:generate` | Generate Prisma client                         |
| `npm run db:push`   | Push schema to database (no migration)           |
| `npm run db:migrate`| Create and apply migration                       |
| `npm run db:seed`   | Seed database with demo data                     |
| `npm run db:studio` | Open Prisma Studio GUI (port 5555)               |
| `npm run db:local`  | Start embedded PostgreSQL daemon                 |
| `npm run docker:up` | Start Docker Compose services                    |
| `npm run docker:down` | Stop Docker Compose services                   |
| `npm run docker:logs` | View PostgreSQL container logs                 |
| `npm run setup`     | Run automated setup script                       |

---

## Next Steps

### For Development

1. **Explore the codebase:**
   - Start with `src/app/page.tsx` (homepage)
   - Check `src/app/portal/dashboard/page.tsx` (authenticated area)
   - Review `src/lib/rbac.ts` for access control logic

2. **Read the planning docs:**
   - `docs/01-BRD-levelplay.md` — Business requirements
   - `docs/02-HLD-levelplay.md` — High-level design
   - `docs/03..07-LLD-*.md` — Detailed designs per layer

3. **Try the demo:**
   - Create a new project
   - Upload documents with different visibility levels
   - Log in as different roles to see RBAC in action

### For Production Deployment

See `DEPLOY.md` for deploying to Azure via `azd`:
- Single-command deploy (`azd up`)
- Two environments: dev (POC) and prd (production)
- Azure Container Apps + PostgreSQL + Blob Storage

### For Testing

- **Manual testing:** Use demo accounts to test RBAC
- **API testing:** Use Postman/curl against `/api/*` endpoints
- **Database inspection:** Use `npm run db:studio`

---

## Additional Resources

- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs:** [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **TailwindCSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Radix UI:** [https://www.radix-ui.com/](https://www.radix-ui.com/)
- **Docker:** [https://docs.docker.com/](https://docs.docker.com/)

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review existing GitHub issues
3. Open a new issue with:
   - Environment details (`node --version`, `docker --version`)
   - Error logs
   - Steps to reproduce

---

**Last Updated:** 2026-06-17

**Version:** 0.1.0 (POC)
