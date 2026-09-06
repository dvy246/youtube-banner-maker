import { CANVAS } from './spec';

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string; angle: number; stops?: string[] }
  | {
      type: 'image';
      src: string;
      width: number;
      height: number;
      cover: true;
      offsetX: number;
      offsetY: number;
      zoom: number;
      extend: boolean;
    };

export interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  font: string;
  size: number;
  color: string;
  align: 'left' | 'center' | 'right';
  position: { x: number; y: number }; // FRAME FRACTIONS, never pixels
  safeAreaConstrained: boolean;
}

export interface ShapeLayer {
  id: string;
  type: 'shape';
  shape: 'rect' | 'circle' | 'line';
  x: number; // FRAME FRACTIONS
  y: number;
  w: number;
  h: number;
  color: string;
  opacity: number;
  borderRadius?: number;
}

export interface PhotoFrameLayer {
  id: string;
  type: 'frame';
  shape: 'circle' | 'rect';
  x: number; // Center X as frame fraction (0..1)
  y: number; // Center Y as frame fraction (0..1)
  w: number; // Width as frame fraction (0..1)
  h: number; // Height as frame fraction (0..1)
  src?: string; // ImageMap lookup key or data URL
  borderRadius?: number; // Corner radius in px for rect (default 16)
  borderColor?: string; // Hex color for border (default '#FFFFFF')
  borderWidth?: number; // Border thickness in px (default 3)
  zoom?: number; // Zoom multiplier inside frame (default 1.0)
  offsetX?: number; // Pan X in pixels inside frame (default 0)
  offsetY?: number; // Pan Y in pixels inside frame (default 0)
  safeAreaConstrained?: boolean;
}

export interface BadgeLayer {
  id: string;
  type: 'badge';
  variant:
    | 'subscribe-pill'
    | 'subscribe-cookie'
    | 'bell-pill'
    | 'social-row'
    | 'schedule-tag'
    | 'verified-check';
  x: number; // Center X as frame fraction (0..1)
  y: number; // Center Y as frame fraction (0..1)
  scale?: number; // Scale multiplier (default 1.0)
  colorScheme?: 'youtube-red' | 'theme-accent' | 'mono-dark' | 'mono-light';
  text?: string;
  safeAreaConstrained?: boolean;
}

export type SceneLayer = TextLayer | ShapeLayer | PhotoFrameLayer | BadgeLayer;

export interface SceneDesignSystem {
  palette: {
    primary: string;
    secondary: string;
    surface: string;
    accent: string;
  };
  typography: {
    titleFont: string;
    taglineFont: string;
  };
  layout?: 'centered' | 'split-left' | 'split-right' | 'editorial' | 'badge' | 'meme';
}

export interface Scene {
  version: 1;
  canvas: { width: number; height: number };
  background: Background;
  layers: Array<TextLayer | ShapeLayer | PhotoFrameLayer | BadgeLayer>; // max 8
  export: { format: 'png' | 'jpeg' | 'webp'; quality: number };
  designSystem?: SceneDesignSystem;
}

export const SCENE_KEY = 'ybm.scene.v1';

export function defaultScene(): Scene {
  return {
    version: 1,
    canvas: { width: CANVAS.width, height: CANVAS.height },
    background: {
      type: 'gradient',
      from: '#0C0D0E',
      to: '#1F2124',
      angle: 135,
    },
    layers: [
      {
        id: 'title',
        type: 'text',
        text: 'CHANNEL NAME',
        font: 'sora-700',
        size: 54,
        color: '#FFFFFF',
        align: 'center',
        position: { x: 0.5, y: 0.46 },
        safeAreaConstrained: true,
      },
      {
        id: 'tagline',
        type: 'text',
        text: 'New Videos Every Week · Subscribe',
        font: 'inter-500',
        size: 22,
        color: '#E3E5E8',
        align: 'center',
        position: { x: 0.5, y: 0.54 },
        safeAreaConstrained: true,
      },
    ],
    export: {
      format: 'png',
      quality: 0.92,
    },
  };
}

export function cloneScene(s: Scene): Scene {
  return JSON.parse(JSON.stringify(s)) as Scene;
}

export function serializeScene(s: Scene): string {
  return JSON.stringify(s);
}

export function deserializeScene(raw: string): Scene | null {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
      return null;
    }

    if (data.version !== 1) {
      return null;
    }

    if (
      !data.canvas ||
      typeof data.canvas.width !== 'number' ||
      typeof data.canvas.height !== 'number'
    ) {
      return null;
    }

    if (!data.background || typeof data.background.type !== 'string') {
      return null;
    }

    const bg = data.background;
    if (bg.type === 'solid') {
      if (typeof bg.color !== 'string') return null;
    } else if (bg.type === 'gradient') {
      if (Array.isArray(bg.stops) && bg.stops.length >= 2) {
        if (!bg.from) bg.from = bg.stops[0];
        if (!bg.to) bg.to = bg.stops[bg.stops.length - 1];
      }
      if (
        typeof bg.from !== 'string' ||
        typeof bg.to !== 'string' ||
        typeof bg.angle !== 'number'
      ) {
        return null;
      }
    } else if (bg.type === 'image') {
      if (
        typeof bg.src !== 'string' ||
        typeof bg.width !== 'number' ||
        typeof bg.height !== 'number' ||
        bg.cover !== true ||
        typeof bg.offsetX !== 'number' ||
        typeof bg.offsetY !== 'number' ||
        typeof bg.zoom !== 'number' ||
        typeof bg.extend !== 'boolean'
      ) {
        return null;
      }
    } else {
      return null;
    }

    if (!Array.isArray(data.layers) || data.layers.length > 8) {
      return null;
    }

    for (const layer of data.layers) {
      if (!layer || typeof layer !== 'object' || typeof layer.id !== 'string') {
        return null;
      }
      if (layer.type === 'text') {
        if (
          typeof layer.text !== 'string' ||
          typeof layer.font !== 'string' ||
          typeof layer.size !== 'number' ||
          typeof layer.color !== 'string' ||
          !['left', 'center', 'right'].includes(layer.align) ||
          !layer.position ||
          typeof layer.position.x !== 'number' ||
          typeof layer.position.y !== 'number' ||
          typeof layer.safeAreaConstrained !== 'boolean'
        ) {
          return null;
        }
      } else if (layer.type === 'shape') {
        if (
          !['rect', 'circle', 'line'].includes(layer.shape) ||
          typeof layer.x !== 'number' ||
          typeof layer.y !== 'number' ||
          typeof layer.w !== 'number' ||
          typeof layer.h !== 'number' ||
          typeof layer.color !== 'string' ||
          typeof layer.opacity !== 'number'
        ) {
          return null;
        }
      } else if (layer.type === 'frame') {
        if (
          !['circle', 'rect'].includes(layer.shape) ||
          typeof layer.x !== 'number' ||
          typeof layer.y !== 'number' ||
          typeof layer.w !== 'number' ||
          typeof layer.h !== 'number'
        ) {
          return null;
        }
      } else if (layer.type === 'badge') {
        if (
          typeof layer.variant !== 'string' ||
          typeof layer.x !== 'number' ||
          typeof layer.y !== 'number'
        ) {
          return null;
        }
      } else {
        return null;
      }
    }

    if (
      !data.export ||
      !['png', 'jpeg', 'webp'].includes(data.export.format) ||
      typeof data.export.quality !== 'number'
    ) {
      return null;
    }

    return data as Scene;
  } catch {
    return null;
  }
}
