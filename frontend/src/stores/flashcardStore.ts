import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DECKS, getCardsByDeck } from '../data/flashcards';

export type CardStatus = 'unseen' | 'learning' | 'mastered' | 'flagged';

interface CardProgress {
  status: CardStatus;
  lastReviewedAt: number | null;
  reviewCount: number;
}

interface DeckStats {
  total: number;
  mastered: number;
  learning: number;
  flagged: number;
  unseen: number;
}

interface FlashcardState {
  progress: Record<string, CardProgress>;
  markCard: (userId: string, cardId: string, status: CardStatus) => void;
  getCardStatus: (userId: string, cardId: string) => CardStatus;
  getDeckStats: (userId: string, deckId: string) => DeckStats;
  getReviewCardIds: (userId: string) => string[];
  resetDeck: (userId: string, deckId: string) => void;
}

function key(userId: string, cardId: string) {
  return `${userId}:${cardId}`;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      progress: {},

      markCard: (userId, cardId, status) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [key(userId, cardId)]: {
              status,
              lastReviewedAt: Date.now(),
              reviewCount: (s.progress[key(userId, cardId)]?.reviewCount ?? 0) + 1,
            },
          },
        })),

      getCardStatus: (userId, cardId) =>
        get().progress[key(userId, cardId)]?.status ?? 'unseen',

      getDeckStats: (userId, deckId) => {
        const cards = getCardsByDeck(deckId);
        const { progress } = get();
        const stats: DeckStats = { total: cards.length, mastered: 0, learning: 0, flagged: 0, unseen: 0 };
        for (const card of cards) {
          const s = progress[key(userId, card.id)]?.status ?? 'unseen';
          stats[s]++;
        }
        return stats;
      },

      getReviewCardIds: (userId) => {
        const { progress } = get();
        const ids: string[] = [];
        for (const deck of DECKS) {
          if (deck.id === 'review') continue;
          for (const card of getCardsByDeck(deck.id)) {
            const s = progress[key(userId, card.id)]?.status;
            if (s === 'flagged' || s === 'learning') ids.push(card.id);
          }
        }
        return ids;
      },

      resetDeck: (userId, deckId) =>
        set((s) => {
          const cards = getCardsByDeck(deckId);
          const next = { ...s.progress };
          for (const card of cards) delete next[key(userId, card.id)];
          return { progress: next };
        }),
    }),
    { name: 'vesselnav-flashcards' }
  )
);
