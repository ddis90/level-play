# Consolidated Requirements & Backlog — Levelplay Constructions Platform

**Scope:** POC-grade enhancements to the existing Next.js 14 + Prisma + PostgreSQL portal so it credibly models Indian residential/commercial construction finance, statutory compliance, and on-site execution (Bangalore/Karnataka). Inputs consolidated from the **finance-compliance** and **site-supplychain** expert streams (the site-supplychain stream was truncated after the Indent→PO→GRN item; downstream supply-chain items below are reconstructed to a credible India build and flagged where inferred).

---

## 1. De-duplicated, Prioritized Improvement List

| # | Improvement | Priority | Stream |
|---|-------------|----------|--------|
| F1 | GST-compliant tax invoices (CGST/SGST, SAC, serial) | **MUST** | Finance |
| F2 | Indian stage/milestone payment-schedule templates (with evidence gating) | **MUST** | Finance |
| F3 | Payment receipts (part-payments, numbered money receipts) | **MUST** | Finance |
| F4 | RERA registration & statutory buyer disclosures | **MUST** | Finance |
| S1 | Material Indent → PO → GRN chain (replace flat ItemRequest/DeliveryItem) | **MUST** | Site |
| S2 | Material catalogue + site inventory / stock-on-hand | **MUST** | Site |
| S3 | Daily Progress Report (DPR) + stage verification → links to payment evidence (F2) | **MUST** | Site |
| F5 | TDS handling (194C / 194-IA / GST TDS) | **SHOULD** | Finance |
| F6 | Retention / withholding & defect-liability release | **SHOULD** | Finance |
| F7 | Price escalation / change orders (Variations) | **SHOULD** | Finance |
| F8 | Statutory approvals register (Khata/plan sanction/OC/CC) | **SHOULD** | Finance |
| S4 | Vendor/supplier master & PO acknowledgement | **SHOULD** | Site |
| S5 | Labour muster / contractor attendance & subcontractor work orders | **SHOULD** | Site |
| S6 | Quality checklists & safety/incident register | **SHOULD** | Site |
| X1 | Notifications (demand raised, receipt issued, approval expiry, indent approval) | **SHOULD** | Cross-cutting |
| F9 | Tax-rate / SAC-HSN config master + OrgProfile | COULD | Finance |
| F10 | Client-facing financial transparency dashboard | COULD | Finance |
| S7 | Material reconciliation / wastage & consumption-vs-BOQ | COULD | Site |

> **De-dup notes:** F1's `Document(kind=INVOICE)` PDF output and F3's receipt PDF reuse the existing `Document` model — no parallel file store. F2's `linkedDocumentId` evidence gate is satisfied by S3's DPR `SITE_PHOTO`/`PROGRESS_VIDEO` outputs — implement S3 before/with F2 so the "prove the slab is poured" link is real, not a stub. F6 retention reuses `Handover` to start the DLP clock. S1 fully **replaces** `ItemRequest` and `DeliveryItem`; keep a thin compatibility read for the existing "material delivery list" UI until migrated.

---

## 2. MUST & SHOULD — Requirements, Acceptance Criteria, Data Model, API+UI

### F1 — GST-Compliant Tax Invoices (MUST)
**Requirement:** Generate a legally-formatted GST tax invoice for any billing event, with sequential per-FY numbering, supplier/client GSTIN, SAC code, taxable value and CGST+SGST split (intra-Karnataka → always CGST+SGST, never IGST), rendered to PDF and surfaced to the client.

**Acceptance criteria:**
- Invoice numbers are unique and strictly sequential within a financial year (Apr–Mar), with configurable series prefix.
- Tax split computed from `gstTreatment`; intra-state supply yields CGST+SGST (each half the rate), inter-state yields IGST — and the POC defaults to Karnataka intra-state.
- Generated PDF is stored as a `Document(kind=INVOICE, visibility=CLIENT_VISIBLE)` and downloadable from the client portal.
- B2B/commercial invoices require client GSTIN; under-construction residential applies the correct reduced rate without ITC.

**Prisma change:**
- New `Invoice` { id, paymentId→Payment, invoiceNumber @unique, invoiceDate, financialYear, placeOfSupply, sacCode, taxableValue Decimal, cgstRate/cgstAmount, sgstRate/sgstAmount, igstRate/igstAmount, totalAmount Decimal, supplierGstin, clientGstin?, reverseCharge Boolean, pdfDocumentId?→Document }
- `Project` += `gstin?`, `pan?`, `billingAddress?`, `stateCode?`, `gstTreatment` enum.
- New enum `GstTreatment { UNDER_CONSTRUCTION_5PCT, AFFORDABLE_1PCT, WORKS_CONTRACT_18PCT, COMMERCIAL_18PCT }`.

**API + UI:** `POST /api/payments/:id/invoice` → compute split, allocate next serial, render PDF, persist `Document` + `Invoice`. "Generate Tax Invoice" action on payment detail (ADMIN/PROJECT_ADMIN); client portal "Tax Invoices" list with download.

---

### F2 — Indian Stage/Milestone Payment-Schedule Templates (MUST)
**Requirement:** Replace free-text milestones with an ordered, %-of-contract stage ladder applied from a reusable Karnataka residential template at onboarding, with each demand gated on verified site evidence.

**Acceptance criteria:**
- Selecting a template at project creation auto-generates ordered milestones with `sequence`, `stage`, `percentOfContract`, and computed `amount = percentOfContract × contractValue`.
- Sum of `percentOfContract` across the schedule = 100% (validated).
- A milestone demand cannot be raised/invoiced until its `linkedDocumentId` evidence (DPR photo/video, see S3) exists and the stage is verified.
- `contractValue` is modelled distinctly from the existing `budget`.

**Prisma change:**
- `Payment` += `sequence` Int, `percentOfContract` Decimal, `stage` enum, `linkedDocumentId?`→Document.
- New enum `PaymentStage { BOOKING, FOUNDATION, PLINTH, SLAB, BRICKWORK, PLASTERING, FLOORING, FINISHING, HANDOVER, RETENTION_RELEASE, CUSTOM }`.
- New `PaymentScheduleTemplate` { id, name, region } and `TemplateMilestone` { templateId, sequence, stage, percentOfContract, label }.
- `Project` += `contractValue` Decimal.

**API + UI:** `POST /api/projects/:id/apply-template`. Onboarding template picker; payment view renders the ladder (stage, %, amount, evidence thumbnail, "verified" chip) with a guard blocking demand on unverified stages.

---

### F3 — Payment Receipts / Part-Payments (MUST)
**Requirement:** Record multiple receipts against a milestone (UPI/NEFT/RTGS/cheque/cash/card) on different dates, issuing a numbered money receipt PDF and deriving payment status from cumulative receipts.

**Acceptance criteria:**
- A milestone supports N receipts; `Payment.status` derives from sum(receipts) vs amount and supports `PARTIALLY_PAID`.
- Each receipt gets a sequential `receiptNumber` and a `Document(kind=RECEIPT)` PDF to the client.
- Running balance shown per milestone and per project.

**Prisma change:**
- New `Receipt` { id, paymentId→Payment, receiptNumber @unique, amountReceived Decimal, mode enum, instrumentRef?, receivedDate, tdsDeducted? Decimal, pdfDocumentId?→Document }.
- New enum `PaymentMode { UPI, NEFT, RTGS, CHEQUE, CASH, CARD }`.
- `PaymentStatus` += `PARTIALLY_PAID`.
- `DocumentKind` += `RECEIPT`.

**API + UI:** `POST /api/payments/:id/receipts`. "Record receipt" modal; balance + receipt history on milestone; client portal receipt downloads.

---

### F4 — RERA Registration & Statutory Buyer Disclosures (MUST)
**Requirement:** Store RERA applicability, registration number and carpet-area disclosures; show the RERA badge on client/marketing pages; block progression of RERA-applicable projects to booking/`IN_PROGRESS` without registration + carpet-area disclosure.

**Acceptance criteria:**
- Projects with >8 units OR >500 sq.m can be flagged `reraApplicable`; such projects require `reraRegistrationNumber` and `carpetAreaSqft` before leaving `ONBOARDING`/entering `IN_PROGRESS`.
- RERA number renders on project detail and any public/marketing project page.
- Carpet area (not super-built-up) is the disclosed figure; sanctioned plan attachable.

**Prisma change:**
- `Project` += `reraApplicable` Boolean, `reraRegistrationNumber?`, `carpetAreaSqft?` Decimal, `superBuiltUpSqft?` Decimal, `numberOfUnits?` Int, `reraCompletionDate?`.
- `DocumentKind` += `RERA_CERTIFICATE`, `SANCTIONED_PLAN`, `SALE_AGREEMENT`, `ALLOTMENT_LETTER`.

**API + UI:** Status-transition validator in the project service; RERA badge component; disclosure section on project detail and marketing page.

---

### S1 — Material Indent → PO → GRN Chain (MUST)
**Requirement:** Replace the flat `ItemRequest`/`DeliveryItem` with the real Indian site loop: indent (site engineer) → purchase order (office, at negotiated rate) → GRN (storekeeper verifies received vs ordered, records short/damaged).

**Acceptance criteria:**
- An indent line can be partially ordered across multiple POs; a PO line can be partially received across multiple GRNs.
- GRN captures `qtyOrdered`, `qtyReceived`, `qtyDamaged`/`qtyShort`; "ordered 200 bags, received 195, 3 damaged" is queryable.
- `requestedBy` becomes a real `User` FK (was free string).
- Full audit trail: indent → PO → GRN, each its own record/status.

**Prisma change:**
- New `MaterialItem` { name, category enum, unit enum, hsnCode?, defaultRate? Decimal }.
- New `Indent` { project, raisedById→User, status enum (DRAFT/SUBMITTED/APPROVED/REJECTED/PARTIALLY_ORDERED/CLOSED), neededBy, siteLocation } + `IndentLine` { indentId, materialItemId, qty, unit, remarks }.
- New `PurchaseOrder` { project, vendorId→Vendor, status enum (DRAFT/SENT/ACKNOWLEDGED/PARTIALLY_RECEIVED/RECEIVED/CLOSED), orderedDate, expectedDate } + `PurchaseOrderLine` { poId, indentLineId?, materialItemId, qty, rate Decimal, amount }.
- New `Grn` { poId, project, receivedById→User, receivedDate, vehicleRef? } + `GrnLine` { grnId, poLineId, qtyReceived, qtyDamaged, qtyShort, remarks }.
- New enums `MaterialCategory { CEMENT, STEEL, SAND, AGGREGATE, BRICK_BLOCK, RMC, TILES, SANITARY, ELECTRICAL, PAINT, HARDWARE, OTHER }`, `MaterialUnit { BAG, MT, CUM, SQFT, NOS, RFT, LTR }`.
- **Deprecate** `ItemRequest`, `DeliveryItem` (migrate existing rows into `Indent`/`Grn` or archive).

**API + UI:** CRUD + status-transition endpoints for indent/PO/GRN; site-engineer "Raise Indent" screen, office "Convert to PO" screen, storekeeper "Receive (GRN)" screen with short/damaged capture.

---

### S2 — Material Catalogue + Site Inventory / Stock-on-Hand (MUST) *(inferred continuation)*
**Requirement:** Maintain a per-project running stock derived from GRN inwards minus consumption, so the site knows cement/steel/sand on hand and can trigger re-order.

**Acceptance criteria:**
- Stock-on-hand per `MaterialItem` per project = Σ GRN received − Σ consumption issues.
- Low-stock indicator against a configurable reorder level.
- Stock ledger is auditable (every movement traceable to a GRN or issue).

**Prisma change:**
- New `StockLedger` { project, materialItemId, movementType enum (GRN_IN/ISSUE_OUT/ADJUSTMENT), qty, unit, refType, refId, balanceAfter, occurredAt }.
- `MaterialItem` (project scope) += `reorderLevel? Decimal`.

**API + UI:** Stock view per project with on-hand + low-stock chips; issue-material action posts an `ISSUE_OUT` movement.

---

### S3 — Daily Progress Report (DPR) + Stage Verification (MUST) *(inferred continuation; bridges to F2)*
**Requirement:** Site engineer logs daily progress with photos/videos; stage completion can be marked "verified," producing the evidence document that F2 milestones link to before a payment demand is raised.

**Acceptance criteria:**
- A DPR entry attaches `SITE_PHOTO`/`PROGRESS_VIDEO` documents and references a `PaymentStage`.
- Marking a stage verified sets the evidence `Document` that `Payment.linkedDocumentId` points to; F2's demand guard reads this.
- DPR feed visible to internal roles; selected media surfaced to client portal.

**Prisma change:**
- New `DailyProgressReport` { project, reportedById→User, reportDate, stage? enum, narrative, weather? } + `DprMedia` { dprId, documentId→Document, caption }.
- New `StageVerification` { project, stage, verifiedById→User, verifiedDate, evidenceDocumentId→Document } (one verified record per stage gates the matching `Payment`).

**API + UI:** DPR capture (mobile-friendly, Android roadmap), daily feed, "Verify Stage" action wired into F2's demand guard.

---

### F5 — TDS Handling (SHOULD)
**Requirement:** Capture TDS deducted by clients (194C works-contract 1–2%; 194-IA 1% on property ≥ ₹50 lakh; GST TDS) so net-realised vs invoiced reconciles against Form 26AS.

**Acceptance criteria:** Receipt/invoice records section, rate, TDS amount and net; per-project TDS summary; optional Form 16A document kind.

**Prisma change:** `Receipt`/`Invoice` += `tdsSection` enum `{ SEC_194C, SEC_194IA, GST_TDS, NONE }`, `tdsRate` Decimal, `tdsAmount` Decimal, `netAmount` Decimal. `DocumentKind` += `TDS_CERTIFICATE`.

**API + UI:** TDS fields in receipt entry; per-project TDS reconciliation summary.

---

### F6 — Retention / Withholding & DLP Release (SHOULD)
**Requirement:** Withhold 5–10% retention, track retained amounts and auto-schedule release at end of the defect-liability period started by handover.

**Acceptance criteria:** Retention line on schedule; release demand auto-scheduled at `handoverDate + defectLiabilityMonths`; retention visible in handover summary.

**Prisma change:** `Project` += `retentionPercent` Decimal, `defectLiabilityMonths` Int. New `RetentionLedger` { project, amountRetained, releaseDueDate, released Boolean, releasedReceiptId? } linked to `Handover`. (Or reuse `PaymentStage.RETENTION_RELEASE`.)

**API + UI:** Retention line on payment schedule; DLP-end release reminder; handover summary section.

---

### F7 — Price Escalation / Change Orders (SHOULD)
**Requirement:** Model escalation (index/annual %) and client-requested change orders/extra work that alter contract value mid-project, with client acceptance and audit trail.

**Acceptance criteria:** `Project.contractValue` = base + Σ approved variations; each variation captures approver, dates, client acceptance, supporting doc; full history of how contract value evolved.

**Prisma change:** New `Variation` { project, type enum `{ ESCALATION, CHANGE_ORDER, EXTRA_WORK }`, description, amountDelta Decimal, approvedById→User, approvedDate, clientAcceptedDate?, supportingDocId?→Document }. `Project` += `baseContractValue` Decimal.

**API + UI:** "Raise variation" workflow with client-acceptance capture; contract-value evolution audit panel.

---

### F8 — Statutory Approvals Register (SHOULD)
**Requirement:** Register the Karnataka approvals chain (Khata/e-Khata, plan sanction/commencement, BWSSB/BESCOM, OC/CC, Fire NOC) with status and expiry; gate `HANDOVER → COMPLETED` on OC/CC approved.

**Acceptance criteria:** Approvals checklist with status chips and expiry warnings; project cannot move to `COMPLETED` without `OCCUPANCY_CERT`/`COMPLETION_CERT` = APPROVED.

**Prisma change:** New `Approval` { project, type enum `{ KHATA, PLAN_SANCTION, COMMENCEMENT_CERT, BWSSB, BESCOM, OCCUPANCY_CERT, COMPLETION_CERT, FIRE_NOC, ENVIRONMENT_CLEARANCE }`, referenceNumber?, issuingAuthority?, issuedDate?, validUntil?, status enum `{ PENDING, APPLIED, APPROVED, REJECTED }`, documentId?→Document }. `Project` += `khataType?`, `surveyNumber?`, `propertyId?` (PID).

**API + UI:** Approvals checklist on project detail; status-transition guard in project service.

---

### S4 — Vendor/Supplier Master & PO Acknowledgement (SHOULD) *(inferred)*
**Requirement:** Maintain supplier master (GSTIN, contact, category) referenced by POs; capture supplier acknowledgement.

**Prisma change:** New `Vendor` { name, gstin?, pan?, phone, email?, address?, category enum, isActive }. `PurchaseOrder.vendorId`→Vendor (already referenced by S1).

**API + UI:** Vendor CRUD; vendor picker on PO; PO acknowledgement status.

---

### S5 — Labour Muster / Contractor Attendance & Subcontractor Work Orders (SHOULD) *(inferred)*
**Requirement:** Track daily labour headcount by trade and subcontractor work orders/running bills (mason, bar-bender, plumber, electrician gangs are typically sub-contracted in India).

**Prisma change:** New `Subcontractor` { name, trade enum, gstin?, phone }; new `WorkOrder` { project, subcontractorId, scope, rateBasis enum (LUMPSUM/PER_SQFT/PER_DAY), value Decimal, status }; new `LabourMuster` { project, date, trade, headcount, workOrderId? }.

**API + UI:** Daily muster entry; sub-contractor work order + running-bill view.

---

### S6 — Quality Checklists & Safety/Incident Register (SHOULD) *(inferred)*
**Requirement:** Stage-wise quality checklists (e.g. pre-concrete pour checks) and a safety incident register.

**Prisma change:** New `QualityCheck` { project, stage, checklistRef, passed Boolean, checkedById→User, checkedDate, remarks, documentId? }; new `SafetyIncident` { project, occurredAt, severity enum, description, reportedById→User, actionTaken }.

**API + UI:** Checklist gate on stage verification (ties to S3); incident log.

---

### X1 — Notifications (SHOULD, cross-cutting)
**Requirement:** Notify the right role on key events: demand raised, receipt issued, invoice generated, approval expiring, indent awaiting approval, GRN short/damaged, RERA disclosure missing, DLP release due.

**Acceptance criteria:** Events emit notifications to role-mapped recipients (in-app for POC; email/Android push on roadmap); each notification deep-links to the record.

**Prisma change:** New `Notification` { recipientId→User, type enum, title, body, refType, refId, readAt?, createdAt }.

**API + UI:** Notification bell + list; service hooks emitted from finance/site state transitions.

---

## 3. Consolidated Data-Model Delta (single migration)

### New models
- **Finance:** `Invoice`, `Receipt`, `PaymentScheduleTemplate`, `TemplateMilestone`, `Variation`, `RetentionLedger`, `Approval`, (`OrgProfile`, `TaxConfig`/`SacCode` — COULD).
- **Site:** `MaterialItem`, `Indent`, `IndentLine`, `PurchaseOrder`, `PurchaseOrderLine`, `Grn`, `GrnLine`, `StockLedger`, `Vendor`, `DailyProgressReport`, `DprMedia`, `StageVerification`, `Subcontractor`, `WorkOrder`, `LabourMuster`, `QualityCheck`, `SafetyIncident`.
- **Cross:** `Notification`.
- **Deprecated:** `ItemRequest`, `DeliveryItem` (migrate → `Indent`/`Grn`).

### New enums
- `GstTreatment { UNDER_CONSTRUCTION_5PCT, AFFORDABLE_1PCT, WORKS_CONTRACT_18PCT, COMMERCIAL_18PCT }`
- `PaymentStage { BOOKING, FOUNDATION, PLINTH, SLAB, BRICKWORK, PLASTERING, FLOORING, FINISHING, HANDOVER, RETENTION_RELEASE, CUSTOM }`
- `PaymentMode { UPI, NEFT, RTGS, CHEQUE, CASH, CARD }`
- `TdsSection { SEC_194C, SEC_194IA, GST_TDS, NONE }`
- `VariationType { ESCALATION, CHANGE_ORDER, EXTRA_WORK }`
- `ApprovalType { KHATA, PLAN_SANCTION, COMMENCEMENT_CERT, BWSSB, BESCOM, OCCUPANCY_CERT, COMPLETION_CERT, FIRE_NOC, ENVIRONMENT_CLEARANCE }`
- `ApprovalStatus { PENDING, APPLIED, APPROVED, REJECTED }`
- `MaterialCategory { CEMENT, STEEL, SAND, AGGREGATE, BRICK_BLOCK, RMC, TILES, SANITARY, ELECTRICAL, PAINT, HARDWARE, OTHER }`
- `MaterialUnit { BAG, MT, CUM, SQFT, NOS, RFT, LTR }`
- `IndentStatus { DRAFT, SUBMITTED, APPROVED, REJECTED, PARTIALLY_ORDERED, CLOSED }`
- `PurchaseOrderStatus { DRAFT, SENT, ACKNOWLEDGED, PARTIALLY_RECEIVED, RECEIVED, CLOSED }`
- `StockMovementType { GRN_IN, ISSUE_OUT, ADJUSTMENT }`
- `WorkOrderRateBasis { LUMPSUM, PER_SQFT, PER_DAY }`, `SubTrade`, `IncidentSeverity`, `NotificationType`.

### Modified enums
- `PaymentStatus` += `PARTIALLY_PAID`.
- `DocumentKind` += `RECEIPT, RERA_CERTIFICATE, SANCTIONED_PLAN, SALE_AGREEMENT, ALLOTMENT_LETTER, TDS_CERTIFICATE`.

### Field additions to `Project`
`gstin?`, `pan?`, `billingAddress?`, `stateCode?`, `gstTreatment`, `baseContractValue`, `contractValue`, `retentionPercent`, `defectLiabilityMonths`, `reraApplicable`, `reraRegistrationNumber?`, `carpetAreaSqft?`, `superBuiltUpSqft?`, `numberOfUnits?`, `reraCompletionDate?`, `khataType?`, `surveyNumber?`, `propertyId?`. *(Consider extracting billing/RERA into `ClientBillingProfile` if `Project` widens too far.)*

### Field additions to `Payment`
`sequence`, `percentOfContract`, `stage`, `linkedDocumentId?`. Status now derived from `Receipt` sum.

> **Migration caution:** `paidDate`/`reference` on `Payment` move conceptually into `Receipt`; backfill existing PAID payments by creating one `Receipt` each. RERA/GST/TDS columns are nullable to keep the POC seed valid. Status-transition guards (RERA → IN_PROGRESS, OC/CC → COMPLETED, stage-verified → demand) are app-layer, not DB constraints.

---

## 4. Ordered Implementation Plan (Dev + Test)

**Phase 0 — Foundations & migration (1 sprint)**
- Single Prisma migration adding all enums, new models, and `Project`/`Payment`/`Document` field/enum extensions.
- Data backfill: existing `Payment` → one `Receipt` each; archive/migrate `ItemRequest`/`DeliveryItem`.
- Seed: Karnataka residential `PaymentScheduleTemplate`, `MaterialItem` catalogue, `OrgProfile`/GSTIN, demo `Vendor`s.
- **Test:** migration up/down on a seeded copy; verify existing portal pages still render against the compatibility read.

**Phase 1 — Finance MUST (F1–F4) + S3 evidence bridge (1–2 sprints)**
- F2 templates + `contractValue`; S3 DPR + `StageVerification` (needed for F2's evidence gate); F3 receipts + status derivation; F1 GST invoice generation + PDF; F4 RERA fields, badge, transition guard.
- **Test:** GST split correctness (CGST=SGST, sum=rate), invoice serial uniqueness per FY, part-payment → `PARTIALLY_PAID`, RERA transition block, stage-verified demand gate, PDFs land as client-visible `Document`s.

**Phase 2 — Site MUST (S1, S2) (1–2 sprints)**
- Indent→PO→GRN chain, vendor picker (S4 minimal), stock ledger + low-stock.
- **Test:** partial-order and partial-receipt flows, short/damaged accounting, stock-on-hand = inwards − issues, `requestedBy` FK integrity.

**Phase 3 — Finance SHOULD (F5–F8) (1–2 sprints)**
- TDS on receipts/invoices + reconciliation summary; retention ledger + DLP release tied to `Handover`; variations + contract-value recompute; approvals register + OC/CC handover guard.
- **Test:** net = gross − TDS; release auto-scheduled at handover + DLP months; contractValue = base + Σ approved variations; COMPLETED blocked without OC/CC.

**Phase 4 — Site SHOULD + Notifications (S4–S6, X1) (1–2 sprints)**
- Vendor master polish, labour muster + work orders, quality/safety registers, notification service wired to all finance/site state transitions.
- **Test:** role-targeted notification delivery + deep links; quality-check gate on stage verification; muster aggregation.

**Phase 5 — COULD / Polish (F9, F10, S7) (as capacity allows)**
- Tax/SAC config master + admin screen; client financial transparency dashboard (contract → variations → invoiced → received → TDS → retained → balance, with evidence + downloads); material reconciliation vs BOQ.
- **Test:** dashboard aggregation matches underlying ledgers to the rupee; config-driven rates replace literals.

**Cross-cutting throughout:** enforce `Document.Visibility` on every new client-facing artefact (invoices/receipts → CLIENT_VISIBLE, margins/internal docs → INTERNAL/ADMIN_ONLY); keep all new UI mobile-responsive for the Android roadmap; map any new permission needs to existing roles (ADMIN/PROJECT_ADMIN for finance & PO approval, ENGINEER/PROJECT_INCHARGE for indents/DPR, WORKER read-only) and thus to Azure AD/Entra groups for the azd dev/prd deploy.