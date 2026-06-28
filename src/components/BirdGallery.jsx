import { useAppContext } from '../context/AppContext';
import BirdCard from './BirdCard';
import SearchBar from './SearchBar';
import { FAMILY_NAMES } from '../data/familyNames';

const sortBirdsAlpha = (birds) =>
  [...birds].sort((a, b) => a.commonName.localeCompare(b.commonName));

const sortBirdsByFrequency = (birds, parseFrequency) =>
  [...birds].sort(
    (a, b) => parseFrequency(b.frequency) - parseFrequency(a.frequency)
  );

const BirdGallery = () => {
  const { filteredBirds, sortBy, parseFrequency } = useAppContext();

  const familyGroups = (() => {
    if (sortBy === 'alpha') {
      return [
        {
          family: null,
          familyCommonName: null,
          birds: sortBirdsAlpha(filteredBirds),
        },
      ];
    }

    if (sortBy === 'frequency') {
      return [
        {
          family: null,
          familyCommonName: null,
          birds: sortBirdsByFrequency(filteredBirds, parseFrequency),
        },
      ];
    }

    const grouped = filteredBirds.reduce((groups, bird) => {
      if (!groups[bird.family]) {
        groups[bird.family] = [];
      }
      groups[bird.family].push(bird);
      return groups;
    }, {});

    const familyOrder = Object.keys(FAMILY_NAMES);

    return Object.keys(grouped)
      .sort((a, b) => {
        const indexA = familyOrder.indexOf(a);
        const indexB = familyOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
      .map((family) => ({
        family,
        familyCommonName: FAMILY_NAMES[family] || family,
        birds: sortBirdsAlpha(grouped[family]),
      }));
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SearchBar />

        {filteredBirds.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No birds found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find more birds.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {familyGroups.map((group) => (
              <section
                key={group.family ?? 'all'}
                className="family-section"
              >
                {group.family && (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-600 pb-2">
                      <span className="italic">{group.family}</span>
                      <span className="text-gray-600">
                        {' '}
                        - {group.familyCommonName}
                      </span>
                    </h2>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.birds.map((bird) => (
                    <BirdCard key={bird.id} bird={bird} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirdGallery;
