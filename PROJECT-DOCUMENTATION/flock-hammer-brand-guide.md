# Flock Hammer — Brand & Visual Style Guide

Flock Hammer is a community map of Flock Safety and other license-plate-reader
(ALPR) cameras, for people who want to see where these cameras are. This document
is the "for example" source of truth for generating UI, graphics, documents, or
copy that should match the app. Every value here is taken from the app's actual
source (`index.html`, `stats.html`, `manifest.webmanifest`, and the icon files);
where the source does not define something, it is marked "not yet defined."

---

## 1. Brand personality

- **Tone:** plain, direct, civic-minded; informational without alarm.
- **Feel:** a dark, quiet, technical interface where a single warm color marks
  the thing that matters. Frosted-glass panels float over a dark map; numbers are
  monospaced and precise.
- **Keywords:** dark, glassy, precise, minimal, technical, civic.
- **Not:** playful, colorful, cluttered, skeuomorphic, corporate-blue,
  alarmist.

---

## 2. Color palette

Colors are defined as CSS custom properties on `:root`, identically in
`index.html` and `stats.html`. The app is dark-theme only; there is no light
theme.

### Core

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | Void | `#0a0e15` | Page and map background (`--bg`); PWA `background_color` |
| Surface (glass) | Glass | `rgba(15,20,30,.72)` | Floating panels, popups, controls (`--glass`) |
| Surface tint (manifest) | Slate | `#0d1526` | Logo square, `theme-color`, PWA `theme_color` |
| Border | Hairline | `rgba(255,255,255,.08)` | Panel edges, dividers (`--glass-line`) |
| Text primary | Ink | `#f2f5f9` | Main text (`--ink`) |
| Text secondary/muted | Muted | `#7d8899` | Labels, captions, credits (`--muted`) |

Default (and only) theme is dark.

### Accent

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary accent | Signal | `#ff5a36` | Cameras, cones, clusters; "hot" button; active Flock toggle |
| Primary accent soft | Signal Soft | `rgba(255,90,54,.22)` | Cluster fill/glow (`--signal-soft`) |
| Secondary accent | Ice | `#8fd3ff` | Buttons, links, "new" state, focus rings (`--ice`) |
| Text on primary (hot btn) | — | `#1a0600` | Text on the Signal "hot" button |
| Text on accent (ice btn) | — | `#06121c` | Text on the default Ice button |
| Success / live | Ok | `#4ade80` | "Live" status dot (`--ok`) |

Info/danger are not defined as separate tokens.

### New-camera (ice) state

| Role | Name | Hex | Usage |
|---|---|---|---|
| New accent | Ice | `#8fd3ff` | Markers, cones, and toggle when "New (30 days)" is on |
| New badge bg | — | `rgba(143,211,255,.18)` | "New" badge background in popups |
| New cluster bg | — | `rgba(143,211,255,.2)` | Cluster fill/glow in new mode |

### Stats chart palette

| Role | Hex | Usage |
|---|---|---|
| Series 1 | `#ff5a36` | First vendor segment; Flock growth line |
| Series 2 | `#8fd3ff` | Second segment; all-ALPR growth line |
| Series 3 | `#c4b5fd` | Third vendor segment |
| Series 4 | `#4ade80` | Fourth vendor segment |
| Series 5 | `#fbbf24` | Fifth vendor segment |
| Series 6 | `#7d8899` | Sixth vendor segment |

Heatmap gradient (map): `0.2 → #3b2a26`, `0.5 → #ff5a36`, `1.0 → #ffd6c8`.

### Special surfaces

| Surface | Value | Usage |
|---|---|---|
| Glass panels | `rgba(15,20,30,.72)` + `backdrop-filter: blur(18px) saturate(140%)` | Brand card, search, tools, popups, modals |
| Modal scrim | `rgba(5,8,12,.6)` | Dim behind dialogs |
| Map tiles | OSM tiles + `filter: invert(1) hue-rotate(190deg) brightness(.72) contrast(.95) saturate(.55)` | Dark base map |

The primary accent Signal `#ff5a36` marks cameras and their view cones (and the
single "hot" action, Report a camera). It is never used for body text, ordinary
buttons, or backgrounds.

---

## 3. Gradients, backgrounds, textures

- **Page/map background:** flat `#0a0e15`. No gradient.
- **Glass panels:** translucent fill over blur, not a gradient —
  `background: rgba(15,20,30,.72); backdrop-filter: blur(18px) saturate(140%);`
- **Panel shadow / elevation token:**
  `--shadow: 0 20px 50px -20px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08);`
- **Dark map tiles (CSS filter, not an image):**
  `filter: invert(1) hue-rotate(190deg) brightness(.72) contrast(.95) saturate(.55);`
- **Cluster glow:** `box-shadow: 0 0 24px rgba(255,90,54,.22);` (ice variant uses
  `rgba(143,211,255,.2)`).
- **Heatmap gradient (data viz, not a background):**
  `{ 0.2: #3b2a26, 0.5: #ff5a36, 1: #ffd6c8 }`.

There are no decorative gradients or texture images in the brand.

---

## 4. Typography

Two families, both from Google Fonts.

- **Manrope** — UI and headings. Stack:
  `Manrope, system-ui, -apple-system, "Segoe UI", sans-serif`. Weights 500, 700,
  800.
- **JetBrains Mono** — numbers, tag keys, version tag, monospaced data. Stack:
  `"JetBrains Mono", ui-monospace, monospace`. Weights 400, 600.

Import string:
`https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@400;600&display=swap`

| Element | Face | Size | Weight | Case / tracking |
|---|---|---|---|---|
| Card label / section head (`h1`, `.card h2`) | Manrope | 13px | 700 | UPPERCASE, letter-spacing .12em |
| KPI / count number (`.big`) | Manrope | 44px (map), 40px (stats) | 800 | letter-spacing -.04em, tabular-nums |
| Modal heading (`.modal h2`) | Manrope | 22px | 800 | letter-spacing -.02em |
| Body / sub text | Manrope | 13–14px | 500–600 | normal |
| Buttons | Manrope | 13px | 700 | normal |
| Nav links (stats) | Manrope | 13px | 700 | normal |
| Popup title | Manrope | 15px | 800 | letter-spacing -.01em |
| Version tag `.ver` | JetBrains Mono | 11px | 600 | normal |
| Data numbers / tag keys | JetBrains Mono | 11–12px | 400–600 | normal |

Line-height is 1 for the big numbers, ~1.5 for popup and modal body text.
Smallest text is 11px (version tag, tag keys, credits). Rule of thumb: Manrope
for everything readable, JetBrains Mono for anything numeric or code-like.

---

## 5. Logo & wordmark

- **Mark:** a graphic icon — a rounded square filled `#0d1526` containing a solid
  orange (`#ff5a36`) camera "sweep" (a cone pointing up) with a dot at its base,
  representing a camera and its view angle. Defined as SVG in `assets/logo.svg`.
- **Wordmark:** the text "Flock Hammer" set in Manrope. In the app UI it appears
  as an uppercase 13px 700 label in the top-left card (map) and the header
  (stats), followed by a monospaced version tag such as `v4.2`. The logo graphic
  is not shown inside the pages — only the wordmark appears on-page.
- **Favicon / app icon:** `assets/logo.svg` (SVG favicon), `assets/icon-32.png`
  (32px), `assets/icon-180.png` (Apple touch), and `assets/icon-192.png` /
  `assets/icon-512.png` / `assets/icon-maskable-512.png` (PWA). The maskable icon
  has padding so it survives platform icon shapes.
- **Clear space:** not yet defined.
- **Never:** do not place the wordmark logo graphic inside the pages (the app
  uses the mark only as the browser/app icon); do not recolor the sweep away from
  Signal `#ff5a36` or the square away from `#0d1526`.

Logo SVG (shapes; the file also carries content-credential metadata):

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" rx="32" fill="#0d1526"/>
  <path d="M80 121 L36 49 A54 54 0 0 1 124 49 Z" fill="#ff5a36"/>
  <circle cx="80" cy="121" r="13" fill="#ff5a36"/>
</svg>
```

---

## 6. Shapes, spacing, elevation

- **Border radii:** panels/cards `18px` (`--radius`); popups `14px`; pill controls
  and buttons `999px`; switch tracks `999px`; modal close button `50%`; zoom
  control `12px`; small switch hover area `12px`; icon square `32px` radius on a
  160px canvas.
- **Borders:** hairline `1px` at `rgba(255,255,255,.08)`; camera cluster border
  `1.5px solid #ff5a36` (ice variant `#8fd3ff`).
- **Spacing:** panel padding ~`8px` (tools) to `18–22px` (brand card), `26–28px`
  (modals); common gaps `6px`, `8px`, `14px`. Stats grid gap `14px`.
- **Content width:** stats page `main` max-width `1080px`; modals max-width
  `520px`; map panels fixed at `340px` (desktop) and full-width on phones.
- **Buttons:** padding `9px 16px`, radius `999px`, weight 700, 13px. Variants:
  default (Ice bg, `#06121c` text), `.ghost` (`rgba(255,255,255,.07)` bg, Ink
  text), `.hot` (Signal bg, `#1a0600` text).
- **Cards (stats):** glass fill, `18px` radius, padding `22px 24px`, shadow token.
- **Shadows:** the single `--shadow` token above for all elevated surfaces; plus
  colored `0 0 24px` glows on clusters.
- **Tap targets:** zoom buttons `36×36px`; switch/button paddings give ~36–40px
  touch height.

---

## 7. Effects & motion

- **Hover:** buttons `filter: brightness(1.08)`; switch rows tint
  `rgba(255,255,255,.04)`; ghost/zoom controls lighten slightly.
- **Active:** buttons `transform: scale(.97)`.
- **Focus:** `2px solid #8fd3ff` outline with `2–3px` offset on inputs, buttons,
  and switches.
- **Transitions:** buttons `transform .12s, filter .12s`; switch track/knob
  `.2s`; notice toast `opacity .2s, transform .2s`.
- **Animation:** one keyframe, `pulse` (1s infinite alternate to opacity .3),
  used only by the loading status dot.
- **Glass:** `backdrop-filter: blur(18px) saturate(140%)` on panels; `blur(4px)`
  on clusters.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables the dot
  animation and sets `transition: none` on everything.
- **Does not animate:** page/route transitions, map marker entrance, chart
  drawing, modal open/close (they toggle via `display`).
- **Native behavior:** `overscroll-behavior: none` on `html, body` disables
  pull-to-refresh; open popups/modals are dismissed by the back gesture via the
  History API rather than exiting the app.

---

## 8. App UI styling

- **Full-bleed map** with floating glass panels over it (map page).
- **Brand card** (top-left): uppercase label + version tag, a large tabular
  count, a status line with a colored dot, and a row of text links.
- **Search pill** (top-right): rounded input plus a "Go" button.
- **Tools panel** (right, below search): a two-column grid of switches and a
  wrapping row of buttons; restacks to the bottom on phones.
- **Toggles:** iOS-style switches; Signal when on, Ice when the "new" toggle is
  on.
- **Attribution pill** (bottom-left): muted credit to OpenStreetMap.
- **Camera popup:** glass card, bold title, optional "New" badge, a definition
  list of tags, and a wrapped row of action links.
- **Modals:** centered glass panel over a dim scrim, with a round close button;
  used for Report a camera and Download area.
- **Map symbology:** circle markers (Signal, or Ice in new mode), numbered
  clusters, translucent view cones at close zoom, density heatmap at far zoom.
- **Stats dashboard:** a 12-column responsive grid of glass cards — KPI tiles,
  an inline-SVG growth line chart, ranked bar lists, a segmented vendor bar with
  legend, and a recently-added link list.

---

## 9. Iconography

- **App/brand icon:** the custom camera-sweep mark in `assets/` (SVG + PNG
  sizes). Solid Signal orange on the Slate square; the maskable PNG is padded.
- **UI icons:** the app uses almost no icon set. Interface affordances are text
  labels and CSS-drawn shapes (the switch knob, the `×` close glyph as a text
  character, Leaflet's built-in `+`/`−` zoom glyphs). Status is a colored dot,
  not an icon.
- **Color behavior:** the mark is single-color Signal orange; it is not
  recolored per context. No stroke-based icon grid is defined.

---

## 10. Voice & copy

- **Tone:** short, factual, lower-key. Explain what a control does; avoid hype and
  avoid fear. Use the app's own labels.
- **Vocabulary to use:** "cameras mapped", "Flock only", "New (30 days)", "Report
  a camera", "Download area", "view angle", "operator", "transparency portal".
- **Vocabulary to avoid:** surveillance-state rhetoric, marketing superlatives,
  emoji.
- **Headlines/labels:** uppercase, terse section labels ("STATS", "VENDORS",
  "CAMERAS BY STATE"). Buttons are imperative verbs ("Refresh", "Go", "Report a
  camera").
- **Example lines from the product:**
  - "Community map of Flock Safety and other license-plate-reader cameras, from
    OpenStreetMap."
  - "cameras mapped"
  - "How to spot one"
  - "This map is built from OpenStreetMap, so adding a camera there puts it here
    (and on every other map using the data) within a day."
- **Banned:** emoji; exclamation-heavy or alarmist phrasing; claims the data is
  complete or authoritative (it depends on OSM contributors).

---

## 11. Quick CSS variable block

```css
:root {
  --bg: #0a0e15;
  --glass: rgba(15,20,30,.72);
  --glass-line: rgba(255,255,255,.08);
  --ink: #f2f5f9;
  --muted: #7d8899;
  --ice: #8fd3ff;
  --signal: #ff5a36;
  --signal-soft: rgba(255,90,54,.22);
  --ok: #4ade80;
  --radius: 18px;
  --shadow: 0 20px 50px -20px rgba(0,0,0,.8), 0 0 0 1px var(--glass-line);

  /* not defined as tokens in source, listed for reference */
  --slate: #0d1526;          /* logo square, theme-color */
  --btn-on-ice: #06121c;     /* text on default button */
  --btn-on-hot: #1a0600;     /* text on hot button */
}
```
