import type { Verification, Delivery } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchVerificationsForReport(reportId: string): Promise<Verification[]> {
  const { data } = await api.get<ApiEnvelope<Verification[]>>('/verifications', { params: { reportId } });
  return data.data;
}

export async function fetchDeliveriesForReport(reportId: string): Promise<Delivery[]> {
  const { data } = await api.get<ApiEnvelope<Delivery[]>>('/deliveries', { params: { reportId } });
  return data.data;
}
