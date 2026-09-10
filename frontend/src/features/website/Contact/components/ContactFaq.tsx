import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is the best way to report an urgent need?',
    a: 'Call the free hotline at +977 01 5550 010 — it’s staffed 24/7, in Nepali and English. You can also submit a report online at /report, and a volunteer will confirm details with you within minutes in active districts.',
    ne: 'तत्काल आवश्यकता प्रतिवेदन गर्न एउटा निश्चित मार्ग छ?',
    na: 'निःशुल्क होटलाइन +९७७ ०१ ५५५० ०१० मा फोन गर्नुहोस् — यो २४ घण्टा नेपाली तथा अंग्रेजीमा सेवा गर्छ।',
  },
  {
    q: 'Is SajhaRahat free to use?',
    a: 'Yes. Reporting a need, confirming a volunteer, and downloading resources are all free.',
    ne: 'सज्हराहत प्रयोग स бесплатно छ?',
    na: 'हो। आवश्यकता प्रतिवेदन गर्नु, स्वयंसेवक पुष्टि गर्नु, र स्रोत डाउनलोड गर्नु सबै निःशुल्क छ।',
  },
  {
    q: 'How fast are needs resolved?',
    a: 'It depends on the need, location, and available resources. Most needs are acknowledged within minutes and resolved within 24–72 hours.',
    ne: 'आवश्यकताहरू कहिले समाधान हुन्छन्?',
    na: 'यो आवश्यकता, स्थान, र उपलब्ध स्रोतमा निर्भर गर्छ।',
  },
  {
    q: 'Can NGOs and government agencies coordinate on this platform?',
    a: 'Yes. Verified NGOs and government actors use the same platform to publish needs and confirm deliveries.',
    ne: 'संस्थाहरू तथा सरकारी निकायहरूले यो प्लेटफर्ममा समन्वय गर्न सक्छन्?',
    na: 'हो। प्रमाणित संस्थाहरू तथा सरकारी निकायहरूले एउटै प्लेटफर्म प्रयोग गर्छन्।',
  },
  {
    q: 'What if there is no internet in the area?',
    a: 'SajhaRahat is built for low-connectivity areas too. You can prepare a report offline and publish it when you have a connection.',
    ne: 'यदि क्षेत्रमा इन्टरनेट छैन भने?',
    na: 'सज्हराहत कम जडान भएका क्षेत्रहरूको लागि पनि Designed छ।',
  },
  {
    q: 'How is privacy handled?',
    a: "Reports containing personal information are visible only to verified responders until the need is resolved.",
    ne: 'गोपनीयता कसरी ह्यान्डल गरिन्छ?',
    na: 'व्यक्तिगत जानकारी समावेश प्रतिवेदनहरू केवल प्रमाणित सहयोगीहरूले मात्र हेर्न सक्छन्।',
  },
  {
    q: 'Who runs SajhaRahat?',
    a: "SajhaRahat is run by a volunteer community coordinated with local NGOs and government emergency cells.",
    ne: 'सज्हराहत कसले सञ्चालन गर्छ?',
    na: 'सज्हराहत स्थानीय संस्थाहरू र स्वतन्त्र लेखापरीक्षकहरूसँग समन्वयित स्वयंसेवक समुदायले सञ्चालन गर्छ।',
  },
  {
    q: 'Do I need an account to ask for help?',
    a: 'No. Anyone can report a need or visit the office without an account.',
    ne: 'मद्दतको लागि खोज्न खाता चाहिएको छ?',
    na: 'होइन। कसले पनि खाता बिना आवश्यकता प्रतिवेदन गर्न सक्छ।',
  },
  {
    q: 'When will you reply to my message?',
    a: 'For urgent needs, the hotline is available 24/7. For written messages, we aim to reply within one working day.',
    ne: 'मेरो संदेशमा कहिले जवाफ दिनुहुन्छ?',
    na: 'तत्काल आवश्यकताको लागि, होटलाइन २४/७ उपलब्ध छ।',
  },
  {
    q: 'Can I write in Nepali?',
    a: 'Yes. All our contact channels support both English and नेपाली।',
    ne: 'के म नेपालीमा लेख्न सक्छु?',
    na: 'हो। हाम्रा सबै सम्पर्क च्यानलहरू अंग्रेजी र नेपाली दुवै समर्थन गर्छन्।',
  },
  {
    q: 'How do I become a volunteer?',
    a: 'Choose "Become a volunteer" in the form above, or visit /register.',
    ne: 'म स्वयंसेवक कसरी बन्न सक्छु?',
    na: 'माथिको form मा "स्वयंसेवक बन्नुहोस्" छान्नुहोस्, वा /register मा जानुहोस्।',
  },
  {
    q: 'Can NGOs and government teams work with Saajha Rahat?',
    a: 'Yes. Use "NGO / organization" or "Government access" as the category when you message us.',
    ne: 'संस्थाहरू तथा सरकारी टोलीहरूले साझा राहतसँग काम गर्न सक्छन्?',
    na: 'हो। हामीलाई संदेश गर्दा category को रूपमा "NGO / organization" वा "Government access" प्रयोग गर्नुहोस्।',
  },
  {
    q: 'Is my contact information shared publicly?',
    a: 'No. Phone numbers and email addresses are only visible to the team members handling your request.',
    ne: 'के मेरो सम्पर्क जानकारी सार्वजनिक रूपमा साझा गरिन्छ?',
    na: 'होइन। फोन नम्बर र इमेल ठेगानाहरू केवल टोली सदस्यहरूले मात्र देख्न सक्छन्।',
  },
];

export function ContactFaq() {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4" aria-label="Frequently asked questions about contacting Saajha Rahat">
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
