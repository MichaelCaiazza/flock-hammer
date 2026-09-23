# Changelog

## v4.2 — documented as-is

Documentation pass with no code changes. The application reports version 4.2
(constant `APP_VERSION` in `index.html` and `stats.html`). This is the first
changelog in the repository; earlier version history was not recorded here.

## v4.2 — native back-gesture and popups

Later change at the same reported version (`APP_VERSION` unchanged at 4.2):
open camera popups and the Report / Download modals now hold a history entry so
the phone's back gesture (and the browser Back button) closes them instead of
exiting the app, and pull-to-refresh is disabled (`overscroll-behavior: none`).
No data-format, dependency, or deployment changes.
