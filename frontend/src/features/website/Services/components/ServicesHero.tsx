import { ArrowRight, CircleCheck, MapPin, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceIcon } from './ServiceIcon';

const QUICK = [
  { icon: 'report', label: 'Report a Need', desc: 'Signal help in minutes', to: '/report' },
  { icon: 'map', label: 'Live Relief Map', desc: 'Explore verified needs', to: '/map' },
  { icon: 'shelter', label: 'Find a Shelter', desc: 'Check live capacity', to: '/shelters' },
  { icon: 'missing', label: 'Missing Persons', desc: 'Reconnect families', to: '/missing-persons' },
] as const;

const CHIPS = ['Free for everyone', 'Verified & transparent', '24/7 reporting'];

export function ServicesHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Our Services
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            Relief services that<br />work together.<br />
            <span className="text-primary">One platform, every need.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            From reporting a need to delivering verified relief — Saajha Rahat connects people,
            volunteers and organizations through one transparent response system.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#services-grid"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]"
            >
              EXPLORE SERVICES <ArrowRight size={15} aria-hidden />
            </a>
            <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-critical/40 bg-white px-4 text-[13px] font-bold text-critical transition hover:bg-critical/5 active:scale-[0.98]">
              <PenLine size={15} aria-hidden /> REPORT A NEED
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
            <p className="text-xs font-bold text-ink">Popular services</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <MapPin size={11} aria-hidden /> Quick links
            </span>
          </div>
          <ul className="divide-y divide-ink/5">
            {QUICK.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="group flex items-center gap-3 px-3 py-2.5 transition hover:bg-primary/5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105">
                    <ServiceIcon name={q.icon} size={16} />
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
            All core services above are free and open to every citizen of Nepal.
          </p>
        </div>
      </div>
    </section>
  );
}