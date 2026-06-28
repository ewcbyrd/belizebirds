import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DISTRICT_SPECIES_PATH = join(ROOT, 'src/data/generated/district-species.json');
const TAXONOMY_PATH = join(ROOT, 'src/data/generated/taxonomy-map.json');
const OUTPUT_PATH = join(ROOT, 'docs/enrichment-backlog.json');

function parseArgs(argv) {
  const options = { tier: null, limit: null, district: null, write: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--tier' && argv[i + 1]) {
      options.tier = Number(argv[++i]);
    } else if (arg === '--limit' && argv[i + 1]) {
      options.limit = Number(argv[++i]);
    } else if (arg === '--district' && argv[i + 1]) {
      options.district = argv[++i];
    } else if (arg === '--no-write') {
      options.write = false;
    }
  }
  return options;
}

function tierForDistrictCount(count) {
  if (count >= 6) return 1;
  if (count === 5) return 2;
  return 3;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function buildBacklog({ tier, limit, district }) {
  const districtSpecies = loadJson(DISTRICT_SPECIES_PATH);
  const taxonomy = loadJson(TAXONOMY_PATH);
  const taxOrder = new Map(Object.keys(taxonomy).map((code, index) => [code, index]));

  let stubs = districtSpecies.newSpecies ?? [];

  if (district) {
    stubs = stubs.filter((stub) => stub.districts?.includes(district));
  }

  const ranked = stubs
    .map((stub) => {
      const districtCount = stub.districts?.length ?? 0;
      const taxon = taxonomy[stub.ebirdCode] ?? {};
      return {
        slug: stub.slug,
        commonName: stub.commonName,
        scientificName: stub.scientificName,
        ebirdCode: stub.ebirdCode,
        districts: stub.districts ?? [],
        districtCount,
        tier: tierForDistrictCount(districtCount),
        family: taxon.family ?? 'Unknown',
        familyScientific: taxon.familyScientific ?? '',
        taxonomicOrder: taxOrder.get(stub.ebirdCode) ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => {
      if (b.districtCount !== a.districtCount) {
        return b.districtCount - a.districtCount;
      }
      return a.taxonomicOrder - b.taxonomicOrder;
    });

  let filtered = ranked;
  if (tier != null) {
    filtered = filtered.filter((entry) => entry.tier === tier);
  }
  if (limit != null) {
    filtered = filtered.slice(0, limit);
  }

  const tierCounts = ranked.reduce((acc, entry) => {
    acc[entry.tier] = (acc[entry.tier] ?? 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    totalStubs: stubs.length,
    tierCounts,
    filters: { tier, limit, district },
    backlog: filtered,
  };
}

function printSummary(result) {
  const { filters, totalStubs, tierCounts, backlog } = result;
  console.log(`Enrichment backlog (${totalStubs} stubs matching filters)`);
  console.log(
    `Tier counts: tier 1 (6 districts)=${tierCounts[1] ?? 0}, ` +
      `tier 2 (5)=${tierCounts[2] ?? 0}, tier 3 (≤4)=${tierCounts[3] ?? 0}`
  );
  if (filters.tier != null) console.log(`Filter: tier ${filters.tier}`);
  if (filters.district) console.log(`Filter: district ${filters.district}`);
  if (filters.limit != null) console.log(`Limit: ${filters.limit}`);
  console.log('');

  for (const [index, entry] of backlog.entries()) {
    console.log(
      `${String(index + 1).padStart(3, ' ')}. [T${entry.tier}] ${entry.commonName} ` +
        `(${entry.slug}) — ${entry.districtCount} districts — ${entry.family}`
    );
  }
}

const options = parseArgs(process.argv.slice(2));
const result = buildBacklog(options);
printSummary(result);

if (options.write) {
  mkdirSync(join(ROOT, 'docs'), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n');
  console.log(`\nWrote ${OUTPUT_PATH}`);
}
