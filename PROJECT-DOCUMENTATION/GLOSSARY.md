# Glossary

Terms as the app and its code use them, alphabetical.

- **ALPR** — Automatic License Plate Reader. The category of camera this site
  maps; in OSM these are nodes tagged `surveillance:type=ALPR`.
- **Cluster** — a numbered bubble that stands in for many nearby camera markers;
  it splits into individual markers as you zoom in.
- **Cone / view cone** — the wedge drawn from a camera at close zoom showing the
  direction it points, derived from the camera's `direction` or
  `camera:direction` tag.
- **Download area** — the map tool that exports the cameras currently in view (in
  the current filters) as GPX, KML, or GeoJSON.
- **Flock / Flock Safety** — the primary camera vendor tracked. A camera counts
  as Flock when its `manufacturer` tag matches "flock". "Flock only" filters to
  these.
- **Growth** — the stats line chart of camera counts over time, built from
  `data/history.json`.
- **Heatmap** — the density shading shown instead of markers when zoomed out
  past zoom level 8.
- **New / New (30 days)** — a camera added within the last 30 days (map filter
  and popup badge). The export tracks additions in `data/new.json` for up to 90
  days.
- **New-camera feed** — the RSS feed at `data/feed.xml` listing newly mapped
  cameras.
- **Operator** — the agency or entity running a camera (police department, HOA,
  etc.), from the OSM `operator` tag.
- **Overpass** — the OpenStreetMap query API used to pull camera data (nightly by
  the export script, and as a live fallback in the browser).
- **Nightly camera export** — the GitHub Actions workflow (`nightly.yml`) that
  runs `export.mjs` and commits the `data/` files.
- **Nominatim** — the OpenStreetMap geocoding service behind the search box.
- **Report a camera** — the map dialog that explains how to spot a camera, gives
  the OSM tags, and opens the OSM editor.
- **Slice** — one regional bounding box the export queries separately, to keep
  each Overpass request small.
- **Stats** — the dashboard page (`stats.html`).
- **Transparency portal** — Flock's public per-agency page; the popup offers a
  web search for it based on the operator name.
