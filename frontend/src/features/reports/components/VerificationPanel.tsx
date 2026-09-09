import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { pushToast } from '@shared/redux/toastSlice';
import { verifyReport } from '@features/verification/services/verificationService';

export function VerificationPanel({ reportId, onComplete }: { reportId: string; onComplete: () => void }) {
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<'VERIFIED' | 'REJECTED' | 'FLAGGED'>('VERIFIED');
  const [notes, setNotes] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyReport({ reportId, decision, notes });
      pushToast({ kind: 'success', message: `Report ${decision.toLowerCase()} successfully` });
      onComplete();
    } catch (err) {
      pushToast({ kind: 'error', message: err instanceof Error ? err.message : 'Verification failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6 p-5">
      <h2 className="text-lg font-semibold text-ink mb-3">Volunteer Verification</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setDecision('VERIFIED')}
            className={`px-3 py-1.5 text-sm rounded-lg border ${decision === 'VERIFIED' ? 'border-success bg-success/10 text-success' : 'border-ink/15'}`}>Verify</button>
          <button type="button" onClick={() => setDecision('REJECTED')}
            className={`px-3 py-1.5 text-sm rounded-lg border ${decision === 'REJECTED' ? 'border-critical bg-critical/10 text-critical' : 'border-ink/15'}`}>Reject</button>
          <button type="button" onClick={() => setDecision('FLAGGED')}
            className={`px-3 py-1.5 text-sm rounded-lg border ${decision === 'FLAGGED' ? 'border-warning bg-warning/10 text-warning' : 'border-ink/15'}`}>Flag</button>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)"
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm" rows={3} />
        <Button type="submit" loading={loading} variant={decision === 'REJECTED' ? 'critical' : 'success'}>
          {decision === 'VERIFIED' ? 'Verify report' : decision === 'REJECTED' ? 'Reject report' : 'Flag for review'}
        </Button>
      </form>
    </Card>
  );
}
