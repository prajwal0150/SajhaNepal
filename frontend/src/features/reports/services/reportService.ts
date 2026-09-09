import type { Report, Paginated } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export interface ReportFilters {
  search?: string;
  needType?: string;
  urgency?: string;
  status?: string;
  district?: string;
  page?: number;
  limit?: number;
}

export interface CreateReportPayload {
  title: string;
  description: string;
  needType: string;
  urgency?: string;
  longitude: number;
  latitude: number;
  district: string;
  municipality?: string;
  ward?: number;
  address?: string;
  affectedPeople?: number;
  requiredQuantity?: number;
  quantityUnit?: string;
  reporterContact?: string;
  consent: boolean;
  images?: File[];
  voice?: File | null;
}

export async function fetchReports(filters: ReportFilters): Promise<Paginated<Report>> {
  const { data } = await api.get<ApiEnvelope<Report[]>>('/reports', { params: filters });
  return { items: data.data, meta: data.meta ?? { page: 1, limit: 20, total: data.data.length, totalPages: 1 } };
}

export async function fetchReportById(id: string): Promise<Report> {
  const { data } = await api.get<ApiEnvelope<Report>>(`/reports/${id}`);
  return data.data;
}

export async function fetchNearbyReports(params: { lat: number; lng: number; radiusKm?: number; needType?: string; urgency?: string }): Promise<Report[]> {
  const { data } = await api.get<ApiEnvelope<Report[]>>('/reports/nearby', { params });
  return data.data;
}

export async function fetchMyReports(page = 1): Promise<Paginated<Report>> {
  const { data } = await api.get<ApiEnvelope<Report[]>>('/reports/mine', { params: { page, limit: 20 } });
  return { items: data.data, meta: data.meta ?? { page: 1, limit: 20, total: data.data.length, totalPages: 1 } };
}

export async function createReportRequest(payload: CreateReportPayload): Promise<Report> {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'images' || key === 'voice' || value === undefined || value === null) return;
    form.append(key, String(value));
  });
  payload.images?.forEach((file) => form.append('images', file));
  if (payload.voice) form.append('voice', payload.voice);
  const { data } = await api.post<ApiEnvelope<Report>>('/reports', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function cancelReportRequest(id: string): Promise<Report> {
  const { data } = await api.patch<ApiEnvelope<Report>>(`/reports/${id}/cancel`);
  return data.data;
}
