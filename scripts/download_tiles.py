#!/usr/bin/env python3
"""
download_tiles.py — fetch Sentinel-2 letter images from Copernicus Data Space.

Requirements:
  pip install requests pillow numpy tifffile

Usage:
  # Set credentials as env vars (free account at identity.dataspace.copernicus.eu):
  export CDSE_CLIENT_ID="sh-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  export CDSE_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxx"

  # Download all letters with default settings (True Color, default dates):
  python scripts/download_tiles.py

  # Download a specific letter only:
  python scripts/download_tiles.py --letter a

  # Use a different composite:
  python scripts/download_tiles.py --composite FALSE_COLOR

  # Override the date for every image:
  python scripts/download_tiles.py --date 2024-08-15

  # Increase cloud tolerance (0-100):
  python scripts/download_tiles.py --max-cloud 60

Output: images/{id}.jpg  (e.g. images/a_0.jpg)
"""

import io
import os
import sys
import math
import time
import argparse
import requests
import numpy as np
import tifffile
from PIL import Image
from datetime import datetime, timedelta
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

TOKEN_URL = (
    "https://identity.dataspace.copernicus.eu"
    "/auth/realms/CDSE/protocol/openid-connect/token"
)
PROCESS_URL = "https://sh.dataspace.copernicus.eu/api/v1/process"

IMG_SIZE = 512      # pixels per side
OUTPUT_DIR = Path(__file__).parent.parent / "images"

# ── Letter data (mirrors letters_config.js) ───────────────────────────────────
# Format: id, lat, lng, delta, date
LETTERS = [
    # A
    ("a_0",  36.589, -89.341, 0.11, "2024-07-15"),
    ("a_1",  45.729, -69.769, 0.22, "2024-02-18"),
    ("a_2",  40.664,  47.110, 0.22, "2024-07-01"),
    ("a_3",  62.555,-164.936, 0.80, "2024-08-01"),
    ("a_4",  60.764,  10.945, 0.80, "2024-07-15"),
    # B
    ("b_0",  35.145, -93.055, 0.10, "2024-07-01"),
    ("b_1",  -7.617, -62.921, 0.10, "2023-07-06"),
    # C
    ("c_0",  40.788,-119.204, 0.50, "2024-09-01"),
    ("c_1", -62.956, -60.642, 0.30, "2024-01-15"),
    ("c_2",  30.644, -91.446, 0.15, "2024-06-14"),
    # D
    ("d_0",  53.016, -81.307, 1.00, "2024-08-01"),
    ("d_1", -32.621, 142.073, 0.30, "2024-07-15"),
    # E
    ("e_0",  29.263,  96.318, 0.50, "2024-10-01"),
    ("e_1",  54.714, 136.572, 0.30, "2024-03-01"),
    ("e_2", -20.500, 158.500, 0.80, "2024-07-01"),
    ("e_3",  64.096, -16.363, 0.40, "2024-08-01"),
    # F
    ("f_0", -13.841, -55.299, 0.15, "2024-07-15"),
    ("f_1", -28.734,  29.208, 0.20, "2024-08-01"),
    # G
    ("g_0",  -2.442, -66.279, 0.20, "2024-07-15"),
    # H
    ("h_0",  40.234,  71.240, 0.40, "2024-08-01"),
    ("h_1",  52.047, 109.781, 0.30, "2024-08-01"),
    # I
    ("i_0",  64.763, -22.458, 0.25, "2024-03-28"),
    ("i_1",  42.786, -77.716, 0.35, "2024-04-26"),
    ("i_2", -18.488,  16.171, 1.50, "2024-09-01"),
    ("i_3",  28.300, -10.566, 0.25, "2024-04-01"),
    ("i_4",  64.853, -16.827, 0.25, "2024-08-01"),
    # J
    ("j_0", -18.349, 146.848, 0.30, "2024-07-01"),
    ("j_1",  38.494,  38.444, 0.25, "2024-07-01"),
    ("j_2",  46.686, -90.386, 0.80, "2024-08-01"),
    # K
    ("k_0",  72.084, -76.812, 0.50, "2024-07-01"),
    ("k_1",  35.613,  95.063, 0.30, "2024-09-01"),
    # L
    ("l_0",  -0.972, 116.700, 0.10, "2024-06-01"),
    ("l_1",  40.067,  77.667, 0.40, "2024-08-01"),
    ("l_2",  50.198,-104.288, 0.20, "2024-07-15"),
    ("l_3",  50.212,-104.727, 0.20, "2024-07-15"),
    # M
    ("m_0",  38.776, -78.402, 0.20, "2024-07-01"),
    ("m_1",  39.500, -78.100, 0.20, "2024-07-01"),
    ("m_2",  42.121,  80.046, 0.40, "2024-08-01"),
    # N
    ("n_0", -17.308, -63.889, 0.20, "2024-07-01"),
    ("n_1", -17.100, -63.700, 0.20, "2024-07-01"),
    ("n_2", -12.946, -50.495, 0.20, "2024-07-15"),
    # O
    ("o_0",  42.936,-122.101, 0.15, "2024-08-15"),
    ("o_1",  51.378, -68.674, 0.80, "2024-08-01"),
    # P
    ("p_0",  68.215,-134.388, 1.00, "2024-08-01"),
    ("p_1", -10.879, -66.048, 0.20, "2022-06-24"),
    # Q
    ("q_0",  19.977,  76.508, 0.10, "2024-11-01"),
    ("q_1",  -8.242, 117.992, 0.20, "2024-08-01"),
    # R
    ("r_0", -42.688, -71.873, 0.50, "2024-02-01"),
    ("r_1",  46.294,   9.421, 0.30, "2024-07-01"),
    ("r_2",  24.758, -81.532, 0.20, "2024-03-15"),
    ("r_3",  38.441,-109.751, 0.20, "2024-07-01"),
    # S
    ("s_0",  68.417,-134.143, 0.30, "2024-08-01"),
    ("s_1",  12.008,  15.063, 0.20, "2024-11-01"),
    ("s_2", -16.935, -65.229, 0.03, "2023-06-20"),
    # T
    ("t_0",  23.175,  53.798, 0.40, "2024-03-01"),
    ("t_1",  72.878, 129.531, 1.20, "2024-08-01"),
    # U
    ("u_0",  38.269,-109.926, 0.15, "2024-07-01"),
    ("u_1",  41.324,-105.771, 0.20, "2024-08-01"),
    # V
    ("v_0",  46.111,  12.757, 0.30, "2024-07-01"),
    ("v_1", -34.286, 150.826, 0.25, "2024-02-01"),
    ("v_2",  23.351,  90.552, 0.30, "2024-11-01"),
    ("v_3",  46.544, -68.252, 0.10, "2024-08-01"),
    # W
    ("w_0",  67.036,  40.339, 0.30, "2024-07-15"),
    ("w_1",   5.449, -69.799, 0.20, "2024-01-15"),
    # X
    ("x_0",  76.734, -68.606, 0.50, "2024-08-01"),
    ("x_1",  62.237, -49.580, 0.50, "2024-07-01"),
    ("x_2",  66.618, -36.368, 0.50, "2024-07-01"),
    # Y
    ("y_0", -37.267, -72.729, 0.20, "2024-02-01"),
    ("y_1",  -5.865, -80.731, 0.20, "2024-08-01"),
    ("y_2", -43.522, 170.832, 0.20, "2024-02-01"),
    # Z
    ("z_0", -15.494, -54.341, 0.15, "2024-06-29"),
    ("z_1",  34.989,   4.389, 0.25, "2024-04-01"),
]

# ── Evalscripts — output raw float32 reflectance; stretch applied in Python ────
EVALSCRIPTS = {
    "TRUE_COLOR":       "//VERSION=3\nfunction setup(){return{input:[\"B04\",\"B03\",\"B02\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){return[s.B04,s.B03,s.B02];}",
    "FALSE_COLOR":      "//VERSION=3\nfunction setup(){return{input:[\"B08\",\"B04\",\"B03\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){return[s.B08,s.B04,s.B03];}",
    "FALSE_COLOR_URBAN":"//VERSION=3\nfunction setup(){return{input:[\"B12\",\"B11\",\"B04\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){return[s.B12,s.B11,s.B04];}",
    "SWIR":             "//VERSION=3\nfunction setup(){return{input:[\"B12\",\"B8A\",\"B04\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){return[s.B12,s.B8A,s.B04];}",
    "GEOLOGY":          "//VERSION=3\nfunction setup(){return{input:[\"B12\",\"B04\",\"B02\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){return[s.B12,s.B04,s.B02];}",
    "NDVI":             "//VERSION=3\nfunction setup(){return{input:[\"B08\",\"B04\"],output:{bands:3,sampleType:\"FLOAT32\"}};}\nfunction evaluatePixel(s){var n=(s.B08-s.B04)/(s.B08+s.B04+1e-10);return[n<0?-n:0,n>0?n:0,0];}",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def apply_stretch(tiff_bytes: bytes, lo_pct: float = 2, hi_pct: float = 98) -> bytes:
    """Read a FLOAT32 TIFF and return JPEG bytes with per-band percentile stretch."""
    arr = tifffile.imread(io.BytesIO(tiff_bytes)).astype(np.float32)
    # Normalise to (bands, H, W)
    if arr.ndim == 2:
        arr = arr[np.newaxis]
    elif arr.ndim == 3 and arr.shape[2] <= 4:
        arr = arr.transpose(2, 0, 1)

    out = np.zeros_like(arr)
    for i in range(arr.shape[0]):
        band = arr[i].ravel()
        valid = band[np.isfinite(band) & (band > 0)]
        if valid.size < 10:
            continue
        lo = np.percentile(valid, lo_pct)
        hi = np.percentile(valid, hi_pct)
        if hi > lo:
            out[i] = np.clip((arr[i] - lo) / (hi - lo), 0, 1)

    rgb = (out.transpose(1, 2, 0) * 255).clip(0, 255).astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(rgb, "RGB").save(buf, "JPEG", quality=92)
    return buf.getvalue()


def compute_bbox(lat, lng, delta):
    lng_delta = delta / math.cos(math.radians(lat))
    return [
        round(lng - lng_delta, 6),
        round(lat - delta,     6),
        round(lng + lng_delta, 6),
        round(lat + delta,     6),
    ]


def get_token(client_id: str, client_secret: str) -> str:
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type":    "client_credentials",
            "client_id":     client_id,
            "client_secret": client_secret,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def fetch_tile(token: str, bbox: list, date: str, evalscript: str,
               max_cloud: int = 50, debug: bool = False) -> bytes:
    date_end   = datetime.strptime(date, "%Y-%m-%d")
    date_start = date_end - timedelta(days=30)

    date_from = date_start.strftime("%Y-%m-%d") + "T00:00:00Z"
    date_to   = date_end.strftime("%Y-%m-%d")   + "T23:59:59Z"

    body = {
        "input": {
            "bounds": {
                "bbox": bbox,
                "properties": {"crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"},
            },
            "data": [{
                "type": "sentinel-2-l2a",
                "dataFilter": {
                    "timeRange": {"from": date_from, "to": date_to},
                    "maxCloudCoverage": max_cloud,
                },
                "processing": {
                    "upsampling":   "BICUBIC",
                    "downsampling": "BICUBIC",
                },
            }],
        },
        "output": {
            "width":  IMG_SIZE,
            "height": IMG_SIZE,
            "responses": [{
                "identifier": "default",
                "format": {"type": "image/tiff", "parameters": {"bits_per_sample": 32}},
            }],
        },
        "evalscript": evalscript,
    }

    if debug:
        print("  [debug] bbox:", bbox)
        print("  [debug] time:", date_from, "→", date_to)
        print("  [debug] cloud:", max_cloud)

    resp = requests.post(
        PROCESS_URL,
        json=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/json",
        },
        timeout=60,
    )

    if resp.status_code == 200:
        ct = resp.headers.get("Content-Type", "")
        data = resp.content
        if debug:
            print(f"  [debug] response: {ct}, {len(data)} bytes, first4={data[:4].hex()}")
        TIFF_MAGIC = (b"\x49\x49\x2a\x00", b"\x4d\x4d\x00\x2a")
        if not any(data.startswith(m) for m in TIFF_MAGIC):
            preview = data[:400].decode("utf-8", errors="replace")
            raise RuntimeError(
                f"Response is not a TIFF (Content-Type: {ct}, size: {len(data)} B):\n{preview}"
            )
        return data
    raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:300]}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Download Sentinel-2 letter tiles")
    parser.add_argument("--letter",     help="Only download images for this letter (e.g. a)")
    parser.add_argument("--composite",  default="TRUE_COLOR",
                        choices=list(EVALSCRIPTS), help="Band composite")
    parser.add_argument("--date",       help="Override date for all images (YYYY-MM-DD)")
    parser.add_argument("--max-cloud",  type=int, default=50,
                        help="Max cloud coverage %% (default 50)")
    parser.add_argument("--skip-existing", action="store_true",
                        help="Skip images that already exist on disk")
    parser.add_argument("--debug", action="store_true",
                        help="Print request/response details for each tile")
    args = parser.parse_args()

    client_id     = os.environ.get("CDSE_CLIENT_ID",     "").strip()
    client_secret = os.environ.get("CDSE_CLIENT_SECRET", "").strip()

    if not client_id or not client_secret:
        print(
            "\n  ERROR: Set CDSE_CLIENT_ID and CDSE_CLIENT_SECRET environment variables.\n"
            "  Register for free at: https://identity.dataspace.copernicus.eu/\n"
            "  Then create an OAuth client in your Sentinel Hub dashboard:\n"
            "  https://shapps.dataspace.copernicus.eu/dashboard/\n"
        )
        sys.exit(1)

    evalscript = EVALSCRIPTS[args.composite]
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Filter letters
    items = LETTERS
    if args.letter:
        items = [x for x in items if x[0].startswith(args.letter.lower())]
        if not items:
            print(f"No images found for letter '{args.letter}'")
            sys.exit(1)

    print(f"Fetching {len(items)} image(s) | composite={args.composite} | max_cloud={args.max_cloud}%")

    # Auth
    print("Authenticating with Copernicus Data Space…")
    try:
        token = get_token(client_id, client_secret)
        token_time = time.time()
        print("  ✓ Authenticated")
    except Exception as e:
        print(f"  ✗ Authentication failed: {e}")
        sys.exit(1)

    ok = skipped = failed = 0

    for img_id, lat, lng, delta, default_date in items:
        out_path = OUTPUT_DIR / f"{img_id}.jpg"

        if args.skip_existing and out_path.exists():
            print(f"  skip  {img_id}  (already exists)")
            skipped += 1
            continue

        date = args.date or default_date
        bbox = compute_bbox(lat, lng, delta)

        # Refresh token if approaching expiry (tokens last ~1h)
        if time.time() - token_time > 3300:
            token = get_token(client_id, client_secret)
            token_time = time.time()

        try:
            tiff = fetch_tile(token, bbox, date, evalscript, args.max_cloud, debug=args.debug)
            jpeg = apply_stretch(tiff)
            out_path.write_bytes(jpeg)
            print(f"  ✓  {img_id}  ({date})  → {len(jpeg)//1024} KB")
            ok += 1
            time.sleep(0.3)   # gentle rate limiting
        except Exception as e:
            print(f"  ✗  {img_id}  {e}")
            failed += 1
            time.sleep(1)

    print(f"\nDone: {ok} OK, {skipped} skipped, {failed} failed")
    if failed:
        print(
            "\nTip: for cloudy dates try --date YYYY-MM-DD to pick a clearer day,\n"
            "     or increase --max-cloud to 80."
        )


if __name__ == "__main__":
    main()
