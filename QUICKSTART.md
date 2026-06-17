# Levelplay Portal — Quick Start Guide

Get the Levelplay construction management portal running locally in under 5 minutes.

## Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js 18+** ([download](https://nodejs.org/))
  ```bash
  node --version  # Should be v18.x.x or higher
  ```

- ✅ **Docker Desktop** (optional but recommended) ([download](https://www.docker.com/products/docker-desktop/))
  ```bash
  docker --version
  ```

---

## 🚀 Fastest Setup (Automated)

### Step 1: Navigate to the web directory

```bash
cd web
```

### Step 2: Run the setup script

**Windows (Git Bash or PowerShell):**
```bash
npm run setup
```

**Linux/macOS:**
```bash
npm run setup
```

This interactive script will:
- Create your `.env` file
- Start PostgreSQL (Docker or embedded)
- Install all dependencies
- Set up the database
- Seed demo data

### Step 3: Start the development server

```bash
npm run dev
```

### Step 4: Open in browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎯 Manual Setup (5 Steps)

If you prefer manual control:

### 1. Set up environment

```bash
cd web
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL` (see options below)
- `SESSION_SECRET` (generate: `openssl rand -base64 32`)

### 2. Start PostgreSQL

**Option A: Docker (Recommended)**
```bash
npm run docker:up
```

**Option B: Embedded PostgreSQL**
```bash
npm run db:local
# Keep this terminal open
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up database

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Create tables
npm run db:seed      # Add demo data
```

### 5. Start the app

```bash
npm run dev
```

---

## 📋 Database URL Options

Choose one and add to `.env`:

### Docker Compose (port 5432)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/levelplay?schema=public"
```

### Embedded PostgreSQL (port 55432)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:55432/levelplay?schema=public"
```

### Cloud Database (Neon, Supabase, etc.)
```env
DATABASE_URL="postgresql://user:password@host.region.provider.com/database?sslmode=require"
```

---

## 🔐 Demo Login Credentials

All accounts use password: **`Passw0rd!`**

| Email                  | Role          | Access Level            |
|------------------------|---------------|-------------------------|
| admin@demo.test        | Admin         | Full system access      |
| client@demo.test       | Client        | Client docs only        |
| engineer@demo.test     | Engineer      | Internal docs           |
| architect@demo.test    | Architect     | Internal docs           |
| projectadmin@demo.test | Project Admin | Project management      |

---

## ✅ Verify Setup

Check that everything is working:

```bash
bash scripts/verify.sh
```

Expected output:
```
✓ Node.js v20.x.x (>= 18 required)
✓ npm x.x.x
✓ .env file exists
✓ DATABASE_URL is set
✓ Prisma client generated
✓ Database connection successful

✓ Environment looks good!
```

---

## 🛠️ Common Commands

| Command                  | Description                         |
|--------------------------|-------------------------------------|
| `npm run dev`            | Start development server            |
| `npm run build`          | Build for production                |
| `npm run db:studio`      | Open Prisma Studio (DB GUI)         |
| `npm run docker:up`      | Start PostgreSQL (Docker)           |
| `npm run docker:down`    | Stop PostgreSQL (Docker)            |
| `npm run db:local`       | Start embedded PostgreSQL           |
| `npm run db:seed`        | Seed demo data                      |

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill the process using port 3000
npx kill-port 3000
# OR use a different port
PORT=3001 npm run dev
```

### Cannot connect to database

**Docker:**
```bash
docker compose ps              # Check if running
npm run docker:logs            # Check logs
docker compose restart postgres # Restart
```

**Embedded:**
```bash
# Make sure db:local is running in another terminal
npm run db:local
```

### Fresh install not working

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run db:generate
```

### Database issues

```bash
# Reset and reseed
npm run db:push
npm run db:seed
```

---

## 📚 Next Steps

### Explore the App

1. **Public Site:** [http://localhost:3000](http://localhost:3000)
2. **Portal Login:** Click "Portal Login" button
3. **Dashboard:** Log in with any demo account
4. **Database GUI:** `npm run db:studio` → [http://localhost:5555](http://localhost:5555)

### Test RBAC

1. Log in as `client@demo.test`
2. Navigate to the demo project
3. Note which documents are visible
4. Log out and log in as `engineer@demo.test`
5. See additional internal documents

### Read Documentation

- `LOCAL_SETUP.md` — Comprehensive setup guide
- `DEPLOY.md` — Azure deployment instructions
- `docs/` — Architecture and design documents

---

## 🆘 Need Help?

1. **Verify setup:** `bash scripts/verify.sh`
2. **Check logs:** `npm run docker:logs`
3. **Full guide:** See `LOCAL_SETUP.md`
4. **GitHub Issues:** Report problems with error logs

---

## 📦 Project Structure

```
web/
├── src/app/          # Next.js pages & API routes
├── src/components/   # React components
├── src/lib/          # Core logic (auth, RBAC, Prisma)
├── prisma/           # Database schema & seed
├── scripts/          # Setup & utility scripts
├── docker-compose.yml # PostgreSQL container
└── LOCAL_SETUP.md    # Full documentation
```

---

## ⚡ Quick Reference Card

```bash
# First time
npm run setup

# Daily workflow
npm run docker:up    # Start database
npm run dev          # Start app
# ... develop ...
npm run docker:down  # Stop database

# Useful commands
npm run db:studio    # Visual database browser
npm run db:seed      # Reset demo data
bash scripts/verify.sh # Check environment
```

---

**Ready to go?** → `npm run setup` then `npm run dev`

**Time to first screen:** ~5 minutes ⚡
