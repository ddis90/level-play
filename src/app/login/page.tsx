import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { LoginForm } from '@/components/LoginForm';

export const metadata = { title: 'Login — Levelplay Portal' };

export default function LoginPage() {
  // Already signed in? Go straight to the portal.
  if (getSessionUser()) redirect('/portal');

  return (
    <div className="center-screen">
      <div className="form-card">
        <Link href="/" className="brand" style={{ color: 'var(--navy)', marginBottom: '1.2rem' }}>
          <span className="mark">LP</span>
          <span>Levelplay Portal</span>
        </Link>
        <h2 style={{ fontSize: '1.4rem' }}>Sign in</h2>
        <p className="muted" style={{ marginTop: 0 }}>Access your projects, drawings and payments.</p>
        <LoginForm />

        <details style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--slate)', fontWeight: 600 }}>
            Demo accounts (POC)
          </summary>
          <div className="muted" style={{ marginTop: '0.6rem', lineHeight: 1.8 }}>
            Password for all: <strong>Passw0rd!</strong><br />
            client@demo.test · admin@demo.test · projectadmin@demo.test<br />
            engineer@demo.test · architect@demo.test · worker@demo.test
          </div>
        </details>
      </div>
    </div>
  );
}
