import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { formatDate } from '@shared/utils/format';

export function DeliveriesPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/admin/deliveries?limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }
  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} />;
  return <div className="p-6"><h1 className="text-2xl font-bold text-ink mb-4">Deliveries</h1>
    {items.length === 0 ? <EmptyState title="No deliveries" /> : (
      <div className="space-y-3">{items.map((d, i) => {
  const reportTitle = typeof d.report === 'object' ? (((d.report as Record<string, unknown>)?.title as string) ?? '') : String(d.report);
  return (
    <Card key={i} className="p-3">
      <div>
        <span className="font-medium">Report:</span> {reportTitle}
      </div>
      <p className="text-xs text-muted">{formatDate(d.deliveredAt as string)}</p>
    </Card>
  );
})}</div>
    )}</div>;
}
