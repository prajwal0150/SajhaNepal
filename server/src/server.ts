import http from 'http';
import { createApp } from './app';
import { env, isDev } from './config/environment';
import { connectDatabase } from './config/database';
import { initSocketServer } from './sockets';
import { logEvent } from './core/logger/logger';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
  } catch (err) {
    logEvent('database', '❌ MongoDB connection failed', err);
    logEvent('database', `Check MONGODB_URI in server/.env (current: ${env.MONGODB_URI})`);
    process.exit(1);
  }

  const app = createApp();
  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  httpServer.listen(env.PORT, () => {
    logEvent('server', `🚀 Saajha Rahat API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
    if (isDev) {
      logEvent('server', `Client expected at ${env.CLIENT_URL} · REST base: /api/v1`);
    }
  });

  const shutdown = async (signal: string): Promise<void> => {
    logEvent('server', `${signal} received — shutting down`);
    httpServer.close();
    const { disconnectDatabase } = await import('./config/database');
    await disconnectDatabase();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void bootstrap();
