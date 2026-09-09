import type { MissingPerson } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchMissingPersons(params?: Record<string, unknown>): Promise<MissingPerson[]> {
  const { data } = await api.get<ApiEnvelope<MissingPerson[]>>('/missing-persons', { params });
  return data.data;
}

export async function fetchMissingPersonById(id: string): Promise<MissingPerson> {
  const { data } = await api.get<ApiEnvelope<MissingPerson>>(`/missing-persons/${id}`);
  return data.data;
}

export async function createMissingPerson(payload: FormData): Promise<MissingPerson> {
  const { data } = await api.post<ApiEnvelope<MissingPerson>>('/missing-persons', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateMissingPerson(id: string, payload: Record<string, unknown>): Promise<MissingPerson> {
  const { data } = await api.patch<ApiEnvelope<MissingPerson>>(`/missing-persons/${id}`, payload);
  return data.data;
}
