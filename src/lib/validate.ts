import { CANVAS, SAFE, MAX_UPLOAD_BYTES, DEVICE_ORDER, type DeviceKey } from './spec';
import type { Scene, TextLayer } from './scene';

export interface Verdict {
  id: string;
  layerId?: string;
  severity: 'error' | 'warn' | 'info';
  title: string;
  detail: string;
  device: DeviceKey | 'all';
  fixable: boolean;
  action?: 'reposition' | 'reduce-size' | 'convert';
}

export interface ValidateOptions {
  sourceRaster?: { w: number; h: number };
  estimatedBytes?: number;
  fontsLoaded?: boolean;
  includeCacheDelay?: boolean;
  isNonSrgb?: boolean;
}

const SEVERITY_ORDER: Record<Verdict['severity'], number> = {
  error: 0,
  warn: 1,
  info: 2,
};

function getDeviceOrder(device: DeviceKey | 'all'): number {
  if (device === 'all') return DEVICE_ORDER.length;
  const idx = DEVICE_ORDER.indexOf(device);
  return idx === -1 ? DEVICE_ORDER.length : idx;
}

export function estimateTextBounds(layer: TextLayer): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  const charWidthPx = layer.size * 0.58;
  const totalWidthPx = Math.max(1, layer.text.length) * charWidthPx;
  const totalHeightPx = layer.size * 1.1;

  const widthFrac = totalWidthPx / CANVAS.width;
  const heightFrac = totalHeightPx / CANVAS.height;

  let minX: number;
  let maxX: number;

  if (layer.align === 'center') {
    minX = layer.position.x - widthFrac / 2;
    maxX = layer.position.x + widthFrac / 2;
  } else if (layer.align === 'left') {
    minX = layer.position.x;
    maxX = layer.position.x + widthFrac;
  } else {
    minX = layer.position.x - widthFrac;
    maxX = layer.position.x;
  }

  const minY = layer.position.y - heightFrac / 2;
  const maxY = layer.position.y + heightFrac / 2;

  return { minX, maxX, minY, maxY };
}

export function validateScene(
  scene: Scene,
  opts: ValidateOptions = {}
): Verdict[] {
  const verdicts: Verdict[] = [];

  // 1. font-not-loaded check
  if (opts.fontsLoaded === false) {
    verdicts.push({
      id: 'font-not-loaded',
      severity: 'info',
      title: 'Still measuring — fonts are loading',
      detail: 'Waiting for custom font metrics before verifying safe area boundaries.',
      device: 'all',
      fixable: false,
    });
  }

  // 2. filesize-over check
  if (opts.estimatedBytes && opts.estimatedBytes > MAX_UPLOAD_BYTES) {
    verdicts.push({
      id: 'filesize-over',
      severity: 'error',
      title: 'This file will be too large to upload',
      detail:
        'YouTube requires banners to be 6 MB or less. Export as JPEG or compress before uploading.',
      device: 'all',
      fixable: true,
      action: 'convert',
    });
  }

  // 3. low-resolution check
  if (opts.sourceRaster) {
    if (opts.sourceRaster.w < 2048 || opts.sourceRaster.h < 1152) {
      verdicts.push({
        id: 'low-resolution',
        severity: 'warn',
        title: "This image won't be sharp at TV size",
        detail:
          'YouTube recommends at least 2048 × 1152 px for crisp display on high-resolution screens.',
        device: 'tv',
        fixable: false,
      });
    }
  }

  // 4. Safe area check on layers
  const safeLeft = SAFE.x;
  const safeRight = SAFE.x + SAFE.w;
  const safeTop = SAFE.y;
  const safeBottom = SAFE.y + SAFE.h;

  for (const layer of scene.layers) {
    if (layer.type === 'text' && layer.safeAreaConstrained) {
      const bounds = estimateTextBounds(layer);
      const overflowsLeft = bounds.minX < safeLeft;
      const overflowsRight = bounds.maxX > safeRight;
      const overflowsTop = bounds.minY < safeTop;
      const overflowsBottom = bounds.maxY > safeBottom;

      if (overflowsLeft || overflowsRight || overflowsTop || overflowsBottom) {
        let direction = 'Reduce font size or shorten text so it fits the safe area.';
        if (overflowsLeft && !overflowsRight) {
          direction = 'Drag it right so it fits the safe area.';
        } else if (overflowsRight && !overflowsLeft) {
          direction = 'Drag it left so it fits the safe area.';
        } else if (overflowsTop && !overflowsBottom) {
          direction = 'Drag it down so it fits the safe area.';
        } else if (overflowsBottom && !overflowsTop) {
          direction = 'Drag it up so it fits the safe area.';
        }

        const layerLabel = layer.text.trim() || 'text';
        verdicts.push({
          id: 'safe-overflow',
          layerId: layer.id,
          severity: 'error',
          title: `Your "${layerLabel}" is cut off on mobile`,
          detail: direction,
          device: 'mobile',
          fixable: true,
          action: 'reposition',
        });
      }

      // Check text-too-large
      const layerWidthFrac = bounds.maxX - bounds.minX;
      if (layerWidthFrac > SAFE.w * 0.95) {
        verdicts.push({
          id: 'text-too-large',
          layerId: layer.id,
          severity: 'warn',
          title: `Your "${layer.text.trim() || 'text'}" may be hard to read on mobile`,
          detail: 'Reduce the font size slightly so it sits comfortably inside the safe area.',
          device: 'mobile',
          fixable: true,
          action: 'reduce-size',
        });
      }
    }
  }

  // 5. Subject outside safe check for background image
  if (scene.background.type === 'image') {
    const bg = scene.background;
    if (!bg.extend) {
      // If offsetX/offsetY moves the subject significantly outside safe area
      const maxDispX = 0.35 * CANVAS.width;
      const maxDispY = 0.35 * CANVAS.height;
      if (Math.abs(bg.offsetX) > maxDispX || Math.abs(bg.offsetY) > maxDispY) {
        verdicts.push({
          id: 'subject-outside-safe',
          severity: 'warn',
          title: 'The main part of your image sits outside the safe area',
          detail:
            'Center your photo or enable background extension to protect content across devices.',
          device: 'mobile',
          fixable: true,
          action: 'reposition',
        });
      }
    }
  }

  // 6. non-srgb-source check (§D.4)
  if (opts.isNonSrgb) {
    verdicts.push({
      id: 'non-srgb-source',
      severity: 'info',
      title: 'Colour may shift after upload',
      detail:
        'Your image appears to use a wide color profile (such as Display P3). YouTube converts uploads to sRGB, which may slightly change color vibrancy.',
      device: 'all',
      fixable: false,
    });
  }

  // 7. cache-delay info verdict if requested
  if (opts.includeCacheDelay) {
    verdicts.push({
      id: 'cache-delay',
      severity: 'info',
      title: 'Your new banner can take up to 24 hours to appear everywhere',
      detail:
        'YouTube uses edge CDN caching. If you still see the old banner, wait or check in an incognito window.',
      device: 'all',
      fixable: false,
    });
  }

  // Sort: severity (error -> warn -> info), then device order
  verdicts.sort((a, b) => {
    const sevA = SEVERITY_ORDER[a.severity];
    const sevB = SEVERITY_ORDER[b.severity];
    if (sevA !== sevB) {
      return sevA - sevB;
    }
    return getDeviceOrder(a.device) - getDeviceOrder(b.device);
  });

  return verdicts;
}
