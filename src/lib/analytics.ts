/**
 * YouTubeBannerMaker.com — First-Party Cookieless Analytics
 * Layer L2: Pure, DOM-free event tracking and payload validation engine.
 * Conforms to IMPLEMENTATION.md §F.5, PLAN.md §9 (Tasks 7.1, 7.2)
 *
 * Hard Rule: Zero image bytes, zero filenames, zero user-typed text strings, zero personal data.
 */

export type FunnelEvent =
  | 'template_selected'
  | 'editor_start'
  | 'upload'
  | 'validation_run'
  | 'export_start'
  | 'export_success'
  | 'activation'
  | 're_export';

export const ALLOWED_FUNNEL_EVENTS: readonly FunnelEvent[] = [
  'template_selected',
  'editor_start',
  'upload',
  'validation_run',
  'export_start',
  'export_success',
  'activation',
  're_export',
] as const;

export interface EditorStartPayload {
  mode: 'make' | 'fix' | 'check';
}

export interface TemplateSelectedPayload {
  templateId: string;
}

export interface UploadPayload {
  format: string;
  sizeTier: '<1MB' | '1-3MB' | '3-6MB' | '>6MB' | string;
}

export interface ValidationRunPayload {
  verdictCount: number;
  errorCount: number;
  hasOverflow: boolean;
}

export interface ExportStartPayload {
  format: string;
}

export interface ExportSuccessPayload {
  format: string;
  durationMs: number;
}

export interface ActivationPayload {
  format?: string;
}

export interface ReExportPayload {
  format?: string;
}

export interface FunnelPayloadMap {
  editor_start: EditorStartPayload;
  template_selected: TemplateSelectedPayload;
  upload: UploadPayload;
  validation_run: ValidationRunPayload;
  export_start: ExportStartPayload;
  export_success: ExportSuccessPayload;
  activation: ActivationPayload;
  re_export: ReExportPayload;
}

export interface AnalyticsRecord {
  event: FunnelEvent;
  payload: Record<string, unknown>;
  timestamp: number;
}

const ALLOWED_FORMATS = new Set([
  'png',
  'jpeg',
  'jpg',
  'webp',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const ALLOWED_SIZE_TIERS = new Set([
  '<1MB',
  '1-3MB',
  '3-6MB',
  '>6MB',
  'under_1mb',
  '1mb_to_3mb',
  '3mb_to_6mb',
  'over_6mb',
]);

const FORBIDDEN_KEY_SUBSTRINGS = [
  'file',
  'image',
  'byte',
  'data',
  'text',
  'title',
  'tagline',
  'name',
  'user',
  'prompt',
  'email',
  'ip',
  'token',
  'src',
  'url',
];

const FILENAME_REGEX = /\.[a-zA-Z0-9]{2,5}$/;

/**
 * Normalizes an image mime type or extension to a clean, safe format string.
 */
export function cleanImageFormat(raw: string): string {
  if (!raw) return 'unknown';
  const clean = raw.toLowerCase().replace('image/', '').trim();
  if (clean === 'jpg') return 'jpeg';
  if (ALLOWED_FORMATS.has(clean)) return clean;
  return 'unknown';
}

/**
 * Buckets raw byte sizes into coarse privacy-safe tiers (no raw dimensions or byte counts).
 */
export function getSizeTier(bytes: number): '<1MB' | '1-3MB' | '3-6MB' | '>6MB' {
  if (bytes < 1024 * 1024) return '<1MB';
  if (bytes <= 3 * 1024 * 1024) return '1-3MB';
  if (bytes <= 6 * 1024 * 1024) return '3-6MB';
  return '>6MB';
}

/**
 * Validates that an analytics payload is completely free of user text, image bytes,
 * filenames, and unauthorized keys.
 */
export function validateAnalyticsPayload(event: string, payload: unknown): boolean {
  // 1. Event must be one of the 8 allowed funnel events
  if (!ALLOWED_FUNNEL_EVENTS.includes(event as FunnelEvent)) {
    return false;
  }

  // 2. Payload must be a non-null object (not array, not primitive)
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return false;
  }

  const p = payload as Record<string, unknown>;
  const keys = Object.keys(p);

  // 3. Reject any keys containing forbidden substrings
  for (const k of keys) {
    const lowerKey = k.toLowerCase();
    for (const forbidden of FORBIDDEN_KEY_SUBSTRINGS) {
      if (lowerKey.includes(forbidden)) {
        return false;
      }
    }
  }

  // 4. Reject any values containing data URLs, binary buffers, or filename patterns
  for (const val of Object.values(p)) {
    if (val === null || val === undefined) continue;

    if (
      typeof val === 'object' &&
      (val instanceof ArrayBuffer ||
        (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(val)) ||
        (typeof Blob !== 'undefined' && val instanceof Blob))
    ) {
      return false;
    }

    if (typeof val === 'string') {
      if (val.length > 64) return false;
      const lower = val.toLowerCase();
      if (lower.includes('data:') || lower.includes('base64') || lower.includes('blob:')) {
        return false;
      }
      // Check for filename extensions (e.g. "photo.png", "banner.jpg"), excluding bare format names
      if (FILENAME_REGEX.test(lower) && !ALLOWED_FORMATS.has(lower)) {
        return false;
      }
    }
  }

  // 5. Schema verification for each specific event
  switch (event as FunnelEvent) {
    case 'editor_start': {
      if (keys.length !== 1 || !('mode' in p)) return false;
      return p.mode === 'make' || p.mode === 'fix' || p.mode === 'check';
    }

    case 'template_selected': {
      if (keys.length !== 1 || !('templateId' in p)) return false;
      return typeof p.templateId === 'string' && /^[a-z0-9-_]+$/.test(p.templateId);
    }

    case 'upload': {
      if (keys.length !== 2 || !('format' in p) || !('sizeTier' in p)) return false;
      if (typeof p.format !== 'string' || !ALLOWED_FORMATS.has(p.format.toLowerCase())) return false;
      if (typeof p.sizeTier !== 'string' || !ALLOWED_SIZE_TIERS.has(p.sizeTier)) return false;
      return true;
    }

    case 'validation_run': {
      if (keys.length !== 3 || !('verdictCount' in p) || !('errorCount' in p) || !('hasOverflow' in p)) {
        return false;
      }
      return (
        typeof p.verdictCount === 'number' &&
        Number.isInteger(p.verdictCount) &&
        p.verdictCount >= 0 &&
        typeof p.errorCount === 'number' &&
        Number.isInteger(p.errorCount) &&
        p.errorCount >= 0 &&
        typeof p.hasOverflow === 'boolean'
      );
    }

    case 'export_start': {
      if (keys.length !== 1 || !('format' in p)) return false;
      return typeof p.format === 'string' && ALLOWED_FORMATS.has(p.format.toLowerCase());
    }

    case 'export_success': {
      if (keys.length !== 2 || !('format' in p) || !('durationMs' in p)) return false;
      return (
        typeof p.format === 'string' &&
        ALLOWED_FORMATS.has(p.format.toLowerCase()) &&
        typeof p.durationMs === 'number' &&
        p.durationMs >= 0
      );
    }

    case 'activation':
    case 're_export': {
      if (keys.length === 0) return true;
      if (keys.length === 1 && 'format' in p) {
        return typeof p.format === 'string' && ALLOWED_FORMATS.has(p.format.toLowerCase());
      }
      return false;
    }

    default:
      return false;
  }
}

// In-memory record log for verification and tests
const eventLog: AnalyticsRecord[] = [];

/**
 * Tracks a validated funnel event. Rejects and drops any payload violating sanitization.
 */
export function trackEvent<E extends FunnelEvent>(
  event: E,
  payload: FunnelPayloadMap[E]
): boolean {
  if (!validateAnalyticsPayload(event, payload)) {
    return false;
  }

  const record: AnalyticsRecord = {
    event,
    payload: { ...(payload as Record<string, unknown>) },
    timestamp: Date.now(),
  };

  eventLog.push(record);

  if (typeof window !== 'undefined') {
    const w = window as unknown as { __YBM_ANALYTICS_QUEUE__?: AnalyticsRecord[] };
    w.__YBM_ANALYTICS_QUEUE__ = w.__YBM_ANALYTICS_QUEUE__ || [];
    w.__YBM_ANALYTICS_QUEUE__.push(record);

    try {
      window.dispatchEvent(new CustomEvent('ybm:analytics', { detail: record }));
    } catch {
      // safe fallback
    }
  }

  return true;
}

/**
 * Returns a read-only view of recorded analytics events.
 */
export function getAnalyticsLog(): readonly AnalyticsRecord[] {
  return eventLog;
}

/**
 * Clears the in-memory analytics log.
 */
export function clearAnalyticsLog(): void {
  eventLog.length = 0;
  if (typeof window !== 'undefined') {
    const w = window as unknown as { __YBM_ANALYTICS_QUEUE__?: AnalyticsRecord[] };
    if (w.__YBM_ANALYTICS_QUEUE__) {
      w.__YBM_ANALYTICS_QUEUE__.length = 0;
    }
  }
}
