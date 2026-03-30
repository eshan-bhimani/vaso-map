import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import {
  getVesselTypeColor,
  formatDiameterRange,
  getCommonConditions,
  getConnectedSystems,
  getVesselTypeLabel,
  getOxygenationLabel,
} from '../../utils/graphUtils';
import { ThreePreview } from './ThreePreview';
import type { VesselDetail, VesselNeighbor } from '../../types/vessel';

const TABS = [
  { id: 'overview',   label: 'Overview' },
  { id: 'preview',    label: '3D View' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'systems',    label: 'Systems' },
] as const;

const SEVERITY_COLORS = {
  high:   { bg: 'rgba(225,29,72,0.12)',   border: 'rgba(225,29,72,0.3)',   text: '#fb7185' },
  medium: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  text: '#fbbf24' },
  low:    { bg: 'rgba(34,211,238,0.10)',  border: 'rgba(34,211,238,0.25)', text: '#67e8f9' },
};

/* ─── Neighbor chip ─── */
function NeighborChip({ neighbor, onClick }: { neighbor: VesselNeighbor; onClick: () => void }) {
  const color = getVesselTypeColor(neighbor.type);
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:brightness-125"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {neighbor.name}
    </button>
  );
}

/* ─── Overview tab ─── */
function OverviewTab({ vessel }: { vessel: VesselDetail }) {
  const { setSelectedVessel, setIsLoading, setError } = useMapStore();
  const color = getVesselTypeColor(vessel.type);

  const selectNeighbor = async (id: number) => {
    setIsLoading(true);
    try {
      const details = await api.vessels.getById(id);
      setSelectedVessel(details);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Type',       value: getVesselTypeLabel(vessel.type) },
          { label: 'Oxygenation', value: getOxygenationLabel(vessel.oxygenation) },
          { label: 'Diameter',   value: formatDiameterRange(vessel.diameterMinMm, vessel.diameterMaxMm) },
          { label: 'Region',     value: vessel.region?.name ?? 'Unknown' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="label-mono mb-1">{stat.label}</div>
            <div className="text-sm font-medium text-text-pri">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Aliases */}
      {vessel.aliases.length > 0 && (
        <div>
          <div className="label-mono mb-2">Also known as</div>
          <div className="flex flex-wrap gap-1.5">
            {vessel.aliases.map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: `${color}14`,
                  border: `1px solid ${color}30`,
                  color: `${color}`,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {vessel.description && (
        <div>
          <div className="label-mono mb-2">Description</div>
          <p className="text-sm text-text-sec leading-relaxed">{vessel.description}</p>
        </div>
      )}

      {/* Clinical Notes */}
      {vessel.clinicalNotes && (
        <div
          className="rounded-xl p-3.5"
          style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
        >
          <div className="label-mono mb-2" style={{ color }}>Clinical Notes</div>
          <p className="text-sm text-text-sec leading-relaxed">{vessel.clinicalNotes}</p>
        </div>
      )}

      {/* Neighbors */}
      {(vessel.upstreamNeighbors.length > 0 || vessel.downstreamNeighbors.length > 0) && (
        <div className="space-y-3">
          {vessel.upstreamNeighbors.length > 0 && (
            <div>
              <div className="label-mono mb-2">↑ Upstream</div>
              <div className="flex flex-wrap gap-1.5">
                {vessel.upstreamNeighbors.map((n) => (
                  <NeighborChip key={n.id} neighbor={n} onClick={() => selectNeighbor(n.id)} />
                ))}
              </div>
            </div>
          )}
          {vessel.downstreamNeighbors.length > 0 && (
            <div>
              <div className="label-mono mb-2">↓ Downstream</div>
              <div className="flex flex-wrap gap-1.5">
                {vessel.downstreamNeighbors.map((n) => (
                  <NeighborChip key={n.id} neighbor={n} onClick={() => selectNeighbor(n.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Conditions tab ─── */
function ConditionsTab({ vessel }: { vessel: VesselDetail }) {
  const conditions = getCommonConditions(vessel);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-2.5"
    >
      <p className="text-xs text-text-dim mb-4">
        Common pathological conditions associated with this vessel type.
      </p>
      {conditions.map((c, i) => {
        const s = SEVERITY_COLORS[c.severity];
        return (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <span className="text-sm font-medium text-text-pri">{c.name}</span>
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: s.border, color: s.text }}
            >
              {c.severity}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ─── Systems tab ─── */
function SystemsTab({ vessel }: { vessel: VesselDetail }) {
  const systems = getConnectedSystems(vessel);
  const SYSTEM_ICONS: Record<string, string> = {
    'Cardiovascular System': '♥',
    'Nervous System':        '⚡',
    'Lymphatic System':      '◎',
    'Respiratory System':    '○',
    'Digestive System':      '◉',
    'Urinary System':        '◈',
    'Musculoskeletal System':'◆',
    'Peripheral Nervous System': '⚡',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-2.5"
    >
      <p className="text-xs text-text-dim mb-4">
        Body systems this vessel interfaces with.
      </p>
      {systems.map((sys, i) => (
        <motion.div
          key={sys}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.14)' }}
        >
          <span className="text-path-accent text-base w-5 text-center flex-shrink-0">
            {SYSTEM_ICONS[sys] ?? '●'}
          </span>
          <span className="text-sm font-medium text-text-pri">{sys}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Main component ─── */
export function VesselDeepDive({ vessel }: { vessel: VesselDetail }) {
  const { activeRightTab, setActiveRightTab, clearSelection } = useMapStore();
  const color = getVesselTypeColor(vessel.type);

  return (
    <motion.aside
      key={vessel.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-80 flex-shrink-0 flex flex-col glass border-l border-white/[0.07] overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-semibold text-text-pri leading-tight truncate"
              title={vessel.name}
            >
              {vessel.name}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="vessel-badge"
                style={{ color, borderColor: `${color}50`, background: `${color}18` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                {getVesselTypeLabel(vessel.type)}
              </span>
            </div>
          </div>
          <button
            onClick={clearSelection}
            className="p-1.5 rounded-lg text-text-dim hover:text-text-sec hover:bg-white/[0.05] transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Color accent line */}
        <div
          className="h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </div>

      {/* Tabs */}
      <div
        className="flex-shrink-0 flex px-4 pt-3 pb-0 gap-1"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRightTab(tab.id)}
            className="relative px-3 py-2 text-xs font-medium transition-colors"
            style={{
              color: activeRightTab === tab.id ? color : 'rgba(255,255,255,0.38)',
            }}
          >
            {tab.label}
            {activeRightTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-px rounded-full"
                style={{ background: color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {activeRightTab === 'overview' && (
            <OverviewTab key="overview" vessel={vessel} />
          )}
          {activeRightTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-text-dim mb-4">
                Stylized 3D segment · drag to rotate
              </p>
              <ThreePreview vesselType={vessel.type} vesselName={vessel.name} />
            </motion.div>
          )}
          {activeRightTab === 'conditions' && (
            <ConditionsTab key="conditions" vessel={vessel} />
          )}
          {activeRightTab === 'systems' && (
            <SystemsTab key="systems" vessel={vessel} />
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
