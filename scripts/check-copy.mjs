import fs from 'node:fs';
import path from 'node:path';

const bannedPatterns = [
  /\bno\s+quality\s+loss\b/i,
  /\blossless\b/i,
  /\bpixel[\s-]perfect\b/i,
  /\bguaranteed\b/i,
  /\bnever\s+blurry\b/i,
];

const literalDevicePixels = [
  /\b1546\b/,
  /\b423\b/,
  /\b1235\b/,
  /\b338\b/,
  /\b0\.2942\b/,
  /\b0\.7246\b/,
];

function walk(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p, filelist);
    } else if (
      p.endsWith('.ts') ||
      p.endsWith('.astro') ||
      p.endsWith('.js') ||
      p.endsWith('.mjs') ||
      p.endsWith('.md')
    ) {
      filelist.push(p);
    }
  }
  return filelist;
}

const srcFiles = walk('src');
let errors = [];

// 1. Check for banned honesty strings
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const pat of bannedPatterns) {
    if (pat.test(content)) {
      errors.push(`Banned honesty string matching ${pat} found in ${file}`);
    }
  }
}

// 2. Check for literal device-crop pixels outside spec.ts and test files
for (const file of srcFiles) {
  if (file.includes('spec.ts') || file.includes('.test.ts')) {
    continue;
  }
  const content = fs.readFileSync(file, 'utf-8');
  for (const pat of literalDevicePixels) {
    if (pat.test(content)) {
      errors.push(
        `M-19 violation: Literal device-crop pixel pattern ${pat} found outside spec.ts/tests in ${file}`
      );
    }
  }
}

// 3. Check for required strings in codebase
const simulateContent = fs.readFileSync('src/lib/simulate.ts', 'utf-8');
if (!simulateContent.includes("Approximate result of YouTube's re-encode.")) {
  errors.push("Missing required string \"Approximate result of YouTube's re-encode.\" in src/lib/simulate.ts");
}

if (errors.length > 0) {
  console.error('FAIL: check-copy found violations:\n');
  for (const err of errors) {
    console.error('  - ' + err);
  }
  process.exit(1);
}

console.log('PASS: check-copy verified all honesty guards and spec invariants.');
