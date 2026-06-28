import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_PATH = join(ROOT, '.env.local');

let lastKeySource = 'none';

const PLACEHOLDER_VALUES = new Set([
  '',
  'your_ebird_api_key_here',
  'paste_your_key_from_ebird_keygen_here',
]);

function parseEnvFile(path) {
  const values = {};
  if (!existsSync(path)) return values;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^(EBIRD_API_KEY|EBIRD_KEY)=(.*)$/);
    if (!match) continue;
    values[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return values;
}

/**
 * Load eBird API key for Node scripts.
 * @param {{ preferFile?: boolean }} options
 *   preferFile: when true, .env.local overrides an existing shell EBIRD_* value.
 */
export function loadLocalEnv({ preferFile = false } = {}) {
  const fromFile = parseEnvFile(ENV_PATH);
  const fileKey = fromFile.EBIRD_API_KEY || fromFile.EBIRD_KEY;

  if (preferFile && fileKey) {
    process.env.EBIRD_API_KEY = fileKey;
    lastKeySource = 'file (.env.local)';
    return lastKeySource;
  }

  if (!process.env.EBIRD_API_KEY && !process.env.EBIRD_KEY && fileKey) {
    process.env.EBIRD_API_KEY = fileKey;
    lastKeySource = 'file (.env.local)';
    return lastKeySource;
  }

  if (process.env.EBIRD_API_KEY) {
    lastKeySource = 'environment (EBIRD_API_KEY)';
    return lastKeySource;
  }
  if (process.env.EBIRD_KEY) {
    process.env.EBIRD_API_KEY = process.env.EBIRD_KEY;
    lastKeySource = 'environment (EBIRD_KEY)';
    return lastKeySource;
  }

  lastKeySource = 'none';
  return lastKeySource;
}

export function getEbirdApiKey() {
  const key = (process.env.EBIRD_API_KEY || process.env.EBIRD_KEY || '').trim();
  return PLACEHOLDER_VALUES.has(key) ? '' : key;
}

export function describeKeyMeta() {
  const key = getEbirdApiKey();
  return {
    source: lastKeySource,
    present: Boolean(key),
    length: key.length,
    looksLikePlaceholder:
      !key ||
      PLACEHOLDER_VALUES.has(
        (process.env.EBIRD_API_KEY || process.env.EBIRD_KEY || '').trim()
      ),
    masked: key ? `${key.slice(0, 3)}…${key.slice(-3)}` : null,
    rejectedPlaceholder:
      !key &&
      Boolean(
        (process.env.EBIRD_API_KEY || process.env.EBIRD_KEY || '').trim()
      ),
  };
}
