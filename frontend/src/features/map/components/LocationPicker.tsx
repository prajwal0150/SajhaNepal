import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { TILE_URL } from '@shared/utils/format';

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="background:#2563EB;color:#fff;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 4px rgba(37,99,235,0.2)">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickHandler({ onPick }: { onPick: (e: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ lat, lng, onPick }: {
  lat: number;
  lng: number;
  onPick: (e: { lat: number; lng: number }) => void;
}) {
  useEffect(() => {
    // trigger a resize after mount inside a lazy container
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <MapContainer center={[lat, lng]} zoom={lat === 28.3949 ? 7 : 14} className="h-full w-full" aria-label="Location picker map">
      <TileLayer url={TILE_URL} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
      <ClickHandler onPick={onPick} />
      <Marker position={[lat, lng]} icon={pinIcon} keyboard={false} />
    </MapContainer>
  );
}
