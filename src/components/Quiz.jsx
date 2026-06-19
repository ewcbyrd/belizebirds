import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const Quiz = () => {
  const {
    quizMode,
    quizQuestions,
    currentQuestionIndex,
    answerQuestion,
    quizComplete,
    score,
    restartQuiz,
    exitQuiz,
    birds,
  } = useAppContext();

  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const audioRef = useRef(null);

  const currentBird = quizQuestions[currentQuestionIndex];

  // Generate smart options for the current question with intelligent difficulty
  useEffect(() => {
    if (!currentBird) return;

    // Smart option generation: prioritize same family, fall back to same size, then random
    const generateSmartOptions = (correctBird, allBirds) => {
      let wrongOptions = [];
      const availableBirds = allBirds.filter((b) => b.id !== correctBird.id);
      
      // Priority 1: Same family (hardest - requires knowing differences within family)
      const sameFamily = availableBirds.filter(
        (b) => b.family === correctBird.family
      );
      
      if (sameFamily.length >= 3) {
        // Enough same-family birds, use them for maximum difficulty
        wrongOptions = sameFamily
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      } else {
        // Not enough same-family, take what we can get
        wrongOptions = [...sameFamily];
        
        // Priority 2: Same size (medium difficulty - visually comparable birds)
        const similarSize = availableBirds.filter(
          (b) => 
            b.size === correctBird.size && 
            !wrongOptions.some(w => w.id === b.id)
        );
        
        const needed = 3 - wrongOptions.length;
        if (similarSize.length >= needed) {
          wrongOptions.push(
            ...similarSize
              .sort(() => 0.5 - Math.random())
              .slice(0, needed)
          );
        } else {
          // Take all similar-sized birds
          wrongOptions.push(...similarSize);
          
          // Priority 3: Random fallback (ensures quiz always works)
          const remaining = availableBirds.filter(
            (b) => !wrongOptions.some(w => w.id === b.id)
          );
          wrongOptions.push(
            ...remaining
              .sort(() => 0.5 - Math.random())
              .slice(0, 3 - wrongOptions.length)
          );
        }
      }
      
      // Shuffle correct answer in with wrong answers
      return [...wrongOptions, correctBird].sort(() => 0.5 - Math.random());
    };

    const allOptions = generateSmartOptions(currentBird, birds);

    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);

    // Auto-play audio for match-call mode
    if (quizMode === 'match-call' && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentBird, birds, quizMode]);

  const handleAnswer = (birdId) => {
    setSelectedAnswer(birdId);
    setShowResult(true);

    // Wait 1.5 seconds before moving to next question
    setTimeout(() => {
      answerQuestion(currentBird.id, birdId);
    }, 1500);
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : percentage >= 60 ? (
              <div className="text-6xl mb-4">👏</div>
            ) : (
              <div className="text-6xl mb-4">📚</div>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600">
              {percentage >= 80
                ? 'Excellent work!'
                : percentage >= 60
                ? 'Good job!'
                : 'Keep studying!'}
            </p>
          </div>

          <div className="bg-belize-sand rounded-lg p-6 mb-6">
            <div className="text-5xl font-bold text-belize-green mb-2">
              {score}/{quizQuestions.length}
            </div>
            <div className="text-2xl font-semibold text-gray-700">
              {percentage}%
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={restartQuiz} className="btn-primary">
              Try Again
            </button>
            <button onClick={exitQuiz} className="btn-secondary">
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBird) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {quizMode === 'identify'
                ? 'Identify the Bird'
                : 'Match the Bird Call'}
            </h2>
            <button
              onClick={exitQuiz}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
              <span>
                Score: {score}/{currentQuestionIndex}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-belize-green h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {quizMode === 'identify' ? (
            <div className="mb-6">
              <div className="relative h-64 bg-gradient-to-br from-belize-green-light to-belize-green rounded-lg overflow-hidden">
                {currentBird && currentBird.image ? (
                  <img
                    src={currentBird.image}
                    alt="Mystery bird"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Image failed to load:', currentBird.image);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <p>Image not available</p>
                  </div>
                )}
              </div>
              <p className="text-center text-gray-700 font-medium mt-4">
                What bird is this?
              </p>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <audio ref={audioRef} src={currentBird.audio} />
              <div className="bg-gradient-to-br from-belize-green-light to-belize-green rounded-lg p-12 mb-4">
                <svg
                  className="w-24 h-24 mx-auto text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button
                onClick={replayAudio}
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Replay Audio
              </button>
              <p className="text-gray-700 font-medium mt-4">
                Which bird makes this call?
              </p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((bird) => {
              const isSelected = selectedAnswer === bird.id;
              const isCorrect = bird.id === currentBird.id;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={bird.id}
                  onClick={() => !showResult && handleAnswer(bird.id)}
                  disabled={showResult}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-belize-green bg-belize-green bg-opacity-10'
                      : 'border-gray-300 hover:border-belize-green hover:bg-gray-50'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {bird.commonName}
                      </div>
                      <div className="text-sm text-gray-600 italic">
                        {bird.scientificName}
                      </div>
                    </div>
                    {showResult && (
                      <div className="ml-2">
                        {showCorrect && (
                          <svg
                            className="w-6 h-6 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {showWrong && (
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
