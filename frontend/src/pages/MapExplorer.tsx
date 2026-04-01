import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapCanvas } from '../components/MapView/MapCanvas';
import { VesselDeepDive } from '../components/InfoPanel/VesselDeepDive';
import { CommandPalette } from '../components/PathPanel/CommandPalette';
import { LeftPanel } from '../components/LeftPanel';
import { useMapStore } from '../store/mapStore';

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
          <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
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

export default function MapExplorer() {
  const { selectedVessel, commandPaletteOpen, setCommandPaletteOpen } = useMapStore();

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
    <div className="flex flex-1 overflow-hidden">
      <LeftPanel />

      <main className="flex-1 overflow-hidden relative">
        <MapCanvas />
      </main>

      <AnimatePresence mode="wait">
        {selectedVessel ? (
          <VesselDeepDive key={selectedVessel.id} vessel={selectedVessel} />
        ) : (
          <EmptyRightPanel key="empty" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette key="cmd" onClose={() => setCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
