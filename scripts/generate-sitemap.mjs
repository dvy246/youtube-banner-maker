import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://ytbannerstudio.com';
const TODAY = new Date().toISOString().split('T')[0];

// Core non-niche indexable routes
const CORE_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/tools/youtube-banner-resizer', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/youtube-banner-checker', changefreq: 'weekly', priority: '0.9' },
  { path: '/tools/youtube-banner-maker', changefreq: 'weekly', priority: '0.9' },
  { path: '/guides/youtube-banner-size', changefreq: 'weekly', priority: '0.8' },
  { path: '/guides/youtube-banner-safe-area', changefreq: 'weekly', priority: '0.8' },
  { path: '/guides/youtube-banner-1024-x-576', changefreq: 'weekly', priority: '0.8' },
  { path: '/guides/how-to-make-a-youtube-banner', changefreq: 'weekly', priority: '0.8' },
  { path: '/guides/how-to-choose-a-youtube-banner-template', changefreq: 'weekly', priority: '0.8' },
  { path: '/guides/youtube-banner-background', changefreq: 'weekly', priority: '0.8' },
  { path: '/templates', changefreq: 'weekly', priority: '0.8' },
  { path: '/backgrounds', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.3' },
  { path: '/terms', changefreq: 'monthly', priority: '0.3' },
];

// Helper to compute structural uniqueness of template
function computeStructuralHash(tmpl) {
  const parts = [];
  parts.push(`bg:${tmpl.scene.background.type}`);
  for (const layer of tmpl.scene.layers) {
    if (layer.type === 'text') {
      parts.push(`txt:${layer.id || layer.role}:${layer.align || 'center'}:${layer.font || 'sans'}`);
    } else if (layer.type === 'shape') {
      parts.push(`shp:${layer.id || layer.role}:${layer.shape || 'rect'}`);
    }
  }
  return parts.join('|');
}

// Inspect templates directory to find qualifying niches (REQ-017: >= 3 distinct templates)
function getQualifyingNiches() {
  const templatesDir = path.resolve('src/data/templates');
  if (!fs.existsSync(templatesDir)) return [];

  const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));
  const nicheMap = new Map();

  for (const f of files) {
    const raw = fs.readFileSync(path.join(templatesDir, f), 'utf-8');
    const json = JSON.parse(raw);
    const n = json.niche.toLowerCase();
    if (!nicheMap.has(n)) nicheMap.set(n, []);
    nicheMap.get(n).push(json);
  }

  const qualifying = [];
  for (const [niche, list] of nicheMap.entries()) {
    const seen = new Set();
    const distinct = list.filter((t) => {
      const h = computeStructuralHash(t);
      if (seen.has(h)) return false;
      seen.add(h);
      return true;
    });
    if (distinct.length >= 3) {
      qualifying.push(niche);
    }
  }
  return qualifying.sort();
}

const qualifyingNiches = getQualifyingNiches();
const nicheRoutes = qualifyingNiches.map((niche) => ({
  path: `/templates/${niche}`,
  changefreq: 'weekly',
  priority: '0.7',
}));

const allRoutes = [...CORE_ROUTES, ...nicheRoutes];

// Hard rule: /404 is strictly excluded from sitemap.xml
const filteredRoutes = allRoutes.filter((r) => r.path !== '/404' && !r.path.includes('404'));

if (filteredRoutes.length !== 26) {
  console.warn(`WARNING: Expected 26 routes in sitemap, found ${filteredRoutes.length}`);
}

const LOCALES = [
  { code: 'en', hreflang: 'en' },
  { code: 'es', hreflang: 'es' },
  { code: 'de', hreflang: 'de' },
  { code: 'fr', hreflang: 'fr' },
  { code: 'pt-br', hreflang: 'pt-BR' },
  { code: 'it', hreflang: 'it' },
  { code: 'ja', hreflang: 'ja' },
];

function getUrlForLocale(basePath, localeCode) {
  if (localeCode === 'en') {
    return basePath === '/' ? `${SITE_URL}/` : `${SITE_URL}${basePath}`;
  }
  return basePath === '/' ? `${SITE_URL}/${localeCode}` : `${SITE_URL}/${localeCode}${basePath}`;
}

function generateSitemapXmlForLocale(localeCode) {
  const entries = filteredRoutes.map((r) => {
    const pageUrl = getUrlForLocale(r.path, localeCode);
    const xhtmlLinks = LOCALES.map((target) => {
      const altUrl = getUrlForLocale(r.path, target.code);
      return `    <xhtml:link rel="alternate" hreflang="${target.hreflang}" href="${altUrl}"/>`;
    });
    const xDefaultUrl = getUrlForLocale(r.path, 'en');
    xhtmlLinks.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefaultUrl}"/>`);

    return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${localeCode === 'en' ? r.priority : (parseFloat(r.priority) * 0.9).toFixed(1)}</priority>
${xhtmlLinks.join('\n')}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

// Generate primary sitemap.xml (22 English canonical URLs with full reciprocal hreflang)
const sitemapXml = generateSitemapXmlForLocale('en');

// Generate sitemap-index.xml linking all sitemaps
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
${LOCALES.filter((l) => l.code !== 'en')
  .map(
    (l) => `  <sitemap>
    <loc>${SITE_URL}/sitemap-${l.code}.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>
`;

const publicPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(publicPath, sitemapXml, 'utf-8');
fs.writeFileSync(path.resolve('public/sitemap-index.xml'), sitemapIndexXml, 'utf-8');

// Write per-locale sitemaps
for (const loc of LOCALES.filter((l) => l.code !== 'en')) {
  const locXml = generateSitemapXmlForLocale(loc.code);
  fs.writeFileSync(path.resolve(`public/sitemap-${loc.code}.xml`), locXml, 'utf-8');
}

console.log(`Generated public/sitemap.xml (${filteredRoutes.length} routes with reciprocal hreflang), per-locale sitemaps (${filteredRoutes.length * LOCALES.length} total URLs across ${LOCALES.length} locales), and sitemap-index.xml.`);

// Also write to dist/ if dist exists
const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf-8');
  for (const loc of LOCALES.filter((l) => l.code !== 'en')) {
    const locXml = generateSitemapXmlForLocale(loc.code);
    fs.writeFileSync(path.join(distDir, `sitemap-${loc.code}.xml`), locXml, 'utf-8');
  }
  console.log(`Synced all sitemaps to dist/.`);
}
