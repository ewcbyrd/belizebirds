import taxonomyMap from '../data/generated/taxonomy-map.json';
import { FAMILY_NAMES } from '../data/familyNames';

/**
 * Look up eBird family fields for a species code.
 * taxonomy-map.json uses `family` (common) and `familyScientific`.
 */
export function familyFromTaxonomy(ebirdCode) {
  if (!ebirdCode) return null;
  const entry = taxonomyMap[ebirdCode];
  if (!entry?.familyScientific) return null;
  return {
    family: entry.familyScientific,
    familyCommonName: entry.family || entry.familyScientific,
  };
}

export function applyTaxonomyFamily(bird) {
  const taxFamily = familyFromTaxonomy(bird.ebirdCode);
  if (!taxFamily) return bird;

  const hasFamily = bird.family && bird.family !== 'Unknown';

  return {
    ...bird,
    family: hasFamily ? bird.family : taxFamily.family,
    familyCommonName: bird.familyCommonName || taxFamily.familyCommonName,
  };
}

export function getFamilyDisplayName(bird) {
  const scientific =
    bird.family && bird.family !== 'Unknown' ? bird.family : null;
  const fromTax = familyFromTaxonomy(bird.ebirdCode);

  const familyScientific = scientific || fromTax?.family;
  if (familyScientific && FAMILY_NAMES[familyScientific]) {
    return FAMILY_NAMES[familyScientific];
  }

  return (
    bird.familyCommonName ||
    fromTax?.familyCommonName ||
    familyScientific ||
    'Unknown'
  );
}

export function getFamilyScientificName(bird) {
  if (bird.family && bird.family !== 'Unknown') return bird.family;
  return familyFromTaxonomy(bird.ebirdCode)?.family || 'Unknown';
}
