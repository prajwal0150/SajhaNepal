import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/redux/authSlice';
import reportsReducer from '@features/reports/redux/reportSlice';
import verificationReducer from '@features/verification/redux/verificationSlice';
import organizationsReducer from '@features/organizations/redux/organizationSlice';
import claimsReducer from '@features/claims/redux/claimSlice';
import deliveriesReducer from '@features/deliveries/redux/deliverySlice';
import notificationsReducer from '@features/notifications/redux/notificationSlice';
import missingPersonsReducer from '@features/missingPersons/redux/missingPersonSlice';
import reliefSitesReducer from '@features/reliefSites/redux/reliefSiteSlice';
import inventoryReducer from '@features/inventory/redux/inventorySlice';
import donationsReducer from '@features/donations/redux/donationSlice';
import hazardsReducer from '@features/hazards/redux/hazardSlice';
import analyticsReducer from '@features/analytics/redux/analyticsSlice';
import languageReducer from '@features/language/redux/languageSlice';
import offlineReducer from '@features/offline/redux/offlineSlice';
import landingReducer from '@/features/website/Landing/redux/landingSlice';
import toastReducer from '@shared/redux/toastSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  reports: reportsReducer,
  verification: verificationReducer,
  organizations: organizationsReducer,
  claims: claimsReducer,
  deliveries: deliveriesReducer,
  notifications: notificationsReducer,
  missingPersons: missingPersonsReducer,
  reliefSites: reliefSitesReducer,
  inventory: inventoryReducer,
  donations: donationsReducer,
  hazards: hazardsReducer,
  analytics: analyticsReducer,
  language: languageReducer,
  offline: offlineReducer,
  landing: landingReducer,
  toast: toastReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
