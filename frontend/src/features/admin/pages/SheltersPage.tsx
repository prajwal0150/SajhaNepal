import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export function SheltersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/relief-sites?siteType=SHELTER&limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }
  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;
  return <div className="p-6"><h1 className="text-2xl font-bold text-ink mb-4">Shelters</h1>
    {items.length === 0 ? <EmptyState title="No shelters" /> : (
      <div className="space-y-3">{items.map((s, i) => <Card key={String((s as Record<string, unknown>)._id ?? i)} className="p-3"><p className="text-sm font-medium">{(s as Record<string, unknown>).name as string}</p></Card>)}</div>
    )}</div>;
}
