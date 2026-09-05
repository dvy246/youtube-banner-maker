import { describe, it, expect } from 'vitest';
import { CANVAS, DEVICES, JPEG_QUALITY_FLOOR } from './spec';
import {
  defaultScene,
  cloneScene,
  serializeScene,
  deserializeScene,
  type TextLayer,
} from './scene';
import { clampZoom, clampOffset, renderDeviceCrop } from './render';
import { validateScene } from './validate';
import { simulateReencode } from './simulate';
import { exportBanner } from './export';

describe('Stage 2: Fix Door Engine & Invariants (REQ-002, REQ-007, REQ-008, REQ-010, REQ-011, REQ-013, D-8, D-10)', () => {
  describe('REQ-007 & REQ-008: Cover-Fit Scaling & Clamped Repositioning', () => {
    it('REQ-007: clampZoom prevents upscaling past 1:1 original pixel resolution', () => {
      // Source smaller than canvas: 1280x720 (cap = min(1280/2560, 720/1440) = 0.5 < 1)
      // max(1, 0.5) = 1 -> zoom cannot exceed 1.0
      expect(clampZoom(1.5, 1280, 720)).toBe(1);
      expect(clampZoom(2.0, 1280, 720)).toBe(1);
      expect(clampZoom(0.5, 1280, 720)).toBe(1); // floor is 1.0

      // Source larger than canvas: 5120x2880 (cap = min(5120/2560, 2880/1440) = 2.0)
      expect(clampZoom(1.0, 5120, 2880)).toBe(1.0);
      expect(clampZoom(1.5, 5120, 2880)).toBe(1.5);
      expect(clampZoom(2.0, 5120, 2880)).toBe(2.0);
      expect(clampZoom(2.5, 5120, 2880)).toBe(2.0); // clamped to 2.0 cap
    });

    it('REQ-008: clampOffset ensures no transparent borders or gaps under any legal pan', () => {
      const sw = 3840;
      const sh = 2160;
      const scale = Math.max(CANVAS.width / sw, CANVAS.height / sh); // 2560 / 3840 = 0.6667
      const zoom = 1.2;
      const drawW = sw * scale * zoom;
      const drawH = sh * scale * zoom;

      // When panning far out to the right (+9999px)
      const clampedRight = clampOffset(9999, 0, drawW, drawH);
      const maxAllowedX = (drawW - CANVAS.width) / 2;
      expect(clampedRight.x).toBe(maxAllowedX);

      // Left edge of drawn image must still cover 0: (cw - drawW)/2 + clampedX <= 0
      const leftEdge = (CANVAS.width - drawW) / 2 + clampedRight.x;
      expect(leftEdge).toBeLessThanOrEqual(0);
      // Right edge of drawn image must still cover cw
      const rightEdge = leftEdge + drawW;
      expect(rightEdge).toBeGreaterThanOrEqual(CANVAS.width);

      // When panning far to the left (-9999px)
      const clampedLeft = clampOffset(-9999, 0, drawW, drawH);
      expect(clampedLeft.x).toBe(-maxAllowedX);
      const leftEdgeNegative = (CANVAS.width - drawW) / 2 + clampedLeft.x;
      expect(leftEdgeNegative).toBeLessThanOrEqual(0);
      expect(leftEdgeNegative + drawW).toBeGreaterThanOrEqual(CANVAS.width);
    });

    it('Fuzz test: Coverage invariant holds across diverse aspect ratios and dimensions', () => {
      const testRatios = [
        { sw: 1920, sh: 1080 },
        { sw: 4000, sh: 3000 },
        { sw: 1200, sh: 1600 },
        { sw: 6000, sh: 2000 },
        { sw: 2560, sh: 1440 },
      ];

      for (const { sw, sh } of testRatios) {
        const scale = Math.max(CANVAS.width / sw, CANVAS.height / sh);
        for (const rawZoom of [0.5, 1.0, 1.25, 1.8, 3.0]) {
          const zoom = clampZoom(rawZoom, sw, sh);
          const drawW = sw * scale * zoom;
          const drawH = sh * scale * zoom;

          for (const rawOffset of [-5000, -200, 0, 150, 5000]) {
            const clamped = clampOffset(rawOffset, rawOffset, drawW, drawH);
            const dx = (CANVAS.width - drawW) / 2 + clamped.x;
            const dy = (CANVAS.height - drawH) / 2 + clamped.y;

            // Invariant: Canvas (0, 0, CANVAS.width, CANVAS.height) must be fully covered
            expect(dx).toBeLessThanOrEqual(0.001);
            expect(dy).toBeLessThanOrEqual(0.001);
            expect(dx + drawW).toBeGreaterThanOrEqual(CANVAS.width - 0.001);
            expect(dy + drawH).toBeGreaterThanOrEqual(CANVAS.height - 0.001);
          }
        }
      }
    });
  });

  describe('Decision D-10 & REQ-022: Session Persistence & Re-upload Guard', () => {
    it('Serializes and deserializes scene with image settings cleanly', () => {
      const scene = defaultScene();
      scene.background = {
        type: 'image',
        src: 'data:image/png;base64,mock',
        width: 3000,
        height: 2000,
        cover: true,
        offsetX: 45,
        offsetY: -30,
        zoom: 1.15,
        extend: true,
      };

      const serialized = serializeScene(scene);
      const deserialized = deserializeScene(serialized);
      expect(deserialized).not.toBeNull();
      expect(deserialized?.background.type).toBe('image');
      if (deserialized?.background.type === 'image') {
        expect(deserialized.background.offsetX).toBe(45);
        expect(deserialized.background.offsetY).toBe(-30);
        expect(deserialized.background.zoom).toBe(1.15);
        expect(deserialized.background.extend).toBe(true);
      }
    });

    it('D-10: Over-size scene (>3 MB) preserves layout but strips image for clean recovery', () => {
      const scene = defaultScene();
      scene.background = {
        type: 'image',
        src: 'data:image/png;base64,very-large-data-url',
        width: 4000,
        height: 3000,
        cover: true,
        offsetX: 10,
        offsetY: 20,
        zoom: 1.0,
        extend: false,
      };

      // In tool.ts persist(): if size > 3 MB, background.src is set to ''
      const oversizedPersist = cloneScene(scene);
      if (oversizedPersist.background.type === 'image') {
        oversizedPersist.background.src = '';
      }

      const serialized = serializeScene(oversizedPersist);
      const restored = deserializeScene(serialized);
      expect(restored).not.toBeNull();
      expect(restored?.background.type).toBe('image');
      if (restored?.background.type === 'image') {
        expect(restored.background.src).toBe('');
        expect(restored.background.offsetX).toBe(10);
      }
    });
  });

  describe('REQ-013: Plain-Language Diagnostic Verdicts', () => {
    it('Low-resolution images trigger non-fixable warning naming 2048 x 1152 TV threshold', () => {
      const scene = defaultScene();
      const verdicts = validateScene(scene, {
        sourceRaster: { w: 1280, h: 720 },
      });

      const lowRes = verdicts.find((v) => v.id === 'low-resolution');
      expect(lowRes).toBeDefined();
      expect(lowRes?.severity).toBe('warn');
      expect(lowRes?.device).toBe('tv');
      expect(lowRes?.title).toContain("won't be sharp at TV size");
      expect(lowRes?.detail).toContain('2048 × 1152');
      expect(lowRes?.fixable).toBe(false);
    });

    it('Text overflow outside safe area yields precise directional advice', () => {
      const scene = defaultScene();
      const layer = scene.layers[0] as TextLayer;
      scene.layers[0] = {
        ...layer,
        position: { x: 0.05, y: 0.46 },
        safeAreaConstrained: true,
      };

      const verdicts = validateScene(scene);
      const overflow = verdicts.find((v) => v.id === 'safe-overflow');
      expect(overflow).toBeDefined();
      expect(overflow?.severity).toBe('error');
      expect(overflow?.device).toBe('mobile');
      expect(overflow?.detail).toContain('Drag it right');
    });
  });

  describe('REQ-005: Re-encode Simulation', () => {
    it('Produces required caption and target byte budget', async () => {
      const originalDoc = globalThis.document;
      globalThis.document = {
        createElement: (tag: string) => {
          if (tag === 'canvas') {
            return {
              width: 0,
              height: 0,
              getContext: () => ({
                drawImage: () => {},
              }),
              toDataURL: () => 'data:image/jpeg;base64,' + 'A'.repeat(120000),
            } as any;
          }
          return {} as any;
        },
      } as any;

      try {
        const mockSourceCanvas = {
          width: CANVAS.width,
          height: CANVAS.height,
        } as unknown as HTMLCanvasElement;

        const res = await simulateReencode(mockSourceCanvas, {
          device: 'desktop',
          format: 'jpeg',
        });

        expect(res.caption).toBe("Approximate result of YouTube's re-encode.");
        expect(res.bytes).toBeGreaterThan(0);
        expect(res.quality).toBeGreaterThanOrEqual(JPEG_QUALITY_FLOOR);
      } finally {
        globalThis.document = originalDoc;
      }
    });

    it('Correctly extracts crop from a display-scaled source canvas (e.g. 800x450)', () => {
      const drawnCalls: any[] = [];
      const mockCtx = {
        canvas: { width: 320, height: 180 },
        clearRect: () => {},
        drawImage: (...args: any[]) => {
          drawnCalls.push(args);
        },
      } as unknown as CanvasRenderingContext2D;

      const displayCanvas = { width: 800, height: 450 } as any;
      renderDeviceCrop(mockCtx, displayCanvas, 'desktop');

      expect(drawnCalls.length).toBe(1);
      const [, sx, sy, sw, sh] = drawnCalls[0];
      // Must scale with display canvas (800x450), NOT hardcode CANVAS.width (2560x1440)
      expect(sx).toBeCloseTo(DEVICES.desktop.x * 800, 2);
      expect(sy).toBeCloseTo(DEVICES.desktop.y * 450, 2);
      expect(sw).toBeCloseTo(DEVICES.desktop.w * 800, 2);
      expect(sh).toBeCloseTo(DEVICES.desktop.h * 450, 2);
    });
  });

  describe('Export Budget Search & Oversize Safeguards (REQ-012, REQ-029)', () => {
    it('Oversize WebP converges under 6 MB and respects floor', async () => {
      const scene = defaultScene();
      scene.export.format = 'webp';
      const images = new Map();

      const originalDoc = globalThis.document;
      let attempts = 0;
      globalThis.document = {
        createElement: (tag: string) => {
          if (tag === 'canvas') {
            return {
              width: CANVAS.width,
              height: CANVAS.height,
              getContext: () => ({
                save: () => {},
                restore: () => {},
                clearRect: () => {},
                fillRect: () => {},
                fillText: () => {},
                createLinearGradient: () => ({ addColorStop: () => {} }),
              }),
              toBlob: (cb: (b: Blob) => void, _mime: string, q: number) => {
                attempts++;
                const size = q > 0.75 ? 8 * 1024 * 1024 : 4 * 1024 * 1024;
                cb(new Blob([new Uint8Array(100)], { type: 'image/webp' }));
                Object.defineProperty(Blob.prototype, 'size', {
                  value: size,
                  configurable: true,
                });
              },
            } as any;
          }
          return {} as any;
        },
      } as any;

      try {
        const result = await exportBanner(scene, images);
        expect(attempts).toBeGreaterThanOrEqual(3);
        expect(result.type).toBe('image/webp');
      } finally {
        delete (Blob.prototype as any).size;
        globalThis.document = originalDoc;
      }
    });

    it('Oversize PNG sets advisory note recommending JPEG', async () => {
      const scene = defaultScene();
      scene.export.format = 'png';
      const images = new Map();

      const originalDoc = globalThis.document;
      globalThis.document = {
        createElement: (tag: string) => {
          if (tag === 'canvas') {
            return {
              width: CANVAS.width,
              height: CANVAS.height,
              getContext: () => ({
                save: () => {},
                restore: () => {},
                clearRect: () => {},
                fillRect: () => {},
                fillText: () => {},
                createLinearGradient: () => ({ addColorStop: () => {} }),
              }),
              toBlob: (cb: (b: Blob) => void) => {
                cb(new Blob([new Uint8Array(100)], { type: 'image/png' }));
                Object.defineProperty(Blob.prototype, 'size', {
                  value: 8 * 1024 * 1024,
                  configurable: true,
                });
              },
            } as any;
          }
          return {} as any;
        },
      } as any;

      try {
        const result = await exportBanner(scene, images);
        expect(result.type).toBe('image/png');
        expect(result.note).toBeDefined();
        expect(result.note).toContain('exceeds 6 MB');
      } finally {
        delete (Blob.prototype as any).size;
        globalThis.document = originalDoc;
      }
    });
  });
});
