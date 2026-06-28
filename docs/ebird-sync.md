# eBird data sync

This app refreshes species presence per district at **build time** using the eBird API. Your API key never ships to the browser.

## Prerequisites

1. Request an API key at [eBird API Keygen](https://ebird.org/api/keygen).
2. Add `EBIRD_API_KEY` as a [GitHub repository secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) **before merging** the eBird sync branch to `master`.

## Local development

```bash
cp .env.local.example .env.local
# Paste your key from https://ebird.org/api/keygen — sync loads .env.local automatically
```

```bash
npm run check:ebird-key  # diagnose key loading + test spplist (no full key printed)
npm run sync:ebird       # district species lists + taxonomy map
npm run dev
```

**Note:** `/ref/taxonomy/ebird` is public and does not require a key. If sync fails on `product/spplist` with **403**, your key is invalid or revoked even though taxonomy may appear to work.

If `EBIRD_API_KEY` is not set and `src/data/generated/district-species.json` already exists, `sync:ebird` skips without error.

## Build pipeline

`npm run build` runs `sync:ebird` first, then Vite. GitHub Actions passes `EBIRD_API_KEY` from secrets during deploy.

## Generated files

| File | Source |
| ---- | ------ |
| `src/data/generated/district-species.json` | eBird API `spplist` per district |
| `src/data/generated/taxonomy-map.json` | eBird taxonomy |

Curated identification content stays in `src/data/birds.json`. New species found in eBird but not yet enriched appear as stubs with `enrichmentStatus: "pending"`.

Cayo District **reporting rates** for curated species are stored in `birds.json` as the `frequency` field (e.g. `"45.03%"`).

## Belize district codes

| District | Code |
| -------- | ---- |
| Belize | `BZ-BZ` |
| Cayo | `BZ-CY` |
| Corozal | `BZ-CZL` |
| Orange Walk | `BZ-OW` |
| Stann Creek | `BZ-SC` |
| Toledo | `BZ-TOL` |
