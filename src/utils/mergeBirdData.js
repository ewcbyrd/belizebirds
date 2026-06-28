import { applyTaxonomyFamily } from './taxonomyLookup';

const PLACEHOLDER_IMAGE = '/birds/placeholder.jpg';

function parseStaticFrequency(frequency) {
  if (!frequency) return null;
  const num = parseFloat(String(frequency).replace('%', ''));
  if (Number.isNaN(num)) return null;
  return num / 100;
}

function formatReportingRate(fraction) {
  if (fraction == null || fraction < 0) return null;
  const pct = fraction * 100;
  if (pct < 0.1 && pct > 0) return '<0.1%';
  if (pct >= 10) return `${Math.round(pct)}%`;
  return `${pct.toFixed(1)}%`;
}

function defaultStubFields(stub) {
  return {
    id: stub.slug,
    commonName: stub.commonName,
    scientificName: stub.scientificName,
    slug: stub.slug,
    ebirdCode: stub.ebirdCode,
    districts: stub.districts ?? [],
    enrichmentStatus: stub.enrichmentStatus ?? 'pending',
    family: 'Unknown',
    habitat: [],
    description:
      'Recorded in Belize per eBird. Identification content is pending enrichment.',
    size: 'Unknown',
    diet: 'Unknown',
    image: PLACEHOLDER_IMAGE,
    audio: '',
    funFact: '',
    status: '',
    regions: [],
    fieldMarks: [],
    voice: '',
    similarSpecies: [],
    frequency: '',
  };
}

/**
 * Merge curated birds.json with generated eBird district data and stubs.
 */
export function mergeBirdData({ curatedBirds, districtSpecies, selectedDistrict }) {
  const speciesMap = districtSpecies?.species ?? {};
  const curatedSlugs = new Set(curatedBirds.map((b) => b.slug));

  const merged = curatedBirds.map((bird) => {
    const generated = Object.values(speciesMap).find((s) => s.slug === bird.slug);
    const ebirdCode = generated?.ebirdCode ?? bird.ebirdCode;
    const districts = generated?.districts ?? bird.districts ?? [];

    return enrichBird({ ...bird, ebirdCode, districts }, selectedDistrict);
  });

  const stubs = (districtSpecies?.newSpecies ?? []).filter(
    (s) => !curatedSlugs.has(s.slug)
  );

  for (const stub of stubs) {
    merged.push(enrichBird(defaultStubFields(stub), selectedDistrict));
  }

  return merged;
}

function enrichBird(bird, selectedDistrict) {
  const reportingRate =
    selectedDistrict === 'BZ-CY' ? parseStaticFrequency(bird.frequency) : null;
  const reportingRateLabel = formatReportingRate(reportingRate);
  const inDistrict =
    !selectedDistrict ||
    !bird.districts?.length ||
    bird.districts.includes(selectedDistrict);

  return applyTaxonomyFamily({
    ...bird,
    reportingRate,
    reportingRateLabel,
    inDistrict,
  });
}

export function getDataGeneratedAt(districtSpecies) {
  return districtSpecies?.generatedAt ?? null;
}
