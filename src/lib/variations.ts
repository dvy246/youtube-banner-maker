import type { Scene, SceneDesignSystem } from './scene';

/**
 * Color harmony utility: HEX <-> HSL conversions
 */
export function hexToHsl(hex: string): [number, number, number] {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hueToRgb(p: number, q: number, t: number): number {
  let temp = t;
  if (temp < 0) temp += 1;
  if (temp > 1) temp -= 1;
  if (temp < 1 / 6) return p + (q - p) * 6 * temp;
  if (temp < 1 / 2) return q;
  if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
  return p;
}

export function hslToHex(h: number, s: number, l: number): string {
  const normH = (((h % 360) + 360) % 360) / 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normL = Math.max(0, Math.min(100, l)) / 100;

  let r: number, g: number, b: number;

  if (normS === 0) {
    r = g = b = normL;
  } else {
    const q = normL < 0.5 ? normL * (1 + normS) : normL + normS - normL * normS;
    const p = 2 * normL - q;
    r = hueToRgb(p, q, normH + 1 / 3);
    g = hueToRgb(p, q, normH);
    b = hueToRgb(p, q, normH - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rotateHue(hex: string, deltaDegrees: number): string {
  if (!hex.startsWith('#')) return hex;
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h + deltaDegrees, s, l);
}

export function invertLuminance(hex: string): string {
  if (!hex.startsWith('#')) return hex;
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, 100 - l);
}

export type VariationType =
  | 'original'
  | 'dark'
  | 'editorial'
  | 'cyberpunk'
  | 'minimalist'
  | 'sunset'
  | 'warm'
  | 'cool';

/**
 * Compute one of the instant style variations from a template's design system.
 * Supports 6 curated aesthetic vibes (Original, Dark Noir, Editorial Warm Pearl,
 * Cyberpunk Neon, Stealth Minimalist, Sunset Luxe) plus dynamic hue shifts.
 */
export function computeVariation(
  ds: SceneDesignSystem,
  type: VariationType
): SceneDesignSystem {
  if (type === 'original') {
    return JSON.parse(JSON.stringify(ds));
  }

  const p = ds.palette;
  const t = ds.typography;

  if (type === 'dark') {
    return {
      ...ds,
      palette: {
        primary: '#FFFFFF',
        secondary: '#9CA3AF',
        surface: '#0A0B0D',
        accent: rotateHue(p.accent, 15),
      },
      typography: { ...t },
    };
  }

  if (type === 'editorial') {
    return {
      ...ds,
      palette: {
        primary: '#18181B',
        secondary: '#71717A',
        surface: '#FAF8F5',
        accent: '#C26738',
      },
      typography: { ...t },
    };
  }

  if (type === 'cyberpunk') {
    return {
      ...ds,
      palette: {
        primary: '#00F0FF',
        secondary: '#A855F7',
        surface: '#070913',
        accent: '#FF0055',
      },
      typography: { ...t },
    };
  }

  if (type === 'minimalist') {
    return {
      ...ds,
      palette: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        surface: '#0F172A',
        accent: '#E2E8F0',
      },
      typography: { ...t },
    };
  }

  if (type === 'sunset') {
    return {
      ...ds,
      palette: {
        primary: '#FFAA40',
        secondary: '#F472B6',
        surface: '#140A26',
        accent: '#FF4572',
      },
      typography: { ...t },
    };
  }

  if (type === 'warm') {
    return {
      ...ds,
      palette: {
        primary: rotateHue(p.primary, 30),
        secondary: rotateHue(p.secondary, 20),
        surface: rotateHue(p.surface, 25),
        accent: rotateHue(p.accent, 35),
      },
      typography: { ...t },
    };
  }

  if (type === 'cool') {
    return {
      ...ds,
      palette: {
        primary: rotateHue(p.primary, -30),
        secondary: rotateHue(p.secondary, -20),
        surface: rotateHue(p.surface, -25),
        accent: rotateHue(p.accent, -35),
      },
      typography: { ...t },
    };
  }

  return JSON.parse(JSON.stringify(ds));
}

/**
 * Apply a design system to a scene atomically.
 * Automatically updates text colors, typography, backplates, accent borders,
 * and background gradient to maintain visual cohesion.
 */
export function applyDesignSystemToScene(scene: Scene, ds: SceneDesignSystem): Scene {
  const next = JSON.parse(JSON.stringify(scene)) as Scene;
  next.designSystem = ds;

  const { palette, typography } = ds;

  // 1. Update text layers
  for (const layer of next.layers) {
    if (layer.type === 'text') {
      if (layer.id === 'title' || layer.id.includes('title')) {
        layer.color = palette.primary;
        if (typography.titleFont) {
          layer.font = typography.titleFont;
        }
      } else if (layer.id === 'tagline' || layer.id.includes('tagline') || layer.id.includes('subtitle')) {
        layer.color = palette.secondary;
        if (typography.taglineFont) {
          layer.font = typography.taglineFont;
        }
      }
    } else if (layer.type === 'shape') {
      if (layer.id.includes('backplate') || layer.id.includes('card') || layer.id.includes('bg')) {
        layer.color = palette.surface;
      } else {
        layer.color = palette.accent;
      }
    } else if (layer.type === 'frame') {
      layer.borderColor = palette.accent;
    }
  }

  // 2. Update gradient background if present
  if (next.background.type === 'gradient') {
    // Derive subtle gradient from surface and dark tone
    next.background.from = palette.surface;
    const [h, s, l] = hexToHsl(palette.surface);
    next.background.to = hslToHex(h, s, Math.max(4, l - 8));
  } else if (next.background.type === 'solid') {
    next.background.color = palette.surface;
  }

  return next;
}
