import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/Store';

const selectContactDomain = (s: RootState) => s.contact;

export const selectContactData = createSelector(
  [selectContactDomain],
  (d) => d.data,
);

export const selectContactChannels = createSelector(
  [selectContactDomain],
  (d) => d.data?.channels ?? [],
);

export const selectContactStats = createSelector(
  [selectContactDomain],
  (d) => d.data?.stats ?? null,
);

export const selectContactLoading = createSelector(
  [selectContactDomain],
  (d) => d.loading,
);

export const selectContactError = createSelector(
  [selectContactDomain],
  (d) => d.error,
);

export const selectContactIsDemo = createSelector(
  [selectContactDomain],
  (d) => d.data?.isDemo ?? false,
);
