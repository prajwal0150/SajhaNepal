import type { AboutData } from '../types/aboutTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAboutData } from '../services/aboutServices';

export const fetchAboutThunk = createAsyncThunk<AboutData, void, { rejectValue: string }>(
  'about/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAboutData();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load about content');
    }
  },
);