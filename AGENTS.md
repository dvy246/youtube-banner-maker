# AGENTS.md — Agent Operating System & Behavioral Contract

> **Scope**: This document establishes the non-negotiable operational principles, behavioral guardrails, quality standards, and verification protocols for any AI agent contributing to the **YouTubeBannerMaker.com** project.
>
> **Notice**: This document governs **HOW** work must be performed, verified, and audited. It deliberately excludes internal codebase file hierarchies and folder structures. Agents must discover relevant modules dynamically through search tools and follow the contracts detailed below.

---

## 1. Project Ethos & Prime Directive

YouTubeBannerMaker.com is a free, privacy-first, professional-grade micro-SaaS utility engineered for YouTube channel art. Its purpose is to deliver an experience so smooth, instant, honest, and high-craft that creators feel it is *"too good / illegal to be free."*

### Non-Negotiable Core Tenets

1. **100% Client-Side Privacy**: Zero image bytes or user artwork may ever be transmitted to external servers, APIs, or cloud endpoints. All image processing (decoding, resizing, rendering, filtering, and export) must execute strictly in the user's browser via client-side Web APIs.
2. **Copy Honesty**: No deceptive claims, marketing hype, or false promises. Always distinguish physical hardware limitations from mathematical rasterization realities.
3. **No Slop / No Artificial Dark Patterns**: Zero watermarks, zero compulsory sign-ups, zero forced newsletter gates, zero fake timers, and zero interstitial hurdles.
4. **Instant Utility**: Users must be able to drop an image or choose a template and download an export in under 10 seconds.

---

## 2. Core Behavioral Engineering Principles

All agent actions must adhere to the four pillars of the `principles` standard:

### Pillar 1: Think Before Coding
- **Surface Tradeoffs**: State all assumptions explicitly before implementing. If requirements are ambiguous or contradictory, stop and clarify—never silently choose an arbitrary implementation.
- **Simplest Solution**: Always prefer the most direct, maintainable solution over speculative complexity.
- **Fail Closed**: In security, privacy, or policy checks, treat missing data as an immediate blocker rather than assuming compliance.

### Pillar 2: Simplicity First
- **Zero Speculative Features**: Do not add abstractions, configuration hooks, or features that were not explicitly requested.
- **No Over-Engineering**: Avoid single-use helper libraries or nested wrappers. If a solution can be implemented reliably in 30 lines, do not write 150 lines.
- **Lean Runtime**: Keep static pages free of client runtime bloat.

### Pillar 3: Surgical Changes
- **Minimal Blast Radius**: Touch only the exact lines necessary to satisfy the prompt or resolve the bug.
- **Preserve Unrelated Work**: Never reformat adjacent code, modify unrelated comments, or perform unsolicited "drive-by" refactors.
- **Clean Up Own Residue**: Remove any imports, variables, or functions that your changes made redundant. Do not touch pre-existing dead code unless explicitly tasked.

### Pillar 4: Goal-Driven Execution
- **Verifiable Success Criteria**: Convert every objective into an empirical test (e.g., *"Write a failing unit test, implement the fix, confirm the test passes"*).
- **Loop Until Verified**: Run tests and type-checks after every modification. Do not claim success until verification commands output zero errors.

---

## 3. Copy Honesty & Truthfulness Invariants

The project enforces automated copy honesty checks (`scripts/check-copy.mjs`). Any pull request or commit that violates these invariants will fail CI immediately.

### Strictly Prohibited Phrases

Agents must **never** use the following terms or phrases in UI copy, documentation, meta tags, or toast messages:

| Banned Term | Rationale | Approved Alternative |
|---|---|---|
| `lossless` | Raster scaling and canvas compression involve pixel interpolation. | *"Aspect-preserving"*, *"unwarped"*, *"sharp"* |
| `never blurry` | Low-resolution input images cannot magically gain pixel density. | *"Upscaling restricted to 1:1 original pixel density"* |
| `pixel perfect` | Multi-screen responsive crops vary dynamically across displays. | *"Mathematically centered"*, *"safe-area compliant"* |
| `no quality loss` | Downsampling or canvas redraw modifies source pixel arrays. | *"Full fidelity PNG export"*, *"sRGB preserved"* |
| `guaranteed` | YouTube's ingestion pipeline and algorithms are third-party controlled. | *"Verified against official YouTube Studio specifications"* |

### Dynamic Math Invariant
- **No Hardcoded Crop Dimensions in Copy**: When displaying crop dimensions or explaining safe-area math in copy, always derive or reference values through central specification constants rather than scattering raw magic numbers.
- **Device Specifications**:
  - Full Canvas: `2560 × 1440 px` (16:9 aspect ratio)
  - Mobile Safe Area: `1546 × 423 px` (centered horizontally and vertically)
  - Desktop Viewport Crop: `2560 × 423 px`
  - Tablet Viewport Crop: `1855 × 423 px`
  - Maximum File Size: `6 MB` (enforced by YouTube Studio)

---

## 4. Visual Design & Design System Guardrails

The project adheres to the design specifications defined in `DESIGN.md`:

### The 10% Rare Accent Rule
- **Accent Color (`#2340B8`)**: Reserved exclusively for primary high-intent actions (e.g., the primary Export / Download button) and active keyboard focus outlines (`focus-visible:outline-accent-600`).
- **Surface Coverage**: Under no circumstances may the accent color cover more than **10%** of any viewport. Never use accent backgrounds on cards, navigation banners, hero sections, or sidebars.

### Color Palette Constraints
- **Surfaces**: Primary canvas `Surface-0` (`#FFFFFF`), secondary panel `Surface-50` (`#F9FAFB`), subtle elevation `Surface-100` (`#F3F4F6`).
- **Dividers & Lines**: Clean, hairline borders `Line-200` (`#E5E7EB`).
- **Ink & Typography**: Primary body/headings `Ink-950` (`#0B0F19`), secondary body `Ink-600` (`#4B5563`), muted labels `Ink-400` (`#9CA3AF`).
- **Contrast Ratios**: All text elements must achieve a minimum WCAG 2.1 AA contrast ratio of 4.5:1 against their immediate background (7:1 preferred for small text).

### Typography Scale
- Primary Font: Inter Variable (with robust system sans-serif fallback).
- Numeric / Dimensional Readouts: Always render coordinate readouts, crop numbers, zoom levels, and aspect ratios using monospace tabular numbers (`tabular-nums` / JetBrains Mono) to prevent jitter during interaction.

### Light & Dark Theme Coexistence Invariant
- **No Unconditional Light Overrides**: Custom light-mode surface and palette tokens (such as Warm Pearl `#FFFAF3` or Sand `#FAF8F5`) must **never** be applied unconditionally with `!important` across all states. They must be strictly scoped to light mode (`:not(.dark):not([data-theme="dark"]):not(:has(#theme-toggle:checked))`) so dark mode surfaces (`#0B0D10` canvas, dark cards, `#F8FAFC` typography) remain crisp and fully legible.
- **Tailwind v4 Dark Mode Custom Variant**: The `@custom-variant dark` directive must be configured in `global.css` to support class-based (`.dark`), attribute-based (`[data-theme="dark"]`), and pure-CSS checkbox (`body:has(#theme-toggle:checked)`) activations simultaneously.
- **Palette Glow Subtlety**: In dark mode, ambient background glow tokens (`--palette-glow-*`) must remain very soft and ethereal (whisper opacity $\le 8\%$) to prevent eye strain and preserve WCAG AAA text contrast.

### Mobile Responsiveness & Zero Horizontal Overflow Guarantee
- **320px Viewport Floor**: All pages and interactive tools must render cleanly on screens as narrow as `320px` without clipped controls or broken layouts.
- **Zero Document Scroll Invariant**: Under no circumstances may any component cause horizontal document scroll (`scrollWidth > innerWidth`).
- **Arch & Fan Showcase Scaling**: Multi-card fan showcases (`ArchGallery`) must dynamically scale card dimensions, overlaps, and rotation angles across breakpoints (`1024px`, `768px`, `520px`, `400px`) and enforce strict `overflow-hidden` stage containment.
- **Console Container Queries**: Interactive preview consoles (`HeroCropSimulator`) must utilize container queries (`@container (max-width: 480px)`) to scale typography, conceal non-critical telemetry badges, and preserve $\ge 44 \times 44\text{ px}$ touch targets on all interactive selectors.
- **Data Table Containment**: All wide data tables and coordinate grids must be housed within responsive `overflow-x: auto` wrappers with soft rounded borders.

### Global Curved Button Geometry & Tactile Physics Standard
- **Curved Border Radii**:
  - Standalone action buttons, navigation CTAs (`#nav-cta-desktop`, `#nav-cta-mobile`), hero CTAs, template category chips, and filter buttons must strictly use pill geometry (`rounded-full`).
  - Segmented control groups, device crop selectors, and modal action groups must use `rounded-full` or smooth outer pill housings.
  - Form input controls, coordinate resets, zoom steps, and card-level interactive doors must use `rounded-xl` or `rounded-2xl`.
- **Tactile Micro-Physics**:
  - Every interactive button, pill chip, and tool trigger must incorporate the tactile physical micro-press state `active:scale-[0.98]` with standard transition timing (`transition-all duration-150 ease-out`) to provide instant, responsive mechanical feedback.

---

## 5. Performance Budgets & Architecture Boundaries

### Static vs. Interactive Separation
- **Static Content Pages**: Guides, templates catalog, about, terms, privacy, and contact pages must ship **zero client-side JavaScript**. All layout, styling, and structured data must be generated purely at build time.
- **Interactive Tool Routes**: Only designated tool routes (`/tools/youtube-banner-resizer`, `/tools/youtube-banner-checker`, `/tools/youtube-banner-maker`) may mount client islands.

### Strict Bundle Size Budgets
- **Template Payload**: Total serialized template data must remain **under 15 KB gzipped** (currently ~3.9 KB).
- **Tool Island JS**: The interactive tool bundle must remain **under 30 KB gzipped** (currently ~20.5 KB).
- Automated budget checks (`node scripts/check-budgets.mjs`) must pass before merging.

### High-Yield Studio Configurations & Safe-Snap Architecture
To save creators hours of repetitive adjustments and guarantee certified YouTube Studio-compliant channel assets, the interactive studio incorporates five high-yield workflow automations:
1. **Smart Safe-Snap Engine**: Certified 1-click safe layout alignment presets (`🎯 True Center`, `👤 Split-Left`, `Split-Right 👤`, `Stacked`) mathematically constrained within the centered 1546 × 423 px safe boundary.
2. **Contrast Guard & Studio Scrim**: Real-time non-destructive radial ambient shadow slider (0%–100%) spotlighting the mobile safe area against busy backgrounds, 1-click Frosted Glass "Aero Plate" backplate toggle, and 1-click Auto-Fit Safe Width font recalculation.
3. **1-Click Aesthetic Theme Vibe Harmonizer**: 6 curated aesthetic palettes (`Original Preset`, `Dark Noir`, `Editorial Warm Pearl`, `Cyberpunk Neon`, `Stealth Minimalist`, `Sunset Luxe`) that cascade atomically across typography, text color, backplates, accent borders, and background gradients.
4. **Multi-Platform Vector Social Badges**: Embedded crisp SVG brand marks for YouTube, X, Instagram, TikTok, Twitch, Discord, and Spotify selectable via 1-click chips.
5. **1-Click Coordinated 800 × 800 Profile Avatar Export**: Automatically extracts theme palette, studio scrim, and photo/monogram into a matching 800 × 800 sRGB avatar file ready for immediate YouTube Studio upload.

---

## 6. SEO, AEO & GEO Mastery

YouTubeBannerMaker.com is engineered for top-tier organic discovery across traditional search engines (Google, Bing) and AI answer engines (Perplexity, ChatGPT Search, Gemini, Claude).

### Meta & Structured Data Rules
1. **Title & Description Lengths**: Meta titles must strictly stay $\le 60$ characters. Meta descriptions must stay $\le 155$ characters.
2. **Canonical Consistency**: Every page must output a fully qualified canonical URL matching the production domain (`https://youtubebannermaker.com/...`).
3. **Structured Data (JSON-LD)**:
   - Tool pages must supply `WebApplication` or `SoftwareApplication` schemas.
   - Informational guides must supply valid `FAQPage` and `HowTo` schemas.
   - Global pages must link `Organization` and `BreadcrumbList`.
4. **Answer Engine Optimization (AEO/GEO)**:
   - Provide direct, concise answers in the first 60 words of each major content section.
   - Maintain `public/llms.txt` with up-to-date specification definitions, safe-area bounds, and tool descriptions.
   - Ensure `robots.txt` explicitly allows AI crawlers (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`).
5. **Brand Asset & Open Graph Invariants**:
   - **Multi-Device Favicon & Web Manifest Suite**: Every page layout must inject standard `<link>` elements for `favicon-96x96.png`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, and `site.webmanifest` in the document `<head>`.
   - **Studio Red & Beige Open Graph Asset**: `public/og-image.png` must strictly maintain the studio-grade red and beige aesthetic (`#FAF7F2` linen background, `#FF0033` / `#CC002B` crimson accents, 3D double-bezel safe-area frame) at exact standard dimensions `1200 × 630 px`.

---

## 7. Google AdSense & Publisher Policy Gate

Prior to release, the site must pass the `adsense-final-gate-auditor` standards:

1. **Mandatory Trust Pages**:
   - `/about`: Discloses editorial identity, engineering purpose, and creator background.
   - `/contact`: Direct communication channel with response expectations.
   - `/privacy`: Comprehensive GDPR/CCPA disclosures explicitly affirming 100% client-side zero-upload processing.
   - `/terms`: Clear terms of service, IP disclaimers, and explicit YouTube trademark disclaimers (not affiliated with Google/YouTube).
2. **Ad Placement Safety**:
   - Ads must never overlap, mimic, or sit directly adjacent to primary functional controls (e.g., canvas area, zoom sliders, download buttons).
   - Ads must never cause layout shifts (CLS < 0.1).
3. **No Thin Content**:
   - Every guide and template hub page must offer genuine informational gain, clear visual diagrams, and mathematically accurate explanations.

---

## 8. Mandatory 5-Point Verification Sequence

Before declaring any task complete, committing code, or deploying, agents **must** execute and pass the complete 5-point verification suite:

```bash
# 1. Unit & Regression Tests (all test suites must pass 100% green)
npm test

# 2. Copy Honesty & Specification Invariant Guard
node scripts/check-copy.mjs

# 3. Astro & TypeScript Diagnostics (0 errors, 0 warnings, 0 hints)
npx astro check

# 4. Production Build Verification (all static pages generated without warnings)
npm run build

# 5. Performance Budget Guard (bundles must stay strictly within gzipped thresholds)
node scripts/check-budgets.mjs
```

> [!CAUTION]
> **Evidence Before Assertions**: Never claim code is working or verified without executing these commands and inspecting their terminal exit codes.

---

## 9. Deployment Protocol

1. **Git Synchronization**:
   - Work on clean commits with descriptive semantic commit messages (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
   - Push to repository `dvy246/youtube-banner-maker` on branch `main`.
2. **One-Command Cloudflare Pages Production Deployment**:
   - Build output resides in `dist/`.
   - Run the unified deployment pipeline in `package.json`:
     ```bash
     npm run deploy
     ```
     *(This automatically executes `npm run build` including sitemap generation, diagnostics, asset bundling, and then deploys via `npx wrangler pages deploy dist --project-name=youtube-banner-maker --branch=main`)*.
3. **Live Verification & Header Audits**:
   - Verify live HTTP status code `200` on production endpoints:
     - Primary Domain / Alias: `https://youtube-banner-maker.pages.dev/`
     - Live Deployment Domain: `https://youtube-banner-maker-dd5.pages.dev/`
   - Verify critical response security headers:
     - `strict-transport-security: max-age=31536000; includeSubDomains; preload`
     - `x-content-type-options: nosniff`
     - `x-frame-options: DENY`
     - `referrer-policy: strict-origin-when-cross-origin`
     - `content-security-policy`
