import type { LandingData } from '../types/landingTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { demoLandingData } from '../utils/demoLanding';
import { fetchLandingData } from '../services/landingServices';

export const fetchLandingThunk = createAsyncThunk<LandingData, void, { rejectValue: string }>(
  'landing/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchLandingData();
    } catch (err) {
      // Never break the public landing page — fall back to demo content.
      if (demoLandingData) return demoLandingData;
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load landing data');
    }
  },
);

