import { useEffect, useState } from 'react';
import type { Report } from '@shared/types';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { formatDate } from '@shared/utils/format';

export function AdminReportsPage() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Report[]>>('/admin/reports?limit=50');
      setItems(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">All Reports (Admin)</h1>
      {items.length === 0 ? <EmptyState title="No reports" /> : (
        <div className="space-y-3">
          {items.map((r) => (
            <Card key={r._id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{r.title}</h3>
                  <p className="text-xs text-muted">{r.district} · {formatDate(r.createdAt)}</p>
                </div>
                <span className="text-xs text-muted">{r.status} · {r.urgency}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
