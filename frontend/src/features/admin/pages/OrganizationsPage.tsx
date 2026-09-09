import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export function OrganizationsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/organizations?limit=50');
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
      <h1 className="text-2xl font-bold text-ink mb-4">Organizations</h1>
      {items.length === 0 ? <EmptyState title="No organizations" /> : (
        <div className="space-y-3">
          {items.map((o, i) => (
            <Card key={String((o as Record<string, unknown>)._id ?? i)} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{(o as Record<string, unknown>).name as string}</h3>
                  <p className="text-xs text-muted">{(o as Record<string, unknown>).type as string} · {(o as Record<string, unknown>).district as string ?? ''}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${(o as Record<string, unknown>).verificationStatus === 'VERIFIED' ? 'text-success' : (o as Record<string, unknown>).verificationStatus === 'REJECTED' ? 'text-critical' : 'text-warning'}`}>{(o as Record<string, unknown>).verificationStatus as string}</span>
                  <p className="text-xs text-muted">Trust: {(o as Record<string, unknown>).trustScore as number}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
