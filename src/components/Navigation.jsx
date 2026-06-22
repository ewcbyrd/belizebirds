import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const { mode, setMode, startQuiz } = useAppContext();
  const [showQuizMenu, setShowQuizMenu] = useState(false);

  const handleStartQuiz = (quizType) => {
    startQuiz(quizType, 10);
    setShowQuizMenu(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center md:justify-end py-3 gap-3">
            {mode === 'gallery' ? (
              <>
                <button
                  onClick={() => setMode('gallery')}
                  className="px-4 py-2 bg-belize-green text-white rounded-lg font-medium"
                >
                  Gallery
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowQuizMenu(!showQuizMenu)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Start Quiz
                  </button>
                  {showQuizMenu && (
                    <>
                      {/* Backdrop to close menu when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowQuizMenu(false)}
                      ></div>
                      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-20">
                        <button
                          onClick={() => handleStartQuiz('identify')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            Identify the Bird
                          </div>
                          <div className="text-sm text-gray-600">
                            Match images to names
                          </div>
                        </button>
                        <button
                          onClick={() => handleStartQuiz('match-call')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium text-gray-900">
                            Match the Call
                          </div>
                          <div className="text-sm text-gray-600">
                            Identify birds by sound
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setMode('gallery')}
                className="px-4 py-2 bg-belize-green text-white rounded-lg font-medium hover:bg-belize-green-dark transition-colors"
              >
                Back to Gallery
              </button>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
