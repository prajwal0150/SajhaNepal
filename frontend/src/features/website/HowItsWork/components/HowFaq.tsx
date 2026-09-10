import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is the whole process really public?',
    a: 'Yes. Every step — report, verification, claim, delivery and resolution — is time-stamped and visible to everyone. Personal contact details are never shared publicly; only the verified responders assigned to the need can see them.',
  },
  {
    q: 'How fast is a need verified?',
    a: 'Volunteers aim to verify needs within 30 minutes in active districts, depending on how close a responder is and on the network conditions. During major events, response teams prioritize urgent needs first.',
  },
  {
    q: 'What if I do not have internet?',
    a: 'Reporting works offline and through the free hotline. A volunteer can submit the report on your behalf, and everything syncs once a connection is available — no need to wait for an online connection.',
  },
  {
    q: 'How do volunteers get trusted?',
    a: 'Volunteers complete short training, confirm needs with their community, and earn a public trust score with every verified delivery. The more verified actions they complete, the more responsibility they can take.',
  },
  {
    q: 'Can anyone claim a need?',
    a: 'Only verified organizations — NGOs, warehouses and government teams — can claim needs. Volunteers help verify and deliver, while organizations remain accountable for the delivery and its photo proof.',
  },
  {
    q: 'Is my personal information shared?',
    a: 'Your contact details are only visible to the verified responders assigned to your need. Everyone else sees the location, category and status — not your identity.',
  },
  {
    q: 'What does “resolved” mean?',
    a: 'A need is marked resolved only after the family confirms the help arrived. The proof photo and the confirmation are attached to the public audit trail for anyone to check.',
  },
];

export function HowFaq() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4" aria-label="Frequently asked questions about the response flow">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Good to know</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Frequently asked questions</h2>

      <div className="mt-3 divide-y divide-ink/5 rounded-xl border border-ink/10 bg-white">
        {FAQS.map((f) => (
          <details key={f.q} className="group open:bg-primary/[0.03]">
            <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold text-ink">
              {f.q}
              <ChevronDown size={15} className="shrink-0 text-muted group-open:rotate-180" aria-hidden />
            </summary>
            <p className="px-3 pb-2.5 text-[11px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}