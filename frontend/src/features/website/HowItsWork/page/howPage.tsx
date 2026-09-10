import { HowHero } from '../components/HowHero';
import { HowSteps } from '../components/HowSteps';
import { HowRoles } from '../components/HowRoles';
import { HowVerify } from '../components/HowVerify';
import { HowStats } from '../components/HowStats';
import { HowFaq } from '../components/HowFaq';
import { HowCta } from '../components/HowCta';
import { useHow } from '../hooks/useHow';
import { demoHowRoles, demoHowStats, demoHowSteps, demoHowVerifyPoints } from '../utils/demoHow';

export function HowItsWorkPage() {
  const { stats, steps, roles, verifyPoints, loading } = useHow();

  const safeStats = stats ?? demoHowStats;
  const safeSteps = steps.length ? steps : demoHowSteps;
  const safeRoles = roles.length ? roles : demoHowRoles;
  const safeVerifyPoints = verifyPoints.length ? verifyPoints : demoHowVerifyPoints;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <HowHero />
        <HowSteps steps={safeSteps} />
        <HowRoles roles={safeRoles} />
        <HowVerify points={safeVerifyPoints} />

        {loading && !safeStats ? (
          <HowSkeleton />
        ) : (
          <HowStats stats={safeStats} />
        )}

        <HowFaq />
        <HowCta />
      </main>
    </div>
  );
}

function HowSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading how-it-works content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading how it works…</p>
    </div>
  );
}

export default HowItsWorkPage;