import { ArrowRight, CircleCheck, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AboutIcon } from './AboutIcon';

const FACTS = [
  { icon: 'mission', label: 'Founded', value: '2023' },
  { icon: 'local', label: 'Based in', value: 'Kathmandu, Nepal' },
  { icon: 'org', label: 'Built for', value: 'People · Volunteers · NGOs' },
  { icon: 'open', label: 'Status', value: 'Free & open source' },
] as const;

const CHIPS = ['Built in Nepal', 'Free for everyone', 'Open & transparent'];

export function AboutHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            About Saajha Rahat
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            One platform.<br />Every need.<br />
            <span className="text-primary">Shared relief.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            Saajha Rahat — साझा राहत — is a homegrown disaster response platform that connects
            people in need with verified volunteers, NGOs and government responders in real time.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#about-story"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]"
            >
              OUR STORY <ArrowRight size={15} aria-hidden />
            </a>
            <Link to="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-success/40 bg-white px-4 text-[13px] font-bold text-success transition hover:bg-success/5 active:scale-[0.98]">
              <HeartHandshake size={15} aria-hidden /> JOIN THE RESPONSE
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
            <p className="text-xs font-bold text-ink">Who we are</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <HeartHandshake size={11} aria-hidden /> Quick facts
            </span>
          </div>
          <ul className="divide-y divide-ink/5">
            {FACTS.map((f) => (
              <li key={f.label} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <AboutIcon name={f.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] text-muted">{f.label}</span>
                  <span className="block text-xs font-bold text-ink">{f.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink/10 px-3 py-2 text-[10px] text-muted">
            साझा राहत means “shared relief” — help that belongs to everyone.
          </p>
        </div>
      </div>
    </section>
  );
}