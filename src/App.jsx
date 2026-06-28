import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BirdGallery from './components/BirdGallery';
import SpeciesPage from './components/SpeciesPage';
import NotFound from './components/NotFound';
import OfflineIndicator from './components/OfflineIndicator';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {children}
      <OfflineIndicator />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <BirdGallery />
              </AppLayout>
            }
          />
          <Route
            path="/species/:slug"
            element={
              <AppLayout>
                <SpeciesPage />
              </AppLayout>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
