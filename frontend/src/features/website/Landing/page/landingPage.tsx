import { CurrentNeedsSection } from '../components/CurrentNeedsSection';
import { HeroSection, UrgentHelpBanner } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorks';
import { LandingFooter } from '../components/LandingFooter';
import { LandingHeader } from '../components/LandingHeader';
import { LiveReliefMapSection } from '../components/LiveReliefMapSection';
import { RolesSection } from '../components/RolesSection';
import { SheltersPreview } from '../components/SheltersPreview';
import { demoLandingData } from '../utils/demoLanding';
import { useLanding } from '../hooks/useLanding';

export function LandingPage() {
  const { stats, needs, shelters, loading, isDemo } = useLanding();

  const safeStats = stats ?? (loading ? null : demoLandingData.stats);
  const safeNeeds = needs.length ? needs : demoLandingData.needs;
  const safeShelters = shelters.length ? shelters : demoLandingData.shelters;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <LandingHeader />
      <main>
        <HeroSection />
        <UrgentHelpBanner />
        <div className="pt-2">
          <HowItWorksSection />
        </div>
        {loading && !safeStats ? (
          <LandingSkeleton />
        ) : (
          <>
            <LiveReliefMapSection stats={safeStats} isDemo={isDemo} />
            <CurrentNeedsSection needs={safeNeeds} />
            <RolesSection />
            <SheltersPreview shelters={safeShelters} />
          </>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}

function LandingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading landing content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading live relief data…</p>
    </div>
  );
}

export default LandingPage;

