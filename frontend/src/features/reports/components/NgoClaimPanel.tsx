import { useState } from 'react';
import type { Report, Organization } from '@shared/types';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { claimReport } from '@features/claims/services/claimService';
import { pushToast } from '@shared/redux/toastSlice';

export function NgoClaimPanel({ report, orgs, onComplete }: {
  report: Report;
  orgs: Organization[];
  onComplete: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [orgId, setOrgId] = useState(orgs[0]?._id ?? '');
  const [notes, setNotes] = useState('');

  async function onClaim() {
    setSubmitting(true);
    try {
      await claimReport({ reportId: report._id, organizationId: orgId, notes });
      pushToast({ kind: 'success', message: 'Need claimed successfully!' });
      onComplete();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Claim failed';
      if (msg.toLowerCase().includes('claimed')) {
        pushToast({ kind: 'error', message: 'This need was just claimed by another organization.' });
      } else {
        pushToast({ kind: 'error', message: msg });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mb-6 p-5">
      <h2 className="text-lg font-semibold text-ink mb-3">NGO Claim</h2>
      <p className="mb-3 text-sm text-muted">Claim this need as your organization to begin response.</p>
      <select value={orgId} onChange={(e) => setOrgId(e.target.value)}
        className="mb-3 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm">
        {orgs.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
      </select>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes"
        className="mb-3 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm" rows={2} />
      <Button variant="critical" onClick={onClaim} loading={submitting} disabled={submitting}>
        {submitting ? 'Claiming…' : 'Claim this need'}
      </Button>
    </Card>
  );
}
