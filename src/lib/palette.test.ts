import { describe, it, expect } from 'vitest';
import { PALETTES } from './palette';

describe('Color Palette System', () => {
  it('defines 10 curated palettes with unique IDs', () => {
    expect(PALETTES.length).toBe(10);
    const ids = new Set(PALETTES.map((p) => p.id));
    expect(ids.size).toBe(10);
  });

  it('includes pearl as the primary signature beige & red palette', () => {
    const pearl = PALETTES[0];
    expect(pearl.id).toBe('pearl');
    expect(pearl.accentColor.toUpperCase()).toBe('#F62440');
    expect(pearl.colors).toEqual(['#FFFAF3', '#FFF2DB', '#FFE5BF', '#F62440']);
  });

  it('includes crimson as an available palette', () => {
    const crimson = PALETTES.find((p) => p.id === 'crimson');
    expect(crimson).toBeDefined();
    expect(crimson?.accentColor.toUpperCase()).toBe('#E63946');
  });

  it('includes cobalt as an available palette', () => {
    const cobalt = PALETTES.find((p) => p.id === 'cobalt');
    expect(cobalt).toBeDefined();
    expect(cobalt?.accentColor.toUpperCase()).toBe('#2340B8');
  });

  it('has valid 6-character hex color codes for all palettes', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const palette of PALETTES) {
      expect(palette.accentColor).toMatch(hexRegex);
      expect(palette.accentHover).toMatch(hexRegex);
      expect(palette.accentLight).toMatch(hexRegex);
    }
  });

  it('correctly flags obsidian as dark mode', () => {
    const obsidian = PALETTES.find((p) => p.id === 'obsidian');
    expect(obsidian?.isDark).toBe(true);
  });

  it('all palettes have informative descriptions and human-readable names', () => {
    for (const p of PALETTES) {
      expect(p.name.length).toBeGreaterThan(2);
      expect(p.description.length).toBeGreaterThan(5);
    }
  });
});
