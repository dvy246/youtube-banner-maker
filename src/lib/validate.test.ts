import { describe, it, expect } from 'vitest';
import { validateScene } from './validate';
import { defaultScene, type TextLayer } from './scene';
import { MAX_UPLOAD_BYTES } from './spec';

describe('validate.ts (M-12, REQ-013, REQ-003)', () => {
  it('Valid default scene has zero error verdicts', () => {
    const scene = defaultScene();
    const verdicts = validateScene(scene);
    const errors = verdicts.filter((v) => v.severity === 'error');
    expect(errors.length).toBe(0);
  });

  it('M-12: Safe overflow text beyond left bound triggers error with direction', () => {
    const scene = defaultScene();
    const layer = scene.layers[0] as TextLayer;
    // Move title far to the left (x = 0.05, outside SAFE.x = 0.1985)
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
    expect(overflow?.fixable).toBe(true);
    expect(overflow?.action).toBe('reposition');
  });

  it('M-12: Safe overflow text beyond right bound triggers error with direction', () => {
    const scene = defaultScene();
    const layer = scene.layers[0] as TextLayer;
    // Move title far to the right (x = 0.95)
    scene.layers[0] = {
      ...layer,
      position: { x: 0.95, y: 0.46 },
      safeAreaConstrained: true,
    };

    const verdicts = validateScene(scene);
    const overflow = verdicts.find((v) => v.id === 'safe-overflow');
    expect(overflow).toBeDefined();
    expect(overflow?.detail).toContain('Drag it left');
  });

  it('M-12: Safe overflow text beyond top/bottom triggers direction', () => {
    const sceneTop = defaultScene();
    const layerTop = sceneTop.layers[0] as TextLayer;
    sceneTop.layers[0] = {
      ...layerTop,
      position: { x: 0.5, y: 0.1 },
      safeAreaConstrained: true,
    };
    const verdictsTop = validateScene(sceneTop);
    expect(verdictsTop.find((v) => v.id === 'safe-overflow')?.detail).toContain('Drag it down');

    const sceneBottom = defaultScene();
    const layerBottom = sceneBottom.layers[0] as TextLayer;
    sceneBottom.layers[0] = {
      ...layerBottom,
      position: { x: 0.5, y: 0.9 },
      safeAreaConstrained: true,
    };
    const verdictsBottom = validateScene(sceneBottom);
    expect(verdictsBottom.find((v) => v.id === 'safe-overflow')?.detail).toContain('Drag it up');
  });

  it('filesize-over triggers when estimatedBytes > 6 MB', () => {
    const scene = defaultScene();
    const verdicts = validateScene(scene, {
      estimatedBytes: MAX_UPLOAD_BYTES + 1024,
    });
    const fsize = verdicts.find((v) => v.id === 'filesize-over');
    expect(fsize).toBeDefined();
    expect(fsize?.severity).toBe('error');
    expect(fsize?.action).toBe('convert');
  });

  it('low-resolution triggers when sourceRaster < 2048x1152', () => {
    const scene = defaultScene();
    const verdicts = validateScene(scene, {
      sourceRaster: { w: 1280, h: 720 },
    });
    const lowRes = verdicts.find((v) => v.id === 'low-resolution');
    expect(lowRes).toBeDefined();
    expect(lowRes?.severity).toBe('warn');
    expect(lowRes?.device).toBe('tv');
    expect(lowRes?.fixable).toBe(false);
  });

  it('font-not-loaded triggers info verdict', () => {
    const scene = defaultScene();
    const verdicts = validateScene(scene, { fontsLoaded: false });
    const fontVerdict = verdicts.find((v) => v.id === 'font-not-loaded');
    expect(fontVerdict).toBeDefined();
    expect(fontVerdict?.severity).toBe('info');
  });

  it('Verdicts are sorted strictly: error before warn before info', () => {
    const scene = defaultScene();
    const layer = scene.layers[0] as TextLayer;
    // Intentionally cause error + warn + info
    scene.layers[0] = {
      ...layer,
      position: { x: 0.05, y: 0.46 },
      safeAreaConstrained: true,
    };
    const verdicts = validateScene(scene, {
      sourceRaster: { w: 1280, h: 720 }, // warn
      fontsLoaded: false, // info
      includeCacheDelay: true, // info
    });

    expect(verdicts.length).toBeGreaterThanOrEqual(3);
    const severities = verdicts.map((v) => v.severity);
    const errorIdx = severities.indexOf('error');
    const warnIdx = severities.indexOf('warn');
    const infoIdx = severities.indexOf('info');

    expect(errorIdx).toBeLessThan(warnIdx);
    expect(warnIdx).toBeLessThan(infoIdx);
  });
});
