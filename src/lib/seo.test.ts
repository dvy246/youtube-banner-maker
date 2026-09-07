import { describe, it, expect } from 'vitest';
import {
  STATIC_PAGES_SEO,
  NICHE_TITLES,
  validateMetadataLength,
  getCanonicalUrl,
  getWebSiteSchema,
  getOrganizationSchema,
  getSoftwareAppSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getContactPageSchema,
  getCollectionPageSchema,
  SITE_URL,
} from './seo';

describe('SEO Metadata & Standards Compliance', () => {
  it('enforces title <= 60 chars and meta description <= 155 chars on all static pages', () => {
    for (const [path, meta] of Object.entries(STATIC_PAGES_SEO)) {
      const res = validateMetadataLength(meta.title, meta.desc);
      expect(
        res.titleValid,
        `Page ${path} title exceeds 60 chars: "${meta.title}" (${res.titleLen} chars)`
      ).toBe(true);
      expect(
        res.descValid,
        `Page ${path} meta description exceeds 155 chars: "${meta.desc}" (${res.descLen} chars)`
      ).toBe(true);
    }
  });

  it('ensures home page targets maker keyword and size guide targets size keyword', () => {
    const homeSeo = STATIC_PAGES_SEO['/'];
    expect(homeSeo.title.toLowerCase()).toContain('youtube banner maker');
    
    const sizeSeo = STATIC_PAGES_SEO['/guides/youtube-banner-size'];
    expect(sizeSeo.title.toLowerCase()).toContain('youtube banner size');
    expect(sizeSeo.desc.toLowerCase()).toContain('youtube banner size');
  });

  it('enforces title <= 60 chars and meta description <= 155 chars on all niche template pages', () => {
    for (const [niche, meta] of Object.entries(NICHE_TITLES)) {
      const res = validateMetadataLength(meta.title, meta.desc);
      expect(
        res.titleValid,
        `Niche ${niche} title exceeds 60 chars: "${meta.title}" (${res.titleLen} chars)`
      ).toBe(true);
      expect(
        res.descValid,
        `Niche ${niche} meta description exceeds 155 chars: "${meta.desc}" (${res.descLen} chars)`
      ).toBe(true);
    }
  });

  it('generates self-referential canonical URLs matching sitemap', () => {
    expect(getCanonicalUrl('/')).toBe(`${SITE_URL}/`);
    expect(getCanonicalUrl('/guides/youtube-banner-size')).toBe(
      `${SITE_URL}/guides/youtube-banner-size`
    );
    expect(getCanonicalUrl('/guides/youtube-banner-size/')).toBe(
      `${SITE_URL}/guides/youtube-banner-size`
    );
    expect(getCanonicalUrl('/tools/youtube-banner-resizer?template=gaming')).toBe(
      `${SITE_URL}/tools/youtube-banner-resizer`
    );
  });

  it('generates compliant Schema.org JSON-LD structures', () => {
    const webSite = getWebSiteSchema();
    expect(webSite['@type']).toBe('WebSite');
    expect(webSite.url).toBe(`${SITE_URL}/`);

    const org = getOrganizationSchema();
    expect(org['@type']).toBe('Organization');
    expect(org.logo.url).toBe(`${SITE_URL}/logo.svg`);
    expect(org.sameAs).toContain('https://github.com/dvy246');

    const app = getSoftwareAppSchema(
      'YouTube Banner Resizer',
      'Resize banner to 2560x1440',
      '/tools/youtube-banner-resizer'
    );
    expect(app['@type']).toBe('SoftwareApplication');
    expect(app.offers.price).toBe('0');
    // Ensure no Product or AggregateRating
    expect((app as any)['@type']).not.toBe('Product');
    expect((app as any).aggregateRating).toBeUndefined();

    const breadcrumbs = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Size Guide', url: '/guides/youtube-banner-size' },
    ]);
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement.length).toBe(2);
    expect(breadcrumbs.itemListElement[0].position).toBe(1);

    const faq = getFAQSchema([
      { question: 'What is the size?', answer: '2560x1440 px' },
    ]);
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity.length).toBe(1);

    const contact = getContactPageSchema();
    expect(contact['@type']).toBe('ContactPage');
    expect(contact.url).toBe(`${SITE_URL}/contact`);
    expect(contact.mainEntity['@type']).toBe('Organization');

    const collection = getCollectionPageSchema({
      name: 'Templates',
      description: 'Browse all templates',
      path: '/templates',
      items: [
        { name: 'Neon Cyber', url: '/tools/youtube-banner-maker?template=gaming-neon', image: '/previews/gaming-neon.svg' },
      ],
    });
    expect(collection['@type']).toBe('CollectionPage');
    expect(collection.mainEntity['@type']).toBe('ItemList');
    expect(collection.mainEntity.numberOfItems).toBe(1);
    expect(collection.mainEntity.itemListElement[0].name).toBe('Neon Cyber');
  });
});
