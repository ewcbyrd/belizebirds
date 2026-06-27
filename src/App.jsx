import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import BirdGallery from './components/BirdGallery';
import Quiz from './components/Quiz';
import OfflineIndicator from './components/OfflineIndicator';

function AppContent() {
  const { mode } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      {mode === 'gallery' ? <BirdGallery /> : <Quiz />}
      <OfflineIndicator />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
