import { Eye, Target } from 'lucide-react';

export function AboutStory() {
  return (
    <section id="about-story" className="mx-auto scroll-mt-24 max-w-7xl px-3 py-6 sm:px-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Our story</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">Why we built Saajha Rahat</h2>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-3">
          <p className="text-xs leading-relaxed text-muted">
            Saajha Rahat began in 2023 with a simple observation: after every disaster in Nepal,
            the same pattern repeats. Needs are reported by phone and in scattered group chats,
            helpers arrive without a clear picture, and the people who need help the most wait
            the longest.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            A group of volunteers, developers and responders decided to change that. They built
            one shared platform where every need is reported once, verified on the ground,
            claimed by an organization and tracked until help arrives — openly, so anyone can
            follow along.
          </p>
          <blockquote className="mt-2 border-l-2 border-primary/40 bg-primary/[0.04] px-3 py-2.5">
            <p className="text-[11px] font-semibold leading-snug text-ink">
              “साझा राहत — shared relief. One platform, every need, verified responses.”
            </p>
          </blockquote>
        </div>

        <div className="grid gap-2.5">
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target size={16} aria-hidden />
              </span>
              <h3 className="text-[13px] font-bold text-ink">Our mission</h3>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-primary">हाम्रो मिसन</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              Make disaster relief coordinated, verified and transparent — so help reaches
              families faster in every district of Nepal.
            </p>
          </div>
          <div className="rounded-xl border border-secondary/20 bg-secondary/[0.04] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Eye size={16} aria-hidden />
              </span>
              <h3 className="text-[13px] font-bold text-ink">Our vision</h3>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-secondary">हाम्रो दृष्टि</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">
              A Nepal where no community responds alone — and every need, claim and delivery is
              traceable from first report to final proof.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}