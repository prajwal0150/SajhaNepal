import { Link } from 'react-router-dom';
import { PenLine, HeartHandshake, MapPin, ShieldCheck } from 'lucide-react';

export function ContactCta() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-critical/10 via-primary/10 to-secondary/10 px-3 py-6 sm:px-6">
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Not sure where to start?</h2>
        <p className="mx-auto mt-1 max-w-2xl text-xs leading-relaxed text-ink/70 sm:text-[13px]">
          If someone needs help right now, don't wait for a reply — report it so volunteers and
          responders can act.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-critical px-4 text-xs font-bold text-white hover:bg-critical/90">
            <PenLine size={14} aria-hidden /> REPORT A NEED
          </Link>
          <Link to="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-success/40 bg-white px-4 text-xs font-bold text-success hover:bg-success/5">
            <HeartHandshake size={14} aria-hidden /> JOIN THE RESPONSE
          </Link>
          <a
            href="#contact-channels"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-4 text-xs font-bold text-primary hover:bg-primary/5"
          >
            <MapPin size={14} aria-hidden /> VIEW CONTACTS
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-success" aria-hidden /> Verified, transparent, free for everyone
          </span>
        </div>
      </div>
    </section>
  );
}
