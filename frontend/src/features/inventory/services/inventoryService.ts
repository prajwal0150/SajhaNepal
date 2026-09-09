import type { InventoryItem, InventoryTransaction } from '@shared/types';
import { api, type ApiEnvelope } from '@shared/lib/axios';

export async function fetchInventory(): Promise<InventoryItem[]> {
  const { data } = await api.get<ApiEnvelope<InventoryItem[]>>('/inventory');
  return data.data;
}

export async function addInventoryTransaction(payload: Record<string, unknown>): Promise<InventoryTransaction> {
  const { data } = await api.post<ApiEnvelope<InventoryTransaction>>('/inventory/transactions', payload);
  return data.data;
}
