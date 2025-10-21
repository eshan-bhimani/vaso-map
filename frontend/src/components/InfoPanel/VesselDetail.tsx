/**
 * VesselDetail component for displaying detailed vessel information.
 *
 * Educational note: This panel shows comprehensive information about a selected vessel:
 * - Basic properties (name, type, diameter)
 * - Clinical notes
 * - Upstream and downstream neighbors (clickable)
 */

import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDiameterRange, getVesselTypeColor } from '../../utils/graphUtils';
import type { VesselNeighbor } from '../../types/vessel';

export function VesselDetail() {
  const { selectedVessel, setSelectedVessel, clearSelection, setIsLoading, setError } =
    useMapStore();

  if (!selectedVessel) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Select a vessel on the map to view details
        </p>
      </Card>
    );
  }

  // Handle clicking a neighbor vessel
  const handleNeighborClick = async (neighbor: VesselNeighbor) => {
    setIsLoading(true);
    setError(null);

    try {
      const details = await api.vessels.getById(neighbor.id);
      setSelectedVessel(details);
    } catch (error: any) {
      setError(error.message || 'Failed to load vessel details');
    } finally {
      setIsLoading(false);
    }
  };

  const vesselColor = getVesselTypeColor(selectedVessel.type);

  return (
    <Card
      title="Vessel Details"
      actions={
        <Button size="sm" variant="secondary" onClick={clearSelection}>
          Close
        </Button>
      }
      className="h-full overflow-y-auto"
    >
      <div className="space-y-4">
        {/* Vessel name with type indicator */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: vesselColor }}
            />
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedVessel.name}
            </h2>
          </div>

          {/* Aliases */}
          {selectedVessel.aliases.length > 0 && (
            <p className="text-sm text-gray-600">
              Also known as: <span className="font-medium">{selectedVessel.aliases.join(', ')}</span>
            </p>
          )}
        </div>

        {/* Basic properties */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium">{selectedVessel.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Oxygenation</p>
            <p className="font-medium">{selectedVessel.oxygenation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diameter</p>
            <p className="font-medium">
              {formatDiameterRange(
                selectedVessel.diameterMinMm,
                selectedVessel.diameterMaxMm
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Region</p>
            <p className="font-medium">{selectedVessel.region?.name || 'Unknown'}</p>
          </div>
        </div>

        {/* Description */}
        {selectedVessel.description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {selectedVessel.description}
            </p>
          </div>
        )}

        {/* Clinical notes */}
        {selectedVessel.clinicalNotes && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Clinical Notes
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              {selectedVessel.clinicalNotes}
            </p>
          </div>
        )}

        {/* Upstream neighbors */}
        {selectedVessel.upstreamNeighbors.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Upstream Vessels (feeding into this vessel)
            </h3>
            <div className="space-y-1">
              {selectedVessel.upstreamNeighbors.map((neighbor) => (
                <button
                  key={neighbor.id}
                  onClick={() => handleNeighborClick(neighbor)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getVesselTypeColor(neighbor.type) }}
                    />
                    <span className="text-sm font-medium">{neighbor.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Downstream neighbors */}
        {selectedVessel.downstreamNeighbors.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Downstream Vessels (branching from this vessel)
            </h3>
            <div className="space-y-1">
              {selectedVessel.downstreamNeighbors.map((neighbor) => (
                <button
                  key={neighbor.id}
                  onClick={() => handleNeighborClick(neighbor)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getVesselTypeColor(neighbor.type) }}
                    />
                    <span className="text-sm font-medium">{neighbor.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
