// Nightly export for Flock Hammer. Run: node scripts/export.mjs  (Node 18+, no dependencies)
//
// 1. Pulls every ALPR camera (Flock and other vendors) from OpenStreetMap via Overpass
// 2. Tags each with its US state (point-in-polygon, state outlines fetched at run time)
// 3. Writes data/cameras.geojson for the map
// 4. Appends today's totals to data/history.json for the stats page
// 5. Diffs against yesterday's file -> data/new.json (recent additions) + data/feed.xml (RSS)
// 6. Optionally posts new cameras to a Discord webhook
//
// Env vars (all optional):
//   OVERPASS_URL     alternate Overpass endpoint
//   SITE_URL         public URL of the site, used for links in the feed (e.g. https://you.github.io/flock-hammer)
//   DISCORD_WEBHOOK  Discord webhook URL; if set, new cameras are posted there
//   ALERT_STATES     comma-separated state names to alert on (default: all), e.g. "Texas,Colorado"

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const MIRRORS = process.env.OVERPASS_URL ? [process.env.OVERPASS_URL] : [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
const STATES_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
const SITE_URL   = (process.env.SITE_URL || '').replace(/\/$/, '');
const WEBHOOK    = process.env.DISCORD_WEBHOOK;
const ALERT_STATES = (process.env.ALERT_STATES || '').split(',').map(s => s.trim()).filter(Boolean);
const UA = { 'User-Agent': 'flock-hammer-export (github actions)' };
const P = { out: 'data/cameras.geojson', history: 'data/history.json', recent: 'data/new.json', feed: 'data/feed.xml' };
const NEW_KEEP_DAYS = 90;

const readJson = async (p, fallback) => { try { return JSON.parse(await readFile(p, 'utf8')); } catch { return fallback; } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ---- 1. cameras (out meta = includes the timestamp each node was last edited) ----
const query = `[out:json][timeout:180];
(
  node["man_made"="surveillance"]["surveillance:type"="ALPR"];
  node["man_made"="surveillance"]["manufacturer"~"flock",i];
);
out meta;`;
async function fetchOverpass() {
  const errors = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const url of MIRRORS) {
      try {
        console.log(`Querying ${url} (attempt ${attempt + 1})`);
        const res = await fetch(url, { method: 'POST', headers: UA, body: 'data=' + encodeURIComponent(query), signal: AbortSignal.timeout(240_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!Array.isArray(json.elements)) throw new Error('unexpected response');
        return json.elements.filter(e => e.type === 'node');
      } catch (e) { errors.push(`${url}: ${e.message}`); console.warn('  failed:', e.message); }
    }
    await new Promise(r => setTimeout(r, 30_000));
  }
  throw new Error('All Overpass servers failed:\n' + errors.join('\n'));
}
const nodes = await fetchOverpass();
console.log(`Got ${nodes.length} cameras from Overpass`);

// ---- 2. state lookup ----
let states = [];
try {
  const gj = await (await fetch(STATES_URL, { headers: UA })).json();
  states = gj.features.map(f => ({ name: f.properties.name, geom: f.geometry }));
} catch (e) { console.warn('State outlines unavailable, skipping state tagging:', e.message); }
function inRing(pt, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const inGeom = (pt, g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)
  .some(rings => inRing(pt, rings[0]) && !rings.slice(1).some(h => inRing(pt, h)));
const stateOf = pt => states.find(s => inGeom(pt, s.geom))?.name || null;

// ---- 3. GeoJSON ----
const previous = await readJson(P.out, null);
const prevIds = new Set(previous?.features.map(f => f.properties.id) || []);
const isFlock = t => /flock/i.test(t.manufacturer || '');
const features = nodes.map(e => {
  const tags = e.tags || {};
  return { type: 'Feature', geometry: { type: 'Point', coordinates: [e.lon, e.lat] },
    properties: { id: e.id, tags, state: stateOf([e.lon, e.lat]), flock: isFlock(tags), ts: e.timestamp || null } };
});
await mkdir('data', { recursive: true });
await writeFile(P.out, JSON.stringify({ type: 'FeatureCollection', generated: new Date().toISOString(),
  source: 'OpenStreetMap contributors, via Overpass API', features }));

// ---- 4. history ----
const today = new Date().toISOString().slice(0, 10);
const history = (await readJson(P.history, [])).filter(h => h.date !== today)
  .concat({ date: today, total: features.length, flock: features.filter(f => f.properties.flock).length });
await writeFile(P.history, JSON.stringify(history));

// ---- 5. new cameras (only meaningful once a previous file exists) ----
const added = previous ? features.filter(f => !prevIds.has(f.properties.id)) : [];
const recent = (await readJson(P.recent, []))
  .filter(r => (Date.now() - new Date(r.seen)) / 864e5 <= NEW_KEEP_DAYS)
  .concat(added.map(f => ({ id: f.properties.id, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0],
    state: f.properties.state, flock: f.properties.flock, operator: f.properties.tags.operator || null,
    manufacturer: f.properties.tags.manufacturer || null, seen: new Date().toISOString() })))
  .sort((a, b) => b.seen.localeCompare(a.seen));
await writeFile(P.recent, JSON.stringify(recent));

const camUrl = r => `${SITE_URL}/#map=17/${r.lat.toFixed(5)}/${r.lon.toFixed(5)}&cam=${r.id}`;
const title = r => `${r.manufacturer || 'ALPR'} camera${r.state ? ' in ' + r.state : ''}${r.operator ? ' (' + r.operator + ')' : ''}`;
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Flock Hammer: newly mapped cameras</title>
<link>${esc(SITE_URL || 'https://openstreetmap.org')}</link>
<description>ALPR cameras added to OpenStreetMap, detected by the nightly export.</description>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${recent.slice(0, 200).map(r => `<item>
<title>${esc(title(r))}</title>
<link>${esc(camUrl(r))}</link>
<guid isPermaLink="false">osm-node-${r.id}</guid>
<pubDate>${new Date(r.seen).toUTCString()}</pubDate>
<description>${esc(`${r.lat.toFixed(5)}, ${r.lon.toFixed(5)} — https://www.openstreetmap.org/node/${r.id}`)}</description>
</item>`).join('\n')}
</channel></rss>`;
await writeFile(P.feed, rss);

// ---- 6. Discord ----
const alerts = added.filter(f => !ALERT_STATES.length || ALERT_STATES.includes(f.properties.state));
if (WEBHOOK && alerts.length) {
  const lines = alerts.slice(0, 20).map(f => {
    const r = { id: f.properties.id, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], state: f.properties.state,
      operator: f.properties.tags.operator, manufacturer: f.properties.tags.manufacturer };
    return `• [${title(r)}](${camUrl(r)})`;
  });
  const content = `**${alerts.length} new camera${alerts.length > 1 ? 's' : ''} mapped since yesterday**\n${lines.join('\n')}${alerts.length > 20 ? `\n…and ${alerts.length - 20} more` : ''}`;
  const r = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
  console.log('Discord webhook:', r.status);
}

console.log(`Wrote ${features.length} cameras (${history.at(-1).flock} Flock), ${added.length} new since last run, history ${history.length} days`);
