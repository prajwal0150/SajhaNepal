import type { Delivery } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export interface DeliveryPayload {
  reportId: string;
  organizationId: string;
  quantityDelivered: number;
  recipientCount?: number;
  notes?: string;
  proofImages?: File[];
}

export async function createDelivery(payload: DeliveryPayload): Promise<{ delivery: Delivery; report: Record<string, unknown> }> {
  const form = new FormData();
  form.append('reportId', payload.reportId);
  form.append('organizationId', payload.organizationId);
  form.append('quantityDelivered', String(payload.quantityDelivered));
  if (payload.recipientCount !== undefined) form.append('recipientCount', String(payload.recipientCount));
  if (payload.notes) form.append('notes', payload.notes);
  payload.proofImages?.forEach((f) => form.append('proofImages', f));
  const { data } = await api.post<ApiEnvelope<{ delivery: Delivery; report: Record<string, unknown> }>>(
    '/deliveries', form, { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function fetchMyDeliveries(): Promise<Delivery[]> {
  const { data } = await api.get<ApiEnvelope<Delivery[]>>('/deliveries/mine');
  return data.data;
}

export async function fetchDeliveriesForReport(reportId: string): Promise<Delivery[]> {
  const { data } = await api.get<ApiEnvelope<Delivery[]>>('/deliveries', { params: { reportId } });
  return data.data;
}
