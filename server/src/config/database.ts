import mongoose from 'mongoose';
import { env } from './environment';

let connected = false;

export async function connectDatabase(uri?: string): Promise<typeof mongoose> {
  const target = uri ?? env.MONGODB_URI;
  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(target, { serverSelectionTimeoutMS: 10000 });
  connected = true;
  // eslint-disable-next-line no-console
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}

export async function disconnectDatabase(): Promise<void> {
  if (connected) {
    await mongoose.disconnect();
    connected = false;
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
