import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Public website footer — call-to-action band + dark link columns.
 * Moved here from Landing/components per the Layouts convention.
 */
export function Footer() {
  return (
    <footer className="mt-6">
      <div className="relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-primary/20">
        <div className="relative mx-auto max-w-7xl px-3 py-6 text-center sm:px-4">
          <h2 className="text-base font-extrabold text-ink sm:text-lg">Be part of the response.</h2>
          <p className="mx-auto mt-1 max-w-xl text-[11px] text-ink/60 sm:text-xs">
            Whether you need help, can verify a report, or can provide relief — every contribution matters.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link to="/report" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-bold text-white hover:bg-primary-dark">
              ✎ REPORT A NEED
            </Link>
            <Link to="/register" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/50 bg-white/70 px-4 text-xs font-bold text-primary hover:bg-white">
              ＋ JOIN THE RESPONSE
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-ink text-white/80">
        <div className="mx-auto grid max-w-7xl gap-5 px-3 py-6 text-xs sm:px-4 md:grid-cols-5">
          <div className="md:col-span-1">
            <p className="text-sm font-bold text-white">Saajha Rahat<br /><span className="text-primary">साझा राहत</span></p>
            <p className="mt-2 leading-relaxed text-white/60">Connecting communities, responders and relief organizations when help matters most.</p>
          </div>
          <FooterCol title="Platform" links={[['Home', '/'], ['Services', '/services'], ['Resources', '/resources'], ['Live Map', '/map'], ['Report a Need', '/report'], ['Missing Persons', '/missing-persons'], ['Shelters', '/shelters']]} />
          <FooterCol title="Organizations" links={[['For NGOs', '/register'], ['For Volunteers', '/register'], ['Government', '/login']]} />
          <FooterCol title="Company" links={[['About', '/about'], ['Contact', '/about'], ['Privacy', '/about'], ['Terms', '/about']]} />
          <div>
            <p className="font-semibold text-white">Emergency</p>
            <p className="mt-1.5">🔴 Report a Need</p>
            <p className="mt-1">⌂ Find Shelter</p>
            <div className="mt-3 flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded border border-white/20 px-1.5 py-0.5"><Globe size={11} aria-hidden /> English</span>
              <span className="text-white/50">|</span>
              <span>नेपाली</span>
            </div>
            <div className="mt-2 flex gap-2.5 text-[13px] font-bold" aria-label="Social links">
              {['f', '𝕏', '◉', '▶'].map((s) => (
                <span key={s} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/70">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-2.5 text-[10px] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p>© Saajha Rahat. Built for coordinated disaster response in Nepal.</p>
            <p className="flex gap-3"><span>Accessibility</span><span>Privacy</span><span>Terms</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-semibold text-white">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {links.map(([label, to]) => (
          <li key={label}><Link to={to} className="hover:text-white">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}


export default Footer;