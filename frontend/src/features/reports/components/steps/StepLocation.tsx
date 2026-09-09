import { Suspense, lazy } from 'react';
import type { ReportFormState, ReportFormSetter } from '../reportFormState';
import { Field, Input, Select, Textarea } from '@shared/components/Fields';
import { MapPin, Crosshair } from 'lucide-react';
import { PROVINCES, DISTRICTS } from '@shared/constants';
import { cn } from '@shared/utils/format';

export function StepDetails({ form, set }: { form: ReportFormState; set: ReportFormSetter }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Tell us more</h2>
      <Field label="Short title" htmlFor="rf-title" hint="e.g. No drinking water in Ward 4">
        <Input id="rf-title" value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={200} />
      </Field>
      <Field label="Description" htmlFor="rf-desc" hint="What happened? Who needs help? (min 10 characters)">
        <Textarea id="rf-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={5} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="People affected" htmlFor="rf-affected">
          <Input id="rf-affected" type="number" min={1} value={form.affectedPeople} onChange={(e) => set('affectedPeople', e.target.value)} />
        </Field>
        <Field label="Quantity needed" htmlFor="rf-qty">
          <Input id="rf-qty" type="number" min={1} value={form.requiredQuantity} onChange={(e) => set('requiredQuantity', e.target.value)} />
        </Field>
        <Field label="Unit" htmlFor="rf-unit">
          <Input id="rf-unit" value={form.quantityUnit} onChange={(e) => set('quantityUnit', e.target.value)} placeholder="jerrycans, kits…" />
        </Field>
      </div>
    </div>
  );
}

export function StepLocation({ form, set, geoStatus, onGps, onPick }: {
  form: ReportFormState;
  set: ReportFormSetter;
  geoStatus: 'idle' | 'locating' | 'ok' | 'failed';
  onGps: () => void;
  onPick: (e: { lat: number; lng: number }) => void;
}) {
  const districts = DISTRICTS[form.province] ?? [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Where are you?</h2>
      <p className="text-sm text-muted">GPS is optional — address fields are enough.</p>

      <button
        type="button"
        onClick={onGps}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-sm font-semibold transition-colors',
          geoStatus === 'ok' ? 'border-success bg-success/5 text-success' : 'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10',
        )}
      >
        <Crosshair size={18} aria-hidden />
        {geoStatus === 'locating' ? 'Locating…'
          : geoStatus === 'ok' ? `GPS set (${form.lat?.toFixed(4)}, ${form.lng?.toFixed(4)})`
          : geoStatus === 'failed' ? 'GPS unavailable — use fields below'
          : 'Use my current location (GPS)'}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Province" htmlFor="rf-province">
          <Select id="rf-province" value={form.province} onChange={(e) => { set('province', e.target.value); set('district', ''); }}>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="District" htmlFor="rf-district">
          <Select id="rf-district" value={form.district} onChange={(e) => set('district', e.target.value)}>
            <option value="">Select district…</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </Field>
        <Field label="Municipality / Palika" htmlFor="rf-muni">
          <Input id="rf-muni" value={form.municipality} onChange={(e) => set('municipality', e.target.value)} />
        </Field>
        <Field label="Ward" htmlFor="rf-ward">
          <Input id="rf-ward" type="number" min={1} max={35} value={form.ward} onChange={(e) => set('ward', e.target.value)} />
        </Field>
      </div>
      <Field label="Landmark / address description" htmlFor="rf-address" hint="e.g. near the school, behind the temple">
        <Input id="rf-address" value={form.address} onChange={(e) => set('address', e.target.value)} />
      </Field>
      <MiniMapPicker lat={form.lat} lng={form.lng} onPick={onPick} />
    </div>
  );
}

const LocationPicker = lazy(() => import('@features/map/components/LocationPicker'));

function MiniMapPicker({ lat, lng, onPick }: { lat: number | null; lng: number | null; onPick: (e: { lat: number; lng: number }) => void }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1 text-sm font-medium text-ink"><MapPin size={14} aria-hidden /> Pin exact spot (optional)</p>
      <div className="h-48 overflow-hidden rounded-lg border border-ink/10">
        <Suspense fallback={<div className="flex h-full items-center justify-center text-xs text-muted">Loading map…</div>}>
          <LocationPicker lat={lat ?? 28.3949} lng={lng ?? 84.124} onPick={onPick} />
        </Suspense>
      </div>
    </div>
  );
}
