import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store/Store';
import type { Report } from '@shared/types';
import {
  fetchReports,
  fetchReportById,
  fetchNearbyReports,
  fetchMyReports,
  createReportRequest,
  cancelReportRequest,
  type ReportFilters,
  type CreateReportPayload,
} from '../services/reportService';


export const fetchReportsThunk = createAsyncThunk<PaginatedResult, ReportFilters | undefined, { rejectValue: string }>(
  'reports/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchReports(filters ?? {});
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load reports');
    }
  },
);

export const fetchNearbyThunk = createAsyncThunk<Report[], { lat: number; lng: number; radiusKm?: number }, { rejectValue: string }>(
  'reports/fetchNearby',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchNearbyReports(params);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load nearby reports');
    }
  },
);

export const fetchReportByIdThunk = createAsyncThunk<Report, string, { rejectValue: string }>(
  'reports/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchReportById(id);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load report');
    }
  },
);

export const fetchMyReportsThunk = createAsyncThunk<PaginatedResult, number | undefined, { rejectValue: string }>(
  'reports/fetchMine',
  async (page, { rejectWithValue }) => {
    try {
      return await fetchMyReports(page ?? 1);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load your reports');
    }
  },
);

export const createReportThunk = createAsyncThunk<Report, CreateReportPayload, { state: RootState; rejectValue: string }>(
  'reports/create',
  async (payload, { rejectWithValue }) => {
    // OFFLINE: queue the report in IndexedDB instead of losing it
    if (!navigator.onLine) {
      const { queueOfflineReport } = await import('@features/offline/services/offlineQueue');
      const id = await queueOfflineReport(payload);
      throw new OfflineQueuedError(id);
    }
    try {
      return await createReportRequest(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to submit report');
    }
  },
);

export class OfflineQueuedError extends Error {
  queueId: string;
  constructor(queueId: string) {
    super('REPORT_QUEUED_OFFLINE');
    this.queueId = queueId;
  }
}
export const cancelReportThunk = createAsyncThunk<Report, string, { rejectValue: string }>(
  'reports/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await cancelReportRequest(id);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to cancel report');
    }
  },
);

interface PaginatedResult {
  items: Report[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
