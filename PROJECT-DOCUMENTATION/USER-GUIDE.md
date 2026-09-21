# User guide

Flock Hammer is a map of Flock Safety and other license-plate-reader (ALPR)
cameras. It has two pages: the map and the stats dashboard.

## The map (index.html)

When the page opens it loads the camera dataset and, if you allow location
access, centers on you; otherwise it shows a wide view. The number in the
top-left card is how many cameras are currently shown.

### Top-left card
- **Flock Hammer** with a version tag (e.g. `v4.2`).
- A large **count** of cameras shown, and a status line reading "cameras mapped"
  with the data's last-updated time. A small dot shows status: gray idle, orange
  pulsing while loading, green when data is loaded.
- Three links: **Stats** (opens the dashboard), **How to spot one** (opens the
  Report a camera guide), and **New-camera feed** (the RSS feed of newly mapped
  cameras).

### Search (top-right)
Type a city, address, or intersection and press **Go** (or Enter). The map jumps
to the best match. Searches are answered by OpenStreetMap's Nominatim service.

### Tools panel
- **Flock only** (on by default): show only cameras whose manufacturer is Flock
  Safety. Turn it off to also see other vendors and untagged ALPR cameras.
- **New (30 days)**: show only cameras added in the last 30 days. When on,
  markers and cones switch to the ice-blue color.
- **Report a camera**: opens a guide on spotting a Flock camera, the exact OSM
  tags to use with a copy button, and a button that opens the OpenStreetMap iD
  editor at your current map view.
- **Download area**: opens a dialog to download the cameras currently in view (in
  your current filters) as GPX, KML, or GeoJSON. GPX suits OsmAnd, Garmin, and
  most nav apps; KML suits Google Earth and My Maps; GeoJSON is for developers.
- **Refresh**: reload the camera data now. Data also refreshes automatically
  every 30 minutes.

### The map itself
- Cameras appear as colored dots. When many are close together they group into
  numbered cluster bubbles that split apart as you zoom in.
- Zoom out past the state level and the markers become a density **heatmap**;
  zoom back in and clusters return.
- Zoom in close (street level) and each camera with a known direction shows a
  **view cone** indicating which way it points.
- Zoom controls are at the bottom-right.

### Camera popups
Click a camera to see its details: manufacturer, operator, direction, mount,
zone, start date, and note where those are known, plus when it was added and a
**New** badge if recent. The popup's actions:
- **Copy link** — copies a URL that reopens the map on this camera.
- **Edit on OSM** — opens the camera's node on OpenStreetMap to edit.
- **Transparency portal** — a web search for the operator's Flock transparency
  portal (shown when an operator is known).
- **Operator site** — the operator's website, if tagged.
- **Street View** — Google Street View at the camera's location.

### Sharing
The address bar always reflects your current position and any open camera, so you
can copy the URL to send someone the exact view.

## Installing as an app
On a phone or desktop with a supporting browser, you can install Flock Hammer as
a standalone app (its own icon and window) via the browser's "Install app" /
"Add to Home screen" option. This uses the app manifest and service worker.

## The stats dashboard (stats.html)

A read-only overview, reachable from the **Stats** link. It shows:
- **Headline numbers:** total cameras mapped, how many are Flock, how many have a
  known view angle, and how many states are covered. Total and Flock show
  "+this week / +this month" once enough history exists.
- **Growth:** a line chart of all ALPR cameras and Flock cameras over time.
  Appears once at least two daily snapshots exist.
- **Cameras by state:** a ranked bar list (top 15).
- **Vendors:** a segmented bar breaking down manufacturers.
- **Top operators:** a ranked list of operators where tagged.
- **Recently added:** the latest newly mapped cameras, each linking into the map,
  with a link to subscribe to the RSS feed.

Use **Open the map** in the header to return to the map. Some panels are empty
until the nightly job has run once (totals) or twice (growth, recently added).
