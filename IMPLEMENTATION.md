# Implementation Specification
## YouTubeBannerMaker.com

**Version 1.0 · Date: 2026-09-05 · Status: build-ready**

This document converts the strategy set — `PRD.md` (what and why), `ARCHITECTURE.md` (how, technically), `PLAN.md` (in what order, with what gates), `SEO.md` (how it gets found), `DESIGN.md` (how it looks and behaves visually) — into a single exact build specification.

It is written to be executed. Where the source documents leave a decision open, this document closes it and marks the closure as a **Decision** with its rationale. Where the source documents conflict, this document names the conflict and resolves it rather than silently picking one. Nothing here introduces a new product requirement; everything traces to a `REQ-0xx` in `PRD.md §15` or to an explicit engineering constraint in `ARCHITECTURE.md`.

**Reading order for an engineer:** §0 (traceability and decisions) → §G (implementation order) → the section for the stage you are on → §H (acceptance criteria) before you open a PR.

---

## Table of Contents

| § | Section | Answers |
|---|---|---|
| 0 | Source Traceability & Locked Decisions | What governs what; what this doc decided |
| A | Architecture | Runtime model, module graph, contracts, data flow |
| B | Pages | Every route, its build contract, its SEO contract |
| C | Components | Every component, its props, its DOM contract, its tokens |
| D | States | State machines, per-component state matrix, verdict taxonomy |
| E | Interactions | Every user interaction, pointer and keyboard, with ARIA |
| F | Technical Constraints | Budgets, browser floor, security, privacy, honesty guards |
| G | Implementation Order | Stages, tasks, dependencies, gates |
| H | Acceptance Criteria | Per-REQ, per-stage, CI-enforced, and manual |
| I | Open Items | What is still undecided and who must decide it |

---

## 0. Source Traceability & Locked Decisions

### 0.1 Document authority

| Domain | Governing document | This document's role |
|---|---|---|
| Product requirements, REQ IDs, MVP scope | `PRD.md` §15, §20, §40 | Traces to them; never adds a REQ |
| Engine internals, module boundaries, budgets | `ARCHITECTURE.md` | Expands into per-file contracts |
| Stage order, gates, risk register | `PLAN.md` | Expands into per-task order with dependencies |
| Page SEO contracts, titles, schema, indexation | `SEO.md` | Binds them to routes and to build-time checks |
| Site UI visual system, tokens, component states | `DESIGN.md` | Binds tokens to named components |

**Precedence when two sources disagree:** the more specific and more recent document wins, and the conflict is recorded in §0.3. `PRD.md` remains the authority on *whether* a thing is built; the others govern *how*.

### 0.2 Requirement coverage map

Every `REQ` from `PRD.md §15` maps to exactly one owning module and one verification method. This is the table a reviewer uses to confirm nothing was dropped.

| REQ | Owner (module / file) | Verified by |
|---|---|---|
| REQ-001 fraction crop model | `src/lib/spec.ts` | Unit test + `scripts/verify-spec.mjs` + code review grep for literal device pixels |
| REQ-002 per-device preview | `src/lib/render.ts` `renderDeviceCrop` | Golden-image pixel-equality test vs sub-rect of full render |
| REQ-003 safe-area enforcement | `src/lib/validate.ts` | Fixture set of deliberately broken scenes |
| REQ-004 safe-rect reconciliation | `src/lib/spec.ts` `SAFE_PX` + `SpecTable.astro` | Assertion test: 1235×338 @ 2048×1152 and 1546×423 @ 2560×1440 |
| REQ-005 re-encode simulation | `src/lib/simulate.ts` | Manual + copy grep (§F.6) |
| REQ-006 sRGB normalisation | `src/lib/export.ts` context options | Unit test asserting `colorSpace: 'srgb'` |
| REQ-007 no-upscale | `src/lib/render.ts` zoom clamp | Fuzz test over source dimensions |
| REQ-008 cover-fit + reposition | `src/lib/render.ts` `drawBackgroundImage` | Coverage invariant fuzz test |
| REQ-009 background extension | `src/lib/render.ts` extend path | Visual test + validator awareness test |
| REQ-010 exact-size export | `src/lib/export.ts` | Assert blob decodes to 2560×1440 |
| REQ-011 format + `blob.type` check | `src/lib/export.ts` | Unit test with a stubbed `toBlob` that falls back to PNG |
| REQ-012 sub-6 MB budget search | `src/lib/export.ts` | Unit test: oversize input converges in ≥3 steps |
| REQ-013 plain-language verdicts | `src/lib/validate.ts` + `VerdictList` | Copy review + fixture set |
| REQ-014 CDN cache disclaimer | `ToolShell.astro` static copy | Presence test in built HTML |
| REQ-015 template-first Create | `tools/youtube-banner-maker.astro` | Manual: page never opens on blank canvas |
| REQ-016 ≥24 templates | `src/data/templates/*` | `scripts/validate-templates.mjs` count + uniqueness hash |
| REQ-017 niche categories | `templates/[niche].astro` | Build gate: page not emitted below 3 templates |
| REQ-018 editable text | `src/islands/tool.ts` text panel | Manual + constrained-drag test |
| REQ-019 curated font set | `src/lib/fonts.ts` | Registry size assertion (≤6 families) |
| REQ-020 upload background | `src/islands/tool.ts` upload | Manual |
| REQ-021 no template search | `templates/index.astro` | Absence check: no search input in built HTML |
| REQ-022 sessionStorage handoff | `src/lib/scene.ts` serialize | Cross-door round-trip test across a full page load |
| REQ-023 no account | whole site | Grep for auth strings; manual audit |
| REQ-024 no watermark | `src/lib/render.ts` | Bitmap test: rendered canvas contains only scene-derived pixels |
| REQ-025 no download limit | `src/lib/export.ts` | Test: N consecutive exports all succeed |
| REQ-026 size vs dimension clarity | export panel copy | Copy review |
| REQ-027 browser-first | whole tool path | Network-panel audit across a full session |
| REQ-028 performance budget | build config | CI size gate + Lighthouse CI |
| REQ-029 quality floor | `src/lib/export.ts` `JPEG_QUALITY_FLOOR` | Unit test: never emits below 0.7 |
| REQ-030 no-JS degradation | `ToolShell.astro` `<noscript>` | Built-HTML test with JS disabled |

### 0.3 Conflicts found between source documents, and their resolution

**Conflict 1 — font registry.** `ARCHITECTURE.md §11` names `sora-700` / `Sora` as the `FontDef` example and `§12`'s template manifest uses the key `inter-500`. `DESIGN.md` specifies Switzer (display/UI) and JetBrains Mono. `DESIGN.md`'s governing skill bans Inter-as-display.

> **Decision D-1.** These are two different registries and must not be unified. There are **site-UI fonts** (the chrome the visitor reads: nav, headings, controls, verdicts) and **banner-canvas fonts** (the typefaces rendered *inside* the exported artwork). `DESIGN.md` governs the first and only the first. `src/lib/fonts.ts` governs the second and is free to carry Sora, Inter, or any other family a template needs, because that type is the user's design output, not our interface.
>
> Consequences, all binding:
> - `src/lib/fonts.ts` exposes only canvas fonts. Site chrome never reads from it.
> - Site chrome fonts are declared once in the global stylesheet with `@font-face` and `font-display: swap` disabled in favour of preload (`CLS < 0.1` requires no swap-driven reflow on the LCP element).
> - The two registries are budgeted separately (§F.2) and their sum on any single route is the number CI checks.
> - `ARCHITECTURE.md §11`'s `sora-700` example stays valid. No edit to `ARCHITECTURE.md` is required by this decision; this document records the distinction it left implicit.

**Conflict 2 — home page title length.** `PRD.md §29.3` specifies `"YouTube Banner Maker — Free, No Sign-Up, Correct on Every Device"` (64 characters). `SEO.md §14` flags it as truncation-prone and proposes `"Free YouTube Banner Maker — Correct on Every Device"` (51 characters).

> **Decision D-2.** Build the `SEO.md` version. It preserves the differentiating clause ("Correct on Every Device") and drops the clause most likely to be cut. Recorded in §B.1.

**Conflict 3 — `FAQPage` rich result.** `PRD.md §29.4` schedules `FAQPage` schema for a rich result. `SEO.md §14` records that the FAQ rich-result *visual snippet* was deprecated in May 2026.

> **Decision D-3.** Emit `FAQPage` JSON-LD on the size guide (it remains valid, machine-readable Q&A structure useful for answer extraction) but remove every internal claim that it produces a SERP rich result. No engineering work is gated on the snippet appearing.

**Conflict 4 — `Product` schema on tool pages.** `PRD.md §29.4` lists `Product`. `SEO.md §14` argues `Product` invites a fabricated `AggregateRating` and recommends `SoftwareApplication` only.

> **Decision D-4.** Tool pages emit `SoftwareApplication` only. No `AggregateRating`, no `Offer` with a fake price, on any page, ever. This is a hard rule in §F.7, not a preference.

**Conflict 5 — Core Web Vitals numbers.** `PRD.md §31` and `§40.2` state `LCP < 0.8s`, `CLS < 0.1`, `INP < 200ms`. `SEO.md §14` correctly notes these are engineering targets, not measurements.

> **Decision D-5.** They are treated as **build budgets** — enforced in CI against a synthetic Lighthouse profile — and are never published as user-facing performance claims, marketing copy, or schema values.

**Conflict 6 — build order granularity.** `ARCHITECTURE.md §25` lists a 13-step build sequence; `PLAN.md §0` lists 9 stages with gates. They are compatible but not identical in granularity.

> **Decision D-6.** `PLAN.md`'s stage boundaries and gates are authoritative, because the gates are the contract. `ARCHITECTURE.md`'s 13 steps are folded into those stages as tasks in §G. Where the two disagree on *when* something happens, `PLAN.md` wins — most importantly, Stage 0 is a hard STOP gate and no product code is written before it passes.

### 0.4 Decisions this document makes that no source document made

| ID | Decision | Rationale |
|---|---|---|
| D-7 | The DOM contract (element IDs and `data-` attributes) in §C.4 is normative | The island is vanilla TS with no framework; without a fixed DOM contract, markup and script drift silently |
| D-8 | Scene mutations go through a single `applyChange(patch)` funnel, never direct field writes | One place to trigger validate + render + persist; prevents "changed the scene but forgot to revalidate" bugs |
| D-9 | Validation runs on every scene change, debounced to one `requestAnimationFrame`; export runs validation *again*, synchronously, before encoding | Cheap insurance against exporting a scene the user was warned about but the UI raced |
| D-10 | Source images are persisted to `sessionStorage` as base64 only below 3 MB; above that, the scene persists without the image and the target door prompts re-upload | `ARCHITECTURE.md §19` names the `blob:` URL limitation and requires it be handled, not dropped; 3 MB is the stated threshold |
| D-11 | `?template=` deep links canonicalise to the clean tool URL | `SEO.md §3` requires it; prevents infinite crawlable parameter space |
| D-12 | Content pages and tool pages use the same CSS bundle | One design system, one cache entry; content pages ship zero JS but are not styled separately |

---

## A. Architecture

### A.1 Runtime model in one paragraph

A statically generated multi-page site. Every route is HTML on a CDN. Three of those routes mount one vanilla-TypeScript island that owns a single `Scene` object; everything the user sees in the editor is a pure function of that object. There is no server, no database, no session, no account, and no client-side router. Navigation between tool routes is a real page load, and continuity comes from `sessionStorage`. All image work happens in the browser on a `<canvas>`; no image byte ever leaves the device.

### A.2 Layer rules (enforced by review, and by the import graph)

```
  ┌─────────────────────────────────────────────────────────┐
  │  L4  Pages (.astro)         build-time only, zero client JS
  │      /  /guides/*  /templates/*  /tools/*
  ├─────────────────────────────────────────────────────────┤
  │  L3  Island (src/islands/tool.ts)   the ONLY client JS
  │      owns DOM, owns event wiring, owns the funnel
  ├─────────────────────────────────────────────────────────┤
  │  L2  Feature modules (src/lib/*)    pure, DOM-free*
  │      render · validate · simulate · export · template · fonts
  ├─────────────────────────────────────────────────────────┤
  │  L1  Model (src/lib/scene.ts)       types + serialization
  ├─────────────────────────────────────────────────────────┤
  │  L0  Constants (src/lib/spec.ts)    the single source of truth
  └─────────────────────────────────────────────────────────┘
```

\* "DOM-free" means: L2 modules accept a `CanvasRenderingContext2D` or an `HTMLImageElement` as an argument and never call `document.*`, never read the URL, never touch storage. `export.ts` and `simulate.ts` may create an `OffscreenCanvas` or a detached `<canvas>` — that is a canvas dependency, not a document dependency, and it keeps them unit-testable.

**Hard import rules:**

1. Nothing imports *upward*. `spec.ts` imports nothing. `scene.ts` imports only `spec.ts`. L2 imports L1 and L0. The island imports L2, L1, L0. Pages import L0/L1 for build-time spec tables only.
2. `spec.ts` is the only file allowed to contain a device rectangle. Any literal like `423`, `1546`, `0.2942`, `1235`, `338` appearing outside `spec.ts` and its tests is a review rejection (REQ-001).
3. No L2 module imports another L2 module except: `export.ts` → `render.ts`, `simulate.ts` → `render.ts` + `spec.ts`, `template.ts` → `scene.ts` + `fonts.ts`, `validate.ts` → `spec.ts` + `scene.ts` + `fonts.ts` (it needs metrics). `validate.ts` must not import `render.ts`.

### A.3 Module contracts

These are the exported signatures. They are fixed at Stage 1 and every later stage codes against them.

**`src/lib/spec.ts`** — verbatim from `ARCHITECTURE.md §4`; reproduced here because everything else depends on it.

```ts
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
```

**`src/lib/scene.ts`**

```ts
export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string; angle: number }
  | { type: 'image'; src: string; width: number; height: number;
      cover: true; offsetX: number; offsetY: number; zoom: number; extend: boolean };

export interface TextLayer {
  id: string; type: 'text'; text: string; font: string; size: number;
  color: string; align: 'left' | 'center' | 'right';
  position: { x: number; y: number };      // FRAME FRACTIONS, never pixels
  safeAreaConstrained: boolean;
}
export interface ShapeLayer {
  id: string; type: 'shape'; shape: 'rect' | 'circle' | 'line';
  x: number; y: number; w: number; h: number; color: string; opacity: number;
}
export interface Scene {
  version: 1;
  canvas: { width: number; height: number };
  background: Background;
  layers: Array<TextLayer | ShapeLayer>;   // max 8
  export: { format: 'png' | 'jpeg' | 'webp'; quality: number };
}

export const SCENE_KEY = 'ybm.scene.v1';

export function defaultScene(): Scene;
export function serializeScene(s: Scene): string;
export function deserializeScene(raw: string): Scene | null;  // null on any schema mismatch
export function cloneScene(s: Scene): Scene;
```

`deserializeScene` returns `null` — never throws, never partially populates — on a version mismatch, a missing field, or a layer count above 8. A corrupt session must degrade to a fresh default, not to a half-scene that renders wrong.

**`src/lib/render.ts`**

```ts
export function renderScene(ctx: CanvasRenderingContext2D, scene: Scene,
                            images: ImageMap): void;
export function renderPreview(ctx: CanvasRenderingContext2D, scene: Scene,
                              images: ImageMap, displayScale: number): void;
export function renderDeviceCrop(ctx: CanvasRenderingContext2D, source: CanvasImageSource,
                                 device: DeviceKey): void;
export function renderExport(scene: Scene, images: ImageMap): HTMLCanvasElement; // 2560×1440, sRGB
```

`renderDeviceCrop` takes the **already-rendered full canvas** as its source and blits a sub-rectangle. It must never re-run the scene render at a device size — that is the mechanism by which "device crops are cuts of the same canvas" (REQ-002) is true rather than merely claimed.

Render order (Z), fixed: background → background extension → shapes (array order) → text (array order). No z-index field exists; array order *is* z-order (`PRD.md §20.4` rejects a freeform layer editor).

Cover-fit, verbatim from `ARCHITECTURE.md §7.5` — the correctness core of the Fix door:

```ts
function drawBackgroundImage(ctx, image, bg): void {
  const cw = CANVAS.width, ch = CANVAS.height;
  const sw = image.naturalWidth, sh = image.naturalHeight;
  const scale = Math.max(cw / sw, ch / sh);   // NEVER min (would letterbox)
  const effScale = scale * bg.zoom;
  const drawW = sw * effScale, drawH = sh * effScale;
  const dx = (cw - drawW) / 2 + bg.offsetX;
  const dy = (ch - drawH) / 2 + bg.offsetY;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}
```

Two clamps, both mandatory, both unit-tested:

- **Zoom:** `bg.zoom ∈ [1, max(1, cap)]` where `cap = min(sw / cw, sh / ch)`. When the source is smaller than the canvas, `cap < 1`, so `max(1, cap)` pins zoom to exactly 1 and upscaling past 1:1 source pixels becomes unreachable (REQ-007).
- **Offset:** `bg.offsetX ∈ [-(drawW - cw)/2, +(drawW - cw)/2]`, same form for Y. This is what guarantees the drawn image always covers the canvas; the fuzz test in Gate 1 asserts no transparent pixel at any edge for any legal input.

**`src/lib/validate.ts`**

```ts
export interface Verdict {
  id: string; layerId?: string;
  severity: 'error' | 'warn' | 'info';
  title: string;   // "Your channel name is cut off on mobile"
  detail: string;  // "Drag it up or left so it fits the safe area."
  device: DeviceKey | 'all';
  fixable: boolean;
  action?: 'reposition' | 'reduce-size' | 'convert';
}
export function validateScene(scene: Scene,
  opts: { sourceRaster?: { w: number; h: number }; estimatedBytes?: number }): Verdict[];
```

Verdicts are returned sorted: all `error` before all `warn` before all `info`; within a severity, in `DEVICE_ORDER`. The UI never re-sorts.

**`src/lib/simulate.ts`**

```ts
export async function simulateReencode(
  sourceCanvas: HTMLCanvasElement,
  opts: { device: 'desktop' | 'full'; format: 'jpeg' | 'webp' }
): Promise<{ dataUrl: string; bytes: number; quality: number }>;
```

Algorithm: downscale the full render to `DESKTOP_SERVED_WIDTH` (1707) → crop to the device rectangle from `DEVICES` → `toBlob` with a 3-iteration binary quality search converging toward `REENCODE_BUDGET_BYTES[device]`. Returns the achieved byte count and the quality that produced it, both of which are displayed.

**`src/lib/export.ts`**

```ts
export interface ExportResult {
  blob: Blob; type: string; requestedType: string;
  width: number; height: number; bytes: number; note?: string;
}
export async function exportBanner(scene: Scene, images: ImageMap): Promise<ExportResult>;
```

Five steps, in order, none skippable:

1. `renderExport` into an offscreen 2560×1440 canvas obtained with `getContext('2d', { colorSpace: 'srgb' })` (REQ-006, REQ-010).
2. `toBlob(cb, requestedType, quality)`.
3. **Verify `blob.type`.** If it differs from `requestedType`, set `note` to the user-facing string and change the filename extension to match reality (REQ-011). The UI must never label a PNG as a JPEG.
4. If `blob.size > MAX_UPLOAD_BYTES`, binary-search quality downward across ≥3 steps, never below `JPEG_QUALITY_FLOOR` (REQ-012, REQ-029). If the floor is reached and the blob is still over budget, return the floor result with a `note` recommending PNG — do not silently go lower.
5. Filename: `youtube-banner-2560x1440.{png|jpg|webp}`, extension derived from the **verified** `blob.type`.

No `display-p3` export path exists. No watermark compositing step exists anywhere in this file or in `render.ts` (REQ-024).

**`src/lib/fonts.ts`** — canvas fonts only, per Decision D-1.

```ts
export interface FontDef { key: string; family: string; weight: number; url: string; }
export const FONTS: Record<string, FontDef>;               // ≤ 6 families (REQ-019)
export async function ensureFontLoaded(key: string): Promise<void>;
```

`ensureFontLoaded` must resolve before any `measureText` call that feeds a verdict. `PLAN.md §12` records the failure mode this prevents: metrics taken against a fallback face produce a false "all good".

**`src/lib/template.ts`**

```ts
export interface TemplateManifest { /* schema in ARCHITECTURE.md §12 */ }
export function templateToScene(m: TemplateManifest): Scene;
export function listTemplates(niche?: string): TemplateManifest[];
```

### A.4 Data flow — one cycle

```
 user input (pointer | key | file | field)
        │
        ▼
 applyChange(patch)            ← D-8: the single funnel
        │
        ├──► scene = { ...scene, ...patch }   (immutable replace)
        │
        ├──► schedule render     (rAF-coalesced, at display scale)
        │         └──► renderPreview → editor canvas
        │              └──► renderDeviceCrop × 4 → preview canvases
        │
        ├──► schedule validate   (same rAF tick)
        │         └──► validateScene → VerdictList → aria-live region
        │
        └──► schedule persist    (200 ms debounce)
                  └──► serializeScene → sessionStorage[SCENE_KEY]
```

Export is **not** in this cycle. It is an explicit user action that runs a full-resolution render exactly once (`ARCHITECTURE.md §14`: never re-render at 2560×1440 on keystroke).

### A.5 Build-time data flow

```
 src/data/templates/*.json ──► scripts/validate-templates.mjs ──► FAIL BUILD or pass
                            └─► src/data/templates/index.ts (registry)
                                     ├─► /templates and /templates/[niche]  (gated ≥3)
                                     └─► bundled into tool island (≤30 KB)

 src/lib/spec.ts ──► SpecTable.astro ──► /guides/* device-crop table
                 └─► scripts/verify-spec.mjs ──► FAIL BUILD on drift
```

The guides' device table is *generated from `spec.ts`*, not hand-typed (`PLAN.md §5`, Gate 3). This is the mechanism that makes documentation incapable of drifting from behaviour.

---

## B. Pages

Ten routes. Three carry JavaScript. Seven carry none.

| Route | File | Client JS | Door / role | Indexable |
|---|---|---|---|---|
| `/` | `pages/index.astro` | none | Landing, three doors, honest explainer | Yes |
| `/tools/youtube-banner-resizer` | `pages/tools/youtube-banner-resizer.astro` | tool island | **Fix** (the wedge) | Yes |
| `/tools/youtube-banner-checker` | `pages/tools/youtube-banner-checker.astro` | tool island | **Check** | Yes |
| `/tools/youtube-banner-maker` | `pages/tools/youtube-banner-maker.astro` | tool island | **Create** | Yes |
| `/guides/youtube-banner-size` | `pages/guides/youtube-banner-size.astro` | none | Acquisition head | Yes |
| `/guides/youtube-banner-safe-area` | `pages/guides/youtube-banner-safe-area.astro` | none | Reconciliation page | Yes |
| `/templates` | `pages/templates/index.astro` | none | Gallery hub | Yes |
| `/templates/[niche]` | `pages/templates/[niche].astro` | none | Category, gated ≥3 templates | Yes, only if emitted |
| `/404` | `pages/404.astro` | none | — | No (`noindex`) |
| `/fr/*` | `pages/fr/*` | — | Phase 2, not built at MVP | n/a |

### B.1 Per-page build contract

Each page below lists: **purpose**, the **blocks** that must exist in the built HTML, its **SEO contract**, and its **gate**.

---

#### `/` — Landing

**Purpose.** State the product in one screen, route to the three doors, and explain the two mechanisms nobody else explains (device cropping and re-encoding) honestly enough to earn trust before the visitor uploads anything.

**Blocks (in DOM order):**
1. `Header` with nav.
2. Hero: `display` heading, one supporting paragraph at `body` size and `max-width: 68ch`, primary CTA to **Fix**, secondary CTA to **Create**.
3. Three-door section: three `Card`s — Fix / Check / Create — each with a one-sentence job statement and a link. Fix is visually first and first in the DOM (`PLAN.md §2`: Fix is the wedge).
4. "What YouTube actually does to your banner": the four device crops rendered as static SVG or pre-rendered images generated at build time from `spec.ts`, plus the plain statement that YouTube re-compresses every upload.
5. Spec strip: 2560×1440 recommended, 2048×1152 minimum, 6 MB max, safe area 1235×338 / 1546×423 — generated by `SpecTable.astro`.
6. Links to both guides.
7. `Footer` with privacy statement ("your image never leaves your browser").

**SEO contract.**
- `<title>`: `Free YouTube Banner Maker — Correct on Every Device` (Decision D-2, 51 chars).
- Meta description: written to the `SEO.md §4` mechanics; no exact-match phrase repeated beyond the anti-stuffing budget of ~1 per 150 words.
- Self-referential canonical. `og:` and `twitter:` tags. One `og:image` at 1200×630.
- JSON-LD: `WebSite` + `Organization`. No `AggregateRating`, no `Offer` (Decision D-4).
- Internal links: → both guides, → all three tools, → `/templates`.

**Gate.** Zero `<script type="module">` in the built HTML. LCP element is the hero heading (text), not an image.

---

#### `/tools/youtube-banner-resizer` — Fix door

**Purpose.** Upload an image, see exactly what each surface cuts, reposition until it is right, export a valid file. This is the minimum complete product (`PLAN.md §2.5`).

**Blocks.** `ToolShell` with `data-mode="fix"`, entry state = upload prompt. Below the tool, static server-rendered copy: what the safe area is, why the crops differ, the CDN cache advisory (REQ-014), and links to both guides. This copy is present with or without JS and is what makes the route non-empty for a crawler.

**Entry states.**
- No session, no `?` params → dropzone, empty editor, disabled controls.
- Session scene present with image → restore fully.
- Session scene present without image (D-10 over-size path) → restore layers, show the "re-upload your image" prompt with the reason stated.

**SEO contract.** Title and description per `SEO.md §5`. `SoftwareApplication` JSON-LD only. `BreadcrumbList`. Canonical is the clean URL; any `?template=` or `?mode=` variant canonicalises to it (D-11).

**Gate.** Gate 2 in `PLAN.md §4` — the 60-second test, honest `blob.type`, zero image bytes on the network, ≤65 KB gzip JS, full keyboard operation.

---

#### `/tools/youtube-banner-checker` — Check door

**Purpose.** Diagnosis without editing chrome. Upload → immediate verdict list → one-click handoff into Fix.

**Blocks.** `ToolShell` with `data-mode="check"`. The control column is suppressed; the verdict region is promoted to the primary position beside the previews. A single "Fix this" primary button per fixable verdict and one global "Fix all in the editor" action.

**Behaviour that differs from Fix.** No text panel, no background panel, no export button. Check produces verdicts and a handoff, nothing else. The cache-delay advisory (REQ-014) appears here as a first-class verdict of severity `info`, not as fine print.

**SEO contract.** As Fix. Distinct title, distinct description, distinct on-page copy — the three tool pages must not be near-duplicates (`SEO.md §4` cannibalization control).

**Gate.** Gate 4 in `PLAN.md §6` — round-trip across a full page load; every verdict names device, problem, and one action; the fixture set of deliberately broken banners never yields a false "all good".

---

#### `/tools/youtube-banner-maker` — Create door

**Purpose.** Template → edit → export, safe by construction.

**Blocks.** `ToolShell` with `data-mode="make"`. Entry is a template gallery panel, never a blank canvas (REQ-015); "start blank" exists but is a secondary, explicitly-chosen action. `?template=<id>` preloads that manifest.

**Editing constraints.** Only fields whose manifest role is `editable` are mutable. `protected` composition elements are not reachable through any control — not disabled-but-present, *absent*. A `safeAreaConstrained` text layer cannot be dragged out of the safe rect without producing a verdict (Gate 6).

**SEO contract.** As above, plus internal links into `/templates` and each niche page.

**Gate.** Gate 6 in `PLAN.md §8`.

---

#### `/guides/youtube-banner-size` — Acquisition head

**Purpose.** The authoritative size page. Every competitor restates Google's numbers; this one adds the measured device crops and states where each number comes from.

**Blocks.** Content collection markdown + `SpecTable.astro` (generated from `spec.ts`) + a section per device with its decoded `fcrop64` value + an FAQ block + CTA into Fix.

**SEO contract.** `FAQPage` JSON-LD (structure retained, rich-result claim dropped — D-3) + `BreadcrumbList`. Self-referential canonical. Internal links → safe-area guide, → Fix, → Check.

**Gate.** Gate 3: zero client JS, LCP < 0.8 s, CLS < 0.1, schema validates, and changing a constant in `spec.ts` visibly changes this page.

---

#### `/guides/youtube-banner-safe-area` — Reconciliation

**Purpose.** Show, with the arithmetic on the page, that 1235×338 @ 2048×1152 and 1546×423 @ 2560×1440 are one rectangle at 60.3% × 29.3% of the frame (REQ-004). Never assert they are "two rules".

**Blocks.** The arithmetic shown as a worked calculation, the safe rect drawn to scale, the device-crop table, CTA into Check.

**Gate.** As Gate 3. Copy review specifically confirms the "two rules" framing does not appear.

---

#### `/templates` and `/templates/[niche]`

**Purpose.** Gallery discovery. Browsable by category with no free-text search (REQ-021).

**Build gating (hard).** `[niche].astro` uses `getStaticPaths` filtered to niches with **≥3 structurally distinct templates**. A niche below the threshold produces no page, no sitemap entry, and no internal link. This is `SEO.md`'s thin-content guard implemented as an absence, not a `noindex`.

**Blocks.** Build-time-optimized preview images with intrinsic `width`/`height` set (CLS), a real descriptive paragraph per niche (not a templated sentence with the niche name swapped in — that is the same duplicate-content failure the gate exists to prevent), and a CTA into Create with `?template=`.

**Gate.** Zero client JS. Deleting a template until a niche drops to 2 removes the page from the build and from the sitemap.

---

#### `/404`

Static, `noindex`, links to the three doors and both guides. No JS.

### B.2 Site-wide emissions

| Artifact | Rule |
|---|---|
| `robots.txt` | Allows all; points at `sitemap.xml`. No `Disallow` on tool routes. |
| `sitemap.xml` | Generated. Contains only emitted, indexable, non-404 routes. A gated niche page is absent. |
| Canonicals | Self-referential on every page; parameterised tool URLs canonicalise to the clean route (D-11). |
| `og:image` | One per page type; 1200×630; generated at build. |
| `_headers` | CSP and cache rules per §F.4. |
| `llms.txt` | **Not shipped.** `SEO.md §8` scores it near-zero impact and trending toward Avoid-as-tactic. |

---

## C. Components

### C.1 Inventory

Astro components (build-time, no client JS unless stated):

| Component | Used by | Client JS |
|---|---|---|
| `Header.astro` | all | none |
| `Footer.astro` | all | none |
| `Cta.astro` | landing, guides, templates | none |
| `Card.astro` | landing, templates | none |
| `SpecTable.astro` | landing, both guides | none |
| `DevicePreview.astro` | `ToolShell` | mounts a canvas; script lives in the island |
| `VerdictList.astro` | `ToolShell` | markup only; the island writes into it |
| `ToolShell.astro` | three tool pages | mounts the one island |
| `TemplateCard.astro` | `/templates`, `/templates/[niche]` | none |

Client modules: exactly one — `src/islands/tool.ts`. If a second client module ever appears, it must be justified against the 65 KB budget in the PR description.

### C.2 `ToolShell.astro`

**Props.**

```ts
interface Props {
  mode: 'make' | 'fix' | 'check';
  title: string;          // <h1>
  intro: string;          // one-sentence job statement
  showControls?: boolean; // default true; false for check mode
  showExport?: boolean;   // default true; false for check mode
}
```

**Regions rendered (from `ARCHITECTURE.md §13.1`):**
1. Editor canvas container — the hero of the page.
2. Device switcher: four buttons, TV / Desktop / Tablet / Mobile.
3. Control column (right on desktop, stacked below on mobile): background, text, photo, export.
4. The four device preview canvases with a textual caption under each.
5. Verdict region, `aria-live="polite"`.
6. Re-encode simulation toggle plus its result canvas and byte read-out.
7. Export button plus format select plus the resolved-size read-out.
8. Static below-the-fold copy including the CDN cache advisory.
9. `<noscript>` fallback (REQ-030): spec table, guide copy, an explicit "this tool needs JavaScript" statement, and links to both guides so the route is never a blank void.

### C.3 Component visual binding (from `DESIGN.md`)

Every interactive element in the tool maps to a `DESIGN.md` component token. No component in this build invents its own geometry.

| UI element | `DESIGN.md` component | Height | Radius | Padding |
|---|---|---|---|---|
| Export button, primary CTAs | `button-primary` | 40 px | `md` 10 px | `0 20px` |
| Secondary actions ("Start blank", "Re-upload") | `button-secondary` | 40 px | `md` | `0 20px` |
| Icon-adjacent minor actions | `button-ghost` | 40 px | `md` | `0 20px` |
| Text fields, numeric fields, selects | `input` | 40 px | `sm` 6 px | `0 12px` |
| Door cards, template cards, panel groups | `card` | auto | `lg` 14 px | `24px` |
| Device switcher buttons | `chip` | 28 px | `full` | `0 12px` |
| Header nav items | `nav-link` | 36 px | `sm` | `0 10px` |

Binding rules that are not negotiable because `DESIGN.md` states them as Rules:

- **Rare Accent.** `accent` (`#2340B8`) covers at most ~10% of any screen. In the tool that means: the export button and the focus ring. Not the device tabs, not the panel headers, not the verdict icons.
- **Never-Gray-on-Color.** Verdict text on a tinted verdict background uses `ink-950`/`ink-800`, never `ink-500`.
- **Placeholder Floor.** `ink-500` (#6B7076, ≈5.0:1) is the lightest text permitted anywhere, including placeholders and captions.
- **Touch Target.** Every interactive control has a ≥44×44 px hit area even when its visual box is 28 px (device chips get invisible padding, not a bigger box).
- **One Elevation Signal / No Resting Shadow / No Nested Card.** Panels inside the control column are separated by `line-200` borders and spacing, not by cards inside cards.
- **Measure.** All prose blocks (`intro`, guide body, verdict `detail`) are capped at `max-width: 68ch`.
- **Heading Space.** Space above a heading is twice the space below it.
- Focus ring is `0 0 0 2px {surface-0}, 0 0 0 4px {accent}` on `:focus-visible` only — never on `:focus`, or pointer users get rings on click.
- Motion is limited to `transform`/`opacity`/`filter`/`clip-path` at 120/180/240/320 ms with the `DESIGN.md` easings, and collapses to ~1 ms under `prefers-reduced-motion` (also required by `PLAN.md` task 7.5).

### C.4 DOM contract (normative — Decision D-7)

The island queries exactly these hooks. Markup and script are reviewed together against this table; a rename in one without the other is a build-breaking change and should be caught by a startup assertion that every required hook resolves.

| Selector | Element | Purpose |
|---|---|---|
| `#tool-root[data-mode]` | `div` | Mount point; carries the door mode |
| `#editor` | `div` | Editor canvas container |
| `#editor-canvas` | `canvas` | The working canvas (display scale, not 2560×1440) |
| `#device-tabs` | `div[role="tablist"]` | Device switcher container |
| `#device-tabs button[data-device]` | `button[role="tab"]` | One per `DeviceKey` |
| `#preview-grid canvas[data-preview]` | `canvas` | One per `DeviceKey` |
| `#panel-background`, `#panel-text`, `#panel-photo`, `#panel-export` | `section` | Control panels |
| `#upload-input` | `input[type=file][accept="image/*"]` | Upload |
| `#dropzone` | `div` | Drag-and-drop target |
| `#verdicts` | `div[role="status"][aria-live="polite"]` | Verdict output |
| `#simulate-toggle` | `input[type=checkbox]` | Re-encode simulation |
| `#simulate-canvas`, `#simulate-meta` | `canvas`, `p` | Simulation result and byte read-out |
| `#export-format` | `select` | png / jpeg / webp |
| `#export-button` | `button` | Runs `exportBanner` |
| `#export-meta` | `p` | `2560 × 1440 px` and the resolved file size, separately labelled (REQ-026) |
| `#restore-notice` | `div` | Session-restore or re-upload prompt (D-10) |

The editor canvas carries `role="img"` and an `aria-label` that describes the current composition in words, refreshed whenever verdicts refresh (`ARCHITECTURE.md §15`).

### C.5 Island responsibilities

`src/islands/tool.ts`, the only client JS, implements exactly the ten responsibilities in `ARCHITECTURE.md §13.2`, organised as:

```
init()            → read data-mode, restore session or preset, assert DOM hooks
wireControls()    → every listener in §E routes into applyChange()
applyChange()     → the funnel (D-8): mutate, schedule render/validate/persist
scheduleFrame()   → rAF-coalesced render + validate
persist()         → 200 ms debounced sessionStorage write
runExport()       → re-validate synchronously (D-9), then exportBanner()
```

Nothing else in the codebase may write to `sessionStorage[SCENE_KEY]`.

---

## D. States

### D.1 Application phase (per tool page)

```
        ┌──────────┐  restore ok (with image)   ┌──────────┐
   ─────►  BOOT    ├──────────────────────────► │  READY   │
        └────┬─────┘                             └────┬─────┘
             │ restore ok (no image)                  │ upload / edit / device switch
             ├───────────────► NEEDS_SOURCE ──────────┤
             │ no session, mode=fix|check              │
             ├───────────────► EMPTY ──────────────────┤ (after successful upload)
             │ no session, mode=make                   │
             ├───────────────► GALLERY ────────────────┤ (after template pick)
             │ decode/parse failure                    │
             └───────────────► ERROR ──────────────────┘ (after retry)
```

| Phase | What the user sees | Controls |
|---|---|---|
| `BOOT` | Skeleton at the final layout dimensions (no CLS) | all disabled |
| `EMPTY` | Dropzone with the accepted formats and the 6 MB cap stated | upload only |
| `GALLERY` | Template grid; "start blank" secondary | gallery only |
| `NEEDS_SOURCE` | `#restore-notice`: "Your layout was kept. Your image was too large to carry between pages — please re-upload it." | upload only |
| `READY` | Editor, four previews, verdicts | all |
| `ERROR` | Named cause and one recovery action | recovery only |

`NEEDS_SOURCE` is the visible face of Decision D-10. It must state the reason. Silently dropping the image is explicitly forbidden by `PLAN.md §12`'s risk register.

### D.2 Export phase

```
IDLE ──► VALIDATING ──► RENDERING ──► ENCODING ──► [SEARCHING_QUALITY] ──► COMPLETE
                │                                          │
                └──► BLOCKED (errors present)              └──► FLOOR_REACHED
```

- `VALIDATING` re-runs `validateScene` synchronously (D-9).
- `BLOCKED` is **advisory, not preventive**: if `error` verdicts exist, the button label changes to "Export anyway" and the verdict list is scrolled into view. The user is never locked out of their own file — `PRD.md` positions the product as diagnosis without judgement (REQ-013), and a hard block would contradict that.
- `SEARCHING_QUALITY` shows a determinate step count, not a spinner, because the search is bounded at ≥3 known steps.
- `FLOOR_REACHED` shows the recommendation to switch to PNG (REQ-029), the achieved size, and the floor value.
- `COMPLETE` shows `2560 × 1440 px` and the resolved byte size as two separately labelled facts (REQ-026), plus the `blob.type` note if a fallback occurred (REQ-011).

### D.3 Simulation phase

`OFF → COMPUTING → SHOWN → OFF`, plus `FAILED`. In `SHOWN`, the caption is fixed copy: **"Approximate result of YouTube's re-encode."** — this string is required verbatim (REQ-005) and is checked by the copy grep in §F.6.

### D.4 Verdict taxonomy

The complete verdict set for MVP. Each has a fixed `id` so tests and analytics can reference it without matching on prose. **No verdict outside this table may be invented** (REQ-013: "Unsupported findings are not invented").

| `id` | Severity | Trigger | `title` shape | `action` |
|---|---|---|---|---|
| `safe-overflow` | error | A `safeAreaConstrained` layer's bounding box crosses `SAFE` | "Your {layer name} is cut off on {device}" | `reposition` |
| `subject-outside-safe` | warn | Background image with `extend: false` where the visible subject region falls outside `SAFE` | "The main part of your image sits outside the safe area" | `reposition` |
| `low-resolution` | warn | `sourceRaster` below the target crop's native pixels | "This image won't be sharp at TV size" | `reposition`\* |
| `filesize-over` | error | Estimated export bytes > `MAX_UPLOAD_BYTES` | "This file will be too large to upload" | `convert` |
| `non-srgb-source` | info | Source image appears to exceed sRGB | "Colour may shift after upload" | — |
| `cache-delay` | info | Always, on Check; on Fix after a successful export | "Your new banner can take up to 24 hours to appear everywhere" | — |
| `text-too-large` | warn | A text layer's measured box exceeds its safe slot at the authored size | "Your {layer name} is too large for the safe area" | `reduce-size` |
| `font-not-loaded` | info | `ensureFontLoaded` has not resolved when validation runs | "Still measuring — fonts are loading" | — |

\* `low-resolution` offers no repair action for the image itself; its `action` surfaces guidance rather than a mutation. `fixable` is `false` for it.

`font-not-loaded` exists specifically so validation never reports a confident "all good" from fallback-face metrics (`PLAN.md §12` risk row). While it is present, the verdict region must not display an all-clear.

**All-clear state.** When `validateScene` returns an empty array *and* no `font-not-loaded` is pending, the region reads: "Nothing is cut off on TV, desktop, tablet, or mobile." — a statement of what was checked, not a score (REQ-013).

### D.5 Per-component state matrix

`DESIGN.md` requires eight states on every component. This is the binding for the tool's controls; a component is not done until all eight are implemented or explicitly marked N/A.

| Component | default | hover | focus-visible | active | disabled | loading | error | empty |
|---|---|---|---|---|---|---|---|---|
| `button-primary` (Export) | ✓ | ✓ | ✓ | ✓ | ✓ while BOOT/EMPTY | ✓ during export phases | ✓ on export failure | N/A |
| `button-secondary` | ✓ | ✓ | ✓ | ✓ | ✓ | N/A | N/A | N/A |
| Device `chip` | ✓ | ✓ | ✓ | ✓ = selected tab | ✓ while BOOT | N/A | N/A | N/A |
| `input` (text field) | ✓ | ✓ | ✓ | N/A | ✓ | N/A | ✓ tied to `text-too-large` | ✓ placeholder at `ink-500` |
| Dropzone | ✓ | ✓ drag-over | ✓ | ✓ | ✓ | ✓ during decode | ✓ wrong type / oversize | ✓ = the EMPTY phase |
| Verdict list | N/A | N/A | ✓ per action button | N/A | N/A | ✓ while validating | N/A | ✓ = all-clear copy |
| Template card | ✓ | ✓ | ✓ | ✓ selected | N/A | ✓ preview loading | N/A | N/A |

### D.6 Persisted vs ephemeral state

| State | Persisted to `sessionStorage`? |
|---|---|
| `Scene` (background, layers, export prefs) | Yes |
| Source image bytes | Only as base64 below 3 MB (D-10) |
| Selected device tab | No — resets to `mobile` on every load |
| Simulation toggle | No |
| Verdicts | No — always recomputed |
| Scroll position, panel expansion | No |

Selected device resets to **mobile** deliberately: mobile is the tightest crop and the most common failure, so the default view is the one that surfaces problems.

---

## E. Interactions

Every interaction below lists its pointer form, its keyboard form, what it mutates, and its ARIA obligation. An interaction with no keyboard form does not ship (`PLAN.md` Gate 2: "Keyboard-only operation completes the full flow").

| # | Interaction | Pointer | Keyboard | Mutates | ARIA / feedback |
|---|---|---|---|---|---|
| E-1 | Upload image | Click dropzone, or drag-and-drop a file onto it | `Tab` to the input, `Enter`/`Space` opens the picker | `background` → `{type:'image', ...}`, cover-fit applied | Dropzone announces accepted types + 6 MB cap; decode failures announced in `#verdicts` |
| E-2 | Reposition subject | `pointerdown` → `pointermove` on `#editor-canvas`; delta converted from canvas px → source offset through the cover-fit scale, then clamped | Arrow keys nudge `offsetX`/`offsetY` by a small step; `Shift`+Arrow by a large step | `background.offsetX/offsetY` | Canvas `aria-label` refreshed; verdicts re-announced on settle |
| E-3 | Zoom | Wheel or pinch over the canvas | `+` / `-` | `background.zoom`, clamped to `[1, max(1, cap)]` | Announce the clamp when it binds ("Already at full source resolution") rather than silently ignoring the key |
| E-4 | Switch device | Click a chip | `Tab` into the tablist, `←`/`→` move between tabs (roving tabindex), `Home`/`End` jump | none — preview only | `role="tab"` + `aria-selected`; the editor canvas does **not** change (REQ-002) |
| E-5 | Edit text | Type in the text `input` | Same | `layers[i].text` | Validation debounced one rAF; `text-too-large` binds to the field's error state |
| E-6 | Move a text layer | Drag inside the safe slot | Arrow keys while the layer is selected | `layers[i].position` (fractions) | A `safeAreaConstrained` layer that reaches its bound stops and emits `safe-overflow` rather than escaping (REQ-018) |
| E-7 | Change colour / size / alignment | Control interaction | Same | corresponding layer field | Bounded ranges; no free numeric entry outside the bound |
| E-8 | Toggle background extension | Checkbox | `Space` | `background.extend` | Defaults **off** (REQ-009); toggling re-runs validation because extension content is background, not subject |
| E-9 | Toggle re-encode simulation | Checkbox | `Space` | none (view state) | Result labelled with the required verbatim string (§D.3) |
| E-10 | Choose export format | `select` | Native select keyboard | `export.format` | — |
| E-11 | Export | Click `#export-button` | `Enter`/`Space` | none | Phase transitions announced politely; the `blob.type` note is announced, not only shown |
| E-12 | Pick a template | Click a `TemplateCard` | `Enter` on the focused card | whole `Scene` replaced via `templateToScene` | Focus moves to the editor heading after load |
| E-13 | "Fix this" from a verdict | Click the verdict's action | `Enter` | writes scene → `sessionStorage` → full page navigation to Fix | The target page opens with the same image and the same problem pre-selected (Gate 4) |
| E-14 | Restore / re-upload prompt | Click "Re-upload" | `Enter` | reopens E-1 | The notice states *why* (D-10) |

**Interaction invariants**

1. Nothing in this table triggers a 2560×1440 render except E-11. Preview renders at display scale (`ARCHITECTURE.md §14`).
2. Every mutation goes through `applyChange` (D-8). No listener writes `scene.x = y` directly.
3. Drag is a canvas operation, not a DOM drag, so there is no focus-management dance (`ARCHITECTURE.md §13.3`). Focus stays where the user put it.
4. Verdict announcements are `polite`, never `assertive` — a verdict interrupting the user mid-typing is worse than a verdict arriving a beat late.
5. No interaction is available by pointer only. If a design makes a keyboard path awkward, the design changes, not the requirement.

---

## F. Technical Constraints

### F.1 Stack (fixed; changing any row is an architecture decision, not an implementation choice)

| Layer | Choice | Forbidden alternative |
|---|---|---|
| Framework | Astro v5+, `output: 'static'` | SSR, hybrid, any client-side router |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | CSS-in-JS, a component library |
| Language | TypeScript, `strict: true` | `any` in `src/lib/**` |
| UI runtime | Vanilla TS islands | React, Vue, Svelte, Preact, Solid, Lit |
| Graphics | Canvas 2D | WebGL, WASM, WebGPU |
| Hosting | Cloudflare Pages | Any origin server |
| Node | ≥ 20 | — |
| Backend | none | API routes, serverless functions, a database, auth |

### F.2 Performance budgets (CI-enforced)

| Budget | Value | Enforcement |
|---|---|---|
| Tool-page JS | ≤ 65 KB gzip | Build-size check; **fails the build** |
| Content-page JS | 0 KB | Assert no `<script type="module">` in built content HTML |
| Template payload | ≤ ~30 KB total | Build-size check |
| Font bytes on any single route | ≤ 40 KB | Measured at Stage 5; see the split below |
| LCP | < 0.8 s (mid-tier mobile profile) | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| INP | < 200 ms | Lighthouse CI / RUM |
| Export time | < 1.5 s at 2560×1440 on mid-tier mobile | Manual timing at Gate 2 |

**Font budget split (new, forced by Decision D-1).** `ARCHITECTURE.md §14` sets ≤40 KB total. With two registries, that total must be divided:

- **Site UI:** one variable Switzer WOFF2, subset to Latin + punctuation, covering weights 400–600 in a single file. Preloaded on every route. JetBrains Mono is loaded **only** on routes that actually render monospace (the spec tables) and never on the LCP path.
- **Canvas fonts:** loaded lazily on tool routes only, and only the families the current template or scene actually references — never the whole registry.
- **Ceiling:** the sum on any single route stays ≤40 KB.

> **Open item O-1.** The real byte sizes are unknown until the subsets are built at Stage 5 task 5.4. If the measured sum exceeds 40 KB, the resolution order is: (1) drop JetBrains Mono entirely and render spec tables in the UI face, (2) narrow the Switzer subset, (3) cut a canvas family from the registry. Raising the budget requires explicit sign-off and an amendment here. No byte figure is asserted in this document before measurement.

### F.3 Browser and device constraints

| Constraint | Consequence for the build |
|---|---|
| iOS caps canvas at 4096×4096 | 2560×1440 export is safe. **2× supersampling is not** and must never be added as a "quality improvement". |
| `canvas.toBlob` guarantees only `image/png` | Every export verifies `blob.type` and renames the file to match reality (REQ-011). |
| `measureText` before font load returns fallback metrics | `ensureFontLoaded` gates every metric that feeds a verdict; `font-not-loaded` suppresses the all-clear. |
| `blob:` URLs do not survive a page load | D-10: base64 below 3 MB, explicit re-upload prompt above it. |
| `sessionStorage` clears on tab close | By design (REQ-022). No cross-session persistence exists. |
| Pointer events may be touch, pen, or mouse | One `pointer*` code path, not three. |

### F.4 Security (from `ARCHITECTURE.md §19`)

Delivered via `_headers` on Cloudflare Pages:

```
Content-Security-Policy: default-src 'self'; img-src 'self' blob: data:; style-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

Binding rules:

- No accounts exist, so there are no auth tokens, no sessions, and no server-side storage of user content.
- User uploads are read with `FileReader` / `URL.createObjectURL` and **never transmitted**. Every object URL is revoked after use (REQ-027).
- Template JSON is build-time trusted but is still schema-validated, and no template field is ever interpolated into HTML without escaping.
- User image bytes are never persisted beyond the tab session.
- CSP permits no third-party script origin. Analytics must satisfy this or not ship.

### F.5 Privacy and analytics

Cookieless, first-party, funnel events only: `template_selected`, `editor_start`, `upload`, `validation_run`, `export_start`, `export_success`, `activation`, `re_export`.

Hard rule: **no event payload may contain user text, image data, filenames, or dimensions derived from user content.** Stage 7 task 7.2 verifies this by inspecting every emitted payload, not by reading the code that builds it.

### F.6 Honesty guards (product-defining, not cosmetic)

These are the constraints that make the product's positioning true. They are enforced by a grep in CI, not by good intentions.

**Banned strings in all user-facing copy** (case-insensitive, `src/**` and `src/content/**`):

```
no quality loss
lossless
pixel perfect
pixel-perfect
guaranteed
never blurry
```

**Required strings:**

| String | Where |
|---|---|
| `Approximate result of YouTube's re-encode.` | Simulation caption (REQ-005) |
| A statement that YouTube re-compresses every upload and this cannot be avoided | Landing + both tool pages with export |
| The CDN cache advisory (up to 24 hours) | Fix and Check (REQ-014) |

**Framing bans:**
- Never present the simulation output as a downloadable final file.
- Never describe 1235×338 and 1546×423 as "two rules" (REQ-004).
- Never state a ranking probability, percentage, or guarantee anywhere on the site (`SEO.md §0`).
- Never emit `AggregateRating`, review counts, or author credentials that do not exist (D-4).

### F.7 Content and SEO constraints applied at build time

| Constraint | Mechanism |
|---|---|
| No thin pages | `[niche].astro` emits nothing below 3 distinct templates |
| No duplicate pages | Uniqueness hash in `validate-templates.mjs`; three tool pages carry distinct copy |
| No parameter sprawl | `?template=` canonicalises to the clean URL (D-11) |
| No fabricated structured data | Schema generators take only real, on-page values |
| Anti-stuffing | No exact-match phrase more than ~once per 150 words, checked at content review |

### F.8 What is explicitly not built

Reproduced so no one re-litigates it mid-sprint (`PRD.md §20.4`, `PLAN.md §11`, `ARCHITECTURE.md §22`): accounts, saved projects, cloud storage, watermarks, download counters, email gates, freeform layer editing, stock photo library, AI generation, background removal, non-YouTube formats, animated banners, thousands of templates, team features, server-side image processing, a client-side router, a native app.

---

## G. Implementation Order

Stage boundaries and gates come from `PLAN.md` (Decision D-6). `ARCHITECTURE.md §25`'s 13 steps appear as tasks. Task IDs match `PLAN.md` where they exist; new tasks introduced by this document carry a `+` suffix.

### Stage 0 — Pre-build verification · **HARD STOP GATE**

**No product code is written until Gate 0 passes.** The whole architecture rests on device-crop fractions observed on one channel. If they are per-channel, the core model changes and the differentiator collapses.

| Task | Output |
|---|---|
| 0.1 | Verify device crop fractions across ≥8 diverse channels: fetch each channel page, extract `yt3.googleusercontent.com` banner URLs, decode every `fcrop64`, compare against `DEVICES` |
| 0.2 | Record which `w####` served-width variants appear |
| 0.3 | Re-measure the JPEG re-encode budget: request several `w1707` desktop slices with `Accept: image/webp`; record `content-type` and `content-length` |
| 0.4 | Re-fetch `support.google.com/youtube/answer/10456525` to confirm the 6 MB cap and safe-area figures are current |
| 0.5 | Verify `youtubebannermaker.com` registrability; register if available |
| 0.6 | Re-attempt Canva verification; if still blocked, keep the UNVERIFIED marker in `PRD.md` |

**Artifact:** `docs/verification/fcrop-survey.md` — channel → decoded rects → match/mismatch. This file is the evidence behind the product's central claim and must exist before Stage 1.

**Gate 0:** PASS if the four rectangles are identical within rounding across ≥8 channels. CONDITIONAL if they vary in a bounded way — `DEVICES` becomes a union of observed rects and validation runs against the *most restrictive*. **FAIL/STOP** if crops are arbitrary per channel — return to `PRD.md §5` and re-decide direction before writing code.

*Estimate: 1–2 days.*

---

### Stage 1 — Engine core (no UI, no pages)

| Task | Output | Depends on |
|---|---|---|
| 1.1 | Scaffold Astro + Tailwind v4 + TS strict + Vitest | Gate 0 |
| 1.2 | `src/lib/spec.ts` with the **verified** constants | 0.1 |
| 1.3 | `src/lib/scene.ts`: types, `defaultScene`, serialize/deserialize | 1.2 |
| 1.4 | `src/lib/render.ts`: background solid/gradient, shapes, text | 1.3 |
| 1.5 | Cover-fit + zoom clamp + offset clamp | 1.4 |
| 1.6 | `renderDeviceCrop` — crop extraction from the single canvas | 1.4 |
| 1.7 | Unit tests for all fraction math and both clamps | 1.5, 1.6 |
| 1.8 | Golden-image harness | 1.7 |
| 1.9+ | `scripts/verify-spec.mjs` — asserts `spec.ts` still matches the Stage 0 survey | 1.2 |

**Gate 1:** `renderExport` produces exactly 2560×1440 with `colorSpace: 'srgb'`. The safe rect computed from `SAFE` equals 1235×338 @ 2048×1152 **and** 1546×423 @ 2560×1440 — both asserted; failure means the fractions are wrong. Cover-fit coverage invariant holds under fuzz for any source dimensions and any legal zoom/offset. Zoom never permits upscaling past 1:1. Every device crop is pixel-equal to the corresponding sub-rectangle of the full render.

*Estimate: 4–6 days.*

---

### Stage 2 — Fix door · the wedge · `/tools/youtube-banner-resizer`

| Task | Output | Depends on |
|---|---|---|
| 2.1 | `ToolShell.astro` per §C.2, including the `<noscript>` block | 1.4 |
| 2.2 | `src/islands/tool.ts`: init, `applyChange` funnel, rAF-coalesced preview | 1.3, 1.4 |
| 2.3 | Upload: file input + drag-drop + `image.decode()` + oversize guard | 2.2 |
| 2.4 | Repositioning: pointer drag + zoom with arrow/`+`/`-` fallback | 1.5 |
| 2.5 | Four device preview canvases | 1.6 |
| 2.6 | `src/lib/validate.ts` — the §D.4 verdict set | 1.2 |
| 2.7 | Verdict UI: plain language, direction-to-fix, `aria-live` | 2.6 |
| 2.8 | `src/lib/simulate.ts` with the required verbatim caption | 1.2 |
| 2.9 | `src/lib/export.ts`: format select, `blob.type` verification, 6 MB search, quality floor | 1.4 |
| 2.10 | `sessionStorage` persistence + the D-10 base64/re-upload path | 1.3 |
| 2.11+ | Design-system pass: bind every control to its `DESIGN.md` token and implement all eight states (§D.5) | 2.1–2.10 |
| 2.12+ | CI JS-size gate wired now, not at the end | 2.2 |

**Gate 2:** The 60-second test — a first-time user on a mid-tier phone lands, uploads, sees what mobile cuts, fixes it, downloads a valid 2560×1440 file, in under 60 seconds, with no account and no watermark. Every export is 2560×1440, sRGB, ≤6 MB, with the true `blob.type` reported and a matching extension. Zero bytes of user image data leave the device (network panel, full session). The copy grep (§F.6) returns zero hits. Tool-page JS ≤65 KB gzip, enforced by CI. Keyboard-only operation completes the full flow.

*Estimate: 8–12 days.*

---

### Stage 3 — Acquisition content · **runs in parallel with Stage 2**

Shipping the guides *with* Stage 2 rather than after it is deliberate: the tool needs entry traffic from day one, and indexation lag is the reason (`PLAN.md §12`).

| Task | Output |
|---|---|
| 3.1 | `/guides/youtube-banner-size` with the device table generated from `spec.ts` |
| 3.2 | `/guides/youtube-banner-safe-area` with the arithmetic shown |
| 3.3 | Content collections + frontmatter + JSON-LD (`FAQPage` per D-3, `BreadcrumbList`) |
| 3.4 | Canonicals, OG tags, sitemap, `robots.txt` |
| 3.5 | Internal links: guides → Fix with intent-matched CTAs |
| 3.6+ | `/` landing per §B.1 |
| 3.7+ | Pre-launch indexing gate from `SEO.md §2` (8 blocking checks) |

**Gate 3:** Both guides emit **zero** client JavaScript (verify the built HTML contains no `<script type="module">`). LCP < 0.8 s on a throttled mid-tier profile. CLS < 0.1. Schema validates. Changing a constant in `spec.ts` visibly changes the guide's table.

*Estimate: 3–4 days, parallel with Stage 2.*

---

### Stage 4 — Check door · `/tools/youtube-banner-checker`

| Task | Output |
|---|---|
| 4.1 | Check-mode entry: upload → immediate validation, no editing chrome |
| 4.2 | Verdict report: per-device, ranked by severity, one concrete fix each |
| 4.3 | "Fix it" handoff → write scene to `sessionStorage` → full page navigation |
| 4.4 | Cache-delay advisory as a first-class `info` verdict |
| 4.5 | Low-resolution and file-size diagnostics with plain-language causes |
| 4.6+ | Fixture set of deliberately broken banners, committed as test data |

**Gate 4:** Round-trip works across a **full page load** — Check → "Fix it" → Fix opens with the same image and the same problem pre-selected. Every verdict names the device, the specific problem, and one action; no verdict says only "text is outside the safe area" without saying which direction to move. The tool never reports a false all-clear on the broken-banner fixtures.

*Estimate: 3–5 days.*

---

### Stage 5 — Template system · schema and validator **before** art

Building the machinery and the CI gate before commissioning 24 designs is the whole point of this ordering: authoring against an unvalidated schema produces 24 files that need rework.

| Task | Output |
|---|---|
| 5.1 | Template JSON schema + `src/lib/template.ts` (manifest → scene) |
| 5.2 | `scripts/validate-templates.mjs`: safe-rect compliance, structural uniqueness, schema validity, editable/protected disjointness |
| 5.3 | Wire the validator into `prebuild` and CI as a **hard build failure** |
| 5.4 | `src/lib/fonts.ts`: ≤6 canvas families, subset, self-hosted WOFF2, preload; `ensureFontLoaded` gate. Measure the §F.2 font split here and resolve O-1 |
| 5.5 | Author 3 pilot templates; run them through the validator; fix the schema against what breaks |
| 5.6 | Author the remaining ~21 across niches |
| 5.7 | Generate optimized gallery previews at build time |
| 5.8+ | Human design review with a cut bar (see below) |

**Gate 5:** `node scripts/validate-templates.mjs` passes on all templates **and fails the build when a deliberately-broken template is introduced** — test the gate itself, not only its output. The uniqueness hash catches a colour-only clone. Every template's title and tagline sit fully inside the safe rect at their authored size, measured with the real loaded font. Each niche page has ≥3 distinct templates or is not emitted and is excluded from the sitemap. Template payload ≤~30 KB; font budget resolved.

**The cut bar.** The validator guarantees correctness, not beauty. Each template is judged against one question: *would a creator ship this without editing it?* Templates that fail are cut, not shipped to pad the count. Twelve good templates beat twenty-four filler ones — and REQ-016's "≥24" is a target, not a licence to ship filler. If fewer than 24 survive the bar, ship fewer and record the count honestly.

*Estimate: 10–15 days, mostly design labour, reviewable in parallel with Stage 6 engineering.*

---

### Stage 6 — Create door · `/tools/youtube-banner-maker`

| Task | Output |
|---|---|
| 6.1 | Template gallery entry with `?template=` preset (canonicalised per D-11) |
| 6.2 | Editing constrained to `editable` roles; `protected` composition absent from the UI |
| 6.3 | Text editing with live safe-rect validation on every keystroke (debounced) |
| 6.4 | Background swap: solid / gradient / user photo, reusing Stage 2 cover-fit |
| 6.5 | `/templates` hub + `/templates/[niche]` pages, static, zero JS, gated ≥3 |
| 6.6 | Cross-door handoff Create → Check |

**Gate 6:** Template → change name → change colour → export a correct banner in under 60 seconds. It is **not possible** to drag a `safeAreaConstrained` layer out of the safe rect without receiving a verdict. Editing never breaks composition — `protected` elements are not mutable through the UI. Category pages emit zero client JS and carry real descriptive copy.

*Estimate: 6–8 days.*

---

### Stage 7 — Measurement, accessibility, performance, SEO

| Task | Output |
|---|---|
| 7.1 | Cookieless first-party analytics; the eight funnel events only |
| 7.2 | Verify no image bytes and no content strings appear in any event payload |
| 7.3 | Full keyboard pass; screen-reader pass on verdicts |
| 7.4 | Contrast audit; icon + text + colour on every status |
| 7.5 | `prefers-reduced-motion` honoured |
| 7.6 | CI budget gates: JS size, Lighthouse LCP/CLS/INP |
| 7.7 | Security headers via `_headers` per §F.4 |
| 7.8 | SEO completeness sweep: canonicals, OG images, sitemap correctness |
| 7.9+ | `SEO.md §10` per-page pre-publish checklist run on every route |
| 7.10+ | `DESIGN.md` conformance pass: spacing scale, control heights, focus rings, the Rare Accent budget |

**Gate 7:** CI fails on any budget regression — prove it by pushing a deliberate 20 KB bloat and watching the build go red. A screen-reader user completes the Check flow and understands every verdict without seeing the canvas. CSP blocks all third-party script origins and `img-src` permits only `'self' blob: data:`. No analytics event contains user text or image data.

*Estimate: 4–6 days.*

---

### Stage 8 — Launch and validation

**Scope:** US / English only. France (`/fr/`, hreflang, same domain) is deferred to phase 2.

**The validation experiment:** ship Fix + the size guide and measure one number — **the share of visitors who upload an image and then export a corrected one.**

- Healthy share → the correctness thesis holds and the template investment is justified.
- Arrive, read, leave without uploading → trust or comprehension problem; fix the landing explanation before adding features.
- Upload but never export → the fix loop is failing; an interaction problem, not a positioning one.

One metric, not a dashboard. Everything else is diagnostic.

### G.1 Sequencing

```
Week 1        Stage 0 (verify)  ──► Stage 1 (engine)
Week 2–3      Stage 2 (Fix door)  ║  Stage 3 (guides + landing, parallel)
Week 4        Stage 4 (Check door)
Week 4–6      Stage 5 (templates: schema + validator first, then art)
Week 6–7      Stage 6 (Create door)
Week 7–8      Stage 7 (measurement, a11y, perf, SEO)
Week 8        Stage 8 (launch + validation experiment)
```

A shippable product exists at the end of Week 3 (Fix + guides). Everything after increases surface area, not viability. If the plan is cut at any stage boundary from 2 onward, what has shipped is still coherent and still useful.

### G.2 CI pipeline (from Stage 2 onward)

```
npm ci
  → astro check                        (TS strict; zero errors)
  → eslint                             (zero errors)
  → node scripts/verify-spec.mjs       (spec.ts matches the Stage 0 survey)
  → node scripts/validate-templates.mjs (Stage 5+; hard failure)
  → vitest run                         (unit + golden-image)
  → node scripts/check-copy.mjs        (banned/required strings, §F.6)
  → astro build
  → node scripts/check-budgets.mjs     (JS gzip size; zero-JS on content routes)
  → lighthouse-ci                      (LCP / CLS / INP)
  → deploy (Cloudflare Pages)
```

Any red step blocks the deploy. The budget and copy gates are wired at Stage 2, not added at the end — `PLAN.md`'s risk register names late-added budget gates as a known way to lose the speed advantage.

---

## H. Acceptance Criteria

Three layers: machine-checked in CI (H.1), per-stage gates already stated in §G, and human acceptance scripts (H.2). A release requires all three.

### H.1 Machine-checked

| # | Assertion | Where |
|---|---|---|
| M-1 | `astro check` and `eslint` return zero errors | CI |
| M-2 | Safe rect from `SAFE` == 1235×338 @ 2048×1152 and == 1546×423 @ 2560×1440 | `spec.test.ts` |
| M-3 | Every device crop is pixel-equal to the corresponding sub-rect of the full render | `render.test.ts` |
| M-4 | Cover-fit leaves no transparent pixel at any edge, for fuzzed source dimensions × legal zoom/offset | `render.test.ts` |
| M-5 | Zoom is never permitted above `max(1, min(sw/cw, sh/ch))` | `render.test.ts` |
| M-6 | `renderExport` output is 2560×1440 and the context was requested with `colorSpace: 'srgb'` | `export.test.ts` |
| M-7 | A stubbed `toBlob` that returns PNG for a JPEG request produces `note` set and a `.png` filename | `export.test.ts` |
| M-8 | An oversize export converges under `MAX_UPLOAD_BYTES` in ≥3 steps and never emits quality < 0.7 | `export.test.ts` |
| M-9 | Ten consecutive exports all succeed with no counter, throttle, or gate | `export.test.ts` |
| M-10 | The rendered bitmap contains only scene-derived pixels — no watermark, badge, or brand frame | `render.test.ts` |
| M-11 | `deserializeScene` returns `null` (never partial, never throws) on version mismatch, missing field, or >8 layers | `scene.test.ts` |
| M-12 | Broken-banner fixtures each produce at least one `error` verdict; none returns all-clear | `validate.test.ts` |
| M-13 | `validate-templates.mjs` passes on the real set **and fails on an intentionally broken template** | CI + a gate self-test |
| M-14 | A colour-only clone of an existing template is rejected by the uniqueness hash | CI |
| M-15 | Built content routes contain no `<script type="module">` | `check-budgets.mjs` |
| M-16 | Tool-route JS ≤ 65 KB gzip | `check-budgets.mjs` |
| M-17 | Template payload ≤ ~30 KB; font bytes per route ≤ 40 KB | `check-budgets.mjs` |
| M-18 | No banned honesty string appears in `src/**`; every required string appears where §F.6 requires it | `check-copy.mjs` |
| M-19 | No literal device-crop pixel value (`1546`, `423`, `1235`, `338`, `0.2942`, `0.7246`) appears outside `spec.ts` and its tests | `check-copy.mjs` |
| M-20 | `spec.ts` still matches `docs/verification/fcrop-survey.md` | `verify-spec.mjs` |
| M-21 | A niche with <3 distinct templates emits no page and no sitemap entry | Build test |
| M-22 | Every page has a self-referential canonical, a `<title>`, a meta description, and `og:` tags | Build test |
| M-23 | No emitted JSON-LD contains `AggregateRating`, `Offer`, or a review count | Build test |
| M-24 | LCP < 0.8 s, CLS < 0.1, INP < 200 ms on the Lighthouse CI profile | Lighthouse CI |
| M-25 | The DOM contract in §C.4 resolves — every required hook exists at island init | Runtime assert + smoke test |

### H.2 Human acceptance scripts

Run on a real mid-tier phone and a real desktop, by someone who did not build the feature.

**A-1 — The 60-second test (Fix).** Land on `/tools/youtube-banner-resizer`, upload a photo, identify what mobile cuts, correct it, download the file. Under 60 seconds. No account. No watermark. *Traces: REQ-008, REQ-023, REQ-024, Gate 2.*

**A-2 — The 60-second test (Create).** Land on `/tools/youtube-banner-maker`, pick a template, change the channel name, change a colour, export. Under 60 seconds. *Traces: REQ-015, REQ-016, REQ-018, Gate 6.*

**A-3 — Portrait rescue.** Upload a portrait-orientation image. The subject can be brought inside the safe rect by repositioning, with no distortion and no stretching. *Traces: REQ-008, REQ-009, PRD §40.1.3.*

**A-4 — Keyboard only.** Unplug the mouse. Complete A-1 end to end using only the keyboard, including repositioning and zoom. *Traces: Gate 2, `ARCHITECTURE.md §15`.*

**A-5 — Screen reader.** With the canvas not visible, complete the Check flow and understand every verdict from the `aria-live` region alone. *Traces: Gate 7.*

**A-6 — Network audit.** With DevTools open for a full session — load, upload, edit, simulate, export — confirm zero bytes of user image data leave the device. *Traces: REQ-027, Gate 2.*

**A-7 — JS disabled.** Disable JavaScript, load each tool route. Each serves the spec table, the guide copy, and a clear "enable JavaScript" statement. No blank void. *Traces: REQ-030.*

**A-8 — Cross-door round trip.** On Check, click "Fix this". Confirm the Fix door opens *after a full page load* with the same image and the same problem pre-selected. Repeat with an image over 3 MB and confirm the re-upload prompt states the reason rather than failing silently. *Traces: REQ-022, D-10, Gate 4.*

**A-9 — Honesty read-through.** Read every user-facing string on the site. No promise of no-quality-loss. The simulation is labelled approximate everywhere it appears. The two safe-area figures are never described as two rules. *Traces: REQ-004, REQ-005, §F.6.*

**A-10 — Design conformance.** Audit a tool page against `DESIGN.md`: every control height is 32/40/48; every radius is from the scale; every gap is on the 4-unit spacing scale; focus rings appear on `:focus-visible` only; `accent` covers ≤10% of the screen; no nested cards; no resting shadows; prose is capped at 68ch. *Traces: `DESIGN.md`, task 7.10+.*

**A-11 — Template cut bar.** For each shipped template, answer: would a creator ship this without editing it? Any "no" is cut before launch. *Traces: Gate 5.*

### H.3 Definition of done (whole project, v1)

All nine simultaneously:

1. All three doors work and hand off to each other correctly across full page loads.
2. Every export is 2560×1440, sRGB, ≤6 MB, with the true `blob.type` reported.
3. No user image data ever leaves the browser, verified in the network panel.
4. Every shipped template passes the CI safe-rect gate, and the gate itself is proven to fail on a broken template.
5. Content pages ship zero client JS; tool pages stay within the 65 KB gzip budget; both enforced in CI.
6. The full flow is completable by keyboard alone and comprehensible by screen reader.
7. No user-facing copy promises "no quality loss," and the re-encode simulation is labelled approximate everywhere.
8. The size guide's device table is generated from `spec.ts`, so documentation cannot drift from behaviour.
9. `docs/verification/fcrop-survey.md` exists and supports the product's central claim with real measurements.

### H.4 Release checklist

Before the first public deploy:

- [ ] Gate 0 through Gate 7 all recorded as passed, with the artifact each produced
- [ ] `SEO.md §2` pre-launch indexing gate — all 8 blocking checks green
- [ ] `SEO.md §11` launch gate reviewed
- [ ] A-1 … A-11 executed and signed off by someone other than the implementer
- [ ] CI red-build proof: a deliberate 20 KB bloat fails the build
- [ ] CI red-build proof: a deliberately broken template fails the build
- [ ] The 15 open items in `SEO.md §15` triaged into ship-blocking or post-launch
- [ ] Open items O-1 … O-3 in §I resolved or explicitly deferred with an owner

---

## I. Open Items

Items this document cannot close on its own. Each names what would close it.

| ID | Item | Closes when |
|---|---|---|
| O-1 | Font byte budget split (§F.2) is unmeasured | Subsets are built at task 5.4 and the per-route sum is measured. If >40 KB, apply the stated resolution order or amend this document with sign-off. |
| O-2 | `DEVICES` fractions are single-channel observations | Gate 0 completes across ≥8 channels and `docs/verification/fcrop-survey.md` exists. Until then, treat every fraction in `spec.ts` as provisional. |
| O-3 | `REENCODE_BUDGET_BYTES` is one measurement (~134 KB at w1707) | Task 0.3 re-measures across several channels. The constant is documented as *typical*, never as a promise (`PLAN.md §12`). |
| O-4 | Canva capability claims remain unverified | Re-attempt at task 0.6; if still blocked, the UNVERIFIED marker stays in `PRD.md` and no Canva claim is made anywhere on the site. |
| O-5 | Whether ≥24 templates survive the cut bar | Stage 5 design review. If fewer survive, ship fewer and state the real count; do not pad. |
| O-6 | The 15 prioritised items in `SEO.md §15` | Triaged at the release checklist into ship-blocking or post-launch. |

---

## Summary

The build is one canvas model, three doors, ten routes, one island, eight library modules, and nine stages behind gates.

The two things that make it a product rather than another banner tool are both correctness claims, and both are only true if the constraints in §F.6 hold: the device previews are genuine cuts of the same rendered canvas rather than four separate renderings, and the re-encode simulation is labelled approximate rather than sold as a guarantee. Every other feature is table stakes that competitors already ship.

The riskiest dependency is Stage 0. If the `fcrop64` fractions turn out to be per-channel, the differentiator collapses and the direction decision returns to `PRD.md §5`. That is why Stage 0 is a stop gate and not a checklist item, and why no product code is written before it passes.

---

*End of IMPLEMENTATION.md*
