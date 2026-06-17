## On-Site Execution & Materials: Process Gaps and Product Requirements

The current model captures *what a client sees* (documents, payments, deliveries) but has almost no model of *how a site actually runs*. `DeliveryItem` and `ItemRequest` are flat, loosely-typed stubs: `ItemRequest.requestedBy` is a free string, there is no link from a request to an order to a receipt, no vendor, no rate, no inward quantity, no stock-on-hand, no labour, no progress, no quality/safety. Below are the concrete gaps for an Indian residential/commercial builder, each with the data-model and UI/API change to close it.

---

### MUST-HAVE (a POC will not be credible to a construction company without these)

#### 1. Material Indent → PO → GRN chain (replace the flat `ItemRequest`/`DeliveryItem`)
- **Why it matters (India):** Every site runs on the *indent* (site engineer raises a material requirement) → *purchase order* (office issues PO to a supplier at a negotiated rate) → *GRN/goods-receipt* (storekeeper verifies quantity delivered vs ordered, records short/damaged) loop. Cement, steel (TMT), sand (M-sand), aggregate (jelly), bricks/blocks arrive by the truckload and shortfalls/quality rejections at the gate are routine. The current single `DeliveryItem` collapses six distinct documents into one row, so there is no audit trail and no way to know "ordered 200 bags, received 195, 3 damaged."
- **Data model:**
  - New `MaterialItem` catalogue (name, category enum: CEMENT/STEEL/SAND/AGGREGATE/BRICK_BLOCK/RMC/TILES/SANITARY/ELECTRICAL/PAINT/HARDWARE/OTHER, `unit` enum: BAG/MT/CUM/SQFT/NOS/RFT/LTR, `hsnCode`, default rate).
  - New `Indent` (project, raisedById→User, status: DRAFT/SUBMITTED/APPROVED/REJECTED/PARTIALLY_ORDERED/CLOSED, neededBy, siteLocation) with `IndentLine` (materialItemId, qty, unit, remarks).
  - New `PurchaseOrder` (project, vendorId, status: DRAFT/SENT/ACKNOWLEDGED/PARTIALLY_RECEIVED/RECEIVED/CANCELLED, poNumber, taxableValue, gstAmount, totalValue, expectedDate, approvedById) with `POLine` (indentLineId?, materialItemId, qty, rate, gstRate).
  - New `GRN` (poId, project, receivedById, receivedAt, vehicleNumber, challanNumber, weighbridgeSlip?) with `GRNLine` (poLineId, orderedQty, receivedQty, acceptedQty, rejectedQty, rejectionReason).
  - Retire `ItemRequest` (→ `Indent`); keep `DeliveryItem` only as a client-facing read view or drop it.
- **UI/API:** `/portal/projects/[id]/procurement` with three tabs (Indents / POs / GRNs) and a "convert indent → PO" and "receive against PO → GRN" flow. APIs: `POST /api/projects/:id/indents`, `POST /api/indents/:id/po`, `POST /api/po/:id/grn`. Approval gate driven by role (PROJECT_INCHARGE raises, PROJECT_ADMIN/PROJECT_OWNER approves above a threshold).

#### 2. Site Inventory / Store Stock-on-hand
- **Why it matters (India):** Site theft and pilferage of cement/steel/copper is a real cost; reconciliation between "received (GRN) − consumed = closing stock" is the storekeeper's daily job. Without a stock ledger, GRNs are meaningless.
- **Data model:** New `StockLedger` entry (project, materialItemId, txnType: GRN_IN/ISSUE_OUT/RETURN/ADJUSTMENT/WASTAGE, qty signed, refType+refId, balanceAfter, by→User, at). Optional `StockBalance` materialized per (project, materialItem) for fast reads.
- **UI/API:** `/portal/projects/[id]/store` showing current stock per material with low-stock flags that can auto-suggest an indent. `POST /api/projects/:id/stock/issue` (issue to work), `GET /api/projects/:id/stock`.

#### 3. Vendor / Supplier master
- **Why it matters (India):** POs must go to a registered vendor with **GSTIN, PAN**, payment terms, and a category (cement dealer, steel, RMC plant, sand supplier, labour contractor). Reusing the same vendor across projects and tracking rate history is central to procurement.
- **Data model:** New `Vendor` (name, gstin, pan, category enum, contactName, phone, email, addressLine, city, paymentTermsDays, isActive, rating?). FK from `PurchaseOrder.vendorId`. Optional `VendorRateCard` (vendorId, materialItemId, rate, validFrom).
- **UI/API:** `/portal/vendors` CRUD (ADMIN/PROJECT_ADMIN only). Vendor picker inside the PO screen. `GET/POST /api/vendors`.

#### 4. Daily Progress Report (DPR)
- **Why it matters (India):** The DPR is *the* daily artifact on an Indian site — manpower deployed (by trade), work done, material received, weather, hindrances, photos. Owners and PMC review it daily; it is the single most expected feature by any builder evaluating software.
- **Data model:** New `DailyProgressReport` (project, reportDate, preparedById, weather, summary, hindrances, status: DRAFT/SUBMITTED/APPROVED) with `DprLabour` (trade enum: MASON/HELPER/CARPENTER/BARBENDER/ELECTRICIAN/PLUMBER/PAINTER/OPERATOR, contractorId?, count) and `DprActivity` (workItem/BOQ ref, description, qtyDone, unit). Reuse `Document` (kind `SITE_PHOTO`) linked to the DPR via a nullable `dprId` on `Document`.
- **UI/API:** `/portal/projects/[id]/dpr` — date-wise list + a mobile-friendly create form (critical for the Android roadmap). `POST /api/projects/:id/dpr`, photo upload reuses existing document upload.

#### 5. Labour / Contractor (Thekedar) attendance & payments
- **Why it matters (India):** Most labour is supplied by *thekedars* (sub-contractors) paid on **daily wages (haziri)** or **measured/piece-rate (per sqft)**. Weekly/fortnightly running-account payments with advances adjusted are standard. The current model has no concept of labour at all — yet labour is 25–35% of cost.
- **Data model:**
  - New `Contractor` (name, thekedarName, trade, phone, gstin?, pan?, aadhaarLast4?, paymentBasis: DAILY_WAGE/PIECE_RATE/LUMPSUM).
  - New `LabourAttendance` (project, contractorId, date, trade, headcount, OR per-worker rows with `workerName`, shift, overtimeHours).
  - New `ContractorBill` (project, contractorId, periodFrom, periodTo, grossAmount, advanceDeducted, retentionHeld, tdsDeducted, netPayable, status: DRAFT/CERTIFIED/PAID) — link to `Payment` for the actual outflow.
- **UI/API:** `/portal/projects/[id]/labour` (attendance grid by trade/day) and `/contractors`. `POST /api/projects/:id/attendance`, `POST /api/contractors/:id/bill`.

---

### SHOULD-HAVE (strongly differentiates the POC; expected on serious projects)

#### 6. BOQ / Work-Order tracking with % completion
- **Why it matters (India):** Projects are billed and tracked against a **BOQ** (Bill of Quantities) — item, unit, rate, contracted qty. Progress = executed qty vs BOQ qty; client billing (RA bills) and the existing `Payment` milestones should ideally derive from measured BOQ progress, not be hand-typed.
- **Data model:** New `BoqItem` (project, code, description, unit, contractQty, rate, amount, parentId? for sub-items) and `BoqProgress` (boqItemId, date, cumulativeQtyDone, source: DPR/MEASUREMENT). Link `Payment.boqItemId?` so milestones tie to measured work.
- **UI/API:** `/portal/projects/[id]/boq` with a progress bar per line and a roll-up % at project level feeding the dashboard. `GET/POST /api/projects/:id/boq`.

#### 7. Quality checklists & Snagging (defect list)
- **Why it matters (India):** Stage-wise quality checks (pre-concrete checklist before slab pour, plastering, waterproofing, tiling) and a **snag list** at handover are how quality is governed. The existing `Handover.signedOff` boolean is far too coarse — a client expects a tracked snag list closed item-by-item before sign-off.
- **Data model:** New `ChecklistTemplate` + `ChecklistInstance` (project, stage, status, filledById) with `ChecklistAnswer` (question, result: OK/NOT_OK/NA, remark, photoDocId?). New `Snag` (project, location/flat/floor, description, severity: LOW/MED/HIGH, raisedById, assignedToId?, status: OPEN/IN_PROGRESS/RESOLVED/VERIFIED_CLOSED, photoBefore/photoAfter doc refs, dueDate).
- **UI/API:** `/portal/projects/[id]/quality` (checklists) and `/snags` (kanban or list). Snags can be `CLIENT_VISIBLE` to build trust. `POST /api/projects/:id/snags`, `PATCH /api/snags/:id`.

#### 8. Stage inspection sign-offs (hold points)
- **Why it matters (India):** Concrete pours, waterproofing and structural stages are **hold points** requiring engineer/architect sign-off before proceeding — often a statutory/contractual requirement and the basis for releasing a payment milestone.
- **Data model:** New `StageInspection` (project, stage enum: EXCAVATION/FOUNDATION/PLINTH/SLAB_L1.../BRICKWORK/PLASTERING/WATERPROOFING/FINISHING, requestedById, inspectedById, status: REQUESTED/PASSED/FAILED/CONDITIONAL, inspectedAt, remarks, photoDocId?). Optional FK to gate the next `Payment` milestone.
- **UI/API:** `/portal/projects/[id]/inspections` with request → inspect → approve flow restricted to ENGINEER/ARCHITECT/PROJECT_INCHARGE. `POST /api/projects/:id/inspections`.

#### 9. Wastage / Material reconciliation
- **Why it matters (India):** Theoretical consumption (from BOQ × coefficients) vs actual issued (from stock ledger) reveals wastage/leakage — a KPI owners care about deeply (e.g. steel wastage %, cement bags per cum of concrete).
- **Data model:** Mostly derivable: add `WastageEntry` (project, materialItemId, qty, reason: BREAKAGE/THEFT/EXCESS_USE/SPILLAGE, date, by) feeding `StockLedger` as `WASTAGE`. A reconciliation view computes theoretical vs actual.
- **UI/API:** A "Material reconciliation" report under `/store`. `POST /api/projects/:id/wastage`.

---

### COULD-HAVE (nice polish; defer past POC if time-boxed)

#### 10. Safety / EHS incident & toolbox-talk log
- **Why it matters (India):** Larger/commercial clients and PMCs increasingly demand EHS records — toolbox talks, PPE compliance, near-miss/incident logging.
- **Data model:** New `SafetyLog` (project, date, type: TOOLBOX_TALK/INSPECTION/INCIDENT/NEAR_MISS, description, severity?, actionTaken, photoDocId?, by).
- **UI/API:** `/portal/projects/[id]/safety` list + create. `POST /api/projects/:id/safety`.

#### 11. Machinery / Plant & equipment log (P&M)
- **Why it matters (India):** Hired equipment (JCB, concrete mixer, hoist, vibrator) is billed on hours/days with fuel and breakdown tracking — relevant for commercial sites.
- **Data model:** New `Equipment` (name, ownership: OWNED/HIRED, vendorId?, ratePerDay) + `EquipmentLog` (project, equipmentId, date, runningHours, fuelLtr, downtimeReason?).
- **UI/API:** `/portal/projects/[id]/equipment`. `POST /api/projects/:id/equipment-log`.

#### 12. GST-ready cost roll-up & cost-to-complete dashboard
- **Why it matters (India):** Tie PO values, contractor bills and equipment costs into a per-project committed-vs-budget view against `Project.budget`, with GST captured on POs/bills for accounting hand-off.
- **Data model:** No new core entity — aggregate `POLine.gstAmount`, `ContractorBill`, `EquipmentLog`. Add `Project.committedCost` (derived/cached) for the dashboard tile.
- **UI/API:** New dashboard card "Budget vs Committed vs Spent" on the existing role dashboards. `GET /api/projects/:id/cost-summary`.

---

### Cross-cutting notes
- **Loose typing to fix now:** `ItemRequest.requestedBy String` and `Payment.reference String?` should become real FKs/structured fields as the entities above land; the audit trail a builder expects depends on it.
- **Visibility reuse:** The existing `Visibility` enum (`CLIENT_VISIBLE/INTERNAL/ADMIN_ONLY`) should be applied to DPR, snags and inspections so clients see *curated* progress while rates/POs/contractor bills stay `INTERNAL`/`ADMIN_ONLY`. This is the platform's key trust differentiator — extend it rather than reinvent.
- **Mobile-first for the Android roadmap:** DPR, attendance, GRN and snag capture are the on-site mobile screens; design their APIs to accept offline-batched, photo-heavy payloads (reuse the Blob-backed `Document` model with a nullable parent ref: `dprId`, `snagId`, `inspectionId`, `grnId`).