import { ReportForm } from '../components/ReportForm';

export function ReportNeedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-ink">Report a Need</h1>
        <p className="text-sm text-muted">आवश्यकता रिपोर्ट गर्नुहोस् — it takes less than 2 minutes. Offline-friendly.</p>
      </div>
      <ReportForm />
    </div>
  );
}
