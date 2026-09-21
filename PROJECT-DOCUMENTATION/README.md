## Maintenance rule — read before changing anything

This folder documents the app as built. Any change to the app, however small,
must update the affected files in this folder in the same change:

- Code, pages or features changed → update ARCHITECTURE, DEVELOPMENT, USER-GUIDE,
  GLOSSARY, DATA-MODEL and API as they apply.
- Any CSS, color, font, icon, layout or copy change → update the brand guide so every
  value still matches the code.
- Services, secrets, libraries or versions changed → update ACCOUNTS-AND-SERVICES
  and DEPENDENCIES.
- Deploy steps changed → update DEPLOYMENT.
- Every release → bump the version everywhere and add an entry to CHANGELOG
  (create CHANGELOG.md in this folder if none exists).
- Update the index in this README if files are added or removed.

Documentation describes what exists. No secret values, ever.

---

# Flock Hammer — documentation

Flock Hammer is a community map of Flock Safety and other automatic
license-plate-reader (ALPR) cameras. It is a static website (two HTML pages plus
assets) served from GitHub Pages, with a scheduled GitHub Actions job that pulls
camera locations from OpenStreetMap each night and commits them back to the repo
as data files the pages read. There is no application server and no database.

The app reports version **v4.2** (constant `APP_VERSION` in both `index.html` and
`stats.html`).

## Run, build, deploy in a few lines

- **Run locally:** serve the repo root with any static file server, e.g.
  `python3 -m http.server 8000`, then open `http://localhost:8000/index.html`.
  There is no build step. Opening the file over `file://` will not work because
  the pages fetch `data/` files and the service worker needs an origin.
- **Data:** run `node scripts/export.mjs` (Node 18+) to generate the `data/`
  files locally, or let the nightly workflow produce them.
- **Deploy:** push to a GitHub repo, enable GitHub Pages on branch `main` at the
  root, and run the "Nightly camera export" workflow once. See
  `DEPLOYMENT.md`.

## Index of this folder

- `README.md` — this file: overview, how to run/build/deploy, and the index.
- `ARCHITECTURE.md` — how the pieces fit together, a text diagram, and a repo map.
- `DEVELOPMENT.md` — prerequisites, commands, environment variables, and how to
  extend the app following its existing patterns.
- `DEPLOYMENT.md` — how the site and the nightly data job are deployed and updated.
- `DATA-MODEL.md` — the shapes of every generated data file and the OSM tags used.
- `API.md` — the external HTTP services the app calls (it has no backend of its own).
- `CONVENTIONS.md` — naming, file organization, state, styling, and testing patterns.
- `USER-GUIDE.md` — how to use the map and stats pages, control by control.
- `GLOSSARY.md` — the app's own terms, alphabetical.
- `ACCOUNTS-AND-SERVICES.md` — outside services, where each is configured, and
  the names of related variables and secrets.
- `DEPENDENCIES.md` — every library, font, and CDN script, with pinned versions.
- `BACKUP-AND-RESTORE.md` — where the data lives and how to restore it.
- `flock-hammer-brand-guide.md` — the visual style guide derived from the code.

CHANGELOG.md is created in this folder because no changelog existed in the repo.

## Docs that already existed in the repo

- `README.md` (repo root) — a short overview with deploy steps and a file list.
  It is left untouched. No brand guide existed before this one.
