export interface FontDef {
  key: string;
  family: string;
  weight: number;
  url: string;
}

export const FONTS: Record<string, FontDef> = {
  'sora-700': {
    key: 'sora-700',
    family: 'Sora',
    weight: 700,
    url: 'https://fonts.gstatic.com/s/sora/v12/xMQbuFFYT72XzQspDrWd0n54L3b3lpZphr58.woff2',
  },
  'inter-500': {
    key: 'inter-500',
    family: 'Inter',
    weight: 500,
    url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
  },
  'inter-700': {
    key: 'inter-700',
    family: 'Inter',
    weight: 700,
    url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
  },
  'bebas-400': {
    key: 'bebas-400',
    family: 'Bebas Neue',
    weight: 400,
    url: 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9WlhyyTh89Y.woff2',
  },
  'space-grotesk-700': {
    key: 'space-grotesk-700',
    family: 'Space Grotesk',
    weight: 700,
    url: 'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj52mHvd.woff2',
  },
  'playfair-700': {
    key: 'playfair-700',
    family: 'Playfair Display',
    weight: 700,
    url: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2',
  },
};

const loadedFonts = new Set<string>();

export async function ensureFontLoaded(key: string): Promise<void> {
  if (loadedFonts.has(key)) {
    return;
  }

  const def = FONTS[key];
  if (!def) {
    return;
  }

  if (typeof document === 'undefined' || !('fonts' in document)) {
    loadedFonts.add(key);
    return;
  }

  try {
    const fontFace = new FontFace(def.family, `url(${def.url})`, {
      weight: String(def.weight),
      style: 'normal',
    });
    const loaded = await fontFace.load();
    document.fonts.add(loaded);
    await document.fonts.ready;
    loadedFonts.add(key);
  } catch {
    // If font load fails, record to avoid repeated failed network attempts
    loadedFonts.add(key);
  }
}

export function isFontLoaded(key: string): boolean {
  if (typeof document === 'undefined') return true;
  return loadedFonts.has(key);
}
