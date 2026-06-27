import { createContext, useContext, useState, useEffect } from 'react';
import birdsData from '../data/birds.json';
import { cacheManager } from '../utils/cacheManager';

const AppContext = createContext();

// Helper function to get full path for public assets
const getAssetPath = (path) => {
  // Remove leading slash if present and prepend BASE_URL
  const cleanPath = path.replace(/^\//, '');
  return import.meta.env.BASE_URL + cleanPath;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // App Mode: 'gallery' or 'quiz'
  const [mode, setMode] = useState('gallery');

  // Offline state
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Birds data with BASE_URL prepended to image and audio paths
  const [birds] = useState(() =>
    birdsData.map(bird => ({
      ...bird,
      image: getAssetPath(bird.image),
      audio: getAssetPath(bird.audio)
    }))
  );

  // Initialize cache and listen for online/offline events
  useEffect(() => {
    // Initialize cache manager
    const initCache = async () => {
      await cacheManager.init();
      // Cache the birds data
      await cacheManager.cacheBirds(birds);
      // Update last sync time
      const syncTime = await cacheManager.getFormattedLastSync();
      setLastSyncTime(syncTime);
    };

    initCache();

    // Handle online/offline events
    const handleOnline = () => {
      console.log('[App] Back online');
      setIsOnline(true);
      // Optionally trigger cache refresh
      initCache();
    };

    const handleOffline = () => {
      console.log('[App] Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [birds]);

  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHabitats, setSelectedHabitats] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);

  // Audio state (to prevent multiple audio playing at once)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  // Quiz state
  const [quizMode, setQuizMode] = useState('identify'); // 'identify' or 'match-call'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Filtered birds based on search and filters
  const [filteredBirds, setFilteredBirds] = useState(birds);

  // Filter birds whenever search or filter changes
  useEffect(() => {
    let result = birds;

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (bird) =>
          bird.commonName.toLowerCase().includes(term) ||
          bird.scientificName.toLowerCase().includes(term)
      );
    }

    // Apply habitat filter
    if (selectedHabitats.length > 0) {
      result = result.filter((bird) =>
        bird.habitat.some((h) => selectedHabitats.includes(h))
      );
    }

    // Apply family filter
    if (selectedFamilies.length > 0) {
      result = result.filter((bird) =>
        selectedFamilies.includes(bird.family)
      );
    }

    setFilteredBirds(result);
  }, [searchTerm, selectedHabitats, selectedFamilies, birds]);

  // Get all unique habitats from birds data
  const allHabitats = [...new Set(birds.flatMap((bird) => bird.habitat))].sort();

  // Get all unique families from birds data
  const allFamilies = [...new Set(birds.map((bird) => bird.family))].sort();

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedHabitats([]);
    setSelectedFamilies([]);
  };

  // Quiz functions
  const startQuiz = (mode = 'identify', numQuestions = 10) => {
    setQuizMode(mode);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizComplete(false);
    setScore(0);

    // Generate random questions from birds
    const shuffled = [...birds].sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, Math.min(numQuestions, birds.length));
    setQuizQuestions(questions);
    setMode('quiz');
  };

  const answerQuestion = (birdId, selectedAnswer) => {
    const currentBird = quizQuestions[currentQuestionIndex];
    const isCorrect = currentBird.id === selectedAnswer;

    setAnswers([
      ...answers,
      {
        questionIndex: currentQuestionIndex,
        birdId: currentBird.id,
        selectedAnswer,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex + 1 >= quizQuestions.length) {
      setQuizComplete(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const restartQuiz = () => {
    startQuiz(quizMode, quizQuestions.length);
  };

  const exitQuiz = () => {
    setMode('gallery');
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizComplete(false);
    setScore(0);
  };

  const value = {
    // Mode
    mode,
    setMode,

    // Offline state
    isOnline,
    lastSyncTime,

    // Birds data
    birds,
    filteredBirds,

    // Search and filters
    searchTerm,
    setSearchTerm,
    selectedHabitats,
    setSelectedHabitats,
    selectedFamilies,
    setSelectedFamilies,
    allHabitats,
    allFamilies,
    resetFilters,

    // Audio
    currentlyPlaying,
    setCurrentlyPlaying,

    // Quiz
    quizMode,
    quizQuestions,
    currentQuestionIndex,
    answers,
    quizComplete,
    score,
    startQuiz,
    answerQuestion,
    restartQuiz,
    exitQuiz,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
