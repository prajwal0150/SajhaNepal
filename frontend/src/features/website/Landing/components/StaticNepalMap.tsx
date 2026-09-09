export function StaticNepalMap({ tall = false }: { tall?: boolean }) {
  return (
    <div className={`relative w-full bg-[#e4ecdc] ${tall ? 'h-52 sm:h-64' : 'h-48 sm:h-60'}`} role="img" aria-label="Demo relief map of Nepal">
      <svg viewBox="0 0 600 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="600" height="260" fill="#dce9d4" />
        <path d="M0 210 Q80 190 150 200 T320 185 T480 200 T600 175 L600 260 L0 260 Z" fill="#c3d9f2" opacity="0.7" />
        <path d="M40 90 Q120 60 200 80 T360 70 T520 90" stroke="#b9d2bd" strokeWidth="14" fill="none" opacity="0.6" />
        <path d="M60 150 Q180 120 300 140 T540 130" stroke="#a9c8f0" strokeWidth="5" fill="none" opacity="0.8" />
        <path d="M120 190 Q260 170 420 185" stroke="#a9c8f0" strokeWidth="4" fill="none" opacity="0.7" />
        <text x="290" y="95" fontSize="15" letterSpacing="6" fontWeight="700" fill="#475569">NEPAL</text>
        <text x="120" y="105" fontSize="12" fontWeight="700" fill="#334155">Pokhara</text>
        <text x="300" y="118" fontSize="13" fontWeight="700" fill="#334155">Kathmandu</text>
        <text x="305" y="138" fontSize="11" fill="#64748b">Lalitpur</text>
        <text x="500" y="188" fontSize="12" fontWeight="700" fill="#334155">Biratnagar</text>
      </svg>
      <Pin className="left-[18%] top-[58%]" color="#DC2626" label="!" />
      <Pin className="left-[46%] top-[30%]" color="#2563EB" label="~" />
      <Pin className="left-[56%] top-[42%]" color="#DC2626" label="!" />
      <Pin className="left-[42%] top-[66%]" color="#F59E0B" label="+" />
      <Pin className="left-[62%] top-[60%]" color="#7C3AED" label="H" />
      <Pin className="left-[76%] top-[52%]" color="#DC2626" label="+" />
      <Pin className="left-[64%] top-[78%]" color="#16A34A" label="^" />
      <div className="absolute right-2 top-2 z-10 hidden w-32 rounded-lg border border-ink/10 bg-white/95 p-2 text-[10px] shadow-sm sm:block">
        <p className="mb-1 font-bold text-ink">Relief Needs</p>
        <p className="flex items-center gap-1.5 text-ink/70"><Dot c="#DC2626" /> Critical Need</p>
        <p className="flex items-center gap-1.5 text-ink/70"><Dot c="#2563EB" /> Water</p>
        <p className="flex items-center gap-1.5 text-ink/70"><Dot c="#DC2626" /> Medical</p>
        <p className="flex items-center gap-1.5 text-ink/70"><Dot c="#16A34A" /> Shelter</p>
        <p className="flex items-center gap-1.5 text-ink/70"><Dot c="#7C3AED" /> Warehouse</p>
      </div>
      <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1" aria-hidden>
        {['+', '–', '◎'].map((s) => (
          <span key={s} className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/10 bg-white text-sm font-bold text-ink shadow-sm">{s}</span>
        ))}
      </div>
    </div>
  );
}

function Pin({ className, color, label }: { className: string; color: string; label: string }) {
  return (
    <span className={`absolute ${className} flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow`} style={{ background: color }} aria-hidden>
      {label}
    </span>
  );
}

function Dot({ c }: { c: string }) {
  return <span className="h-2 w-2 rounded-full" style={{ background: c }} aria-hidden />;
}
