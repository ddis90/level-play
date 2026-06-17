# Levelplay Platform - Complete Testing & Workflow Documentation

## Design Implementation Summary

### Dark Theme Aesthetic
- **Typography**: Syne (display) + IBM Plex Sans (body)
- **Color Palette**: Deep slate backgrounds (#0a0f1a, #0f1624) with amber-500/orange-500 gradients
- **Effects**: Animated gradient orbs, subtle grid patterns, smooth transitions
- **Components**: Cinematic hero sections, professional team portraits, futuristic cards

### Professional Team Images
All team members now have realistic professional portraits from Unsplash:
- High-quality headshots with proper crop (400x400, face-focused)
- Consistent professional appearance across all roles
- Hover effects: scale-110 transform on images
- Status indicator: green pulse dot (active status)

---

## Database Seeding Status

### Current Seed Configuration
**Location**: `prisma/seed.js`  
**Password**: `Passw0rd!` (shared across all demo accounts)

### 8 Seeded Roles & Accounts

| Role | Email | Full Name | Purpose |
|------|-------|-----------|---------|
| **CLIENT** | client@demo.test | Priya Client | Project owner/customer |
| **ADMIN** | admin@demo.test | Arjun Admin | Full platform administrator |
| **PROJECT_ADMIN** | projectadmin@demo.test | Divya ProjectAdmin | Manages project end-to-end |
| **PROJECT_OWNER** | owner@demo.test | Ravi Owner | Business owner of project |
| **PROJECT_INCHARGE** | incharge@demo.test | Suresh Incharge | On-site responsible person |
| **ENGINEER** | engineer@demo.test | Meena Engineer | Civil/site engineer |
| **ARCHITECT** | architect@demo.test | Karthik Architect | Designs drawings & plans |
| **WORKER** | worker@demo.test | Lakshmi Worker | On-site worker |

### Sample Project Data
- **Project Code**: LP-2026-001
- **Name**: Sharma Residence — Duplex Villa
- **Status**: IN_PROGRESS
- **Location**: RR Nagar, Bangalore
- **Budget**: ₹85,00,000

### Documents (3 Visibility Levels)
1. **CLIENT_VISIBLE** (2 docs):
   - Approved Floor Plan — Ground Floor
   - Site Progress Photos — Week 12

2. **INTERNAL** (2 docs):
   - Electrical Layout (internal review)
   - Plumbing Drawing — draft

3. **ADMIN_ONLY** (1 doc):
   - Vendor Contract & Margins

### Payment Milestones (4 entries)
- Booking advance: ₹5,00,000 (PAID)
- Foundation complete: ₹15,00,000 (PAID)
- Roof slab complete: ₹20,00,000 (INVOICED)
- Finishing & handover: ₹45,00,000 (PLANNED)

### Delivery Items (3 entries)
- Cement (UltraTech OPC 53): 200 bags (DELIVERED)
- TMT Steel Bars: 5 tonnes (IN_TRANSIT)
- Vitrified Floor Tiles: 1200 sqft (ORDERED)

---

## Login Testing Checklist

### Test URL
```
https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io/login
```

### Test Matrix

| # | Role | Email | Expected Access | Dashboard Sections |
|---|------|-------|-----------------|-------------------|
| 1 | CLIENT | client@demo.test | Own projects, client-visible docs | Projects, Documents, Payments, Progress |
| 2 | ADMIN | admin@demo.test | **Full access** to all data | All projects, All docs, All users, Settings |
| 3 | PROJECT_ADMIN | projectadmin@demo.test | Manage assigned projects | Project dashboard, Team, Docs, Deliveries |
| 4 | PROJECT_OWNER | owner@demo.test | Project oversight | Project status, Financials, Reports |
| 5 | PROJECT_INCHARGE | incharge@demo.test | On-site operations | Site updates, Deliveries, Worker management |
| 6 | ENGINEER | engineer@demo.test | Technical oversight | Drawings, Site photos, Quality checks |
| 7 | ARCHITECT | architect@demo.test | Design & drawings | Upload drawings, Review approvals |
| 8 | WORKER | worker@demo.test | Limited site access | Tasks, Attendance, Site updates |

### Test Procedure (Per Role)

1. **Navigate** to `/login`
2. **Enter credentials**:
   - Email: `<role>@demo.test`
   - Password: `Passw0rd!`
3. **Click** "Sign in"
4. **Verify**:
   - ✅ Login successful
   - ✅ Redirected to correct dashboard
   - ✅ Role-appropriate navigation visible
   - ✅ Can access permitted documents
   - ✅ Cannot access restricted documents

### Document Visibility Matrix

| Role | CLIENT_VISIBLE | INTERNAL | ADMIN_ONLY |
|------|---------------|----------|------------|
| CLIENT | ✅ Yes | ❌ No | ❌ No |
| ADMIN | ✅ Yes | ✅ Yes | ✅ Yes |
| PROJECT_ADMIN | ✅ Yes | ✅ Yes | ❌ No |
| PROJECT_OWNER | ✅ Yes | ✅ Yes | ❌ No |
| PROJECT_INCHARGE | ✅ Yes | ✅ Yes | ❌ No |
| ENGINEER | ✅ Yes | ✅ Yes | ❌ No |
| ARCHITECT | ✅ Yes | ✅ Yes | ❌ No |
| WORKER | ✅ Yes | ❌ No | ❌ No |

---

## Business Process Workflows

### 1. Client Onboarding Flow

```
[Contact Form] → [Lead Created] → [Team Review] → [Consultation Call]
       ↓
[Proposal Sent] → [Client Approval] → [Contract Signed]
       ↓
[Project Created] → [Portal Access Granted] → [Welcome Email]
       ↓
[Initial Meeting] → [Design Phase Start]
```

**Actors**: Client, Admin, Project Admin  
**Duration**: 3-7 days  
**Touchpoints**: Contact page, Email, Portal invite

### 2. Project Lifecycle Workflow

```
PLANNING PHASE (2-4 weeks)
├── Architect: Create initial drawings
├── Client: Review & approve design
├── Engineer: Feasibility assessment
└── Project Admin: Budget & timeline finalization

EXECUTION PHASE (3-12 months)
├── Project Incharge: Daily site management
├── Worker: On-site construction work
├── Engineer: Quality checks & inspections
├── Architect: Design revisions as needed
└── Project Admin: Progress tracking & updates

COMPLETION PHASE (2-4 weeks)
├── Engineer: Final inspections
├── Client: Walk-through & punch list
├── Project Admin: Handover documentation
└── Admin: Project closure & feedback
```

### 3. Payment Milestone Workflow

```
[Milestone Defined] → [Work Completed] → [Engineer Verification]
         ↓
[Client Notification] → [Invoice Generated] → [Payment Portal]
         ↓
[Client Payment] → [Receipt Confirmed] → [Next Phase Triggered]
```

**Transparency Features**:
- Client sees all milestones in portal
- Photo proof uploaded before invoice
- Real-time payment status updates
- Audit trail maintained

### 4. Document Management Workflow

```
UPLOAD
└── Architect/Engineer uploads drawing
    └── Tagged with visibility level
        ├── CLIENT_VISIBLE: Auto-notify client
        ├── INTERNAL: Team access only
        └── ADMIN_ONLY: Financial/contracts

REVIEW
└── Project Admin reviews document
    └── Approves or requests changes
        └── Client gets notification if approved

ACCESS
└── User logs into portal
    └── RBAC filter applied
        └── Only permitted docs shown
```

### 5. Site Progress Tracking

```
DAILY UPDATES
├── Project Incharge: Upload site photos
├── Engineer: Log quality checks
└── Worker: Mark tasks complete

WEEKLY REPORTS
├── Project Admin: Generate progress report
├── Client: Receives email summary
└── Portal: Updated with latest photos

MILESTONE NOTIFICATIONS
└── Automated alerts when major phases complete
```

### 6. Material Delivery Workflow

```
[Delivery Scheduled] → [Vendor Confirmation] → [In Transit Status]
         ↓
[Site Arrival] → [Worker Verification] → [Quantity Check]
         ↓
[Photo Documentation] → [Status: Delivered] → [Client Notified]
```

---

## Testing Scenarios

### Scenario 1: CLIENT Login & Dashboard
**Steps**:
1. Login as `client@demo.test`
2. Verify homepage shows "Projects" section
3. Click on "LP-2026-001" project
4. Verify can see:
   - Approved floor plan
   - Site progress photos
   - Payment milestones (with status)
   - Material deliveries
5. Verify CANNOT see:
   - Electrical layout (INTERNAL)
   - Vendor contract (ADMIN_ONLY)

**Expected Result**: Client sees only client-visible data

### Scenario 2: ADMIN Full Access
**Steps**:
1. Login as `admin@demo.test`
2. Navigate to "All Projects"
3. Access "LP-2026-001"
4. Verify can see ALL documents (5 total)
5. Navigate to "Users" section
6. Verify can see all 8 user accounts
7. Attempt to edit project settings

**Expected Result**: Admin has unrestricted access

### Scenario 3: ARCHITECT Upload & Visibility
**Steps**:
1. Login as `architect@demo.test`
2. Navigate to project documents
3. Upload new drawing
4. Tag as "CLIENT_VISIBLE"
5. Verify client receives notification
6. Login as `client@demo.test`
7. Verify new drawing is visible

**Expected Result**: Document visibility rules enforced

### Scenario 4: WORKER Limited Access
**Steps**:
1. Login as `worker@demo.test`
2. Verify dashboard shows:
   - Assigned tasks
   - Attendance log
   - Basic site info
3. Attempt to access project financials
4. Verify access denied
5. Attempt to see internal drawings
6. Verify cannot access

**Expected Result**: Worker sees only task-related data

### Scenario 5: ENGINEER Quality Check Flow
**Steps**:
1. Login as `engineer@demo.test`
2. Navigate to project
3. Upload site inspection report
4. Tag as "INTERNAL"
5. Add quality check notes
6. Mark milestone as "verified"
7. Verify client does NOT see inspection report
8. Verify Project Admin DOES see report

**Expected Result**: Internal documents restricted correctly

### Scenario 6: Payment Transparency
**Steps**:
1. Login as `client@demo.test`
2. Navigate to "Payments" tab
3. Verify sees all 4 milestones:
   - ✅ Booking advance (PAID) - ₹5L
   - ✅ Foundation complete (PAID) - ₹15L
   - 📄 Roof slab complete (INVOICED) - ₹20L
   - 📅 Finishing (PLANNED) - ₹45L
4. Click on invoiced milestone
5. Verify sees:
   - Photos of completed work
   - Invoice PDF
   - Payment button/instructions
6. Verify total transparency

**Expected Result**: Complete payment visibility with proof

---

## Seeding Verification Commands

### Check if seed ran successfully

```bash
# SSH into container (if using Azure Cloud Shell)
az containerapp exec \
  --name lp-dev-web-kopp3c4slv3eg \
  --resource-group Levelplay-dev \
  --command "/bin/sh"

# Inside container:
# Check if tables populated
npx prisma studio --browser none

# Or query directly
npx prisma db seed
```

### Manual seed trigger (if needed)

```bash
# In web directory
node prisma/seed.js
```

### Check logs for seed execution

```bash
# Local
npm run dev

# Check startup.sh output
# Should see:
# "🌱 Seeding database with demo data..."
# "✅ Seed complete."
# "✅ Demo login password: Passw0rd!"
```

---

## Known Issues & Workarounds

### Issue 1: Seed Not Running in Production
**Symptom**: Login returns 500, no users found  
**Root Cause**: seed.js not executing during container startup  
**Workaround**: Manual seed via Azure Cloud Shell or middleware auto-seed

### Issue 2: Images Loading Slowly
**Symptom**: Team page images take time to load  
**Root Cause**: Unsplash CDN latency  
**Solution**: Images are cached after first load; consider local CDN in production

### Issue 3: Font Flash on Load
**Symptom**: Brief moment where fonts aren't loaded  
**Solution**: Fonts are preloaded via Google Fonts with `display=swap`

---

## Production Deployment Checklist

- [x] Dark theme implemented across all pages
- [x] Professional team images integrated
- [x] Seed script created with 8 roles
- [x] Sample project data populated
- [x] Payment milestones defined
- [x] Document visibility levels configured
- [ ] Login tested for all 8 roles
- [ ] Document RBAC verified
- [ ] Payment flow validated
- [ ] Material delivery workflow tested
- [ ] Mobile responsiveness checked

---

## Next Steps

1. **Verify Deployment Complete** (waiting for GitHub Actions)
2. **Test All 8 Role Logins** (automated via browser skill)
3. **Validate RBAC** (document visibility per role)
4. **End-to-End Workflow Test** (client onboarding → project completion)
5. **Performance Audit** (Lighthouse scores, load times)
6. **Mobile Testing** (iOS Safari, Android Chrome)

---

## Success Criteria

✅ **Design**: Dark theme with professional aesthetics  
✅ **Content**: Realistic team portraits integrated  
⏳ **Functionality**: Login works for all 8 roles  
⏳ **RBAC**: Document visibility enforced correctly  
⏳ **Workflows**: All business processes functional  
⏳ **Performance**: < 2s page load, 90+ Lighthouse score

---

**Deployment URL**: https://lp-dev-web-kopp3c4slv3eg.delightfulpebble-1cfc730a.eastus.azurecontainerapps.io

**Test Credentials**: All roles use password `Passw0rd!`
