import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATES } from '../data/templates';
import {
  listTemplates,
  getTemplate,
  getDistinctTemplates,
  getQualifyingNiches,
  getNicheStaticPaths,
} from './template';
import type { TemplateManifest } from './template';
import { validateSingleTemplate } from '../../scripts/validate-templates.mjs';
import { NICHE_TITLES, STATIC_PAGES_SEO } from './seo';

describe('Stage 5: Template System & Gallery Hub Verification', () => {
  const distTemplatesDir = path.resolve('dist/templates');
  const indexHtmlPath = path.join(distTemplatesDir, 'index.html');

  describe('1. Template Manifests & Validation (M-13, M-14)', () => {
    it('loads 100+ templates across 10 distinct niches', () => {
      expect(TEMPLATES.length).toBeGreaterThanOrEqual(100);
      const templates = listTemplates();
      expect(templates.length).toBeGreaterThanOrEqual(100);

      const niches = new Set(templates.map((t) => t.niche.toLowerCase()));
      expect(niches.size).toBe(10);
      expect(niches).toContain('gaming');
      expect(niches).toContain('tech');
      expect(niches).toContain('podcast');
      expect(niches).toContain('vlog');
      expect(niches).toContain('music');
      expect(niches).toContain('fitness');
      expect(niches).toContain('education');
      expect(niches).toContain('lifestyle');
      expect(niches).toContain('food');
      expect(niches).toContain('business');
    });

    it('validates each template against strict schema and safe-area rules', () => {
      for (const tmpl of TEMPLATES) {
        const errors = validateSingleTemplate(tmpl);
        expect(errors, `Template ${tmpl.id} failed validation`).toEqual([]);

        expect(tmpl.id).toBeTruthy();
        expect(tmpl.name).toBeTruthy();
        expect(tmpl.description).toBeTruthy();
        expect(tmpl.preview).toMatch(/^\/previews\/[a-z0-9-]+\.svg$/);
        expect(tmpl.safeAreaValidated).toBe(true);
        expect(tmpl.scene.layers.length).toBeLessThanOrEqual(8);

        // Check preview file actually exists in public/
        const previewFile = path.resolve('public' + tmpl.preview);
        expect(fs.existsSync(previewFile), `Preview file missing: ${previewFile}`).toBe(true);

        // Check editable and protected are disjoint
        for (const editKey of tmpl.editable) {
          expect(tmpl.protected.includes(editKey)).toBe(false);
        }
      }
    });

    it('fetches templates by id correctly', () => {
      const tmpl = getTemplate('gaming-neon');
      expect(tmpl).toBeDefined();
      expect(tmpl?.name).toBe('Neon Cyber');
      expect(tmpl?.niche).toBe('gaming');
    });
  });

  describe('2. Hard Build Gate & Structural Uniqueness (REQ-017)', () => {
    it('identifies all 10 niches as qualifying with >= 3 distinct templates', () => {
      const qualifying = getQualifyingNiches(TEMPLATES, 3);
      expect(qualifying.length).toBe(10);

      const paths = getNicheStaticPaths(TEMPLATES, 3);
      expect(paths.length).toBe(10);
      const paramsNiches = paths.map((p) => p.params.niche);
      expect(paramsNiches).toContain('gaming');
      expect(paramsNiches).toContain('tech');
      expect(paramsNiches).toContain('podcast');
      expect(paramsNiches).toContain('vlog');
      expect(paramsNiches).toContain('music');
      expect(paramsNiches).toContain('fitness');
      expect(paramsNiches).toContain('education');
      expect(paramsNiches).toContain('lifestyle');
      expect(paramsNiches).toContain('food');
      expect(paramsNiches).toContain('business');
    });

    it('filters out any hypothetical niche with fewer than 3 templates (REQ-017)', () => {
      // Create a test catalog with a thin niche having only 2 templates
      const baseGaming = TEMPLATES.filter((t) => t.niche === 'gaming');
      const thinNicheTemplates: TemplateManifest[] = [
        { ...baseGaming[0], id: 'thin-1', niche: 'thin-niche' },
        { ...baseGaming[1], id: 'thin-2', niche: 'thin-niche' },
      ];

      const testCatalog = [...TEMPLATES, ...thinNicheTemplates];
      const qualifying = getQualifyingNiches(testCatalog, 3);

      const qualifyingNicheNames = qualifying.map((q) => q.niche);
      expect(qualifyingNicheNames).not.toContain('thin-niche');

      const staticPaths = getNicheStaticPaths(testCatalog, 3);
      expect(staticPaths.some((p) => p.params.niche === 'thin-niche')).toBe(false);
    });

    it('filters out a niche if templates are structural clones differing only by color (M-14 / REQ-017)', () => {
      const base = TEMPLATES.find((t) => t.id === 'tech-terminal')!;

      // Clone with different colors and text but identical layout
      const clone1: TemplateManifest = {
        ...base,
        id: 'clone-niche-1',
        niche: 'clone-niche',
        name: 'Terminal Green',
        scene: {
          background: { type: 'solid', color: '#003300' },
          layers: base.scene.layers.map((l) => ({ ...l, color: '#00FF00' })),
        },
      };

      const clone2: TemplateManifest = {
        ...base,
        id: 'clone-niche-2',
        niche: 'clone-niche',
        name: 'Terminal Amber',
        scene: {
          background: { type: 'solid', color: '#332200' },
          layers: base.scene.layers.map((l) => ({ ...l, color: '#FFAA00' })),
        },
      };

      const distinct = getDistinctTemplates([clone1, clone2]);
      // Should detect that clone2 is a structural duplicate of clone1
      expect(distinct.length).toBe(1);

      // Now create a 3-template niche where 2 are clones (only 2 distinct layouts)
      const distinctThird = TEMPLATES.find((t) => t.id === 'tech-hardware')!;
      const clone3: TemplateManifest = {
        ...distinctThird,
        id: 'clone-niche-3',
        niche: 'clone-niche',
      };

      const threeTemplatesWithClone = [clone1, clone2, clone3];
      const distinctCount = getDistinctTemplates(threeTemplatesWithClone).length;
      expect(distinctCount).toBe(2); // Only 2 distinct, not 3

      // Build gate must reject this niche because distinct count < 3
      const qualifying = getQualifyingNiches(threeTemplatesWithClone, 3);
      expect(qualifying.some((q) => q.niche === 'clone-niche')).toBe(false);
    });
  });

  describe('3. Absence Checks & Zero Client JS (REQ-021, M-15)', () => {
    it('verifies dist/templates/index.html exists', () => {
      expect(fs.existsSync(indexHtmlPath)).toBe(true);
    });

    it('REQ-021 absence check: strictly NO <input type="search"> or any search input in built HTML', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf-8');
      expect(html).not.toMatch(/<input[^>]*type=["']search["']/i);
      expect(html).not.toMatch(/<input[^>]*type=["']text["']/i);
      expect(html).not.toMatch(/<input[^>]*placeholder=[^>]*search/i);
      expect(html).not.toMatch(/role=["']search["']/i);
    });

    it('M-15: verifies dist/templates/index.html has zero client JS scripts', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf-8');
      const clientScripts = (html.match(/<script(?![^>]*type=["']application\/ld\+json["'])(?![^>]*id=["']theme-boot["'])[^>]*>[\s\S]*?<\/script>/gi) || [])
        .filter((s) => !s.includes('googletagmanager') && !s.includes('gtag'));
      expect(clientScripts).toHaveLength(0);
    });

    it('verifies /templates index metadata, canonical, breadcrumbs, and card count', () => {
      const html = fs.readFileSync(indexHtmlPath, 'utf-8');
      const expectedSeo = STATIC_PAGES_SEO['/templates'];

      expect(html).toContain(`<title>${expectedSeo.title}</title>`);
      expect(html).toContain(`<meta name="description" content="${expectedSeo.desc}">`);
      expect(html).toContain('<link rel="canonical" href="https://ytbannerstudio.com/templates">');
      expect(html).toContain('"@type":"BreadcrumbList"');

      // Hero heading and prose
      expect(html).toContain('Free YouTube Banner Templates Built for Mobile Safe Areas');
      expect(html).toContain('measure-prose');

      // All templates rendered
      for (const tmpl of TEMPLATES) {
        expect(html).toContain(tmpl.name);
      }

      // Educational guides linked
      expect(html).toContain('/guides/youtube-banner-size');
      expect(html).toContain('/guides/youtube-banner-safe-area');
    });
  });

  describe('4. Niche Template Pages Built HTML Verification (/templates/[niche])', () => {
    const niches = ['gaming', 'tech', 'podcast', 'vlog', 'music', 'fitness', 'education', 'lifestyle', 'food', 'business'];

    for (const niche of niches) {
      it(`verifies /templates/${niche} built HTML: zero client JS, canonical, schema, and CTAs`, () => {
        const nichePagePath = path.join(distTemplatesDir, niche, 'index.html');
        expect(fs.existsSync(nichePagePath), `Missing built HTML for niche: ${niche}`).toBe(true);

        const html = fs.readFileSync(nichePagePath, 'utf-8');

        // M-15: Zero client scripts (theme-boot allowed)
        const clientScripts = (html.match(/<script(?![^>]*type=["']application\/ld\+json["'])(?![^>]*id=["']theme-boot["'])[^>]*>[\s\S]*?<\/script>/gi) || [])
          .filter((s) => !s.includes('googletagmanager') && !s.includes('gtag'));
        expect(clientScripts).toHaveLength(0);

        // SEO metadata
        const meta = NICHE_TITLES[niche];
        const expectedTitle = meta.title.replace(/&/g, '&amp;');
        expect(html).toContain(`<title>${expectedTitle}</title>`);
        expect(html).toContain(`<meta name="description" content="${meta.desc}">`);
        expect(html).toContain(`<link rel="canonical" href="https://ytbannerstudio.com/templates/${niche}">`);

        // JSON-LD Breadcrumbs: Home -> Templates -> Niche
        expect(html).toContain('"@type":"BreadcrumbList"');
        expect(html).toContain(meta.name);

        // Niche templates rendered
        const nicheTemplates = TEMPLATES.filter((t) => t.niche === niche);
        expect(nicheTemplates.length).toBeGreaterThanOrEqual(10);
        for (const tmpl of nicheTemplates) {
          expect(html).toContain(tmpl.name);
          expect(html).toContain(`/tools/youtube-banner-maker?template=${tmpl.id}`);
        }

        // Contextual CTA to Resizer tool
        expect(html).toContain('/tools/youtube-banner-resizer');

        // Niche switcher links back to /templates
        expect(html).toContain('href="/templates"');
      });
    }
  });
});
