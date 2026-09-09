import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { formatDate } from '@shared/utils/format';

export function AuditLogsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/admin/audit-logs?limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }
  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} />;
  return <div className="p-6"><h1 className="text-2xl font-bold text-ink mb-4">Audit Logs</h1>
    {items.length === 0 ? <EmptyState title="No audit logs" /> : (
      <div className="space-y-3">{items.map((a, i) => <Card key={i} className="p-3"><div><span className="font-medium text-xs uppercase text-muted">{a.action as string}</span><p className="text-sm text-ink">{a.entityType as string}</p><p className="text-xs text-muted">{formatDate(a.createdAt as string)}</p></div></Card>)}</div>
    )}</div>;
}
