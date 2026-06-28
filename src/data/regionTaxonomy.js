// Regions within Cayo District, Belize.
// All species in this guide are recorded in Cayo per eBird; default is districtwide.
// Sub-zones are reserved for future hotspot / location filtering within the district.

export const CANONICAL_REGIONS = [
  'Throughout Cayo',
  'San Ignacio area',
  'Mountain Pine Ridge',
  'Maya Mountains',
  'Cayo Valley',
  'Spanish Lookout',
  'Rivers & wetlands',
];

/** Default region — every checklist species occurs in Cayo District per eBird. */
export const DEFAULT_REGION = 'Throughout Cayo';

export function defaultRegions() {
  return [DEFAULT_REGION];
}
