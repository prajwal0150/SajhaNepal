import type { AboutStats } from '../types/aboutTypes';
import { Building, HandHelping, Handshake, HeartPulse, MapPinned } from 'lucide-react';

export function AboutStats({ stats }: { stats: AboutStats }) {
  const cards = [
    { icon: MapPinned, value: `${stats.provinces}`, label: 'Provinces reached', tint: 'bg-primary/10 text-primary' },
    { icon: Building, value: `${stats.districts}`, label: 'Districts reachable', tint: 'bg-tertiary/10 text-tertiary' },
    { icon: HandHelping, value: format(stats.volunteers), label: 'Volunteers registered', tint: 'bg-success/10 text-success' },
    { icon: HeartPulse, value: format(stats.needsResolved), label: 'Needs resolved', tint: 'bg-critical/10 text-critical' },
    { icon: Handshake, value: format(stats.partnerOrgs), label: 'Partner organizations', tint: 'bg-warning/10 text-warning' },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="Saajha Rahat by the numbers">
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">By the numbers</p>
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">A network that never sleeps</h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="rounded-lg border border-ink/10 bg-white p-3 text-center transition hover:shadow-sm">
              <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${c.tint}`}>
                <c.icon size={16} aria-hidden />
              </span>
              <p className="mt-1 text-lg font-extrabold leading-none text-ink">{c.value}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted">{c.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden /> Demo figures shown until the backend is connected.
        </p>
      </div>
    </section>
  );
}

function format(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k+` : `${n}+`;
}