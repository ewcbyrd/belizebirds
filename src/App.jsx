import { AppProvider, useAppContext } from './context/AppContext';
import Navigation from './components/Navigation';
import BirdGallery from './components/BirdGallery';
import Quiz from './components/Quiz';

function AppContent() {
  const { mode } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {mode === 'gallery' ? <BirdGallery /> : <Quiz />}
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
