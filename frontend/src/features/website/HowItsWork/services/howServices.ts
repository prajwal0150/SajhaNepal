import type { HowData } from '../types/howTypes';
import { demoHowData } from '../utils/demoHow';

/**
 * Loads the public "How It Works" content.
 * The How It Works page is a static marketing page, so it always returns
 * the curated demo content — mirroring the Landing/About fallback pattern.
 */
export async function fetchHowData(): Promise<HowData> {
  return demoHowData;
}