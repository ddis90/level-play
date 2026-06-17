# Scripts Directory

Helper scripts for local development and database management.

## Available Scripts

### `setup.sh` / `setup.bat`

**Purpose:** Automated environment setup for local development.

**Usage:**

```bash
# Linux/macOS/Git Bash
bash scripts/setup.sh

# Windows Command Prompt
scripts\setup.bat

# Via npm (works on all platforms)
npm run setup
```

**What it does:**
- Checks prerequisites (Node.js, npm, Docker)
- Creates `.env` from `.env.example`
- Generates random `SESSION_SECRET`
- Prompts for database option (Docker/embedded/manual)
- Installs npm dependencies
- Generates Prisma client
- Pushes database schema
- Seeds demo data (optional)

**Interactive prompts:**
1. Choose database: Docker Compose (1), Embedded PostgreSQL (2), or Manual (3)
2. Seed demo data: Y/n

---

### `verify.sh`

**Purpose:** Verifies that the development environment is correctly configured.

**Usage:**

```bash
bash scripts/verify.sh
```

**What it checks:**
- Node.js version (>= 18)
- npm installation
- Docker availability and daemon status
- `package.json` exists
- `node_modules` directory
- `.env` file and required variables
- Prisma client generation
- Database connectivity (if psql available)

**Exit codes:**
- `0` — All checks passed
- `1` — One or more checks failed

**Sample output:**
```
✓ Node.js v20.11.0 (>= 18 required)
✓ npm 10.2.4
✓ Docker 24.0.7
✓ Docker daemon is running
✓ .env file exists
✓ DATABASE_URL is set
✓ Prisma client generated
✓ Database connection successful

Summary
Passed: 12
Warnings: 1
Failed: 0

✓ Environment looks good!
```

---

### `local-db.mjs`

**Purpose:** One-shot embedded PostgreSQL control script.

**Usage:**

```bash
# Start embedded PostgreSQL
node scripts/local-db.mjs start

# Stop embedded PostgreSQL
node scripts/local-db.mjs stop
```

**Details:**
- Runs PostgreSQL on port `55432`
- Data stored in `.localpg/` directory
- Credentials: `postgres` / `postgres`
- Database: `levelplay`
- Use this for quick testing without Docker

**Start command output:**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/levelplay?schema=public
```

Copy this to your `.env` file.

---

### `local-db-daemon.mjs`

**Purpose:** Long-running embedded PostgreSQL daemon (keeps terminal open).

**Usage:**

```bash
# Start daemon (stays running)
node scripts/local-db-daemon.mjs

# Stop: Press Ctrl+C

# Via npm (recommended)
npm run db:local
```

**Details:**
- Same as `local-db.mjs` but stays running
- Gracefully handles SIGINT/SIGTERM
- Prints `READY` message when PostgreSQL is up
- Best for development workflow (keep one terminal dedicated to this)

**Sample output:**
```
READY postgresql://postgres:postgres@localhost:55432/levelplay?schema=public
```

---

## Script Dependencies

### All Scripts Require:
- **Node.js** 18.x or higher
- **npm** (comes with Node.js)

### Optional Dependencies:
- **Docker** (for Docker Compose database option)
- **Git Bash** (Windows users for `.sh` scripts)
- **psql** (for `verify.sh` database connection test)

---

## Common Workflows

### First-Time Setup

**Option 1: Automated (Recommended)**
```bash
npm run setup
# Follow interactive prompts
npm run dev
```

**Option 2: Manual**
```bash
# 1. Environment
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# 2. Database (choose one)
npm run docker:up              # Docker Compose
# OR
npm run db:local               # Embedded PostgreSQL

# 3. Dependencies
npm install

# 4. Database schema
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start
npm run dev
```

---

### Daily Development

**With Docker:**
```bash
npm run docker:up
npm run dev
# ... develop ...
npm run docker:down
```

**With Embedded PostgreSQL:**
```bash
# Terminal 1
npm run db:local

# Terminal 2
npm run dev
```

---

### Verify Setup

Check that everything is configured correctly:

```bash
bash scripts/verify.sh
```

Fix any issues reported, then re-run until all checks pass.

---

### Reset Database

**Docker:**
```bash
npm run docker:down
docker volume rm web_postgres_data
npm run docker:up
npm run db:push
npm run db:seed
```

**Embedded:**
```bash
# Stop daemon (Ctrl+C)
rm -rf .localpg
npm run db:local
# In another terminal:
npm run db:push
npm run db:seed
```

---

## Troubleshooting

### `setup.sh` fails on Windows

**Problem:** Bash script won't run in Command Prompt.

**Solution:**
- Use `setup.bat` instead
- Or install Git Bash and run `bash scripts/setup.sh`
- Or use `npm run setup` (works on all platforms)

---

### Embedded PostgreSQL won't start

**Problem:** `local-db.mjs` or `local-db-daemon.mjs` fails.

**Solution:**
1. Delete data directory: `rm -rf .localpg`
2. Try again: `npm run db:local`
3. If still failing, use Docker instead

---

### Docker Compose fails

**Problem:** `npm run docker:up` fails.

**Solution:**
1. Ensure Docker Desktop is running
2. Check Docker is accessible: `docker ps`
3. Try: `docker compose up -d`
4. Check logs: `npm run docker:logs`

---

### Permission denied: `setup.sh`

**Problem:** Script is not executable.

**Solution:**
```bash
chmod +x scripts/setup.sh
chmod +x scripts/verify.sh
```

---

## Adding New Scripts

When adding scripts to this directory:

1. **Use `.sh` for bash scripts** (cross-platform via Git Bash)
2. **Use `.bat` for Windows-specific** scripts
3. **Use `.mjs` for Node.js** scripts (ES modules)
4. **Make scripts executable:**
   ```bash
   chmod +x scripts/your-script.sh
   ```
5. **Add to `package.json` scripts** if user-facing:
   ```json
   "scripts": {
     "your-command": "bash scripts/your-script.sh"
   }
   ```
6. **Document here** in this README

---

## Script Checklist

When writing new scripts:

- [ ] Add shebang: `#!/usr/bin/env bash` or `#!/usr/bin/env node`
- [ ] Set error handling: `set -e` (bash)
- [ ] Add usage/help message
- [ ] Use relative paths from script location
- [ ] Test on Windows (Git Bash) and Linux/macOS
- [ ] Add to this README
- [ ] Add npm script alias (if user-facing)
- [ ] Make executable: `chmod +x`

---

## File Reference

| File                    | Type       | Purpose                              |
|-------------------------|------------|--------------------------------------|
| `setup.sh`              | Bash       | Automated setup (Unix)               |
| `setup.bat`             | Batch      | Automated setup (Windows)            |
| `verify.sh`             | Bash       | Environment verification             |
| `local-db.mjs`          | Node (ESM) | Embedded PostgreSQL one-shot         |
| `local-db-daemon.mjs`   | Node (ESM) | Embedded PostgreSQL daemon           |
| `README.md`             | Markdown   | This file                            |

---

## Environment Variables

Scripts expect these in `.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
SESSION_SECRET="random-base64-string-at-least-32-characters-long"
```

Generate `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Related Documentation

- `../LOCAL_SETUP.md` — Complete local development guide
- `../DEPLOY.md` — Azure deployment guide
- `../README.md` — Project overview
- `../.env.example` — Environment variable template

---

**Maintained by:** DevOps team  
**Last updated:** 2026-06-17
