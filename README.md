# I KNOW THAT! — lower thirds

Transparent 1920 × 1080 lower-third overlays for the OBS remote camera feeds (host, co-host, guests), plus a producer desk to set them up.

Plain static files. No build step.

| File | What it is |
| --- | --- |
| `index.html` | Producer desk: pick a preset, preview, copy the overlay URL or download a file |
| `lower-third.html` | The overlay itself. Used as an OBS Browser Source |
| `presets.json` | Show presets (Host, Co-host, Guest). Edit on GitHub; Vercel redeploys |
| `assets/logo-source.png` | Full-size logo, kept for regenerating the small embedded copy |
| `vercel.json` | Turns off caching so OBS and the desk always get the latest files |

## Using it in OBS

**URL mode (recommended).** Open the desk, pick a person, click **Copy URL**, and paste it into a Browser Source:

- URL: the copied `…/lower-third.html?name=…` address
- Width 1920, height 1080
- Tick **Refresh browser when scene becomes active** so the entrance animation replays

Make one Browser Source per person (Host, Co-host, Guest) and toggle them per scene.

**File mode (offline backup).** Click **Download overlay file**. The file is named after the person (`IKT-lower-third-ken-krell.html`) and has the settings baked in. In OBS tick **Local file** and select it. Don't add `?name=` to local files.

URL parameters override the defaults inside `lower-third.html`: `name`, `title`, `label`, `bottom` (40–760 px), `animate` (`true`/`false`), `bg` (`#rrggbb`), `opacity` (0–100).

## Changing presets

Edit `presets.json` and commit. Each entry:

```json
{ "id": "cohost", "preset": "Co-host", "name": "Jane Doe", "title": "Co-host | I Know That", "label": "CO-HOST" }
```

Presets saved with **Save as new preset** in the desk live in that browser only.

## Running locally

The desk loads `lower-third.html` and `presets.json` with `fetch`, so it needs a web server rather than a double-clicked file:

```bash
npx serve .
```

## Deploying

Import the repo in Vercel with the **Other** framework preset, no build command, output directory `.` (the root). Every push to `main` redeploys.
