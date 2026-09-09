import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/format';

const baseField =
  'w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 ' +
  'transition-colors focus:border-primary focus:outline-2 focus:outline-primary/30 disabled:opacity-60';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  function Input({ className, error, ...rest }, ref) {
    return <input ref={ref} aria-invalid={Boolean(error)} className={cn(baseField, 'h-10', error && 'border-critical', className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { error?: string }>(
  function Select({ className, error, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(baseField, 'h-10', error && 'border-critical', className)} {...rest}>
        {children}
      </select>
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  function Textarea({ className, error, ...rest }, ref) {
    return <textarea ref={ref} rows={4} className={cn(baseField, error && 'border-critical', className)} {...rest} />;
  },
);

export function Field({ label, htmlFor, error, children, hint }: { label: string; htmlFor?: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p role="alert" className="text-xs text-critical">{error}</p>}
    </div>
  );
}
