/**
 * Utility functions for graph operations.
 *
 * Educational note: These utilities help with:
 * - Building graph data structures from API responses
 * - Color mapping for different vessel types
 * - Graph calculations
 */

import type { Vessel, VesselEdge, VesselType, Oxygenation } from '../types/vessel';

/**
 * Get color for a vessel type.
 *
 * Educational note: Consistent color coding helps users quickly identify
 * vessel types in the visualization.
 *
 * @param type Vessel type
 * @returns Hex color code
 */
export function getVesselTypeColor(type: VesselType): string {
  switch (type) {
    case 'ARTERY':
      return '#ef4444'; // red-500 (Tailwind)
    case 'VEIN':
      return '#3b82f6'; // blue-500
    case 'CAPILLARY':
      return '#a855f7'; // purple-500
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get color for oxygenation status.
 * Alternative coloring scheme (not used in MVP but useful for future).
 *
 * @param oxygenation Oxygenation status
 * @returns Hex color code
 */
export function getOxygenationColor(oxygenation: Oxygenation): string {
  switch (oxygenation) {
    case 'OXYGENATED':
      return '#ef4444'; // red (oxygen-rich)
    case 'DEOXYGENATED':
      return '#3b82f6'; // blue (oxygen-poor)
    case 'MIXED':
      return '#a855f7'; // purple (mixed)
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Color for selected vessels.
 */
export const SELECTED_COLOR = '#fbbf24'; // amber-400

/**
 * Color for highlighted path.
 */
export const PATH_HIGHLIGHT_COLOR = '#10b981'; // emerald-500

/**
 * Build edges from vessel data.
 *
 * Educational note: The backend doesn't return edges directly.
 * Instead, each vessel has upstreamNeighbors and downstreamNeighbors.
 * We derive edges by looking at all vessels and their connections.
 *
 * This function creates a unique edge ID and determines direction.
 *
 * @param vessels Array of vessels with neighbor information
 * @returns Array of edges
 */
export function buildEdgesFromVessels(vessels: Vessel[]): VesselEdge[] {
  const edges: VesselEdge[] = [];
  const edgeSet = new Set<string>(); // Track unique edges to avoid duplicates

  // Note: For the basic vessel list, we don't have neighbor information
  // Edges will be populated when we fetch vessel details or use a separate endpoint
  // For now, this returns an empty array and edges should be built from detail data

  return edges;
}

/**
 * Check if a vessel is in a highlighted path.
 *
 * @param vesselId Vessel ID to check
 * @param pathHighlight Array of highlighted vessel IDs
 * @returns True if vessel is in the path
 */
export function isVesselInPath(vesselId: number, pathHighlight: number[]): boolean {
  return pathHighlight.includes(vesselId);
}

/**
 * Check if an edge is in a highlighted path.
 *
 * Educational note: An edge is in the path if both its source and target
 * are in the path AND they're adjacent in the path array.
 *
 * @param source Source vessel ID
 * @param target Target vessel ID
 * @param pathHighlight Array of highlighted vessel IDs (in order)
 * @returns True if edge is in the path
 */
export function isEdgeInPath(
  source: number,
  target: number,
  pathHighlight: number[]
): boolean {
  for (let i = 0; i < pathHighlight.length - 1; i++) {
    if (pathHighlight[i] === source && pathHighlight[i + 1] === target) {
      return true;
    }
  }
  return false;
}

/**
 * Get display name for a vessel (with aliases).
 *
 * @param vessel Vessel object
 * @returns Display name with aliases in parentheses
 */
export function getVesselDisplayName(vessel: Vessel): string {
  if (vessel.aliases.length === 0) {
    return vessel.name;
  }
  return `${vessel.name} (${vessel.aliases.join(', ')})`;
}

/**
 * Format diameter range for display.
 *
 * @param minMm Minimum diameter in mm
 * @param maxMm Maximum diameter in mm
 * @returns Formatted string (e.g., "3.0 - 4.0 mm")
 */
export function formatDiameterRange(
  minMm: number | null,
  maxMm: number | null
): string {
  if (minMm === null && maxMm === null) {
    return 'Unknown';
  }
  if (minMm === null) {
    return `~${maxMm} mm`;
  }
  if (maxMm === null) {
    return `~${minMm} mm`;
  }
  if (minMm === maxMm) {
    return `${minMm} mm`;
  }
  return `${minMm} - ${maxMm} mm`;
}

/**
 * Truncate text to a maximum length.
 *
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
