import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchOverview(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/overview');
  return data.data;
}

export async function fetchReportAnalytics(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/reports');
  return data.data;
}

export async function fetchPerformanceAnalytics(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/performance');
  return data.data;
}

export async function fetchShelterAnalytics(): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/analytics/shelters');
  return data.data;
}

export async function fetchInventoryUsage(): Promise<Record<string, unknown>[]> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>[]>>('/analytics/inventory-usage');
  return data.data;
}

export async function fetchMissingPersonsAnalytics(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/analytics/missing-persons');
  return data.data;
}
