import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { ROLE_LABELS, isStaff, isAdmin } from '@/lib/rbac';
import { LogoutButton } from '@/components/LogoutButton';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) redirect('/login');

  const staff = isStaff(user.roles);
  const admin = isAdmin(user.roles);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 28px)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--navy)', color: 'var(--mist)',
        padding: '1.5rem 1rem', flexShrink: 0,
      }}>
        <Link href="/portal" className="brand" style={{ fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          <span className="mark">LP</span>
          <span>Portal</span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '1.5rem' }}>
          <PortalLink href="/portal" label="Dashboard" />
          <PortalLink href="/portal/projects" label="Projects" />
          {staff && <PortalLink href="/portal/leads" label="Leads / Onboarding" />}
        </nav>

        <div style={{ marginTop: 'auto', position: 'absolute', bottom: '1.5rem', width: 208 }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--steel)', marginBottom: '0.5rem' }}>
            Signed in as<br /><strong style={{ color: 'var(--white)' }}>{user.fullName}</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.8rem' }}>
            {user.roles.map((r) => (
              <span key={r} style={{
                fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                borderRadius: 999, background: admin ? 'var(--amber-strong)' : 'var(--slate)',
                color: 'var(--white)',
              }}>{ROLE_LABELS[r]}</span>
            ))}
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', background: 'var(--paper)', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

function PortalLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{
      padding: '0.6rem 0.8rem', borderRadius: 8, color: 'var(--mist)',
      fontWeight: 600, fontSize: '0.95rem',
    }}>
      {label}
    </Link>
  );
}
