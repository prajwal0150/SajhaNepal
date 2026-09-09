import type { NeedType } from '@shared/types';
import type { ReportFormState, ReportFormSetter } from '../reportFormState';
import { NEED_TYPES, NEED_TYPE_META } from '@shared/constants';
import { cn } from '@shared/utils/format';

export function StepNeed({ form, set }: { form: ReportFormState; set: ReportFormSetter }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">What do you need?</h2>
      <p className="mb-4 text-sm text-muted">आवश्यकता छान्नुहोस् — choose one</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {NEED_TYPES.map((t) => {
          const meta = NEED_TYPE_META[t as NeedType];
          const active = form.needType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => set('needType', t)}
              aria-pressed={active}
              className={cn(
                'flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-lg border-2 p-3 text-center transition-all active:scale-[0.97]',
                active ? 'border-primary bg-primary/5' : 'border-ink/10 bg-white hover:border-primary/40',
              )}
            >
              <span className="text-3xl" aria-hidden>{meta.emoji}</span>
              <span className="text-sm font-semibold text-ink">{meta.en}</span>
              <span className="text-xs text-muted">{meta.ne}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StepUrgency({ form, set }: { form: ReportFormState; set: ReportFormSetter }) {
  const options = [
    { value: 'CRITICAL', label: 'Life-threatening', ne: 'ज्यान जोखिम', color: 'border-critical bg-critical/5 text-critical' },
    { value: 'HIGH', label: 'Urgent', ne: 'तत्काल', color: 'border-warning bg-warning/5 text-warning' },
    { value: 'MEDIUM', label: 'Needed today', ne: 'आज चाहियो', color: 'border-primary bg-primary/5 text-primary' },
    { value: 'LOW', label: 'Can wait', ne: 'पछि पनि हुन्छ', color: 'border-success bg-success/5 text-success' },
  ];
  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">How urgent is it?</h2>
      <p className="mb-4 text-sm text-muted">कति आपतकालीन छ?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set('urgency', o.value)}
            aria-pressed={form.urgency === o.value}
            className={cn(
              'flex min-h-20 flex-col items-start justify-center rounded-lg border-2 p-4 text-left transition-all active:scale-[0.98]',
              form.urgency === o.value ? o.color : 'border-ink/10 bg-white hover:border-primary/40',
            )}
          >
            <span className="text-base font-bold">{o.label}</span>
            <span className="text-sm text-muted">{o.ne}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
