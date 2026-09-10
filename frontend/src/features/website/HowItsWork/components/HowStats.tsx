import type { HowStats } from '../types/howTypes';
import { Building, Camera, Clock3, MapPinned, Truck } from 'lucide-react';

export function HowStats({ stats }: { stats: HowStats }) {
  const cards = [
    { icon: MapPinned, value: `${stats.provinces}`, label: 'Provinces reached', tint: 'bg-primary/10 text-primary' },
    { icon: Building, value: `${stats.districts}`, label: 'Districts reachable', tint: 'bg-tertiary/10 text-tertiary' },
    { icon: Clock3, value: `${stats.avgVerifyMinutes} min`, label: 'Average verification', tint: 'bg-warning/10 text-warning' },
    { icon: Truck, value: `${stats.avgResolveDays} days`, label: 'Average resolution', tint: 'bg-critical/10 text-critical' },
    { icon: Camera, value: `${stats.proofRate}%`, label: 'Delivered with photo proof', tint: 'bg-success/10 text-success' },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="How it works by the numbers">
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">By the numbers</p>
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">A response you can measure</h2>
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