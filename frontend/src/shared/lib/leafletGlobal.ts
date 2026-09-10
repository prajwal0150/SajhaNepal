import L from 'leaflet';

/**
 * Legacy Leaflet plugins (e.g. leaflet.markercluster) read Leaflet from the
 * browser global `L`, not from the module export. In a Vite/Rolldown module
 * build there is no such global, which causes:
 *   Uncaught ReferenceError: L is not defined
 * This module exposes the Leaflet module as `globalThis.L` so those plugins
 * can find it. It MUST be imported before the legacy plugin's JS (import order
 * is evaluation order).
 */
(globalThis as unknown as { L: typeof L }).L = L;

export default L;