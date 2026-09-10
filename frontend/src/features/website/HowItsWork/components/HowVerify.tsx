import type { HowVerifyPoint } from '../types/howTypes';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HowIcon } from './HowIcon';

export function HowVerify({ points }: { points: HowVerifyPoint[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Trust by design</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">How verification works</h2>
      <p className="text-xs text-muted sm:text-[13px]">Proof isn't optional — it is built into every single step of the flow.</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p) => (
          <div key={p._id} className="rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${p.tint}`}>
              <HowIcon name={p.icon} size={16} />
            </span>
            <h3 className="mt-2 text-[13px] font-bold text-ink">{p.title}</h3>
            <p className="text-[11px] font-medium text-primary">{p.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{p.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
        <ShieldCheck size={12} className="text-success" aria-hidden />
        Verified needs move first. Trusted responders move faster.
        <Link to="/services" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          View the services <ArrowRight size={12} aria-hidden />
        </Link>
      </p>
    </section>
  );
}