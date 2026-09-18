import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getTemplate } from "../src/lib/template";
import { FONTS } from "../src/lib/fonts";
import { measureCrossStitchWidth, drawCrossStitchText } from "../src/lib/cross-stitch";
import { AESTHETIC_BACKGROUNDS } from "../src/data/backgrounds";

describe("Pastoral Retro Meadow Banner & Cross-Stitch Customization", () => {
  it("loads vlog-pastoral-retro template correctly", () => {
    const tmpl = getTemplate("vlog-pastoral-retro");
    expect(tmpl).toBeDefined();
    expect(tmpl?.name).toBe("Pastoral Meadow");
    expect(tmpl?.niche).toBe("vlog");
    expect(tmpl?.scene.background.type).toBe("image");
    expect(tmpl?.scene.background.src).toBe("/backgrounds/retro-lofi-pastoral-hillside-girl.jpg");

    // Title layer uses cross-stitch-400 font
    const titleLayer = tmpl?.scene.layers.find((l) => l.id === "title");
    expect(titleLayer).toBeDefined();
    expect((titleLayer as any)?.font).toBe("cross-stitch-400");
    expect((titleLayer as any)?.text).toBe("ashanviii");
  });

  it("has both girl and guy sitting backgrounds registered and present on disk", () => {
    const girlBg = AESTHETIC_BACKGROUNDS.find((b) => b.id === "retro-lofi-pastoral-hillside-girl");
    const guyBg = AESTHETIC_BACKGROUNDS.find((b) => b.id === "retro-lofi-pastoral-hillside-guy");

    expect(girlBg).toBeDefined();
    expect(guyBg).toBeDefined();

    expect(girlBg?.category).toBe("anime");
    expect(guyBg?.category).toBe("anime");

    const girlPath = path.resolve("public", girlBg!.src.replace(/^\//, ""));
    const guyPath = path.resolve("public", guyBg!.src.replace(/^\//, ""));

    expect(fs.existsSync(girlPath), "Girl background image missing").toBe(true);
    expect(fs.existsSync(guyPath), "Guy background image missing").toBe(true);
  });

  it("renders cross-stitch embroidery text accurately and measures width", () => {
    expect(FONTS["cross-stitch-400"]).toBeDefined();
    expect(FONTS["cross-stitch-400"].family).toBe("Cross Stitch");

    const widthDefault = measureCrossStitchWidth("ashanviii", 52);
    expect(widthDefault).toBeGreaterThan(200);
    expect(widthDefault).toBeLessThan(600);

    const widthCustom = measureCrossStitchWidth("MY CHANNEL", 52);
    expect(widthCustom).toBeGreaterThan(0);

    // Test canvas drawing without throwing
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      shadowColor: "",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      lineWidth: 0,
      lineCap: "",
      strokeStyle: "",
    } as unknown as CanvasRenderingContext2D;

    expect(() => {
      drawCrossStitchText(mockCtx, "ashanviii", 1280, 630, 52, "#FFFFFF", "center");
    }).not.toThrow();

    expect(() => {
      drawCrossStitchText(mockCtx, "CUSTOM NAME 2026", 1280, 630, 48, "#FEF3C7", "center");
    }).not.toThrow();
  });

  it("verifies preview SVG exists and contains cross-stitch needlepoint elements", () => {
    const previewFile = path.resolve("public/previews/vlog-pastoral-retro.svg");
    expect(fs.existsSync(previewFile)).toBe(true);

    const svgContent = fs.readFileSync(previewFile, "utf-8");
    expect(svgContent).toContain("<svg");
    expect(svgContent).toContain("data:image/jpeg;base64,");
    expect(svgContent).toContain('stroke-linecap="round"');
    expect(svgContent).toContain('filter="url(#stitch-shadow)"');
  });

  it("verifies MakeControls includes the Pastoral Character Switcher and 1-Click Plates", () => {
    const makeControlsPath = path.resolve("src/components/MakeControls.astro");
    const content = fs.readFileSync(makeControlsPath, "utf-8");

    // Character switcher
    expect(content).toContain('id="pastoral-character-control"');
    expect(content).toContain('id="pastoral-char-girl-btn"');
    expect(content).toContain('id="pastoral-char-guy-btn"');
    expect(content).toContain('rounded-full');
    expect(content).toContain('active:scale-[0.98]');

    // 1-Click wallpaper plates
    expect(content).toContain('data-bg-src="/backgrounds/retro-lofi-pastoral-hillside-girl.jpg"');
    expect(content).toContain('data-bg-src="/backgrounds/retro-lofi-pastoral-hillside-guy.jpg"');

    // Cross-stitch font pairing chip
    expect(content).toContain('data-font-title="cross-stitch-400"');
  });
});
