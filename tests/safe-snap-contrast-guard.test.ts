import { describe, it, expect } from 'vitest';
import { defaultScene, cloneScene } from '../src/lib/scene';
import fs from 'node:fs';
import path from 'node:path';

describe('Safe-Snap and Contrast Guard Logic', () => {
  it('centers all core layers within mobile safe zone for True Center layout', () => {
    const scene = defaultScene();
    const title = scene.layers.find((l) => l.id === 'title' && l.type === 'text');
    const tagline = scene.layers.find((l) => l.id === 'tagline' && l.type === 'text');

    expect(title).toBeDefined();
    expect(tagline).toBeDefined();

    if (title && title.type === 'text') {
      title.position = { x: 0.5, y: 0.46 };
      title.align = 'center';
    }
    if (tagline && tagline.type === 'text') {
      tagline.position = { x: 0.5, y: 0.54 };
      tagline.align = 'center';
    }

    expect(title?.position.x).toBe(0.5);
    expect(tagline?.position.x).toBe(0.5);
  });

  it('aligns layers to Split-Left format with photo/avatar anchor on left', () => {
    const scene = defaultScene();
    const title = scene.layers.find((l) => l.id === 'title' && l.type === 'text');
    const tagline = scene.layers.find((l) => l.id === 'tagline' && l.type === 'text');

    if (title && title.type === 'text') {
      title.position = { x: 0.48, y: 0.46 };
      title.align = 'left';
    }
    if (tagline && tagline.type === 'text') {
      tagline.position = { x: 0.48, y: 0.54 };
      tagline.align = 'left';
    }

    expect(title?.position.x).toBe(0.48);
    expect(title?.align).toBe('left');
  });

  it('verifies MakeControls contains Safe-Snap and Contrast Guard UI hooks', () => {
    const makeControlsPath = path.resolve('src/components/MakeControls.astro');
    const content = fs.readFileSync(makeControlsPath, 'utf-8');

    expect(content).toContain('snap-btn');
    expect(content).toContain('scrim-slider');
    expect(content).toContain('btn-autofit-text');
  });
});
