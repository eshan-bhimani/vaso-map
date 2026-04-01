import { useState } from 'react';
import { motion } from 'framer-motion';
import { DECKS } from '../data/flashcards';
import { DeckCard } from '../components/flashcards/DeckCard';
import { useFlashcardStore } from '../stores/flashcardStore';
import { useCurrentUser } from '../stores/authStore';
import { AuthModal } from '../components/auth/AuthModal';

export default function FlashcardsHome() {
  const user = useCurrentUser();
  const [authOpen, setAuthOpen] = useState(false);
  const getDeckStats = useFlashcardStore((s) => s.getDeckStats);
  const getReviewCardIds = useFlashcardStore((s) => s.getReviewCardIds);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}
          >
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none" className="text-path-accent">
              <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-pri mb-2">Sign in to Study</h2>
          <p className="text-sm text-text-dim max-w-xs">
            Create an account to track your progress across all flashcard decks and build your personalized review list.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setAuthOpen(true)}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(34,211,238,0.08))',
            border: '1px solid rgba(34,211,238,0.3)',
            color: '#22d3ee',
          }}
        >
          Sign In / Sign Up
        </motion.button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  const reviewIds = getReviewCardIds(user.id);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-text-pri mb-1">Flashcard Decks</h2>
          <p className="text-sm text-text-dim">
            Master cardiovascular anatomy one card at a time. Your progress is saved automatically.
          </p>
        </motion.div>

        {/* Deck grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DECKS.map((deck, i) => {
            const stats = deck.id === 'review'
              ? {
                  total: reviewIds.length,
                  mastered: 0,
                  learning: reviewIds.length,
                  flagged: 0,
                  unseen: 0,
                }
              : getDeckStats(user.id, deck.id);

            return <DeckCard key={deck.id} deck={deck} stats={stats} index={i} />;
          })}
        </div>
      </div>
    </div>
  );
}
