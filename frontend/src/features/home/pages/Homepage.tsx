import { Button } from '@shared/components/Button';
import { Link } from 'react-router-dom';
import { LiveMap } from '@features/map/components/LiveMap';
import { MapPin, Shield, Users, HeartHandshake } from 'lucide-react';

export function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface to-white text-ink">
      <HeroSection />
      <HowItWorksSection />
      <LiveMapPreviewSection />
      <ImpactStatsSection />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-primary/5 to-white py-16 text-center">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl mb-4">
          Saajha Rahat <span className="text-primary">साझा राहत</span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-6">
          A live disaster-relief coordination platform for Nepal — connecting citizens in need,
          volunteers who verify, and NGOs who deliver.
        </p>
        <div className="flex flex-col gap-3 justify-center sm:flex-row">
          <Link to="/report">
            <Button variant="critical" size="lg" className="px-8">
              <MapPin size={20} className="mr-2" /> Report a Need
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="lg">
              View Live Map
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { step: 1, title: 'Citizen reports need', desc: 'Quick icon-based form — works on slow networks and basic phones.', icon: '📱' },
    { step: 2, title: 'Volunteer verifies', desc: 'Trusted volunteers verify reports, check photos, and flag suspicious entries.', icon: '🔍' },
    { step: 3, title: 'NGO claims & delivers', desc: 'Organizations claim needs atomically — no double-claims. Deliver and upload proof.', icon: '🚚' },
    { step: 4, title: 'Resolved + audited', desc: 'All actions are logged in an immutable audit trail for transparency.', icon: '✅' },
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-bold text-ink mb-8">How it works</h2>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{s.step}</div>
              <div>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveMapPreviewSection() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-ink mb-4">Live Needs Map</h2>
        <p className="text-center text-sm text-muted mb-4">Current disaster needs across Nepal — updated in real time.</p>
        <div className="h-80 rounded-lg border border-ink/10 overflow-hidden">
          <LiveMap reports={[]} />
        </div>
      </div>
    </section>
  );
}

function ImpactStatsSection() {
  return (
    <section className="bg-primary/5 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-ink mb-6">Real-time Impact</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
          <StatCard icon={MapPin} value="—" label="Active Needs" />
          <StatCard icon={Shield} value="—" label="Verified" />
          <StatCard icon={HeartHandshake} value="—" label="Resolved" />
          <StatCard icon={Users} value="—" label="Responders" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div>
      <Icon size={24} className="mx-auto text-primary mb-1" />
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-center text-2xl font-bold text-ink mb-8">For whom</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard title="Citizens" desc="Report needs quickly with icon-based forms, voice memos, and offline support." icon={MapPin} />
          <FeatureCard title="Volunteers" desc="Verify reports, flag suspicious entries, and track your impact." icon={Shield} />
          <FeatureCard title="NGOs" desc="Claim needs atomically, manage deliveries, and maintain inventory." icon={HeartHandshake} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc, icon: Icon }: { title: string; desc: string; icon: React.ElementType }) {
  return (
    <div className="rounded-lg border border-ink/10 p-5 text-center">
      <Icon size={32} className="mx-auto text-primary mb-3" />
      <h3 className="font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-muted">{desc}</p>
    </div>
  );
}

function FooterSection() {
  return (
    <footer className="border-t border-ink/10 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-muted">
        <p>© 2026 Saajha Rahat — Open coordination platform for disaster response in Nepal.</p>
        <p className="mt-1">A community project. Source available.</p>
      </div>
    </footer>
  );
}
