/**
 * Main App component - application layout and routing.
 *
 * Educational note: The App component establishes the overall layout:
 * - Header with branding
 * - Left sidebar with search
 * - Center canvas with graph
 * - Right sidebar with vessel details
 * - Bottom panel with pathfinding
 *
 * The layout uses CSS Grid for responsive design.
 */

import React from 'react';
import { MapCanvas } from './components/MapView/MapCanvas';
import { SearchBar } from './components/SearchPanel/SearchBar';
import { VesselDetail } from './components/InfoPanel/VesselDetail';
import { PathFinder } from './components/PathPanel/PathFinder';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">VesselNav</h1>
              <p className="text-blue-100 text-sm">
                Explore the human vascular system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left sidebar - Search */}
        <aside className="col-span-3 space-y-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Search Vessels
            </h2>
            <SearchBar />
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Quick tips:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Search by name (e.g., "aorta")</li>
                <li>Use abbreviations (e.g., "LAD", "RCA")</li>
                <li>Click vessels on the map for details</li>
              </ul>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Legend</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Artery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700">Vein</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700">Capillary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                <span className="text-sm text-gray-700">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-700">Path Highlight</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center - Map Canvas */}
        <main className="col-span-6 bg-white rounded-lg shadow-md overflow-hidden">
          <MapCanvas />
        </main>

        {/* Right sidebar - Vessel Details */}
        <aside className="col-span-3 overflow-y-auto">
          <VesselDetail />
        </aside>
      </div>

      {/* Bottom panel - Path Finder */}
      <div className="px-4 pb-4">
        <PathFinder />
      </div>
    </div>
  );
}

export default App;
