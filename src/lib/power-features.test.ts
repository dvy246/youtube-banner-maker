import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { defaultScene, cloneScene, type Scene } from './scene';

describe('Power Features & Desktop UX (Undo/Redo, Shortcuts, Toast, Clipboard)', () => {
  const resizerPath = path.resolve('dist/tools/youtube-banner-resizer/index.html');
  const makerPath = path.resolve('dist/tools/youtube-banner-maker/index.html');

  it('verifies built HTML includes action toolbar with undo, redo, and shortcuts modal hooks', () => {
    expect(fs.existsSync(resizerPath)).toBe(true);
    const html = fs.readFileSync(resizerPath, 'utf-8');

    expect(html).toContain('id="btn-undo"');
    expect(html).toContain('id="btn-redo"');
    expect(html).toContain('id="btn-shortcuts"');
    expect(html).toContain('id="shortcuts-modal"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
  });

  it('verifies built HTML includes toast notification container with aria-live accessibility', () => {
    const html = fs.readFileSync(resizerPath, 'utf-8');

    expect(html).toContain('id="tool-toast"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it('verifies built HTML includes copy to clipboard button in export panel', () => {
    const html = fs.readFileSync(resizerPath, 'utf-8');

    expect(html).toContain('id="copy-clipboard-button"');
    expect(html).toContain('Copy to Clipboard');
  });

  it('verifies maker door also includes toolbar, toast, and copy button', () => {
    expect(fs.existsSync(makerPath)).toBe(true);
    const html = fs.readFileSync(makerPath, 'utf-8');

    expect(html).toContain('id="btn-undo"');
    expect(html).toContain('id="btn-redo"');
    expect(html).toContain('id="tool-toast"');
    expect(html).toContain('id="copy-clipboard-button"');
  });

  it('maintains deep immutability across scene cloning for undo/redo history', () => {
    const scene1 = defaultScene();
    scene1.background = { type: 'solid', color: '#112233' };

    const undoStack: Scene[] = [];
    undoStack.push(cloneScene(scene1));

    // Mutate scene
    const scene2 = cloneScene(scene1);
    scene2.background = { type: 'solid', color: '#FFFFFF' };

    expect(undoStack[0].background).toEqual({ type: 'solid', color: '#112233' });
    expect(scene2.background).toEqual({ type: 'solid', color: '#FFFFFF' });
  });
});
