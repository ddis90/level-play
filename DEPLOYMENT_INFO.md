# Levelplay Construction Portal - Azure Deployment

## 🚀 Deployment Status: IN PROGRESS

**Subscription**: Plan and Quantify Playground  
**Resource Group**: rg-levelplay-dev  
**Environment**: dev (Development/Demo)  
**Location**: East US  
**Deployment Date**: 2026-06-17

---

## 📊 Azure Resources Being Created

### 1. **Container App** (Web Application)
- **Type**: Azure Container Apps
- **Name**: lp-dev-web-{uniqueId}
- **CPU**: 0.5 cores (dev tier - cost optimized)
- **Memory**: 1.0 GB
- **Scaling**: 0-2 replicas (scales to zero when idle)
- **Port**: 3000 (Next.js application)
- **Auto-scaling**: Enabled

### 2. **PostgreSQL Database**
- **Type**: Azure Database for PostgreSQL Flexible Server
- **Name**: lp-dev-pg-{uniqueId}
- **Version**: PostgreSQL 16
- **SKU**: Standard_B1ms (Burstable - cost optimized)
- **Storage**: 32 GB
- **Backup**: 7 days retention
- **Database**: levelplay
- **Admin User**: lpadmin
- **High Availability**: Disabled (dev mode)

### 3. **Storage Account**
- **Type**: Azure Blob Storage
- **Name**: lpdev{uniqueId}
- **SKU**: Standard_LRS (Locally Redundant Storage)
- **Container**: media (for document uploads)
- **Access**: Private (no public access)

### 4. **Log Analytics Workspace**
- **Type**: Operational Insights
- **Name**: lp-dev-logs-{uniqueId}
- **Retention**: 30 days
- **Purpose**: Application logs and monitoring

### 5. **Key Vault**
- **Type**: Azure Key Vault
- **Name**: lp-dev-kv-{uniqueId}
- **Purpose**: Secure secrets storage
- **Features**: Soft delete enabled, RBAC enabled

### 6. **Container Apps Environment**
- **Type**: Managed Environment
- **Name**: lp-dev-env-{uniqueId}
- **Purpose**: Hosting platform for container apps
- **Logging**: Integrated with Log Analytics

---

## 🔐 Credentials & Secrets

### Application Credentials (Seeded in Database)

All demo accounts use password: **`Passw0rd!`**

| Role | Email | Purpose |
|------|-------|---------|
| Client | client@demo.test | Limited visibility - client-facing docs only |
| Engineer | engineer@demo.test | Internal docs + technical content |
| Architect | architect@demo.test | Design docs + specifications |
| Admin | admin@demo.test | Full system access |
| Project Admin | projectadmin@demo.test | Project-level administration |
| Owner | owner@demo.test | Project owner perspective |
| In-Charge | incharge@demo.test | On-site supervisor |
| Worker | worker@demo.test | Field worker access |

### Database Credentials
- **Admin User**: lpadmin
- **Admin Password**: (Stored securely in Azure Key Vault)
- **Connection**: Automatic via DATABASE_URL secret

### Session Secret
- Securely generated 32-character key
- Stored in Container App secrets
- Used for session signing and encryption

---

## 🌐 Access Information

### Application URL
**Will be available at**: `https://lp-dev-web-{uniqueId}.{region}.azurecontainerapps.io`

> **Note**: Exact URL will be provided once deployment completes (typically 10-15 minutes)

### Database Access
- **Host**: `lp-dev-pg-{uniqueId}.postgres.database.azure.com`
- **Port**: 5432
- **Database**: levelplay
- **SSL**: Required (sslmode=require)
- **Firewall**: Azure services allowed (0.0.0.0/0 for Azure IPs)

### Monitoring & Logs
- **Application Logs**: Log Analytics Workspace
- **Access**: Azure Portal → Resource Group → Log Analytics
- **Query**: Use Kusto Query Language (KQL) for log analysis

---

## 💰 Cost Optimization (Dev Environment)

**Estimated Monthly Cost**: ~$30-50 USD

| Resource | SKU | Monthly Cost (Estimate) |
|----------|-----|-------------------------|
| Container App | 0.5 vCPU, 1GB | $10-15 (scales to zero) |
| PostgreSQL | B1ms Burstable | $15-20 |
| Storage | LRS, 32GB | $2-3 |
| Log Analytics | 30-day retention | $5-8 |
| Key Vault | Standard | $0.03-1 |

**Cost-Saving Features**:
- ✅ Container App scales to zero when idle (no traffic = minimal cost)
- ✅ Burstable PostgreSQL tier (cheaper than general purpose)
- ✅ Locally redundant storage (vs geo-redundant)
- ✅ No high availability (production will have HA)
- ✅ Minimal compute resources (0.5 vCPU vs 1+ in prod)

---

## 🏗️ Demo Project Pre-Seeded

**Project**: Indiranagar Villa Construction  
**Project Code**: LP-2026-001  
**Location**: Indiranagar, Bangalore, Karnataka  

**Included Demo Data**:
- ✅ 8 user accounts (all roles)
- ✅ 1 complete project with members
- ✅ Sample documents with visibility levels:
  - Client-visible: Contracts, Invoices, Progress Reports
  - Internal: Technical drawings, Internal memos
  - Admin-only: Financial records, Confidential docs
- ✅ Sample payments and milestones
- ✅ Role-based access control (RBAC) configured

---

## 🧪 Testing the Deployment

### Step 1: Access the Application
```bash
# URL will be provided after deployment completes
# Open in browser: https://lp-dev-web-{uniqueId}.{region}.azurecontainerapps.io
```

### Step 2: Login with Demo Account
```
Email: admin@demo.test
Password: Passw0rd!
```

### Step 3: Verify Features
- [ ] Login successful
- [ ] Dashboard loads
- [ ] Projects list displays
- [ ] Documents are visible
- [ ] Role-based access working (try different users)
- [ ] Document upload/download works
- [ ] Navigation between pages smooth

### Step 4: Test Different Roles
```bash
# Login as Client
client@demo.test / Passw0rd!
# Verify: Only sees client-visible documents

# Login as Engineer  
engineer@demo.test / Passw0rd!
# Verify: Sees internal + client documents

# Login as Admin
admin@demo.test / Passw0rd!
# Verify: Sees all documents including admin-only
```

---

## 📱 Sharing with Construction Company Clients

### For Demo Presentations

**Share this information**:

```
🏗️ Levelplay Construction Management Portal - Demo Environment

🌐 Access URL: https://lp-dev-web-{uniqueId}.{region}.azurecontainerapps.io

👤 Demo Credentials:

Client View (Limited Access):
  Email: client@demo.test
  Password: Passw0rd!

Engineer View (Technical Access):
  Email: engineer@demo.test
  Password: Passw0rd!

Admin View (Full Access):
  Email: admin@demo.test
  Password: Passw0rd!

📂 Demo Project: "Indiranagar Villa Construction"
  - View project documents
  - Track payments and milestones
  - Manage project members
  - Role-based document visibility

⏱️ Session Duration: Unlimited
🔄 Data Reset: Never (demo data persists)
💰 This is a SHARED demo environment
```

### For Self-Service Testing

Provide clients with:
1. The application URL
2. Multiple role credentials (client, engineer, admin)
3. Link to this documentation
4. Support contact (your email)

**Recommended Testing Flow for Clients**:
```
1. Login as CLIENT → See limited documents
2. Logout → Login as ENGINEER → See more documents
3. Logout → Login as ADMIN → See all documents
4. Understand the role-based access control
5. Try uploading a document (if they want)
6. Provide feedback
```

---

## 🔒 Security Considerations

**This is a DEMO environment** - Not for production use.

### Current Security Posture:
- ✅ HTTPS enabled (automatic Azure Container Apps)
- ✅ Database SSL required
- ✅ Secrets stored in Azure Key Vault
- ✅ No public database access (Azure services only)
- ✅ Private blob storage
- ✅ Session-based authentication
- ✅ Password hashing (bcrypt)

### Not Included (Dev/Demo Only):
- ❌ No custom domain
- ❌ No WAF (Web Application Firewall)
- ❌ No DDoS protection (basic included)
- ❌ No backup/restore procedures
- ❌ No monitoring alerts
- ❌ No rate limiting
- ❌ Demo passwords are weak (change for production!)

---

## 📊 Monitoring & Observability

### Azure Portal
1. Navigate to: [Azure Portal](https://portal.azure.com)
2. Resource Group: `rg-levelplay-dev`
3. View all resources and their status

### Application Logs
```bash
# View recent logs via Azure CLI
az containerapp logs show \
  --name lp-dev-web-{uniqueId} \
  --resource-group rg-levelplay-dev \
  --follow

# View logs in Azure Portal
# Portal → Container App → Logs (under Monitoring)
```

### Database Monitoring
```bash
# Check database status
az postgres flexible-server show \
  --resource-group rg-levelplay-dev \
  --name lp-dev-pg-{uniqueId}

# View database metrics
# Portal → PostgreSQL → Metrics
```

---

## 🚀 Next Steps After Deployment

### 1. Verify Deployment ✅
- [ ] Application URL is accessible
- [ ] All 8 demo users can login
- [ ] Documents are visible
- [ ] Database connection working
- [ ] Logs are flowing to Log Analytics

### 2. Share with Clients 📤
- [ ] Copy the application URL
- [ ] Prepare demo credentials document
- [ ] Send email to potential clients
- [ ] Schedule demo calls if needed

### 3. Gather Feedback 💬
- [ ] Set up feedback form/email
- [ ] Track usage metrics
- [ ] Note feature requests
- [ ] Document pain points

### 4. Production Planning 🏭
Based on client feedback:
- [ ] Plan production architecture
- [ ] Define SLA requirements
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy
- [ ] Implement CI/CD pipeline
- [ ] Add custom domain
- [ ] Enable WAF and DDoS protection

---

## 🛠️ Troubleshooting

### Application Not Loading
```bash
# Check container app status
az containerapp show \
  --name lp-dev-web-{uniqueId} \
  --resource-group rg-levelplay-dev \
  --query properties.runningStatus

# Check recent logs
az containerapp logs show \
  --name lp-dev-web-{uniqueId} \
  --resource-group rg-levelplay-dev \
  --tail 50
```

### Database Connection Issues
```bash
# Test database connectivity
az postgres flexible-server connect \
  --name lp-dev-pg-{uniqueId} \
  --admin-user lpadmin \
  --database-name levelplay

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group rg-levelplay-dev \
  --name lp-dev-pg-{uniqueId}
```

### Login Not Working
- Verify demo data was seeded (check logs for "Seeding database")
- Check DATABASE_URL secret is configured
- Verify SESSION_SECRET is set
- Try password reset (if implemented)

---

## 📞 Support

**Deployment Issues**: Check Azure Portal → Resource Group → Deployments  
**Application Issues**: Check Container App logs  
**Database Issues**: Check PostgreSQL metrics and logs  

**Quick Commands**:
```bash
# Check all resources
az resource list --resource-group rg-levelplay-dev --output table

# Delete everything (cleanup)
az group delete --name rg-levelplay-dev --yes --no-wait
```

---

## 📝 Deployment Timeline

| Step | Status | Duration |
|------|--------|----------|
| Resource Group Creation | ✅ Complete | 10 seconds |
| Infrastructure Provisioning | 🔄 In Progress | 10-15 minutes |
| Container App Deployment | ⏳ Pending | 5-10 minutes |
| Database Migration | ⏳ Pending | 2-3 minutes |
| Demo Data Seeding | ⏳ Pending | 1 minute |
| **Total** | 🔄 | **~20-30 minutes** |

---

**Status**: Deployment initiated at 2026-06-17 09:51 UTC  
**Expected Completion**: 2026-06-17 10:15-10:20 UTC  

**Next Update**: URL and credentials will be provided once deployment completes.
