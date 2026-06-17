I have enough grounding in the actual schema and lead flow. Producing the analysis.

## Client Journey & Growth — Process Gaps and Product Requirements

The current model treats a website enquiry as a bare `Project` in `LEAD` status (see `src/app/api/leads/route.ts` — it stuffs name/email/phone into `Project.description` as free text). There is no CRM, no estimate→agreement chain, no client sign-off, no notifications, and `Handover` is a single boolean with nothing after it. Below are the gaps that matter most to an Indian construction client journey, prioritized for a POC.

---

### 1. Lead capture loses the human — no Contact/CRM entity `MUST`
**Why it matters:** In India, 80% of residential construction deals are won on follow-up discipline ("did anyone call back?"). Today the lead's name, email and phone are concatenated into `Project.description` free text — unsearchable, un-dedupable, and lost the moment a project is created. A walk-in or referral lead that isn't a website form has nowhere to live.
**Data model:** New `Contact` (id, fullName, phone, email, source enum: WEBSITE/REFERRAL/WALK_IN/PHONE/SOCIAL, city, preferredLanguage, createdAt). New `Lead` (contactId, projectId?, status enum: NEW/CONTACTED/QUALIFIED/QUOTED/WON/LOST, lostReason?, budgetBand, serviceType, plotSize?, ownerUserId for the assigned salesperson, nextFollowUpAt). New `LeadActivity` (leadId, type: CALL/WHATSAPP/SITE_VISIT/EMAIL/NOTE, notes, byUserId, occurredAt). Convert `Lead`→`Project` instead of creating the Project at form submit.
**UI/API:** Rework `/api/leads` to create `Contact`+`Lead` (not a `Project`). New `/portal/leads` kanban (NEW→WON columns), lead detail with activity timeline and "log call / next follow-up" actions. A daily "due follow-ups" widget on the staff dashboard. This is the single most impressive demo for a construction company because it shows you won't drop their enquiries.

### 2. No quotation / estimate before agreement `MUST`
**Why it matters:** The Indian flow is enquiry → site visit → **rough estimate (₹/sqft)** → detailed quotation → agreement. The platform jumps straight from LEAD to a fixed `Payment` schedule, skipping the most negotiated, trust-defining artifact. Clients compare quotes across 3-4 builders.
**Data model:** New `Quotation` (projectId/leadId, version Int, status enum: DRAFT/SENT/ACCEPTED/REVISED/REJECTED, ratePerSqft Decimal?, builtUpArea Decimal?, subtotal, gstPercent, total, validUntil, notes, createdById). New `QuotationLineItem` (quotationId, description, quantity, unit, rate, amount). On acceptance, generate the `Payment` milestones from the quotation total.
**UI/API:** `/portal/projects/[id]/quotation` builder (line items + ₹/sqft helper + GST), versioned so revisions are tracked, "Send to client" producing a client-visible read-only view. `/api/quotations` CRUD + `accept`. Reuse the existing `Visibility` pattern so the quote shows up client-side.

### 3. No agreement / contract linkage to the payment schedule `MUST`
**Why it matters:** The agreement is the legal anchor; payment milestones must derive from it. Today `Payment` rows float free with no parent agreement, no signed date, no link to the accepted quote — a dispute over "what did we agree to pay" has no source of truth.
**Data model:** New `Agreement` (projectId @unique, quotationId, status: DRAFT/SENT/SIGNED, contractValue Decimal, signedAt, signedByClientName, documentId? linking to the existing `Document` of kind CONTRACT). Add `Payment.agreementId` (nullable FK) and `Payment.percentOfContract Decimal?` so milestones tie to the agreed value.
**UI/API:** Agreement panel on project detail showing contract value vs sum of `Payment` milestones (a validation any contractor will respect), "mark signed" action, and the linked CONTRACT document. Minimal for POC: one agreement per project.

### 4. Client approvals / sign-offs on designs are untracked `MUST`
**Why it matters:** Disputes in Indian residential builds overwhelmingly come from "I never approved that elevation / tile / layout." `Document` supports FLOOR_PLAN and drawings but has no approval state — the client can *see* a floor plan but cannot formally *approve* it, and staff can't prove they did.
**Data model:** New `Approval` (documentId or a generic targetType/targetId, projectId, requestedFromUserId (client), status enum: PENDING/APPROVED/CHANGES_REQUESTED/REJECTED, decidedAt, comment, signatureName). Optionally add `Document.requiresApproval Boolean`.
**UI/API:** On any CLIENT_VISIBLE drawing, an "Approve / Request changes" button for clients and a "Request approval" action for architects. Approval status badge on the document card (reuse the existing badge styling in `[id]/page.tsx`). `/api/approvals` decision endpoint. Huge trust signal in the demo.

### 5. No change request / variation order with cost impact `MUST`
**Why it matters:** Scope changes ("add a pooja room," "upgrade to granite") are universal and are the #1 source of cost/schedule overruns and client mistrust in India. There is no entity to capture a change, its cost delta, or client authorization — so changes happen verbally and blow up at final billing.
**Data model:** New `ChangeRequest` (projectId, title, description, raisedById, status enum: PROPOSED/CLIENT_REVIEW/APPROVED/REJECTED/EXECUTED, costImpact Decimal (±), scheduleImpactDays Int?, approvedByClientName, approvedAt, generatedPaymentId?). On approval, optionally create a linked `Payment` (extra milestone) so finances stay reconciled.
**UI/API:** `/portal/projects/[id]/changes` list + "Raise variation" form; client gets an approve/reject with the cost clearly shown in ₹. API to convert an approved CR into a `Payment` line. Show a running "Original contract ₹X + approved variations ₹Y = revised ₹Z" header — extremely persuasive to a builder.

### 6. WhatsApp-style notifications are absent `MUST`
**Why it matters:** WhatsApp *is* the communication channel in Indian construction; clients expect a message when a payment is due, a drawing needs approval, or a delivery arrives. Email-only or portal-only updates will be ignored. Even faked for POC, this is a wow factor.
**Data model:** New `Notification` (userId, channel enum: WHATSAPP/SMS/EMAIL/IN_APP, templateKey, payload Json, relatedType/relatedId, status: QUEUED/SENT/FAILED/READ, sentAt). Add `User.whatsappOptIn Boolean @default(true)` and rely on existing `User.phone`.
**UI/API:** A notification service hook fired on key events (payment OVERDUE, approval requested, change request, delivery DELIVERED). For POC, render an in-app bell + a "WhatsApp preview" card showing the exact message text and a click-to-chat `wa.me/<phone>` link (no paid API needed). Swap in WhatsApp Business / Gupshup / Twilio for prod.

### 7. Client-facing progress timeline & financial summary is thin `SHOULD`
**Why it matters:** Trust is built by visibility. Clients want one screen: "what stage are we at, what % done, how much have I paid vs what's pending." The `Project.status` enum exists but there's no progress %, no milestone timeline, and the payment table shows rows without a paid/pending rollup.
**Data model:** Add `Project.progressPercent Int @default(0)` (or derive from a new lightweight `Milestone` model: projectId, title, plannedDate, completedDate, sequence). No new payment fields strictly needed.
**UI/API:** Client dashboard card: stage stepper (LEAD→…→COMPLETED), progress %, and a payment summary (Total ₹ / Paid ₹ / Pending ₹ / Overdue ₹) computed from existing `Payment` rows. Pure read-side; high impact for low effort.

### 8. Referrals & testimonials have no home `SHOULD`
**Why it matters:** Residential construction in tier-2 Karnataka (Mysore, Tumkur, Davanagere, Shivamogga) runs on word-of-mouth. Referrals are the cheapest lead source and there's currently no way to capture "who referred whom" or collect a testimonial at handover.
**Data model:** Add `Lead.referredByContactId` (self-link to `Contact`). New `Testimonial` (projectId, contactId, rating Int, quote, consentToPublish Boolean, status: PENDING/APPROVED, createdAt) — approved ones can feed the public marketing site.
**UI/API:** Post-handover "request a testimonial" flow (ties to notifications #6), a referral capture field on the lead form, and an admin moderation list. Approved testimonials render on the public homepage `src/app/page.tsx`.

### 9. Warranty / Defect Liability Period (DLP) ends at the boolean `MUST`
**Why it matters:** Indian construction contracts carry a Defect Liability Period (typically 12 months) and snag-list rectification post-handover. The current `Handover` is just `signedOff Boolean` + `handedOverAt` — the relationship *ends* at handover, exactly where retention and referrals begin. No way to log a defect or track the warranty clock.
**Data model:** Extend `Handover` with `dlpStartDate`, `dlpMonths Int @default(12)`, `dlpEndDate`. New `Snag`/`DefectTicket` (projectId, raisedByUserId (client), title, description, photoDocumentId?, status enum: OPEN/IN_PROGRESS/RESOLVED/CLOSED, severity, raisedAt, resolvedAt). New `HandoverChecklist` items (handoverId, label, done) so sign-off is itemized, not one boolean.
**UI/API:** Handover screen with a checklist + DLP dates; a post-handover "Report a defect" button for clients that creates a `Snag` (reusing `Document`/SITE_PHOTO for evidence). Defect list with status. Shows the builder you support clients after the cheque clears.

### 10. No AMC / annual maintenance contract after DLP `COULD`
**Why it matters:** AMC is a recurring-revenue and retention play once the free DLP lapses — increasingly offered by organized builders. Nice differentiator but not POC-critical.
**Data model:** New `Amc` (projectId, contactId, startDate, endDate, annualFee Decimal, status: ACTIVE/EXPIRED/CANCELLED, nextServiceDate). Reuse `Payment` for AMC invoicing and `Notification` for renewal reminders.
**UI/API:** Simple AMC record + renewal reminder; defer most UI to prod.

### 11. Lead/Project channel for client questions (suggestions) is one-way `COULD`
**Why it matters:** `DocumentKind.SUGGESTION` exists but there's no threaded client↔staff messaging; clients resort to WhatsApp where context is lost from the project record.
**Data model:** New `Message`/`ProjectThread` (projectId, authorUserId, body, visibility reusing the `Visibility` enum, createdAt).
**UI/API:** A lightweight per-project comment thread on the detail page; respects the existing visibility filtering. Lower priority than notifications.

---

**POC sequencing recommendation:** Ship #1 (CRM lead), #2 (quotation), #4 (design approvals), #5 (change requests), #6 (WhatsApp-preview notifications) and #9 (warranty/DLP + snags) for the demo — these six narrate the full client journey from enquiry to post-handover care and are exactly what a construction company will judge the platform on. #3 and #7 are low-effort reconciliation/visibility wins. #8, #10, #11 are retention/growth extras for after the POC lands.