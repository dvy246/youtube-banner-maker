# Product Requirements Document
## YTBannerStudio.com
A free, browser-first YouTube banner utility that tells the truth about what YouTube will do to your image.

**Version 1.0 · Status: Draft for build approval · Date: 2026-09-05**

---

## 1. Executive Summary

YTBannerStudio.com is a free, no-account, browser-first utility for creating, fixing, and verifying YouTube channel banners. It does one job: get a correct, professional-looking banner onto a channel without the pain that the entire category currently inflicts.

The market splits into two camps, and both fail the user:

- **Design platforms** (Canva, Adobe Express, VistaCreate, Picsart, Snappa, PosterMyWall, Kapwing) give users beautiful templates but demand an account, gate export behind subscriptions, and — critically — hand users a 2560×1440 canvas without enforcing the device-crop constraint that actually governs the outcome. Text that was perfectly placed at full-frame gets cut off on desktop and mobile. This is the single most reported failure in the supplied Reddit evidence (r/canva threads *1gsbc38*, *1jaiql2*; r/NewTubers *1pwhmoq*).
- **Micro-tools** (banner.yt, CollabPals, BaseToolbox, CleverUtils, ImResizer) give users correct geometry with no account and no paywall, but their output is a gradient background with two text lines. They do not produce a designed-looking banner. They also do not tell the user whether the result will survive YouTube's upload pipeline.

Neither camp provides **design quality × correct composition × honest upload-outcome simulation**. That intersection is empty, and it is the product.

**The core promise:** *See exactly what YouTube will cut — before you upload.* The product enforces the safe area as a hard constraint (not a footnote), simulates the real crop geometry and JPEG re-encode that YouTube applies server-side, validates the export against YouTube's technical spec, and tells the user plainly that YouTube will re-compress the image so they stop chasing export settings that cannot fix it.

**Launch market:** United States / English. Phase 2: France.

**Defensibility:** No single moat. Defensibility compounds from (1) verified-correctness reputation, (2) a curated, geometry-safe template library, and (3) topical authority on the size/fit/crop/quality cluster — the SERP the platforms do not hold. The micro-tools already match speed and zero-friction; those are entry requirements, not differentiators.

**MVP is small by design:** one canvas model, three entry doors (Fix / Create / Check), ~24 templates, ~30 functional requirements. No backend. No database. No auth. No AI generation. ~65 KB of client-side JavaScript, no UI framework.

---

## 2. Product Thesis

### 2.1 The Sharp Problem

YouTube banners are uploaded at **2560×1440** (recommended) but are **cropped and re-encoded server-side** so that what a creator designed is not what viewers see. The failures are structural, not user error:

- The **desktop slice** keeps only **29.42% of the image height** (measured: `fcrop64` rect of fraction 1.0 × 0.2942).
- The official **safe area (1235×338 @ 2048×1152)** is the same rectangle as the community "mobile safe" figure (**1546×423 @ 2560×1440**) — 60.3% × 29.3% of frame — yet the market describes them as two different rules.
- YouTube **re-encodes to JPEG** at served widths from w1060 to w2560. A w1707 slice was measured at **134 KB**; the full-width desktop slice at **263 KB**. No client-side export setting can prevent this.
- YouTube's banner CDN serves with **`cache-control: public, max-age=86400`**; a failed update is often the CDN, not the upload (r/NewTubers *lnljvx*).

### 2.2 The Product Hypothesis

A creator does not want a design platform. A creator, most of the time, **already has an image** or wants to look professional without learning design. What they need is:

1. To get a banner that is **correct** on every device.
2. To get it **fast**, without an account.
3. To have it look **designed**, not like gradient text.
4. To know **before uploading** whether it will break.

### 2.3 The Falsifiable Position

The differentiating claim must be checkable. "Free templates" and "safe-zone overlay" are not checkable by the user. This claim is: **"What this tool shows you on the TV/Desktop/Tablet/Mobile tabs is what YouTube will actually cut — verify it by uploading."** If the simulation is wrong, the user finds out instantly and the product loses its one reason to exist. That is the correct kind of risk to take.

### 2.4 Direction Chosen — and Why Not Alternatives

| Option | Verdict | Rationale |
|---|---|---|
| A. Pure maker | **Reject as primary** | "No-signup safe-area maker with device preview" already ships at banner.yt and CollabPals. Building it produces a fourth clone. |
| B. Resizer only | **Reject** | Nadir of differentiation. CleverUtils etc. do this with fixed center crop; and "resize to exact spec" is *how the r/youtubers *w92t7x* user got a distorted result*. |
| C. Optimizer only | **Reject** | "Quality optimizer" invites a promise we cannot keep — the re-encode is server-side. |
| D. Checker only | **Reject as primary** | Diagnosis without creation is half the job; would also be the thinnest standalone SEO surface. |
| E. Kitchen-sink combine | **Reject** | Feature creep. The prescribed anti-goal ("do not turn this into a Canva clone") forbids it. |
| **F. Correctness-first utility, three doors** | **SELECTED** | One canvas model, three entry doors (Fix / Create / Check), one fraction-based crop engine. Fixes the reported failures at the root and produces output the micro-tools cannot. |

---

## 3. Problem Definition

### 3.1 The User's Real Problem

The user's problem is **not** "I can't design." It is: **"I made/uploaded a banner and YouTube broke it."** The dominant failure sequence across the supplied evidence:

1. User creates a banner at a sensible size (2560×1440, or whatever their tool suggested).
2. User places content across the full canvas, because that is what a canvas is for and their tool showed no constraint.
3. User uploads. Desktop and mobile cut the top/bottom; text is gone.
4. User tries to fix by re-exporting, changing size, or hunting a "resizer."
5. User's banner is now distorted (from blind resize), blurry (from re-encode), or still cut off (because they resized, not repositioned).

This is not one bug. It is **four coupled gaps** in the category.

### 3.2 Four Gaps, Mapped to Evidence

| # | Gap | Evidence (Reddit) | Mechanism |
|---|---|---|---|
| G1 | **No enforcement of the device crop** | r/canva *1gsbc38*, *1jaiql2*; r/NewTubers *1pwhmoq*; r/youtubers *w92t7x* | Platforms hand out a canvas; nobody constrains content to the safe rect. |
| G2 | **No honest upload-quality simulation** | r/NewTubers *1uux1qr*, r/photoshop *iivzt4*, *sdubqu*, *88ahzy* | YouTube re-encodes server-side; no tool previews the re-compressed result, so users blame their own export settings. |
| G3 | **No subject-aware fit for existing images** | r/NewTubers *1sxwong*; r/canva *1gsbc38* | Resizers do a fixed center crop; an off-center face or logo is destroyed with no control and no warning. |
| G4 | **"Free" is a marketing claim, not a promise** | r/NewTubers *1sxwong* | Snappa: 3 downloads/month. VistaCreate: resizer + HD download Pro-gated. |

### 3.3 The Trust Deficit

The category has trained users to distrust "free." r/NewTubers *1sxwong* verbatim: *"I can't find a free YouTube banner creator tool"* — because tools claiming free bury export behind a subscription. r/canva *1gsbc38*: *"Canva recommended size results in graphic being completely cut off."* The user is being lied to twice: about free, and about "correct size." A product that is transparently free *and* transparently correct is itself the differentiation.

---

## 4. Evidence and Research Findings

**Evidence tagging used throughout this document:**
- **FACT** — verified this session against a primary source (URL given). Facts can be relied on for build decisions.
- **OBSERVATION** — directly observed this session (e.g., fetched a page, decoded a URL parameter), but from one vantage point; may not generalize.
- **INFERENCE** — reasoning from facts/observations; reasonable but not directly verified.
- **RECOMMENDATION** — a product/strategic judgment, not a claim about the world.
- **UNVERIFIED** — could not verify this session; must be re-checked before relying on it.

### 4.1 Niche Research

#### 4.1.1 Search Demand — United States / United Kingdom (supplied Ahrefs bands)

**FACT (supplied keyword data).** Head terms are strong and the "easy difficulty" ones matter more than the absolute volume because they map to tool intent:

| Cluster | Representative keywords (US) | Volume band | Difficulty |
|---|---|---|---|
| Yield-size | `youtube banner size`, `what size is a youtube banner` | >10,000 | Easy / — |
| The product itself | `youtube banner maker`, `youtube banner creator` | >1,000 / >100 | Easy |
| Dimensions | `youtube banner dimensions`, `1024x576 youtube banner`, `2048 x 1152 youtube banner` | >1,000 | Easy |
| Templates | `youtube banner template` | >10,000 | Easy |
| Fix | `youtube banner resizer` | >100 | Easy |
| Education | `how to make a youtube banner` | >1,000 | Hard |

**INFERENCE.** The `youtube banner size` cluster is the strategic prize. It carries the largest volume band, the "Easy" difficulty flag, and maps to research/comparison intent that a utilitarian tool page can own. The `youtube banner maker` cluster is smaller and dominated (per SERP observation) by Canva.

#### 4.1.2 Search Intent Map

**OBSERVATION (Bing SERP fetch, single IP — directional, not authoritative).** Ranked result composition differs sharply by query:

- `youtube banner size` → **micro-tools + blogs**: snappa.com/blog, cleverutils.com, editthispic.com, imresizer.com, vidthumb.co, basetoolbox.com, wyzowl.com, clipchamp.com.
- `youtube banner template` → **platforms**: canva.com ×2, kapwing.com, template.net, adobe.com, magnificent.com, brandcrowd.com, figma.com, postermywall.com, design.com.

**INFERENCE.** "Size / fit / crop / resize" intent is a **winnable beachhead** — held by thin tools and single-purpose blogs. "Template" intent is **platform territory** — do not try to win it head-on. This is why the product leads with size-and-correctness and treats templates as a supporting surface, not the acquisition headline. This inversion is a deliberate deviation from the initial "template-first" thesis and is evidence-driven.

#### 4.1.3 Keyword Cluster Map

```
PARENT TOPIC: YouTube channel banner
├─ SIZE / DIMENSIONS (winnable, tool intent)
│   ├─ youtube banner size (head, >10k, Easy)              → /guides/youtube-banner-size
│   ├─ youtube banner dimensions (>1k, Easy)                → /guides/youtube-banner-dimensions
│   ├─ what size is a youtube banner (>100)                 → /guides/youtube-banner-size
│   ├─ 2048 x 1152 youtube banner (>1k)                     → /guides/youtube-banner-size#minimum
│   └─ 1024x576 youtube banner (>1k)                        → /guides/youtube-banner-size#confusion (1024×576 is the OLD thumbnail spec, not banner)
├─ FIX / RESIZE (tool intent, low competition)
│   ├─ youtube banner resizer (>100, Easy)                  → /tools/youtube-banner-resizer
│   └─ youtube banner size for all devices (>100)           → /guides/youtube-banner-safe-area
├─ MAKE / CREATE (tool intent)
│   ├─ youtube banner maker (>1k, Easy)                     → /tools/youtube-banner-maker
│   └─ youtube banner creator (>100)                        → /tools/youtube-banner-maker
├─ TEMPLATES (platform-held; support only, no dedicated thin pages)
│   └─ youtube banner template (>10k, Easy)                 → /templates/*  (gated on real template count)
├─ AESTHETIC ASKING (low commercial)
│   ├─ black youtube banner (>100)                          → /templates/black
│   ├─ aesthetic youtube banner (>100)                      → /templates/aesthetic
│   └─ youtube banner background (>1k)                      → /tools/youtube-banner-maker
└─ ADJACENT FORMATS (phase 2+, not MVP)
    ├─ bannière youtube / linkedin (French)                 → /fr/
    ├─ twitch panel maker (>1k)                             → phase 3
    └─ twitter banner size (>1k)                            → phase 3
```

**Note on `1024x576`:** This is the legacy thumbnail spec, not the banner spec. Its >1,000 volume band is users confusing thumbnail and banner dimensions — a content-education opportunity, not a product feature.

#### 4.1.4 Geographic Comparison

**FACT (supplied keyword data, Ahrefs bands).**

| Market | Head term | Volume band | Tool-intent cluster size |
|---|---|---|---|
| United States | `youtube banner size` | >10,000 | large — maker / dimensions / resizer all present |
| United Kingdom | `youtube banner size` | >10,000 | large — mirrors US |
| France | `bannière youtube` | >1,000 | medium — `créer bannière youtube` family present but top term is ~1/10 of US head |

**FACT (this session).** `ytbannerstudio.com` returned no A and no NS records — the EMD appears unregistered and is available.

**INFERENCE.** US is the clear first market: the winnable head term is an order of magnitude larger than the entire French cluster, and the French evidence rests on a single supplied table with no SERP verification (see §4.8 Evidence Gaps). Population is not the criterion — **winnable tool-intent volume** is, and the US wins on both.

#### 4.1.5 Opportunity Score

Scored 1–5 against nine dimensions. **Composite: 4.2 / 5 — Build.**

| Dimension | Score | Rationale |
|---|---|---|
| Demand | 4 | Head term >10k band, Easy difficulty. |
| Competition | 4 | Platform side strong but mis-targeted; micro-tool side weak output. |
| Intent match | 5 | Size/fix/create clusters are pure tool intent. |
| User pain | 5 | Four verified structural failure gaps. |
| Monetization potential | 2 | Free-first; ad-supported at best (see §35). |
| Repeat usage | 2 | Low — one-off job. Realistic product, not a habit. |
| Technical feasibility | 5 | Pure client-side Canvas 2D; no backend. |
| Differentiation | 4 | Correctness + design-quality intersection is empty. |
| SEO defensibility | 4 | Winnable cluster; platforms don't hold it; EMD is a CTR asset, not a ranking mechanism. |

#### 4.1.6 Market-Entry Recommendation

**RECOMMENDATION.** Launch US-only, English, with a `/guides/` cluster as the acquisition head and three tool pages as the conversion surface. Treat France as phase 2 (see §30). Do not launch multi-market on MVP zero evidence for any non-US market.

#### 4.1.7 SEO Acquisition Thesis

**RECOMMENDATION.** Acquire through the informational cluster (`youtube banner size` etc.) — the SERP the platforms do not hold — and convert to the tool via the size-guide CTA. The tool pages (`/tools/youtube-banner-maker`, `/tools/youtube-banner-resizer`) capture the direct tool intent that does exist. Content must be genuinely useful — a real device-crop table, a real re-encode explanation — never a doorway page. The EMD reinforces brand recall; it is **not** assumed to confer ranking, and the PRD does not treat it as one.

#### 4.1.8 Risks

- Platforms *could* add safe-area enforcement; their incentives (generic editor) make it unlikely and slow.
- Micro-tools could improve output quality cheaply; but banner.yt/CollabPals are lead magnets for unrelated businesses and unlikely to invest in design quality.
- **Risk to the thesis:** users search "maker" and "template," not "crop simulator." Mitigated by leading with maker/template intent and delivering correctness beneath it.

#### 4.1.9 Evidence Gaps

- The provided Ahrefs volumes are **bands** (`>1000`, `>100`), not exact. This PRD does not convert them to figures.
- No exact-match-keyword difficulty or click-through data was available this session for these bands; "Easy" is the supplied flag.
- French SERPs could not be verified this session (see §4.8).

#### 4.1.10 Conclusion

**BUILD — but modify the thesis.** The demand is real, the pain is structural, and the technical feasibility is high. The original "template-first no-signup maker" framing is insufficient for two reasons: (1) it is already commoditized by banner.yt and CollabPals, and (2) it names the wrong job — the job is correctness, not design power. The product becomes a **correctness-first utility**.

### 4.2 Keyword and Search Intent Analysis

See §4.1.2–4.1.3. The strategic read: **informational/educational intent (size, dimensions, safe area) is what the platforms do not hold and what a utilitarian product on an EMD can own.** Tool intent ("maker," "resizer") is present but modest and partly platform-owned. The product should therefore **acquire on informational intent and convert on tool intent**, which is the inverse of how a typical maker-site is architected.

### 4.3 Geographic Opportunity

See §4.1.4. **RECOMMENDATION: US first.** France is phase 2, contingent on US validation and a French-SERP check (see §30, §38).

### 4.4 User Pain Evidence

#### 4.4.1 Supplied Reddit Evidence (qualitative only — no prevalence claim)

These are **qualitative evidence for problem formulation**, not quantitative proof of market prevalence. Each is treated as one real user's report, not a statistic.

| ID | Subreddit | Thread | Core friction |
|---|---|---|---|
| E-01 | r/SmallYoutubers | *"actually free" banner creator request* | "Free" tools are not free; user only needs something simple. |
| E-02 | r/NewTubers | Banner from Canva didn't fit "shown on all devices"; tried multiple resizers | Safe-area not enforced; multi-site resize failed. |
| E-03 | r/NewTubers | 2560×1440 Krita export blurry/compressed on YouTube | Server-side recompression blamed on user's export. |
| E-04 | r/NewTubers | Canva template didn't fit; only a small rectangle usable | Template geometry not safe-area-aware. |

#### 4.4.2 Additional Supplied Reddit Evidence (second batch)

| ID | Subreddit | Thread | Core friction |
|---|---|---|---|
| E-05 | r/NewTubers | Adding text → "not the right size" errors; file-size vs dimension confusion | Users conflate file size (MB) with pixel dimensions. |
| E-06 | r/NewTubers | "Impossible" to set device-specific crops; multi-device cropping makes single image impossible | False mental model: they think they must make per-device images; the safe rect is the answer. |
| E-07 | r/NewTubers | Banner "blurry, crusty, and compressed" after upload (Krita) | Same as E-03. |
| E-08 | r/NewTubers | Can't find free resizer; export hidden behind paywalls | G4 (Trust deficit), corroborated by pricing pages. |
| E-09 | r/NewTubers | Banner won't update / refresh; CDN edge caching | **Verified mechanism**: CDN `max-age=86400`. |
| E-10 | r/canva | Canva recommended size → graphic cut off on desktop and mobile | G1. Platform gives size, not constraint. |
| E-11 | r/canva | "Canva sizes are incorrect" — outdated templates, cut off, no responsive safe-area indicator | G1. |
| E-12 | r/youtubers | "Exact size requirements → doesn't fit/look good" after Photoshop | Resize produces distortion, not correctness; safe area misunderstood. |
| E-13 | r/youtubers | PNG-24 from Photoshop → color shift, washed out after upload | **Verified mechanism**: canvas 2D defaults to sRGB; a P3/wide-gamut image drawn into sRGB gets gamut-clamped. |
| E-14 | r/photoshop | 2650×1440 Photoshop → significant quality loss after upload | Server-side recompression. |
| E-15 | r/photoshop | Looks sharp in preview, blurry/pixelated once live; upscaling fails | Recompression + downscale to served width. |
| E-16 | r/photoshop | "Different brightness to Photoshop banner" | Missing sRGB profile embed → colour-managed browsers correct differently. |

#### 4.4.3 Verified Mechanisms Behind the Reported Pains

**FACT.** YouTube banner CDN serves with `cache-control: public, max-age=86400, no-transform`; the fetched asset had `age: 5151` (≈86 min into a 24 h cache window). → E-09: a banner that won't update is very often the CDN edge cache, not the upload.

**FACT (MDN, `getContext`).** Canvas 2D context default color space is `"srgb"` — verbatim: *"This is the default value."* Manifest/DCI-P3 images drawn into an sRGB canvas are converted to the canvas's color space. → E-13, E-16: colour shift after export. **This is a real, addressable defect**: exporting from a canvas converts wide-gamut source art (canonically) into sRGB, which can look washed out if the reference browser expects a profile the export lacks, or shift if the source was P3.

**FACT (MDN, `<canvas>`).** iOS caps canvas size at 4096×4096. 2560×1440 fits; 2× supersampling does not. On iOS, do not supersample.

**FACT (MDN, `toBlob`).** Guaranteed MIME type is `image/png` only. `image/jpeg` and `image/webp` are optional. Export must check `blob.type` and fall back.

#### 4.4.4 Repeated-Failure Pattern

Across E-02, E-04, E-05, E-06, E-10, E-11, E-12 the recurring structure is:

```
Design at full canvas → no constraint enforcement → crop removes content
→ user guesses (resize / re-export / different site) → still wrong
→ user concludes the platform is broken.
```

This is the workflow the product mechanises away. It is not user error, and the product must never make the user feel it is.

### 4.5 Competitor Research

**Method note.** Canva could not be fetched this session (403 on WebFetch, curl with real UA, r.jina.ai proxy, and a second proxy). **No Canva capability claim in this PRD is a FACT.** Canva appears only where marked **UNVERIFIED** or as an **OBSERVATION** of its ranking. Every other competitor was fetched directly; those facts are tagged.

#### 4.5.1 Canva — UNVERIFIED (this session)

- **OBSERVATION (Bing SERP, single IP — directional):** `canva.com/create/youtube-banners/` ranks #1 for both `youtube banner maker` and `youtube banner template`. Widely used (per r/canva threads E-10, E-11).
- **UNVERIFIED:** template count, sign-up requirement, watermark policy, whether "Resize" is premium, exact free plan limits. Those cannot be stated as product facts and any external benchmark must re-verify them.
- **Weakness (from evidence):** E-10, E-11 report the recommended-size banner being cut off — the platform gives the canvas size but does not enforce device-crop constraints, and its responsive-safe-area handling fails users.
- **How we differ:** we enforce the crop, not the canvas.

#### 4.5.2 Adobe Express — FACT (page text)

- "Create banners for YouTube for free in minutes"; badges "Free to use", "No credit card required".
- FAQ states 2560×1440 and "keep key elements in the safe center area of 1235px by 338px" — **documents the safe area, does not enforce it**.
- Editor deep-links carry `width=2560&height=1440`.
- Never states whether an account is required to export; CTA routes into the Adobe app.
- **Weakness:** knows the number, doesn't keep the user inside the constraint. Uses the official "1235×338" figure while the market's "1546×423" appears elsewhere — **the two-rule confusion persists even inside a single vendor's copy across pages**.

#### 4.5.3 Kapwing — FACT (page text)

- "over 100 different content creation features"; template claims of "hundreds" and "thousands" in different places.
- Export described only as "Export your project as a JPEG"; canvas 2560×1440.
- **No safe area mentioned anywhere. No device preview.** Watermark and export-gating not stated.
- Header "Start Editing" → `/signin`; hero "Start creating" → `/studio/editor`.
- **Weakness:** no constraint awareness at all; header CTAs diverge between signed-out and editor flows. For our targeted job (which needs safe-area awareness), Kapwing is not serving it.

#### 4.5.4 Snappa — FACT (pricing page)

- Free Starter: **3 downloads per month**, account required. Pro $15/mo.
- Blog claims "YouTube's banner dimensions and safe zones are built right into our design tool."
- **Weakness:** hardest paywall observed on the core job. A first banner plus two revisions exhausts the free month — concrete, verified support for E-08.

#### 4.5.5 VistaCreate — FACT (plans page)

- Starter $0. **"One-click Resizer" and "HD Download" listed as Pro-only** ($10/mo).
- **Weakness:** the exact capability a mis-sized banner needs (resize) and the exact output quality it needs (HD) are both behind the paywall. Verified support for E-08 and E-01 ("free" tools that aren't genuinely free).

#### 4.5.6 Picsart — FACT (page text)

- "Create custom banners for free"; pitch is asset breadth ("vast libraries of expert-crafted backgrounds, stickers, and hundreds of unique fonts"). No dimensions, no safe area, no device preview. Pricing page dominated by AI-model marketing (Seedance/Veo/Kling).
- **INFERENCE:** banner tooling is a legacy SEO surface, not an active product focus — unlikely to be improved for this job.

#### 4.5.7 PosterMyWall / Placeit / BrandCrowd / template.net — FACT (page text)

- Template marketplaces; heavy category navigation. PosterMyWall title claims "42,420+ Free Templates"; Placeit emits its whole category tree before any banner content.
- **Weakness:** high template-discovery cost; no YouTube-specific correctness in surfaced copy.

#### 4.5.8 banner.yt — FACT (page text) — closes micro-tool, correct geometry

- 2560×1440 canvas; device tabs labelled TV 2560×1440 / Desktop 2560×423 / Tablet 1855×423 / Mobile (Safe) 1546×423; safe-zone guides toggle; gradient/solid/upload background; text + sub-text with size/colour; export PNG/JPEG/WebP; states 6 MB limit; names both 1546×423 and 1235×338 zones; 8 gradient templates.
- **Weakness:** output is gradient + two text lines. **Cannot produce a designed-looking banner.** No fix-existing-image path beyond background upload. No quality/compression handling. Its device tabs are decorative crops of the editor — **not** simulations of YouTube's output.

#### 4.5.9 CollabPals — FACT (page text) — second micro-tool, near-identical to the naive brief

- "Free tool · No sign-up"; "Live device preview"; "Safe zone overlay"; "12 style presets"; "Free PNG download"; TV/Desktop/Tablet/Mobile tabs; gradient/solid/image background; Cover/Contain/Stretch fit modes; channel name + tagline + upload schedule fields; 10 fonts; text outline; text position.
- **Weakness:** preset-driven, not design-driven — output is a coloured background with three text rows. It is a **lead magnet** for a creator-collab SaaS; the tool is not the business, so it will not be invested in beyond lead generation.

#### 4.5.10 BaseToolbox — FACT (page text)

- Upload → position within centred 1546×423 safe guide → download 2560×1440. Cross-links "Compress the banner before upload".
- **Weakness:** no creation path, no device preview, generic tool-farm surroundings. Closest to our "fix" door but lacks design and simulation.

#### 4.5.11 CleverUtils — FACT (page text)

- "Free, no signup"; "Free & unlimited · **Center crop**"; YouTube presets; 6 languages incl. Français.
- **Weakness:** fixed centre crop only — an off-centre face or logo is destroyed with no control and no warning. This is precisely the anti-behaviour we must be the opposite of. (Also: its preset-based banner resize shares the same limitation as E-12's distortion.)

#### 4.5.12 ImResizer — OBSERVATION (SERP listing)

- Serves `resize-image-for-youtube`; likely centre-crop model. Treated as a commodity; no deep analysis — its SERP presence confirms the `youtube banner size` head is micro-tool-held.

### 4.6 Competitive Gap Analysis

#### 4.6.1 Competitive Opportunity Matrix

Rows = user needs. Columns = capability. Legend: ✅ present, ⚠️ partial, ❌ absent, **?** = unverified.

| Need | Canva | Adobe Exp | Kapwing | Snappa | VistaCreate | Picsart | PosterMyWall | banner.yt | CollabPals | BaseToolbox | **US** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| No account to export | ? | ? | ? | ❌ | ? | ? | ❌ | ✅ | ✅ | ✅ | **✅** |
| Free export, no quota | ? | ? | ? | ❌ (3/mo) | ⚠️ (HD gated) | ? | ❌ | ✅ | ✅ | ✅ | **✅** |
| No watermark | ? | ? | ? | ❌ (plan) | ? | ? | ? | ✅ | ✅ | ✅ | **✅** |
| Safe area **enforced** (not documented) | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ⚠️ (guides) | ⚠️ (guides) | ⚠️ (guide) | **✅ hard** |
| Per-device crop preview | ? | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | **✅** |
| **Simulates post-upload result** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | **✅ unique** |
| Validates export (size/quality/types) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ (says 6 MB) | ⚠️ | ❌ | **✅ unique** |
| Fix an existing image (subject-aware) | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ (bg) | ✅ | **✅ unique** |
| Detect text/logo outside safe rect | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ (guide only) | ⚠️ (guide) | ❌ | **✅ unique** |
| Looks **designed**, not gradient+text | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | **✅** |
| Fast, no framework client | ? | ? | ? | ❌ | ❌ | ? | ❌ | ✅ | ❌ | ✅ | **✅** |

**The gap:** the rightmost column is green only where both camps are red/partial. **"Correctly fits AND looks designed" is unoccupied.**

#### 4.6.2 Answers to the Ten Required Questions

1. **What are competitors optimized for?** Platforms: asset/library breadth and general-purpose editing. Micro-tools: correctness on a gradient canvas. Neither optimizes for the combined "correct + designed + honest."
2. **What are they asking users to do that our user may not want?** Platforms: sign up, learn an editor, pay to resize. Micro-tools: accept a gradient banner, or accept a blind centre crop.
3. **Where does the workflow break?** The moment content is placed outside the safe rect (G1), and the moment the output hits YouTube's re-encode (G2). Both are *post-design* failures.
4. **What can be removed entirely?** Accounts, login, download quotas, canvas setup, layer management, asset search, the "100 features" editor, the "which template?" decision (we curate to ~24).
5. **What is genuinely necessary?** Crop enforcement, per-device preview, fixed existing-image fit, export validation, format/quality honesty, ~24 quality templates, text basic styling, upload/background.
6. **What popular features are distractions?** Template counts in the thousands, stock-photo libraries, AI generation, layer masks/blend modes, brand kits, multi-format support in v1, animation.
7. **Is there a realistic wedge against Canva?** Yes — a targeted one. We do not compete on canvas or template quantity; we compete on the single job Canva demonstrably misses (E-10, E-11). Users arrive via size-intent, not via "design tool" intent.
8. **Can it be substantially simpler without worse output?** Yes. The micro-tools prove the simple-interface floor; the platforms prove the design-quality ceiling. The product takes ~24 curated templates + bounds on a few controls, not a full editor.
9. **What does "better" mean?** Not "more features." Better = the user wins: correct on all devices, designed-looking, knows before uploading, and never blocked by a paywall.
10. **What is hard for competitors to copy?** The **correctness engine** — the fraction-based crop model, the JPEG re-encode simulation, and the validation ruleset derived from *measured* `fcrop64` geometry. It is not a feature layered on a generic editor; it is the product. Platforms could clone the *controls* in a month, but their business model and incentive (generic editor, subscriptions) push against doing so.

### 4.7 User Workflow Research

#### 4.7.1 Scenario Analysis

**Scenario A — "I need a new banner and don't know how to design"**
- **Trigger:** New channel / rebrand; homepage looks empty or amateur (E-01).
- **Intent:** Get a professional-looking banner with minimal effort.
- **Emotional state:** Overwhelmed by platforms; afraid of design — wants "just make it happen."
- **Current workaround:** Canva template (~correct size, wrong constraint) → export → cut off (E-10).
- **Friction:** choice overload, signup, then post-upload failure.
- **Decision points:** pick template or blank canvas; edit or accept; export format.
- **Information needed:** what fits, word count, colour, what's on the channel.
- **Actions:** choose template → replace channel name/colour → export → upload.
- **Failure:** template geometry unconstrained → crop cuts content (G1); paywall (G4).
- **Successful outcome:** correct, designed banner on channel in < 5 min, no account.
- **Automation opportunity:** pick a template + auto-fill channel name + auto-safe-area placement.
- **Unnecessary steps:** choosing a blank canvas; searching assets; layer management.
- **Product intervention:** Create door. Curated template-first; placeholder text auto-matched to safe rect; one-screen editing.

**Scenario B — "I have a banner, it doesn't fit"**
- **Trigger:** Uploaded existing channel-art; content cut off on desktop/mobile (E-02, E-06, E-10).
- **Intent:** Make the image I already have work.
- **Emotional state:** Frustrated; has already wasted time.
- **Current workaround:** hunt a resizer; multiple sites; still wrong (E-02 "tried multiple websites to resize").
- **Friction:** resizers do centre crop, destroying off-centre subject (CleverUtils, FACT); no preview; no validation.
- **Decision:** how to reposition; crop vs extend; keep or discard.
- **Information needed:** what's being cut; where the subject is.
- **Actions:** upload → position against safe rect → export → upload.
- **Failure:** blind centre crop; distortion from exact-spec resize (E-12); no feedback.
- **Successful outcome:** original image intact, subject inside safe rect, correct output.
- **Automation opportunity:** auto-cover-fit + subject-aware repositioning (drag subject with live safe-rect feedback).
- **Unnecessary steps:** visiting multiple sites; guessing crop.
- **Product intervention:** Fix door (primary). Upload → auto-fit → drag/reposition → live device preview → export.

**Scenario C — "My banner looks blurry/poor quality after upload"**
- **Trigger:** Crisp before upload, blurry/compressed after (E-03, E-07, E-14, E-15).
- **Intent:** Get the quality back.
- **Emotional state:** Confused; convinced it's their export.
- **Current workaround:** re-export at higher quality, change format, upscale — none fix it.
- **Friction:** no tool explains the re-encode; users chase a setting they don't control.
- **Decision point:** learn that it's the platform, not them.
- **Information needed:** the truth about server-side re-encoding; what actually controls perceived sharpness.
- **Actions:** (product) re-render at correct size, no unnecessary upscale, preview simulated re-encode → export.
- **Failure:** upscaling (adds noise); JPEG quality too high (banding); P3→sRGB colour shift (E-13, E-16).
- **Successful outcome:** user understands the ceiling; image is not upscaled; colour is sRGB-correct; no avoidable compression damage.
- **Automation opportunity:** normalise to sRGB; cap at source resolution (never upscale); choose JPEG/WebP quality that stays under 6 MB; simulate re-encode for honesty.
- **Unnecessary steps:** re-exporting repeatedly; hunting a "quality" setting.
- **Product intervention:** Fix door + honest disclosure + sRGB normalisation + no-upscale rule + re-encode simulation.

**Scenario D — "I used Canva and still can't fit it"**
- **Trigger:** Followed Canva's size; result cut off (E-10, E-11, E-12).
- **Intent:** Recover the design; make it fit.
- **Emotional state:** Doubting skill; angry at the tool.
- **Current workaround:** re-open Canva, try to resize, fail (E-11).
- **Friction:** resize distortion; no safe-area indicator; unclear export path.
- **Decision point:** abandon the design or fix it.
- **Information needed:** which part of the design is outside the safe rect; how to reposition.
- **Actions:** clear understanding + explicit repositioning.
- **Failure:** resize instead of reposition; repeated failed uploads.
- **Successful outcome:** keeps intent of design, correct geometry, no redownload-loop.
- **Automation opportunity:** same as B but starting from a designed image — subject-aware reposition.
- **Unnecessary steps:** re-designing from scratch.
- **Product intervention:** Fix door + a "Your design is cut off because…" explanation.

**Scenario E — "I want something free, no account"**
- **Trigger:** Burned by paywall (E-01, E-08); refuses accounts.
- **Intent:** Free, immediate, no signup, no watermark.
- **Emotional state:** Skeptical; one failed attempt and they leave.
- **Current workaround:** hunt; often gets a "free" tool that gates export (E-08).
- **Friction:** account walls, download quotas, watermarks, "Pro" upsells.
- **Decision point:** trust the "free" claim.
- **Information needed:** proof it's free; no watermark; no download limit.
- **Actions:** open tool → make/fix → download → done.
- **Failure:** hidden gate; surprise watermark; forced signup mid-flow.
- **Successful outcome:** zero-account, zero-watermark, zero-quota download.
- **Automation opportunity:** nothing to automate — this is about what we *don't* add.
- **Unnecessary steps:** creating an account, verifying email, entering a card.
- **Product intervention:** Guarantee it. Never a wall. Exported file must be the true product, forever.

#### 4.7.2 Synthesis — The Smallest Shared Job

Across all five scenarios the **common denominator** is not "make a banner." It is:

> **"Put a correct banner on my channel quickly, without an account, and don't let YouTube break it."**

The single high-value job: **get a correctly-composed, professional-looking 2560×1440 banner that survives YouTube's crop and re-encode, in one pass, free.**

Two ancillary but real jobs: **"fit the image I already have"** (B/C/D) and **"know it will be OK before I upload"** (all).

#### 4.7.3 The Anti-Jobs (what we refuse to optimise for)

- Multi-channel/creator-marketplace workflows.
- Brand kits, team collaboration.
- Non-YouTube formats in v1.
- AI-generated content.
- Anything that reintroduces design-tool complexity.

---

## 5. Strategic Product Direction

### 5.1 The Product

**A correctness-first YouTube banner utility.** One rendering engine, three entry doors sharing a single fraction-based crop model:

| Door | Primary user | Job | Entry keyword |
|---|---|---|---|
| **Fix** | Has an image, it's wrong | Reposition/refit so it survives the crop | `youtube banner resizer` |
| **Create** | Needs a new banner, no design skill | Curated, geometry-safe templates | `youtube banner maker`, `youtube banner template` |
| **Check** | Has a banner, unsure | Validate + diagnose + one-click fix | `youtube banner size`, `youtube banner dimensions` |

### 5.2 The Differentiating Layer

**A verified per-device crop and upload-outcome simulator.** Every preview is rendered from the *measured* `fcrop64` fraction rectangles (1.0×1.0, 1.0×0.2942, 1.0×0.6410, 0.7246×1.0), not invented device sizes. The desktop preview is downscaled to a real served width (w1707) and round-tripped through JPEG at a comparable byte budget, so the user sees the *actual* blur before uploading. Text/logo layers are geometrically tested against the safe rect; violations name the device ("your handle is cut on desktop"), not a dotted hint. Export enforces 2560×1440 and a <6 MB budget, verifying `blob.type`.

**Why this is the wedge:** it is the only claim in the market that is **falsifiable and checkable** — the user uploads and confirms the simulation was right. Overlays and "free templates" are not checkable. This turns honesty into a product feature.

### 5.3 Secondary Strengths

1. **Safe-area-correct-by-construction templates.** Template geometry is authored in frame fractions; no template can place primary content outside the safe rect. Fixes E-02/E-04/E-10/E-11 at the source, produces output micro-tools cannot.
2. **A first-class fix path.** Upload → auto-fit → drag subject against live safe-rect with per-device feedback → export. This is the majority job and no observed competitor treats it as a primary flow.
3. **Trust as a feature.** Zero account, zero watermark, zero download quota, zero email gate. The word "free" is true in the way E-01 and E-08 report the category's is not.

### 5.4 What We Are Not

Not a Canva clone. Not a multi-platform banner suite. Not a design platform. Not an AI content factory. Not an image editor with a YouTube preset. **One job, done correctly, honestly, and fast.**

---

## 6. Target Users

### 6.1 Primary Persona — "The New Channel Owner"

- Running a new or small channel (< 10k subs), needs to look professional.
- Not a designer. Doesn't want to learn a design tool.
- Will not create an account for a one-off banner.
- Trigger events: first upload, rebrand, a new series, "channel doesn't look legit."
- Success: banner on channel in one sitting, looks good, no paywall, no cut-off text.

### 6.2 Secondary Persona — "The Existing Banner Owner"

- Has channel art already; it's wrong (cut, blurry, or stubborn). E-02/E-06/E-10.
- Wants to *fix*, not redesign. Hostile to accounts and paywalls.
- Most likely to arrive via `youtube banner resizer` or the size guide.

### 6.3 Tertiary Persona — "The SEO/Info Seeker"

- Asked Google "what size is a youtube banner." Wants the answer plus a working tool.
- Converts only if the guide is genuinely useful and the CTA is a real tool, not a trap.

### 6.4 Explicitly Not For

- Teams/large channels needing brand kits or collaboration.
- Designers who want a full editor.
- Anyone seeking AI-generated art.
- Multi-platform creators in v1 (they'll come back; not targeted yet).

---

## 7. Jobs To Be Done

| JTBD | In one sentence | Primary |
|---|---|---|
| JTBD-1 | When I start a channel, I want a professional banner on it without learning design, so it looks legit. | Create |
| JTBD-2 | When my existing banner is cut off, I want to fix it without losing the design, so viewers see the whole thing. | Fix |
| JTBD-3 | When my banner looks bad after upload, I want to know why and get the best possible result, so I stop blaming myself. | Fix |
| JTBD-4 | When I'm about to upload, I want to know it'll survive, so I don't post something broken. | Check / all |
| JTBD-5 | When I just need a banner, I want it free without an account, so I don't get burned again. | all |

---

## 8. Core User Problems

1. **P1 — The crop is a surprise.** Content designed at full frame gets cut on desktop and mobile. (E-02, E-04, E-06, E-10, E-11, E-12)
2. **P2 — The re-encode is invisible.** Blur/compression appears after upload; users don't know it's the platform (E-03, E-07, E-14, E-15).
3. **P3 — Fixing = guessing.** Resizers centre-crop or distort; no subject-aware fit (E-02, E-08, E-12).
4. **P4 — "Free" is a lie.** Account/gate/quota/watermark (E-01, E-08).
5. **P5 — Colour shifts.** Wide-gamut source → sRGB export → washed/shifted (E-13, E-16). *Mechanism verified.*
6. **P6 — Spec confusion.** 1024×576 (thumbnail) vs 2560×1440 (banner); file-size MB vs pixel dimension (E-05).
7. **P7 — Update failures blamed on the user.** CDN caching (E-09). *Mechanism verified.*

---

## 9. Product Positioning

### 9.1 Primary Positioning Statement

> For new and small YouTube channel owners who need a professional banner but are not designers, **YTBannerStudio** is a free, no-account banner utility that makes sure the banner fits on every device — TV, desktop, tablet, mobile — before you upload. Unlike Canva, which hands you a canvas without the constraint, and unlike no-account mini-tools that make you a gradient with two lines of text, it enforces the safe area, simulates exactly how YouTube will crop and re-compress your image, and shows you the result before you commit.

### 9.2 Positioning by Competitor

| Against | We say |
|---|---|
| Canva / Adobe Express / Picsart / VistaCreate | We don't make you sign up, pay, or resize behind a paywall — and we enforce the crop, not just document it. |
| banner.yt / CollabPals / BaseToolbox | We don't make you choose between "correct" and "designed." You get both. |
| CleverUtils / ImResizer | We don't centre-crop your face out of the frame. |
| Snappa / VistaCreate paywalls | Free isn't a teaser. |

### 9.3 Category Frame

Frame as a **"correctness utility"** in a category of **design platforms** and **template marketplaces**. The user should think: *"This is the tool that checks and fixes my banner before YouTube does it."*

---

## 10. Tagline and Messaging

### 10.1 Primary Tagline

> **See exactly what YouTube will cut — before you upload.**

### 10.2 Candidate Statements Considered

- *"Make a banner that fits on every device."* — accurate, less specific.
- *"The honest YouTube banner maker."* — strong but too blunt for a homepage headline.
- *"No sign-up. No watermark. No way to get cut off."* — strong, negative-framed.
- *"Your banner, correct on every screen, free."* — clear but bland.

**Selected:** *"See exactly what YouTube will cut — before you upload."* It names the hidden failure (the crop) and the trust mechanism (preview before upload). It is the differentiating feature expressed as a promise.

### 10.3 Supporting Value Proposition (one line each)

- **Free forever. No account. No watermark. No download limit.** — answers E-01/E-08 directly.
- **Small library of professional templates you can make your own.** — design quality without a design tool.
- **Fix the banner you already have.** — reposition, not re-crop.
- **2560×1440. Under 6 MB. sRGB. All checked before you download.**

### 10.4 Homepage Messaging Hierarchy

1. **Hero:** Tagline (10.1) + subline: *"Create, fix, or check your YouTube banner — correct on TV, desktop, tablet, and mobile."*
2. **Sub-hero proof strip:** three chips — *No account · No watermark · Free export.*
3. **How it works** (three doors, one card each): Create / Fix / Check.
4. **The constraint explained:** a short, genuinely useful device-crop table — TV (2560×1440), Desktop (2560×423 slice), Tablet, Mobile (safe rect 1546×423 @ 2560×1440) — with a line noting this equals the official 1235×338 @ 2048×1152.
5. **Proof/evidence section:** "Why banners get cut off" — honest explanation of the crop + re-encode, with the JPEG re-encode fact. This is the credibility anchor.
6. **Link module:** /guides/youtube-banner-size, /guides/youtube-banner-safe-area, /tools/youtube-banner-resizer.
7. **CTA:** "Make a banner from a template →" and "Fix a banner you have →".
8. **Footer:** size-spec reference, links, sitemap.

### 10.5 UX Tone

**Pragmatic, calm, competent. No hype.** The product should feel like a well-made tool, not a marketing site. Sentence copy is direct: "Text here will be cut off on mobile." Not "Oops!" Never condescending. The user is smart; the tools failed them. We say what's true and let them proceed. Our voice: **clear, honest, knowledgeable, brief.**

---

## 11. Product Principles

1. **Zero-friction.** No mandatory account / signup / login. Ever.
2. **Free core utility.** The primary job is genuinely usable and downloadable for free. No manufactured restrictions.
3. **Browser-first.** Client-side Canvas 2D for all image work. No server processing.
4. **Fast.** Sub-second time-to-first-pixel; `LCP < 0.8s`; minimal JS (< ~65 KB total).
5. **Template-first.** Users never start from an empty canvas unless they deliberately choose to.
6. **Professional output.** Good-looking output even for non-designers.
7. **YouTube-specific.** Solves YouTube's crop/re-encode/safe-area problems, not general graphic design.
8. **Safe-area awareness.** Enforced, not documented.
9. **Multi-device preview.** Real simulated crops for TV/desktop/tablet/mobile.
10. **Quality-aware, honest export.** Best achievable output, with an honest statement that YouTube re-encodes.
11. **Minimal interface.** Only controls that materially improve the outcome.
12. **High trust.** No dark patterns. No deceptive "free" claims. No hidden signup. No surprise watermark. No unnecessary uploads.

---

## 12. Core User Workflow

### 12.1 The Invariant Core

Regardless of entry door, the user passes through **five stages**, the last two being what competitors omit:

```
1. Get a canvas        → auto: 2560×1440, correct background, safe area pre-set
2. Author content      → text/photo/colour within the safe rect (enforced)
3. See the crops       → live TV/desktop/tablet/mobile previews from real geometry
4. See the outcome     → re-encode simulation (the honest step)
5. Export              → validate (size, <6 MB, format) → download → upload
```

Stage 4 ("See the outcome") is the differentiation. It is what no observed competitor does.

### 12.2 Door-Specific Variants

**Fix (Scenario B/C/D):** Upload image → auto-cover-fit (never upscale) → drag subject with live safe-rect feedback → preview crops → simulated re-encode → export.

**Create (Scenario A):** Choose template (curated ~24) → replace channel name/tagline/colour → preview crops → simulated re-encode → export.

**Check (Scenario C/E + Check):** Upload existing → run validation (crop-safe, file size, source resolution, sRGB, re-encode) → verdict list → "Fix it" → Fix door.

### 12.3 The "Cut Off" Detection

This is the core product mechanic. When the user places/loads content, the engine computes the intersection of each layer's bounding box with the safe rect (as frame fractions). If a layer extends past the safe rect on any edge, the corresponding device preview flags it:

```text
"Your channel name is cut off on mobile. Drag it above the line."
```

The safe rect is enforced as a **hard constraint** — content is either inside or the user is told precisely which content crosses it and where to move it. This is the opposite of the dotted overlay that micro-tools show and expect you to interpret.

### 12.4 The Re-Encode Simulation

**This is not a claim about a "lossless export."** It is a preview. The engine:
1. Downscales to a real served width (w1707 for desktop, matching the observed URL pattern).
2. Re-encodes through `canvas.toBlob('image/jpeg', quality)` at a quality chosen to land near the observed ~134 KB budget.
3. Shows *that* result to the user, labelled: *"This is approximately what YouTube will serve at desktop size. YouTube will re-compress your upload — this is expected and cannot be avoided."*

The value is **setting the expectation and preventing the "blurry = my fault" loop** (E-03, E-07, E-14, E-15).

---

## 13. UX Architecture

### 13.1 Information Architecture (Navigation)

Flat, minimal:
```
Nav (always): Home | Make a banner | Fix a banner | Banner size guide | Templates
Footer: full size/format specs, links, sitemap, legal.
```

### 13.2 Pages (initial)

See §14. The tool pages share a single layout shell; content pages share another.

### 13.3 Layout

- **Tool pages (Fix / Create / Check):** Left = editor canvas (always visible), Right = single-column controls. On mobile the editor is full-width and controls collapse into an accordion below. No sidebars, no drawers, no tabs beyond the device-switcher.
- **Content pages (guides):** editorial single-column, max width ~76ch, with a persistent sticky "Try the tool" CTA.
- **Device switcher:** the single most important control. Four small buttons: TV / Desktop / Tablet / Mobile. Switching changes the *preview crop*, never the editor canvas.

### 13.4 States & Edge Cases

| State | Behaviour |
|---|---|
| Image still loading | shimmer + "Preparing…"; no dead blank |
| Huge image (>12 MB, >30,000px long edge) | warn before decode; offer to use a smaller source; throttle |
| Portrait/tall image | auto-cover-fit; explain crop; safe-rect repositioning |
| Very wide panorama | same |
| No text yet | friendly empty-state in safe rect |
| Unsafe crop (content crossing safe rect) | "Cut off on mobile" label + precise guidance |
| Export > 6 MB | auto quality search to get under; show final size |
| Canvas unsupported / disabled JS | server-rendered fallback message + link to size guide; tool degrades gracefully |
| iOS | no supersampling (4096 cap, FACT); still full 2560×1440 available |

### 13.5 Accessibility

- Full keyboard navigation; visible focus.
- ARIA labels on all controls; `aria-live` for the validation/discovery messages.
- Colour not the sole carrier of "cut off" — icon + text.
- Contrast-aware text (WCAG AA) via the text controls (no auto-invisible-on-light-background).
- `<canvas>` has a textual fallback describing the result.

---

## 14. Information Architecture

### 14.1 The SEO Surface (what exists and why)

Every page must have a reason. No doorway pages. No thin programmatic SEO.

| Page | URL | Search intent | Primary cluster | Unique value | CTA | Internal links | Canonical | Indexable |
|---|---|---|---|---|---|---|---|---|
| Homepage | `/` | Brand / product | — | Positioning + three doors + honest crop/re-encode explainer | Make / Fix | → all tools + guides | self | ✅ |
| Fix a banner | `/tools/youtube-banner-resizer` | Fix my existing image | `youtube banner resizer` | Subject-aware fit, no distortion, re-encode preview | Upload | → guides, Create | self | ✅ |
| Make a banner | `/tools/youtube-banner-maker` | Create new | `youtube banner maker`, `creator` | Curated geometry-safe templates + previews | Choose template | → guides, Fix | self | ✅ |
| Check a banner | `/tools/youtube-banner-checker` | Validate existing | `youtube banner checker` | Verdict list + one-click fix | Upload | → Fix | self | ✅ |
| Banner size guide | `/guides/youtube-banner-size` | "what size…" | `youtube banner size`, `dimensions`, `what size` | Authoritative device-crop table + re-encode truth + the two-safe-area reconciliation | Try the tool | → safe-area, resizer, maker | self | ✅ |
| Safe-area guide | `/guides/youtube-banner-safe-area` | "size for all devices" | `youtube banner size for all devices` | The 1235×338 == 1546×423 reconciliation, worked | Try the tool | → size, resizer | self | ✅ |
| Template category pages | `/templates/<niche>` | "… banner template" | `black banner`, `aesthetic banner`, `gaming banner`… | Real templates, real value | Use this template | → maker | self | ✅ (only if ≥3 real templates) |
| `/fr/` (phase 2) | `/fr/…` | French intent | `bannière youtube` | Localized utility + guides | → tool | canonical + hreflang | self (fr) | ✅ (phase 2) |

### 14.2 Template Category Pages — the only thin-page risk

Build a `/templates/<niche>` page **only if it has ≥ 3 genuinely different templates** in that niche. No template in a category may be a colour-swap of another. Categories at launch: `gaming`, `tech`, `black`, `aesthetic`, `minimal`, `channel-name` (generic). Total templates at MVP: **~24** across ~6 categories. This prevents template spam (documented in §16) and avoids thin/duplicate SEO.

---

## 15. Detailed Feature Requirements

**Requirement format:** `REQ-0xx` · Requirement · Rationale · Priority (Must / Should / Later / Reject) · Acceptance Criteria.

**Priorities.** **Must** = MVP ships with it, failing the core problem if absent. **Should** = MVP ships if cheap, else v1.1. **Later** = post-validation. **Reject** = explicitly not built (prevents creep).

### 15.1 Core Engine

**REQ-001** **Fraction-based crop model.**
*Rationale (FACT):* YouTube's `fcrop64` crops decode to frame fractions (1.0×1.0, 1.0×0.2942, 1.0×0.6410, 0.7246×1.0). Representing device crops as fractions of the source frame (not absolute pixels) is the only way one canvas model stays correct across all four surfaces.
*Priority:* Must.
*Acceptance Criteria:*
- A single source-of-truth constant defines the four frame-fraction rectangles.
- Any device preview is generated by rendering that fraction of the canvas, not by a hand-coded pixel size.
- The same fraction model drives both Create and Fix doors.
- Code review confirms no literal pixel device crops (e.g. `2560, 423`) are hard-coded in the render path; only fractions.

**REQ-002** **Per-device crop preview.**
*Rationale:* The core promise — "see exactly what YouTube will cut" — requires real crops. (E-02, E-06, E-10.)
*Priority:* Must.
*Acceptance Criteria:*
- Four device views render: TV (full 1.0×1.0), Desktop (1.0×0.2942), Tablet (0.7246×1.0), Mobile (safe rect 1.0×0.2942 equivalent — see REQ-004).
- Switching device does not change the editor canvas or any content; only the preview crop.
- The mobile view equals the full-frame safe rect as frame fractions.

**REQ-003** **Safe-area enforcement (hard constraint).**
*Rationale:* The single most-reported cause of failure is content outside the safe rect. Enforcement (not documentation) is the product's core differentiator. (E-02, E-04, E-10, E-11.)
*Priority:* Must.
*Acceptance Criteria:*
- A layer whose bounding box crosses the safe rect triggers a named, specific warning: text names the content ("Your channel name") and the device ("cut off on mobile").
- The user can reposition the layer until the warning clears.
- The warning is not an overlay the user must interpret — it is a statement.
- When the user is in "Check" mode, the same detector produces the verdict list.

**REQ-004** **Safe-rect reconciliation (1235×338 == 1546×423).**
*Rationale:* The market describes two safe areas that are one rectangle (60.3% × 29.3% of frame). Naming both and reconciling them solves a real user confusion (E-05, E-12) and is a genuinely useful content point for the guide.
*Priority:* Should.
*Acceptance Criteria:*
- The UI shows the safe rect as frame fractions and, in an info element, states both pixel values at their respective canvas sizes (1235×338 @ 2048×1152; 1546×423 @ 2560×1440).
- The guide page explains they are the same rectangle.
- No assertion that these are "two rules."

**REQ-005** **Re-encode simulation.**
*Rationale:* The blur/compression loop is the second most-reported failure, and no observed competitor explains it or previews it. (E-03, E-07, E-14, E-15.)
*Priority:* Must.
*Acceptance Criteria:*
- A toggle renders the desktop preview downscaled to a served width (~w1707) and re-encoded via `canvas.toBlob('image/jpeg', q)` with `q` chosen to approximate the observed ~134 KB budget.
- The result is labelled: "Approximate result of YouTube's re-encode."
- Copy states plainly: "YouTube will re-compress your upload. This is expected and cannot be avoided."
- The simulation never claims to prevent recompression.

**REQ-006** **sRGB normalisation on export.**
*Rationale:* Canvas 2D defaults to sRGB (FACT, MDN). Wide-gamut source art drawn into an sRGB canvas is gamut-clamped; a missing/incompatible ICC profile on export produces the shift in E-13/E-16. Normalising meaningfully reduces the failure without promising to fix the platform.
*Priority:* Should.
*Acceptance Criteria:*
- Every export is rendered into an sRGB context.
- A "Colour" check in Check mode flags images that appear to exceed sRGB (informational; not a guarantee).
- Copy states colour guidance without claiming to preserve a wide gamut that YouTube won't preserve anyway.

**REQ-007** **No-upgrade rule (never upscale).**
*Rationale:* Upscaling adds noise and is a reported failure path (E-15). Export must not exceed the source raster's native pixel dimensions when the image is the sole content source.
*Priority:* Must.
*Acceptance Criteria:*
- If a source image's native resolution is below the target crop, the engine does not upscale; it letterboxes/crops and states why.
- Low-source-resolution is surfaced as a warning in Check mode ("This image won't be sharp at TV size").

**REQ-008** **Cover-fit with subject repositioning.**
*Rationale:* The Fix door's core. Auto-fit an arbitrary image to 2560×1440 without distortion, then let the user reposition the subject against the safe rect. (E-02, E-08, E-12.)
*Priority:* Must.
*Acceptance Criteria:*
- Upload → auto cover-fit (scale so the shorter edge covers, crop the overflow, never stretch/distort).
- The user can drag/reposition the image (not the canvas) to place the subject in the safe rect.
- The image can be zoomed (bounded; never below cover-fit or above native 1:1).
- The repositioning shows live safe-rect feedback via REQ-003.

**REQ-009** **Background extension (edge-mirror or blur).**
*Rationale:* For images whose aspect is taller/narrower than 2560×1440, cover-fit crops off a lot. A blurred-mirror extension fills the sides instead, preserving more of the image and looking intentional. This is a genuine "don't lose content" feature that competitors (centre-crop) lack. This is also the correct response to E-06's "impossible to fit" — the answer is not to crop harder.
*Priority:* Should.
*Acceptance Criteria:*
- Post-cover-fit, an "Extend background" option fills uncovered areas with a blurred, edge-mirrored version of the image.
- The option defaults off (the honest, safest default) and can be toggled on.
- Toggling updates the safe-rect detection (extension content is background, not subject).

**REQ-010** **Exact-size export at 2560×1440.**
*Rationale:* The recommended upload size; minimum is 2048×1152 but 2560×1440 is what TV quality wants. (FACT.)
*Priority:* Must.
*Acceptance Criteria:*
- Default export is 2560×1440.
- A "Need minimum?" info element explains 2048×1152 is accepted but 2560×1440 is recommended for TV.
- No other export sizes in MVP.

**REQ-011** **Export format: PNG, JPEG, WebP — with `blob.type` verification.**
*Rationale:* `toBlob` guarantees only `image/png` (FACT, MDN). The UI must not claim the user got a JPEG if the browser fell back to PNG.
*Priority:* Must.
*Acceptance Criteria:*
- Choose PNG / JPEG / WebP.
- After export, if `blob.type` ≠ requested type, the UI shows a subtle note ("Saved as PNG in your browser") and renames the file accordingly.
- If WebP requested but unsupported, falls back to PNG with the note.

**REQ-012** **Sub-6 MB enforcement with automatic quality search.**
*Rationale:* Max upload file size is 6 MB (FACT). Exceeding it fails the upload — a 100% preventable error (E-05 "file size vs dimension confusion").
*Priority:* Must.
*Acceptance Criteria:*
- On export, if the blob exceeds ~5.8 MB, reduce quality iteratively (binary search, ≥ 3 steps) until under the budget or quality floor.
- Show the final resolved byte size to the user.
- If under budget at the quality of choice, do not degrade — best quality first, only reduce if needed.

**REQ-013** **Plain-language validation verdicts in Check mode.**
*Rationale:* Diagnosis without judgement is the trust feature. (E-02, E-05, E-09.)
*Priority:* Must.
*Acceptance Criteria:*
- Check mode produces a named list of findings: "Cut off on mobile", "Under TV resolution", "File size will fail upload", "Colour may shift (non-sRGB source)", "This won't update immediately (CDN cache — wait up to 24h)". Unsupported findings are not invented.
- Each finding is a clear statement, not a score.
- Each has a "Fix it" action when applicable, linking into the Fix or Create door.

**REQ-014** **CDN cache disclaimer in Check mode (and Fix).**
*Rationale:* E-09 is a verified mechanism (FACT: `max-age=86400`). Telling the user their banner may take up to 24 h to propagate prevents a destructive "delete and re-upload" loop.
*Priority:* Should.
*Acceptance Criteria:*
- A one-line statement near the upload step: "After uploading, your new banner can take up to 24 hours to appear everywhere — this is YouTube's cache, not an error."
- No claim of a guaranteed refresh time beyond the known spec.

**REQ-015** **Template-first Create flow.**
*Rationale:* Users shouldn't design from a blank canvas (Principle 5). Template choice is the smallest high-value entry. (E-01.)
*Priority:* Must.
*Acceptance Criteria:*
- The Create door opens on a template gallery, never an empty canvas (unless the user explicitly chooses blank).
- Selecting a template loads it into the editor with placeholder text already inside the safe rect.

**REQ-016** **Curated template library — quality over quantity.**
*Rationale:* The design-quality gap vs micro-tools is the value proposition. ~24 by construction-safe templates beats 42,000 geometry-unaware ones (PosterMyWall, FACT).
*Priority:* Must (ship ≥ 24).
*Acceptance Criteria:*
- ≥ 24 templates at MVP; each template in a category is genuinely different (no colour-swaps).
- Templates are authored in frame fractions so primary content is inside the safe rect by construction.
- Each template has ≥ 1 field the user can edit (channel name, tagline, colour, photo).

**REQ-017** **Niche template categories.**
*Rationale:* `youtube banner template` is platform-held; niche categories ("black," "aesthetic," "gaming") are lower-competition and map to real demand (supplied bands >100). They also give the Create flow a low-friction entry.
*Priority:* Should.
*Acceptance Criteria:*
- Categories at launch: gaming, tech, black, aesthetic, minimal, generic.
- A category page exists only with ≥ 3 distinct templates (§14.2).
- Category pages are the discovery surface for the gallery link from guides.

**REQ-018** **Editable text (channel name, tagline, up to 3 lines).**
*Rationale:* The minimum needed to make a template theirs. Micro-tools offer gradient + two text lines; we offer designed templates + bounded text styling.
*Priority:* Must.
*Acceptance Criteria:*
- Up to 3 text layers, each editable in-place.
- Font from a curated per-template set (no arbitrary font picker in MVP).
- Colour, size (bounded), and alignment controls per layer.
- Text cannot be dragged outside its safe-rect slot (enforced) unless "free-position" is explicitly enabled (Later).

**REQ-019** **Curated font set (no arbitrary web fonts).**
*Rationale:* Reliability, performance (no font flash, no layout shift), and design quality. Arbitrary fonts are a performance and design risk; the product is not a font picker.
*Priority:* Should.
*Acceptance Criteria:*
- Fonts are self-hosted, subset, WOFF2, preloaded.
- A curated set (≤ 6 families) chosen per-template from a master list.
- No remote font CDN dependency in MVP.

**REQ-020** **Upload your own background/photo.**
*Rationale:* Many users have an image; they want it *into* the safe rect, not a new design. Core to Fix and a Create option.
*Priority:* Must.
*Acceptance Criteria:*
- Upload a background/photo into any template's background slot.
- Auto cover-fit (REQ-008) applies.
- Same repositioning/zoom controls as Fix.

**REQ-021** **Template discovery without a "search library" component.**
*Rationale:* A template search box is a feature a design platform needs; a ~24-template library does not. Avoids complexity.
*Priority:* Should.
*Acceptance Criteria:*
- Gallery is browsable by category; no free-text search required.
- Templates are never "endless"; the finite, curated feel is intentional.

**REQ-022** **Session-state handoff between pages (sessionStorage).**
*Rationale:* The MPA must let a user move between doors (Create → Fix, or Check → Fix) without losing work. Client-side sessionStorage is the simplest mechanism; no backend (Anti-overengineering).
*Priority:* Must.
*Acceptance Criteria:*
- A single shared session key stores the canvas state (layers, source image metadata, background).
- Navigating Create → Fix or Check → Fix preserves state.
- sessionStorage is cleared on tab close (no persistence across sessions).

**REQ-023** **No account, no signup, no login.**
*Rationale:* The single most consistent user demand (E-01, E-08). Core principle (Zero-friction).
*Priority:* Must.
*Acceptance Criteria:*
- No authentication screen exists anywhere in the flow.
- Export requires no credential, email, or payment.
- No "save to account" prompt appears anywhere.
- There is no hidden sign-up at any point, including after export.

**REQ-024** **No watermark on any export.**
*Rationale:* A surprise watermark is a trust violation (Principle 12). The exported file is the product.
*Priority:* Must.
*Acceptance Criteria:*
- Exported images contain no watermark, no attribution badge, and no padding "brand frame."
- This is verified by an export test that asserts the rendered bitmap contains only user content (no overlaid brand pixels).

**REQ-025** **No download limit.**
*Rationale:* Snappa (3/month) is a verified anti-pattern (FACT). Zero-friction means unlimited free downloads.
*Priority:* Must.
*Acceptance Criteria:*
- No counter, no throttling, no "daily limit" — verified by test that N consecutive exports all succeed.

**REQ-026** **File-size vs dimension clarity in UI.**
*Rationale:* E-05 — users conflate MB (file size) with pixels (dimension). The UI should always distinguish them.
*Priority:* Should.
*Acceptance Criteria:*
- Export UI shows both "2560 × 1440 px" and the resolved file size in MB/KB, labelled unambiguously.
- Any error message references the correct metric ("File is 7.2 MB; must be under 6 MB").

**REQ-027** **Browser-first processing; no backend.**
*Rationale:* Architecture principle + privacy. All image work is client-side Canvas 2D; no upload leaves the device.
*Priority:* Must.
*Acceptance Criteria:*
- No outbound network request of user image data in the render/export path (verifiable in network tab).
- The tool works fully offline once assets are loaded.

**REQ-028** **Performance budget: sub-second first paint, small JS.**
*Rationale:* Speed is a stated top priority; competitors (micro-tools) are fast, so this is an entry requirement, not the differentiator.
*Priority:* Must.
*Acceptance Criteria:*
- Total initial JS for the maker page ≤ ~65 KB gzip (tool logic only; no framework).
- `LCP < 0.8s`, `CLS < 0.1` on a mid-tier mobile.
- No third-party render-blocking JS.

**REQ-029** **Canvas drain: JPEG quality floor with banding mitigation.**
*Rationale:* Quality-aware export should avoid extreme compression that introduces banding in gradients (a known posterize risk at low JPEG quality). This is a Should-have refinement, not a guarantee.
*Priority:* Should.
*Acceptance Criteria:*
- Export quality floor is configurable to avoid visible banding (default ≥ ~0.7 for JPEG).
- If the floor prevents meeting 6 MB, the UI informs the user and recommends PNG, rather than silently going lower.

(REQ-029 relates to the earlier "pre-sharpen" idea: **rejected.** Measured output is JPEG, not WebP; pre-sharpening before a JPEG re-encode adds ringing and is not supported by evidence. See §21, §41.)

**REQ-030** **Graceful degradation without JavaScript.**
*Rationale:* SEO + resilience. If JS is disabled or canvas unsupported, the tool pages must not be a blank void.
*Priority:* Must.
*Acceptance Criteria:*
- With JS disabled, the tool page serves static content (spec table, guide copy) plus a clear "enable JS" note.
- A server-rendered `<noscript>` block replaces the canvas.

---

## 16. Template System

### 16.1 Why Templates Are Central — and Why Not Many

Templates are the bridge across the category gap: platforms have good templates but wrong geometry; micro-tools have right geometry but amateur output. A **small library of safe-by-construction templates** is the direct answer (E-02, E-04, E-10, E-11).

**Do not compete on quantity.** PosterMyWall's 42,420 templates (FACT) is a different game and the anti-model. Quality and outcome correctness is the value.

### 16.2 Template Categories (launch)

`gaming`, `tech`, `black`, `aesthetic`, `minimal`, `generic` (channel-name focus).

### 16.3 Template Authoring Model

- **Schema-driven JSON manifests.** Each template is a JSON object; no HTML template files. (See §28 for the schema.)
- **Fraction-based geometry.** Every element (title, tagline, decorative shapes, photo slot, gradient) is positioned in frame fractions. This is why templates cannot violate the safe rect by construction.
- **Protected vs editable regions.** Structural elements (composition, hierarchy, safe-rect placement) are protected. Editable: text content, text colour/size (bounded), background colour/photo, background gradient. Not editable in MVP: arbitrary element repositioning, new layers, layer order.
- **Templates are validated at build time.** A CI check asserts that for each template, all "primary content" elements are within the safe rect (as fractions) — catching regressions before deploy.

### 16.4 Editable vs Protected

| Editable by user | Protected (designer-authored) |
|---|---|
| Channel name, tagline, subtitle text | Typography hierarchy, font pairing |
| Text colour, size (bounded), alignment | Composition, layout, element positions |
| Background colour / photo / gradient | Decorative shapes, borders, safe-rect slots |
| | All geometry (frame fractions) |

### 16.5 Avoiding Template Spam

- Minimum 3 distinct templates per category to publish a category page.
- No colour-swap "variants" — a template is only another template if the layout differs.
- No automated generation; each template is hand-built by a designer.
- A rejected-list gate: if a category page would be published with fewer than 3 distinct templates, it is omitted.

### 16.6 Templates as an SEO Surface

- **Category pages** (`/templates/gaming`) capture niche template intent (supplied bands >100) — a genuinely useful, real-content page.
- **Individual templates** are **not separate URLs** in MVP. A `youtube banner template` page would be a thin duplicate of the maker page; the category page is the aggregate surface. (Revisit with search demand in §29.)

### 16.7 Template Library Size

**MVP: ~24 templates across ~6 categories** (≈3–6 per category). This is the deliberate ceiling for launch. A later expansion is gated on validation data showing templates are the conversion path — not a default "add more" instinct.

---

## 17. Smart Resize / Fit / Quality Strategy

### 17.1 The Correct Conceptual Workflow

```
Target: 2560×1440 (16:9). Source: arbitrary aspect image.
1. Cover-fit: scale so the SHORTER edge covers the target, crop the longer edge.
   → uniform scale; never stretch/distort.
2. Reposition: allow the user to shift the visible window (subject-aware).
   Never a blind center crop.
3. Subject-in-safe-region: keep the subject inside the safe rect (fractions).
4. Background extension (optional): if the aspect is very tall, extend the
   sides with blur-mirror instead of cropping hard.
5. Never upscale: export limited to source native pixels (REQ-007).
6. Normalise to sRGB (REQ-006).
7. Enforce <6 MB (REQ-012), choose format (REQ-011).
```

### 17.2 Aspect-Ratio Mismatch Handling

- **Wider than 16:9** → cover-fit crops the left/right. Reposition to keep subject.
- **Taller/narrower than 16:9** → cover-fit crops top/bottom (often the face). *This is the dangerous case.* The subject-aware repositioning (drag to place the face in the safe rect) and background extension are the fixes.
- **Exactly 16:9** → no crop; reposition only within the safe rect.

The key insight: **crop is the wrong tool for the "doesn't fit" job.** The correct fix is reposition + safe-rect placement + optional background extension. This is the direct opposite of the blind centre-crop of CleverUtils (FACT) and the distorting exact-size resize that broke E-12.

### 17.3 Cropping When Appropriate

Cropping is appropriate when the source has an acceptable composition and the subject falls within the safe rect. Otherwise, reposition or extend (REQ-008, REQ-009). The engine should auto-detect the subject region is **not** in the safe area and prompt, rather than silently crop.

### 17.4 Object-Positioning (Is It Sufficient?)

Yes, for the MVP. Fraction-based repositioning (pan + zoom) within a cover-fit frame is sufficient to solve the "face out of frame" case in the majority of banner images. **Background extension (REQ-009) is Should** because it handles the narrow-aspect case more gracefully than cropping, but is not required for the core to be correct.

### 17.5 Background Extension (When Useful)

Very tall portrait or very narrow source where cover-fit would crop the subject out. Extending with a blurred, edge-mirrored version preserves the subject and looks intentional. Default off (the honest baseline) — user opts in.

### 17.6 Browser-Based Processing — Feasibility

**FACT (MDN).** A 2560×1440 canvas is within all major browsers' limits (most exceed 10,000×10,000; iOS capped at 4096×4096). Export via `canvas.toBlob`.
**FACT (MDN).** `toBlob` guarantees `image/png`; JPEG/WebP optional; must check `blob.type`.
**INFERENCE — no server needed.** Pure client-side Canvas 2D can render, crop, reposition, extend, and export a 2560×1440 banner within memory/time budgets. No backend service is required.

### 17.7 Realistic Limitations (stated honestly)

- **You cannot prevent YouTube's re-encoding.** Measuring a w1707 slice at 134 KB is the evidence. The product can only ensure the *source* is optimal (correct size, sRGB, no upscaling, no avoidable compression damage) and *predict* the outcome.
- **You cannot guarantee "no quality loss."** That is the anti-promise; the document explicitly rejects it. The product's export is the best-possible source; the platform will still compress.
- **Colour fidelity is approximate.** Normalising to sRGB is the correct default, but a user's wide-gamut source will be clamped to sRGB. The product informs rather than promises.

### 17.8 "Quality Optimization" — What It Does and Does Not Promise

**Promises (MVP-verifiable):**
- No upscaling beyond the source's native raster (REQ-007).
- sRGB normalisation (REQ-006).
- Format choice with correct `blob.type` (REQ-011).
- <6 MB guaranteed without degrading below a quality floor (REQ-012, REQ-029).
- A preview of the re-encode so the user knows what to expect (REQ-005).

**Does not promise:**
- Preservation of a wide gamut beyond sRGB.
- Prevention of YouTube's compression.
- "Lossless" or "highest quality possible" as an absolute.

### 17.9 MVP-Safe Version vs Future Intelligence

**MVP (Must):** cover-fit + reposition + zoom + safe-rect detection + sRGB + <6 MB + re-encode preview + no-upscale rule. All deterministic, all client-side, all verifiable.

**Later (post-validation):**
- Saliency-based auto-subject detection (place the most important region in the safe rect automatically) — but only if the manual repositioning proves insufficient (measure via abandonment).
- Noise-aware sharpening *only if* evidence supports it for JPEG re-encoding (the earlier pre-sharpen idea is **rejected** because measured output is JPEG and pre-sharpening adds ringing; do not build unproven optimisations).

---

## 18. Preview and Safe-Area Strategy

### 18.1 The Four Device Views

Each view renders a live crop of the canvas using the *measured* frame-fraction rectangles:

| Device | Frame fraction | On 2560×1440 | Source |
|---|---|---|---|
| TV | 1.0 × 1.0 | 2560×1440 | FACT (`00000000ffffffff`) |
| Desktop | 1.0 × 0.2942 | 2560×424 | FACT (`00005a57ffffa5a8`) |
| Tablet | 0.7246 × 1.0 | 1855×1440 | FACT (`23400000dcbfffff`) |
| Mobile (safe) | 1.0 × 0.2942 (safe-rect equivalent) | 1546×423 @ 2560×1440 | FACT (safe rect, §18.2) |

**Note:** The "mobile" full-view is the safe rect; the "desktop" horizontal slice (2560×423) and the "mobile" safe rect (1546×423) are not identical shapes but both are the guaranteed-visibility region. The product will label them as they are: **Desktop** shows a wide horizontal slice; **Mobile** shows the safe-rect. The user sees the *actual* crop for each, which is the point.

### 18.2 The Safe Rectangle — Precise Definition

The safe rect in frame fractions is **60.3% × 29.3%, centred** (0.1985, 0.3535) → (0.8015, 0.6465) normalised to the frame. Equivalences:
- 1235×338 @ 2048×1152 (official, FACT)
- 1546×423 @ 2560×1440 (community/micro-tool, FACT)
- Both = 60.3% × 29.3% of the frame.
- iOS/very-narrow carry-over: mobile uses the same safe rect.

### 18.3 How the Simulation Works

**REQ-005 mechanism:** When the user toggles "Simulate YouTube's compression":
1. Take the current canvas (2560×1440).
2. Downscale to the observed served width for the preview device (desktop → ~w1707).
3. Re-encode via `canvas.toBlob('image/jpeg', quality)` with quality chosen to target ~134 KB (desktop) — the observed budget.
4. Display the result, labelled "approximate."
5. The user sees the blur *before* it happens, framing the expectation correctly.

### 18.4 Safe-Area Detection Logic (the "Cut Off" Algorithm)

For each content layer (text, face-marked region, logo placeholder):
1. Compute its bounding box in frame fractions.
2. Test intersection with the safe rect.
3. If any edge *overflows* the safe rect → produce a specific verdict: which layer, which edge, which device.
4. Present as a direct statement + a min/max drag target so the user can move the element back inside.

This is **positive** guidance — the user learns the safe-region boundary by moving content until the warning clears, rather than decoding a dotted overlay.

---

## 19. Export Strategy

### 19.1 Export Path

```
canvas (2560×1440, sRGB) → toBlob(type, quality) → check blob.type falls back
→ byte-size check → < 6 MB? yes → download   no → quality search (≥3 steps, floor 0.7 JPEG)
→ final resolve → download
```

### 19.2 Formats

| Format | Use case | Notes |
|---|---|---|
| PNG | Text-heavy / gradients / logo crispness | Guaranteed by `toBlob` (FACT); larger files |
| JPEG | Photo banners | Default; quality floor 0.7 to avoid banding (REQ-029) |
| WebP | Smallest file, most modern | Optional support; must check then fall back to PNG if unsupported |

### 19.3 Quality / Format Guidance

The UI presents a **quality hint**, not a wall of options: *"Photo backgrounds → JPEG. Text or logo focus → PNG."* Default is JPEG which balances size and edges; PNG is one click away.

### 19.4 Honest Download

- File name: `youtube-banner-2560x1440.png/jpg/webp`.
- The download is **the product**. No watermark, no quota, no upsell (REQ-024, REQ-025).
- State the re-encode reality in the "after you download" note (REQ-005).
- `blob.type` mismatch note is shown (REQ-011).

---

## 20. MVP Scope

### 20.1 Must Have (MVP ships with these; the core job fails without them)

- REQ-001 fraction-based crop model
- REQ-002 per-device preview
- REQ-003 safe-area enforcement (hard constraint)
- REQ-005 re-encode simulation
- REQ-007 no-upscale rule
- REQ-008 cover-fit + subject repositioning
- REQ-010 exact-size 2560×1440 export
- REQ-011 format choice + blob.type verification
- REQ-012 sub-6 MB enforcement
- REQ-013 validation verdicts (Check)
- REQ-015 template-first Create
- REQ-016 curated template library (≥24)
- REQ-018 editable text
- REQ-020 upload background/photo
- REQ-022 sessionStorage handoff
- REQ-023 no account
- REQ-024 no watermark
- REQ-025 no download limit
- REQ-027 browser-first
- REQ-028 performance budget
- REQ-030 graceful degradation

### 20.2 Should Have (MVP ships if cheap, else v1.1)

- REQ-004 safe-rect reconciliation (1235×338 == 1546×423)
- REQ-006 sRGB normalisation
- REQ-009 background extension
- REQ-014 CDN cache disclaimer
- REQ-017 niche template categories
- REQ-019 curated font set
- REQ-021 no-search-browsable gallery
- REQ-026 file-size vs dimension clarity
- REQ-029 JPEG quality floor

### 20.3 Later (post-validation)

- Saliency-based auto-subject detection (§17.9)
- AI-assisted "describe your channel" banner (only if it adds value; not a default)
- Non-YouTube formats (LinkedIn banner FR, Twitch panels, X/Twitter) — phase 3, gated
- `/fr/` localization
- Individual template pages (if search demand justifies)
- Accessibility-friendlier templates (dark mode template variants)

### 20.4 Reject (explicitly not built)

- **Auth/accounts/signup/login** (REQ-023 forbids it; works trivially against principle 1)
- **Saved projects / cloud storage** (anti-overengineering; sessionStorage only)
- **Watermark or download counters** (trust violation)
- **Email-gated download** (anti-pattern identified in E-08)
- **Freeform layer editor** (layers/z-order/blend modes/masks — turns us into a Canva clone)
- **Stock photo library** (asset breadth is the platforms' game; not our wedge)
- **AI banner generation / "banner from prompt"** (unproven, high complexity; the anti-overengineering section)
- **Background removal** (needs server or heavy client ML; not MVP)
- **Multi-format in v1** (LinkedIn/Twitch/X; phase 3)
- **Animated banners** (YouTube banner is static; animation is moot)
- **Template counts in the thousands** (inverse of quality)
- **Team collaboration / brand kits** (not our user)
- **Server-side image processing** (client-side is faster, cheaper, more private)

---

## 21. Future Scope

### 21.1 Phase 2 — Design & SEO Depth

- Expand templates to ~40–60 with new niches (gaming/esports, tech, fitness, vlog, music).
- Enhance the re-encode simulation accuracy (probe multiple widths, tune to actual observed budgets).
- Additional device widths (measured more URLs for non-varitasium channels to confirm crop fractions generalize).
- `/fr/` launch (see §30).

### 21.2 Phase 3 — Adjacent Formats

- **LinkedIn banner** (FR cluster is >10,000 per supplied data) — reuses the fraction+crop+crop engine, different safe-rect constants.
- **Twitch panels** (US cluster >1,000) and **Twitter/X banner** (>1,000).
- Each is a new "door" that reuses the engine; only the spec constants change.

### 21.3 Rejected Follow-Ons (do not add unless evidence changes)

- AI text-to-banner.
- A creator SaaS (collaboration, scheduling). This is specifically what turned CollabPals into a lead magnet and is the anti-goal.
- A mobile app. The browser tool with an app-like PWA offer is sufficient; a native app is not justified.

---

## 22. Explicitly Out of Scope

1. Authentication, accounts, saved projects, cloud storage.
2. Collaboration, sharing, brand kits, team roles.
3. Any backend service, database, or server-side image processing.
4. Server-rendered image generation / AI.
5. Template counts in the thousands; stock-photo libraries; asset search.
6. Non-YouTube formats in v1 (LinkedIn, Twitch, X).
7. Animated banners, video backgrounds.
8. Freeform layer-based editing (z-order, blend modes, masks, arbitrary shapes).
9. A marketplace or paid template store in v1 (see §35).
10. Native mobile app.
11. Any feature that requires the user to upload to a server (privacy + speed + trust) — all processing stays local.
12. Any claim of "lossless" or "no quality loss" (see §17.8).

---

## 23. Design System Direction

### 23.1 Visual Identity Principles

- **Warm, minimal, premium, calm.** Not a corporate SaaS dashboard; not a purple-gradient AI aesthetic; not Canva-clone clutter. The brand *is* the product — a focused, trustworthy tool.
- **No excessive cards, no crowded sidebars, no glassmorphism.** A single clean editor surface.
- **Editor-first:** the canvas is the hero; controls are quiet and secondary.

### 23.2 Colour

- **Neutral warm base** — off-white (#FAFAF8) and warm greys; one accent (deep teal #0F6E67 or burnt orange #C2542B — select in build). Avoid generic blue.
- **Status colours** used sparingly for validation (success green, warning amber, error red) — always with an icon + text, not colour alone (a11y).
- **YouTube-safe red** used only in the YouTube-brand moment (YouTube logo context), not as a UI tone.

### 23.3 Typography

- **Self-hosted, subset, WOFF2, preloaded, no layout shift.** (REQ-019.)
- Display/brand: a humanist sans (e.g., "Sora," "Inter Tight," "Plus Jakarta Sans" — pick one). Body: clear sans (e.g., "Inter"). Mono for specs/metadata (e.g., "IBM Plex Mono" or "JetBrains Mono") for the dimension/file-size readouts.
- At most 2 families + 1 mono; no arbitrary web-font picker in the editor (REQ-019).

### 23.4 Spacing & Components

- A single content column on content pages (~76ch); generous whitespace.
- Editor page: canvas left, one control column right (stacks on mobile).
- Primary CTA is a single repeated element (e.g., "Export banner"), never competing buttons.
- Buttons are square-ish, labelled, not icon-only except device switcher.

### 23.5 Primary Tagline (from §10)

> **See exactly what YouTube will cut — before you upload.**

### 23.6 UX Tone (from §10.5)

Pragmatic, calm, competent. Direct factual copy. Never hyped. Never condescending.

---

## 24. Technical Architecture

### 24.1 Stack

- **Framework:** Astro.js (mostly static islands; MPA).
- **Markup:** Semantic HTML.
- **Styling:** Tailwind CSS.
- **Deployment:** Cloudflare Pages.
- **Client runtime:** Zero UI framework. Vanilla TypeScript modules; Canvas 2D; `sessionStorage` for the cross-page session handoff.
- **Build:** Astro build → static assets. No server functions (unless a future need).

### 24.2 MPA / Static-first

- Every page is a pre-rendered static HTML file (best for SEO + Core Web Vitals + minimal JS).
- The only client JS is the tool island(s) and a small nav/theme enhancer.
- Client-side rendering only where required (the canvas), and only on the tool routes.

### 24.3 Route Map

| Route | Type |
|---|---|
| `/` | Static page |
| `/tools/youtube-banner-maker` | Static shell + client tool island |
| `/tools/youtube-banner-resizer` | Static shell + client tool island (same engine, different entry) |
| `/tools/youtube-banner-checker` | Static shell + client tool island |
| `/guides/youtube-banner-size` | Static content page |
| `/guides/youtube-banner-safe-area` | Static content page |
| `/templates/<niche>` | Static content page + anchor links to the maker with a preselected template |
| `/fr/...` (phase 2) | Static, localized |

### 24.4 Component Boundaries

- **Tool engine** — pure TS, no framework, no DOM outside render. Reads a JSON scene; renders to canvas; produces exports.
- **Tool UI** — thin vanilla-TS wrapper around the engine (no framework of any kind); owns keyboard, drag, controls.
- **Scene / SceneSerialiser** — JSON representation of the current banner state. The single source of truth both doors read/write.
- **TemplateManifest** — JSON of templates (`/data/templates/*.json`), bundled, so the maker can instantiate.
- **guides/content** — static Astro content collections.

### 24.5 Client-Side State

- **Scene** (layers, background, fonts, colours, safe-rect offsets) serialised to `sessionStorage` under one key (REQ-022).
- No other client state; no accounts; no local DB.

### 24.6 Image Processing

- **Canvas 2D** only — `drawImage`, `getContext('2d', {colorSpace:'srgb'})` for sRGB normalisation (REQ-006).
- **Scale** via integer-aware drawing to avoid blurry upscale (REQ-007).
- **Export** via `canvas.toBlob` (REQ-011, REQ-012, REQ-029).
- **No** WebGL, no WASM, no server.

### 24.7 Rendering / Export Strategy

- Live preview: render scene at display scale (e.g., 0.5×) to on-screen canvas; low cost.
- Export: render at full 2560×1440 to an offscreen canvas, then `toBlob`.
- Supersampling for sharpness: **only if canvas permits** (iOS 4096 cap — FACT — means never 2× on iOS); use a runtime probe.

### 24.8 Asset Strategy

- **Fonts:** self-hosted, subset, WOFF2, preloaded. No remote font CDN (REQ-019, performance).
- **Templates:** static JSON bundled; no lazy-load fetch for MVP (small library).
- **Images (illustrations in templates):** pre-rendered/optimised; inline where small (favicons, icons); sparse.

### 24.9 Caching Strategy

- **Cloudflare Pages** standard static caching; long-lived immutable asset hashes.
- **No client-side ImageManipulation caching** needed (small scenes).
- Re-encode simulation is not cached; it's client-computed.

### 24.10 CDN Strategy

- Cloudflare Pages edge; serve static; browser cache immutable assets.
- No dynamic origin needed (no backend), so no SSR/edge function requirement in MVP.

### 24.11 Error Handling

- Canvas unsupported / JS disabled → `<noscript>` fallback (REQ-030).
- Image decode failure → friendly message + retry.
- Export `toBlob` null → retry once; if still null, show "Your browser can't export an image right now."
- Track fatal errors to analytics (no crash-silent UI).

### 24.12 Accessibility (detailed)

- Keyboard operability of all controls (drag-fallback to arrow keys for repositioning).
- `aria-live` region for validation/verdict messages.
- Colour not sole signal (icon + text).
- WCAG AA contrast.
- Canvas has a text fallback.
- Focus visible; no focus-trap traps.

### 24.13 Analytics & Privacy

- Cookieless, first-party-only, aggregated analytics (e.g., a tiny self-hosted counter or Plausible-style, no third-party trackers).
- No user image content leaves the browser (REQ-027). (Analytics tracks anonymous events only, not pixels of the image.)
- Privacy policy states all processing is client-side.

### 24.14 Security

- No user data at rest on any server; no account; minimal attack surface.
- Template JSON is trusted build-time content, but still sanitized if ever rendered as HTML.
- No external API calls in the tool path.

### 24.15 Deployment / CI-CD

- Cloudflare Pages from GitHub repo.
- GitHub Actions: `npm ci` → `astro build` → deploy.
- CI validates: `astro check`, `eslint`, and a template-validation step (§16.3).

---

## 25. Astro.js Architecture

- **Content Collections** for guides, templates, localized pages.
- **Islands**: only the tool route mounts a client script; everything else is zero-JS.
- **`View Transitions`** optional; default off until performance verified.
- **Routing**: `src/pages/` filesystem; dynamic templates via `[niche].astro` (optional).
- **SSR**: none. All static. Astro render in build only.

---

## 26. MPA Architecture

- Pre-rendered HTML per route (SEO, CWV, minimal JS).
- No SPA client router. The tool is a single island; navigation between Doors is via `sessionStorage` + full page load.
- The maker/resizer/checker share a single engine; the "door" is a URL + an entry parameter, not a separate app.
- This is the simplest architecture that delivers the product — one engine, three URLs, zero backend.

---

## 27. Client-Side Processing Architecture

### 27.1 The Tool Island

A single `<script type="module">` (vanilla TS) that:
1. Reads the scene from `sessionStorage` (or a URL preset like `?template=gaming`).
2. Renders the live preview to `#canvas-preview`.
3. Handles the editor controls.
4. Renders the four device previews and the re-encode simulation.
5. Runs validation.
6. Exports via offscreen canvas + `toBlob`.

### 27.2 Render Pipeline

```
Scene (JSON) → compose layers in order (bg, photo, shapes, text)
→ render to preview canvas (display scale)
→ render to export canvas (2560×1440, sRGB context)
→ toBlob(type, quality)
```

### 27.3 Memory / Performance

- Only one full-size export canvas exists transiently; disposed after `toBlob`.
- Previews are small (display scale). No need to keep 2560×1440 in memory except during export.
- The simulation canvas (w1707) is created, rendered, exported, then released.

---

## 28. Data and Template Schema

### 28.1 Scene (client state)

```jsonc
{
  "version": 1,
  "canvas": { "width": 2560, "height": 1440 },
  "background": {
    "type": "solid" | "gradient" | "image",
    "solid": "#0B0B0F",
    "gradient": { "from": "#0B0B0F", "to": "#1B1B2F", "angle": 135 },
    "image": { "src": "blob-url", "cover": true, "offsetX": 0, "offsetY": 0, "zoom": 1 }
  },
  "layers": [ // max ~8; text + shapes
    {
      "id": "title",
      "type": "text",
      "text": "Channel Name",
      "font": "sora-700",
      "size": { "value": 96, "min": 48, "max": 160 },
      "color": "#FFFFFF",
      "align": "center",
      "position": { "x": 0.5, "y": 0.4 },   // frame fractions
      "safeAreaConstrained": true              // enforced by engine
    }
  ],
  "export": { "format": "png" | "jpeg" | "webp", "quality": 0.95 }
}
```

### 28.2 Template (build-time JSON manifest)

```jsonc
{
  "id": "gaming-neon",
  "niche": "gaming",
  "name": "Neon Arcade",
  "preview": "/assets/previews/gaming-neon.jpg",
  "background": { "type": "gradient", "from": "#12002A", "to": "#3A0CA3", "angle": 135 },
  "layers": [
    { "role": "title",  "text": "Your Channel Name", "x": 0.5, "y": 0.42, "font": "sora-800", "size": 104 },
    { "role": "tagline","text": "Gameplay • Tutorials • Live", "x": 0.5, "y": 0.56, "font": "inter-500", "size": 40 },
    { "role": "shape",  "type": "rect-decor", "x": 0.18, "y": 0.40, "w": 0.06, "h": 0.05, "color": "#4361EE" }
  ],
  "protected": true,
  "safeAreaValidated": true   // CI check asserts primary elements within safe rect
}
```

**Safe-rect fraction constants** (single source of truth, `src/lib/spec.ts`):
```ts
export const SAFE = { x: 0.1985, y: 0.3535, w: 0.603, h: 0.293 };
export const DEVICES = [
  { key: "tv",       label: "TV",      rect: { x:0, y:0, w:1, h:1 } },
  { key: "desktop",  label: "Desktop", rect: { x:0, y:0.3529, w:1, h:0.2942 } },
  { key: "tablet",   label: "Tablet",  rect: { x:0.1377, y:0, w:0.7246, h:1 } },
  { key: "mobile",   label: "Mobile",  rect: SAFE },
];
```

---

## 29. SEO Architecture

### 29.1 Strategy

**RECOMMENDATION.** Acquire on the informational cluster (`youtube banner size`, `youtube banner dimensions`, `what size is a youtube banner`, `youtube banner size for all devices`), convert to the tool. The tool pages capture the smaller but real tool-intent. Do **not** attempt to win `youtube banner template` head-on (platform-held, OBSERVATION).

### 29.2 Page-by-Page Requirements (see §14.1 table for the summary)

| Page | Intent | Cluster | Unique value | CTA | Internal links | Indexable |
|---|---|---|---|---|---|---|
| `/` | product | — | Promise + honest crop/re-encode explainer | Make / Fix | all | ✅ |
| `/tools/youtube-banner-resizer` | fix | resizer | subject-aware fit, no distortion | upload | → guides, maker | ✅ |
| `/tools/youtube-banner-maker` | create | maker, creator | curated geometry-safe templates + previews | choose template | → guides, fix | ✅ |
| `/tools/youtube-banner-checker` | validate | checker | verdicts + one-click fix | upload | → fix | ✅ |
| `/guides/youtube-banner-size` | info | size/dim | authoritative device-crop table + re-encode truth + safe-area reconciliation | try tool | → safe-area, resizer | ✅ |
| `/guides/youtube-banner-safe-area` | info | size for all devices | 1235×338 == 1546×423, worked | try tool | → size, resizer | ✅ |
| `/templates/<niche>` | niche | template | real templates, real value | use template | → maker | ✅ (≥3 real templates) |

### 29.3 Page Copy Specifics

- **Title (home):** "YouTube Banner Maker — Free, No Sign-Up, Correct on Every Device"
- **H1 (home):** "Make a YouTube banner that fits on every device — free"
- **Meta desc (home):** "Free YouTube banner maker. Correct 2560×1440, safe-area aware, device preview, no account, no watermark. See what YouTube will cut before you upload."
- **H1 (size guide):** "YouTube Banner Size: 2560×1440, Safe Area & Device Crops"
- **Meta desc (size guide):** "The correct YouTube banner size is 2560×1440 px (min 2048×1152), max 6 MB. Safe area 1235×338. See the real device crops and why your banner gets cut off."

### 29.4 Structured Data

- **`Product` / `SoftwareApplication`** on the tool pages (name, about, offers free). Valid and appropriate.
- **`FAQPage`** on the size guide (3–5 genuinely useful Q&As: "What is the exact size?", "Why does my banner get cut off?", "What is the safe area?", "Why does my banner look blurry after upload?", "Why won't my banner update?"). Only questions with real, accurate answers.
- **`BreadcrumbList`** on guides/templates.
- **`WebSite`** on home with `SearchAction` only if we add internal search (we don't — REQ-021). Omit SearchAction since there is no search feature.
- **`ImageObject`** for preview images.

### 29.5 Open Graph

- `og:title`, `og:description`, `og:type`, `og:image` (a generated banner preview), `og:url`.
- `twitter:card` = `summary_large_image`.

### 29.6 Canonical

- Every page has a self-referential canonical (`<link rel="canonical" href="...">`).
- Avoid duplicate content: no pagination (no result lists), no trailing-slash variants (Cloudflare Pages config).

### 29.7 XML Sitemap

- `/sitemap.xml` (static, generated by Astro `@astrojs/sitemap`) with all indexable pages.
- `robots.txt` allows all, points to sitemap.

### 29.8 Image SEO

- Template previews: descriptive alt text, `loading="lazy"` where below-the-fold, `width`/`height` to prevent CLS.
- No giant unoptimized template images; pre-generate a small gallery thumbnail.

### 29.9 Template-Page SEO

- Category pages have real, distinct text describing the templates (not lorem). Each page links to the maker with a preselected template.
- **Never** individually index each template in MVP — would be thin duplicates.

### 29.10 Internal Linking Architecture

```
homepage
  → /tools/youtube-banner-maker
  → /tools/youtube-banner-resizer
  → /guides/youtube-banner-size    (the acquisition hub)
      → /guides/youtube-banner-safe-area
      → /tools/youtube-banner-maker
      → /tools/youtube-banner-resizer
  → /templates/<niche>  (5-6)
      → /tools/youtube-banner-maker
footer: spec reference, sitemap, legal
```

### 29.11 Pagination Strategy

None. No list pages that paginate in MVP. All template categories are small.

### 29.12 Duplicate/Thin Content

- No thin programmatic pages. Category pages only with ≥3 distinct templates.
- The exact same tool text does not appear across maker/resizer/checker; each has a distinct narrative.

### 29.13 Core Web Vitals

- `LCP < 0.8s`; `CLS < 0.1`; `INP < 200ms` for the tool route.
- Preload fonts and critical CSS; no render-blocking JS.

---

## 30. Internationalization Strategy

### 30.1 Initial Market

**RECOMMENDATION: United States / English.** Rationale (§4.1.4): US/UK head term is an order of magnitude larger than the French cluster; French evidence is unverified (no SERP data this session); the product's winnable cluster (size/fix) is strongest in English.

### 30.2 Phase 2: France

- **When:** after US validation (see §38) and a French-SERP check (banner.yt/CollabPals/Adobe Express localisation) — do not assume the French SERP is empty of competitors.
- **Content:** `/fr/` subdirectory, hreflang `fr-FR` / `fr` → `/fr/...`; `en` → `/...`.
- **English EMD appropriateness:** `YTBannerStudio.com` is an English-language EMD. For a French-facing product, surface `/fr/news/` content in French but keep the domain. An EMD is **not** a ranking mechanism; the domain matters mainly for brand and CTR. On French SERPs, a translated French page on an English domain can still rank; the EMD is not a blocker and not a guarantee. **Do NOT register a separate French domain.** (Single-domain, subdirectory, hreflang is the SEO-correct approach.)
- **Localization priorities:** all tool copy + guides; keep the URL slug translated (`/fr/outil/banniere-youtube`), not `créer-bannière` pseudo-translations.
- **Keyword mapping (French):** `bannière youtube` (>1k), `dimension bannière youtube` (>1k), `créer bannière youtube gratuit` (>100). Note the supplied list shows `créer` queries clearly tool-intent.

### 30.3 Not Recommended for MVP

Multi-market launch. No multi-language on day one. The US engine + one language is the validation surface.

---

## 31. Performance Requirements

- **JS:** no framework; total initial JS ≤ ~65 KB gzip for the tool page. No React/Vue/Svelte.
- **LCP < 0.8s** mid-tier mobile, on 3G test background no (real-world): no third-party render-blocking JS.
- **CLS < 0.1**.
- **INP < 200ms.**
- **Fonts:** preloaded, subset, WOFF2. No layout shift.
- **Images:** pre-sized, lazy below fold.
- **Cache:** immutable asset hashes; static HTML at edge.
- **Bundle:** no dynamic import for MVP templates (static JSON, tiny).

---

## 32. Accessibility Requirements

See §24.12. Summary:
- Keyboard navigation with visible focus; arrow-key drag fallback.
- `aria-live` for validation messages.
- Colour + icon + text for statuses (not colour alone).
- WCAG AA contrast.
- `<canvas>` textual fallback via `<noscript>`.
- Controls labelled with `aria-label`.
- Do not rely on hover for any critical action.

---

## 33. Privacy and Security

### 33.1 Privacy

- All image processing is **client-side** (REQ-027). No user image is uploaded to a server.
- Analytics is cookieless, first-party, aggregated; no pixels of user content.
- `sessionStorage` only for intra-session handoff; cleared on tab close.
- Privacy policy states: no account, no image processing server, no tracking of content.

### 33.2 Security

- No user accounts → no auth tokens, no session hijack risk for content.
- Template JSON is build-time-trusted; if ever rendered as HTML, sanitize (no user input in JSON).
- Canvas export creates local blobs; object URLs revoked.
- No third-party scripts on the editor. Minimal third-party anywhere.
- Cloudflare Pages: HTTPS enforced; security headers (`Content-Security-Policy` allowing only self, template files, fonts).

---

## 34. Analytics and Measurement

### 34.1 Activation & Completion Events

| Event | Definition | Target |
|---|---|---|
| `template_selected` | user picks a template | — |
| `editor_start` | user reaches a non-empty canvas | — |
| `upload` | user uploads an image (Fix/Check) | — |
| `validation_run` | Check verdicts produced | — |
| `export_start` | user clicks export | — |
| `export_success` | download triggered | — |
| **`activation`** | (Fix) upload + export_success; (Create) editor_start + export_success | — |
| **`time_to_banner`** | time from landing to export_success | — |
| `re_export` (a proxy for the "blurry loop") | repeated export_success after a failed check | — |

### 34.2 SEO Metrics

- Impressions/clicks for `youtube banner size` and cluster.
- Landing-page-to-tool conversion rate (guide → editor_start).
- Side-by-side channel attribution (how many visitors arrive via guides vs direct tool).

### 34.3 Core Web Vitals Targets

- `LCP < 0.8s`, `CLS < 0.1`, `INP < 200ms` on mobile.
- Repeated measurement via real-user monitoring (RUM) from the start.

### 34.4 Product Success

**The MVP optimizes for learning, not feature count.** Primary success metrics:
1. **Activation rate** — % of sessions reaching `export_success` (of those that start a door).
2. **Fix-door completion** — % of uploads reaching `export_success` (proves the majority job works).
3. **Re-export loop reduction** — the fraction of users who export again within the session after a simulated re-encode preview; should *decrease* as the simulation works (users stop iterating pointlessly).
4. **Guide→tool conversion.** 
5. **CWV health** (a hard gate, not aspirational).

### 34.5 Qualitative Feedback

- A one-tap "Was this useful?" banner on the export screen (no email capture).
- On-page "Report problem" link.
- Periodic review of the Check verdicts to find new pain patterns.

---

## 35. Monetization Strategy

The product is free. **No monetization in MVP.** Later options, ranked by least-damaging:

1. **Affiliate links** — honest, non-intrusive. E.g., "Need a logo? Recommended tools →" (creator-adjacent tools). Fits the minimalist UX (a footer link, not a popup). Low risk to trust.
2. **Sponsored template packs** — a partner brand pays for a "designed by X" template bundle; clearly labelled. Fits the curated approach. Medium risk (must be clearly branded to avoid dark-pattern feel).
3. **Display ads** — the highest risk to the minimalist, premium feel. Only if traffic is large enough to justify; would likely degrade the experience. Prefer not in MVP.
4. **Non-core paid utilities** — e.g., batch/resize multiple banners (a small utility), profile-picture/end-screen helpers, that aren't the core job. Only after the core is validated and as a separate, non-interrupting surface.

**Explicitly rejected:**
- **Watermark-free-as-a-paid-tier.** Core product already watermark-free; selling "no watermark" is a lie and a trust destroyer.
- **Download limits/quotas.** Anti-pattern (Snappa, FACT).
- **Email-gated download.** Anti-pattern (E-08).
- **"Pro" upsell mid-flow.** Never interrupt the core job.

**Free forever:** the core make/fix/check/export. **Plausibly paid later:** non-core utilities, sponsored template packs, affiliate links. Never break trust.

---

## 36. Competitive Defensibility

### 36.1 What Competitors Can Copy Easily

- Zero-friction, no-signup export (micro-tools already have it).
- Safe-zone overlay (banner.yt, CollabPals already have it).
- Device preview tabs (same).
- 2560×1440 canvas (everyone).
- Fraction-based crop model (a competent engineer reconstructs it in days from the observed `fcrop64`).
- JPEG re-encode simulation (copyable in a month once known).

### 36.2 What Takes Time to Replicate

- **A curated library of genuinely designed, geometry-safe templates.** Quality compounds; quantity doesn't. A platform would have to *redo* its templates to be fraction-safe. This is the slowest thing to copy and the most aligned with our differentiation.
- **Topical authority on the size/crop/quality cluster.** The informational SERP the platforms don't hold. This is a UGC-free content moat — it compounds as the content matures and earns links.
- **Brand association with the narrow job.** "The tool that checks your banner before YouTube does" — earned through consistency, not a feature.

### 36.3 What Gets Stronger with Usage

- **Template quality** (we refine based on usage/validation feedback, which micro-tools with no design investment won't).
- **The validation ruleset and the re-encode model.** Every real user's Check verdict and post-upload outcome refines the simulator. This is a data flywheel even without accounts (on-page feedback).

### 36.4 What Produces Distribution Advantage

- **The size-guide page** as a linkable asset.
- **Each template category** page as a small landing surface.
- **Adjacent formats** (phase 3) reuse the engine + content — cheap expansion.

### 36.5 Realistic Defensibility Thesis

**No single moat.** Defensibility is the compounding of:
1. **Correctness reputation** — the only falsifiable claim in the category; verified by the user at upload time.
2. **Template quality + safe-by-construction** — slow to copy, aligned with the wedge.
3. **Topical SEO authority** on the winnable cluster.
4. **Brand = the job** (trust, zero-friction).

Platforms won't add YouTube-specific enforcement to a generic editor (incentive mismatch) and micro-tools (lead magnets for unrelated SaaS) won't invest in design quality. **The defensibility is being the one tool that does the narrow job extremely well, correctly, and honestly.**

---

## 37. Launch Strategy

### 37.1 Pre-Launch Research Validation (quick)

- Confirm the `fcrop64` fractions generalize across several non-\@veritasium channels (not just one).
- Re-verify the w1707-byte budget on more channels (the observed 134 KB is one sample; the desktop full-width was 263 KB; the product should expose a typical band, not one number).
- Verify French SERP state (if France is pursued) — do not assume empty.
- Confirm the EMD registration (`ytbannerstudio.com`) is actually available and acquire it.

### 37.2 MVP Build Sequence

1. Build the fraction-based crop engine and the four-device preview (the core promise).
2. Build the Fix door — the majority job and the most differentiated.
3. Build the Make door and the ~24 templates.
4. Build the Check door.
5. Build the guides (size + safe-area) — the acquisition surface.
6. Wire analytics + CWV.
7. Ship behind the EMD ON Cloudflare Pages.

### 37.3 Post-Launch

- Measure activation + CWV + re-export loop reduction.
- Update the re-encode model with observed data.
- Expand templates based on which categories convert.
- Decide on France (phase 2) and adjacent formats (phase 3) from data, not assumption.

---

## 38. Validation Plan

### 38.1 The Strongest Validation Experiment

**Ship only Door 1 (Fix) + the size guide page.** This is the minimal thing that tests the hypothesis and the majority job (B/C/D). Measure:
- Upload-intent completion: % of sessions that upload an image and reach `export_success`.
- Whether the simulated-re-encode preview reduces re-export loops.
- Guide-to-tool conversion.

**If people won't finish the Fix flow, no template library saves the product** — the Fix door and the honest preview are the load-bearing experiments.

### 38.2 Falsification Criteria

- **Hypothesis falsified if:** high upload rate but very low export-completion, OR high abandonment in the repositioning step (users can't figure out subject-aware drag). Then the UX of repositioning needs redesign before anything else.
- **Hypothesis falsified if:** guide pages get traffic but near-zero tool conversion — then the "acquire on info, convert on tool" model needs rework (maybe the tool needs to be even more front-and-centre).

### 38.3 Lightweight Validation (no complex instrumentation)

- A/B the Export CTA wording (e.g., "Export banner" vs "Download for YouTube").
- A/B the homepage hero (promise vs how-it-works).
- Qualitative: watch 3–5 users complete the Fix flow; note where they pause.

---

## 39. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **R1: Correctness is a hard sell** — users search "maker"/"template," not "crop simulator" | High | High | Lead with make/template intent; deliver correctness beneath it. Tagline names the outcome, not the mechanics. |
| **R2: A platform adds safe-area enforcement** | Low-medium | Med-High | Their incentive is generic-editor; slow. Our advantage is correctness *reputation*, not just the feature. |
| **R3: Micro-tool improves output quality** | Medium | Medium | They are lead magnets for unrelated SaaS; unlikely to invest in design. Our template quality compounds. |
| **R4: The safe-area fractions don't generalize** | Low | High | Pre-launch validation over multiple channels (see §37.1). |
| **R5: French evidence is thin/unverified** | Medium | Medium | US-first; France gated on French-SERP check. |
| **R6: Upscaling is tempting but forbidden** | Medium | Medium | Hard rule REQ-007 + explicit guidance. Never upscale. |
| **R7: "No quality loss" promise risk** | Medium | High | Explicit anti-promise (§17.8). The product never makes it. |
| **R8: Colour shift not fully preventable** | Medium | Low-Med | sRGB normalisation (the correct default) + honest guidance. |
| **R9: Cross-device drop-off on mobile repositioning** | Medium | Medium | Match desktop drag with arrow-key fallback; simple, uncluttered mobile controls. |
| **R10: EMD ranking uncertain** | Medium | Low | Treat domain as brand/CTR asset only. Do not build the strategy on EMD ranking. |

---

## 40. Acceptance Criteria

### 40.1 Functional Acceptance

1. A user lands on `/tools/youtube-banner-maker`, selects a template, edits text, and exports a 2560×1440 image **without ever creating an account**. (REQ-015, REQ-016, REQ-023.)
2. The exported image contains **no watermark** and can be downloaded **unlimited times**. (REQ-024, REQ-025.)
3. Fix door: user uploads a portrait image, and the resulting banner keeps the subject inside the safe rect (via repositioning) **without distorting** the image. (REQ-008, REQ-009.)
4. The four device previews accurately reflect the measured crop fractions. (REQ-001, REQ-002.)
5. If content crosses the safe rect, the UI names the layer and device and offers a way to fix it. (REQ-003.)
6. Export under the 6 MB limit; if over, automatic quality search resolves it without degrading below the floor. (REQ-012, REQ-029.)
7. `blob.type` is verified; PNG/JPEG/WebP requested format is honored with fallback notice. (REQ-011.)
8. Check door produces valid, plain-language verdicts; each real finding links to a Fix action. (REQ-013.)
9. The tool works with JS disabled (static fallback). (REQ-030.)
10. All image processing is client-side; no user image leaves the browser. (REQ-027.)

### 40.2 Performance Acceptance

- `LCP < 0.8s`, `CLS < 0.1`, `INP < 200ms` on mid-tier mobile.
- Total tool-page JS ≤ ~65 KB gzip, no framework.

### 40.3 Quality Acceptance

- The 1235×338 == 1546×423 safe-rect reconciliation is correct and displayed. (REQ-004.)
- The re-encode simulation is labelled "approximate" and accompanied by honest copy. (REQ-005.)
- No template is a colour-swap of another; each category page has ≥3 distinct templates. (REQ-017, §16.5.)

### 40.4 SEO Acceptance

- All pages have self-referential canonicals, correct `<title>` and `<meta description>`, `og:` tags, `sitemap.xml`, `robots.txt`.
- Template category pages only exist with real content (≥3 distinct templates).
- No thin/duplicate pages.

---

## 41. Product Decisions and Rationale

| Decision | Choice | Rationale |
|---|---|---|
| Direction | Correctness-first utility (not pure maker/resizer/checker) | The category's dominant failure is post-upload crop/re-encode; and the naive "no-signup maker" is commoditized. |
| Primary door | Fix | The majority job (existing wrong image); most differentiated; tested by strongest validation experiment. |
| Differentiation | Falsifiable correctness (simulator + validation) | The only claim in the market the user can check at upload. Honesty as feature. |
| Templates | ~24 curated, fraction-authored | Quality over quantity (anti Canva-clone). Safe-by-construction fixes E-02/E-04/E-10/E-11. |
| Pre-sharpen before export | **Rejected** | Measured output is JPEG (not WebP); pre-sharpening adds ringing before re-encode. Unsupported. Use sRGB normalisation + no-upscale instead. |
| Background extension | Should, default off | Honest baseline; handles narrow-aspect without hard crop. |
| Safe rect | Single fraction constant | One source of truth; correct on all canvases; reconciles the two-rule confusion. |
| Non-YouTube formats | Phase 3, gated | Don't dilute the narrow-job brand before it's won. |
| France | Phase 2, gated | Unverified evidence; smaller win; US-first. |
| EMD | Brand/CTR asset only | Not a ranking mechanism; not a strategy. |

---

## 42. Final Strategic Verdict

### 42.1 What Product We Are Actually Building

A **free, no-account, browser-first YouTube banner correctness utility** — one engine, three doors (**Fix**, **Create**, **Check**), whose defining capability is a **verifiable per-device crop and upload-outcome simulator** built from YouTube's *measured* device-crop geometry and JPEG re-encode behaviour.

### 42.2 Who It Is For

New and small YouTube channel owners who need a professional banner, are not designers, and refuse accounts and paywalls. Secondarily, existing banner owners whose banner is cut off, blurry, or won't update.

### 42.3 The Exact Problem It Solves

The banner looks broken on viewers' devices because the platform crops and re-encodes — and every existing tool either doesn't enforce the constraint or doesn't tell the user what will happen. The product solves: **content cut off (G1), invisible re-encode blur (G2), blind-crop/distortion when fixing (G3), and deceptive "free" (G4).**

### 42.4 Why Users Would Choose It

Against platforms: no account, no download quota, no paywalled resize, and the constraint that actually governs the outcome is *enforced*, not footnoted. Against micro-tools: the output looks designed (not gradient+text), the Fix door handles off-centre subjects, and the previews are simulations, not decorative crops. Against all: it's the only one that answers "will this work?" before upload, and the only one honest about YouTube's re-encode.

### 42.5 Why the Product Can Win Despite Canva & Others

Canva's strength (beautiful templates) coexists with its weakness (geometry-unaware, account-gated, resize-behind-a-paywall). The product does not fight Canva on canvas or template count; it wins the **single, specific, checkable job** (correct, designed, honest, free) and acquires users on the informational SERP the platforms don't hold. The micro-tools prove the simple-interface floor but not the design-quality ceiling; the product occupies the intersection.

### 42.6 What the MVP Contains

The Must-Have requirements (§20.1): fraction-based crop model, four-device preview, safe-area enforcement, re-encode simulation, no-upscale rule, cover-fit + subject repositioning, exact-size export, format choice + `blob.type` verification, sub-6 MB enforcement, Check verdicts, template-first Create, ≥24 curated templates, editable text, upload background, sessionStorage handoff, no account, no watermark, no limit, browser-first, performance budget, graceful degradation.

### 42.7 What It Deliberately Does Not Contain

Auth, saved projects, cloud storage, watermark, download counters, email gates, freeform layer editor, stock library, AI generation, background removal, non-YouTube formats in v1, animated banners, thousands of templates, collaboration, brand kits, server-side processing, a mobile app, and **any claim of "no quality loss."**

### 42.8 Recommended Launch Market

**United States / English.**

### 42.9 Recommended SEO Strategy

Acquire on the informational cluster (`youtube banner size`, `dimensions`, `safe area`) via a genuinely authoritative size-guide + safe-area guide; convert to the tool via a clear "Try the tool" CTA. Capture tool intent via the maker/resizer/checker pages. Avoid the platform-held `youtube banner template` head-term. No doorway pages, no thin programmatic SEO.

### 42.10 The Defensibility Thesis

No single moat. Defensibility = **correctness reputation** (falsifiable, verified at upload) + **fraction-authored template quality** (slow to copy, aligned with the wedge) + **topical SEO authority** (the cluster platforms don't hold) + **brand = the narrow job** (trust, zero-friction). Micro-tools won't invest in design quality; platforms won't add YouTube-specific enforcement to a generic editor. This is the defensible middle.

### 42.11 The Biggest Risk

**Correctness is a hard sell on a landing page.** Users search "maker" and "template," not "crop simulator." Mitigation: lead with maker/template intent and deliver correctness *inside* the workflow — never lead with the mechanics over the outcome.

### 42.12 The Strongest Validation Experiment

**Ship Door 1 (Fix) + the size guide.** Measure upload→export completion and whether the simulated re-encode preview reduces pointless re-export loops. If users won't finish the Fix flow, no template library saves the product.

---

### Appendix A — Research Method & Evidence Gaps

**Method.** This document's evidence was gathered via direct fetches (Bing RSS SERPs, YouTube's own asset URLs via `youtube.com/@veritasium` → `yt3.googleusercontent.com`, competitor product and pricing pages, MDN, Google's YouTube support article). Where the WebFetch tool was blocked (Canva 403), curl with a real UA and two proxy approaches were also blocked; those sources are marked **UNVERIFIED** and no capability claim is attributed to them as FACT.

**Evidence Gaps (explicit).**
1. **Canva** — not directly observable this session. Capabilities, gating, watermark, template count, "Resize is Pro-only" all **UNVERIFIED**. Must be re-checked manually before any external marketing claims.
2. **French SERPs** — not retrievable this session (Bing returned Japanese/irrelevant results for `fr-FR`). France's market size rests on the supplied Ahrefs bands only. **No SERP-based competitor claim about France is made.**
3. **Reddit prevalence** — individual posts are qualitative evidence of pain, not quantitative evidence of market prevalence. No prevalence/percentage claims are derived from them.
4. **Ahrefs volumes** — supplied as **bands** (`>1000`, `>100`), not exact. No conversion to figures.
5. **`fcrop64` fractions** — measured from one channel (veritasium) this session. Requires multi-channel verification (§37.1) before treating as universal.
6. **134 KB re-encode budget** — one sample. The w1707 variant measured 134,061 bytes; the w2560 full-width 263,270 bytes. A "typical budget band" must be established with more samples before the simulator hard-codes a target.

**Tags used:** FACT / OBSERVATION / INFERENCE / RECOMMENDATION / UNVERIFIED. See §4 preamble.

---

*End of PRD.md*
