import { useEffect, useState } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/Store';
import type { NeedType, Urgency } from '@shared/types';
import { Card, StatusBadge, UrgencyBadge } from '@shared/components/Card';
import { Crosshair, Search } from 'lucide-react';
import { LiveMap } from '../components/LiveMap';
import { NEED_TYPES, NEED_TYPE_META, PROVINCES, URGENCY_LEVELS } from '@shared/constants';
import { Select } from '@shared/components/Fields';
import { fetchNearbyThunk } from '@features/reports/redux/reportThunk';
import { selectNearbyReports } from '@features/reports/redux/reportSelector';
import { timeAgo } from '@shared/utils/format';

type Province = (typeof PROVINCES)[number];

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function MapPage() {
  const dispatch = useDispatch<AppDispatch>();
  const reports = useAppSelector(selectNearbyReports);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(25);
  const [needType, setNeedType] = useState<NeedType | ''>('');
  const [urgency, setUrgency] = useState<Urgency | ''>('');
  const [province, setProvince] = useState<Province | ''>('');
  const [selected, setSelected] = useState<string | null>(null);

  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => undefined,
      { timeout: 8000 },
    );
  }

  useEffect(() => {
    locate();
  }, []);

  useEffect(() => {
    dispatch(
      fetchNearbyThunk({
        lat: center?.lat ?? 28.3949,
        lng: center?.lng ?? 84.124,
        radiusKm: center ? radiusKm : 500,
      }),
    );
  }, [dispatch, center, radiusKm]);

  const filtered = reports.filter((r) =>
    (!needType || r.needType === needType) &&
    (!urgency || r.urgency === urgency) &&
    (!province || r.province === province),
  );
  const selectedReport = filtered.find((r) => r._id === selected) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Live Relief Map</h1>
          <p className="text-sm text-muted">
            {filtered.length} need{filtered.length === 1 ? '' : 's'} visible · click a marker for details
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={locate}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium hover:bg-surface"
          >
            <Crosshair size={15} aria-hidden /> Locate me
          </button>
          <Select aria-label="Filter by need type" className="w-40" value={needType} onChange={(e) => setNeedType(e.target.value as NeedType | '')}>
            <option value="">All types</option>
            {NEED_TYPES.map((t) => (
              <option key={t} value={t}>{NEED_TYPE_META[t as NeedType].emoji} {NEED_TYPE_META[t as NeedType].en}</option>
            ))}
          </Select>
          <Select aria-label="Filter by urgency" className="w-36" value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency | '')}>
            <option value="">All urgency</option>
            {URGENCY_LEVELS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
          <Select aria-label="Filter by province" className="w-36" value={province} onChange={(e) => setProvince(e.target.value as Province | '')}>
            <option value="">All provinces</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Select aria-label="Search radius" className="w-32" value={String(radiusKm)} onChange={(e) => setRadiusKm(Number(e.target.value))}>
            {[5, 10, 25, 50, 100].map((r) => (
              <option key={r} value={r}>{r} km</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="h-[70vh] min-h-96 overflow-hidden p-0">
          <LiveMap reports={filtered} center={center} radiusKm={radiusKm} showRadius onRetryGeolocate={locate} />
        </Card>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <Card className="p-6 text-center text-sm text-muted">
              <Search className="mx-auto mb-2" size={22} aria-hidden />
              No needs in this area. Widen the radius or check back later.
            </Card>
          )}
          {filtered.slice(0, 30).map((r) => (
            <button
              key={r._id}
              onClick={() => setSelected(r._id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                selected === r._id ? 'border-primary bg-primary/5' : 'border-ink/10 bg-white hover:border-primary/40'
              }`}
            >
              <p className="line-clamp-1 text-sm font-semibold text-ink">{r.title}</p>
              <p className="mt-0.5 text-xs text-muted">
                {NEED_TYPE_META[r.needType as NeedType]?.en} · {r.district}{r.ward ? `, Ward ${r.ward}` : ''} · {timeAgo(r.createdAt)}
              </p>
              <div className="mt-1.5 flex gap-1.5">
                <UrgencyBadge urgency={r.urgency} />
                <StatusBadge status={r.status} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedReport && (
        <Card className="mt-4 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-ink">{selectedReport.title}</h2>
              <p className="text-sm text-muted">{selectedReport.description}</p>
            </div>
            <a href={`/reports/${selectedReport._id}`} className="text-sm font-medium text-primary hover:underline">
              Open full details →
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}