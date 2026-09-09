import { useState, type FormEvent } from 'react';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { Input, Field } from '@shared/components/Fields';
import { Link } from 'react-router-dom';
import { api } from '@shared/lib/axios';
import { extractApiError } from '@shared/lib/axios';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setDevToken((data.data?.resetToken as string) ?? null);
      setStatus('done');
    } catch (err) {
      setError(extractApiError(err));
      setStatus('idle');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md p-8 animate-fade-up">
        <h1 className="text-xl font-bold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-muted">Enter your account email to receive a reset token.</p>

        {status === 'done' ? (
          <div className="mt-4 space-y-3">
            <p className="rounded-lg bg-secondary/10 px-3 py-2 text-sm text-secondary">
              Reset token generated. No email provider is configured in this deployment.
            </p>
            {devToken && (
              <p className="break-all rounded-lg bg-surface px-3 py-2 font-mono text-xs text-ink">
                {devToken}
                <span className="mt-1 block font-sans text-[11px] text-muted">(development mode — token shown directly)</span>
              </p>
            )}
            <Link to={`/reset-password${devToken ? `?token=${devToken}` : ''}`} className="block">
              <Button fullWidth>Continue to reset</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
            <Field label="Email" htmlFor="fp-email">
              <Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required error={error || undefined} />
            </Field>
            <Button type="submit" fullWidth loading={status === 'loading'}>Get reset token</Button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}

export function ResetPasswordPage() {
  const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token') ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('done');
    } catch (err) {
      setError(extractApiError(err));
      setStatus('idle');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md p-8 animate-fade-up">
        <h1 className="text-xl font-bold text-ink">Choose a new password</h1>
        {status === 'done' ? (
          <div className="mt-4 space-y-3">
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Password reset successfully.</p>
            <Link to="/login"><Button fullWidth>Sign in</Button></Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
            <Field label="Reset token" htmlFor="rp-token">
              <Input id="rp-token" value={token} onChange={(e) => setToken(e.target.value)} required />
            </Field>
            <Field label="New password" htmlFor="rp-password" hint="At least 8 characters">
              <Input id="rp-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </Field>
            <Field label="Confirm password" htmlFor="rp-confirm">
              <Input id="rp-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required error={error || undefined} />
            </Field>
            <Button type="submit" fullWidth loading={status === 'loading'}>Reset password</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
