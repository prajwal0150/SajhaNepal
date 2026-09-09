import type { Hazard } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchHazards(): Promise<Hazard[]> {
  const { data } = await api.get<ApiEnvelope<Hazard[]>>('/hazards');
  return data.data;
}

export async function createHazard(payload: Record<string, unknown>): Promise<Hazard> {
  const { data } = await api.post<ApiEnvelope<Hazard>>('/hazards', payload);
  return data.data;
}

export async function fetchGovernmentFeedStatus(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/integrations/government/hazard-feed');
  return data.data;
}
