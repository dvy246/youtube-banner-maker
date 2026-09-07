import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Global Curved Buttons Elegance Standards', () => {
  it('verifies Header component uses rounded-full for CTA and navigation triggers', () => {
    const headerPath = path.resolve('src/components/Header.astro');
    const content = fs.readFileSync(headerPath, 'utf-8');

    // Primary CTA button must be curved pill
    expect(content).toMatch(/class="[^"]*rounded-full[^"]*"[^>]*>\s*<span>\{dict\.common\.launchResizer\}/);
    // Mobile menu trigger must be rounded-full
    expect(content).toMatch(/class="[^"]*rounded-full[^"]*"[^>]*aria-label=\{dict\.common\.openMobileMenu\}/);
  });

  it('verifies LanguagePicker and PalettePicker use rounded-full triggers', () => {
    const langPicker = fs.readFileSync(path.resolve('src/components/LanguagePicker.astro'), 'utf-8');
    const palPicker = fs.readFileSync(path.resolve('src/components/PalettePicker.astro'), 'utf-8');

    expect(langPicker).toContain('rounded-full');
    expect(palPicker).toContain('rounded-full');
  });

  it('verifies primary landing page hero and CTA buttons use rounded-full', () => {
    const indexPath = path.resolve('src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf-8');

    expect(content).toContain('rounded-full');
  });

  it('verifies TemplatePickerModal buttons and category tabs use rounded-full', () => {
    const modalPath = path.resolve('src/components/TemplatePickerModal.astro');
    const content = fs.readFileSync(modalPath, 'utf-8');

    expect(content).toContain('rounded-full');
  });
});
