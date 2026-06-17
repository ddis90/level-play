'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button onClick={logout} className="btn"
      style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--white)', width: '100%',
        justifyContent: 'center', padding: '0.55rem', fontSize: '0.9rem' }}>
      Sign out
    </button>
  );
}
