import { describe, it, expect } from 'vitest';
import { defaultScene, serializeScene, deserializeScene, cloneScene, SCENE_KEY } from './scene';
import { CANVAS } from './spec';

describe('scene.ts (M-11, REQ-022)', () => {
  it('defaultScene returns valid scene', () => {
    const s = defaultScene();
    expect(s.version).toBe(1);
    expect(s.canvas.width).toBe(CANVAS.width);
    expect(s.canvas.height).toBe(CANVAS.height);
    expect(s.layers.length).toBeLessThanOrEqual(8);
    expect(s.export.format).toBe('png');
  });

  it('serialize and deserialize round-trip correctly', () => {
    const s = defaultScene();
    const raw = serializeScene(s);
    const restored = deserializeScene(raw);
    expect(restored).not.toBeNull();
    expect(restored).toEqual(s);
  });

  it('M-11: deserializeScene returns null on version mismatch', () => {
    const s = defaultScene();
    const raw = JSON.stringify({ ...s, version: 2 });
    expect(deserializeScene(raw)).toBeNull();
  });

  it('M-11: deserializeScene returns null on missing required fields', () => {
    expect(deserializeScene('')).toBeNull();
    expect(deserializeScene('{}')).toBeNull();
    expect(deserializeScene('invalid-json')).toBeNull();
    expect(deserializeScene(JSON.stringify({ version: 1 }))).toBeNull();
    expect(deserializeScene(JSON.stringify({ version: 1, canvas: { width: 100 } }))).toBeNull();
  });

  it('M-11: deserializeScene returns null on >8 layers', () => {
    const s = defaultScene();
    const layers = Array.from({ length: 9 }, (_, i) => ({
      id: `layer-${i}`,
      type: 'text' as const,
      text: `Text ${i}`,
      font: 'sora-700',
      size: 40,
      color: '#ffffff',
      align: 'center' as const,
      position: { x: 0.5, y: 0.5 },
      safeAreaConstrained: true,
    }));
    const raw = JSON.stringify({ ...s, layers });
    expect(deserializeScene(raw)).toBeNull();
  });

  it('cloneScene produces a deep immutable copy', () => {
    const s = defaultScene();
    const copy = cloneScene(s);
    expect(copy).toEqual(s);
    copy.canvas.width = 100;
    expect(s.canvas.width).toBe(CANVAS.width);
  });

  it('supports background studio scrim configuration in scene serialization', () => {
    const s = defaultScene();
    (s.background as any).scrim = { enabled: true, intensity: 0.6, type: 'radial' };

    const raw = serializeScene(s);
    const restored = deserializeScene(raw);
    expect(restored).not.toBeNull();
    expect((restored?.background as any).scrim?.enabled).toBe(true);
    expect((restored?.background as any).scrim?.intensity).toBe(0.6);
  });

  it('supports aeroPlate frosted glass configuration on text layers', () => {
    const s = defaultScene();
    (s.layers[0] as any).aeroPlate = { enabled: true, style: 'dark-frosted', padding: 16 };

    const raw = serializeScene(s);
    const restored = deserializeScene(raw);
    expect(restored).not.toBeNull();
    expect((restored?.layers[0] as any).aeroPlate?.enabled).toBe(true);
    expect((restored?.layers[0] as any).aeroPlate?.style).toBe('dark-frosted');
  });

  it('supports multi-platform social handles in badge layers', () => {
    const s = defaultScene();
    s.layers.push({
      id: 'social-badge',
      type: 'badge',
      variant: 'social-row',
      x: 0.5,
      y: 0.65,
      text: '@channel',
      platforms: ['youtube', 'x', 'instagram'],
    } as any);

    const raw = serializeScene(s);
    const restored = deserializeScene(raw);
    expect(restored).not.toBeNull();
    const badge = restored?.layers.find((l) => l.id === 'social-badge');
    expect(badge).toBeDefined();
    expect((badge as any).platforms).toEqual(['youtube', 'x', 'instagram']);
  });

  it('SCENE_KEY is ybm.scene.v1', () => {
    expect(SCENE_KEY).toBe('ybm.scene.v1');
  });
});
