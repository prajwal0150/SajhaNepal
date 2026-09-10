import { Home, PenLine, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ServicesCta() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-critical/10 via-primary/10 to-secondary/10 px-3 py-6 sm:px-6">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Need help right now?</h2>
        <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-ink/70 sm:text-[13px]">
          You don't have to wait for a drill. Report what your community needs today —
          volunteers and responders are already watching for verified requests.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-critical px-4 text-xs font-bold text-white hover:bg-critical/90">
            <PenLine size={14} aria-hidden /> REPORT A NEED
          </Link>
          <Link to="/shelters" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-secondary/40 bg-white px-4 text-xs font-bold text-secondary hover:bg-secondary/5">
            <Home size={14} aria-hidden /> FIND A SHELTER
          </Link>
          <Link to="/map" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-4 text-xs font-bold text-primary hover:bg-primary/5">
            VIEW LIVE MAP
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