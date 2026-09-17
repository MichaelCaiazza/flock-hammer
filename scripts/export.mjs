// Nightly export for Flock Hammer. Run: node scripts/export.mjs  (Node 18+, no dependencies)
//
// 1. Pulls every ALPR camera (Flock and other vendors) from OpenStreetMap via Overpass
// 2. Tags each with its US state (point-in-polygon, state outlines fetched at run time)
// 3. Writes data/cameras.json (compact) for the map
// 4. Appends today's totals to data/history.json for the stats page
// 5. Diffs against yesterday's file -> data/new.json (recent additions) + data/feed.xml (RSS)
// 6. Optionally posts new cameras to a Discord webhook
//
// Env vars (all optional):
//   OVERPASS_URL     alternate Overpass endpoint
//   SITE_URL         public URL of the site, used for links in the feed (e.g. https://you.github.io/flock-hammer)
//   DISCORD_WEBHOOK  Discord webhook URL; if set, new cameras are posted there
//   ALERT_STATES     comma-separated state names to alert on (default: all), e.g. "Texas,Colorado"

import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';

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
const P = { out: 'data/cameras.json', legacy: 'data/cameras.geojson', history: 'data/history.json', recent: 'data/new.json', feed: 'data/feed.xml' };
// Only these tags are kept, to keep the file small. Everything else is on OSM behind the "Edit on OSM" link.
const KEEP_TAGS = ['manufacturer','operator','direction','camera:direction','camera:mount','surveillance:zone','start_date','note','website','contact:website','operator:website'];
const NEW_KEEP_DAYS = 90;

const readJson = async (p, fallback) => { try { return JSON.parse(await readFile(p, 'utf8')); } catch { return fallback; } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// ---- 1. cameras (out meta = includes the timestamp each node was last edited) ----
// The continent is queried in slices so each request stays small and fast; a failed slice is retried on
// the next server. Boxes are south,west,north,east. Set OVERPASS_BBOX (one box) to override, e.g. for one state.
const SLICES = process.env.OVERPASS_BBOX ? [process.env.OVERPASS_BBOX] : [
  '14,-170,72,-125',   // Alaska, Pacific coast, Mexico west
  '14,-125,72,-110',   // Mountain west
  '14,-110,72,-95',    // Plains, Texas
  '14,-95,72,-85',     // Midwest, Gulf
  '14,-85,72,-77',     // Great Lakes, Southeast
  '14,-77,72,-50',     // Northeast, Atlantic Canada
];
const queryFor = bbox => `[out:json][timeout:120];
(
  node["man_made"="surveillance"]["surveillance:type"="ALPR"](${bbox});
  node["man_made"="surveillance"]["manufacturer"~"flock",i](${bbox});
);
out meta;`;

async function fetchSlice(bbox) {
  const errors = [];
  for (let attempt = 0; attempt < 3; attempt++) {
    for (const url of MIRRORS) {
      try {
        const res = await fetch(url, { method: 'POST', headers: UA, body: 'data=' + encodeURIComponent(queryFor(bbox)), signal: AbortSignal.timeout(150_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.remark) throw new Error(`server remark: ${json.remark}`);   // timeout / memory, sent as HTTP 200
        if (!Array.isArray(json.elements)) throw new Error('unexpected response');
        return json.elements.filter(e => e.type === 'node');
      } catch (e) { errors.push(`${url}: ${e.message}`); console.warn(`  slice ${bbox} failed on ${url}: ${e.message}`); }
    }
    await new Promise(r => setTimeout(r, 20_000));
  }
  throw new Error(`Slice ${bbox} failed on every server:\n` + errors.join('\n'));
}

const byId = new Map();
for (const bbox of SLICES) {
  const got = await fetchSlice(bbox);
  for (const n of got) byId.set(n.id, n);
  console.log(`Slice ${bbox}: ${got.length} cameras (running total ${byId.size})`);
}
const nodes = [...byId.values()];
if (nodes.length < 100) throw new Error(`Only ${nodes.length} cameras returned in total, refusing to write`);
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

// ---- 3. compact camera file ----
// Format: { generated, source, strings: [...], cameras: [[id, lat, lon, tsDays, stateIdx, [kIdx, vIdx, ...]], ...] }
// Indexes point into `strings`; -1 = none. tsDays = days since epoch the node was last edited (0 = unknown).
const previous = await readJson(P.out, null);
const prevIds = new Set(previous?.cameras?.length ? previous.cameras.map(c => c[0]) : []);
const hadPrevious = prevIds.size > 0;   // an empty earlier file (failed run) must not make everything "new"

const strings = []; const sidx = new Map();
const S = v => { if (v == null) return -1; if (!sidx.has(v)) { sidx.set(v, strings.length); strings.push(v); } return sidx.get(v); };
const isFlock = t => /flock/i.test(t.manufacturer || '');
const r5 = n => Math.round(n * 1e5) / 1e5;

const cams = nodes.map(e => {
  const tags = e.tags || {};
  const kept = [];
  for (const k of KEEP_TAGS) if (tags[k]) kept.push(S(k), S(String(tags[k]).slice(0, 200)));
  const tsDays = e.timestamp ? Math.floor(new Date(e.timestamp) / 864e5) : 0;
  return { id: e.id, lat: r5(e.lat), lon: r5(e.lon), tsDays, state: stateOf([e.lon, e.lat]), tags, flock: isFlock(tags), kept };
});
await mkdir('data', { recursive: true });
await writeFile(P.out, JSON.stringify({
  generated: new Date().toISOString(), source: 'OpenStreetMap contributors, via Overpass API', strings,
  cameras: cams.map(c => [c.id, c.lat, c.lon, c.tsDays, S(c.state), c.kept]),
}));
try { await unlink(P.legacy); } catch {}   // remove the old 57 MB GeoJSON if it is still there

// ---- 4. history ----
const today = new Date().toISOString().slice(0, 10);
const history = (await readJson(P.history, [])).filter(h => h.date !== today)
  .concat({ date: today, total: cams.length, flock: cams.filter(c => c.flock).length });
await writeFile(P.history, JSON.stringify(history));

// ---- 5. new cameras (only meaningful once a previous file exists) ----
const added = hadPrevious ? cams.filter(c => !prevIds.has(c.id)) : [];
const recent = (await readJson(P.recent, []))
  .filter(r => (Date.now() - new Date(r.seen)) / 864e5 <= NEW_KEEP_DAYS)
  .concat(added.map(c => ({ id: c.id, lat: c.lat, lon: c.lon, state: c.state, flock: c.flock, operator: c.tags.operator || null,
    manufacturer: c.tags.manufacturer || null, seen: new Date().toISOString() })))
  .sort((a, b) => b.seen.localeCompare(a.seen))
  .slice(0, 2000);
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
const alerts = added.filter(c => !ALERT_STATES.length || ALERT_STATES.includes(c.state));
if (WEBHOOK && alerts.length) {
  const lines = alerts.slice(0, 20).map(c => `• [${title({ ...c, operator: c.tags.operator, manufacturer: c.tags.manufacturer })}](${camUrl(c)})`);
  const content = `**${alerts.length} new camera${alerts.length > 1 ? 's' : ''} mapped since yesterday**\n${lines.join('\n')}${alerts.length > 20 ? `\n…and ${alerts.length - 20} more` : ''}`;
  const r = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
  console.log('Discord webhook:', r.status);
}

console.log(`Wrote ${cams.length} cameras (${history.at(-1).flock} Flock), ${added.length} new since last run, history ${history.length} days`);
