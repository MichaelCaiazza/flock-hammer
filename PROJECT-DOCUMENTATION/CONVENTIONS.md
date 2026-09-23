# Conventions

Patterns the code already follows, for consistency when extending it.

## File organization
- Two self-contained pages: `index.html` (map) and `stats.html` (dashboard).
  Each holds its own CSS in a single `<style>` block and its own JavaScript in
  one inline IIFE at the end of `<body>`. There is no shared JS/CSS file, no
  build step, and no module system in the browser code.
- Server-side logic lives only in `scripts/export.mjs`, an ES module using
  Node built-ins.
- Static icons live in `assets/`. Generated data lives in `data/`.

## Naming
- CSS design tokens are CSS custom properties on `:root` (e.g. `--bg`, `--ink`,
  `--signal`, `--ice`). The same token names appear in both pages.
- JavaScript tuning constants are `UPPER_SNAKE_CASE` near the top of each script
  (`APP_VERSION`, `DATA_URL`, `CONE_ZOOM`, `HEAT_ZOOM`, `NEW_DAYS`, `REFRESH_MS`
  in `index.html`; `KEEP_TAGS`, `SLICES`, `MIRRORS`, `NEW_KEEP_DAYS` in the
  export script).
- Short helpers use terse names: `$` for `getElementById`, `esc` for HTML
  escaping, `S` for string-table interning/lookup, `fmt` for number formatting.
- DOM ids are lowerCamelCase (`flockOnly`, `newOnly`, `reportBtn`, `searchForm`).

## State management
- No framework and no client state library. Session state is plain variables
  (`cameras`, `markers`) plus the map's own Leaflet layers.
- Filter state is read directly from checkbox elements when needed (see
  `visible()`), not mirrored into a separate state object.
- Shareable state (map position and selected camera) is encoded in the URL hash
  as `#map=<zoom>/<lat>/<lon>&cam=<id>` and written with `history.replaceState`.
- Open overlays (camera popup, modals) are backed by a single pushed history
  entry and a `popstate` listener, so the phone back gesture / Back button
  dismisses the overlay; a close-then-open switch cancels the pending disarm to
  avoid churning the history stack.
- Persistent data is entirely the committed `data/` files; the browser does not
  write application data (only the service worker's Cache Storage).

## Styling
- Dark theme only, built from the CSS tokens. UI panels use a frosted-glass
  treatment (`.glass`: translucent background plus `backdrop-filter: blur`).
- Layout uses flexbox and CSS grid with relative units; a `@media (max-width:
  720px)` block (and a `400px` block on the map) restack controls for phones.
- Map tiles are OpenStreetMap tiles recolored to dark with a CSS filter on
  `.leaflet-tile-pane`.
- Motion is minimal and gated by `@media (prefers-reduced-motion: reduce)`.

## Data-format conventions
- `data/cameras.json` uses a shared string table with index references to keep
  size down; both pages carry a matching decoder. Any change to the encoding in
  `export.mjs` must be mirrored in both pages.
- Coordinates are rounded to 5 decimal places; per-camera time is whole days
  since epoch.

## Testing
- There is no automated test suite, test framework, or CI test step in the repo.
  The only CI is the nightly data workflow. Verification is manual, as described
  in `DEPLOYMENT.md`.
