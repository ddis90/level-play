## India Construction Finance & Regulatory Compliance — Process Gaps & Product Requirements

The current `Payment` model is a flat milestone+amount+status row, and `Document` is a generic file with a visibility flag. Neither encodes the tax, statutory, or stage-payment realities of an Indian residential/commercial build. The gaps below are ordered by priority for a POC that must convince a Bangalore/Karnataka construction company that this platform "gets" their compliance world.

---

### MUST — 1. GST-compliant tax invoices (CGST/SGST, SAC, tax invoice number)
**Why it matters (India):** Works/construction contracts attract GST (typically 18% on construction services, 12% on affordable/eligible residential, 5% effective on under-construction residential without ITC). A bare `amount` cannot produce a legal **tax invoice**, which must carry a sequential invoice number, supplier GSTIN, client GSTIN (for B2B/commercial), SAC code (e.g. 9954 for construction services), taxable value, and the CGST + SGST split (intra-Karnataka is always CGST+SGST, not IGST). Without this the company can neither bill compliantly nor let clients claim input credit on commercial projects.
**Data model change:** New `Invoice` model (one per billing event, linked to `Payment`): `invoiceNumber` (unique, sequential per FY), `invoiceDate`, `placeOfSupply`, `sacCode`, `taxableValue` Decimal, `cgstRate`/`cgstAmount`, `sgstRate`/`sgstAmount`, `igstRate`/`igstAmount`, `totalAmount`, `supplierGstin`, `clientGstin?`, `reverseCharge` Boolean, `pdfDocumentId?`. Add `gstin?`, `pan?`, `billingAddress`, `stateCode` to `Project` (or a new `ClientBillingProfile`). Add `gstTreatment` enum to `Project` (`UNDER_CONSTRUCTION_5PCT`, `AFFORDABLE_1PCT`, `WORKS_CONTRACT_18PCT`, `COMMERCIAL_18PCT`).
**UI/API change:** "Generate Tax Invoice" action on a Payment → renders a GST-format invoice PDF (stored as a `Document` of kind `INVOICE`) with auto-computed tax split and running invoice serial. Client portal shows downloadable tax invoices, not just amounts.

### MUST — 2. Indian stage/milestone payment schedule templates
**Why it matters (India):** Indian residential builds bill against a well-understood physical-progress ladder: **booking/advance → foundation → plinth → slab-wise (G/1st/2nd...) → brickwork → plastering → flooring/finishing → handover**, each a fixed % of contract value. The current free-text `milestone` string gives no structure, no ordering, no % allocation, and no link to verified site progress — so clients cannot see "you are billing me for the 2nd-floor slab; prove it's poured."
**Data model change:** Add to `Payment`: `sequence` Int, `percentOfContract` Decimal, `stage` enum (`BOOKING`, `FOUNDATION`, `PLINTH`, `SLAB`, `BRICKWORK`, `PLASTERING`, `FLOORING`, `FINISHING`, `HANDOVER`, `CUSTOM`), `linkedDocumentId?` (evidence photo/video gating the demand). New `PaymentScheduleTemplate` + `TemplateMilestone` so a standard Karnataka residential ladder can be applied on project creation. Add `contractValue` Decimal to `Project` (distinct from `budget`).
**UI/API change:** On onboarding, pick a template → schedule auto-generated with %→amount. Project payment view shows the ladder with stage, %, evidence thumbnail, and a "raise demand only when stage verified" guard.

### MUST — 3. Payment receipts (separate from the milestone row)
**Why it matters (India):** A milestone can be paid in several tranches (cheque, UPI, NEFT, cash) on different dates. The current single `paidDate`/`reference` on `Payment` cannot represent part-payments or issue a numbered **money receipt**, which clients expect and which is essential for transparency and dispute defence.
**Data model change:** New `Receipt` model: `paymentId`, `receiptNumber` (sequential), `amountReceived` Decimal, `mode` enum (`UPI`, `NEFT`, `RTGS`, `CHEQUE`, `CASH`, `CARD`), `instrumentRef`, `receivedDate`, `tdsDeducted?` Decimal, `pdfDocumentId?`. Change `Payment.status` to derive from sum(receipts) vs amount (supports `PARTIALLY_PAID`).
**UI/API change:** "Record receipt" against a milestone, auto-issuing a receipt PDF to the client; running balance per milestone and per project.

### MUST — 4. RERA registration & statutory buyer disclosures
**Why it matters (India):** Under Karnataka RERA, any project with **>8 units or >500 sq.m** must be RERA-registered before marketing/booking, and the registration number must appear on all advertising and agreements. Buyers are entitled to disclosures: sanctioned plan, carpet area (not super-built-up), completion timeline, and quarterly progress updates on the RERA portal. The platform currently has nowhere to store a RERA number, carpet area, or flag a project as RERA-applicable — a glaring omission for a construction company selling apartments.
**Data model change:** Add to `Project`: `reraApplicable` Boolean, `reraRegistrationNumber?`, `carpetAreaSqft?` Decimal, `superBuiltUpSqft?` Decimal, `numberOfUnits?` Int, `reraCompletionDate?`. New `DocumentKind` values: `RERA_CERTIFICATE`, `SANCTIONED_PLAN`, `SALE_AGREEMENT`, `ALLOTMENT_LETTER`.
**UI/API change:** RERA badge + registration number on project detail and any client-facing/marketing project page; validation that RERA-applicable projects cannot move to booking/`IN_PROGRESS` without a RERA number and carpet-area disclosure attached.

### SHOULD — 5. TDS handling on payments (194C / 194-IA / GST TDS)
**Why it matters (India):** Commercial/contractor clients deduct **TDS u/s 194C** (1–2%) on works-contract payments, and buyers of property ≥ ₹50 lakh must deduct **1% TDS u/s 194-IA**. The company must track TDS deducted by clients (to reconcile against Form 26AS) and TDS it deducts from subcontractors. The model has no TDS concept, so net-vs-gross reconciliation is impossible.
**Data model change:** Add to `Receipt`/`Invoice`: `tdsSection` enum (`SEC_194C`, `SEC_194IA`, `GST_TDS`, `NONE`), `tdsRate`, `tdsAmount`, `netAmount`. Optionally a `TdsCertificate` doc kind for Form 16A.
**UI/API change:** Receipt entry captures TDS so net realised vs invoiced is visible; a per-project TDS summary for reconciliation.

### SHOULD — 6. Retention / withholding & defect-liability release
**Why it matters (India):** Contracts commonly withhold **5–10% retention** released after a **defect liability period (DLP)** post-handover. Clients and the builder both need to see retained amounts and their scheduled release. No field models this today.
**Data model change:** Add to `Project`: `retentionPercent` Decimal, `defectLiabilityMonths` Int. New `RetentionLedger` (or `Payment.stage = RETENTION_RELEASE`) tracking `amountRetained`, `releaseDueDate`, `released` Boolean. Link to `Handover` to start the DLP clock.
**UI/API change:** Retention line shown on the payment schedule; auto-scheduled release demand at DLP end; visible in handover summary.

### SHOULD — 7. Price escalation / cost-escalation clauses
**Why it matters (India):** Indian build contracts frequently include **escalation clauses** tied to steel/cement/labour indices or a fixed annual %, plus client-requested **change orders / variations** that alter contract value mid-project. Without modelling this, the contract value and schedule silently drift and disputes follow.
**Data model change:** New `Variation` model: `projectId`, `type` enum (`ESCALATION`, `CHANGE_ORDER`, `EXTRA_WORK`), `description`, `amountDelta` Decimal, `approvedBy`, `approvedDate`, `clientAcceptedDate?`, `supportingDocId?`. Recompute `Project.contractValue` from base + sum(variations).
**UI/API change:** "Raise variation / change order" workflow with client acceptance capture; audit trail of how contract value evolved from original.

### SHOULD — 8. Statutory approvals register (BBMP/Khata/plan sanction/OC/CC)
**Why it matters (India):** A Bangalore/Karnataka project lives or dies on its approvals chain: **Khata (A-Khata) / e-Khata, BBMP or panchayat plan sanction / commencement certificate, BWSSB/BESCOM connections, and finally the Occupancy Certificate (OC) and Completion Certificate (CC).** Selling/handing over without OC is a serious compliance and financing risk. The platform has no register of these statutory documents or their validity.
**Data model change:** New `Approval` model: `projectId`, `type` enum (`KHATA`, `PLAN_SANCTION`, `COMMENCEMENT_CERT`, `BWSSB`, `BESCOM`, `OCCUPANCY_CERT`, `COMPLETION_CERT`, `FIRE_NOC`, `ENVIRONMENT_CLEARANCE`), `referenceNumber`, `issuingAuthority`, `issuedDate`, `validUntil?`, `status` enum (`PENDING`/`APPLIED`/`APPROVED`/`REJECTED`), `documentId?`. Add `khataType?`, `surveyNumber?`, `propertyId?` (PID) to `Project`.
**UI/API change:** Approvals checklist on project detail with status chips and expiry warnings; gate the `HANDOVER`→`COMPLETED` transition on OC/CC being `APPROVED`.

### COULD — 9. Tax-rate configuration & HSN/SAC master
**Why it matters (India):** GST rates and the company's GSTIN are config, not per-invoice constants; hard-coding them now creates rework when rates change or new SAC lines (e.g. 9954 vs material supply HSN) are needed.
**Data model change:** New `TaxConfig`/`SacCode` reference tables (`sacCode`, `description`, `defaultGstRate`, `effectiveFrom`). Company-level `OrgProfile` holding `gstin`, `pan`, `state`, `invoiceSeriesPrefix`.
**UI/API change:** Admin screen to manage GST rates and SAC codes; invoice generator reads from config rather than literals.

### COULD — 10. Client-facing financial transparency dashboard
**Why it matters (India):** Trust is the differentiator in Indian residential construction (clients fear cost overruns and opaque billing). A single client view of contract value → variations → invoiced → received → TDS → retained → balance, with stage-evidence links, is a strong POC "wow."
**Data model change:** None new — an aggregation/read model over `Payment`, `Invoice`, `Receipt`, `Variation`, `RetentionLedger`.
**UI/API change:** Read-only client dashboard summarising the full money trail with downloadable invoices/receipts; staff see the same plus internal margins.