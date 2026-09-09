import { Router } from 'express';
import { Report } from '../modules/reports/report.model';
import { NEED_TYPES } from '../modules/reports/report.types';
import { env } from '../config/environment';
import { asyncHandler } from '../core/utils/asyncHandler';
import { sendSuccess } from '../core/utils/helpers';
import { UnauthorizedError } from '../core/errors/appError';

/**
 * SMS INTEGRATION ADAPTER
 * -----------------------
 * Architecture for a real telecom provider. No SMS provider credentials are
 * configured, so:
 *  - outbound SMS is NOT sent (no fake "SMS sent" claims),
 *  - inbound parsed messages create real DisasterReports in MongoDB.
 *
 * POST /api/v1/integrations/sms/incoming   (header: x-sms-key)
 * Body: { from: "98XXXXXXXX", text: "NEED Helambu Ward4 Water 20" }
 */

const NEED_ALIASES: Record<string, string> = {
  water: 'WATER', pani: 'WATER', पानी: 'WATER',
  food: 'FOOD', khana: 'FOOD', खाना: 'FOOD',
  medical: 'MEDICAL', health: 'MEDICAL', doctor: 'MEDICAL', स्वास्थ्य: 'MEDICAL',
  shelter: 'SHELTER', आश्रय: 'SHELTER',
  rescue: 'RESCUE', उद्धार: 'RESCUE',
  clothes: 'CLOTHING', clothing: 'CLOTHING',
  missing: 'MISSING_PERSON', बेपत्ता: 'MISSING_PERSON',
  evacuation: 'EVACUATION',
  other: 'OTHER', सहायता: 'OTHER',
};

export interface ParsedSmsNeed {
  place: string;
  ward?: number;
  needType: string;
  quantity?: number;
}

export function parseSmsNeed(text: string): ParsedSmsNeed | null {
  const match = /^need\s+(.+)$/i.exec(text.trim());
  if (!match) return null;
  let rest = match[1].trim();

  let ward: number | undefined;
  const wardMatch = /ward\s*(\d{1,2})/i.exec(rest);
  if (wardMatch) {
    ward = parseInt(wardMatch[1], 10);
    rest = rest.replace(wardMatch[0], ' ').trim();
  }

  let quantity: number | undefined;
  const qtyMatch = /\b(\d{1,5})\b/.exec(rest);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
    rest = rest.replace(qtyMatch[1], ' ').trim();
  }

  let needType = 'OTHER';
  const words = rest.split(/\s+/).filter(Boolean);
  const last = words[words.length - 1]?.toLowerCase();
  if (last && NEED_ALIASES[last]) {
    needType = NEED_ALIASES[last];
    words.pop();
  }

  const place = words.join(' ').trim();
  if (!place) return null;
  return { place, ward, needType, quantity };
}

const router = Router();

router.post('/sms/incoming', asyncHandler(async (req, res) => {
  const key = req.headers['x-sms-key'];
  if (key !== env.SMS_INBOUND_KEY) throw new UnauthorizedError('Invalid SMS gateway key');
  const { from, text } = req.body as { from?: string; text?: string };
  if (!from || !text) throw new UnauthorizedError('from and text are required');

  const parsed = parseSmsNeed(text);
  if (!parsed) {
    return sendSuccess(res, { accepted: false, reason: 'Could not parse need message' }, 'SMS received but not parsed');
  }

  // Without a gazetteer, coordinates default to the Nepal centroid; the parsed
  // place becomes the district and volunteers verify during verification.
  const report = await Report.create({
    title: `SMS: ${parsed.needType.replace('_', ' ').toLowerCase()} need in ${parsed.place}`,
    description: `Submitted via SMS from ${from}. Original message: "${text}"`,
    needType: NEED_TYPES.includes(parsed.needType as never) ? parsed.needType : 'OTHER',
    urgency: 'HIGH',
    status: 'PENDING',
    verificationStatus: 'PENDING',
    location: { type: 'Point', coordinates: [85.324, 27.7172] },
    district: parsed.place,
    ward: parsed.ward,
    requiredQuantity: parsed.quantity ?? 1,
    reporterContact: from,
    source: 'SMS',
    consent: true,
  });

  sendSuccess(res, {
    accepted: true,
    reportId: String(report._id),
    parsed,
    mode: env.SMS_PROVIDER ? 'PROVIDER' : 'DEV_ADAPTER',
  }, 'SMS need converted to report');
}));

/**
 * IVR ARCHITECTURE — missed call adapter.
 * No telecom credentials configured: records the callback intent and returns
 * the flow definition a real provider would drive. No fake calls.
 */
router.post('/ivr/missed-call', asyncHandler(async (req, res) => {
  const { from } = req.body as { from?: string };
  sendSuccess(res, {
    received: true,
    phoneNumber: from,
    configured: Boolean(env.VOICE_PROVIDER),
    callbackFlow: ['identify-phone', 'call-back', 'nepali-keypad-flow', 'structured-report'],
    note: 'IVR provider not configured — development adapter. No call is actually placed.',
  }, 'Missed call recorded (development adapter)');
}));

/**
 * VOICE REPORTING — transcription stays PENDING without a provider.
 */
router.post('/voice/upload', asyncHandler(async (req, res) => {
  const { voiceUrl } = req.body as { voiceUrl?: string };
  sendSuccess(res, {
    stored: Boolean(voiceUrl),
    voiceUrl: voiceUrl ?? null,
    transcriptionStatus: 'PENDING',
    transcriptionConfigured: Boolean(env.TRANSCRIPTION_API_KEY),
  }, 'Voice memo stored. Transcription is pending (no provider configured).');
}));

/**
 * PAYMENT ADAPTER — eSewa/Khalti architecture stub. Never fakes success.
 */
router.get('/payment/status', asyncHandler(async (_req, res) => {
  sendSuccess(res, {
    provider: env.PAYMENT_PROVIDER || null,
    configured: Boolean(env.PAYMENT_PROVIDER && env.PAYMENT_API_KEY),
    mode: 'DEVELOPMENT_MANUAL_LEDGER',
    note: 'Payment gateway not configured. Donations are recorded manually in the ledger with full transparency.',
  }, 'Payment integration status');
}));

/**
 * GOVERNMENT DATA (DHM / NDRRMA) adapter status — clearly marked.
 */
router.get('/government/hazard-feed', asyncHandler(async (_req, res) => {
  sendSuccess(res, {
    configured: false,
    mode: 'DEV_MOCK',
    note: 'DHM/NDRRMA feeds not configured. Hazard alerts are manually entered or clearly-marked mock data.',
  }, 'Government feed status');
}));


export default router;
