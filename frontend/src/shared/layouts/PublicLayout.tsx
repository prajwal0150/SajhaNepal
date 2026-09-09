import { useState } from 'react';
import { Button } from '@shared/components/Button';
import { HeartHandshake, Menu, X } from 'lucide-react';
import { LanguageToggle, AccessibilityToggle } from '@features/language/components/LanguageToggle';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { NotificationBell } from '@features/notifications/components/NotificationBell';
import { OfflineBanner } from '@features/offline/components/OfflineBanner';
import { cn } from '@shared/utils/format';
import { useAuth } from '@features/auth/hooks/useAuth';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Live Map' },
  { to: '/reports', label: 'Needs' },
  { to: '/report', label: 'Report Need', highlight: true },
  { to: '/missing-persons', label: 'Missing Persons' },
  { to: '/shelters', label: 'Shelters' },
  { to: '/about', label: 'About' },
];

export function PublicLayout() {
  const { user, isAuthenticated, role } = useAuth();
  const [open, setOpen] = useState(false);

  const dashHref =
    role === 'ADMIN' ? '/admin/dashboard' :
    role === 'VOLUNTEER' ? '/volunteer/dashboard' :
    role === 'NGO' ? '/ngo/dashboard' :
    role === 'GOVERNMENT' ? '/government/dashboard' : '/my-reports';

  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white" aria-hidden>
              <HeartHandshake size={20} />
            </span>
            <span className="leading-tight">
              Saajha Rahat
              <span className="block text-[11px] font-medium text-muted">साझा राहत</span>
            </span>
          </Link>

          <DesktopNav />
          <DesktopActions dashHref={dashHref} user={user} isAuthenticated={isAuthenticated} />

          <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && <MobileNav open={open} setOpen={setOpen} dashHref={dashHref} isAuthenticated={isAuthenticated} />}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-primary/10 text-primary' : 'text-ink/80 hover:bg-ink/5',
              item.highlight && 'bg-critical text-white hover:bg-critical/90',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function DesktopActions({ dashHref, user, isAuthenticated }: { dashHref: string; user: { fullName: string } | null; isAuthenticated: boolean }) {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <LanguageToggle />
      <AccessibilityToggle />
      {isAuthenticated && user ? (
        <>
          <NotificationBell />
          <Link to={dashHref}>
            <Button size="sm" variant="outline">{user.fullName.split(' ')[0]}</Button>
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link to="/login"><Button size="sm" variant="outline">Sign in</Button></Link>
          <Link to="/report"><Button size="sm">Report a need</Button></Link>
        </>
      )}
    </div>
  );
}

function MobileNav({ open: _open, setOpen, dashHref, isAuthenticated }: {
  open: boolean;
  setOpen: (v: boolean) => void;
  dashHref: string;
  isAuthenticated: boolean;
}) {
  return (
    <nav className="border-t border-ink/10 bg-white px-4 py-3 lg:hidden animate-fade-up" aria-label="Mobile navigation">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn('block rounded-lg px-3 py-2.5 text-sm font-medium', isActive ? 'bg-primary/10 text-primary' : 'text-ink')
          }
        >
          {item.label}
        </NavLink>
      ))}
      <div className="mt-3 flex items-center gap-2 border-t border-ink/10 pt-3">
        <LanguageToggle />
        <AccessibilityToggle />
        {isAuthenticated ? (
          <>
            <Link to={dashHref} className="flex-1" onClick={() => setOpen(false)}>
              <Button size="sm" fullWidth variant="outline">Dashboard</Button>
            </Link>
            <LogoutButton />
          </>
        ) : (
          <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
            <Button size="sm" fullWidth>Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Button size="sm" variant="ghost" onClick={() => logout()}>Logout</Button>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="font-semibold text-ink">Saajha Rahat · साझा राहत</p>
            <p className="mt-1 max-w-md">One shared coordination system for disaster response in Nepal. Built for citizens, volunteers, NGOs and government.</p>
          </div>
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="font-medium text-ink">Platform</p>
              <Link to="/map" className="block hover:text-primary">Live Map</Link>
              <Link to="/reports" className="block hover:text-primary">Public Needs</Link>
              <Link to="/transparency" className="block hover:text-primary">Donation Transparency</Link>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-ink">Community</p>
              <Link to="/missing-persons" className="block hover:text-primary">Missing Persons</Link>
              <Link to="/shelters" className="block hover:text-primary">Shelters</Link>
              <Link to="/contact" className="block hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
        <p className="mt-6 border-t border-ink/10 pt-4 text-xs">© {new Date().getFullYear()} Saajha Rahat. Data for coordination only — always call 1196/1143 in a life-threatening emergency.</p>
      </div>
    </footer>
  );
}

