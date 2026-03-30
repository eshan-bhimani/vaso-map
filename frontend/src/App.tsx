import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapCanvas } from './components/MapView/MapCanvas';
import { VesselDeepDive } from './components/InfoPanel/VesselDeepDive';
import { CommandPalette } from './components/PathPanel/CommandPalette';
import { LeftPanel } from './components/LeftPanel';
import { useMapStore } from './store/mapStore';

/* ── Header ── */
function Header() {
  const { vessels, setCommandPaletteOpen } = useMapStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex-shrink-0 flex items-center justify-between px-5 py-3 glass border-b border-white/[0.07] z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', boxShadow: '0 0 16px rgba(34,211,238,0.15)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-path-accent">
            <circle cx="8" cy="8" r="2.5" fill="currentColor" />
            <path d="M2 8c0-2 1.5-4 4-5M14 8c0 2-1.5 4-4 5M8 2c2 0 4 1.5 5 4M8 14c-2 0-4-1.5-5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-text-pri tracking-wide">VesselNav</h1>
          <p className="text-[10px] font-mono text-text-dim tracking-wider">VASCULAR DISCOVERY PLATFORM</p>
        </div>
      </div>

      {/* Center — quick search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-text-dim hover:text-text-sec transition-all"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <svg width="13" height="13" fill="none" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Find a path…
        <kbd className="ml-2 label-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
      </button>

      {/* Right — vessel count badge */}
      <div className="flex items-center gap-3">
        {vessels.length > 0 && (
          <div
            className="px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.18)' }}
          >
            <span className="font-mono text-xs text-path-accent font-semibold">{vessels.length}</span>
            <span className="text-xs text-text-dim ml-1.5">vessels mapped</span>
          </div>
        )}
        {/* Status dot */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-text-dim">Live</span>
        </div>
      </div>
    </motion.header>
  );
}

/* ── Empty right state ── */
function EmptyRightPanel() {
  return (
    <motion.aside
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-80 flex-shrink-0 flex flex-col items-center justify-center gap-4 glass border-l border-white/[0.07]"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-text-dim">
          <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="11" cy="11" r="3"   stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 11h1M17 11h1M11 4v1M11 17v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="text-center px-6">
        <p className="text-sm font-medium text-text-sec">Select a vessel</p>
        <p className="text-xs text-text-dim mt-1">Click any node on the graph to explore its anatomy and connections</p>
      </div>
    </motion.aside>
  );
}

/* ── Root App ── */
export default function App() {
  const { selectedVessel, commandPaletteOpen, setCommandPaletteOpen } = useMapStore();

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen]);

  return (
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <LeftPanel />

        {/* Center — graph */}
        <main className="flex-1 overflow-hidden relative">
          <MapCanvas />
        </main>

        {/* Right panel — deep dive or empty */}
        <AnimatePresence mode="wait">
          {selectedVessel ? (
            <VesselDeepDive key={selectedVessel.id} vessel={selectedVessel} />
          ) : (
            <EmptyRightPanel key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette
            key="cmd"
            onClose={() => setCommandPaletteOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
