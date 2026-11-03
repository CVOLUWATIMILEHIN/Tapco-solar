const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Vector Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="tapcoNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E3A75" />
      <stop offset="100%" stop-color="#061C38" />
    </linearGradient>
    <linearGradient id="tapcoSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- High-contrast rounded shield for maximum clarity in both dark & light browser tabs -->
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#tapcoNavyGrad)" stroke="#F59E0B" stroke-width="4" />
  
  <!-- Renewable green accent arc -->
  <path d="M 92 6 A 26 26 0 0 1 122 36" stroke="#00A651" stroke-width="6" fill="none" stroke-linecap="round" />

  <!-- TAPCO Solar Sunrise & Panel Geometry -->
  <g transform="translate(14, 14)">
    <!-- Golden Sun Dome -->
    <path d="M 32 50.8 A 18 18 0 0 1 68 50.8 Z" fill="url(#tapcoSunGrad)" />

    <!-- 7 Radial Sunbeams -->
    <polygon points="9,45 21,41 21,49" fill="#FBBF24" />
    <polygon points="15,31 25,29 27,36" fill="#FBBF24" />
    <polygon points="30,16 37,19 41,25" fill="#FBBF24" />
    <polygon points="50,8 45,18 55,18" fill="#FBBF24" />
    <polygon points="70,16 59,25 63,19" fill="#FBBF24" />
    <polygon points="85,31 73,36 75,29" fill="#FBBF24" />
    <polygon points="91,45 79,49 79,41" fill="#FBBF24" />

    <!-- 3x3 Solar Panel Matrix -->
    <!-- Row 1 -->
    <polygon points="32.8,51.5 43.2,51.5 41.8,60.2 28.6,60.2" fill="#38BDF8" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="44.8,51.5 55.2,51.5 56.6,60.2 43.4,60.2" fill="#38BDF8" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="56.8,51.5 67.2,51.5 71.4,60.2 58.2,60.2" fill="#38BDF8" stroke="#0A2F5C" stroke-width="1.2" />

    <!-- Row 2 -->
    <polygon points="28.4,61.8 41.8,61.8 40.2,71.7 23.9,71.7" fill="#0284C7" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="43.4,61.8 56.6,61.8 58.2,71.7 41.8,71.7" fill="#0284C7" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="58.2,61.8 71.6,61.8 76.1,71.7 59.8,71.7" fill="#0284C7" stroke="#0A2F5C" stroke-width="1.2" />

    <!-- Row 3 -->
    <polygon points="23.7,73.3 40.2,73.3 38.5,84.5 18.8,84.5" fill="#0369A1" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="41.8,73.3 58.2,73.3 59.9,84.5 40.1,84.5" fill="#0369A1" stroke="#0A2F5C" stroke-width="1.2" />
    <polygon points="59.8,73.3 76.3,73.3 81.2,84.5 61.5,84.5" fill="#0369A1" stroke="#0A2F5C" stroke-width="1.2" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');

// 2. Full Horizontal Brand Logo SVG (Icon + Typography)
const tapcoLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 90" fill="none">
  <!-- Brand Icon -->
  <g transform="translate(5, 5) scale(0.8)">
    <rect width="100" height="100" rx="20" fill="#0A2F5C" />
    <!-- Sun Dome -->
    <path d="M 32 50.8 A 18 18 0 0 1 68 50.8 Z" fill="#F59E0B" />
    <!-- Sunbeams -->
    <polygon points="9,45 21,41 21,49" fill="#F59E0B" />
    <polygon points="15,31 25,29 27,36" fill="#F59E0B" />
    <polygon points="30,16 37,19 41,25" fill="#F59E0B" />
    <polygon points="50,8 45,18 55,18" fill="#F59E0B" />
    <polygon points="70,16 59,25 63,19" fill="#F59E0B" />
    <polygon points="85,31 73,36 75,29" fill="#F59E0B" />
    <polygon points="91,45 79,49 79,41" fill="#F59E0B" />
    <!-- Solar Cells -->
    <polygon points="32.8,50.8 43.2,50.8 41.8,59.7 28.6,59.7" fill="#38BDF8" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="44.8,50.8 55.2,50.8 56.6,59.7 43.4,59.7" fill="#38BDF8" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="56.8,50.8 67.2,50.8 71.4,59.7 58.2,59.7" fill="#38BDF8" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="28.4,61.3 41.8,61.3 40.2,71.4 23.9,71.4" fill="#0284C7" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="43.4,61.3 56.6,61.3 58.2,71.4 41.8,71.4" fill="#0284C7" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="58.2,61.3 71.6,61.3 76.1,71.4 59.8,71.4" fill="#0284C7" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="23.7,73.0 40.2,73.0 38.5,84.2 18.8,84.2" fill="#0369A1" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="41.8,73.0 58.2,73.0 59.9,84.2 40.1,84.2" fill="#0369A1" stroke="#0A2F5C" stroke-width="0.8" />
    <polygon points="59.8,73.0 76.3,73.0 81.2,84.2 61.5,84.2" fill="#0369A1" stroke="#0A2F5C" stroke-width="0.8" />
  </g>
  
  <!-- Typography -->
  <text x="100" y="38" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" fill="#0A2F5C" letter-spacing="1">TAPCO</text>
  <text x="205" y="38" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="28" fill="#F59E0B" letter-spacing="1">SOLAR</text>
  <text x="100" y="58" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="12" fill="#00A651" letter-spacing="3">ENERGY SOLUTIONS</text>
  <text x="100" y="74" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="10" fill="#64748B" letter-spacing="1">Engineering • Powerwalls • Academy</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'tapco-logo.svg'), tapcoLogoSvg, 'utf8');

// 3. OpenGraph Social Share Card Image (SVG & high res)
const ogBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071933" />
      <stop offset="50%" stop-color="#0A2F5C" />
      <stop offset="100%" stop-color="#041226" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="textSun" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>

  <!-- Deep Solar Navy Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <circle cx="1000" cy="150" r="350" fill="url(#sunGlow)" />
  <circle cx="200" cy="500" r="280" fill="url(#sunGlow)" />

  <!-- Top Accent Bar -->
  <rect x="0" y="0" width="1200" height="8" fill="#F59E0B" />

  <!-- Inner Content Card -->
  <g transform="translate(100, 100)">
    <!-- Brand Mark -->
    <g transform="scale(1.7)">
      <rect width="100" height="100" rx="24" fill="#0E3A75" stroke="#F59E0B" stroke-width="3" />
      <path d="M 32 50.8 A 18 18 0 0 1 68 50.8 Z" fill="#F59E0B" />
      <polygon points="9,45 21,41 21,49" fill="#FBBF24" />
      <polygon points="15,31 25,29 27,36" fill="#FBBF24" />
      <polygon points="30,16 37,19 41,25" fill="#FBBF24" />
      <polygon points="50,8 45,18 55,18" fill="#FBBF24" />
      <polygon points="70,16 59,25 63,19" fill="#FBBF24" />
      <polygon points="85,31 73,36 75,29" fill="#FBBF24" />
      <polygon points="91,45 79,49 79,41" fill="#FBBF24" />
      <polygon points="32.8,50.8 43.2,50.8 41.8,59.7 28.6,59.7" fill="#38BDF8" />
      <polygon points="44.8,50.8 55.2,50.8 56.6,59.7 43.4,59.7" fill="#38BDF8" />
      <polygon points="56.8,50.8 67.2,50.8 71.4,59.7 58.2,59.7" fill="#38BDF8" />
      <polygon points="28.4,61.3 41.8,61.3 40.2,71.4 23.9,71.4" fill="#0284C7" />
      <polygon points="43.4,61.3 56.6,61.3 58.2,71.4 41.8,71.4" fill="#0284C7" />
      <polygon points="58.2,61.3 71.6,61.3 76.1,71.4 59.8,71.4" fill="#0284C7" />
      <polygon points="23.7,73.0 40.2,73.0 38.5,84.2 18.8,84.2" fill="#0369A1" />
      <polygon points="41.8,73.0 58.2,73.0 59.9,84.2 40.1,84.2" fill="#0369A1" />
      <polygon points="59.8,73.0 76.3,73.0 81.2,84.2 61.5,84.2" fill="#0369A1" />
    </g>

    <!-- Main Title -->
    <text x="210" y="80" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="54" fill="#FFFFFF">TAPCO <tspan fill="url(#textSun)">SOLAR</tspan></text>
    <text x="215" y="130" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="22" fill="#00A651" letter-spacing="4">ENERGY SOLUTIONS</text>
    
    <!-- Tagline & Value Prop -->
    <text x="0" y="240" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="42" fill="#FFFFFF">Nigeria's Premier Solar Engineering &amp; Powerwalls</text>
    <text x="0" y="295" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="24" fill="#94A3B8">Hybrid Inverter Systems • LiFePO4 Lithium Storage • Certified Training Academy</text>

    <!-- Chips / Badges -->
    <g transform="translate(0, 340)">
      <rect width="210" height="52" rx="16" fill="#0E3A75" stroke="#38BDF8" stroke-width="1.5" />
      <text x="105" y="32" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="#38BDF8" text-anchor="middle">⚡ 1kVA - 40kVA</text>

      <g transform="translate(230, 0)">
        <rect width="250" height="52" rx="16" fill="#0E3A75" stroke="#00A651" stroke-width="1.5" />
        <text x="125" y="32" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="#00A651" text-anchor="middle">✓ Tier-1 LiFePO4</text>
      </g>

      <g transform="translate(500, 0)">
        <rect width="260" height="52" rx="16" fill="#0E3A75" stroke="#F59E0B" stroke-width="1.5" />
        <text x="130" y="32" font-family="system-ui, sans-serif" font-weight="700" font-size="18" fill="#F59E0B" text-anchor="middle">🎓 Certified Academy</text>
      </g>

      <g transform="translate(780, 0)">
        <rect width="220" height="52" rx="16" fill="#F59E0B" />
        <text x="110" y="32" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#0A2F5C" text-anchor="middle">📞 09059375492</text>
      </g>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'og-image.svg'), ogBannerSvg, 'utf8');

// 4. Binary PNG generator for browser compatibility (favicon.ico, apple-touch-icon.png, android-chrome)
function createPng(width, height, getPixel) {
  const rowSize = width * 4 + 1;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0; // Filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const idx = y * rowSize + 1 + x * 4;
      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = a;
    }
  }
  const idatData = zlib.deflateSync(raw);
  
  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type);
    const crcVal = Buffer.alloc(4);
    const crc32 = zlib.crc32(Buffer.concat([t, data]));
    crcVal.writeUInt32BE(crc32 >>> 0, 0);
    return Buffer.concat([len, t, data, crcVal]);
  }
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    header,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate TAPCO pixel logo
function tapcoLogoShader(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dist = Math.hypot(nx - cx, ny - cy);

  // Rounded squircle border
  const cornerR = 0.22;
  const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerR));
  const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerR));
  const isOutside = Math.hypot(dx, dy) > cornerR;
  if (isOutside) return [0, 0, 0, 0]; // Transparent outside

  // Golden border stroke
  const isBorder = (Math.abs(Math.hypot(dx, dy) - cornerR) < 0.035) || 
                   (Math.hypot(dx, dy) <= cornerR && (nx < 0.04 || nx > 0.96 || ny < 0.04 || ny > 0.96));
  if (isBorder) {
    return [245, 158, 11, 255]; // #F59E0B Golden amber border
  }

  // Inside shield: Deep Navy background gradient
  const bgNavy = [
    Math.round(14 + (10 - 14) * ny),
    Math.round(58 + (47 - 58) * ny),
    Math.round(117 + (92 - 117) * ny),
    255
  ];

  // Sun dome (upper center: cx=0.5, cy=0.48, radius=0.20, y <= 0.48)
  const sunDx = nx - 0.5;
  const sunDy = ny - 0.49;
  const sunDist = Math.hypot(sunDx, sunDy);
  if (sunDist <= 0.22 && ny <= 0.49) {
    // Golden sun dome
    return [245, 158, 11, 255];
  }

  // Sun rays (simple radial rays when in upper hemisphere)
  if (ny < 0.49 && sunDist > 0.24 && sunDist < 0.38) {
    const angle = Math.atan2(sunDy, sunDx); // -PI to 0
    // Check 7 discrete ray directions
    const rayAngles = [-Math.PI * 0.92, -Math.PI * 0.77, -Math.PI * 0.62, -Math.PI * 0.5, -Math.PI * 0.38, -Math.PI * 0.23, -Math.PI * 0.08];
    for (const ra of rayAngles) {
      if (Math.abs(angle - ra) < 0.065) {
        return [251, 191, 36, 255]; // #FBBF24
      }
    }
  }

  // Solar Panel perspective grid (lower half: ny between 0.52 and 0.86, nx between 0.22 and 0.78)
  if (ny >= 0.51 && ny <= 0.85) {
    const rowProgress = (ny - 0.51) / 0.34; // 0 to 1
    const halfWidth = 0.22 + 0.14 * rowProgress; // wider towards bottom for 3D perspective
    if (Math.abs(nx - 0.5) <= halfWidth) {
      // Cell borders (lines)
      const colNorm = (nx - (0.5 - halfWidth)) / (2 * halfWidth);
      const isColLine = Math.abs(colNorm - 0.33) < 0.02 || Math.abs(colNorm - 0.66) < 0.02 || colNorm < 0.02 || colNorm > 0.98;
      const isRowLine = Math.abs(rowProgress - 0.33) < 0.03 || Math.abs(rowProgress - 0.66) < 0.03 || rowProgress < 0.02 || rowProgress > 0.98;

      if (isColLine || isRowLine) {
        return [10, 47, 92, 255]; // Deep navy border between cells
      }
      // Solar Cell Blue
      const blueLevel = 248 - Math.round(rowProgress * 40);
      return [56, Math.round(189 - rowProgress * 50), blueLevel, 255];
    }
  }

  return bgNavy;
}

// Write PNG icons
console.log('Generating PNG icons...');
const png32 = createPng(32, 32, tapcoLogoShader);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);

const png16 = createPng(16, 16, tapcoLogoShader);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);

const png180 = createPng(180, 180, tapcoLogoShader);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

const png192 = createPng(192, 192, tapcoLogoShader);
fs.writeFileSync(path.join(publicDir, 'android-chrome-192x192.png'), png192);

const png512 = createPng(512, 512, tapcoLogoShader);
fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), png512);

// Standard Multi-resolution ICO (containing 16x16 and 32x32 PNGs)
function createIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let offset = 6 + (16 * pngBuffers.length);
  const dirEntries = [];
  
  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Palette colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(b => b.buffer)
  ]);
}

const ico = createIco([
  { width: 16, height: 16, buffer: png16 },
  { width: 32, height: 32, buffer: png32 }
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);

// 5. Web App Manifest
const webManifest = {
  name: "TAPCO SOLAR Energy Solutions",
  short_name: "TAPCO SOLAR",
  description: "Nigeria's Leading Solar Engineering & Clean Energy Platform",
  icons: [
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable"
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ],
  theme_color: "#0A2F5C",
  background_color: "#0A2F5C",
  display: "standalone",
  start_url: "/"
};
fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(webManifest, null, 2), 'utf8');

console.log('✓ Successfully created all brand assets in /public:');
console.log(fs.readdirSync(publicDir));
