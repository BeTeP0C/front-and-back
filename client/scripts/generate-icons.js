const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const APPLE_SIZE = 180;
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');

function createSvg(size) {
  const fontSize = Math.round(size * 0.35);
  const radius = Math.round(size * 0.15);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="#0f0f1a"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d9ff"/>
      <stop offset="100%" stop-color="#00ff88"/>
    </linearGradient>
  </defs>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="Arial,Helvetica,sans-serif" font-weight="700"
    font-size="${fontSize}" fill="url(#g)">TS</text>
</svg>`);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const size of SIZES) {
    const svg = createSvg(size);
    await sharp(svg).resize(size, size).png().toFile(path.join(OUT_DIR, `icon-${size}x${size}.png`));
    console.log(`icon-${size}x${size}.png`);
  }

  const appleSvg = createSvg(APPLE_SIZE);
  await sharp(appleSvg).resize(APPLE_SIZE, APPLE_SIZE).png().toFile(path.join(OUT_DIR, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png');

  const faviconSvg = createSvg(32);
  await sharp(faviconSvg).resize(32, 32).png().toFile(path.join(OUT_DIR, 'favicon-32x32.png'));
  console.log('favicon-32x32.png');

  console.log('\nAll icons generated.');
}

main().catch(console.error);
