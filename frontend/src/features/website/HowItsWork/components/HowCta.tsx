import { HeartHandshake, PenLine, Phone, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowCta() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-critical/10 via-primary/10 to-secondary/10 px-3 py-6 sm:px-6">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Ready to start the flow?</h2>
        <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-ink/70 sm:text-[13px]">
          Whether you need help, can verify a report, or want to coordinate relief — the process
          is the same, and it is free for every citizen of Nepal.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-critical px-4 text-xs font-bold text-white hover:bg-critical/90">
            <PenLine size={14} aria-hidden /> REPORT A NEED
          </Link>
          <Link to="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark">
            <HeartHandshake size={14} aria-hidden /> JOIN THE RESPONSE
          </Link>
          <Link to="/services" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-secondary/40 bg-white px-4 text-xs font-bold text-secondary hover:bg-secondary/5">
            <Search size={14} aria-hidden /> EXPLORE SERVICES
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Phone size={12} className="text-primary" aria-hidden /> Free hotline · 24/7
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-success" aria-hidden /> Verified reports, transparent response
          </span>
        </div>
      </div>
    </section>
  );
}