import type { HowData } from '../types/howTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHowData } from '../services/howServices';

export const fetchHowThunk = createAsyncThunk<HowData, void, { rejectValue: string }>(
  'how/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHowData();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load how-it-works content');
    }
  },
);