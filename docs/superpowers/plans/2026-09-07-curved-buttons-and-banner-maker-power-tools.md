# Curved Buttons & Banner Maker Power Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform all interactive buttons across YTBannerStudio.com into beautifully curved, tactile, high-craft elements, and equip the Banner Maker editor with 5 high-yield creator power configurations (Safe-Snap Engine, Contrast Guard & Scrim, 1-Click Vibe Harmonizer, Multi-Platform Social Bar, and Coordinated 800×800 Avatar Export) that cut banner creation time from hours to minutes.

**Architecture:** A dual-track enhancement: (1) Global design token and component refactor converting hard boxy buttons into pill-curved (`rounded-full`) and sculptured (`rounded-xl`/`rounded-2xl`) high-craft controls with micro-tactile feedback (`active:scale-[0.98]`); (2) Lean, client-side Canvas and Scene state extensions in `scene.ts`, `render.ts`, `badges.ts`, and `export.ts`, surfaced through intuitive 1-click controls in `MakeControls.astro` and `tool.ts`, while maintaining 0 KB JS on static routes and staying well under the 65 KB gzip island budget.

**Tech Stack:** Astro 5, Tailwind CSS v4, TypeScript, HTML5 2D Canvas API (sRGB, client-side zero-upload), Vitest.

**Spec:** [AGENTS.md](file:///Users/divyyadav/developer/Banner/AGENTS.md), [DESIGN.md](file:///Users/divyyadav/developer/Banner/DESIGN.md)

## Global Constraints

- **Client-Side Privacy**: Zero image bytes or user artwork may ever be transmitted to external servers. 100% in-browser processing via Canvas 2D.
- **Copy Honesty**: Strictly banned words (`lossless`, `never blurry`, `pixel perfect`, `no quality loss`, `guaranteed`).
- **10% Rare Accent Rule**: Primary accent `#2340B8` (or active theme red `#F62440`) reserved strictly for high-intent actions (<10% surface).
- **Bundle Budgets**: Static pages = 0 KB client JS. Tool island JS $\le 65\text{ KB}$ gzipped. Template payload $\le 35\text{ KB}$ gzipped.
- **Mobile Viewport Floor**: Flawless rendering down to 320px with zero horizontal scroll overflow.
- **TDD Workflow**: Every task includes failing automated unit/regression tests, implementation, passing verification, and clean commit.

---

### Task 1: Global Button Elegance & Curved Geometry Refactor (Header, Landing, Modals, CTAs, Guides)

**Files:**
- Create: `tests/curved-buttons.test.ts`
- Modify:
  - `src/components/Header.astro`
  - `src/components/LanguagePicker.astro`
  - `src/components/PalettePicker.astro`
  - `src/pages/index.astro`
  - `src/components/TemplatePickerModal.astro`
  - `src/pages/contact.astro`
  - `src/pages/404.astro`
  - `src/pages/guides/youtube-banner-size.astro`
  - `src/pages/guides/youtube-banner-safe-area.astro`
  - `src/pages/templates/[niche].astro`
  - `src/pages/[locale]/templates/[niche].astro`

**Interfaces:**
- Consumes: Tailwind v4 utility tokens (`rounded-full`, `rounded-xl`, `active:scale-[0.98]`, `transition-all`).
- Produces: Polished, curved, tactile UI buttons across every static page and navigation header.

- [ ] **Step 1: Write the failing test for global curved buttons**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement curved buttons refactor across all static components**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Tool Shell & Interactive Island Button Refactor (CropTabs, RepositionControls, ExportButton, CanvasStage)

**Files:**
- Create: `tests/tool-curved-buttons.test.ts`
- Modify:
  - `src/components/ExportButton.astro`
  - `src/components/CropTabs.astro`
  - `src/components/RepositionControls.astro`
  - `src/components/CanvasStage.astro`

**Interfaces:**
- Consumes: Tailwind v4 utility tokens (`rounded-full`, `rounded-xl`, `active:scale-[0.98]`).
- Produces: High-tactile curved buttons and segmented pill tabs for tool control surfaces.

- [ ] **Step 1: Write the failing test for tool curved buttons**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement curved styling in tool components**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Scene Data Model & Canvas Engine Extensions (Scrim, Aero Plate, Safe-Snap, Social Bar)

**Files:**
- Modify:
  - `src/lib/scene.ts`
  - `src/lib/render.ts`
  - `src/lib/badges.ts`
- Test:
  - `src/lib/scene.test.ts`
  - `src/lib/render.test.ts`
  - `src/lib/badges.test.ts`

**Interfaces:**
- Consumes: `CANVAS` specifications from `src/lib/spec.ts`.
- Produces:
  - `ScrimConfig` on `Scene.background`: `{ enabled: boolean; intensity: number; type?: 'radial' | 'vignette' }`.
  - `AeroPlateConfig` on `TextLayer`: `{ enabled: boolean; style?: 'dark-frosted' | 'light-frosted'; padding?: number }`.
  - Platform glyphs for `BadgeLayer` (`social-row`): `platforms: ('youtube' | 'x' | 'instagram' | 'tiktok' | 'twitch' | 'discord' | 'spotify')[]`.
  - Helper `fitTextToSafeArea(text: string, fontId: string, maxSafeWidth: number): number`.

- [ ] **Step 1: Write failing unit tests for Scrim, Aero Plate, and Social Bar rendering**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Scrim, Aero Plate, and Social Bar rendering**
- [ ] **Step 4: Run tests to verify they pass**
- [ ] **Step 5: Commit changes**

---

### Task 4: High-Yield Time-Saver Engine: Safe-Snap & Contrast Guard UI in MakeControls

**Files:**
- Modify:
  - `src/components/MakeControls.astro`
  - `src/islands/tool.ts`
- Create:
  - `tests/safe-snap-contrast-guard.test.ts`

**Interfaces:**
- Consumes: `renderScene`, `fitTextToSafeArea`, `Scene` state.
- Produces:
  - 1-Click Safe-Snap UI (`True Center`, `Split-Left`, `Split-Right`, `Stacked`) repositioning layers in 1 click.
  - Contrast Guard UI (Aero Plate toggle, Scrim intensity slider, Auto-Fit Text button).

- [ ] **Step 1: Write integration tests for Safe-Snap and Contrast Guard**
- [ ] **Step 2: Run test to verify it passes baseline**
- [ ] **Step 3: Implement Safe-Snap and Contrast Guard controls in MakeControls.astro & tool.ts**
- [ ] **Step 4: Verify integration with Astro check & Vitest**
- [ ] **Step 5: Commit changes**

---

### Task 5: 1-Click Aesthetic Theme Vibe Harmonizer & Auto-Fit Text Sizing

**Files:**
- Modify:
  - `src/lib/variations.ts`
  - `src/components/MakeControls.astro`
  - `src/islands/tool.ts`
- Test:
  - `src/lib/variations.test.ts`

**Interfaces:**
- Consumes: `Scene`, `SceneDesignSystem`.
- Produces: 6 curated Creator Vibes that instantly harmonize background, typography, badges, and accents across the banner canvas.

- [ ] **Step 1: Write unit tests for Creator Vibes harmonization**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Creator Vibes in variations.ts and wire to UI**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 6: Multi-Platform Social Handles Bar & Coordinated Avatar Export (800 × 800)

**Files:**
- Modify:
  - `src/lib/export.ts`
  - `src/components/ExportButton.astro`
  - `src/components/MakeControls.astro`
  - `src/islands/tool.ts`
- Test:
  - `src/lib/export.test.ts`

**Interfaces:**
- Consumes: `renderExport`, `Scene`, `ImageMap`.
- Produces:
  - `exportAvatar(scene: Scene, images: ImageMap): Promise<ExportResult>` (800 × 800 YouTube profile avatar).
  - Multi-platform social bar selector in `MakeControls.astro`.
  - Companion "Download Matching Avatar (800 × 800)" curved button in `ExportButton.astro`.

- [ ] **Step 1: Write unit tests for 800×800 Coordinated Avatar Export**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement exportAvatar and wire companion button and Social Bar**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 7: Full 5-Point Verification Suite, Visual Regression, & Budget Guard

**Files:**
- Audit: All repository components, pages, scripts, tests.

- [ ] **Step 1: Run unit and regression tests (`npm test`)**
- [ ] **Step 2: Run copy honesty invariant check (`node scripts/check-copy.mjs`)**
- [ ] **Step 3: Run Astro and TypeScript diagnostics (`npx astro check`)**
- [ ] **Step 4: Run production build verification (`npm run build`)**
- [ ] **Step 5: Run bundle performance budget guard (`node scripts/check-budgets.mjs`)**
- [ ] **Step 6: Mobile viewport audit (320px floor, zero horizontal scroll)**
- [ ] **Step 7: Final commit and git synchronization**
