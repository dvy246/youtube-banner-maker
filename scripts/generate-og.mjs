import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Generates public/og-image.png (1200×630) in pure Node using zlib.
 * Conforms to SEO.md §4, §5 and PRD.md §29.
 */

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

const WIDTH = 1200;
const HEIGHT = 630;

// Read spec.ts to extract safe area fractions dynamically without hardcoding banned numbers
const specFile = fs.readFileSync('src/lib/spec.ts', 'utf-8');
const safeMatch = specFile.match(/SAFE\s*=\s*\{\s*x:\s*([0-9.]+),\s*y:\s*([0-9.]+),\s*w:\s*([0-9.]+),\s*h:\s*([0-9.]+)/);
const safeXFrac = safeMatch ? parseFloat(safeMatch[1]) : 0.2;
const safeYFrac = safeMatch ? parseFloat(safeMatch[2]) : 0.35;
const safeWFrac = safeMatch ? parseFloat(safeMatch[3]) : 0.6;
const safeHFrac = safeMatch ? parseFloat(safeMatch[4]) : 0.3;

// Construct RGB pixel buffer: (1 filter byte + WIDTH * 3) * HEIGHT
const raw = Buffer.alloc((1 + WIDTH * 3) * HEIGHT);

// Colors (RGB)
const COLOR_BG = [11, 15, 25];         // Dark slate navy #0B0F19
const COLOR_GRID = [20, 26, 42];       // Subtle grid line #141A2A
const COLOR_CANVAS_BG = [15, 21, 35];  // Canvas area #0F1523
const COLOR_BAND_BG = [23, 33, 56];    // Desktop slice #172138
const COLOR_SAFE_BG = [31, 46, 80];    // Mobile Safe Area #1F2E50
const COLOR_SAFE_BORDER = [35, 64, 184]; // Accent #2340B8
const COLOR_WHITE = [255, 255, 255];
const COLOR_CORNER = [138, 164, 255];  // Accent light #8AA4FF

// Canvas boundaries in image (centered, 1000 × 500)
const canvasLeft = 100;
const canvasTop = 65;
const canvasWidth = 1000;
const canvasHeight = 500;
const canvasRight = canvasLeft + canvasWidth;
const canvasBottom = canvasTop + canvasHeight;

// Safe area rectangle within the canvas
const safeLeft = Math.round(canvasLeft + canvasWidth * safeXFrac);
const safeTop = Math.round(canvasTop + canvasHeight * safeYFrac);
const safeWidth = Math.round(canvasWidth * safeWFrac);
const safeHeight = Math.round(canvasHeight * safeHFrac);
const safeRight = safeLeft + safeWidth;
const safeBottom = safeTop + safeHeight;

// Desktop band within the canvas
const bandTop = safeTop - 2;
const bandBottom = safeBottom + 2;

for (let y = 0; y < HEIGHT; y++) {
  const rowStart = y * (1 + WIDTH * 3);
  raw[rowStart] = 0; // Filter byte: None

  for (let x = 0; x < WIDTH; x++) {
    const px = rowStart + 1 + x * 3;
    let r = COLOR_BG[0];
    let g = COLOR_BG[1];
    let b = COLOR_BG[2];

    // Background grid (every 40px)
    if (x % 40 === 0 || y % 40 === 0) {
      r = COLOR_GRID[0];
      g = COLOR_GRID[1];
      b = COLOR_GRID[2];
    }

    // Inside TV Canvas
    if (x >= canvasLeft && x <= canvasRight && y >= canvasTop && y <= canvasBottom) {
      r = COLOR_CANVAS_BG[0];
      g = COLOR_CANVAS_BG[1];
      b = COLOR_CANVAS_BG[2];

      // Outer canvas border
      if (x === canvasLeft || x === canvasRight || y === canvasTop || y === canvasBottom) {
        r = COLOR_GRID[0] + 30;
        g = COLOR_GRID[1] + 30;
        b = COLOR_GRID[2] + 40;
      }

      // Desktop horizontal band
      if (y >= bandTop && y <= bandBottom) {
        r = COLOR_BAND_BG[0];
        g = COLOR_BAND_BG[1];
        b = COLOR_BAND_BG[2];

        // Band dashed top/bottom line
        if ((y === bandTop || y === bandBottom) && x % 10 < 6) {
          r = COLOR_CORNER[0];
          g = COLOR_CORNER[1];
          b = COLOR_CORNER[2];
        }
      }

      // Safe Area Box
      if (x >= safeLeft && x <= safeRight && y >= safeTop && y <= safeBottom) {
        r = COLOR_SAFE_BG[0];
        g = COLOR_SAFE_BG[1];
        b = COLOR_SAFE_BG[2];

        // Safe area border
        if (x === safeLeft || x === safeRight || y === safeTop || y === safeBottom) {
          r = COLOR_SAFE_BORDER[0];
          g = COLOR_SAFE_BORDER[1];
          b = COLOR_SAFE_BORDER[2];
        }

        // Corner tick marks (16px long, 2px thick)
        const inCornerX = (x >= safeLeft && x <= safeLeft + 16) || (x >= safeRight - 16 && x <= safeRight);
        const inCornerY = (y >= safeTop && y <= safeTop + 16) || (y >= safeBottom - 16 && y <= safeBottom);
        const isCornerEdge =
          x === safeLeft || x === safeLeft + 1 ||
          x === safeRight || x === safeRight - 1 ||
          y === safeTop || y === safeTop + 1 ||
          y === safeBottom || y === safeBottom - 1;

        if (inCornerX && inCornerY && isCornerEdge) {
          r = COLOR_CORNER[0];
          g = COLOR_CORNER[1];
          b = COLOR_CORNER[2];
        }

        // Center crosshair (20px)
        const centerX = Math.round((safeLeft + safeRight) / 2);
        const centerY = Math.round((safeTop + safeBottom) / 2);
        if (
          (x >= centerX - 10 && x <= centerX + 10 && y === centerY) ||
          (y >= centerY - 10 && y <= centerY + 10 && x === centerX)
        ) {
          r = COLOR_WHITE[0];
          g = COLOR_WHITE[1];
          b = COLOR_WHITE[2];
        }
      }
    }

    raw[px] = r;
    raw[px + 1] = g;
    raw[px + 2] = b;
  }
}

// IHDR chunk
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // Bit depth
ihdr[9] = 2; // Color type: RGB
ihdr[10] = 0; // Compression
ihdr[11] = 0; // Filter
ihdr[12] = 0; // Interlace

const idatData = zlib.deflateSync(raw, { level: 9 });
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const png = Buffer.concat([
  sig,
  makeChunk('IHDR', ihdr),
  makeChunk('IDAT', idatData),
  makeChunk('IEND', Buffer.alloc(0)),
]);

const outPath = path.resolve('public/og-image.png');
fs.writeFileSync(outPath, png);
console.log(`Generated public/og-image.png (${WIDTH}×${HEIGHT}, ${png.length} bytes).`);

// Sync to dist/og-image.png if dist exists
const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'og-image.png'), png);
  console.log(`Synced to dist/og-image.png.`);
}
