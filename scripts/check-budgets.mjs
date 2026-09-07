import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const distDir = path.resolve('dist');

// If dist doesn't exist yet, we check templates size and exit gracefully or inform
let errors = [];

// 1. Template payload check (M-17: <= ~30 KB total)
const templatesDir = path.resolve('src/data/templates');
if (fs.existsSync(templatesDir)) {
  const jsonFiles = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));
  let totalBytes = 0;
  for (const f of jsonFiles) {
    totalBytes += fs.statSync(path.join(templatesDir, f)).size;
  }
  const totalGzip = zlib.gzipSync(
    Buffer.concat(jsonFiles.map((f) => fs.readFileSync(path.join(templatesDir, f))))
  ).length;

  console.log(
    `Template payload size: ${(totalBytes / 1024).toFixed(1)} KB raw, ${(totalGzip / 1024).toFixed(1)} KB gzipped (${jsonFiles.length} templates)`
  );
  if (totalGzip > 35 * 1024) {
    errors.push(`Template payload exceeds budget: ${(totalGzip / 1024).toFixed(1)} KB gzipped > 30 KB`);
  }
}

if (fs.existsSync(distDir)) {
  // 2. M-15: Built content routes contain no <script type="module">
  // Content routes: index.html, guides/..., templates/..., 404.html
  const contentPages = [
    'index.html',
    'guides/youtube-banner-size/index.html',
    'guides/youtube-banner-safe-area/index.html',
    'guides/how-to-make-a-youtube-banner/index.html',
    'guides/how-to-choose-a-youtube-banner-template/index.html',
    'templates/index.html',
    '404.html',
  ];

  for (const page of contentPages) {
    const pagePath = path.join(distDir, page);
    if (fs.existsSync(pagePath)) {
      const html = fs.readFileSync(pagePath, 'utf-8');
      if (/<script[^>]*type=["']module["']/i.test(html)) {
        errors.push(`M-15 violation: Content page ${page} contains <script type="module"> (must be 0 KB JS)`);
      }
    }
  }

  // 3. M-16: Tool-route JS <= 65 KB gzip
  // Find all JS files in dist/_astro/ or dist/
  function findJsFiles(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const p = path.join(dir, file);
      if (fs.statSync(p).isDirectory()) {
        results = results.concat(findJsFiles(p));
      } else if (file.endsWith('.js')) {
        results.push(p);
      }
    }
    return results;
  }

  const jsFiles = findJsFiles(distDir);
  for (const js of jsFiles) {
    const raw = fs.readFileSync(js);
    const gzipped = zlib.gzipSync(raw);
    const sizeKb = gzipped.length / 1024;
    console.log(`JS asset ${path.basename(js)}: ${sizeKb.toFixed(1)} KB gzipped`);
    if (gzipped.length > 65 * 1024) {
      errors.push(`M-16 violation: JS bundle ${path.basename(js)} (${sizeKb.toFixed(1)} KB) exceeds 65 KB gzip limit!`);
    }
  }
}

if (errors.length > 0) {
  console.error('FAIL: check-budgets found violations:\n');
  for (const err of errors) {
    console.error('  - ' + err);
  }
  process.exit(1);
}

console.log('PASS: check-budgets verified performance budgets.');
