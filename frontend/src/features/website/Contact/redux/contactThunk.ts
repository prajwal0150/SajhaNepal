import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContactData } from '../services/contactServices';

export const fetchContactThunk = createAsyncThunk('contact/fetch', async () => {
  const data = await fetchContactData();
  return data;
});
