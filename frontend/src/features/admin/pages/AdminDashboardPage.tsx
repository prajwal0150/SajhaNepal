import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/admin/dashboard-stats');
      setStats(data.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-6">Admin Dashboard</h1>
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Stat value={stats.totalReports} label="Total Reports" color="bg-primary/10 text-primary" />
          <Stat value={stats.pending} label="Pending" color="bg-warning/10 text-warning" />
          <Stat value={stats.verified} label="Verified" color="bg-primary/10 text-primary" />
          <Stat value={stats.resolved} label="Resolved" color="bg-success/10 text-success" />
          <Stat value={stats.critical} label="Critical" color="bg-critical/10 text-critical" />
          <Stat value={stats.organizations} label="Organizations" />
          <Stat value={stats.volunteers} label="Volunteers" />
          <Stat value={stats.shelters} label="Shelters" />
          <Stat value={stats.inventoryItems} label="Inventory Items" />
        </div>
      )}
    </div>
  );
}

function Stat({ value, label, color = 'bg-ink/5 text-ink' }: { value: unknown; label: string; color?: string }) {
  return (
    <Card className="p-4">
      <div className={`rounded-lg ${color} p-3 text-center`}>
        <div className="text-2xl font-bold">{value as React.ReactNode}</div>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </Card>
  );
}
