import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isStaff, isAdmin, ROLE_LABELS } from '@/lib/rbac';
import type { RoleName } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = getSessionUser()!;
  const staff = isStaff(user.roles);
  const admin = isAdmin(user.roles);

  // Clients see only projects they're a member of; staff see all.
  const projectWhere = staff
    ? {}
    : { members: { some: { userId: user.id } } };

  const [projectCount, leadCount, paymentsAgg] = await Promise.all([
    prisma.project.count({ where: { ...projectWhere, status: { not: 'LEAD' } } }),
    staff ? prisma.project.count({ where: { status: 'LEAD' } }) : Promise.resolve(0),
    prisma.payment.aggregate({
      where: { status: 'PAID', project: projectWhere },
      _sum: { amount: true },
    }),
  ]);

  const paidTotal = paymentsAgg._sum.amount?.toString() ?? '0';

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem' }}>Welcome, {user.fullName.split(' ')[0]}</h1>
      <p className="muted">
        You are signed in as {user.roles.map((r: RoleName) => ROLE_LABELS[r]).join(', ')}.
        {staff ? ' You can see all projects.' : ' Here are your projects.'}
      </p>

      <div className="grid grid-3" style={{ margin: '1.5rem 0 2rem' }}>
        <StatCard label="Active Projects" value={projectCount} />
        {staff && <StatCard label="New Leads" value={leadCount} accent />}
        <StatCard label="Payments Recorded (₹)" value={Number(paidTotal).toLocaleString('en-IN')} />
      </div>

      <div className="card">
        <h3>Quick start</h3>
        <p className="muted">What you can do from here:</p>
        <ul className="muted" style={{ lineHeight: 1.9 }}>
          <li><Link href="/portal/projects" style={{ color: 'var(--amber-strong)', fontWeight: 600 }}>Browse projects</Link> — open one to see drawings, payments, deliveries and progress.</li>
          {staff && <li><Link href="/portal/leads" style={{ color: 'var(--amber-strong)', fontWeight: 600 }}>Review leads</Link> from the website onboarding form.</li>}
          <li>Documents respect <strong>visibility rules</strong>: {admin
            ? 'as an admin you see client-visible, internal and admin-only items.'
            : staff
              ? 'as staff you see client-visible and internal items.'
              : 'as a client you see only items shared with you.'}</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="card" style={{ borderTop: `4px solid ${accent ? 'var(--amber-strong)' : 'var(--slate)'}` }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--navy)' }}>{value}</div>
      <div className="muted" style={{ fontWeight: 600 }}>{label}</div>
    </div>
  );
}
