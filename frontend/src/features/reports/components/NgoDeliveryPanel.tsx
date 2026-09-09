import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/Store';
import type { Report, Organization } from '@shared/types';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { createDeliveryThunk } from '@features/deliveries/redux/deliverySlice';
import { pushToast } from '@shared/redux/toastSlice';

export function NgoDeliveryPanel({ report, orgs, onComplete }: {
  report: Report;
  orgs: Organization[];
  onComplete: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [recipientCount, setRecipientCount] = useState('');
  const [notes, setNotes] = useState('');
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [startLoading, setStartLoading] = useState(false);

  const orgId = orgs[0]?._id ?? '';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number(quantity) || Number(quantity) < 1) {
      pushToast({ kind: 'error', message: 'Please enter a valid quantity delivered' });
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(createDeliveryThunk({
        reportId: report._id,
        organizationId: orgId,
        quantityDelivered: Number(quantity),
        recipientCount: Number(recipientCount) || undefined,
        notes,
        proofImages: proofFiles,
      })).unwrap();
      pushToast({ kind: 'success', message: 'Delivery recorded. Report will update automatically.' });
      setQuantity(''); setRecipientCount(''); setNotes(''); setProofFiles([]);
      onComplete();
    } catch (err) {
      pushToast({ kind: 'error', message: err instanceof Error ? err.message : 'Delivery submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const onStartOperation = async () => {
    setStartLoading(true);
    try {
      const { startOperation } = await import('@features/claims/services/claimService');
      await startOperation(report._id);
      pushToast({ kind: 'success', message: 'Operation started.' });
      onComplete();
    } catch (err) {
      pushToast({ kind: 'error', message: err instanceof Error ? err.message : 'Failed to start operation' });
    } finally {
      setStartLoading(false);
    }
  };

  return (
    <Card className="mb-6 p-5">
      <h2 className="text-lg font-semibold text-ink mb-3">NGO Response</h2>
      {report.status === 'CLAIMED' && (
        <Button variant="success" onClick={onStartOperation} loading={startLoading} className="mb-4">
          Start operation
        </Button>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)}
            className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm" placeholder="Quantity delivered *" required />
          <input type="number" min={0} value={recipientCount} onChange={(e) => setRecipientCount(e.target.value)}
            className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm" placeholder="Recipient count" />
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => setProofFiles(Array.from(e.target.files ?? []).slice(0, 5))} className="text-sm file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white" />
        {proofFiles.length > 0 && <p className="text-xs text-muted">{proofFiles.length} proof photo(s) selected</p>}
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery notes"
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm" rows={3} />
        <Button variant="critical" type="submit" loading={submitting} disabled={submitting || Number(quantity) < 1}>
          {submitting ? 'Submitting…' : 'Submit delivery & resolve'}
        </Button>
      </form>
    </Card>
  );
}
