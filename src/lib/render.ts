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
  } else if (bg.type === 'motion') {
    // Render static snapshot for the final export
    if (bg.effect === 'mesh') {
      const grad = ctx.createRadialGradient(cw * 0.2, ch * 0.2, 0, cw * 0.5, ch * 0.5, cw * 0.8);
      grad.addColorStop(0, bg.color1);
      grad.addColorStop(1, bg.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
    } else if (bg.effect === 'particles') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = bg.color2;
      for(let i = 0; i < 50; i++) {
         ctx.beginPath();
         ctx.arc(cw * ((i * 13) % 100) / 100, ch * ((i * 7) % 100) / 100, (i % 4) + 1, 0, Math.PI * 2);
         ctx.fill();
      }
    } else if (bg.effect === 'aurora') {
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, bg.color1);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
      
      ctx.beginPath();
      ctx.moveTo(0, ch * 0.6);
      ctx.bezierCurveTo(cw * 0.3, ch * 0.3, cw * 0.7, ch * 0.8, cw, ch * 0.5);
      ctx.strokeStyle = bg.color2;
      ctx.lineWidth = 120;
      ctx.filter = 'blur(60px)';
      ctx.stroke();
      ctx.filter = 'none';
    } else if (bg.effect === 'cybergrid') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.strokeStyle = bg.color1;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, ch * 0.5 + Math.pow(i, 2) * 2);
        ctx.lineTo(cw, ch * 0.5 + Math.pow(i, 2) * 2);
        ctx.stroke();
      }
      for (let i = -20; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(cw / 2 + i * 80, ch * 0.5);
        ctx.lineTo(cw / 2 + i * 250, ch);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    } else if (bg.effect === 'sakura') {
      // Static snapshot for sakura: soft dusk sky with falling petals
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#240046');
      grad.addColorStop(0.5, '#7B286E');
      grad.addColorStop(1, '#FFB370');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      ctx.fillStyle = '#FFD1DC';
      ctx.globalAlpha = 0.85;
      for (let i = 0; i < 40; i++) {
        const px = cw * (((i * 29) % 100) / 100);
        const py = ch * (((i * 17) % 100) / 100);
        ctx.beginPath();
        ctx.ellipse(px, py, 14, 8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    } else if (bg.effect === 'anime-sunset') {
      // Static snapshot for anime sunset: glowing horizon sun and embers
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#10002B');
      grad.addColorStop(0.5, '#3C096C');
      grad.addColorStop(0.8, '#9D4EDD');
      grad.addColorStop(1, '#FF9E00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      const sunGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.65, 20, cw * 0.5, ch * 0.65, 360);
      sunGrad.addColorStop(0, '#FFF3D1');
      sunGrad.addColorStop(0.4, '#FFB370');
      sunGrad.addColorStop(1, 'rgba(255, 179, 112, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cw * 0.5, ch * 0.65, 360, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 1.5 Studio Scrim (Contrast Guard)
  if (bg.scrim && bg.scrim.enabled && bg.scrim.intensity > 0) {
    ctx.save();
    const maxRadius = Math.sqrt(cw * cw + ch * ch) / 2;
    const radGrad = ctx.createRadialGradient(
      cw / 2,
      ch / 2,
      ch * 0.25,
      cw / 2,
      ch / 2,
      maxRadius
    );
    radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    radGrad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.95, bg.scrim.intensity)})`);
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, cw, ch);
    ctx.restore();
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

/**
 * Calculate maximum font size that safely fits within specified safe bounds.
 */
export function fitTextToSafeArea(
  text: string,
  fontId: string,
  maxWidth = 1400,
  maxFontSize = 72,
  minFontSize = 24
): number {
  let size = maxFontSize;
  while (size > minFontSize) {
    const w = measureTextWidth(text, fontId, size);
    if (w <= maxWidth) {
      return size;
    }
    size -= 2;
  }
  return minFontSize;
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

  const cx = layer.x * cw;
  const cy = layer.y * ch;
  const w = layer.w * cw;
  const h = layer.h * ch;
  const x = cx - w / 2;
  const y = cy - h / 2;

  const bWidth = layer.borderWidth ?? 0;
  ctx.lineWidth = bWidth;
  ctx.strokeStyle = layer.borderColor || layer.color;

  if (layer.shape === 'rect') {
    if (layer.borderRadius && typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, layer.borderRadius);
      ctx.fill();
      if (bWidth > 0) ctx.stroke();
    } else {
      ctx.fillRect(x, y, w, h);
      if (bWidth > 0) ctx.strokeRect(x, y, w, h);
    }
  } else if (layer.shape === 'circle') {
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
    ctx.fill();
    if (bWidth > 0) ctx.stroke();
  } else if (layer.shape === 'line') {
    ctx.lineWidth = Math.max(1, h);
    ctx.strokeStyle = layer.color;
    ctx.beginPath();
    // For line, x and y can still be treated as center point of the line,
    // so we draw from (cx - w/2) to (cx + w/2)
    ctx.moveTo(x, cy);
    ctx.lineTo(cx + w / 2, cy);
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
  ctx.textAlign = layer.align;
  ctx.textBaseline = 'middle';

  const x = layer.position.x * cw;
  const y = layer.position.y * ch;

  // Render Aero Plate frosted glass plate if enabled
  if (layer.aeroPlate && layer.aeroPlate.enabled) {
    ctx.save();
    const textMetrics = ctx.measureText(layer.text);
    const textWidth = textMetrics.width;
    const padX = layer.aeroPlate.padding ?? 24;
    const padY = Math.round(padX * 0.45);
    const plateW = textWidth + padX * 2;
    const plateH = layer.size + padY * 2;

    let plateX = x - padX;
    if (layer.align === 'center') {
      plateX = x - plateW / 2;
    } else if (layer.align === 'right') {
      plateX = x - textWidth - padX;
    }
    const plateY = y - plateH / 2;
    const radius = Math.min(16, plateH / 2);

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(plateX, plateY, plateW, plateH, radius);
    } else {
      ctx.rect(plateX, plateY, plateW, plateH);
    }

    if (layer.aeroPlate.style === 'light-frosted') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    } else {
      ctx.fillStyle = 'rgba(12, 13, 16, 0.65)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    }
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = layer.color;
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

export function renderExport(
  scene: Scene,
  images: ImageMap,
  targetWidth: number = CANVAS.width,
  targetHeight: number = CANVAS.height
): HTMLCanvasElement {
  let canvas: HTMLCanvasElement;
  if (typeof document !== 'undefined' && document.createElement) {
    canvas = document.createElement('canvas');
  } else {
    // In environments with OffscreenCanvas or custom canvas
    canvas = {
      width: targetWidth,
      height: targetHeight,
    } as unknown as HTMLCanvasElement;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // colorSpace: 'srgb' required per REQ-006, REQ-010
  const ctx =
    typeof canvas.getContext === 'function'
      ? (canvas.getContext('2d', {
          colorSpace: 'srgb',
        }) as CanvasRenderingContext2D | null)
      : null;

  if (ctx) {
    if (targetWidth !== CANVAS.width || targetHeight !== CANVAS.height) {
      ctx.save();
      ctx.scale(targetWidth / CANVAS.width, targetHeight / CANVAS.height);
      renderScene(ctx, scene, images);
      ctx.restore();
    } else {
      renderScene(ctx, scene, images);
    }
  }

  return canvas;
}
