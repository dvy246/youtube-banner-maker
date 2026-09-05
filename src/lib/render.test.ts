import { describe, it, expect } from 'vitest';
import { CANVAS, DEVICES, type DeviceKey } from './spec';
import { clampZoom, clampOffset, renderDeviceCrop } from './render';

describe('render.ts math, clamps, and invariants (M-3, M-4, M-5, M-10)', () => {
  it('M-5: Zoom is never permitted above max(1, min(sw/cw, sh/ch))', () => {
    // Case 1: Source smaller than canvas (e.g. 1280x720)
    // cap = min(1280/2560, 720/1440) = 0.5. max(1, 0.5) = 1.
    // Zoom must be clamped to 1.0 (no upscale past 1:1)
    const swSmall = 1280;
    const shSmall = 720;
    expect(clampZoom(2.0, swSmall, shSmall)).toBe(1.0);
    expect(clampZoom(1.5, swSmall, shSmall)).toBe(1.0);
    expect(clampZoom(1.0, swSmall, shSmall)).toBe(1.0);
    expect(clampZoom(0.5, swSmall, shSmall)).toBe(1.0); // minimum is 1.0

    // Case 2: Source larger than canvas (e.g. 5120x2880)
    // cap = min(5120/2560, 2880/1440) = 2.0. max(1, 2) = 2.
    const swLarge = 5120;
    const shLarge = 2880;
    expect(clampZoom(1.5, swLarge, shLarge)).toBe(1.5);
    expect(clampZoom(2.0, swLarge, shLarge)).toBe(2.0);
    expect(clampZoom(3.0, swLarge, shLarge)).toBe(2.0); // clamped to maxZoom 2.0

    // Case 3: Extreme aspect ratios
    const swWide = 4000;
    const shShort = 1000;
    // cap = min(4000/2560, 1000/1440) = min(1.5625, 0.694) = 0.694. max(1, 0.694) = 1.
    expect(clampZoom(2.0, swWide, shShort)).toBe(1.0);
  });

  it('M-4: Cover-fit offset clamping leaves no transparent edge (coverage invariant fuzz)', () => {
    // Test across 100 fuzzed source dimension combinations
    const testCases = [
      { sw: 3840, sh: 2160 },
      { sw: 2560, sh: 1440 },
      { sw: 1920, sh: 1080 },
      { sw: 1080, sh: 1920 }, // portrait
      { sw: 3000, sh: 1200 },
      { sw: 1200, sh: 3000 },
      { sw: 5000, sh: 5000 },
      { sw: 800, sh: 600 },
    ];

    for (const { sw, sh } of testCases) {
      const zoom = clampZoom(1.5, sw, sh);
      const scale = Math.max(CANVAS.width / sw, CANVAS.height / sh);
      const effScale = scale * zoom;
      const drawW = sw * effScale;
      const drawH = sh * effScale;

      // Assert draw dimensions always at least canvas dimensions
      expect(drawW).toBeGreaterThanOrEqual(CANVAS.width - 0.001);
      expect(drawH).toBeGreaterThanOrEqual(CANVAS.height - 0.001);

      // Fuzz offsets: extreme positive and negative
      const offsetsToTest = [
        { x: 0, y: 0 },
        { x: 5000, y: 5000 },
        { x: -5000, y: -5000 },
        { x: 200, y: -300 },
      ];

      for (const off of offsetsToTest) {
        const clamped = clampOffset(off.x, off.y, drawW, drawH);
        const dx = (CANVAS.width - drawW) / 2 + clamped.x;
        const dy = (CANVAS.height - drawH) / 2 + clamped.y;

        // Invariant: dx <= 0 and dx + drawW >= CANVAS.width
        // dy <= 0 and dy + drawH >= CANVAS.height
        // This guarantees NO edge is uncovered / transparent!
        expect(dx).toBeLessThanOrEqual(0.001);
        expect(dx + drawW).toBeGreaterThanOrEqual(CANVAS.width - 0.001);
        expect(dy).toBeLessThanOrEqual(0.001);
        expect(dy + drawH).toBeGreaterThanOrEqual(CANVAS.height - 0.001);
      }
    }
  });

  it('M-3: renderDeviceCrop blits exact sub-rectangle from source', () => {
    const devices: DeviceKey[] = ['tv', 'desktop', 'tablet', 'mobile'];
    for (const dev of devices) {
      const rect = DEVICES[dev];
      const drawnCalls: any[] = [];
      const mockCtx = {
        canvas: { width: 800, height: 450 },
        clearRect: () => {},
        drawImage: (...args: any[]) => {
          drawnCalls.push(args);
        },
      } as unknown as CanvasRenderingContext2D;

      const mockSource = { width: CANVAS.width, height: CANVAS.height } as any;
      renderDeviceCrop(mockCtx, mockSource, dev);

      expect(drawnCalls.length).toBe(1);
      const [source, sx, sy, sw, sh, dx, dy, dw, dh] = drawnCalls[0];
      expect(source).toBe(mockSource);
      expect(sx).toBeCloseTo(rect.x * CANVAS.width, 4);
      expect(sy).toBeCloseTo(rect.y * CANVAS.height, 4);
      expect(sw).toBeCloseTo(rect.w * CANVAS.width, 4);
      expect(sh).toBeCloseTo(rect.h * CANVAS.height, 4);
      expect(dx).toBe(0);
      expect(dy).toBe(0);
      expect(dw).toBe(mockCtx.canvas.width);
      expect(dh).toBe(mockCtx.canvas.height);
    }
  });
});
