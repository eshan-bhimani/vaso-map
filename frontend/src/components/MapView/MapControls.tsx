/**
 * MapControls component for graph manipulation buttons.
 *
 * Educational note: Provides UI controls for:
 * - Fit to view (reset zoom to show all vessels)
 * - Layer toggles (future: filter by arterial/venous)
 */

import React from 'react';
import { Button } from '../ui/Button';

interface MapControlsProps {
  onFitToView: () => void;
}

export function MapControls({ onFitToView }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Button onClick={onFitToView} size="sm" title="Fit all vessels in view">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </Button>
    </div>
  );
}
