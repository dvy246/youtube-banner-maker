# Build Plan
## YTBannerStudio.com

**Version 1.0 · Companion to PRD.md and ARCHITECTURE.md · Date: 2026-09-05**

`PRD.md` defines *what* and *why*. `ARCHITECTURE.md` defines *how*, technically. This document defines *in what order*, *with what gates*, and *how we know each stage is done*.

Everything here is scoped to a small team (1–2 engineers plus a designer for template authoring). Stage durations are given in working days as estimates, not commitments; the gates are the real contract.

---

## 0. Plan Summary

| Stage | Name | Output | Gate |
|---|---|---|---|
| **0** | Pre-build verification | Verified constants, go/no-go | Multi-channel `fcrop64` confirms fractions |
| **1** | Engine core | `spec/scene/render` + tests | Golden-image render matches at all four device crops |
| **2** | Fix door (the wedge) | `/tools/youtube-banner-resizer` shipped | Upload → reposition → validated export in < 60 s |
| **3** | Acquisition content | Size guide + safe-area guide | Both indexed, zero client JS, LCP < 0.8 s |
| **4** | Check door | `/tools/youtube-banner-checker` | Verdicts plain-language, handoff to Fix works |
| **5** | Template system | Schema + validator + 24 templates | CI safe-rect gate passes on all 24 |
| **6** | Create door | `/tools/youtube-banner-maker` | Template → edit → export, safe by construction |
| **7** | Measurement & polish | Analytics, a11y, perf, SEO completeness | All budgets green in CI |
| **8** | Launch | Public | Validation experiment running |

**Critical ordering decision:** Fix door ships *before* Create door. Rationale in §2.

---

## 1. Stage 0 — Pre-Build Verification (Gate Zero)

**Do not write product code until this passes.** The whole architecture rests on the measured `fcrop64` fractions, and those were observed on **one channel**. If they are per-channel rather than global, the core model changes.

### Tasks

| # | Task | Method |
|---|---|---|
| 0.1 | Verify device crop fractions across ≥ 8 diverse channels | Fetch each channel page, extract `yt3.googleusercontent.com` banner URLs, decode every `fcrop64` param, compare the decoded rectangles against `DEVICES` in `spec.ts` |
| 0.2 | Confirm the served width ladder | Record which `w####` variants appear across those channels |
| 0.3 | Re-measure the JPEG re-encode budget | Request several channels' `w1707` desktop slices with `Accept: image/webp`; record `content-type` and `content-length` |
| 0.4 | Confirm the 6 MB upload cap and safe-area figures are still current | Re-fetch `support.google.com/youtube/answer/10456525` |
| 0.5 | Verify `ytbannerstudio.com` registrability | DNS + registrar check; register if available |
| 0.6 | Re-attempt Canva verification | If reachable, record actual capabilities; if still 403, keep the UNVERIFIED marker in PRD |

### Gate 0 — pass criteria

- **PASS** if the four device rectangles are identical (within rounding) across ≥ 8 channels → `spec.ts` constants are global. Proceed.
- **CONDITIONAL** if the rectangles vary but only in a bounded way (e.g. two variants) → model becomes a small set of profiles; adjust `DEVICES` to a union of observed rects and validate against the *most restrictive*. Proceed with a note in PRD §37.
- **FAIL / STOP** if crops appear arbitrary per channel → the "verifiable per-device crop" differentiator collapses. Return to PRD §5 and re-decide direction before writing code.

**Output artifact:** `docs/verification/fcrop-survey.md` — table of channel → decoded rects → match/mismatch. This is the evidence file behind the product's central claim, and it must exist.

*Estimate: 1–2 days.*

---

## 2. Why Fix Ships Before Create

This is the single most consequential sequencing decision, so it is stated explicitly rather than buried.

1. **The wedge is correctness, not creation.** PRD research found that "no-signup safe-area maker with device preview" is already shipped by banner.yt, CollabPals, and basetoolbox. Leading with another maker enters a commoditized fight on day one.
2. **The Fix door is the cheapest complete product.** It needs the engine, cover-fit, repositioning, device preview, validation, and export — but *no template system, no font curation, no design authoring*. It is roughly half the build for the whole differentiator.
3. **It matches the winnable search intent.** Size/fit/crop/resize queries are dominated by small tools and blogs (winnable); template queries are dominated by Canva/Adobe/Kapwing/PosterMyWall (not winnable). The Fix door plus the size guide attacks the winnable half.
4. **It validates the riskiest assumption first** — that people will trust a browser tool with an image and act on a verdict. If they won't, 24 hand-authored templates would be sunk cost.
5. **It is a real product on its own.** If everything after Stage 4 were cancelled, Fix + Check + guides is still a shippable, useful, differentiated utility.

Create is Stage 6, not Stage 2, because it is the *most* expensive stage (template authoring is design labour) and the *least* differentiating in isolation.

---

## 3. Stage 1 — Engine Core

Build the pure, testable heart. No UI. No Astro pages yet. Just modules and tests.

### Tasks

| # | Task | File |
|---|---|---|
| 1.1 | Scaffold Astro + Tailwind + TS strict + Vitest | repo root |
| 1.2 | Write the verified constants | `src/lib/spec.ts` |
| 1.3 | Scene types + serialize/deserialize + default | `src/lib/scene.ts` |
| 1.4 | Renderer: background solid/gradient, shapes, text | `src/lib/render.ts` |
| 1.5 | Cover-fit + zoom clamp + offset clamp | `src/lib/render.ts` |
| 1.6 | Device crop extraction from the single canvas | `src/lib/render.ts` |
| 1.7 | Unit tests for all fraction math and clamps | `src/lib/*.test.ts` |
| 1.8 | Golden-image harness (render known scene, compare) | `test/golden/` |

### Gate 1 — pass criteria

- `renderExport` produces exactly 2560×1440 with `colorSpace: 'srgb'`.
- The safe rect computed from `SAFE` fractions equals **1235×338 at 2048×1152** and **1546×423 at 2560×1440** — assert both in a test. If this test fails, the fraction constants are wrong.
- Cover-fit invariant holds under fuzz: for any source dimensions and any legal `zoom`/`offset`, the drawn image fully covers the canvas (no transparent gap at any edge).
- `zoom` never permits upscaling past 1:1 source pixels.
- All four device crops are cuts of the *same* rendered canvas — verified by asserting pixel equality between a device crop and the corresponding sub-rectangle of the full render.

*Estimate: 4–6 days.*

---

## 4. Stage 2 — Fix Door (the wedge)

`/tools/youtube-banner-resizer`. Ships the differentiator.

### Tasks

| # | Task | Depends on |
|---|---|---|
| 2.1 | `ToolShell.astro` layout (canvas + controls + device tabs + verdicts region) | 1.4 |
| 2.2 | `tool.ts` island: init, scene wiring, rAF-debounced preview | 1.3, 1.4 |
| 2.3 | Upload: file input + drag-drop + `image.decode()` + oversize guard | 2.2 |
| 2.4 | Repositioning: pointer drag + zoom, with arrow-key/`+`/`-` fallback | 1.5 |
| 2.5 | Four device preview canvases (TV / Desktop / Tablet / Mobile) | 1.6 |
| 2.6 | `validate.ts`: safe-rect overflow, resolution, file-size checks | 1.2 |
| 2.7 | Verdict UI: plain language, direction-to-fix, `aria-live` | 2.6 |
| 2.8 | `simulate.ts`: re-encode simulation with honest labelling | 1.2 |
| 2.9 | `export.ts`: format select, `blob.type` verification, 6 MB budget search, quality floor | 1.4 |
| 2.10 | `sessionStorage` persistence + the base64/re-upload handling for source images | 1.3 |

### Gate 2 — pass criteria

- **The 60-second test:** a first-time user on a mid-tier phone can land on the page, upload an image, see what gets cut on mobile, fix it, and download a valid 2560×1440 file — in under 60 seconds, with no account and no watermark.
- Every export is 2560×1440, sRGB, ≤ 6 MB, with the actual `blob.type` reported honestly (and the filename extension matching it).
- Zero bytes of user image data leave the device — verified by inspecting the network panel across a full session.
- The re-encode simulation is labelled "approximate" everywhere it appears. Grep the codebase for the strings `no quality loss`, `lossless`, `pixel perfect` — must return zero hits in user-facing copy.
- Tool-page JS ≤ 65 KB gzip. CI enforces.
- Keyboard-only operation completes the full flow.

*Estimate: 8–12 days.*

---

## 5. Stage 3 — Acquisition Content

Two zero-JS pages that are the SEO head. These are cheap and should ship alongside Stage 2, not after it, so the tool has entry traffic from day one.

### Tasks

| # | Task |
|---|---|
| 3.1 | `/guides/youtube-banner-size` — the authoritative page: 2560×1440, 2048×1152 minimum, 6 MB, and the **device crop table generated from `spec.ts`** |
| 3.2 | `/guides/youtube-banner-safe-area` — the 1235×338 == 1546×423 reconciliation, with the arithmetic shown |
| 3.3 | Content collections + frontmatter + JSON-LD (FAQPage on the size guide, BreadcrumbList on both) |
| 3.4 | Canonicals, OG tags, sitemap, robots.txt |
| 3.5 | Internal links: guides → Fix door with intent-matched CTAs |

**The content differentiator:** every other size guide restates Google's numbers. Ours shows the *actual measured device crops* and reconciles the two conflicting safe-area figures the whole market repeats as if they were different rules. The spec table is generated from `spec.ts` so the guide can never drift from the engine.

### Gate 3 — pass criteria

- Both pages emit **zero** client JavaScript (verify the built HTML contains no `<script type="module">`).
- LCP < 0.8 s on a throttled mid-tier mobile profile.
- CLS < 0.1 (fonts preloaded, images have intrinsic dimensions).
- Schema validates against Google's Rich Results test.
- The device table on the size guide is generated from `spec.ts`, not hand-typed — verified by changing a constant and seeing the page change.

*Estimate: 3–4 days, parallel with Stage 2.*

---

## 6. Stage 4 — Check Door

`/tools/youtube-banner-checker`. Mostly reuses Stage 2 machinery.

### Tasks

| # | Task |
|---|---|
| 4.1 | Check-mode entry: upload → immediate validation, no editing chrome |
| 4.2 | Verdict report: per-device, ranked by severity, each with one concrete fix |
| 4.3 | "Fix it" handoff → write scene to `sessionStorage` → navigate to Fix door |
| 4.4 | Cache-delay advisory ("new banner may take up to 24 h to appear" — the `max-age=86400` explanation) |
| 4.5 | Low-resolution and file-size diagnostics with plain-language causes |

### Gate 4 — pass criteria

- Round-trip works: Check → "Fix it" → Fix door opens with the same image and the same problem pre-selected, across a **full page load** (not a client-side route).
- Every verdict names the device, the specific problem, and one action. No verdict says only "text is outside the safe area" without saying which direction to move.
- The tool never reports a false "all good" for a banner whose title provably crosses the safe rect — covered by a fixture set of deliberately-broken banners.

*Estimate: 3–5 days.*

---

## 7. Stage 5 — Template System (schema + validator before art)

Build the machinery and the CI gate **before** commissioning 24 designs. Authoring against an unvalidated schema produces 24 files that need rework.

### Tasks

| # | Task |
|---|---|
| 5.1 | Template JSON schema + `template.ts` (manifest → scene) |
| 5.2 | `scripts/validate-templates.mjs`: safe-rect compliance, structural uniqueness, schema validity, editable/protected disjointness |
| 5.3 | Wire the validator into `prebuild` and CI as a **hard build failure** |
| 5.4 | `fonts.ts`: curate ≤ 6 families, subset, self-host WOFF2, preload; `ensureFontLoaded` gate for `measureText` |
| 5.5 | Author 3 pilot templates; run them through the validator; fix the schema based on what breaks |
| 5.6 | Author the remaining ~21 across niches (gaming, tech, vlog, education, music, minimal, aesthetic, business) |
| 5.7 | Generate optimized gallery previews at build time |

### Gate 5 — pass criteria

- `node scripts/validate-templates.mjs` passes on all 24, and **fails the build** when a deliberately-broken template is introduced (test the gate itself, not just its output).
- Structural uniqueness: no two templates in a niche differ only by colour. The validator's hash must catch a colour-only clone.
- Every template's title and tagline sit fully inside the safe rect at their authored size, measured with the real loaded font.
- Each niche page has ≥ 3 distinct templates, or the niche page is not emitted and is excluded from the sitemap (thin-content guard).
- Total template payload ≤ ~30 KB; font payload ≤ ~40 KB.

**Note on quality:** the validator guarantees *correctness*, not *beauty*. The design bar — "aesthetic, professional, customizable" as the second differentiator — is a human review, not a script. Budget a design review pass where each template is judged against the question: *would a creator ship this without editing it?* Templates that fail that question get cut, not shipped to pad the count. Twelve good templates beat twenty-four filler ones.

*Estimate: 10–15 days, most of it design labour and reviewable in parallel with Stage 6 engineering.*

---

## 8. Stage 6 — Create Door

`/tools/youtube-banner-maker`. The third door, now cheap because the engine and templates exist.

### Tasks

| # | Task |
|---|---|
| 6.1 | Template gallery entry (`?template=` preset) |
| 6.2 | Editing constrained to `editable` roles; `protected` composition locked |
| 6.3 | Text editing with live safe-rect validation on every keystroke (debounced) |
| 6.4 | Background swap: solid / gradient / user photo (reuses Stage 2 cover-fit) |
| 6.5 | `/templates` hub + `/templates/[niche]` category pages (static, zero JS) |
| 6.6 | Cross-door handoff from Create → Check |

### Gate 6 — pass criteria

- A user can go template → change name → change colour → export a correct banner in under 60 seconds.
- It is **not possible** to drag a `safeAreaConstrained` layer out of the safe rect without receiving a verdict. (Safe by construction, then safe by feedback.)
- Editing a template never breaks its composition — `protected` elements are not mutable through the UI.
- Category pages emit zero client JS and carry real descriptive copy.

*Estimate: 6–8 days.*

---

## 9. Stage 7 — Measurement, Accessibility, Performance, SEO

### Tasks

| # | Task |
|---|---|
| 7.1 | Cookieless first-party analytics; funnel events only (`template_selected`, `editor_start`, `upload`, `validation_run`, `export_start`, `export_success`, `activation`, `re_export`) |
| 7.2 | Confirm no image bytes and no content strings are ever in an event payload |
| 7.3 | Full keyboard pass; screen-reader pass on verdicts (`aria-live`) |
| 7.4 | Contrast audit; icon+text+colour for every status |
| 7.5 | `prefers-reduced-motion` honoured |
| 7.6 | CI budget gates: JS size, Lighthouse LCP/CLS/INP |
| 7.7 | Security headers via `_headers`: CSP, `nosniff`, `Referrer-Policy`, `frame-ancestors 'none'` |
| 7.8 | SEO completeness sweep: canonicals, hreflang stubs, OG images, sitemap correctness |

### Gate 7 — pass criteria

- CI fails on any budget regression (prove it by pushing a deliberate 20 KB bloat and watching the build go red).
- Screen-reader user can complete the Check flow and understand every verdict without seeing the canvas.
- CSP blocks all third-party script origins; `img-src` permits only `'self' blob: data:`.
- No analytics event contains user text or image data.

*Estimate: 4–6 days.*

---

## 10. Stage 8 — Launch & Validation

### Launch scope

**US / English only.** France is deferred to phase 2 (`/fr/` subdirectory, hreflang, single domain). Rationale: US/UK opportunity bands are an order of magnitude larger on the winnable head term, and the French evidence is a keyword-band table with no SERP verification — that is not enough to justify localisation cost at launch.

### The validation experiment

Ship **Fix door + size guide** and measure a single number: **the share of visitors who upload an image and then export a corrected one.**

- If that share is healthy, the correctness thesis holds and the template investment is justified.
- If people arrive, read, and leave without uploading, the problem is trust or comprehension — fix the landing explanation before adding features.
- If people upload but never export, the fix loop is failing — that is an interaction problem, not a positioning one.

This is deliberately one metric, not a dashboard. Everything else is diagnostic.

### Post-launch order of operations

1. Watch the upload → export conversion for a meaningful sample.
2. Only then decide whether Stage 5/6 scope grows (more templates) or the Fix loop gets deepened.
3. Revisit France with real SERP data, not the band table.

---

## 11. What Is Explicitly Not in This Plan

| Not doing | Why |
|---|---|
| Accounts, saved projects, cloud storage | Violates the no-login principle; adds a backend the product does not need |
| AI generation | Unproven value here, heavy cost, and it would undermine the correctness positioning |
| Watermarks, download quotas, email gates | These are the exact frictions the product is positioned against |
| A mobile app | The static site is PWA-capable; native is unjustified |
| Multi-platform banners (Twitch, X, LinkedIn) | Scope discipline. Revisit only after the YouTube case is proven |
| Server-side image processing | Nothing needs to leave the device, and keeping it that way is a feature |
| A client-side router | Would turn the MPA into an SPA and forfeit the zero-JS content pages |

---

## 12. Risk Register (plan-level)

| Risk | Impact | Mitigation | Owner stage |
|---|---|---|---|
| `fcrop64` fractions are per-channel, not global | **Critical** — kills the core differentiator | Gate 0 survey across ≥ 8 channels before any product code | Stage 0 |
| Re-encode budget varies widely | Medium — simulation looks wrong | Label as approximate; treat the constant as typical, never as a promise | Stage 2 |
| Templates ship correct but ugly | High — loses the second differentiator | Human design review with a cut bar; ship fewer, better | Stage 5 |
| A big platform adds a device-crop preview | High | Depth of correctness + honesty is hard to copy shallowly; keep the guides authoritative | Ongoing |
| Tool-page JS creeps past budget | Medium — kills the speed advantage | Hard CI gate from Stage 2 onward, not added at the end | Stage 2 |
| `measureText` runs before fonts load → wrong verdicts | Medium — false "all good" | `ensureFontLoaded` gate; fixture test with a slow-loading font | Stage 5 |
| Source image lost on cross-door navigation | Medium — broken handoff | Base64 under ~3 MB, else an explicit re-upload prompt; never fail silently | Stage 4 |
| No traffic (SEO doesn't land) | High | Guides ship with Stage 2, not after; measure indexation early | Stage 3 |

---

## 13. Definition of Done (whole project, v1)

The product is done when all of the following are true simultaneously:

1. All three doors work and hand off to each other correctly across full page loads.
2. Every export is 2560×1440, sRGB, ≤ 6 MB, with the true `blob.type` reported.
3. No user image data ever leaves the browser, verified in the network panel.
4. All 24 (or fewer, if cut for quality) templates pass the CI safe-rect gate, and the gate itself is proven to fail on a broken template.
5. Content pages ship zero client JS; tool pages stay within the 65 KB gzip budget; both enforced in CI.
6. The full flow is completable by keyboard alone and comprehensible by screen reader.
7. No user-facing copy promises "no quality loss," and the re-encode simulation is labelled approximate everywhere.
8. The size guide's device table is generated from `spec.ts`, so documentation cannot drift from behaviour.
9. `docs/verification/fcrop-survey.md` exists and supports the product's central claim with real measurements.

---

## 14. Rough Sequencing

```
Week 1        Stage 0 (verify)  ──► Stage 1 (engine)
Week 2–3      Stage 2 (Fix door)  ║  Stage 3 (guides, parallel)
Week 4        Stage 4 (Check door)
Week 4–6      Stage 5 (templates: schema+validator first, then art)
Week 6–7      Stage 6 (Create door)
Week 7–8      Stage 7 (measurement, a11y, perf, SEO)
Week 8        Stage 8 (launch + validation experiment)
```

A shippable product exists at the end of Week 3 (Fix + guides). Everything after that increases surface area, not viability. That is the point of the ordering: if the plan is cut short at any stage boundary from 2 onward, what has shipped is still coherent and still useful.

---

*End of PLAN.md*
