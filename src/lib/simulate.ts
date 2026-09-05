import {
  CANVAS,
  DEVICES,
  DESKTOP_SERVED_WIDTH,
  REENCODE_BUDGET_BYTES,
  JPEG_QUALITY_FLOOR,
} from './spec';

export interface SimulateOptions {
  device: 'desktop' | 'full';
  format: 'jpeg' | 'webp';
}

export interface SimulateResult {
  dataUrl: string;
  bytes: number;
  quality: number;
  caption: string;
}

export async function simulateReencode(
  sourceCanvas: HTMLCanvasElement,
  opts: SimulateOptions
): Promise<SimulateResult> {
  const targetDevice = opts.device === 'desktop' ? 'desktop' : 'tv';
  const rect = DEVICES[targetDevice];

  const sourceWidth =
    opts.device === 'desktop' ? DESKTOP_SERVED_WIDTH : CANVAS.width;
  const sourceHeight = Math.round((sourceWidth * CANVAS.height) / CANVAS.width);

  const cropW = Math.round(rect.w * sourceWidth);
  const cropH = Math.round(rect.h * sourceHeight);

  let cropCanvas: HTMLCanvasElement;
  if (typeof document !== 'undefined' && document.createElement) {
    cropCanvas = document.createElement('canvas');
  } else {
    cropCanvas = {
      width: cropW,
      height: cropH,
      getContext: () => null,
      toDataURL: () => '',
    } as unknown as HTMLCanvasElement;
  }
  cropCanvas.width = cropW;
  cropCanvas.height = cropH;

  const ctx = cropCanvas.getContext('2d') as CanvasRenderingContext2D | null;
  if (ctx) {
    const srcW = sourceCanvas.width || CANVAS.width;
    const srcH = sourceCanvas.height || CANVAS.height;
    const sx = rect.x * srcW;
    const sy = rect.y * srcH;
    const sw = rect.w * srcW;
    const sh = rect.h * srcH;
    ctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, cropW, cropH);
  }

  const mimeType = opts.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const targetBudget = REENCODE_BUDGET_BYTES[opts.device] || 134_000;

  let quality = 0.82;
  let dataUrl = '';
  let bytes = 0;

  if (typeof cropCanvas.toDataURL === 'function') {
    let low = JPEG_QUALITY_FLOOR;
    let high = 0.95;

    for (let step = 0; step < 3; step++) {
      const mid = (low + high) / 2;
      const trialUrl = cropCanvas.toDataURL(mimeType, mid);
      // Data URL byte length estimate
      const headerLength = trialUrl.indexOf(',') + 1;
      const base64Len = trialUrl.length - headerLength;
      const estimatedBytes = Math.round((base64Len * 3) / 4);

      dataUrl = trialUrl;
      bytes = estimatedBytes;
      quality = mid;

      if (estimatedBytes > targetBudget) {
        high = mid;
      } else {
        low = mid;
      }
    }
  }

  // Required caption per REQ-005 and honesty guards §F.6
  const caption = "Approximate result of YouTube's re-encode.";

  return {
    dataUrl,
    bytes,
    quality: Number(quality.toFixed(2)),
    caption,
  };
}
