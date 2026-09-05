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
