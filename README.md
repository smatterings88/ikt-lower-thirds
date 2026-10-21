# I KNOW THAT! — lower thirds

Transparent 1920 × 1080 overlays for the OBS remote camera feeds (host, co-host, guests) and a daily show-start countdown, plus a producer desk to set them up.

Plain static files. No build step.

| File | What it is |
| --- | --- |
| `index.html` | Producer desk: lower thirds and the countdown. Preview, copy a URL, or download a file |
| `lower-third.html` | Name overlay. Used as an OBS Browser Source |
| `countdown.html` | Show-start countdown. A separate OBS Browser Source |
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

URL parameters override the defaults inside `lower-third.html`: `name`, `title`, `label`, `ticker` (scrolling line; leave blank to hide it), `bottom` (40–760 px), `animate` (`rise`, `fade`, `left`, `right`, `drop`, `pop`, `wipe`, `expand`, or `none`; `true` still means slide up), `bg` (`#rrggbb`), `opacity` (0–100).

## Countdown

Open the **Countdown** tab on the desk. The show starts daily at **8:54 PM US Eastern** (`America/New_York`). The clock follows that zone through daylight saving, using the computer's own time, so it is right from Manila or anywhere else.

**URL mode.** Copy the countdown URL into its own Browser Source:

- Width 1920, height 1080
- Leave **Refresh browser when scene becomes active** off, so the 10-, 5-, 2-, and 1-minute cues do not replay
- Leave **Shutdown source when not visible** off, so a hidden source does not freeze the clock

**File mode.** Download `IKT-countdown.html`. The settings are baked in. In OBS tick **Local file**.

The clock stays up however many hours remain. At zero the timer comes off, and after the live window the countdown for the next start comes back.

URL parameters override the defaults inside `countdown.html`: `time` (24-hour `HH:MM`, default `20:54`), `tz` (IANA zone, default `America/New_York`), `live` (seconds the timer stays off after zero, default 30), `sound` (`true` plays short beeps at the cues and the last 10 seconds; default off), `test` (seconds remaining from page load, for rehearsal — `?test=605` for the 10-minute cue, `?test=15` for the ending). Test mode shows a **TEST** tag and is not part of the copied show URL.

`node check-countdown-dst.mjs` prints the 8:54 PM Eastern instant around the 2026 daylight-saving changes and checks each one.

## Changing presets

Edit `presets.json` and commit. Each entry:

```json
{ "id": "cohost", "preset": "Co-host", "name": "Jane Doe", "title": "Co-host | I Know That", "label": "CO-HOST" }
```

Presets saved with **Save as new preset** in the desk live in that browser only.

## Running locally

The desk loads `lower-third.html`, `countdown.html`, and `presets.json` with `fetch`, so it needs a web server rather than a double-clicked file:

```bash
npx serve .
```

## Deploying

Import the repo in Vercel with the **Other** framework preset, no build command, output directory `.` (the root). Every push to `main` redeploys.
