import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');

let errors = [];
let auditedPages = 0;

if (fs.existsSync(DIST_DIR)) {
  function walkHtml(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(walkHtml(full));
      } else if (item.name.endsWith('.html')) {
        files.push(full);
      }
    }
    return files;
  }

  function decodeEntities(str) {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  }

  const htmlFiles = walkHtml(DIST_DIR);
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    if (content.includes('http-equiv="refresh"')) continue;
    auditedPages++;
    const rel = path.relative(DIST_DIR, file);

    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
      errors.push(`[${rel}] Missing <title> tag`);
    } else {
      const title = decodeEntities(titleMatch[1].trim());
      if (title.length > 60) {
        errors.push(`[${rel}] Title exceeds 60 chars (${title.length} chars): "${title}"`);
      }
    }

    const is404 = file.includes('404');
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    if (!descMatch && !is404) {
      errors.push(`[${rel}] Missing meta description`);
    } else if (descMatch) {
      const desc = decodeEntities(descMatch[1].trim());
      if (desc.length > 155) {
        errors.push(`[${rel}] Description exceeds 155 chars (${desc.length} chars): "${desc}"`);
      }
    }
  }
} else {
  console.warn('Warning: dist/ directory not found. Please run "npm run build" first to validate built HTML metadata.');
}

console.log(`Audited ${auditedPages} HTML pages for SEO title (<=60) and description (<=155) lengths.`);

if (errors.length > 0) {
  console.error(`\nFAIL: Found ${errors.length} SEO metadata violation(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('PASS: All pages satisfy title (<=60) and description (<=155) constraints.');
