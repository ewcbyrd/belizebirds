import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  loadLocalEnv,
  getEbirdApiKey,
  describeKeyMeta,
} from './load-env.mjs';

loadLocalEnv({ preferFile: true });

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const GENERATED_DIR = join(ROOT, 'src/data/generated');
const BIRDS_PATH = join(ROOT, 'src/data/birds.json');

const API_BASE = 'https://api.ebird.org/v2';

// District subnational1 codes only — country (BZ) is derived as a union at build time.
const DISTRICTS = [
  { code: 'BZ-BZ', name: 'Belize District' },
  { code: 'BZ-CY', name: 'Cayo' },
  { code: 'BZ-CZL', name: 'Corozal' },
  { code: 'BZ-OW', name: 'Orange Walk' },
  { code: 'BZ-SC', name: 'Stann Creek' },
  { code: 'BZ-TOL', name: 'Toledo' },
];

const OUTPUT_PATH = join(GENERATED_DIR, 'district-species.json');
const TAXONOMY_PATH = join(GENERATED_DIR, 'taxonomy-map.json');

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function apiKey() {
  return getEbirdApiKey();
}

async function ebirdFetch(path, { requireAuth = true } = {}) {
  const key = apiKey();
  const url = new URL(`${API_BASE}${path}`);
  const headers = { Accept: 'application/json' };

  if (key) {
    headers['x-ebirdapitoken'] = key;
  } else if (requireAuth) {
    throw new Error('EBIRD_API_KEY is required for this endpoint.');
  }

  let response = await fetch(url, { headers });

  if (response.status === 403 && key) {
    url.searchParams.set('key', key);
    response = await fetch(url, { headers });
  }

  if (!response.ok) {
    const body = (await response.text()).trim();
    let detail = body || '(empty response body)';
    try {
      const json = JSON.parse(body);
      detail =
        json.errors?.map((e) => e.title || e.message).join('; ') ||
        json.error ||
        detail;
    } catch {
      // keep raw body
    }

    if (response.status === 403) {
      const meta = describeKeyMeta();
      throw new Error(
        `eBird API ${path} returned 403 Forbidden.\n` +
          `  Key source: ${meta.source}, length: ${meta.length}` +
          (meta.masked ? `, masked: ${meta.masked}` : '') +
          '\n' +
          '  eBird uses the same 403 for missing and rejected keys. Run `npm run check:ebird-key` ' +
          'to diagnose, and verify the value in .env.local is the full key from ' +
          'https://ebird.org/api/keygen (not your eBird username).' +
          (detail && detail !== '(empty response body)'
            ? `\n  Response: ${detail}`
            : '')
      );
    }

    throw new Error(
      `eBird API ${path} failed (${response.status}): ${detail}`
    );
  }

  return response.json();
}

async function validateApiKey() {
  const meta = describeKeyMeta();
  console.log(
    `[sync-ebird] Using API key from ${meta.source} (length ${meta.length}` +
      (meta.masked ? `, ${meta.masked}` : '') +
      ')'
  );

  console.log('[sync-ebird] Validating API key (product/spplist/BZ-CY)…');
  await ebirdFetch('/product/spplist/BZ-CY', { requireAuth: true });
  console.log('[sync-ebird] API key accepted.');
}

async function fetchTaxonomy() {
  console.log('[sync-ebird] Fetching taxonomy…');
  const taxonomy = await ebirdFetch('/ref/taxonomy/ebird?fmt=json', {
    requireAuth: false,
  });

  const byScientificName = {};
  const bySpeciesCode = {};

  for (const entry of taxonomy) {
    if (entry.category !== 'species') continue;
    byScientificName[entry.sciName] = entry;
    bySpeciesCode[entry.speciesCode] = entry;
  }

  return { taxonomy, byScientificName, bySpeciesCode };
}

async function fetchDistrictSpecies(regionCode) {
  console.log(`[sync-ebird] Fetching species list for ${regionCode}…`);
  return ebirdFetch(`/product/spplist/${regionCode}`);
}

function loadBirds() {
  return JSON.parse(readFileSync(BIRDS_PATH, 'utf8'));
}

function buildOutput(taxonomyMaps, districtLists, birds) {
  const { byScientificName, bySpeciesCode } = taxonomyMaps;
  const existingBySci = Object.fromEntries(
    birds.map((b) => [b.scientificName, b])
  );
  const existingSlugs = new Set(birds.map((b) => b.slug));

  const codeToDistricts = {};
  const districts = {};

  for (const { code, name } of DISTRICTS) {
    const speciesCodes = districtLists[code] ?? [];
    districts[code] = { name, speciesCodes, count: speciesCodes.length };

    for (const speciesCode of speciesCodes) {
      if (!codeToDistricts[speciesCode]) {
        codeToDistricts[speciesCode] = [];
      }
      codeToDistricts[speciesCode].push(code);
    }
  }

  const countrySpecies = new Set();
  for (const codes of Object.values(districtLists)) {
    for (const code of codes) countrySpecies.add(code);
  }
  districts.BZ = {
    name: 'Belize (country)',
    speciesCodes: [...countrySpecies].sort(),
    count: countrySpecies.size,
  };

  const species = {};
  const newSpecies = [];
  const unmatchedBirds = [];

  for (const [speciesCode, districtCodes] of Object.entries(codeToDistricts)) {
    const taxon = bySpeciesCode[speciesCode];
    if (!taxon) continue;

    const curated = existingBySci[taxon.sciName];
    if (curated) {
      species[speciesCode] = {
        slug: curated.slug,
        ebirdCode: speciesCode,
        commonName: taxon.comName,
        scientificName: taxon.sciName,
        districts: districtCodes,
      };
    } else {
      let slug = slugify(taxon.comName);
      let suffix = 2;
      while (existingSlugs.has(slug)) {
        slug = `${slugify(taxon.comName)}-${suffix}`;
        suffix += 1;
      }
      existingSlugs.add(slug);

      const stub = {
        slug,
        ebirdCode: speciesCode,
        commonName: taxon.comName,
        scientificName: taxon.sciName,
        districts: districtCodes,
        enrichmentStatus: 'pending',
      };
      species[speciesCode] = stub;
      newSpecies.push(stub);
    }
  }

  for (const bird of birds) {
    const taxon = byScientificName[bird.scientificName];
    if (!taxon) {
      unmatchedBirds.push({
        slug: bird.slug,
        scientificName: bird.scientificName,
        commonName: bird.commonName,
      });
      continue;
    }

    if (!species[taxon.speciesCode]) {
      species[taxon.speciesCode] = {
        slug: bird.slug,
        ebirdCode: taxon.speciesCode,
        commonName: bird.commonName,
        scientificName: bird.scientificName,
        districts: [],
      };
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    districts,
    species,
    newSpecies,
    unmatchedBirds,
    stats: {
      curatedBirds: birds.length,
      ebirdSpeciesInBelize: Object.keys(species).length,
      newSpeciesCount: newSpecies.length,
      unmatchedCuratedCount: unmatchedBirds.length,
    },
  };
}

function writeTaxonomyMap(taxonomyMaps) {
  const { bySpeciesCode } = taxonomyMaps;
  const map = {};
  for (const [code, entry] of Object.entries(bySpeciesCode)) {
    map[code] = {
      speciesCode: code,
      commonName: entry.comName,
      scientificName: entry.sciName,
      family: entry.familyComName,
      familyScientific: entry.familySciName,
    };
  }
  writeFileSync(TAXONOMY_PATH, JSON.stringify(map, null, 2) + '\n');
  console.log(`[sync-ebird] Wrote ${TAXONOMY_PATH}`);
}

async function main() {
  const key = apiKey();

  if (!key) {
    if (existsSync(OUTPUT_PATH)) {
      console.log(
        '[sync-ebird] No EBIRD_API_KEY set; using existing generated data.'
      );
      return;
    }
    console.error(
      '[sync-ebird] EBIRD_API_KEY is required.\n' +
        '  Set it in .env.local (see .env.local.example) or export EBIRD_API_KEY=…\n' +
        '  Get a key at https://ebird.org/api/keygen\n' +
        '  Run npm run check:ebird-key to diagnose loading issues.'
    );
    process.exit(1);
  }

  mkdirSync(GENERATED_DIR, { recursive: true });

  await validateApiKey();

  const birds = loadBirds();
  const taxonomyMaps = await fetchTaxonomy();

  const districtLists = {};
  for (const { code } of DISTRICTS) {
    districtLists[code] = await fetchDistrictSpecies(code);
  }

  const output = buildOutput(taxonomyMaps, districtLists, birds);
  writeTaxonomyMap(taxonomyMaps);
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');

  console.log(`[sync-ebird] Wrote ${OUTPUT_PATH}`);
  console.log(
    `[sync-ebird] ${output.stats.ebirdSpeciesInBelize} species, ` +
      `${output.stats.newSpeciesCount} new stubs, ` +
      `${output.stats.unmatchedCuratedCount} unmatched curated`
  );

  if (output.unmatchedBirds.length > 0) {
    console.warn('[sync-ebird] Unmatched curated birds:');
    for (const b of output.unmatchedBirds) {
      console.warn(`  - ${b.commonName} (${b.scientificName})`);
    }
  }
}

main().catch((err) => {
  console.error('[sync-ebird] Failed:', err.message);
  process.exit(1);
});
