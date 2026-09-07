import { CANVAS, MAX_UPLOAD_BYTES, JPEG_QUALITY_FLOOR } from './spec';
import type { Scene } from './scene';
import { renderExport, type ImageMap } from './render';

export interface ExportResult {
  blob: Blob;
  type: string;
  requestedType: string;
  width: number;
  height: number;
  bytes: number;
  filename: string;
  note?: string;
}

function getExtensionForType(type: string): string {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/webp') return 'webp';
  return 'png';
}

function getMimeForFormat(format: 'png' | 'jpeg' | 'webp'): string {
  if (format === 'jpeg') return 'image/jpeg';
  if (format === 'webp') return 'image/webp';
  return 'image/png';
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed to produce a blob'));
          }
        },
        type,
        quality
      );
    } else {
      // Test / synthetic environment fallback
      const mockBlob = new Blob([new Uint8Array(100)], { type });
      resolve(mockBlob);
    }
  });
}

export async function exportBanner(
  scene: Scene,
  images: ImageMap
): Promise<ExportResult> {
  const requestedFormat = scene.export?.format || 'png';
  const requestedType = getMimeForFormat(requestedFormat);
  let quality = scene.export?.quality ?? 0.92;

  // 1. Render export at 2560x1440 sRGB
  const canvas = renderExport(scene, images);

  // 2. Initial toBlob
  let blob = await canvasToBlob(canvas, requestedType, quality);
  const actualType = blob.type || requestedType;
  let note: string | undefined;

  // 3. Verify blob.type
  if (actualType !== requestedType) {
    note = `Your browser exported as ${actualType.split('/')[1]?.toUpperCase() || actualType} instead of ${requestedFormat.toUpperCase()}.`;
  }

  // 4. Sub-6 MB budget search (if format is lossy compressed and oversize)
  if (blob.size > MAX_UPLOAD_BYTES && (actualType === 'image/jpeg' || actualType === 'image/webp')) {
    let low = JPEG_QUALITY_FLOOR;
    let high = quality;
    const steps = 3;

    for (let i = 0; i < steps; i++) {
      const mid = (low + high) / 2;
      const trialBlob = await canvasToBlob(canvas, actualType, mid);
      if (trialBlob.size <= MAX_UPLOAD_BYTES) {
        blob = trialBlob;
        quality = mid;
        low = mid;
      } else {
        high = mid;
      }
    }

    // If still oversize at minimum quality floor
    if (blob.size > MAX_UPLOAD_BYTES) {
      blob = await canvasToBlob(canvas, actualType, JPEG_QUALITY_FLOOR);
      quality = JPEG_QUALITY_FLOOR;
      note =
        'Image exceeds 6 MB even at quality floor (0.7). Consider using PNG or simplifying the artwork.';
    }
  } else if (blob.size > MAX_UPLOAD_BYTES && actualType === 'image/png') {
    note =
      'PNG export exceeds 6 MB YouTube upload limit. Consider exporting as JPEG to meet the 6 MB cap.';
  }

  const ext = getExtensionForType(actualType);
  const filename = `youtube-banner-2560x1440.${ext}`;

  return {
    blob,
    type: actualType,
    requestedType,
    width: CANVAS.width,
    height: CANVAS.height,
    bytes: blob.size,
    filename,
    note,
  };
}

export const AVATAR_SIZE = 800;

/**
 * 1-Click Coordinated YouTube Profile Avatar Export (800 × 800)
 * Renders an 800 × 800 square avatar coordinated with the current banner's
 * background, theme palette, and either photo frame or branding monogram.
 */
export async function exportAvatar(
  scene: Scene,
  images: ImageMap
): Promise<ExportResult> {
  const requestedFormat = scene.export?.format || 'png';
  const requestedType = getMimeForFormat(requestedFormat);
  const quality = scene.export?.quality ?? 0.95;

  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });

  if (ctx) {
    // 1. Render background
    if (scene.background.type === 'solid') {
      ctx.fillStyle = scene.background.color;
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    } else if (scene.background.type === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, AVATAR_SIZE, AVATAR_SIZE);
      grad.addColorStop(0, scene.background.from);
      grad.addColorStop(1, scene.background.to);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    } else if (scene.background.type === 'image') {
      const bgImg = images.get(scene.background.src);
      if (bgImg) {
        const bgW = (bgImg as HTMLImageElement).naturalWidth || (bgImg as any).width || AVATAR_SIZE;
        const bgH = (bgImg as HTMLImageElement).naturalHeight || (bgImg as any).height || AVATAR_SIZE;
        const scale = Math.max(AVATAR_SIZE / bgW, AVATAR_SIZE / bgH);
        const w = bgW * scale;
        const h = bgH * scale;
        ctx.drawImage(bgImg, (AVATAR_SIZE - w) / 2, (AVATAR_SIZE - h) / 2, w, h);
      } else {
        ctx.fillStyle = '#0B0D10';
        ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
      }
    } else {
      ctx.fillStyle = '#0B0D10';
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    }

    // 2. Scrim overlay if present
    if (scene.background.scrim && scene.background.scrim.enabled && scene.background.scrim.intensity > 0) {
      const intensity = Math.min(1, Math.max(0, scene.background.scrim.intensity));
      const radGrad = ctx.createRadialGradient(
        AVATAR_SIZE / 2,
        AVATAR_SIZE / 2,
        AVATAR_SIZE * 0.1,
        AVATAR_SIZE / 2,
        AVATAR_SIZE / 2,
        AVATAR_SIZE * 0.7
      );
      radGrad.addColorStop(0, 'rgba(0,0,0,0)');
      radGrad.addColorStop(1, `rgba(0,0,0,${intensity * 0.9})`);
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    }

    // 3. Subject: photo frame or monogram
    const frameLayer = scene.layers.find((l) => l.type === 'frame');
    const photoImg = frameLayer ? images.get(frameLayer.id) : undefined;

    if (photoImg) {
      const photoSize = 520;
      const cx = AVATAR_SIZE / 2;
      const cy = AVATAR_SIZE / 2;
      const radius = photoSize / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const photoW = (photoImg as HTMLImageElement).naturalWidth || (photoImg as any).width || photoSize;
      const photoH = (photoImg as HTMLImageElement).naturalHeight || (photoImg as any).height || photoSize;
      const scale = Math.max(photoSize / photoW, photoSize / photoH);
      const w = photoW * scale;
      const h = photoH * scale;
      ctx.drawImage(photoImg, cx - w / 2, cy - h / 2, w, h);
      ctx.restore();

      const accentColor = scene.designSystem?.palette.accent || '#2340B8';
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.restore();
    } else {
      const titleLayer = scene.layers.find((l) => l.type === 'text' && l.id === 'title') as any;
      const titleText = (titleLayer?.text || 'YT').trim();
      const words = titleText.split(/\s+/).filter(Boolean);
      const initials = words.length > 1
        ? (words[0][0] + words[1][0]).toUpperCase()
        : titleText.slice(0, 2).toUpperCase();

      const primaryColor = scene.designSystem?.palette.primary || titleLayer?.color || '#FFFFFF';
      const accentColor = scene.designSystem?.palette.accent || '#2340B8';

      const cx = AVATAR_SIZE / 2;
      const cy = AVATAR_SIZE / 2;
      const radius = 260;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      const fontName = titleLayer?.font || 'Inter';
      ctx.font = `bold 180px "${fontName}", sans-serif`;
      ctx.fillStyle = primaryColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, cx, cy);
      ctx.restore();
    }
  }

  const blob = await canvasToBlob(canvas, requestedType, quality);
  const actualType = blob.type || requestedType;
  const ext = getExtensionForType(actualType);
  const filename = `youtube-avatar-800x800.${ext}`;

  return {
    blob,
    type: actualType,
    requestedType,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    bytes: blob.size,
    filename,
  };
}
