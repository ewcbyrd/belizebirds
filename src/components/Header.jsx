import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

import { getDistrictShortName } from '../data/districtTaxonomy';

const Header = () => {
  const basePath = import.meta.env.BASE_URL;
  const { birds, filteredBirds, selectedDistrict } = useAppContext();

  return (
    <header className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden bg-belize-green-dark">
      <div
        className="absolute inset-0 bg-cover bg-[center_30%]"
        style={{ backgroundImage: `url(${basePath}hero-banner.jpg)` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-belize-green-dark/40 via-belize-green-dark/30 to-belize-green-dark/90" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0, 77, 41, 0.5) 100%)',
        }}
      />

      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-7 md:pb-9">
        <div className="max-w-2xl">
          <p className="text-belize-sand/90 text-xs sm:text-sm uppercase tracking-widest mb-1.5 drop-shadow-md">
            {getDistrictShortName(selectedDistrict)} · Belize
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-1 drop-shadow-lg">
            <Link
              to="/"
              className="hover:text-belize-sand transition-colors duration-200"
            >
              Belize Birds
            </Link>
          </h1>
          <p className="text-belize-sand text-base sm:text-lg md:text-xl font-medium drop-shadow-md mb-3">
            A field guide to birds across Belize
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80">
            <span>{filteredBirds.length} species in district</span>
            <span aria-hidden="true">·</span>
            <span>{birds.length} total</span>
            <span aria-hidden="true">·</span>
            <span>Works offline</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 flex h-[3px]">
        <div className="flex-1 bg-belize-blue" />
        <div className="flex-1 bg-belize-green" />
        <div className="flex-1 bg-belize-red" />
      </div>
    </header>
  );
};

export default Header;
