import type { Report, NeedType } from '@shared/types';
import { Card, Badge, StatusBadge, UrgencyBadge } from '@shared/components/Card';
import { Link } from 'react-router-dom';
import { NEED_TYPE_META } from '@shared/constants';
import { Users, MapPin, ImageIcon } from 'lucide-react';
import { timeAgo } from '@shared/utils/format';

export function ReportCard({ report }: { report: Report }) {
  const meta = NEED_TYPE_META[report.needType as NeedType] ?? NEED_TYPE_META.OTHER;
  return (
    <Card as="article" className="group overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
      <Link to={`/reports/${report._id}`} className="block">
        <div className="flex items-start gap-3 p-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl ${meta.color}`} aria-hidden>
            {meta.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <UrgencyBadge urgency={report.urgency} />
              <StatusBadge status={report.status} />
              {report.deliveredQuantity !== undefined && report.requiredQuantity > 0 && report.status !== 'RESOLVED' && (
                <Badge className="border-secondary/30 bg-secondary/10 text-secondary">
                  {Math.min(100, Math.round((report.deliveredQuantity / report.requiredQuantity) * 100))}% delivered
                </Badge>
              )}
            </div>
            <h3 className="mt-1.5 line-clamp-1 font-semibold text-ink group-hover:text-primary">{report.title}</h3>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted">{report.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden />{report.district}{report.ward ? ` · Ward ${report.ward}` : ''}</span>
              {report.affectedPeople > 1 && (
                <span className="inline-flex items-center gap-1"><Users size={12} aria-hidden />{report.affectedPeople} affected</span>
              )}
              {report.images?.length > 0 && (
                <span className="inline-flex items-center gap-1"><ImageIcon size={12} aria-hidden />{report.images.length} photo{report.images.length > 1 ? 's' : ''}</span>
              )}
              <span className="ml-auto">{timeAgo(report.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
