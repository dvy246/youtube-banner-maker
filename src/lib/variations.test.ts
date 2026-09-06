import { describe, it, expect } from 'vitest';
import {
  hexToHsl,
  hslToHex,
  rotateHue,
  invertLuminance,
  computeVariation,
  applyDesignSystemToScene,
} from './variations';
import { defaultScene, type SceneDesignSystem, type TextLayer } from './scene';

describe('variations.ts — Design System Tokens & Style Variations', () => {
  it('converts HEX to HSL and back with minimal rounding delta', () => {
    const hex = '#FF0000';
    const [h, s, l] = hexToHsl(hex);
    expect(h).toBe(0);
    expect(s).toBe(100);
    expect(l).toBe(50);
    const roundTrip = hslToHex(h, s, l);
    expect(roundTrip.toUpperCase()).toBe(hex.toUpperCase());
  });

  it('rotates hue correctly', () => {
    const red = '#FF0000';
    const shifted = rotateHue(red, 120); // Red + 120 deg -> Green
    const [h] = hexToHsl(shifted);
    expect(h).toBe(120);
  });

  it('inverts luminance properly', () => {
    const black = '#000000';
    const inverted = invertLuminance(black);
    expect(inverted).toBe('#FFFFFF');
  });

  it('computes 4 instant style variations', () => {
    const baseDs: SceneDesignSystem = {
      palette: {
        primary: '#FFE600',
        secondary: '#FFFFFF',
        surface: '#1A002C',
        accent: '#FF0055',
      },
      typography: {
        titleFont: 'bebas-400',
        taglineFont: 'inter-500',
      },
      layout: 'editorial',
    };

    const orig = computeVariation(baseDs, 'original');
    expect(orig).toEqual(baseDs);

    const dark = computeVariation(baseDs, 'dark');
    expect(dark.palette.primary).toBe('#FFFFFF');
    expect(dark.palette.surface).toBe('#0A0B0D');

    const warm = computeVariation(baseDs, 'warm');
    expect(warm.palette.primary).not.toBe(baseDs.palette.primary);

    const cool = computeVariation(baseDs, 'cool');
    expect(cool.palette.primary).not.toBe(baseDs.palette.primary);
    expect(cool.palette.primary).not.toBe(warm.palette.primary);
  });

  it('applies design system tokens atomically across all scene layers', () => {
    const scene = defaultScene();
    const ds: SceneDesignSystem = {
      palette: {
        primary: '#00F0FF',
        secondary: '#A5B4FC',
        surface: '#0F172A',
        accent: '#38BDF8',
      },
      typography: {
        titleFont: 'bebas-400',
        taglineFont: 'jetbrains-mono-700',
      },
    };

    const updated = applyDesignSystemToScene(scene, ds);
    expect(updated.designSystem).toEqual(ds);

    const titleLayer = updated.layers.find((l): l is TextLayer => l.id === 'title' && l.type === 'text');
    expect(titleLayer?.color).toBe('#00F0FF');
    expect(titleLayer?.font).toBe('bebas-400');

    const taglineLayer = updated.layers.find((l): l is TextLayer => l.id === 'tagline' && l.type === 'text');
    expect(taglineLayer?.color).toBe('#A5B4FC');
    expect(taglineLayer?.font).toBe('jetbrains-mono-700');
  });
});
