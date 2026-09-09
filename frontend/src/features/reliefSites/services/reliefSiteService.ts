import type { ReliefSite } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchReliefSites(params?: Record<string, unknown>): Promise<ReliefSite[]> {
  const { data } = await api.get<ApiEnvelope<ReliefSite[]>>('/relief-sites', { params });
  return data.data;
}

export async function fetchReliefSiteById(id: string): Promise<ReliefSite> {
  const { data } = await api.get<ApiEnvelope<ReliefSite>>(`/relief-sites/${id}`);
  return data.data;
}

export async function createReliefSite(payload: Record<string, unknown>): Promise<ReliefSite> {
  const { data } = await api.post<ApiEnvelope<ReliefSite>>('/relief-sites', payload);
  return data.data;
}

export async function updateReliefSite(id: string, payload: Record<string, unknown>): Promise<ReliefSite> {
  const { data } = await api.patch<ApiEnvelope<ReliefSite>>(`/relief-sites/${id}`, payload);
  return data.data;
}
