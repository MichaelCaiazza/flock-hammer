# Dependencies

Everything the app pulls in, with the version pinned in the repo and what it is
used for. There is no `package.json` and no lockfile; browser libraries load from
CDNs and the export script uses only Node built-ins.

## Runtime — browser libraries (CDN, in `index.html`)

| Library | Version | Source | Used for |
|---|---|---|---|
| Leaflet (CSS + JS) | 1.9.4 | cdnjs.cloudflare.com | The interactive map |
| Leaflet.markercluster (CSS + JS) | 1.5.3 | cdnjs.cloudflare.com | Grouping nearby camera markers into clusters |
| Leaflet.heat | 0.2.0 | cdnjs.cloudflare.com | Density heatmap at low zoom |

`stats.html` loads no third-party libraries; its charts are hand-built inline
SVG.

## Runtime — fonts (CDN, both pages)

| Font | Weights | Source | Used for |
|---|---|---|---|
| Manrope | 500, 700, 800 | fonts.googleapis.com (Google Fonts) | UI text and headings |
| JetBrains Mono | 400, 600 | fonts.googleapis.com (Google Fonts) | Numbers, tag keys, version tag, mono data |

Import string (both pages):
`https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@400;600&display=swap`

## Runtime — map tiles and data services

| Service | Source | Used for |
|---|---|---|
| OpenStreetMap tiles | tile.openstreetmap.org | Base map imagery |
| Overpass API | overpass-api.de (browser fallback); plus kumi.systems and maps.mail.ru mirrors in the export | Camera data |
| Nominatim | nominatim.openstreetmap.org | Location search |

## Development / build tooling

- **Node.js** — 18+ to run `scripts/export.mjs` locally; the workflow pins
  **Node 22**. The script uses only built-in modules (`node:fs/promises`) and
  global `fetch`/`AbortSignal`. No npm packages.
- **GitHub Actions** — `actions/checkout@v5` and `actions/setup-node@v5` in
  `.github/workflows/nightly.yml`.

There are no bundlers, linters, test runners, or CSS toolchains in the repo.
