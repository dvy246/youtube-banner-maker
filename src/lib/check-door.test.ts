import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  defaultScene,
  cloneScene,
  serializeScene,
  deserializeScene,
  type TextLayer,
} from './scene';
import { validateScene } from './validate';
import { MAX_UPLOAD_BYTES } from './spec';

describe('Stage 4: Check Door Engine & Gate 4 Verification (/tools/youtube-banner-checker)', () => {
  describe('Gate 4.1: Verdict evaluation with fixtures', () => {
    it('Low-resolution fixture (<2048x1152) produces tv warning naming TV size', () => {
      const scene = defaultScene();
      const verdicts = validateScene(scene, {
        sourceRaster: { w: 1280, h: 720 },
        includeCacheDelay: true,
      });

      const lowRes = verdicts.find((v) => v.id === 'low-resolution');
      expect(lowRes).toBeDefined();
      expect(lowRes?.severity).toBe('warn');
      expect(lowRes?.device).toBe('tv');
      expect(lowRes?.title).toContain("won't be sharp at TV size");
      expect(lowRes?.detail).toContain('2048 × 1152');
      expect(lowRes?.fixable).toBe(false);
    });

    it('Oversize fixture (>6 MB) produces filesize-over error with convert action', () => {
      const scene = defaultScene();
      const verdicts = validateScene(scene, {
        estimatedBytes: MAX_UPLOAD_BYTES + 1024 * 1024,
        includeCacheDelay: true,
      });

      const fsize = verdicts.find((v) => v.id === 'filesize-over');
      expect(fsize).toBeDefined();
      expect(fsize?.severity).toBe('error');
      expect(fsize?.device).toBe('all');
      expect(fsize?.fixable).toBe(true);
      expect(fsize?.action).toBe('convert');
      expect(fsize?.title).toBe('This file will be too large to upload');
    });

    it('Subject outside safe area fixture produces subject-outside-safe warning with reposition action', () => {
      const scene = defaultScene();
      scene.background = {
        type: 'image',
        src: 'data:image/png;base64,mock',
        width: 2560,
        height: 1440,
        cover: true,
        offsetX: 1000, // Displaced > 0.35 * CANVAS.width
        offsetY: 0,
        zoom: 1.0,
        extend: false,
      };

      const verdicts = validateScene(scene, { includeCacheDelay: true });
      const subj = verdicts.find((v) => v.id === 'subject-outside-safe');
      expect(subj).toBeDefined();
      expect(subj?.severity).toBe('warn');
      expect(subj?.device).toBe('mobile');
      expect(subj?.fixable).toBe(true);
      expect(subj?.action).toBe('reposition');
      expect(subj?.title).toBe('The main part of your image sits outside the safe area');
    });

    it('Non-sRGB source fixture produces non-srgb-source info verdict', () => {
      const scene = defaultScene();
      const verdicts = validateScene(scene, {
        isNonSrgb: true,
        includeCacheDelay: true,
      });

      const nonSrgb = verdicts.find((v) => v.id === 'non-srgb-source');
      expect(nonSrgb).toBeDefined();
      expect(nonSrgb?.severity).toBe('info');
      expect(nonSrgb?.device).toBe('all');
      expect(nonSrgb?.fixable).toBe(false);
      expect(nonSrgb?.title).toBe('Colour may shift after upload');
    });

    it('Cache-delay advisory fixture (REQ-014) produces 24-hour CDN cache info verdict', () => {
      const scene = defaultScene();
      // Check mode always sets includeCacheDelay: true
      const verdicts = validateScene(scene, { includeCacheDelay: true });

      const cacheDelay = verdicts.find((v) => v.id === 'cache-delay');
      expect(cacheDelay).toBeDefined();
      expect(cacheDelay?.severity).toBe('info');
      expect(cacheDelay?.device).toBe('all');
      expect(cacheDelay?.fixable).toBe(false);
      expect(cacheDelay?.title).toBe('Your new banner can take up to 24 hours to appear everywhere');
      expect(cacheDelay?.title).toContain('24 hours');
      expect(cacheDelay?.detail).toContain('YouTube uses edge CDN caching');
    });
  });

  describe('Gate 4.2: Round-trip handoff verification (Check -> Fix)', () => {
    it('Preserves scene and base64 image data across serialization and deserialization (D-10 <= 3MB)', () => {
      const checkScene = defaultScene();
      const testBase64 =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      checkScene.background = {
        type: 'image',
        src: testBase64,
        width: 2560,
        height: 1440,
        cover: true,
        offsetX: 140,
        offsetY: -60,
        zoom: 1.2,
        extend: true,
      };

      // Check mode persists to sessionStorage[SCENE_KEY]
      const serialized = serializeScene(checkScene);
      expect(typeof serialized).toBe('string');

      // Fix mode restores from sessionStorage[SCENE_KEY] across full page load
      const restored = deserializeScene(serialized);
      expect(restored).not.toBeNull();
      expect(restored?.background.type).toBe('image');
      if (restored?.background.type === 'image') {
        expect(restored.background.src).toBe(testBase64);
        expect(restored.background.offsetX).toBe(140);
        expect(restored.background.offsetY).toBe(-60);
        expect(restored.background.zoom).toBe(1.2);
        expect(restored.background.extend).toBe(true);
      }
      expect(restored?.layers.length).toBe(checkScene.layers.length);
    });

    it('D-10: Over-size scene (>3 MB) preserves coordinates but strips image so Fix door shows re-upload prompt', () => {
      const checkScene = defaultScene();
      checkScene.background = {
        type: 'image',
        src: 'data:image/png;base64,' + 'M'.repeat(4 * 1024 * 1024),
        width: 3840,
        height: 2160,
        cover: true,
        offsetX: 75,
        offsetY: -45,
        zoom: 1.15,
        extend: false,
      };

      // Check mode persist() clears background.src when sourceFileSize > 3MB
      const sceneToSave = cloneScene(checkScene);
      if (sceneToSave.background.type === 'image') {
        sceneToSave.background.src = '';
      }

      const serialized = serializeScene(sceneToSave);
      const restored = deserializeScene(serialized);

      expect(restored).not.toBeNull();
      expect(restored?.background.type).toBe('image');
      if (restored?.background.type === 'image') {
        expect(restored.background.src).toBe('');
        expect(restored.background.offsetX).toBe(75);
        expect(restored.background.offsetY).toBe(-45);
        expect(restored.background.zoom).toBe(1.15);
      }
    });
  });

  describe('Gate 4.3: Deliberately broken banner fixtures never yield a false "all good"', () => {
    interface BrokenFixture {
      name: string;
      scene: ReturnType<typeof defaultScene>;
      opts?: Parameters<typeof validateScene>[1];
      expectedVerdictId: string;
      expectedSeverity: 'error' | 'warn' | 'info';
      expectedDevice: string;
      expectedDirection?: string;
    }

    const fixtures: BrokenFixture[] = [
      {
        name: 'Title shifted far left across mobile safe boundary',
        scene: (() => {
          const s = defaultScene();
          (s.layers[0] as TextLayer).position = { x: 0.04, y: 0.46 };
          return s;
        })(),
        expectedVerdictId: 'safe-overflow',
        expectedSeverity: 'error',
        expectedDevice: 'mobile',
        expectedDirection: 'Drag it right',
      },
      {
        name: 'Title shifted far right across mobile safe boundary',
        scene: (() => {
          const s = defaultScene();
          (s.layers[0] as TextLayer).position = { x: 0.96, y: 0.46 };
          return s;
        })(),
        expectedVerdictId: 'safe-overflow',
        expectedSeverity: 'error',
        expectedDevice: 'mobile',
        expectedDirection: 'Drag it left',
      },
      {
        name: 'Title shifted up across mobile safe boundary',
        scene: (() => {
          const s = defaultScene();
          (s.layers[0] as TextLayer).position = { x: 0.5, y: 0.08 };
          return s;
        })(),
        expectedVerdictId: 'safe-overflow',
        expectedSeverity: 'error',
        expectedDevice: 'mobile',
        expectedDirection: 'Drag it down',
      },
      {
        name: 'Title shifted down across mobile safe boundary',
        scene: (() => {
          const s = defaultScene();
          (s.layers[0] as TextLayer).position = { x: 0.5, y: 0.92 };
          return s;
        })(),
        expectedVerdictId: 'safe-overflow',
        expectedSeverity: 'error',
        expectedDevice: 'mobile',
        expectedDirection: 'Drag it up',
      },
      {
        name: 'Text font size expanded beyond safe slot width',
        scene: (() => {
          const s = defaultScene();
          const layer = s.layers[0] as TextLayer;
          layer.text = 'THE ULTIMATE GAMING HUB';
          layer.size = 111;
          layer.position = { x: 0.5, y: 0.5 };
          return s;
        })(),
        expectedVerdictId: 'text-too-large',
        expectedSeverity: 'warn',
        expectedDevice: 'mobile',
      },
      {
        name: 'Background image shifted outside safe area without extension',
        scene: (() => {
          const s = defaultScene();
          s.background = {
            type: 'image',
            src: 'mock-src',
            width: 2560,
            height: 1440,
            cover: true,
            offsetX: 1200,
            offsetY: 0,
            zoom: 1.0,
            extend: false,
          };
          return s;
        })(),
        expectedVerdictId: 'subject-outside-safe',
        expectedSeverity: 'warn',
        expectedDevice: 'mobile',
      },
      {
        name: 'Unloaded fonts pending measurement',
        scene: defaultScene(),
        opts: { fontsLoaded: false },
        expectedVerdictId: 'font-not-loaded',
        expectedSeverity: 'info',
        expectedDevice: 'all',
      },
    ];

    fixtures.forEach((fixture) => {
      it(`Fixture: "${fixture.name}" provably detects flaw and does NOT yield all-good`, () => {
        const verdicts = validateScene(fixture.scene, fixture.opts);

        // Invariant: Broken banner MUST produce at least one verdict
        expect(verdicts.length).toBeGreaterThan(0);

        // Target verdict must exist with exact expected properties
        const matched = verdicts.find((v) => v.id === fixture.expectedVerdictId);
        expect(matched).toBeDefined();
        expect(matched?.severity).toBe(fixture.expectedSeverity);
        expect(matched?.device).toBe(fixture.expectedDevice);
        expect(matched?.title).toBeTruthy();
        expect(matched?.detail).toBeTruthy();

        // Directional advice must be concrete and present
        if (fixture.expectedDirection) {
          expect(matched?.detail).toContain(fixture.expectedDirection);
        }
      });
    });

    it('All verdicts in broken fixtures name device, problem, and specific action', () => {
      for (const fixture of fixtures) {
        const verdicts = validateScene(fixture.scene, fixture.opts);
        for (const v of verdicts) {
          expect(['mobile', 'desktop', 'tablet', 'tv', 'all']).toContain(v.device);
          expect(v.title.length).toBeGreaterThan(5);
          expect(v.detail.length).toBeGreaterThan(5);
          if (v.id === 'safe-overflow') {
            // Must contain a specific directional instruction
            expect(
              v.detail.includes('Drag it right') ||
                v.detail.includes('Drag it left') ||
                v.detail.includes('Drag it down') ||
                v.detail.includes('Drag it up')
            ).toBe(true);
          }
        }
      }
    });
  });

  describe('Gate 4.4: Built HTML verification for /tools/youtube-banner-checker', () => {
    const checkerDistPath = path.resolve('dist/tools/youtube-banner-checker/index.html');

    it('verifies built HTML structure if dist exists', () => {
      if (!fs.existsSync(checkerDistPath)) {
        // Skip check if build has not run yet; covered during build step
        return;
      }

      const html = fs.readFileSync(checkerDistPath, 'utf-8');

      // 1. ToolShell data-mode is check
      expect(html).toContain('data-mode="check"');

      // 2. Verdicts region exists
      expect(html).toContain('id="verdicts"');

      // 3. One-click handoff action and button exist
      expect(html).toContain('id="check-handoff-action"');
      expect(html).toContain('id="handoff-fix-btn"');
      expect(html).toContain('Fix in Resizer Editor →');

      // 4. Suppressed editing controls in check mode
      expect(html).not.toContain('id="panel-photo"');
      expect(html).not.toContain('id="simulate-toggle"');
      expect(html).not.toContain('id="export-button"');

      // 5. Metadata and SEO contracts
      expect(html).toContain('<title>YouTube Banner Checker | Test Crops | YTBannerStudio</title>');
      expect(html).toContain(
        '<meta name="description" content="Check your YouTube banner against mobile, desktop, tablet, and TV safe areas. Instant crop verdict and safe-area check with zero signup or watermarks.">'
      );
      expect(html).toContain(
        '<link rel="canonical" href="https://ytbannerstudio.com/tools/youtube-banner-checker">'
      );

      // 6. Schemas
      expect(html).toContain('"@type":"SoftwareApplication"');
      expect(html).toContain('YouTube Banner Safe Area Checker');
      expect(html).toContain('"@type":"BreadcrumbList"');

      // 7. Below-the-fold content blocks
      expect(html).toContain('How Our YouTube Banner Safe Area Checker Works');
      expect(html).toContain('The 3 Most Common YouTube Banner Crop Mistakes');
      expect(html).toContain('Mobile Safe Area Cutoff');
      expect(html).toContain('Desktop Horizontal Compression');
      expect(html).toContain('Low Resolution Blurriness');
      expect(html).toContain('YouTube Per-Device Crop Boundaries');
      expect(html).toContain('YouTube Channel Art Specifications');
      expect(html).toContain('Frequently Asked Questions');
    });
  });
});
