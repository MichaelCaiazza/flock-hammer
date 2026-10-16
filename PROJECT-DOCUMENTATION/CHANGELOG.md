# Changelog

## v4.4

- The stats dashboard is now an in-app overlay opened from the Stats link,
  instead of a separate `stats.html` page; `stats.html` was removed and the app
  is a single page. The overlay reuses the already-loaded camera data and
  participates in the back-gesture dismissal. Service worker cache bumped to v2
  so clients drop the old cached stats page.

## v4.3

- Open camera popups and the Report / Download modals hold a history entry, so the
  phone's back gesture (and the browser Back button) closes them instead of
  exiting the app; pull-to-refresh is disabled (`overscroll-behavior: none`).
- Live current-location beacon with an accuracy ring (Geolocation `watchPosition`)
  and a locate button above the zoom control to recenter on the user.
- Replaced Leaflet's zoom/locate controls with a custom glass button stack that
  stays right-aligned with the side panels; fixed a mobile width cap that pushed
  the search bar and filter panel left; locate icon is a sized-up beacon.
- Nightly export made fault-tolerant: a failed Overpass slice no longer aborts
  the whole run; the oversized Pacific/north slice was split; added a guard that
  refuses to overwrite data when more than two slices fail or the total looks
  partial (< 75% of the previous run). Per-slice timeout raised to 150s.
- Fixed a startup crash (`locateBtn` referenced before initialization) that could
  leave the map showing zero cameras.

No data-format, dependency, or deployment changes in this release.

## v4.2 — documented as-is

Documentation pass with no code changes. This was the first changelog in the
repository; earlier version history was not recorded here.
