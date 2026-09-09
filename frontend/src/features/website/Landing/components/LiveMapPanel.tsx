import { useState } from 'react';
import { ExternalLink, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StaticNepalMap } from './StaticNepalMap';
import { Select } from '@shared/components/Fields';
import { NEED_TYPES, NEED_TYPE_META, URGENCY_LEVELS } from '@shared/constants';
import type { NeedType, Urgency, Province } from '@shared/types';

const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'] as const;

export function LiveMapPanel() {
  const [search, setSearch] = useState('');
  const [needType, setNeedType] = useState<NeedType | ''>('');
  const [urgency, setUrgency] = useState<Urgency | ''>('');
  const [province, setProvince] = useState<Province | ''>('');

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm lg:col-span-2">
      <div className="flex flex-wrap items-center gap-1.5 p-2">
        <label className="flex min-w-40 flex-1 items-center gap-1.5 rounded-lg border border-ink/15 px-2 py-1.5 text-xs">
          <Search size={13} className="shrink-0 text-muted" aria-hidden />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location…"
            className="w-full bg-transparent outline-none placeholder:text-muted/70"
            aria-label="Search location"
          />
        </label>
        <Select
          aria-label="Filter by need type"
          className="w-32"
          value={needType}
          onChange={(e) => setNeedType(e.target.value as NeedType | '')}
        >
          <option value="">All types</option>
          {NEED_TYPES.map((t) => (
            <option key={t} value={t}>
              {NEED_TYPE_META[t].emoji} {NEED_TYPE_META[t].en}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by urgency"
          className="w-32"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as Urgency | '')}
        >
          <option value="">All urgency</option>
          {URGENCY_LEVELS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by province"
          className="w-36"
          value={province}
          onChange={(e) => setProvince(e.target.value as Province | '')}
        >
          <option value="">All provinces</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <span className="ml-auto hidden items-center gap-1 rounded-full border border-ink/10 px-2 py-1 text-[11px] text-muted sm:inline-flex">
          ◎ Current Location
        </span>
      </div>
      <div className="relative">
        <StaticNepalMap tall />
        <Link
          to="/map"
          className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-primary-dark"
        >
          <ExternalLink size={12} aria-hidden />
          OPEN LIVE MAP
        </Link>
      </div>
    </div>
  );
}
