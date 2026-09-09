/**
 * Tile layer for the public Live Relief Map — uses Google Roads tiles
 * (no API key required). Override with VITE_MAP_GOOGLE_TILE_URL in .env.
 */
export const MAP_TILE_URL: string =
  import.meta.env.VITE_MAP_GOOGLE_TILE_URL ??
  'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';