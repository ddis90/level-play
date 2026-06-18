# 🚨 **IMMEDIATE ACTION REQUIRED - DATABASE FIX**

## **Current Status**
- ✅ New code deployed with health endpoint
- ✅ Health endpoint confirms: DATABASE_URL environment variable is MISSING
- ❌ Login will fail until DATABASE_URL is set

**Health Check Response**:
```json
{
  "status": "unhealthy",
  "error": "Environment variable not found: DATABASE_URL",
  "databaseUrl": "missing"
}
```

---

## **✅ QUICK FIX (5 Minutes) - Azure Portal**

### Step 1: Open Azure Portal
1. Go to: https://portal.azure.com
2. Search for: **lp-dev-web-kopp3c4slv3eg**
3. Click on the Container App

### Step 2: Update DATABASE_URL Secret
1. In left menu, click: **Settings** → **Secrets**
2. Find secret: **database-url**
3. Click **Edit** (pencil icon)
4. Replace value with:
   ```
   postgresql://lpadmin:teSOKbTquefaAhLxhpONdYrg@lp-dev-pg-kopp3c4slv3eg.postgres.database.azure.com:5432/levelplay?sslmode=require
   ```
5. Click **Add**
6. Click **Save** at the top

### Step 3: Restart Container
1. In left menu, click: **Revisions and replicas**
2. Click **Restart** at the top
3. Wait 1-2 minutes for container to restart

### Step 4: Verify Health
Wait 2 minutes, then open:
```
https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io/api/health
```

**Expected**:
```json
{
  "status": "healthy",
  "database": "connected",
  "seed": {
    "roles": 8,
    "users": 8
  }
}
```

---

## **🧪 TEST ALL LOGINS**

After health check passes, run:
```powershell
.\scripts\verify-all-logins.ps1
```

Or test manually:
1. Go to: https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io/login
2. Try each account:

| Email | Password | Role |
|-------|----------|------|
| client@demo.test | Passw0rd! | Client |
| admin@demo.test | Passw0rd! | Admin |
| projectadmin@demo.test | Passw0rd! | Project Admin |
| engineer@demo.test | Passw0rd! | Engineer |
| architect@demo.test | Passw0rd! | Architect |
| worker@demo.test | Passw0rd! | Worker |

---

## **📸 SCREENSHOTS FOR VERIFICATION**

Take these screenshots to prove it works:

1. **Health Check**:
   - URL: https://.../api/health
   - Should show: `"status":"healthy"` with 8 users

2. **Login Success**:
   - Login with client@demo.test / Passw0rd!
   - Should redirect to /portal dashboard

3. **Admin Login**:
   - Login with admin@demo.test / Passw0rd!
   - Should show admin dashboard

---

## **🚨 IF HEALTH CHECK STILL FAILS**

### Check Container Logs:
1. In Azure Portal, Container App page
2. Left menu: **Monitoring** → **Log stream**
3. Look for:
   - `✅ Migration successful`
   - `✅ Database seeded successfully`
   - `❌ Can't reach database` (means DATABASE_URL wrong)

### Common Issues:

**Issue**: `Can't reach database server`
**Fix**: Check DATABASE_URL has correct format with `?sslmode=require`

**Issue**: `Table does not exist`
**Fix**: Migrations didn't run. Restart container again.

**Issue**: `Database is not seeded`
**Fix**: Run seed manually via Azure Portal Console:
   1. Container App → **Console**
   2. Run: `node prisma/seed.js`

---

## **✅ VERIFICATION CHECKLIST**

Before presentation, verify:
- [ ] Health check returns `{"status":"healthy","seed":{"users":8}}`
- [ ] Client login works (client@demo.test)
- [ ] Admin login works (admin@demo.test)
- [ ] Navigation from login page works (Home/Team/Contact links)
- [ ] Portal shows correct role-based dashboard

---

## **🎯 WHY THIS HAPPENED**

The infrastructure (Bicep) correctly defines the DATABASE_URL secret, but it needs to be **set once** during initial deployment. The azd CLI couldn't complete the deployment because:
1. Docker is not installed on this machine
2. Azure CLI has permission errors with containerapp extension

**Solution**: Manually set the secret in Azure Portal once, then future deploys will preserve it.

---

## **📞 READY TO PRESENT?**

After fixing DATABASE_URL and confirming health check passes:

1. ✅ Open health endpoint - show JSON with status:healthy
2. ✅ Login with client@demo.test - show portal dashboard
3. ✅ Login with admin@demo.test - show admin features
4. ✅ Navigate between pages - show all navigation working

**You're good to go!** 🚀

---

## **DATABASE CONNECTION STRING**

For reference (already in instructions above):
```
postgresql://lpadmin:teSOKbTquefaAhLxhpONdYrg@lp-dev-pg-kopp3c4slv3eg.postgres.database.azure.com:5432/levelplay?sslmode=require
```

**Components**:
- Username: `lpadmin`
- Password: `teSOKbTquefaAhLxhpONdYrg`
- Host: `lp-dev-pg-kopp3c4slv3eg.postgres.database.azure.com`
- Port: `5432`
- Database: `levelplay`
- SSL Mode: `require` (Azure requires SSL)
