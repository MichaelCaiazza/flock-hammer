# Accounts and services

Outside services the app depends on, where each is configured, and the names of
related variables and secrets. Names and locations only — never values.

## Hosting and CI

- **GitHub Pages** — serves the static site from the repo root on branch `main`.
  Configured in the repository's Settings → Pages. Owner: unknown (the repo
  owner's GitHub account).
- **GitHub Actions** — runs the nightly data workflow, defined in
  `.github/workflows/nightly.yml`. Uses the built-in `GITHUB_TOKEN` with
  `contents: write` to commit the `data/` files. Owner: unknown.

## Data sources (no account required)

- **OpenStreetMap / Overpass API** — camera data source, queried by
  `scripts/export.mjs` (mirrors listed in the `MIRRORS` array; overridable with
  the `OVERPASS_URL` environment variable) and as a browser fallback in
  `index.html`. No credentials.
- **Nominatim (OpenStreetMap)** — geocoding for the map search box in
  `index.html`. No credentials.
- **OpenStreetMap tile servers** — base map tiles in `index.html`
  (`tile.openstreetmap.org`). No credentials.
- **US state outlines** — fetched at export time from
  `raw.githubusercontent.com/PublicaMundi/MappingAPI` for state tagging. No
  credentials.

## Optional integrations

- **Discord** — new-camera alerts are posted to a channel webhook when the
  `DISCORD_WEBHOOK` secret is set (Settings → Secrets and variables → Actions →
  Secrets). Used by `scripts/export.mjs`. Owner: unknown.

## Configuration variables and secrets (names only)

| Name | Kind | Where configured | Used by | Purpose |
|---|---|---|---|---|
| `SITE_URL` | Actions variable | Settings → Secrets and variables → Actions → Variables | `export.mjs` (via workflow env) | Base URL for links in the RSS feed and Discord messages |
| `ALERT_STATES` | Actions variable | same as above | `export.mjs` | Limit Discord alerts to named states |
| `DISCORD_WEBHOOK` | Actions secret | Settings → Secrets and variables → Actions → Secrets | `export.mjs` | Discord channel webhook for alerts |
| `OVERPASS_URL` | env (not set by workflow) | environment when running the script | `export.mjs` | Override Overpass mirrors with one endpoint |
| `OVERPASS_BBOX` | env (not set by workflow) | environment when running the script | `export.mjs` | Query a single bounding box instead of the default slices |
| `GITHUB_TOKEN` | built-in Actions secret | provided automatically by GitHub Actions | workflow commit step | Push the nightly `data/` commit |

No third-party account owns the OpenStreetMap-based services; they are public.
Domain/DNS: unknown (the site is reachable at the GitHub Pages URL unless a custom
domain is configured, which the repo does not show).
