/**
 * SearchBar component for searching vessels.
 *
 * Educational note: This component provides:
 * - Real-time search as user types (with debouncing)
 * - Autocomplete dropdown with results
 * - Keyboard navigation (up/down arrows, Enter to select)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useMapStore } from '../../store/mapStore';
import { api } from '../../services/api';
import { getVesselDisplayName } from '../../utils/graphUtils';
import type { Vessel } from '../../types/vessel';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Vessel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setSelectedVessel, setIsLoading, setError } = useMapStore();

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const vessels = await api.vessels.getAll(query);
        setResults(vessels);
        setIsOpen(vessels.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectVessel(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle selecting a vessel from results
  const handleSelectVessel = async (vessel: Vessel) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch full vessel details
      const details = await api.vessels.getById(vessel.id);
      setSelectedVessel(details);

      // Close dropdown and clear search
      setIsOpen(false);
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    } catch (error: any) {
      setError(error.message || 'Failed to load vessel details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search vessels (e.g., LAD, coronary)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Search icon */}
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Loading spinner */}
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {results.map((vessel, index) => (
            <button
              key={vessel.id}
              onClick={() => handleSelectVessel(vessel)}
              className={`
                w-full px-4 py-2 text-left hover:bg-blue-50
                ${index === selectedIndex ? 'bg-blue-100' : ''}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === results.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              <div className="font-medium text-gray-900">
                {vessel.name}
              </div>
              {vessel.aliases.length > 0 && (
                <div className="text-sm text-gray-600">
                  Also known as: {vessel.aliases.join(', ')}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {vessel.type} • {vessel.region || 'Unknown region'}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-600">
          No vessels found for "{query}"
        </div>
      )}
    </div>
  );
}
