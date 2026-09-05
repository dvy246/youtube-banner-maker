import { describe, it, expect } from 'vitest';

export interface PaletteOption {
  id: string;
  name: string;
  accentColor: string;
  description: string;
  isDark?: boolean;
}

export const PALETTES: PaletteOption[] = [
  { id: 'cobalt', name: 'Cobalt', accentColor: '#2340B8', description: 'Classic Deep Blue' },
  { id: 'emerald', name: 'Emerald', accentColor: '#059669', description: 'Studio Green' },
  { id: 'violet', name: 'Violet', accentColor: '#7C3AED', description: 'Electric Violet' },
  { id: 'crimson', name: 'Crimson', accentColor: '#E11D48', description: 'YouTube Ruby' },
  { id: 'amber', name: 'Amber', accentColor: '#D97706', description: 'Warm Bronze' },
  { id: 'cyan', name: 'Cyan', accentColor: '#0891B2', description: 'Cyber Cyan' },
  { id: 'obsidian', name: 'Obsidian', accentColor: '#3B82F6', description: 'Dark Mode', isDark: true },
  { id: 'sand', name: 'Sand', accentColor: '#C2410C', description: 'Editorial Paper' },
];

describe('Color Palette System', () => {
  it('defines 8 curated palettes with unique IDs', () => {
    expect(PALETTES.length).toBe(8);
    const ids = new Set(PALETTES.map((p) => p.id));
    expect(ids.size).toBe(8);
  });

  it('includes cobalt as the signature default palette', () => {
    const cobalt = PALETTES.find((p) => p.id === 'cobalt');
    expect(cobalt).toBeDefined();
    expect(cobalt?.accentColor.toUpperCase()).toBe('#2340B8');
  });

  it('has valid 6-character hex color codes for all palettes', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const palette of PALETTES) {
      expect(palette.accentColor).toMatch(hexRegex);
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
