import { CANVAS, DEVICES, type DeviceKey } from './spec';
import type { Background, Scene, TextLayer, ShapeLayer } from './scene';
import { FONTS } from './fonts';

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
    grad.addColorStop(0, bg.from);
    grad.addColorStop(1, bg.to);
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

  // 2. Shapes (array order = z order)
  for (const layer of scene.layers) {
    if (layer.type === 'shape') {
      renderShape(ctx, layer, cw, ch);
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
    ctx.fillRect(x, y, w, h);
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
