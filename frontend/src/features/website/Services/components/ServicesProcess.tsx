import { BadgeCheck, ClipboardList, HandHelping, Truck } from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, label: 'REACH OUT', desc: 'Report a need or request a service in minutes — online or offline.', bg: 'bg-primary', step: '01' },
  { icon: BadgeCheck, label: 'WE VERIFY', desc: 'Volunteers confirm the situation on the ground before anything moves.', bg: 'bg-secondary', step: '02' },
  { icon: HandHelping, label: 'WE COORDINATE', desc: 'NGOs, warehouses and government teams claim and plan the response.', bg: 'bg-tertiary', step: '03' },
  { icon: Truck, label: 'WE DELIVER', desc: 'Supplies and support arrive, with photo proof captured at delivery.', bg: 'bg-success', step: '04' },
];

export function ServicesProcess() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Transparent by design</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Every service, one clear workflow</h2>
      <p className="text-xs text-muted sm:text-[13px]">No matter which service you use, your request follows the same traceable path.</p>

      <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.label} className="group relative rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:scale-110 ${s.bg}`}>
                <s.icon size={17} aria-hidden />
              </span>
              <span className="text-[10px] font-bold text-muted">{s.step}</span>
            </div>
            <p className="mt-2 text-xs font-extrabold text-ink">{s.label}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <span className="absolute -top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-primary/60" aria-hidden>→</span>
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