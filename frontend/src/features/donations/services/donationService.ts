import type { Donation } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchDonations(): Promise<Donation[]> {
  const { data } = await api.get<ApiEnvelope<Donation[]>>('/donations');
  return data.data;
}

export async function createDonation(payload: Record<string, unknown>): Promise<Donation> {
  const { data } = await api.post<ApiEnvelope<Donation>>('/donations', payload);
  return data.data;
}

export async function fetchPaymentStatus(): Promise<Record<string, unknown>> {
  const { data } = await api.get<ApiEnvelope<Record<string, unknown>>>('/integrations/payment/status');
  return data.data;
}
