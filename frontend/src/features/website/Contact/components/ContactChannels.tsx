import { Link } from 'react-router-dom';
import { CircleCheck, ArrowRight } from 'lucide-react';
import { ContactIcon } from './ContactIcon';
import type { ContactChannel } from '../types/contactTypes';

export function ContactChannels({ channels }: { channels: ContactChannel[] }) {
  return (
    <section id="contact-channels" className="mx-auto max-w-7xl px-3 sm:px-4" aria-label="Ways to contact Saajha Rahat">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">How to reach us</p>
      <h2 className="text-lg font-extrabold text-ink sm:text-xl">One team. Many ways in.</h2>
      <p className="text-xs text-muted sm:text-[13px]">
        Use the contact that fits your need — urgent help, a non-urgent message, or a
        conversation in person.
      </p>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {channels.map((c) => (
          <div key={c._id} className="rounded-xl border border-ink/10 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.tint}`}>
                <ContactIcon name={c.icon} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-[13px] font-bold text-ink">{c.title}</h3>
                  {c.to ? (
                    <Link
                      to={c.to}
                      className="shrink-0 text-[10px] font-semibold text-primary transition hover:underline"
                    >
                      Visit
                    </Link>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] font-medium text-primary">{c.ne}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{c.description}</p>
                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-ink/70">
                  {c.meta.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium">
                      <CircleCheck size={10} className="text-success shrink-0" aria-hidden /> {m}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold text-ink">
                  <ContactMetaItem label="Detail" value={c.detail} />
                </div>
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/40 bg-white px-3 text-[11px] font-bold text-primary transition hover:bg-primary/5 active:scale-[0.98]"
                  >
                    Open <ArrowRight size={12} aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1 text-[10px] text-muted">
        <ArrowRight size={12} className="text-primary" aria-hidden />
        <Link to="/report" className="font-semibold text-primary hover:underline">
          Urgent? Report a need directly
        </Link>
      </p>
    </section>
  );
}

function ContactMetaItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-medium text-muted">{label}</span>
      <span className="text-[13px] font-bold text-ink">{value}</span>
    </span>
  );
}
