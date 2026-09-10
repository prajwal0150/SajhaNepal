import type { Resource } from '../types/resourcesTypes';
import { ArrowRight, Building2, CircleUserRound, HandHelping } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResourceIcon } from './ResourceIcon';

interface Audience {
  key: string;
  icon: typeof CircleUserRound;
  title: string;
  desc: string;
  tint: string;
  btn: string;
  ids: string[];
}

const AUDIENCES: Audience[] = [
  {
    key: 'people',
    icon: CircleUserRound,
    title: 'For People & Families',
    desc: 'Practical guides to report needs, find shelter and stay safe with your loved ones.',
    tint: 'bg-primary/10 text-primary',
    btn: 'bg-primary hover:bg-primary-dark',
    ids: ['res-report', 'res-earthquake', 'res-family-plan', 'res-contacts', 'res-shelter-guide'],
  },
  {
    key: 'volunteers',
    icon: HandHelping,
    title: 'For Volunteers',
    desc: 'Training videos, field forms and checklists that help you respond safely and fairly.',
    tint: 'bg-success/10 text-success',
    btn: 'bg-success hover:bg-success/90',
    ids: ['res-onboarding', 'res-firstaid', 'res-need-survey', 'res-volunteer-kit'],
  },
  {
    key: 'orgs',
    icon: Building2,
    title: 'For NGOs & Government',
    desc: 'Playbooks, pledge forms and coordination templates for organized relief operations.',
    tint: 'bg-tertiary/10 text-tertiary',
    btn: 'bg-tertiary hover:bg-tertiary/90',
    ids: ['res-ngo-playbook', 'res-donation-form', 'res-map'],
  },
];

export function ResourcesAudience({ resources }: { resources: Resource[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Built for everyone</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Who are these resources for?</h2>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIENCES.map((a) => (
          <AudienceCard key={a.key} audience={a} pool={pick(resources, a.ids)} />
        ))}
      </div>
    </section>
  );
}

function pick(resources: Resource[], ids: string[]): Resource[] {
  return ids
    .map((id) => resources.find((r) => r._id === id))
    .filter((r): r is Resource => r != null);
}

function AudienceCard({ audience, pool }: { audience: Audience; pool: Resource[] }) {
  const primary = pool[0];
  const others = pool.slice(1, 4);
  return (
    <div className="rounded-xl border border-ink/10 bg-gradient-to-b from-white to-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${audience.tint}`}>
        <audience.icon size={16} aria-hidden />
      </span>
      <h3 className="mt-2 text-[13px] font-bold text-ink">{audience.title}</h3>
      <p className="text-[11px] leading-snug text-muted">{audience.desc}</p>

      {primary && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Link
            to={primary.cta.to}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98] ${audience.btn}`}
          >
            {primary.cta.label} <ArrowRight size={13} aria-hidden />
          </Link>
          {others.map((r) => (
            <Link
              key={r._id}
              to={r.cta.to}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/30 px-2.5 text-[10px] font-bold text-primary hover:bg-primary/5"
            >
              <ResourceIcon name={r.icon} size={11} /> {r.title}
            </Link>
          ))}
        </div>
      )}

      <a
        href="#resources-library"
        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
      >
        Browse the full library <ArrowRight size={12} aria-hidden />
      </a>
    </div>
  );
}