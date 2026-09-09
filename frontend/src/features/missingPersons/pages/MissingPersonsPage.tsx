import { useEffect, useState } from 'react';
import type { MissingPerson } from '@shared/types';
import { Button } from '@shared/components/Button';
import { Card, LoadingSkeleton, ErrorState, EmptyState } from '@shared/components/Card';
import { Modal } from '@shared/components/Modal';
import { Plus } from 'lucide-react';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { formatDate } from '@shared/utils/format';
import { useAuth } from '@features/auth/hooks/useAuth';

export function MissingPersonsPage() {
  const [items, setItems] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { role } = useAuth();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<MissingPerson[]>>('/missing-persons', { params: { status: 'SEARCHING', limit: 50 } });
      setItems(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Missing Persons</h1>
        {role && (
          <Button size="sm" onClick={() => setShowForm(true)} icon={<Plus size={16} />}>
            Report missing person
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState title="No missing persons reports" description="No active missing persons reports at this time." />
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <Card key={p._id} className="p-4">
              <div className="flex gap-4">
                {p.photo && <img src={p.photo} alt={p.fullName} className="h-20 w-20 rounded-lg object-cover" loading="lazy" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-ink">{p.fullName}</h3>
                  <p className="text-sm text-muted">Age: {p.age ?? '—'} · Gender: {p.gender ?? '—'}</p>
                  <p className="text-sm text-muted">Last seen: {p.lastSeenLocation}{p.lastSeenWard ? ` (Ward ${p.lastSeenWard})` : ''}</p>
                  <p className="mt-1 text-xs text-muted">{formatDate(p.createdAt)}</p>
                </div>
                <span className={`text-xs font-medium ${p.status === 'SEARCHING' ? 'text-critical' : p.status === 'FOUND_SAFE' ? 'text-success' : 'text-muted'}`}>{p.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <MissingPersonForm onClose={() => setShowForm(false)} onCreated={load} />}
    </div>
  );
}

function MissingPersonForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: '', age: '', gender: '', lastSeenLocation: '', lastSeenWard: '', description: '', contactPhone: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('fullName', form.fullName);
      payload.append('age', form.age);
      payload.append('gender', form.gender);
      payload.append('lastSeenLocation', form.lastSeenLocation);
      payload.append('lastSeenWard', form.lastSeenWard);
      payload.append('description', form.description);
      payload.append('contactPhone', form.contactPhone);
      await api.post<ApiEnvelope<unknown>>('/missing-persons', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      onCreated();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create report');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Report Missing Person" open={true} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Last seen location" value={form.lastSeenLocation} onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })} required />
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Ward" value={form.lastSeenWard} onChange={(e) => setForm({ ...form, lastSeenWard: e.target.value })} />
        <textarea className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
        <input className="w-full rounded-lg border border-ink/15 px-3 py-2" placeholder="Contact phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        <Button type="submit" loading={submitting} fullWidth>Create report</Button>
      </form>
    </Modal>
    );
}

