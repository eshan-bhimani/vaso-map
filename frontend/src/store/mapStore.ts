import { create } from 'zustand';
import type { Vessel, VesselDetail, VesselEdge, PathVessel } from '../types/vessel';

type RightTab = 'overview' | 'preview' | 'conditions' | 'systems';

interface MapState {
  // Graph data
  vessels: Vessel[];
  edges: VesselEdge[];

  // Selection
  selectedVessel: VesselDetail | null;

  // Search
  searchQuery: string;
  searchResults: Vessel[];

  // Path
  pathHighlight: number[];
  pathVessels: PathVessel[];

  // UI
  isLoading: boolean;
  error: string | null;
  commandPaletteOpen: boolean;
  simulateFlow: boolean;
  activeRightTab: RightTab;

  // Actions
  setVessels: (vessels: Vessel[]) => void;
  setEdges: (edges: VesselEdge[]) => void;
  setSelectedVessel: (vessel: VesselDetail | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Vessel[]) => void;
  setPathHighlight: (path: number[]) => void;
  setPathVessels: (vessels: PathVessel[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSimulateFlow: (simulate: boolean) => void;
  setActiveRightTab: (tab: RightTab) => void;
  clearPathHighlight: () => void;
  clearSelection: () => void;
  reset: () => void;
}

const initialState = {
  vessels: [],
  edges: [],
  selectedVessel: null,
  searchQuery: '',
  searchResults: [],
  pathHighlight: [],
  pathVessels: [],
  isLoading: false,
  error: null,
  commandPaletteOpen: false,
  simulateFlow: false,
  activeRightTab: 'overview' as RightTab,
};

export const useMapStore = create<MapState>((set) => ({
  ...initialState,

  setVessels: (vessels) => set({ vessels }),
  setEdges: (edges) => set({ edges }),
  setSelectedVessel: (vessel) => set({ selectedVessel: vessel, activeRightTab: 'overview' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSearchResults: (searchResults) => set({ searchResults }),
  setPathHighlight: (pathHighlight) => set({ pathHighlight }),
  setPathVessels: (pathVessels) => set({ pathVessels }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setSimulateFlow: (simulateFlow) => set({ simulateFlow }),
  setActiveRightTab: (activeRightTab) => set({ activeRightTab }),
  clearPathHighlight: () => set({ pathHighlight: [], pathVessels: [] }),
  clearSelection: () => set({ selectedVessel: null }),
  reset: () => set(initialState),
}));

// Selector hooks
export const useVessels = () => useMapStore((s) => s.vessels);
export const useSelectedVessel = () => useMapStore((s) => s.selectedVessel);
export const useSearchResults = () => useMapStore((s) => s.searchResults);
export const usePathHighlight = () => useMapStore((s) => s.pathHighlight);
export const useIsLoading = () => useMapStore((s) => s.isLoading);
export const useError = () => useMapStore((s) => s.error);
