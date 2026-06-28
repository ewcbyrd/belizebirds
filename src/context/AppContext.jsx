import { createContext, useContext, useState, useEffect } from 'react';
import birdsData from '../data/birds.json';
import { cacheManager } from '../utils/cacheManager';

const AppContext = createContext();

const getAssetPath = (path) => {
  const cleanPath = path.replace(/^\//, '');
  return import.meta.env.BASE_URL + cleanPath;
};

const parseFrequency = (frequency) => {
  if (!frequency) return -1;
  const num = parseFloat(frequency.replace('%', ''));
  return isNaN(num) ? -1 : num;
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

  const [birds] = useState(() =>
    birdsData.map(bird => ({
      ...bird,
      image: getAssetPath(bird.image),
      audio: getAssetPath(bird.audio)
    }))
  );

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
  }, [birds]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [sortBy, setSortBy] = useState('taxonomic');

  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [filteredBirds, setFilteredBirds] = useState(birds);

  useEffect(() => {
    let result = birds;

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
        bird.habitat.some((h) => selectedHabitats.includes(h))
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

    setFilteredBirds(result);
  }, [searchTerm, selectedHabitats, selectedFamilies, selectedSizes, selectedDiets, birds]);

  const allHabitats = [...new Set(birds.flatMap((bird) => bird.habitat))].sort();
  const allFamilies = [...new Set(birds.map((bird) => bird.family))].sort();
  const allSizes = [...new Set(birds.map((bird) => bird.size))].sort();
  const allDiets = [...new Set(birds.map((bird) => bird.diet))].sort();

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedHabitats([]);
    setSelectedFamilies([]);
    setSelectedSizes([]);
    setSelectedDiets([]);
  };

  const value = {
    isOnline,
    lastSyncTime,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
