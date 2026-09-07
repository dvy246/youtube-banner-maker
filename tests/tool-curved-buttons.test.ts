import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Tool Island Curved Controls Standards', () => {
  it('verifies ExportButton primary download button and copy button are rounded-full', () => {
    const exportBtnPath = path.resolve('src/components/ExportButton.astro');
    const content = fs.readFileSync(exportBtnPath, 'utf-8');

    expect(content).toMatch(/id="export-button"[^>]*class="[^"]*rounded-full/);
    expect(content).toMatch(/id="copy-clipboard-button"[^>]*class="[^"]*rounded-full/);
  });

  it('verifies CropTabs device selectors and quick nudge buttons are rounded-full', () => {
    const cropTabsPath = path.resolve('src/components/CropTabs.astro');
    const content = fs.readFileSync(cropTabsPath, 'utf-8');

    expect(content).toContain('rounded-full');
  });

  it('verifies RepositionControls d-pad and zoom buttons are curved', () => {
    const repoPath = path.resolve('src/components/RepositionControls.astro');
    const content = fs.readFileSync(repoPath, 'utf-8');

    expect(content).toContain('rounded-full');
  });

  it('verifies CanvasStage empty upload triggers are rounded-full', () => {
    const stagePath = path.resolve('src/components/CanvasStage.astro');
    const content = fs.readFileSync(stagePath, 'utf-8');

    expect(content).toMatch(/id="browse-btn"[^>]*class="[^"]*rounded-full/);
  });
});
