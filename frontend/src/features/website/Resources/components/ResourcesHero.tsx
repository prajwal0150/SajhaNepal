import { ArrowRight, BookOpen, CircleCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResourceIcon } from './ResourceIcon';

const QUICK = [
  { icon: 'firstaid', label: 'First Aid Basics', desc: 'Video · 04:32', to: '/register' },
  { icon: 'safety', label: 'Earthquake Safety', desc: '8 min read', to: '/hazards' },
  { icon: 'download', label: 'Family Emergency Plan', desc: 'PDF · 2 pages', to: '/shelters' },
  { icon: 'helpline', label: 'Emergency Contact Card', desc: 'Printable · 1 page', to: '/report' },
] as const;

const CHIPS = ['Free to download', 'नेपाली + English', 'Reviewed by responders'];

export function ResourcesHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Resource Center
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            Learn. Prepare. Respond.<br />
            <span className="text-primary">Knowledge that saves lives.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            From first-aid videos to printable checklists — find trusted, free resources
            that keep your family and community ready for any disaster.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#resources-library"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]"
            >
              BROWSE THE LIBRARY <ArrowRight size={15} aria-hidden />
            </a>
            <Link to="/hazards" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-warning/40 bg-white px-4 text-[13px] font-bold text-warning transition hover:bg-warning/5 active:scale-[0.98]">
              CHECK HAZARD ALERTS
            </Link>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink/70">
            {CHIPS.map((t) => (
              <li key={t} className="inline-flex items-center gap-1">
                <CircleCheck size={14} className="text-success" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2.5">
            <p className="text-xs font-bold text-ink">Featured this week</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <BookOpen size={11} aria-hidden /> Learning hub
            </span>
          </div>
          <ul className="divide-y divide-ink/5">
            {QUICK.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="group flex items-center gap-3 px-3 py-2.5 transition hover:bg-primary/5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105">
                    <ResourceIcon name={q.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-ink">{q.label}</span>
                    <span className="block text-[11px] text-muted">{q.desc}</span>
                  </span>
                  <ArrowRight size={14} className="text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink/10 px-3 py-2 text-[10px] text-muted">
            Every guide is free, printable and available in English and Nepali.
          </p>
        </div>
      </div>
    </section>
  );
}