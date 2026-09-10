import { HeartHandshake, PenLine, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutCta() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-critical/10 via-primary/10 to-secondary/10 px-3 py-6 sm:px-6">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Be part of the story.</h2>
        <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-ink/70 sm:text-[13px]">
          Whether you need help, can verify a report, or can coordinate relief —
          Saajha Rahat is built for you. Join the response and help write the next chapter.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark">
            <HeartHandshake size={14} aria-hidden /> JOIN THE RESPONSE
          </Link>
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-critical/40 bg-white px-4 text-xs font-bold text-critical hover:bg-critical/5">
            <PenLine size={14} aria-hidden /> REPORT A NEED
          </Link>
          <Link to="/services" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-secondary/40 bg-white px-4 text-xs font-bold text-secondary hover:bg-secondary/5">
            EXPLORE SERVICES
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Phone size={12} className="text-primary" aria-hidden /> Free hotline · 24/7
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-success" aria-hidden /> Free & open for every citizen of Nepal
          </span>
        </div>
      </div>
    </section>
  );
}