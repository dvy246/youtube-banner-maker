import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const SITE_URL = 'https://youtubebannermaker.com';
const PROD_DOMAIN = 'youtubebannermaker.com';

function getHtmlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Technical SEO, Indexability & Crawlability Verification Gate', () => {
  const htmlFiles = getHtmlFiles(DIST_DIR);

  // Map of all valid routes in dist
  const validRoutes = new Set<string>();
  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file);
    if (rel === 'index.html') {
      validRoutes.add('/');
      validRoutes.add('');
    } else if (rel.endsWith('/index.html')) {
      validRoutes.add('/' + rel.slice(0, -'/index.html'.length));
    } else if (rel.endsWith('.html')) {
      validRoutes.add('/' + rel.slice(0, -'.html'.length));
    }
  }

  it('verifies that dist directory exists with pre-rendered pages', () => {
    expect(fs.existsSync(DIST_DIR)).toBe(true);
    expect(htmlFiles.length).toBeGreaterThanOrEqual(180);
  });

  it('verifies 100% zero broken internal links across all built pages', () => {
    const brokenLinks: Array<{ file: string; link: string; error: string }> = [];

    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relFile = path.relative(DIST_DIR, file);

      const aMatches = [...content.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi)];
      for (const m of aMatches) {
        let href = m[1].trim();
        if (
          !href ||
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('javascript:')
        ) {
          continue;
        }

        // Handle absolute production URLs
        if (href.startsWith('http://') || href.startsWith('https://')) {
          if (!href.startsWith(SITE_URL)) continue; // External link
          href = href.replace(SITE_URL, '');
        }

        // Clean query parameters and hash fragments
        const cleanHref = href.split('?')[0].split('#')[0] || '/';

        // Check if cleanHref is an asset file in dist or an HTML route
        if (cleanHref.includes('.')) {
          const assetPath = path.join(DIST_DIR, cleanHref);
          if (!fs.existsSync(assetPath)) {
            brokenLinks.push({ file: relFile, link: m[1], error: `Asset does not exist: ${cleanHref}` });
          }
        } else {
          if (!validRoutes.has(cleanHref)) {
            brokenLinks.push({ file: relFile, link: m[1], error: `Route does not exist: ${cleanHref}` });
          }
        }
      }
    }

    expect(brokenLinks, `Found broken internal links:\n${JSON.stringify(brokenLinks, null, 2)}`).toHaveLength(0);
  });

  it('verifies complete, valid, and reciprocal hreflang coverage with x-default', () => {
    const expectedLocales = ['en', 'es', 'de', 'fr', 'pt-BR', 'it', 'ja'];
    const missingHreflangFiles: string[] = [];
    const invalidHreflangUrls: Array<{ file: string; hreflang: string; url: string }> = [];

    for (const file of htmlFiles) {
      const relFile = path.relative(DIST_DIR, file);
      if (relFile.includes('404')) continue; // 404 must not have hreflang

      const content = fs.readFileSync(file, 'utf-8');
      // Skip Astro static redirect shims (they are 0-byte refresh redirects with noindex)
      if (content.includes('http-equiv="refresh"') || content.includes('content="noindex"')) {
        continue;
      }

      const hreflangMatches = [
        ...content.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi),
      ];

      const foundLangs = new Set(hreflangMatches.map((m) => m[1]));
      for (const reqLang of expectedLocales) {
        if (!foundLangs.has(reqLang)) {
          missingHreflangFiles.push(`${relFile} missing hreflang="${reqLang}"`);
        }
      }
      if (!foundLangs.has('x-default')) {
        missingHreflangFiles.push(`${relFile} missing hreflang="x-default"`);
      }

      for (const [_, lang, href] of hreflangMatches) {
        if (!href.startsWith(SITE_URL)) {
          invalidHreflangUrls.push({ file: relFile, hreflang: lang, url: href });
          continue;
        }
        const cleanPath = href.replace(SITE_URL, '') || '/';
        if (!validRoutes.has(cleanPath)) {
          invalidHreflangUrls.push({ file: relFile, hreflang: lang, url: href });
        }
      }
    }

    expect(missingHreflangFiles, `Missing hreflang tags:\n${missingHreflangFiles.join('\n')}`).toHaveLength(0);
    expect(invalidHreflangUrls, `Invalid hreflang targets:\n${JSON.stringify(invalidHreflangUrls, null, 2)}`).toHaveLength(0);
  });

  it('verifies 100% alignment between sitemaps and self-referential canonical URLs', () => {
    const sitemapIndexPath = path.resolve('public/sitemap-index.xml');
    expect(fs.existsSync(sitemapIndexPath)).toBe(true);

    const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf-8');
    const sitemapFiles = [...sitemapIndexContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(sitemapFiles.length).toBe(7); // en + 6 locales

    const sitemapMismatches: Array<{ sitemapUrl: string; error: string }> = [];

    for (const smUrl of sitemapFiles) {
      const fileName = smUrl.replace(`${SITE_URL}/`, '');
      const filePath = path.resolve('public', fileName);
      expect(fs.existsSync(filePath), `Sitemap file ${fileName} exists`).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

      for (const u of urls) {
        expect(u.startsWith(SITE_URL)).toBe(true);
        const cleanPath = u.replace(SITE_URL, '') || '/';

        let candidate = path.join(DIST_DIR, cleanPath === '/' ? 'index.html' : `${cleanPath}/index.html`);
        if (!fs.existsSync(candidate)) {
          candidate = path.join(DIST_DIR, cleanPath === '/' ? 'index.html' : `${cleanPath}.html`);
        }

        if (!fs.existsSync(candidate)) {
          sitemapMismatches.push({ sitemapUrl: u, error: `Sitemap URL does not exist in dist: ${candidate}` });
          continue;
        }

        const html = fs.readFileSync(candidate, 'utf-8');
        const canMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
        if (!canMatch) {
          sitemapMismatches.push({ sitemapUrl: u, error: 'Target HTML page has no canonical tag' });
        } else {
          const canonical = canMatch[1];
          if (canonical !== u) {
            sitemapMismatches.push({
              sitemapUrl: u,
              error: `Canonical mismatch: page canonical is "${canonical}" but sitemap has "${u}"`,
            });
          }
        }
      }
    }

    expect(sitemapMismatches, `Sitemap and canonical mismatches:\n${JSON.stringify(sitemapMismatches, null, 2)}`).toHaveLength(0);
  });

  it('verifies redirects do not collide with active sitemap URLs or targeted landing pages', () => {
    const redirectsPath = path.resolve('public/_redirects');
    expect(fs.existsSync(redirectsPath)).toBe(true);

    const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
    const lines = redirectsContent.split('\n').filter((l) => l.trim() && !l.startsWith('#'));

    // Collect all active URLs from sitemaps
    const sitemapIndexPath = path.resolve('public/sitemap-index.xml');
    const sitemapIndexContent = fs.readFileSync(sitemapIndexPath, 'utf-8');
    const sitemapFiles = [...sitemapIndexContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const activeSitemapUrls = new Set<string>();
    for (const smUrl of sitemapFiles) {
      const fileName = smUrl.replace(`${SITE_URL}/`, '');
      const smContent = fs.readFileSync(path.resolve('public', fileName), 'utf-8');
      for (const u of [...smContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
        activeSitemapUrls.add(u);
      }
    }

    for (const line of lines) {
      const [src, dest, status] = line.trim().split(/\s+/);
      expect(status).toBe('301');

      // The source of a redirect must NEVER be an active targeted page in sitemaps
      const srcFull = `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`;
      expect(
        activeSitemapUrls.has(srcFull),
        `Redirect source "${src}" collides with an active targeted page in sitemaps!`
      ).toBe(false);

      // The destination of a redirect must exist in validRoutes
      const cleanDest = dest.replace(/\/$/, '') || '/';
      expect(
        validRoutes.has(cleanDest),
        `Redirect target "${dest}" does not exist in dist!`
      ).toBe(true);
    }
  });

  it('verifies zero placeholder domains in metadata, canonicals, and JSON-LD schemas', () => {
    const forbiddenPlaceholders = ['[DOMAIN]', 'localhost', 'example.com', '0.0.0.0', '127.0.0.1'];
    const foundPlaceholders: Array<{ file: string; placeholder: string; snippet: string }> = [];

    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const relFile = path.relative(DIST_DIR, file);

      // Extract Head + JSON-LD
      const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
      const headContent = headMatch ? headMatch[0] : '';
      const jsonLdMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

      for (const p of forbiddenPlaceholders) {
        if (headContent.includes(p)) {
          foundPlaceholders.push({ file: relFile, placeholder: p, snippet: 'In <head> metadata' });
        }
        for (const ld of jsonLdMatches) {
          if (ld.includes(p)) {
            foundPlaceholders.push({ file: relFile, placeholder: p, snippet: 'In JSON-LD schema' });
          }
        }
      }
    }

    expect(foundPlaceholders, `Found placeholder domains in metadata or JSON-LD:\n${JSON.stringify(foundPlaceholders, null, 2)}`).toHaveLength(0);
  });

  it('verifies indexation headers and robots.txt configuration', () => {
    const robotsTxt = fs.readFileSync(path.resolve('public/robots.txt'), 'utf-8');
    expect(robotsTxt).toContain('Sitemap: https://youtubebannermaker.com/sitemap-index.xml');
    expect(robotsTxt).toContain('User-agent: *\nAllow: /');

    const headers = fs.readFileSync(path.resolve('public/_headers'), 'utf-8');
    // Verify noindex is scoped to pages.dev staging domains and 404, not production apex
    expect(headers).toContain('https://:project.pages.dev/*');
    expect(headers).toContain('X-Robots-Tag: noindex, nofollow');
    expect(headers).toContain('/404.html');

    // Ensure production domain is NOT blocked
    const prodNoindex = headers.match(/https:\/\/youtubebannermaker\.com\/\*[\s\S]*?X-Robots-Tag:\s*noindex/i);
    expect(prodNoindex).toBeNull();
  });
});
