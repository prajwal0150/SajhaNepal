import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is everything in the resource center free?',
    a: 'Yes. Every guide, checklist, template and training video is free to read, download and print — for citizens, volunteers and organizations alike.',
  },
  {
    q: 'Are the guides available in Nepali?',
    a: 'The most-used guides are published in English, Nepali and, for priority districts, in local languages. Look for the language badge on each card.',
  },
  {
    q: 'How are these resources verified?',
    a: 'Content is reviewed by the Saajha Rahat response team together with partner NGOs, government agencies and professional first-aid trainers before publishing.',
  },
  {
    q: 'Can I print the checklists and forms?',
    a: 'Yes — every checklist and form is designed for printing and for offline use in the field, even where there is no internet connection.',
  },
  {
    q: 'How can I contribute a resource?',
    a: 'Organizations and trainers can submit materials through the NGO dashboard. Each submission is reviewed before it appears in the library.',
  },
];

export function ResourcesFaq() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4" aria-label="Frequently asked questions about the resource center">
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