# Banner research sources and notes

## Scope

This source note supports `BANNER_COMPETITIVE_RESEARCH.md`. The review covers the local repository and official competitor pages checked in September 2026. Pricing, plan names, and feature gates can change by region or billing cycle.

## Local repository sources

- `PRD.md`
- `ARCHITECTURE.md`
- `IMPLEMENTATION.md`
- `SEO.md`
- `src/lib/spec.ts`
- `src/lib/scene.ts`
- `src/lib/render.ts`
- `src/lib/validate.ts`
- `src/lib/simulate.ts`
- `src/lib/export.ts`
- `src/lib/analytics.ts`
- `src/components/ToolShell.astro`
- `src/components/MakeControls.astro`
- `src/islands/tool.ts`
- `src/data/templates/index.ts`
- `src/data/backgrounds.ts`

## Competitor pages

| Company | Page | Evidence used |
|---|---|---|
| YouTube | [Manage channel branding](https://support.google.com/youtube/answer/2657964) | Official channel-art dimensions and upload guidance |
| Canva | [YouTube banner maker](https://www.canva.com/create/youtube-banners/), [pricing](https://www.canva.com/pricing/) | Template-led workflow, broad design suite, free/paid product model |
| Adobe Express | [YouTube banner workflow](https://www.adobe.com/express/create/banner/youtube), [pricing](https://www.adobe.com/express/pricing) | Template/editor workflow, broader Adobe/AI ecosystem, free/premium model |
| Fotor | [Pricing](https://www.fotor.com/pricing/), [YouTube banner route](https://www.fotor.com/design/youtube-banner) | General design/AI competition; route availability caution |
| Snappa | [YouTube channel art](https://snappa.com/create/youtube-channel-art), [pricing](https://snappa.com/pricing) | Preset canvas, templates, stock assets, safe zones, free download limit, paid tiers |
| Placeit | [YouTube banner maker](https://placeit.net/youtube-banner-maker) | Template-first positioning and quick customization |
| Visme | [YouTube banner maker](https://www.visme.co/youtube-banner-maker/) | Free entry, broader brand/content platform |
| CollabPals | [YouTube banner maker](https://www.collabpals.com/tools/youtube-banner-maker) | 2560 × 1440, four device previews, 12 presets, no signup, free PNG, browser-side workflow |
| YTpals | [YouTube banner maker](https://www.ytpals.com/tools/youtube-banner-maker-free) | Beginner-first copy, 12 presets, safe-zone overlay, four device previews, no signup, free PNG |

## Verification commands run

```text
npm test
node scripts/check-copy.mjs
npx astro check
npm run build
node scripts/check-budgets.mjs
```

All commands passed during the review.

