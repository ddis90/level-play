# Levelplay Portal — QA Test Setup & Credentials

**Prepared by:** DevOps Engineer  
**Date:** 2026-06-17  
**For:** QA Testing Team

---

## System Overview

**Application:** Levelplay Constructions Digital Platform  
**Type:** Next.js 14 full-stack web application  
**Purpose:** Construction project management portal with RBAC and document visibility controls

---

## Local Setup Summary

The development environment has been fully configured with:

### ✅ Created Files

1. **`docker-compose.yml`** — PostgreSQL 16 container configuration
2. **`scripts/setup.sh`** — Automated setup script (Unix/Git Bash)
3. **`scripts/setup.bat`** — Automated setup script (Windows)
4. **`scripts/verify.sh`** — Environment verification script
5. **`scripts/README.md`** — Scripts documentation
6. **`LOCAL_SETUP.md`** — Comprehensive 600+ line setup guide
7. **`QUICKSTART.md`** — 5-minute quick start guide

### ✅ Updated Files

- **`package.json`** — Added helper scripts:
  - `npm run setup` — Run automated setup
  - `npm run db:local` — Start embedded PostgreSQL
  - `npm run docker:up/down` — Docker Compose controls
  - `npm run docker:logs` — View PostgreSQL logs

---

## Quick Start for QA

### Prerequisites

- Node.js 18+ (verified: v24.13.0 available)
- Docker Desktop (optional but recommended)

### Setup Commands

```bash
# Navigate to web directory
cd web

# Run automated setup
npm run setup
# Choose option 1 (Docker Compose) when prompted
# Choose Y to seed demo data

# Start development server
npm run dev
```

**Application URL:** [http://localhost:3000](http://localhost:3000)

---

## Test Credentials

All accounts use password: **`Passw0rd!`**

### Primary Test Accounts

| Email                  | Role          | Use Case                                  |
|------------------------|---------------|-------------------------------------------|
| admin@demo.test        | Admin         | Full system access, all projects          |
| projectadmin@demo.test | Project Admin | Project-level admin, admin-only docs      |
| client@demo.test       | Client        | Client view, client-visible docs only     |
| engineer@demo.test     | Engineer      | Staff access, internal documents          |
| architect@demo.test    | Architect     | Staff access, internal documents          |

### Additional Test Accounts

| Email                | Role             | Use Case                     |
|----------------------|------------------|------------------------------|
| owner@demo.test      | Project Owner    | Project ownership role       |
| incharge@demo.test   | Project Incharge | Site management              |
| worker@demo.test     | Worker           | Field worker, limited access |

---

## Test Scenarios

### 1. RBAC Testing (Document Visibility)

**Objective:** Verify role-based document visibility

**Steps:**
1. Log in as `client@demo.test`
2. Navigate to dashboard → Select "Indiranagar Villa" project
3. Go to Documents section
4. **Verify:** Only CLIENT_VISIBLE documents appear
5. Log out
6. Log in as `engineer@demo.test`
7. Navigate to the same project → Documents
8. **Verify:** CLIENT_VISIBLE + INTERNAL documents appear
9. Log out
10. Log in as `admin@demo.test`
11. Navigate to same project → Documents
12. **Verify:** All documents (CLIENT_VISIBLE + INTERNAL + ADMIN_ONLY) appear

**Expected Results:**
- Each role sees only documents matching their visibility level
- No unauthorized document access
- Clean UI (no errors/broken links)

---

### 2. Authentication Flow

**Objective:** Test login/logout and session management

**Steps:**
1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Portal Login"
3. Attempt login with invalid credentials → **Verify:** Error message
4. Login with `client@demo.test` / `Passw0rd!` → **Verify:** Redirects to dashboard
5. Check dashboard shows user name and role
6. Try accessing `/portal/admin` → **Verify:** Access denied or not visible
7. Logout → **Verify:** Redirects to login page
8. Try accessing `/portal/dashboard` → **Verify:** Redirects to login

---

### 3. Multi-Role User Testing

**Objective:** Verify users can hold multiple roles

**Test Account:** Some users have multiple roles assigned

**Steps:**
1. Check `UserRole` table in Prisma Studio (`npm run db:studio`)
2. Verify users with multiple role assignments
3. Test access patterns for multi-role users

---

### 4. Project Access Control

**Objective:** Verify users only see projects they're members of

**Steps:**
1. Log in as `client@demo.test`
2. Dashboard should show only projects where user is a member
3. Try direct URL access to non-member project
4. **Verify:** Access denied or 404

---

### 5. Payment & Invoice Testing

**Objective:** Test financial transparency features

**Steps:**
1. Log in as `client@demo.test`
2. Navigate to demo project → Payments section
3. **Verify:** Can view payment milestones
4. **Verify:** Can see payment status (PLANNED, PAID, etc.)
5. Log in as `admin@demo.test`
6. **Verify:** Can create/edit payment records

---

### 6. Document Upload

**Objective:** Test document upload with visibility controls

**Steps:**
1. Log in as `engineer@demo.test`
2. Navigate to project → Documents
3. Upload a document
4. Set visibility to INTERNAL
5. Log out, log in as `client@demo.test`
6. **Verify:** Document is NOT visible
7. Log in as `architect@demo.test`
8. **Verify:** Document IS visible

---

## Database Access for Testing

### Prisma Studio (Visual Database Browser)

```bash
npm run db:studio
```

Opens [http://localhost:5555](http://localhost:5555)

**Tables to inspect:**
- `User` — Test accounts
- `Role` — System roles
- `UserRole` — User-role assignments
- `Project` — Demo projects
- `ProjectMembership` — Project access
- `Document` — Uploaded documents with visibility
- `Payment` — Payment milestones

---

## Environment Details

### Application Stack

- **Framework:** Next.js 14 (App Router, React 18)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5.22
- **Auth:** bcrypt + signed-cookie sessions
- **Validation:** Zod
- **UI:** TailwindCSS + Radix UI
- **Type Safety:** TypeScript 5.5

### Ports

| Service    | Port | URL                               |
|------------|------|-----------------------------------|
| Next.js    | 3000 | http://localhost:3000             |
| PostgreSQL | 5432 | postgresql://localhost:5432       |
| Prisma Studio | 5555 | http://localhost:5555          |

### Database Credentials (Local)

```
Host: localhost
Port: 5432 (Docker) or 55432 (embedded)
Database: levelplay
User: postgres
Password: postgres
```

---

## Troubleshooting for QA

### Cannot connect to application

```bash
# Check if dev server is running
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Restart dev server
npm run dev
```

### Cannot connect to database

```bash
# Check Docker container
docker compose ps
npm run docker:logs

# Restart database
npm run docker:down
npm run docker:up
```

### Need to reset database

```bash
npm run docker:down
docker volume rm web_postgres_data
npm run docker:up
npm run db:push
npm run db:seed
```

### Login not working

```bash
# Reseed demo data
npm run db:seed
```

### Port conflicts

```bash
# Use different port for Next.js
PORT=3001 npm run dev

# Stop conflicting process
npx kill-port 3000
```

---

## Test Data

### Demo Project: "Indiranagar Villa"

**Details:**
- Code: LP-2026-001
- Status: IN_PROGRESS
- Budget: ₹50,00,000
- Location: Indiranagar, Bangalore
- Has sample documents, payments, and members

**Members:**
- Client: client@demo.test
- Engineer: engineer@demo.test
- Architect: architect@demo.test
- Admin: admin@demo.test

---

## Key Test Assertions

### ✅ Security

- [ ] No password visible in logs or UI
- [ ] Session expires on logout
- [ ] Unauthorized routes return 403/redirect
- [ ] SQL injection protection (via Prisma)
- [ ] XSS protection (React escaping)

### ✅ RBAC

- [ ] Client sees only CLIENT_VISIBLE documents
- [ ] Engineer sees CLIENT_VISIBLE + INTERNAL
- [ ] Admin sees all documents
- [ ] Users only see projects they're members of

### ✅ UI/UX

- [ ] Login form validates inputs
- [ ] Dashboard loads without errors
- [ ] Navigation works for all roles
- [ ] Responsive design (test mobile viewport)
- [ ] Accessibility (keyboard navigation)

### ✅ Performance

- [ ] Pages load within 2 seconds
- [ ] No console errors
- [ ] Database queries optimized (check Prisma logs)

---

## Reporting Issues

When reporting bugs, include:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **User role** (which test account)
5. **Browser & version**
6. **Console errors** (F12 → Console)
7. **Network errors** (F12 → Network)

### Logs to check

```bash
# Application logs
# (shown in terminal where npm run dev is running)

# Database logs
npm run docker:logs

# Browser console
# F12 → Console tab
```

---

## Additional Resources

- **Full Setup Guide:** `web/LOCAL_SETUP.md`
- **Quick Start:** `web/QUICKSTART.md`
- **Scripts Docs:** `web/scripts/README.md`
- **Architecture:** `web/docs/01-BRD-levelplay.md` through `web/docs/07-*.md`
- **Deployment:** `web/DEPLOY.md`

---

## QA Checklist

### Initial Setup
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] Cloned repository
- [ ] Ran `npm run setup` successfully
- [ ] Database seeded with demo data
- [ ] Application accessible at http://localhost:3000
- [ ] Prisma Studio accessible at http://localhost:5555

### Functional Testing
- [ ] All 8 demo accounts can log in
- [ ] RBAC document visibility works correctly
- [ ] Projects display for authorized users only
- [ ] Documents upload and display
- [ ] Payments section loads and displays
- [ ] Navigation works across all pages
- [ ] Logout works and clears session

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)

### Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Security Testing
- [ ] Password masking in login form
- [ ] Session invalidation on logout
- [ ] Direct URL access blocked for unauthorized routes
- [ ] No sensitive data in browser storage

---

## Contact

**Questions or Issues?**
- Check troubleshooting section above
- Review `LOCAL_SETUP.md` for detailed guides
- Run environment verification: `bash scripts/verify.sh`

---

**Status:** ✅ Environment ready for QA testing  
**Next Steps:** Begin test scenario execution  
**Estimated Setup Time:** 5-10 minutes
