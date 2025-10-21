/**
 * TypeScript type definitions for the VasoMap frontend.
 *
 * Educational note: TypeScript provides static typing for JavaScript.
 * These types match the DTOs from our backend API, ensuring type safety
 * when making API calls and handling responses.
 */

/**
 * Enum for vessel types.
 * Matches the backend VesselType enum.
 */
export enum VesselType {
  ARTERY = 'ARTERY',
  VEIN = 'VEIN',
  CAPILLARY = 'CAPILLARY',
}

/**
 * Enum for oxygenation status.
 * Matches the backend Oxygenation enum.
 */
export enum Oxygenation {
  OXYGENATED = 'OXYGENATED',
  DEOXYGENATED = 'DEOXYGENATED',
  MIXED = 'MIXED',
}

/**
 * Basic vessel information for lists and search results.
 * Matches VesselDTO from backend.
 */
export interface Vessel {
  id: number;
  name: string;
  type: VesselType;
  oxygenation: Oxygenation;
  region: string | null;
  aliases: string[];
}

/**
 * Neighboring vessel information (lightweight).
 */
export interface VesselNeighbor {
  id: number;
  name: string;
  type: VesselType;
}

/**
 * Region information.
 */
export interface Region {
  id: number;
  name: string;
  description?: string;
}

/**
 * Detailed vessel information including neighbors.
 * Matches VesselDetailDTO from backend.
 */
export interface VesselDetail {
  id: number;
  name: string;
  type: VesselType;
  oxygenation: Oxygenation;
  diameterMinMm: number | null;
  diameterMaxMm: number | null;
  description: string | null;
  clinicalNotes: string | null;
  region: Region | null;
  aliases: string[];
  upstreamNeighbors: VesselNeighbor[];
  downstreamNeighbors: VesselNeighbor[];
}

/**
 * Edge connecting two vessels in the graph.
 * This is derived from the vessel data (not a direct API response).
 */
export interface VesselEdge {
  id: string; // Unique identifier for D3.js (e.g., "1-2")
  source: number; // Parent vessel ID
  target: number; // Child vessel ID
  label?: string; // Optional label (e.g., "first diagonal")
}

/**
 * Vessel in a path (lightweight).
 */
export interface PathVessel {
  id: number;
  name: string;
  type: VesselType;
}

/**
 * Pathfinding response.
 * Matches PathResponseDTO from backend.
 */
export interface PathResponse {
  path: PathVessel[];
  pathLength: number;
}

/**
 * Pathfinding request.
 * Matches PathRequestDTO from backend.
 */
export interface PathRequest {
  sourceId: number;
  targetId: number;
}

/**
 * Error response from API.
 * Matches ErrorResponse from backend.
 */
export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

/**
 * Graph node for D3.js force simulation.
 *
 * Educational note: D3.js adds simulation properties (x, y, vx, vy)
 * to nodes during force simulation. We extend our Vessel type with these.
 */
export interface GraphNode extends Vessel {
  x?: number; // X position (set by D3)
  y?: number; // Y position (set by D3)
  vx?: number; // X velocity (set by D3)
  vy?: number; // Y velocity (set by D3)
  fx?: number | null; // Fixed X position (for dragging)
  fy?: number | null; // Fixed Y position (for dragging)
}

/**
 * Graph link for D3.js force simulation.
 *
 * Educational note: D3.js can work with either node IDs or node objects.
 * After simulation starts, D3 replaces IDs with actual node references.
 */
export interface GraphLink {
  id: string;
  source: number | GraphNode; // Can be ID or node object
  target: number | GraphNode; // Can be ID or node object
  label?: string;
}
