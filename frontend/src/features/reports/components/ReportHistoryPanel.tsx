import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton, EmptyState } from '@shared/components/Card';
import { fetchVerificationsForReport, fetchDeliveriesForReport } from '../services/reportHistoryService';
import { formatDate } from '@shared/utils/format';

interface HistoryItem {
  type: 'verification' | 'delivery';
  data: Record<string, unknown>;
  createdAt: string;
}

export function ReportHistoryPanel({ reportId }: { reportId: string }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchVerificationsForReport(reportId),
      fetchDeliveriesForReport(reportId),
    ]).then(([verifications, deliveries]) => {
      const all: HistoryItem[] = [
        ...(Array.isArray(verifications) ? verifications : []).map((v) => ({
          type: 'verification' as const,
          data: v as unknown as Record<string, unknown>,
          createdAt: (v as unknown as Record<string, unknown>).createdAt as string,
        })),
        ...(Array.isArray(deliveries) ? deliveries : []).map((d) => ({
          type: 'delivery' as const,
          data: d as unknown as Record<string, unknown>,
          createdAt: (d as unknown as Record<string, unknown>).createdAt as string,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(all);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [reportId]);

  if (loading) return <Card className="p-5"><LoadingSkeleton rows={2} /></Card>;
  if (history.length === 0) return <Card className="p-5"><EmptyState title="No history yet" description="This report has no verifications or deliveries recorded." /></Card>;

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold text-ink mb-3">History</h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map((h, i) => (
          <div key={i} className="border-b border-ink/5 pb-2 last:border-0">
            <span className="text-xs font-medium uppercase text-muted">{h.type}</span>
            <p className="text-sm text-ink">{formatDate(h.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
