import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import { Calendar } from 'lucide-react';
import { Card, StatusBadge, UrgencyBadge, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { NEED_TYPE_META } from '@shared/constants';
import { NgoClaimPanel } from '../components/NgoClaimPanel';
import { NgoDeliveryPanel } from '../components/NgoDeliveryPanel';
import { ReportHistoryPanel } from '../components/ReportHistoryPanel';
import { VerificationPanel } from '../components/VerificationPanel';
import { clearSelectedReport } from '../redux/reportSlice';
import { fetchMyOrganizationsThunk } from '@features/organizations/redux/organizationSlice';
import { fetchReportByIdThunk } from '../redux/reportThunk';
import { formatDate } from '@shared/utils/format';
import { useAuth } from '@features/auth/hooks/useAuth';
import { useParams } from 'react-router-dom';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { role } = useAuth();
  const report = useAppSelector((s) => s.reports.selected);
  const loading = useAppSelector((s) => s.reports.loading);
  const error = useAppSelector((s) => s.reports.error);
  const myOrgs = useAppSelector((s) => s.organizations.myOrganizations);

  useEffect(() => {
    if (id) dispatch(fetchReportByIdThunk(id));
    return () => { dispatch(clearSelectedReport()); };
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchMyOrganizationsThunk());
  }, [dispatch]);

  const refresh = () => { if (id) dispatch(fetchReportByIdThunk(id)); };

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-8"><LoadingSkeleton rows={6} /></div>;
  if (error) return <div className="mx-auto max-w-5xl px-4 py-8"><ErrorState message={error} onRetry={refresh} /></div>;
  if (!report) return <div className="mx-auto max-w-5xl px-4 py-8"><EmptyState title="Report not found" description="This report does not exist or has been removed." /></div>;

  const meta = NEED_TYPE_META[report.needType as keyof typeof NEED_TYPE_META] ?? NEED_TYPE_META.OTHER;
  const ownerOrgs = myOrgs.filter((o) => String(report.claimedBy) === o._id || report.status === 'VERIFIED');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{report.title}</h1>
          <p className="text-sm text-muted">{report.district}{report.ward ? ` · Ward ${report.ward}` : ''} · <Calendar size={12} className="inline" /> {formatDate(report.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <UrgencyBadge urgency={report.urgency} />
          <StatusBadge status={report.status} />
        </div>
      </div>

      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${meta.color}`} aria-hidden>{meta.emoji}</div>
          <span className="text-sm font-medium text-muted">{meta.en} / {meta.ne}</span>
        </div>
        <p className="text-ink">{report.description}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <p><span className="font-medium text-muted">People affected:</span> {report.affectedPeople}</p>
          <p><span className="font-medium text-muted">Required:</span> {report.requiredQuantity} {report.quantityUnit}</p>
          {(report.deliveredQuantity ?? 0) > 0 && (
            <p><span className="font-medium text-muted">Delivered:</span> {report.deliveredQuantity} {report.quantityUnit}</p>
          )}
          <p><span className="font-medium text-muted">Source:</span> {report.source}</p>
        </div>

        {report.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {report.images.map((img, i) => (
              <img key={i} src={img} alt={`Report image ${i + 1}`} className="h-24 w-full rounded-lg object-cover" loading="lazy" />
            ))}
          </div>
        )}
      </Card>

      {role === 'VOLUNTEER' && report.status === 'PENDING' && (
        <VerificationPanel reportId={report._id} onComplete={refresh} />
      )}

      {role === 'NGO' && report.status === 'VERIFIED' && myOrgs.length > 0 && (
        <NgoClaimPanel report={report} orgs={myOrgs} onComplete={refresh} />
      )}

      {role === 'NGO' && ['CLAIMED', 'IN_PROGRESS'].includes(report.status) && (
        <NgoDeliveryPanel report={report} orgs={ownerOrgs.length > 0 ? ownerOrgs : myOrgs} onComplete={refresh} />
      )}

      <ReportHistoryPanel reportId={report._id} />
    </div>
  );
}
