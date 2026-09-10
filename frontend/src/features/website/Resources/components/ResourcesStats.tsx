import type { ResourcesStats } from '../types/resourcesTypes';
import { BookOpen, Download, Globe, Phone } from 'lucide-react';

export function ResourcesStats({ stats }: { stats: ResourcesStats }) {
  const cards = [
    { icon: BookOpen, value: `${stats.guides}`, label: 'Guides & checklists', tint: 'bg-primary/10 text-primary' },
    { icon: Download, value: format(stats.downloads), label: 'Downloads to date', tint: 'bg-success/10 text-success' },
    { icon: Globe, value: `${stats.languages}`, label: 'Languages available', tint: 'bg-tertiary/10 text-tertiary' },
    { icon: Phone, value: `${stats.hotlines}`, label: 'Hotlines listed', tint: 'bg-critical/10 text-critical' },
  ] as const;

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="Resource center by the numbers">
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">By the numbers</p>
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">A library that grows with the response</h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
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