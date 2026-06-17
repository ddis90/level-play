import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isStaff, isAdmin, visibleLevelsFor } from '@/lib/rbac';
import { UploadForm } from '@/components/UploadForm';

export const dynamic = 'force-dynamic';

const VIS_LABEL: Record<string, { text: string; bg: string; fg: string }> = {
  CLIENT_VISIBLE: { text: 'Client-visible', bg: '#e0f2f1', fg: '#2a9d8f' },
  INTERNAL: { text: 'Internal', bg: '#e8eaf6', fg: '#5c6bc0' },
  ADMIN_ONLY: { text: 'Admin only', bg: '#fdecea', fg: '#e63946' },
};

const PAY_BADGE: Record<string, string> = {
  PAID: 'badge-done', INVOICED: 'badge-progress', PLANNED: 'badge-design', OVERDUE: 'badge-progress',
};

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const user = getSessionUser()!;
  const staff = isStaff(user.roles);
  const admin = isAdmin(user.roles);

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { user: true } },
      payments: { orderBy: { createdAt: 'asc' } },
      items: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!project) notFound();

  // Access control: a client may only open a project they belong to.
  const isMember = project.members.some((m) => m.userId === user.id);
  if (!staff && !isMember) notFound();

  // THE VISIBILITY RULE: documents are filtered by what this role may see.
  const allowed = visibleLevelsFor(user.roles);
  const documents = await prisma.document.findMany({
    where: { projectId: project.id, visibility: { in: allowed } },
    include: { uploadedBy: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <Link href="/portal/projects" className="muted" style={{ fontSize: '0.9rem' }}>← Back to projects</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{project.name}</h1>
          <p className="muted" style={{ margin: 0 }}>{project.code} · {project.city || '—'} · {project.status.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Documents — the visibility showcase */}
      <section style={{ padding: '1.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Documents &amp; Media</h2>
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            You can see: {allowed.map((a) => VIS_LABEL[a].text).join(', ')}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="card" style={{ marginTop: '1rem' }}><p className="muted" style={{ margin: 0 }}>No documents visible to you yet.</p></div>
        ) : (
          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            {documents.map((d) => {
              const v = VIS_LABEL[d.visibility];
              return (
                <div key={d.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '0.5rem' }}>
                    <span className="badge" style={{ background: v.bg, color: v.fg }}>{v.text}</span>
                    <span className="muted" style={{ fontSize: '0.72rem' }}>{d.kind.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginTop: '0.7rem' }}>{d.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
                    Uploaded by {d.uploadedBy.fullName}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload — visibility options depend on the uploader's role */}
        <div style={{ marginTop: '1.5rem' }}>
          <UploadForm projectId={project.id} roles={user.roles} />
        </div>
      </section>

      {/* Payments — transparency */}
      <section style={{ padding: '0.5rem 0' }}>
        <h2 style={{ fontSize: '1.3rem' }}>Payment Schedule</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--mist)', textAlign: 'left' }}>
                <th style={th}>Milestone</th><th style={th}>Amount (₹)</th><th style={th}>Status</th><th style={th}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {project.payments.map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={td}>{p.milestone}</td>
                  <td style={td}>{Number(p.amount).toLocaleString('en-IN')}</td>
                  <td style={td}><span className={`badge ${PAY_BADGE[p.status]}`}>{p.status}</span></td>
                  <td style={{ ...td, color: 'var(--slate)' }}>{p.reference || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Deliveries */}
      <section style={{ padding: '1rem 0 2rem' }}>
        <h2 style={{ fontSize: '1.3rem' }}>Material Deliveries</h2>
        <div className="grid grid-3">
          {project.items.map((it) => (
            <div key={it.id} className="card">
              <h3 style={{ fontSize: '1rem' }}>{it.name}</h3>
              <p className="muted" style={{ margin: '0 0 0.4rem' }}>{it.quantity} {it.unit || ''}</p>
              <span className={`badge ${it.status === 'DELIVERED' ? 'badge-done' : 'badge-progress'}`}>
                {it.status.replace('_', ' ')}
              </span>
            </div>
          ))}
          {project.items.length === 0 && <p className="muted">No deliveries logged.</p>}
        </div>
      </section>

      {admin && (
        <p className="muted" style={{ fontSize: '0.82rem' }}>
          Team: {project.members.map((m) => `${m.user.fullName} (${m.role.replace('_', ' ')})`).join(', ')}
        </p>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.7rem 1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.03em' };
const td: React.CSSProperties = { padding: '0.7rem 1rem', fontSize: '0.92rem' };
