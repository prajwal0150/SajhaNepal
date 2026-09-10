import { ServicesHero } from '../components/ServicesHero';
import { ServicesGrid } from '../components/ServicesGrid';
import { ServicesStats } from '../components/ServicesStats';
import { ServicesProcess } from '../components/ServicesProcess';
import { ServicesAudience } from '../components/ServicesAudience';
import { ServicesCta } from '../components/ServicesCta';
import { useServices } from '../hooks/useServices';
import { demoServices, demoServicesCategories, demoServicesStats } from '../utils/demoServices';

export function ServicesPage() {
  const { services, categories, stats, loading, activeCategory, setCategory } = useServices();

  const safeServices = services.length ? services : demoServices;
  const safeCategories = categories.length ? categories : demoServicesCategories;
  const safeStats = stats ?? demoServicesStats;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <ServicesHero />

        {loading && !safeStats ? (
          <ServicesSkeleton />
        ) : (
          <ServicesGrid
            services={safeServices}
            categories={safeCategories}
            activeCategory={activeCategory}
            onCategoryChange={setCategory}
          />
        )}

        <ServicesStats stats={safeStats} />
        <ServicesProcess />
        <ServicesAudience services={safeServices} categories={safeCategories} onCategoryChange={setCategory} />
        <ServicesCta />
      </main>
    </div>
  );
}

function ServicesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading services content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading services…</p>
    </div>
  );
}

export default ServicesPage;