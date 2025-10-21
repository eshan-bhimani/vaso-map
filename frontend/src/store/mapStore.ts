/**
 * Zustand store for managing application state.
 *
 * Educational note: Zustand is a lightweight state management library.
 * Benefits over alternatives like Redux:
 * - Less boilerplate
 * - Simple API
 * - No providers needed
 * - TypeScript-friendly
 *
 * The store holds:
 * - Vessels and edges (graph data)
 * - Selected vessel
 * - Search results
 * - Path highlight
 * - Loading and error states
 */

import { create } from 'zustand';
import type { Vessel, VesselDetail, VesselEdge } from '../types/vessel';

/**
 * State interface for the map store.
 *
 * Educational note: Defining the state interface separately improves
 * type inference and makes the store easier to understand.
 */
interface MapState {
  // Graph data
  vessels: Vessel[];
  edges: VesselEdge[];

  // Selection and filtering
  selectedVessel: VesselDetail | null;
  searchQuery: string;
  searchResults: Vessel[];
  pathHighlight: number[]; // Array of vessel IDs in the highlighted path

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setVessels: (vessels: Vessel[]) => void;
  setEdges: (edges: VesselEdge[]) => void;
  setSelectedVessel: (vessel: VesselDetail | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Vessel[]) => void;
  setPathHighlight: (path: number[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPathHighlight: () => void;
  clearSelection: () => void;
  reset: () => void;
}

/**
 * Initial state values.
 */
const initialState = {
  vessels: [],
  edges: [],
  selectedVessel: null,
  searchQuery: '',
  searchResults: [],
  pathHighlight: [],
  isLoading: false,
  error: null,
};

/**
 * Create the Zustand store.
 *
 * Educational note: The create() function takes a callback that receives
 * a set() function for updating state. We use set() to perform immutable updates.
 *
 * Zustand automatically notifies subscribed components when state changes.
 */
export const useMapStore = create<MapState>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  /**
   * Set the list of vessels.
   * Called after fetching vessels from the API.
   */
  setVessels: (vessels) => set({ vessels }),

  /**
   * Set the list of edges connecting vessels.
   * Derived from vessel neighbor data.
   */
  setEdges: (edges) => set({ edges }),

  /**
   * Set the currently selected vessel.
   * When a user clicks a vessel, its full details are loaded and set here.
   */
  setSelectedVessel: (vessel) => set({ selectedVessel: vessel }),

  /**
   * Set the search query string.
   * Updated as user types in the search bar.
   */
  setSearchQuery: (query) => set({ searchQuery: query }),

  /**
   * Set the search results.
   * Updated after search API call completes.
   */
  setSearchResults: (results) => set({ searchResults: results }),

  /**
   * Set the path highlight (array of vessel IDs).
   * When a path is found, these vessel IDs are highlighted on the graph.
   */
  setPathHighlight: (path) => set({ pathHighlight: path }),

  /**
   * Set loading state.
   * Shows loading indicator in UI.
   */
  setIsLoading: (loading) => set({ isLoading: loading }),

  /**
   * Set error message.
   * Displays error notification in UI.
   */
  setError: (error) => set({ error }),

  /**
   * Clear the path highlight.
   * Called when user dismisses the path or starts a new search.
   */
  clearPathHighlight: () => set({ pathHighlight: [] }),

  /**
   * Clear the selected vessel.
   * Closes the vessel detail panel.
   */
  clearSelection: () => set({ selectedVessel: null }),

  /**
   * Reset the entire store to initial state.
   * Useful for cleanup or testing.
   */
  reset: () => set(initialState),
}));

/**
 * Selector hooks for convenient access to specific state slices.
 *
 * Educational note: These hooks allow components to subscribe only to
 * the state they need, improving performance by reducing re-renders.
 */

// Example usage: const vessels = useVessels();
export const useVessels = () => useMapStore((state) => state.vessels);
export const useSelectedVessel = () => useMapStore((state) => state.selectedVessel);
export const useSearchResults = () => useMapStore((state) => state.searchResults);
export const usePathHighlight = () => useMapStore((state) => state.pathHighlight);
export const useIsLoading = () => useMapStore((state) => state.isLoading);
export const useError = () => useMapStore((state) => state.error);
