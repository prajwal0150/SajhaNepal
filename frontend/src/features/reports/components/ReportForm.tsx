import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/Store';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { Check, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react';
import { INITIAL_REPORT_FORM, type ReportFormState } from './reportFormState';
import { StepDetails, StepLocation } from './steps/StepLocation';
import { StepMedia, StepContact } from './steps/StepMedia';
import { StepNeed, StepUrgency } from './steps/StepNeed';
import { cn } from '@shared/utils/format';
import { createReportThunk } from '../redux/reportThunk';
import { pushToast } from '@shared/redux/toastSlice';
import { useNavigate } from 'react-router-dom';

const STEPS = ['Need', 'Urgency', 'Details', 'Location', 'Media', 'Contact'];

export function ReportForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'ok' | 'failed'>('idle');
  const [images, setImages] = useState<File[]>([]);
  const [voice, setVoice] = useState<File | null>(null);
  const [form, setForm] = useState<ReportFormState>(INITIAL_REPORT_FORM);

  const set: <K extends keyof ReportFormState>(key: K, value: ReportFormState[K]) => void =
    (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = (): boolean => {
    switch (step) {
      case 0: return Boolean(form.needType);
      case 1: return Boolean(form.urgency);
      case 2: return form.title.trim().length >= 5 && form.description.trim().length >= 10;
      case 3: return Boolean(form.district) && form.lat !== null && form.lng !== null;
      default: return true;
    }
  };

  function useGps() {
    if (!navigator.geolocation) {
      setGeoStatus('failed');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lat', Number(pos.coords.latitude.toFixed(6)));
        set('lng', Number(pos.coords.longitude.toFixed(6)));
        setGeoStatus('ok');
      },
      () => setGeoStatus('failed'),
      { timeout: 8000 },
    );
  }

  function onPickLocation(e: { lat: number; lng: number }) {
    set('lat', e.lat);
    set('lng', e.lng);
    setGeoStatus('ok');
  }

  async function onSubmit() {
    if (!form.needType) return;
    setSubmitting(true);
    setError(null);
    try {
      await dispatch(createReportThunk({
        title: form.title,
        description: form.description,
        needType: form.needType,
        urgency: form.urgency,
        longitude: form.lng ?? 84.124,
        latitude: form.lat ?? 28.3949,
        district: form.district || 'Unknown',
        municipality: form.municipality,
        ward: form.ward ? Number(form.ward) : undefined,
        address: form.address,
        affectedPeople: Number(form.affectedPeople) || 1,
        requiredQuantity: Number(form.requiredQuantity) || 1,
        quantityUnit: form.quantityUnit,
        reporterContact: form.contact,
        consent: form.consent,
        images,
        voice,
      })).unwrap();
      pushToast({ kind: 'success', message: 'Report submitted. Volunteers will verify it shortly.' });
      navigate('/my-reports');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      if (message === 'REPORT_QUEUED_OFFLINE') {
        pushToast({ kind: 'warning', message: 'You are offline — report queued and will sync automatically.' });
        navigate('/my-reports');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-6 flex items-center gap-1" aria-label="Form progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                i < step ? 'border-success bg-success text-white' : i === step ? 'border-primary bg-primary text-white' : 'border-ink/15 bg-white text-muted',
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={cn('hidden text-[11px] font-medium sm:block', i === step ? 'text-primary' : 'text-muted')}>{label}</span>
          </li>
        ))}
      </ol>

      <Card className="p-5 sm:p-6">
        {step === 0 && <StepNeed form={form} set={set} />}
        {step === 1 && <StepUrgency form={form} set={set} />}
        {step === 2 && <StepDetails form={form} set={set} />}
        {step === 3 && <StepLocation form={form} set={set} geoStatus={geoStatus} onGps={useGps} onPick={onPickLocation} />}
        {step === 4 && <StepMedia images={images} setImages={setImages} voice={voice} setVoice={setVoice} />}
        {step === 5 && <StepContact form={form} set={set} error={error} />}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || submitting} icon={<ChevronLeft size={16} />}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} icon={<ChevronRight size={16} />}>
              Next
            </Button>
          ) : (
            <Button variant="critical" size="lg" onClick={onSubmit} loading={submitting} disabled={!form.consent}>
              Submit report
            </Button>
          )}
        </div>
        {!navigator.onLine && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-warning/10 px-3 py-2 text-xs font-medium text-warning">
            <WifiOff size={14} aria-hidden /> You are offline — the report will be queued and synced when connection returns.
          </p>
        )}
      </Card>
    </div>
  );
}
