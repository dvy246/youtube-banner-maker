import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATES } from '../data/templates';
import {
  templateToScene,
  getTemplate,
  listTemplates,
} from './template';
import {
  type TextLayer,
  serializeScene,
  deserializeScene,
} from './scene';
import { validateScene, estimateTextBounds } from './validate';
import { exportBanner } from './export';
import { CANVAS, SAFE, MAX_UPLOAD_BYTES } from './spec';
import { STATIC_PAGES_SEO } from './seo';

describe('Stage 6: Create Door Engine & Gate 6 Verification (/tools/youtube-banner-maker)', () => {
  const makerDistPath = path.resolve('dist/tools/youtube-banner-maker/index.html');

  describe('Gate 6.1: The 60-second test (Template -> Change Name -> Change Colour -> Export)', () => {
    it('executes the full creation workflow in a few programmatic steps', async () => {
      // 1. Pick a template from manifest
      const tmpl = getTemplate('gaming-retro');
      expect(tmpl).toBeDefined();
      if (!tmpl) return;

      // 2. Load into Scene
      const scene = templateToScene(tmpl);
      expect(scene.canvas.width).toBe(CANVAS.width);
      expect(scene.canvas.height).toBe(CANVAS.height);

      // Safe by construction: template has 0 errors initially
      const initialVerdicts = validateScene(scene);
      const initialErrors = initialVerdicts.filter((v) => v.severity === 'error');
      expect(initialErrors.length).toBe(0);

      // 3. Change channel name (title layer)
      const titleLayer = scene.layers.find(
        (l) => l.type === 'text' && l.id === 'title'
      ) as TextLayer;
      expect(titleLayer).toBeDefined();
      titleLayer.text = 'RETRO ARCADE';

      // 4. Change colour of title text
      titleLayer.color = '#38BDF8';

      // 5. Change background gradient colours
      if (scene.background.type === 'gradient') {
        scene.background.from = '#0B0F19';
        scene.background.to = '#1E293B';
      }

      // Re-validate after modifications: still safe inside mobile boundaries
      const modifiedVerdicts = validateScene(scene);
      const modifiedErrors = modifiedVerdicts.filter((v) => v.severity === 'error');
      expect(modifiedErrors.length).toBe(0);

      // 6. Export verified 2560x1440 banner
      const images = new Map();
      const exportResult = await exportBanner(scene, images);

      expect(exportResult).toBeDefined();
      expect(exportResult.width).toBe(CANVAS.width);
      expect(exportResult.height).toBe(CANVAS.height);
      expect(exportResult.blob).toBeInstanceOf(Blob);
      expect(exportResult.bytes).toBeLessThanOrEqual(MAX_UPLOAD_BYTES);
      expect(exportResult.filename).toMatch(/^youtube-banner-2560x1440\.(png|jpg|webp)$/);
    });
  });

  describe('Gate 6.2: Safe-area constraint (Impossible to drag constrained layer out without verdict)', () => {
    it('detects overflow and emits safe-overflow verdict with directional guidance', () => {
      const tmpl = getTemplate('tech-clean') || TEMPLATES[0];
      const scene = templateToScene(tmpl);
      const titleLayer = scene.layers.find(
        (l) => l.type === 'text' && l.id === 'title'
      ) as TextLayer;
      expect(titleLayer).toBeDefined();
      expect(titleLayer.safeAreaConstrained).toBe(true);

      // 1. Shift title far LEFT across safe rect
      titleLayer.position = { x: 0.05, y: 0.5 };
      let verdicts = validateScene(scene);
      let overflow = verdicts.find((v) => v.id === 'safe-overflow');
      expect(overflow).toBeDefined();
      expect(overflow?.severity).toBe('error');
      expect(overflow?.device).toBe('mobile');
      expect(overflow?.detail).toContain('Drag it right');

      // 2. Shift title far RIGHT across safe rect
      titleLayer.position = { x: 0.95, y: 0.5 };
      verdicts = validateScene(scene);
      overflow = verdicts.find((v) => v.id === 'safe-overflow');
      expect(overflow).toBeDefined();
      expect(overflow?.severity).toBe('error');
      expect(overflow?.detail).toContain('Drag it left');

      // 3. Shift title far UP across safe rect
      titleLayer.position = { x: 0.5, y: 0.08 };
      verdicts = validateScene(scene);
      overflow = verdicts.find((v) => v.id === 'safe-overflow');
      expect(overflow).toBeDefined();
      expect(overflow?.severity).toBe('error');
      expect(overflow?.detail).toContain('Drag it down');

      // 4. Shift title far DOWN across safe rect
      titleLayer.position = { x: 0.5, y: 0.92 };
      verdicts = validateScene(scene);
      overflow = verdicts.find((v) => v.id === 'safe-overflow');
      expect(overflow).toBeDefined();
      expect(overflow?.severity).toBe('error');
      expect(overflow?.detail).toContain('Drag it up');
    });

    it('confirms estimateTextBounds calculates accurate bounding box in frame fractions', () => {
      const textLayer: TextLayer = {
        id: 'title',
        type: 'text',
        text: 'HEADING',
        font: 'sora-700',
        size: 54,
        color: '#FFFFFF',
        align: 'center',
        position: { x: 0.5, y: 0.5 },
        safeAreaConstrained: true,
      };

      const bounds = estimateTextBounds(textLayer);
      expect(bounds.minX).toBeLessThan(0.5);
      expect(bounds.maxX).toBeGreaterThan(0.5);
      expect(bounds.minY).toBeLessThan(0.5);
      expect(bounds.maxY).toBeGreaterThan(0.5);

      // Inside safe rect centered
      expect(bounds.minX).toBeGreaterThan(SAFE.x);
      expect(bounds.maxX).toBeLessThan(SAFE.x + SAFE.w);
      expect(bounds.minY).toBeGreaterThan(SAFE.y);
      expect(bounds.maxY).toBeLessThan(SAFE.y + SAFE.h);
    });
  });

  describe('Gate 6.3: Protected composition elements immutability', () => {
    it('strictly isolates protected elements from editable layer keys across all templates', () => {
      for (const tmpl of TEMPLATES) {
        expect(tmpl.editable).toBeInstanceOf(Array);
        expect(tmpl.protected).toBeInstanceOf(Array);

        // Disjoint sets: no key exists in both editable and protected
        for (const editKey of tmpl.editable) {
          expect(
            tmpl.protected.includes(editKey),
            `Template ${tmpl.id} has overlapping key "${editKey}" in both editable and protected`
          ).toBe(false);
        }

        // Composition elements (shapes, bars, lines, dividers) must be protected
        const shapeLayers = tmpl.scene.layers.filter(
          (l) => l.type === 'shape' || l.role === 'shape'
        );
        for (const s of shapeLayers) {
          if (s.id) {
            expect(
              tmpl.protected.includes(s.id),
              `Template ${tmpl.id} shape "${s.id}" is not protected!`
            ).toBe(true);
            expect(
              tmpl.editable.includes(s.id),
              `Template ${tmpl.id} shape "${s.id}" must NOT be editable!`
            ).toBe(false);
          }
        }
      }
    });
  });

  describe('Gate 6.4: Template manifest loading and conversion', () => {
    it('converts every template to a valid, renderable Scene object with <= 8 layers', () => {
      const allTemplates = listTemplates();
      expect(allTemplates.length).toBeGreaterThanOrEqual(100);

      for (const tmpl of allTemplates) {
        const scene = templateToScene(tmpl);
        expect(scene.version).toBe(1);
        expect(scene.canvas.width).toBe(CANVAS.width);
        expect(scene.canvas.height).toBe(CANVAS.height);
        expect(scene.layers.length).toBeGreaterThan(0);
        expect(scene.layers.length).toBeLessThanOrEqual(8);

        // Initial validation has zero errors
        const verdicts = validateScene(scene);
        const errors = verdicts.filter((v) => v.severity === 'error');
        expect(
          errors.length,
          `Template ${tmpl.id} produced initial errors: ${JSON.stringify(errors)}`
        ).toBe(0);
      }
    });

    it('preserves cross-door scene state during serialization and deserialization', () => {
      const tmpl = getTemplate('music-lofi') || TEMPLATES[0];
      const scene = templateToScene(tmpl);
      const titleLayer = scene.layers.find((l) => l.id === 'title') as TextLayer;
      if (titleLayer) titleLayer.text = 'CHILL LOFI BEATS';

      const serialized = serializeScene(scene);
      const deserialized = deserializeScene(serialized);

      expect(deserialized).not.toBeNull();
      expect(deserialized?.canvas.width).toBe(CANVAS.width);
      expect(deserialized?.canvas.height).toBe(CANVAS.height);
      const restoredTitle = deserialized?.layers.find((l) => l.id === 'title') as TextLayer;
      expect(restoredTitle?.text).toBe('CHILL LOFI BEATS');
    });
  });

  describe('Gate 6.5: Built HTML verification (/tools/youtube-banner-maker)', () => {
    it('verifies built HTML structure, metadata, canonical, and schemas', () => {
      expect(fs.existsSync(makerDistPath), `Missing built file: ${makerDistPath}`).toBe(true);
      const html = fs.readFileSync(makerDistPath, 'utf-8');

      // 1. ToolShell data-mode is make
      expect(html).toContain('data-mode="make"');
      expect(html).toContain('Door: MAKE');

      // 2. SEO Metadata
      const expectedSeo = STATIC_PAGES_SEO['/tools/youtube-banner-maker'];
      expect(html).toContain(`<title>${expectedSeo.title}</title>`);
      expect(html).toContain(`<meta name="description" content="${expectedSeo.desc}">`);
      expect(html).toContain(
        '<link rel="canonical" href="https://youtubebannermaker.com/tools/youtube-banner-maker">'
      );

      // 3. JSON-LD Schemas
      expect(html).toContain('"@type":"SoftwareApplication"');
      expect(html).toContain('YouTube Banner Generator');
      expect(html).toContain('"@type":"BreadcrumbList"');

      // 4. Create Door Controls
      expect(html).toContain('id="change-template-btn"');
      expect(html).toContain('Browse Templates');
      expect(html).toContain('id="panel-text"');
      expect(html).toContain('id="text-layers-container"');
      expect(html).toContain('id="panel-background"');
      expect(html).toContain('id="bg-type-gradient"');
      expect(html).toContain('id="bg-type-solid"');
      expect(html).toContain('id="bg-type-photo"');
      expect(html).toContain('id="bg-photo-upload"');
      expect(html).toContain('id="handoff-check-btn"');
      expect(html).toContain('Verify in Safe Area Checker →');

      // 5. Template Picker Modal & Start Blank
      expect(html).toContain('id="template-picker-modal"');
      expect(html).toContain('id="start-blank-btn"');
      expect(html).toContain('Start Blank');
      expect(html).toContain('id="close-template-modal-btn"');

      // 6. REQ-021 Absence check: strictly NO <input type="search"> in built HTML
      expect(html).not.toMatch(/<input[^>]*type=["']search["']/i);
      expect(html).not.toMatch(/<input[^>]*placeholder=[^>]*search/i);
      expect(html).not.toMatch(/role=["']search["']/i);

      // 7. Protected layers absence check: accent-bar and shapes are NOT present as input fields
      expect(html).not.toContain('id="layer-text-accent-bar"');
      expect(html).not.toContain('id="layer-text-divider"');
      expect(html).not.toContain('id="layer-text-badge"');

      // 8. Rich below-the-fold content sections
      expect(html).toContain('Geometry-Safe Design vs Blank Canvas Fatigue');
      expect(html).toContain('Why Typography Must Sit Inside the Mobile Safe Area');
      expect(html).toContain('YouTube Per-Device Crop Boundaries');
      expect(html).toContain('YouTube Channel Art Specifications');
      expect(html).toContain('Browse Safe Templates by Channel Niche');
      expect(html).toContain('Frequently Asked Questions');

      // 9. Curated category link grid has all 8 niche pages linked
      const niches = ['gaming', 'tech', 'podcast', 'vlog', 'music', 'fitness', 'education', 'lifestyle'];
      for (const n of niches) {
        expect(html).toContain(`href="/templates/${n}"`);
      }
      expect(html).toContain('href="/templates"');

      // 10. Accessibility touch targets check
      expect(html).toContain('min-h-[44px]');
      expect(html).toContain('focus-visible:ring-2');
    });
  });
});
