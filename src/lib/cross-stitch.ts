/**
 * Cross-Stitch Embroidery Typography Engine
 * Renders authentic pixel needlepoint cross-stitches with thread relief and subtle drop shadow.
 */

export const CROSS_STITCH_GLYPHS: Record<string, string[]> = {
  // Lowercase (matches the authentic retro embroidery aesthetic)
  a: ['.....', '.....', '.xxx.', 'x...x', 'x...x', 'xxxxx', 'x...x', 'x...x'],
  b: ['x....', 'x....', 'xxxx.', 'x...x', 'x...x', 'x...x', 'xxxx.'],
  c: ['.....', '.....', '.xxxx', 'x....', 'x....', 'x....', '.xxxx'],
  d: ['....x', '....x', '.xxxx', 'x...x', 'x...x', 'x...x', '.xxxx'],
  e: ['.....', '.....', '.xxx.', 'x...x', 'xxxxx', 'x....', '.xxxx'],
  f: ['..xx.', '..x..', '.xxxx', '..x..', '..x..', '..x..', '..x..'],
  g: ['.....', '.....', '.xxxx', 'x...x', 'x...x', '.xxxx', '....x', '.xxx.'],
  h: ['x....', 'x....', 'xxxx.', 'x...x', 'x...x', 'x...x', 'x...x'],
  i: ['x', '.', 'x', 'x', 'x', 'x', 'x'],
  j: ['..x', '...', '..x', '..x', '..x', '..x', 'x.x', '.x.'],
  k: ['x....', 'x....', 'x..x.', 'x.x..', 'xx...', 'x.x..', 'x..x.'],
  l: ['x', 'x', 'x', 'x', 'x', 'x', 'x'],
  m: ['.....', '.....', 'xx.xx', 'x.x.x', 'x.x.x', 'x.x.x', 'x.x.x'],
  n: ['.....', '.....', 'xxxx.', 'x...x', 'x...x', 'x...x', 'x...x'],
  o: ['.....', '.....', '.xxx.', 'x...x', 'x...x', 'x...x', '.xxx.'],
  p: ['.....', '.....', 'xxxx.', 'x...x', 'xxxx.', 'x....', 'x....'],
  q: ['.....', '.....', '.xxxx', 'x...x', '.xxxx', '....x', '....x'],
  r: ['.....', '.....', 'x.xx.', 'xx..x', 'x....', 'x....', 'x....'],
  s: ['.....', '.....', '.xxxx', 'x....', '.xxx.', '....x', 'xxxx.'],
  t: ['..x..', '..x..', '.xxx.', '..x..', '..x..', '..x..', '...xx'],
  u: ['.....', '.....', 'x...x', 'x...x', 'x...x', 'x...x', '.xxxx'],
  v: ['.....', '.....', 'x...x', 'x...x', '.x.x.', '.x.x.', '..x..'],
  w: ['.....', '.....', 'x...x', 'x.x.x', 'x.x.x', 'x.x.x', '.x.x.'],
  x: ['.....', '.....', 'x...x', '.x.x.', '..x..', '.x.x.', 'x...x'],
  y: ['.....', '.....', 'x...x', 'x...x', '.xxxx', '....x', '.xxx.'],
  z: ['.....', '.....', 'xxxxx', '...x.', '..x..', '.x...', 'xxxxx'],

  // Uppercase
  A: ['.xxx.', 'x...x', 'x...x', 'xxxxx', 'x...x', 'x...x', 'x...x'],
  B: ['xxxx.', 'x...x', 'xxxx.', 'x...x', 'x...x', 'xxxx.'],
  C: ['.xxxx', 'x....', 'x....', 'x....', 'x....', '.xxxx'],
  D: ['xxxx.', 'x...x', 'x...x', 'x...x', 'x...x', 'xxxx.'],
  E: ['xxxxx', 'x....', 'xxxx.', 'x....', 'x....', 'xxxxx'],
  F: ['xxxxx', 'x....', 'xxxx.', 'x....', 'x....', 'x....'],
  G: ['.xxxx', 'x....', 'x.xxx', 'x...x', 'x...x', '.xxxx'],
  H: ['x...x', 'x...x', 'xxxxx', 'x...x', 'x...x', 'x...x'],
  I: ['xxx', '.x.', '.x.', '.x.', '.x.', 'xxx'],
  J: ['..xxx', '...x.', '...x.', '...x.', 'x..x.', '.xx..'],
  K: ['x...x', 'x..x.', 'xxx..', 'x..x.', 'x...x', 'x...x'],
  L: ['x....', 'x....', 'x....', 'x....', 'x....', 'xxxxx'],
  M: ['x...x', 'xx.xx', 'x.x.x', 'x...x', 'x...x', 'x...x'],
  N: ['x...x', 'xx..x', 'x.x.x', 'x..xx', 'x...x', 'x...x'],
  O: ['.xxx.', 'x...x', 'x...x', 'x...x', 'x...x', '.xxx.'],
  P: ['xxxx.', 'x...x', 'xxxx.', 'x....', 'x....', 'x....'],
  Q: ['.xxx.', 'x...x', 'x...x', 'x.x.x', 'x..xx', '.xxx.x'],
  R: ['xxxx.', 'x...x', 'xxxx.', 'x.x..', 'x..x.', 'x...x'],
  S: ['.xxxx', 'x....', '.xxx.', '....x', '....x', 'xxxx.'],
  T: ['xxxxx', '..x..', '..x..', '..x..', '..x..', '..x..'],
  U: ['x...x', 'x...x', 'x...x', 'x...x', 'x...x', '.xxx.'],
  V: ['x...x', 'x...x', 'x...x', '.x.x.', '.x.x.', '..x..'],
  W: ['x...x', 'x...x', 'x.x.x', 'x.x.x', 'xx.xx', 'x...x'],
  X: ['x...x', '.x.x.', '..x..', '.x.x.', 'x...x'],
  Y: ['x...x', '.x.x.', '..x..', '..x..', '..x..'],
  Z: ['xxxxx', '...x.', '..x..', '.x...', 'xxxxx'],

  // Numbers
  '0': ['.xxx.', 'x..xx', 'x.x.x', 'xx..x', '.xxx.'],
  '1': ['..x.', '.xx.', '..x.', '..x.', '.xxx'],
  '2': ['.xxx.', 'x...x', '...x.', '..x..', '.x...', 'xxxxx'],
  '3': ['.xxx.', '....x', '..xx.', '....x', 'x...x', '.xxx.'],
  '4': ['x...x', 'x...x', 'xxxxx', '....x', '....x'],
  '5': ['xxxxx', 'x....', 'xxxx.', '....x', 'xxxx.'],
  '6': ['.xxx.', 'x....', 'xxxx.', 'x...x', '.xxx.'],
  '7': ['xxxxx', '....x', '...x.', '..x..', '.x...'],
  '8': ['.xxx.', 'x...x', '.xxx.', 'x...x', '.xxx.'],
  '9': ['.xxx.', 'x...x', '.xxxx', '....x', '.xxx.'],

  // Punctuation & Symbols
  '.': ['..', '..', '..', '..', '..', '..', 'x.'],
  ',': ['..', '..', '..', '..', '..', '..', '.x', 'x.'],
  '!': ['x', 'x', 'x', 'x', '.', '.', 'x'],
  '?': ['.xxx.', 'x...x', '....x', '..xx.', '..x..', '.....', '..x..'],
  '-': ['...', '...', '...', 'xxx', '...'],
  '_': ['.....', '.....', '.....', '.....', '.....', '.....', 'xxxxx'],
  ':': ['.', 'x', '.', '.', 'x', '.'],
  ';': ['.', 'x', '.', '.', 'x', 'x'],
  "'": ['x', 'x'],
  '"': ['x.x', 'x.x'],
  '&': ['.xx..', 'x..x.', '.xx..', 'x.x.x', 'x..x.', '.xx.x'],
  '*': ['.x.x.', '..x..', '.x.x.'],
  '+': ['..x..', '.xxx.', '..x..'],
  '/': ['....x', '...x.', '..x..', '.x...', 'x....'],
  '(': ['..x', '.x.', '.x.', '.x.', '.x.', '..x'],
  ')': ['x..', '.x.', '.x.', '.x.', '.x.', 'x..'],
  ' ': ['..'],
};

/**
 * Helper to compute cell size from either font size or raw stitch size.
 */
function getCellSize(fontSizeOrStitchSize: number): number {
  return fontSizeOrStitchSize <= 14 ? fontSizeOrStitchSize : fontSizeOrStitchSize / 7.5;
}

/**
 * Calculate the total pixel width of cross-stitch text.
 */
export function measureCrossStitchWidth(text: string, fontSize: number): number {
  const cellSize = getCellSize(fontSize);
  let totalW = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const g = CROSS_STITCH_GLYPHS[ch] || CROSS_STITCH_GLYPHS[' '];
    const charW = (g[0].length + 1) * cellSize;
    totalW += charW;
  }
  return totalW;
}

/**
 * Render cross-stitch text on an HTML5 canvas 2D context.
 */
export function drawCrossStitchText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSize: number,
  color = '#FFFFFF',
  align: 'left' | 'center' | 'right' = 'center',
  shadowColor = 'rgba(0, 0, 0, 0.45)'
): void {
  const cellSize = getCellSize(fontSize);
  const totalW = measureCrossStitchWidth(text, fontSize);
  const baseHeight = 8 * cellSize;

  let startX = centerX;
  if (align === 'center') {
    startX = centerX - totalW / 2;
  } else if (align === 'right') {
    startX = centerX - totalW;
  }

  const startY = centerY - baseHeight / 2;
  const pad = cellSize * 0.12;
  const strokeW = Math.max(1.8, cellSize * 0.28);
  const shadowDist = Math.max(1, cellSize * 0.15);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = strokeW;

  let curX = startX;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const g = CROSS_STITCH_GLYPHS[ch] || CROSS_STITCH_GLYPHS[' '];

    for (let r = 0; r < g.length; r++) {
      const rowStr = g[r];
      for (let c = 0; c < rowStr.length; c++) {
        if (rowStr[c] === 'x') {
          const sx = curX + c * cellSize;
          const sy = startY + r * cellSize;

          // 1. Subtle drop-shadow / thread relief
          if (shadowColor) {
            ctx.strokeStyle = shadowColor;
            ctx.beginPath();
            ctx.moveTo(sx + pad + shadowDist, sy + pad + shadowDist * 1.5);
            ctx.lineTo(sx + cellSize - pad + shadowDist, sy + cellSize - pad + shadowDist * 1.5);
            ctx.moveTo(sx + pad + shadowDist, sy + cellSize - pad + shadowDist * 1.5);
            ctx.lineTo(sx + cellSize - pad + shadowDist, sy + pad + shadowDist * 1.5);
            ctx.stroke();
          }

          // 2. Primary thread stitch
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(sx + pad, sy + pad);
          ctx.lineTo(sx + cellSize - pad, sy + cellSize - pad);
          ctx.moveTo(sx + pad, sy + cellSize - pad);
          ctx.lineTo(sx + cellSize - pad, sy + pad);
          ctx.stroke();
        }
      }
    }

    curX += (g[0].length + 1) * cellSize;
  }

  ctx.restore();
}
