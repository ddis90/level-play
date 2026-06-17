'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RoleName } from '@prisma/client';
import { assignableLevelsFor } from '@/lib/rbac';

const KINDS = [
  'FLOOR_PLAN', 'ELECTRICAL_DRAWING', 'PLUMBING_DRAWING', 'STRUCTURAL_DRAWING',
  'SITE_PHOTO', 'PROGRESS_VIDEO', 'CONTRACT', 'INVOICE', 'SUGGESTION', 'OTHER',
];

const VIS_TEXT: Record<string, string> = {
  CLIENT_VISIBLE: 'Client-visible (everyone on the project)',
  INTERNAL: 'Internal (staff only)',
  ADMIN_ONLY: 'Admin only',
};

export function UploadForm({ projectId, roles }: { projectId: string; roles: RoleName[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // The visibility levels this user is ALLOWED to assign (mirrors server check).
  const levels = assignableLevelsFor(roles);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.get('title'),
          kind: form.get('kind'),
          visibility: form.get('visibility'),
          fileUrl: form.get('fileUrl') || '/uploads/demo/placeholder.pdf',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        setLoading(false);
        return;
      }
      (e.target as HTMLFormElement).reset();
      setOpen(false);
      setLoading(false);
      router.refresh();
    } catch {
      setError('Network error.');
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button className="btn btn-dark" onClick={() => setOpen(true)}>
        + Add document / media
      </button>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h3 style={{ fontSize: '1.05rem' }}>Add document / media</h3>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required placeholder="e.g. Ground floor plan v3" />
        </div>
        <div className="grid grid-2" style={{ gap: '1rem' }}>
          <div className="field">
            <label htmlFor="kind">Type</label>
            <select id="kind" name="kind" defaultValue="OTHER">
              {KINDS.map((k) => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="visibility">Visibility</label>
            <select id="visibility" name="visibility" defaultValue={levels[0]}>
              {levels.map((v) => <option key={v} value={v}>{VIS_TEXT[v]}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="fileUrl">File reference (URL/path)</label>
          <input id="fileUrl" name="fileUrl" placeholder="/uploads/demo/file.pdf (POC)" />
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="btn btn-light" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
