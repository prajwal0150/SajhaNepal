import type { Report } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export interface ClaimPayload {
  reportId: string;
  organizationId: string;
  notes?: string;
}

export async function claimReport(payload: ClaimPayload): Promise<Report> {
  const { data } = await api.post<ApiEnvelope<Report>>('/claims', payload);
  return data.data;
}

export async function fetchAvailableNeeds(filters?: Record<string, unknown>): Promise<Report[]> {
  const { data } = await api.get<ApiEnvelope<Report[]>>('/reports', {
    params: { status: 'VERIFIED', limit: 50, ...filters },
  });
  return data.data.filter((r) => r.status === 'VERIFIED');
}

export async function fetchMyClaims(): Promise<Report[]> {
  const { data } = await api.get<ApiEnvelope<Report[]>>('/claims/mine');
  return data.data;
}

export async function startOperation(reportId: string): Promise<Report> {
  const { data } = await api.patch<ApiEnvelope<Report>>(`/claims/${reportId}/start`);
  return data.data;
}

export async function releaseClaim(reportId: string): Promise<Report> {
  const { data } = await api.patch<ApiEnvelope<Report>>(`/claims/${reportId}/cancel`);
  return data.data;
}
