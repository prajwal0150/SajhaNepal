import type { AboutValue } from '../types/aboutTypes';
import { AboutIcon } from './AboutIcon';

export function AboutValues({ values }: { values: AboutValue[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Our values</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">How we work</h2>
      <p className="text-xs text-muted sm:text-[13px]">Six principles guide every feature, decision and partnership.</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((v) => (
          <div key={v._id} className="rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${v.tint}`}>
                <AboutIcon name={v.icon} size={16} />
              </span>
              <h3 className="min-w-0 flex-1 text-[13px] font-bold text-ink">{v.title}</h3>
            </div>
            <p className="text-[11px] font-medium text-primary">{v.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{v.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}