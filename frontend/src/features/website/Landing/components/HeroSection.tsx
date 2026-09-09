import { BadgeCheck, CircleCheck, Map as MapIcon, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaticNepalMap } from './StaticNepalMap';

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Disaster Relief Coordination Platform
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            One platform.<br />Every need.<br />
            <span className="text-primary">Coordinated relief.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            Connect people in need with verified volunteers, relief organizations and responders in real time.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]">
              <PenLine size={15} aria-hidden /> REPORT A NEED
            </Link>
            <Link to="/map" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-4 text-[13px] font-bold text-primary transition hover:bg-primary/5 active:scale-[0.98]">
              <MapIcon size={15} aria-hidden /> VIEW LIVE MAP
            </Link>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink/70">
            {['Verified reports', 'Real-time coordination', 'Community powered'].map((t) => (
              <li key={t} className="inline-flex items-center gap-1">
                <CircleCheck size={14} className="text-success" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-fade-up overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="relative">
            <span className="absolute left-2 top-2 z-10 rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-semibold text-white">
              Live Map (Demo Data)
            </span>
            <StaticNepalMap />
            <span className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 px-2 py-0.5 text-[10px] text-muted">
              Map shows demo data
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function UrgentHelpBanner() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-critical/15 bg-critical/5 px-3 py-3 sm:px-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-critical/15 text-xl" aria-hidden>⚠️</span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-critical sm:text-base">Need urgent help?</h2>
            <p className="text-xs text-ink/60 sm:text-[13px]">Report your situation and help responders understand where support is needed.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-critical px-3.5 text-xs font-bold text-white hover:bg-critical/90">
            <PenLine size={14} aria-hidden /> REPORT A NEED
          </Link>
          <Link to="/shelters" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-secondary/40 bg-white px-3.5 text-xs font-bold text-secondary hover:bg-secondary/5">
            ⌂ FIND NEARBY SHELTER
          </Link>
          <Link to="/map" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-3.5 text-xs font-bold text-primary hover:bg-primary/5">
            <MapIcon size={14} aria-hidden /> VIEW LIVE MAP
          </Link>
        </div>
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted">
        <BadgeCheck size={12} className="text-success" aria-hidden /> Demo preview — connect the backend to show live verified reports.
      </p>
    </section>
  );
}
