# Changelog

## v4.3

- Open camera popups and the Report / Download modals hold a history entry, so the
  phone's back gesture (and the browser Back button) closes them instead of
  exiting the app; pull-to-refresh is disabled (`overscroll-behavior: none`).
- Live current-location beacon with an accuracy ring (Geolocation `watchPosition`)
  and a locate button above the zoom control to recenter on the user.
- Replaced Leaflet's zoom/locate controls with a custom glass button stack that
  stays right-aligned with the side panels; fixed a mobile width cap that pushed
  the search bar and filter panel left; locate icon is a sized-up beacon.
- Fixed a startup crash (`locateBtn` referenced before initialization) that could
  leave the map showing zero cameras.

No data-format, dependency, or deployment changes in this release.

## v4.2 — documented as-is

Documentation pass with no code changes. This was the first changelog in the
repository; earlier version history was not recorded here.
