import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://youtubebannermaker.com';
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
  { path: '/templates', changefreq: 'weekly', priority: '0.8' },
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

if (filteredRoutes.length !== 22) {
  console.warn(`WARNING: Expected 22 routes in sitemap, found ${filteredRoutes.length}`);
}

const xmlEntries = filteredRoutes.map((r) => {
  const loc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
  </url>`;
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>
`;

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;

const publicPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(publicPath, sitemapXml, 'utf-8');
fs.writeFileSync(path.resolve('public/sitemap-0.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.resolve('public/sitemap-index.xml'), sitemapIndexXml, 'utf-8');
console.log(`Generated public/sitemap.xml, sitemap-0.xml, and sitemap-index.xml with ${filteredRoutes.length} indexable routes.`);

// Also write to dist/ if dist exists
const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap-0.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf-8');
  console.log(`Synced sitemaps to dist/.`);
}
