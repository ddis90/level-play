# Business Requirements Document (BRD)
## Levelplay Constructions — Digital Platform

**Document owner:** Business Analyst / Product Manager
**Date:** 2026-06-16
**Status:** Draft for POC sign-off

---

## 1. Project Vision & Goals

### 1.1 Vision
Build a single, polished web platform for **Levelplay Constructions** that does two jobs at once:
1. **Win new business** through an advanced, appealing public marketing website that showcases the company's construction work across Bangalore and Karnataka.
2. **Run the work** through an authenticated portal that manages the full construction project lifecycle — from a website lead all the way to handover — with full financial and progress transparency to clients.

### 1.2 Goals
- Present Levelplay's services (home, apartment, commercial, interior, turnkey) and live/completed projects in a way that builds trust and generates qualified leads.
- Convert website visitors into structured leads, then into onboarded clients, without losing information along the way.
- Give clients real transparency: what they are paying for, what has been delivered, and how their project is progressing on site.
- Give internal teams (admins, engineers, architects, workers) a shared place to upload drawings, photos, and documents with **controlled visibility** so the right people see the right things.
- Model roles so they map 1:1 to **Azure AD / Entra ID groups** later, making the production auth swap a configuration change, not a rebuild.

### 1.3 Sales / POC angle (why this matters now)
The first deliverable is a **DEV POC** that Levelplay's leadership can click through to decide whether to procure. The POC must *feel* like a real product: a beautiful public site plus a working portal driven by seeded dummy users. The business objective of the POC is **to close the sale** — it is a demo asset first, and a production foundation second. Once procured, the same codebase moves to a **PRD** environment via `azd up` with Entra ID auth enabled.

---

## 2. Stakeholders & Personas

### 2.1 External stakeholders
| Persona | Who they are | What they need |
|---|---|---|
| **Visitor / Prospect** | Anyone browsing the public site | Quickly understand services, see past/ongoing projects, see service areas (Bangalore, Mysore, Tumkur, Davanagere, Shivamogga), and submit an enquiry easily on any device. |
| **Client** | A customer whose project Levelplay is building | Log in to see *their* project only: approved requirements, floor plans under discussion, payment structure and records, delivery status, on-site progress, and handover details. Upload their own documents/photos. Trust that figures are accurate. |

### 2.2 Internal roles (each maps to an Entra ID group)
| Role | What they do on the platform | Key needs |
|---|---|---|
| **admin** | Platform/company-wide administration | Manage users, roles, projects; see everything including ADMIN_ONLY items; convert leads to clients; audit payments. |
| **project_admin** | Administers specific projects | Manage memberships, requirements, payments, documents and visibility for assigned projects. |
| **project_owner** | Accountable owner of a project | Oversight of scope, payments, progress, and handover for owned projects. |
| **project_incharge** | Day-to-day project lead on site | Update progress, manage deliveries and item requests, coordinate uploads. |
| **engineer** | Structural/site engineering | Upload structural drawings and site documents; record progress; mark internal vs client-visible. |
| **architect** | Design and floor plans | Create/upload floor plan drawings, design suggestions; participate in design discussions. |
| **worker** | On-site execution | Upload site photos/videos and progress evidence (typically INTERNAL by default). |

> **Visibility principle:** the same project contains CLIENT_VISIBLE, INTERNAL, and ADMIN_ONLY content. A persona's role determines what they can see and upload.

---

## 3. Scope

### 3.1 In scope — POC (DEV, demo to Levelplay)
- Public marketing site (responsive desktop + mobile) with services, service areas, and a projects showcase.
- Onboarding lead-capture form on the public site.
- Authenticated portal backed by **seeded bcrypt dummy users** covering every role.
- Lead → client onboarding flow.
- Client requirements management.
- Design discussion view with floor plan drawing references.
- Payment structure, payment records, and basic auditing view.
- Document/media upload with **visibility abstraction** (CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY) and DocumentKind.
- Delivery item tracking and item requests.
- On-site progress tracking.
- Handover details.
- Built on the existing Prisma data model (User, Role, UserRole, Project, ProjectMembership, Document, Payment, DeliveryItem, ItemRequest, Handover).
- Deployable to Azure DEV via `azd up`.

### 3.2 In scope — Full / PRD (after procurement)
- **Entra ID / Azure AD** authentication replacing seeded login, with roles bound 1:1 to Entra groups (config-only swap).
- Azure Blob Storage for production media at scale.
- Hardened auditing and reporting on payments and progress.
- Production-grade content management of the public projects showcase.
- PRD environment provisioned via `azd up`.

### 3.3 Out of scope
- The native **Android app** (deferred to a later phase; the responsive web app serves mobile in the interim).
- Online payment **collection / gateway** integration (the platform records and audits payments; it does not process card/UPI transactions in this scope).
- Any feature not in the stated feature list (no CRM beyond lead capture, no accounting/ERP, no inventory procurement system, no third-party marketplace).
- Real-time chat/video; design "discussions" are document- and drawing-centric in this scope.

---

## 4. Functional Requirements

> Grouped by module. Requirements are numbered FR-<module>-<n>.

### 4.1 Public Marketing Site
- **FR-PUB-1** The public site shall present Levelplay's service categories: home construction, apartment construction, commercial construction, interior construction, and turnkey.
- **FR-PUB-2** The site shall present service areas: Bangalore plus Karnataka cities including Mysore, Tumkur, Davanagere, and Shivamogga.
- **FR-PUB-3** The site shall showcase ongoing and completed projects with imagery and summary details to attract customers.
- **FR-PUB-4** The site shall be server-side rendered (Next.js App Router, Node runtime) for fast first load and SEO.
- **FR-PUB-5** The site shall be fully responsive across desktop and mobile and present an advanced, appealing, easy-to-navigate experience.
- **FR-PUB-6** The site shall provide clear calls-to-action that lead a visitor to the enquiry/onboarding form.

### 4.2 Onboarding (Lead → Client)
- **FR-ONB-1** The site shall provide a lead-capture form collecting prospect contact details and project interest.
- **FR-ONB-2** Form submissions shall be validated with zod before persistence.
- **FR-ONB-3** Captured leads shall be reviewable by admin / project_admin in the portal.
- **FR-ONB-4** An admin / project_admin shall be able to convert a lead into a **client** User and create or associate a **Project**.
- **FR-ONB-5** Converting a lead shall establish ProjectMembership linking the client to their project.

### 4.3 Requirements Management
- **FR-REQ-1** Authorized internal roles shall record and maintain client requirements against a project.
- **FR-REQ-2** Clients shall be able to view the requirements captured for their own project.
- **FR-REQ-3** Requirement changes shall be attributable to the user who made them.

### 4.4 Design & Drawings
- **FR-DSN-1** Architects shall upload/associate floor plan drawings to a project.
- **FR-DSN-2** The portal shall present a design discussion view organized around the project's floor plan drawings and design suggestions.
- **FR-DSN-3** Drawings shall carry a DocumentKind and a Visibility setting so draft/internal designs are separated from client-shared designs.
- **FR-DSN-4** Clients shall see only CLIENT_VISIBLE design items for their project.

### 4.5 Payments (Structure, Records, Auditing)
- **FR-PAY-1** Authorized roles shall define a payment structure for a project (milestones/amounts).
- **FR-PAY-2** The portal shall record payment entries with a PaymentStatus.
- **FR-PAY-3** Clients shall view their project's payment structure and payment records for transparency.
- **FR-PAY-4** The portal shall provide an auditing view of payments, with each entry attributable and timestamped.
- **FR-PAY-5** Payment data shall be validated with zod on write.

### 4.6 Documents / Media & Visibility Abstraction
- **FR-DOC-1** Clients, project admins, workers, engineers, and architects shall be able to upload documents/media (electrical, plumbing, structural drawings, suggestions, site photos/videos), typed by DocumentKind.
- **FR-DOC-2** Every document shall have a Visibility of CLIENT_VISIBLE, INTERNAL, or ADMIN_ONLY.
- **FR-DOC-3** The portal shall enforce visibility on retrieval: clients see only CLIENT_VISIBLE items; internal roles see CLIENT_VISIBLE + INTERNAL; admins additionally see ADMIN_ONLY.
- **FR-DOC-4** Uploads shall be scoped to a project via ProjectMembership; users see documents only for projects they belong to.
- **FR-DOC-5** In the POC, media may be stored locally/seeded; in PRD, media shall be stored in Azure Blob Storage (storage location is configuration-driven).

### 4.7 Delivery Tracking & Item Requests
- **FR-DEL-1** The portal shall track DeliveryItems with a DeliveryStatus per project.
- **FR-DEL-2** Authorized roles shall raise ItemRequests for needed items.
- **FR-DEL-3** Delivery and request status shall be visible to relevant roles, with client-facing visibility where appropriate.

### 4.8 Progress Tracking
- **FR-PRG-1** Project_incharge / engineers / workers shall record on-site development progress, supported by uploaded photos/videos.
- **FR-PRG-2** Clients shall view current progress for their own project (client-visible progress only).

### 4.9 Handover
- **FR-HND-1** The portal shall capture Handover details for a project.
- **FR-HND-2** Clients shall view handover details for their own completed project.
- **FR-HND-3** Project status shall reflect handover via ProjectStatus.

### 4.10 Admin & Access Control
- **FR-ADM-1** Admins shall manage Users, Roles (RoleName enum), and UserRole assignments.
- **FR-ADM-2** Admins / project_admins shall manage Projects, ProjectStatus, and ProjectMemberships.
- **FR-ADM-3** Roles shall be modeled to map 1:1 to Entra ID groups, so production auth is enabled by configuration without changing the role model.
- **FR-ADM-4** In the POC, authentication shall use seeded bcrypt dummy users covering every role.
- **FR-ADM-5** All authorization decisions (visibility, project scoping, role permissions) shall be enforced server-side in API routes.

---

## 5. Non-Functional Requirements

### 5.1 Responsive / Mobile
- **NFR-1** All public and portal screens shall be responsive and usable on mobile and desktop browsers, anticipating a later Android app sharing the same APIs.

### 5.2 Security
- **NFR-2** Passwords (POC) shall be stored as bcrypt hashes; no plaintext credentials.
- **NFR-3** All inputs shall be validated server-side with zod.
- **NFR-4** Visibility (CLIENT_VISIBLE / INTERNAL / ADMIN_ONLY) and project-membership scoping shall be enforced on the server for every read and write; the UI shall never be the only gate.
- **NFR-5** The auth mechanism shall be swappable from seeded users to Entra ID via configuration, without changing the role/permission model.
- **NFR-6** Secrets (DATABASE_URL, storage keys) shall come from environment configuration, never committed.

### 5.3 Performance
- **NFR-7** Public pages shall be server-side rendered for fast first contentful paint and SEO.
- **NFR-8** The platform shall comfortably support POC demo load and scale on Azure App Service for PRD.

### 5.4 Auditability
- **NFR-9** Payment records and key project changes shall be attributable to a user and timestamped.
- **NFR-10** Document uploads shall record who uploaded, kind, and visibility.

### 5.5 Portability / Deployment
- **NFR-11** A single `DATABASE_URL` shall switch between local PostgreSQL and Azure Database for PostgreSQL Flexible Server.
- **NFR-12** The application shall deploy to Azure via Azure Developer CLI with simple `azd up` steps for both DEV and PRD.

---

## 6. Success Metrics / Acceptance for the POC Demo

The POC is accepted for the procurement decision when a reviewer can, in a single demo session:

- **AC-1** Browse a polished, responsive public site showing all five services and the Karnataka service areas, with a projects showcase.
- **AC-2** Submit the lead-capture form and see the lead appear in the portal.
- **AC-3** Log in as seeded users for **each role** (client, admin, project_admin, project_owner, project_incharge, engineer, architect, worker).
- **AC-4** Convert a lead into a client + project and confirm the client can log in and see only their project.
- **AC-5** Demonstrate **visibility abstraction**: an item marked INTERNAL or ADMIN_ONLY is invisible to the client, while CLIENT_VISIBLE items appear.
- **AC-6** Walk a project through requirements → floor-plan design → payment structure & records → document/media uploads → delivery tracking & item request → on-site progress → handover.
- **AC-7** Show the payment auditing view with attributable, timestamped entries giving clients transparency.
- **AC-8** Confirm the whole stack deploys to Azure DEV via `azd up`.

**Business success signal:** Levelplay leadership agrees to procure and move to PRD.

---

## 7. Phased Roadmap

### Phase 1 — POC (DEV)
- Public marketing site + projects showcase, fully responsive.
- Lead capture + lead→client onboarding.
- Portal covering requirements, design/drawings, payments + audit, documents with visibility, delivery + item requests, progress, handover.
- Seeded bcrypt users for all roles; roles structured for 1:1 Entra mapping.
- Azure App Service + PostgreSQL Flexible Server provisioned via `azd up`; media may be local/seeded.
- **Exit:** all Section 6 acceptance criteria met; procurement decision.

### Phase 2 — Production (PRD)
- Swap seeded auth for **Entra ID / Azure AD**, roles bound to Entra groups (config-only).
- Move media to **Azure Blob Storage**.
- Harden payment auditing/reporting and the public showcase content management.
- Promote to PRD environment via `azd up` with production configuration and secrets.
- **Exit:** Levelplay running live client projects on the platform.

### Phase 3 — Android App
- Native Android client reusing the same Next.js API routes and role model.
- Mobile-optimized client and on-site (worker/engineer) workflows: uploads, progress, deliveries.
- **Exit:** field and client users transacting from mobile devices.