// ============================================================
// Sentinel-2 Letter Image Configuration
// Each entry: geographic feature that forms the letter shape.
// lat/lng: centre of image (decimal degrees, WGS84)
// delta:   half-width in degrees of latitude for the view
//          (lng delta is auto-corrected for latitude)
// zoom:    Copernicus Browser zoom level for share URL
// date:    default acquisition date (YYYY-MM-DD)
// layer:   Copernicus Browser / Sentinel Hub layer ID
// ============================================================

const LETTERS_CONFIG = {
  a: [
    { id:'a_0', title:'Hickman, Kentucky',        sub:'USA',         lat: 36.589, lng: -89.341, delta:0.11, zoom:12, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=36.589,-89.341&z=12' },
    { id:'a_1', title:'Farm Island, Maine',        sub:'USA',         lat: 45.729, lng: -69.769, delta:0.22, rotation: 20, zoom:11, date:'2024-02-18', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=45.729,-69.769&z=11' },
    { id:'a_2', title:'Lake Guakhmaz, Azerbaijan', sub:'Azerbaijan',  lat: 40.664, lng:  47.110, delta:0.22, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/tnrVaiMuFiGacH746' },
    { id:'a_3', title:'Yukon Delta, Alaska',       sub:'USA',         lat: 62.555, lng:-164.936, delta:0.80, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/AuARuTMTcT2ugLnq5' },
    { id:'a_4', title:'Lake Mjøsa, Norway',        sub:'Norway',      lat: 60.764, lng:  10.945, delta:0.80, zoom: 9, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/2KHYmEMruQzgRTBb9' }
  ],
  b: [
    { id:'b_0', title:'Holla Bend, Arkansas',      sub:'USA',         lat: 35.145, lng: -93.055, delta:0.10, zoom:12, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=35.145,-93.055&z=12' },
    { id:'b_1', title:'Humaitá, Brazil',            sub:'Brazil',      lat: -7.617, lng: -62.921, delta:0.10, zoom:12, date:'2023-07-06', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/BpsMZRtaDWr6jb9W8' }
  ],
  c: [
    { id:'c_0', title:'Black Rock Desert, Nevada', sub:'USA',         lat: 40.788, lng:-119.204, delta:0.50, zoom:10, date:'2024-09-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=40.788,-119.204&z=10' },
    { id:'c_1', title:'Deception Island, Antarctica', sub:'Antarctica', lat:-62.956, lng: -60.642, delta:0.30, zoom:11, date:'2024-01-15', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-62.956,-60.642&z=11' },
    { id:'c_2', title:'False River, Louisiana',    sub:'USA',         lat: 30.644, lng: -91.446, delta:0.15, zoom:12, date:'2024-06-14', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=30.644,-91.446&z=12' }
  ],
  d: [
    { id:'d_0', title:'Akimiski Island, Canada',   sub:'Canada',      lat: 53.016, lng: -81.307, delta:1.00, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=53.016,-81.307&z=9' },
    { id:'d_1', title:'Lake Tandou, Australia',    sub:'Australia',   lat:-32.621, lng: 142.073, delta:0.30, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/z3kPn1HxZUxS4FMCA' }
  ],
  e: [
    { id:'e_0', title:'Firn-filled Fjords, Tibet', sub:'China',       lat: 29.263, lng:  96.318, delta:0.50, zoom:10, date:'2024-10-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=29.263,96.318&z=10' },
    { id:'e_1', title:'Sea of Okhotsk',            sub:'Russia',      lat: 54.714, lng: 136.572, delta:0.30, zoom:11, date:'2024-03-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=54.714,136.572&z=11' },
    { id:'e_2', title:'Bellona Plateau',           sub:'Pacific Ocean',lat:-20.500, lng: 158.500, delta:0.80, zoom: 9, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-20.5,158.5&z=9' },
    { id:'e_3', title:'Breiðamerkurjökull Glacier',sub:'Iceland',     lat: 64.096, lng: -16.363, delta:0.40, zoom:10, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/6xoCUtSu99xvXZ8S6' }
  ],
  f: [
    { id:'f_0', title:'Mato Grosso, Brazil',       sub:'Brazil',      lat:-13.841, lng: -55.299, delta:0.15, zoom:12, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/tXas4c27VuWi2pwk6' },
    { id:'f_1', title:'Kruger National Park',      sub:'South Africa',lat:-28.734, lng:  29.208, delta:0.20, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/a1UArynvAqGGYMXg6' }
  ],
  g: [
    { id:'g_0', title:'Fonte Boa, Amazonas',       sub:'Brazil',      lat: -2.442, lng: -66.279, delta:0.20, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-2.442,-66.279&z=11' }
  ],
  h: [
    { id:'h_0', title:'Southwestern Kyrgyzstan',   sub:'Kyrgyzstan',  lat: 40.234, lng:  71.240, delta:0.40, zoom:10, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/gRTJ6rDiiXJhT1mD9' },
    { id:'h_1', title:'Khorinsky District, Russia',sub:'Russia',      lat: 52.047, lng: 109.781, delta:0.30, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/TLEGWnEGY8P3HUri9' }
  ],
  i: [
    { id:'i_0', title:'Borgarbyggð, Iceland',      sub:'Iceland',     lat: 64.763, lng: -22.458, delta:0.25, zoom:11, date:'2024-03-28', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=64.763,-22.458&z=11' },
    { id:'i_1', title:'Canandaigua Lake, New York', sub:'USA',        lat: 42.786, lng: -77.716, delta:0.35, zoom:11, date:'2024-04-26', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/jNsDTfUadwb8jBVL6' },
    { id:'i_2', title:'Etosha National Park',      sub:'Namibia',     lat:-18.488, lng:  16.171, delta:1.50, zoom: 8, date:'2024-09-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/s6ujVrXGJKnbrppH7' },
    { id:'i_3', title:'Djebel Ouarkziz, Morocco',  sub:'Morocco',     lat: 28.300, lng: -10.566, delta:0.25, zoom:11, date:'2024-04-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/osEU3NnVtShw6CBN9' },
    { id:'i_4', title:'Holuhraun Ice Field, Iceland',sub:'Iceland',   lat: 64.853, lng: -16.827, delta:0.25, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/ys3A1PGKvF6MCGWP7' }
  ],
  j: [
    { id:'j_0', title:'Great Barrier Reef',        sub:'Australia',   lat:-18.349, lng: 146.848, delta:0.30, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-18.349,146.848&z=11' },
    { id:'j_1', title:'Karakaya Dam, Turkey',      sub:'Turkey',      lat: 38.494, lng:  38.444, delta:0.25, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=38.494,38.444&z=11' },
    { id:'j_2', title:'Lake Superior',             sub:'North America',lat: 46.686, lng: -90.386, delta:0.80, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/PFWzBnFTCXwpGDKJ8' }
  ],
  k: [
    { id:'k_0', title:'Sirmilik National Park',    sub:'Canada',      lat: 72.084, lng: -76.812, delta:0.50, zoom:10, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=72.084,-76.812&z=10' },
    { id:'k_1', title:'Golmud, China',             sub:'China',       lat: 35.613, lng:  95.063, delta:0.30, zoom:11, date:'2024-09-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/UweKoxYbPbz1xbY38' }
  ],
  l: [
    { id:'l_0', title:'Nusantara, Indonesia',      sub:'Indonesia',   lat: -0.972, lng: 116.700, delta:0.10, zoom:12, date:'2024-06-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-0.972,116.700&z=12' },
    { id:'l_1', title:'Xinjiang, China',            sub:'China',       lat: 40.067, lng:  77.667, delta:0.40, zoom:10, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=40.067,77.667&z=10' },
    { id:'l_2', title:'Regina, Saskatchewan',      sub:'Canada',      lat: 50.198, lng:-104.288, delta:0.20, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/iVppLmYh44QxDr9c9' },
    { id:'l_3', title:'Regina area, Saskatchewan', sub:'Canada',      lat: 50.212, lng:-104.727, delta:0.20, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/Aa6mwzvmMJXRw3Gf8' }
  ],
  m: [
    { id:'m_0', title:'Shenandoah River, Virginia',sub:'USA',         lat: 38.776, lng: -78.402, delta:0.20, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=38.776,-78.402&z=11' },
    { id:'m_1', title:'Potomac River',             sub:'USA',         lat: 39.500, lng: -78.100, delta:0.20, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=39.5,-78.1&z=11' },
    { id:'m_2', title:'Tian Shan Mountains',       sub:'Kyrgyzstan',  lat: 42.121, lng:  80.046, delta:0.40, zoom:10, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/Ja3ZAHeuTNCRNFMN9' }
  ],
  n: [
    { id:'n_0', title:'Yapacani River, Bolivia',   sub:'Bolivia',     lat:-17.308, lng: -63.889, delta:0.20, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/5rXL3mESWj2YsTWj6' },
    { id:'n_1', title:'Yapacani River, Bolivia',   sub:'Bolivia',     lat:-17.100, lng: -63.700, delta:0.20, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/5rXL3mESWj2YsTWj6' },
    { id:'n_2', title:'São Miguel do Araguaia',    sub:'Brazil',      lat:-12.946, lng: -50.495, delta:0.20, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/1HtmMe82x2XdabT99' }
  ],
  o: [
    { id:'o_0', title:'Crater Lake, Oregon',       sub:'USA',         lat: 42.936, lng:-122.101, delta:0.15, zoom:12, date:'2024-08-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/S9sJeZ6iHBVJuGu37' },
    { id:'o_1', title:'Manicouagan Reservoir',     sub:'Canada',      lat: 51.378, lng: -68.674, delta:0.80, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/E6Rn3yeQkYuagviG7' }
  ],
  p: [
    { id:'p_0', title:'Mackenzie River Delta',     sub:'Canada',      lat: 68.215, lng:-134.388, delta:1.00, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=68.215,-134.388&z=9' },
    { id:'p_1', title:'Riberalta, Bolivia',        sub:'Bolivia',     lat:-10.879, lng: -66.048, delta:0.20, zoom:11, date:'2022-06-24', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/sW32pDeYpN3JQQT18' }
  ],
  q: [
    { id:'q_0', title:'Lonar Crater, India',       sub:'India',       lat: 19.977, lng:  76.508, delta:0.10, zoom:12, date:'2024-11-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/vNSZuSEAV22k2UScA' },
    { id:'q_1', title:'Mount Tambora, Indonesia',  sub:'Indonesia',   lat: -8.242, lng: 117.992, delta:0.20, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/1KcvrspMtYDs1qSi8' }
  ],
  r: [
    { id:'r_0', title:'Lago Menéndez, Argentina',  sub:'Argentina',   lat:-42.688, lng: -71.873, delta:0.50, zoom:10, date:'2024-02-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-42.688,-71.873&z=10' },
    { id:'r_1', title:'Province of Sondrio, Italy',sub:'Italy',       lat: 46.294, lng:   9.421, delta:0.30, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/MDCo37rLRQGCvDJp8' },
    { id:'r_2', title:'Florida Keys',              sub:'USA',         lat: 24.758, lng: -81.532, delta:0.20, zoom:11, date:'2024-03-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/CfSnUcNriFtWBrEQ8' },
    { id:'r_3', title:'Canyonlands National Park', sub:'USA',         lat: 38.441, lng:-109.751, delta:0.20, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/Bt89EafENbXXLmPPA' }
  ],
  s: [
    { id:'s_0', title:'Mackenzie River, Canada',   sub:'Canada',      lat: 68.417, lng:-134.143, delta:0.30, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=68.417,-134.143&z=11' },
    { id:'s_1', title:"N'Djamena, Chad",           sub:'Chad',        lat: 12.008, lng:  15.063, delta:0.20, zoom:11, date:'2024-11-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=12.008,15.063&z=11' },
    { id:'s_2', title:'Rio Chapare, Bolivia',      sub:'Bolivia',     lat:-16.935, lng: -65.229, delta:0.03, zoom:14, date:'2023-06-20', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/MRR8oJSdDTTBVP4z5' }
  ],
  t: [
    { id:'t_0', title:'Liwa, United Arab Emirates',sub:'UAE',         lat: 23.175, lng:  53.798, delta:0.40, zoom:10, date:'2024-03-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=23.175,53.798&z=10' },
    { id:'t_1', title:'Lena River Delta',          sub:'Russia',      lat: 72.878, lng: 129.531, delta:1.20, zoom: 9, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=72.878,129.531&z=9' }
  ],
  u: [
    { id:'u_0', title:'Canyonlands National Park', sub:'USA',         lat: 38.269, lng:-109.926, delta:0.15, zoom:12, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=38.269,-109.926&z=12' },
    { id:'u_1', title:'Bamforth NWR, Wyoming',     sub:'USA',         lat: 41.324, lng:-105.771, delta:0.20, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=41.324,-105.771&z=11' }
  ],
  v: [
    { id:'v_0', title:'Cellina & Meduna Rivers',   sub:'Italy',       lat: 46.111, lng:  12.757, delta:0.30, zoom:11, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=46.111,12.757&z=11' },
    { id:'v_1', title:'New South Wales, Australia',sub:'Australia',   lat:-34.286, lng: 150.826, delta:0.25, zoom:11, date:'2024-02-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/fxE1ik8qzdANidxT8' },
    { id:'v_2', title:'Padma River, Bangladesh',   sub:'Bangladesh',  lat: 23.351, lng:  90.552, delta:0.30, zoom:11, date:'2024-11-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/sYQHYd8exhDsr5SQ7' },
    { id:'v_3', title:'Mapleton, Maine',           sub:'USA',         lat: 46.544, lng: -68.252, delta:0.10, zoom:12, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/8LF7PAqxNbS6egPMA' }
  ],
  w: [
    { id:'w_0', title:'Ponoy River, Russia',       sub:'Russia',      lat: 67.036, lng:  40.339, delta:0.30, zoom:11, date:'2024-07-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/z6n8HY91r7f4kv9G7' },
    { id:'w_1', title:'La Primavera, Colombia',    sub:'Colombia',    lat:  5.449, lng: -69.799, delta:0.20, zoom:11, date:'2024-01-15', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/fa5RwpEkAbZQU6d3A' }
  ],
  x: [
    { id:'x_0', title:'Wolstenholme Fjord',        sub:'Greenland',   lat: 76.734, lng: -68.606, delta:0.50, zoom:10, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=76.734,-68.606&z=10' },
    { id:'x_1', title:'Davis Strait, Greenland',   sub:'Greenland',   lat: 62.237, lng: -49.580, delta:0.50, zoom:10, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=62.237,-49.580&z=10' },
    { id:'x_2', title:'Sermersooq, Greenland',     sub:'Greenland',   lat: 66.618, lng: -36.368, delta:0.50, zoom:10, date:'2024-07-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/1P9vKFiCy3PkQSnY8' }
  ],
  y: [
    { id:'y_0', title:'Bíobío River, Chile',       sub:'Chile',       lat:-37.267, lng: -72.729, delta:0.20, zoom:11, date:'2024-02-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-37.267,-72.729&z=11' },
    { id:'y_1', title:'Estuario de Virrila, Peru', sub:'Peru',        lat: -5.865, lng: -80.731, delta:0.20, zoom:11, date:'2024-08-01', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-5.865,-80.731&z=11' },
    { id:'y_2', title:'Lake Pukaki, New Zealand',  sub:'New Zealand', lat:-43.522, lng: 170.832, delta:0.20, zoom:11, date:'2024-02-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/vNfFAsk4VFF6pnTo7' }
  ],
  z: [
    { id:'z_0', title:'Primavera do Leste, Brazil',sub:'Brazil',      lat:-15.494, lng: -54.341, delta:0.15, zoom:12, date:'2024-06-29', layer:'1_TRUE_COLOR', maps:'https://maps.google.com/maps?q=-15.494,-54.341&z=12' },
    { id:'z_1', title:'M\'Sila, Algeria',          sub:'Algeria',     lat: 34.989, lng:   4.389, delta:0.25, zoom:11, date:'2024-04-01', layer:'1_TRUE_COLOR', maps:'https://maps.app.goo.gl/iFZcewDgx7niUQCC9' }
  ]
};

// ============================================================
// Band composite configurations
// ============================================================
const COMPOSITES = {
  TRUE_COLOR: {
    label: 'True Color',
    description: 'Natural colour (B04 / B03 / B02)',
    layerId: '1_TRUE_COLOR',
    evalscript: `//VERSION=3
function setup(){return{input:["B04","B03","B02"],output:{bands:3}};}
function evaluatePixel(s){
  return[Math.min(1,3.5*s.B04),Math.min(1,3.5*s.B03),Math.min(1,3.5*s.B02)];
}`
  },
  FALSE_COLOR: {
    label: 'False Color (NIR)',
    description: 'Vegetation in red — B08 / B04 / B03',
    layerId: '2_FALSE_COLOR',
    evalscript: `//VERSION=3
function setup(){return{input:["B08","B04","B03"],output:{bands:3}};}
function evaluatePixel(s){
  return[Math.min(1,3.5*s.B08),Math.min(1,3.5*s.B04),Math.min(1,3.5*s.B03)];
}`
  },
  FALSE_COLOR_URBAN: {
    label: 'False Color Urban',
    description: 'Urban / bare soil — B12 / B11 / B04',
    layerId: '3_FALSE_COLOR_URBAN',
    evalscript: `//VERSION=3
function setup(){return{input:["B12","B11","B04"],output:{bands:3}};}
function evaluatePixel(s){
  return[Math.min(1,3.5*s.B12),Math.min(1,3.5*s.B11),Math.min(1,3.5*s.B04)];
}`
  },
  SWIR: {
    label: 'Short-Wave Infrared',
    description: 'Fire / burned areas — B12 / B8A / B04',
    layerId: 'SWIR',
    evalscript: `//VERSION=3
function setup(){return{input:["B12","B8A","B04"],output:{bands:3}};}
function evaluatePixel(s){
  return[Math.min(1,3.5*s.B12),Math.min(1,3.5*s.B8A),Math.min(1,3.5*s.B04)];
}`
  },
  GEOLOGY: {
    label: 'Geology',
    description: 'Rock / mineral mapping — B12 / B04 / B02',
    layerId: 'GEOLOGY',
    evalscript: `//VERSION=3
function setup(){return{input:["B12","B04","B02"],output:{bands:3}};}
function evaluatePixel(s){
  return[Math.min(1,3.5*s.B12),Math.min(1,3.5*s.B04),Math.min(1,3.5*s.B02)];
}`
  },
  NDVI: {
    label: 'NDVI (Vegetation)',
    description: 'Green = healthy vegetation',
    layerId: '4_FALSE_COLOR',
    evalscript: `//VERSION=3
function setup(){return{input:["B08","B04"],output:{bands:3}};}
function evaluatePixel(s){
  var ndvi=(s.B08-s.B04)/(s.B08+s.B04+1e-10);
  var r=ndvi<0?Math.abs(ndvi):0;
  var g=ndvi>0?ndvi:0;
  return[Math.min(1,Math.max(0,r)),Math.min(1,Math.max(0,g)),0];
}`
  }
};

// ============================================================
// Helper: compute bounding box from centre + delta
// Returns [minLng, minLat, maxLng, maxLat]
// ============================================================
function computeBbox(lat, lng, delta) {
  const lngDelta = delta / Math.cos(lat * Math.PI / 180);
  return [
    parseFloat((lng - lngDelta).toFixed(6)),
    parseFloat((lat - delta).toFixed(6)),
    parseFloat((lng + lngDelta).toFixed(6)),
    parseFloat((lat + delta).toFixed(6))
  ];
}

// ============================================================
// Build Copernicus Browser share URL
// ============================================================
function copernicusUrl(cfg) {
  const from = cfg.date + 'T00:00:00.000Z';
  const to   = cfg.date + 'T23:59:59.999Z';
  return `https://browser.dataspace.copernicus.eu/?zoom=${cfg.zoom}&lat=${cfg.lat}&lng=${cfg.lng}` +
         `&datasetId=S2L2A&fromTime=${encodeURIComponent(from)}&toTime=${encodeURIComponent(to)}` +
         `&layerId=${cfg.layer}`;
}
