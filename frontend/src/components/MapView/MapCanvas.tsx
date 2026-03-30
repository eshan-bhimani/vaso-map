import { VesselGraph } from './VesselGraph';
import { useMapStore } from '../../store/mapStore';

export function MapCanvas() {
  const { isLoading, error } = useMapStore();

  return (
    <div className="relative w-full h-full bg-bg-base">
      {/* Subtle radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-2 border-path-accent border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-text-sec text-sm font-medium tracking-wide">Mapping vascular network…</p>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass-elevated rounded-xl px-5 py-3 flex items-center gap-3 max-w-sm">
          <div className="w-2 h-2 rounded-full bg-artery animate-pulse" />
          <p className="text-sm text-text-pri">{error}</p>
        </div>
      )}

      {/* Graph visualization */}
      <VesselGraph />
    </div>
  );
}
