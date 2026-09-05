import { describe, it, expect } from 'vitest';
import {
  CANVAS,
  SAFE,
  SAFE_PX,
  DEVICES,
  DEVICE_ORDER,
  SERVED_WIDTHS,
  DESKTOP_SERVED_WIDTH,
  REENCODE_BUDGET_BYTES,
  MAX_UPLOAD_BYTES,
  JPEG_QUALITY_FLOOR,
} from './spec';

describe('Engine Spec & Geometry Invariants', () => {
  it('confirms canvas dimensions are 2560x1440', () => {
    expect(CANVAS.width).toBe(2560);
    expect(CANVAS.height).toBe(1440);
  });

  it('REQ-004: confirms safe area arithmetic reconciliation between 2048x1152 and 2560x1440', () => {
    // Assert explicit spec values
    expect(SAFE_PX.min.width).toBe(1235);
    expect(SAFE_PX.min.height).toBe(338);
    expect(SAFE_PX.full.width).toBe(1546);
    expect(SAFE_PX.full.height).toBe(423);

    // Check fraction relationship (scaled by ~1.25x between min 2048x1152 and full 2560x1440)
    expect(SAFE.w).toBe(0.603);
    expect(SAFE.h).toBe(0.293);
    expect(Math.round(2048 * SAFE.w)).toBe(SAFE_PX.min.width);
    expect(Math.round(1152 * SAFE.h)).toBe(SAFE_PX.min.height);
  });

  it('REQ-001: confirms device crop fractions match verified fcrop tokens', () => {
    expect(DEVICES.tv).toEqual({ x: 0, y: 0, w: 1.0, h: 1.0 });
    expect(DEVICES.desktop.x).toBe(0);
    expect(Math.abs(DEVICES.desktop.y - 0.3529)).toBeLessThan(0.0001);
    expect(DEVICES.desktop.w).toBe(1.0);
    expect(Math.abs(DEVICES.desktop.h - 0.2942)).toBeLessThan(0.0001);

    expect(DEVICES.tablet.x).toBe(0.1377);
    expect(DEVICES.tablet.y).toBe(0);
    expect(DEVICES.tablet.w).toBe(0.7246);
    expect(DEVICES.tablet.h).toBe(1.0);

    expect(DEVICES.mobile).toEqual(SAFE);
  });

  it('confirms device ordering and upload constraints', () => {
    expect(DEVICE_ORDER).toEqual(['tv', 'desktop', 'tablet', 'mobile']);
    expect(SERVED_WIDTHS).toEqual([1060, 1138, 1707, 2120, 2276, 2560]);
    expect(DESKTOP_SERVED_WIDTH).toBe(1707);
    expect(REENCODE_BUDGET_BYTES.desktop).toBe(134_000);
    expect(REENCODE_BUDGET_BYTES.full).toBe(263_000);
    expect(MAX_UPLOAD_BYTES).toBe(6 * 1024 * 1024);
    expect(JPEG_QUALITY_FLOOR).toBe(0.7);
  });
});
