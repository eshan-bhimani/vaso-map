import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import { getVesselTypeColor } from '../../utils/graphUtils';
import type { Vessel } from '../../types/vessel';

interface Props {
  onClose: () => void;
}

/* ── Search input with vessel list dropdown ── */
function VesselSearchInput({
  label,
  value,
  onSelect,
  vessels,
  placeholder,
  accent,
}: {
  label: string;
  value: Vessel | null;
  onSelect: (v: Vessel | null) => void;
  vessels: Vessel[];
  placeholder: string;
  accent: string;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return vessels.slice(0, 10);
    return vessels
      .filter((v) => v.name.toLowerCase().includes(q) || v.aliases.some((a) => a.toLowerCase().includes(q)))
      .slice(0, 10);
  }, [query, vessels]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); if (filtered[highlighted]) pick(filtered[highlighted]); }
    if (e.key === 'Escape')    { setOpen(false); }
  };

  const pick = (v: Vessel) => {
    onSelect(v);
    setQuery('');
    setOpen(false);
  };

  const clear = () => { onSelect(null); setQuery(''); inputRef.current?.focus(); };

  return (
    <div ref={containerRef} className="relative">
      <div className="label-mono mb-1.5">{label}</div>
      <div
        className="flex items-center rounded-xl px-3 py-2.5 gap-2 transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${value ? `${accent}50` : 'rgba(255,255,255,0.1)'}`,
          boxShadow: value ? `0 0 0 1px ${accent}30` : 'none',
        }}
      >
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" style={{ color: value ? accent : 'rgba(255,255,255,0.3)' }}>
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {value ? (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: getVesselTypeColor(value.type) }} />
            <span className="text-sm font-medium text-text-pri truncate">{value.name}</span>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-text-pri placeholder:text-text-dim outline-none min-w-0"
          />
        )}

        {value && (
          <button onClick={clear} className="text-text-dim hover:text-text-sec transition-colors ml-auto flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && filtered.length > 0 && !value && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl overflow-hidden glass-elevated"
            style={{ maxHeight: 220 }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
              {filtered.map((v, i) => {
                const c = getVesselTypeColor(v.type);
                return (
                  <button
                    key={v.id}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => pick(v)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors"
                    style={{
                      background: i === highlighted ? 'rgba(255,255,255,0.06)' : 'transparent',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-pri truncate">{v.name}</div>
                      {v.aliases.length > 0 && (
                        <div className="text-xs text-text-dim truncate">{v.aliases.join(', ')}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono uppercase" style={{ color: c }}>
                      {v.type.toLowerCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main CommandPalette ── */
export function CommandPalette({ onClose }: Props) {
  const { vessels, setPathHighlight, setPathVessels, clearPathHighlight, simulateFlow, setSimulateFlow } = useMapStore();
  const [source, setSource] = useState<Vessel | null>(null);
  const [target, setTarget] = useState<Vessel | null>(null);
  const [pathResult, setPathResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleFind = async () => {
    if (!source || !target) return;
    if (source.id === target.id) { setError('Source and target must be different'); return; }
    setSearching(true);
    setError(null);
    setPathResult(null);
    try {
      const res = await api.paths.findPath({ sourceId: source.id, targetId: target.id });
      setPathResult(res);
      setPathHighlight(res.path.map((v: any) => v.id));
      setPathVessels(res.path);
    } catch (e: any) {
      setError(e.message ?? 'Path not found');
      clearPathHighlight();
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setSource(null);
    setTarget(null);
    setPathResult(null);
    setError(null);
    clearPathHighlight();
    setSimulateFlow(false);
  };

  const canFind = source && target && source.id !== target.id;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(3,7,18,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -16 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed inset-x-0 top-20 z-50 mx-auto glass-elevated rounded-2xl overflow-hidden"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-path-accent">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 8h2M12 8h2M8 2v2M8 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold text-text-pri">Path Finder</span>
            <span className="label-mono ml-1">⌘K</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-dim hover:text-text-sec hover:bg-white/[0.05] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <VesselSearchInput
              label="From"
              value={source}
              onSelect={setSource}
              vessels={vessels}
              placeholder="Search source vessel…"
              accent="#22d3ee"
            />
            <VesselSearchInput
              label="To"
              value={target}
              onSelect={setTarget}
              vessels={vessels}
              placeholder="Search target vessel…"
              accent="#22d3ee"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.25)' }}>
              {error}
            </div>
          )}

          {/* Path result */}
          <AnimatePresence>
            {pathResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl p-4" style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.18)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-path-accent">{pathResult.pathLength} vessels in path</span>
                    {/* Simulate Flow toggle */}
                    <button
                      onClick={() => setSimulateFlow(!simulateFlow)}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: simulateFlow ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${simulateFlow ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.12)'}`,
                        color: simulateFlow ? '#22d3ee' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${simulateFlow ? 'bg-path-accent animate-pulse' : 'bg-white/30'}`} />
                      Simulate Flow
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {pathResult.path.map((vessel: any, i: number) => {
                      const c = getVesselTypeColor(vessel.type);
                      return (
                        <div key={vessel.id} className="flex items-center gap-1.5">
                          <span
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: `${c}18`, border: `1px solid ${c}40`, color: c }}
                          >
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: c }} />
                            {vessel.name}
                          </span>
                          {i < pathResult.path.length - 1 && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-text-dim flex-shrink-0">
                              <path d="M2 5h6M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleFind}
              disabled={!canFind || searching}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canFind && !searching ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${canFind && !searching ? 'rgba(34,211,238,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: canFind && !searching ? '#22d3ee' : 'rgba(255,255,255,0.4)',
              }}
            >
              {searching ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                  Finding…
                </span>
              ) : (
                'Find Path'
              )}
            </button>
            {pathResult && (
              <button
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-text-sec hover:text-text-pri hover:bg-white/[0.05]"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
