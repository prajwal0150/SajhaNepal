import type { ChangeEvent } from 'react';
import type { ReportFormState, ReportFormSetter } from '../reportFormState';
import { Field, Input } from '@shared/components/Fields';
import { Mic, ImagePlus } from 'lucide-react';

export function StepMedia({ images, setImages, voice, setVoice }: {
  images: File[];
  setImages: (f: File[]) => void;
  voice: File | null;
  setVoice: (f: File | null) => void;
}) {
  function onImages(e: ChangeEvent<HTMLInputElement>) {
    setImages(Array.from(e.target.files ?? []).slice(0, 5));
  }
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Photos & voice (optional)</h2>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/15 bg-surface text-sm font-medium text-muted hover:border-primary/40 hover:text-primary">
        <ImagePlus size={24} aria-hidden />
        {images.length ? `${images.length} photo(s) selected` : 'Add up to 5 photos'}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={onImages} />
      </label>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/15 bg-surface text-sm font-medium text-muted hover:border-primary/40 hover:text-primary">
        <Mic size={24} aria-hidden />
        {voice ? `Voice memo: ${voice.name.slice(0, 24)}` : 'Record / attach a voice memo'}
        <input
          type="file"
          accept="audio/webm,audio/ogg,audio/mpeg,audio/mp4,audio/wav,audio/aac"
          className="hidden"
          onChange={(e) => setVoice(e.target.files?.[0] ?? null)}
        />
      </label>
      <p className="text-xs text-muted">Voice transcription stays pending unless a transcription provider is configured. Photos are stored securely.</p>
    </div>
  );
}

export function StepContact({ form, set, error }: { form: ReportFormState; set: ReportFormSetter; error: string | null }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink">Contact & consent</h2>
      <Field label="Contact phone (optional but recommended)" htmlFor="rf-contact" hint="Responders may call you about this need">
        <Input id="rf-contact" type="tel" value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="98XXXXXXXX" />
      </Field>
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-ink/10 bg-surface p-4">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => set('consent', e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-primary"
          required
        />
        <span className="text-sm text-ink">
          I consent to sharing this report (including location and media) with verified volunteers and relief organizations for disaster response.
          <span className="mt-1 block text-xs text-muted">सहमति छु — यो रिपोर्ट राहत समन्वयका लागि साझा गरिनेछ। Contact details are never shown publicly.</span>
        </span>
      </label>
      {error && <p role="alert" className="rounded-lg bg-critical/10 px-3 py-2 text-sm text-critical">{error}</p>}
    </div>
  );
}
