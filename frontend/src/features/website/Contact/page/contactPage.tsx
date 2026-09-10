import { ContactHero } from './ContactHero';
import { ContactChannels } from './ContactChannels';
import { ContactForm } from './ContactForm';
import { ContactFaq } from './ContactFaq';
import { ContactCta } from './ContactCta';
import { useContact } from '../hooks/useContact';
import { demoContactChannels, demoContactStats } from '../utils/demoContact';

export function ContactPage() {
  const { channels, stats, loading } = useContact();

  const safeChannels = channels.length ? channels : demoContactChannels;
  const safeStats = stats ?? demoContactStats;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <ContactHero />

        {loading && !safeStats ? (
          <ContactSkeleton />
        ) : (
          <>
            <ContactChannels channels={safeChannels} />
            <ContactForm />
            <ContactFaq />
            <ContactCta />
          </>
        )}
      </main>
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 px-3 py-6 sm:px-4" role="status" aria-label="Loading contact content">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-xl bg-ink/10" aria-hidden />
      ))}
      <p className="text-center text-xs text-muted">Loading contact details…</p>
    </div>
  );
}

export default ContactPage;
