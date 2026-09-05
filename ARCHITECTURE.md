# Technical Architecture
## YouTubeBannerMaker.com

**Version 1.0 · Companion to PRD.md · Date: 2026-09-05**

This document is the engineering blueprint for the product specified in `PRD.md`. It is precise enough for a strong frontend engineer to build without making major architectural decisions. Where PRD.md states *what* and *why*, this states *exactly how* and *with what tools and constants*.

---

## 0. Architecture Summary

```
Cloudflare Pages (static edge)
└── Astro.js build → pre-rendered HTML per route
    ├── Static content pages   (/, /guides/*, /templates/*)   — ZERO client JS
    ├── Tool pages             (/tools/youtube-banner-*)      — shell + one client island
    │   └── Tool engine (vanilla TS, Canvas 2D, no framework)
    │       └── Device crop constants (fractions) + re-encode simulator
    └── /data/templates/*.json — template manifests (bundled, not fetched)
```

**Key architectural commitments:**
- No backend. No database. No auth. No server-side image processing. Everything runs in the browser on Canvas 2D.
- Zero UI framework. The tool island is vanilla TypeScript modules.
- The single source of truth for the whole product is **one scene JSON** and **one set of frame-fraction crop constants**.
- MPA: every route is a pre-rendered static HTML file. The only client-side execution is the tool island and a trivial nav enhancement.
- All telemetry is cookieless + first-party; no user image data ever leaves the device.

---

## 1. Prerequisites & Assumptions

- **Astro.js** (latest stable, currently v5+) with the static (`output: 'static'`) mode.
- **Node** ≥ 20 for the build; deployed to **Cloudflare Pages** via GitHub.
- **Tailwind CSS** (v4, via `@tailwindcss/vite`).
- **TypeScript** strict mode.
- No UI framework. If a component seems to need React, it needs refactoring (the engine is a pure module + DOM, not a widget tree).
- No image library (no `sharp`, no `jimp`) at runtime — only at build time if a static asset needs pre-processing.

**Do NOT add:** Vue, Svelte, React, a store (redux/zustand/pinia), a state machine library, WebGL, WASM, a serverless function, a database, an ORM, a monorepo, or a component library.

---

## 2. Repository Structure

```
banner/
├── astro.config.mjs
├── tailwind.config.mjs            # v4 via @tailwindcss/vite (or CSS-first config)
├── package.json
├── tsconfig.json
├── src/
│   ├── content/
│   │   └── guides/                # markdown/mdx content collections (size guide, safe-area)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── tools/
│   │   │   ├── youtube-banner-maker.astro
│   │   │   ├── youtube-banner-resizer.astro
│   │   │   └── youtube-banner-checker.astro
│   │   ├── guides/
│   │   │   ├── youtube-banner-size.astro
│   │   │   └── youtube-banner-safe-area.astro
│   │   ├── templates/
│   │   │   ├── [niche].astro      # category page, gated on ≥3 templates
│   │   │   └── index.astro
│   │   └── fr/                    # phase 2 — defer
│   ├── components/
│   │   ├── header.astro
│   │   ├── footer.astro
│   │   ├── Cta.astro
│   │   ├── ToolShell.astro        # shared layout for the three tool pages
│   │   ├── DevicePreview.astro    # thin wrapper that mounts the preview canvas
│   │   └── specTable.astro        # the device-crop table on guides
│   ├── lib/
│   │   ├── spec.ts                # THE constants: safe rect + device crop fractions
│   │   ├── scene.ts               # scene type + serialization (sessionStorage)
│   │   ├── render.ts              # scene → canvas (preview + export) — pure, no DOM
│   │   ├── validate.ts            # safe-rect detection + export validation
│   │   ├── simulate.ts            # re-encode simulation (downscale + JPEG round-trip)
│   │   ├── export.ts              # toBlob export, format+quality, 6MB budget search
│   │   ├── fonts.ts               # font registry (curated, self-hosted) 
│   │   └── template.ts            # load template manifest → scene
│   └── data/
│       └── templates/
│           ├── index.ts           # template registry (static list)
│           ├── gaming-neon.json
│           ├── gaming-arcadia.json
│           ├── tech-circuit.json
│           ├── black-minimal.json
│           ├── aesthetic-soft.json
│           ├── channel-name.json
│           └── ... (~24 total)
├── public/
│   ├── fonts/                     # self-hosted, subset, WOFF2, preloaded
│   ├── assets/
│   │   ├── previews/              # template gallery thumbnails (optimized)
│   │   └── previews/*.webp|.jpg
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml                # generated
│   └── og-image.png
└── scripts/
    ├── validate-templates.mjs     # CI: asserts safe-rect compliance + uniqueness
    └── verify-spec.mjs            # CI: asserts spec.ts matches the measured fractions
```

---

## 3. Route & Page Architecture

| Route | Astro file | JS | Purpose |
|---|---|---|---|
| `/` | `index.astro` | none | Product landing + three doors + honest crop/re-encode explainer |
| `/tools/youtube-banner-maker` | `tools/youtube-banner-maker.astro` | tool island | Create door (template-first) |
| `/tools/youtube-banner-resizer` | `tools/youtube-banner-resizer.astro` | tool island | Fix door (subject-aware fit) |
| `/tools/youtube-banner-checker` | `tools/youtube-banner-checker.astro` | tool island | Check door (validate + diagnose) |
| `/guides/youtube-banner-size` | `guides/youtube-banner-size.astro` | none | Acquisition head: authoritative size/crop page |
| `/guides/youtube-banner-safe-area` | `guides/...safe-area.astro` | none | The 1235×338 == 1546×423 reconciliation |
| `/templates` | `templates/index.astro` | none | Template gallery hub |
| `/templates/[niche]` | `templates/[niche].astro` | none | Niche category page (≥3 templates) |
| `/fr/*` | `fr/*` | (phase 2) | Localized, hreflang |
| `/404` | `404.astro` | none | — |

The three tool pages **share the same engine and the same component** (`ToolShell`). They differ only in entry mode: `?mode=make|fix|check` (or a scoped route param). A single `<script>` island is mounted once; the engine's entry mode is set from the URL.

**Important (MPA, no SPA):** navigation between the three tool routes is a **full page load**. Scene state is preserved via `sessionStorage` (see §7). Do **not** build a client-side router — that would be a SPA inside an MPA and would break the zero-JS content pages.

---

## 4. The Single Source of Truth: `src/lib/spec.ts`

**This file is the most important file in the product.** All geometry everywhere derives from these constants. No pixel device crops are hard-coded anywhere in the render path.

```ts
// src/lib/spec.ts
// Source of the fractions: YouTube's own banner asset URLs (yt3.googleusercontent.com)
// decoded from the fcrop64 parameter. Measured 2026-09-05 from @veritasium.
// PRD §18.1 / §28.2. Requires multi-channel verification (PRD §37.1, Appendix A.5).

export const CANVAS = { width: 2560, height: 1440 } as const;

// Safe rectangle as frame fractions: 60.3% × 29.3% of the frame, centered.
// == 1235×338 @ 2048×1152 (official, Google) == 1546×423 @ 2560×1440 (community).
export const SAFE = {
  x: 0.1985,
  y: 0.3535,
  w: 0.603,
  h: 0.293,
} as const;

export const SAFE_PX = {
  min: { width: 1235, height: 338 },     // @ 2048×1152
  full: { width: 1546, height: 423 },     // @ 2560×1440
} as const;

export type DeviceKey = 'tv' | 'desktop' | 'tablet' | 'mobile';

export interface DeviceRect { x: number; y: number; w: number; h: number; }

// Measured fcrop64 rectangles, as fractions of the frame.
export const DEVICES: Record<DeviceKey, DeviceRect> = {
  tv:      { x: 0,      y: 0,      w: 1.0,   h: 1.0    }, // 2560×1440  (fcrop 00000000ffffffff)
  desktop: { x: 0,      y: 0.3529, w: 1.0,   h: 0.2942 }, // 2560×424   (fcrop 00005a57ffffa5a8)
  tablet:  { x: 0.1377, y: 0,      w: 0.7246,h: 1.0    }, // 1855×1440  (fcrop 23400000dcbfffff)
  mobile:  SAFE,                                        // safe rect  (1546×423 @ 2560×1440)
};

export const DEVICE_ORDER: DeviceKey[] = ['tv', 'desktop', 'tablet', 'mobile'];

export const SERVED_WIDTHS = [1060, 1138, 1707, 2120, 2276, 2560] as const;
export const DESKTOP_SERVED_WIDTH = 1707 as const; // for the re-encode simulation

// Observed JPEG re-encode byte budgets (single samples; see PRD Appendix A.6).
export const REENCODE_BUDGET_BYTES = {
  desktop: 134_000,   // w1707 slice measured 134,061 B
  full:    263_000,   // w2560 full-width measured 263,270 B
} as const;

export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // YouTube hard limit: "6 MB or smaller" (FACT)

// iOS canvas cap (FACT, MDN): 4096×4096. 2560×1440 fits; 2× supersampling does not.
export const IOS_MAX = 4096 as const;

export const JPEG_QUALITY_FLOOR = 0.7; // avoid banding (PRD REQ-029)
```

---

## 5. Scene Model (`src/lib/scene.ts`)

The scene is JSON, serialized to `sessionStorage` under one key. It is the single in-memory representation both the editor and the renderer operate on.

```ts
// src/lib/scene.ts
import { CANVAS } from './spec';

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string; angle: number }
  | { type: 'image'; src: string; width: number; height: number; // source raster
      cover: true; offsetX: number; offsetY: number; zoom: number; extend: boolean };

export interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  font: string;                 // key into fonts registry
  size: number;                 // px, clamped to [min,max]
  color: string;
  align: 'left' | 'center' | 'right';
  position: { x: number; y: number }; // FRAME FRACTIONS — the anchor point of the block
  safeAreaConstrained: boolean;
}

export interface ShapeLayer {
  id: string;
  type: 'shape';
  shape: 'rect' | 'circle' | 'line';
  x: number; y: number; w: number; h: number; // frame fractions
  color: string;
  opacity: number;
}

export interface Scene {
  version: 1;
  canvas: { width: number; height: number };
  background: Background;
  layers: Array<TextLayer | ShapeLayer>;     // max 8
  export: { format: 'png' | 'jpeg' | 'webp'; quality: number };
}

export const DEFAULT_SCENE: Scene = {
  version: 1,
  canvas: { ...CANVAS },
  background: { type: 'solid', color: '#0B0B0F' },
  layers: [],
  export: { format: 'png', quality: 0.95 },
};

export const SCENE_KEY = 'ybm.scene.v1';   // sessionStorage key
export function serialize(s: Scene): string { return JSON.stringify(s); }
export function deserialize(raw: string): Scene {
  const p = JSON.parse(raw);
  // validate version + canvas size; reject/repair if malformed
  if (p?.version !== 1 || p?.canvas?.width !== CANVAS.width) return DEFAULT_SCENE;
  return p as Scene;
}
```

**Rules enforced by the engine (not the schema):**
- Layer positions are frame fractions in `[0,1]`.
- `safeAreaConstrained: true` layers are clamped/flagged by `validate.ts` — they cannot end up outside `SAFE` without triggering a verdict.
- Max 8 layers. Shapes are decorative (protected) and always behind text.
- Background `image` is always `cover: true` (never stretch). `offsetX/offsetY` and `zoom` implement subject repositioning.

---

## 6. Session Handoff (`sessionStorage`)

MPA with zero backend — so the only way to carry state between doors is the browser session.

**Contract:**
- Key: `ybm.scene.v1` (above).
- Also stores `ybm.mode.v1` = `make | fix | check` (the active door, for back-navigation).
- `sessionStorage` clears on tab close — correct (no persisted work, no account).

**Example cross-door flow (Check → Fix):**
1. User is on `/tools/youtube-banner-checker`, uploads banner, gets verdict "cut off on mobile."
2. Click "Fix it" → writes scene + mode to `sessionStorage` → `location.href = '/tools/youtube-banner-resizer'`.
3. Full page load → Fix door's island reads `sessionStorage`, restores the scene, enters `mode='fix'`.
4. Every control writes scene to `sessionStorage` on change (debounced ~200ms).

**Edge case:** if `sessionStorage` is empty on arriving at a tool page (fresh visit, direct URL), the island initializes a default scene or a preset from a URL param (`?template=gaming-neon`).

---

## 7. The Rendering Engine (`src/lib/render.ts`)

Pure module: `scene → canvas`. No DOM knowledge, no side effects. This makes it trivially testable and reusable for preview + export.

### 7.1 Entry Points

```ts
renderPreview(scene, container, maxDisplayWidth): void   // live, display scale
renderExport(scene): OffscreenCanvas                      // 2560×1440, sRGB context
renderDeviceCrop(scene, deviceKey): CanvasImageSource     // crop of the export canvas
```

### 7.2 The Coordinate System

All scene geometry is in **frame fractions** (0..1 of the 2560×1440 canvas). Rendering multiplies by the target canvas dimensions. Device crops are *cuts of the same canvas*, never separate renderings.

### 7.3 Preview vs Export

- **Preview:** render at a display scale (e.g., container width / 2560) to the on-screen canvas. Low memory, cheap redraw on every control change.
- **Export:** render to an offscreen canvas at 2560×1440. Create once, render, `toBlob`, then release.

### 7.4 Render Order (Z)

```
background (solid | gradient | image)
  → extend background (if image + extend)
  → shape layers (decorative, always behind text)
  → text layers (in scene order)
```

### 7.5 Background Image (cover-fit + subject repositioning)

This is the correctness-critical piece for the Fix door.

```
function drawBackgroundImage(ctx, image, bg): void {
  const cw = CANVAS.width, ch = CANVAS.height;
  const sw = image.naturalWidth, sh = image.naturalHeight;

  // 1. Cover-fit: uniform scale so the SHORTER side covers the target.
  const scale = Math.max(cw / sw, ch / sh);          // NEVER min (that would letterbox)
  const dw = sw * scale, dh = sh * scale;

  // 2. Apply user's offset (pan) and zoom. offset is how much the visible
  //    window has shifted, in pixels of the *target* canvas, clamped so the
  //    image always covers the canvas (no gaps).
  const effScale = scale * bg.zoom;
  const drawW = sw * effScale, drawH = sh * effScale;
  const dx = (cw - drawW) / 2 + bg.offsetX;          // centered + user pan
  const dy = (ch - drawH) / 2 + bg.offsetY;

  ctx.drawImage(image, dx, dy, drawW, drawH);
}
```

**Zoom clamp:** `bg.zoom ∈ [1, max(1, sourceResolutionCap)]`. Never below 1.0 (would reveal letterbox) and never above the point where the visible crop exceeds `image.naturalWidth/Height` at full res (i.e., **never upscale** — REQ-007). The source-raster cap is computed as `min(sw / cw, sh / ch)` so a 1:1 display of source pixels is the hard ceiling.

**Offset clamp:** `bg.offsetX ∈ [-(drawW - cw)/2, +(drawW - cw)/2]`, similarly for Y. This guarantees the image always covers the canvas — the "no gaps" invariant.

**Default (auto):** `zoom = 1`, `offset = 0` places the *center* of the source at the center of the canvas. The user (or saliency, in a later phase) may shift the window to put the subject in the safe rect.

### 7.6 Background Extension (Should-have, REQ-009)

If `bg.extend === true` and the cover-fit crop would lose significant image, draw a blurred + edge-mirrored version of the image across the full canvas *first*, then draw the cover-fit image on top (with the user's pan/zoom). Implement via: draw the image scaled-to-cover at a large size, blur it (`ctx.filter = 'blur(40px)'`) and optionally mirror-pad, then composite the real image over it. `ctx.filter` is acceptable for the *extension*, but **do not** rely on `ctx.filter` for critical clarity — reset it before drawing the real content.

---

## 8. Safe-Area Validation (`src/lib/validate.ts`)

The "cut off" detector. Given a scene, returns a list of plain-language verdicts.

```ts
export interface Verdict {
  id: string;
  layerId?: string;
  severity: 'error' | 'warn' | 'info';
  title: string;                 // "Your channel name is cut off on mobile"
  detail: string;                // "Drag it up or left so it fits the safe area."
  device: DeviceKey | 'all';
  fixable: boolean;              // does a "Fix it" action apply?
  action?: 'reposition' | 'reduce-size' | 'convert';
}

export function validateScene(scene: Scene, opts: { sourceRaster?: {w,h} }): Verdict[]
```

### 8.1 Core Check — Safe-Rect Overflow

For each `safeAreaConstrained` text layer:
1. Compute the layer's bounding box in frame fractions. Text width/height is measured via `ctx.measureText` on an offscreen canvas at the scene's font+size, then converted to fractions (divide by 2560 / 1440). (This requires a `measure` pass with the exported font actually loaded — see §11 font loading.)
2. For each device in `[desktop, mobile]`, test whether the box overflows the **safe rect** (these two are the ones that cut; TV and tablet are not cut but the safe rect governs mobile/desktop text safety). Actually the safe rect is the guaranteed-visible region for BOTH desktop slice and mobile — test against `SAFE`.
3. If the box extends past any edge → emit a verdict naming the layer text, the device, and which edge.

**Verdict example:**
```
title: "Your channel name is cut off on mobile"
detail: "It extends past the safe area's top edge. Drag it down, or reduce its size."
device: 'mobile'
fixable: true
action: 'reposition'
```

**Positive guidance, not a scolding:** the verdict gives the *direction* to move and *one* solution. The user drags until it clears. This is the opposite of the micro-tools' unlabelled dotted overlay.

### 8.2 Other Checks

| Check | Verdict | Severity |
|---|---|---|
| File size > 6 MB estimate | "File will fail to upload (over 6 MB)" | error |
| Source raster < target after crop | "This image isn't sharp at TV size (too low resolution)" | warn |
| Source covers < safe-rect needs | "The theme won't cover the whole canvas — use Extend" | info |
| Non-sRGB source (heuristic) | "Colours may shift — we'll save in sRGB" | info |
| PNG-24 / wide-gamut suspicion | "Export is normalised to sRGB" | info |
| `cache-control: max-age=86400` | "New banner may take up to 24 h to appear everywhere" | info |

**Heuristics are honest:** "may," "suspicion," "estimated" — never a false guarantee. A "fix it" action nudges to the relevant control within the current door, or hands off to another door via `sessionStorage`.

---

## 9. Re-Encode Simulation (`src/lib/simulate.ts`)

The single most differentiated feature, and the one most at risk of overclaiming. It is an **approximation**, labelled as such.

```ts
// src/lib/simulate.ts
export function simulateReencode(
  sourceCanvas: HTMLCanvasElement,
  opts: { device: 'desktop' | 'full'; format: 'jpeg' | 'webp'; }
): { dataUrl: string; bytes: number; quality: number }
```

**Algorithm:**
1. Take the source canvas (renderExport output, or the current preview at full res).
2. Downscale to the served width for the target: `DESKTOP_SERVED_WIDTH` (1707) for desktop, or 2560 for full. Use a high-quality downscale (canvas resampling — acceptable; `imageSmoothingQuality = 'high'`).
3. Crop to the device rect (desktop = the 0.2942 slice) *as part of the render* — the simulator works on the crop, which is what YouTube would serve.
4. Re-encode through `canvas.toBlob(type, quality)` at a `quality` chosen to land near `REENCODE_BUDGET_BYTES.desktop` (~134 KB). Use a small binary-search over quality (3 iterations) to approach the budget.
5. Return the result canvas / data URL for display, with the resolved `bytes` and `quality`.
6. **Label in UI:** "Approximate result of YouTube's re-encode. YouTube will re-compress your upload — this is expected and cannot be avoided."

**Honesty guards (non-negotiable):**
- Never present the simulated output as a "preview of the final file" the user can download as-is.
- Never claim the export is "lossless" or "no quality loss."
- The simulation is a *scale and JPEG round-trip*, not a byte-exact preview of YouTube's transcoder (YouTube's exact transcoder is proprietary and unobservable). The PRD and UI both say "approximate."

**Why downscale to 1707 then round-trip:** this replicates the observed behavior the product is answering — a crisp 2560×1440 becomes a ~134 KB JPEG at 1707 wide on desktop. That is *why* E-03/E-07/E-14/E-15 happen, and the user needs to see it before uploading, not after.

---

## 10. Export (`src/lib/export.ts`)

```ts
// src/lib/export.ts
export interface ExportResult {
  blob: Blob;
  type: string;        // actual blob.type (may differ from requested)
  requestedType: string;
  width: number; height: number;
  bytes: number;
  note?: string;       // e.g. "Saved as PNG in your browser"
}

export async function exportBanner(scene: Scene): Promise<ExportResult>
```

### 10.1 Steps

1. **Render** the scene to an offscreen canvas at 2560×1440 with an **sRGB context**: `canvas.getContext('2d', { colorSpace: 'srgb' })`. This is the default but set explicitly (REQ-006).
2. **Format:** `canvas.toBlob(cb, type, quality)`. `type ∈ {'image/png','image/jpeg','image/webp'}`.
3. **Verify `blob.type`:** if `blob.type !== requested`, emit `note` and rename file extension accordingly. `toBlob` guarantees only `image/png` (FACT, MDN); JPEG/WebP may silently fall back to PNG.
4. **File size budget:** if `blob.size > MAX_UPLOAD_BYTES` (~5.8 MB target), run a binary search over `quality` (min 3 steps, never below `JPEG_QUALITY_FLOOR` = 0.7). For PNG (lossless), if it exceeds the budget, tell the user and suggest JPEG/WebP rather than silently degrading (PNG has no quality knob).
5. **Return** the final blob + diagnostic info.

### 10.2 Quality Floor & Banding (REQ-029)

For JPEG, clamp `quality ≥ 0.7`. If the floor prevents meeting 6 MB, do **not** go lower silently — surface a recommendation: "This file can't meet 6 MB as JPEG without visible banding. Try WebP (smaller) or a simpler background."

### 10.3 Filename

`youtube-banner-2560x1440.{png|jpg|webp}`.

### 10.4 sRGB note

Explicitly render into `colorSpace: 'srgb'`. Do **not** offer a `display-p3` export — YouTube will re-encode to sRGB-ish JPEG anyway; preserving a wide gamut is meaningless and the earlier analysis (E-13/E-16) identifies *missing profile* as the real defect, which sRGB normalization addresses.

---

## 11. Fonts (`src/lib/fonts.ts`)

**No arbitrary font picker (REQ-019).** Curated, self-hosted, subset, WOFF2, preloaded.

```ts
// src/lib/fonts.ts
export interface FontDef {
  key: string;        // e.g. 'sora-700'
  family: string;     // 'Sora'
  weight: number;     // 700
  file: string;       // '/fonts/sora-700.woff2'
}

export const FONTS: FontDef[] = [ /* curated ≤6 families, ~16 files */ ];

export async function ensureFontLoaded(font: FontDef): Promise<void> {
  // await document.fonts.load(`700 48px Sora`) then document.fonts.ready
}
```

**Critical for measurement:** `validate.ts` and `render.ts` measure text (via `measureText`) — which is only accurate once the font is loaded. The engine must `await ensureFontLoaded` for any font referenced by the scene *before* computing safe-rect overflow. Gate the preview on `document.fonts.ready` + explicit per-font loads.

---

## 12. Template System (`src/lib/template.ts` + `src/data/templates/*.json`)

A template is a JSON manifest that defines a scene **with the primary content already inside the safe rect by construction** (fractions). The engine loads it and produces a live scene.

```jsonc
// src/data/templates/gaming-neon.json
{
  "id": "gaming-neon",
  "niche": "gaming",
  "name": "Neon Arcade",
  "preview": "/assets/previews/gaming-neon.jpg",
  "scene": {
    "background": { "type": "gradient", "from": "#12002A", "to": "#3A0CA3", "angle": 135 },
    "layers": [
      { "role": "title",   "text": "Your Channel Name", "font": "sora-800",
        "size": 104, "color": "#FFFFFF", "align": "center",
        "x": 0.5, "y": 0.42, "safeAreaConstrained": true },
      { "role": "tagline", "text": "Gameplay • Tutorials • Live", "font": "inter-500",
        "size": 40, "color": "#C7D2FE", "align": "center",
        "x": 0.5, "y": 0.56, "safeAreaConstrained": true },
      { "role": "shape", "type": "rect", "x": 0.18, "y": 0.40, "w": 0.06, "h": 0.05,
        "color": "#4361EE", "opacity": 1 }
    ]
  },
  "editable": ["title", "tagline", "background.photo", "background.gradient"],
  "protected": ["shape", "composition"],
  "safeAreaValidated": true
}
```

### 12.1 Registry (`index.ts`)

```ts
import gamingNeon from './gaming-neon.json';
// ... all 24
export const TEMPLATES = [gamingNeon, ...];
export function getTemplate(id: string) { return TEMPLATES.find(t => t.id === id); }
export function templatesByNiche(niche: string) { return TEMPLATES.filter(t => t.niche === niche); }
```

### 12.2 Template → Scene

`template.ts` flattens a manifest into a live `Scene`:
- `role: 'title'` → `TextLayer`; `role: 'tagline'` → `TextLayer`; `role: 'shape'` → `ShapeLayer`; `background.photo` → background `image` type (empty until user uploads).
- Positions are fractions; `safeAreaConstrained: true` on title/tagline.
- The resulting scene is handed to the editor and to `validate.ts`.

### 12.3 Build-Time CI Validation (non-negotiable)

`scripts/validate-templates.mjs` runs in CI (and `prebuild`) and asserts, for **every** template:
1. **Safe-rect compliance:** the bounding box of each `safeAreaConstrained` layer (which includes title+tagline at their authored size) is fully inside `SAFE`. This uses the same `measureText` math as runtime (a headless approximation using approximate metrics), with `safeAreaValidated: true` required.
2. **Uniqueness:** no two templates in the same niche are near-duplicates (compare a structural hash of layer positions/types/colors; a colour-only change fails).
3. **Schema validity:** against a JSON schema (required fields, types, fraction bounds).
4. **Editable ≠ protected:** no overlap that the runtime would reject.

**Why this matters:** it makes "templates are safe by construction" a *build invariant*, not a claim. This is the mechanical guarantee behind the PRD's core differentiator.

---

## 13. Component Architecture (Astro islands + vanilla)

### 13.1 `ToolShell.astro`

Shared layout for the three tool pages. Renders:
- The editor canvas container (`<div id="editor">`) — the hero.
- Device switcher (TV / Desktop / Tablet / Mobile) — four buttons.
- One control column (right, stacks on mobile): background, text, photo, export.
- The four device preview canvases.
- The validation verdicts region (`aria-live`).
- The re-encode simulation toggle + canvas.
- The export button.

Mounts the island:
```html
<div id="tool-root" data-mode="make|fix|check"></div>
<script type="module" src="/src/islands/tool.ts"></script>
```

### 13.2 The Island (`src/islands/tool.ts`)

The **only** client JS on the tool routes. Vanilla TS, no framework. Responsibilities:
1. Read `sessionStorage` scene (or init default / URL template preset).
2. Read `data-mode` for the door (make/fix/check).
3. Wire DOM controls → scene mutations → `renderPreview` (debounced via `requestAnimationFrame`).
4. Wire device switcher → `renderDeviceCrop` for the selected device.
5. Wire upload → image `decode()` → set background `image` → cover-fit.
6. Wire drag/zoom on the canvas (pointer events + arrow-key fallback) → mutate `bg.offset`/`bg.zoom`.
7. Run `validateScene` on scene change → render verdicts into `aria-live`.
8. Wire re-encode toggle → `simulateReencode` → display result.
9. Wire export → `exportBanner` → download.
10. Debounced `sessionStorage.write` (200ms) on scene change.

### 13.3 Drag Interaction (subject repositioning)

- **Pointer events** on the editor canvas; on pointerdown record start, on pointermove compute delta in *canvas* pixels → convert to source `offset` via the cover-fit scale (respect clamp §7.5).
- **Arrow-key fallback** (a11y): arrows nudge `offset` by a small step; `+/-` adjusts zoom. This makes repositioning fully keyboard-operable.
- The existing focus is always visible; the drag is a canvas operation, not a DOM element drag, so no focus management dance.

### 13.4 Zero-JS Content Pages

`/`, `/guides/*`, `/templates/*` render **no** client script (except a tiny `nav.ts` if needed, or none). All text, spec tables, and internal links are server-rendered. This is what makes the site fast and SEO-clean.

---

## 14. Performance Budgets (hard, enforce in CI)

| Metric | Target | Enforcement |
|---|---|---|
| Total tool-page JS | ≤ 65 KB gzip (engine + controls) | Build-size check in CI (`gzip` of emitted chunk). Fails build if exceeded. |
| Content page JS | 0 KB | No script tag emitted for content routes. |
| `LCP` | < 0.8 s (mid-tier mobile, Moto G Power) | Lighthouse CI / RUM. |
| `CLS` | < 0.1 | Preload fonts + width/height on images. |
| `INP` | < 200 ms | RUM. |
| Font payload | ≤ ~40 KB total (subset WOFF2), preloaded | Manual budget in `fonts.ts`. |
| Template JS | templates are static JSON bundled; ≤ ~30 KB total | Inline into the island only if small; otherwise emit as a single asset. |
| Export time | < 1.5 s for 2560×1440 (mid-tier mobile) | Acceptable — one render + one `toBlob`. |

**The one real cost:** `renderExport` + `toBlob` at 2560×1440. Do not re-render on every keystroke (that's preview at display scale). Only the explicit export action triggers the full-res render.

---

## 15. Accessibility Implementation

- **Keyboard:** all controls focusable; arrow keys for repositioning; `+/-` for zoom; labelled buttons (no icon-only except device switcher, which has `aria-label`).
- **`aria-live="polite"`** on the validation verdicts region; verdicts presented as list items, read aloud as they change.
- **Colour:** verdicts use icon + text + colour (not colour alone). Statuses: error (red + ⚠), warn (amber + ▲), info (blue + ℹ).
- **Contrast:** text controls ensure WCAG AA; the preview canvas is decorative and has a textual caption beneath each device view describing what's shown.
- **Text fallback:** `<noscript>` and a `role="img"` + `aria-label` on the canvas.
- **Reduced motion:** respect `prefers-reduced-motion`; no jarring transitions (the editor is mostly static; the only motion is smooth-drag, which is user-initiated).

---

## 16. SEO Implementation

### 16.1 Astro Content Collections for Guides

`src/content/guides/*.md` with frontmatter: `title`, `description`, `canonical`, `ogImage`, `schema`. Each guide renders semantic HTML, `Schema.org` via `@astrojs/schema` or inline `<script type="application/ld+json">` (FAQPage on the size guide; WebSite/SoftwareApplication on tool pages; BreadcrumbList on guides).

### 16.2 Astro Sitemap

`@astrojs/sitemap` generates `/sitemap.xml` from all static routes. Configure `robots.txt` to allow all and reference sitemap.

### 16.3 Canonicals & hreflang

- Every page: self-referential `<link rel="canonical">`.
- Phase 2 (`/fr/`): `hreflang="fr"` (→ `/fr/...`), `hreflang="en"` (→ `/...`), `x-default` (→ `/...`). Single domain, subdirectory. **No separate French domain.**

### 16.4 Tagging

- `og:title`, `og:description`, `og:image` (a generated banner preview asset), `og:url`. `twitter:card = summary_large_image`.
- No `SearchAction` (no internal search — REQ-021).

### 16.5 Thin / Duplicate Content Guard

- `templates/[niche].astro` only emitted for niches with ≥3 distinct templates (validated by `scripts/validate-templates.mjs`; the page 404s / is excluded from sitemap otherwise).
- Template category pages carry real descriptive copy, not lorem.

---

## 17. Asset Strategy

- **Fonts:** self-hosted, subset, WOFF2, `rel="preload"` + `font-display: swap`.
- **Template preview images:** pre-optimised at build (WebP/AVIF via `@astrojs/image` or a `sharp` prebuild step; sizes ≤ ~25 KB each).
- **Icons:** inline SVG (tiny), no icon font.
- **Favicon / OG image:** static, optimized.
- **Illustrations** (optional decorative assets in templates): generated at build, not shipped as raw large files.

---

## 18. Caching & CDN (Cloudflare Pages)

- **Static HTML:** Cloudflare edge cache; short TTL (e.g., `s-maxage=3600`) since deploys are infrequent but HTML should update quickly on redeploy.
- **Immutable hashed assets** (JS/JSON/fonts/images): `Cache-Control: public, max-age=31536000, immutable` (Cloudflare Pages does this for hashed assets).
- **No dynamic origin.** No SSR. No functions (unless an extreme future need — not in scope).
- **`_headers` file** for security headers (`Content-Security-Policy` allowing only `'self'` + inline JSON-LD + `data:` for blob previews of user uploads; `Referrer-Policy: strict-origin-when-cross-origin`; `X-Content-Type-Options: nosniff`).

---

## 19. Security Considerations

- **No accounts** → no auth tokens, no user-content server storage, minimal attack surface.
- **CSP:** `default-src 'self'`; `img-src 'self' blob: data:` (user uploads are `blob:`/`object` URLs); `style-src 'self'` (Tailwind is compiled, not inline); `frame-ancestors 'none'`.
- **User uploads** are never sent anywhere; they're read via `FileReader`/`objectURL` and drawn to a local canvas (REQ-027). Object URLs revoked after use.
- **Template JSON** is build-time trusted, but still validated against a schema at build; never interpolated into HTML without escaping.
- **Local-only blob URLs** — never persist user image bytes cross-session (sessionStorage holds scene JSON only, and the source image `src` is a transient blob URL that dies with the session; a re-upload on next session is required — acceptable, documented).

**Note on sessionStorage image persistence:** scenes that reference `blob:` image URLs won't survive a page reload (blob URL is gone). For the cross-door handoff, either (a) re-read the file in the next door (store the scene metadata + re-upload), or (b) store the image as a base64 data URL in sessionStorage if it's under ~3 MB (avoids reload loss but uses memory). **Recommendation:** use (b) for source images under ~3 MB, else require re-upload on the next door with a friendly "re-select your image" prompt. This is a real limitation and must be handled, not silently dropped.

---

## 20. Analytics & Privacy Implementation

- **Cookieless, first-party, aggregated.** No third-party trackers.
- Capture anonymous events: `template_selected`, `editor_start`, `upload`, `validation_run`, `export_start`, `export_success`, `activation`, `re_export`. No image pixels, no content.
- **No user image data** leaves the browser. Log only performance + funnel events.
- Use a lightweight, privacy-respecting tool (e.g., a tiny self-hosted counter or Plausible-style, self-hosted/Cloudflare-reachable, or the platform's egress analytics). Do **not** add Google Analytics by default; if used, it must be privacy-respecting and deferred (no render-blocking).

---

## 21. Deployment, CI/CD

**Cloudflare Pages** with a connected GitHub repo.

```
Push to main
  → GitHub Actions:
      1. npm ci
      2. astro check                 (types + astro-preview)
      3. eslint                      (TS)
      4. node scripts/validate-templates.mjs   (safe-rect compliance + uniqueness + schema)
      5. astro build
      6. deploy to Cloudflare Pages
```

**CI gates (must fail build on violation):**
- `validate-templates.mjs` fails if any template violates safe-rect compliance or uniqueness.
- Build-size check fails if tool-page JS > 65 KB.
- `astro check` fails on type errors.
- (Optional) Lighthouse CI for LCP/CLS/INP budget.

**Deploy target:** `.wrangler` not needed; Cloudflare Pages is the default. Production branch `main`.

---

## 22. What We Are NOT Building (architecture-level)

| Not building | Why |
|---|---|
| A database | No accounts, no storage; scene is session-only. |
| Serverless functions | Everything is client-side; no backend. |
| SSR / edge functions | Static-first MPA. |
| Auth of any kind | Principle 1; no accounts. |
| Object storage / upload API | REQ-027; nothing leaves the device. |
| A UI framework | Vanilla TS + Canvas; a framework adds cost with no benefit for a single canvas tool. |
| WebGL | Not needed; Canvas 2D is sufficient and simpler. |
| A mobile app | PWA-capable static site; native not justified. |
| AI generation / ML | Unproven value; heavy complexity; violates anti-overengineering. |
| Multiple template builders | One schema, one engine, N manifests. |

---

## 23. Known Technical Risks (engineering-only)

| Risk | Mitigation |
|---|---|
| `measureText` accuracy depends on font load | `ensureFontLoaded` gate; safe-rect validation waits for `document.fonts.ready`. |
| `blob.type` falls back to PNG unexpectedly | Export verifies `blob.type` and renames + notes (REQ-011). |
| iOS 4096 canvas cap → 2× supersampling fails | Runtime canvas-size probe; never supersample on iOS; export at 1× 2560×1440. |
| `ctx.filter` blur (background extension) perf on low-end mobile | Offer extension, but it's optional default-off; render at reduced scale for the blur pass. |
| Memory on large source images | Warn if > 12 MB / > 30,000 px long edge; downscale source to ~2× target before drawing. |
| `sessionStorage` blob-URL loss on cross-door nav | Handle via §19 note (base64 under threshold / re-upload prompt). |
| YouTube's `fcrop64` fractions may not generalize across channels | Pre-launch verify multiple channels (PRD §37.1); fractions are a *constant file* that can be updated in one place. |
| Re-encode budget is a sample, not a guarantee | The simulator labels "approximate"; the budget constant is a *typical* target, not a promise. |

---

## 24. Testing & Verification

- **Unit tests** (Vitest): `spec.ts` fraction math (safe-rect intersection, device crop), `scene.ts` serialisation round-trip, `validate.ts` verdict generation, `export.ts` resize-budget binary search, cover-fit clamp invariants.
- **An integration test** renders a known scene → asserts the exported canvas is exactly 2560×1440, sRGB, and that a deliberately-off-rect title produces a `cut-off-on-mobile` verdict.
- **A visual regression** set: golden images for each template at TV/Desktop/Mobile `device` crops.
- **CI template validator** (build gate) as above.
- **Lighthouse CI** for the performance budgets.

---

## 25. Build Sequence (implementation order)

1. `spec.ts` constants + `scene.ts` + `render.ts` (core engine, pure, testable).
2. Cover-fit + repositioning + zoom (the Fix-door core).
3. DEVICES preview canvas.
4. `validate.ts` (safe-rect) + verdict UI.
5. `simulate.ts` (re-encode toggle).
6. `export.ts` (format, budget, blob.type).
7. `fonts.ts` (register, subset, preload).
8. Template schema + 24 JSON manifests + `validate-templates.mjs`.
9. `ToolShell` + `tool.ts` island (make/fix/check doors).
10. Content pages (`/`, guides, templates hub/category).
11. Analytics + CWV wire-up.
12. SEO completeness pass (canonicals, schema, sitemap, OG).
13. CI gates + deploy.

---

*End of ARCHITECTURE.md*
