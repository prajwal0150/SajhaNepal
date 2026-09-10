import { CircleCheck, Clock } from 'lucide-react';
import { ContactIcon } from './ContactIcon';

const FACTS = [
  { icon: 'phone' as const, label: 'Head office', value: 'Baneshwor, Kathmandu' },
  { icon: 'hotline' as const, label: '24/7 hotline', value: '+977 01 5550 010' },
  { icon: 'clock' as const, label: 'Response time', value: 'Within 1 working day' },
  { icon: 'shield' as const, label: 'Languages', value: 'EN · नेपाली' },
] as const;

const CHIPS = ['Free for everyone', 'EN + नेपाली', 'Verified team'];

export function ContactHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-2 lg:items-center lg:py-7">
        <div className="animate-fade-up">
          <p className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Contact Saajha Rahat
          </p>
          <h1 className="mt-2 text-[26px] font-extrabold leading-[1.15] text-ink sm:text-4xl lg:text-[40px]">
            Reach us.<br />We're here when it<br />
            <span className="text-primary">matters most.</span>
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm">
            Whether you need help, want to volunteer, or represent an NGO or government
            team — find the right contact below and we'll respond in the way that fits best.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#contact-channels"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white shadow-sm transition hover:bg-primary-dark active:scale-[0.98]"
            >
              VIEW CONTACTS <CircleCheck size={15} className="text-white" aria-hidden />
            </a>
            <a
              href="#contact-form"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-secondary/40 bg-white px-4 text-[13px] font-bold text-secondary transition hover:bg-secondary/5 active:scale-[0.98]"
            >
              SEND A MESSAGE
            </a>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink/70">
            {CHIPS.map((t) => (
              <li key={t} className="inline-flex items-center gap-1">
                <CircleCheck size={14} className="text-success" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2.5">
            <p className="text-xs font-bold text-ink">How to reach us</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
              <Clock size={11} aria-hidden /> Quick contacts
            </span>
          </div>
          <ul className="divide-y divide-ink/5">
            {FACTS.map((f) => (
              <li key={f.label} className="flex items-center gap-3 px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ContactIcon name={f.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] text-muted">{f.label}</span>
                  <span className="block text-xs font-bold text-ink">{f.value}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="border-t border-ink/10 px-3 py-2 text-[10px] text-muted">
            साझा राहत = shared relief. Help is a message or call away.
          </p>
        </div>
      </div>
    </section>
  );
}
