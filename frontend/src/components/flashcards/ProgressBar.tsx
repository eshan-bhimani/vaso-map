import { motion } from 'framer-motion';

interface Props {
  mastered: number;
  learning: number;
  flagged: number;
  unseen: number;
  total: number;
}

const SEGMENTS = [
  { key: 'mastered', color: '#22d3ee', label: 'Mastered' },
  { key: 'learning', color: '#3b82f6', label: 'Learning' },
  { key: 'flagged', color: '#f59e0b', label: 'Flagged' },
  { key: 'unseen', color: 'rgba(255,255,255,0.08)', label: 'Unseen' },
] as const;

export function ProgressBar({ mastered, learning, flagged, unseen, total }: Props) {
  if (total === 0) return null;
  const values = { mastered, learning, flagged, unseen };

  return (
    <div className="w-full">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
        {SEGMENTS.map((seg) => {
          const pct = (values[seg.key] / total) * 100;
          if (pct === 0) return null;
          return (
            <motion.div
              key={seg.key}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ background: seg.color }}
            />
          );
        })}
      </div>
    </div>
  );
}
