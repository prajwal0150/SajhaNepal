import { useState, type FormEvent } from 'react';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { HeartHandshake } from 'lucide-react';
import { Input, Select, Field } from '@shared/components/Fields';
import { Link } from 'react-router-dom';
import { PROVINCES, DISTRICTS } from '@shared/constants';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register, submitting, error, clearError } = useAuth();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    role: 'CITIZEN', province: 'Bagmati', district: 'Kathmandu',
  });

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    clearError();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await register({ ...form, district: form.district, municipality: '' });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <Card className="w-full max-w-md p-8 animate-fade-up">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white">
            <HeartHandshake size={26} aria-hidden />
          </div>
          <h1 className="text-xl font-bold text-ink">Join Saajha Rahat</h1>
          <p className="text-sm text-muted">Report needs, verify, or coordinate relief</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Full name" htmlFor="fullName">
            <Input id="fullName" value={form.fullName} onChange={set('fullName')} required minLength={2} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" value={form.email} onChange={set('email')} required />
          </Field>
          <Field label="Phone (optional)" htmlFor="phone">
            <Input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="98XXXXXXXX" />
          </Field>
          <Field label="Password" htmlFor="password" hint="At least 8 characters">
            <Input id="password" type="password" value={form.password} onChange={set('password')} required minLength={8} error={error || undefined} />
          </Field>
          <Field label="I am a…" htmlFor="role">
            <Select id="role" value={form.role} onChange={set('role')}>
              <option value="CITIZEN">Citizen — report needs</option>
              <option value="VOLUNTEER">Volunteer — verify reports</option>
              <option value="NGO">NGO / responder — claim & deliver</option>
              <option value="GOVERNMENT">Government — monitor response</option>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Province" htmlFor="province">
              <Select id="province" value={form.province} onChange={set('province')}>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="District" htmlFor="district">
              <Select id="district" value={form.district} onChange={set('district')}>
                {(DISTRICTS[form.province] ?? []).map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
          </div>
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
