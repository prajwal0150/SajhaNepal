import { Radio, TriangleAlert } from 'lucide-react';

/**
 * Website top alert bar — shows the priority flash bulletin
 * and live sync status above the main header.
 */
export function WebsiteTopBar() {
  return (
    <div className="bg-critical text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 text-[11px] leading-tight sm:text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <TriangleAlert size={13} aria-hidden />
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            Priority flash bulletin
          </span>
          <span className="hidden font-medium sm:inline">Monsoon Flood &amp; Landslide Watch — Koshi &amp; Gandaki basins under high alert</span>
          <span className="sm:hidden">Monsoon Flood &amp; Landslide Watch</span>
        </span>
        <span className="ml-auto hidden items-center gap-3 text-white/90 md:flex">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Last updated 4 min ago
          </span>
          <span className="inline-flex items-center gap-1">
            <Radio size={12} aria-hidden /> NDRRMA Sync Active
          </span>
        </span>
      </div>
    </div>
  );
}

export const TopBar = WebsiteTopBar;
export default WebsiteTopBar;