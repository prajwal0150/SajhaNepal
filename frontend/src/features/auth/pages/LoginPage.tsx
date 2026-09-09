import { useState, type FormEvent } from 'react';
import { Button } from '@shared/components/Button';
import { Card } from '@shared/components/Card';
import { HeartHandshake } from 'lucide-react';
import { Input, Field } from '@shared/components/Fields';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, submitting, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <Card className="w-full max-w-md p-8 animate-fade-up">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <HeartHandshake size={26} aria-hidden />
          </div>
          <h1 className="text-xl font-bold text-ink">Saajha Rahat</h1>
          <p className="text-sm text-muted">साझा राहत — sign in to coordinate relief</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field label="Email or phone" htmlFor="email">
            <Input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
              error={error || undefined}
            />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              required
            />
          </Field>
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            Sign in
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
          <Link to="/register" className="font-medium text-primary hover:underline">Create account</Link>
        </div>
      </Card>
    </div>
  );
}
