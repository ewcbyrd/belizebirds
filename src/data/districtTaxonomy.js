// Belize districts — eBird subnational1 region codes.

export const BELIZE_COUNTRY_CODE = 'BZ';

export const DISTRICTS = [
  { code: 'BZ-BZ', name: 'Belize', shortName: 'Belize District' },
  { code: 'BZ-CY', name: 'Cayo', shortName: 'Cayo District' },
  { code: 'BZ-CZL', name: 'Corozal', shortName: 'Corozal District' },
  { code: 'BZ-OW', name: 'Orange Walk', shortName: 'Orange Walk District' },
  { code: 'BZ-SC', name: 'Stann Creek', shortName: 'Stann Creek District' },
  { code: 'BZ-TOL', name: 'Toledo', shortName: 'Toledo District' },
];

export const DISTRICT_CODES = DISTRICTS.map((d) => d.code);

export const DEFAULT_DISTRICT = 'BZ-CY';

const districtByCode = Object.fromEntries(DISTRICTS.map((d) => [d.code, d]));

export function getDistrictName(code) {
  return districtByCode[code]?.name ?? code;
}

export function getDistrictShortName(code) {
  return districtByCode[code]?.shortName ?? code;
}
