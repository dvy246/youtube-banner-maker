import fs from 'node:fs';
import path from 'node:path';
import { SAFE, CANVAS } from '../src/lib/spec.ts';

export function validateSingleTemplate(tmpl) {
  const errors = [];

  if (!tmpl.id || typeof tmpl.id !== 'string') {
    errors.push('Missing or invalid id');
  }
  if (!tmpl.niche || typeof tmpl.niche !== 'string') {
    errors.push('Missing or invalid niche');
  }
  if (!tmpl.name || typeof tmpl.name !== 'string') {
    errors.push('Missing or invalid name');
  }
  if (!tmpl.scene || typeof tmpl.scene !== 'object') {
    errors.push('Missing scene object');
  }
  if (!Array.isArray(tmpl.editable)) {
    errors.push('Missing editable array');
  }
  if (!Array.isArray(tmpl.protected)) {
    errors.push('Missing protected array');
  }
  if (tmpl.safeAreaValidated !== true) {
    errors.push('safeAreaValidated must be strictly true');
  }

  // Check editable != protected
  if (Array.isArray(tmpl.editable) && Array.isArray(tmpl.protected)) {
    for (const item of tmpl.editable) {
      if (tmpl.protected.includes(item)) {
        errors.push(`Overlap: '${item}' cannot be both editable and protected`);
      }
    }
  }

  if (tmpl.scene && Array.isArray(tmpl.scene.layers)) {
    if (tmpl.scene.layers.length > 8) {
      errors.push(`Too many layers: ${tmpl.scene.layers.length} (max 8)`);
    }

    const safeLeft = SAFE.x;
    const safeRight = SAFE.x + SAFE.w;
    const safeTop = SAFE.y;
    const safeBottom = SAFE.y + SAFE.h;

    for (const layer of tmpl.scene.layers) {
      if (layer.safeAreaConstrained) {
        const charWidthPx = (layer.size || 50) * 0.58;
        const totalWidthPx = Math.max(1, (layer.text || '').length) * charWidthPx;
        const totalHeightPx = (layer.size || 50) * 1.1;

        const widthFrac = totalWidthPx / CANVAS.width;
        const heightFrac = totalHeightPx / CANVAS.height;

        const posX = layer.x ?? 0.5;
        const posY = layer.y ?? 0.5;
        const align = layer.align || 'center';

        let minX, maxX;
        if (align === 'center') {
          minX = posX - widthFrac / 2;
          maxX = posX + widthFrac / 2;
        } else if (align === 'left') {
          minX = posX;
          maxX = posX + widthFrac;
        } else {
          minX = posX - widthFrac;
          maxX = posX;
        }

        const minY = posY - heightFrac / 2;
        const maxY = posY + heightFrac / 2;

        if (minX < safeLeft || maxX > safeRight || minY < safeTop || maxY > safeBottom) {
          errors.push(
            `Safe area violation on layer '${layer.role || layer.id}': ` +
              `bounds [${minX.toFixed(3)}, ${minY.toFixed(3)}, ${maxX.toFixed(3)}, ${maxY.toFixed(3)}] ` +
              `exceed safe area [${safeLeft.toFixed(3)}, ${safeTop.toFixed(3)}, ${safeRight.toFixed(3)}, ${safeBottom.toFixed(3)}]`
          );
        }
      }
    }
  }

  return errors;
}

export function computeStructuralHash(tmpl) {
  // Computes structural signature excluding colors and pure text content
  const layersSig = (tmpl.scene?.layers || []).map((l) => ({
    type: l.type,
    x: Math.round((l.x ?? 0.5) * 100),
    y: Math.round((l.y ?? 0.5) * 100),
    size: l.size ? Math.round(l.size / 10) : undefined,
    align: l.align,
  }));
  return JSON.stringify({ niche: tmpl.niche, layers: layersSig });
}

export function validateAllTemplates(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    return { valid: false, errors: ['No template files found!'] };
  }

  const allErrors = [];
  const structuralHashes = new Map();

  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const tmpl = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const errors = validateSingleTemplate(tmpl);
      if (errors.length > 0) {
        allErrors.push(`${file}:\n  - ` + errors.join('\n  - '));
      }

      // Check structural uniqueness within same niche
      const hash = computeStructuralHash(tmpl);
      if (structuralHashes.has(hash)) {
        allErrors.push(
          `Structural clone detected: ${file} shares structural layout with ${structuralHashes.get(hash)}`
        );
      } else {
        structuralHashes.set(hash, file);
      }
    } catch (e) {
      allErrors.push(`${file}: Failed to parse JSON: ${e.message}`);
    }
  }

  return {
    valid: allErrors.length === 0,
    count: files.length,
    errors: allErrors,
  };
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('validate-templates.mjs')) {
  const templatesDir = path.resolve('src/data/templates');
  const result = validateAllTemplates(templatesDir);

  if (!result.valid) {
    console.error('FAIL: Template validation failed:\n');
    for (const err of result.errors) {
      console.error(err);
    }
    process.exit(1);
  }

  console.log(`PASS: All ${result.count} templates pass schema, safe-area, uniqueness, and role disjointness.`);
}
