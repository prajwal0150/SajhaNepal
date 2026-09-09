import type { Verification } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export interface VerificationPayload {
  reportId: string;
  decision: 'VERIFIED' | 'REJECTED' | 'FLAGGED';
  notes?: string;
  urgencyOverride?: string;
}

export async function verifyReport(payload: VerificationPayload): Promise<Record<string, unknown>> {
  const { data } = await api.post<ApiEnvelope<Record<string, unknown>>>('/verifications', payload);
  return data.data;
}

export async function fetchPendingReports(limit = 50): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/reports', {
    params: { status: 'PENDING', limit },
  });
  return data.data;
}

export async function fetchVerificationsForReport(reportId: string): Promise<Verification[]> {
  const { data } = await api.get<ApiEnvelope<Verification[]>>('/verifications', { params: { reportId } });
  return data.data;
}

export async function fetchMyVerifications(): Promise<Verification[]> {
  const { data } = await api.get<ApiEnvelope<Verification[]>>('/verifications/mine');
  return data.data;
}
