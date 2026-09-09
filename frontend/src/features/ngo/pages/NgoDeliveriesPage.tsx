import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { Delivery } from '@shared/types';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { fetchMyDeliveriesThunk } from '@features/deliveries/redux/deliverySlice';
import { formatDate } from '@shared/utils/format';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function NgoDeliveriesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.deliveries.items,
    loading: s.deliveries.loading,
    error: s.deliveries.error,
  }));

  useEffect(() => { dispatch(fetchMyDeliveriesThunk()); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchMyDeliveriesThunk())} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">My Deliveries</h1>
      {items.length === 0 ? (
        <EmptyState title="No deliveries" description="No deliveries recorded yet." />
      ) : (
        <div className="space-y-4">
          {items.map((d: Delivery) => (
            <Card key={d._id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink">Report: {typeof d.report === 'object' ? (d.report as { title?: string }).title ?? 'Unknown' : d.report}</h3>
                  <p className="text-sm text-muted">Delivered: {d.quantityDelivered} units · Recipients: {d.recipientCount}</p>
                  <p className="text-xs text-muted">{formatDate(d.deliveredAt)}</p>
                </div>
                {d.proofImages?.length > 0 && (
                  <div className="flex gap-1">
                    {d.proofImages.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} alt="proof" className="h-12 w-12 rounded object-cover" loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
