export const CANVAS = { width: 2560, height: 1440 } as const;
export const SAFE = { x: 0.1985, y: 0.3535, w: 0.603, h: 0.293 } as const;
export const SAFE_PX = {
  min:  { width: 1235, height: 338 },   // @ 2048×1152
  full: { width: 1546, height: 423 },   // @ 2560×1440
} as const;

export type DeviceKey = 'tv' | 'desktop' | 'tablet' | 'mobile';
export interface DeviceRect { x: number; y: number; w: number; h: number; }

export const DEVICES: Record<DeviceKey, DeviceRect> = {
  tv:      { x: 0,       y: 0,      w: 1.0,    h: 1.0    }, // fcrop 00000000ffffffff
  desktop: { x: 0,       y: 0.3529, w: 1.0,    h: 0.2942 }, // fcrop 00005a57ffffa5a8
  tablet:  { x: 0.1377,  y: 0,      w: 0.7246, h: 1.0    }, // fcrop 23400000dcbfffff
  mobile:  SAFE,
};

export const DEVICE_ORDER: DeviceKey[] = ['tv', 'desktop', 'tablet', 'mobile'];
export const SERVED_WIDTHS = [1060, 1138, 1707, 2120, 2276, 2560] as const;
export const DESKTOP_SERVED_WIDTH = 1707 as const;
export const REENCODE_BUDGET_BYTES = { desktop: 134_000, full: 263_000 } as const;
export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
export const IOS_MAX = 4096 as const;
export const JPEG_QUALITY_FLOOR = 0.7;
