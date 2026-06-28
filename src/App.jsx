import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BirdGallery from './components/BirdGallery';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BirdGallery />
        <OfflineIndicator />
      </div>
    </AppProvider>
  );
}

export default App;
