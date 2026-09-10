import { demoContactData } from '../utils/demoContact';
import type { ContactData } from '../types/contactTypes';

export async function fetchContactData(): Promise<ContactData> {
  // Demo while backend not ready. Replace with a real API call at
  // /api/v1/contact (or equivalent) when the backend is online.
  return demoContactData;
}
