import { ArrowRight, Building2, CircleCheck, CircleUserRound, HandHelping } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pillar {
  icon: typeof CircleUserRound;
  title: string;
  ne: string;
  desc: string;
  points: string[];
  tint: string;
  btn: string;
  cta: string;
  to: string;
}

const PILLARS: Pillar[] = [
  {
    icon: CircleUserRound,
    title: 'People & Families',
    ne: 'जनता र परिवारहरू',
    desc: 'Report needs, find shelter and reconnect with loved ones quickly after a disaster.',
    points: ['Offline reporting', 'Shelter finder', 'Missing persons'],
    tint: 'bg-primary/10 text-primary',
    btn: 'bg-primary hover:bg-primary-dark',
    cta: 'REPORT A NEED',
    to: '/report',
  },
  {
    icon: HandHelping,
    title: 'Volunteers',
    ne: 'स्वयंसेवकहरू',
    desc: 'Verify real needs, earn trust and deliver help to your neighbours first.',
    points: ['Verification queue', 'Training & playbooks', 'Growing trust score'],
    tint: 'bg-success/10 text-success',
    btn: 'bg-success hover:bg-success/90',
    cta: 'BECOME A VOLUNTEER',
    to: '/register',
  },
  {
    icon: Building2,
    title: 'NGOs & Government',
    ne: 'संस्था र सरकार',
    desc: 'Coordinate claims, deliveries and district-level response with full audit trails.',
    points: ['Smart claim queue', 'Delivery proof', 'District dashboards'],
    tint: 'bg-tertiary/10 text-tertiary',
    btn: 'bg-tertiary hover:bg-tertiary/90',
    cta: 'FOR ORGANIZATIONS',
    to: '/register',
  },
];

export function AboutPillars() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">What we do</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Three pillars, one mission</h2>
      <p className="text-xs text-muted sm:text-[13px]">Every feature on the platform serves one of these three groups.</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-xl border border-ink/10 bg-gradient-to-b from-white to-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${p.tint}`}>
                <p.icon size={16} aria-hidden />
              </span>
              <h3 className="min-w-0 flex-1 text-[13px] font-bold text-ink">{p.title}</h3>
            </div>
            <p className="text-[11px] font-medium text-primary">{p.ne}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{p.desc}</p>

            <ul className="mt-2 space-y-1 text-[11px] text-ink/70">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-center gap-1.5">
                  <CircleCheck size={12} className="shrink-0 text-success" aria-hidden /> {pt}
                </li>
              ))}
            </ul>

            <Link
              to={p.to}
              className={`mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98] ${p.btn}`}
            >
              {p.cta} <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
        <ArrowRight size={12} className="text-primary" aria-hidden />
        <Link to="/services" className="font-semibold text-primary hover:underline">Explore every service on the platform</Link>
      </p>
    </section>
  );
}