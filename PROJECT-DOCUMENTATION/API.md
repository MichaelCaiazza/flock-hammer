# API

Flock Hammer exposes no backend API of its own. It has no server, no
authentication, and no endpoints it hosts. This file documents the external HTTP
services the code calls, since there is no in-house API to describe.

## Called from the browser (`index.html`)

### Overpass API — live camera fallback
- **Method / URL:** `POST https://overpass-api.de/api/interpreter`
- **When:** only if `data/cameras.json` cannot be loaded.
- **Request:** form body `data=<Overpass QL>` selecting `man_made=surveillance`
  nodes that are either `surveillance:type=ALPR` or `manufacturer~flock`, with
  `out meta`.
- **Response:** Overpass JSON; the code keeps `elements` of type `node`.
- **Auth:** none.

### Nominatim — location search
- **Method / URL:** `GET https://nominatim.openstreetmap.org/search?format=json&limit=1&q=<query>`
- **When:** the user submits the search box.
- **Response:** JSON array; the first result's `lat`, `lon`, and `boundingbox`
  are used to move the map.
- **Auth:** none.

### Map tiles
- **URL:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- **When:** continuously, as map tiles are needed.
- **Auth:** none.

### Popup outbound links (opened in a new tab, not fetched)
- Street View: `https://www.google.com/maps?q=&layer=c&cbll=<lat>,<lon>`
- Operator transparency portal search:
  `https://duckduckgo.com/?q=site:transparency.flocksafety.com <operator>`
- Edit on OSM: `https://www.openstreetmap.org/node/<id>`
- OSM iD editor (from the Report flow):
  `https://www.openstreetmap.org/edit?editor=id#map=<z>/<lat>/<lon>`

## Called from `stats.html`

- `GET data/cameras.json`, `GET data/history.json`, `GET data/new.json` — the
  generated data files, served as static files by the host. No auth.

## Called from the nightly script (`scripts/export.mjs`, server-side)

- **Overpass API**, `POST` to one of three mirrors in turn:
  `https://overpass-api.de/api/interpreter`,
  `https://overpass.kumi.systems/api/interpreter`,
  `https://maps.mail.ru/osm/tools/overpass/api/interpreter`
  (or a single endpoint from `OVERPASS_URL`). Queried once per regional slice.
- **US state outlines:** `GET https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json`
- **Discord webhook:** `POST` to the `DISCORD_WEBHOOK` URL, only when that secret
  is set and new cameras were found. Body is a JSON `{ content: <markdown> }`.

None of these services require credentials except the Discord webhook, whose URL
is itself the secret.
