import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import birdsData from '../data/birds.json';
import districtSpeciesData from '../data/generated/district-species.json';
import { cacheManager } from '../utils/cacheManager';
import { useChecklist } from '../hooks/useChecklist';
import { useDistrict } from '../hooks/useDistrict';
import { CANONICAL_HABITATS } from '../data/habitatTaxonomy';
import { mergeBirdData, getDataGeneratedAt } from '../utils/mergeBirdData';

const AppContext = createContext();

const getAssetPath = (path) => {
  if (!path) return '';
  const cleanPath = path.replace(/^\//, '');
  return import.meta.env.BASE_URL + cleanPath;
};

export const parseFrequency = (frequency) => {
  if (!frequency) return -1;
  const num = parseFloat(frequency.replace('%', ''));
  return isNaN(num) ? -1 : num;
};

export const parseReportingRate = (bird) => {
  if (bird.reportingRate != null && bird.reportingRate >= 0) {
    return bird.reportingRate;
  }
  return parseFrequency(bird.frequency) / 100;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const { isSeen, toggleSeen, seenCount, clearChecklist } = useChecklist();
  const { selectedDistrict, setSelectedDistrict } = useDistrict();

  const curatedBirds = useMemo(
    () =>
      birdsData.map((bird) => ({
        ...bird,
        image: getAssetPath(bird.image),
        audio: getAssetPath(bird.audio),
      })),
    []
  );

  const birds = useMemo(
    () =>
      mergeBirdData({
        curatedBirds,
        districtSpecies: districtSpeciesData,
        selectedDistrict,
      }).map((bird) => ({
        ...bird,
        image: bird.image?.startsWith('http')
          ? bird.image
          : getAssetPath(bird.image || '/birds/placeholder.jpg'),
        audio: bird.audio ? getAssetPath(bird.audio) : '',
      })),
    [curatedBirds, selectedDistrict]
  );

  const dataGeneratedAt = getDataGeneratedAt(districtSpeciesData);

  useEffect(() => {
    const initCache = async () => {
      await cacheManager.init();
      await cacheManager.cacheBirds(birds);
      const syncTime = await cacheManager.getFormattedLastSync();
      setLastSyncTime(syncTime);
    };

    initCache();

    const handleOnline = () => {
      setIsOnline(true);
      initCache();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [birds, dataGeneratedAt]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [checklistFilter, setChecklistFilter] = useState('all');
  const [sortBy, setSortBy] = useState('taxonomic');

  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [filteredBirds, setFilteredBirds] = useState(birds);

  useEffect(() => {
    let result = birds.filter((bird) => bird.inDistrict !== false);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (bird) =>
          bird.commonName.toLowerCase().includes(term) ||
          bird.scientificName.toLowerCase().includes(term)
      );
    }

    if (selectedHabitats.length > 0) {
      result = result.filter((bird) =>
        bird.habitat?.some((h) => selectedHabitats.includes(h))
      );
    }

    if (selectedFamilies.length > 0) {
      result = result.filter((bird) =>
        selectedFamilies.includes(bird.family)
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter((bird) => selectedSizes.includes(bird.size));
    }

    if (selectedDiets.length > 0) {
      result = result.filter((bird) => selectedDiets.includes(bird.diet));
    }

    if (checklistFilter === 'seen') {
      result = result.filter((bird) => isSeen(bird.slug));
    } else if (checklistFilter === 'unseen') {
      result = result.filter((bird) => !isSeen(bird.slug));
    }

    setFilteredBirds(result);
  }, [
    searchTerm,
    selectedHabitats,
    selectedFamilies,
    selectedSizes,
    selectedDiets,
    checklistFilter,
    birds,
    isSeen,
    seenCount,
  ]);

  const allHabitats = [...CANONICAL_HABITATS].sort((a, b) =>
    a.localeCompare(b)
  );
  const allFamilies = [...new Set(birds.map((bird) => bird.family))].sort();
  const allSizes = [...new Set(birds.map((bird) => bird.size))].sort();
  const allDiets = [...new Set(birds.map((bird) => bird.diet))].sort();

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedHabitats([]);
    setSelectedFamilies([]);
    setSelectedSizes([]);
    setSelectedDiets([]);
    setChecklistFilter('all');
  };

  const value = {
    isOnline,
    lastSyncTime,
    dataGeneratedAt,
    birds,
    filteredBirds,
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
    checklistFilter,
    setChecklistFilter,
    allHabitats,
    allFamilies,
    allSizes,
    allDiets,
    sortBy,
    setSortBy,
    resetFilters,
    currentlyPlaying,
    setCurrentlyPlaying,
    parseFrequency,
    parseReportingRate,
    isSeen,
    toggleSeen,
    seenCount,
    clearChecklist,
    selectedDistrict,
    setSelectedDistrict,
    districtSpecies: districtSpeciesData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
