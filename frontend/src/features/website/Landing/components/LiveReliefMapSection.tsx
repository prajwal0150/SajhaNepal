import type { LandingStats } from '../types/landingTypes';
import { Link } from 'react-router-dom';
import { LiveMapPanel } from './LiveMapPanel';
import { ResponseOverview } from './ResponseOverview';

export function LiveReliefMapSection({ stats, isDemo }: { stats: LandingStats | null; isDemo: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Live relief map</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">See where help is needed</h2>
      <p className="text-xs text-muted sm:text-[13px]">Explore reported needs, shelters and relief resources across affected communities.</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <LiveMapPanel />
        <ResponseOverview stats={stats} isDemo={isDemo} />
      </div>
      <p className="mt-2 text-center text-[11px] text-muted">
        Need the full interactive map? <Link to="/map" className="font-semibold text-primary hover:underline">Open the live map page</Link>
      </p>
    </section>
  );
}
