import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { CardStatus } from '../../stores/flashcardStore';

interface Props {
  onMark: (status: CardStatus) => void;
  disabled: boolean;
}

const BUTTONS = [
  { status: 'mastered' as CardStatus, label: 'Got It', key: '1', color: '#22d3ee', icon: 'M5 13l4 4L15 7' },
  { status: 'learning' as CardStatus, label: 'Still Learning', key: '2', color: '#3b82f6', icon: 'M8 4v8M4 8h8' },
  { status: 'flagged' as CardStatus, label: 'Flag for Review', key: '3', color: '#f59e0b', icon: 'M4 2v14l4-3 4 3V2z' },
];

export function StudyControls({ onMark, disabled }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return;
      const btn = BUTTONS.find((b) => b.key === e.key);
      if (btn) onMark(btn.status);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onMark, disabled]);

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {BUTTONS.map((btn, i) => (
        <motion.button
          key={btn.status}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          onClick={() => onMark(btn.status)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:brightness-110 disabled:opacity-30"
          style={{
            background: `${btn.color}15`,
            border: `1px solid ${btn.color}35`,
            color: btn.color,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d={btn.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {btn.label}
          <kbd
            className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {btn.key}
          </kbd>
        </motion.button>
      ))}
    </div>
  );
}
