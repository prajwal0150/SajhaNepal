import type { ReactNode } from 'react';
import { LandingFooter } from './Footer';
import { LandingHeader } from './Header';

/**
 * Default public website layout — shared header + footer wrapper.
 * Usage: <WebsiteLayout>...page content...</WebsiteLayout>
 */
export function WebsiteLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}

export default WebsiteLayout;