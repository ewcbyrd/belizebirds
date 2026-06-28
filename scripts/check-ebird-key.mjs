#!/usr/bin/env node
/**
 * Diagnose eBird API key loading and authentication without printing the full key.
 */
import { loadLocalEnv, getEbirdApiKey, describeKeyMeta } from './load-env.mjs';

loadLocalEnv({ preferFile: true });

const meta = describeKeyMeta();
const key = getEbirdApiKey();

console.log('eBird API key diagnostics');
console.log('  source:   ', meta.source);
console.log('  present:  ', meta.present);
console.log('  length:   ', meta.length);
if (meta.masked) console.log('  masked:   ', meta.masked);
if (meta.rejectedPlaceholder) {
  console.log(
    '  warning:  Value in .env.local matches the example placeholder — replace it with your real key from https://ebird.org/api/keygen'
  );
}

if (!key) {
  console.error('\nNo usable API key found. Set EBIRD_API_KEY in .env.local');
  process.exit(1);
}

const tests = [
  {
    name: 'Species list (product/spplist/BZ-CY)',
    url: 'https://api.ebird.org/v2/product/spplist/BZ-CY',
  },
  {
    name: 'Recent obs (data/obs/BZ-CY/recent)',
    url: 'https://api.ebird.org/v2/data/obs/BZ-CY/recent?maxResults=1',
  },
];

console.log('\nEndpoint tests:');
let anyOk = false;

for (const test of tests) {
  const response = await fetch(test.url, {
    headers: {
      'x-ebirdapitoken': key,
      Accept: 'application/json',
    },
  });
  const body = (await response.text()).trim();
  const preview = body ? body.slice(0, 120) : '(empty body)';
  console.log(`  ${test.name}`);
  console.log(`    status: ${response.status}`);
  if (body) console.log(`    body:   ${preview}`);

  if (response.ok) {
    anyOk = true;
    try {
      const json = JSON.parse(body);
      if (Array.isArray(json)) {
        console.log(`    ok:     ${json.length} species codes returned`);
      }
    } catch {
      console.log('    ok:     response received');
    }
  }
}

if (!anyOk) {
  console.error(
    '\nAll authenticated endpoints returned an error. eBird returns the same 403 ' +
      'for missing and rejected keys, so double-check:\n' +
      '  1. You copied the API key from https://ebird.org/api/keygen (not your eBird username)\n' +
      '  2. .env.local contains the full key on one line: EBIRD_API_KEY=...\n' +
      '  3. Test in a terminal (replace YOUR_KEY):\n' +
      '     curl -H "x-ebirdapitoken: YOUR_KEY" "https://api.ebird.org/v2/product/spplist/BZ-CY" | head\n'
  );
  process.exit(1);
}

console.log('\nAPI key is working.');
