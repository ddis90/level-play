import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isStaff } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

// Staff-only: leads captured from the public onboarding form (Project in LEAD status).
export default async function LeadsPage() {
  const user = getSessionUser()!;
  if (!isStaff(user.roles)) redirect('/portal');

  const leads = await prisma.project.findMany({
    where: { status: 'LEAD' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem' }}>Leads &amp; Onboarding</h1>
      <p className="muted">Enquiries submitted from the website. Convert qualified leads into client projects.</p>

      {leads.length === 0 ? (
        <div className="card"><p className="muted" style={{ margin: 0 }}>No new leads. Submissions from the public contact form appear here.</p></div>
      ) : (
        <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
          {leads.map((l) => (
            <div key={l.id} className="card">
              <span className="badge badge-design">New Lead</span>
              <h3 style={{ marginTop: '0.6rem', fontSize: '1.1rem' }}>{l.name}</h3>
              <p className="muted" style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', margin: '0 0 0.5rem' }}>
                {l.description}
              </p>
              <p className="muted" style={{ margin: 0, fontSize: '0.8rem' }}>
                {l.code} · {l.city || 'City not specified'} · {l.createdAt.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
