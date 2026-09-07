import { describe, it, expect } from 'vitest';
import {
  LOCALES,
  LOCALE_CONFIG,
  getCleanBasePath,
  getLocaleFromPath,
  getLocalizedUrl,
  getAbsoluteLocalizedUrl,
  getHreflangLinks,
} from './index';
import { SITE_URL } from '../lib/seo';

describe('i18n Architecture & Routing Engine', () => {
  it('defines 7 supported locales with exact Google-compliant hreflang and HTML lang codes', () => {
    expect(LOCALES).toEqual(['en', 'es', 'de', 'fr', 'pt-br', 'it', 'ja']);
    expect(LOCALE_CONFIG['en'].hreflang).toBe('en');
    expect(LOCALE_CONFIG['es'].hreflang).toBe('es');
    expect(LOCALE_CONFIG['de'].hreflang).toBe('de');
    expect(LOCALE_CONFIG['fr'].hreflang).toBe('fr');
    expect(LOCALE_CONFIG['pt-br'].hreflang).toBe('pt-BR');
    expect(LOCALE_CONFIG['it'].hreflang).toBe('it');
    expect(LOCALE_CONFIG['ja'].hreflang).toBe('ja');

    expect(LOCALE_CONFIG['en'].htmlLang).toBe('en');
    expect(LOCALE_CONFIG['es'].htmlLang).toBe('es');
    expect(LOCALE_CONFIG['de'].htmlLang).toBe('de');
    expect(LOCALE_CONFIG['fr'].htmlLang).toBe('fr');
    expect(LOCALE_CONFIG['pt-br'].htmlLang).toBe('pt-BR');
    expect(LOCALE_CONFIG['it'].htmlLang).toBe('it');
    expect(LOCALE_CONFIG['ja'].htmlLang).toBe('ja');
  });

  it('normalizes paths to canonical un-prefixed English base paths', () => {
    expect(getCleanBasePath('/')).toBe('/');
    expect(getCleanBasePath('/about')).toBe('/about');
    expect(getCleanBasePath('/about/')).toBe('/about');
    expect(getCleanBasePath('/es')).toBe('/');
    expect(getCleanBasePath('/es/')).toBe('/');
    expect(getCleanBasePath('/es/about')).toBe('/about');
    expect(getCleanBasePath('/pt-br/guides/youtube-banner-size')).toBe('/guides/youtube-banner-size');
    expect(getCleanBasePath('/ja/tools/youtube-banner-maker')).toBe('/tools/youtube-banner-maker');
    expect(getCleanBasePath('/de/templates/gaming')).toBe('/templates/gaming');
  });

  it('correctly detects locale from pathname', () => {
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/about')).toBe('en');
    expect(getLocaleFromPath('/es')).toBe('es');
    expect(getLocaleFromPath('/es/about')).toBe('es');
    expect(getLocaleFromPath('/pt-br')).toBe('pt-br');
    expect(getLocaleFromPath('/pt-br/guides/youtube-banner-size')).toBe('pt-br');
    expect(getLocaleFromPath('/ja')).toBe('ja');
    expect(getLocaleFromPath('/ja/templates/tech')).toBe('ja');
  });

  it('generates un-prefixed English URLs and cleanly prefixed localized URLs', () => {
    // English default is always un-prefixed
    expect(getLocalizedUrl('/', 'en')).toBe('/');
    expect(getLocalizedUrl('/about', 'en')).toBe('/about');
    expect(getLocalizedUrl('/es/about', 'en')).toBe('/about');
    expect(getLocalizedUrl('/guides/youtube-banner-size', 'en')).toBe('/guides/youtube-banner-size');

    // Localized routes
    expect(getLocalizedUrl('/', 'es')).toBe('/es');
    expect(getLocalizedUrl('/about', 'es')).toBe('/es/about');
    expect(getLocalizedUrl('/guides/youtube-banner-size', 'pt-br')).toBe('/pt-br/guides/youtube-banner-size');
    expect(getLocalizedUrl('/tools/youtube-banner-checker', 'ja')).toBe('/ja/tools/youtube-banner-checker');
    expect(getLocalizedUrl('/es/templates/gaming', 'de')).toBe('/de/templates/gaming');
  });

  it('generates full absolute URLs for all locales', () => {
    expect(getAbsoluteLocalizedUrl('/', 'en')).toBe(`${SITE_URL}/`);
    expect(getAbsoluteLocalizedUrl('/about', 'en')).toBe(`${SITE_URL}/about`);
    expect(getAbsoluteLocalizedUrl('/', 'es')).toBe(`${SITE_URL}/es`);
    expect(getAbsoluteLocalizedUrl('/about', 'ja')).toBe(`${SITE_URL}/ja/about`);
  });

  it('generates full reciprocal hreflang links with x-default fallback for indexable routes', () => {
    const links = getHreflangLinks('/guides/youtube-banner-size');
    expect(links.length).toBe(8); // 7 locales + 1 x-default

    const hreflangs = links.map((l) => l.hreflang);
    expect(hreflangs).toContain('en');
    expect(hreflangs).toContain('es');
    expect(hreflangs).toContain('de');
    expect(hreflangs).toContain('fr');
    expect(hreflangs).toContain('pt-BR');
    expect(hreflangs).toContain('it');
    expect(hreflangs).toContain('ja');
    expect(hreflangs).toContain('x-default');

    const xDefault = links.find((l) => l.hreflang === 'x-default');
    expect(xDefault?.href).toBe(`${SITE_URL}/guides/youtube-banner-size`);

    const ptBr = links.find((l) => l.hreflang === 'pt-BR');
    expect(ptBr?.href).toBe(`${SITE_URL}/pt-br/guides/youtube-banner-size`);

    const ja = links.find((l) => l.hreflang === 'ja');
    expect(ja?.href).toBe(`${SITE_URL}/ja/guides/youtube-banner-size`);
  });

  it('excludes hreflang links on 404 pages to protect Googlebot crawl budget', () => {
    const links = getHreflangLinks('/404');
    expect(links.length).toBe(0);
  });

  it('enforces title <= 60 chars and meta description <= 155 chars across all 7 locales for all static pages', async () => {
    const { getStaticPageSeo } = await import('./index');
    const { validateMetadataLength } = await import('../lib/seo');

    const testRoutes = [
      '/',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/guides/youtube-banner-size',
      '/guides/youtube-banner-safe-area',
      '/guides/youtube-banner-1024-x-576',
      '/templates',
      '/tools/youtube-banner-resizer',
      '/tools/youtube-banner-checker',
      '/tools/youtube-banner-maker',
    ];

    for (const locale of LOCALES) {
      for (const route of testRoutes) {
        const seo = getStaticPageSeo(route, locale);
        const res = validateMetadataLength(seo.title, seo.desc);
        expect(
          res.titleValid,
          `[${locale}] Page ${route} title exceeds 60 chars (${res.titleLen}): "${seo.title}"`
        ).toBe(true);
        expect(
          res.descValid,
          `[${locale}] Page ${route} description exceeds 155 chars (${res.descLen}): "${seo.desc}"`
        ).toBe(true);
      }
    }
  });

  it('enforces title <= 60 chars and meta description <= 155 chars across all 7 locales for all 10 niche pages', async () => {
    const { getNicheSeo } = await import('./index');
    const { validateMetadataLength } = await import('../lib/seo');

    const niches = [
      'gaming',
      'tech',
      'podcast',
      'vlog',
      'music',
      'fitness',
      'education',
      'lifestyle',
      'food',
      'business',
    ];

    for (const locale of LOCALES) {
      for (const niche of niches) {
        const seo = getNicheSeo(niche, locale);
        const res = validateMetadataLength(seo.title, seo.desc);
        expect(
          res.titleValid,
          `[${locale}] Niche ${niche} title exceeds 60 chars (${res.titleLen}): "${seo.title}"`
        ).toBe(true);
        expect(
          res.descValid,
          `[${locale}] Niche ${niche} description exceeds 155 chars (${res.descLen}): "${seo.desc}"`
        ).toBe(true);
      }
    }
  });
});
