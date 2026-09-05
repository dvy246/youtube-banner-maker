import fs from 'node:fs';
import path from 'node:path';

const previewsDir = path.resolve('public/previews');
if (!fs.existsSync(previewsDir)) {
  fs.mkdirSync(previewsDir, { recursive: true });
}

const templatesDir = path.resolve('src/data/templates');
const files = fs.readdirSync(templatesDir).filter((f) => f.endsWith('.json'));

for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
  const bg = json.scene.background;
  let bgSvg = '';
  if (bg.type === 'solid') {
    bgSvg = `<rect width="100%" height="100%" fill="${bg.color}" />`;
  } else if (bg.type === 'gradient') {
    bgSvg = `
      <defs>
        <linearGradient id="bg-${json.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg.from}" />
          <stop offset="100%" stop-color="${bg.to}" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-${json.id})" />
    `;
  }

  let layersSvg = '';
  for (const layer of json.scene.layers) {
    if (layer.type === 'text') {
      const yPercent = (layer.y * 100).toFixed(1);
      const isTitle = layer.role === 'title';
      const fontSize = isTitle ? 32 : 15;
      const weight = isTitle ? '700' : '500';
      layersSvg += `<text x="50%" y="${yPercent}%" text-anchor="middle" dominant-baseline="middle" fill="${layer.color}" font-family="Switzer, sans-serif" font-size="${fontSize}" font-weight="${weight}">${escapeXml(layer.text)}</text>\n`;
    } else if (layer.type === 'shape') {
      const x = (layer.x * 640).toFixed(1);
      const y = (layer.y * 360).toFixed(1);
      const w = (layer.w * 640).toFixed(1);
      const h = ((layer.h || 0.01) * 360).toFixed(1);
      layersSvg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${layer.color}" opacity="${layer.opacity || 1}" />\n`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
  ${bgSvg}
  <!-- Safe area indicator border (subtle) -->
  <rect x="127" y="127" width="386" height="106" fill="none" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4 4" rx="4" />
  ${layersSvg}
</svg>`;

  fs.writeFileSync(path.join(previewsDir, `${json.id}.svg`), svg.trim() + '\n');
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

console.log(`Generated ${files.length} preview SVGs in public/previews/`);
