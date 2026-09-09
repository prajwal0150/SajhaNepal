import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { ReliefSite } from '@shared/types';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { MapPin, Home } from 'lucide-react';
import { fetchReliefSitesThunk } from '@features/reliefSites/redux/reliefSiteSlice';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function SheltersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((s) => ({
    items: s.reliefSites.items,
    loading: s.reliefSites.loading,
    error: s.reliefSites.error,
  }));

  useEffect(() => { dispatch(fetchReliefSitesThunk({ siteType: 'SHELTER' })); }, [dispatch]);

  if (loading) return <LoadingSkeleton rows={5} />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchReliefSitesThunk({ siteType: 'SHELTER' }))} />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Shelters & Relief Sites</h1>
      {items.length === 0 ? (
        <EmptyState title="No shelters found" description="No shelter sites registered at this time." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((s: ReliefSite) => (
            <Card key={s._id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-ink flex items-center gap-2">
                    {s.siteType === 'SHELTER' ? <Home size={18} /> : <MapPin size={18} />} {s.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{s.district}{s.ward ? ` · Ward ${s.ward}` : ''}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium">Capacity:</span> {s.capacity}</p>
                    <p><span className="font-medium">Occupancy:</span> {s.currentOccupancy}</p>
                    {s.contact && <p><span className="font-medium">Contact:</span> {s.contact}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${s.status === 'FULL' ? 'text-critical' : s.status === 'CLOSED' ? 'text-muted' : 'text-success'}`}>{s.status}</span>
                  <p className="text-xs text-muted mt-1">{Math.max(0, s.capacity - s.currentOccupancy)} available</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
