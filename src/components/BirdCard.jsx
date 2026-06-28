import { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { FAMILY_NAMES } from '../data/familyNames';

const BirdCard = ({ bird }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  const familyCommonName = FAMILY_NAMES[bird.family] || bird.family;
  const hasFrequency = bird.frequency && bird.frequency.trim() !== '';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div
        className="card cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative h-48 bg-gradient-to-br from-belize-green-light to-belize-green overflow-hidden">
          {!imageError ? (
            <img
              src={bird.image}
              alt={bird.commonName}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white p-4">
                <svg
                  className="w-16 h-16 mx-auto mb-2 opacity-75"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">{bird.commonName}</p>
              </div>
            </div>
          )}
          {hasFrequency && (
            <span className="absolute top-2 left-2 text-xs bg-white/90 text-gray-800 px-2 py-1 rounded font-medium">
              {bird.frequency}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {bird.commonName}
          </h3>
          <p className="text-sm text-gray-600 italic mb-2">
            {bird.scientificName}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {familyCommonName}
            </span>
            <span className="text-xs bg-belize-sand text-gray-700 px-2 py-1 rounded">
              {bird.size}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {bird.diet}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {bird.description}
          </p>
          <div onClick={(e) => e.stopPropagation()}>
            <AudioPlayer
              audioSrc={bird.audio}
              birdId={bird.id}
              birdName={bird.commonName}
            />
          </div>
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-belize-green-light to-belize-green relative">
              {!imageError ? (
                <img
                  src={bird.image}
                  alt={bird.commonName}
                  className="w-full"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full aspect-[4/3] flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <svg
                      className="w-24 h-24 mx-auto mb-2 opacity-75"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">Image placeholder</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-2 right-2 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Close details"
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
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {bird.commonName}
                </h2>
                <p className="text-lg text-gray-600 italic">
                  {bird.scientificName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Family
                  </p>
                  <p className="text-gray-900">
                    <span className="italic">{bird.family}</span>
                    {' — '}
                    {familyCommonName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Size
                  </p>
                  <p className="text-gray-900">{bird.size}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Diet
                  </p>
                  <p className="text-gray-900">{bird.diet}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Habitat
                  </p>
                  <p className="text-gray-900">{bird.habitat.join(', ')}</p>
                </div>
                {hasFrequency && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Reporting rate
                    </p>
                    <p className="text-gray-900">{bird.frequency}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </p>
                <p className="text-gray-900 leading-relaxed">
                  {bird.description}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Field Notes
                </p>
                <p className="text-gray-900 leading-relaxed bg-belize-sand p-3 rounded-lg">
                  {bird.funFact}
                </p>
              </div>

              <div className="flex justify-center">
                <AudioPlayer
                  audioSrc={bird.audio}
                  birdId={bird.id}
                  birdName={bird.commonName}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BirdCard;
