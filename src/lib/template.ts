import { CANVAS } from './spec';
import type { Scene, Background, TextLayer, ShapeLayer, PhotoFrameLayer, BadgeLayer, SceneDesignSystem } from './scene';
import { TEMPLATES } from '../data/templates';

export type TemplateDesignSystem = SceneDesignSystem;

export interface TemplateLayerManifest {
  id?: string;
  role?: 'title' | 'tagline' | 'shape' | 'frame' | 'avatar' | 'badge' | string;
  type?: 'text' | 'shape' | 'frame' | 'badge';
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  shape?: 'rect' | 'circle' | 'line';
  opacity?: number;
  safeAreaConstrained?: boolean;
  position?: { x: number; y: number };
  src?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  variant?:
    | 'subscribe-pill'
    | 'subscribe-cookie'
    | 'bell-pill'
    | 'social-row'
    | 'schedule-tag'
    | 'verified-check';
  scale?: number;
  colorScheme?: 'youtube-red' | 'theme-accent' | 'mono-dark' | 'mono-light';
}

export interface TemplateManifest {
  id: string;
  niche: string;
  name: string;
  preview: string;
  description?: string;
  scene: {
    background: Background;
    layers: TemplateLayerManifest[];
  };
  editable: string[];
  protected: string[];
  safeAreaValidated: boolean;
  designSystem?: TemplateDesignSystem;
}

export function templateToScene(m: TemplateManifest): Scene {
  const convertedLayers: Array<TextLayer | ShapeLayer | PhotoFrameLayer | BadgeLayer> = [];

  m.scene.layers.forEach((l, idx) => {
    if (l.type === 'frame' || l.role === 'frame' || l.role === 'avatar') {
      const frameLayer: PhotoFrameLayer = {
        id: l.id || `frame-${idx}`,
        type: 'frame',
        shape: l.shape === 'rect' ? 'rect' : 'circle',
        x: l.x ?? 0.35,
        y: l.y ?? 0.5,
        w: l.w ?? 0.11,
        h: l.h ?? 0.195,
        src: l.src,
        borderRadius: l.borderRadius ?? 16,
        borderColor: l.borderColor ?? '#FFFFFF',
        borderWidth: l.borderWidth ?? 3,
        zoom: l.zoom ?? 1.0,
        offsetX: l.offsetX ?? 0,
        offsetY: l.offsetY ?? 0,
        safeAreaConstrained: l.safeAreaConstrained ?? true,
      };
      convertedLayers.push(frameLayer);
    } else if (l.type === 'shape' || l.role === 'shape') {
      const shapeLayer: ShapeLayer = {
        id: l.id || `shape-${idx}`,
        type: 'shape',
        shape: l.shape || 'rect',
        x: l.x ?? 0.5,
        y: l.y ?? 0.5,
        w: l.w ?? 0.1,
        h: l.h ?? 0.05,
        color: l.color || '#FFFFFF',
        opacity: l.opacity ?? 1,
      };
      convertedLayers.push(shapeLayer);
    } else if (l.type === 'badge' || l.role === 'badge') {
      const badgeLayer: BadgeLayer = {
        id: l.id || `badge-${idx}`,
        type: 'badge',
        variant: l.variant || 'subscribe-pill',
        x: l.x ?? 0.5,
        y: l.y ?? 0.65,
        scale: l.scale ?? 1.0,
        colorScheme: l.colorScheme ?? 'youtube-red',
        text: l.text,
        safeAreaConstrained: l.safeAreaConstrained ?? true,
      };
      convertedLayers.push(badgeLayer);
    } else {
      // Default to text layer
      const textLayer: TextLayer = {
        id: l.id || l.role || `text-${idx}`,
        type: 'text',
        text: l.text || 'Channel Title',
        font: l.font || 'sora-700',
        size: l.size ?? 54,
        color: l.color || '#FFFFFF',
        align: l.align || 'center',
        position: {
          x: l.x ?? l.position?.x ?? 0.5,
          y: l.y ?? l.position?.y ?? 0.5,
        },
        safeAreaConstrained: l.safeAreaConstrained ?? true,
      };
      convertedLayers.push(textLayer);
    }
  });

  return {
    version: 1,
    canvas: { width: CANVAS.width, height: CANVAS.height },
    background: JSON.parse(JSON.stringify(m.scene.background)),
    layers: convertedLayers.slice(0, 8),
    export: { format: 'png', quality: 0.92 },
    ...(m.designSystem ? { designSystem: JSON.parse(JSON.stringify(m.designSystem)) } : {}),
  };
}

export function listTemplates(niche?: string): TemplateManifest[] {
  if (niche) {
    return TEMPLATES.filter((t) => t.niche.toLowerCase() === niche.toLowerCase());
  }
  return TEMPLATES;
}

export function getTemplate(id: string): TemplateManifest | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getNiches(): string[] {
  const niches = new Set<string>();
  for (const t of TEMPLATES) {
    niches.add(t.niche);
  }
  return Array.from(niches);
}

/**
 * Computes structural hash for layout uniqueness (M-14 / REQ-017).
 * Excludes colors, imagery, and text content; captures layer geometry and hierarchy.
 */
export function computeStructuralHash(tmpl: TemplateManifest): string {
  const layersSig = (tmpl.scene?.layers || []).map((l) => ({
    type: l.type,
    x: Math.round(((l.x ?? l.position?.x) ?? 0.5) * 100),
    y: Math.round(((l.y ?? l.position?.y) ?? 0.5) * 100),
    size: l.size ? Math.round(l.size / 10) : undefined,
    align: l.align,
  }));
  return JSON.stringify({ niche: tmpl.niche, layers: layersSig });
}

/**
 * Filters a list of templates to structurally distinct templates within a niche.
 */
export function getDistinctTemplates(templates: TemplateManifest[]): TemplateManifest[] {
  const seenHashes = new Set<string>();
  return templates.filter((t) => {
    const hash = computeStructuralHash(t);
    if (seenHashes.has(hash)) return false;
    seenHashes.add(hash);
    return true;
  });
}

/**
 * Returns niches that qualify for emission by having >= minCount structurally distinct templates (REQ-017).
 */
export function getQualifyingNiches(
  allTemplates: TemplateManifest[] = TEMPLATES,
  minCount: number = 3
): Array<{ niche: string; templates: TemplateManifest[] }> {
  const nicheMap = new Map<string, TemplateManifest[]>();
  for (const tmpl of allTemplates) {
    const n = tmpl.niche.toLowerCase();
    if (!nicheMap.has(n)) {
      nicheMap.set(n, []);
    }
    nicheMap.get(n)!.push(tmpl);
  }

  const qualifying: Array<{ niche: string; templates: TemplateManifest[] }> = [];
  for (const [niche, list] of nicheMap.entries()) {
    const distinct = getDistinctTemplates(list);
    if (distinct.length >= minCount) {
      qualifying.push({ niche, templates: list });
    }
  }

  return qualifying;
}

/**
 * Generates static paths for /templates/[niche] obeying REQ-017 build gate.
 */
export function getNicheStaticPaths(
  allTemplates: TemplateManifest[] = TEMPLATES,
  minCount: number = 3
) {
  const qualifying = getQualifyingNiches(allTemplates, minCount);
  return qualifying.map(({ niche, templates }) => ({
    params: { niche },
    props: { niche, templates },
  }));
}

