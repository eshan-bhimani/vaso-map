/**
 * PathFinder component for finding paths between vessels.
 *
 * Educational note: This component allows users to:
 * - Select source and target vessels from dropdowns
 * - Find the shortest path between them
 * - View the path as an ordered list
 * - Visualize the path on the graph (highlighted)
 */

import React, { useState, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { getVesselTypeColor } from '../../utils/graphUtils';

export function PathFinder() {
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [pathResult, setPathResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { vessels, setPathHighlight, clearPathHighlight } = useMapStore();

  // Clear path when vessels change or component unmounts
  useEffect(() => {
    return () => clearPathHighlight();
  }, [clearPathHighlight]);

  const handleFindPath = async () => {
    if (!sourceId || !targetId) {
      setError('Please select both source and target vessels');
      return;
    }

    if (sourceId === targetId) {
      setError('Source and target must be different vessels');
      return;
    }

    setIsSearching(true);
    setError(null);
    setPathResult(null);

    try {
      const result = await api.paths.findPath({ sourceId, targetId });
      setPathResult(result);

      // Highlight the path on the graph
      const pathIds = result.path.map((v) => v.id);
      setPathHighlight(pathIds);
    } catch (err: any) {
      setError(err.message || 'Failed to find path');
      clearPathHighlight();
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSourceId(null);
    setTargetId(null);
    setPathResult(null);
    setError(null);
    clearPathHighlight();
  };

  return (
    <Card title="Path Finder" className="w-full">
      <div className="space-y-4">
        {/* Source vessel dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Vessel
          </label>
          <select
            value={sourceId || ''}
            onChange={(e) => setSourceId(Number(e.target.value) || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a vessel...</option>
            {vessels.map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
                {vessel.aliases.length > 0 && ` (${vessel.aliases[0]})`}
              </option>
            ))}
          </select>
        </div>

        {/* Target vessel dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Vessel
          </label>
          <select
            value={targetId || ''}
            onChange={(e) => setTargetId(Number(e.target.value) || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a vessel...</option>
            {vessels.map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
                {vessel.aliases.length > 0 && ` (${vessel.aliases[0]})`}
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleFindPath}
            disabled={!sourceId || !targetId || isSearching}
            className="flex-1"
          >
            {isSearching ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Finding...
              </span>
            ) : (
              'Find Path'
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleClear}
            disabled={isSearching}
          >
            Clear
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Path result */}
        {pathResult && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              Path Found ({pathResult.pathLength} vessels)
            </h4>
            <ol className="space-y-2">
              {pathResult.path.map((vessel: any, index: number) => (
                <li key={vessel.id} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getVesselTypeColor(vessel.type),
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {vessel.name}
                      </span>
                    </div>
                  </div>
                  {index < pathResult.path.length - 1 && (
                    <div className="text-gray-400">→</div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Instructions */}
        {!pathResult && !error && (
          <div className="text-sm text-gray-600">
            <p>
              Select a source and target vessel to find the shortest path through
              the vascular network. The path will be highlighted on the map.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
