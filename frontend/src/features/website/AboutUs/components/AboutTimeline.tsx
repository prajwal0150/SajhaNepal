import type { AboutMilestone } from '../types/aboutTypes';
import { ArrowRight } from 'lucide-react';
import { AboutIcon } from './AboutIcon';

export function AboutTimeline({ milestones }: { milestones: AboutMilestone[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Our journey</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">From 2015 to today</h2>
      <p className="text-xs text-muted sm:text-[13px]">Built on lessons learned in past disasters and tested with responders across Nepal.</p>

      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {milestones.map((m, i) => (
          <li key={m._id} className="group relative rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${m.tint}`}>
                <AboutIcon name={m.icon} size={17} />
              </span>
              <span className="inline-flex items-start rounded-md bg-ink/5 px-1.5 py-0.5 text-[10px] font-bold text-ink/70">{m.year}</span>
            </div>
            <p className="mt-2 text-xs font-extrabold text-ink">{m.title}</p>
            <p className="text-[11px] font-medium text-primary">{m.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{m.description}</p>
            {i < milestones.length - 1 && (
              <ArrowRight size={14} className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-primary/50 lg:block" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}