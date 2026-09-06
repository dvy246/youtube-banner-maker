import type { BadgeLayer } from './scene';

/**
 * YouTube-Native Conversion Badges Engine
 * Eliminates the need for creators to leave the tool to find icons on Flaticon.
 */

// Helper to draw rounded rectangle with cross-browser fallback
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Draw crisp play triangle
function drawPlayIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const half = size / 2;
  ctx.moveTo(cx - half * 0.7, cy - half);
  ctx.lineTo(cx + half, cy);
  ctx.lineTo(cx - half * 0.7, cy + half);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw notification bell
function drawBellIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.12);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const s = size * 0.5;
  // Bell body
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.6, cy + s * 0.4);
  ctx.quadraticCurveTo(cx - s * 0.6, cy - s * 0.4, cx, cy - s * 0.7);
  ctx.quadraticCurveTo(cx + s * 0.6, cy - s * 0.4, cx + s * 0.6, cy + s * 0.4);
  ctx.lineTo(cx + s * 0.8, cy + s * 0.6);
  ctx.lineTo(cx - s * 0.8, cy + s * 0.6);
  ctx.closePath();
  ctx.fill();

  // Bell clapper
  ctx.beginPath();
  ctx.arc(cx, cy + s * 0.8, s * 0.2, 0, Math.PI);
  ctx.fill();

  ctx.restore();
}

// Draw cookie vector (creator meme trope)
function drawCookieIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  ctx.save();
  const r = size * 0.5;

  // Cookie base (golden brown)
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Chocolate chips
  ctx.fillStyle = '#451A03';
  const chipOffsets = [
    [-0.3, -0.3, 0.18],
    [0.3, -0.2, 0.16],
    [-0.1, 0.2, 0.2],
    [0.3, 0.3, 0.15],
    [-0.35, 0.15, 0.14],
  ];
  for (const [ox, oy, cr] of chipOffsets) {
    ctx.beginPath();
    ctx.arc(cx + ox * r, cy + oy * r, cr * r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw verified checkmark badge
function drawVerifiedCheck(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
  ctx.save();
  const r = size * 0.5;

  // Circular background badge
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // White checkmark
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(2, size * 0.15);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.45, cy - r * 0.35);
  ctx.stroke();

  ctx.restore();
}

/**
 * Render a YouTube badge layer on canvas.
 */
export function renderBadge(
  ctx: CanvasRenderingContext2D,
  layer: BadgeLayer,
  cw: number,
  ch: number,
  themeAccent?: string
): void {
  ctx.save();

  // Normalized anchor coordinate to canvas pixels
  const px = layer.x * cw;
  const py = layer.y * ch;

  // Base scale relative to 2560 canvas
  const canvasScale = cw / 2560;
  const userScale = layer.scale ?? 1.0;
  const scale = canvasScale * userScale;

  const colorScheme = layer.colorScheme ?? 'youtube-red';
  let pillBg = '#FF0000';
  let pillText = '#FFFFFF';
  let strokeColor: string | null = null;

  if (colorScheme === 'theme-accent') {
    pillBg = themeAccent || '#2340B8';
    pillText = '#FFFFFF';
  } else if (colorScheme === 'mono-dark') {
    pillBg = '#0C0D0E';
    pillText = '#FFFFFF';
    strokeColor = 'rgba(255, 255, 255, 0.15)';
  } else if (colorScheme === 'mono-light') {
    pillBg = '#FFFFFF';
    pillText = '#0C0D0E';
    strokeColor = 'rgba(0, 0, 0, 0.1)';
  }

  switch (layer.variant) {
    case 'subscribe-pill': {
      const text = layer.text || 'SUBSCRIBE';
      const fontSize = Math.round(28 * scale);
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      const textWidth = ctx.measureText(text).width;

      const iconSize = 22 * scale;
      const paddingX = 26 * scale;
      const paddingY = 16 * scale;
      const gap = 12 * scale;

      const pillW = textWidth + iconSize + gap + paddingX * 2;
      const pillH = fontSize + paddingY * 2;
      const x0 = px - pillW / 2;
      const y0 = py - pillH / 2;

      // Draw shadow
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 8 * scale;
      ctx.shadowOffsetY = 2 * scale;

      // Draw pill
      ctx.fillStyle = pillBg;
      drawRoundedRect(ctx, x0, y0, pillW, pillH, pillH / 2);
      ctx.fill();

      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.stroke();
      }

      ctx.shadowColor = 'transparent';

      // Draw play icon
      const iconCx = x0 + paddingX + iconSize / 2;
      const iconCy = py;
      drawPlayIcon(ctx, iconCx, iconCy, iconSize, pillText);

      // Draw text
      ctx.fillStyle = pillText;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, iconCx + iconSize / 2 + gap, py + 1 * scale);
      break;
    }

    case 'subscribe-cookie': {
      const text = layer.text || 'Subscribe for a cookie';
      const fontSize = Math.round(24 * scale);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      const textWidth = ctx.measureText(text).width;

      const cookieSize = 30 * scale;
      const paddingX = 24 * scale;
      const paddingY = 14 * scale;
      const gap = 12 * scale;

      const pillW = textWidth + cookieSize + gap + paddingX * 2;
      const pillH = fontSize + paddingY * 2 + 4 * scale;
      const x0 = px - pillW / 2;
      const y0 = py - pillH / 2;

      // Draw pill (dark with warm border)
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 10 * scale;
      ctx.shadowOffsetY = 3 * scale;

      ctx.fillStyle = colorScheme === 'mono-light' ? '#FFFFFF' : '#14171A';
      drawRoundedRect(ctx, x0, y0, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = Math.max(1.5, 2 * scale);
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Draw Cookie Icon
      const cookieCx = x0 + paddingX + cookieSize / 2;
      const cookieCy = py;
      drawCookieIcon(ctx, cookieCx, cookieCy, cookieSize);

      // Draw text
      ctx.fillStyle = colorScheme === 'mono-light' ? '#14171A' : '#FDE68A';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, cookieCx + cookieSize / 2 + gap, py);
      break;
    }

    case 'bell-pill': {
      const text = layer.text || 'ALL NOTIFICATIONS';
      const fontSize = Math.round(22 * scale);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      const textWidth = ctx.measureText(text).width;

      const bellSize = 24 * scale;
      const paddingX = 22 * scale;
      const paddingY = 14 * scale;
      const gap = 10 * scale;

      const pillW = textWidth + bellSize + gap + paddingX * 2;
      const pillH = fontSize + paddingY * 2;
      const x0 = px - pillW / 2;
      const y0 = py - pillH / 2;

      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 6 * scale;
      ctx.fillStyle = pillBg;
      drawRoundedRect(ctx, x0, y0, pillW, pillH, pillH / 2);
      ctx.fill();

      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = Math.max(1, 1.5 * scale);
        ctx.stroke();
      }

      ctx.shadowColor = 'transparent';

      const bellCx = x0 + paddingX + bellSize / 2;
      drawBellIcon(ctx, bellCx, py, bellSize, pillText);

      ctx.fillStyle = pillText;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, bellCx + bellSize / 2 + gap, py);
      break;
    }

    case 'schedule-tag': {
      const text = layer.text || 'NEW VIDEOS WEEKLY';
      const fontSize = Math.round(20 * scale);
      ctx.font = `700 ${fontSize}px JetBrains Mono, monospace`;
      const textWidth = ctx.measureText(text).width;

      const dotSize = 10 * scale;
      const paddingX = 20 * scale;
      const paddingY = 12 * scale;
      const gap = 10 * scale;

      const pillW = textWidth + dotSize + gap + paddingX * 2;
      const pillH = fontSize + paddingY * 2;
      const x0 = px - pillW / 2;
      const y0 = py - pillH / 2;

      // Dark translucent pill
      ctx.fillStyle = 'rgba(12, 13, 16, 0.75)';
      drawRoundedRect(ctx, x0, y0, pillW, pillH, 8 * scale);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = Math.max(1, 1 * scale);
      ctx.stroke();

      // Pulsing red live dot
      const dotCx = x0 + paddingX + dotSize / 2;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(dotCx, py, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, dotCx + dotSize / 2 + gap, py);
      break;
    }

    case 'social-row': {
      const handle = layer.text || '@channel';
      const fontSize = Math.round(22 * scale);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      const textWidth = ctx.measureText(handle).width;

      const paddingX = 20 * scale;
      const paddingY = 12 * scale;
      const pillW = textWidth + paddingX * 2;
      const pillH = fontSize + paddingY * 2;
      const x0 = px - pillW / 2;
      const y0 = py - pillH / 2;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      drawRoundedRect(ctx, x0, y0, pillW, pillH, pillH / 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = Math.max(1, 1 * scale);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(handle, px, py);
      break;
    }

    case 'verified-check': {
      const badgeSize = 34 * scale;
      drawVerifiedCheck(ctx, px, py, badgeSize, '#3B82F6');
      break;
    }
  }

  ctx.restore();
}
