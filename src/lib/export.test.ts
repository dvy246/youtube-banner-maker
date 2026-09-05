import { describe, it, expect } from 'vitest';
import { exportBanner } from './export';
import { defaultScene } from './scene';
import { CANVAS, MAX_UPLOAD_BYTES, JPEG_QUALITY_FLOOR } from './spec';
import { renderExport } from './render';

describe('export.ts (M-6, M-7, M-8, M-9, REQ-006, REQ-010, REQ-011, REQ-012, REQ-025)', () => {
  it('M-6: renderExport returns 2560x1440 canvas requested with sRGB colorSpace', () => {
    const scene = defaultScene();
    const images = new Map();

    // Mock document.createElement for node test env
    const mockCtx = {
      canvas: { width: CANVAS.width, height: CANVAS.height },
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      fillText: () => {},
    };

    let requestedColorSpace = '';
    const originalDoc = globalThis.document;
    globalThis.document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: (_type: string, options: any) => {
              if (options && options.colorSpace) {
                requestedColorSpace = options.colorSpace;
              }
              return mockCtx;
            },
          } as unknown as HTMLCanvasElement;
        }
        return {} as any;
      },
    } as any;

    try {
      const canvas = renderExport(scene, images);
      expect(canvas.width).toBe(CANVAS.width);
      expect(canvas.height).toBe(CANVAS.height);
      expect(requestedColorSpace).toBe('srgb');
    } finally {
      globalThis.document = originalDoc;
    }
  });

  it('M-7: Mismatched blob.type is verified, note is set, and filename matches reality', async () => {
    const scene = defaultScene();
    scene.export.format = 'jpeg'; // requested jpeg
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
              createLinearGradient: () => ({ addColorStop: () => {} }),
              fillText: () => {},
            }),
            toBlob: (cb: (b: Blob) => void, _mime: string, _q: number) => {
              // Stub browser returning PNG instead of JPEG
              cb(new Blob([new Uint8Array(1024)], { type: 'image/png' }));
            },
          } as unknown as HTMLCanvasElement;
        }
        return {} as any;
      },
    } as any;

    try {
      const result = await exportBanner(scene, images);
      expect(result.requestedType).toBe('image/jpeg');
      expect(result.type).toBe('image/png');
      expect(result.filename).toBe('youtube-banner-2560x1440.png');
      expect(result.note).toBeDefined();
      expect(result.note).toContain('PNG');
    } finally {
      globalThis.document = originalDoc;
    }
  });

  it('M-8: Oversize export converges under 6 MB in >= 3 steps and respects floor 0.7', async () => {
    const scene = defaultScene();
    scene.export.format = 'jpeg';
    const images = new Map();

    let attempts = 0;
    const qualitiesTested: number[] = [];

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
              createLinearGradient: () => ({ addColorStop: () => {} }),
              fillText: () => {},
            }),
            toBlob: (cb: (b: Blob) => void, _mime: string, q: number) => {
              attempts++;
              qualitiesTested.push(q);
              // If q > 0.75, simulate size > 6 MB, else <= 6 MB
              const size = q > 0.75 ? 7 * 1024 * 1024 : 4 * 1024 * 1024;
              cb(new Blob([new Uint8Array(100)], { type: 'image/jpeg' }));
              Object.defineProperty(Blob.prototype, 'size', {
                value: size,
                configurable: true,
              });
            },
          } as unknown as HTMLCanvasElement;
        }
        return {} as any;
      },
    } as any;

    try {
      const result = await exportBanner(scene, images);
      expect(attempts).toBeGreaterThanOrEqual(3);
      // Ensure quality never went below 0.7
      for (const q of qualitiesTested) {
        expect(q).toBeGreaterThanOrEqual(JPEG_QUALITY_FLOOR);
      }
      expect(result.bytes).toBeLessThanOrEqual(MAX_UPLOAD_BYTES);
    } finally {
      delete (Blob.prototype as any).size;
      globalThis.document = originalDoc;
    }
  });

  it('M-9: Ten consecutive exports all succeed without throttle or limit', async () => {
    const scene = defaultScene();
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
              createLinearGradient: () => ({ addColorStop: () => {} }),
              fillText: () => {},
            }),
            toBlob: (cb: (b: Blob) => void) => {
              cb(new Blob([new Uint8Array(200)], { type: 'image/png' }));
            },
          } as unknown as HTMLCanvasElement;
        }
        return {} as any;
      },
    } as any;

    try {
      for (let i = 0; i < 10; i++) {
        const result = await exportBanner(scene, images);
        expect(result).toBeDefined();
        expect(result.width).toBe(2560);
        expect(result.height).toBe(1440);
        expect(result.type).toBe('image/png');
      }
    } finally {
      globalThis.document = originalDoc;
    }
  });
});
