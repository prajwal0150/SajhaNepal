import { useEffect, useState } from 'react';
import type { Donation } from '@shared/types';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { formatDate } from '@shared/utils/format';

export function DonationsPage() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Donation[]>>('/donations?limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }
  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;
  return <div className="p-6"><h1 className="text-2xl font-bold text-ink mb-4">Donations</h1>
    {items.length === 0 ? <EmptyState title="No donations" /> : (
      <div className="space-y-3">{items.map((d) => <Card key={d._id} className="p-3"><div><span className="font-medium">{d.amountNPR} NPR</span> · {d.status} · {formatDate(d.createdAt)}</div></Card>)}</div>
    )}</div>;
}
