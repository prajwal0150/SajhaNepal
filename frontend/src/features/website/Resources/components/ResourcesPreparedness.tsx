import { Backpack, BookOpen, ListChecks, Phone } from 'lucide-react';

const STEPS = [
  { icon: BookOpen, label: 'LEARN', desc: 'Know the risks where you live — earthquakes, floods and landslides.', bg: 'bg-primary', step: '01' },
  { icon: Backpack, label: 'PREPARE', desc: 'Pack a go-bag with food, water, medicine and copies of important documents.', bg: 'bg-secondary', step: '02' },
  { icon: Phone, label: 'KNOW YOUR CONTACTS', desc: 'Save helpline numbers and agree on a meeting point with your family.', bg: 'bg-tertiary', step: '03' },
  { icon: ListChecks, label: 'PRACTICE', desc: 'Run a short family drill twice a year so the plan becomes second nature.', bg: 'bg-success', step: '04' },
] as const;

export function ResourcesPreparedness() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Preparedness loop</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Four steps to a safer family</h2>
      <p className="text-xs text-muted sm:text-[13px]">Anyone in Nepal can follow this loop — no training or equipment required.</p>

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
        <BookOpen size={12} className="text-success" aria-hidden />
        Start today with a printable guide, then share it with your neighbors.
      </p>
    </section>
  );
}