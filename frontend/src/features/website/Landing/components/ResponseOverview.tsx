import type { LandingStats } from '../types/landingTypes';
import { Cross, Droplet, Home, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResponseOverview({ stats, isDemo }: { stats: LandingStats | null; isDemo: boolean }) {
  const s = stats ?? { criticalNeeds: 12, verifiedNeeds: 28, activeResponses: 5, availableShelters: 8 };
  const cards = [
    { icon: TriangleAlert, value: s.criticalNeeds, label: 'Critical needs', tint: 'bg-critical/10 text-critical' },
    { icon: Droplet, value: s.verifiedNeeds, label: 'Verified needs', tint: 'bg-primary/10 text-primary' },
    { icon: Cross, value: s.activeResponses, label: 'Active responses', tint: 'bg-success/10 text-success' },
    { icon: Home, value: s.availableShelters, label: 'Available shelters', tint: 'bg-tertiary/10 text-tertiary' },
  ];
  return (
    <aside className="rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
      <h3 className="text-[13px] font-bold text-ink">Live response overview <span className="font-medium text-muted">(Demo data)</span></h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-ink/10 bg-white p-2.5 text-center transition hover:shadow-sm">
            <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${c.tint}`}>
              <c.icon size={16} aria-hidden />
            </span>
            <p className="mt-1 text-lg font-extrabold leading-none text-ink">{c.value}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-muted">{c.label}</p>
          </div>
        ))}
      </div>
      {isDemo && <p className="mt-2 rounded-lg bg-white/70 px-2 py-1.5 text-[11px] text-muted">Showing demo figures until the backend is connected.</p>}
      <Link to="/map" className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-xs font-bold text-white hover:bg-primary-dark">
        Explore the live map
      </Link>
    </aside>
  );
}
