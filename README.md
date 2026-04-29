# Your Name in Sentinel-2

Spell out your name using Sentinel-2 satellite imagery — real Earth features that naturally form the shape of each letter, captured by ESA's Copernicus programme at 10 m resolution.

Inspired by NASA's [Your Name in Landsat](https://science.nasa.gov/mission/landsat/outreach/your-name-in-landsat/).

**[Live demo →](https://spiruel.github.io/your-name-in-sentinel-2/)**

---

## Getting images

The app works in three modes:

### 1 — Pre-downloaded images (recommended for GitHub Pages)

Run `scripts/download_tiles.py` once to fetch real Sentinel-2 JPEG tiles for all 72 letter images. You need a **free** Copernicus Data Space account.

**Register (free):**  
https://identity.dataspace.copernicus.eu/

**Create an OAuth client** in your Sentinel Hub dashboard:  
https://shapps.dataspace.copernicus.eu/dashboard/  
→ User Settings → OAuth clients → Create client

```bash
pip install requests

export CDSE_CLIENT_ID="sh-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
export CDSE_CLIENT_SECRET="your-secret"

python scripts/download_tiles.py
```

This writes `images/a_0.jpg … images/z_1.jpg` (~7 MB total). Commit those files; GitHub Pages serves them as static assets.

**Options:**
```
--composite FALSE_COLOR   # NIR false colour (vegetation in red)
--composite SWIR          # Short-wave infrared (fire / burned area)
--composite GEOLOGY       # Rock / mineral mapping
--date 2024-09-01         # Override date for every image
--max-cloud 70            # Allow more cloud cover
--letter a                # Only re-download letter A
--skip-existing           # Skip images already on disk
```

### 2 — Live tiles in the browser (no pre-download needed)

Open the ⚙️ Settings panel in the app and enter your OAuth credentials. The app fetches tiles on the fly from the Sentinel Hub Process API, with your chosen band composite and per-letter date.

Credentials are stored only in your browser's `localStorage` — never sent anywhere except Copernicus.

### 3 — Placeholders (no credentials)

Without images or credentials the app still works: each letter box shows a dark satellite-style canvas placeholder with coordinates and a hint to run the download script.

---

## Hosting on GitHub Pages

1. Fork / clone this repo
2. Run `scripts/download_tiles.py` to populate `images/`
3. Commit the images
4. In your repo Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)`
5. Done — the site is live at `https://YOUR-USERNAME.github.io/name-in-sentinel/`

---

## Configuring letters

`letters_config.js` contains all 72 letter entries (A–Z, 1–5 variants per letter). Each entry has:

| field | description |
|-------|-------------|
| `id` | e.g. `a_0` — used as the image filename |
| `title` | Human-readable location name |
| `lat` / `lng` | Centre of the view (WGS84 decimal) |
| `delta` | Half-width of the view in degrees of latitude |
| `zoom` | Copernicus Browser zoom level for the share link |
| `date` | Default acquisition date (`YYYY-MM-DD`) |
| `layer` | Default layer ID for Copernicus Browser URL |
| `maps` | Google Maps link for the location |

**Note:** `date`, `zoom`, and `rotation` values are not yet verified for most images — they are initial estimates and have not been checked against the Copernicus Browser to confirm a clear scene, correct framing, or appropriate rotation. These fields need per-image review.

To add a new letter variant or change a view: edit the relevant entry, then re-run `download_tiles.py --letter X`.

---

## Band composites

| key | bands | use case |
|-----|-------|---------|
| `TRUE_COLOR` | B04 / B03 / B02 | Natural colour (default) |
| `FALSE_COLOR` | B08 / B04 / B03 | Vegetation in red |
| `FALSE_COLOR_URBAN` | B12 / B11 / B04 | Urban / bare soil |
| `SWIR` | B12 / B8A / B04 | Fire, burned area |
| `GEOLOGY` | B12 / B04 / B02 | Rock / mineral mapping |
| `NDVI` | B08 / B04 | Vegetation index (green) |

Select in the ⚙️ Settings panel or pass `--composite KEY` to the download script.

---

## URL parameters

Share a specific name with specific images:

```
?img1=s_2&img2=a_0&img3=m_0
```

Each `imgN` is a letter ID like `a_0`, `s_2`, etc. The app will load those exact images. The Share button generates this URL automatically.

**Kiosk / embed modes:**
```
?mode=kiosk   # full-screen cycling demo with on-screen keyboard
?mode=embed   # minimal UI for iframe embedding
```

---

## Data credits

Imagery: **ESA Copernicus Sentinel-2**, processed via [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/).  
Letter locations derived from NASA's [Your Name in Landsat](https://science.nasa.gov/mission/landsat/outreach/your-name-in-landsat/) dataset.
