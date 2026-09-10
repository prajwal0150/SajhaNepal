import type { ServicesData } from '../types/servicesTypes';
import { demoServicesData } from '../utils/demoServices';

/**
 * Loads the public services catalog.
 * The services page is a static marketing page, so it always returns
 * the curated demo catalog — mirroring the Landing page fallback pattern.
 */
export async function fetchServicesData(): Promise<ServicesData> {
  return demoServicesData;
}