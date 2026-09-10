import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ContactData } from '../types/contactTypes';

interface ContactState {
  data: ContactData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  data: null,
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContact: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchContactThunk.fulfilled, (s, a: PayloadAction<ContactData>) => {
        s.loading = false;
        s.data = a.payload;
      })
      .addCase(fetchContactThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message ?? 'Failed to load contact data';
      });
  },
});

export const { resetContact } = contactSlice.actions;
export default contactSlice.reducer;
