import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export function ClaimsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/claims/mine?limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }
  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;
  return <div className="p-6"><h1 className="text-2xl font-bold text-ink mb-4">Claims</h1>
    {items.length === 0 ? <EmptyState title="No claims" /> : (
      <div className="space-y-3">{items.slice(0, 50).map((c, i) => <Card key={i} className="p-3"><p className="text-sm">{JSON.stringify(c).slice(0, 100)}…</p></Card>)}</div>
    )}</div>;
}
