/**
 * MapCanvas component - container for the vessel graph visualization.
 *
 * Educational note: This component wraps the VesselGraph and adds:
 * - Loading state
 * - Error display
 * - Map controls overlay
 */

import React from 'react';
import { VesselGraph } from './VesselGraph';
import { MapControls } from './MapControls';
import { useMapStore } from '../../store/mapStore';

export function MapCanvas() {
  const { isLoading, error } = useMapStore();

  const handleFitToView = () => {
    // This would trigger a zoom reset in VesselGraph
    // For MVP, the force simulation handles initial layout
    window.location.reload(); // Simple approach for MVP
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading vessels...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 max-w-md">
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map controls */}
      <MapControls onFitToView={handleFitToView} />

      {/* Graph visualization */}
      <VesselGraph />
    </div>
  );
}
