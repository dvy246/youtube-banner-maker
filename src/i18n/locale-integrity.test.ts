import { describe, it, expect } from 'vitest';
import { TARGET_LOCALES, getStaticPageSeo, type Locale } from './index';

describe('Locale Integrity & Guide SEO Parity (AUDIT-003)', () => {
  const guideRoutes = [
    '/guides/how-to-make-a-youtube-banner',
    '/guides/how-to-choose-a-youtube-banner-template',
    '/guides/youtube-banner-background',
  ];

  for (const route of guideRoutes) {
    describe(`Route: ${route}`, () => {
      const enSeo = getStaticPageSeo(route, 'en');

      it('has valid English SEO metadata (<=60 chars title, <=155 chars desc)', () => {
        expect(enSeo.title.length).toBeGreaterThan(0);
        expect(enSeo.title.length).toBeLessThanOrEqual(60);
        expect(enSeo.desc.length).toBeGreaterThan(0);
        expect(enSeo.desc.length).toBeLessThanOrEqual(155);
      });

      for (const locale of TARGET_LOCALES) {
        it(`returns localized non-English SEO for locale: ${locale}`, () => {
          const locSeo = getStaticPageSeo(route, locale as Locale);

          expect(locSeo.title.length).toBeGreaterThan(0);
          expect(locSeo.title.length).toBeLessThanOrEqual(60);
          expect(locSeo.desc.length).toBeGreaterThan(0);
          expect(locSeo.desc.length).toBeLessThanOrEqual(155);

          // Crucial check: non-English locales must NOT fall back to English title
          expect(locSeo.title).not.toBe(enSeo.title);
        });
      }
    });
  }
});
