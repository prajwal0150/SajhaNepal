import { ArrowRight, ClipboardList, HandHelping, BadgeCheck, Truck, CircleCheck } from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, label: 'REPORT', desc: 'Tell us what help is needed.', bg: 'bg-primary', step: '01' },
  { icon: BadgeCheck, label: 'VERIFY', desc: 'Volunteers verify the information.', bg: 'bg-secondary', step: '02' },
  { icon: HandHelping, label: 'CLAIM', desc: 'Relief organizations take responsibility.', bg: 'bg-tertiary', step: '03' },
  { icon: HandHelping, label: 'DELIVER', desc: 'Support reaches the people who need it.', bg: 'bg-warning', step: '04' },
  { icon: CircleCheck, label: 'RESOLVE', desc: 'Delivery is confirmed and the need is closed.', bg: 'bg-success', step: '05' },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">How it works</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">From need to relief</h2>
      <p className="text-xs text-muted sm:text-[13px]">Every report moves through a transparent response process.</p>

      <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <li key={s.label} className="group relative rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110 ${s.bg}`}>
                <s.icon size={17} aria-hidden />
              </span>
              <span className="text-[10px] font-bold text-muted">{s.step}</span>
            </div>
            <p className={`mt-2 text-xs font-extrabold ${i === 4 ? 'text-success' : i === 3 ? 'text-warning' : i === 2 ? 'text-tertiary' : i === 1 ? 'text-secondary' : 'text-primary'}`}>
              {s.label}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <ArrowRight size={14} className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-primary/50 lg:block" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {/* Mini transparency strip */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-xl bg-primary/[0.04] px-3 py-2.5 text-[11px] font-medium text-muted">
        {['Report', 'Verification', 'Claim', 'Delivery', 'Proof', 'Resolution'].map((t, i, arr) => (
          <span key={t} className="inline-flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-ink/70">
              <Truck size={13} className="text-primary" aria-hidden /> {t}
            </span>
            {i < arr.length - 1 && <ArrowRight size={12} className="text-ink/20" aria-hidden />}
          </span>
        ))}
      </div>
      <p className="mt-1 text-center text-[11px] text-muted">Relief you can follow — from report to resolution, every step is transparent and trackable.</p>
    </section>
  );
}
