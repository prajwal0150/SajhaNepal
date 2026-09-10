import type { Service, ServiceCategory, ServiceCategoryMeta } from '../types/servicesTypes';
import { ArrowRight, CircleCheck, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@shared/utils/format';
import { ServiceIcon } from './ServiceIcon';

export function ServicesGrid({
  services,
  categories,
  activeCategory,
  onCategoryChange,
}: {
  services: Service[];
  categories: ServiceCategoryMeta[];
  activeCategory: ServiceCategory | 'ALL';
  onCategoryChange: (c: ServiceCategory | 'ALL') => void;
}) {
  const visible = activeCategory === 'ALL' ? services : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services-grid" className="mx-auto scroll-mt-24 max-w-7xl px-3 py-6 sm:px-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Explore services</p>
          <h2 className="text-lg font-extrabold text-ink sm:text-xl">Everything you need, in one place</h2>
          <p className="text-xs text-muted sm:text-[13px]">Pick a category or browse the full catalog.</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Service categories">
        <CategoryTab label="All services" active={activeCategory === 'ALL'} onClick={() => onCategoryChange('ALL')} />
        {categories.map((c) => (
          <CategoryTab
            key={c.id}
            label={c.label}
            title={c.description}
            active={activeCategory === c.id}
            onClick={() => onCategoryChange(c.id)}
          />
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <ServiceCard key={s._id} service={s} />
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-muted">
        {visible.length} service{visible.length === 1 ? '' : 's'} available in this category.
      </p>
    </section>
  );
}

function CategoryTab({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-bold transition',
        active
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-ink/10 bg-white text-ink/70 hover:border-ink/25 hover:text-ink',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-primary' : 'bg-ink/15')} aria-hidden />
      {label}
    </button>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-1.5">
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110', service.tint)}>
          <ServiceIcon name={service.icon} size={17} />
        </span>
        {service.popular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-critical/10 px-2 py-0.5 text-[9px] font-bold uppercase text-critical">
            <Flame size={10} aria-hidden /> Popular
          </span>
        )}
      </div>

      <h3 className="mt-2 text-[13px] font-bold text-ink">{service.title}</h3>
      <p className="text-[11px] font-medium text-primary">{service.ne}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">{service.description}</p>

      <ul className="mt-2 space-y-1 text-[11px] text-ink/70">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-1.5">
            <CircleCheck size={12} className="shrink-0 text-success" aria-hidden /> {f}
          </li>
        ))}
      </ul>

      <div className="mt-2.5 flex items-center justify-end border-t border-ink/5 pt-2">
        <Link
          to={service.cta.to}
          className={cn('inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98]', service.accent)}
        >
          {service.cta.label} <ArrowRight size={13} aria-hidden />
        </Link>
      </div>
    </article>
  );
}