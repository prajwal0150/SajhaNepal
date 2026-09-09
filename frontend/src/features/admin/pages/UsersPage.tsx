import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export function UsersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/admin/users?limit=50');
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
      <h1 className="text-2xl font-bold text-ink mb-4">Users</h1>
      {items.length === 0 ? <EmptyState title="No users" /> : (
        <div className="space-y-3">
          {items.map((u, i) => (
            <Card key={String((u as Record<string, unknown>)._id ?? i)} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{u.fullName as string}</h3>
                  <p className="text-xs text-muted">{u.email as string} · {u.phone as string ?? ''}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted">{u.role as string}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
