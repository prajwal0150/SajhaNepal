import { useState } from 'react';
import { CircleUserRound, Globe, HeartHandshake, Menu, PenLine, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@shared/utils/format';
import { WebsiteTopBar } from './TopBar';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/resources', label: 'Resources' },
  { to: '/how-it-works', label: 'How Its Works' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/about', label: 'About Us' },
  { to: '/about', label: 'About Us' },
  { to: '/about', label: 'About Us' },
  { to: '/about', label: 'Contact' },
  { to: '/about', label: 'Terms' },
];

/**
 * Public website header — sticky top alert bar + main navigation.
 * Moved here from Landing/components per the Layouts convention.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50">
      <WebsiteTopBar />

      <header className="border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <HeartHandshake size={18} aria-hidden />
            </span>
            <span className="leading-none">
              <span className="block text-[13px] font-bold text-ink">Saajha Rahat</span>
              <span className="block text-[11px] font-medium text-primary">साझा राहत</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                    isActive ? 'text-primary underline decoration-2 underline-offset-4' : 'text-ink/70 hover:bg-ink/5 hover:text-ink',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] font-medium text-ink/70 hover:bg-ink/5">
              <Globe size={14} aria-hidden /> EN <span className="text-muted">|</span> <span className="text-primary">नेपाली</span>
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-1.5 text-[13px] font-semibold text-primary hover:bg-primary/5"
            >
              <CircleUserRound size={15} aria-hidden /> Login
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-bold text-white hover:bg-primary-dark"
            >
              <PenLine size={14} aria-hidden /> REPORT A NEED
            </Link>
          </div>

          <button
            className="rounded-lg p-2 text-ink hover:bg-ink/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <nav className="animate-fade-up border-t border-ink/10 bg-white px-3 py-2 lg:hidden" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn('block rounded-lg px-3 py-2 text-sm font-medium', isActive ? 'bg-primary/10 text-primary' : 'text-ink/80')
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-ink/10 pt-2">
              <Link
                to="/login"
                className="flex-1 rounded-lg border border-primary/30 px-3 py-2 text-center text-sm font-semibold text-primary"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/report"
                className="flex-[2] rounded-lg bg-primary px-3 py-2 text-center text-sm font-bold text-white"
                onClick={() => setOpen(false)}
              >
                REPORT A NEED
              </Link>
            </div>
          </nav>
        )}
      </header>
    </div>
  );
}


export default Header;