import { useState } from 'react';
import { DEFAULT_DISTRICT } from '../data/districtTaxonomy';

const DISTRICT_KEY = 'belizebirds-district';

function readDistrict() {
  if (typeof localStorage === 'undefined') return DEFAULT_DISTRICT;
  const stored = localStorage.getItem(DISTRICT_KEY);
  if (stored === 'BZ-TO') return 'BZ-TOL';
  return stored || DEFAULT_DISTRICT;
}

export function useDistrict() {
  const [selectedDistrict, setSelectedDistrictState] = useState(readDistrict);

  const setSelectedDistrict = (code) => {
    setSelectedDistrictState(code);
    localStorage.setItem(DISTRICT_KEY, code);
  };

  return {
    selectedDistrict,
    setSelectedDistrict,
  };
}
