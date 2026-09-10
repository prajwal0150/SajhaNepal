import { useEffect, useMemo } from 'react';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import '@shared/lib/leafletGlobal'; // installs global `L` for the legacy plugin — must precede its JS import
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report, NeedType, Urgency } from '@shared/types';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { NEED_TYPE_META } from '@shared/constants';
import { TILE_URL, NEPAL_CENTER } from '@shared/utils/format';

const urgencyColor: Record<Urgency, string> = {
  CRITICAL: '#DC2626',
  HIGH: '#F59E0B',
  MEDIUM: '#2563EB',
  LOW: '#16A34A',
};

function makeIcon(report: Report): L.DivIcon {
  const color = urgencyColor[report.urgency] ?? '#2563EB';
  const emoji = NEED_TYPE_META[report.needType as NeedType]?.emoji ?? '📍';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:30px;height:30px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 0 3px rgba(255,255,255,0.85);border:2px solid #fff">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

/** Marker clustering layer built directly on leaflet.markercluster (React 19-safe). */
function ClusterLayer({ reports }: { reports: Report[] }) {
  const map = useMap();

  const group = useMemo(() => {
    return (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
    });
  }, []);

  useEffect(() => {
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, group]);

  useEffect(() => {
    group.clearLayers();
    reports.forEach((r) => {
      if (!r.location?.coordinates) return;
      const [lng, lat] = r.location.coordinates;
      const marker = L.marker([lat, lng], { icon: makeIcon(r) });
      const org = typeof r.claimedBy === 'object' && r.claimedBy ? (r.claimedBy as { name?: string }).name : null;
      marker.bindPopup(`
        <div style="min-width:180px">
          <strong>${r.title}</strong><br/>
          <span style="color:#64748b;font-size:12px">${NEED_TYPE_META[r.needType as NeedType]?.en ?? r.needType} · ${r.urgency} · ${r.status}</span><br/>
          <span style="font-size:12px">${r.district}${r.ward ? `, Ward ${r.ward}` : ''}</span>
          ${org ? `<br/><span style="font-size:12px;color:#0F766E">Claimed by ${org}</span>` : ''}
          <br/><a href="/reports/${r._id}" style="color:#2563EB;font-size:12px">View details →</a>
        </div>
      `);
      group.addLayer(marker);
    });
  }, [reports, group]);

  return null;
}

function Recenter({ lat, lng, radiusKm }: { lat: number; lng: number; radiusKm: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 11));
  }, [lat, lng, map]);
  return <Circle center={[lat, lng]} radius={radiusKm * 1000} pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.05, weight: 1 }} />;
}

export function LiveMap({ reports, center, radiusKm, showRadius, onRetryGeolocate }: {
  reports: Report[];
  center?: { lat: number; lng: number } | null;
  radiusKm?: number;
  showRadius?: boolean;
  onRetryGeolocate?: () => void;
}) {
  const initial: [number, number] = center ? [center.lat, center.lng] : NEPAL_CENTER;
  const zoom = center ? 12 : 7;

  return (
    <div className="relative h-full w-full" role="application" aria-label="Live needs map">
      <MapContainer center={initial} zoom={zoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer url={TILE_URL} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <ClusterLayer reports={reports} />
        {center && showRadius && radiusKm && <Recenter lat={center.lat} lng={center.lng} radiusKm={radiusKm} />}
      </MapContainer>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-ink/10 bg-white/95 px-3 py-2 text-xs">
        <p className="mb-1 font-semibold text-ink">Urgency</p>
        <div className="flex flex-col gap-1">
          {(Object.keys(urgencyColor) as Urgency[]).map((u) => (
            <span key={u} className="flex items-center gap-2 text-muted">
              <span className="h-3 w-3 rounded-full" style={{ background: urgencyColor[u] }} aria-hidden />
              {u}
            </span>
          ))}
        </div>
        {onRetryGeolocate && (
          <button onClick={onRetryGeolocate} className="pointer-events-auto mt-2 font-medium text-primary hover:underline">
            Locate me
          </button>
        )}
      </div>
    </div>
  );
}

export function MapLink({ id }: { id: string }) {
  return <Link to={`/reports/${id}`} className="text-sm font-medium text-primary hover:underline">View details</Link>;
}
