import { BookOpen, Phone, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ResourcesCta() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-critical/10 via-primary/10 to-secondary/10 px-3 py-6 sm:px-6">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Start with one guide today.</h2>
        <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-ink/70 sm:text-[13px]">
          You don't need to be an expert to be ready. Download a checklist, watch a
          training video, and share one resource with your neighbors this week.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="#resources-library" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark">
            BROWSE THE LIBRARY
          </a>
          <Link to="/hazards" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-warning/40 bg-white px-4 text-xs font-bold text-warning hover:bg-warning/5">
            <Siren size={14} aria-hidden /> CHECK HAZARD ALERTS
          </Link>
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-critical/40 bg-white px-4 text-xs font-bold text-critical hover:bg-critical/5">
            REPORT A NEED
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Phone size={12} className="text-primary" aria-hidden /> Free hotline · 24/7
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={12} className="text-success" aria-hidden /> Guides in नेपाली + English
          </span>
        </div>
      </div>
    </section>
  );
}