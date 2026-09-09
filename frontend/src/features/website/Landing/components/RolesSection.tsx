import { ArrowRight, Building2, CircleUserRound, HandHelping, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLES = [
  { icon: CircleUserRound, title: 'Citizens', desc: 'Report what your community needs.', cta: 'REPORT A NEED', to: '/report', tint: 'bg-primary/10 text-primary', btn: 'bg-primary hover:bg-primary-dark' },
  { icon: HandHelping, title: 'Volunteers', desc: 'Help verify real needs in your community.', cta: 'BECOME A VOLUNTEER', to: '/register', tint: 'bg-success/10 text-success', btn: 'bg-success hover:bg-success/90' },
  { icon: Building2, title: 'NGOs', desc: 'Coordinate relief where it matters most.', cta: 'FOR ORGANIZATIONS', to: '/register', tint: 'bg-tertiary/10 text-tertiary', btn: 'bg-tertiary hover:bg-tertiary/90' },
  { icon: Landmark, title: 'Government', desc: 'See the bigger picture and coordinate responses.', cta: 'GOVERNMENT ACCESS', to: '/login', tint: 'bg-ink/10 text-ink', btn: 'bg-ink hover:bg-ink/90' },
];

export function RolesSection() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">For everyone</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">How you can help</h2>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r.title} className="rounded-xl border border-ink/10 bg-gradient-to-b from-white to-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${r.tint}`}>
              <r.icon size={16} aria-hidden />
            </span>
            <h3 className="mt-2 text-[13px] font-bold text-ink">{r.title}</h3>
            <p className="text-[11px] text-muted">{r.desc}</p>
            <Link to={r.to} className={`mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold text-white transition active:scale-[0.98] ${r.btn}`}>
              {r.cta} <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
