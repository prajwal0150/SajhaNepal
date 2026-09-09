import type { DashboardNavItem } from './dashboardMenus';
import { HeartHandshake, X, ChevronLeft } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@shared/utils/format';

export function DashboardSidebar({ open, onClose, menu, user, role, logout }: {
  open: boolean;
  onClose: () => void;
  menu: { section: string; items: DashboardNavItem[] }[];
  user: { fullName: string } | null;
  role: string | null;
  logout: () => Promise<void>;
}) {
  const navigate = useNavigate();
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink/10 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-ink/10 px-4">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white" aria-hidden>
            <HeartHandshake size={18} />
          </span>
          Saajha Rahat
        </NavLink>
        <button className="rounded-lg p-1.5 hover:bg-ink/5 lg:hidden" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>
      <nav className="h-[calc(100vh-8rem)] overflow-y-auto p-3">
        {menu.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">{group.section}</p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'text-ink/75 hover:bg-ink/5 hover:text-ink',
                  )
                }
              >
                <span aria-hidden className="text-muted">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="absolute inset-x-0 bottom-0 border-t border-ink/10 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary" aria-hidden>
            {user?.fullName?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user?.fullName}</p>
            <p className="text-xs text-muted">{role}</p>
          </div>
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            aria-label="Sign out"
            className="rounded-lg p-2 text-muted hover:bg-critical/10 hover:text-critical"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

