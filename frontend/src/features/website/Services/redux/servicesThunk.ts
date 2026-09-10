import type { ServicesData } from '../types/servicesTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchServicesData } from '../services/servicesServices';

export const fetchServicesThunk = createAsyncThunk<ServicesData, void, { rejectValue: string }>(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchServicesData();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load services');
    }
  },
);