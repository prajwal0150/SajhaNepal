import { ResourcesHero } from '../components/ResourcesHero';
import { ResourcesLibrary } from '../components/ResourcesLibrary';
import { ResourcesStats } from '../components/ResourcesStats';
import { ResourcesPreparedness } from '../components/ResourcesPreparedness';
import { ResourcesAudience } from '../components/ResourcesAudience';
import { ResourcesFaq } from '../components/ResourcesFaq';
import { ResourcesCta } from '../components/ResourcesCta';
import { useResources } from '../hooks/useResources';
import { demoResources, demoResourcesCategories, demoResourcesStats } from '../utils/demoResources';

export function ResourcesPage() {
  const { resources, categories, stats, loading, activeCategory, setCategory } = useResources();

  const safeResources = resources.length ? resources : demoResources;
  const safeCategories = categories.length ? categories : demoResourcesCategories;
  const safeStats = stats ?? demoResourcesStats;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <ResourcesHero />

        {loading && !safeStats ? (
          <ResourcesSkeleton />
        ) : (
          <ResourcesLibrary
            resources={safeResources}
            categories={safeCategories}
            activeCategory={activeCategory}
            onCategoryChange={setCategory}
          />
        )}

        <ResourcesStats stats={safeStats} />
        <ResourcesPreparedness />
        <ResourcesAudience resources={safeResources} />
        <ResourcesFaq />
        <ResourcesCta />
      </main>
    </div>
  );
}

function ResourcesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading resource content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading resources…</p>
    </div>
  );
}

export default ResourcesPage;