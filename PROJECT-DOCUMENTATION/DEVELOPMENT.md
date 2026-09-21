# Development

## Prerequisites

- **Node.js 18 or newer** to run `scripts/export.mjs`. The script uses only
  built-in modules (`node:fs/promises`) and the global `fetch`, `AbortSignal`,
  and `AbortSignal.timeout`, so no `npm install` is needed. There is no
  `package.json` in the repo.
- **A static file server** to view the pages locally (the pages fetch files, so
  `file://` will not work). Python's `http.server` or any equivalent is enough.
- The nightly workflow runs on **Node 22** (pinned in `.github/workflows/nightly.yml`).

## Commands

There is no build, install, bundling, or test tooling in the repo. The commands
that exist today are:

- **View the site locally:**
  ```
  python3 -m http.server 8000
  ```
  then open `http://localhost:8000/index.html`. Before the first data export the
  map falls back to a live Overpass query; `stats.html` shows "run the export"
  placeholders until `data/` files exist.

- **Generate the data files locally:**
  ```
  node scripts/export.mjs
  ```
  This writes `data/cameras.json`, `data/history.json`, `data/new.json`, and
  `data/feed.xml`, and removes the legacy `data/cameras.geojson` if present.

## Environment variables and secrets

All are read by `scripts/export.mjs`; the browser pages use none. Names and
locations only — no values are stored here.

- `SITE_URL` — public site URL, used to build links in `data/feed.xml` and in
  Discord messages. Set as an Actions **variable**. Optional.
- `ALERT_STATES` — comma-separated US state names; when set, Discord alerts are
  limited to those states. Actions **variable**. Optional.
- `DISCORD_WEBHOOK` — a Discord channel webhook URL; when set, newly mapped
  cameras are posted to it each night. Actions **secret**. Optional.
- `OVERPASS_URL` — overrides the built-in list of Overpass mirrors with a single
  endpoint. Optional; read from the environment.
- `OVERPASS_BBOX` — a single `south,west,north,east` box to query instead of the
  default North America slices (useful to limit a run to one state). Optional.

The workflow wires `SITE_URL`, `ALERT_STATES`, and `DISCORD_WEBHOOK` into the
export step; `OVERPASS_URL` and `OVERPASS_BBOX` are supported by the script but
not set by the workflow.

## Extending the app, following existing patterns

- **Add a control to the map:** add the element inside the `.tools` or `.brand`
  block in `index.html`, then wire it in the "wiring" section near the bottom of
  the inline script (the existing toggles call `refresh()`, buttons call their
  handlers). Filter state is read directly from the checkbox via
  `document.getElementById(...)`, as `visible()` does for `flockOnly` and
  `newOnly`.
- **Show another tag in camera popups:** add the tag key to the array built in
  `popupHtml()` in `index.html`, and add it to `KEEP_TAGS` in
  `scripts/export.mjs` so the tag is included in `data/cameras.json`.
- **Add a stats panel:** add a `.card` section to the grid in `stats.html` and
  populate it in the inline script, following the existing `bars()` and
  `count()` helpers.
- **Change how much data is exported:** edit the `SLICES` list or the query in
  `queryFor()` in `scripts/export.mjs`. Keep the compact output format described
  in `DATA-MODEL.md` in sync with the decoders in both HTML pages.
- **Bump the version:** change `APP_VERSION` in both `index.html` and
  `stats.html`, and add a `CHANGELOG.md` entry.
