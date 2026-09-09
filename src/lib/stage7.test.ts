import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  ALLOWED_FUNNEL_EVENTS,
  validateAnalyticsPayload,
  trackEvent,
  getAnalyticsLog,
  clearAnalyticsLog,
  cleanImageFormat,
  getSizeTier,
} from './analytics';

describe('Stage 7: Technical SEO, Scripts, Security Headers & Analytics Audit', () => {
  beforeEach(() => {
    clearAnalyticsLog();
  });

  describe('1. Security Headers (public/_headers)', () => {
    const headersPath = path.resolve('public/_headers');

    it('verifies public/_headers exists and defines strict CSP and security directives', () => {
      expect(fs.existsSync(headersPath)).toBe(true);
      const content = fs.readFileSync(headersPath, 'utf-8');

      // CSP directive check (§F.4)
      expect(content).toContain("Content-Security-Policy: default-src 'self';");
      expect(content).toContain("img-src 'self' blob: data:");
      expect(content).toContain("frame-ancestors 'none';");
      expect(content).toContain("base-uri 'self';");
      expect(content).toContain("form-action 'self' mailto:");

      // Security headers
      expect(content).toContain('X-Content-Type-Options: nosniff');
      expect(content).toContain('Referrer-Policy: strict-origin-when-cross-origin');
      expect(content).toContain('X-Frame-Options: DENY');

      // Cache rules for immutable assets and HTML routes
      expect(content).toContain('Cache-Control: public, max-age=31536000, immutable');
      expect(content).toContain('Cache-Control: public, max-age=0, must-revalidate');
    });
  });

  describe('2. Search Engine Directives (public/robots.txt)', () => {
    const robotsPath = path.resolve('public/robots.txt');

    it('verifies robots.txt permits full crawling and points to sitemap.xml', () => {
      expect(fs.existsSync(robotsPath)).toBe(true);
      const content = fs.readFileSync(robotsPath, 'utf-8');

      expect(content).toContain('User-agent: *');
      expect(content).toContain('Allow: /');
      expect(content).not.toContain('Disallow: /tools');
      expect(content).toContain('Sitemap: https://ytbannerstudio.com/sitemap-index.xml');
    });
  });

  describe('3. XML Sitemap Completeness & Gating (public/sitemap.xml)', () => {
    const sitemapPath = path.resolve('public/sitemap.xml');

    it('verifies sitemap contains exactly the valid, indexable routes and excludes 404', () => {
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const content = fs.readFileSync(sitemapPath, 'utf-8');

      // Hard rule: /404 must NEVER be in sitemap
      expect(content).not.toContain('404');

      // Core routes
      expect(content).toContain('<loc>https://ytbannerstudio.com/</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/tools/youtube-banner-resizer</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/tools/youtube-banner-checker</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/tools/youtube-banner-maker</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/youtube-banner-size</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/youtube-banner-safe-area</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/youtube-banner-1024-x-576</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/how-to-make-a-youtube-banner</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/how-to-choose-a-youtube-banner-template</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/guides/youtube-banner-background</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/templates</loc>');

      // AdSense Trust suite
      expect(content).toContain('<loc>https://ytbannerstudio.com/about</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/contact</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/privacy</loc>');
      expect(content).toContain('<loc>https://ytbannerstudio.com/terms</loc>');

      // All qualifying niche pages (≥3 templates each)
      const niches = ['business', 'education', 'fitness', 'food', 'gaming', 'lifestyle', 'music', 'podcast', 'tech', 'vlog'];
      for (const n of niches) {
        expect(content).toContain(`<loc>https://ytbannerstudio.com/templates/${n}</loc>`);
      }

      expect(content).toContain('<loc>https://ytbannerstudio.com/backgrounds</loc>');

      // Count total URLs in sitemap
      const urlCount = (content.match(/<loc>/g) || []).length;
      expect(urlCount).toBe(26);
    });
  });

  describe('4. Cookieless First-Party Analytics Engine (§F.5, Tasks 7.1, 7.2)', () => {
    it('defines exactly the 8 verified funnel events', () => {
      expect(ALLOWED_FUNNEL_EVENTS.length).toBe(8);
      expect(ALLOWED_FUNNEL_EVENTS).toEqual([
        'template_selected',
        'editor_start',
        'upload',
        'validation_run',
        'export_start',
        'export_success',
        'activation',
        're_export',
      ]);
    });

    it('sanitizes formats and size tiers properly', () => {
      expect(cleanImageFormat('image/png')).toBe('png');
      expect(cleanImageFormat('image/jpeg')).toBe('jpeg');
      expect(cleanImageFormat('jpg')).toBe('jpeg');
      expect(cleanImageFormat('image/webp')).toBe('webp');
      expect(cleanImageFormat('exe')).toBe('unknown');

      expect(getSizeTier(500_000)).toBe('<1MB');
      expect(getSizeTier(2_000_000)).toBe('1-3MB');
      expect(getSizeTier(4_500_000)).toBe('3-6MB');
      expect(getSizeTier(8_000_000)).toBe('>6MB');
    });

    it('validates each of the 8 funnel event payloads', () => {
      expect(validateAnalyticsPayload('editor_start', { mode: 'make' })).toBe(true);
      expect(validateAnalyticsPayload('template_selected', { templateId: 'gaming-retro' })).toBe(true);
      expect(validateAnalyticsPayload('upload', { format: 'png', sizeTier: '1-3MB' })).toBe(true);
      expect(
        validateAnalyticsPayload('validation_run', {
          verdictCount: 2,
          errorCount: 1,
          hasOverflow: true,
        })
      ).toBe(true);
      expect(validateAnalyticsPayload('export_start', { format: 'png' })).toBe(true);
      expect(validateAnalyticsPayload('export_success', { format: 'png', durationMs: 142 })).toBe(true);
      expect(validateAnalyticsPayload('activation', { format: 'png' })).toBe(true);
      expect(validateAnalyticsPayload('re_export', {})).toBe(true);
    });

    it('strictly rejects any payload containing user text, image data, or unauthorized keys (M-Gate 7)', () => {
      // Reject user channel name / tagline
      expect(validateAnalyticsPayload('editor_start', { mode: 'make', userText: 'My Channel' })).toBe(false);
      expect(validateAnalyticsPayload('template_selected', { templateId: 'gaming-retro', title: 'Streamer' })).toBe(false);

      // Reject data URLs and base64
      expect(validateAnalyticsPayload('upload', { format: 'png', data: 'data:image/png;base64,iVBORw0KGgo=' })).toBe(false);

      // Reject image byte payloads
      expect(validateAnalyticsPayload('export_success', { format: 'png', durationMs: 100, imageBytes: 50000 })).toBe(false);

      // Reject file names
      expect(validateAnalyticsPayload('upload', { format: 'png', filename: 'banner.png' })).toBe(false);

      // Reject unauthorized events
      expect(validateAnalyticsPayload('user_click', {})).toBe(false);
    });

    it('records valid events in-memory and ignores invalid ones', () => {
      const ok1 = trackEvent('editor_start', { mode: 'make' });
      expect(ok1).toBe(true);

      const ok2 = trackEvent('upload', { format: 'png', sizeTier: '1-3MB' });
      expect(ok2).toBe(true);

      const bad = (trackEvent as any)('malicious_event', { text: 'stolen' });
      expect(bad).toBe(false);

      const log = getAnalyticsLog();
      expect(log.length).toBe(2);
      expect(log[0].event).toBe('editor_start');
      expect(log[1].event).toBe('upload');
    });
  });

  describe('5. Asset Completeness & OpenGraph Imagery', () => {
    it('verifies public/og-image.png exists and is a valid non-empty image', () => {
      const ogPath = path.resolve('public/og-image.png');
      expect(fs.existsSync(ogPath)).toBe(true);
      const stat = fs.statSync(ogPath);
      expect(stat.size).toBeGreaterThan(1000);
    });

    it('verifies public/favicon.svg exists and is valid SVG', () => {
      const favPath = path.resolve('public/favicon.svg');
      expect(fs.existsSync(favPath)).toBe(true);
      const content = fs.readFileSync(favPath, 'utf-8');
      expect(content).toContain('<svg');
    });
  });
});
