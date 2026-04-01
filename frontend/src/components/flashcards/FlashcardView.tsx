import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  question: string;
  answer: string;
  color: string;
  flipped: boolean;
  onFlip: () => void;
}

export function FlashcardView({ question, answer, color, flipped, onFlip }: Props) {
  return (
    <div
      className="w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ perspective: 1200 }}
      onClick={onFlip}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full aspect-[4/3]"
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            background: 'rgba(13, 17, 23, 0.85)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${color}30`,
            boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 40px ${color}10`,
          }}
        >
          <span className="label-mono mb-4" style={{ color }}>QUESTION</span>
          <p className="text-lg font-medium text-text-pri text-center leading-relaxed">{question}</p>
          <span className="label-mono mt-6 text-text-dim">Click or press Space to flip</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'rgba(22, 27, 34, 0.92)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${color}40`,
            boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 40px ${color}15`,
          }}
        >
          <span className="label-mono mb-4" style={{ color }}>ANSWER</span>
          <p className="text-base text-text-sec text-center leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}
