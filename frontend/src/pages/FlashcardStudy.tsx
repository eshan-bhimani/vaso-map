import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeckById, getCardsByDeck, getCardById, FLASHCARDS } from '../data/flashcards';
import { useFlashcardStore, type CardStatus } from '../stores/flashcardStore';
import { useCurrentUser } from '../stores/authStore';
import { FlashcardView } from '../components/flashcards/FlashcardView';
import { StudyControls } from '../components/flashcards/StudyControls';
import { ProgressBar } from '../components/flashcards/ProgressBar';

export default function FlashcardStudy() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { markCard, getCardStatus, getDeckStats, getReviewCardIds, resetDeck } = useFlashcardStore();

  const deck = deckId ? getDeckById(deckId) : null;

  // Build the card list for this deck
  const cards = useMemo(() => {
    if (!deckId || !user) return [];
    if (deckId === 'review') {
      const ids = getReviewCardIds(user.id);
      return ids.map((id) => getCardById(id)).filter(Boolean) as typeof FLASHCARDS;
    }
    return getCardsByDeck(deckId);
  }, [deckId, user, getReviewCardIds]);

  // Sort: unseen first, then learning, then flagged, then mastered
  const sortedCards = useMemo(() => {
    if (!user) return cards;
    const order: Record<CardStatus, number> = { unseen: 0, learning: 1, flagged: 2, mastered: 3 };
    return [...cards].sort((a, b) => {
      const sa = getCardStatus(user.id, a.id);
      const sb = getCardStatus(user.id, b.id);
      return order[sa] - order[sb];
    });
  }, [cards, user, getCardStatus]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, mastered: 0, learning: 0 });
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const currentCard = sortedCards[currentIndex];

  const handleFlip = useCallback(() => setFlipped((f) => !f), []);

  const handleGoBack = useCallback(() => {
    if (completed) {
      setCompleted(false);
      setFlipped(false);
      return;
    }
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentIndex(prev);
    setFlipped(false);
  }, [history, completed]);

  const canGoBack = history.length > 0 || completed;

  const handleMark = useCallback(
    (status: CardStatus) => {
      if (!user || !currentCard) return;
      markCard(user.id, currentCard.id, status);

      setSessionStats((s) => ({
        reviewed: s.reviewed + 1,
        mastered: s.mastered + (status === 'mastered' ? 1 : 0),
        learning: s.learning + (status === 'learning' || status === 'flagged' ? 1 : 0),
      }));

      setHistory((h) => [...h, currentIndex]);

      if (currentIndex < sortedCards.length - 1) {
        setFlipped(false);
        setCurrentIndex((i) => i + 1);
      } else {
        setCompleted(true);
      }
    },
    [user, currentCard, currentIndex, sortedCards.length, markCard],
  );

  // Spacebar to flip, left arrow to go back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !completed) {
        e.preventDefault();
        handleFlip();
      }
      if (e.code === 'ArrowLeft' && canGoBack) {
        e.preventDefault();
        handleGoBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleFlip, handleGoBack, completed, canGoBack]);

  if (!deck || !user) {
    navigate('/flashcards');
    return null;
  }

  if (sortedCards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-sec mb-4">No cards in this deck yet.</p>
          <button onClick={() => navigate('/flashcards')} className="text-sm text-path-accent hover:underline">
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  const stats = deckId === 'review'
    ? { total: cards.length, mastered: 0, learning: cards.length, flagged: 0, unseen: 0 }
    : getDeckStats(user.id, deckId!);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/flashcards')}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8l4 4" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-bold text-text-pri">{deck.name}</h2>
              <p className="text-xs text-text-dim">
                {currentIndex + 1} of {sortedCards.length} cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canGoBack && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-sec hover:bg-white/[0.06] transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L1 8l5 5M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Go Back
                <kbd className="ml-0.5 px-1 py-0.5 rounded text-[9px] font-mono" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  ←
                </kbd>
              </button>
            )}

            {deckId !== 'review' && (
              <button
                onClick={() => {
                  resetDeck(user.id, deckId!);
                  setCurrentIndex(0);
                  setFlipped(false);
                  setSessionStats({ reviewed: 0, mastered: 0, learning: 0 });
                  setCompleted(false);
                  setHistory([]);
                }}
                className="text-xs text-text-dim hover:text-red-400 transition-colors"
              >
                Reset Deck
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <ProgressBar {...stats} />
        </div>

        <AnimatePresence mode="wait">
          {completed ? (
            /* Completion Screen */
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 text-center"
              style={{
                background: 'rgba(13, 17, 23, 0.78)',
                border: '1px solid rgba(34,211,238,0.2)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)' }}
              >
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none" className="text-path-accent">
                  <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-pri mb-2">Deck Complete!</h3>
              <div className="flex items-center justify-center gap-6 mt-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-path-accent">{sessionStats.reviewed}</p>
                  <p className="text-xs text-text-dim mt-0.5">Reviewed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{sessionStats.mastered}</p>
                  <p className="text-xs text-text-dim mt-0.5">Mastered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-selected">{sessionStats.learning}</p>
                  <p className="text-xs text-text-dim mt-0.5">Still Learning</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setFlipped(false);
                    setSessionStats({ reviewed: 0, mastered: 0, learning: 0 });
                    setCompleted(false);
                    setHistory([]);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-path-accent transition-all"
                  style={{ border: '1px solid rgba(34,211,238,0.3)', background: 'rgba(34,211,238,0.08)' }}
                >
                  Study Again
                </button>
                <button
                  onClick={() => navigate('/flashcards')}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-text-sec hover:bg-white/[0.06] transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Back to Decks
                </button>
              </div>
            </motion.div>
          ) : (
            /* Study Card */
            <motion.div key={currentCard?.id ?? 'card'} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {currentCard && (
                <>
                  <FlashcardView
                    question={currentCard.front}
                    answer={currentCard.back}
                    color={deck.color}
                    flipped={flipped}
                    onFlip={handleFlip}
                  />
                  <StudyControls onMark={handleMark} disabled={!flipped} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
