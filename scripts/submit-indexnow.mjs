import fs from 'node:fs';
import path from 'node:path';

const KEY = '4c2b9a781f3d4e658a2d3b5e9f1a7c8e';
const HOST = 'ytbannerstudio.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.resolve('public/sitemap.xml');

if (!fs.existsSync(SITEMAP_PATH)) {
  console.error('Sitemap not found at ' + SITEMAP_PATH);
  process.exit(1);
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)];
const urlList = locMatches.map(m => m[1]);

console.log(`Extracted ${urlList.length} URLs from primary sitemap for IndexNow.`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
};

const isLive = process.argv.includes('--live');

if (!isLive) {
  console.log('DRY RUN: Prepared IndexNow payload:');
  console.log(JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, sampleUrls: urlList.slice(0, 5), totalUrls: urlList.length }, null, 2));
  console.log('To submit to IndexNow API, run with --live');
} else {
  console.log(`Submitting ${urlList.length} URLs to https://api.indexnow.org/indexnow ...`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    console.log(`IndexNow response status: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('✓ Successfully submitted URLs to IndexNow!');
    } else {
      const txt = await res.text();
      console.log('Response:', txt);
    }
  } catch (err) {
    console.error('Failed to submit to IndexNow:', err.message);
  }
}
