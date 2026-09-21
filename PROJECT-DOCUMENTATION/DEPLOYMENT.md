# Deployment

The app is deployed as a static site on GitHub Pages, with a scheduled GitHub
Actions workflow generating and committing the data files. This reflects
`.github/workflows/nightly.yml` and the repo's existing `README.md`.

## One-time setup

1. **Push the repo to GitHub** on branch `main`.
2. **Enable Pages:** Settings → Pages → Deploy from a branch → branch `main`,
   folder `/ (root)`. Pages serves the repo root, so `index.html` is the site's
   entry point and `stats.html` is reachable at `/stats.html`.
3. **Allow the workflow to commit:** Settings → Actions → General → Workflow
   permissions → "Read and write permissions". The nightly job pushes the `data/`
   files back to the repo, which requires this. The workflow also declares
   `permissions: contents: write`.
4. **Run the data job once:** Actions tab → "Nightly camera export" → Run
   workflow. This creates the `data/` folder so the pages have data to load.

## Optional configuration

Set these under Settings → Secrets and variables → Actions:

- Variable `SITE_URL` — your Pages URL; used for links in `data/feed.xml` and
  Discord messages.
- Variable `ALERT_STATES` — e.g. `Texas,Colorado` to limit Discord alerts.
- Secret `DISCORD_WEBHOOK` — a Discord channel webhook to receive new-camera
  alerts.

## How updates happen

- **Data updates:** the workflow runs on cron `17 6 * * *` (06:17 UTC daily) and
  on manual dispatch. It runs `node scripts/export.mjs` on Node 22 with a
  40-minute job timeout, then commits `data/` if anything changed, with the
  message `Nightly camera data <date>`. A run that fails to fetch enough cameras
  does not overwrite existing data (the script refuses to write fewer than 100
  cameras total).
- **Code updates:** commit changes to `index.html`, `stats.html`, or the assets
  and push to `main`. GitHub Pages redeploys automatically. Because the service
  worker (`sw.js`) caches core files, a browser may serve the previous version
  until the worker updates; the worker uses a network-first strategy and clears
  old caches on activation (cache name `flock-hammer-v1`).

## Database and login

The app uses no database and no login/authentication system. There is nothing to
provision or configure for either. All persistent data is the set of files under
`data/` in the repository.

## Verification

- After the first workflow run, confirm the `data/` folder exists in the repo and
  that the run log prints a line such as `Wrote N cameras`.
- Open the Pages URL and confirm the map shows a non-zero camera count; open
  `stats.html` and confirm KPIs populate. Growth chart, the "New (30 days)"
  layer, and the recently-added list require at least two nightly runs (they
  compare against the previous snapshot).

## Where this documentation folder sits

`PROJECT-DOCUMENTATION/` is at the repo root. GitHub Pages is configured to serve
the repo root, so this folder is inside the published directory: its files are
publicly reachable at `<site>/PROJECT-DOCUMENTATION/...`. This is a statement of
fact about the current configuration, not a recommendation.
