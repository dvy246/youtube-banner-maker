import { CANVAS, DEVICES, type DeviceKey } from './spec';
import type { Background, Scene, TextLayer, ShapeLayer, PhotoFrameLayer } from './scene';
import { FONTS } from './fonts';
import { renderBadge } from './badges';

export type ImageMap = Map<string, HTMLImageElement | CanvasImageSource>;

export function clampZoom(zoom: number, sw: number, sh: number): number {
  const cap = Math.min(sw / CANVAS.width, sh / CANVAS.height);
  const maxZoom = Math.max(1, cap);
  return Math.min(Math.max(1, zoom), maxZoom);
}

export function clampOffset(
  offsetX: number,
  offsetY: number,
  drawW: number,
  drawH: number
): { x: number; y: number } {
  const maxOffsetX = Math.max(0, (drawW - CANVAS.width) / 2);
  const maxOffsetY = Math.max(0, (drawH - CANVAS.height) / 2);

  const clampedX = Math.min(Math.max(-maxOffsetX, offsetX), maxOffsetX);
  const clampedY = Math.min(Math.max(-maxOffsetY, offsetY), maxOffsetY);

  return { x: clampedX, y: clampedY };
}

export function drawBackgroundImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | CanvasImageSource,
  bg: Extract<Background, { type: 'image' }>
): void {
  const cw = CANVAS.width;
  const ch = CANVAS.height;
  const sw =
    'naturalWidth' in image && image.naturalWidth
      ? image.naturalWidth
      : 'width' in image
        ? Number(image.width)
        : cw;
  const sh =
    'naturalHeight' in image && image.naturalHeight
      ? image.naturalHeight
      : 'height' in image
        ? Number(image.height)
        : ch;

  const validZoom = clampZoom(bg.zoom, sw, sh);
  const scale = Math.max(cw / sw, ch / sh); // NEVER min (would letterbox)
  const effScale = scale * validZoom;
  const drawW = sw * effScale;
  const drawH = sh * effScale;

  const clamped = clampOffset(bg.offsetX, bg.offsetY, drawW, drawH);
  const dx = (cw - drawW) / 2 + clamped.x;
  const dy = (ch - drawH) / 2 + clamped.y;

  // Background extension path (REQ-009)
  if (bg.extend && (dx > 0 || dy > 0 || dx + drawW < cw || dy + drawH < ch)) {
    ctx.save();
    ctx.filter = 'blur(40px)';
    ctx.drawImage(image, -40, -40, cw + 80, ch + 80);
    ctx.restore();
  }

  ctx.drawImage(image, dx, dy, drawW, drawH);
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  images: ImageMap
): void {
  const cw = CANVAS.width;
  const ch = CANVAS.height;

  ctx.save();
  ctx.clearRect(0, 0, cw, ch);

  // 1. Background
  const bg = scene.background;
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, cw, ch);
  } else if (bg.type === 'gradient') {
    const angleRad = ((bg.angle - 90) * Math.PI) / 180;
    const cx = cw / 2;
    const cy = ch / 2;
    const length = Math.sqrt(cw * cw + ch * ch) / 2;
    const x0 = cx - Math.cos(angleRad) * length;
    const y0 = cy - Math.sin(angleRad) * length;
    const x1 = cx + Math.cos(angleRad) * length;
    const y1 = cy + Math.sin(angleRad) * length;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    if ('stops' in bg && Array.isArray(bg.stops) && bg.stops.length > 0) {
      const stops = bg.stops;
      stops.forEach((stopColor, idx) => {
        grad.addColorStop(idx / Math.max(1, stops.length - 1), stopColor);
      });
    } else {
      grad.addColorStop(0, bg.from || '#0C0D0E');
      grad.addColorStop(1, bg.to || '#1F2124');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  } else if (bg.type === 'image') {
    const img = images.get(bg.src);
    if (img) {
      drawBackgroundImage(ctx, img, bg);
    } else {
      ctx.fillStyle = '#1F2124';
      ctx.fillRect(0, 0, cw, ch);
    }
  }

  // 2. Shapes & Frames & Badges (array order = z order)
  for (const layer of scene.layers) {
    if (layer.type === 'shape') {
      renderShape(ctx, layer, cw, ch);
    } else if (layer.type === 'frame') {
      renderPhotoFrame(ctx, layer, images, cw, ch);
    } else if (layer.type === 'badge') {
      renderBadge(ctx, layer, cw, ch);
    }
  }

  // 3. Text (array order = z order)
  for (const layer of scene.layers) {
    if (layer.type === 'text') {
      renderText(ctx, layer, cw, ch);
    }
  }

  ctx.restore();
}

/**
 * Measure rendered width of a text string at full 2560 canvas scale.
 * Used for smart auto-fit title sizing to prevent safe-area overflow.
 */
export function measureTextWidth(
  text: string,
  fontId: string,
  fontSize: number
): number {
  const fontDef = FONTS[fontId];
  const family = fontDef?.family || 'Inter, sans-serif';
  const weight = fontDef?.weight || 700;

  // Use offscreen canvas if available, else a dummy canvas
  let canvas: HTMLCanvasElement | null = null;
  if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
  }
  if (!canvas) {
    // Fallback estimation
    return text.length * fontSize * 0.58;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return text.length * fontSize * 0.58;
  }
  ctx.font = `${weight} ${fontSize}px ${family}`;
  return ctx.measureText(text).width;
}

function renderShape(
  ctx: CanvasRenderingContext2D,
  layer: ShapeLayer,
  cw: number,
  ch: number
): void {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
  ctx.fillStyle = layer.color;
  ctx.strokeStyle = layer.color;

  const x = layer.x * cw;
  const y = layer.y * ch;
  const w = layer.w * cw;
  const h = layer.h * ch;

  if (layer.shape === 'rect') {
    if (layer.borderRadius && typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, layer.borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  } else if (layer.shape === 'circle') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (layer.shape === 'line') {
    ctx.lineWidth = Math.max(1, h);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.stroke();
  }

  ctx.restore();
}

function renderText(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  cw: number,
  ch: number
): void {
  ctx.save();
  const fontDef = FONTS[layer.font];
  const family = fontDef ? fontDef.family : 'sans-serif';
  const weight = fontDef ? fontDef.weight : 600;

  ctx.font = `${weight} ${layer.size}px ${family}, sans-serif`;
  ctx.fillStyle = layer.color;
  ctx.textAlign = layer.align;
  ctx.textBaseline = 'middle';

  const x = layer.position.x * cw;
  const y = layer.position.y * ch;

  ctx.fillText(layer.text, x, y);
  ctx.restore();
}

function renderPhotoFrame(
  ctx: CanvasRenderingContext2D,
  layer: PhotoFrameLayer,
  images: ImageMap,
  cw: number,
  ch: number
): void {
  const cx = layer.x * cw;
  const cy = layer.y * ch;
  const fw = layer.w * cw;
  const fh = layer.h * ch;
  const x = cx - fw / 2;
  const y = cy - fh / 2;

  ctx.save();

  const buildFramePath = () => {
    ctx.beginPath();
    if (layer.shape === 'circle') {
      const radius = Math.min(fw, fh) / 2;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    } else {
      const r = layer.borderRadius ?? 16;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, fw, fh, r);
      } else {
        ctx.rect(x, y, fw, fh);
      }
    }
    ctx.closePath();
  };

  const img = layer.src ? images.get(layer.src) : null;

  if (img) {
    // Masked Image Rendering
    buildFramePath();
    ctx.save();
    ctx.clip();

    const sw =
      'naturalWidth' in img && img.naturalWidth
        ? img.naturalWidth
        : 'width' in img
          ? Number(img.width)
          : fw;
    const sh =
      'naturalHeight' in img && img.naturalHeight
        ? img.naturalHeight
        : 'height' in img
          ? Number(img.height)
          : fh;

    const baseScale = Math.max(fw / sw, fh / sh);
    const zoom = Math.max(0.5, Math.min(4, layer.zoom ?? 1.0));
    const drawW = sw * baseScale * zoom;
    const drawH = sh * baseScale * zoom;

    const panX = layer.offsetX ?? 0;
    const panY = layer.offsetY ?? 0;
    const imgX = x + (fw - drawW) / 2 + panX;
    const imgY = y + (fh - drawH) / 2 + panY;

    ctx.drawImage(img, imgX, imgY, drawW, drawH);
    ctx.restore();

    // Outer Border
    const bWidth = layer.borderWidth ?? 3;
    if (bWidth > 0) {
      buildFramePath();
      ctx.lineWidth = bWidth;
      ctx.strokeStyle = layer.borderColor || '#FFFFFF';
      ctx.stroke();
    }
  } else {
    // Placeholder Frame State (No image uploaded yet)
    ctx.save();
    buildFramePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    ctx.lineWidth = Math.max(2, layer.borderWidth ?? 2);
    ctx.strokeStyle = layer.borderColor || 'rgba(255, 255, 255, 0.6)';
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = layer.borderColor || '#FFFFFF';

    const iconSize = Math.min(fw, fh) * 0.22;
    ctx.font = `600 ${Math.max(14, Math.round(iconSize * 0.85))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText('+', cx, cy - 8);

    ctx.font = `600 ${Math.max(10, Math.round(iconSize * 0.42))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText('ADD PHOTO', cx, cy + 16);
    ctx.restore();
  }

  ctx.restore();
}

export function renderPreview(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  images: ImageMap,
  displayScale: number
): void {
  ctx.save();
  ctx.scale(displayScale, displayScale);
  renderScene(ctx, scene, images);
  ctx.restore();
}

export function renderDeviceCrop(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  device: DeviceKey
): void {
  const rect = DEVICES[device];
  const srcW =
    (source as any).naturalWidth ??
    (source as any).videoWidth ??
    (source as any).width ??
    CANVAS.width;
  const srcH =
    (source as any).naturalHeight ??
    (source as any).videoHeight ??
    (source as any).height ??
    CANVAS.height;
  const sx = rect.x * srcW;
  const sy = rect.y * srcH;
  const sw = rect.w * srcW;
  const sh = rect.h * srcH;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(
    source,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
}

export function renderExport(scene: Scene, images: ImageMap): HTMLCanvasElement {
  let canvas: HTMLCanvasElement;
  if (typeof document !== 'undefined' && document.createElement) {
    canvas = document.createElement('canvas');
  } else {
    // In environments with OffscreenCanvas or custom canvas
    canvas = {
      width: CANVAS.width,
      height: CANVAS.height,
    } as unknown as HTMLCanvasElement;
  }

  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;

  // colorSpace: 'srgb' required per REQ-006, REQ-010
  const ctx =
    typeof canvas.getContext === 'function'
      ? (canvas.getContext('2d', {
          colorSpace: 'srgb',
        }) as CanvasRenderingContext2D | null)
      : null;

  if (ctx) {
    renderScene(ctx, scene, images);
  }

  return canvas;
}
