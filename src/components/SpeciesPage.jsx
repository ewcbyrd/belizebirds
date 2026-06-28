import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { findBirdBySlug } from '../utils/birdSlugs';
import { FAMILY_NAMES } from '../data/familyNames';
import AudioPlayer from './AudioPlayer';
import NotFound from './NotFound';

const SpeciesPage = () => {
  const { slug } = useParams();
  const { birds, isSeen, toggleSeen } = useAppContext();
  const bird = findBirdBySlug(birds, slug);
  const [imageError, setImageError] = useState(false);

  if (!bird) {
    return <NotFound />;
  }

  const familyCommonName = FAMILY_NAMES[bird.family] || bird.family;
  const hasFrequency = bird.frequency && bird.frequency.trim() !== '';
  const fieldMarks = bird.fieldMarks?.length ? bird.fieldMarks : null;
  const similarBirds = (bird.similarSpecies ?? [])
    .map((s) => findBirdBySlug(birds, s))
    .filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-belize-green hover:text-belize-green-dark font-medium mb-6"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to field guide
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-br from-belize-green-light to-belize-green relative">
          {!imageError ? (
            <img
              src={bird.image}
              alt={bird.commonName}
              className="w-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center">
              <p className="text-white font-medium">Image unavailable</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {bird.commonName}
              </h1>
              <p className="text-lg text-gray-600 italic">
                {bird.scientificName}
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isSeen(bird.slug)}
                onChange={() => toggleSeen(bird.slug)}
                className="w-5 h-5 text-belize-green border-gray-300 rounded focus:ring-belize-green"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as seen
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Family</p>
              <p className="text-gray-900">
                <span className="italic">{bird.family}</span>
                {' — '}
                {familyCommonName}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Size</p>
              <p className="text-gray-900">{bird.size}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Diet</p>
              <p className="text-gray-900">{bird.diet}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Habitat</p>
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
            {bird.status && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
                <p className="text-gray-900">{bird.status}</p>
              </div>
            )}
            {bird.regions?.length > 0 && (
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">Regions</p>
                <p className="text-gray-900">{bird.regions.join(', ')}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Identification
            </p>
            {fieldMarks ? (
              <ul className="list-disc list-inside text-gray-900 leading-relaxed space-y-1">
                {fieldMarks.map((mark) => (
                  <li key={mark}>{mark}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-900 leading-relaxed">{bird.description}</p>
            )}
          </div>

          {(bird.voice || bird.audio) && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Voice</p>
              {bird.voice && (
                <p className="text-gray-900 leading-relaxed mb-4">{bird.voice}</p>
              )}
              <AudioPlayer
                audioSrc={bird.audio}
                birdId={bird.id}
                birdName={bird.commonName}
              />
            </div>
          )}

          {bird.funFact && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Field Notes
              </p>
              <p className="text-gray-900 leading-relaxed bg-belize-sand p-3 rounded-lg">
                {bird.funFact}
              </p>
            </div>
          )}

          {fieldMarks && bird.description && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </p>
              <p className="text-gray-900 leading-relaxed">{bird.description}</p>
            </div>
          )}

          {similarBirds.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Similar species
              </p>
              <div className="flex flex-wrap gap-2">
                {similarBirds.map((similar) => (
                  <Link
                    key={similar.slug}
                    to={`/species/${similar.slug}`}
                    className="text-sm px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-belize-sand transition-colors"
                  >
                    {similar.commonName}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeciesPage;
