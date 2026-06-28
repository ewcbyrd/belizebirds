import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FAMILY_NAMES } from '../data/familyNames';

const FilterDropdown = ({
  label,
  icon,
  isOpen,
  onToggle,
  selectedCount,
  children,
}) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
        selectedCount > 0
          ? 'bg-belize-green text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
      {selectedCount > 0 && (
        <span className="bg-white text-belize-green text-xs font-bold px-2 py-0.5 rounded-full">
          {selectedCount}
        </span>
      )}
    </button>
    {isOpen && (
      <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 min-w-[200px]">
        <div className="max-h-64 overflow-y-auto">{children}</div>
      </div>
    )}
  </div>
);

const filterIcon = (
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
);

const familyIcon = (
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
);

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedHabitats,
    setSelectedHabitats,
    selectedFamilies,
    setSelectedFamilies,
    selectedSizes,
    setSelectedSizes,
    selectedDiets,
    setSelectedDiets,
    allHabitats,
    allFamilies,
    allSizes,
    allDiets,
    sortBy,
    setSortBy,
    resetFilters,
    filteredBirds,
    birds,
  } = useAppContext();

  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (name) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const toggleItem = (selected, setSelected, item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const hasActiveFilters =
    searchTerm ||
    selectedHabitats.length > 0 ||
    selectedFamilies.length > 0 ||
    selectedSizes.length > 0 ||
    selectedDiets.length > 0;

  const checkboxOption = (item, selected, setSelected, label = item) => (
    <label
      key={item}
      className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer"
    >
      <input
        type="checkbox"
        checked={selected.includes(item)}
        onChange={() => toggleItem(selected, setSelected, item)}
        className="w-4 h-4 text-belize-green border-gray-300 rounded focus:ring-belize-green"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
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

          <div className="flex flex-wrap gap-2">
            <FilterDropdown
              label="Habitat"
              icon={filterIcon}
              isOpen={openFilter === 'habitat'}
              onToggle={() => toggleFilter('habitat')}
              selectedCount={selectedHabitats.length}
            >
              {allHabitats.map((habitat) =>
                checkboxOption(habitat, selectedHabitats, setSelectedHabitats)
              )}
            </FilterDropdown>

            <FilterDropdown
              label="Family"
              icon={familyIcon}
              isOpen={openFilter === 'family'}
              onToggle={() => toggleFilter('family')}
              selectedCount={selectedFamilies.length}
            >
              {allFamilies.map((family) =>
                checkboxOption(
                  family,
                  selectedFamilies,
                  setSelectedFamilies,
                  FAMILY_NAMES[family] || family
                )
              )}
            </FilterDropdown>

            <FilterDropdown
              label="Size"
              icon={filterIcon}
              isOpen={openFilter === 'size'}
              onToggle={() => toggleFilter('size')}
              selectedCount={selectedSizes.length}
            >
              {allSizes.map((size) =>
                checkboxOption(size, selectedSizes, setSelectedSizes)
              )}
            </FilterDropdown>

            <FilterDropdown
              label="Diet"
              icon={filterIcon}
              isOpen={openFilter === 'diet'}
              onToggle={() => toggleFilter('diet')}
              selectedCount={selectedDiets.length}
            >
              {allDiets.map((diet) =>
                checkboxOption(diet, selectedDiets, setSelectedDiets)
              )}
            </FilterDropdown>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-gray-600">
            Showing {filteredBirds.length} of {birds.length} birds
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm text-gray-600">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-belize-green focus:border-transparent"
            >
              <option value="taxonomic">Taxonomic</option>
              <option value="alpha">A–Z</option>
              <option value="frequency">Most common</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
