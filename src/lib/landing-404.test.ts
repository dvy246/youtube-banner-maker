import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Landing Page (/) and 404 Page (/404) Built HTML Verification', () => {
  const indexPath = path.resolve('dist/index.html');
  const error404Path = path.resolve('dist/404.html');

  it('verifies dist/index.html exists and contains zero client JS scripts', () => {
    expect(fs.existsSync(indexPath)).toBe(true);
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Gate 3 check: Zero client scripts (<script type="module"> or <script src>)
    const clientScripts = html.match(/<script(?![^>]*type=["']application\/ld\+json["'])(?![^>]*id=["']theme-boot["'])[^>]*>/gi);
    expect(clientScripts).toBeNull();
  });

  it('verifies dist/index.html head metadata and schemas', () => {
    const html = fs.readFileSync(indexPath, 'utf-8');

    // Title: Free YouTube Banner Maker — Correct on Every Device
    expect(html).toContain('<title>Free YouTube Banner Maker — Correct on Every Device</title>');

    // Meta description
    expect(html).toContain(
      '<meta name="description" content="Free YouTube banner maker. Correct 2560×1440, safe-area aware, device preview, no account, no watermark. See what YouTube will cut before you upload.">'
    );

    // Canonical self-referential
    expect(html).toContain('<link rel="canonical" href="https://youtubebannermaker.com/">');

    // Robots
    expect(html).toContain('<meta name="robots" content="index, follow">');

    // JSON-LD: WebSite and Organization only (No Product, No AggregateRating)
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).not.toContain('"@type":"Product"');
    expect(html).not.toContain('aggregateRating');
  });

  it('verifies dist/index.html contains required DOM sections in order', () => {
    const html = fs.readFileSync(indexPath, 'utf-8');

    // 1. Header
    const headerIndex = html.indexOf('<header');
    expect(headerIndex).toBeGreaterThan(-1);

    // 2. Hero with h1 and primary/secondary CTAs and badges
    const h1Index = html.indexOf(
      'Free YouTube Banner Maker That Fits'
    );
    expect(h1Index).toBeGreaterThan(headerIndex);
    expect(html).toContain('/tools/youtube-banner-resizer');
    expect(html).toContain('/tools/youtube-banner-checker');
    expect(html).toContain('100% Client-Side Privacy');
    expect(html).toContain('No Sign-Up or Accounts');
    expect(html).toContain('No Watermark');

    // 3. Three-door section (Fix, Check, Create)
    const doorSectionIndex = html.indexOf('Choose Your Channel Art Door');
    expect(doorSectionIndex).toBeGreaterThan(h1Index);
    expect(html).toContain('Door 01 · Fix');
    expect(html).toContain('Door 02 · Check');
    expect(html).toContain('Door 03 · Create');
    expect(html).toContain('/tools/youtube-banner-maker');

    // 4. What YouTube actually does + SVG diagram + re-encode explanation
    const svgSectionIndex = html.indexOf('What YouTube Actually Does to Your Banner');
    expect(svgSectionIndex).toBeGreaterThan(doorSectionIndex);
    expect(html).toContain('<svg');
    expect(html).toContain('Why YouTube Re-Compresses Every Banner Upload');
    expect(html).toContain('approximately 134 KB on desktop viewports');

    // 5. Spec table
    const specTableIndex = html.indexOf('Official YouTube Banner Dimensions & Limits');
    expect(specTableIndex).toBeGreaterThan(svgSectionIndex);

    // 6. Educational guides
    const guidesIndex = html.indexOf('Complete Channel Art Guides');
    expect(guidesIndex).toBeGreaterThan(specTableIndex);
    expect(html).toContain('/guides/youtube-banner-size');
    expect(html).toContain('/guides/youtube-banner-safe-area');

    // 7. FAQ section
    const faqIndex = html.indexOf('Frequently Asked Questions');
    expect(faqIndex).toBeGreaterThan(guidesIndex);

    // 8. Footer
    const footerIndex = html.indexOf('<footer');
    expect(footerIndex).toBeGreaterThan(faqIndex);
  });

  it('verifies dist/404.html exists, has noindex, zero JS, and navigation links', () => {
    expect(fs.existsSync(error404Path)).toBe(true);
    const html = fs.readFileSync(error404Path, 'utf-8');

    // Zero client scripts (theme-boot allowed)
    const scripts = html.match(/<script(?![^>]*id=["']theme-boot["'])[^>]*>/gi);
    expect(scripts).toBeNull();

    // Robots noindex, follow
    expect(html).toContain('<meta name="robots" content="noindex, follow">');

    // Title and description
    expect(html).toContain('<title>Page Not Found — YouTubeBannerMaker</title>');
    expect(html).toContain(
      '<meta name="description" content="The requested page could not be found. Return to YouTube Banner Maker tools and sizing guides.">'
    );

    // Required links
    expect(html).toContain('href="/tools/youtube-banner-resizer"');
    expect(html).toContain('href="/tools/youtube-banner-checker"');
    expect(html).toContain('href="/tools/youtube-banner-maker"');
    expect(html).toContain('href="/guides/youtube-banner-size"');
    expect(html).toContain('href="/guides/youtube-banner-safe-area"');
    expect(html).toContain('href="/"');
  });
});
