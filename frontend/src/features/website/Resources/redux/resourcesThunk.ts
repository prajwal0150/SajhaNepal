import type { ResourcesData } from '../types/resourcesTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchResourcesData } from '../services/resourcesServices';

export const fetchResourcesThunk = createAsyncThunk<ResourcesData, void, { rejectValue: string }>(
  'resources/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchResourcesData();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load resources');
    }
  },
);