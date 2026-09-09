import { ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaticNepalMap } from './StaticNepalMap';

export function LiveMapPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm lg:col-span-2">
      <div className="flex flex-wrap items-center gap-1.5 p-2">
        <label className="flex min-w-36 flex-1 items-center gap-1.5 rounded-lg border border-ink/15 px-2 py-1.5 text-xs">
          <MapPin size={13} className="shrink-0 text-muted" aria-hidden />
          <input placeholder="Search location…" className="w-full bg-transparent outline-none placeholder:text-muted/70" aria-label="Search location" />
        </label>
        {['Need Type', 'Urgency', 'District'].map((f) => (
          <button key={f} className="rounded-lg border border-ink/15 bg-white px-2 py-1.5 text-xs font-medium text-ink/70 hover:bg-surface">{f} ▾</button>
        ))}
        <span className="ml-auto hidden items-center gap-1 rounded-full border border-ink/10 px-2 py-1 text-[11px] text-muted sm:inline-flex">◎ Current Location</span>
      </div>
      <div className="relative">
        <StaticNepalMap tall />
        <Link to="/map" className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-primary-dark">
          <ExternalLink size={12} aria-hidden /> OPEN LIVE MAP
        </Link>
      </div>
    </div>
  );
}
