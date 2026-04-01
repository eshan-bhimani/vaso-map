import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from './ProgressBar';
import type { Deck } from '../../data/flashcards';

interface Props {
  deck: Deck;
  stats: { total: number; mastered: number; learning: number; flagged: number; unseen: number };
  index: number;
}

const DECK_ICONS: Record<string, string> = {
  'coronary-anatomy': 'M8 2C4.5 2 2 5 2 8c0 4.5 6 8 6 8s6-3.5 6-8c0-3-2.5-6-6-6z',
  'clinical-significance': 'M8 1v14M1 8h14M4 4l8 8M12 4L4 12',
  'vascular-pathways': 'M2 8h4l2-4 2 8 2-4h4',
  'abbreviations': 'M3 3h10v2H3zM5 7h6v2H5zM4 11h8v2H4z',
  'review': 'M8 2l1.5 4.5H14l-3.5 3 1.5 4.5L8 11l-4 3 1.5-4.5L2 6.5h4.5z',
};

export function DeckCard({ deck, stats, index }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (deck.id === 'review' && stats.total === 0) return;
    navigate(`/flashcards/${deck.id}`);
  };

  const pctMastered = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleClick}
      disabled={deck.id === 'review' && stats.total === 0}
      className="text-left w-full rounded-2xl p-5 transition-all group disabled:opacity-40 disabled:cursor-default"
      style={{
        background: 'rgba(13, 17, 23, 0.78)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${deck.color}22`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Icon + count */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-shadow group-hover:shadow-lg"
          style={{
            background: `${deck.color}18`,
            border: `1px solid ${deck.color}40`,
            boxShadow: `0 0 20px ${deck.color}15`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d={DECK_ICONS[deck.id] ?? DECK_ICONS['review']} stroke={deck.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="font-mono text-xs font-semibold" style={{ color: deck.color }}>
          {stats.total} cards
        </span>
      </div>

      {/* Title + desc */}
      <h3 className="text-sm font-semibold text-text-pri mb-1">{deck.name}</h3>
      <p className="text-xs text-text-dim mb-4 line-clamp-2">{deck.description}</p>

      {/* Progress */}
      <ProgressBar {...stats} />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] font-mono text-text-dim tracking-wider">{pctMastered}% MASTERED</span>
        {stats.learning + stats.flagged > 0 && (
          <span className="text-[10px] font-mono text-selected tracking-wider">
            {stats.learning + stats.flagged} TO REVIEW
          </span>
        )}
      </div>
    </motion.button>
  );
}
