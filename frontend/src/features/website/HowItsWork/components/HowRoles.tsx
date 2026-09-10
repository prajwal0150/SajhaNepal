import type { HowRole } from '../types/howTypes';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HowIcon } from './HowIcon';

export function HowRoles({ roles }: { roles: HowRole[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">By role</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">How it works for you</h2>
      <p className="text-xs text-muted sm:text-[13px]">Three audiences, one shared flow — each with its own part to play.</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <div key={r._id} className="rounded-xl border border-ink/10 bg-gradient-to-b from-white to-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${r.tint}`}>
                <HowIcon name={r.icon} size={16} />
              </span>
              <h3 className="min-w-0 flex-1 text-[13px] font-bold text-ink">{r.title}</h3>
            </div>
            <p className="text-[11px] font-medium text-primary">{r.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{r.description}</p>

            <ol className="mt-2 space-y-1.5 text-[11px] text-ink/70">
              {r.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-1.5">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ${r.btn.split(' ')[0]}`}>
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>

            <Link
              to={r.to}
              className={`mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98] ${r.btn}`}
            >
              {r.cta} <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}