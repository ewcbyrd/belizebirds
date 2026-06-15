import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedHabitats,
    setSelectedHabitats,
    selectedFamilies,
    setSelectedFamilies,
    allHabitats,
    allFamilies,
    resetFilters,
    filteredBirds,
    birds,
  } = useAppContext();

  const [showHabitatFilter, setShowHabitatFilter] = useState(false);
  const [showFamilyFilter, setShowFamilyFilter] = useState(false);

  const toggleHabitat = (habitat) => {
    if (selectedHabitats.includes(habitat)) {
      setSelectedHabitats(selectedHabitats.filter((h) => h !== habitat));
    } else {
      setSelectedHabitats([...selectedHabitats, habitat]);
    }
  };

  const toggleFamily = (family) => {
    if (selectedFamilies.includes(family)) {
      setSelectedFamilies(selectedFamilies.filter((f) => f !== family));
    } else {
      setSelectedFamilies([...selectedFamilies, family]);
    }
  };

  const hasActiveFilters =
    searchTerm || selectedHabitats.length > 0 || selectedFamilies.length > 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-belize-green focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Habitat Filter */}
        <div className="relative">
          <button
            onClick={() => setShowHabitatFilter(!showHabitatFilter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedHabitats.length > 0
                ? 'bg-belize-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Habitat
            {selectedHabitats.length > 0 && (
              <span className="bg-white text-belize-green text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedHabitats.length}
              </span>
            )}
          </button>

          {showHabitatFilter && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
              <div className="max-h-64 overflow-y-auto">
                {allHabitats.map((habitat) => (
                  <label
                    key={habitat}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedHabitats.includes(habitat)}
                      onChange={() => toggleHabitat(habitat)}
                      className="w-4 h-4 text-belize-green border-gray-300 rounded focus:ring-belize-green"
                    />
                    <span className="text-sm text-gray-700">{habitat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Family Filter */}
        <div className="relative">
          <button
            onClick={() => setShowFamilyFilter(!showFamilyFilter)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedFamilies.length > 0
                ? 'bg-belize-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Family
            {selectedFamilies.length > 0 && (
              <span className="bg-white text-belize-green text-xs font-bold px-2 py-0.5 rounded-full">
                {selectedFamilies.length}
              </span>
            )}
          </button>

          {showFamilyFilter && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
              <div className="max-h-64 overflow-y-auto">
                {allFamilies.map((family) => (
                  <label
                    key={family}
                    className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFamilies.includes(family)}
                      onChange={() => toggleFamily(family)}
                      className="w-4 h-4 text-belize-green border-gray-300 rounded focus:ring-belize-green"
                    />
                    <span className="text-sm text-gray-700">{family}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-3 text-sm text-gray-600">
        Showing {filteredBirds.length} of {birds.length} birds
      </div>
    </div>
  );
};

export default SearchBar;
