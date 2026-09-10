import type { ResourcesData } from '../types/resourcesTypes';
import { demoResourcesData } from '../utils/demoResources';

/**
 * Loads the public resource library.
 * The resources page is a static marketing page, so it always returns
 * the curated demo catalog — mirroring the Landing/Services fallback pattern.
 */
export async function fetchResourcesData(): Promise<ResourcesData> {
  return demoResourcesData;
}