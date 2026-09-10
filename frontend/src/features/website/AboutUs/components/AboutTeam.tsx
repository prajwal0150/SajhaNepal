import type { AboutTeamMember } from '../types/aboutTypes';
import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AboutIcon } from './AboutIcon';

const PARTNERS = ['Volunteer networks', 'Local government', 'National NGOs', 'Community radios', 'Academic institutions'];

export function AboutTeam({ team, isDemo }: { team: AboutTeamMember[]; isDemo: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Meet the team</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">The people behind Saajha Rahat</h2>
      <p className="text-xs text-muted sm:text-[13px]">A growing group of volunteers, engineers and responders across Nepal.</p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <div key={m._id} className="rounded-xl border border-ink/10 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-extrabold ${m.tint}`}>
              {m.initials}
            </span>
            <h3 className="mt-2 text-[13px] font-bold text-ink">{m.role}</h3>
            <p className="text-[11px] leading-snug text-muted">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-ink/10 bg-primary/[0.04] p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">In collaboration with</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PARTNERS.map((p) => (
            <span key={p} className="inline-flex items-center rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[10px] font-semibold text-ink/70">
              <AboutIcon name="partner" size={11} className="mr-1 text-primary" /> {p}
            </span>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted">
          {isDemo && <BadgeCheck size={12} className="text-success" aria-hidden />}
          {isDemo ? 'Demo profiles — real team and partner management arrive with the backend.' : 'Partners join the response in real time.'}
        </p>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
        <BadgeCheck size={12} className="text-success" aria-hidden />
        <Link to="/register" className="font-semibold text-primary hover:underline">Want to help build or lead this? Join as a volunteer or partner.</Link>
      </p>
    </section>
  );
}