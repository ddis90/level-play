// Seeds dummy data for the local POC: one user per role, sample projects, and
// documents spanning all three visibility levels so the RBAC demo is meaningful.
// JavaScript version for production deployment (no tsx dependency)

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// One shared password for every demo account keeps the POC easy to present.
const DEMO_PASSWORD = 'Passw0rd!';

const ROLE_SEED = [
  { name: 'CLIENT', label: 'Client', description: 'Customer who owns the project' },
  { name: 'ADMIN', label: 'Administrator', description: 'Full platform administrator' },
  { name: 'PROJECT_ADMIN', label: 'Project Admin', description: 'Manages a project end to end' },
  { name: 'PROJECT_OWNER', label: 'Project Owner', description: 'Business owner of a project' },
  { name: 'PROJECT_INCHARGE', label: 'Project In-charge', description: 'On-site responsible person' },
  { name: 'ENGINEER', label: 'Engineer', description: 'Civil/site engineer' },
  { name: 'ARCHITECT', label: 'Architect', description: 'Designs drawings and plans' },
  { name: 'WORKER', label: 'Worker', description: 'On-site worker' },
];

// email -> role for the demo accounts.
const USER_SEED = [
  { email: 'client@demo.test', fullName: 'Priya Client', role: 'CLIENT' },
  { email: 'admin@demo.test', fullName: 'Arjun Admin', role: 'ADMIN' },
  { email: 'projectadmin@demo.test', fullName: 'Divya ProjectAdmin', role: 'PROJECT_ADMIN' },
  { email: 'owner@demo.test', fullName: 'Ravi Owner', role: 'PROJECT_OWNER' },
  { email: 'incharge@demo.test', fullName: 'Suresh Incharge', role: 'PROJECT_INCHARGE' },
  { email: 'engineer@demo.test', fullName: 'Meena Engineer', role: 'ENGINEER' },
  { email: 'architect@demo.test', fullName: 'Karthik Architect', role: 'ARCHITECT' },
  { email: 'worker@demo.test', fullName: 'Lakshmi Worker', role: 'WORKER' },
];

async function main() {
  console.log('Seeding Levelplay POC data...');
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Roles
  const roleByName = {};
  for (const r of ROLE_SEED) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { label: r.label, description: r.description },
      create: r,
    });
    roleByName[r.name] = role.id;
  }

  // Users (each with a single role for clarity)
  const userByRole = {};
  for (const u of USER_SEED) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { fullName: u.fullName, passwordHash },
      create: { email: u.email, fullName: u.fullName, passwordHash },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: roleByName[u.role] } },
      update: {},
      create: { userId: user.id, roleId: roleByName[u.role] },
    });
    userByRole[u.role] = user.id;
  }

  // A sample project with members across roles.
  const project = await prisma.project.upsert({
    where: { code: 'LP-2026-001' },
    update: {},
    create: {
      code: 'LP-2026-001',
      name: 'Sharma Residence — Duplex Villa',
      description: 'G+1 duplex villa with modern interiors at RR Nagar, Bangalore.',
      status: 'IN_PROGRESS',
      city: 'Bangalore',
      addressLine: 'RR Nagar, Bangalore',
      budget: '8500000',
    },
  });

  // Attach members.
  const memberPairs = [
    { role: 'CLIENT' },
    { role: 'PROJECT_ADMIN' },
    { role: 'PROJECT_OWNER' },
    { role: 'PROJECT_INCHARGE' },
    { role: 'ENGINEER' },
    { role: 'ARCHITECT' },
    { role: 'WORKER' },
  ];
  for (const m of memberPairs) {
    const userId = userByRole[m.role];
    if (!userId) continue;
    await prisma.projectMembership.upsert({
      where: { projectId_userId_role: { projectId: project.id, userId, role: m.role } },
      update: {},
      create: { projectId: project.id, userId, role: m.role },
    });
  }

  // Documents across all three visibility levels — this is the heart of the demo.
  const architectId = userByRole.ARCHITECT;
  const adminId = userByRole.ADMIN;
  const engineerId = userByRole.ENGINEER;

  const docs = [
    {
      title: 'Approved Floor Plan — Ground Floor',
      kind: 'FLOOR_PLAN',
      visibility: 'CLIENT_VISIBLE',
      uploadedById: architectId,
      fileUrl: '/uploads/demo/floorplan-ground.pdf',
    },
    {
      title: 'Site Progress Photos — Week 12',
      kind: 'SITE_PHOTO',
      visibility: 'CLIENT_VISIBLE',
      uploadedById: engineerId,
      fileUrl: '/uploads/demo/progress-week12.jpg',
    },
    {
      title: 'Electrical Layout (internal review)',
      kind: 'ELECTRICAL_DRAWING',
      visibility: 'INTERNAL',
      uploadedById: architectId,
      fileUrl: '/uploads/demo/electrical-v2.pdf',
    },
    {
      title: 'Plumbing Drawing — draft',
      kind: 'PLUMBING_DRAWING',
      visibility: 'INTERNAL',
      uploadedById: architectId,
      fileUrl: '/uploads/demo/plumbing-draft.pdf',
    },
    {
      title: 'Vendor Contract & Margins',
      kind: 'CONTRACT',
      visibility: 'ADMIN_ONLY',
      uploadedById: adminId,
      fileUrl: '/uploads/demo/vendor-contract.pdf',
    },
  ];

  // Clear and reinsert demo docs so reseeding stays idempotent.
  await prisma.document.deleteMany({ where: { projectId: project.id } });
  for (const d of docs) {
    await prisma.document.create({ data: { ...d, projectId: project.id } });
  }

  // Payment milestones (transparency + audit trail).
  await prisma.payment.deleteMany({ where: { projectId: project.id } });
  await prisma.payment.createMany({
    data: [
      { projectId: project.id, milestone: 'Booking advance', amount: '500000', status: 'PAID', reference: 'TXN-1001' },
      { projectId: project.id, milestone: 'Foundation complete', amount: '1500000', status: 'PAID', reference: 'TXN-1002' },
      { projectId: project.id, milestone: 'Roof slab complete', amount: '2000000', status: 'INVOICED' },
      { projectId: project.id, milestone: 'Finishing & handover', amount: '4500000', status: 'PLANNED' },
    ],
  });

  // Delivery items.
  await prisma.deliveryItem.deleteMany({ where: { projectId: project.id } });
  await prisma.deliveryItem.createMany({
    data: [
      { projectId: project.id, name: 'Cement (UltraTech OPC 53)', quantity: 200, unit: 'bags', status: 'DELIVERED' },
      { projectId: project.id, name: 'TMT Steel Bars', quantity: 5, unit: 'tonnes', status: 'IN_TRANSIT' },
      { projectId: project.id, name: 'Vitrified Floor Tiles', quantity: 1200, unit: 'sqft', status: 'ORDERED' },
    ],
  });

  console.log('✅ Seed complete.');
  console.log(`✅ Demo login password for every account: ${DEMO_PASSWORD}`);
  console.log('✅ Accounts:', USER_SEED.map((u) => u.email).join(', '));
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
