import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { computeVariation, type VariationType } from '../src/lib/variations';
import { exportAvatar, AVATAR_SIZE } from '../src/lib/export';
import { defaultScene, type SceneDesignSystem } from '../src/lib/scene';

describe('Aesthetic Vibes, Avatar Export & Button Elegance Regression Suite', () => {
  it('supports all 6 curated vibes in computeVariation', () => {
    const baseDs: SceneDesignSystem = {
      palette: {
        primary: '#FFFFFF',
        secondary: '#A1A1AA',
        surface: '#18181B',
        accent: '#2340B8',
      },
      typography: {
        titleFont: 'bebas-400',
        taglineFont: 'inter-500',
      },
      layout: 'editorial',
    };

    const vibes: VariationType[] = ['original', 'dark', 'editorial', 'cyberpunk', 'minimalist', 'sunset'];
    for (const vibe of vibes) {
      const variation = computeVariation(baseDs, vibe);
      expect(variation).toBeDefined();
      expect(variation.palette.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(variation.palette.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(variation.palette.surface).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(variation.palette.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('exportAvatar renders 800x800 square export result with correct dimensions', async () => {
    const scene = defaultScene();
    const images = new Map();

    const originalDoc = globalThis.document;
    globalThis.document = {
      createElement: (tag: string) => {
        if (tag === 'canvas') {
          return {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            getContext: () => ({
              save: () => {},
              restore: () => {},
              clearRect: () => {},
              fillRect: () => {},
              beginPath: () => {},
              arc: () => {},
              closePath: () => {},
              clip: () => {},
              stroke: () => {},
              fill: () => {},
              drawImage: () => {},
              createLinearGradient: () => ({ addColorStop: () => {} }),
              createRadialGradient: () => ({ addColorStop: () => {} }),
              fillText: () => {},
            }),
            toBlob: (cb: (b: Blob) => void) => {
              cb(new Blob([new Uint8Array(256)], { type: 'image/png' }));
            },
          } as unknown as HTMLCanvasElement;
        }
        return {} as any;
      },
    } as any;

    try {
      const result = await exportAvatar(scene, images);
      expect(result.width).toBe(800);
      expect(result.height).toBe(800);
      expect(result.filename).toBe('youtube-avatar-800x800.png');
    } finally {
      globalThis.document = originalDoc;
    }
  });

  it('enforces curved geometry on ExportButton.astro avatar export button', () => {
    const content = readFileSync(resolve(__dirname, '../src/components/ExportButton.astro'), 'utf-8');
    expect(content).toContain('id="export-avatar-button"');
    expect(content).toContain('rounded-full');
    expect(content).toContain('active:scale-[0.98]');
  });

  it('enforces curved geometry on MakeControls.astro 6 vibe buttons', () => {
    const content = readFileSync(resolve(__dirname, '../src/components/MakeControls.astro'), 'utf-8');
    expect(content).toContain('data-variation="editorial"');
    expect(content).toContain('data-variation="cyberpunk"');
    expect(content).toContain('data-variation="minimalist"');
    expect(content).toContain('data-variation="sunset"');
    expect(content).toContain('variation-btn');
    expect(content).toContain('rounded-xl');
    expect(content).toContain('active:scale-[0.98]');
  });
});
