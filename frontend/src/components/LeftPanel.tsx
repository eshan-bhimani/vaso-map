import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMapStore } from '../store/mapStore';
import { api } from '../services/api';
import { getVesselTypeColor } from '../utils/graphUtils';
import type { Vessel } from '../types/vessel';

const LEGEND = [
  { label: 'Artery',    color: '#e11d48', desc: 'Carries oxygenated blood' },
  { label: 'Vein',      color: '#2563eb', desc: 'Returns deoxygenated blood' },
  { label: 'Capillary', color: '#7c3aed', desc: 'Microvascular exchange' },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
  },
};

/* ── Search ── */
function SearchSection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vessel[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const { setSelectedVessel, setIsLoading, setError } = useMapStore();

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setBusy(true);
    const id = setTimeout(async () => {
      try {
        const r = await api.vessels.getAll(query);
        setResults(r);
        setOpen(r.length > 0);
      } catch { setResults([]); }
      finally { setBusy(false); }
    }, 280);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = async (v: Vessel) => {
    setIsLoading(true);
    try {
      const d = await api.vessels.getById(v.id);
      setSelectedVessel(d);
      setOpen(false);
      setQuery('');
    } catch (e: any) { setError(e.message); }
    finally { setIsLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter' && hi >= 0) pick(results[hi]);
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="relative panel-section">
      <div className="label-mono mb-2">Search Vessels</div>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-text-dim" fill="none" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Aorta, LAD, coronary…"
          onChange={(e) => { setQuery(e.target.value); setHi(-1); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKey}
          className="flex-1 bg-transparent text-sm text-text-pri placeholder:text-text-dim outline-none"
        />
        {busy && <div className="w-3.5 h-3.5 rounded-full border border-path-accent border-t-transparent animate-spin flex-shrink-0" />}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropRef}
          className="absolute left-4 right-4 top-full mt-1 glass-elevated rounded-xl z-30 overflow-hidden"
          style={{ maxHeight: 240 }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: 240 }}>
            {results.map((v, i) => {
              const c = getVesselTypeColor(v.type);
              return (
                <button
                  key={v.id}
                  onClick={() => pick(v)}
                  onMouseEnter={() => setHi(i)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                  style={{ background: i === hi ? 'rgba(255,255,255,0.06)' : 'transparent' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-pri truncate">{v.name}</div>
                    {v.aliases.length > 0 && (
                      <div className="text-xs text-text-dim truncate">{v.aliases.join(', ')}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stats ── */
function StatsSection() {
  const { vessels, edges, pathHighlight } = useMapStore();
  return (
    <div className="panel-section grid grid-cols-3 gap-2">
      {[
        { label: 'Vessels', value: vessels.length },
        { label: 'Connections', value: edges.length },
        { label: 'Path', value: pathHighlight.length > 0 ? pathHighlight.length : '—' },
      ].map((s) => (
        <div key={s.label} className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-lg font-bold font-mono text-text-pri">{s.value}</div>
          <div className="label-mono mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Legend ── */
function LegendSection() {
  return (
    <div className="panel-section space-y-2.5">
      <div className="label-mono mb-3">Legend</div>
      {LEGEND.map((l, i) => (
        <motion.div
          key={l.label}
          variants={stagger.item}
          className="flex items-center gap-3"
        >
          <div
            className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ background: `${l.color}18`, border: `1px solid ${l.color}40` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
          </div>
          <div>
            <div className="text-sm font-medium text-text-pri">{l.label}</div>
            <div className="text-xs text-text-dim">{l.desc}</div>
          </div>
        </motion.div>
      ))}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.35)' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-path-accent" style={{ boxShadow: '0 0 6px #22d3ee' }} />
        </div>
        <div>
          <div className="text-sm font-medium text-text-pri">Path Highlight</div>
          <div className="text-xs text-text-dim">Active route</div>
        </div>
      </div>
    </div>
  );
}

/* ── Path Finder trigger ── */
function PathSection() {
  const { setCommandPaletteOpen, pathHighlight, pathVessels, simulateFlow, setSimulateFlow, clearPathHighlight } = useMapStore();

  return (
    <div className="panel-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="label-mono">Path Finder</div>
        <kbd className="label-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm transition-all group"
        style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.18)' }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-path-accent flex-shrink-0">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 8h2M12 8h2M8 2v2M8 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-text-sec group-hover:text-text-pri transition-colors">Open path finder…</span>
      </button>

      {pathHighlight.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2.5">
          <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)' }}>
            <div className="text-xs text-path-accent font-semibold mb-1.5">{pathHighlight.length} vessels highlighted</div>
            {pathVessels.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-center gap-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getVesselTypeColor(v.type) }} />
                <span className="text-xs text-text-sec truncate">{v.name}</span>
              </div>
            ))}
            {pathVessels.length > 4 && (
              <div className="text-xs text-text-dim mt-1">+{pathVessels.length - 4} more</div>
            )}
          </div>

          {/* Simulate flow toggle */}
          <button
            onClick={() => setSimulateFlow(!simulateFlow)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: simulateFlow ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${simulateFlow ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.09)'}`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${simulateFlow ? 'bg-path-accent animate-pulse' : 'bg-white/20'}`} />
              <span className={simulateFlow ? 'text-path-accent font-medium' : 'text-text-sec'}>Simulate Flow</span>
            </div>
            <div
              className="w-8 h-4 rounded-full relative transition-all"
              style={{ background: simulateFlow ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="absolute top-0.5 w-3 h-3 rounded-full transition-all"
                style={{
                  background: simulateFlow ? '#22d3ee' : 'rgba(255,255,255,0.4)',
                  left: simulateFlow ? '17px' : '2px',
                  boxShadow: simulateFlow ? '0 0 6px #22d3ee' : 'none',
                }}
              />
            </div>
          </button>

          <button
            onClick={clearPathHighlight}
            className="w-full text-xs text-text-dim hover:text-text-sec transition-colors py-1"
          >
            Clear path
          </button>
        </motion.div>
      )}
    </div>
  );
}

/* ── Main ── */
export function LeftPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-64 flex-shrink-0 flex flex-col glass border-r border-white/[0.07] overflow-y-auto"
    >
      <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col">
        <SearchSection />
        <StatsSection />
        <LegendSection />
        <PathSection />
      </motion.div>
    </motion.aside>
  );
}
