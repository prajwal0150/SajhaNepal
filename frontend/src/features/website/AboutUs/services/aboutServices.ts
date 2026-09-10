import type { AboutData } from '../types/aboutTypes';
import { demoAboutData } from '../utils/demoAbout';

/**
 * Loads the public "About Us" content.
 * The About page is a static marketing page, so it always returns
 * the curated demo content — mirroring the Landing page fallback pattern.
 */
export async function fetchAboutData(): Promise<AboutData> {
  return demoAboutData;
}