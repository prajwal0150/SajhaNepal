import { ArrowRight, CircleCheck, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HowIcon } from './HowIcon';

const GLANCE = [
  { icon: 'report', label: 'Report a Need', desc: 'One report, any device, offline too', to: '/report' },
  { icon: 'verify', label: 'Volunteers Verify', desc: 'Confirmed on the ground before moving', to: '/resources' },
  { icon: 'claim', label: 'Orgs Claim', desc: 'A responder takes responsibility', to: '/services' },
  { icon: 'deliver', label: 'Delivery & Proof', desc: 'Photo evidence at every handover', to: '/map' },
  { icon: 'resolve', label: 'Resolved Publicly', desc: 'Closed only after the family confirms', to: '/about' },
] as const;

const CHIPS = ['Free for everyone', 'Verified by volunteers', 'Works offline'];

export function HowHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            From need to relief.<br />In five clear steps.<br />
            <span className="text-primary">Transparent from start to finish.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            Saajha Rahat turns scattered help into one verified flow — report once, and follow
            your need until the help arrives and the case is closed.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#how-steps"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]"
            >
              SEE THE FLOW <ArrowRight size={15} aria-hidden />
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
            <p className="text-xs font-bold text-ink">The flow at a glance</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <CircleCheck size={11} aria-hidden /> 5 steps
            </span>
          </div>
          <ul className="divide-y divide-ink/5">
            {GLANCE.map((g) => (
              <li key={g.label}>
                <Link to={g.to} className="group flex items-center gap-3 px-3 py-2.5 transition hover:bg-primary/5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-105">
                    <HowIcon name={g.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-ink">{g.label}</span>
                    <span className="block text-[11px] text-muted">{g.desc}</span>
                  </span>
                  <ArrowRight size={14} className="text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink/10 px-3 py-2 text-[10px] text-muted">
            साझा राहत = shared relief — help you can follow end to end.
          </p>
        </div>
      </div>
    </section>
  );
}