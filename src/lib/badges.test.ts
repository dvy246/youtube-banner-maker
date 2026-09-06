import { describe, it, expect, vi } from 'vitest';
import { renderBadge } from './badges';
import type { BadgeLayer } from './scene';

function createMockContext(): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    quadraticCurveTo: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 120 }),
    roundRect: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

describe('badges.ts — YouTube-Native Conversion Badges', () => {
  it('renders subscribe-pill variant with play icon and text', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'sub-btn',
      type: 'badge',
      variant: 'subscribe-pill',
      x: 0.5,
      y: 0.65,
      scale: 1.0,
      colorScheme: 'youtube-red',
      text: 'SUBSCRIBE',
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalledWith('SUBSCRIBE', expect.any(Number), expect.any(Number));
  });

  it('renders subscribe-cookie meme badge variant', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'cookie-badge',
      type: 'badge',
      variant: 'subscribe-cookie',
      x: 0.5,
      y: 0.65,
      scale: 1.2,
      text: 'Subscribe for a cookie',
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.fillText).toHaveBeenCalledWith(
      'Subscribe for a cookie',
      expect.any(Number),
      expect.any(Number)
    );
    expect(ctx.arc).toHaveBeenCalled(); // Cookie & chocolate chips
  });

  it('renders bell-pill notification variant', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'bell-badge',
      type: 'badge',
      variant: 'bell-pill',
      x: 0.5,
      y: 0.65,
      text: 'ALL NOTIFICATIONS',
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.fillText).toHaveBeenCalledWith(
      'ALL NOTIFICATIONS',
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('renders schedule-tag variant with live indicator', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'schedule-badge',
      type: 'badge',
      variant: 'schedule-tag',
      x: 0.5,
      y: 0.65,
      text: 'NEW VIDEOS EVERY TUESDAY',
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.fillText).toHaveBeenCalledWith(
      'NEW VIDEOS EVERY TUESDAY',
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('renders social-row variant with handle', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'social-badge',
      type: 'badge',
      variant: 'social-row',
      x: 0.5,
      y: 0.65,
      text: '@gamingpro',
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.fillText).toHaveBeenCalledWith('@gamingpro', expect.any(Number), expect.any(Number));
  });

  it('renders verified-check variant', () => {
    const ctx = createMockContext();
    const layer: BadgeLayer = {
      id: 'verified-badge',
      type: 'badge',
      variant: 'verified-check',
      x: 0.62,
      y: 0.46,
    };

    renderBadge(ctx, layer, 2560, 1440);
    expect(ctx.arc).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });
});
