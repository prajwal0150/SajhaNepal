import morgan from 'morgan';
import { env } from '../../config/environment';

morgan.token('user', (req) => (req as unknown as { user?: { id?: string } }).user?.id ?? 'anon');

export const httpLogger = morgan(
  env.NODE_ENV === 'production'
    ? ':remote-addr :user :method :url :status :res[content-length] - :response-time ms'
    : ':method :url :status :response-time ms - :user',
  { skip: (_req, res) => env.NODE_ENV === 'test' && res.statusCode < 400 },
);

export function logEvent(scope: string, message: string, meta?: unknown): void {
  if (env.NODE_ENV === 'test') return;
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] [${scope}] ${message}`, meta ?? '');
}
