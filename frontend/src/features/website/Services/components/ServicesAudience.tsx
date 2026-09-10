import type { Service, ServiceCategory, ServiceCategoryMeta } from '../types/servicesTypes';
import { ArrowRight, Building2, CircleUserRound, HandHelping } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceIcon } from './ServiceIcon';

interface Audience {
  key: ServiceCategory | 'ALL';
  icon: typeof CircleUserRound;
  title: string;
  desc: string;
  tint: string;
  btn: string;
}

const AUDIENCES: Audience[] = [
  {
    key: 'FOR_PEOPLE',
    icon: CircleUserRound,
    title: 'For People & Families',
    desc: 'Get help fast — report needs, find shelter and reconnect with loved ones.',
    tint: 'bg-primary/10 text-primary',
    btn: 'bg-primary hover:bg-primary-dark',
  },
  {
    key: 'FOR_VOLUNTEERS',
    icon: HandHelping,
    title: 'For Volunteers',
    desc: 'Verify real needs and support your community where it matters most.',
    tint: 'bg-success/10 text-success',
    btn: 'bg-success hover:bg-success/90',
  },
  {
    key: 'FOR_ORGANIZATIONS',
    icon: Building2,
    title: 'For NGOs & Government',
    desc: 'Coordinate relief, manage deliveries and prove impact with evidence.',
    tint: 'bg-tertiary/10 text-tertiary',
    btn: 'bg-tertiary hover:bg-tertiary/90',
  },
];

export function ServicesAudience({
  services,
  categories,
  onCategoryChange,
}: {
  services: Service[];
  categories: ServiceCategoryMeta[];
  onCategoryChange: (c: ServiceCategory | 'ALL') => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Built for everyone</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Who are the services for?</h2>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <AudienceCard key={a.title} audience={a} services={services} categories={categories} onCategoryChange={onCategoryChange} />
        ))}
      </div>
    </section>
  );
}

function AudienceCard({
  audience,
  services,
  categories,
  onCategoryChange,
}: {
  audience: Audience;
  services: Service[];
  categories: ServiceCategoryMeta[];
  onCategoryChange: (c: ServiceCategory | 'ALL') => void;
}) {
  const category = categories.find((c) => c.id === audience.key);
  const related = audience.key === 'ALL' ? services : services.filter((s) => s.category === audience.key);
  const primary = related[0];
  const others = related.slice(1, 4);
  return (
    <div className="rounded-xl border border-ink/10 bg-gradient-to-b from-white to-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${audience.tint}`}>
        <audience.icon size={16} aria-hidden />
      </span>
      <h3 className="mt-2 text-[13px] font-bold text-ink">{audience.title}</h3>
      <p className="text-[11px] leading-snug text-muted">{category ? `${audience.desc}` : audience.desc}</p>

      {primary && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Link
            to={primary.cta.to}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98] ${audience.btn}`}
          >
            {primary.cta.label} <ArrowRight size={13} aria-hidden />
          </Link>
          {others.map((s) => (
            <Link
              key={s._id}
              to={s.cta.to}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/30 px-2.5 text-[10px] font-bold text-primary hover:bg-primary/5"
            >
              <ServiceIcon name={s.icon} size={11} /> {s.title}
            </Link>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onCategoryChange(audience.key)}
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
      >
        View all {audience.title.toLowerCase()} services <ArrowRight size={12} aria-hidden />
      </button>
    </div>
  );
}