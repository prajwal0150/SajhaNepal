import type { LandingShelter } from '../types/landingTypes';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@shared/utils/format';

export function SheltersPreview({ shelters }: { shelters: LandingShelter[] }) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
      <div className="grid gap-3 lg:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-ink/10 bg-white lg:col-span-2">
          <div className="grid h-full sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="relative min-h-36 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100" role="img" aria-label="Mountain community">
              <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
                <rect width="200" height="140" fill="#bcd7ef" />
                <ellipse cx="60" cy="40" rx="40" ry="16" fill="#fff" opacity="0.9" />
                <ellipse cx="140" cy="30" rx="50" ry="18" fill="#fff" opacity="0.85" />
                <path d="M0 110 L60 45 L120 110 Z" fill="#7d9bb5" />
                <path d="M60 45 L80 65 L60 72 L42 62 Z" fill="#fff" />
                <path d="M70 110 L140 30 L200 110 Z" fill="#5f7f9c" />
                <path d="M140 30 L158 52 L140 60 L124 50 Z" fill="#fff" />
                <rect x="0" y="110" width="200" height="30" fill="#3f5a45" />
                <rect x="85" y="92" width="14" height="20" fill="#2b2b2b" />
              </svg>
            </div>
            <div className="flex flex-col justify-center p-3">
              <h3 className="text-[13px] font-bold text-ink">Help reconnect families</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">Search reported missing persons or submit information that may help families reconnect.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Link to="/missing-persons" className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-[10px] font-bold text-white hover:bg-primary-dark">
                  🔍 SEARCH MISSING PERSONS
                </Link>
                <Link to="/missing-persons" className="inline-flex h-8 items-center gap-1 rounded-lg border border-primary/30 px-2.5 text-[10px] font-bold text-primary hover:bg-primary/5">
                  ＋ REPORT MISSING PERSONS
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-3 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-[13px] font-bold text-ink">Find nearby shelter</h3>
              <p className="text-[11px] text-muted">Locate available shelters and see current capacity.</p>
            </div>
            <Link to="/shelters" className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
              View all shelters <ArrowRight size={12} aria-hidden />
            </Link>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {shelters.map((s) => (
              <ShelterMini key={s._id} shelter={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ShelterMini({ shelter }: { shelter: LandingShelter }) {
  const pct = shelter.capacity > 0 ? Math.round((shelter.currentOccupancy / shelter.capacity) * 100) : 0;
  const full = shelter.status === 'FULL' || pct >= 100;
  const limited = !full && (shelter.status === 'LIMITED' || pct >= 80);
  return (
    <div className="rounded-lg border border-ink/10 p-2.5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-ink">{shelter.name}</p>
          <p className="text-[11px] text-muted">{shelter.district}</p>
        </div>
        <span className="text-muted" aria-hidden>⌂</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div className={cn('h-full rounded-full transition-all', full ? 'bg-critical' : limited ? 'bg-warning' : 'bg-success')} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <p className="mt-1 text-[10px] text-muted">{pct}% full · {shelter.currentOccupancy}/{shelter.capacity}</p>
      <span className={cn('mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold', full ? 'bg-critical/10 text-critical' : limited ? 'bg-warning/15 text-warning' : 'bg-success/10 text-success')}>
        {full ? 'FULL' : limited ? 'LIMITED' : 'AVAILABLE'}
      </span>
      <p className="mt-1 text-[10px] text-muted">{full ? '○ No space available' : '◌ Spaces available'}</p>
    </div>
  );
}
