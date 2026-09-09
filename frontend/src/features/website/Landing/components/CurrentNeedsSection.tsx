import type { LandingNeed } from '../types/landingTypes';
import { ArrowRight, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NEED_TYPE_META, URGENCY_META, STATUS_META } from '@shared/constants';
import { timeAgo, cn } from '@shared/utils/format';

export function CurrentNeedsSection({ needs }: { needs: LandingNeed[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Current needs</p>
          <h2 className="text-lg font-extrabold text-ink sm:text-xl">People need help now</h2>
          <p className="text-xs text-muted sm:text-[13px]">Explore verified community needs.</p>
        </div>
        <Link to="/reports" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
          View all needs <ArrowRight size={13} aria-hidden />
        </Link>
      </div>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {needs.map((n) => (
          <NeedCard key={n._id} need={n} />
        ))}
      </div>
    </section>
  );
}

function NeedCard({ need }: { need: LandingNeed }) {
  const meta = NEED_TYPE_META[need.needType];
  const urgency = URGENCY_META[need.urgency];
  const statusKey = need.verificationStatus === 'VERIFIED' ? 'VERIFIED' : need.verificationStatus === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'PENDING';
  const status = STATUS_META[statusKey];
  return (
    <article className="flex flex-col rounded-xl border border-ink/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-1.5">
        <p className="flex min-w-0 items-center gap-1.5 text-[13px] font-bold text-ink">
          <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs', meta?.color ?? 'bg-muted/10')} aria-hidden>
            {meta?.emoji ?? '📦'}
          </span>
          <span className="truncate">{need.title}</span>
        </p>
        <span className={cn('shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase', urgency?.classes)}>{need.urgency}</span>
      </div>
      <ul className="mt-2 space-y-1 text-[11px] text-muted">
        <li className="flex items-center gap-1.5"><MapPin size={12} aria-hidden /> {need.district}{need.ward ? `, Ward ${need.ward}` : ''}</li>
        <li className="flex items-center gap-1.5"><Users size={12} aria-hidden /> {need.affectedPeople} people affected</li>
        <li className="flex items-center gap-1.5"><Clock size={12} aria-hidden /> {timeAgo(need.createdAt)}</li>
      </ul>
      <div className="mt-2.5 flex items-center justify-between border-t border-ink/5 pt-2">
        <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold', status?.classes)}>
          {statusKey === 'IN_PROGRESS' ? 'In Progress' : statusKey === 'VERIFIED' ? '✓ Verified' : 'Pending'}
        </span>
        <Link to={`/reports/${need._id}`} className="rounded-md border border-primary/30 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5">
          VIEW DETAILS
        </Link>
      </div>
    </article>
  );
}
