import type { Organization } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchOrganizations(params?: Record<string, unknown>): Promise<Organization[]> {
  const { data } = await api.get<ApiEnvelope<Organization[]>>('/organizations', { params });
  return data.data;
}

export async function fetchMyOrganizations(): Promise<Organization[]> {
  const { data } = await api.get<ApiEnvelope<Organization[]>>('/organizations/my');
  return data.data;
}

export async function fetchOrganizationById(id: string): Promise<Organization> {
  const { data } = await api.get<ApiEnvelope<Organization>>(`/organizations/${id}`);
  return data.data;
}

export async function createOrganization(payload: Record<string, unknown>): Promise<Organization> {
  const { data } = await api.post<ApiEnvelope<Organization>>('/organizations', payload);
  return data.data;
}

export async function updateOrganization(id: string, payload: Record<string, unknown>): Promise<Organization> {
  const { data } = await api.patch<ApiEnvelope<Organization>>(`/organizations/${id}`, payload);
  return data.data;
}

export async function addMember(orgId: string, userId: string, roleInOrg: string = 'MEMBER'): Promise<Organization> {
  const { data } = await api.post<ApiEnvelope<Organization>>(`/organizations/${orgId}/members`, { userId, roleInOrg });
  return data.data;
}

export async function fetchMembers(orgId: string) {
  const { data } = await api.get<ApiEnvelope<unknown[]>>(`/organizations/${orgId}/members`);
  return data.data;
}
