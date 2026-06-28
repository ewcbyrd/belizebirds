import { useState } from 'react';
import { Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import { useAppContext } from '../context/AppContext';
import { FAMILY_NAMES } from '../data/familyNames';

const BirdCard = ({ bird }) => {
  const { isSeen } = useAppContext();
  const [imageError, setImageError] = useState(false);

  const familyCommonName = FAMILY_NAMES[bird.family] || bird.family;
  const hasFrequency = bird.frequency && bird.frequency.trim() !== '';
  const seen = isSeen(bird.slug);

  return (
    <Link to={`/species/${bird.slug}`} className="card block hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-belize-green-light to-belize-green overflow-hidden">
        {!imageError ? (
          <img
            src={bird.image}
            alt={bird.commonName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
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
        {seen && (
          <span
            className="absolute top-2 right-2 text-xs bg-belize-green text-white px-2 py-1 rounded font-medium"
            aria-label="Seen"
          >
            ✓ Seen
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
        <div onClick={(e) => e.preventDefault()}>
          <AudioPlayer
            audioSrc={bird.audio}
            birdId={bird.id}
            birdName={bird.commonName}
          />
        </div>
      </div>
    </Link>
  );
};

export default BirdCard;
