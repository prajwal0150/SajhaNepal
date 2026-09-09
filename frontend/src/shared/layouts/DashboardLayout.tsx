import { useState } from 'react';
import { DASHBOARD_MENUS } from './dashboardMenus';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu } from 'lucide-react';
import { NotificationBell } from '@features/notifications/components/NotificationBell';
import { OfflineBanner } from '@features/offline/components/OfflineBanner';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

export function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menu = DASHBOARD_MENUS[role ?? ''] ?? DASHBOARD_MENUS.ADMIN;

  return (
    <div className="flex min-h-screen bg-surface">
      <OfflineBanner />
      <DashboardSidebar open={open} onClose={() => setOpen(false)} menu={menu} user={user} role={role} logout={logout} />
      {open && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-16 z-30 flex h-14 items-center justify-between border-b border-ink/10 bg-white/95 px-4 backdrop-blur lg:top-0">
          <button className="rounded-lg p-2 hover:bg-ink/5 lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <span className="hidden text-sm font-medium text-muted lg:block">{role} workspace</span>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 lg:p-6 animate-fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
