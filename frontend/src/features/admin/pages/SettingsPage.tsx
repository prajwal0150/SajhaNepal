import { useEffect, useState } from 'react';
import { Button } from '@shared/components/Button';
import { Card, LoadingSkeleton, ErrorState } from '@shared/components/Card';
import { api, type ApiEnvelope } from '@shared/lib/axios';
import { pushToast } from '@shared/redux/toastSlice';

export function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/admin/settings');
      setSettings(data.data);
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed'); } finally { setLoading(false); }
  }

  async function save() {
    setSaving(true);
    try {
      await api.patch('/admin/settings', settings);
      pushToast({ kind: 'success', message: 'Settings saved' });
    } catch (err) {
      pushToast({ kind: 'error', message: err instanceof Error ? err.message : 'Save failed' });
    } finally { setSaving(false); }
  }

  if (loading) return <LoadingSkeleton rows={4} />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ink mb-4">Platform Settings</h1>
      {settings && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Maintenance mode</label>
            <input type="checkbox" checked={settings.maintenanceMode === true}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Allow self registration</label>
            <input type="checkbox" checked={settings.allowSelfRegistration !== false}
              onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })} />
          </div>
          <div>
            <label className="block text-sm font-medium">Emergency message</label>
            <textarea className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2"
              value={settings.emergencyMessage as string ?? ''}
              onChange={(e) => setSettings({ ...settings, emergencyMessage: e.target.value })} rows={3} />
          </div>
          <Button variant="success" onClick={save} loading={saving}>Save settings</Button>
        </Card>
      )}
    </div>
  );
}
