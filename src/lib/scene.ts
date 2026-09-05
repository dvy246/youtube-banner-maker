import { CANVAS } from './spec';

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string; angle: number }
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
}

export interface Scene {
  version: 1;
  canvas: { width: number; height: number };
  background: Background;
  layers: Array<TextLayer | ShapeLayer>; // max 8
  export: { format: 'png' | 'jpeg' | 'webp'; quality: number };
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
