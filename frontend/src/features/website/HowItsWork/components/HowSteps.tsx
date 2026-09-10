import type { HowStep } from '../types/howTypes';
import { BadgeCheck, CircleCheck } from 'lucide-react';
import { HowIcon } from './HowIcon';

export function HowSteps({ steps }: { steps: HowStep[] }) {
  return (
    <section id="how-steps" className="mx-auto scroll-mt-24 max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">The response flow</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Every need, five traceable steps</h2>
      <p className="text-xs text-muted sm:text-[13px]">From the first report to the final proof — here is exactly what happens.</p>

      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s._id} className="group relative rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${s.tint}`}>
                <HowIcon name={s.icon} size={17} />
              </span>
              <span className="inline-flex items-start rounded-md bg-ink/5 px-1.5 py-0.5 text-[10px] font-bold text-ink/70">{s.step}</span>
            </div>
            <p className="mt-2 text-xs font-extrabold text-ink">{s.title}</p>
            <p className="text-[11px] font-medium text-primary">{s.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{s.description}</p>

            <ul className="mt-2 space-y-1 text-[11px] text-ink/70">
              {s.actions.map((a) => (
                <li key={a} className="flex items-center gap-1.5">
                  <CircleCheck size={11} className="shrink-0 text-success" aria-hidden /> {a}
                </li>
              ))}
            </ul>

            <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-ink/5 px-2 py-1 text-[10px] font-semibold text-ink/60">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden /> {s.timeline}
            </p>

            {i < steps.length - 1 && (
              <ArrowBetween />
            )}
          </li>
        ))}
      </ol>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
        <BadgeCheck size={12} className="text-success" aria-hidden />
        Every step is public and auditable — from first report to final resolution.
      </p>
    </section>
  );
}

function ArrowBetween() {
  return (
    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-primary/50 lg:block" aria-hidden>→</span>
  );
}