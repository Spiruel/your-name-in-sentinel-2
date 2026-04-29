// ============================================================
// Your Name in Sentinel-2 — main.js
// ============================================================

// ── DOM refs ─────────────────────────────────────────────────
const header            = document.getElementById('header');
const nameInput         = document.getElementById('nameInput');
const enterButton       = document.getElementById('enterButton');
const nameBoxes         = document.getElementById('nameBoxes');
const downloadButton    = document.getElementById('downloadBtn');
const qrCodeButton      = document.getElementById('qrCodeBtn');
const qrCloseButton     = document.getElementById('qr-close-btn');
const QRContainerPopup  = document.getElementById('qr-popup');
const helpCloseButton   = document.getElementById('help-close-btn');
const floatingWrapper   = document.getElementById('floating-wrapper');
const locationTitle     = document.getElementById('locationTitle');
const locationCoords    = document.getElementById('locationCoordinates');
const inputPopup        = document.getElementById('inputPopup');
const inputPopupText    = document.getElementById('popupText');
const textBelowTitle    = document.getElementById('textBelowTitle');
const helpContainer     = document.getElementById('helpContainer');
const helpIcon          = document.getElementById('helpIcon');
const copyLinkButton    = document.getElementById('copy-link-btn');
const settingsBtn       = document.getElementById('settingsBtn');
const settingsPopup     = document.getElementById('settings-popup');
const settingsCloseBtn  = document.getElementById('settings-close-btn');
const compositeSelect   = document.getElementById('compositeSelect');
const compositeDesc     = document.getElementById('compositeDescription');
const clientIdInput     = document.getElementById('clientIdInput');
const clientSecretInput = document.getElementById('clientSecretInput');
const settingsStatus    = document.getElementById('settingsStatus');
const settingsSaveBtn   = document.getElementById('settingsSaveBtn');
const settingsClearBtn  = document.getElementById('settingsClearBtn');

// ── State ─────────────────────────────────────────────────────
const baseUrl = window.location.origin + window.location.pathname;
let currentCustomLink    = [];   // [ "a_0", "b_1", … ]
let imageSelected        = false;
let kioskMode            = false;
let embedMode            = false;
let cycleMode            = false;
let inactivityTimer, cycleTimer, typingInterval;
const inactivityTime         = 240_000;
const timeInBetweenCycles    = 10_000;
const inputErrorWaitTime     = 5_000;
let previousWordTime         = 0;
const imageAnimationWaitTime = 150;

// per-letter remaining pools (reset on each new name)
let pools = {};

// live-tile state
let accessToken     = null;
let tokenExpiry     = 0;
let liveMode        = false;
const blobUrls      = [];   // track for cleanup

// active composite key
let activeComposite = 'TRUE_COLOR';

// cycle demo words
const cycleWords = [
  'sentinel','copernicus','earth','orbit','radar','europe',
  'climate','forest','ocean','glacier','delta','reef'
];

// ── Bad-word filter ───────────────────────────────────────────
const badWords = [
  'asshole','arsehole','arse','ass','bitch','bastard','bollocks',
  'bullshit','cock','cunt','dickhead','fuck','fucker','fag','faggot',
  'goddamn','joder','kike','motherfucker','nigga','nigger','pussy',
  'penis','puta','pendejo','piss','slut','shit','shite','twat','whore'
];
const badWordReplies = [
  'Please no profanity!','Only nice language, thank you',
  'No bad words!','Come on, really?'
];
function containsBadWords(text) {
  const t = text.toLowerCase();
  return badWords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(t));
}

// ── Letter pool helpers ────────────────────────────────────────
function resetPools() {
  pools = {};
  for (const [letter, imgs] of Object.entries(LETTERS_CONFIG)) {
    pools[letter] = imgs.map((_, i) => i);
  }
}

function pickImage(letter) {
  const l = letter.toLowerCase();
  const cfg = LETTERS_CONFIG[l];
  if (!cfg || cfg.length === 0) return null;
  const pool = pools[l];
  if (pool && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const pick = pool[idx];
    pool.splice(idx, 1);
    return cfg[pick];
  }
  // pool exhausted — pick randomly
  return cfg[Math.floor(Math.random() * cfg.length)];
}

// ── Settings / Composites ──────────────────────────────────────
function populateCompositeSelect() {
  compositeSelect.innerHTML = '';
  for (const [key, c] of Object.entries(COMPOSITES)) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = c.label;
    if (key === activeComposite) opt.selected = true;
    compositeSelect.appendChild(opt);
  }
  updateCompositeDescription();
}

function updateCompositeDescription() {
  const key = compositeSelect.value;
  compositeDesc.textContent = COMPOSITES[key]?.description || '';
}

compositeSelect.addEventListener('change', updateCompositeDescription);

function loadStoredSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem('s2name_settings') || '{}');
    if (stored.clientId)    clientIdInput.value     = stored.clientId;
    if (stored.clientSecret) clientSecretInput.value = stored.clientSecret;
    if (stored.composite)   activeComposite          = stored.composite;
    if (stored.accessToken && stored.tokenExpiry > Date.now()) {
      accessToken = stored.accessToken;
      tokenExpiry  = stored.tokenExpiry;
      liveMode     = true;
    }
  } catch (e) { /* ignore */ }
}

function saveSettings() {
  const settings = {
    clientId:      clientIdInput.value.trim(),
    clientSecret:  clientSecretInput.value.trim(),
    composite:     compositeSelect.value,
    accessToken,
    tokenExpiry
  };
  localStorage.setItem('s2name_settings', JSON.stringify(settings));
  activeComposite = settings.composite;
}

// ── OAuth / Copernicus token ───────────────────────────────────
async function fetchToken(clientId, clientSecret) {
  const resp = await fetch(
    'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'client_credentials',
        client_id:     clientId,
        client_secret: clientSecret
      })
    }
  );
  if (!resp.ok) throw new Error(`Auth failed: ${resp.status}`);
  const data = await resp.json();
  return { token: data.access_token, expiresIn: data.expires_in || 3600 };
}

async function ensureToken() {
  if (accessToken && tokenExpiry > Date.now() + 30_000) return true;
  const id     = clientIdInput.value.trim();
  const secret = clientSecretInput.value.trim();
  if (!id || !secret) return false;
  try {
    const { token, expiresIn } = await fetchToken(id, secret);
    accessToken = token;
    tokenExpiry  = Date.now() + expiresIn * 1000;
    liveMode     = true;
    saveSettings();
    return true;
  } catch (e) {
    console.warn('Token fetch failed:', e.message);
    return false;
  }
}

// ── Live tile fetch (Sentinel Hub Process API) ─────────────────
function buildBbox(cfg) {
  return computeBbox(cfg.lat, cfg.lng, cfg.delta);
}

async function fetchLiveTile(cfg) {
  const ok = await ensureToken();
  if (!ok) return null;

  const bbox     = buildBbox(cfg);
  const composite = COMPOSITES[activeComposite] || COMPOSITES.TRUE_COLOR;
  // 30-day window ending on target date — ensures an acquisition is found
  // (Sentinel-2 revisit is 5 days; single-day windows return black images)
  const dateEnd   = new Date(cfg.date);
  const dateStart = new Date(dateEnd);
  dateStart.setDate(dateStart.getDate() - 30);
  const dateFrom  = dateStart.toISOString().slice(0, 10) + 'T00:00:00Z';
  const dateTo    = dateEnd.toISOString().slice(0, 10)   + 'T23:59:59Z';

  const body = {
    input: {
      bounds: {
        bbox,
        properties: { crs: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84' }
      },
      data: [{
        type: 'sentinel-2-l2a',
        dataFilter: {
          timeRange: { from: dateFrom, to: dateTo },
          maxCloudCoverage: 50
        },
        processing: { upsampling: 'BICUBIC', downsampling: 'BICUBIC' }
      }]
    },
    output: {
      width: 512, height: 512,
      responses: [{ identifier: 'default', format: { type: 'image/jpeg', quality: 88 } }]
    },
    evalscript: composite.evalscript
  };

  const resp = await fetch('https://sh.dataspace.copernicus.eu/api/v1/process', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) throw new Error(`Process API: ${resp.status}`);
  const blob = await resp.blob();
  const url  = URL.createObjectURL(blob);
  blobUrls.push(url);
  return url;
}

// ── Placeholder canvas ─────────────────────────────────────────
function createPlaceholder(cfg) {
  const size = 256;
  const c    = document.createElement('canvas');
  c.width = c.height = size;
  const ctx  = c.getContext('2d');

  // dark satellite-style background with noise
  ctx.fillStyle = '#0a1520';
  ctx.fillRect(0, 0, size, size);

  // subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth   = 1;
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(size,i); ctx.stroke();
  }

  // subtle noise dots
  for (let n = 0; n < 800; n++) {
    const x  = Math.random() * size;
    const y  = Math.random() * size;
    const br = Math.random() * 0.18 + 0.02;
    ctx.fillStyle = `rgba(80,160,220,${br})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // dim letter background
  ctx.font         = `bold ${size * 0.65}px Inter, sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = 'rgba(0,199,230,0.07)';
  ctx.fillText(cfg.id[0].toUpperCase(), size / 2, size * 0.48);

  // location name
  ctx.font      = `600 ${size * 0.075}px Inter, sans-serif`;
  ctx.fillStyle = 'rgba(0,199,230,0.65)';
  const title   = cfg.title.length > 22 ? cfg.title.slice(0, 21) + '…' : cfg.title;
  ctx.fillText(title, size / 2, size * 0.72);

  // coordinates
  ctx.font      = `${size * 0.055}px Inter, sans-serif`;
  ctx.fillStyle = 'rgba(150,200,230,0.45)';
  const latStr  = cfg.lat >= 0
    ? `${cfg.lat.toFixed(2)}°N`
    : `${(-cfg.lat).toFixed(2)}°S`;
  const lngStr  = cfg.lng >= 0
    ? `${cfg.lng.toFixed(2)}°E`
    : `${(-cfg.lng).toFixed(2)}°W`;
  ctx.fillText(`${latStr}  ${lngStr}`, size / 2, size * 0.83);

  // "no image" hint
  ctx.font      = `${size * 0.048}px Inter, sans-serif`;
  ctx.fillStyle = 'rgba(120,160,190,0.35)';
  ctx.fillText('run scripts/download_tiles.py', size / 2, size * 0.93);

  return c;
}

// ── Image loading ──────────────────────────────────────────────
async function loadImage(cfg) {
  // 1. Try pre-downloaded static file
  const staticOk = await new Promise(res => {
    const img = new Image();
    img.onload  = () => res(img);
    img.onerror = () => res(null);
    img.src = `./images/${cfg.id}.jpg`;
  });
  if (staticOk) return { el: staticOk, cfg };

  // 2. Try live tile if credentials available
  if (liveMode || (clientIdInput.value.trim() && clientSecretInput.value.trim())) {
    try {
      const url = await fetchLiveTile(cfg);
      if (url) {
        const img = new Image();
        img.src = url;
        await new Promise(res => { img.onload = res; img.onerror = res; });
        return { el: img, cfg };
      }
    } catch (e) { console.warn(`Live tile failed for ${cfg.id}:`, e.message); }
  }

  // 3. Placeholder
  return { el: createPlaceholder(cfg), cfg };
}

// ── Image descriptions (hover / click) ────────────────────────
function showInfo(cfg) {
  if (!locationTitle.classList.contains('active'))  locationTitle.classList.add('active');
  if (!locationCoords.classList.contains('active')) locationCoords.classList.add('active');

  locationTitle.textContent = cfg.title;
  locationTitle.href        = copernicusUrl(cfg);

  // Format coordinates
  const lat = cfg.lat, lng = cfg.lng;
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngStr = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
  locationCoords.textContent = `${latStr}, ${lngStr}`;
  locationCoords.href        = cfg.maps;
}

function hideInfo() {
  locationTitle.classList.remove('active');
  locationCoords.classList.remove('active');
}

// ── Create letter display ──────────────────────────────────────
function convertRange(value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

async function createImages(input, customLetterArray) {
  resetPools();
  currentCustomLink = [];
  blobUrls.forEach(u => URL.revokeObjectURL(u));
  blobUrls.length = 0;

  const chars = input.replace(/[^a-zA-Z ]/g, '').slice(0, 20);

  await new Promise(res => setTimeout(res, previousWordTime));

  // Clear old boxes with exit animation
  const old = Array.from(nameBoxes.children);
  old.forEach((el, i) => {
    setTimeout(() => { el.classList.remove('active'); el.classList.add('exit'); }, i * imageAnimationWaitTime);
  });
  await new Promise(res => setTimeout(res, old.length * imageAnimationWaitTime + 200));
  while (nameBoxes.firstChild) nameBoxes.removeChild(nameBoxes.firstChild);

  // Set gap based on word length
  const gap = convertRange(chars.length, [1, 20], [1.5, 0.3]);
  nameBoxes.style.gap = gap + '%';

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === ' ') {
      const blank = document.createElement('div');
      blank.classList.add('blankDiv');
      blank.style.width = convertRange(chars.length, [1, 20], [3, 1]) + '%';
      nameBoxes.appendChild(blank);
      currentCustomLink.push(' ');
      continue;
    }

    // Determine config
    let cfg;
    if (customLetterArray && customLetterArray[i] && customLetterArray[i] !== ' ') {
      cfg = findConfigById(customLetterArray[i]);
    }
    if (!cfg) cfg = pickImage(ch);
    if (!cfg) continue;

    currentCustomLink.push(cfg.id);

    // Loading placeholder while fetching
    const loading = document.createElement('div');
    loading.classList.add('letter-loading');
    loading.innerHTML = '<div class="spinner"></div>';
    nameBoxes.appendChild(loading);
    setTimeout(() => loading.classList.add('active'), imageAnimationWaitTime * i);

    // Async load
    (async (idx, loadingEl, imageCfg) => {
      const { el, cfg: c } = await loadImage(imageCfg);
      el.alt = c.id;
      if (kioskMode) el.classList.add('kiosk');

      el.addEventListener('mouseover', () => { if (!imageSelected) showInfo(c); });
      el.addEventListener('click', () => {
        if (el.classList.contains('selected')) {
          imageSelected = false;
        } else {
          nameBoxes.querySelectorAll('.selected').forEach(s => s.classList.remove('selected'));
          imageSelected = true;
        }
        el.classList.toggle('selected');
        showInfo(c);
        if (helpContainer.classList.contains('active')) helpContainer.classList.remove('active');
      });

      // Replace loading spinner
      el.style.setProperty('--letter-rotation', `${imageCfg.rotation ?? 0}deg`);

      if (loadingEl.parentNode === nameBoxes) {
        loadingEl.replaceWith(el);
      } else {
        nameBoxes.appendChild(el);
      }
      setTimeout(() => el.classList.add('active'), 30);

      if (cycleMode && kioskMode) startInactivityTimer();
    })(i, loading, cfg);
  }

  updateShareUrl();
  setTimeout(() => {
    enterButton.classList.remove('disable');
  }, chars.replace(/ /g, '').length * imageAnimationWaitTime + 300);
}

function findConfigById(id) {
  for (const imgs of Object.values(LETTERS_CONFIG)) {
    const found = imgs.find(c => c.id === id);
    if (found) return found;
  }
  return null;
}

// ── Share URL ──────────────────────────────────────────────────
function updateShareUrl() {
  const params = new URLSearchParams();
  currentCustomLink.forEach((id, i) => {
    if (id !== ' ') params.set(`img${i + 1}`, id);
  });
  window._shareUrl = `${baseUrl}?${params}`;
}

// ── Enter button ───────────────────────────────────────────────
function enterButtonClick() {
  const input = nameInput.value.trim();
  if (!input) return;
  if (enterButton.classList.contains('disable')) return;
  enterButton.classList.add('disable');

  if (textBelowTitle.classList.contains('active') && !cycleMode) {
    textBelowTitle.classList.remove('active');
  }

  if (!/^[ A-Za-z]+$/.test(input)) {
    showInputError('Please only enter letters A–Z');
    return;
  }
  if (containsBadWords(input)) {
    showInputError(badWordReplies[Math.floor(Math.random() * badWordReplies.length)]);
    return;
  }

  hideInfo();
  previousWordTime = nameBoxes.children.length * imageAnimationWaitTime + 300;
  createImages(input);
}

function showInputError(msg) {
  inputPopupText.textContent = msg;
  inputPopup.classList.add('active');
  setTimeout(() => {
    inputPopup.classList.remove('active');
    enterButton.classList.remove('disable');
  }, inputErrorWaitTime);
}

// ── QR code generation ─────────────────────────────────────────
function generateQR(url) {
  QRCode.toDataURL(url, { width: 220, margin: 1 })
    .then(qrDataUrl => {
      document.getElementById('qr-img').src = qrDataUrl;
    })
    .catch(console.error);

  // Snapshot the letter boxes
  html2canvas(nameBoxes, { backgroundColor: null, logging: false })
    .then(canvas => {
      // Trim transparent edges
      const ctx = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const data = ctx.getImageData(0, 0, w, h).data;
      let top = null, bottom = null, left = null, right = null;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (data[4*(y*w+x)+3] > 0) {
          if (top    === null) top = y;
          bottom = y;
          if (left  === null || x < left)  left  = x;
          if (right === null || x > right) right = x;
        }
      }
      let out = canvas;
      if (top !== null) {
        out = document.createElement('canvas');
        out.width  = right - left + 1;
        out.height = bottom - top  + 1;
        out.getContext('2d').drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height);
      }
      document.getElementById('final-img').src = out.toDataURL('image/png');
    })
    .catch(console.error);
}

// ── Download ───────────────────────────────────────────────────
function downloadImage() {
  html2canvas(nameBoxes, { backgroundColor: null, logging: false })
    .then(canvas => {
      const ctx = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const data = ctx.getImageData(0, 0, w, h).data;
      let top = null, bottom = null, left = null, right = null;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (data[4*(y*w+x)+3] > 0) {
          if (top === null) top = y;
          bottom = y;
          if (left === null || x < left) left = x;
          if (right === null || x > right) right = x;
        }
      }
      let out = canvas;
      if (top !== null) {
        out = document.createElement('canvas');
        out.width  = right - left + 1;
        out.height = bottom - top + 1;
        out.getContext('2d').drawImage(canvas, left, top, out.width, out.height, 0, 0, out.width, out.height);
      }
      const a = document.createElement('a');
      a.href     = out.toDataURL('image/png');
      a.download = (nameInput.value.trim() || 'sentinel2') + '.png';
      a.click();
    })
    .catch(console.error);
}

// ── Kiosk / inactivity cycling ─────────────────────────────────
function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  clearTimeout(typingInterval);
  clearTimeout(cycleTimer);
  inactivityTimer = setTimeout(() => {
    cycleMode = true;
    if (!textBelowTitle.classList.contains('active')) textBelowTitle.classList.add('active');
    typeWord(cycleWords, nameInput);
  }, inactivityTime);
}

function typeWord(words, el, speed = 200) {
  const word = words[Math.floor(Math.random() * words.length)];
  let i = 0;
  el.value = '';
  if (cycleMode) {
    typingInterval = setInterval(() => {
      if (i < word.length) {
        el.value += word[i++];
      } else {
        clearInterval(typingInterval);
        typingInterval = null;
        enterButtonClick();
        cycleTimer = setTimeout(() => {
          if (cycleMode) typeWord(words, el, speed);
        }, timeInBetweenCycles);
      }
    }, speed);
  }
}

function toggleKioskMode() {
  kioskMode = true;
  cycleMode = true;
  nameBoxes.classList.add('kiosk');
  floatingWrapper.classList.add('kiosk');
  locationTitle.style.pointerEvents    = 'none';
  locationCoords.style.pointerEvents   = 'none';
  downloadButton.remove();
  copyLinkButton.remove();
  typeWord(cycleWords, nameInput);
  // On-screen keyboard
  const kbDiv = document.createElement('div');
  kbDiv.classList.add('simple-keyboard');
  document.body.appendChild(kbDiv);
  new window.SimpleKeyboard.default({
    onKeyPress: btn => handleKbPress(btn),
    layout: {
      default: [
        'q w e r t y u i o p {backspace}',
        'a s d f g h j k l',
        'z x c v b n m {enter}',
        '{space}'
      ]
    },
    display: { '{backspace}': '⌫', '{enter}': 'Enter', '{space}': 'Space' }
  });
  startInactivityTimer();
}

function handleKbPress(btn) {
  nameInput.focus();
  if (btn === '{backspace}') {
    nameInput.value = nameInput.value.slice(0, -1);
    if (cycleMode) { cycleMode = false; clearTimeout(inactivityTimer); clearTimeout(typingInterval); clearTimeout(cycleTimer); }
  } else if (btn === '{enter}') {
    enterButtonClick();
  } else if (btn === '{space}') {
    nameInput.value += ' ';
  } else {
    nameInput.value += btn;
  }
  if (kioskMode) startInactivityTimer();
}

// ── URL parameters ─────────────────────────────────────────────
function checkSearchParams() {
  const params = new URLSearchParams(window.location.search);
  let input = '';
  const custom = [];
  for (const [key, value] of params) {
    if (key === 'mode') {
      if (value === 'kiosk')  { toggleKioskMode(); }
      if (value === 'embed')  { embedMode = true; floatingWrapper.classList.add('embed'); }
    } else if (key.startsWith('img')) {
      const letter = value[0] || '';
      input  += letter;
      custom.push(value);
    }
  }
  if (input) {
    nameInput.value = input;
    createImages(input, custom);
  }
}

// ── Settings panel ─────────────────────────────────────────────
async function applySettings() {
  const id     = clientIdInput.value.trim();
  const secret = clientSecretInput.value.trim();
  activeComposite = compositeSelect.value;
  setStatus('info', 'Saving…');

  if (id && secret) {
    setStatus('info', 'Authenticating with Copernicus…');
    try {
      const { token, expiresIn } = await fetchToken(id, secret);
      accessToken = token;
      tokenExpiry  = Date.now() + expiresIn * 1000;
      liveMode     = true;
      setStatus('ok', '✓ Authenticated — live Sentinel-2 tiles enabled');
    } catch (e) {
      setStatus('error', '✗ Authentication failed: ' + e.message);
      liveMode = false;
    }
  } else {
    liveMode = false;
    accessToken = null;
    setStatus('info', 'No credentials — using pre-downloaded images');
  }

  saveSettings();

  // Re-render current name if any
  const input = nameInput.value.trim();
  if (input && nameBoxes.children.length > 0) {
    previousWordTime = 0;
    createImages(input);
  }
}

function clearCredentials() {
  clientIdInput.value     = '';
  clientSecretInput.value = '';
  accessToken = null;
  tokenExpiry  = 0;
  liveMode     = false;
  localStorage.removeItem('s2name_settings');
  setStatus('info', 'Credentials cleared');
}

function setStatus(type, msg) {
  settingsStatus.className = 'settings-status ' + type;
  settingsStatus.textContent = msg;
}

// ── Event listeners ────────────────────────────────────────────
enterButton.addEventListener('click', () => {
  enterButtonClick();
  document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('keypress', e => {
  if (e.key === 'Enter' && document.activeElement !== compositeSelect) {
    e.preventDefault();
    if (!enterButton.classList.contains('disable')) enterButtonClick();
  }
});

nameInput.addEventListener('input', function () {
  this.value = this.value.replace(/[^a-zA-Z ]/g, '');
});

// Dismiss cycle mode on any click
document.addEventListener('click', e => {
  if (cycleMode && e.target.id !== 'enterButton') {
    cycleMode = false;
    clearTimeout(inactivityTimer);
    clearTimeout(typingInterval);
    clearTimeout(cycleTimer);
  }
  if (kioskMode) startInactivityTimer();
});

downloadButton.addEventListener('click', downloadImage);

qrCodeButton.addEventListener('click', () => {
  updateShareUrl();
  generateQR(window._shareUrl || baseUrl);
  QRContainerPopup.classList.add('active');
});
qrCloseButton.addEventListener('click', () => QRContainerPopup.classList.remove('active'));
QRContainerPopup.addEventListener('click', e => {
  if (e.target === QRContainerPopup) QRContainerPopup.classList.remove('active');
});

copyLinkButton.addEventListener('click', () => {
  const url  = window._shareUrl || baseUrl;
  const text = document.getElementById('copy-link-text');
  const icon = document.getElementById('copy-link-icon');
  navigator.clipboard.writeText(url).then(() => {
    text.textContent  = 'Copied!';
    icon.className    = 'fas fa-check';
    setTimeout(() => { text.textContent = 'Copy link'; icon.className = 'fas fa-link'; }, 3000);
  }).catch(() => alert('Failed to copy'));
});

helpIcon.addEventListener('click', () => helpContainer.classList.toggle('active'));
helpCloseButton.addEventListener('click', () => helpContainer.classList.remove('active'));
helpIcon.addEventListener('keydown', e => { if (e.key === 'Enter') helpContainer.classList.toggle('active'); });

settingsBtn.addEventListener('click', () => settingsPopup.classList.add('active'));
settingsCloseBtn.addEventListener('click', () => settingsPopup.classList.remove('active'));
settingsPopup.addEventListener('click', e => {
  if (e.target === settingsPopup) settingsPopup.classList.remove('active');
});
settingsSaveBtn.addEventListener('click', () => {
  applySettings().then(() => {
    setTimeout(() => settingsPopup.classList.remove('active'), 800);
  });
});
settingsClearBtn.addEventListener('click', clearCredentials);

document.getElementById('header-logo').addEventListener('click', () => {
  window.open('https://www.copernicus.eu/', '_blank', 'noopener');
});

// ── Init ───────────────────────────────────────────────────────
populateCompositeSelect();
loadStoredSettings();
populateCompositeSelect(); // re-populate after loading stored composite

// Show demo word on load
createImages('sentinel');
setTimeout(() => textBelowTitle.classList.add('active'), 800);

checkSearchParams();
