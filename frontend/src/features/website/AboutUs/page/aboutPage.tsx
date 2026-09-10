import { AboutHero } from '../components/AboutHero';
import { AboutStory } from '../components/AboutStory';
import { AboutStats } from '../components/AboutStats';
import { AboutPillars } from '../components/AboutPillars';
import { AboutValues } from '../components/AboutValues';
import { AboutTimeline } from '../components/AboutTimeline';
import { AboutTeam } from '../components/AboutTeam';
import { AboutCta } from '../components/AboutCta';
import { useAbout } from '../hooks/useAbout';
import { demoAboutMilestones, demoAboutStats, demoAboutTeam, demoAboutValues } from '../utils/demoAbout';

export function AboutPage() {
  const { stats, values, milestones, team, loading, isDemo } = useAbout();

  const safeStats = stats ?? demoAboutStats;
  const safeValues = values.length ? values : demoAboutValues;
  const safeMilestones = milestones.length ? milestones : demoAboutMilestones;
  const safeTeam = team.length ? team : demoAboutTeam;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <AboutHero />
        <AboutStory />

        {loading && !safeStats ? (
          <AboutSkeleton />
        ) : (
          <>
            <AboutStats stats={safeStats} />
            <AboutPillars />
            <AboutValues values={safeValues} />
            <AboutTimeline milestones={safeMilestones} />
            <AboutTeam team={safeTeam} isDemo={isDemo} />
          </>
        )}

        <AboutCta />
      </main>
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading about content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading about content…</p>
    </div>
  );
}

export default AboutPage;