import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isStaff } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

const STATUS_BADGE: Record<string, string> = {
  LEAD: 'badge-design',
  ONBOARDING: 'badge-design',
  DESIGN: 'badge-design',
  IN_PROGRESS: 'badge-progress',
  ON_HOLD: 'badge-progress',
  HANDOVER: 'badge-progress',
  COMPLETED: 'badge-done',
};

export default async function ProjectsPage() {
  const user = getSessionUser()!;
  const staff = isStaff(user.roles);

  // Clients see only their projects; staff see all non-lead projects.
  const projects = await prisma.project.findMany({
    where: staff
      ? { status: { not: 'LEAD' } }
      : { members: { some: { userId: user.id } } },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { documents: true, payments: true } } },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem' }}>Projects</h1>
      <p className="muted">
        {staff ? 'All active projects.' : 'Projects you are part of.'}
      </p>

      {projects.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>No projects yet.</p></div>
      ) : (
        <div className="grid grid-3" style={{ marginTop: '1.5rem' }}>
          {projects.map((p) => (
            <Link key={p.id} href={`/portal/projects/${p.id}`} className="card project-card">
              <div className="thumb">{p.code}</div>
              <div className="body">
                <span className={`badge ${STATUS_BADGE[p.status] || 'badge-design'}`}>
                  {p.status.replace('_', ' ')}
                </span>
                <h3 style={{ marginTop: '0.7rem', fontSize: '1.05rem' }}>{p.name}</h3>
                <p className="muted" style={{ margin: '0 0 0.5rem' }}>{p.city || '—'}</p>
                <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                  {p._count.documents} documents · {p._count.payments} payments
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
