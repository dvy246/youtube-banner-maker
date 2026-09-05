# SEO.md — Search Strategy & Operating Standard

**Project:** YouTubeBannerMaker.com
**Status at time of writing:** Pre-launch. No live URL exists, so nothing in this document has been verified against a live crawl.
**Governing methodology:** `.agents/skills/seo-grandmaster` (five levers, evidence tiers, ICE, Recommendation Cards)
**Operating tooling:** `.agents/plugins/claude-seo` (`/seo …` commands)
**Companion documents:** `PRD.md` §29 (SEO architecture), `ARCHITECTURE.md` (build), `PLAN.md` (sequencing), `DESIGN.md` (visual system)

---

## 0. The one rule that overrides everything in this file

**No document, tool, or person can honestly state a probability, percentage, or guarantee that this site will rank.** Rankings depend on competitor behavior, algorithm changes, accumulated domain trust, and a real backlink profile — none of which this document controls. What it *can* do is maximize every controllable, documented factor inside Google's published rules, with evidence attached to each one. Anywhere this file says "should improve" or "is likely to," read it as exactly that and nothing stronger.

Corollary rules, in force for every page and every contributor:

1. **Evidence over assertion.** "Optimized" is not a status. The actual tag value, the actual schema block, the actual validator output, or it didn't happen.
2. **Never fabricate** search volume, keyword difficulty, traffic estimates, Core Web Vitals scores, or backlink counts. If a tool wasn't run this session, say so and reason from query construction and real competitor pages instead of inventing numbers.
3. **No keyword stuffing.** No exact-match phrase appears more than roughly once per 150 words of body copy. This is a Search Essentials violation category, not a style preference.
4. **Never fabricate structured data.** No `AggregateRating` without real reviews, no invented author credentials, no schema field describing something not genuinely on the page.
5. **No link buying, PBNs, reciprocal schemes, or undisclosed sponsored content.** Always Avoid, no exception.
6. **The Search Quality Rater gate.** Before any page ships: *if a Google Search Quality Rater read this exact page, what would they flag?* If the honest answer is "the thin content," "the rigged comparison," or "the templated feel," fix it before publishing.

---

## 1. The five levers, and where this site actually stands

Every recommendation below maps to one of these. Anything that doesn't map to one is cut, regardless of how popular it is.

| # | Lever | This site's position |
|---|---|---|
| 1 | **Can Google find and render the page?** | **Structurally strong by construction.** Astro MPA, pre-rendered HTML per route, zero-JS on every page except the tool island (`PRD.md` §26). The client-side-rendering trap that kills most SaaS marketing sites does not apply here. **Must still be verified, not assumed** — see §2. |
| 2 | **Does the page satisfy the person who typed the query?** | **The core bet.** The size/safe-area/crop cluster is a query set with a precise, checkable answer, and the product answers it correctly. This is the strongest lever available. |
| 3 | **Does the site look like it was made by people who know what they're talking about?** | **Earned, not claimed.** The device-crop rectangles and the re-encode behavior are measured facts other tools get wrong. Publishing the measurement method is the trust signal. |
| 4 | **Do independent sources point at it because it earned it?** | **Zero today.** A genuinely free, no-signup, no-watermark tool is the single best link-earning mechanism available at this budget — but it earns nothing until someone knows it exists. |
| 5 | **Can an AI answer engine extract a clean answer?** | **Additive only.** Rides entirely on levers 1–3. Structure for it; never optimize *for the citation* rather than for the reader. |

**Evidence tiers used throughout:** *Supported by Google* (Google's own docs state it) · *Consistent with Google* (clear low-risk application of a stated principle) · *Experimental* (practitioner-reported, unconfirmed) · *Avoid* (contradicts a named spam policy, or the honest cost/benefit is bad).

---

## 2. Phase 0 — the pre-launch indexing gate (blocking)

Nothing else in this document matters if these fail. Run before the first deploy is announced anywhere, and again immediately after.

| Check | Pass condition | How to verify |
|---|---|---|
| Primary content in initial HTML | Every guide and tool page's headline, body copy, and spec tables are present in `view-source:`, not injected by the tool island | View source on the deployed URL; do not trust the rendered DOM |
| `robots.txt` | Allows all, points to `/sitemap.xml`, blocks nothing the site needs rendered (including CSS/JS assets) | Fetch `/robots.txt` directly |
| No stray `noindex` | Zero `noindex` meta tags or `X-Robots-Tag` headers on production routes | Check response headers, not just HTML |
| Sitemap ↔ live routes | Every URL in `/sitemap.xml` returns 200 and is canonical to itself; every indexable route appears in the sitemap | Cross-check the generated sitemap against `src/pages/` |
| Canonicals | Every page carries a self-referential canonical; trailing-slash behavior fixed at the Cloudflare Pages level so only one variant resolves | Fetch both `/guides/youtube-banner-size` and `/guides/youtube-banner-size/` |
| Preview environments | No Cloudflare Pages preview deployment is crawlable or indexed | `noindex` on all non-production deployments |
| Mobile render | Every unique template tested on a real small viewport — the tool island and the device-preview strip are the elements most likely to overflow | Mobile-first indexing means this is what Google predominantly indexes from — **Supported by Google** |
| Schema validity | Every JSON-LD block validates, on every unique template | Google Rich Results Test + Schema Markup Validator |

**Tooling:** `/seo technical <url>` covers crawlability, indexability, security, URL structure, mobile, CWV, structured data, JS rendering, and IndexNow in one pass. Run it as the mechanical layer under this checklist, not instead of it.

**This gate is a hard stop.** Do not proceed to content or link work with any item open. Triage order if multiple items fail: (1) anything blocking indexing entirely, (2) anything with policy/trust risk, (3) everything else.

---

## 3. Technical foundations

### 3.1 The client-side rendering trap — avoided by design, verify anyway

**Evidence tier:** Supported by Google · **Lever:** 1
Google's crawler needs to see substantially what a user's browser sees. Marketing pages that render primary content via client-side JavaScript can be seen as effectively empty. Astro's static output means this site starts on the right side of that line — but "starts on the right side" is not evidence. Confirm via view-source on the deployed build, and via Search Console URL Inspection once the property is verified.

**Impact if broken:** binary and severe. A page that doesn't render for the crawler doesn't rank at all, regardless of content quality.

### 3.2 Core Web Vitals — the honest weight

**Evidence tier:** Supported by Google · **Lever:** 1 (indirectly), and primarily UX/conversion
**ICE:** Impact 4 / Confidence 8 / Ease 7 → **6.3**

Google has stated on the record that Core Web Vitals is a real ranking signal and more than a pure tie-breaker, but explicitly not a major ranking lever, and that a large ranking swing purely from fixing CWV scores should not be expected. Small and early-stage sites specifically should not put it at the top of the priority list.

Practical position for this project: a static Astro site with preloaded fonts and one JS island should reach good CWV nearly for free. `PRD.md` §29.13 sets internal targets (LCP < 0.8s, CLS < 0.1, INP < 200ms). Treat those as **engineering targets, not measurements** — no CWV number may be reported as achieved until real field data exists in Search Console or CrUX. Fix what is clearly bad; do not spend engineering weeks chasing a perfect Lighthouse score. That time is worth more spent on the size-guide content and on getting the tool in front of creators.

*Ease adjusted upward from the playbook default (6 → 7) because the static architecture removes the expensive part of CWV work.*

### 3.3 Canonicalization

**Evidence tier:** Supported by Google · **Lever:** 1

There is no duplicate-content *penalty* — but duplicates dilute which URL accumulates authority. This site's realistic duplicate sources are narrow, which is an advantage: no pagination, no faceted lists, no user-generated URLs. The ones that do exist must be closed deliberately:

- Trailing-slash variants → fix at the Cloudflare Pages level, one canonical form only.
- UTM-tagged marketing URLs → self-referential canonical on every page absorbs these.
- `/fr/` localized pages (Phase 2) → `hreflang` pairs (`fr-FR`/`fr` → `/fr/…`, `en` → `/…`) plus self-referential canonicals per locale. Never canonicalize a French page to its English equivalent.
- Template deep-links (`?template=gaming`) → canonical to the clean tool URL. Query-parameter variants must never be indexable.

### 3.4 Internal linking architecture

**Evidence tier:** Supported by Google · **Levers:** 1, 2, 4
**ICE:** Impact 6 / Confidence 7 / Ease 8 → **7.0**

Google's own site-organization guidance covers how directory structure and internal links help it understand topical grouping and crawl frequency. More importantly for this project: internal links are the mechanism by which externally-earned authority reaches pages that never earn links directly. Nobody links to a tool page; people link to a *definitive spec guide*. The guide is the bridge asset; the internal link carries its authority to the tool.

The structure from `PRD.md` §29.10 is correct as designed. The rules that keep it correct as the site grows:

- Every new page gets **2–3 contextual outbound internal links** and **1–2 inbound links** from existing relevant pages, added in the same commit. Not a later cleanup pass.
- **Anchor text is natural and descriptive**, never exact-match-stuffed. "the safe area for all devices" is right; "youtube banner size safe area free tool" is a stuffing signal.
- `/guides/youtube-banner-size` is the **acquisition hub**. It receives the most inbound internal links and passes authority to both tool pages and the safe-area guide.

*Ease adjusted upward (6 → 8) because this is a ~10-page site being built from scratch, not a retrofit.*

---

## 4. Keyword and on-page strategy

### 4.1 The cluster map

The strategic call in `PRD.md` §29.1 is sound and is restated here as binding: **acquire on the informational size/fit cluster, convert to the tool. Do not attack `youtube banner template` head-on** — that SERP is held by design platforms with vastly greater domain authority, and winning it is not a realistic near-term outcome.

| Cluster | Representative intents | Owning page | Why this page can win |
|---|---|---|---|
| **Size / dimensions** | exact size, dimensions, size for all devices, correct resolution | `/guides/youtube-banner-size` | Publishes the measured per-device crop rectangles and the safe-area reconciliation. Most competing pages restate the spec without the device geometry. |
| **Safe area / cut off** | why is my banner cut off, safe area, mobile crop | `/guides/youtube-banner-safe-area` | Works the 1235×338 ≡ 1546×423 arithmetic explicitly — the same rectangle at two canvas sizes. This confusion is widespread and unresolved elsewhere. |
| **Fix / resize** | resize banner, banner wrong size, fix blurry banner | `/tools/youtube-banner-resizer` | Subject-aware cover fit with no distortion; honest re-encode simulation. |
| **Create** | banner maker, free banner maker no sign up | `/tools/youtube-banner-maker` | Geometry-correct templates, no account, no watermark. |
| **Validate** | check banner, will my banner get cut off | `/tools/youtube-banner-checker` | Per-device verdict with one-click fix. |
| **Niche templates** | gaming banner, podcast banner, vlog banner | `/templates/<niche>` | Gated: ships only with ≥3 genuinely distinct templates per category. |

**Note on volume data.** No keyword tool was run in producing this document. The relative cluster sizing above is directional, derived from query construction and observed SERP composition, not from verified volume figures. Any number a stakeholder needs must come from a live tool run (`/seo cluster <seed>` for SERP-overlap clustering, or a real keyword tool), and must be attributed to that run.

### 4.2 Title and meta mechanics

- **`<title>` under ~60 characters**, unique per page, primary topic near the front.
- **Meta description under ~155 characters**, unique per page, accurately previewing what's on it. Not a ranking factor; a click-through factor.
- **One `<h1>` per page**, matching the page's actual subject.
- Heading nesting is logical for readers and assistive technology. Google does not rank on heading order — that's a myth-bust — but real users and screen readers benefit, and the structure helps extraction.

**Correction to `PRD.md` §29.3.** The proposed home title, `"YouTube Banner Maker — Free, No Sign-Up, Correct on Every Device"`, is 64 characters and will truncate in most SERP renderings. Replace with:

| Page | Title (≤60) | Meta description |
|---|---|---|
| `/` | `Free YouTube Banner Maker — Correct on Every Device` (51) | Free YouTube banner maker. Correct 2560×1440, safe-area aware, device preview, no account, no watermark. See what YouTube will cut before you upload. |
| `/guides/youtube-banner-size` | `YouTube Banner Size: 2560×1440, Safe Area & Device Crops` (56) | The correct YouTube banner size is 2560×1440 px (min 2048×1152), max 6 MB. Safe area 1235×338. See the real device crops and why your banner gets cut off. |

Remaining page titles and descriptions must be written to the same standard before launch and are an open item (§12).

### 4.3 The anti-stuffing budget

The phrase "youtube banner size" and its close variants will naturally want to appear everywhere on the size guide. **Hard limit: roughly one exact-match occurrence per 150 words of body copy.** Practically, on a 1,200-word guide that is around eight occurrences total across body text — the `<title>`, `<h1>`, and one or two subheads consume most of that budget before the body starts.

Write for the reader; use natural variants ("the correct dimensions," "how big a banner should be," "what YouTube actually crops"). If a paragraph reads as though it was written to contain a phrase, it was, and a Quality Rater will read it the same way.

### 4.4 Cannibalization control

Three tool pages and two guides address adjacent intents. Each must have a **distinct primary intent and distinct body copy** — `PRD.md` §29.12 already forbids shared tool text, and that rule is load-bearing. If two pages start ranking for the same query, one of them is redundant: merge them or sharpen the weaker one's intent. Do not let the maker page start competing with the size guide for informational queries.

---

## 5. Page-by-page SEO contract

Binding for every route. No page ships without every column satisfied.

| Page | Intent | Unique value (must be true, not claimed) | Schema | Indexable |
|---|---|---|---|---|
| `/` | Product | Honest crop + re-encode explainer above the fold | `SoftwareApplication`, `Organization` | Yes |
| `/tools/youtube-banner-resizer` | Fix | Subject-aware fit, no distortion | `SoftwareApplication` | Yes |
| `/tools/youtube-banner-maker` | Create | Geometry-safe templates + live device previews | `SoftwareApplication` | Yes |
| `/tools/youtube-banner-checker` | Validate | Per-device verdicts with one-click fix | `SoftwareApplication` | Yes |
| `/guides/youtube-banner-size` | Informational | Measured device-crop table + re-encode truth | `BreadcrumbList` | Yes |
| `/guides/youtube-banner-safe-area` | Informational | 1235×338 ≡ 1546×423 worked explicitly | `BreadcrumbList` | Yes |
| `/templates/<niche>` | Niche | ≥3 genuinely distinct templates + real descriptive copy | `BreadcrumbList` | Yes, **gated on ≥3 real templates** |
| Individual template pages | — | — | — | **No — not indexed in MVP** (thin duplicates) |
| `?template=…` deep links | — | — | — | **No — canonical to clean tool URL** |

---

## 6. Structured data

**Evidence tier:** Supported by Google for rich-result eligibility where that result type still exists; **Experimental** for any claim that schema increases AI-answer citations.
**Levers:** 1, 5 · **ICE:** Impact 5 / Confidence 6 / Ease 8 → **6.3**

Schema does not itself boost ranking position. It can improve click-through where it enables a real SERP feature, and it helps parsers understand the page. Treat it as supporting infrastructure, not a growth lever.

### 6.1 Types to implement

- **`SoftwareApplication`** on all three tool pages — `name`, `applicationCategory: DesignApplication`, `operatingSystem: Any`, and `offers` with `price: "0"`. This is accurate: the tool is genuinely free with no account.
- **`Organization`** on the home page — real, verifiable entity details only.
- **`BreadcrumbList`** on guides and template categories.
- **`ImageObject`** for template preview images, with real dimensions.

### 6.2 Two corrections to `PRD.md` §29.4

**`FAQPage` — do not implement on the promise of a rich result.** Google deprecated the FAQ rich result's visual snippet in Search as of May 2026. The expandable FAQ snippet that made this schema attractive no longer appears. The Q&A *content structure* on the size guide is still worth keeping — it's good for readers and plausibly helps AI extraction — but the schema markup should not be sold internally as a SERP win, and no roadmap item should depend on it.

**`Product` — do not implement on tool pages.** `PRD.md` §29.4 proposes `Product` *or* `SoftwareApplication`. Use `SoftwareApplication` only. `Product` schema on a free browser tool invites either an invalid markup warning or, worse, pressure to add an `AggregateRating` that does not correspond to real collected reviews. Fabricated rating markup is a spam-policy risk with real enforcement history, and there is no version of it that is worth the exposure.

### 6.3 Standing rules

- **Never** ship a schema field describing something not genuinely true on that specific page.
- Validate every block on every unique template before launch, and again after any template change.
- **Verify current rich-result eligibility against Google's own gallery before promising any specific visual outcome.** These deprecate and change; a promise made from a two-year-old blog post is a promise that will break.
- Tooling: `/seo schema <url>` for detection, validation, and generation.

---

## 7. Content quality and E-E-A-T

**Levers:** 2, 3

E-E-A-T is not itself a ranking factor — it is the framework Google's quality raters use to evaluate whether content demonstrates real knowledge. Building for it means building the substance it detects, not adding the signals that imitate it.

**What this site has that competitors don't:** the device-crop rectangles and the JPEG re-encode behavior are *measured*, from YouTube's own asset URLs and response headers. That is first-hand experience — the "E" in E-E-A-T — in its most literal form.

Rules:

1. **Publish the method, not just the number.** The size guide states how the crop rectangles were derived and at what date. A reader who can check the work is a reader who trusts the page; so is a Quality Rater.
2. **Date every spec claim.** YouTube changes its serving behavior. A guide asserting a crop fraction without a "verified as of" date will silently become wrong.
3. **Never promise "no quality loss."** YouTube re-encodes uploads server-side. Any page implying otherwise is stating something the project's own research disproves, and is the fastest available way to lose the trust the rest of the site is built on. This constraint already exists in `PRD.md`; it is an SEO constraint too.
4. **Named authorship.** A real named author with visible relevant experience is a stronger trust signal than a "Team" byline. Never invent credentials.
5. **No AI-slop prose.** Content that reads as machine-generated is both a helpfulness-signal risk and a hard failure for any future AdSense consideration. Run a humanization pass on anything generated or heavily edited.
6. **No filler.** Length is not a ranking factor. There is no minimum word count. Cut anything that doesn't add real coverage — a 900-word guide that answers the question fully beats a 2,400-word one padded to look authoritative.

Tooling: `/seo content <url>` for E-E-A-T and thin-content review.

---

## 8. AI answer engines (GEO/AEO)

**Evidence tier:** Consistent with Google · **Lever:** 5 · **ICE:** Impact 6 / Confidence 6 / Ease 8 → **6.7**

Google's own guidance on optimizing for generative AI features states plainly that the same fundamentals that earn strong traditional rankings feed AI Overviews too, and explicitly warns against creating fan-out variant pages to chase AI citations. Everything below is an editing discipline, not new content.

**Note:** As of May 15 2026, Google's spam policies explicitly cover attempts to manipulate AI Overviews and AI Mode on the same footing as classic ranking manipulation. Every tactic here is written to the "genuinely inform the reader" standard. If a proposal drifts toward optimizing for a citation rather than for a reader, it's out.

### 8.1 Structural practices

- **Answer first.** State the direct answer in the first sentence under each heading, before the supporting explanation. "A YouTube banner should be 2560×1440 pixels." Then the nuance.
- **Real questions as headings**, where they match genuine reader intent. Not keyword-stuffed fake questions.
- **Tables for comparative and enumerable content.** The per-device crop table is the single most extractable asset on the site — a search snippet, an AI answer, and a skimming human all parse it the same way.
- **Nothing important hidden behind interaction.** No closed accordions, no click-to-reveal tabs for primary content. Render it open in the HTML.
- **One clear claim per sentence** in citable sections. Compound, hedge-heavy sentences extract badly — and read badly.
- **Accuracy is non-negotiable here specifically**, because AI answer engines strip surrounding context and caveats when they lift a sentence. A sentence that is only true with its qualifier will be quoted without it.

### 8.2 `llms.txt` — the verdict

**Evidence tier:** Experimental, trending toward **Avoid-as-an-SEO-tactic**.

**Do not add `/llms.txt` expecting any SEO or AI-citation benefit.** Google's John Mueller has stated on the record that no AI system has confirmed using it, that server logs show major consumer AI chatbots don't check for it, and has compared it directly to the old meta keywords tag. Independent analysis across 137,000+ sites found AI bots essentially never request the file, and that most requests that do occur come from AI *coding agents*, not from search or citation pipelines. A separate study across roughly 300,000 domains found no statistically significant relationship between having the file and AI-answer citation frequency.

Its ICE score computes to a deceptively high **6.3** (Impact 2 / Confidence 8 / Ease 9) purely because it is cheap and harmless. Do not let that number promote it. **The real risk here is expectational** — promising anyone that this file moves AI visibility, when the best available evidence directly contradicts that.

This product has no public API and no developer-documentation audience, which is the one narrow case where the file has a genuine (non-SEO) use. **Recommendation: skip it.**

### 8.3 Measuring AI visibility

Search Console has no AI Overview breakout. The workable approach: maintain a list of 10–30 real creator questions, run them quarterly against ChatGPT, Perplexity, and Google AI Mode/Overviews by hand, and log which brands and URLs get cited. This is a **qualitative directional signal**. Do not report growth percentages against it — the sample size and manual process make precise trend claims unreliable.

**On vendor statistics:** this space is saturated with specific-sounding numbers from companies selling AEO/GEO services ("schema increases citations by X%"). These are almost never independently reproducible and are typically drawn from the vendor's own client base. Cite the underlying mechanism; never repeat the multiplier as if Google confirmed it.

Tooling: `/seo geo <url>` for AI crawler accessibility and passage-level citability.

---

## 9. Growth roadmap, ICE-ranked

Scores are re-derived for **this product at this stage** (pre-launch, solo/small team, no budget, no domain authority). Where a score differs from the playbook default, the adjustment is stated. Sorted by ICE, but where two items are within ~0.5 the ordering is a judgment call, not a ranking.

---

### 9.1 The free tool itself as the linkable asset — **ICE 7.7**

**Evidence tier:** Consistent with Google · **Levers:** 4, 2
**ICE:** Impact 8 / Confidence 7 / Ease 8 → **7.7**
*Ease raised from the playbook default of 5 to 8: the playbook assumes a company building a free tool as a marketing side-project. Here the tool **is** the product. The marginal cost of making it link-worthy is zero.*

**Expected impact:** High and compounding. A genuinely useful free tool keeps earning links for years with no ongoing outreach, because bloggers and educators cite it as a utility rather than as marketing.
**Effort:** Already in the build plan. The SEO-specific requirements are constraints on the build, not extra work.
**Supporting evidence:** Widely and consistently identified as one of the highest-ROI link-building investments available without a PR budget. Specific backlink counts cited for individual tools are self-reported by the companies that built them — illustrative, not a benchmark to promise.
**Confidence:** High on the mechanism, medium on magnitude.
**Risks:** A tool built and never promoted sits unused. Some initial community sharing is needed to get the first wave of links, after which it can compound. **Any signup wall, email gate, watermark, or download counter kills most of the link-earning effect** — these are already forbidden in `PRD.md` §35, and this is a second independent reason to keep them forbidden.
**YMYL:** N/A.
**Why:** The clearest available example of earning authority rather than manufacturing it.

---

### 9.2 Topical cluster around size, safe area, and crop — **ICE 7.0**

**Evidence tier:** Consistent with Google · **Levers:** 2, 5
**ICE:** Impact 7 / Confidence 7 / Ease 7 → **7.0**
*All three raised from the playbook defaults of 6/6/6: the cluster here is unusually small and unusually well-defined — roughly 6–10 pages covering a topic with a precise, checkable answer. Most cluster strategies are open-ended content calendars; this one has a finish line.*

**Expected impact:** Medium-to-high, compounding. Value accrues as the cluster fills in and internal links mature, not from any single page.
**Effort:** Medium, but bounded — this is not a permanent content treadmill.
**Supporting evidence:** The mechanism (internal linking helps Google understand site structure and topical depth) is well-established in Google's own site-organization documentation. Any specific multiplier claim about clustered content — "3.2× more AI citations" and similar — is vendor marketing, not Google, and must be flagged as such if anyone cites it.
**Confidence:** High on the structural principle, low on any specific figure.
**Risks:** Building cluster pages around topics with no real product connection dilutes site-wide helpfulness signals. Every page must anchor to something the tool genuinely helps with. Do not pad the cluster to hit a page count.
**YMYL:** N/A.

---

### 9.3 Original-research digital PR: the device-crop measurement — **ICE 6.3**

**Evidence tier:** Consistent with Google · **Lever:** 4
**ICE:** Impact 7 / Confidence 6 / Ease 6 → **6.3**
*Ease raised from 4 to 6 because the data already exists — the crop rectangles were measured during product research. Impact lowered from 8 to 7 because the audience (creator-tooling bloggers, YouTube-education channels) is narrower than a mainstream PR target.*

**Expected impact:** High per successful placement. Journalists and bloggers need a citable number, not another opinion piece — and "here are the exact rectangles YouTube crops on each device, and here's how we measured them" is a citable number that currently doesn't exist in public.
**Effort:** Medium. The measurement is done; the work is writing it up rigorously and doing real outreach.
**Confidence:** Medium-high on the mechanism. The playbook cautions against recommending digital PR to a pre-launch product with no usage data — that caution is *partially* lifted here because the asset is measurement-based rather than usage-based, and does not require a customer base to exist.
**Risks:** Cherry-picked or overstated numbers boomerang badly. Hold the same accuracy bar for an outreach stat as for any published claim, and state the measurement date and method every time. If YouTube changes its serving behavior, correct the published research rather than quietly leaving it up.
**YMYL:** N/A.

---

### 9.4 Community-led distribution in creator communities — **ICE 5.7**

**Evidence tier:** Consistent with Google **only** as genuine participation; **Avoid** the moment the primary activity becomes self-promotion or link-dropping.
**Levers:** 2 (indirect — branded search and organic mentions), 5 (Reddit and forum threads are retrieved heavily by AI answer engines)
**ICE:** Impact 5 / Confidence 6 / Ease 6 → **5.7** (playbook default retained)

**Expected impact:** Medium, highly variable. A single well-received launch post can produce a real traffic spike; sustained genuine participation builds slower but more durably.
**Effort:** Low per interaction, but requires authentic sustained time. Cannot be batched or automated without immediately becoming the spam pattern to avoid.
**Supporting evidence:** Repeatedly identified as a core organic channel for solo and small-team founders, precisely because it needs no ad budget. This project has a specific advantage: the product research already catalogued real, specific complaints from creator communities about banner cropping. Answering those questions *usefully*, without a pitch, is participation rather than promotion.
**Risks — read these before posting anything.** Every one of these communities has low tolerance for self-promotion, and being flagged as a spammer in one follows a founder into others. **Never post the same pitch verbatim across multiple communities in a short window** — that pattern is exactly what moderators and spam filters are tuned to catch. Read and follow each subreddit's self-promotion rules specifically. The bar: would this comment be worth posting if the tool didn't exist?
**YMYL:** N/A, though casual claims in community posts still need to be accurate — a careless comment gets screenshotted.

---

### 9.5 Comparison pages against named competitors — **ICE 6.0**

**Evidence tier:** Consistent with Google · **Levers:** 2, 4
**ICE:** Impact 5 / Confidence 6 / Ease 7 → **6.0**
*Lowered substantially from the playbook default of 7.7 (Impact 8 / Confidence 8). The default assumes a B2B SaaS with named competitors that prospects actively evaluate against. Here the "competitors" are Canva, Adobe Express, and Kapwing — general-purpose design platforms with enormous domain authority. Someone searching "Canva alternative" is almost never looking for a YouTube-banner-specific tool, so the intent match that makes this tactic powerful is largely absent.*

**Where it still works:** narrow, honest, verifiable free-tier comparisons. The project's research verified specific, checkable facts — Snappa's free plan limits downloads per month and requires an account; VistaCreate gates its resizer and HD download behind a paid tier. A page that lays out *what each free tier actually permits for a YouTube banner*, accurately and with a "verified as of" date, is genuinely useful to someone deciding where to spend an hour.

**Hard constraints:**
- **Maximum three such pages.** More is padding.
- **Only competitors whose free-tier limits have been verified first-hand.** Canva is explicitly excluded — the project's research could not access Canva's pages, and no claim about Canva may be published as fact.
- **The competitor must win at least one honest row.** A comparison where the competitor never wins anything reads as rigged, damages trust immediately, and gets called out publicly — often in the competitor's own community.
- **Pricing and limits must be kept current.** Stale pricing on a comparison page is a fast trust-killer, and these change without notice.

**Risks:** Beyond the above — publishing an inaccurate claim about a competitor's product is a reputational and potentially legal exposure, not just an SEO mistake.
**YMYL:** N/A.

---

### 9.6 Unlinked brand-mention reclamation — **ICE 6.7, deferred**

**Evidence tier:** Supported by Google · **Lever:** 4
**ICE:** Impact 4 / Confidence 8 / Ease 8 → **6.7**

Asking a site to complete a citation it already chose to make is requesting accurate attribution, not link manipulation — one of the highest response rates of any outreach type, at near-zero effort and near-zero risk. **But there is nothing to reclaim before the brand is mentioned anywhere.** Revisit roughly 3 months post-launch, once mentions exist. Listed here so it isn't forgotten, not because it's actionable now.

---

### 9.7 Programmatic SEO — **ICE 5.0, gated**

**Evidence tier:** Consistent with Google **only** when each page carries genuinely distinct underlying data; **Avoid** the moment pages differ only by a swapped variable.
**Levers:** 1, 2
**ICE:** Impact 8 / Confidence 3 / Ease 4 → **5.0**
*Confidence lowered from the playbook default of 5 to 3. This product has no obvious source of genuinely distinct per-page data. Niche template categories are the only candidate, and they are content-gated rather than data-gated.*

**This is the tactic most likely to trip Google's scaled-content-abuse policy**, and the temptation is structural: once the template exists, each additional page costs nothing. A well-documented indie-hacker case exists of 100,000+ generated pages largely failing to get indexed at all.

**The gate, applied per template before any generation:** *for each page, can you honestly say what is specifically true on this page and not true on the template's other pages?* If the honest answer is "the variable in the title," don't build it.

Applied here: `/templates/gaming` passes only if it holds at least three genuinely distinct, hand-designed templates with real descriptive copy. `PRD.md` §29.9 and §29.12 already encode this. Individual per-template pages fail the gate outright and stay out of the index in MVP.

**If it is ever attempted at scale:** pilot 20–50 pages, confirm indexation and real engagement, and only then consider more. Never generate first and check later.

---

### 9.8 Guest posting — **ICE 3.7, do not pursue**

**Evidence tier:** Consistent with Google only for genuinely relevant, editorially-reviewed placements with natural anchors; **Avoid** for anything volume-driven, exact-match-anchored, or purchased.
**ICE:** Impact 4 / Confidence 4 / Ease 3 → **3.7**

Mass and low-quality guest posting for links has been an explicit Google spam target for over a decade, and the effort-to-risk ratio is worse today than it was five years ago. Any arrangement where money or product access changes hands specifically for the link falls under Google's link-spam policies regardless of how the content reads. Ranked below every other tactic in this file. Skip it.

---

## 10. Per-page pre-publish checklist

Run for every page before it goes live. Do not skip items because a page "obviously" passes — the value of a checklist is catching the thing that seemed obvious and wasn't.

**Content and UX**
- [ ] Would someone who typed the target query feel they got what they needed, or would they go back and search again?
- [ ] Does this page say something the top 3 ranking pages don't already say equally well? If not, what is the actual reason to publish it?
- [ ] Is every factual claim traceable to a real source, and is that source current?
- [ ] Every spec claim carries a "verified as of" date.
- [ ] For comparison pages: does the competitor win at least one honest row?
- [ ] No filler sections added to hit a word count.
- [ ] No phrase implying YouTube preserves upload quality.

**Technical**
- [ ] Unique `<title>` under ~60 characters, primary topic near the front.
- [ ] Unique meta description under ~155 characters, accurately previewing the page.
- [ ] Self-referential canonical set explicitly.
- [ ] Primary content confirmed present in `view-source:`, not injected by JS.
- [ ] Descriptive URL slug — words a person would recognize.
- [ ] 1–2 inbound internal links from existing pages; 2–3 outbound internal links from this page.
- [ ] Exact-match phrase density within the ~1-per-150-words budget.

**Accessibility**
- [ ] Heading structure logically nested.
- [ ] All meaningful images have descriptive alt text reflecting their actual relationship to the content — not keyword-stuffed, not `image1.png`.
- [ ] Sufficient color contrast on custom-styled text and buttons (see `DESIGN.md` — body text ≥4.5:1, including placeholder text).
- [ ] Interactive elements keyboard-navigable; nothing discoverable hidden inside an unopened accordion.

**Performance**
- [ ] Images compressed and sized for their display dimensions; `width`/`height` set to prevent CLS.
- [ ] No layout shift from late-loading fonts.
- [ ] Page doesn't need a heavy JS bundle to show static content.
- [ ] "Fix if clearly bad," not "chase a perfect score."

**Structured data and metadata**
- [ ] Every schema field is genuinely true on this specific page.
- [ ] No fabricated ratings, review counts, or author credentials.
- [ ] Open Graph and `twitter:card` tags set; preview renders correctly when shared.
- [ ] No leftover `noindex` from staging.
- [ ] `robots.txt` doesn't block this page or its assets.

**Mobile**
- [ ] Mobile rendering verified specifically for the tool island and device-preview strip.

**The Quality Rater gate**
- [ ] If a Google Search Quality Rater read this exact page, what would they flag? If the honest answer is "the thin content," "the rigged comparison," or "the templated feel," fix it before publishing.

---

## 11. Launch gate

Before declaring the site SEO-ready:

- [ ] Every Critical item in §2 resolved **with evidence**, not marked done.
- [ ] Every Search Essentials category checked, not assumed clean.
- [ ] Sitemap fetched fresh and cross-checked against live routes **one final time** — things drift during the fixing process, so the last check must be genuinely last.
- [ ] Every schema block validated one final time across every unique template.
- [ ] A representative page from every unique template tested on both mobile and desktop.
- [ ] Every page has passed §10 individually.

Then issue one explicit verdict — never as a courtesy:
- `SEO FOUNDATION COMPLETE — no further structural SEO work identified, with evidence for each item`, or
- `OPEN ITEMS REMAIN: [specific, prioritized list]`

**If there is genuine uncertainty about whether something is clean, it isn't.** Mark it open and state exactly what would close it.

**What a clean verdict does and does not mean.** `SEO FOUNDATION COMPLETE` means every controllable, documented factor has been checked and addressed with evidence. It does **not** mean a guaranteed ranking outcome, and must never be phrased as implying one.

---

## 12. Post-launch monitoring

| Action | Tool | Cadence | Why |
|---|---|---|---|
| Submit sitemap | Google Search Console | At launch | Confirms Google has a current map rather than relying on organic discovery |
| Request indexing on key pages | GSC URL Inspection | At launch, and after any major page change | Speeds initial indexing of the pages that matter most |
| Monitor Coverage/Indexing report | Google Search Console | Weekly for month 1, monthly after | Catches crawl errors, unexpected `noindex`, sitemap drift early |
| Re-check Core Web Vitals | PageSpeed Insights / GSC field data | Monthly, and after any significant frontend change | Field data accumulates slowly and can diverge from lab data |
| Refresh underperforming pages from real query data | Google Search Console | Ongoing, once impressions exist | **Highest-value ongoing activity.** Look for queries already generating impressions with low clicks or poor position — that's validated real demand Google already associates with the page. Adding a matching heading or section beats guessing at new content ideas from scratch. |
| Re-verify the device-crop rectangles against live YouTube | Manual, the project's own method | Quarterly | The site's core differentiator is a measurement. If YouTube changes serving behavior and the guide doesn't, the trust asset becomes a liability. |
| Check AI answer-engine citations | Manual, 10–30 real questions | Quarterly | Newer, faster-moving signal than traditional rankings; qualitative only |
| Re-run this document end to end | This file | After any major content, template, or IA change | A one-time pass goes stale the moment the site changes meaningfully |

**Tooling map (`.agents/plugins/claude-seo`):**

| Phase | Command |
|---|---|
| Runtime readiness | `/seo doctor` |
| Pre-launch technical gate (§2) | `/seo technical <url>` |
| Full site audit | `/seo audit <url>` |
| Single page deep check | `/seo page <url>` |
| Schema validation (§6) | `/seo schema <url>` |
| Sitemap validation (§2) | `/seo sitemap <url>` |
| E-E-A-T / thin content (§7) | `/seo content <url>` |
| AI-search readiness (§8) | `/seo geo <url>` |
| Cluster verification (§4.1) | `/seo cluster <seed>` |
| Image optimization | `/seo images <url>` |
| Regression detection after changes | `/seo drift baseline` then `/seo drift compare <url>` |
| Google field data (once GSC verified) | `/seo google <command> <url>` |
| Phase 2 France (`/fr/`) | `/seo hreflang <url>` |

---

## 13. Banned tactics — Avoid, no exceptions

| Tactic | Why |
|---|---|
| Buying links, PBNs, reciprocal link schemes | Named Google link-spam policies. No exception for "everyone does it." |
| Undisclosed sponsored content presented as editorial | Link-spam policy; also a disclosure failure |
| Mass or purchased guest posting | Explicit Google spam target for over a decade; ICE 3.7 even done well |
| Generating template pages that differ only by a swapped keyword | Scaled content abuse — Google's own named example |
| Indexing individual template pages in MVP | Thin near-duplicates; same policy risk at smaller scale |
| Fabricated `AggregateRating`, review counts, or author credentials | Spam-policy risk with real enforcement history |
| Keyword stuffing beyond ~1 exact match per 150 words | Search Essentials violation category |
| Adding `/llms.txt` and telling anyone it helps AI visibility | Best available evidence directly contradicts it (§8.2) |
| Any claim that the site "will rank" for anything | Nobody can honestly produce that number (§0) |
| Any claim of "no quality loss" on upload | The project's own research disproves it |
| Optimizing copy for AI-citation rather than for the reader | Covered by Google's spam policies as of May 15 2026 |
| Weakening privacy, legal, or accuracy disclosures for SEO reasons | Never trade trust content for search gain |

---

## 14. Corrections applied to `PRD.md`

Flagged rather than silently changed, so the PRD's author can decide:

1. **§29.3 — home page title is 64 characters** and will truncate. Replacement proposed in §4.2 above (51 characters).
2. **§29.4 — `FAQPage` schema.** Google deprecated the FAQ rich result's visual snippet in Search as of May 2026. Keep the Q&A content structure; do not implement the schema on the promise of a rich result, and do not carry it as a roadmap win.
3. **§29.4 — `Product` schema on tool pages.** Use `SoftwareApplication` only. `Product` on a free browser tool invites invalid markup or pressure toward fabricated rating data.
4. **§29.13 — Core Web Vitals figures** (LCP < 0.8s, CLS < 0.1, INP < 200ms) are engineering targets. No CWV number may be reported as achieved until real field data exists.

---

## 15. Verdict

**OPEN ITEMS REMAIN.** This is a pre-launch project with no live URL. Nothing here has been verified against a real crawl, real Search Console data, or a real SERP, and no clean verdict can honestly be issued for a site that does not yet exist.

Prioritized open items, in the order they must be closed:

**Blocking — cannot launch without:**
1. Every item in §2 (pre-launch indexing gate) verified against the deployed build, with evidence.
2. `robots.txt`, sitemap, and canonical configuration confirmed on the live Cloudflare Pages deployment — including trailing-slash normalization and `noindex` on all preview deployments.
3. Every JSON-LD block validated on every unique template.
4. Titles and meta descriptions written to §4.2 standard for all seven routes; only two are drafted.

**High — close before or immediately after launch:**
5. Search Console property verified and sitemap submitted.
6. The size guide's device-crop table published **with its measurement method and verification date**. This is the site's entire trust and link-earning thesis.
7. Cluster keyword assumptions in §4.1 verified against real SERP or volume data (`/seo cluster`, or a live keyword tool). Currently directional only.
8. `/templates/<niche>` pages held out of the sitemap until each has ≥3 genuinely distinct templates.

**Medium — first 90 days:**
9. Free-tier comparison pages (max three, verified competitors only, competitor wins a row).
10. Original-research write-up of the crop measurement, plus outreach.
11. Community participation begun on the terms in §9.4 — genuine answers first, tool mention incidental.

**Deferred until data exists:**
12. Unlinked mention reclamation (~month 3).
13. Query-data-driven page refreshes (once impressions accumulate).
14. Quarterly AI-citation check and quarterly crop re-verification.
15. `/fr/` localization — gated on US validation and a French SERP check, per `PRD.md` §30.2.

**Explicitly out of scope, decided:** `llms.txt`, guest posting, programmatic page generation beyond gated template categories, and any tactic in §13.
