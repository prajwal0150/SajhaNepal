import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/saajha-rahat'),
  JWT_ACCESS_SECRET: z.string().default('dev_access_secret_change_me'),
  JWT_REFRESH_SECRET: z.string().default('dev_refresh_secret_change_me'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  SMS_PROVIDER: z.string().optional().default(''),
  SMS_API_KEY: z.string().optional().default(''),
  SMS_INBOUND_KEY: z.string().default('dev_sms_inbound_key'),
  VOICE_PROVIDER: z.string().optional().default(''),
  VOICE_API_KEY: z.string().optional().default(''),
  TRANSCRIPTION_API_KEY: z.string().optional().default(''),
  PAYMENT_PROVIDER: z.string().optional().default(''),
  PAYMENT_API_KEY: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isProd = env.NODE_ENV === 'production';
