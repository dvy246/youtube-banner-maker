import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { AESTHETIC_BACKGROUNDS, AESTHETIC_CATEGORIES } from "../data/backgrounds";
import { TEMPLATES } from "../data/templates";

describe("Aesthetic Backgrounds Integrity & De-Duplication Verification", () => {
  const allowedCategories = AESTHETIC_CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);
  const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  it("has at least 80 curated studio-grade aesthetic backgrounds", () => {
    expect(AESTHETIC_BACKGROUNDS.length).toBeGreaterThanOrEqual(80);
  });

  it("guarantees 100% unique background IDs across the catalog", () => {
    const idSet = new Set<string>();
    const duplicateIds: string[] = [];

    for (const bg of AESTHETIC_BACKGROUNDS) {
      if (idSet.has(bg.id)) {
        duplicateIds.push(bg.id);
      }
      idSet.add(bg.id);
    }

    expect(duplicateIds, `Found duplicate background IDs: ${duplicateIds.join(", ")}`).toEqual([]);
    expect(idSet.size).toBe(AESTHETIC_BACKGROUNDS.length);
  });

  it("guarantees 100% unique asset src paths across the catalog", () => {
    const srcSet = new Set<string>();
    const duplicateSrcs: string[] = [];

    for (const bg of AESTHETIC_BACKGROUNDS) {
      if (srcSet.has(bg.src)) {
        duplicateSrcs.push(bg.src);
      }
      srcSet.add(bg.src);
    }

    expect(duplicateSrcs, `Found duplicate background src paths: ${duplicateSrcs.join(", ")}`).toEqual([]);
    expect(srcSet.size).toBe(AESTHETIC_BACKGROUNDS.length);
  });

  it("validates schema fields, categories, and typography harmony colors", () => {
    for (const bg of AESTHETIC_BACKGROUNDS) {
      expect(bg.id, `Invalid ID for ${bg.id}`).toMatch(/^[a-z0-9-]+$/);
      expect(bg.name.trim().length, `Empty name for ${bg.id}`).toBeGreaterThan(0);
      expect(bg.description.trim().length, `Empty description for ${bg.id}`).toBeGreaterThan(0);
      expect(allowedCategories, `Invalid category "${bg.category}" for ${bg.id}`).toContain(bg.category);
      expect(bg.categoryLabel.trim().length, `Empty categoryLabel for ${bg.id}`).toBeGreaterThan(0);
      expect(bg.defaultTitle.trim().length, `Empty defaultTitle for ${bg.id}`).toBeGreaterThan(0);
      expect(bg.defaultTagline.trim().length, `Empty defaultTagline for ${bg.id}`).toBeGreaterThan(0);

      // Harmony colors
      expect(bg.harmony.titleColor, `Invalid titleColor for ${bg.id}`).toMatch(hexColorRegex);
      expect(bg.harmony.taglineColor, `Invalid taglineColor for ${bg.id}`).toMatch(hexColorRegex);
      expect(bg.harmony.frameBorderColor, `Invalid frameBorderColor for ${bg.id}`).toMatch(hexColorRegex);

      // Tags
      expect(bg.tags.length, `Too few tags for ${bg.id}`).toBeGreaterThanOrEqual(3);
      for (const tag of bg.tags) {
        expect(tag.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("verifies all referenced background files exist in public/ directory", () => {
    for (const bg of AESTHETIC_BACKGROUNDS) {
      const filePath = path.resolve("public" + bg.src);
      expect(fs.existsSync(filePath), `Missing asset file on disk: ${filePath} (id: ${bg.id})`).toBe(true);
    }
  });

  it("verifies all raster background assets are exact studio 2560x1440 resolution", async () => {
    for (const bg of AESTHETIC_BACKGROUNDS) {
      if (bg.src.endsWith(".svg")) continue;
      const filePath = path.resolve("public" + bg.src);
      const meta = await sharp(filePath).metadata();
      expect(meta.width, `Image ${bg.src} width is not 2560`).toBe(2560);
      expect(meta.height, `Image ${bg.src} height is not 1440`).toBe(1440);
    }
  });

  it("guarantees 100% unique binary MD5 hashes across all background image assets", () => {
    const hashes = new Map<string, string>();
    const duplicateFiles: { file1: string; file2: string; hash: string }[] = [];

    for (const bg of AESTHETIC_BACKGROUNDS) {
      const filePath = path.resolve("public" + bg.src);
      const buffer = fs.readFileSync(filePath);
      const md5 = crypto.createHash("md5").update(buffer).digest("hex");

      if (hashes.has(md5)) {
        duplicateFiles.push({ file1: hashes.get(md5) ?? "", file2: bg.src, hash: md5 });
      } else {
        hashes.set(md5, bg.src);
      }
    }

    expect(duplicateFiles, `Found identical binary duplicate background files: ${JSON.stringify(duplicateFiles)}`).toEqual([]);
  });

  it("guarantees all 121 template JSON manifests have unique IDs", () => {
    const templateIds = new Set<string>();
    const duplicates: string[] = [];

    for (const tmpl of TEMPLATES) {
      if (templateIds.has(tmpl.id)) {
        duplicates.push(tmpl.id);
      }
      templateIds.add(tmpl.id);
    }

    expect(duplicates, `Found duplicate template IDs: ${duplicates.join(", ")}`).toEqual([]);
    expect(templateIds.size).toBe(TEMPLATES.length);
  });
});
