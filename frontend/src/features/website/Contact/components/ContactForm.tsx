import { useState } from 'react';
import { Mail, Phone, Send, CircleCheck } from 'lucide-react';
import type { ContactCategory, ContactIconKey } from '../types/contactTypes';

const CATEGORIES: { value: ContactCategory; label: string; ne: string; icon: ContactIconKey }[] = [
  { value: 'need', label: 'Report a need', ne: 'एउटा जरुरी आवश्यकता बताउनुहोस्', icon: 'pen' },
  { value: 'volunteer', label: 'Become a volunteer', ne: 'स्वयंसेवक बन्नुहोस्', icon: 'send' },
  { value: 'ngo', label: 'NGO / organization', ne: 'संगठन / संस्था', icon: 'send' },
  { value: 'government', label: 'Government access', ne: 'सरकारी पहुँच', icon: 'send' },
  { value: 'general', label: 'General inquiry', ne: 'सामान्य प्रश्न', icon: 'mail' },
];

type MessageStatus = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<MessageStatus>('idle');
  const [values, setValues] = useState({
    name: '',
    contact: '',
    category: 'general' as ContactCategory,
    message: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const nameOk = values.name.trim().length >= 2;
  const contactOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact.trim())
    ? 'email'
    : values.contact.trim().length >= 7
      ? 'phone'
      : false;
  const messageOk = values.message.trim().length >= 10;
  const valid = nameOk && contactOk && messageOk;

  function fieldError(nameKey: string): string | null {
    if (!touched[nameKey]) return null;
    if (nameKey === 'name' && !nameOk) return 'Minimum 2 characters';
    if (nameKey === 'contact') {
      if (!values.contact.trim()) return 'Phone or email required';
      if (!contactOk) return 'Enter a valid phone or email';
    }
    if (nameKey === 'message' && !messageOk) return 'At least 10 characters';
    return null;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name: key, value } = e.target;
    setValues((v) => ({ ...v, [key]: value }));
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameOk || !contactOk || !messageOk) {
      setTouched({ name: true, contact: true, message: true });
      return;
    }
    setStatus('sending');
    // Demo submit — no real backend yet. Replace with API call when ready.
    setTimeout(() => {
      setStatus('sent');
      setValues({ name: '', contact: '', category: 'general', message: '' });
      setTouched({});
      setTimeout(() => setStatus('idle'), 4000);
    }, 1100);
  }

  return (
    <section id="contact-form" className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="Send us a message">
      <div className="mx-auto max-w-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Get in touch</p>
        <h2 className="text-lg font-extrabold text-ink sm:text-xl">Send us a message</h2>
        <p className="text-xs text-muted sm:text-[13px]">
          Tell us what you need or who you are — we'll reply in English or नेपाली।
        </p>

        <div className="mt-3 rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
          {status === 'sent' ? (
            <div className="flex items-start gap-3 rounded-lg border border-success/40 bg-success/5 p-3">
              <CircleCheck size={18} className="text-success shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-[13px] font-bold text-ink">Message received.</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  We'll reply within one working day (24/7 for urgent needs — use the hotline below).
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-2.5">
                <label htmlFor="cf-name" className="mb-1 block text-[11px] font-semibold text-ink">
                  Your name <span className="text-critical">*</span>
                </label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onInput={handleChange}
                  onBlur={handleBlur}
                  placeholder="Santosh Sharma"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldError('name') ? 'border-critical bg-critical/5' : 'border-ink/20'}`}
                />
                {fieldError('name') ? (
                  <p className="mt-1 text-[10px] text-critical">{fieldError('name')}</p>
                ) : null}
              </div>

              <div className="mb-2.5">
                <label htmlFor="cf-contact" className="mb-1 block text-[11px] font-semibold text-ink">
                  Phone <span className="text-muted">or</span> email <span className="text-critical">*</span>
                </label>
                <input
                  id="cf-contact"
                  name="contact"
                  type="text"
                  autoComplete="tel"
                  value={values.contact}
                  onInput={handleChange}
                  onBlur={handleBlur}
                  placeholder="+977 98000 00000  or  you@example.org"
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldError('contact') ? 'border-critical bg-critical/5' : 'border-ink/20'}`}
                />
                {fieldError('contact') ? (
                  <p className="mt-1 text-[10px] text-critical">{fieldError('contact')}</p>
                ) : (
                  <p className="mt-1 text-[10px] text-muted">
                    We only use this to reply to you — never shared publicly.
                  </p>
                )}
              </div>

              <div className="mb-2.5">
                <label htmlFor="cf-category" className="mb-1 block text-[11px] font-semibold text-ink">
                  What's this about?
                </label>
                <select
                  id="cf-category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="text-ink">
                      {c.label} · {c.ne}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="cf-message" className="mb-1 block text-[11px] font-semibold text-ink">
                  Your message <span className="text-critical">*</span>
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={4}
                  value={values.message}
                  onInput={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe what's happening, where, and when."
                  className={`w-full resize-none rounded-lg border bg-white px-3 py-2 text-[13px] text-ink placeholder:text-muted transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${fieldError('message') ? 'border-critical bg-critical/5' : 'border-ink/20'}`}
                />
                {fieldError('message') ? (
                  <p className="mt-1 text-[10px] text-critical">{fieldError('message')}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-bold text-white transition hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/50 ${status === 'sending' ? 'relative' : ''}`}
              >
                {status === 'sending' ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} aria-hidden /> SEND MESSAGE
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Phone size={12} className="text-primary" aria-hidden /> Urgent? Call +977 01 5550 010
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail size={12} className="text-secondary" aria-hidden /> help@saajharahat.org
          </span>
        </div>
      </div>
    </section>
  );
}

