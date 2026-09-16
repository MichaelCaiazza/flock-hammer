# Flock Hammer

Community map of Flock Safety and other automatic license-plate-reader (ALPR) cameras,
built on OpenStreetMap data. Static site, no server.

## Deploy
1. Push this folder to a GitHub repo.
2. Settings → Pages → Deploy from branch `main`, folder `/ (root)`.
3. Actions tab → **Nightly camera export** → Run workflow (once, so the data files exist).
4. Optional: Settings → Secrets and variables → Actions
   - Variable `SITE_URL` = your Pages URL (links in the RSS feed / Discord posts)
   - Variable `ALERT_STATES` = `Texas,Colorado` to limit alerts
   - Secret `DISCORD_WEBHOOK` = a channel webhook to get new-camera alerts

## Files
- `index.html` — the map (search, share links, heatmap, new-camera layer, report flow, GPX/KML/GeoJSON download)
- `stats.html` — totals, growth, by state, vendors, operators, recently added
- `scripts/export.mjs` — nightly: Overpass → GeoJSON + history + diff + RSS + Discord
- `data/` — generated nightly by the workflow

## Data
All camera locations come from OpenStreetMap contributors. To add a camera, use
"Report a camera" on the map. License: ODbL.
